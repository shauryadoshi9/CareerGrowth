import React, { useState, useEffect } from 'react';
import { UserRole, Language, ThemeMode, ServerHealth } from '../types';
import { t } from '../services/i18n';
import { checkServerHealth, postCustomData } from '../services/api';
import { mockOpportunities, mockMentors } from '../data/mockData';
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
  Bot,
  Calendar,
  MessageSquareCode,
  Search,
  ExternalLink,
  Star,
  Clock,
  Building,
  Trophy,
  ChevronRight,
  Target
} from 'lucide-react';

interface HomePageProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  theme: ThemeMode;
  onNavigateTab: (tab: string, role?: UserRole) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentRole,
  onRoleChange,
  language,
  theme,
  onNavigateTab,
}) => {
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('Career Goal');
  const [customPayload, setCustomPayload] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);

  const isDark = theme === 'dark';

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
      { details: customPayload || 'Target role or goal registered via dashboard', submittedAt: new Date().toISOString() }
    );

    setIsSubmitting(false);

    if (result.success) {
      setServerMessage('✨ Career goal saved to your personalized roadmap!');
      setCustomTitle('');
      setCustomPayload('');
      const health = await checkServerHealth();
      if (health) setServerHealth(health);
    } else {
      setServerMessage('✨ Career goal saved to your local roadmap.');
    }
  };

  const featuredOpportunities = mockOpportunities.slice(0, 4);
  const featuredMentors = mockMentors.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateTab('opportunities', 'student');
  };

  return (
    <div className="space-y-12 pb-16 animate-fade-in">

      {/* Hero Section (Minimalist Tech Aesthetic) */}
      <div className={`relative overflow-hidden rounded-2xl p-7 lg:p-12 border ${
        isDark 
          ? 'bg-slate-900/40 border-slate-800/80' 
          : 'bg-white border-slate-200 shadow-sm'
      } transition-all duration-200`}>
        
        <div className="relative z-10 max-w-4xl space-y-5">
          
          {/* Metadata & Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {t('home_badge_unstop', language)}
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Pipelines: Devfolio • Unstop • PM Scheme
            </span>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              10 Indian Languages
            </span>
          </div>

          {/* Main Title & Slogan */}
          <h1 className={`text-3xl md:text-5xl font-bold tracking-tight leading-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('hero_headline', language)}
          </h1>

          <p className={`text-sm md:text-base max-w-2xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('hero_sub', language)}
          </p>

          {/* Live Quick-Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl">
            <div className={`flex items-center rounded-xl p-1.5 border transition-all ${
              isDark 
                ? 'bg-slate-950 border-slate-800 focus-within:border-slate-700' 
                : 'bg-white border-slate-300 focus-within:border-indigo-600 shadow-sm'
            }`}>
              <Search className="w-4 h-4 text-slate-400 ml-2.5 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('home_search_placeholder', language)}
                className={`w-full bg-transparent text-xs outline-none ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg font-medium text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shrink-0 transition"
              >
                {t('home_search_btn', language)}
              </button>
            </div>
          </form>

          {/* Category Quick Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <button
              onClick={() => onNavigateTab('opportunities', 'student')}
              className="px-3 py-1.5 rounded-lg font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition flex items-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('home_tab_hackathons', language)} (Devfolio & Unstop)</span>
            </button>
            <button
              onClick={() => onNavigateTab('opportunities', 'student')}
              className="px-3 py-1.5 rounded-lg font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span>PM Internship Scheme (₹5k/mo)</span>
            </button>
            <button
              onClick={() => onNavigateTab('mentors', 'student')}
              className="px-3 py-1.5 rounded-lg font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('home_tab_mentors', language)} (Google & Microsoft)</span>
            </button>
            <button
              onClick={() => onNavigateTab('study-buddy', 'student')}
              className="px-3 py-1.5 rounded-lg font-medium bg-slate-900/80 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white transition flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('study_buddy', language)}</span>
            </button>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('opportunities', 'student')}
              className="px-5 py-2.5 rounded-lg font-medium text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              {t('home_explore_opps', language)}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigateTab('mentors', 'student')}
              className={`px-4 py-2.5 rounded-lg font-medium text-xs border transition flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-white' 
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-400" />
              {t('home_talk_mentor', language)}
            </button>
          </div>

        </div>
      </div>

      {/* Official Platform Sources & Credibility Ticker (Minimalist) */}
      <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className={`font-semibold uppercase tracking-wider text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Ecosystem Pipelines:
          </span>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1">PM Internship Scheme</span>
            <span>•</span>
            <span className="flex items-center gap-1">Devfolio Hackathons</span>
            <span>•</span>
            <span className="flex items-center gap-1">Unstop Challenges</span>
            <span>•</span>
            <span className="flex items-center gap-1">Hack2Skill</span>
            <span>•</span>
            <span className="flex items-center gap-1">AICTE Portal</span>
            <span>•</span>
            <span className="flex items-center gap-1">GSoC</span>
          </div>
        </div>
      </div>

      {/* Spotlight Flagship Opportunities Carousel (Unstop / Devfolio Highlight Cards) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{t('home_tab_all', language)}</span>
            </div>
            <h2 className={`text-2xl font-black font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_spotlight_opps', language)}
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('opportunities', 'student')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
          >
            <span>{t('view_all_opps', language)}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                isDark ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-400 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                    {opp.sourcePlatform}
                  </span>
                  {opp.urgencyBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {opp.urgencyBadge}
                    </span>
                  )}
                </div>

                <h3 className={`text-sm font-bold font-outfit line-clamp-2 mb-1 group-hover:text-indigo-400 transition ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {opp.title}
                </h3>

                <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {opp.company}
                </p>

                <div className="my-3 p-2.5 rounded-xl border bg-slate-950/40 border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Prize / Stipend</span>
                  <span className="text-xs font-black text-emerald-400 block truncate">
                    {opp.prizeOrStipend || opp.stipendOrSalary}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                <a
                  href={opp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-xl text-center text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition flex items-center justify-center gap-1"
                >
                  <span>Apply on Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => onNavigateTab('opportunities', 'student')}
                  className={`p-2 rounded-xl border text-xs ${isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
                  title="View Skill Fit & Details"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1-on-1 Mentorship Spotlight Section (Minimalist) */}
      <div className={`p-6 lg:p-8 rounded-2xl border ${isDark ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>{t('home_tab_mentors', language)}</span>
            </div>
            <h2 className={`text-2xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_spotlight_mentors', language)}
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('home_spotlight_mentors_sub', language)}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('mentors', 'student')}
            className="px-4 py-2 rounded-lg font-medium text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 transition"
          >
            <span>{t('view_all_mentors', language)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition hover:border-slate-700 ${
                isDark ? 'bg-slate-900/60 border-slate-800/90' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={mentor.avatarUrl}
                    alt={mentor.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-800"
                  />
                  <div className="min-w-0">
                    <h3 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{mentor.name}</h3>
                    <p className="text-xs text-indigo-400 font-medium truncate">{mentor.role}</p>
                    <p className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{mentor.company}</p>
                  </div>
                </div>
                <p className={`text-xs line-clamp-2 mb-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {mentor.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400">{mentor.sessionPrice}</span>
                <button
                  onClick={() => onNavigateTab('mentors', 'student')}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
                >
                  {t('book_session', language)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Facilities Suite Showcase (Minimalist) */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Platform Suite</span>
          </div>
          <h2 className={`text-2xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t('home_ai_suite_title', language)}
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {t('home_ai_suite_sub', language)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tool 1: AI Study Buddy */}
          <div 
            onClick={() => onNavigateTab('study-buddy', 'student')}
            className={`cursor-pointer p-5 rounded-xl border transition hover:border-slate-700 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className={`text-sm font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Study Buddy</h3>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Voice</span>
            </div>
            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Simplifies complex concepts into analogies with multi-language voice synthesis.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-400">
              <span>Ask AI Buddy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 2: Mock Interview */}
          <div 
            onClick={() => onNavigateTab('mock-interview', 'student')}
            className={`cursor-pointer p-5 rounded-xl border transition hover:border-slate-700 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <MessageSquareCode className="w-4 h-4" />
            </div>
            <h3 className={`text-sm font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>Mock Interview Engine</h3>
            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Practice technical and soft skill questions with real-time rubric evaluation.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-400">
              <span>Start Interview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 3: Revision Planner */}
          <div 
            onClick={() => onNavigateTab('revision-planner', 'student')}
            className={`cursor-pointer p-5 rounded-xl border transition hover:border-slate-700 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className={`text-sm font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>Daily Revision Planner</h3>
            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Micro-schedules tailored to weak topics with milestone growth tracking.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-400">
              <span>Plan Daily Habits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tool 4: Skill Gap Analyzer */}
          <div 
            onClick={() => onNavigateTab('skill-gap', 'student')}
            className={`cursor-pointer p-5 rounded-xl border transition hover:border-slate-700 ${
              isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className={`text-sm font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>Skill Gap Analyzer</h3>
            <p className={`text-xs mt-1.5 line-clamp-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Benchmark verified proficiency against current industry job taxonomies.
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-400">
              <span>Analyze Gaps</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

      {/* Role Workspaces (Minimalist Unified Style) */}
      <div className="space-y-4">
        <h2 className={`text-2xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {t('home_workspaces_title', language)}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Student Card */}
          <div 
            onClick={() => { onRoleChange('student'); onNavigateTab('dashboard', 'student'); }}
            className={`cursor-pointer rounded-xl p-5 border transition hover:border-slate-700 ${
              currentRole === 'student'
                ? 'border-indigo-500 bg-slate-900/80 ring-1 ring-indigo-500/30'
                : isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_student_workspace', language)}
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-time skill gap analysis, adaptive multilingual quizzes, project evidence builder, and opportunity matching.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-indigo-400">
              <span>{t('home_open_dashboard', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Educator / Teacher Card */}
          <div 
            onClick={() => { onRoleChange('teacher'); onNavigateTab('teacher-copilot', 'teacher'); }}
            className={`cursor-pointer rounded-xl p-5 border transition hover:border-slate-700 ${
              currentRole === 'teacher'
                ? 'border-indigo-500 bg-slate-900/80 ring-1 ring-indigo-500/30'
                : isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_teacher_workspace', language)}
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Generate multilingual lesson plans, diagnostic quizzes, and track at-risk student intervention alerts.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-indigo-400">
              <span>{t('home_open_copilot', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Institution Admin Card */}
          <div 
            onClick={() => { onRoleChange('admin'); onNavigateTab('institution-analytics', 'admin'); }}
            className={`cursor-pointer rounded-xl p-5 border transition hover:border-slate-700 ${
              currentRole === 'admin'
                ? 'border-indigo-500 bg-slate-900/80 ring-1 ring-indigo-500/30'
                : isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_admin_workspace', language)}
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              High-level cohort skill distribution charts, placement alignment metrics, and regional outreach statistics.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-medium text-indigo-400">
              <span>{t('home_open_analytics', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </div>

      {/* Personal Career Goal Tracker Drawer (Refined & User-Facing) */}
      <div className={`rounded-2xl border transition-all overflow-hidden ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <button
          onClick={() => setIsCustomFormOpen(!isCustomFormOpen)}
          className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold hover:bg-slate-800/30 transition"
        >
          <div className="flex items-center gap-2 text-indigo-400">
            <Target className="w-4 h-4" />
            <span>{t('goal_tracker_title', language)}</span>
          </div>
          <span className="text-slate-400 text-[11px] underline">
            {isCustomFormOpen ? t('goal_tracker_toggle_hide', language) : t('goal_tracker_toggle_show', language)}
          </span>
        </button>

        {isCustomFormOpen && (
          <div className="p-6 border-t border-slate-800 space-y-4">
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {t('goal_tracker_sub', language)}
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={t('goal_input_placeholder', language)}
                  className={`px-3 py-2 rounded-xl text-xs border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Career Goal">🎯 Career Goal</option>
                  <option value="Hackathon Target">🏆 Hackathon Target</option>
                  <option value="Internship Aspiration">💼 Internship Aspiration</option>
                  <option value="Skill Target">⚡ Skill Target</option>
                </select>
                <input
                  type="text"
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  placeholder={t('goal_notes_placeholder', language)}
                  className={`px-3 py-2 rounded-xl text-xs border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition"
                >
                  {isSubmitting ? t('goal_saving', language) : t('goal_save_btn', language)}
                </button>
                {serverMessage && <span className="text-xs text-emerald-400 font-semibold animate-fade-in">{serverMessage}</span>}
              </div>
            </form>
          </div>
        )}
      </div>

    </div>
  );
};
