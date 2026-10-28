// Shopping Cart Context & Provider (User-Bound DB Persistent Cart)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState(null);
  const [cartChanges, setCartChanges] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch active DB cart on login; wipe immediately on logout
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
      setCartChanges([]);
      try {
        localStorage.removeItem('shopvilla_guest_cart');
      } catch (e) {}
    }
  }, [isAuthenticated]);

  // Fetch active DB cart and capture any inventory/price change notices
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.cart);
      if (res.data.changes && res.data.changes.length > 0) {
        setCartChanges(res.data.changes);
        res.data.changes.forEach((notice) => {
          showToast(notice, 'warning', 5000);
        });
      }
    } catch (err) {
      console.warn('[Cart Fetch Error]:', err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, showToast]);

  // Add item to cart (requires authentication)
  const addToCart = async (productId, quantity = 1, productSnapshot = null) => {
    if (!isAuthenticated) {
      throw new Error('Please log in to add items to your shopping bag.');
    }
    try {
      const res = await api.post('/cart/add', { productId, quantity });
      setCart(res.data.cart);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Update quantity of an item
  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) return;
    try {
      const res = await api.put('/cart/update', { productId, quantity });
      setCart(res.data.cart);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Remove single item
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;
    try {
      const res = await api.delete(`/cart/item/${productId}`);
      setCart(res.data.cart);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Clear all items
  const clearCart = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.delete('/cart/clear');
      setCart(res.data.cart);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Cart is strictly empty for unauthenticated visitors
  const items = isAuthenticated ? cart?.items || [] : [];
  const itemCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const subtotal = items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );
  const itemDeliveryCharges = items.reduce(
    (acc, item) => acc + (item.product?.deliveryCharge || 0) * item.quantity,
    0
  );
  const shippingFee = subtotal === 0
    ? 0
    : itemDeliveryCharges > 0
      ? itemDeliveryCharges
      : subtotal >= 500
        ? 0
        : 50;
  const totalAmount = subtotal + shippingFee;

  const value = {
    cart,
    items,
    itemCount,
    subtotal,
    shippingFee,
    totalAmount,
    cartChanges,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
