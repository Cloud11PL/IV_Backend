const slackService = require('../services/slackService');

module.exports = (app) => {
  app.post('/getDevices', slackService.getDevices);
};
