import { promises as fs } from 'fs';
import path from 'path';
import { CHAPTERS } from '../../../content/booksManifest';
import type { LibraryCatalog, LibraryChapter, LibraryCollection } from './libraryTypes';

export interface RawManifest {
  collections?: RawCollection[];
}

export interface RawCollection {
  slug: string;
  title: string;
  cover?: string;
  description?: string;
  chapters?: RawChapter[];
}

export interface RawChapter {
  title: string;
  path: string;
  free?: boolean;
  track?: string;
  backgroundVideo?: string;
  chapterOrder?: number;
  summary?: string;
  status?: string;
}

function resolveChapterId(path: string): string {
  const filename = decodeURIComponent(path.split('/').pop() || '');
  const found = CHAPTERS.find((c) => c.filename === filename);
  return found?.id ?? '';
}

function resolveAccess(isFree: boolean): 'free' | 'paid' {
  return isFree ? 'free' : 'paid';
}

export async function getLibraryCatalog(): Promise<LibraryCatalog> {
  const manifestPath = path.join(process.cwd(), 'public', 'books', 'manifest.json');
  let rawManifest: RawManifest = { collections: [] };
  try {
    const raw = await fs.readFile(manifestPath, 'utf8');
    rawManifest = JSON.parse(raw) as RawManifest;
  } catch {
    rawManifest = { collections: [] };
  }

  const collections: LibraryCollection[] = (rawManifest.collections || []).map((col) => {
    const chapters: LibraryChapter[] = (col.chapters || []).map((ch, idx) => {
      const filename = decodeURIComponent(ch.path.split('/').pop() || '');
      const meta = CHAPTERS.find((c) => c.filename === filename);
      const isFree = meta ? meta.access === 'free' : ch.free !== false;
      const chapterId = meta?.id ?? resolveChapterId(ch.path);

      return {
        id: chapterId,
        title: ch.title,
        path: ch.path,
        filename,
        collectionSlug: col.slug,
        order: meta?.order ?? ch.chapterOrder ?? idx,
        access: resolveAccess(isFree),
        mnemCost: meta?.mnemCost ?? 64,
        backgroundVideo: ch.backgroundVideo,
        track: ch.track,
        summary: ch.summary,
        status: ch.status,
        estimatedMinutes: meta?.estimatedMinutes,
        teaser: meta?.teaser,
        unlocks: meta?.unlocks,
      };
    });

    const availableCount = chapters.filter((c) => c.access === 'free').length;

    return {
      slug: col.slug,
      title: col.title,
      cover: col.cover,
      description: col.description,
      chapters,
      availableCount,
      totalCount: chapters.length,
    };
  });

  return { collections };
}

export async function getLibraryCollectionBySlug(slug: string): Promise<LibraryCollection | undefined> {
  const catalog = await getLibraryCatalog();
  return catalog.collections.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}
