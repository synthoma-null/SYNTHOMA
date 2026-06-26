export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

const ProfilePatchSchema = z.object({
  displayName: z.string().max(64).optional(),
  bio: z.string().max(500).optional(),
  title: z.string().max(64).optional(),
  publicProfile: z.boolean().optional(),
  showPsycheMap: z.boolean().optional(),
  showProgress: z.boolean().optional(),
  showChoices: z.boolean().optional(),
});

const SettingsPatchSchema = z.object({
  theme: z.string().optional(),
  animations: z.boolean().optional(),
  glass: z.boolean().optional(),
  typewriterSpeed: z.string().optional(),
  fontScale: z.number().min(0.5).max(2.0).optional(),
  audioEnabled: z.boolean().optional(),
  ttsEnabled: z.boolean().optional(),
});

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      nickname: true,
      email: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
      profile: true,
      settings: true,
      psyche: true,
      _count: {
        select: { choices: true, reading: true },
      },
    },
  });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const mnemTotal = await prisma.mnemLedger.aggregate({
    where: { userId },
    _sum: { amount: true },
  });

  return NextResponse.json({
    user,
    mnemBalance: mnemTotal._sum.amount ?? 0,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { profile: profileData, settings: settingsData } = body as {
      profile?: unknown;
      settings?: unknown;
    };

    const results: Record<string, unknown> = {};

    if (profileData !== undefined) {
      const parsed = ProfilePatchSchema.safeParse(profileData);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
      }
      const data = Object.fromEntries(
        Object.entries(parsed.data).filter(([, v]) => v !== undefined),
      );
      const updated = await prisma.userProfile.update({ where: { userId }, data });
      results.profile = updated;
    }

    if (settingsData !== undefined) {
      const parsed = SettingsPatchSchema.safeParse(settingsData);
      if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
      }
      const data = Object.fromEntries(
        Object.entries(parsed.data).filter(([, v]) => v !== undefined),
      );
      const updated = await prisma.userSettings.update({ where: { userId }, data });
      results.settings = updated;
    }

    return NextResponse.json({ ok: true, ...results });
  } catch (err) {
    console.error('[profile PATCH]', err);
    return NextResponse.json({ error: 'Interní chyba.' }, { status: 500 });
  }
}
