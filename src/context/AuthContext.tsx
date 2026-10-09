import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('skillbridge_token');
    if (stored) {
      setToken(stored);
      fetchCurrentUser(stored).then((res) => {
        if (res?.user) setUser(res.user);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res?.token) {
      localStorage.setItem('skillbridge_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password);
    if (res?.token) {
      localStorage.setItem('skillbridge_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('skillbridge_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
