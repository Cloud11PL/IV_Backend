const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 1200;
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const cors = require('cors');

const dbConfig = require('./config/database.config');
const mqttConfig = require('./config/mqtt.config');
const mqttController = require('./controllers/mqtt.controller');
const seriesController = require('./controllers/series.controller');
const deviceController = require('./controllers/device.controller');
const Series = require('./models/series.model');
const SingleInput = require('./models/singleInput.model');

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

  mqttController.listDevices.then((devices) => {
    devices.map((device) => {
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

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Websocket connected');

  socket.on('join', (data) => {
    console.log(`on Join ${data}`);
  });
});

client.on('message', (topic, message, packet) => {
  console.log(`${topic} ${message}`);
  console.log(packet);

  const stringMessage = message.toString();

  if (devicesToSubscribe.includes(topic)) {
    console.log(topic);
    console.log(message.toString());

    if (stringMessage === 'connected' || stringMessage === 'reconnected') {
      mqttController.connectedHandler(topic).then((id) => {
        client.publish(`${topic}`, id.toString());
      });
      // .then(() => {
      //     console.log('FINAL ID');
      //     console.log(finalId.toString());
      //     client.publish(`${topic}`, finalId.toString());
      // });
      // client.publish(`${topic}`;
      // const series = seriesController.findAllSeries(topic);
      // if (series.length === 0) {
      //   console.log(series);
      //   console.log('No series for the device');

      //   seriesController.create();
      // }
      // client.publish(`${topic}_callback`)
    } else {
      const newPayload = stringMessage.split('/');

      const singleInput = new SingleInput({
        payload: newPayload[1],
        seriesId: newPayload[0],
        mqttName: topic,
      });

      singleInput.save().then((res) => {
        console.log(res);
      });
    }
  }


  io.sockets.emit(`${topic}`, String(message));
  // mqttController.handlePacket([topic, message]);
  // io.sockets.emit('mqtt', String(message));
});

require('./routes/user.route')(app);
require('./routes/mqtt.route')(app);
