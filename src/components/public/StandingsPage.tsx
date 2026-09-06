import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Trophy, Share2, Info, ArrowUpRight, ShieldCheck, Flame } from 'lucide-react';

export const StandingsPage: React.FC = () => {
  const { standings, selectedTournament, openShareModal, navigateTo } = useTournament();

  const handleShare = () => {
    openShareModal({
      title: `${selectedTournament?.name} - Official Standings`,
      subtitle: 'Current tournament league table, points, and goal difference',
      type: 'standings',
    });
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Authoritative League Table
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Tournament Standings
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Live standings automatically recalculated from verified match results
          </p>
        </div>

        <button
          onClick={handleShare}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Standings</span>
        </button>
      </div>

      {/* Standings Table Card */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="py-2.5 px-3 text-center w-10">POS</th>
                <th className="py-2.5 px-3">PLAYER / CLUB</th>
                <th className="py-2.5 px-2 text-center" title="Matches Played">P</th>
                <th className="py-2.5 px-2 text-center text-green-400" title="Won">W</th>
                <th className="py-2.5 px-2 text-center text-slate-400" title="Drawn">D</th>
                <th className="py-2.5 px-2 text-center text-rose-400" title="Lost">L</th>
                <th className="py-2.5 px-2 text-center hidden md:table-cell" title="Goals For">GF</th>
                <th className="py-2.5 px-2 text-center hidden md:table-cell" title="Goals Against">GA</th>
                <th className="py-2.5 px-2 text-center" title="Goal Difference">GD</th>
                <th className="py-2.5 px-2 text-center hidden sm:table-cell" title="Clean Sheets">CS</th>
                <th className="py-2.5 px-2 text-center hidden lg:table-cell" title="Win Rate">WIN%</th>
                <th className="py-2.5 px-3 text-center hidden sm:table-cell">FORM</th>
                <th className="py-2.5 px-4 text-right font-black text-white">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {standings.map((row) => {
                const isTopFour = row.rank <= 4;
                const isFirst = row.rank === 1;

                return (
                  <tr
                    key={row.playerId}
                    onClick={() => navigateTo('player_profile', row.playerId)}
                    className={`hover:bg-slate-800/40 cursor-pointer transition-colors group ${
                      isFirst ? 'bg-orange-500/5' : ''
                    }`}
                  >
                    {/* Position */}
                    <td className="py-2.5 px-3 text-center">
                      <span className={`w-6 h-6 mx-auto rounded flex items-center justify-center font-black text-xs font-['Chakra_Petch',sans-serif] ${
                        isFirst
                          ? 'bg-orange-600 text-white shadow-sm'
                          : isTopFour
                          ? 'bg-slate-800 text-orange-400 border border-orange-500/30'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}>
                        {row.rank}
                      </span>
                    </td>

                    {/* Player Info */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={row.player.profilePhoto}
                          alt={row.player.displayName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0 group-hover:border-orange-500 transition-colors shadow-sm"
                        />
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white group-hover:text-orange-400 transition-colors truncate block">
                              {row.player.displayName}
                            </span>
                            <ArrowUpRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {row.player.teamName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* P, W, D, L */}
                    <td className="py-2.5 px-2 text-center text-slate-300 font-medium">{row.played}</td>
                    <td className="py-2.5 px-2 text-center text-green-400 font-bold">{row.won}</td>
                    <td className="py-2.5 px-2 text-center text-slate-400 font-medium">{row.drawn}</td>
                    <td className="py-2.5 px-2 text-center text-rose-400 font-medium">{row.lost}</td>

                    {/* GF, GA */}
                    <td className="py-2.5 px-2 text-center text-slate-300 hidden md:table-cell">{row.goalsFor}</td>
                    <td className="py-2.5 px-2 text-center text-slate-300 hidden md:table-cell">{row.goalsAgainst}</td>

                    {/* GD */}
                    <td className="py-2.5 px-2 text-center font-bold">
                      <span className={row.goalDifference > 0 ? 'text-green-400' : row.goalDifference < 0 ? 'text-rose-400' : 'text-slate-400'}>
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </span>
                    </td>

                    {/* Clean Sheets */}
                    <td className="py-2.5 px-2 text-center text-slate-300 hidden sm:table-cell font-medium">
                      {row.cleanSheets}
                    </td>

                    {/* Win% */}
                    <td className="py-2.5 px-2 text-center text-orange-400/90 hidden lg:table-cell font-bold">
                      {row.winRate}%
                    </td>

                    {/* Form */}
                    <td className="py-2.5 px-3 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {row.form.length === 0 ? (
                          <span className="text-slate-600 text-xs">-</span>
                        ) : (
                          row.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded text-[9px] font-black flex items-center justify-center uppercase ${
                                res === 'W'
                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                  : res === 'D'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {res}
                            </span>
                          ))
                        )}
                      </div>
                    </td>

                    {/* Points */}
                    <td className="py-2.5 px-4 text-right">
                      <span className="text-sm sm:text-base font-black text-orange-400 font-['Chakra_Petch',sans-serif] tracking-wider">
                        {row.points}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend Footer */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-[10px] text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-orange-500/30 border border-orange-500/60"></span>
              <span>1st - 4th: Championship Knockouts</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700"></span>
              <span>5th - 8th: League Mid-Table</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Info className="w-3 h-3" />
            <span>Tie-breakers: (1) PTS &rarr; (2) GD &rarr; (3) GF &rarr; (4) Wins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
