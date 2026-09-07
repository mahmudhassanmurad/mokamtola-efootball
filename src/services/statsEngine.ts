import { Match, Player, StandingRow, TopScorerRow, TopAssistRow, BestDefenceRow } from '../types';

/**
 * Single source of truth calculation engine.
 * All statistics are calculated deterministically from authoritative match and event data.
 */

export function calculateStandings(matches: Match[], players: Player[], tournamentId?: string): StandingRow[] {
  const relevantMatches = tournamentId
    ? matches.filter(m => m.tournamentId === tournamentId)
    : matches;

  const relevantPlayers = tournamentId
    ? players.filter(p => p.tournamentIds.includes(tournamentId) || p.status === 'active')
    : players;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));

  const statsMap = new Map<string, {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    gf: number;
    ga: number;
    pts: number;
    cleanSheets: number;
    formMatches: { date: string; result: 'W' | 'D' | 'L' }[];
  }>();

  relevantPlayers.forEach(p => {
    statsMap.set(p.id, {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      pts: 0,
      cleanSheets: 0,
      formMatches: [],
    });
  });

  const completedMatches = relevantMatches
    .filter(m => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null)
    .sort(
      (a, b) =>
        new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime() ||
        a.round - b.round
    );

  completedMatches.forEach(match => {
    const homeScore = match.homeScore!;
    const awayScore = match.awayScore!;

    if (!statsMap.has(match.homePlayerId) && playerMap.has(match.homePlayerId)) {
      statsMap.set(match.homePlayerId, {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        pts: 0,
        cleanSheets: 0,
        formMatches: [],
      });
    }

    if (!statsMap.has(match.awayPlayerId) && playerMap.has(match.awayPlayerId)) {
      statsMap.set(match.awayPlayerId, {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        pts: 0,
        cleanSheets: 0,
        formMatches: [],
      });
    }

    const homeStats = statsMap.get(match.homePlayerId);
    const awayStats = statsMap.get(match.awayPlayerId);

    if (homeStats) {
      homeStats.played += 1;
      homeStats.gf += homeScore;
      homeStats.ga += awayScore;
      if (awayScore === 0) homeStats.cleanSheets += 1;

      if (homeScore > awayScore) {
        homeStats.won += 1;
        homeStats.pts += 3;
        homeStats.formMatches.push({ date: match.scheduledDate, result: 'W' });
      } else if (homeScore === awayScore) {
        homeStats.drawn += 1;
        homeStats.pts += 1;
        homeStats.formMatches.push({ date: match.scheduledDate, result: 'D' });
      } else {
        homeStats.lost += 1;
        homeStats.formMatches.push({ date: match.scheduledDate, result: 'L' });
      }
    }

    if (awayStats) {
      awayStats.played += 1;
      awayStats.gf += awayScore;
      awayStats.ga += homeScore;
      if (homeScore === 0) awayStats.cleanSheets += 1;

      if (awayScore > homeScore) {
        awayStats.won += 1;
        awayStats.pts += 3;
        awayStats.formMatches.push({ date: match.scheduledDate, result: 'W' });
      } else if (awayScore === homeScore) {
        awayStats.drawn += 1;
        awayStats.pts += 1;
        awayStats.formMatches.push({ date: match.scheduledDate, result: 'D' });
      } else {
        awayStats.lost += 1;
        awayStats.formMatches.push({ date: match.scheduledDate, result: 'L' });
      }
    }
  });

  const rows: StandingRow[] = [];

  statsMap.forEach((stats, playerId) => {
    const player = playerMap.get(playerId);
    if (!player) return;

    const gd = stats.gf - stats.ga;
    const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
    const form = stats.formMatches.slice(-5).map(f => f.result);

    rows.push({
      rank: 0,
      playerId,
      player,
      played: stats.played,
      won: stats.won,
      drawn: stats.drawn,
      lost: stats.lost,
      goalsFor: stats.gf,
      goalsAgainst: stats.ga,
      goalDifference: gd,
      points: stats.pts,
      winRate,
      cleanSheets: stats.cleanSheets,
      form,
    });
  });

  rows.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
    if (b.won !== a.won) return b.won - a.won;
    return a.player.displayName.localeCompare(b.player.displayName);
  });

  rows.forEach((row, index) => {
    row.rank = index + 1;
  });

  return rows;
}

export function calculateTopScorers(matches: Match[], players: Player[], tournamentId?: string): TopScorerRow[] {
  const relevantMatches = tournamentId
    ? matches.filter(m => m.tournamentId === tournamentId)
    : matches;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const scorerMap = new Map<string, { goals: number; penalties: number }>();
  const appearancesMap = new Map<string, number>();

  players.forEach(p => {
    scorerMap.set(p.id, { goals: 0, penalties: 0 });
    appearancesMap.set(p.id, 0);
  });

  const completedMatches = relevantMatches.filter(m => m.status === 'completed');

  completedMatches.forEach(match => {
    appearancesMap.set(match.homePlayerId, (appearancesMap.get(match.homePlayerId) || 0) + 1);
    appearancesMap.set(match.awayPlayerId, (appearancesMap.get(match.awayPlayerId) || 0) + 1);

    if (match.events && match.events.length > 0) {
      match.events.forEach(event => {
        if (event.type === 'goal' && !event.isOwnGoal) {
          const current = scorerMap.get(event.playerId) || { goals: 0, penalties: 0 };
          current.goals += 1;
          if (event.isPenalty) current.penalties += 1;
          scorerMap.set(event.playerId, current);
        }
      });
    } else {
      if (match.homeScore && match.homeScore > 0) {
        const cur = scorerMap.get(match.homePlayerId) || { goals: 0, penalties: 0 };
        cur.goals += match.homeScore;
        scorerMap.set(match.homePlayerId, cur);
      }
      if (match.awayScore && match.awayScore > 0) {
        const cur = scorerMap.get(match.awayPlayerId) || { goals: 0, penalties: 0 };
        cur.goals += match.awayScore;
        scorerMap.set(match.awayPlayerId, cur);
      }
    }
  });

  const list: TopScorerRow[] = [];

  scorerMap.forEach((data, playerId) => {
    const player = playerMap.get(playerId);
    if (!player) return;

    const matchesPlayed = appearancesMap.get(playerId) || 0;
    if (data.goals > 0 || matchesPlayed > 0) {
      const gpm = matchesPlayed > 0 ? parseFloat((data.goals / matchesPlayed).toFixed(2)) : 0;
      list.push({
        rank: 0,
        player,
        goals: data.goals,
        penalties: data.penalties,
        matchesPlayed,
        goalsPerMatch: gpm,
      });
    }
  });

  list.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (b.goalsPerMatch !== a.goalsPerMatch) return b.goalsPerMatch - a.goalsPerMatch;
    return a.player.displayName.localeCompare(b.player.displayName);
  });

  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  return list;
}

export function calculateTopAssists(matches: Match[], players: Player[], tournamentId?: string): TopAssistRow[] {
  const relevantMatches = tournamentId
    ? matches.filter(m => m.tournamentId === tournamentId)
    : matches;

  const playerMap = new Map<string, Player>(players.map(p => [p.id, p]));
  const assistMap = new Map<string, number>();
  const appearancesMap = new Map<string, number>();

  players.forEach(p => {
    assistMap.set(p.id, 0);
    appearancesMap.set(p.id, 0);
  });

  const completedMatches = relevantMatches.filter(m => m.status === 'completed');

  completedMatches.forEach(match => {
    appearancesMap.set(match.homePlayerId, (appearancesMap.get(match.homePlayerId) || 0) + 1);
    appearancesMap.set(match.awayPlayerId, (appearancesMap.get(match.awayPlayerId) || 0) + 1);

    if (match.events) {
      match.events.forEach(event => {
        if (event.type === 'goal' && event.assistPlayerId) {
          assistMap.set(event.assistPlayerId, (assistMap.get(event.assistPlayerId) || 0) + 1);
        } else if (event.type === 'assist') {
          assistMap.set(event.playerId, (assistMap.get(event.playerId) || 0) + 1);
        }
      });
    }
  });

  const list: TopAssistRow[] = [];

  assistMap.forEach((assists, playerId) => {
    const player = playerMap.get(playerId);
    if (!player) return;

    const matchesPlayed = appearancesMap.get(playerId) || 0;
    if (assists > 0) {
      list.push({
        rank: 0,
        player,
        assists,
        matchesPlayed,
      });
    }
  });

  list.sort((a, b) => {
    if (b.assists !== a.assists) return b.assists - a.assists;
    return a.player.displayName.localeCompare(b.player.displayName);
  });

  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  return list;
}

export function calculateBestDefence(matches: Match[], players: Player[], tournamentId?: string): BestDefenceRow[] {
  const standings = calculateStandings(matches, players, tournamentId);

  const list: BestDefenceRow[] = standings
    .filter(row => row.played > 0)
    .map(row => {
      const gcpm = parseFloat((row.goalsAgainst / row.played).toFixed(2));
      return {
        rank: 0,
        player: row.player,
        goalsConceded: row.goalsAgainst,
        cleanSheets: row.cleanSheets,
        matchesPlayed: row.played,
        goalsConcededPerMatch: gcpm,
      };
    });

  list.sort((a, b) => {
    if (a.goalsConcededPerMatch !== b.goalsConcededPerMatch) {
      return a.goalsConcededPerMatch - b.goalsConcededPerMatch;
    }
    if (b.cleanSheets !== a.cleanSheets) {
      return b.cleanSheets - a.cleanSheets;
    }
    return a.goalsConceded - b.goalsConceded;
  });

  list.forEach((item, index) => {
    item.rank = index + 1;
  });

  return list;
}

export function calculatePlayerDetailedProfile(playerId: string, matches: Match[], players: Player[]) {
  const player = players.find(p => p.id === playerId);
  if (!player) return null;

  const playerMatches = matches
    .filter(m => m.homePlayerId === playerId || m.awayPlayerId === playerId)
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());

  const completedMatches = playerMatches.filter(
    m => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null
  );

  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsScored = 0;
  let goalsConceded = 0;
  let cleanSheets = 0;
  let assists = 0;

  const goalsByMinute: { minute: number; isPenalty: boolean; matchId: string }[] = [];
  const assistEvents: { minute: number; scorerName: string; matchId: string }[] = [];

  completedMatches.forEach(match => {
    const isHome = match.homePlayerId === playerId;
    const myScore = isHome ? match.homeScore! : match.awayScore!;
    const oppScore = isHome ? match.awayScore! : match.homeScore!;

    goalsScored += myScore;
    goalsConceded += oppScore;
    if (oppScore === 0) cleanSheets += 1;

    if (myScore > oppScore) wins += 1;
    else if (myScore === oppScore) draws += 1;
    else losses += 1;

    if (match.events) {
      match.events.forEach(e => {
        if (e.type === 'goal' && e.playerId === playerId && !e.isOwnGoal) {
          goalsByMinute.push({
            minute: e.minute,
            isPenalty: !!e.isPenalty,
            matchId: match.id,
          });
        }
        if (e.type === 'goal' && e.assistPlayerId === playerId) {
          assists += 1;
          const scorer = players.find(p => p.id === e.playerId);
          assistEvents.push({
            minute: e.minute,
            scorerName: scorer?.displayName || 'Teammate',
            matchId: match.id,
          });
        }
      });
    }
  });

  const matchesPlayed = completedMatches.length;
  const points = wins * 3 + draws * 1;
  const goalDifference = goalsScored - goalsConceded;
  const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;

  return {
    player,
    matchesPlayed,
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
    goalDifference,
    points,
    winRate,
    cleanSheets,
    assists,
    goalsByMinute,
    assistEvents,
    recentMatches: playerMatches.slice(0, 10),
    upcomingMatches: playerMatches.filter(m => m.status === 'scheduled'),
  };
}

export function calculateTournamentStats(matches: Match[], players: Player[], tournamentId?: string) {
  const standings = calculateStandings(matches, players, tournamentId);
  const relevantMatches = tournamentId
    ? matches.filter(m => m.tournamentId === tournamentId)
    : matches;

  const completed = relevantMatches.filter(
    m => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null
  );

  const totalMatches = relevantMatches.length;
  const totalCompleted = completed.length;

  const totalGoals = completed.reduce(
    (sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0),
    0
  );

  const avgGoalsPerMatch =
    totalCompleted > 0 ? parseFloat((totalGoals / totalCompleted).toFixed(2)) : 0;

  let highestScoringMatch: { match: Match; totalGoals: number } | null = null;
  completed.forEach((m) => {
    const goals = (m.homeScore || 0) + (m.awayScore || 0);
    if (!highestScoringMatch || goals > highestScoringMatch.totalGoals) {
      highestScoringMatch = { match: m, totalGoals: goals };
    }
  });

  // IMPORTANT:
  // No completed match means no leader/champion yet.
  const leader =
    totalCompleted > 0
      ? standings.find((row) => row.played > 0) || null
      : null;

  return {
    totalPlayers: standings.length,
    totalMatches,
    totalCompleted,
    totalScheduled: totalMatches - totalCompleted,
    totalGoals,
    avgGoalsPerMatch,
    highestScoringMatch,
    leader,
  };
}