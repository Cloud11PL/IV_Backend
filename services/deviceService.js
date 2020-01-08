const Device = require('../models/device.model');

exports.findDeviceId = mqttName => new Promise((resolve, reject) => {
  Device
    .findOne({
      mqttName,
    }, (err, device) => {
      if (err) {
        reject(err);
      }
      resolve(device._id);
    });
});

exports.listDevices = new Promise((resolve, reject) => {
  console.log('Listing all devices...');
  Device.find({}, (err, devices) => {
    if (err) {
      reject(err);
    }
    resolve(devices);
  });
});
