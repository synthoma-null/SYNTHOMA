import type { CyklusRunState, SwipeCard, StatKey } from './cyklusTypes';
import { CYKLUS_ITEMS } from './content';

// ── TYPES ─────────────────────────────────────────────────────────────────────

export type ItemMood = 'quiet' | 'warm' | 'watching' | 'ready' | 'angry' | 'asleep' | 'unstable';

export interface ItemWithMood {
  id: string;
  title: string;
  mood: ItemMood;
  moodText: string;
  resonanceTags: string[];
}

export interface PocketMoodProfile {
  primary: { id: string; mood: ItemMood } | null;
  counts: Record<ItemMood, number>;
  resonanceTags: string[];
  unstableCount: number;
  angryCount: number;
  readyCount: number;
  watchingCount: number;
  ambientText: string | null;
}

export interface ItemMoodScoreBreakdown {
  score: number;
  reasons: string[];
}

// ── MOOD RULES ────────────────────────────────────────────────────────────────

function hasScheduledLike(state: CyklusRunState, needle: string): boolean {
  return state.scheduledCards.some((sc) => sc.cardId.includes(needle));
}

function hasAnyFlag(state: CyklusRunState, flags: string[]): boolean {
  return flags.some((flag) => state.flags.includes(flag));
}

const ITEM_MOOD_OVERRIDES: Record<string, (state: CyklusRunState) => ItemMood | null> = {
  rubber_seal: (s) => {
    if (s.flags.includes('rubber_seal_saved')) return 'asleep';
    if (s.flags.includes('rubber_seal_ready')) return s.stats.bond < 20 || s.stats.bond > 85 ? 'unstable' : 'ready';
    if (s.sector === 'form_office') return 'watching';
    return 'quiet';
  },
  acid_filter: (s) => {
    if (s.flags.includes('acid_filter_used')) return 'asleep';
    if (s.stats.energy > 88) return 'unstable';
    if (s.flags.includes('acid_filter_ready')) return s.stats.energy > 75 ? 'watching' : 'ready';
    if (s.sector === 'acid_yellow') return 'warm';
    return 'quiet';
  },
  archive_key: (s) => {
    if (hasScheduledLike(s, 'archive_key')) return 'unstable';
    if (s.sector === 'archive') return s.stats.memory > 80 ? 'watching' : 'warm';
    if (s.sector === 'form_office') return 'angry';
    return 'watching';
  },
  wrong_map: (s) => {
    if (s.sector === 'glitchka_nest' || s.sector === 'memory_sandbox') return 'warm';
    if (s.sector === 'residuum' || s.flags.includes('wrong_name_returns')) return 'unstable';
    if (s.stats.control < 35) return 'angry';
    return 'watching';
  },
  blank_form: (s) => {
    if (s.sector === 'form_office') return 'ready';
    if (s.stats.control > 82 || s.flags.includes('form_office_unlocked')) return 'watching';
    if (s.stats.bond < 25) return 'angry';
    return 'quiet';
  },
  rubber_stamp: (s) => {
    if (s.flags.includes('rubber_stamp_used')) return 'asleep';
    if (s.flags.includes('rubber_stamp_ready')) return s.sector === 'form_office' ? 'ready' : 'warm';
    return 'quiet';
  },
  mirror_shard: (s) => {
    if (s.sector === 'mirror') return 'unstable';
    if (s.stats.memory > 80 || s.stats.bond > 85) return 'watching';
    if (hasScheduledLike(s, 'mirror')) return 'unstable';
    return 'quiet';
  },
  childhood_spade: (s) => {
    if (s.sector === 'memory_sandbox') return 'warm';
    if (s.flags.includes('childhood_anchor_active')) return 'ready';
    if (s.stats.memory < 25) return 'watching';
    return 'quiet';
  },
  noise_clump: (s) => {
    if (!s.flags.includes('noise_pet_awake')) return 'asleep';
    if (s.stats.energy > 82 || hasScheduledLike(s, 'noise_pet')) return 'unstable';
    if (s.stats.control < 30) return 'angry';
    return 'warm';
  },
  black_folder: (s) => {
    if (s.stats.memory > 85 || s.flags.includes('forbidden_archive_opened')) return 'unstable';
    if (s.flags.includes('black_folder_active')) return 'watching';
    if (s.sector === 'archive') return 'warm';
    return 'quiet';
  },
  soft_bug: (s) => {
    if (hasScheduledLike(s, 'soft_bug')) return 'unstable';
    if (s.stats.bond < 25) return 'angry';
    if (s.sector === 'glitchka_nest') return 'warm';
    if (s.flags.includes('safe_mistake_active')) return 'ready';
    return 'asleep';
  },
  named_soft_bug: (s) => {
    if (s.stats.bond > 82) return 'unstable';
    if (s.sector === 'glitchka_nest') return 'warm';
    if (s.stats.control < 35) return 'angry';
    return 'watching';
  },
  rusty_token: (s) => {
    if (s.flags.includes('token_warm')) return 'warm';
    if (s.sector === 'market') return 'watching';
    if (hasAnyFlag(s, ['heard_token_direction', 'late_fee_deferred', 'unpaid_exit_active'])) return 'unstable';
    return 'quiet';
  },
  warm_token: (s) => {
    if (s.sector === 'market') return 'ready';
    if (hasScheduledLike(s, 'token')) return 'watching';
    if (s.stats.energy > 80) return 'unstable';
    return 'warm';
  },
  named_token: (s) => {
    if (s.flags.includes('wrong_name_returns')) return 'unstable';
    if (s.sector === 'market' || s.sector === 'residuum') return 'watching';
    return 'warm';
  },
  spent_token: (s) => {
    if (s.sector === 'market') return 'angry';
    if (s.stats.memory < 25) return 'watching';
    return 'quiet';
  },
  market_coin: (s) => {
    if (s.sector === 'market') return 'ready';
    if (s.flags.includes('late_fee_deferred') || s.flags.includes('paid_with_fake_memory')) return 'watching';
    return 'quiet';
  },
  glitch_pebble: (s) => {
    if (s.sector === 'glitchka_nest') return 'unstable';
    if (s.stats.control < 30) return 'angry';
    if (s.sector === 'memory_sandbox') return 'warm';
    return 'warm';
  },
  cult_badge: (s) => {
    if (s.sector === 'acid_yellow') return 'warm';
    if (s.flags.includes('cult_badge_active') && s.stats.energy > 70) return 'unstable';
    return 'quiet';
  },
  ownerless_shadow: (s) => {
    if (s.stats.control < 25) return 'unstable';
    if ((s.entityRelations.shadow ?? 0) > 2 || s.sector === 'mirror') return 'watching';
    if (s.stats.bond < 25) return 'angry';
    return 'quiet';
  },
  sarkasma_receipt: (s) => {
    if (hasScheduledLike(s, 'sarkasma_account') || hasScheduledLike(s, 'sarkasma_collects')) return 'angry';
    if ((s.entityRelations.sarkasma ?? 0) < -1 || s.flags.includes('sarkasma_debt_active')) return 'watching';
    if (s.sector === 'sarkasma_terminal') return 'warm';
    return 'quiet';
  },
  memory_beast_mark: (s) => {
    if (hasScheduledLike(s, 'memory_beast_returns')) return 'watching';
    if (s.stats.memory > 80 || s.sector === 'residuum') return 'unstable';
    if (s.sector === 'archive') return 'warm';
    return 'quiet';
  },
  returned_no: (s) => {
    if (s.sector === 'market') return 'ready';
    if (s.stats.bond > 82) return 'unstable';
    if (s.stats.control < 35) return 'angry';
    return 'warm';
  },
  calibration_receipt: (s) => {
    if (s.sector === 'tai_core' || s.sector === 'form_office') return 'watching';
    if (s.stats.control > 85) return 'unstable';
    return 'quiet';
  },
};

const MOOD_TEXTS: Record<ItemMood, Record<string, string[]>> = {
  quiet: {
    spent_token: ['Utržený žeton leží bez významu. Což mu překvapivě nebrání být nepříjemný.'],
    blank_form: ['Formulář mlčí. To je u formulářů nejnebezpečnější fáze.'],
    default: ['Leží potichu.', 'Nic nechce.', 'Čeká, až na něj zapomeneš.'],
  },
  warm: {
    rubber_seal: ['Tuleň je teplý. Tváří se spokojeně.'],
    archive_key: ['Klíč je teplý. Archiv je blízko.'],
    rusty_token: ['Žeton hřeje v kapse víc než obvykle.'],
    warm_token: ['Teplý žeton si užívá, že jeho název konečně nelže.'],
    named_token: ['Pojmenovaný žeton se drží při vědomí vlastním jménem. Nepříjemně sebejisté.'],
    rubber_stamp: ['Razítko je připravené. Téměř nadšené.'],
    wrong_map: ['Mapa se ohřívá v místě, kde by logika raději nebyla.'],
    childhood_spade: ['Lopatka voní pískem, který si pamatuje malé bezpečné chyby.'],
    glitch_pebble: ['Kamínek bzučí. Glitchka by řekla, že je rád.'],
    cult_badge: ['Odznak září tlumeně. Někde hoří světla kultu.'],
    soft_bug: ['Chyba je měkká a spokojená. To je objektivně podezřelé.'],
    returned_no: ['Vrácené ne hřeje. Hranice konečně stojí rovně.'],
    default: ['Je teplý.', 'Vyzařuje klid, který nechápeš.'],
  },
  watching: {
    archive_key: ['Klíč se otočil sám. Nezeptal se.'],
    mirror_shard: ['Střep odráží věci, které tu nejsou.'],
    blank_form: ['Formulář sleduje prázdné kolonky. Některé vypadají jako past.'],
    ownerless_shadow: ['Stín sleduje něco za tebou.'],
    sarkasma_receipt: ['Účet tě eviduje. Čeká na správný moment.'],
    memory_beast_mark: ['Značka pulzuje. Šelma ví, kde jsi.'],
    calibration_receipt: ['Potvrzení si kontroluje, jestli pořád odpovídáš normě. Drzost s hlavičkou.'],
    named_soft_bug: ['Pojmenovaná chyba tě sleduje jako domácí zvíře, které ví příliš mnoho.'],
    market_coin: ['Mince počítá možnosti. Některé z nich jsi ty.'],
    default: ['Sleduje tě.', 'Eviduje pohyby.', 'Nezevšedněl.'],
  },
  ready: {
    rubber_seal: ['Tuleň si odkašlal. Je připraven.'],
    acid_filter: ['Filtr je aktivní. Drží pozici.'],
    rubber_stamp: ['Razítko je připravené. Neboj se formulářů. Aspoň ne těchto.'],
    blank_form: ['Formulář čeká na podpis. To není výzva, to je hrozba s linkami.'],
    market_coin: ['Mince je připravená zaplatit. Bohužel nevíš přesně čím.'],
    returned_no: ['Vrácené ne stojí v kapse jako malý bodyguard hranic.'],
    default: ['Je připravený.', 'Čeká na správný okamžik.'],
  },
  angry: {
    noise_clump: ['Chomáč šumu hlasitě nesouhlasí.'],
    soft_bug: ['Chyba se vzbudila a není ráda.'],
    named_soft_bug: ['Pojmenovaná chyba bere svoje jméno osobně. V tom je problém.'],
    glitch_pebble: ['Kamínek se třepe. Není spokojený s kontrolou.'],
    sarkasma_receipt: ['Účet žádá splacení. Nahlas.'],
    ownerless_shadow: ['Stín se urazil. Což je elegantní způsob, jak říct: máš problém u nohou.'],
    archive_key: ['Klíč odmítá úřední nábytek. Konečně někdo rozumný.'],
    spent_token: ['Utržený žeton ti vyčítá, že už nic neznamená. Drama kovového kolečka.'],
    returned_no: ['Vrácené ne drží pozici, ale tváří se, že ho zneužíváš.'],
    default: ['Není spokojený.', 'Vibruje nespokojeností.'],
  },
  asleep: {
    rubber_seal: ['Tuleň zachránil. Teď spí. Zaslouží si to.'],
    acid_filter: ['Filtr byl použit. Odpočívá.'],
    soft_bug: ['Chyba spí. Až příliš disciplinovaně.'],
    noise_clump: ['Chomáč šumu chrní jako statická televize po pohádce.'],
    default: ['Spí.', 'Zaslouží si klid.', 'Nevyrušuj ho.'],
  },
  unstable: {
    noise_clump: ['Chomáč šumu přetéká přes okraje.'],
    black_folder: ['Složka dýchá rychleji.'],
    mirror_shard: ['Střep ukazuje příliš mnoho najednou.'],
    archive_key: ['Klíč se snaží otevřít dveře, které tu nejsou.'],
    wrong_map: ['Mapa mění sever podle toho, čeho se bojíš. Velmi praktické, pokud nenávidíš přežití.'],
    blank_form: ['Formulář začal generovat kolonky bez otázky. Administrativní plíseň.'],
    soft_bug: ['Chyba roste. Ještě pomalu.'],
    named_soft_bug: ['Pojmenovaná chyba se učí odpovídat na oslovení. To je horší, než to zní.'],
    ownerless_shadow: ['Stín se vymyká tvaru. Nesedí správně.'],
    memory_beast_mark: ['Značka pulzuje silně. Šelma se blíží.'],
    returned_no: ['Vrácené ne se ostří. Hranice má špatnou náladu.'],
    calibration_receipt: ['Potvrzení je až příliš čisté. Kontrola začíná krystalizovat.'],
    default: ['Chová se nestandardně.', 'Něco ho ruší.', 'Nestabilní.'],
  },
};

function pickMoodText(mood: ItemMood, itemId: string, step: number): string {
  const pool = MOOD_TEXTS[mood][itemId] ?? MOOD_TEXTS[mood].default ?? ['...'];
  return pool[step % pool.length] ?? pool[0] ?? '...';
}

function getItemResonanceTags(itemId: string): string[] {
  const item = CYKLUS_ITEMS[itemId];
  if (!item) return [itemId];
  return [...new Set([itemId, ...item.tags, ...(item.resonance?.aliases ?? []), ...(item.resonance?.poolIds ?? [])])];
}

function cardWouldIncreaseStat(card: SwipeCard, stat: StatKey): boolean {
  return [...card.yes.effects, ...card.no.effects].some((e) => e.type === 'stat' && e.key === stat && e.amount > 0);
}

function cardWouldDecreaseStat(card: SwipeCard, stat: StatKey): boolean {
  return [...card.yes.effects, ...card.no.effects].some((e) => e.type === 'stat' && e.key === stat && e.amount < 0);
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
      resonanceTags: getItemResonanceTags(id),
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

export function getPocketMoodProfile(state: CyklusRunState): PocketMoodProfile {
  const counts: Record<ItemMood, number> = {
    quiet: 0,
    warm: 0,
    watching: 0,
    ready: 0,
    angry: 0,
    asleep: 0,
    unstable: 0,
  };
  const tags: string[] = [];
  for (const id of state.inventory) {
    const mood = getItemMood(state, id);
    counts[mood] += 1;
    tags.push(...getItemResonanceTags(id));
  }
  return {
    primary: getPrimaryMoodItem(state),
    counts,
    resonanceTags: [...new Set(tags)],
    unstableCount: counts.unstable,
    angryCount: counts.angry,
    readyCount: counts.ready,
    watchingCount: counts.watching,
    ambientText: getPocketAmbientText(state),
  };
}

export function getPocketAmbientText(state: CyklusRunState): string | null {
  if (state.inventory.length === 0) return null;
  const primary = getPrimaryMoodItem(state);
  if (!primary) return null;
  const item = CYKLUS_ITEMS[primary.id];
  if (!item) return null;
  if (primary.mood === 'unstable') {
    const count = state.inventory.filter((id) => getItemMood(state, id) === 'unstable').length;
    if (count >= 3) return 'Kapsa zní jako malý incident s vlastní dramaturgií.';
    if (count >= 2) return 'Kapsa se chová nesouhlasně s fyzikálními zákony.';
    return `${item.title} bzučí hlasitěji než před chvílí.`;
  }
  if (primary.mood === 'angry') return `${item.title} nesouhlasí s aktuální situací. Dost hlasitě.`;
  if (primary.mood === 'ready') {
    if (primary.id === 'rubber_seal' && state.scheduledCards.some((sc) => sc.cardId.includes('seal'))) {
      return 'Tuleň si odkašlal. Systém zaznamenal nárůst hrdosti v místnosti.';
    }
    if (primary.id === 'returned_no') return 'Vrácené ne stojí v kapse jako malý bodyguard hranic.';
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
    if (primary.id === 'childhood_spade') return 'Lopatka je teplá. Pískoviště si tě pamatuje bez výsměchu, což je luxusní chyba.';
    return `${item.title} je teplý. Ne dost, aby pálil. Dost, aby lhal o své neškodnosti.`;
  }
  if (primary.mood === 'asleep') {
    if (primary.id === 'rubber_seal') return 'Tuleň spí. Po takovém zásahu si to zaslouží.';
    if (primary.id === 'soft_bug') return 'Chyba spí. Tváří se příliš klidně na něco, co má slovo chyba v názvu.';
    return `${item.title} spí. Což by bylo uklidňující, kdyby předměty běžně spaly.`;
  }
  return null;
}

const MOOD_SCORE: Record<ItemMood, number> = {
  unstable: 95,
  angry: 75,
  ready: 65,
  watching: 45,
  warm: 30,
  asleep: -20,
  quiet: 0,
};

export function explainItemMoodScore(state: CyklusRunState, card: SwipeCard): ItemMoodScoreBreakdown {
  if (state.inventory.length === 0) return { score: 0, reasons: [] };
  let score = 0;
  const reasons: string[] = [];

  for (const itemId of state.inventory) {
    const item = CYKLUS_ITEMS[itemId];
    if (!item) continue;
    const mood = getItemMood(state, itemId);
    const base = MOOD_SCORE[mood] ?? 0;
    const tags = getItemResonanceTags(itemId);
    const matchesTag = tags.some((tag) => card.tags.includes(tag));
    const matchesSector = !!card.sector && item.resonance?.favoriteSectors?.includes(card.sector);
    const matchesEntity = item.resonance?.entity && card.tags.includes(item.resonance.entity);
    const matchesPoolCondition = card.conditions?.some((condition) => condition.type === 'unlockedPool' && condition.poolId && item.resonance?.poolIds?.includes(condition.poolId));

    if (matchesTag || matchesSector || matchesEntity || matchesPoolCondition) {
      const bonus = base + (matchesSector ? 35 : 0) + (matchesEntity ? 25 : 0) + (matchesPoolCondition ? 35 : 0);
      if (bonus !== 0) {
        score += bonus;
        reasons.push(`${item.title} ${MOOD_LABELS[mood]} ${bonus > 0 ? '+' : ''}${bonus}`);
      }
    }

    if (mood === 'unstable' || mood === 'angry') {
      const destabilizes = item.resonance?.destabilizes ?? [];
      for (const stat of destabilizes) {
        if (cardWouldDecreaseStat(card, stat)) {
          score += 35;
          reasons.push(`${item.title} tlačí na ${stat} +35`);
        }
      }
    }

    if (mood === 'ready' || mood === 'warm') {
      const stabilizes = item.resonance?.stabilizes ?? [];
      for (const stat of stabilizes) {
        if (cardWouldIncreaseStat(card, stat) || cardWouldDecreaseStat(card, stat)) {
          score += 20;
          reasons.push(`${item.title} rezonuje se statem ${stat} +20`);
        }
      }
    }
  }

  const unstableCount = state.inventory.filter((id) => getItemMood(state, id) === 'unstable').length;
  if (unstableCount >= 2 && (card.category === 'item_trigger' || card.tags.includes('item_trigger') || card.tags.includes('glitch'))) {
    score += 90;
    reasons.push('kapsa nestabilní +90');
  }

  const readyCount = state.inventory.filter((id) => getItemMood(state, id) === 'ready').length;
  if (readyCount >= 2 && (card.tags.includes('system') || card.tags.includes('stabilize') || card.category === 'followup')) {
    score += 55;
    reasons.push('kapsa připravená +55');
  }

  const capped = Math.max(-80, Math.min(260, score));
  return { score: capped, reasons: reasons.slice(0, 4) };
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

export const MOOD_CSS_CLASS: Record<ItemMood, string> = {
  quiet: 'item-mood-quiet',
  warm: 'item-mood-warm',
  watching: 'item-mood-watching',
  ready: 'item-mood-ready',
  angry: 'item-mood-angry',
  asleep: 'item-mood-asleep',
  unstable: 'item-mood-unstable',
};

export function getItemMoodClassName(mood: ItemMood): string {
  return MOOD_CSS_CLASS[mood] ?? MOOD_CSS_CLASS.quiet;
}
