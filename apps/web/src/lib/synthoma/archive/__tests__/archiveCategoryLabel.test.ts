import { getArchiveCategoryLabel } from '../archiveCategoryLabel';

describe('getArchiveCategoryLabel', () => {
  it('maps stored Czech category ids to readable Czech labels', () => {
    expect(getArchiveCategoryLabel('zaklad', 'cs')).toBe('JÁDRO SVĚTA');
    expect(getArchiveCategoryLabel('postavy', 'cs')).toBe('ENTITY');
    expect(getArchiveCategoryLabel('lokace', 'cs')).toBe('MÍSTA A SEKTORY');
    expect(getArchiveCategoryLabel('design', 'cs')).toBe('AUTORSKÁ BIBLE');
  });

  it('preserves unknown categories as an uppercase fallback', () => {
    expect(getArchiveCategoryLabel('signal', 'en')).toBe('SIGNAL');
  });
});
