// Shopping Cart Context & Provider (DB Persistent & Guest LocalStorage Support)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState(null);
  const [guestItems, setGuestItems] = useState([]);
  const [cartChanges, setCartChanges] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load guest cart from localStorage on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('shopvilla_guest_cart');
      if (stored) {
        setGuestItems(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('[Cart Storage Error]:', err);
    }
  }, []);

  // Fetch or merge cart whenever authentication status updates
  useEffect(() => {
    if (isAuthenticated) {
      handleUserCartSync();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  // Synchronize and merge guest cart into DB upon authentication
  const handleUserCartSync = async () => {
    try {
      setLoading(true);
      let localItems = [];
      try {
        const stored = localStorage.getItem('shopvilla_guest_cart');
        if (stored) localItems = JSON.parse(stored);
      } catch (e) {}

      // If guest had items in localStorage, merge them into the user's DB cart
      if (localItems.length > 0) {
        const res = await api.post('/cart/merge', {
          guestItems: localItems.map((item) => ({
            productId: item.product?._id || item.productId,
            quantity: item.quantity,
          })),
        });
        setCart(res.data.cart);
        localStorage.removeItem('shopvilla_guest_cart');
        setGuestItems([]);
        if (res.data.changes && res.data.changes.length > 0) {
          setCartChanges(res.data.changes);
        }
      } else {
        await fetchCart();
      }
    } catch (err) {
      console.warn('[Cart Sync Warning]:', err.message);
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

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

  // Save guest items array to localStorage helper
  const saveGuestItems = (newItems) => {
    setGuestItems(newItems);
    try {
      localStorage.setItem('shopvilla_guest_cart', JSON.stringify(newItems));
    } catch (e) {
      console.warn('[LocalStorage Save Error]:', e);
    }
  };

  // Add item to cart (supports both authenticated DB and guest localStorage)
  const addToCart = async (productId, quantity = 1, productSnapshot = null) => {
    if (isAuthenticated) {
      try {
        const res = await api.post('/cart/add', { productId, quantity });
        setCart(res.data.cart);
        return res.data;
      } catch (err) {
        throw err;
      }
    } else {
      // Guest mode: update localStorage
      const existingIndex = guestItems.findIndex(
        (item) => (item.product?._id || item.productId) === productId
      );

      let updated;
      if (existingIndex > -1) {
        const currentQty = guestItems[existingIndex].quantity;
        const maxStock = productSnapshot?.stock || 99;
        const newQty = Math.min(currentQty + quantity, maxStock);
        updated = [...guestItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
      } else {
        updated = [
          ...guestItems,
          {
            productId,
            product: productSnapshot || { _id: productId, name: 'Product', price: 0 },
            quantity,
          },
        ];
      }
      saveGuestItems(updated);
      return { success: true };
    }
  };

  // Update quantity of an item
  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        const res = await api.put('/cart/update', { productId, quantity });
        setCart(res.data.cart);
        return res.data;
      } catch (err) {
        throw err;
      }
    } else {
      // Guest mode
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        const updated = guestItems.map((item) =>
          (item.product?._id || item.productId) === productId
            ? { ...item, quantity }
            : item
        );
        saveGuestItems(updated);
      }
    }
  };

  // Remove single item
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/item/${productId}`);
        setCart(res.data.cart);
        return res.data;
      } catch (err) {
        throw err;
      }
    } else {
      const updated = guestItems.filter(
        (item) => (item.product?._id || item.productId) !== productId
      );
      saveGuestItems(updated);
    }
  };

  // Clear all items
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const res = await api.delete('/cart/clear');
        setCart(res.data.cart);
        return res.data;
      } catch (err) {
        throw err;
      }
    } else {
      saveGuestItems([]);
    }
  };

  // Unified items list (authenticated DB items or guest items)
  const items = isAuthenticated ? cart?.items || [] : guestItems;
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
