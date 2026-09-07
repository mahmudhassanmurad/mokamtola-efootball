import React, { useMemo, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import {
  Trophy,
  Clock,
  Share2,
  Search,
  MapPin,
  CalendarDays,
  Flame,
  Medal,
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { matches, players, selectedTournament, openShareModal, navigateTo } = useTournament();
  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const playerMap = useMemo(
    () => new Map<string, Player>(players.map((p) => [p.id, p])),
    [players]
  );

  const rounds = useMemo(() => {
    return Array.from(
      new Set(matches.filter((m) => m.status === 'completed').map((m) => m.round))
    ).sort((a, b) => a - b);
  }, [matches]);

  const completedMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return matches
      .filter((m) => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null)
      .filter((m) => {
        if (selectedRound !== 'all' && m.round.toString() !== selectedRound) return false;

        if (!q) return true;

        const home = playerMap.get(m.homePlayerId);
        const away = playerMap.get(m.awayPlayerId);

        const homeName = home?.displayName?.toLowerCase() || '';
        const awayName = away?.displayName?.toLowerCase() || '';
        const homeTeam = home?.teamName?.toLowerCase() || '';
        const awayTeam = away?.teamName?.toLowerCase() || '';
        const roundName = m.roundName?.toLowerCase() || '';
        const pitch = m.pitch?.toLowerCase() || '';

        return (
          homeName.includes(q) ||
          awayName.includes(q) ||
          homeTeam.includes(q) ||
          awayTeam.includes(q) ||
          roundName.includes(q) ||
          pitch.includes(q)
        );
      })
      .sort((a, b) => {
        const aTime = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`).getTime();
        const bTime = new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`).getTime();
        return bTime - aTime;
      });
  }, [matches, playerMap, selectedRound, searchQuery]);

  const totalGoals = useMemo(() => {
    return completedMatches.reduce((sum, match) => {
      return sum + Number(match.homeScore || 0) + Number(match.awayScore || 0);
    }, 0);
  }, [completedMatches]);

  const avgGoals = completedMatches.length > 0
    ? (totalGoals / completedMatches.length).toFixed(2)
    : '0.00';

  const topResult = useMemo(() => {
    if (completedMatches.length === 0) return null;
    return [...completedMatches].sort((a, b) => {
      const aGoals = Number(a.homeScore || 0) + Number(a.awayScore || 0);
      const bGoals = Number(b.homeScore || 0) + Number(b.awayScore || 0);
      return bGoals - aGoals;
    })[0];
  }, [completedMatches]);

  return (
    <div className="space-y-4 pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 shadow-2xl">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
        </div>

        <div className="relative p-5 sm:p-7 lg:p-8 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-orange-300">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Official Results
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200">
                <Flame className="h-3.5 w-3.5 text-orange-300" />
                Verified Match Scores
              </span>
            </div>

            <button
              onClick={() =>
                openShareModal({
                  title: `${selectedTournament?.name || 'PES Tournament'} - Results`,
                  subtitle: 'Official completed match results and score records',
                  type: 'standings',
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 text-orange-300" />
              Share Results
            </button>
          </div>

          <div className="mt-5 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-['Chakra_Petch',sans-serif] leading-[0.95]">
              Match Results
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-orange-100/90 leading-relaxed">
              Authoritative final scores, goal timelines, and match records for{' '}
              <span className="font-semibold text-white">
                {selectedTournament?.name || 'PES Tournament'}
              </span>
              .
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label="Completed" value={completedMatches.length} />
            <MiniStat label="Rounds" value={rounds.length} />
            <MiniStat label="Goals" value={totalGoals} />
            <MiniStat label="Avg / Match" value={avgGoals} />
          </div>

          {topResult && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">
                <Medal className="h-4 w-4 text-orange-300" />
                Highest scoring result
              </div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {topResult.roundName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-300">
                    {topResult.scheduledDate} • {topResult.homeScore} - {topResult.awayScore}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('fixtures')}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/5"
                >
                  View Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Search + Filters */}
      <section className="rounded-3xl border border-white/5 bg-slate-900 shadow-lg p-3 sm:p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-orange-400" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
            Filter Results
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by player, team, round or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-white/5 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
            <FilterChip
              active={selectedRound === 'all'}
              onClick={() => setSelectedRound('all')}
              label="All Rounds"
            />

            {rounds.map((r) => (
              <FilterChip
                key={r}
                active={selectedRound === r.toString()}
                onClick={() => setSelectedRound(r.toString())}
                label={`Round ${r}`}
              />
            ))}
          </div>
        </div>

        {(selectedRound !== 'all' || searchQuery.trim()) && (
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/5 bg-white/3 px-4 py-3">
            <div className="text-xs text-slate-300">
              Showing <span className="font-bold text-white">{completedMatches.length}</span> results
            </div>
            <button
              onClick={() => {
                setSelectedRound('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold uppercase tracking-wider text-orange-300 hover:text-orange-200"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Results List */}
      {completedMatches.length === 0 ? (
        <EmptyState
          title="No match results found"
          text="Try changing the round filter or search query."
        />
      ) : (
        <div className="space-y-3">
          {completedMatches.map((match) => {
            const homePlayer = playerMap.get(match.homePlayerId);
            const awayPlayer = playerMap.get(match.awayPlayerId);

            const isHomeWinner = Number(match.homeScore || 0) > Number(match.awayScore || 0);
            const isAwayWinner = Number(match.awayScore || 0) > Number(match.homeScore || 0);

            const events = (match.events || []) as any[];
            const homeGoals = events.filter(
              (e) =>
                e?.type === 'goal' &&
                (e?.team === 'home' || e?.playerId === match.homePlayerId)
            );
            const awayGoals = events.filter(
              (e) =>
                e?.type === 'goal' &&
                (e?.team === 'away' || e?.playerId === match.awayPlayerId)
            );

            return (
              <article
                key={match.id}
                className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-lg transition-colors hover:border-white/10"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 bg-white/3 px-4 py-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-300">
                      {match.roundName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {match.scheduledDate} • {match.scheduledTime || 'TBD'}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      openShareModal({
                        title: `${homePlayer?.displayName || 'Player'} ${match.homeScore} - ${match.awayScore} ${awayPlayer?.displayName || 'Player'}`,
                        subtitle: `${match.roundName} • Official PES Result`,
                        type: 'match',
                        match,
                        homePlayer,
                        awayPlayer,
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/5 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-colors hover:text-white hover:bg-white/5"
                  >
                    <Share2 className="h-3.5 w-3.5 text-orange-300" />
                    Share
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  {/* Scoreboard */}
                  <div className="grid grid-cols-11 items-center gap-2">
                    <TeamCard
                      player={homePlayer}
                      align="left"
                      className="col-span-4 sm:col-span-5"
                      onClick={() => homePlayer && navigateTo('player_profile', homePlayer.id)}
                      highlighted={isHomeWinner}
                    />

                    <div className="col-span-3 sm:col-span-1 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 sm:px-4">
                        <span className={`text-2xl sm:text-3xl font-black font-['Chakra_Petch',sans-serif] ${isHomeWinner ? 'text-orange-400' : 'text-white'}`}>
                          {match.homeScore}
                        </span>
                        <span className="text-slate-600 font-bold text-sm">:</span>
                        <span className={`text-2xl sm:text-3xl font-black font-['Chakra_Petch',sans-serif] ${isAwayWinner ? 'text-orange-400' : 'text-white'}`}>
                          {match.awayScore}
                        </span>
                      </div>
                    </div>

                    <TeamCard
                      player={awayPlayer}
                      align="right"
                      className="col-span-4 sm:col-span-5"
                      onClick={() => awayPlayer && navigateTo('player_profile', awayPlayer.id)}
                      highlighted={isAwayWinner}
                    />
                  </div>

                  {/* Timeline */}
                  {(homeGoals.length > 0 || awayGoals.length > 0 || match.notes) && (
                    <div className="mt-4 rounded-2xl border border-white/5 bg-slate-950 p-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1">
                          {homeGoals.map((e, idx) => (
                            <div key={e.id || idx} className="flex items-center gap-2 text-sm text-slate-300">
                              <span className="w-9 font-mono text-[10px] font-bold text-orange-300">
                                {e.minute}'
                              </span>
                              <span className="text-white">⚽ {homePlayer?.displayName || 'Home'}</span>
                              {e.isPenalty && (
                                <span className="rounded bg-amber-950/60 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                                  PEN
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1 sm:text-right">
                          {awayGoals.map((e, idx) => (
                            <div key={e.id || idx} className="flex items-center gap-2 text-sm text-slate-300 sm:justify-end">
                              <span className="text-white">⚽ {awayPlayer?.displayName || 'Away'}</span>
                              {e.isPenalty && (
                                <span className="rounded bg-amber-950/60 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                                  PEN
                                </span>
                              )}
                              <span className="w-9 text-right font-mono text-[10px] font-bold text-orange-300">
                                {e.minute}'
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {match.notes && (
                        <p className="mt-3 border-t border-white/5 pt-2 text-xs italic text-slate-400">
                          "{match.notes}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-white/3 px-4 py-3 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 text-orange-400" />
                    {match.pitch || 'Official Stadium Arena'}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-400" />
                    Match ID: {match.id}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-200/90">
        {label}
      </div>
      <div className="mt-1 text-lg sm:text-2xl font-black text-white font-['Chakra_Petch',sans-serif] truncate">
        {value}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
        active
          ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950/20'
          : 'border border-white/5 bg-slate-950 text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}

function TeamCard({
  player,
  align,
  className = '',
  onClick,
  highlighted = false,
}: {
  player?: Player;
  align: 'left' | 'right';
  className?: string;
  onClick: () => void;
  highlighted?: boolean;
}) {
  if (!player) {
    return (
      <div className={`${className} flex items-center gap-3 ${align === 'right' ? 'justify-end text-right' : ''}`}>
        {align === 'left' ? (
          <>
            <div className="h-12 w-12 shrink-0 rounded-full border border-dashed border-white/10 bg-slate-950" />
            <div className="min-w-0">
              <div className="text-sm font-bold text-white">TBD</div>
              <div className="text-[11px] text-slate-400">Waiting for player</div>
            </div>
          </>
        ) : (
          <>
            <div className="min-w-0 text-right">
              <div className="text-sm font-bold text-white">TBD</div>
              <div className="text-[11px] text-slate-400">Waiting for player</div>
            </div>
            <div className="h-12 w-12 shrink-0 rounded-full border border-dashed border-white/10 bg-slate-950" />
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${className} group flex items-center gap-3 ${align === 'right' ? 'justify-end text-right' : ''}`}
    >
      {align === 'left' ? (
        <>
          <img
            src={player.profilePhoto || defaultAvatar(player.displayName)}
            alt={player.displayName}
            className={`h-12 w-12 shrink-0 rounded-full object-cover border transition-colors ${
              highlighted ? 'border-orange-500' : 'border-white/10'
            }`}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
              {player.displayName}
            </div>
            <div className="truncate text-[11px] text-slate-400">
              {player.teamName || 'Player'}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
              {player.displayName}
            </div>
            <div className="truncate text-[11px] text-slate-400">
              {player.teamName || 'Player'}
            </div>
          </div>
          <img
            src={player.profilePhoto || defaultAvatar(player.displayName)}
            alt={player.displayName}
            className={`h-12 w-12 shrink-0 rounded-full object-cover border transition-colors ${
              highlighted ? 'border-orange-500' : 'border-white/10'
            }`}
          />
        </>
      )}
    </button>
  );
}

function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 px-4 py-10 text-center">
      <Trophy className="mx-auto h-10 w-10 text-slate-600" />
      <h3 className="mt-3 text-base font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{text}</p>
    </div>
  );
}

function defaultAvatar(name?: string) {
  const seed = encodeURIComponent(name || 'player');
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
}