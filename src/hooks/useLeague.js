import { useState, useEffect, useCallback } from 'react';
import {
  matches2023, standings2023, initialStandings2023,
  matches2024, standings2024, initialStandings2024,
  initialStandings2025,
} from '../data';
import { fetchMatches, fetchStandings } from '../services/api';
import { processMatches, getGameweekSnapshots } from '../utils/tableProcessor';

const STATIC_SEASONS = {
  2023: { matches: matches2023, officialStandings: standings2023, initialStandings: initialStandings2023 },
  2024: { matches: matches2024, officialStandings: standings2024, initialStandings: initialStandings2024 },
};

export const CURRENT_SEASON = 2025;
export const AVAILABLE_SEASONS = [CURRENT_SEASON, ...Object.keys(STATIC_SEASONS).map(Number).sort((a, b) => b - a)];

const CACHE_KEY = `powerflip:epl:season:${CURRENT_SEASON}`;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { cachedAt, matches, officialStandings } = JSON.parse(raw);
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null;
    return { matches, officialStandings };
  } catch {
    return null;
  }
}

function writeCache(matches, officialStandings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ cachedAt: Date.now(), matches, officialStandings }));
  } catch {
    // localStorage quota exceeded — silently skip caching
  }
}

function getFallbackInitialStandings(standingsData) {
  return (standingsData?.standings?.[0]?.table || []).map((row) => ({
    position: row.position,
    name: row.team.name,
    shortName: row.team.shortName,
    crest: row.team.crest,
  }));
}

export function useLeague() {
  const [season, setSeason] = useState(CURRENT_SEASON);
  const [matches, setMatches] = useState([]);
  const [officialStandings, setOfficialStandings] = useState(null);
  const [customTable, setCustomTable] = useState([]);
  const [realTable, setRealTable] = useState([]);
  const [gameweekSnapshots, setGameweekSnapshots] = useState([]);
  const [maxGameweek, setMaxGameweek] = useState(0);
  const [currentGameweek, setCurrentGameweek] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const applyData = useCallback((matchData, standingsData, initialStandings) => {
    setMatches(matchData);
    setOfficialStandings(standingsData);
    setCustomTable(processMatches(matchData, initialStandings));
    setRealTable(processMatches(matchData, initialStandings, 'real'));
    const { snapshots, maxGameweek: maxGW } = getGameweekSnapshots(matchData, initialStandings);
    setGameweekSnapshots(snapshots);
    setMaxGameweek(maxGW);
    setCurrentGameweek(maxGW);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Static seasons — load instantly from bundled data
    const staticData = STATIC_SEASONS[season];
    if (staticData) {
      applyData(staticData.matches, staticData.officialStandings, staticData.initialStandings);
      setLoading(false);
      return;
    }

    // Current season — try localStorage cache first (6-hour TTL)
    const cached = readCache();
    if (cached) {
      const init = initialStandings2025.length
        ? initialStandings2025
        : getFallbackInitialStandings(cached.officialStandings);
      applyData(cached.matches, cached.officialStandings, init);
      setLoading(false);
      return;
    }

    // Cache miss — fetch live from API
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey) {
      setError('No API key configured. Set VITE_API_KEY in your .env file.');
      setLoading(false);
      return;
    }

    try {
      const [matchData, standingsData] = await Promise.all([
        fetchMatches(season, apiKey),
        fetchStandings(season, apiKey),
      ]);

      writeCache(matchData, standingsData);

      const init = initialStandings2025.length
        ? initialStandings2025
        : getFallbackInitialStandings(standingsData);
      applyData(matchData, standingsData, init);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [season, applyData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    season,
    setSeason,
    matches,
    officialStandings,
    customTable,
    realTable,
    gameweekSnapshots,
    maxGameweek,
    currentGameweek,
    setCurrentGameweek,
    loading,
    error,
    retry: loadData,
  };
}
