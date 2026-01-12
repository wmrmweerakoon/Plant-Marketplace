import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const PlantCard = ({ plant, onViewDetails }) => {
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent triggering the view details action
    if (plant.stock > 0) {
      try {
        // Call addToCart and await the result
        // If addToCart throws an error (like for sellers), it will be caught here
        await addToCart(plant, 1);
        // Only show success toast if the operation completed without throwing an error
        toast.success(`${plant.name} added to cart!`);
      } catch (error) {
        // Error handling is already done in the addToCart function (alerts are shown there)
        // We don't show a success toast if there was an error
      }
    } else {
      toast.error('Sorry, this plant is out of stock.');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 glass-effect backdrop-blur-sm h-full flex flex-col"
    >
      <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-10 relative overflow-hidden flex items-center justify-center p-2">
        {plant.imageUrl ? (
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="max-h-full max-w-full object-contain transition-transform duration-30 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="text-center">
              <div className="text-4xl mb-2">🌿</div>
              <span className="text-gray-500 text-sm">No image</span>
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm border border-green-100">
          {plant.category}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{plant.name}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">{plant.description}</p>
        
        <div className="flex justify-between items-center mb-3">
          <span className="text-xl font-bold text-green-700">${plant.price.toFixed(2)}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            plant.careLevel === 'Easy' ? 'bg-green-100 text-green-800' :
            plant.careLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {plant.careLevel} Care
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {plant.stock} in stock
          </span>
          <span className="truncate max-w-[80px] text-right" title={plant.seller?.name || 'Unknown'}>{plant.seller?.name || 'Unknown'}</span>
        </div>
        
        <div className="flex space-x-2 mt-auto">
          <button
            onClick={() => onViewDetails(plant)}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-60 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-md shadow-green-500/20 font-medium"
          >
            View Details
          </button>
          <button
            onClick={handleAddToCart}
            disabled={plant.stock <= 0 || isInCart(plant._id)}
            className={`px-4 py-3 rounded-xl transition duration-200 ${
              plant.stock <= 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : isInCart(plant._id)
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 shadow-md shadow-blue-500/20'
            }`}
          >
            {isInCart(plant._id) ? '✓' : plant.stock <= 0 ? 'Out' : '+'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PlantCard;
