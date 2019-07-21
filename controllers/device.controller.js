const Device = require('../models/device.model');
const Series = require('../models/series.model');

exports.test = (req, res) => {
  res.send('Hello from Deivce Test!');
};

exports.findAll = (req, res) => {
  Device.find({}, (err, devices) => {
    res.send(devices);
    console.log(devices);
  });
};

exports.findOne = (req, res) => {
  Device.find({
    _id: req.body.id,
  }, (err, device) => {
    res.send(device);
    console.log(device);
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
