import React, { useState } from 'react';
import { X, UserPlus, CheckCircle, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { email: string; name: string; avatarUrl?: string }) => Promise<void>;
}

const DEFAULT_ACCOUNTS: GoogleAccount[] = [
  {
    id: 'g-1',
    name: 'Shaurya Doshi',
    email: 'shauryadoshi9@gmail.com',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: 'g-2',
    name: 'GTU Scholar',
    email: 'scholar.student@gmail.com',
    avatarColor: 'bg-emerald-600',
  }
];

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [savedAccounts, setSavedAccounts] = useState<GoogleAccount[]>(() => {
    try {
      const stored = localStorage.getItem('careergrowth_saved_google_accounts') || localStorage.getItem('skillbridge_saved_google_accounts');
      return stored ? JSON.parse(stored) : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  });

  const [mode, setMode] = useState<'choose' | 'add'>('choose');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelect = async (account: GoogleAccount) => {
    setLoading(true);
    setError(null);
    try {
      await onSelectAccount({
        email: account.email,
        name: account.name,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with selected Google account');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailTrimmed = customEmail.trim();
    if (!emailTrimmed) {
      setError('Please enter a Google account email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const derivedName = customName.trim() || emailTrimmed.split('@')[0].replace(/[._-]/g, ' ');
      const newAcc: GoogleAccount = {
        id: `g-${Date.now()}`,
        name: derivedName.charAt(0).toUpperCase() + derivedName.slice(1),
        email: emailTrimmed.toLowerCase(),
        avatarColor: 'bg-purple-600',
      };

      const updated = [newAcc, ...savedAccounts.filter(a => a.email !== newAcc.email)];
      setSavedAccounts(updated);
      try {
        localStorage.setItem('careergrowth_saved_google_accounts', JSON.stringify(updated));
      } catch (e) {
        // storage ignored
      }

      await onSelectAccount({
        email: newAcc.email,
        name: newAcc.name,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Authentication error with Google account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
              <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11 0 12.4s.6 3.2 1.6 5.2l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23.8c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.1L1.6 17c1.9 3.8 5.8 6.8 10.4 6.8z"/>
            </svg>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Sign in with Google</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose an account to continue to CareerGrowth</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
            {error}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {mode === 'choose' ? (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Select your Google Account
              </div>

              {savedAccounts.map((acc) => (
                <button
                  key={acc.id}
                  disabled={loading}
                  onClick={() => handleSelect(acc)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition group text-left disabled:opacity-50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full ${acc.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0`}>
                      {acc.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                        {acc.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {acc.email}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition shrink-0 ml-2" />
                </button>
              ))}

              {/* Add Account Option */}
              <button
                disabled={loading}
                onClick={() => setMode('add')}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition text-left mt-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                  <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span>Use another Google account</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddAccount} className="space-y-4">
              <button
                type="button"
                onClick={() => setMode('choose')}
                className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to accounts
              </button>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Google Email Address
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Your Display Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Shaurya Doshi"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition"
              >
                {loading ? 'Verifying with Google...' : 'Continue with this account'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy & Trust Badge */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              To continue, Google will verify your identity and share your verified email address and basic profile with CareerGrowth.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
