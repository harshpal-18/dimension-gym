import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('dimension_gym_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (data.success) {
          setUser(data.user);
        }
      } catch {
        localStorage.removeItem('dimension_gym_token');
        localStorage.removeItem('dimension_gym_user');
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      localStorage.setItem('dimension_gym_token', data.token);
      localStorage.setItem('dimension_gym_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }, []);

  const signup = useCallback(async (name, email, phone, password) => {
    const { data } = await api.post('/auth/signup', { name, email, phone, password });
    if (data.success) {
      localStorage.setItem('dimension_gym_token', data.token);
      localStorage.setItem('dimension_gym_user', JSON.stringify(data.user));
      setUser(data.user);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dimension_gym_token');
    localStorage.removeItem('dimension_gym_user');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('dimension_gym_user', JSON.stringify(data.user));
      }
    } catch {
      // Silently fail
    }
  }, []);

  const openAuth = useCallback(() => setShowAuthModal(true), []);
  const closeAuth = useCallback(() => setShowAuthModal(false), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        showAuthModal,
        openAuth,
        closeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
