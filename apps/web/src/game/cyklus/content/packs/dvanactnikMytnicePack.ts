import type { CyklusContentPack } from '../contentTypes';

export const tollDvanactnikPack: CyklusContentPack = {
  id: 'toll_dvanactnik',
  title: 'Mýtnice Dvanáctníka',
  description:
    'Mýtná zóna mezi cykly, kde se platí za průchod, útěchu, zkratku i zapomenutí. Dvanáctník neprodává spásu. Jen účtuje okamžiky, které sis myslel, že byly tvoje.',
  tone: ['tragic', 'comic', 'horror'],
  sectors: ['market', 'archive', 'void'],
  requiresPools: ['toll_dvanactnik_pool'],
  unlocksPools: ['toll_dvanactnik_pool', 'toll_debt_pool'],

  items: {
    toll_receipt: {
      id: 'toll_receipt',
      title: 'Účtenka za útěchu',
      description:
        'Na první pohled obyčejný doklad. Na druhý pohled seznam věcí, které tě držely pohromadě, aniž ses ptal, kdo je platil.',
      tags: ['toll_dvanactnik', 'object', 'receipt', 'debt'],
      passiveEffects: [{ type: 'flag', flag: 'toll_receipt_held' }],
      triggerCards: [
        'toll_receipt_reads_you',
        'toll_late_fee',
        'toll_refund_counter',
      ],
    },

    counterfeit_memory_coin: {
      id: 'counterfeit_memory_coin',
      title: 'Falešná paměťová mince',
      description:
        'Vypadá jako skutečná vzpomínka, ale při dopadu nezvoní. Archiv ji přijme. Sebe tím nepodplatíš.',
      tags: ['toll_dvanactnik', 'object', 'coin', 'memory', 'fake'],
      passiveEffects: [{ type: 'flag', flag: 'counterfeit_memory_coin_held' }],
      triggerCards: [
        'toll_counterfeit_coin',
        'toll_market_detects_fake',
      ],
    },

    twelfth_ticket: {
      id: 'twelfth_ticket',
      title: 'Dvanáctý lístek',
      description:
        'Lístek na jeden průchod, který se nikdy neměl prodávat jednotlivě. Na okraji je napsáno: „Platnost: dokud si myslíš, že cena je nízká.“',
      tags: ['toll_dvanactnik', 'object', 'ticket', 'path'],
      passiveEffects: [{ type: 'flag', flag: 'twelfth_ticket_held' }],
      triggerCards: [
        'toll_twelfth_gate',
        'toll_shortcut_with_teeth',
      ],
    },

    unpaid_comfort: {
      id: 'unpaid_comfort',
      title: 'Nezaplacená útěcha',
      description:
        'Malý kus tepla, který se objevil bez účtenky. To je v SYNTHOMĚ vždycky buď zázrak, nebo daňová past s lepší atmosférou.',
      tags: ['toll_dvanactnik', 'object', 'comfort', 'debt'],
      passiveEffects: [{ type: 'flag', flag: 'unpaid_comfort_held' }],
      triggerCards: [
        'toll_comfort_invoice',
        'toll_late_fee',
      ],
    },
  },

  imprints: {
    debt_named: {
      id: 'debt_named',
      title: 'Pojmenovaný dluh',
      description:
        'Dluh, který dostal jméno, už nemůže předstírat, že je osud. Pořád bolí. Jen se hůř schovává za péči.',
      tags: ['toll_dvanactnik', 'imprint', 'debt', 'control'],
      passiveEffects: [{ type: 'flag', flag: 'debt_named_active' }],
      unlockPool: 'toll_debt_pool',
    },

    unpaid_exit: {
      id: 'unpaid_exit',
      title: 'Nezaplacený východ',
      description:
        'Jednou jsi prošel bez placení. Mýtnice si to pamatuje. Ne jako křivdu. Jako investici.',
      tags: ['toll_dvanactnik', 'imprint', 'path', 'risk'],
      passiveEffects: [{ type: 'flag', flag: 'unpaid_exit_active' }],
      unlockPool: 'toll_debt_pool',
    },

    comfort_refunded: {
      id: 'comfort_refunded',
      title: 'Vrácená útěcha',
      description:
        'Dokázal jsi vrátit něco, co tě zahřálo, aniž by ses tvářil, že to nikdy nepotřebuješ. Systém tomu nerozumí. Tím líp.',
      tags: ['toll_dvanactnik', 'imprint', 'comfort', 'bond'],
      passiveEffects: [{ type: 'flag', flag: 'comfort_refunded_active' }],
    },
  },

  cards: {
    toll_booth_between_cycles: {
      id: 'toll_booth_between_cycles',
      title: 'Mýtnice mezi cykly',
      logLabel: 'TOLL_BETWEEN_CYCLES',
      scene:
        'Na okraji Prázdnoty stojí budka. Není stará. Jen unavená z toho, kolikrát už vybírala cenu od bytostí, které si myslely, že restart je zdarma. Za sklem sedí Dvanáctník a třídí účtenky podle toho, jak moc se tváří jako vzpomínky.',
      yesLabel: 'ZAPLATIT DROBNOU VZPOMÍNKOU',
      noLabel: 'TVRDIT, ŽE NIC NEDLUŽÍŠ',
      category: 'entity',
      sector: 'void',
      rarity: 'common',
      once: true,
      packId: 'toll_dvanactnik',
      role: 'entry',
      tone: ['tragic', 'comic'],
      tags: ['toll_dvanactnik', 'entity', 'debt', 'entry', 'market'],
      conditions: [{ type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' }],

      yes: {
        resultText:
          'Zaplatil jsi drobnou vzpomínkou. Nebyla důležitá. Jen ten pocit, že tě někdo kdysi nechal vyhrát v něčem malém. Dvanáctník ji přijal bez úsměvu. Úsměvy tu stojí extra.',
        effects: [
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'item', itemId: 'toll_receipt' },
          { type: 'flag', flag: 'toll_paid_small_memory' },
          { type: 'schedule', cardId: 'toll_receipt_reads_you', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↓ · Kontrola ↑ · Item · Následek',
          statHints: { memory: 'down', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Tvrdil jsi, že nic nedlužíš. Dvanáctník přikývl tak klidně, až to bylo skoro násilné. „Výborně. Zapíšeme jako úvěr bez vědomí subjektu.“',
        effects: [
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'flag', flag: 'toll_debt_denied' },
          { type: 'item', itemId: 'unpaid_comfort' },
          { type: 'schedule', cardId: 'toll_late_fee', inTurns: 4 },
        ],
        preview: {
          hint: 'Energie ↑ · Paměť ↑ · Dluh · Následek',
          statHints: { energy: 'up', memory: 'up' },
          risk: 'high',
        },
      },
    },

    toll_receipt_reads_you: {
      id: 'toll_receipt_reads_you',
      title: 'Účtenka čte tebe',
      logLabel: 'RECEIPT_READS_YOU',
      scene:
        'Účtenka za útěchu se v kapse rozložila sama. Nečteš ji. Ona čte tebe. Položky se mění podle toho, na co nechceš myslet. To je zákaznický servis, kdyby zákaznický servis nenáviděl hranice.',
      yesLabel: 'PŘEČÍST POLOŽKY',
      noLabel: 'ZMAČKAT ÚČTENKU',
      category: 'object',
      sector: 'market',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'toll_dvanactnik',
      role: 'object',
      tone: ['tragic', 'comic'],
      tags: ['toll_dvanactnik', 'object', 'receipt', 'memory'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' },
        { type: 'hasItem', itemId: 'toll_receipt' },
      ],

      yes: {
        resultText:
          'Přečetl jsi položky. „Tři minuty klidu. Jedna omluva, kterou sis nikdy neřekl. Půlka objetí.“ Účtenka nelhala. Což bylo od papíru dost nefér.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'debt_named' },
          { type: 'flag', flag: 'receipt_read' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Zmačkal jsi účtenku. Papír zakřupal jako malá kost. Položky nezmizely. Jen se přesunuly do drobného písma pod tvým klidem.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'flag', flag: 'receipt_crumpled' },
          { type: 'schedule', cardId: 'toll_late_fee', inTurns: 3 },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓ · Pozdější účet',
          statHints: { control: 'up', memory: 'down' },
          risk: 'medium',
        },
      },
    },

    toll_counterfeit_coin: {
      id: 'toll_counterfeit_coin',
      title: 'Falešná paměťová mince',
      logLabel: 'COUNTERFEIT_MEMORY_COIN',
      scene:
        'Na pultu leží mince, která se tváří jako vzpomínka. Je na ní vyražený okamžik, který se nikdy nestal: někdo tě chápe napoprvé. Dvanáctník ji nechává ležet. Ví, že lákadla se prodávají sama.',
      yesLabel: 'VZÍT MINCI',
      noLabel: 'NECHAT JI LEŽET',
      category: 'object',
      sector: 'market',
      rarity: 'common',
      cooldownTurns: 8,
      packId: 'toll_dvanactnik',
      role: 'temptation',
      tone: ['tragic', 'comic'],
      tags: ['toll_dvanactnik', 'object', 'coin', 'fake', 'memory'],
      conditions: [{ type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' }],

      yes: {
        resultText:
          'Vzal jsi minci. Zahřála se přesně tak, jak by se hřála pravda, kdyby pravda měla levnou kopii z tržnice.',
        effects: [
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'item', itemId: 'counterfeit_memory_coin' },
          { type: 'flag', flag: 'counterfeit_coin_taken' },
          { type: 'schedule', cardId: 'toll_market_detects_fake', inTurns: 3 },
        ],
        preview: {
          hint: 'Vazba ↑ · Kontrola ↓ · Item · Riziko',
          statHints: { bond: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi ji ležet. Mince se zatvářila uraženě, což je působivé na objekt bez obličeje a se spornou účetní hodnotou.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'energy', amount: -2 },
          { type: 'flag', flag: 'counterfeit_coin_refused' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Energie ↓',
          statHints: { control: 'up', energy: 'down' },
          risk: 'low',
        },
      },
    },

    toll_market_detects_fake: {
      id: 'toll_market_detects_fake',
      title: 'Tržiště poznalo padělek',
      logLabel: 'MARKET_DETECTS_FAKE',
      scene:
        'Tržiště ztichlo. Falešná paměťová mince v kapse začala pískat. Dvanáctník se ani neotočil. „To není problém,“ řekl. „To je diagnóza.“',
      yesLabel: 'PŘIZNAT PADĚLEK',
      noLabel: 'ZAPLATIT JÍM',
      category: 'crisis',
      sector: 'market',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'toll_dvanactnik',
      role: 'bill',
      tone: ['horror', 'comic'],
      tags: ['toll_dvanactnik', 'crisis', 'coin', 'fake', 'market'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' },
        { type: 'hasItem', itemId: 'counterfeit_memory_coin' },
      ],

      yes: {
        resultText:
          'Přiznal jsi padělek. Mince se rozpadla na teplo bez příběhu. Nebyla pravda. Ale ukázala, po jaké pravdě jsi hladověl.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'removeItem', itemId: 'counterfeit_memory_coin' },
          { type: 'imprint', imprintId: 'debt_named' },
          { type: 'flag', flag: 'fake_coin_admitted' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Item pryč · Imprint',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Zaplatil jsi padělkem. Tržiště jej přijalo. To bylo horší. Některé systémy nepoznají lež, protože z ní mají marži.',
        effects: [
          { type: 'stat', key: 'bond', amount: -7 },
          { type: 'stat', key: 'memory', amount: -5 },
          { type: 'flag', flag: 'paid_with_fake_memory' },
          { type: 'unlockPool', poolId: 'toll_debt_pool' },
        ],
        preview: {
          hint: 'Vazba ↓↓ · Paměť ↓ · Dluh odemčen',
          statHints: { bond: 'down', memory: 'down' },
          risk: 'high',
        },
      },
    },

    toll_twelfth_gate: {
      id: 'toll_twelfth_gate',
      title: 'Dvanáctá brána',
      logLabel: 'TWELFTH_GATE',
      scene:
        'Za budkou se otevřela brána s číslem 12. Nevede ven. Vede jinam. Což je typ nabídky, kterou inteligentní subjekt odmítne a hratelný subjekt samozřejmě prozkoumá.',
      yesLabel: 'POUŽÍT LÍSTEK',
      noLabel: 'JÍT DELŠÍ CESTOU',
      category: 'path',
      sector: 'market',
      rarity: 'rare',
      cooldownTurns: 12,
      packId: 'toll_dvanactnik',
      role: 'twist',
      tone: ['horror', 'tragic'],
      tags: ['toll_dvanactnik', 'path', 'ticket', 'shortcut'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' },
        { type: 'hasAnyFlag', flags: ['toll_paid_small_memory', 'receipt_read', 'debt_named_active'] },
      ],

      yes: {
        resultText:
          'Použil jsi lístek. Brána tě pustila. Na zadní straně lístku se objevil doplatek: „Jedna budoucí jistota.“ Dvanáctník má smysl pro načasování. Tedy pro zločin s kalendářem.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'item', itemId: 'twelfth_ticket' },
          { type: 'moveSector', sectorId: 'mirror' },
          { type: 'imprint', imprintId: 'unpaid_exit' },
          { type: 'schedule', cardId: 'toll_shortcut_with_teeth', inTurns: 4 },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓ · Přesun · Imprint · Účet později',
          statHints: { energy: 'up', control: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Šel jsi delší cestou. Byla nudnější, pomalejší a výrazně méně podezřelá. Což se v SYNTHOMĚ skoro počítá jako luxus.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'energy', amount: -3 },
          { type: 'flag', flag: 'long_way_chosen' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Energie ↓',
          statHints: { control: 'up', energy: 'down' },
          risk: 'low',
        },
      },
    },

    toll_shortcut_with_teeth: {
      id: 'toll_shortcut_with_teeth',
      title: 'Zkratka se zuby',
      logLabel: 'SHORTCUT_WITH_TEETH',
      scene:
        'Zkratka tě dohnala. Má zuby. Ne ústa, jen zuby, protože některé následky se ani nenamáhají s vysvětlením.',
      yesLabel: 'ZAPLATIT DOPLATEK',
      noLabel: 'VYTRHNOUT ZUB',
      category: 'crisis',
      sector: 'mirror',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'toll_dvanactnik',
      role: 'bill',
      tone: ['horror', 'tragic'],
      tags: ['toll_dvanactnik', 'crisis', 'shortcut', 'debt'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' },
        { type: 'hasImprint', imprintId: 'unpaid_exit' },
      ],

      yes: {
        resultText:
          'Zaplatil jsi doplatek. Přišel jsi o jednu budoucí jistotu. Nevšiml sis kterou. To je na jistotách ta odporná věc: nejvíc bolí, až když už nejsou.',
        effects: [
          { type: 'stat', key: 'memory', amount: -8 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'flag', flag: 'future_certainty_paid' },
          { type: 'unlockPool', poolId: 'toll_debt_pool' },
        ],
        preview: {
          hint: 'Paměť ↓↓ · Kontrola ↓ · Dluh',
          statHints: { memory: 'down', control: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Vytrhl jsi zub. Zkratka zakňučela a proměnila se v obyčejnou cestu. Dvanáctník si tě zapsal červeně. Ne jako nepřítele. Jako zajímavý účetní problém.',
        effects: [
          { type: 'stat', key: 'energy', amount: -7 },
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'imprint', imprintId: 'debt_named' },
          { type: 'flag', flag: 'shortcut_tooth_taken' },
        ],
        preview: {
          hint: 'Energie ↓ · Kontrola ↑↑ · Imprint',
          statHints: { energy: 'down', control: 'up' },
          risk: 'medium',
        },
      },
    },

    toll_comfort_invoice: {
      id: 'toll_comfort_invoice',
      title: 'Faktura za útěchu',
      logLabel: 'COMFORT_INVOICE',
      scene:
        'Nezaplacená útěcha v kapse se proměnila ve fakturu. Položka první: „Teplo, které sis spletl s řešením.“ Položka druhá: „Odklad bolesti o tři tahy.“ Dvanáctník má odporně přesnou administrativu.',
      yesLabel: 'ZAPLATIT',
      noLabel: 'VRÁTIT ÚTĚCHU',
      category: 'memory',
      sector: 'market',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'toll_dvanactnik',
      role: 'bill',
      tone: ['tragic', 'comic'],
      tags: ['toll_dvanactnik', 'memory', 'comfort', 'invoice'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' },
        { type: 'hasItem', itemId: 'unpaid_comfort' },
      ],

      yes: {
        resultText:
          'Zaplatil jsi. Útěcha zůstala, ale už nebyla falešně nevinná. To je dražší, ale méně toxická varianta. Jak revoluční, platit cenu vědomě.',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'debt_named' },
          { type: 'flag', flag: 'comfort_paid_consciously' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Vrátil jsi útěchu. Ne proto, že bys ji nepotřeboval. Protože sis odmítl myslet, že každé teplo musí být vlastnictví.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'removeItem', itemId: 'unpaid_comfort' },
          { type: 'imprint', imprintId: 'comfort_refunded' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Item pryč · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    toll_late_fee: {
      id: 'toll_late_fee',
      title: 'Penále za odklad',
      logLabel: 'LATE_FEE',
      scene:
        'Dvanáctník se objevil bez příchodu. To je výhoda entit, které existují hlavně jako účet. „Odložené platby,“ řekl, „mají tendenci růst. Stejně jako nevyřčené věty a plíseň v lednici.“',
      yesLabel: 'UZNAT PENÁLE',
      noLabel: 'ODMÍTNOUT ÚČET',
      category: 'crisis',
      sector: 'void',
      rarity: 'rare',
      triggerMode: 'both',
      cooldownTurns: 12,
      packId: 'toll_dvanactnik',
      role: 'escalation',
      tone: ['horror', 'comic'],
      tags: ['toll_dvanactnik', 'crisis', 'debt', 'late_fee'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_dvanactnik_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['toll_debt_denied', 'receipt_crumpled', 'paid_with_fake_memory', 'unpaid_exit_active'],
        },
      ],

      yes: {
        resultText:
          'Uznal jsi penále. Dluh přestal růst. Nezmizel. Jen se přestal tvářit jako počasí. To je méně romantické, ale užitečnější.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'imprint', imprintId: 'debt_named' },
          { type: 'flag', flag: 'late_fee_acknowledged' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Imprint',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Odmítl jsi účet. Dvanáctník ho neroztrhal. Jen ho přeložil napůl a vložil do budoucnosti. Milé. Jako časovaná mina s kaligrafií.',
        effects: [
          { type: 'stat', key: 'bond', amount: -6 },
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'flag', flag: 'late_fee_deferred' },
          { type: 'unlockPool', poolId: 'toll_debt_pool' },
        ],
        preview: {
          hint: 'Vazba ↓ · Paměť ↓ · Dluh odemčen',
          statHints: { bond: 'down', memory: 'down' },
          risk: 'high',
        },
      },
    },

    toll_refund_counter: {
      id: 'toll_refund_counter',
      title: 'Přepážka vrácení',
      logLabel: 'REFUND_COUNTER',
      scene:
        'Na konci trhu stojí přepážka VRÁCENÍ. Nikdo u ní nestojí. Lidé rádi platí za chyby, ale neradi přiznávají, že něco přijali zbytečně. Lidstvo, ta věčná fronta na špatné okénko.',
      yesLabel: 'VRÁTIT, CO NEBYLO TVOJE',
      noLabel: 'NECHAT SI ZBYTEK',
      category: 'memory',
      sector: 'market',
      rarity: 'rare',
      maxUses: 1,
      packId: 'toll_dvanactnik',
      role: 'resolution',
      tone: ['tragic', 'tender'],
      tags: ['toll_dvanactnik', 'memory', 'refund', 'stabilize'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_debt_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['debt_named_active', 'receipt_read', 'late_fee_acknowledged', 'comfort_paid_consciously'],
        },
      ],

      yes: {
        resultText:
          'Vrátil jsi, co nebylo tvoje. Přepážka vydala tiché potvrzení. Ne o bezvině. O hranici. Což je mnohem méně pohodlné a mnohem víc skutečné.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'imprint', imprintId: 'comfort_refunded' },
          { type: 'flag', flag: 'not_yours_returned' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Nechal sis zbytek. Byl malý, skoro nevinný. Tak začíná většina věcí, které pak potřebují Archiv, omluvu nebo soudní banán.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'flag', flag: 'kept_the_rest' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↓',
          statHints: { memory: 'up', control: 'down' },
          risk: 'medium',
        },
      },
    },

    toll_gate_opens_without_payment: {
      id: 'toll_gate_opens_without_payment',
      title: 'Brána se otevřela bez platby',
      logLabel: 'GATE_OPEN_NO_PAYMENT',
      scene:
        'Brána se otevřela sama. Dvanáctník se usmál poprvé. Nebylo to uklidňující. „Někdy,“ řekl, „je nejvyšší cena nechat subjekt myslet si, že prošel zdarma.“',
      yesLabel: 'PROJÍT',
      noLabel: 'ZŮSTAT A ZEPTAT SE NA CENU',
      category: 'path',
      sector: 'void',
      rarity: 'rare',
      maxUses: 1,
      packId: 'toll_dvanactnik',
      role: 'echo',
      tone: ['horror', 'tragic'],
      tags: ['toll_dvanactnik', 'path', 'debt', 'stabilize', 'echo'],
      conditions: [
        { type: 'unlockedPool', poolId: 'toll_debt_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['late_fee_deferred', 'unpaid_exit_active', 'future_certainty_paid', 'kept_the_rest'],
        },
      ],

      yes: {
        resultText:
          'Prošel jsi. Brána mlčela. Ticho nebylo milost. Byla to smlouva, kterou nikdo nečetl nahlas.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'memory', amount: -7 },
          { type: 'moveSector', sectorId: 'archive' },
          { type: 'flag', flag: 'free_gate_taken' },
        ],
        preview: {
          hint: 'Energie ↑ · Paměť ↓ · Přesun',
          statHints: { energy: 'up', memory: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Zůstal jsi a zeptal se na cenu. Dvanáctník přestal psát. Na trhu se rozhostilo ticho. Poprvé jsi neplatil věcí. Platils pozorností.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'imprint', imprintId: 'debt_named' },
          { type: 'flag', flag: 'asked_price_before_crossing' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Paměť ↑ · Imprint',
          statHints: { control: 'up', memory: 'up' },
          risk: 'medium',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_toll_dvanactnik',
      poolId: 'toll_dvanactnik_pool',
      condition: { type: 'unlockedPool', poolId: 'market_pool' },
    },
    {
      id: 'unlock_toll_debt_pool',
      poolId: 'toll_debt_pool',
      condition: {
        type: 'hasAnyFlag',
        flags: ['debt_named_active', 'late_fee_deferred', 'paid_with_fake_memory', 'unpaid_exit_active'],
      },
    },
  ],

  findings: [
    'toll_dvanactnik_entry',
    'debt_named',
    'paid_with_fake_memory',
    'asked_price_before_crossing',
    'comfort_refunded',
  ],
};