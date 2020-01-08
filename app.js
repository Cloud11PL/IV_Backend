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

const inputmodel = require('./models/singleInput.model');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  exposedHeaders: ['XMLHttpRequest'],
}));

mongoose.Promise = global.Promise;
const devicesToSubscribe = [];
const timeout = 30 * 1000;

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

  // inputmodel.find({
  //   seriesId: { $gt: 4 },
  // })(res => console.log(res));
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

client.on('message', (topic, message) => {
  console.log(`${topic} ${message}`);
  const stringMessage = message.toString();
  const tempSeries = {};
  if (!currentSeries[topic]) {
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
        const currentTempSeries = currentSeries[topic];
        currentTempSeries.current = Number(res.payload);
        if (!currentTempSeries.wasMaxSet) {
          currentTempSeries.max = Number(res.payload) * 1.02; // Dodanie 2% do początkowej masy bo trochę wzrasta...
          currentTempSeries.criticalLevel = mqttService.getCriticalValue(Number(res.payload));
          currentTempSeries.wasMaxSet = true;
          console.log(`SET MAX ${currentTempSeries.max}`);
        }
        if (currentTempSeries.max < Number(res.payload)) {
          currentTempSeries.max = Number(res.payload) * 1.02; // Update MAX
          currentTempSeries.criticalLevel = mqttService.getCriticalValue(Number(res.payload)); // Update critical value;
          console.log(`MAX WAS UPDATED ${currentTempSeries.max}`);
        }
        if (res.payload < currentTempSeries.criticalLevel
          && currentTempSeries.wasNotificationSent === false) {
          console.log('DANGER ZONE BAGIETY JADO');
          currentTempSeries.wasNotificationSent = true;
          slackSerivce.sendLowLevelAlert(topic); // Send Slack notification
        }
        currentSeries[topic] = currentTempSeries;
        console.log(currentSeries[topic]);
        io.sockets.emit(`${topic}`, currentTempSeries);
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
              slackSerivce.deviceDisconnected(topic); // Send slack notification !!
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
require('./routes/bagType.route')(app);
