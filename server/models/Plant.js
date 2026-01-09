const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true,
    maxlength: [100, 'Plant name cannot exceed 100 characters']
  },
  category: {
    type: String,
    enum: {
      values: ['Vegetable', 'Flower', 'Medicinal'],
      message: 'Category must be either Vegetable, Flower, or Medicinal'
    },
    required: [true, 'Category is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  careLevel: {
    type: String,
    enum: {
      values: ['Easy', 'Medium', 'Hard'],
      message: 'Care level must be either Easy, Medium, or Hard'
    },
    required: [true, 'Care level is required']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  imagePublicId: {
    type: String,
    required: false // Not required for backward compatibility
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plant', plantSchema);