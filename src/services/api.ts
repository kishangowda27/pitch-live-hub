import { Match } from '../data/matches';
import { insforge } from '../lib/insforgeClient';

const API_KEY = "c7804fde-bfd2-4041-8be3-2bbf172713de";
const BASE_URL = "https://api.cricapi.com/v1";

// ----------
// Base Types
// ----------

interface CricApiInfoMeta {
  hitsToday: number;
  hitsLimit: number;
  credits: number;
  server: number;
  offsetRows?: number;
  totalRows?: number;
  queryTime: number;
}

interface CricApiListResponse<T> {
  apikey: string;
  data: T[];
  status: 'success' | 'failure';
  info: CricApiInfoMeta;
}

// --------------
// Matches / List
// --------------

interface CricApiMatch {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  teamInfo?: Array<{
    name: string;
    shortname: string;
    img: string;
  }>;
  score?: Array<{
    r: number;
    w: number;
    o: number;
    inning: string;
  }>;
  tossChoice?: string;
  tossWinner?: string;
  matchWinner?: string;
  matchEnded?: boolean;
  series_id?: string;
  fantasyEnabled?: boolean;
}

const syncMatchesToInsforge = async (matches: CricApiMatch[]) => {
  try {
    const rows = matches.map((m) => ({
      external_id: m.id,
      series_id: m.series_id ?? null,
      name: m.name,
      match_type: m.matchType,
      status: m.status,
      venue: m.venue,
      match_date: m.date || null,
      match_datetime_gmt: m.dateTimeGMT || null,
      team1: {
        name: m.teams[0] || null,
        shortName: m.teamInfo?.[0]?.shortname || null,
      },
      team2: {
        name: m.teams[1] || null,
        shortName: m.teamInfo?.[1]?.shortname || null,
      },
      is_wc_2026:
        m.matchType?.toLowerCase() === 't20' &&
        !!m.date &&
        new Date(m.date).getFullYear() === 2026,
    }));

    // Fire-and-forget insert; duplicates are acceptable for now.
    await insforge.database.from('matches').insert(rows);
  } catch (error) {
    console.warn('Failed to sync matches to Insforge', error);
  }
};

const mapCricMatchToMatch = (m: CricApiMatch): Match => {
  const team1Info = m.teamInfo?.[0];
  const team2Info = m.teamInfo?.[1];

  const score1 = m.score?.[0];
  const score2 = m.score?.[1];

  const formatScore = (s?: { r: number; w: number }) =>
    s ? `${s.r}/${s.w}` : undefined;

  const formatOvers = (s?: { o: number }) =>
    s ? `${s.o}` : undefined;

  let status: 'live' | 'upcoming' | 'completed' = 'upcoming';
  if (m.matchEnded) {
    status = 'completed';
  } else if (m.status === 'Match not started') {
    status = 'upcoming';
  } else {
    status = 'live';
  }

  return {
    id: m.id,
    team1: {
      name: team1Info?.name || m.teams[0] || 'Team 1',
      shortName:
        team1Info?.shortname ||
        m.teams[0]?.substring(0, 3).toUpperCase() ||
        'T1',
      flag: team1Info?.img || '',
      score: formatScore(score1),
      overs: formatOvers(score1),
    },
    team2: {
      name: team2Info?.name || m.teams[1] || 'Team 2',
      shortName:
        team2Info?.shortname ||
        m.teams[1]?.substring(0, 3).toUpperCase() ||
        'T2',
      flag: team2Info?.img || '',
      score: formatScore(score2),
      overs: formatOvers(score2),
    },
    status,
    venue: m.venue,
    date: m.date,
    time: m.dateTimeGMT
      ? new Date(m.dateTimeGMT).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '00:00',
    matchType: m.matchType,
    result: m.status,
    toss: m.tossWinner
      ? `${m.tossWinner} chosen to ${m.tossChoice}`
      : undefined,
  };
};

/**
 * Helper to safely hit CricAPI with basic error handling.
 */
const cricGet = async <T>(path: string): Promise<T | null> => {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) {
      console.warn('CricAPI HTTP error:', res.status, res.statusText);
      return null;
    }
    const json = await res.json();
    if (json.status !== 'success') {
      console.warn('CricAPI returned failure:', json);
      return null;
    }
    return json as T;
  } catch (err) {
    console.error('CricAPI network error:', err);
    return null;
  }
};

/**
 * Fetch ALL matches (live + upcoming + completed) and adapt
 * to the app's `Match` interface.
 */
export const fetchLiveMatches = async (): Promise<Match[]> => {
  const json = await cricGet<CricApiListResponse<CricApiMatch>>(
    `/matches?apikey=${API_KEY}&offset=0`,
  );

  if (!json) return [];

  // Mirror raw CricAPI matches into Insforge DB (non-blocking for UI)
  syncMatchesToInsforge(json.data).catch(() => {});

  return json.data.map(mapCricMatchToMatch);
};

/**
 * Current matches (with toss but no final result yet).
 * Adapted to the app's `Match` type.
 */
export const fetchCurrentMatches = async (): Promise<Match[]> => {
  const json = await cricGet<CricApiListResponse<CricApiMatch>>(
    `/currentMatches?apikey=${API_KEY}&offset=0`,
  );
  if (!json) return [];
  return json.data.map(mapCricMatchToMatch);
};

// -------------
// Series / List
// -------------

export interface CricApiSeries {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  odi: number;
  t20: number;
  test: number;
  squads: number;
  matches?: number;
}

/**
 * Get a descending-order list of series we cover.
 */
export const fetchSeriesList = async (
  offset = 0,
  search?: string,
): Promise<CricApiSeries[]> => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const json = await cricGet<CricApiListResponse<CricApiSeries>>(
    `/series?apikey=${API_KEY}&offset=${offset}${searchParam}`,
  );
  return json?.data ?? [];
};

// ---------------
// Series / Detail
// ---------------

interface CricApiSeriesInfo {
  info: {
    id: string;
    name: string;
    startdate: string;
    enddate: string;
    odi: number;
    t20: number;
    test: number;
    squads: number;
    matches: number;
  };
  matchList: Array<{
    id: string;
    name: string;
    matchType: string;
    status: string;
    venue: string;
    date: string;
    dateTimeGMT: string;
    teams: string[];
    fantasyEnabled: boolean;
  }>;
}

interface CricApiSingleResponse<T> {
  apikey: string;
  data: T;
  status: 'success' | 'failure';
  info: CricApiInfoMeta;
}

export const fetchSeriesInfo = async (
  seriesId: string,
): Promise<CricApiSeriesInfo | null> => {
  const json = await cricGet<CricApiSingleResponse<CricApiSeriesInfo>>(
    `/series_info?apikey=${API_KEY}&offset=0&id=${seriesId}`,
  );
  return json?.data ?? null;
};

/**
 * Helper to find a T20 World Cup style series.
 * We search for "World Cup" and prefer series with T20 matches.
 */
export const findT20WorldCupSeries = async (): Promise<CricApiSeries | null> => {
  const series = await fetchSeriesList(0, 'World Cup');
  if (!series.length) return null;

  const t20Series = series.find(
    (s) => s.t20 > 0 || s.name.toLowerCase().includes('t20'),
  );

  return t20Series ?? series[0] ?? null;
};

// --------------
// Match / Detail
// --------------

export interface CricApiMatchInfo extends CricApiMatch {
  tossWinner?: string;
  tossChoice?: string;
  matchWinner?: string;
}

export const fetchMatchInfo = async (
  matchId: string,
): Promise<CricApiMatchInfo | null> => {
  const json = await cricGet<CricApiSingleResponse<CricApiMatchInfo>>(
    `/match_info?apikey=${API_KEY}&offset=0&id=${matchId}`,
  );
  return json?.data ?? null;
};

// -------------
// Players / List
// -------------

export interface CricApiPlayer {
  id: string;
  name: string;
  country: string;
}

export const fetchPlayers = async (
  offset = 0,
  search?: string,
): Promise<CricApiPlayer[]> => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
  const json = await cricGet<CricApiListResponse<CricApiPlayer>>(
    `/players?apikey=${API_KEY}&offset=${offset}${searchParam}`,
  );
  return json?.data ?? [];
};

// --------------
// Player / Info
// --------------

export interface CricApiPlayerInfo {
  id: string;
  name: string;
  dateOfBirth?: string;
  role?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  placeOfBirth?: string;
  country: string;
}

export const fetchPlayerInfo = async (
  playerId: string,
): Promise<CricApiPlayerInfo | null> => {
  const json = await cricGet<CricApiSingleResponse<CricApiPlayerInfo>>(
    `/players_info?apikey=${API_KEY}&offset=0&id=${playerId}`,
  );
  return json?.data ?? null;
};
