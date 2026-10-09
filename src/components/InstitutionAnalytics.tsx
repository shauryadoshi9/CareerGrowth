import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';
import { ShieldCheck, TrendingUp, Building2, Award, PieChart, Users, ArrowUpRight } from 'lucide-react';
import { Language } from '../types';

interface InstitutionAnalyticsProps {
  language: Language;
}

export const InstitutionAnalytics: React.FC<InstitutionAnalyticsProps> = ({ language }) => {
  const cohortSkillData = [
    { department: 'Computer Science', Demand: 92, Capability: 74 },
    { department: 'Electrical & Solar', Demand: 85, Capability: 62 },
    { department: 'EV Mobility Tech', Demand: 88, Capability: 58 },
    { department: 'Agricultural Tech', Demand: 78, Capability: 65 },
    { department: 'Mechanical & Drone', Demand: 75, Capability: 70 },
  ];

  const trendData = [
    { month: 'Jan', Readiness: 54, Placed: 32 },
    { month: 'Feb', Readiness: 62, Placed: 45 },
    { month: 'Mar', Readiness: 68, Placed: 58 },
    { month: 'Apr', Readiness: 76, Placed: 72 },
    { month: 'May', Readiness: 84, Placed: 82 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 text-xs font-semibold">
            Government & Institution Macro Intelligence Dashboard
          </span>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Institutional Skill Demand & Placement Analytics</h2>
          <p className="text-sm text-slate-300">
            Aggregate insights connecting university curriculum, industry demand trends, and NEP 2020 / NCrF credit benchmarks.
          </p>
        </div>

        <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 text-right">
          <p className="text-xs text-slate-400">Total Enrolled Cohort</p>
          <p className="text-xl font-bold text-pink-400 font-outfit">12,450 Learners</p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-slate-400">Institutional Skill Alignment</span>
          <p className="text-2xl font-extrabold text-white">74.2%</p>
          <span className="text-[11px] text-emerald-400">↑ +6.8% from last semester</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-slate-400">Average Placement Readiness</span>
          <p className="text-2xl font-extrabold text-indigo-400">84.0%</p>
          <span className="text-[11px] text-indigo-400">Top 10% in State Universities</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-slate-400">NCrF Credit Fulfillment</span>
          <p className="text-2xl font-extrabold text-purple-400">18,200 Credits</p>
          <span className="text-[11px] text-purple-400">Vocational + Academic</span>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs font-medium text-slate-400">Verified Industry Partners</span>
          <p className="text-2xl font-extrabold text-emerald-400">42 Companies</p>
          <span className="text-[11px] text-emerald-400">Active hiring pipelines</span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department Capability Mismatch */}
        <div className="lg:col-span-6 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-outfit">Industry Demand vs Department Capability</h3>
            <span className="text-xs text-slate-400">Aggregate Mismatch Index</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cohortSkillData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="department" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis stroke="#475569" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                <Bar dataKey="Demand" fill="#ec4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Capability" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Trend Line */}
        <div className="lg:col-span-6 glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-outfit">Semester Cohort Readiness Progression</h3>
            <span className="text-xs text-slate-400">5-Month Trajectory</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#475569" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
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
