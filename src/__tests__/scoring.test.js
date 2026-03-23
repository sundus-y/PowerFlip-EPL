import { describe, it, expect } from 'vitest';
import { getReversePosition, calculatePoints, TOTAL_TEAMS } from '../utils/scoring';

describe('getReversePosition', () => {
  it('returns 20 for position 1 (top team)', () => {
    expect(getReversePosition(1)).toBe(20);
  });

  it('returns 1 for position 20 (bottom team)', () => {
    expect(getReversePosition(20)).toBe(1);
  });

  it('returns 10 for position 11 (mid-table)', () => {
    expect(getReversePosition(11)).toBe(10);
  });

  it('returns 19 for position 2', () => {
    expect(getReversePosition(2)).toBe(19);
  });

  it('follows formula: TOTAL_TEAMS - position + 1', () => {
    for (let pos = 1; pos <= TOTAL_TEAMS; pos++) {
      expect(getReversePosition(pos)).toBe(TOTAL_TEAMS - pos + 1);
    }
  });
});

describe('calculatePoints', () => {
  describe('win scenario', () => {
    it('win vs rank-1 opponent earns 20 points', () => {
      expect(calculatePoints('win', 1)).toBe(20);
    });

    it('win vs rank-20 opponent earns 1 point', () => {
      expect(calculatePoints('win', 20)).toBe(1);
    });

    it('win vs rank-5 opponent earns 16 points', () => {
      expect(calculatePoints('win', 5)).toBe(16);
    });

    it('win vs rank-10 opponent earns 11 points', () => {
      expect(calculatePoints('win', 10)).toBe(11);
    });
  });

  describe('draw scenario', () => {
    it('draw vs rank-1 earns 10 points (round(20/2))', () => {
      expect(calculatePoints('draw', 1)).toBe(10);
    });

    it('draw vs rank-20 earns 1 point (round(1/2) = 1)', () => {
      expect(calculatePoints('draw', 20)).toBe(1);
    });

    it('draw vs rank-19 earns 1 point (round(2/2))', () => {
      expect(calculatePoints('draw', 19)).toBe(1);
    });

    it('draw vs rank-2 earns 10 points (round(19/2) = 10)', () => {
      expect(calculatePoints('draw', 2)).toBe(10);
    });

    it('draw vs rank-3 earns 9 points (round(18/2))', () => {
      expect(calculatePoints('draw', 3)).toBe(9);
    });

    it('draw uses Math.round for odd reverse positions', () => {
      // rank 2 → reversePos = 19, draw = round(19/2) = round(9.5) = 10
      expect(calculatePoints('draw', 2)).toBe(10);
      // rank 4 → reversePos = 17, draw = round(17/2) = round(8.5) = 9
      expect(calculatePoints('draw', 4)).toBe(9);
    });
  });

  describe('loss scenario', () => {
    it('loss always earns 0 points regardless of opponent rank', () => {
      expect(calculatePoints('loss', 1)).toBe(0);
      expect(calculatePoints('loss', 10)).toBe(0);
      expect(calculatePoints('loss', 20)).toBe(0);
    });
  });
});
