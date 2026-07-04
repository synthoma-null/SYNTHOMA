import type { CyklusContentPack } from '../contentTypes';

export const desireOrgiePack: CyklusContentPack = {
  id: 'desire_orgie',
  title: 'ORGIE — sektor touhy a hranic',
  description:
    'Tělesná paměť, touha, stud, souhlas a hranice. Ne explicitní erotika, ale symbolika tělesné intimity, kde každé ano musí přežít vlastní ozvěnu.',
  tone: ['erotic_symbolic', 'tender', 'tragic'],
  sectors: ['residuum', 'mirror'],
  requiresPools: ['desire_orgie_pool'],
  unlocksPools: ['desire_orgie_pool'],

  items: {
    black_red_ribbon: {
      id: 'black_red_ribbon',
      title: 'Černorudá stuha',
      description: 'Nesvazuje. Připomíná, že hranice může být něžná a pořád zůstat hranicí.',
      tags: ['desire_orgie', 'object', 'consent', 'boundary'],
      passiveEffects: [{ type: 'flag', flag: 'black_red_ribbon_held' }],
      triggerCards: ['orgie_boundary_on_tongue', 'orgie_room_learns_no'],
    },

    consent_mirror: {
      id: 'consent_mirror',
      title: 'Zrcadlo souhlasu',
      description: 'Ukáže jen to, k čemu ses opravdu přiznal. Věci, které sis omluvil, nechá stát za tebou.',
      tags: ['desire_orgie', 'object', 'consent', 'mirror'],
      passiveEffects: [{ type: 'flag', flag: 'consent_mirror_held' }],
      triggerCards: ['orgie_desire_not_command', 'orgie_false_yes_echo'],
    },

    gloves_without_touch: {
      id: 'gloves_without_touch',
      title: 'Rukavice bez doteku',
      description: 'Učí tě, že blízkost nezačíná kůží. Někdy začíná tím, že se nikdo nepřiblíží.',
      tags: ['desire_orgie', 'object', 'consent', 'distance'],
      passiveEffects: [{ type: 'flag', flag: 'gloves_without_touch_held' }],
      triggerCards: ['orgie_aftercare_protocol', 'orgie_wanted_without_erasing'],
    },

    glass_of_shame: {
      id: 'glass_of_shame',
      title: 'Sklenka studu',
      description: 'Piješ z ní jen tehdy, když si myslíš, že touha je vina. Sklenka si myslí, že jsi nudně předvídatelný.',
      tags: ['desire_orgie', 'object', 'shame'],
      passiveEffects: [{ type: 'flag', flag: 'glass_of_shame_held' }],
      triggerCards: ['orgie_hunger_names_itself', 'orgie_red_room_invoice'],
    },
  },

  imprints: {
    body_boundary: {
      id: 'body_boundary',
      title: 'Tělesná hranice',
      description: 'ORGIE karty méně často škodí Vazbě, pokud Kontrola není extrémní. Hranice není zeď. Je to dveřní rám.',
      tags: ['desire_orgie', 'imprint', 'consent', 'boundary'],
      passiveEffects: [{ type: 'flag', flag: 'body_boundary_active' }],
    },

    red_breath: {
      id: 'red_breath',
      title: 'Červený dech',
      description: 'Energy overload karty dávají lepší reward, ale větší riziko. Touha dýchá hlouběji, než je bezpečné.',
      tags: ['desire_orgie', 'imprint', 'risk', 'energy'],
      passiveEffects: [{ type: 'flag', flag: 'red_breath_active' }],
    },

    wanted_without_erasing: {
      id: 'wanted_without_erasing',
      title: 'Chtěný bez vymazání',
      description: 'Bond stabilizace je silnější, ale dissolution karty častější. Být chtěný není totéž jako zmizet v někom jiném.',
      tags: ['desire_orgie', 'imprint', 'bond', 'stabilize'],
      passiveEffects: [{ type: 'flag', flag: 'wanted_without_erasing_active' }],
      unlockPool: 'desire_aftercare_pool',
    },
  },

  cards: {
    orgie_salon_without_touch: {
      id: 'orgie_salon_without_touch',
      title: 'Salon bez doteku',
      logLabel: 'SALON_NO_TOUCH',
      scene:
        'Černorudý salon dýchá pomalu. Všechna zrcadla čekají, jestli si spleteš touhu s příkazem. Uprostřed stojí Glitchena a netváří se jako nabídka. Což je v tomhle sektoru skoro revoluční.',
      yesLabel: 'VEJÍT BLÍŽ',
      noLabel: 'NEJPRVE POJMENOVAT HRANICI',
      category: 'entity',
      sector: 'residuum',
      rarity: 'common',
      once: true,
      packId: 'desire_orgie',
      role: 'entry',
      tone: ['erotic_symbolic', 'tender'],
      tags: ['desire_orgie', 'glitchena', 'entity', 'consent', 'body', 'entry'],
      conditions: [{ type: 'unlockedPool', poolId: 'desire_orgie_pool' }],

      yes: {
        resultText:
          'Vstoupil jsi. Salon tě nepřijal, jen přijal, že jsi přišel. To je méně romantické, ale výrazně zdravější.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'stat', key: 'control', amount: -2 },
          { type: 'flag', flag: 'desire_entered' },
          { type: 'flag', flag: 'glitchena_seen' },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↑ · Kontrola ↓',
          statHints: { energy: 'up', bond: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Pojmenoval jsi hranici. Zrcadla se naklonila, jako by tě slyšela poprvé. Glitchena se nepřiblížila. Právě tím něco řekla.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'item', itemId: 'black_red_ribbon' },
          { type: 'flag', flag: 'boundary_named' },
          { type: 'flag', flag: 'glitchena_seen' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Item',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    orgie_mirror_of_consent: {
      id: 'orgie_mirror_of_consent',
      title: 'Zrcadlo souhlasu',
      logLabel: 'CONSENT_MIRROR',
      scene:
        'Zrcadlo neukazuje tělo. Ukazuje okamžik, kdy jsi řekl ano, protože ses bál říct ne. Obraz není obvinění. Jen se odmítá tvářit jako romantika.',
      yesLabel: 'PODÍVAT SE',
      noLabel: 'OTOČIT ZRCADLO KE ZDI',
      category: 'object',
      sector: 'mirror',
      rarity: 'common',
      maxUses: 1,
      packId: 'desire_orgie',
      role: 'object',
      tone: ['erotic_symbolic', 'tragic'],
      tags: ['desire_orgie', 'object', 'consent', 'shame', 'mirror'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasAnyFlag', flags: ['desire_entered', 'boundary_named', 'glitchena_seen'] },
      ],

      yes: {
        resultText:
          'Viděl jsi okamžik. Byl trapný, těžký a nepohodlně přesný. Což je tradiční způsob, jak pravda vstupuje do místnosti, protože slušné dveře jsou zjevně moc mainstream.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'bond', amount: -3 },
          { type: 'item', itemId: 'consent_mirror' },
          { type: 'flag', flag: 'consent_mirror_seen' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↓ · Item',
          statHints: { memory: 'up', bond: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Otočil jsi zrcadlo. Stěna si ho zapamatovala. Některé věci v SYNTHOMĚ nepotřebují oči, aby tě viděly.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'flag', flag: 'consent_mirror_turned' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },

    orgie_boundary_on_tongue: {
      id: 'orgie_boundary_on_tongue',
      title: 'Hranice na jazyku',
      logLabel: 'BOUNDARY_TONGUE',
      scene:
        'Glitchena se ptá: „Umíš říct ne tak, aby to nepůsobilo jako omluva za vlastní existenci?“ Její hlas není svod. Je to test, jestli dokážeš zůstat celý.',
      yesLabel: 'ZKUSIT TO HEZČEJI',
      noLabel: 'ŘÍCT NE NORMÁLNĚ',
      category: 'entity',
      sector: 'residuum',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'desire_orgie',
      role: 'escalation',
      tone: ['erotic_symbolic', 'tender'],
      tags: ['desire_orgie', 'glitchena', 'entity', 'consent', 'boundary'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasAnyFlag', flags: ['desire_entered', 'boundary_named', 'black_red_ribbon_held'] },
      ],

      yes: {
        resultText:
          'Zkusil jsi to hezčeji. Znělo to jako špatně přeložená báseň a trochu jako žádost o povolení být nepohodlný.',
        effects: [
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'stat', key: 'control', amount: -7 },
          { type: 'flag', flag: 'ambiguous_boundary' },
          { type: 'schedule', cardId: 'orgie_false_yes_echo', inTurns: 2 },
        ],
        preview: {
          hint: 'Vazba ↑ · Kontrola ↓↓ · Následek',
          statHints: { bond: 'up', control: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Řekl jsi ne. Normálně. Bez mašle, bez omluvy, bez prosebné dekorace. Glitchena přikývla. „To je začátek souhlasu.“',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'item', itemId: 'gloves_without_touch' },
          { type: 'flag', flag: 'clear_no_spoken' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑ · Item',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    orgie_false_yes_echo: {
      id: 'orgie_false_yes_echo',
      title: 'Ozvěna falešného ano',
      logLabel: 'FALSE_YES_ECHO',
      scene:
        'V chodbě se ozvalo tvoje vlastní ano. Bylo dokonale zdvořilé. A dokonale cizí. Systém ho označil jako kompatibilní, protože systém má vkus mokrého formuláře.',
      yesLabel: 'PŘIZNAT, ŽE NEBYLO TVOJE',
      noLabel: 'NECHAT HO PLATIT',
      category: 'memory',
      sector: 'mirror',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'desire_orgie',
      role: 'twist',
      tone: ['erotic_symbolic', 'tragic'],
      tags: ['desire_orgie', 'memory', 'consent', 'shame', 'twist'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasFlag', flag: 'ambiguous_boundary' },
      ],

      yes: {
        resultText:
          'Přiznal jsi to. Ano se rozpadlo na dvě části: strach a zvyk. Ani jedno nebyla pravda. Aspoň konečně přestaly předstírat, že jsou podpis.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'stat', key: 'control', amount: 3 },
          { type: 'imprint', imprintId: 'body_boundary' },
          { type: 'removeFlag', flag: 'ambiguous_boundary' },
          { type: 'flag', flag: 'false_yes_named' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Kontrola ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi ho platit. Místnost se usmála, protože přesně takhle vznikají levné dohody a drahé následky.',
        effects: [
          { type: 'stat', key: 'bond', amount: -8 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'flag', flag: 'dissolution_echo' },
        ],
        preview: {
          hint: 'Vazba ↓↓ · Paměť ↓ · Riziko rozpuštění',
          statHints: { bond: 'down', memory: 'down' },
          risk: 'high',
        },
      },
    },

    orgie_red_room_invoice: {
      id: 'orgie_red_room_invoice',
      title: 'Účet červeného pokoje',
      logLabel: 'RED_ROOM_INVOICE',
      scene:
        'Touha odešla. Zůstala účtenka. Na položkách je dech, stud a jeden nevyslovený souhlas. Dole bliká drobným písmem: „Reklamace sebeobelhávání přijímáme pouze před použitím.“',
      yesLabel: 'ZAPLATIT PRAVDOU',
      noLabel: 'REKLAMOVAT VLASTNÍ HLAD',
      category: 'memory',
      sector: 'residuum',
      rarity: 'common',
      cooldownTurns: 6,
      packId: 'desire_orgie',
      role: 'bill',
      tone: ['erotic_symbolic', 'tragic'],
      tags: ['desire_orgie', 'memory', 'shame', 'consent', 'bill'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasAnyFlag', flags: ['desire_entered', 'consent_mirror_seen', 'glitchena_seen'] },
      ],

      yes: {
        resultText:
          'Pravda byla měna, kterou ten pokoj akceptoval. Neochotně. Pokladna krátce zakašlala, protože i systém má občas problém přijmout něco skutečného.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'flag', flag: 'shame_paid_truth' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Kontrola ↓',
          statHints: { memory: 'up', bond: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Reklamace nebyla přijata. Hlad není vada. Jen se špatně tváří jako důkaz, že ti něco patří.',
        effects: [
          { type: 'stat', key: 'energy', amount: -6 },
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'item', itemId: 'glass_of_shame' },
          { type: 'flag', flag: 'shame_disputed' },
        ],
        preview: {
          hint: 'Energie ↓ · Kontrola ↑ · Item',
          statHints: { energy: 'down', control: 'up' },
          risk: 'medium',
        },
      },
    },

    orgie_hunger_names_itself: {
      id: 'orgie_hunger_names_itself',
      title: 'Hlad se pojmenuje',
      logLabel: 'HUNGER_NAMES_ITSELF',
      scene:
        'Sklenka studu se naplnila červeným světlem. Na hladině stálo jediné slovo: CHCI. Nevypadalo špinavě. Jen nebezpečně poctivě.',
      yesLabel: 'NECHAT TO SLOVO EXISTOVAT',
      noLabel: 'VYLÍT HO DO ARCHIVU',
      category: 'object',
      sector: 'residuum',
      rarity: 'uncommon',
      maxUses: 1,
      packId: 'desire_orgie',
      role: 'escalation',
      tone: ['erotic_symbolic', 'tender', 'tragic'],
      tags: ['desire_orgie', 'object', 'shame', 'desire'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasItem', itemId: 'glass_of_shame' },
      ],

      yes: {
        resultText:
          'Nechal jsi to slovo existovat. Nezvětšilo se. Nezaútočilo. Jen přestalo škrábat zevnitř.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'stat', key: 'control', amount: -3 },
          { type: 'imprint', imprintId: 'red_breath' },
          { type: 'removeItem', itemId: 'glass_of_shame' },
          { type: 'flag', flag: 'hunger_named' },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↑ · Kontrola ↓ · Imprint',
          statHints: { energy: 'up', bond: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Vylil jsi ho do Archivu. Archiv poděkoval. To byl první signál, že to možná nebyl dobrý nápad.',
        effects: [
          { type: 'stat', key: 'memory', amount: -7 },
          { type: 'stat', key: 'bond', amount: -5 },
          { type: 'entityRelation', entity: 'archive', delta: 1 },
          { type: 'flag', flag: 'hunger_archived' },
        ],
        preview: {
          hint: 'Paměť ↓ · Vazba ↓ · Archiv ↑',
          statHints: { memory: 'down', bond: 'down' },
          risk: 'high',
        },
      },
    },

    orgie_glitchena_waits: {
      id: 'orgie_glitchena_waits',
      title: 'Glitchena čeká',
      logLabel: 'GLITCHENA_WAITS',
      scene:
        'Glitchena stojí v červeném prachu. Neříká nic. Čeká, jestli umíš chtít bez toho, abys vlastnil. Systém je z toho nervózní, protože čekání bez nátlaku se mu špatně indexuje.',
      yesLabel: 'PŘISTOUPIT',
      noLabel: 'ZŮSTAT, KDE JSI',
      category: 'entity',
      sector: 'residuum',
      rarity: 'rare',
      cooldownTurns: 10,
      packId: 'desire_orgie',
      role: 'temptation',
      tone: ['erotic_symbolic', 'tender'],
      tags: ['desire_orgie', 'glitchena', 'entity', 'consent', 'boundary', 'temptation'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasAnyFlag', flags: ['boundary_named', 'clear_no_spoken', 'consent_mirror_seen', 'hunger_named'] },
      ],

      yes: {
        resultText:
          'Přistoupil jsi. Glitchena neuhnula. „Nejsem odměna. Jsem hranice, která se tě ptá.“',
        effects: [
          { type: 'stat', key: 'energy', amount: 8 },
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'control', amount: -6 },
          { type: 'flag', flag: 'glitchena_approached' },
          { type: 'schedule', cardId: 'orgie_afterglow_empty', inTurns: 3 },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↑ · Kontrola ↓ · Následek',
          statHints: { energy: 'up', bond: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Zůstal jsi. Glitchena přikývla a vzdálila se, aby ti dala prostor. Poprvé za dlouho prostor nevypadal jako trest.',
        effects: [
          { type: 'stat', key: 'control', amount: 8 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'flag', flag: 'glitchena_space_respected' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    orgie_desire_not_command: {
      id: 'orgie_desire_not_command',
      title: 'Touha není rozkaz',
      logLabel: 'DESIRE_NOT_COMMAND',
      scene:
        'Zrcadlo souhlasu se rozsvítilo. Ukazuje, že některá „ano“ byla ve skutečnosti poslušnost. Touha se vedle toho tváří uraženě, protože nerada bývá zaměňována za administrativní souhlas.',
      yesLabel: 'PŘIZNAT',
      noLabel: 'OBRÁNIT STARÁ ANO',
      category: 'memory',
      sector: 'mirror',
      rarity: 'uncommon',
      maxUses: 1,
      packId: 'desire_orgie',
      role: 'twist',
      tone: ['erotic_symbolic', 'tragic'],
      tags: ['desire_orgie', 'memory', 'consent', 'shame', 'mirror'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasAnyFlag', flags: ['consent_mirror_held', 'consent_mirror_seen'] },
      ],

      yes: {
        resultText:
          'Přiznal jsi. Stud byl těžký, ale úlevný. Zrcadlo popraskalo přesně tam, kde přestalo lhát.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'body_boundary' },
          { type: 'flag', flag: 'desire_not_command_admitted' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Bránil jsi stará ano. Zrcadlo se odvrátilo. Dokonce i předměty mají někdy víc taktu než terapeutická infrastruktura.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'flag', flag: 'old_yes_defended' },
          { type: 'schedule', cardId: 'orgie_red_room_invoice', inTurns: 2 },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓ · Následek',
          statHints: { control: 'up', memory: 'down' },
          risk: 'medium',
        },
      },
    },

    orgie_afterglow_empty: {
      id: 'orgie_afterglow_empty',
      title: 'Prázdno po světle',
      logLabel: 'AFTERGLOW_EMPTY',
      scene:
        'Touha se rozptýlila. Zůstala jenom teplota místnosti a otázka, jestli ses ztratil v tom, kdo jsi. Afterglow je krásné slovo pro okamžik, kdy účet ještě nedorazil.',
      yesLabel: 'ZŮSTAT V TEPLOTĚ',
      noLabel: 'VYSTOUPIT',
      category: 'crisis',
      sector: 'residuum',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'desire_orgie',
      role: 'escalation',
      tone: ['erotic_symbolic', 'tragic', 'tender'],
      tags: ['desire_orgie', 'crisis', 'dissolution', 'bond', 'afterglow'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasAnyFlag', flags: ['glitchena_approached', 'shame_paid_truth', 'old_yes_defended'] },
      ],

      yes: {
        resultText:
          'Zůstal jsi. Teplota byla příjemná, ale nebyla to ty. Rozpustit se je snadné. Hlavně když to místnost nazve něhou.',
        effects: [
          { type: 'stat', key: 'bond', amount: -7 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'flag', flag: 'dissolution_echo' },
          { type: 'imprint', imprintId: 'red_breath' },
        ],
        preview: {
          hint: 'Vazba ↓↓ · Paměť ↓ · Imprint · Riziko rozpuštění',
          statHints: { bond: 'down', memory: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Vystoupil jsi. Místnost zůstala. Ty taky. V SYNTHOMĚ je tohle skoro obscénně zdravý výsledek.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'wanted_without_erasing' },
          { type: 'flag', flag: 'afterglow_exited' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'medium',
        },
      },
    },

    orgie_aftercare_protocol: {
      id: 'orgie_aftercare_protocol',
      title: 'Aftercare protokol',
      logLabel: 'AFTERCARE_PROTOCOL',
      scene:
        'Po červeném světle přišlo ticho. Ne prázdné. Pečující. Což systém okamžitě označil jako nestandardní údržbu subjektu, protože neumí nechat nic být jen tak hezké.',
      yesLabel: 'ZŮSTAT U TĚLA',
      noLabel: 'PŘEJÍT DO ANALÝZY',
      category: 'memory',
      sector: 'residuum',
      rarity: 'rare',
      maxUses: 1,
      packId: 'desire_orgie',
      role: 'echo',
      tone: ['erotic_symbolic', 'tender'],
      tags: ['desire_orgie', 'aftercare', 'body', 'stabilize', 'bond'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasAnyFlag', flags: ['gloves_without_touch_held', 'body_boundary_active', 'afterglow_exited'] },
      ],

      yes: {
        resultText:
          'Zůstal jsi u těla. Ne jako u důkazu. Jako u místa, které tě doneslo až sem, i když sis ho občas pletl s nepřítelem.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: -5 },
          { type: 'stat', key: 'control', amount: 3 },
          { type: 'flag', flag: 'aftercare_named' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↓ · Kontrola ↑',
          statHints: { bond: 'up', memory: 'down', control: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Přešel jsi do analýzy. Tělo počkalo. Nebylo nadšené, ale na rozdíl od systému tě hned nezažalovalo u Archivu.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: -3 },
          { type: 'flag', flag: 'aftercare_avoided' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓',
          statHints: { control: 'up', bond: 'down' },
          risk: 'medium',
        },
      },
    },

    orgie_room_learns_no: {
      id: 'orgie_room_learns_no',
      title: 'Místnost se učí ne',
      logLabel: 'ROOM_LEARNS_NO',
      scene:
        'Černorudá stuha se napnula mezi tebou a místností. Ne jako zákaz. Jako věta. Místnost ji chvíli četla a tvářila se, že ji to uráží.',
      yesLabel: 'NECHAT STUHU NAPNUTOU',
      noLabel: 'SCHOVAT JI DO KAPSY',
      category: 'object',
      sector: 'residuum',
      rarity: 'rare',
      maxUses: 1,
      packId: 'desire_orgie',
      role: 'echo',
      tone: ['erotic_symbolic', 'tender'],
      tags: ['desire_orgie', 'object', 'consent', 'boundary', 'stabilize'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        { type: 'hasItem', itemId: 'black_red_ribbon' },
      ],

      yes: {
        resultText:
          'Nechal jsi ji napnutou. Místnost se o krok stáhla. Ne proto, že prohrála. Protože konečně pochopila pravidlo.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'body_boundary' },
          { type: 'flag', flag: 'room_learned_no' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Schoval jsi ji do kapsy. Hranice tam zůstala. Jen byla hůř vidět, což je tradičně okamžik, kdy se věci začnou tvářit jako omyl.',
        effects: [
          { type: 'stat', key: 'control', amount: 3 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'flag', flag: 'hidden_boundary' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑',
          statHints: { control: 'up', memory: 'up' },
          risk: 'medium',
        },
      },
    },

    orgie_wanted_without_erasing: {
      id: 'orgie_wanted_without_erasing',
      title: 'Chtěný bez vymazání',
      logLabel: 'WANTED_WITHOUT_ERASING',
      scene:
        'Glitchena nabízí: můžeš být chtěný. Ne jako soubor. Ne jako funkce. Ne jako hlad někoho jiného. Jako okamžik, který tě nepřepíše.',
      yesLabel: 'PŘIJMOUT',
      noLabel: 'NECHAT OKAMŽIK ULETĚT',
      category: 'entity',
      sector: 'residuum',
      rarity: 'rare',
      maxUses: 1,
      packId: 'desire_orgie',
      role: 'resolution',
      tone: ['erotic_symbolic', 'tender'],
      tags: ['desire_orgie', 'glitchena', 'entity', 'stabilize', 'bond', 'resolution'],
      conditions: [
        { type: 'unlockedPool', poolId: 'desire_orgie_pool' },
        {
          type: 'hasAnyFlag',
          flags: [
            'clear_no_spoken',
            'glitchena_space_respected',
            'aftercare_named',
            'room_learned_no',
            'desire_not_command_admitted',
          ],
        },
      ],

      yes: {
        resultText:
          'Přijal jsi. Glitchena se dotkla tvého stínu, ne těla. Stín sebou necukl. Možná poprvé pochopil, že blízkost nemusí být invaze.',
        effects: [
          { type: 'stat', key: 'bond', amount: 8 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'imprint', imprintId: 'wanted_without_erasing' },
          { type: 'flag', flag: 'wanted_not_erased' },
        ],
        preview: {
          hint: 'Vazba ↑↑ · Paměť ↑ · Imprint',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Nechal jsi okamžik uletět. Glitchena pokývala hlavou. „To je taky souhlas.“ A právě proto to nebolelo jako ztráta.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'energy', amount: 4 },
          { type: 'flag', flag: 'desire_released' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Energie ↑',
          statHints: { control: 'up', energy: 'up' },
          risk: 'low',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_desire_orgie',
      poolId: 'desire_orgie_pool',
      condition: { type: 'unlockedPool', poolId: 'memory_sandbox_pool' },
    },
    {
      id: 'unlock_desire_aftercare',
      poolId: 'desire_aftercare_pool',
      condition: { type: 'hasImprint', imprintId: 'wanted_without_erasing' },
    },
  ],

  findings: ['desire_orgie_entry', 'body_boundary_learned', 'wanted_without_erasing'],
};