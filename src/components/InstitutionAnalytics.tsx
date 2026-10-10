import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { 
  ShieldCheck, 
  TrendingUp, 
  Building2, 
  Award, 
  PieChart, 
  Users, 
  ArrowUpRight, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  FolderGit2, 
  MessageSquare, 
  Zap 
} from 'lucide-react';
import { Language, ThemeMode } from '../types';

interface InstitutionAnalyticsProps {
  language: Language;
  theme?: ThemeMode;
}

export const InstitutionAnalytics: React.FC<InstitutionAnalyticsProps> = ({ language, theme }) => {
  const isDark = theme !== 'light';

  const cohortSkillData = [
    { department: 'Computer Science & AI', Demand: 92, Capability: 74 },
    { department: 'Electrical & Solar PV', Demand: 85, Capability: 62 },
    { department: 'EV Mobility Tech', Demand: 88, Capability: 58 },
    { department: 'Agricultural Tech & IoT', Demand: 78, Capability: 65 },
    { department: 'Mechanical & Automation', Demand: 75, Capability: 70 },
  ];

  const trendData = [
    { month: 'Jan', Readiness: 54, Placed: 32 },
    { month: 'Feb', Readiness: 62, Placed: 45 },
    { month: 'Mar', Readiness: 68, Placed: 58 },
    { month: 'Apr', Readiness: 76, Placed: 72 },
    { month: 'May', Readiness: 84, Placed: 82 },
  ];

  // Pilot Evaluation Metrics (Report Highlight #14)
  const pilotEvaluationMetrics = [
    {
      id: 'metric-1',
      title: 'Learning-Plan Completion',
      measure: '76.4% Completion',
      trend: '+14.2% vs baseline static curriculum',
      desc: 'Proportion of personalized 3-month adaptive milestones finished on time.',
      icon: BookOpen,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30'
    },
    {
      id: 'metric-2',
      title: 'Diagnostic Quiz Improvement',
      measure: '+24.8% Score Delta',
      trend: 'Tested across 1,200 micro-quizzes',
      desc: 'Average score increase between pre-test and post-topic AI Study Buddy review.',
      icon: TrendingUp,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: 'metric-3',
      title: 'Completed Portfolio Projects',
      measure: '412 Verified Repos',
      trend: '100% with public GitHub artifacts',
      desc: 'Discrete multi-step projects recorded as tangible recruiter evidence.',
      icon: FolderGit2,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/30'
    },
    {
      id: 'metric-4',
      title: 'Faculty Qualitative Feedback',
      measure: '4.8 / 5.0 Rating',
      trend: 'From 64 participating educators',
      desc: 'Teacher copilot lesson planning utility and timely supportive interventions.',
      icon: MessageSquare,
      color: 'text-pink-600 dark:text-pink-400',
      bg: 'bg-pink-500/10 border-pink-500/30'
    },
    {
      id: 'metric-5',
      title: 'Opportunity Discovery',
      measure: '1,840 Applications',
      trend: 'PM Scheme, Unstop & Devfolio',
      desc: 'Active student discovery and submissions to genuine national opportunities.',
      icon: Zap,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-pink-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/30 text-xs font-semibold">
            Macro Intelligence & Empirical Pilot Framework
          </span>
          <h2 className={`text-2xl md:text-3xl font-extrabold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Institutional Skill Demand & Placement Analytics
          </h2>
          <p className={`text-sm max-w-2xl mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Aggregate institutional insights connecting university curriculum, industry demand trends, NEP 2020 / NCrF benchmarks, and empirical pilot testing metrics.
          </p>
        </div>

        <div className={`p-4 rounded-2xl border text-right shrink-0 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Pilot Cohort</p>
          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 font-outfit">12,450 Learners</p>
        </div>
      </div>

      {/* Pilot Evaluation Framework (Report Highlight #14) */}
      <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <h3 className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Empirical Pilot Program Evaluation Framework
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Target Cohort: Engineering College Students & Rural Polytechnic Learners (Anand & Mehsana, Gujarat)
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 self-start md:self-auto">
            Empirical Pilot Measurements (Active Trial)
          </span>
        </div>

        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>Institutional Performance Indicators:</strong> The dashboard benchmarks 5 high-impact outcome metrics across college cohorts, polytechnic institutions, and regional learners.
        </p>

        {/* 5 Empirical Measures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          {pilotEvaluationMetrics.map(metric => {
            const Icon = metric.icon;
            return (
              <div 
                key={metric.id}
                className={`p-4 rounded-2xl border space-y-2 flex flex-col justify-between transition-colors ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl border ${metric.bg}`}>
                      <Icon className={`w-4 h-4 ${metric.color}`} />
                    </div>
                  </div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{metric.title}</h4>
                  <p className={`text-lg font-extrabold font-outfit mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{metric.measure}</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{metric.trend}</p>
                </div>
                <p className={`text-[11px] leading-normal pt-2 border-t ${
                  isDark ? 'text-slate-400 border-slate-800/80' : 'text-slate-500 border-slate-200'
                }`}>
                  {metric.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Institutional Skill Alignment</span>
          <p className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>74.2%</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">↑ +6.8% from last semester</span>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Placement Readiness</span>
          <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">84.0%</p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Top 10% in State Universities</span>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>NCrF Credit Fulfillment</span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">18,200 Credits</p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400">Vocational + Academic</span>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Industry Partners</span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">42 Companies</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Active hiring pipelines</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Capability Mismatch */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border space-y-4 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>Industry Demand vs Department Capability</h3>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Aggregate Mismatch Index</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortSkillData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="department" stroke={isDark ? '#94a3b8' : '#64748b'} tick={{ fontSize: 10 }} />
                <YAxis stroke={isDark ? '#475569' : '#94a3b8'} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#ffffff' : '#0f172a' }} />
                <Bar dataKey="Demand" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Capability" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Trend Line */}
        <div className={`lg:col-span-6 p-5 rounded-2xl border space-y-4 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>Semester Cohort Readiness Progression</h3>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>5-Month Trajectory</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#64748b'} />
                <YAxis stroke={isDark ? '#475569' : '#94a3b8'} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0', color: isDark ? '#ffffff' : '#0f172a' }} />
                <Area type="monotone" dataKey="Readiness" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="Placed" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

