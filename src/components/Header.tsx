import React, { useState } from 'react';
import { useTournament } from '../context/TournamentContext';
import { PublicPage } from '../types';
import { 
  Trophy, 
  Menu, 
  X, 
  Lock, 
  ShieldCheck, 
  ChevronDown, 
  Share2
} from 'lucide-react';

export const Header: React.FC<{ onAdminClick: () => void }> = ({ onAdminClick }) => {
  const { 
    activePublicPage, 
    navigateTo, 
    isAdminLoggedIn, 
    settings, 
    selectedTournament,
    openShareModal
  } = useTournament();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white italic text-sm shadow-md shadow-orange-950/40 group-hover:scale-105 transition-transform">
                P
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white uppercase font-['Chakra_Petch',sans-serif] block leading-none">
                  PES <span className="text-orange-500 font-medium">Tournament</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] font-black uppercase text-orange-400 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  {selectedTournament?.season || 'S1'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            {navLinks.map((link) => {
              const isActive = activePublicPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                    isActive
                      ? 'text-white border-b-2 border-orange-500 bg-orange-500/10 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Login / Control Room */}
            <button
              onClick={onAdminClick}
              className={`text-[10px] uppercase tracking-widest font-bold transition-colors flex items-center gap-1.5 ${
                isAdminLoggedIn
                  ? 'text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded border border-orange-500/30'
                  : 'text-slate-500 hover:text-orange-400'
              }`}
              title={isAdminLoggedIn ? 'Open Admin Panel' : 'Tournament Administrator Login'}
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin Access'}</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

            {/* Quick Share button (high density round button) */}
            <button
              onClick={handleQuickShare}
              title="Share Tournament"
              className="h-8 w-8 rounded-full border border-slate-700 bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-700 hover:border-slate-600 text-slate-400 hover:text-orange-400 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-5 space-y-1 shadow-2xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {navLinks.map((link) => {
              const isActive = activePublicPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`text-left px-3 py-2 text-xs font-semibold rounded uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'text-orange-400 bg-orange-500/10 border-l-2 border-orange-500 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <button
              onClick={() => {
                handleQuickShare();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-orange-400"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Share</span>
            </button>

            <button
              onClick={() => {
                onAdminClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-orange-400 text-[10px] uppercase font-bold tracking-wider"
            >
              <Lock className="w-3 h-3" />
              {isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
