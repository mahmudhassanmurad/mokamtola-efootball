import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { BookOpen, Shield, HelpCircle, CheckCircle, Search, Share2 } from 'lucide-react';

export const RulesPage: React.FC = () => {
  const { rules, selectedTournament, openShareModal } = useTournament();
  const [search, setSearch] = useState('');

  const filteredRules = rules.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.title.toLowerCase().includes(q) || 
           r.description.toLowerCase().includes(q) || 
           r.category.toLowerCase().includes(q);
  });

  const categories = Array.from(new Set(rules.map(r => r.category)));

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black text-orange-400 tracking-wider uppercase">
            Official Handbook
          </span>
          <h1 className="text-xl sm:text-3xl font-black italic text-white uppercase font-['Chakra_Petch',sans-serif] tracking-tight mt-0.5">
            Tournament Rules & Regulations
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Standard match conditions, disconnection protocols, and fair-play guidelines
          </p>
        </div>

        <button
          onClick={() => openShareModal({
            title: `${selectedTournament?.name} - Official Rules`,
            subtitle: 'Fair play conduct, match conditions, and disconnection guidelines',
            type: 'tournament'
          })}
          className="self-start sm:self-center flex items-center gap-1.5 h-8 px-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 rounded-lg transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-orange-400" />
          <span>Share Rules</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search rules, match conditions, or policies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Rules categorized */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catRules = filteredRules.filter(r => r.category === cat);
          if (catRules.length === 0) return null;

          return (
            <div key={cat} className="space-y-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 font-['Chakra_Petch',sans-serif]">
                  {cat}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {catRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors shadow-sm"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {rule.order}
                      </div>
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-white">{rule.title}</h3>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
