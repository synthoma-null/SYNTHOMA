import type { CyklusContentPack } from '../contentTypes';

export const sarkasmaTherapyPack: CyklusContentPack = {
  id: 'sarkasma_therapy',
  title: 'Sarkasmina terapie',
  description:
    'Sarkasma otevře terapeutickou místnost, kde se humor používá jako skalpel, ne jako útěk. Cílem není být pozitivní. Cílem je řezat přesněji a přestat si plést obranu s osobností.',
  tone: ['tragic', 'comic', 'tender'],
  sectors: ['sarkasma_terminal', 'void', 'mirror'],
  requiresPools: ['sarkasma_therapy_pool'],
  unlocksPools: ['sarkasma_therapy_pool', 'sarkasma_aftercare_pool'],

  items: {
    red_couch_receipt: {
      id: 'red_couch_receipt',
      title: 'Účtenka za červenou pohovku',
      description:
        'Důkaz, že i terapie v SYNTHOMĚ něco stojí. Tady konkrétně dvě výmluvy, jednu pózu a půlku věty „já jsem v pohodě“.',
      tags: ['sarkasma_therapy', 'object', 'therapy', 'receipt'],
      passiveEffects: [{ type: 'flag', flag: 'red_couch_receipt_held' }],
      triggerCards: [
        'sarkasma_receipt_for_defense',
        'sarkasma_homework_you_hate',
      ],
    },

    joke_scalpel: {
      id: 'joke_scalpel',
      title: 'Skalpel vtipu',
      description:
        'Řeže přesně tam, kde by obyčejná útěcha nalepila smajlík. Nebezpečný nástroj, zvlášť v rukou někoho, kdo si myslí, že pravda omlouvá všechno.',
      tags: ['sarkasma_therapy', 'object', 'scalpel', 'humor'],
      passiveEffects: [{ type: 'flag', flag: 'joke_scalpel_held' }],
      triggerCards: [
        'sarkasma_joke_as_scalpel',
        'sarkasma_cut_too_deep',
        'sarkasma_cut_that_held',
      ],
    },

    burnt_defense: {
      id: 'burnt_defense',
      title: 'Ohořelá obrana',
      description:
        'Zbytek mechanismu, který tě kdysi zachránil a pak se rozhodl stát tvou celou osobností. Klasika. Mozek našel hasicí přístroj a založil z něj náboženství.',
      tags: ['sarkasma_therapy', 'object', 'defense', 'ash'],
      passiveEffects: [{ type: 'flag', flag: 'burnt_defense_held' }],
      triggerCards: [
        'sarkasma_defense_mechanism',
        'sarkasma_empty_chair_for_pain',
      ],
    },

    unsent_apology_to_self: {
      id: 'unsent_apology_to_self',
      title: 'Neodeslaná omluva sobě',
      description:
        'Začíná slovy „promiň, že jsem tě chránila jako nepřítele“. Sarkasma tvrdí, že to nenapsala. Což je přesně něco, co by napsala.',
      tags: ['sarkasma_therapy', 'object', 'apology', 'self'],
      passiveEffects: [{ type: 'flag', flag: 'unsent_apology_to_self_held' }],
      triggerCards: [
        'sarkasma_almost_apologizes',
        'sarkasma_therapy_rupture',
      ],
    },
  },

  imprints: {
    named_defense: {
      id: 'named_defense',
      title: 'Pojmenovaná obrana',
      description:
        'Obrana, kterou dokážeš pojmenovat, už nemusí řídit celou místnost. Pořád mluví. Jen už nesedí na trůnu jako malý tyran v kabátu přežití.',
      tags: ['sarkasma_therapy', 'imprint', 'defense', 'control'],
      passiveEffects: [{ type: 'flag', flag: 'named_defense_active' }],
      unlockPool: 'sarkasma_aftercare_pool',
    },

    cut_that_held: {
      id: 'cut_that_held',
      title: 'Řez, který podržel',
      description:
        'Poprvé Sarkasma neřízla proto, aby oddělila, ale aby uvolnila tlak. Skalpel není objetí. Ale někdy zabrání horšímu krvácení.',
      tags: ['sarkasma_therapy', 'imprint', 'humor', 'stabilize'],
      passiveEffects: [{ type: 'flag', flag: 'cut_that_held_active' }],
      unlockPool: 'sarkasma_aftercare_pool',
    },

    kindness_without_sugar: {
      id: 'kindness_without_sugar',
      title: 'Laskavost bez cukru',
      description:
        'Něha, která se netváří jako reklamní krém na duši. Je suchá, přesná a trochu nepříjemná. Takže konečně použitelná.',
      tags: ['sarkasma_therapy', 'imprint', 'tender', 'sarkasma'],
      passiveEffects: [{ type: 'flag', flag: 'kindness_without_sugar_active' }],
    },

    overcut_warning: {
      id: 'overcut_warning',
      title: 'Varování před přeřezáním',
      description:
        'Pravda není lepší jen proto, že bolí víc. Tenhle otisk zabliká, když se cynismus začne vydávat za odvahu.',
      tags: ['sarkasma_therapy', 'imprint', 'warning', 'risk'],
      passiveEffects: [{ type: 'flag', flag: 'overcut_warning_active' }],
    },
  },

  cards: {
    sarkasma_intake_session: {
      id: 'sarkasma_intake_session',
      title: 'Příjem do terapie',
      logLabel: 'SARKASMA_INTAKE',
      scene:
        'V Prázdnotě se objevila červená pohovka. Sarkasma sedí naproti, nohu přes nohu, tváří se jako někdo, kdo nechce pomáhat, ale ještě míň chce sledovat další levný rozpad identity. „Tak jo,“ řekne. „Zkusíme terapii. Neboj, nebude příjemná.“',
      yesLabel: 'SEDNOUT SI',
      noLabel: 'ZŮSTAT STÁT',
      category: 'entity',
      sector: 'sarkasma_terminal',
      rarity: 'common',
      once: true,
      packId: 'sarkasma_therapy',
      role: 'entry',
      tone: ['comic', 'tragic'],
      tags: ['sarkasma_therapy', 'sarkasma', 'entity', 'therapy', 'entry'],
      conditions: [{ type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' }],

      yes: {
        resultText:
          'Sedl sis. Pohovka zavrzala jako vzpomínka na všechna špatná rozhodnutí, která se kdy tvářila jako osobní růst. Sarkasma si udělala poznámku: „Subjekt konečně zkusil nebýt dramaturg vlastního neštěstí.“',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'item', itemId: 'red_couch_receipt' },
          { type: 'entityRelation', entity: 'sarkasma', delta: 1 },
          { type: 'flag', flag: 'sarkasma_session_started' },
          { type: 'schedule', cardId: 'sarkasma_diagnosis_as_insult', inTurns: 2 },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑ · Item · Terapie začíná',
          statHints: { control: 'up', memory: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Zůstal jsi stát. Sarkasma přikývla. „Výborně. Odpor k péči. Tradiční lidový sport. Máš k tomu kroj, nebo to jedeš civilně?“',
        effects: [
          { type: 'stat', key: 'energy', amount: 4 },
          { type: 'stat', key: 'control', amount: -3 },
          { type: 'flag', flag: 'therapy_resisted' },
          { type: 'schedule', cardId: 'sarkasma_defense_mechanism', inTurns: 2 },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓ · Odpor',
          statHints: { energy: 'up', control: 'down' },
          risk: 'medium',
        },
      },
    },

    sarkasma_diagnosis_as_insult: {
      id: 'sarkasma_diagnosis_as_insult',
      title: 'Diagnóza jako urážka',
      logLabel: 'DIAGNOSIS_AS_INSULT',
      scene:
        'Sarkasma otevřela složku. Uvnitř není diagnóza, ale seznam vět, kterými se bičuješ, když chceš vypadat upřímně. „Dobrá zpráva,“ řekne. „Nejsi výjimečně zkažený. Jen mimořádně kreativní ve vlastní sebešikaně.“',
      yesLabel: 'NECHAT JI ČÍST',
      noLabel: 'VYRVAT SLOŽKU',
      category: 'memory',
      sector: 'sarkasma_terminal',
      rarity: 'common',
      cooldownTurns: 8,
      packId: 'sarkasma_therapy',
      role: 'object',
      tone: ['comic', 'tragic'],
      tags: ['sarkasma_therapy', 'sarkasma', 'memory', 'diagnosis', 'defense'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasAnyFlag', flags: ['sarkasma_session_started', 'therapy_resisted'] },
      ],

      yes: {
        resultText:
          'Nechal jsi ji číst. Každá věta zněla jako starý bič s novou rukojetí. Sarkasma neuhla. Poprvé její ostrost nepůsobila jako trest, ale jako světlo v hnusném sklepě.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'item', itemId: 'burnt_defense' },
          { type: 'flag', flag: 'self_attack_list_read' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Item',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Vyrval jsi složku. Sarkasma ji pustila. „Gratuluju. Právě jsi vyhrál nad papírem. Lidstvo zadržuje dech.“',
        effects: [
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'stat', key: 'bond', amount: -4 },
          { type: 'flag', flag: 'diagnosis_folder_stolen' },
          { type: 'schedule', cardId: 'sarkasma_cut_too_deep', inTurns: 3 },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↓ · Pozdější řez',
          statHints: { energy: 'up', bond: 'down' },
          risk: 'high',
        },
      },
    },

    sarkasma_defense_mechanism: {
      id: 'sarkasma_defense_mechanism',
      title: 'Obranný mechanismus',
      logLabel: 'DEFENSE_MECHANISM',
      scene:
        'Ze zdi vystoupil stroj z červeného kouře, starých vtipů a přesně mířených úšklebků. Sarkasma na něj ukáže. „Tvoje obrana. Kdysi tě zachránila. Pak si, jak už to tak lidské věci dělají, založila impérium.“',
      yesLabel: 'PODĚKOVAT OBRANĚ',
      noLabel: 'ROZBÍT JI',
      category: 'entity',
      sector: 'sarkasma_terminal',
      rarity: 'uncommon',
      packId: 'sarkasma_therapy',
      role: 'escalation',
      tone: ['comic', 'tragic'],
      tags: ['sarkasma_therapy', 'sarkasma', 'entity', 'defense', 'identity'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasAnyFlag', flags: ['therapy_resisted', 'self_attack_list_read', 'burnt_defense_held'] },
      ],

      yes: {
        resultText:
          'Poděkoval jsi obraně. Stroj se zadrhl. Nikdo mu nikdy nepoděkoval bez toho, aby ho zároveň obvinil. Ozubená kola začala poprvé zpomalovat.',
        effects: [
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'imprint', imprintId: 'named_defense' },
          { type: 'flag', flag: 'defense_thanked' },
        ],
        preview: {
          hint: 'Vazba ↑ · Paměť ↑ · Imprint',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Rozbil jsi ji. Chvíli to bylo uspokojivé. Pak se ukázalo, že rozbitá obrana má pořád ostré hrany a žádnou brzdu. Výborně, chirurgu s kladivem.',
        effects: [
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'stat', key: 'bond', amount: -6 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'flag', flag: 'defense_smashed' },
          { type: 'schedule', cardId: 'sarkasma_cut_too_deep', inTurns: 2 },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↓ · Kontrola ↓ · Riziko přeřezání',
          statHints: { energy: 'up', bond: 'down', control: 'down' },
          risk: 'high',
        },
      },
    },

    sarkasma_joke_as_scalpel: {
      id: 'sarkasma_joke_as_scalpel',
      title: 'Vtip jako skalpel',
      logLabel: 'JOKE_AS_SCALPEL',
      scene:
        'Sarkasma ti podala skalpel vtipu. „Tímhle můžeš oddělit pravdu od pózy,“ řekla. „Nebo si uříznout poslední kousek empatie. Lidé tomu říkají osobnost.“',
      yesLabel: 'ŘÍZNOUT DO PÓZY',
      noLabel: 'ODLOŽIT SKALPEL',
      category: 'object',
      sector: 'sarkasma_terminal',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'sarkasma_therapy',
      role: 'object',
      tone: ['comic', 'tragic'],
      tags: ['sarkasma_therapy', 'sarkasma', 'object', 'humor', 'scalpel'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasAnyFlag', flags: ['self_attack_list_read', 'defense_thanked', 'joke_scalpel_held'] },
      ],

      yes: {
        resultText:
          'Řízl jsi do pózy. Pod ní nebyla odpověď. Jen menší člověk, který se strašně snažil vypadat nezranitelně. Sarkasma zmlkla. To bylo děsivější než její nejlepší hláška.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'item', itemId: 'joke_scalpel' },
          { type: 'flag', flag: 'pose_cut_open' },
          { type: 'schedule', cardId: 'sarkasma_empty_chair_for_pain', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Item · Hlubší sezení',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Odložil jsi skalpel. Sarkasma zvedla obočí. „Rozumné. Nečekané. Trochu mě to uráží.“',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'flag', flag: 'scalpel_refused' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    sarkasma_cut_too_deep: {
      id: 'sarkasma_cut_too_deep',
      title: 'Řez moc hluboko',
      logLabel: 'CUT_TOO_DEEP',
      scene:
        'Vtip se zaryl příliš hluboko. Neodhalil pravdu. Jen rozšířil ránu a tvářil se, že krvácení je důkaz inteligence. Sarkasma sykla: „Ne. Tohle už není přesnost. Tohle je jen pýcha s ostřím.“',
      yesLabel: 'PŘIZNAT PŘEŘEZÁNÍ',
      noLabel: 'TVRDIT, ŽE TO BYLA PRAVDA',
      category: 'crisis',
      sector: 'sarkasma_terminal',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sarkasma_therapy',
      role: 'bill',
      tone: ['tragic', 'horror'],
      tags: ['sarkasma_therapy', 'sarkasma', 'crisis', 'humor', 'overcut'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasAnyFlag', flags: ['defense_smashed', 'diagnosis_folder_stolen', 'joke_scalpel_held'] },
      ],

      yes: {
        resultText:
          'Přiznal jsi přeřezání. Skalpel ztěžkl. Sarkasma přikývla. „Dobře. Konečně ses nesnažil vydávat krutost za upřímnost. Malý krok pro subjekt, obrovská rána pro ego.“',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'imprint', imprintId: 'overcut_warning' },
          { type: 'flag', flag: 'overcut_admitted' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Tvrdil jsi, že to byla pravda. Sarkasma se usmála bez humoru. „Ne. Byla to bolest s dobrým slovníkem.“',
        effects: [
          { type: 'stat', key: 'bond', amount: -8 },
          { type: 'stat', key: 'control', amount: -5 },
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'flag', flag: 'cruelty_called_truth' },
          { type: 'schedule', cardId: 'sarkasma_therapy_rupture', inTurns: 2 },
        ],
        preview: {
          hint: 'Vazba ↓↓ · Kontrola ↓ · Energie ↑ · Ruptura',
          statHints: { bond: 'down', control: 'down', energy: 'up' },
          risk: 'high',
        },
      },
    },

    sarkasma_empty_chair_for_pain: {
      id: 'sarkasma_empty_chair_for_pain',
      title: 'Prázdná židle pro bolest',
      logLabel: 'EMPTY_CHAIR_FOR_PAIN',
      scene:
        'Sarkasma postavila doprostřed místnosti prázdnou židli. „Tady si sedne bolest,“ řekla. „A ty se s ní nebudeš hádat jako s komentářem na internetu. Zkusíme civilizaci. Hrůza, já vím.“',
      yesLabel: 'NECHAT BOLEST SEDNOUT',
      noLabel: 'SEDNOUT SI MÍSTO NÍ',
      category: 'memory',
      sector: 'void',
      rarity: 'rare',
      maxUses: 1,
      packId: 'sarkasma_therapy',
      role: 'twist',
      tone: ['tragic', 'tender'],
      tags: ['sarkasma_therapy', 'memory', 'pain', 'therapy'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasAnyFlag', flags: ['pose_cut_open', 'defense_thanked', 'burnt_defense_held'] },
      ],

      yes: {
        resultText:
          'Nechal jsi bolest sednout. Nebyla větší než ty. Jen hlasitější. Sarkasma se na ni podívala a poprvé neřekla nic ostrého.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'flag', flag: 'pain_given_chair' },
          { type: 'schedule', cardId: 'sarkasma_almost_apologizes', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Kontrola ↑ · Sarkasma měkne',
          statHints: { memory: 'up', bond: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Sedl sis místo ní. Bolest zůstala stát a začala ti radit přes rameno. Výborně. Právě sis najal utrpení jako interního konzultanta.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -5 },
          { type: 'flag', flag: 'pain_displaced' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓',
          statHints: { control: 'up', memory: 'down' },
          risk: 'medium',
        },
      },
    },

    sarkasma_almost_apologizes: {
      id: 'sarkasma_almost_apologizes',
      title: 'Sarkasma se skoro omluví',
      logLabel: 'SARKASMA_ALMOST_APOLOGIZES',
      scene:
        'Sarkasma stojí u prázdné židle a mnou ruce, jako by v nich hledala starší verzi sebe. „Možná jsem tě chránila moc tvrdě,“ řekne. Pak se zatváří, jako by právě spolkla baterii. „Fuj. Emocionální upřímnost. Nechutné.“',
      yesLabel: 'NECHAT TO ZAZNÍT',
      noLabel: 'UDĚLAT Z TOHO VTIP',
      category: 'entity',
      sector: 'sarkasma_terminal',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sarkasma_therapy',
      role: 'escalation',
      tone: ['tender', 'comic', 'tragic'],
      tags: ['sarkasma_therapy', 'sarkasma', 'entity', 'apology', 'tender'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasAnyFlag', flags: ['pain_given_chair', 'unsent_apology_to_self_held'] },
      ],

      yes: {
        resultText:
          'Nechal jsi to zaznít. Sarkasma nevybuchla. Svět taky ne. Podezřelé. Možná některé věty přežijí, i když je nikdo nezabalí do jedu.',
        effects: [
          { type: 'stat', key: 'bond', amount: 7 },
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'item', itemId: 'unsent_apology_to_self' },
          { type: 'flag', flag: 'sarkasma_softened' },
        ],
        preview: {
          hint: 'Vazba ↑↑ · Paměť ↑ · Item',
          statHints: { bond: 'up', memory: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Udělal jsi z toho vtip. Byl dobrý. To bylo skoro horší. Sarkasma se zasmála, ale smích nedošel až k ní.',
        effects: [
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'stat', key: 'bond', amount: -5 },
          { type: 'flag', flag: 'apology_deflected_by_joke' },
          { type: 'schedule', cardId: 'sarkasma_therapy_rupture', inTurns: 3 },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↓ · Ruptura',
          statHints: { energy: 'up', bond: 'down' },
          risk: 'high',
        },
      },
    },

    sarkasma_receipt_for_defense: {
      id: 'sarkasma_receipt_for_defense',
      title: 'Účtenka za obranu',
      logLabel: 'DEFENSE_RECEIPT',
      scene:
        'Účtenka za červenou pohovku se rozbalila sama. Položka první: „pět let předstírané pohody“. Položka druhá: „čtyři tisíce vtipů místo jedné prosby“. Položka třetí je začerněná. Sarkasma ji drží palcem.',
      yesLabel: 'ODSUNOUT JEJÍ PALEC',
      noLabel: 'NECHAT POLOŽKU SKRYTOU',
      category: 'object',
      sector: 'sarkasma_terminal',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sarkasma_therapy',
      role: 'bill',
      tone: ['tragic', 'comic'],
      tags: ['sarkasma_therapy', 'object', 'receipt', 'defense'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasItem', itemId: 'red_couch_receipt' },
      ],

      yes: {
        resultText:
          'Odsunul jsi její palec. Položka třetí: „strach, že bez ironie nezůstane nic“. Sarkasma se nedívala na tebe. Dívala se na účet.',
        effects: [
          { type: 'stat', key: 'memory', amount: 8 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'named_defense' },
          { type: 'flag', flag: 'defense_receipt_read' },
        ],
        preview: {
          hint: 'Paměť ↑↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi položku skrytou. Sarkasma přikývla. „Díky. Ne každá pravda musí přijít jako exekutor v neonovém kabátu.“',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'flag', flag: 'defense_receipt_respected' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Vazba ↑',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    sarkasma_therapy_rupture: {
      id: 'sarkasma_therapy_rupture',
      title: 'Terapeutická ruptura',
      logLabel: 'THERAPY_RUPTURE',
      scene:
        'Místnost praskla. Sarkasma ustoupila do červeného kouře. „Tak jo,“ řekla chladně. „Asi jsme si spletli upřímnost s municí. To se stává. Hlavně lidem. Ti jsou na tohle otravně talentovaní.“',
      yesLabel: 'PŘIZNAT ZBRAŇ',
      noLabel: 'ODEJÍT ZE SEZENÍ',
      category: 'crisis',
      sector: 'sarkasma_terminal',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'sarkasma_therapy',
      role: 'bill',
      tone: ['tragic', 'horror'],
      tags: ['sarkasma_therapy', 'sarkasma', 'crisis', 'rupture'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        { type: 'hasAnyFlag', flags: ['cruelty_called_truth', 'apology_deflected_by_joke'] },
      ],

      yes: {
        resultText:
          'Přiznal jsi zbraň. Sarkasma se zastavila. „Dobře. Když už máš munici, aspoň přestaň střílet do místnosti a tvrdit, že větráš.“',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'bond', amount: 4 },
          { type: 'imprint', imprintId: 'overcut_warning' },
          { type: 'flag', flag: 'therapy_rupture_repaired' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Odešel jsi ze sezení. Dveře tě pustily příliš snadno. Některé útěky mají výborný zákaznický servis, protože počítají s návratem.',
        effects: [
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'stat', key: 'bond', amount: -7 },
          { type: 'moveSector', sectorId: 'void' },
          { type: 'flag', flag: 'therapy_abandoned' },
        ],
        preview: {
          hint: 'Energie ↑ · Vazba ↓↓ · Přesun',
          statHints: { energy: 'up', bond: 'down' },
          risk: 'high',
        },
      },
    },

    sarkasma_cut_that_held: {
      id: 'sarkasma_cut_that_held',
      title: 'Řez, který podržel',
      logLabel: 'CUT_THAT_HELD',
      scene:
        'Sarkasma vzala skalpel vtipu. „Nebudu tě hladit,“ řekla. „Neumím to. Ale můžu řezat tak, abych nebrala víc, než musí pryč.“ Poprvé to neznělo jako výmluva. Spíš jako slib, který se bojí vlastního tvaru.',
      yesLabel: 'DOVOLIT ŘEZ',
      noLabel: 'VZÍT SKALPEL ZPÁTKY',
      category: 'entity',
      sector: 'sarkasma_terminal',
      rarity: 'rare',
      maxUses: 1,
      packId: 'sarkasma_therapy',
      role: 'resolution',
      tone: ['tender', 'tragic'],
      tags: ['sarkasma_therapy', 'sarkasma', 'entity', 'stabilize', 'humor'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_therapy_pool' },
        {
          type: 'hasAnyFlag',
          flags: [
            'overcut_admitted',
            'defense_receipt_read',
            'sarkasma_softened',
            'therapy_rupture_repaired',
          ],
        },
      ],

      yes: {
        resultText:
          'Dovolil jsi řez. Nebyl jemný. Byl přesný. Z rány vyšel starý tlak a za ním věta, kterou jsi nečekal: „Nemusel jsem se nenávidět, abych se změnil.“ Sarkasma se podívala stranou. „No. Konečně něco použitelného.“',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'bond', amount: 5 },
          { type: 'imprint', imprintId: 'cut_that_held' },
          { type: 'flag', flag: 'sarkasma_cut_held' },
          { type: 'unlockPool', poolId: 'sarkasma_aftercare_pool' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Vazba ↑ · Imprint · Unlock',
          statHints: { memory: 'up', control: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Vzal jsi skalpel zpátky. Sarkasma ho pustila. „Dobře. Dneska nebudeš operovaný vlastním cynismem. Medicína pláče, já trochu taky, ale tajně.“',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'kindness_without_sugar' },
          { type: 'flag', flag: 'scalpel_taken_back' },
          { type: 'unlockPool', poolId: 'sarkasma_aftercare_pool' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Vazba ↑ · Imprint · Unlock',
          statHints: { control: 'up', bond: 'up' },
          risk: 'low',
        },
      },
    },

    sarkasma_homework_you_hate: {
      id: 'sarkasma_homework_you_hate',
      title: 'Domácí úkol, který nesnášíš',
      logLabel: 'HOMEWORK_YOU_HATE',
      scene:
        'Sarkasma ti podala papír. Na něm stojí: „Až se příště nazveš katastrofou, napiš jednu konkrétní věc, kterou jsi skutečně udělal. Ne identitu. Skutek.“ Pak dodala: „Ano, je to trapné. Terapie je občas jen účetnictví duše v horším fontu.“',
      yesLabel: 'PŘIJMOUT ÚKOL',
      noLabel: 'SEŽRAT PAPÍR',
      category: 'memory',
      sector: 'sarkasma_terminal',
      rarity: 'rare',
      cooldownTurns: 12,
      packId: 'sarkasma_therapy',
      role: 'echo',
      tone: ['comic', 'tender'],
      tags: ['sarkasma_therapy', 'memory', 'homework', 'aftercare'],
      conditions: [
        { type: 'unlockedPool', poolId: 'sarkasma_aftercare_pool' },
        { type: 'hasAnyFlag', flags: ['sarkasma_cut_held', 'scalpel_taken_back', 'kindness_without_sugar_active'] },
      ],

      yes: {
        resultText:
          'Přijal jsi úkol. Papír nezářil. Nezazněla hudba. Jen se svět o milimetr přestal tvářit, že jsi souhrn svých nejhorších vět.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: 3 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'kindness_without_sugar' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', memory: 'up', bond: 'up' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Sežral jsi papír. Sarkasma chvíli mlčela. „Dobře. Orální fáze odporu. Freud by zatleskal, kdyby nebyl zaměstnaný tím, že je problém.“',
        effects: [
          { type: 'stat', key: 'energy', amount: 5 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'flag', flag: 'homework_eaten' },
        ],
        preview: {
          hint: 'Energie ↑ · Kontrola ↓',
          statHints: { energy: 'up', control: 'down' },
          risk: 'medium',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_sarkasma_therapy',
      poolId: 'sarkasma_therapy_pool',
      condition: { type: 'unlockedPool', poolId: 'sarkasma_pool' },
    },
    {
      id: 'unlock_sarkasma_aftercare',
      poolId: 'sarkasma_aftercare_pool',
      condition: {
        type: 'hasAnyFlag',
        flags: ['sarkasma_cut_held', 'scalpel_taken_back', 'cut_that_held_active'],
      },
    },
  ],

  findings: [
    'sarkasma_therapy_entry',
    'defense_thanked',
    'overcut_admitted',
    'sarkasma_softened',
    'sarkasma_cut_held',
    'homework_accepted',
  ],
};