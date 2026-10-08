import React, { useState } from 'react';
import { UserRole, Language } from './types';
import { Navbar } from './components/Navbar';
import { DemoTourModal } from './components/DemoTourModal';
import { StudentDashboard } from './components/StudentDashboard';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { CareerNavigator } from './components/CareerNavigator';
import { AdaptiveLearningEngine } from './components/AdaptiveLearningEngine';
import { OfflinePackManager } from './components/OfflinePackManager';
import { VocationalHub } from './components/VocationalHub';
import { TeacherCopilot } from './components/TeacherCopilot';
import { RiskInterventionEngine } from './components/RiskInterventionEngine';
import { OpportunityMatcher } from './components/OpportunityMatcher';
import { InstitutionAnalytics } from './components/InstitutionAnalytics';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'student') setActiveTab('dashboard');
    else if (newRole === 'teacher') setActiveTab('teacher-copilot');
    else if (newRole === 'admin') setActiveTab('institution-analytics');
  };

  const handleNavigateTab = (tab: string, role?: UserRole) => {
    if (role && role !== currentRole) {
      setCurrentRole(role);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageChange={setLanguage}
        isLowBandwidth={isLowBandwidth}
        onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
        onStartDemoTour={() => setIsDemoTourOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {currentRole === 'student' && (
          <>
            {activeTab === 'dashboard' && <StudentDashboard onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'skill-gap' && <SkillGapAnalyzer onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'career-navigator' && <CareerNavigator onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'learning' && <AdaptiveLearningEngine onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'vocational' && <VocationalHub onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'opportunities' && <OpportunityMatcher onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'offline-packs' && (
              <OfflinePackManager
                isLowBandwidth={isLowBandwidth}
                onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
                language={language}
              />
            )}
          </>
        )}

        {currentRole === 'teacher' && (
          <>
            {activeTab === 'teacher-copilot' && <TeacherCopilot language={language} />}
            {activeTab === 'learning-risk' && <RiskInterventionEngine language={language} />}
          </>
        )}

        {currentRole === 'admin' && (
          <>
            {activeTab === 'institution-analytics' && <InstitutionAnalytics language={language} />}
          </>
        )}
      </main>

      {/* SIH 2026 Interactive Demo Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={handleNavigateTab}
      />

      {/* Footer Bar */}
      <footer className="glass-panel border-t border-slate-900 px-4 py-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">SkillBridge OS</span>
            <span>•</span>
            <span>SIH26044 Problem Statement</span>
            <span>•</span>
            <span className="text-indigo-400">Team Disruptors VI</span>
          </div>
          <p>© 2026 SkillBridge Platform. From Learning to Livelihood.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
