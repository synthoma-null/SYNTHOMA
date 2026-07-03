import type { RunEffect } from './effects';

// ── Run card definition ───────────────────────────────────────────────────────

export type RunCardType = 'attack' | 'defense' | 'hack' | 'movement' | 'sabotage' | 'dialogue' | 'void';

export interface RunCard {
  id: string;
  type: RunCardType;
  title: string;
  text: string;
  flavour: string;
  effects: (playerId: string, targetId: string) => RunEffect[];
}

// ── Card definitions ──────────────────────────────────────────────────────────

export const RUN_CARDS: Record<string, RunCard> = {
  'kompresni-uder': {
    id: 'kompresni-uder',
    type: 'attack',
    title: 'Kompresní úder',
    text: 'Způsob 6 poškození. Při Šumu 5+ způsob +3, ale získej 1 Šum.',
    flavour: 'Forma útoku, který si nejspíš nebude pamatovat žádný zúčastněný.',
    effects: (_, targetId) => [{ type: 'deal_damage', targetId, amount: 6 }],
  },
  'nouzova-obrana': {
    id: 'nouzova-obrana',
    type: 'defense',
    title: 'Nouzová obrana',
    text: 'Získej 5 bloku.',
    flavour: 'Technicky vzato to funguje. Technicky vzato je taky dobré se ptát, proč jsi to potřeboval.',
    effects: (playerId) => [{ type: 'gain_block', playerId, amount: 5 }],
  },
  'dash-mimo-protokol': {
    id: 'dash-mimo-protokol',
    type: 'movement',
    title: 'Dash mimo protokol',
    text: 'Získej 8 bloku. Efekt: zruší příchozí útok, pokud máš 0 bloku.',
    flavour: 'Pohyb, který systém odmítl zaregistrovat, protože byl příliš rychlý na formulář.',
    effects: (playerId) => [{ type: 'gain_block', playerId, amount: 8 }],
  },
  'prepsat-chybu': {
    id: 'prepsat-chybu',
    type: 'hack',
    title: 'Přepsat chybu',
    text: 'Odstraň 2 Šum. Získej 1 Smích.',
    flavour: 'Systém bude předstírat, že to tak bylo vždycky. Má s tím praxi.',
    effects: (playerId) => [
      { type: 'lose_noise', playerId, amount: 2 },
      { type: 'gain_laugh', playerId, amount: 1 },
    ],
  },
  'gumovy-tuleň-zasahuje': {
    id: 'gumovy-tuleň-zasahuje',
    type: 'defense',
    title: 'Gumový tuleň zasahuje',
    text: 'Získej 4 bloku. Zruš příští negativní status efekt.',
    flavour: 'Neptal ses ho. Přišel sám. Jako vždy.',
    effects: (playerId) => [
      { type: 'gain_block', playerId, amount: 4 },
      { type: 'remove_status', targetId: playerId, statusId: 'dot_noise' },
    ],
  },
  'sarkaticka-poznamka': {
    id: 'sarkaticka-poznamka',
    type: 'sabotage',
    title: 'Sarkastická poznámka',
    text: 'Způsob 3 poškození. Získej 1 Smích. Pokud máš Šum 3+, způsob +2.',
    flavour: '"To bylo efektivní," řekl systém. Myslel to jinak, než to zní.',
    effects: (playerId, targetId) => [
      { type: 'deal_damage', targetId, amount: 3 },
      { type: 'gain_laugh', playerId, amount: 1 },
    ],
  },
  'nelegalni-zkratka': {
    id: 'nelegalni-zkratka',
    type: 'hack',
    title: 'Nelegální zkratka',
    text: 'Přeskočí příchozí záměr nepřítele. Získej 2 Smích.',
    flavour: 'Systém to zaznamenal jako "odložené". Nikdo neví odkdy.',
    effects: (playerId, targetId) => [
      { type: 'skip_enemy_intent', enemyId: targetId },
      { type: 'gain_laugh', playerId, amount: 2 },
    ],
  },
  'kompresni-uder-plus': {
    id: 'kompresni-uder-plus',
    type: 'attack',
    title: 'Kompresní úder+',
    text: 'Způsob 9 poškození.',
    flavour: 'Vylepšená verze. Systém to neschválil, ale výsledky nekomentoval.',
    effects: (_, targetId) => [{ type: 'deal_damage', targetId, amount: 9 }],
  },
  'archivni-bypass': {
    id: 'archivni-bypass',
    type: 'hack',
    title: 'Archivní bypass',
    text: 'Odstraň nepříteli 1 status. Způsob 4 poškození.',
    flavour: 'Přístup do části systému, ke které nikdo neměl přístup. Klasická chyba dokumentace.',
    effects: (_, targetId) => [
      { type: 'remove_status', targetId, statusId: 'buff' },
      { type: 'deal_damage', targetId, amount: 4 },
    ],
  },
  'klidna-zona': {
    id: 'klidna-zona',
    type: 'defense',
    title: 'Klidná zóna',
    text: 'Získej 12 bloku. Odstraň 1 Šum.',
    flavour: 'Sektor, kde nic neexploduje. Zatím. Systém si to pamatuje.',
    effects: (playerId) => [
      { type: 'gain_block', playerId, amount: 12 },
      { type: 'lose_noise', playerId, amount: 1 },
    ],
  },
  'glitch-pulz': {
    id: 'glitch-pulz',
    type: 'attack',
    title: 'Glitch pulz',
    text: 'Způsob 5 poškození. Přidej nepříteli status Zmatený (1 kolo).',
    flavour: 'Technicky to není útok. Systém ho tak ale zaevidoval, protože jiné políčko nebylo.',
    effects: (_, targetId) => [
      { type: 'deal_damage', targetId, amount: 5 },
      { type: 'add_status', targetId, statusId: 'confused', label: 'Zmatený', stacks: 1, turnsLeft: 1 },
    ],
  },
  'void-karta': {
    id: 'void-karta',
    type: 'void',
    title: 'Prázdnotový výboj',
    text: 'Způsob 7 poškození. Zvyš Void pressure o 1.',
    flavour: 'Prázdnota se ti ochotně půjčila. Za podmínek, které ještě neznáš.',
    effects: (_, targetId) => [
      { type: 'deal_damage', targetId, amount: 7 },
      { type: 'modify_void_pressure', amount: 1 },
    ],
  },
};

export const RUN_CARD_IDS = Object.keys(RUN_CARDS);

export function getRunCardById(id: string): RunCard | undefined {
  return RUN_CARDS[id];
}

// ── Card upgrade paths ─────────────────────────────────────────────────────────

export const CARD_UPGRADE_MAP: Record<string, string> = {
  'kompresni-uder': 'kompresni-uder-plus',
  'nouzova-obrana': 'klidna-zona',
  'dash-mimo-protokol': 'klidna-zona',
  'prepsat-chybu': 'archivni-bypass',
  'gumovy-tuleň-zasahuje': 'klidna-zona',
  'sarkaticka-poznamka': 'glitch-pulz',
  'nelegalni-zkratka': 'archivni-bypass',
  'glitch-pulz': 'void-karta',
};

export function getUpgradedCardId(cardId: string): string | undefined {
  return CARD_UPGRADE_MAP[cardId];
}

export function isUpgradable(cardId: string): boolean {
  return cardId in CARD_UPGRADE_MAP;
}
