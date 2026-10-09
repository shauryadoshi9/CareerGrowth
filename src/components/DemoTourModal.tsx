import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, Sparkles, Award, ArrowRight } from 'lucide-react';
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

  const demoSteps = [
    {
      title: '1. Student Onboarding & Profile Setup',
      role: 'student' as UserRole,
      tab: 'dashboard',
      description: 'Learner logs in and initializes their profile with academic background, current verified skills, and interest area.',
      badge: 'Step 1 of 12'
    },
    {
      title: '2. Preferred Language & Career Aspirations',
      role: 'student' as UserRole,
      tab: 'dashboard',
      description: 'Learner selects target career (e.g. AI Systems Engineer or Solar Tech Specialist) and prefers Gujarati / Hindi / English language.',
      badge: 'Step 2 of 12'
    },
    {
      title: '3. Baseline Knowledge & Skill Assessment',
      role: 'student' as UserRole,
      tab: 'skill-gap',
      description: 'System evaluates baseline proficiency across technical, practical vocational, and core concepts.',
      badge: 'Step 3 of 12'
    },
    {
      title: '4. Skill Gap Analysis & Missing Skills Identified',
      role: 'student' as UserRole,
      tab: 'skill-gap',
      description: 'Displays exact readiness score, matched skills %, and prioritizes missing skill gaps (Gap = Required - Current).',
      badge: 'Step 4 of 12'
    },
    {
      title: '5. AI Career Navigator Pathways',
      role: 'student' as UserRole,
      tab: 'career-navigator',
      description: 'Allows side-by-side career pathway comparison and projects required industry benchmarks.',
      badge: 'Step 5 of 12'
    },
    {
      title: '6. Personalized 3-Month Adaptive Roadmap',
      role: 'student' as UserRole,
      tab: 'career-navigator',
      description: 'Generates a month-by-month milestone timeline: Concept -> Practical Sandbox -> Quiz -> Remediation.',
      badge: 'Step 6 of 12'
    },
    {
      title: '7. Adaptive Learning & Multilingual AI Explanation',
      role: 'student' as UserRole,
      tab: 'learning',
      description: 'Learner views concept topics and opens AI Tutor for Gujarati, Hindi, or English prompt-engineered explanations.',
      badge: 'Step 7 of 12'
    },
    {
      title: '8. Diagnostic Quiz & Real-Time Mastery Update',
      role: 'student' as UserRole,
      tab: 'learning',
      description: 'Completes a topic assessment quiz; system automatically recalculates skill mastery score and awards badges.',
      badge: 'Step 8 of 12'
    },
    {
      title: '9. Rural Low-Bandwidth Mode & Offline Content Packs',
      role: 'student' as UserRole,
      tab: 'offline-packs',
      description: 'Demonstrates offline downloadable packs for remote learners with local state caching and background sync.',
      badge: 'Step 9 of 12'
    },
    {
      title: '10. Faculty AI Copilot & Lesson Plan Generator',
      role: 'teacher' as UserRole,
      tab: 'teacher-copilot',
      description: 'Switches to Teacher view to generate custom lesson plans, quizzes, and remedial guides in 3 languages.',
      badge: 'Step 10 of 12'
    },
    {
      title: '11. At-Risk Student Monitor & Remedial Intervention',
      role: 'teacher' as UserRole,
      tab: 'learning-risk',
      description: 'System automatically flags students at risk of falling behind and assigns peer mentoring or remedial worksheets.',
      badge: 'Step 11 of 12'
    },
    {
      title: '12. Internship & Job Placement Engine',
      role: 'student' as UserRole,
      tab: 'opportunities',
      description: 'Explainable matching engine evaluates hard eligibility + skill compatibility to match students with industry jobs.',
      badge: 'Step 12 of 12'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel max-w-2xl w-full rounded-2xl border border-indigo-500/30 p-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-semibold">
              {step.badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">Platform Walkthrough</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xl font-bold text-white font-outfit mb-2 flex items-center gap-2">
          <span>{step.title}</span>
        </h3>
        <p className="text-sm text-slate-300 mb-6 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          {step.description}
        </p>

        {/* Progress Dots */}
        <div className="flex items-center justify-between gap-1 mb-6">
          {demoSteps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleGoToStep(idx)}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500 shadow-md shadow-indigo-500/30 scale-y-125'
                  : idx < currentStep
                  ? 'bg-indigo-600/60'
                  : 'bg-slate-800'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-slate-500 bg-slate-900'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={() => {
              onNavigateTab(step.tab, step.role);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
          >
            Jump to View
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === demoSteps.length - 1}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-md ${
              currentStep === demoSteps.length - 1
                ? 'bg-emerald-600 hover:bg-emerald-500'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95'
            }`}
          >
            <span>{currentStep === demoSteps.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
