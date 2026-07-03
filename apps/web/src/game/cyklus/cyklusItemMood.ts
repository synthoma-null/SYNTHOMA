import type { CyklusRunState } from './cyklusTypes';
import { CYKLUS_ITEMS } from './cyklusItems';

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type ItemMood = 'quiet' | 'warm' | 'watching' | 'ready' | 'angry' | 'asleep' | 'unstable';

export interface ItemWithMood {
  id: string;
  title: string;
  mood: ItemMood;
  moodText: string;
}

// ── MOOD RULES ────────────────────────────────────────────────────────────────

const ITEM_MOOD_OVERRIDES: Record<string, (state: CyklusRunState) => ItemMood | null> = {
  rubber_seal: (s) => {
    if (s.flags.includes('rubber_seal_saved')) return 'asleep';
    if (s.flags.includes('rubber_seal_ready')) return 'ready';
    return 'quiet';
  },
  acid_filter: (s) => {
    if (s.flags.includes('acid_filter_used')) return 'asleep';
    if (s.flags.includes('acid_filter_ready')) return 'ready';
    if (s.stats.energy > 75) return 'watching';
    return 'quiet';
  },
  archive_key: (s) => {
    if (s.sector === 'archive') return 'warm';
    if (s.scheduledCards.some((sc) => sc.cardId.includes('archive_key'))) return 'unstable';
    return 'watching';
  },
  rubber_stamp: (s) => {
    if (s.flags.includes('rubber_stamp_used')) return 'asleep';
    if (s.flags.includes('rubber_stamp_ready')) {
      return s.sector === 'form_office' ? 'ready' : 'warm';
    }
    return 'quiet';
  },
  mirror_shard: (s) => {
    if (s.sector === 'mirror') return 'unstable';
    if (s.stats.memory > 70) return 'watching';
    return 'quiet';
  },
  noise_clump: (s) => {
    if (s.flags.includes('noise_pet_awake')) {
      if (s.stats.energy > 80) return 'angry';
      if (s.scheduledCards.some((sc) => sc.cardId.includes('noise_pet'))) return 'unstable';
      return 'warm';
    }
    return 'asleep';
  },
  black_folder: (s) => {
    if (s.stats.memory > 75) return 'unstable';
    if (s.flags.includes('black_folder_active')) return 'watching';
    return 'quiet';
  },
  soft_bug: (s) => {
    if (s.scheduledCards.some((sc) => sc.cardId === 'soft_bug_grows')) return 'unstable';
    if (s.stats.bond < 30) return 'angry';
    return 'asleep';
  },
  rusty_token: (s) => {
    if (s.flags.includes('token_warm')) return 'warm';
    if (s.sector === 'market') return 'watching';
    return 'quiet';
  },
  glitch_pebble: (s) => {
    if (s.sector === 'glitchka_nest') return 'unstable';
    if (s.stats.control < 30) return 'angry';
    return 'warm';
  },
  ownerless_shadow: (s) => {
    if (s.stats.control < 25) return 'unstable';
    if ((s.entityRelations.shadow ?? 0) > 2) return 'watching';
    return 'quiet';
  },
  sarkasma_receipt: (s) => {
    if (s.scheduledCards.some((sc) => sc.cardId === 'sarkasma_account')) return 'angry';
    if ((s.entityRelations.sarkasma ?? 0) < -1) return 'watching';
    return 'quiet';
  },
  cult_badge: (s) => {
    if (s.sector === 'acid_yellow') return 'warm';
    if (s.flags.includes('cult_badge_active') && s.stats.energy > 70) return 'unstable';
    return 'quiet';
  },
  memory_beast_mark: (s) => {
    if (s.scheduledCards.some((sc) => sc.cardId === 'memory_beast_returns')) return 'watching';
    if (s.stats.memory > 80) return 'unstable';
    return 'quiet';
  },
};

const MOOD_TEXTS: Record<ItemMood, Record<string, string[]>> = {
  quiet: {
    default: ['Leží potichu.', 'Nic nechce.', 'Čeká, až na něj zapomeneš.'],
  },
  warm: {
    rubber_seal: ['Tuleň je teplý. Tváří se spokojeně.'],
    archive_key: ['Klíč je teplý. Archiv je blízko.'],
    rusty_token: ['Žeton hřeje v kapse víc než obvykle.'],
    rubber_stamp: ['Razítko je připravené. Téměř nadšené.'],
    glitch_pebble: ['Kamínek bzučí. Glitchka by řekla, že je rád.'],
    cult_badge: ['Odznak září tlumeně. Někde hoří světla kultu.'],
    default: ['Je teplý.', 'Vyzařuje klid, který nechápeš.'],
  },
  watching: {
    archive_key: ['Klíč se otočil sám. Nezeptal se.'],
    mirror_shard: ['Střep odráží věci, které tu nejsou.'],
    ownerless_shadow: ['Stín sleduje něco za tebou.'],
    sarkasma_receipt: ['Účet tě eviduje. Čeká na správný moment.'],
    memory_beast_mark: ['Značka pulzuje. Šelma ví, kde jsi.'],
    default: ['Sleduje tě.', 'Eviduje pohyby.', 'Nezevšedněl.'],
  },
  ready: {
    rubber_seal: ['Tuleň si odkašlal. Je připraven.'],
    acid_filter: ['Filtr je aktivní. Drží pozici.'],
    rubber_stamp: ['Razítko je připravené. Neboj se formulářů.'],
    default: ['Je připravený.', 'Čeká na správný okamžik.'],
  },
  angry: {
    noise_clump: ['Chomáč šumu hlasitě nesouhlasí.'],
    soft_bug: ['Chyba se vzbudila a není ráda.'],
    glitch_pebble: ['Kamínek se třepe. Není spokojený s kontrolou.'],
    sarkasma_receipt: ['Účet žádá splacení. Nahlas.'],
    default: ['Není spokojený.', 'Vibruje nespokojeností.'],
  },
  asleep: {
    rubber_seal: ['Tuleň zachránil. Teď spí. Zaslouží si to.'],
    acid_filter: ['Filtr byl použit. Odpočívá.'],
    soft_bug: ['Chyba spí. Až příliš disciplinovaně.'],
    default: ['Spí.', 'Zaslouží si klid.', 'Nevyrušuj ho.'],
  },
  unstable: {
    noise_clump: ['Chomáč šumu přetéká přes okraje.'],
    black_folder: ['Složka dýchá rychleji.'],
    mirror_shard: ['Střep ukazuje příliš mnoho najednou.'],
    archive_key: ['Klíč se snaží otevřít dveře, které tu nejsou.'],
    soft_bug: ['Chyba roste. Ještě pomalu.'],
    ownerless_shadow: ['Stín se vymyká tvaru. Nesedí správně.'],
    memory_beast_mark: ['Značka pulzuje silně. Šelma se blíží.'],
    default: ['Chová se nestandardně.', 'Něco ho ruší.', 'Nestabilní.'],
  },
};

function pickMoodText(mood: ItemMood, itemId: string, step: number): string {
  const pool = MOOD_TEXTS[mood][itemId] ?? MOOD_TEXTS[mood].default ?? ['...'];
  return pool[step % pool.length] ?? pool[0] ?? '...';
}

// ── PUBLIC API ─────────────────────────────────────────────────────────────────

export function getItemMood(state: CyklusRunState, itemId: string): ItemMood {
  const override = ITEM_MOOD_OVERRIDES[itemId];
  if (override) {
    const result = override(state);
    if (result) return result;
  }
  if (state.scheduledCards.some((sc) => sc.cardId.includes(itemId))) return 'watching';
  return 'quiet';
}

export function getPocketItems(state: CyklusRunState): ItemWithMood[] {
  return state.inventory.map((id, idx) => {
    const item = CYKLUS_ITEMS[id];
    const mood = getItemMood(state, id);
    const moodText = pickMoodText(mood, id, state.totalChoices + idx);
    return {
      id,
      title: item?.title ?? id,
      mood,
      moodText,
    };
  });
}

export const MOOD_PRIORITY: Record<ItemMood, number> = {
  unstable: 6,
  angry: 5,
  ready: 4,
  watching: 3,
  warm: 2,
  asleep: 1,
  quiet: 0,
};

export function getPrimaryMoodItem(state: CyklusRunState): { id: string; mood: ItemMood } | null {
  if (state.inventory.length === 0) return null;
  let top: { id: string; mood: ItemMood } | null = null;
  for (const id of state.inventory) {
    const mood = getItemMood(state, id);
    if (!top || MOOD_PRIORITY[mood] > MOOD_PRIORITY[top.mood]) top = { id, mood };
  }
  return top;
}

export function getPocketAmbientText(state: CyklusRunState): string | null {
  if (state.inventory.length === 0) return null;
  const primary = getPrimaryMoodItem(state);
  if (!primary) return null;
  const item = CYKLUS_ITEMS[primary.id];
  if (!item) return null;
  if (primary.mood === 'unstable') {
    const count = state.inventory.filter((id) => getItemMood(state, id) === 'unstable').length;
    if (count >= 2) return 'Kapsa se chová nesouhlasně s fyzikálními zákony.';
    return `${item.title} bzučí hlasitěji než před chvílí.`;
  }
  if (primary.mood === 'angry') return `${item.title} nesouhlasí s aktuální situací. Dost hlasitě.`;
  if (primary.mood === 'ready') {
    if (primary.id === 'rubber_seal' && state.scheduledCards.some((sc) => sc.cardId.includes('seal'))) {
      return 'Tuleň si odkašlal. Systém zaznamenal nárůst hrdosti v místnosti.';
    }
    return `${item.title} je připraven.`;
  }
  if (primary.mood === 'watching') {
    const count = state.inventory.filter((id) => getItemMood(state, id) === 'watching').length;
    if (count >= 2) return 'Kapsa tě eviduje z více úhlů.';
    return `${item.title} sleduje situaci.`;
  }
  if (primary.mood === 'warm') {
    if (primary.id === 'archive_key') return 'Klíč se zahřál. Archiv ví, že jsi blízko.';
    if (primary.id === 'glitch_pebble') return 'Kamínek je teplý. To je buď útěšné, nebo znepokojivé.';
    return `${item.title} je teplý. Ne dost, aby pálil. Dost, aby lhal o své neškodnosti.`;
  }
  if (primary.mood === 'asleep') {
    if (primary.id === 'rubber_seal') return 'Tuleň spí. Po takovém zásahu si to zaslouží.';
    if (primary.id === 'soft_bug') return 'Chyba spí. Tváří se příliš klidně na něco, co má slovo chyba v názvu.';
    return `${item.title} spí. Což by bylo uklidňující, kdyby předměty běžně spaly.`;
  }
  return null;
}

export const MOOD_LABELS: Record<ItemMood, string> = {
  quiet: 'tiché',
  warm: 'teplé',
  watching: 'sleduje',
  ready: 'připraveno',
  angry: 'nesouhlasí',
  asleep: 'spí',
  unstable: 'nestabilní',
};
