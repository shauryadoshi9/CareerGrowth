import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Zap, 
  Cpu, 
  Wrench, 
  CheckSquare, 
  ShieldAlert, 
  Award, 
  ChevronRight, 
  FolderGit2, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Save, 
  Sparkles, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { Language, ProjectPortfolioItem, ThemeMode } from '../types';
import { mockRecommendedProjects } from '../data/mockData';
import { fetchPortfolioProjectsApi, savePortfolioProjectApi } from '../services/api';

interface VocationalHubProps {
  language: Language;
  onNavigateTab: (tab: string, role?: any) => void;
  theme?: ThemeMode;
}

export const VocationalHub: React.FC<VocationalHubProps> = ({ language, onNavigateTab, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState<ProjectPortfolioItem[]>(mockRecommendedProjects);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [recordingProjectId, setRecordingProjectId] = useState<string | null>(null);
  const [repoUrlInput, setRepoUrlInput] = useState<string>('');
  const [demoUrlInput, setDemoUrlInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadProjects = async () => {
      const serverProjects = await fetchPortfolioProjectsApi();
      if (mounted && serverProjects && serverProjects.length > 0) {
        setProjects(prev => {
          const map = new Map(prev.map(p => [p.id, p]));
          serverProjects.forEach(sp => map.set(sp.id, sp));
          return Array.from(map.values());
        });
      }
    };
    loadProjects();
    return () => { mounted = false; };
  }, []);

  const handleToggleStep = async (projectId: string, stepId: string) => {
    const updated = projects.map(p => {
      if (p.id === projectId) {
        const updatedSteps = p.steps.map(s => s.id === stepId ? { ...s, completed: !s.completed } : s);
        const allCompleted = updatedSteps.every(s => s.completed);
        return {
          ...p,
          steps: updatedSteps,
          isVerifiedEvidence: allCompleted || p.isVerifiedEvidence
        };
      }
      return p;
    });

    setProjects(updated);
    const target = updated.find(p => p.id === projectId);
    if (target) {
      await savePortfolioProjectApi(target);
    }
  };

  const handleSavePortfolioRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordingProjectId) return;

    const target = projects.find(p => p.id === recordingProjectId);
    if (!target) return;

    const updatedProject: ProjectPortfolioItem = {
      ...target,
      repoUrl: repoUrlInput || target.repoUrl,
      demoUrl: demoUrlInput || target.demoUrl,
      notes: notesInput || target.notes,
      isVerifiedEvidence: true,
      completedAt: new Date().toISOString().split('T')[0]
    };

    const res = await savePortfolioProjectApi(updatedProject);
    if (res.success && res.projects) {
      setProjects(res.projects);
      setStatusMsg(`✅ "${target.title}" successfully added to verified recruiter portfolio!`);
    } else {
      setProjects(prev => prev.map(p => p.id === recordingProjectId ? updatedProject : p));
      setStatusMsg(`✅ Project updated locally in portfolio.`);
    }

    setRecordingProjectId(null);
    setRepoUrlInput('');
    setDemoUrlInput('');
    setNotesInput('');
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const filteredProjects = projects.filter(p => {
    if (selectedLevel === 'all') return true;
    return p.level.toLowerCase() === selectedLevel.toLowerCase();
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-emerald-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-semibold">
              Practical Projects & Evidence Portfolio Hub
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/30 text-xs font-semibold">
              NCrF Level 4.5 Aligned
            </span>
          </div>
          <h2 className={`text-2xl md:text-3xl font-extrabold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Real-World Project Recommendations & Portfolio Builder
          </h2>
          <p className={`text-sm max-w-2xl mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Bridge academic theory into verifiable industry competence. Each project is divided into discrete actionable steps that feed directly into your skill readiness score and connect to genuine hackathons and scholarships.
          </p>
        </div>

        <div className={`p-4 rounded-2xl border text-right shrink-0 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verified Portfolio Artifacts</p>
          <p className="text-xl font-bold text-emerald-500 font-outfit">
            {projects.filter(p => p.isVerifiedEvidence).length} / {projects.length} Completed
          </p>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Level Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Experience Level:</span>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedLevel.toLowerCase() === lvl.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark 
                    ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
              }`}
            >
              {lvl === 'all' ? 'All Levels' : lvl}
            </button>
          ))}
        </div>

        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Completed projects directly boost your verified skill gap score
        </span>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map(proj => {
          const completedStepCount = proj.steps.filter(s => s.completed).length;
          const completionPct = Math.round((completedStepCount / proj.steps.length) * 100);

          return (
            <div
              key={proj.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                proj.isVerifiedEvidence
                  ? isDark 
                    ? 'bg-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-500/5' 
                    : 'bg-emerald-50/30 border-emerald-300 shadow-sm'
                  : isDark 
                    ? 'bg-slate-900/80 border-slate-800' 
                    : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Header Pills */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {proj.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      proj.level === 'Beginner' ? 'bg-emerald-500/15 text-emerald-500' :
                      proj.level === 'Intermediate' ? 'bg-amber-500/15 text-amber-500' :
                      'bg-purple-500/15 text-purple-500'
                    }`}>
                      {proj.level}
                    </span>
                  </div>

                  {proj.isVerifiedEvidence ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified in Portfolio</span>
                    </span>
                  ) : (
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {completionPct}% Complete
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className={`text-lg font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>{proj.title}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{proj.description}</p>
                </div>

                {/* Target Skills Reinforced */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className={`text-[10px] uppercase font-semibold mr-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Reinforces:</span>
                  {proj.targetSkills.map((sk, idx) => (
                    <span key={idx} className={`px-2 py-0.5 rounded-md text-[10px] border font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'
                    }`}>
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Step-by-Step Breakdown Checklist */}
                <div className={`space-y-2 pt-2 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Discrete Actionable Steps ({completedStepCount}/{proj.steps.length}):</span>
                  </h4>

                  <div className="space-y-1.5">
                    {proj.steps.map(step => (
                      <div
                        key={step.id}
                        onClick={() => handleToggleStep(proj.id, step.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2.5 transition ${
                          step.completed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                            : isDark 
                              ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300' 
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={step.completed}
                          readOnly
                          className="mt-0.5 accent-indigo-600 rounded"
                        />
                        <div className="min-w-0">
                          <p className={`font-semibold ${step.completed ? 'line-through text-slate-400' : isDark ? 'text-white' : 'text-slate-900'}`}>
                            {step.title}
                          </p>
                          <p className={`text-[11px] leading-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Repository / Evidence Artifact Links if Submitted */}
                {proj.repoUrl && (
                  <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="truncate pr-2">
                      <span className={`text-[10px] block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>GitHub Repository Artifact:</span>
                      <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline truncate block">
                        {proj.repoUrl}
                      </a>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-semibold shrink-0">
                      Evidence Validated
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons: Connect to Opportunities & Record Work */}
              <div className={`pt-3 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setRecordingProjectId(proj.id);
                      setRepoUrlInput(proj.repoUrl || '');
                      setDemoUrlInput(proj.demoUrl || '');
                      setNotesInput(proj.notes || '');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>{proj.isVerifiedEvidence ? 'Update Portfolio Record' : 'Record Completed Work'}</span>
                  </button>

                  <button
                    onClick={() => onNavigateTab('opportunities')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30' 
                        : 'bg-slate-100 hover:bg-slate-200 text-indigo-700 border border-indigo-200'
                    }`}
                    title="Connect to Matched Hackathons & Internships"
                  >
                    <span>Matched Contests</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Record Completed Work Modal */}
      {recordingProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className={`max-w-md w-full rounded-3xl p-6 shadow-2xl space-y-4 border ${
            isDark ? 'bg-slate-900 border-indigo-500/40 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-lg font-bold font-outfit">
              Record Project in Recruiter Portfolio
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Provide verifiable evidence links to substantiate your practical credit and boost target role readiness.
            </p>

            <form onSubmit={handleSavePortfolioRecord} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">GitHub / Code Repository URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={repoUrlInput}
                  onChange={e => setRepoUrlInput(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Live Demo / Dashboard URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={demoUrlInput}
                  onChange={e => setDemoUrlInput(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Implementation Notes & Benchmarks</label>
                <textarea
                  rows={3}
                  placeholder="Key metrics, models used, testing results..."
                  value={notesInput}
                  onChange={e => setNotesInput(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRecordingProjectId(null)}
                  className={`px-4 py-2 rounded-xl border ${
                    isDark ? 'border-slate-700 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save to Verified DB</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

