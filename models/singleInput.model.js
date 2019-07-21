const mongoose = require('mongoose');

const SensorInputSchema = mongoose.Schema({
  payload: {
    type: Number,
    required: true,
  },
  deviceId: {
    type: String,
    requied: true,
  },
  seriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Series',
  },
  Time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SensorInput', SensorInputSchema);
