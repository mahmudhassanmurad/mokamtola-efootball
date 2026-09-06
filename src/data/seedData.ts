import { Tournament, Season, Player, Match, Announcement, TournamentRule, RoadmapStage, WebsiteSettings } from '../types';

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourney-pes-s1',
    name: 'PES Premier League: Champions Series',
    season: 'Season 1',
    game: 'eFootball / PES 2024-2025',
    format: 'league',
    status: 'live',
    startDate: '2026-09-01',
    endDate: '2026-09-28',
    description: 'The premier competitive PES tournament featuring top controller masters battling in full round-robin action for championship glory and trophy honors.',
    bannerUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=1200&auto=format&fit=crop&q=80',
    prizePool: '$1,500 USD + Trophy',
    matchDuration: '10 Mins (5m Halves)',
  },
  {
    id: 'tourney-pes-winter-2025',
    name: 'PES Winter Cup Championship 2025',
    season: 'Winter 2025',
    game: 'eFootball / PES',
    format: 'knockout',
    status: 'completed',
    startDate: '2025-12-10',
    endDate: '2025-12-28',
    description: 'The inaugural winter showdown crowning the master of digital football tactics and precision finishing.',
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80',
    prizePool: '$1,000 USD',
    matchDuration: '10 Mins',
    championPlayerId: 'player-1',
    runnerUpPlayerId: 'player-3',
  }
];

export const INITIAL_SEASONS: Season[] = [
  { id: 'season-1', name: 'Season 1 (Current)', year: '2026', isCurrent: true },
  { id: 'season-winter-2025', name: 'Winter 2025 (Completed)', year: '2025', isCurrent: false },
];

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'player-1',
    fullName: 'Alexandre Mercer',
    displayName: 'Viper PES',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    teamName: 'Real Madrid CF',
    teamLogo: '👑',
    bio: 'Former regional esports champion. Master of tight tiki-taka inside the box and quick counter counter-press.',
    tournamentIds: ['tourney-pes-s1', 'tourney-pes-winter-2025'],
    status: 'active',
    joinedAt: '2026-08-20',
  },
  {
    id: 'player-2',
    fullName: 'David Sterling',
    displayName: 'Apex Striker',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    teamName: 'Manchester City',
    teamLogo: '⚡',
    bio: 'Heavy possession player with relentless high pressing and precise outside-the-boot curling shots.',
    tournamentIds: ['tourney-pes-s1'],
    status: 'active',
    joinedAt: '2026-08-22',
  },
  {
    id: 'player-3',
    fullName: 'Marco Rossi',
    displayName: 'Il Gladiatore',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    teamName: 'Inter Milan',
    teamLogo: '🛡️',
    bio: 'Master of Catenaccio defense with impenetrable 5-3-2 counter-attacking formations and clinical headers.',
    tournamentIds: ['tourney-pes-s1', 'tourney-pes-winter-2025'],
    status: 'active',
    joinedAt: '2026-08-23',
  },
  {
    id: 'player-4',
    fullName: 'Tariq Al-Mansoor',
    displayName: 'Sultan Skills',
    profilePhoto: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
    teamName: 'Paris Saint-Germain',
    teamLogo: '🗼',
    bio: 'Flamboyant dribbler known for double touches, roulette turns, and acrobatic trivela goals.',
    tournamentIds: ['tourney-pes-s1'],
    status: 'active',
    joinedAt: '2026-08-24',
  },
  {
    id: 'player-5',
    fullName: 'Leon Schneider',
    displayName: 'Blitzkrieg FC',
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    teamName: 'Bayern Munich',
    teamLogo: '🔴',
    bio: 'Gegenpressing tactician. Physical midfield domination and pinpoint diagonal cross-field switches.',
    tournamentIds: ['tourney-pes-s1'],
    status: 'active',
    joinedAt: '2026-08-25',
  },
  {
    id: 'player-6',
    fullName: 'Mateo Hernandez',
    displayName: 'Catalan Maestro',
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    teamName: 'FC Barcelona',
    teamLogo: '🔵🔴',
    bio: 'Patience, high pass completion rates, and lethal free-kick specialist from 25+ yards out.',
    tournamentIds: ['tourney-pes-s1'],
    status: 'active',
    joinedAt: '2026-08-25',
  },
  {
    id: 'player-7',
    fullName: 'Liam O’Connor',
    displayName: 'Kop Legend',
    profilePhoto: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    teamName: 'Liverpool FC',
    teamLogo: '🦅',
    bio: 'High energy full-backs, relentless wing play, and dangerous early crosses into the penalty box.',
    tournamentIds: ['tourney-pes-s1'],
    status: 'active',
    joinedAt: '2026-08-26',
  },
  {
    id: 'player-8',
    fullName: 'Gabriel Silva',
    displayName: 'Samba Gooner',
    profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    teamName: 'Arsenal FC',
    teamLogo: '🔴⚪',
    bio: 'Fast paced triangular passing, inverted wingers, and quick 1-2 pass combinations.',
    tournamentIds: ['tourney-pes-s1'],
    status: 'active',
    joinedAt: '2026-08-27',
  }
];

export const INITIAL_MATCHES: Match[] = [
  // Round 1
  {
    id: 'match-101',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 1,
    roundName: 'Round 1',
    homePlayerId: 'player-1', // Viper (Real Madrid)
    awayPlayerId: 'player-2', // Apex Striker (Man City)
    homeScore: 3,
    awayScore: 1,
    status: 'completed',
    scheduledDate: '2026-09-02',
    scheduledTime: '19:00',
    pitch: 'Santiago Bernabéu Stadium',
    events: [
      { id: 'e1', matchId: 'match-101', type: 'goal', playerId: 'player-1', minute: 18, team: 'home' },
      { id: 'e2', matchId: 'match-101', type: 'goal', playerId: 'player-2', minute: 42, team: 'away' },
      { id: 'e3', matchId: 'match-101', type: 'goal', playerId: 'player-1', assistPlayerId: 'player-1', minute: 67, team: 'home' },
      { id: 'e4', matchId: 'match-101', type: 'goal', playerId: 'player-1', minute: 89, team: 'home', isPenalty: true }
    ],
    notes: 'Electrifying season opener. Viper showcased lethal counter-attacking efficiency.'
  },
  {
    id: 'match-102',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 1,
    roundName: 'Round 1',
    homePlayerId: 'player-3', // Il Gladiatore (Inter)
    awayPlayerId: 'player-4', // Sultan Skills (PSG)
    homeScore: 2,
    awayScore: 0,
    status: 'completed',
    scheduledDate: '2026-09-02',
    scheduledTime: '20:00',
    pitch: 'San Siro',
    events: [
      { id: 'e5', matchId: 'match-102', type: 'goal', playerId: 'player-3', minute: 34, team: 'home' },
      { id: 'e6', matchId: 'match-102', type: 'goal', playerId: 'player-3', minute: 78, team: 'home' }
    ],
    notes: 'Clean sheet masterclass from Il Gladiatore shutting down PSG attack completely.'
  },
  {
    id: 'match-103',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 1,
    roundName: 'Round 1',
    homePlayerId: 'player-5', // Blitzkrieg (Bayern)
    awayPlayerId: 'player-6', // Catalan Maestro (Barca)
    homeScore: 2,
    awayScore: 2,
    status: 'completed',
    scheduledDate: '2026-09-03',
    scheduledTime: '19:00',
    pitch: 'Allianz Arena',
    events: [
      { id: 'e7', matchId: 'match-103', type: 'goal', playerId: 'player-5', minute: 12, team: 'home' },
      { id: 'e8', matchId: 'match-103', type: 'goal', playerId: 'player-6', minute: 55, team: 'away' },
      { id: 'e9', matchId: 'match-103', type: 'goal', playerId: 'player-5', minute: 71, team: 'home' },
      { id: 'e10', matchId: 'match-103', type: 'goal', playerId: 'player-6', minute: 90, team: 'away' }
    ],
    notes: 'Last gasp 90th minute equalizer from Catalan Maestro in a 4-goal thriller.'
  },
  {
    id: 'match-104',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 1,
    roundName: 'Round 1',
    homePlayerId: 'player-7', // Kop Legend (Liverpool)
    awayPlayerId: 'player-8', // Samba Gooner (Arsenal)
    homeScore: 4,
    awayScore: 1,
    status: 'completed',
    scheduledDate: '2026-09-03',
    scheduledTime: '20:30',
    pitch: 'Anfield',
    events: [
      { id: 'e11', matchId: 'match-104', type: 'goal', playerId: 'player-7', minute: 14, team: 'home' },
      { id: 'e12', matchId: 'match-104', type: 'goal', playerId: 'player-7', minute: 29, team: 'home' },
      { id: 'e13', matchId: 'match-104', type: 'goal', playerId: 'player-8', minute: 61, team: 'away' },
      { id: 'e14', matchId: 'match-104', type: 'goal', playerId: 'player-7', minute: 73, team: 'home' },
      { id: 'e15', matchId: 'match-104', type: 'goal', playerId: 'player-7', minute: 88, team: 'home' }
    ],
    notes: 'Spectacular 4-goal display from Kop Legend.'
  },

  // Round 2
  {
    id: 'match-201',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 2,
    roundName: 'Round 2',
    homePlayerId: 'player-2', // Apex Striker
    awayPlayerId: 'player-5', // Blitzkrieg
    homeScore: 3,
    awayScore: 2,
    status: 'completed',
    scheduledDate: '2026-09-04',
    scheduledTime: '19:00',
    pitch: 'Etihad Stadium',
    events: [
      { id: 'e16', matchId: 'match-201', type: 'goal', playerId: 'player-2', minute: 21, team: 'home' },
      { id: 'e17', matchId: 'match-201', type: 'goal', playerId: 'player-5', minute: 38, team: 'away' },
      { id: 'e18', matchId: 'match-201', type: 'goal', playerId: 'player-2', minute: 64, team: 'home' },
      { id: 'e19', matchId: 'match-201', type: 'goal', playerId: 'player-5', minute: 75, team: 'away' },
      { id: 'e20', matchId: 'match-201', type: 'goal', playerId: 'player-2', minute: 86, team: 'home' }
    ]
  },
  {
    id: 'match-202',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 2,
    roundName: 'Round 2',
    homePlayerId: 'player-4', // Sultan Skills
    awayPlayerId: 'player-1', // Viper
    homeScore: 1,
    awayScore: 3,
    status: 'completed',
    scheduledDate: '2026-09-04',
    scheduledTime: '20:15',
    pitch: 'Parc des Princes',
    events: [
      { id: 'e21', matchId: 'match-202', type: 'goal', playerId: 'player-1', minute: 15, team: 'away' },
      { id: 'e22', matchId: 'match-202', type: 'goal', playerId: 'player-4', minute: 52, team: 'home' },
      { id: 'e23', matchId: 'match-202', type: 'goal', playerId: 'player-1', minute: 70, team: 'away' },
      { id: 'e24', matchId: 'match-202', type: 'goal', playerId: 'player-1', minute: 82, team: 'away' }
    ]
  },
  {
    id: 'match-203',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 2,
    roundName: 'Round 2',
    homePlayerId: 'player-6', // Catalan Maestro
    awayPlayerId: 'player-7', // Kop Legend
    homeScore: 1,
    awayScore: 1,
    status: 'completed',
    scheduledDate: '2026-09-05',
    scheduledTime: '19:00',
    pitch: 'Camp Nou',
    events: [
      { id: 'e25', matchId: 'match-203', type: 'goal', playerId: 'player-6', minute: 30, team: 'home' },
      { id: 'e26', matchId: 'match-203', type: 'goal', playerId: 'player-7', minute: 68, team: 'away' }
    ]
  },
  {
    id: 'match-204',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 2,
    roundName: 'Round 2',
    homePlayerId: 'player-8', // Samba Gooner
    awayPlayerId: 'player-3', // Il Gladiatore
    homeScore: 0,
    awayScore: 2,
    status: 'completed',
    scheduledDate: '2026-09-05',
    scheduledTime: '20:30',
    pitch: 'Emirates Stadium',
    events: [
      { id: 'e27', matchId: 'match-204', type: 'goal', playerId: 'player-3', minute: 25, team: 'away' },
      { id: 'e28', matchId: 'match-204', type: 'goal', playerId: 'player-3', minute: 77, team: 'away' }
    ]
  },

  // Round 3 (Some live & scheduled)
  {
    id: 'match-301',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 3,
    roundName: 'Round 3',
    homePlayerId: 'player-1', // Viper
    awayPlayerId: 'player-3', // Il Gladiatore
    homeScore: 1,
    awayScore: 0,
    status: 'completed',
    scheduledDate: '2026-09-06',
    scheduledTime: '17:00',
    pitch: 'Santiago Bernabéu',
    events: [
      { id: 'e29', matchId: 'match-301', type: 'goal', playerId: 'player-1', minute: 84, team: 'home' }
    ],
    notes: 'Clash of the titans decided by a 84th minute curling strike from Viper.'
  },
  {
    id: 'match-302',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 3,
    roundName: 'Round 3',
    homePlayerId: 'player-7', // Kop Legend
    awayPlayerId: 'player-2', // Apex Striker
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledDate: '2026-09-07',
    scheduledTime: '19:30',
    pitch: 'Anfield',
    events: []
  },
  {
    id: 'match-303',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 3,
    roundName: 'Round 3',
    homePlayerId: 'player-5', // Blitzkrieg
    awayPlayerId: 'player-4', // Sultan Skills
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledDate: '2026-09-07',
    scheduledTime: '20:45',
    pitch: 'Allianz Arena',
    events: []
  },
  {
    id: 'match-304',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 3,
    roundName: 'Round 3',
    homePlayerId: 'player-6', // Catalan Maestro
    awayPlayerId: 'player-8', // Samba Gooner
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledDate: '2026-09-08',
    scheduledTime: '20:00',
    pitch: 'Camp Nou',
    events: []
  },

  // Round 4
  {
    id: 'match-401',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 4,
    roundName: 'Round 4',
    homePlayerId: 'player-1',
    awayPlayerId: 'player-7',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledDate: '2026-09-10',
    scheduledTime: '19:00',
    pitch: 'Santiago Bernabéu',
    events: []
  },
  {
    id: 'match-402',
    tournamentId: 'tourney-pes-s1',
    seasonId: 'season-1',
    round: 4,
    roundName: 'Round 4',
    homePlayerId: 'player-2',
    awayPlayerId: 'player-3',
    homeScore: null,
    awayScore: null,
    status: 'scheduled',
    scheduledDate: '2026-09-10',
    scheduledTime: '20:15',
    pitch: 'Etihad Stadium',
    events: []
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🏆 PES Premier League Season 1 is Officially LIVE!',
    content: 'Welcome players, spectators, and fans to the opening tournament of the year. 8 elite competitors are battling for the $1,500 prize pool and permanent trophy honors. Standings, fixtures, results, and top-scorer leaderboards update in real-time.',
    date: '2026-09-01',
    isPinned: true,
    category: 'general',
    author: 'Tournament Admin'
  },
  {
    id: 'ann-2',
    title: '⚠️ Round 3 Match Timings Confirmed',
    content: 'All participants please note: Kop Legend vs Apex Striker will kick off tomorrow at 19:30 UTC. Stream links will be pinned 15 minutes before kick-off. Please ensure NAT Type 2 connections.',
    date: '2026-09-06',
    isPinned: true,
    category: 'schedule',
    author: 'Chief Referee'
  },
  {
    id: 'ann-3',
    title: '📋 Strict Rule: Match Disconnection Protocol',
    content: 'In the event of an unexpected network drop during a match, remaining game time will be resumed via a second match session keeping existing scores intact. Both players must capture screenshots of half-time and final statistics.',
    date: '2026-09-03',
    isPinned: false,
    category: 'rule',
    author: 'Tournament Admin'
  }
];

export const INITIAL_RULES: TournamentRule[] = [
  {
    id: 'rule-1',
    category: 'Game & Match Settings',
    title: 'Match Duration & Conditions',
    description: 'Match time must be set to 10 Minutes (5 minutes per half). Game speed is strictly set to Normal (0). Injuries ON, Extra Time OFF (for regular season matches), Penalties OFF (regular league). Form condition is set to Normal (Green arrows across all players).',
    order: 1
  },
  {
    id: 'rule-2',
    category: 'Game & Match Settings',
    title: 'Allowed Teams & Formations',
    description: 'Standard authentic club teams only. Custom all-star or edited player attributes are strictly banned. Tactical formations are limited to standard football setups; custom glitch exploits are prohibited.',
    order: 2
  },
  {
    id: 'rule-3',
    category: 'Scoring & Standings Points',
    title: 'League Points System',
    description: 'Win: 3 Points | Draw: 1 Point | Loss: 0 Points. Ranking tie-breakers: (1) Total Points, (2) Goal Difference (GD), (3) Total Goals Scored (GF), (4) Head-to-Head record, (5) Total Clean Sheets.',
    order: 3
  },
  {
    id: 'rule-4',
    category: 'Network & Disconnections',
    title: 'Lag and Disconnection Policy',
    description: 'If a disconnection occurs within the first 10 virtual minutes and no goal was scored, the match is restarted completely. If after 10 minutes, the remaining time is played in a fresh match (e.g. if disconnected at 60 mins, play 30 mins). Prior score stands.',
    order: 4
  },
  {
    id: 'rule-5',
    category: 'Code of Conduct',
    title: 'Fair Play & Sportsmanship',
    description: 'Excessive time wasting in the backline (uncontested passing for over 15 in-game minutes without advancing) will result in a warning, followed by a 1-point penalty for repeated offenses.',
    order: 5
  }
];

export const INITIAL_ROADMAP: RoadmapStage[] = [
  {
    id: 'stage-1',
    title: 'Stage 1: Player Selection & Roster Confirmation',
    description: 'Admin manually approved 8 competitive PES players and assigned club representations.',
    stageOrder: 1,
    status: 'completed',
    targetDate: 'Aug 28, 2026'
  },
  {
    id: 'stage-2',
    title: 'Stage 2: Fixture Generation & Season Kickoff',
    description: 'Full round-robin calendar released across 7 matchdays with home and away venues.',
    stageOrder: 2,
    status: 'completed',
    targetDate: 'Sep 01, 2026'
  },
  {
    id: 'stage-3',
    title: 'Stage 3: Regular Season League Phase',
    description: 'All 8 players play each other. Top 4 teams qualify directly for Championship Knockout Stage.',
    stageOrder: 3,
    status: 'current',
    targetDate: 'Sep 02 - Sep 20, 2026'
  },
  {
    id: 'stage-4',
    title: 'Stage 4: Championship Semi-Finals (Top 4)',
    description: 'Seed 1 vs Seed 4, and Seed 2 vs Seed 3 in a best-of-3 aggregate showdown.',
    stageOrder: 4,
    status: 'upcoming',
    targetDate: 'Sep 24, 2026'
  },
  {
    id: 'stage-5',
    title: 'Stage 5: Grand Final & Trophy Presentation',
    description: 'Championship match, third place playoff, Golden Boot award, and prize distribution.',
    stageOrder: 5,
    status: 'upcoming',
    targetDate: 'Sep 28, 2026'
  }
];

export const INITIAL_SETTINGS: WebsiteSettings = {
  tournamentTitle: 'PES TOURNAMENT',
  subtitle: 'Official eFootball Championship Platform',
  logoUrl: '',
  bannerUrl: '',
  contactWhatsApp: '+1 (555) 234-5678',
  contactEmail: 'admin@pestournament.org',
  telegramGroup: 'https://t.me/pestournamenthub',
  adminPin: 'Murad@123@2002',
};
