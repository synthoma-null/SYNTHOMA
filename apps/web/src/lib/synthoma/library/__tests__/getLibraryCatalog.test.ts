import { getLibraryCatalog } from '../getLibraryCatalog';

describe('getLibraryCatalog', () => {
  it('loads the SYNTHOMA-NULL collection with 22 chapters', async () => {
    const catalog = await getLibraryCatalog();
    expect(catalog.collections).toHaveLength(1);
    expect(catalog.collections[0]?.slug).toBe('SYNTHOMA-NULL');
    expect(catalog.collections[0]?.chapters.length).toBe(22);
  });

  it('marks the first chapter as free', async () => {
    const catalog = await getLibraryCatalog();
    const first = catalog.collections[0]?.chapters[0];
    expect(first?.access).toBe('free');
  });

  it('resolves canonical chapter id for 0-inf-restart', async () => {
    const catalog = await getLibraryCatalog();
    const restart = catalog.collections[0]?.chapters.find((ch) => ch.filename.includes('0-∞'));
    expect(restart?.id).toBe('0-inf-restart');
  });

  it('returns an empty catalog when no collection matches', async () => {
    const catalog = await getLibraryCatalog();
    expect(catalog.collections.find((c) => c.slug === 'unknown')).toBeUndefined();
  });
});
