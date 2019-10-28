const Patient = require('../models/patient.model');

exports.getAllPatients = (req, res) => {
  Patient.find({}, (err, patients) => {
    if (err) {
      res(err);
    }

    res(patients);
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
