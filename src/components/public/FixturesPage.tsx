import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import { Calendar, Clock, MapPin, Share2, Search, Filter } from 'lucide-react';

export const FixturesPage: React.FC = () => {
  const { matches, players, selectedTournament, openShareModal, navigateTo } = useTournament();
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  // Get unique rounds from matches
  const rounds = Array.from(new Set(matches.map(m => m.round))).sort((a: number, b: number) => a - b);

  // Scheduled / upcoming matches
  const scheduledMatches = matches.filter(m => {
    if (m.status === 'completed') return false;
    if (selectedRound !== 'all' && m.round.toString() !== selectedRound) return false;
    if (searchQuery.trim()) {
      const home = playerMap.get(m.homePlayerId)?.displayName.toLowerCase() || '';
      const away = playerMap.get(m.awayPlayerId)?.displayName.toLowerCase() || '';
      const homeTeam = playerMap.get(m.homePlayerId)?.teamName.toLowerCase() || '';
      const awayTeam = playerMap.get(m.awayPlayerId)?.teamName.toLowerCase() || '';
      const q = searchQuery.toLowerCase();
      return home.includes(q) || away.includes(q) || homeTeam.includes(q) || awayTeam.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Official Schedule
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Tournament Fixtures
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            All upcoming and scheduled matches for {selectedTournament?.name}
          </p>
        </div>

        <button
          onClick={() => openShareModal({
            title: `${selectedTournament?.name} - Upcoming Fixtures`,
            subtitle: 'Check upcoming match dates, venues, and kick-off times',
            type: 'tournament'
          })}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Fixtures</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by player or team name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Round Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedRound('all')}
            className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap transition-colors ${
              selectedRound === 'all'
                ? 'bg-orange-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Rounds
          </button>
          {rounds.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRound(r.toString())}
              className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedRound === r.toString()
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Round {r}
            </button>
          ))}
        </div>
      </div>

      {/* Fixtures List */}
      {scheduledMatches.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-slate-900 border border-slate-800 p-6">
          <Calendar className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-slate-300">No scheduled fixtures match your filter</h3>
          <p className="text-xs text-slate-500 mt-1">Check past completed fixtures on the Results page.</p>
          <button
            onClick={() => { setSelectedRound('all'); setSearchQuery(''); }}
            className="mt-3 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scheduledMatches.map((match) => {
            const homePlayer = playerMap.get(match.homePlayerId);
            const awayPlayer = playerMap.get(match.awayPlayerId);

            return (
              <div
                key={match.id}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden hover:border-slate-700 transition-all shadow-md flex flex-col justify-between"
              >
                {/* Header info */}
                <div className="flex items-center justify-between bg-slate-800/50 px-3.5 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400">
                  <span className="text-orange-400 uppercase tracking-wider">
                    {match.roundName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {match.scheduledDate} • {match.scheduledTime}
                    </span>
                    <button
                      onClick={() => openShareModal({
                        title: `${homePlayer?.displayName} vs ${awayPlayer?.displayName}`,
                        subtitle: `${match.roundName} • ${match.scheduledDate} ${match.scheduledTime}`,
                        type: 'match',
                        match,
                        homePlayer,
                        awayPlayer
                      })}
                      className="p-0.5 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded transition-colors"
                      title="Share fixture"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Matchup Banner */}
                <div className="p-4 grid grid-cols-11 items-center gap-2">
                  {/* Home */}
                  <div 
                    onClick={() => homePlayer && navigateTo('player_profile', homePlayer.id)}
                    className="col-span-5 flex flex-col items-center text-center cursor-pointer group"
                  >
                    <img
                      src={homePlayer?.profilePhoto}
                      alt={homePlayer?.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-700 group-hover:border-orange-500 transition-colors shadow-md"
                    />
                    <span className="font-bold text-xs sm:text-sm text-white mt-1.5 group-hover:text-orange-400 transition-colors line-clamp-1">
                      {homePlayer?.displayName || 'Player A'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {homePlayer?.teamName}
                    </span>
                  </div>

                  {/* VS */}
                  <div className="col-span-1 flex flex-col items-center justify-center">
                    <span className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-300">
                      VS
                    </span>
                  </div>

                  {/* Away */}
                  <div 
                    onClick={() => awayPlayer && navigateTo('player_profile', awayPlayer.id)}
                    className="col-span-5 flex flex-col items-center text-center cursor-pointer group"
                  >
                    <img
                      src={awayPlayer?.profilePhoto}
                      alt={awayPlayer?.displayName}
                      className="w-12 h-12 rounded-full object-cover border border-slate-700 group-hover:border-orange-500 transition-colors shadow-md"
                    />
                    <span className="font-bold text-xs sm:text-sm text-white mt-1.5 group-hover:text-orange-400 transition-colors line-clamp-1">
                      {awayPlayer?.displayName || 'Player B'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {awayPlayer?.teamName}
                    </span>
                  </div>
                </div>

                {/* Footer Venue */}
                <div className="px-3.5 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{match.pitch || 'Official Stadium Arena'}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase text-[9px]">
                    Upcoming
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
