import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../auth';
import prisma from '../../../src/lib/prisma';
import { FRAGMENTS, COSMETICS, PROFILE_REPORTS } from '../../../src/content/booksManifest';

export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const entity = searchParams.get('entity');
  const chapterId = searchParams.get('chapterId');

  let products = [...FRAGMENTS, ...PROFILE_REPORTS];

  if (category) products = products.filter((p) => p.category === category);
  if (entity) products = products.filter((p) => p.entity === entity);
  if (chapterId) products = products.filter((p) => p.requiredChapterId === chapterId);

  if (!session?.user?.id) {
    return NextResponse.json(
      products.map((p) => ({ ...p, unlocked: false })),
    );
  }

  const unlocked = await prisma.fragmentUnlock.findMany({
    where: { userId: session.user.id },
    select: { fragmentId: true },
  });
  const unlockedIds = new Set(unlocked.map((u: { fragmentId: string }) => u.fragmentId));

  return NextResponse.json(
    products.map((p) => ({ ...p, unlocked: unlockedIds.has(p.id) })),
  );
}
