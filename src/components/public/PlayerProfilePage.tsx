import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import {
  ArrowLeft,
  Share2,
  Award,
  Target,
  Facebook,
  ExternalLink,
} from 'lucide-react';

export const PlayerProfilePage: React.FC = () => {
  const {
    selectedPlayerId,
    players,
    getPlayerProfile,
    navigateTo,
    openShareModal,
    selectedTournament,
  } = useTournament();

  const player =
    players.find((p) => p.id === selectedPlayerId) ||
    players[0];

  const profile = getPlayerProfile(player?.id || '');

  if (!player || !profile) {
    return (
      <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
        <h2 className="text-xl font-bold text-white">
          Player Not Found
        </h2>

        <p className="text-sm text-slate-400 mt-2">
          The selected player could not be located in the tournament database.
        </p>

        <button
          onClick={() => navigateTo('players')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
        >
          Return to Players Roster
        </button>
      </div>
    );
  }

  const handleShare = () => {
    openShareModal({
      title: `${player.displayName} - Tournament Profile`,
      subtitle: `${player.teamName} • ${profile.matchesPlayed} Matches | ${profile.goalsScored} Goals | ${profile.wins} Wins`,
      type: 'player',
      player,
    });
  };

  const playerMap = new Map<string, Player>(
    players.map((p) => [p.id, p])
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('players')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Players</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 px-3.5 py-1.5 bg-emerald-950/60 border border-emerald-800/60 rounded-xl transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Profile</span>
        </button>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="relative shrink-0">
            <img
              src={player.profilePhoto}
              alt={player.displayName}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-slate-700 shadow-2xl"
            />

            <span className="absolute -bottom-2 -right-2 text-2xl bg-slate-950 border border-slate-700 rounded-xl p-1.5 shadow-lg">
              {player.teamLogo || '👑'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {player.status === 'active'
                  ? 'Active Competitor'
                  : 'Suspended'}
              </span>

              <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {selectedTournament?.name || 'Season 1'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-2">
              {player.displayName}
            </h1>

            <p className="text-sm sm:text-base font-semibold text-emerald-400 mt-1">
              {player.teamName}{' '}
              <span className="text-slate-500 font-normal">
                • {player.fullName}
              </span>
            </p>

            {player.facebookUrl && (
              <div className="mt-3 flex justify-center sm:justify-start">
                <a
                  href={player.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 hover:border-blue-400/50 text-blue-400 hover:text-blue-300 rounded-xl text-xs font-bold transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {player.bio && (
              <p className="text-xs sm:text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed italic bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                "{player.bio}"
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Matches
          </span>
          <span className="text-2xl font-black text-white font-['Chakra_Petch',sans-serif] mt-1 block">
            {profile.matchesPlayed}
          </span>
          <span className="text-[10px] text-slate-500">
            {profile.wins}W - {profile.draws}D - {profile.losses}L
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Win Rate
          </span>
          <span className="text-2xl font-black text-emerald-400 font-['Chakra_Petch',sans-serif] mt-1 block">
            {profile.winRate}%
          </span>
          <span className="text-[10px] text-emerald-500/80">
            {profile.wins} victories
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Points
          </span>
          <span className="text-2xl font-black text-amber-400 font-['Chakra_Petch',sans-serif] mt-1 block">
            {profile.points}
          </span>
          <span className="text-[10px] text-slate-500">
            League PTS
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Goals Scored
          </span>
          <span className="text-2xl font-black text-sky-400 font-['Chakra_Petch',sans-serif] mt-1 block">
            {profile.goalsScored}
          </span>
          <span className="text-[10px] text-slate-500">
            {profile.matchesPlayed > 0
              ? (
                  profile.goalsScored /
                  profile.matchesPlayed
                ).toFixed(2)
              : 0}
            /match
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Goal Diff
          </span>
          <span
            className={`text-2xl font-black font-['Chakra_Petch',sans-serif] mt-1 block ${
              profile.goalDifference > 0
                ? 'text-emerald-400'
                : profile.goalDifference < 0
                  ? 'text-rose-400'
                  : 'text-slate-300'
            }`}
          >
            {profile.goalDifference > 0
              ? `+${profile.goalDifference}`
              : profile.goalDifference}
          </span>
          <span className="text-[10px] text-slate-500">
            {profile.goalsConceded} conceded
          </span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Clean Sheets
          </span>
          <span className="text-2xl font-black text-teal-400 font-['Chakra_Petch',sans-serif] mt-1 block">
            {profile.cleanSheets}
          </span>
          <span className="text-[10px] text-slate-500">
            Zero conceded
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="p-2 bg-amber-500/15 text-amber-400 rounded-xl">
              <Target className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-base text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Goal Scoring Record
              </h3>
              <p className="text-xs text-slate-400">
                {profile.goalsScored} total goals in tournament play
              </p>
            </div>
          </div>

          <div className="mt-4">
            {profile.goalsByMinute.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No individual goal timestamps recorded yet.
              </p>
            ) : (
              <div className="space-y-2">
                {profile.goalsByMinute.map((g, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
                  >
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="text-amber-400 font-mono font-bold">
                        {g.minute}'
                      </span>
                      <span>⚽ Goal scored</span>

                      {g.isPenalty && (
                        <span className="text-[10px] bg-amber-950/60 text-amber-400 px-1.5 rounded font-semibold">
                          (Penalty)
                        </span>
                      )}
                    </span>

                    <span className="text-slate-500 text-[11px]">
                      Match #{g.matchId.replace('match-', '')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="p-2 bg-sky-500/15 text-sky-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-base text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Playmaker & Assist Record
              </h3>
              <p className="text-xs text-slate-400">
                {profile.assists} assists provided
              </p>
            </div>
          </div>

          <div className="mt-4">
            {profile.assistEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                No assists logged for this player yet.
              </p>
            ) : (
              <div className="space-y-2">
                {profile.assistEvents.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs"
                  >
                    <span className="flex items-center gap-2 text-slate-200">
                      <span className="text-sky-400 font-mono font-bold">
                        {a.minute}'
                      </span>
                      <span>👟 Assist to {a.scorerName}</span>
                    </span>

                    <span className="text-slate-500 text-[11px]">
                      Match #{a.matchId.replace('match-', '')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
              Match History & Results
            </h3>

            <p className="text-xs text-slate-400">
              Chronological tournament appearances
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {profile.recentMatches.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No completed matches recorded yet.
            </p>
          ) : (
            profile.recentMatches.map((m) => {
              const isHome =
                m.homePlayerId === player.id;

              const oppId = isHome
                ? m.awayPlayerId
                : m.homePlayerId;

              const opp = playerMap.get(oppId);

              const myScore = isHome
                ? m.homeScore
                : m.awayScore;

              const oppScore = isHome
                ? m.awayScore
                : m.homeScore;

              const isCompleted =
                m.status === 'completed' &&
                myScore !== null &&
                oppScore !== null;

              let outcome = 'SCHEDULED';
              let badgeColor =
                'bg-slate-800 text-slate-400';

              if (isCompleted) {
                if (myScore! > oppScore!) {
                  outcome = 'WIN';
                  badgeColor =
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
                } else if (myScore === oppScore) {
                  outcome = 'DRAW';
                  badgeColor =
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30';
                } else {
                  outcome = 'LOSS';
                  badgeColor =
                    'bg-rose-500/20 text-rose-400 border border-rose-500/30';
                }
              }

              return (
                <div
                  key={m.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${badgeColor}`}
                    >
                      {outcome}
                    </span>

                    <div>
                      <span className="text-[11px] text-slate-400 uppercase font-semibold">
                        {m.roundName}
                      </span>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-bold text-white">
                          vs {opp?.displayName || 'Opponent'}
                        </span>

                        <span className="text-[11px] text-slate-400">
                          ({opp?.teamName})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isCompleted ? (
                      <span className="font-black text-sm text-white font-['Chakra_Petch',sans-serif] bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                        {myScore} - {oppScore}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">
                        {m.scheduledDate}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};