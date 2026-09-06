import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { PublicPage } from '../types';
import { Home, Calendar, Award, BarChart3, Users, Bell } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activePublicPage, navigateTo } = useTournament();

  const navItems: { id: PublicPage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'fixtures', label: 'Fixtures', icon: <Calendar className="w-5 h-5" /> },
    { id: 'standings', label: 'Standings', icon: <Award className="w-5 h-5" /> },
    { id: 'results', label: 'Results', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'players', label: 'Players', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive = activePublicPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
              isActive
                ? 'text-orange-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-md ${isActive ? 'bg-orange-500/15' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
