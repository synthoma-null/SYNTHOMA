export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { hash } from 'bcryptjs';
import { auth } from '../../../../../auth';
import prisma from '../../../../../src/lib/prisma';

function adminGuard(role: string | undefined): NextResponse | null {
  if (!role) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

function generateCodePlaintext(): string {
  const seg = () => randomBytes(2).toString('hex').toUpperCase();
  return `MNEM-${seg()}-${seg()}-${seg()}`;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const guard = adminGuard((session?.user as { role?: string } | undefined)?.role);
  if (guard) return guard;

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const { packageId, count, expiresDays } = body as Record<string, unknown>;

  if (typeof packageId !== 'string' || !packageId.trim()) {
    return NextResponse.json({ error: 'packageId je povinný.' }, { status: 400 });
  }
  if (typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > 100) {
    return NextResponse.json({ error: 'count musí být celé číslo 1–100.' }, { status: 400 });
  }
  if (typeof expiresDays !== 'number' || !Number.isInteger(expiresDays) || expiresDays < 1 || expiresDays > 365) {
    return NextResponse.json({ error: 'expiresDays musí být celé číslo 1–365.' }, { status: 400 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresDays);

  const plaintexts: string[] = [];

  for (let i = 0; i < count; i++) {
    let plaintext: string;
    let codeHash: string;
    let attempts = 0;

    do {
      plaintext = generateCodePlaintext();
      const normalized = plaintext.trim().toUpperCase();
      codeHash = await hash(normalized, 10);
      attempts++;
      if (attempts > 20) throw new Error('Nepodařilo se vygenerovat unikátní kód.');
    } while (false);

    await prisma.accessCode.create({
      data: { codeHash, packageId: packageId.trim(), expiresAt },
    });
    plaintexts.push(plaintext);
  }

  return NextResponse.json({
    ok: true,
    packageId: packageId.trim(),
    count,
    expiresAt: expiresAt.toISOString(),
    codes: plaintexts,
  });
}
