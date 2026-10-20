import React from 'react';
import { ThemeMode } from '../types';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

interface NotFoundPageProps {
  theme: ThemeMode;
  onNavigateTab: (tab: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ theme, onNavigateTab }) => {
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 space-y-6 animate-fade-in">
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
        isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-slate-200'
      }`}>
        <AlertTriangle className="w-10 h-10 text-amber-500" />
      </div>

      <div className="space-y-2">
        <h1 className={`text-6xl font-black font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
          404
        </h1>
        <h2 className={`text-lg font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Page not found
        </h2>
        <p className={`text-sm max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          The page you are looking for does not exist or has been moved. 
          Check the URL or navigate back to the home page.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigateTab('home')}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-sm transition flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Go to Home</span>
        </button>
        <button
          onClick={() => window.history.back()}
          className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition flex items-center gap-2 ${
            isDark 
              ? 'border-slate-800 hover:bg-slate-800 text-slate-300' 
              : 'border-slate-200 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
};
