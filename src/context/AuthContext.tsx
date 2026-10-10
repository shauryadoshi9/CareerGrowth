import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, fetchCurrentUser, sendOtpApi, verifyOtpApi, googleLoginApi } from '../services/api';
import { UserRole } from '../types';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified?: boolean;
  authProvider?: 'email' | 'google';
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  updateUserName: (name: string) => void;
  sendOtp: (email: string, type?: 'register' | 'login') => Promise<{ success: boolean; message: string; otpPreview?: string; demoNotice?: string }>;
  verifyOtp: (payload: { name?: string; email: string; password?: string; otp: string; role?: UserRole }) => Promise<void>;
  googleLogin: (account: { email: string; name: string; avatarUrl?: string; role?: UserRole }) => Promise<void>;
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

  const logout = () => {
    localStorage.removeItem('careergrowth_token');
    localStorage.removeItem('careergrowth_user_name');
    localStorage.removeItem('careergrowth_user_role');
    localStorage.removeItem('skillbridge_token');
    localStorage.removeItem('skillbridge_user_name');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleUnauthorizedEvent = () => {
      logout();
    };

    window.addEventListener('careergrowth:unauthorized', handleUnauthorizedEvent);
    return () => {
      window.removeEventListener('careergrowth:unauthorized', handleUnauthorizedEvent);
    };
  }, []);

  useEffect(() => {
    const savedName = localStorage.getItem('careergrowth_user_name');
    const stored = localStorage.getItem('careergrowth_token');

    if (stored) {
      setToken(stored);
      fetchCurrentUser(stored).then((res) => {
        if (res?.user) {
          const userWithRole: User = {
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            role: (res.user.role as UserRole) || 'student',
            isVerified: true
          };
          setUser(userWithRole);
          if (res.user.name) {
            localStorage.setItem('careergrowth_user_name', res.user.name);
          }
          if (res.user.role) {
            localStorage.setItem('careergrowth_user_role', res.user.role);
          }
        } else {
          // Token invalid or expired
          logout();
        }
      }).catch(() => {
        logout();
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateUserName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem('careergrowth_user_name', trimmed);
    setUser(prev => {
      if (prev) return { ...prev, name: trimmed };
      return { id: 'usr-local', name: trimmed, email: 'student@careergrowth.org', role: 'student' };
    });
  };

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res?.token) {
      localStorage.setItem('careergrowth_token', res.token);
      if (res.user?.name) {
        localStorage.setItem('careergrowth_user_name', res.user.name);
      }
      if (res.user?.role) {
        localStorage.setItem('careergrowth_user_role', res.user.role);
      }
      setToken(res.token);
      setUser({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: (res.user.role as UserRole) || 'student'
      });
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = 'student') => {
    const res = await registerUser(name, email, password, role);
    if (res?.token) {
      localStorage.setItem('careergrowth_token', res.token);
      localStorage.setItem('careergrowth_user_name', name);
      localStorage.setItem('careergrowth_user_role', role);
      setToken(res.token);
      setUser({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: (res.user.role as UserRole) || role
      });
    }
  };

  const sendOtp = async (email: string, type: 'register' | 'login' = 'register') => {
    return await sendOtpApi(email, type);
  };

  const verifyOtp = async (payload: { name?: string; email: string; password?: string; otp: string; role?: UserRole }) => {
    const res = await verifyOtpApi(payload);
    if (res?.token) {
      localStorage.setItem('careergrowth_token', res.token);
      if (payload.name) {
        localStorage.setItem('careergrowth_user_name', payload.name);
      }
      if (res.user?.role) {
        localStorage.setItem('careergrowth_user_role', res.user.role);
      }
      setToken(res.token);
      setUser({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: (res.user.role as UserRole) || payload.role || 'student'
      });
    }
  };

  const googleLogin = async (account: { email: string; name: string; avatarUrl?: string; role?: UserRole }) => {
    const res = await googleLoginApi(account);
    if (res?.token) {
      localStorage.setItem('careergrowth_token', res.token);
      if (account.name) {
        localStorage.setItem('careergrowth_user_name', account.name);
      }
      if (res.user?.role) {
        localStorage.setItem('careergrowth_user_role', res.user.role);
      }
      setToken(res.token);
      setUser({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: (res.user.role as UserRole) || account.role || 'student',
        avatarUrl: account.avatarUrl
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, updateUserName, sendOtp, verifyOtp, googleLogin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
