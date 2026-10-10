import React from 'react';
import { 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Layers, 
  HeartHandshake, 
  Clock,
  Send,
  Plus
} from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { t } from '../services/i18n';
import { mockAtRiskStudents } from '../data/mockData';

interface TeacherDashboardProps {
  onNavigateTab: (tab: string) => void;
  language: Language;
  theme?: ThemeMode;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigateTab,
  language,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';

  const atRiskCount = mockAtRiskStudents.length;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header Welcome Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark 
          ? 'bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-purple-500/30' 
          : 'bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-purple-200 shadow-md'
      }`}>
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold">
              ● Faculty & Educator Operating Console ({language.toUpperCase()})
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-semibold">
              📊 Sample cohort data
            </span>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Dharmsinh Desai University (DDU) • Engineering & Polytechnic
            </span>
          </div>

          <h1 className={`text-2xl md:text-3xl font-extrabold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Welcome back, Prof. Rajesh Verma
          </h1>
          <p className={`text-xs md:text-sm max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Manage your cohort's learning progression, generate lesson packs in 10 Indian languages with AI Copilot, and proactively provide remedial support before exams.
          </p>
        </div>

        {/* Quick Summary Pill */}
        <div className={`p-4 rounded-2xl border text-right shrink-0 ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-purple-100 shadow-sm'
        }`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Weekly Prep Time Saved</p>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 font-outfit">~4.5 Hours / Wk</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Automated by AI Copilot</span>
        </div>
      </div>

      {/* 4 Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active Enrolled Cohort</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>142 Learners</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">Across 3 class divisions</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Concept Mastery</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>78.4%</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400">+5.2% after remedial practice</p>
        </div>

        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Learning Support Alerts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black font-outfit text-amber-600 dark:text-amber-400`}>
            {atRiskCount} Learners
          </p>
          <button 
            onClick={() => onNavigateTab('learning-risk')}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Review early interventions →
          </button>
        </div>

        <div className={`p-5 rounded-2xl border space-y-1 transition-colors ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Packs Published</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>38 Packs</p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400">Available in 10 languages</p>
        </div>

      </div>

      {/* Core Teacher Feature Launchpads */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Feature 1: AI Teacher Copilot */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all hover:border-purple-500/50 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Multilingual AI Generator
                </span>
                <span className="text-[10px] text-slate-400">10 Indian Languages</span>
              </div>
              <h2 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                AI Teacher Copilot
              </h2>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Generate comprehensive 60-minute lesson plans, 10-question diagnostic quizzes with answer keys, and targeted remedial worksheets adapted to any grade or polytechnic curriculum.
              </p>
            </div>

            <ul className={`text-xs space-y-1.5 pt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Instant 60-Minute Lesson Plans with Pedagogical Structure</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Diagnostic Quiz Generation with Answer Rationales</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>1-Click Publishing directly to Student Workspaces</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('teacher-copilot')}
            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>Launch AI Teacher Copilot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feature 2: Learning Support & Remedial Intervention Engine */}
        <div className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 transition-all hover:border-indigo-500/50 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Early Hurdle Support
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold">88.5% Recovery Rate</span>
              </div>
              <h2 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Learning Support & Remedial Engine
              </h2>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Supportive early warning identification of emerging learning difficulties before major exams. Empowers educators to pair learners with 1:1 industry mentors and assign targeted practice tasks without permanent negative labels.
              </p>
            </div>

            <ul className={`text-xs space-y-1.5 pt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Non-Stigmatizing Growth Framework for Learners</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Pair Learners with 1:1 Industry Mentors in 1 Click</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Automated Practice Task Dispatch & Score Recovery Tracking</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigateTab('learning-risk')}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>Open Learning Support Console ({atRiskCount} Active)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Cohort Diagnostic Mastery Heatmap */}
      <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-800/80">
          <div>
            <h3 className={`text-base font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Classroom Topic Mastery Diagnostic Heatmap
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time diagnostic mastery percentages across enrolled cohorts.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 self-start sm:self-auto">
            ● Active Semester Cohort
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {[
            { topic: 'Deep Neural Networks & ReLU', mastery: 64, status: 'Needs Remedial', color: 'text-amber-500', bar: 'bg-amber-500' },
            { topic: 'EV Battery Management (BMS)', mastery: 82, status: 'On Track', color: 'text-emerald-500', bar: 'bg-emerald-500' },
            { topic: 'Solar Inverters & MPPT Grid', mastery: 78, status: 'Good Progress', color: 'text-indigo-500', bar: 'bg-indigo-500' },
            { topic: 'Binary Trees & DSA Python', mastery: 89, status: 'Mastered', color: 'text-purple-500', bar: 'bg-purple-500' }
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.topic}</span>
                <span className={`text-xs font-bold ${item.color}`}>{item.mastery}%</span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div className={`h-full rounded-full ${item.bar}`} style={{ width: `${item.mastery}%` }} />
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className={item.color}>{item.status}</span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>34 Responses</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
