import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import {
  Trophy,
  Calendar,
  ArrowRight,
  Share2,
  Flame,
  CheckCircle2,
  Clock,
  ChevronRight,
  Bell,
  Sparkles,
  Award,
  Users,
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
    openShareModal,
  } = useTournament();

  const playerMap = new Map<string, Player>(players.map((p) => [p.id, p]));

  const upcomingMatches = matches
    .filter((m) => m.status === 'scheduled')
    .sort(
      (a, b) =>
        new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`).getTime() -
        new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`).getTime()
    )
    .slice(0, 3);

  const latestResults = matches
    .filter((m) => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null)
    .sort(
      (a, b) =>
        new Date(`${b.scheduledDate}T${b.scheduledTime || '00:00'}`).getTime() -
        new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`).getTime()
    )
    .slice(0, 3);

  const pinnedAnnouncements = [...announcements]
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
    .slice(0, 2);

  const topFourStandings = standings.slice(0, 4);
  const topThreeScorers = topScorers.slice(0, 3);

  const currentStage =
    roadmap.find((r) => r.status === 'current') || roadmap[0] || null;

  const completedMatches = matches.filter((m) => m.status === 'completed').length;

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
                Live Tournament Hub
              </span>

              {currentStage && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200">
                  <Sparkles className="h-3.5 w-3.5 text-orange-300" />
                  {currentStage.title}
                </span>
              )}
            </div>

            <button
              onClick={() =>
                openShareModal({
                  title: selectedTournament?.name || 'PES TOURNAMENT',
                  subtitle:
                    selectedTournament?.description ||
                    'Official public tournament information portal',
                  type: 'tournament',
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 text-orange-300" />
              Share
            </button>
          </div>

          <div className="mt-5 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-['Chakra_Petch',sans-serif] leading-[0.95]">
              {selectedTournament?.name || 'PES Tournament'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-orange-100/90 leading-relaxed">
              {selectedTournament?.description ||
                'Public tournament portal for fixtures, results, standings, statistics, rules, announcements and player profiles.'}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <StatCard label="Players" value={players.length} />
            <StatCard label="Matches" value={matches.length} />
            <StatCard label="Completed" value={completedMatches} />
            <StatCard label="Standings" value={standings.length} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <ActionButton text="Fixtures" onClick={() => navigateTo('fixtures')} />
            <ActionButton text="Results" onClick={() => navigateTo('results')} />
            <ActionButton text="Standings" onClick={() => navigateTo('standings')} />
            <ActionButton text="Players" onClick={() => navigateTo('players')} />
          </div>
        </div>
      </section>

      {/* Pinned announcements */}
      {pinnedAnnouncements.length > 0 && (
        <section className="space-y-2">
          {pinnedAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-orange-500/25 bg-orange-500/10 p-3 sm:p-4 text-slate-100"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-orange-500/15 p-2 text-orange-300">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-white">{ann.title}</span>
                    <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{ann.date}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs sm:text-sm text-slate-300">
                    {ann.content}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigateTo('announcements')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-orange-300 hover:text-orange-200"
              >
                Read <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </section>
      )}

      {/* Upcoming + Latest Results */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Upcoming Fixtures"
          icon={<Calendar className="h-4 w-4 text-orange-400" />}
          actionLabel="All Fixtures"
          onAction={() => navigateTo('fixtures')}
        >
          <div className="space-y-2">
            {upcomingMatches.length === 0 ? (
              <EmptyState text="No upcoming fixtures scheduled right now." />
            ) : (
              upcomingMatches.map((match) => {
                const homePlayer = playerMap.get(match.homePlayerId);
                const awayPlayer = playerMap.get(match.awayPlayerId);

                return (
                  <div
                    key={match.id}
                    className="rounded-2xl border border-white/5 bg-slate-950 p-3 transition-colors hover:border-white/10"
                  >
                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="text-orange-300">{match.roundName}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {match.scheduledDate} • {match.scheduledTime}
                      </span>
                    </div>

                    <div className="grid grid-cols-11 items-center gap-2">
                      <PlayerMiniCard
                        player={homePlayer}
                        align="left"
                        className="col-span-5"
                      />

                      <div className="col-span-1 text-center">
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-300">
                          VS
                        </span>
                      </div>

                      <PlayerMiniCard
                        player={awayPlayer}
                        align="right"
                        className="col-span-5"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>

        <Panel
          title="Latest Results"
          icon={<Flame className="h-4 w-4 text-orange-500" />}
          actionLabel="All Results"
          onAction={() => navigateTo('results')}
        >
          <div className="space-y-2">
            {latestResults.length === 0 ? (
              <EmptyState text="No completed matches yet." />
            ) : (
              latestResults.map((match) => {
                const homePlayer = playerMap.get(match.homePlayerId);
                const awayPlayer = playerMap.get(match.awayPlayerId);

                return (
                  <div
                    key={match.id}
                    className="rounded-2xl border border-white/5 bg-slate-950 p-3 transition-colors hover:border-white/10"
                  >
                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <span className="text-orange-300">{match.roundName}</span>
                      <span>{match.scheduledDate}</span>
                    </div>

                    <div className="grid grid-cols-11 items-center gap-2">
                      <PlayerMiniCard
                        player={homePlayer}
                        align="left"
                        className="col-span-4"
                      />

                      <div className="col-span-3 text-center">
                        <span className="inline-flex min-w-[92px] items-center justify-center rounded-2xl border border-white/10 bg-slate-900 px-3 py-2 text-lg font-black tracking-widest text-white font-['Chakra_Petch',sans-serif]">
                          {match.homeScore} : {match.awayScore}
                        </span>
                      </div>

                      <PlayerMiniCard
                        player={awayPlayer}
                        align="right"
                        className="col-span-4"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Panel>
      </section>

      {/* Standings + scorers */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel
          title="Standings Top 4"
          icon={<Trophy className="h-4 w-4 text-orange-400" />}
          actionLabel="Full Table"
          onAction={() => navigateTo('standings')}
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="py-2 px-2">#</th>
                  <th className="py-2 px-2">Player</th>
                  <th className="py-2 px-2 text-center">P</th>
                  <th className="py-2 px-2 text-center">W</th>
                  <th className="py-2 px-2 text-center">D</th>
                  <th className="py-2 px-2 text-center">L</th>
                  <th className="py-2 px-2 text-center">GD</th>
                  <th className="py-2 px-2 text-right">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {topFourStandings.map((row) => (
                  <tr
                    key={row.playerId}
                    onClick={() => navigateTo('player_profile', row.playerId)}
                    className="cursor-pointer transition-colors hover:bg-white/3"
                  >
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-black ${
                          row.rank === 1
                            ? 'bg-orange-500 text-slate-950'
                            : 'bg-white/5 text-orange-300'
                        }`}
                      >
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.player.profilePhoto || defaultAvatar(row.player.displayName)}
                          alt={row.player.displayName}
                          className="h-7 w-7 rounded-full object-cover border border-white/10"
                        />
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-white">
                            {row.player.displayName}
                          </div>
                          <div className="truncate text-[11px] text-slate-400">
                            {row.player.teamName || 'Player'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center text-slate-300">{row.played}</td>
                    <td className="py-3 px-2 text-center text-green-400">{row.won}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{row.drawn}</td>
                    <td className="py-3 px-2 text-center text-rose-400">{row.lost}</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-200">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-3 px-2 text-right font-black text-orange-300">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Top Scorers"
          icon={<Award className="h-4 w-4 text-orange-400" />}
          actionLabel="Full Stats"
          onAction={() => navigateTo('statistics')}
        >
          <div className="space-y-2">
            {topThreeScorers.length === 0 ? (
              <EmptyState text="No scoring data yet." />
            ) : (
              topThreeScorers.map((scorer) => (
                <button
                  key={scorer.player.id}
                  onClick={() => navigateTo('player_profile', scorer.player.id)}
                  className="w-full rounded-2xl border border-white/5 bg-slate-950 p-3 text-left transition-colors hover:border-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black ${
                          scorer.rank === 1
                            ? 'bg-orange-500 text-slate-950'
                            : 'bg-white/5 text-slate-200'
                        }`}
                      >
                        {scorer.rank}
                      </span>

                      <img
                        src={scorer.player.profilePhoto || defaultAvatar(scorer.player.displayName)}
                        alt={scorer.player.displayName}
                        className="h-8 w-8 rounded-full object-cover border border-white/10"
                      />

                      <div>
                        <div className="font-semibold text-white">
                          {scorer.player.displayName}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {scorer.player.teamName || 'Player'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-orange-400 font-['Chakra_Petch',sans-serif]">
                        {scorer.goals}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        goals
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </Panel>
      </section>

      {/* Roadmap */}
      <section className="rounded-3xl border border-white/5 bg-slate-900/80 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-orange-400" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
              Tournament Roadmap
            </h2>
          </div>
          <button
            onClick={() => navigateTo('roadmap')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-300 hover:text-orange-200"
          >
            Details <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 xl:grid-cols-5">
          {roadmap.map((stage) => {
            const isCurrent = stage.status === 'current';
            const isCompleted = stage.status === 'completed';

            return (
              <div
                key={stage.id}
                className={`rounded-2xl border p-3 ${
                  isCurrent
                    ? 'border-orange-500/40 bg-orange-500/10'
                    : isCompleted
                    ? 'border-white/5 bg-slate-950'
                    : 'border-white/5 bg-slate-950/60 opacity-80'
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Stage {stage.stageOrder}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  ) : isCurrent ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-400 animate-pulse" />
                  ) : (
                    <Clock className="h-4 w-4 text-slate-500" />
                  )}
                </div>

                <h3 className="text-sm font-bold text-white">{stage.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {stage.description}
                </p>

                {stage.targetDate && (
                  <span className="mt-2 inline-flex rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-300">
                    {stage.targetDate}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-200/90">
        {label}
      </div>
      <div className="mt-1 text-xl sm:text-2xl font-black text-white font-['Chakra_Petch',sans-serif]">
        {value}
      </div>
    </div>
  );
}

function ActionButton({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
    >
      {text}
    </button>
  );
}

function Panel({
  title,
  icon,
  actionLabel,
  onAction,
  children,
  className = '',
}: {
  title: string;
  icon: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-white/5 bg-slate-900 shadow-lg ${className}`}>
      <div className="flex items-center justify-between border-b border-white/5 bg-white/3 px-4 py-3">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
            {title}
          </h2>
        </div>

        <button
          onClick={onAction}
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-300 hover:text-orange-200"
        >
          {actionLabel} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-3">{children}</div>
    </div>
  );
}

function PlayerMiniCard({
  player,
  align,
  className = '',
}: {
  player?: Player;
  align: 'left' | 'right';
  className?: string;
}) {
  return (
    <div className={`${className} flex items-center gap-2 ${align === 'right' ? 'justify-end text-right' : ''}`}>
      {align === 'left' ? (
        <>
          <img
            src={player?.profilePhoto || defaultAvatar(player?.displayName)}
            alt={player?.displayName || 'Player'}
            className="h-8 w-8 rounded-full object-cover border border-white/10 shrink-0"
          />
          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-white">
              {player?.displayName || 'Player'}
            </div>
            <div className="truncate text-[10px] text-slate-400">
              {player?.teamName || 'Player'}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-white">
              {player?.displayName || 'Player'}
            </div>
            <div className="truncate text-[10px] text-slate-400">
              {player?.teamName || 'Player'}
            </div>
          </div>
          <img
            src={player?.profilePhoto || defaultAvatar(player?.displayName)}
            alt={player?.displayName || 'Player'}
            className="h-8 w-8 rounded-full object-cover border border-white/10 shrink-0"
          />
        </>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950 px-4 py-6 text-center text-xs text-slate-500">
      {text}
    </div>
  );
}

function defaultAvatar(name?: string) {
  const seed = encodeURIComponent(name || 'player');
  return `https://api.dicebear.com/7.x/thumbs/svg?seed=${seed}`;
}