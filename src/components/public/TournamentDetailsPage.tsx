import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Trophy, Calendar, Users, Award, ArrowRight, Share2, Shield, Clock, CheckCircle2 } from 'lucide-react';

export const TournamentDetailsPage: React.FC = () => {
  const { selectedTournament, players, navigateTo, openShareModal } = useTournament();

  const handleShare = () => {
    openShareModal({
      title: selectedTournament?.name || 'Tournament Details',
      subtitle: `${selectedTournament?.season} • Prize: ${selectedTournament?.prizePool}`,
      type: 'tournament',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url(${selectedTournament?.bannerUrl || 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1200'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative p-6 sm:p-10 z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                {selectedTournament?.status?.toUpperCase()}
              </span>
              <span className="px-3 py-1 text-xs font-semibold bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                {selectedTournament?.season}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-xl transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Tournament</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight leading-tight">
            {selectedTournament?.name}
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            {selectedTournament?.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo('fixtures')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-950/40"
            >
              View Fixtures Schedule
            </button>
            <button
              onClick={() => navigateTo('standings')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-colors"
            >
              View Standings Table
            </button>
            <button
              onClick={() => navigateTo('results')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition-colors"
            >
              View Results
            </button>
          </div>
        </div>
      </div>

      {/* Specifications & Game Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Clock className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-['Chakra_Petch',sans-serif]">
              Match Settings
            </h3>
          </div>
          <div className="mt-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Match Duration:</span>
              <span className="font-bold text-white">10 Mins (5m Halves)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Game Speed:</span>
              <span className="font-bold text-white">Normal (0)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Injuries:</span>
              <span className="font-bold text-emerald-400">ON</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Player Condition:</span>
              <span className="font-bold text-emerald-400">Normal (Green Arrows)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-['Chakra_Petch',sans-serif]">
              Prize Structure
            </h3>
          </div>
          <div className="mt-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">1st Place (Champion):</span>
              <span className="font-bold text-amber-400">$800 + Official Trophy</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">2nd Place (Runner-up):</span>
              <span className="font-bold text-slate-200">$400 + Silver Medal</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">3rd Place:</span>
              <span className="font-bold text-slate-300">$200 + Bronze Medal</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Golden Boot (Top Scorer):</span>
              <span className="font-bold text-amber-400">$100 Special Award</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm text-white uppercase tracking-wider font-['Chakra_Petch',sans-serif]">
              Competition Format
            </h3>
          </div>
          <div className="mt-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Structure:</span>
              <span className="font-bold text-white">Round Robin League</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Championship Cutoff:</span>
              <span className="font-bold text-emerald-400">Top 4 Teams Advance</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Points System:</span>
              <span className="font-bold text-white">Win 3 • Draw 1 • Loss 0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Tie Breakers:</span>
              <span className="font-bold text-slate-200">GD, GF, Head-to-Head</span>
            </div>
          </div>
        </div>
      </div>

      {/* Participating Players Roster */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="font-bold text-lg text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
              Tournament Competitors ({players.length})
            </h2>
            <p className="text-xs text-slate-400">All registered controller athletes in this tournament</p>
          </div>
          <button
            onClick={() => navigateTo('players')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>All Profiles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {players.map((p) => (
            <div
              key={p.id}
              onClick={() => navigateTo('player_profile', p.id)}
              className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-3 hover:border-emerald-500/50 cursor-pointer transition-colors"
            >
              <img
                src={p.profilePhoto}
                alt={p.displayName}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">{p.displayName}</span>
                <span className="text-[11px] text-slate-400 block truncate">{p.teamName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
