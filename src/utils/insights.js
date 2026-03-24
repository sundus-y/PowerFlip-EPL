/**
 * Compute key insight metrics from the reverse-scored and real tables,
 * plus raw match data.
 *
 * Returns:
 *   biggestBeneficiary – team that gained the most positions in the reverse table
 *   mostPenalized      – team that lost the most positions in the reverse table
 *   upsetKing          – team with the most wins against higher-ranked opponents
 *   reverseChampion    – position-1 team under the reverse scoring system
 */
export function computeInsights(customTable, realTable, matches = []) {
  if (!customTable?.length || !realTable?.length) return null;

  // Build per-team comparison rows (diff > 0 = improved in reverse table)
  const rows = customTable.map((revTeam) => {
    const realTeam = realTable.find(
      (t) => t.name === revTeam.name || t.shortName === revTeam.shortName
    );
    const realPos = realTeam?.position ?? null;
    const reversePos = revTeam.position;
    const diff = realPos != null ? realPos - reversePos : null;
    return {
      name: revTeam.name,
      shortName: revTeam.shortName,
      crest: revTeam.crest,
      realPos,
      reversePos,
      diff,
      points: revTeam.points,
    };
  });

  // Sort by diff descending
  const byDiff = [...rows]
    .filter((r) => r.diff != null)
    .sort((a, b) => b.diff - a.diff);

  const biggestBeneficiary = byDiff.length > 0 ? byDiff[0] : null;
  const mostPenalized =
    byDiff.length > 0 && byDiff[byDiff.length - 1].diff < 0
      ? byDiff[byDiff.length - 1]
      : null;

  // Reverse Champion – position 1 in the custom (reverse-scored) table
  const reverseChampion =
    rows.find((r) => r.reversePos === 1) ?? customTable[0] ?? null;

  // Upset King – team with the most wins where their REAL position was worse
  // (higher number) than the opponent's real position (underdog won)
  const posMap = buildPosMap(realTable);
  const upsetWins = countUpsetWins(matches, posMap);

  let upsetKingEntry = null;
  let maxUpsetsCount = 0;
  for (const [teamName, count] of Object.entries(upsetWins)) {
    if (count > maxUpsetsCount) {
      maxUpsetsCount = count;
      upsetKingEntry = teamName;
    }
  }

  const upsetKingData = upsetKingEntry
    ? rows.find(
        (r) => r.name === upsetKingEntry || r.shortName === upsetKingEntry
      )
    : null;

  const upsetKing = upsetKingData
    ? { ...upsetKingData, upsetWins: maxUpsetsCount }
    : null;

  return { biggestBeneficiary, mostPenalized, upsetKing, reverseChampion };
}

function buildPosMap(realTable) {
  const map = {};
  for (const t of realTable) {
    if (t.name) map[t.name] = t.position;
    if (t.shortName) map[t.shortName] = t.position;
  }
  return map;
}

function countUpsetWins(matches, posMap) {
  const counts = {};
  const finished = matches.filter(
    (m) =>
      m.status === 'FINISHED' &&
      m.score?.fullTime?.home != null &&
      m.score?.fullTime?.away != null
  );

  for (const match of finished) {
    const homeName = match.homeTeam?.name;
    const awayName = match.awayTeam?.name;
    const homePos = posMap[homeName] ?? posMap[match.homeTeam?.shortName];
    const awayPos = posMap[awayName] ?? posMap[match.awayTeam?.shortName];

    if (!homePos || !awayPos) continue;

    const homeGoals = match.score.fullTime.home;
    const awayGoals = match.score.fullTime.away;

    if (homeGoals > awayGoals && homePos > awayPos) {
      // Home team (underdog) won
      counts[homeName] = (counts[homeName] || 0) + 1;
    } else if (awayGoals > homeGoals && awayPos > homePos) {
      // Away team (underdog) won
      counts[awayName] = (counts[awayName] || 0) + 1;
    }
  }

  return counts;
}
