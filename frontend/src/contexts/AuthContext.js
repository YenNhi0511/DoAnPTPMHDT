import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (data) => {
    const response = await apiRegister(data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const isRecruiter = user?.role === 'RECRUITER' || user?.role === 'ADMIN';
  const isAdmin = user?.role === 'ADMIN';
  const isInterviewer = user?.role === 'INTERVIEWER' || isRecruiter;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isRecruiter, isAdmin, isInterviewer }}>
      {children}
    </AuthContext.Provider>
  );
};

