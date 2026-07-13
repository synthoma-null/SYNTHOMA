export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { isContentType } from '../../../../../src/content/catalog';
import prisma from '../../../../../src/lib/prisma';
import { getAccessSnapshot } from '../../../../../src/server/economy';

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const reference = req.nextUrl.searchParams.get('reference')?.trim();
  if (!reference) return NextResponse.json({ error: 'reference je povinné.' }, { status: 400 });

  const event = await prisma.externalGrantEvent.findUnique({
    where: { provider_externalReference: { provider: 'stripe', externalReference: reference } },
  });
  if (!event) {
    return NextResponse.json({ status: 'pending', snapshot: null }, { status: 202 });
  }
  if (event.userId !== userId) return NextResponse.json({ error: 'Grant nenalezen.' }, { status: 404 });

  const requests = [];
  if (event.packageId) requests.push({ contentType: 'package' as const, contentId: event.packageId });
  if (event.contentType && isContentType(event.contentType) && event.contentId) {
    requests.push({ contentType: event.contentType, contentId: event.contentId });
  }
  const snapshot = event.status === 'completed' && requests.length
    ? await getAccessSnapshot(userId, requests)
    : null;
  return NextResponse.json({
    status: event.status,
    errorCode: event.errorCode,
    snapshot,
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}
