import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = ({ toggleTheme, darkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in and get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]); // Re-run when location changes

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-effect py-2 shadow-lg' : 'py-4'} backdrop-blur-md`} style={{ background: 'rgba(255, 255, 255, 0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg transform group-hover:scale-105 transition-transform duration-300">
                <span className="text-xl font-bold text-white">🌿 LeafLink</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1 relative">
            <Link to="/" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-700 hover:shadow-md hover:scale-105 relative group">
              <span className={`${location.pathname === '/' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>Home</span>
              {location.pathname === '/' && (
                <motion.div
                  layoutId="navbarIndicator"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                />
              )}
            </Link>
            {(user && user.role !== 'seller') || !user ? (
              <Link to="/buy-plants" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:shadow-md hover:scale-105 relative group">
                <span className={`${location.pathname === '/buy-plants' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>Buy Plants</span>
                {location.pathname === '/buy-plants' && (
                  <motion.div
                    layoutId="navbarIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                  />
                )}
              </Link>
            ) : null}
            {user && user.role === 'buyer' && (
              <Link to="/plant-care-assistant" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:shadow-md hover:scale-105 relative group">
                <span className={`${location.pathname === '/plant-care-assistant' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>Plant Care</span>
                {location.pathname === '/plant-care-assistant' && (
                  <motion.div
                    layoutId="navbarIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                  />
                )}
              </Link>
            )}
            
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <Link to="/my-orders" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:shadow-md hover:scale-105 relative group">
                    <span className={`${location.pathname === '/my-orders' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>My Orders</span>
                    {location.pathname === '/my-orders' && (
                      <motion.div
                        layoutId="navbarIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                      />
                    )}
                  </Link>
                )}
                {user.role === 'seller' && (
                  <Link to="/seller-dashboard" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:shadow-md hover:scale-105 relative group">
                    <span className={`${location.pathname === '/seller-dashboard' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>Seller Dashboard</span>
                    {location.pathname === '/seller-dashboard' && (
                      <motion.div
                        layoutId="navbarIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                      />
                    )}
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:shadow-md hover:scale-105 relative group">
                    <span className={`${location.pathname === '/admin/dashboard' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>Admin Dashboard</span>
                    {location.pathname === '/admin/dashboard' && (
                      <motion.div
                        layoutId="navbarIndicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                      />
                    )}
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-700 hover:shadow-md hover:scale-105 text-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:shadow-md hover:scale-105 relative group">
                  <span className={`${location.pathname === '/login' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>Login</span>
                  {location.pathname === '/login' && (
                    <motion.div
                      layoutId="navbarIndicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                    />
                  )}
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:shadow-md hover:scale-105 relative group">
                  <span className={`${location.pathname === '/register' ? 'text-green-700 font-bold' : 'text-gray-800'}`}>Register</span>
                  {location.pathname === '/register' && (
                    <motion.div
                      layoutId="navbarIndicator"
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-full"
                    />
                  )}
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Floating Cart Icon - only show for buyers */}
            {user && user.role === 'buyer' && (
              <div className="flex items-center relative ml-2">
                <Link to="/cart" className="relative p-2 group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-800 group-hover:text-green-700 transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                    </svg>
                  </motion.div>
                  {getTotalItems() > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md"
                    >
                      {getTotalItems()}
                    </motion.div>
                  )}
                </Link>
              </div>
            )}
          </div>
          
          <div className="-mr-2 flex items-center md:hidden relative z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:bg-white/20 focus:outline-none"
            >
              <motion.svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                whileHover={{ scale: 1.1 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </motion.svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass-effect backdrop-blur-md"
          style={{ background: 'rgba(255, 255, 255, 0.15)' }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/' ? 'text-green-700 font-bold' : 'text-gray-800'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {(user && user.role !== 'seller') || !user ? (
              <Link
                to="/buy-plants"
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/buy-plants' ? 'text-green-700 font-bold' : 'text-gray-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Buy Plants
              </Link>
            ) : null}
            {user && user.role === 'buyer' && (
              <Link
                to="/plant-care-assistant"
                className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/plant-care-assistant' ? 'text-green-700 font-bold' : 'text-gray-800'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Plant Care
              </Link>
            )}
            
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <Link
                    to="/my-orders"
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/my-orders' ? 'text-green-700 font-bold' : 'text-gray-800'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                )}
                {user.role === 'seller' && (
                  <Link
                    to="/seller-dashboard"
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/seller-dashboard' ? 'text-green-700 font-bold' : 'text-gray-800'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Seller Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/admin/dashboard' ? 'text-green-700 font-bold' : 'text-gray-800'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-700 hover:scale-[1.02] text-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/login' ? 'text-green-700 font-bold' : 'text-gray-800'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 hover:bg-white/20 hover:text-green-70 hover:scale-[1.02] ${location.pathname === '/register' ? 'text-green-70 font-bold' : 'text-gray-800'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
            
            {/* Mobile cart only */}
            <div className="px-3 py-2 flex justify-end">
              {user && user.role === 'buyer' && (
                <Link to="/cart" className="relative p-2 group">
                  <div className="text-gray-800 group-hover:text-green-700 transition-colors duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                    </svg>
                  </div>
                  {getTotalItems() > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {getTotalItems()}
                    </div>
                  )}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
