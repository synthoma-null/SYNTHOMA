export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { auth } from '../../../auth';
import { CHAPTERS, PACKAGES } from '../../../src/content/booksManifest';
import { getUserEntitlements } from '../../../src/lib/access';
import prisma from '../../../src/lib/prisma';

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  let entitlements: { chapterId: string | null; packageId: string | null }[] = [];
  let readingProgress: {
    chapterId: string;
    progressPercent: number;
    completed: boolean;
    updatedAt: Date;
  }[] = [];

  if (userId) {
    const raw = await getUserEntitlements(userId);
    entitlements = raw.map((e: { chapterId: string | null; packageId: string | null }) => ({ chapterId: e.chapterId, packageId: e.packageId }));

    const progress = await prisma.readingProgress.findMany({
      where: { userId },
      select: { chapterId: true, progressPercent: true, completed: true, updatedAt: true },
    });
    readingProgress = progress;
  }

  const ownedPackageIds = new Set(entitlements.flatMap((e) => (e.packageId ? [e.packageId] : [])));
  const ownedChapterIds = new Set(entitlements.flatMap((e) => (e.chapterId ? [e.chapterId] : [])));

  const isSupporter = [...ownedPackageIds].some((pid) => {
    const pkg = PACKAGES.find((p) => p.id === pid);
    return pkg?.supporter ?? false;
  });

  const chapters = CHAPTERS.map((ch) => {
    const unlocked =
      ch.access === 'free' ||
      isSupporter ||
      ownedChapterIds.has(ch.id) ||
      [...ownedPackageIds].some((pid) => {
        const pkg = PACKAGES.find((p) => p.id === pid);
        return pkg?.chapterIds.includes(ch.id) ?? false;
      });
    const progress = readingProgress.find((p) => p.chapterId === ch.id);
    return {
      ...ch,
      unlocked,
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
      entitlements,
      isSupporter,
    },
    {
      headers: { 'Cache-Control': 'private, no-store' },
    },
  );
}
