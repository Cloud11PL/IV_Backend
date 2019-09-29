const Series = require('../models/series.model');

exports.findSeriesById = deviceId => new Promise((resolve, reject) => {
  Series
    .find({
      Device_Id: deviceId,
    })
    .sort('-SeriesId')
    .exec((err, series) => {
      if (err) {
        reject(err);
      }
      resolve(series);
    });
});
