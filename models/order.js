const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  price: Number,
  date: Date,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
