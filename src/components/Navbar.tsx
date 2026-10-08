import React from 'react';
import { UserRole, Language } from '../types';
import { BrainCircuit, Globe, Signal, PlayCircle, Sparkles, UserCheck, ShieldCheck, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isLowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  onStartDemoTour: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  isLowBandwidth,
  onToggleLowBandwidth,
  onStartDemoTour,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse-subtle" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-outfit">SkillBridge</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                SIH26044
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Career Intelligence & Employability OS</p>
          </div>
        </div>

        {/* Center: Main Navigation Tabs based on Role */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800/80 text-xs font-medium">
          {currentRole === 'student' && (
            <>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onTabChange('skill-gap')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'skill-gap' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Skill Gap Engine
              </button>
              <button
                onClick={() => onTabChange('career-navigator')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'career-navigator' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Career Navigator
              </button>
              <button
                onClick={() => onTabChange('learning')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'learning' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Adaptive Learning
              </button>
              <button
                onClick={() => onTabChange('vocational')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'vocational' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Vocational Hub
              </button>
              <button
                onClick={() => onTabChange('opportunities')}
                className={`px-3 py-1.5 rounded-lg transition-all relative ${activeTab === 'opportunities' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Jobs & Internships
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              </button>
              <button
                onClick={() => onTabChange('offline-packs')}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'offline-packs' ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                Rural Packs
              </button>
            </>
          )}

          {currentRole === 'teacher' && (
            <>
              <button
                onClick={() => onTabChange('teacher-copilot')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${activeTab === 'teacher-copilot' ? 'bg-purple-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                AI Teacher Copilot
              </button>
              <button
                onClick={() => onTabChange('learning-risk')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${activeTab === 'learning-risk' ? 'bg-purple-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
              >
                At-Risk Student Monitor
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => onTabChange('institution-analytics')}
              className={`px-4 py-1.5 rounded-lg transition-all ${activeTab === 'institution-analytics' ? 'bg-pink-600 text-white font-semibold shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
              Institution & Sector Analytics
            </button>
          )}
        </nav>

        {/* Right: Controls & Demo Tour */}
        <div className="flex items-center gap-2.5">
          {/* Role Switcher Pill */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => { onRoleChange('student'); onTabChange('dashboard'); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${currentRole === 'student' ? 'bg-indigo-500/20 text-indigo-300 font-medium border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              title="Switch to Student Learner Portal"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              onClick={() => { onRoleChange('teacher'); onTabChange('teacher-copilot'); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${currentRole === 'teacher' ? 'bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              title="Switch to Faculty Copilot Portal"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Teacher</span>
            </button>
            <button
              onClick={() => { onRoleChange('admin'); onTabChange('institution-analytics'); }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${currentRole === 'admin' ? 'bg-pink-500/20 text-pink-300 font-medium border border-pink-500/30' : 'text-slate-400 hover:text-slate-200'}`}
              title="Switch to University / Govt Analytics Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Multilingual Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 ml-1 text-indigo-400" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
              <option value="gu" className="bg-slate-900 text-white">ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          {/* Rural Low Bandwidth Toggle */}
          <button
            onClick={onToggleLowBandwidth}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all ${
              isLowBandwidth
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Rural Low-Bandwidth Mode (Optimizes payload & enables offline caching)"
          >
            <Signal className={`w-3.5 h-3.5 ${isLowBandwidth ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isLowBandwidth ? 'Rural Mode (Active)' : 'Standard Bandwidth'}</span>
          </button>

          {/* Live Demo Tour Button */}
          <button
            onClick={onStartDemoTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlayCircle className="w-4 h-4 fill-white/20 text-white" />
            <span>SIH 2026 Story</span>
          </button>
        </div>

      </div>
    </header>
  );
};
