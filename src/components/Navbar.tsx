import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserRole, Language, ThemeMode, SUPPORTED_LANGUAGES } from '../types';
import { t } from '../services/i18n';
import { 
  BrainCircuit, 
  Globe, 
  Signal, 
  Sparkles, 
  UserCheck, 
  ShieldCheck, 
  GraduationCap, 
  Sun, 
  Moon, 
  Home,
  Server,
  Bot,
  Calendar,
  MessageSquareCode,
  Zap,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isLowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isServerConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  isLowBandwidth,
  onToggleLowBandwidth,
  activeTab,
  onTabChange,
  isServerConnected = true,
}) => {
  const { user, logout } = useContext(AuthContext);
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 ${
      isDark ? 'bg-slate-950/90 border-b border-slate-800/80' : 'bg-white/90 border-b border-slate-200 shadow-sm'
    } backdrop-blur-md px-4 lg:px-8 py-3`}>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                <BrainCircuit className="w-5 h-5 text-indigo-500 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-xl tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  SkillBridge
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 rounded-full">
                  Verified
                </span>
              </div>
              <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('subtitle', language)}
              </p>
            </div>
          </div>

          {/* Cloud Connection Badge (Mobile & Desktop) */}
          <div className="flex items-center gap-1.5 lg:hidden px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Cloud Sync</span>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className={`flex flex-wrap items-center gap-1 p-1.5 rounded-xl border text-xs font-medium ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          
          {/* Home Tab Always Available */}
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'home' 
                ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('home', language)}</span>
          </button>

          {currentRole === 'student' && (
            <>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('dashboard', language)}
              </button>
              <button
                onClick={() => onTabChange('skill-gap')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'skill-gap' 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('skill_gap', language)}
              </button>
              <button
                onClick={() => onTabChange('career-navigator')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'career-navigator' 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('career_nav', language)}
              </button>
              <button
                onClick={() => onTabChange('learning')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'learning' 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('learning_engine', language)}
              </button>
              <button
                onClick={() => onTabChange('study-buddy')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'study-buddy' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('study_buddy', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('revision-planner')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'revision-planner' 
                    ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>{t('revision_planner', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('mock-interview')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'mock-interview' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('mock_interview', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('opportunities')}
                className={`px-3 py-1.5 rounded-lg transition-all relative flex items-center gap-1.5 ${
                  activeTab === 'opportunities' 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('opportunity', language)}</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              </button>
              <button
                onClick={() => onTabChange('mentors')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === 'mentors' 
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span>{t('mentors', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('vocational')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'vocational' 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('vocational', language)}
              </button>
              <button
                onClick={() => onTabChange('offline-packs')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'offline-packs' 
                    ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('offline_packs', language)}
              </button>
            </>
          )}

          {currentRole === 'teacher' && (
            <>
              <button
                onClick={() => onTabChange('teacher-copilot')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'teacher-copilot' 
                    ? 'bg-purple-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('teacher_copilot', language)}
              </button>
              <button
                onClick={() => onTabChange('learning-risk')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  activeTab === 'learning-risk' 
                    ? 'bg-purple-600 text-white font-semibold shadow-md' 
                    : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('risk_engine', language)}
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => onTabChange('institution-analytics')}
              className={`px-4 py-1.5 rounded-lg transition-all ${
                activeTab === 'institution-analytics' 
                  ? 'bg-pink-600 text-white font-semibold shadow-md' 
                  : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {t('inst_analytics', language)}
            </button>
          )}

        </nav>

        {/* Right Controls: Role, 10 Languages, Dark/Light Mode, Server Badge */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Server Badge (Desktop) */}
          <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            isServerConnected 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <Server className="w-3.5 h-3.5" />
            <span>{isServerConnected ? t('server_status_connected', language) : t('server_status_offline', language)}</span>
          </div>

          {/* Theme Toggle Button (Dark & Light Mode) */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Multilingual Selector (10 Indian Languages) */}
          <div className={`flex items-center gap-1.5 border rounded-xl px-2.5 py-1 text-xs ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <Globe className="w-3.5 h-3.5 text-indigo-500" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                  {lang.flag} {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Role Switcher */}
          <div className={`flex items-center border rounded-xl p-1 text-xs ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => { onRoleChange('student'); onTabChange('dashboard'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'student' 
                  ? 'bg-indigo-600 text-white font-semibold' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t('role_student', language)}</span>
            </button>
            <button
              onClick={() => { onRoleChange('teacher'); onTabChange('teacher-copilot'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'teacher' 
                  ? 'bg-purple-600 text-white font-semibold' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t('role_teacher', language)}</span>
            </button>
            <button
              onClick={() => { onRoleChange('admin'); onTabChange('institution-analytics'); }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                currentRole === 'admin' 
                  ? 'bg-pink-600 text-white font-semibold' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('role_admin', language)}</span>
            </button>
          </div>

          {/* Auth Navigation Buttons / User Badge */}
          <div className="flex items-center gap-2 ml-1">
            {user ? (
              <div className="flex items-center gap-2">
                <div 
                  onClick={() => onTabChange('dashboard')}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold cursor-pointer hover:bg-indigo-500/20 transition"
                  title="Open Dashboard"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    onTabChange('home');
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
                >
                  {t('logout', language)}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onTabChange('login')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white shadow'
                      : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t('login', language)}
                </button>
                <button
                  onClick={() => onTabChange('register')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === 'register'
                      ? 'bg-purple-600 text-white shadow'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-sm'
                  }`}
                >
                  {t('register', language)}
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
