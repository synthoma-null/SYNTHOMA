import archiveCardsCs from '../../public/data/archiveCards.json';
import archiveCardsEn from '../../public/data/archiveCards_en.json';
import publicBooksManifest from '../../public/books/manifest.json';
import { UI_THEMES } from '../lib/themes';
import {
  ARTIFACTS,
  CHAPTERS,
  COSMETICS,
  FRAGMENTS,
  PACKAGES,
  PROFILE_REPORTS,
} from './booksManifest';

export const CONTENT_TYPES = [
  'chapter',
  'package',
  'fragment',
  'artifact',
  'archive_record',
  'cosmetic',
  'profile_report',
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
export type ContentAvailability = 'published' | 'unavailable';
export type CatalogAccessPolicy =
  | 'free'
  | 'entitlement'
  | 'progress'
  | 'progress_or_entitlement';

export type AccessState = 'free' | 'owned' | 'locked' | 'unavailable';

export type AccessReason =
  | 'catalog_free'
  | 'direct_entitlement'
  | 'package_entitlement'
  | 'progress_prerequisite'
  | 'admin_override'
  | 'authentication_required'
  | 'purchase_required'
  | 'prerequisite_required'
  | 'not_published'
  | 'catalog_error';

export interface ContentAccess {
  contentType: ContentType;
  contentId: string;
  state: AccessState;
  reason: AccessReason;
  canAccess: boolean;
  canPurchase: boolean;
  mnemCost: number | null;
  title: string;
  purchasePackageIds: string[];
  prerequisiteChapterId: string | null;
}

export interface CatalogEntry {
  id: string;
  type: ContentType;
  title: string;
  titleEn?: string;
  description?: string;
  availability: ContentAvailability;
  accessPolicy: CatalogAccessPolicy;
  mnemCost: number | null;
  packageIds: string[];
  aliases: string[];
  order?: number;
  route?: string;
  sourcePath?: string;
  prerequisiteChapterId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface ChapterCatalogEntry extends CatalogEntry {
  type: 'chapter';
  collection: string;
  filename: string;
  filenameEn?: string;
  publicPath: string;
  route: string;
  track?: string;
  backgroundVideo?: string;
  summary?: string;
  status: 'final' | 'draft';
}

type PublicChapter = {
  id: string;
  title: string;
  path: string;
  free?: boolean;
  track?: string;
  backgroundVideo?: string;
  chapterOrder: number;
  summary?: string;
  status?: string;
};

type ArchiveCard = {
  id: string;
  title: string;
  teaser?: string;
  order?: number;
  access?: {
    mode?: 'free' | 'chapter' | 'mnems' | 'chapter_or_mnems';
    requiredChapterId?: string | null;
    mnemCost?: number;
    visibility?: string;
  };
};

const publicCollection = publicBooksManifest.collections[0];
const publicChapters = (publicCollection?.chapters ?? []) as PublicChapter[];
const publicChapterById = new Map(publicChapters.map((chapter) => [chapter.id, chapter]));

const CHAPTER_REFERENCE_ALIASES: Record<string, string> = {
  restart: '0-inf-restart',
  '0-inf': '0-inf-restart',
  null: '0-0-null',
  start: '0-1-start',
  run: '0-2-run',
  discontinuum: '0-3-discontinuum',
  defragmentation: '0-4-defragmentation',
  pause: '0-5-pause',
  searching: '0-6-searching',
  ruins: '0-7-ruins',
  reziduum: '0-8-reziduum',
  sector: '0-9-sector',
  rest: '0-10-rest',
  orgie: '0-11-orgie',
  '0-11-orgie-1': '0-11-orgie',
};

const DRAFT_CHAPTERS: Array<{
  id: string;
  title: string;
  order: number;
}> = [
  { id: '0-12-conflict', title: '0-12 [CONFLICT]', order: 13 },
  { id: '0-13-lust', title: '0-13 [LUST]', order: 14 },
  { id: '0-14-absence', title: '0-14 [ABSENCE]', order: 15 },
  { id: '0-15-rebirth', title: '0-15 [REBIRTH]', order: 16 },
  { id: '0-16-illusion', title: '0-16 [ILLUSION]', order: 17 },
  { id: '0-17-disconnect', title: '0-17 [DISCONNECT]', order: 18 },
  { id: '0-18-awakening', title: '0-18 [AWAKENING]', order: 19 },
  { id: '0-19-echo', title: '0-19 [ECHO]', order: 20 },
  { id: '0-20-genesis', title: '0-20 [GENESIS]', order: 21 },
];

function optional<T>(value: T | undefined): T | undefined {
  return value;
}

function publishedChapterEntry(chapter: (typeof CHAPTERS)[number]): ChapterCatalogEntry {
  const presentation = publicChapterById.get(chapter.id);
  const aliases = Object.entries(CHAPTER_REFERENCE_ALIASES)
    .filter(([, target]) => target === chapter.id)
    .map(([alias]) => alias);

  return {
    id: chapter.id,
    type: 'chapter',
    title: chapter.title,
    collection: chapter.collection,
    filename: chapter.filename,
    ...(chapter.filename_en ? { filenameEn: chapter.filename_en } : {}),
    publicPath: presentation?.path ?? `/books/${chapter.collection}/${chapter.filename}`,
    availability: 'published',
    accessPolicy: chapter.access === 'free' ? 'free' : 'entitlement',
    mnemCost: chapter.access === 'free' ? 0 : chapter.mnemCost,
    packageIds: chapter.packageIds,
    aliases,
    order: chapter.order,
    route: `/chapter/${chapter.id}`,
    sourcePath:
      chapter.access === 'free'
        ? `public/books/${chapter.collection}/${chapter.filename}`
        : `src/content/protected/${chapter.collection}/${chapter.filename}`,
    ...(presentation?.track ? { track: presentation.track } : {}),
    ...(presentation?.backgroundVideo ? { backgroundVideo: presentation.backgroundVideo } : {}),
    ...(presentation?.summary ? { summary: presentation.summary } : {}),
    status: 'final',
    metadata: {
      estimatedMinutes: chapter.estimatedMinutes ?? null,
      teaser: chapter.teaser ?? null,
      unlocks: chapter.unlocks ?? null,
    },
  };
}

function draftChapterEntry(chapter: (typeof DRAFT_CHAPTERS)[number]): ChapterCatalogEntry {
  const presentation = publicChapterById.get(chapter.id);
  const filename = decodeURIComponent(presentation?.path.split('/').pop() ?? `${chapter.title}.html`);

  return {
    id: chapter.id,
    type: 'chapter',
    title: chapter.title,
    collection: publicCollection?.slug ?? 'SYNTHOMA-NULL',
    filename,
    publicPath: presentation?.path ?? `/books/SYNTHOMA-NULL/${filename}`,
    availability: 'unavailable',
    accessPolicy: 'entitlement',
    mnemCost: null,
    packageIds: [],
    aliases: [],
    order: chapter.order,
    route: `/chapter/${chapter.id}`,
    ...(presentation?.summary ? { summary: presentation.summary } : {}),
    ...(presentation?.backgroundVideo ? { backgroundVideo: presentation.backgroundVideo } : {}),
    status: 'draft',
  };
}

export const CHAPTER_CATALOG: readonly ChapterCatalogEntry[] = [
  ...CHAPTERS.map(publishedChapterEntry),
  ...DRAFT_CHAPTERS.map(draftChapterEntry),
].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const packageEntries: CatalogEntry[] = PACKAGES.map((item) => ({
  id: item.id,
  type: 'package',
  title: item.name,
  ...(item.name_en ? { titleEn: item.name_en } : {}),
  description: item.description,
  availability: 'published',
  accessPolicy: 'entitlement',
  mnemCost: null,
  packageIds: [],
  aliases: [],
  route: '/pricing',
  metadata: {
    grantedMnems: item.mnems,
    priceCzk: item.priceCzk,
    priceUsd: item.priceUsd,
    supporter: item.supporter,
    subscription: item.isSubscription ?? false,
  },
}));

const fragmentEntries: CatalogEntry[] = FRAGMENTS.map((item) => ({
  id: item.id,
  type: 'fragment',
  title: item.title,
  description: item.description,
  availability: 'published',
  accessPolicy: item.accessLevel === 'free' ? 'free' : 'entitlement',
  mnemCost: item.accessLevel === 'mnem' ? item.cost : 0,
  packageIds: [],
  aliases: [],
  route: '/fragments',
  ...(item.requiredChapterId ? { prerequisiteChapterId: item.requiredChapterId } : {}),
}));

const artifactEntries: CatalogEntry[] = ARTIFACTS.map((item) => ({
  id: item.id,
  type: 'artifact',
  title: item.name,
  description: item.description,
  availability: 'published',
  accessPolicy: item.purchasable ? 'entitlement' : item.condition ? 'progress' : 'free',
  mnemCost: item.purchasable ? item.cost : 0,
  packageIds: [],
  aliases: [],
  route: '/profile',
  metadata: { condition: item.condition ?? null, purchasable: item.purchasable },
}));

const cosmeticProducts = [
  ...UI_THEMES.map((item) => ({
    id: item.id,
    title: item.label,
    description: item.description,
    cost: item.cost,
  })),
  ...COSMETICS.filter((item) => !UI_THEMES.some((theme) => theme.id === item.id)).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    cost: item.cost,
  })),
];

const cosmeticEntries: CatalogEntry[] = cosmeticProducts.map((item) => ({
  id: item.id,
  type: 'cosmetic',
  title: item.title,
  description: item.description,
  availability: 'published',
  accessPolicy: item.cost === 0 ? 'free' : 'entitlement',
  mnemCost: item.cost,
  packageIds: [],
  aliases: [],
  route: '/profile',
}));

const profileReportEntries: CatalogEntry[] = PROFILE_REPORTS.map((item) => ({
  id: item.id,
  type: 'profile_report',
  title: item.title,
  description: item.description,
  availability: 'published',
  accessPolicy: item.accessLevel === 'free' ? 'free' : 'entitlement',
  mnemCost: item.accessLevel === 'mnem' ? item.cost : 0,
  packageIds: [],
  aliases: [],
  route: '/profile',
}));

const archiveCardsCsById = new Map(
  ((archiveCardsCs as { cards: ArchiveCard[] }).cards ?? []).map((card) => [card.id, card]),
);

function normalizeArchivePrerequisite(reference: string | null | undefined): string | undefined {
  if (!reference) return undefined;
  return CHAPTER_REFERENCE_ALIASES[reference] ?? reference;
}

const archiveEntries: CatalogEntry[] = (
  (archiveCardsEn as { cards: ArchiveCard[] }).cards ?? []
).map((englishCard) => {
  const card = archiveCardsCsById.get(englishCard.id) ?? englishCard;
  const mode = card.access?.mode ?? 'free';
  const prerequisiteChapterId = normalizeArchivePrerequisite(card.access?.requiredChapterId);
  const mnemCost = card.access?.mnemCost ?? 0;

  return {
    id: card.id,
    type: 'archive_record',
    title: card.title,
    titleEn: englishCard.title,
    ...(card.teaser ? { description: card.teaser } : {}),
    availability: 'published',
    accessPolicy:
      mode === 'free'
        ? 'free'
        : mode === 'chapter'
          ? 'progress'
          : mode === 'chapter_or_mnems'
            ? 'progress_or_entitlement'
            : 'entitlement',
    mnemCost: mode === 'mnems' || mode === 'chapter_or_mnems' ? mnemCost : 0,
    packageIds: [],
    aliases: [],
    ...(card.order !== undefined ? { order: card.order } : {}),
    route: `/archive#${card.id}`,
    ...(prerequisiteChapterId ? { prerequisiteChapterId } : {}),
    metadata: { visibility: card.access?.visibility ?? 'full' },
  };
});

export const CONTENT_CATALOG: readonly CatalogEntry[] = [
  ...CHAPTER_CATALOG,
  ...packageEntries,
  ...fragmentEntries,
  ...artifactEntries,
  ...archiveEntries,
  ...cosmeticEntries,
  ...profileReportEntries,
];

const catalogByKey = new Map(CONTENT_CATALOG.map((entry) => [`${entry.type}:${entry.id}`, entry]));
const chapterAliasMap = new Map<string, string>();

for (const chapter of CHAPTER_CATALOG) {
  const references = [
    chapter.id,
    chapter.filename,
    chapter.publicPath,
    chapter.route,
    ...(chapter.filenameEn ? [chapter.filenameEn] : []),
    ...chapter.aliases,
  ];
  for (const reference of references) {
    chapterAliasMap.set(normalizeReference(reference), chapter.id);
  }
}

function normalizeReference(reference: string): string {
  let value = reference.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    // A malformed external URL is simply not a catalog reference.
  }
  return value.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
}

export function getCatalogEntry(
  contentType: ContentType,
  contentId: string,
): CatalogEntry | undefined {
  const canonicalId = contentType === 'chapter' ? resolveChapterId(contentId) : contentId;
  if (!canonicalId) return undefined;
  return catalogByKey.get(`${contentType}:${canonicalId}`);
}

export function resolveChapterId(reference: string): string | undefined {
  const normalized = normalizeReference(reference);
  const direct = chapterAliasMap.get(normalized);
  if (direct) return direct;

  const filename = normalized.split('/').pop();
  return filename ? chapterAliasMap.get(filename) : undefined;
}

export function getChapterCatalogEntry(reference: string): ChapterCatalogEntry | undefined {
  const id = resolveChapterId(reference);
  if (!id) return undefined;
  return catalogByKey.get(`chapter:${id}`) as ChapterCatalogEntry | undefined;
}

export function getNextChapter(reference: string): ChapterCatalogEntry | undefined {
  const id = resolveChapterId(reference);
  if (!id) return undefined;
  const index = CHAPTER_CATALOG.findIndex((chapter) => chapter.id === id);
  return index >= 0 ? optional(CHAPTER_CATALOG[index + 1]) : undefined;
}

export function getPackageChapterIds(packageId: string): readonly string[] {
  return PACKAGES.find((item) => item.id === packageId)?.chapterIds ?? [];
}

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as readonly string[]).includes(value);
}
