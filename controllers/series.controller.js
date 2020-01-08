const mongoose = require('mongoose');

const Series = require('../models/series.model');
const Device = require('../models/device.model');
const SingleInput = require('../models/singleInput.model');

// eslint-disable-next-line camelcase
exports.create = (seriesId, Device_Id) => {
  const series = new Series({
    SeriesId: seriesId,
    Device_Id,
  });

  series.save().then(savedSeries => savedSeries);
};

exports.findAll = (req, res) => {
  Series.find({
    Device_Id: mongoose.Types.ObjectId(req.body.device_Id),
  }, (err, series) => {
    res.send(series);
  });
};

exports.getAllSeriesForDevice = (req, res) => {
  Series.find({
    Device_Id: mongoose.Types.ObjectId(req.query.deviceId),
  }, (err, series) => {
    if (err) {
      res.send(err);
    }
    res.send(series);
  });
};

exports.getAllSeriesForPatient = (req, res) => {
  Series.find({
    patientId: mongoose.Types.ObjectId(req.query.deviceId),
  }, (err, series) => {
    if (err) {
      res.send(err);
    }
    res.send(series);
  });
};

exports.getAllSeriesForPatient = (req, res) => {
  Series.find({
    patientId: mongoose.Types.ObjectId(req.query.patientId),
  }, (err, series) => {
    if (err) {
      res.send(err);
    }
    res.send(series);
  });
};

exports.getSingleSeries = (req, res) => {
  Series.findOne({
    mqttName: req.query.mqttName,
    SeriesId: req.query.seriesID,
  }, (err, series) => {
    if (err) {
      res.send(err);
    }
    res.send(series);
  });
};

exports.editBagType = (req, res) => {
  Series.findOneAndUpdate({
    _id: req.body._id,
  }, {
    bagType: mongoose.Schema.ObjectId(req.body.bagType),
  }, {
    useFindAndModify: false,
    new: true,
  }, (err, series) => {
    if (err) {
      res.send(err);
    }

    res.json(series);
  });
};

exports.editSingleSeries = (req, res) => {
  Series.findOneAndUpdate({
    _id: req.body.seriesId,
  }, {
    bagType: mongoose.Types.ObjectId(req.body.bagType),
  }, { new: true }, (err, upd) => {
    if (err) {
      res.json(err);
    }
    res.json(upd);
  });
};

exports.getAllInputsById = (req, res) => {
  SingleInput.find({
    mqttName: req.query.mqttName,
    seriesId: req.query.seriesId,
  }, (err, inputs) => {
    if (err) {
      res.send(err);
    }

    res.send(inputs);
  });
};

exports.findAllSeries = (mqttName) => {
  Device.findOne({
    mqttName,
  }).then((device) => {
    Series.find({
      Device_Id: device._id,
    }).sort('-SeriesId').then((serieses) => {
      const series = serieses;
      return series[0];
    });
  });
};

exports.findOne = (req, res) => {
  Series.find({
    _id: req.body.id,
  }, (err, device) => {
    res.send(device);
  });
};

exports.delete = (req, res) => {
  const seriesRemoved = 0;
  Series.deleteOne({
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
