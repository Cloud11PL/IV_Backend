const request = require('request');

const Device = require('../models/device.model');

const SLACK_TOKEN = require('../secretSlackKey');

exports.getDevices = (req, res) => {
  console.log(req.body);
  Device.find({}, (err, devices) => {
    const devicesNames = devices.map(device => ({
      color: 'good',
      text: device.Device_Name,
      fields: {
        title: device.Device_Name,
        value: 'Ok',
        short: 'false',
      },
    }));

    const data = {
      form: {
        token: SLACK_TOKEN,
        channel: '#general',
        text: 'Here are the devices',
        attachments: JSON.stringify(devicesNames),
      },
    };


    // eslint-disable-next-line no-unused-vars
    request.post('https://slack.com/api/chat.postMessage', data, (error, response, body) => {
      if (error) {
        console.log(error);
      }
      res.json();
    });
  });
};
