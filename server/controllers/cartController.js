const Cart = require('../models/Cart');
const Plant = require('../models/Plant');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.plant');
    
    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error during fetching cart' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addItemToCart = async (req, res) => {
  try {
    const { plantId, quantity = 1 } = req.body;

    // Validate plant exists and get price
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    if (quantity > plant.stock) {
      return res.status(400).json({ success: false, message: `Only ${plant.stock} items available in stock` });
    }

    // Find or create user's cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.plant.toString() === plantId);
    
    if (existingItemIndex > -1) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += quantity;
      // Ensure quantity doesn't exceed stock
      if (cart.items[existingItemIndex].quantity > plant.stock) {
        return res.status(400).json({ success: false, message: `Only ${plant.stock} items available in stock` });
      }
    } else {
      // Add new item to cart
      cart.items.push({
        plant: plantId,
        quantity: quantity,
        price: plant.price
      });
    }

    await cart.save();
    await cart.populate('items.plant');

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error during adding to cart' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:plantId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { plantId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.plant');
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Find the item by plantId, with null safety check
    const itemIndex = cart.items.findIndex(item => item.plant && item.plant._id && item.plant._id.toString() === plantId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const item = cart.items[itemIndex];

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock availability
      if (!item.plant) {
        return res.status(404).json({ success: false, message: 'Associated plant not found' });
      }
      if (quantity > item.plant.stock) {
        return res.status(400).json({ success: false, message: `Only ${item.plant.stock} items available in stock` });
      }
      item.quantity = quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error during updating cart item' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:plantId
// @access  Private
const removeCartItem = async (req, res) => {
  try {
    const { plantId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    // Filter out the item to remove - handle both populated and unpopulated cart items
    cart.items = cart.items.filter(item => {
      // Handle both cases: when item.plant is an ObjectId and when it's populated
      if (typeof item.plant === 'string') {
        return item.plant !== plantId;
      } else if (item.plant && typeof item.plant._id !== 'undefined') {
        return item.plant._id.toString() !== plantId;
      } else {
        return item.plant.toString() !== plantId;
      }
    });
    
    await cart.save();
    await cart.populate('items.plant'); // Repopulate after save to ensure consistency

    res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error during removing cart item' });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error during clearing cart' });
  }
};

// @desc    Get cart total
// @route   GET /api/cart/total
// @access  Private
const getCartTotal = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.plant');
    
    if (!cart) {
      return res.status(200).json({
        success: true,
        total: 0,
        itemCount: 0
      });
    }

    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

    res.status(200).json({
      success: true,
      total,
      itemCount
    });
  } catch (error) {
    console.error('Get cart total error:', error);
    res.status(500).json({ success: false, message: 'Server error during calculating cart total' });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartTotal
};
