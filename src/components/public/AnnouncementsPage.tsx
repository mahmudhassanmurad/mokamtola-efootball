import React from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Bell, Pin, Calendar, Share2, Tag } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, selectedTournament, openShareModal } = useTournament();

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Official Notices
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Tournament Announcements
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Official tournament organizer updates, schedule revisions, and broadcast bulletins
          </p>
        </div>

        <button
          onClick={() => openShareModal({
            title: `${selectedTournament?.name} - Official Announcements`,
            subtitle: 'Latest tournament bulletins, schedule updates, and live streams',
            type: 'announcement'
          })}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Bulletin</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-2.5">
        {sortedAnnouncements.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              item.isPinned
                ? 'bg-slate-900 border-orange-500/40 shadow-sm'
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-sm'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                {item.isPinned && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500 text-slate-950">
                    <Pin className="w-3 h-3 fill-slate-950" />
                    Pinned
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  {item.createdAt}
                </span>
                <button
                  onClick={() => openShareModal({
                    title: item.title,
                    subtitle: item.content,
                    type: 'announcement'
                  })}
                  className="p-1 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded transition-colors"
                  title="Share announcement"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <h2 className="text-sm sm:text-base font-bold text-white mt-2.5 font-['Chakra_Petch',sans-serif] tracking-wide">
              {item.title}
            </h2>
            <div className="mt-1 text-xs text-slate-300 leading-relaxed space-y-1 whitespace-pre-line">
              {item.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
