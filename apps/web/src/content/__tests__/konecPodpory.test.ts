/** @jest-environment node */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import postcss from 'postcss';
import {
  CHAPTER_CATALOG,
  getBookCollection,
  getChapterCatalogEntry,
  getNextChapter,
} from '../catalog';
import { getReadingProgressKey } from '../../lib/readerState';

const BOOK_DIRECTORY = path.join(process.cwd(), 'public', 'books', 'SYNTHOMA-KONEC_PODPORY');
const chapters = CHAPTER_CATALOG.filter((chapter) => chapter.collection === 'konec-podpory');

describe('SYNTHOMA: KONEC PODPORY content contract', () => {
  it('registers one complete Czech collection with all 19 free chapters in explicit order', () => {
    expect(getBookCollection('konec-podpory')).toMatchObject({
      directory: 'SYNTHOMA-KONEC_PODPORY',
      title: 'SYNTHOMA: KONEC PODPORY',
      language: 'cs',
      order: 0,
      status: 'complete',
    });
    expect(chapters).toHaveLength(19);
    expect(chapters.map((chapter) => chapter.order)).toEqual(Array.from({ length: 19 }, (_, index) => index));
    expect(chapters.every((chapter) => chapter.status === 'final' && chapter.accessPolicy === 'free')).toBe(true);
    expect(chapters[0]?.id).toBe('kp-00-podporovano');
    expect(chapters[18]?.id).toBe('kp-18-konec-podpory');
    expect(chapters.every((chapter) => typeof chapter.summary === 'string' && chapter.summary.length > 40)).toBe(true);
  });

  it('keeps previous and next navigation inside the collection', () => {
    expect(getNextChapter('kp-00-podporovano')?.id).toBe('kp-01-oznameni');
    expect(getNextChapter('kp-18-konec-podpory')).toBeUndefined();
    expect(getChapterCatalogEntry('SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html')?.id)
      .toBe('kp-18-konec-podpory');
  });

  it('loads external scoped CSS and contains clean, accessible chapter sources', () => {
    for (const chapter of chapters) {
      const source = readFileSync(path.join(BOOK_DIRECTORY, chapter.filename), 'utf8');
      const code = String(chapter.order).padStart(2, '0');
      expect(source).toContain('/books/SYNTHOMA-KONEC_PODPORY/konec-podpory.css');
      expect(source).toContain('data-book="konec-podpory"');
      expect(source).toContain(`data-chapter="${code}"`);
      expect(source.match(/<h1\b/gi)).toHaveLength(1);
      expect(source).not.toMatch(/<style\b|\sstyle\s*=/i);
      expect(source).not.toContain('/books/glitch-toggle.js');
    }

    const css = readFileSync(path.join(BOOK_DIRECTORY, 'konec-podpory.css'), 'utf8');
    expect(css).toContain('.kp-chapter[data-book="konec-podpory"]');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('kpBook-00-');
    postcss.parse(css).walkRules((rule) => {
      if (rule.parent?.type === 'atrule' && 'name' in rule.parent && /keyframes$/i.test(String(rule.parent.name))) return;
      expect(rule.selector).toContain('data-book="konec-podpory"');
    });
  });

  it('uses canonical in-book choice links, including the final loop to chapter 00', () => {
    chapters.forEach((chapter, index) => {
      const source = readFileSync(path.join(BOOK_DIRECTORY, chapter.filename), 'utf8');
      const expected = index === chapters.length - 1
        ? '/chapter/kp-00-podporovano'
        : `/chapter/${chapters[index + 1]?.id}`;
      const choiceLinks = [...source.matchAll(/<a\b[^>]*class="[^"]*choice-link[^"]*"[^>]*href="([^"]+)"/gi)];
      expect(choiceLinks.length).toBeGreaterThan(0);
      expect(choiceLinks.every((match) => match[1] === expected)).toBe(true);
    });
  });

  it('keeps reading progress separate from SYNTHOMA-NULL', () => {
    expect(getReadingProgressKey('konec-podpory')).toBe('readingProgress:konec-podpory');
    expect(getReadingProgressKey('konec-podpory')).not.toBe(getReadingProgressKey('SYNTHOMA-NULL'));
  });
});
