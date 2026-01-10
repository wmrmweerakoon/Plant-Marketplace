import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';

const CartContext = createContext();

// Define the reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return {
        ...state,
        items: action.payload
      };
    
    case 'ADD_TO_CART':
      const items = state.items || [];
      // Add null check for action.payload.plant
      if (!action.payload.plant || !action.payload.plant._id) {
        console.warn('Cannot add item to cart: Invalid plant data', action.payload);
        return state;
      }
      const existingItem = items.find(item => item.plant && item.plant._id === action.payload.plant._id);
      
      if (existingItem) {
        return {
          ...state,
          items: items.map(item =>
            item.plant && item.plant._id === action.payload.plant._id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      } else {
        return {
          ...state,
          items: [...items, { ...action.payload, quantity: action.payload.quantity }]
        };
      }

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: (state.items || []).filter(item => item.plant && item.plant._id !== action.payload)
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: (state.items || []).map(item =>
          item.plant && item.plant._id === action.payload.plantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const isInitialLoadRef = useRef(true);

  // Load cart from sessionStorage on initial render if no user is logged in, or load from backend if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // User is logged in, load their cart from backend
      loadUserCartFromBackend();
    } else {
      // No user logged in, load cart from sessionStorage
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART_ITEMS', payload: parsedCart });
        } catch (error) {
          console.error('Error parsing cart from sessionStorage:', error);
        }
      }
    }
  }, []);

  // Save cart to sessionStorage when no user is logged in, or sync with backend when user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Only sync with backend if not the initial load (to prevent sync immediately after loading from backend)
      if (!isInitialLoadRef.current) {
        syncCartWithBackend();
      } else {
        // Reset the flag after the initial load
        isInitialLoadRef.current = false;
      }
    } else {
      // No user logged in, save to sessionStorage
      sessionStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  // Function to sync cart with backend when user is logged in
  const syncCartWithBackend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return; // Don't sync if user is not logged in

    try {
      // Get the current cart from the backend to compare with local state
      const response = await fetch('/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      let backendCart = [];
      if (response.ok) {
        const data = await response.json();
        backendCart = data.data.items || [];
      }

      // Find items that exist in local state but not in backend (need to be added/updated)
      const localItems = state.items || [];
      if (backendCart && Array.isArray(backendCart)) {
        for (const localItem of localItems) {
          // Add null check for localItem.plant
          if (!localItem.plant || !localItem.plant._id) {
            console.warn('Local cart item has invalid plant data:', localItem);
            continue;
          }
          
          const backendItem = backendCart.find(item => item.plant && item.plant._id === localItem.plant._id);
          if (!backendItem) {
            // Item doesn't exist in backend, add it
            await fetch('/api/cart/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                plantId: localItem.plant._id,
                quantity: localItem.quantity
              })
            });
          } else if (backendItem.quantity !== localItem.quantity) {
            // Item exists but quantity differs, update it
            await fetch(`/api/cart/update/${localItem.plant._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                quantity: localItem.quantity
              })
            });
          }
        }

        // Find items that exist in backend but not in local state (need to be removed)
        for (const backendItem of backendCart) {
          // Add null check for backendItem.plant
          if (!backendItem.plant || !backendItem.plant._id) {
            console.warn('Backend cart item has invalid plant data:', backendItem);
            continue;
          }
          
          const localItem = localItems.find(item => item.plant && item.plant._id === backendItem.plant._id);
          if (!localItem) {
            // Item exists in backend but not in local state, remove it
            await fetch(`/api/cart/remove/${backendItem.plant._id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }
            });
          }
        }
      } else {
        // If backendCart is not properly defined, we might need to send all local items to backend
        for (const localItem of localItems) {
          // Add null check for localItem.plant
          if (!localItem.plant || !localItem.plant._id) {
            console.warn('Local cart item has invalid plant data:', localItem);
            continue;
          }
          
          await fetch('/api/cart/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              plantId: localItem.plant._id,
              quantity: localItem.quantity
            })
          });
        }
      }
    } catch (error) {
      console.error('Error syncing cart with backend:', error);
    }
  };


  // Function to load user's cart from backend when they log in
  const loadUserCartFromBackend = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure data.data.items exists and is an array before dispatching
        if (data && data.data && Array.isArray(data.data.items)) {
          dispatch({ type: 'SET_CART_ITEMS', payload: data.data.items });
        } else {
          console.warn('Invalid cart data received from backend:', data);
          // Fallback to sessionStorage if backend data is invalid
          const savedCart = sessionStorage.getItem('cart');
          if (savedCart) {
            try {
              const parsedCart = JSON.parse(savedCart);
              dispatch({ type: 'SET_CART_ITEMS', payload: parsedCart });
            } catch (parseError) {
              console.error('Error parsing fallback cart from sessionStorage:', parseError);
            }
          } else {
            // Initialize with empty cart if no fallback available
            dispatch({ type: 'SET_CART_ITEMS', payload: [] });
          }
        }
      } else {
        console.error('Failed to load cart from backend:', response.status, response.statusText);
        // If loading from backend fails, try to load from sessionStorage as fallback
        const savedCart = sessionStorage.getItem('cart');
        if (savedCart) {
          try {
            const parsedCart = JSON.parse(savedCart);
            dispatch({ type: 'SET_CART_ITEMS', payload: parsedCart });
          } catch (parseError) {
            console.error('Error parsing fallback cart from sessionStorage:', parseError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user cart from backend:', error);
      // If loading from backend fails, try to load from sessionStorage as fallback
      const savedCart = sessionStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'SET_CART_ITEMS', payload: parsedCart });
        } catch (parseError) {
          console.error('Error parsing fallback cart from sessionStorage:', parseError);
        }
      }
    }
  };

  // Expose the function to load user's cart from backend
  const initializeUserCart = () => {
    loadUserCartFromBackend();
  };

  const addToCart = async (plant, quantity = 1) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, redirect to register page
      window.location.href = '/register';
      return;
    }

    // Update local state immediately
    dispatch({
      type: 'ADD_TO_CART',
      payload: { plant, quantity }
    });

    // Immediately sync with backend
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plantId: plant._id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        const errorText = await response.text(); // Use text() first to avoid JSON parsing errors
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          console.error('Error parsing error response:', e);
          errorData = { message: errorText || 'Unknown error occurred' };
        }
        console.error('Error adding item to cart:', errorData.message);
        // If backend sync fails, we'll still have the item in local state
        // and it will be synced later when possible
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // If backend sync fails, we'll still have the item in local state
      // and it will be synced later when possible
    }
  };

  const removeFromCart = async (plantId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: plantId
    });

    // Immediately sync with backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`/api/cart/remove/${plantId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); // Use text() first to avoid JSON parsing errors
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            console.error('Error parsing error response:', e);
            errorData = { message: errorText || 'Unknown error occurred' };
          }
          console.error('Error removing item from cart:', errorData.message);
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
  };

  const updateQuantity = async (plantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(plantId);
      return;
    }
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { plantId, quantity }
    });

    // Immediately sync with backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`/api/cart/update/${plantId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            quantity: quantity
          })
        });

        if (!response.ok) {
          const errorText = await response.text(); // Use text() first to avoid JSON parsing errors
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            console.error('Error parsing error response:', e);
            errorData = { message: errorText || 'Unknown error occurred' };
          }
          console.error('Error updating item quantity in cart:', errorData.message);
        }
      } catch (error) {
        console.error('Error updating item quantity in cart:', error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    // Immediately sync with backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch('/api/cart/clear', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text(); // Use text() first to avoid JSON parsing errors
          let errorData;
          try {
            errorData = JSON.parse(errorText);
          } catch (e) {
            console.error('Error parsing error response:', e);
            errorData = { message: errorText || 'Unknown error occurred' };
          }
          console.error('Error clearing cart:', errorData.message);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const getTotalItems = () => {
    return state.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getTotalPrice = () => {
    return state.items?.reduce((total, item) => total + (item.plant?.price * item.quantity || 0), 0) || 0;
  };

  const isInCart = (plantId) => {
    return state.items?.some(item => item.plant && item.plant._id === plantId) || false;
 };

  const getCartItems = () => {
    return state.items || [];
  };

  return (
    <CartContext.Provider value={{
      cart: state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      isInCart,
      getCartItems,
      initializeUserCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
