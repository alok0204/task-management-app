import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { getAuthToken } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socketService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await authService.getMe();
        setUser(currentUser);
        connectSocket();
      } catch (err) {
        console.warn('Failed to restore user session:', err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      connectSocket();
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      connectSocket();
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      disconnectSocket();
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser((prev) => ({ ...prev, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
