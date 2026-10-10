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
      isDark ? 'bg-slate-950/90 border-b border-slate-800/80' : 'bg-white/95 border-b border-slate-200 shadow-sm'
    } backdrop-blur-md px-4 lg:px-8 py-2.5`}>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onTabChange('home')}>
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shadow-sm">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-base tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  SkillBridge
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 rounded">
                  Verified
                </span>
              </div>
              <p className={`text-[10px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {t('subtitle', language)}
              </p>
            </div>
          </div>

          {/* Cloud Connection Badge (Mobile) */}
          <div className="flex items-center gap-1.5 lg:hidden px-2 py-0.5 rounded text-[11px] text-slate-400 border border-slate-800 bg-slate-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Cloud Sync</span>
          </div>
        </div>

        {/* Center: Navigation Tabs (Minimalist Unified State) */}
        <nav className={`flex flex-wrap items-center gap-1 p-1 rounded-lg border text-xs font-medium ${
          isDark ? 'bg-slate-900/70 border-slate-800/90' : 'bg-slate-100 border-slate-200'
        }`}>
          
          {/* Home Tab */}
          <button
            onClick={() => onTabChange('home')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
              activeTab === 'home' 
                ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('home', language)}</span>
          </button>

          {currentRole === 'student' && (
            <>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('dashboard', language)}
              </button>
              <button
                onClick={() => onTabChange('skill-gap')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'skill-gap' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('skill_gap', language)}
              </button>
              <button
                onClick={() => onTabChange('career-navigator')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'career-navigator' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('career_nav', language)}
              </button>
              <button
                onClick={() => onTabChange('learning')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'learning' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('learning_engine', language)}
              </button>
              <button
                onClick={() => onTabChange('study-buddy')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'study-buddy' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>{t('study_buddy', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('revision-planner')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'revision-planner' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('revision_planner', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('mock-interview')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'mock-interview' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <MessageSquareCode className="w-3.5 h-3.5" />
                <span>{t('mock_interview', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('opportunities')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'opportunities' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t('opportunity', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('mentors')}
                className={`px-2.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === 'mentors' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{t('mentors', language)}</span>
              </button>
              <button
                onClick={() => onTabChange('vocational')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'vocational' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('vocational', language)}
              </button>
              <button
                onClick={() => onTabChange('offline-packs')}
                className={`px-2.5 py-1.5 rounded-md transition-all ${
                  activeTab === 'offline-packs' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
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
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'teacher-copilot' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('teacher_copilot', language)}
              </button>
              <button
                onClick={() => onTabChange('learning-risk')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'learning-risk' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('risk_engine', language)}
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <button
              onClick={() => onTabChange('institution-analytics')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'institution-analytics' 
                  ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                  : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {t('inst_analytics', language)}
            </button>
          )}

        </nav>

        {/* Right Controls: Server Status, Language, Theme, Role, Auth */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Server Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-800/80 bg-slate-900/60 text-slate-400">
            <span className={`w-1.5 h-1.5 rounded-full ${isServerConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{isServerConnected ? t('server_status_connected', language) : t('server_status_offline', language)}</span>
          </div>

          {/* Theme Toggle Button (Dark & Light Mode) */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 rounded-md border transition-all flex items-center justify-center ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Multilingual Selector (10 Indian Languages) */}
          <div className={`flex items-center gap-1.5 border rounded-md px-2 py-1 text-xs ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <Globe className="w-3 h-3 text-slate-400" />
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

          {/* Role Segmented Switcher (Minimalist) */}
          <div className={`flex items-center border rounded-md p-0.5 text-xs ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => { onRoleChange('student'); onTabChange('dashboard'); }}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                currentRole === 'student' 
                  ? 'bg-slate-800 text-white font-medium shadow-sm' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{t('role_student', language)}</span>
            </button>
            <button
              onClick={() => { onRoleChange('teacher'); onTabChange('teacher-copilot'); }}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                currentRole === 'teacher' 
                  ? 'bg-slate-800 text-white font-medium shadow-sm' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t('role_teacher', language)}</span>
            </button>
            <button
              onClick={() => { onRoleChange('admin'); onTabChange('institution-analytics'); }}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                currentRole === 'admin' 
                  ? 'bg-slate-800 text-white font-medium shadow-sm' 
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('role_admin', language)}</span>
            </button>
          </div>

          {/* Auth Navigation Buttons / User Badge */}
          <div className="flex items-center gap-1.5 ml-0.5">
            {user ? (
              <div className="flex items-center gap-1.5">
                <div 
                  onClick={() => onTabChange('dashboard')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium cursor-pointer hover:border-slate-700 transition"
                  title="Open Dashboard"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="max-w-[110px] truncate">{user.name || user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    onTabChange('home');
                  }}
                  className="px-2 py-1 text-xs rounded-md border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition"
                >
                  {t('logout', language)}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onTabChange('login')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t('login', language)}
                </button>
                <button
                  onClick={() => onTabChange('register')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
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
