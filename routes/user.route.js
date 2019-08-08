const user = require('../controllers/user.controller');

module.exports = (app) => {
  app.post('/users', user.create);
  app.get('/users', user.findAll);
  app.get('/users/:userId', user.findOne);
  app.delete('/users/:userId', user.delete);
};
