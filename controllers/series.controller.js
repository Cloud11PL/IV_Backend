const Series = require('../models/series.model');

exports.test = (req, res) => {
  res.send('Hello from Series Test!');
};

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
exports.findAll = (req, res) => {
  // Może
  // Lokalizacja(Device), data(Series), isDone(Series)?
  Series.find({
    Device_Id: req.body.device_Id,
  }, (err, series) => {
    res.send(series);
    console.log(series);
  });
};

// Weź se jedną konkretną serie i elo
// Daj całe info razem z serią?
exports.findOne = (req, res) => {
  Series.find({
    _id: req.body.id,
    // Chyba brakuje listowania wszystkich serii
  }, (err, device) => {
    res.send(device);
    console.log(device);
  });
};

// Usuń serię
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
