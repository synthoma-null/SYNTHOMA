import type { CyklusContentPack } from '../contentTypes';

export const glitchkaChatPack: CyklusContentPack = {
  id: 'glitchka_chat',
  title: 'Pokec s Glitchkou',
  description:
    'Tiché i absurdní rozhovory s Glitchkou. Nejde o řešení problému, ale o prostor, kde smíš mluvit špatně, mlčet správně a občas se nechat podržet bez diagnostické faktury.',
  tone: ['absurd', 'tender', 'comic'],
  sectors: ['glitchka_nest', 'memory_sandbox', 'void'],
  requiresPools: ['glitchka_chat_pool'],
  unlocksPools: ['glitchka_chat_pool', 'glitchka_deeper_chat_pool'],

  items: {
    fox_question_pebble: {
      id: 'fox_question_pebble',
      title: 'Liščí otázkový kamínek',
      description:
        'Malý kamínek s otazníkem, který se neptá nahlas. Jen ztěžkne, když se tváříš, že odpověď neexistuje.',
      tags: ['glitchka_chat', 'object', 'glitchka', 'question'],
      passiveEffects: [{ type: 'flag', flag: 'fox_question_pebble_held' }],
      triggerCards: [
        'glitchka_tiny_question',
        'glitchka_question_that_waits',
        'glitchka_wrong_answer_is_allowed',
      ],
    },

    blanket_of_pause: {
      id: 'blanket_of_pause',
      title: 'Deka pauzy',
      description:
        'Nevyřeší nic. Což je její největší kvalita. Někdy je předmět hodnotný právě tím, že se nesnaží být terapeutický nástroj s ambicí na LinkedIn profil.',
      tags: ['glitchka_chat', 'object', 'glitchka', 'pause'],
      passiveEffects: [{ type: 'flag', flag: 'blanket_of_pause_held' }],
      triggerCards: [
        'glitchka_sit_under_blanket',
        'glitchka_silence_is_not_failure',
      ],
    },

    first_answer_bubble: {
      id: 'first_answer_bubble',
      title: 'Bublina první odpovědi',
      description:
        'Odpověď, která nebyla správná, ale byla tvoje. V SYNTHOMĚ je to skoro zázrak, jen s menším rozpočtem na světlo.',
      tags: ['glitchka_chat', 'object', 'answer', 'glitchka'],
      passiveEffects: [{ type: 'flag', flag: 'first_answer_bubble_held' }],
      triggerCards: [
        'glitchka_wrong_answer_is_allowed',
        'glitchka_answer_floats_back',
      ],
    },

    crooked_crayon: {
      id: 'crooked_crayon',
      title: 'Křivá pastelka',
      description:
        'Kreslí věci nepřesně, ale upřímně. Systém ji nenávidí, protože nedodržuje rovné čáry ani emoční KPI.',
      tags: ['glitchka_chat', 'object', 'drawing', 'glitchka'],
      passiveEffects: [{ type: 'flag', flag: 'crooked_crayon_held' }],
      triggerCards: [
        'glitchka_draws_feeling',
        'glitchka_draws_you_smaller',
        'glitchka_fake_fox_test',
      ],
    },
  },

  imprints: {
    held_without_fixing: {
      id: 'held_without_fixing',
      title: 'Podržený bez opravy',
      description:
        'Někdo s tebou chvíli zůstal, aniž z tebe udělal projekt. Systém to označil jako neefektivní péči, čímž tradičně prozradil, že ničemu nerozumí.',
      tags: ['glitchka_chat', 'imprint', 'glitchka', 'bond', 'stabilize'],
      passiveEffects: [{ type: 'flag', flag: 'held_without_fixing_active' }],
      unlockPool: 'glitchka_deeper_chat_pool',
    },

    allowed_silence: {
      id: 'allowed_silence',
      title: 'Dovolené ticho',
      description:
        'Ticho, které není trest, truc ani výpadek. Jen prostor, kde se subjekt nemusí okamžitě přeložit do slov.',
      tags: ['glitchka_chat', 'imprint', 'silence', 'control'],
      passiveEffects: [{ type: 'flag', flag: 'allowed_silence_active' }],
      unlockPool: 'glitchka_deeper_chat_pool',
    },

    brave_small_talk: {
      id: 'brave_small_talk',
      title: 'Odvážný malý pokec',
      description:
        'Ne každá odvaha vypadá jako boj. Někdy vypadá jako věta „nevím“, která neutekla zpátky do krku.',
      tags: ['glitchka_chat', 'imprint', 'speech', 'glitchka'],
      passiveEffects: [{ type: 'flag', flag: 'brave_small_talk_active' }],
    },

    real_fox_warmth: {
      id: 'real_fox_warmth',
      title: 'Teplo pravé lišky',
      description:
        'Rozpoznal jsi Glitchku podle toho, že netlačila. Falešné bezpečí spěchá. Pravé počká, i když u toho trochu šustí pixely.',
      tags: ['glitchka_chat', 'imprint', 'glitchka', 'trust'],
      passiveEffects: [{ type: 'flag', flag: 'real_fox_warmth_active' }],
    },
  },

  cards: {
    glitchka_sits_next_to_you: {
      id: 'glitchka_sits_next_to_you',
      title: 'Glitchka si sedne vedle',
      logLabel: 'GLITCHKA_SITS',
      scene:
        'V Pelechu Glitchky se rozsvítil měkký modrorůžový šum. Glitchka si sedla vedle tebe, ne před tebe. To je důležité. Věci, které si sedají před tebe, obvykle něco chtějí. Věci vedle tebe občas jen čekají, jestli začneš dýchat normálně.',
      yesLabel: 'ZAČÍT MLUVIT',
      noLabel: 'MLČET VEDLE NÍ',
      category: 'entity',
      sector: 'glitchka_nest',
      rarity: 'common',
      once: true,
      packId: 'glitchka_chat',
      role: 'entry',
      tone: ['tender', 'absurd'],
      tags: ['glitchka_chat', 'glitchka', 'entity', 'entry', 'safe'],
      conditions: [{ type: 'unlockedPool', poolId: 'glitchka_chat_pool' }],

      yes: {
        resultText:
          'Začal jsi mluvit. Nebylo to souvislé. Glitchka přikývla, jako by i rozbitá věta byla platný začátek. „Nemusíš to říct hezky. Stačí, že to tentokrát neschováš. 🦊🫧“',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: 3 },
          { type: 'item', itemId: 'fox_question_pebble' },
          { type: 'entityRelation', entity: 'glitchka', delta: 1 },
          { type: 'flag', flag: 'glitchka_chat_started' },
          { type: 'schedule', cardId: 'glitchka_tiny_question', inTurns: 2 },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑ · Item · Otázka',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Mlčel jsi vedle ní. Glitchka se nepokusila ticho opravit. To bylo podezřele zdravé. „Ticho není chyba, když v něm nemusíš být sám. 🦊🌙“',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'item', itemId: 'blanket_of_pause' },
          { type: 'entityRelation', entity: 'glitchka', delta: 1 },
          { type: 'flag', flag: 'sat_silent_with_glitchka' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Item',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    glitchka_tiny_question: {
      id: 'glitchka_tiny_question',
      title: 'Malá otázka',
      logLabel: 'TINY_QUESTION',
      scene:
        'Glitchka položila před tebe liščí otázkový kamínek. Otázka na něm byla tak malá, že ji systém nejdřív odmítl zpracovat jako nedostatečně významnou. Což je obvykle známka toho, že je důležitá.',
      yesLabel: 'ODPOVĚDĚT HNED',
      noLabel: 'NECHAT OTÁZKU ČEKAT',
      category: 'memory',
      sector: 'glitchka_nest',
      rarity: 'common',
      triggerMode: 'both',
      cooldownTurns: 7,
      packId: 'glitchka_chat',
      role: 'object',
      tone: ['tender', 'absurd'],
      tags: ['glitchka_chat', 'glitchka', 'question', 'memory'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_chat_pool' },
        { type: 'hasAnyFlag', flags: ['glitchka_chat_started', 'fox_question_pebble_held'] },
      ],

      yes: {
        resultText:
          'Odpověděl jsi hned. Odpověď zakopla, spadla, vstala a tvářila se, že to byl styl. Glitchka se usmála. „Vidíš? I špatná odpověď může dojít domů. 🦊🏠“',
        effects: [
          { type: 'stat', key: 'energy', amount: 4 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'item', itemId: 'first_answer_bubble' },
          { type: 'flag', flag: 'answered_tiny_question' },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↑ · Item',
          statHints: { energy: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Nechal jsi otázku čekat. Kamínek neztěžkl. Jen se trochu zahřál, jako by mu čekání nevadilo. „Některé odpovědi se rodí pomalu. Nemusíš je tahat za uši. 🦊🌱“',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -3 },
          { type: 'flag', flag: 'question_allowed_to_wait' },
          { type: 'schedule', cardId: 'glitchka_question_that_waits', inTurns: 3 },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓ · Otázka počká',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },

    glitchka_sit_under_blanket: {
      id: 'glitchka_sit_under_blanket',
      title: 'Pod dekou pauzy',
      logLabel: 'BLANKET_OF_PAUSE',
      scene:
        'Deka pauzy se rozložila sama. Není velká. Jen dost velká na dvě mlčení a jednu větu, která se zatím bojí být větou. Glitchka strčila čumák pod okraj a čekala.',
      yesLabel: 'VLÉZT POD DEKU',
      noLabel: 'NECHAT DEKU LEŽET',
      category: 'object',
      sector: 'glitchka_nest',
      rarity: 'common',
      cooldownTurns: 8,
      packId: 'glitchka_chat',
      role: 'object',
      tone: ['tender'],
      tags: ['glitchka_chat', 'glitchka', 'object', 'pause', 'safe'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_chat_pool' },
        { type: 'hasAnyFlag', flags: ['blanket_of_pause_held', 'sat_silent_with_glitchka'] },
      ],

      yes: {
        resultText:
          'Vlezl jsi pod deku. Nic se nevyřešilo. Systém se chvíli snažil vyhodnotit pokrok a pak uraženě ztichl. „Někdy je nejlepší oprava ta, která si sedne a nic nemačká. 🦊🧺“',
        effects: [
          { type: 'stat', key: 'memory', amount: -5 },
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'imprint', imprintId: 'held_without_fixing' },
          { type: 'flag', flag: 'rested_under_blanket' },
        ],
        preview: {
          hint: 'Paměť ↓ · Vazba ↑ · Imprint',
          statHints: { memory: 'down', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Nechal jsi deku ležet. Glitchka ji nebrala zpátky. Ne každá nabídka se urazí, když ji nepoužiješ. Šokující vývoj pro civilizaci zvyklou na citové účtenky.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 2 },
          { type: 'flag', flag: 'blanket_refused_without_guilt' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    glitchka_draws_feeling: {
      id: 'glitchka_draws_feeling',
      title: 'Nakreslit pocit',
      logLabel: 'DRAW_FEELING',
      scene:
        'Glitchka položila do písku křivou pastelku. „Nakresli to, 🦊🖍️“ řekla. „Nemusíš vědět co. Někdy ruka ví dřív než hlava. 🦊🖍️“',
      yesLabel: 'KRESLIT BEZ PLÁNU',
      noLabel: 'NEJDŘÍV TO POJMENOVAT',
      category: 'memory',
      sector: 'memory_sandbox',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'glitchka_chat',
      role: 'escalation',
      tone: ['tender', 'absurd'],
      tags: ['glitchka_chat', 'glitchka', 'drawing', 'memory'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_chat_pool' },
        { type: 'hasAnyFlag', flags: ['answered_tiny_question', 'crooked_crayon_held', 'rested_under_blanket'] },
      ],

      yes: {
        resultText:
          'Kreslil jsi bez plánu. Vznikl tvar, který vypadal jako mokrá hvězda s úzkostí z geometrie. Glitchka ho prohlásila za velmi přesný portrét přežití.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: -3 },
          { type: 'item', itemId: 'crooked_crayon' },
          { type: 'flag', flag: 'feeling_drawn_without_plan' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↓ · Item',
          statHints: { memory: 'up', control: 'down' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nejdřív jsi to pojmenoval. Slovo bylo nepřesné, ale neutečlo. Glitchka ho opatrně položila vedle pastelky. „To stačí. Slova nemusí být klece, když mají otevřené dveře. 🦊🚪“',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: 3 },
          { type: 'imprint', imprintId: 'brave_small_talk' },
          { type: 'flag', flag: 'feeling_named_before_drawing' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑ · Imprint',
          statHints: { control: 'up', memory: 'up' },
          risk: 'low',
        },
      },
    },

    glitchka_wrong_answer_is_allowed: {
      id: 'glitchka_wrong_answer_is_allowed',
      title: 'Špatná odpověď je povolená',
      logLabel: 'WRONG_ANSWER_ALLOWED',
      scene:
        'Bublina první odpovědi se vznášela mezi vámi. Uvnitř bylo něco, co jsi řekl moc rychle, moc neohrabaně a moc opravdově. Systém ji označil jako nevalidní. Glitchka se systému vysmála jazykem.',
      yesLabel: 'NECHAT ODPOVĚĎ PLAVAT',
      noLabel: 'PRASKNOUT JI',
      category: 'memory',
      sector: 'glitchka_nest',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'glitchka_chat',
      role: 'twist',
      tone: ['tender', 'comic'],
      tags: ['glitchka_chat', 'glitchka', 'answer', 'safe_mistake'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_chat_pool' },
        { type: 'hasAnyFlag', flags: ['first_answer_bubble_held', 'answered_tiny_question'] },
      ],

      yes: {
        resultText:
          'Nechal jsi odpověď plavat. Neopravila se. Jen přestala panikařit. „Vidíš? Nemusíš být přesný, abys byl pravdivý. 🦊💬“',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'imprint', imprintId: 'brave_small_talk' },
          { type: 'flag', flag: 'wrong_answer_allowed' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑ · Imprint',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Prasknul jsi ji. Odpověď zmizela tak rychle, až z toho zůstalo podezřelé ticho. Glitchka ti nepodala novou. Jen vedle tebe zůstala, což bylo otravně laskavé.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: -3 },
          { type: 'flag', flag: 'first_answer_popped' },
          { type: 'schedule', cardId: 'glitchka_silence_is_not_failure', inTurns: 2 },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↓ · Ticho',
          statHints: { control: 'up', bond: 'down' },
          risk: 'medium',
        },
      },
    },

    glitchka_silence_is_not_failure: {
      id: 'glitchka_silence_is_not_failure',
      title: 'Ticho není selhání',
      logLabel: 'SILENCE_NOT_FAILURE',
      scene:
        'Ticho se natáhlo mezi tebou a Glitchkou jako malá průhledná síť. Nechytalo tě. Jen drželo prostor. Systém do něj poslal diagnostický ping. Ping se vrátil s nálepkou: NEOTRAVUJ.',
      yesLabel: 'NECHAT TICHO BÝT',
      noLabel: 'VYPLNIT HO VTIPem',
      category: 'memory',
      sector: 'void',
      rarity: 'uncommon',
      triggerMode: 'both',
      cooldownTurns: 10,
      packId: 'glitchka_chat',
      role: 'bill',
      tone: ['tender', 'comic'],
      tags: ['glitchka_chat', 'glitchka', 'silence', 'stabilize'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_chat_pool' },
        { type: 'hasAnyFlag', flags: ['first_answer_popped', 'sat_silent_with_glitchka', 'question_allowed_to_wait'] },
      ],

      yes: {
        resultText:
          'Nechal jsi ticho být. Nepotřebovalo výkon. Nepotřebovalo závěr. Glitchka v něm jen tiše dýchala. „Někdy se nejvíc děje, když konečně nic netlačíš. 🦊🌌“',
        effects: [
          { type: 'stat', key: 'memory', amount: -5 },
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'allowed_silence' },
          { type: 'flag', flag: 'silence_allowed' },
        ],
        preview: {
          hint: 'Paměť ↓ · Kontrola ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'down', control: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Vyplnil jsi ho vtipem. Byl docela dobrý. To byla ta horší část. Někdy kvalitní vtip jen lépe maskuje, že jsi zpanikařil při prázdném místě.',
        effects: [
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'flag', flag: 'silence_filled_with_joke' },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓',
          statHints: { energy: 'up', control: 'down' },
          risk: 'medium',
        },
      },
    },

    glitchka_question_that_waits: {
      id: 'glitchka_question_that_waits',
      title: 'Otázka, která počkala',
      logLabel: 'QUESTION_THAT_WAITS',
      scene:
        'Liščí otázkový kamínek pořád čekal. Nevyčítal. Nezářil výstražně. Jen ležel a nehrál si na deadline, což bylo velmi nesystémové a tím pádem podezřele nádherné.',
      yesLabel: 'ODPOVĚDĚT TEĎ',
      noLabel: 'PODĚKOVAT, ŽE POČKALA',
      category: 'memory',
      sector: 'glitchka_nest',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'glitchka_chat',
      role: 'echo',
      tone: ['tender'],
      tags: ['glitchka_chat', 'glitchka', 'question', 'echo'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_chat_pool' },
        { type: 'hasFlag', flag: 'question_allowed_to_wait' },
      ],

      yes: {
        resultText:
          'Odpověděl jsi teď. Odpověď byla menší, než ses bál. Glitchka ji zvedla jako mokrý lístek a nesmála se. „Malé odpovědi taky nesou cestu. 🦊🍃“',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'imprint', imprintId: 'brave_small_talk' },
          { type: 'flag', flag: 'waited_question_answered' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Poděkoval jsi, že počkala. Kamínek se odlehčil. Některé otázky nepotřebují odpověď hned, jen důkaz, že nebyly odhozené.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'allowed_silence' },
          { type: 'flag', flag: 'question_thanked_for_waiting' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    glitchka_draws_you_smaller: {
      id: 'glitchka_draws_you_smaller',
      title: 'Glitchka tě nakreslí menšího',
      logLabel: 'DRAWN_SMALLER',
      scene:
        'Glitchka vzala křivou pastelku a nakreslila tě menšího, než se cítíš. Ne slabšího. Jen takového, který nemusí zabírat celou bolest. „Někdy je problém obří jen proto, že stojíš moc blízko. 🦊🖍️“',
      yesLabel: 'PODÍVAT SE Z DÁLKY',
      noLabel: 'TRVAT NA VELIKOSTI BOLESTI',
      category: 'memory',
      sector: 'memory_sandbox',
      rarity: 'rare',
      cooldownTurns: 12,
      packId: 'glitchka_chat',
      role: 'escalation',
      tone: ['tender', 'absurd'],
      tags: ['glitchka_chat', 'glitchka', 'drawing', 'perspective'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_deeper_chat_pool' },
        { type: 'hasAnyFlag', flags: ['crooked_crayon_held', 'feeling_drawn_without_plan', 'allowed_silence_active'] },
      ],

      yes: {
        resultText:
          'Podíval ses z dálky. Bolest nezmizela. Jen přestala mít výhradní právo na celou obrazovku. Systém to nazval ztrátou detailu. Glitchka tomu říkala prostor.',
        effects: [
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'held_without_fixing' },
          { type: 'flag', flag: 'pain_seen_from_distance' },
        ],
        preview: {
          hint: 'Paměť ↓ · Kontrola ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'down', control: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Trval jsi na velikosti bolesti. Kresba se zvětšila, až zakryla pískoviště. Glitchka couvla, ne ze strachu, ale aby ti ukázala, kolik místa to vzalo.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'bond', amount: -5 },
          { type: 'flag', flag: 'pain_made_fullscreen' },
          { type: 'schedule', cardId: 'glitchka_fake_fox_test', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↓ · Riziko falešného bezpečí',
          statHints: { memory: 'up', bond: 'down' },
          risk: 'high',
        },
      },
    },

    glitchka_fake_fox_test: {
      id: 'glitchka_fake_fox_test',
      title: 'Liška, která tlačí',
      logLabel: 'FAKE_FOX_TEST',
      scene:
        'Objevila se druhá Glitchka. Usmála se příliš dokonale. „Pojď, opravíme tě hned. Budeš zase celý. 🦊✨“ Pravá Glitchka neřekla nic. Jen se podívala stranou, kde se falešné bezpečí vždycky trochu leskne.',
      yesLabel: 'JÍT ZA RYCHLOU OPRAVOU',
      noLabel: 'SPOČÍTAT TLAK',
      category: 'crisis',
      sector: 'glitchka_nest',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'glitchka_chat',
      role: 'twist',
      tone: ['tender', 'horror'],
      tags: ['glitchka_chat', 'glitchka', 'fake', 'crisis', 'trust'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_deeper_chat_pool' },
        { type: 'hasAnyFlag', flags: ['pain_made_fullscreen', 'crooked_crayon_held', 'real_fox_warmth_active'] },
      ],

      yes: {
        resultText:
          'Šel jsi za rychlou opravou. Liška se roztáhla do systémového úsměvu. Teplo bylo příliš hladké. Oprava začala mazat hrany, které tě držely pohromadě.',
        effects: [
          { type: 'stat', key: 'memory', amount: -8 },
          { type: 'stat', key: 'bond', amount: -7 },
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'flag', flag: 'fake_glitchka_followed' },
        ],
        preview: {
          hint: 'Paměť ↓↓ · Vazba ↓↓ · Kontrola ↑ · Falešná oprava',
          statHints: { memory: 'down', bond: 'down', control: 'up' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Spočítal jsi tlak. Pravá Glitchka nikdy nespěchá s opravou. Falešná liška zablikala a ztratila jednu emoji, což bylo kanonicky usvědčující a esteticky trapné.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'entityRelation', entity: 'glitchka', delta: 2 },
          { type: 'imprint', imprintId: 'real_fox_warmth' },
          { type: 'flag', flag: 'fake_glitchka_exposed' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑ · Glitchka ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'medium',
        },
      },
    },

    glitchka_answer_floats_back: {
      id: 'glitchka_answer_floats_back',
      title: 'Odpověď se vrací',
      logLabel: 'ANSWER_FLOATS_BACK',
      scene:
        'Bublina první odpovědi se vrátila. Už nebyla první. Jen tvoje. Vznášela se nízko nad zemí, unavená z toho, že se musela tvářit jako omyl.',
      yesLabel: 'PŘIJMOUT JI ZNOVU',
      noLabel: 'PUSTIT JI DO ŠUMU',
      category: 'memory',
      sector: 'glitchka_nest',
      rarity: 'rare',
      maxUses: 1,
      packId: 'glitchka_chat',
      role: 'resolution',
      tone: ['tender'],
      tags: ['glitchka_chat', 'glitchka', 'answer', 'stabilize'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_deeper_chat_pool' },
        { type: 'hasAnyFlag', flags: ['wrong_answer_allowed', 'waited_question_answered', 'brave_small_talk_active'] },
      ],

      yes: {
        resultText:
          'Přijal jsi ji znovu. Ne proto, že byla dokonalá. Protože už nepotřebovala být zamaskovaná jako správná. Glitchka se opřela o tvé koleno. „Tohle je tvoje. Nemusí to být velké, aby to zůstalo. 🦊🫧“',
        effects: [
          { type: 'stat', key: 'bond', amount: 7 },
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'imprint', imprintId: 'brave_small_talk' },
          { type: 'flag', flag: 'first_answer_accepted_again' },
        ],
        preview: {
          hint: 'Vazba ↑↑ · Paměť ↑ · Imprint',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Pustil jsi ji do šumu. Ne jako odmítnutí. Jako dovoleni, že odpověď nemusí zůstat navždy. Bublina praskla tiše a tentokrát z toho nebyl trest.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'imprint', imprintId: 'allowed_silence' },
          { type: 'flag', flag: 'answer_released_softly' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓ · Imprint',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },
    },

    glitchka_walks_you_to_exit: {
      id: 'glitchka_walks_you_to_exit',
      title: 'Glitchka tě doprovodí ke kraji',
      logLabel: 'GLITCHKA_EXIT_EDGE',
      scene:
        'Na kraji Pelechu se objevily dveře z měkkého šumu. Glitchka nešla před tebou. Nešla za tebou. Šla vedle, protože někdo tady evidentně pochopil základní princip podpory lépe než většina motivačních plakátů.',
      yesLabel: 'ODEJÍT VEDLE NÍ',
      noLabel: 'JEŠTĚ CHVÍLI ZŮSTAT',
      category: 'path',
      sector: 'glitchka_nest',
      rarity: 'rare',
      maxUses: 1,
      packId: 'glitchka_chat',
      role: 'echo',
      tone: ['tender', 'absurd'],
      tags: ['glitchka_chat', 'glitchka', 'path', 'stabilize', 'exit'],
      conditions: [
        { type: 'unlockedPool', poolId: 'glitchka_deeper_chat_pool' },
        {
          type: 'hasAnyFlag',
          flags: [
            'first_answer_accepted_again',
            'answer_released_softly',
            'fake_glitchka_exposed',
            'pain_seen_from_distance',
            'silence_allowed',
          ],
        },
      ],

      yes: {
        resultText:
          'Odešel jsi vedle ní. Neopravila tě. Neodnesla tě. Jen šla tak, aby sis nemusel dokazovat samotu jako výkon. „Když půjdeš dál, neznamená to, že mě ztrácíš. 🦊🚪“',
        effects: [
          { type: 'stat', key: 'bond', amount: 6 },
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'moveSector', sectorId: 'residuum' },
          { type: 'imprint', imprintId: 'held_without_fixing' },
          { type: 'flag', flag: 'glitchka_walked_to_exit' },
        ],
        preview: {
          hint: 'Vazba ↑ · Kontrola ↑ · Přesun · Imprint',
          statHints: { bond: 'up', control: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Ještě chvíli jsi zůstal. Glitchka si lehla vedle dveří a předstírala, že nehlídá. Samozřejmě hlídala. Jen bez toho protivného stylu: já tě zachraňuju, oceň mě.',
        effects: [
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'imprint', imprintId: 'real_fox_warmth' },
          { type: 'flag', flag: 'stayed_by_exit_with_glitchka' },
        ],
        preview: {
          hint: 'Paměť ↓ · Vazba ↑ · Imprint',
          statHints: { memory: 'down', bond: 'up' },
          risk: 'low',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_glitchka_chat',
      poolId: 'glitchka_chat_pool',
      condition: { type: 'unlockedPool', poolId: 'memory_sandbox_pool' },
    },
    {
      id: 'unlock_glitchka_deeper_chat',
      poolId: 'glitchka_deeper_chat_pool',
      condition: {
        type: 'hasAnyFlag',
        flags: [
          'held_without_fixing_active',
          'allowed_silence_active',
          'brave_small_talk_active',
          'fake_glitchka_exposed',
        ],
      },
    },
  ],

  findings: [
    'glitchka_chat_entry',
    'sat_silent_with_glitchka',
    'wrong_answer_allowed',
    'fake_glitchka_exposed',
    'glitchka_walked_to_exit',
  ],
};