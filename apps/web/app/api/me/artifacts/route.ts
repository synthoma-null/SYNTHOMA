import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import { getArtifactById, ARTIFACTS } from '../../../../src/content/booksManifest';
import { getAccessSnapshot, isEconomyError, purchaseWithMnems } from '../../../../src/server/economy';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = session.user.id;

  const snapshot = await getAccessSnapshot(
    userId,
    ARTIFACTS.map((artifact) => ({ contentType: 'artifact' as const, contentId: artifact.id })),
  );
  const accessById = new Map(snapshot.access.map((access) => [access.contentId, access]));

  return NextResponse.json(
    ARTIFACTS.map((artifact) => ({
      ...artifact,
      owned: accessById.get(artifact.id)?.canAccess ?? false,
      access: accessById.get(artifact.id),
    })),
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

  const idempotencyKey = req.headers.get('idempotency-key')?.trim();
  if (!idempotencyKey) {
    return NextResponse.json({ error: 'Idempotency-Key je povinný.' }, { status: 400 });
  }
  try {
    const result = await purchaseWithMnems({
      userId,
      contentType: 'artifact',
      contentId: artifactId,
      idempotencyKey,
    });
    return NextResponse.json({ ok: true, artifactId, ...result });
  } catch (error) {
    if (isEconomyError(error)) {
      return NextResponse.json(
        { error: error.message, code: error.code, details: error.details },
        { status: error.status },
      );
    }
    throw error;
  }
}
