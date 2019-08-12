const mqtt = require('../controllers/mqtt.controller');

module.exports = (app) => {
  app.post('/mqtt', mqtt.createDevice);

  app.get('/mqtt', mqtt.getDevices);
};
