import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { grantArtifact } from '../../../../src/lib/access';
import { getArtifactById, ARTIFACTS } from '../../../../src/content/booksManifest';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const owned = await prisma.userArtifact.findMany({
    where: { userId },
    orderBy: { unlockedAt: 'desc' },
  });
  const ownedIds = new Set(owned.map((a: { artifactId: string }) => a.artifactId));

  return NextResponse.json(
    ARTIFACTS.map((a) => ({ ...a, owned: ownedIds.has(a.id) })),
  );
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const { artifactId } = await req.json();
  if (!artifactId) return NextResponse.json({ error: 'artifactId je povinné.' }, { status: 400 });

  const artifact = getArtifactById(artifactId);
  if (!artifact) return NextResponse.json({ error: 'Artefakt neexistuje.' }, { status: 404 });
  if (!artifact.purchasable) return NextResponse.json({ error: 'Tento artefakt nelze koupit přímo.' }, { status: 400 });

  const mnemBalance = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });
  const balance = mnemBalance._sum.amount ?? 0;

  if (balance < artifact.cost) {
    return NextResponse.json(
      { error: `Nedostatek mnemů. Potřebuješ ${artifact.cost}, máš ${balance}.` },
      { status: 402 },
    );
  }

  const granted = await grantArtifact(userId, artifactId, 'mnem');
  if (!granted) return NextResponse.json({ error: 'Artefakt již vlastníš.' }, { status: 409 });

  await prisma.mnemLedger.create({
    data: { userId, amount: -artifact.cost, reason: `Artefakt: ${artifact.name}` },
  });

  return NextResponse.json({ ok: true, artifactId });
}
