import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const row = await prisma.cyklusRun.findUnique({
    where: { userId: session.user.id },
  });

  if (!row) {
    return NextResponse.json({ state: null, history: [], discovery: {} });
  }

  return NextResponse.json({
    state: row.stateJson,
    history: row.historyJson,
    discovery: row.discoveryJson,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { state, history, discovery } = body;

  await prisma.cyklusRun.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      stateJson: state ?? {},
      historyJson: history ?? [],
      discoveryJson: discovery ?? {},
    },
    update: {
      stateJson: state ?? {},
      historyJson: history ?? [],
      discoveryJson: discovery ?? {},
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.cyklusRun.deleteMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
