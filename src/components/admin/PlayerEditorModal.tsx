import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTournament } from '../../context/TournamentContext';
import { Player } from '../../types';
import { uploadPlayerPhoto } from '../../services/supabaseService';
import {
  X,
  Check,
  Image,
  UploadCloud,
  Facebook,
  Loader2,
} from 'lucide-react';

interface PlayerEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
}

const DEFAULT_PHOTO =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400';

function normalizeFacebookUrl(value: string): string {
  const input = value.trim();

  if (!input) return '';

  if (/^https?:\/\//i.test(input)) {
    return input;
  }

  if (/^(www\.)?facebook\.com\//i.test(input)) {
    return `https://${input}`;
  }

  const cleanId = input
    .replace(/^@/, '')
    .replace(/^\/+|\/+$/g, '');

  return `https://www.facebook.com/${cleanId}`;
}

export const PlayerEditorModal: React.FC<PlayerEditorModalProps> = ({
  isOpen,
  onClose,
  player,
}) => {
  const {
    addPlayer,
    updatePlayer,
    selectedTournamentId,
  } = useTournament();

  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const [teamName, setTeamName] = useState('');
  const [teamLogo, setTeamLogo] = useState('⚽');
  const [bio, setBio] = useState('');
  const [status, setStatus] =
    useState<'active' | 'suspended'>('active');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setError(null);
    setSelectedPhoto(null);
    setLocalPreview(null);
    setIsSaving(false);

    if (player) {
      setFullName(player.fullName || '');
      setDisplayName(player.displayName || '');
      setFacebookUrl(player.facebookUrl || '');
      setProfilePhoto(player.profilePhoto || '');
      setTeamName(player.teamName || '');
      setTeamLogo(player.teamLogo || '⚽');
      setBio(player.bio || '');
      setStatus(player.status);
    } else {
      setFullName('');
      setDisplayName('');
      setFacebookUrl('');
      setProfilePhoto('');
      setTeamName('');
      setTeamLogo('⚽');
      setBio('');
      setStatus('active');
    }
  }, [player, isOpen]);

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const previewPhoto = useMemo(
    () => localPreview || profilePhoto || DEFAULT_PHOTO,
    [localPreview, profilePhoto]
  );

  if (!isOpen) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setError(null);

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG or WebP player photos are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Player photo must be 5 MB or smaller.');
      e.target.value = '';
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const preview = URL.createObjectURL(file);

    setSelectedPhoto(file);
    setLocalPreview(preview);

    e.target.value = '';
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving) return;

    const name = fullName.trim();
    const gamerName = displayName.trim();

    if (!name) {
      setError('Player Name is required.');
      return;
    }

    if (!gamerName) {
      setError('Display / Gamer Name is required.');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      let finalPhoto = profilePhoto.trim();

      if (selectedPhoto) {
        finalPhoto = await uploadPlayerPhoto(selectedPhoto);
      }

      if (!finalPhoto) {
        finalPhoto = DEFAULT_PHOTO;
      }

      const normalizedFacebookUrl =
        normalizeFacebookUrl(facebookUrl);

      const commonData = {
        fullName: name,
        facebookUrl: normalizedFacebookUrl,
        displayName: gamerName,
        profilePhoto: finalPhoto,
        teamName: teamName.trim() || 'Unassigned',
        teamLogo: teamLogo.trim() || '⚽',
        bio: bio.trim(),
        status,
      };

      if (player) {
        await Promise.resolve(
          updatePlayer(player.id, commonData)
        );
      } else {
        await Promise.resolve(
          addPlayer({
            ...commonData,
            tournamentIds: [selectedTournamentId],
          })
        );
      }

      onClose();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Could not save the player. Please try again.';

      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl my-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
              Admin Player Management
            </span>

            <h2 className="text-xl font-black text-white font-['Chakra_Petch',sans-serif] uppercase tracking-wide mt-0.5">
              {player ? 'Edit Player' : 'Add Player'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors"
            aria-label="Close player editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-[130px_1fr] gap-4 items-start">
            <div className="flex flex-col items-center gap-2">
              <div className="w-28 h-28 rounded-2xl border border-slate-700 bg-slate-950 overflow-hidden flex items-center justify-center">
                {previewPhoto ? (
                  <img
                    src={previewPhoto}
                    alt="Player preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-8 h-8 text-slate-600" />
                )}
              </div>

              <label
                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold uppercase tracking-wider border border-slate-700 transition-colors ${
                  isSaving
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                <UploadCloud className="w-4 h-4 text-orange-400" />
                <span>Choose Photo</span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={isSaving}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Name *
                </label>

                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Murad"
                  disabled={isSaving}
                  className="w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Facebook ID / Profile Link
                </label>

                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />

                  <input
                    type="text"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="username or https://facebook.com/username"
                    disabled={isSaving}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 disabled:opacity-60"
                  />
                </div>

                <p className="mt-1 text-[10px] text-slate-500">
                  Facebook username/ID অথবা full profile link দিতে পারো।
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Display / Gamer Name *
            </label>

            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Murad PES"
              disabled={isSaving}
              className="w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 disabled:opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Assigned Team / Club
              </label>

              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Real Madrid CF"
                disabled={isSaving}
                className="w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                Club Logo
              </label>

              <input
                type="text"
                value={teamLogo}
                onChange={(e) => setTeamLogo(e.target.value)}
                placeholder="⚽"
                disabled={isSaving}
                className="w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white text-center focus:outline-none focus:border-orange-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Player Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as 'active' | 'suspended'
                )
              }
              disabled={isSaving}
              className="w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-orange-500 disabled:opacity-60"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended / Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
              Player Bio / Note
            </label>

            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Optional player information..."
              disabled={isSaving}
              className="w-full py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 resize-none disabled:opacity-60"
            />
          </div>

          <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg text-[10px] text-slate-400">
            Player photos are uploaded securely to Supabase Storage.
            JPG, PNG and WebP only. Maximum size 5 MB.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="h-9 px-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="h-9 px-4 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}

              <span>
                {isSaving
                  ? selectedPhoto
                    ? 'Uploading & Saving...'
                    : 'Saving...'
                  : player
                    ? 'Update Player'
                    : 'Save Player'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};