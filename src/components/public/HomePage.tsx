import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import { 
  Trophy, 
  Calendar, 
  ArrowRight, 
  Share2, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Bell, 
  Sparkles,
  Award
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    selectedTournament, 
    matches, 
    players, 
    standings, 
    topScorers, 
    announcements, 
    roadmap, 
    navigateTo, 
    openShareModal 
  } = useTournament();

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  // Upcoming matches (next 3)
  const upcomingMatches = matches
    .filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`).getTime() - new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`).getTime())
    .slice(0, 3);

  // Latest completed results (last 3)
  const latestResults = matches
    .filter(m => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null)
    .sort((a, b) => new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`).getTime() - new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`).getTime())
    .slice(0, 3);

  // Pinned or latest announcements (first 2)
  const pinnedAnnouncements = announcements
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
    .slice(0, 2);

  // Top 4 teams in standings
  const topFourStandings = standings.slice(0, 4);

  // Top 3 Goal Scorers
  const topThreeScorers = topScorers.slice(0, 3);

  const currentStage = roadmap.find(r => r.status === 'current') || roadmap[0];

  return (
    <div className="space-y-4 pb-12">
      {/* Hero Tournament Banner (High Density Orange/Red Gradient with Geometric Accent Rings) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-red-800 p-6 sm:p-8 text-white shadow-xl border border-orange-500/50">
        {/* Geometric Accent Rings */}
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full border-[16px] border-white opacity-20 transform translate-x-1/4 -translate-y-1/4 pointer-events-none" />
        <div className="absolute right-12 top-12 h-40 w-40 rounded-full border-[8px] border-white opacity-10 pointer-events-none" />

        {/* Background Image subtle overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${selectedTournament?.bannerUrl || 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1200&auto=format&fit=crop&q=80'})` }}
        />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between min-h-[220px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-white/10 backdrop-blur px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border border-white/20 italic">
                {selectedTournament?.season || 'Season 1'}
              </span>
              <span className="bg-slate-950/40 backdrop-blur px-2 py-0.5 rounded text-[9px] font-black uppercase text-green-400 tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Status: Live Hub
              </span>
              <span className="hidden sm:inline-flex bg-slate-950/30 backdrop-blur px-2 py-0.5 rounded text-[9px] font-bold uppercase text-orange-200 tracking-wider">
                {selectedTournament?.game || 'PES Championship'}
              </span>
            </div>

            <button
              onClick={() => openShareModal({
                title: selectedTournament?.name || 'PES Tournament',
                subtitle: `Season 1 Live Standings & Results • Prize: ${selectedTournament?.prizePool}`,
                type: 'tournament'
              })}
              className="h-8 px-3 rounded-lg bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-300" />
              <span>Share</span>
            </button>
          </div>

          <div className="my-4 max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-black italic tracking-tighter uppercase font-['Chakra_Petch',sans-serif] leading-none drop-shadow-sm">
              {selectedTournament?.name || 'PES Premier League'}
            </h1>
            <p className="mt-2 text-orange-100/90 text-xs sm:text-sm leading-relaxed line-clamp-2 max-w-2xl">
              {selectedTournament?.description || 'The premier competitive PES tournament featuring top controller masters battling in full round-robin action for championship glory.'}
            </p>
          </div>

          {/* Quick Metrics & Meta in High-Density Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/20">
            <div className="bg-slate-950/40 backdrop-blur rounded-lg p-2.5 border border-white/10">
              <span className="text-[9px] font-bold uppercase text-orange-200 tracking-wider block">Format</span>
              <span className="text-sm sm:text-base font-bold text-white capitalize">{selectedTournament?.format || 'Round Robin'}</span>
            </div>
            <div className="bg-slate-950/40 backdrop-blur rounded-lg p-2.5 border border-white/10">
              <span className="text-[9px] font-bold uppercase text-orange-200 tracking-wider block">Prize Pool</span>
              <span className="text-sm sm:text-base font-bold text-white">{selectedTournament?.prizePool || '$1,500 USD'}</span>
            </div>
            <div className="bg-slate-950/40 backdrop-blur rounded-lg p-2.5 border border-white/10">
              <span className="text-[9px] font-bold uppercase text-orange-200 tracking-wider block">Stage</span>
              <span className="text-sm sm:text-base font-bold text-white truncate block">{currentStage?.title.split(':')[0] || 'League Phase'}</span>
            </div>
            <div className="bg-slate-950/40 backdrop-blur rounded-lg p-2.5 border border-white/10">
              <span className="text-[9px] font-bold uppercase text-orange-200 tracking-wider block">Competitors</span>
              <span className="text-sm sm:text-base font-bold text-white">{players.length} Active Players</span>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements Alert Bar (High Density Alert) */}
      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-2">
          {pinnedAnnouncements.map((ann) => (
            <div 
              key={ann.id}
              className="flex items-start sm:items-center justify-between gap-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-slate-200"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                  <Bell className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-white">{ann.title}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold uppercase">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{ann.content}</p>
                </div>
              </div>

              <button
                onClick={() => navigateTo('announcements')}
                className="shrink-0 text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 hover:underline"
              >
                <span>Read</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grid: Upcoming Matches & Latest Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Upcoming Fixtures */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-slate-200 font-bold">Upcoming Fixtures</span>
              </div>
              <button
                onClick={() => navigateTo('fixtures')}
                className="text-[10px] font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1 group"
              >
                <span>All Fixtures</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              {upcomingMatches.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No upcoming fixtures scheduled right now.</p>
              ) : (
                upcomingMatches.map((match) => {
                  const homePlayer = playerMap.get(match.homePlayerId);
                  const awayPlayer = playerMap.get(match.awayPlayerId);

                  return (
                    <div 
                      key={match.id}
                      className="p-2.5 sm:p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                        <span className="font-bold text-orange-400 uppercase tracking-wider">{match.roundName}</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {match.scheduledDate} • {match.scheduledTime}
                        </span>
                      </div>

                      <div className="grid grid-cols-11 items-center gap-2">
                        {/* Home */}
                        <div className="col-span-5 flex items-center gap-2 truncate">
                          <img 
                            src={homePlayer?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                            alt={homePlayer?.displayName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">{homePlayer?.displayName || 'Player'}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{homePlayer?.teamName}</span>
                          </div>
                        </div>

                        {/* VS badge */}
                        <div className="col-span-1 text-center">
                          <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded uppercase">
                            VS
                          </span>
                        </div>

                        {/* Away */}
                        <div className="col-span-5 flex items-center justify-end gap-2 text-right truncate">
                          <div className="truncate">
                            <span className="text-xs font-bold text-white block truncate">{awayPlayer?.displayName || 'Player'}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{awayPlayer?.teamName}</span>
                          </div>
                          <img 
                            src={awayPlayer?.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'} 
                            alt={awayPlayer?.displayName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Latest Results */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-slate-200 font-bold">Latest Results</span>
              </div>
              <button
                onClick={() => navigateTo('results')}
                className="text-[10px] font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1 group"
              >
                <span>All Results</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              {latestResults.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No completed matches yet.</p>
              ) : (
                latestResults.map((match) => {
                  const homePlayer = playerMap.get(match.homePlayerId);
                  const awayPlayer = playerMap.get(match.awayPlayerId);

                  return (
                    <div 
                      key={match.id}
                      className="p-2.5 sm:p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                        <span className="font-bold text-orange-400 uppercase tracking-wider">{match.roundName}</span>
                        <div className="flex items-center gap-2">
                          <span>{match.scheduledDate}</span>
                          <button
                            onClick={() => openShareModal({
                              title: `${homePlayer?.displayName} ${match.homeScore} - ${match.awayScore} ${awayPlayer?.displayName}`,
                              subtitle: `${match.roundName} • Official PES Tournament Result`,
                              type: 'match',
                              match,
                              homePlayer,
                              awayPlayer
                            })}
                            className="p-1 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded transition-colors"
                            title="Share this match result"
                          >
                            <Share2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-11 items-center gap-2">
                        {/* Home */}
                        <div className="col-span-4 flex items-center gap-2 truncate">
                          <img 
                            src={homePlayer?.profilePhoto} 
                            alt={homePlayer?.displayName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                          <span className="text-xs font-bold text-white truncate">{homePlayer?.displayName}</span>
                        </div>

                        {/* Score */}
                        <div className="col-span-3 text-center">
                          <span className="text-lg sm:text-xl font-black text-white px-2 py-0.5 bg-slate-900 border border-slate-800 rounded tracking-widest font-['Chakra_Petch',sans-serif]">
                            {match.homeScore} : {match.awayScore}
                          </span>
                        </div>

                        {/* Away */}
                        <div className="col-span-4 flex items-center justify-end gap-2 truncate text-right">
                          <span className="text-xs font-bold text-white truncate">{awayPlayer?.displayName}</span>
                          <img 
                            src={awayPlayer?.profilePhoto} 
                            alt={awayPlayer?.displayName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Standings & Top Scorers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* League Table Snapshot (High Density Table) */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-slate-200 font-bold">Current Standings (Top 4)</span>
            </div>
            <button
              onClick={() => navigateTo('standings')}
              className="text-[10px] font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1 group"
            >
              <span>Full Table</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[9px] uppercase tracking-wider text-slate-500 font-bold bg-slate-900/60">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Player</th>
                  <th className="py-2 px-2 text-center">P</th>
                  <th className="py-2 px-2 text-center">W</th>
                  <th className="py-2 px-2 text-center">D</th>
                  <th className="py-2 px-2 text-center">L</th>
                  <th className="py-2 px-2 text-center">GD</th>
                  <th className="py-2 px-3 text-right">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {topFourStandings.map((row) => (
                  <tr 
                    key={row.playerId}
                    onClick={() => navigateTo('player_profile', row.playerId)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors group ${
                      row.rank === 1 ? 'bg-orange-500/5' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] ${
                        row.rank === 1 ? 'bg-orange-600 text-white' : 
                        row.rank <= 4 ? 'bg-slate-800 text-orange-400 border border-orange-500/30' : 
                        'text-slate-400'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={row.player.profilePhoto} 
                          alt={row.player.displayName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div className="truncate">
                          <span className="font-bold text-white group-hover:text-orange-400 transition-colors block truncate">
                            {row.player.displayName}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {row.player.teamName}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-300 font-medium">{row.played}</td>
                    <td className="py-2.5 px-2 text-center text-green-400 font-medium">{row.won}</td>
                    <td className="py-2.5 px-2 text-center text-slate-400 font-medium">{row.drawn}</td>
                    <td className="py-2.5 px-2 text-center text-rose-400 font-medium">{row.lost}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-slate-200">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-black text-sm text-orange-400 font-['Chakra_Petch',sans-serif]">
                        {row.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Golden Boot Leaderboard (High Density Top Scorers) */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-slate-200 font-bold">Top Scorers</span>
              </div>
              <button
                onClick={() => navigateTo('statistics')}
                className="text-[10px] font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1 group"
              >
                <span>Full Stats</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="p-3 space-y-2">
              {topThreeScorers.map((scorer) => (
                <div
                  key={scorer.player.id}
                  onClick={() => navigateTo('player_profile', scorer.player.id)}
                  className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between hover:border-slate-700 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${
                      scorer.rank === 1 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {scorer.rank}
                    </span>
                    <img
                      src={scorer.player.profilePhoto}
                      alt={scorer.player.displayName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors block">
                        {scorer.player.displayName}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{scorer.player.teamName}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-orange-500 font-['Chakra_Petch',sans-serif] block leading-none">
                      {scorer.goals}
                    </span>
                    <span className="text-[9px] text-slate-400">{scorer.goalsPerMatch}/g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 pt-0 text-center">
            <button
              onClick={() => navigateTo('statistics')}
              className="w-full py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
            >
              Assists & Clean Sheets →
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap Pipeline Snapshot (High Density Timeline) */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="flex items-center justify-between bg-slate-800/50 px-4 py-2 border-b border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-slate-200 font-bold">Tournament Roadmap</span>
          </div>
          <button
            onClick={() => navigateTo('roadmap')}
            className="text-[10px] font-bold uppercase tracking-wider text-orange-400 hover:text-orange-300 flex items-center gap-1 group"
          >
            <span>Roadmap Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="p-3 grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {roadmap.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isCurrent = stage.status === 'current';

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-orange-500/10 border-orange-500/50 shadow-md shadow-orange-950/20'
                    : isCompleted
                    ? 'bg-slate-950/60 border-slate-800 opacity-90'
                    : 'bg-slate-950/30 border-slate-800/50 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Stage {stage.stageOrder}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                  ) : (
                    <Clock className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                <h3 className="font-bold text-xs text-white line-clamp-1">{stage.title}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{stage.description}</p>
                {stage.targetDate && (
                  <span className="inline-block mt-2 text-[9px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded border border-orange-500/20">
                    {stage.targetDate}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
