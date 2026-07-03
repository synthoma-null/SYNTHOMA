import type { EnemyDefinition } from './encounterTypes';

// ── 6 enemies ─────────────────────────────────────────────────────────────────

export const ENEMIES: Record<string, EnemyDefinition> = {
  'sumovy-bezec': {
    id: 'sumovy-bezec',
    name: 'Šumový běžec',
    maxHp: 14,
    intents: [
      {
        id: 'utok-sum',
        type: 'attack',
        label: 'ÚTOK 5 + 1 Šum',
        damage: 5,
        noiseAmount: 1,
        description: 'Způsobí 5 poškození a přidá 1 Šum.',
      },
      {
        id: 'sprint',
        type: 'sprint',
        label: 'SPRINT — ÚTOK 3 + 3',
        damage: 3,
        description: 'Způsobí útok dvakrát.',
      },
    ],
    aggressiveIntents: [
      {
        id: 'utok-sum-plus',
        type: 'attack',
        label: 'ÚTOK 7 + 2 Šum',
        damage: 7,
        noiseAmount: 2,
        description: 'Agresivní varianta při Void ≥ 6.',
        voidPressureThreshold: 6,
      },
    ],
    text: {
      intro: [
        'Ze stěny se odlepila postava. Nejdřív to vypadalo jako člověk. Pak jako chyba. Pak jako člověk, který chybu povýšil na kariérní směr.',
        'Šumový běžec se rozběhl z místa, kde by normální bytost nejprve přemýšlela. To ho odlišuje od normálních bytostí.',
      ],
      hit: [
        'Zásah ho rozmazal do tří chybných snímků. Jeden snímek se tvářil uraženě.',
        'Šumový běžec zavrávoral. V jeho datech to udělalo zvuk, který databáze odmítla zaznamenat.',
        'Poškození přijato. Systém to označil jako „strukturální rekonfiguraci".',
      ],
      death: [
        'Šumový běžec se rozpadl na čisté ticho. Pak na formulář. Pak na nic. Pořadí bylo podivné.',
        'Šum se rozptýlil. Systém to zaznamenal jako „přirozenou dekompresi subjektu".',
      ],
    },
    tags: ['noise', 'fast', 'common'],
  },

  'archivni-chyba': {
    id: 'archivni-chyba',
    name: 'Archivní chyba',
    maxHp: 12,
    intents: [
      {
        id: 'zamknout-kartu',
        type: 'lock_card',
        label: 'ZAMKNOUT KARTU',
        description: 'Zamkne jednu kartu v ruce hráče na 1 kolo.',
      },
      {
        id: 'utok-archivni',
        type: 'attack',
        label: 'ÚTOK 4',
        damage: 4,
        description: 'Způsobí 4 poškození.',
      },
    ],
    aggressiveIntents: [
      {
        id: 'zamknout-dve-karty',
        type: 'lock_card',
        label: 'ZAMKNOUT 2 KARTY',
        description: 'Zamkne dvě karty při Void ≥ 6.',
        voidPressureThreshold: 6,
      },
    ],
    text: {
      intro: [
        'Archivní chyba nepřijde bojovat. Přijde dokumentovat. To je horší.',
        'Entita bez těla. Jen data, která se rozhodla nebýt správná a dělají z toho osobní problém.',
      ],
      hit: [
        'Část archivu se rozpadla. Systém to považuje za „nevědecký postup".',
        'Poškození. Archivní chyba si to zapíše, ale špatně.',
        'Zásah prošel skrz strukturu, která by neměla existovat. Teď existuje méně.',
      ],
      death: [
        'Archivní chyba zmizela ze záznamu. Záznamy si toho nevšimly, protože záznamy ji nikdy nevedly správně.',
        'Systém označil entitu jako „vyřešenou anomálii". Nikomu neřekl, jak.',
      ],
    },
    tags: ['archive', 'control', 'common'],
  },

  'acidova-larva': {
    id: 'acidova-larva',
    name: 'Acidová larva',
    maxHp: 10,
    intents: [
      {
        id: 'dot-sum',
        type: 'attack_dot',
        label: 'DOT 2 Šum / 3 kola',
        noiseAmount: 2,
        dotTurns: 3,
        description: 'Přidá 2 Šum každé kolo po dobu 3 kol.',
      },
      {
        id: 'utok-acid',
        type: 'attack',
        label: 'ÚTOK 3',
        damage: 3,
        description: 'Způsobí 3 poškození.',
      },
    ],
    aggressiveIntents: [
      {
        id: 'dot-sum-plus',
        type: 'attack_dot',
        label: 'DOT 3 Šum / 3 kola',
        noiseAmount: 3,
        dotTurns: 3,
        description: 'Intenzivní varianta při Void ≥ 6.',
        voidPressureThreshold: 6,
      },
    ],
    text: {
      intro: [
        'Acidová larva vypadá nevinně. Většina věcí, které ti ubližují pomalu, vypadají nevinně.',
        'Malá. Průhledná. Nechte ji být a bude vás pomalu přepisovat Šumem, dokud to nestojí za zmínku.',
      ],
      hit: [
        'Larva reagovala způsobem, který se těžko popisuje biologicky.',
        'Zásah zasáhl. Larva se smrštila a pak méně smrštila.',
        'Poškození způsobeno. Larva to zaznamenala jako urážku a přidala do fronty.',
      ],
      death: [
        'Acidová larva přestala existovat. Šum, který zanechala, existovat nepřestala.',
        'Entita neutralizována. Šumový efekt přetrvává ještě chvíli, protože důsledky jsou vždy zdvořilejší než příčiny.',
      ],
    },
    tags: ['acid', 'dot', 'common'],
  },

  'formularovy-dozorce': {
    id: 'formularovy-dozorce',
    name: 'Formulářový dozorce',
    maxHp: 18,
    armor: 2,
    intents: [
      {
        id: 'audit',
        type: 'audit',
        label: 'AUDIT — POVINNÁ VOLBA',
        description: 'Vyžaduje odpověď hráče. Špatná odpověď přidá Šum.',
      },
      {
        id: 'utok-dozorce',
        type: 'attack',
        label: 'ÚTOK 6',
        damage: 6,
        description: 'Způsobí 6 poškození.',
      },
    ],
    aggressiveIntents: [
      {
        id: 'audit-plus',
        type: 'audit',
        label: 'HROMADNÝ AUDIT',
        description: 'Dvě povinné volby najednou při Void ≥ 11.',
        voidPressureThreshold: 11,
      },
    ],
    text: {
      intro: [
        'Formulářový dozorce přišel zkontrolovat dokumentaci. Nemáš dokumentaci. To ho nezajímá — přišel stejně.',
        'Nese zásobník formulářů, které nikdo nevyplnil správně. Ty jsi mezi nimi. Ví o tobě.',
      ],
      hit: [
        'Dozorce zaznamenal poškození do formuláře B-447. Formulář B-447 neexistuje.',
        'Přijal útok, ale poznamenal si ho jako „neautorizovaný kontakt". Řeší se to jindy.',
        'Zásah. Dozorce je rozhořčen, ale profesionálně.',
      ],
      death: [
        'Formulářový dozorce padl. Zásobník formulářů zůstal. Formuláře jsou nezničitelné — to je podstata problému.',
        'Systém oznámil konec entity. Pak přišel jiný formulář. Pak jiný. Systém neví, kdy přestat.',
      ],
    },
    tags: ['bureaucracy', 'tough', 'elite'],
  },

  'pametova-selma': {
    id: 'pametova-selma',
    name: 'Paměťová šelma',
    maxHp: 20,
    intents: [
      {
        id: 'ukrast-smich',
        type: 'steal_laugh',
        label: 'UKRÁST SMÍCH 3',
        description: 'Ukradne 3 Smích hráče.',
      },
      {
        id: 'aoe',
        type: 'aoe',
        label: 'AOE ÚTOK 4',
        damage: 4,
        description: 'Útok na všechny hráče (v coop) nebo silnější útok v solo.',
      },
    ],
    aggressiveIntents: [
      {
        id: 'ukrast-smich-plus',
        type: 'steal_laugh',
        label: 'UKRÁST SMÍCH 5 + ÚTOK 3',
        damage: 3,
        description: 'Kombinovaný záměr při Void ≥ 11.',
        voidPressureThreshold: 11,
      },
    ],
    text: {
      intro: [
        'Paměťová šelma není z tohoto sektoru. Je z vrstev pod ním, kde se ukládají věci, na které se zapomnělo.',
        'Velká. Mlčenlivá. Pohybuje se, jako by pamatovala každý omyl, který jsi kdy udělal. A ty víš, že to tak je.',
      ],
      hit: [
        'Šelma zavrávoral, ale pomalu. Vzpomínky absorbují více poškození než realita.',
        'Zásah. Paměťová šelma si ho zaznamenala — přidala ho ke všem ostatním.',
        'Poškození přijato. Šelma tě k sobě trochu přitáhla. Nejsi si jistý proč.',
      ],
      death: [
        'Paměťová šelma se rozpadla na fragmenty, které se vrátily tam, odkud přišly. Kam to bylo, nikdo neřekl.',
        'Šelma zmizela. Smích, který ti vzala, se vrátil. Trochu jiný.',
      ],
    },
    tags: ['memory', 'laugh', 'elite'],
  },

  'zrcadlovy-subjekt': {
    id: 'zrcadlovy-subjekt',
    name: 'Zrcadlový subjekt',
    maxHp: 15,
    intents: [
      {
        id: 'mirror',
        type: 'mirror',
        label: 'ZRCADLO — KOPIE AKCE',
        description: 'Zkopíruje poslední akci hráče s menším efektem.',
      },
      {
        id: 'utok-zrcadlo',
        type: 'attack',
        label: 'ÚTOK 5',
        damage: 5,
        description: 'Způsobí 5 poškození.',
      },
    ],
    aggressiveIntents: [
      {
        id: 'mirror-plus',
        type: 'mirror',
        label: 'DOKONALÉ ZRCADLO',
        description: 'Zkopíruje akci beze ztráty efektu při Void ≥ 11.',
        voidPressureThreshold: 11,
      },
    ],
    text: {
      intro: [
        'Zrcadlový subjekt existuje proto, aby připomínal, že na každou akci existuje reakce. Hlavně ta špatná.',
        'Vypadá jako ty. Není jako ty. Je jako verze tebe, která neměla šanci se rozhodnout jinak.',
      ],
      hit: [
        'Zrcadlový subjekt přijal poškození a zároveň ho vrátil. Polovina. Systém to označil jako „symetrický paradox".',
        'Zasáhl jsi svůj vlastní odraz. To bys nedělal, kdybys měl čas přemýšlet.',
        'Zásah. Subjekt se nakrátko rozmazal, pak se znovu sestavil — trochu jinak než předtím.',
      ],
      death: [
        'Zrcadlový subjekt se rozpadl na dvě půlky. Obě půlky zmizely různými směry. Systém to uzavřel jako „duplicitní výstup".',
        'Konec. Zrcadlo je rozbité. Pověra o smůle tě v tomhle sektoru nijak nepřekvapí.',
      ],
    },
    tags: ['mirror', 'tricky', 'elite'],
  },

  'nekonecny-formular': {
    id: 'nekonecny-formular',
    name: 'Nekonečný Formulář',
    maxHp: 60,
    armor: 2,
    isBoss: true,
    intents: [
      {
        id: 'audit-basic',
        type: 'audit',
        label: 'AUDIT — PŘEDBĚŽNÁ KONTROLA',
        description: 'Zamkne jednu kartu. Hráč musí odpovědět na volbu.',
      },
      {
        id: 'utok-formular-1',
        type: 'attack',
        label: 'ÚTOK 4 — NEAUTORIZOVANÝ KONTAKT',
        damage: 4,
        description: 'Způsobí 4 poškození.',
      },
    ],
    aggressiveIntents: [
      {
        id: 'audit-aggressive',
        type: 'audit',
        label: 'HROMADNÝ AUDIT',
        description: 'Zamkne dvě karty, přidá 2 Šum. Void ≥ 6.',
        voidPressureThreshold: 6,
      },
      {
        id: 'utok-formular-heavy',
        type: 'attack',
        label: 'ÚTOK 8 — VYMÁHÁNÍ SOUČINNOSTI',
        damage: 8,
        description: 'Způsobí 8 poškození. Void ≥ 11.',
        voidPressureThreshold: 11,
      },
    ],
    bossPhases: [
      {
        phase: 0,
        label: 'Fáze 1: Předběžná kontrola',
        hpThreshold: 100,
        description: 'Formulář prochází vstupní kontrolou. Záměry jsou slabší, ale zamyká karty.',
        intents: [
          {
            id: 'audit-phase1',
            type: 'audit',
            label: 'AUDIT FÁZE 1 — ZAMKNOUT KARTU',
            description: 'Zamkne jednu kartu. Špatná volba přidá 2 Šum.',
          },
          {
            id: 'utok-phase1',
            type: 'attack',
            label: 'ÚTOK 4',
            damage: 4,
            description: 'Způsobí 4 poškození.',
          },
        ],
        phaseText: 'Formulář se rozvinul přes celou místnost.\nMěl sedm stran, žádný účel a tón člověka, který miluje kolonky.',
      },
      {
        phase: 1,
        label: 'Fáze 2: Chybějící příloha',
        hpThreshold: 60,
        description: 'Formulář požaduje přílohy. Špatná volba přidá Šum a Void pressure.',
        intents: [
          {
            id: 'audit-phase2',
            type: 'audit',
            label: 'AUDIT FÁZE 2 — CHYBĚJÍCÍ PŘÍLOHA',
            description: 'Vyžaduje volbu přílohy. Chybná příloha přidá 2 Šum a +1 Void.',
          },
          {
            id: 'void-surge-phase2',
            type: 'void_surge',
            label: 'PRÁZDNOTOVÝ VÝBOJ +2 VOID',
            description: 'Zvýší Void pressure o 2.',
          },
        ],
        phaseText: 'Formulář požaduje přílohy.\nŽádnou z požadovaných příloh nelze přiložit, protože neexistují.\nTo formuláři nebrání je vyžadovat.',
      },
      {
        phase: 2,
        label: 'Fáze 3: Elektronický podpis selhal',
        hpThreshold: 30,
        description: 'Finální fáze. Silné útoky, rychlý růst Void pressure.',
        intents: [
          {
            id: 'utok-phase3',
            type: 'attack',
            label: 'ÚTOK 10 — VYNUTIT PODPIS',
            damage: 10,
            description: 'Způsobí 10 poškození. Void +1 za každé kolo.',
          },
          {
            id: 'audit-final',
            type: 'audit',
            label: 'FINÁLNÍ AUDIT',
            description: 'Zamkne všechny hackové karty. Sarkasmus může přerušit.',
          },
        ],
        phaseText: 'Formulář se pokusil uložit sám sebe.\nSystém odpověděl: „Chyba při ukládání chyby."\nTo bylo poprvé, kdy se místnost usmála.',
      },
    ],
    text: {
      intro: [
        'Nekonečný Formulář se rozvinul přes celou místnost.\nMěl sedm stran, žádný účel a tón člověka, který miluje kolonky.\n\nPrvní kolonka zněla: „Jméno subjektu, který si myslí, že má právo tady být."\nPole bylo příliš malé.',
        'Formulář přišel bez upozornění.\nNebo s upozorněním, které přišlo po formuláři.\n\nV každém případě: tady je. A chce součinnost.',
      ],
      hit: [
        'Formulář přijal poškození a zapsal ho do kolonky „neoprávněné zásahy". Kolonka je dlouhá.',
        'Stránka se protrhla. Formulář vytáhl záložní kopii. Formuláře mají vždy záložní kopii.',
        'Zásah. Formulář ztratil část integrity. Část integrity se automaticky obnovila — to je přece záloha.',
        'Poškození přijato. Formulář to označil jako „strukturální pochybení ze strany auditovaného subjektu".',
      ],
      death: [
        'Formulář se pokusil uložit sám sebe.\nSystém odpověděl: „Chyba při ukládání chyby."\nFormulář přestal existovat — ale záznamy o formuláři zůstaly.\nZáznamy jsou nezničitelné.\nTo je podstata problému.',
        'Nekonečný Formulář byl uzavřen.\nNikdo ho nepodepsal.\nNikdy nebyl podepsán.\nPřesto platil.\n\nTahle věc s formuláři pořád nedává smysl.',
      ],
    },
    tags: ['boss', 'bureaucracy', 'audit', 'finale'],
  },
};

export function getEnemyById(id: string): EnemyDefinition | undefined {
  return ENEMIES[id];
}

export const ENEMY_IDS = Object.keys(ENEMIES);
