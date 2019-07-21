const mongoose = require('mongoose');

const SeriesSchema = mongoose.Schema({
  SeriesName: {
    type: String,
  },
  Device_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Series', SeriesSchema);
