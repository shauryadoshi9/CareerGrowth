import React, { useState } from 'react';
import { defaultSkills as initialSkills, careerPathways } from '../data/mockData';
import { calculateSkillGap } from '../services/aiEngine';
import { 
  Target, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  RefreshCcw,
  Award,
  FolderGit2,
  BookOpen,
  ExternalLink,
  Plus
} from 'lucide-react';
import { Skill, Language } from '../types';

interface SkillGapAnalyzerProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ language, onNavigateTab }) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careerPathways[0].id);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [activeEvidenceModalSkill, setActiveEvidenceModalSkill] = useState<Skill | null>(null);

  const selectedCareer = careerPathways.find(c => c.id === selectedCareerId) || careerPathways[0];
  const gapAnalysis = calculateSkillGap(skills, selectedCareer);

  const handleSkillChange = (skillId: string, newValue: number) => {
    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, currentProficiency: newValue } : s));
  };

  const handleResetSkills = () => {
    setSkills(initialSkills);
  };

  const handleAttachProjectToSkill = (skillId: string, projectTitle: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id === skillId) {
        const currentProjects = s.completedProjects || [];
        if (!currentProjects.includes(projectTitle)) {
          return {
            ...s,
            completedProjects: [...currentProjects, projectTitle],
            currentProficiency: Math.min(100, s.currentProficiency + 10),
            evidenceCount: (s.evidenceCount || 1) + 1
          };
        }
      }
      return s;
    }));
    setActiveEvidenceModalSkill(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
              Deterministic & Explainable Gap Model
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              Multi-Factor Evidence Synthesizer
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Skill Gap Analyzer</h2>
          <p className="text-sm text-slate-300">
            Compare current evidence-backed profile against industry job taxonomies and calculate exact readiness using quiz scores, verified certificates, and completed projects.
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

      {/* Holistic Multi-Factor Evidence Notice (Report Highlight #1) */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs leading-relaxed text-indigo-200">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Holistic Multi-Factor Skill Verification (Report Highlight #1)</span>
          Instead of relying solely on exam scores, SkillBridge synthesizes <strong>Diagnostic Quiz Results</strong>, <strong>Accredited Certifications</strong> (NPTEL/AICTE), and <strong>Real-World Portfolio Projects</strong> with public GitHub code artifacts.
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
              Unlike opaque recommendation black boxes, SkillBridge uses transparent, weighted skill scoring:
            </p>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-indigo-300 space-y-1">
              <p>• Gap Score = Required - Current</p>
              <p>• Multi-Factor = (Quiz × 35%) + (Certs × 25%) + (Projects × 40%)</p>
              <p>• Readiness % = ∑(min(Current, Req) / Req × Weight) × 100</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-xs text-slate-400">
            Aligned Skills: <span className="text-emerald-400 font-bold">{gapAnalysis.matchedSkillsCount}</span> | Critical Missing: <span className="text-amber-400 font-bold">{gapAnalysis.criticalMissingSkills.length}</span>
          </div>
        </div>

      </div>

      {/* Interactive Skill Sliders & Multi-Factor Taxonomy Breakdown */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>Interactive Skill Taxonomy & Multi-Factor Evidence</span>
            </h3>
            <p className="text-xs text-slate-400">Review verifiable evidence artifacts (quizzes, certificates, projects) for each benchmark</p>
          </div>
          <span className="text-xs text-slate-400">Target Role: {selectedCareer.title}</span>
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
              <div key={req.skillId} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800/80 space-y-3.5">
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
                    <span className="text-slate-400">Current Verified Proficiency:</span>
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

                {/* Multi-Factor Evidence Tags (Report Highlight #1) */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-400">
                    <span>Evidence Breakdown:</span>
                    <button
                      onClick={() => setActiveEvidenceModalSkill(skill)}
                      className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Link Project Evidence</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {/* Quiz score badge */}
                    {skill.quizScore !== undefined ? (
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Quiz: {skill.quizScore}%</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Quiz: Untested
                      </span>
                    )}

                    {/* Certifications badge */}
                    {skill.certifications && skill.certifications.length > 0 ? (
                      skill.certifications.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>{c}</span>
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        No Cert Attached
                      </span>
                    )}

                    {/* Completed Projects badge */}
                    {skill.completedProjects && skill.completedProjects.length > 0 ? (
                      skill.completedProjects.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                          <FolderGit2 className="w-3 h-3" />
                          <span>{p}</span>
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        No Project Linked
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Total Verified Evidence Count: {skill.evidenceCount || 1}</span>
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

      {/* Modal to Link Project Evidence (Report Highlight #1) */}
      {activeEvidenceModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-indigo-500/40 p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-lg font-bold font-outfit">
              Link Project Evidence to "{activeEvidenceModalSkill.name}"
            </h3>
            <p className="text-xs text-slate-400">
              Select one of your completed portfolio projects to attach as verified proof. Linking adds +10% verified proficiency!
            </p>

            <div className="space-y-2 text-xs">
              {[
                'Personal Document Q&A Bot with FastAPI & pgvector',
                'Solar Rooftop MPPT Inverter & Grid Sync Simulation',
                'Crop Yield Prediction Random Forest',
                'FastAPI Microservices Authentication Gateway'
              ].map((projTitle, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAttachProjectToSkill(activeEvidenceModalSkill.id, projTitle)}
                  className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-indigo-950/50 border border-slate-800 hover:border-indigo-500 transition flex items-center justify-between"
                >
                  <span className="font-semibold">{projTitle}</span>
                  <Plus className="w-4 h-4 text-indigo-400" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveEvidenceModalSkill(null)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
