import type { PlayerActionId } from './encounterTypes';

// ── Text pool types ───────────────────────────────────────────────────────────

export type ActionOutcome = 'success' | 'fail' | 'crit' | 'partial' | 'neutral';

export interface TextPool {
  texts: string[];
}

// ── Pick deterministically by (seed + round) ─────────────────────────────────

export function pickFromPool(pool: string[], round: number, seed: number): string {
  if (pool.length === 0) return '';
  const idx = (seed + round * 7) % pool.length;
  return pool[idx] ?? pool[0] ?? '';
}

// ── Action intro texts (before outcome) ───────────────────────────────────────

export const ACTION_INTRO_TEXTS: Record<PlayerActionId, string[]> = {
  attack: [
    'Subjekt zaútočil způsobem, který systém odmítl klasifikovat jako elegantní.',
    'Útok byl přímý, brutální a přesně tak drahý na energii, jak to znělo.',
    'Zásah bez předchozího varování. Ani jedna strana to nečekala úplně stejně.',
    'Útočná sekvence zahájena. Systém ji označil jako „neautorizovaný kontakt".',
    'Subjekt přeskočil fázi „přemýšlení" a přešel rovnou k části „litování".',
  ],
  dash: [
    'Subjekt se přesunul mimo definovatelný prostor. Realita to zaznamenala jako výjimku.',
    'Dash proběhl čistě. Systém to zapsal jako chybu měření, protože elegance se sem nehodí.',
    'Úhybný manévr. Subjekt se rozmazal do polohy, kde příchozí záměr nenašel cíl.',
    'Pohyb byl příliš rychlý na formulář. Formulář to nesl stoicky.',
    'Subjekt zmizel ze sektoru a vrátil se o krok dál. Fyzika to uzavřela bez komentáře.',
  ],
  hack: [
    'Subjekt přepsal záměr entity. Entita to nesla jako osobní poznámku.',
    'Hack proběhl. Systém zaznamenal „neautorizovanou editaci" a pokračoval dál.',
    'Přístup do vrstvy, ke které nikdo neměl přístup. Klasická chyba dokumentace.',
    'Přepsání záměru. Entita se dívala na výsledek a rozhodla se ho nepochopit.',
    'Hack byl technicky nelegální. Výsledky ho zpětně legitimizovaly, jak to bývá.',
  ],
  defend: [
    'Subjekt stabilizoval rámec. Stabilizace proběhla přesně tak syrově, jak zní.',
    'Obranná sekvence zahájena. Šum klesl o vrstvu, která se rozhodla ustoupit.',
    'Blok aktivován. Systém pozamenal, že to bylo zapotřebí, ale bez pochvaly.',
    'Subjekt zaujal obrannou pozici. Trvalo to tři sekundy. Bylo to správné rozhodnutí.',
    'Rámec zpevněn. Entita na druhé straně to vnímala jako provokaci klidem.',
  ],
  sarcasm: [
    'Subjekt se rozhodl komentovat situaci místo toho, aby ji řešil. Výsledky jsou smíšené.',
    'Sarkasmus jako taktika. Funguje překvapivě dobře nebo překvapivě špatně. Jiné varianty neexistují.',
    'Poznámka byla přesná, stručná a okamžitě zhoršila atmosféru. Tedy kvalitní práce.',
    'Subjekt verbálně destabilizoval entitu způsobem, který systém neuměl zaznamenat.',
    'Komentář byl podán s výrazem člověka, který ví, že to dopadne špatně, a stejně to říká.',
  ],
};

// ── Outcome texts ─────────────────────────────────────────────────────────────

export const ACTION_OUTCOME_TEXTS: Record<string, string[]> = {
  attack_success: [
    'Zásah prošel. Entita to přijala s výrazem, který by na lidské tváři byl překvapením.',
    'Poškození způsobeno. Systém to zaznamenal a neptal se proč.',
    'Útok zasáhl cíl přesně. Cíl s tím nesouhlasil, ale neměl argumenty.',
    'Entita přijala zásah a recyklovala ho do motivace. Chybný výpočet.',
    'Poškození přijato. Část entity přestala existovat v původní konfiguraci.',
  ],
  attack_fail: [
    'Útok minul. Systém to uzavřel jako „nepřesná predikce trajektorie".',
    'Zásah nepřišel. Entita se tvářila, jako by to čekala.',
    'Útočná sekvence selhala v bodě dopadu. Bod dopadu nespolupracoval.',
    'Minuto. Entita se posunula o milimetr — ten správný milimetr.',
    'Poškození 0. Subjekt se rozhodl tuto statistiku nepublikovat.',
  ],
  attack_crit: [
    'Kritický zásah. Část entity, která dosud existovala pevně, přestala.',
    'Přesný zásah v nestabilním bodě. Výsledek byl hlasitý.',
    'Kritické poškození způsobeno. Systém to označil jako „přehnaná reakce ze strany entity".',
    'Crit. Entita se rozpadla o víc, než plánovala. Plánování nebylo její silnou stránkou.',
    'Přímý zásah do jádrové struktury. Entita to nesla špatně.',
  ],
  dash_success: [
    'Úhybný manévr zdařen. Záměr prošel kolem subjektu a zasáhl prázdnotu.',
    'Subjekt se rozmazal mimo zásah. Nepřítel trefil jen ozvěnu a ještě se tvářil uraženě.',
    'Dash úspěšný. Blok absorboval zbytek. Fyzika to uzavřela bez komentáře.',
    'Pohyb byl správný. Entita promrhala záměr na vzduch, který subjekt opustil.',
    'Vyhnutí se zdařilo. Sektor to zapsal jako „temporální dissonanci pohybu".',
  ],
  dash_partial: [
    'Subjekt se téměř vyhnul. „Téměř" je statisticky nejhorší adverb.',
    'Dash byl pozdě o půl sekundy. Část záměru přesto prošla.',
    'Vyhnutí neúplné. Blok zachytil část, zbytek si vzal realita.',
    'Pohyb správný, načasování neoptimální. Systém to zaznamenal bez empatie.',
    'Subjekt se vyhnul — skoro. Skoro je vždy dostatečně špatné.',
  ],
  hack_success: [
    'Záměr přepsán. Entita zjistila, že její plán byl upraven bez souhlasu.',
    'Hack proběhl. Systém to zaznamenal jako „neautorizovanou editaci" a pokračoval dál.',
    'Přepsání záměru zdařeno. Entita se dívala na výsledek a rozhodla se ho nepochopit.',
    'Záměr zrušen. Entita to vzala osobně, ale osobně ji to nepomohlo.',
    'Hack úspěšný. Vrstva, která blokovala, přestala existovat v původní funkci.',
  ],
  hack_fail: [
    'Hack selhal. Systém to uzavřel jako „nekompatibilní přístupová práva".',
    'Přepis záměru neprojde. Entita má lepší zabezpečení, než vypadala.',
    'Přístup odepřen. Subjekt to zkusil znovu. Výsledek byl stejný.',
    'Hack odmítnut. Vrstva odolala způsobem, který byl technicky překvapivý.',
    'Záměr zůstal. Hack ho nedosáhl. Subjekt to přijal jako učební moment.',
  ],
  defend_success: [
    'Blok aktivován. Příchozí záměr se rozbil o strukturu, která odmítla ustoupit.',
    'Obrana stabilizována. Šum klesl. Sektor byl o krok tišší.',
    'Blok absorboval vše. Systém to zaznamenal jako „neočekávané přežití subjektu".',
    'Rámec zpevněn. Útok přišel a odešel bez výsledku. Entita to nesla špatně.',
    'Obranná sekvence zdařena. Subjekt stojí. Entita přehodnocuje strategii.',
  ],
  sarcasm_good: [
    'Sarkasmus fungoval. Entita byla destabilizována způsobem, který systém neuměl zaznamenat.',
    'Komentář prošel. Entita udělala chybu, protože ji komentář zasáhl v místě, kde nečekala logiku.',
    'Sarkastická poznámka způsobila poškození. Subjekt vypadal překvapen. Entita také.',
    'Šarm zafungoval jako útočná zbraň. Systém to uzavřel jako „anomální interakci".',
    'Výsledek byl dobrý. Subjekt to zopakuje, dokud to přestane fungovat.',
  ],
  sarcasm_bad: [
    'Sarkasmus selhal. Entita ho nepochopila, nebo pochopila příliš dobře.',
    'Komentář vrátil Šum. Systém to označil jako „kontraproduktivní verbální sekvenci".',
    'Sarkasmus fungoval obráceně. Subjekt to předvídal a přesto to udělal.',
    'Poznámka nedopadla. Entita ji přijala jako kompliment. Subjekt to skrýval.',
    'Výsledek horší než neutralita. Sarkasmus jako taktika má limity — právě jeden z nich.',
  ],
  sarcasm_crit: [
    'Kritický sarkasmus. Entita se rozpadla pod tíhou přesné poznámky.',
    'Komentář zasáhl přesně tam, kde to entitě nejvíc vadilo. Systém to zaznamenal jako anomálii.',
    'Sarkasmus na úrovni zbraně. Entita si to pamatuje. Pokud přežije.',
    'Přesná destruktivní poznámka. Entita ztratila část stability, kterou nechtěla ztratit.',
    'Crit sarkasmus. Jednou za život funguje dokonale. Tohle byl ten moment.',
  ],
};

// ── Enemy flavour texts ───────────────────────────────────────────────────────

export const ENEMY_FLAVOUR_TEXTS: Record<string, string[]> = {
  'sumovy-bezec': [
    'Má příliš mnoho kloubů a žádný důvod zpomalit.',
    'Pohybuje se jako chyba, která se rozhodla být fyzická.',
    'Nestabilní, rychlá, trapně sebejistá.',
  ],
  'archivni-chyba': [
    'Nepřišla bojovat. Přišla dokumentovat. To je horší.',
    'Data, která se rozhodla nebýt správná.',
    'Entita bez těla, jen s formuláři.',
  ],
  'acidova-larva': [
    'Malá. Průhledná. Pomalu tě přepisuje Šumem.',
    'Nevinně vypadající. Jako vždy.',
    'Nechte ji být a bude tě kazit v tichosti.',
  ],
  'formularovy-dozorce': [
    'Přišel zkontrolovat dokumentaci. Nemáš ji. To ho nezajímá.',
    'Nese zásobník formulářů, které nikdo nevyplnil správně.',
    'Rozhořčen. Ale profesionálně.',
  ],
  'pametova-selma': [
    'Velká. Mlčenlivá. Pamatuje každý omyl, který jsi udělal.',
    'Z vrstev pod tímto sektorem, kde se ukládají věci na zapomenutí.',
    'Pohybuje se, jako by tě znala lépe než ty sám.',
  ],
  'zrcadlovy-subjekt': [
    'Vypadá jako ty. Není jako ty.',
    'Verze tebe, která neměla šanci se rozhodnout jinak.',
    'Na každou akci existuje reakce. Hlavně ta špatná.',
  ],
  'nekonecny-formular': [
    'Sedm stran. Žádný účel. Tón člověka, který miluje kolonky.',
    'Formulář se rozvinul přes celou místnost a požaduje součinnost.',
    'Každá fáze má přílohu. Přílohy mají přílohy.',
  ],
};

// ── Void pressure stage texts ─────────────────────────────────────────────────

export const VOID_STAGE_TRANSITION_TEXTS: Record<string, string> = {
  '5_to_6':  'LOG [VOID_AKTIVNÍ]: Prázdnota se probudila. Nepřátelé reagují jinak.',
  '10_to_11': 'LOG [VOID_ZVÝŠENÝ]: Sektor začíná být nestabilní. Eventy se mění.',
  '15_to_16': 'LOG [VOID_KRITICKÝ]: Prázdnota se plíží do každého encounteru.',
  '19_to_20': 'LOG [VOID_KOLAPS]: Finální audit. Subjekt nemá kam utéct.',
};

// ── Fragmentation texts ───────────────────────────────────────────────────────

export const FRAGMENTATION_TEXTS: Record<number, string> = {
  1: 'LOG [FRAGMENTACE_1]: Strukturální poškození. Maximální HP sníženo. Systém to zapsal jako varování.',
  2: 'LOG [FRAGMENTACE_2]: Subjekt nestabilní. Každý další encounter začíná se Šumem.',
  3: 'LOG [FRAGMENTACE_3]: Subjekt neutralizován. Průchod ukončen. Formulář Z-0 byl vyplněn automaticky.',
};

// ── Noise collapse text ───────────────────────────────────────────────────────

export const NOISE_COLLAPSE_TEXT =
  'LOG [ŠUMOVÝ_KOLAPS]: Šum dosáhl kritické hladiny. Subjekt přestal být koherentní. ' +
  'Systém to uzavřel jako „přirozený výsledek nekontrolované nestability".';
