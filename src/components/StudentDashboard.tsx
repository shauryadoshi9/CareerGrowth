import React from 'react';
import { initialLearnerProfile, defaultSkills, careerPathways, mockOpportunities } from '../data/mockData';
import { calculateSkillGap, calculateJobMatch } from '../services/aiEngine';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Sparkles, Target, Award, ArrowUpRight, Zap, CheckCircle, BookOpen, Briefcase, RefreshCw } from 'lucide-react';
import { Language } from '../types';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
  language: Language;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab, language }) => {
  const targetCareer = careerPathways.find(c => c.id === initialLearnerProfile.targetCareerId) || careerPathways[0];
  const gapAnalysis = calculateSkillGap(defaultSkills, targetCareer);
  
  const radarData = defaultSkills.slice(0, 6).map(s => ({
    skill: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    Current: s.currentProficiency,
    Benchmark: s.requiredProficiency,
  }));

  const topOpportunities = mockOpportunities.map(opp => calculateJobMatch(defaultSkills, initialLearnerProfile.academicGpa, opp)).slice(0, 2);

  return (
    <div className="space-y-6">
      
      {/* Learner Welcome Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                ● Live Student Intelligence Model
              </span>
              <span className="text-xs text-slate-400">{initialLearnerProfile.institution}</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white font-outfit">
              Welcome back, <span className="gradient-text">{initialLearnerProfile.name}</span>!
            </h2>
            <p className="text-sm text-slate-300">
              Target Career Pathway: <span className="text-indigo-400 font-semibold">{targetCareer.title}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <p className="text-xs text-slate-400">Career Readiness Score</p>
              <p className="text-2xl font-black text-indigo-400 font-outfit">{gapAnalysis.readinessScore}%</p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-indigo-500/10 font-bold text-white text-xs">
              {gapAnalysis.readinessScore}%
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Skill Readiness</span>
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{gapAnalysis.matchedSkillsCount} / {gapAnalysis.totalRequiredSkills}</span>
            <span className="text-xs text-emerald-400 font-medium">Skills Aligned</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400" style={{ width: `${(gapAnalysis.matchedSkillsCount / gapAnalysis.totalRequiredSkills) * 100}%` }} />
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Roadmap</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">Month 1</span>
            <span className="text-xs text-indigo-400 font-medium">Phase 1 of 3</span>
          </div>
          <p className="text-xs text-slate-400 truncate">35 Hours Estimated Learning</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Top Verified Evidence</span>
            <Award className="w-4 h-4 text-pink-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">4 Credentials</span>
            <span className="text-xs text-pink-400 font-medium">NPTEL & AICTE</span>
          </div>
          <p className="text-xs text-slate-400">Evidence-Backed Profile</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Internship Fit</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400">82% Match</span>
            <span className="text-xs text-slate-400">SIH26044 Engine</span>
          </div>
          <p className="text-xs text-emerald-400/80">Eligible for GIFT City Hybrid</p>
        </div>
      </div>

      {/* Main Analytics & Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Skill Radar & Bar Graph */}
        <div className="lg:col-span-7 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                <span>Skill Proficiency vs Industry Benchmark</span>
              </h3>
              <p className="text-xs text-slate-400">Real-time taxonomy evaluation against target role</p>
            </div>
            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>Full Gap Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="skill" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Learner Level" dataKey="Current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Required Level" dataKey="Benchmark" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span className="text-slate-300">Aarav Patel (Current Level)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500 inline-block" />
              <span className="text-slate-300">Target Role Benchmark</span>
            </div>
          </div>
        </div>

        {/* Right: Critical Missing Skills & Recommended Next Actions */}
        <div className="lg:col-span-5 glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Priority Action Items</span>
              </h3>
              <span className="text-[11px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                AI Suggested
              </span>
            </div>

            <div className="space-y-3">
              {gapAnalysis.criticalMissingSkills.map((gap, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-white">{gap.name}</p>
                    <p className="text-[11px] text-slate-400">
                      Gap: <span className="text-amber-400 font-medium">-{gap.gapScore}%</span> below target
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('learning')}
                    className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-medium rounded-lg transition-all"
                  >
                    Start Topic
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">SIH26044 Top Job Match</h4>
            {topOpportunities[0] && (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-3 rounded-xl border border-indigo-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{topOpportunities[0].title}</p>
                  <p className="text-[11px] text-slate-400">{topOpportunities[0].company} • {topOpportunities[0].stipendOrSalary}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-400">{topOpportunities[0].matchScore}% Match</span>
                  <button
                    onClick={() => onNavigateTab('opportunities')}
                    className="block text-[11px] text-indigo-400 underline font-medium hover:text-indigo-300"
                  >
                    View Breakdown
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
