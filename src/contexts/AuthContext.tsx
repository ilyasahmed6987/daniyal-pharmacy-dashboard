import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import apiClient from '../api/apiClient';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('pharmaToken'),
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('pharmaToken');
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          setState({
            user: res.data.user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (err) {
          localStorage.removeItem('pharmaToken');
          setState(prev => ({ ...prev, loading: false, token: null }));
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('pharmaToken', token);
    setState({
      user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('pharmaToken');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
