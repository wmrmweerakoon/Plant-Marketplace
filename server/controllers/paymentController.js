const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @desc    Create a payment intent for online payment
// @route   POST /api/payment/create-payment-intent
// @access  Private (Buyers only)
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderItems } = req.body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid amount is required' 
      });
    }

    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order items are required and must be an array' 
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata: {
        userId: req.user._id.toString(),
        orderItems: JSON.stringify(orderItems)
      },
      automatic_payment_methods: {
        enabled: true,
      },
      confirm: false, // Don't auto-confirm, let frontend handle confirmation
      return_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/checkout` // Return URL after payment
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating payment intent' 
    });
  }
};

// @desc    Confirm payment and update order status
// @route   POST /api/payment/confirm-payment
// @access  Private (Buyers only)
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment intent ID is required' 
      });
    }

    if (!orderId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order ID is required' 
      });
    }

    // Retrieve payment intent to verify status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update order payment status to 'Paid'
      const order = await Order.findByIdAndUpdate(
        orderId,
        { 
          paymentStatus: 'Paid',
          paymentIntentId: paymentIntentId
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ 
          success: false, 
          message: 'Order not found' 
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        order
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: `Payment not successful. Status: ${paymentIntent.status}` 
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error confirming payment' 
    });
  }
};

// @desc    Handle webhook for payment updates
// @route   POST /api/payment/webhook
// @access  Public (handled by Stripe)
const handleWebhook = async (req, res) => {
  const { stripeWebhookHandler } = require('../middleware/stripe');
  await stripeWebhookHandler(req, res);
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  handleWebhook
};