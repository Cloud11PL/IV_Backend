const Series = require('../models/series.model');
const Device = require('../models/device.model');

// Znajdź wszystkie serie dla danego urządzenia
// Najlepiej jak będą wysłane w kolejności od najnowszej
// TO-DO: Paginacja
/*
{
  Series_1: {
    1: {
      Payload: 1,
      Time: xD
    },
    2: {
      Payload: 0,
      Time: xD
    },
    ...
  }
}
*/

exports.create = (seriesId, Device_Id) => {
  const series = new Series({
    SeriesId: seriesId,
    Device_Id,
  });

  series.save().then((series) => {
    console.log(series);
    return series;
  });
};

exports.findAll = (req, res) => {
  Series.find({
    Device_Id: req.body.device_Id,
  }, (err, series) => {
    res.send(series);
    console.log(series);
  });
};

exports.findSeriesById = deviceId => new Promise((resolve, reject) => {
  Series
    .find({
      Device_Id: deviceId,
    })
    .sort('-SeriesId')
    .exec((err, series) => {
      console.log('Find Series By Id');
      console.log(series);
      if (err) {
        reject(err);
      }
      resolve(series);
    });
});

exports.findAllSeries = (mqttName) => {
  Device.findOne({
    mqttName,
  }).then((device) => {
    console.log(device);
    Series.find({
      Device_Id: device._id,
    }).sort('-SeriesId').then((serieses) => {
      const series = serieses;
      console.log(series);
      return series[0];
    });
  });
};

exports.findOne = (req, res) => {
  Series.find({
    _id: req.body.id,
  }, (err, device) => {
    res.send(device);
    console.log(device);
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
