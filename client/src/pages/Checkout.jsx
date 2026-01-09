import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'COD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if user is a buyer, redirect if not
      if (parsedUser.role !== 'buyer') {
        if (parsedUser.role === 'seller') {
          navigate('/seller-dashboard');
        } else if (parsedUser.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
    } else {
      // If no user is logged in, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  const location = useLocation();
  // Initialize selected items from location state and form with user data
  useEffect(() => {
    // Only proceed if user is a buyer (already checked in first effect)
    // Get selected items from location state (passed from cart page)
    if (location.state && location.state.selectedItems) {
      setSelectedItems(location.state.selectedItems);
    } else {
      // Fallback to full cart if no selected items passed via location state
      setSelectedItems(cart.items);
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        fullName: parsedUser.name || '',
        email: parsedUser.email || ''
      }));
    }
  }, [cart.items, location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate total price for selected items only
  const getSelectedTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.plant.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      setError('No items selected for checkout');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Prepare order items from selected items only
      const orderItems = selectedItems.map(item => ({
        plant: item.plant._id,
        quantity: item.quantity,
        price: item.plant.price
      }));

      // Create order object
      const orderData = {
        items: orderItems,
        totalAmount: getSelectedTotalPrice(),
        paymentMethod: formData.paymentMethod,
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`
      };

      // Send order to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (response.ok) {
        // Clear cart after successful order
        clearCart();
        navigate('/my-orders');
      } else if (response.status === 401) {
        // Unauthorized - token invalid or expired, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        setError(result.message || 'Failed to place order');
      }
    } catch (err) {
      setError('An error occurred while placing your order');
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-gray-600 mb-8">No items selected for checkout. Please go back to cart and select items.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/cart')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Go to Cart
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="12345"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="123 Main St, Apt 4B"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-3">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">Cash on Delivery (COD)</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Online"
                        checked={formData.paymentMethod === 'Online'}
                        onChange={handleChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-700">Online Payment</span>
                    </label>
                  </div>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                  </div>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                    loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                  } transition duration-200`}
                >
                  {loading ? 'Processing...' : `Place Order - $${getSelectedTotalPrice().toFixed(2)}`}
                </motion.button>
              </form>
            </motion.div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-md p-6 sticky top-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {selectedItems.map((item) => (
                  <div key={item.plant._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-3">
                        {item.plant.imageUrl ? (
                          <img
                            src={item.plant.imageUrl}
                            alt={item.plant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{item.plant.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ${(item.plant.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getSelectedTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${getSelectedTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
