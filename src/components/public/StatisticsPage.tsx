import React, { useMemo, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  Trophy,
  Award,
  ShieldCheck,
  Flame,
  Target,
  Sparkles,
  Share2,
  Users,
  BarChart3,
  ChevronRight,
  Medal,
} from 'lucide-react';

type StatTab = 'scorers' | 'assists' | 'defence' | 'cleansheets' | 'overview';

export const StatisticsPage: React.FC = () => {
  const {
    topScorers,
    topAssists,
    bestDefence,
    standings,
    tournamentStats,
    selectedTournament,
    openShareModal,
    navigateTo,
  } = useTournament();

  const [activeTab, setActiveTab] = useState<StatTab>('scorers');

  const cleanSheetsList = useMemo(() => {
    return [...standings].sort((a, b) => {
      if (b.cleanSheets !== a.cleanSheets) return b.cleanSheets - a.cleanSheets;
      return a.goalsAgainst - b.goalsAgainst;
    });
  }, [standings]);

  const tabs: { id: StatTab; label: string; icon: React.ReactNode }[] = [
    { id: 'scorers', label: 'Goal Scorers', icon: <Target className="w-4 h-4" /> },
    { id: 'assists', label: 'Assists', icon: <Award className="w-4 h-4" /> },
    { id: 'defence', label: 'Best Defence', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'cleansheets', label: 'Clean Sheets', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  ];

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
                Tournament Analytics
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200">
                <Users className="h-3.5 w-3.5 text-orange-300" />
                Public Leaderboards
              </span>
            </div>

            <button
              onClick={() =>
                openShareModal({
                  title: `${selectedTournament?.name || 'PES Tournament'} - Statistics`,
                  subtitle: 'Golden Boot, assists, defence and clean sheet leaderboards',
                  type: 'standings',
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 text-orange-300" />
              Share Stats
            </button>
          </div>

          <div className="mt-5 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-['Chakra_Petch',sans-serif] leading-[0.95]">
              Player & Team Statistics
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-orange-100/90 leading-relaxed">
              Official leaderboards calculated from match results and event data only.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label="Total Matches" value={tournamentStats.totalMatches} />
            <MiniStat label="Completed" value={tournamentStats.totalCompleted} />
            <MiniStat label="Total Goals" value={tournamentStats.totalGoals} />
            <MiniStat label="Avg Goals / Match" value={tournamentStats.avgGoalsPerMatch} />
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                active
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950/20'
                  : 'border border-white/5 bg-slate-900 text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scorers */}
      {activeTab === 'scorers' && (
        <LeaderboardPanel
          title="Golden Boot Leaderboard"
          subtitle="Top scorers ranked by tournament goals"
          icon={<Target className="w-4 h-4 text-orange-400" />}
          actionText="View Player Profiles"
          onAction={() => navigateTo('players')}
        >
          <div className="space-y-2">
            {topScorers.length === 0 ? (
              <EmptyState text="No scoring data available yet." />
            ) : (
              topScorers.map((row) => (
                <StatRowCard
                  key={row.player.id}
                  rank={row.rank}
                  name={row.player.displayName}
                  subtitle={row.player.teamName || 'Player'}
                  image={row.player.profilePhoto}
                  rightPrimary={String(row.goals)}
                  rightSecondary={`${row.goalsPerMatch} / match`}
                  onClick={() => navigateTo('player_profile', row.player.id)}
                />
              ))
            )}
          </div>
        </LeaderboardPanel>
      )}

      {/* Assists */}
      {activeTab === 'assists' && (
        <LeaderboardPanel
          title="Assist Leaders"
          subtitle="Most goals created by playmakers"
          icon={<Award className="w-4 h-4 text-orange-400" />}
          actionText="View Player Profiles"
          onAction={() => navigateTo('players')}
        >
          <div className="space-y-2">
            {topAssists.length === 0 ? (
              <EmptyState text="No assist data available yet." />
            ) : (
              topAssists.map((row) => (
                <StatRowCard
                  key={row.player.id}
                  rank={row.rank}
                  name={row.player.displayName}
                  subtitle={row.player.teamName || 'Player'}
                  image={row.player.profilePhoto}
                  rightPrimary={String(row.assists)}
                  rightSecondary={`${row.matchesPlayed} matches`}
                  onClick={() => navigateTo('player_profile', row.player.id)}
                />
              ))
            )}
          </div>
        </LeaderboardPanel>
      )}

      {/* Defence */}
      {activeTab === 'defence' && (
        <LeaderboardPanel
          title="Best Defence"
          subtitle="Fewest goals conceded per match"
          icon={<ShieldCheck className="w-4 h-4 text-orange-400" />}
          actionText="View Standings"
          onAction={() => navigateTo('standings')}
        >
          <div className="space-y-2">
            {bestDefence.length === 0 ? (
              <EmptyState text="No defensive data available yet." />
            ) : (
              bestDefence.map((row) => (
                <StatRowCard
                  key={row.player.id}
                  rank={row.rank}
                  name={row.player.displayName}
                  subtitle={row.player.teamName || 'Player'}
                  image={row.player.profilePhoto}
                  rightPrimary={String(row.goalsConcededPerMatch)}
                  rightSecondary={`${row.cleanSheets} clean sheets`}
                  onClick={() => navigateTo('player_profile', row.player.id)}
                />
              ))
            )}
          </div>
        </LeaderboardPanel>
      )}

      {/* Clean Sheets */}
      {activeTab === 'cleansheets' && (
        <LeaderboardPanel
          title="Clean Sheets"
          subtitle="Players with the most shutouts"
          icon={<Sparkles className="w-4 h-4 text-orange-400" />}
          actionText="View Standings"
          onAction={() => navigateTo('standings')}
        >
          <div className="space-y-2">
            {cleanSheetsList.length === 0 ? (
              <EmptyState text="No clean-sheet data available yet." />
            ) : (
              cleanSheetsList.map((row, index) => (
                <StatRowCard
                  key={row.playerId}
                  rank={index + 1}
                  name={row.player.displayName}
                  subtitle={row.player.teamName || 'Player'}
                  image={row.player.profilePhoto}
                  rightPrimary={String(row.cleanSheets)}
                  rightSecondary={`${row.goalsAgainst} conceded`}
                  onClick={() => navigateTo('player_profile', row.playerId)}
                />
              ))
            )}
          </div>
        </LeaderboardPanel>
      )}

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <OverviewCard label="Played" value={tournamentStats.totalCompleted} hint="Completed matches" />
            <OverviewCard label="Pending" value={Math.max(tournamentStats.totalMatches - tournamentStats.totalCompleted, 0)} hint="Scheduled matches" />
            <OverviewCard label="Goals" value={tournamentStats.totalGoals} hint="All tournament goals" />
            <OverviewCard label="Top Leader" value={tournamentStats.leader?.player.displayName || 'TBD'} hint={`${tournamentStats.leader?.points || 0} points`} />
          </section>

          {tournamentStats.highestScoringMatch && (
            <section className="rounded-3xl border border-white/5 bg-slate-900 shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/3 px-4 py-3">
                <Medal className="h-4 w-4 text-orange-400" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                  Highest Scoring Match
                </h2>
              </div>

              <div className="p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {tournamentStats.highestScoringMatch.match.roundName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      Total Goals: {tournamentStats.highestScoringMatch.totalGoals}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Score: {tournamentStats.highestScoringMatch.match.homeScore} - {tournamentStats.highestScoringMatch.match.awayScore}
                    </p>
                  </div>

                  <button
                    onClick={() => navigateTo('results')}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
                  >
                    View Results <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>
          )}
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

function LeaderboardPanel({
  title,
  subtitle,
  icon,
  actionText,
  onAction,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  actionText: string;
  onAction: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/5 bg-slate-900 shadow-lg overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/3 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
              {title}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <button
          onClick={onAction}
          className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-orange-300 hover:text-orange-200 whitespace-nowrap"
        >
          {actionText} <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-3">{children}</div>
    </section>
  );
}

function StatRowCard({
  rank,
  name,
  subtitle,
  image,
  rightPrimary,
  rightSecondary,
  onClick,
}: {
  rank: number;
  name: string;
  subtitle: string;
  image?: string;
  rightPrimary: string;
  rightSecondary: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border border-white/5 bg-slate-950 p-3 text-left transition-colors hover:border-white/10 hover:bg-white/3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
              rank === 1 ? 'bg-orange-500 text-slate-950' : 'bg-white/5 text-slate-200'
            }`}
          >
            {rank}
          </span>

          <img
            src={image || defaultAvatar(name)}
            alt={name}
            className="h-9 w-9 shrink-0 rounded-full object-cover border border-white/10"
          />

          <div className="min-w-0">
            <div className="truncate font-semibold text-white">{name}</div>
            <div className="truncate text-[11px] text-slate-400">{subtitle}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xl font-black text-orange-400 font-['Chakra_Petch',sans-serif] leading-none">
            {rightPrimary}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">{rightSecondary}</div>
        </div>
      </div>
    </button>
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

function OverviewCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-[10px] font-bold uppercase tracking-wider text-orange-200/90">
        {label}
      </div>
      <div className="mt-1 truncate text-xl sm:text-2xl font-black text-white font-['Chakra_Petch',sans-serif]">
        {value}
      </div>
      <div className="mt-1 text-[10px] text-slate-400">{hint}</div>
    </div>
  );
}