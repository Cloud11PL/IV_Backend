const Device = require('../models/device.model');
const Series = require('../models/series.model');
const SingleInput = require('../models/singleInput.model');

const newDeviceStartsNoSeries = (packetArray) => {
  let deviceInfo = {};
  let seriesInfo = {};

  // Create new device
  const device = new Device({
    mqttName: packetArray[0],
  });
  device.save().then((data) => {
    deviceInfo = data;
    console.log('ADDED DEVICE New device, No series');
    console.log(data);
  });

  // Create new series
  const series = new Series({
    SeriesId: 0,
    Device_Id: deviceInfo._id,
  });

  series.save().then((data) => {
    console.log('ADDED SERIES New device, No series');
    console.log(data);
    seriesInfo = data;
  });
};

const existingDeviceNewSeries = (packetArray) => {
  let existingDevice = {};
  let maxId = 0;
  Device.findOne(packetArray[0]).then((data) => {
    console.log(data);
    existingDevice = data;
  });
  Series.find({
    Device_Id: existingDevice._id,
  }).sort('-SeriesId').then((data) => {
    if (data.SeriesId) {
      maxId = data.SeriesId;
    }
  });
  // Create new series (higher than the last one)
  const series = new Series({
    SeriesId: maxId,
    Device_Id: existingDevice._id,
  });

  series.save();
};

const existingDeviceContinueSeries = (packetArray) => {
  let existingDevice = {};
  let maxId = 0;

  // Znajdz urzadzenie po ID
  Device.findOne(packetArray[0]).then((data) => {
    console.log(data);
    existingDevice = data;
  });

  // Znajdz ostatnia serie
  Series.find({
    Device_Id: existingDevice._id,
  }).sort('-SeriesId').then((data) => {
    if (data.SeriesId) {
      maxId = data.SeriesId;
    }
  });

  // Stworz input
  const singleInput = new SingleInput({
    payload: packetArray[1],
    seriesId: maxId,
  });

  singleInput.save().then((data) => {
    console.log(data);
  });
};

exports.handlePacket = (packet) => {
  // mqtt_name/start
  const packetArray = packet.split('/');
  // Urzadzenie zaczyna serie
  if (packetArray[1] === 'start') {
    // Urządzenie NIE istnieje w bazie
    if (!this.findOne(packetArray[0])) {
      newDeviceStartsNoSeries(packetArray);
    } else {
      // Urzadzenie istnieje w bazie
      existingDeviceNewSeries(packetArray);
    }
  } else {
    // Znane (chyba ze jakis mocny error sie zadzieje i packet zniknie)
    // Urzadzenie kontynuuje serie
    existingDeviceContinueSeries(packetArray);
  }
  // if (this.findOne(packetArray[0])) {
  //   // Add pomiar to database
  //   // Check series
  // } else {
  //   // Add new device to db
  //   // Create new series

  // }
  // const packetObject = {
  //   mqtt_name: packetArray[0],
  // };
};


// exports.createNewDevice = (data) => {

// };

// exports.create = (data) => {
//   Device.create({
//     Device_Name: req.body.device_name,
//     Location: req.body.location,
//   }, (err) => {
//     if (err) res(err);

//     Device.findOne({
//       Device_Name: req.body.device_name,
//     }, (findErr, result) => {
//       if (findErr) res(findErr);

//       res(result);
//     });
//   });
// };

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

exports.listDevices = () => {
  console.log('wywoluje sie xd');
  Device.find({}, (err, devices) => {
    console.log(devices);
    return devices;
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
