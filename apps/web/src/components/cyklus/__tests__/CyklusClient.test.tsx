import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CyklusClient, { RunEndSummary } from '../CyklusClient';
import { createCyklusRun } from '../../../game/cyklus/cyklusEngine';
import type { CyklusChoiceRecord, CyklusRunState, RunEnding } from '../../../game/cyklus/cyklusTypes';
import type { RunReward } from '../../../game/cyklus/cyklusProgression';

jest.mock('next-auth/react', () => ({ useSession: jest.fn() }));

const { useSession } = require('next-auth/react');

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
});
