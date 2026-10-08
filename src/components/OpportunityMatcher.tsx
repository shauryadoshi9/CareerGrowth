import React, { useState } from 'react';
import { mockOpportunities, defaultSkills, initialLearnerProfile } from '../data/mockData';
import { calculateJobMatch } from '../services/aiEngine';
import { Briefcase, Building, MapPin, CheckCircle2, AlertCircle, Sparkles, Send, Award } from 'lucide-react';
import { Opportunity, Language } from '../types';

interface OpportunityMatcherProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const OpportunityMatcher: React.FC<OpportunityMatcherProps> = ({ language, onNavigateTab }) => {
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  const opportunitiesWithMatch = mockOpportunities.map(opp =>
    calculateJobMatch(defaultSkills, initialLearnerProfile.academicGpa, opp)
  );

  const handleApply = (oppId: string) => {
    setAppliedJobs(prev => ({ ...prev, [oppId]: true }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            SIH26044 Academia-Industry Placement Engine
          </span>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Internship & Placement Matching Engine</h2>
          <p className="text-sm text-slate-300">
            Explainable matching engine: Hard eligibility criteria → Weighted skill compatibility → Bounded preference fit.
          </p>
        </div>

        <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 text-right">
          <p className="text-xs text-slate-400">Candidate Verified GPA</p>
          <p className="text-lg font-bold text-indigo-400 font-outfit">{initialLearnerProfile.academicGpa} / 10.0</p>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-6">
        {opportunitiesWithMatch.map(opp => {
          const isApplied = appliedJobs[opp.id];

          return (
            <div key={opp.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {opp.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" />
                      {opp.company}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {opp.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-outfit">{opp.title}</h3>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Match Compatibility</p>
                    <p className="text-2xl font-black text-emerald-400 font-outfit">{opp.matchScore}%</p>
                  </div>
                  
                  <button
                    disabled={isApplied || !opp.eligibilityMet}
                    onClick={() => handleApply(opp.id)}
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md ${
                      isApplied
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : opp.eligibilityMet
                        ? 'bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-white'
                        : 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isApplied ? 'Application Submitted' : opp.eligibilityMet ? 'Apply with Evidence' : 'Ineligible (GPA < Min)'}</span>
                  </button>
                </div>
              </div>

              {/* Explainable Match Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Aligned Skills */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aligned Skill Capabilities ({opp.alignedSkills?.length})</span>
                  </p>
                  <ul className="space-y-1 text-slate-300">
                    {opp.alignedSkills?.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Skills */}
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <p className="font-semibold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Missing Skills for 100% Fit ({opp.missingSkills?.length})</span>
                  </p>
                  <ul className="space-y-1 text-slate-300">
                    {opp.missingSkills?.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  {opp.missingSkills && opp.missingSkills.length > 0 && (
                    <button
                      onClick={() => onNavigateTab('learning')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline text-[11px] block pt-1"
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
