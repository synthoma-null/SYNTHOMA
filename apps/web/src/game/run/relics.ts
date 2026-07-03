import type { RelicDefinition } from './runTypes';

// ── 8 relics ──────────────────────────────────────────────────────────────────

export const RELICS: Record<string, RelicDefinition> = {
  'gumovy-tuleň': {
    id: 'gumovy-tuleň',
    name: 'Gumový tuleň',
    description: 'První smrt v runu tě nechá přežít s 1 HP.',
    flavour: 'Gumový tuleň tě vrátil zpět do reality. Netvářil se nadšeně. Upřímně, nikdo by nebyl.',
    trigger: 'on_death',
    oncePerRun: true,
  },
  'archivni-klic': {
    id: 'archivni-klic',
    name: 'Archivní klíč',
    description: 'V archive nebo dialogue encounteru získáš extra volbu.',
    flavour: 'Klíč pochází z archivu, který přestal existovat. Klíč zůstal, protože klíče jsou optimisté.',
    trigger: 'on_enter_node',
    nodeTypeFilter: ['archive', 'dialogue'],
    oncePerRun: false,
  },
  'kompas-spatneho-sektoru': {
    id: 'kompas-spatneho-sektoru',
    name: 'Kompas do špatného sektoru',
    description: 'Jednou za run přeskočíš vybraný uzel. Ale získáš +1 Šum.',
    flavour: 'Ukazuje správně — jen ne tam, kam chceš. To je jeho filozofie. Respektuj ji.',
    trigger: 'passive',
    oncePerRun: true,
  },
  'sarkasminin-podpis': {
    id: 'sarkasminin-podpis',
    name: 'Sarkasmin podpis',
    description: 'Sarkasmus nemůže dát horší výsledek než neutrální.',
    flavour: 'Podpis byl udělena Sarkasminým na dokument, jehož obsah odmítla komentovat. Ale podepsala.',
    trigger: 'passive',
    oncePerRun: false,
  },
  'acidovy-filtr': {
    id: 'acidovy-filtr',
    name: 'Acidový filtr',
    description: 'První Šum získaný v každém souboji se ignoruje.',
    flavour: 'Filtruje acidové efekty. Nefiltruje lidský úsudek, ale to bylo příliš ambiciózní zadání.',
    trigger: 'passive',
    oncePerRun: false,
  },
  'vadne-razitko': {
    id: 'vadne-razitko',
    name: 'Vadné razítko',
    description: 'Po elite encounteru dostaneš náhodnou kartu navíc, ale jedna karta v ruce se označí jako "podezřelá".',
    flavour: 'Razítko bylo vydáno institucí, která mezitím zanikla třemi způsoby. Je stále platné — nikdo neví proč.',
    trigger: 'on_elite_reward',
    oncePerRun: false,
  },
  'nouzovy-ping': {
    id: 'nouzovy-ping',
    name: 'Nouzový ping',
    description: 'Jednou za run vrátíš HP na 50 % maxima po odpočinkovém uzlu.',
    flavour: 'Ping byl odeslán. Odpověď nepřišla. Přesto funguje — to je podstata dobrého pingu.',
    trigger: 'on_rest',
    oncePerRun: true,
  },
  'formular-z99': {
    id: 'formular-z99',
    name: 'Formulář Z-99',
    description: 'Boss fáze 1 se přeskočí (byl předem vyplněn).',
    flavour: 'Nikdo neví, kdy byl formulář Z-99 vyplněn. Nikdo neví, co obsahuje. Funguje.',
    trigger: 'on_boss_enter',
    oncePerRun: true,
  },
};

export function getRelicById(id: string): RelicDefinition | undefined {
  return RELICS[id];
}

export const RELIC_IDS = Object.keys(RELICS);
