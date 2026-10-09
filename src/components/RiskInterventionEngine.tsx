import React, { useState } from 'react';
import { mockAtRiskStudents } from '../data/mockData';
import { 
  HeartHandshake, 
  Sparkles, 
  UserCheck, 
  CheckCircle2, 
  Users, 
  Send, 
  ArrowRight,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { AtRiskStudent, Language } from '../types';

interface RiskInterventionEngineProps {
  language: Language;
}

export const RiskInterventionEngine: React.FC<RiskInterventionEngineProps> = ({ language }) => {
  const [students, setStudents] = useState<AtRiskStudent[]>(mockAtRiskStudents);
  const [assignedStudents, setAssignedStudents] = useState<Record<string, boolean>>({});
  const [mentorInvolved, setMentorInvolved] = useState<Record<string, boolean>>({});

  const handleAssignIntervention = (studentId: string) => {
    setAssignedStudents(prev => ({ ...prev, [studentId]: true }));
  };

  const handleInvolveMentor = (studentId: string) => {
    setMentorInvolved(prev => ({ ...prev, [studentId]: true }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner (Highlight #9) */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
              Proactive Learning Support Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
              Supportive Growth Framework
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-outfit mt-1">
            Learning Support & Remedial Intervention Spotlight
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Supportive identification of emerging learning hurdles before major exams. Rather than imposing permanent negative labels, the system provides timely encouragement and makes it easy to involve a teacher or industry mentor.
          </p>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-right shrink-0">
          <p className="text-xs text-slate-400">Remedial Recovery Rate</p>
          <p className="text-xl font-bold text-emerald-400 font-outfit">88.5% Success</p>
        </div>
      </div>

      {/* Supportive Philosophy Note (Report Highlight #9) */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs leading-relaxed text-indigo-200">
        <HeartHandshake className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">Supportive & Non-Labeling Design (Report Highlight #9)</span>
          Learning difficulties are dynamic temporary focus areas, never permanent student identities. Teachers and mentors are invited collaboratively to provide targeted encouragement, adaptive worksheets, and 1:1 guidance.
        </div>
      </div>

      {/* Student Support Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Learners In Focus for Additional Encouragement</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map(student => {
            const isAssigned = assignedStudents[student.id];
            const isMentored = mentorInvolved[student.id];

            return (
              <div key={student.id} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{student.name}</h4>
                      <p className="text-xs text-slate-400">{student.course} • {student.email}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-semibold border bg-amber-500/15 text-amber-400 border-amber-500/30">
                      Support Priority: Active Focus
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <p className="font-semibold text-slate-300">Topics Needing Reinforcement:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {student.strugglingTopics.map((top, tIdx) => (
                        <span key={tIdx} className="px-2.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium">
                          {top}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Recent Inactivity: <strong className="text-amber-400">{student.inactivityDays} days</strong></span>
                      <span>Latest Diagnostic Score: <strong className="text-indigo-400">{student.lastQuizScore}%</strong></span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-indigo-400">Encouragement & Growth Plan:</p>
                    <p className="text-xs text-slate-300 bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 leading-relaxed">
                      {student.recommendedIntervention}
                    </p>
                  </div>
                </div>

                {/* Collaborative Action Buttons: Involve Mentor + Trigger Remedial (Highlight #9) */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                  <button
                    onClick={() => handleInvolveMentor(student.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                      isMentored
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>{isMentored ? 'Mentor Assigned' : 'Involve 1:1 Mentor'}</span>
                  </button>

                  <button
                    disabled={isAssigned}
                    onClick={() => handleAssignIntervention(student.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                      isAssigned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAssigned ? 'Remedial Sent' : 'Assign Practice Task'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
