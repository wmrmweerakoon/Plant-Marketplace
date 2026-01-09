const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Plant = require('../models/Plant');
const { protect, authorize } = require('../middleware/auth');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Buyers only)
router.post('/', protect, authorize('buyer'), async (req, res) => {
  try {
    const { items, totalAmount, paymentMethod, shippingAddress } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required and must be an array' });
    }
    
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Valid total amount is required' });
    }
    
    if (!paymentMethod || !['COD', 'Online'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Valid payment method is required (COD or Online)' });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    // Verify each item and check stock availability
    for (const item of items) {
      const plant = await Plant.findById(item.plant);
      if (!plant) {
        return res.status(400).json({ success: false, message: `Plant with ID ${item.plant} not found` });
      }
      
      if (item.quantity > plant.stock) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${plant.name}. Available: ${plant.stock}, Requested: ${item.quantity}` 
        });
      }
      
      // Verify the price matches the current plant price
      if (item.price !== plant.price) {
        return res.status(400).json({ 
          success: false, 
          message: `Price mismatch for ${plant.name}. Expected: ${plant.price}, Got: ${item.price}` 
        });
      }
    }

    // Calculate expected total amount to verify against provided total
    const calculatedTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (Math.abs(totalAmount - calculatedTotal) > 0.01) { // Allow for small rounding differences
      return res.status(400).json({ 
        success: false, 
        message: `Total amount mismatch. Expected: ${calculatedTotal}, Got: ${totalAmount}` 
      });
    }

    // Prepare order data
    const orderData = {
      buyer: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress
    };

    // Add payment details if it's an online payment
    if (paymentMethod === 'Online' && req.body.paymentDetails) {
      orderData.paymentDetails = {
        cardNumber: req.body.paymentDetails.cardNumber,
        expiryDate: req.body.paymentDetails.expiryDate,
        cardholderName: req.body.paymentDetails.cardholderName
        // Note: CVV is intentionally not stored for security reasons
      };
    }

    // Create the order
    const order = await Order.create(orderData);

    // Decrease stock for each plant in the order
    for (const item of items) {
      await Plant.findByIdAndUpdate(
        item.plant,
        { $inc: { stock: -item.quantity } }, // Decrease stock by the ordered quantity
        { new: true, runValidators: true }
      );
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Server error during order creation' });
  }
});

// @desc    Get all orders for a buyer
// @route   GET /api/orders/my-orders
// @access  Private (Buyers only)
router.get('/my-orders', protect, authorize('buyer'), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('items.plant', 'name price imageUrl')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error during fetching orders' });
  }
});

// @desc    Get all orders for seller's plants
// @route   GET /api/orders/seller-orders
// @access  Private (Sellers only)
router.get('/seller-orders', protect, authorize('seller'), async (req, res) => {
  try {
    // Find plants owned by this seller
    const sellerPlants = await Plant.find({ seller: req.user._id }).select('_id');
    const plantIds = sellerPlants.map(plant => plant._id);

    // Find orders containing these plants
    const orders = await Order.find({
      'items.plant': { $in: plantIds }
    })
      .populate('items.plant', 'name price imageUrl')
      .populate('buyer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ success: false, message: 'Server error during fetching seller orders' });
  }
});

// @desc    Update order status (for sellers)
// @route   PUT /api/orders/:id/status
// @access  Private (Sellers only, for their plant orders)
router.put('/:id/status', protect, authorize('seller'), async (req, res) => {
  try {
    const { orderStatus } = req.body;

    // Validate order status
    if (!orderStatus || !['Processing', 'Shipped', 'Delivered'].includes(orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid order status is required (Processing, Shipped, or Delivered)' 
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify that the order contains plants from this seller
    const sellerPlants = await Plant.find({ seller: req.user._id }).select('_id');
    const sellerPlantIds = sellerPlants.map(plant => plant._id);
    
    const orderHasSellerPlants = order.items.some(item => 
      sellerPlantIds.some(sellerPlantId => sellerPlantId.equals(item.plant))
    );

    if (!orderHasSellerPlants) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    // Update the order status
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error during updating order status' });
  }
});

module.exports = router;