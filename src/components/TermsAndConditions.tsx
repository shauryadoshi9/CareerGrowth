import React from 'react';
import { ThemeMode, Language } from '../types';
import { FileText, ArrowLeft } from 'lucide-react';

interface TermsAndConditionsProps {
  theme: ThemeMode;
  language?: Language;
  onNavigateTab: (tab: string) => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ theme, onNavigateTab }) => {
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
          <FileText className="w-5 h-5 text-indigo-500" />
          <h1 className={`text-2xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Terms and Conditions
          </h1>
        </div>
      </div>

      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Last updated: 20 October 2026
      </p>

      <div className={`space-y-6 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using the Tatva (CareerGrowth) platform, you agree to be bound by these Terms
            and Conditions. If you do not agree with any part of these terms, you must not use the platform.
            These terms apply to all users, including students, teachers, and institution administrators.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            2. Platform Description
          </h2>
          <p>
            Tatva (CareerGrowth) is an AI-powered education, skill development, and career growth platform.
            It provides skill-gap analysis, adaptive learning modules, career navigation tools, opportunity
            matching, AI tutoring, mock interview preparation, mentorship connections, and vocational training
            resources. The platform is developed by Team Tatva at Dharmsinh Desai University, Gujarat, India,
            as part of the Hack for Social Cause 2026 initiative.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            3. User Accounts
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>You must provide accurate and complete information during registration.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
            <li>One person may only maintain one account. Duplicate accounts may be suspended.</li>
            <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            4. Acceptable Use
          </h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Use the platform for any unlawful purpose or in violation of any applicable laws.</li>
            <li>Submit false, misleading, or fraudulent information in your profile or applications.</li>
            <li>Attempt to access another user's account, data, or private information.</li>
            <li>Interfere with or disrupt the platform's infrastructure, servers, or networks.</li>
            <li>Scrape, crawl, or use automated tools to extract data from the platform without permission.</li>
            <li>Upload malicious code, viruses, or any harmful content.</li>
            <li>Misrepresent your skills, qualifications, or identity on the platform.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            5. AI-Powered Features
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>AI-generated content (study explanations, lesson plans, skill assessments) is provided as educational assistance and should not be treated as professional advice.</li>
            <li>AI recommendations for career paths, opportunities, and skill development are based on available data and may not reflect every individual's circumstances.</li>
            <li>We strive for accuracy but do not guarantee that AI-generated responses are free from errors.</li>
            <li>You retain responsibility for verifying information before making career or educational decisions based on AI recommendations.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            6. External Opportunities and Links
          </h2>
          <p>
            The platform aggregates and displays opportunities (hackathons, internships, scholarships, jobs)
            from external sources including Devfolio, Unstop, PM Internship Scheme portals, and others. We
            provide these links for convenience only. We do not endorse, control, or take responsibility for
            the content, policies, or practices of these external platforms. Applications submitted through
            external portals are governed by their respective terms.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            7. Intellectual Property
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>The platform's design, code, logos, and original content are the intellectual property of Team Tatva.</li>
            <li>Educational content sourced from SWAYAM, NPTEL, DIKSHA, and NCERT is attributed to their respective owners.</li>
            <li>Content you create on the platform (project portfolios, skill profiles) remains your intellectual property.</li>
            <li>By submitting content, you grant us a non-exclusive license to display it within the platform for its intended purpose.</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            8. Limitation of Liability
          </h2>
          <p>
            The platform is provided "as is" without warranties of any kind, express or implied. Team Tatva
            shall not be liable for any indirect, incidental, special, or consequential damages arising from
            your use of the platform. This includes, but is not limited to, loss of data, career outcomes,
            or reliance on AI-generated recommendations. Our total liability shall not exceed the amount you
            have paid to use the platform, if any.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            9. Modifications to Terms
          </h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Changes will be posted
            on this page with an updated revision date. Continued use of the platform after modifications
            constitutes acceptance of the updated terms. We will make reasonable efforts to notify active
            users of significant changes.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            10. Governing Law
          </h2>
          <p>
            These Terms and Conditions are governed by and construed in accordance with the laws of India.
            Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction
            of the courts in Gujarat, India.
          </p>
        </section>

        <section>
          <h2 className={`text-lg font-bold font-outfit mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            11. Contact
          </h2>
          <p>
            For questions about these Terms and Conditions, contact Team Tatva at
            Dharmsinh Desai University, Nadiad, Gujarat, India.
          </p>
        </section>
      </div>
    </div>
  );
};
