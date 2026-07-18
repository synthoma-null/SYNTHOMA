/** @jest-environment node */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { CHAPTER_CATALOG } from '../../src/content/catalog';
import robots from '../robots';
import sitemap from '../sitemap';
import { generateMetadata } from './[id]/page';

jest.mock('../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../src/server/economy', () => ({ getContentAccess: jest.fn() }));
jest.mock('../../src/server/runtimeDatabase', () => ({
  reportRuntimeDatabaseError: jest.fn(() => ({ correlationId: 'seo-test' })),
}));
jest.mock('../../src/components/access/ContentPurchaseDialog', () => ({
  __esModule: true,
  default: () => null,
}));

describe('chapter SEO contracts', () => {
  it('generates unique canonical metadata and chapter social previews', async () => {
    const published = CHAPTER_CATALOG.filter((chapter) => chapter.availability === 'published');
    const metadata = await Promise.all(published.map((chapter) => generateMetadata({
      params: Promise.resolve({ id: chapter.id }),
      searchParams: Promise.resolve({}),
    })));
    expect(new Set(metadata.map((entry) => entry.title)).size).toBe(published.length);
    metadata.forEach((entry, index) => {
      const chapter = published[index]!;
      expect(entry.description).toBeTruthy();
      expect(entry.alternates?.canonical).toBe(`https://www.synthoma.cz/chapter/${chapter.id}`);
      expect(entry.alternates?.languages).toMatchObject({ cs: expect.any(String), en: expect.any(String), 'x-default': expect.any(String) });
      const images = entry.openGraph?.images;
      const firstImage = Array.isArray(images) ? images[0] : images;
      expect(firstImage).toMatchObject({ url: `https://www.synthoma.cz/chapter/${chapter.id}/opengraph-image` });
    });

    const english = await generateMetadata({
      params: Promise.resolve({ id: '0-inf-restart' }),
      searchParams: Promise.resolve({ locale: 'en' }),
    });
    expect(english.alternates?.canonical).toBe('https://www.synthoma.cz/chapter/0-inf-restart?locale=en');
    expect(english.description).toBe('Read 0-∞ [RESTART], a chapter of the interactive psychological novel SYNTHOMA-NULL.');
    expect(english.description).not.toContain('Smyčka začíná znovu');
  });

  it('keeps sitemap and robots on canonical public routes', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain('https://www.synthoma.cz/chapter/0-inf-restart');
    expect(urls).not.toContain('https://www.synthoma.cz/chapter/0-12-conflict');
    expect(urls.some((url) => url.includes('/reader'))).toBe(false);

    const rules = robots().rules;
    expect(JSON.stringify(rules)).toContain('/chapter/');
    expect(JSON.stringify(rules)).toContain('/reader');
  });

  it('keeps static Info and Author calls to action on the canonical chapter route', () => {
    const filenames = [
      'SYNTHOMAINFO.html',
      'SYNTHOMAINFO_en.html',
      'SYNTHOMAAUTOR.html',
      'SYNTHOMAAUTOR_en.html',
    ];

    for (const filename of filenames) {
      const html = readFileSync(path.join(process.cwd(), 'public/data', filename), 'utf8');
      expect(html).not.toContain('/reader?');
      expect(html).toContain('/chapter/0-inf-restart');
    }
  });

  it('keeps the reader selectable and within a prose reading measure', () => {
    const css = readFileSync(path.join(process.cwd(), 'src/styles/reader.css'), 'utf8');
    expect(css).toMatch(/chapter-reader__article\.SYNTHOMAREADER[\s\S]*max-width:\s*48rem/);
    expect(css).toMatch(/chapter-reader__article\.SYNTHOMAREADER[\s\S]*user-select:\s*text\s*!important/);
    expect(css).toMatch(/chapter-content p[\s\S]*line-height:\s*1\.72/);
  });
});
