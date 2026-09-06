import React, { useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Match, MatchEvent, Player } from '../../types';
import { X, Plus, Trash2, Trophy, Clock, Check, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MatchEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match | null;
}

export const MatchEditorModal: React.FC<MatchEditorModalProps> = ({ isOpen, onClose, match }) => {
  const { players, enterMatchResult, editMatchResult, updateFixture } = useTournament();

  if (!isOpen || !match) return null;

  const homePlayer = players.find(p => p.id === match.homePlayerId);
  const awayPlayer = players.find(p => p.id === match.awayPlayerId);

  const [homeScore, setHomeScore] = useState<number>(match.homeScore !== null ? match.homeScore : 0);
  const [awayScore, setAwayScore] = useState<number>(match.awayScore !== null ? match.awayScore : 0);
  const [scheduledDate, setScheduledDate] = useState<string>(match.scheduledDate || '');
  const [scheduledTime, setScheduledTime] = useState<string>(match.scheduledTime || '');
  const [pitch, setPitch] = useState<string>(match.pitch || '');
  const [notes, setNotes] = useState<string>(match.notes || '');
  const [events, setEvents] = useState<MatchEvent[]>(match.events || []);

  // New Event Form State
  const [eventMinute, setEventMinute] = useState<number>(45);
  const [eventPlayerId, setEventPlayerId] = useState<string>(match.homePlayerId);
  const [eventAssistId, setEventAssistId] = useState<string>('');
  const [eventIsPenalty, setEventIsPenalty] = useState<boolean>(false);

  const handleAddGoal = () => {
    if (!eventPlayerId) return;
    const isHome = eventPlayerId === match.homePlayerId;
    const newEvent: MatchEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      matchId: match.id,
      playerId: eventPlayerId,
      team: isHome ? 'home' : 'away',
      type: 'goal',
      minute: Number(eventMinute) || 1,
      assistPlayerId: eventAssistId || undefined,
      isPenalty: eventIsPenalty
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);

    // Auto-update score count
    const homeGoals = updatedEvents.filter(e => e.type === 'goal' && (e.team === 'home' || e.playerId === match.homePlayerId)).length;
    const awayGoals = updatedEvents.filter(e => e.type === 'goal' && (e.team === 'away' || e.playerId === match.awayPlayerId)).length;
    setHomeScore(homeGoals);
    setAwayScore(awayGoals);

    // Reset event form
    setEventIsPenalty(false);
    setEventAssistId('');
  };

  const handleRemoveEvent = (eventId: string) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);

    // Recalculate suggested score
    const homeGoals = updatedEvents.filter(e => e.type === 'goal' && (e.team === 'home' || e.playerId === match.homePlayerId)).length;
    const awayGoals = updatedEvents.filter(e => e.type === 'goal' && (e.team === 'away' || e.playerId === match.awayPlayerId)).length;
    setHomeScore(homeGoals);
    setAwayScore(awayGoals);
  };

  const handleSave = () => {
    // 1. Update fixture schedule / pitch if changed
    updateFixture(match.id, {
      scheduledDate,
      scheduledTime,
      pitch,
      notes
    });

    // 2. Submit authoritative match score & events (triggers pure single-source-of-truth recalculation!)
    editMatchResult(match.id, Number(homeScore), Number(awayScore), events, notes);
    onClose();
  };

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
              Admin Match Center • {match.roundName}
            </span>
            <h2 className="text-xl font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mt-0.5">
              Edit Match Result & Goals
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Scoreboard Controller */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="grid grid-cols-11 items-center gap-2">
              {/* Home Player */}
              <div className="col-span-4 text-center">
                <img
                  src={homePlayer?.profilePhoto}
                  alt={homePlayer?.displayName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/60 mx-auto"
                />
                <span className="font-bold text-xs text-white block mt-1 truncate">
                  {homePlayer?.displayName}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {homePlayer?.teamName}
                </span>

                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Score:</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={homeScore}
                    onChange={(e) => setHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 py-1 px-1.5 text-center text-lg font-black text-white bg-slate-900 border border-slate-700 rounded-lg font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* VS Divider */}
              <div className="col-span-3 text-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                  FINAL SCORE
                </span>
                <span className="text-xl font-black text-slate-500 font-['Chakra_Petch',sans-serif]">
                  :
                </span>
                <span className="text-[10px] text-orange-400 block font-semibold">
                  Auto-Calculated
                </span>
              </div>

              {/* Away Player */}
              <div className="col-span-4 text-center">
                <img
                  src={awayPlayer?.profilePhoto}
                  alt={awayPlayer?.displayName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-slate-700 mx-auto"
                />
                <span className="font-bold text-xs text-white block mt-1 truncate">
                  {awayPlayer?.displayName}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {awayPlayer?.teamName}
                </span>

                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Score:</label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={awayScore}
                    onChange={(e) => setAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 py-1 px-1.5 text-center text-lg font-black text-white bg-slate-900 border border-slate-700 rounded-lg font-mono focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Goal Scorer & Assist Events Section */}
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[11px] uppercase tracking-wider text-white">
                  Add Goal Scorer & Assist Event
                </h4>
                <p className="text-[10px] text-slate-400">
                  Logs individual player goal timestamps, assists, and penalties
                </p>
              </div>
            </div>

            {/* Form inputs for new goal event */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Scorer
                </label>
                <select
                  value={eventPlayerId}
                  onChange={(e) => setEventPlayerId(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value={match.homePlayerId}>{homePlayer?.displayName} (Home)</option>
                  <option value={match.awayPlayerId}>{awayPlayer?.displayName} (Away)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Minute (1-120')
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={eventMinute}
                  onChange={(e) => setEventMinute(Number(e.target.value))}
                  className="w-full py-1.5 px-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Assist (Optional)
                </label>
                <select
                  value={eventAssistId}
                  onChange={(e) => setEventAssistId(e.target.value)}
                  className="w-full py-1.5 px-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">None / Solo</option>
                  {players.map(p => (
                    <option key={p.id} value={p.id}>{p.displayName} ({p.teamName})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={eventIsPenalty}
                    onChange={(e) => setEventIsPenalty(e.target.checked)}
                    className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-[10px] font-semibold">Penalty?</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="flex-1 h-8 py-1 px-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Goal</span>
                </button>
              </div>
            </div>

            {/* List of current events */}
            {events.length > 0 && (
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">
                  Logged Goals & Events ({events.length})
                </span>
                {events.map((evt) => {
                  const scorer = playerMap.get(evt.playerId);
                  const assist = evt.assistPlayerId ? playerMap.get(evt.assistPlayerId) : null;
                  return (
                    <div
                      key={evt.id}
                      className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 font-mono font-bold">{evt.minute}'</span>
                        <span className="font-bold text-white">⚽ {scorer?.displayName}</span>
                        {assist && (
                          <span className="text-slate-400 text-[11px]">(👟 Assist: {assist.displayName})</span>
                        )}
                        {evt.isPenalty && (
                          <span className="text-[10px] bg-orange-950/60 text-orange-400 px-1 py-0.5 rounded font-bold">
                            Penalty
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveEvent(evt.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Schedule & Pitch settings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Kick-off Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Pitch / Station
              </label>
              <input
                type="text"
                placeholder="Station / Stadium"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Match Report / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Stunning last minute counter-attack winner in extra time..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full py-2 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Recalculation Notice */}
          <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg flex items-center gap-2 text-xs text-orange-300">
            <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Saving this result will deterministically recalculate all league standings, goal difference, golden boot, clean sheets, and head-to-head records automatically.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-8 px-4 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Recalculate Standings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
