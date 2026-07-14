import {
  LOCAL_DECISION_LIMIT,
  LOCAL_SUBJECT_PROFILE_KEY,
  LOCAL_SUBJECT_PROFILE_VERSION,
  loadLocalSubjectProfile,
  loadLocalSubjectProfileStore,
} from '../cyklusLocalProfile';

const stats = { energy: 51, memory: 49, bond: 52, control: 48 };

function decision(index: number) {
  return {
    cardId: 'restart_0',
    direction: index % 2 ? 'yes' : 'no',
    timestamp: 1_700_000_000_000 + index,
    runId: 'run-local',
    cycle: 1,
    resultingStats: stats,
  };
}

describe('local Cyklus Subject Profile storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns an explicit empty local profile without server identity data', () => {
    const profile = loadLocalSubjectProfile();
    expect(profile.state).toBe('local-empty');
    expect(profile.decisions).toEqual([]);
    expect(profile.discoveredCards).toBe(0);
  });

  it('persists validated decisions across repeated loads', () => {
    localStorage.setItem(LOCAL_SUBJECT_PROFILE_KEY, JSON.stringify({ version: 1, decisions: [decision(1)] }));
    expect(loadLocalSubjectProfileStore().decisions).toHaveLength(1);
    expect(loadLocalSubjectProfileStore().decisions[0]?.cardId).toBe('restart_0');
  });

  it('safely ignores corrupt storage', () => {
    localStorage.setItem(LOCAL_SUBJECT_PROFILE_KEY, '{broken-json');
    expect(loadLocalSubjectProfileStore()).toEqual({ version: LOCAL_SUBJECT_PROFILE_VERSION, decisions: [] });
  });

  it('migrates a legacy unversioned decision array to version one', () => {
    localStorage.setItem(LOCAL_SUBJECT_PROFILE_KEY, JSON.stringify([decision(1), decision(2)]));
    const migrated = loadLocalSubjectProfileStore();
    expect(migrated.version).toBe(1);
    expect(migrated.decisions).toHaveLength(2);
    expect(JSON.parse(localStorage.getItem(LOCAL_SUBJECT_PROFILE_KEY) ?? '{}').version).toBe(1);
  });

  it('keeps only the latest bounded decision history', () => {
    const decisions = Array.from({ length: LOCAL_DECISION_LIMIT + 25 }, (_, index) => decision(index));
    localStorage.setItem(LOCAL_SUBJECT_PROFILE_KEY, JSON.stringify({ version: 0, decisions }));
    const loaded = loadLocalSubjectProfileStore().decisions;
    expect(loaded).toHaveLength(LOCAL_DECISION_LIMIT);
    expect(loaded[0]?.timestamp).toBe(decision(25).timestamp);
  });

  it('counts unique discoveries from the existing Cyklus discovery layer', () => {
    localStorage.setItem('synthoma_cyklus_discovery', JSON.stringify({
      cards: ['restart_0', 'restart_0', 'noise_filter'],
      sectors: [],
      items: ['archive_key'],
      imprints: ['scar_memory'],
      endings: [],
      variants: [],
      findings: ['finding_one'],
    }));
    const profile = loadLocalSubjectProfile();
    expect(profile.discoveredCards).toBe(2);
    expect(profile.discoveredFragments).toBe(3);
  });
});
