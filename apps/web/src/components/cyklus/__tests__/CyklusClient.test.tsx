import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import CyklusClient, { ActiveObjectivePanel, EndReportVerdict, RunEndSummary, SystemNoticeOverlay, getSwipeDecision, getSwipeThreshold } from '../CyklusClient';
import { CycleForecastNotice, CycleSummaryNotice } from '../CycleNotices';
import { createCyklusRun, getCardById, resolveChoice } from '../../../game/cyklus/cyklusEngine';
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

function mockMobileViewport(matches: boolean): void {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: query === '(max-width: 767px)' ? matches : false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
}

describe('cycle forecast and summary notices', () => {
  it('renders forecast as a diagnostic view using only available data', () => {
    const state = {
      ...createCyklusRun(true),
      cycle: 5,
      stats: { energy: 50, memory: 72, bond: 28, control: 50 },
    };
    const onClose = jest.fn();
    const { container } = render(
      <CycleForecastNotice state={state} text="Archiv bude dnes ochotnější číst tebe." onClose={onClose} />,
    );

    expect(container.querySelector('.cyklus-cycle-forecast')).toBeInTheDocument();
    expect(container.querySelector('.cyklus-card-overlay')).toBeInTheDocument();
    const forecastSurface = container.querySelector('[data-card-overlay-surface="fill-card"]') as HTMLElement;
    expect(forecastSurface).toBeInTheDocument();
    expect(forecastSurface).toHaveClass('cyklus-card-overlay__surface');
    expect(forecastSurface.querySelector('.cyklus-card-overlay__header')).toBeInTheDocument();
    expect(forecastSurface.querySelector('.cyklus-card-overlay__content')).toBeInTheDocument();
    expect(forecastSurface.querySelector('.cyklus-card-overlay__footer')).toBeInTheDocument();
    expect(forecastSurface.className).not.toMatch(/small|compact-dialog/);
    expect(container.querySelector('.cyklus-cycle-summary')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'PREDIKCE CYKLU 05' })).toBeInTheDocument();
    expect(screen.getByText('Archiv bude dnes ochotnější číst tebe.')).toBeInTheDocument();
    expect(screen.getByText(/Paměť/)).toBeInTheDocument();
    expect(screen.getByText(/Vazba/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT DO CYKLU' })).toHaveFocus();
    expect(container).not.toHaveTextContent(/\d+\s*%/);
  });

  it('renders summary as a closed-cycle report with recorded metrics', () => {
    const state = makeDeathState();
    const { container } = render(
      <CycleSummaryNotice state={state} text="Archiv uzavřel záznam." onClose={jest.fn()} />,
    );

    expect(container.querySelector('.cyklus-cycle-summary')).toBeInTheDocument();
    expect(container.querySelector('.cyklus-card-overlay')).toBeInTheDocument();
    expect(container.querySelector('[data-card-overlay-surface="fill-card"]')).toBeInTheDocument();
    expect(container.querySelector('.cyklus-cycle-forecast')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'CYKLUS 01 UZAVŘEN' })).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('ROZHODNUTÍ')).toBeInTheDocument();
    expect(screen.getByText('+51')).toBeInTheDocument();
    expect(screen.getByText('Archiv uzavřel záznam.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'POKRAČOVAT' })).toHaveFocus();
  });

  it('uses the shared centered card overlay for system notices', () => {
    const { container } = render(
      <SystemNoticeOverlay variant="warning" label="SYSTÉMOVÉ VAROVÁNÍ" text="Tlak roste." onClose={jest.fn()} />,
    );

    expect(screen.getByRole('dialog', { name: 'SYSTÉMOVÉ VAROVÁNÍ' })).toBeInTheDocument();
    expect(container.querySelector('.cyklus-card-overlay--warning')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pokračovat' })).toHaveFocus();
  });
});

async function continueStoredRun(): Promise<void> {
  fireEvent.click(await screen.findByRole('button', { name: 'Pokračovat' }));
}

async function renderFirstBootRun(): Promise<HTMLElement> {
  const state = {
    ...createCyklusRun(true),
    currentCardId: 'first_boot',
    flags: ['tutorial_min_done', 'tutorial_v2_done'],
    preRunWarning: null,
  } as CyklusRunState;
  storeRunState(state);
  render(<CyklusClient />);
  await continueStoredRun();
  const reject = await screen.findByRole('button', { name: 'Odmítnout: KALIBROVAT' });
  const card = reject.closest('.cyklus-card') as HTMLElement;
  Object.defineProperty(card, 'clientWidth', { configurable: true, value: 400 });
  return card;
}

async function renderPosterRun(): Promise<HTMLElement> {
  const state = {
    ...createCyklusRun(true),
    currentCardId: 'noise_filter',
    flags: ['tutorial_min_done', 'tutorial_v2_done'],
    preRunWarning: null,
  } as CyklusRunState;
  storeRunState(state);
  render(<CyklusClient />);
  await continueStoredRun();
  return (await screen.findByRole('button', { name: 'OTEVŘÍT ZÁZNAM' })).closest('.cyklus-card') as HTMLElement;
}

describe('CyklusClient', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
    if (!window.PointerEvent) {
      class TestPointerEvent extends MouseEvent {
        readonly pointerId: number;
        readonly pointerType: string;

        constructor(type: string, init: PointerEventInit = {}) {
          super(type, init);
          this.pointerId = init.pointerId ?? 0;
          this.pointerType = init.pointerType ?? '';
        }
      }
      Object.defineProperty(window, 'PointerEvent', { configurable: true, value: TestPointerEvent });
    }
  });

  beforeEach(() => {
    const store: Record<string, string> = {};
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => { delete store[key]; });
    useSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    mockMobileViewport(false);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps the polished menu hierarchy and all original actions without a save', async () => {
    localStorage.setItem('synthoma_cyklus_tutorial_seen', 'true');
    render(<CyklusClient />);

    const brand = await screen.findByTestId('cyklus-menu-brand');
    expect(brand).toHaveTextContent('SYNTHOMA');
    expect(brand.childNodes).toHaveLength(1);
    expect(brand.querySelector('br')).toBeNull();
    expect(brand.parentElement).toHaveClass('cyklus-menu__title');
    expect(brand.closest('.cyklus-menu__content')).toHaveClass('cyklus-menu__content--brand-safe');
    expect(screen.queryByRole('button', { name: 'Pokračovat' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nová hra' })).not.toHaveClass('cyklus-menu__button--primary');
    expect(screen.getByRole('button', { name: 'Zopakovat tutorial' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'PRÁZDN0TA' })).toBeInTheDocument();
    expect(document.querySelector('.cyklus-menu__video')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('.cyklus-menu__portal')).toHaveAttribute('aria-hidden', 'true');
  });

  it('makes Continue the sole primary menu action when a save exists', async () => {
    localStorage.setItem('synthoma_cyklus_tutorial_seen', 'true');
    storeRunState(createCyklusRun(true));
    render(<CyklusClient />);

    const continueButton = await screen.findByRole('button', { name: 'Pokračovat' });
    expect(continueButton).toHaveClass('cyklus-menu__button--primary');
    expect(screen.getByRole('button', { name: 'Nová hra' })).not.toHaveClass('cyklus-menu__button--primary');
    expect(screen.getByText(/Rozehraný cyklus 1/)).toBeInTheDocument();
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

  it('reveals an available poster before the text record and can return to the image', async () => {
    const card = await renderPosterRun();

    expect(card).toHaveClass('cyklus-card--poster');
    const viewport = screen.getByRole('region', { name: 'Obrazová strana karty Šumový filtr' });
    const footer = card.querySelector('.cyklus-card-art__footer') as HTMLElement;
    const reveal = screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' });
    expect(viewport).not.toContainElement(reveal);
    expect(footer).toContainElement(reveal);
    expect(card.querySelectorAll('.cyklus-card-art__image')).toHaveLength(1);
    expect(screen.getByRole('img', { name: 'Obrazový záznam: Šumový filtr' })).toHaveAttribute('src', '/cards/cyklus/noise_filter.webp');
    expect(screen.queryByRole('button', { name: 'Přijmout: FILTROVAT' })).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.queryByRole('dialog', { name: 'Dopad volby' })).not.toBeInTheDocument();
    fireEvent.click(reveal);

    const actions = document.querySelector('[data-card-actions]') as HTMLElement;
    const choiceButtons = within(actions).getAllByRole('button');
    expect(choiceButtons[0]).toHaveAccessibleName('Přijmout: FILTROVAT');
    expect(choiceButtons[1]).toHaveAccessibleName('Odmítnout: PŘEHRÁT');
    expect(screen.getByRole('button', { name: 'OBRAZ' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Šumový filtr' })).toHaveFocus());

    fireEvent.click(screen.getByRole('button', { name: 'OBRAZ' }));
    expect(screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Obrazová strana karty Šumový filtr' }).scrollTop).toBe(0);
  });

  it('does not create poster DOM for a text-only card', async () => {
    await renderFirstBootRun();
    expect(document.querySelector('.cyklus-card-art')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.cyklus-card-art__image')).toHaveLength(0);
  });

  it('moves the mobile poster into a fullscreen portal and restores gameplay chrome', async () => {
    mockMobileViewport(true);
    document.documentElement.setAttribute('data-theme', 'acid-glitch');
    await renderPosterRun();

    const poster = await screen.findByTestId('cyklus-gameplay-header').then(() => document.body.querySelector('.cyklus-card-art--fullscreen') as HTMLElement);
    const root = document.querySelector('.cyklus-root--playing') as HTMLElement;
    expect(poster).toBeInTheDocument();
    expect(root).toHaveClass('cyklus-root--poster-active');
    expect(document.body).toHaveClass('cyklus-poster-lock');
    expect(screen.getByTestId('cyklus-gameplay-header')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Navigace' })).toBeInTheDocument();
    expect(document.querySelectorAll('.cyklus-card-art__image')).toHaveLength(1);
    const portal = document.querySelector('.cyklus-poster-portal') as HTMLElement;
    const portalImage = document.querySelector('.cyklus-card-art__image') as HTMLImageElement;
    expect(portal).toHaveAttribute('data-theme', 'acid-glitch');
    expect(portal).toHaveAttribute('data-cyklus-theme', 'acid-glitch');

    fireEvent.click(screen.getByRole('button', { name: 'ZVĚTŠIT' }));
    expect(screen.getByRole('button', { name: 'CELÁ KARTA' })).toBeInTheDocument();
    document.documentElement.setAttribute('data-theme', 'mono-light');
    await waitFor(() => expect(portal).toHaveAttribute('data-theme', 'mono-light'));
    expect(document.querySelector('.cyklus-card-art__image')).toBe(portalImage);
    expect(screen.getByRole('region', { name: 'Obrazová strana karty Šumový filtr' })).toHaveAttribute('data-scale', '2.5');
    fireEvent.click(screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' }));

    await waitFor(() => expect(document.querySelector('.cyklus-card-art--fullscreen')).not.toBeInTheDocument());
    expect(root).not.toHaveClass('cyklus-root--poster-active');
    expect(document.body).not.toHaveClass('cyklus-poster-lock');
    expect(screen.getByTestId('cyklus-gameplay-header')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Šumový filtr' })).toHaveFocus();
  });

  it('maps a right swipe on a reversed poster card to its semantic no choice', async () => {
    const card = await renderPosterRun();
    fireEvent.click(screen.getByRole('button', { name: 'OTEVŘÍT ZÁZNAM' }));
    Object.defineProperty(card, 'clientWidth', { configurable: true, value: 400 });

    fireEvent.pointerDown(card, { pointerId: 12, pointerType: 'touch', button: 0, clientX: 120, clientY: 180 });
    fireEvent.pointerMove(card, { pointerId: 12, pointerType: 'touch', button: 0, clientX: 235, clientY: 184 });
    fireEvent.pointerUp(card, { pointerId: 12, pointerType: 'touch', button: 0, clientX: 235, clientY: 184 });

    expect(card).toHaveClass('cyklus-card--fly-yes');
    const dialog = await screen.findByRole('dialog', { name: 'Dopad volby' });
    expect(dialog).toHaveTextContent(getCardById('noise_filter')!.no.resultText);
  });

  it('renders the unified command rail with real run status and accessible controls', async () => {
    const identityToggle = jest.fn();
    document.addEventListener('synthoma:identity-toggle', identityToggle);

    await renderFirstBootRun();
    const header = screen.getByTestId('cyklus-gameplay-header');
    const headerQueries = within(header);

    expect(headerQueries.getByText('Prázdnota')).toBeInTheDocument();
    expect(headerQueries.getByText('C01')).toBeInTheDocument();
    expect(headerQueries.getByText('01/12')).toBeInTheDocument();
    expect(headerQueries.getByRole('link', { name: 'Domů' })).toHaveAttribute('href', '/');
    fireEvent.click(headerQueries.getByRole('button', { name: 'Identita' }));
    expect(identityToggle).toHaveBeenCalledTimes(1);
    expect(headerQueries.getByRole('button', { name: 'Ovládací panel' })).toHaveAttribute('aria-controls', 'control-panel');
    expect(headerQueries.getByRole('button', { name: /Hudba/ })).toHaveAttribute('aria-controls', 'synthoma-audio-panel');
    expect(document.querySelector('.cyklus-mobile-hud')).toBeNull();

    document.removeEventListener('synthoma:identity-toggle', identityToggle);
  });

  it('opens one existing pocket sheet from the labeled pocket trigger', async () => {
    await renderFirstBootRun();
    const trigger = within(screen.getByRole('navigation', { name: 'Navigace' })).getByRole('button', { name: 'KAPSA, 0 předmětů' });

    expect(trigger.querySelector('svg')).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(trigger);

    expect(await screen.findByRole('dialog', { name: 'KAPSA 0' })).toBeInTheDocument();
    expect(screen.getAllByRole('dialog', { name: 'KAPSA 0' })).toHaveLength(1);
    expect(trigger).toHaveAttribute('aria-pressed', 'true');
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

describe('Cyklus pointer gestures', () => {
  const pointer = { pointerId: 7, pointerType: 'touch', button: 0 };

  it('starts a horizontal choice from the card title', async () => {
    const card = await renderFirstBootRun();
    const title = screen.getByRole('heading', { name: 'První boot' });

    fireEvent.pointerDown(title, { ...pointer, clientX: 120, clientY: 80 });
    fireEvent.pointerMove(title, { ...pointer, clientX: 230, clientY: 84 });
    fireEvent.pointerUp(title, { ...pointer, clientX: 230, clientY: 84 });

    expect(card).toHaveClass('cyklus-card--fly-yes');
    expect(await screen.findByRole('dialog', { name: 'Dopad volby' })).toBeInTheDocument();
  });

  it('starts a horizontal choice from the scrollable scene', async () => {
    await renderFirstBootRun();
    const scene = document.querySelector('.cyklus-card-scene') as HTMLElement;

    fireEvent.pointerDown(scene, { ...pointer, clientX: 250, clientY: 360 });
    fireEvent.pointerMove(scene, { ...pointer, clientX: 140, clientY: 364 });
    fireEvent.pointerUp(scene, { ...pointer, clientX: 140, clientY: 364 });

    expect(await screen.findByRole('dialog', { name: 'Dopad volby' })).toBeInTheDocument();
  });

  it('leaves a vertical scene drag to scrolling without choosing', async () => {
    const card = await renderFirstBootRun();
    const scene = document.querySelector('.cyklus-card-scene') as HTMLElement;

    fireEvent.pointerDown(scene, { ...pointer, clientX: 180, clientY: 220 });
    fireEvent.pointerMove(scene, { ...pointer, clientX: 184, clientY: 310 });
    fireEvent.pointerUp(scene, { ...pointer, clientX: 184, clientY: 310 });

    expect(screen.queryByRole('dialog', { name: 'Dopad volby' })).not.toBeInTheDocument();
    expect(card).toHaveStyle({ transform: 'translateX(0px) rotate(0deg) scale(1)' });
  });

  it('suppresses the button click that follows a swipe from the choice area', async () => {
    await renderFirstBootRun();
    const reject = screen.getByRole('button', { name: 'Odmítnout: KALIBROVAT' });

    fireEvent.pointerDown(reject, { ...pointer, clientX: 250, clientY: 500 });
    fireEvent.pointerMove(reject, { ...pointer, clientX: 140, clientY: 503 });
    fireEvent.pointerUp(reject, { ...pointer, clientX: 140, clientY: 503 });

    expect(fireEvent.click(reject)).toBe(false);
    expect(await screen.findByRole('dialog', { name: 'Dopad volby' })).toBeInTheDocument();
  });

  it('resets the card after pointer cancellation', async () => {
    const card = await renderFirstBootRun();

    fireEvent.pointerDown(card, { ...pointer, clientX: 120, clientY: 260 });
    fireEvent.pointerMove(card, { ...pointer, clientX: 190, clientY: 262 });
    expect(card).not.toHaveStyle({ transform: 'translateX(0px) rotate(0deg) scale(1)' });

    fireEvent.pointerCancel(card, { ...pointer, clientX: 190, clientY: 262 });
    expect(card).toHaveStyle({ transform: 'translateX(0px) rotate(0deg) scale(1)' });
    expect(screen.queryByRole('dialog', { name: 'Dopad volby' })).not.toBeInTheDocument();
  });

  it('keeps a normal tap on a choice button functional', async () => {
    await renderFirstBootRun();
    const accept = screen.getByRole('button', { name: 'Přijmout: SPUSTIT' });

    fireEvent.pointerDown(accept, { ...pointer, clientX: 280, clientY: 500 });
    fireEvent.pointerUp(accept, { ...pointer, clientX: 280, clientY: 500 });
    fireEvent.click(accept);

    expect(await screen.findByRole('dialog', { name: 'Dopad volby' })).toBeInTheDocument();
  });
});

describe('Cyklus choice feedback', () => {
  it('shows a focused dialog with explicit continuation and restores card focus', async () => {
    const card = await renderFirstBootRun();
    fireEvent.click(screen.getByRole('button', { name: 'Přijmout: SPUSTIT' }));

    const dialog = await screen.findByRole('dialog', { name: 'Dopad volby' });
    const overlay = dialog.closest('.cyklus-card-overlay');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(overlay).toBeInTheDocument();
    expect(card).toContainElement(overlay as HTMLElement);
    expect(card).toHaveAttribute('data-gameplay-surface', 'fixed');
    expect(card.querySelector('[data-card-scroll-region]')).toBeInTheDocument();
    expect(card.querySelector('[data-card-actions]')).toBeInTheDocument();
    const surface = within(dialog).getByText(/Systém se rozběhl/).closest('[data-card-overlay-surface="fill-card"]') as HTMLElement;
    const scrollContent = surface.querySelector('.cyklus-card-overlay__content') as HTMLElement;
    const footer = surface.querySelector('.cyklus-card-overlay__footer') as HTMLElement;
    const continueButton = within(dialog).getByRole('button', { name: 'POKRAČOVAT' });
    expect(scrollContent).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
    expect(scrollContent).not.toContainElement(continueButton);
    expect(footer).toContainElement(continueButton);
    expect(dialog).toHaveTextContent(/Systém se rozběhl/);
    expect(dialog).toHaveTextContent(/Energie ↑ 8/);
    expect(dialog).not.toHaveTextContent('Klikni nebo stiskni Enter pro pokračování');

    expect(continueButton).toHaveFocus();
    fireEvent.click(continueButton);

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Dopad volby' })).not.toBeInTheDocument());
    await waitFor(() => expect(card).toHaveFocus());
  });
});

describe('RunEndSummary', () => {
  it('shows a short outcome summary and recommended next steps', () => {
    const onOpenVoidHub = jest.fn();
    render(
      <RunEndSummary
        state={makeDeathState()}
        ending={deathEnding}
        reward={makeReward()}
        onOpenVoidHub={onOpenVoidHub}
        onRestart={jest.fn()}
      />,
    );

    expect(screen.getByText(/KONEC: Přesycení paměti/)).toBeInTheDocument();
    expect(screen.getByText(/Paměť dosáhla 100/)).toBeInTheDocument();
    expect(screen.getByText('Otevři Prázdnotu a uprav loadout.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Otevřít Prázdnotu/ }));
    expect(onOpenVoidHub).toHaveBeenCalledTimes(1);
  });

  it('keeps the sentence-case verdict separate from system labels', () => {
    render(<EndReportVerdict state={makeDeathState()} ending={deathEnding} />);

    const verdict = screen.getByTestId('cyklus-end-verdict');
    expect(verdict).toHaveAttribute('data-report-region', 'verdict');
    expect(screen.getByRole('heading', { name: 'Přesycení paměti' })).not.toHaveClass('is-uppercase');
    expect(screen.getByText(/Paměť dosáhla 100/)).toHaveClass('cyklus-end__verdict-text');
    expect(verdict.querySelectorAll('.cyklus-end__stat-label')).toHaveLength(4);
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
