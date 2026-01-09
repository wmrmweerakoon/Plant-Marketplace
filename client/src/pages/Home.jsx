import React from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover Beautiful <span className="text-green-700">Plants</span> for Your Home
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Connect with plant lovers and find the perfect green companions for your space. 
                Buy, sell, and trade plants with our community of gardening enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-800 transition duration-300"
                >
                  Browse Plants
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition duration-300"
                >
                  Sell Plants
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="bg-green-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                <span className="text-green-800 text-lg font-medium">Plant Image</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Plant Marketplace?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We connect plant lovers to share, buy, and sell beautiful plants in a trusted community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality Plants",
                description: "Only the healthiest and most beautiful plants from verified sellers",
                icon: "🌿"
              },
              {
                title: "Safe Transactions",
                description: "Secure payment system and verified seller profiles",
                icon: "🔒"
              },
              {
                title: "Expert Advice",
                description: "Connect with experienced plant enthusiasts for care tips",
                icon: "💡"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-green-50 p-8 rounded-xl text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;