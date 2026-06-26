export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server';
import { auth, signOut } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

export async function DELETE() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await prisma.user.delete({ where: { id: userId } });

  await signOut({ redirect: false });

  return NextResponse.json({ ok: true, message: 'Identita smazána. Paměťový otisk vymazán.' });
}
