import { Prisma } from '@prisma/client';
import {
  getCatalogEntry,
  getPackageChapterIds,
  resolveChapterId,
  type AccessReason,
  type CatalogEntry,
  type ContentAccess,
  type ContentType,
} from '../../content/catalog';
import prisma from '../../lib/prisma';
import { EconomyError } from './errors';
import { getMnemBalance, type EconomyClient } from './ledger';

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

type AccessFacts = {
  role: string | null;
  direct: Set<string>;
  packages: Set<string>;
  completedChapters: Set<string>;
  legacyFragments: Set<string>;
  legacyArtifacts: Set<string>;
  legacyCosmetics: Set<string>;
};

function accessKey(type: ContentType, id: string): string {
  return `${type}:${id}`;
}

function ownedByLegacyTable(entry: CatalogEntry, facts: AccessFacts): boolean {
  if (entry.type === 'fragment') return facts.legacyFragments.has(entry.id);
  if (entry.type === 'artifact') return facts.legacyArtifacts.has(entry.id);
  if (entry.type === 'cosmetic') return facts.legacyCosmetics.has(entry.id);
  return false;
}

function resolveAccess(entry: CatalogEntry, userId: string | null, facts: AccessFacts): ContentAccess {
  const base = {
    contentType: entry.type,
    contentId: entry.id,
    mnemCost: entry.mnemCost,
    title: entry.title,
    purchasePackageIds: entry.packageIds,
    prerequisiteChapterId: entry.prerequisiteChapterId ?? null,
  };

  if (entry.availability !== 'published') {
    return {
      ...base,
      state: 'unavailable',
      reason: 'not_published',
      canAccess: false,
      canPurchase: false,
    };
  }
  if (entry.accessPolicy === 'free') {
    return { ...base, state: 'free', reason: 'catalog_free', canAccess: true, canPurchase: false };
  }
  if (facts.role === 'admin') {
    return { ...base, state: 'owned', reason: 'admin_override', canAccess: true, canPurchase: false };
  }

  const direct = facts.direct.has(accessKey(entry.type, entry.id)) || ownedByLegacyTable(entry, facts);
  if (direct) {
    return {
      ...base,
      state: 'owned',
      reason: 'direct_entitlement',
      canAccess: true,
      canPurchase: false,
    };
  }

  const packageId = entry.packageIds.find((candidate) => facts.packages.has(candidate));
  if (packageId) {
    return {
      ...base,
      state: 'owned',
      reason: 'package_entitlement',
      canAccess: true,
      canPurchase: false,
    };
  }

  const progressSatisfied =
    Boolean(entry.prerequisiteChapterId) &&
    facts.completedChapters.has(entry.prerequisiteChapterId ?? '');
  if (
    progressSatisfied &&
    (entry.accessPolicy === 'progress' || entry.accessPolicy === 'progress_or_entitlement')
  ) {
    return {
      ...base,
      state: 'owned',
      reason: 'progress_prerequisite',
      canAccess: true,
      canPurchase: false,
    };
  }

  const canPurchase =
    (entry.accessPolicy === 'entitlement' || entry.accessPolicy === 'progress_or_entitlement') &&
    typeof entry.mnemCost === 'number' &&
    entry.mnemCost > 0;
  let reason: AccessReason = userId ? 'purchase_required' : 'authentication_required';
  if (entry.accessPolicy === 'progress' || (!canPurchase && entry.prerequisiteChapterId)) {
    reason = 'prerequisite_required';
  }

  return {
    ...base,
    state: 'locked',
    reason,
    canAccess: false,
    canPurchase,
  };
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
    client.entitlement.findMany({
      where: {
        userId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      select: { contentType: true, contentId: true, packageId: true, chapterId: true },
    }),
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
    direct.add(`${entitlement.contentType}:${entitlement.contentId}`);
    if (entitlement.contentType === 'package') packages.add(entitlement.contentId);
    if (entitlement.packageId) packages.add(entitlement.packageId);
    if (entitlement.chapterId) direct.add(`chapter:${entitlement.chapterId}`);
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
    access: entries.map((entry) => resolveAccess(entry, userId, facts)),
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
  const snapshot = await getAccessSnapshot(userId, [{ contentType, contentId }]);
  const access = snapshot.access[0];
  if (!access) {
    throw new EconomyError('CONTENT_NOT_FOUND', 'Obsah nebyl nalezen.', 404);
  }
  return access;
}
