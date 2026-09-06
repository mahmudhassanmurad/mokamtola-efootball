import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { CheckCircle2, Clock, Calendar, Sparkles, Share2, ArrowRight } from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  const { roadmap, selectedTournament, openShareModal, navigateTo } = useTournament();

  const sortedRoadmap = [...roadmap].sort((a, b) => a.stageOrder - b.stageOrder);

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Season Milestones
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Tournament Roadmap
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage progression timeline from registration to grand final crowning
          </p>
        </div>

        <button
          onClick={() => openShareModal({
            title: `${selectedTournament?.name} - Tournament Roadmap`,
            subtitle: 'Timeline of stages, knockouts, and championship grand final dates',
            type: 'tournament'
          })}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Roadmap</span>
        </button>
      </div>

      {/* Timeline View */}
      <div className="relative border-l-2 border-slate-800 ml-3 sm:ml-6 space-y-4 pl-4 sm:pl-6 py-1">
        {sortedRoadmap.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <div key={stage.id} className="relative group">
              {/* Timeline marker node */}
              <div className={`absolute -left-[25px] sm:-left-[33px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                isCompleted
                  ? 'bg-orange-600 border-orange-500 text-white shadow-sm'
                  : isCurrent
                  ? 'bg-slate-950 border-orange-500 text-orange-400 ring-2 ring-orange-500/30'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
                ) : (
                  <span className="text-[10px] font-bold">{stage.stageOrder}</span>
                )}
              </div>

              {/* Card */}
              <div className={`p-4 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-orange-950/20 border-orange-500/50 shadow-md'
                  : isCompleted
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-slate-900/60 border-slate-800/80 opacity-70'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stage {stage.stageOrder}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {stage.targetDate && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-orange-400 bg-orange-950/50 border border-orange-900/60 px-2 py-0.5 rounded">
                        <Calendar className="w-3 h-3" />
                        {stage.targetDate}
                      </span>
                    )}
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      isCurrent
                        ? 'bg-orange-500 text-slate-950'
                        : isCompleted
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-800/60 text-slate-500'
                    }`}>
                      {stage.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white font-['Chakra_Petch',sans-serif] tracking-wide">
                  {stage.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {stage.description}
                </p>

                {isCurrent && (
                  <div className="mt-3 pt-2.5 border-t border-orange-900/40 flex items-center gap-2">
                    <button
                      onClick={() => navigateTo('fixtures')}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                    >
                      <span>Check Matches in Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
