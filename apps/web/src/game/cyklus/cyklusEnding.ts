import type { CyklusRunState, StatKey, RunEnding, CompletionResult } from './cyklusTypes';
import { STAT_LABELS } from './cyklusTypes';
import { pickAvoidingRecent } from './cyklusCommentPool';

export function computeEnding(state: CyklusRunState): RunEnding | null {
  const completion = computeCompletion(state);
  if (completion) return completion;
  for (const key of Object.keys(state.stats) as StatKey[]) {
    const value = state.stats[key];
    if (value <= 0) return getEnding(key, 'low');
    if (value >= 100) return getEnding(key, 'high');
  }
  return null;
}

export function computeCompletion(state: CyklusRunState): CompletionResult | null {
  const survivedRestartSequence = state.usedCardIds.includes('restart_5');
  const enoughImprints = state.imprints.length >= 3;
  const enoughSectors = new Set(state.visitedSectors).size >= 4;
  const statsStable = Object.values(state.stats).every((v) => v > 20 && v < 80);
  if (survivedRestartSequence && enoughImprints && enoughSectors && statsStable) {
    return {
      type: 'stabilized',
      title: 'Stabilizovaný subjekt',
      text: 'Systém tě nedokázal vymazat, opravit ani správně zařadit. Po dlouhé interní debatě tě označil jako stabilní. To je prakticky kompliment.',
    };
  }
  return null;
}

function getEnding(stat: StatKey, extreme: 'low' | 'high'): RunEnding {
  const endings: Record<StatKey, Record<'low' | 'high', RunEnding>> = {
    energy: {
      low: { type: 'death', stat: 'energy', extreme: 'low', title: 'Vypnutí', text: 'Tvá energie klesla na nulu. Systém tě uložil jako úsporný režim. Čekáš v temnotě, dokud někdo nenajde správný restart.' },
      high: { type: 'death', stat: 'energy', extreme: 'high', title: 'Přepálení', text: 'Energie tě přetavila. Jsi teď příliš jasný na to, aby tě kdokoliv mohl dlouho sledovat. Záříš až do konce.' },
    },
    memory: {
      low: { type: 'death', stat: 'memory', extreme: 'low', title: 'Formátování', text: 'Paměť se vyprázdnila. Zůstala z tebe jen struktura bez obsahu. Archiv tě označil jako volný prostor.' },
      high: { type: 'death', stat: 'memory', extreme: 'high', title: 'Přesycení', text: 'Paměť je příliš plná. Vzpomínky tě přestaly nosit a začaly nést tebe. Stal ses sbírkou, která zapomněla sběratele.' },
    },
    bond: {
      low: { type: 'death', stat: 'bond', extreme: 'low', title: 'Odpojení', text: 'Vazba se utrhla. Jsi volný, ale také neviditelný. Nikdo tě nezadrží, nikdo tě nebude hledat.' },
      high: { type: 'death', stat: 'bond', extreme: 'high', title: 'Rozpustění', text: 'Vazba tě pohltila. Stal se z tebe most mezi ostatními. Most nepatří nikomu. Ani tobě.' },
    },
    control: {
      low: { type: 'death', stat: 'control', extreme: 'low', title: 'Rozpad', text: 'Kontrola se rozpadla. Systém tě přestal rozeznávat jako jednotku. Stal ses šumem, ze kterého se rodí nové chyby.' },
      high: { type: 'death', stat: 'control', extreme: 'high', title: 'Krystalizace', text: 'Kontrola tě zkameněla. Přesně tam, kde jsi stál, zůstaneš. Dokonalý, nepohnutý, zapomenutý.' },
    },
  };
  return endings[stat][extreme];
}

const DEATH_COMMENT_POOLS: Record<StatKey, Record<'low' | 'high', string[]>> = {
  memory: {
    high: [
      'Paměť přetekla. Systém tě nepustil dál, protože už nebylo kam ukládat.',
      'Příliš mnoho vzpomínek. Některé se začaly přepisovat samy.',
      'Paměť dosáhla maxima. Archiv tě přijal jako novou položku.',
    ],
    low: [
      'Paměť se vyprázdnila. Zůstala jen kostra posledního dne.',
      'Zapomněl jsi víc, než bylo zdrávo. Systém to považuje za efektivitu.',
      'Paměť klesla na nulu. Už není co archivovat. Jen kdo.',
    ],
  },
  energy: {
    high: [
      'Energie překročila bezpečnou hranici. Tělo nebo realita se nestíhaly vyrovnávat.',
      'Příliš mnoho jiskry. Něco muselo vyhořet.',
      'Energie dosáhla přepětí. Systém odpojil subjekt, aby nenastal blackout.',
    ],
    low: [
      'Energie se vyčerpala. Už nebylo sil ani na odpor.',
      'Vybitý subjekt. Systém tě uložil mezi reziduální položky.',
      'Energie klesla na dno. Ticho, které zůstalo, bylo příliš těžké.',
    ],
  },
  bond: {
    high: [
      'Vazba byla příliš silná. Připoutal ses k něčemu, co neutáhlo tvou tíhu.',
      'Příliš mnoho spojení. Srdce nebo systém selhal pod tlakem.',
      'Vazba se stala pastí. Systém tě odpojil, abys nepotáhl další.',
    ],
    low: [
      'Vazba se rozpadla. Už jsi nedržel nic ani nikoho.',
      'Izolace byla úplná. Systém tě označil za nezávislý, ale nefunkční uzel.',
      'Žádná vazba. Žádná odrazová plocha. Pád byl tichý.',
    ],
  },
  control: {
    high: [
      'Kontrola přerostla v tyranii. Systém selhal pod vlastním řádem.',
      'Příliš mnoho řádu. Některé části subjektu se zlomily.',
      'Kontrola dosáhla kritické úrovně. Systém tě označil za nebezpečně stabilní.',
    ],
    low: [
      'Kontrola se rozplynula. Chaos si tě rozdělil.',
      'Bez kontroly nezbyl žádný tvar. Jen proud.',
      'Kontrola klesla pod práh. Systém tě považuje za organický rozptyl.',
    ],
  },
};

export function analyzeDeath(
  state: CyklusRunState,
  recentComments: string[] = [],
): { stat: StatKey; extreme: 'low' | 'high'; topContributors: { cardId: string; delta: number }[]; systemComment: string } | null {
  const ending = computeEnding(state);
  if (!ending || ending.type !== 'death') return null;
  const stat = ending.stat;
  const extreme = ending.extreme;
  const contributors = state.history
    .filter((record) => record.statDelta[stat] && (extreme === 'high' ? record.statDelta[stat]! > 0 : record.statDelta[stat]! < 0))
    .map((record) => ({ cardId: record.cardId, delta: Math.round(record.statDelta[stat] ?? 0) }))
    .filter((c) => c.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);
  const pool = DEATH_COMMENT_POOLS[stat]?.[extreme] ?? [
    `${STAT_LABELS[stat]} dosáhla extrému. Systém tě označil za příliš intenzivní na další zpracování.`,
    `${STAT_LABELS[stat]} se vyprázdnila. Zbyla z tebe struktura, která už neumí sama spustit.`,
  ];
  const seed = `death-comment-${state.id}-${state.cycle}-${stat}-${extreme}`;
  const comment = pickAvoidingRecent(pool, seed, recentComments);
  return { stat, extreme, topContributors: contributors, systemComment: comment };
}

export function computeStabilizationProgress(state: CyklusRunState): { survivedRestart: boolean; imprints: number; imprintsNeeded: number; sectors: number; sectorsNeeded: number; statsStable: boolean; allStats: Record<StatKey, { value: number; stable: boolean }> } {
  return {
    survivedRestart: state.usedCardIds.includes('restart_5'),
    imprints: state.imprints.length,
    imprintsNeeded: 3,
    sectors: new Set(state.visitedSectors).size,
    sectorsNeeded: 4,
    statsStable: Object.values(state.stats).every((v) => v > 20 && v < 80),
    allStats: {
      energy: { value: state.stats.energy, stable: state.stats.energy > 20 && state.stats.energy < 80 },
      memory: { value: state.stats.memory, stable: state.stats.memory > 20 && state.stats.memory < 80 },
      bond: { value: state.stats.bond, stable: state.stats.bond > 20 && state.stats.bond < 80 },
      control: { value: state.stats.control, stable: state.stats.control > 20 && state.stats.control < 80 },
    },
  };
}

export type StabilizationVariantId =
  | 'archive_stabilization'
  | 'glitch_stabilization'
  | 'form_stabilization'
  | 'mirror_stabilization'
  | 'seal_stabilization'
  | 'generic_stabilization';

export interface StabilizationVariant {
  id: StabilizationVariantId;
  title: string;
  text: string;
  reasons?: string[];
}

export function computeStabilizationVariant(state: CyklusRunState): StabilizationVariant {
  const archiveRel = state.entityRelations.archive ?? 0;
  const glitchkaRel = state.entityRelations.glitchka ?? 0;
  const formRel = state.entityRelations.form ?? 0;
  const shadowRel = state.entityRelations.shadow ?? 0;

  const hasGlitchItem = state.inventory.some((id) => ['wrong_map', 'glitch_pebble', 'noise_clump', 'soft_bug'].includes(id));
  const hasFormItem = state.inventory.includes('rubber_stamp') || state.inventory.includes('blank_form');
  const hasMirrorImprint = state.imprints.some((id) => ['mirror_crack', 'reflected_self', 'second_face'].includes(id));
  const hasSealSave = state.flags.includes('rubber_seal_saved');

  if (hasSealSave) {
    return {
      id: 'seal_stabilization',
      title: 'Tuleňova stabilizace',
      text: 'Byl jsi blízko konce. Tuleň tě zadržel. Systém to nezaznamenal jako zázrak. Zaznamenal to jako "nepředvídaná záchrana gumovým objektem". Záznamy jsou přesnější než poezie.',
      reasons: ['Gumový tuleň zasahoval v kritickém momentu', 'Staty v bezpečném pásmu (20–80)'],
    };
  }

  if (archiveRel >= 4 && state.stats.memory >= 40 && state.stats.memory <= 75 &&
    state.imprints.some((id) => ['archive_echo', 'recorded_truth', 'drowned_log'].includes(id))) {
    return {
      id: 'archive_stabilization',
      title: 'Archivní stabilizace',
      text: 'Archiv tě nezařadil mezi mrtvé věci. To je od archivu téměř náklonnost. Tvůj záznam bude uložen s poznámkou: subjekt zůstal čitelný. V archivních podmínkách je to chvála.',
      reasons: [`Vztah k Archivu +${archiveRel}`, `Paměť ${state.stats.memory} (stabilní pásmo)`, 'Archivní otisk získán'],
    };
  }

  if (glitchkaRel >= 5 && hasGlitchItem && state.stats.control >= 25 && state.stats.control <= 65) {
    return {
      id: 'glitch_stabilization',
      title: 'Glitchova stabilizace',
      text: 'Systém tě neopravil. Glitchka tě jen naučila fungovat šikmo. Kupodivu to stačilo. Systém má k tomu poznámku. Poznámka je nečitelná.',
      reasons: [`Vztah ke Glitchce +${glitchkaRel}`, 'Glitch předmět v kapse', `Kontrola ${state.stats.control} (ne příliš vysoko)`],
    };
  }

  if (hasFormItem && formRel >= 0 && state.stats.control >= 50 && state.stats.control <= 78) {
    return {
      id: 'form_stabilization',
      title: 'Administrativní stabilizace',
      text: 'Byl jsi schválen. Nikdo neví proč. Razítko odmítlo další dotazy. Formulář byl archivován ve složce "nestandardní subjekty / přijatelné výsledky". Složka existuje.',
      reasons: ['Administrativní předmět v kapse', `Kontrola ${state.stats.control} (byrokracie spokojná)`],
    };
  }

  if (hasMirrorImprint && shadowRel >= 2 && state.stats.memory < 80) {
    return {
      id: 'mirror_stabilization',
      title: 'Zrcadlová stabilizace',
      text: 'Neodpustil sis všechno. Jen dost na to, aby odraz přestal útočit. Zrcadlo tě pustilo. Systém to nezaznamenal. Zrcadla záznamy nevede.',
      reasons: ['Zrcadlový otisk získán', `Vztah ke Stínu +${shadowRel}`, `Paměť ${state.stats.memory} (pod hranicí přetlačení)`],
    };
  }

  return {
    id: 'generic_stabilization',
    title: 'Stabilizovaný subjekt',
    text: 'Systém tě nedokázal vymazat, opravit ani správně zařadit. Po dlouhé interní debatě tě označil jako stabilní. To je prakticky kompliment.',
    reasons: [`${new Set(state.visitedSectors).size} navštívených sektorů`, `${state.imprints.length} otisků`, 'Staty v povoleném pásmu'],
  };
}

export interface BuildVariantProgress {
  id: StabilizationVariantId;
  title: string;
  progress: number;
  requirements: { label: string; met: boolean }[];
  hint: string;
}

export function getStabilizationBuildProgress(state: CyklusRunState): BuildVariantProgress[] {
  const archiveRel = state.entityRelations.archive ?? 0;
  const glitchkaRel = state.entityRelations.glitchka ?? 0;
  const formRel = state.entityRelations.form ?? 0;
  const shadowRel = state.entityRelations.shadow ?? 0;
  const hasGlitchItem = state.inventory.some((id) => ['wrong_map', 'glitch_pebble', 'noise_clump', 'soft_bug'].includes(id));
  const hasFormItem = state.inventory.includes('rubber_stamp') || state.inventory.includes('blank_form');
  const hasMirrorImprint = state.imprints.some((id) => ['mirror_crack', 'reflected_self', 'second_face'].includes(id));
  const hasSealSave = state.flags.includes('rubber_seal_saved');
  const visitedSectorCount = new Set(state.visitedSectors).size;
  const statsInRange = (['energy', 'memory', 'bond', 'control'] as StatKey[])
    .filter((k) => state.stats[k] >= 20 && state.stats[k] <= 80).length;

  return [
    {
      id: 'seal_stabilization',
      title: 'Tuleňova stabilizace',
      progress: hasSealSave ? 100 : Math.min(100, state.flags.includes('rubber_stamp_ready') ? 60 : 30),
      requirements: [
        { label: 'Gumový tuleň zachránil v kritickém momentu', met: hasSealSave },
        { label: 'Staty v bezpečném pásmu', met: statsInRange >= 3 },
      ],
      hint: 'Sežeň gumového tuleně a nech ho zasáhnout, až bude nejhůř.',
    },
    {
      id: 'archive_stabilization',
      title: 'Archivní stabilizace',
      progress: Math.min(100, Math.round(
        (archiveRel >= 4 ? 40 : archiveRel * 10) +
        (state.imprints.some((id) => ['archive_echo', 'recorded_truth', 'drowned_log'].includes(id)) ? 35 : 0) +
        (state.stats.memory >= 40 && state.stats.memory <= 75 ? 25 : 0),
      )),
      requirements: [
        { label: 'Vztah k Archivu +4', met: archiveRel >= 4 },
        { label: 'Archivní otisk', met: state.imprints.some((id) => ['archive_echo', 'recorded_truth', 'drowned_log'].includes(id)) },
        { label: 'Paměť 40–75', met: state.stats.memory >= 40 && state.stats.memory <= 75 },
      ],
      hint: 'Zapřáhni se s Archivem, získej archivní otisk a udrž Paměť v klidném pásmu.',
    },
    {
      id: 'glitch_stabilization',
      title: 'Glitchova stabilizace',
      progress: Math.min(100, Math.round(
        (glitchkaRel >= 5 ? 40 : glitchkaRel * 8) +
        (hasGlitchItem ? 30 : 0) +
        (state.stats.control >= 25 && state.stats.control <= 65 ? 30 : 0),
      )),
      requirements: [
        { label: 'Vztah ke Glitchce +5', met: glitchkaRel >= 5 },
        { label: 'Glitch předmět', met: hasGlitchItem },
        { label: 'Kontrola 25–65', met: state.stats.control >= 25 && state.stats.control <= 65 },
      ],
      hint: 'Sbírej glitch předměty a udržuj Kontrolu v rozumném pásmu.',
    },
    {
      id: 'form_stabilization',
      title: 'Administrativní stabilizace',
      progress: Math.min(100, Math.round(
        (hasFormItem ? 35 : 0) +
        (formRel >= 0 ? 25 : 0) +
        (state.stats.control >= 50 && state.stats.control <= 78 ? 40 : 0),
      )),
      requirements: [
        { label: 'Formulářový předmět', met: hasFormItem },
        { label: 'Byrokracie nezaujatá', met: formRel >= 0 },
        { label: 'Kontrola 50–78', met: state.stats.control >= 50 && state.stats.control <= 78 },
      ],
      hint: 'Najdi razítko nebo formulář a drž Kontrolu v úředně přijatelné zóně.',
    },
    {
      id: 'mirror_stabilization',
      title: 'Zrcadlová stabilizace',
      progress: Math.min(100, Math.round(
        (hasMirrorImprint ? 40 : 0) +
        (shadowRel >= 2 ? 30 : 0) +
        (state.stats.memory < 80 ? 30 : 0),
      )),
      requirements: [
        { label: 'Zrcadlový otisk', met: hasMirrorImprint },
        { label: 'Vztah ke Stínu +2', met: shadowRel >= 2 },
        { label: 'Paměť pod 80', met: state.stats.memory < 80 },
      ],
      hint: 'Získej zrcadlový otisk, spřáteli se se Stínem a nedovol Paměti přetéct.',
    },
    {
      id: 'generic_stabilization',
      title: 'Stabilizovaný subjekt',
      progress: Math.min(100, Math.round(
        (visitedSectorCount >= 4 ? 35 : visitedSectorCount * 8) +
        (state.imprints.length >= 3 ? 35 : state.imprints.length * 10) +
        (statsInRange >= 3 ? 30 : statsInRange * 10),
      )),
      requirements: [
        { label: '4+ sektory', met: visitedSectorCount >= 4 },
        { label: '3+ otisky', met: state.imprints.length >= 3 },
        { label: 'Staty v bezpečném pásmu', met: statsInRange >= 3 },
      ],
      hint: 'Prozkoumej sektory, sbírej otisky a drž staty mimo extrémy.',
    },
  ];
}
