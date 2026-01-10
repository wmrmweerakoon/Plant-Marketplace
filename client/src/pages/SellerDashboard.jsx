import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import sellerImage from '../assets/seller.png';

const SellerDashboard = ({ setHideNavbar }) => {
  const [activeTab, setActiveTab] = useState('listings'); // listings or sales
  const [plants, setPlants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlantId, setCurrentPlantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetable',
    price: '',
    stock: '',
    description: '',
    careLevel: 'Easy',
    image: null,
    imageUrl: ''
  });
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const [trackingData, setTrackingData] = useState({
    expectedDeliveryDate: '',
    currentLocation: '',
    status: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Notify parent component to hide navbar when any modal is open
    if (setHideNavbar) {
      setHideNavbar(isModalOpen || showTrackingModal);
    }
  }, [isModalOpen, showTrackingModal, setHideNavbar]);

  const navigate = useNavigate();

  // Fetch seller's plants
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/plants/seller', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

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
  }, [navigate]);

  // Fetch seller's orders
  useEffect(() => {
    if (activeTab === 'sales') {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            return;
          }

          const response = await fetch('/api/orders/seller-orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();
          if (response.ok) {
            setOrders(data.data);
          } else {
            console.error('Error fetching orders:', data.message);
          }
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setOrdersLoading(false);
        }
      };

      fetchOrders();
    }
  }, [activeTab, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.careLevel) newErrors.careLevel = 'Care level is required';
    // Image is optional - no longer requiring imageUrl when image file is provided

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('careLevel', formData.careLevel);
      formDataToSend.append('imageUrl', formData.imageUrl); // fallback URL if no image is uploaded
      
      // Add image file if selected
      if (formData.image) {
        formDataToSend.append('image', formData.image, formData.image.name);
      }

      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        // Add the new plant to the list
        setPlants([...plants, data.data]);
        setIsModalOpen(false);
        setFormData({
          name: '',
          category: 'Vegetable',
          price: '',
          stock: '',
          description: '',
          careLevel: 'Easy',
          image: null,
          imageUrl: ''
        });
      } else {
        console.error('Error creating plant:', data.message);
      }
    } catch (error) {
      console.error('Error creating plant:', error);
    }
  };

  const handleEdit = (plant) => {
    setFormData({
      name: plant.name,
      category: plant.category,
      price: plant.price,
      stock: plant.stock,
      description: plant.description,
      careLevel: plant.careLevel,
      image: null, // Don't prefill with existing image file
      imageUrl: plant.imageUrl || ''
    });
    setCurrentPlantId(plant._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('careLevel', formData.careLevel);
      formDataToSend.append('imageUrl', formData.imageUrl); // fallback URL if no image is uploaded
      
      // Add image file if selected
      if (formData.image) {
        formDataToSend.append('image', formData.image, formData.image.name);
      }

      const response = await fetch(`/api/plants/${currentPlantId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        // Update the plant in the list
        setPlants(plants.map(plant => plant._id === currentPlantId ? data.data : plant));
        setIsModalOpen(false);
        setIsEditing(false);
        setCurrentPlantId(null);
        setFormData({
          name: '',
          category: 'Vegetable',
          price: '',
          stock: '',
          description: '',
          careLevel: 'Easy',
          image: null,
          imageUrl: ''
        });
      } else {
        console.error('Error updating plant:', data.message);
      }
    } catch (error) {
      console.error('Error updating plant:', error);
    }
  };

  const handleDelete = async (plantId) => {
    if (!window.confirm('Are you sure you want to delete this plant listing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/plants/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        setPlants(plants.filter(plant => plant._id !== plantId));
      } else {
        console.error('Error deleting plant:', data.message);
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });

      const data = await response.json();

      if (response.ok) {
        // Update the order status in the local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
      } else {
        console.error('Error updating order status:', data.message);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const updateTrackingInfo = async (orderId, trackingInfo) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`/api/orders/${orderId}/tracking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trackingInfo)
      });

      const data = await response.json();

      if (response.ok) {
        // Update the order tracking info in the local state
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, trackingInfo: data.data.trackingInfo } : order
        ));
        setShowTrackingModal(false);
        setTrackingData({
          expectedDeliveryDate: '',
          currentLocation: '',
          status: '',
          notes: ''
        });
      } else {
        console.error('Error updating tracking info:', data.message);
      }
    } catch (error) {
      console.error('Error updating tracking info:', error);
    }
  };

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Determine the status to use - prioritize the dropdown selection
    let statusToUse = trackingData.status;
    if (!statusToUse) {
      // If no status selected in dropdown, use the order status
      const order = orders.find(o => o._id === currentOrderId);
      statusToUse = order?.orderStatus || '';
    }

    const trackingInfo = {
      ...(trackingData.expectedDeliveryDate && { expectedDeliveryDate: trackingData.expectedDeliveryDate }),
      ...(trackingData.currentLocation && { currentLocation: trackingData.currentLocation }),
      ...(statusToUse && { status: statusToUse }),
      ...(trackingData.notes && { notes: trackingData.notes })
    };

    await updateTrackingInfo(currentOrderId, trackingInfo);
  };

  const openTrackingModal = (orderId) => {
    setCurrentOrderId(orderId);
    setShowTrackingModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && activeTab === 'listings') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-60">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (ordersLoading && activeTab === 'sales') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-60">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24 relative overflow-hidden"
         style={{ backgroundImage: `url(${sellerImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      {/* Animated background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blur-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-20 right-20 w-80 h-80 bg-teal-20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-400"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 to-emerald-100/70 z-0"></div> {/* Increased opacity for better content visibility */}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent">Seller Dashboard</h1>
          </div>
          <p className="mt-2 text-gray-700 font-medium">Manage your plant listings and sales</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Total Listings</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600 mt-2">{plants.length}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Sales This Month</h3>
            </div>
            <p className="text-3xl font-bold text-green-600 mt-2">$0</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Active Listings</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600 mt-2">{plants.filter(plant => plant.stock > 0).length}</p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
              activeTab === 'listings'
                ? 'border-b-2 border-green-600 text-green-600 bg-white/80 backdrop-blur-lg border-t border-l border-r rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('listings')}
          >
            Plant Listings
          </button>
          <button
            className={`py-3 px-6 font-medium text-sm rounded-t-lg ${
              activeTab === 'sales'
                ? 'border-b-2 border-green-600 text-green-600 bg-white/80 backdrop-blur-lg border-t border-l border-r rounded-t-lg'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('sales')}
          >
            Manage Sales
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'listings' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Your Plant Listings</h2>
                  <p className="text-sm text-gray-600">Manage your plant inventory and details</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-md font-medium flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Plant</span>
              </motion.button>
            </div>

            {plants.length === 0 ? (
              <div className="text-center py-16 rounded-xl bg-white/30 backdrop-blur-sm border border-white/50">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No plants listed yet</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first plant to your store</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl hover:from-green-700 hover:to-emerald-700 transition duration-200 shadow-md font-medium"
                >
                  Add Your First Plant
                </motion.button>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200/50 shadow-sm bg-white/50 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200/50">
                    <thead className="bg-white/70 backdrop-blur-sm">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Plant Name
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-70 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Stock
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-70 uppercase tracking-wider">
                          Care Level
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 bg-white/40 backdrop-blur-sm">
                      {plants.map((plant) => (
                        <tr key={plant._id} className="hover:bg-white/70 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden mr-3">
                                {plant.imageUrl ? (
                                  <img
                                    src={plant.imageUrl}
                                    alt={plant.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-50 text-xs bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <span>{plant.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              plant.category === 'Vegetable' ? 'bg-green-100 text-green-800' :
                              plant.category === 'Flower' ? 'bg-pink-100 text-pink-80' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {plant.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${plant.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              plant.stock > 10 ? 'bg-green-100 text-green-800' :
                              plant.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {plant.stock} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              plant.careLevel === 'Easy' ? 'bg-green-100 text-green-800' :
                              plant.careLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {plant.careLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-3 py-4">
                            <button 
                              onClick={() => handleEdit(plant)}
                              className="text-blue-600 hover:text-blue-900 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 0 0-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(plant._id)}
                              className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center space-x-1"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Manage Sales</h2>
                <p className="text-sm text-gray-600">Track and update your customer orders</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 rounded-xl bg-white/30 backdrop-blur-sm border border-white/50">
                <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                <p className="text-gray-600 mb-4">When customers purchase your plants, they'll appear here for you to manage.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order._id} className="border border-gray-200/50 rounded-2xl p-6 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-gray-200/50">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Order #{order._id.substring(0, 8)}</h3>
                        <p className="text-sm text-gray-700 mt-1">Customer: <span className="font-medium">{order.buyer?.name || 'N/A'}</span></p>
                        <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 pb-4 border-b border-gray-200/50">
                      <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 0 016 0z" />
                        </svg>
                        <span>Shipping Address</span>
                      </h4>
                      <p className="text-sm text-gray-700 pl-6">{order.shippingAddress}</p>
                    </div>

                    <div className="mb-6 pb-4 border-b border-gray-200/50">
                      <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span>Order Items</span>
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-white/70 rounded-xl p-4 shadow-sm">
                            <div className="flex items-center">
                              <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden mr-4 flex-shrink-0">
                                {item.plant.imageUrl ? (
                                  <img
                                    src={item.plant.imageUrl}
                                    alt={item.plant.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-50 text-xs bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="font-medium text-gray-900 block">{item.plant.name}</span>
                                <span className="text-gray-600 text-xs">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-gray-900 font-bold">${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center pt-4 gap-4">
                      <div className="text-lg font-bold text-gray-900">Total: <span className="text-green-600">${order.totalAmount.toFixed(2)}</span></div>
                      <div className="flex space-x-2 flex-wrap justify-end gap-2">
                        {order.orderStatus !== 'Delivered' && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'Processing')}
                              disabled={order.orderStatus === 'Processing'}
                              className={`px-4 py-2 text-sm rounded-lg ${
                                order.orderStatus === 'Processing'
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200'
                              }`}
                            >
                              Processing
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'Shipped')}
                              disabled={order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered'}
                              className={`px-4 py-2 text-sm rounded-lg ${
                                order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered'
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors duration-200'
                              }`}
                            >
                              Mark as Shipped
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order._id, 'Delivered')}
                              disabled={order.orderStatus === 'Delivered'}
                              className={`px-4 py-2 text-sm rounded-lg ${
                                order.orderStatus === 'Delivered'
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200'
                              }`}
                            >
                              Mark as Delivered
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openTrackingModal(order._id)}
                          className="px-4 py-2 text-sm rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200 flex items-center space-x-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Tracking</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Add Plant Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 pt-16"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200/50">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Plant' : 'Add New Plant'}</h3>
                    <p className="text-sm text-gray-600">{isEditing ? 'Update your plant details' : 'Add a new plant to your store'}</p>
                  </div>
                </div>
                
                <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Plant Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Enter plant name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1 pl-1">{errors.name}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl ${
                            errors.category ? 'border-red-500' : 'border-gray-300'
                          } bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                        >
                          <option value="Vegetable">Vegetable</option>
                          <option value="Flower">Flower</option>
                          <option value="Medicinal">Medicinal</option>
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Care Level</label>
                        <select
                          name="careLevel"
                          value={formData.careLevel}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl ${
                            errors.careLevel ? 'border-red-500' : 'border-gray-300'
                          } bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        {errors.careLevel && <p className="text-red-500 text-xs mt-1">{errors.careLevel}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          min="0"
                          step="0.01"
                          className={`w-full px-4 py-3 border rounded-xl ${
                            errors.price ? 'border-red-500' : 'border-gray-300'
                          } bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                          placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1 pl-1">{errors.price}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                        <input
                          type="number"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                          min="0"
                          className={`w-full px-4 py-3 border rounded-xl ${
                            errors.stock ? 'border-red-500' : 'border-gray-300'
                          } bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                          placeholder="0"
                        />
                        {errors.stock && <p className="text-red-500 text-xs mt-1 pl-1">{errors.stock}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white/70 backdrop-blur-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 mt-2">Upload a plant image (JPG, PNG)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-xl ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        } bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none`}
                        placeholder="Enter plant description"
                      ></textarea>
                      {errors.description && <p className="text-red-500 text-xs mt-1 pl-1">{errors.description}</p>}
                    </div>
                  </div>
                  
                  <div className="pt-6 flex justify-end space-x-3 border-t border-gray-200/50">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md font-medium"
                    >
                      {isEditing ? 'Update Plant' : 'Add Plant'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tracking Update Modal */}
        <AnimatePresence>
          {showTrackingModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowTrackingModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-full max-w-md p-6 border border-white/50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Update Tracking Information</h3>
                </div>
                
                <form onSubmit={handleTrackingSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                      <input
                        type="date"
                        value={trackingData.expectedDeliveryDate}
                        onChange={(e) => setTrackingData({...trackingData, expectedDeliveryDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
                      <input
                        type="text"
                        value={trackingData.currentLocation}
                        onChange={(e) => setTrackingData({...trackingData, currentLocation: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/50"
                        placeholder="Enter current location of shipment"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={trackingData.status}
                        onChange={(e) => setTrackingData({...trackingData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/50"
                      >
                        <option value="">Select Status</option>
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        value={trackingData.notes}
                        onChange={(e) => setTrackingData({...trackingData, notes: e.target.value})}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white/50"
                        placeholder="Additional notes about the shipment"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowTrackingModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                    >
                      Update Tracking
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellerDashboard;
