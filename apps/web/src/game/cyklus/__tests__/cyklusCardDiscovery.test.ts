import {
  getEmptyDiscovery,
  loadDiscovery,
  mergeDiscovery,
  recordCardDiscovery,
} from '../cyklusDiscovery';

describe('Cyklus poster discovery persistence', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it('rejects cards without a canonical poster mapping', () => {
    expect(recordCardDiscovery('first_boot', { viewKey: 'invalid:first_boot' })).toBeNull();
    expect(loadDiscovery().cards).toEqual([]);
  });

  it('records first and repeated real views without duplicate IDs', () => {
    recordCardDiscovery('restart_0', { seenAt: 100, viewKey: 'run-a:0:restart_0' });
    recordCardDiscovery('restart_0', { seenAt: 101, viewKey: 'run-a:0:restart_0' });
    let discovery = loadDiscovery();
    expect(discovery.cards).toEqual(['restart_0']);
    expect(discovery.cardRecords?.restart_0).toEqual({ firstSeenAt: 100, lastSeenAt: 100, seenCount: 1 });

    recordCardDiscovery('restart_0', { seenAt: 200, viewKey: 'run-b:0:restart_0' });
    discovery = loadDiscovery();
    expect(discovery.cards).toEqual(['restart_0']);
    expect(discovery.cardRecords?.restart_0).toEqual({ firstSeenAt: 100, lastSeenAt: 200, seenCount: 2 });
  });

  it('preserves local discovery when server sync fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('offline'));
    recordCardDiscovery('noise_filter', { seenAt: 300, viewKey: 'run-offline:0:noise_filter', sync: true });
    await Promise.resolve();
    expect(loadDiscovery().cards).toContain('noise_filter');
    expect(loadDiscovery().cardRecords?.noise_filter?.seenCount).toBe(1);
  });

  it('normalizes corrupt metadata and merges server and local IDs idempotently', () => {
    localStorage.setItem('synthoma_cyklus_discovery', JSON.stringify({
      cards: ['restart_0', 'restart_0'],
      cardRecords: { ghost_card: { firstSeenAt: 1, lastSeenAt: 1, seenCount: 1 } },
    }));
    expect(loadDiscovery().cards).toEqual(['restart_0']);
    expect(loadDiscovery().cardRecords).toEqual({});

    const server = { ...getEmptyDiscovery(), cards: ['restart_0'], cardRecords: { restart_0: { firstSeenAt: 100, lastSeenAt: 200, seenCount: 2 } } };
    const local = { ...getEmptyDiscovery(), cards: ['restart_0', 'noise_filter'], cardRecords: { restart_0: { firstSeenAt: 100, lastSeenAt: 250, seenCount: 3 } } };
    const merged = mergeDiscovery(server, local);
    expect(merged.cards).toEqual(['restart_0', 'noise_filter']);
    expect(merged.cardRecords?.restart_0).toEqual({ firstSeenAt: 100, lastSeenAt: 250, seenCount: 3 });
  });
});
