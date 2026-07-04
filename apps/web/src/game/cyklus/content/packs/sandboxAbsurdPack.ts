import type { CyklusContentPack } from '../contentTypes';

export const sandboxAbsurdPack: CyklusContentPack = {
  id: 'sandbox_absurd',
  title: 'Pískoviště absurdního bezpečí',
  description:
    'Nízkopenalizační hravý sektor, kde chyby nebolí hned, ale mohou hráče vrátit do infantilní smyčky. Smích je tu nástroj přežití, ne útěk. Tedy aspoň dokud se písek nezačne tvářit jako domov.',
  tone: ['absurd', 'comic', 'tender'],
  sectors: ['memory_sandbox', 'glitchka_nest'],
  requiresPools: ['sandbox_absurd_pool'],
  unlocksPools: ['sandbox_absurd_pool', 'sandbox_aftermath_pool'],

  items: {
    digital_banana: {
      id: 'digital_banana',
      title: 'Digitální banán',
      description:
        'Ohýbá logiku. Ne prostor. Logiku. Což je horší, protože prostor se aspoň občas omluví nárazem do zdi.',
      tags: ['sandbox_absurd', 'object', 'glitchka', 'logic'],
      passiveEffects: [{ type: 'flag', flag: 'digital_banana_held' }],
      triggerCards: ['sandbox_banana_court', 'sandbox_banana_appeal', 'sandbox_dirty_laugh'],
    },

    opinion_glasses: {
      id: 'opinion_glasses',
      title: 'Brýle s vlastním názorem',
      description:
        'Ukazují věci tak, jak by dávaly smysl dítěti po třech energy drincích a jedné nepovolené existenciální otázce.',
      tags: ['sandbox_absurd', 'object', 'glitchka', 'perspective'],
      passiveEffects: [{ type: 'flag', flag: 'opinion_glasses_held' }],
      triggerCards: ['sandbox_glasses_committee', 'sandbox_wrong_perspective'],
    },

    inside_rain_umbrella: {
      id: 'inside_rain_umbrella',
      title: 'Deštník do vnitřního deště',
      description:
        'Chrání před smutkem, který padá zevnitř nahoru. Nezastaví ho celý. Jen ti dovolí nezmizet při prvních kapkách.',
      tags: ['sandbox_absurd', 'object', 'glitchka', 'rain', 'tender'],
      passiveEffects: [{ type: 'flag', flag: 'inside_rain_umbrella_held' }],
      triggerCards: ['sandbox_umbrella_inside_rain', 'sandbox_inside_rain_returns'],
    },

    bucket_of_rules: {
      id: 'bucket_of_rules',
      title: 'Kyblík na cizí pravidla',
      description:
        'Dá se do něj nabrat zákon reality a odnést jinam. Systém je z toho protivný, protože legislativa obvykle nebývá v kyblíku.',
      tags: ['sandbox_absurd', 'object', 'glitchka', 'rules'],
      passiveEffects: [{ type: 'flag', flag: 'bucket_of_rules_held' }],
      triggerCards: ['sandbox_bucket_of_rules', 'sandbox_rule_castle', 'sandbox_rule_spill'],
    },
  },

  imprints: {
    dirty_laugh: {
      id: 'dirty_laugh',
      title: 'Špinavý smích',
      description:
        'Pískoviště si tě pamatuje. Když se budeš brát moc vážně, smích tě najde a připomene ti, že tragédie s dobrou timingovou pauzou je pořád podezřele živá.',
      tags: ['sandbox_absurd', 'imprint', 'laugh', 'glitchka'],
      passiveEffects: [{ type: 'flag', flag: 'dirty_laugh_active' }],
      unlockPool: 'sandbox_aftermath_pool',
    },

    safe_mistake: {
      id: 'safe_mistake',
      title: 'Bezpečná chyba',
      description:
        'Chyby na Pískovišti nebolí, dokud nezačneš doufat, že tě nic nenaučí. To je pak bolest jen v kostýmu plyšáka.',
      tags: ['sandbox_absurd', 'imprint', 'mistake', 'safe'],
      passiveEffects: [{ type: 'flag', flag: 'safe_mistake_active' }],
      unlockPool: 'sandbox_aftermath_pool',
    },

    sand_in_the_code: {
      id: 'sand_in_the_code',
      title: 'Písek v kódu',
      description:
        'Malé zrníčko absurdity v pravidlech systému. Neopraví tě. Jen zabrání světu, aby se chvíli bral jako finální build.',
      tags: ['sandbox_absurd', 'imprint', 'glitch', 'rules'],
      passiveEffects: [{ type: 'flag', flag: 'sand_in_code_active' }],
    },
  },

  cards: {
    sandbox_banana_court: {
      id: 'sandbox_banana_court',
      title: 'Banánový soud',
      logLabel: 'BANANA_COURT',
      scene:
        'Digitální banán tě obvinil, že jsi ho oloupal pohledem. Porota z kostek vážně kývá, protože právo na Pískovišti zjevně dostalo vývojovou verzi bez dospělého dozoru.',
      yesLabel: 'PŘIZNAT VINU',
      noLabel: 'POŽÁDAT O ADVOKÁTA Z PÍSKU',
      category: 'entity',
      sector: 'memory_sandbox',
      rarity: 'common',
      once: true,
      packId: 'sandbox_absurd',
      role: 'entry',
      tone: ['absurd', 'comic'],
      tags: ['sandbox_absurd', 'glitchka', 'entity', 'low_penalty', 'entry', 'banana'],
      conditions: [{ type: 'unlockedPool', poolId: 'sandbox_absurd_pool' }],

      yes: {
        resultText:
          'Přiznal jsi vinu. Banán se uklidnil a nabídl ti digitální slupku jako důkaz, že spravedlnost může být žlutá, měkká a úplně mimo.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'item', itemId: 'digital_banana' },
          { type: 'entityRelation', entity: 'glitchka', delta: 1 },
          { type: 'flag', flag: 'banana_court_attended' },
        ],
        preview: {
          hint: 'Vazba ↑ · Kontrola ↓ · Item',
          statHints: { bond: 'up', control: 'down' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Advokát z písku se rozpadl, než stačil promluvit. Glitchka se tomu smála tak upřímně, že i soudní síň na chvíli zapomněla, že je výplodem porouchané terapie.',
        effects: [
          { type: 'stat', key: 'energy', amount: 4 },
          { type: 'stat', key: 'bond', amount: 2 },
          { type: 'entityRelation', entity: 'glitchka', delta: 1 },
          { type: 'flag', flag: 'sand_lawyer_failed' },
          { type: 'schedule', cardId: 'sandbox_banana_appeal', inTurns: 2 },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↑ · Následek',
          statHints: { energy: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    sandbox_banana_appeal: {
      id: 'sandbox_banana_appeal',
      title: 'Odvolání banánu',
      logLabel: 'BANANA_APPEAL',
      scene:
        'Banán podal odvolání. Tvrdí, že jsi ho nepochopil ani jako ovoce, ani jako právní koncept. To je silné obvinění, hlavně od věci, která nemá páteř.',
      yesLabel: 'UZNAT JEHO ARGUMENT',
      noLabel: 'SNÍST DŮKAZ',
      category: 'object',
      sector: 'memory_sandbox',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'twist',
      tone: ['absurd', 'comic'],
      tags: ['sandbox_absurd', 'object', 'banana', 'logic', 'twist'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        { type: 'hasAnyFlag', flags: ['banana_court_attended', 'digital_banana_held', 'sand_lawyer_failed'] },
      ],

      yes: {
        resultText:
          'Uznal jsi argument. Banán dojetím změnil tvar na otazník. Systém si poznamenal: subjekt vyjednává s ovocem. Diagnosticky plodné.',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'flag', flag: 'banana_argument_accepted' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Snědl jsi důkaz. Logika se na chvíli ohnula, škytla a předstírala, že to byl plán. Nebyl. Ale fungovalo to, což je v SYNTHOMĚ téměř vědecká metoda.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'control', amount: -6 },
          { type: 'imprint', imprintId: 'sand_in_the_code' },
          { type: 'removeItem', itemId: 'digital_banana' },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓ · Imprint',
          statHints: { energy: 'up', control: 'down' },
          risk: 'medium',
        },
      },
    },

    sandbox_glasses_committee: {
      id: 'sandbox_glasses_committee',
      title: 'Komise brýlí',
      logLabel: 'GLASSES_COMMITTEE',
      scene:
        'Tři brýle se hádají, která z nich vidí tvůj problém nejhůř. Jedny tvrdí, že jsi smutný. Druhé, že jsi geometricky nevhodný. Třetí jen šeptají: „zkus méně existovat“.',
      yesLabel: 'NASADIT VŠECHNY',
      noLabel: 'POSLOUCHAT BEZ ZRAKU',
      category: 'object',
      sector: 'memory_sandbox',
      rarity: 'common',
      cooldownTurns: 6,
      packId: 'sandbox_absurd',
      role: 'object',
      tone: ['absurd', 'comic'],
      tags: ['sandbox_absurd', 'object', 'glitchka', 'low_penalty', 'perspective'],
      conditions: [{ type: 'unlockedPool', poolId: 'sandbox_absurd_pool' }],

      yes: {
        resultText:
          'Viděl jsi svůj problém třikrát najednou. Dva z nich byli směšní. Třetí byl moc přesný, takže ho brýle rychle označily jako technickou závadu.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'item', itemId: 'opinion_glasses' },
          { type: 'flag', flag: 'triple_perspective_seen' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↓ · Item',
          statHints: { memory: 'up', control: 'down' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Bez zraku jsi slyšel pravdu. Brýle to zapsaly jako kompliment a pak se urazily, protože pravda měla příliš málo obrouček.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -3 },
          { type: 'flag', flag: 'listened_without_sight' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },

    sandbox_wrong_perspective: {
      id: 'sandbox_wrong_perspective',
      title: 'Špatná perspektiva',
      logLabel: 'WRONG_PERSPECTIVE',
      scene:
        'Brýle s vlastním názorem ukázaly Pískoviště shora. Vypadalo jako mapa. Pak zdola. Vypadalo jako past. Pak zevnitř. Vypadalo jako ty, což bylo zbytečně osobní.',
      yesLabel: 'VĚŘIT TŘETÍMU POHLEDU',
      noLabel: 'SUNDAT BRÝLE',
      category: 'object',
      sector: 'memory_sandbox',
      rarity: 'uncommon',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'escalation',
      tone: ['absurd', 'tender'],
      tags: ['sandbox_absurd', 'object', 'perspective', 'memory'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        { type: 'hasItem', itemId: 'opinion_glasses' },
      ],

      yes: {
        resultText:
          'Věřil jsi třetímu pohledu. Nebyl správný. Byl použitelný. Což je výrazně víc, než se dá říct o většině velkých pravd.',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'control', amount: 3 },
          { type: 'flag', flag: 'third_perspective_trusted' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑',
          statHints: { memory: 'up', control: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Sundal jsi brýle. Svět zůstal rozmazaný, ale aspoň už nepředstíral, že má validní názor na tvou osobnost.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: -2 },
          { type: 'removeItem', itemId: 'opinion_glasses' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓ · Item pryč',
          statHints: { control: 'up', bond: 'down' },
          risk: 'medium',
        },
      },
    },

    sandbox_umbrella_inside_rain: {
      id: 'sandbox_umbrella_inside_rain',
      title: 'Deštník do vnitřního deště',
      logLabel: 'INSIDE_RAIN',
      scene:
        'Prší zevnitř tvé hlavy. Glitchka tvrdí, že to je počasí, ne selhání. Nad pískem se tvoří malé louže, ve kterých plavou nevyřčené věty v nafukovacích rukávcích.',
      yesLabel: 'OTEVŘÍT DEŠTNÍK',
      noLabel: 'ZMOKNOUT SCHVÁLNĚ',
      category: 'object',
      sector: 'memory_sandbox',
      rarity: 'common',
      cooldownTurns: 6,
      packId: 'sandbox_absurd',
      role: 'object',
      tone: ['absurd', 'tender'],
      tags: ['sandbox_absurd', 'object', 'glitchka', 'low_penalty', 'rain'],
      conditions: [{ type: 'unlockedPool', poolId: 'sandbox_absurd_pool' }],

      yes: {
        resultText:
          'Deštník zachytil většinu. Trocha smutku protekla, ale byla to ta dobrá část. Ta, která se nesnaží nic dokazovat a jen si sedne vedle tebe do písku.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'item', itemId: 'inside_rain_umbrella' },
          { type: 'flag', flag: 'inside_rain_sheltered' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑ · Item',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Zmokl jsi schválně. Glitchka tě obešla dokola a prohlásila tě za oficiálně proměnlivého. Protokol počasí se rozplakal závistí.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'entityRelation', entity: 'glitchka', delta: 1 },
          { type: 'flag', flag: 'inside_rain_accepted' },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↑',
          statHints: { energy: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    sandbox_inside_rain_returns: {
      id: 'sandbox_inside_rain_returns',
      title: 'Vnitřní déšť se vrací',
      logLabel: 'INSIDE_RAIN_RETURNS',
      scene:
        'Deštník se sám otevřel v kapse. Ne proto, že pršelo. Protože si pamatoval, že jsi minule neřekl „už dost“. Některé předměty jsou nepříjemně pečující.',
      yesLabel: 'NECHAT HO OTEVŘENÝ',
      noLabel: 'SLOŽIT HO',
      category: 'object',
      sector: 'memory_sandbox',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'echo',
      tone: ['absurd', 'tender'],
      tags: ['sandbox_absurd', 'object', 'rain', 'echo', 'stabilize'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        { type: 'hasItem', itemId: 'inside_rain_umbrella' },
      ],

      yes: {
        resultText:
          'Nechal jsi ho otevřený. Smutek se nerozplynul. Jen přestal padat tak přímo. To je v SYNTHOMĚ skoro jako luxusní pojištění duše.',
        effects: [
          { type: 'stat', key: 'memory', amount: -5 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'imprint', imprintId: 'safe_mistake' },
        ],
        preview: {
          hint: 'Paměť ↓ · Vazba ↑ · Imprint',
          statHints: { memory: 'down', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Složil jsi ho. Déšť tě trefil přesně do místa, kde sis myslel, že už máš střechu. Roztomilé. Katastroficky roztomilé.',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'energy', amount: -4 },
          { type: 'flag', flag: 'rain_without_cover' },
        ],
        preview: {
          hint: 'Paměť ↑ · Energie ↓',
          statHints: { memory: 'up', energy: 'down' },
          risk: 'medium',
        },
      },
    },

    sandbox_bucket_of_rules: {
      id: 'sandbox_bucket_of_rules',
      title: 'Kyblík na cizí pravidla',
      logLabel: 'BUCKET_OF_RULES',
      scene:
        'Dětský kyblík na písku absorbuje zákon, který tě právě zlobí. Na boku má nálepku: „Pouze pro neautorizované úpravy reality.“ Systém z toho dostal kopřivku v kódu.',
      yesLabel: 'NABRAT',
      noLabel: 'NECHAT REALITU',
      category: 'object',
      sector: 'memory_sandbox',
      rarity: 'common',
      cooldownTurns: 7,
      packId: 'sandbox_absurd',
      role: 'object',
      tone: ['absurd', 'comic'],
      tags: ['sandbox_absurd', 'object', 'glitchka', 'low_penalty', 'rules'],
      conditions: [{ type: 'unlockedPool', poolId: 'sandbox_absurd_pool' }],

      yes: {
        resultText:
          'Nabral jsi pravidlo. Systém se okamžitě cítil odlehčený. Neklidně odlehčený. Jako úřad, kterému někdo odnesl razítko a ještě se u toho usmíval.',
        effects: [
          { type: 'stat', key: 'control', amount: -6 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'item', itemId: 'bucket_of_rules' },
          { type: 'flag', flag: 'rule_bucket_filled' },
        ],
        preview: {
          hint: 'Kontrola ↓ · Vazba ↑ · Item',
          statHints: { control: 'down', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Realita si nevšimla. Glitchka tvrdí, že to byla dobrá věc, ale nebyla. Jen starý zákon dostal další šanci tvářit se nevyhnutelně.',
        effects: [
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'stat', key: 'memory', amount: -3 },
          { type: 'flag', flag: 'rule_left_alone' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },

    sandbox_rule_castle: {
      id: 'sandbox_rule_castle',
      title: 'Hrad z pravidel',
      logLabel: 'RULE_CASTLE',
      scene:
        'Děti na Pískovišti postavily hrad. Kámen za kamenem jsou v něm zákony. Jeden cimbuří tvrdí, že chyba musí bolet. Druhé tvrdí, že dospělost je jen zákaz skákat do louží.',
      yesLabel: 'CHRÁNIT HRAD',
      noLabel: 'ZBOŘIT JEDNU VĚŽ',
      category: 'object',
      sector: 'memory_sandbox',
      rarity: 'common',
      cooldownTurns: 6,
      packId: 'sandbox_absurd',
      role: 'escalation',
      tone: ['absurd', 'comic'],
      tags: ['sandbox_absurd', 'object', 'glitchka', 'low_penalty', 'rules'],
      conditions: [{ type: 'unlockedPool', poolId: 'sandbox_absurd_pool' }],

      yes: {
        resultText:
          'Hrad stál. Zákony v něm byly malé, ale hlučné. Jeden ti nabídl miniaturní občanku subjektu. Upřímně, horší dokumenty už existovaly.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'flag', flag: 'rule_castle_protected' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Věž spadla. Zákony se rozutekly a Glitchka je sbírala jako perly. Jeden zákon křičel, že to oznámí dospělým. Nikdo mu nevěřil.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'entityRelation', entity: 'glitchka', delta: 1 },
          { type: 'flag', flag: 'rule_tower_broken' },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓',
          statHints: { energy: 'up', control: 'down' },
          risk: 'low',
        },
      },
    },

    sandbox_rule_spill: {
      id: 'sandbox_rule_spill',
      title: 'Rozlitá pravidla',
      logLabel: 'RULE_SPILL',
      scene:
        'Kyblík se převrhl. Pravidla vytekla do písku jako hustá modrá limonáda. Některá se hned snažila vsáknout zpátky do systému. Jiná začala dělat bubliny a lhát, že jsou svoboda.',
      yesLabel: 'NECHAT JE TÉCT',
      noLabel: 'NABRAT JE ZPÁTKY',
      category: 'crisis',
      sector: 'memory_sandbox',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'twist',
      tone: ['absurd', 'comic', 'tender'],
      tags: ['sandbox_absurd', 'crisis', 'rules', 'glitch'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        { type: 'hasItem', itemId: 'bucket_of_rules' },
      ],

      yes: {
        resultText:
          'Nechal jsi je téct. Písek na chvíli přestal rozlišovat mezi chybou a nápadem. Systém to označil jako vandalismus. Pískoviště jako kreativitu.',
        effects: [
          { type: 'stat', key: 'energy', amount: 7 },
          { type: 'stat', key: 'control', amount: -7 },
          { type: 'imprint', imprintId: 'sand_in_the_code' },
          { type: 'flag', flag: 'rules_spilled' },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓↓ · Imprint',
          statHints: { energy: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nabral jsi je zpátky. Kyblík těžkl. Některá pravidla se tvářila uraženě, že už nejsou nevyhnutelná, ale jen přenositelná.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: -2 },
          { type: 'flag', flag: 'rules_recontained' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓',
          statHints: { control: 'up', bond: 'down' },
          risk: 'low',
        },
      },
    },

    sandbox_too_safe: {
      id: 'sandbox_too_safe',
      title: 'Příliš měkký písek',
      logLabel: 'TOO_SAFE',
      scene:
        'Pískoviště začalo vracet každou chybu jako hru. Už nic nebolelo. Což bylo podezřelé. Když bezpečí začne mazat následky, je to jenom hezčí klec s lepším pískem.',
      yesLabel: 'ZŮSTAT JEŠTĚ CHVÍLI',
      noLabel: 'ZKAZIT HRU PRAVDOU',
      category: 'crisis',
      sector: 'memory_sandbox',
      rarity: 'uncommon',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'escalation',
      tone: ['absurd', 'tender'],
      tags: ['sandbox_absurd', 'glitchka', 'crisis', 'twist', 'infantile_loop'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        {
          type: 'hasAnyFlag',
          flags: [
            'banana_court_attended',
            'inside_rain_accepted',
            'rule_tower_broken',
            'rules_spilled',
            'third_perspective_trusted',
          ],
        },
      ],

      yes: {
        resultText:
          'Zůstal jsi. Písek byl příjemný. Možná až moc. Každá chyba dostala měkký polštář a začala být pyšná, že už se nikdy nemusí změnit.',
        effects: [
          { type: 'stat', key: 'bond', amount: 8 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'stat', key: 'control', amount: -10 },
          { type: 'flag', flag: 'sandbox_infantile_loop' },
          { type: 'imprint', imprintId: 'safe_mistake' },
          { type: 'schedule', cardId: 'sandbox_toy_rebellion', inTurns: 3 },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↓ · Kontrola ↓↓ · Imprint · Následek',
          statHints: { bond: 'up', memory: 'down', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Zkazil jsi hru pravdou. Písek se zatřásl a smál se. Nebyl uražený. Byl pyšný, že jsi konečně přestal chtít bezpečí bez ceny.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: -3 },
          { type: 'imprint', imprintId: 'dirty_laugh' },
          { type: 'flag', flag: 'game_ruined_truthfully' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓ · Imprint',
          statHints: { control: 'up', bond: 'down' },
          risk: 'medium',
        },
      },
    },

    sandbox_toy_rebellion: {
      id: 'sandbox_toy_rebellion',
      title: 'Vzpoura hraček',
      logLabel: 'TOY_REBELLION',
      scene:
        'Hračky se seřadily do kruhu. Banán drží proslov. Brýle kontrolují docházku. Deštník mlčí dramaticky. Kyblík tvrdí, že všechno je tvoje chyba, ale je ochotný to projednat v pískové radě.',
      yesLabel: 'PŘIJMOUT RADU HRAČEK',
      noLabel: 'PŘIPOMENOUT, ŽE JSOU TO HRAČKY',
      category: 'entity',
      sector: 'memory_sandbox',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'bill',
      tone: ['absurd', 'comic', 'tender'],
      tags: ['sandbox_absurd', 'entity', 'glitchka', 'bill', 'infantile_loop'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        { type: 'hasFlag', flag: 'sandbox_infantile_loop' },
      ],

      yes: {
        resultText:
          'Přijal jsi radu hraček. Byla překvapivě rozumná: „Přestaň se schovávat v místě, které ti dovolí nikdy nevyrůst.“ Banán sklidil potlesk. Znepokojivě zasloužený.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'removeFlag', flag: 'sandbox_infantile_loop' },
          { type: 'imprint', imprintId: 'dirty_laugh' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Smyčka pryč · Imprint',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Připomněl jsi, že jsou to hračky. Hračky se zatvářily dospěleji než ty, což je typ ponížení, který by měl mít vlastní příručku.',
        effects: [
          { type: 'stat', key: 'bond', amount: -6 },
          { type: 'stat', key: 'control', amount: -6 },
          { type: 'flag', flag: 'sandbox_infantile_loop_deepened' },
        ],
        preview: {
          hint: 'Vazba ↓ · Kontrola ↓',
          statHints: { bond: 'down', control: 'down' },
          risk: 'high',
        },
      },
    },

    sandbox_dirty_laugh: {
      id: 'sandbox_dirty_laugh',
      title: 'Špinavý smích',
      logLabel: 'DIRTY_LAUGH',
      scene:
        'Glitchka se chechtá, že tě přišpendlila k realitě pomocí smíchu. Smích má písek mezi zuby a vůbec se za to nestydí.',
      yesLabel: 'SMÁT SE S NÍ',
      noLabel: 'ZACHOVAT VÁŽNOU TVÁŘ',
      category: 'entity',
      sector: 'memory_sandbox',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'sandbox_absurd',
      role: 'resolution',
      tone: ['absurd', 'comic', 'tender'],
      tags: ['sandbox_absurd', 'glitchka', 'entity', 'stabilize', 'laugh'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['game_ruined_truthfully', 'rules_spilled', 'banana_argument_accepted', 'sandbox_infantile_loop'],
        },
      ],

      yes: {
        resultText:
          'Smál jsi se. Glitchka to považuje za diplomatický akt mezi tebou a světem, který si pořád myslí, že bolest musí mít jednotný formulář. 🦊☔',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'energy', amount: 4 },
          { type: 'entityRelation', entity: 'glitchka', delta: 2 },
          { type: 'imprint', imprintId: 'dirty_laugh' },
          { type: 'flag', flag: 'dirty_laugh_shared' },
        ],
        preview: {
          hint: 'Vazba ↑ · Energie ↑ · Glitchka ↑ · Imprint',
          statHints: { bond: 'up', energy: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Tvá vážnost byla impozantní. Glitchka si ji vyfotila a uložila jako důkaz, že i stabilita může občas vypadat jako člověk, který spolkl kancelářskou sponku.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: -4 },
          { type: 'entityRelation', entity: 'glitchka', delta: -1 },
          { type: 'flag', flag: 'serious_face_kept' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓ · Glitchka ↓',
          statHints: { control: 'up', bond: 'down' },
          risk: 'low',
        },
      },
    },

    sandbox_glitchka_draws_exit: {
      id: 'sandbox_glitchka_draws_exit',
      title: 'Glitchka kreslí východ',
      logLabel: 'GLITCHKA_DRAWS_EXIT',
      scene:
        'Glitchka na písek nakreslila dveře. Nejsou tam, ale vypadají, že by mohly. Klika je z pastelky. Práh z první odvahy, která ještě neví, že se jí někdo bude smát.',
      yesLabel: 'PROJÍT',
      noLabel: 'POČKAT NA REÁLNĚJŠÍ DVEŘE',
      category: 'path',
      sector: 'memory_sandbox',
      rarity: 'rare',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'echo',
      tone: ['absurd', 'tender'],
      tags: ['sandbox_absurd', 'glitchka', 'path', 'stabilize', 'exit'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_absurd_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['dirty_laugh_shared', 'game_ruined_truthfully', 'sandbox_toy_council_accepted', 'rules_recontained'],
        },
      ],

      yes: {
        resultText:
          'Prošel jsi. Dveře byly kreslené, ale směr byl skutečný. Glitchka zatleskala tak potichu, aby to nepolekalo tvou odvahu. 🦊✨',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'moveSector', sectorId: 'residuum' },
          { type: 'flag', flag: 'sandbox_exit_drawn_used' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Přesun',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Čekal jsi na reálnější dveře. Glitchka nakreslila křeslo. Byl jsi rád, že čekáš pohodlně. To je přesně ten druh pohodlí, kvůli kterému se pak systémy množí.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'energy', amount: -3 },
          { type: 'flag', flag: 'waited_for_real_door' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Energie ↓',
          statHints: { control: 'up', energy: 'down' },
          risk: 'low',
        },
      },
    },

    sandbox_safe_mistake_audit: {
      id: 'sandbox_safe_mistake_audit',
      title: 'Audit bezpečné chyby',
      logLabel: 'SAFE_MISTAKE_AUDIT',
      scene:
        'Systém si všiml, že chyba nebolela. Okamžitě svolal audit. Na Pískovišti se objevila malá tabulka s nápisem: „Prosím vysvětlete, proč subjekt nezkolaboval podle očekávání.“',
      yesLabel: 'VYPLNIT NESMYSL',
      noLabel: 'POPSAT PRAVDU',
      category: 'memory',
      sector: 'memory_sandbox',
      rarity: 'rare',
      maxUses: 1,
      packId: 'sandbox_absurd',
      role: 'echo',
      tone: ['absurd', 'comic', 'tender'],
      tags: ['sandbox_absurd', 'memory', 'audit', 'echo', 'stabilize'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sandbox_aftermath_pool' },
        { type: 'hasImprint', imprintId: 'safe_mistake' },
      ],

      yes: {
        resultText:
          'Vyplnil jsi nesmysl. Audit jej přijal, protože měl správné kolonky. Pískoviště si odkašlalo a ztratilo poslední zbytek respektu k administrativě.',
        effects: [
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'entityRelation', entity: 'form', delta: -1 },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓ · Form ↓',
          statHints: { energy: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Popsal jsi pravdu: chyba byla bezpečná, protože u ní někdo zůstal. Tabulka se rozmočila. Systém na chvíli nevěděl, kam zařadit něhu bez výkonu.',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: 3 },
          { type: 'imprint', imprintId: 'sand_in_the_code' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑ · Imprint',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_sandbox_absurd',
      poolId: 'sandbox_absurd_pool',
      condition: { type: 'unlockedPool', poolId: 'memory_sandbox_pool' },
    },
    {
      id: 'unlock_sandbox_aftermath',
      poolId: 'sandbox_aftermath_pool',
      condition: { type: 'hasAnyFlag', flags: ['dirty_laugh_active', 'safe_mistake_active', 'sand_in_code_active'] },
    },
  ],

  findings: [
    'sandbox_absurd_entry',
    'banana_court_survivor',
    'safe_mistake_learned',
    'dirty_laugh_shared',
  ],
};