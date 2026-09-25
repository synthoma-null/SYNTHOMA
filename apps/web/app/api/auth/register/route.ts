export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import prisma from '../../../../src/lib/prisma';
import { grantMnems } from '../../../../src/server/economy';
import { consumeRateLimit, requestAddress } from '../../../../src/server/security/rateLimit';

const RegisterSchema = z.object({
  email: z.string().max(254).email('Neplatný e-mail.'),
  nickname: z
    .string()
    .min(3, 'Přezdívka musí mít 3–24 znaků.')
    .max(24, 'Přezdívka musí mít 3–24 znaků.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Přezdívka může obsahovat pouze písmena, čísla a podtržítko.'),
  password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků.').refine((value) => new TextEncoder().encode(value).length <= 72, 'Heslo je příliš dlouhé (max. 72 bajtů).'),
  passwordConfirm: z.string(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Hesla se neshodují.',
  path: ['passwordConfirm'],
});

export async function POST(req: NextRequest) {
  try {
    const limit = await consumeRateLimit('register', requestAddress(req.headers), 5, 3_600_000);
    if (!limit.allowed) return NextResponse.json({ error: 'Příliš mnoho pokusů. Zkus to později.' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } });
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Neplatná data.';
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const { email, nickname, password } = parsed.data;
    const emailLower = email.toLowerCase().trim();
    const nicknameLower = nickname.toLowerCase().trim();

    const existing = await prisma.user.findFirst({
      where: { OR: [{ emailLower }, { nicknameLower }] },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'Subjekt se zadanou identitou již existuje.' },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: email.trim(),
          emailLower,
          nickname: nickname.trim(),
          nicknameLower,
          passwordHash,
          profile: { create: {} },
          settings: { create: {} },
          psyche: { create: {} },
        },
        select: { id: true, nickname: true, email: true },
      });
      await grantMnems({
        userId: created.id,
        amount: 128,
        reason: 'Startovní kredit při registraci',
        idempotencyKey: `registration:${created.id}:welcome`,
        externalReference: created.id,
      }, tx);
      return created;
    });

    return NextResponse.json(
      { ok: true, userId: user.id, nickname: user.nickname },
      { status: 201 },
    );
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'Interní chyba serveru.' }, { status: 500 });
  }
}
