import type {
  AccessReason,
  CatalogEntry,
  ContentAccess,
  ContentType,
} from '../../content/catalog';

export type AccessFacts = {
  role: string | null;
  direct: Set<string>;
  packages: Set<string>;
  completedChapters: Set<string>;
  legacyFragments: Set<string>;
  legacyArtifacts: Set<string>;
  legacyCosmetics: Set<string>;
};

function ownedByLegacyTable(entry: CatalogEntry, facts: AccessFacts): boolean {
  if (entry.type === 'fragment') return facts.legacyFragments.has(entry.id);
  if (entry.type === 'artifact') return facts.legacyArtifacts.has(entry.id);
  if (entry.type === 'cosmetic') return facts.legacyCosmetics.has(entry.id);
  return false;
}

export function resolveContentAccessFromFacts(
  entry: CatalogEntry,
  userId: string | null,
  facts: AccessFacts,
): ContentAccess {
  const base = {
    contentType: entry.type,
    contentId: entry.id,
    mnemCost: entry.mnemCost,
    title: entry.title,
    purchasePackageIds: entry.packageIds,
    prerequisiteChapterId: entry.prerequisiteChapterId ?? null,
  };
  if (entry.availability !== 'published') {
    return { ...base, state: 'unavailable', reason: 'not_published', canAccess: false, canPurchase: false };
  }
  if (entry.accessPolicy === 'free') {
    return { ...base, state: 'free', reason: 'catalog_free', canAccess: true, canPurchase: false };
  }
  if (facts.role === 'admin') {
    return { ...base, state: 'owned', reason: 'admin_override', canAccess: true, canPurchase: false };
  }
  const direct =
    facts.direct.has(`${entry.type}:${entry.id}`) ||
    ownedByLegacyTable(entry, facts);
  if (direct) {
    return { ...base, state: 'owned', reason: 'direct_entitlement', canAccess: true, canPurchase: false };
  }
  if (entry.packageIds.some((packageId) => facts.packages.has(packageId))) {
    return { ...base, state: 'owned', reason: 'package_entitlement', canAccess: true, canPurchase: false };
  }
  const progressSatisfied =
    Boolean(entry.prerequisiteChapterId) &&
    facts.completedChapters.has(entry.prerequisiteChapterId ?? '');
  if (
    progressSatisfied &&
    (entry.accessPolicy === 'progress' || entry.accessPolicy === 'progress_or_entitlement')
  ) {
    return { ...base, state: 'owned', reason: 'progress_prerequisite', canAccess: true, canPurchase: false };
  }
  const canPurchase =
    (entry.accessPolicy === 'entitlement' || entry.accessPolicy === 'progress_or_entitlement') &&
    typeof entry.mnemCost === 'number' &&
    entry.mnemCost > 0;
  let reason: AccessReason = userId ? 'purchase_required' : 'authentication_required';
  if (entry.accessPolicy === 'progress' || (!canPurchase && entry.prerequisiteChapterId)) {
    reason = 'prerequisite_required';
  }
  return { ...base, state: 'locked', reason, canAccess: false, canPurchase };
}
