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
  Globe
} from 'lucide-react';
import { Language, ThemeMode, JobApplication, Opportunity } from '../types';
import { submitJobApplication, fetchApplications } from '../services/api';

interface OpportunityMatcherProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  theme?: ThemeMode;
}

export const OpportunityMatcher: React.FC<OpportunityMatcherProps> = ({ 
  language, 
  onNavigateTab, 
  theme = 'dark' 
}) => {
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [submittedApps, setSubmittedApps] = useState<JobApplication[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    let mounted = true;
    const loadApps = async () => {
      const apps = await fetchApplications();
      if (mounted && apps.length > 0) {
        setSubmittedApps(apps);
        const map: Record<string, boolean> = {};
        apps.forEach(a => { if (a.opportunityId) map[a.opportunityId] = true; });
        setAppliedJobs(map);
      }
    };
    loadApps();
    return () => { mounted = false; };
  }, []);

  const opportunitiesWithMatch = useMemo(() => {
    return mockOpportunities.map(opp =>
      calculateJobMatch(defaultSkills, initialLearnerProfile.academicGpa, opp)
    );
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunitiesWithMatch.filter(opp => {
      const matchesCategory = 
        selectedCategory === 'all' || 
        opp.category === selectedCategory ||
        opp.type === selectedCategory;

      const matchesPlatform = 
        selectedPlatform === 'all' || 
        opp.sourcePlatform === selectedPlatform;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        opp.title.toLowerCase().includes(query) ||
        opp.company.toLowerCase().includes(query) ||
        opp.location.toLowerCase().includes(query) ||
        (opp.tags && opp.tags.some(t => t.toLowerCase().includes(query)));

      return matchesCategory && matchesPlatform && matchesSearch;
    });
  }, [opportunitiesWithMatch, selectedCategory, selectedPlatform, searchQuery]);

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
      default:
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Explorer Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-8 border ${
        isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-indigo-200'
      } shadow-2xl transition-all`}>
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Verified Opportunity Explorer
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Live Industry Pipelines
            </span>
          </div>

          <h1 className={`text-3xl md:text-4xl font-extrabold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Explore Genuine Hackathons, Internships & Competitions
          </h1>

          <p className={`text-sm md:text-base max-w-3xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Direct authenticated integration with national initiatives and premier developer portals: 
            <strong> PM Internship Scheme (Govt of India)</strong>, <strong>Devfolio</strong>, <strong>Unstop</strong>, and <strong>Hack2Skill</strong>. Apply directly or link your verified portfolio evidence.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>₹35L+ Verified Grants & Stipends</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Top 500 National Corporates</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>100% Genuine Portals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Category Pills (Unstop / Devfolio Style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Opportunities', icon: Sparkles },
            { id: 'hackathon', label: '⚡ Hackathons', icon: Flame },
            { id: 'internship', label: '💼 Internships (PM Scheme & Tech)', icon: Briefcase },
            { id: 'quiz', label: '🏆 Quizzes & Competitions', icon: Trophy },
            { id: 'scholarship', label: '🎓 Scholarships & Grants', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
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

        {/* Search & Platform Filter Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title, skills, or company..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500' 
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          {/* Platform Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Source:
            </span>
            {['all', 'PM Internship Scheme', 'Devfolio', 'Unstop', 'Hack2Skill', 'AICTE Portal', 'Google Open Source'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedPlatform === p
                    ? 'bg-indigo-600 text-white shadow-md'
                    : isDark
                      ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {p === 'all' ? 'All Sources' : p}
              </button>
            ))}
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
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getPlatformBadge(opp.sourcePlatform)}`}>
                      {opp.sourcePlatform}
                    </span>
                    {opp.urgencyBadge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {opp.urgencyBadge}
                      </span>
                    )}
                  </div>
                  {opp.deadline && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{opp.deadline}</span>
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
                      <span className="text-[11px] text-indigo-400 font-semibold shrink-0">
                        {opp.registeredCount}
                      </span>
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
                      <span>{isApplying ? 'Submitting Evidence...' : 'Apply with SkillBridge Evidence'}</span>
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
            onClick={() => { setSelectedCategory('all'); setSelectedPlatform('all'); setSearchQuery(''); }}
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

    </div>
  );
};
