import React, { useMemo, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import {
  BookOpen,
  Shield,
  HelpCircle,
  CheckCircle,
  Search,
  Share2,
  ChevronRight,
  ScrollText,
  Sparkles,
} from 'lucide-react';

export const RulesPage: React.FC = () => {
  const { rules, selectedTournament, openShareModal } = useTournament();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    return Array.from(new Set(rules.map((r) => r.category)));
  }, [rules]);

  const filteredRules = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rules.filter((r) => {
      const matchSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);

      const matchCategory = activeCategory === 'all' || r.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [rules, search, activeCategory]);

  const groupedRules = useMemo(() => {
    const map = new Map<string, typeof rules>();
    filteredRules.forEach((rule) => {
      const list = map.get(rule.category) || [];
      list.push(rule);
      map.set(rule.category, list);
    });
    return Array.from(map.entries());
  }, [filteredRules, rules]);

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
                Official Handbook
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200">
                <Shield className="h-3.5 w-3.5 text-orange-300" />
                Public Rules
              </span>
            </div>

            <button
              onClick={() =>
                openShareModal({
                  title: `${selectedTournament?.name || 'PES Tournament'} - Official Rules`,
                  subtitle: 'Fair play conduct, match conditions and disconnection guidelines',
                  type: 'tournament',
                })
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Share2 className="h-4 w-4 text-orange-300" />
              Share Rules
            </button>
          </div>

          <div className="mt-5 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight font-['Chakra_Petch',sans-serif] leading-[0.95]">
              Tournament Rules & Regulations
            </h1>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-orange-100/90 leading-relaxed">
              Standard match conditions, fair play guidelines, and tournament procedures for{' '}
              <span className="font-semibold text-white">
                {selectedTournament?.name || 'PES Tournament'}
              </span>
              .
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label="Categories" value={categories.length} />
            <MiniStat label="Rules" value={rules.length} />
            <MiniStat label="Visible" value={filteredRules.length} />
            <MiniStat label="Guide" value="Updated" />
          </div>
        </div>
      </section>

      {/* Search + Category Filters */}
      <section className="rounded-3xl border border-white/5 bg-slate-900 shadow-lg p-3 sm:p-4 space-y-3">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-orange-400" />
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
            Browse Rules
          </h2>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search rules, categories, or policies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-3 bg-slate-950 border border-white/5 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          <CategoryChip
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            label="All Rules"
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              label={cat}
            />
          ))}
        </div>
      </section>

      {/* Rules */}
      {groupedRules.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {groupedRules.map(([category, catRules]) => (
            <section
              key={category}
              className="rounded-3xl border border-white/5 bg-slate-900 shadow-lg overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 bg-white/3 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-400" />
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-200">
                    {category}
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">
                  {catRules.length} rule{catRules.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 md:grid-cols-2">
                {catRules.map((rule) => (
                  <article
                    key={rule.id}
                    className="rounded-2xl border border-white/5 bg-slate-950 p-4 transition-colors hover:border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-sm font-black text-orange-300 border border-orange-500/20">
                        {rule.order}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white">
                          {rule.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
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

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
        active
          ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-950/20'
          : 'border border-white/5 bg-slate-950 text-slate-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-900 px-4 py-10 text-center">
      <HelpCircle className="mx-auto h-10 w-10 text-slate-600" />
      <h3 className="mt-3 text-base font-bold text-white">No rules found</h3>
      <p className="mt-1 text-sm text-slate-400">
        Try changing the search text or category filter.
      </p>
    </div>
  );
}