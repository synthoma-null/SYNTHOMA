export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { PACKAGES } from '../../../src/content/booksManifest';
import prisma from '../../../src/lib/prisma';
import { getAccessSnapshot } from '../../../src/server/economy';
import { getManagedContentCatalog } from '../../../src/server/content/managedContent';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  let readingProgress: {
    chapterId: string;
    progressPercent: number;
    completed: boolean;
    updatedAt: Date;
  }[] = [];

  if (userId) {
    const progress = await prisma.readingProgress.findMany({
      where: { userId },
      select: { chapterId: true, progressPercent: true, completed: true, updatedAt: true },
    });
    readingProgress = progress;
  }
  const managed = await getManagedContentCatalog();
  const visibleBookIds = new Set(managed.books.filter((book) => book.visibility === 'published').map((book) => book.id));
  const managedChapters = managed.chapters.filter((item) =>
    visibleBookIds.has(item.bookId) && item.visibility === 'published',
  );
  const snapshot = await getAccessSnapshot(userId, [
    ...managedChapters.map((item) => ({ contentType: 'chapter' as const, contentId: item.chapter.id })),
    ...PACKAGES.map((item) => ({ contentType: 'package' as const, contentId: item.id })),
  ]);
  const accessByKey = new Map(snapshot.access.map((access) => [`${access.contentType}:${access.contentId}`, access]));
  const isSupporter = PACKAGES.some(
    (item) => item.supporter && accessByKey.get(`package:${item.id}`)?.canAccess,
  );

  const chapters = managedChapters.map(({ chapter: ch, bookId }) => {
    const access = accessByKey.get(`chapter:${ch.id}`);
    const progress = readingProgress.find((p) => p.chapterId === ch.id);
    return {
      id: ch.id,
      title: ch.fullTitle,
      collection: managed.books.find((book) => book.id === bookId)?.slug ?? ch.collection,
      filename: ch.filename,
      mnemCost: ch.mnemCost ?? 0,
      order: ch.order ?? 0,
      packageIds: ch.packageIds,
      teaser: typeof ch.metadata?.teaser === 'string' ? ch.metadata.teaser : undefined,
      unlocks: typeof ch.metadata?.unlocks === 'string' ? ch.metadata.unlocks : undefined,
      unlocked: access?.canAccess ?? false,
      access,
      progress: progress
        ? {
            progressPercent: progress.progressPercent,
            completed: progress.completed,
            updatedAt: progress.updatedAt,
          }
        : null,
    };
  });

  return NextResponse.json(
    {
      chapters,
      packages: PACKAGES,
      currentUser: userId
        ? { id: userId, nickname: session?.user?.name }
        : null,
      access: snapshot.access,
      mnemBalance: snapshot.balance,
      isSupporter,
    },
    {
      headers: { 'Cache-Control': 'private, no-store' },
    },
  );
}
