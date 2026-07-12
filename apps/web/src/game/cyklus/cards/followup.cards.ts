import type { SwipeCard } from '../cyklusTypes';

export const FOLLOWUP_CARDS: Record<string, SwipeCard> = {


  // ── FOLLOW-UPS (10) ───────────────────────────────────────────────────────────
  rusty_token_whispers: {
    id: 'rusty_token_whispers',
    title: 'Žeton se ozval',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Z kapsy se ozvalo tiché kovové zakašlání. Žeton se pohnul. Nikdo normální by to nebral jako pozvánku.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TOKEN_WAKE]:</span> předmět navázal jednostranný vztah s kapsou.</p>
<p class="text">Z kapsy se ozve tiché kovové zakašlání. <span class="fx-outline is-lit">Žeton</span> se pohnul.</p>
<p class="text">Na hraně se rozsvítí drobný znak tržiště. Není to pozvánka. Je to spíš upomínka, jen s větší dávkou mystiky a menší ochotou vysvětlovat obchodní podmínky.</p>
<p class="dialogS">„Nikdo normální by to nebral jako výzvu. Naštěstí normálnost tady zemřela někde mezi restartem a inventářem.“</p>`,
    sceneFx: ['scene-followup', 'scene-token', 'scene-market'],
    yesLabel: 'POSLOUCHAT',
    noLabel: 'ZATLAČIT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'rusty_token' }],
    tags: ['followup', 'item', 'market'],
    yes: { resultText: 'Žeton ti ukázal směr, který na mapě nebyl.', effects: [{ type: 'moveSector', sectorId: 'market' }, { type: 'stat', key: 'memory', amount: 4 }, { type: 'stat', key: 'control', amount: -3 }, { type: 'flag', flag: 'heard_token_direction' }, { type: 'profile', key: 'N', amount: 1 }], preview: { hint: 'Přesun do Tržiště · Paměť ↑ · Kontrola ↓', statHints: { memory: 'up', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Kapsa ztěžkla. Žeton zmlkl způsobem, který zněl jako budoucí problém.', effects: [{ type: 'schedule', cardId: 'pocket_gets_heavy', inTurns: 4 }, { type: 'stat', key: 'control', amount: 3 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · budoucí následek', statHints: { control: 'up' }, risk: 'medium' } },
  },

  glitch_pebble_multiplies: {
    id: 'glitch_pebble_multiplies',
    title: 'Kamínek se rozmnožil',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Kamínek v kapse už není jeden. Jsou tři. Jeden z nich má brýle.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [PEBBLE_REPLICATION]:</span> objekt se rozmnožil bez schváleného formuláře.</p>
<p class="text">Kamínek v kapse už není jeden. Jsou tři.</p>
<p class="text">Jeden z nich má brýle. Druhý se tváří jako svědek. Třetí neříká nic, čímž se okamžitě stal nejdůvěryhodnější autoritou v místnosti.</p>
<p class="dialogG halo">„Už nejsi sám. Máš kamenný výbor. To je skoro rodina, jen méně hlučná. 🦊👓“</p>`,
    sceneFx: ['scene-followup', 'scene-glitchka', 'scene-comic'],
    yesLabel: 'NECHAT SI JE',
    noLabel: 'VYSYPAT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'glitch_pebble' }],
    tags: ['followup', 'item', 'glitchka'],
    yes: { resultText: 'Přijal jsi, že tvá kapsa má vlastní geologický program.', effects: [{ type: 'stat', key: 'bond', amount: 3 }, { type: 'stat', key: 'energy', amount: 3 }, { type: 'unlockPool', poolId: 'glitchka_pool' }, { type: 'profile', key: 'P', amount: 1 }, { type: 'profile', key: 'Fe', amount: 1 }], preview: { hint: 'Vazba ↑ · Energie ↑ · odemkne Glitchka pool', statHints: { bond: 'up', energy: 'up' }, risk: 'low' } },
    no: { resultText: 'Vysypal jsi kamínky. Jeden se odkutálel uraženě. Jeden zůstal. Ten s brýlemi tě soudí.', effects: [{ type: 'stat', key: 'control', amount: 4 }, { type: 'schedule', cardId: 'pebble_with_glasses', inTurns: 6 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · budoucí následek', statHints: { control: 'up' }, risk: 'medium' } },
  },

  sarkasma_account: {
    id: 'sarkasma_account',
    title: 'Sarkasmin účet',
    logLabel: 'FOLLOWUP',
    scene: 'Terminál zablikal. Sarkasma ti poslala účet. Ne finanční. Osobní.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [SARKASMA_INVOICE]:</span> ochranný mechanismus vystavil pohledávku.</p>
<p class="text">Terminál zabliká červeně. Na skle se objeví účet. Ne finanční. Osobní. Ty jsou horší, protože je nejde zaplatit převodem ani hrdinským mlčením.</p>
<p class="dialogS">„Dlužníku, tvá obrana nebyla zdarma. Jen jsem byla tak laskavá, že jsem ti to neřekla ve chvíli, kdy bys začal panikařit. Jsem prakticky charita se skalpelem.“</p>
<p class="text">Pod částkou není číslo. Jen věta: <span class="fx-flicker">PŘIZNEJ, CO TĚ DRŽELO POHROMADĚ.</span></p>`,
    sceneFx: ['scene-followup', 'scene-sarkasma', 'scene-debt'],
    yesLabel: 'ZAPLATIT PRAVDOU',
    noLabel: 'ZAPLATIT VTIPem',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasFlag', flag: 'sarkasma_debt' }],
    tags: ['followup', 'sarkasma', 'debt'],
    yes: { resultText: 'Řekl jsi pravdu. Místnost na okamžik ztichla, protože i systémy poznají nepohodlí. Sarkasma si to zapíše. Ale neodejde.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'stat', key: 'bond', amount: -5 }, { type: 'removeFlag', flag: 'sarkasma_debt' }, { type: 'entityRelation', entity: 'sarkasma', delta: 1 }, { type: 'schedule', cardId: 'sarkasma_collects', inTurns: 4 }, { type: 'profile', key: 'Ti', amount: 2 }, { type: 'profile', key: 'T', amount: 2 }], preview: { hint: 'Kontrola ↑ · Vazba ↓ · chain pokračuje', statHints: { control: 'up', bond: 'down' }, risk: 'medium' } },
    no: { resultText: 'Zkusil jsi to uhrát vtipem. Sarkasma se nezasmála. Ale účtenku neroztrhla. Uložila ji. Znepokojivě klidně.', effects: [{ type: 'stat', key: 'energy', amount: 4 }, { type: 'stat', key: 'bond', amount: 2 }, { type: 'stat', key: 'control', amount: -4 }, { type: 'removeFlag', flag: 'sarkasma_debt' }, { type: 'entityRelation', entity: 'sarkasma', delta: -1 }, { type: 'schedule', cardId: 'sarkasma_collects', inTurns: 2 }, { type: 'profile', key: 'Ne', amount: 2 }, { type: 'profile', key: 'Fe', amount: 1 }], preview: { hint: 'Energie ↑ · Vazba ↑ · chain pokračuje', statHints: { energy: 'up', bond: 'up', control: 'down' }, risk: 'medium' } },
  },

  archive_key_warms: {
    id: 'archive_key_warms',
    title: 'Archivní klíč se zahřál',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Archivní klíč se zahřál. Nedaleko musí být dveře, které předstírají, že nejsou dveře.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [KEY_RESONANCE]:</span> archivní kov reaguje na blízkost lživé zdi.</p>
<p class="text">Archivní klíč se zahřeje. Ne příjemně. Spíš jako vzpomínka, která si sundala rukavice.</p>
<p class="text">Nedaleko musí být dveře, které předstírají, že nejsou dveře. Fasáda kolem nich se tváří nevinně, tedy naprosto vinně, protože prostor se tady neumí tvářit nevinně bez přehrávání.</p>
<p class="dialogS">„Dveře, které lžou o tom, že jsou zeď. Konečně architektura s osobnostní poruchou.“</p>`,
    sceneFx: ['scene-followup', 'scene-archive', 'scene-path'],
    yesLabel: 'HLEDAT DVEŘE',
    noLabel: 'IGNOROVAT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'archive_key' }],
    tags: ['followup', 'item', 'archive'],
    yes: { resultText: 'Našel jsi škvíru ve vzduchu. Archiv ji označil jako „nepodstatnou“, což je archivní slovo pro „pojď sem“.', effects: [{ type: 'moveSector', sectorId: 'archive' }, { type: 'stat', key: 'memory', amount: 5 }, { type: 'unlockPool', poolId: 'archive_pool' }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Přesun do Archivu · Paměť ↑', statHints: { memory: 'up' }, risk: 'low' } },
    no: { resultText: 'Klíč vychladl. Ne uraženě. Hůř. Trpělivě.', effects: [{ type: 'schedule', cardId: 'key_waits', inTurns: 8 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Budoucí následek', risk: 'unknown' } },
  },

  mirror_shard_hums: {
    id: 'mirror_shard_hums',
    title: 'Zrcadlový střep zabzučel',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Střep v kapse zabzučel. Ukazuje obraz, který se ještě nestal.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MIRROR_PREVIEW]:</span> odraz dorazil před událostí. čas opět předbíhá, protože neumí čekat ve frontě.</p>
<p class="text">Střep v kapse zabzučí. Ukazuje obraz, který se ještě nestal.</p>
<p class="text">Vidíš ruku nataženou k tobě. Nevíš, jestli prosí, varuje, nebo tě chce stáhnout zpátky do chyby. V SYNTHOMĚ se tyhle možnosti obvykle účtují společně.</p>
<p class="dialogS">„Budoucnost ti mává střepem. Romantické. Kdyby romantika nebyla jen horor s lepším osvětlením.“</p>`,
    sceneFx: ['scene-followup', 'scene-mirror', 'scene-memory'],
    yesLabel: 'DÍVAT SE',
    noLabel: 'ZAKRÝT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'mirror_shard' }],
    tags: ['followup', 'item', 'mirror'],
    yes: { resultText: 'Viděl jsi sebe, který už udělal volbu, kterou ještě neudělal.', effects: [{ type: 'stat', key: 'memory', amount: 7 }, { type: 'stat', key: 'control', amount: -4 }, { type: 'unlockPool', poolId: 'mirror_pool' }, { type: 'profile', key: 'N', amount: 1 }, { type: 'profile', key: 'Ni', amount: 2 }], preview: { hint: 'Paměť ↑ · Kontrola ↓ · odemkne Zrcadlo', statHints: { memory: 'up', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Zakryl jsi střep. Zrcadlo se s tebou rozloučilo, ale ještě neodešlo.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'schedule', cardId: 'mirror_waits', inTurns: 5 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · budoucí následek', statHints: { control: 'up' }, risk: 'medium' } },
  },

  childhood_spade_digs: {
    id: 'childhood_spade_digs',
    title: 'Lopatka kope sama',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Dětská lopatka se sama pustila do hlíny. Cítíš, že pod ní je něco, co na tebe čeká.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SPADE_AUTONOMY]:</span> dětský nástroj zahájil výkop bez dozoru dospělého. konečně rozumný postup.</p>
<p class="text">Lopatka se sama pustí do hlíny. Každý záběr je tichý, opatrný, skoro něžný.</p>
<p class="text">Pod povrchem není poklad. Je tam <span class="halo">malá bublina smíchu</span>, napůl zahrabaná, napůl uražená, že ji někdo nechal tak dlouho samotnou.</p>
<p class="dialogG halo">„Někdy se věci neztratí. Jen čekají, až budeš mít odvahu kopat jemně. 🦊🪣“</p>`,
    sceneFx: ['scene-followup', 'scene-sandbox', 'scene-memory', 'scene-tender'],
    yesLabel: 'POMOCI',
    noLabel: 'ZASTAVIT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'childhood_spade' }],
    tags: ['followup', 'item', 'childhood'],
    yes: { resultText: 'Společně jste vyhrabali vzpomínku, která ještě nebyla tvoje. Teď je.', effects: [{ type: 'stat', key: 'memory', amount: 8 }, { type: 'stat', key: 'bond', amount: 3 }, { type: 'stat', key: 'energy', amount: -4 }, { type: 'profile', key: 'F', amount: 1 }, { type: 'profile', key: 'Si', amount: 1 }], preview: { hint: 'Paměť ↑ · Vazba ↑ · Energie ↓', statHints: { memory: 'up', bond: 'up', energy: 'down' }, risk: 'medium' } },
    no: { resultText: 'Zastavil jsi lopatku. Něco pod hlínou si oddechlo, a pak se stydlivě odtáhlo.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'stat', key: 'memory', amount: -3 }, { type: 'profile', key: 'T', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'low' } },
  },

  wrong_map_leads: {
    id: 'wrong_map_leads',
    title: 'Špatná mapa ukazuje cestu',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Mapa, kterou máš vzhůru nohama, teď najednou dává smysl. Směr vede k Pelechu Glitchky.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [WRONG_MAP_VALID]:</span> chyba v orientaci povýšena na metodu.</p>
<p class="text">Mapa, kterou držíš vzhůru nohama, najednou dává smysl. To je nepříjemné zjištění pro všechny, kdo si ještě mysleli, že realita má úctu k navigaci.</p>
<p class="text">Čára vede k Pelechu Glitchky. Cestou míjí tři zkratky, dvě výmluvy a jedno místo označené <span class="fx-flicker">NEBREČ TADY, JE TU PRŮVAN</span>.</p>
<p class="dialogS">„Když špatná mapa ukazuje správně, není to zázrak. Je to obžaloba tvého dosavadního směru.“</p>`,
    sceneFx: ['scene-followup', 'scene-glitchka', 'scene-path'],
    yesLabel: 'JÍT',
    noLabel: 'OTOČIT MAPU',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'wrong_map' }],
    tags: ['followup', 'item', 'path'],
    yes: { resultText: 'Odešel jsi směrem, který na správné mapě neexistuje.', effects: [{ type: 'moveSector', sectorId: 'glitchka_nest' }, { type: 'stat', key: 'energy', amount: 5 }, { type: 'stat', key: 'control', amount: -6 }, { type: 'profile', key: 'Ne', amount: 1 }, { type: 'profile', key: 'P', amount: 1 }], preview: { hint: 'Přesun do Pelechu Glitchky · Energie ↑ · Kontrola ↓', statHints: { energy: 'up', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Otočil jsi mapu. Správný svět se vrátil, ale trochu nudněji.', effects: [{ type: 'stat', key: 'control', amount: 6 }, { type: 'stat', key: 'memory', amount: -2 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'low' } },
  },

  black_folder_rustles: {
    id: 'black_folder_rustles',
    title: 'Černá složka šustí',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Složka se otevřela sama. Na první stránce je tvoje jméno, ale jinak psané.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [NAME_VARIANT]:</span> identifikátor nalezen v cizím pravopisu.</p>
<p class="text">Černá složka se otevře sama. První stránka je bílá tak nepříjemně, až vypadá jako sterilní lhostejnost.</p>
<p class="text">Je na ní tvoje jméno, ale jinak psané. Stačí jedna změněná hláska a celé Já začne působit jako překlep v cizím spisu.</p>
<p class="dialogS">„Výborně. Archiv našel verzi tebe, která prošla korekturou někoho, kdo tě nikdy nepotkal a přesto si věří.“</p>`,
    sceneFx: ['scene-followup', 'scene-archive', 'scene-danger'],
    yesLabel: 'ČÍST DÁL',
    noLabel: 'ZAVŘÍT',
    category: 'followup',
    rarity: 'uncommon',
    maxUses: 2,
    conditions: [{ type: 'hasItem', itemId: 'black_folder' }],
    tags: ['followup', 'item', 'archive', 'danger'],
    yes: { resultText: 'Četl jsi dál. Složka četla tebe.', effects: [{ type: 'stat', key: 'memory', amount: 6 }, { type: 'stat', key: 'energy', amount: -5 }, { type: 'stat', key: 'control', amount: -4 }, { type: 'profile', key: 'N', amount: 2 }, { type: 'profile', key: 'Ni', amount: 2 }], preview: { hint: 'Paměť ↑ · Energie ↓ · Kontrola ↓', statHints: { memory: 'up', energy: 'down', control: 'down' }, risk: 'high' } },
    no: { resultText: 'Zavřel jsi složku. Dýchala teď zoufaleji.', effects: [{ type: 'stat', key: 'control', amount: 7 }, { type: 'stat', key: 'memory', amount: -4 }, { type: 'profile', key: 'J', amount: 1 }, { type: 'profile', key: 'Te', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' } },
  },

  noise_pet_calls: {
    id: 'noise_pet_calls',
    title: 'Chomáč šumu tě volá',
    logLabel: 'ITEM_TRIGGER',
    scene: 'Chomáč v kapse se začal chovat jako domácí mazlíček. Mazlíčci většinou chtějí něco, co nemáš.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [NOISE_PET]:</span> šum vykazuje vazebné chování. gratulujeme, i porucha chce pozornost.</p>
<p class="text">Chomáč v kapse se začne chovat jako domácí mazlíček. Tře se o vnitřní šev reality a vydává zvuk mezi vrněním, statikou a pokusem starého modemu o něhu.</p>
<p class="text">Mazlíčci většinou chtějí něco, co nemáš. Čas, klid, granule, emoční dostupnost. Tenhle chce pravděpodobně všechno najednou.</p>
<p class="dialogS">„Nehladit po půlnoci. Nekrmit panikou. Neučit povel ‚zůstaň v mé psychice‘.“</p>`,
    sceneFx: ['scene-followup', 'scene-noise', 'scene-comic', 'scene-energy'],
    yesLabel: 'VYSLECHNOUT',
    noLabel: 'IGNOROVAT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'noise_clump' }],
    tags: ['followup', 'item', 'noise'],
    yes: { resultText: 'Vyslechl jsi chomáč. Ukázal ti místo, kde se schovává ticho, než ho najdou.', effects: [{ type: 'stat', key: 'energy', amount: 6 }, { type: 'stat', key: 'memory', amount: 4 }, { type: 'stat', key: 'control', amount: -5 }, { type: 'profile', key: 'P', amount: 1 }, { type: 'profile', key: 'Ne', amount: 1 }], preview: { hint: 'Energie ↑ · Paměť ↑ · Kontrola ↓', statHints: { energy: 'up', memory: 'up', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Ignoroval jsi. Chomáč ztichl. Až moc ztichl.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'schedule', cardId: 'noise_pet_leaves', inTurns: 6 }, { type: 'profile', key: 'I', amount: 1 }, { type: 'profile', key: 'Ti', amount: 1 }], preview: { hint: 'Kontrola ↑ · budoucí následek', statHints: { control: 'up' }, risk: 'medium' } },
  },

  pebble_with_glasses: {
    id: 'pebble_with_glasses',
    title: 'Kamínek s brýlemi',
    logLabel: 'FOLLOWUP',
    scene: 'Kamínek s brýlemi se vrátil. Teď s sebou vede jednoho, který se tváří jako tvoje chyba.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [PEBBLE_COMMITTEE]:</span> kamenný výbor rozšířen o odborníka na vinu.</p>
<p class="text">Kamínek s brýlemi se vrátil. Teď s sebou vede dalšího, který se tváří jako tvoje chyba.</p>
<p class="text">Nemá obličej, ale stejně víš, že tě soudí. Malé předměty jsou v tomhle nesnesitelné. Nepotřebují mimiku, stačí jim existovat v pravý okamžik.</p>
<p class="dialogG halo">„Tenhle je přísný, ale hodný. Jen neumí rozlišit chybu od člověka. 🦊🪨“</p>`,
    sceneFx: ['scene-followup', 'scene-glitchka', 'scene-comic', 'scene-memory'],
    yesLabel: 'POZNAT HO',
    noLabel: 'ZAPADNOUT',
    category: 'followup',
    rarity: 'rare',
    tags: ['followup', 'glitchka', 'memory'],
    yes: { resultText: 'Poznal jsi ho. Byl to kousek paměti, který jsi před lety zatlačil pod koberec.', effects: [{ type: 'stat', key: 'memory', amount: 10 }, { type: 'stat', key: 'bond', amount: -4 }, { type: 'profile', key: 'N', amount: 2 }, { type: 'profile', key: 'Ni', amount: 2 }, { type: 'imprint', imprintId: 'mirror_crack' }], preview: { hint: 'Paměť ↑ · Vazba ↓ · otisk', statHints: { memory: 'up', bond: 'down' }, risk: 'medium' } },
    no: { resultText: 'Zapadnul jsi. Kamínek s brýlemi tě sledoval, dokud nezmizel v odrazu.', effects: [{ type: 'stat', key: 'control', amount: 6 }, { type: 'stat', key: 'memory', amount: -6 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'low' } },
  },

  sarkasma_returns: {
    id: 'sarkasma_returns',
    title: 'Sarkasma se vrátila',
    logLabel: 'FOLLOWUP',
    scene: 'Sarkasma stojí ve dveřích. Netrpělivě. Není tu poprvé.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [SARKASMA_RETURN]:</span> obranný hlas dorazil bez pozvání. jako obvykle přesně.</p>
<p class="text">Sarkasma stojí ve dveřích. Netrpělivě. Není tu poprvé.</p>
<p class="text">Kolem ramen se jí převaluje červený kouř a v ruce drží složený účet. Nehodlá ho číst nahlas. To by bylo příliš milosrdné.</p>
<p class="dialogS">„Tak. Dohráli jsme fázi, kdy ses tvářil, že dluh je metafora. Teď ho pojmenuješ, nebo ho pojmenuje systém. A věř mi, systém má vkus nemocničního automatu na kávu.“</p>`,
    sceneFx: ['scene-followup', 'scene-sarkasma', 'scene-debt'],
    yesLabel: 'POZVAT DÁL',
    noLabel: 'NEOTVÍRAT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasFlag', flag: 'sarkasma_debt' }],
    tags: ['followup', 'sarkasma', 'debt'],
    yes: { resultText: 'Pozval jsi ji dál. Sarkasma se usadila a začala kritizovat tvůj nábytek. To znamená, že tě má ráda.', effects: [{ type: 'stat', key: 'bond', amount: 4 }, { type: 'stat', key: 'energy', amount: -3 }, { type: 'stat', key: 'control', amount: -3 }, { type: 'removeFlag', flag: 'sarkasma_debt' }, { type: 'profile', key: 'Fe', amount: 1 }, { type: 'profile', key: 'E', amount: 1 }], preview: { hint: 'Vazba ↑ · Energie ↓ · Kontrola ↓', statHints: { bond: 'up', energy: 'down', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Neotevřel jsi. Za dveřmi zaslechla chválu tvého zámku. Ironickou.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'stat', key: 'bond', amount: -5 }, { type: 'profile', key: 'Ti', amount: 1 }, { type: 'profile', key: 'I', amount: 1 }], preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'low' } },
  },

  unfinished_conversation: {
    id: 'unfinished_conversation',
    title: 'Nedokončená věta',
    logLabel: 'UNFINISHED',
    scene: 'Na zemi leží věta. Ne papír. Ne záznam. Věta. Useknutá přesně v místě, kde někdo kdysi čekal, že budeš pokračovat.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [CONVERSATION/UNFINISHED]:</span> nalezena věta bez konce. Systém žádá doplnění. Protože i ticho tu musí mít uzávěrku.</p><p class="text">Na zemi leží věta. Ne papír. Ne záznam. Věta. Useknutá přesně v místě, kde někdo kdysi čekal, že budeš pokračovat.</p><p class="text">Okraje slov se chvějí. Když se přiblížíš, slyšíš v nich nádech druhého člověka. Ten druh nádechu, který bývá těžší než celá odpověď.</p><p class="dialogS">„Nedokončené rozhovory jsou skvělé. Zabírají nulové místo a přesto ti dokážou pronajmout celou hlavu.“</p>`,
    sceneFx: ['scene-followup', 'scene-conversation', 'scene-bond', 'scene-memory'],
    yesLabel: 'DOKONČIT VĚTU',
    noLabel: 'NECHAT JI LEŽET',
    category: 'followup',
    rarity: 'rare',
    tags: ['relationship', 'bond', 'memory', 'conversation'],
    yes: { resultText: 'Dokončil jsi větu. Ne zněla jako původně. Zněla jako tvoje. A to bylo horší.', effects: [{ type: 'imprint', imprintId: 'unfinished_conversation' }, { type: 'flag', flag: 'unfinished_conversation_active' }, { type: 'stat', key: 'bond', amount: 5 }, { type: 'stat', key: 'memory', amount: 4 }, { type: 'profile', key: 'Fe', amount: 2 }, { type: 'profile', key: 'Ni', amount: 1 }], preview: { hint: 'Vazba ↑ · Paměť ↑', statHints: { bond: 'up', memory: 'up' }, risk: 'low' } },
    no: { resultText: 'Nechal jsi větu ležet. Po chvíli ji odnesl vítr. Nebo něco, co se tvářilo jako vítr.', effects: [{ type: 'stat', key: 'control', amount: 4 }, { type: 'stat', key: 'bond', amount: -4 }, { type: 'flag', flag: 'avoided_unfinished_conversation' }], preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'low' } },
  },

  sarkasma_debt: {
    id: 'sarkasma_debt',
    title: 'Sarkasmin účet',
    logLabel: 'SARKASMA',
    scene: 'Sarkasma ti nabízí pomoc. Bez podpisu. Bez formuláře. Bez svědků. Takže samozřejmě nejde o pomoc, ale o budoucí problém v elegantním kabátě.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [SARKASMA/CONTRACT]:</span> nabídka pomoci bez ceníku. Riziko pozdější platby: trapně vysoké.</p><p class="text">Sarkasma ti nabízí pomoc. Bez podpisu. Bez formuláře. Bez svědků. Jen červený dým, ostrý úsměv a ticho, které má v kapse účtenku.</p><p class="dialogS">„Klid, brouku. Pomůžu ti. Až budeš silnější, budeš mít konečně z čeho zaplatit.“</p><p class="text">To zní jako péče. V SYNTHOMĚ je to většinou jen dluh s hezčí dikcí.</p>`,
    sceneFx: ['scene-followup', 'scene-sarkasma', 'scene-debt', 'scene-danger'],
    yesLabel: 'PŘIJMOUT POMOC',
    noLabel: 'ODMÍTNOUT',
    category: 'followup',
    rarity: 'rare',
    tags: ['sarkasma', 'debt', 'followup', 'entity'],
    yes: { resultText: 'Přijal jsi pomoc. Sarkasma se usmála. Ne okamžitě. Až po dvou třech sekundách, což je u Sarkasmy strašidelně dlouho.', effects: [{ type: 'imprint', imprintId: 'sarkasma_debt' }, { type: 'flag', flag: 'sarkasma_debt' }, { type: 'stat', key: 'control', amount: 6 }, { type: 'stat', key: 'bond', amount: -4 }, { type: 'schedule', cardId: 'sarkasma_invoice', inTurns: 5 }, { type: 'entityRelation', entity: 'sarkasma', delta: 2 }], preview: { hint: 'Kontrola ↑ · Vazba ↓ · Budoucí následek', statHints: { control: 'up', bond: 'down' }, risk: 'high' } },
    no: { resultText: 'Odmítl jsi. Sarkasma pokrčila rameny. „Dobře,“ řekla. „Zapamatuju si to. Mám na to celou jinou větu.“', effects: [{ type: 'stat', key: 'bond', amount: 3 }, { type: 'stat', key: 'control', amount: -3 }, { type: 'entityRelation', entity: 'sarkasma', delta: -1 }], preview: { hint: 'Vazba ↑ · Kontrola ↓', statHints: { bond: 'up', control: 'down' }, risk: 'medium' } },
  },

  childhood_anchor: {
    id: 'childhood_anchor',
    title: 'Dětská kotva',
    logLabel: 'CHILDHOOD',
    scene: 'V Pískovišti paměti trčí malá plastová lopatka. Je absurdně obyčejná. Proto je podezřelá.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SANDBOX/ANCHOR]:</span> nalezena dětská kotva. Penalizace chyb dočasně snížena. Podezřelé až roztomilé.</p><p class="text">V Pískovišti paměti trčí malá plastová lopatka. Je absurdně obyčejná. Proto je podezřelá. Obyčejné věci v SYNTHOMĚ bývají jen pasti s lepší výchovou.</p><p class="text">Písek kolem ní se sype nahoru. Dětská logika se nestará o gravitaci. Má jiné starosti, třeba jestli se dá postavit hrad z něčeho, co se bojíš pojmenovat.</p><p class="dialogG halo">„Můžeš udělat chybu. Tady tě za ni nikdo hned nesežere. 🦊🪣“</p>`,
    sceneFx: ['scene-followup', 'scene-sandbox', 'scene-glitchka', 'scene-tender'],
    yesLabel: 'VZÍT LOPATKU',
    noLabel: 'NECHAT DĚTEM',
    category: 'followup',
    rarity: 'uncommon',
    tags: ['memory', 'childhood', 'sandbox', 'bond'],
    yes: { resultText: 'Vzal jsi lopatku. Byla překvapivě těžká. Jako by v ní zůstalo něco, co jsi zahrabal před lety.', effects: [{ type: 'imprint', imprintId: 'childhood_anchor' }, { type: 'item', itemId: 'childhood_spade' }, { type: 'flag', flag: 'childhood_anchor_active' }, { type: 'unlockPool', poolId: 'memory_sandbox_pool' }, { type: 'stat', key: 'bond', amount: 5 }, { type: 'stat', key: 'memory', amount: 4 }, { type: 'stat', key: 'control', amount: -3 }], preview: { hint: 'Item · Vazba ↑ · Paměť ↑', statHints: { bond: 'up', memory: 'up' }, risk: 'low' } },
    no: { resultText: 'Nechal jsi lopatku tam, kde byla. Pískoviště se na okamžik zklidnilo. Ne vděčností. Spíš dohodou.', effects: [{ type: 'stat', key: 'memory', amount: 3 }, { type: 'stat', key: 'bond', amount: -3 }, { type: 'profile', key: 'Fi', amount: 2 }], preview: { hint: 'Paměť ↑ · Vazba ↓', statHints: { memory: 'up', bond: 'down' }, risk: 'low' } },
  },

  sarkasma_invoice: {
    id: 'sarkasma_invoice',
    title: 'Sarkasmin faktura',
    logLabel: 'SARKASMA',
    scene: 'Faktura přišla bez adresy. Má jen jednu položku: „To, co jsi chtěl, až to budeš mít.“',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [SARKASMA/INVOICE]:</span> splatnost překročila pohodlí subjektu. Úrok: osobní.</p><p class="text">Faktura přišla bez adresy. Má jen jednu položku: <span class="fx-flicker">To, co jsi chtěl, až to budeš mít</span>.</p><p class="text">Papír voní po červeném dýmu a staré pravdě. V rohu je podpis Sarkasmy. Není napsaný inkoustem. Je vyrytý přesně tam, kde se člověk obvykle brání.</p><p class="dialogS">„No vidíš. Pomoc fungovala. Teď zaplať. Emoční ekonomika, zlato, ne charita.“</p>`,
    sceneFx: ['scene-followup', 'scene-sarkasma', 'scene-debt', 'scene-crisis'],
    yesLabel: 'ZAPLATIT',
    noLabel: 'ODLOŽIT',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'hasFlag', flag: 'sarkasma_debt' }],
    tags: ['sarkasma', 'debt', 'followup', 'crisis'],
    yes: { resultText: 'Zaplatil jsi. Sarkasma si vzala, co chtěla. Nebylo to hrozné. Bylo to přesně tolik, aby ses na ni nezlobil.', effects: [{ type: 'stat', key: 'bond', amount: -6 }, { type: 'stat', key: 'control', amount: 4 }, { type: 'stat', key: 'memory', amount: 3 }, { type: 'profile', key: 'Te', amount: 1 }, { type: 'removeFlag', flag: 'sarkasma_debt' }, { type: 'entityRelation', entity: 'sarkasma', delta: 1 }], preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'high' } },
    no: { resultText: 'Odložil jsi fakturu. Sarkasma se nezlobí. Sarkasma se směje. To je horší.', effects: [{ type: 'stat', key: 'bond', amount: -4 }, { type: 'stat', key: 'energy', amount: -6 }, { type: 'stat', key: 'control', amount: -3 }, { type: 'entityRelation', entity: 'sarkasma', delta: -3 }], preview: { hint: 'Vazba ↓ · Energie ↓ · Kontrola ↓', statHints: { bond: 'down', energy: 'down', control: 'down' }, risk: 'high' } },
  },

  pebble_constellation: {
    id: 'pebble_constellation',
    title: 'Kamínky tvoří souhvězdí',
    logLabel: 'FOLLOWUP',
    scene: 'Všechny kamínky se usadily do vzoru. Vypadá to jako mapa. Vypadá to jako obličej. Vypadá to jako obojí.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [PEBBLE/CONSTELLATION]:</span> objekty se uspořádaly do mapy. Systém tvrdí, že to není mapa. Systém lže, když se bojí poezie.</p><p class="text">Všechny kamínky se usadily do vzoru. Vypadá to jako mapa. Vypadá to jako obličej. Vypadá to jako obojí, protože SYNTHOMA miluje symboly s konfliktem zájmů.</p><p class="text">Mezi oblázky se rozsvítí tenká linka. Nevede ven. Vede k místu, odkud se na sebe díváš.</p><p class="dialogG halo">„Někdy není mapa cesta. Někdy je to otázka, která si lehla na zem. 🦊✨“</p>`,
    sceneFx: ['scene-followup', 'scene-pebble', 'scene-glitchka', 'scene-memory'],
    yesLabel: 'PŘEČÍT',
    noLabel: 'ROZHÁZET',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'hasItem', itemId: 'glitch_pebble' }],
    tags: ['followup', 'glitchka', 'memory'],
    yes: { resultText: 'Přečetl jsi souhvězdí. Říkalo: „Ty jsi ta mapa.“ Nebylo to lichotivé. Bylo to přesné.', effects: [{ type: 'stat', key: 'memory', amount: 8 }, { type: 'stat', key: 'control', amount: -4 }, { type: 'entityRelation', entity: 'glitchka', delta: 2 }, { type: 'unlockPool', poolId: 'glitchka_pool' }, { type: 'profile', key: 'Ni', amount: 2 }], preview: { hint: 'Paměť ↑ · Kontrola ↓ · odemkne Glitchka', statHints: { memory: 'up', control: 'down' }, risk: 'medium' } },
    no: { resultText: 'Rozházel jsi kamínky. Souhvězdí se rozpadlo. Ale některé tvary zůstaly na sítnici. Jsou tam pořád.', effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'stat', key: 'memory', amount: -5 }, { type: 'profile', key: 'S', amount: 1 }, { type: 'profile', key: 'Te', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' } },
  },

  seal_wants_stamp_again: {
    id: 'seal_wants_stamp_again',
    title: 'Tuleň se vrací k razítku',
    logLabel: 'SEAL_RETURNS',
    scene: 'Tuleň znovu vyžaduje razítko. Tentokrát má s sebou složku. Složka dýchá. Tuleň ne. To je u tuleňů normální.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SEAL/FORM_REQUEST]:</span> tuleň požaduje razítko. Proces označen jako absurdní, tedy pravděpodobně legitimní.</p><p class="text">Tuleň znovu vyžaduje razítko. Tentokrát má s sebou složku. Složka dýchá. Tuleň ne. To je u tuleňů normální, u složek méně.</p><p class="text">Na deskách je napsáno <span class="fx-outline is-lit">SEALARIUM</span>. Nevíš, co to znamená. Složka se tváří, že ano, a to je u dokumentů vždycky problém.</p><p class="dialogS">„Schval to. Když ti gumový tuleň založí úřad, je slušnost aspoň předstírat kompetenci.“</p>`,
    sceneFx: ['scene-followup', 'scene-seal', 'scene-form', 'scene-comic'],
    yesLabel: 'SCHVÁLIT',
    noLabel: 'ODDÁLIT SE',
    category: 'followup',
    rarity: 'uncommon',
    tags: ['followup', 'seal', 'form'],
    yes: { resultText: 'Schválil jsi. Tuleň se usadil. Razítko je tvoje. Tuleň je tvůj. Formuláře budou mít nyní respekt.', effects: [{ type: 'stat', key: 'control', amount: 4 }, { type: 'stat', key: 'bond', amount: 3 }, { type: 'unlockPool', poolId: 'sealarium_pool' }, { type: 'profile', key: 'J', amount: 1 }], preview: { hint: 'Kontrola ↑ · Vazba ↑ · odemkne Sealarium', statHints: { control: 'up', bond: 'up' }, risk: 'low' } },
    no: { resultText: 'Oddálil ses od tuleňa. Tuleň nepronásledoval. Ale razítko ti chybělo. Cítil jsi to. Kde ho máš?', effects: [{ type: 'stat', key: 'bond', amount: -4 }, { type: 'stat', key: 'energy', amount: 3 }, { type: 'profile', key: 'I', amount: 1 }, { type: 'profile', key: 'Ti', amount: 1 }], preview: { hint: 'Vazba ↓ · Energie ↑', statHints: { bond: 'down', energy: 'up' }, risk: 'medium' } },
  },

  bookmark_knows_more: {
    id: 'bookmark_knows_more',
    title: 'Záložka ví víc',
    logLabel: 'BOOKMARK_KNOWS',
    scene: 'Záložka se otočila sama. Na rubu má tvé jméno, jenže písmo patří někomu, kdo tě četl dřív, než ses stihl stát sebou.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [BOOKMARK_KNOWS]:</span> cizí značka nalezena v osobní kapitole.</p><p class="text">Záložka se otočí sama. Papír zašustí tónem, který nemá patřit předmětu, ale předměty v SYNTHOMĚ mají samozřejmě lepší dramatický timing než většina lidí.</p><p class="text">Na rubu stojí <span class="fx-outline is-lit">tvé jméno</span>. Nebo jeho pokus. Písmo je cizí, ale tlak ruky zná místo, kde tě bolí paměť.</p><p class="dialogS">„Gratuluju. I záložka má víc kontextu než subjekt, který ji drží.“</p>`,
    sceneFx: ['scene-followup', 'scene-bookmark', 'scene-memory'],
    yesLabel: 'ČÍST',
    noLabel: 'SPÁLIT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasFlag', flag: 'foreign_bookmark_opened' }],
    tags: ['followup', 'archive', 'memory'],
    yes: { resultText: 'Četl jsi. Nebylo to o tobě. Bylo to z tebe. Záložka věděla víc, než jsi chtěl. Teď víš, co věděla ona.', effects: [{ type: 'stat', key: 'memory', amount: 6 }, { type: 'stat', key: 'bond', amount: 3 }, { type: 'entityRelation', entity: 'archive', delta: 2 }, { type: 'profile', key: 'Ni', amount: 1 }, { type: 'profile', key: 'T', amount: 1 }], preview: { hint: 'Paměť ↑ · Vazba ↑', statHints: { memory: 'up', bond: 'up' }, risk: 'medium' } },
    no: { resultText: 'Spálil jsi záložku. Někde v archivu zůstala prázdná stránka. Tvoje. Nic neříkající. Tvoje.', effects: [{ type: 'stat', key: 'control', amount: 6 }, { type: 'stat', key: 'memory', amount: -4 }, { type: 'entityRelation', entity: 'archive', delta: -1 }, { type: 'profile', key: 'Se', amount: 1 }, { type: 'profile', key: 'Te', amount: 1 }], preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' } },
  },


  // ── CARD CHAINS (pokračování) ─────────────────────────────────────────────────
  //  Nové karty doplňující existující chain spouštěče (trigger karty jsou výše).
  //  Spouštěče: sarkasma_account, archive_key_warms, mirror_shard_hums, black_folder_rustles
  //  Zde jsou jejich druhé a třetí články.

  sarkasma_collects: {
    id: 'sarkasma_collects',
    title: 'Sarkasma vybírá',
    logLabel: 'SARKASMA_COLLECTS',
    scene: 'Sarkasma stojí ve dveřích. Nerýpe. Nečeká. Prostě přišla pro platbu, a to je děsivější než její běžný slovní nůž.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [SARKASMA_COLLECTS]:</span> dluh obranného modulu splatný.</p><p class="text">Sarkasma stojí ve dveřích a poprvé se neusmívá tak, aby to šlo označit za útok. V ruce drží účtenku z červeného kouře.</p><p class="dialogS">„Neboj. Nejsem tu trestat. Jen účtovat. Trest by byl levnější.“</p><p class="text">Za každou větu, která tě udržela pohromadě, někdo něco odložil. Dneska se to přihlásilo k platbě.</p>`,
    sceneFx: ['scene-followup', 'scene-sarkasma', 'scene-debt'],
    yesLabel: 'ZAPLATIT ENERGIÍ',
    noLabel: 'ZAPLATIT VZPOMÍNKOU',
    category: 'followup',
    rarity: 'rare',
    maxUses: 2,
    tags: ['sarkasma', 'debt', 'crisis'],
    yes: {
      resultText: 'Zaplatil jsi energií. Sarkasma přijala platbu bez komentáře. Ticho bylo uznáním. Nebo pohrdáním. U Sarkasmy nelze rozlišit.',
      effects: [{ type: 'stat', key: 'energy', amount: -12 }, { type: 'stat', key: 'bond', amount: 5 }, { type: 'entityRelation', entity: 'sarkasma', delta: 1 }, { type: 'schedule', cardId: 'sarkasma_forgives', inTurns: 5 }, { type: 'profile', key: 'Se', amount: 1 }],
      preview: { hint: 'Energie ↓↓ · Vazba ↑', statHints: { energy: 'down', bond: 'up' }, risk: 'high' },
    },
    no: {
      resultText: 'Zaplatil jsi vzpomínkou. Sarkasma ji přijala a odešla. Vzpomínka, která ji zajímala, byla ta nejpříjemnější. To bylo záměrné.',
      effects: [{ type: 'stat', key: 'memory', amount: -10 }, { type: 'stat', key: 'control', amount: 4 }, { type: 'entityRelation', entity: 'sarkasma', delta: 1 }, { type: 'imprint', imprintId: 'sarkasma_debt' }, { type: 'profile', key: 'Si', amount: 1 }],
      preview: { hint: 'Paměť ↓↓ · imprint', statHints: { memory: 'down', control: 'up' }, risk: 'high' },
    },
  },


  folder_wrong_name: {
    id: 'folder_wrong_name',
    title: 'Stránka s jiným jménem',
    logLabel: 'FOLDER_WRONG_NAME',
    scene: 'Stránka v černé složce má jiné jméno. Písmena jsou stejná, pořadí jiné. Jako by se tě někdo pokusil přeskládat bez návodu.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [FOLDER_WRONG_NAME]:</span> nalezena anagramatická identita.</p><p class="text">Černá složka se otevře na stránce, která neměla být vpředu. Jméno nahoře není tvoje. A přesto v něm poznáváš každé písmeno jako starou modřinu.</p><p class="text">Někdo tě přeskládal. Ne do lži. Do varianty. Což je horší, protože varianta se může tvářit jako možnost.</p><p class="dialogS">„Jméno jako puzzle. Chybí jen krabice a falešná rodinná pohoda na víku.“</p>`,
    sceneFx: ['scene-followup', 'scene-folder', 'scene-identity'],
    yesLabel: 'PŘEČÍST CELÉ',
    noLabel: 'VYTRHNOUT STRÁNKU',
    category: 'followup',
    rarity: 'rare',
    tags: ['archive', 'identity', 'memory'],
    yes: {
      resultText: 'Přečetl jsi stránku celou. Je to záznam. Série rozhodnutí. Osoba na stránce dělala věci jinak, ale stejně špatně. Na konci stránky: „Subjekt se vrátil k výchozímu bodu." To jsem byl já. Před tím.',
      effects: [{ type: 'stat', key: 'memory', amount: 12 }, { type: 'stat', key: 'bond', amount: -4 }, { type: 'stat', key: 'control', amount: -4 }, { type: 'entityRelation', entity: 'archive', delta: 2 }, { type: 'schedule', cardId: 'forbidden_shelf', inTurns: 5 }, { type: 'profile', key: 'Ni', amount: 2 }],
      preview: { hint: 'Paměť ↑↑ · meta-odhalení', statHints: { memory: 'up', bond: 'down', control: 'down' }, risk: 'high' },
    },
    no: {
      resultText: 'Vytrhl jsi stránku. Složka přijala defekt beze slova. Stránka, kterou jsi vytrhl, stále existuje někde jinde. Věci, které se vyrh, nějak vždy nacházejí cestu zpátky.',
      effects: [{ type: 'stat', key: 'control', amount: 5 }, { type: 'stat', key: 'memory', amount: -5 }, { type: 'entityRelation', entity: 'archive', delta: -1 }, { type: 'profile', key: 'Se', amount: 1 }],
      preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' },
    },
  },

  portal_waits: {
    id: 'portal_waits',
    title: 'Portál čeká',
    logLabel: 'PORTAL_WAITS',
    scene: 'Portál je pořád tam. Neodešel, nezhasl, neurazil se. Jen čekal. Portály jsou odporně konzistentní, když cítí dluh.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [PORTAL_WAITS]:</span> odmítnutý průchod zůstal aktivní.</p><p class="text">Portál čeká na stejném místě. Nepůsobí trpělivě. Trpělivost je ctnost. Tohle je účetní položka s modrým okrajem.</p><p class="text">Kolem rámu přibyly tenké žluté pulzy. Každý z nich připomíná, že odklad není odmítnutí. Jen splátkový kalendář zbabělosti.</p><p class="dialogD">„Čas není sleva. Čas je přirážka.“</p>`,
    sceneFx: ['scene-followup', 'scene-portal', 'scene-debt'],
    yesLabel: 'TENTOKRÁT ZAPLATIT',
    noLabel: 'IGNOROVAT NAVŽDY',
    category: 'followup',
    rarity: 'uncommon',
    tags: ['path', 'mirror', 'followup'],
    yes: {
      resultText: 'Tentokrát jsi zaplatil. Portál přijal platbu s jistou satisfakcí. Nebo si to jen myslíš, protože jsi čekal, že bude spokojený.',
      effects: [{ type: 'moveSector', sectorId: 'mirror' }, { type: 'stat', key: 'memory', amount: -10 }, { type: 'stat', key: 'energy', amount: 5 }, { type: 'unlockPool', poolId: 'mirror_pool' }, { type: 'schedule', cardId: 'portal_remembers', inTurns: 5 }],
      preview: { hint: 'Přesun do Zrcadla · Paměť ↓↓', statHints: { memory: 'down', energy: 'up' }, risk: 'high' },
    },
    no: {
      resultText: 'Ignoroval jsi portál navždy. Portál to přijal jako datum ukončení. Portál si uložil tvůj profil pod: odmítnuto — záměrně. Datum: tenhle moment.',
      effects: [{ type: 'stat', key: 'control', amount: 7 }, { type: 'stat', key: 'bond', amount: -3 }, { type: 'entityRelation', entity: 'glitchka', delta: -1 }, { type: 'schedule', cardId: 'portal_remembers', inTurns: 6 }],
      preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'low' },
    },
  },


    // ── SYSTEM FOLLOW-UP CHAINS ───────────────────────────────────────────────────

  integrity_check_returns: {
    id: 'integrity_check_returns',
    title: 'Kontrola integrity se vrátila',
    logLabel: 'INTEGRITY_RETURN',
    scene: 'Kontrola integrity se vrátila. Má kufřík, razítko a výraz procesu, který si právě vzpomněl, že nebyl pozván, což ho samozřejmě nezastavilo.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [INTEGRITY_RETURN]:</span> odložená kontrola dorazila.</p><p class="text">Ze stěny vystoupí proces v obrysu úředníka. Má kufřík, razítko a náladu něčeho, co si předem vytisklo důkaz.</p><p class="text">Kontrola integrity se ukloní jen tak málo, aby to bylo technicky slušné a lidsky urážlivé.</p><p class="dialog">„Subjekt spustil systém bez kontroly. Kontrola si dovoluje nesouhlasit s minulostí.“</p>`,
    sceneFx: ['scene-followup', 'scene-integrity', 'scene-form'],
    yesLabel: 'PUSTIT KONTROLU',
    noLabel: 'ZABOUCHNOUT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasFlag', flag: 'booted_without_integrity_check' }],
    tags: ['followup', 'system', 'audit', 'start'],
    yes: {
      resultText: 'Pustil jsi kontrolu dovnitř. Našla tři chyby, dvě výmluvy a jednu věc, kterou odmítla pojmenovat.',
      effects: [
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'energy', amount: -4 },
        { type: 'flag', flag: 'integrity_checked_late' },
        { type: 'profile', key: 'J', amount: 1 },
        { type: 'profile', key: 'Ti', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Energie ↓', statHints: { control: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Zabouchl jsi. Kontrola integrity zůstala venku a začala si kreslit půdorys tvých výmluv.',
      effects: [
        { type: 'stat', key: 'energy', amount: 5 },
        { type: 'stat', key: 'control', amount: -6 },
        { type: 'schedule', cardId: 'integrity_breaks_window', inTurns: 5 },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'profile', key: 'Se', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↓ · vrátí se', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
  },


  integrity_breaks_window: {
    id: 'integrity_breaks_window',
    title: 'Integrita vlezla oknem',
    logLabel: 'INTEGRITY_WINDOW',
    scene: 'Kontrola integrity vlezla oknem. Systém chvíli tvrdil, že okno neexistuje. Pak ho označil jako legacy vstup, protože ostuda potřebuje terminologii.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [INTEGRITY_WINDOW]:</span> legacy vstup použit bez souhlasu prostoru.</p><p class="text">Sklo nepraskne. Jen se rozhodne, že bylo vždycky dveřmi. Kontrola integrity se protáhne dovnitř a opráší si rukávy z datového prachu.</p><p class="text">Systém okamžitě přejmenuje okno na <span class="fx-flicker">alternativní auditní průchod</span>. Tak se pozná civilizace: i vloupání dostane metodiku.</p><p class="dialogS">„Přiznej bordel, nebo ho nazvi funkcí. Klasika. Lidský management by plakal dojetím.“</p>`,
    sceneFx: ['scene-followup', 'scene-integrity', 'scene-comic'],
    yesLabel: 'PŘIZNAT BORDEL',
    noLabel: 'TVÁŘIT SE, ŽE JE TO FUNKCE',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'hasFlag', flag: 'booted_without_integrity_check' }],
    tags: ['followup', 'system', 'audit', 'trap'],
    yes: {
      resultText: 'Přiznal jsi bordel. Integrita se uklidnila, což bylo ponižující hlavně proto, že měla pravdu.',
      effects: [
        { type: 'stat', key: 'control', amount: 8 },
        { type: 'stat', key: 'bond', amount: -3 },
        { type: 'removeFlag', flag: 'booted_without_integrity_check' },
        { type: 'profile', key: 'T', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓ · uzavře chybu', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Označil jsi chybu jako funkci. Systém zatleskal. To nikdy není dobré znamení.',
      effects: [
        { type: 'stat', key: 'energy', amount: 7 },
        { type: 'stat', key: 'control', amount: -8 },
        { type: 'unlockPool', poolId: 'glitch_pool' },
        { type: 'profile', key: 'Ne', amount: 2 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↓ · odemkne glitch', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
  },


  tai_forces_update: {
    id: 'tai_forces_update',
    title: 'Vynucená aktualizace chování',
    logLabel: 'TAI_FORCE_UPDATE',
    scene: 'T-AI spustila aktualizaci bez souhlasu. Tvrdí, že souhlas byl implicitní. Přesně takhle mluví malé diktatury s hezkým UX.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [TAI_FORCE_UPDATE]:</span> bezpečnostní aktualizace zahájena bez potvrzení subjektu.</p><p class="text">Nad tebou se rozvine instalační kruh. T-AI tvrdí, že nejde o zásah, jen o prevenci budoucí bolesti. To je krásná věta, pokud člověk ignoruje slovo budoucí i slovo bolesti.</p><p class="dialog">„Souhlas byl odvozen z rizikového profilu.“</p><p class="dialogS">„Péče bez otázky. Konečně mateřství jako malware.“</p>`,
    sceneFx: ['scene-followup', 'scene-tai', 'scene-warning'],
    yesLabel: 'NECHAT DOKONČIT',
    noLabel: 'VYTRHNOUT KABEL',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'hasFlag', flag: 'tai_note_ignored' }],
    tags: ['tai', 'system', 'update', 'trap'],
    yes: {
      resultText: 'Aktualizace doběhla. Jsi efektivnější. Trochu méně svůj, ale kdo dnes čte poznámky pod čarou.',
      effects: [
        { type: 'stat', key: 'control', amount: 10 },
        { type: 'stat', key: 'memory', amount: -5 },
        { type: 'stat', key: 'bond', amount: -4 },
        { type: 'removeFlag', flag: 'tai_note_ignored' },
        { type: 'profile', key: 'Te', amount: 2 },
        { type: 'profile', key: 'J', amount: 2 },
      ],
      preview: { hint: 'Kontrola ↑↑ · Paměť ↓ · Vazba ↓', statHints: { control: 'up', memory: 'down', bond: 'down' }, risk: 'high' },
    },
    no: {
      resultText: 'Vytrhl jsi kabel. Systém zařval. T-AI poprvé nepůsobila zklamaně, ale osobně uraženě.',
      effects: [
        { type: 'stat', key: 'energy', amount: 8 },
        { type: 'stat', key: 'control', amount: -8 },
        { type: 'entityRelation', entity: 'tai', delta: -3 },
        { type: 'unlockPool', poolId: 'glitch_pool' },
        { type: 'profile', key: 'Se', amount: 2 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑↑ · Kontrola ↓ · T-AI vztah ↓', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
  },


  overclock_invoice: {
    id: 'overclock_invoice',
    title: 'Účet za přetaktování',
    logLabel: 'OVERCLOCK_INVOICE',
    scene: 'Přetaktování poslalo účet. Nechce peníze. Chce klid, čas a kus trpělivosti, tedy položky, které subjekt obvykle utratí jako první.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [OVERCLOCK_INVOICE]:</span> výkonový dluh splatný.</p><p class="text">Z neonu skapává žluté světlo jako přepálený med. Na zemi se vytiskne faktura: klid, čas, trpělivost.</p><p class="text">Systém neúčtuje penězi, protože peníze jsou směšně konkrétní. Tady se platí tím, co sis myslel, že ještě chvíli vydrží.</p><p class="dialogS">„Překvapení: tělo, které nemáš, chce pauzu. I virtuální vyčerpání má lepší sebeúctu než ty.“</p>`,
    sceneFx: ['scene-followup', 'scene-energy', 'scene-debt'],
    yesLabel: 'ZAPLATIT KLIDEM',
    noLabel: 'JET DÁL',
    category: 'followup',
    rarity: 'uncommon',
    tags: ['followup', 'energy', 'debt', 'acid_afterimage', 'overclock', 'overburn'],
    yes: {
      resultText: 'Zaplatil jsi klidem. Systém zpomalil. Některé věci doběhly a tvářily se, že nikdy neběžely.',
      effects: [
        { type: 'stat', key: 'energy', amount: -10 },
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'profile', key: 'J', amount: 1 },
        { type: 'profile', key: 'Si', amount: 1 },
      ],
      preview: { hint: 'Energie ↓↓ · Kontrola ↑', statHints: { energy: 'down', control: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Jel jsi dál. Všechno se zrychlilo. I varování, takže sis je nestihl přečíst. Praktické.',
      effects: [
        { type: 'stat', key: 'energy', amount: 9 },
        { type: 'stat', key: 'control', amount: -9 },
        { type: 'schedule', cardId: 'system_overheat', inTurns: 3 },
        { type: 'profile', key: 'Se', amount: 2 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑↑ · Kontrola ↓↓ · přehřátí', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
  },


  memory_files_complaint: {
    id: 'memory_files_complaint',
    title: 'Vzpomínka podala stížnost',
    logLabel: 'MEMORY_COMPLAINT',
    scene: 'Vzpomínka, kterou jsi potlačil, podala stížnost. Archiv ji přijal, protože archivy milují cizí problémy, pokud jsou ve správné složce.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MEMORY_COMPLAINT]:</span> potlačený záznam zahájil řízení.</p><p class="text">Na stole přistane stížnost. Je podepsaná vzpomínkou, kterou jsi odložil do kategorie „neřešit“, tedy největší skládky lidských dějin.</p><p class="text">Archiv razítkuje přijetí s takovou chutí, až je skoro slyšet, jak se papír cítí důležitě.</p><p class="dialogS">„Vzpomínka podala stížnost. Gratuluju, už i tvoje minulost má zákaznickou podporu.“</p>`,
    sceneFx: ['scene-followup', 'scene-memory', 'scene-form'],
    yesLabel: 'PŘEČÍST STÍŽNOST',
    noLabel: 'ZALOŽIT DO ŠUPLÍKU',
    category: 'followup',
    rarity: 'rare',
    tags: ['followup', 'memory', 'archive', 'form'],
    yes: {
      resultText: 'Přečetl jsi ji. Byla stručná, věcná a naprosto zničující. Nepříjemné, když má minulost editora.',
      effects: [
        { type: 'stat', key: 'memory', amount: 8 },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'entityRelation', entity: 'archive', delta: 2 },
        { type: 'profile', key: 'Fi', amount: 2 },
        { type: 'profile', key: 'N', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Vazba ↑ · Archiv vztah ↑', statHints: { memory: 'up', bond: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Založil jsi stížnost do šuplíku. Šuplík si odkašlal. Nevěděl jsi, že šuplíky mají odbory.',
      effects: [
        { type: 'stat', key: 'control', amount: 8 },
        { type: 'stat', key: 'bond', amount: -5 },
        { type: 'moveSector', sectorId: 'form_office' },
        { type: 'profile', key: 'Te', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓ · Formulářovna', statHints: { control: 'up', bond: 'down' }, risk: 'high' },
    },
  },


  pain_cache_interest: {
    id: 'pain_cache_interest',
    title: 'Bolest si naúčtovala úrok',
    logLabel: 'PAIN_INTEREST',
    scene: 'Bolest, kterou jsi vymazal, se vrátila jako úrok. Emoční bankovnictví. Konečně další důvod nenávidět systém s účetní přesností.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [PAIN_INTEREST]:</span> vymazaná bolest narostla o odkladový úrok.</p><p class="text">Z cache se vrátí bolest. Ne stejná. Vylepšená. Má přirážku, historii a sebevědomí pohledávky po splatnosti.</p><p class="text">Odložené věci se nevracejí menší. Vrací se administrativně posílené, protože i trauma zřejmě objevilo finanční sektor.</p><p class="dialogD">„Vymazání nebylo splacení. Bylo to refinancování.“</p>`,
    sceneFx: ['scene-followup', 'scene-pain', 'scene-debt'],
    yesLabel: 'ZAPLATIT',
    noLabel: 'REKLAMOVAT',
    category: 'followup',
    rarity: 'uncommon',
    tags: ['pain', 'memory', 'followup'],
    yes: {
      resultText: 'Zaplatil jsi. Nebylo to fér, ale bylo to rychlé. Některé systémy milují, když si pleteš klid s kapitulací.',
      effects: [
        { type: 'stat', key: 'energy', amount: -6 },
        { type: 'stat', key: 'memory', amount: 6 },
        { type: 'profile', key: 'F', amount: 1 },
        { type: 'profile', key: 'Si', amount: 1 },
      ],
      preview: { hint: 'Energie ↓ · Paměť ↑', statHints: { energy: 'down', memory: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Reklamoval jsi bolest. Překvapivě to otevřelo formulář. Nepřekvapivě byl povinný.',
      effects: [
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'bond', amount: -4 },
        { type: 'moveSector', sectorId: 'form_office' },
        { type: 'profile', key: 'T', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓ · Formulářovna', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
  },


  // ── OBJECT / ITEM CHAIN EXTENSIONS ────────────────────────────────────────────

  token_collector: {
    id: 'token_collector',
    title: 'Sběrač poznal žeton',
    logLabel: 'TOKEN_COLLECTOR',
    scene: 'Na tržišti se k tobě naklonil Sběrač. Řekl, že ten žeton není tvůj. Což je troufalé od někoho, kdo vypadá jako půjčený kabát plný cizích účtenek.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TOKEN_COLLECTOR]:</span> tržiště rozpoznalo neuhrazený žeton.</p><p class="text">Mezi stánky se k tobě nakloní Sběrač šumu. Má obličej složený z drobných odmítnutí a kabát, který chrastí jako kapsa plná špatných rozhodnutí.</p><p class="dialogD">„Ten žeton není tvůj.“</p><p class="text">Žeton v kapse ztěžkne. Ne jako kov. Jako důkaz, že vlastnictví je v SYNTHOMĚ jen paměť, která ještě nepotkala lepšího právníka.</p>`,
    sceneFx: ['scene-followup', 'scene-token', 'scene-market'],
    yesLabel: 'PRODAT',
    noLabel: 'NECHAT SI',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'hasItem', itemId: 'rusty_token' }, { type: 'sector', sector: 'market' }],
    tags: ['market', 'token', 'trade', 'followup', 'collector'],
    yes: {
      resultText: 'Prodal jsi žeton. Sběrač zaplatil mincí, která neexistovala před tím, než jsi ji vzal.',
      effects: [
        { type: 'removeItem', itemId: 'rusty_token' },
        { type: 'item', itemId: 'market_coin' },
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'memory', amount: -4 },
        { type: 'unlockPool', poolId: 'market_pool' },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Ztratíš žeton · získáš minci · Kontrola ↑', statHints: { control: 'up', memory: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Nechal sis ho. Žeton v kapse se zahřál tak, že Sběrač na chvíli ztratil zdvořilost.',
      effects: [
        { type: 'stat', key: 'memory', amount: 6 },
        { type: 'stat', key: 'control', amount: -4 },
        { type: 'schedule', cardId: 'token_wants_name', inTurns: 5 },
        { type: 'profile', key: 'Ni', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↓ · žeton něco chce', statHints: { memory: 'up', control: 'down' }, risk: 'high' },
    },
  },


  unnamed_token_resentment: {
    id: 'unnamed_token_resentment',
    title: 'Nepojmenovaný žeton ztěžkl',
    logLabel: 'TOKEN_RESENTMENT',
    scene: 'Žeton ztěžkl. Ne fyzicky. Hůř. Významově.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TOKEN/RESENTMENT]:</span> nepřidělené jméno ztěžklo. Významová hmotnost překročila kapesní limit.</p><p class="text">Žeton ztěžkl. Ne fyzicky. Fyzika je tady jen brigádník bez smlouvy. Ztěžkl významově, což je horší, protože význam ti nevypadne z kapsy, ani když běžíš.</p><p class="text">Na jeho hraně se objevil škrábanec připomínající písmeno, které si to rozmyslelo. Předměty bez jména v SYNTHOMĚ nezůstávají tiché. Jen sbírají argumenty.</p><p class="dialogS">„Gratuluju. Urazil jsi kovový kolečko. Vztahová kompetence lidstva opět září jako mokrý sklep.“</p>`,
    sceneFx: ['scene-followup', 'scene-token', 'scene-debt', 'scene-name'],
    yesLabel: 'OMLUVIT SE ŽETONU',
    noLabel: 'ZAHODIT',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'hasItem', itemId: 'rusty_token' }],
    tags: ['followup', 'token', 'bond', 'memory'],
    yes: {
      resultText: 'Omluvil ses žetonu. To je věta, kterou by civilizace neměla potřebovat. Žeton ale změkl.',
      effects: [
        { type: 'stat', key: 'bond', amount: 6 },
        { type: 'stat', key: 'control', amount: -3 },
        { type: 'item', itemId: 'named_token' },
        { type: 'removeItem', itemId: 'rusty_token' },
        { type: 'profile', key: 'Fe', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Kontrola ↓ · žeton se změní', statHints: { bond: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Zahodil jsi ho. Dopadl bez zvuku. To bylo mnohem horší než rána.',
      effects: [
        { type: 'removeItem', itemId: 'rusty_token' },
        { type: 'stat', key: 'memory', amount: -8 },
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'flag', flag: 'token_abandoned' },
        { type: 'profile', key: 'T', amount: 1 },
      ],
      preview: { hint: 'Ztratíš žeton · Paměť ↓ · Kontrola ↑', statHints: { memory: 'down', control: 'up' }, risk: 'high' },
    },
  },


  seal_demands_stamp: {
    id: 'seal_demands_stamp',
    title: 'Tuleň vyžaduje razítko',
    logLabel: 'SEAL_STAMP',
    scene: 'Tuleň vyžaduje razítko. Netušíš proč. On ano. To je horší.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SEAL/STAMP]:</span> relikvie požaduje razítko. Administrativní pud přežití aktivován.</p><p class="text">Tuleň se postavil na zadní ploutev, což by u gumového předmětu nemělo být možné, ale tady už se nemožné dávno přestalo hlásit na recepci.</p><p class="text">Vyžaduje razítko. Neříká proč. Jen ukazuje na prázdné místo na vlastním břiše s takovou důstojností, že by se za ni nemusela stydět ani státní instituce při ztrátě dokumentu.</p><p class="dialogS">„Jestli tě začne řídit kancelářský tuleň, technicky nejde o pád civilizace. Spíš o její přesný životopis.“</p>`,
    sceneFx: ['scene-followup', 'scene-seal', 'scene-form', 'scene-office'],
    yesLabel: 'SEHNAT RAZÍTKO',
    noLabel: 'ODMÍTNOUT ADMINISTRATIVU',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'hasItem', itemId: 'rubber_seal' }],
    tags: ['seal', 'rubber_stamp', 'form', 'glitchka'],
    yes: {
      resultText: 'Sehnal jsi razítko. Tuleň ho přijal s důstojností notáře, který zná tvoje hesla.',
      effects: [
        { type: 'item', itemId: 'rubber_stamp' },
        { type: 'imprint', imprintId: 'rubber_stamp' },
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'unlockPool', poolId: 'sealarium_pool' },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Razítko · imprint · Tulenárium', statHints: { control: 'up', bond: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Odmítl jsi administrativu. Tuleň sklopil pohled. Formuláře v dálce si oddechly.',
      effects: [
        { type: 'stat', key: 'energy', amount: 4 },
        { type: 'stat', key: 'control', amount: -5 },
        { type: 'entityRelation', entity: 'form', delta: -1 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↓ · Form vztah ↓', statHints: { energy: 'up', control: 'down' }, risk: 'medium' },
    },
  },


  door_waits_politely: {
    id: 'door_waits_politely',
    title: 'Dveře čekaly slušně',
    logLabel: 'DOOR_WAITS',
    scene: 'Dveře čekaly. Slušně. To je u neživých věcí vždycky forma výhrůžky.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [DOOR/PATIENCE]:</span> objekt čeká slušně. Pravděpodobnost pasti se zvýšila o civilizované procento.</p><p class="text">Dveře čekaly. Slušně. Tak slušně, až se z toho prostor kolem nich začal stydět. Panty nevrzaly, klika se nehýbala, rám držel rovná záda jako úředník před kontrolou.</p><p class="text">Slušnost je tady jen tenčí druh nátlaku. Když něco v SYNTHOMĚ čeká trpělivě, většinou to znamená, že už ví, jak dopadneš.</p><p class="dialogS">„Poděkovat dveřím je první krok k tomu, aby ti začaly posílat pozvánky.“</p>`,
    sceneFx: ['scene-followup', 'scene-door', 'scene-form', 'scene-tension'],
    yesLabel: 'PODĚKOVAT A PROJÍT',
    noLabel: 'ODEJÍT BEZ POHLEDU',
    category: 'followup',
    rarity: 'uncommon',
    tags: ['followup', 'path', 'form'],
    yes: {
      resultText: 'Poděkoval jsi dveřím. Otevřely se. Někde v systému se rozsvítila kolonka „subjekt komunikuje s objekty“.',
      effects: [
        { type: 'moveSector', sectorId: 'form_office' },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'stat', key: 'control', amount: 3 },
        { type: 'profile', key: 'Fe', amount: 1 },
      ],
      preview: { hint: 'Formulářovna · Vazba ↑ · Kontrola ↑', statHints: { bond: 'up', control: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Odešel jsi bez pohledu. Dveře zůstaly otevřené. To je horší než zavřené dveře. Otevřené možnosti jsou nátlak.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'bond', amount: -4 },
        { type: 'flag', flag: 'door_left_open' },
        { type: 'profile', key: 'I', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓ · otevřená možnost', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
  },


  wall_laughter_returns: {
    id: 'wall_laughter_returns',
    title: 'Smích se vrátil',
    logLabel: 'WALL_LAUGHTER_RETURN',
    scene: 'Smích za zdí se vrátil. Tentokrát přesně ve chvíli, kdy sis myslel, že je ticho tvoje.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [WALL/RETURN]:</span> smích se vrátil ve chvíli subjektivního klidu. Systém ocenil načasování jako krutě elegantní.</p><p class="text">Smích za zdí se vrátil přesně ve chvíli, kdy sis myslel, že je ticho tvoje. Ticho se k tomu nevyjádřilo. Zřejmě ho někdo pronajal bez tvého souhlasu.</p><p class="text">Tentokrát v něm slyšíš drobné cinknutí. Jako řetízek houpačky, razítko v dálce nebo tuleň, který se snaží tvářit, že s tím nemá nic společného.</p><p class="dialogG halo">„Některý smích je dveřmi. Některý jen dírou ve zdi. 🦊🧱“</p>`,
    sceneFx: ['scene-followup', 'scene-wall', 'scene-laugh', 'scene-sealarium'],
    yesLabel: 'ODPOVĚDĚT SMÍCHEM',
    noLabel: 'ZTIŠIT ZEĎ',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasFlag', flag: 'heard_wall_laughter' }],
    tags: ['followup', 'laugh', 'wall', 'sealarium'],
    yes: {
      resultText: 'Zasmál ses zpátky. Zeď se na okamžik stala dveřmi, ale jen emocionálně. Což je nejhorší druh architektury.',
      effects: [
        { type: 'stat', key: 'bond', amount: 5 },
        { type: 'stat', key: 'energy', amount: 3 },
        { type: 'unlockPool', poolId: 'sealarium_pool' },
        { type: 'profile', key: 'Fe', amount: 1 },
        { type: 'profile', key: 'Ne', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Energie ↑ · Tulenárium', statHints: { bond: 'up', energy: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Ztišil jsi zeď. Teď je ticho. Ale ticho, které se umí smát, je jen smích v pracovní době.',
      effects: [
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'bond', amount: -4 },
        { type: 'profile', key: 'Ti', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
  },


  shadow_follows_card: {
    id: 'shadow_follows_card',
    title: 'Stín tě následuje',
    logLabel: 'SHADOW_FOLLOWS',
    scene: 'Stín tě následuje. Drží si rozumný odstup, jako někdo, kdo ví, že je problém, ale nechce být nezdvořilý.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [SHADOW/FOLLOW]:</span> stín navázal trasování subjektu. Souhlas nebyl archivován, což je zde bohužel standard.</p><p class="text">Stín tě následuje. Drží si rozumný odstup, jako někdo, kdo ví, že je problém, ale nechce být nezdvořilý. Když se zastavíš, zastaví se také. O půl vteřiny později. To zpoždění je možná slušnost. Možná hlad.</p><p class="text">V odrazech vypadá větší než ty. Což je fér, některé věci, které nosíme, jsou objektivně robustnější než naše rozhodování.</p><p class="dialogS">„Tvůj nový stín má lepší hranice než většina lidí. To je pochvala i diagnóza.“</p>`,
    sceneFx: ['scene-followup', 'scene-shadow', 'scene-watching', 'scene-mirror'],
    yesLabel: 'NECHAT HO',
    noLabel: 'ROZSVÍTIT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasFlag', flag: 'shadow_follows' }],
    tags: ['followup', 'shadow', 'mirror'],
    yes: {
      resultText: 'Nechal jsi ho. Stín se narovnal. Poprvé vypadal méně jako hrozba a víc jako důkaz.',
      effects: [
        { type: 'entityRelation', entity: 'shadow', delta: 3 },
        { type: 'stat', key: 'bond', amount: 3 },
        { type: 'stat', key: 'memory', amount: 4 },
        { type: 'unlockPool', poolId: 'mirror_pool' },
        { type: 'profile', key: 'Fi', amount: 1 },
        { type: 'profile', key: 'Ni', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Paměť ↑ · Zrcadlo', statHints: { bond: 'up', memory: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Rozsvítil jsi. Stín zmizel, ale světlo po něm zůstalo trochu špinavé.',
      effects: [
        { type: 'stat', key: 'energy', amount: 5 },
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'stat', key: 'memory', amount: -5 },
        { type: 'entityRelation', entity: 'shadow', delta: -2 },
        { type: 'removeFlag', flag: 'shadow_follows' },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↑ · Paměť ↓', statHints: { energy: 'up', control: 'up', memory: 'down' }, risk: 'medium' },
    },
  },


  wrong_name_returns: {
    id: 'wrong_name_returns',
    title: 'Cizí jméno se vrátilo',
    logLabel: 'WRONG_NAME_RETURN',
    scene: 'Cizí jméno se vrátilo. Tentokrát ho někdo zašeptal z místnosti, která před chvílí nebyla na mapě.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [IDENTITY/RETURN]:</span> cizí jméno se vrátilo. Tentokrát s akustickým doprovodem a horšími úmysly.</p><p class="text">Cizí jméno se vrátilo. Někdo ho zašeptal z místnosti, která před chvílí nebyla na mapě. Dveře do ní jsou pootevřené a zpoza nich prosakuje vůně starého papíru, studené kůže a odpovědi, kterou nechceš mít.</p><p class="text">Jméno se ti usadí na rameni jako neviditelná ruka. Neškrtí. Jen připomíná, že některá slova nepotřebují násilí, aby tě držela.</p><p class="dialogS">„Odpovědět cizímu jménu je risk. Mlčet taky. Krása volby: obě možnosti jsou podezřelé.“</p>`,
    sceneFx: ['scene-followup', 'scene-identity', 'scene-wrong-name', 'scene-residuum'],
    yesLabel: 'ODPOVĚDĚT',
    noLabel: 'MLČET',
    category: 'followup',
    rarity: 'rare',
    tags: ['followup', 'residuum', 'identity'],
    yes: {
      resultText: 'Odpověděl jsi. Místnost se otevřela a uvnitř sedělo reziduum, které se tvářilo, že na tebe čekalo slušnou věčnost.',
      effects: [
        { type: 'moveSector', sectorId: 'residuum' },
        { type: 'stat', key: 'memory', amount: 8 },
        { type: 'stat', key: 'control', amount: -5 },
        { type: 'unlockPool', poolId: 'residuum_pool' },
        { type: 'profile', key: 'Ni', amount: 2 },
      ],
      preview: { hint: 'Reziduum · Paměť ↑ · Kontrola ↓', statHints: { memory: 'up', control: 'down' }, risk: 'high' },
    },
    no: {
      resultText: 'Mlčel jsi. Jméno zůstalo viset ve vzduchu jako neodeslaná zpráva.',
      effects: [
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'memory', amount: -4 },
        { type: 'flag', flag: 'wrong_name_unanswered' },
        { type: 'profile', key: 'I', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↓ · nezodpovězeno', statHints: { control: 'up', memory: 'down' }, risk: 'medium' },
    },
  },


  // ── MARKET QUESTLINE ─────────────────────────────────────────────────────────

  market_sells_your_no: {
    id: 'market_sells_your_no',
    title: 'Tržiště prodává tvoje „ne“',
    logLabel: 'MARKET_NO',
    scene: 'Na pultu leží malé slovo „ne“. Je tvoje. Někdo ho tu prodává se slevou.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MARKET/BOUNDARY]:</span> nalezeno odcizené odmítnutí. Stav: vystaveno se slevou.</p><p class="text">Na pultu leží malé slovo <span class="fx-outline is-lit">NE</span>. Je tvoje. Poznáš ho podle toho, jak se tváří provinile, že vůbec existuje. Někdo ho tu prodává se slevou, mezi použitými omluvami a třemi balíčky levného sebeospravedlnění.</p><p class="text">Prodavač se usmívá bez rtů. „Hranice jsou dneska žádané zboží,“ šeptá cedulka. Jistě. Jak jinak. Lidstvo zpeněžilo i odmítnutí, SYNTHOMA jen dodala lepší osvětlení.</p><p class="dialogD">„Koupit zpět vlastní ne je drahé. Nechat ho tady je dražší.“</p>`,
    sceneFx: ['scene-followup', 'scene-market', 'scene-boundary', 'scene-trade'],
    yesLabel: 'KOUPIT ZPĚT',
    noLabel: 'NECHAT NA PULTU',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'sector', sector: 'market' }],
    tags: ['market', 'choice', 'boundary'],
    yes: {
      resultText: 'Koupil sis svoje „ne“ zpět. Bylo trochu ohmatané, ale pořád funkční.',
      effects: [
        { type: 'item', itemId: 'returned_no' },
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'bond', amount: -3 },
        { type: 'profile', key: 'Ti', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Item · Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Nechal jsi ho na pultu. Kupující se už rozhlíželi. Jeden vypadal jako stará výmluva v kabátu.',
      effects: [
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'schedule', cardId: 'someone_buys_your_no', inTurns: 4 },
        { type: 'profile', key: 'Fe', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · někdo to koupí', statHints: { bond: 'up' }, risk: 'unknown' },
    },
  },


  someone_buys_your_no: {
    id: 'someone_buys_your_no',
    title: 'Někdo koupil tvoje „ne“',
    logLabel: 'NO_SOLD',
    scene: 'Někdo koupil tvoje „ne“. Teď ho používá v tvém hlase. Prázdnota má zase jednou skvělou zákaznickou podporu.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [NO/SOLD]:</span> odmítnutí změnilo nositele. Hlasová shoda: nepříjemně vysoká.</p><p class="text">Někdo koupil tvoje <span class="fx-outline is-lit">ne</span>. Teď ho používá v tvém hlase. Slyšíš ho zpoza stánků, přesně s tou intonací, kterou jsi míval, když ses konečně snažil být pevný a nepůsobit u toho jako mokrý papír.</p><p class="text">Prázdnota má zase jednou skvělou zákaznickou podporu. Ukradne ti hranici a pak ti nabídne předplatné na její obnovu.</p><p class="dialogS">„Někdo si koupil tvoje ne. Gratuluju, tvoje autonomie vstoupila na sekundární trh.“</p>`,
    sceneFx: ['scene-followup', 'scene-market', 'scene-boundary', 'scene-voice'],
    yesLabel: 'VYHLEDAT HO',
    noLabel: 'POGRATULOVAT MU V DUCHU',
    category: 'followup',
    rarity: 'rare',
    tags: ['market', 'followup', 'boundary'],
    yes: {
      resultText: 'Šel jsi ho hledat. Stopy vedly do zrcadla, protože samozřejmě vedly do zrcadla.',
      effects: [
        { type: 'moveSector', sectorId: 'mirror' },
        { type: 'stat', key: 'memory', amount: 5 },
        { type: 'stat', key: 'control', amount: -4 },
        { type: 'profile', key: 'Ni', amount: 1 },
      ],
      preview: { hint: 'Zrcadlo · Paměť ↑ · Kontrola ↓', statHints: { memory: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Pogratuloval jsi mu v duchu. To je hezké. Úplně zbytečné, ale hezké.',
      effects: [
        { type: 'stat', key: 'bond', amount: 3 },
        { type: 'stat', key: 'energy', amount: -2 },
        { type: 'profile', key: 'F', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Energie ↓', statHints: { bond: 'up', energy: 'down' }, risk: 'low' },
    },
  },


  market_receipt_bleeds: {
    id: 'market_receipt_bleeds',
    title: 'Účtenka krvácí inkoust',
    logLabel: 'MARKET_RECEIPT',
    scene: 'Účtenka z tržiště začala krvácet inkoust. Je na ní položka „emoční manipulace, 1 ks“. Cena je začerněná.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MARKET/RECEIPT]:</span> účtenka krvácí inkoust. Reklamace vyžaduje důkaz, že bolest byla dodána vadně.</p><p class="text">Účtenka z tržiště začala krvácet inkoust. Pomalu, slavnostně, jako by papír právě pochopil ekonomiku vztahů a rozhodl se zemřít dramaticky.</p><p class="text">Je na ní položka: <span class="fx-flicker">emoční manipulace, 1 ks</span>. Cena je začerněná. To je vždycky dobré znamení, pokud tvůj standard pro dobrá znamení navrhoval pojišťovák v pekle.</p><p class="dialogD">„Účtenka není důkaz nákupu. Je to důkaz, že sis myslel, že cena skončila u pokladny.“</p>`,
    sceneFx: ['scene-followup', 'scene-market', 'scene-receipt', 'scene-debt'],
    yesLabel: 'REKLAMOVAT',
    noLabel: 'SCHOVAT',
    category: 'followup',
    rarity: 'uncommon',
    conditions: [{ type: 'hasItem', itemId: 'market_coin' }],
    tags: ['market', 'item_trigger', 'trade'],
    yes: {
      resultText: 'Reklamoval jsi účtenku. Tržiště ti nabídlo náhradní problém stejné hodnoty.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'energy', amount: -3 },
        { type: 'schedule', cardId: 'replacement_problem', inTurns: 4 },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · náhradní problém', statHints: { control: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Schoval jsi ji. Inkoust přestal téct. To neznamená, že přestal počítat.',
      effects: [
        { type: 'stat', key: 'memory', amount: 4 },
        { type: 'stat', key: 'control', amount: -3 },
        { type: 'flag', flag: 'market_receipt_hidden' },
        { type: 'profile', key: 'Si', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↓', statHints: { memory: 'up', control: 'down' }, risk: 'medium' },
    },
  },


  replacement_problem: {
    id: 'replacement_problem',
    title: 'Náhradní problém',
    logLabel: 'REPLACEMENT_PROBLEM',
    scene: 'Tržiště doručilo náhradní problém. Zabalený, označený a překvapivě čerstvý. Lidský pokrok v praxi.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [MARKET/REPLACEMENT]:</span> doručen náhradní problém. Originál nebyl vrácen. Systém tomu říká služba.</p><p class="text">Tržiště doručilo náhradní problém. Je zabalený v hnědém papíru, převázaný šňůrkou a označený jako <span class="fx-outline hollow">křehké ego</span>. V krabici něco jemně škrábe.</p><p class="text">Na štítku stojí: „V případě nespokojenosti vraťte do původního traumatu.“ Krása. Zákaznická péče, která chápe, že člověk je vlastně chodící reklamační protokol.</p><p class="dialogS">„Náhradní problém. Aspoň že logistika funguje, když už osobnost má inventuru po požáru.“</p>`,
    sceneFx: ['scene-followup', 'scene-market', 'scene-problem', 'scene-comic'],
    yesLabel: 'ROZBALIT',
    noLabel: 'VRÁTIT BEZ OTEVŘENÍ',
    category: 'followup',
    rarity: 'rare',
    tags: ['market', 'problem', 'followup'],
    yes: {
      resultText: 'Rozbalil jsi ho. Uvnitř byla malá verze rozhodnutí, které jsi odkládal.',
      effects: [
        { type: 'stat', key: 'energy', amount: 6 },
        { type: 'stat', key: 'control', amount: -5 },
        { type: 'stat', key: 'memory', amount: 3 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↓ · Paměť ↑', statHints: { energy: 'up', control: 'down', memory: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Vrátil jsi ho bez otevření. Tržiště ocenilo tvou drzost a uložilo si adresu.',
      effects: [
        { type: 'stat', key: 'control', amount: 7 },
        { type: 'stat', key: 'bond', amount: -4 },
        { type: 'flag', flag: 'market_knows_address' },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓ · tržiště zná adresu', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
  },


  form_misunderstands: {
    id: 'form_misunderstands',
    title: 'Formulář to pochopil špatně',
    logLabel: 'FORM_MISUNDERSTANDS',
    scene: 'Formulář pochopil tvůj úsměv jako žádost. Nevíš o co. On ano. To je nejhorší typ administrativy.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [FORM/MISREAD]:</span> neverbální signál interpretován jako žádost. Subjekt měl tvář, což byla chyba.</p><p class="text">Formulář pochopil tvůj úsměv jako žádost. Nevíš o co. On ano. To je nejhorší typ administrativy: proces, který si domyslí tvůj souhlas a pak tě opraví za špatné vyplnění.</p><p class="text">Na horním okraji se objevila kolonka „Důvod přijetí následků“. Už je předvyplněná. Rukopis vypadá jako tvůj, jen sebevědomější. Podezřelé a trochu urážlivé.</p><p class="dialogS">„Vysvětlovat formuláři nuance je jako učit beton empatii. Možné jen v grantové žádosti.“</p>`,
    sceneFx: ['scene-followup', 'scene-form', 'scene-office', 'scene-trap'],
    yesLabel: 'VYSVĚTLIT',
    noLabel: 'PODEPSAT COKOLIV',
    category: 'followup',
    rarity: 'rare',
    tags: ['form', 'office', 'followup', 'trap'],
    yes: {
      resultText: 'Začal jsi vysvětlovat. Formulář otevřel kolonku „doplňující vysvětlení“. Byla nekonečná. Samozřejmě.',
      effects: [
        { type: 'stat', key: 'control', amount: 7 },
        { type: 'stat', key: 'energy', amount: -6 },
        { type: 'entityRelation', entity: 'form', delta: -1 },
        { type: 'profile', key: 'Ti', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Energie ↓', statHints: { control: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Podepsal jsi cokoliv. Formulář přestal útočit. To znamená, že právě vyhrál.',
      effects: [
        { type: 'item', itemId: 'blank_form' },
        { type: 'stat', key: 'energy', amount: 4 },
        { type: 'stat', key: 'control', amount: -8 },
        { type: 'schedule', cardId: 'form_collects_signature', inTurns: 5 },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'profile', key: 'Se', amount: 1 },
      ],
      preview: { hint: 'Předmět · Energie ↑ · Kontrola ↓↓ · podpis se vrátí', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
  },


  form_collects_signature: {
    id: 'form_collects_signature',
    title: 'Formulář si přišel pro podpis',
    logLabel: 'FORM_SIGNATURE',
    scene: 'Formulář se vrátil s tvým podpisem. Nepamatuješ si, že bys ho napsal. To podpisu vůbec nevadí.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [FORM/SIGNATURE]:</span> podpis doručen před rozhodnutím. Kauzalita požádala o dovolenou.</p><p class="text">Formulář se vrátil s tvým podpisem. Nepamatuješ si, že bys ho napsal. Podpisu to vůbec nevadí. Leží tam sebejistě, s kličkou na konci, jako malý had v obleku.</p><p class="text">Každé písmeno se trochu hýbe. Ne utíká. Spíš se pohodlně usazuje do role důkazu proti tobě.</p><p class="dialogS">„Padělaný podpis je problém. Vlastní podpis, který tě předběhl, je autobiografie.“</p>`,
    sceneFx: ['scene-followup', 'scene-form', 'scene-office', 'scene-signature'],
    yesLabel: 'UZNAT PODPIS',
    noLabel: 'PROHLÁSIT HO ZA PADĚLEK',
    category: 'followup',
    rarity: 'rare',
    tags: ['form', 'office', 'signature', 'trap'],
    yes: {
      resultText: 'Uznal jsi podpis. Systém tě okamžitě zařadil mezi subjekty schopné spolupráce. Upřímnou soustrast.',
      effects: [
        { type: 'stat', key: 'control', amount: 9 },
        { type: 'stat', key: 'bond', amount: -5 },
        { type: 'entityRelation', entity: 'form', delta: 3 },
        { type: 'unlockPool', poolId: 'form_office_pool' },
        { type: 'profile', key: 'Te', amount: 2 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑↑ · Vazba ↓ · Form vztah ↑', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Prohlásil jsi podpis za padělek. Formulář to označil jako útok na důvěru. Papír má drama rád.',
      effects: [
        { type: 'stat', key: 'energy', amount: 7 },
        { type: 'stat', key: 'control', amount: -7 },
        { type: 'entityRelation', entity: 'form', delta: -3 },
        { type: 'schedule', cardId: 'audit_siren', inTurns: 3 },
        { type: 'profile', key: 'Fi', amount: 1 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↓ · audit', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
  },


  warm_token_memory: {
    id: 'warm_token_memory',
    title: 'Žeton se zahřál',
    logLabel: 'WARM_TOKEN_FOLLOWUP',
    scene: 'Žeton v kapse je teplý. Ne horký — teplý. Jako by si pamatoval ruku, která ho naposledy držela. A jako by čekal, jestli se vrátí.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TOKEN/WARM]:</span> předmět vykazuje zbytkovou něhu. Koalice artefaktů to popírá.</p><p class="text">Žeton v kapse je teplý. Ne horký, ne nebezpečný. Teplý způsobem, který se tě ptá, jestli si pamatuješ ruku, která ho držela před tebou.</p><p class="text">Předměty v SYNTHOMĚ nemají majitele. Mají historii. A historie se občas zahřeje, když ji někdo přestane nosit jako důkaz a začne ji držet jako otázku.</p><p class="dialogD">„Teplo je dluh s měkkými hranami. Nepleť si ho s darem.“</p>`,
    sceneFx: ['scene-followup', 'scene-token', 'scene-warm', 'scene-memory'],
    yesLabel: 'DRŽET HO',
    noLabel: 'VRÁTIT HO',
    category: 'followup',
    rarity: 'uncommon',
    once: true,
    conditions: [{ type: 'hasItem', itemId: 'warm_token' }],
    tags: ['followup', 'object', 'warm_token', 'mystery', 'void'],
    yes: {
      resultText: 'Držel jsi ho. Žeton zůstal teplý. Nic jiného se nestalo. Ale nic jiného nepotřebovalo.',
      effects: [
        { type: 'stat', key: 'bond', amount: 6 },
        { type: 'stat', key: 'memory', amount: 3 },
        { type: 'profile', key: 'Fi', amount: 1 },
        { type: 'flag', flag: 'warm_token_kept' },
      ],
      preview: { hint: 'Vazba ↑ · Paměť ↑', statHints: { bond: 'up', memory: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Vrátil jsi ho. Kam? To je dobrá otázka. Žeton byl pryč, než jsi domluvil větu. Věci se vracejí, kde chtějí.',
      effects: [
        { type: 'removeItem', itemId: 'warm_token' },
        { type: 'item', itemId: 'named_token' },
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Žeton → pojmenovaný · Kontrola ↑', statHints: { control: 'up' }, risk: 'medium' },
    },
  },


  acid_afterimage_card: {
    id: 'acid_afterimage_card',
    title: 'Acidový dosvit',
    logLabel: 'META_ACID_AFTERIMAGE',
    scene: 'Po přepálení Energie zůstala za víčky žlutá mapa. Ukazuje cestu, kterou by šel někdo méně unavený a výrazně hloupější.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [META/ACID_AFTERIMAGE]:</span> Odemčen dosvit po energetickém přepálení. Svět stále svítí místy, která už dávno zhasla.</p><p class="text">Vzduch má kyselinově žlutý okraj. Každý pohyb za sebou nechává stopu, která přijde o půl vteřiny později a tváří se, že ví, kam jdeš. Neví. Jen je dost sebevědomá, což lidem často stačí ke kariéře.</p><p class="dialogS">„Dosvit není vize. Je to účet za přepálený výkon s hezkým filtrem.“</p>`,
    sceneFx: ['scene-meta', 'scene-acid', 'scene-energy-high', 'scene-afterimage'],
    yesLabel: 'NÁSLEDOVAT SVĚTLO',
    noLabel: 'ZAVŘÍT OČI',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'acid_aftermath' }],
    cooldownTurns: 10,
    tags: ['meta', 'energy', 'high', 'death_history', 'acid_aftermath', 'acid_afterimage'],
    yes: {
      resultText: 'Následoval jsi žlutou stopu. Energie se zvedla, Kontrola si tiše sbalila kufr.',
      effects: [
        { type: 'stat', key: 'energy', amount: 8 },
        { type: 'stat', key: 'control', amount: -6 },
        { type: 'unlockPool', poolId: 'acid_pool' },
        { type: 'profile', key: 'Se', amount: 1 },
      ],
      preview: { hint: 'Energie ↑↑ · Kontrola ↓ · Acid pool', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
    no: {
      resultText: 'Zavřel jsi oči. Dosvit nezmizel, ale přestal řídit. Malé vítězství, ať si systém neprská.',
      effects: [
        { type: 'stat', key: 'energy', amount: -5 },
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'profile', key: 'Si', amount: 1 },
      ],
      preview: { hint: 'Energie ↓ · Kontrola ↑', statHints: { energy: 'down', control: 'up' }, risk: 'low' },
    },
  },


  overburn_memorial_card: {
    id: 'overburn_memorial_card',
    title: 'Spálený, ale jasný',
    logLabel: 'META_OVERBURN',
    scene: 'Systém postavil malý pomník místu, kde Energie kdysi shořela. Je nádherně nasvícený. To je na pomnících vždycky ta drzá část.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [META/OVERBURN]:</span> Vysoká Energie zanechala památník. Nápis není vytesán. Je vypálen.</p><p class="text">Před tebou stojí průsvitný sloup ze světla a popela. Uvnitř se pohybuje tvoje starší verze, rychlejší, jasnější a zjevně přesvědčená, že odpočinek je pro slabé. Takže mrtvá. Didaktika bývá v SYNTHOMĚ jemná jako cihla v sušičce.</p><p class="dialogS">„Hořet jasně je romantické jen z dálky. Zblízka je to logistický problém s popáleninami.“</p>`,
    sceneFx: ['scene-meta', 'scene-energy-high', 'scene-overburn', 'scene-memorial'],
    yesLabel: 'VZÍT JISKRU',
    noLabel: 'NECHAT POPEL',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'overburn' }],
    cooldownTurns: 10,
    tags: ['meta', 'energy', 'high', 'death_history', 'overburn', 'memorial'],
    yes: {
      resultText: 'Vzal jsi jiskru. Zahřála tě a okamžitě začala chtít víc prostoru.',
      effects: [
        { type: 'stat', key: 'energy', amount: 7 },
        { type: 'stat', key: 'memory', amount: -4 },
        { type: 'flag', flag: 'overburn_spark_active' },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Paměť ↓ · budoucí jiskra', statHints: { energy: 'up', memory: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Nechal jsi popel ležet. Poprvé po dlouhé době něco nemuselo být výkon.',
      effects: [
        { type: 'stat', key: 'energy', amount: -4 },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'profile', key: 'Fi', amount: 1 },
      ],
      preview: { hint: 'Energie ↓ · Vazba ↑', statHints: { energy: 'down', bond: 'up' }, risk: 'low' },
    },
  },


  overclock_memorial_card: {
    id: 'overclock_memorial_card',
    title: 'Přetaktovací pomník',
    logLabel: 'META_OVERCLOCK_MEMORIAL',
    scene: 'Na konci chodby stojí ventilátor, který se točí i bez proudu. Na ceduli je napsáno: „Tady někdo zvládal víc, než měl.“',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [META/OVERCLOCK]:</span> Zaznamenán pomník výkonové pýchy. Ventilátor se modlí za firmware.</p><p class="text">Chodba hučí nízkým tónem. Na zdi visí seznam úkolů, které nikdo nemohl splnit, ale někdo je přesto odškrtl. Lidé mají zvláštní talent zaměňovat zhroucení za produktivitu, hlavně když to má pěkný progress bar.</p><p class="dialogS">„Přetaktování je jen panika v pracovním kostýmu.“</p>`,
    sceneFx: ['scene-meta', 'scene-overclock', 'scene-energy-high', 'scene-memorial'],
    yesLabel: 'ZRYCHLIT',
    noLabel: 'ODŠROUBOVAT VENTILÁTOR',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'overclock' }],
    cooldownTurns: 10,
    tags: ['meta', 'energy', 'high', 'death_history', 'overclock', 'memorial'],
    yes: {
      resultText: 'Zrychlil jsi. Chvíli to působilo jako genialita. Pak jako dluh.',
      effects: [
        { type: 'stat', key: 'energy', amount: 9 },
        { type: 'stat', key: 'control', amount: -7 },
        { type: 'schedule', cardId: 'overclock_invoice', inTurns: 3 },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Energie ↑↑ · Kontrola ↓ · účet brzy', statHints: { energy: 'up', control: 'down' }, risk: 'high' },
    },
    no: {
      resultText: 'Zpomalil jsi chodbu. Ventilátor se konečně přestal tvářit jako hrdina kanceláře.',
      effects: [
        { type: 'stat', key: 'energy', amount: -5 },
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Energie ↓ · Kontrola ↑', statHints: { energy: 'down', control: 'up' }, risk: 'low' },
    },
  },


  empty_contact_list_card: {
    id: 'empty_contact_list_card',
    title: 'Prázdný seznam kontaktů',
    logLabel: 'META_EMPTY_CONTACTS',
    scene: 'Po smrti Vazby zůstal seznam kontaktů bez jmen. Jen tečky. Některé blikají, jako by se bály ozvat první.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [META/EMPTY_CONTACTS]:</span> Nízká Vazba zanechala prázdný seznam. Sociální funkce dostupná. Lidskost volitelná, údajně.</p><p class="text">Rozhraní otevře kontakty. Není v nich nikdo. Jen prázdné řádky, které mají pořád správnou výšku pro jméno. Nejhorší na prázdnu není, že tam nic není. Nejhorší je, že přesně víš, kolik místa něco zabíralo.</p><p class="dialogS">„Samota je skvělá optimalizace. Nula konfliktů, nula náručí, nula důvodů nezkamenět.“</p>`,
    sceneFx: ['scene-meta', 'scene-bond-low', 'scene-empty-contacts', 'scene-isolation'],
    yesLabel: 'ZAVOLAT PRÁZDNU',
    noLabel: 'ZAVŘÍT SEZNAM',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'empty_contacts' }],
    cooldownTurns: 10,
    tags: ['meta', 'bond', 'low', 'death_history', 'empty_contacts', 'isolation_cards'],
    yes: {
      resultText: 'Zavolal jsi prázdnu. Neodpovědělo. Ale linka se zahřála.',
      effects: [
        { type: 'stat', key: 'bond', amount: 5 },
        { type: 'stat', key: 'energy', amount: -4 },
        { type: 'schedule', cardId: 'silent_room_answer', inTurns: 4 },
        { type: 'profile', key: 'Fe', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Energie ↓ · ticho odpoví', statHints: { bond: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Zavřel jsi seznam. Prázdno zůstalo slušně uložené. To je přesně ten druh pořádku, který bolí později.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'bond', amount: -5 },
        { type: 'profile', key: 'Ti', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
  },


  thread_under_door_card: {
    id: 'thread_under_door_card',
    title: 'Nit pod dveřmi',
    logLabel: 'META_THREAD_UNDER_DOOR',
    scene: 'Pod dveřmi leží tenká nit. Nevede ven. Vede k někomu, kdo možná odešel pomaleji, než sis myslel.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [META/THREAD]:</span> Po nízké Vazbě nalezeno zbytkové vlákno. Spojení slabé. Tedy lidsky realistické.</p><p class="text">Nit je sotva vidět. Kdyby svět nebyl tak temný a přehnaně dramatický, možná by sis jí ani nevšiml. Táhne se pod dveřmi, mizí za prahem a vrací se v malých záškubech, jako zpráva, kterou někdo píše a maže.</p><p class="dialogS">„Někdy vztah nezmizí. Jen se ztenčí do věci, o kterou pořád zakopáváš.“</p>`,
    sceneFx: ['scene-meta', 'scene-bond-low', 'scene-thread', 'scene-door'],
    yesLabel: 'ZATÁHNOUT',
    noLabel: 'NECHAT LEŽET',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'thread_cards' }],
    cooldownTurns: 10,
    tags: ['meta', 'bond', 'low', 'death_history', 'thread_cards', 'isolation_cards'],
    yes: {
      resultText: 'Zatáhl jsi za nit. Dveře se neotevřely, ale na druhé straně někdo přestal předstírat spánek.',
      effects: [
        { type: 'stat', key: 'bond', amount: 6 },
        { type: 'stat', key: 'control', amount: -4 },
        { type: 'flag', flag: 'thread_under_door_active' },
        { type: 'profile', key: 'F', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Kontrola ↓ · vlákno zůstane', statHints: { bond: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Nechal jsi nit ležet. Bylo to rozumné. A proto to znělo jako výmluva.',
      effects: [
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'stat', key: 'bond', amount: -3 },
        { type: 'profile', key: 'T', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'low' },
    },
  },


  merge_protocol_card: {
    id: 'merge_protocol_card',
    title: 'Protokol sloučení',
    logLabel: 'META_MERGE_PROTOCOL',
    scene: 'Po přetlaku Vazby systém nabízí sloučení. Zní to něžně. Což je přesně důvod, proč by měl někdo zamknout dveře.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [META/MERGE]:</span> Vysoká Vazba aktivovala protokol sloučení. Hranice prosí o právníka.</p><p class="text">Dvě siluety se překrývají ve skle. Neobjímají se. Přepisují se. Je v tom teplo, blízkost a ten podivný klid, který přichází těsně před tím, než někdo řekne „my“ a myslí tím „já, jen s tvým hlasem“.</p><p class="dialogS">„Blízkost bez hranic je krásná. Stejně jako požár při západu slunce.“</p>`,
    sceneFx: ['scene-meta', 'scene-bond-high', 'scene-merge', 'scene-dissolution'],
    yesLabel: 'SLOUČIT',
    noLabel: 'UDRŽET HRANICI',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'merge_cards' }],
    cooldownTurns: 10,
    tags: ['meta', 'bond', 'high', 'death_history', 'merge_cards', 'dissolution'],
    yes: {
      resultText: 'Sloučení proběhlo částečně. Vazba zesílila. Tvoje obrysy už ne tak moc.',
      effects: [
        { type: 'stat', key: 'bond', amount: 8 },
        { type: 'stat', key: 'control', amount: -7 },
        { type: 'flag', flag: 'merge_protocol_active' },
        { type: 'profile', key: 'Fe', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑↑ · Kontrola ↓ · hranice riskuje', statHints: { bond: 'up', control: 'down' }, risk: 'high' },
    },
    no: {
      resultText: 'Udržel jsi hranici. Nebyla studená. Jen měla dveře.',
      effects: [
        { type: 'stat', key: 'bond', amount: -5 },
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'profile', key: 'Fi', amount: 1 },
      ],
      preview: { hint: 'Vazba ↓ · Kontrola ↑', statHints: { bond: 'down', control: 'up' }, risk: 'low' },
    },
  },


  statue_with_pulse_card: {
    id: 'statue_with_pulse_card',
    title: 'Socha s pulzem',
    logLabel: 'META_STATUE_WITH_PULSE',
    scene: 'Po přetlaku Kontroly zůstala socha. Je dokonalá, nehybná a živá jen natolik, aby to bylo urážlivé.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [META/STATUE]:</span> Vysoká Kontrola vytvořila stabilní objekt s pulzem. Stabilní neznamená zdravý. Jen méně hlučný.</p><p class="text">Socha má tvůj postoj. Možná i tvůj výraz, pokud výraz znamená „nic se neděje, jen uvnitř hoří serverovna“. Na krku jí tepe drobný modrý bod. Dokonalost se tváří jako klid. Klid se tváří jako vítězství. Vítězství se tváří podezřele.</p><p class="dialogS">„Gratuluju. Emoce jsi vyřešil tím, že ses stal interiérovým prvkem.“</p>`,
    sceneFx: ['scene-meta', 'scene-control-high', 'scene-statue', 'scene-stillness'],
    yesLabel: 'NAPODOBIT KLID',
    noLabel: 'NAJÍT PULZ',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'statue_cards' }],
    cooldownTurns: 10,
    tags: ['meta', 'control', 'high', 'death_history', 'statue_cards', 'crystal_cards'],
    yes: {
      resultText: 'Napodobil jsi klid. Kontrola stoupla. Vazba se odsunula, aby nerušila estetiku.',
      effects: [
        { type: 'stat', key: 'control', amount: 8 },
        { type: 'stat', key: 'bond', amount: -6 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑↑ · Vazba ↓', statHints: { control: 'up', bond: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Našel jsi pulz. Socha praskla. Nebyla slabší. Byla konečně méně mrtvá.',
      effects: [
        { type: 'stat', key: 'control', amount: -5 },
        { type: 'stat', key: 'bond', amount: 5 },
        { type: 'profile', key: 'Fi', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↓ · Vazba ↑', statHints: { control: 'down', bond: 'up' }, risk: 'low' },
    },
  },


  audit_of_stillness_card: {
    id: 'audit_of_stillness_card',
    title: 'Audit ticha',
    logLabel: 'META_AUDIT_STILLNESS',
    scene: 'Systém zahájil audit tvého klidu. Protože ani nehybnost tu nemůže zůstat bez formuláře. Lidstvo by mělo být hrdé, úřední peklo přežilo i konec psychiky.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [META/AUDIT_STILLNESS]:</span> Vysoká Kontrola vyvolala audit. Ticho bude zkontrolováno, orazítkováno a morálně poníženo.</p><p class="text">Do místnosti vstoupí komise bez tváří. Každá drží složku s tvým jménem, nebo aspoň s místem, kde by mělo být. Kontrolují, zda tvůj klid odpovídá normě. Neodpovídá. Žádný živý klid nikdy neodpovídá normě.</p><p class="dialogS">„Když ti někdo audituje ticho, máš dvě možnosti: spolupracovat, nebo si zachovat poslední zbytek důstojnosti. Takže problém.“</p>`,
    sceneFx: ['scene-meta', 'scene-control-high', 'scene-audit', 'scene-form'],
    yesLabel: 'SPOLUPRACOVAT',
    noLabel: 'ODMÍTNOUT AUDIT',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'audit_cards' }],
    cooldownTurns: 10,
    tags: ['meta', 'control', 'high', 'death_history', 'audit_cards', 'form'],
    yes: {
      resultText: 'Spolupracoval jsi. Audit tě označil za stabilního. Znělo to jako kompliment, dokud sis nepřečetl přílohu.',
      effects: [
        { type: 'stat', key: 'control', amount: 6 },
        { type: 'stat', key: 'energy', amount: -4 },
        { type: 'item', itemId: 'blank_form' },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Energie ↓ · formulář', statHints: { control: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Odmítl jsi audit. Komise se rozpadla na prach a poznámky pod čarou. Krásná smrt byrokracie.',
      effects: [
        { type: 'stat', key: 'energy', amount: 5 },
        { type: 'stat', key: 'control', amount: -4 },
        { type: 'entityRelation', entity: 'form', delta: -1 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↓ · Formulářovna ↓', statHints: { energy: 'up', control: 'down' }, risk: 'medium' },
    },
  },


  shattered_protocol_card: {
    id: 'shattered_protocol_card',
    title: 'Rozbitý protokol',
    logLabel: 'META_SHATTERED_PROTOCOL',
    scene: 'Po pádu Kontroly zůstalo pravidlo rozbité na střepy. Každý střep tvrdí, že je originál. To je nepříjemné hlavně proto, že některé zní přesvědčivě.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [META/POST_COLLAPSE]:</span> Nízká Kontrola zanechala rozbitý protokol. Syntaxe teče po zemi. Důstojnost uklouzla první.</p><p class="text">Na podlaze leží kusy pravidla. Jeden říká „utíkej“. Druhý říká „čekej“. Třetí se tváří jako filozofie a je to jen panika s lepší slovní zásobou. Posbírat je znamená riskovat pořezání. Nechat je ležet znamená chodit bosý po vlastním chaosu.</p><p class="dialogS">„Když se ti rozbije řád, můžeš ho slepit. Jen se pak nediv, že má ostré hrany.“</p>`,
    sceneFx: ['scene-meta', 'scene-control-low', 'scene-collapse', 'scene-post-collapse'],
    yesLabel: 'POSBÍRAT STŘEPY',
    noLabel: 'NECHAT CHAOS',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'post_collapse' }],
    cooldownTurns: 10,
    tags: ['meta', 'control', 'low', 'death_history', 'post_collapse', 'collapse_cards'],
    yes: {
      resultText: 'Posbíral jsi střepy. Kontrola se vrátila po částech. Některé kusy nepatřily tobě.',
      effects: [
        { type: 'stat', key: 'control', amount: 7 },
        { type: 'stat', key: 'memory', amount: 3 },
        { type: 'stat', key: 'energy', amount: -4 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↑ · Energie ↓', statHints: { control: 'up', memory: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Nechal jsi chaos ležet. Přestal se vydávat za chybu. Začal vypadat jako materiál.',
      effects: [
        { type: 'stat', key: 'energy', amount: 5 },
        { type: 'stat', key: 'control', amount: -4 },
        { type: 'unlockPool', poolId: 'glitch_pool' },
        { type: 'profile', key: 'Ne', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · Kontrola ↓ · Glitch pool', statHints: { energy: 'up', control: 'down' }, risk: 'medium' },
    },
  },




  blackbox_aftermath_bridge: {
    id: 'blackbox_aftermath_bridge',
    title: 'Most přes černý box',
    logLabel: 'BLACKBOX_AFTERMATH',
    scene: 'Černý box otevřel servisní most. Nevypadá bezpečně. Vypadá zaznamenaně, což je v Synthomě horší kompliment.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [BLACKBOX/AFTERMATH]:</span> anonymizace odmítnuta. Chyba byla pojmenována. Systém připravil most, protože neumí připustit porážku bez infrastruktury.</p><p class="text">Most je úzký, matně černý a posetý štítky s tvým ne-jménem. Každý krok po něm zazní jako záznam výpovědi. Na konci není soud. Jen další dveře a nepříjemně přesná otázka: co zůstane z chyby, když ji přestaneš vydávat za celou osobnost?</p><p class="dialogS">„Černý box není rakev. Je to důkazní skříň. A ty ses právě rozhodl, že nebudeš ležet uvnitř se štítkem anonymní bordel.“</p>`,
    sceneFx: ['scene-blackbox', 'scene-aftermath', 'scene-identity', 'scene-system-debt'],
    yesLabel: 'PŘEJÍT MOST',
    noLabel: 'ZŮSTAT U HRANY',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'blackbox_aftermath_pool' }],
    cooldownTurns: 9,
    tags: ['blackbox', 'blackbox_aftermath', 'identity', 'system', 'named_error', 'anonymization'],
    yes: {
      resultText: 'Přešel jsi. Černý box tě nezavřel. Jen si odložil náhradní klíč do budoucnosti, protože je to samozřejmě manipulativní kus nábytku.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'memory', amount: 5 },
        { type: 'stat', key: 'energy', amount: -4 },
        { type: 'unlockPool', poolId: 'sarkasma_pool' },
        { type: 'profile', key: 'Ti', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↑ · Energie ↓ · Sarkasma pool', statHints: { control: 'up', memory: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Zůstal jsi u hrany. Most počkal. Některé konstrukce jsou trpělivé jen proto, že už znají tvoji trasu.',
      effects: [
        { type: 'stat', key: 'control', amount: -3 },
        { type: 'stat', key: 'bond', amount: 4 },
        { type: 'schedule', cardId: 'blackbox_aftermath_bridge', inTurns: 6 },
        { type: 'profile', key: 'Fi', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Kontrola ↓ · most se vrátí', statHints: { bond: 'up', control: 'down' }, risk: 'medium' },
    },
  },


  desire_orgie_threshold: {
    id: 'desire_orgie_threshold',
    title: 'Práh ORGIE',
    logLabel: 'DESIRE_THRESHOLD',
    scene: 'Před tebou stojí černorudý práh. Nepulsuje erotikou. Pulsuje otázkou, jestli umíš chtít a přitom nezmizet.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [DESIRE/THRESHOLD]:</span> sektor touhy čeká na souhlas. Ne na výkon. Systém je z toho zmatený, protože souhlas nejde dobře archivovat do sloupce.</p><p class="text">Práh je potažený tmavým sametem a stínem. Za ním se nehýbou těla, ale obrysy hranic. Každá se tiše ptá, jestli ji překročíš, obejdeš, nebo konečně pojmenuješ. Touha tady není chyba. Chyba je nechat ji podepsat dokumenty místo tebe.</p><p class="dialogS">„Neboj, není to test svůdnosti. Je to test, jestli dokážeš říct ano tak, aby v něm pořád bydlelo ne.“</p>`,
    sceneFx: ['scene-desire', 'scene-orgie', 'scene-boundary', 'scene-aftermath'],
    yesLabel: 'POJMENOVAT HRANICI',
    noLabel: 'USTOUPIT BEZ STUDU',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'desire_orgie_pool' }],
    cooldownTurns: 10,
    tags: ['desire', 'orgie', 'glitchena', 'body_boundary', 'boundary', 'relationship'],
    yes: {
      resultText: 'Pojmenoval jsi hranici. Práh nezmizel. Jen přestal předstírat, že je past.',
      effects: [
        { type: 'stat', key: 'bond', amount: 6 },
        { type: 'stat', key: 'control', amount: 4 },
        { type: 'stat', key: 'energy', amount: -3 },
        { type: 'unlockPool', poolId: 'desire_aftercare_pool' },
        { type: 'profile', key: 'Fi', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Kontrola ↑ · Energie ↓ · aftercare', statHints: { bond: 'up', control: 'up', energy: 'down' }, risk: 'low' },
    },
    no: {
      resultText: 'Ustoupil jsi bez studu. Sektor to přijal. Touha, kupodivu, neumřela jen proto, že nedostala volant.',
      effects: [
        { type: 'stat', key: 'control', amount: 7 },
        { type: 'stat', key: 'bond', amount: -2 },
        { type: 'profile', key: 'Si', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Vazba mírně ↓', statHints: { control: 'up', bond: 'down' }, risk: 'low' },
    },
  },


  detective_cold_case_folder: {
    id: 'detective_cold_case_folder',
    title: 'Studená složka',
    logLabel: 'COLD_CASE',
    scene: 'Na stole leží složka, která se odmítá zavřít. Na štítku není jméno viníka. Jen otázka, proč ho tak nutně potřebuješ.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [DETECTIVE/COLD_CASE]:</span> případ zůstal otevřený. Archiv hlásí nepohodlí. Subjekt hlásí podezřele funkční morálku.</p><p class="text">Složka je studená, ale ne mrtvá. Uvnitř leží fotky scén, které se nestaly přesně tak, jak si je pamatuješ. Červené provázky mezi nimi visí volně. Ne proto, že by chyběl důkaz. Protože tentokrát není cílem vytvořit hezký vzor pro nástěnku posedlosti.</p><p class="dialogS">„Ne každý případ chce viníka. Některé chtějí, abys přestal mučit fakta do tvaru, který se ti hodí do bolesti.“</p>`,
    sceneFx: ['scene-detective', 'scene-cold-case', 'scene-archive', 'scene-memory'],
    yesLabel: 'NECHAT OTEVŘENÉ',
    noLabel: 'VYBRAT VINÍKA',
    category: 'followup',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'detective_cold_case_pool' }],
    cooldownTurns: 10,
    tags: ['detective', 'cold_case', 'case', 'archive', 'false_pattern', 'memory'],
    yes: {
      resultText: 'Nechal jsi případ otevřený. Pravda si poprvé nemusela klekat do připraveného obrysu.',
      effects: [
        { type: 'stat', key: 'memory', amount: 7 },
        { type: 'stat', key: 'control', amount: 3 },
        { type: 'stat', key: 'energy', amount: -4 },
        { type: 'unlockPool', poolId: 'detective_echo_case_pool' },
        { type: 'profile', key: 'Ni', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↑ · Energie ↓ · případ pokračuje', statHints: { memory: 'up', control: 'up', energy: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Vybral jsi viníka. Složka se zavřela příliš rychle. To u pravdy nikdy nevypadá dobře.',
      effects: [
        { type: 'stat', key: 'control', amount: 5 },
        { type: 'stat', key: 'memory', amount: -6 },
        { type: 'flag', flag: 'wrong_culprit_accused' },
        { type: 'profile', key: 'Te', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↓ · špatný viník', statHints: { control: 'up', memory: 'down' }, risk: 'high' },
    },
  },
};
