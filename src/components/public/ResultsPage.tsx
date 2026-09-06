import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import { Trophy, Clock, Share2, Search, Award, MapPin } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { matches, players, selectedTournament, openShareModal, navigateTo } = useTournament();
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  const completedMatches = matches.filter(m => {
    if (m.status !== 'completed' || m.homeScore === null || m.awayScore === null) return false;
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
  }).sort((a, b) => new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`).getTime() - new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`).getTime());

  const rounds = Array.from(new Set(matches.filter(m => m.status === 'completed').map(m => m.round))).sort((a: number, b: number) => a - b);

  return (
    <div className="space-y-4 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Official Results
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Match Results
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Authoritative scores, goal timeline, assists and match reports
          </p>
        </div>

        <button
          onClick={() => openShareModal({
            title: `${selectedTournament?.name} - Latest Results`,
            subtitle: 'Authoritative scores and goal records from the championship',
            type: 'standings'
          })}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Results</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
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

      {/* Results Feed */}
      {completedMatches.length === 0 ? (
        <div className="text-center py-12 rounded-xl bg-slate-900 border border-slate-800 p-6">
          <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-slate-300">No match results found</h3>
          <p className="text-xs text-slate-500 mt-1">Try changing your search query or round filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {completedMatches.map((match) => {
            const homePlayer = playerMap.get(match.homePlayerId);
            const awayPlayer = playerMap.get(match.awayPlayerId);
            const isHomeWinner = (match.homeScore || 0) > (match.awayScore || 0);
            const isAwayWinner = (match.awayScore || 0) > (match.homeScore || 0);

            // Separate goal events
            const homeGoals = (match.events || []).filter(e => e.type === 'goal' && (e.team === 'home' || e.playerId === match.homePlayerId));
            const awayGoals = (match.events || []).filter(e => e.type === 'goal' && (e.team === 'away' || e.playerId === match.awayPlayerId));

            return (
              <div
                key={match.id}
                className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md hover:border-slate-700 transition-all"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between bg-slate-800/50 px-3.5 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-400 uppercase tracking-wider">
                      {match.roundName}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>{match.scheduledDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-orange-500/15 border border-orange-500/30 text-orange-300 text-[9px] font-bold uppercase tracking-wider">
                      Official Final
                    </span>
                    <button
                      onClick={() => openShareModal({
                        title: `${homePlayer?.displayName} ${match.homeScore} - ${match.awayScore} ${awayPlayer?.displayName}`,
                        subtitle: `${match.roundName} • Official PES Match Result`,
                        type: 'match',
                        match,
                        homePlayer,
                        awayPlayer
                      })}
                      className="p-0.5 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded transition-colors"
                      title="Share Match Result Card"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Scoreboard */}
                <div className="p-4 grid grid-cols-11 items-center gap-2">
                  {/* Home Player */}
                  <div 
                    onClick={() => homePlayer && navigateTo('player_profile', homePlayer.id)}
                    className="col-span-4 flex items-center gap-2.5 cursor-pointer group truncate"
                  >
                    <img
                      src={homePlayer?.profilePhoto}
                      alt={homePlayer?.displayName}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border shrink-0 transition-colors shadow-sm ${
                        isHomeWinner ? 'border-orange-500' : 'border-slate-700'
                      }`}
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold text-xs sm:text-sm transition-colors truncate block group-hover:text-orange-400 ${
                          isHomeWinner ? 'text-white font-black' : 'text-slate-300'
                        }`}>
                          {homePlayer?.displayName}
                        </span>
                        {isHomeWinner && (
                          <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            WIN
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {homePlayer?.teamName}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-3 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 sm:gap-3 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg">
                      <span className={`text-xl sm:text-2xl font-black font-['Chakra_Petch',sans-serif] ${
                        isHomeWinner ? 'text-orange-400' : 'text-slate-100'
                      }`}>
                        {match.homeScore}
                      </span>
                      <span className="text-slate-600 font-bold text-sm">:</span>
                      <span className={`text-xl sm:text-2xl font-black font-['Chakra_Petch',sans-serif] ${
                        isAwayWinner ? 'text-orange-400' : 'text-slate-100'
                      }`}>
                        {match.awayScore}
                      </span>
                    </div>
                  </div>

                  {/* Away Player */}
                  <div 
                    onClick={() => awayPlayer && navigateTo('player_profile', awayPlayer.id)}
                    className="col-span-4 flex items-center justify-end gap-2.5 cursor-pointer group text-right truncate"
                  >
                    <div className="truncate">
                      <div className="flex items-center justify-end gap-1.5">
                        {isAwayWinner && (
                          <span className="hidden sm:inline-block text-[9px] font-bold px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            WIN
                          </span>
                        )}
                        <span className={`font-bold text-xs sm:text-sm transition-colors truncate block group-hover:text-orange-400 ${
                          isAwayWinner ? 'text-white font-black' : 'text-slate-300'
                        }`}>
                          {awayPlayer?.displayName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {awayPlayer?.teamName}
                      </span>
                    </div>
                    <img
                      src={awayPlayer?.profilePhoto}
                      alt={awayPlayer?.displayName}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border shrink-0 transition-colors shadow-sm ${
                        isAwayWinner ? 'border-orange-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                </div>

                {/* Goals & Timeline Breakdown */}
                {((match.events && match.events.length > 0) || match.notes) && (
                  <div className="mx-3 mb-3 p-2.5 bg-slate-950 border border-slate-800 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Home events */}
                      <div className="space-y-1">
                        {homeGoals.map(e => (
                          <div key={e.id} className="flex items-center gap-2 text-slate-300">
                            <span className="text-orange-400 font-bold font-mono text-[10px] w-7">
                              {e.minute}'
                            </span>
                            <span className="text-white text-xs font-medium">⚽ {homePlayer?.displayName}</span>
                            {e.isPenalty && (
                              <span className="text-[9px] text-amber-400 font-bold bg-amber-950/60 px-1 rounded">
                                (P)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Away events */}
                      <div className="space-y-1 sm:text-right">
                        {awayGoals.map(e => (
                          <div key={e.id} className="flex items-center sm:justify-end gap-2 text-slate-300">
                            <span className="text-white text-xs font-medium">⚽ {awayPlayer?.displayName}</span>
                            {e.isPenalty && (
                              <span className="text-[9px] text-amber-400 font-bold bg-amber-950/60 px-1 rounded">
                                (P)
                              </span>
                            )}
                            <span className="text-orange-400 font-bold font-mono text-[10px] w-7 text-right">
                              {e.minute}'
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {match.notes && (
                      <p className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 italic">
                        "{match.notes}"
                      </p>
                    )}
                  </div>
                )}

                {/* Footer Venue */}
                <div className="px-3.5 py-1.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {match.pitch || 'Santiago Bernabéu Stadium'}
                  </span>
                  <span>Match ID: {match.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
