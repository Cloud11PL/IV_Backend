const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
  mqttName: {
    type: String,
    unique: true,
    required: true,
  },
  Device_Name: {
    type: String,
    default: 'Not specified',
  },
  Location: {
    type: String,
    default: 'Not specified',
  },
  Active: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Device', DeviceSchema);
