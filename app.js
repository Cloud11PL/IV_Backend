const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 1200;
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');

const dbConfig = require('./config/database.config');
const mqttConfig = require('./config/mqtt.config');
const mqttService = require('./services/mqttService');
const deviceService = require('./services/deviceService');
const slackSerivce = require('./services/slackService');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  exposedHeaders: ['XMLHttpRequest'],
}));

mongoose.Promise = global.Promise;
const devicesToSubscribe = [];
const timeout = 10 * 1000;

const client = mqtt.connect('mqtt://m24.cloudmqtt.com', mqttConfig);

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected!');

  deviceService.listDevices.then((devices) => {
    devices.forEach((device) => {
      devicesToSubscribe.push(device.mqttName);
      client.subscribe(`${device.mqttName}`);
      console.log(`Subscribed to ${device.mqttName}`);
    });
  });
}).catch((err) => {
  console.log(err);
  process.exit();
});

client.subscribe('device');

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// eslint-disable-next-line import/order
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Websocket connected');

  socket.on('join', (data) => {
    console.log(`on Join ${data}`);
  });
});

const objectWithTimeouts = {};
const currentSeries = {};

/*
{
  deviceID: XD,
  seriesID: 01,
  baseline: 130,
  max: ??,
  dangerZone: max-130*10%,
  wasNotificationSent: false,
  wasMaxSet: false
}
*/

client.on('message', (topic, message) => {
  console.log(`${topic} ${message}`);
  const stringMessage = message.toString();
  const tempSeries = {};
  if (!currentSeries[topic]) {
    tempSeries.baseLine = 130; // DO ZMIANY KIEDYS
    tempSeries.wasNotificationSent = false;
    tempSeries.wasMaxSet = false;
  }
  if (devicesToSubscribe.includes(topic)) {
    // Device connection was lost ond got connected again

    if (stringMessage.split('/')[1] === 'reconnected') {
      io.sockets.emit(`${topic}`, 'Reconnected');
      // Device connects for the first time in a session
    } else if (stringMessage.split('/')[1] === 'started') {
      mqttService.connectedHandler(topic).then((id) => {
        tempSeries.deviceID = topic;
        tempSeries.seriesID = id;
        client.publish(`${topic}_callback`, id.toString());
        io.sockets.emit(`${topic}`, 'Connected');
        currentSeries[topic] = tempSeries;
      });
    } else {
      // Device broadcasts normally
      mqttService.handlePacket(message, topic).then((res) => {
        console.log('Payload from packet =>', String(res.payload));
        io.sockets.emit(`${topic}`, String(res.payload));
        const currentTempSeries = currentSeries[topic];
        if (!currentTempSeries.wasMaxSet) {
          currentTempSeries.max = res.payload;
          currentTempSeries.dangerZone = (currentTempSeries.baseLine - res.payload) * 0.1;
          currentTempSeries.wasMaxSet = true;
        }
        if (res.payload < currentTempSeries.max
          && currentTempSeries.wasNotificationSent === false) {
          console.log('DANGER ZONE BAGIETY JADO');
          // Send Slack notification
          currentTempSeries.wasNotificationSent = true;
          slackSerivce.sendLowLevelAlert(topic);
        }
        currentSeries[topic] = currentTempSeries;
        console.log(currentSeries[topic]);
        if (objectWithTimeouts[topic]) {
          clearTimeout(objectWithTimeouts[topic]);
        }
        objectWithTimeouts[topic] = setTimeout(() => {
          mqttService
            .setDeviceActiveStatus(topic, false)
            .then((device) => {
              mqttService.setSeriesStatus(device._id, true);
              console.log('Sending disconnected...');
              io.sockets.emit(`${topic}`, 'Disconnected');
              // Send slack notification !!
              slackSerivce.deviceDisconnected(topic);
            });
        }, timeout);
      });
    }
  }
});


require('./routes/series.route')(app);
require('./routes/device.route')(app);
require('./routes/user.route')(app);
require('./routes/mqtt.route')(app);
require('./routes/patient.route')(app);
require('./routes/slackapp')(app);
