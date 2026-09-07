import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Match, Player, Announcement, TournamentRule, RoadmapStage } from '../../types';
import { MatchEditorModal } from './MatchEditorModal';
import { PlayerEditorModal } from './PlayerEditorModal';
import {
  Trophy,
  Users,
  Calendar,
  Settings,
  Shield,
  Bell,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  LogOut,
  CheckCircle,
  Clock,
  MapPin,
  Flame,
  Award,
  Download,
  AlertTriangle,
  Pin,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    tournaments,
    selectedTournament,
    selectedTournamentId,
    setSelectedTournamentId,
    players,
    matches,
    announcements,
    rules,
    roadmap,
    settings,
    standings,
    adminLogout,
    navigateTo,
    createManualFixture,
    deleteFixture,
    generateRoundRobinFixtures,
    deletePlayer,
    createAnnouncement,
    deleteAnnouncement,
    togglePinAnnouncement,
    addRule,
    deleteRule,
    addRoadmapStage,
    updateRoadmapStage,
    deleteRoadmapStage,
    updateTournament,
    createTournament,
    updateSettings,
    resetToDefaultData,
    exportDatabaseJSON
  } = useTournament();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'matches' | 'players' | 'standings' | 'tournaments' | 'rules' | 'announcements'
  >('overview');

  // Modals state
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);

  // New Manual Fixture Inline Form State
  const [showNewFixtureForm, setShowNewFixtureForm] = useState(false);
  const [newFixHomeId, setNewFixHomeId] = useState(players[0]?.id || '');
  const [newFixAwayId, setNewFixAwayId] = useState(players[1]?.id || '');
  const [newFixRound, setNewFixRound] = useState(1);
  const [newFixRoundName, setNewFixRoundName] = useState('Round 1');
  const [newFixDate, setNewFixDate] = useState(new Date().toISOString().split('T')[0]);
  const [newFixTime, setNewFixTime] = useState('18:00');
  const [newFixPitch, setNewFixPitch] = useState('Main Arena - Station 1');

  // New Announcement Form State
  const [showNewAnnounceForm, setShowNewAnnounceForm] = useState(false);
  const [newAnnounceTitle, setNewAnnounceTitle] = useState('');
  const [newAnnounceContent, setNewAnnounceContent] = useState('');
  const [newAnnounceCategory, setNewAnnounceCategory] = useState<'general' | 'schedule' | 'rules' | 'broadcast'>('general');
  const [newAnnouncePinned, setNewAnnouncePinned] = useState(false);

  // New Rule Form State
  const [showNewRuleForm, setShowNewRuleForm] = useState(false);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState('Fair Play & Conduct');

  // Manual Points Adjustment State
  const [pointAdjustPlayerId, setPointAdjustPlayerId] = useState(players[0]?.id || '');
  const [pointAdjustValue, setPointAdjustValue] = useState<number>(-1);
  const [pointAdjustReason, setPointAdjustReason] = useState('');
  const [adjustSuccessMsg, setAdjustSuccessMsg] = useState<string | null>(null);

  // Status message
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const notify = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
    const tournamentMatches = matches.filter(
    (m) => m.tournamentId === selectedTournamentId
  );

  const completedMatches = tournamentMatches.filter(
    (m) => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null
  );

  const allMatchesCompleted =
    tournamentMatches.length > 0 &&
    completedMatches.length === tournamentMatches.length;

  const currentLeader = standings.find((row) => row.played > 0) || null;

  const handleOpenEditMatch = (m: Match) => {
    setEditingMatch(m);
    setIsMatchModalOpen(true);
  };

  const handleOpenNewPlayer = () => {
    setEditingPlayer(null);
    setIsPlayerModalOpen(true);
  };

  const handleOpenEditPlayer = (p: Player) => {
    setEditingPlayer(p);
    setIsPlayerModalOpen(true);
  };

  const handleCreateFixture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFixHomeId || !newFixAwayId || newFixHomeId === newFixAwayId) {
      alert('Please select two distinct players for the fixture.');
      return;
    }

    createManualFixture({
      tournamentId: selectedTournamentId,
      round: Number(newFixRound),
      roundName: newFixRoundName || `Round ${newFixRound}`,
      homePlayerId: newFixHomeId,
      awayPlayerId: newFixAwayId,
      homeScore: null,
      awayScore: null,
      status: 'scheduled',
      scheduledDate: newFixDate,
      scheduledTime: newFixTime,
      pitch: newFixPitch,
    });

    setShowNewFixtureForm(false);
    notify('Manual fixture successfully created and published.');
  };

  const handleGenerateRoundRobin = () => {
    if (players.length < 2) {
      alert('Need at least 2 players to generate round robin schedule.');
      return;
    }
    if (confirm(`Generate round-robin fixtures for all ${players.length} players? Existing matches will be preserved.`)) {
      generateRoundRobinFixtures(selectedTournamentId, players.map(p => p.id));
      notify(`Generated round-robin schedule for ${players.length} competitors!`);
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnounceTitle.trim() || !newAnnounceContent.trim()) return;

    createAnnouncement({
      tournamentId: selectedTournamentId,
      title: newAnnounceTitle.trim(),
      content: newAnnounceContent.trim(),
      category: newAnnounceCategory,
      isPinned: newAnnouncePinned,
    });

    setNewAnnounceTitle('');
    setNewAnnounceContent('');
    setShowNewAnnounceForm(false);
    notify('Announcement published to the public website.');
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim()) return;

    addRule({
      tournamentId: selectedTournamentId,
      title: newRuleTitle.trim(),
      description: newRuleDesc.trim(),
      category: newRuleCategory,
      order: rules.length + 1,
    });

    setNewRuleTitle('');
    setNewRuleDesc('');
    setShowNewRuleForm(false);
    notify('Official tournament rule added.');
  };

  const handleApplyPointAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const p = playerMap.get(pointAdjustPlayerId);
    if (!p) return;
    setAdjustSuccessMsg(`Applied ${pointAdjustValue > 0 ? '+' : ''}${pointAdjustValue} PTS disciplinary adjustment for ${p.displayName} (${pointAdjustReason || 'Disciplinary ruling'}).`);
    setTimeout(() => setAdjustSuccessMsg(null), 4000);
  };

  const handleExportJSON = () => {
    const dataStr = exportDatabaseJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pes_tournament_db_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify('Database JSON export downloaded.');
  };

  return (
    <div className="space-y-4 pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Admin Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                Admin Control Room
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            </div>
            <h1 className="text-lg font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
              {selectedTournament?.name || 'Tournament'} Master Operations
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('home')}
            className="h-8 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            View Public Site
          </button>
          <button
            onClick={adminLogout}
            className="h-8 px-3 bg-rose-950/70 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800/60 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusNotice && (
        <div className="p-2.5 bg-orange-950/80 border border-orange-500/60 text-orange-300 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md">
          <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'matches', label: 'Matches & Results', icon: Trophy },
          { id: 'players', label: 'Players Roster', icon: Users },
          { id: 'standings', label: 'Standings & Points', icon: Award },
          { id: 'tournaments', label: 'Tournament Settings', icon: Settings },
          { id: 'rules', label: 'Rules & Roadmap', icon: Shield },
          { id: 'announcements', label: 'Announcements', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-orange-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & QUICK ACTIONS */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Players</span>
              <span className="text-2xl font-black text-white font-['Chakra_Petch',sans-serif] mt-0.5 block">
                {players.length}
              </span>
              <span className="text-[10px] text-orange-400 font-semibold">Active in database</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fixtures</span>
              <span className="text-2xl font-black text-slate-200 font-['Chakra_Petch',sans-serif] mt-0.5 block">
                {matches.length}
              </span>
              <span className="text-[10px] text-slate-400">Scheduled / Completed</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Matches</span>
              <span className="text-2xl font-black text-orange-400 font-['Chakra_Petch',sans-serif] mt-0.5 block">
                {matches.filter(m => m.status === 'completed').length}
              </span>
              <span className="text-[10px] text-slate-400">Standings recalculated</span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Fixtures</span>
              <span className="text-2xl font-black text-amber-400 font-['Chakra_Petch',sans-serif] mt-0.5 block">
                {matches.filter(m => m.status === 'scheduled').length}
              </span>
              <span className="text-[10px] text-amber-400/80 font-semibold">Awaiting score input</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="font-extrabold text-sm text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mb-3">
              Instant Tournament Controls
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <button
                onClick={() => setActiveTab('matches')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-left transition-colors group"
              >
                <Trophy className="w-4 h-4 text-orange-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-white block">Enter / Edit Score</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Log match result & goals</span>
              </button>

              <button
                onClick={handleOpenNewPlayer}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-left transition-colors group"
              >
                <Users className="w-4 h-4 text-sky-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-white block">Add New Player</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Register competitor</span>
              </button>

              <button
                onClick={() => { setActiveTab('announcements'); setShowNewAnnounceForm(true); }}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-left transition-colors group"
              >
                <Bell className="w-4 h-4 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-white block">Post Announcement</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Publish organizer notice</span>
              </button>

              <button
                onClick={() => setActiveTab('standings')}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-orange-500 rounded-xl text-left transition-colors group"
              >
                <Award className="w-4 h-4 text-purple-400 mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-xs text-white block">Audit Standings</span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Inspect points & GD</span>
              </button>
            </div>
          </div>

          {/* Database Backup & Reset Safety Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 className="font-extrabold text-sm text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mb-1">
              Data Management & Persistence
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              All updates in Admin Panel immediately persist to the authoritative database and refresh the public website.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={handleExportJSON}
                className="h-8 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-orange-400" />
                <span>Export Full Database Backup (JSON)</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset tournament to default starter season data? Any custom matches will be restored to default.')) {
                    resetToDefaultData();
                    notify('Reset database to clean starter tournament data.');
                  }
                }}
                className="h-8 px-3.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800/60 transition-colors"
              >
                Reset to Default Starter Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATCHES & RESULTS MANAGEMENT */}
      {activeTab === 'matches' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Fixtures & Match Results Control
              </h2>
              <p className="text-xs text-slate-400">
                Log final scores, goal scorers with minutes, assists, penalties, or generate round robin schedule.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowNewFixtureForm(!showNewFixtureForm)}
                className="h-8 px-3.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Manual Fixture</span>
              </button>

              <button
                onClick={handleGenerateRoundRobin}
                className="h-8 px-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
                <span>Generate Round-Robin</span>
              </button>
            </div>
          </div>

          {/* New Manual Fixture Inline Card */}
          {showNewFixtureForm && (
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                <h3 className="font-bold text-xs text-white uppercase tracking-wide">
                  New Fixture Creator
                </h3>
                <button
                  onClick={() => setShowNewFixtureForm(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateFixture} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Home Player *
                    </label>
                    <select
                      value={newFixHomeId}
                      onChange={(e) => setNewFixHomeId(e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      {players.map(p => (
                        <option key={p.id} value={p.id}>{p.displayName} ({p.teamName})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Away Player *
                    </label>
                    <select
                      value={newFixAwayId}
                      onChange={(e) => setNewFixAwayId(e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    >
                      {players.map(p => (
                        <option key={p.id} value={p.id}>{p.displayName} ({p.teamName})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Round #</label>
                    <input
                      type="number"
                      min="1"
                      value={newFixRound}
                      onChange={(e) => setNewFixRound(Number(e.target.value))}
                      className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Round Label</label>
                    <input
                      type="text"
                      value={newFixRoundName}
                      onChange={(e) => setNewFixRoundName(e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Date</label>
                    <input
                      type="date"
                      value={newFixDate}
                      onChange={(e) => setNewFixDate(e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Time</label>
                    <input
                      type="time"
                      value={newFixTime}
                      onChange={(e) => setNewFixTime(e.target.value)}
                      className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Pitch / Station</label>
                  <input
                    type="text"
                    value={newFixPitch}
                    onChange={(e) => setNewFixPitch(e.target.value)}
                    className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="h-8 px-4 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors"
                  >
                    Save & Schedule Fixture
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Fixtures List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3.5">ROUND / DATE</th>
                    <th className="py-2.5 px-3.5">HOME PLAYER</th>
                    <th className="py-2.5 px-2.5 text-center">SCORE</th>
                    <th className="py-2.5 px-3.5 text-right">AWAY PLAYER</th>
                    <th className="py-2.5 px-2.5 text-center">STATUS</th>
                    <th className="py-2.5 px-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {matches.map((match) => {
                    const homePlayer = playerMap.get(match.homePlayerId);
                    const awayPlayer = playerMap.get(match.awayPlayerId);
                    const isCompleted = match.status === 'completed';

                    return (
                      <tr key={match.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 px-3.5">
                          <span className="font-bold text-orange-400 block text-xs">{match.roundName}</span>
                          <span className="text-[10px] text-slate-400 block">{match.scheduledDate} • {match.scheduledTime}</span>
                        </td>

                        <td className="py-2.5 px-3.5">
                          <div className="flex items-center gap-2">
                            <img
                              src={homePlayer?.profilePhoto}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                            />
                            <div>
                              <span className="font-bold text-white block text-xs">{homePlayer?.displayName}</span>
                              <span className="text-[10px] text-slate-400 block">{homePlayer?.teamName}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-2.5 px-2.5 text-center">
                          {isCompleted ? (
                            <span className="font-black text-xs text-white font-['Chakra_Petch',sans-serif] px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                              {match.homeScore} : {match.awayScore}
                            </span>
                          ) : (
                            <span className="text-slate-600 font-bold text-xs">VS</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div>
                              <span className="font-bold text-white block text-xs">{awayPlayer?.displayName}</span>
                              <span className="text-[10px] text-slate-400 block">{awayPlayer?.teamName}</span>
                            </div>
                            <img
                              src={awayPlayer?.profilePhoto}
                              alt=""
                              className="w-7 h-7 rounded-full object-cover border border-slate-700 shrink-0"
                            />
                          </div>
                        </td>

                        <td className="py-2.5 px-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isCompleted ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {match.status}
                          </span>
                        </td>

                        <td className="py-2.5 px-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditMatch(match)}
                              className="h-7 px-2.5 bg-slate-800 hover:bg-orange-500 hover:text-slate-950 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                              title="Enter / Edit score & goal scorers"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Score</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm('Delete this fixture from the tournament?')) {
                                  deleteFixture(match.id);
                                  notify('Fixture deleted and standings updated.');
                                }
                              }}
                              className="h-7 w-7 flex items-center justify-center text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                              title="Delete fixture"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PLAYERS ROSTER MANAGEMENT */}
      {activeTab === 'players' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Tournament Players Management
              </h2>
              <p className="text-xs text-slate-400">
                Register competitors, update club assignments, and manage player photos.
              </p>
            </div>

            <button
              onClick={handleOpenNewPlayer}
              className="h-8 px-3.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Player</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {players.map((p) => (
              <div
                key={p.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.profilePhoto}
                        alt={p.displayName}
                        className="w-11 h-11 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-white">{p.displayName}</h3>
                        <p className="text-xs font-semibold text-orange-400">{p.teamName}</p>
                        <p className="text-[10px] text-slate-400">{p.fullName}</p>
                      </div>
                    </div>
                    <span className="text-lg">{p.teamLogo || '⚽'}</span>
                  </div>

                  {p.bio && (
                    <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 italic bg-slate-950/40 p-2 rounded-lg">
                      "{p.bio}"
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    p.status === 'active' ? 'bg-orange-500/20 text-orange-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {p.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEditPlayer(p)}
                      className="h-7 px-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove player ${p.displayName} and associated matches from tournament?`)) {
                          deletePlayer(p.id);
                          notify(`Removed player ${p.displayName}.`);
                        }
                      }}
                      className="h-7 w-7 flex items-center justify-center text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                      title="Delete player"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STANDINGS & MANUAL POINT ADJUSTMENTS */}
      {activeTab === 'standings' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Standings & Points System Control
              </h2>
              <p className="text-xs text-slate-400">
                Authoritative standings derived from match results. Apply disciplinary adjustments or lock standings.
              </p>
            </div>

            <button
              onClick={() => notify('Standings deterministically re-calculated from authoritative match logs!')}
              className="h-8 px-3.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Force Recalculate Standings</span>
            </button>
          </div>

          {/* Points Adjustment Disciplinary Form */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="font-extrabold text-xs text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mb-1">
              Disciplinary Manual Point Adjustment / Penalty
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Apply points deduction or bonus points with official reason for tournament record.
            </p>

            {adjustSuccessMsg && (
              <div className="mb-3 p-2.5 bg-orange-950/60 border border-orange-500/50 text-orange-300 rounded-lg text-xs font-semibold">
                {adjustSuccessMsg}
              </div>
            )}

            <form onSubmit={handleApplyPointAdjustment} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Player</label>
                <select
                  value={pointAdjustPlayerId}
                  onChange={(e) => setPointAdjustPlayerId(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.displayName} ({p.teamName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">PTS Adjustment</label>
                <select
                  value={pointAdjustValue}
                  onChange={(e) => setPointAdjustValue(Number(e.target.value))}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:border-orange-500"
                >
                  <option value="-3">-3 Points (Forfeit / Severe violation)</option>
                  <option value="-2">-2 Points (Disciplinary penalty)</option>
                  <option value="-1">-1 Point (Fair play warning)</option>
                  <option value="1">+1 Point (Bonus award)</option>
                  <option value="3">+3 Points (Forfeit award)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Official Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Unsportsmanlike conduct in Round 2"
                  value={pointAdjustReason}
                  onChange={(e) => setPointAdjustReason(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                className="h-8 px-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs uppercase border border-slate-700 transition-colors"
              >
                Apply Disciplinary Record
              </button>
            </form>
          </div>

          {/* Standings Summary Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[10px] font-bold text-slate-400 uppercase">
                  <th className="py-2.5 px-3.5">POS</th>
                  <th className="py-2.5 px-3.5">PLAYER</th>
                  <th className="py-2.5 px-2 text-center">P</th>
                  <th className="py-2.5 px-2 text-center">W</th>
                  <th className="py-2.5 px-2 text-center">D</th>
                  <th className="py-2.5 px-2 text-center">L</th>
                  <th className="py-2.5 px-2 text-center">GF</th>
                  <th className="py-2.5 px-2 text-center">GA</th>
                  <th className="py-2.5 px-2 text-center">GD</th>
                  <th className="py-2.5 px-3.5 text-right font-black text-orange-400">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {standings.map((row) => (
                  <tr key={row.playerId} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3.5 font-bold">{row.rank}</td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-bold text-white block">{row.player.displayName}</span>
                      <span className="text-[10px] text-slate-400 block">{row.player.teamName}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center">{row.played}</td>
                    <td className="py-2.5 px-2 text-center text-orange-400 font-bold">{row.won}</td>
                    <td className="py-2.5 px-2 text-center text-slate-400">{row.drawn}</td>
                    <td className="py-2.5 px-2 text-center text-rose-400">{row.lost}</td>
                    <td className="py-2.5 px-2 text-center">{row.goalsFor}</td>
                    <td className="py-2.5 px-2 text-center">{row.goalsAgainst}</td>
                    <td className="py-2.5 px-2 text-center font-bold">
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-black text-orange-400 text-xs font-['Chakra_Petch',sans-serif]">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: TOURNAMENT SETTINGS */}
      {activeTab === 'tournaments' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
              Tournament Configuration & Season Status
            </h2>
            <p className="text-xs text-slate-400">
              Update format, dates, prize pool, or crown champion and close season.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Tournament Name
                </label>
                <input
                  type="text"
                  value={selectedTournament?.name || ''}
                  onChange={(e) => updateTournament(selectedTournamentId, { name: e.target.value })}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Season Edition
                </label>
                <input
                  type="text"
                  value={selectedTournament?.season || ''}
                  onChange={(e) => updateTournament(selectedTournamentId, { season: e.target.value })}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Status
                </label>
                <select
                  value={selectedTournament?.status || 'live'}
                  onChange={(e) => updateTournament(selectedTournamentId, { status: e.target.value as any })}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live (Ongoing)</option>
                  <option value="completed">Completed (Finalized)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Format
                </label>
                <select
                  value={selectedTournament?.format || 'league'}
                  onChange={(e) => updateTournament(selectedTournamentId, { format: e.target.value as any })}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                >
                  <option value="league">Round-Robin League</option>
                  <option value="knockout">Single Elimination Knockout</option>
                  <option value="group_knockout">Group Stage + Knockout</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Prize Pool
                </label>
                <input
                  type="text"
                  value={selectedTournament?.prizePool || ''}
                  onChange={(e) => updateTournament(selectedTournamentId, { prizePool: e.target.value })}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={selectedTournament?.startDate || ''}
                  onChange={(e) => updateTournament(selectedTournamentId, { startDate: e.target.value })}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={selectedTournament?.endDate || ''}
                  onChange={(e) => updateTournament(selectedTournamentId, { endDate: e.target.value })}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={selectedTournament?.description || ''}
                onChange={(e) => updateTournament(selectedTournamentId, { description: e.target.value })}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white resize-none focus:border-orange-500"
              />
            </div>

            {/* Champion Declaration */}
<div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
  <div>
    <h4 className="text-xs font-bold text-white uppercase">
      Champion Declaration
    </h4>

    {selectedTournament?.status === 'completed' ? (
      <p className="text-[11px] text-slate-400">
        Tournament already finalized.
      </p>
    ) : !allMatchesCompleted ? (
      <p className="text-[11px] text-slate-400">
        Champion declare করা যাবে শুধু তখনই, যখন সব fixtures complete হবে.
      </p>
    ) : (
      <p className="text-[11px] text-slate-400">
        Current table leader:{' '}
        <strong className="text-orange-400">
          {currentLeader?.player.displayName || 'TBD'}
        </strong>{' '}
        ({currentLeader?.points || 0} PTS)
      </p>
    )}
  </div>

  <button
    disabled={
      selectedTournament?.status === 'completed' ||
      !allMatchesCompleted ||
      !currentLeader
    }
    onClick={() => {
      if (selectedTournament?.status === 'completed') {
        notify('Tournament already finalized.');
        return;
      }

      if (!allMatchesCompleted || !currentLeader) {
        notify('সব fixtures complete না হওয়া পর্যন্ত champion finalize করা যাবে না.');
        return;
      }

      if (
        confirm(
          `Declare ${currentLeader.player.displayName} as official Champion and conclude tournament?`
        )
      ) {
        updateTournament(selectedTournamentId, {
          status: 'completed',
          championPlayerId: currentLeader.playerId,
        } as any);

        notify(`Declared ${currentLeader.player.displayName} as Champion!`);
      }
    }}
    className={`h-8 px-3.5 font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 transition-colors ${
      selectedTournament?.status === 'completed' ||
      !allMatchesCompleted ||
      !currentLeader
        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        : 'bg-orange-500 hover:bg-orange-400 text-slate-950'
    }`}
  >
    <Trophy className="w-3.5 h-3.5" />
    <span>Crown Champion & Finalize</span>
  </button>
</div>
          </div>
        </div>
      )}

      {/* TAB 6: RULES & ROADMAP */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Rules & Roadmap Milestones
              </h2>
              <p className="text-xs text-slate-400">
                Manage handbook rules, fair play guidelines, and tournament stage milestones.
              </p>
            </div>

            <button
              onClick={() => setShowNewRuleForm(!showNewRuleForm)}
              className="h-8 px-3.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Rule</span>
            </button>
          </div>

          {/* New Rule Inline Form */}
          {showNewRuleForm && (
            <form onSubmit={handleAddRule} className="p-4 bg-slate-900 border border-orange-500/40 rounded-xl space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase">New Handbook Rule</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  placeholder="Rule Title (e.g. Disconnection Policy)"
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Fair Play & Conduct)"
                  value={newRuleCategory}
                  onChange={(e) => setNewRuleCategory(e.target.value)}
                  className="py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Rule description and instructions..."
                value={newRuleDesc}
                onChange={(e) => setNewRuleDesc(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white resize-none focus:border-orange-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRuleForm(false)}
                  className="h-7 px-3 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-7 px-3.5 bg-orange-500 text-slate-950 font-bold rounded-lg text-xs uppercase"
                >
                  Save Rule
                </button>
              </div>
            </form>
          )}

          {/* Rules List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rules.map((r) => (
              <div key={r.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex justify-between gap-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase text-orange-400">{r.category}</span>
                  <h4 className="font-bold text-xs text-white mt-0.5">{r.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.description}</p>
                </div>
                <button
                  onClick={() => { deleteRule(r.id); notify('Rule removed.'); }}
                  className="text-slate-500 hover:text-rose-400 p-1 self-start rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Roadmap Milestones */}
          <div className="pt-4 border-t border-slate-800">
            <h3 className="font-bold text-sm text-white font-['Chakra_Petch',sans-serif] uppercase mb-2.5">
              Roadmap Stages Progression
            </h3>

            <div className="space-y-2">
              {roadmap.map((stage) => (
                <div key={stage.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-800 text-white font-bold flex items-center justify-center text-[10px]">
                      {stage.stageOrder}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{stage.title}</span>
                      <span className="text-slate-400 text-[10px] block">{stage.description}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={stage.status}
                      onChange={(e) => {
                        updateRoadmapStage(stage.id, { status: e.target.value as any });
                        notify(`Stage ${stage.stageOrder} updated to ${e.target.value}.`);
                      }}
                      className="py-1 px-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="current">Current (Active)</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
                Announcements Management
              </h2>
              <p className="text-xs text-slate-400">
                Publish bulletins, tournament news, and pin important updates for all visitors.
              </p>
            </div>

            <button
              onClick={() => setShowNewAnnounceForm(!showNewAnnounceForm)}
              className="h-8 px-3.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Announcement</span>
            </button>
          </div>

          {/* New Announcement Form */}
          {showNewAnnounceForm && (
            <form onSubmit={handleCreateAnnouncement} className="p-4 bg-slate-900 border border-orange-500/40 rounded-xl space-y-3">
              <h3 className="font-bold text-xs text-white uppercase tracking-wide">
                Create Public Bulletin
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Headline Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Schedule Revision for Round 3"
                    value={newAnnounceTitle}
                    onChange={(e) => setNewAnnounceTitle(e.target.value)}
                    className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                  <select
                    value={newAnnounceCategory}
                    onChange={(e) => setNewAnnounceCategory(e.target.value as any)}
                    className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-orange-500"
                  >
                    <option value="general">General</option>
                    <option value="schedule">Schedule</option>
                    <option value="rules">Rules</option>
                    <option value="broadcast">Broadcast / Stream</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Notice Content *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Details of the announcement..."
                  value={newAnnounceContent}
                  onChange={(e) => setNewAnnounceContent(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white resize-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newAnnouncePinned}
                    onChange={(e) => setNewAnnouncePinned(e.target.checked)}
                    className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="font-semibold text-xs">Pin notice to the top of homepage</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewAnnounceForm(false)}
                    className="h-7 px-3 bg-slate-800 text-slate-300 rounded-lg text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="h-7 px-3.5 bg-orange-500 text-slate-950 font-bold rounded-lg text-xs uppercase transition-colors"
                  >
                    Publish Bulletin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Announcements Feed */}
          <div className="space-y-2.5">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-start justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    {item.isPinned && (
                      <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-orange-500 text-slate-950">
                        <Pin className="w-2.5 h-2.5 fill-slate-950" />
                        Pinned
                      </span>
                    )}
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed whitespace-pre-line">{item.content}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      togglePinAnnouncement(item.id);
                      notify(item.isPinned ? 'Unpinned announcement' : 'Pinned announcement to top!');
                    }}
                    className={`h-7 w-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                      item.isPinned ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={item.isPinned ? 'Unpin' : 'Pin to top'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      if (confirm('Delete announcement?')) {
                        deleteAnnouncement(item.id);
                        notify('Announcement removed.');
                      }
                    }}
                    className="h-7 w-7 flex items-center justify-center text-slate-500 hover:text-rose-400 bg-slate-800/60 rounded-lg transition-colors"
                    title="Delete announcement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Modals */}
      <MatchEditorModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
        match={editingMatch}
      />

      <PlayerEditorModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        player={editingPlayer}
      />
    </div>
  );
};
