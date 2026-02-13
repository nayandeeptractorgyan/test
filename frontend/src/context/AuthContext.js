import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAdmin = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setAdmin(response.data);
    } catch (error) {
      console.error('Error loading admin:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token, admin } = response.data;
    localStorage.setItem('adminToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAdmin(admin);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
