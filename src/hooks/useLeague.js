import { useState, useEffect, useCallback } from 'react';
import { fetchMatches, fetchStandings } from '../services/api';
import { mockMatches, mockStandings, initialStandings2023 } from '../services/mockData';
import { processMatches, getGameweekSnapshots } from '../utils/tableProcessor';

const API_KEY_STORAGE_KEY = 'powerflip:epl:apiKey';
const DATA_CACHE_STORAGE_KEY = 'powerflip:epl:dataCache';

// Initial standings keyed by season start year
const INITIAL_STANDINGS = {
  2023: initialStandings2023,
};

// Fallback initial standings for other seasons (generic ordering)
function getFallbackInitialStandings(teams) {
  return teams.map((t, i) => ({
    name: t.team.name,
    shortName: t.team.shortName,
    crest: t.team.crest,
    position: i + 1,
  }));
}

function readStoredApiKey() {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(API_KEY_STORAGE_KEY) || '';
}

function writeStoredApiKey(key) {
  if (typeof window === 'undefined') return;

  if (key) {
    window.localStorage.setItem(API_KEY_STORAGE_KEY, key);
    return;
  }

  window.localStorage.removeItem(API_KEY_STORAGE_KEY);
}

function readDataCache() {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(DATA_CACHE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSeasonCache(season, data) {
  if (typeof window === 'undefined') return;

  const existingCache = readDataCache();
  const nextCache = {
    ...existingCache,
    [season]: {
      ...data,
      updatedAt: new Date().toISOString(),
    },
  };

  window.localStorage.setItem(DATA_CACHE_STORAGE_KEY, JSON.stringify(nextCache));
}

function readSeasonCache(season) {
  const cache = readDataCache();
  return cache[season] || null;
}

export function useLeague() {
  const [season, setSeason] = useState(2023);
  const [apiKey, setApiKey] = useState(
    import.meta.env.VITE_API_KEY || readStoredApiKey()
  );
  const [matches, setMatches] = useState([]);
  const [officialStandings, setOfficialStandings] = useState(null);
  const [customTable, setCustomTable] = useState([]);
  const [realTable, setRealTable] = useState([]);
  const [gameweekSnapshots, setGameweekSnapshots] = useState([]);
  const [maxGameweek, setMaxGameweek] = useState(0);
  const [currentGameweek, setCurrentGameweek] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const loadDemoData = useCallback(() => {
    setMatches(mockMatches);
    setOfficialStandings(mockStandings);
    const table = processMatches(mockMatches, initialStandings2023);
    setCustomTable(table);
    const real = processMatches(mockMatches, initialStandings2023, 'real');
    setRealTable(real);
    const { snapshots, maxGameweek: maxGW } = getGameweekSnapshots(mockMatches, initialStandings2023);
    setGameweekSnapshots(snapshots);
    setMaxGameweek(maxGW);
    setCurrentGameweek(maxGW);
    setUsingDemoData(true);
    setError(null);
    setLoading(false);
  }, []);

  const loadData = useCallback(async () => {
    if (!apiKey) {
      if (season === 2023) {
        loadDemoData();
      } else {
        setError('No API key set. Select 2023 season for demo data or enter your API key.');
        setUsingDemoData(false);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    setError(null);
    setUsingDemoData(false);

    const cachedSeasonData = readSeasonCache(season);
    if (cachedSeasonData) {
      const matchData = cachedSeasonData.matches || [];
      const standingsData = cachedSeasonData.officialStandings || null;
      setMatches(matchData);
      setOfficialStandings(standingsData);
      setCustomTable(cachedSeasonData.customTable || []);
      const initStandings =
        INITIAL_STANDINGS[season] ||
        getFallbackInitialStandings(standingsData?.standings?.[0]?.table || []);
      setRealTable(processMatches(matchData, initStandings, 'real'));
      const { snapshots, maxGameweek: maxGW } = getGameweekSnapshots(matchData, initStandings);
      setGameweekSnapshots(snapshots);
      setMaxGameweek(maxGW);
      setCurrentGameweek(maxGW);
      setLoading(false);
      return;
    }

    try {
      const [matchData, standingsData] = await Promise.all([
        fetchMatches(season, apiKey),
        fetchStandings(season, apiKey),
      ]);

      setMatches(matchData);
      setOfficialStandings(standingsData);

      const initialStandings =
        INITIAL_STANDINGS[season] ||
        getFallbackInitialStandings(
          standingsData?.standings?.[0]?.table || []
        );

      const table = processMatches(matchData, initialStandings);
      setCustomTable(table);
      setRealTable(processMatches(matchData, initialStandings, 'real'));

      const { snapshots, maxGameweek: maxGW } = getGameweekSnapshots(matchData, initialStandings);
      setGameweekSnapshots(snapshots);
      setMaxGameweek(maxGW);
      setCurrentGameweek(maxGW);

      writeSeasonCache(season, {
        matches: matchData,
        officialStandings: standingsData,
        customTable: table,
      });
    } catch (err) {
      if (season === 2023) {
        loadDemoData();
      } else {
        setError(err.message);
        setUsingDemoData(false);
      }
    } finally {
      setLoading(false);
    }
  }, [season, apiKey, loadDemoData]);

  useEffect(() => {
    writeStoredApiKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    season,
    setSeason,
    apiKey,
    setApiKey,
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
    usingDemoData,
    retry: loadData,
  };
}
