import React, { useState, useEffect } from 'react';
import { UserRole, Language, ThemeMode, ServerHealth } from '../types';
import { t } from '../services/i18n';
import { checkServerHealth, postCustomData } from '../services/api';
import { 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  BookOpen, 
  Award, 
  Briefcase, 
  Layers, 
  WifiOff, 
  Server, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Globe, 
  Send,
  Flame,
  Bot
} from 'lucide-react';

interface HomePageProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  theme: ThemeMode;
  onNavigateTab: (tab: string, role?: UserRole) => void;
  onStartDemoTour: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentRole,
  onRoleChange,
  language,
  theme,
  onNavigateTab,
  onStartDemoTour,
}) => {
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Career Goal');
  const [customPayload, setCustomPayload] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchHealth = async () => {
      const data = await checkServerHealth();
      if (mounted) setServerHealth(data);
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    setIsSubmitting(true);
    setServerMessage(null);

    const result = await postCustomData(
      customTitle,
      customCategory,
      { details: customPayload || 'User entered custom data via Home Page form', submittedAt: new Date().toISOString() }
    );

    setIsSubmitting(false);

    if (result.success) {
      setServerMessage(`✅ Saved to Dynamic Server DB! Total custom records: ${result.totalCustomEntries || 1}`);
      setCustomTitle('');
      setCustomPayload('');
      const health = await checkServerHealth();
      if (health) setServerHealth(health);
    } else {
      setServerMessage('⚠️ Failed to connect to server. Data stored locally.');
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className="space-y-10 pb-12">

      {/* Hero Banner Section */}
      <div className={`relative overflow-hidden rounded-3xl p-8 lg:p-12 border ${isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-indigo-200'} shadow-2xl transition-all duration-300`}>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Badge & Telemetry */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Verified National Career Ecosystem
            </span>

            {serverHealth ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Server className="w-3.5 h-3.5" />
                Cloud Sync Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Database className="w-3.5 h-3.5" />
                Local Persistence Syncing
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <Globe className="w-3.5 h-3.5" />
              10 Indian Languages
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className={`text-3xl md:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            SkillBridge OS <br />
            <span className="gradient-text">{t('hero_headline', language)}</span>
          </h1>

          <p className={`text-base md:text-lg max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {t('hero_sub', language)}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigateTab('dashboard', 'student')}
              className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              Launch Student Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('teacher-copilot', 'teacher')}
              className={`px-6 py-3.5 rounded-xl font-semibold border transition-all duration-200 flex items-center gap-2 ${
                isDark 
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
              }`}
            >
              <Bot className="w-5 h-5 text-indigo-500" />
              Teacher Copilot & Risk Engine
            </button>

            <button
              onClick={onStartDemoTour}
              className={`px-5 py-3.5 rounded-xl font-medium border text-sm transition-all duration-200 flex items-center gap-2 ${
                isDark 
                  ? 'bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border-indigo-700/50' 
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Interactive Demo Tour
            </button>
          </div>

        </div>
      </div>

      {/* Live Server Interactive Form Section */}
      <div className={`rounded-2xl p-6 lg:p-8 border ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-500 font-bold text-xs uppercase tracking-wider mb-1">
              <Server className="w-4 h-4" />
              Dynamic Backend Server Persistence
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Custom Career Goal & Skill Request Storage
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Record custom learner aspirations, industry preferences, or skill targets directly into your verified profile.
            </p>
          </div>

          {/* Telemetry Badge */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`w-3 h-3 rounded-full ${serverHealth ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
            <div className="text-xs">
              <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {serverHealth ? 'Cloud Database Active' : 'Connecting to Database...'}
              </p>
              <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                {serverHealth ? `${serverHealth.stats?.skillsCount || 10} Skills | ${serverHealth.stats?.activityCount || 0} Saved Actions` : 'Syncing'}
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Entry Title / Goal Name
              </label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Master PyTorch & Vector Indexing"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Category / Domain
              </label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              >
                <option value="Career Goal">Career Goal</option>
                <option value="Custom Skill">Custom Skill</option>
                <option value="Vocational Note">Vocational Note</option>
                <option value="Teacher Feedback">Teacher Feedback</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Additional Notes / Target Proficiency
              </label>
              <input
                type="text"
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                placeholder="e.g. Target 90% by Month 2"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all ${
                  isDark 
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                }`}
              />
            </div>

          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Saving to Dynamic Server...' : 'Save Data to Dynamic Server'}
            </button>

            {serverMessage && (
              <p className="text-xs font-semibold text-emerald-400 animate-fade-in">
                {serverMessage}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Role Selection Cards */}
      <div>
        <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Select Workspace Experience
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Student Card */}
          <div 
            onClick={() => onRoleChange('student')}
            className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
              currentRole === 'student'
                ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-950/30'
                : isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Student & Job-Seeker Workspace
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-time skill gap analysis, adaptive multilingual quizzes, project evidence builder, and direct opportunity matching.
            </p>
            <div className="mt-4 pt-4 border-t border-indigo-500/20 flex items-center justify-between text-xs font-semibold text-indigo-400">
              <span>Explore Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Educator / Teacher Card */}
          <div 
            onClick={() => onRoleChange('teacher')}
            className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
              currentRole === 'teacher'
                ? 'border-purple-500 ring-2 ring-purple-500/40 bg-purple-950/30'
                : isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-purple-300 shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Educator AI Copilot
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Generate multilingual lesson plans, automated diagnostic quizzes, and track at-risk student intervention triggers.
            </p>
            <div className="mt-4 pt-4 border-t border-purple-500/20 flex items-center justify-between text-xs font-semibold text-purple-400">
              <span>Explore Teacher Copilot</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Institution Admin Card */}
          <div 
            onClick={() => onRoleChange('admin')}
            className={`cursor-pointer rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
              currentRole === 'admin'
                ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/30'
                : isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-emerald-300 shadow-md'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Institution & GTU Analytics
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              High-level cohort skill distribution charts, placement alignment metrics, and regional rural outreach statistics.
            </p>
            <div className="mt-4 pt-4 border-t border-emerald-500/20 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Explore Analytics</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* 6 Core Feature Pillars Grid */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Core Platform Capabilities
            </h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Engineered for students, educational institutions, and enterprise recruiters with AI precision.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <BrainCircuit className="w-8 h-8 text-indigo-400 mb-3" />
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dynamic Skill Gap Analyzer
            </h4>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Compares target career skill requirements against current proficiency levels and calculates real-time readiness scores.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <Globe className="w-8 h-8 text-purple-400 mb-3" />
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              10 Indian Language Support
            </h4>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Native translations for Hindi, Gujarati, Marathi, Tamil, Telugu, Kannada, Bengali, Punjabi, Malayalam, and English.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <WifiOff className="w-8 h-8 text-amber-400 mb-3" />
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Rural Low-Bandwidth Mode
            </h4>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Compressed text & line-diagram offline packs designed for low-connectivity rural Anand & GTU polytechnic centers.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <Zap className="w-8 h-8 text-emerald-400 mb-3" />
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Vocational & Clean Energy Hub
            </h4>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Hands-on modules for Solar Rooftop PV, Electric Vehicle Battery Diagnostics, and Smart Agriculture IoT Sensors.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <Briefcase className="w-8 h-8 text-cyan-400 mb-3" />
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Opportunity Placement Matcher
            </h4>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Algorithmic matching of student skills and GPA against internships and industry job openings with instant server application posting.
            </p>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
            <Bot className="w-8 h-8 text-pink-400 mb-3" />
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Teacher Copilot & Risk Engine
            </h4>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Automated lesson plan generator, diagnostic quiz creator, and at-risk student early warning intervention engine.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
