export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import {
  CHAPTER_CATALOG,
  getChapterCatalogEntry,
  type ChapterCatalogEntry,
} from '../../../../../../src/content/catalog';
import { getAccessSnapshot } from '../../../../../../src/server/economy';
import { reportRuntimeDatabaseError } from '../../../../../../src/server/runtimeDatabase';

function publicChapter(chapter: ChapterCatalogEntry | undefined) {
  if (!chapter) return null;
  return {
    id: chapter.id,
    title: chapter.title,
    route: chapter.route,
    order: chapter.order,
    availability: chapter.availability,
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ chapterId: string }> },
) {
  const { chapterId } = await params;
  const current = getChapterCatalogEntry(chapterId);
  if (!current) {
    return NextResponse.json({ error: 'CHAPTER_NOT_FOUND' }, { status: 404 });
  }
  const collectionChapters = CHAPTER_CATALOG.filter((chapter) => chapter.collection === current.collection);
  const index = collectionChapters.findIndex((chapter) => chapter.id === current.id);
  const previous = index > 0 ? collectionChapters[index - 1] : undefined;
  const next = index >= 0 ? collectionChapters[index + 1] : undefined;
  const session = await auth();
  const adjacent = [previous, next].filter((chapter): chapter is ChapterCatalogEntry => Boolean(chapter));
  let snapshot = null;
  try {
    snapshot = adjacent.length
      ? await getAccessSnapshot(
          session?.user?.id ?? null,
          adjacent.map((chapter) => ({ contentType: 'chapter', contentId: chapter.id })),
        )
      : null;
  } catch (error) {
    const report = reportRuntimeDatabaseError('chapter-navigation', error);
    return NextResponse.json({
      error: 'CHAPTER_NAVIGATION_UNAVAILABLE',
      correlationId: report.correlationId,
      retryable: true,
    }, { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
  const accessById = new Map(snapshot?.access.map((access) => [access.contentId, access]) ?? []);
  return NextResponse.json({
    current: publicChapter(current),
    previous: previous ? { ...publicChapter(previous), access: accessById.get(previous.id) } : null,
    next: next ? { ...publicChapter(next), access: accessById.get(next.id) } : null,
    version: snapshot?.version ?? null,
  }, { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
}
