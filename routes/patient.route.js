const patient = require('../controllers/patient.controller');

module.exports = (app) => {
  app.get('/patients', patient.getAllPatients);
  app.get('/patient', patient.getPatient);
  app.post('/patient', patient.createPatient);
  app.put('/patient', patient.updatePatient);
};
