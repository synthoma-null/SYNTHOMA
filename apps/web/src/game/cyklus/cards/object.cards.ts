import type { SwipeCard } from '../cyklusTypes';

export const OBJECT_CARDS: Record<string, SwipeCard> = {


  // ── OBJECTS (10) ────────────────────────────────────────────────────────────
  rusty_token: {
    id: 'rusty_token',
    title: 'Rezavý žeton',
    logLabel: 'OBJECT_FOUND',
    scene: 'Na zemi leží rezavý žeton. Je příliš těžký na obyčejný kov a příliš tichý na bezpečný předmět.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [OBJECT_FOUND]:</span> rezavý žeton detekován mimo účetní realitu.</p>
<p class="text">Na podlaze Prázdnoty leží <span class="fx-outline is-lit">rezavý žeton</span>. Neměl by tu být. Což je v SYNTHOMĚ oblíbený životopis skoro všeho.</p>
<p class="text">Kov je těžký, studený a na hraně má vyražený znak, který připomíná minci, oko a špatné rozhodnutí po druhé hodině ráno.</p>
<p class="dialogS">„Ber ho jen tehdy, pokud toužíš vlastnit problém, který má vlastní dopravní spojení do budoucnosti.“</p>`,
    sceneFx: ['scene-object', 'scene-void', 'scene-token'],
    yesLabel: 'VZÍT',
    noLabel: 'NECHAT',
    category: 'object',
    rarity: 'common',
    tags: ['object', 'void', 'mystery'],
    yes: { resultText: 'Vzal sis žeton. V kapse je teplejší, než by měl být.', effects: [{ type: 'item', itemId: 'rusty_token' }, { type: 'schedule', cardId: 'rusty_token_whispers', inTurns: 5 }, { type: 'profile', key: 'Ne', amount: 1 }], preview: { hint: 'Předmět · budoucí následek', risk: 'unknown' } },
    no: { resultText: 'Nechal jsi ho ležet. Za tebou slyšíš drobné kovové uražení.', effects: [{ type: 'flag', flag: 'ignored_rusty_token' }, { type: 'profile', key: 'Si', amount: 1 }], preview: { hint: 'Bez předmětu · systém si to pamatuje', risk: 'low' } },
  },

  glitch_pebble: {
    id: 'glitch_pebble',
    title: 'Glitchový kamínek',
    logLabel: 'OBJECT_FOUND',
    scene: 'Glitchka ti ukazuje digitální kamínek. „Je důležitý,“ tvrdí. Na otázku proč odpoví pouze tím, že kamínek slavnostně položí na tvoji botu.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [FOX_OBJECT]:</span> předmět klasifikován jako pravděpodobně zbytečný. Tedy zásadní.</p>
<p class="text">Glitchka ti ukáže <span class="halo">digitální kamínek</span>. Vznáší se jí nad tlapkou, bliká magentou a tváří se, že má doktorát z významu.</p>
<p class="dialogG halo">„Je důležitý. Protože je malý a nikdo ho zatím nevyhodil. 🦊🪨“</p>
<p class="text">Pak ho slavnostně položí na tvoji botu. Kdyby existovala komise pro absurdní rituály, právě by ti poslala certifikát a fakturu.</p>`,
    sceneFx: ['scene-object', 'scene-glitchka', 'scene-memory'],
    yesLabel: 'PŘIJMOUT',
    noLabel: 'ODMÍTNOUT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'glitchka', 'memory'],
    yes: { resultText: 'Přijal jsi kamínek. Glitchka se tváří, jako bys právě zachránil menší vesmír.', effects: [{ type: 'item', itemId: 'glitch_pebble' }, { type: 'stat', key: 'bond', amount: 4 }, { type: 'stat', key: 'control', amount: -2 }, { type: 'profile', key: 'F', amount: 1 }, { type: 'profile', key: 'P', amount: 1 }], preview: { hint: 'Předmět · Vazba ↑ · Kontrola ↓', statHints: { bond: 'up', control: 'down' }, risk: 'low' } },
    no: { resultText: 'Glitchka přikývla. Pak dala kamínek systému. Systém ho okamžitě označil jako podezřelý.', effects: [{ type: 'stat', key: 'control', amount: 3 }, { type: 'stat', key: 'bond', amount: -3 }, { type: 'flag', flag: 'glitchka_disappointed' }, { type: 'profile', key: 'T', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · Vazba ↓ · systém si zapamatoval', statHints: { control: 'up', bond: 'down' }, risk: 'medium' } },
  },

  archive_key: {
    id: 'archive_key',
    title: 'Archivní klíč',
    logLabel: 'OBJECT_FOUND',
    scene: 'Na polici leží klíč s cedulkou „Archiv“. Vypadá, že ví víc než ty.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE_KEY]:</span> nalezen přístupový objekt s podezřele klidným kovem.</p>
<p class="text">Na polici leží klíč s cedulkou <span class="fx-neon">ARCHIV</span>. Cedulka je ručně psaná. Klíč ne.</p>
<p class="text">Zoubky má nepravidelné, jako by nebyly určené do zámku, ale do staré věty, kterou někdo zamkl uprostřed přiznání.</p>
<p class="dialogS">„Jestli ho vezmeš, Archiv ti otevře dveře. A pak ti bude celý večer vysvětlovat, že dveře nikdy neexistovaly. Byrokracie s gotickou ambicí.“</p>`,
    sceneFx: ['scene-object', 'scene-archive', 'scene-memory'],
    yesLabel: 'VZÍT',
    noLabel: 'NECHAT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'archive', 'key'],
    yes: { resultText: 'Vzal sis klíč. Archivní dveře v dálce se zachvěly.', effects: [{ type: 'item', itemId: 'archive_key' }, { type: 'stat', key: 'memory', amount: 3 }, { type: 'profile', key: 'N', amount: 1 }], preview: { hint: 'Předmět · Paměť ↑', statHints: { memory: 'up' }, risk: 'low' } },
    no: { resultText: 'Nechal jsi klíč. Archiv si to zapsal jako laskavou lži.', effects: [{ type: 'stat', key: 'control', amount: 4 }, { type: 'profile', key: 'S', amount: 1 }], preview: { hint: 'Kontrola ↑', statHints: { control: 'up' }, risk: 'low' } },
  },

  rubber_seal: {
    id: 'rubber_seal',
    title: 'Gumový tuleň',
    logLabel: 'OBJECT_FOUND',
    scene: 'Glitchka ti podává tuleně. Má razítko. Nikdo neví proč.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [RELIC_ANOMALY]:</span> gumový tuleň vykazuje úřední autoritu bez zjevného mandátu.</p>
<p class="text">Glitchka ti podává malého gumového tuleně. Má razítko. Nikdo neví proč. Ani tuleň, ale odmítá se k tomu právně vyjádřit.</p>
<p class="dialogG halo">„Je to krizový tuleň. Zachraňuje, když už je pozdě a všichni se tváří odborně. 🦊🦭“</p>
<p class="text">Vypadá měkce, směšně a podezřele připraveně. Což je pořád víc, než se dá říct o většině terapeutických systémů po kolapsu.</p>`,
    sceneFx: ['scene-object', 'scene-glitchka', 'scene-bond', 'scene-comic'],
    yesLabel: 'PŘIJMOUT',
    noLabel: 'ODMÍTNOUT',
    category: 'object',
    rarity: 'rare',
    tags: ['object', 'glitchka', 'relic', 'bond'],
    yes: { resultText: 'Tuleň se usadil v kapse. Netvářil se nadšeně. Upřímně, nikdo by nebyl.', effects: [{ type: 'item', itemId: 'rubber_seal' }, { type: 'stat', key: 'bond', amount: 5 }, { type: 'profile', key: 'F', amount: 1 }, { type: 'profile', key: 'P', amount: 1 }], preview: { hint: 'Předmět · ochrana krize · Vazba ↑', statHints: { bond: 'up' }, risk: 'low' } },
    no: { resultText: 'Odmítl jsi tuleně. Glitchka ho dala někomu, kdo se tvářil, že si to zaslouží.', effects: [{ type: 'stat', key: 'control', amount: 4 }, { type: 'stat', key: 'bond', amount: -4 }, { type: 'profile', key: 'T', amount: 1 }], preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'medium' } },
  },

  blank_form: {
    id: 'blank_form',
    title: 'Prázdný formulář',
    logLabel: 'OBJECT_FOUND',
    scene: 'Na stole leží formulář bez otázek. Jen očekávání, že víš, čím ho vyplnit.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [FORM_EMPTY]:</span> otázky chybí. vina přítomna.</p>
<p class="text">Na stole leží <span class="fx-outline hollow">prázdný formulář</span>. Nemá otázky, kolonky ani návod. Jen tiché očekávání, že se za všechno nějak administrativně omluvíš.</p>
<p class="text">Papír voní po toneru, kontrole a lidské potřebě vyřešit chaos tabulkou. Civilizace, ta nádherná pomalá nehoda.</p>
<p class="dialogS">„Neber to. Formulář bez otázky je jen past, která se naučila používat kancelářskou sponku.“</p>`,
    sceneFx: ['scene-object', 'scene-form', 'scene-control'],
    yesLabel: 'VZÍT',
    noLabel: 'NECHAT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'form', 'office'],
    yes: { resultText: 'Vzal sis formulář. Cítil jsi, jak tě přitahuje k administrativním dveřím.', effects: [{ type: 'item', itemId: 'blank_form' }, { type: 'flag', flag: 'form_office_unlocked' }, { type: 'stat', key: 'control', amount: 3 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Předmět · odemkne Formulářovnu', statHints: { control: 'up' }, risk: 'medium' } },
    no: { resultText: 'Nechal jsi formulář. Stůl vypadal zklamaně, což je u stolů nepříjemné.', effects: [{ type: 'stat', key: 'bond', amount: 3 }, { type: 'profile', key: 'P', amount: 1 }], preview: { hint: 'Vazba ↑', statHints: { bond: 'up' }, risk: 'low' } },
  },

  mirror_shard: {
    id: 'mirror_shard',
    title: 'Zrcadlový střep',
    logLabel: 'OBJECT_FOUND',
    scene: 'Ve výklenku leží střep zrcadla. Ukazuje věci, které se tváří, že nejsou tvoje.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MIRROR_FRAGMENT]:</span> odraz neodpovídá držiteli. příjemná změna, konečně upřímnost.</p>
<p class="text">Ve výklenku leží <span class="fx-glitch" data-glitch="STŘEP">střep</span> zrcadla. Neodráží tvář. Odraz má zpoždění a vlastní názor.</p>
<p class="text">Na chvíli zahlédneš gesto, které jsi nikdy neudělal. Pak poznáš, že ho jen nechceš vlastnit. Roztomilý trik psychiky, ta malá účetní s plamenometem.</p>
<p class="dialogS">„Zrcadla v SYNTHOMĚ nelžou. Jen mají nechutný zvyk říkat pravdu z úhlu, kde vypadáš nejhůř.“</p>`,
    sceneFx: ['scene-object', 'scene-mirror', 'scene-memory'],
    yesLabel: 'VZÍT',
    noLabel: 'NECHAT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'mirror', 'memory'],
    yes: { resultText: 'Vzal sis střep. Někdo za zrcadlem přestal dýchat.', effects: [{ type: 'item', itemId: 'mirror_shard' }, { type: 'stat', key: 'memory', amount: 4 }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Předmět · Paměť ↑ · odemkne Zrcadlo', statHints: { memory: 'up' }, risk: 'medium' } },
    no: { resultText: 'Nechal jsi střep. Zrcadlo se s tebou rozloučilo bez tváře.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'profile', key: 'S', amount: 1 }], preview: { hint: 'Kontrola ↑', statHints: { control: 'up' }, risk: 'low' } },
  },

  childhood_spade: {
    id: 'childhood_spade',
    title: 'Lopatka',
    logLabel: 'OBJECT_FOUND',
    scene: 'V rohu leží malá lopatka. Zapomenutá, ale připravená.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [CHILDHOOD_TOOL]:</span> dětský objekt zachoval funkci navzdory dospělosti. podezřelé.</p>
<p class="text">V rohu leží malá <span class="halo">lopatka</span>. Plast je poškrábaný, držadlo ohlazené prsty někoho, kdo kdysi věřil, že díra v písku může být hradní příkop.</p>
<p class="text">Když se přiblížíš, podlaha pod ní změkne. Prázdnota na okamžik zavoní sluncem, mokrým pískem a dnem, který ještě neuměl být diagnózou.</p>
<p class="dialogS">„Pozor. Dětství je sektor s nízkou penalizací, ale vysokou schopností udělat z dospělého člověka usmrkaný relikt.“</p>`,
    sceneFx: ['scene-object', 'scene-sandbox', 'scene-memory', 'scene-tender'],
    yesLabel: 'VZÍT',
    noLabel: 'NECHAT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'childhood', 'memory'],
    yes: { resultText: 'Vzal sis lopatku. Pískoviště paměti se otevřelo.', effects: [{ type: 'item', itemId: 'childhood_spade' }, { type: 'stat', key: 'memory', amount: 5 }, { type: 'stat', key: 'bond', amount: 2 }, { type: 'profile', key: 'Si', amount: 1 }, { type: 'profile', key: 'F', amount: 1 }], preview: { hint: 'Předmět · Paměť ↑ · Vazba ↑', statHints: { memory: 'up', bond: 'up' }, risk: 'low' } },
    no: { resultText: 'Nechal jsi lopatku. Někdo za ní vykukoval a zase zmizel.', effects: [{ type: 'stat', key: 'control', amount: 4 }, { type: 'profile', key: 'T', amount: 1 }], preview: { hint: 'Kontrola ↑', statHints: { control: 'up' }, risk: 'low' } },
  },

  acid_filter: {
    id: 'acid_filter',
    title: 'Acidový filtr',
    logLabel: 'OBJECT_FOUND',
    scene: 'Sběrač šumu ti nabízí filtr. „Jednou tě zachrání,“ tvrdí.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [ACID_FILTER]:</span> ochranný filtr nalezen. vedlejší účinky odmítly vyplnit přílohu.</p>
<p class="text">Sběrač šumu ti nastaví dlaň. Leží na ní filtr z acidově žlutého skla, v němž se světlo láme jako varování, které někdo nechal moc dlouho v mikrovlnce.</p>
<p class="dialog">„Jednou tě zachrání,“ zašeptá Sběrač.</p>
<p class="text">To zní uklidňujícím způsobem hrozně. V SYNTHOMĚ totiž věci, které tě „jednou zachrání“, obvykle nejdřív počkají, až se situace stane trapně dramatickou.</p>`,
    sceneFx: ['scene-object', 'scene-acid', 'scene-energy', 'scene-warning'],
    yesLabel: 'VZÍT',
    noLabel: 'ODMÍTNOUT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'acid', 'energy'],
    yes: { resultText: 'Vzal sis filtr. Šum se okamžik cítil uražen.', effects: [{ type: 'item', itemId: 'acid_filter' }, { type: 'stat', key: 'control', amount: 3 }, { type: 'profile', key: 'T', amount: 1 }, { type: 'profile', key: 'Te', amount: 1 }], preview: { hint: 'Předmět · ochrana před přepětím', statHints: { control: 'up' }, risk: 'low' } },
    no: { resultText: 'Odmítl jsi. Sběrač se usmál. Nebylo to přátelské.', effects: [{ type: 'stat', key: 'energy', amount: 4 }, { type: 'stat', key: 'control', amount: -3 }, { type: 'profile', key: 'F', amount: 1 }, { type: 'profile', key: 'P', amount: 1 }], preview: { hint: 'Energie ↑ · Kontrola ↓', statHints: { energy: 'up', control: 'down' }, risk: 'medium' } },
  },

  wrong_map: {
    id: 'wrong_map',
    title: 'Špatná mapa',
    logLabel: 'OBJECT_FOUND',
    scene: 'Glitchka tvrdí, že mapa je nudná a otočila ji vzhůru nohama.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MAP_INVERTED]:</span> navigace záměrně poškozena. přesnost stoupla.</p>
<p class="text">Glitchka drží mapu vzhůru nohama a tváří se, že právě porazila geometrii. Na mapě se cesty kroutí jako výmluvy po špatně položené otázce.</p>
<p class="dialogG halo">„Normální mapa vede tam, kam chce prostor. Tahle vede tam, kam se bojíš. 🦊🗺️“</p>
<p class="text">Na severu je napsáno <span class="fx-flicker">MOŽNÁ</span>. Na jihu <span class="fx-flicker">NEPTEJ SE</span>. Konečně uživatelsky přívětivé rozhraní pro ztracení sebe sama.</p>`,
    sceneFx: ['scene-object', 'scene-glitchka', 'scene-path'],
    yesLabel: 'VZÍT',
    noLabel: 'NECHAT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'glitchka', 'path'],
    yes: { resultText: 'Vzal sis mapu. Cesty se začaly chovat zvědavě.', effects: [{ type: 'item', itemId: 'wrong_map' }, { type: 'stat', key: 'energy', amount: 4 }, { type: 'stat', key: 'control', amount: -4 }, { type: 'profile', key: 'P', amount: 1 }, { type: 'profile', key: 'Ne', amount: 1 }], preview: { hint: 'Předmět · Energie ↑ · Kontrola ↓', statHints: { energy: 'up', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Nechal jsi mapu. Glitchka ji dala větru.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑', statHints: { control: 'up' }, risk: 'low' } },
  },

  black_folder: {
    id: 'black_folder',
    title: 'Černá složka',
    logLabel: 'OBJECT_FOUND',
    scene: 'Složka dýchá. To je u dokumentů špatný signál.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [BLACK_FOLDER]:</span> dokument vykazuje dechovou aktivitu. právní oddělení se schovalo.</p>
<p class="text">Na stole leží černá složka. <span class="fx-shadow-lg">Dýchá.</span></p>
<p class="text">Ne rychle. Ne panicky. Spíš klidně, jako někdo, kdo už dávno ví, co jsi udělal, a jen čeká, až se dostavíš k podpisu.</p>
<p class="dialogS">„Obecné pravidlo: když papír dýchá, nečti ho. Když papír zná tvoje jméno, uteč. Když obojí, gratuluju, máš zápletku.“</p>`,
    sceneFx: ['scene-object', 'scene-archive', 'scene-danger', 'scene-memory'],
    yesLabel: 'OTEVŘÍT',
    noLabel: 'SCHOVAT',
    category: 'object',
    rarity: 'rare',
    once: true,
    tags: ['object', 'archive', 'danger', 'memory'],
    yes: { resultText: 'Otevřel jsi složku. Vzpomínka se vytáhla ven, než jsi stačil zavřít.', effects: [{ type: 'item', itemId: 'black_folder' }, { type: 'stat', key: 'memory', amount: 7 }, { type: 'stat', key: 'energy', amount: -6 }, { type: 'flag', flag: 'forbidden_archive_opened' }, { type: 'unlockPool', poolId: 'archive_forbidden_pool' }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Předmět · Paměť ↑↑ · Energie ↓ · riziko', statHints: { memory: 'up', energy: 'down' }, risk: 'high' } },
    no: { resultText: 'Schoval jsi složku. Za tebou se ozvalo tiché zklamání.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'stat', key: 'memory', amount: -4 }, { type: 'profile', key: 'J', amount: 1 }, { type: 'profile', key: 'Si', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' } },
  },

  noise_clump: {
    id: 'noise_clump',
    title: 'Chomáč šumu',
    logLabel: 'OBJECT_FOUND',
    scene: 'Něco v kapse začalo šumět. Ne dost nahlas, aby to bylo nebezpečné. Jen dost nahlas, aby to bylo osobní.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [NOISE_CLUMP]:</span> lokální šum přijal status spolubydlícího bez souhlasu nájemce.</p>
<p class="text">Něco v kapse začalo <span class="fx-noise">šumět</span>. Ne dost nahlas, aby to bylo nebezpečné. Jen dost nahlas, aby to bylo osobní, což je horší kategorie, jak lidstvo opakovaně demonstruje.</p>
<p class="text">Chomáč šumu se zavrtí, jako by hledal pohodlnější místo ve tvé existenci.</p>
<p class="dialogS">„Výborně. Máš domácího mazlíčka z poruchy signálu. Ještě mu kup mističku na nervy.“</p>`,
    sceneFx: ['scene-object', 'scene-noise', 'scene-glitch', 'scene-energy'],
    yesLabel: 'VYTÁHNOUT',
    noLabel: 'NECHAT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'noise', 'energy', 'glitch'],
    yes: { resultText: 'Vytáhl jsi chomáč šumu. Tvářil se, že tu bydlí.', effects: [{ type: 'item', itemId: 'noise_clump' }, { type: 'stat', key: 'energy', amount: 6 }, { type: 'stat', key: 'control', amount: -5 }, { type: 'flag', flag: 'noise_pet_awake' }, { type: 'profile', key: 'P', amount: 1 }, { type: 'profile', key: 'Ne', amount: 1 }], preview: { hint: 'Předmět · Energie ↑ · Kontrola ↓', statHints: { energy: 'up', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Nechal jsi ho tam. Kapsa teď dýchá.', effects: [{ type: 'schedule', cardId: 'pocket_breathes', inTurns: 3 }, { type: 'profile', key: 'I', amount: 1 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Budoucí následek', risk: 'unknown' } },
  },

  rubber_stamp: {
    id: 'rubber_stamp',
    title: 'Gumové razítko',
    logLabel: 'RUBBER',
    scene: 'Na stole leží gumové razítko. Je na něm napsáno: „SCHVÁLENO, I KDYŽ NIKDO NEVÍ PROČ.“ Tohle je buď relikvie, nebo státní správa.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [RELIC/APPROVAL]:</span> nalezeno gumové razítko. Administrativní moc bez kompetence detekována.</p><p class="text">Na stole leží gumové razítko. Je na něm napsáno: <span class="fx-flicker">SCHVÁLENO, I KDYŽ NIKDO NEVÍ PROČ</span>.</p><p class="text">Tohle je buď relikvie, nebo státní správa. Rozdíl se v krizových situacích stírá, což je přesně důvod, proč civilizace vynalezla šanony.</p><p class="dialogS">„Ber ho. Ve světě, kde dýchají formuláře, je razítko prakticky palná zbraň s kancelářskou docházkou.“</p>`,
    sceneFx: ['scene-object', 'scene-form', 'scene-relic', 'scene-comic'],
    yesLabel: 'VZÍT RAZÍTKO',
    noLabel: 'NECHAT HO',
    category: 'object',
    rarity: 'rare',
    tags: ['form', 'office', 'relic', 'item'],
    yes: { resultText: 'Vzal jsi razítko. Bylo lehčí, než vypadalo. Jako by většina jeho váhy byla v tom, co může zrušit.', effects: [{ type: 'imprint', imprintId: 'rubber_stamp' }, { type: 'item', itemId: 'rubber_stamp' }, { type: 'unlockPool', poolId: 'form_office_pool' }, { type: 'stat', key: 'control', amount: 3 }], preview: { hint: 'Item · Odemyká Formulářovnu · Kontrola ↑', statHints: { control: 'up' }, risk: 'low' } },
    no: { resultText: 'Nechal jsi razítko na stole. Kdosi jiný si ho vezme. Nebo si ho vezme sám stůl. Ve Formulářovně se toho nediví.', effects: [{ type: 'stat', key: 'bond', amount: 2 }, { type: 'flag', flag: 'refused_rubber_stamp' }], preview: { hint: 'Vazba ↑', statHints: { bond: 'up' }, risk: 'low' } },
  },

  foreign_bookmark: {
    id: 'foreign_bookmark',
    title: 'Cizí záložka',
    logLabel: 'FOREIGN_BOOKMARK',
    scene: 'V archivu je záložka v kapitole, kterou jsi nikdy nečetl. Je na ní tvoje jméno.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE/FOREIGN_BOOKMARK]:</span> nalezena záložka v kapitole bez autorizovaného vlastníka. Jméno subjektu přítomno. Pohodlí subjektu nepřítomno.</p><p class="text">V archivu je záložka v kapitole, kterou jsi nikdy nečetl. Je na ní tvoje jméno. Ne vytištěné. Napsané rukou někoho, kdo tě znal dřív, než ses stal sebou.</p><p class="text">Kniha se neotevře sama. Jen se nakloní. Což je u knih archivní verze vydírání.</p><p class="dialogS">„Cizí záložka s tvým jménem. Krásné. Konečně osobní údaj, který se rozhodl strašit fyzicky.“</p>`,
    sceneFx: ['scene-object', 'scene-archive', 'scene-bookmark', 'scene-memory'],
    yesLabel: 'OTEVŘÍT',
    noLabel: 'VYTRHNOUT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'archive', 'memory'],
    yes: { resultText: 'Otevřel jsi záložku. Četla tebe. Někdo jiný tě tam zapsal. Teď víš, že jsi byl něčím cizím.', effects: [{ type: 'stat', key: 'memory', amount: 8 }, { type: 'stat', key: 'bond', amount: -3 }, { type: 'flag', flag: 'foreign_bookmark_opened' }, { type: 'schedule', cardId: 'bookmark_knows_more', inTurns: 4 }, { type: 'entityRelation', entity: 'archive', delta: 1 }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Paměť ↑ · Vazba ↓ · budoucí následek', statHints: { memory: 'up', bond: 'down' }, risk: 'medium' } },
    no: { resultText: 'Vytrhl jsi záložku. Stránka zůstala. Ale teď už víš, že někde existuje kapitola, která tě zná.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'stat', key: 'memory', amount: -5 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'low' } },
  },


  // ── COMBINATION & RARE CARDS ──────────────────────────────────────────────────
  mirror_in_archive: {
    id: 'mirror_in_archive',
    title: 'Zrcadlo v archivu',
    logLabel: 'MIRROR_IN_ARCHIVE',
    scene: 'V Archivu stojí zrcadlo. Neukazuje tvou tvář. Ukazuje tvou pozici v katalogu, protože i odraz tu musí mít evidenční číslo.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MIRROR_IN_ARCHIVE]:</span> reflexe napojena na katalogizační vrstvu.</p><p class="text">Mezi regály stojí zrcadlo v rámu z kovových štítků. Neodráží obličej. Odrazilo složku. V ní jsi zařazen podle chyb, ne podle jména.</p><p class="text">Archiv a Zrcadlo spolupracují. To je jako když se spojí účetní a svědomí. Nikdo rozumný by u toho neměl být přítomen.</p><p class="dialog">„Subjekt: nalezen. Kategorie: nestabilní držitel vlastního významu.“</p>`,
    sceneFx: ['scene-object', 'scene-archive', 'scene-mirror'],
    yesLabel: 'PŘEČÍT POZICI',
    noLabel: 'ODSTRANIT Z KATALOGU',
    category: 'object',
    rarity: 'rare',
    tags: ['combination', 'archive', 'mirror', 'identity'],
    yes: { resultText: 'Přečetl jsi svou pozici. Byla dlouhá. Zahrnovala věci, které jsi zapomněl. Teď je máš znovu.', effects: [{ type: 'stat', key: 'memory', amount: 8 }, { type: 'stat', key: 'bond', amount: -3 }, { type: 'stat', key: 'control', amount: -3 }, { type: 'entityRelation', entity: 'archive', delta: 1 }, { type: 'entityRelation', entity: 'glitchka', delta: 1 }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Paměť ↑ · odhalení', statHints: { memory: 'up' }, risk: 'unknown' } },
    no: { resultText: 'Odstranil jsi se z katalogu. Zrcadlo se zamlžilo. Nejsi tam. Ale pořád jsi tady. To je nový problém.', effects: [{ type: 'stat', key: 'control', amount: 6 }, { type: 'stat', key: 'memory', amount: -6 }, { type: 'entityRelation', entity: 'archive', delta: -2 }, { type: 'entityRelation', entity: 'glitchka', delta: 1 }, { type: 'profile', key: 'Te', amount: 1 }, { type: 'profile', key: 'Se', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'high' } },
  },

  form_in_mirror: {
    id: 'form_in_mirror',
    title: 'Formulář ve zrcadle',
    logLabel: 'FORM_IN_MIRROR',
    scene: 'Ve zrcadle vidíš formulář, který právě vyplňuješ. Rukopis je tvůj, jen ruka patří někomu jinému. Papírová noční můra, tedy normální úterý.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [FORM_IN_MIRROR]:</span> zrcadlový dokument čeká na podpis.</p><p class="text">Za sklem sedí tvoje ruce. Vyplňují formulář, který před tebou neleží. Každé políčko se vyplní o vteřinu dřív, než si stihneš pomyslet odpověď.</p><p class="text">Podpisová čára září žlutě. Systém miluje souhlas, hlavně když ho může vyrobit zpětně.</p><p class="dialogS">„Podepsat zrcadlový formulář. Co by se mohlo pokazit, kromě právního konceptu duše?“</p>`,
    sceneFx: ['scene-object', 'scene-form', 'scene-mirror'],
    yesLabel: 'PODEPSAT',
    noLabel: 'ROZBÍT ZRCADLO',
    category: 'object',
    rarity: 'rare',
    tags: ['combination', 'form', 'mirror', 'identity'],
    yes: { resultText: 'Podepsal jsi. Formulář se otočil. Teď je v zrcadle tvůj obraz. A v archivu tvůj podpis. Oba jste to vy.', effects: [{ type: 'stat', key: 'control', amount: 7 }, { type: 'stat', key: 'bond', amount: -4 }, { type: 'stat', key: 'memory', amount: 4 }, { type: 'entityRelation', entity: 'form', delta: 1 }, { type: 'entityRelation', entity: 'glitchka', delta: 1 }, { type: 'profile', key: 'J', amount: 1 }, { type: 'profile', key: 'Te', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↑ · Vazba ↓', statHints: { control: 'up', memory: 'up', bond: 'down' }, risk: 'medium' } },
    no: { resultText: 'Rozbil jsi zrcadlo. Formulář zůstal nepodepsaný. Ale vidíš ho teď všude. V každém lesklém povrchu.', effects: [{ type: 'stat', key: 'energy', amount: 6 }, { type: 'stat', key: 'memory', amount: -5 }, { type: 'stat', key: 'bond', amount: 3 }, { type: 'entityRelation', entity: 'glitchka', delta: -1 }, { type: 'profile', key: 'P', amount: 1 }, { type: 'profile', key: 'Se', amount: 1 }], preview: { hint: 'Energie ↑ · Vazba ↑ · Paměť ↓', statHints: { energy: 'up', bond: 'up', memory: 'down' }, risk: 'high' } },
  },


    // ── MIRROR / SHADOW QUESTLINE ────────────────────────────────────────────────

  ownerless_shadow: {
    id: 'ownerless_shadow',
    title: 'Stín bez vlastníka',
    logLabel: 'OWNERLESS_SHADOW',
    scene: 'Na zemi leží stín. Nikdo ho nepoužívá. Což je u stínu znepokojivě neprofesionální.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SHADOW/OWNERLESS]:</span> nalezen stín bez přiřazeného subjektu. Vlastnické právo reality selhalo.</p><p class="text">Na zemi leží stín. Nikdo ho nepoužívá. Nehýbe se podle světla, protože světlo tady stejně dávno rezignovalo na základní pracovní morálku.</p><p class="text">Stín má okraj ramen, náznak rukou a prázdné místo tam, kde by měl být důvod. Vypadá opuštěně. To je přesně ten typ věci, kterou by rozumný člověk nepřekračoval. Rozumný člověk ovšem nebyl nalezen.</p><p class="dialogS">„Sebrat stín ze země. Jistě. Co dál? Adoptovat ozvěnu a založit jí spořicí účet?“</p>`,
    sceneFx: ['scene-object', 'scene-shadow', 'scene-mirror', 'scene-identity'],
    yesLabel: 'SEBRAT',
    noLabel: 'PŘEKROČIT',
    category: 'object',
    rarity: 'uncommon',
    tags: ['object', 'shadow', 'mirror', 'identity'],
    yes: {
      resultText: 'Sebral sis stín. Chvíli ti neseděl. Pak se přizpůsobil způsobem, který nebyl úplně uklidňující.',
      effects: [
        { type: 'item', itemId: 'ownerless_shadow' },
        { type: 'entityRelation', entity: 'shadow', delta: 2 },
        { type: 'stat', key: 'memory', amount: 4 },
        { type: 'stat', key: 'control', amount: -4 },
        { type: 'unlockPool', poolId: 'shadow_pool' },
        { type: 'profile', key: 'Ni', amount: 1 },
        { type: 'profile', key: 'I', amount: 1 },
      ],
      preview: { hint: 'Předmět · Stín vztah ↑ · něco se přilepí', statHints: { memory: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Překročil jsi ho. Stín se zvedl a začal jít za tebou. Zdvořile. To je vždycky horší.',
      effects: [
        { type: 'flag', flag: 'shadow_follows' },
        { type: 'flag', flag: 'shadow_follows_scheduled' },
        { type: 'schedule', cardId: 'shadow_follows_card', inTurns: 4 },
        { type: 'stat', key: 'control', amount: 3 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · něco tě následuje', statHints: { control: 'up' }, risk: 'unknown' },
    },
  },


  // ── GLITCHKA / SOFT BUG QUESTLINE ────────────────────────────────────────────

  soft_bug: {
    id: 'soft_bug',
    title: 'Měkká chyba',
    logLabel: 'SOFT_BUG',
    scene: 'Našel jsi chybu zabalenou do deky. Nevypadá nebezpečně. To je u chyb podlé.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SOFT/BUG]:</span> nalezena chyba s dekou. Hrozba působí roztomile, což zvyšuje riziko o absurdních 40 %.</p><p class="text">Našel jsi chybu zabalenou do deky. Je malá, teplá a tváří se, že neumí poškodit nic většího než špatnou náladu. Což je přesně ten typ lži, který lidé milují, protože má měkké okraje.</p><p class="text">Když se jí dotkneš, zavrní statika. Ne nebezpečně. Ještě ne. Chyby v SYNTHOMĚ zřídka začínají jako katastrofa. Nejdřív jsou roztomilé. Pak mají preference.</p><p class="dialogG halo">„Může zůstat malá. Když ji nebudeš krmit strachem. 🦊🪲“</p>`,
    sceneFx: ['scene-object', 'scene-soft-bug', 'scene-glitchka', 'scene-bug'],
    yesLabel: 'NECHAT JI',
    noLabel: 'OPRAVIT',
    category: 'object',
    rarity: 'common',
    tags: ['object', 'glitch', 'glitchka', 'bug'],
    yes: {
      resultText: 'Nechal jsi ji. Chyba se zavrtala do kapsy a tvářila se, že platí nájem roztomilostí.',
      effects: [
        { type: 'item', itemId: 'soft_bug' },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'stat', key: 'control', amount: -3 },
        { type: 'schedule', cardId: 'soft_bug_grows', inTurns: 5 },
        { type: 'entityRelation', entity: 'glitchka', delta: 1 },
        { type: 'profile', key: 'Fe', amount: 1 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Předmět · Vazba ↑ · Kontrola ↓ · vyroste', statHints: { bond: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Opravil jsi ji. Deka zůstala prázdná. Prázdné deky jsou jeden z horších druhů vítězství.',
      effects: [
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'bond', amount: -4 },
        { type: 'entityRelation', entity: 'glitchka', delta: -1 },
        { type: 'profile', key: 'Ti', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'low' },
    },
  },


  archive_loose_folder: {
    id: 'archive_loose_folder',
    title: 'Volná složka',
    logLabel: 'ARCHIVE_LOOSE_FOLDER',
    scene: 'V Archivu ležela složka mimo regál. To samo o sobě působilo jako trestný čin. Na štítku stálo: subjekt, který se nevešel do vlastní verze událostí.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE/LOOSE_FOLDER]:</span> složka nalezena mimo přidělený regál.</p><p class="text">Složka je tenká, ale těžká. Ne proto, že by měla hodně stran. Protože každá strana vypadá jako věta, kterou jsi kdysi usekl dřív, než stihla říct pravdu.</p><p class="dialog">„Nezařazené neznamená nepravdivé.“</p>`,
    sceneFx: ['scene-archive', 'scene-folder', 'scene-memory'],
    yesLabel: 'ZAŘADIT SLOŽKU',
    noLabel: 'NECHAT JI VOLNOU',
    category: 'object',
    sector: 'archive',
    rarity: 'common',
    packId: 'base',
    role: 'object',
    tone: ['tragic', 'horror'],
    tags: ['archive', 'record', 'folder', 'memory'],
    yes: {
      resultText: 'Zařadil jsi složku. Archiv spokojeně zapraskal a tvá minulost dostala čárový kód. To není útěcha. Jen pořádek.',
      effects: [
        { type: 'stat', key: 'memory', amount: 4 },
        { type: 'stat', key: 'control', amount: 2 },
        { type: 'entityRelation', entity: 'archive', delta: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↑ · Archiv vztah ↑', statHints: { memory: 'up', control: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Nechal jsi ji volnou. Složka zůstala na zemi jako malá vzpoura proti abecedě.',
      effects: [
        { type: 'stat', key: 'bond', amount: 3 },
        { type: 'stat', key: 'control', amount: -2 },
        { type: 'flag', flag: 'archive_loose_folder_left' },
      ],
      preview: { hint: 'Vazba ↑ · Kontrola mírně ↓ · složka zůstává volná', statHints: { bond: 'up', control: 'down' }, risk: 'low' },
    },
  },


  archive_form_duplicate: {
    id: 'archive_form_duplicate',
    title: 'Duplicitní formulář',
    logLabel: 'ARCHIVE_FORM_DUPLICATE',
    scene: 'Ve Formulářovně se objevil archivní duplikát tvé žádosti. Jeden výtisk tvrdil, že chceš zapomenout. Druhý, že chceš být správně pochopen. Úředník v tobě začal panikařit.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [FORM/ARCHIVE_DUPLICATE]:</span> konflikt žádostí detekován.</p><p class="text">Oba formuláře mají tvůj podpis. Jeden je ostrý. Druhý rozmazaný, jako by se podepsal někdo, kdo si na poslední chvíli vzpomněl, že má srdce.</p><p class="dialog">„Duplicitní záznam není chyba, pokud subjekt lže konzistentně.“</p>`,
    sceneFx: ['scene-archive', 'scene-form', 'scene-record'],
    yesLabel: 'SLOUČIT ŽÁDOSTI',
    noLabel: 'VYBRAT JEDNU',
    category: 'object',
    sector: 'form_office',
    rarity: 'uncommon',
    packId: 'base',
    role: 'escalation',
    tone: ['absurd', 'tragic'],
    tags: ['archive', 'record', 'form', 'folder'],
    yes: {
      resultText: 'Sloučil jsi žádosti. Výsledek byl nečitelný, ale pravdivější než obě čisté verze zvlášť.',
      effects: [
        { type: 'stat', key: 'memory', amount: 4 },
        { type: 'stat', key: 'control', amount: -2 },
        { type: 'entityRelation', entity: 'archive', delta: 1 },
        { type: 'entityRelation', entity: 'form', delta: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola mírně ↓ · Archiv/Formulářovna ↑', statHints: { memory: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Vybral jsi jednu žádost. Druhá se poslušně zavřela, což bylo nepříjemné hlavně proto, že poslušnost občas vypadá jako zrada.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'bond', amount: -2 },
        { type: 'entityRelation', entity: 'form', delta: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba mírně ↓ · Formulářovna ↑', statHints: { control: 'up', bond: 'down' }, risk: 'low' },
    },
  },


  archive_index_card: {
    id: 'archive_index_card',
    title: 'Kartotéční lístek',
    logLabel: 'ARCHIVE_INDEX_CARD',
    scene: 'Na stole ležel kartotéční lístek s jedinou větou: není nutné najít celý příběh, aby další krok nebyl slepý. Archiv z toho nebyl nadšený. Archiv má rád celé příběhy, nejlépe pod zámkem.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [ARCHIVE/INDEX_CARD]:</span> nalezena minimální navigační pravda.</p><p class="text">Lístek je malý a neomaleně užitečný. Neobsahuje trauma, rodokmen ani výmluvu. Jen směr. V prostředí, které si plete hloubku s hromadou složek, působí skoro vulgárně prakticky.</p><p class="dialogS">„Někdy stačí lístek. Ne každá pravda musí přijít s regálem a kouřostrojem.“</p>`,
    sceneFx: ['scene-archive', 'scene-record', 'scene-quiet'],
    yesLabel: 'VZÍT LÍSTEK',
    noLabel: 'VRÁTIT DO KARTOTÉKY',
    category: 'object',
    sector: 'archive',
    rarity: 'common',
    packId: 'base',
    role: 'echo',
    tone: ['tragic', 'comic'],
    tags: ['archive', 'record', 'folder', 'memory'],
    yes: {
      resultText: 'Vzal sis lístek. Nebyl to klíč. Jen směr, což je někdy méně efektní a výrazně použitelnější.',
      effects: [
        { type: 'stat', key: 'memory', amount: 3 },
        { type: 'stat', key: 'control', amount: 3 },
        { type: 'entityRelation', entity: 'archive', delta: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↑ · Archiv vztah ↑', statHints: { memory: 'up', control: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Vrátil jsi lístek do kartotéky. Směr zůstal dostupný, jen ne v kapse. I to je někdy forma důvěry v budoucího sebe.',
      effects: [
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'stat', key: 'memory', amount: -1 },
        { type: 'flag', flag: 'archive_index_card_returned' },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť nepatrně ↓ · lístek čeká', statHints: { control: 'up', memory: 'down' }, risk: 'low' },
    },
  },
};
