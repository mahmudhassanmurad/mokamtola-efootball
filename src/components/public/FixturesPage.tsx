import React, { useMemo, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Search,
  Filter,
  ChevronRight,
  CalendarDays,
  Users,
} from 'lucide-react';

export const FixturesPage: React.FC = () => {
  const { matches, players, selectedTournament, openShareModal, navigateTo } = useTournament();

  const [selectedRound, setSelectedRound] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const playerMap = useMemo(
    () => new Map<string, Player>(players.map((p) => [p.id, p])),
    [players]
  );

  const rounds = useMemo(() => {
    return Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  }, [matches]);

  const scheduledMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return matches
      .filter((m) => m.status !== 'completed')
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
        return aTime - bTime;
      });
  }, [matches, playerMap, selectedRound, searchQuery]);

  const stats = useMemo(() => {
    return {
      totalScheduled: matches.filter((m) => m.status !== 'completed').length,
      totalRounds: rounds.length,
      totalPlayers: players.length,
      filtered: scheduledMatches.length,
    };
  }, [matches, players.length, rounds.length, scheduledMatches.length]);

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
                Official Schedule
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200">
                <CalendarDays className="h-3.5 w-3.5 text-orange-300" />
                Upcoming Fixtures
              </span>
            </div>

            <button
              onClick={() =>
                openShareModal({
                  title: `${selectedTournament?.name || 'PES Tournament'} - Fixtures`,
                  subtitle: 'Check upcoming match dates, times and pairings',
                  type: 'tournament',
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 text-orange-300" />
              Share Fixtures
            </button>
          </div>

          <div className="mt-5 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-['Chakra_Petch',sans-serif] leading-[0.95]">
              Tournament Fixtures
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-orange-100/90 leading-relaxed">
              All upcoming and scheduled matches for{' '}
              <span className="font-semibold text-white">
                {selectedTournament?.name || 'PES Tournament'}
              </span>
              .
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label="Scheduled" value={stats.totalScheduled} />
            <MiniStat label="Rounds" value={stats.totalRounds} />
            <MiniStat label="Players" value={stats.totalPlayers} />
            <MiniStat label="Visible" value={stats.filtered} />
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="rounded-3xl border border-white/5 bg-slate-900 shadow-lg p-3 sm:p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-orange-400" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
            Filter Fixtures
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
              Showing <span className="font-bold text-white">{scheduledMatches.length}</span> fixtures
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

      {/* Fixtures List */}
      {scheduledMatches.length === 0 ? (
        <EmptyState
          title="No scheduled fixtures found"
          text="Try changing the filter or search terms."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {scheduledMatches.map((match) => {
            const homePlayer = playerMap.get(match.homePlayerId);
            const awayPlayer = playerMap.get(match.awayPlayerId);

            return (
              <article
                key={match.id}
                className="overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-lg transition-colors hover:border-white/10"
              >
                <div className="flex items-center justify-between border-b border-white/5 bg-white/3 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-300">
                      {match.roundName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Round {match.round}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      openShareModal({
                        title: `${homePlayer?.displayName || 'Player'} vs ${awayPlayer?.displayName || 'Player'}`,
                        subtitle: `${match.roundName} • ${match.scheduledDate} ${match.scheduledTime || ''}`,
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
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950 px-3 py-2.5 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-orange-400" />
                      {match.scheduledDate} • {match.scheduledTime || 'TBD'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-orange-400" />
                      {match.pitch || 'Official Stadium Arena'}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-11 items-center gap-2">
                    <TeamCard
                      player={homePlayer}
                      align="left"
                      className="col-span-5"
                      onClick={() => homePlayer && navigateTo('player_profile', homePlayer.id)}
                    />

                    <div className="col-span-1 flex items-center justify-center">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-wider text-slate-300">
                        VS
                      </span>
                    </div>

                    <TeamCard
                      player={awayPlayer}
                      align="right"
                      className="col-span-5"
                      onClick={() => awayPlayer && navigateTo('player_profile', awayPlayer.id)}
                    />
                  </div>
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
      <div className="mt-1 text-lg sm:text-2xl font-black text-white font-['Chakra_Petch',sans-serif]">
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
}: {
  player?: Player;
  align: 'left' | 'right';
  className?: string;
  onClick: () => void;
}) {
  const content = (
    <>
      {align === 'left' ? (
        <>
          <img
            src={player?.profilePhoto || defaultAvatar(player?.displayName)}
            alt={player?.displayName || 'Player'}
            className="h-12 w-12 shrink-0 rounded-full object-cover border border-white/10"
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
              {player?.displayName || 'Player'}
            </div>
            <div className="truncate text-[11px] text-slate-400">
              {player?.teamName || 'Player'}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-w-0 text-right">
            <div className="truncate text-sm font-bold text-white group-hover:text-orange-300 transition-colors">
              {player?.displayName || 'Player'}
            </div>
            <div className="truncate text-[11px] text-slate-400">
              {player?.teamName || 'Player'}
            </div>
          </div>
          <img
            src={player?.profilePhoto || defaultAvatar(player?.displayName)}
            alt={player?.displayName || 'Player'}
            className="h-12 w-12 shrink-0 rounded-full object-cover border border-white/10"
          />
        </>
      )}
    </>
  );

  if (!player) {
    return (
      <div className={`${className} flex items-center gap-3 ${align === 'right' ? 'justify-end' : ''}`}>
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
      {content}
    </button>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 px-4 py-10 text-center">
      <Calendar className="mx-auto h-10 w-10 text-slate-600" />
      <h3 className="mt-3 text-base font-bold text-white">{title}</h3>
      <p className="mt-1 text-sm text-slate-400">{text}</p>
    </div>
  );
}

function defaultAvatar(name?: string) {
  const seed = encodeURIComponent(name || 'player');
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
}