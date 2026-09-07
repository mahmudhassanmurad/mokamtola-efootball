import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Lock, ShieldAlert, KeyRound, Eye, EyeOff, X, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose }) => {
  const { adminLogin, navigateTo } = useTournament();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = adminLogin(pin);
    if (success) {
      setPin('');
      onClose();
      navigateTo('admin');
    } else {
      setError('Invalid Admin Security Key. Please verify your credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon + Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
            Authorized Personnel Only
          </span>
          <h2 className="text-xl font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mt-1">
            Admin Panel Login
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
            Public visitors do not need accounts. Only tournament administrators can sign in to control tournaments, fixtures & results.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-lg flex items-center gap-2 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Admin Security Passkey / PIN
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter admin passkey..."
                autoFocus
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                name="admin-passkey"
                className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authenticate & Access Control Panel</span>
          </button>
        </form>
      </div>
    </div>
  );
};