import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, fetchCurrentUser, sendOtpApi, verifyOtpApi, googleLoginApi } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isVerified?: boolean;
  authProvider?: 'email' | 'google';
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  sendOtp: (email: string, type?: 'register' | 'login') => Promise<{ success: boolean; message: string; otpPreview?: string }>;
  verifyOtp: (payload: { name?: string; email: string; password?: string; otp: string }) => Promise<void>;
  googleLogin: (account: { email: string; name: string; avatarUrl?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  sendOtp: async () => ({ success: false, message: '' }),
  verifyOtp: async () => {},
  googleLogin: async () => {},
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

  const sendOtp = async (email: string, type: 'register' | 'login' = 'register') => {
    return await sendOtpApi(email, type);
  };

  const verifyOtp = async (payload: { name?: string; email: string; password?: string; otp: string }) => {
    const res = await verifyOtpApi(payload);
    if (res?.token) {
      localStorage.setItem('skillbridge_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const googleLogin = async (account: { email: string; name: string; avatarUrl?: string }) => {
    const res = await googleLoginApi(account);
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
    <AuthContext.Provider value={{ user, token, login, register, sendOtp, verifyOtp, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
