export type TournamentStatus = 'upcoming' | 'live' | 'completed' | 'archived';
export type TournamentFormat = 'league' | 'knockout' | 'group_knockout';
export type MatchStatus = 'scheduled' | 'live' | 'completed';

export interface Player {
  id: string;
  fullName: string;
  displayName: string;
  profilePhoto: string;
  teamName: string;
  teamLogo?: string;
  bio?: string;
  tournamentIds: string[];
  status: 'active' | 'suspended';
  joinedAt: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card';
  playerId: string;
  assistPlayerId?: string;
  minute: number;
  team: 'home' | 'away';
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

export interface Match {
  id: string;
  tournamentId: string;
  seasonId: string;
  round: number;
  roundName: string;
  homePlayerId: string;
  awayPlayerId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  scheduledDate: string;
  scheduledTime: string;
  pitch?: string;
  events: MatchEvent[];
  notes?: string;
}

export interface Tournament {
  id: string;
  name: string;
  season: string;
  game: string;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  description: string;
  bannerUrl: string;
  prizePool: string;
  matchDuration: string;
  championPlayerId?: string;
  runnerUpPlayerId?: string;
}

export interface Season {
  id: string;
  name: string;
  year: string;
  isCurrent: boolean;
}

export interface StandingRow {
  rank: number;
  playerId: string;
  player: Player;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  winRate: number;
  cleanSheets: number;
  form: ('W' | 'D' | 'L')[];
}

export interface TopScorerRow {
  rank: number;
  player: Player;
  goals: number;
  penalties: number;
  matchesPlayed: number;
  goalsPerMatch: number;
}

export interface TopAssistRow {
  rank: number;
  player: Player;
  assists: number;
  matchesPlayed: number;
}

export interface BestDefenceRow {
  rank: number;
  player: Player;
  goalsConceded: number;
  cleanSheets: number;
  matchesPlayed: number;
  goalsConcededPerMatch: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isPinned: boolean;
  category: 'match' | 'rule' | 'schedule' | 'general';
  author: string;
}

export interface TournamentRule {
  id: string;
  category: string;
  title: string;
  description: string;
  order: number;
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  stageOrder: number;
  status: 'completed' | 'current' | 'upcoming';
  targetDate?: string;
}

export interface WebsiteSettings {
  tournamentTitle: string;
  subtitle: string;
  logoUrl: string;
  bannerUrl: string;
  contactWhatsApp: string;
  contactEmail: string;
  telegramGroup: string;
  adminPin: string;
}

export type PublicPage = 
  | 'home'
  | 'tournaments'
  | 'tournament_details'
  | 'fixtures'
  | 'results'
  | 'standings'
  | 'players'
  | 'player_profile'
  | 'statistics'
  | 'rules'
  | 'roadmap'
  | 'announcements'
  | 'history'
  | 'champion';

export type AdminTab =
  | 'overview'
  | 'matches'
  | 'fixtures'
  | 'players'
  | 'standings'
  | 'announcements'
  | 'roadmap'
  | 'rules'
  | 'tournaments'
  | 'settings';
