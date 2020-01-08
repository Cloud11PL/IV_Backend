const series = require('../controllers/series.controller');

module.exports = (app) => {
  app.get('/series', series.getAllInputsById);
  app.get('/seriesPatient', series.getAllSeriesForPatient);
  app.get('/singleSeries', series.getSingleSeries);
  app.put('/singleSeries', series.editSingleSeries);
  app.get('/deviceSeries', series.getAllSeriesForDevice);
};
