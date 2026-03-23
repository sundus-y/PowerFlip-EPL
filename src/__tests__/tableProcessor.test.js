import { describe, it, expect } from 'vitest';
import { processMatches } from '../utils/tableProcessor';

// Helper to build simple initial standings
function makeStandings(names) {
  return names.map((name, i) => ({
    name,
    shortName: name,
    crest: '',
    position: i + 1,
  }));
}

// Helper to build a finished match object
function makeMatch(id, homeTeam, awayTeam, homeGoals, awayGoals, date = '2023-08-12T15:00:00Z') {
  return {
    id,
    utcDate: date,
    status: 'FINISHED',
    homeTeam: { name: homeTeam, shortName: homeTeam, crest: '' },
    awayTeam: { name: awayTeam, shortName: awayTeam, crest: '' },
    score: { fullTime: { home: homeGoals, away: awayGoals } },
  };
}

describe('processMatches', () => {
  it('returns empty table when no matches provided', () => {
    const standings = makeStandings(['A', 'B', 'C']);
    const result = processMatches([], standings);
    expect(result).toHaveLength(3);
    result.forEach((team) => {
      expect(team.played).toBe(0);
      expect(team.points).toBe(0);
    });
  });

  it('processes a single win correctly', () => {
    // A is rank 1, B is rank 2 initially
    // A beats B: A gets reversePos(2) = 19 pts, B gets 0
    const standings = makeStandings(['A', 'B']);
    const matches = [makeMatch(1, 'A', 'B', 2, 0)];
    const result = processMatches(matches, standings);

    const teamA = result.find((t) => t.name === 'A');
    const teamB = result.find((t) => t.name === 'B');

    expect(teamA.wins).toBe(1);
    expect(teamA.losses).toBe(0);
    expect(teamA.points).toBe(19); // reversePos(2) = 20-2+1 = 19

    expect(teamB.wins).toBe(0);
    expect(teamB.losses).toBe(1);
    expect(teamB.points).toBe(0);
  });

  it('processes a draw correctly', () => {
    // A is rank 1 (reversePos=20), B is rank 2 (reversePos=19)
    // Draw: A gets round(19/2)=10, B gets round(20/2)=10
    const standings = makeStandings(['A', 'B']);
    const matches = [makeMatch(1, 'A', 'B', 1, 1)];
    const result = processMatches(matches, standings);

    const teamA = result.find((t) => t.name === 'A');
    const teamB = result.find((t) => t.name === 'B');

    expect(teamA.draws).toBe(1);
    expect(teamB.draws).toBe(1);
    // A draws vs B (pos 2) → round(reversePos(2)/2) = round(19/2) = round(9.5) = 10
    expect(teamA.points).toBe(10);
    // B draws vs A (pos 1) → round(reversePos(1)/2) = round(20/2) = 10
    expect(teamB.points).toBe(10);
  });

  it('updates table positions after a match', () => {
    // A=rank1, B=rank2, C=rank3, D=rank4 initially
    // D beats A: D gets reversePos(1)=20pts, A gets 0
    // D should now be ranked 1
    const standings = makeStandings(['A', 'B', 'C', 'D']);
    const matches = [makeMatch(1, 'D', 'A', 1, 0)];
    const result = processMatches(matches, standings);

    const teamD = result.find((t) => t.name === 'D');
    expect(teamD.points).toBe(20);
    expect(teamD.position).toBe(1);
  });

  it('uses updated positions for subsequent matches', () => {
    // A=rank1, B=rank2 initially
    // Match 1 (early): B beats A → B gets reversePos(1)=20pts, ranks 1st
    // Match 2 (later): C beats B → C gets reversePos(B's new position=1)=20pts
    const standings = makeStandings(['A', 'B', 'C']);
    const matches = [
      makeMatch(1, 'B', 'A', 1, 0, '2023-08-10T15:00:00Z'),
      makeMatch(2, 'C', 'B', 1, 0, '2023-08-17T15:00:00Z'),
    ];
    const result = processMatches(matches, standings);

    const teamC = result.find((t) => t.name === 'C');
    // After match 1: B is rank 1, so C beating B earns reversePos(1)=20pts
    // But standings has 3 teams so TOTAL_TEAMS=20 means reversePos(1)=20
    expect(teamC.points).toBe(20);
  });

  it('sorts matches chronologically before processing', () => {
    // If match 2 is processed before match 1 (wrong order), positions differ
    // We give matches in reverse order and verify correct processing
    const standings = makeStandings(['A', 'B', 'C', 'D']);
    const matchesInOrder = [
      makeMatch(1, 'A', 'B', 2, 0, '2023-08-10T15:00:00Z'), // A wins first
      makeMatch(2, 'C', 'A', 1, 0, '2023-08-17T15:00:00Z'), // C beats A later
    ];
    const matchesReversed = [...matchesInOrder].reverse();

    const result1 = processMatches(matchesInOrder, standings);
    const result2 = processMatches(matchesReversed, standings);

    // Both should produce the same result since we sort by date
    const a1 = result1.find((t) => t.name === 'A');
    const a2 = result2.find((t) => t.name === 'A');
    expect(a1.points).toBe(a2.points);
  });

  it('ignores non-FINISHED matches', () => {
    const standings = makeStandings(['A', 'B']);
    const matches = [
      { id: 1, utcDate: '2023-08-12T15:00:00Z', status: 'SCHEDULED',
        homeTeam: { name: 'A', shortName: 'A', crest: '' },
        awayTeam: { name: 'B', shortName: 'B', crest: '' },
        score: { fullTime: { home: null, away: null } } },
    ];
    const result = processMatches(matches, standings);
    expect(result.find((t) => t.name === 'A').played).toBe(0);
  });

  it('tracks goals for and against correctly', () => {
    const standings = makeStandings(['A', 'B']);
    const matches = [makeMatch(1, 'A', 'B', 3, 1)];
    const result = processMatches(matches, standings);

    const teamA = result.find((t) => t.name === 'A');
    const teamB = result.find((t) => t.name === 'B');

    expect(teamA.goalsFor).toBe(3);
    expect(teamA.goalsAgainst).toBe(1);
    expect(teamA.goalDifference).toBe(2);

    expect(teamB.goalsFor).toBe(1);
    expect(teamB.goalsAgainst).toBe(3);
    expect(teamB.goalDifference).toBe(-2);
  });
});
