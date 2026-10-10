import React, { useContext, useState } from 'react';
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
  Users,
  Award,
  ChevronDown,
  LayoutGrid
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
  const [isStudentDropdownOpen, setIsStudentDropdownOpen] = useState(false);

  const studentFeaturesList = [
    { id: 'skill-gap', label: t('skill_gap', language), icon: BrainCircuit, badge: 'Diagnostic' },
    { id: 'career-navigator', label: t('career_nav', language), icon: Sparkles, badge: 'Roadmap' },
    { id: 'learning', label: t('learning_engine', language), icon: Zap, badge: 'Adaptive' },
    { id: 'study-buddy', label: t('study_buddy', language), icon: Bot, badge: 'AI Doubts' },
    { id: 'revision-planner', label: t('revision_planner', language), icon: Calendar, badge: 'Daily Plan' },
    { id: 'mock-interview', label: t('mock_interview', language), icon: MessageSquareCode, badge: 'Live AI' },
    { id: 'opportunities', label: t('opportunity', language), icon: Zap, badge: 'LIVE Ingest' },
    { id: 'mentors', label: t('mentors', language), icon: Users, badge: '1:1 Experts' },
    { id: 'vocational', label: t('vocational', language), icon: Award, badge: 'Practical' },
    { id: 'offline-packs', label: t('offline_packs', language), icon: Signal, badge: 'Offline' }
  ];

  const currentActiveFeature = studentFeaturesList.find(f => f.id === activeTab);

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 ${
      isDark ? 'bg-slate-950/90 border-b border-slate-800/80' : 'bg-white/95 border-b border-slate-200 shadow-sm'
    } backdrop-blur-md px-4 lg:px-8 py-2.5`}>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('home')}>
            <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
              <img 
                src="/logo.png" 
                alt="CareerGrowth" 
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-black text-base tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Career<span className="text-emerald-500">Growth</span>
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded uppercase tracking-wider">
                  Official
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
              {/* Student Dashboard Tab */}
              <button
                onClick={() => {
                  onTabChange('dashboard');
                  setIsStudentDropdownOpen(false);
                }}
                className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                  activeTab === 'dashboard' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {t('dashboard', language)}
              </button>

              {/* Student Features & Modules Dropdown Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStudentDropdownOpen(!isStudentDropdownOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                    currentActiveFeature
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800/60' : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {currentActiveFeature ? (
                    <>
                      <currentActiveFeature.icon className="w-3.5 h-3.5 text-white" />
                      <span>{currentActiveFeature.label}</span>
                    </>
                  ) : (
                    <>
                      <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Modules & Tools</span>
                    </>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStudentDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isStudentDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsStudentDropdownOpen(false)} 
                    />
                    <div className={`absolute left-0 mt-2 w-72 rounded-2xl border shadow-2xl p-2 z-50 animate-fade-in ${
                      isDark ? 'bg-slate-900/98 border-slate-700 backdrop-blur-xl' : 'bg-white border-slate-200 backdrop-blur-xl'
                    }`}>
                      <div className="px-3 py-2 border-b border-slate-800/50 mb-1 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>CareerGrowth Modules</span>
                        <span className="text-indigo-400 font-semibold">10 Features</span>
                      </div>
                      <div className="max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
                        {studentFeaturesList.map(item => {
                          const Icon = item.icon;
                          const isCurrent = activeTab === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                onTabChange(item.id);
                                setIsStudentDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                                isCurrent 
                                  ? 'bg-indigo-600 text-white font-bold shadow' 
                                  : isDark 
                                    ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white' 
                                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-lg ${
                                  isCurrent 
                                    ? 'bg-white/20 text-white' 
                                    : isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                                }`}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="font-medium">{item.label}</span>
                              </div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                isCurrent 
                                  ? 'bg-white/20 text-white' 
                                  : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              }`}>
                                {item.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {currentRole === 'teacher' && (
            <>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Dashboard
              </button>
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
            <>
              <button
                onClick={() => onTabChange('dashboard')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeTab === 'dashboard' 
                    ? 'bg-indigo-600 text-white font-medium shadow-sm' 
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/60' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Dashboard
              </button>
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
            </>
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

          {/* Role Segmented Switcher on Home Page, Clean Mode Pill on Dashboard */}
          {activeTab === 'home' ? (
            <div className={`flex items-center border rounded-md p-0.5 text-xs ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => onRoleChange('student')}
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
                onClick={() => onRoleChange('teacher')}
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
                onClick={() => onRoleChange('admin')}
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
          ) : (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
              isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}>
              {currentRole === 'student' && (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Student View</span>
                </>
              )}
              {currentRole === 'teacher' && (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                  <span>Teacher View</span>
                </>
              )}
              {currentRole === 'admin' && (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
                  <span>Admin View</span>
                </>
              )}
              <button
                onClick={() => onTabChange('home')}
                className="ml-1 text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                title="Go to Home to switch role"
              >
                (Switch)
              </button>
            </div>
          )}

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
