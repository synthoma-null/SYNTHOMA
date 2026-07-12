import type { SwipeCard } from '../cyklusTypes';

export const TUTORIAL_CARDS: Record<string, SwipeCard> = {


  // ── TUTORIAL V2 ─────────────────────────────────────────────────────────────
  tutorial_00_welcome: {
    id: 'tutorial_00_welcome',
    title: 'Uvítací chyba',
    logLabel: 'TUTORIAL_BOOT',
    scene: 'T-AI otevřela onboardingový protokol. Sarkasma se opřela o okraj obrazovky a zamumlala: „Výborně. Další subjekt, kterému musíme vysvětlit, že tlačítko ANO může být katastrofa a NE není automaticky charakter."',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL_BOOT]:</span> onboarding spuštěn. Subjekt pravděpodobně netuší, že tlačítka mají následky. Roztomilé.</p><p class="text">T-AI otevře uvítací protokol s uhlazeností stroje, který si myslí, že „pomoc“ je totéž co „evidence“.</p><p class="dialog">„Vítej v CYKLU. Každá karta je volba, scéna a záznam.“</p><p class="dialogS">„A ano, tlačítko ANO může být katastrofa. NE taky. Gratuluju, naučili jsme tě základy lidské existence.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-boot', 'scene-tai', 'scene-sarkasma'],
    yesLabel: 'POKRAČOVAT',
    noLabel: 'POKRAČOVAT PASIVNĚ AGRESIVNĚ',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'intro', 'tai', 'sarkasma'],
    yes: {
      resultText: 'T-AI tě označila jako spolupracujícího. Sarkasma si poznamenala: „Dočasné. Lidé vydrží spolupracovat zhruba do prvního zrcadla."',
      effects: [
        { type: 'flag', flag: 'tutorial_v2_started' },
        { type: 'schedule', cardId: 'tutorial_01_swipe', inTurns: 1 },
      ],
      preview: { hint: 'Začátek tutoriálu', risk: 'low' },
    },
    no: {
      resultText: 'T-AI tě označila jako spolupracujícího s divnou pózou. Sarkasma zatleskala jednou rukou, čistě z opovržení k fyzice.',
      effects: [
        { type: 'flag', flag: 'tutorial_v2_started' },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_01_swipe', inTurns: 1 },
      ],
      preview: { hint: 'Začátek tutoriálu · profil P +', risk: 'low' },
    },
  },


  tutorial_01_swipe: {
    id: 'tutorial_01_swipe',
    title: 'Každá karta je scéna',
    logLabel: 'TUTORIAL_SWIPE',
    scene: 'Karty jsou scény. ANO = vstoupit, přijmout. NE = odmítnout, odložit. Obě volby mění staty. Systém si pamatuje obě.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/SWIPE]:</span> karta není dotazník.</p><p class="text"><span class="fx-outline is-lit">ANO</span> = vstoupit, přijmout, riskovat. <span class="fx-outline hollow">NE</span> = odmítnout, odložit, kontrolovat.</p><p class="text">Obě možnosti mění staty a zanechají stopu. Systém si pamatuje obojí.</p><p class="dialogS">„Kdyby byly volby jasné, lidstvo by nemělo historii.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-choice', 'scene-card'],
    yesLabel: 'PŘIJMOUT PRŮCHOD',
    noLabel: 'DRŽET SI ODSTUP',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'choice'],
    yes: {
      resultText: 'Přijal jsi průchod. SYNTHOMA si tě uložila jako subjekt, což zní oficiálněji, než by mělo.',
      effects: [
        { type: 'flag', flag: 'tutorial_swipe_seen' },
        { type: 'stat', key: 'energy', amount: 2 },
        { type: 'schedule', cardId: 'tutorial_02_stats', inTurns: 1 },
        { type: 'profile', key: 'N', amount: 1 },
      ],
      preview: { hint: 'Energie ↑ · ANO přijímá scénu', statHints: { energy: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Držíš si odstup. To je rozumné. SYNTHOMA rozumné věci eviduje jako dočasné.',
      effects: [
        { type: 'flag', flag: 'tutorial_swipe_seen' },
        { type: 'stat', key: 'control', amount: 2 },
        { type: 'schedule', cardId: 'tutorial_02_stats', inTurns: 1 },
        { type: 'profile', key: 'S', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · NE si drží odstup', statHints: { control: 'up' }, risk: 'low' },
    },
  },


  tutorial_02_stats: {
    id: 'tutorial_02_stats',
    title: 'Čtyři způsoby rozpadu',
    logLabel: 'TUTORIAL_STATS',
    scene: 'Na obrazovce se rozsvítí čtyři ukazatele: Energie, Paměť, Vazba, Kontrola. T-AI jim říká stabilizační osy. Sarkasma jim říká: „čtyři čudlíky, kterými se dá subjekt elegantně poslat do háje."',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/STATS]:</span> čtyři stabilizační osy načteny.</p><p class="text"><span class="fx-neon">Energie</span> = výkon. <span class="fx-neon">Paměť</span> = záznam. <span class="fx-neon">Vazba</span> = spojení. <span class="fx-neon">Kontrola</span> = tvar.</p><p class="text">Každý stat má bezpečné pásmo. Moc vysoko nebo moc nízko = problém. Drž je uprostřed.</p><p class="dialogS">„Čtyři ukazatele. Čtyři příležitosti se zničit sofistikovaně.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-stats', 'scene-four-reactors'],
    yesLabel: 'PROHLÉDNOUT UKAZATELE',
    noLabel: 'DĚLAT, ŽE JE TO JASNÉ',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'stats'],
    yes: {
      resultText: 'Energie značí výkon a vyhoření. Paměť drží minulost a zahlcení. Vazba měří spojení a rozpuštění. Kontrola drží tvar a vyrábí klece. Gratulujeme, máš čtyři šance se zničit sofistikovaně.',
      effects: [
        { type: 'flag', flag: 'tutorial_stats_seen' },
        { type: 'schedule', cardId: 'tutorial_03_balance', inTurns: 1 },
      ],
      preview: { hint: 'Vysvětlení čtyř statů', risk: 'low' },
    },
    no: {
      resultText: 'Dělal jsi, že je to jasné. Systém to vyhodnotil jako běžné lidské rozhraní: nulová znalost, solidní výraz obličeje.',
      effects: [
        { type: 'flag', flag: 'tutorial_stats_seen' },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_03_balance', inTurns: 1 },
      ],
      preview: { hint: 'Vysvětlení čtyř statů · profil P +', risk: 'low' },
    },
  },


  tutorial_03_balance: {
    id: 'tutorial_03_balance',
    title: 'Střed není zbabělost',
    logLabel: 'TUTORIAL_BALANCE',
    scene: 'T-AI zvýrazní bezpečné pásmo 20–80. „Cílem není maximum," řekne. Sarkasma protočí oči: „Ano, šokující. Hra, kde být úplně na sto znamená, že jsi psychologický toast."',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/BALANCE]:</span> bezpečné pásmo 20–80 aktivní.</p><p class="text">Cílem není mít všechno na sto. Na stu jsi přepálený. Na nule jsi mrtvý. Bezpečné pásmo je zhruba 20–80.</p><p class="text">Volby mění staty nahoru i dolů. Sleduj šipky a drž se středu.</p><p class="dialogS">„Střed není zbabělost. Je to méně dramatická smrt.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-balance', 'scene-stabilization'],
    yesLabel: 'PŘIJMOUT ROVNOVÁHU',
    noLabel: 'MILOVAT EXTRÉMY',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'balance'],
    yes: {
      resultText: 'Přijal jsi, že stabilita není nuda. Je to jen méně dramatický způsob, jak nepřestat existovat.',
      effects: [
        { type: 'stat', key: 'control', amount: 2 },
        { type: 'profile', key: 'J', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_04_preview', inTurns: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · střed je cíl', statHints: { control: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Extrémy vypadají vzrušujícím způsobem. Také končí vzrušujícím způsobem. Většinou smrtí, kolapsem nebo velmi sebevědomou chybou.',
      effects: [
        { type: 'stat', key: 'energy', amount: 2 },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_04_preview', inTurns: 1 },
      ],
      preview: { hint: 'Energie ↑ · systém tě pozoruje', statHints: { energy: 'up' }, risk: 'low' },
    },
  },


  tutorial_04_preview: {
    id: 'tutorial_04_preview',
    title: 'Preview není proroctví',
    logLabel: 'TUTORIAL_PREVIEW',
    scene: 'Nad volbami vidíš náznak dopadu. Šipky ukazují, co se asi změní. Asi. T-AI tomu říká predikce. Sarkasma tomu říká „horoskop s lepším CSS".',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/PREVIEW]:</span> predikční vrstva zapnuta.</p><p class="text"><span class="fx-outline is-lit">Preview</span> nad volbami ukazuje, co se pravděpodobně změní: stat, riziko, předmět. Není to záruka.</p><p class="text">Číst náznaky pomáhá. Ignorovat je je také volba. Obě jsou platné záznamy.</p><p class="dialogS">„Nápověda není záruka. Je to cedule před jámou.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-preview', 'scene-hint', 'scene-control'],
    yesLabel: 'ČÍST NÁZNAKY',
    noLabel: 'JET NASLEPO',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'preview'],
    yes: {
      resultText: 'Začal jsi číst náznaky. To neznamená, že víš všechno. Jen už nebudeš padat do jámy s výrazem překvapeného nábytku.',
      effects: [
        { type: 'stat', key: 'control', amount: 2 },
        { type: 'profile', key: 'Ti', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_04b_junction', inTurns: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · preview pomáhá', statHints: { control: 'up' }, risk: 'low' },
    },
    no: {
      resultText: 'Rozhodl ses jet naslepo. Systém to zapsal jako „intuitivní přístup". Sarkasma jako „pojišťovna pláče".',
      effects: [
        { type: 'stat', key: 'energy', amount: 2 },
        { type: 'profile', key: 'Ne', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_04b_junction', inTurns: 1 },
      ],
      preview: { hint: 'Energie ↑ · intuice také něco stojí', statHints: { energy: 'up' }, risk: 'low' },
    },
  },


  tutorial_04b_junction: {
    id: 'tutorial_04b_junction',
    title: 'Jak chceš pokračovat?',
    logLabel: 'TUTORIAL_JUNCTION',
    scene: 'Teď znáš základ: karty, volby, staty, rovnováha, preview. Tohle stačí na první průchod. Zbytek se naučíš za pochodu.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/JUNCTION]:</span> minimální onboarding dokončen.</p><p class="text">Víš dost na to, abys mohl začít: volby mají dopad, staty se drží ve středu, preview napovídá.</p><p class="text">Zbytek — otisky, entity, sektory, metaprogrese — ti systém vysvětlí za pochodu. Nebo tě nechá přijít na to sám. Oboje je platná cesta.</p><p class="dialogS">„Znáš základ. Propast čeká. Chceš mapu nebo skáčeš?“</p>`,
    sceneFx: ['scene-tutorial', 'scene-junction', 'scene-ready'],
    yesLabel: 'CHCI HRÁT',
    noLabel: 'CHCI JEŠTĚ VYSVĚTLIT',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'junction'],
    yes: {
      resultText: 'Systém tě pouští do prvního cyklu. Výukové minimum splněno. Propast otevřena.',
      effects: [
        { type: 'flag', flag: 'tutorial_min_done' },
        { type: 'flag', flag: 'tutorial_done' },
        { type: 'flag', flag: 'tutorial_v2_done' },
        { type: 'schedule', cardId: 'restart_0', inTurns: 1 },
      ],
      preview: { hint: 'Přeskočit rozšířený tutorial · jdeme hrát', risk: 'low' },
    },
    no: {
      resultText: 'Sarkasma si odškrtla políčko „subjekt chce vědět více“. Je to méně časté, než by mělo být.',
      effects: [
        { type: 'flag', flag: 'tutorial_min_done' },
        { type: 'schedule', cardId: 'tutorial_05_profile', inTurns: 1 },
      ],
      preview: { hint: 'Pokračovat do rozšířeného tutorialu', risk: 'low' },
    },
  },


  tutorial_05_profile: {
    id: 'tutorial_05_profile',
    title: 'Profil není diagnóza',
    logLabel: 'TUTORIAL_PROFILE',
    scene: 'Každá volba posune tvůj skrytý profil. Ne proto, aby tě systém zařadil do škatulky. Tedy dobře. Systémy milují škatulky. Je to jejich náhrada za duši.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/PROFILE]:</span> profilovací matice aktivní. Diagnóza nevydána. Škatulka připravena, protože systém je nudný úředník v neonovém kabátu.</p><p class="text">Každá volba posouvá skrytý profil. I/E, N/S, T/F, J/P a funkce jako Ni, Ne, Ti nebo Fe nejsou rozsudek. Jsou to stopy v chování, malé statistické otisky toho, kudy obvykle utíkáš, když realita zaklepe.</p><p class="text">Profil může později ovlivnit doporučení, odemykání, protokoly a tón světa. Neříká, kdo jsi. Jen ukazuje, jak se v cyklu rozhoduješ. Což je nepříjemně blízko pravdě, ale pořád to není tvoje duše v tabulce.</p><p class="dialogS">„Profil není osobnost. Je to účetní výpis z tvých reakcí. Méně romantické, zato použitelnější.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-profile', 'scene-diagnostic', 'scene-identity'],
    yesLabel: 'VOLIT PODLE SEBE',
    noLabel: 'VOLIT PROTI SOBĚ',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'profile'],
    yes: {
      resultText: 'Profil se učí tvůj styl: intuici, odstup, cit, řád, chaos, útěk, péči i všechno to ostatní, čemu lidé říkají „já" a pak se diví, že je to nekonzistentní.',
      effects: [
        { type: 'profile', key: 'Fi', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_06_items', inTurns: 1 },
      ],
      preview: { hint: 'Profil Fi +', risk: 'low' },
    },
    no: {
      resultText: 'Zkusil ses rozhodovat proti sobě. Profil to také zapíše. Systém je nudně férový: eviduje i tvoje pokusy nebýt ty.',
      effects: [
        { type: 'profile', key: 'Fe', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_06_items', inTurns: 1 },
      ],
      preview: { hint: 'Profil Fe +', risk: 'low' },
    },
  },


  tutorial_06_items: {
    id: 'tutorial_06_items',
    title: 'Kapsa není dekorace',
    logLabel: 'TUTORIAL_ITEMS',
    scene: 'Předměty v SYNTHOMĚ nejsou loot. Jsou to malé problémy s popisem. Některé tě chrání. Některé žárlí. Některé se vrátí jako karta, protože kapse se nedá věřit, což ví každý, kdo někdy pral kalhoty.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/ITEMS]:</span> inventář otevřen. Varování: předměty mohou mít vlastní paměť, náladu a směšně vysoké sebevědomí.</p><p class="text">Item není dekorace. Může mít pasivní efekt, odemknout pool, spustit vlastní kartu nebo se později připomenout jako kapesní následková bomba.</p><p class="text">Některé předměty chrání. Některé lákají. Některé se urazí. A některé dělají všechny tři věci najednou, protože zjevně i objekt může mít složitější vnitřní život než průměrný formulář.</p><p class="dialogS">„Když ti něco vleze do kapsy v SYNTHOMĚ, není to loot. Je to vztah se špatně čitelnými podmínkami.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-item', 'scene-pocket', 'scene-inventory'],
    yesLabel: 'VZÍT TESTOVACÍ PŘEDMĚT',
    noLabel: 'NECHAT KAPSU PRÁZDNOU',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'item'],
    yes: {
      resultText: 'Získal jsi testovací předmět: Měkká chyba. Není silná. Jen přežila dost dlouho na to, aby se dala držet.',
      effects: [
        { type: 'item', itemId: 'soft_bug' },
        { type: 'flag', flag: 'tutorial_item_taken' },
        { type: 'schedule', cardId: 'tutorial_07_imprints', inTurns: 1 },
      ],
      preview: { hint: 'Item získán', risk: 'low' },
    },
    no: {
      resultText: 'Nechal jsi kapsu prázdnou. Kapsa to vzala osobně, což je začátek většiny problémů s inventářem.',
      effects: [
        { type: 'flag', flag: 'tutorial_item_refused' },
        { type: 'schedule', cardId: 'tutorial_07_imprints', inTurns: 1 },
      ],
      preview: { hint: 'Bez itemu · ale také stopa', risk: 'low' },
    },
  },


  tutorial_07_imprints: {
    id: 'tutorial_07_imprints',
    title: 'Otisky zůstávají déle než hrdost',
    logLabel: 'TUTORIAL_IMPRINTS',
    scene: 'Otisk není item. Nedržíš ho v kapse. Drží on tebe. T-AI tomu říká dlouhodobá stopa. Sarkasma tomu říká „emocionální tetování bez souhlasu grafika".',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/IMPRINTS]:</span> otisky načteny. Kapesní úložiště nepoužito. Subjekt bude uložen přímo do subjektu, což je designérsky ohavné a dramaticky účinné.</p><p class="text"><span class="fx-outline is-lit">Otisk</span> není předmět. Neztratíš ho při pádu. Neprodáš ho na tržišti. Neodložíš ho do zásuvky, pokud zásuvka není metafora pro vytěsnění, což v SYNTHOMĚ pravděpodobně je.</p><p class="text">Otisky zůstávají déle. Mohou přidat pasivní flag, odemknout follow-up pool, změnit chování dalších karet nebo přitáhnout starou scénu zpátky. Je to paměťová jizva s UI popiskem. Moderní doba, samé pokroky.</p><p class="dialogS">„Item držíš ty. Otisk drží tebe. Rozdíl je důležitý hlavně ve chvíli, kdy se oba začnou hádat.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-imprint', 'scene-memory', 'scene-bond'],
    yesLabel: 'PŘIJMOUT OTISK',
    noLabel: 'ODLOŽIT OTISK',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'imprint'],
    yes: {
      resultText: 'Přijal jsi testovací otisk. Něco v tobě si udělalo malou poznámku: příště to bude jiné. Nebo horší. SYNTHOMA nemá ráda jednoznačnost.',
      effects: [
        { type: 'imprint', imprintId: 'unfinished_conversation' },
        { type: 'schedule', cardId: 'tutorial_08_consequences', inTurns: 1 },
      ],
      preview: { hint: 'Otisk získán', risk: 'low' },
    },
    no: {
      resultText: 'Odložil jsi otisk. Nezmizel. Jen se tvářil, že se vrátí později s lepší argumentací.',
      effects: [
        { type: 'flag', flag: 'tutorial_imprint_refused' },
        { type: 'schedule', cardId: 'tutorial_08_consequences', inTurns: 1 },
      ],
      preview: { hint: 'Bez otisku · ale se stopou', risk: 'low' },
    },
  },


  tutorial_08_consequences: {
    id: 'tutorial_08_consequences',
    title: 'Následky mají kalendář',
    logLabel: 'TUTORIAL_FOLLOWUP',
    scene: 'Některé volby se nestanou hned. Jen se naplánují. Scheduled karta je budoucí problém s lepší docházkou. V SYNTHOMĚ se i následky umí objednat na později.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/SCHEDULED]:</span> zpožděné následky povoleny. Uklidňující název pro věci, které tě najdou později.</p><p class="text">Některé efekty se nestanou hned. Karta může naplánovat další kartu za několik tahů, do dalšího cyklu nebo jen otevřít pool, který se začne míchat do balíku.</p><p class="text"><span class="fx-outline is-lit">Scheduled</span> znamená: volba odešla do budoucnosti a tam si pronajala židli. Až přijde její tah, vrátí se. Ne proto, že by byla pomstychtivá. Jen velmi dobře organizovaná.</p><p class="dialogS">„Následky mají kalendář. Lidé mají výmluvy. Hádej, kdo bývá přesnější.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-followup', 'scene-scheduled', 'scene-consequence'],
    yesLabel: 'NAPLÁNOVAT MINI PROBLÉM',
    noLabel: 'TVÁŘIT SE, ŽE NEPŘIJDE',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'followup'],
    yes: {
      resultText: 'Naplánoval jsi mini problém. Gratulujeme. První administrativně schválená budoucí nepříjemnost.',
      effects: [
        { type: 'flag', flag: 'tutorial_followup_seen' },
        { type: 'schedule', cardId: 'tutorial_09_sectors', inTurns: 1 },
      ],
      preview: { hint: 'Scheduled následky vysvětleny', risk: 'low' },
    },
    no: {
      resultText: 'Tvářil ses, že následky nepřijdou. Tohle je oblíbená lidská magie. Funguje přesně do chvíle, než přestane.',
      effects: [
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_09_sectors', inTurns: 1 },
      ],
      preview: { hint: 'Následky stejně přijdou', risk: 'low' },
    },
  },


  tutorial_09_sectors: {
    id: 'tutorial_09_sectors',
    title: 'Sektory nejsou pozadí',
    logLabel: 'TUTORIAL_SECTORS',
    scene: 'Prázdnota, Archiv, Pískoviště, Pelech Glitchky, Reziduum, Zrcadlo, Formulářovna, T-AI. Systém říká, že sektor ovlivňuje výběr karet. Sarkasma říká, že sektor je jen místnost, která se tváří, že má osobnost.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/SECTORS]:</span> topologie běhu aktivní. Prostředí není pozadí. Je to nálada se souřadnicemi.</p><p class="text">Sektor určuje, jaké karty mají větší šanci přijít. <span class="fx-neon">Archiv</span> táhne Paměť, <span class="fx-neon">Pískoviště</span> bezpečnou chybu, <span class="fx-neon">Zrcadlo</span> identitu, <span class="fx-neon">Formulářovna</span> kontrolu a byrokratické utrpení, protože někdo musel být kreativní špatným směrem.</p><p class="text">Přesun do sektoru není jen výlet. Je to přeladění balíku. Navštívené sektory se ukládají a mohou později odemknout cíle, nálezy nebo další vrstvy příběhu.</p><p class="dialogS">„Lokace je jen emoce, která si pořídila adresu. Vítej v urbanismu traumatu.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-sector', 'scene-path', 'scene-map'],
    yesLabel: 'PROJÍT ARCHIVNÍ CHODBOU',
    noLabel: 'ZŮSTAT V PRÁZDNOTĚ',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'sector'],
    yes: {
      resultText: 'Prošel jsi do Archivu. Systém zapsal, že jsi někde byl. To je pro něj důkaz, že existuješ.',
      effects: [
        { type: 'flag', flag: 'tutorial_sectors_seen' },
        { type: 'moveSector', sectorId: 'archive' },
        { type: 'schedule', cardId: 'tutorial_10_cycle', inTurns: 1 },
      ],
      preview: { hint: 'Přesun do Archivu', risk: 'low' },
    },
    no: {
      resultText: 'Zůstal jsi v Prázdnotě. Prázdnota si to zapamatovala. Je to její hlavní koníček.',
      effects: [
        { type: 'flag', flag: 'tutorial_sectors_seen' },
        { type: 'schedule', cardId: 'tutorial_10_cycle', inTurns: 1 },
      ],
      preview: { hint: 'Zůstáváš v Prázdnotě', risk: 'low' },
    },
  },


  tutorial_10_cycle: {
    id: 'tutorial_10_cycle',
    title: 'Dvanáct voleb a pak souhrn',
    logLabel: 'TUTORIAL_CYCLE',
    scene: 'Každý cyklus má dvanáct voleb. Pak přijde souhrn, otisk a mírný drift zpátky k centru. Systém tomu říká regulace. Sarkasma tomu říká: „uděláš dvanáct chyb, pak ti dáme pětiminutovou přestávku na sebemrskačství."',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/CYCLE]:</span> běh rozdělen do cyklů. Standardní délka: 12 voleb. Standardní jistota: žádná.</p><p class="text">Jeden cyklus je dvanáct tahů. Po nich přijde souhrn: co se změnilo, které staty utekly od středu, co sis vzal, co sis nechal vzít a jaký typ subjektu systém právě katalogizuje.</p><p class="text">Po cyklu se svět může posunout. Něco se zklidní, něco zůstane, něco se promění v další problém. Cyklus není level. Je to emoční běh s účetnictvím.</p><p class="dialogS">„Dvanáct voleb. Dost na iluzi strategie, málo na opravu osobnosti. Herní design konečně realistický.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-cycle', 'scene-summary', 'scene-restart-fatigue'],
    yesLabel: 'CHÁPU',
    noLabel: 'PŘEDSTÍRAT, ŽE CHÁPU',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'cycle'],
    yes: {
      resultText: 'Pochopil jsi: cyklus je malá sezóna. Dvanáct voleb, pak souhrn, pak znovu. Systém točí dokola, dokud se nerozpadneš nebo nezůstaneš.',
      effects: [
        { type: 'flag', flag: 'tutorial_cycle_seen' },
        { type: 'schedule', cardId: 'tutorial_11_restart', inTurns: 1 },
      ],
      preview: { hint: 'Cyklus 12 voleb · souhrn', risk: 'low' },
    },
    no: {
      resultText: 'Dělal jsi, že to bylo jasné. Systém to přijal jako standardní lidskou pózu. Pózy se nepočítají, ale ukládají.',
      effects: [
        { type: 'flag', flag: 'tutorial_cycle_seen' },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_11_restart', inTurns: 1 },
      ],
      preview: { hint: 'Cyklus 12 voleb · profil P +', risk: 'low' },
    },
  },


  tutorial_11_restart: {
    id: 'tutorial_11_restart',
    title: 'Restart není undo',
    logLabel: 'TUTORIAL_RESTART',
    scene: 'RESTART 0–5 není druhá šance. Je to prolog. Systém tě šestkrát zeptá, jestli jsi připraven. Pak přestane. Pokud prožiješ všechny restarty, začne skutečný příběh. Sarkasma: „Pokud. Hezké slovo."',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [TUTORIAL/RESTART]:</span> restart není undo. Opakuji: restart není undo. Subjekt stejně pravděpodobně klikne jako člověk u neuloženého dokumentu.</p><p class="text">Restart nevrací svět do nevinného stavu. Něco smaže, něco promíchá, něco nechá zahnívat v perzistenci. Smrt ukončí běh, ale nezničí archiv. Dokončení běhu tě posune, ale nevymaže cenu.</p><p class="text">Prologové restarty 0–5 jsou první rituál. Učí tě, že „znovu“ neznamená „bez následků“. Znamená jen, že systém našel další způsob, jak tě přečíst.</p><p class="dialogS">„Undo je pro textové editory. Ty máš restart. Rozdíl poznáš podle množství psychologických poplatků.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-restart', 'scene-prologue', 'scene-warning'],
    yesLabel: 'POCHOPIT PROLOG',
    noLabel: 'DĚLAT, ŽE TO BYLO TRIVIÁLNÍ',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'restart'],
    yes: {
      resultText: 'Pochopil jsi: restart je diagnostika, ne zpětné tlačítko. Šest restartů, pak se otevře zbytek.',
      effects: [
        { type: 'flag', flag: 'tutorial_restart_seen' },
        { type: 'schedule', cardId: 'tutorial_12_void', inTurns: 1 },
      ],
      preview: { hint: 'Restart jako prolog', risk: 'low' },
    },
    no: {
      resultText: 'Dělal jsi, že to bylo triviální. Systém si poznamenal: „subjekt potřebuje větší prolog".',
      effects: [
        { type: 'flag', flag: 'tutorial_restart_seen' },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_12_void', inTurns: 1 },
      ],
      preview: { hint: 'Restart jako prolog · profil P +', risk: 'low' },
    },
  },


  tutorial_12_void: {
    id: 'tutorial_12_void',
    title: 'Prázdnota je mezi běhy',
    logLabel: 'TUTORIAL_VOID',
    scene: 'Prázdnota je místnost mezi běhy. Tam upravuješ místnosti, vylepšuješ subjekt, vybíráš si příběhové stopy. T-AI tomu říká metaprostor. Sarkasma tomu říká „pokoj, který si pamatuje, jak ses naposledy rozpadl".',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/VOID]:</span> Prázdnota nastavena jako checkpoint. Bezpečí nepotvrzeno. Účetnictví ztrát aktivní.</p><p class="text"><span class="fx-outline is-lit">Prázdnota</span> je místo mezi běhy. Ticho na dluh. Tady můžeš vidět postup, odemykat meta prvky, vnímat následky a připravit další průchod.</p><p class="text">Není to domov v měkkém smyslu. Spíš pokoj, kde systém počítá, co z tebe zbylo, a tváří se u toho neutrálně. Neutralita je v SYNTHOMĚ často jen násilí bez výrazné mimiky.</p><p class="dialogS">„Checkpoint není objetí. Je to účtenka s lepším osvětlením.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-void', 'scene-checkpoint', 'scene-stabilization'],
    yesLabel: 'POCHOPIT PRÁZDNOTU',
    noLabel: 'ŘÍKAT TOMU MENU',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'void'],
    yes: {
      resultText: 'Pochopil jsi: Prázdnota není menu. Je to místo, které si pamatuje tvůj styl rozpadu.',
      effects: [
        { type: 'flag', flag: 'tutorial_void_seen' },
        { type: 'schedule', cardId: 'tutorial_13_progression', inTurns: 1 },
      ],
      preview: { hint: 'Prázdnota jako hub', risk: 'low' },
    },
    no: {
      resultText: 'Nazval jsi to menu. Prázdnota se lehce urazila. Upřímně právem.',
      effects: [
        { type: 'flag', flag: 'tutorial_void_seen' },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_13_progression', inTurns: 1 },
      ],
      preview: { hint: 'Prázdnota jako hub · profil P +', risk: 'low' },
    },
  },


  tutorial_13_progression: {
    id: 'tutorial_13_progression',
    title: 'Reziduum a Prázdnota',
    logLabel: 'TUTORIAL_PROGRESSION',
    scene: 'Po běhu získáš reziduum, materiály, recepty a drobné důkazy, že ses nerozpadl úplně zbytečně. V Prázdnotě pak můžeš vylepšit místnosti, nasadit protokoly, vyrobit artefakty a obecně předstírat, že utrácení zbytků sebe je zdravý rozvoj.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/PROGRESSION]:</span> dlouhodobý postup načten. Subjekt se zlepšuje, nebo jen sbírá sofistikovanější rány. Rozdíl zatím není měřitelný.</p><p class="text">Po bězích získáváš reziduum, materiály, nálezy, odemčené upgrady, jizvy, protokoly, artefakty a místnosti Prázdnoty. To je meta postup: ne vítězství, ale schopnost vstoupit do dalšího problému s o něco lepší kapsou.</p><p class="text">Upgrady pomáhají, ale často mají cenu. Jizvy dávají bonus i zranitelnost. Protokoly ladí styl rozhodování. Artefakty přidávají startovní výhodu a někdy i přesně ten typ komplikace, který by rozumný člověk odmítl. Rozumný člověk zde nebyl nalezen.</p><p class="dialogS">„Progression znamená, že kolabuješ zkušeněji. Gratuluju, herní průmysl tomu říká růst.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-progression', 'scene-meta', 'scene-void-room'],
    yesLabel: 'POCHOPIT METAHRU',
    noLabel: 'ŘÍKAT TOMU SHOP',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'progression', 'void'],
    yes: {
      resultText: 'Pochopil jsi: Prázdnota není menu. Je to místo mezi běhy, které si pamatuje, jakým způsobem přežíváš.',
      effects: [
        { type: 'flag', flag: 'tutorial_progression_seen' },
        { type: 'schedule', cardId: 'tutorial_14_packs', inTurns: 1 },
      ],
      preview: { hint: 'Metaprogrese vysvětlena', risk: 'low' },
    },
    no: {
      resultText: 'Nazval jsi to shop. Prázdnota se lehce urazila. Upřímně právem.',
      effects: [
        { type: 'flag', flag: 'tutorial_progression_seen' },
        { type: 'schedule', cardId: 'tutorial_14_packs', inTurns: 1 },
      ],
      preview: { hint: 'Metaprogrese vysvětlena, i když kulturně zmrzačeně', risk: 'low' },
    },
  },


  tutorial_14_packs: {
    id: 'tutorial_14_packs',
    title: 'Packy jako příběhové linky',
    logLabel: 'TUTORIAL_PACKS',
    scene: 'Packy jsou příběhové linky: Glitchka, Sarkasma, Černý box, Romance, ORGIE, Detektivka, Dvanáctník. Každá má svůj sektor, svou atmosféru a svůj způsob, jak tě naučit, že víš, kdo jsi.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [TUTORIAL/PACKS]:</span> příběhové balíky aktivní. Události budou předstírat náhodu, protože drama má rádo převlek.</p><p class="text">Některé karty patří do packů. Pack je malá dějová linka: vstup, pokušení, objekt, eskalace, zvrat, účet, rozuzlení a ozvěna. Ne vždy přijde celá. SYNTHOMA není vlak, spíš zraněná tramvaj s vlastními sny.</p><p class="text">Story thread preferuje sektory, tagy a následky podle toho, co už se stalo. Když otevřeš Glitchku, Sarkasmu, Archiv nebo Dvanáctníka, hra si začne hlídat rytmus. Tedy aspoň se o to snaží. Kód má ambice, což je dojemné i nebezpečné.</p><p class="dialogS">„Pack není balíček obsahu. Je to zápletka, která si tě našla podle zápachu rozhodnutí.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-pack', 'scene-story-thread', 'scene-directive'],
    yesLabel: 'VYBRAT SI PRVNÍ LINKU',
    noLabel: 'NECHAT TO NA SYSTÉMU',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'packs', 'story'],
    yes: {
      resultText: 'Představil sis, že si vybereš linku. Systém to zapsal jako „subjekt vykazuje známky preference". To je pro něj vzrušující.',
      effects: [
        { type: 'flag', flag: 'tutorial_packs_seen' },
        { type: 'schedule', cardId: 'tutorial_15_ready', inTurns: 1 },
      ],
      preview: { hint: 'Packy jako příběhové linky', risk: 'low' },
    },
    no: {
      resultText: 'Nechal jsi to na systému. Systém to ocenil jako „subjekt vykazuje známky rezignace". Také vzrušující.',
      effects: [
        { type: 'flag', flag: 'tutorial_packs_seen' },
        { type: 'profile', key: 'P', amount: 1 },
        { type: 'schedule', cardId: 'tutorial_15_ready', inTurns: 1 },
      ],
      preview: { hint: 'Packy jako linky · profil P +', risk: 'low' },
    },
  },


  tutorial_15_ready: {
    id: 'tutorial_15_ready',
    title: 'Konec návodu, začátek poškození',
    logLabel: 'TUTORIAL_COMPLETE',
    scene: 'T-AI zavřela onboarding. Sarkasma si odškrtla políčko „subjekt přibližně chápe, proč umře". Není to mnoho, ale lidstvo na podobných základech postavilo civilizaci, takže směle do toho.',
    sceneHtml: `<p class="log fx-scanline bios-warning"><span class="datastream">LOG [TUTORIAL/COMPLETE]:</span> základní přežití vysvětleno. Pochopení subjektu: odhadované. Důvěra systému: trapně vysoká.</p><p class="text">Teď víš dost na to, abys mohl začít: karta je scéna, volba má dopad, preview pomáhá, staty se drží ve středu, itemy mají následky, otisky zůstávají, sektory mění balík, cykly dávají souhrn a restart není milost.</p><p class="text">To není návod k vítězství. To je návod, jak rozpoznat, která část světa se tě právě snaží archivovat.</p><p class="dialogS">„Výukové kolečko sundáno. Propast zůstává. Aspoň teď víš, že padáš s kontextem.“</p>`,
    sceneFx: ['scene-tutorial', 'scene-complete', 'scene-ready', 'scene-restart'],
    yesLabel: 'SPUSTIT CYKLUS',
    noLabel: 'SPUSTIT CYKLUS, ALE DRAMATICKY',
    category: 'tutorial',
    rarity: 'unique',
    once: true,
    triggerMode: 'scheduledOnly',
    tags: ['tutorial', 'complete'],
    yes: {
      resultText: 'Tutoriál skončil. Systém tě pouští do skutečného cyklu. Výukové kolečko sundáno. Propast ponechána.',
      effects: [
        { type: 'flag', flag: 'tutorial_done' },
        { type: 'flag', flag: 'tutorial_v2_done' },
        { type: 'schedule', cardId: 'restart_0', inTurns: 1 },
      ],
      preview: { hint: 'Tutorial dokončen · RESTART se blíží', risk: 'low' },
    },
    no: {
      resultText: 'Tutoriál skončil dramaticky. Systém nezaznamenal rozdíl. Sarkasma ano, ale nechá si ho na pozdější urážku.',
      effects: [
        { type: 'flag', flag: 'tutorial_done' },
        { type: 'flag', flag: 'tutorial_v2_done' },
        { type: 'profile', key: 'N', amount: 1 },
        { type: 'schedule', cardId: 'restart_0', inTurns: 1 },
      ],
      preview: { hint: 'Tutorial dokončen · RESTART se blíží', risk: 'low' },
    },
  },
};
