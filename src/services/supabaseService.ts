import { supabase } from '../lib/supabaseClient';
import { Match, MatchEvent, Player } from '../types';

/*
 * =========================================================
 * LEGACY COMPATIBILITY
 * =========================================================
 *
 * The generated frontend still uses legacy text IDs for
 * tournaments and seasons.
 *
 * Supabase uses UUIDs.
 *
 * Database writes always resolve to UUID.
 * Match reads convert known tournament/season names back
 * to the legacy frontend IDs temporarily so existing pages,
 * filters and stats continue to work during migration.
 */

const LEGACY_TOURNAMENT_NAMES: Record<string, string> = {
  'tourney-pes-s1':
    'PES Premier League: Champions Series',

  'tourney-pes-winter-2025':
    'PES Winter Cup Championship 2025',
};

const LEGACY_SEASON_NAMES: Record<string, string> = {
  'season-1':
    'Season 1 (Current)',

  'season-winter-2025':
    'Winter 2025 (Completed)',
};

function findLegacyIdByName(
  map: Record<string, string>,
  name?: string | null
): string | null {
  if (!name) {
    return null;
  }

  const match = Object.entries(map).find(
    ([, mappedName]) =>
      mappedName === name
  );

  return match?.[0] ?? null;
}

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
      'No tournament selected.'
    );
  }

  if (isUuid(value)) {
    return value;
  }

  const tournamentName =
    LEGACY_TOURNAMENT_NAMES[value];

  if (!tournamentName) {
    throw new Error(
      `Could not map legacy tournament "${value}" to Supabase.`
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

async function resolveSeasonId(
  seasonId: string
): Promise<string | null> {
  const value = seasonId.trim();

  if (!value) {
    return null;
  }

  if (isUuid(value)) {
    return value;
  }

  const seasonName =
    LEGACY_SEASON_NAMES[value];

  if (!seasonName) {
    throw new Error(
      `Could not map legacy season "${value}" to Supabase.`
    );
  }

  const { data, error } = await supabase
    .from('seasons')
    .select('id')
    .eq('name', seasonName)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data?.id) {
    throw new Error(
      `Season "${seasonName}" was not found in Supabase.`
    );
  }

  return data.id;
}

/*
 * =========================================================
 * PUBLIC READS
 * =========================================================
 */

export async function fetchPublicSettings() {
  const { data, error } = await supabase
    .from('website_settings_public')
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function fetchPublicTournaments() {
  const { data, error } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchPublicSeasons() {
  const { data, error } = await supabase
    .from('seasons')
    .select('*')
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchPublicPlayers(): Promise<Player[]> {
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
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    (row: any): Player => ({
      id:
        row.id,

      fullName:
        row.full_name ?? '',

      facebookUrl:
        row.facebook_url ?? '',

      displayName:
        row.display_name ?? '',

      profilePhoto:
        row.profile_photo ?? '',

      teamName:
        row.team_name ?? '',

      teamLogo:
        row.team_logo ?? '',

      bio:
        row.bio ?? '',

      status:
        row.status === 'suspended'
          ? 'suspended'
          : 'active',

      joinedAt:
        row.joined_at ?? '',

      tournamentIds:
        (
          row.tournament_players ??
          []
        ).map(
          (item: any) =>
            item.tournament_id
        ),
    })
  );
}

/*
 * =========================================================
 * MATCH READ / MAPPING
 * =========================================================
 */

function databaseEventToMatchEvent(
  row: any
): MatchEvent {
  return {
    id:
      row.id,

    matchId:
      row.match_id,

    type:
      row.type,

    playerId:
      row.player_id,

    assistPlayerId:
      row.assist_player_id ??
      undefined,

    minute:
      row.minute ?? 0,

    team:
      row.team,

    isPenalty:
      row.is_penalty ?? false,

    isOwnGoal:
      row.is_own_goal ?? false,
  };
}

function databaseMatchToMatch(
  row: any,
  events: MatchEvent[]
): Match {
  const tournamentName =
    row.tournaments?.name ??
    null;

  const seasonName =
    row.seasons?.name ??
    null;

  const frontendTournamentId =
    findLegacyIdByName(
      LEGACY_TOURNAMENT_NAMES,
      tournamentName
    ) ??
    row.tournament_id;

  const frontendSeasonId =
    findLegacyIdByName(
      LEGACY_SEASON_NAMES,
      seasonName
    ) ??
    row.season_id ??
    '';

  return {
    id:
      row.id,

    tournamentId:
      frontendTournamentId,

    seasonId:
      frontendSeasonId,

    round:
      row.round ?? 1,

    roundName:
      row.round_name ??
      `Round ${row.round ?? 1}`,

    homePlayerId:
      row.home_player_id,

    awayPlayerId:
      row.away_player_id,

    homeScore:
      row.home_score === null ||
      row.home_score === undefined
        ? null
        : Number(row.home_score),

    awayScore:
      row.away_score === null ||
      row.away_score === undefined
        ? null
        : Number(row.away_score),

    status:
      row.status === 'completed'
        ? 'completed'
        : row.status === 'live'
          ? 'live'
          : 'scheduled',

    scheduledDate:
      row.scheduled_date ?? '',

    scheduledTime:
      row.scheduled_time ?? '',

    pitch:
      row.pitch ?? '',

    notes:
      row.notes ?? undefined,

    events,
  };
}

export async function fetchPublicMatchEvents(): Promise<
  MatchEvent[]
> {
  const { data, error } = await supabase
    .from('match_events')
    .select('*')
    .order('created_at', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    databaseEventToMatchEvent
  );
}

export async function fetchPublicMatches(): Promise<
  Match[]
> {
  const [
    matchesResult,
    eventsResult,
  ] = await Promise.all([
    supabase
      .from('matches')
      .select(`
        *,
        tournaments (
          name
        ),
        seasons (
          name
        )
      `)
      .order('scheduled_date', {
        ascending: true,
      })
      .order('round', {
        ascending: true,
      }),

    supabase
      .from('match_events')
      .select('*')
      .order('created_at', {
        ascending: true,
      }),
  ]);

  if (matchesResult.error) {
    throw matchesResult.error;
  }

  if (eventsResult.error) {
    throw eventsResult.error;
  }

  const eventsByMatch =
    new Map<string, MatchEvent[]>();

  for (
    const row of
    eventsResult.data ?? []
  ) {
    const event =
      databaseEventToMatchEvent(
        row
      );

    const current =
      eventsByMatch.get(
        event.matchId
      ) ?? [];

    current.push(event);

    eventsByMatch.set(
      event.matchId,
      current
    );
  }

  return (
    matchesResult.data ?? []
  ).map((row: any) =>
    databaseMatchToMatch(
      row,
      eventsByMatch.get(
        row.id
      ) ?? []
    )
  );
}

export async function fetchPublicAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('is_pinned', {
      ascending: false,
    })
    .order('created_at', {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchPublicRules() {
  const { data, error } = await supabase
    .from('tournament_rules')
    .select('*')
    .order('order', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function fetchPublicRoadmap() {
  const { data, error } = await supabase
    .from('roadmap_stages')
    .select('*')
    .order('stage_order', {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/*
 * =========================================================
 * PLAYER WRITES
 * =========================================================
 */

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

function playerToDatabase(
  data: PlayerWriteData
) {
  return {
    full_name:
      data.fullName,

    facebook_url:
      data.facebookUrl || null,

    display_name:
      data.displayName,

    profile_photo:
      data.profilePhoto,

    team_name:
      data.teamName,

    team_logo:
      data.teamLogo || null,

    bio:
      data.bio || null,

    status:
      data.status,
  };
}

export async function createPlayerInSupabase(
  data: PlayerWriteData,
  tournamentId: string
): Promise<Player> {
  const databaseTournamentId =
    await resolveTournamentId(
      tournamentId
    );

  const {
    data: playerRow,
    error: playerError,
  } = await supabase
    .from('players')
    .insert(
      playerToDatabase(data)
    )
    .select()
    .single();

  if (playerError) {
    throw playerError;
  }

  const {
    error: participationError,
  } = await supabase
    .from('tournament_players')
    .insert({
      tournament_id:
        databaseTournamentId,

      player_id:
        playerRow.id,
    });

  if (participationError) {
    const {
      error: cleanupError,
    } = await supabase
      .from('players')
      .delete()
      .eq(
        'id',
        playerRow.id
      );

    if (cleanupError) {
      console.error(
        'Player participation failed and player cleanup also failed:',
        cleanupError
      );
    }

    throw participationError;
  }

  return {
    id:
      playerRow.id,

    fullName:
      playerRow.full_name ?? '',

    facebookUrl:
      playerRow.facebook_url ?? '',

    displayName:
      playerRow.display_name ?? '',

    profilePhoto:
      playerRow.profile_photo ?? '',

    teamName:
      playerRow.team_name ?? '',

    teamLogo:
      playerRow.team_logo ?? '',

    bio:
      playerRow.bio ?? '',

    tournamentIds: [
      databaseTournamentId,
    ],

    status:
      playerRow.status ===
      'suspended'
        ? 'suspended'
        : 'active',

    joinedAt:
      playerRow.joined_at ??
      new Date()
        .toISOString()
        .split('T')[0],
  };
}

export async function updatePlayerInSupabase(
  id: string,
  updates: Partial<PlayerWriteData>
): Promise<void> {
  const dbUpdates: Record<
    string,
    unknown
  > = {};

  if (
    updates.fullName !==
    undefined
  ) {
    dbUpdates.full_name =
      updates.fullName;
  }

  if (
    updates.facebookUrl !==
    undefined
  ) {
    dbUpdates.facebook_url =
      updates.facebookUrl ||
      null;
  }

  if (
    updates.displayName !==
    undefined
  ) {
    dbUpdates.display_name =
      updates.displayName;
  }

  if (
    updates.profilePhoto !==
    undefined
  ) {
    dbUpdates.profile_photo =
      updates.profilePhoto;
  }

  if (
    updates.teamName !==
    undefined
  ) {
    dbUpdates.team_name =
      updates.teamName;
  }

  if (
    updates.teamLogo !==
    undefined
  ) {
    dbUpdates.team_logo =
      updates.teamLogo ||
      null;
  }

  if (
    updates.bio !== undefined
  ) {
    dbUpdates.bio =
      updates.bio || null;
  }

  if (
    updates.status !==
    undefined
  ) {
    dbUpdates.status =
      updates.status;
  }

  if (
    Object.keys(
      dbUpdates
    ).length === 0
  ) {
    return;
  }

  const { error } =
    await supabase
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
  const { error } =
    await supabase
      .from('players')
      .delete()
      .eq('id', id);

  if (error) {
    throw error;
  }
}

/*
 * =========================================================
 * MATCH WRITES
 * =========================================================
 */

type MatchCreateData =
  Omit<
    Match,
    'id' | 'events'
  >;

async function matchCreateToDatabase(
  match: MatchCreateData
) {
  const [
    tournamentId,
    seasonId,
  ] = await Promise.all([
    resolveTournamentId(
      match.tournamentId
    ),

    resolveSeasonId(
      match.seasonId
    ),
  ]);

  if (
    !isUuid(
      match.homePlayerId
    )
  ) {
    throw new Error(
      'Home Player does not have a valid Supabase UUID.'
    );
  }

  if (
    !isUuid(
      match.awayPlayerId
    )
  ) {
    throw new Error(
      'Away Player does not have a valid Supabase UUID.'
    );
  }

  return {
    tournament_id:
      tournamentId,

    season_id:
      seasonId,

    round:
      match.round,

    round_name:
      match.roundName ||
      `Round ${match.round}`,

    home_player_id:
      match.homePlayerId,

    away_player_id:
      match.awayPlayerId,

    home_score:
      match.homeScore,

    away_score:
      match.awayScore,

    status:
      match.status,

    scheduled_date:
      match.scheduledDate ||
      null,

    scheduled_time:
      match.scheduledTime ||
      null,

    pitch:
      match.pitch ||
      null,

    notes:
      match.notes ||
      null,
  };
}

export async function createMatchInSupabase(
  match: MatchCreateData
): Promise<Match> {
  const payload =
    await matchCreateToDatabase(
      match
    );

  const { data, error } =
    await supabase
      .from('matches')
      .insert(payload)
      .select(`
        *,
        tournaments (
          name
        ),
        seasons (
          name
        )
      `)
      .single();

  if (error) {
    throw error;
  }

  return databaseMatchToMatch(
    data,
    []
  );
}

export async function updateMatchInSupabase(
  id: string,
  updates: Partial<Match>
): Promise<void> {
  if (!isUuid(id)) {
    throw new Error(
      'This fixture still has a legacy local ID and must be migrated before it can be updated.'
    );
  }

  const payload: Record<
    string,
    unknown
  > = {};

  if (
    updates.tournamentId !==
    undefined
  ) {
    payload.tournament_id =
      await resolveTournamentId(
        updates.tournamentId
      );
  }

  if (
    updates.seasonId !==
    undefined
  ) {
    payload.season_id =
      await resolveSeasonId(
        updates.seasonId
      );
  }

  if (
    updates.round !== undefined
  ) {
    payload.round =
      updates.round;
  }

  if (
    updates.roundName !==
    undefined
  ) {
    payload.round_name =
      updates.roundName ||
      null;
  }

  if (
    updates.homePlayerId !==
    undefined
  ) {
    if (
      !isUuid(
        updates.homePlayerId
      )
    ) {
      throw new Error(
        'Home Player does not have a valid Supabase UUID.'
      );
    }

    payload.home_player_id =
      updates.homePlayerId;
  }

  if (
    updates.awayPlayerId !==
    undefined
  ) {
    if (
      !isUuid(
        updates.awayPlayerId
      )
    ) {
      throw new Error(
        'Away Player does not have a valid Supabase UUID.'
      );
    }

    payload.away_player_id =
      updates.awayPlayerId;
  }

  if (
    updates.homeScore !==
    undefined
  ) {
    payload.home_score =
      updates.homeScore;
  }

  if (
    updates.awayScore !==
    undefined
  ) {
    payload.away_score =
      updates.awayScore;
  }

  if (
    updates.status !==
    undefined
  ) {
    payload.status =
      updates.status;
  }

  if (
    updates.scheduledDate !==
    undefined
  ) {
    payload.scheduled_date =
      updates.scheduledDate ||
      null;
  }

  if (
    updates.scheduledTime !==
    undefined
  ) {
    payload.scheduled_time =
      updates.scheduledTime ||
      null;
  }

  if (
    updates.pitch !== undefined
  ) {
    payload.pitch =
      updates.pitch || null;
  }

  if (
    updates.notes !== undefined
  ) {
    payload.notes =
      updates.notes || null;
  }

  if (
    Object.keys(
      payload
    ).length === 0
  ) {
    return;
  }

  const { error } =
    await supabase
      .from('matches')
      .update(payload)
      .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function deleteMatchFromSupabase(
  id: string
): Promise<void> {
  if (!isUuid(id)) {
    throw new Error(
      'This fixture still has a legacy local ID and must be migrated before deletion.'
    );
  }

  const { error } =
    await supabase
      .from('matches')
      .delete()
      .eq('id', id);

  if (error) {
    throw error;
  }
}

/*
 * =========================================================
 * MATCH RESULT + EVENTS
 * =========================================================
 */

function eventToDatabase(
  event: MatchEvent,
  databaseMatchId: string
) {
  if (
    !isUuid(
      event.playerId
    )
  ) {
    throw new Error(
      'Goal scorer does not have a valid Supabase UUID.'
    );
  }

  if (
    event.assistPlayerId &&
    !isUuid(
      event.assistPlayerId
    )
  ) {
    throw new Error(
      'Assist Player does not have a valid Supabase UUID.'
    );
  }

  return {
    match_id:
      databaseMatchId,

    player_id:
      event.playerId,

    assist_player_id:
      event.assistPlayerId ||
      null,

    type:
      event.type,

    minute:
      event.minute,

    team:
      event.team,

    is_penalty:
      event.isPenalty ??
      false,

    is_own_goal:
      event.isOwnGoal ??
      false,
  };
}

export async function saveMatchResultInSupabase(
  matchId: string,
  homeScore: number,
  awayScore: number,
  events: MatchEvent[],
  notes?: string
): Promise<void> {
  if (!isUuid(matchId)) {
    throw new Error(
      'This fixture must be migrated to Supabase before a result can be saved.'
    );
  }

  const { error: matchError } =
    await supabase
      .from('matches')
      .update({
        home_score:
          homeScore,

        away_score:
          awayScore,

        status:
          'completed',

        notes:
          notes || null,
      })
      .eq(
        'id',
        matchId
      );

  if (matchError) {
    throw matchError;
  }

  const {
    error: deleteEventsError,
  } = await supabase
    .from('match_events')
    .delete()
    .eq(
      'match_id',
      matchId
    );

  if (deleteEventsError) {
    throw deleteEventsError;
  }

  if (
    events.length === 0
  ) {
    return;
  }

  const eventRows =
    events.map(
      (event) =>
        eventToDatabase(
          event,
          matchId
        )
    );

  const {
    error: insertEventsError,
  } = await supabase
    .from('match_events')
    .insert(eventRows);

  if (insertEventsError) {
    throw insertEventsError;
  }
}

export async function deleteMatchResultFromSupabase(
  matchId: string
): Promise<void> {
  if (!isUuid(matchId)) {
    throw new Error(
      'This fixture must be migrated to Supabase before its result can be deleted.'
    );
  }

  const {
    error: eventError,
  } = await supabase
    .from('match_events')
    .delete()
    .eq(
      'match_id',
      matchId
    );

  if (eventError) {
    throw eventError;
  }

  const {
    error: matchError,
  } = await supabase
    .from('matches')
    .update({
      home_score: null,
      away_score: null,
      status: 'scheduled',
    })
    .eq(
      'id',
      matchId
    );

  if (matchError) {
    throw matchError;
  }
}

/*
 * =========================================================
 * ONE-TIME LEGACY FIXTURE MIGRATION
 * =========================================================
 */

export async function migrateLegacyScheduledMatches(
  legacyMatches: Match[]
): Promise<Match[]> {
  if (
    legacyMatches.length === 0
  ) {
    return [];
  }

  const nonScheduledMatch =
    legacyMatches.find(
      (match) =>
        match.status !==
          'scheduled' ||
        match.homeScore !==
          null ||
        match.awayScore !==
          null ||
        (
          match.events?.length ??
          0
        ) > 0
    );

  if (nonScheduledMatch) {
    throw new Error(
      'Legacy migration stopped because at least one local match already contains a result or event.'
    );
  }

  /*
   * Prevent duplicate migration.
   */
  const {
    count,
    error: countError,
  } = await supabase
    .from('matches')
    .select('id', {
      count: 'exact',
      head: true,
    });

  if (countError) {
    throw countError;
  }

  if (
    (count ?? 0) > 0
  ) {
    throw new Error(
      'Supabase already contains matches. Automatic legacy migration was stopped to prevent duplicate fixtures.'
    );
  }

  const firstTournamentId =
    legacyMatches[0]
      .tournamentId;

  const firstSeasonId =
    legacyMatches[0]
      .seasonId;

  const [
    databaseTournamentId,
    databaseSeasonId,
  ] = await Promise.all([
    resolveTournamentId(
      firstTournamentId
    ),

    resolveSeasonId(
      firstSeasonId
    ),
  ]);

  const payloads =
    legacyMatches.map(
      (match) => {
        if (
          !isUuid(
            match.homePlayerId
          )
        ) {
          throw new Error(
            `Fixture ${match.id} has an invalid Home Player ID.`
          );
        }

        if (
          !isUuid(
            match.awayPlayerId
          )
        ) {
          throw new Error(
            `Fixture ${match.id} has an invalid Away Player ID.`
          );
        }

        if (
          match.tournamentId !==
          firstTournamentId
        ) {
          throw new Error(
            'Legacy fixtures contain more than one tournament. Automatic migration stopped.'
          );
        }

        if (
          match.seasonId !==
          firstSeasonId
        ) {
          throw new Error(
            'Legacy fixtures contain more than one season. Automatic migration stopped.'
          );
        }

        return {
          tournament_id:
            databaseTournamentId,

          season_id:
            databaseSeasonId,

          round:
            match.round,

          round_name:
            match.roundName ||
            `Round ${match.round}`,

          home_player_id:
            match.homePlayerId,

          away_player_id:
            match.awayPlayerId,

          home_score:
            null,

          away_score:
            null,

          status:
            'scheduled',

          scheduled_date:
            match.scheduledDate ||
            null,

          scheduled_time:
            match.scheduledTime ||
            null,

          pitch:
            match.pitch || null,

          notes:
            match.notes || null,
        };
      }
    );

  const { data, error } =
    await supabase
      .from('matches')
      .insert(payloads)
      .select(`
        *,
        tournaments (
          name
        ),
        seasons (
          name
        )
      `);

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ).map((row: any) =>
    databaseMatchToMatch(
      row,
      []
    )
  );
}

/*
 * =========================================================
 * PLAYER PHOTO STORAGE
 * =========================================================
 */

export async function uploadPlayerPhoto(
  file: File
): Promise<string> {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (
    !allowedTypes.includes(
      file.type
    )
  ) {
    throw new Error(
      'Only JPG, PNG, or WebP images are allowed.'
    );
  }

  if (
    file.size >
    5 * 1024 * 1024
  ) {
    throw new Error(
      'Player photo must be 5 MB or smaller.'
    );
  }

  const extension =
    file.name
      .split('.')
      .pop()
      ?.toLowerCase() ||
    (
      file.type ===
      'image/png'
        ? 'png'
        : file.type ===
            'image/webp'
          ? 'webp'
          : 'jpg'
    );

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const filePath =
    `players/${fileName}`;

  const { error } =
    await supabase.storage
      .from(
        'player-photos'
      )
      .upload(
        filePath,
        file,
        {
          cacheControl:
            '3600',

          upsert:
            false,

          contentType:
            file.type,
        }
      );

  if (error) {
    throw error;
  }

  const { data } =
    supabase.storage
      .from(
        'player-photos'
      )
      .getPublicUrl(
        filePath
      );

  if (
    !data.publicUrl
  ) {
    throw new Error(
      'Could not generate player photo URL.'
    );
  }

  return data.publicUrl;
}