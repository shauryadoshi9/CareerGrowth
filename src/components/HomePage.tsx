import React, { useState, useEffect } from 'react';
import { UserRole, Language, ThemeMode, ServerHealth, Opportunity, LiveStreamEvent } from '../types';
import { t } from '../services/i18n';
import { checkServerHealth, postCustomData, fetchOpportunitiesApi, subscribeToLiveStream } from '../services/api';
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
  Target,
  GraduationCap,
  UserCheck,
  HeartHandshake,
  TrendingUp
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

  // Real-time Runtime Live Stream State
  const [liveOpps, setLiveOpps] = useState<Opportunity[]>(mockOpportunities);
  const [latestLiveEvent, setLatestLiveEvent] = useState<string>('Connected to Devfolio, Unstop & PM Internship Scheme');
  const [liveStreamTicks, setLiveStreamTicks] = useState<number>(0);

  const isDark = theme === 'dark';

  useEffect(() => {
    let mounted = true;
    const fetchHealthAndOpps = async () => {
      const [health, serverOpps] = await Promise.all([
        checkServerHealth(),
        fetchOpportunitiesApi()
      ]);
      if (mounted) {
        if (health) setServerHealth(health);
        if (serverOpps && serverOpps.length > 0) {
          setLiveOpps(serverOpps);
        }
      }
    };
    fetchHealthAndOpps();
    const interval = setInterval(fetchHealthAndOpps, 6000);

    // Real-Time SSE Stream subscription
    const unsubscribe = subscribeToLiveStream((event: LiveStreamEvent) => {
      if (!mounted) return;
      setLiveStreamTicks(c => c + 1);

      if (event.type === 'initial_state' && event.opportunities && event.opportunities.length > 0) {
        setLiveOpps(event.opportunities);
      }

      if (event.type === 'new_opportunity') {
        setLiveOpps(prev => [event.opportunity, ...prev.filter(o => o.id !== event.opportunity.id)]);
        setLatestLiveEvent(`⚡ New listing streamed from ${event.opportunity.sourcePlatform}: ${event.opportunity.title}`);
      }

      if (event.type === 'opportunity_tick') {
        setLiveOpps(prev =>
          prev.map(o => o.id === event.opportunityId ? { ...o, registeredCount: event.registeredCount } : o)
        );
      }

      if (event.type === 'live_activity') {
        setLatestLiveEvent(`💬 ${event.text}`);
      }
    });

    return () => {
      mounted = false;
      clearInterval(interval);
      unsubscribe();
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

  const featuredOpportunities = liveOpps.slice(0, 4);
  const featuredMentors = mockMentors.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateTab('opportunities', 'student');
  };

  return (
    <div className="space-y-10 pb-16 animate-fade-in">

      {/* Real-Time Runtime Stream Live Ticker Bar */}
      <div className={`px-4 py-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
        isDark ? 'bg-slate-900/70 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-emerald-400" />
            Live Pipeline
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <p className="truncate font-medium text-slate-300 text-xs">
            {latestLiveEvent}
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('opportunities', 'student')}
          className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 shrink-0 flex items-center gap-1 group"
        >
          <span>Explore All</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

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
              className={`px-3 py-1.5 rounded-lg font-medium border transition flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('home_tab_hackathons', language)} (Devfolio & Unstop)</span>
            </button>
            <button
              onClick={() => onNavigateTab('opportunities', 'student')}
              className={`px-3 py-1.5 rounded-lg font-medium border transition flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
              <span>PM Internship Scheme (₹5k/mo)</span>
            </button>
            <button
              onClick={() => onNavigateTab('mentors', 'student')}
              className={`px-3 py-1.5 rounded-lg font-medium border transition flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('home_tab_mentors', language)} (Google & Microsoft)</span>
            </button>
            <button
              onClick={() => onNavigateTab('study-buddy', 'student')}
              className={`px-3 py-1.5 rounded-lg font-medium border transition flex items-center gap-1.5 ${
                isDark 
                  ? 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-500" />
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

      {/* Interactive Role Selection & Complete Feature Suite */}
      <div className={`p-6 md:p-8 rounded-3xl border transition-all ${
        isDark 
          ? 'bg-slate-900/60 border-slate-800' 
          : 'bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                Choose Your Role / Persona
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ● Tailored workspaces & toolkits
              </span>
            </div>
            <h2 className={`text-2xl md:text-3xl font-extrabold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Are you a Student, Teacher, or Institution Admin?
            </h2>
            <p className={`text-xs md:text-sm mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Select your persona below to view all tools built for you, then launch directly into your dedicated dashboard.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('dashboard', currentRole)}
            className="px-6 py-3 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition shrink-0"
          >
            <span>Launch {currentRole === 'student' ? 'Student' : currentRole === 'teacher' ? 'Teacher' : 'Admin'} Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Interactive Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          
          {/* Option 1: Student */}
          <button
            type="button"
            onClick={() => onRoleChange('student')}
            className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              currentRole === 'student'
                ? isDark 
                  ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg' 
                  : 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                : isDark
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  currentRole === 'student' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-800 text-indigo-400'
                }`}>
                  <GraduationCap className="w-5 h-5" />
                </div>
                {currentRole === 'student' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-600 text-white">Active Mode</span>
                ) : (
                  <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Click to Select</span>
                )}
              </div>
              <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Student / Learner
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Master skills, solve diagnostic quizzes, build verified project portfolios, and apply for hackathons & internships.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/20 flex items-center justify-between text-xs font-bold text-indigo-500">
              <span>11 Student Features Available</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Option 2: Teacher */}
          <button
            type="button"
            onClick={() => onRoleChange('teacher')}
            className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              currentRole === 'teacher'
                ? isDark 
                  ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-lg' 
                  : 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/30 shadow-md'
                : isDark
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  currentRole === 'teacher' ? 'bg-purple-600 text-white shadow' : 'bg-slate-800 text-purple-400'
                }`}>
                  <UserCheck className="w-5 h-5" />
                </div>
                {currentRole === 'teacher' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white">Active Mode</span>
                ) : (
                  <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Click to Select</span>
                )}
              </div>
              <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Faculty / Educator
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Generate 60-min lesson plans and diagnostic quizzes in 10 Indian languages. Receive early remedial hurdle alerts.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/20 flex items-center justify-between text-xs font-bold text-purple-500">
              <span>Copilot & Remedial Suite</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Option 3: Admin */}
          <button
            type="button"
            onClick={() => onRoleChange('admin')}
            className={`text-left p-5 rounded-2xl border transition-all flex flex-col justify-between ${
              currentRole === 'admin'
                ? isDark 
                  ? 'bg-pink-950/40 border-pink-500 ring-2 ring-pink-500/30 shadow-lg' 
                  : 'bg-pink-50/80 border-pink-500 ring-2 ring-pink-500/30 shadow-md'
                : isDark
                  ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  currentRole === 'admin' ? 'bg-pink-600 text-white shadow' : 'bg-slate-800 text-pink-400'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                {currentRole === 'admin' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-600 text-white">Active Mode</span>
                ) : (
                  <span className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Click to Select</span>
                )}
              </div>
              <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Institution / Admin
              </h3>
              <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Correlate curriculum with live corporate hiring demand, track placement trajectories, and audit NCrF / NEP 2020 credits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/20 flex items-center justify-between text-xs font-bold text-pink-500">
              <span>Macro Demand & Compliance</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

        </div>

        {/* Dynamic Feature Directory for Selected Role */}
        <div className={`p-5 md:p-6 rounded-2xl border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200 shadow-inner'
        }`}>
          {currentRole === 'student' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-800/60">
                <div>
                  <h4 className={`text-sm font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    <span>All Features Available for Students (11 Tools)</span>
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Click any feature below to launch directly into that tool.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('dashboard', 'student')}
                  className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Open Full Student Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { id: 'dashboard', name: 'Student Dashboard', icon: Target, desc: 'Mastery radar & progress tracker' },
                  { id: 'opportunities', name: 'Opportunities Hub', icon: Zap, desc: 'Unstop, Devfolio & PM Scheme' },
                  { id: 'skill-gap', name: 'Skill Gap Analyzer', icon: BrainCircuit, desc: 'Target role proficiency gap' },
                  { id: 'career-navigator', name: 'AI Career Navigator', icon: ChevronRight, desc: 'Pathway milestones & certifications' },
                  { id: 'learning', name: 'Adaptive Learning', icon: BookOpen, desc: 'Concept mastery & micro-quizzes' },
                  { id: 'study-buddy', name: 'AI Study Buddy', icon: Bot, desc: '24/7 multilingual query tutor' },
                  { id: 'revision-planner', name: 'Revision Planner', icon: Calendar, desc: 'Exam prep & daily schedule' },
                  { id: 'mock-interview', name: 'AI Mock Interview', icon: MessageSquareCode, desc: 'Technical questions & AI scoring' },
                  { id: 'mentors', name: '1:1 Mentors Hub', icon: Users, desc: 'Sessions with industry experts' },
                  { id: 'vocational', name: 'Vocational Hub', icon: Award, desc: 'EV, Solar & hardware project repos' },
                  { id: 'offline-packs', name: 'Offline Packs', icon: Clock, desc: 'Low-bandwidth micro-modules' }
                ].map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onNavigateTab(tool.id, 'student')}
                      className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                        isDark 
                          ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850' 
                          : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {tool.name}
                        </span>
                      </div>
                      <p className={`text-[11px] line-clamp-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tool.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentRole === 'teacher' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-800/60">
                <div>
                  <h4 className={`text-sm font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <UserCheck className="w-4 h-4 text-purple-500" />
                    <span>All Features Available for Teachers & Educators</span>
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Faculty copilot, bilingual lesson generation, and proactive remedial hurdle identification.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('dashboard', 'teacher')}
                  className="text-xs font-bold text-purple-500 hover:text-purple-400 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Open Full Teacher Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'dashboard', name: 'Teacher Operating Console', desc: '142 students, 78.4% average concept mastery, class heatmap', icon: Users },
                  { id: 'teacher-copilot', name: 'AI Teacher Copilot', desc: 'Instant 60m lesson plans, quizzes & answer keys in 10 Indian languages', icon: Bot },
                  { id: 'learning-risk', name: 'Remedial Support Engine', desc: 'Identify early student hurdles before exams & pair with 1:1 mentors', icon: HeartHandshake }
                ].map(tool => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onNavigateTab(tool.id, 'teacher')}
                      className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                        isDark 
                          ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50 hover:bg-slate-850' 
                          : 'bg-slate-50 hover:bg-purple-50/50 border-slate-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {tool.name}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tool.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {currentRole === 'admin' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-800/60">
                <div>
                  <h4 className={`text-sm font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <ShieldCheck className="w-4 h-4 text-pink-500" />
                    <span>All Features Available for Institution Administrators</span>
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Macro skill demand analytics, empirical pilot benchmarks, and NCrF regulatory audit tools.
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('dashboard', 'admin')}
                  className="text-xs font-bold text-pink-500 hover:text-pink-400 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Open Full Admin Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'dashboard', name: 'Institution Executive Console', desc: '12,450 learners, 18,200 NCrF credits, 42 corporate hiring partners', icon: Building },
                  { id: 'institution-analytics', name: 'Skill Demand & Placement Analytics', desc: 'Department capability vs market demand mismatch index & 5-month trajectory', icon: TrendingUp },
                  { id: 'institution-analytics', name: 'Empirical Pilot Evaluation', desc: 'Anand & Mehsana pilot indicators: completion rates, repo artifacts & quiz deltas', icon: Award }
                ].map((tool, idx) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => onNavigateTab(tool.id, 'admin')}
                      className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                        isDark 
                          ? 'bg-slate-900/80 border-slate-800 hover:border-pink-500/50 hover:bg-slate-850' 
                          : 'bg-slate-50 hover:bg-pink-50/50 border-slate-200 hover:border-pink-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-500 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {tool.name}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {tool.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
                  {(opp as any).isLiveStreamed ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Streamed
                    </span>
                  ) : opp.urgencyBadge ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {opp.urgencyBadge}
                    </span>
                  ) : null}
                </div>

                <h3 className={`text-sm font-bold font-outfit line-clamp-2 mb-1 group-hover:text-indigo-400 transition ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {opp.title}
                </h3>

                <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {opp.company}
                </p>

                <div className="my-3 p-2.5 rounded-xl border bg-slate-950/40 border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Prize / Stipend</span>
                    <span className="text-xs font-black text-emerald-400 block truncate">
                      {opp.prizeOrStipend || opp.stipendOrSalary}
                    </span>
                  </div>
                  {opp.registeredCount && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Applicants</span>
                      <span className="text-[11px] font-bold text-indigo-400 block">
                        {opp.registeredCount}
                      </span>
                    </div>
                  )}
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
            className={`cursor-pointer rounded-xl p-5 border transition ${
              currentRole === 'student'
                ? isDark
                  ? 'border-indigo-500 bg-slate-900/80 ring-1 ring-indigo-500/30'
                  : 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500/30 shadow-md'
                : isDark ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_student_workspace', language)}
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Real-time skill gap analysis, adaptive multilingual quizzes, project evidence builder, and opportunity matching.
            </p>
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <span>{t('home_open_dashboard', language)}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Educator / Teacher Card */}
          <div 
            onClick={() => { onRoleChange('teacher'); onNavigateTab('dashboard', 'teacher'); }}
            className={`cursor-pointer rounded-xl p-5 border transition ${
              currentRole === 'teacher'
                ? isDark
                  ? 'border-indigo-500 bg-slate-900/80 ring-1 ring-indigo-500/30'
                  : 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500/30 shadow-md'
                : isDark ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <Bot className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_teacher_workspace', language)}
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Generate multilingual lesson plans, diagnostic quizzes, and track at-risk student intervention alerts.
            </p>
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <span>Open Teacher Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Institution Admin Card */}
          <div 
            onClick={() => { onRoleChange('admin'); onNavigateTab('dashboard', 'admin'); }}
            className={`cursor-pointer rounded-xl p-5 border transition ${
              currentRole === 'admin'
                ? isDark
                  ? 'border-indigo-500 bg-slate-900/80 ring-1 ring-indigo-500/30'
                  : 'border-indigo-500 bg-indigo-50/70 ring-1 ring-indigo-500/30 shadow-md'
                : isDark ? 'bg-slate-900/40 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t('home_admin_workspace', language)}
            </h3>
            <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              High-level cohort skill distribution charts, placement alignment metrics, and regional outreach statistics.
            </p>
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium text-indigo-600 dark:text-indigo-400 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <span>Open Admin Dashboard</span>
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
