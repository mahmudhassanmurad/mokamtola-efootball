import React, { useEffect, useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { PublicPage } from '../types';
import {
  Trophy,
  Menu,
  X,
  Lock,
  Share2,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
  const {
    activePublicPage,
    navigateTo,
    isAdminLoggedIn,
    settings,
    selectedTournament,
    openShareModal,
  } = useTournament();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePublicPage]);

  const navLinks: { id: PublicPage; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'fixtures', label: 'Fixtures' },
    { id: 'results', label: 'Results' },
    { id: 'standings', label: 'Standings' },
    { id: 'players', label: 'Players' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'rules', label: 'Rules' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'announcements', label: 'Announcements' },
  ];

  const handleNav = (page: PublicPage) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const handleQuickShare = () => {
    openShareModal({
      title: settings.tournamentTitle || 'PES TOURNAMENT',
      subtitle: `${selectedTournament?.name || 'Tournament Hub'} • Live Standings & Results`,
      type: 'tournament',
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 group min-w-0 text-left"
          >
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-950/30 group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-slate-950" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-black tracking-[0.14em] text-white uppercase font-['Chakra_Petch',sans-serif] leading-none">
                  PES <span className="text-orange-400">Tournament</span>
                </h1>

                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              <p className="hidden sm:block text-[11px] text-slate-400 mt-1 truncate max-w-[240px]">
                {selectedTournament?.name || 'Official public tournament portal'}
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[56vw] px-1 py-1 rounded-2xl border border-white/5 bg-white/3">
            {navLinks.map((link) => {
              const isActive = activePublicPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleQuickShare}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/8 bg-white/3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              title="Share tournament"
            >
              <Share2 className="w-4 h-4 text-orange-400" />
              <span className="text-[11px] font-semibold">Share</span>
            </button>

            <button
              onClick={onAdminClick}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${
                isAdminLoggedIn
                  ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                  : 'border border-white/8 bg-white/3 text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title={isAdminLoggedIn ? 'Open admin panel' : 'Admin login'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
              </span>
              <span className="sm:hidden">
                {isAdminLoggedIn ? 'Admin' : 'Login'}
              </span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl border border-white/8 bg-white/3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-white/5 bg-slate-950/98 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const isActive = activePublicPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNav(link.id)}
                    className={`text-left px-4 py-3 rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-md shadow-orange-950/20'
                        : 'bg-white/3 border-white/5 text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="text-[11px] font-black uppercase tracking-wider">
                      {link.label}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                      <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
                      Open
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  handleQuickShare();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/8 bg-white/3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Share2 className="w-4 h-4 text-orange-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Share</span>
              </button>

              <button
                onClick={() => {
                  onAdminClick();
                  setMobileMenuOpen(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/8 bg-white/3 text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};