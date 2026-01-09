import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
        return 'bg-yellow-10 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
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
          My Orders
        </motion.h1>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <a href="/buy-plants" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200">
              Browse Plants
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Order #{order._id.substring(0, 8)}</h3>
                      <p className="text-sm text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800`}>
                        {order.paymentMethod}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Shipping Address</h4>
                    <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                  </div>

                  {/* Payment Details for Online Payments */}
                  {order.paymentMethod === 'Online' && order.paymentDetails && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-60">
                        <div><span className="font-medium">Card Number:</span> ****{order.paymentDetails.cardNumber?.slice(-4)}</div>
                        <div><span className="font-medium">Expiry:</span> {order.paymentDetails.expiryDate}</div>
                        <div><span className="font-medium">Cardholder:</span> {order.paymentDetails.cardholderName}</div>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
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
                              <h5 className="text-sm font-medium text-gray-900">{item.plant.name}</h5>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total Amount</div>
                      <div className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Tracking Information Section */}
                  {order.trackingInfo && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 0 016 0z" />
                        </svg>
                        Tracking Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <span className="text-gray-600">Expected Delivery:</span>
                            <div className="font-medium">
                              {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'Not set'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <div>
                            <span className="text-gray-600">Current Status:</span>
                            <div className="font-medium">{order.trackingInfo.status || 'Not updated'}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <span className="text-gray-600">Current Location:</span>
                            <div className="font-medium">{order.trackingInfo.currentLocation || 'Not updated'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Tracking History Timeline */}
                      {order.trackingInfo.locationHistory && order.trackingInfo.locationHistory.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Tracking History</h5>
                          <div className="space-y-3">
                            {[...order.trackingInfo.locationHistory].reverse().map((history, index) => (
                              <div key={index} className="flex items-start border-l-2 border-gray-200 pl-4 py-1 ml-3">
                                <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-1.5 mr-3 -ml-10"></div>
                                <div className="text-sm">
                                  <div className="font-medium">{history.status}</div>
                                  <div className="text-gray-600">{history.location}</div>
                                  {history.notes && <div className="text-gray-500 text-xs">{history.notes}</div>}
                                  <div className="text-gray-400 text-xs">{new Date(history.timestamp).toLocaleString()}</div>
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