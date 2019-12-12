const mongoose = require('mongoose');

const Patient = mongoose.Schema({
  firstName: {
    type: String,
    unique: false,
    required: true,
  },
  lastName: {
    type: String,
    unique: false,
    required: true,
  },
  dateAdmitted: {
    type: Date,
  },
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  },
});

module.exports = mongoose.model('Patient', Patient);
