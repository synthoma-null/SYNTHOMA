import { promises as fs } from 'fs';
import path from 'path';
import archiveCardsCs from '../../../public/data/archiveCards.json';
import archiveCardsEn from '../../../public/data/archiveCards_en.json';
import { BOOK_COLLECTION, CHAPTER_CATALOG, getChapterCatalogEntry } from '../../content/catalog';
import { CYKLUS_CARDS } from '../../game/cyklus/cyklusCards';
import type { SwipeCard } from '../../game/cyklus/cyklusTypes';
import { normalizeArchiveCards } from '../../lib/synthoma/archive/normalizeArchiveEntries';
import type { ArchiveCard } from '../../lib/synthoma/archive/archiveTypes';
import type { ArchiveCardData } from '../../../app/archive/ArchiveClient';
import { readChapterDocument } from '../chapters/chapterDocument';
import { absolutePublicUrl, PUBLIC_CONTENT_UPDATED_AT, type PublicLocale } from './config';
import { canonicalHtmlToMarkdown, canonicalHtmlToText, sanitizeCanonicalHtml } from './htmlContent';
import {
  resolveArchivePublicVisibility,
  resolveCardPublicVisibility,
  resolveChapterPublicVisibility,
  type PublicCardVisibility,
  type PublicVisibility,
} from './visibility';

export interface PublicChapterDocument {
  id: string;
  title: string;
  locale: PublicLocale;
  sourceLocale: PublicLocale;
  visibility: PublicVisibility;
  status: 'free' | 'locked' | 'unavailable';
  canonicalUrl: string;
  updatedAt: string;
  summary: string;
  bodyHtml: string | null;
  text: string | null;
  markdown: string | null;
  wordCount: number | null;
  previousId: string | null;
  nextId: string | null;
}

export async function getPublicChapterDocument(reference: string, locale: PublicLocale): Promise<PublicChapterDocument | null> {
  const chapter = getChapterCatalogEntry(reference);
  if (!chapter) return null;
  const visibility = resolveChapterPublicVisibility(chapter);
  const index = CHAPTER_CATALOG.findIndex((entry) => entry.id === chapter.id);
  let bodyHtml: string | null = null;
  let text: string | null = null;
  let markdown: string | null = null;
  let wordCount: number | null = null;
  let sourceLocale: PublicLocale = locale;

  if (visibility === 'publicFull') {
    const document = await readChapterDocument(chapter, locale);
    bodyHtml = document.bodyHtml;
    text = canonicalHtmlToText(document.bodyHtml);
    markdown = canonicalHtmlToMarkdown(document.sourceHtml);
    wordCount = document.wordCount;
    sourceLocale = document.sourceLocale;
  }

  const status = chapter.availability !== 'published'
    ? 'unavailable'
    : chapter.accessPolicy === 'free' ? 'free' : 'locked';

  return {
    id: chapter.id,
    title: locale === 'en' ? chapter.titleEn ?? chapter.title : chapter.title,
    locale,
    sourceLocale,
    visibility,
    status,
    canonicalUrl: absolutePublicUrl(`/chapter/${chapter.id}`),
    updatedAt: PUBLIC_CONTENT_UPDATED_AT,
    summary: chapter.summary ?? '',
    bodyHtml,
    text,
    markdown,
    wordCount,
    previousId: index > 0 ? CHAPTER_CATALOG[index - 1]?.id ?? null : null,
    nextId: index >= 0 ? CHAPTER_CATALOG[index + 1]?.id ?? null : null,
  };
}

export async function getPublicChapters(locale: PublicLocale): Promise<PublicChapterDocument[]> {
  return Promise.all(CHAPTER_CATALOG.map((chapter) => getPublicChapterDocument(chapter.id, locale)))
    .then((entries) => entries.filter((entry): entry is PublicChapterDocument => Boolean(entry)));
}

export async function getPublicBook(locale: PublicLocale) {
  const chapters = await getPublicChapters(locale);
  return {
    id: 'synthoma-null',
    locale,
    title: BOOK_COLLECTION.title,
    canonicalUrl: absolutePublicUrl('/books'),
    updatedAt: PUBLIC_CONTENT_UPDATED_AT,
    description: locale === 'en'
      ? 'An interactive glitch-noir book about memory, identity and a system that refuses to forget.'
      : 'Interaktivni glitch-noir kniha o pameti, identite a systemu, ktery odmita zapomenout.',
    chapters,
  };
}

function archiveSource(locale: PublicLocale): ArchiveCard[] {
  const source = locale === 'en' ? archiveCardsEn : archiveCardsCs;
  return normalizeArchiveCards((source as { cards: ArchiveCardData[] }).cards ?? []);
}

export function getPublicArchive(locale: PublicLocale): Array<ArchiveCard & { visibility: PublicVisibility }> {
  return archiveSource(locale)
    .map((card) => ({ ...card, visibility: resolveArchivePublicVisibility(card) }))
    .filter((card) => card.visibility !== 'private')
    .map((card) => card.visibility === 'publicFull' ? card : { ...card, body: [], quote: undefined, images: undefined });
}

export function getPublicArchiveEntry(id: string, locale: PublicLocale) {
  return getPublicArchive(locale).find((entry) => entry.id === id) ?? null;
}

export interface PublicCardDocument {
  id: string;
  locale: PublicLocale;
  sourceLocale: 'cs';
  visibility: PublicCardVisibility;
  title: string;
  category: SwipeCard['category'];
  tags: string[];
  scene: string | null;
  choices: Array<{ id: 'yes' | 'no'; label: string }>;
  posterUrl: string | null;
  posterAlt: string | null;
  canonicalUrl: string;
  updatedAt: string;
}

function publicCardDocument(card: SwipeCard, locale: PublicLocale): PublicCardDocument {
  const visibility = resolveCardPublicVisibility(card);
  const full = visibility === 'publicFull';
  const posterPath = full ? card.presentation?.artSrc ?? `/cards/cyklus/${card.id}.webp` : null;
  return {
    id: card.id,
    locale,
    sourceLocale: 'cs',
    visibility,
    title: card.title,
    category: card.category,
    tags: [...card.tags],
    scene: full ? card.scene : null,
    choices: full ? [{ id: 'yes', label: card.yesLabel }, { id: 'no', label: card.noLabel }] : [],
    posterUrl: posterPath ? absolutePublicUrl(posterPath) : null,
    posterAlt: full ? card.presentation?.artAlt ?? `Obrazovy zaznam: ${card.title}` : null,
    canonicalUrl: absolutePublicUrl(`/cards/${card.id}`),
    updatedAt: PUBLIC_CONTENT_UPDATED_AT,
  };
}

export function getPublicCards(locale: PublicLocale): PublicCardDocument[] {
  return Object.values(CYKLUS_CARDS)
    .map((card) => publicCardDocument(card, locale))
    .filter((card) => card.visibility !== 'hidden')
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getPublicCard(id: string, locale: PublicLocale): PublicCardDocument | null {
  const card = CYKLUS_CARDS[id];
  if (!card) return null;
  const document = publicCardDocument(card, locale);
  return document.visibility === 'hidden' ? null : document;
}

export async function getPublicAuthor(locale: PublicLocale) {
  const filename = locale === 'en' ? 'SYNTHOMAAUTOR_en.html' : 'SYNTHOMAAUTOR.html';
  const source = await fs.readFile(path.join(process.cwd(), 'public', 'data', filename), 'utf8');
  const html = sanitizeCanonicalHtml(source);
  return {
    id: 'author',
    locale,
    title: locale === 'en' ? 'About the author' : 'O autorovi',
    canonicalUrl: absolutePublicUrl('/autor'),
    updatedAt: PUBLIC_CONTENT_UPDATED_AT,
    html,
    text: canonicalHtmlToText(source),
    markdown: canonicalHtmlToMarkdown(source),
  };
}
