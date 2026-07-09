import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  loadSubjectProgression,
  saveSubjectProgression,
  getEmptyProgression,
  upgradeVoidRoom,
  purchaseProtocol,
  equipProtocol,
  unequipProtocol,
  purchaseUpgrade,
  equipUpgrade,
  unequipUpgrade,
  equipArtifact,
  unequipArtifact,
  craftRecipe,
  setActiveScar,
  type RunReward,
  type SubjectProgression,
  type VoidRoomId,
} from '../../../game/cyklus/cyklusProgression';
import { loadDiscovery } from '../../../game/cyklus/cyklusDiscovery';
import { CyklusVoidHub } from '../CyklusVoidHub';

const mockDiscovery = () => ({
  cards: [],
  sectors: [],
  items: ['blanket_of_pause'],
  imprints: ['held_without_fixing'],
  endings: [],
  variants: [],
  findings: [],
});

function mockProgression(p: Partial<SubjectProgression> = {}) {
  const progression = { ...getEmptyProgression(), ...p };
  saveSubjectProgression(progression);
  return progression;
}

function mockReward(overrides: Partial<RunReward> = {}): RunReward {
  return {
    currencies: { residuum: 14, stabilizationCore: 1 },
    unlockedUpgrades: [],
    unlockedScars: ['memory_scar'],
    newTitles: [],
    reasons: [],
    craftingMaterials: { archive_dust: 2 },
    unlockedRecipes: [],
    profileMastery: {},
    voidRoomHints: ['crafting_table'],
    recommendedActions: ['Otevři Prázdnotu a uprav loadout.'],
    deathStat: 'memory',
    ...overrides,
  };
}

function setup() {
  const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
    if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
    const original = jest.requireActual('../../../game/cyklus/cyklusStorage') as { loadSubjectProgression?: () => unknown };
    return originalGetItem.call(localStorage, key);
  });
  const originalGetItem = Storage.prototype.getItem;
  return () => spy.mockRestore();
}

describe('CyklusVoidHub', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders currencies and loadout limits', () => {
    const originalGetItem = Storage.prototype.getItem;
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression({
      currencies: { residuum: 42 },
      totalRuns: 3,
      equippedUpgrades: ['black_box'],
    });
    const progression = loadSubjectProgression();
    render(<CyklusVoidHub progression={progression} state={null} />);
    expect(screen.getByText('Reziduum: 42')).toBeInTheDocument();
    expect(screen.getByText(/upgrady 1\/3/)).toBeInTheDocument();
  });

  it('shows a clear CTA for starting the next run', () => {
    const progression = mockProgression();
    const onStartRun = jest.fn();
    const onStartFocusedRun = jest.fn();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onStartRun, onStartFocusedRun }} />);

    const button = screen.getByRole('button', { name: 'Spustit další běh' });
    fireEvent.click(button);
    expect(onStartRun).toHaveBeenCalledTimes(1);
    expect(onStartFocusedRun).not.toHaveBeenCalled();
    expect(screen.getByText('Smíšený běh')).toBeInTheDocument();
  });

  it('shows focused area run choices and calls the focused run callback', () => {
    const progression = mockProgression();
    const onStartFocusedRun = jest.fn();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onStartFocusedRun }} />);

    const button = screen.getByRole('button', { name: /Vstoupit ke Glitchce/ });
    fireEvent.click(button);

    expect(onStartFocusedRun).toHaveBeenCalledWith(expect.objectContaining({
      type: 'sector',
      id: 'glitchka_nest',
      label: 'Glitchčino hnízdo',
      strictness: 'soft',
      remainingCards: 10,
    }));
    expect(screen.getByRole('status')).toHaveTextContent(/Glitchčino hnízdo/);
  });

  it('offers appendix focused runs without hiding the normal next-run CTA', () => {
    const progression = mockProgression();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onStartRun: jest.fn(), onStartFocusedRun: jest.fn() }} />);

    expect(screen.getByRole('button', { name: 'Spustit další běh' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Dodatek: Mýtnice Dvanáctníka/ })).toBeInTheDocument();
    expect(screen.getAllByText('Krátká stopa').length).toBeGreaterThan(0);
  });

  it('keeps mixed run and focused run wording free of internal terms', () => {
    const progression = mockProgression();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onStartRun: jest.fn(), onStartFocusedRun: jest.fn() }} />);

    expect(screen.getByRole('button', { name: 'Spustit další běh' })).toBeInTheDocument();
    expect(screen.getByText('SMĚR BĚHU')).toBeInTheDocument();
    expect(screen.getByText('Smíšený běh')).toBeInTheDocument();
    const focusButtons = screen.getAllByRole('button').filter((button) =>
      button.textContent?.includes('Vstoupit') || button.textContent?.includes('Dodatek:'),
    );
    expect(focusButtons.length).toBeGreaterThan(0);
    for (const button of focusButtons) {
      expect(button).not.toHaveAccessibleName(/strictness|payload|matching pool|focus/i);
    }
    expect(document.body).not.toHaveTextContent(/strictness|payload|matching pool|FOCUS_MODE/i);
  });

  it('shows understandable empty progression guidance', () => {
    const progression = mockProgression();
    render(<CyklusVoidHub progression={progression} state={null} actions={{}} />);

    expect(screen.getAllByText(/Začni první průchod/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Zatím nemáš dost materiálu/)).toBeInTheDocument();
  });

  it('shows first return changes from the recent reward', () => {
    const progression = mockProgression({
      totalRuns: 1,
      currencies: { residuum: 14, stabilizationCore: 1 },
      craftingInventory: { archive_dust: 2 },
      unlockedScars: ['memory_scar'],
    });
    render(<CyklusVoidHub progression={progression} state={null} actions={{}} recentReward={mockReward()} />);

    expect(screen.getByText('PRÁZDNOTA SE ZMĚNILA')).toBeInTheDocument();
    expect(screen.getByText(/Systém tvrdí, že se nic nestalo/)).toBeInTheDocument();
    expect(screen.getByText(/Reziduum: \+14/)).toBeInTheDocument();
    expect(screen.getByText(/Archivní prach: \+2/)).toBeInTheDocument();
  });

  it('renders recommended actions when they exist', () => {
    const progression = mockProgression({
      currencies: { residuum: 100, bondThread: 1 },
    });
    render(<CyklusVoidHub progression={progression} state={null} actions={{}} />);

    expect(screen.getAllByText(/Vylepši místnost Prázdnoty/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Otevřít doporučení' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vylepšit doporučenou místnost' })).toBeInTheDocument();
  });

  it('renders void rooms', () => {
    const originalGetItem = Storage.prototype.getItem;
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression();
    render(<CyklusVoidHub progression={progression} state={null} actions={{}} />);
    fireEvent.click(screen.getAllByText('Místnosti')[0]!);
    expect(screen.getByText('Liščí hnízdo')).toBeInTheDocument();
  });

  it('clicking upgrade button calls onUpgradeRoom callback', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression({
      currencies: { residuum: 100, bondThread: 1 },
    });
    const onUpgradeRoom = jest.fn();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onUpgradeRoom }} />);
    fireEvent.click(screen.getAllByText('Místnosti')[0]!);
    const foxRow = screen.getByText('Liščí hnízdo').closest('[class*="void-room-row"]');
    expect(foxRow).toBeTruthy();
    const foxButton = foxRow?.querySelector('button');
    expect(foxButton).toBeTruthy();
    if (foxButton) {
      fireEvent.click(foxButton);
      expect(onUpgradeRoom).toHaveBeenCalledWith('fox_nest');
    }
    spy.mockRestore();
  });

  it('allows equipping a protocol', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression({
      unlockedProtocols: ['fi_authentic_no'],
    });
    const onEquipLoadout = jest.fn();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onEquipLoadout }} />);
    fireEvent.click(screen.getAllByText('Protokoly')[0]!);
    const equip = screen.getByText('Vybavit');
    fireEvent.click(equip);
    expect(onEquipLoadout).toHaveBeenCalledWith({ id: 'fi_authentic_no', kind: 'protocol' });
    spy.mockRestore();
  });

  it('allows equipping an artifact', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression({
      craftedArtifacts: ['soft_pause_protocol'],
    });
    const onEquipLoadout = jest.fn();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onEquipLoadout }} />);
    fireEvent.click(screen.getAllByText('Loadout')[0]!);
    const equip = screen.getByText('Vybavit');
    fireEvent.click(equip);
    expect(onEquipLoadout).toHaveBeenCalledWith({ id: 'soft_pause_protocol', kind: 'artifact' });
    spy.mockRestore();
  });

  it('shows craft button only for craftable recipes', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression({
      currencies: { residuum: 100, bondThread: 5 },
      craftingInventory: { fox_warmth: 2 },
      knownRecipes: ['fox_blanket_protocol'],
      voidRooms: {
        fox_nest: { id: 'fox_nest', level: 1, unlocked: true, installedUpgrades: [] },
        crafting_table: { id: 'crafting_table', level: 1, unlocked: true, installedUpgrades: [] },
      },
    });
    render(<CyklusVoidHub progression={progression} state={null} actions={{}} />);
    fireEvent.click(screen.getAllByText('Crafting')[0]!);
    expect(screen.getByText('Vyrobit')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('allows equipping a scar', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression({
      unlockedScars: ['memory_scar'],
    });
    const onEquipLoadout = jest.fn();
    render(<CyklusVoidHub progression={progression} state={null} actions={{ onEquipLoadout }} />);
    fireEvent.click(screen.getAllByText('Protokoly')[0]!);
    const equip = screen.getByText('Vybavit');
    fireEvent.click(equip);
    expect(onEquipLoadout).toHaveBeenCalledWith({ id: 'memory_scar', kind: 'scar' });
    spy.mockRestore();
  });

  it('shows stabilization core slot limit in UI', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression({
      voidRooms: {
        stabilization_core: { id: 'stabilization_core', level: 1, unlocked: true, installedUpgrades: [] },
      },
    });
    render(<CyklusVoidHub progression={progression} state={null} />);
    expect(screen.getByText(/upgrady 0\/4/)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('renders overview summary with run count', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    const progression = mockProgression({ totalRuns: 5, stabilizedRuns: 1, totalResiduumEarned: 120 });
    render(<CyklusVoidHub progression={progression} state={null} />);
    expect(screen.getAllByText(/Běhů: 5/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Reziduum celkem: 120/).length).toBeGreaterThan(0);
    spy.mockRestore();
  });
});
