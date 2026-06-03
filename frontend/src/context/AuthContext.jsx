import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUserProfile } from '../services/authApi';

const AuthContext = createContext(null);

export const ROLES = {
  OPERATOR: 'Operator',
  MASTER: 'Master',
  TECH_MANAGER: 'Technical Manager',
  CHARTERER: 'Charterer',
  ADMIN: 'Admin'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on reload
  useEffect(() => {
    async function checkSession() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const profile = await fetchCurrentUserProfile();
          if (profile) {
            setUser(profile);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Failed to verify session token:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email, password, role = ROLES.OPERATOR) => {
    try {
      const response = await loginUser(email, password, role);
      if (response && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  };

  const register = async (name, email, password, role, company) => {
    try {
      const response = await registerUser(name, email, password, role, company);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
