import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Trophy, Calendar, Users, Award, ArrowRight, Share2, CheckCircle2 } from 'lucide-react';

export const TournamentsPage: React.FC = () => {
  const { tournaments, selectedTournamentId, setSelectedTournamentId, navigateTo, openShareModal } = useTournament();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
            Competitions & Seasons
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-1">
            Tournaments
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official PES championship tournaments, season archives, and competitions
          </p>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tournaments.map((tourney) => {
          const isSelected = tourney.id === selectedTournamentId;
          const isLive = tourney.status === 'live';
          const isCompleted = tourney.status === 'completed';

          return (
            <div
              key={tourney.id}
              className={`rounded-3xl border overflow-hidden transition-all shadow-xl flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500/50 bg-slate-900 ring-1 ring-emerald-500/30'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              {/* Image banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={tourney.bannerUrl}
                  alt={tourney.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    isLive 
                      ? 'bg-emerald-500 text-slate-950 shadow-md' 
                      : isCompleted 
                      ? 'bg-sky-500 text-slate-950' 
                      : 'bg-amber-400 text-slate-950'
                  }`}>
                    {tourney.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-900/90 text-slate-200 border border-slate-700">
                    {tourney.season}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-xl text-white font-['Chakra_Petch',sans-serif] tracking-wide uppercase">
                    {tourney.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                    {tourney.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px] uppercase">Format</span>
                      <span className="text-slate-200 font-bold capitalize">{tourney.format}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] uppercase">Prize Pool</span>
                      <span className="text-emerald-400 font-bold">{tourney.prizePool}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] uppercase">Game & Speed</span>
                      <span className="text-slate-300 font-medium">{tourney.matchDuration}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] uppercase">Dates</span>
                      <span className="text-slate-300 font-medium">{tourney.startDate} - {tourney.endDate}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedTournamentId(tourney.id);
                      navigateTo('tournament_details');
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>View Tournament Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openShareModal({
                      title: tourney.name,
                      subtitle: `${tourney.season} • Prize: ${tourney.prizePool}`,
                      type: 'tournament'
                    })}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="Share Tournament"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
