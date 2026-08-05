import type { ManagedBook, ManagedChapter, Prisma, PrismaClient } from '@prisma/client';
import generatedLibraryCatalog from '../../content/generated/libraryCatalog.json';
import {
  BOOK_COLLECTIONS,
  CHAPTER_CATALOG,
  getBookCollection,
  getCatalogEntry,
  getChapterCatalogEntry,
  type BookCollectionDefinition,
  type CatalogAccessPolicy,
  type CatalogEntry,
  type ChapterCatalogEntry,
  type ContentType,
} from '../../content/catalog';
import type { LibraryCatalog, LibraryCollection } from '../../lib/synthoma/library/libraryTypes';
import { canonicalHtmlToText, countWords, sanitizeCanonicalHtml } from '../public-ai/htmlContent';
import {
  canonicalizeChapterLinks,
  readChapterDocument,
  type ChapterLocale,
  type ChapterReaderDocument,
} from '../chapters/chapterDocument';

export type ManagedVisibility = 'published' | 'hidden';
export type ManagedAccessPolicy = 'inherit' | 'free' | 'entitlement';
export type ManagedContentClient = Prisma.TransactionClient | PrismaClient;

export interface EffectiveManagedBook extends BookCollectionDefinition {
  id: string;
  visibility: ManagedVisibility;
  accessPolicy: ManagedAccessPolicy;
  isCustom: boolean;
  overridden: boolean;
  updatedAt: Date | null;
}

export interface EffectiveManagedChapter {
  chapter: ChapterCatalogEntry;
  bookId: string;
  visibility: ManagedVisibility;
  accessPolicy: ManagedAccessPolicy;
  isCustom: boolean;
  overridden: boolean;
  bodyHtml: string | null;
  bodyHtmlEn: string | null;
  updatedAt: Date | null;
}

export interface ManagedContentCatalog {
  books: EffectiveManagedBook[];
  chapters: EffectiveManagedChapter[];
}

type ManagedRows = { books: ManagedBook[]; chapters: ManagedChapter[] };

const staticBookById = new Map(BOOK_COLLECTIONS.map((book) => [book.publicId, book]));

function validVisibility(value: string | null | undefined): ManagedVisibility {
  return value === 'hidden' ? 'hidden' : 'published';
}

function validAccessPolicy(value: string | null | undefined): ManagedAccessPolicy {
  return value === 'free' || value === 'entitlement' ? value : 'inherit';
}

function collectionId(reference: string): string {
  return getBookCollection(reference)?.publicId ?? reference.toLowerCase();
}

function displayParts(fullTitle: string, ordinalOverride?: string | null) {
  const numbered = fullTitle.match(/^(\d{1,3})\.\s+(.+)$/);
  const coded = fullTitle.match(/^(0-(?:\d+|∞))\s+(.+)$/);
  return {
    ordinal: ordinalOverride?.trim() || numbered?.[1] || coded?.[1] || '00',
    displayTitle: numbered?.[2] || coded?.[2] || fullTitle,
  };
}

function effectiveBook(base: BookCollectionDefinition | undefined, row: ManagedBook): EffectiveManagedBook {
  const id = base?.publicId ?? row.id;
  const cover = row.cover?.trim() || base?.cover;
  return {
    id,
    slug: base?.slug ?? row.id,
    publicId: id,
    directory: base?.directory ?? row.id,
    title: row.title?.trim() || base?.title || row.id,
    shortTitle: row.shortTitle?.trim() || base?.shortTitle || row.title?.trim() || row.id,
    description: row.description?.trim() || base?.description || '',
    ...(cover ? { cover } : {}),
    ...(base?.stylesheet ? { stylesheet: base.stylesheet } : {}),
    language: row.language === 'cs' || !base ? 'cs' : base.language,
    order: row.sortOrder ?? base?.order ?? 100,
    status: row.status === 'complete' ? 'complete' : row.status === 'ongoing' ? 'ongoing' : base?.status ?? 'ongoing',
    visibility: validVisibility(row.visibility),
    accessPolicy: validAccessPolicy(row.accessPolicy),
    isCustom: row.isCustom,
    overridden: true,
    updatedAt: row.updatedAt,
  };
}

function untouchedBook(base: BookCollectionDefinition): EffectiveManagedBook {
  return {
    ...base,
    id: base.publicId,
    visibility: 'published',
    accessPolicy: 'inherit',
    isCustom: false,
    overridden: false,
    updatedAt: null,
  };
}

function effectiveChapter(
  base: ChapterCatalogEntry | undefined,
  row: ManagedChapter,
  book: EffectiveManagedBook,
): EffectiveManagedChapter {
  const fullTitle = row.title?.trim() || base?.fullTitle || row.id;
  const parts = displayParts(fullTitle, row.ordinal);
  const rowPolicy = validAccessPolicy(row.accessPolicy);
  const accessPolicy = rowPolicy !== 'inherit'
    ? rowPolicy
    : book.accessPolicy !== 'inherit'
      ? book.accessPolicy
      : base?.accessPolicy ?? 'free';
  const normalizedPolicy: CatalogAccessPolicy = accessPolicy === 'entitlement' ? 'entitlement' : 'free';
  const visibility = validVisibility(row.visibility);
  const inheritedCost = typeof base?.mnemCost === 'number' && base.mnemCost > 0 ? base.mnemCost : 64;
  const mnemCost = normalizedPolicy === 'free' ? 0 : row.mnemCost ?? inheritedCost;
  const filename = base?.filename ?? `${row.id}.html`;
  const titleEn = row.titleEn?.trim() || base?.titleEn;
  const summary = row.summary?.trim() || base?.summary;
  const chapter: ChapterCatalogEntry = {
    id: row.id,
    type: 'chapter',
    ordinal: parts.ordinal,
    title: fullTitle,
    ...(titleEn ? { titleEn } : {}),
    displayTitle: parts.displayTitle,
    fullTitle,
    collection: book.slug,
    filename,
    ...(base?.filenameEn ? { filenameEn: base.filenameEn } : {}),
    publicPath: base?.publicPath ?? `/chapter/${row.id}`,
    route: `/chapter/${row.id}`,
    availability: visibility === 'hidden' || book.visibility === 'hidden'
      ? 'unavailable'
      : base?.availability ?? 'published',
    accessPolicy: normalizedPolicy,
    mnemCost,
    packageIds: base?.packageIds ?? [],
    aliases: base?.aliases ?? [],
    order: row.sortOrder ?? base?.order ?? 0,
    ...(base?.sourcePath ? { sourcePath: base.sourcePath } : {}),
    ...(base?.track ? { track: base.track } : {}),
    ...(base?.backgroundVideo ? { backgroundVideo: base.backgroundVideo } : {}),
    ...(summary ? { summary } : {}),
    status: base?.status ?? 'final',
    metadata: base?.metadata ?? {},
  };
  return {
    chapter,
    bookId: book.id,
    visibility,
    accessPolicy: rowPolicy,
    isCustom: row.isCustom,
    overridden: true,
    bodyHtml: row.bodyHtml,
    bodyHtmlEn: row.bodyHtmlEn,
    updatedAt: row.updatedAt,
  };
}

function untouchedChapter(base: ChapterCatalogEntry, book: EffectiveManagedBook): EffectiveManagedChapter {
  const bookPolicy = book.accessPolicy;
  const accessPolicy = bookPolicy === 'inherit' ? base.accessPolicy : bookPolicy;
  return {
    chapter: {
      ...base,
      collection: book.slug,
      availability: book.visibility === 'hidden' ? 'unavailable' : base.availability,
      accessPolicy: accessPolicy === 'entitlement' ? 'entitlement' : 'free',
      mnemCost: accessPolicy === 'free'
        ? 0
        : typeof base.mnemCost === 'number' && base.mnemCost > 0 ? base.mnemCost : 64,
    },
    bookId: book.id,
    visibility: 'published',
    accessPolicy: 'inherit',
    isCustom: false,
    overridden: false,
    bodyHtml: null,
    bodyHtmlEn: null,
    updatedAt: book.updatedAt,
  };
}

export function mergeManagedContent(rows: ManagedRows): ManagedContentCatalog {
  const bookRows = new Map(rows.books.map((row) => [row.id, row]));
  const books = BOOK_COLLECTIONS.map((base) => {
    const row = bookRows.get(base.publicId);
    if (row) bookRows.delete(base.publicId);
    return row ? effectiveBook(base, row) : untouchedBook(base);
  });
  for (const row of bookRows.values()) {
    if (row.isCustom) books.push(effectiveBook(undefined, row));
  }
  books.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'cs'));

  const bookById = new Map(books.map((book) => [book.id, book]));
  const chapterRows = new Map(rows.chapters.map((row) => [row.id, row]));
  const chapters = CHAPTER_CATALOG.map((base) => {
    const row = chapterRows.get(base.id);
    if (row) chapterRows.delete(base.id);
    const book = bookById.get(row?.bookId ?? collectionId(base.collection));
    if (!book) return null;
    return row ? effectiveChapter(base, row, book) : untouchedChapter(base, book);
  }).filter((chapter): chapter is EffectiveManagedChapter => Boolean(chapter));

  for (const row of chapterRows.values()) {
    if (!row.isCustom) continue;
    const book = bookById.get(row.bookId);
    if (book) chapters.push(effectiveChapter(undefined, row, book));
  }
  chapters.sort((a, b) => {
    const bookOrder = (bookById.get(a.bookId)?.order ?? 0) - (bookById.get(b.bookId)?.order ?? 0);
    return bookOrder || (a.chapter.order ?? 0) - (b.chapter.order ?? 0) || a.chapter.title.localeCompare(b.chapter.title, 'cs');
  });
  return { books, chapters };
}

async function loadManagedRows(client: ManagedContentClient): Promise<ManagedRows> {
  const [books, chapters] = await Promise.all([
    client.managedBook.findMany(),
    client.managedChapter.findMany(),
  ]);
  return { books, chapters };
}

export async function getManagedContentCatalog(
  client?: ManagedContentClient,
): Promise<ManagedContentCatalog> {
  // Jednotkové testy statického katalogu nesmějí potřebovat vzdálenou databázi.
  if (process.env.NODE_ENV === 'test' && process.env.MANAGED_CONTENT_DATABASE_TESTS !== '1') {
    return mergeManagedContent({ books: [], chapters: [] });
  }
  const resolvedClient = client ?? (await import('../../lib/prisma')).default;
  return mergeManagedContent(await loadManagedRows(resolvedClient));
}

export async function getManagedChapter(
  reference: string,
  client?: ManagedContentClient,
): Promise<EffectiveManagedChapter | undefined> {
  const catalog = await getManagedContentCatalog(client);
  const staticId = getChapterCatalogEntry(reference)?.id;
  return catalog.chapters.find((item) => item.chapter.id === (staticId ?? reference));
}

export async function getManagedChapterContext(
  reference: string,
  client?: ManagedContentClient,
): Promise<{
  managed: EffectiveManagedChapter;
  book: EffectiveManagedBook;
  chapters: ChapterCatalogEntry[];
} | undefined> {
  const catalog = await getManagedContentCatalog(client);
  const staticId = getChapterCatalogEntry(reference)?.id;
  const managed = catalog.chapters.find((item) => item.chapter.id === (staticId ?? reference));
  if (!managed) return undefined;
  const book = catalog.books.find((item) => item.id === managed.bookId);
  if (!book) return undefined;
  const chapters = catalog.chapters
    .filter((item) => item.bookId === book.id && item.visibility === 'published')
    .map((item) => item.chapter)
    .filter((chapter) => chapter.availability === 'published')
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  return { managed, book, chapters };
}

export async function getManagedBook(
  reference: string,
  client?: ManagedContentClient,
): Promise<EffectiveManagedBook | undefined> {
  const id = collectionId(reference);
  return (await getManagedContentCatalog(client)).books.find((book) => book.id === id);
}

export async function getManagedCatalogEntries(
  client: ManagedContentClient,
  requests: readonly { contentType: ContentType; contentId: string }[],
): Promise<CatalogEntry[]> {
  const needsChapters = requests.some((request) => request.contentType === 'chapter');
  const managed = needsChapters ? await getManagedContentCatalog(client) : null;
  return requests.map((request) => {
    if (request.contentType === 'chapter') {
      const staticId = getChapterCatalogEntry(request.contentId)?.id;
      const chapter = managed?.chapters.find((item) => item.chapter.id === (staticId ?? request.contentId));
      if (chapter) return chapter.chapter;
    }
    const entry = getCatalogEntry(request.contentType, request.contentId);
    if (!entry) throw new Error(`CONTENT_NOT_FOUND:${request.contentType}:${request.contentId}`);
    return entry;
  });
}

export async function getManagedCatalogEntry(
  contentType: ContentType,
  contentId: string,
  client?: ManagedContentClient,
): Promise<CatalogEntry | undefined> {
  if (contentType === 'chapter') return (await getManagedChapter(contentId, client))?.chapter;
  return getCatalogEntry(contentType, contentId);
}

export async function readManagedChapterDocument(
  managed: EffectiveManagedChapter,
  locale: ChapterLocale,
): Promise<ChapterReaderDocument> {
  const overriddenSource = locale === 'en' && managed.bodyHtmlEn
    ? managed.bodyHtmlEn
    : managed.bodyHtml;
  if (overriddenSource) {
    const sourceLocale: ChapterLocale = locale === 'en' && managed.bodyHtmlEn ? 'en' : 'cs';
    const sourceHtml = canonicalizeChapterLinks(sanitizeCanonicalHtml(overriddenSource), locale);
    const bodyHtml = sanitizeCanonicalHtml(sourceHtml);
    return {
      bodyHtml,
      sourceHtml,
      sourceLocale,
      wordCount: countWords(canonicalHtmlToText(bodyHtml)),
    };
  }
  if (managed.isCustom) throw new Error(`Custom chapter ${managed.chapter.id} has no body`);
  const base = getChapterCatalogEntry(managed.chapter.id);
  if (!base) throw new Error(`Canonical source for ${managed.chapter.id} was not found`);
  return readChapterDocument(base, locale);
}

function toLibraryCollection(
  book: EffectiveManagedBook,
  chapters: EffectiveManagedChapter[],
): LibraryCollection {
  const libraryChapters = chapters
    .filter((item) => item.bookId === book.id && item.visibility !== 'hidden')
    .map(({ chapter }) => ({
      id: chapter.id,
      ordinal: chapter.ordinal,
      title: chapter.displayTitle,
      fullTitle: chapter.fullTitle,
      path: chapter.route,
      filename: chapter.filename,
      collectionSlug: book.slug,
      order: chapter.order ?? 0,
      access: chapter.availability !== 'published'
        ? 'unavailable' as const
        : chapter.accessPolicy === 'free'
          ? 'free' as const
          : 'locked' as const,
      mnemCost: chapter.mnemCost,
      packageIds: chapter.packageIds,
      ...(chapter.backgroundVideo ? { backgroundVideo: chapter.backgroundVideo } : {}),
      ...(chapter.track ? { track: chapter.track } : {}),
      ...(chapter.summary ? { summary: chapter.summary } : {}),
      status: chapter.status,
      ...(typeof chapter.metadata?.estimatedMinutes === 'number'
        ? { estimatedMinutes: chapter.metadata.estimatedMinutes }
        : {}),
      ...(typeof chapter.metadata?.teaser === 'string' ? { teaser: chapter.metadata.teaser } : {}),
      ...(typeof chapter.metadata?.unlocks === 'string' ? { unlocks: chapter.metadata.unlocks } : {}),
    }));
  return {
    slug: book.slug,
    publicId: book.publicId,
    title: book.title,
    shortTitle: book.shortTitle,
    ...(book.cover ? { cover: book.cover } : {}),
    ...(book.description ? { description: book.description } : {}),
    ...(book.stylesheet ? { stylesheet: book.stylesheet } : {}),
    language: book.language,
    order: book.order,
    status: book.status,
    chapters: libraryChapters,
    availableCount: libraryChapters.filter((chapter) => chapter.access === 'free').length,
    totalCount: libraryChapters.length,
  };
}

export async function getManagedLibraryCatalog(
  client?: ManagedContentClient,
): Promise<LibraryCatalog> {
  const managed = await getManagedContentCatalog(client);
  const collections = managed.books
    .filter((book) => book.visibility === 'published')
    .map((book) => toLibraryCollection(book, managed.chapters));
  return { collections };
}

export function getStaticLibraryCatalog(): LibraryCatalog {
  return generatedLibraryCatalog as LibraryCatalog;
}

export function staticBookExists(id: string): boolean {
  return staticBookById.has(id);
}

export function staticChapterExists(id: string): boolean {
  return CHAPTER_CATALOG.some((chapter) => chapter.id === id);
}
