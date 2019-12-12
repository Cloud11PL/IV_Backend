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
  isDone: {
    type: Boolean,
    default: false,
  },
  BagType: {
    type: String,
    default: 'Unknown',
  },
  // Is notification sent??
  // Math equation
  // Max value
});

module.exports = mongoose.model('Series', SeriesSchema);
