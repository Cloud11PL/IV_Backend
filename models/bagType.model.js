const mongoose = require('mongoose');

const bagTypeSchema = mongoose.Schema({
  type: {
    type: String,
    isRequired: true,
  },
  volume: {
    type: String,
    isRequired: true,
  },
  dosage: {
    type: String,
    isRequired: true,
  },
});

module.exports = mongoose.model('bagtype', bagTypeSchema);
