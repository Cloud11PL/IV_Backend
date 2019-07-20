import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    max: 15,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    unique: false,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    unique: true,
    required: true,
  },
  surname: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
