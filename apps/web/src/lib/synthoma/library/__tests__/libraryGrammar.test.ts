import { formatCollectionCount } from '../libraryGrammar';

describe('formatCollectionCount', () => {
  it.each([
    [1, '1 sbírka'],
    [2, '2 sbírky'],
    [4, '4 sbírky'],
    [5, '5 sbírek'],
    [12, '12 sbírek'],
  ])('formats Czech collection count %s', (count, expected) => {
    expect(formatCollectionCount(count, 'cs')).toBe(expected);
  });

  it('formats English singular and plural forms', () => {
    expect(formatCollectionCount(1, 'en')).toBe('1 collection');
    expect(formatCollectionCount(2, 'en')).toBe('2 collections');
  });
});
