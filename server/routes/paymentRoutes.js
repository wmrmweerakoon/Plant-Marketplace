const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, handleWebhook } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// @desc    Create a payment intent for online payment
// @route   POST /api/payment/create-payment-intent
// @access  Private (Buyers only)
router.post('/create-payment-intent', protect, authorize('buyer'), createPaymentIntent);

// @desc    Confirm payment and update order status
// @route   POST /api/payment/confirm-payment
// @access  Private (Buyers only)
router.post('/confirm-payment', protect, authorize('buyer'), confirmPayment);

// @desc    Handle webhook for payment updates
// @route   POST /api/payment/webhook
// @access  Public (handled by Stripe)
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router;
