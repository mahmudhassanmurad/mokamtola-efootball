import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { 
  Trophy, 
  Award, 
  ShieldCheck, 
  Flame, 
  Target, 
  Sparkles,
  Share2
} from 'lucide-react';

export const StatisticsPage: React.FC = () => {
  const { 
    topScorers, 
    topAssists, 
    bestDefence, 
    standings, 
    tournamentStats, 
    selectedTournament, 
    openShareModal, 
    navigateTo 
  } = useTournament();

  const [activeTab, setActiveTab] = useState<'scorers' | 'assists' | 'defence' | 'cleansheets' | 'overview'>('scorers');

  const cleanSheetsList = [...standings].sort((a, b) => {
    if (b.cleanSheets !== a.cleanSheets) return b.cleanSheets - a.cleanSheets;
    return a.goalsAgainst - b.goalsAgainst;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Tournament Analytics
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Player & Team Statistics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Official leaderboards for Golden Boot, Assists, Best Defence, and Clean Sheets
          </p>
        </div>

        <button
          onClick={() => openShareModal({
            title: `${selectedTournament?.name} - Statistics & Leaderboards`,
            subtitle: 'Golden Boot race, top playmakers, and defensive clean sheet records',
            type: 'standings'
          })}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Stats</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('scorers')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'scorers'
              ? 'bg-orange-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Goal Scorers</span>
        </button>

        <button
          onClick={() => setActiveTab('assists')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'assists'
              ? 'bg-orange-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Assists</span>
        </button>

        <button
          onClick={() => setActiveTab('defence')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'defence'
              ? 'bg-orange-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Best Defence</span>
        </button>

        <button
          onClick={() => setActiveTab('cleansheets')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'cleansheets'
              ? 'bg-orange-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clean Sheets</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-orange-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Tournament Overview</span>
        </button>
      </div>

      {/* Tab Contents */}
      {/* 1. Goal Scorers */}
      {activeTab === 'scorers' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                  Golden Boot Leaderboard
                </h2>
                <p className="text-[11px] text-slate-400">Top individual scorers ranked by total tournament goals</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-2.5 px-3 text-center w-10">#</th>
                  <th className="py-2.5 px-3">PLAYER / CLUB</th>
                  <th className="py-2.5 px-2.5 text-center">MATCHES</th>
                  <th className="py-2.5 px-2.5 text-center">PENALTIES</th>
                  <th className="py-2.5 px-2.5 text-center">GOALS / MATCH</th>
                  <th className="py-2.5 px-4 text-right font-black text-orange-400">GOALS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {topScorers.map((row) => (
                  <tr
                    key={row.player.id}
                    onClick={() => navigateTo('player_profile', row.player.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 text-center">
                      <span className={`w-5 h-5 mx-auto rounded flex items-center justify-center font-bold text-xs ${
                        row.rank === 1 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.player.profilePhoto}
                          alt={row.player.displayName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white group-hover:text-orange-400 transition-colors block">
                            {row.player.displayName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{row.player.teamName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-center text-slate-300">{row.matchesPlayed}</td>
                    <td className="py-2.5 px-2.5 text-center text-slate-400">{row.penalties}</td>
                    <td className="py-2.5 px-2.5 text-center font-mono text-orange-400">{row.goalsPerMatch}</td>
                    <td className="py-2.5 px-4 text-right font-black text-base text-orange-400 font-['Chakra_Petch',sans-serif]">
                      {row.goals}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Playmakers / Assists */}
      {activeTab === 'assists' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                  Playmaker & Assists Leaderboard
                </h2>
                <p className="text-[11px] text-slate-400">Most goal assists created in tournament matches</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-2.5 px-3 text-center w-10">#</th>
                  <th className="py-2.5 px-3">PLAYER / CLUB</th>
                  <th className="py-2.5 px-2.5 text-center">MATCHES PLAYED</th>
                  <th className="py-2.5 px-4 text-right font-black text-orange-400">ASSISTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {topAssists.map((row) => (
                  <tr
                    key={row.player.id}
                    onClick={() => navigateTo('player_profile', row.player.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 text-center">
                      <span className={`w-5 h-5 mx-auto rounded flex items-center justify-center font-bold text-xs ${
                        row.rank === 1 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.player.profilePhoto}
                          alt={row.player.displayName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white group-hover:text-orange-400 transition-colors block">
                            {row.player.displayName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{row.player.teamName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-center text-slate-300">{row.matchesPlayed}</td>
                    <td className="py-2.5 px-4 text-right font-black text-base text-orange-400 font-['Chakra_Petch',sans-serif]">
                      {row.assists}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Best Defence */}
      {activeTab === 'defence' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                  Best Defensive Record
                </h2>
                <p className="text-[11px] text-slate-400">Fewest goals conceded per match & clean sheets</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-2.5 px-3 text-center w-10">#</th>
                  <th className="py-2.5 px-3">PLAYER / CLUB</th>
                  <th className="py-2.5 px-2.5 text-center">MATCHES</th>
                  <th className="py-2.5 px-2.5 text-center">TOTAL CONCEDED</th>
                  <th className="py-2.5 px-2.5 text-center">CLEAN SHEETS</th>
                  <th className="py-2.5 px-4 text-right font-black text-orange-400">CONCEDED / MATCH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {bestDefence.map((row) => (
                  <tr
                    key={row.player.id}
                    onClick={() => navigateTo('player_profile', row.player.id)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 text-center">
                      <span className={`w-5 h-5 mx-auto rounded flex items-center justify-center font-bold text-xs ${
                        row.rank === 1 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {row.rank}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.player.profilePhoto}
                          alt={row.player.displayName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white group-hover:text-orange-400 transition-colors block">
                            {row.player.displayName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{row.player.teamName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-center text-slate-300">{row.matchesPlayed}</td>
                    <td className="py-2.5 px-2.5 text-center text-rose-400 font-semibold">{row.goalsConceded}</td>
                    <td className="py-2.5 px-2.5 text-center text-green-400 font-semibold">{row.cleanSheets}</td>
                    <td className="py-2.5 px-4 text-right font-black text-base text-orange-400 font-['Chakra_Petch',sans-serif]">
                      {row.goalsConcededPerMatch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Clean Sheets */}
      {activeTab === 'cleansheets' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                  Clean Sheets Ranking
                </h2>
                <p className="text-[11px] text-slate-400">Total matches without conceding a single goal</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-2.5 px-3 text-center w-10">#</th>
                  <th className="py-2.5 px-3">PLAYER / CLUB</th>
                  <th className="py-2.5 px-2.5 text-center">MATCHES PLAYED</th>
                  <th className="py-2.5 px-2.5 text-center">GOALS CONCEDED</th>
                  <th className="py-2.5 px-4 text-right font-black text-orange-400">CLEAN SHEETS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {cleanSheetsList.map((row, idx) => (
                  <tr
                    key={row.playerId}
                    onClick={() => navigateTo('player_profile', row.playerId)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 text-center">
                      <span className={`w-5 h-5 mx-auto rounded flex items-center justify-center font-bold text-xs ${
                        idx === 0 ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.player.profilePhoto}
                          alt={row.player.displayName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white group-hover:text-orange-400 transition-colors block">
                            {row.player.displayName}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{row.player.teamName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-2.5 text-center text-slate-300">{row.played}</td>
                    <td className="py-2.5 px-2.5 text-center text-slate-400">{row.goalsAgainst}</td>
                    <td className="py-2.5 px-4 text-right font-black text-base text-orange-400 font-['Chakra_Petch',sans-serif]">
                      {row.cleanSheets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Tournament Overview & Records */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Matches</span>
              <span className="text-2xl font-black text-white font-['Chakra_Petch',sans-serif] mt-0.5 block">
                {tournamentStats.totalMatches}
              </span>
              <span className="text-[10px] text-green-400">{tournamentStats.totalCompleted} played</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Goals</span>
              <span className="text-2xl font-black text-orange-400 font-['Chakra_Petch',sans-serif] mt-0.5 block">
                {tournamentStats.totalGoals}
              </span>
              <span className="text-[10px] text-slate-400">across all fixtures</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Goals/Game</span>
              <span className="text-2xl font-black text-orange-300 font-['Chakra_Petch',sans-serif] mt-0.5 block">
                {tournamentStats.avgGoalsPerMatch}
              </span>
              <span className="text-[10px] text-slate-400">high-scoring action</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tournament Leader</span>
              <span className="text-xl font-black text-orange-400 font-['Chakra_Petch',sans-serif] mt-0.5 block truncate">
                {tournamentStats.leader?.player.displayName || 'TBD'}
              </span>
              <span className="text-[10px] text-slate-400">{tournamentStats.leader?.points || 0} points</span>
            </div>
          </div>

          {/* Highest Scoring Match Spotlight */}
          {tournamentStats.highestScoringMatch && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">
                ⭐ Highest Scoring Match of the Season
              </span>
              <div className="mt-2 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {tournamentStats.highestScoringMatch.match.roundName}: {tournamentStats.highestScoringMatch.totalGoals} Goals Thriller
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Score: {tournamentStats.highestScoringMatch.match.homeScore} - {tournamentStats.highestScoringMatch.match.awayScore}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('results')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  View Match Result & Events
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
