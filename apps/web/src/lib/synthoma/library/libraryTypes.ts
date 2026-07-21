export type LibraryChapterState = 'free' | 'owned' | 'locked' | 'unavailable';

export interface LibraryChapter {
  id: string;
  title: string;
  path: string;
  filename: string;
  collectionSlug: string;
  order: number;
  access: LibraryChapterState;
  mnemCost: number | null;
  packageIds: string[];
  backgroundVideo?: string | undefined;
  track?: string | undefined;
  summary?: string | undefined;
  status?: string | undefined;
  estimatedMinutes?: number | undefined;
  teaser?: string | undefined;
  unlocks?: string | undefined;
}

export interface LibraryCollection {
  slug: string;
  publicId?: string | undefined;
  title: string;
  shortTitle?: string | undefined;
  cover?: string | undefined;
  description?: string | undefined;
  stylesheet?: string | undefined;
  language?: string | undefined;
  order?: number | undefined;
  status?: 'complete' | 'ongoing' | undefined;
  chapters: LibraryChapter[];
  availableCount: number;
  totalCount: number;
}

export interface LibraryCatalog {
  collections: LibraryCollection[];
}

export interface LibraryResumeTarget {
  href: string;
  label: string;
  chapterId: string;
  chapterTitle: string;
  collectionSlug: string;
  percent: number;
}

export interface LibraryReadingProgress {
  collectionSlug: string;
  path: string;
  percent: number;
  updatedAt: number;
}
