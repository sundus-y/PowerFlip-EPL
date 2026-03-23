import { useState, useEffect, useCallback } from 'react';
import { fetchMatches, fetchStandings } from '../services/api';
import { mockMatches, mockStandings, initialStandings2023 } from '../services/mockData';
import { processMatches } from '../utils/tableProcessor';

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

export function useLeague() {
  const [season, setSeason] = useState(2023);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_API_KEY || '');
  const [matches, setMatches] = useState([]);
  const [officialStandings, setOfficialStandings] = useState(null);
  const [customTable, setCustomTable] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);

  const loadDemoData = useCallback(() => {
    setMatches(mockMatches);
    setOfficialStandings(mockStandings);
    const table = processMatches(mockMatches, initialStandings2023);
    setCustomTable(table);
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
    loading,
    error,
    usingDemoData,
    retry: loadData,
  };
}
