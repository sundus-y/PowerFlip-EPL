import axios from 'axios';

const BASE_URL = import.meta.env.DEV
  ? '/api/football-data'
  : 'https://api.football-data.org/v4';

function buildHeaders(apiKey) {
  return { 'X-Auth-Token': apiKey };
}

export async function fetchMatches(season, apiKey) {
  try {
    const response = await axios.get(
      `${BASE_URL}/competitions/PL/matches?season=${season}`,
      { headers: buildHeaders(apiKey) }
    );
    return response.data.matches || [];
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (error.response?.status === 403) {
      throw new Error('Invalid API key. Please check your API key and try again.');
    }
    if (error.response?.status === 404) {
      throw new Error(`No data found for season ${season}.`);
    }
    throw new Error(error.message || 'Failed to fetch matches. Please check your connection.');
  }
}

export async function fetchStandings(season, apiKey) {
  try {
    const response = await axios.get(
      `${BASE_URL}/competitions/PL/standings?season=${season}`,
      { headers: buildHeaders(apiKey) }
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (error.response?.status === 403) {
      throw new Error('Invalid API key. Please check your API key and try again.');
    }
    if (error.response?.status === 404) {
      throw new Error(`No standings found for season ${season}.`);
    }
    throw new Error(error.message || 'Failed to fetch standings. Please check your connection.');
  }
}
