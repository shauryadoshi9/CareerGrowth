import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Sparkles, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { Language, ThemeMode } from '../types';

interface MockInterviewEngineProps {
  language: Language;
  theme?: ThemeMode;
  onNavigateTab: (tab: string) => void;
}

interface InterviewQuestion {
  id: string;
  question: string;
  keyConceptsExpected: string[];
}

const INTERVIEW_TRACKS = [
  {
    id: 'ai-eng',
    title: 'AI & Data Engineering Track',
    role: 'Junior AI Engineer',
    questions: [
      {
        id: 'q1',
        question: 'Explain how you would design a Retrieval-Augmented Generation (RAG) pipeline to prevent hallucination in domain-specific technical customer support.',
        keyConceptsExpected: ['Vector database / embeddings', 'Cosine similarity / chunking', 'System prompt constraints', 'Re-ranking or source verification']
      },
      {
        id: 'q2',
        question: 'Why do deep learning practitioners favor ReLU or GELU activation functions over Sigmoid for hidden layers in modern neural architectures?',
        keyConceptsExpected: ['Vanishing gradient problem', 'Computational efficiency', 'Non-saturating gradient', 'Gradient descent propagation']
      }
    ]
  },
  {
    id: 'fullstack',
    title: 'Full-Stack Developer Track',
    role: 'Full-Stack Engineer',
    questions: [
      {
        id: 'q1',
        question: 'How do you structure secure user authentication with JWT, refresh tokens, and bcrypt password hashing in a distributed web application?',
        keyConceptsExpected: ['Salting & hashing with bcrypt', 'HTTP-only secure cookies / headers', 'Token expiration & refresh flow', 'CORS & CSRF prevention']
      }
    ]
  },
  {
    id: 'solar',
    title: 'Clean Energy & Smart Mobility Track',
    role: 'Solar PV Systems Apprentice',
    questions: [
      {
        id: 'q1',
        question: 'Describe how Maximum Power Point Tracking (MPPT) algorithms maintain optimal power transfer during intermittent cloud cover on rooftop Solar PV arrays.',
        keyConceptsExpected: ['I-V / P-V curve tracking', 'Perturb & observe / incremental conductance', 'Impedance matching', 'Grid inverter synchronization']
      }
    ]
  }
];

export const MockInterviewEngine: React.FC<MockInterviewEngineProps> = ({ 
  language, 
  theme = 'dark', 
  onNavigateTab 
}) => {
  const isDark = theme === 'dark';

  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    strongPoints: string[];
    improvements: string[];
    recommendedPractice: string;
  } | null>(null);

  const activeTrack = INTERVIEW_TRACKS[selectedTrackIndex];
  const activeQuestion = activeTrack.questions[currentQuestionIndex];

  const handleEvaluateAnswer = () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);

    setTimeout(() => {
      const lower = userAnswer.toLowerCase();
      const matched = activeQuestion.keyConceptsExpected.filter(k => 
        k.toLowerCase().split(' ').some(w => w.length > 4 && lower.includes(w))
      );

      const ratio = matched.length / activeQuestion.keyConceptsExpected.length;
      const score = Math.min(95, Math.max(50, Math.round(55 + ratio * 40)));

      setFeedback({
        score,
        strongPoints: matched.length > 0 ? matched : ['Good initiative and logical response structure'],
        improvements: activeQuestion.keyConceptsExpected.filter(k => !matched.includes(k)),
        recommendedPractice: 'Review core diagnostic formulations with AI Study Buddy and implement a micro-project to cement practical understanding.'
      });
      setEvaluating(false);
    }, 1000);
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setFeedback(null);
    if (currentQuestionIndex < activeTrack.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCurrentQuestionIndex(0);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner */}
      <div className={`p-8 rounded-3xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
        isDark ? 'bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-indigo-200 shadow-lg'
      }`}>
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1.5">
              <MessageSquareCode className="w-3.5 h-3.5" />
              AI Mock Interview Practice
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Instant Rubric Feedback
            </span>
          </div>

          <h2 className={`text-2xl md:text-3xl font-extrabold tracking-tight font-outfit ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Text-Based Technical Mock Interviews
          </h2>

          <p className={`text-xs md:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Simulate realistic technical interview questions tailored to your desired career track. Receive instant scoring on technical depth, key concept coverage, and targeted practice recommendations.
          </p>
        </div>

        {/* Track Selector Pill */}
        <div className="flex flex-wrap gap-2 shrink-0">
          {INTERVIEW_TRACKS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => { setSelectedTrackIndex(idx); setCurrentQuestionIndex(0); setUserAnswer(''); setFeedback(null); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                selectedTrackIndex === idx
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDark ? 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white' : 'bg-white border border-slate-200 text-slate-700'
              }`}
            >
              {t.role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interview Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Question Prompt & Answer Area */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-400 uppercase tracking-wider">
                Question {currentQuestionIndex + 1} of {activeTrack.questions.length}
              </span>
              <span className="text-slate-500 font-medium">Role: {activeTrack.role}</span>
            </div>

            <h3 className={`text-base font-bold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeQuestion.question}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Type Your Technical Answer:
              </label>
              <textarea
                rows={7}
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Structure your answer with key principles, architectural trade-offs, and concrete examples..."
                className={`w-full p-4 rounded-2xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-mono leading-relaxed ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Aim for technical precision and clear conceptual explanation.
              </span>

              <button
                disabled={evaluating || !userAnswer.trim()}
                onClick={handleEvaluateAnswer}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                {evaluating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating Answer...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Instant Rubric Feedback & Practice Recommendations */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-6 rounded-3xl border space-y-5 h-full flex flex-col justify-between ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AI Evaluation Feedback
                </h4>
                {feedback && (
                  <span className="text-xl font-black text-emerald-400">
                    {feedback.score}/100
                  </span>
                )}
              </div>

              {!feedback ? (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <Sparkles className="w-10 h-10 mx-auto text-indigo-400/50 mb-2" />
                  <p className="text-xs font-semibold">Ready to Evaluate Your Answer</p>
                  <p className="text-[11px]">Type your response on the left and submit to receive instant AI scoring and concept gap feedback.</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in text-xs">
                  {/* Strengths */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Core Concepts Demonstrated:
                    </span>
                    <ul className="space-y-1 pl-4 list-disc text-slate-300">
                      {feedback.strongPoints.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  {feedback.improvements.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Concepts to Clarify Further:
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-slate-300">
                        {feedback.improvements.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Practice Recommendation */}
                  <div className={`p-3.5 rounded-2xl border ${
                    isDark ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  }`}>
                    <span className="font-bold text-[11px] block mb-1">Targeted Next Step:</span>
                    <p className="text-[11px] leading-relaxed">{feedback.recommendedPractice}</p>
                  </div>
                </div>
              )}
            </div>

            {feedback && (
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => onNavigateTab('study-buddy')}
                  className="text-xs text-indigo-400 hover:underline font-semibold"
                >
                  Review with Study Buddy
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
