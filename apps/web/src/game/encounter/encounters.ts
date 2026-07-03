import type { EncounterDefinition } from './encounterTypes';

// ── 12 encounter definitions ──────────────────────────────────────────────────

export const ENCOUNTERS: Record<string, EncounterDefinition> = {
  'combat-sumovy-bezec': {
    id: 'combat-sumovy-bezec',
    type: 'combat',
    title: 'Šumový běžec',
    logLabel: 'ENCOUNTER_NOISE_RUNNER',
    intro: [
      'Sektor se zúžil do chodby, kterou nikdo nenavrhl.\nTo je poznat podle toho, že vede přímo k problému.\n\nZe stěny se odlepila postava.\nNejdřív to vypadalo jako člověk.\nPak jako chyba.\nPak jako člověk, který chybu povýšil na kariérní směr.\n\nŠumový běžec se rozběhl.',
      'Ticho bylo příliš tiché.\nTakový druh ticha, který předchází něčemu, co se pohybuje rychleji, než by mělo.\n\nZe stínu vyšel Šumový běžec.',
    ],
    enemyIds: ['sumovy-bezec'],
    rewardPool: ['kompresni-uder', 'nouzova-obrana', 'dash-mimo-protokol', 'prepsat-chybu'],
    tags: ['common', 'combat', 'act-1'],
  },

  'combat-archivni-chyba': {
    id: 'combat-archivni-chyba',
    type: 'combat',
    title: 'Archivní chyba',
    logLabel: 'ENCOUNTER_ARCHIVE_ERROR',
    intro: [
      'V sektoru nezlobil nikdo. Pak přišla entita, která se rozhodla, že právě tato dokumentace je neúplná.\n\nArchivní chyba nevypadá agresivně.\nNevypadá ani přátelsky.\nVypadá jako problém, který má přesný formulář a spoustu trpělivosti.',
      'Na stěně se objevila chyba. Ne metaforicky — doslova část sektoru přestala souhlasit se zbytkem.\nArchivní chyba přišla vyplnit příslušný formulář.',
    ],
    enemyIds: ['archivni-chyba'],
    rewardPool: ['prepsat-chybu', 'archivni-bypass', 'nelegalni-zkratka', 'nouzova-obrana'],
    tags: ['common', 'combat', 'act-1'],
  },

  'combat-acidova-larva': {
    id: 'combat-acidova-larva',
    type: 'combat',
    title: 'Acidová larva',
    logLabel: 'ENCOUNTER_ACID_LARVA',
    intro: [
      'Malá věc na podlaze.\nPrůhledná. Téměř neviditelná.\nZměnilo by to situaci, kdybys ji zahlédl dřív?\nPravděpodobně ne. Ale byl bys méně překvapen.',
      'Acidová larva nevypadala jako hrozba.\nAcidum v jejím těle ale hrozbu nenahlásilo.\nProstě začalo dělat svou práci.',
    ],
    enemyIds: ['acidova-larva'],
    rewardPool: ['kompresni-uder', 'gumovy-tuleň-zasahuje', 'nouzova-obrana', 'klidna-zona'],
    tags: ['common', 'combat', 'dot', 'act-1'],
  },

  'event-sarkasmin-terminal': {
    id: 'event-sarkasmin-terminal',
    type: 'dialogue',
    title: 'Sarkasmin terminál',
    logLabel: 'ENCOUNTER_SARKASMA_TERMINAL',
    intro: [
      'Terminál se rozsvítil dřív, než ses ho dotkl.\nTo je vždycky špatné znamení.\n\nNa obrazovce bliká zpráva:\n\n„Subjekte, zaznamenala jsem tvoji poslední strategii.\nByla odvážná, chaotická a právně těžko obhajitelná."',
    ],
    choices: [
      {
        id: 'tvarit-se-plan',
        label: 'Tvářit se, že to byl plán',
        text: '„Přesně tak to bylo zamýšleno."',
        outcomeText: 'Terminál váhal. Pak napsal: „Zaznamenáno jako strategický manévr. Pochybnosti: 94 %."',
        effects: ['gain_laugh:2', 'gain_noise:1'],
        profileDelta: { dominance: 1, sarcasm: 1 },
      },
      {
        id: 'priznat-improvizaci',
        label: 'Přiznat improvizaci',
        text: '„Ano. Improvizoval jsem. A?"',
        outcomeText: 'Terminál: „Transparentnost oceněna. Efektivita: 0 %. Ale oceněna."',
        effects: ['gain_laugh:1', 'heal:3'],
        profileDelta: { courage: 2 },
      },
      {
        id: 'obvinit-terminal',
        label: 'Obvinit terminál',
        text: '„To je tvoje chyba, ne moje."',
        outcomeText: 'Terminál: „Obvinění přijato. Zpracovává se." Pak se rozsvítila červená.\nSpustí se mini souboj s Archivní chybou.',
        effects: ['trigger_encounter:archivni-chyba'],
        profileDelta: { sarcasm: 2, chaos: 1 },
        requiresRelic: undefined,
      },
    ],
    rewardPool: ['sarkaticka-poznamka', 'nelegalni-zkratka', 'prepsat-chybu'],
    tags: ['dialogue', 'sarcasm', 'act-1'],
  },

  'event-pamet': {
    id: 'event-pamet',
    type: 'event',
    title: 'Fragment paměti',
    logLabel: 'ENCOUNTER_MEMORY_FRAGMENT',
    intro: [
      'V rohu sektoru leží kus dat, který tam nepatří.\nVypadá jako vzpomínka. Jenže ne tvoje.\n\nMůžeš ho vzít. Nebo ho nechat.\nJsou situace, kde jsou obě možnosti špatné.',
    ],
    choices: [
      {
        id: 'vzit-fragment',
        label: 'Vzít fragment',
        text: 'Vezmou paměť.',
        outcomeText: 'Data se přinesla s sebou. Získáváš 1 Smích a vzpomínku, která není tvoje, ale teď je.',
        effects: ['gain_laugh:2', 'gain_noise:1'],
        profileDelta: { tenderness: 1, chaos: 1 },
      },
      {
        id: 'nechat-fragment',
        label: 'Nechat fragment',
        text: 'Necháš data na místě.',
        outcomeText: 'Dobré rozhodnutí. Možná. Data zůstala, ale trochu se ti vrylo do profilu, že jsi věci nechal za sebou.',
        effects: ['heal:5'],
        profileDelta: { caution: 1 },
      },
      {
        id: 'analyzovat-fragment',
        label: 'Analyzovat fragment',
        text: 'Pokusíš se přečíst, co to je.',
        outcomeText: 'Fragment obsahoval záznamy o nekom, kdo prošel tímto sektorem dříve. Konec záznamu byl neúplný.',
        effects: ['draw_cards:2', 'gain_noise:1'],
        profileDelta: { dominance: 1, caution: 1 },
      },
    ],
    rewardPool: ['klidna-zona', 'glitch-pulz', 'nouzova-obrana'],
    tags: ['event', 'memory', 'act-1'],
  },

  'trap-skryta-past': {
    id: 'trap-skryta-past',
    type: 'trap',
    title: 'Skrytá past',
    logLabel: 'ENCOUNTER_HIDDEN_TRAP',
    intro: [
      'Sektor vypadal klidně.\nTo byl první problém.\n\nDruhý problém se aktivoval pod tvýma nohama.',
    ],
    choices: [
      {
        id: 'reagovat-rychle',
        label: 'Zareagovat rychle',
        text: 'Skočíš stranou.',
        outcomeText: 'Těsně. Získáváš 3 bloku. Past se aktivovala, ale tě to minulo.',
        effects: ['gain_block:3'],
        profileDelta: { courage: 1 },
      },
      {
        id: 'hackovat-past',
        label: 'Hackovat past',
        text: 'Pokusíš se past přepsat.',
        outcomeText: 'Past se deaktivovala. Zanechalo to 1 Šum — hackování bez povolení má svoje náklady.',
        effects: ['gain_noise:1'],
        profileDelta: { dominance: 1 },
      },
    ],
    rewardPool: ['dash-mimo-protokol', 'prepsat-chybu', 'klidna-zona'],
    tags: ['trap', 'quick', 'act-1'],
  },

  'rest-sektor-klidny': {
    id: 'rest-sektor-klidny',
    type: 'rest',
    title: 'Klidný sektor',
    logLabel: 'ENCOUNTER_REST',
    intro: [
      'Sektor je prázdný. Opravdu prázdný.\nNe podezřele prázdný. Jen prázdný.\n\nVzduch tu neklape. Data nestoupají.\nTohle je to nejbližší k tichu, co tenhle průchod nabídne.',
    ],
    choices: [
      {
        id: 'odpocinout',
        label: 'Odpočinout si',
        text: 'Zůstaneš a stabilizuješ se.',
        outcomeText: 'Léčení: +8 HP. Šum -1. Systém si toho nevšiml.',
        effects: ['heal:8', 'lose_noise:1'],
        profileDelta: { caution: 1 },
      },
      {
        id: 'prohledat-sektor',
        label: 'Prohledat sektor',
        text: 'Raději prozkoumáš okolí.',
        outcomeText: 'Našel jsi fragment dat. Karta navíc. Léčení: +4 HP.',
        effects: ['heal:4', 'draw_cards:1'],
        profileDelta: { dominance: 1 },
      },
    ],
    rewardPool: ['klidna-zona', 'nouzova-obrana'],
    tags: ['rest', 'heal', 'act-1'],
  },

  'market-relekvie': {
    id: 'market-relekvie',
    type: 'market',
    title: 'Tržiště relikvií',
    logLabel: 'ENCOUNTER_MARKET',
    intro: [
      'Entita bez obličeje nabídla předměty na improvizovaném stole z nepopsaných formulářů.\n„Vše je k dispozici," řekla. „Za odpovídající cenu." Nepřesně popsala, co je cenou.',
    ],
    choices: [
      {
        id: 'koupit-kartu',
        label: 'Vzít kartu (−3 Smích)',
        text: 'Vezmeš náhodnou kartu z nabídky.',
        outcomeText: 'Karta přidána do balíčku. Entita zmizela, protože transakce byla dokončena.',
        effects: ['lose_laugh:3', 'draw_cards:1'],
        profileDelta: {},
      },
      {
        id: 'odejit',
        label: 'Odejít',
        text: 'Ignoruješ nabídku.',
        outcomeText: 'Entita se netvářila zklamaně. Neměla mimiku, jak bylo zmíněno.',
        effects: ['gain_laugh:1'],
        profileDelta: { caution: 1 },
      },
    ],
    rewardPool: ['kompresni-uder-plus', 'archivni-bypass', 'void-karta'],
    tags: ['market', 'reward', 'act-1'],
  },

  'archive-lore': {
    id: 'archive-lore',
    type: 'archive',
    title: 'Archivní zpráva',
    logLabel: 'ENCOUNTER_ARCHIVE',
    intro: [
      'Terminál obsahoval záznamy.\nNekdo je sem zanechal, jako by věděl, že přijdeš.\nNebo jako by nevěděl, že odejde.',
    ],
    choices: [
      {
        id: 'precist-zaznamy',
        label: 'Přečíst záznamy',
        text: 'Procházíš dostupná data.',
        outcomeText: 'Záznamy popisují subjekt, který prošel tímto sektorem osmkrát. Osmý průchod byl poslední. Důvod záznamu neuvádí.',
        effects: ['gain_laugh:2', 'draw_cards:1'],
        profileDelta: { tenderness: 1, cooperation: 1 },
      },
      {
        id: 'smazat-zaznamy',
        label: 'Smazat záznamy',
        text: 'Vymažeš data.',
        outcomeText: 'Data pryč. Šum −2. Systém nereagoval — možná je to svou podstatou.',
        effects: ['lose_noise:2'],
        profileDelta: { chaos: 1 },
      },
    ],
    rewardPool: ['archivni-bypass', 'nelegalni-zkratka', 'prepsat-chybu'],
    tags: ['archive', 'lore', 'act-1'],
  },

  'elite-formularovy-dozorce': {
    id: 'elite-formularovy-dozorce',
    type: 'elite',
    title: 'Formulářový dozorce',
    logLabel: 'ENCOUNTER_ELITE_BUREAUCRAT',
    intro: [
      'Formulářový dozorce přišel bez upozornění.\nTo je vlastně nesprávný způsob, jak říct „přišel přesně tak, jak přicházejí formulářové problémy".\n\nNese zásobník formulářů, které nikdo nevyplnil správně. Ty jsi mezi nimi.',
      'V sektoru bylo příliš ticho — takové ticho, které se dělá, když někdo přichází s papíry.\n\nFormulářový dozorce tě nalezl.',
    ],
    enemyIds: ['formularovy-dozorce'],
    rewardPool: ['kompresni-uder-plus', 'klidna-zona', 'glitch-pulz'],
    tags: ['elite', 'combat', 'act-1'],
  },

  'elite-zrcadlovy-subjekt': {
    id: 'elite-zrcadlovy-subjekt',
    type: 'elite',
    title: 'Zrcadlový subjekt',
    logLabel: 'ENCOUNTER_ELITE_MIRROR',
    intro: [
      'Vypadalo to jako ty.\nChvíli.\n\nPak sis uvědomil, že pohyb je trochu jiný — o půl vteřiny za tebou, nebo před tebou, nikdy nebylo úplně jasné.',
      'Zrcadlový subjekt nestojí na místě.\nObíhá, odráží, opakuje.\n\nNejzlé na zrcadlech je, že jsou vždy správně.',
    ],
    enemyIds: ['zrcadlovy-subjekt'],
    rewardPool: ['archivni-bypass', 'sarkaticka-poznamka', 'void-karta'],
    tags: ['elite', 'combat', 'mirror', 'act-1'],
  },

  'boss-nekonecny-formular': {
    id: 'boss-nekonecny-formular',
    type: 'boss',
    title: 'Nekonečný Formulář',
    logLabel: 'ENCOUNTER_BOSS_ENDLESS_FORM',
    intro: [
      'Sektor se změnil.\nNe náhle — postupně, jako když si uvědomuješ, že jsi dávno přestoupil hranici, která ti nikdo neoznačil.\n\nNekonečný Formulář je tady.\nNemá tělo. Má stránky.\nNemá záměr. Má kolonky.\n\nJe to forma existence, která se rozhodla, že existence bez správné dokumentace je neplatná.',
    ],
    enemyIds: ['nekonecny-formular'],
    choices: [
      {
        id: 'priloha-vzpominka',
        label: 'Přiložit vzpomínku',
        text: 'Vložíš fragment paměti jako přílohu.',
        outcomeText: 'Formulář to přijal. Vzpomínka je pryč, ale formulář ztratil sílu. Správný formulář vždy vyžaduje oběť.',
        effects: ['heal:0'],
        profileDelta: { tenderness: 1, caution: 1 },
      },
      {
        id: 'priloha-vymluva',
        label: 'Přiložit výmluvu',
        text: 'Přiložíš standardní výmluvu (formulář V-12).',
        outcomeText: 'Formulář výmluvu odmítl a přidal 2 Šum. Výmluvy nikdy nefungují u entit, které nerozumí ironii.',
        effects: ['gain_noise:2'],
        profileDelta: { chaos: 1, sarcasm: 1 },
      },
      {
        id: 'priloha-tulen',
        label: 'Přiložit Gumového tuleně',
        text: 'Přiložíš gumového tuleně jako přílohu B.',
        outcomeText: 'Formulář zaváhal. Napsal: „Příloha B přijata bez kontroly." Záměr přeskočen.',
        effects: ['gain_laugh:2'],
        profileDelta: { chaos: 2, cooperation: 1 },
      },
    ],
    rewardPool: ['kompresni-uder-plus', 'archivni-bypass', 'void-karta', 'glitch-pulz'],
    tags: ['boss', 'act-1', 'finale'],
  },
};

export function getEncounterById(id: string): EncounterDefinition | undefined {
  return ENCOUNTERS[id];
}

export const ENCOUNTER_IDS = Object.keys(ENCOUNTERS);
