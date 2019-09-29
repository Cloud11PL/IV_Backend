const deviceService = require('../services/deviceService');
const seriesService = require('../services/seriesService');

const SingleInput = require('../models/singleInput.model');
const Series = require('../models/series.model');


exports.connectedHandler = topic => new Promise((resolve, reject) => {
  deviceService
    .findDeviceId(topic)
    .then((id) => {
      seriesService
        .findSeriesById(id)
        .then((series) => {
          console.log(series);
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

  const singleInput = new SingleInput({
    payload: newPayload[1],
    seriesId: newPayload[0],
    mqttName: topic,
  });

  singleInput.save().then((res) => {
    resolve(res);
    console.log(res);
  });
});
