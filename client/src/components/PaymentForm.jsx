import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';

const PaymentForm = ({ 
  formData, 
  setFormData, 
  loading, 
  setLoading, 
  setError,
  orderData,
  onSuccess 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [cardComplete, setCardComplete] = useState(false);

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      setError('Stripe is not loaded yet. Please refresh the page.');
      return;
    }

    if (!cardComplete) {
      setError('Please complete your card details');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create order first
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create order with "Pending" payment status
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...orderData,
          paymentMethod: 'Online' // Force online payment
        })
      });

      const orderResult = await orderResponse.json();
      
      if (!orderResponse.ok) {
        throw new Error(orderResult.message || 'Failed to create order');
      }

      const order = orderResult.data;

      // 2. Create payment intent
      const paymentIntentResponse = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: order.totalAmount,
          currency: 'usd',
          orderItems: order.items
        })
      });

      const paymentIntentResult = await paymentIntentResponse.json();
      
      if (!paymentIntentResponse.ok) {
        throw new Error(paymentIntentResult.message || 'Failed to create payment intent');
      }

      // 3. Confirm payment with Stripe
      const confirmResult = await stripe.confirmCardPayment(
        paymentIntentResult.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.fullName,
              email: formData.email,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.zipCode,
              },
            },
          },
        }
      );

      if (confirmResult.error) {
        // Show error to your customer
        throw new Error(confirmResult.error.message);
      } else {
        // The payment has been processed!
        if (confirmResult.paymentIntent.status === 'succeeded') {
          // Confirm payment with backend
          const confirmPaymentResponse = await fetch('/api/payment/confirm-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              paymentIntentId: confirmResult.paymentIntent.id,
              orderId: order._id
            })
          });

          const confirmResultData = await confirmPaymentResponse.json();
          
          if (confirmPaymentResponse.ok) {
            onSuccess(order._id); // Pass order ID to success callback
          } else {
            throw new Error(confirmResultData.message || 'Payment confirmation failed');
          }
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment processing');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="p-3 border border-gray-300 rounded-md focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
          <CardElement 
            options={cardElementOptions}
            onChange={(e) => setCardComplete(e.complete)}
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Enter your card details securely. This information is processed directly by Stripe.
        </p>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className={`w-full py-3 px-4 rounded-md text-white font-medium ${
          !stripe || loading || !cardComplete 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700'
        } transition duration-200`}
      >
        {loading ? 'Processing Payment...' : `Pay $${orderData.totalAmount.toFixed(2)}`}
      </motion.button>
    </form>
  );
};

export default PaymentForm;