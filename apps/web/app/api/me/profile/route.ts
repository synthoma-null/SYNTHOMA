export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { getCatalogEntry, isContentType, type ContentType } from '../../../../src/content/catalog';
import { getMnemBalance } from '../../../../src/server/economy';

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

  const [mnemBalance, ledger, entitlements, purchases, legacyFragments, legacyArtifacts, legacyCosmetics] = await Promise.all([
    getMnemBalance(userId),
    prisma.mnemLedger.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 50,
      select: {
        id: true, amount: true, balanceAfter: true, transactionType: true, reason: true,
        contentType: true, contentId: true, packageId: true, externalReference: true, createdAt: true,
      },
    }),
    prisma.entitlement.findMany({
      where: { userId, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
      orderBy: [{ grantedAt: 'desc' }, { id: 'desc' }],
      take: 200,
      select: {
        id: true, contentType: true, contentId: true, source: true, sourceReference: true,
        grantedAt: true, expiresAt: true,
      },
    }),
    prisma.purchase.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 30,
      select: { id: true, contentType: true, contentId: true, mnemCost: true, status: true, createdAt: true, completedAt: true },
    }),
    prisma.fragmentUnlock.findMany({ where: { userId }, select: { id: true, fragmentId: true, source: true, unlockedAt: true } }),
    prisma.userArtifact.findMany({ where: { userId }, select: { id: true, artifactId: true, source: true, unlockedAt: true } }),
    prisma.userCosmeticUnlock.findMany({ where: { userId }, select: { id: true, cosmeticId: true, source: true, unlockedAt: true } }),
  ]);

  const ownership = new Map(entitlements.map((entitlement) => [
    `${entitlement.contentType}:${entitlement.contentId}`,
    entitlement,
  ]));
  for (const legacy of [
    ...legacyFragments.map((item) => ({ id: item.id, contentType: 'fragment', contentId: item.fragmentId, source: item.source, sourceReference: null, grantedAt: item.unlockedAt, expiresAt: null })),
    ...legacyArtifacts.map((item) => ({ id: item.id, contentType: 'artifact', contentId: item.artifactId, source: item.source, sourceReference: null, grantedAt: item.unlockedAt, expiresAt: null })),
    ...legacyCosmetics.map((item) => ({ id: item.id, contentType: 'cosmetic', contentId: item.cosmeticId.replace(/^theme-/, ''), source: item.source, sourceReference: null, grantedAt: item.unlockedAt, expiresAt: null })),
  ]) {
    const key = `${legacy.contentType}:${legacy.contentId}`;
    if (!ownership.has(key)) ownership.set(key, legacy);
  }

  const titledOwnership = [...ownership.values()]
    .map((item) => {
      const contentType = isContentType(item.contentType) ? item.contentType : null;
      return {
        ...item,
        title: contentType ? getCatalogEntry(contentType, item.contentId)?.title ?? item.contentId : item.contentId,
      };
    })
    .sort((a, b) => b.grantedAt.getTime() - a.grantedAt.getTime());

  const titledPurchases = purchases.map((purchase) => ({
    ...purchase,
    title: isContentType(purchase.contentType)
      ? getCatalogEntry(purchase.contentType as ContentType, purchase.contentId)?.title ?? purchase.contentId
      : purchase.contentId,
  }));

  return NextResponse.json({
    user,
    mnemBalance,
    ledger,
    ownership: titledOwnership,
    purchases: titledPurchases,
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
