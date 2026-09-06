import React, { useState } from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { ShareModal } from './components/ShareModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

// Public Pages
import { HomePage } from './components/public/HomePage';
import { TournamentsPage } from './components/public/TournamentsPage';
import { TournamentDetailsPage } from './components/public/TournamentDetailsPage';
import { FixturesPage } from './components/public/FixturesPage';
import { ResultsPage } from './components/public/ResultsPage';
import { StandingsPage } from './components/public/StandingsPage';
import { PlayersPage } from './components/public/PlayersPage';
import { PlayerProfilePage } from './components/public/PlayerProfilePage';
import { StatisticsPage } from './components/public/StatisticsPage';
import { RulesPage } from './components/public/RulesPage';
import { RoadmapPage } from './components/public/RoadmapPage';
import { AnnouncementsPage } from './components/public/AnnouncementsPage';
import { HistoryPage } from './components/public/HistoryPage';

import { Trophy, Shield, Lock, ArrowUpRight, Share2, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activePublicPage,
    isAdminLoggedIn,
    shareModal,
    closeShareModal,
    navigateTo,
    selectedTournament,
    openShareModal
  } = useTournament();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const handleAdminAccess = () => {
    if (isAdminLoggedIn) {
      navigateTo('admin');
    } else {
      setIsAdminModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-orange-500 selection:text-slate-950">
      {/* Top Header */}
      <Header onAdminClick={handleAdminAccess} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Dynamic Route View */}
        {activePublicPage === 'home' && <HomePage />}
        {activePublicPage === 'tournaments' && <TournamentsPage />}
        {activePublicPage === 'tournament_details' && <TournamentDetailsPage />}
        {activePublicPage === 'fixtures' && <FixturesPage />}
        {activePublicPage === 'results' && <ResultsPage />}
        {activePublicPage === 'standings' && <StandingsPage />}
        {activePublicPage === 'players' && <PlayersPage />}
        {activePublicPage === 'player_profile' && <PlayerProfilePage />}
        {activePublicPage === 'statistics' && <StatisticsPage />}
        {activePublicPage === 'rules' && <RulesPage />}
        {activePublicPage === 'roadmap' && <RoadmapPage />}
        {activePublicPage === 'announcements' && <AnnouncementsPage />}
        {activePublicPage === 'history' && <HistoryPage />}

        {/* Admin Panel (Protected Route) */}
        {activePublicPage === 'admin' && (
          isAdminLoggedIn ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Admin Panel Protected
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                This section is restricted to tournament organizers. Public spectators and tournament players do not require accounts.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="w-full sm:w-auto px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-lg shadow-orange-950/40"
                >
                  Enter Admin Passkey
                </button>
                <button
                  onClick={() => navigateTo('home')}
                  className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg text-xs transition-colors border border-slate-800"
                >
                  Return to Public Home
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 pt-8 pb-20 sm:pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-slate-800/80">
            {/* Col 1: Brand & Identity */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white italic text-sm shadow-md shadow-orange-950/40">
                  P
                </div>
                <span className="font-bold text-base tracking-tight text-white uppercase font-['Chakra_Petch',sans-serif]">
                  PES <span className="text-orange-500 font-medium">TOURNAMENT</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                Official public tournament information platform for Pro Evolution Soccer championships. 
                Authoritative live standings, schedule, verified match results, golden boot race, and official announcements.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-orange-400 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Single Source of Truth • 100% Public Access</span>
              </div>
            </div>

            {/* Col 2: Public Navigation */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Tournament Hub
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => navigateTo('fixtures')} className="hover:text-orange-400 transition-colors">
                    Fixtures & Schedule
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('results')} className="hover:text-orange-400 transition-colors">
                    Match Results & Scores
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('standings')} className="hover:text-orange-400 transition-colors">
                    Official League Standings
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('players')} className="hover:text-orange-400 transition-colors">
                    Tournament Competitors
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('statistics')} className="hover:text-orange-400 transition-colors">
                    Golden Boot & Best Defence
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Guidelines & Operations */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                Rules & Governance
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>
                  <button onClick={() => navigateTo('rules')} className="hover:text-orange-400 transition-colors">
                    Tournament Rules Handbook
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('roadmap')} className="hover:text-orange-400 transition-colors">
                    Season Roadmap & Stages
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('history')} className="hover:text-orange-400 transition-colors">
                    Champions & Hall of Fame
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('announcements')} className="hover:text-orange-400 transition-colors">
                    Organizer Bulletins
                  </button>
                </li>
                <li className="pt-2 border-t border-slate-800">
                  <button
                    onClick={handleAdminAccess}
                    className="flex items-center gap-1.5 text-slate-500 hover:text-orange-400 transition-colors text-[11px]"
                  >
                    <Lock className="w-3 h-3" />
                    <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} PES Tournament Information Platform. Public spectator & competitor portal.
            </p>
            <div className="flex items-center gap-4">
              <span>All public tournament pages accessible without login.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Navigation */}
      <MobileNav />

      {/* Social Card Share Generator Modal (1200x630 Canvas) */}
      <ShareModal
        isOpen={!!shareModal?.isOpen}
        onClose={closeShareModal}
        payload={shareModal}
      />

      {/* Admin Passkey Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TournamentProvider>
      <MainLayout />
    </TournamentProvider>
  );
}
