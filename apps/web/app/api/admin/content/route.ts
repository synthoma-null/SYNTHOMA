export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../auth';
import {
  getBookCollection,
  getChapterCatalogEntry,
} from '../../../../src/content/catalog';
import prisma from '../../../../src/lib/prisma';
import { readChapterDocument } from '../../../../src/server/chapters/chapterDocument';
import {
  getManagedChapter,
  getManagedContentCatalog,
  readManagedChapterDocument,
  staticBookExists,
  staticChapterExists,
} from '../../../../src/server/content/managedContent';
import { sanitizeCanonicalHtml } from '../../../../src/server/public-ai/htmlContent';

const idSchema = z.string().trim().min(2).max(100).regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'ID smí obsahovat jen malá písmena, čísla a pomlčky.',
);
const visibilitySchema = z.enum(['published', 'hidden']);
const accessSchema = z.enum(['inherit', 'free', 'entitlement']);

const bookFields = z.object({
  title: z.string().trim().min(1).max(180).optional(),
  shortTitle: z.string().trim().max(100).optional(),
  description: z.string().trim().max(6000).optional(),
  cover: z.string().trim().max(500).optional(),
  language: z.enum(['cs']).optional(),
  sortOrder: z.number().int().min(-1000).max(1000).optional(),
  status: z.enum(['complete', 'ongoing']).optional(),
  visibility: visibilitySchema.optional(),
  accessPolicy: accessSchema.optional(),
});

const chapterFields = z.object({
  bookId: idSchema.optional(),
  title: z.string().trim().min(1).max(220).optional(),
  titleEn: z.string().trim().max(220).optional(),
  ordinal: z.string().trim().max(20).optional(),
  summary: z.string().trim().max(6000).optional(),
  sortOrder: z.number().int().min(-1000).max(10000).optional(),
  visibility: visibilitySchema.optional(),
  accessPolicy: accessSchema.optional(),
  mnemCost: z.number().int().min(1).max(100000).nullable().optional(),
  bodyHtml: z.string().max(1_000_000).optional(),
  bodyHtmlEn: z.string().max(1_000_000).optional(),
});

const createBookSchema = bookFields.extend({
  entity: z.literal('book'),
  id: idSchema,
  title: z.string().trim().min(1).max(180),
});
const createChapterSchema = chapterFields.extend({
  entity: z.literal('chapter'),
  id: idSchema,
  bookId: idSchema,
  title: z.string().trim().min(1).max(220),
  bodyHtml: z.string().min(1).max(1_000_000),
});
const createSchema = z.discriminatedUnion('entity', [createBookSchema, createChapterSchema]);
const updateSchema = z.discriminatedUnion('entity', [
  bookFields.extend({ entity: z.literal('book'), id: idSchema }),
  chapterFields.extend({ entity: z.literal('chapter'), id: idSchema }),
]);

async function requireAdmin(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  return user?.role === 'admin' ? session.user.id : null;
}

function cleanOptional(value: string): string | null;
function cleanOptional(value: undefined): undefined;
function cleanOptional(value: string | undefined): string | null | undefined;
function cleanOptional(value: string | undefined): string | null | undefined {
  if (value === undefined) return undefined;
  return value.trim() || null;
}

function sanitizedBody(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const clean = sanitizeCanonicalHtml(value);
  if (!clean) throw new Error('EMPTY_CHAPTER_BODY');
  return clean;
}

async function contentSnapshot() {
  const catalog = await getManagedContentCatalog();
  return {
    books: catalog.books.map((book) => ({
      id: book.id,
      slug: book.slug,
      title: book.title,
      shortTitle: book.shortTitle,
      description: book.description,
      cover: book.cover ?? null,
      language: book.language,
      sortOrder: book.order,
      status: book.status,
      visibility: book.visibility,
      accessPolicy: book.accessPolicy,
      isCustom: book.isCustom,
      overridden: book.overridden,
      updatedAt: book.updatedAt?.toISOString() ?? null,
      chapters: catalog.chapters
        .filter((chapter) => chapter.bookId === book.id)
        .map((item) => ({
          id: item.chapter.id,
          title: item.chapter.fullTitle,
          titleEn: item.chapter.titleEn ?? null,
          ordinal: item.chapter.ordinal,
          summary: item.chapter.summary ?? '',
          sortOrder: item.chapter.order ?? 0,
          visibility: item.visibility,
          accessPolicy: item.accessPolicy,
          effectiveAccessPolicy: item.chapter.accessPolicy,
          mnemCost: item.chapter.mnemCost,
          isCustom: item.isCustom,
          overridden: item.overridden,
          hasBodyOverride: Boolean(item.bodyHtml),
          updatedAt: item.updatedAt?.toISOString() ?? null,
        })),
    })),
  };
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const chapterId = req.nextUrl.searchParams.get('chapterId')?.trim();
  if (!chapterId) return NextResponse.json(await contentSnapshot());

  const managed = await getManagedChapter(chapterId);
  if (!managed) return NextResponse.json({ error: 'Kapitola nebyla nalezena.' }, { status: 404 });
  let bodyHtml = managed.bodyHtml;
  let bodyHtmlEn = managed.bodyHtmlEn;
  if (!bodyHtml && !managed.isCustom) {
    const base = getChapterCatalogEntry(managed.chapter.id);
    if (base?.availability === 'published') {
      bodyHtml = (await readChapterDocument(base, 'cs')).bodyHtml;
      if (base.filenameEn) bodyHtmlEn = (await readChapterDocument(base, 'en')).bodyHtml;
    }
  } else if (bodyHtml) {
    bodyHtml = (await readManagedChapterDocument(managed, 'cs')).bodyHtml;
  }
  return NextResponse.json({
    id: managed.chapter.id,
    bookId: managed.bookId,
    title: managed.chapter.fullTitle,
    titleEn: managed.chapter.titleEn ?? '',
    ordinal: managed.chapter.ordinal,
    summary: managed.chapter.summary ?? '',
    sortOrder: managed.chapter.order ?? 0,
    visibility: managed.visibility,
    accessPolicy: managed.accessPolicy,
    effectiveAccessPolicy: managed.chapter.accessPolicy,
    mnemCost: managed.chapter.mnemCost,
    bodyHtml: bodyHtml ?? '',
    bodyHtmlEn: bodyHtmlEn ?? '',
    isCustom: managed.isCustom,
  });
}

export async function POST(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Neplatná data obsahu.' }, { status: 400 });
  }
  const data = parsed.data;
  if (data.entity === 'book') {
    if (staticBookExists(data.id) || await prisma.managedBook.findUnique({ where: { id: data.id }, select: { id: true } })) {
      return NextResponse.json({ error: 'Kniha s tímto ID už existuje.' }, { status: 409 });
    }
    await prisma.$transaction(async (tx) => {
      await tx.managedBook.create({
        data: {
          id: data.id,
          isCustom: true,
          title: data.title,
          shortTitle: cleanOptional(data.shortTitle) ?? null,
          description: cleanOptional(data.description) ?? null,
          cover: cleanOptional(data.cover) ?? null,
          language: data.language ?? 'cs',
          sortOrder: data.sortOrder ?? 100,
          status: data.status ?? 'ongoing',
          visibility: data.visibility ?? 'published',
          accessPolicy: data.accessPolicy === 'inherit' ? 'free' : data.accessPolicy ?? 'free',
          createdById: adminId,
          updatedById: adminId,
        },
      });
      await tx.adminAuditLog.create({ data: { actorUserId: adminId, targetUserId: adminId, action: 'content_book_created', metadata: { bookId: data.id } } });
    });
  } else {
    if (staticChapterExists(data.id) || await prisma.managedChapter.findUnique({ where: { id: data.id }, select: { id: true } })) {
      return NextResponse.json({ error: 'Kapitola s tímto ID už existuje.' }, { status: 409 });
    }
    const catalog = await getManagedContentCatalog();
    if (!catalog.books.some((book) => book.id === data.bookId)) {
      return NextResponse.json({ error: 'Cílová kniha neexistuje.' }, { status: 400 });
    }
    let bodyHtml: string;
    try { bodyHtml = sanitizedBody(data.bodyHtml) as string; } catch {
      return NextResponse.json({ error: 'Kapitola musí obsahovat bezpečný HTML obsah.' }, { status: 400 });
    }
    await prisma.$transaction(async (tx) => {
      await tx.managedChapter.create({
        data: {
          id: data.id,
          bookId: data.bookId,
          isCustom: true,
          title: data.title,
          titleEn: cleanOptional(data.titleEn) ?? null,
          ordinal: cleanOptional(data.ordinal) ?? null,
          summary: cleanOptional(data.summary) ?? null,
          sortOrder: data.sortOrder ?? 0,
          visibility: data.visibility ?? 'published',
          accessPolicy: data.accessPolicy === 'inherit' ? 'free' : data.accessPolicy ?? 'free',
          mnemCost: data.accessPolicy === 'entitlement' ? data.mnemCost ?? 64 : null,
          bodyHtml,
          bodyHtmlEn: sanitizedBody(data.bodyHtmlEn) ?? null,
          createdById: adminId,
          updatedById: adminId,
        },
      });
      await tx.adminAuditLog.create({ data: { actorUserId: adminId, targetUserId: adminId, action: 'content_chapter_created', metadata: { chapterId: data.id, bookId: data.bookId } } });
    });
  }
  return NextResponse.json(await contentSnapshot(), { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const adminId = await requireAdmin();
  if (!adminId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Neplatná data obsahu.' }, { status: 400 });
  }
  const data = parsed.data;
  if (data.entity === 'book') {
    const existing = await prisma.managedBook.findUnique({ where: { id: data.id } });
    const baseExists = staticBookExists(data.id);
    if (!existing && !baseExists) return NextResponse.json({ error: 'Kniha nebyla nalezena.' }, { status: 404 });
    await prisma.$transaction(async (tx) => {
      await tx.managedBook.upsert({
        where: { id: data.id },
        create: {
          id: data.id,
          isCustom: false,
          title: cleanOptional(data.title) ?? null, shortTitle: cleanOptional(data.shortTitle) ?? null,
          description: cleanOptional(data.description) ?? null, cover: cleanOptional(data.cover) ?? null,
          language: data.language ?? null, sortOrder: data.sortOrder ?? null, status: data.status ?? null,
          visibility: data.visibility ?? 'published', accessPolicy: data.accessPolicy ?? 'inherit',
          createdById: adminId, updatedById: adminId,
        },
        update: {
          ...(data.title !== undefined ? { title: cleanOptional(data.title) } : {}),
          ...(data.shortTitle !== undefined ? { shortTitle: cleanOptional(data.shortTitle) } : {}),
          ...(data.description !== undefined ? { description: cleanOptional(data.description) } : {}),
          ...(data.cover !== undefined ? { cover: cleanOptional(data.cover) } : {}),
          ...(data.language !== undefined ? { language: data.language } : {}),
          ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
          ...(data.status !== undefined ? { status: data.status } : {}),
          ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
          ...(data.accessPolicy !== undefined ? { accessPolicy: data.accessPolicy } : {}),
          updatedById: adminId,
        },
      });
      await tx.adminAuditLog.create({ data: { actorUserId: adminId, targetUserId: adminId, action: 'content_book_updated', metadata: { bookId: data.id, fields: Object.keys(data).filter((key) => !['entity', 'id'].includes(key)) } } });
    });
  } else {
    const existing = await prisma.managedChapter.findUnique({ where: { id: data.id } });
    const base = getChapterCatalogEntry(data.id);
    if (!existing && !base) return NextResponse.json({ error: 'Kapitola nebyla nalezena.' }, { status: 404 });
    const bookId = data.bookId ?? existing?.bookId ?? (base ? getBookCollection(base.collection)?.publicId : undefined);
    if (!bookId) return NextResponse.json({ error: 'Kapitola nemá platnou knihu.' }, { status: 400 });
    if (data.bookId) {
      const catalog = await getManagedContentCatalog();
      if (!catalog.books.some((book) => book.id === data.bookId)) return NextResponse.json({ error: 'Cílová kniha neexistuje.' }, { status: 400 });
    }
    let bodyHtml: string | undefined;
    let bodyHtmlEn: string | undefined;
    try {
      bodyHtml = sanitizedBody(data.bodyHtml);
      bodyHtmlEn = sanitizedBody(data.bodyHtmlEn);
    } catch {
      return NextResponse.json({ error: 'HTML kapitoly nesmí být prázdné ani obsahovat pouze zakázané prvky.' }, { status: 400 });
    }
    await prisma.$transaction(async (tx) => {
      await tx.managedChapter.upsert({
        where: { id: data.id },
        create: {
          id: data.id, bookId, isCustom: false,
          title: cleanOptional(data.title) ?? null, titleEn: cleanOptional(data.titleEn) ?? null,
          ordinal: cleanOptional(data.ordinal) ?? null, summary: cleanOptional(data.summary) ?? null,
          sortOrder: data.sortOrder ?? null, visibility: data.visibility ?? 'published',
          accessPolicy: data.accessPolicy ?? 'inherit', mnemCost: data.mnemCost ?? null,
          bodyHtml: bodyHtml ?? null, bodyHtmlEn: bodyHtmlEn ?? null, createdById: adminId, updatedById: adminId,
        },
        update: {
          ...(data.bookId !== undefined ? { bookId: data.bookId } : {}),
          ...(data.title !== undefined ? { title: cleanOptional(data.title) } : {}),
          ...(data.titleEn !== undefined ? { titleEn: cleanOptional(data.titleEn) } : {}),
          ...(data.ordinal !== undefined ? { ordinal: cleanOptional(data.ordinal) } : {}),
          ...(data.summary !== undefined ? { summary: cleanOptional(data.summary) } : {}),
          ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
          ...(data.visibility !== undefined ? { visibility: data.visibility } : {}),
          ...(data.accessPolicy !== undefined ? { accessPolicy: data.accessPolicy } : {}),
          ...(data.mnemCost !== undefined ? { mnemCost: data.mnemCost } : {}),
          ...(bodyHtml !== undefined ? { bodyHtml } : {}),
          ...(bodyHtmlEn !== undefined ? { bodyHtmlEn } : {}),
          updatedById: adminId,
        },
      });
      await tx.adminAuditLog.create({ data: { actorUserId: adminId, targetUserId: adminId, action: 'content_chapter_updated', metadata: { chapterId: data.id, fields: Object.keys(data).filter((key) => !['entity', 'id', 'bodyHtml', 'bodyHtmlEn'].includes(key)), bodyChanged: data.bodyHtml !== undefined || data.bodyHtmlEn !== undefined } } });
    });
  }
  return NextResponse.json(await contentSnapshot());
}
