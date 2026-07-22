import { NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { SUBJECT_ACHIEVEMENTS } from '../../../../src/content/booksManifest';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  const [earned, progress, choices] = await Promise.all([
    prisma.subjectBadge.findMany({ where: { userId }, select: { badgeId: true, earnedAt: true } }),
    prisma.readingProgress.findMany({ where: { userId, completed: true }, select: { chapterId: true } }),
    prisma.choiceEvent.findMany({ where: { userId }, select: { tags: true, choiceId: true } }),
  ]);

  const earnedIds = new Set(earned.map((b: { badgeId: string }) => b.badgeId));
  const completedChapters = new Set(progress.map((p: { chapterId: string }) => p.chapterId));
  const shadowChoices = choices.filter((c: { tags: unknown }) => {
    const tags = c.tags as Record<string, unknown> | null;
    return tags?.shadow === true || tags?.shadow === 1;
  }).length;

  const newlyEarned: string[] = [];

  for (const ach of SUBJECT_ACHIEVEMENTS) {
    if (earnedIds.has(ach.id) || ach.purchasable) continue;

    const parts = ach.condition.split(':');
    const type = parts[0];
    const value = parts[1] ?? '';
    let isNowEarned = false;

    if (type === 'chapter') isNowEarned = completedChapters.has(value);
    else if (type === 'shadow_choices') isNowEarned = shadowChoices >= parseInt(value, 10);

    if (isNowEarned) {
      await prisma.subjectBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: ach.id } },
        create: { userId, badgeId: ach.id, source: 'behavior' },
        update: {},
      });
      newlyEarned.push(ach.id);
    }
  }

  const allBadges = await prisma.subjectBadge.findMany({
    where: { userId },
    select: { badgeId: true, earnedAt: true },
  });

  return NextResponse.json({
    badges: allBadges,
    newlyEarned,
    definitions: SUBJECT_ACHIEVEMENTS,
  });
}
