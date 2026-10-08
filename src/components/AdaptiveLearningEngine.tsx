import React, { useState } from 'react';
import { sampleQuizQuestions } from '../data/mockData';
import { translateText } from '../services/aiEngine';
import { BookOpen, Code, HelpCircle, Sparkles, Volume2, CheckCircle2, XCircle, ArrowRight, MessageSquare, Play, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';

interface AdaptiveLearningEngineProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const AdaptiveLearningEngine: React.FC<AdaptiveLearningEngineProps> = ({ language, onNavigateTab }) => {
  const [activeSubTab, setActiveSubTab] = useState<'concept' | 'code' | 'quiz'>('concept');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string>('');
  const [aiTutorResponse, setAiTutorResponse] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  const question = sampleQuizQuestions[currentQuestionIdx];

  const getQuestionText = () => {
    if (language === 'hi' && question.question_hi) return question.question_hi;
    if (language === 'gu' && question.question_gu) return question.question_gu;
    return question.question;
  };

  const getOptions = () => {
    if (language === 'hi' && question.options_hi) return question.options_hi;
    if (language === 'gu' && question.options_gu) return question.options_gu;
    return question.options;
  };

  const getExplanation = () => {
    if (language === 'hi' && question.explanation_hi) return question.explanation_hi;
    if (language === 'gu' && question.explanation_gu) return question.explanation_gu;
    return question.explanation;
  };

  const handleSubmitQuiz = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === question.correctAnswer) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentQuestionIdx((prev) => (prev + 1) % sampleQuizQuestions.length);
  };

  const handleAskAiTutor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTutorPrompt.trim()) return;
    setIsAiGenerating(true);

    setTimeout(() => {
      const resp = `[AI TUTOR - ${language.toUpperCase()} RESPONSE]
Regarding "${aiTutorPrompt}":
In ${question.topic}, the key rule is to ground neural activation or vector queries using structured embeddings. For low-bandwidth or regional settings, we simplify the mathematical tensor operations into 3 visual layers.`;
      setAiTutorResponse(resp);
      setIsAiGenerating(false);
    }, 1000);
  };

  const toggleAudioTTS = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            Adaptive Difficulty: Intermediate → Advanced
          </span>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Adaptive Learning Engine</h2>
          <p className="text-sm text-slate-300">
            Topic: <span className="text-indigo-400 font-semibold">{question.topic}</span>
          </p>
        </div>

        {/* Audio TTS Button */}
        <button
          onClick={toggleAudioTTS}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isAudioPlaying
              ? 'bg-pink-500/20 text-pink-300 border-pink-500/40 animate-pulse'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
          }`}
        >
          <Volume2 className="w-4 h-4 text-pink-400" />
          <span>{isAudioPlaying ? 'Playing Audio Explanation...' : 'Listen Audio Explanation'}</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveSubTab('concept')}
          className={`flex-1 py-2 rounded-lg transition-all ${activeSubTab === 'concept' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          1. Concept & Theory
        </button>
        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex-1 py-2 rounded-lg transition-all ${activeSubTab === 'code' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          2. Code & Diagram
        </button>
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex-1 py-2 rounded-lg transition-all ${activeSubTab === 'quiz' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          3. Diagnostic Quiz
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Topic Viewer */}
        <div className="lg:col-span-8 glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
          
          {activeSubTab === 'concept' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white font-outfit">
                  {question.topic}
                </h3>
                <span className="text-xs px-2.5 py-1 rounded bg-slate-900 text-indigo-300 font-mono">
                  Lang: {language.toUpperCase()}
                </span>
              </div>

              <div className="prose prose-invert max-w-none text-sm text-slate-300 space-y-3 leading-relaxed">
                <p>
                  In modern machine learning and vector search systems, activation functions and embedding similarity metrics govern how neural representations are processed.
                </p>
                <div className="bg-slate-900/90 p-4 rounded-xl border border-indigo-500/20 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Key Takeaways:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-200">
                    <li>Rectified Linear Unit (ReLU) prevents vanishing gradient saturation.</li>
                    <li>Cosine Similarity measures embedding angle regardless of magnitude.</li>
                    <li>pgvector enables fast IVFFlat index querying inside PostgreSQL.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveSubTab('code')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  <span>Proceed to Practical Code Sandbox</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-400" />
                  <span>Python & pgvector Query Sandbox</span>
                </h3>
                <span className="text-xs text-emerald-400 font-mono">● Output Verified</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto space-y-2">
                <p className="text-slate-500"># pgvector cosine similarity search formulation</p>
                <p><span className="text-purple-400">import</span> psycopg2</p>
                <p><span className="text-purple-400">from</span> sentence_transformers <span className="text-purple-400">import</span> SentenceTransformer</p>
                <br />
                <p><span className="text-indigo-400">model</span> = SentenceTransformer(<span className="text-emerald-300">'all-MiniLM-L6-v2'</span>)</p>
                <p><span className="text-indigo-400">query_vector</span> = model.encode(<span className="text-emerald-300">"Explain activation functions in Gujarati"</span>)</p>
                <br />
                <p><span className="text-slate-500"># Execute vector similarity lookup</span></p>
                <p>cursor.execute(<span className="text-emerald-300">"SELECT content, 1 - (embedding &lt;=&gt; %s) AS similarity FROM learning_resources ORDER BY embedding &lt;=&gt; %s LIMIT 3"</span>, (query_vector, query_vector))</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveSubTab('quiz')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  <span>Proceed to Diagnostic Quiz</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'quiz' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
                  Diagnostic Quiz {currentQuestionIdx + 1} of {sampleQuizQuestions.length}
                </span>
                <span className="text-xs text-slate-400">Difficulty: {question.difficulty.toUpperCase()}</span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">
                {getQuestionText()}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {getOptions().map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === question.correctAnswer;
                  
                  let optionStyle = 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200';
                  if (isAnswerSubmitted) {
                    if (isCorrect) optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                    else if (isSelected) optionStyle = 'bg-red-500/20 border-red-500 text-red-300 font-semibold';
                  } else if (isSelected) {
                    optionStyle = 'bg-indigo-600/30 border-indigo-500 text-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation card after submit */}
              {isAnswerSubmitted && (
                <div className="bg-slate-900/90 p-4 rounded-xl border border-indigo-500/30 space-y-2 text-xs">
                  <p className="font-bold text-indigo-400">Explainable Answer Reason:</p>
                  <p className="text-slate-300">{getExplanation()}</p>
                </div>
              )}

              {/* Quiz Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitQuiz}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all ${
                      selectedOption === null ? 'opacity-40 cursor-not-allowed bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md'
                    }`}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
                  >
                    <span>Next Quiz Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Multilingual AI Tutor Drawer */}
        <div className="lg:col-span-4 glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-outfit flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>AI Multilingual Tutor</span>
              </h3>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                {language.toUpperCase()} Engine
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Ask AI for simplified explanations in English, Hindi, or Gujarati.
            </p>

            {aiTutorResponse && (
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 space-y-1">
                <p className="text-[10px] text-indigo-400 font-semibold">Tutor Output:</p>
                <p className="leading-relaxed">{aiTutorResponse}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleAskAiTutor} className="space-y-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              placeholder={`Ask AI tutor in ${language.toUpperCase()}...`}
              value={aiTutorPrompt}
              onChange={(e) => setAiTutorPrompt(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-100 px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={isAiGenerating}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAiGenerating ? 'AI Responding...' : 'Ask AI Tutor'}</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
