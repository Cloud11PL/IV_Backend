const mongoose = require('mongoose');

const DeviceSchema = mongoose.Schema({
  Device_Name: {
    type: String,
    unique: true,
    required: true,
  },
  Location: {
    type: String,
  },
});

module.exports = mongoose.model('Device', DeviceSchema);
