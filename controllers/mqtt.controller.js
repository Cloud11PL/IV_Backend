const Device = require('../models/device.model');
const Series = require('../models/series.model');
const SingleInput = require('../models/singleInput.model');

const seriesController = require('./series.controller');
const deviceController = require('./device.controller');

exports.connectedHandler = topic => new Promise((resolve, reject) => {
  deviceController
    .findDeviceId(topic)
    .then((id) => {
      seriesController
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

exports.createDevice = (req, res) => {
  console.log(req.body);
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

exports.listDevices = new Promise((resolve, reject) => {
  console.log('wywoluje sie xd');
  Device.find({}, (err, devices) => {
    if (err) {
      reject(err);
    }
    resolve(devices);
  });
});

exports.getDevices = (req, res) => {
  Device.find({}, (err, devices) => {
    const devicesNames = [];
    devices.map((device) => {
      devicesNames.push(device.mqttName);
    });
    res.send(devicesNames);
  });
};

exports.findAll = (req, res) => {
  Device.find({}, (err, devices) => {
    res.send(devices);
    console.log(devices);
  });
};

exports.findOne = (mqttName) => {
  Device.find({
    mqttName,
  }, (err, device) => {
    console.log(device);
    return device;
  });
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
