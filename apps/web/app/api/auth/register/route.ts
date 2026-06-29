export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import prisma from '../../../../src/lib/prisma';

const RegisterSchema = z.object({
  email: z.string().email('Neplatný e-mail.'),
  nickname: z
    .string()
    .min(3, 'Přezdívka musí mít 3–24 znaků.')
    .max(24, 'Přezdívka musí mít 3–24 znaků.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Přezdívka může obsahovat pouze písmena, čísla a podtržítko.'),
  password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků.'),
  passwordConfirm: z.string(),
}).refine((d) => d.password === d.passwordConfirm, {
  message: 'Hesla se neshodují.',
  path: ['passwordConfirm'],
});

export async function POST(req: NextRequest) {
  try {
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

    const user = await prisma.user.create({
      data: {
        email: email.trim(),
        emailLower,
        nickname: nickname.trim(),
        nicknameLower,
        passwordHash,
        profile: {
          create: {},
        },
        settings: {
          create: {},
        },
        psyche: {
          create: {},
        },
      },
      select: { id: true, nickname: true, email: true },
    });

    await prisma.mnemLedger.create({
      data: {
        userId: user.id,
        amount: 128,
        reason: 'Startovní kredit při registraci',
      },
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
