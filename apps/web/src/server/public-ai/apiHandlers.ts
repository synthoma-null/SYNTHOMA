import { absolutePublicUrl, PUBLIC_CONTENT_UPDATED_AT, type PublicLocale } from './config';
import {
  getPublicArchive,
  getPublicArchiveEntry,
  getPublicAuthor,
  getPublicBook,
  getPublicChapterDocument,
  getPublicChapters,
} from './contentService';
import { localeFromRequest, paginate, publicEnvelope, publicError, publicJson } from './response';
import { enforcePublicRateLimit } from './rateLimit';

function localeOrError(request: Request): PublicLocale | Response {
  const limited = enforcePublicRateLimit(request, 'read');
  if (limited) return limited;
  const locale = localeFromRequest(request);
  return locale ?? publicError(request, 400, 'UNSUPPORTED_LOCALE', 'Supported locales are cs and en.');
}

export async function siteApi(request: Request): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  return publicJson(request, publicEnvelope({
    id: 'synthoma', locale, title: 'SYNTHOMA', canonicalUrl: absolutePublicUrl('/'), visibility: 'publicFull',
    data: {
      description: locale === 'cs'
        ? 'Cesky glitch-noir interaktivni pribeh, archiv a narativni karetní hra.'
        : 'Czech glitch-noir interactive fiction, archive and narrative card game.',
      languages: ['cs', 'en'],
      publicAccess: ['books', 'chapters', 'archive', 'author', 'cards', 'cyklus'],
    },
    links: { self: absolutePublicUrl('/api/public/v1/site'), markdown: absolutePublicUrl(`/ai/${locale}/index.md`), human: absolutePublicUrl('/') },
  }));
}

export async function authorApi(request: Request): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  const author = await getPublicAuthor(locale);
  return publicJson(request, publicEnvelope({
    id: author.id, locale, title: author.title, canonicalUrl: author.canonicalUrl, visibility: 'publicFull', updatedAt: author.updatedAt,
    data: { text: author.text, markdown: author.markdown },
    links: { self: absolutePublicUrl(`/api/public/v1/author?locale=${locale}`), markdown: absolutePublicUrl(`/ai/${locale}/author.md`), human: author.canonicalUrl },
  }));
}

export async function booksApi(request: Request): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  const book = await getPublicBook(locale);
  return publicJson(request, publicEnvelope({
    id: 'books', locale, title: locale === 'cs' ? 'Knihovna' : 'Library', canonicalUrl: absolutePublicUrl('/books'), visibility: 'publicFull',
    data: { items: [{ id: book.id, title: book.title, description: book.description, chapterCount: book.chapters.length }] },
    links: { self: absolutePublicUrl(`/api/public/v1/books?locale=${locale}`), human: absolutePublicUrl('/books'), markdown: absolutePublicUrl(`/ai/${locale}/books/synthoma-null.md`) },
  }));
}

export async function bookApi(request: Request, id: string): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  if (id !== 'synthoma-null') return publicError(request, 404, 'NOT_FOUND', 'Unknown public book.');
  const book = await getPublicBook(locale);
  return publicJson(request, publicEnvelope({
    id: book.id, locale, title: book.title, canonicalUrl: book.canonicalUrl, visibility: 'publicFull', updatedAt: book.updatedAt,
    data: { description: book.description, chapters: book.chapters.map(chapterMetadata) },
    links: { self: absolutePublicUrl(`/api/public/v1/books/${book.id}?locale=${locale}`), human: book.canonicalUrl, markdown: absolutePublicUrl(`/ai/${locale}/books/synthoma-null.md`) },
  }));
}

function chapterMetadata(chapter: Awaited<ReturnType<typeof getPublicChapterDocument>> & {}) {
  if (!chapter) return null;
  return {
    id: chapter.id, title: chapter.title, status: chapter.status, visibility: chapter.visibility,
    summary: chapter.summary, canonicalUrl: chapter.canonicalUrl, wordCount: chapter.wordCount,
  };
}

export async function chaptersApi(request: Request): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  const chapters = await getPublicChapters(locale);
  const page = paginate(request, chapters.map(chapterMetadata));
  if (!page) return publicError(request, 400, 'INVALID_CURSOR', 'The pagination cursor is invalid.');
  return publicJson(request, publicEnvelope({
    id: 'chapters', locale, title: locale === 'cs' ? 'Kapitoly' : 'Chapters', canonicalUrl: absolutePublicUrl('/books'), visibility: 'publicFull',
    data: page,
    links: { self: request.url, human: absolutePublicUrl('/books'), book: absolutePublicUrl(`/api/public/v1/books/synthoma-null?locale=${locale}`) },
  }));
}

export async function chapterApi(request: Request, id: string): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  const chapter = await getPublicChapterDocument(id, locale);
  if (!chapter) return publicError(request, 404, 'NOT_FOUND', 'Unknown chapter.');
  return publicJson(request, publicEnvelope({
    id: chapter.id, locale, title: chapter.title, canonicalUrl: chapter.canonicalUrl, visibility: chapter.visibility, updatedAt: chapter.updatedAt,
    data: {
      status: chapter.status, sourceLocale: chapter.sourceLocale, summary: chapter.summary,
      text: chapter.text, markdown: chapter.markdown, wordCount: chapter.wordCount,
    },
    links: {
      self: absolutePublicUrl(`/api/public/v1/chapters/${chapter.id}?locale=${locale}`), human: chapter.canonicalUrl,
      markdown: absolutePublicUrl(`/ai/${locale}/chapters/${chapter.id}.md`),
      previous: chapter.previousId ? absolutePublicUrl(`/chapter/${chapter.previousId}`) : null,
      next: chapter.nextId ? absolutePublicUrl(`/chapter/${chapter.nextId}`) : null,
    },
  }));
}

function archiveData(entry: ReturnType<typeof getPublicArchive>[number]) {
  return {
    id: entry.id, title: entry.title, category: entry.category, teaser: entry.teaser,
    visibility: entry.visibility, quote: entry.quote ?? null, body: entry.body, tags: entry.tags ?? [],
    access: entry.access ? {
      mode: entry.access.mode, requiredChapterId: entry.access.requiredChapterId,
      mnemCost: entry.access.mnemCost, label: entry.access.label,
    } : null,
  };
}

export async function archiveApi(request: Request): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  const page = paginate(request, getPublicArchive(locale).map(archiveData));
  if (!page) return publicError(request, 400, 'INVALID_CURSOR', 'The pagination cursor is invalid.');
  return publicJson(request, publicEnvelope({
    id: 'archive', locale, title: locale === 'cs' ? 'Archiv' : 'Archive', canonicalUrl: absolutePublicUrl('/archive'), visibility: 'publicFull',
    data: page,
    links: { self: request.url, human: absolutePublicUrl('/archive'), markdown: absolutePublicUrl(`/ai/${locale}/archive.md`) },
  }));
}

export async function archiveEntryApi(request: Request, id: string): Promise<Response> {
  const locale = localeOrError(request);
  if (locale instanceof Response) return locale;
  const entry = getPublicArchiveEntry(id, locale);
  if (!entry) return publicError(request, 404, 'NOT_FOUND', 'Unknown or private archive entry.');
  return publicJson(request, publicEnvelope({
    id: entry.id, locale, title: entry.title, canonicalUrl: absolutePublicUrl(`/archive/${entry.id}`), visibility: entry.visibility,
    updatedAt: PUBLIC_CONTENT_UPDATED_AT, data: archiveData(entry),
    links: { self: absolutePublicUrl(`/api/public/v1/archive/${entry.id}?locale=${locale}`), human: absolutePublicUrl(`/archive/${entry.id}`), collection: absolutePublicUrl(`/api/public/v1/archive?locale=${locale}`) },
  }));
}
