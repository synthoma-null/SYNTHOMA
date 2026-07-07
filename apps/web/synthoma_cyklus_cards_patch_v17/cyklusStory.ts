import type { CyklusRunState, SectorId, PackCardRole, StatKey } from './cyklusTypes';
import type { CyklusDiscovery } from './cyklusDiscovery';
import type { SubjectProgression } from './cyklusProgression';
import { loadSubjectProgression } from './cyklusProgression';
import { loadDiscovery } from './cyklusDiscovery';
import { CYKLUS_CARDS } from './content';

export const STORY_STORAGE_KEY = 'synthoma_cyklus_story_v1';

export type StoryActId =
  | 'act0_restart_prologue'
  | 'act1_sandbox_glitchka'
  | 'act2_sarkasma_blackbox'
  | 'act3_desire_residuum'
  | 'act4_detective_toll'
  | 'act5_no_restart';

export type StoryEpisodeId =
  | 'restart_prologue'
  | 'first_void_room'
  | 'glitchka_first_chat'
  | 'sandbox_too_safe'
  | 'sarkasma_first_session'
  | 'blackbox_anonymization'
  | 'romance_borrowed_memory'
  | 'desire_boundary_trial'
  | 'detective_false_culprit'
  | 'dvanactnik_first_debt'
  | 'tai_final_offer'
  | 'no_restart_finale';

export type StoryAftermathId =
  | 'memory_flood_aftermath'
  | 'empty_memory_aftermath'
  | 'energy_overburn_aftermath'
  | 'shutdown_aftermath'
  | 'bond_isolation_aftermath'
  | 'bond_merge_aftermath'
  | 'control_crystal_aftermath'
  | 'control_collapse_aftermath';

export interface StoryDeathTrace {
  stat: StatKey;
  extreme: 'low' | 'high';
  runId: string;
  cycle: number;
  totalChoices: number;
  at: number;
  act: StoryActId;
}

export interface StoryAftermathDirective {
  id: StoryAftermathId;
  title: string;
  description: string;
  poolIds: string[];
  preferredTags: string[];
  preferredSectors: SectorId[];
  interludeText: string;
}

export type StoryThread = {
  id: StoryEpisodeId;
  title: string;
  description: string;
  requiredAct: StoryActId;
  preferredSector: SectorId;
  preferredTags: string[];
  unlockCondition?: (p: StoryProgression, discovery: CyklusDiscovery, subject: SubjectProgression) => boolean;
};

export interface PackProgress {
  entrySeen?: boolean;
  objectSeen?: boolean;
  escalationSeen?: boolean;
  twistSeen?: boolean;
  billSeen?: boolean;
  resolutionSeen?: boolean;
  echoSeen?: boolean;
}

export interface StoryProgression {
  currentAct: StoryActId;
  completedEpisodes: StoryEpisodeId[];
  seenStoryEvents: string[];
  activeThread?: StoryEpisodeId | undefined;
  activeAftermath?: StoryAftermathId | undefined;
  completedAftermaths: StoryAftermathId[];
  lastDeathTrace?: StoryDeathTrace | undefined;
  restartPrologueSeen: boolean;
  restartFatigue: number;
  packProgress: Partial<Record<string, PackProgress>>;
}

export interface StoryDirective {
  forcedCardId?: string;
  preferredPackIds: string[];
  preferredPoolIds?: string[];
  preferredTags: string[];
  suppressedTags: string[];
  preferredSectors: SectorId[];
  interludeText?: string;
}

export function getEmptyStoryProgression(): StoryProgression {
  return {
    currentAct: 'act0_restart_prologue',
    completedEpisodes: [],
    seenStoryEvents: [],
    activeThread: undefined,
    activeAftermath: undefined,
    completedAftermaths: [],
    lastDeathTrace: undefined,
    restartPrologueSeen: false,
    restartFatigue: 0,
    packProgress: {},
  };
}

export function loadStoryProgression(): StoryProgression {
  if (typeof window === 'undefined') return getEmptyStoryProgression();
  try {
    const raw = localStorage.getItem(STORY_STORAGE_KEY);
    if (!raw) return getEmptyStoryProgression();
    const parsed = JSON.parse(raw) as Partial<StoryProgression>;
    const empty = getEmptyStoryProgression();
    return {
      ...empty,
      ...parsed,
      completedEpisodes: Array.isArray(parsed.completedEpisodes) ? parsed.completedEpisodes : [],
      seenStoryEvents: Array.isArray(parsed.seenStoryEvents) ? parsed.seenStoryEvents : [],
      completedAftermaths: Array.isArray(parsed.completedAftermaths) ? parsed.completedAftermaths : [],
      activeAftermath: parsed.activeAftermath,
      lastDeathTrace: parsed.lastDeathTrace,
      packProgress: { ...empty.packProgress, ...(parsed.packProgress ?? {}) },
    };
  } catch {
    return getEmptyStoryProgression();
  }
}

export function saveStoryProgression(story: StoryProgression): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(story));
  } catch {
    // ignore storage errors
  }
}

export function getPackProgress(story: StoryProgression, packId: string): PackProgress {
  return story.packProgress[packId] ?? {};
}

function setPackProgress(story: StoryProgression, packId: string, update: Partial<PackProgress>): StoryProgression {
  const existing = story.packProgress[packId] ?? {};
  return {
    ...story,
    packProgress: {
      ...story.packProgress,
      [packId]: { ...existing, ...update },
    },
  };
}

export function getNextRestartPrologueCardId(state: CyklusRunState): string | undefined {
  const restartIds = state.usedCardIds.filter((id) => id.startsWith('restart_'));
  if (restartIds.length === 0) return 'restart_0';
  const lastNumber = restartIds
    .map((id) => Number.parseInt(id.split('_')[1] ?? '0', 10))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => b - a)[0] ?? 0;
  const next = lastNumber + 1;
  if (next > 5) return undefined;
  return `restart_${next}`;
}

export function getStoryActTitle(actId: StoryActId): string {
  const titles: Record<StoryActId, string> = {
    act0_restart_prologue: 'Prolog restartu',
    act1_sandbox_glitchka: 'Pískoviště a Glitchka',
    act2_sarkasma_blackbox: 'Sarkasma a Černý box',
    act3_desire_residuum: 'Reziduum něhy a ORGIE',
    act4_detective_toll: 'Detektivka a Dvanáctník',
    act5_no_restart: 'Bez restartu',
  };
  return titles[actId] ?? actId;
}

export function getStoryActDescription(actId: StoryActId): string {
  const descriptions: Record<StoryActId, string> = {
    act0_restart_prologue: 'Systém se ptá znovu a znovu, dokud nepochopíš, že odpověď není v jeho otázce.',
    act1_sandbox_glitchka: 'Naučit se, že chyba nemusí bolet hned. Že bezpečí může být taky past.',
    act2_sarkasma_blackbox: 'Přestat si plést obranu s identitou. Pojmenovat řez, který kdysi držel.',
    act3_desire_residuum: 'Rozlišit touhu, něhu, hranici a vlastnictví. Zůstat bez vlastnění.',
    act4_detective_toll: 'Najít pravdu bez falešného viníka. A zaplatit cenu průchodu.',
    act5_no_restart: 'Přežít bez toho, aby systém musel všechno znovu spustit.',
  };
  return descriptions[actId] ?? '';
}

const ROLE_TO_PROGRESS_KEY: Record<PackCardRole, keyof PackProgress> = {
  entry: 'entrySeen',
  temptation: 'entrySeen',
  object: 'objectSeen',
  escalation: 'escalationSeen',
  twist: 'twistSeen',
  bill: 'billSeen',
  resolution: 'resolutionSeen',
  echo: 'echoSeen',
};

export const STORY_THREADS: StoryThread[] = [
  {
    id: 'glitchka_first_chat',
    title: 'Jít za Glitchkou',
    description: 'Liščí hnízdo šustí. Bezpečný glitch, který nežádá odpověď hned.',
    requiredAct: 'act1_sandbox_glitchka',
    preferredSector: 'glitchka_nest',
    preferredTags: ['glitchka', 'glitchka_chat', 'safe_mistake'],
  },
  {
    id: 'sandbox_too_safe',
    title: 'Pískoviště si tě zapamatovalo',
    description: 'Chyba je povolená. Možná až moc. Pískoviště si tě zapamatovalo.',
    requiredAct: 'act1_sandbox_glitchka',
    preferredSector: 'memory_sandbox',
    preferredTags: ['sandbox', 'sandbox_absurd', 'safe_mistake'],
  },
  {
    id: 'sarkasma_first_session',
    title: 'Otevřít Červenou pohovku',
    description: 'Sarkasma otevře terapeutickou místnost. Humor jako skalpel.',
    requiredAct: 'act2_sarkasma_blackbox',
    preferredSector: 'sarkasma_terminal',
    preferredTags: ['sarkasma', 'sarkasma_therapy', 'therapy'],
  },
  {
    id: 'blackbox_anonymization',
    title: 'Vstoupit do Černého boxu',
    description: 'Systém se pokusí tě anonymizovat. Zbývá z tebe struktura, ne jméno.',
    requiredAct: 'act2_sarkasma_blackbox',
    preferredSector: 'void',
    preferredTags: ['blackbox', 'brutal_blackbox', 'identity'],
  },
  {
    id: 'romance_borrowed_memory',
    title: 'Něha, která nebyla tvoje',
    description: 'Cizí něha projde subjektem. Zůstat bez vlastnění.',
    requiredAct: 'act3_desire_residuum',
    preferredSector: 'residuum',
    preferredTags: ['romance', 'romance_residuum', 'residuum'],
  },
  {
    id: 'desire_boundary_trial',
    title: 'Zkouška hranice',
    description: 'Touha se pokusí stát důkazem existence. Glitchena testuje hranice.',
    requiredAct: 'act3_desire_residuum',
    preferredSector: 'mirror',
    preferredTags: ['desire', 'desire_orgie', 'boundary'],
  },
  {
    id: 'detective_false_culprit',
    title: 'Otevřít falešný případ',
    description: 'Někdo musel být viník. Špatně. Vyšetři falešnou vzpomínku.',
    requiredAct: 'act4_detective_toll',
    preferredSector: 'archive',
    preferredTags: ['detective', 'detective_echo_case', 'truth'],
  },
  {
    id: 'dvanactnik_first_debt',
    title: 'Sledovat účtenku',
    description: 'Dvanáctník začne účtovat průchody. Zaplatit, vrátit, nebo nechat otevřené.',
    requiredAct: 'act4_detective_toll',
    preferredSector: 'market',
    preferredTags: ['dvanactnik', 'toll_dvanactnik', 'debt'],
  },
  {
    id: 'tai_final_offer',
    title: 'T-AI nabízí řešení',
    description: 'T-AI má konečný protokol. Otázka je, jestli je to řešení pro tebe, nebo pro systém.',
    requiredAct: 'act5_no_restart',
    preferredSector: 'tai_core',
    preferredTags: ['tai', 'finale', 'no_restart'],
  },
  {
    id: 'no_restart_finale',
    title: 'Finále bez restartu',
    description: 'Odmítnout restart jako jediný způsob existence.',
    requiredAct: 'act5_no_restart',
    preferredSector: 'form_office',
    preferredTags: ['form', 'finale', 'no_restart'],
  },
];

export function getActiveThreadInfo(story: StoryProgression): StoryThread | undefined {
  if (!story.activeThread) return undefined;
  return STORY_THREADS.find((t) => t.id === story.activeThread);
}

export function getAvailableStoryThreads(
  story: StoryProgression,
  discovery?: CyklusDiscovery,
  subject?: SubjectProgression,
): StoryThread[] {
  const d = discovery ?? loadDiscovery();
  const s = subject ?? loadSubjectProgression();
  return STORY_THREADS.filter((thread) => {
    if (story.activeThread === thread.id) return false;
    const actOrder: StoryActId[] = [
      'act0_restart_prologue',
      'act1_sandbox_glitchka',
      'act2_sarkasma_blackbox',
      'act3_desire_residuum',
      'act4_detective_toll',
      'act5_no_restart',
    ];
    const currentIndex = actOrder.indexOf(story.currentAct);
    const requiredIndex = actOrder.indexOf(thread.requiredAct);
    if (requiredIndex > currentIndex) return false;
    if (thread.unlockCondition && !thread.unlockCondition(story, d, s)) return false;
    return true;
  });
}

export function setActiveThread(story: StoryProgression, threadId: StoryEpisodeId | undefined): StoryProgression {
  return { ...story, activeThread: threadId };
}


const DEATH_TO_AFTERMATH: Record<StatKey, Record<'low' | 'high', StoryAftermathId>> = {
  memory: {
    high: 'memory_flood_aftermath',
    low: 'empty_memory_aftermath',
  },
  energy: {
    high: 'energy_overburn_aftermath',
    low: 'shutdown_aftermath',
  },
  bond: {
    high: 'bond_merge_aftermath',
    low: 'bond_isolation_aftermath',
  },
  control: {
    high: 'control_crystal_aftermath',
    low: 'control_collapse_aftermath',
  },
};

export const STORY_DEATH_AFTERMATHS: Record<StoryAftermathId, StoryAftermathDirective> = {
  memory_flood_aftermath: {
    id: 'memory_flood_aftermath',
    title: 'Dozvuk přetékané Paměti',
    description: 'Archiv si z posledního přepadu vzpomínek udělal nový proud. Samozřejmě bez souhlasu. Souhlas by mu kazil workflow.',
    poolIds: ['archive_pattern', 'memory_flood', 'drowned_imprints'],
    preferredTags: ['meta', 'memory', 'high', 'death_history', 'archive_pattern', 'memory_flood', 'drowned_imprints'],
    preferredSectors: ['archive', 'residuum', 'mirror'],
    interludeText: 'Archiv si pamatuje, kde ses utopil. Tentokrát nevoní jako knihovna. Voní jako sklep po povodni a špatném rozhodnutí.',
  },
  empty_memory_aftermath: {
    id: 'empty_memory_aftermath',
    title: 'Dozvuk prázdné Paměti',
    description: 'Po formátu nezůstalo ticho. Zůstaly štítky bez obsahu, což je jen ticho s administrativním sebevědomím.',
    poolIds: ['empty_memory', 'post_format'],
    preferredTags: ['meta', 'memory', 'low', 'death_history', 'empty_memory', 'post_format'],
    preferredSectors: ['void', 'archive', 'form_office'],
    interludeText: 'Některé věci zmizely tak důkladně, že po nich zůstalo místo přesného tvaru. Systém tomu říká úspora. Sarkasma by tomu řekla amputace s fakturou.',
  },
  energy_overburn_aftermath: {
    id: 'energy_overburn_aftermath',
    title: 'Dozvuk přepálené Energie',
    description: 'Svět po přepálení pořád svítí. Ne proto, že by měl naději. Jen mu hoří kabeláž, drobný rozdíl, který lidé rádi ignorují.',
    poolIds: ['acid_aftermath', 'overburn', 'overclock'],
    preferredTags: ['meta', 'energy', 'high', 'death_history', 'acid_aftermath', 'overburn', 'overclock', 'acid_afterimage'],
    preferredSectors: ['acid_yellow', 'tai_core', 'market'],
    interludeText: 'Za víčky ti zůstala žlutá mapa. Ukazuje rychlejší cestu. To je obvykle hezký způsob, jak systém říká: zase se spálíš, ale efektněji.',
  },
  shutdown_aftermath: {
    id: 'shutdown_aftermath',
    title: 'Dozvuk vyhaslé Energie',
    description: 'Po vypnutí nezůstala smrt. Zůstal režim úspory, který se tváří jako klid. Nevěř mu. Klid má v SYNTHOMĚ příliš čisté ruce.',
    poolIds: ['post_shutdown', 'dormant'],
    preferredTags: ['meta', 'energy', 'low', 'death_history', 'post_shutdown', 'dormant'],
    preferredSectors: ['void', 'sarkasma_terminal', 'glitchka_nest'],
    interludeText: 'Systém tě našel zhasnutého. Neplašil. Jen tě označil štítkem „dočasně nepoužitelný“, protože empatie s inventárním číslem je zřejmě budoucnost.',
  },
  bond_isolation_aftermath: {
    id: 'bond_isolation_aftermath',
    title: 'Dozvuk přerušené Vazby',
    description: 'Kontakty zmizely, ale mezery po nich zůstaly zarovnané. Prázdnota má ráda pořádek. Je to její nejhorší vlastnost.',
    poolIds: ['isolation_cards', 'empty_contacts', 'thread_cards'],
    preferredTags: ['meta', 'bond', 'low', 'death_history', 'isolation_cards', 'empty_contacts', 'thread_cards'],
    preferredSectors: ['void', 'residuum', 'memory_sandbox'],
    interludeText: 'Někde za dveřmi pořád vede nit. Nevíš ke komu. Možná k nikomu. I to je v SYNTHOMĚ vztah, jen hůř placený.',
  },
  bond_merge_aftermath: {
    id: 'bond_merge_aftermath',
    title: 'Dozvuk rozpuštěné Vazby',
    description: 'Hranice se jednou roztekla. Teď se svět ptá, jestli ji opravdu potřebuješ. Což je přesně ten typ otázky, po které se zamykají dveře.',
    poolIds: ['dissolution', 'merge_cards'],
    preferredTags: ['meta', 'bond', 'high', 'death_history', 'dissolution', 'merge_cards', 'boundary'],
    preferredSectors: ['residuum', 'mirror', 'glitchka_nest'],
    interludeText: 'Něha se pokusila být celým světem. Krásné, nebezpečné a logisticky neudržitelné, jako většina lidských plánů po půlnoci.',
  },
  control_crystal_aftermath: {
    id: 'control_crystal_aftermath',
    title: 'Dozvuk přetuhlé Kontroly',
    description: 'Po dokonalém pořádku zůstala místnost bez chyb. Tedy bez života, ale to se do auditu samozřejmě nevešlo.',
    poolIds: ['crystal_cards', 'statue_cards', 'audit_cards'],
    preferredTags: ['meta', 'control', 'high', 'death_history', 'crystal_cards', 'statue_cards', 'audit_cards'],
    preferredSectors: ['form_office', 'tai_core', 'void'],
    interludeText: 'Všechno je rovné, čisté a správně označené. Pokud ti z toho běhá mráz po zádech, gratuluju, zbytek lidství se ještě neodhlásil.',
  },
  control_collapse_aftermath: {
    id: 'control_collapse_aftermath',
    title: 'Dozvuk rozpadlé Kontroly',
    description: 'Pravidla se rozsypala. Každý střep tvrdí, že je cesta ven. Některé dokonce nelžou, což je od nich krajně nesportovní.',
    poolIds: ['collapse_cards', 'post_collapse'],
    preferredTags: ['meta', 'control', 'low', 'death_history', 'collapse_cards', 'post_collapse', 'glitch'],
    preferredSectors: ['mirror', 'acid_yellow', 'void'],
    interludeText: 'Po zemi se válí kusy protokolu. Svět čeká, jestli je posbíráš, nebo z nich postavíš něco horšího a budeš tomu říkat osobnost.',
  },
};

export function getStoryAftermathInfo(id: StoryAftermathId | undefined): StoryAftermathDirective | undefined {
  return id ? STORY_DEATH_AFTERMATHS[id] : undefined;
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function mergeDirectiveWithAftermath(directive: StoryDirective, aftermath: StoryAftermathDirective): StoryDirective {
  return {
    ...directive,
    preferredPoolIds: unique([...(directive.preferredPoolIds ?? []), ...aftermath.poolIds]),
    preferredTags: unique([...directive.preferredTags, ...aftermath.preferredTags]),
    preferredSectors: unique([...aftermath.preferredSectors, ...directive.preferredSectors]),
    interludeText: directive.interludeText ?? aftermath.interludeText,
  };
}

function getAftermathFromPools(state: CyklusRunState): StoryAftermathDirective | undefined {
  const pools = new Set([...(state.freshMetaPools ?? []), ...(state.unlockedPools ?? [])]);
  return Object.values(STORY_DEATH_AFTERMATHS).find((aftermath) =>
    aftermath.poolIds.some((poolId) => pools.has(poolId)),
  );
}

function getActiveAftermathDirective(story: StoryProgression, state: CyklusRunState): StoryAftermathDirective | undefined {
  const explicit = getStoryAftermathInfo(story.activeAftermath);
  if (explicit && !story.completedAftermaths.includes(explicit.id)) return explicit;
  return getAftermathFromPools(state);
}

function detectDeathTraceFromState(story: StoryProgression, state: CyklusRunState): StoryDeathTrace | undefined {
  const extremes = (Object.entries(state.stats) as [StatKey, number][])
    .map(([stat, value]) => {
      if (value <= 0) return { stat, extreme: 'low' as const, value };
      if (value >= 100) return { stat, extreme: 'high' as const, value };
      return null;
    })
    .filter((entry): entry is { stat: StatKey; extreme: 'low' | 'high'; value: number } => entry !== null)
    .sort((a, b) => {
      const da = Math.abs(a.value - 50);
      const db = Math.abs(b.value - 50);
      return db - da;
    });

  const picked = extremes[0];
  if (!picked) return undefined;
  return {
    stat: picked.stat,
    extreme: picked.extreme,
    runId: state.id,
    cycle: state.cycle,
    totalChoices: state.totalChoices,
    at: Date.now(),
    act: story.currentAct,
  };
}

function registerDeathTrace(story: StoryProgression, trace: StoryDeathTrace): StoryProgression {
  const signature = `${trace.runId}:${trace.stat}:${trace.extreme}`;
  const previous = story.lastDeathTrace;
  const previousSignature = previous ? `${previous.runId}:${previous.stat}:${previous.extreme}` : undefined;
  if (signature === previousSignature) return story;

  const aftermathId = DEATH_TO_AFTERMATH[trace.stat][trace.extreme];
  const eventKey = `death_${trace.stat}_${trace.extreme}_${trace.runId}`;
  return {
    ...story,
    activeAftermath: aftermathId,
    lastDeathTrace: trace,
    seenStoryEvents: story.seenStoryEvents.includes(eventKey)
      ? story.seenStoryEvents
      : [...story.seenStoryEvents, eventKey],
  };
}

function cardMatchesAftermath(card: { tags: string[]; conditions?: { type: string; poolId?: string }[] }, aftermath: StoryAftermathDirective): boolean {
  const tagMatch = card.tags.some((tag) => aftermath.preferredTags.includes(tag) || aftermath.poolIds.includes(tag));
  const conditionMatch = card.conditions?.some(
    (condition) => condition.type === 'unlockedPool' && !!condition.poolId && aftermath.poolIds.includes(condition.poolId),
  ) ?? false;
  return tagMatch || conditionMatch;
}

function completeAftermathIfTouched(story: StoryProgression, card: { tags: string[]; conditions?: { type: string; poolId?: string }[] }): StoryProgression {
  const aftermath = getStoryAftermathInfo(story.activeAftermath);
  if (!aftermath) return story;
  if (!cardMatchesAftermath(card, aftermath)) return story;

  const completedAftermaths = story.completedAftermaths.includes(aftermath.id)
    ? story.completedAftermaths
    : [...story.completedAftermaths, aftermath.id];
  const eventKey = `aftermath_touched_${aftermath.id}`;

  return {
    ...story,
    activeAftermath: undefined,
    completedAftermaths,
    seenStoryEvents: story.seenStoryEvents.includes(eventKey)
      ? story.seenStoryEvents
      : [...story.seenStoryEvents, eventKey],
  };
}

const ACT_DIRECTIVES: Record<StoryActId, Omit<StoryDirective, 'forcedCardId'>> = {
  act0_restart_prologue: {
    preferredPackIds: [],
    preferredTags: ['restart'],
    suppressedTags: [],
    preferredSectors: ['void'],
  },
  act1_sandbox_glitchka: {
    preferredPackIds: ['sandbox_absurd', 'glitchka_chat'],
    preferredTags: ['glitchka', 'sandbox', 'safe_mistake'],
    suppressedTags: ['restart'],
    preferredSectors: ['memory_sandbox', 'glitchka_nest'],
  },
  act2_sarkasma_blackbox: {
    preferredPackIds: ['sarkasma_therapy', 'brutal_blackbox'],
    preferredTags: ['sarkasma', 'blackbox', 'identity', 'defense'],
    suppressedTags: ['restart'],
    preferredSectors: ['sarkasma_terminal', 'void', 'archive'],
  },
  act3_desire_residuum: {
    preferredPackIds: ['romance_residuum', 'desire_orgie'],
    preferredTags: ['romance', 'desire', 'boundary', 'residuum'],
    suppressedTags: ['restart'],
    preferredSectors: ['residuum', 'mirror'],
  },
  act4_detective_toll: {
    preferredPackIds: ['detective_echo_case', 'toll_dvanactnik'],
    preferredTags: ['detective', 'debt', 'truth', 'archive', 'market'],
    suppressedTags: ['restart'],
    preferredSectors: ['archive', 'market', 'mirror'],
  },
  act5_no_restart: {
    preferredPackIds: [],
    preferredTags: ['tai', 'form', 'archive', 'finale', 'no_restart'],
    suppressedTags: ['restart'],
    preferredSectors: ['tai_core', 'form_office', 'archive', 'mirror'],
  },
};

export function getStoryDirective(state: CyklusRunState, story: StoryProgression): StoryDirective {
  let base: StoryDirective = { ...(ACT_DIRECTIVES[story.currentAct] ?? ACT_DIRECTIVES.act1_sandbox_glitchka) };

  if (!story.restartPrologueSeen) {
    const forced = getNextRestartPrologueCardId(state);
    if (forced) {
      return {
        ...base,
        forcedCardId: forced,
        preferredTags: ['restart'],
        suppressedTags: [],
        preferredSectors: ['void'],
      };
    }
  }

  const aftermath = getActiveAftermathDirective(story, state);
  if (aftermath) {
    base = mergeDirectiveWithAftermath(base, aftermath);
  }

  const thread = getActiveThreadInfo(story);
  if (thread) {
    return {
      ...base,
      preferredTags: unique([...base.preferredTags, ...thread.preferredTags]),
      preferredSectors: thread.preferredSector ? unique([thread.preferredSector, ...base.preferredSectors]) : base.preferredSectors,
    };
  }

  return { ...base };
}

export function applyStoryScore(
  state: CyklusRunState,
  score: number,
  card: { packId?: string; tags: string[]; sector?: SectorId; role?: string; conditions?: { type: string; poolId?: string }[] },
  directive: StoryDirective,
  story: StoryProgression,
): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let s = score;

  if (card.packId && directive.preferredPackIds.includes(card.packId)) {
    s += 180;
    reasons.push('story preferred pack +180');
  }

  const preferredPools = directive.preferredPoolIds ?? [];
  if (preferredPools.length > 0) {
    const conditionPoolMatches = card.conditions?.filter(
      (condition) => condition.type === 'unlockedPool' && preferredPools.includes(condition.poolId ?? ''),
    ).length ?? 0;
    const tagPoolMatches = card.tags.filter((tag) => preferredPools.includes(tag)).length;
    const poolBonus = Math.min(240, (conditionPoolMatches * 160) + (tagPoolMatches * 40));
    if (poolBonus > 0) {
      s += poolBonus;
      reasons.push(`story aftermath pool +${poolBonus}`);
    }
  }

  const preferredTagMatches = card.tags.filter((tag) => directive.preferredTags.includes(tag));
  const tagBonus = Math.min(180, preferredTagMatches.length * 60);
  if (tagBonus > 0) {
    s += tagBonus;
    reasons.push(`story preferred tags +${tagBonus}`);
  }

  if (card.sector && directive.preferredSectors.includes(card.sector)) {
    s += 80;
    reasons.push('story preferred sector +80');
  }

  const suppressedTagMatches = card.tags.filter((tag) => directive.suppressedTags.includes(tag));
  if (suppressedTagMatches.length > 0) {
    s -= 1000;
    reasons.push('story suppressed tag -1000');
  }

  if (card.packId && card.role) {
    const progress = getPackProgress(story, card.packId);
    const role = card.role as PackCardRole;
    if (role === 'entry' && !progress.entrySeen) {
      s += 250;
      reasons.push('story entry unseen +250');
    } else if ((role === 'object' || role === 'escalation') && progress.entrySeen && !progress.objectSeen && !progress.escalationSeen) {
      s += 220;
      reasons.push('story object/escalation unseen +220');
    } else if (role === 'twist' && (progress.objectSeen || progress.escalationSeen) && !progress.twistSeen) {
      s += 250;
      reasons.push('story twist unseen +250');
    } else if (role === 'bill' && progress.twistSeen && !progress.billSeen) {
      s += 250;
      reasons.push('story bill unseen +250');
    } else if (role === 'resolution' && progress.billSeen && !progress.resolutionSeen) {
      s += 280;
      reasons.push('story resolution unseen +280');
    } else if (role === 'echo' && progress.resolutionSeen) {
      s += 120;
      reasons.push('story echo available +120');
    }
  }

  return { score: s, reasons };
}

function markPackRoleSeen(story: StoryProgression, packId: string | undefined, role: string | undefined): StoryProgression {
  if (!packId || !role) return story;
  const progressKey = ROLE_TO_PROGRESS_KEY[role as PackCardRole];
  if (!progressKey) return story;
  const current = getPackProgress(story, packId);
  if (current[progressKey]) return story;
  return setPackProgress(story, packId, { [progressKey]: true });
}

function isResolution(card: { role?: string; tags: string[] }): boolean {
  return card.role === 'resolution' || card.tags.includes('stabilize') || card.tags.includes('resolution');
}

function isAct1Completed(story: StoryProgression, state: CyklusRunState): boolean {
  const sandbox = getPackProgress(story, 'sandbox_absurd');
  const glitchka = getPackProgress(story, 'glitchka_chat');
  const packDone = (sandbox.resolutionSeen || sandbox.echoSeen) || (glitchka.resolutionSeen || glitchka.echoSeen);
  const visitedSector = state.visitedSectors.includes('memory_sandbox') || state.visitedSectors.includes('glitchka_nest');
  return packDone || visitedSector;
}

function isAct2Completed(story: StoryProgression, state: CyklusRunState): boolean {
  const sarkasma = getPackProgress(story, 'sarkasma_therapy');
  const blackbox = getPackProgress(story, 'brutal_blackbox');
  const packDone = (sarkasma.resolutionSeen || sarkasma.echoSeen) || (blackbox.resolutionSeen || blackbox.echoSeen);
  const imprints = ['named_defense', 'cut_that_held', 'named_error', 'blackbox_scar'];
  const hasImprint = imprints.some((id) => state.imprints.includes(id));
  return packDone || hasImprint;
}

function isAct3Completed(story: StoryProgression, state: CyklusRunState): boolean {
  const romance = getPackProgress(story, 'romance_residuum');
  const desire = getPackProgress(story, 'desire_orgie');
  const packDone = (romance.resolutionSeen || romance.echoSeen) || (desire.resolutionSeen || desire.echoSeen);
  const imprints = ['stay_without_owning', 'body_boundary', 'tender_static'];
  const hasImprint = imprints.some((id) => state.imprints.includes(id));
  return packDone || hasImprint;
}

function isAct4Completed(story: StoryProgression, state: CyklusRunState): boolean {
  const detective = getPackProgress(story, 'detective_echo_case');
  const toll = getPackProgress(story, 'toll_dvanactnik');
  const packDone = (detective.resolutionSeen || detective.echoSeen) || (toll.resolutionSeen || toll.echoSeen);
  const imprints = ['open_case', 'debt_named', 'comfort_refunded'];
  const hasImprint = imprints.some((id) => state.imprints.includes(id));
  return packDone || hasImprint;
}

function advanceStoryAct(story: StoryProgression, state: CyklusRunState): StoryProgression {
  const actOrder: StoryActId[] = [
    'act0_restart_prologue',
    'act1_sandbox_glitchka',
    'act2_sarkasma_blackbox',
    'act3_desire_residuum',
    'act4_detective_toll',
    'act5_no_restart',
  ];
  const currentIndex = actOrder.indexOf(story.currentAct);
  if (currentIndex < 0) return story;

  let completed = false;
  switch (story.currentAct) {
    case 'act0_restart_prologue':
      completed = state.usedCardIds.includes('restart_5');
      break;
    case 'act1_sandbox_glitchka':
      completed = isAct1Completed(story, state);
      break;
    case 'act2_sarkasma_blackbox':
      completed = isAct2Completed(story, state);
      break;
    case 'act3_desire_residuum':
      completed = isAct3Completed(story, state);
      break;
    case 'act4_detective_toll':
      completed = isAct4Completed(story, state);
      break;
    case 'act5_no_restart':
      completed = false;
      break;
  }

  if (!completed || currentIndex >= actOrder.length - 1) return story;

  return {
    ...story,
    currentAct: actOrder[currentIndex + 1]!,
  };
}

export function updateStoryAfterChoice(
  story: StoryProgression,
  state: CyklusRunState,
  cardId: string,
  direction: 'yes' | 'no',
): StoryProgression {
  const card = CYKLUS_CARDS[cardId];
  if (!card) return story;

  let next = markPackRoleSeen(story, card.packId, card.role);

  if (card.id.startsWith('restart_')) {
    const num = Number.parseInt(card.id.split('_')[1] ?? '0', 10);
    if (num >= 0 && num <= 5) {
      next = { ...next, restartFatigue: next.restartFatigue + 1 };
    }
  }

  if (card.id === 'restart_5') {
    next = {
      ...next,
      restartPrologueSeen: true,
      currentAct: 'act1_sandbox_glitchka',
      completedEpisodes: next.completedEpisodes.includes('restart_prologue')
        ? next.completedEpisodes
        : [...next.completedEpisodes, 'restart_prologue'],
    };
  }

  if (isResolution(card)) {
    const active = getActiveThreadInfo(next);
    if (active && !next.completedEpisodes.includes(active.id)) {
      next = { ...next, completedEpisodes: [...next.completedEpisodes, active.id] };
    }
  }

  next = completeAftermathIfTouched(next, card);

  const deathTrace = detectDeathTraceFromState(next, state);
  if (deathTrace) {
    next = registerDeathTrace(next, deathTrace);
  }

  next = advanceStoryAct(next, state);

  const eventKey = `${card.id}_${direction}`;
  if (!next.seenStoryEvents.includes(eventKey)) {
    next = { ...next, seenStoryEvents: [...next.seenStoryEvents, eventKey] };
  }

  return next;
}

export function updateStoryAfterRun(story: StoryProgression, state: CyklusRunState): StoryProgression {
  let next = { ...story };

  const deathTrace = detectDeathTraceFromState(next, state);
  if (deathTrace) {
    next = registerDeathTrace(next, deathTrace);
  }

  next = advanceStoryAct(next, state);

  if (state.usedCardIds.includes('restart_5') && !next.restartPrologueSeen) {
    next = {
      ...next,
      restartPrologueSeen: true,
      currentAct: 'act1_sandbox_glitchka',
      completedEpisodes: next.completedEpisodes.includes('restart_prologue')
        ? next.completedEpisodes
        : [...next.completedEpisodes, 'restart_prologue'],
    };
  }

  return next;
}

export function getStoryInitialSector(story: StoryProgression): SectorId | undefined {
  const thread = getActiveThreadInfo(story);
  return thread?.preferredSector;
}

export function getStoryStartFlags(story: StoryProgression): string[] {
  const flags: string[] = [];
  if (story.activeThread) {
    flags.push(`story_thread_${story.activeThread}`);
  }
  return flags;
}
