import React, { useState, useEffect } from 'react';
import { defaultSkills as initialSkills, careerPathways } from '../data/mockData';
import { calculateSkillGap } from '../services/aiEngine';
import { fetchSkillsFromServer } from '../services/api';
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
import { Skill, Language, ThemeMode } from '../types';

interface SkillGapAnalyzerProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  theme?: ThemeMode;
}

export const SkillGapAnalyzer: React.FC<SkillGapAnalyzerProps> = ({ language, onNavigateTab, theme = 'dark' }) => {
  const [selectedCareerId, setSelectedCareerId] = useState<string>(careerPathways[0].id);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [activeEvidenceModalSkill, setActiveEvidenceModalSkill] = useState<Skill | null>(null);
  const [isUsingSample, setIsUsingSample] = useState<boolean>(true);

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

  const isDark = theme === 'dark';
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
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
              Deterministic & Explainable Gap Model
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              Multi-Factor Evidence Synthesizer
            </span>
            {isUsingSample && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[11px] font-semibold">
                📊 Sample data
              </span>
            )}
          </div>
          <h2 className={`text-2xl font-bold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Skill Gap Analyzer</h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Compare current evidence-backed profile against industry job taxonomies and calculate exact readiness using quiz scores, verified certificates, and completed projects.
          </p>
        </div>

        <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="text-right">
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Target Role Readiness</p>
            <p className="text-2xl font-black text-indigo-500 font-outfit">{gapAnalysis.readinessScore}%</p>
          </div>
          <button
            onClick={handleResetSkills}
            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'}`}
            title="Reset Sliders to Default"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Holistic Multi-Factor Evidence Notice */}
      <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
        isDark ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
      }`}>
        <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <span className={`font-bold block mb-0.5 ${isDark ? 'text-white' : 'text-indigo-950'}`}>Holistic Multi-Factor Skill Verification</span>
          Instead of relying solely on exam scores, CareerGrowth synthesizes <strong>Diagnostic Quiz Results</strong>, <strong>Accredited Certifications</strong> (NPTEL/AICTE), and <strong>Real-World Portfolio Projects</strong> with public GitHub code artifacts.
        </div>
      </div>

      {/* Target Role Selector & Formula Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Career Selection */}
        <div className={`md:col-span-7 p-5 rounded-2xl border space-y-3 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <label className={`text-xs font-semibold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Select Target Career Pathway:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careerPathways.map(career => (
              <button
                key={career.id}
                onClick={() => setSelectedCareerId(career.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  selectedCareerId === career.id
                    ? isDark 
                      ? 'bg-indigo-600/20 border-indigo-500/60 shadow-lg shadow-indigo-600/20' 
                      : 'bg-indigo-50 border-indigo-500 shadow-sm ring-1 ring-indigo-500/30'
                    : isDark 
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700' 
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{career.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    career.demandIndex === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-600'
                  }`}>
                    {career.demandIndex} Demand
                  </span>
                </div>
                <p className={`text-[11px] line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{career.description}</p>
                <p className="text-[10px] text-indigo-500 font-medium mt-2">{career.avgSalary}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Explainable Gap Formula Card */}
        <div className={`md:col-span-5 p-5 rounded-2xl border space-y-3 flex flex-col justify-between ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-2">
            <h3 className={`text-sm font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>Transparent Scoring Logic</span>
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Unlike opaque recommendation black boxes, CareerGrowth uses transparent, weighted skill scoring:
            </p>
            <div className={`p-3 rounded-xl border font-mono text-[11px] space-y-1 ${
              isDark ? 'bg-slate-900/90 border-slate-800 text-indigo-300' : 'bg-slate-50 border-slate-200 text-indigo-800'
            }`}>
              <p>• Gap Score = Required - Current</p>
              <p>• Multi-Factor = (Quiz × 35%) + (Certs × 25%) + (Projects × 40%)</p>
              <p>• Readiness % = ∑(min(Current, Req) / Req × Weight) × 100</p>
            </div>
          </div>

          <div className={`pt-3 border-t text-xs ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            Aligned Skills: <span className="text-emerald-500 font-bold">{gapAnalysis.matchedSkillsCount}</span> | Critical Missing: <span className="text-amber-500 font-bold">{gapAnalysis.criticalMissingSkills.length}</span>
          </div>
        </div>

      </div>

      {/* Interactive Skill Sliders & Multi-Factor Taxonomy Breakdown */}
      <div className={`p-6 rounded-2xl border space-y-6 ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-lg font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Sliders className="w-5 h-5 text-indigo-500" />
              <span>Interactive Skill Taxonomy & Multi-Factor Evidence</span>
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Review verifiable evidence artifacts (quizzes, certificates, projects) for each benchmark</p>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Target Role: {selectedCareer.title}</span>
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
              <div key={req.skillId} className={`p-5 rounded-2xl border space-y-3.5 ${
                isDark ? 'bg-slate-900/90 border-slate-800/80' : 'bg-slate-50 border-slate-200 shadow-sm'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{skill.name}</h4>
                    <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Required Benchmark: <span className="text-indigo-500 font-medium">{req.minScore}%</span> | Weight: {req.weight * 100}%
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                    isAligned
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                  }`}>
                    {isAligned ? 'Aligned' : `Gap: -${gap}%`}
                  </span>
                </div>

                {/* Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Current Verified Proficiency:</span>
                    <span className="text-indigo-500 font-bold">{skill.currentProficiency}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.currentProficiency}
                    onChange={(e) => handleSkillChange(skill.id, parseInt(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-600 ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}
                  />
                </div>

                {/* Multi-Factor Evidence Tags */}
                <div className={`p-3 rounded-xl border text-[11px] space-y-2 ${
                  isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <div className={`flex items-center justify-between font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    <span>Evidence Breakdown:</span>
                    <button
                      onClick={() => setActiveEvidenceModalSkill(skill)}
                      className="text-indigo-500 hover:text-indigo-600 flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Link Project Evidence</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {/* Quiz score badge */}
                    {skill.quizScore !== undefined ? (
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-500 border border-blue-500/30 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>Quiz: {skill.quizScore}%</span>
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded border ${isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        Quiz: Untested
                      </span>
                    )}

                    {/* Certifications badge */}
                    {skill.certifications && skill.certifications.length > 0 ? (
                      skill.certifications.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 border border-purple-500/30 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>{c}</span>
                        </span>
                      ))
                    ) : (
                      <span className={`px-2 py-0.5 rounded border ${isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        No Cert Attached
                      </span>
                    )}

                    {/* Completed Projects badge */}
                    {skill.completedProjects && skill.completedProjects.length > 0 ? (
                      skill.completedProjects.map((p, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                          <FolderGit2 className="w-3 h-3" />
                          <span>{p}</span>
                        </span>
                      ))
                    ) : (
                      <span className={`px-2 py-0.5 rounded border ${isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        No Project Linked
                      </span>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-between text-[11px] pt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <span>Total Verified Evidence Count: {skill.evidenceCount || 1}</span>
                  {!isAligned && (
                    <button
                      onClick={() => onNavigateTab('learning')}
                      className="text-indigo-500 hover:text-indigo-600 font-semibold underline"
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

      {/* Modal to Link Project Evidence */}
      {activeEvidenceModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4 border ${
            isDark ? 'bg-slate-900 border-indigo-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold font-outfit">
              Link Project Evidence to "{activeEvidenceModalSkill.name}"
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
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
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    isDark 
                      ? 'bg-slate-950 hover:bg-indigo-950/50 border-slate-800 hover:border-indigo-500 text-white' 
                      : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-400 text-slate-900'
                  }`}
                >
                  <span className="font-semibold">{projTitle}</span>
                  <Plus className="w-4 h-4 text-indigo-500" />
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveEvidenceModalSkill(null)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold ${
                  isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
                }`}
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

