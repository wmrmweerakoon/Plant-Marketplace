import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

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
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
            <p className="text-gray-600 mb-8">Your cart is currently empty</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/buy-plants')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
            >
              Browse Plants
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Your Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center space-x-2">
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
                      className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Select All</span>
                  </div>
                  <div className="text-sm text-gray-500">
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
                        selectedItems[item.plant._id] ? 'bg-green-50' : ''
                      }`}
                    >
                      <div className="mr-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems[item.plant._id] || false}
                          onChange={() => toggleSelectItem(item.plant._id)}
                          className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                        />
                      </div>
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                        {item.plant.imageUrl ? (
                          <img
                            src={item.plant.imageUrl}
                            alt={item.plant.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <h3 className="text-lg font-medium text-gray-900">{item.plant.name}</h3>
                        <p className="text-gray-600">{item.plant.category}</p>
                        <p className="mt-1 text-lg font-semibold text-green-600">
                          ${(item.plant.price * item.quantity).toFixed(2)}
                          <span className="text-gray-500 text-sm font-normal ml-2">
                            (${item.plant.price.toFixed(2)} × {item.quantity})
                          </span>
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.plant._id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.plant._id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.plant._id)}
                          className="text-red-600 hover:text-red-800"
                        >
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
              className="bg-white rounded-lg shadow-md p-6 sticky top-8"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
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
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={isCheckingOut || getSelectedItems().length === 0}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isCheckingOut || getSelectedItems().length === 0 ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                } transition duration-200`}
              >
                {isCheckingOut ? 'Processing...' : `Proceed to Checkout (${getSelectedItems().length} items)`}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
