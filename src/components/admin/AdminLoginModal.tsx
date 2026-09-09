import React, { useEffect, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Lock,
  ShieldAlert,
  Mail,
  Eye,
  EyeOff,
  X,
  ShieldCheck,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { adminLogin, navigateTo } = useTournament();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError(null);
      setIsSubmitting(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter admin email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      await adminLogin(email.trim(), password);
      setPassword('');
      setError(null);
      onClose();
      navigateTo('admin');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Admin login failed. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl overflow-hidden">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

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
            Public visitors do not need accounts. Only tournament
            administrators can sign in to control tournaments, fixtures
            &amp; results.
          </p>
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-800/60 rounded-lg flex items-center gap-2 text-xs text-rose-300">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoFocus
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                autoComplete="current-password"
                className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {isSubmitting
                ? 'Authenticating...'
                : 'Authenticate & Access Control Panel'}
            </span>
          </button>

          <p className="text-center text-[10px] text-slate-500">
            Secure Supabase admin session. Only authorized admin can sign in.
          </p>
        </form>
      </div>
    </div>
  );
};