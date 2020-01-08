const mongoose = require('mongoose');

const SeriesSchema = mongoose.Schema({
  SeriesId: {
    type: Number,
  },
  Device_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  },
  time: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
  bagType: {
    type: mongoose.Schema.Types.ObjectId,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model('Series', SeriesSchema);
