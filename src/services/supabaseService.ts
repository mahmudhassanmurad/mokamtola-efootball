import { supabase } from '../lib/supabaseClient';
import { Player } from '../types';

export async function fetchPublicSettings() {
  const { data, error } = await supabase
    .from('website_settings_public')
    .select('*')
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function fetchPublicTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function fetchPublicSeasons() {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function fetchPublicPlayers() {
  const { data, error } = await supabase
    .from('players')
    .select(`
      id,
      full_name,
      facebook_url,
      display_name,
      profile_photo,
      team_name,
      team_logo,
      bio,
      status,
      joined_at,
      tournament_players (
        tournament_id
      )
    `)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row: any): Player => ({
    id: row.id,
    fullName: row.full_name ?? '',
    facebookUrl: row.facebook_url ?? '',
    displayName: row.display_name ?? '',
    profilePhoto: row.profile_photo ?? '',
    teamName: row.team_name ?? '',
    teamLogo: row.team_logo ?? '',
    bio: row.bio ?? '',
    status:
      row.status === 'suspended'
        ? 'suspended'
        : 'active',
    joinedAt: row.joined_at ?? '',
    tournamentIds: (row.tournament_players ?? []).map(
      (item: any) => item.tournament_id
    ),
  }));
}

export async function fetchPublicMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('scheduled_date', { ascending: true })
    .order('round', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function fetchPublicMatchEvents() {
  const { data, error } = await supabase
    .from('match_events')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function fetchPublicAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function fetchPublicRules() {
  const { data, error } = await supabase
    .from('tournament_rules')
    .select('*')
    .order('order', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

export async function fetchPublicRoadmap() {
  const { data, error } = await supabase
    .from('roadmap_stages')
    .select('*')
    .order('stage_order', { ascending: true });

  if (error) throw error;

  return data ?? [];
}

interface PlayerWriteData {
  fullName: string;
  facebookUrl?: string;
  displayName: string;
  profilePhoto: string;
  teamName: string;
  teamLogo?: string;
  bio?: string;
  status: 'active' | 'suspended';
}

function playerToDatabase(data: PlayerWriteData) {
  return {
    full_name: data.fullName,
    facebook_url: data.facebookUrl || null,
    display_name: data.displayName,
    profile_photo: data.profilePhoto,
    team_name: data.teamName,
    team_logo: data.teamLogo || null,
    bio: data.bio || null,
    status: data.status,
  };
}

/*
 * Temporary compatibility bridge while tournaments are
 * still partially loaded from legacy seed/local data.
 *
 * We never hard-code database UUIDs here.
 */
const LEGACY_TOURNAMENT_NAMES: Record<string, string> = {
  'tourney-pes-s1':
    'PES Premier League: Champions Series',

  'tourney-pes-winter-2025':
    'PES Winter Cup Championship 2025',
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

async function resolveTournamentId(
  tournamentId: string
): Promise<string> {
  const value = tournamentId.trim();

  if (!value) {
    throw new Error(
      'No tournament selected for this player.'
    );
  }

  /*
   * If the frontend already has a real database UUID,
   * use it directly.
   */
  if (isUuid(value)) {
    return value;
  }

  /*
   * Legacy generated app used text IDs such as
   * "tourney-pes-s1". Resolve those through the
   * authoritative database tournament name.
   */
  const tournamentName =
    LEGACY_TOURNAMENT_NAMES[value];

  if (!tournamentName) {
    throw new Error(
      `Could not map legacy tournament "${value}" to a Supabase tournament.`
    );
  }

  const { data, error } = await supabase
    .from('tournaments')
    .select('id')
    .eq('name', tournamentName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.id) {
    throw new Error(
      `Tournament "${tournamentName}" was not found in Supabase.`
    );
  }

  return data.id;
}

export async function createPlayerInSupabase(
  data: PlayerWriteData,
  tournamentId: string
): Promise<Player> {
  /*
   * Resolve legacy seed tournament ID BEFORE creating
   * the Player, so an invalid tournament cannot leave
   * a temporary/orphan Player row.
   */
  const databaseTournamentId =
    await resolveTournamentId(tournamentId);

  const { data: playerRow, error: playerError } =
    await supabase
      .from('players')
      .insert(playerToDatabase(data))
      .select()
      .single();

  if (playerError) {
    throw playerError;
  }

  const { error: participationError } =
    await supabase
      .from('tournament_players')
      .insert({
        tournament_id: databaseTournamentId,
        player_id: playerRow.id,
      });

  if (participationError) {
    /*
     * Compensating cleanup.
     *
     * This is not a true SQL transaction, but prevents
     * the Player row being intentionally kept when the
     * participation insert fails.
     */
    const { error: cleanupError } = await supabase
      .from('players')
      .delete()
      .eq('id', playerRow.id);

    if (cleanupError) {
      console.error(
        'Player participation failed and player cleanup also failed:',
        cleanupError
      );
    }

    throw participationError;
  }

  return {
    id: playerRow.id,
    fullName: playerRow.full_name ?? '',
    facebookUrl: playerRow.facebook_url ?? '',
    displayName: playerRow.display_name ?? '',
    profilePhoto: playerRow.profile_photo ?? '',
    teamName: playerRow.team_name ?? '',
    teamLogo: playerRow.team_logo ?? '',
    bio: playerRow.bio ?? '',
    tournamentIds: [databaseTournamentId],
    status:
      playerRow.status === 'suspended'
        ? 'suspended'
        : 'active',
    joinedAt:
      playerRow.joined_at ??
      new Date().toISOString().split('T')[0],
  };
}

export async function updatePlayerInSupabase(
  id: string,
  updates: Partial<PlayerWriteData>
): Promise<void> {
  const dbUpdates: Record<string, unknown> = {};

  if (updates.fullName !== undefined) {
    dbUpdates.full_name = updates.fullName;
  }

  if (updates.facebookUrl !== undefined) {
    dbUpdates.facebook_url =
      updates.facebookUrl || null;
  }

  if (updates.displayName !== undefined) {
    dbUpdates.display_name = updates.displayName;
  }

  if (updates.profilePhoto !== undefined) {
    dbUpdates.profile_photo = updates.profilePhoto;
  }

  if (updates.teamName !== undefined) {
    dbUpdates.team_name = updates.teamName;
  }

  if (updates.teamLogo !== undefined) {
    dbUpdates.team_logo =
      updates.teamLogo || null;
  }

  if (updates.bio !== undefined) {
    dbUpdates.bio = updates.bio || null;
  }

  if (updates.status !== undefined) {
    dbUpdates.status = updates.status;
  }

  if (Object.keys(dbUpdates).length === 0) {
    return;
  }

  const { error } = await supabase
    .from('players')
    .update(dbUpdates)
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function deletePlayerFromSupabase(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function uploadPlayerPhoto(
  file: File
): Promise<string> {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      'Only JPG, PNG, or WebP images are allowed.'
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      'Player photo must be 5 MB or smaller.'
    );
  }

  const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() ||
    (file.type === 'image/png'
      ? 'png'
      : file.type === 'image/webp'
        ? 'webp'
        : 'jpg');

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const filePath =
    `players/${fileName}`;

  const { error } = await supabase.storage
    .from('player-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from('player-photos')
    .getPublicUrl(filePath);

  if (!data.publicUrl) {
    throw new Error(
      'Could not generate player photo URL.'
    );
  }

  return data.publicUrl;
}