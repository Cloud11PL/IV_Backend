const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 1200;
const mongoose = require('mongoose');
const mqtt = require('mqtt');
const io = require('socket.io');

const dbConfig = require('./config/database.config');
const mqttConfig = require('./config/mqtt.config');
const mqttController = require('./controllers/mqtt.controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;
const subscribedDevices = [];

mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected!');
  mqttController.listDevices().then((devices) => {
    console.log(devices);
  });
}).catch((err) => {
  console.log(err);
  process.exit();
});


const client = mqtt.connect('mqtt://m24.cloudmqtt.com', mqttConfig);

client.subscribe('device');

client.on('message', (topic, message, packet) => {
  console.log(`${topic} ${message}`);
  console.log(packet);

  // mqttController.handlePacket([topic, message]);
  // io.sockets.emit('mqtt', String(message));
});

require('./routes/user.route')(app);
require('./routes/mqtt.route')(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// app.get('/', (req, res) => {
//   res.json({ message: 'xDDDDDDDDDDDDDDDDDDDDD ELO MORDO' });
// });
