export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

const PrivacySchema = z.object({
  publicProfile: z.boolean().optional(),
  showPsycheMap: z.boolean().optional(),
  showProgress: z.boolean().optional(),
  showChoices: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = PrivacySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const data = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined),
    );

    const updated = await prisma.userProfile.update({ where: { userId }, data });
    return NextResponse.json({ ok: true, profile: updated });
  } catch (err) {
    console.error('[privacy PATCH]', err);
    return NextResponse.json({ error: 'Interní chyba.' }, { status: 500 });
  }
}
