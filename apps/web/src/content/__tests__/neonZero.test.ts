/** @jest-environment node */

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import {
  CHAPTER_CATALOG,
  getBookCollection,
  getChapterCatalogEntry,
  getNextChapter,
} from '../catalog';
import { canonicalHtmlToText } from '../../server/public-ai/htmlContent';
import { getReadingProgressKey } from '../../lib/readerState';

const BOOK_DIRECTORY = path.join(process.cwd(), 'public', 'books', 'SYNTHOMA-NEON-0');
const ARCHIVE_FILE = path.join(process.cwd(), 'public', 'data', 'archiveCards.json');
const chapters = CHAPTER_CATALOG.filter((chapter) => chapter.collection === 'neon-0');
const expectedTitles = [
  '01. [BOUŘKA]',
  '02. [POSUDEK]',
  '03. [PŘESUN]',
  '04. [POŽÁR]',
  '05. [NEÚPLNÝ ZÁZNAM]',
  '06. [ODEZVA]',
  '07. [MILO-0]',
  '08. [KOTVA]',
  '09. [PROTIHLAS]',
  '10. [T-AI]',
  '11. [PACIENT 64]',
  '12. [PACIENT 128]',
  '13. [PACIENT 1024]',
  '14. [T.O.V.A.]',
  '15. [NÁVRAT]',
  '16. [DVEŘE]',
  '17. [ŠKÁLOVÁNÍ]',
  '18. [ÚNIK PAMĚTI]',
  '19. [LIŠKA]',
  '20. [KONEC RELACE]',
  '21. [UKONČENÍ]',
  '22. [NEON-0]',
  '23. [KOLIZE]',
  '24. [TŘI ÚDERY]',
];

describe('SYNTHOMA: NEON-0 content contract', () => {
  it('registers exactly 24 complete Czech chapters in canonical order', () => {
    expect(getBookCollection('neon-0')).toMatchObject({
      directory: 'SYNTHOMA-NEON-0',
      title: 'SYNTHOMA: NEON-0',
      language: 'cs',
      status: 'complete',
    });
    expect(chapters).toHaveLength(24);
    expect(chapters.map((chapter) => chapter.order)).toEqual(
      Array.from({ length: 24 }, (_, index) => index),
    );
    expect(chapters.map((chapter) => chapter.fullTitle)).toEqual(expectedTitles);
    expect(chapters.every((chapter) => (
      chapter.status === 'final'
      && chapter.accessPolicy === 'free'
      && chapter.filenameEn === undefined
    ))).toBe(true);
  });

  it('keeps slugs, source files, metadata and chapter bodies unique and complete', () => {
    expect(new Set(chapters.map((chapter) => chapter.id)).size).toBe(24);
    expect(new Set(chapters.map((chapter) => chapter.filename)).size).toBe(24);
    expect(readdirSync(BOOK_DIRECTORY).filter((name) => name.endsWith('.html'))).toHaveLength(24);

    for (const chapter of chapters) {
      const source = readFileSync(path.join(BOOK_DIRECTORY, chapter.filename), 'utf8');
      const words = canonicalHtmlToText(source).split(/\s+/u).filter(Boolean);
      expect(source).toContain('data-book="neon-0"');
      expect(source).toContain(`data-chapter="${chapter.ordinal}"`);
      expect(source).toContain(`<title>SYNTHOMA: NEON-0 — ${chapter.fullTitle}</title>`);
      expect(source).toContain(`<h1 class="title neon-title">${chapter.fullTitle}</h1>`);
      expect(source).toContain('aria-label="Kanonický přechod kapitoly"');
      expect(source.match(/<h1\b/gi)).toHaveLength(1);
      expect(source).not.toMatch(/<style\b|\sstyle\s*=/i);
      expect(source).not.toContain('\uFFFD');

      const bridge = source.match(/<p class="neon-bridge">([\s\S]*?)<\/p>/)?.[1] ?? '';
      const coda = source.match(/<section class="neon-canonical-coda"[\s\S]*?<\/section>/)?.[0] ?? '';
      expect(bridge).not.toContain('?');
      expect(coda).not.toContain('?');
      expect(words.length).toBeGreaterThan(1200);
    }
  });

  it('keeps Czech NEON-0 archive records free of damaged diacritics', () => {
    const archive = JSON.parse(readFileSync(ARCHIVE_FILE, 'utf8')) as {
      cards: Array<Record<string, unknown> & { sourceBook?: string }>;
    };
    const neonCards = archive.cards.filter((card) => card.sourceBook === 'neon-0');
    const serialized = JSON.stringify(neonCards);

    expect(neonCards).toHaveLength(8);
    expect(serialized).not.toContain('\uFFFD');
    expect(serialized).not.toContain('?');
    expect(serialized).toContain('Sára Neonová');
    expect(serialized).toContain('Tři údery');
  });

  it('keeps previous and next navigation inside NEON-0', () => {
    expect(getNextChapter('n0-01-bourka')?.id).toBe('n0-02-posudek');
    expect(getNextChapter('n0-24-tri-udery')).toBeUndefined();
    expect(getChapterCatalogEntry('SYNTHOMA_NEON_0_24_TRI_UDERY.html')?.id)
      .toBe('n0-24-tri-udery');
  });

  it('uses a scoped, responsive reader theme with reduced and off motion states', () => {
    const css = readFileSync(path.join(BOOK_DIRECTORY, 'neon-0.css'), 'utf8');
    expect(css).toContain('.chapter-content[data-book="neon-0"]');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('html[data-motion="off"]');
    postcss.parse(css).walkRules((rule) => {
      if (rule.parent?.type === 'atrule' && 'name' in rule.parent && /keyframes$/i.test(String(rule.parent.name))) return;
      expect(rule.selector).toMatch(/data-book="neon-0"|html\[data-motion/);
    });
  });

  it('keeps reading progress separate from the other two books', () => {
    expect(getReadingProgressKey('neon-0')).toBe('readingProgress:neon-0');
    expect(getReadingProgressKey('neon-0')).not.toBe(getReadingProgressKey('SYNTHOMA-NULL'));
    expect(getReadingProgressKey('neon-0')).not.toBe(getReadingProgressKey('konec-podpory'));
  });
});
