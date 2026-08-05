import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import type { ContentAccess } from '../../../../src/content/catalog';
import { getContentAccess } from '../../../../src/server/economy';
import { reportRuntimeDatabaseError } from '../../../../src/server/runtimeDatabase';
import {
  getManagedChapterContext,
  readManagedChapterDocument,
} from '../../../../src/server/content/managedContent';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  const { chapterId } = await params;
  let context;
  try {
    context = await getManagedChapterContext(chapterId);
  } catch (error) {
    const report = reportRuntimeDatabaseError('chapter-api-catalog', error);
    return NextResponse.json(
      { error: 'CHAPTER_CATALOG_UNAVAILABLE', message: 'Katalog kapitol je dočasně nedostupný.', correlationId: report.correlationId, retryable: true },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
  if (!context || context.managed.visibility === 'hidden' || context.book.visibility === 'hidden') {
    return NextResponse.json(
      { error: 'CHAPTER_NOT_FOUND', message: 'Fragment neexistuje.' },
      { status: 404 },
    );
  }
  const managed = context.managed;
  const chapter = managed.chapter;
  if (chapter.availability !== 'published') {
    return NextResponse.json(
      { error: 'CONTENT_UNAVAILABLE', message: 'Fragment zatím nebyl publikován.' },
      { status: 409 },
    );
  }

  const session = await auth();
  let access: ContentAccess;
  try {
    access = await getContentAccess(session?.user?.id ?? null, 'chapter', chapter.id);
  } catch (error) {
    const report = reportRuntimeDatabaseError('chapter-api-access', error);
    return NextResponse.json(
      {
        error: 'CHAPTER_ACCESS_UNAVAILABLE',
        message: 'Přístup ke známému fragmentu se teď nepodařilo ověřit.',
        correlationId: report.correlationId,
        retryable: true,
      },
      { status: 503, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }
  if (!access.canAccess) {
    return NextResponse.json(
      { error: 'CONTENT_LOCKED', message: 'Fragment je uzamčen.', access },
      { status: 403, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  const locale = req.nextUrl.searchParams.get('lang') === 'en' ? 'en' : 'cs';
  try {
    const document = await readManagedChapterDocument(managed, locale);
    return new NextResponse(document.sourceHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store',
        Vary: 'Cookie',
      },
    });
  } catch (error) {
    console.error('[chapter/file-missing]', { chapterId: chapter.id, filename: chapter.filename, error });
    return NextResponse.json(
      { error: 'CONTENT_FILE_MISSING', message: 'Publikovaný fragment nelze bezpečně načíst.' },
      { status: 500 },
    );
  }
}
