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
});

module.exports = mongoose.model('Series', SeriesSchema);
