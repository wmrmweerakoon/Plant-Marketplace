import React from 'react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage the plant marketplace platform</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">142</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900">Total Listings</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">324</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900">Total Sales</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">$12,450</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-medium text-gray-900">Pending Reviews</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">8</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Users</h2>
            <div className="space-y-4">
              {[
                { name: 'John Doe', email: 'john@example.com', role: 'buyer', date: '2023-06-15' },
                { name: 'Jane Smith', email: 'jane@example.com', role: 'seller', date: '2023-06-14' },
                { name: 'Bob Johnson', email: 'bob@example.com', role: 'buyer', date: '2023-06-12' },
                { name: 'Alice Williams', email: 'alice@example.com', role: 'seller', date: '2023-06-10' },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'buyer' ? 'bg-blue-100 text-blue-800' : 
                      user.role === 'seller' ? 'bg-green-100 text-green-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                    <span className="text-sm text-gray-500">{user.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Platform Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Maintenance Mode</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Email Notifications</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">User Verification</span>
                <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
                </button>
              </div>
              <div className="pt-4">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-200">
                  Clear Cache
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;