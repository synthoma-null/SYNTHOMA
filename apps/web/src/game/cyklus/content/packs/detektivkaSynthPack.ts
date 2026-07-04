import type { CyklusContentPack } from '../contentTypes';

export const detectiveEchoCasePack: CyklusContentPack = {
  id: 'detective_echo_case',
  title: 'Případ ozvěny, která lhala',
  description:
    'Glitch-noir detektivní sektor. Vyšetřuješ zmizení pravdy z vlastní paměti. Stopy mluví, svědci si protiřečí a pachatel možná není osoba, ale verze příběhu, které bylo pohodlnější uvěřit.',
  tone: ['horror', 'tragic', 'comic'],
  sectors: ['archive', 'mirror', 'residuum'],
  requiresPools: ['detective_echo_case_pool'],
  unlocksPools: ['detective_echo_case_pool', 'detective_cold_case_pool'],

  items: {
    cracked_magnifier: {
      id: 'cracked_magnifier',
      title: 'Prasklá lupa',
      description:
        'Zvětšuje detaily, ale prasklina vždycky ukáže i něco, co jsi nechtěl spojit. Skvělý nástroj, pokud nesnášíš klid.',
      tags: ['detective_echo_case', 'object', 'clue', 'mirror'],
      passiveEffects: [{ type: 'flag', flag: 'cracked_magnifier_held' }],
      triggerCards: [
        'detective_magnifier_finds_you',
        'detective_thread_board',
        'detective_false_pattern',
      ],
    },

    red_thread: {
      id: 'red_thread',
      title: 'Červená nit souvislosti',
      description:
        'Spojuje věci, které spolu možná souvisí. Nebezpečná vlastnost. Lidský mozek na tom postavil polovinu poezie a skoro všechny katastrofy.',
      tags: ['detective_echo_case', 'object', 'clue', 'pattern'],
      passiveEffects: [{ type: 'flag', flag: 'red_thread_held' }],
      triggerCards: [
        'detective_thread_board',
        'detective_false_pattern',
        'detective_reconstruct_the_night',
      ],
    },

    witness_tape: {
      id: 'witness_tape',
      title: 'Kazeta svědka',
      description:
        'Nahrávka někoho, kdo tvrdí, že tam byl. Hlas zní jako ty, ale dýchá cizím rytmem. Naprosto zdravý materiál pro vyšetřování, jistě.',
      tags: ['detective_echo_case', 'object', 'witness', 'memory'],
      passiveEffects: [{ type: 'flag', flag: 'witness_tape_held' }],
      triggerCards: [
        'detective_witness_with_no_face',
        'detective_tape_rewinds_itself',
      ],
    },

    alibi_ash: {
      id: 'alibi_ash',
      title: 'Popel alibi',
      description:
        'Zbytek vysvětlení, které shořelo příliš ochotně. Když ho foukneš do světla, chvíli vypadá jako důkaz.',
      tags: ['detective_echo_case', 'object', 'alibi', 'ash'],
      passiveEffects: [{ type: 'flag', flag: 'alibi_ash_held' }],
      triggerCards: [
        'detective_alibi_burns_again',
        'detective_wrong_culprit',
      ],
    },
  },

  imprints: {
    pattern_hunter: {
      id: 'pattern_hunter',
      title: 'Lovec vzoru',
      description:
        'Vidíš spojitosti dřív, než se stihnou schovat. Bohužel někdy i tam, kde nikdy nebyly. Mozek, ten malý konspirační engine z masa.',
      tags: ['detective_echo_case', 'imprint', 'pattern', 'memory'],
      passiveEffects: [{ type: 'flag', flag: 'pattern_hunter_active' }],
      unlockPool: 'detective_cold_case_pool',
    },

    open_case: {
      id: 'open_case',
      title: 'Otevřený případ',
      description:
        'Neuzavřel jsi pravdu násilím. Případ zůstal otevřený, ale přestal tě držet pod krkem.',
      tags: ['detective_echo_case', 'imprint', 'truth', 'stabilize'],
      passiveEffects: [{ type: 'flag', flag: 'open_case_active' }],
      unlockPool: 'detective_cold_case_pool',
    },

    false_culprit: {
      id: 'false_culprit',
      title: 'Falešný viník',
      description:
        'Jednou ses spletl a svět ti zatleskal, protože jednoduché viny se prodávají nejlíp. Tenhle otisk tě varuje, když pravda začne vypadat až moc pohodlně.',
      tags: ['detective_echo_case', 'imprint', 'guilt', 'warning'],
      passiveEffects: [{ type: 'flag', flag: 'false_culprit_active' }],
    },
  },

  cards: {
    detective_crime_scene_in_memory: {
      id: 'detective_crime_scene_in_memory',
      title: 'Místo činu v paměti',
      logLabel: 'MEMORY_CRIME_SCENE',
      scene:
        'Archiv otevřel místnost, ve které se něco nestalo správně. Na zemi leží obrys chybějící pravdy. Není nakreslený křídou, ale tichem. Vedle bliká LOG: „PŘÍPAD UZAVŘEN.“ Což je podezřelé, protože případ se právě poprvé nadechl.',
      yesLabel: 'VSTOUPIT DO OBVODU',
      noLabel: 'NEJPRVE ČÍST LOG',
      category: 'memory',
      sector: 'archive',
      rarity: 'common',
      once: true,
      packId: 'detective_echo_case',
      role: 'entry',
      tone: ['horror', 'tragic'],
      tags: ['detective_echo_case', 'memory', 'clue', 'entry', 'archive'],
      conditions: [{ type: 'unlockedPool', poolId: 'detective_echo_case_pool' }],

      yes: {
        resultText:
          'Vstoupil jsi do obvodu. Ticho se přilepilo na boty. Některé pravdy neutečou. Jen počkají, až je někdo přestane nahrazovat pohodlnější verzí.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: -3 },
          { type: 'item', itemId: 'cracked_magnifier' },
          { type: 'flag', flag: 'crime_scene_entered' },
          { type: 'schedule', cardId: 'detective_witness_with_no_face', inTurns: 2 },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↓ · Item · Svědek',
          statHints: { memory: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Četl jsi LOG. Tvrdil, že všechno je vyřešeno. Použil šest razítek a žádné vysvětlení. Administrativa opět předstírá, že je epistemologie.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: 3 },
          { type: 'flag', flag: 'case_log_read' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑',
          statHints: { control: 'up', memory: 'up' },
          risk: 'low',
        },
      },
    },

    detective_witness_with_no_face: {
      id: 'detective_witness_with_no_face',
      title: 'Svědek bez tváře',
      logLabel: 'FACELESS_WITNESS',
      scene:
        'V rohu stojí svědek bez tváře. Tvrdí, že viděl všechno. To je typ věty, kterou obvykle říká někdo, kdo si spletl pozorování s vlastnictvím pravdy.',
      yesLabel: 'VYSLECHNOUT HO',
      noLabel: 'NECHAT HO MLUVIT DO TMY',
      category: 'entity',
      sector: 'archive',
      rarity: 'common',
      triggerMode: 'both',
      cooldownTurns: 8,
      packId: 'detective_echo_case',
      role: 'object',
      tone: ['horror', 'tragic'],
      tags: ['detective_echo_case', 'entity', 'witness', 'archive'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        { type: 'hasAnyFlag', flags: ['crime_scene_entered', 'case_log_read'] },
      ],

      yes: {
        resultText:
          'Vyslechl jsi ho. Hlas se rozpadal na tři verze. Jedna tě chránila. Jedna tě obvinila. Jedna jen opakovala: „nebylo to tak jednoduché.“ Ta byla nejhorší.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'bond', amount: -3 },
          { type: 'item', itemId: 'witness_tape' },
          { type: 'flag', flag: 'faceless_witness_interrogated' },
          { type: 'schedule', cardId: 'detective_tape_rewinds_itself', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↓ · Item · Následek',
          statHints: { memory: 'up', bond: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi ho mluvit do tmy. Některé výpovědi jsou přesnější, když se je nesnažíš okamžitě přibít na nástěnku. Detektivní oddělení by tě za to nenávidělo. Výborně.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'flag', flag: 'witness_left_unforced' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    detective_magnifier_finds_you: {
      id: 'detective_magnifier_finds_you',
      title: 'Lupa našla tebe',
      logLabel: 'MAGNIFIER_FINDS_YOU',
      scene:
        'Prasklá lupa se otočila sama. Místo stopy zvětšila tvoje prsty. Pod nehtem máš kousek scény, kterou si nepamatuješ. Krásné. Důkazní materiál s osobním přístupem.',
      yesLabel: 'VYJMOUT STOPU',
      noLabel: 'SCHOVAT RUCE',
      category: 'object',
      sector: 'mirror',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'detective_echo_case',
      role: 'twist',
      tone: ['horror', 'tragic'],
      tags: ['detective_echo_case', 'object', 'clue', 'mirror'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        { type: 'hasItem', itemId: 'cracked_magnifier' },
      ],

      yes: {
        resultText:
          'Vyjmul jsi stopu. Nebyla cizí. Nebyla tvoje. Byla z chvíle, kdy ses rozhodl nerozlišovat. Systém tomu říká úspora. Duše tomu říká problém.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'flag', flag: 'self_clue_extracted' },
          { type: 'item', itemId: 'red_thread' },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Kontrola ↑ · Item',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Schoval jsi ruce. Lupa si povzdechla, což je od optického nástroje nehorázné. Stopu sis nechal. Teď tě bude svědit jako malá právní poznámka.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'flag', flag: 'self_clue_hidden' },
          { type: 'schedule', cardId: 'detective_alibi_burns_again', inTurns: 4 },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓ · Pozdější stopa',
          statHints: { control: 'up', memory: 'down' },
          risk: 'medium',
        },
      },
    },

    detective_thread_board: {
      id: 'detective_thread_board',
      title: 'Nástěnka souvislostí',
      logLabel: 'THREAD_BOARD',
      scene:
        'Na stěně se objevila detektivní nástěnka. Červené nitě spojují zprávy, otisky, výmluvy a jeden velmi unavený hrnek. Všechno souvisí se vším. Což je buď průlom, nebo mozek bez dozoru.',
      yesLabel: 'SPOJIT VŠECHNY BODY',
      noLabel: 'ODSTŘIHNOUT JEDNU NIT',
      category: 'memory',
      sector: 'mirror',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'detective_echo_case',
      role: 'escalation',
      tone: ['horror', 'comic'],
      tags: ['detective_echo_case', 'memory', 'pattern', 'clue'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        { type: 'hasAnyFlag', flags: ['self_clue_extracted', 'red_thread_held', 'faceless_witness_interrogated'] },
      ],

      yes: {
        resultText:
          'Spojil jsi všechny body. Vzor se rozsvítil. Byl nádherný, přesvědčivý a možná úplně špatně. Lidský mozek právě dostal diplom z nebezpečné elegance.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'control', amount: -6 },
          { type: 'imprint', imprintId: 'pattern_hunter' },
          { type: 'flag', flag: 'all_points_connected' },
          { type: 'schedule', cardId: 'detective_false_pattern', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Kontrola ↓ · Imprint · Riziko vzoru',
          statHints: { memory: 'up', control: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Odstřihl jsi jednu nit. Nástěnka se nezhroutila. Jen přestala křičet. Někdy pravdu nenajdeš přidáním spojitosti, ale odstraněním posedlosti.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'memory', amount: -3 },
          { type: 'flag', flag: 'thread_cut' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Paměť ↓',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },

    detective_false_pattern: {
      id: 'detective_false_pattern',
      title: 'Falešný vzor',
      logLabel: 'FALSE_PATTERN',
      scene:
        'Vzor na nástěnce začal dýchat. Vypadá dokonale. Příliš dokonale. Pravda má obvykle bordel pod nehty. Tohle je čisté jako prezentace pro vedení, takže panika je přiměřená.',
      yesLabel: 'VĚŘIT VZORU',
      noLabel: 'ROZBÍT SYMETRII',
      category: 'crisis',
      sector: 'mirror',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'detective_echo_case',
      role: 'bill',
      tone: ['horror', 'tragic'],
      tags: ['detective_echo_case', 'crisis', 'pattern', 'false'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        { type: 'hasAnyFlag', flags: ['all_points_connected', 'pattern_hunter_active'] },
      ],

      yes: {
        resultText:
          'Uvěřil jsi vzoru. Na chvíli všechno dávalo smysl. Pak se smysl ukázal jako klec s krásnou legendou. Detektivka se změnila v propagandu vlastního zranění.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'bond', amount: -7 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'imprint', imprintId: 'false_culprit' },
          { type: 'flag', flag: 'false_pattern_believed' },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Vazba ↓↓ · Kontrola ↓ · Imprint',
          statHints: { memory: 'up', bond: 'down', control: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Rozbil jsi symetrii. Jedna nit spadla. Pak druhá. Vzor se rozpadl, ale případ nezmizel. Bohužel, pravda není IKEA návod, i když by si to všichni zasloužili.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'flag', flag: 'false_pattern_broken' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Paměť ↑',
          statHints: { control: 'up', memory: 'up' },
          risk: 'medium',
        },
      },
    },

    detective_tape_rewinds_itself: {
      id: 'detective_tape_rewinds_itself',
      title: 'Kazeta se přetáčí sama',
      logLabel: 'TAPE_REWINDS_ITSELF',
      scene:
        'Kazeta svědka se přetočila na začátek. Hlas říká: „Tohle jsem už vypověděl.“ Pak dodá: „Ale tehdy jsem ještě věřil, že mě někdo poslouchá.“ Výborně, i důkaz má trauma.',
      yesLabel: 'PUSTIT ZNOVU',
      noLabel: 'NECHAT TICHO PO VÝPOVĚDI',
      category: 'object',
      sector: 'archive',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'detective_echo_case',
      role: 'echo',
      tone: ['tragic', 'horror'],
      tags: ['detective_echo_case', 'object', 'witness', 'tape', 'echo'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        { type: 'hasItem', itemId: 'witness_tape' },
      ],

      yes: {
        resultText:
          'Pustil jsi ji znovu. Tentokrát v pauzách mezi slovy bylo slyšet někoho dýchat. Možná svědka. Možná tebe. Možná tu odpornou věc mezi tím.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'energy', amount: -4 },
          { type: 'flag', flag: 'witness_tape_replayed' },
          { type: 'schedule', cardId: 'detective_reconstruct_the_night', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↑ · Energie ↓ · Rekonstrukce',
          statHints: { memory: 'up', energy: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi ticho po výpovědi. Ticho neřeklo nic. Právě proto konečně přestalo lhát.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'flag', flag: 'witness_silence_respected' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    detective_alibi_burns_again: {
      id: 'detective_alibi_burns_again',
      title: 'Alibi hoří znovu',
      logLabel: 'ALIBI_BURNS_AGAIN',
      scene:
        'Popel alibi se zvedl do vzduchu a na chvíli poskládal větu: „Nemohl jsem jinak.“ Pak shořela ještě jednou. Některé výmluvy jsou tak slabé, že potřebují dvojitou kremaci.',
      yesLabel: 'VĚŘIT ALIBI',
      noLabel: 'ROZFOUKAT POPEL',
      category: 'memory',
      sector: 'residuum',
      rarity: 'uncommon',
      triggerMode: 'both',
      cooldownTurns: 10,
      packId: 'detective_echo_case',
      role: 'escalation',
      tone: ['tragic', 'comic'],
      tags: ['detective_echo_case', 'memory', 'alibi', 'ash'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        { type: 'hasAnyFlag', flags: ['self_clue_hidden', 'alibi_ash_held'] },
      ],

      yes: {
        resultText:
          'Uvěřil jsi alibi. Úleva přišla rychle. Podezřele rychle. V SYNTHOMĚ je rychlá úleva většinou jen dobře oblečený odklad.',
        effects: [
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'item', itemId: 'alibi_ash' },
          { type: 'flag', flag: 'alibi_believed' },
          { type: 'schedule', cardId: 'detective_wrong_culprit', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↓ · Kontrola ↑ · Item · Riziko omylu',
          statHints: { memory: 'down', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Rozfoukal jsi popel. Zůstala pod ním malá, nepříjemná stopa: možnost, že nikdo nebyl úplně nevinný. Krásné. Přesně tohle člověk chce najít v písku duše.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'flag', flag: 'alibi_rejected' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },
    },

    detective_reconstruct_the_night: {
      id: 'detective_reconstruct_the_night',
      title: 'Rekonstrukce noci',
      logLabel: 'RECONSTRUCT_THE_NIGHT',
      scene:
        'Místnost se přestavěla do noci, která možná nikdy nebyla tvoje. Stůl, světlo, čekání. Jedna židle navíc. Jedna věta chybí. Rekonstrukce se tváří objektivně, protože kulisy neumí stud.',
      yesLabel: 'DOSADIT CHYBĚJÍCÍ VĚTU',
      noLabel: 'NECHAT MÍSTO PRÁZDNÉ',
      category: 'memory',
      sector: 'mirror',
      rarity: 'rare',
      maxUses: 1,
      packId: 'detective_echo_case',
      role: 'twist',
      tone: ['horror', 'tragic'],
      tags: ['detective_echo_case', 'memory', 'reconstruction', 'truth'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['witness_tape_replayed', 'red_thread_held', 'false_pattern_broken'],
        },
      ],

      yes: {
        resultText:
          'Dosadil jsi chybějící větu. Sedla do prostoru příliš dobře. Skoro jako by čekala, až ji někdo konečně obviní z pravdy.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'flag', flag: 'missing_sentence_inserted' },
          { type: 'schedule', cardId: 'detective_wrong_culprit', inTurns: 2 },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Kontrola ↓ · Podezřelý',
          statHints: { memory: 'up', control: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Nechal jsi místo prázdné. Poprvé se rekonstrukce nezhroutila kvůli nedostatku odpovědi. Jen připustila, že některé díry nejsou pozvánka k výplni.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'open_case' },
          { type: 'flag', flag: 'blank_space_preserved' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    detective_wrong_culprit: {
      id: 'detective_wrong_culprit',
      title: 'Špatný viník',
      logLabel: 'WRONG_CULPRIT',
      scene:
        'Všechny stopy ukazují na jednu vzpomínku. Je dokonale vinná. A právě proto podezřelá. Dokonalý viník je často jen obětní beránek s lepším osvětlením.',
      yesLabel: 'OBVINIT JI',
      noLabel: 'ZPOCHYBNIT PŘÍPAD',
      category: 'crisis',
      sector: 'mirror',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'detective_echo_case',
      role: 'bill',
      tone: ['horror', 'tragic'],
      tags: ['detective_echo_case', 'crisis', 'guilt', 'culprit'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_echo_case_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['missing_sentence_inserted', 'alibi_believed', 'false_pattern_believed'],
        },
      ],

      yes: {
        resultText:
          'Obvinil jsi ji. Případ se uzavřel okamžitě. To je vždycky špatné znamení. Pravda málokdy balí tak rychle, pokud ji někdo netlačí ze dveří.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: -8 },
          { type: 'stat', key: 'bond', amount: -5 },
          { type: 'imprint', imprintId: 'false_culprit' },
          { type: 'flag', flag: 'wrong_culprit_accused' },
          { type: 'unlockPool', poolId: 'detective_cold_case_pool' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓↓ · Vazba ↓ · Falešné uzavření',
          statHints: { control: 'up', memory: 'down', bond: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Zpochybnil jsi případ. Všechny stopy se urazily. Některé se rozutekly. Jedna zůstala a tiše řekla: „děkuju.“ Detektivka se poprvé zachovala jako péče.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'imprint', imprintId: 'open_case' },
          { type: 'flag', flag: 'case_questioned' },
          { type: 'unlockPool', poolId: 'detective_cold_case_pool' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Imprint · Cold case',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },
    },

    detective_case_stays_open: {
      id: 'detective_case_stays_open',
      title: 'Případ zůstává otevřený',
      logLabel: 'CASE_STAYS_OPEN',
      scene:
        'Archiv čeká na závěr. Má připravené razítko, složku i ten odporně spokojený tón institucí, které milují ukončené věci. Ty ale držíš případ otevřený. Ne z nerozhodnosti. Z úcty ke složitosti.',
      yesLabel: 'NEUZAVÍRAT',
      noLabel: 'DÁT ARCHIVU ZÁVĚR',
      category: 'memory',
      sector: 'archive',
      rarity: 'rare',
      maxUses: 1,
      packId: 'detective_echo_case',
      role: 'resolution',
      tone: ['tragic', 'tender'],
      tags: ['detective_echo_case', 'memory', 'truth', 'stabilize', 'resolution'],
      conditions: [
        { type: 'unlockedPool', poolId: 'detective_cold_case_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['case_questioned', 'blank_space_preserved', 'open_case_active'],
        },
      ],

      yes: {
        resultText:
          'Neuzavřel jsi případ. Archiv zavrčel. Pravda si sedla na okraj složky a poprvé nevypadala jako rozsudek. Jen jako něco, co s tebou může chvíli jít.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'stat', key: 'memory', amount: 3 },
          { type: 'imprint', imprintId: 'open_case' },
          { type: 'flag', flag: 'case_left_open' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Paměť ↑ · Imprint',
          statHints: { control: 'up', bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Dal jsi Archivu závěr. Složka se zavřela tak hladce, až to bylo vulgární. Některé odpovědi jsou jen ticho s razítkem.',
        effects: [
          { type: 'stat', key: 'memory', amount: -7 },
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'entityRelation', entity: 'archive', delta: 1 },
          { type: 'flag', flag: 'case_closed_too_cleanly' },
        ],
        preview: {
          hint: 'Paměť ↓ · Kontrola ↑ · Archiv ↑',
          statHints: { memory: 'down', control: 'up' },
          risk: 'medium',
        },
      },
    },

    detective_cold_case_echo: {
      id: 'detective_cold_case_echo',
      title: 'Studený případ',
      logLabel: 'COLD_CASE_ECHO',
      scene:
        'Později se případ vrátil jako studená složka. Ne křičící. Ne naléhavá. Jen položená na stole. To je nejhorší druh minulosti: ta, která se naučila čekat slušně.',
      yesLabel: 'OTEVŘÍT ZNOVU',
      noLabel: 'NECHAT JI DÝCHAT',
      category: 'memory',
      sector: 'archive',
      rarity: 'rare',
      cooldownTurns: 12,
      packId: 'detective_echo_case',
      role: 'echo',
      tone: ['tragic', 'tender'],
      tags: ['detective_echo_case', 'memory', 'cold_case', 'echo'],
      conditions: [{ type: 'unlockedPool', poolId: 'detective_cold_case_pool' }],

      yes: {
        resultText:
          'Otevřel jsi ji znovu. Tentokrát ne proto, abys vyhrál. Proto, abys byl přítomen u něčeho, co dřív muselo lhát, aby přežilo.',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'pattern_hunter' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi ji dýchat. Složka zůstala zavřená, ale ne zamčená. To je rozdíl, který by Archiv nejradši označil jako chybu v procesu.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -3 },
          { type: 'flag', flag: 'cold_case_allowed_to_breathe' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_detective_echo_case',
      poolId: 'detective_echo_case_pool',
      condition: { type: 'unlockedPool', poolId: 'archive_pool' },
    },
    {
      id: 'unlock_detective_cold_case',
      poolId: 'detective_cold_case_pool',
      condition: {
        type: 'hasAnyFlag',
        flags: ['case_questioned', 'case_left_open', 'wrong_culprit_accused'],
      },
    },
  ],

  findings: [
    'detective_echo_case_entry',
    'faceless_witness_interrogated',
    'false_pattern_broken',
    'wrong_culprit_accused',
    'case_left_open',
    'cold_case_allowed_to_breathe',
  ],
};