import React, { useState } from 'react';
import { sampleOfflinePacks } from '../data/mockData';
import { Download, CheckCircle2, HardDrive, RefreshCw, Signal, WifiOff, FileText, Zap } from 'lucide-react';
import { OfflinePack, Language, ThemeMode } from '../types';

interface OfflinePackManagerProps {
  isLowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  language: Language;
  theme?: ThemeMode;
}

export const OfflinePackManager: React.FC<OfflinePackManagerProps> = ({
  isLowBandwidth,
  onToggleLowBandwidth,
  language,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [packs, setPacks] = useState<OfflinePack[]>(sampleOfflinePacks);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  const handleDownloadPack = (packId: string) => {
    setDownloadingId(packId);
    setTimeout(() => {
      setPacks(prev => prev.map(p => p.id === packId ? { ...p, downloaded: true, lastSynced: 'Just now' } : p));
      setDownloadingId(null);
    }, 1500);
  };

  const handleSyncProgress = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime('Just now');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${
        isDark ? 'bg-slate-900/40 border-amber-500/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-semibold">
              NEP 2020 Inclusive Rural Access Protocol
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30 text-xs font-semibold">
              📊 Sample curriculum packs
            </span>
          </div>
          <h2 className={`text-2xl font-bold font-outfit mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Rural Low-Bandwidth & Offline Packs</h2>
          <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Download lightweight offline learning modules, local quizzes, and sync progress automatically when connectivity returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncProgress}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-3.5 py-2 border rounded-xl text-xs font-semibold transition-all ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
          >
            <RefreshCw className={`w-4 h-4 text-indigo-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Local Progress...' : 'Sync Local State'}</span>
          </button>
        </div>
      </div>

      {/* Mode Status & Sync Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border space-y-1 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Connectivity Status</span>
            <WifiOff className="w-4 h-4 text-amber-500" />
          </div>
          <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {isLowBandwidth ? 'Low-Bandwidth (2G/3G Mode)' : 'Broadband Connected'}
          </p>
          <p className="text-xs text-slate-400">Payload compressed by 85%</p>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Downloaded Offline Content</span>
            <HardDrive className="w-4 h-4 text-indigo-500" />
          </div>
          <p className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {packs.filter(p => p.downloaded).length} of {packs.length} Packs Active
          </p>
          <p className="text-xs text-indigo-500 font-medium">Available without internet</p>
        </div>

        <div className={`p-4 rounded-xl border space-y-1 ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Last Cloud Synchronization</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-emerald-500">{lastSyncTime}</p>
          <p className="text-xs text-slate-400">0 pending offline telemetry logs</p>
        </div>
      </div>

      {/* Offline Packs Grid */}
      <div className="space-y-4">
        <h3 className={`text-lg font-bold font-outfit flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <FileText className="w-5 h-5 text-indigo-500" />
          <span>Available Rural Downloadable Learning Packs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packs.map(pack => (
            <div key={pack.id} className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                    isDark ? 'bg-slate-900 text-indigo-300 border-slate-800' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {pack.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{pack.fileSize}</span>
                </div>

                <h4 className={`text-base font-bold leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>{pack.title}</h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{pack.description}</p>
              </div>

              <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800/80' : 'border-slate-100'}`}>
                <span className="text-xs text-slate-400">{pack.modulesCount} Modules included</span>

                {pack.downloaded ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Downloaded</span>
                  </span>
                ) : (
                  <button
                    disabled={downloadingId === pack.id}
                    onClick={() => handleDownloadPack(pack.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadingId === pack.id ? 'Downloading...' : 'Download Pack'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

