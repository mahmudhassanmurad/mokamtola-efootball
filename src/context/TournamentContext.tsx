import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

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

import {
  fetchPublicSettings,
  fetchPublicPlayers,
  createPlayerInSupabase,
  updatePlayerInSupabase,
  deletePlayerFromSupabase,
} from '../services/supabaseService';

import {
  signInAdmin,
  signOutAdmin,
  getCurrentAdmin,
  onAuthSessionChange,
} from '../services/adminAuthService';

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
  isAdminAuthLoading: boolean;
  isPlayersLoading: boolean;

  activePublicPage: PublicPage | 'admin';
  selectedPlayerId: string | null;
  activeAdminTab: AdminTab;

  shareModal: ShareModalPayload | null;

  selectedTournament: Tournament;
  selectedSeason: Season;

  standings: StandingRow[];
  topScorers: TopScorerRow[];
  topAssists: TopAssistRow[];
  bestDefence: BestDefenceRow[];

  tournamentStats: ReturnType<typeof calculateTournamentStats>;

  getPlayerProfile: (
    id: string
  ) => ReturnType<typeof calculatePlayerDetailedProfile>;

  navigateTo: (
    page: PublicPage | 'admin',
    playerId?: string
  ) => void;

  setActiveAdminTab: (tab: AdminTab) => void;

  setSelectedTournamentId: (id: string) => void;
  setSelectedSeasonId: (id: string) => void;

  openShareModal: (
    payload: Omit<ShareModalPayload, 'isOpen' | 'url'>
  ) => void;

  closeShareModal: () => void;

  adminLogin: (
    email: string,
    password: string
  ) => Promise<boolean>;

  adminLogout: () => Promise<void>;

  createTournament: (
    data: Omit<Tournament, 'id'>
  ) => void;

  updateTournament: (
    id: string,
    updates: Partial<Tournament>
  ) => void;

  deleteTournament: (id: string) => void;

  addPlayer: (
    data: Omit<Player, 'id' | 'joinedAt'>
  ) => Promise<Player>;

  updatePlayer: (
    id: string,
    updates: Partial<Player>
  ) => Promise<void>;

  deletePlayer: (id: string) => Promise<void>;

  refreshPlayers: () => Promise<void>;

  generateRoundRobinFixtures: (
    tournamentId: string,
    playerIds: string[]
  ) => void;

  createManualFixture: (
    data: Omit<Match, 'id' | 'events'>
  ) => void;

  updateFixture: (
    id: string,
    updates: Partial<Match>
  ) => void;

  deleteFixture: (id: string) => void;

  rescheduleFixture: (
    id: string,
    newDate: string,
    newTime: string
  ) => void;

  enterMatchResult: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    events: MatchEvent[],
    notes?: string
  ) => void;

  editMatchResult: (
    matchId: string,
    homeScore: number,
    awayScore: number,
    events: MatchEvent[],
    notes?: string
  ) => void;

  deleteMatchResult: (matchId: string) => void;

  addGoalEvent: (
    matchId: string,
    event: Omit<MatchEvent, 'id' | 'matchId'>
  ) => void;

  deleteGoalEvent: (
    matchId: string,
    eventId: string
  ) => void;

  createAnnouncement: (
    data: Omit<Announcement, 'id' | 'date'>
  ) => void;

  updateAnnouncement: (
    id: string,
    updates: Partial<Announcement>
  ) => void;

  deleteAnnouncement: (id: string) => void;

  togglePinAnnouncement: (id: string) => void;

  addRule: (
    data: Omit<TournamentRule, 'id'>
  ) => void;

  updateRule: (
    id: string,
    updates: Partial<TournamentRule>
  ) => void;

  deleteRule: (id: string) => void;

  addRoadmapStage: (
    data: Omit<RoadmapStage, 'id'>
  ) => void;

  updateRoadmapStage: (
    id: string,
    updates: Partial<RoadmapStage>
  ) => void;

  deleteRoadmapStage: (id: string) => void;

  updateSettings: (
    updates: Partial<WebsiteSettings>
  ) => void;

  resetToDefaultData: () => void;

  exportDatabaseJSON: () => string;

  importDatabaseJSON: (
    jsonStr: string
  ) => boolean;
}

const STORAGE_KEY = 'pes_tournament_state_v2';

const TournamentContext =
  createContext<TournamentContextType | null>(null);

export const TournamentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [tournaments, setTournaments] =
    useState<Tournament[]>(() => {
      try {
        const saved = localStorage.getItem(
          STORAGE_KEY + '_tournaments'
        );

        return saved
          ? JSON.parse(saved)
          : INITIAL_TOURNAMENTS;
      } catch {
        return INITIAL_TOURNAMENTS;
      }
    });

  const [
    selectedTournamentId,
    setSelectedTournamentId,
  ] = useState<string>(() => {
    return tournaments[0]?.id || 'tourney-pes-s1';
  });

  const [seasons, setSeasons] =
    useState<Season[]>(() => {
      try {
        const saved = localStorage.getItem(
          STORAGE_KEY + '_seasons'
        );

        return saved
          ? JSON.parse(saved)
          : INITIAL_SEASONS;
      } catch {
        return INITIAL_SEASONS;
      }
    });

  const [
    selectedSeasonId,
    setSelectedSeasonId,
  ] = useState<string>(() => {
    return (
      seasons.find((s) => s.isCurrent)?.id ||
      'season-1'
    );
  });

  /*
   * Players now use Supabase as their authoritative source.
   *
   * Seed data is only an initial visual fallback until the
   * first Supabase request finishes.
   */
  const [players, setPlayers] =
    useState<Player[]>(INITIAL_PLAYERS);

  const [isPlayersLoading, setIsPlayersLoading] =
    useState(true);

  const [matches, setMatches] =
    useState<Match[]>(() => {
      try {
        const saved = localStorage.getItem(
          STORAGE_KEY + '_matches'
        );

        return saved
          ? JSON.parse(saved)
          : INITIAL_MATCHES;
      } catch {
        return INITIAL_MATCHES;
      }
    });

  const [
    announcements,
    setAnnouncements,
  ] = useState<Announcement[]>(() => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEY + '_announcements'
      );

      return saved
        ? JSON.parse(saved)
        : INITIAL_ANNOUNCEMENTS;
    } catch {
      return INITIAL_ANNOUNCEMENTS;
    }
  });

  const [rules, setRules] =
    useState<TournamentRule[]>(() => {
      try {
        const saved = localStorage.getItem(
          STORAGE_KEY + '_rules'
        );

        return saved
          ? JSON.parse(saved)
          : INITIAL_RULES;
      } catch {
        return INITIAL_RULES;
      }
    });

  const [roadmap, setRoadmap] =
    useState<RoadmapStage[]>(() => {
      try {
        const saved = localStorage.getItem(
          STORAGE_KEY + '_roadmap'
        );

        return saved
          ? JSON.parse(saved)
          : INITIAL_ROADMAP;
      } catch {
        return INITIAL_ROADMAP;
      }
    });

  const [settings, setSettings] =
    useState<WebsiteSettings>(() => {
      try {
        const saved = localStorage.getItem(
          STORAGE_KEY + '_settings'
        );

        return saved
          ? JSON.parse(saved)
          : INITIAL_SETTINGS;
      } catch {
        return INITIAL_SETTINGS;
      }
    });

  const [
    isAdminLoggedIn,
    setIsAdminLoggedIn,
  ] = useState(false);

  const [
    isAdminAuthLoading,
    setIsAdminAuthLoading,
  ] = useState(true);

  const [
    activePublicPage,
    setActivePublicPage,
  ] = useState<PublicPage | 'admin'>('home');

  const [
    selectedPlayerId,
    setSelectedPlayerId,
  ] = useState<string | null>(null);

  const [
    activeAdminTab,
    setActiveAdminTab,
  ] = useState<AdminTab>('overview');

  const [
    shareModal,
    setShareModal,
  ] = useState<ShareModalPayload | null>(null);

  /*
   * Load public Players from Supabase.
   */
  const refreshPlayers = async (): Promise<void> => {
    try {
      const databasePlayers =
        await fetchPublicPlayers();

      setPlayers(databasePlayers);
    } catch (error) {
      console.error(
        'Failed to load players from Supabase:',
        error
      );

      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadPlayers = async () => {
      setIsPlayersLoading(true);

      try {
        const databasePlayers =
          await fetchPublicPlayers();

        if (mounted) {
          setPlayers(databasePlayers);
        }
      } catch (error) {
        console.error(
          'Supabase players load failed:',
          error
        );

        /*
         * Keep seed fallback visible if public read fails.
         * We do NOT overwrite the database.
         */
      } finally {
        if (mounted) {
          setIsPlayersLoading(false);
        }
      }
    };

    loadPlayers();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Supabase Admin Authentication.
   */
  useEffect(() => {
    let mounted = true;

    try {
      sessionStorage.removeItem(
        'pes_admin_session_token'
      );

      localStorage.removeItem(
        'pes_admin_session_token'
      );
    } catch {
      // Ignore legacy auth-storage cleanup errors.
    }

    const restoreAdminSession = async () => {
      try {
        const isAdmin =
          await getCurrentAdmin();

        if (!mounted) return;

        setIsAdminLoggedIn(isAdmin);
      } catch {
        if (!mounted) return;

        setIsAdminLoggedIn(false);
      } finally {
        if (mounted) {
          setIsAdminAuthLoading(false);
        }
      }
    };

    restoreAdminSession();

    const unsubscribe =
      onAuthSessionChange((hasSession) => {
        if (!mounted) return;

        if (!hasSession) {
          setIsAdminLoggedIn(false);
          setIsAdminAuthLoading(false);

          setActivePublicPage((current) =>
            current === 'admin'
              ? 'home'
              : current
          );
        }
      });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  /*
   * Temporary local persistence for data that has not yet
   * been fully migrated to Supabase.
   *
   * Players are intentionally NOT stored here anymore.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY + '_tournaments',
        JSON.stringify(tournaments)
      );

      localStorage.setItem(
        STORAGE_KEY + '_seasons',
        JSON.stringify(seasons)
      );

      localStorage.setItem(
        STORAGE_KEY + '_matches',
        JSON.stringify(matches)
      );

      localStorage.setItem(
        STORAGE_KEY + '_announcements',
        JSON.stringify(announcements)
      );

      localStorage.setItem(
        STORAGE_KEY + '_rules',
        JSON.stringify(rules)
      );

      localStorage.setItem(
        STORAGE_KEY + '_roadmap',
        JSON.stringify(roadmap)
      );

      localStorage.setItem(
        STORAGE_KEY + '_settings',
        JSON.stringify(settings)
      );
    } catch (error) {
      console.warn(
        'Storage sync error',
        error
      );
    }
  }, [
    tournaments,
    seasons,
    matches,
    announcements,
    rules,
    roadmap,
    settings,
  ]);

  /*
   * Remove obsolete local player cache.
   */
  useEffect(() => {
    try {
      localStorage.removeItem(
        STORAGE_KEY + '_players'
      );
    } catch {
      // Ignore local storage cleanup errors.
    }
  }, []);

  /*
   * Public settings from Supabase.
   */
  useEffect(() => {
    const loadSupabaseSettings = async () => {
      try {
        const data =
          await fetchPublicSettings();

        if (!data) return;

        setSettings((prev) => ({
          ...prev,

          tournamentTitle:
            data.tournament_title ??
            prev.tournamentTitle,

          subtitle:
            data.subtitle ??
            prev.subtitle,

          logoUrl:
            data.logo_url ??
            prev.logoUrl,

          bannerUrl:
            data.banner_url ??
            prev.bannerUrl,

          contactWhatsApp:
            data.contact_whatsapp ??
            prev.contactWhatsApp,

          contactEmail:
            data.contact_email ??
            prev.contactEmail,

          telegramGroup:
            data.telegram_group ??
            prev.telegramGroup,
        }));
      } catch (error) {
        console.warn(
          'Supabase settings load failed',
          error
        );
      }
    };

    loadSupabaseSettings();
  }, []);

  /*
   * Current hash-based navigation.
   */
  useEffect(() => {
    const handleHash = () => {
      const hash =
        window.location.hash.replace('#', '');

      if (!hash) return;

      if (hash.startsWith('/players/')) {
        const id = hash.replace(
          '/players/',
          ''
        );

        setSelectedPlayerId(id);
        setActivePublicPage(
          'player_profile'
        );

        return;
      }

      if (
        hash === '/admin' ||
        hash === 'admin'
      ) {
        setActivePublicPage('admin');
        return;
      }

      if (hash.startsWith('/admin/')) {
        setActivePublicPage('admin');
        return;
      }

      const validPages: PublicPage[] = [
        'home',
        'tournaments',
        'tournament_details',
        'fixtures',
        'results',
        'standings',
        'players',
        'player_profile',
        'statistics',
        'rules',
        'roadmap',
        'announcements',
        'history',
        'champion',
      ];

      if (
        validPages.includes(
          hash as PublicPage
        )
      ) {
        setActivePublicPage(
          hash as PublicPage
        );
      }
    };

    handleHash();

    window.addEventListener(
      'hashchange',
      handleHash
    );

    return () => {
      window.removeEventListener(
        'hashchange',
        handleHash
      );
    };
  }, []);

  const selectedTournament =
    useMemo(() => {
      return (
        tournaments.find(
          (t) =>
            t.id ===
            selectedTournamentId
        ) || tournaments[0]
      );
    }, [
      tournaments,
      selectedTournamentId,
    ]);

  const selectedSeason =
    useMemo(() => {
      return (
        seasons.find(
          (s) =>
            s.id === selectedSeasonId
        ) || seasons[0]
      );
    }, [
      seasons,
      selectedSeasonId,
    ]);

  const standings =
    useMemo(() => {
      return calculateStandings(
        matches,
        players,
        selectedTournament?.id
      );
    }, [
      matches,
      players,
      selectedTournament,
    ]);

  const topScorers =
    useMemo(() => {
      return calculateTopScorers(
        matches,
        players,
        selectedTournament?.id
      );
    }, [
      matches,
      players,
      selectedTournament,
    ]);

  const topAssists =
    useMemo(() => {
      return calculateTopAssists(
        matches,
        players,
        selectedTournament?.id
      );
    }, [
      matches,
      players,
      selectedTournament,
    ]);

  const bestDefence =
    useMemo(() => {
      return calculateBestDefence(
        matches,
        players,
        selectedTournament?.id
      );
    }, [
      matches,
      players,
      selectedTournament,
    ]);

  const tournamentStats =
    useMemo(() => {
      return calculateTournamentStats(
        matches,
        players,
        selectedTournament?.id
      );
    }, [
      matches,
      players,
      selectedTournament,
    ]);

  const getPlayerProfile = (
    id: string
  ) => {
    return calculatePlayerDetailedProfile(
      id,
      matches,
      players
    );
  };

  /*
   * Navigation.
   */
  const navigateTo = (
    page: PublicPage | 'admin',
    playerId?: string
  ) => {
    setActivePublicPage(page);

    if (playerId) {
      setSelectedPlayerId(playerId);

      window.location.hash =
        `/players/${playerId}`;
    } else if (page === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = page;
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  /*
   * Supabase Admin Login.
   */
  const adminLogin = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsAdminAuthLoading(true);

    try {
      await signInAdmin(
        email,
        password
      );

      setIsAdminLoggedIn(true);

      return true;
    } catch (error) {
      setIsAdminLoggedIn(false);
      throw error;
    } finally {
      setIsAdminAuthLoading(false);
    }
  };

  /*
   * Supabase Admin Logout.
   */
  const adminLogout =
    async (): Promise<void> => {
      try {
        await signOutAdmin();
      } catch (error) {
        console.error(
          'Admin logout failed',
          error
        );
      } finally {
        setIsAdminLoggedIn(false);
        setActivePublicPage('home');
        window.location.hash = 'home';
      }
    };

  /*
   * Social Sharing.
   */
  const openShareModal = (
    payload: Omit<
      ShareModalPayload,
      'isOpen' | 'url'
    >
  ) => {
    setShareModal({
      ...payload,
      isOpen: true,
      url: window.location.href,
    });
  };

  const closeShareModal = () => {
    setShareModal(null);
  };

  /*
   * Tournament Management.
   *
   * This remains local temporarily.
   */
  const createTournament = (
    data: Omit<Tournament, 'id'>
  ) => {
    const newTournament: Tournament = {
      ...data,
      id: 'tourney-' + Date.now(),
    };

    setTournaments((prev) => [
      newTournament,
      ...prev,
    ]);

    setSelectedTournamentId(
      newTournament.id
    );
  };

  const updateTournament = (
    id: string,
    updates: Partial<Tournament>
  ) => {
    setTournaments((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updates,
            }
          : t
      )
    );
  };

  const deleteTournament = (
    id: string
  ) => {
    setTournaments((prev) =>
      prev.filter(
        (t) => t.id !== id
      )
    );

    if (
      selectedTournamentId === id
    ) {
      const replacement =
        tournaments.find(
          (t) => t.id !== id
        );

      setSelectedTournamentId(
        replacement?.id || ''
      );
    }
  };

  /*
   * Player Management.
   *
   * Supabase is now authoritative for Players.
   */
  const addPlayer = async (
    data: Omit<
      Player,
      'id' | 'joinedAt'
    >
  ): Promise<Player> => {
    const tournamentId =
      data.tournamentIds[0] ||
      selectedTournamentId;

    if (!tournamentId) {
      throw new Error(
        'No tournament selected for this player.'
      );
    }

    const createdPlayer =
      await createPlayerInSupabase(
        {
          fullName:
            data.fullName,

          facebookUrl:
            data.facebookUrl,

          displayName:
            data.displayName,

          profilePhoto:
            data.profilePhoto,

          teamName:
            data.teamName,

          teamLogo:
            data.teamLogo,

          bio:
            data.bio,

          status:
            data.status,
        },
        tournamentId
      );

    setPlayers((prev) => {
      const alreadyExists =
        prev.some(
          (player) =>
            player.id ===
            createdPlayer.id
        );

      if (alreadyExists) {
        return prev.map(
          (player) =>
            player.id ===
            createdPlayer.id
              ? createdPlayer
              : player
        );
      }

      return [
        ...prev,
        createdPlayer,
      ];
    });

    return createdPlayer;
  };

  const updatePlayer = async (
    id: string,
    updates: Partial<Player>
  ): Promise<void> => {
    await updatePlayerInSupabase(
      id,
      {
        fullName:
          updates.fullName,

        facebookUrl:
          updates.facebookUrl,

        displayName:
          updates.displayName,

        profilePhoto:
          updates.profilePhoto,

        teamName:
          updates.teamName,

        teamLogo:
          updates.teamLogo,

        bio:
          updates.bio,

        status:
          updates.status,
      }
    );

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === id
          ? {
              ...player,
              ...updates,
            }
          : player
      )
    );
  };

  const deletePlayer = async (
    id: string
  ): Promise<void> => {
    await deletePlayerFromSupabase(
      id
    );

    setPlayers((prev) =>
      prev.filter(
        (player) =>
          player.id !== id
      )
    );

    /*
     * Existing local match cleanup stays here.
     * Database match deletion is NOT silently performed
     * by this Player operation.
     */
    setMatches((prev) =>
      prev.filter(
        (match) =>
          match.homePlayerId !== id &&
          match.awayPlayerId !== id
      )
    );
  };

  /*
   * Fixture Management.
   */
  const generateRoundRobinFixtures = (
    tournamentId: string,
    playerIds: string[]
  ) => {
    if (playerIds.length < 2) {
      return;
    }

    const list = [...playerIds];

    if (
      list.length % 2 !== 0
    ) {
      list.push('BYE');
    }

    const n = list.length;

    const totalRounds =
      n - 1;

    const matchesPerRound =
      n / 2;

    const newMatches: Match[] = [];

    let matchCounter =
      Date.now();

    const today =
      new Date();

    for (
      let r = 0;
      r < totalRounds;
      r++
    ) {
      const roundNum =
        r + 1;

      const matchDate =
        new Date(today);

      matchDate.setDate(
        today.getDate() +
          r * 2
      );

      const dateStr =
        matchDate
          .toISOString()
          .split('T')[0];

      for (
        let m = 0;
        m < matchesPerRound;
        m++
      ) {
        const homeIdx =
          (r + m) %
          (n - 1);

        let awayIdx =
          (n - 1 - m + r) %
          (n - 1);

        if (m === 0) {
          awayIdx =
            n - 1;
        }

        const home =
          list[homeIdx];

        const away =
          list[awayIdx];

        if (
          home === 'BYE' ||
          away === 'BYE'
        ) {
          continue;
        }

        const isAlternate =
          r % 2 === 1;

        const homePlayerId =
          isAlternate
            ? away
            : home;

        const awayPlayerId =
          isAlternate
            ? home
            : away;

        const timeSlots = [
          '18:00',
          '19:15',
          '20:30',
          '21:45',
        ];

        const scheduledTime =
          timeSlots[
            m %
              timeSlots.length
          ];

        newMatches.push({
          id:
            `match-gen-${matchCounter++}`,

          tournamentId,

          seasonId:
            selectedSeasonId,

          round:
            roundNum,

          roundName:
            `Round ${roundNum}`,

          homePlayerId,
          awayPlayerId,

          homeScore:
            null,

          awayScore:
            null,

          status:
            'scheduled',

          scheduledDate:
            dateStr,

          scheduledTime,

          pitch:
            'Official eFootball Arena',

          events: [],
        });
      }
    }

    setMatches((prev) => [
      ...prev.filter(
        (match) =>
          match.tournamentId !==
          tournamentId
      ),
      ...newMatches,
    ]);
  };

  const createManualFixture = (
    data: Omit<
      Match,
      'id' | 'events'
    >
  ) => {
    const newMatch: Match = {
      ...data,

      id:
        'match-' +
        Date.now(),

      events: [],
    };

    setMatches((prev) => [
      ...prev,
      newMatch,
    ]);
  };

  const updateFixture = (
    id: string,
    updates: Partial<Match>
  ) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === id
          ? {
              ...match,
              ...updates,
            }
          : match
      )
    );
  };

  const deleteFixture = (
    id: string
  ) => {
    setMatches((prev) =>
      prev.filter(
        (match) =>
          match.id !== id
      )
    );
  };

  const rescheduleFixture = (
    id: string,
    newDate: string,
    newTime: string
  ) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === id
          ? {
              ...match,

              scheduledDate:
                newDate,

              scheduledTime:
                newTime,
            }
          : match
      )
    );
  };

  /*
   * Authoritative result calculation continues to derive
   * statistics from Match data.
   */
  const enterMatchResult = (
    matchId: string,
    homeScore: number,
    awayScore: number,
    events: MatchEvent[],
    notes?: string
  ) => {
    setMatches((prev) =>
      prev.map((match) => {
        if (
          match.id !== matchId
        ) {
          return match;
        }

        return {
          ...match,

          homeScore,
          awayScore,

          status:
            'completed',

          events:
            events.map(
              (event) => ({
                ...event,
                matchId,
              })
            ),

          notes:
            notes !== undefined
              ? notes
              : match.notes,
        };
      })
    );
  };

  const editMatchResult = (
    matchId: string,
    homeScore: number,
    awayScore: number,
    events: MatchEvent[],
    notes?: string
  ) => {
    enterMatchResult(
      matchId,
      homeScore,
      awayScore,
      events,
      notes
    );
  };

  const deleteMatchResult = (
    matchId: string
  ) => {
    setMatches((prev) =>
      prev.map((match) => {
        if (
          match.id !== matchId
        ) {
          return match;
        }

        return {
          ...match,

          homeScore:
            null,

          awayScore:
            null,

          status:
            'scheduled',

          events: [],
        };
      })
    );
  };

  /*
   * Match Events.
   */
  const addGoalEvent = (
    matchId: string,

    event: Omit<
      MatchEvent,
      'id' | 'matchId'
    >
  ) => {
    const newEvent: MatchEvent = {
      ...event,

      id:
        'evt-' +
        Date.now() +
        Math.random()
          .toString(36)
          .substring(2, 5),

      matchId,
    };

    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,

              events: [
                ...(match.events ||
                  []),

                newEvent,
              ],
            }
          : match
      )
    );
  };

  const deleteGoalEvent = (
    matchId: string,
    eventId: string
  ) => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId
          ? {
              ...match,

              events:
                (
                  match.events ||
                  []
                ).filter(
                  (event) =>
                    event.id !==
                    eventId
                ),
            }
          : match
      )
    );
  };

  /*
   * Announcements.
   */
  const createAnnouncement = (
    data: Omit<
      Announcement,
      'id' | 'date'
    >
  ) => {
    const newAnnouncement: Announcement =
      {
        ...data,

        id:
          'ann-' +
          Date.now(),

        date:
          new Date()
            .toISOString()
            .split('T')[0],
      };

    setAnnouncements(
      (prev) => [
        newAnnouncement,
        ...prev,
      ]
    );
  };

  const updateAnnouncement = (
    id: string,
    updates: Partial<Announcement>
  ) => {
    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updates,
            }
          : item
      )
    );
  };

  const deleteAnnouncement = (
    id: string
  ) => {
    setAnnouncements((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  const togglePinAnnouncement = (
    id: string
  ) => {
    setAnnouncements((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,

              isPinned:
                !item.isPinned,
            }
          : item
      )
    );
  };

  /*
   * Tournament Rules.
   */
  const addRule = (
    data: Omit<
      TournamentRule,
      'id'
    >
  ) => {
    const newRule: TournamentRule = {
      ...data,

      id:
        'rule-' +
        Date.now(),
    };

    setRules((prev) => [
      ...prev,
      newRule,
    ]);
  };

  const updateRule = (
    id: string,
    updates: Partial<TournamentRule>
  ) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id
          ? {
              ...rule,
              ...updates,
            }
          : rule
      )
    );
  };

  const deleteRule = (
    id: string
  ) => {
    setRules((prev) =>
      prev.filter(
        (rule) =>
          rule.id !== id
      )
    );
  };

  /*
   * Roadmap.
   */
  const addRoadmapStage = (
    data: Omit<
      RoadmapStage,
      'id'
    >
  ) => {
    const newStage: RoadmapStage = {
      ...data,

      id:
        'stage-' +
        Date.now(),
    };

    setRoadmap((prev) => [
      ...prev,
      newStage,
    ]);
  };

  const updateRoadmapStage = (
    id: string,
    updates: Partial<RoadmapStage>
  ) => {
    setRoadmap((prev) =>
      prev.map((stage) =>
        stage.id === id
          ? {
              ...stage,
              ...updates,
            }
          : stage
      )
    );
  };

  const deleteRoadmapStage = (
    id: string
  ) => {
    setRoadmap((prev) =>
      prev.filter(
        (stage) =>
          stage.id !== id
      )
    );
  };

  /*
   * Website Settings.
   */
  const updateSettings = (
    updates: Partial<WebsiteSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  /*
   * Reset.
   *
   * IMPORTANT:
   * Supabase Players are not reset/deleted here.
   * A public database entity must never be destructively
   * overwritten by a local demo reset button.
   */
  const resetToDefaultData = () => {
    setTournaments(
      INITIAL_TOURNAMENTS
    );

    setSeasons(
      INITIAL_SEASONS
    );

    setMatches(
      INITIAL_MATCHES
    );

    setAnnouncements(
      INITIAL_ANNOUNCEMENTS
    );

    setRules(
      INITIAL_RULES
    );

    setRoadmap(
      INITIAL_ROADMAP
    );

    setSettings(
      INITIAL_SETTINGS
    );

    setSelectedTournamentId(
      'tourney-pes-s1'
    );

    void refreshPlayers().catch(
      (error) => {
        console.error(
          'Could not refresh Supabase players:',
          error
        );
      }
    );
  };

  /*
   * JSON export.
   */
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

      exportedAt:
        new Date().toISOString(),
    };

    return JSON.stringify(
      backup,
      null,
      2
    );
  };

  /*
   * Import remains available for the data that is still
   * local. We intentionally do NOT replace Supabase
   * Players from an untrusted local JSON import.
   */
  const importDatabaseJSON = (
    jsonStr: string
  ): boolean => {
    try {
      const data =
        JSON.parse(jsonStr);

      if (data.tournaments) {
        setTournaments(
          data.tournaments
        );
      }

      if (data.seasons) {
        setSeasons(
          data.seasons
        );
      }

      if (data.matches) {
        setMatches(
          data.matches
        );
      }

      if (data.announcements) {
        setAnnouncements(
          data.announcements
        );
      }

      if (data.rules) {
        setRules(
          data.rules
        );
      }

      if (data.roadmap) {
        setRoadmap(
          data.roadmap
        );
      }

      if (data.settings) {
        setSettings(
          data.settings
        );
      }

      return true;
    } catch (error) {
      console.error(
        'Invalid JSON import',
        error
      );

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
        isAdminAuthLoading,
        isPlayersLoading,

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
        refreshPlayers,

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
  const context =
    useContext(TournamentContext);

  if (!context) {
    throw new Error(
      'useTournament must be used within a TournamentProvider'
    );
  }

  return context;
};