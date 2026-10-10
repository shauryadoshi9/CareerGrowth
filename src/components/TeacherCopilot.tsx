import React, { useState } from 'react';
import { generateTeacherCopilotContent } from '../services/aiEngine';
import { postCustomData } from '../services/api';
import { SUPPORTED_LANGUAGES, Language, ThemeMode } from '../types';
import { Sparkles, Edit3, CheckCircle2 } from 'lucide-react';

interface TeacherCopilotProps {
  language: Language;
  theme?: ThemeMode;
}

export const TeacherCopilot: React.FC<TeacherCopilotProps> = ({ language, theme }) => {
  const isDark = theme !== 'light';
  const [topic, setTopic] = useState<string>('Neural Networks & Activation Functions');
  const [gradeLevel, setGradeLevel] = useState<string>('B.Tech Sem 6 / Polytechnic Diploma');
  const [contentType, setContentType] = useState<'lesson_plan' | 'quiz_set' | 'remedial_guide'>('lesson_plan');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [generatedText, setGeneratedText] = useState<string>(
    generateTeacherCopilotContent('Neural Networks & Activation Functions', 'B.Tech Sem 6', language, 'lesson_plan')
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setIsPublished(false);

    setTimeout(() => {
      const content = generateTeacherCopilotContent(topic, gradeLevel, selectedLang, contentType);
      setGeneratedText(content);
      setIsGenerating(false);
    }, 800);
  };

  const handlePublishToClass = async () => {
    setIsPublished(true);
    await postCustomData(
      `Teacher Material: ${topic}`,
      contentType,
      { gradeLevel, language: selectedLang, content: generatedText }
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-purple-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold">
            Faculty Empowerment Engine ({selectedLang.toUpperCase()})
          </span>
          <h2 className={`text-2xl font-bold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Teacher Copilot</h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Generate lesson plans, diagnostic quizzes, answer keys, and remedial guides in any of the 10 Indian languages.
          </p>
        </div>

        <div className={`px-4 py-3 rounded-xl border text-right ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Teacher Preparation Time Saved</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400 font-outfit">~4.5 Hours / Week</p>
        </div>
      </div>

      {/* Generator Controls & Live Output Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <h3 className={`text-base font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>AI Content Parameters</span>
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3.5">
            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Subject / Topic Name:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 ${
                  isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
              />
            </div>

            <div>
              <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Target Cohort / Grade Level:</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 ${
                  isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Content Format:</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as any)}
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 ${
                    isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
                >
                  <option value="lesson_plan">Lesson Plan (60m)</option>
                  <option value="quiz_set">Diagnostic Quiz Set</option>
                  <option value="remedial_guide">Remedial Worksheet</option>
                </select>
              </div>

              <div>
                <label className={`text-xs font-semibold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>Language (10 Indian Options):</label>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as Language)}
                  className={`w-full text-xs px-3 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 ${
                    isDark ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
                  }`}
                >
                  {SUPPORTED_LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.flag} {l.nativeName} ({l.name})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'AI Generating Content...' : 'Generate Faculty Pack'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Editable Output Editor */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <h3 className={`text-sm font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>Editable Material Workspace</h3>
              </div>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Teacher Judgment Preserved</span>
            </div>

            <textarea
              value={generatedText}
              onChange={(e) => setGeneratedText(e.target.value)}
              rows={14}
              className={`w-full text-xs font-mono p-4 rounded-xl border focus:outline-none focus:border-purple-500 leading-relaxed resize-none ${
                isDark ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-slate-50 text-slate-900 border-slate-300'
              }`}
            />
          </div>

          <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {isPublished ? '● Published to Classroom' : 'Draft Ready'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePublishToClass}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isPublished
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isPublished ? 'Published & Saved to Server' : 'Publish to Server'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

