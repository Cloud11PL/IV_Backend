const bagTypes = require('../controllers/bagType.controller');

module.exports = (app) => {
  app.get('/bagTypes', bagTypes.findAll);
  app.post('/bagTypes', bagTypes.create);
};
