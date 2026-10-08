import React, { useState } from 'react';
import { sampleOfflinePacks } from '../data/mockData';
import { Download, CheckCircle2, HardDrive, RefreshCw, Signal, WifiOff, FileText, Zap } from 'lucide-react';
import { OfflinePack, Language } from '../types';

interface OfflinePackManagerProps {
  isLowBandwidth: boolean;
  onToggleLowBandwidth: () => void;
  language: Language;
}

export const OfflinePackManager: React.FC<OfflinePackManagerProps> = ({
  isLowBandwidth,
  onToggleLowBandwidth,
  language,
}) => {
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
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            NEP 2020 Inclusive Rural Access Protocol
          </span>
          <h2 className="text-2xl font-bold text-white font-outfit mt-1">Rural Low-Bandwidth & Offline Packs</h2>
          <p className="text-sm text-slate-300">
            Download lightweight offline learning modules, local quizzes, and sync progress automatically when connectivity returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncProgress}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Local Progress...' : 'Sync Local State'}</span>
          </button>
        </div>
      </div>

      {/* Mode Status & Sync Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Connectivity Status</span>
            <WifiOff className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-base font-bold text-white">
            {isLowBandwidth ? 'Low-Bandwidth (2G/3G Mode)' : 'Broadband Connected'}
          </p>
          <p className="text-xs text-slate-400">Payload compressed by 85%</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Downloaded Offline Content</span>
            <HardDrive className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-base font-bold text-white">
            {packs.filter(p => p.downloaded).length} of {packs.length} Packs Active
          </p>
          <p className="text-xs text-indigo-400">Available without internet</p>
        </div>

        <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Last Cloud Synchronization</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-emerald-400">{lastSyncTime}</p>
          <p className="text-xs text-slate-400">0 pending offline telemetry logs</p>
        </div>
      </div>

      {/* Offline Packs Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <span>Available Rural Downloadable Learning Packs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packs.map(pack => (
            <div key={pack.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-900 text-indigo-300 border border-slate-800">
                    {pack.subject}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{pack.fileSize}</span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug">{pack.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{pack.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">{pack.modulesCount} Modules included</span>

                {pack.downloaded ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
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
