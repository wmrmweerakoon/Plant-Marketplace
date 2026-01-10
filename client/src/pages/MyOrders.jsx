import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import the background image
import backgroundImage from '../assets/delivery box sealed with eco-friendly tape.png';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const response = await fetch('/api/orders/my-orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (response.ok) {
          setOrders(data.data);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('An error occurred while fetching orders');
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 relative overflow-hidden"
           style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-emerald-100/60 z-0"></div> {/* Semi-transparent overlay to blend image with content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6 border-2 border-green-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-700 text-lg font-medium drop-shadow-sm"
            >
              Loading your orders...
            </motion.p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 relative overflow-hidden"
           style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-emerald-100/60 z-0"></div> {/* Semi-transparent overlay to blend image with content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6 border-2 border-red-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-red-600 text-lg font-medium drop-shadow-sm"
            >
              {error}
            </motion.p>
          </div>
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
            My Orders
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your plant purchases and delivery status in one place
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/50 text-center py-16 max-w-2xl mx-auto transition-all duration-300 hover:shadow-2xl"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 mb-6 border-2 border-green-200 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h3>
            <p className="text-gray-600 mb-8 text-lg">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <motion.a 
              href="/buy-plants" 
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/30 font-medium text-lg hover:scale-105 transform"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Plants
            </motion.a>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-7 border border-white/50 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        Order <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-mono font-bold">#{order._id.substring(0, 8)}</span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-3 md:mt-0">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)} border`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {order.orderStatus}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)} border`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {order.paymentStatus}
                      </span>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-20`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 0 016 0z" />
                      </svg>
                      Shipping Address
                    </h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200">{order.shippingAddress}</p>
                  </div>

                  {/* Payment Details for Online Payments */}
                  {order.paymentMethod === 'Online' && order.paymentDetails && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                      <h4 className="text-sm font-medium text-green-700 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Payment Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-medium text-gray-600">Card Number: </span>
                          <span className="font-semibold">****{order.paymentDetails.cardNumber?.slice(-4)}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-medium text-gray-600">Expiry: </span>
                          <span className="font-semibold">{order.paymentDetails.expiryDate}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-medium text-gray-600">Cardholder: </span>
                          <span className="font-semibold">{order.paymentDetails.cardholderName}</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="font-medium text-gray-600">Last Updated: </span>
                          <span className="font-semibold">{new Date(order.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-green-200 transition-colors duration-200 shadow-sm hover:shadow-md">
                          <div className="flex items-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl overflow-hidden mr-5 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                              {item.plant.imageUrl ? (
                                <img
                                  src={item.plant.imageUrl}
                                  alt={item.plant.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs p-2 text-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <h5 className="text-base font-medium text-gray-900">{item.plant.name}</h5>
                              <div className="flex items-center mt-1 space-x-3 text-sm text-gray-600">
                                <span>Qty: <span className="font-medium">{item.quantity}</span></span>
                                <span>•</span>
                                <span>Price: <span className="font-medium">${item.price.toFixed(2)}</span></span>
                              </div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-gray-900 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-2 flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <div className="text-sm text-gray-600">Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</div>
                      <div className="text-lg font-bold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-xl font-bold text-green-700">${order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Tracking Information Section */}
                  {order.trackingInfo && (
                    <div className="border-t border-gray-200 pt-6 mt-6 bg-blue-50/50 rounded-xl p-5 border border-blue-100/50">
                      <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 016 0z" />
                        </svg>
                        Tracking Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-5">
                        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <span className="text-gray-600 block text-xs uppercase tracking-wide">Expected Delivery</span>
                            <div className="font-medium text-gray-900 text-sm">
                              {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'Not set'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <div>
                            <span className="text-gray-600 block text-xs uppercase tracking-wide">Current Status</span>
                            <div className="font-medium text-gray-900 text-sm">{order.trackingInfo.status || 'Not updated'}</div>
                          </div>
                        </div>
                        <div className="flex items-center bg-white p-3 rounded-lg border border-gray-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 11.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 016 0z" />
                          </svg>
                          <div>
                            <span className="text-gray-600 block text-xs uppercase tracking-wide">Current Location</span>
                            <div className="font-medium text-gray-900 text-sm">{order.trackingInfo.currentLocation || 'Not updated'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Tracking History Timeline */}
                      {order.trackingInfo.locationHistory && order.trackingInfo.locationHistory.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Tracking History
                          </h5>
                          <div className="space-y-4 relative pl-8 border-l-2 border-blue-200 ml-3.5 py-2">

                            {/* Vertical timeline connector */}
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent"></div>
                            
                            {[...order.trackingInfo.locationHistory].reverse().map((history, index, arr) => (
                              <div key={index} className="relative flex items-start group">
                                {/* Timeline dot */}
                                <div className="absolute -left-10 top-2.5 w-5 h-5 rounded-full bg-blue-500 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-200"></div>
                                
                                <div className="text-sm bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full">
                                  <div className="flex justify-between items-start mb-1">
                                    <div className="font-medium text-gray-900">{history.status}</div>
                                    <div className="text-gray-500 text-xs whitespace-nowrap ml-2">{new Date(history.timestamp).toLocaleString()}</div>
                                  </div>
                                  <div className="text-gray-600 text-sm mb-1">{history.location}</div>
                                  {history.notes && <div className="text-gray-500 text-xs italic">{history.notes}</div>}
                                  
                                  {/* Connector line */}
                                  {index !== arr.length - 1 && (
                                    <div className="absolute left-0 w-0.5 h-10 bg-blue-100 -ml-0.5 top-8"></div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
