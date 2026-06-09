import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Set base backend URL for Axios
  axios.defaults.baseURL = 'http://localhost:8080';

  useEffect(() => {
    // 1. Restore Auth Session
    const storedUser = localStorage.getItem('epms_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Inject bearer token into default axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }

    // 2. Restore Theme Preference
    const storedTheme = localStorage.getItem('epms_theme') || 'light';
    setTheme(storedTheme);
    if (storedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('epms_user', JSON.stringify(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid credentials or connection error'
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('epms_user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('epms_theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, theme, toggleTheme }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
