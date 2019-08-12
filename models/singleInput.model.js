const mongoose = require('mongoose');

const SensorInputSchema = mongoose.Schema({
  payload: {
    type: Number,
    required: true,
  },
  seriesId: {
    type: Number,
    required: true,
  },
  mqttName: {
    type: String,
    required: true,
  },
  Time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('SensorInput', SensorInputSchema);
