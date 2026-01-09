import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const PlantCard = ({ plant, onViewDetails }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent triggering the view details action
    if (plant.stock > 0) {
      addToCart(plant, 1);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
    >
      <div className="h-48 bg-gray-200 relative">
        {plant.imageUrl ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-medium">
          {plant.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{plant.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{plant.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-green-700">${plant.price.toFixed(2)}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            plant.careLevel === 'Easy' ? 'bg-green-100 text-green-800' :
            plant.careLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {plant.careLevel} Care
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span>In Stock: {plant.stock}</span>
          <span>Seller: {plant.seller?.name || 'Unknown'}</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(plant)}
            className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            disabled={plant.stock <= 0 || isInCart(plant._id)}
            className={`px-3 py-2 rounded-md transition duration-200 ${
              plant.stock <= 0 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : isInCart(plant._id)
                  ? 'bg-green-400 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isInCart(plant._id) ? 'Added' : plant.stock <= 0 ? 'Out of Stock' : '+'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantCard;