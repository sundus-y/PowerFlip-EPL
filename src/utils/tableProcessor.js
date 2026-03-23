import { calculatePoints } from './scoring';

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

export function processMatches(matches, initialStandings) {
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

    if (!homeEntry || !awayEntry) continue;

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
      homeEntry.points += calculatePoints('win', awayPos);
    } else if (homeGoals < awayGoals) {
      awayEntry.wins += 1;
      homeEntry.losses += 1;
      awayEntry.points += calculatePoints('win', homePos);
    } else {
      homeEntry.draws += 1;
      awayEntry.draws += 1;
      homeEntry.points += calculatePoints('draw', awayPos);
      awayEntry.points += calculatePoints('draw', homePos);
    }

    table = sortAndRank(table);
  }

  return table;
}
