import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { cartApi } from '../services/api';

const CartContext = createContext();

// Define the reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART_ITEMS':
      return {
        ...state,
        items: Array.isArray(action.payload) ? [...action.payload] : []
      };
    
    case 'ADD_TO_CART':
      const items = Array.isArray(state.items) ? [...state.items] : [];
      if (!action.payload.plant || !action.payload.plant._id) {
        console.warn('Cannot add item to cart: Invalid plant data', action.payload);
        return state;
      }
      const existingItemIndex = items.findIndex(item => 
        item.plant && item.plant._id === action.payload.plant._id
      );
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + action.payload.quantity
        };
        return {
          ...state,
          items: updatedItems
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
        items: Array.isArray(state.items) ? state.items.filter(item => 
          item.plant && item.plant._id !== action.payload
        ) : []
      };

    case 'UPDATE_QUANTITY':
      if (!Array.isArray(state.items)) {
        return state;
      }
      return {
        ...state,
        items: state.items.map(item =>
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

  // Load cart from backend on initial render when user is logged in
  useEffect(() => {
    const loadCart = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await cartApi.getCart();
          if (response.success && response.data) {
            dispatch({ type: 'SET_CART_ITEMS', payload: response.data.items || [] });
          }
        } catch (error) {
          console.error('Error loading cart from backend:', error);
        }
      }
    };
    
    loadCart();
  }, []);

  // Function to sync cart with backend
  const syncCartWithBackend = async (action, payload) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      let response;
      
      switch (action) {
        case 'ADD':
          response = await cartApi.addToCart(payload.plantId, payload.quantity);
          break;
        case 'REMOVE':
          response = await cartApi.removeCartItem(payload.plantId);
          break;
        case 'UPDATE':
          response = await cartApi.updateCartItem(payload.plantId, payload.quantity);
          break;
        case 'CLEAR':
          response = await cartApi.clearCart();
          break;
        default:
          break;
      }

      if (response.success && response.data) {
        dispatch({ type: 'SET_CART_ITEMS', payload: response.data.items || [] });
      }
    } catch (error) {
      console.error(`Error syncing cart with backend (${action}):`, error);
      // If backend sync fails, we'll still have the item in local state
      // and it will be synced later when possible
    }
  };

  const addToCart = async (plant, quantity = 1) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, redirect to login page
      window.location.href = '/login';
      return;
    }

    // Update local state immediately for better UX
    dispatch({
      type: 'ADD_TO_CART',
      payload: { plant, quantity }
    });

    // Sync with backend
    try {
      const response = await cartApi.addToCart(plant._id, quantity);
      if (!response.success) {
        // If the backend returned an error, revert the optimistic update
        const cartResponse = await cartApi.getCart();
        if (cartResponse.success && cartResponse.data) {
          dispatch({ type: 'SET_CART_ITEMS', payload: cartResponse.data.items || [] });
        }
        // Show error message to user
        alert(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Revert the optimistic update by refreshing the cart
      const cartResponse = await cartApi.getCart();
      if (cartResponse.success && cartResponse.data) {
        dispatch({ type: 'SET_CART_ITEMS', payload: cartResponse.data.items || [] });
      }
      // Show error message to user
      alert(error.message || 'An error occurred while adding the item to cart');
    }
  };

  const removeFromCart = async (plantId) => {
    // Sync with backend first to ensure the removal is processed on the server
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await cartApi.removeCartItem(plantId);
        if (response.success && response.data) {
          // Update local state with the cart data from the backend after removal
          dispatch({ type: 'SET_CART_ITEMS', payload: response.data.items || [] });
        } else {
          // If backend removal failed, try to remove from local state anyway
          dispatch({
            type: 'REMOVE_FROM_CART',
            payload: plantId
          });
        }
      } catch (error) {
        console.error('Error removing item from cart:', error);
        // If backend sync fails, still remove from local state
        dispatch({
          type: 'REMOVE_FROM_CART',
          payload: plantId
        });
      }
    } else {
      // If not logged in, just update local state
      dispatch({
        type: 'REMOVE_FROM_CART',
        payload: plantId
      });
    }
  };

  const updateQuantity = async (plantId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(plantId);
      return;
    }
    
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { plantId, quantity }
    });

    // Sync with backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await cartApi.updateCartItem(plantId, quantity);
        if (response.success && response.data) {
          // Update local state with the cart data from the backend after update
          dispatch({ type: 'SET_CART_ITEMS', payload: response.data.items || [] });
        } else {
          // If the backend rejected the update (e.g., due to insufficient stock),
          // revert the optimistic update by refreshing the cart
          console.error('Failed to update quantity:', response.message);
          const cartResponse = await cartApi.getCart();
          if (cartResponse.success && cartResponse.data) {
            dispatch({ type: 'SET_CART_ITEMS', payload: cartResponse.data.items || [] });
          }
          // Optionally show an error message to the user
          alert(response.message || 'Failed to update quantity');
        }
      } catch (error) {
        console.error('Error updating item quantity in cart:', error);
        // Revert the optimistic update by refreshing the cart
        const cartResponse = await cartApi.getCart();
        if (cartResponse.success && cartResponse.data) {
          dispatch({ type: 'SET_CART_ITEMS', payload: cartResponse.data.items || [] });
        }
        // Show error message to user
        alert(error.message || 'An error occurred while updating the quantity');
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    // Sync with backend
    await syncCartWithBackend('CLEAR', {});
  };

  const getTotalItems = () => {
    return state.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getTotalPrice = () => {
    return state.items?.reduce((total, item) => 
      total + (item.plant?.price * item.quantity || 0), 0
    ) || 0;
  };

  const isInCart = (plantId) => {
    return state.items?.some(item => 
      item.plant && item.plant._id === plantId
    ) || false;
 };

  const getCartItems = () => {
    return state.items || [];
 };

  const refreshCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART_ITEMS', payload: response.data.items || [] });
      }
    } catch (error) {
      console.error('Error refreshing cart from backend:', error);
    }
  };

  const initializeUserCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await cartApi.getCart();
      if (response.success && response.data) {
        dispatch({ type: 'SET_CART_ITEMS', payload: response.data.items || [] });
      }
    } catch (error) {
      console.error('Error initializing user cart:', error);
    }
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
      refreshCart,
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
