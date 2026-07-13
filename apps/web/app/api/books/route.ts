export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { CHAPTERS, PACKAGES } from '../../../src/content/booksManifest';
import prisma from '../../../src/lib/prisma';
import { getAccessSnapshot } from '../../../src/server/economy';

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
  const snapshot = await getAccessSnapshot(userId, [
    ...CHAPTERS.map((chapter) => ({ contentType: 'chapter' as const, contentId: chapter.id })),
    ...PACKAGES.map((item) => ({ contentType: 'package' as const, contentId: item.id })),
  ]);
  const accessByKey = new Map(snapshot.access.map((access) => [`${access.contentType}:${access.contentId}`, access]));
  const isSupporter = PACKAGES.some(
    (item) => item.supporter && accessByKey.get(`package:${item.id}`)?.canAccess,
  );

  const chapters = CHAPTERS.map((ch) => {
    const access = accessByKey.get(`chapter:${ch.id}`);
    const progress = readingProgress.find((p) => p.chapterId === ch.id);
    return {
      ...ch,
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
