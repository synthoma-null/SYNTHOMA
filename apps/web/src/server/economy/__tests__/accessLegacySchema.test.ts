import { getAccessSnapshotWithClient } from '../access';

jest.mock('@prisma/client', () => ({ Prisma: { sql: jest.fn() } }));
jest.mock('../../../lib/prisma', () => ({ __esModule: true, default: {} }));

function schemaError(code: 'P2021' | 'P2022') {
  return Object.assign(new Error('legacy schema'), { code });
}

function clientWithEntitlements(entitlementFindMany: jest.Mock) {
  return {
    user: { findUnique: jest.fn().mockResolvedValue({ role: 'user' }) },
    entitlement: { findMany: entitlementFindMany },
    readingProgress: { findMany: jest.fn().mockResolvedValue([]) },
    fragmentUnlock: { findMany: jest.fn().mockResolvedValue([]) },
    userArtifact: { findMany: jest.fn().mockResolvedValue([]) },
    userCosmeticUnlock: { findMany: jest.fn().mockResolvedValue([]) },
    mnemLedger: { aggregate: jest.fn().mockResolvedValue({ _sum: { amount: null } }) },
  };
}

describe('access resolver against the deployed legacy schema', () => {
  it('falls back to chapterId ownership when entitlement content columns are absent', async () => {
    const entitlementFindMany = jest.fn()
      .mockRejectedValueOnce(schemaError('P2022'))
      .mockResolvedValueOnce([{
        id: 'entitlement-1',
        packageId: null,
        chapterId: '0-4-defragmentation',
      }]);
    const client = clientWithEntitlements(entitlementFindMany);

    const snapshot = await getAccessSnapshotWithClient(
      client as never,
      'user-1',
      [{ contentType: 'chapter', contentId: '0-4-defragmentation' }],
    );

    expect(snapshot.access[0]).toMatchObject({ state: 'owned', canAccess: true });
    expect(entitlementFindMany).toHaveBeenCalledTimes(2);
  });

  it('does not turn a real database outage into access', async () => {
    const entitlementFindMany = jest.fn().mockRejectedValue(new Error('connection unavailable'));
    const client = clientWithEntitlements(entitlementFindMany);

    await expect(getAccessSnapshotWithClient(
      client as never,
      'user-1',
      [{ contentType: 'chapter', contentId: '0-4-defragmentation' }],
    )).rejects.toThrow('connection unavailable');
  });
});
