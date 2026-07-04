import type { CyklusContentPack } from '../contentTypes';

export const romanceResiduumPack: CyklusContentPack = {
  id: 'romance_residuum',
  title: 'Reziduum něhy',
  description:
    'Něha, neodeslané zprávy, cizí romantická paměť, risk závislosti a bond stabilizace. Nejde o vlastnictví lásky, ale o schopnost nést její průchod bez krádeže.',
  tone: ['romantic', 'tender', 'tragic'],
  sectors: ['residuum', 'mirror'],
  requiresPools: ['romance_residuum_pool'],
  unlocksPools: ['romance_residuum_pool', 'romance_aftermath_pool'],

  items: {
    unsent_goodnight: {
      id: 'unsent_goodnight',
      title: 'Neodeslané dobrou noc',
      description:
        'Zpráva, která se nestala, ale přesto někomu změnila večer. Čeká v ní teplo, které nemělo adresáta, jen směr.',
      tags: ['romance_residuum', 'object', 'romance', 'message'],
      passiveEffects: [{ type: 'flag', flag: 'unsent_goodnight_held' }],
      triggerCards: [
        'romance_unsent_goodnight',
        'romance_message_reads_back',
        'romance_tender_exit',
      ],
    },

    warm_pixel: {
      id: 'warm_pixel',
      title: 'Teplý pixel',
      description:
        'Malý důkaz, že i datový šum se umí na chvíli tvářit jako dlaň. Není to důkaz lásky. Je to důkaz tepla. Nepřehánějme, člověče.',
      tags: ['romance_residuum', 'object', 'romance', 'warmth'],
      passiveEffects: [{ type: 'flag', flag: 'warm_pixel_held' }],
      triggerCards: [
        'romance_hand_in_static',
        'romance_static_lullaby',
        'romance_warm_pixel_cools',
      ],
    },

    unfinished_stay: {
      id: 'unfinished_stay',
      title: 'Nedokončená věta',
      description:
        'Začíná slovem „zůstaň“ a končí tam, kde se bojíš pokračovat. Ne proto, že by neměla konec. Protože konec by tě donutil přiznat cenu.',
      tags: ['romance_residuum', 'object', 'romance', 'boundary'],
      passiveEffects: [{ type: 'flag', flag: 'unfinished_stay_held' }],
      triggerCards: [
        'romance_stay_without_chain',
        'romance_finish_the_stay',
        'romance_tender_exit',
      ],
    },

    borrowed_heartbeat: {
      id: 'borrowed_heartbeat',
      title: 'Vypůjčený tep',
      description:
        'Na chvíli zní jako tvůj. Právě proto je nebezpečný. Cizí rytmus je krásný, dokud se podle něj nezačneš definovat.',
      tags: ['romance_residuum', 'object', 'romance', 'dependency'],
      passiveEffects: [{ type: 'flag', flag: 'borrowed_heartbeat_held' }],
      triggerCards: [
        'romance_dependency_echo',
        'romance_return_the_memory',
      ],
    },
  },

  imprints: {
    tender_static: {
      id: 'tender_static',
      title: 'Něžná statika',
      description:
        'Bond karty mají lepší stabilizační varianty, ale Paměť může růst. Něha totiž není mazání. Je to šum, který chvíli neřeže.',
      tags: ['romance_residuum', 'imprint', 'bond', 'tender'],
      passiveEffects: [{ type: 'flag', flag: 'tender_static_active' }],
      unlockPool: 'romance_aftermath_pool',
    },

    stay_without_owning: {
      id: 'stay_without_owning',
      title: 'Zůstat bez vlastnění',
      description:
        'Blízkost nesmí přejít v držení. Tento otisk ti to připomene, než je pozdě, což je víc, než zvládá většina vztahových aplikací a polovina lidstva.',
      tags: ['romance_residuum', 'imprint', 'boundary', 'bond'],
      passiveEffects: [{ type: 'flag', flag: 'stay_without_owning_active' }],
      unlockPool: 'romance_aftermath_pool',
    },

    returned_tenderness: {
      id: 'returned_tenderness',
      title: 'Vrácená něha',
      description:
        'Cizí krásu jsi nepohřbil ani neukradl. Nechal jsi ji projít a vrátit se. Archiv z toho má administrativní kopřivku.',
      tags: ['romance_residuum', 'imprint', 'archive', 'release'],
      passiveEffects: [{ type: 'flag', flag: 'returned_tenderness_active' }],
    },
  },

  cards: {
    romance_unsent_goodnight: {
      id: 'romance_unsent_goodnight',
      title: 'Neodeslané dobrou noc',
      logLabel: 'UNSENT_GOODNIGHT',
      scene:
        'Na zdi bliká zpráva, která nikdy nedošla. Přesto na ni někdo čekal. Písmena jsou unavená, ale drží tvar, jako by se bála, že bez adresáta přestanou být něžná.',
      yesLabel: 'ODESLAT JI DO MINULOSTI',
      noLabel: 'NECHAT JI SVÍTIT',
      category: 'memory',
      sector: 'residuum',
      rarity: 'common',
      once: true,
      packId: 'romance_residuum',
      role: 'entry',
      tone: ['romantic', 'tender'],
      tags: ['romance_residuum', 'memory', 'romance', 'message', 'entry'],
      conditions: [{ type: 'unlockedPool', poolId: 'romance_residuum_pool' }],

      yes: {
        resultText:
          'Odeslal jsi ji. Minulost ji nepřijala, protože minulost je mizerný pošťák a ještě horší terapeut. Ale ty jsi přijal, že ta věta chtěla existovat.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'item', itemId: 'unsent_goodnight' },
          { type: 'flag', flag: 'goodnight_sent_to_past' },
          { type: 'schedule', cardId: 'romance_message_reads_back', inTurns: 3 },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑ · Item · Následek',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Nechal jsi ji svítit. Někdo ji možná uvidí, ale nebudeš to ty. To je zvláštní druh něhy: vzdát se důkazu, že byla tvoje.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'energy', amount: -3 },
          { type: 'flag', flag: 'goodnight_left_glowing' },
        ],
        preview: {
          hint: 'Paměť ↑ · Energie ↓',
          statHints: { memory: 'up', energy: 'down' },
          risk: 'low',
        },
      },
    },

    romance_message_reads_back: {
      id: 'romance_message_reads_back',
      title: 'Zpráva čte tebe',
      logLabel: 'MESSAGE_READS_BACK',
      scene:
        'Neodeslané dobrou noc se vrátilo. Ne jako odpověď. Jako čtenář. Písmena se skládají do otázky: „Komu jsi to vlastně psal, když nikdo nebyl na druhé straně?“',
      yesLabel: 'PŘIZNAT SAMOTU',
      noLabel: 'TVÁŘIT SE, ŽE TO BYL OMÝL',
      category: 'memory',
      sector: 'residuum',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'romance_residuum',
      role: 'twist',
      tone: ['romantic', 'tragic'],
      tags: ['romance_residuum', 'memory', 'message', 'loneliness'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        { type: 'hasAnyFlag', flags: ['goodnight_sent_to_past', 'unsent_goodnight_held'] },
      ],

      yes: {
        resultText:
          'Přiznal jsi samotu. Nezmenšila se. Jen si přestala oblékat cizí tvář, což bylo nepříjemné a podezřele léčivé.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'flag', flag: 'loneliness_named' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Tvářil ses, že to byl omyl. Zpráva se uklidila do složky „náhodné“. Ta složka v SYNTHOMĚ samozřejmě neexistuje. Roztomilý pokus.',
        effects: [
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'stat', key: 'bond', amount: -4 },
          { type: 'flag', flag: 'loneliness_denied' },
          { type: 'schedule', cardId: 'romance_dependency_echo', inTurns: 4 },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓ · Následek',
          statHints: { control: 'up', bond: 'down' },
          risk: 'medium',
        },
      },
    },

    romance_hand_in_static: {
      id: 'romance_hand_in_static',
      title: 'Ruka ve statice',
      logLabel: 'HAND_IN_STATIC',
      scene:
        'Ze šumu se natáhne ruka. Nechce tě stáhnout. Jen chvíli vědět, že existuješ. To je možná nejnebezpečnější druh doteku: ten, který nic nežádá, takže mu začneš chtít dát všechno.',
      yesLabel: 'DOTKNOUT SE',
      noLabel: 'ZŮSTAT O KROK DÁL',
      category: 'entity',
      sector: 'residuum',
      rarity: 'common',
      cooldownTurns: 6,
      packId: 'romance_residuum',
      role: 'temptation',
      tone: ['romantic', 'tender'],
      tags: ['romance_residuum', 'entity', 'romance', 'touch', 'warmth'],
      conditions: [{ type: 'unlockedPool', poolId: 'romance_residuum_pool' }],

      yes: {
        resultText:
          'Dotkl ses. Byla to dlaň, nebo jen šum, který se tvářil jako teplo. Na chvíli to nevadilo. Což je přesně ta chvíle, kdy by měl někdo rozumný začít být opatrný.',
        effects: [
          { type: 'stat', key: 'bond', amount: 7 },
          { type: 'stat', key: 'energy', amount: -4 },
          { type: 'item', itemId: 'warm_pixel' },
          { type: 'flag', flag: 'static_hand_touched' },
          { type: 'schedule', cardId: 'romance_warm_pixel_cools', inTurns: 4 },
        ],
        preview: {
          hint: 'Vazba ↑ · Energie ↓ · Item · Následek',
          statHints: { bond: 'up', energy: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Zůstal jsi o krok dál. Ruka se nezlobila. Zůstala natáhnutá, ale respektovala. Tohle je v Reziduu skoro podezřele dospělé.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'flag', flag: 'static_hand_respected_distance' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    romance_warm_pixel_cools: {
      id: 'romance_warm_pixel_cools',
      title: 'Teplý pixel chladne',
      logLabel: 'WARM_PIXEL_COOLS',
      scene:
        'Teplý pixel v kapse začal chladnout. Ne zradou. Jen fyzikou. Některé teplo je skutečné právě tím, že netrvá věčně. Systém to označil za závadu v očekávání.',
      yesLabel: 'NECHAT HO VYCHLADNOUT',
      noLabel: 'TŘÍT HO O PAMĚŤ',
      category: 'object',
      sector: 'residuum',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'romance_residuum',
      role: 'bill',
      tone: ['romantic', 'tender', 'tragic'],
      tags: ['romance_residuum', 'object', 'warmth', 'loss'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        { type: 'hasItem', itemId: 'warm_pixel' },
      ],

      yes: {
        resultText:
          'Nechal jsi ho vychladnout. V kapse zůstal malý studený důkaz, že krátké teplo nebylo lež. Jen nebylo majetek.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'stay_without_owning' },
          { type: 'flag', flag: 'warmth_released' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Třel jsi ho o paměť. Znovu se zahřál, ale už ne jako dlaň. Spíš jako posedlost, která si vzala svetr a předstírá něhu.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'bond', amount: -5 },
          { type: 'item', itemId: 'borrowed_heartbeat' },
          { type: 'flag', flag: 'warmth_forced_back' },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Vazba ↓ · Item',
          statHints: { memory: 'up', bond: 'down' },
          risk: 'high',
        },
      },
    },

    romance_wrong_memory_kiss: {
      id: 'romance_wrong_memory_kiss',
      title: 'Polibek z cizí paměti',
      logLabel: 'WRONG_MEMORY_KISS',
      scene:
        'Vzpomínka je krásná. A není tvoje. Což jí samozřejmě nebrání bolet. Archiv ji drží opatrně, jako by i cizí něha měla katalogizační číslo a nárok na ticho.',
      yesLabel: 'PŘIJMOUT PRŮCHOD',
      noLabel: 'VRÁTIT JI ARCHIVU',
      category: 'memory',
      sector: 'residuum',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'romance_residuum',
      role: 'object',
      tone: ['romantic', 'tragic'],
      tags: ['romance_residuum', 'memory', 'romance', 'archive', 'borrowed'],
      conditions: [{ type: 'unlockedPool', poolId: 'romance_residuum_pool' }],

      yes: {
        resultText:
          'Přijal jsi průchod. Byla cizí, ale bolest byla autentická. To je odporně matoucí vlastnost lidské psychiky, takže systém nadšeně zatleskal všemi registry.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'item', itemId: 'borrowed_heartbeat' },
          { type: 'flag', flag: 'borrowed_tenderness_accepted' },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Vazba ↑ · Kontrola ↓ · Item',
          statHints: { memory: 'up', bond: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Vrátil jsi ji Archivu. Archivář si nezapsal tvoje jméno, ale zapamatoval si tvůj tón. Někdy je i odmítnutí druh péče. Neříkejme to moc nahlas, zní to dospěle.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'entityRelation', entity: 'archive', delta: 1 },
          { type: 'flag', flag: 'borrowed_tenderness_returned' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓ · Archiv ↑',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },

    romance_waiting_window: {
      id: 'romance_waiting_window',
      title: 'Okno, které čeká',
      logLabel: 'WAITING_WINDOW',
      scene:
        'Za oknem je někdo, kdo nevejde, dokud nezavoláš. Nezavoláš. A přesto čeká. Venku padá datová mlha a na skle se drží otisk dlaně, který se nechová jako důkaz, spíš jako otázka.',
      yesLabel: 'OTEVŘÍT',
      noLabel: 'ZATÁHNOUT ZÁVĚS',
      category: 'entity',
      sector: 'residuum',
      rarity: 'common',
      cooldownTurns: 7,
      packId: 'romance_residuum',
      role: 'escalation',
      tone: ['romantic', 'tender'],
      tags: ['romance_residuum', 'entity', 'romance', 'waiting'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        { type: 'hasAnyFlag', flags: ['goodnight_left_glowing', 'loneliness_named', 'static_hand_touched'] },
      ],

      yes: {
        resultText:
          'Otevřel jsi. Nikdo nevešel. Ale věděl jsi, že mohlo. Možnost zůstala stát venku a poprvé se netvářila jako dluh.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'flag', flag: 'waiting_window_opened' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Zatáhl jsi závěs. Okno zůstalo. Čekání zůstalo. Jen ses rozhodl, že čekání nebude řídit místnost. Malý zázrak, nepatrný, skoro použitelný.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: -3 },
          { type: 'flag', flag: 'waiting_window_closed' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓',
          statHints: { control: 'up', bond: 'down' },
          risk: 'low',
        },
      },
    },

    romance_stay_without_chain: {
      id: 'romance_stay_without_chain',
      title: 'Zůstat bez řetězu',
      logLabel: 'STAY_NO_CHAIN',
      scene:
        'Někdo ti nabízí, abys zůstal. Bez podmínek. Bez klíče. Bez zámku. Podezřelé. SYNTHOMA neumí nabídnout pohodlí bez skrytého řádku malým písmem, ale tahle věta se tváří, že to zkusí.',
      yesLabel: 'ZŮSTAT',
      noLabel: 'PODĚKOVAT A ODEJÍT',
      category: 'entity',
      sector: 'residuum',
      rarity: 'uncommon',
      cooldownTurns: 10,
      packId: 'romance_residuum',
      role: 'twist',
      tone: ['romantic', 'tender'],
      tags: ['romance_residuum', 'entity', 'romance', 'boundary', 'stay'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        { type: 'hasAnyFlag', flags: ['waiting_window_opened', 'static_hand_respected_distance', 'warmth_released'] },
      ],

      yes: {
        resultText:
          'Zůstal jsi. Byl to risk, ale řetěz nepřišel. Jen ticho, které se nesnažilo okamžitě stát domovem. To je v téhle databázi skoro erotika důvěry.',
        effects: [
          { type: 'stat', key: 'bond', amount: 8 },
          { type: 'stat', key: 'energy', amount: -4 },
          { type: 'imprint', imprintId: 'stay_without_owning' },
          { type: 'flag', flag: 'stayed_without_chain' },
          { type: 'schedule', cardId: 'romance_dependency_echo', inTurns: 4 },
        ],
        preview: {
          hint: 'Vazba ↑↑ · Energie ↓ · Imprint · Následek',
          statHints: { bond: 'up', energy: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Odešel jsi. Dveře zůstaly otevřené, což bylo důležitější než tvá přítomnost. Někdy je největší něha nedělat z odchodu trest.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'item', itemId: 'unfinished_stay' },
          { type: 'flag', flag: 'left_without_breaking_bond' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Item',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    romance_finish_the_stay: {
      id: 'romance_finish_the_stay',
      title: 'Dopsat „zůstaň“',
      logLabel: 'FINISH_THE_STAY',
      scene:
        'Nedokončená věta se otevřela v kapse. „Zůstaň…“ a za tím místo, kde se obvykle schovává strach. Čeká, jestli z něj uděláš prosbu, rozkaz, nebo pravdu.',
      yesLabel: 'DOPSAT PROSBU',
      noLabel: 'NECHAT VĚTU OTEVŘENOU',
      category: 'memory',
      sector: 'residuum',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'romance_residuum',
      role: 'escalation',
      tone: ['romantic', 'tender', 'tragic'],
      tags: ['romance_residuum', 'memory', 'message', 'stay', 'boundary'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        { type: 'hasItem', itemId: 'unfinished_stay' },
      ],

      yes: {
        resultText:
          'Dopsal jsi prosbu. Nezněla jako pouto. Zněla jako člověk, který konečně přestal maskovat potřebu za vtipnou poznámku. Hrůza. Pokrok.',
        effects: [
          { type: 'stat', key: 'bond', amount: 7 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'flag', flag: 'stay_written_as_request' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi větu otevřenou. Ne všechno musí být dokončené, aby to bylo pravdivé. Systém si povzdechl, protože otevřené významy se blbě fakturují.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'stay_without_owning' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    romance_dependency_echo: {
      id: 'romance_dependency_echo',
      title: 'Ozvěna závislosti',
      logLabel: 'DEPENDENCY_ECHO',
      scene:
        'Reziduum zašeptalo: „Ještě jednou. Jen jednou. Jen ať je zase teplo.“ Hlas nezní jako láska. Zní jako hlad, který se naučil používat něžnější slovník.',
      yesLabel: 'VRÁTIT SE PRO TEPLO',
      noLabel: 'POJMENOVAT HLAD',
      category: 'crisis',
      sector: 'residuum',
      rarity: 'rare',
      triggerMode: 'both',
      cooldownTurns: 12,
      packId: 'romance_residuum',
      role: 'bill',
      tone: ['romantic', 'tragic'],
      tags: ['romance_residuum', 'crisis', 'romance', 'dependency', 'bond'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        {
          type: 'hasAnyFlag',
          flags: [
            'borrowed_heartbeat_held',
            'warmth_forced_back',
            'stayed_without_chain',
            'loneliness_denied',
          ],
        },
      ],

      yes: {
        resultText:
          'Vrátil ses pro teplo. Dostals ho. Jenže přišlo s cizím rytmem a chvíli sis nevšiml, že dýcháš podle někoho jiného.',
        effects: [
          { type: 'stat', key: 'bond', amount: -8 },
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'flag', flag: 'dependency_echo_deepened' },
          { type: 'item', itemId: 'borrowed_heartbeat' },
        ],
        preview: {
          hint: 'Vazba ↓↓ · Paměť ↑ · Kontrola ↓ · Item',
          statHints: { bond: 'down', memory: 'up', control: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Pojmenoval jsi hlad. Nezmizel. Jen přestal předstírat, že je osud. A to je malá výhra, i když dramaticky nevypadá na plakát.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'stay_without_owning' },
          { type: 'flag', flag: 'dependency_named' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'medium',
        },
      },
    },

    romance_return_the_memory: {
      id: 'romance_return_the_memory',
      title: 'Vrátit cizí paměť',
      logLabel: 'RETURN_MEMORY',
      scene:
        'Polibek z cizí paměti se vrací. Chceš ji vrátit, nebo si nechat její sladkost? Archiv drží otevřenou zásuvku. Ne laskavě. Spíš hladově spořádaně.',
      yesLabel: 'VRÁTIT',
      noLabel: 'NECHAT SI JI',
      category: 'memory',
      sector: 'residuum',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'romance_residuum',
      role: 'bill',
      tone: ['romantic', 'tragic'],
      tags: ['romance_residuum', 'memory', 'romance', 'archive', 'borrowed'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['borrowed_tenderness_accepted', 'borrowed_heartbeat_held', 'dependency_named'],
        },
      ],

      yes: {
        resultText:
          'Vrátil jsi ji. Cizí láska zůstala cizí. Tvá vlastní odezva ale zůstala v tobě. Tohle je rozdíl, který Archiv nesnáší, protože nejde dát do jedné kolonky.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'entityRelation', entity: 'archive', delta: 1 },
          { type: 'imprint', imprintId: 'returned_tenderness' },
          { type: 'flag', flag: 'borrowed_memory_returned' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑ · Archiv ↑ · Imprint',
          statHints: { control: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Nechal jsi si ji. Cizí něha se stala tvou melancholií. Krásné, nebezpečné, a přesně tak nelegální vůči vlastnímu já, jak by člověk čekal.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'bond', amount: -4 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'flag', flag: 'borrowed_memory_kept' },
          { type: 'schedule', cardId: 'romance_dependency_echo', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Vazba ↓ · Kontrola ↓ · Následek',
          statHints: { memory: 'up', bond: 'down', control: 'down' },
          risk: 'medium',
        },
      },
    },

    romance_static_lullaby: {
      id: 'romance_static_lullaby',
      title: 'Ukolébavka ze šumu',
      logLabel: 'STATIC_LULLABY',
      scene:
        'Šum se naučil melodii. Není to píseň, spíš příslib, že se zítra někdo vrátí. Zní to jako domov, ale opatrně. Domovy v SYNTHOMĚ mají tendenci účtovat nájem zpětně.',
      yesLabel: 'USNOUT V NÍ',
      noLabel: 'PŘEHRÁVAT SI JI',
      category: 'memory',
      sector: 'residuum',
      rarity: 'rare',
      maxUses: 1,
      packId: 'romance_residuum',
      role: 'resolution',
      tone: ['romantic', 'tender'],
      tags: ['romance_residuum', 'memory', 'romance', 'stabilize', 'lullaby'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['warm_pixel_held', 'loneliness_named', 'static_hand_touched', 'warmth_released'],
        },
      ],

      yes: {
        resultText:
          'Usnul jsi. Šum se přikryl přes tebe jako tenká deka. Neochránila tě před vším. Jen před nutkáním všechno vydržet vzhůru.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'energy', amount: 4 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'imprint', imprintId: 'tender_static' },
          { type: 'flag', flag: 'static_lullaby_slept' },
        ],
        preview: {
          hint: 'Vazba ↑ · Energie ↑ · Paměť ↑ · Imprint',
          statHints: { bond: 'up', energy: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Přehrával sis ji. Naučil ses ji nazpaměť, což byla vlastně ztráta. Píseň, kterou necháš běžet pořád dokola, se časem přestane ptát, jestli ji ještě chceš slyšet.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'bond', amount: -3 },
          { type: 'flag', flag: 'lullaby_looped' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↓',
          statHints: { memory: 'up', bond: 'down' },
          risk: 'medium',
        },
      },
    },

    romance_tender_exit: {
      id: 'romance_tender_exit',
      title: 'Něžný východ',
      logLabel: 'TENDER_EXIT',
      scene:
        'Někdo ti podává ruku, aby tě vyvedl. Ne k sobě. Ven. K čemu zbylo. V tom je celá drzost něhy: někdy tě opravdu nechce vlastnit.',
      yesLabel: 'VZÍT RUKU',
      noLabel: 'ZŮSTAT A PODĚKOVAT',
      category: 'path',
      sector: 'residuum',
      rarity: 'rare',
      maxUses: 1,
      packId: 'romance_residuum',
      role: 'echo',
      tone: ['romantic', 'tender', 'tragic'],
      tags: ['romance_residuum', 'path', 'romance', 'stabilize', 'exit'],
      conditions: [
        { type: 'unlockedPool', poolId: 'romance_residuum_pool' },
        {
          type: 'hasAnyFlag',
          flags: [
            'static_lullaby_slept',
            'borrowed_memory_returned',
            'left_without_breaking_bond',
            'dependency_named',
            'stay_written_as_request',
          ],
        },
      ],

      yes: {
        resultText:
          'Vzal jsi ruku. Reziduum tě vyvedlo. Bylo to krásné, protože to nebylo k někomu. Bylo to ven. A ven je někdy nejromantičtější směr, i když se to mizerně prodává na pohlednicích.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'moveSector', sectorId: 'mirror' },
          { type: 'unlockPool', poolId: 'romance_aftermath_pool' },
          { type: 'flag', flag: 'tender_exit_taken' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑ · Přesun · Unlock',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Zůstal jsi. Poděkoval jsi. Ruka se stáhla, ale nezapomněla. Tentokrát z toho nebyl trest. Jen konec, který se nemusel tvářit jako selhání.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'stay_without_owning' },
          { type: 'unlockPool', poolId: 'romance_aftermath_pool' },
          { type: 'flag', flag: 'tender_exit_refused_softly' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Imprint · Unlock',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    romance_afterimage_message: {
      id: 'romance_afterimage_message',
      title: 'Dozvuk neodeslané zprávy',
      logLabel: 'AFTERIMAGE_MESSAGE',
      scene:
        'Po průchodu Reziduem zůstala na okraji zdi věta bez adresy. Tentokrát nečeká na odpověď. Jen kontroluje, jestli ses nezměnil v čekání samotné.',
      yesLabel: 'PŘEČÍST JI NAPOSLEDY',
      noLabel: 'NECHAT JI BÝT',
      category: 'memory',
      sector: 'mirror',
      rarity: 'rare',
      cooldownTurns: 12,
      packId: 'romance_residuum',
      role: 'echo',
      tone: ['romantic', 'tender', 'tragic'],
      tags: ['romance_residuum', 'memory', 'aftermath', 'message', 'echo'],
      conditions: [{ type: 'unlockedPool', poolId: 'romance_aftermath_pool' }],

      yes: {
        resultText:
          'Přečetl jsi ji naposledy. Slovo „naposledy“ nebolelo tak moc, jak slibovalo. Někdy je konec jen věta, která konečně přestane žebrat o další kapitolu.',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'imprint', imprintId: 'returned_tenderness' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Imprint',
          statHints: { memory: 'up', control: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Nechal jsi ji být. Zůstala na zdi, ale přestala svítit do tebe. Tohle je možná nejméně dramatický zázrak, jaký systém kdy neuměl ocenit.',
        effects: [
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'flag', flag: 'message_left_in_peace' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↓',
          statHints: { bond: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_romance_residuum',
      poolId: 'romance_residuum_pool',
      condition: { type: 'unlockedPool', poolId: 'memory_sandbox_pool' },
    },
    {
      id: 'unlock_romance_aftermath',
      poolId: 'romance_aftermath_pool',
      condition: {
        type: 'hasAnyFlag',
        flags: ['tender_exit_taken', 'tender_exit_refused_softly', 'returned_tenderness_active'],
      },
    },
  ],

  findings: [
    'romance_residuum_entry',
    'loneliness_named',
    'dependency_named',
    'borrowed_memory_returned',
    'tender_exit_taken',
  ],
};