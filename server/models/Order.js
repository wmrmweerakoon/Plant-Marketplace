const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    plant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ['COD', 'Online'],
      message: 'Payment method must be either COD or Online'
    },
    required: true
  },
  paymentIntentId: {
    type: String,
    // Store Stripe payment intent ID for online payments
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['Pending', 'Paid'],
      message: 'Payment status must be either Pending or Paid'
    },
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: {
      values: ['Processing', 'Shipped', 'Delivered'],
      message: 'Order status must be Processing, Shipped, or Delivered'
    },
    default: 'Processing'
  },
  shippingAddress: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);