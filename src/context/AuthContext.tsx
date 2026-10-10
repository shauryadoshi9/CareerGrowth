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
  updateUserName: (name: string) => void;
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
  updateUserName: () => {},
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
    const savedName = localStorage.getItem('careergrowth_user_name') || localStorage.getItem('skillbridge_user_name');
    const stored = localStorage.getItem('careergrowth_token') || localStorage.getItem('skillbridge_token');
    if (stored) {
      setToken(stored);
      fetchCurrentUser(stored).then((res) => {
        if (res?.user) {
          setUser(res.user);
          if (res.user.name) {
            localStorage.setItem('careergrowth_user_name', res.user.name);
          }
        } else if (savedName) {
          setUser({ id: 'usr-local', name: savedName, email: 'student@careergrowth.edu' });
        }
      }).catch(() => {
        if (savedName) {
          setUser({ id: 'usr-local', name: savedName, email: 'student@careergrowth.edu' });
        }
      }).finally(() => setLoading(false));
    } else {
      if (savedName) {
        setUser({ id: 'usr-local', name: savedName, email: 'student@careergrowth.edu' });
      }
      setLoading(false);
    }
  }, []);

  const updateUserName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem('careergrowth_user_name', trimmed);
    setUser(prev => {
      if (prev) return { ...prev, name: trimmed };
      return { id: 'usr-local', name: trimmed, email: 'student@careergrowth.edu' };
    });
  };

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res?.token) {
      localStorage.setItem('careergrowth_token', res.token);
      if (res.user?.name) {
        localStorage.setItem('careergrowth_user_name', res.user.name);
      }
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser(name, email, password);
    if (res?.token) {
      localStorage.setItem('careergrowth_token', res.token);
      localStorage.setItem('careergrowth_user_name', name);
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
      localStorage.setItem('careergrowth_token', res.token);
      if (payload.name) {
        localStorage.setItem('careergrowth_user_name', payload.name);
      }
      setToken(res.token);
      setUser(res.user);
    }
  };

  const googleLogin = async (account: { email: string; name: string; avatarUrl?: string }) => {
    const res = await googleLoginApi(account);
    if (res?.token) {
      localStorage.setItem('careergrowth_token', res.token);
      if (account.name) {
        localStorage.setItem('careergrowth_user_name', account.name);
      }
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('careergrowth_token');
    localStorage.removeItem('careergrowth_user_name');
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user_name');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateUserName, sendOtp, verifyOtp, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
