const Device = require('../models/device.model');
const Series = require('../models/series.model');

exports.create = (req, res) => {
  Device.create({
    Device_Name: req.body.device_name,
    Location: req.body.location,
  }, (err) => {
    if (err) res(err);

    Device.findOne({
      Device_Name: req.body.device_name,
    }, (findErr, result) => {
      if (findErr) res(findErr);

      res(result);
    });
  });
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

exports.update = (req, res) => {
  Device.findOneAndUpdate({
    _id: req.body._id,
  }, req.body, {
    useFindAndModify: false,
    new: true,
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
