const Device = require('../models/device.model');
const Series = require('../models/series.model');

exports.createDevice = (req, res) => {
  if (req.body.mqttName) {
    const device = new Device({
      mqttName: req.body.mqttName,
      Device_Name: req.body.Device_Name ? req.body.Device_Name : undefined,
      Location: req.body.Location ? req.body.Location : undefined,
    });
    device.save().then((data) => {
      res.send(data);
    }).catch(err => res.send(err));
  } else {
    res.status(500).send('Error');
  }
};

exports.getDevices = (req, res) => {
  Device.find({}, (err, devices) => {
    const devicesNames = [];
    // devices.map((device) => {
    //   devicesNames.push(device.mqttName);
    // });
    devices.forEach(device => devicesNames.push(device.mqttName));
    res.send(devicesNames);
  });
};

exports.findAll = (req, res) => {
  Device.find({}, (err, devices) => {
    res.send(devices);
  });
};

exports.findOne = (mqttName) => {
  Device.find({
    mqttName,
  }, (err, device) => device);
};

exports.update = (req, res) => {
  Device.update({
    _id: req.body.id,
  }, {
    Device_Name: req.body.newDeviceName,
    Location: req.body.newLocation,
  }, (err, raw) => {
    if (err) res.send(err);

    res.send(raw);
  });
};

exports.delete = (req, res) => {
  const seriesRemoved = 0;
  Device.deleteOne({
    _id: req.body.id,
  }, (err, numberRemoved) => {
    if (numberRemoved === 0) return (new Error('ID not found'));
  });
  Series.deleteMany({
    Device_Id: req.body.id,
  }, (err, docsAffected) => {
    this.seriesRemoved = docsAffected;
  });
  res({
    message: `Succesfully removed device and ${seriesRemoved} series.`,
  });
};
