import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { UserRole, Language, ThemeMode } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
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
import { checkServerHealth } from './services/api';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState<boolean>(false);
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    const pollHealth = async () => {
      const health = await checkServerHealth();
      if (mounted) setIsServerConnected(!!health);
    };
    pollHealth();
    const interval = setInterval(pollHealth, 6000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'student' && activeTab !== 'home') setActiveTab('dashboard');
    else if (newRole === 'teacher' && activeTab !== 'home') setActiveTab('teacher-copilot');
    else if (newRole === 'admin' && activeTab !== 'home') setActiveTab('institution-analytics');
  };

  const handleNavigateTab = (tab: string, role?: UserRole) => {
    if (role && role !== currentRole) {
      setCurrentRole(role);
    }
    setActiveTab(tab);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'dark bg-slate-950 text-slate-100' : 'light bg-slate-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors duration-300`}>
      
      {/* Top Header Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageChange={setLanguage}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLowBandwidth={isLowBandwidth}
        onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
        onStartDemoTour={() => setIsDemoTourOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isServerConnected={isServerConnected}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Auth Views */}
        {activeTab === 'login' && (
          <LoginForm
            onSuccess={() => setActiveTab('dashboard')}
            onSwitchToRegister={() => setActiveTab('register')}
          />
        )}
        {activeTab === 'register' && (
          <RegisterForm
            onSuccess={() => setActiveTab('dashboard')}
            onSwitchToLogin={() => setActiveTab('login')}
          />
        )}
        {/* Home Landing View */}
        {activeTab === 'home' && (
          <HomePage
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            language={language}
            theme={theme}
            onNavigateTab={handleNavigateTab}
            onStartDemoTour={() => setIsDemoTourOpen(true)}
          />
        )}


        {/* Student Views */}
        {currentRole === 'student' && activeTab !== 'home' && (
          <>
            {activeTab === 'dashboard' && <StudentDashboard onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'skill-gap' && <SkillGapAnalyzer onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'career-navigator' && <CareerNavigator onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'learning' && <AdaptiveLearningEngine onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'vocational' && <VocationalHub onNavigateTab={handleNavigateTab} language={language} />}
            {activeTab === 'opportunities' && <OpportunityMatcher onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'offline-packs' && (
              <OfflinePackManager
                isLowBandwidth={isLowBandwidth}
                onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
                language={language}
              />
            )}
          </>
        )}

        {/* Educator / Teacher Views */}
        {currentRole === 'teacher' && activeTab !== 'home' && (
          <>
            {activeTab === 'teacher-copilot' && <TeacherCopilot language={language} />}
            {activeTab === 'learning-risk' && <RiskInterventionEngine language={language} />}
          </>
        )}

        {/* Institution Admin Views */}
        {currentRole === 'admin' && activeTab !== 'home' && (
          <>
            {activeTab === 'institution-analytics' && <InstitutionAnalytics language={language} />}
          </>
        )}
      </main>

      {/* Interactive Platform Tour Modal */}
      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigateTab={handleNavigateTab}
      />

      {/* Footer Bar */}
      <footer className={`border-t px-4 py-5 mt-auto transition-colors ${
        isDark ? 'bg-slate-950/80 border-slate-900 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>SkillBridge OS</span>
            <span>•</span>
            <span>Integrated Career & Employability Engine</span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">Cloud Sync Active</span>
          </div>
          <p>© 2026 SkillBridge Platform. From Learning to Livelihood.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
