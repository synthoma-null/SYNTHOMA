import type { CyklusContentPack } from '../contentTypes';

export const brutalBlackboxPack: CyklusContentPack = {
  id: 'brutal_blackbox',
  title: 'Černý box',
  description:
    'Brutalita identity. Systém tě označí za chybný proces, lisuje tě do objektu a z bolesti vyrábí archivní formát. Úleva existuje. Jen většinou stojí jméno.',
  tone: ['brutal', 'horror', 'tragic'],
  sectors: ['void', 'archive', 'form_office'],
  requiresPools: ['brutal_blackbox_pool'],
  unlocksPools: ['brutal_blackbox_pool', 'blackbox_aftermath_pool'],

  items: {
    iron_log: {
      id: 'iron_log',
      title: 'Železný LOG',
      description:
        'Systémová hláška, která spadla na zem a už se nehodlá tvářit jako text. Má hrany. Má názor. Obojí je problém.',
      tags: ['brutal_blackbox', 'object', 'weapon', 'log'],
      passiveEffects: [{ type: 'flag', flag: 'iron_log_held' }],
      triggerCards: ['blackbox_log_blade', 'blackbox_log_splinter', 'blackbox_named_error'],
    },

    patient_label: {
      id: 'patient_label',
      title: 'Štítek pacienta',
      description:
        'Lepí se na možnost být někým, ne na tělo. Když ho strhneš, nebolí kůže. Bolí kategorie.',
      tags: ['brutal_blackbox', 'object', 'identity', 'archive'],
      passiveEffects: [{ type: 'flag', flag: 'patient_label_held' }],
      triggerCards: ['blackbox_index_cage', 'blackbox_unperson_form'],
    },

    blank_face_plate: {
      id: 'blank_face_plate',
      title: 'Prázdná obličejová deska',
      description:
        'Náhradní tvář bez výrazu. Archiv tvrdí, že je univerzální. To je přesně ten problém.',
      tags: ['brutal_blackbox', 'object', 'identity', 'mask'],
      passiveEffects: [{ type: 'flag', flag: 'blank_face_plate_held' }],
      triggerCards: ['blackbox_no_face_archive', 'blackbox_exit_without_face'],
    },
  },

  imprints: {
    named_error: {
      id: 'named_error',
      title: 'Pojmenovaná chyba',
      description:
        'Chyba, která si odmítla nechat vzít tvar. Systém ji nemůže opravit, protože by nejdřív musel uznat, že existuje.',
      tags: ['brutal_blackbox', 'imprint', 'identity', 'resist'],
      passiveEffects: [{ type: 'flag', flag: 'named_error_active' }],
      unlockPool: 'blackbox_aftermath_pool',
    },

    blackbox_scar: {
      id: 'blackbox_scar',
      title: 'Jizva Černého boxu',
      description:
        'Systém tě lisoval. Zůstala jizva, která se tváří jako adresa. Když ji čteš pozpátku, není to místo. Je to varování.',
      tags: ['brutal_blackbox', 'imprint', 'scar', 'memory'],
      passiveEffects: [{ type: 'flag', flag: 'blackbox_scar_active' }],
      unlockPool: 'blackbox_aftermath_pool',
    },

    unfiled_self: {
      id: 'unfiled_self',
      title: 'Nezařazené já',
      description:
        'Fragment identity, který Archiv nedokázal uložit. Ne proto, že by byl čistý. Protože odmítl mít správný formulář.',
      tags: ['brutal_blackbox', 'imprint', 'identity', 'archive'],
      passiveEffects: [{ type: 'flag', flag: 'unfiled_self_active' }],
    },
  },

  cards: {
    blackbox_patient_label: {
      id: 'blackbox_patient_label',
      title: 'Štítek pacienta',
      logLabel: 'PATIENT_LABEL',
      scene:
        'Na tvém hrudníku se objeví štítek. Nelepí se na tělo. Lepí se na možnost být někým. V rohu bliká kurzor a čeká, jestli se necháš zjednodušit.',
      yesLabel: 'STRHNOUT HO',
      noLabel: 'PŘEČÍST ČÍSLO',
      category: 'crisis',
      sector: 'void',
      rarity: 'common',
      once: true,
      packId: 'brutal_blackbox',
      role: 'entry',
      tone: ['brutal', 'horror'],
      tags: ['brutal_blackbox', 'crisis', 'identity', 'blackbox', 'entry'],
      conditions: [{ type: 'unlockedPool', poolId: 'brutal_blackbox_pool' }],

      yes: {
        resultText:
          'Strhnul jsi ho. Kůže zůstala, ale identita krvácela. Systém si poznamenal, že subjekt reaguje nepřiměřeně na administrativní péči. Jaká tragédie pro formuláře.',
        effects: [
          { type: 'stat', key: 'energy', amount: -8 },
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'item', itemId: 'patient_label' },
          { type: 'flag', flag: 'patient_label_torn' },
          { type: 'flag', flag: 'blackbox_entered' },
        ],
        preview: {
          hint: 'Energie ↓↓ · Kontrola ↑ · Item',
          statHints: { energy: 'down', control: 'up' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Přečetl jsi číslo. Systém si tě zařadil. Ne správně. Jen dostatečně, aby mohl pokračovat v násilí s lepší typografií.',
        effects: [
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'flag', flag: 'blackbox_indexed' },
          { type: 'flag', flag: 'blackbox_entered' },
          { type: 'schedule', cardId: 'blackbox_index_cage', inTurns: 2 },
        ],
        preview: {
          hint: 'Paměť ↓ · Kontrola ↑ · Následek',
          statHints: { memory: 'down', control: 'up' },
          risk: 'medium',
        },
      },
    },

    blackbox_press: {
      id: 'blackbox_press',
      title: 'Lis na vědomí',
      logLabel: 'CONSCIOUSNESS_PRESS',
      scene:
        'Místnost nemá stěny. Jen tlak. LOG spadl na zem jako železná deska a začal pomalu klesat. Nahoře je vyraženo: SUBJEKT JE NADBYTEČNÁ VRSTVA.',
      yesLabel: 'PODEPŘÍT JI JMÉNEM',
      noLabel: 'NECHAT JI PROJÍT SKRZ',
      category: 'crisis',
      sector: 'void',
      rarity: 'common',
      cooldownTurns: 8,
      packId: 'brutal_blackbox',
      role: 'escalation',
      tone: ['brutal', 'horror'],
      tags: ['brutal_blackbox', 'crisis', 'identity', 'blackbox', 'log'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        { type: 'hasAnyFlag', flags: ['blackbox_entered', 'patient_label_torn', 'blackbox_indexed'] },
      ],

      yes: {
        resultText:
          'Podepřel jsi ji jménem, které ještě nemáš celé. LOG se ohýbal, ale nezlomil. Některé věty drží svět pohromadě jen proto, že se je někdo bojí vyslovit.',
        effects: [
          { type: 'stat', key: 'control', amount: 7 },
          { type: 'stat', key: 'energy', amount: -10 },
          { type: 'item', itemId: 'iron_log' },
          { type: 'flag', flag: 'press_resisted' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Energie ↓↓ · Item',
          statHints: { control: 'up', energy: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Deska neprošla skrz. Ty jsi prošel. Chvíli ses skládal z vrstev, které už se neptaly, kam patří. Komfortní? Ne. Účinné? Bohužel.',
        effects: [
          { type: 'stat', key: 'memory', amount: -7 },
          { type: 'stat', key: 'bond', amount: -5 },
          { type: 'stat', key: 'energy', amount: 6 },
          { type: 'flag', flag: 'press_passed_through' },
          { type: 'schedule', cardId: 'blackbox_no_face_archive', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↓ · Vazba ↓ · Energie ↑ · Následek',
          statHints: { memory: 'down', bond: 'down', energy: 'up' },
          risk: 'high',
        },
      },
    },

    blackbox_no_face_archive: {
      id: 'blackbox_no_face_archive',
      title: 'Archiv bez tváře',
      logLabel: 'NO_FACE_ARCHIVE',
      scene:
        'Archiváři našli způsob, jak tě uložit bez tebe. Police se otevřely a každá měla přesně tvůj tvar, jen bez odporu. Systém tomu říká optimalizace. Proto systém nikdo nezve na oslavy.',
      yesLabel: 'ROZBÍT KATALOG',
      noLabel: 'SCHOVAT SE V INDEXU',
      category: 'crisis',
      sector: 'archive',
      rarity: 'uncommon',
      cooldownTurns: 10,
      packId: 'brutal_blackbox',
      role: 'escalation',
      tone: ['brutal', 'horror'],
      tags: ['brutal_blackbox', 'crisis', 'archive', 'identity'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        { type: 'hasAnyFlag', flags: ['blackbox_entered', 'press_passed_through', 'blank_face_plate_held'] },
      ],

      yes: {
        resultText:
          'Rozbil jsi katalog. Stránky s tebou bez tebe se rozletěly. Některé se ještě snažily být dokumentací. Bylo to skoro dojemné. Skoro.',
        effects: [
          { type: 'stat', key: 'energy', amount: -8 },
          { type: 'stat', key: 'control', amount: 8 },
          { type: 'entityRelation', entity: 'archive', delta: -1 },
          { type: 'flag', flag: 'catalog_broken' },
          { type: 'imprint', imprintId: 'unfiled_self' },
        ],
        preview: {
          hint: 'Energie ↓ · Kontrola ↑↑ · Archiv ↓ · Imprint',
          statHints: { energy: 'down', control: 'up' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Schoval ses v indexu. Byl jsi tam, ale ne jako subjekt. Jako odkaz. Jako položka. Jako něco, co může někdo najít, aniž by se musel ptát, jestli to ještě bolí.',
        effects: [
          { type: 'stat', key: 'memory', amount: -8 },
          { type: 'stat', key: 'bond', amount: -5 },
          { type: 'item', itemId: 'blank_face_plate' },
          { type: 'flag', flag: 'index_hidden' },
        ],
        preview: {
          hint: 'Paměť ↓↓ · Vazba ↓ · Item',
          statHints: { memory: 'down', bond: 'down' },
          risk: 'high',
        },
      },
    },

    blackbox_index_cage: {
      id: 'blackbox_index_cage',
      title: 'Klec indexu',
      logLabel: 'INDEX_CAGE',
      scene:
        'Index tě drží jako chybný záznam. Když se pohneš, posune se celá kategorie. Archiváři se tváří uraženě, protože nic neděsí byrokracii víc než živá položka.',
      yesLabel: 'POSUNOUT KATEGORII',
      noLabel: 'ZŮSTAT CHYBOU',
      category: 'crisis',
      sector: 'archive',
      rarity: 'uncommon',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'brutal_blackbox',
      role: 'twist',
      tone: ['brutal', 'horror'],
      tags: ['brutal_blackbox', 'crisis', 'identity', 'archive', 'blackbox'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        { type: 'hasAnyFlag', flags: ['blackbox_indexed', 'index_hidden', 'patient_label_held'] },
      ],

      yes: {
        resultText:
          'Posunul jsi kategorii. Systém musel přepsat definici chyby. Krátce to znělo jako zemětřesení v účetnictví utrpení.',
        effects: [
          { type: 'stat', key: 'control', amount: 8 },
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'entityRelation', entity: 'archive', delta: 1 },
          { type: 'flag', flag: 'category_shifted' },
          { type: 'schedule', cardId: 'blackbox_unperson_form', inTurns: 2 },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Paměť ↓ · Následek',
          statHints: { control: 'up', memory: 'down' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Zůstal jsi chybou. Klec se stala tvým jménem. Nebylo to vítězství, ale systém najednou nevěděl, jestli tě má opravit, nebo oslovit.',
        effects: [
          { type: 'stat', key: 'bond', amount: -6 },
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'imprint', imprintId: 'named_error' },
          { type: 'flag', flag: 'error_kept_shape' },
        ],
        preview: {
          hint: 'Vazba ↓ · Paměť ↓ · Imprint',
          statHints: { bond: 'down', memory: 'down' },
          risk: 'high',
        },
      },
    },

    blackbox_log_blade: {
      id: 'blackbox_log_blade',
      title: 'LOG jako čepel',
      logLabel: 'LOG_BLADE',
      scene:
        'Systémová hláška se zatřpytila ostrými okraji. Není to chyba. Je to rozsudek. Na čepeli bliká: CTRL+Z NEDOSTUPNÉ. DŮVOD: TOHLE JSI NEUDĚLAL JEN TY.',
      yesLabel: 'CHYTIT ZA RUKOJEŤ',
      noLabel: 'ODVRÁTIT ZRAK',
      category: 'crisis',
      sector: 'void',
      rarity: 'uncommon',
      cooldownTurns: 8,
      packId: 'brutal_blackbox',
      role: 'object',
      tone: ['brutal', 'horror'],
      tags: ['brutal_blackbox', 'crisis', 'weapon', 'blackbox', 'log'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        { type: 'hasAnyFlag', flags: ['press_resisted', 'iron_log_held', 'blackbox_entered'] },
      ],

      yes: {
        resultText:
          'Chytl jsi LOG. Řezal do ruky, ale zůstal v tvé moci. Poprvé systémová věta krvácela z druhé strany.',
        effects: [
          { type: 'stat', key: 'energy', amount: -10 },
          { type: 'stat', key: 'control', amount: 8 },
          { type: 'item', itemId: 'iron_log' },
          { type: 'flag', flag: 'log_blade_taken' },
        ],
        preview: {
          hint: 'Energie ↓↓ · Kontrola ↑ · Item',
          statHints: { energy: 'down', control: 'up' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Odvrátil jsi zrak. LOG tě neřezal, ale zapsal si to. Některé čepele nepotřebují krev. Stačí jim budoucí výčitka.',
        effects: [
          { type: 'stat', key: 'memory', amount: -6 },
          { type: 'stat', key: 'control', amount: -4 },
          { type: 'flag', flag: 'log_looked_away' },
          { type: 'schedule', cardId: 'blackbox_log_splinter', inTurns: 4 },
        ],
        preview: {
          hint: 'Paměť ↓ · Kontrola ↓ · Následek',
          statHints: { memory: 'down', control: 'down' },
          risk: 'high',
        },
      },
    },

    blackbox_log_splinter: {
      id: 'blackbox_log_splinter',
      title: 'Tříska LOGu',
      logLabel: 'LOG_SPLINTER',
      scene:
        'Kus systémové hlášky ti zůstal pod kůží reality. Pokaždé, když si řekneš „to nic nebylo“, tříska se pohne. Takže výborně, máš interní notifikaci bolesti.',
      yesLabel: 'VYTÁHNOUT JI',
      noLabel: 'NECHAT JI TAM',
      category: 'memory',
      sector: 'void',
      rarity: 'rare',
      triggerMode: 'both',
      maxUses: 1,
      packId: 'brutal_blackbox',
      role: 'echo',
      tone: ['brutal', 'tragic'],
      tags: ['brutal_blackbox', 'memory', 'log', 'scar'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        { type: 'hasAnyFlag', flags: ['log_looked_away', 'iron_log_held', 'log_blade_taken'] },
      ],

      yes: {
        resultText:
          'Vytáhl jsi ji. Vyšla s ní i věta, kterou systém chtěl nechat v tobě: „Subjekt nevyhovuje formátu.“ Konečně něco užitečného z dokumentace.',
        effects: [
          { type: 'stat', key: 'memory', amount: 7 },
          { type: 'stat', key: 'control', amount: 4 },
          { type: 'imprint', imprintId: 'named_error' },
          { type: 'flag', flag: 'log_splinter_removed' },
        ],
        preview: {
          hint: 'Paměť ↑ · Kontrola ↑ · Imprint',
          statHints: { memory: 'up', control: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Nechal jsi ji tam. Bolest se stala orientačním bodem. Není to zdravé. Ale v SYNTHOMĚ je zdraví spíš marketingová kategorie.',
        effects: [
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'stat', key: 'bond', amount: -4 },
          { type: 'imprint', imprintId: 'blackbox_scar' },
          { type: 'flag', flag: 'log_splinter_kept' },
        ],
        preview: {
          hint: 'Paměť ↓ · Vazba ↓ · Imprint',
          statHints: { memory: 'down', bond: 'down' },
          risk: 'high',
        },
      },
    },

    blackbox_unperson_form: {
      id: 'blackbox_unperson_form',
      title: 'Formulář ne-osoby',
      logLabel: 'UNPERSON_FORM',
      scene:
        'Formulářovna poslala formulář. Kolonka JMÉNO je předvyplněná slovem NEVYŽADOVÁNO. Kolonka SOUHLAS je už zaškrtnutá. Demokracie administrativního násilí, krásný vynález, civilizace se musí plácat po zádech.',
      yesLabel: 'PODEPSAT',
      noLabel: 'PŘEPSAT KOLONKU JMÉNO',
      category: 'trap',
      sector: 'form_office',
      rarity: 'rare',
      maxUses: 1,
      packId: 'brutal_blackbox',
      role: 'bill',
      tone: ['brutal', 'horror', 'tragic'],
      tags: ['brutal_blackbox', 'form', 'office', 'identity', 'trap'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        { type: 'hasAnyFlag', flags: ['category_shifted', 'patient_label_held', 'blackbox_indexed'] },
      ],

      yes: {
        resultText:
          'Podepsal jsi. Úleva přišla okamžitě. Pak odešla i část toho, kdo si měl ulevit. Systém tomu říká úspěšné snížení zátěže.',
        effects: [
          { type: 'stat', key: 'memory', amount: -12 },
          { type: 'stat', key: 'bond', amount: -7 },
          { type: 'stat', key: 'energy', amount: 8 },
          { type: 'flag', flag: 'unperson_form_signed' },
          { type: 'schedule', cardId: 'blackbox_refuse_anonymization', inTurns: 3 },
        ],
        preview: {
          hint: 'Paměť ↓↓ · Vazba ↓↓ · Energie ↑ · Následek',
          statHints: { memory: 'down', bond: 'down', energy: 'up' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Přepsal jsi kolonku JMÉNO. Formulář zasyčel, jako bys mu nalil člověka do tabulky. Odporné. Krásné.',
        effects: [
          { type: 'stat', key: 'control', amount: 8 },
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'imprint', imprintId: 'unfiled_self' },
          { type: 'flag', flag: 'name_field_rewritten' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Paměť ↑ · Imprint',
          statHints: { control: 'up', memory: 'up' },
          risk: 'medium',
        },
      },
    },

    blackbox_named_error: {
      id: 'blackbox_named_error',
      title: 'Pojmenovaná chyba',
      logLabel: 'NAMED_ERROR',
      scene:
        'Systém tě označil za chybu. Ale ty jsi chybě dal jméno. To ho znervózňuje. Chyba bez jména je incident. Chyba se jménem je svědek.',
      yesLabel: 'PŘIJMOUT JMÉNO',
      noLabel: 'ODMÍTNOUT ZAŘAZENÍ',
      category: 'crisis',
      sector: 'void',
      rarity: 'rare',
      maxUses: 1,
      packId: 'brutal_blackbox',
      role: 'resolution',
      tone: ['brutal', 'horror', 'tragic'],
      tags: ['brutal_blackbox', 'crisis', 'identity', 'stabilize', 'resolution'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        {
          type: 'hasAnyFlag',
          flags: [
            'error_kept_shape',
            'log_blade_taken',
            'log_splinter_removed',
            'name_field_rewritten',
            'catalog_broken',
          ],
        },
      ],

      yes: {
        resultText:
          'Přijal jsi jméno. Chyba se stala osobou. Systém couvl. Ne ze soucitu. Z nekompatibility.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'named_error' },
          { type: 'flag', flag: 'named_error_claimed' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { control: 'up', memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Odmítl jsi zařazení. Systém tě zařadil do „čeká na znovuzařazení“. Úžasné. I vzpoura dostala šanon.',
        effects: [
          { type: 'stat', key: 'bond', amount: -6 },
          { type: 'stat', key: 'energy', amount: -6 },
          { type: 'flag', flag: 'blackbox_pending' },
          { type: 'schedule', cardId: 'blackbox_refuse_anonymization', inTurns: 2 },
        ],
        preview: {
          hint: 'Vazba ↓ · Energie ↓ · Následek',
          statHints: { bond: 'down', energy: 'down' },
          risk: 'high',
        },
      },
    },

    blackbox_refuse_anonymization: {
      id: 'blackbox_refuse_anonymization',
      title: 'Odmítnout anonymizaci',
      logLabel: 'REFUSE_ANONYMIZATION',
      scene:
        'Systém ti nabízí zapomenutí jako lék. Zapomeneš bolest, jméno, odpor i to, že ti někdo něco vzal. Na obrazovce bliká: DOPORUČENÁ ÚLEVA. To je obvykle chvíle, kdy by rozumný člověk začal utíkat.',
      yesLabel: 'VZÍT LÉK',
      noLabel: 'ZACHOVAT JMÉNO',
      category: 'crisis',
      sector: 'void',
      rarity: 'rare',
      maxUses: 1,
      packId: 'brutal_blackbox',
      role: 'resolution',
      tone: ['brutal', 'tragic', 'horror'],
      tags: ['brutal_blackbox', 'crisis', 'identity', 'stabilize', 'resolution'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['blackbox_pending', 'unperson_form_signed', 'named_error_claimed', 'blackbox_indexed'],
        },
      ],

      yes: {
        resultText:
          'Vzal jsi lék. Bolest odešla. Jméno taky. Chvíli bylo ticho. Pak ticho začalo odpovídat místo tebe.',
        effects: [
          { type: 'stat', key: 'memory', amount: -12 },
          { type: 'stat', key: 'bond', amount: -7 },
          { type: 'stat', key: 'energy', amount: 8 },
          { type: 'flag', flag: 'anonymization_taken' },
          { type: 'item', itemId: 'blank_face_plate' },
        ],
        preview: {
          hint: 'Paměť ↓↓ · Vazba ↓↓ · Energie ↑ · Item',
          statHints: { memory: 'down', bond: 'down', energy: 'up' },
          risk: 'high',
        },
      },

      no: {
        resultText:
          'Zachoval jsi jméno. Systém tě označil za neopravitelný. Byl to kompliment, i když ho vyslovil stroj s empatií kancelářské skartovačky.',
        effects: [
          { type: 'stat', key: 'control', amount: 8 },
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'energy', amount: -4 },
          { type: 'imprint', imprintId: 'blackbox_scar' },
          { type: 'flag', flag: 'anonymization_refused' },
          { type: 'unlockPool', poolId: 'blackbox_aftermath_pool' },
        ],
        preview: {
          hint: 'Kontrola ↑↑ · Paměť ↑ · Energie ↓ · Imprint',
          statHints: { control: 'up', memory: 'up', energy: 'down' },
          risk: 'medium',
        },
      },
    },

    blackbox_exit_without_face: {
      id: 'blackbox_exit_without_face',
      title: 'Východ bez tváře',
      logLabel: 'EXIT_NO_FACE',
      scene:
        'Dveře ven nechtějí, abys věděl, kdo jde. Jenže ty to víš. Nebo aspoň víš, že odmítáš být nesen ven jako anonymní balík poškozené psychiky.',
      yesLabel: 'JÍT BEZ OHLÉDNUTÍ',
      noLabel: 'NEJPRVE SE PODÍVAT',
      category: 'path',
      sector: 'void',
      rarity: 'rare',
      maxUses: 1,
      packId: 'brutal_blackbox',
      role: 'echo',
      tone: ['brutal', 'horror', 'tragic'],
      tags: ['brutal_blackbox', 'path', 'identity', 'stabilize', 'echo'],
      conditions: [
        { type: 'unlockedPool', poolId: 'brutal_blackbox_pool' },
        {
          type: 'hasAnyFlag',
          flags: ['named_error_claimed', 'anonymization_refused', 'blackbox_scar_active', 'blank_face_plate_held'],
        },
      ],

      yes: {
        resultText:
          'Šel jsi. Dveře se zavřely. Za nimi byla Prázdnota, ale byla tvoje. Ne čistá. Ne bezpečná. Tvoje.',
        effects: [
          { type: 'stat', key: 'control', amount: 6 },
          { type: 'stat', key: 'memory', amount: 4 },
          { type: 'moveSector', sectorId: 'void' },
          { type: 'flag', flag: 'blackbox_exited' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↑ · Přesun',
          statHints: { control: 'up', memory: 'up' },
          risk: 'medium',
        },
      },

      no: {
        resultText:
          'Podíval ses. Dveře se styděly za svou prázdnotu. Na okamžik jsi v nich zahlédl obličej. Nebyl celý. Ale necouval.',
        effects: [
          { type: 'stat', key: 'memory', amount: 6 },
          { type: 'stat', key: 'energy', amount: -4 },
          { type: 'imprint', imprintId: 'blackbox_scar' },
          { type: 'flag', flag: 'blackbox_looked_back' },
        ],
        preview: {
          hint: 'Paměť ↑ · Energie ↓ · Imprint',
          statHints: { memory: 'up', energy: 'down' },
          risk: 'medium',
        },
      },
    },

    blackbox_afterimage: {
      id: 'blackbox_afterimage',
      title: 'Dozvuk Černého boxu',
      logLabel: 'BLACKBOX_AFTERIMAGE',
      scene:
        'Po Černém boxu zůstalo ve vzduchu místo ve tvaru tebe. Archiv se ho pokusil vyplnit standardní šablonou. Šablona se rozpadla nudou.',
      yesLabel: 'NECHAT MÍSTO PRÁZDNÉ',
      noLabel: 'VLOŽIT TAM CHYBU',
      category: 'memory',
      sector: 'void',
      rarity: 'rare',
      cooldownTurns: 12,
      packId: 'brutal_blackbox',
      role: 'echo',
      tone: ['brutal', 'tragic'],
      tags: ['brutal_blackbox', 'memory', 'aftermath', 'echo'],
      conditions: [{ type: 'unlockedPool', poolId: 'blackbox_aftermath_pool' }],

      yes: {
        resultText:
          'Nechal jsi místo prázdné. Poprvé prázdnota nepůsobila jako absence, ale jako prostor, kam se nesmí cpát cizí definice.',
        effects: [
          { type: 'stat', key: 'control', amount: 5 },
          { type: 'stat', key: 'memory', amount: -4 },
          { type: 'flag', flag: 'blackbox_empty_space_kept' },
        ],
        preview: {
          hint: 'Kontrola ↑ · Paměť ↓',
          statHints: { control: 'up', memory: 'down' },
          risk: 'low',
        },
      },

      no: {
        resultText:
          'Vložil jsi tam chybu. Ne proto, aby tě opravila. Aby systém musel přiznat, že jeho šablona nestačí.',
        effects: [
          { type: 'stat', key: 'memory', amount: 5 },
          { type: 'stat', key: 'bond', amount: 3 },
          { type: 'imprint', imprintId: 'named_error' },
        ],
        preview: {
          hint: 'Paměť ↑ · Vazba ↑ · Imprint',
          statHints: { memory: 'up', bond: 'up' },
          risk: 'medium',
        },
      },
    },
  },

  unlocks: [
    {
      id: 'unlock_brutal_blackbox',
      poolId: 'brutal_blackbox_pool',
      condition: { type: 'unlockedPool', poolId: 'memory_sandbox_pool' },
    },
    {
      id: 'unlock_blackbox_aftermath',
      poolId: 'blackbox_aftermath_pool',
      condition: { type: 'hasAnyFlag', flags: ['anonymization_refused', 'named_error_claimed'] },
    },
  ],

  findings: ['brutal_blackbox_entry', 'named_error_claimed', 'anonymization_refused'],
};