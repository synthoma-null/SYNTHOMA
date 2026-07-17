/** @jest-environment node */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { CHAPTER_CATALOG } from '../catalog';
import {
  CHAPTER_PRESENTATIONS,
  getChapterPresentation,
  validateChapterPresentations,
} from '../chapterPresentation';

const assetExists = (publicPath: string) => existsSync(path.join(process.cwd(), 'public', publicPath.replace(/^\//, '')));

describe('chapter presentation registry', () => {
  it('covers every canonical chapter and every published poster with existing assets', () => {
    expect(validateChapterPresentations(CHAPTER_PRESENTATIONS, assetExists)).toEqual([]);
    expect(Object.keys(CHAPTER_PRESENTATIONS).sort()).toEqual(CHAPTER_CATALOG.map((chapter) => chapter.id).sort());
    for (const chapter of CHAPTER_CATALOG.filter((entry) => entry.availability === 'published')) {
      expect(getChapterPresentation(chapter.id)?.poster).toBeTruthy();
    }
  });

  it('uses explicit stable mappings and an explicit no-video fallback', () => {
    expect(getChapterPresentation('0-0-null')?.video?.sources).toEqual([
      { src: '/video/SYNTHOMA23.webm', type: 'video/webm' },
    ]);
    expect(getChapterPresentation('0-11-orgie')?.video).toBeNull();
    expect(getChapterPresentation('0-11-orgie')?.poster).toBe('/books/SYNTHOMA-NULL/SYNTHOMA_cover.png');
  });

  it('reports unknown mappings, missing assets and paths outside public media roots', () => {
    const registry = {
      ...CHAPTER_PRESENTATIONS,
      unknown: { ...CHAPTER_PRESENTATIONS['0-0-null']!, chapterId: 'unknown' },
      '0-0-null': { ...CHAPTER_PRESENTATIONS['0-0-null']!, poster: '/private/poster.webp' },
    };
    const errors = validateChapterPresentations(registry, () => false);
    expect(errors).toEqual(expect.arrayContaining([
      expect.stringContaining('unknown chapter'),
      expect.stringContaining('outside approved public media roots'),
      expect.stringContaining('asset is missing'),
    ]));
  });
});
