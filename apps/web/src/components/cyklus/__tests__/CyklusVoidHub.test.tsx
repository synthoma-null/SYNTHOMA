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
  type SubjectProgression,
  type VoidRoomId,
} from '../../../game/cyklus/cyklusProgression';
import { loadDiscovery } from '../../../game/cyklus/cyklusDiscovery';
import CyklusVoidHub from '../CyklusVoidHub';

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
    render(<CyklusVoidHub />);
    expect(screen.getByText(/Reziduum/)).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText(/Upgrady: 1 \/ 3/)).toBeInTheDocument();
  });

  it('renders void rooms', () => {
    const originalGetItem = Storage.prototype.getItem;
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression();
    render(<CyklusVoidHub />);
    fireEvent.click(screen.getByText('Místnosti'));
    expect(screen.getByText(/Liščí hnízdo/)).toBeInTheDocument();
  });

  it('clicking upgrade button refreshes progression', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression({
      currencies: { residuum: 100 },
    });
    render(<CyklusVoidHub />);
    fireEvent.click(screen.getByText('Místnosti'));
    const buttons = screen.getAllByText('VYLEPŠIT');
    const foxButton = buttons.find((b) => b.closest('[class*="cyklus-void-card"]')?.textContent?.includes('Liščí'));
    if (foxButton) {
      fireEvent.click(foxButton);
      expect(screen.getByText(/Prázdnota změnila tvar/)).toBeInTheDocument();
    }
    spy.mockRestore();
  });

  it('allows buying and equipping a protocol', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression({
      currencies: { residuum: 100, bondThread: 1 },
      profileMastery: { Fi: 20 },
    });
    render(<CyklusVoidHub />);
    fireEvent.click(screen.getByText('Protokoly'));
    const buy = screen.getAllByText('KOUPIT')[0]!;
    fireEvent.click(buy);
    expect(screen.getByText(/Protokol zakoupen/)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('allows equipping and unequipping an artifact', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression({
      craftedArtifacts: ['soft_pause_protocol'],
    });
    render(<CyklusVoidHub />);
    fireEvent.click(screen.getByText('Kapsa'));
    const equip = screen.getByText('NASADIT');
    fireEvent.click(equip);
    expect(screen.getByText(/Loadout upraven/)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('shows craft button only for craftable recipes', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression({
      currencies: { residuum: 100, bondThread: 5 },
      craftingInventory: { fox_warmth: 2 },
      knownRecipes: ['fox_blanket_protocol'],
      voidRooms: {
        fox_nest: { id: 'fox_nest', level: 1, unlocked: true, installedUpgrades: [] },
        crafting_table: { id: 'crafting_table', level: 1, unlocked: true, installedUpgrades: [] },
      },
    });
    render(<CyklusVoidHub />);
    fireEvent.click(screen.getByText('Crafting'));
    expect(screen.getByText('VYROBIT')).toBeInTheDocument();
    spy.mockRestore();
  });

  it('allows equipping and unequipping a scar', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression({
      unlockedScars: ['memory_scar'],
    });
    render(<CyklusVoidHub />);
    fireEvent.click(screen.getByText('Jizvy'));
    const equip = screen.getByText('NASADIT');
    fireEvent.click(equip);
    expect(screen.getByText(/Jizva nasazena/)).toBeInTheDocument();
    spy.mockRestore();
  });

  it('shows stabilization core slot limit in UI', () => {
    const originalGetItem = Storage.prototype.getItem;
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'synthoma_cyklus_discovery') return JSON.stringify(mockDiscovery());
      return originalGetItem.call(localStorage, key);
    });
    mockProgression({
      voidRooms: {
        stabilization_core: { id: 'stabilization_core', level: 1, unlocked: true, installedUpgrades: [] },
      },
    });
    render(<CyklusVoidHub />);
    expect(screen.getByText(/Upgrady: 0 \/ 4/)).toBeInTheDocument();
    spy.mockRestore();
  });
});
