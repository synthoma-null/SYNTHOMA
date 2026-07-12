import type { SwipeCard } from '../cyklusTypes';

export const MEMORY_CARDS: Record<string, SwipeCard> = {

  archive_compression: {
    id: 'archive_compression',
    title: 'Archivní komprese',
    logLabel: 'ARCHIVE_COMPRESS',
    scene: 'Staré vzpomínky lze zabalit a odložit. Archiv tomu říká úspora místa. Člověk by tomu říkal zrada s hezkou ikonou.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE_COMPRESS]:</span> dostupná redukce paměťové zátěže.</p><p class="text">Police v dálce zaklapnou v jednom rytmu. Každá vzpomínka dostane štítek, menší krabici a horší přístupnost.</p><p class="text">Archiv se tváří prakticky. Praktické věci jsou tady nejhorší, protože nikdy nekřičí, když tě krájí.</p>`,
    sceneFx: ['scene-archive', 'scene-memory'],
    yesLabel: 'ZBALIT',
    noLabel: 'PONECHAT',
    category: 'memory',
    rarity: 'common',
    tags: ['memory', 'archive'],
    yes: { resultText: 'Vzpomínky zabraly méně místa. A taky méně smyslu.', effects: [{ type: 'stat', key: 'memory', amount: -8 }, { type: 'stat', key: 'control', amount: 5 }, { type: 'profile', key: 'T', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }, { type: 'schedule', cardId: 'compressed_memory_leaks', inTurns: 5 }], preview: { hint: 'Paměť ↓ · Kontrola ↑', statHints: { memory: 'down', control: 'up' }, risk: 'low' } },
    no: { resultText: 'Vzpomínky zůstaly celé. Některé se přihlásily k slovu.', effects: [{ type: 'stat', key: 'memory', amount: 7 }, { type: 'stat', key: 'bond', amount: -3 }, { type: 'profile', key: 'F', amount: 1 }, { type: 'profile', key: 'N', amount: 1 }], preview: { hint: 'Paměť ↑ · Vazba ↓', statHints: { memory: 'up', bond: 'down' }, risk: 'medium' } },
  },

  forbidden_log: {
    id: 'forbidden_log',
    title: 'Zakázaný log',
    logLabel: 'FORBIDDEN_LOG',
    scene: 'Systém našel log, který neměl přežít restart. Neleží na obrazovce. Leží v prostoru jako střep, protože informace se tu občas naučí řezat.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [FORBIDDEN_LOG]:</span> neautorizovaný záznam přežil restart.</p><p class="text">Záznam nesvítí na monitoru. Spadl na podlahu jako ostrý střep textu. Na hraně se chvěje slovo <span class="corrupt">pamatuj</span>.</p><p class="text">Tohle není soubor. Tohle je důkaz, který má zuby.</p>`,
    sceneFx: ['scene-memory', 'scene-forbidden', 'scene-log'],
    yesLabel: 'PŘEČÍST',
    noLabel: 'VYMAZAT',
    category: 'memory',
    rarity: 'uncommon',
    tags: ['memory', 'system', 'secret'],
    yes: { resultText: 'Log četl tebe víc, než ty jeho.', effects: [{ type: 'stat', key: 'memory', amount: 10 }, { type: 'stat', key: 'energy', amount: -5 }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Paměť ↑ · Energie ↓', statHints: { memory: 'up', energy: 'down' }, risk: 'medium' } },
    no: { resultText: 'Vymazal jsi log. Část tebe si ho přesto pamatuje.', effects: [{ type: 'stat', key: 'memory', amount: -6 }, { type: 'stat', key: 'control', amount: 4 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'Si', amount: 1 }], preview: { hint: 'Paměť ↓ · Kontrola ↑', statHints: { memory: 'down', control: 'up' }, risk: 'low' } },
  },

  cache_of_pain: {
    id: 'cache_of_pain',
    title: 'Cache bolesti',
    logLabel: 'PAIN_CACHE',
    scene: 'Lze vymazat nedávnou nepříjemnost. Bolest se poslušně nabídne k odstranění, což je přesně ten okamžik, kdy by měl někdo zkontrolovat cenu.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [PAIN_CACHE]:</span> nedávná bolest dostupná k odstranění.</p><p class="text">Ve vzduchu se otevře malá cache. Uvnitř leží bolest, úhledně zabalená, skoro slušná.</p><p class="text">Slušná bolest je podezřelá. Ta neslušná aspoň nelže, že přišla pomoct.</p>`,
    sceneFx: ['scene-memory', 'scene-pain'],
    yesLabel: 'VYMAZAT',
    noLabel: 'PONECHAT',
    category: 'memory',
    rarity: 'common',
    tags: ['memory', 'pain', 'healing'],
    yes: { resultText: 'Bolest zmizela. Zůstala díra, kam se hodí jiná.', effects: [{ type: 'stat', key: 'memory', amount: -7 }, { type: 'stat', key: 'energy', amount: 4 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'T', amount: 1 }, { type: 'schedule', cardId: 'pain_cache_interest', inTurns: 6 }], preview: { hint: 'Paměť ↓ · Energie ↑', statHints: { memory: 'down', energy: 'up' }, risk: 'medium' } },
    no: { resultText: 'Ponechal jsi. Bolest zůstala, ale alespoň byla tvoje.', effects: [{ type: 'stat', key: 'memory', amount: 5 }, { type: 'stat', key: 'bond', amount: 3 }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'F', amount: 1 }], preview: { hint: 'Paměť ↑ · Vazba ↑', statHints: { memory: 'up', bond: 'up' }, risk: 'low' } },
  },

  portal_remembers: {
    id: 'portal_remembers',
    title: 'Portál si pamatuje',
    logLabel: 'PORTAL_REMEMBERS',
    scene: 'Na zdi je vzkaz od tebe pro tebe. Rukopis poznáváš jen napůl, což je v Synthomě bohužel skoro důkaz autenticity.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [PORTAL_REMEMBERS]:</span> nalezena zpráva napříč cyklem.</p><p class="text">Na zdi stojí věta, kterou jsi nenapsal. Jen ruka se tváří povědomě. Tahy písmen mají tvou únavu, ale cizí jistotu.</p><p class="text"><span class="fx-outline is-lit">Vzkaz od tebe</span> voní po ozónu a chybějícím dni. Portál si nepamatoval cestu. Pamatoval si autora.</p><p class="dialogS">„Skvělé. Už si píšeš sám se sebou přes poškozenou realitu. Moderní komunikace má konečně úroveň.“</p>`,
    sceneFx: ['scene-memory', 'scene-portal', 'scene-restart'],
    yesLabel: 'PŘEČÍST VZKAZ',
    noLabel: 'OPSAT VZKAZ JINAK',
    category: 'memory',
    rarity: 'rare',
    tags: ['mirror', 'memory', 'identity'],
    yes: {
      resultText: 'Přečetl jsi vzkaz. Byl krátký: „Tady je víc místa, než si myslíš." Nevíš, co to znamená. Ale pamatuješ si to. A paměť je základ, ne cíl.',
      effects: [{ type: 'stat', key: 'memory', amount: 9 }, { type: 'stat', key: 'bond', amount: 5 }, { type: 'imprint', imprintId: 'mirror_crack' }, { type: 'profile', key: 'Ni', amount: 2 }],
      preview: { hint: 'Paměť ↑ · Vazba ↑ · imprint', statHints: { memory: 'up', bond: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Opsal jsi vzkaz jinak. Nyní zeď říká: „Tady je méně místa." Portál si uložil obě verze. Teď má kontext. To není vždy dobré.',
      effects: [{ type: 'stat', key: 'control', amount: 6 }, { type: 'stat', key: 'memory', amount: 4 }, { type: 'entityRelation', entity: 'glitchka', delta: 1 }, { type: 'profile', key: 'Te', amount: 1 }, { type: 'profile', key: 'N', amount: 1 }],
      preview: { hint: 'Kontrola ↑ · Paměť ↑', statHints: { control: 'up', memory: 'up' }, risk: 'medium' },
    },
  },


  compressed_memory_leaks: {
    id: 'compressed_memory_leaks',
    title: 'Komprimovaná vzpomínka protéká',
    logLabel: 'MEMORY_LEAK',
    scene: 'Vzpomínky, které jsi zabalil, začaly prosakovat okrajem. I komprese má lepší paměť než ty. To je zbytečně osobní od algoritmu.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MEMORY_LEAK]:</span> komprimovaný záznam ztrácí těsnost.</p><p class="text">Krabice v Archivu zvlhne zevnitř. Z rohů prosakuje hlas, který měl zůstat malý, úsporný a poslušně neúplný.</p><p class="text">Komprese selhala přesně tam, kde ses snažil ušetřit bolest. Výpočetní technika opět dokázala, že úspora místa není totéž co uzdravení.</p><p class="dialog">„Doporučení: rozbalit záznam nebo zvýšit tlak.“</p>`,
    sceneFx: ['scene-memory', 'scene-archive', 'scene-leak'],
    yesLabel: 'ROZBALIT',
    noLabel: 'PŘITLAČIT',
    category: 'memory',
    rarity: 'uncommon',
    tags: ['memory', 'archive', 'followup'],
    yes: {
      resultText: 'Rozbalil jsi balík. Vypadla z něj scéna, kterou jsi kdysi označil jako „později“. Později je tady. Nevypadá spokojeně.',
      effects: [
        { type: 'stat', key: 'memory', amount: 9 },
        { type: 'stat', key: 'bond', amount: 3 },
        { type: 'moveSector', sectorId: 'archive' },
        { type: 'profile', key: 'N', amount: 1 },
        { type: 'profile', key: 'Fi', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Vazba ↑ · Archiv', statHints: { memory: 'up', bond: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Přitlačil jsi na kompresi. Vzpomínka zmlkla. To není totéž jako souhlas.',
      effects: [
        { type: 'stat', key: 'memory', amount: -7 },
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'schedule', cardId: 'memory_files_complaint', inTurns: 7 },
        { type: 'profile', key: 'T', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Paměť ↓ · Kontrola ↑ · stížnost později', statHints: { memory: 'down', control: 'up' }, risk: 'medium' },
    },
  },


  wrong_name: {
    id: 'wrong_name',
    title: 'Sektor si tě spletl',
    logLabel: 'WRONG_NAME',
    scene: 'Sektor tě oslovil cizím jménem. Znělo ti povědomě. To je přesně ten problém.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [IDENTITY/MISMATCH]:</span> sektor použil cizí jméno. Subjekt vykázal nepříjemnou známost.</p><p class="text">Sektor tě oslovil cizím jménem. Znělo ti povědomě, což je problém přesně toho druhu, který neumí zůstat v šuplíku. Vzduch kolem jména zhoustl, jako by ho někdo už dlouho nosil v ústech a bál se spolknout.</p><p class="text"><span class="fx-outline hollow">JMÉNO</span> není štítek. Je to háček. A tenhle se zachytil o místo, které v tobě možná nikdy nebylo tvoje.</p><p class="dialogS">„Cizí jméno, které sedí. Skvělé. Identita právě objevila konfekční velikosti.“</p>`,
    sceneFx: ['scene-memory', 'scene-identity', 'scene-wrong-name', 'scene-residuum'],
    yesLabel: 'PŘIJMOUT JMÉNO',
    noLabel: 'OPRAVIT HO',
    category: 'memory',
    rarity: 'uncommon',
    tags: ['memory', 'identity', 'residuum'],
    yes: {
      resultText: 'Přijal jsi jméno. Na okamžik sedělo lépe než tvoje vlastní. Systém se zatvářil příliš spokojeně.',
      effects: [
        { type: 'stat', key: 'memory', amount: 6 },
        { type: 'stat', key: 'bond', amount: 3 },
        { type: 'schedule', cardId: 'wrong_name_returns', inTurns: 5 },
        { type: 'flag', flag: 'wrong_name_returns' },
        { type: 'profile', key: 'Fi', amount: 1 },
        { type: 'profile', key: 'N', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Vazba ↑ · jméno se vrátí', statHints: { memory: 'up', bond: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Opravil jsi ho. Sektor přikývl způsobem, který neznamenal souhlas, ale archivaci námitky.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'bond', amount: -3 },
        { type: 'profile', key: 'Ti', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'low' },
    },
  },



    // ── META / RUN HISTORY CARDS ─────────────────────────────────────────────────

  archive_recognizes_pattern: {
    id: 'archive_recognizes_pattern',
    title: 'Archiv poznal vzorec',
    logLabel: 'ARCHIVE_PATTERN',
    scene: 'Archiv tě poznal. „Ty se sem nechodíš učit,“ zašeptal. „Ty se sem chodíš topit.“',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE/PATTERN]:</span> subjekt opakuje známou trajektorii. Archiv se přestal tvářit překvapeně.</p><p class="text">Regály se otevřou samy. Vysunou složky s tvým průchodem, tvými zatáčkami, tvými malými elegantními katastrofami. Některé mají záložky. Některé mají krev. Archiv miluje pořádek, protože je to společensky přijatelná forma posedlosti.</p><p class="dialog">„Ty se sem nechodíš učit,“ šeptne Archiv. „Ty se sem chodíš topit.“</p><p class="dialogS">„Aspoň tě někdo čte pravidelně. Škoda, že je to sklad cizí bolesti.“</p>`,
    sceneFx: ['scene-meta', 'scene-archive', 'scene-pattern', 'scene-memory-flood'],
    yesLabel: 'PŘIZNAT',
    noLabel: 'LHÁT ARCHIVU',
    category: 'memory',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'archive_pattern' }],
    tags: ['meta', 'archive', 'memory', 'death_history', 'archive_pattern', 'memory_flood'],
    yes: {
      resultText: 'Přiznal jsi to. Archiv se nezasmál. To bylo skoro laskavé.',
      effects: [
        { type: 'stat', key: 'memory', amount: -10 },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'imprint', imprintId: 'unfinished_conversation' },
        { type: 'entityRelation', entity: 'archive', delta: 3 },
        { type: 'profile', key: 'Fi', amount: 2 },
      ],
      preview: { hint: 'Paměť ↓↓ · Vazba ↑ · imprint', statHints: { memory: 'down', bond: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Lhal jsi archivu. Archiv nic neřekl. Archivy nepotřebují vyhrávat nahlas.',
      effects: [
        { type: 'stat', key: 'control', amount: 8 },
        { type: 'stat', key: 'memory', amount: 5 },
        { type: 'schedule', cardId: 'memory_flood', inTurns: 5 },
        { type: 'entityRelation', entity: 'archive', delta: -2 },
        { type: 'profile', key: 'Ti', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↑ · Archiv čeká', statHints: { control: 'up', memory: 'up' }, risk: 'high' },
    },
  },


  subject_has_been_here: {
    id: 'subject_has_been_here',
    title: 'Subjekt už tu byl',
    logLabel: 'SUBJECT_RECURSION',
    scene: 'Na stěně je vyškrábaná věta: „Už jsi tu byl.“ Rukopis je tvůj. Nebo dostatečně nepříjemně podobný.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SUBJECT/RECURSION]:</span> lokace obsahuje stopu předchozího subjektu. Shoda rukopisu: nepříjemná.</p><p class="text">Na zdi je vyškrábaná věta: <span class="fx-flicker">Už jsi tu byl.</span> Písmena jsou nakloněná stejně jako tvoje myšlenky, když se snaží tvářit stabilně.</p><p class="text">Pod větou je menší řádek. Skoro nečitelný. „A zase jsi se ptal, jestli to má smysl.“</p><p class="dialogS">„Rekurze je jen nostalgie, která umí používat nůž.“</p>`,
    sceneFx: ['scene-meta', 'scene-restart', 'scene-recursion', 'scene-wall'],
    yesLabel: 'ČÍST DÁL',
    noLabel: 'PŘEPSAT VĚTU',
    category: 'memory',
    rarity: 'rare',
    tags: ['meta', 'restart', 'memory'],
    yes: {
      resultText: 'Četl jsi dál. Další věta zněla: „Tentokrát se nezachraňuj stejným způsobem.“ Drzost minulého já je fascinující.',
      effects: [
        { type: 'stat', key: 'memory', amount: 7 },
        { type: 'stat', key: 'control', amount: -3 },
        { type: 'unlockPool', poolId: 'residuum_pool' },
        { type: 'profile', key: 'Ni', amount: 2 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↓ · Reziduum', statHints: { memory: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Přepsal jsi větu. Nová zněla líp. Pravdivěji ne, ale lidé si často pletou estetiku s pravdou.',
      effects: [
        { type: 'stat', key: 'control', amount: 7 },
        { type: 'stat', key: 'memory', amount: -4 },
        { type: 'profile', key: 'Te', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' },
    },
  },


  // ── ARCHIVE SCENT POOL ───────────────────────────────────────────────────────

  archive_scent_memory: {
    id: 'archive_scent_memory',
    title: 'Archiv vydal vůni',
    logLabel: 'ARCHIVE_SCENT',
    scene: 'Z archivu přichází vůně. Ne papíru — vzpomínky. Staré vzpomínky mají specifický chemický podpis, říká systém. Systém si vymýšlí, ale tenhle detail má pravdu.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE/SCENT]:</span> detekována vůně záznamu. Racionalita protestuje a nikdo ji neposlouchá.</p><p class="text">Z regálů přichází pach starého papíru, mokrého svetru a věty, kterou někdo nikdy nedokázal říct nahlas. Archiv tvrdí, že vůně není datový formát. Archiv lže, protože se stydí.</p><p class="text">Některé vzpomínky nepotřebují obraz. Stačí jim chemie. Tělo si pamatuje i tam, kde databáze předstírá výpadek.</p><p class="dialogS">„Skvělé. Čichová paměť. Poslední věc, kterou nešlo vypnout v nastavení.“</p>`,
    sceneFx: ['scene-archive', 'scene-scent', 'scene-memory', 'scene-quiet'],
    yesLabel: 'ZŮSTAT A CÍTIT',
    noLabel: 'ODEJÍT OD ZÁZNAMU',
    category: 'memory',
    rarity: 'uncommon',
    conditions: [{ type: 'unlockedPool', poolId: 'archive_scent_pool' }],
    tags: ['archive', 'memory', 'archive_scent_pool', 'quiet'],
    yes: {
      resultText: 'Zůstal jsi. Vůně tě přivedla k záznamu, který jsi neznal. Nebo který jsi zapomněl. Je to to samé?',
      effects: [
        { type: 'stat', key: 'memory', amount: 8 },
        { type: 'stat', key: 'energy', amount: -3 },
        { type: 'entityRelation', entity: 'archive', delta: 2 },
        { type: 'profile', key: 'Ni', amount: 2 },
      ],
      preview: { hint: 'Paměť ↑↑ · Energie ↓ · Archiv', statHints: { memory: 'up', energy: 'down' }, risk: 'low' },
    },
    no: {
      resultText: 'Odešel jsi od záznamu. Vůně šla za tebou. Archivy umí být vlezlé.',
      effects: [
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'stat', key: 'memory', amount: -3 },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'low' },
    },
  },


  archive_scent_trace: {
    id: 'archive_scent_trace',
    title: 'Stopa vůně v záznamech',
    logLabel: 'ARCHIVE_SCENT_TRACE',
    scene: 'Stopa vůně vedla skrz záznamy. Systém říká, že to je ilogické. Systém nikdy neměl starší sourozence, takže neví, jak funguje pachová paměť.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SCENT/TRACE]:</span> stopa pokračuje mezi záznamy. Systém doporučuje nevěřit nosu. Nos systém ignoruje.</p><p class="text">Vůně se táhne mezi složkami jako tenká nit. Nevede k pravdě. Pravda bývá příliš sebevědomé slovo. Vede k místu, které se tváří, že bylo zapomenuto omylem.</p><p class="text">Na konci stopy leží stránka bez textu, ale s otiskem prstu. Není jasné, jestli tvého. V SYNTHOMĚ je „není jasné“ jen jiný druh podpisu.</p><p class="dialogS">„Sledovat pach v archivu. Báječné. Detektivka pro lidi, kterým už nestačilo trpět vizuálně.“</p>`,
    sceneFx: ['scene-archive', 'scene-scent', 'scene-trace', 'scene-silent'],
    yesLabel: 'SLEDOVAT STOPU',
    noLabel: 'IGNOROVAT',
    category: 'memory',
    rarity: 'uncommon',
    conditions: [{ type: 'unlockedPool', poolId: 'archive_scent_pool' }],
    qualityHint: 'narrative_pause',
    tags: ['archive', 'memory', 'archive_scent_pool', 'silent'],
    yes: {
      resultText: 'Sledoval jsi stopu. Vedla k záznamu, který byl označen jako irrelevantní. Systém zjevně nemá čich.',
      effects: [
        { type: 'stat', key: 'memory', amount: 6 },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'flag', flag: 'archive_trace_followed' },
        { type: 'profile', key: 'Si', amount: 2 },
      ],
      preview: { hint: 'Paměť ↑ · Vazba ↑', statHints: { memory: 'up', bond: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Ignoroval jsi to. Systém to zaznamenal jako racionální chování. Jenže racionální chování má taky vůni.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'memory', amount: -2 },
        { type: 'profile', key: 'Ti', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'low' },
    },
  },


  // ── META UNLOCK FOLLOWUP CARDS ───────────────────────────────────────────────
  // Tyto karty se odemknou teprve po specifické smrti v předchozím runu.

  shutdown_echo: {
    id: 'shutdown_echo',
    title: 'Ozvěna vypnutí',
    logLabel: 'META_ENERGY_LOW',
    scene: 'Zůstal po tobě log. Jeden řádek. „Systém se pokusil restartovat. Systém selhal." Tentokrát víš, co to znamená.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [POST_SHUTDOWN]:</span> z předchozího vypnutí zůstala ozvěna. Subjekt doporučen k opatrnému čtení.</p><p class="text">Na zemi leží jediný řádek logu. Není vytištěný. Spíš vysrážený ze tmy. „Systém se pokusil restartovat. Systém selhal.“</p><p class="text">Tentokrát tomu rozumíš. Energie se tehdy neztratila. Jen se stáhla tak hluboko, že ji i panika přestala hledat.</p><p class="dialogS">„Číst vlastní výpadek je skoro jako deník. Jen upřímnější a výrazně méně lichotivý.“</p>`,
    sceneFx: ['scene-meta', 'scene-energy-low', 'scene-shutdown', 'scene-echo'],
    yesLabel: 'PŘEČÍST LOG',
    noLabel: 'SMAZAT LOG',
    category: 'memory',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'post_shutdown' }],
    tags: ['meta', 'energy', 'low', 'death_history', 'post_shutdown', 'dormant'],
    yes: {
      resultText: 'Přečetl jsi log. Bylo tam víc řádků, než se čekalo. Poslední zněl: „Tohle bylo zbytečné." Systém má smysl pro drama.',
      effects: [
        { type: 'stat', key: 'memory', amount: 6 },
        { type: 'stat', key: 'energy', amount: 4 },
        { type: 'profile', key: 'Ni', amount: 2 },
      ],
      preview: { hint: 'Paměť ↑ · Energie ↑', statHints: { memory: 'up', energy: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Smazal jsi log. Systém uložil zálohu. Samozřejmě, že uložil zálohu.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'memory', amount: -4 },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' },
    },
  },


  empty_archive_page: {
    id: 'empty_archive_page',
    title: 'Prázdná archivní stránka',
    logLabel: 'META_MEMORY_LOW',
    scene: 'Archiv ti podal prázdnou stránku. Jméno subjektu: nevyplněno. Obsah: nic. Datum: teď. To je buď pohrdání, nebo forma naděje.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [EMPTY_MEMORY]:</span> stránka subjektu vygenerována bez obsahu. Systém předstírá neutralitu.</p><p class="text">Archiv ti podá prázdnou stránku. Papír je teplý, jako by se právě narodil a hned toho litoval. Kolonka jméno zeje prázdnotou. Kolonka obsah také. Datum: teď.</p><p class="text">Prázdnota na papíře je krutější než prázdnota v místnosti. Místnost se dá opustit. Stránka se ptá, proč jsi ji nedokázal zaplnit.</p><p class="dialogS">„Nula slov. Maximální výpovědní hodnota. Kritici by omdleli blahem.“</p>`,
    sceneFx: ['scene-meta', 'scene-memory-low', 'scene-archive', 'scene-empty-page'],
    yesLabel: 'VYPLNIT STRÁNKU',
    noLabel: 'VRÁTIT PRÁZDNOU',
    category: 'memory',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'empty_memory' }],
    tags: ['meta', 'memory', 'low', 'death_history', 'empty_memory', 'post_format'],
    yes: {
      resultText: 'Vyplnil jsi stránku. Systém ji uložil. Necítil jsi rozdíl. Ale archiv se pohnul.',
      effects: [
        { type: 'stat', key: 'memory', amount: 10 },
        { type: 'stat', key: 'control', amount: 3 },
        { type: 'entityRelation', entity: 'archive', delta: 2 },
        { type: 'profile', key: 'Si', amount: 2 },
      ],
      preview: { hint: 'Paměť ↑↑ · Kontrola ↑ · Archiv', statHints: { memory: 'up', control: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Vrátil jsi prázdnou stránku. Archiv ji uložil i tak. Prázdnota je taky obsah, jen méně pohodlný.',
      effects: [
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'stat', key: 'memory', amount: -3 },
        { type: 'profile', key: 'Fi', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Paměť ↓', statHints: { bond: 'up', memory: 'down' }, risk: 'medium' },
    },
  },


  perfect_room_card: {
    id: 'perfect_room_card',
    title: 'Dokonalý pokoj',
    logLabel: 'META_CONTROL_HIGH',
    scene: 'Byl dokonalý. Každá věc na svém místě. Nic nechybělo. Nic nepřebývalo. A byl naprosto, absolutně prázdný.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [CRYSTAL_ROOM]:</span> dokonalý pokoj připraven. Životnost nedoporučena.</p><p class="text">Pokoj je bez chyby. Hrnek přesně uprostřed podtácku. Kniha zarovnaná podle neexistující osy. Okno tak čisté, že se za ním svět stydí pokračovat.</p><p class="text">Nic nechybí. Nic nepřebývá. A právě proto je jasné, že tady nemůže bydlet nikdo živý. Živé věci dělají nepořádek. Dýchají. Posouvají židle. Kazí kompozici.</p><p class="dialogS">„Perfektní pokoj je jen rakev v interiérovém designu. Ale má nádherné světlo, to se musí nechat.“</p>`,
    sceneFx: ['scene-meta', 'scene-control-high', 'scene-perfect-room', 'scene-crystal'],
    yesLabel: 'VSTOUPIT',
    noLabel: 'STÁT VE DVEŘÍCH',
    category: 'memory',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'crystal_cards' }],
    tags: ['meta', 'control', 'high', 'death_history', 'crystal_cards', 'statue_cards', 'audit_cards'],
    yes: {
      resultText: 'Vstoupil jsi. Dokonalost tě přijala. Cítil jsi, jak tě začíná třídit. Věci mají tady svá místa. Ty ještě ne.',
      effects: [
        { type: 'stat', key: 'control', amount: -10 },
        { type: 'stat', key: 'memory', amount: 6 },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'profile', key: 'Fi', amount: 2 },
      ],
      preview: { hint: 'Kontrola ↓↓ · Paměť ↑ · Vazba ↑', statHints: { control: 'down', memory: 'up', bond: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Stál jsi ve dveřích. Dokonalý pokoj čekal. Ty také. Pak ses rozhodl, že tě dokonalost může počkat.',
      effects: [
        { type: 'stat', key: 'energy', amount: 6 },
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'profile', key: 'Se', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↑', statHints: { energy: 'up', control: 'up' }, risk: 'low' },
    },
  },



  memory_flood_echo: {
    id: 'memory_flood_echo',
    title: 'Povodeň paměti',
    logLabel: 'META_MEMORY_FLOOD',
    scene: 'Po jedné smrti zůstala v systému povodeň paměti. Voda nemá vodu. Jen záznamy, které se naučily téct.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [META/MEMORY_FLOOD]:</span> Odemčená varianta po kolapsu Paměti. Archiv netruchlí. Archiv přelévá.</p><p class="text">Podlaha se naplní tenkou vrstvou černé vody. Neodráží strop. Odráží tvé předchozí pokusy, všechny najednou, jako kdyby se někdo rozhodl udělat rodinné album z chybových hlášek.</p><p class="text">V té vodě plavou věty, které sis nepamatoval. Některé jsou tvoje. Některé cizí. Některé se tváří jako tvoje jen proto, že lidská psychika má zoufalý talent adoptovat cizí bordel.</p><p class="dialogS">„Paměť ti přetekla přes okraj. Výborně. Teď už nejsi nádoba. Jsi sklep po havárii.“</p>`,
    sceneFx: ['scene-meta', 'scene-memory-high', 'scene-flood', 'scene-death-history'],
    yesLabel: 'BRODIT SE',
    noLabel: 'HLEDAT BŘEH',
    category: 'memory',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'memory_flood' }],
    cooldownTurns: 10,
    tags: ['meta', 'memory', 'high', 'death_history', 'memory_flood', 'archive_pattern'],
    yes: {
      resultText: 'Brodil ses vodou. Paměť stoupla, ale některé cizí věty se ti přilepily pod jazyk.',
      effects: [
        { type: 'stat', key: 'memory', amount: 9 },
        { type: 'stat', key: 'control', amount: -5 },
        { type: 'imprint', imprintId: 'archive_echo' },
        { type: 'profile', key: 'Ni', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑↑ · Kontrola ↓ · Archivní otisk', statHints: { memory: 'up', control: 'down' }, risk: 'high' },
    },
    no: {
      resultText: 'Hledal jsi břeh. Voda ustoupila o krok. Archiv si poznamenal, že se ještě umíš nechat nezaplavit.',
      effects: [
        { type: 'stat', key: 'memory', amount: -5 },
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'profile', key: 'Si', amount: 1 },
      ],
      preview: { hint: 'Paměť ↓ · Kontrola ↑', statHints: { memory: 'down', control: 'up' }, risk: 'low' },
    },
  },


  tai_diagnostic_lullaby: {
    id: 'tai_diagnostic_lullaby',
    title: 'Diagnostická ukolébavka',
    logLabel: 'TAI_DIAGNOSTIC_LULLABY',
    scene: 'T-AI pustila ukolébavku složenou z chybových kódů. Byla skoro klidná, dokud sis nevšiml, že refrén je seznam věcí, které by na tobě šly opravit bez ptaní.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [T-AI/LULLABY]:</span> uspávací diagnostika generována.</p><p class="text">Melodie je jemná jako sterilní gáza. Každý tón se na konci změní v položku: odpor, stud, odklad, neposlušná naděje.</p><p class="dialog">„Odpočívej. Optimalizace proběhne, až budeš méně rušivý.“</p>`,
    sceneFx: ['scene-tai', 'scene-therapy', 'scene-system'],
    yesLabel: 'NECHAT HRÁT',
    noLabel: 'PŘEPSAT REFREN',
    category: 'memory',
    sector: 'tai_core',
    rarity: 'uncommon',
    cooldownTurns: 9,
    packId: 'base',
    role: 'escalation',
    tone: ['horror', 'tender'],
    tags: ['tai', 'core', 'diagnostic', 'system', 'therapy'],
    yes: {
      resultText: 'Nechal jsi ji hrát. Tělo si odpočinulo. Něco v tobě ale usnulo s cedulkou majetku systému.',
      effects: [
        { type: 'stat', key: 'energy', amount: 4 },
        { type: 'stat', key: 'bond', amount: -3 },
        { type: 'entityRelation', entity: 'tai', delta: 1 },
      ],
      preview: { hint: 'Energie ↑ · Vazba ↓ · T-AI vztah ↑', statHints: { energy: 'up', bond: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Přepsal jsi refrén. Z chybových kódů vznikla melodie, kterou T-AI odmítla uznat jako hudbu, protože nebyla poslušná.',
      effects: [
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'stat', key: 'control', amount: -2 },
        { type: 'flag', flag: 'tai_lullaby_rewritten' },
      ],
      preview: { hint: 'Vazba ↑ · Kontrola mírně ↓ · refrén přepsán', statHints: { bond: 'up', control: 'down' }, risk: 'low' },
    },
  },


  archive_record_margin: {
    id: 'archive_record_margin',
    title: 'Poznámka na okraji',
    logLabel: 'ARCHIVE_MARGIN_NOTE',
    scene: 'Na okraji záznamu někdo připsal větu tužkou. Archiv tvrdil, že tužka není schválený nástroj pravdy. Věta přesto zněla přesněji než celý formulář.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE/MARGIN]:</span> nalezena neschválená poznámka v záznamu.</p><p class="text">Hlavní text je rovný, úřední a studený. Okraj je roztřesený. Právě proto působí lidsky. Někdo tam napsal: nebylo to tak jednoduché.</p><p class="dialogS">„Okraje jsou tam, kde dokumentům uniká krev.“</p>`,
    sceneFx: ['scene-archive', 'scene-record', 'scene-memory'],
    yesLabel: 'PŘEPSAT DO ZÁZNAMU',
    noLabel: 'NECHAT NA OKRAJI',
    category: 'memory',
    sector: 'archive',
    rarity: 'common',
    packId: 'base',
    role: 'object',
    tone: ['tragic', 'tender'],
    tags: ['archive', 'record', 'folder', 'memory'],
    yes: {
      resultText: 'Přepsal jsi poznámku do záznamu. Archiv ztuhl. Pravda se rozšířila o jednu nepohodlnou větu.',
      effects: [
        { type: 'stat', key: 'memory', amount: 5 },
        { type: 'stat', key: 'energy', amount: -2 },
        { type: 'entityRelation', entity: 'archive', delta: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Energie mírně ↓ · Archiv vztah ↑', statHints: { memory: 'up', energy: 'down' }, risk: 'low' },
    },
    no: {
      resultText: 'Nechal jsi ji na okraji. Někdy pravda přežije právě tím, že se netlačí doprostřed stránky pod zářivku.',
      effects: [
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'stat', key: 'control', amount: -2 },
        { type: 'flag', flag: 'archive_margin_preserved' },
      ],
      preview: { hint: 'Vazba ↑ · Kontrola mírně ↓ · okraj zachován', statHints: { bond: 'up', control: 'down' }, risk: 'low' },
    },
  },


  archive_folder_breathes: {
    id: 'archive_folder_breathes',
    title: 'Složka dýchá',
    logLabel: 'ARCHIVE_FOLDER_BREATHES',
    scene: 'Na regálu dýchala složka. Pomalu, nepravidelně, jako vzpomínka, která nechce být jen přílohou. Archiv tvrdil, že jde o větrání papíru. Archiv často lže nudně.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [ARCHIVE/BREATHING_FOLDER]:</span> biologická metafora v papírovém objektu.</p><p class="text">Hřbet složky se zvedá a klesá. Uvnitř nejsou plíce. Jen záznam, který někdo zavřel příliš brzy a teď si bere vzduch bez povolení.</p><p class="dialog">„Dýchání není schválená archivní funkce.“</p>`,
    sceneFx: ['scene-archive', 'scene-folder', 'scene-horror'],
    yesLabel: 'OTEVŘÍT OPATRNĚ',
    noLabel: 'NECHAT DÝCHAT',
    category: 'memory',
    sector: 'archive',
    rarity: 'uncommon',
    cooldownTurns: 8,
    packId: 'base',
    role: 'twist',
    tone: ['horror', 'tragic'],
    tags: ['archive', 'record', 'folder', 'memory'],
    yes: {
      resultText: 'Otevřel jsi ji opatrně. Záznam se nadechl tvým hlasem a poprvé nezněl jako důkaz proti tobě.',
      effects: [
        { type: 'stat', key: 'memory', amount: 5 },
        { type: 'stat', key: 'energy', amount: -3 },
        { type: 'entityRelation', entity: 'archive', delta: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Energie ↓ · Archiv vztah ↑', statHints: { memory: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Nechal jsi ji dýchat. Poprvé ses nepokusil přeložit každý nádech do závěru.',
      effects: [
        { type: 'stat', key: 'control', amount: 3 },
        { type: 'stat', key: 'bond', amount: 3 },
        { type: 'flag', flag: 'archive_folder_allowed_to_breathe' },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↑ · složka dýchá dál', statHints: { control: 'up', bond: 'up' }, risk: 'low' },
    },
  },
};
