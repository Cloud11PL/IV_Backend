const { Parser } = require('expr-eval');

const parser = new Parser();

const deviceService = require('../services/deviceService');
const seriesService = require('../services/seriesService');

const SingleInput = require('../models/singleInput.model');
const Series = require('../models/series.model');
const Device = require('../models/device.model');

const equation = 'x^2 * 0.0078 + 1.5899 * x + 138.33';
const baseLine = 128;

exports.connectedHandler = topic => new Promise((resolve, reject) => {
  deviceService
    .findDeviceId(topic)
    .then((id) => {
      seriesService
        .findSeriesById(id)
        .then((series) => {
          // console.log(series);
          if (series.length === 0 || series === undefined) {
            console.log('Creating new series...');
            const seriesModel = new Series({
              SeriesId: 0,
              Device_Id: id,
            });

            seriesModel
              .save()
              .then((res) => {
                console.log(res);
                resolve(res.SeriesId);
              });
          } else {
            const newId = series[0].SeriesId + 1;
            console.log(newId);
            const seriesModel = new Series({
              SeriesId: newId,
              Device_Id: id,
            });

            seriesModel
              .save()
              .then((res) => {
                console.log(res);
                resolve(res.SeriesId);
              });
          }
        });
    });
});

exports.handlePacket = (packet, topic) => new Promise((resolve, reject) => {
  const newPayload = packet.toString().split('/');
  const expr = parser.parse(equation);

  const payload = expr.evaluate({
    x: Math.floor(Math.abs(newPayload[1] - baseLine)),
  });

  const singleInput = new SingleInput({
    payload,
    seriesId: newPayload[0],
    mqttName: topic,
  });

  singleInput.save().then((res) => {
    resolve(res);
    // console.log(res);
  });
});


exports.setDeviceActiveStatus = (mqttName, status) => new Promise((resolve, reject) => {
  Device.findOneAndUpdate({
    mqttName,
  }, {
    Active: status,
  }, {
    useFindAndModify: false,
    new: true,
  }).then((newDevice, error) => {
    if (error) {
      reject(error);
    }
    resolve(newDevice);
  });
});

exports.setSeriesStatus = (Device_Id, status) => {
  console.log('STATUS =>', status);
  console.log('Device_Id =>', Device_Id);
  Series.find({
    Device_Id,
  })
    .sort('-SeriesId')
    .limit(1)
    .then((res) => {
      res[0].updateOne({ isDone: status }, (err, raw) => {
        console.log(err);
        console.log(raw);
      });
    });
  // Needs a little fix but works
};
