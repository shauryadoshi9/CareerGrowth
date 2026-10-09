import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  BookOpen, 
  Lightbulb, 
  Code2, 
  Send, 
  RefreshCw,
  FolderGit2,
  Play
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
  { id: 'rag', name: 'Retrieval-Augmented Generation (RAG) & Vector Databases', category: 'AI & Data', isWeakArea: true, diagnosticScore: '54%' },
  { id: 'relu', name: 'Deep Neural Networks & Non-Linear Activation (ReLU)', category: 'Deep Learning', isWeakArea: true, diagnosticScore: '48%' },
  { id: 'solar', name: 'Grid-Tied Solar Inverters & MPPT Algorithms', category: 'Clean Tech', isWeakArea: false, diagnosticScore: '78%' },
  { id: 'bms', name: 'Electric Vehicle Battery Management Systems (BMS)', category: 'Smart Mobility', isWeakArea: true, diagnosticScore: '30%' },
  { id: 'dsa', name: 'Binary Trees & Time Complexity in Python', category: 'Core Tech', isWeakArea: false, diagnosticScore: '85%' }
];

export const AIStudyBuddy: React.FC<AIStudyBuddyProps> = ({ language, theme = 'dark', onNavigateTab }) => {
  const isDark = theme === 'dark';
  
  const [selectedTopic, setSelectedTopic] = useState<string>(PRESET_TOPICS[0].name);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [explanation, setExplanation] = useState<string>(
    `In simple terms, think of **RAG (Retrieval-Augmented Generation)** like an open-book exam for AI! 
    
Instead of expecting the AI model to remember everything from memory (which causes "hallucinations"), RAG first searches a private library (a Vector Database) for the exact relevant facts, and then feeds those facts directly to the AI model to write your answer accurately.`
  );
  const [analogy, setAnalogy] = useState<string>(
    'Real-Life Example: Imagine asking a doctor a rare medical query. Instead of guessing from memory, the doctor pulls the exact 2026 research journal from the shelf, reads the page, and explains the cure to you. That is RAG in action!'
  );
  const [commonMistake, setCommonMistake] = useState<string>(
    'Common Student Mistake: Confusing RAG with Fine-Tuning. Fine-tuning teaches an AI new behaviors or styles (like learning to speak like Shakespeare), whereas RAG supplies external factual knowledge at query time (like handing the AI an updated encyclopedia).'
  );
  const [recommendedProject, setRecommendedProject] = useState<{ title: string; desc: string }>({
    title: 'Personal Document Q&A Bot with FastAPI & pgvector',
    desc: 'Step 1: Chunk a PDF file into paragraphs. Step 2: Generate vector embeddings. Step 3: Run cosine similarity search.'
  });
  const [practiceQuestion, setPracticeQuestion] = useState<PracticeQuestion>({
    question: 'Why does RAG use Cosine Similarity between vector embeddings instead of simple text matching?',
    options: [
      'It compares semantic conceptual meaning rather than exact keyword words',
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
  const [isListening, setIsListening] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [demoBannerActive, setDemoBannerActive] = useState<boolean>(false);

  // Voice Learning via Web Speech API (Text-to-Speech)
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

    const textToSpeak = `${explanation}. ${analogy}. ${commonMistake}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#]/g, ''));
    
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'gu') utterance.lang = 'gu-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Input via Speech Recognition (Speech-to-Text)
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      if (language === 'hi') recognition.lang = 'hi-IN';
      else if (language === 'gu') recognition.lang = 'gu-IN';
      else recognition.lang = 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const spokenText = event.results[0][0].transcript;
        if (spokenText) {
          setCustomQuery(spokenText);
          handleExplainTopic('Spoken Inquiry', spokenText);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleExplainTopic = async (topicName: string, queryText?: string) => {
    if (isSpeaking) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setLoading(true);

    try {
      const prompt = queryText || `Explain the topic "${topicName}" in simple, intuitive terms with a clear real-life analogy, common student mistakes or misconceptions, an interactive practice question with 4 options, and a micro-project suggestion.`;
      const res = await askAiTutor(prompt, topicName, language);

      if (res.success && res.answer) {
        setExplanation(res.answer);
        setAnalogy(`Analogy: How ${topicName} operates in real-world professional industry deployments.`);
        setCommonMistake(`Key Pitfall to Avoid: In ${topicName}, students often skip validating baseline constraints before scaling up.`);
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
      // Fallback handled gracefully
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Guided Demo: Explains weak topic -> recommends small project (Report Highlight #12)
  const handleRunWeakTopicDemo = () => {
    setDemoBannerActive(true);
    setSelectedTopic('Retrieval-Augmented Generation (RAG) & Vector Databases');
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setExplanation(
      `🎯 **Weak Diagnostic Topic Explained Simply**:
      
**Vector Embeddings & Cosine Similarity** (Current Diagnostic Level: 54%):
Think of every sentence as an arrow pointing in a 3D room. 

When two sentences mean similar things (e.g., "The weather is chilly" and "It feels very cold today"), their arrows point in almost the exact same direction. **Cosine Similarity** simply measures the angle between those two arrows! If the angle is 0 degrees, their meaning is 100% identical.`
    );
    setAnalogy(
      'Real-Life Analogy: Imagine a compass. If two people walk in almost the same magnetic bearing, they will reach the same destination. Cosine similarity checks whether two ideas are heading in the same direction.'
    );
    setCommonMistake(
      'Mistake Alert: Students often assume Cosine Similarity measures sentence length. In reality, it only measures angle/direction, so a short sentence ("I am hungry") matches a long sentence ("My stomach is completely empty and craving food") perfectly!'
    );
    setRecommendedProject({
      title: 'Personal Document Q&A Bot with FastAPI & pgvector',
      desc: 'Build a working 4-step project to turn your 54% diagnostic score into an 85% recruiter-ready verified skill!'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className={`p-6 md:p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        isDark ? 'bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/60 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200 shadow-lg'
      }`}>
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              AI Study Buddy
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Voice-Enabled Bilingual Learning (Hindi / Gujarati / English)
            </span>
          </div>

          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Master Complex Concepts in Simple Language
          </h2>

          <p className={`text-xs md:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Struggling with a difficult subject? Your AI Study Buddy translates heavy technical jargon into intuitive real-life examples, breaks down common student mistakes, speaks explanations aloud, and recommends small hands-on portfolio projects.
          </p>
        </div>

        {/* Action Controls: Audio Lesson & 1-Click Demo */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleRunWeakTopicDemo}
            className="px-4 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Weak Topic Demo Flow</span>
          </button>

          <button
            onClick={handleToggleVoice}
            className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
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
                <span>Listen Aloud</span>
              </>
            )}
          </button>
        </div>
      </div>

      {demoBannerActive && (
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span><strong>Guided Demo Active:</strong> AI Study Buddy explaining weak diagnostic topic (54%) with plain analogy and recommending a hands-on project to build portfolio evidence.</span>
          </div>
          <button onClick={() => setDemoBannerActive(false)} className="text-slate-400 hover:text-white font-bold ml-2">✕</button>
        </div>
      )}

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
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedTopic === t.name
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark 
                    ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
              }`}
            >
              <span>{t.name}</span>
              {t.isWeakArea && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500/20 text-red-300 font-bold border border-red-500/30">
                  Weak: {t.diagnosticScore}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Conceptual Breakdown, Analogy & Mistake Buster */}
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

            {/* Common Student Mistakes Breakdown (Report Highlight #2) */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}>
              <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              <div className="text-xs leading-relaxed font-medium">
                {commonMistake}
              </div>
            </div>
          </div>

          {/* Recommended Micro-Project Card (Report Highlighting #6 & #12) */}
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
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md transition"
                >
                  <span>Build in Practical Project Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Diagnostic Practice Question & Voice Doubt Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`p-6 rounded-3xl border space-y-5 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Diagnostic Quick Check</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Topic Mastery</span>
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
                      : 'Not quite right — understanding the misconception:'}
                  </span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {practiceQuestion.explanation}
                </p>
              </div>
            )}

            {/* Custom Question Form with Voice Dictation (Highlight #7) */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  Ask Study Buddy Any Specific Doubt:
                </label>
                <span className="text-[10px] text-indigo-400 font-medium">Bilingual Voice Supported</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={e => setCustomQuery(e.target.value)}
                  placeholder="Type or click mic to ask aloud..."
                  className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />

                {/* Voice Input Button */}
                <button
                  type="button"
                  onClick={handleToggleVoiceInput}
                  title={isListening ? "Stop Listening" : "Ask Aloud (Voice Input)"}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : isDark ? 'bg-slate-800 hover:bg-slate-700 text-indigo-400' : 'bg-slate-100 hover:bg-slate-200 text-indigo-600'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  disabled={!customQuery.trim() || loading}
                  onClick={() => { handleExplainTopic('Custom Inquiry', customQuery); setCustomQuery(''); }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition flex items-center justify-center"
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
