import React from 'react';
import { ThemeMode } from '../types';

interface LoadingScreenProps {
  message?: string;
  theme?: ThemeMode;
  fullScreen?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Initializing CareerGrowth Platform...',
  theme = 'dark',
  fullScreen = true
}) => {
  const isDark = theme === 'dark';

  const containerClasses = fullScreen
    ? `fixed inset-0 z-50 flex flex-col items-center justify-center p-6 transition-all duration-300 ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`
    : `w-full min-h-[360px] flex flex-col items-center justify-center p-8 rounded-2xl ${
        isDark ? 'bg-slate-900/60 text-white' : 'bg-white text-slate-900 shadow-sm border border-slate-200'
      }`;

  return (
    <div className={containerClasses}>
      {/* Ambient background glow ring */}
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-emerald-400/20 blur-2xl animate-pulse pointer-events-none" />

        {/* Circular Accent Ring Container */}
        <div className="relative z-10 p-4 rounded-3xl bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-cyan-500/10 backdrop-blur-md flex flex-col items-center">
          <div className="relative">
            {/* Spinning decorative orbit */}
            <div className="absolute -inset-2 rounded-2xl border-2 border-transparent border-t-emerald-400 border-r-blue-500 animate-spin pointer-events-none" style={{ animationDuration: '3s' }} />

            {/* Official Logo */}
            <img
              src="/logo.png"
              alt="CareerGrowth"
              className="h-24 md:h-28 w-auto object-contain select-none animate-pulse"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="mt-8 flex flex-col items-center space-y-3 max-w-xs w-full text-center">
          {/* Animated Gradient Progress Track */}
          <div className="w-56 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full animate-[progress_1.8s_ease-in-out_infinite]"
              style={{
                width: '60%',
                animation: 'indeterminateProgress 1.6s ease-in-out infinite'
              }}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="truncate">{message}</span>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            From Learning to Livelihood
          </p>
        </div>
      </div>

      <style>{`
        @keyframes indeterminateProgress {
          0% {
            transform: translateX(-100%);
            width: 30%;
          }
          50% {
            transform: translateX(50%);
            width: 70%;
          }
          100% {
            transform: translateX(200%);
            width: 30%;
          }
        }
      `}</style>
    </div>
  );
};
