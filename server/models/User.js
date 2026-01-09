const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer'
  },
  cart: {
    type: [{
      plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
      }
    }],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
