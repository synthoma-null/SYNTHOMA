import { roundVisibleNumber, formatDelta, formatAbsDelta, formatStatValue } from '../cyklusFormat';

describe('cyklusFormat', () => {
  it('roundVisibleNumber clamps non-finite values to 0', () => {
    expect(roundVisibleNumber(NaN)).toBe(0);
    expect(roundVisibleNumber(Infinity)).toBe(0);
    expect(roundVisibleNumber(-Infinity)).toBe(0);
  });

  it('roundVisibleNumber rounds to nearest integer', () => {
    expect(roundVisibleNumber(13.9999999999)).toBe(14);
    expect(roundVisibleNumber(-7.2)).toBe(-7);
    expect(roundVisibleNumber(0.4)).toBe(0);
  });

  it('formatDelta handles positive, negative and zero values', () => {
    expect(formatDelta(13.9999999999)).toBe('+14');
    expect(formatDelta(-7.2)).toBe('-7');
    expect(formatDelta(0)).toBe('0');
    expect(formatDelta(-0.4)).toBe('0');
  });

  it('formatAbsDelta returns absolute rounded value', () => {
    expect(formatAbsDelta(13.9999999999)).toBe('14');
    expect(formatAbsDelta(-7.2)).toBe('7');
    expect(formatAbsDelta(0)).toBe('0');
  });

  it('formatStatValue returns rounded value without sign', () => {
    expect(formatStatValue(13.9999999999)).toBe('14');
    expect(formatStatValue(-7.2)).toBe('-7');
    expect(formatStatValue(0)).toBe('0');
  });
});
