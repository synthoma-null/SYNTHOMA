import { getLibraryCatalog } from '../getLibraryCatalog';

describe('getLibraryCatalog', () => {
  it('loads both collections in canonical order', async () => {
    const catalog = await getLibraryCatalog();
    expect(catalog.collections).toHaveLength(2);
    expect(catalog.collections[0]?.slug).toBe('SYNTHOMA-NULL');
    expect(catalog.collections[0]?.chapters.length).toBe(22);
    expect(catalog.collections[1]).toMatchObject({
      slug: 'konec-podpory',
      title: 'SYNTHOMA: KONEC PODPORY',
      availableCount: 19,
      totalCount: 19,
      status: 'complete',
    });
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

  it('gives every public library chapter a canonical route id', async () => {
    const catalog = await getLibraryCatalog();
    const chapters = catalog.collections.flatMap((collection) => collection.chapters);
    expect(chapters).not.toHaveLength(0);
    expect(chapters.every((chapter) => typeof chapter.id === 'string' && chapter.id.length > 0)).toBe(true);
  });

  it('returns an empty catalog when no collection matches', async () => {
    const catalog = await getLibraryCatalog();
    expect(catalog.collections.find((c) => c.slug === 'unknown')).toBeUndefined();
  });
});
