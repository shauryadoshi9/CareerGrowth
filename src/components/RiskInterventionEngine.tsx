import React, { useState } from 'react';
import { mockAtRiskStudents } from '../data/mockData';
import { AlertTriangle, ShieldAlert, UserCheck, CheckCircle2, MessageSquare, Send, ArrowRight } from 'lucide-react';
import { AtRiskStudent, Language } from '../types';

interface RiskInterventionEngineProps {
  language: Language;
}

export const RiskInterventionEngine: React.FC<RiskInterventionEngineProps> = ({ language }) => {
  const [students, setStudents] = useState<AtRiskStudent[]>(mockAtRiskStudents);
  const [assignedStudents, setAssignedStudents] = useState<Record<string, boolean>>({});

  const handleAssignIntervention = (studentId: string) => {
    setAssignedStudents(prev => ({ ...prev, [studentId]: true }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-red-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold">
            Early Learning Gap Identification Engine
          </span>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Learning Risk & Intervention Engine</h2>
          <p className="text-sm text-slate-300">
            Detect hidden student learning difficulties early using quiz trends and engagement signals before major examinations.
          </p>
        </div>

        <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 text-right">
          <p className="text-xs text-slate-400">At-Risk Intervention Success</p>
          <p className="text-lg font-bold text-emerald-400 font-outfit">88.5% Recovery Rate</p>
        </div>
      </div>

      {/* Student Risk Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>Flagged At-Risk Learner Cohort</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map(student => {
            const isHighRisk = student.riskLevel === 'high';
            const isAssigned = assignedStudents[student.id];

            return (
              <div key={student.id} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white">{student.name}</h4>
                      <p className="text-xs text-slate-400">{student.course} • {student.email}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      isHighRisk
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}>
                      Risk Score: {student.riskScore}%
                    </span>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <p className="font-semibold text-slate-300">Struggling Concept Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.strugglingTopics.map((top, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 text-[11px]">
                          {top}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Inactivity: <strong className="text-amber-400">{student.inactivityDays} days</strong></span>
                      <span>Last Quiz Score: <strong className="text-red-400">{student.lastQuizScore}%</strong></span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-indigo-400">Recommended Intervention Action:</p>
                    <p className="text-xs text-slate-300 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-500/20">
                      {student.recommendedIntervention}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Explainable ML Warning</span>

                  <button
                    disabled={isAssigned}
                    onClick={() => handleAssignIntervention(student.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isAssigned
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAssigned ? 'Intervention Triggered' : 'Trigger Remedial Action'}</span>
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
