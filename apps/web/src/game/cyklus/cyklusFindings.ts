import type { CyklusRunState, StatKey } from './cyklusTypes';
import { CYKLUS_CARDS } from './cyklusCards';

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type FindingId = string;

export interface DiagnosticFinding {
  id: FindingId;
  title: string;
  description: string;
  check: (state: CyklusRunState) => boolean;
  reward?: {
    unlockPool?: string;
    unlockCard?: string;
    title?: string;
  };
}

export interface EarnedFinding {
  id: FindingId;
  title: string;
  description: string;
  reward?: DiagnosticFinding['reward'];
  earnedAt: number;
}

// ── FINDINGS DEFINITIONS ──────────────────────────────────────────────────────

export const CYKLUS_FINDINGS: DiagnosticFinding[] = [
  {
    id: 'collector',
    title: 'Sběrač podezřelých předmětů',
    description:
      'Subjekt vykazuje opakovanou tendenci sbírat předměty, které by v rozumném světě zůstaly ležet. Rozumný svět nebyl nalezen.',
    check: (s) => s.inventory.length >= 5,
  },
  {
    id: 'help_refuser',
    title: 'Chronický odmítač pomoci',
    description:
      'Subjekt systematicky odmítá asistenci od entit, které by ho při troše vůle mohly zachránit. Systém to považuje za formu hrdosti. Nebo poruchu sluchu.',
    check: (s) => {
      const refusals = s.history.filter((h) => {
        const card = CYKLUS_CARDS[h.cardId];
        if (!card) return false;
        const isHelperEntity =
          card.tags.includes('tai') ||
          card.tags.includes('archive') ||
          card.tags.includes('glitchka') ||
          card.tags.includes('sarkasma');
        const noLabel = card.noLabel.toLowerCase();
        const looksLikeRefusal =
          noLabel.includes('odmí') ||
          noLabel.includes('ignor') ||
          noLabel.includes('nechat') ||
          noLabel.includes('odejít') ||
          noLabel.includes('mlčet') ||
          noLabel.includes('ne') ||
          noLabel.includes('lhát');
        return isHelperEntity && looksLikeRefusal && h.direction === 'no';
      });
      return refusals.length >= 3;
    },
  },
  {
    id: 'admin_romantic',
    title: 'Administrativní romantik',
    description:
      'Subjekt kombinoval byrokratické nástroje s existenciálními dluhy způsobem, který systém nepředvídal. Systém to zapsal jako anomálii. Subjekt to zapsal jako rutinu.',
    check: (s) =>
      s.inventory.includes('rubber_stamp') &&
      s.flags.includes('sarkasma_debt'),
  },
  {
    id: 'seal_survivor',
    title: 'Tulenář krizového typu',
    description:
      'Subjekt byl zachráněn gumovým těsněním v momentě, kdy smrt vypadala jako logistická nevyhnutelnost. Tuleň se k tomu nevyjádřil. Pravděpodobně spí.',
    check: (s) => s.flags.includes('rubber_seal_saved'),
    reward: { unlockPool: 'seal_aftermath' },
  },
  {
    id: 'memory_diver',
    title: 'Paměťový potápěč',
    description:
      'Subjekt udržel Paměť nad 90 a přežil cyklus. Systém doporučuje zjistit, co přesně tam dole uchoval. Systém také doporučuje netlačit na to příliš.',
    check: (s) =>
      s.status === 'completed' &&
      s.history.some((h) => (h.statDelta.memory ?? 0) > 0 && s.stats.memory >= 85),
  },
  {
    id: 'clean_stabilizer',
    title: 'Stabilní podezřelým způsobem',
    description:
      'Subjekt dosáhl stabilizace bez jediného krizového itemu. Systém tento výsledek klasifikuje jako: buď velmi kompetentní, nebo velmi šťastný. Pravděpodobnost druhého výrazně vyšší.',
    check: (s) => {
      if (s.status !== 'completed') return false;
      const crisisItems = ['rubber_seal', 'acid_filter', 'archive_key'];
      return !crisisItems.some((id) => s.inventory.includes(id) || s.flags.includes(`${id}_used`));
    },
    reward: { title: 'Anomálie-bez-záchranné-sítě' },
  },
  {
    id: 'shattered_tourist',
    title: 'Krásně rozbitý subjekt',
    description:
      'Subjekt navštívil Zrcadlo, Reziduum a Hnízdo Glitchky v jednom cyklu. Výsledkem je osobnost, která bude vyžadovat komplexnější audit než obvykle. Systém si vyžádal přestávku.',
    check: (s) => {
      const sectors = new Set(s.visitedSectors);
      return sectors.has('mirror') && sectors.has('residuum') && sectors.has('glitchka_nest');
    },
    reward: { unlockPool: 'shattered_mirror_aftermath' },
  },
  {
    id: 'entity_bridge',
    title: 'Budovatel nevyžádaných mostů',
    description:
      'Subjekt navázal kladné vztahy se třemi nebo více entitami v jednom průchodu. Systém to označuje jako sociálně anomální. Subjekt zřejmě nezaznamenal, že mu nikdo neodepsal.',
    check: (s) =>
      Object.values(s.entityRelations).filter((v) => (v ?? 0) >= 3).length >= 3,
  },
  {
    id: 'first_run',
    title: 'Subjekt evidován',
    description:
      'Systém zaznamenal první ukončený cyklus. Nezávisle na výsledku. Data jsou uložena. Subjekt se z databáze nevymaže.',
    check: () => true,
  },
  {
    id: 'five_cycles',
    title: 'Prověřený opakovaný průchod',
    description:
      'Subjekt absolvoval pátý cyklus. Systém přestal předstírat, že to bylo nahodilé. Doporučuje se dávkování.',
    check: (s) => s.cycle >= 5,
  },
  {
    id: 'imprint_hoarder',
    title: 'Sběratel psychologických jizev',
    description:
      'Subjekt nashromáždil čtyři nebo více otisků v jednom průchodu. Systém nevylučuje terapii. Subjekt ji zřejmě odmítl na kartě číslo tři.',
    check: (s) => s.imprints.length >= 4,
  },
  {
    id: 'void_loyal',
    title: 'Věrný prázdnotě',
    description:
      'Subjekt strávil celý průchod v Prázdnotě bez přechodu do jiného sektoru. Systém toto označuje jako: buď záměrná strategie, nebo výsledek opakovaného výběru špatné dveře.',
    check: (s) => new Set(s.visitedSectors).size === 1 && s.visitedSectors[0] === 'void',
  },
];

// ── EVALUATION ────────────────────────────────────────────────────────────────

export function evaluateFindings(state: CyklusRunState): EarnedFinding[] {
  const now = Date.now();
  return CYKLUS_FINDINGS.filter((f) => {
    try { return f.check(state); } catch { return false; }
  }).map((f) => ({
    id: f.id,
    title: f.title,
    description: f.description,
    reward: f.reward,
    earnedAt: now,
  }));
}

// ── META UNLOCKY PODLE SMRTI ──────────────────────────────────────────────────

export interface MetaUnlock {
  id: string;
  reason: string;
  unlockPool?: string;
  unlockCard?: string;
  displayText: string;
}

const DEATH_UNLOCKS: Record<StatKey, Record<'low' | 'high', MetaUnlock[]>> = {
  memory: {
    high: [
      { id: 'archive_recognizes_pattern', reason: 'memory_high', unlockPool: 'archive_pattern', displayText: 'Archiv poznal vzorec' },
      { id: 'memory_flood_variant', reason: 'memory_high', unlockPool: 'memory_flood', displayText: 'Varianta povodně paměti' },
      { id: 'drowned_in_memory_imprint', reason: 'memory_high', unlockPool: 'drowned_imprints', displayText: 'Otisky utopenců v paměti' },
    ],
    low: [
      { id: 'empty_archive_page', reason: 'memory_low', unlockPool: 'empty_memory', displayText: 'Prázdná archivní stránka' },
      { id: 'format_survivor', reason: 'memory_low', unlockPool: 'post_format', displayText: 'Přeživší formátování' },
    ],
  },
  energy: {
    high: [
      { id: 'acid_afterimage', reason: 'energy_high', unlockPool: 'acid_aftermath', displayText: 'Kyselinový dosvit' },
      { id: 'burned_but_bright', reason: 'energy_high', unlockPool: 'overburn', displayText: 'Spálený, ale jasný' },
      { id: 'overclock_memorial', reason: 'energy_high', unlockPool: 'overclock', displayText: 'Přetaktovací pomník' },
    ],
    low: [
      { id: 'shutdown_log', reason: 'energy_low', unlockPool: 'post_shutdown', displayText: 'Záznam o vypnutí' },
      { id: 'sleep_protocol', reason: 'energy_low', unlockPool: 'dormant', displayText: 'Spánkový protokol' },
    ],
  },
  bond: {
    low: [
      { id: 'last_signal', reason: 'bond_low', unlockPool: 'isolation_cards', displayText: 'Poslední signál' },
      { id: 'empty_contact_list', reason: 'bond_low', unlockPool: 'empty_contacts', displayText: 'Prázdný seznam kontaktů' },
      { id: 'thread_under_door', reason: 'bond_low', unlockPool: 'thread_cards', displayText: 'Nit pod dveřmi' },
    ],
    high: [
      { id: 'dissolved_boundary', reason: 'bond_high', unlockPool: 'dissolution', displayText: 'Rozpuštěná hranice' },
      { id: 'merge_protocol', reason: 'bond_high', unlockPool: 'merge_cards', displayText: 'Protokol sloučení' },
    ],
  },
  control: {
    high: [
      { id: 'perfect_room', reason: 'control_high', unlockPool: 'crystal_cards', displayText: 'Dokonalý pokoj' },
      { id: 'statue_with_pulse', reason: 'control_high', unlockPool: 'statue_cards', displayText: 'Socha s pulzem' },
      { id: 'audit_of_stillness', reason: 'control_high', unlockPool: 'audit_cards', displayText: 'Audit ticha' },
    ],
    low: [
      { id: 'chaos_residue', reason: 'control_low', unlockPool: 'collapse_cards', displayText: 'Reziduum chaosu' },
      { id: 'shattered_protocol', reason: 'control_low', unlockPool: 'post_collapse', displayText: 'Rozbitý protokol' },
    ],
  },
};

export function getDeathUnlocks(deathStat: StatKey, extreme: 'low' | 'high'): MetaUnlock[] {
  return DEATH_UNLOCKS[deathStat]?.[extreme] ?? [];
}

// ── LOCALSTORAGE PERSISTENCE ──────────────────────────────────────────────────

const FINDINGS_KEY = 'synthoma_cyklus_findings';
const META_UNLOCKS_KEY = 'synthoma_cyklus_meta_unlocks';

export function loadEarnedFindings(): EarnedFinding[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FINDINGS_KEY);
    return raw ? (JSON.parse(raw) as EarnedFinding[]) : [];
  } catch { return []; }
}

export function saveNewFindings(findings: EarnedFinding[]): EarnedFinding[] {
  if (typeof window === 'undefined') return findings;
  try {
    const existing = loadEarnedFindings();
    const existingIds = new Set(existing.map((f) => f.id));
    const newOnes = findings.filter((f) => !existingIds.has(f.id));
    const merged = [...existing, ...newOnes];
    localStorage.setItem(FINDINGS_KEY, JSON.stringify(merged));
    return newOnes;
  } catch { return []; }
}

export function loadMetaUnlocks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(META_UNLOCKS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

export function saveMetaUnlocks(unlocks: MetaUnlock[]): MetaUnlock[] {
  if (typeof window === 'undefined') return unlocks;
  try {
    const existing = new Set(loadMetaUnlocks());
    const newOnes = unlocks.filter((u) => !existing.has(u.id));
    const merged = [...existing, ...newOnes.map((u) => u.id)];
    localStorage.setItem(META_UNLOCKS_KEY, JSON.stringify(merged));
    return newOnes;
  } catch { return []; }
}

export function loadMetaUnlockPools(): { pools: string[]; cards: string[] } {
  const savedIds = loadMetaUnlocks();
  const allUnlocks = Object.values(DEATH_UNLOCKS).flatMap((extremeMap) =>
    Object.values(extremeMap).flat()
  );
  const pools: string[] = [];
  const cards: string[] = [];
  for (const id of savedIds) {
    const unlock = allUnlocks.find((u) => u.id === id);
    if (unlock?.unlockPool) pools.push(unlock.unlockPool);
    if (unlock?.unlockCard) cards.push(unlock.unlockCard);
  }
  return { pools, cards };
}
