const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 1200;
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');

const dbConfig = require('./config/database.config');
const mqttConfig = require('./config/mqtt.config');
const mqttService = require('./services/mqttService');
const deviceService = require('./services/deviceService');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  exposedHeaders: ['XMLHttpRequest'],
}));

mongoose.Promise = global.Promise;
const devicesToSubscribe = [];

const client = mqtt.connect('mqtt://m24.cloudmqtt.com', mqttConfig);

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
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

client.on('message', (topic, message) => {
  console.log(`${topic} ${message}`);
  const stringMessage = message.toString();
  if (devicesToSubscribe.includes(topic)) {
    if (stringMessage.split('/')[1] === 'connected' || stringMessage.split('/')[1] === 'reconnected') {
      mqttService.connectedHandler(topic).then((id) => {
        client.publish(`${topic}_callback`, id.toString());
        io.sockets.emit(`${topic}`, stringMessage);
      });
    } else {
      mqttService.handlePacket(message, topic).then((res) => {
        console.log('PO HANDLE PACKET', String(res.payload));
        io.sockets.emit(`${topic}`, String(res.payload));
      });
    }
  }
});

require('./routes/series.route')(app);
require('./routes/device.route')(app);
require('./routes/user.route')(app);
require('./routes/mqtt.route')(app);
require('./routes/slackapp')(app);
