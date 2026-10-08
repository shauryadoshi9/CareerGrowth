import React, { useState } from 'react';
import { Sun, Zap, Cpu, Wrench, CheckSquare, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import { Language } from '../types';

interface VocationalHubProps {
  language: Language;
  onNavigateTab: (tab: string) => void;
}

export const VocationalHub: React.FC<VocationalHubProps> = ({ language, onNavigateTab }) => {
  const [selectedPathway, setSelectedPathway] = useState<string>('solar');

  const pathways = [
    {
      id: 'solar',
      title: 'Solar PV & Rooftop Installation',
      icon: Sun,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/30',
      description: 'Master practical solar panel mounting, string inverter wiring, phase balancing, and grid sync safety protocols.',
      checklists: [
        'Perform solar irradiance testing using multimeter & pyranometer',
        'Wire MC4 connectors with IP67 waterproofing seal',
        'Configure grid-tie micro-inverter telemetry settings',
        'Verify earthing resistance (< 5 Ohms standard)'
      ]
    },
    {
      id: 'ev',
      title: 'EV Mobility & Battery Diagnostics',
      icon: Zap,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
      description: 'Troubleshoot Lithium-ion battery packs, BMS cell balancing, high-voltage contactors, and CAN bus telemetry.',
      checklists: [
        'Measure cell voltage variances across 48V/72V EV battery modules',
        'Read diagnostic fault codes (DTC) using OBD-II CAN bus tool',
        'Perform thermal imaging inspection of high-current power cables',
        'Test regenerative braking controller response curves'
      ]
    },
    {
      id: 'agri',
      title: 'Smart Agri IoT & Automated Irrigation',
      icon: Cpu,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      description: 'Deploy low-power LoRaWAN soil moisture probes, automated solenoid valves, and drone crop health telemetry.',
      checklists: [
        'Calibrate capacitive soil moisture sensors in sand/clay substrates',
        'Program ESP32 / Arduino microcontroller for solar-powered telemetry',
        'Set up automated drip irrigation relay based on soil moisture thresholds',
        'Upload multispectral drone imagery to crop yield model'
      ]
    }
  ];

  const current = pathways.find(p => p.id === selectedPathway) || pathways[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
            NEP 2020 Vocational & Practical Skill Credit Pathway
          </span>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Vocational & Practical Skill Hub</h2>
          <p className="text-sm text-slate-300">
            Hands-on technical skilling pathways for clean energy, electric mobility, and smart agricultural technology.
          </p>
        </div>

        <div className="bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-800 text-right">
          <p className="text-xs text-slate-400">Practical Credit Eligibility</p>
          <p className="text-base font-bold text-emerald-400 font-outfit">NCrF Level 4.5</p>
        </div>
      </div>

      {/* Pathway Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pathways.map(p => {
          const Icon = p.icon;
          const isSelected = p.id === selectedPathway;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedPathway(p.id)}
              className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-600/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl border ${p.bg}`}>
                  <Icon className={`w-5 h-5 ${p.color}`} />
                </div>
                {isSelected && <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500 text-white font-bold">Active</span>}
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-outfit">{p.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Vocational Detail & Checklist */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${current.bg}`}>
              <current.icon className={`w-6 h-6 ${current.color}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-outfit">{current.title}</h3>
              <p className="text-xs text-slate-400">Verifiable Practical Execution Protocol</p>
            </div>
          </div>
          
          <button
            onClick={() => onNavigateTab('learning')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
          >
            <span>Launch Practical Module</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <span>Practical Equipment & Execution Checklist:</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {current.checklists.map((item, idx) => (
              <div key={idx} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked={idx === 0}
                  className="mt-0.5 w-4 h-4 rounded accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs text-slate-200 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
