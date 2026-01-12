const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  getCart, 
  addItemToCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  getCartTotal 
} = require('../controllers/cartController');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, getCart);

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', protect, addItemToCart);

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:plantId
// @access  Private
router.put('/update/:plantId', protect, updateCartItem);

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:plantId
// @access  Private
router.delete('/remove/:plantId', protect, removeCartItem);

// @desc    Clear user's cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', protect, clearCart);

// @desc    Get cart total
// @route   GET /api/cart/total
// @access  Private
router.get('/total', protect, getCartTotal);

module.exports = router;
