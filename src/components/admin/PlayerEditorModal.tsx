import React, { useState, useEffect, ChangeEvent } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import { X, Check, Image, UploadCloud } from 'lucide-react';

interface PlayerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null; // null means create new
}

export const PlayerEditorModal: React.FC<PlayerEditorModalProps> = ({ isOpen, onClose, player }) => {
  const { addPlayer, updatePlayer, selectedTournamentId } = useTournament();

  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('⚽');
  const [bio, setBio] = useState('');
  const [status, setStatus] = useState<'active' | 'suspended'>('active');

  useEffect(() => {
    if (player) {
      setFullName(player.fullName);
      setDisplayName(player.displayName);
      setProfilePhoto(player.profilePhoto);
      setTeamName(player.teamName);
      setTeamLogo(player.teamLogo || '⚽');
      setBio(player.bio || '');
      setStatus(player.status);
    } else {
      setFullName('');
      setDisplayName('');
      setProfilePhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
      setTeamName('');
      setTeamLogo('⚽');
      setBio('');
      setStatus('active');
    }
  }, [player, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfilePhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);

    // allow re-selecting same file later
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    const finalPhoto =
      profilePhoto.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

    if (player) {
      updatePlayer(player.id, {
        fullName: fullName.trim() || displayName.trim(),
        displayName: displayName.trim(),
        profilePhoto: finalPhoto,
        teamName: teamName.trim() || 'Unassigned FC',
        teamLogo: teamLogo.trim() || '⚽',
        bio: bio.trim(),
        status,
      });
    } else {
      addPlayer({
        fullName: fullName.trim() || displayName.trim(),
        displayName: displayName.trim(),
        profilePhoto: finalPhoto,
        teamName: teamName.trim() || 'Unassigned FC',
        teamLogo: teamLogo.trim() || '⚽',
        bio: bio.trim(),
        tournamentIds: [selectedTournamentId],
        status,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
              Admin Roster Management
            </span>
            <h2 className="text-xl font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mt-0.5">
              {player ? 'Edit Player Profile' : 'Add Tournament Player'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {/* Photo Upload + Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3 items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Player preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-8 h-8 text-slate-600" />
                )}
              </div>

              <label className="w-full cursor-pointer inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold uppercase tracking-wider transition-colors border border-slate-700">
                <UploadCloud className="w-4 h-4 text-orange-400" />
                <span>Upload from PC</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={profilePhoto}
                  onChange={(e) => setProfilePhoto(e.target.value)}
                  className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono"
                />
                <p className="mt-1 text-[10px] text-slate-500">
                  PC upload হলে ছবিটা browser data-তে save হবে। Live production-এর জন্য পরে Supabase Storage better.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Display / Gamer Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alex 'Striker' Mercer"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Full Legal / Real Name
              </label>
              <input
                type="text"
                placeholder="e.g. Alexander Mercer"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Assigned Team / Club
              </label>
              <input
                type="text"
                placeholder="e.g. Real Madrid CF"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Club Logo / Emoji
              </label>
              <input
                type="text"
                placeholder="⚽ or 👑"
                value={teamLogo}
                onChange={(e) => setTeamLogo(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 text-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Competitor Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'suspended')}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="active">Active (Eligible)</option>
                <option value="suspended">Suspended / Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Player Bio / Tactics Note
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Master tactician known for high-press possession and set-piece mastery..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full py-1.5 px-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              <span>{player ? 'Update Player' : 'Save Competitor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};