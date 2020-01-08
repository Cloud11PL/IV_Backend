const request = require('request');

const { WebClient } = require('@slack/web-api');
const Device = require('../models/device.model');
const Series = require('../models/series.model');

const SLACK_TOKEN = require('../secretSlackKey');

const web = new WebClient(SLACK_TOKEN);

exports.getDevices = (req, res) => {
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

exports.showActiveDevices = async () => {
  const activeDevices = await Device.find({
    Active: true,
  });

  const lastSeries = await activeDevices.forEach((device) => {
    Series.findOne({
      Device_Id: device._id,
    });
  });
  let index = 0;
  const blocks = lastSeries.forEach((series) => {
    index += 1;
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Device ${activeDevices[index - 1].Device_Name} with level at TODO ${series.SeriesId}`,
      },
    };
  });

  web.chat.postMessage({
    channel: '#general',
    text: 'Active devices',
    blocks: [
      blocks(),
    ],
  });
};

exports.sendLowLevelAlert = async (deviceName) => {
  const deviceData = await Device.find({
    mqttName: deviceName,
  });

  web.chat.postMessage({
    channel: '#general',
    text: `<!here> Low level at device ${deviceData[0].Device_Name}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `⚠ Low level at device ${deviceData[0].Device_Name} ⚠`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Device name:* ${deviceData[0].Device_Name}\n*Device ID*: ${deviceName}\n*Location*: Bed ${deviceData[0].Location}`,
        },
      },
    ],
  });
};

exports.deviceDisconnected = async (deviceName) => {
  const deviceData = await Device.find({
    mqttName: deviceName,
  });

  web.chat.postMessage({
    channel: '#general',
    text: 'Device was disconnected',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '⚠️ Device has been disconnected. 🤷‍♀️',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Device name:* ${deviceData[0].Device_Name}\n*Device ID*: ${deviceName}\n*Location*: Bed ${deviceData[0].Location}`,
        },
      },
    ],
  });
};
