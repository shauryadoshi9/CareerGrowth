import React, { useState } from 'react';
import { defaultSkills as initialSkills, careerPathways } from '../data/mockData';
import { calculateSkillGap } from '../services/aiEngine';
import { Target, Sliders, CheckCircle2, AlertTriangle, HelpCircle, Layers, Sparkles, RefreshCcw } from 'lucide-react';
import { Skill, Language } from '../types';

interface SkillGapAnalyzerProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ language, onNavigateTab }) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careerPathways[0].id);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const selectedCareer = careerPathways.find(c => c.id === selectedCareerId) || careerPathways[0];
  const gapAnalysis = calculateSkillGap(skills, selectedCareer);

  const handleSkillChange = (skillId: string, newValue: number) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, currentProficiency: newValue } : s));
  };

  const handleResetSkills = () => {
    setSkills(initialSkills);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
            Deterministic & Explainable Gap Model
          </span>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Skill Gap Analyzer</h2>
          <p className="text-sm text-slate-300">
            Compare current evidence-backed profile against industry job taxonomies and calculate exact readiness.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <div className="text-right">
            <p className="text-xs text-slate-400">Target Role Readiness</p>
            <p className="text-2xl font-black text-indigo-400 font-outfit">{gapAnalysis.readinessScore}%</p>
          </div>
          <button
            onClick={handleResetSkills}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            title="Reset Sliders to Default"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Role Selector & Formula Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Career Selection */}
        <div className="md:col-span-7 glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Select Target Career Pathway:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careerPathways.map(career => (
              <button
                key={career.id}
                onClick={() => setSelectedCareerId(career.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  selectedCareerId === career.id
                    ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white truncate">{career.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    career.demandIndex === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {career.demandIndex} Demand
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{career.description}</p>
                <p className="text-[10px] text-indigo-400 font-medium mt-2">{career.avgSalary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Explainable Gap Formula Card */}
        <div className="md:col-span-5 glass-card p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span>Transparent Scoring Logic</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike black-box recommendation models, SkillBridge uses transparent, weighted skill scoring:
            </p>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 space-y-1">
              <p>• Gap Score = Required - Current</p>
              <p>• Readiness % = ∑(min(Current, Req) / Req × Weight) × 100</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
            Aligned Skills: <span className="text-emerald-400 font-bold">{gapAnalysis.matchedSkillsCount}</span> | Critical Missing: <span className="text-amber-400 font-bold">{gapAnalysis.criticalMissingSkills.length}</span>
          </div>
        </div>

      </div>

      {/* Interactive Skill Sliders & Taxonomy Breakdown */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Interactive Skill Taxonomy Sliders</span>
            </h3>
            <p className="text-xs text-slate-400">Drag sliders to simulate skill upgrades and see readiness impact</p>
          </div>
          <span className="text-xs text-slate-400">Showing skills for {selectedCareer.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedCareer.requiredSkills.map(req => {
            const skill = skills.find(s => s.id === req.skillId || s.name.toLowerCase() === req.skillName.toLowerCase()) || {
              id: req.skillId,
              name: req.skillName,
              category: 'core_tech',
              currentProficiency: 50,
              requiredProficiency: req.minScore,
              evidenceCount: 1
            };

            const gap = req.minScore - skill.currentProficiency;
            const isAligned = gap <= 0;

            return (
              <div key={req.skillId} className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white">{skill.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      Required Benchmark: <span className="text-indigo-400 font-medium">{req.minScore}%</span> | Weight: {req.weight * 100}%
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    isAligned
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {isAligned ? 'Aligned' : `Gap: -${gap}%`}
                  </span>
                </div>

                {/* Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Current Level:</span>
                    <span className="text-indigo-300 font-bold">{skill.currentProficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.currentProficiency}
                    onChange={(e) => handleSkillChange(skill.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Verified Evidence: {skill.evidenceCount} projects/certs</span>
                  {!isAligned && (
                    <button
                      onClick={() => onNavigateTab('learning')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold underline"
                    >
                      Start Remediation
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
