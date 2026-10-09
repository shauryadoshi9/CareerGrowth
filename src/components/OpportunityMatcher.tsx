import React, { useState, useEffect } from 'react';
import { mockOpportunities, defaultSkills, initialLearnerProfile } from '../data/mockData';
import { calculateJobMatch } from '../services/aiEngine';
import { Building, MapPin, CheckCircle2, AlertCircle, Send, Check } from 'lucide-react';
import { Language, ThemeMode, JobApplication } from '../types';
import { submitJobApplication, fetchApplications } from '../services/api';

interface OpportunityMatcherProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  theme?: ThemeMode;
}

export const OpportunityMatcher: React.FC<OpportunityMatcherProps> = ({ language, onNavigateTab, theme = 'dark' }) => {
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [submittedApps, setSubmittedApps] = useState<JobApplication[]>([]);
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
  }, []);

  const opportunitiesWithMatch = mockOpportunities.map(opp =>
    calculateJobMatch(defaultSkills, initialLearnerProfile.academicGpa, opp)
  );

  const handleApply = async (opp: any) => {
    setAppliedJobs(prev => ({ ...prev, [opp.id]: true }));
    const res = await submitJobApplication(opp.id, opp.title, opp.company, opp.matchScore || 85);
    if (res.success) {
      if (res.applications) {
        setSubmittedApps(res.applications);
      } else {
        const updatedApps = await fetchApplications();
        setSubmittedApps(updatedApps);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900/80 border-emerald-500/30' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-md'
      }`}>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-semibold">
            Academia-Industry Placement Engine
          </span>
          <h2 className={`text-2xl font-bold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Internship & Placement Matching Engine
          </h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Explainable matching engine: Hard eligibility criteria → Weighted skill compatibility → Server Database Application sync.
          </p>
        </div>

        <div className={`px-4 py-3 rounded-xl border text-right ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified GPA</p>
          <p className="text-lg font-bold text-indigo-500 font-outfit">{initialLearnerProfile.academicGpa} / 10.0</p>
        </div>
      </div>

      {/* Applied Server Applications Status Card */}
      {submittedApps.length > 0 && (
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-indigo-950/30 border-indigo-500/40' : 'bg-indigo-50 border-indigo-200'}`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5 ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Server Stored Applications ({submittedApps.length})</span>
          </h3>
          <div className="space-y-1.5">
            {submittedApps.map(app => (
              <div key={app.id} className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div>
                  <span className="font-bold text-indigo-400">{app.opportunityTitle}</span>
                  <span className="text-slate-400"> at {app.company}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[11px]">
                  {app.status || 'Saved to DB'} ({app.matchScore}% Match)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities List */}
      <div className="space-y-6">
        {opportunitiesWithMatch.map(opp => {
          const isApplied = appliedJobs[opp.id];

          return (
            <div key={opp.id} className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {opp.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <Building className="w-3.5 h-3.5" />
                      {opp.company}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      <MapPin className="w-3.5 h-3.5" />
                      {opp.location}
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>{opp.title}</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Compatibility</p>
                    <p className="text-2xl font-black text-emerald-500 font-outfit">{opp.matchScore}%</p>
                  </div>
                  
                  <button
                    disabled={isApplied || !opp.eligibilityMet}
                    onClick={() => handleApply(opp)}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : opp.eligibilityMet
                        ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-white'
                        : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isApplied ? 'Application Stored in Server' : opp.eligibilityMet ? 'Apply & Post to Server' : 'Ineligible (GPA < Min)'}</span>
                  </button>
                </div>
              </div>

              {/* Explainable Match Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Aligned Skills */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className="font-semibold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aligned Capabilities ({opp.alignedSkills?.length})</span>
                  </p>
                  <ul className={`space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {opp.alignedSkills?.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Skills */}
                <div className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className="font-semibold text-amber-500 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Missing Skills for 100% Fit ({opp.missingSkills?.length})</span>
                  </p>
                  <ul className={`space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {opp.missingSkills?.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  {opp.missingSkills && opp.missingSkills.length > 0 && (
                    <button
                      onClick={() => onNavigateTab('learning')}
                      className="text-indigo-500 hover:text-indigo-400 font-semibold underline text-[11px] block pt-1"
                    >
                      Fast-Track Gap Learning Roadmaps
                    </button>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
