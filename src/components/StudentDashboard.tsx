import React, { useState, useEffect } from 'react';
import { initialLearnerProfile, defaultSkills, careerPathways, mockOpportunities } from '../data/mockData';
import { calculateSkillGap, calculateJobMatch } from '../services/aiEngine';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Target, Award, ArrowUpRight, Zap, BookOpen, Briefcase, Plus, Save, Trash2, CheckCircle, Bot, Calendar, MessageSquareCode, Sparkles, Flame, Users } from 'lucide-react';
import { Language, ThemeMode, Skill } from '../types';
import { fetchSkillsFromServer, addSkillToServer, deleteSkillFromServer } from '../services/api';

interface StudentDashboardProps {
  onNavigateTab: (tab: string) => void;
  language: Language;
  theme?: ThemeMode;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigateTab, language, theme = 'dark' }) => {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'core_tech' | 'practical_vocational' | 'domain_knowledge' | 'soft_skills'>('core_tech');
  const [newSkillScore, setNewSkillScore] = useState(70);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    let isMounted = true;
    const loadSkills = async () => {
      const serverSkills = await fetchSkillsFromServer();
      if (isMounted && serverSkills && serverSkills.length > 0) {
        setSkills(serverSkills);
      }
    };
    loadSkills();
  }, []);

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: Partial<Skill> = {
      name: newSkillName,
      category: newSkillCategory,
      currentProficiency: Number(newSkillScore),
      requiredProficiency: 80,
      evidenceCount: 1
    };

    const res = await addSkillToServer(newSkill);
    if (res.success && res.skills) {
      setSkills(res.skills);
      setStatusMsg(`✅ "${newSkillName}" saved to dynamic server DB!`);
    } else {
      setSkills(prev => [...prev, { ...newSkill, id: `skill-${Date.now()}` } as Skill]);
      setStatusMsg(`⚠️ Skill added locally.`);
    }

    setNewSkillName('');
    setIsAddingSkill(false);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDeleteSkill = async (id: string) => {
    const res = await deleteSkillFromServer(id);
    if (res.success && res.skills) {
      setSkills(res.skills);
    } else {
      setSkills(prev => prev.filter(s => s.id !== id));
    }
  };

  const targetCareer = careerPathways.find(c => c.id === initialLearnerProfile.targetCareerId) || careerPathways[0];
  const gapAnalysis = calculateSkillGap(skills, targetCareer);
  
  const radarData = skills.slice(0, 6).map(s => ({
    skill: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    Current: s.currentProficiency,
    Benchmark: s.requiredProficiency,
  }));

  const topOpportunities = mockOpportunities.map(opp => calculateJobMatch(skills, initialLearnerProfile.academicGpa, opp)).slice(0, 2);

  return (
    <div className="space-y-6">
      
      {/* Learner Welcome Banner */}
      <div className={`p-6 rounded-2xl border relative overflow-hidden transition-all ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-indigo-500/30' 
          : 'bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-indigo-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-semibold">
                ● Dynamic Server Sync Active
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{initialLearnerProfile.institution}</span>
            </div>
            <h2 className={`text-2xl lg:text-3xl font-extrabold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Welcome back, <span className="gradient-text">{initialLearnerProfile.name}</span>!
            </h2>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Target Pathway: <span className="text-indigo-500 font-semibold">{targetCareer.title}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingSkill(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Skill</span>
            </button>

            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="text-right">
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Readiness Score</p>
                <p className="text-2xl font-black text-indigo-500 font-outfit">{gapAnalysis.readinessScore}%</p>
              </div>
              <div className="w-10 h-10 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-indigo-500/10 font-bold text-indigo-500 text-xs">
                {gapAnalysis.readinessScore}%
              </div>
            </div>
          </div>
        </div>

        {statusMsg && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-fade-in flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Add Skill Modal / Form */}
      {isAddingSkill && (
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900 border-indigo-500/40' : 'bg-white border-indigo-200 shadow-xl'}`}>
          <h3 className={`text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Add New Skill (Stores to Dynamic Server DB)
          </h3>
          <form onSubmit={handleAddSkill} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Skill Name</label>
              <input
                type="text"
                required
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder="e.g. PyTorch Model Fine-Tuning"
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as any)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="core_tech">Core Software & AI</option>
                <option value="practical_vocational">Practical Vocational (Solar / EV)</option>
                <option value="domain_knowledge">Domain Knowledge</option>
                <option value="soft_skills">Soft Skills & Communication</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Current Proficiency ({newSkillScore}%)</label>
              <input
                type="range"
                min="10"
                max="100"
                value={newSkillScore}
                onChange={(e) => setNewSkillScore(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to Server</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSkill(false)}
                className={`px-3 py-2 rounded-xl border text-xs ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'}`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Tracked Skills</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{skills.length} Skills</span>
            <span className="text-xs text-emerald-500 font-medium">Dynamic DB</span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">{gapAnalysis.matchedSkillsCount} aligned with benchmark</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Active Roadmap</span>
            <BookOpen className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Phase 1</span>
            <span className="text-xs text-indigo-500 font-medium">Month 1</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">35 Hours Estimated Learning</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Verified Credentials</span>
            <Award className="w-4 h-4 text-pink-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>4 Badges</span>
            <span className="text-xs text-pink-500 font-medium">NPTEL & AICTE</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Evidence-Backed Profile</p>
        </div>

        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Top Placement Fit</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-500">85% Match</span>
            <span className="text-xs text-slate-400">Verified Match</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Eligible for GIFT City Hybrid</p>
        </div>

      </div>

      {/* Quick Acceleration Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: AI Study Buddy */}
        <div 
          onClick={() => onNavigateTab('study-buddy')}
          className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
            isDark 
              ? 'bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border-indigo-500/30 hover:border-indigo-400' 
              : 'bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border-indigo-200 hover:border-indigo-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Multilingual Voice
            </span>
          </div>
          <h4 className={`text-sm font-bold font-outfit mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI Study Buddy
          </h4>
          <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Simplifies complex concepts into plain analogies with Hindi/Gujarati voice synthesis & micro-quizzes.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
            <span>Ask Buddy</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 2: Daily Revision & Growth Journey */}
        <div 
          onClick={() => onNavigateTab('revision-planner')}
          className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
            isDark 
              ? 'bg-gradient-to-br from-pink-950/40 via-slate-900 to-slate-900 border-pink-500/30 hover:border-pink-400' 
              : 'bg-gradient-to-br from-pink-50/70 via-white to-rose-50/50 border-pink-200 hover:border-pink-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
              Micro-Schedules
            </span>
          </div>
          <h4 className={`text-sm font-bold font-outfit mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Revision & Journey
          </h4>
          <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Generates 30m/45m schedules based on weak topics + 5-stage career progression milestones.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs font-semibold text-pink-400 group-hover:text-pink-300">
            <span>View Timeline</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 3: Mock Interview Engine */}
        <div 
          onClick={() => onNavigateTab('mock-interview')}
          className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
            isDark 
              ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border-cyan-500/30 hover:border-cyan-400' 
              : 'bg-gradient-to-br from-cyan-50/70 via-white to-sky-50/50 border-cyan-200 hover:border-cyan-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Rubric Feedback
            </span>
          </div>
          <h4 className={`text-sm font-bold font-outfit mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Mock Interview
          </h4>
          <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Technical practice for AI, Full-Stack & Clean Tech roles with AI grading and targeted drill tasks.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
            <span>Start Practice</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 4: Verified Opportunities */}
        <div 
          onClick={() => onNavigateTab('opportunities')}
          className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
            isDark 
              ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/30 hover:border-emerald-400' 
              : 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border-emerald-200 hover:border-emerald-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Devfolio & Unstop
            </span>
          </div>
          <h4 className={`text-sm font-bold font-outfit mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Opportunities Hub
          </h4>
          <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Direct links & match scores for PM Internship Scheme, Devfolio, Unstop & Hack2Skill hackathons.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
            <span>Browse Contests</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Card 5: 1:1 Industry Mentors */}
        <div 
          onClick={() => onNavigateTab('mentors')}
          className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
            isDark 
              ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-900 border-purple-500/30 hover:border-purple-400' 
              : 'bg-gradient-to-br from-purple-50/70 via-white to-indigo-50/50 border-purple-200 hover:border-purple-400 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Google & MS
            </span>
          </div>
          <h4 className={`text-sm font-bold font-outfit mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            1:1 Top Mentors
          </h4>
          <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Book 1:1 sessions with verified engineers and researchers from Google, Microsoft, and Zerodha.
          </p>
          <div className="mt-3 pt-3 border-t border-slate-700/30 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
            <span>Book 1:1</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Main Analytics & Recommendations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Skill Radar Chart */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'} space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Skill Proficiency vs Industry Benchmark
              </h3>
              <p className="text-xs text-slate-400">Dynamic taxonomy evaluation against target role</p>
            </div>
            <button
              onClick={() => onNavigateTab('skill-gap')}
              className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1"
            >
              <span>Full Gap Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke={isDark ? '#334155' : '#cbd5e1'} />
                <PolarAngleAxis dataKey="skill" stroke={isDark ? '#94a3b8' : '#475569'} tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#475569' : '#94a3b8'} />
                <Radar name="Learner Level" dataKey="Current" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Radar name="Required Level" dataKey="Benchmark" stroke="#ec4899" fill="#ec4899" fillOpacity={0.2} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: '#334155', color: isDark ? '#fff' : '#000' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Skill List with Delete option */}
          <div className="space-y-2 pt-2 border-t border-slate-700/50">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Currently Saved Server Skills ({skills.length})
            </h4>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
              {skills.map(s => (
                <span 
                  key={s.id} 
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <span>{s.name} ({s.currentProficiency}%)</span>
                  <button 
                    onClick={() => handleDeleteSkill(s.id)}
                    className="text-red-400 hover:text-red-300 ml-1"
                    title="Delete from server"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Critical Missing Skills & Recommended Next Actions */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-md'} space-y-4 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Priority Action Items</span>
              </h3>
              <span className="text-[11px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                AI Suggested
              </span>
            </div>

            <div className="space-y-3">
              {gapAnalysis.criticalMissingSkills.map((gap, idx) => (
                <div key={idx} className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="space-y-0.5">
                    <p className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{gap.name}</p>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Gap: <span className="text-amber-500 font-medium">-{gap.gapScore}%</span> below target
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('learning')}
                    className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 border border-indigo-500/30 text-xs font-semibold rounded-lg transition-all"
                  >
                    Start Topic
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50 space-y-2">
            <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Top Industry Job Match
            </h4>
            {topOpportunities[0] && (
              <div className={`p-3 rounded-xl border flex items-center justify-between ${
                isDark ? 'bg-indigo-950/40 border-indigo-500/30' : 'bg-indigo-50/60 border-indigo-200'
              }`}>
                <div>
                  <p className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{topOpportunities[0].title}</p>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{topOpportunities[0].company} • {topOpportunities[0].stipendOrSalary}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-500">{topOpportunities[0].matchScore}% Match</span>
                  <button
                    onClick={() => onNavigateTab('opportunities')}
                    className="block text-[11px] text-indigo-500 underline font-medium hover:text-indigo-400"
                  >
                    View & Apply
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
