import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Trophy, Medal, Award, Calendar, Sparkles, Share2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { openShareModal } = useTournament();

  const pastTournaments = [
    {
      id: 'season-0',
      season: 'PES Champions Cup 2025 (Inaugural)',
      champion: 'Marcus "Viper" Vance',
      championClub: 'Paris Saint-Germain',
      championPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      runnerUp: 'Elena "Blaze" Rostova',
      runnerUpClub: 'Arsenal FC',
      finalScore: '3 - 2 (AET)',
      topScorer: 'Marcus Vance (16 Goals)',
      bestDefence: 'David Chen (0.50 Conceded/G)',
      mvp: 'Marcus Vance',
      participants: 12,
      prizePool: '$1,000'
    },
    {
      id: 'preseason-2025',
      season: 'PES Winter Warm-up Invitational',
      champion: 'Alex "Striker" Mercer',
      championClub: 'Real Madrid CF',
      championPhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
      runnerUp: 'Marcus "Viper" Vance',
      runnerUpClub: 'Paris Saint-Germain',
      finalScore: '4 - 1',
      topScorer: 'Alex Mercer (12 Goals)',
      bestDefence: 'Alex Mercer (0.75 Conceded/G)',
      mvp: 'Alex Mercer',
      participants: 8,
      prizePool: '$500'
    }
  ];

  const hallOfFame = [
    {
      name: 'Marcus "Viper" Vance',
      title: 'Inaugural Grand Champion & Golden Boot Record',
      titles: '1x Champion • 1x Runner-up • 1x Golden Boot',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      quote: 'Tactics win games, composure wins championships.'
    },
    {
      name: 'Alex "Striker" Mercer',
      title: 'Winter Invitational Champion & Master Tactician',
      titles: '1x Invitational Champion • 4.0 Goals Per Game Record',
      photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400',
      quote: 'Precision control and clinical finishing is an art form.'
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Legacy & Champions
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Tournament History & Hall of Fame
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Historic champions, grand final results, and legendary PES controller athletes
          </p>
        </div>

        <button
          onClick={() => openShareModal({
            title: 'PES Championship - Hall of Fame & History',
            subtitle: 'Honoring historic champions and legendary tournament finals',
            type: 'tournament'
          })}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Legacy</span>
        </button>
      </div>

      {/* Hall of Fame Spotlight */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-orange-400 font-['Chakra_Petch',sans-serif]">
            Tournament Hall of Fame
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {hallOfFame.map((legend, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
            >
              <img
                src={legend.photo}
                alt={legend.name}
                className="w-20 h-20 rounded-xl object-cover border border-orange-500/50 shadow-md shrink-0"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                  Hall of Fame Inductee
                </span>
                <h3 className="font-bold text-base text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mt-1">
                  {legend.name}
                </h3>
                <p className="text-[11px] font-semibold text-orange-400 mt-0.5">{legend.title}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{legend.titles}</p>
                <p className="text-xs text-slate-400 italic mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  "{legend.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Previous Tournament Archives */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-orange-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-['Chakra_Petch',sans-serif]">
            Historic Seasons & Finals
          </h2>
        </div>

        <div className="space-y-3">
          {pastTournaments.map((past) => (
            <div
              key={past.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Concluded Tournament
                  </span>
                  <h3 className="text-base font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mt-0.5">
                    {past.season}
                  </h3>
                </div>

                <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded text-xs font-bold border border-slate-700">
                  Prize: {past.prizePool}
                </span>
              </div>

              {/* Champion vs Runner-Up Showcase */}
              <div className="py-4 grid grid-cols-1 md:grid-cols-3 items-center gap-3 text-center">
                {/* Champion */}
                <div className="flex flex-col items-center p-3 bg-slate-950/50 border border-orange-500/30 rounded-xl">
                  <div className="relative">
                    <img
                      src={past.championPhoto}
                      alt={past.champion}
                      className="w-14 h-14 rounded-full object-cover border-2 border-orange-400 shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs bg-orange-500 text-slate-950 p-0.5 rounded-full">
                      🏆
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-orange-400 tracking-wider mt-1.5">
                    Official Champion
                  </span>
                  <span className="font-bold text-sm text-white mt-0.5">{past.champion}</span>
                  <span className="text-[11px] text-slate-400">{past.championClub}</span>
                </div>

                {/* Score */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Grand Final Scoreline
                  </span>
                  <span className="text-2xl font-black text-white font-['Chakra_Petch',sans-serif] mt-1 bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                    {past.finalScore}
                  </span>
                </div>

                {/* Runner-Up */}
                <div className="flex flex-col items-center p-3 bg-slate-950/40 border border-slate-800 rounded-xl">
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-xl border-2 border-slate-600">
                    🥈
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-1.5">
                    Runner-Up (2nd)
                  </span>
                  <span className="font-bold text-sm text-white mt-0.5">{past.runnerUp}</span>
                  <span className="text-[11px] text-slate-400">{past.runnerUpClub}</span>
                </div>
              </div>

              {/* Tournament Awards Footer */}
              <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Golden Boot</span>
                  <span className="text-orange-400 font-semibold">{past.topScorer}</span>
                </div>
                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Best Defence</span>
                  <span className="text-green-400 font-semibold">{past.bestDefence}</span>
                </div>
                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Tournament MVP</span>
                  <span className="text-orange-300 font-semibold">{past.mvp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
