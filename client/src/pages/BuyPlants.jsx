import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlantCard from '../components/PlantCard';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading plants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Buy Plants</h1>
          <p className="mt-2 text-gray-600">Discover and purchase beautiful plants from our marketplace</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search plants..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
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
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No plants found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Plant Detail Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPlant.name}</h2>
                <button
                  onClick={handleCloseDetails}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  {selectedPlant.imageUrl ? (
                    <img
                      src={selectedPlant.imageUrl}
                      alt={selectedPlant.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">No image available</span>
                    </div>
                  )}
                </div>
                
                <div className="md:w-1/2">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Category</h3>
                      <p className="text-lg">{selectedPlant.category}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Price</h3>
                      <p className="text-2xl font-bold text-green-700">${selectedPlant.price.toFixed(2)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Care Level</h3>
                      <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        selectedPlant.careLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                        selectedPlant.careLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedPlant.careLevel}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                      <p className="text-lg">{selectedPlant.stock} available</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Seller</h3>
                      <p className="text-lg">{selectedPlant.seller?.name || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="text-gray-700">{selectedPlant.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-200"
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