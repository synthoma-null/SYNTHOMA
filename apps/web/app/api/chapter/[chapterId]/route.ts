import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { auth } from '../../../../auth';
import { getChapterCatalogEntry, type ContentAccess } from '../../../../src/content/catalog';
import { getContentAccess } from '../../../../src/server/economy';
import { reportRuntimeDatabaseError } from '../../../../src/server/runtimeDatabase';

const FREE_DIR = path.join(process.cwd(), 'public', 'books', 'SYNTHOMA-NULL');
const PROTECTED_DIR = path.join(process.cwd(), 'src', 'content', 'protected', 'SYNTHOMA-NULL');

function safeFilename(filename: string): string | null {
  const base = path.basename(filename);
  if (base !== filename || base.includes('..') || base.includes('/') || base.includes('\\')) return null;
  return base;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  const { chapterId } = await params;
  const chapter = getChapterCatalogEntry(chapterId);
  if (!chapter) {
    return NextResponse.json(
      { error: 'CHAPTER_NOT_FOUND', message: 'Fragment neexistuje.' },
      { status: 404 },
    );
  }
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

  const lang = req.nextUrl.searchParams.get('lang');
  const rawFilename = lang === 'en' && chapter.filenameEn ? chapter.filenameEn : chapter.filename;
  const safeFile = safeFilename(rawFilename);
  if (!safeFile) {
    return NextResponse.json({ error: 'INVALID_PATH' }, { status: 500 });
  }

  const dir = chapter.accessPolicy === 'free' ? FREE_DIR : PROTECTED_DIR;
  try {
    const html = await readFile(path.join(dir, safeFile), 'utf-8');
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store',
        Vary: 'Cookie',
      },
    });
  } catch (error) {
    console.error('[chapter/file-missing]', { chapterId: chapter.id, filename: safeFile, error });
    return NextResponse.json(
      { error: 'CONTENT_FILE_MISSING', message: 'Publikovaný fragment nelze bezpečně načíst.' },
      { status: 500 },
    );
  }
}
