import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { auth } from '../../../../auth';
import { canReadChapter } from '../../../../src/lib/access';
import { getChapterById } from '../../../../src/content/booksManifest';

const FREE_DIR = path.join(process.cwd(), 'public', 'books', 'SYNTHOMA-NULL');
const PROTECTED_DIR = path.join(process.cwd(), 'src', 'content', 'protected', 'SYNTHOMA-NULL');

function safeFilename(filename: string): string | null {
  const base = path.basename(filename);
  if (base !== filename) return null;
  if (base.includes('..') || base.includes('/') || base.includes('\\')) return null;
  return base;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  const { chapterId } = await params;
  const chapter = getChapterById(chapterId);

  if (!chapter) {
    return NextResponse.json(
      { error: 'CHAPTER_NOT_FOUND', message: 'Fragment neexistuje.' },
      { status: 404 },
    );
  }

  const safeFile = safeFilename(chapter.filename);
  if (!safeFile) {
    return NextResponse.json({ error: 'INVALID_PATH' }, { status: 400 });
  }

  if (chapter.access === 'paid') {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: 'ACCESS_DENIED', message: 'Nedostatek mnemů. Paměťový fragment zůstává uzamčen.' },
        { status: 402 },
      );
    }
    const allowed = await canReadChapter(userId, chapterId);
    if (!allowed) {
      return NextResponse.json(
        { error: 'ACCESS_DENIED', message: 'Nedostatek mnemů. Paměťový fragment zůstává uzamčen.' },
        { status: 402 },
      );
    }
  }

  const dir = chapter.access === 'free' ? FREE_DIR : PROTECTED_DIR;
  const filePath = path.join(dir, safeFile);

  try {
    const html = await readFile(filePath, 'utf-8');
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'CHAPTER_NOT_FOUND', message: 'Fragment nenalezen na disku.' },
      { status: 404 },
    );
  }
}
