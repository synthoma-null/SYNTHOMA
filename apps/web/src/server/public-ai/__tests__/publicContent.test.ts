/** @jest-environment node */

import { CYKLUS_CARDS } from '../../../game/cyklus/cyklusCards';
import { chapterApi, chaptersApi } from '../apiHandlers';
import { cardApi, cardsApi } from '../cardHandlers';
import { getPublicArchive, getPublicAuthor, getPublicCard, getPublicCards, getPublicChapterDocument, getPublicChapters } from '../contentService';
import { archiveMarkdown, authorMarkdown, bookMarkdown, chapterMarkdown, siteMarkdown } from '../markdown';
import { resetPublicRateLimitsForTests } from '../rateLimit';
import { resolveCardPublicVisibility } from '../visibility';

function request(path: string, headers?: HeadersInit) {
  return new Request(`https://www.synthoma.cz${path}`, headers ? { headers } : undefined);
}

function collectKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (Array.isArray(value)) value.forEach((item) => collectKeys(item, keys));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => { keys.add(key); collectKeys(item, keys); });
  return keys;
}

describe('public content visibility', () => {
  beforeEach(resetPublicRateLimitsForTests);

  it('publishes full free chapters and metadata-only locked chapters in both locales', async () => {
    const [freeCs, freeEn, locked, cs, en] = await Promise.all([
      getPublicChapterDocument('0-0-null', 'cs'), getPublicChapterDocument('0-0-null', 'en'),
      getPublicChapterDocument('0-4-defragmentation', 'cs'), getPublicChapters('cs'), getPublicChapters('en'),
    ]);
    expect(freeCs).toMatchObject({ visibility: 'publicFull', status: 'free', sourceLocale: 'cs' });
    expect(freeCs?.text?.length).toBeGreaterThan(500);
    expect(freeEn).toMatchObject({ visibility: 'publicFull', status: 'free', sourceLocale: 'en' });
    expect(locked).toMatchObject({ visibility: 'publicMetadata', status: 'locked', text: null, markdown: null, bodyHtml: null });
    expect(en.map((chapter) => chapter.id)).toEqual(cs.map((chapter) => chapter.id));
    expect(chapterMarkdown(locked!)).not.toContain('<article');
  });

  it('exports all public Markdown indexes from canonical content', async () => {
    const outputs = await Promise.all([siteMarkdown('cs'), siteMarkdown('en'), authorMarkdown('cs'), archiveMarkdown('en'), bookMarkdown('cs')]);
    outputs.forEach((output) => expect(output).toContain('https://www.synthoma.cz'));
    expect(outputs[2]).toContain('# O autorovi');
    expect(outputs[4]).toContain('0-0 [NULL]');
    expect(await getPublicAuthor('en')).toMatchObject({ locale: 'en', canonicalUrl: 'https://www.synthoma.cz/autor' });
  });

  it('keeps private Archive entries out and strips full bodies from metadata records', () => {
    const archive = getPublicArchive('cs');
    expect(archive.every((entry) => entry.visibility !== 'private')).toBe(true);
    expect(archive.filter((entry) => entry.visibility === 'publicMetadata').every((entry) => entry.body.length === 0 && entry.quote === undefined)).toBe(true);
  });

  it('derives card visibility from the canonical registry', () => {
    const all = Object.values(CYKLUS_CARDS);
    const cards = getPublicCards('cs');
    expect(cards.filter((card) => card.visibility === 'publicFull')).toHaveLength(66);
    expect(cards.filter((card) => card.visibility === 'publicMetadata')).toHaveLength(158);
    expect(all.filter((card) => resolveCardPublicVisibility(card) === 'hidden')).toHaveLength(17);
    expect(cards).toHaveLength(all.filter((card) => resolveCardPublicVisibility(card) !== 'hidden').length);
    expect(getPublicCard('tutorial_00_welcome', 'cs')).toBeNull();
    const full = cards.find((card) => card.visibility === 'publicFull')!;
    const metadata = cards.find((card) => card.visibility === 'publicMetadata')!;
    expect(full).toMatchObject({ sourceLocale: 'cs' });
    expect(full.choices).toHaveLength(2);
    expect(full.posterUrl).toMatch(/^https:\/\/www\.synthoma\.cz\/cards\/cyklus\/.+\.webp$/);
    expect(metadata).toMatchObject({ scene: null, choices: [], posterUrl: null });
  });

  it('returns versioned paginated JSON with CORS and ETag but no personal data keys', async () => {
    const first = await chaptersApi(request('/api/public/v1/chapters?locale=cs&limit=2'));
    expect(first.status).toBe(200);
    expect(first.headers.get('access-control-allow-origin')).toBe('*');
    const etag = first.headers.get('etag')!;
    expect(etag).toBeTruthy();
    const payload = await first.json();
    expect(payload).toMatchObject({ schemaVersion: '1', locale: 'cs', data: { limit: 2 } });
    expect(payload.data.items).toHaveLength(2);
    expect(payload.data.nextCursor).toEqual(expect.any(String));
    const forbidden = ['userId', 'email', 'purchases', 'entitlements', 'mnemBalance', 'sessionId'];
    forbidden.forEach((key) => expect(collectKeys(payload).has(key)).toBe(false));

    const cached = await chaptersApi(request('/api/public/v1/chapters?locale=cs&limit=2', { 'If-None-Match': etag }));
    expect(cached.status).toBe(304);
  });

  it('never exposes locked chapter text or hidden cards through detail APIs', async () => {
    const locked = await chapterApi(request('/api/public/v1/chapters/0-4-defragmentation'), '0-4-defragmentation');
    expect(await locked.json()).toMatchObject({ visibility: 'publicMetadata', data: { text: null, markdown: null } });
    const hidden = cardApi(request('/api/public/v1/cards/tutorial_00_welcome'), 'tutorial_00_welcome');
    expect(hidden.status).toBe(404);
    const page = cardsApi(request('/api/public/v1/cards?limit=1'));
    expect((await page.json()).data.items).toHaveLength(1);
  });
});
