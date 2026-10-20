import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { UserRole, Language, ThemeMode } from './types';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { StudentDashboard } from './components/StudentDashboard';
import { SkillGapAnalyzer } from './components/SkillGapAnalyzer';
import { CareerNavigator } from './components/CareerNavigator';
import { AdaptiveLearningEngine } from './components/AdaptiveLearningEngine';
import { OfflinePackManager } from './components/OfflinePackManager';
import { VocationalHub } from './components/VocationalHub';
import { TeacherCopilot } from './components/TeacherCopilot';
import { RiskInterventionEngine } from './components/RiskInterventionEngine';
import { OpportunityMatcher } from './components/OpportunityMatcher';
import { AIStudyBuddy } from './components/AIStudyBuddy';
import { DailyRevisionPlanner } from './components/DailyRevisionPlanner';
import { MockInterviewEngine } from './components/MockInterviewEngine';
import { MentorHub } from './components/MentorHub';
import { InstitutionAnalytics } from './components/InstitutionAnalytics';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';
import { NotFoundPage } from './components/NotFoundPage';
import { CookieConsent } from './components/CookieConsent';
import { analytics } from './services/analytics';
import { checkServerHealth } from './services/api';
import { applyUniversalTranslation, triggerGoogleTranslate } from './services/i18n';

export function App() {
  const { user } = useContext(AuthContext);
  const currentRole: UserRole = user?.role || 'student';
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careergrowth_language') || localStorage.getItem('skillbridge_language');
      if (saved) return saved as Language;
    }
    return 'en';
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('careergrowth_theme') || localStorage.getItem('skillbridge_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false);
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);

  // Synchronize document theme class for Tailwind CSS
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('careergrowth_theme', theme);
    }
  }, [theme]);

  // Synchronize universal translation across the entire application on tab and language updates
  useEffect(() => {
    // 1. Trigger Google Translate client for full-site coverage
    triggerGoogleTranslate(language);

    // 2. Perform zero-latency local TreeWalker translation without any thread locking or freezing
    const runInstantPass = () => {
      applyUniversalTranslation(document.body, language);
    };

    runInstantPass();
    const t1 = setTimeout(runInstantPass, 60);
    const t2 = setTimeout(runInstantPass, 300);
    const t3 = setTimeout(runInstantPass, 800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [language, activeTab]);

  useEffect(() => {
    analytics.trackPageView(activeTab);
  }, [activeTab]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('careergrowth_language', newLang);
    }
    triggerGoogleTranslate(newLang);
  };

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

  useEffect(() => {
    const handleUnauthorized = () => {
      setActiveTab('login');
    };
    window.addEventListener('careergrowth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('careergrowth:unauthorized', handleUnauthorized);
  }, []);

  const handleRoleChange = (_newRole: UserRole) => {
    if (!user) {
      setActiveTab('login');
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateTab = (tab: string, _role?: UserRole) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const isDark = theme === 'dark';

  const isKnownStudentTab = [
    'dashboard', 'skill-gap', 'career-navigator', 'learning', 'study-buddy',
    'revision-planner', 'mock-interview', 'opportunities', 'mentors', 'vocational', 'offline-packs'
  ].includes(activeTab);

  const isKnownTeacherTab = [
    'dashboard', 'teacher-dashboard', 'teacher-copilot', 'learning-risk'
  ].includes(activeTab);

  const isKnownAdminTab = [
    'dashboard', 'admin-dashboard', 'institution-analytics'
  ].includes(activeTab);

  const isKnownUniversalTab = ['home', 'login', 'register', 'privacy', 'terms'].includes(activeTab);

  const isNotFound = !isKnownUniversalTab && (
    (currentRole === 'student' && !isKnownStudentTab) ||
    (currentRole === 'teacher' && !isKnownTeacherTab) ||
    (currentRole === 'admin' && !isKnownAdminTab)
  );

  return (
    <div className={`${isDark ? 'dark bg-slate-950 text-slate-100' : 'light bg-slate-50 text-slate-900'} min-h-screen flex flex-col font-sans transition-colors duration-300 relative`}>
      

      {/* Top Header Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={toggleTheme}
        isLowBandwidth={isLowBandwidth}
        onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isServerConnected={isServerConnected}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {/* Auth Views */}
        {activeTab === 'login' && (
          <LoginForm
            onSuccess={() => setActiveTab('dashboard')}
            onSwitchToRegister={() => setActiveTab('register')}
            language={language}
            theme={theme}
          />
        )}
        {activeTab === 'register' && (
          <RegisterForm
            onSuccess={() => setActiveTab('dashboard')}
            onSwitchToLogin={() => setActiveTab('login')}
            language={language}
            theme={theme}
          />
        )}
        {/* Legal & Static Views */}
        {activeTab === 'privacy' && (
          <PrivacyPolicy
            theme={theme}
            language={language}
            onNavigateTab={handleNavigateTab}
          />
        )}
        {activeTab === 'terms' && (
          <TermsAndConditions
            theme={theme}
            language={language}
            onNavigateTab={handleNavigateTab}
          />
        )}
        {/* Custom 404 View */}
        {isNotFound && (
          <NotFoundPage
            theme={theme}
            onNavigateTab={handleNavigateTab}
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
          />
        )}

        {/* Student Views */}
        {currentRole === 'student' && !isKnownUniversalTab && !isNotFound && (
          <>
            {activeTab === 'dashboard' && <StudentDashboard onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'skill-gap' && <SkillGapAnalyzer onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'career-navigator' && <CareerNavigator onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'learning' && <AdaptiveLearningEngine onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'study-buddy' && <AIStudyBuddy onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'revision-planner' && <DailyRevisionPlanner onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'mock-interview' && <MockInterviewEngine onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'opportunities' && <OpportunityMatcher onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'mentors' && <MentorHub language={language} theme={theme} onNavigateTab={handleNavigateTab} />}
            {activeTab === 'vocational' && <VocationalHub onNavigateTab={handleNavigateTab} language={language} theme={theme} />}
            {activeTab === 'offline-packs' && (
              <OfflinePackManager
                isLowBandwidth={isLowBandwidth}
                onToggleLowBandwidth={() => setIsLowBandwidth(!isLowBandwidth)}
                language={language}
                theme={theme}
              />
            )}
          </>
        )}

        {/* Educator / Teacher Views */}
        {currentRole === 'teacher' && !isKnownUniversalTab && !isNotFound && (
          <>
            {(activeTab === 'dashboard' || activeTab === 'teacher-dashboard') && (
              <TeacherDashboard onNavigateTab={handleNavigateTab} language={language} theme={theme} />
            )}
            {activeTab === 'teacher-copilot' && <TeacherCopilot language={language} theme={theme} />}
            {activeTab === 'learning-risk' && <RiskInterventionEngine language={language} theme={theme} />}
          </>
        )}

        {/* Institution Admin Views */}
        {currentRole === 'admin' && !isKnownUniversalTab && !isNotFound && (
          <>
            {(activeTab === 'dashboard' || activeTab === 'admin-dashboard') && (
              <AdminDashboard onNavigateTab={handleNavigateTab} language={language} theme={theme} />
            )}
            {activeTab === 'institution-analytics' && <InstitutionAnalytics language={language} theme={theme} />}
          </>
        )}
      </main>

      {/* Footer Bar */}
      <footer className={`border-t px-4 py-5 mt-auto transition-colors ${
        isDark ? 'bg-slate-950/80 border-slate-900 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Tatva (CareerGrowth)</span>
            <span>•</span>
            <span>Team Tatva (HSC|GJ|00051) • Dharmsinh Desai University, Gujarat</span>
            <span>•</span>
            <span className="text-emerald-500 font-semibold">From Learning to Livelihood</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => handleNavigateTab('privacy')}
              className={`hover:underline underline-offset-2 transition ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavigateTab('terms')}
              className={`hover:underline underline-offset-2 transition ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Terms & Conditions
            </button>
            <span className="text-slate-600 dark:text-slate-600">|</span>
            <p>© 2026 Team Tatva • Hack for Social Cause 2026</p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent theme={theme} onNavigateTab={handleNavigateTab} />

    </div>
  );
}

export default App;
