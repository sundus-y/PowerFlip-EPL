import { calculatePoints } from './scoring';

/**
 * Returns the points earned for a match result under standard (real) EPL scoring.
 *  win  → 3 pts
 *  draw → 1 pt
 *  loss → 0 pts
 */
function calculateRealPoints(result) {
  if (result === 'win') return 3;
  if (result === 'draw') return 1;
  return 0;
}

function initializeStandings(initialStandings) {
  return initialStandings.map((team, idx) => ({
    name: team.name,
    shortName: team.shortName || team.name,
    crest: team.crest || '',
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    position: team.position || idx + 1,
  }));
}

function sortAndRank(table) {
  const sorted = [...table].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
  sorted.forEach((team, idx) => {
    team.position = idx + 1;
  });
  return sorted;
}

function applyMatch(table, match, mode = 'reverse') {
  const homeTeamData = match.homeTeam;
  const awayTeamData = match.awayTeam;

  const homeName = homeTeamData.name;
  const awayName = awayTeamData.name;

  const homeEntry = table.find(
    (t) => t.name === homeName || t.shortName === homeTeamData.shortName
  );
  const awayEntry = table.find(
    (t) => t.name === awayName || t.shortName === awayTeamData.shortName
  );

  if (!homeEntry || !awayEntry) return table;

  const homeGoals = match.score.fullTime.home;
  const awayGoals = match.score.fullTime.away;

  homeEntry.goalsFor += homeGoals;
  homeEntry.goalsAgainst += awayGoals;
  awayEntry.goalsFor += awayGoals;
  awayEntry.goalsAgainst += homeGoals;
  homeEntry.goalDifference = homeEntry.goalsFor - homeEntry.goalsAgainst;
  awayEntry.goalDifference = awayEntry.goalsFor - awayEntry.goalsAgainst;

  homeEntry.played += 1;
  awayEntry.played += 1;

  const homePos = homeEntry.position;
  const awayPos = awayEntry.position;

  if (homeGoals > awayGoals) {
    homeEntry.wins += 1;
    awayEntry.losses += 1;
    homeEntry.points += mode === 'real'
      ? calculateRealPoints('win')
      : calculatePoints('win', awayPos);
  } else if (homeGoals < awayGoals) {
    awayEntry.wins += 1;
    homeEntry.losses += 1;
    awayEntry.points += mode === 'real'
      ? calculateRealPoints('win')
      : calculatePoints('win', homePos);
  } else {
    homeEntry.draws += 1;
    awayEntry.draws += 1;
    homeEntry.points += mode === 'real'
      ? calculateRealPoints('draw')
      : calculatePoints('draw', awayPos);
    awayEntry.points += mode === 'real'
      ? calculateRealPoints('draw')
      : calculatePoints('draw', homePos);
  }

  return sortAndRank(table);
}

export function processMatches(matches, initialStandings, mode = 'reverse') {
  let table = initializeStandings(initialStandings);

  const finished = matches.filter(
    (m) =>
      m.status === 'FINISHED' &&
      m.score?.fullTime?.home != null &&
      m.score?.fullTime?.away != null
  );

  const sorted = [...finished].sort(
    (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
  );

  for (const match of sorted) {
    table = applyMatch(table, match, mode);
  }

  return table;
}

/**
 * Computes a cumulative table snapshot after each gameweek.
 * Requires matches to have a `matchday` property (integer).
 * Returns { snapshots: Array (index = gameweek number), maxGameweek: number }
 * snapshots[0] is null; snapshots[1] = table after GW1, etc.
 */
export function getGameweekSnapshots(matches, initialStandings, mode = 'reverse') {
  const finished = matches.filter(
    (m) =>
      m.status === 'FINISHED' &&
      m.score?.fullTime?.home != null &&
      m.score?.fullTime?.away != null &&
      m.matchday != null
  );

  if (finished.length === 0) return { snapshots: [], maxGameweek: 0 };

  // Group by matchday and sort within each group chronologically
  const byGameweek = {};
  for (const match of finished) {
    const gw = match.matchday;
    if (!byGameweek[gw]) byGameweek[gw] = [];
    byGameweek[gw].push(match);
  }
  for (const gw of Object.keys(byGameweek)) {
    byGameweek[gw].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
  }

  const maxGameweek = Math.max(...Object.keys(byGameweek).map(Number));

  // snapshots[gw] = shallow copy of each team entry after all GW matches processed
  const snapshots = new Array(maxGameweek + 1).fill(null);
  let table = initializeStandings(initialStandings);

  for (let gw = 1; gw <= maxGameweek; gw++) {
    if (byGameweek[gw]) {
      for (const match of byGameweek[gw]) {
        table = applyMatch(table, match, mode);
      }
    }
    // All team fields are primitives so a shallow spread is a complete copy
    snapshots[gw] = table.map((t) => ({ ...t }));
  }

  return { snapshots, maxGameweek };
}
