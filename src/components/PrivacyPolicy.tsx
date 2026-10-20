import React from 'react';
import { ThemeMode, Language } from '../types';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  theme: ThemeMode;
  language?: Language;
  onNavigateTab: (tab: string) => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ theme, onNavigateTab }) => {
  const isDark = theme === 'dark';

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigateTab('home')}
          className={`p-2 rounded-lg border transition ${
            isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
          }`}
          aria-label="Go back to home"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-500" />
          <h1 className={`text-2xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Privacy Policy
          </h1>
        </div>
      </div>

      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Last updated: 20 October 2026
      </p>

      <div className={`space-y-6 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            1. Who We Are
          </h2>
          <p>
            Tatva (CareerGrowth) is an AI-powered education and career growth platform built by Team Tatva
            (HSC|GJ|00051) at Dharmsinh Desai University, Gujarat. This Privacy Policy explains how we collect,
            use, and protect your personal information when you use our platform.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            2. Information We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Account Information:</strong> Name, email address, and hashed password when you register.</li>
            <li><strong>Profile Data:</strong> Skills, education level, career goals, and learning preferences you provide.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, quiz responses, and learning progress within the platform.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, and screen resolution for responsive design.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To provide personalized skill-gap analysis and adaptive learning recommendations.</li>
            <li>To match you with relevant internships, hackathons, and career opportunities.</li>
            <li>To generate AI-powered study assistance and revision plans tailored to your progress.</li>
            <li>To enable teacher and institution dashboards for aggregate (non-individual) analytics.</li>
            <li>To improve platform performance, fix bugs, and develop new features.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            4. Data Storage and Security
          </h2>
          <p>
            All passwords are hashed using bcrypt with a minimum of 10 salt rounds. Authentication tokens
            are signed with JWT and transmitted over HTTPS. We do not store payment information. Your data
            is stored on secured servers and is never sold to third parties.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            5. Third-Party Services
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Google Gemini AI:</strong> Used for AI tutoring and study assistance. Your queries are processed but not stored by Google beyond the session.</li>
            <li><strong>Google Translate:</strong> Used for multilingual interface support. Subject to Google's privacy policy.</li>
            <li><strong>External Opportunity Portals:</strong> Links to Devfolio, Unstop, and government portals are provided for convenience. We do not control their data practices.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            6. Cookies
          </h2>
          <p>
            We use essential cookies and local storage to maintain your login session, theme preference,
            and language selection. We do not use advertising cookies or third-party tracking cookies.
            You can clear these at any time through your browser settings.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            7. Data Retention
          </h2>
          <p>
            Your account data is retained as long as your account is active. You may request deletion of
            your account and associated data at any time by contacting us. Anonymized, aggregate analytics
            data may be retained for platform improvement purposes.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            8. Your Rights
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Access and download your personal data.</li>
            <li>Correct inaccurate information in your profile.</li>
            <li>Request deletion of your account and data.</li>
            <li>Opt out of non-essential data processing.</li>
            <li>Withdraw consent for AI-powered recommendations at any time.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            9. Children's Privacy
          </h2>
          <p>
            Our platform is designed for students aged 16 and above. We do not knowingly collect personal
            information from children under 16 without verifiable parental consent. If you believe a child
            under 16 has provided us with personal information, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            10. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with
            an updated revision date. Continued use of the platform after changes constitutes acceptance
            of the revised policy.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            11. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy or your data, contact Team Tatva at
            Dharmsinh Desai University, Nadiad, Gujarat, India.
          </p>
        </section>
      </div>
    </div>
  );
};
