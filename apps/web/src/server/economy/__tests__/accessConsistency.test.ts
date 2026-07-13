import { getCatalogEntry } from '../../../content/catalog';
import {
  resolveContentAccessFromFacts,
  type AccessFacts,
} from '../accessCore';

function facts(overrides: Partial<AccessFacts> = {}): AccessFacts {
  return {
    role: null,
    direct: new Set(),
    packages: new Set(),
    completedChapters: new Set(),
    legacyFragments: new Set(),
    legacyArtifacts: new Set(),
    legacyCosmetics: new Set(),
    ...overrides,
  };
}

function required(type: Parameters<typeof getCatalogEntry>[0], id: string) {
  const entry = getCatalogEntry(type, id);
  if (!entry) throw new Error(`missing fixture ${type}:${id}`);
  return entry;
}

describe('canonical access consistency', () => {
  it('distinguishes free, locked, owned and unavailable states', () => {
    expect(resolveContentAccessFromFacts(required('chapter', '0-inf-restart'), null, facts()).state).toBe('free');
    expect(resolveContentAccessFromFacts(required('chapter', '0-4-defragmentation'), 'user-1', facts()).state).toBe('locked');
    expect(resolveContentAccessFromFacts(
      required('chapter', '0-4-defragmentation'),
      'user-1',
      facts({ direct: new Set(['chapter:0-4-defragmentation']) }),
    ).state).toBe('owned');
    expect(resolveContentAccessFromFacts(required('chapter', '0-12-conflict'), 'user-1', facts()).state).toBe('unavailable');
  });

  it('expands package ownership in one resolver', () => {
    const access = resolveContentAccessFromFacts(
      required('chapter', '0-4-defragmentation'),
      'user-1',
      facts({ packages: new Set(['act-1']) }),
    );
    expect(access).toMatchObject({ state: 'owned', reason: 'package_entitlement', canAccess: true });
  });

  it('does not use an MNEM balance as Archive ownership', () => {
    const access = resolveContentAccessFromFacts(required('archive_record', 't-ai'), 'user-1', facts());
    expect(access.state).toBe('locked');
    expect(access.canAccess).toBe(false);
    expect(access.canPurchase).toBe(true);
  });

  it('returns the same chapter decision for Library, Reader and direct route consumers', () => {
    const entry = required('chapter', '0-6-searching');
    const sharedFacts = facts({ packages: new Set(['act-1']) });
    const states = ['Library', 'Reader', 'direct route'].map(() =>
      resolveContentAccessFromFacts(entry, 'user-1', sharedFacts).state,
    );
    expect(states).toEqual(['owned', 'owned', 'owned']);
  });
});
