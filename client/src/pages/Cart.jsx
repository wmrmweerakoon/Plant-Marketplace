import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Import the background image
import backgroundImage from '../assets/delivery box sealed with eco-friendly tape.png';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in and get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, []);

  // Check if user is a buyer, redirect if not
  useEffect(() => {
    if (user && user.role !== 'buyer') {
      // Redirect non-buyers to home or show an error
      if (user.role === 'seller') {
        navigate('/seller-dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  // If no user is logged in, redirect to login
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
    }
  }, [navigate]);

  // Initialize selectedItems when cart items change
  React.useEffect(() => {
    const initialSelections = {};
    (cart.items || []).forEach(item => {
      initialSelections[item.plant._id] = true; // By default, select all items
    });
    setSelectedItems(initialSelections);
  }, [cart.items]);

  const toggleSelectItem = (plantId) => {
    setSelectedItems(prev => ({
      ...prev,
      [plantId]: !prev[plantId]
    }));
  };

  const selectAllItems = () => {
    const newSelections = {};
    (cart.items || []).forEach(item => {
      newSelections[item.plant._id] = true;
    });
    setSelectedItems(newSelections);
  };

  const deselectAllItems = () => {
    const newSelections = {};
    (cart.items || []).forEach(item => {
      newSelections[item.plant._id] = false;
    });
    setSelectedItems(newSelections);
  };

  const getSelectedItems = () => {
    return (cart.items || []).filter(item => selectedItems[item.plant._id]);
  };

  const getSelectedTotalPrice = () => {
    return getSelectedItems().reduce((total, item) => total + (item.plant.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Pass selected items to checkout page using state
    navigate('/checkout', { state: { selectedItems: getSelectedItems() } });
  };

  if ((cart.items || []).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 relative overflow-hidden"
           style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-emerald-100/60 z-0"></div> {/* Semi-transparent overlay to blend image with content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6 border-2 border-green-200 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3"
            >
              Your Cart
            </motion.h1>
            <p className="text-gray-600 text-lg mb-8">Your cart is currently empty</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/buy-plants')}
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 font-medium text-lg hover:scale-105 transform"
            >
              Browse Plants
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 relative overflow-hidden"
         style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-emerald-100/60 z-0"></div> {/* Semi-transparent overlay to blend image with content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-3">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Review your selected plants and proceed to checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-300">
              <div className="divide-y divide-gray-200">
                <div className="p-6 flex items-center justify-between border-b border-gray-200 bg-gray-50/50">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={(cart.items || []).length > 0 && (cart.items || []).every(item => selectedItems[item.plant._id])}
                      onChange={() => {
                        if ((cart.items || []).length > 0 && (cart.items || []).every(item => selectedItems[item.plant._id])) {
                          deselectAllItems();
                        } else {
                          selectAllItems();
                        }
                      }}
                      className="h-5 w-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                    />
                    <span className="text-base font-medium text-gray-800">Select All</span>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                    {getSelectedItems().length} of {(cart.items || []).length} items selected
                  </div>
                </div>
                <AnimatePresence>
                  {(cart.items || []).map((item) => (
                    <motion.div
                      key={item.plant._id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-6 flex items-center ${
                        selectedItems[item.plant._id] ? 'bg-green-50/30' : ''
                      }`}
                    >
                      <div className="mr-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems[item.plant._id] || false}
                          onChange={() => toggleSelectItem(item.plant._id)}
                          className="h-5 w-5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                        />
                      </div>
                      <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
                        {item.plant.imageUrl ? (
                          <img
                            src={item.plant.imageUrl}
                            alt={item.plant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <h3 className="text-lg font-bold text-gray-900">{item.plant.name}</h3>
                        <p className="text-gray-600 text-sm">{item.plant.category}</p>
                        <p className="mt-2 text-xl font-bold text-green-700">
                          ${(item.plant.price * item.quantity).toFixed(2)}
                          <span className="text-gray-500 text-sm font-normal ml-2 block">
                            (${item.plant.price.toFixed(2)} × {item.quantity})
                          </span>
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-4">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.plant._id, item.quantity - 1)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors duration-200"
                          >
                            -
                          </button>
                          <span className="px-4 py-2 text-gray-800 font-medium min-w-[40px] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.plant._id, item.quantity + 1)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 font-bold text-lg transition-colors duration-200"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.plant._id)}
                          className="flex items-center text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-7 sticky top-8 border border-white/50 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center mb-5">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">${getSelectedTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-900">$0.00</span>
                </div>
                <div className="pt-3 mt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-green-700">${getSelectedTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isCheckingOut || getSelectedItems().length === 0}
                className={`w-full py-4 px-4 rounded-xl text-white font-bold text-lg ${
                  isCheckingOut || getSelectedItems().length === 0 ? 'bg-green-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                } transition-all duration-300 shadow-lg shadow-green-500/30`}
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : `Proceed to Checkout (${getSelectedItems().length} items)`}
              </motion.button>
              
              <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure checkout
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
