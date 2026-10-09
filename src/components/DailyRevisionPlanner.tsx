import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Flame, 
  Target, 
  TrendingUp, 
  ArrowRight,
  BookMarked,
  Layers,
  Award,
  Compass
} from 'lucide-react';
import { ThemeMode, Language } from '../types';

interface DailyRevisionPlannerProps {
  language: Language;
  theme?: ThemeMode;
  onNavigateTab: (tab: string) => void;
}

interface RevisionTask {
  id: string;
  topic: string;
  timeEstimate: string;
  type: 'concept' | 'practical' | 'quiz';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export const DailyRevisionPlanner: React.FC<DailyRevisionPlannerProps> = ({ 
  language, 
  theme = 'dark', 
  onNavigateTab 
}) => {
  const isDark = theme === 'dark';

  const [availableTime, setAvailableTime] = useState<number>(45); // minutes
  const [examDaysRemaining, setExamDaysRemaining] = useState<number>(14);
  const [streakDays, setStreakDays] = useState<number>(5);

  const [tasks, setTasks] = useState<RevisionTask[]>([
    {
      id: 'task-1',
      topic: 'Vector Cosine Similarity & Embeddings (Weak Topic: 54% Diagnostic)',
      timeEstimate: '15 mins',
      type: 'concept',
      completed: true,
      priority: 'high'
    },
    {
      id: 'task-2',
      topic: 'Hands-on Coding: Implement Simple RAG Retrieval in Python',
      timeEstimate: '20 mins',
      type: 'practical',
      completed: false,
      priority: 'high'
    },
    {
      id: 'task-3',
      topic: '5-Question Rapid Diagnostic Check (Prompt Engineering)',
      timeEstimate: '10 mins',
      type: 'quiz',
      completed: false,
      priority: 'medium'
    }
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState && tasks.filter(x => x.completed).length === tasks.length - 1) {
          setStreakDays(s => s + 1);
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  // 5-Stage Growth Journey Milestones (Report Highlighting)
  const journeyMilestones = [
    {
      stage: 1,
      title: 'Skill Gap Diagnosis',
      desc: 'Real-time benchmarking against target industry standards.',
      tab: 'skill-gap',
      status: 'completed',
    },
    {
      stage: 2,
      title: 'Adaptive Learning Roadmap',
      desc: 'Multilingual structured units targeting high-priority gaps.',
      tab: 'learning',
      status: 'completed',
    },
    {
      stage: 3,
      title: 'AI Study Buddy Sessions',
      desc: 'Simple analogies, practice questions & voice learning.',
      tab: 'study-buddy',
      status: 'in_progress',
    },
    {
      stage: 4,
      title: 'Practical Project Portfolio',
      desc: 'Completed micro-projects & verified evidence artifacts.',
      tab: 'vocational',
      status: 'next',
    },
    {
      stage: 5,
      title: 'Career & Internship Launch',
      desc: 'Direct match with PM Scheme, Unstop & Devfolio portals.',
      tab: 'opportunities',
      status: 'locked',
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className={`p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-indigo-200 shadow-lg'
      }`}>
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Daily Revision Engine
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              {streakDays} Day Study Streak
            </span>
          </div>

          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Personalized Daily Revision & Growth Journey
          </h2>

          <p className={`text-xs md:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Smart scheduling that balances weak diagnostic areas, learning targets, upcoming examinations, and your available time into manageable bite-sized micro-goals.
          </p>
        </div>

        {/* Schedule Controls */}
        <div className={`p-4 rounded-2xl border text-xs space-y-3 shrink-0 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              Available Daily Time:
            </label>
            <div className="flex gap-1.5">
              {[30, 45, 60, 90].map(m => (
                <button
                  key={m}
                  onClick={() => setAvailableTime(m)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition ${
                    availableTime === m 
                      ? 'bg-indigo-600 text-white' 
                      : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800/60">
            <span className="text-slate-400 font-medium">Exam in:</span>
            <span className="font-bold text-indigo-400">{examDaysRemaining} Days</span>
          </div>
        </div>
      </div>

      {/* Revision Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Today's Manageable Revision Tasks */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Today's Recommended Micro-Schedule ({availableTime} Mins Total)
            </h3>
            <span className="text-xs font-bold text-indigo-400">
              {progressPercent}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800/40 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Task List */}
          <div className="space-y-3 pt-1">
            {tasks.map(t => (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  t.completed 
                    ? isDark ? 'bg-emerald-950/20 border-emerald-500/30 opacity-80' : 'bg-emerald-50 border-emerald-200 opacity-90'
                    : isDark ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                }`}
              >
                <button className="mt-0.5 text-indigo-400 shrink-0">
                  {t.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${
                      t.completed ? 'line-through text-slate-400' : isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {t.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {t.timeEstimate}
                    </span>
                    <span className="uppercase font-semibold text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400">
                      {t.type}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  t.priority === 'high' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {t.priority.toUpperCase()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">Paced to keep cognitive load low without burnout.</span>
            <button
              onClick={() => onNavigateTab('study-buddy')}
              className="text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Practice with Study Buddy</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: My Growth Journey Progress Flow (Report Highlighting) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              My Growth Journey
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> End-to-End Progress
            </span>
          </div>

          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every learning action connects discovery, practical evidence, and industry placement in one structured journey.
            </p>

            <div className="space-y-3 pt-1">
              {journeyMilestones.map((m, idx) => (
                <div
                  key={m.stage}
                  onClick={() => onNavigateTab(m.tab)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between text-xs group ${
                    m.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : m.status === 'in_progress'
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 font-bold'
                        : isDark ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      m.status === 'completed'
                        ? 'bg-emerald-500 text-white'
                        : m.status === 'in_progress'
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {m.stage}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{m.title}</p>
                      <p className="text-[10px] text-slate-500 truncate">{m.desc}</p>
                    </div>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition shrink-0" />
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onNavigateTab('opportunities')}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                View Connected Opportunities
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
