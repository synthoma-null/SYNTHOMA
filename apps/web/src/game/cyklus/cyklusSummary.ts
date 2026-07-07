import type { CyklusRunState, CyklusRunSummary, SectorId, StatKey, ProfileResult } from './cyklusTypes';
import { STAT_LABELS, SECTOR_LABELS } from './cyklusTypes';
import { CYKLUS_CARDS, CYKLUS_ITEMS } from './content';
import { pickAvoidingRecent } from './cyklusCommentPool';
import { pickFromPool } from './cyklusRandom';
import { formatAbsDelta } from './cyklusFormat';
import { computeProfile } from './cyklusProfile';
import { computeEnding } from './cyklusEnding';

export function getCycleChapterName(cycle: number): { number: string; title: string; subtitle: string } {
  const chapters: Record<number, { title: string; subtitle: string }> = {
    1: { title: 'PROBUZENI', subtitle: 'Systém se inicializuje. Ty ještě nevíš, co to znamená.' },
    2: { title: 'REZIDUALNI VRSTVA', subtitle: 'Vzpomínky ještě nejsou tvoje. Ale přicházejí.' },
    3: { title: 'REZIDUUM', subtitle: 'Systém přestal předstírat, že tě opravuje. Teď už jen sleduje, co z tebe zůstane.' },
    4: { title: 'KOLAPS IDENTITY', subtitle: 'Jméno se rozpadlo na součásti. Zbývá otázka: které jsou tvoje?' },
    5: { title: 'STABILIZACE / SMRT', subtitle: 'Tady se rozhoduje. Systém čeká na výsledek. Ty také.' },
  };
  const c = chapters[Math.min(cycle, 5)] ?? { title: `CYKLUS ${cycle}`, subtitle: 'Nekonečno má strukturu. Jen ji nevidíš.' };
  return { number: `CYKLUS ${String(cycle).padStart(2, '0')}`, title: c.title, subtitle: c.subtitle };
}

const SECTOR_INTROS: Record<SectorId, string[]> = {
  void: [
    'Prázdnota tě přijala. Bez otázek, bez podmínek. To je u přijetí podezřelé.',
    'Vrátil ses do Prázdnoty. Nebo nikdy neodešel. Těžko říct.',
    'Prázdnota neznamená nic. Ale to "nic" má tvar.',
  ],
  archive: [
    'Vzduch voní starým papírem a mokrým kabelem. Archiv tě nepozval. Archiv tě rozpoznal. To je horší.',
    'Police se natáhly dál, než by geometrie dovolila. Archiv tě eviduje.',
    'Archiv přijal tvůj příchod. Někde se otočí stránka, která měla zůstat zavřená.',
  ],
  memory_sandbox: [
    'Písek je starý. Stopy v něm nejsou tvoje. Nebo jsou — jen jiné.',
    'Pískoviště tě znalo dřív, než ses naučil jméno. Přivítalo tě mlčením.',
    'Tady jsou uložené věci, které jsi přestal nosit. Čekaly.',
  ],
  sarkasma_terminal: [
    'Terminál zablikal. Sarkasma si tě všimla. To není vždy dobré.',
    'Sarkasmin prostor má vlastní gravitaci. Věci, které řekneš, padají jinak.',
    'Terminál tě ohlásil. Sarkasma nedorazila. Zatím.',
  ],
  glitchka_nest: [
    'Hnízdo je jinak než včera. Nebo jsi jiný ty. Glitchka by řekla: obojí.',
    'Glitchka tě vítá smíchem, který předchází vtip o tři sekundy.',
    'Chaos má tady správce. Správce se tváří, že to ví.',
  ],
  tai_core: [
    'T-AI Jádro je přesné. Teplota, osvětlení, vzduch — všechno seřízené. Trochu děsivé.',
    'T-AI tě skenuje. Výsledek uloží na místo, které nenajdeš.',
    'Jádro hučí tiše. T-AI eviduje anomálie. Ty jsi evidovaná anomálie.',
  ],
  acid_yellow: [
    'Barva tě udeřila dřív než cokoli jiného. Acidová žluť nemá zábrany.',
    'Kult tě přijal jako hosta nebo jako materiál. Ještě nevíš čím jsi.',
    'Energie je tady hustší. Jako vzduch těsně před bouřkou, která nikdy nepřijde.',
  ],
  market: [
    'Tržiště eviduje, co máš. A co ti chybí. Ceny jsou v měně, která se mění.',
    'Něco se tu prodává. Cena je napsaná jinak, než si myslíš.',
    'Trh nezná náladu. Jen nabídku a poptávku. Ty jsi obojí.',
  ],
  mirror: [
    'Zrcadlo nezačíná u skla. Začíná u tebe.',
    'Odraz přišel o zlomek sekundy dřív než ty. Nebo o zlomek sekundy pozdě.',
    'Zrcadlový sektor tě viděl, než jsi vstoupil. Připravil se.',
  ],
  residuum: [
    'Reziduum je to, co zbyde po smazání. Ty jsi tady. Přemýšlej nad tím.',
    'Tady žijí věci, které systém nestačil smazat. A ty.',
    'Reziduální práh voní po smazaných větách a nedokončených rozhodnutích.',
  ],
  form_office: [
    'Formuláře se dívají. Ne oči — pozornost. Úřad tě zaevidoval.',
    'Formulářovna tě přijala jako případ. Číslo jednací ještě nezná. Brzy bude znát.',
    'Vzduch tady váží víc. Je to tíha papíru, který čeká na podpis.',
  ],
};

export function getSectorIntroText(sectorId: SectorId, seed: string): string {
  const pool = SECTOR_INTROS[sectorId];
  return pickFromPool(pool, seed);
}

const CYCLE_COMMENT_POOLS = {
  itemCollector: [
    'Subjekt sbírá. Nevíme ještě, jestli skládá inventář, nebo hromadí důkazy.',
    'Předmětů přibývá rychleji než jejich význam. Systém to zaznamenává jako sběratelský otřes.',
    'Inventář roste. Duše se zatím nevejde do krabice.',
  ],
  entityRefuser: [
    'Subjekt odmítá entity. Systém si to pamatuje. Entity si to pamatují taky.',
    'Žádné velké přátelství s entitami. Jen opatrné soužití s přízraky.',
    'Subjekt se drží stranou. To je strategie i způsob, jak se ztratit.',
  ],
  highMemory: [
    'Paměť se nafoukla. Systém se ptá, jestli to bylo nutné.',
    'Subjekt drží vysokou paměť. Někdo musí.',
    'Vzpomínky těžknou. Systém nabízí neoficiální diagnózu: nostalgie s příznaky.',
  ],
  pushingControl: [
    'Kontrola stoupá. Systém si není jistý, kdo koho právě řídí.',
    'Subjekt tlačí na kontrolu. Některé páky se ohýbají nazpět.',
    'Řád je přitažlivý, dokud nezačne škrtat sám sebe.',
  ],
  sectorHopping: [
    'Subjekt střídá sektory. Domov je evidentně koncept, ne místo.',
    'Příliš mnoho dveří za jeden cyklus. Systém podezřívá zvědavost.',
    'Trasa je čárová kresba, ne příběh. Zatím.',
  ],
  voidDwelling: [
    'Subjekt se drží Prázdnoty. To je buď kotva, nebo past.',
    'Prázdnota ho nepustila. Nebo on nepustil Prázdnotu.',
    'Dlouhý pobyt v meziprostoru. Systém zaznamenává sediment.',
  ],
  glitchAligned: [
    'Glitchka by byla hrdá. Nebo zmatená. U ní je to totéž.',
    'Subjekt se spoléhá na chaos. Chaos se zatím neomluvil.',
    'Malé poruchy mají svůj půvab. Velké poruchy mají subjekt.',
  ],
  sarkasmaAligned: [
    'Sarkasma by řekla, že tohle je zdravý. Sarkasma lže často.',
    'Subjekt poslouchá Sarkasmu. Někdo musí, jinak by byla zbytečná.',
    'Obranný humor zatím drží. Systém čeká, kdy se přepne do útoku.',
  ],
  repeatedDeath: [
    'Opakující se smrt stejným statem. Systém to označil za zvyk.',
    'Subjekt umírá konzistentně. Aspoň je to predikovatelné.',
    'Jedna statistika stoupá: smrt podle osvědčeného receptu.',
  ],
  default: [
    'V cyklu provedl zaznamenané volby. Bez jasné logiky. Nebo s logikou, kterou systém zatím nepochopil.',
    'V cyklu provedl zaznamenané volby. Systém čeká na vzor. Subjekt zatím čeká na smysl.',
    'V cyklu provedl zaznamenané volby. Data jsou. Výklad přijde později.',
    'V cyklu provedl zaznamenané volby. Systém neodsuzuje. Jen archivuje.',
  ],
};

export function composeCycleSummary(
  state: CyklusRunState,
  recentComments: string[] = [],
  onCommentPicked?: (comment: string) => void,
): string {
  const cycleHistory = state.history.filter((r) => r.cycle === state.cycle - 1);
  if (cycleHistory.length === 0) return '';

  const itemsGained = cycleHistory.flatMap((r) => r.itemsGained);
  const uniqueSectors = [...new Set(cycleHistory.map((r) => r.sectorAfter))];
  const totalStatDelta: Partial<Record<StatKey, number>> = {};
  for (const r of cycleHistory) {
    for (const [k, v] of Object.entries(r.statDelta) as [StatKey, number][]) {
      totalStatDelta[k] = (totalStatDelta[k] ?? 0) + v;
    }
  }
  const dominantKey = (Object.entries(totalStatDelta) as [StatKey, number][])
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]?.[0] ?? null;
  const yesCount = cycleHistory.filter((r) => r.direction === 'yes').length;
  const noCount = cycleHistory.filter((r) => r.direction === 'no').length;

  const cycleNum = state.cycle - 1;
  const lines: string[] = [];
  lines.push(`SYSTEMOVE HODNOCENI CYKLU ${String(cycleNum).padStart(2, '0')}`);
  lines.push('');

  const choiceLinePrefix = `V cyklu provedl ${cycleHistory.length} zaznamenaných voleb: ${yesCount}x přijal, ${noCount}x odmítl.`;
  let commentPool = CYCLE_COMMENT_POOLS.default;
  if (itemsGained.length >= 3) commentPool = CYCLE_COMMENT_POOLS.itemCollector;
  else if (uniqueSectors.length >= 4) commentPool = CYCLE_COMMENT_POOLS.sectorHopping;
  else if (uniqueSectors.length === 1 && uniqueSectors[0] === 'void') commentPool = CYCLE_COMMENT_POOLS.voidDwelling;
  else if ((totalStatDelta.memory ?? 0) > 15 || state.stats.memory >= 85) commentPool = CYCLE_COMMENT_POOLS.highMemory;
  else if ((totalStatDelta.control ?? 0) > 15 || state.stats.control >= 85) commentPool = CYCLE_COMMENT_POOLS.pushingControl;
  else if (itemsGained.some((id) => CYKLUS_ITEMS[id]?.tags?.includes('glitchka'))) commentPool = CYCLE_COMMENT_POOLS.glitchAligned;
  else if (itemsGained.some((id) => CYKLUS_ITEMS[id]?.tags?.includes('sarkasma'))) commentPool = CYCLE_COMMENT_POOLS.sarkasmaAligned;

  const selectedComment = pickAvoidingRecent(commentPool, `cycle-comment-${cycleNum}-${state.id}`, recentComments);
  if (onCommentPicked) onCommentPicked(selectedComment);
  lines.push(`${choiceLinePrefix} ${selectedComment}`);

  if (dominantKey) {
    const delta = totalStatDelta[dominantKey]!;
    const statName = STAT_LABELS[dominantKey];
    if (delta > 0) {
      lines.push(`Nejznatelnější posun: ${statName} vzrostla o ${formatAbsDelta(delta)}. Systém to zaznamenal jako vývoj nebo varovný signál.`);
    } else {
      lines.push(`Nejznatelnější posun: ${statName} klesla o ${formatAbsDelta(delta)}. Systém to zaznamenal jako ztrátu nebo úsporu.`);
    }
  }

  if (itemsGained.length > 0) {
    const names = itemsGained.map((id) => CYKLUS_ITEMS[id]?.title ?? id).join(', ');
    lines.push(`Předměty přinesené z cyklu: ${names}. Důvod jejich výběru: zatím neklasifikován.`);
  }

  if (uniqueSectors.length >= 3) {
    lines.push(`Subjekt navštívil ${uniqueSectors.length} sektorů. Systém to hodnotí jako neklid nebo zvědavost. Obojí je podezřelé.`);
  }

  lines.push('');
  lines.push('Zaver:');
  const conclusions = [
    'Subjekt vykazuje neobvyklou odolnost vůči klasifikaci.',
    'Subjekt funguje. Definice "fungovat" se upřesňuje.',
    'Cyklus skončil. Subjekt přežil. To nebylo jisté.',
    'Systém nemá dostatek dat. Subjekt má dostatek odhodlání. Zatím remíza.',
    'Výsledek cyklu: neurčitý. Přesně jak má být.',
  ];
  lines.push(pickFromPool(conclusions, `cycle-summary-${cycleNum}-${state.id}`));

  return lines.join('\n');
}

export function composeBehavioralAnalysis(state: CyklusRunState): string[] {
  const h = state.history;
  if (h.length < 5) return [];
  const patterns: string[] = [];

  const objectCards = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.category === 'object' || card?.tags.includes('object');
  });
  if (objectCards.length >= 4) {
    patterns.push('často přijímá neznámé předměty');
  }

  const helpRefused = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.tags.includes('tai') && r.direction === 'no';
  });
  if (helpRefused.length >= 2) {
    patterns.push('odmítá přímou pomoc');
  }

  const controlOverBond = (state.stats.control - state.stats.bond) > 20;
  if (controlOverBond) {
    patterns.push('preferuje kontrolu před vazbou');
  }

  const bondOverControl = (state.stats.bond - state.stats.control) > 20;
  if (bondOverControl) {
    patterns.push('preferuje vazbu před kontrolou');
  }

  const memoryHigh = state.stats.memory > 70;
  if (memoryHigh) {
    patterns.push('paměť otevírá i za cenu energie');
  }

  const crisisYes = h.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.category === 'crisis' && r.direction === 'yes';
  });
  if (crisisYes.length >= 2) {
    patterns.push('v krizích volí stabilizaci, ne risk');
  }

  const archiveAffinity = (state.entityRelations.archive ?? 0) >= 3;
  if (archiveAffinity) {
    patterns.push('vykazuje afinitu k Archivu');
  }

  const sarkasmaNegative = (state.entityRelations.sarkasma ?? 0) < -2;
  if (sarkasmaNegative) {
    patterns.push('komplikovaný vztah se Sarkasmou');
  }

  return patterns;
}

export function composeCycleForecast(state: CyklusRunState): string {
  const lines: string[] = [];
  const { energy, memory, bond, control } = state.stats;

  const stats = { energy, memory, bond, control } as Record<StatKey, number>;
  const sorted = (Object.entries(stats) as [StatKey, number][]).sort((a, b) => b[1] - a[1]);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  const highLabel: Record<StatKey, string> = {
    energy: 'Energie je zvýšená. Karty s vysokou aktivitou budou pravděpodobnější.',
    memory: 'Paměť je zvýšená. Archivní a vzpomínkové karty budou pravděpodobnější.',
    bond: 'Vazba je zvýšená. Entity budou aktivnější.',
    control: 'Kontrola je zvýšená. Formuláře a systémové karty budou pravděpodobnější.',
  };
  const lowLabel: Record<StatKey, string> = {
    energy: 'Energie je nízká. Doporučuje se vyhýbat dalšímu vyčerpání.',
    memory: 'Paměť je nízká. Riziko ztráty záznamu.',
    bond: 'Vazba je nízká. Entity nebudou ochotné.',
    control: 'Kontrola je nízká. Struktura není spolehlivá.',
  };

  if (highest && highest[1] > 65) lines.push(highLabel[highest[0]]);
  if (lowest && lowest[1] < 35) lines.push(lowLabel[lowest[0]]);

  const archiveRel = state.entityRelations.archive ?? 0;
  const glitchkaRel = state.entityRelations.glitchka ?? 0;
  const sarkasmRel = state.entityRelations.sarkasma ?? 0;
  if (archiveRel >= 3) lines.push('Archiv sleduje tento průchod s neobvyklým zájmem.');
  if (glitchkaRel >= 3) lines.push('Glitchka má připravený vtip. Pravděpodobnost je znepokojivá.');
  if (sarkasmRel <= -3) lines.push('Sarkasma nesouhlasí s aktuální trajektorií. Sarkasma nesouhlasí s mnoha věcmi.');

  const hasScheduled = state.scheduledCards.filter((sc) => sc.turnsRemaining <= 2).length;
  if (hasScheduled >= 2) lines.push('Více naplánovaných událostí čeká. Systém doporučuje přípravu. Systém neupřesňuje, co to znamená.');
  else if (hasScheduled === 1) lines.push('Jedna naplánovaná událost je blízko.');

  if (state.inventory.length >= 4) lines.push('Kapsa je plná. Předměty mají tendenci si toho všímat.');
  if (state.imprints.length >= 3) lines.push('Otisky se hromadí. Systém začíná rozeznávat vzorec.');

  const sectorComments: Partial<Record<SectorId, string>> = {
    void: 'Prázdnota tě drží déle, než bylo naplánováno.',
    archive: 'Archiv je otevřen. To se nestane vždy.',
    mirror: 'Zrcadlo reflektuje. Doporučuje se opatrnost při pohledu.',
    glitchka_nest: 'Hnízdo je aktivní. Nepředvídatelnost je standardní.',
    form_office: 'Formuláře čekají. Jsou vždy připraveny.',
    residuum: 'Reziduum obsahuje věci, které nepatří nikam jinam. Tedy sem.',
  };
  const sectorComment = sectorComments[state.sector];
  if (sectorComment) lines.push(sectorComment);

  if (lines.length === 0) lines.push('Systém nemá předpověď. Systém tím říká, že nemá tušení. Nebo se nechce prozradit.');

  const doporuceni: string[] = [];
  if (memory > 75) doporuceni.push('Nevstupuj do dalšího archivu s plnou pamětí.');
  if (energy > 75) doporuceni.push('Zbytečně se nenadchni.');
  if (bond < 25) doporuceni.push('Odpověz alespoň jedné entitě. I otázkou.');
  if (control > 75) doporuceni.push('Uvolni jeden formulář. Záměrně.');
  if (doporuceni.length > 0) lines.push(`Doporučení: ${doporuceni[0]}`);

  return lines.join('\n');
}

export function summarizeRun(state: CyklusRunState): CyklusRunSummary {
  const profile = computeProfile(state);
  const ending = computeEnding(state);
  const endingTitle = ending?.title ?? 'Neznámý konec';
  const deathStat = ending?.type === 'death' ? ending.stat : undefined;
  const codename = generateRunCodename(state);
  return {
    id: state.id,
    endedAt: Date.now(),
    status: state.status === 'completed' ? 'completed' : 'dead',
    endingTitle,
    codename,
    cyclesSurvived: state.cycle,
    totalChoices: state.totalChoices,
    dominantProfile: profile.dominantLabel,
    archetype: profile.archetype,
    profile: { ...state.profile },
    imprints: [...state.imprints],
    visitedSectors: [...state.visitedSectors],
    deathStat,
  };
}

const CODENAME_STAT: Record<StatKey, string[]> = {
  energy: ['Žhavý', 'Přepálený', 'Jiskrový', 'Hořící', 'Tichý reaktor'],
  memory: ['Mokrý', 'Archivní', 'Zapomenutý', 'Přetékající', 'Záznam'],
  bond: ['Propojený', 'Opuštěný', 'Síťový', 'Vláknovitý', 'Ztracený signál'],
  control: ['Přesný', 'Rozbitý', 'Formulářový', 'Rigidní', 'Výjimka'],
};

const CODENAME_SECTOR: Partial<Record<SectorId, string[]>> = {
  void: ['Prázdnota', 'Nicota', 'Bezjmenný'],
  archive: ['Archiv', 'Záznamník', 'Katalog'],
  mirror: ['Zrcadlo', 'Odraz', 'Tvář'],
  glitchka_nest: ['Hnízdo', 'Glitch', 'Anomálie'],
  form_office: ['Formulář', 'Kancelář', 'Razítko'],
  residuum: ['Reziduum', 'Zbytek', 'Sediment'],
  market: ['Tržiště', 'Obchod', 'Transakce'],
  acid_yellow: ['Žluč', 'Kyselina', 'Kult'],
};

const CODENAME_ITEM: Record<string, string> = {
  rubber_seal: 'Tuleň',
  archive_key: 'Klíč',
  mirror_shard: 'Střep',
  noise_clump: 'Chomáč',
  black_folder: 'Složka',
  glitch_pebble: 'Kamínek',
  soft_bug: 'Chyba',
  ownerless_shadow: 'Stín',
};

const CODENAME_ENDING: Record<string, string[]> = {
  stabilized: ['který zůstal', 'co nepodlehl', 's razítkem na čele'],
  death: ['bez výstupu', 'co neodpověděl', 'který neuměl zavřít dveře'],
};

export function generateRunCodename(state: CyklusRunState): string {
  const stats = state.stats as Record<StatKey, number>;
  const dominantStat = (Object.entries(stats) as [StatKey, number][])
    .sort((a, b) => Math.abs(b[1] - 50) - Math.abs(a[1] - 50))[0]?.[0] ?? 'energy';

  const mostVisitedSector = Object.entries(
    state.visitedSectors.reduce<Record<string, number>>((acc, s) => { acc[s] = (acc[s] ?? 0) + 1; return acc; }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] as SectorId | undefined ?? 'void';

  const significantItem = state.inventory.find((id) => CODENAME_ITEM[id]);

  const ending = computeEnding(state);
  const endType = ending?.type === 'death' ? 'death' : 'stabilized';

  const rng = (arr: string[]) => arr[Math.abs(state.totalChoices + state.cycle) % arr.length] ?? arr[0] ?? '';

  const adj = rng(CODENAME_STAT[dominantStat] ?? ['Neznámý']);
  const noun = rng(CODENAME_SECTOR[mostVisitedSector] ?? ['Průchod']);
  const itemTitle = significantItem ? (CYKLUS_ITEMS[significantItem]?.title ?? CODENAME_ITEM[significantItem]) : null;
  const item = itemTitle ? ` nese: ${itemTitle}` : '';
  const end = rng(CODENAME_ENDING[endType] ?? ['']);

  return `${adj} ${noun}${item}, ${end}`;
}
