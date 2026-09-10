import { Match } from '../types';
import {
  fetchPublicMatches,
  migrateLegacyScheduledMatches,
} from './supabaseService';

const MATCHES_STORAGE_KEY =
  'pes_tournament_state_v2_matches';

export interface FixtureMigrationResult {
  migrated: number;
  matches: Match[];
}

function readLocalMatches(): Match[] {
  const raw =
    localStorage.getItem(
      MATCHES_STORAGE_KEY
    );

  if (!raw) {
    throw new Error(
      'No local fixture data was found in this browser.'
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      'Local fixture data is not valid JSON.'
    );
  }

  if (!Array.isArray(parsed)) {
    throw new Error(
      'Local fixture data has an invalid format.'
    );
  }

  if (parsed.length === 0) {
    throw new Error(
      'Local fixture list is empty.'
    );
  }

  return parsed as Match[];
}

export async function migrateCurrentBrowserFixtures(): Promise<FixtureMigrationResult> {
  const existingDatabaseMatches =
    await fetchPublicMatches();

  if (existingDatabaseMatches.length > 0) {
    throw new Error(
      `Migration stopped: Supabase already contains ${existingDatabaseMatches.length} match(es).`
    );
  }

  const localMatches =
    readLocalMatches();

  const invalidMatch =
    localMatches.find(
      (match) =>
        match.status !== 'scheduled' ||
        match.homeScore !== null ||
        match.awayScore !== null ||
        (match.events?.length ?? 0) > 0
    );

  if (invalidMatch) {
    throw new Error(
      `Migration stopped: fixture ${invalidMatch.id} contains a result/event or is not scheduled.`
    );
  }

  const migratedMatches =
    await migrateLegacyScheduledMatches(
      localMatches
    );

  if (
    migratedMatches.length !==
    localMatches.length
  ) {
    throw new Error(
      `Migration verification failed. Local: ${localMatches.length}, Supabase response: ${migratedMatches.length}.`
    );
  }

  const verifiedMatches =
    await fetchPublicMatches();

  if (
    verifiedMatches.length !==
    localMatches.length
  ) {
    throw new Error(
      `Migration verification failed after database reload. Expected ${localMatches.length}, found ${verifiedMatches.length}.`
    );
  }

  return {
    migrated:
      verifiedMatches.length,

    matches:
      verifiedMatches,
  };
}