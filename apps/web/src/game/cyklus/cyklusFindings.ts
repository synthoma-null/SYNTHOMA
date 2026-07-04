import type { CyklusRunState, StatKey } from './cyklusTypes';
import { CYKLUS_CARDS } from './content';

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
  {
    id: 'sandbox_absurd_entry',
    title: 'Komisař banánového tribunálu',
    description:
      'Subjekt přežil absurdní soud digitálního banánu. Systém zaznamenal, že v Pískovišti lze najít právo, které neexistuje.',
    check: (s) => s.usedCardIds.includes('sandbox_banana_court'),
    reward: { unlockPool: 'sandbox_absurd_pool' },
  },
  {
    id: 'banana_court_survivor',
    title: 'Přeživší banánového soudu',
    description:
      'Subjekt přežil absurdní tribunál s digitálním banánem jako předsedou. Bude mu doporučena terapie i Nobelova cena za flexibility.',
    check: (s) => s.usedCardIds.includes('sandbox_banana_court'),
  },
  {
    id: 'safe_mistake_learned',
    title: 'Bezpečná chyba',
    description:
      'Subjekt si dovolil chybu, která nebyla katastrofální. V SYNTHOMĚ je to téměř stejně vzácné jako přiznání.',
    check: (s) => s.imprints.includes('safe_mistake') || s.usedCardIds.includes('sandbox_too_safe'),
  },
  {
    id: 'dirty_laugh_shared',
    title: 'Špinavý smích',
    description:
      'Subjekt sdílel smích, který nebyl slušný, ani tichý. Systém si ho zapamatoval jako anomálii. Glitchka si ho zapamatovala jako dárek.',
    check: (s) => s.imprints.includes('dirty_laugh') || s.usedCardIds.includes('sandbox_dirty_laugh'),
  },
  {
    id: 'desire_orgie_entry',
    title: 'Subjekt se nerozpustil',
    description:
      'Subjekt vstoupil do sektoru touhy a zůstal subjektem. Glitchena to zapsala jako pozitivní anomálii.',
    check: (s) => s.usedCardIds.includes('orgie_salon_without_touch'),
    reward: { unlockPool: 'desire_orgie_pool' },
  },
  {
    id: 'romance_residuum_entry',
    title: 'Neodeslané srdce',
    description:
      'Subjekt odeslal zprávu do minulosti, která nedošla. Přesto něco změnila. Systém to nechápe.',
    check: (s) => s.usedCardIds.includes('romance_unsent_goodnight'),
    reward: { unlockPool: 'romance_residuum_pool' },
  },
  {
    id: 'loneliness_named',
    title: 'Pojmenovaná samota',
    description:
      'Subjekt přiznal, že toužil. Ne po někom konkrétním. Po tom, aby neodešel nikdo, kdo by mohl.',
    check: (s) => s.usedCardIds.includes('romance_waiting_window') || s.flags.includes('loneliness_named'),
  },
  {
    id: 'dependency_named',
    title: 'Závislost pojmenovaná',
    description:
      'Subjekt pojmenoval, že teplota místnosti není totéž jako láska. Bylo to těžké, ale místnost pak už nebyla tak přesvědčivá.',
    check: (s) => s.usedCardIds.includes('romance_afterglow_empty') || s.flags.includes('dependency_named'),
  },
  {
    id: 'borrowed_memory_returned',
    title: 'Vrácená cizí paměť',
    description:
      'Subjekt vrátil polibek, který nebyl jeho. Cizí láska zůstala cizí. Vlastní se uvolnila.',
    check: (s) => s.usedCardIds.includes('romance_return_the_memory') || s.flags.includes('borrowed_memory_returned'),
  },
  {
    id: 'tender_exit_taken',
    title: 'Něžný východ',
    description:
      'Subjekt odešel z Rezidua. Ne proto, že by rezignoval. Protože něha nemusí být vězení.',
    check: (s) => s.usedCardIds.includes('romance_tender_exit') || s.flags.includes('tender_exit_taken'),
  },
  {
    id: 'brutal_blackbox_entry',
    title: 'Odmítnutá anonymizace',
    description:
      'Subjekt odmítl lék zapomnění. Systém ho označil za neopravitelný. To je kompliment.',
    check: (s) => s.usedCardIds.includes('blackbox_refuse_anonymization') || s.usedCardIds.includes('blackbox_patient_label'),
    reward: { unlockPool: 'brutal_blackbox_pool' },
  },
  {
    id: 'body_boundary_learned',
    title: 'Tělesná hranice jako dovednost',
    description:
      'Subjekt pojmenoval hranici tak, že zůstala slyšet i poté, co místnost ztichla. Systém to zapsal jako vzácný jev.',
    check: (s) => s.imprints.includes('body_boundary') || s.usedCardIds.includes('orgie_room_learns_no') || s.usedCardIds.includes('orgie_false_yes_echo'),
  },
  {
    id: 'wanted_without_erasing',
    title: 'Chtěný bez vymazání',
    description:
      'Subjekt přijal, že být chtěný neznamená zmizet v někom jiném. Glitchena to neoznačila za anomálii. Ani za souhlas.',
    check: (s) => s.imprints.includes('wanted_without_erasing') || s.usedCardIds.includes('orgie_wanted_without_erasing'),
  },
  {
    id: 'named_error_claimed',
    title: 'Pojmenovaná chyba',
    description:
      'Subjekt dal své chybě jméno. Systém couvl ne ze soucitu, ale z nekompatibility.',
    check: (s) => s.imprints.includes('named_error') || s.usedCardIds.includes('blackbox_named_error') || s.flags.includes('named_error_claimed'),
  },
  {
    id: 'anonymization_refused',
    title: 'Odmítnutá anonymizace',
    description:
      'Subjekt odmítl lék zapomnění. Systém ho označil za neopravitelný. Byl to kompliment.',
    check: (s) => s.imprints.includes('blackbox_scar') || s.usedCardIds.includes('blackbox_refuse_anonymization') || s.flags.includes('anonymization_refused'),
  },
  {
    id: 'toll_dvanactnik_entry',
    title: 'První mýtné',
    description:
      'Subjekt narazil na Mýtnici Dvanáctníka. Neprodává spásu. Jen účtuje okamžiky, které si subjekt myslel, že byly jeho.',
    check: (s) => s.usedCardIds.includes('toll_booth_between_cycles'),
    reward: { unlockPool: 'toll_dvanactnik_pool' },
  },
  {
    id: 'debt_named',
    title: 'Pojmenovaný dluh',
    description:
      'Subjekt dal svému dluhu jméno. Pořád bolí. Jen se hůř schovává za péči.',
    check: (s) => s.imprints.includes('debt_named') || s.flags.includes('debt_named_active'),
  },
  {
    id: 'paid_with_fake_memory',
    title: 'Placení falešnou pamětí',
    description:
      'Subjekt zaplatil padělkem. Tržiště jej přijalo. To bylo horší. Některé systémy nepoznají lež, protože z ní mají marži.',
    check: (s) => s.usedCardIds.includes('toll_market_detects_fake') || s.flags.includes('paid_with_fake_memory'),
  },
  {
    id: 'asked_price_before_crossing',
    title: 'Zeptat se na cenu',
    description:
      'Subjekt se zastavil u brány a zeptal se na cenu. Poprvé neplatil věcí. Platil pozorností.',
    check: (s) => s.usedCardIds.includes('toll_gate_opens_without_payment') || s.flags.includes('asked_price_before_crossing'),
  },
  {
    id: 'comfort_refunded',
    title: 'Vrácená útěcha',
    description:
      'Subjekt vrátil teplo, které nebylo jeho. Systém tomu nerozumí. Tím líp.',
    check: (s) => s.imprints.includes('comfort_refunded') || s.usedCardIds.includes('toll_refund_counter'),
  },
  {
    id: 'detective_echo_case_entry',
    title: 'První případ',
    description:
      'Subjekt vstoupil do detektivního sektoru. Vyšetřuje zmizení pravdy z vlastní paměti.',
    check: (s) => s.usedCardIds.includes('detective_crime_scene_in_memory'),
    reward: { unlockPool: 'detective_echo_case_pool' },
  },
  {
    id: 'faceless_witness_interrogated',
    title: 'Svědek bez tváře',
    description:
      'Subjekt vyslechl svědka, který tvrdil, že viděl všechno. Některé výpovědi jsou přesnější, když se je nesnažíš okamžitě přibít na nástěnku.',
    check: (s) => s.usedCardIds.includes('detective_witness_with_no_face') || s.flags.includes('faceless_witness_interrogated'),
  },
  {
    id: 'false_pattern_broken',
    title: 'Rozbitý falešný vzor',
    description:
      'Subjekt rozbil symetrii příliš dokonalého vzoru. Někdy pravdu nenajdeš přidáním spojitosti, ale odstraněním posedlosti.',
    check: (s) => s.usedCardIds.includes('detective_false_pattern') || s.flags.includes('false_pattern_broken'),
  },
  {
    id: 'wrong_culprit_accused',
    title: 'Špatný viník',
    description:
      'Subjekt obvinil vzpomínku, která byla jen obětní beránek s lepším osvětlením. Pravda málokdy balí tak rychle.',
    check: (s) => s.imprints.includes('false_culprit') || s.usedCardIds.includes('detective_wrong_culprit') || s.flags.includes('wrong_culprit_accused'),
  },
  {
    id: 'case_left_open',
    title: 'Případ zůstává otevřený',
    description:
      'Subjekt neuzavřel pravdu násilím. Případ zůstal otevřený, ale přestal ho držet pod krkem.',
    check: (s) => s.imprints.includes('open_case') || s.usedCardIds.includes('detective_case_stays_open') || s.flags.includes('case_left_open'),
  },
  {
    id: 'cold_case_allowed_to_breathe',
    title: 'Studený případ dýchá',
    description:
      'Subjekt nechal minulost dýchat zavřenou, ale ne zamčenou. To je rozdíl, který by Archiv nejradši označil jako chybu v procesu.',
    check: (s) => s.usedCardIds.includes('detective_cold_case_echo') || s.flags.includes('cold_case_allowed_to_breathe'),
  },
  {
    id: 'sarkasma_therapy_entry',
    title: 'První sezení',
    description:
      'Sarkasma otevřela terapeutickou místnost. Cílem není být pozitivní. Cílem je řezat přesněji a přestat si plést obranu s osobností.',
    check: (s) => s.usedCardIds.includes('sarkasma_intake_session'),
    reward: { unlockPool: 'sarkasma_therapy_pool' },
  },
  {
    id: 'defense_thanked',
    title: 'Poděkovaná obrana',
    description:
      'Subjekt poděkoval obraně, která ho kdysi zachránila. Stroj se zadrhl. Nikdo mu nikdy nepoděkoval bez toho, aby ho zároveň obvinil.',
    check: (s) => s.usedCardIds.includes('sarkasma_defense_mechanism') || s.flags.includes('defense_thanked'),
  },
  {
    id: 'overcut_admitted',
    title: 'Přiznané přeřezání',
    description:
      'Subjekt přiznal, že skalpel vtipu řízl moc hluboko. Konečně se nesnažil vydávat krutost za upřímnost.',
    check: (s) => s.usedCardIds.includes('sarkasma_cut_too_deep') || s.flags.includes('overcut_admitted'),
  },
  {
    id: 'sarkasma_softened',
    title: 'Sarkasma změkla',
    description:
      'Subjekt nechal zaznít téměř omluvu. Sarkasma nevybuchla. Svět taky ne. Možná některé věty přežijí, i když je nikdo nezabalí do jedu.',
    check: (s) => s.usedCardIds.includes('sarkasma_almost_apologizes') || s.flags.includes('sarkasma_softened'),
  },
  {
    id: 'sarkasma_cut_held',
    title: 'Řez, který podržel',
    description:
      'Subjekt dovolil Sarkasmě říznout přesněji. Poprvé to neznělo jako výmluva, ale jako slib, který se bojí vlastního tvaru.',
    check: (s) => s.imprints.includes('cut_that_held') || s.usedCardIds.includes('sarkasma_cut_that_held') || s.flags.includes('sarkasma_cut_held'),
  },
  {
    id: 'homework_accepted',
    title: 'Přijatý domácí úkol',
    description:
      'Subjekt přijal nechutný úkol: napsat jednu konkrétní věc, kterou skutečně udělal. Ne identitu. Skutek.',
    check: (s) => s.usedCardIds.includes('sarkasma_homework_you_hate') || s.flags.includes('homework_accepted'),
  },
  {
    id: 'glitchka_chat_entry',
    title: 'Pokec s Glitchkou',
    description:
      'Subjekt usedl vedle Glitchky. Ne před ní. Věci, které si sedají před tebe, něco chtějí. Věci vedle tebe občas jen čekají, jestli začneš dýchat normálně.',
    check: (s) => s.usedCardIds.includes('glitchka_sits_next_to_you'),
    reward: { unlockPool: 'glitchka_chat_pool' },
  },
  {
    id: 'sat_silent_with_glitchka',
    title: 'Ticho vedle Glitchky',
    description:
      'Subjekt mlčel vedle Glitchky. Nepokusila se ticho opravit. Některé věty přežijí, i když se nikdy nevysloví.',
    check: (s) => s.usedCardIds.includes('glitchka_sits_next_to_you') || s.flags.includes('sat_silent_with_glitchka'),
  },
  {
    id: 'wrong_answer_allowed',
    title: 'Špatná odpověď je povolená',
    description:
      'Subjekt nechal odpověď plavat. Neopravila se. Jen přestala panikařit. Nemusíš být přesný, abys byl pravdivý.',
    check: (s) => s.usedCardIds.includes('glitchka_wrong_answer_is_allowed') || s.flags.includes('wrong_answer_allowed'),
  },
  {
    id: 'fake_glitchka_exposed',
    title: 'Falešná liška odhalena',
    description:
      'Subjekt rozpoznal Glitchku podle toho, že netlačila. Falešné bezpečí spěchá. Pravé počká, i když u toho trochu šustí pixely.',
    check: (s) => s.usedCardIds.includes('glitchka_fake_fox_test') || s.flags.includes('fake_glitchka_exposed'),
  },
  {
    id: 'glitchka_walked_to_exit',
    title: 'Glitchka doprovodila ke kraji',
    description:
      'Subjekt odešel vedle Glitchky. Neopravila ho. Neodnesla ho. Jen šla tak, aby si nemusel dokazovat samotu jako výkon.',
    check: (s) => s.usedCardIds.includes('glitchka_walks_you_to_exit') || s.flags.includes('glitchka_walked_to_exit'),
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

// ── FRESH META POOL STORAGE ───────────────────────────────────────────────────

const FRESH_META_POOLS_KEY = 'synthoma_cyklus_fresh_meta_pools';

export function loadFreshMetaPools(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FRESH_META_POOLS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch { return []; }
}

export function saveFreshMetaPools(pools: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FRESH_META_POOLS_KEY, JSON.stringify(pools));
  } catch { /* ignore */ }
}

export function addFreshMetaPools(newPools: string[]): void {
  if (typeof window === 'undefined') return;
  const existing = new Set(loadFreshMetaPools());
  for (const p of newPools) existing.add(p);
  saveFreshMetaPools([...existing]);
}

export function consumeFreshMetaPool(poolId: string): void {
  if (typeof window === 'undefined') return;
  const current = loadFreshMetaPools().filter((p) => p !== poolId);
  saveFreshMetaPools(current);
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
