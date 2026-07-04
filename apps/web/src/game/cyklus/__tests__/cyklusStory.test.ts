import {
  getEmptyStoryProgression,
  loadStoryProgression,
  saveStoryProgression,
  getStoryDirective,
  getNextRestartPrologueCardId,
  applyStoryScore,
  updateStoryAfterChoice,
  updateStoryAfterRun,
  getStoryInitialSector,
  getStoryStartFlags,
  setActiveThread,
  getAvailableStoryThreads,
  getStoryActTitle,
} from '../cyklusStory';
import { createCyklusRun, resolveChoice, pickNextCard } from '../cyklusEngine';
import { CYKLUS_CARDS } from '../content';

describe('cyklusStory', () => {
  beforeEach(() => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('first run forces restart_0 when tutorial is seen', () => {
    const state = createCyklusRun(true);
    expect(state.currentCardId).toBe('restart_0');
  });

  it('after restart_5 story marks prologue as seen and moves to act 1', () => {
    let state = createCyklusRun(true);
    for (let i = 0; i < 6; i++) {
      state = resolveChoice(state, 'yes');
    }
    const story = loadStoryProgression();
    expect(story.restartPrologueSeen).toBe(true);
    expect(story.currentAct).toBe('act1_sandbox_glitchka');
    expect(story.completedEpisodes).toContain('restart_prologue');
  });

  it('second run no longer forces restart_0 after prologue is seen', () => {
    let state = createCyklusRun(true);
    for (let i = 0; i < 6; i++) {
      state = resolveChoice(state, 'yes');
    }
    const next = createCyklusRun(true);
    expect(next.currentCardId).not.toBe('restart_0');
    expect(next.currentCardId).toBe('first_boot');
  });

  it('act1 directive prefers sandbox_absurd and glitchka_chat packs', () => {
    const story = getEmptyStoryProgression();
    story.currentAct = 'act1_sandbox_glitchka';
    story.restartPrologueSeen = true;
    const state = createCyklusRun(true);
    const directive = getStoryDirective(state, story);
    expect(directive.preferredPackIds).toContain('sandbox_absurd');
    expect(directive.preferredPackIds).toContain('glitchka_chat');
    expect(directive.suppressedTags).toContain('restart');
  });

  it('story scoring boosts a card from preferred pack', () => {
    const story = getEmptyStoryProgression();
    story.currentAct = 'act1_sandbox_glitchka';
    story.restartPrologueSeen = true;
    const state = createCyklusRun(true);
    const directive = getStoryDirective(state, story);
    const card = Object.values(CYKLUS_CARDS).find((c) => c.packId === 'sandbox_absurd')!;
    const result = applyStoryScore(state, 0, card, directive, story);
    expect(result.score).toBeGreaterThan(0);
    expect(result.reasons.some((r) => r.includes('preferred pack'))).toBe(true);
  });

  it('story scoring suppresses restart tag after prologue', () => {
    const story = getEmptyStoryProgression();
    story.currentAct = 'act1_sandbox_glitchka';
    story.restartPrologueSeen = true;
    const state = createCyklusRun(true);
    const directive = getStoryDirective(state, story);
    const restartCard = CYKLUS_CARDS.restart_0!;
    const result = applyStoryScore(state, 0, restartCard, directive, story);
    expect(result.score).toBeLessThan(0);
    expect(result.reasons.some((r) => r.includes('suppressed'))).toBe(true);
  });

  it('packProgress updates based on card role', () => {
    let story = getEmptyStoryProgression();
    const state = createCyklusRun(true);
    const entryCard = Object.values(CYKLUS_CARDS).find((c) => c.packId === 'sandbox_absurd' && c.role === 'entry');
    if (!entryCard) return;
    story = updateStoryAfterChoice(story, state, entryCard.id, 'yes');
    expect(story.packProgress['sandbox_absurd']?.entrySeen).toBe(true);
  });

  it('act progression advances from act1 to act2 after visiting required sector', () => {
    let story = getEmptyStoryProgression();
    story.currentAct = 'act1_sandbox_glitchka';
    story.restartPrologueSeen = true;
    let state = createCyklusRun(true);
    state = { ...state, visitedSectors: ['void', 'memory_sandbox'] };
    story = updateStoryAfterRun(story, state);
    expect(story.currentAct).toBe('act2_sarkasma_blackbox');
  });

  it('activeThread changes initial sector and start flags', () => {
    let story = getEmptyStoryProgression();
    story.currentAct = 'act1_sandbox_glitchka';
    story.restartPrologueSeen = true;
    story = setActiveThread(story, 'glitchka_first_chat');
    saveStoryProgression(story);
    expect(getStoryInitialSector(story)).toBe('glitchka_nest');
    expect(getStoryStartFlags(story)).toContain('story_thread_glitchka_first_chat');
    const state = createCyklusRun(true);
    expect(state.sector).toBe('glitchka_nest');
    expect(state.flags).toContain('story_thread_glitchka_first_chat');
  });

  it('getStoryActTitle returns a readable title', () => {
    expect(getStoryActTitle('act0_restart_prologue')).toBe('Prolog restartu');
  });

  it('getNextRestartPrologueCardId returns restart_0 on empty run', () => {
    const state = createCyklusRun(true);
    expect(getNextRestartPrologueCardId(state)).toBe('restart_0');
  });

  it('pickNextCard does not force restart after prologue', () => {
    let state = createCyklusRun(true);
    for (let i = 0; i < 6; i++) {
      state = resolveChoice(state, 'yes');
    }
    state = createCyklusRun(true);
    state = { ...state, currentCardId: 'first_boot', usedCardIds: [] };
    const next = pickNextCard(state);
    expect(next.id.startsWith('restart_')).toBe(false);
  });

  it('available threads are empty before prologue is done', () => {
    const story = getEmptyStoryProgression();
    const threads = getAvailableStoryThreads(story, { cards: [], items: [], imprints: [], sectors: [], endings: [], findings: [], variants: [] }, { totalRuns: 0 } as any);
    expect(threads.length).toBe(0);
  });
});
