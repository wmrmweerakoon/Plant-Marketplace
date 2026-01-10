import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PlantCard from '../components/PlantCard';
import { toast } from 'react-toastify';

// Import the background image
import backgroundImage from '../assets/modern, organized indoor plant nursery.png';

const BuyPlants = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white relative overflow-hidden"
           style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-emerald-100/20 z-0"></div> {/* Semi-transparent overlay to blend image with content */}
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium drop-shadow-sm">Loading plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden pt-16"
         style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-emerald-100/20 z-0"></div> {/* Semi-transparent overlay to blend image with content */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-xl"></div>

      {/* Filters Section */}
      <section className="py-12 relative z-10 bg-white/80 backdrop-blur-sm glass-effect mx-4 md:mx-8 rounded-2xl shadow-lg border border-white/30 mt-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Plant</h2>
            <p className="text-gray-600">Filter our collection to find exactly what you're looking for</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Search Plants</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm glass-effect shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm glass-effect shadow-sm"
              >
                <option value="All">All Categories</option>
                <option value="Vegetable">Vegetable</option>
                <option value="Flower">Flower</option>
                <option value="Medicinal">Medicinal</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Care Level</label>
              <select
                value={filters.careLevel}
                onChange={(e) => setFilters({...filters, careLevel: e.target.value})}
                className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-white/80 backdrop-blur-sm glass-effect shadow-sm"
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <div className="flex items-end pb-1">
              <button
                onClick={() => {
                  setFilters({category: 'All', careLevel: 'All', search: ''});
                  toast.info('Filters cleared!');
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-md shadow-green-500/20 font-medium"
              >
                Clear All
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
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
              <div className="col-span-full text-center py-16 bg-white/80 backdrop-blur-sm glass-effect rounded-2xl p-12 border border-white/30 shadow-lg mt-6">
                <div className="text-7xl mb-6">🌿</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No plants found</h3>
                <p className="text-gray-600 text-lg max-w-md mx-auto">Try adjusting your filters or check back later for new listings.</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 relative">
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedPlant.name}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-800 text-2xl transition duration-200 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/5">
                  {selectedPlant.imageUrl ? (
                    <div className="overflow-hidden rounded-xl shadow-md mb-6">
                      <img
                        src={selectedPlant.imageUrl}
                        alt={selectedPlant.name}
                        className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-60 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center shadow-inner mb-6 border-2 border-dashed border-gray-200">
                      <div className="text-center p-4">
                        <div className="text-4xl mb-2 text-green-400">🌿</div>
                        <span className="text-gray-500 text-sm">No image available</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Plant Information</h3>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <span className="text-gray-600 text-sm">Category</span>
                      <span className="font-medium text-gray-900">{selectedPlant.category}</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <span className="text-gray-600 text-sm">Care Level</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedPlant.careLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                        selectedPlant.careLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedPlant.careLevel}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <span className="text-gray-600 text-sm">In Stock</span>
                      <span className="font-medium text-gray-900">{selectedPlant.stock} units</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 last:pb-0">
                      <span className="text-gray-600 text-sm">Seller</span>
                      <span className="font-medium text-gray-900">{selectedPlant.seller?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-3/5 space-y-6">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedPlant.description}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 text-center border border-green-100">
                    <div className="text-3xl font-bold text-green-700 mb-1">${selectedPlant.price.toFixed(2)}</div>
                    <p className="text-gray-600 text-sm mb-4">per unit</p>
                    <button
                      onClick={() => navigate('/contact-seller', { state: { selectedPlant } })}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-md text-base font-medium"
                    >
                      Contact Seller
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Care Instructions</h3>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>Place in bright, indirect sunlight</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>Water when soil feels dry to touch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>Maintain room temperature between 65-75°F</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span>Fertilize monthly during growing season</span>
                      </li>
                    </ul>
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
