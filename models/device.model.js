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
});

module.exports = mongoose.model('Device', DeviceSchema);
