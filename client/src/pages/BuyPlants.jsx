import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlantCard from '../components/PlantCard';
import pottedPlantsImage from '../assets/Rows of neatly organized potted plants.png';

const BuyPlants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    careLevel: 'All',
    search: ''
  });

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('/api/plants');
        const data = await response.json();
        
        if (response.ok) {
          setPlants(data.data);
        } else {
          console.error('Error fetching plants:', data.message);
        }
      } catch (error) {
        console.error('Error fetching plants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, []);

  // Filter plants based on filters
  const filteredPlants = plants.filter(plant => {
    const matchesCategory = filters.category === 'All' || plant.category === filters.category;
    const matchesCareLevel = filters.careLevel === 'All' || plant.careLevel === filters.careLevel;
    const matchesSearch = plant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          plant.description.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesCategory && matchesCareLevel && matchesSearch;
  });

  const handleViewDetails = (plant) => {
    setSelectedPlant(plant);
  };

  const handleCloseDetails = () => {
    setSelectedPlant(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>

      {/* Hero Section with Image */}
      <section className="relative py-16 md:py-24 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-20"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight relative z-10">
                Discover Beautiful <span className="text-green-700">Plants</span> for Sale
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg relative z-10">
                Explore our curated collection of healthy, vibrant plants from trusted sellers. Find the perfect addition to your garden or home today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-800 transition duration-300 shadow-lg shadow-green-500/20 btn-animated"
                >
                  Browse Plants
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-medium hover:bg-green-50 transition duration-300 shadow-lg shadow-green-500/10 btn-animated"
                >
                  Filter Plants
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
                    src={pottedPlantsImage} 
                    alt="Rows of neatly organized potted plants" 
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

      {/* Filters Section */}
      <section className="py-12 relative z-10 bg-white/80 backdrop-blur-sm glass-effect mx-4 md:mx-8 rounded-2xl shadow-lg border border-white/30 mt-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Plant</h2>
            <p className="text-gray-600">Filter our collection to find exactly what you're looking for</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search plants..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm glass-effect"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm glass-effect"
              >
                <option value="All">All Categories</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Flower">Flower</option>
                <option value="Medicinal">Medicinal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Care Level</label>
              <select
                value={filters.careLevel}
                onChange={(e) => setFilters({...filters, careLevel: e.target.value})}
                className="w-full px-4 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm glass-effect"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({category: 'All', careLevel: 'All', search: ''})}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-md shadow-green-500/20"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plant Grid Section */}
      <section className="pb-16 relative z-10 mx-4 md:mx-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Available Plants</h2>
            <p className="text-gray-600">Browse our selection of healthy, beautiful plants</p>
          </motion.div>

          {/* Plant Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <PlantCard
                  key={plant._id}
                  plant={plant}
                  onViewDetails={handleViewDetails}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white/80 backdrop-blur-sm glass-effect rounded-2xl p-8 border border-white/30 shadow-lg">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No plants found</h3>
                <p className="text-gray-600">Try adjusting your filters or check back later for new listings.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-green-100 glass-effect backdrop-blur-md">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-900">{selectedPlant.name}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 text-3xl transition duration-200"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/5">
                  {selectedPlant.imageUrl ? (
                    <img
                      src={selectedPlant.imageUrl}
                      alt={selectedPlant.name}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-gray-500 text-lg">No image available</span>
                    </div>
                  )}
                </div>
                
                <div className="md:w-3/5 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="text-lg font-semibold">{selectedPlant.category}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-500">Price</h3>
                      <p className="text-2xl font-bold text-green-700">${selectedPlant.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-500">Care Level</h3>
                      <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedPlant.careLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                        selectedPlant.careLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedPlant.careLevel}
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                      <p className="text-lg font-semibold">{selectedPlant.stock} available</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Seller</h3>
                    <p className="text-lg">{selectedPlant.seller?.name || 'Unknown'}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-gray-700">{selectedPlant.description}</p>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-lg shadow-green-500/30 text-lg font-medium"
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyPlants;
