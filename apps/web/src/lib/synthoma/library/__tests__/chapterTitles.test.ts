import { getLibraryCatalog } from '../getLibraryCatalog';

describe('library chapter presentation titles', () => {
  it('keeps ordinals separate and never renders duplicated numbering', async () => {
    const catalog = await getLibraryCatalog();
    const chapters = catalog.collections.flatMap((collection) => collection.chapters);

    for (const chapter of chapters) {
      expect(chapter.ordinal).toBeTruthy();
      expect(chapter.fullTitle).toBeTruthy();
      expect(`${chapter.ordinal} ${chapter.title}`).not.toMatch(/^(\d{2})\s+\1\./);
      expect(`${chapter.ordinal} ${chapter.title}`).not.toMatch(/^(0-(?:\d+|∞))\s+\1\s/);
    }
  });
});
