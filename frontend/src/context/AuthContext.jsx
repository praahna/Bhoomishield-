import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial session
    try {
      const storedToken = localStorage.getItem('bhoomishield_token');
      const storedUser = localStorage.getItem('bhoomishield_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        // Default to demo citizen session for frictionless evaluation if no login yet
        const defaultDemoUser = {
          id: 'usr-1',
          name: 'Priya Sharma',
          email: 'citizen@bhoomishield.gov.in',
          role: 'citizen',
          phone: '+91 98450 12345',
        };
        setUser(defaultDemoUser);
      }
    } catch (e) {
      console.warn('AuthContext init error', e);
    } finally {
      setLoading(false);
    }

    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('bhoomishield_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('bhoomishield_auth_expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('bhoomishield_token', receivedToken);
      localStorage.setItem('bhoomishield_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    } catch (err) {
      return {
        success: false,
        error: err.userFriendlyMessage || err.response?.data?.error || 'Authentication failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('bhoomishield_token', receivedToken);
      localStorage.setItem('bhoomishield_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    } catch (err) {
      return {
        success: false,
        error: err.userFriendlyMessage || err.response?.data?.error || 'Registration failed'
      };
    }
  };

  const demoLogin = (role = 'citizen') => {
    let demoUser;
    if (role === 'authority') {
      demoUser = {
        id: 'usr-2',
        name: 'K. Ramanathan',
        email: 'authority@bhoomishield.gov.in',
        role: 'authority',
        department: 'Karnataka Revenue Dept & Sub-Registrar',
        phone: '+91 98801 88990',
      };
    } else {
      demoUser = {
        id: 'usr-1',
        name: 'Priya Sharma',
        email: 'citizen@bhoomishield.gov.in',
        role: 'citizen',
        phone: '+91 98450 12345',
      };
    }
    setUser(demoUser);
    localStorage.setItem('bhoomishield_user', JSON.stringify(demoUser));
    return demoUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bhoomishield_token');
    localStorage.removeItem('bhoomishield_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAuthority: user?.role === 'authority',
        login,
        register,
        demoLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
