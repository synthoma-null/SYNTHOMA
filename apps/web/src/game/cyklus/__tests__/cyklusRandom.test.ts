import { seededRandom, hashSeed, weightedPickBase } from '../cyklusRandom';

describe('cyklusRandom', () => {
  it('seededRandom is deterministic for same seed and step', () => {
    const r1 = seededRandom('test', 1);
    const r2 = seededRandom('test', 1);
    expect(r1).toBe(r2);
    expect(r1).toBeGreaterThanOrEqual(0);
    expect(r1).toBeLessThan(1);
  });

  it('seededRandom differs for different steps', () => {
    const r1 = seededRandom('test', 1);
    const r2 = seededRandom('test', 2);
    expect(r1).not.toBe(r2);
  });

  it('hashSeed returns a value between 0 and 1', () => {
    const value = hashSeed('some-seed');
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('weightedPickBase returns null for empty candidates', () => {
    expect(weightedPickBase([], 0.5)).toBeNull();
  });

  it('weightedPickBase returns first item when roll is 0', () => {
    const candidates = [{ item: 'a', weight: 1 }, { item: 'b', weight: 1 }];
    expect(weightedPickBase(candidates, 0)).toBe('a');
  });

  it('weightedPickBase respects weights', () => {
    const candidates = [{ item: 'a', weight: 1 }, { item: 'b', weight: 3 }];
    // roll 0.25 -> remaining = 1.0, after a: 0.75, after b: -2.25 -> b
    expect(weightedPickBase(candidates, 0.25)).toBe('b');
    // roll 0.1 -> remaining = 0.4, after a: -0.6 -> a
    expect(weightedPickBase(candidates, 0.1)).toBe('a');
  });
});
