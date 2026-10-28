// Authentication Context & Provider
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopvilla_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopvilla_token') || null);
  const [loading, setLoading] = useState(true);

  // Restore session / verify token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('shopvilla_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('shopvilla_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('[Session Expiraton]:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('shopvilla_token', receivedToken);
    localStorage.setItem('shopvilla_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const register = async (name, email, phone, password) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      phone,
      password,
    });
    return res.data;
  };

  const verifyOtp = async (email, otp) => {
    const res = await api.post('/auth/verify-otp', { email, otp });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('shopvilla_token', receivedToken);
    localStorage.setItem('shopvilla_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const resendOtp = async (email) => {
    const res = await api.post('/auth/resend-otp', { email });
    return res.data;
  };

  const forgotPassword = async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const res = await api.post('/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
    const { token: receivedToken, user: receivedUser } = res.data;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('shopvilla_token', receivedToken);
    localStorage.setItem('shopvilla_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}

    setUser(null);
    setToken(null);
    localStorage.removeItem('shopvilla_token');
    localStorage.removeItem('shopvilla_user');
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
      localStorage.setItem('shopvilla_user', JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  const addAddress = async (addressData) => {
    const res = await api.post('/addresses', addressData);
    await refreshUser();
    return res.data;
  };

  const updateAddress = async (addressId, addressData) => {
    const res = await api.put(`/addresses/${addressId}`, addressData);
    await refreshUser();
    return res.data;
  };

  const deleteAddress = async (addressId) => {
    const res = await api.delete(`/addresses/${addressId}`);
    await refreshUser();
    return res.data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  };

  const setDefaultAddress = async (addressId) => {
    const res = await api.patch(`/addresses/${addressId}/default`);
    await refreshUser();
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    refreshUser,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
