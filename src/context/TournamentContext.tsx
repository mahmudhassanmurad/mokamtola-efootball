import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Tournament,
  Season,
  Player,
  Match,
  MatchEvent,
  Announcement,
  TournamentRule,
  RoadmapStage,
  WebsiteSettings,
  StandingRow,
  TopScorerRow,
  TopAssistRow,
  BestDefenceRow,
  PublicPage,
  AdminTab,
} from '../types';
import {
  INITIAL_TOURNAMENTS,
  INITIAL_SEASONS,
  INITIAL_PLAYERS,
  INITIAL_MATCHES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_RULES,
  INITIAL_ROADMAP,
  INITIAL_SETTINGS,
} from '../data/seedData';
import {
  calculateStandings,
  calculateTopScorers,
  calculateTopAssists,
  calculateBestDefence,
  calculateTournamentStats,
  calculatePlayerDetailedProfile,
} from '../services/statsEngine';

interface ShareModalPayload {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  type: 'tournament' | 'match' | 'player' | 'announcement' | 'standings';
  url: string;
  match?: Match;
  player?: Player;
  announcement?: Announcement;
  homePlayer?: Player;
  awayPlayer?: Player;
}

interface TournamentContextType {
  // State
  tournaments: Tournament[];
  selectedTournamentId: string;
  seasons: Season[];
  selectedSeasonId: string;
  players: Player[];
  matches: Match[];
  announcements: Announcement[];
  rules: TournamentRule[];
  roadmap: RoadmapStage[];
  settings: WebsiteSettings;
  isAdminLoggedIn: boolean;
  activePublicPage: PublicPage;
  selectedPlayerId: string | null;
  activeAdminTab: AdminTab;
  shareModal: ShareModalPayload | null;

  // Computed data
  selectedTournament: Tournament;
  selectedSeason: Season;
  standings: StandingRow[];
  topScorers: TopScorerRow[];
  topAssists: TopAssistRow[];
  bestDefence: BestDefenceRow[];
  tournamentStats: ReturnType<typeof calculateTournamentStats>;
  getPlayerProfile: (id: string) => ReturnType<typeof calculatePlayerDetailedProfile>;

  // Navigation
  navigateTo: (page: PublicPage, playerId?: string) => void;
  setActiveAdminTab: (tab: AdminTab) => void;
  setSelectedTournamentId: (id: string) => void;
  setSelectedSeasonId: (id: string) => void;

  // Social Sharing
  openShareModal: (payload: Omit<ShareModalPayload, 'isOpen' | 'url'>) => void;
  closeShareModal: () => void;

  // Admin Auth
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;

  // Admin Operations (All 30 points)
  createTournament: (data: Omit<Tournament, 'id'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;

  addPlayer: (data: Omit<Player, 'id' | 'joinedAt'>) => void;
  updatePlayer: (id: string, updates: Partial<Player>) => void;
  deletePlayer: (id: string) => void;

  generateRoundRobinFixtures: (tournamentId: string, playerIds: string[]) => void;
  createManualFixture: (data: Omit<Match, 'id' | 'events'>) => void;
  updateFixture: (id: string, updates: Partial<Match>) => void;
  deleteFixture: (id: string) => void;
  rescheduleFixture: (id: string, newDate: string, newTime: string) => void;

  enterMatchResult: (matchId: string, homeScore: number, awayScore: number, events: MatchEvent[], notes?: string) => void;
  editMatchResult: (matchId: string, homeScore: number, awayScore: number, events: MatchEvent[], notes?: string) => void;
  deleteMatchResult: (matchId: string) => void;

  addGoalEvent: (matchId: string, event: Omit<MatchEvent, 'id' | 'matchId'>) => void;
  deleteGoalEvent: (matchId: string, eventId: string) => void;

  createAnnouncement: (data: Omit<Announcement, 'id' | 'date'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;

  addRule: (data: Omit<TournamentRule, 'id'>) => void;
  updateRule: (id: string, updates: Partial<TournamentRule>) => void;
  deleteRule: (id: string) => void;

  addRoadmapStage: (data: Omit<RoadmapStage, 'id'>) => void;
  updateRoadmapStage: (id: string, updates: Partial<RoadmapStage>) => void;
  deleteRoadmapStage: (id: string) => void;

  updateSettings: (updates: Partial<WebsiteSettings>) => void;
  resetToDefaultData: () => void;
  exportDatabaseJSON: () => string;
  importDatabaseJSON: (jsonStr: string) => boolean;
}

const STORAGE_KEY = 'pes_tournament_state_v2';
const AUTH_KEY = 'pes_admin_session_token';

const TournamentContext = createContext<TournamentContextType | null>(null);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [tournaments, setTournaments] = useState<Tournament[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_tournaments');
      return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
    } catch {
      return INITIAL_TOURNAMENTS;
    }
  });

  const [selectedTournamentId, setSelectedTournamentId] = useState<string>(() => {
    return tournaments[0]?.id || 'tourney-pes-s1';
  });

  const [seasons, setSeasons] = useState<Season[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_seasons');
      return saved ? JSON.parse(saved) : INITIAL_SEASONS;
    } catch {
      return INITIAL_SEASONS;
    }
  });

  const [selectedSeasonId, setSelectedSeasonId] = useState<string>(() => {
    return seasons.find(s => s.isCurrent)?.id || 'season-1';
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_players');
      return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
    } catch {
      return INITIAL_PLAYERS;
    }
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_matches');
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_announcements');
      return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [rules, setRules] = useState<TournamentRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_rules');
      return saved ? JSON.parse(saved) : INITIAL_RULES;
    } catch {
      return INITIAL_RULES;
    }
  });

  const [roadmap, setRoadmap] = useState<RoadmapStage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_roadmap');
      return saved ? JSON.parse(saved) : INITIAL_ROADMAP;
    } catch {
      return INITIAL_ROADMAP;
    }
  });

  const [settings, setSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_KEY) === 'authenticated';
  });

  const [activePublicPage, setActivePublicPage] = useState<PublicPage>('home');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>('overview');
  const [shareModal, setShareModal] = useState<ShareModalPayload | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_tournaments', JSON.stringify(tournaments));
      localStorage.setItem(STORAGE_KEY + '_seasons', JSON.stringify(seasons));
      localStorage.setItem(STORAGE_KEY + '_players', JSON.stringify(players));
      localStorage.setItem(STORAGE_KEY + '_matches', JSON.stringify(matches));
      localStorage.setItem(STORAGE_KEY + '_announcements', JSON.stringify(announcements));
      localStorage.setItem(STORAGE_KEY + '_rules', JSON.stringify(rules));
      localStorage.setItem(STORAGE_KEY + '_roadmap', JSON.stringify(roadmap));
      localStorage.setItem(STORAGE_KEY + '_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Storage sync error', e);
    }
  }, [tournaments, seasons, players, matches, announcements, rules, roadmap, settings]);

  // Handle URL hash changes for easy link sharing and browser history
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;
      if (hash.startsWith('/players/')) {
        const id = hash.replace('/players/', '');
        setSelectedPlayerId(id);
        setActivePublicPage('player_profile');
      } else if (hash === '/admin' || hash === 'admin') {
        // Leave to router/view
      } else if (hash.startsWith('/admin/')) {
        // handled in component
      } else {
        const validPages: PublicPage[] = [
          'home', 'tournaments', 'tournament_details', 'fixtures', 'results',
          'standings', 'players', 'player_profile', 'statistics', 'rules',
          'roadmap', 'announcements', 'history', 'champion'
        ];
        if (validPages.includes(hash as PublicPage)) {
          setActivePublicPage(hash as PublicPage);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Computed Values (Single source of truth calculations)
  const selectedTournament = useMemo(() => {
    return tournaments.find(t => t.id === selectedTournamentId) || tournaments[0];
  }, [tournaments, selectedTournamentId]);

  const selectedSeason = useMemo(() => {
    return seasons.find(s => s.id === selectedSeasonId) || seasons[0];
  }, [seasons, selectedSeasonId]);

  const standings = useMemo(() => {
    return calculateStandings(matches, players, selectedTournament?.id);
  }, [matches, players, selectedTournament]);

  const topScorers = useMemo(() => {
    return calculateTopScorers(matches, players, selectedTournament?.id);
  }, [matches, players, selectedTournament]);

  const topAssists = useMemo(() => {
    return calculateTopAssists(matches, players, selectedTournament?.id);
  }, [matches, players, selectedTournament]);

  const bestDefence = useMemo(() => {
    return calculateBestDefence(matches, players, selectedTournament?.id);
  }, [matches, players, selectedTournament]);

  const tournamentStats = useMemo(() => {
    return calculateTournamentStats(matches, players, selectedTournament?.id);
  }, [matches, players, selectedTournament]);

  const getPlayerProfile = (id: string) => {
    return calculatePlayerDetailedProfile(id, matches, players);
  };

  // Navigation
  const navigateTo = (page: PublicPage, playerId?: string) => {
    setActivePublicPage(page);
    if (playerId) {
      setSelectedPlayerId(playerId);
      window.location.hash = `/players/${playerId}`;
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Auth
  const adminLogin = (pin: string): boolean => {
  if (pin === settings.adminPin) {
    sessionStorage.setItem(AUTH_KEY, 'authenticated');
    setIsAdminLoggedIn(true);
    return true;
  }
  return false;
};

  const adminLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAdminLoggedIn(false);
  };

  // Social Sharing
  const openShareModal = (payload: Omit<ShareModalPayload, 'isOpen' | 'url'>) => {
    const currentUrl = window.location.href;
    setShareModal({
      ...payload,
      isOpen: true,
      url: currentUrl,
    });
  };

  const closeShareModal = () => {
    setShareModal(null);
  };

  // Tournament Management
  const createTournament = (data: Omit<Tournament, 'id'>) => {
    const newTournament: Tournament = {
      ...data,
      id: 'tourney-' + Date.now(),
    };
    setTournaments(prev => [newTournament, ...prev]);
    setSelectedTournamentId(newTournament.id);
  };

  const updateTournament = (id: string, updates: Partial<Tournament>) => {
    setTournaments(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTournament = (id: string) => {
    setTournaments(prev => prev.filter(t => t.id !== id));
    if (selectedTournamentId === id) {
      setSelectedTournamentId(tournaments.find(t => t.id !== id)?.id || '');
    }
  };

  // Player Management
  const addPlayer = (data: Omit<Player, 'id' | 'joinedAt'>) => {
    const newPlayer: Player = {
      ...data,
      id: 'player-' + Date.now(),
      joinedAt: new Date().toISOString().split('T')[0],
      tournamentIds: data.tournamentIds.length ? data.tournamentIds : [selectedTournamentId],
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const updatePlayer = (id: string, updates: Partial<Player>) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deletePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
    // Also remove matches involving deleted player or mark them
    setMatches(prev => prev.filter(m => m.homePlayerId !== id && m.awayPlayerId !== id));
  };

  // Fixture Management
  const generateRoundRobinFixtures = (tournamentId: string, playerIds: string[]) => {
    if (playerIds.length < 2) return;
    
    // Copy array; if odd number of players, add a dummy/bye
    const list = [...playerIds];
    const hasBye = list.length % 2 !== 0;
    if (hasBye) {
      list.push('BYE');
    }

    const n = list.length;
    const totalRounds = n - 1;
    const matchesPerRound = n / 2;
    const newMatches: Match[] = [];
    let matchCounter = Date.now();

    const today = new Date();

    for (let r = 0; r < totalRounds; r++) {
      const roundNum = r + 1;
      const matchDate = new Date(today);
      matchDate.setDate(today.getDate() + (r * 2));
      const dateStr = matchDate.toISOString().split('T')[0];

      for (let m = 0; m < matchesPerRound; m++) {
        const homeIdx = (r + m) % (n - 1);
        let awayIdx = (n - 1 - m + r) % (n - 1);
        if (m === 0) {
          awayIdx = n - 1;
        }

        const home = list[homeIdx];
        const away = list[awayIdx];

        if (home === 'BYE' || away === 'BYE') continue;

        // Alternate home and away on odd rounds for fairness
        const isAlternate = r % 2 === 1;
        const homePlayerId = isAlternate ? away : home;
        const awayPlayerId = isAlternate ? home : away;

        const timeSlots = ['18:00', '19:15', '20:30', '21:45'];
        const scheduledTime = timeSlots[m % timeSlots.length];

        newMatches.push({
          id: `match-gen-${matchCounter++}`,
          tournamentId,
          seasonId: selectedSeasonId,
          round: roundNum,
          roundName: `Round ${roundNum}`,
          homePlayerId,
          awayPlayerId,
          homeScore: null,
          awayScore: null,
          status: 'scheduled',
          scheduledDate: dateStr,
          scheduledTime,
          pitch: 'Official eFootball Arena',
          events: [],
        });
      }
    }

    // Append new matches
    setMatches(prev => [...prev.filter(m => m.tournamentId !== tournamentId), ...newMatches]);
  };

  const createManualFixture = (data: Omit<Match, 'id' | 'events'>) => {
    const newMatch: Match = {
      ...data,
      id: 'match-' + Date.now(),
      events: [],
    };
    setMatches(prev => [...prev, newMatch]);
  };

  const updateFixture = (id: string, updates: Partial<Match>) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteFixture = (id: string) => {
    setMatches(prev => prev.filter(m => m.id !== id));
  };

  const rescheduleFixture = (id: string, newDate: string, newTime: string) => {
    setMatches(prev => prev.map(m => m.id === id ? { ...m, scheduledDate: newDate, scheduledTime: newTime } : m));
  };

  // Authoritative Results Flow (Recalculates cleanly every time!)
  const enterMatchResult = (
    matchId: string,
    homeScore: number,
    awayScore: number,
    events: MatchEvent[],
    notes?: string
  ) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          homeScore,
          awayScore,
          status: 'completed',
          events: events.map(e => ({ ...e, matchId })),
          notes: notes !== undefined ? notes : m.notes,
        };
      }
      return m;
    }));
  };

  const editMatchResult = (
    matchId: string,
    homeScore: number,
    awayScore: number,
    events: MatchEvent[],
    notes?: string
  ) => {
    // Pure drop-in edit. All downstream stats recalculate automatically!
    enterMatchResult(matchId, homeScore, awayScore, events, notes);
  };

  const deleteMatchResult = (matchId: string) => {
    // Reset match back to scheduled, clearing scores and events
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          homeScore: null,
          awayScore: null,
          status: 'scheduled',
          events: [],
        };
      }
      return m;
    }));
  };

  // Goal Events
  const addGoalEvent = (matchId: string, event: Omit<MatchEvent, 'id' | 'matchId'>) => {
    const newEvent: MatchEvent = {
      ...event,
      id: 'evt-' + Date.now() + Math.random().toString(36).substring(2, 5),
      matchId,
    };
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          events: [...(m.events || []), newEvent],
        };
      }
      return m;
    }));
  };

  const deleteGoalEvent = (matchId: string, eventId: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        return {
          ...m,
          events: (m.events || []).filter(e => e.id !== eventId),
        };
      }
      return m;
    }));
  };

  // Announcements
  const createAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...data,
      id: 'ann-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
    };
    setAnnouncements(prev => [newAnn, ...prev]);
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
  };

  // Rules
  const addRule = (data: Omit<TournamentRule, 'id'>) => {
    const newRule: TournamentRule = {
      ...data,
      id: 'rule-' + Date.now(),
    };
    setRules(prev => [...prev, newRule]);
  };

  const updateRule = (id: string, updates: Partial<TournamentRule>) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Roadmap
  const addRoadmapStage = (data: Omit<RoadmapStage, 'id'>) => {
    const newStage: RoadmapStage = {
      ...data,
      id: 'stage-' + Date.now(),
    };
    setRoadmap(prev => [...prev, newStage]);
  };

  const updateRoadmapStage = (id: string, updates: Partial<RoadmapStage>) => {
    setRoadmap(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteRoadmapStage = (id: string) => {
    setRoadmap(prev => prev.filter(s => s.id !== id));
  };

  // Settings
  const updateSettings = (updates: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Reset & Backup
  const resetToDefaultData = () => {
    setTournaments(INITIAL_TOURNAMENTS);
    setSeasons(INITIAL_SEASONS);
    setPlayers(INITIAL_PLAYERS);
    setMatches(INITIAL_MATCHES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setRules(INITIAL_RULES);
    setRoadmap(INITIAL_ROADMAP);
    setSettings(INITIAL_SETTINGS);
    setSelectedTournamentId('tourney-pes-s1');
  };

  const exportDatabaseJSON = () => {
    const backup = {
      tournaments,
      seasons,
      players,
      matches,
      announcements,
      rules,
      roadmap,
      settings,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.tournaments) setTournaments(data.tournaments);
      if (data.seasons) setSeasons(data.seasons);
      if (data.players) setPlayers(data.players);
      if (data.matches) setMatches(data.matches);
      if (data.announcements) setAnnouncements(data.announcements);
      if (data.rules) setRules(data.rules);
      if (data.roadmap) setRoadmap(data.roadmap);
      if (data.settings) setSettings(data.settings);
      return true;
    } catch (e) {
      console.error('Invalid JSON import', e);
      return false;
    }
  };

  return (
    <TournamentContext.Provider
      value={{
        tournaments,
        selectedTournamentId,
        seasons,
        selectedSeasonId,
        players,
        matches,
        announcements,
        rules,
        roadmap,
        settings,
        isAdminLoggedIn,
        activePublicPage,
        selectedPlayerId,
        activeAdminTab,
        shareModal,

        selectedTournament,
        selectedSeason,
        standings,
        topScorers,
        topAssists,
        bestDefence,
        tournamentStats,
        getPlayerProfile,

        navigateTo,
        setActiveAdminTab,
        setSelectedTournamentId,
        setSelectedSeasonId,

        openShareModal,
        closeShareModal,

        adminLogin,
        adminLogout,

        createTournament,
        updateTournament,
        deleteTournament,

        addPlayer,
        updatePlayer,
        deletePlayer,

        generateRoundRobinFixtures,
        createManualFixture,
        updateFixture,
        deleteFixture,
        rescheduleFixture,

        enterMatchResult,
        editMatchResult,
        deleteMatchResult,

        addGoalEvent,
        deleteGoalEvent,

        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,

        addRule,
        updateRule,
        deleteRule,

        addRoadmapStage,
        updateRoadmapStage,
        deleteRoadmapStage,

        updateSettings,
        resetToDefaultData,
        exportDatabaseJSON,
        importDatabaseJSON,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};
