import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, AlertCircle, ArrowRight, CheckCircle, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';

import { Language, ThemeMode } from '../types';
import { t } from '../services/i18n';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  language?: Language;
  theme?: ThemeMode;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin, language = 'en', theme }) => {
  const { sendOtp, verifyOtp, googleLogin } = useContext(AuthContext);
  
  // Step 1: Info, Step 2: OTP
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);
  
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Validation
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address (e.g. name@domain.com)');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(email.toLowerCase(), 'register');
      if (res?.otpPreview) {
        setDemoOtp(res.otpPreview);
      }
      setStep('otp');
      setCountdown(45);
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await sendOtp(email.toLowerCase(), 'register');
      if (res?.otpPreview) {
        setDemoOtp(res.otpPreview);
      }
      setCountdown(45);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp({
        name,
        email: email.toLowerCase(),
        password,
        otp: cleanOtp
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Invalid or expired verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSelect = async (account: { email: string; name: string }) => {
    await googleLogin(account);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-md mx-auto my-8 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl transition-all">
      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
          <img src="/logo.png" alt="CareerGrowth" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {step === 'info' ? 'Join CareerGrowth to accelerate your journey' : 'Verify your email address to continue'}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 'info' ? (
        <>
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="e.g. Shaurya Doshi"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address (Institutional or Personal)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="student@careergrowth.org"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Create Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Min 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition"
            >
              {loading ? 'Sending Verification Code...' : 'Verify Email with OTP'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">Or continue with</span>
            </div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2.5 transition shadow-sm"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11 0 12.4s.6 3.2 1.6 5.2l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23.8c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 17c1.9 3.8 5.8 6.8 10.4 6.8z"/>
            </svg>
            Sign up with Google (Demo Sign-In)
          </button>
        </>
      ) : (
        /* Step 2: 6-Digit OTP Verification */
        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
          <button
            type="button"
            onClick={() => setStep('info')}
            className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change email address ({email})
          </button>

          {/* Visible Demo Verification Notice */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>⚡ Demo Verification Notice</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              In production, OTPs are dispatched via secure institutional SMTP. For hackathon evaluation, immediate preview is enabled below.
            </p>
          </div>

          {/* Demo OTP Banner with 1-click Auto-Fill */}
          {demoOtp && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>Verification Code: <strong className="font-mono text-sm tracking-widest">{demoOtp}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtp(demoOtp)}
                className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-700 transition"
              >
                Auto-fill
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter 6-Digit Verification Code
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                placeholder="• • • • • •"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg tracking-[0.5em] font-mono text-center focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Code expires in 10 minutes. Sent to {email}.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Didn't receive code?</span>
            <button
              type="button"
              disabled={countdown > 0 || loading}
              onClick={handleResendOtp}
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline disabled:opacity-50 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition"
          >
            {loading ? 'Verifying...' : 'Verify & Complete Registration'}
            <CheckCircle className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Switch to Login */}
      {onSwitchToLogin && (
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
          >
            Sign in here
          </button>
        </p>
      )}

      {/* Google Account Selector Modal */}
      <GoogleAccountChooserModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleSelect}
      />
    </div>
  );
};
