const user = require('../controllers/user.controller');

module.exports = (app) => {
  app.post('/authenticate', user.authenticate);
  app.post('/authToken', user.authToken);
  app.post('/users', user.create);
  app.get('/users', user.findAll);
  app.get('/users/:userId', user.findOne);
  app.delete('/users/:userId', user.delete);
};
