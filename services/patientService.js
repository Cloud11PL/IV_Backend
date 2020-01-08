const Patient = require('../models/patient.model');

exports.findPatientDevice = deviceId => new Promise((resolve) => {
  Patient.find({
    deviceId,
  }).then((patient) => {
    if (patient[0] !== undefined) {
      console.log(patient[0]._id);
      resolve(patient[0]._id);
    }
    resolve(null);
  });
});
