import type { StarterDeckDefinition } from './runTypes';

// ── Starter decks ─────────────────────────────────────────────────────────────

export const STARTER_DECKS: Record<string, StarterDeckDefinition> = {
  'standardni-balicek': {
    id: 'standardni-balicek',
    title: 'Standardní balíček',
    description: 'Vyvážená sada karet pro první průchod Prázdnotou. Funguje. Systém neschválil název.',
    cardIds: [
      'kompresni-uder',
      'kompresni-uder',
      'kompresni-uder',
      'nouzova-obrana',
      'nouzova-obrana',
      'dash-mimo-protokol',
      'dash-mimo-protokol',
      'prepsat-chybu',
      'prepsat-chybu',
      'gumovy-tuleň-zasahuje',
      'sarkaticka-poznamka',
      'nelegalni-zkratka',
    ],
  },
};

export function getStarterDeckById(id: string): StarterDeckDefinition | undefined {
  return STARTER_DECKS[id];
}

export const STARTER_DECK_IDS = Object.keys(STARTER_DECKS);
export const DEFAULT_STARTER_DECK_ID = 'standardni-balicek';
