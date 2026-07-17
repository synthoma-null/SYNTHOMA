import { BOOK_COLLECTION, CHAPTER_CATALOG, getChapterCatalogEntry } from './catalog';

export interface ChapterVideoSource {
  src: string;
  type: 'video/webm' | 'video/mp4';
}

export interface ChapterPresentation {
  chapterId: string;
  video: { sources: ChapterVideoSource[] } | null;
  poster: string;
  fallbackImage: string;
  overlay: {
    opacity: number;
    color: string;
  };
  accessibilityLabel: string;
}

const DEFAULT_POSTER = BOOK_COLLECTION.cover;

const PUBLISHED_POSTERS: Readonly<Record<string, string>> = {
  '0-inf-restart': '/chapters/posters/0-inf-restart.webp',
  '0-0-null': '/chapters/posters/0-0-null.webp',
  '0-1-start': '/chapters/posters/0-1-start.webp',
  '0-2-run': '/chapters/posters/0-2-run.webp',
  '0-3-discontinuum': '/chapters/posters/0-3-discontinuum.webp',
  '0-4-defragmentation': '/chapters/posters/0-4-defragmentation.webp',
  '0-5-pause': '/chapters/posters/0-5-pause.webp',
  '0-6-searching': '/chapters/posters/0-6-searching.webp',
  '0-7-ruins': '/chapters/posters/0-7-ruins.webp',
  '0-8-reziduum': '/chapters/posters/0-8-reziduum.webp',
  '0-9-sector': '/chapters/posters/0-9-sector.webp',
  '0-10-rest': '/chapters/posters/0-10-rest.webp',
  '0-11-orgie': DEFAULT_POSTER,
};

function createPresentation(chapter: (typeof CHAPTER_CATALOG)[number]): ChapterPresentation {
  const poster = PUBLISHED_POSTERS[chapter.id] ?? DEFAULT_POSTER;
  return {
    chapterId: chapter.id,
    video: chapter.backgroundVideo
      ? { sources: [{ src: chapter.backgroundVideo, type: 'video/webm' }] }
      : null,
    poster,
    fallbackImage: DEFAULT_POSTER,
    overlay: { opacity: 0.72, color: '#050507' },
    accessibilityLabel: `Vizuální pozadí kapitoly ${chapter.title}`,
  };
}

export const CHAPTER_PRESENTATIONS: Readonly<Record<string, ChapterPresentation>> =
  Object.freeze(Object.fromEntries(CHAPTER_CATALOG.map((chapter) => [chapter.id, createPresentation(chapter)])));

export function getChapterPresentation(reference: string): ChapterPresentation | null {
  const chapter = getChapterCatalogEntry(reference);
  return chapter ? CHAPTER_PRESENTATIONS[chapter.id] ?? null : null;
}

export function validateChapterPresentations(): string[] {
  return CHAPTER_CATALOG.flatMap((chapter) => {
    const presentation = CHAPTER_PRESENTATIONS[chapter.id];
    if (!presentation) return [`${chapter.id}: presentation is missing`];
    if (chapter.availability === 'published' && !presentation.poster) {
      return [`${chapter.id}: published chapter poster is missing`];
    }
    if (presentation.video && presentation.video.sources.length === 0) {
      return [`${chapter.id}: video has no sources`];
    }
    return [];
  });
}
