import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CHAPTER_CATALOG, type ChapterCatalogEntry } from '../../content/catalog';
import { canonicalHtmlToText, countWords, sanitizeCanonicalHtml } from '../public-ai/htmlContent';

export type ChapterLocale = 'cs' | 'en';

export interface ChapterReaderDocument {
  bodyHtml: string;
  sourceHtml: string;
  sourceLocale: ChapterLocale;
  wordCount: number;
}

function chapterDirectory(chapter: ChapterCatalogEntry): string {
  return chapter.accessPolicy === 'free'
    ? path.join(process.cwd(), 'public', 'books', chapter.collection)
    : path.join(process.cwd(), 'src', 'content', 'protected', chapter.collection);
}

function safeFilename(filename: string): string {
  if (path.basename(filename) !== filename || filename.includes('..')) {
    throw new Error('Invalid chapter filename in canonical catalog');
  }
  return filename;
}

export function canonicalizeChapterLinks(source: string, locale: ChapterLocale): string {
  const localeSuffix = locale === 'en' ? '?locale=en' : '';
  return CHAPTER_CATALOG.reduce(
    (html, chapter) => html.replaceAll(chapter.publicPath, `${chapter.route}${localeSuffix}`),
    source,
  );
}

export async function readChapterDocument(
  chapter: ChapterCatalogEntry,
  locale: ChapterLocale,
): Promise<ChapterReaderDocument> {
  if (chapter.availability !== 'published') {
    throw new Error(`Chapter ${chapter.id} is not published`);
  }

  const directory = chapterDirectory(chapter);
  const requestedFilename = safeFilename(
    locale === 'en' && chapter.filenameEn ? chapter.filenameEn : chapter.filename,
  );
  let sourceLocale: ChapterLocale = locale;
  let source: string;

  try {
    source = await fs.readFile(path.join(directory, requestedFilename), 'utf8');
  } catch (error) {
    if (requestedFilename === chapter.filename) throw error;
    source = await fs.readFile(path.join(directory, safeFilename(chapter.filename)), 'utf8');
    sourceLocale = 'cs';
  }

  const sourceHtml = canonicalizeChapterLinks(source, locale);
  const bodyHtml = sanitizeCanonicalHtml(sourceHtml);
  return {
    bodyHtml,
    sourceHtml,
    sourceLocale,
    wordCount: countWords(canonicalHtmlToText(bodyHtml)),
  };
}
