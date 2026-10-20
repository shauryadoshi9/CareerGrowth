import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../types';

interface CookieConsentProps {
  theme: ThemeMode;
  onNavigateTab: (tab: string) => void;
}

const COOKIE_CONSENT_KEY = 'careergrowth_cookie_consent';

export const CookieConsent: React.FC<CookieConsentProps> = ({ theme, onNavigateTab }) => {
  const isDark = theme === 'dark';
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show after a short delay so it doesn't flash on load
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 border-t transition-all ${
        isDark
          ? 'bg-slate-900/98 border-slate-800 backdrop-blur-md'
          : 'bg-white/98 border-slate-200 backdrop-blur-md shadow-lg'
      }`}
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            We use essential cookies
          </p>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            This site uses cookies for login sessions, theme preferences, and language settings. 
            We do not use advertising or third-party tracking cookies.{' '}
            <button
              onClick={() => onNavigateTab('privacy')}
              className="text-indigo-500 hover:text-indigo-400 underline underline-offset-2"
            >
              Read our Privacy Policy
            </button>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDecline}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition ${
              isDark
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};
