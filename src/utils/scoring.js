export const TOTAL_TEAMS = 20;

export function getReversePosition(position) {
  return TOTAL_TEAMS - position + 1;
}

export function calculatePoints(result, opponentPosition) {
  const reversePos = getReversePosition(opponentPosition);
  if (result === 'win') return reversePos;
  if (result === 'draw') return Math.round(reversePos / 2);
  return 0; // loss
}
