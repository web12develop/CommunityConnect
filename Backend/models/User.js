const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['community member', 'community business', 'community organization'],
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;