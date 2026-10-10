import React, { useState, useEffect, useMemo } from 'react';
import { mockOpportunities, defaultSkills, initialLearnerProfile } from '../data/mockData';
import { calculateJobMatch } from '../services/aiEngine';
import { 
  Building, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Check, 
  ExternalLink, 
  Search, 
  Filter, 
  Flame, 
  Trophy, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  Award,
  Sparkles,
  Zap,
  Globe,
  Plus,
  BookOpen,
  DollarSign,
  X,
  Radio,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Language, ThemeMode, JobApplication, Opportunity, LiveStreamEvent, OpportunityTickPayload } from '../types';
import { 
  submitJobApplication, 
  fetchApplications, 
  fetchOpportunitiesApi, 
  postCustomOpportunityApi,
  subscribeToLiveStream,
  triggerManualExternalFetch,
  refreshOpportunitiesApi
} from '../services/api';

interface OpportunityMatcherProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  theme?: ThemeMode;
  initialFilter?: string;
}

export const OpportunityMatcher: React.FC<OpportunityMatcherProps> = ({ 
  language, 
  onNavigateTab, 
  theme = 'dark',
  initialFilter
}) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(mockOpportunities);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [submittedApps, setSubmittedApps] = useState<JobApplication[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialFilter || 'all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [minGpaFilter, setMinGpaFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [postStatusMsg, setPostStatusMsg] = useState<string | null>(null);

  // Real-Time Runtime Stream State
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [recentIncomingOpp, setRecentIncomingOpp] = useState<Opportunity | null>(null);
  const [recentApplicantTicks, setRecentApplicantTicks] = useState<Record<string, { delta: number; time: number }>>({});
  const [liveActivities, setLiveActivities] = useState<Array<{ id: string; text: string; time: string }>>([]);
  const [streamEventsCount, setStreamEventsCount] = useState<number>(0);
  const [isFetchingManual, setIsFetchingManual] = useState<boolean>(false);
  const [streamToast, setStreamToast] = useState<string | null>(null);

  // New Opportunity Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newType, setNewType] = useState<'hackathon' | 'internship' | 'quiz' | 'scholarship' | 'free_course' | 'entry_level_job'>('hackathon');
  const [newPlatform, setNewPlatform] = useState<any>('CareerGrowth Partner');
  const [newUrl, setNewUrl] = useState('');
  const [newStipend, setNewStipend] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newSkills, setNewSkills] = useState('Python & Data Structures');

  const isDark = theme === 'dark';

  useEffect(() => {
    let mounted = true;

    // Initial fetch of applications and server opportunities
    const loadInitialData = async () => {
      const [apps, serverOpps] = await Promise.all([
        fetchApplications(),
        fetchOpportunitiesApi()
      ]);

      if (mounted) {
        if (apps && apps.length > 0) {
          setSubmittedApps(apps);
          const map: Record<string, boolean> = {};
          apps.forEach(a => { if (a.opportunityId) map[a.opportunityId] = true; });
          setAppliedJobs(map);
        }

        if (serverOpps && serverOpps.length > 0) {
          setOpportunities(prev => {
            const map = new Map<string, Opportunity>();
            serverOpps.forEach(o => map.set(o.id, o));
            prev.forEach(o => { if (!map.has(o.id)) map.set(o.id, o); });
            return Array.from(map.values());
          });
        }
      }
    };
    loadInitialData();

    // Subscribe to Real-Time Server-Sent Events (SSE) Stream
    const unsubscribe = subscribeToLiveStream((event: LiveStreamEvent) => {
      if (!mounted) return;
      setIsLiveConnected(true);
      setStreamEventsCount(c => c + 1);

      if (event.type === 'initial_state') {
        if (event.opportunities && event.opportunities.length > 0) {
          setOpportunities(prev => {
            const map = new Map<string, Opportunity>();
            event.opportunities.forEach(o => map.set(o.id, o));
            prev.forEach(o => { if (!map.has(o.id)) map.set(o.id, o); });
            return Array.from(map.values());
          });
        }
      }

      if (event.type === 'new_opportunity') {
        const newOpp = event.opportunity;
        setOpportunities(prev => {
          const filtered = prev.filter(o => o.id !== newOpp.id);
          return [newOpp, ...filtered];
        });
        setRecentIncomingOpp(newOpp);
        setStreamToast(`⚡ New listing streamed from ${newOpp.sourcePlatform}: ${newOpp.title}`);
        setTimeout(() => {
          if (mounted) setStreamToast(null);
        }, 5000);
      }

      if (event.type === 'opportunity_tick') {
        setOpportunities(prev =>
          prev.map(o => o.id === event.opportunityId ? { ...o, registeredCount: event.registeredCount } : o)
        );
        setRecentApplicantTicks(prev => ({
          ...prev,
          [event.opportunityId]: { delta: event.delta, time: Date.now() }
        }));
      }

      if (event.type === 'live_activity') {
        setLiveActivities(prev => [{ id: event.id, text: event.text, time: event.time }, ...prev.slice(0, 5)]);
      }
    }, () => {
      if (mounted) setIsLiveConnected(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const opportunitiesWithMatch = useMemo(() => {
    return opportunities.map(opp =>
      calculateJobMatch(defaultSkills, initialLearnerProfile.academicGpa, opp)
    );
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    return opportunitiesWithMatch.filter(opp => {
      const matchesCategory = 
        selectedCategory === 'all' || 
        (selectedCategory === 'live_stream' && Boolean((opp as any).isLiveStreamed)) ||
        opp.category === selectedCategory ||
        opp.type === selectedCategory;

      const matchesPlatform = 
        selectedPlatform === 'all' || 
        opp.sourcePlatform === selectedPlatform;

      const matchesGpa = minGpaFilter === 0 || (opp.minGpa <= minGpaFilter);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        opp.title.toLowerCase().includes(query) ||
        opp.company.toLowerCase().includes(query) ||
        opp.location.toLowerCase().includes(query) ||
        (opp.tags && opp.tags.some(t => t.toLowerCase().includes(query))) ||
        opp.requiredSkills?.some(s => s.skillName.toLowerCase().includes(query));

      return matchesCategory && matchesPlatform && matchesGpa && matchesSearch;
    });
  }, [opportunitiesWithMatch, selectedCategory, selectedPlatform, minGpaFilter, searchQuery]);

  const handleManualFetch = async () => {
    setIsFetchingManual(true);
    try {
      const res = await refreshOpportunitiesApi();
      if (res?.success && res.opportunities) {
        setOpportunities(res.opportunities);
        if (res.freshIngested && res.freshIngested.length > 0) {
          setRecentIncomingOpp(res.freshIngested[0]);
        }
        setStreamToast(`✅ Refreshed! Harvested ${res.freshCount || 3} new ongoing opportunities, hackathons & PM Internship schemes from external portals.`);
        setTimeout(() => setStreamToast(null), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingManual(false);
    }
  };

  const handleApply = async (opp: Opportunity) => {
    setApplyingId(opp.id);
    try {
      setAppliedJobs(prev => ({ ...prev, [opp.id]: true }));
      const res = await submitJobApplication(opp.id, opp.title, opp.company, opp.matchScore || 85);
      if (res?.success) {
        if (res.applications) {
          setSubmittedApps(res.applications);
        } else {
          const updatedApps = await fetchApplications();
          setSubmittedApps(updatedApps);
        }
      }
    } finally {
      setApplyingId(null);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    const oppPayload: Partial<Opportunity> = {
      title: newTitle,
      company: newCompany,
      type: newType,
      category: newType as any,
      sourcePlatform: newPlatform,
      sourceUrl: newUrl || 'https://unstop.com',
      stipendOrSalary: newStipend || 'Competitive Stipend',
      prizeOrStipend: newStipend || 'Competitive Prize',
      deadline: newDeadline || 'Rolling Admissions',
      registeredCount: 'Just Listed',
      urgencyBadge: '⚡ New Opportunity',
      verifiedHost: true,
      minGpa: 6.0,
      requiredSkills: newSkills.split(',').map(s => ({ skillName: s.trim(), level: 70 })),
      tags: ['Community Hosted', newType, 'CareerGrowth Verified']
    };

    const res = await postCustomOpportunityApi(oppPayload);
    if (res.success && res.opportunity) {
      setOpportunities(prev => [res.opportunity!, ...prev]);
      setPostStatusMsg(`✅ "${newTitle}" posted successfully and synced to server!`);
    } else {
      setOpportunities(prev => [{ ...oppPayload, id: `opp-${Date.now()}` } as Opportunity, ...prev]);
      setPostStatusMsg(`⚠️ Opportunity added locally.`);
    }

    setNewTitle('');
    setNewCompany('');
    setNewUrl('');
    setNewStipend('');
    setNewDeadline('');
    setIsPostModalOpen(false);
    setTimeout(() => setPostStatusMsg(null), 5000);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'PM Internship Scheme':
        return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
      case 'Devfolio':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'Unstop':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Hack2Skill':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'AICTE Portal':
        return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
      case 'Google Open Source':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'NSP & Govt Portal':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
      default:
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Explorer Banner (Minimalist Style) */}
      <div className={`relative overflow-hidden rounded-2xl p-6 lg:p-8 border ${
        isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
      } transition-all`}>
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Verified Opportunity Explorer
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Industry & Government Pipelines
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center gap-1.5">
              📊 Demo Listings • Curated Sample Data
            </span>
          </div>

          <h1 className={`text-2xl md:text-3xl font-bold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Explore Genuine Hackathons, Internships, Quizzes & Scholarships
          </h1>

          <p className={`text-xs md:text-sm max-w-3xl leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Direct authenticated integration with national initiatives and premier developer portals: 
            <strong> PM Internship Scheme (Govt of India MCA)</strong>, <strong>Devfolio</strong>, <strong>Unstop</strong>, <strong>Hack2Skill</strong>, <strong>NSP Scholarships</strong>, and <strong>AICTE</strong>. Apply directly or link your verified portfolio evidence.
          </p>

          {/* Quick Metrics Bar & Post Opportunity Action */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs font-medium">
            <div className="flex flex-wrap items-center gap-5 text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>₹45L+ Verified Grants & Stipends</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Top 500 National Corporates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>100% Genuine External Portals</span>
              </div>
            </div>

            <button
              onClick={() => setIsPostModalOpen(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post Your Opportunity</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Runtime Pipeline & External Source Control Panel */}
      <div className={`p-4 lg:p-5 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Left: Stream Status & Channels */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Runtime External Stream Active
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                {streamEventsCount} live events processed
              </span>
            </div>

            {/* External source tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-slate-500 font-medium">Synced Sources:</span>
              {['Devfolio', 'Unstop', 'PM Internship Scheme MCA', 'AICTE Portal', 'Hack2Skill', 'Google Open Source'].map(src => (
                <span key={src} className="px-2 py-0.5 rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/40 text-[10px] font-medium flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  {src}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Instant Fetch Action */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={handleManualFetch}
              disabled={isFetchingManual}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingManual ? 'animate-spin' : ''}`} />
              <span>{isFetchingManual ? 'Harvesting External Portals...' : '🔄 Refresh Live Contests & Schemes'}</span>
            </button>
          </div>
        </div>

        {/* Live Breaking Ticker Notification Ribbon */}
        {recentIncomingOpp && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-3 text-xs bg-indigo-500/5 px-3 py-2 rounded-xl border border-indigo-500/20">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white text-[9px] font-black uppercase tracking-wider shrink-0">
                ⚡ Just Streamed
              </span>
              <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {recentIncomingOpp.title}
              </span>
              <span className="text-slate-400 shrink-0 hidden sm:inline">
                ({recentIncomingOpp.sourcePlatform}) • {recentIncomingOpp.prizeOrStipend || recentIncomingOpp.stipendOrSalary}
              </span>
            </div>
            <a
              href={recentIncomingOpp.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 shrink-0 flex items-center gap-1"
            >
              <span>Explore</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {/* Live Community Activity Ribbon */}
        {liveActivities.length > 0 && (
          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400 overflow-hidden">
            <Activity className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-slate-500 font-semibold shrink-0">Live Learner Pulse:</span>
            <span className="truncate text-slate-300 font-medium">
              {liveActivities[0].text}
            </span>
          </div>
        )}
      </div>

      {postStatusMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{postStatusMsg}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Category Pills (Unstop / Devfolio Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Opportunities', icon: Sparkles },
            { id: 'live_stream', label: '🔴 Live Streamed Only', icon: Zap },
            { id: 'hackathon', label: '⚡ Hackathons & Challenges', icon: Flame },
            { id: 'internship', label: '💼 Internships (PM Scheme & Tech)', icon: Briefcase },
            { id: 'quiz', label: '🏆 Quizzes & Contests', icon: Trophy },
            { id: 'scholarship', label: '🎓 Scholarships & Grants', icon: GraduationCap },
            { id: 'free_course', label: '📚 Free Courses (NPTEL/AICTE)', icon: BookOpen },
            { id: 'job', label: '🚀 Entry-Level Jobs (TCS/Tech)', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : isDark
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search, Platform Filter & Eligibility Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, skills (e.g. Python, RAG), or host..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          {/* Platform Filter Buttons */}
          <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {['all', 'PM Internship Scheme', 'Devfolio', 'Unstop', 'Hack2Skill', 'AICTE Portal', 'NSP & Govt Portal'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  selectedPlatform === p
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isDark
                      ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === 'all' ? 'All Portals' : p}
              </button>
            ))}
          </div>

          {/* Eligibility Filter */}
          <div className="md:col-span-2">
            <select
              value={minGpaFilter}
              onChange={e => setMinGpaFilter(Number(e.target.value))}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold border outline-none ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <option value="0">Eligibility: Any GPA</option>
              <option value="6.0">Min 6.0 GPA</option>
              <option value="7.0">Min 7.0 GPA</option>
              <option value="7.5">Min 7.5 GPA</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map(opp => {
          const isApplied = appliedJobs[opp.id];
          const isApplying = applyingId === opp.id;

          return (
            <div
              key={opp.id}
              className={`group rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10'
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xl'
              }`}
            >
              {/* Card Header Top Gradient Accent */}
              <div className={`h-2.5 w-full bg-gradient-to-r ${opp.bannerGradient || 'from-indigo-500 to-purple-600'}`} />

              <div className="p-6 space-y-4 flex-1">
                {/* Platform Tag & Urgency / Deadline */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getPlatformBadge(opp.sourcePlatform)}`}>
                      {opp.sourcePlatform}
                    </span>
                    {(opp as any).isLiveStreamed && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live Streamed
                      </span>
                    )}
                    {opp.urgencyBadge && !(opp as any).isLiveStreamed && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {opp.urgencyBadge}
                      </span>
                    )}
                  </div>
                  {opp.deadline && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span className="truncate">{opp.deadline}</span>
                    </div>
                  )}
                </div>

                {/* Title & Host Organization */}
                <div>
                  <h3 className={`text-base font-bold line-clamp-2 group-hover:text-indigo-400 transition ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {opp.title}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5 text-xs font-medium text-slate-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{opp.company}</span>
                    </div>
                    {opp.registeredCount && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[11px] text-indigo-400 font-semibold">
                          {opp.registeredCount}
                        </span>
                        {recentApplicantTicks[opp.id] && (Date.now() - recentApplicantTicks[opp.id].time < 6000) && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                            +{recentApplicantTicks[opp.id].delta} new!
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Location & Stipend/Prize */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Location</span>
                    <span className={`font-semibold truncate block mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {opp.location}
                    </span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-100'}`}>
                    <span className="text-[10px] text-slate-500 block uppercase font-semibold">Prize / Stipend</span>
                    <span className="font-bold text-emerald-400 truncate block mt-0.5">
                      {opp.prizeOrStipend || opp.stipendOrSalary}
                    </span>
                  </div>
                </div>

                {/* Match Score & Eligibility Meter */}
                <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950/40 border-slate-800/60' : 'bg-indigo-50/50 border-indigo-100'}`}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-400">Skill Alignment</span>
                    <span className="font-bold text-indigo-400">{opp.matchScore || 85}% Match</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${opp.matchScore || 85}%` }}
                    />
                  </div>
                </div>

                {/* Required Skills Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {opp.requiredSkills?.slice(0, 3).map((s, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                        isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      {s.skillName}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className={`p-5 border-t space-y-2 ${isDark ? 'border-slate-800/80 bg-slate-950/30' : 'border-slate-100 bg-slate-50/50'}`}>
                
                {/* Official Direct Apply Link */}
                <a
                  href={opp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
                >
                  <span>Apply on Official {opp.sourcePlatform}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                {/* Internal Apply with Portfolio Evidence Button */}
                <button
                  disabled={isApplied || isApplying}
                  onClick={() => handleApply(opp)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    isApplied
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-default'
                      : isDark
                        ? 'border-slate-700 hover:border-slate-600 text-slate-300 hover:bg-slate-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-white'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Portfolio Application Logged</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isApplying ? 'Submitting Evidence...' : 'Apply with CareerGrowth Evidence'}</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className={`p-12 text-center rounded-3xl border ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
          <Search className="w-12 h-12 mx-auto text-slate-500 mb-3" />
          <h3 className="text-lg font-bold">No opportunities match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting the platform filter or searching for another skill term.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedPlatform('all'); setSearchQuery(''); setMinGpaFilter(0); }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Submitted Applications History Drawer */}
      {submittedApps.length > 0 && (
        <div className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Your Verified Application Evidence Log
              </h3>
              <p className="text-xs text-slate-400">Applications synced with the database and verified recruiter dashboard</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              {submittedApps.length} Active Applications
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {submittedApps.map((app, index) => (
              <div 
                key={app.id || index}
                className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                  isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{app.opportunityTitle}</p>
                  <p className="text-[11px] text-slate-400 truncate">{app.company}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] shrink-0">
                  {app.status || 'Verified'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Post New Custom Opportunity */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`max-w-lg w-full rounded-3xl border p-6 shadow-2xl relative ${
            isDark ? 'bg-slate-900 border-indigo-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setIsPostModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold font-outfit mb-1">
              Host or Post a New Opportunity
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add hackathons, quizzes, internships or jobs to the live database for learners across India.
            </p>

            <form onSubmit={handleCreateOpportunity} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Opportunity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Web3 & AI Builders Hackathon 2026"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Host Company / College</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIT Delhi / DevClub"
                    value={newCompany}
                    onChange={e => setNewCompany(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category Type</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="internship">Internship</option>
                    <option value="quiz">Quiz / Competition</option>
                    <option value="scholarship">Scholarship</option>
                    <option value="free_course">Free Course</option>
                    <option value="entry_level_job">Entry-Level Job</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Source Platform</label>
                  <select
                    value={newPlatform}
                    onChange={e => setNewPlatform(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="CareerGrowth Partner">CareerGrowth Partner</option>
                    <option value="Unstop">Unstop</option>
                    <option value="Devfolio">Devfolio</option>
                    <option value="Hack2Skill">Hack2Skill</option>
                    <option value="PM Internship Scheme">PM Internship Scheme</option>
                    <option value="AICTE Portal">AICTE Portal</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Prize Pool / Stipend</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹5,00,000 Cash Pool"
                    value={newStipend}
                    onChange={e => setNewStipend(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Official Registration Link URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={e => setNewUrl(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Application Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Nov 2026"
                    value={newDeadline}
                    onChange={e => setNewDeadline(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={newSkills}
                    onChange={e => setNewSkills(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg"
                >
                  Publish to Platform DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Live Stream Notification Toast */}
      {streamToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live Pipeline Broadcast</p>
              <p className="text-xs font-semibold text-slate-200 line-clamp-2">{streamToast}</p>
            </div>
          </div>
          <button
            onClick={() => setStreamToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
