import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Sparkles, 
  Award, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  PieChart, 
  BookOpen, 
  FolderGit2, 
  MessageSquare, 
  Zap,
  Briefcase,
  FileCheck,
  Radio,
  RefreshCw,
  Globe
} from 'lucide-react';
import { Language, ThemeMode, LiveStreamEvent, ExternalSourceStatus } from '../types';
import { t } from '../services/i18n';
import { subscribeToLiveStream, triggerManualExternalFetch } from '../services/api';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
  language: Language;
  theme?: ThemeMode;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  language,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [streamEvents, setStreamEvents] = useState<number>(12);
  const [sources, setSources] = useState<ExternalSourceStatus[]>([
    { name: 'Devfolio', status: 'streaming', latency: '18ms' },
    { name: 'Unstop', status: 'streaming', latency: '24ms' },
    { name: 'PM Internship Scheme MCA', status: 'streaming', latency: '32ms' },
    { name: 'AICTE Portal', status: 'streaming', latency: '28ms' },
    { name: 'Hack2Skill', status: 'streaming', latency: '21ms' },
    { name: 'Google Open Source', status: 'streaming', latency: '15ms' }
  ]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToLiveStream((event: LiveStreamEvent) => {
      setStreamEvents(c => c + 1);
      if (event.type === 'system_stats') {
        if (event.sources && event.sources.length > 0) {
          setSources(event.sources);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      const res = await triggerManualExternalFetch();
      if (res.success) {
        setSyncMsg(`⚡ New opportunity harvested: "${res.opportunity?.title}"`);
        setTimeout(() => setSyncMsg(null), 4000);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Welcome Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-pink-950/40 to-slate-900 border-pink-500/30' 
          : 'bg-gradient-to-r from-pink-50 via-white to-purple-50 border-pink-200 shadow-md'
      }`}>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-300 border border-pink-500/30 text-xs font-semibold">
              ● Institutional Governance & Macro Intelligence ({language.toUpperCase()})
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              State Technical University & Polytechnic Board • NEP 2020 & NCrF Audit
            </span>
          </div>

          <h1 className={`text-2xl md:text-3xl font-extrabold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Institution Administrator Console
          </h1>
          <p className={`text-xs md:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Cross-departmental capability diagnostics, empirical pilot measurements, placement readiness trajectories, and NCrF credit compliance monitoring.
          </p>
        </div>

        {/* Quick Cohort Stat */}
        <div className={`p-4 rounded-2xl border text-right shrink-0 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-pink-100 shadow-sm'
        }`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Pilot Cohort</p>
          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 font-outfit">12,450 Learners</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Engineering & Polytechnics</span>
        </div>
      </div>

      {/* 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Institutional Skill Alignment</span>
          <p className={`text-2xl font-extrabold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>74.2%</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">↑ +6.8% from last semester</span>
        </div>

        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Placement Readiness</span>
          <p className="text-2xl font-extrabold font-outfit text-indigo-600 dark:text-indigo-400">84.0%</p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400">Top 10% in State Universities</span>
        </div>

        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>NCrF Credit Fulfillment</span>
          <p className="text-2xl font-extrabold font-outfit text-purple-600 dark:text-purple-400">18,200 Credits</p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400">Vocational + Academic Level 4.5</span>
        </div>

        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Corporate Partners</span>
          <p className="text-2xl font-extrabold font-outfit text-emerald-600 dark:text-emerald-400">42 Companies</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Active hiring pipelines</span>
        </div>

      </div>

      {/* Core Admin Feature Launchpads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Feature 1: Skill Demand & Placement Analytics */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all hover:border-pink-500/50 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                  Macro Intelligence
                </span>
                <span className="text-[10px] text-slate-400">Mismatch Diagnostics</span>
              </div>
              <h2 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Institutional Skill Demand & Placement Analytics
              </h2>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Correlate university curricula with live industry demand indices. Discover which departments are lagging and view 5-month cohort placement trajectory forecasts.
              </p>
            </div>

            <ul className={`text-xs space-y-1.5 pt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Department Capability vs Industry Demand Bar Comparisons</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Semester Readiness Progression & Placed Students Area Trajectory</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                <span>Departmental Mismatch Alerts for Targeted Curriculum Revision</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('institution-analytics')}
            className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>Launch Demand & Placement Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature 2: Empirical Pilot Program Evaluation Framework */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all hover:border-indigo-500/50 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  NEP 2020 & Pilot Evaluation
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold">5 Rigorous Indicators</span>
              </div>
              <h2 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Empirical Pilot Program Evaluation
              </h2>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Monitor the active trial across Anand & Mehsana cohorts: 76.4% personalized learning-plan completion, +24.8% micro-quiz score improvement, and 412 verified public GitHub project repositories.
              </p>
            </div>

            <ul className={`text-xs space-y-1.5 pt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Audited Student Completion & Pre/Post Diagnostic Deltas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>412 Recruiter-Verified GitHub Artifact Portfolios</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>1,840 Applications to PM Scheme, Unstop & Devfolio</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('institution-analytics')}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>Review Empirical Pilot Metrics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Institutional Accreditation & National Credit Framework (NCrF) Audit */}
      <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-800/80">
          <div>
            <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Accreditation & Regulatory Compliance Overview
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Continuous automated alignment with NEP 2020, NCrF Credit Levels, and AICTE vocational guidelines.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-500 border border-purple-500/30 self-start sm:self-auto">
            ● 100% Audit Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>NCrF Level 4.5 & 5.0</h4>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Academic & vocational micro-credits banked seamlessly in the Academic Bank of Credits (ABC).
            </p>
            <span className="text-[10px] text-emerald-500 font-semibold block">18,200 Credits Banked</span>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>NEP 2020 Multilingual Equity</h4>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              All curriculum modules and AI study support available across 10 recognized Indian languages.
            </p>
            <span className="text-[10px] text-indigo-500 font-semibold block">10 Languages Verified</span>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-500" />
              <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Industry Partnership Tie-ups</h4>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Direct recruitment pipelines with 42 verified employers offering internships and entry-level positions.
            </p>
            <span className="text-[10px] text-purple-500 font-semibold block">42 Active MOUs</span>
          </div>
        </div>
      </div>

      {/* Real-Time External Pipeline & Telemetry Control */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                External Pipeline & Runtime Crawler Status
              </span>
            </div>
            <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Real-time Government & Industry Opportunity Connectors
            </h3>
            <p className="text-xs text-slate-400">
              Continuously streaming authenticated hackathons, fellowships, and corporate internships directly to student portals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Force External Crawl'}</span>
            </button>
          </div>
        </div>

        {syncMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{syncMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
          {sources.map((src) => (
            <div
              key={src.name}
              className={`p-3 rounded-2xl border text-xs space-y-1 ${
                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">{src.status}</span>
              </div>
              <p className={`font-bold truncate text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {src.name}
              </p>
              <span className="text-[10px] text-slate-500 block font-mono">Latency: {src.latency}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
