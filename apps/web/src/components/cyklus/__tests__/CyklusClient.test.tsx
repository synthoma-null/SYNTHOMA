import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CyklusClient, { ActiveObjectivePanel, RunEndSummary, getSwipeDecision, getSwipeThreshold } from '../CyklusClient';
import { createCyklusRun, resolveChoice } from '../../../game/cyklus/cyklusEngine';
import type { CyklusChoiceRecord, CyklusRunState, RunEnding } from '../../../game/cyklus/cyklusTypes';
import type { RunReward } from '../../../game/cyklus/cyklusProgression';

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));

const { useSession } = require('next-auth/react');
const RUN_STORAGE_KEY = 'synthoma_cyklus_run_v1';

function makeChoiceRecord(cardId: string, turn: number, memoryDelta: number): CyklusChoiceRecord {
  return {
    turn,
    cycle: 1,
    cardId,
    direction: 'yes',
    statDelta: { memory: memoryDelta },
    profileDelta: {},
    flagsGained: [],
    itemsGained: [],
    itemsLost: [],
    imprintsGained: [],
    poolsUnlocked: [],
    scheduledAdded: [],
    entityDelta: {},
    statsAfter: { energy: 50, memory: 60 + memoryDelta, bond: 50, control: 50 },
    sectorBefore: 'void',
    sectorAfter: 'void',
    ts: turn,
  };
}

function makeDeathState(): CyklusRunState {
  const base = createCyklusRun(true);
  return {
    ...base,
    id: 'outcome-death-test',
    status: 'dead',
    cycle: 2,
    choiceInCycle: 4,
    totalChoices: 4,
    currentCardId: 'tutorial_04_preview',
    stats: { energy: 45, memory: 100, bond: 52, control: 48 },
    visitedSectors: ['void', 'archive'],
    history: [
      makeChoiceRecord('tutorial_00_welcome', 1, 18),
      makeChoiceRecord('tutorial_01_swipe', 2, 14),
      makeChoiceRecord('tutorial_02_stats', 3, 11),
      makeChoiceRecord('tutorial_03_balance', 4, 8),
    ],
  };
}

const deathEnding: RunEnding = {
  type: 'death',
  stat: 'memory',
  extreme: 'high',
  title: 'Přesycení paměti',
  text: 'Archiv tě nepřijal. Jen tě přestal pouštět ven.',
};

function makeReward(overrides: Partial<RunReward> = {}): RunReward {
  return {
    currencies: { residuum: 12, stabilizationCore: 1 },
    unlockedUpgrades: [],
    unlockedScars: ['memory_scar'],
    newTitles: [],
    reasons: ['Přežil jsi dost dlouho na záznam.'],
    craftingMaterials: { archive_dust: 2 },
    unlockedRecipes: [],
    profileMastery: {},
    voidRoomHints: ['crafting_table'],
    recommendedActions: ['Otevři Prázdnotu a uprav loadout.'],
    deathStat: 'memory',
    ...overrides,
  };
}

function makeTutorialJunctionState(): CyklusRunState {
  let state = createCyklusRun(false);
  while (state.currentCardId !== 'tutorial_04b_junction' && state.totalChoices < 10) {
    state = resolveChoice(state, 'yes');
  }
  return state;
}

function storeRunState(state: CyklusRunState): void {
  localStorage.setItem(RUN_STORAGE_KEY, JSON.stringify(state));
}

async function continueStoredRun(): Promise<void> {
  fireEvent.click(await screen.findByRole('button', { name: 'Pokračovat' }));
}

describe('CyklusClient', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  beforeEach(() => {
    const store: Record<string, string> = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => { delete store[key]; });
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders tutorial progress panel for new players (ZÁKLAD tier)', async () => {
    render(<CyklusClient />);
    await waitFor(() => {
      expect(screen.getByText(/ZÁKLAD 1 \/ 5/)).toBeInTheDocument();
    });
    expect(screen.getByText(/Úvod/)).toBeInTheDocument();
  });

  it('skip tutorial button is a <button> element', async () => {
    render(<CyklusClient />);
    await waitFor(() => {
      expect(screen.getByText(/ZÁKLAD 1 \/ 5/)).toBeInTheDocument();
    });
    const skipBtn = screen.queryByRole('button', { name: /Přeskočit/ });
    expect(skipBtn).not.toBeNull();
    expect(skipBtn?.tagName).toBe('BUTTON');
  });

  it('shows an active objective panel for a new player', async () => {
    render(<CyklusClient />);
    await waitFor(() => {
      expect(screen.getByText('AKTUÁLNÍ STOPA')).toBeInTheDocument();
    });
    expect(screen.getByText(/Nauč se přežít volbu/)).toBeInTheDocument();
  });

  it('shows a short stat rule hint at the start', async () => {
    render(<CyklusClient />);
    const hint = await screen.findByTestId('cyklus-stat-rule-hint');
    expect(hint).toHaveTextContent('Cíl není mít všechno vysoko. Cíl je nespadnout z obou stran.');
    expect(hint.textContent?.length ?? 0).toBeLessThan(90);
    expect(hint).not.toHaveTextContent(/debug|localStorage|VOID_META|JSON/i);
  });

  it('keeps desktop focus guidance but marks the objective hidden on mobile', () => {
    const state = {
      ...createCyklusRun(true, {
        type: 'sector',
        id: 'glitchka_nest',
        label: 'Glitchčino hnízdo',
        strictness: 'soft',
        remainingCards: 10,
      }),
      currentCardId: 'first_boot',
      totalChoices: 2,
    };

    render(<ActiveObjectivePanel state={state} runHistoryCount={1} tutorialActive={false} />);

    const objective = screen.getByText('AKTUÁLNÍ STOPA').closest('section');
    expect(objective).toHaveClass('cyklus-active-objective--mobile-hidden');
    expect(objective).toHaveAttribute('data-mobile-mode', 'hidden');
    expect(objective?.querySelector('summary')).toBeNull();
    expect(screen.getByText(/Tento běh se drží oblasti: Glitchčino hnízdo/)).toBeInTheDocument();
    expect(screen.getByText('Glitchčino hnízdo')).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/strictness|payload|matching pool|glitchka_nest/i);
  });

  it('marks an established mixed run objective as hidden on mobile', () => {
    const state = { ...createCyklusRun(true), totalChoices: 2, currentCardId: 'first_boot' };
    render(<ActiveObjectivePanel state={state} runHistoryCount={1} tutorialActive={false} />);

    expect(screen.getByText('AKTUÁLNÍ STOPA').closest('section')).toHaveAttribute('data-mobile-mode', 'hidden');
  });

  it('minimum tutorial path renders the junction and then releases the player into the run', async () => {
    storeRunState(makeTutorialJunctionState());
    render(<CyklusClient />);
    await continueStoredRun();

    expect(await screen.findByRole('button', { name: /CHCI HRÁT/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CHCI JEŠTĚ VYSVĚTLIT/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /CHCI HRÁT/ }));

    await waitFor(() => {
      expect(screen.getByText('0 [RESTART]')).toBeInTheDocument();
    });
    expect(screen.queryByText(/ROZŠÍŘENÍ/)).not.toBeInTheDocument();
  });

  it('extended tutorial path continues to tutorial_05_profile', async () => {
    storeRunState(makeTutorialJunctionState());
    render(<CyklusClient />);
    await continueStoredRun();

    fireEvent.click(await screen.findByRole('button', { name: /CHCI JEŠTĚ VYSVĚTLIT/ }));

    await waitFor(() => {
      expect(screen.getByText('Profil není diagnóza')).toBeInTheDocument();
    });
    expect(screen.queryByText('0 [RESTART]')).not.toBeInTheDocument();
  });

  it('renders active focus with a human label and without internal QA terms', async () => {
    const state = {
      ...createCyklusRun(true, {
        type: 'sector',
        id: 'archive',
        label: 'Archiv',
        strictness: 'soft',
        remainingCards: 10,
      }),
      currentCardId: 'first_boot',
      flags: ['tutorial_min_done', 'tutorial_v2_done'],
    };
    storeRunState(state);

    render(<CyklusClient />);
    await continueStoredRun();

    expect(await screen.findByText(/Tento běh se drží oblasti: Archiv/)).toBeInTheDocument();
    expect(screen.getByText('Archiv')).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/strictness|payload|matcher|fallback|archive_pool/i);
    expect(document.querySelector('.cyklus-root--playing')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Odmítnout: KALIBROVAT' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Přijmout: SPUSTIT' })).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/SWIPE LEFT|SWIPE RIGHT|NE \/ LEFT|ANO \/ RIGHT/i);

    fireEvent.click(screen.getByRole('button', { name: 'Odmítnout: KALIBROVAT' }));
    expect(await screen.findByRole('dialog', { name: 'Dopad volby' })).toBeInTheDocument();
  });
});

describe('Cyklus swipe gesture helpers', () => {
  it('uses a card-relative threshold with safe bounds', () => {
    expect(getSwipeThreshold(360)).toBeCloseTo(79.2);
    expect(getSwipeThreshold(200)).toBe(56);
    expect(getSwipeThreshold(800)).toBe(96);
  });

  it('accepts a short fast flick but rejects a short slow drag', () => {
    expect(getSwipeDecision(30, 390, 0.7)).toBe('yes');
    expect(getSwipeDecision(-30, 390, -0.7)).toBe('no');
    expect(getSwipeDecision(30, 390, 0.2)).toBeNull();
  });
});

describe('RunEndSummary', () => {
  it('shows a short outcome summary and recommended next steps', () => {
    render(
      <RunEndSummary
        state={makeDeathState()}
        ending={deathEnding}
        reward={makeReward()}
        onOpenVoidHub={jest.fn()}
        onRestart={jest.fn()}
      />,
    );

    expect(screen.getByText(/KONEC: Přesycení paměti/)).toBeInTheDocument();
    expect(screen.getByText(/Paměť dosáhla 100/)).toBeInTheDocument();
    expect(screen.getByText('Otevři Prázdnotu a uprav loadout.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Otevřít Prázdnotu/ })).toBeInTheDocument();
  });

  it('keeps the full log hidden until the disclosure is opened', () => {
    render(
      <RunEndSummary
        state={makeDeathState()}
        ending={deathEnding}
        reward={makeReward()}
        onOpenVoidHub={jest.fn()}
        onRestart={jest.fn()}
      />,
    );

    expect(screen.queryByTestId('cyklus-full-run-log')).not.toBeInTheDocument();

    const disclosure = screen.getByRole('button', { name: /Zobrazit plný log/ });
    expect(disclosure).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(disclosure);

    const closeDisclosure = screen.getByRole('button', { name: /Skrýt plný log/ });
    expect(closeDisclosure).toHaveAttribute('aria-expanded', 'true');
    expect(closeDisclosure).toHaveAttribute('aria-controls', 'cyklus-full-run-log-outcome-death-test');
    expect(screen.getByTestId('cyklus-full-run-log')).toHaveTextContent(/SYNTHOMA: CYKLUS/);
  });

  it('shows at most three death contributors', () => {
    render(
      <RunEndSummary
        state={makeDeathState()}
        ending={deathEnding}
        reward={makeReward()}
        onOpenVoidHub={jest.fn()}
        onRestart={jest.fn()}
      />,
    );

    expect(screen.getAllByTestId('cyklus-outcome-contributor')).toHaveLength(3);
  });

  it('does not duplicate active focus guidance on the outcome screen', () => {
    const state = {
      ...makeDeathState(),
      runFocus: {
        type: 'sector',
        id: 'archive',
        label: 'Archiv',
        strictness: 'soft',
        remainingCards: 4,
      },
    } as CyklusRunState;

    render(
      <RunEndSummary
        state={state}
        ending={deathEnding}
        reward={makeReward()}
        onOpenVoidHub={jest.fn()}
        onRestart={jest.fn()}
      />,
    );

    expect(screen.queryByText(/Tento běh se drží oblasti/)).not.toBeInTheDocument();
  });
});
