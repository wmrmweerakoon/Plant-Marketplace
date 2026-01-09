import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Plant Marketplace</h3>
            <p className="text-gray-300">
              Connecting plant lovers to share, buy, and sell beautiful plants in a trusted community.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">Home</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">Login</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">Register</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Indoor Plants</li>
              <li className="text-gray-300">Outdoor Plants</li>
              <li className="text-gray-300">Succulents</li>
              <li className="text-gray-300">Flowering Plants</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@plantmarketplace.com</li>
              <li className="text-gray-300">Phone: +1 (55) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Plant Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
