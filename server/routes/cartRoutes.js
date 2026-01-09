const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Plant = require('../models/Plant');
const { protect } = require('../middleware/auth');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('cart.plant');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { plantId, quantity } = req.body;
    
    // Validate input
    if (!plantId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Plant ID and quantity (>=1) are required' });
    }

    // Check if plant exists
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    // Find user
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if item already exists in cart
    const existingCartItemIndex = user.cart.findIndex(
      item => item.plant.toString() === plantId
    );

    if (existingCartItemIndex > -1) {
      // Update quantity if item already exists
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      user.cart.push({ plant: plantId, quantity });
    }

    await user.save();
    const populatedUser = await User.findById(req.user.userId).populate('cart.plant');

    res.status(200).json({
      success: true,
      cart: populatedUser.cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:plantId
// @access  Private
router.put('/:plantId', protect, async (req, res) => {
  try {
    const { plantId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative number' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItemIndex = user.cart.findIndex(
      item => item.plant.toString() === plantId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      user.cart.splice(cartItemIndex, 1);
    } else {
      // Update quantity
      user.cart[cartItemIndex].quantity = quantity;
    }

    await user.save();
    const populatedUser = await User.findById(req.user.userId).populate('cart.plant');

    res.status(200).json({
      success: true,
      cart: populatedUser.cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:plantId
// @access  Private
router.delete('/:plantId', protect, async (req, res) => {
  try {
    const { plantId } = req.params;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialLength = user.cart.length;
    user.cart = user.cart.filter(item => item.plant.toString() !== plantId);

    if (user.cart.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    await user.save();
    const populatedUser = await User.findById(req.user.userId).populate('cart.plant');

    res.status(200).json({
      success: true,
      cart: populatedUser.cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { cart: [] } },
      { new: true }
    ).populate('cart.plant');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      cart: user.cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;