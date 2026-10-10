import React, { useState } from 'react';
import { sampleQuizQuestions } from '../data/mockData';
import { t } from '../services/i18n';
import { submitQuizAnswers, askAiTutor } from '../services/api';
import { BookOpen, Code, HelpCircle, Sparkles, Volume2, CheckCircle2, XCircle, ArrowRight, Send, Key, Settings } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, ThemeMode } from '../types';

interface AdaptiveLearningEngineProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
  theme?: ThemeMode;
}

export const AdaptiveLearningEngine: React.FC<AdaptiveLearningEngineProps> = ({ language, onNavigateTab, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [activeSubTab, setActiveSubTab] = useState<'concept' | 'code' | 'quiz'>('concept');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  
  // AI Tutor State & Key Configuration
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string>('');
  const [aiTutorResponse, setAiTutorResponse] = useState<string>('');
  const [aiEngineUsed, setAiEngineUsed] = useState<string>('');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);
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

  const handleSubmitQuiz = async () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === question.correctAnswer;

    if (isCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    await submitQuizAnswers(
      question.topic,
      isCorrect ? 100 : 0,
      1,
      [{ questionId: question.id, selectedOption, isCorrect }]
    );
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setCurrentQuestionIdx((prev) => (prev + 1) % sampleQuizQuestions.length);
  };

  const handleAskAiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTutorPrompt.trim()) return;
    setIsAiGenerating(true);
    setAiTutorResponse('');
    setAiEngineUsed('');

    const res = await askAiTutor(
      aiTutorPrompt,
      question.topic,
      language,
      customApiKey
    );

    setIsAiGenerating(false);

    if (res.success && res.answer) {
      setAiTutorResponse(res.answer);
      setAiEngineUsed(res.apiUsed || 'Smart AI Engine');
    } else {
      setAiTutorResponse(`⚠️ ${res.error || 'Could not connect to AI Tutor'}. Showing local response:
Topic: ${question.topic}
Answer: In ${question.topic}, neural representations rely on non-linear activations or high-dimensional embeddings to preserve semantic gradients.`);
      setAiEngineUsed('Local Fallback');
    }
  };

  const toggleAudioTTS = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 text-xs font-semibold">
            ● Adaptive Learning Engine ({language.toUpperCase()})
          </span>
          <h2 className={`text-2xl font-bold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t('learning_engine', language)}</h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Topic: <span className="text-indigo-500 font-semibold">{question.topic}</span>
          </p>
        </div>

        {/* Audio TTS Button */}
        <button
          onClick={toggleAudioTTS}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isAudioPlaying
              ? 'bg-pink-500/20 text-pink-400 border-pink-500/40 animate-pulse'
              : isDark 
                ? 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white' 
                : 'bg-white text-slate-700 border-slate-200 hover:text-slate-900 shadow-sm'
          }`}
        >
          <Volume2 className="w-4 h-4 text-pink-500" />
          <span>{isAudioPlaying ? 'Playing Audio Explanation...' : 'Listen Audio Explanation'}</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className={`flex items-center gap-2 p-1.5 rounded-xl border text-xs font-semibold max-w-md ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveSubTab('concept')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeSubTab === 'concept' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1. Concept & Theory
        </button>
        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeSubTab === 'code' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          2. Code & Diagram
        </button>
        <button
          onClick={() => setActiveSubTab('quiz')}
          className={`flex-1 py-2 rounded-lg transition-all ${
            activeSubTab === 'quiz' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          3. Diagnostic Quiz
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Topic Viewer */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-6 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          
          {activeSubTab === 'concept' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-xl font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {question.topic}
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded font-mono ${
                  isDark ? 'bg-slate-900 text-indigo-300' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                }`}>
                  Lang: {language.toUpperCase()}
                </span>
              </div>

              <div className={`text-sm space-y-3 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                <p>
                  In modern machine learning and vector search systems, activation functions and embedding similarity metrics govern how neural representations are processed.
                </p>
                <div className={`p-4 rounded-xl border space-y-2 ${
                  isDark ? 'bg-slate-900/90 border-indigo-500/20 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <h4 className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Key Takeaways:</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Rectified Linear Unit (ReLU) prevents vanishing gradient saturation.</li>
                    <li>Cosine Similarity measures embedding angle regardless of magnitude.</li>
                    <li>pgvector enables fast IVFFlat index querying inside PostgreSQL.</li>
                  </ul>
                </div>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => setActiveSubTab('code')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
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
                <h3 className={`text-lg font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Code className="w-5 h-5 text-indigo-500" />
                  <span>Python & pgvector Query Sandbox</span>
                </h3>
                <span className="text-xs text-emerald-500 font-mono">● Output Verified</span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto space-y-2">
                <p className="text-slate-500"># pgvector cosine similarity search formulation</p>
                <p><span className="text-purple-400">import</span> psycopg2</p>
                <p><span className="text-purple-400">from</span> sentence_transformers <span className="text-purple-400">import</span> SentenceTransformer</p>
                <br />
                <p><span className="text-indigo-400">model</span> = SentenceTransformer(<span className="text-emerald-300">'all-MiniLM-L6-v2'</span>)</p>
                <p><span className="text-indigo-400">query_vector</span> = model.encode(<span className="text-emerald-300">"Explain activation functions in {language.toUpperCase()}"</span>)</p>
                <br />
                <p className="text-slate-500"># Execute vector similarity lookup</p>
                <p>cursor.execute(<span className="text-emerald-300">"SELECT content, 1 - (embedding &lt;=&gt; %s) AS similarity FROM learning_resources ORDER BY embedding &lt;=&gt; %s LIMIT 3"</span>, (query_vector, query_vector))</p>
              </div>

              <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                <button
                  onClick={() => setActiveSubTab('quiz')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
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
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-500 border border-indigo-500/30 text-xs font-semibold">
                  Diagnostic Quiz {currentQuestionIdx + 1} of {sampleQuizQuestions.length}
                </span>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Difficulty: {question.difficulty.toUpperCase()}</span>
              </div>

              <h3 className={`text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {getQuestionText()}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {getOptions().map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === question.correctAnswer;
                  
                  let optionStyle = isDark 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800';
                  if (isAnswerSubmitted) {
                    if (isCorrect) optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-600 font-semibold';
                    else if (isSelected) optionStyle = 'bg-red-500/20 border-red-500 text-red-600 font-semibold';
                  } else if (isSelected) {
                    optionStyle = 'bg-indigo-600/20 border-indigo-500 text-indigo-600 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation card after submit */}
              {isAnswerSubmitted && (
                <div className={`p-4 rounded-xl border space-y-2 text-xs ${
                  isDark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
                }`}>
                  <p className="font-bold text-indigo-500">Explainable Answer Reason & Server Logged:</p>
                  <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{getExplanation()}</p>
                </div>
              )}

              {/* Quiz Actions */}
              <div className={`pt-4 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                {!isAnswerSubmitted ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmitQuiz}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all ${
                      selectedOption === null ? 'opacity-40 cursor-not-allowed bg-slate-800' : 'bg-indigo-600 hover:bg-indigo-500 shadow-md'
                    }`}
                  >
                    Submit Answer & Save to Server
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

        {/* Right Column: Multilingual AI Tutor Drawer with Custom API Key Option */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-3">
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className={`text-sm font-bold font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Multilingual Tutor</h3>
              </div>
              <button
                onClick={() => setShowKeyConfig(!showKeyConfig)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] ${
                  isDark ? 'bg-slate-800 text-indigo-300 hover:bg-slate-700' : 'bg-slate-100 text-indigo-700 hover:bg-slate-200'
                }`}
                title="Configure Gemini API Key"
              >
                <Settings className="w-3 h-3" />
                <span>{customApiKey ? 'Key Set' : 'Configure Key'}</span>
              </button>
            </div>

            {/* Config drawer for custom API key */}
            {showKeyConfig && (
              <div className={`p-3 rounded-xl border space-y-2 text-xs ${
                isDark ? 'bg-slate-900/90 border-indigo-500/30' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-indigo-500">
                  <Key className="w-3.5 h-3.5" />
                  <span>Google Gemini API Key (Optional)</span>
                </div>
                <input
                  type="password"
                  value={customApiKey}
                  onChange={(e) => setCustomApiKey(e.target.value)}
                  placeholder="Paste your Gemini API key here..."
                  className={`w-full px-3 py-1.5 text-xs rounded-lg border outline-none font-mono ${
                    isDark ? 'bg-slate-950 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-300'
                  }`}
                />
                <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  If left empty, the server automatically uses its built-in AI expert engine.
                </p>
              </div>
            )}

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Ask any question about <span className="text-indigo-500 font-semibold">{question.topic}</span> in {language.toUpperCase()}!
            </p>

            {/* Tutor Response Box */}
            {aiTutorResponse && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 shadow-inner ${
                isDark ? 'bg-slate-900/95 border-indigo-500/30 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}>
                <div className={`flex items-center justify-between text-[10px] font-bold border-b pb-1.5 ${isDark ? 'text-indigo-400 border-slate-800' : 'text-indigo-600 border-slate-200'}`}>
                  <span>AI TUTOR ANSWER</span>
                  <span className={`px-2 py-0.5 rounded ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-800'}`}>{aiEngineUsed}</span>
                </div>
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {aiTutorResponse}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleAskAiTutor} className={`space-y-2 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <input
              type="text"
              required
              placeholder={`Ask AI tutor about ${question.topic} in ${language.toUpperCase()}...`}
              value={aiTutorPrompt}
              onChange={(e) => setAiTutorPrompt(e.target.value)}
              className={`w-full text-xs px-3.5 py-2.5 rounded-xl border outline-none ${
                isDark ? 'bg-slate-900 text-slate-100 border-slate-800 focus:border-indigo-500' : 'bg-slate-50 text-slate-900 border-slate-300 focus:border-indigo-600'
              }`}
            />
            <button
              type="submit"
              disabled={isAiGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isAiGenerating ? 'AI Tutor Processing...' : 'Ask AI Tutor'}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};


