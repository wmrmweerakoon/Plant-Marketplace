import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import greenhouseImage from '../assets/modern, minimalist indoor greenhouse.png';

// Floating leaf component
const FloatingLeaf = ({ delay = 0, duration = 20, size = "text-2xl" }) => {
  return (
    <motion.div
      className={`absolute ${size} text-green-600 opacity-250`}
      initial={{ x: -50, y: -50, rotate: 0 }}
      animate={{
        x: ["0vw", "100vw"],
        y: ["0vh", "100vh", "0vh"],
        rotate: [0, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
        delay: delay,
      }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
    >
      🍃
    </motion.div>
  );
};

// Multiple floating leaves background component
const FloatingLeavesBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(15)].map((_, i) => (
        <FloatingLeaf
          key={i}
          delay={i * 2}
          duration={30 + Math.random() * 20}
          size={["text-lg", "text-xl", "text-2xl"][Math.floor(Math.random() * 3)]}
        />
      ))}
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  const handleBrowsePlants = () => {
    navigate('/buy-plants');
  };

  const handleSellPlants = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/seller-dashboard');
    } else {
      // If not logged in, redirect to register page
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Floating leaves background */}
      <FloatingLeavesBackground />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-20"
            >
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-300 rounded-full opacity-10 blur-xl"></div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight relative z-10">
                Discover Beautiful <span className="text-green-700">Plants</span> for Your Home
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg relative z-10">
                Connect with plant lovers and find the perfect green companions for your space. 
                Buy, sell, and trade plants with our community of gardening enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBrowsePlants}
                  className="bg-green-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-800 transition duration-300 shadow-lg shadow-green-500/20 btn-animated"
                >
                  Browse Plants
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSellPlants}
                  className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition duration-300 shadow-lg shadow-green-500/10 btn-animated"
                >
                  Sell Plants
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center z-10"
            >
              <div className="relative w-full max-w-lg">
                {/* Image container with glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl transform -rotate-6 opacity-20"></div>
                
                <div className="relative glass-effect rounded-3xl p-6 shadow-2xl overflow-hidden border border-white/30">
                  <img 
                    src={greenhouseImage} 
                    alt="Modern indoor greenhouse" 
                    className="w-full h-auto object-cover rounded-2xl shadow-lg product-image floating-element"
                    style={{ maxHeight: '500px' }}
                  />
                </div>
                
                {/* Floating elements around the image */}
                <motion.div 
                  className="absolute -top-6 -right-6 w-16 h-16 bg-green-500 rounded-full opacity-10 blur-xl"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
                <motion.div 
                  className="absolute -bottom-6 -left-6 w-12 h-12 bg-emerald-500 rounded-full opacity-10 blur-xl"
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute -top-20 left-0 w-48 h-48 bg-green-200 rounded-full opacity-10 blur-2xl"></div>
          <div className="absolute -bottom-20 right-0 w-48 h-48 bg-emerald-200 rounded-full opacity-10 blur-2xl"></div>
          
          <div className="text-center mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block">
                Why Choose Our Plant Marketplace?
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-8">
                We connect plant lovers to share, buy, and sell beautiful plants in a trusted community
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {([
              {
                title: "Quality Plants",
                description: "Only the healthiest and most beautiful plants from verified sellers",
                icon: "🌿",
                delay: 0.1
              },
              {
                title: "Safe Transactions",
                description: "Secure payment system and verified seller profiles",
                icon: "🔒",
                delay: 0.2
              },
              {
                title: "Expert Advice",
                description: "Connect with experienced plant enthusiasts for care tips",
                icon: "💡",
                delay: 0.3
              }
            ]).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl text-center shadow-lg shadow-green-500/10 card-hover border border-green-100"
              >
                <motion.div 
                  className="text-4xl mb-4 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-green-100 to-emerald-100"
                  whileHover={{ scale: 1.1 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative inline-block"
            >
              What Our Community Says
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {([
              {
                quote: "Found the most beautiful rare plants here! The community is so helpful and knowledgeable.",
                author: "Sarah K.",
                role: "Plant Enthusiast"
              },
              {
                quote: "Selling my plants has never been easier. The platform connects me with genuine plant lovers.",
                author: "Michael T.",
                role: "Plant Seller"
              },
              {
                quote: "The quality of plants is exceptional. I've bought multiple plants and all arrived healthy.",
                author: "Emma L.",
                role: "Frequent Buyer"
              }
            ]).map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-lg shadow-green-500/5 card-hover border border-green-50"
              >
                <div className="text-yellow-400 text-2xl mb-3">★★★</div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold mr-3">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
