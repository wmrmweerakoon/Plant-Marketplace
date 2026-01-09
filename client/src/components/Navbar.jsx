import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { getTotalItems } = useCart();

  useEffect(() => {
    // Check if user is logged in and get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location]); // Re-run when location changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav className="bg-green-700 text-white shadow-md relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold">Plant Marketplace</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4 relative">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-60 transition duration-150 ease-in-out">
              Home
            </Link>
            {(user && user.role !== 'seller') || !user ? (
              <Link to="/buy-plants" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition duration-150 ease-in-out">
                Buy Plants
              </Link>
            ) : null}
            
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <Link to="/my-orders" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition duration-150 ease-in-out">
                    My Orders
                  </Link>
                )}
                {user.role === 'seller' && (
                  <Link to="/seller-dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition duration-150 ease-in-out">
                    Seller Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition duration-150 ease-in-out">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-60 transition duration-150 ease-in-out"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition duration-150 ease-in-out">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition duration-150 ease-in-out">
                  Register
                </Link>
              </>
            )}
          </div>
          
          {/* Floating Cart Icon - only show for buyers */}
          {user && user.role === 'buyer' && (
            <div className="flex items-center relative">
              <Link to="/cart" className="relative p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2" />
                </svg>
                {getTotalItems() > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.div>
                )}
              </Link>
            </div>
          )}
          
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-600 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-60"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {(user && user.role !== 'seller') || !user ? (
              <Link
                to="/buy-plants"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Buy Plants
              </Link>
            ) : null}
            
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <Link
                    to="/my-orders"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                )}
                {user.role === 'seller' && (
                  <Link
                    to="/seller-dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Seller Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
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
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-60"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
