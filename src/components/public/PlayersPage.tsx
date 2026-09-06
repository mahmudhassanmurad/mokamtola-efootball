import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Search, Shield, ArrowUpRight, Trophy, Goal, Award } from 'lucide-react';

export const PlayersPage: React.FC = () => {
  const { players, matches, navigateTo } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = players.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.displayName.toLowerCase().includes(q) || 
           p.fullName.toLowerCase().includes(q) || 
           p.teamName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Tournament Roster
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Tournament Players
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            All approved tournament competitors. Click any player to inspect public profile & stats.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by player or club name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Player Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredPlayers.map((player) => {
          // Calculate quick stats
          const playerMatches = matches.filter(
            m => m.status === 'completed' && (m.homePlayerId === player.id || m.awayPlayerId === player.id)
          );
          const wins = playerMatches.filter(m => {
            const isHome = m.homePlayerId === player.id;
            return isHome ? (m.homeScore || 0) > (m.awayScore || 0) : (m.awayScore || 0) > (m.homeScore || 0);
          }).length;
          
          let totalGoals = 0;
          playerMatches.forEach(m => {
            if (m.homePlayerId === player.id) totalGoals += (m.homeScore || 0);
            if (m.awayPlayerId === player.id) totalGoals += (m.awayScore || 0);
          });

          return (
            <div
              key={player.id}
              onClick={() => navigateTo('player_profile', player.id)}
              className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 hover:border-orange-500/50 hover:bg-slate-850 transition-all cursor-pointer group shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="relative mb-3 flex justify-center">
                  <div className="relative">
                    <img
                      src={player.profilePhoto}
                      alt={player.displayName}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-700 group-hover:border-orange-400 transition-all shadow-md group-hover:scale-105"
                    />
                    <span className="absolute -bottom-1.5 -right-1.5 text-lg bg-slate-950 border border-slate-800 rounded-md px-1 py-0.5">
                      {player.teamLogo || '⚽'}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="font-extrabold text-sm text-white group-hover:text-orange-400 transition-colors font-['Chakra_Petch',sans-serif] tracking-wide">
                      {player.displayName}
                    </h3>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs font-semibold text-orange-400 mt-0.5">{player.teamName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{player.fullName}</p>
                </div>

                {player.bio && (
                  <p className="text-[11px] text-slate-400 mt-2.5 text-center line-clamp-2 italic bg-slate-950 p-2 rounded-lg border border-slate-800">
                    "{player.bio}"
                  </p>
                )}
              </div>

              {/* Quick Stat Bar */}
              <div className="mt-3 pt-2.5 border-t border-slate-800 grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-slate-950 py-1 rounded border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">Played</span>
                  <span className="text-xs font-bold text-white">{playerMatches.length}</span>
                </div>
                <div className="bg-slate-950 py-1 rounded border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">Wins</span>
                  <span className="text-xs font-bold text-green-400">{wins}</span>
                </div>
                <div className="bg-slate-950 py-1 rounded border border-slate-800/80">
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">Goals</span>
                  <span className="text-xs font-bold text-orange-400">{totalGoals}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
