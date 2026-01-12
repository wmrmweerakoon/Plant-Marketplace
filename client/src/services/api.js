const API_BASE_URL = '/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Cart-specific API functions
export const cartApi = {
  getCart: () => apiRequest('/cart'),
  addToCart: (plantId, quantity = 1) => apiRequest('/cart/add', {
    method: 'POST',
    body: JSON.stringify({ plantId, quantity })
  }),
  updateCartItem: (plantId, quantity) => apiRequest(`/cart/update/${plantId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),
  removeCartItem: (plantId) => apiRequest(`/cart/remove/${plantId}`, {
    method: 'DELETE'
  }),
  clearCart: () => apiRequest('/cart/clear', {
    method: 'DELETE'
  }),
  getCartTotal: () => apiRequest('/cart/total')
};

// Admin Dashboard API functions
export const adminApi = {
  getDashboardStats: () => apiRequest('/admin/dashboard'),
};

// Other API functions can be added here as needed
export default apiRequest;
