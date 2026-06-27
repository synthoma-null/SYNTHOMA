export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';

async function requireAdmin(): Promise<boolean> {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return role === 'admin';
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const query = (searchParams.get('query') ?? '').trim().toLowerCase();

  if (!query || query.length < 2) {
    return NextResponse.json({ error: 'query musí mít alespoň 2 znaky.' }, { status: 400 });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { emailLower: { contains: query } },
        { nicknameLower: { contains: query } },
      ],
    },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      mnemLedger: { select: { amount: true } },
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  const result = users.map((u) => ({
    id: u.id,
    email: u.email,
    nickname: u.nickname,
    role: u.role,
    createdAt: u.createdAt,
    lastLoginAt: u.lastLoginAt,
    mnemBalance: u.mnemLedger.reduce((s, e) => s + e.amount, 0),
  }));

  return NextResponse.json(result);
}
