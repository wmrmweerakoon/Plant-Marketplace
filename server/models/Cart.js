const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
}, {
  _id: false // Disable _id for subdocuments
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user can have only one cart
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);