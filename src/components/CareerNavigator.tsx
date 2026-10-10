import React, { useState, useEffect } from 'react';
import { careerPathways, defaultSkills } from '../data/mockData';
import { generateAdaptiveRoadmap } from '../services/aiEngine';
import { fetchSkillsFromServer } from '../services/api';
import { Compass, Calendar, CheckCircle2, Lock, Clock, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { Language, ThemeMode, Skill } from '../types';

interface CareerNavigatorProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  theme?: ThemeMode;
}

export const CareerNavigator: React.FC<CareerNavigatorProps> = ({ language, onNavigateTab, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careerPathways[0].id);
  const [skills, setSkills] = useState<Skill[]>(defaultSkills);
  const [isUsingSample, setIsUsingSample] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchSkillsFromServer().then((srvSkills) => {
      if (mounted && srvSkills && srvSkills.length > 0) {
        setSkills(srvSkills);
        setIsUsingSample(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const selectedCareer = careerPathways.find(c => c.id === selectedCareerId) || careerPathways[0];
  const roadmapSteps = generateAdaptiveRoadmap(skills, selectedCareer);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 text-xs font-semibold">
              Structured Skill-to-Career Roadmap
            </span>
            {isUsingSample && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[11px] font-semibold">
                📊 Sample data
              </span>
            )}
          </div>
          <h2 className={`text-2xl font-bold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Career Navigator</h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Explore industry career pathways and follow an evidence-backed milestone sequence to reach job readiness.
          </p>
        </div>
        <div className={`px-4 py-3 rounded-xl border text-right ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Roadmap Duration</p>
          <p className="text-lg font-bold text-indigo-500 font-outfit">3 Months (105 Hours)</p>
        </div>
      </div>

      {/* Career Selection Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {careerPathways.map(career => (
          <button
            key={career.id}
            onClick={() => setSelectedCareerId(career.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCareerId === career.id
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                : isDark 
                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white' 
                  : 'bg-white text-slate-700 border-slate-200 hover:text-slate-900 shadow-sm'
            }`}
          >
            {career.title}
          </button>
        ))}
      </div>

      {/* Selected Career Overview */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">{selectedCareer.category}</span>
            <h3 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedCareer.title}</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{selectedCareer.description}</p>
          </div>
          <div className={`p-3 rounded-xl border text-right ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Industry Compensation Benchmark</span>
            <p className="text-base font-bold text-emerald-500">{selectedCareer.avgSalary}</p>
          </div>
        </div>
      </div>

      {/* 3-Month Adaptive Roadmap Timeline */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Calendar className="w-5 h-5 text-indigo-500" />
          <span>Personalized Milestone Roadmap Timeline</span>
        </h3>

        <div className="space-y-6">
          {roadmapSteps.map((step, idx) => (
            <div key={step.id} className="relative pl-6 border-l-2 border-indigo-500/30 space-y-3">
              
              {/* Timeline Indicator Dot */}
              <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${
                step.status === 'completed'
                  ? 'bg-emerald-500 border-emerald-400'
                  : step.status === 'in_progress'
                  ? 'bg-indigo-500 border-indigo-400 animate-pulse'
                  : isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`} />

              <div className={`p-5 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      Month {step.month}
                    </span>
                    <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</h4>
                  </div>
                  <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {step.estimatedHours} Hours
                    </span>
                    <span className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                      step.status === 'in_progress' ? 'bg-amber-500/20 text-amber-500' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {step.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                    </span>
                  </div>
                </div>

                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{step.description}</p>

                {/* Covered Skills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className={`text-[11px] font-medium mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Skills Targeted:</span>
                  {step.skillsCovered.map((sk, sIdx) => (
                    <span key={sIdx} className={`text-[10px] px-2 py-0.5 rounded border font-mono ${
                      isDark ? 'bg-slate-900 text-indigo-300 border-slate-800' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Topics List */}
                <div className={`p-3 rounded-xl border space-y-2 pt-2 ${
                  isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Modules & Checkpoints:</p>
                  <div className="space-y-1.5">
                    {step.topics.map((t) => (
                      <div key={t.id} className={`flex items-center justify-between text-xs p-1.5 rounded transition-all ${
                        isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'
                      }`}>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${t.completed ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span className={t.completed ? 'text-slate-400 line-through' : isDark ? 'text-slate-200 font-medium' : 'text-slate-800 font-medium'}>
                            {t.title}
                          </span>
                        </div>
                        <button
                          onClick={() => onNavigateTab('learning')}
                          className="text-indigo-500 hover:text-indigo-600 text-[11px] font-semibold"
                        >
                          Launch Module
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

