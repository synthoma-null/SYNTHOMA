import { clampStat, clampRelation, average, countBy } from '../cyklusMath';

describe('cyklusMath', () => {
  it('clampStat clamps to 0–100', () => {
    expect(clampStat(-5)).toBe(0);
    expect(clampStat(0)).toBe(0);
    expect(clampStat(50)).toBe(50);
    expect(clampStat(100)).toBe(100);
    expect(clampStat(150)).toBe(100);
  });

  it('clampRelation clamps to -10–10', () => {
    expect(clampRelation(-15)).toBe(-10);
    expect(clampRelation(-10)).toBe(-10);
    expect(clampRelation(0)).toBe(0);
    expect(clampRelation(10)).toBe(10);
    expect(clampRelation(20)).toBe(10);
  });

  it('average returns 0 for empty array', () => {
    expect(average([])).toBe(0);
  });

  it('average computes mean', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3);
  });

  it('countBy counts occurrences', () => {
    expect(countBy(['a', 'b', 'a', 'c', 'a'])).toEqual({ a: 3, b: 1, c: 1 });
  });
});
