const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  age: Number,
  active: { type: Boolean, default: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
