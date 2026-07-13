import { Prisma } from '@prisma/client';
import {
  getCatalogEntry,
  getPackageChapterIds,
  resolveChapterId,
  type ContentAccess,
  type ContentType,
} from '../../content/catalog';
import prisma from '../../lib/prisma';
import { EconomyError } from './errors';
import { getMnemBalance, type EconomyClient } from './ledger';
import {
  resolveContentAccessFromFacts,
  type AccessFacts,
} from './accessCore';
import { isPrismaSchemaCompatibilityError } from '../runtimeDatabase';

export { resolveContentAccessFromFacts, type AccessFacts } from './accessCore';

export interface AccessRequest {
  contentType: ContentType;
  contentId: string;
}

export interface AccessSnapshot {
  version: string;
  userId: string | null;
  balance: number;
  access: ContentAccess[];
}

type AccessEntitlementRow = {
  contentType: string;
  contentId: string;
  packageId: string | null;
  chapterId: string | null;
};

async function loadEntitlements(
  client: EconomyClient,
  userId: string,
): Promise<AccessEntitlementRow[]> {
  try {
    return await client.entitlement.findMany({
      where: {
        userId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { contentType: true, contentId: true, packageId: true, chapterId: true },
    });
  } catch (error) {
    if (!isPrismaSchemaCompatibilityError(error)) throw error;
    const legacy = await client.entitlement.findMany({
      where: { userId },
      select: { id: true, packageId: true, chapterId: true },
    });
    return legacy.map((item) => ({
      contentType: item.chapterId ? 'chapter' : item.packageId ? 'package' : 'legacy_unknown',
      contentId: item.chapterId ?? item.packageId ?? `legacy:${item.id}`,
      packageId: item.packageId,
      chapterId: item.chapterId,
    }));
  }
}

async function loadAccessFacts(
  client: EconomyClient,
  userId: string | null,
  requests: readonly AccessRequest[],
): Promise<AccessFacts> {
  const empty: AccessFacts = {
    role: null,
    direct: new Set(),
    packages: new Set(),
    completedChapters: new Set(),
    legacyFragments: new Set(),
    legacyArtifacts: new Set(),
    legacyCosmetics: new Set(),
  };
  if (!userId) return empty;

  const needsFragments = requests.some((request) => request.contentType === 'fragment');
  const needsArtifacts = requests.some((request) => request.contentType === 'artifact');
  const needsCosmetics = requests.some((request) => request.contentType === 'cosmetic');
  const [user, entitlements, progress, fragments, artifacts, cosmetics] = await Promise.all([
    client.user.findUnique({ where: { id: userId }, select: { role: true } }),
    loadEntitlements(client, userId),
    client.readingProgress.findMany({
      where: { userId, completed: true },
      select: { chapterId: true },
    }),
    needsFragments
      ? client.fragmentUnlock.findMany({ where: { userId }, select: { fragmentId: true } })
      : Promise.resolve([]),
    needsArtifacts
      ? client.userArtifact.findMany({ where: { userId }, select: { artifactId: true } })
      : Promise.resolve([]),
    needsCosmetics
      ? client.userCosmeticUnlock.findMany({ where: { userId }, select: { cosmeticId: true } })
      : Promise.resolve([]),
  ]);

  const direct = new Set<string>();
  const packages = new Set<string>();
  for (const entitlement of entitlements) {
    const canonicalContentId = entitlement.contentType === 'chapter'
      ? resolveChapterId(entitlement.contentId) ?? entitlement.contentId
      : entitlement.contentId;
    direct.add(`${entitlement.contentType}:${canonicalContentId}`);
    if (entitlement.contentType === 'package') packages.add(entitlement.contentId);
    if (entitlement.packageId) packages.add(entitlement.packageId);
    if (entitlement.chapterId) {
      direct.add(`chapter:${resolveChapterId(entitlement.chapterId) ?? entitlement.chapterId}`);
    }
  }
  for (const packageId of packages) {
    for (const chapterId of getPackageChapterIds(packageId)) direct.add(`chapter:${chapterId}`);
  }

  return {
    role: user?.role ?? null,
    direct,
    packages,
    completedChapters: new Set(
      progress.map((item) => resolveChapterId(item.chapterId) ?? item.chapterId),
    ),
    legacyFragments: new Set(fragments.map((item) => item.fragmentId)),
    legacyArtifacts: new Set(artifacts.map((item) => item.artifactId)),
    legacyCosmetics: new Set(cosmetics.map((item) => item.cosmeticId)),
  };
}

export async function getAccessSnapshotWithClient(
  client: EconomyClient,
  userId: string | null,
  requests: readonly AccessRequest[],
): Promise<AccessSnapshot> {
  const entries = requests.map((request) => {
    const entry = getCatalogEntry(request.contentType, request.contentId);
    if (!entry) {
      throw new EconomyError(
        'CONTENT_NOT_FOUND',
        `Obsah ${request.contentType}:${request.contentId} neexistuje.`,
        404,
      );
    }
    return entry;
  });
  const [facts, balance] = await Promise.all([
    loadAccessFacts(client, userId, requests),
    userId ? getMnemBalance(userId, client) : Promise.resolve(0),
  ]);
  return {
    version: new Date().toISOString(),
    userId,
    balance,
    access: entries.map((entry) => resolveContentAccessFromFacts(entry, userId, facts)),
  };
}

export async function getAccessSnapshot(
  userId: string | null,
  requests: readonly AccessRequest[],
): Promise<AccessSnapshot> {
  return getAccessSnapshotWithClient(prisma, userId, requests);
}

export async function getContentAccess(
  userId: string | null,
  contentType: ContentType,
  contentId: string,
): Promise<ContentAccess> {
  const entry = getCatalogEntry(contentType, contentId);
  if (!entry) {
    throw new EconomyError('CONTENT_NOT_FOUND', 'Obsah nebyl nalezen.', 404);
  }
  if (entry.availability !== 'published' || entry.accessPolicy === 'free') {
    const publicFacts: AccessFacts = {
      role: null,
      direct: new Set(),
      packages: new Set(),
      completedChapters: new Set(),
      legacyFragments: new Set(),
      legacyArtifacts: new Set(),
      legacyCosmetics: new Set(),
    };
    return resolveContentAccessFromFacts(entry, userId, publicFacts);
  }
  const snapshot = await getAccessSnapshot(userId, [{ contentType, contentId }]);
  const access = snapshot.access[0];
  if (!access) {
    throw new EconomyError('CONTENT_NOT_FOUND', 'Obsah nebyl nalezen.', 404);
  }
  return access;
}
