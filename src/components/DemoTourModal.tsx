import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Award, ArrowRight, Play } from 'lucide-react';
import { UserRole } from '../types';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string, role?: UserRole) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  // Aligned with Report Highlights #12, #13, #14 & Integrated Platform Capabilities
  const demoSteps = [
    {
      title: '1. Student Onboarding & Multi-Factor Evidence',
      role: 'student' as UserRole,
      tab: 'dashboard',
      description: 'Learner logs in and initializes profile. Skills are tracked via a multi-factor combination of quizzes, certificates, and completed portfolio projects.',
      badge: 'Step 1 of 12'
    },
    {
      title: '2. Deterministic Skill Gap Analysis',
      role: 'student' as UserRole,
      tab: 'skill-gap',
      description: 'Benchmarks current skills against industry standard taxonomies (AI, Solar PV, EV Mobility) and calculates exact readiness percentage.',
      badge: 'Step 2 of 12'
    },
    {
      title: '3. Career Pathway Navigation',
      role: 'student' as UserRole,
      tab: 'career-navigator',
      description: 'Compares demand index and salary projections for high-growth sectors with regional localization in Hindi and Gujarati.',
      badge: 'Step 3 of 12'
    },
    {
      title: '4. Adaptive Learning Roadmap',
      role: 'student' as UserRole,
      tab: 'learning',
      description: 'Generates a month-by-month milestone timeline with bite-sized concept units, diagnostic assessments, and remedial loops.',
      badge: 'Step 4 of 12'
    },
    {
      title: '5. AI Study Buddy & Weak Topic Breakdown',
      role: 'student' as UserRole,
      tab: 'study-buddy',
      description: 'NEW DEMO IDEA: AI Study Buddy translates heavy technical topics into plain real-life analogies, breaks down common student mistakes, and supports bilingual voice learning.',
      badge: 'Step 5 of 12 (Highlight #2, #7, #12)'
    },
    {
      title: '6. Recommended Project in Discrete Steps',
      role: 'student' as UserRole,
      tab: 'vocational',
      description: 'NEW IDEA: Breaks practical projects into manageable steps (Step 1-4). Learners check off progress and record completed GitHub repo evidence into their recruiter portfolio.',
      badge: 'Step 6 of 12 (Highlight #6)'
    },
    {
      title: '7. Portfolio Project Connected to Opportunities',
      role: 'student' as UserRole,
      tab: 'opportunities',
      description: 'NEW DEMO IDEA: Shows how a completed portfolio project (e.g. RAG Q&A Bot) directly connects to matched listings on PM Internship Scheme, Devfolio, Unstop, and Hack2Skill.',
      badge: 'Step 7 of 12 (Highlight #13)'
    },
    {
      title: '8. Daily Revision & My Growth Journey',
      role: 'student' as UserRole,
      tab: 'revision-planner',
      description: 'Micro-schedule planner balancing weak diagnostic topics, learning goals, upcoming exams, and available study hours.',
      badge: 'Step 8 of 12 (Highlight #3 & #10)'
    },
    {
      title: '9. Text-Based AI Mock Interview Practice',
      role: 'student' as UserRole,
      tab: 'mock-interview',
      description: 'Interactive technical interview practice across 4 career tracks with instant rubric scoring, concept analysis, and targeted practice activities.',
      badge: 'Step 9 of 12 (Highlight #4)'
    },
    {
      title: '10. 1-on-1 Industry Mentorship Hub',
      role: 'student' as UserRole,
      tab: 'mentors',
      description: 'Book 1:1 sessions with verified industry researchers from Google DeepMind, Microsoft Azure, and Zerodha with instant Google Meet link generation.',
      badge: 'Step 10 of 12'
    },
    {
      title: '11. Supportive Learning Interventions (Faculty)',
      role: 'teacher' as UserRole,
      tab: 'learning-risk',
      description: 'Supportive non-labeling framework that flags emerging learning hurdles and makes it easy to involve a teacher or industry mentor.',
      badge: 'Step 11 of 12 (Highlight #9)'
    },
    {
      title: '12. Pilot Program Empirical Evaluation Framework',
      role: 'admin' as UserRole,
      tab: 'institution-analytics',
      description: 'NEW EVALUATION IDEA: Rigorously tests the pilot with college and rural learners across 5 empirical measures (learning-plan completion, quiz delta, projects, teacher feedback, and opportunity discovery).',
      badge: 'Step 12 of 12 (Highlight #14)'
    }
  ];

  const step = demoSteps[currentStep];

  const handleGoToStep = (index: number) => {
    setCurrentStep(index);
    const target = demoSteps[index];
    onNavigateTab(target.tab, target.role);
  };

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      handleGoToStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      handleGoToStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel max-w-2xl w-full rounded-3xl border border-indigo-500/40 p-6 md:p-8 shadow-2xl relative overflow-hidden bg-slate-900 text-white">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
              {step.badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">Interactive Platform Walkthrough</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-4 my-6">
          <h2 className="text-xl md:text-2xl font-bold font-outfit text-white flex items-center gap-2">
            <span>{step.title}</span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            {step.description}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <span>Viewing Target Tab: <strong className="text-indigo-400 uppercase">{step.tab}</strong></span>
            <span>Audience Context: <strong className="text-emerald-400 uppercase">{step.role}</strong></span>
          </div>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-2">
          {demoSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleGoToStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep 
                  ? 'w-7 bg-indigo-500' 
                  : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Controls Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
          <button
            disabled={currentStep === 0}
            onClick={handlePrev}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-30 transition flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => {
              onNavigateTab(step.tab, step.role);
              onClose();
            }}
            className="text-xs text-indigo-400 hover:underline font-semibold"
          >
            Explore This Screen
          </button>

          {currentStep < demoSteps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1"
            >
              <span>Finish Tour</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
