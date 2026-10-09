import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  Code2, 
  Send, 
  RefreshCw,
  FolderGit2
} from 'lucide-react';
import { Language, ThemeMode } from '../types';
import { askAiTutor } from '../services/api';

interface AIStudyBuddyProps {
  language: Language;
  theme?: ThemeMode;
  onNavigateTab?: (tab: string) => void;
}

interface PracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const PRESET_TOPICS = [
  { id: 'rag', name: 'Retrieval-Augmented Generation (RAG) & Vector Databases', category: 'AI & Data' },
  { id: 'relu', name: 'Deep Neural Networks & Non-Linear Activation (ReLU)', category: 'Deep Learning' },
  { id: 'solar', name: 'Grid-Tied Solar Inverters & MPPT Algorithms', category: 'Clean Tech' },
  { id: 'bms', name: 'Electric Vehicle Battery Management Systems (BMS)', category: 'Smart Mobility' },
  { id: 'dsa', name: 'Binary Trees & Time Complexity in Python', category: 'Core Tech' }
];

export const AIStudyBuddy: React.FC<AIStudyBuddyProps> = ({ language, theme = 'dark', onNavigateTab }) => {
  const isDark = theme === 'dark';
  
  const [selectedTopic, setSelectedTopic] = useState<string>(PRESET_TOPICS[0].name);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [explanation, setExplanation] = useState<string>(
    `In simple terms, think of **RAG (Retrieval-Augmented Generation)** like an open-book exam for AI! 
    
Instead of expecting the AI model to remember everything from memory (which can cause "hallucinations"), RAG first searches a private library (a Vector Database) for the exact relevant paragraphs, and then feeds those facts directly to the AI to answer your question accurately.`
  );
  const [analogy, setAnalogy] = useState<string>(
    'Real-Life Example: Imagine asking a doctor a very rare medical query. Instead of guessing from memory, the doctor pulls the exact 2026 research journal from the shelf, reads the page, and explains the cure to you. That is RAG in action!'
  );
  const [recommendedProject, setRecommendedProject] = useState<{ title: string; desc: string }>({
    title: 'Build a Personal Document Q&A Bot with FastAPI & pgvector',
    desc: 'Step 1: Chunk a PDF file into paragraphs. Step 2: Generate vector embeddings. Step 3: Run cosine similarity search.'
  });
  const [practiceQuestion, setPracticeQuestion] = useState<PracticeQuestion>({
    question: 'Why does RAG use Cosine Similarity between vector embeddings instead of simple text matching?',
    options: [
      'It compares semantic meaning rather than exact keyword words',
      'It takes less computer RAM than plain text',
      'It only works with numbers between 1 and 10',
      'It disables AI hallucinations completely without a database'
    ],
    correctIndex: 0,
    explanation: 'Correct! Vector embeddings represent conceptual meaning in high-dimensional space. Cosine similarity calculates the directional angle between concepts, allowing the system to match "physician" with "doctor" even without exact keywords.'
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Voice Learning via Web Speech API
  const handleToggleVoice = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${explanation}. ${analogy}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#]/g, ''));
    
    // Set appropriate accent if available
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'gu') utterance.lang = 'gu-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleExplainTopic = async (topicName: string, queryText?: string) => {
    if (isSpeaking) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setLoading(true);

    try {
      const prompt = queryText || `Explain the topic "${topicName}" in simple, intuitive terms with a clear real-life analogy, an interactive practice question with 4 options, and a micro-project suggestion.`;
      const res = await askAiTutor(prompt, topicName, language);

      if (res.success && res.answer) {
        setExplanation(res.answer);
        setAnalogy(`Analogy: How ${topicName} operates in real-world professional industry deployments.`);
        setRecommendedProject({
          title: `Hands-on Portfolio Project: Practical ${topicName} Implementation`,
          desc: `Build a modular evidence artifact demonstrating ${topicName} principles for your recruiter portfolio.`
        });
        setPracticeQuestion({
          question: `Which fundamental principle is central to understanding ${topicName}?`,
          options: [
            'Systematic input transformation and output verification',
            'Bypassing all mathematical validations',
            'Storing plain text without database schemas',
            'Static memorization of formulas'
          ],
          correctIndex: 0,
          explanation: `In ${topicName}, verified diagnostic principles and systematic workflows are essential for reliable industry deployment.`
        });
      }
    } catch (e) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        isDark ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/60 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200 shadow-lg'
      }`}>
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              AI Study Buddy
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Voice-Enabled Multilingual Learning
            </span>
          </div>

          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Master Complex Concepts in Simple Language
          </h2>

          <p className={`text-xs md:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Struggling with a difficult subject? Your AI Study Buddy translates heavy technical jargon into intuitive real-life examples, generates practice tests to diagnose mistakes, and speaks explanations aloud in your preferred language.
          </p>
        </div>

        {/* Audio Listen Button */}
        <button
          onClick={handleToggleVoice}
          className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-lg shrink-0 ${
            isSpeaking 
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30 animate-pulse'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span>Stop Audio Lesson</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span>Listen to Explanation Aloud</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Weak Topics Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Select Topic or Focus on Diagnostic Weak Areas:
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_TOPICS.map(t => (
            <button
              key={t.id}
              onClick={() => { setSelectedTopic(t.name); handleExplainTopic(t.name); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTopic === t.name
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark 
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Conceptual Breakdown & Real-Life Analogy */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Explanation Card */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Concept Simplifier (No Complex Jargon)</span>
              </div>
              {loading && <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />}
            </div>

            <div className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {explanation}
            </div>

            {/* Analogy Box */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}>
              <Lightbulb className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
              <div className="text-xs leading-relaxed font-medium">
                {analogy}
              </div>
            </div>
          </div>

          {/* Recommended Micro-Project Card (Report Highlighting) */}
          <div className={`p-6 rounded-3xl border space-y-3 ${
            isDark ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/30' : 'bg-gradient-to-r from-emerald-50 to-white border-emerald-200 shadow-md'
          }`}>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <FolderGit2 className="w-4 h-4" />
              <span>Recommended Hands-On Project for Your Portfolio</span>
            </div>
            <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {recommendedProject.title}
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {recommendedProject.desc}
            </p>
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-emerald-500 font-semibold">Builds recruiter-verified evidence</span>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('vocational')}
                  className="text-indigo-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Go to Project Sandbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Diagnostic Practice Question */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-3xl border space-y-5 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Diagnostic Quick Check</span>
            </div>

            <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {practiceQuestion.question}
            </p>

            {/* Options */}
            <div className="space-y-2.5">
              {practiceQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === practiceQuestion.correctIndex;

                let optionStyle = isDark 
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-indigo-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-indigo-400';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-500/20 border-red-500 text-red-400';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs transition-all ${optionStyle}`}
                  >
                    <span className="font-mono mr-2 font-bold">{String.fromCharCode(65 + idx)}.</span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit / Check Answer Button */}
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedAnswer === null}
                onClick={() => setIsAnswerSubmitted(true)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Check My Answer
              </button>
            ) : (
              <div className={`p-4 rounded-2xl border text-xs space-y-1.5 animate-fade-in ${
                selectedAnswer === practiceQuestion.correctIndex 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {selectedAnswer === practiceQuestion.correctIndex 
                      ? 'Spot on! Great understanding.' 
                      : 'Not quite right — here is why:'}
                  </span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {practiceQuestion.explanation}
                </p>
              </div>
            )}

            {/* Custom Question Form */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">
                Ask Study Buddy Any Specific Doubt:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={e => setCustomQuery(e.target.value)}
                  placeholder="e.g. How does backpropagation adjust weights?"
                  className={`flex-1 px-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  disabled={!customQuery.trim() || loading}
                  onClick={() => { handleExplainTopic('Custom Inquiry', customQuery); setCustomQuery(''); }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
