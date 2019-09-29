const device = require('../controllers/device.controller');

module.exports = (app) => {
  app.post('/devices', device.create);
  app.get('/devices', device.findAll);
  app.put('/devices', device.update);
  app.get('/devices/:deviceID', device.findOne);
  app.delete('/users/:userId', device.delete);
};
