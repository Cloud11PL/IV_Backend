const Patient = require('../models/patient.model');

exports.getAllPatients = (req, res) => {
  Patient.find({}, (err, patients) => {
    if (err) {
      res.json(err);
    }
    res.json(patients);
  });
};

exports.getPatient = (req, res) => {
  Patient.findOne({
    _id: req.query.id,
  }, (err, patient) => {
    if (err) {
      res.send(err);
    }

    res.json(patient);
  });
};

exports.createPatient = (req, res) => {
  const { patient } = req.body;
  // console.log(patient);
  Patient.create(patient).then((newPatient) => {
    res.json(newPatient);
  }).catch((err) => {
    res.send(err);
  });
};

exports.updatePatient = (req, res) => {
  const { patient } = req.body;
  // console.log(patient);

  Patient.findOneAndUpdate({
    _id: patient._id,
  }, patient, {
    useFindAndModify: false,
    new: true,
  }, (err, newPatient) => {
    if (err) {
      res.send(err);
    }

    res.json(newPatient);
  });
};

exports.reassignPatientDevice = (req, res) => {
  const { deviceId } = req.body;
  const { patientId } = req.body;

  console.log(req.body);
  Patient.findOneAndUpdate({
    _id: patientId,
  }, {
    deviceId,
  }, {
    useFindAndModify: false,
    new: true,
  }, (err, updatedPatient) => {
    if (err) {
      res.send(err);
    }
    console.log(updatedPatient);
    res.json(updatedPatient);
  });
};
