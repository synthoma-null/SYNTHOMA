import type { StoryEvent, BoardNodeType } from './types';
import { pickRandom } from './dice';

export const STORY_EVENTS: StoryEvent[] = [

  // ── NOISE (Šumová mina) ×4 ──────────────────────────────────────────────

  {
    id: 'noise-001',
    nodeType: 'noise',
    title: 'Šumová mina – série',
    logLabel: 'LOG [NOISE_MINE_01]',
    text: 'Pod nohama ti zapraskal komprimovaný Šum. Pak druhý. Pak třetí. To už bylo podezřelé, protože dlaždice běžně nemají názor. Systém ti nabídl formulář pro nahlášení neočekávaných emocí. Formulář byl o 47 stránek delší než tvůj problém.',
    tags: ['noise', 'random', 'emotion'],
    effect: { kind: 'roll_table', tableId: 'noise-standard' },
    choices: [
      { id: 'ignore', label: 'Ignorovat a jít dál', text: 'Odvaha nebo hloupost. Archiv to zaznamenal jako oboje.', effect: { kind: 'gain_resource', resource: 'noise', amount: 2 }, profileDelta: { courage: 1 } },
      { id: 'careful', label: 'Opatrně obejít', text: 'Ztratil jsi tempo, ale zachoval si integritu. Zhruba.', effect: { kind: 'lose_resource', resource: 'laugh', amount: 1 }, profileDelta: { caution: 2 } },
    ],
  },

  {
    id: 'noise-002',
    nodeType: 'noise',
    title: 'Emoční výbuch v datové formě',
    logLabel: 'LOG [NOISE_MINE_02]',
    text: 'Gratulujeme, našel jsi jedinou věc horší než rodinný oběd: náhodný emoční výbuch v datové formě. Explodoval tiše, což je nejhorší druh exploze. Nikdo ti nemohl pomoci, protože nikdo neslyšel výbuch. Ale všichni cítili následky.',
    tags: ['noise', 'emotion', 'explosion'],
    effect: { kind: 'gain_resource', resource: 'noise', amount: 1 },
    profileDelta: { chaos: 1 },
  },

  {
    id: 'noise-003',
    nodeType: 'noise',
    title: 'Kompresní selhání',
    logLabel: 'LOG [NOISE_MINE_03]',
    text: 'Šum se zkomprimoval do jednoho bodu a pak se rozhodl, že je čas na spontánní dekompresi. Výsledek byl akusticky nevhodný a vizuálně znepokojivý. Systém to označil jako "neočekávané chování". Systém lže od verze 3.1.',
    tags: ['noise', 'compression', 'system'],
    effect: { kind: 'gain_resource', resource: 'noise', amount: 2 },
    choices: [
      { id: 'absorb', label: 'Vstřebat Šum', text: 'Cítíš tíhu. Ale aspoň víš, co cítíš.', effect: { kind: 'gain_resource', resource: 'noise', amount: 2 }, profileDelta: { tenderness: 1, chaos: 1 } },
      { id: 'redirect', label: 'Přesměrovat Šum jinam', text: 'Technicky geniální. Lidsky problematické.', effect: { kind: 'pass_noise' }, profileDelta: { sarcasm: 1, dominance: 1 } },
    ],
  },

  {
    id: 'noise-004',
    nodeType: 'noise',
    title: 'Šum s podpisem',
    logLabel: 'LOG [NOISE_MINE_04]',
    text: 'Tato mina měla podpis. Nečitelný, ale přítomný. Někdo ji sem umístil záměrně a pak se rozhodl zůstat anonymní, protože zodpovědnost je přepych, který si systém nemůže dovolit ve středu odpoledne.',
    tags: ['noise', 'sabotage', 'anonymous'],
    effect: { kind: 'gain_resource', resource: 'noise', amount: 1 },
    profileDelta: { caution: 1 },
  },

  // ── TRAP (Pasti, Audit) ×6 ───────────────────────────────────────────────

  {
    id: 'trap-001',
    nodeType: 'trap',
    title: 'Audit osobnosti',
    logLabel: 'LOG [AUDIT_PERSONALITY_01]',
    text: 'Z temnoty vystoupil formulář s příliš mnoha kolonkami. Ptá se, proč jsi poslední tři tahy tvrdil, že máš plán. Systém má přístup k záznamu. Systém si pamatuje všechno. Zvláště věci, které by sis přál, aby si nepamatoval.',
    tags: ['audit', 'truth', 'memory'],
    profileDelta: { caution: 1, sarcasm: 1 },
    effect: { kind: 'roll_table', tableId: 'audit-result' },
    choices: [
      { id: 'lie', label: 'Tvrdit, že šlo o strategii', text: 'Systém zaznamenal pokus o důstojnost.', effect: { kind: 'gain_resource', resource: 'noise', amount: 1 }, profileDelta: { dominance: 1, sarcasm: 1 } },
      { id: 'admit', label: 'Přiznat improvizaci', text: 'Systém je šokován dospělým chováním. Tohle se tu nestává často.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { tenderness: 1, courage: 1 } },
    ],
  },

  {
    id: 'trap-002',
    nodeType: 'trap',
    title: 'Formulář 47c – povinná položka',
    logLabel: 'LOG [FORM_47C]',
    text: 'Pole 47c je povinné. Nedefinované. Věčné. Systém trvá na vyplnění. Systém neví, co pole 47c znamená. Systém se o to nikdy neptal. Systém byl vytvořen lidmi, kteří měli deadliny a ne dost kávy.',
    tags: ['trap', 'bureaucracy', 'endless'],
    effect: { kind: 'skip_turn', turns: 1 },
    choices: [
      { id: 'fill', label: 'Vyplnit cokoliv', text: 'Napsal jsi "viz příloha". Příloha neexistuje. Formulář byl přijat.', effect: { kind: 'skip_turn', turns: 1 }, profileDelta: { chaos: 1, sarcasm: 1 } },
      { id: 'escalate', label: 'Eskalovat na správce', text: 'Správce je nedostupný od roku 2019. Přijal sis to jako osobní věc.', effect: { kind: 'gain_resource', resource: 'noise', amount: 2 }, profileDelta: { caution: 2 } },
    ],
  },

  {
    id: 'trap-003',
    nodeType: 'trap',
    title: 'Paměťová smyčka',
    logLabel: 'LOG [MEMORY_LOOP_01]',
    text: 'Dostals se do místa, kde jsi byl. Nebo možná ne. Archiv tvrdí, že ano. Tvá paměť tvrdí totéž, ale jinak. Smyčka se spustila v 14:32. Je stále 14:32. Bude 14:32 ještě chvíli.',
    tags: ['trap', 'memory', 'loop'],
    effect: { kind: 'move_back', steps: 2 },
    profileDelta: { caution: 1 },
  },

  {
    id: 'trap-004',
    nodeType: 'trap',
    title: 'Falešný checkpoint',
    logLabel: 'LOG [FALSE_CHECKPOINT]',
    text: 'Checkpoint vypadal legitimně. Měl správnou barvu, správný tvar, správné písmo. Jen ukládal do koše. Systém to považuje za feature. Feature byla přidána ve verzi 2.7 jako "optimalizace ukládání". Nikdo to tehdy nezpochybnil.',
    tags: ['trap', 'false', 'system'],
    effect: { kind: 'move_to', nodeId: 'start' },
    choices: [
      { id: 'accept', label: 'Přijmout výsledek', text: 'Zpět na začátek. Se vzpomínkami.', effect: { kind: 'move_to', nodeId: 'start' }, profileDelta: { tenderness: 1 } },
      { id: 'fight', label: 'Bojovat se systémem', text: 'Zůstaneš, ale s Šumem. Systém si to zapamatoval.', effect: { kind: 'gain_resource', resource: 'noise', amount: 3 }, profileDelta: { courage: 2, dominance: 1 } },
    ],
  },

  {
    id: 'trap-005',
    nodeType: 'trap',
    title: 'Kult acidové žluti',
    logLabel: 'LOG [ACID_CULT]',
    text: 'Přívrženci acidové žluti věří, že správná barva rozhraní vyřeší všechny problémy. Stojí v kruhu. Zpívají. Barva jejich rozhraní je opravdu žlutá. Jejich problémy trvají. Jsou ale hezky vypadající problémy.',
    tags: ['trap', 'cult', 'color', 'absurd'],
    effect: { kind: 'gain_resource', resource: 'noise', amount: 2 },
    choices: [
      { id: 'join', label: 'Přidat se k nim', text: 'Získáš Smích. Ztratíš část důstojnosti. Budeš spokojenější.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 2 }, profileDelta: { chaos: 2, tenderness: 1 } },
      { id: 'leave', label: 'Tiše odejít', text: 'Nezpívali dost hlasitě, aby tě zastavili.', effect: { kind: 'gain_resource', resource: 'noise', amount: 1 }, profileDelta: { caution: 1 } },
    ],
  },

  {
    id: 'trap-006',
    nodeType: 'trap',
    title: 'HR formulář — vynucená zpětná vazba',
    logLabel: 'LOG [HR_FEEDBACK]',
    text: 'Systém tě zastavil a požaduje zpětnou vazbu na tvůj výkon za poslední kolo. Dotazník má 18 otázek. Otázka 7 nemá správnou odpověď. Otázka 12 je prázdná. Otázka 18 je otázka 1 znovu, jen jinak formulovaná.',
    tags: ['trap', 'hr', 'feedback', 'bureaucracy'],
    effect: { kind: 'skip_turn', turns: 1 },
    profileDelta: { sarcasm: 1 },
  },

  // ── PORTAL ×4 ────────────────────────────────────────────────────────────

  {
    id: 'portal-001',
    nodeType: 'portal',
    title: 'Portál do neznáma',
    logLabel: 'LOG [PORTAL_OPEN]',
    text: 'Portál se otevřel s elegancí rozbité ledničky. Na druhé straně je jiné místo. To je vlastně celý bod portálu. Systém přesto vydal varování o "nestandardním přechodu". Standardní přechody jsou dveře. Toto jsou dveře pro lidi s odlišným vztahem ke geometrii.',
    tags: ['portal', 'transport', 'random'],
    effect: { kind: 'move_to', nodeId: 'portal-a2' },
    choices: [
      { id: 'enter', label: 'Vstoupit bez váhání', text: 'Odvážné. Pravděpodobně hloupé. Určitě nezapomenutelné.', effect: { kind: 'move_to', nodeId: 'portal-a2' }, profileDelta: { courage: 2, chaos: 1 } },
      { id: 'hesitate', label: 'Váhat a pak vstoupit', text: 'Váhání tě o nic nepřipravilo. Ale aspoň jsi váhal.', effect: { kind: 'gain_resource', resource: 'noise', amount: 1 }, profileDelta: { caution: 1 } },
    ],
  },

  {
    id: 'portal-002',
    nodeType: 'portal',
    title: 'Portál – nesprávná destinace',
    logLabel: 'LOG [PORTAL_WRONG]',
    text: 'Portál slíbil Jádro. Portál lhal. Portály lžou z principu, protože pravda by vyžadovala přesné souřadnice a přesné souřadnice jsou pro systémy, které se obtěžují s přesností. Tento systém se neobtěžuje.',
    tags: ['portal', 'lie', 'wrong'],
    effect: { kind: 'move_to', nodeId: 'trap-b' },
    profileDelta: { chaos: 1, sarcasm: 1 },
  },

  {
    id: 'portal-003',
    nodeType: 'portal',
    title: 'Portál se zpožděním',
    logLabel: 'LOG [PORTAL_DELAY]',
    text: 'Portál funguje. Jen s 47minutovým zpožděním, které v herním čase trvá jeden tah. Systém to nazývá "procesní latencí". Procesní latence je způsob, jak systém říká: "pracujeme na tom", aniž by pracoval na čemkoliv.',
    tags: ['portal', 'delay', 'system'],
    effect: { kind: 'draw_cards', amount: 1 },
    profileDelta: { caution: 1 },
  },

  {
    id: 'portal-004',
    nodeType: 'portal',
    title: 'Portál – volba',
    logLabel: 'LOG [PORTAL_CHOICE]',
    text: 'Portál se rozdělil. Nabízí dvě cesty. Levá vede blíž k Jádru. Pravá vede blíž ke Smíchu. Systém tě neinformuje, kde přesně skončíš. Systém věří v překvapení jako pedagogický nástroj.',
    tags: ['portal', 'choice', 'split'],
    effect: { kind: 'move_steps', steps: 3 },
    choices: [
      { id: 'left', label: 'Levá cesta (k Jádru)', text: 'Pokrok. Bez záruky příjemnosti.', effect: { kind: 'move_steps', steps: 4 }, profileDelta: { dominance: 1, courage: 1 } },
      { id: 'right', label: 'Pravá cesta (ke Smíchu)', text: 'Méně efektivní. Znatelně veselejší.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 2 }, profileDelta: { tenderness: 1, chaos: 1 } },
    ],
  },

  // ── MARKET (Tržiště) ×4 ──────────────────────────────────────────────────

  {
    id: 'market-001',
    nodeType: 'market',
    title: 'Tržiště vadných relikvií',
    logLabel: 'LOG [MARKET_RELICS]',
    text: 'Prodavač nabízí relikvie s pochybnou historií a zaručenou zárukou, která nezaručuje nic. Každá věc tady má cenu v Šumu a odměnu ve Smíchu. Tržiště funguje na principu vzájemné nedůvěry, což ho paradoxně dělá nejstabilnějším místem na mapě.',
    tags: ['market', 'trade', 'relics'],
    effect: { kind: 'draw_cards', amount: 2 },
    choices: [
      { id: 'buy', label: 'Koupit Kompas do špatného sektoru', text: '+1 karta. Kompas ti aktivně ukazuje špatným směrem. Je krásný.', effect: { kind: 'draw_cards', amount: 2 }, profileDelta: { chaos: 1, sarcasm: 1 } },
      { id: 'browse', label: 'Jen procházet', text: 'Nic nekoupíš. Ale prodavač si tě zapamatoval.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { caution: 1 } },
    ],
  },

  {
    id: 'market-002',
    nodeType: 'market',
    title: 'Relikvie – Tuleňův štít',
    logLabel: 'LOG [MARKET_SEAL]',
    text: 'Gumový tuleň s razítkem. Vypadá bezmocně. Je nepřekvapivě mocný. Tuleň byl přidán do systému jako easter egg v roce 2019 a nikdo ho od té doby nepochopil. Funguje přesto. Možná proto.',
    tags: ['market', 'relic', 'seal', 'protect'],
    effect: { kind: 'draw_cards', amount: 1 },
    profileDelta: { tenderness: 1 },
  },

  {
    id: 'market-003',
    nodeType: 'market',
    title: 'Tržiště – výměna Šumu',
    logLabel: 'LOG [MARKET_NOISE_TRADE]',
    text: 'Prodavač nabízí obchod: tvůj Šum za jeho problémy. Technicky vzato jsou jeho problémy menší. Ale technicky vzato je i výměna dobrovolná. Volnost je iluzí, ale tato iluze stojí za zvážení.',
    tags: ['market', 'trade', 'noise'],
    effect: { kind: 'lose_resource', resource: 'noise', amount: 2 },
    choices: [
      { id: 'trade', label: 'Vyměnit Šum za kartu', text: 'Horší bilance. Lepší ruce.', effect: { kind: 'draw_cards', amount: 1 }, profileDelta: { dominance: 1 } },
      { id: 'decline', label: 'Odmítnout obchod', text: 'Prodavač si to zapsal. Do čeho, to nevíš.', effect: { kind: 'gain_resource', resource: 'noise', amount: 1 }, profileDelta: { caution: 1 } },
    ],
  },

  {
    id: 'market-004',
    nodeType: 'market',
    title: 'Relikvie – Archivní pečeť',
    logLabel: 'LOG [MARKET_ARCHIVE_SEAL]',
    text: 'Pečeť z Archivu. Pravá nebo falzifikát, to záleží na tom, komu se ptáš. Archiv tvrdí, že pravá. Výrobce fal­zifikátů tvrdí, že taky pravá. Obě pravdy spolu perfektně koexistují, protože jim nikdo nepředstavil.',
    tags: ['market', 'archive', 'seal', 'authenticity'],
    effect: { kind: 'gain_resource', resource: 'fragments', amount: 1 },
    profileDelta: { caution: 1, cooperation: 1 },
  },

  // ── GLITCH (Glitch zkratka) ×4 ───────────────────────────────────────────

  {
    id: 'glitch-001',
    nodeType: 'glitch',
    title: 'Nelegální zkratka',
    logLabel: 'LOG [GLITCH_SHORTCUT_01]',
    text: 'Zkratka je nelegální, nestabilní a výrazně podezřelá. Takže samozřejmě vypadá výhodně. Systém ji tam nechal, protože ji nezpozoroval. Nebo zpozoroval a nechce ji odstranit, protože by musel přiznat, že existuje. Obojí je pravděpodobné.',
    tags: ['glitch', 'shortcut', 'risk'],
    effect: { kind: 'move_steps', steps: 4 },
    choices: [
      { id: 'take', label: 'Využít zkratku', text: 'Jdeš rychleji. Riskuješ pád.', effect: { kind: 'move_steps', steps: 4 }, profileDelta: { courage: 2, chaos: 1 } },
      { id: 'skip', label: 'Ignorovat a jít normálně', text: 'Pomalejší. Stabilnější. Méně zajímavé.', effect: { kind: 'gain_resource', resource: 'noise', amount: 0 }, profileDelta: { caution: 2 } },
    ],
  },

  {
    id: 'glitch-002',
    nodeType: 'glitch',
    title: 'Glitch – zpětný výstup',
    logLabel: 'LOG [GLITCH_REVERSE]',
    text: 'Zkratka tě vrátila. Nesprávným směrem. Systém to nazývá "alternativní trasou". Alternativní trasa je způsob, jak systém říká, že mu je líto, aniž by použil slovo "omluva".',
    tags: ['glitch', 'reverse', 'system'],
    effect: { kind: 'move_back', steps: 2 },
    profileDelta: { sarcasm: 1, chaos: 1 },
  },

  {
    id: 'glitch-003',
    nodeType: 'glitch',
    title: 'Glitch – přetížení',
    logLabel: 'LOG [GLITCH_OVERLOAD]',
    text: 'Glitch se přetížil při tvém průchodu. Spustil kaskádu vedlejších efektů, z nichž tři jsou zajímavé a jeden je nepříjemný. Systém tě požádal o trpělivost. Systém to myslí upřímně, což je na systém neobvyklé.',
    tags: ['glitch', 'overload', 'cascade'],
    effect: { kind: 'draw_cards', amount: 2 },
    profileDelta: { chaos: 2 },
  },

  {
    id: 'glitch-004',
    nodeType: 'glitch',
    title: 'Glitch – stabilní nestabilita',
    logLabel: 'LOG [GLITCH_STABLE]',
    text: 'Tento glitch je stabilně nestabilní. Funguje přesně tak, jak selhal. Vývojáři ho označili jako "akceptovaný defekt". Akceptovaný defekt je vývojářský způsob, jak říct, že oprava by trvala déle než konec světa.',
    tags: ['glitch', 'stable', 'defect'],
    effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 },
    choices: [
      { id: 'exploit', label: 'Využít defekt naplno', text: 'Technicky neférové. Prakticky vynikající.', effect: { kind: 'move_steps', steps: 3 }, profileDelta: { dominance: 1, chaos: 2 } },
      { id: 'report', label: 'Nahlásit defekt', text: 'Správce je nedostupný. Ale zpráva byla odeslána.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { cooperation: 1, caution: 1 } },
    ],
  },

  // ── SARKASMA ×4 ──────────────────────────────────────────────────────────

  {
    id: 'sarkasma-001',
    nodeType: 'sarkasma',
    title: 'Sarkasmin terminál – pravda',
    logLabel: 'LOG [SARKASMA_TERMINAL_01]',
    text: 'Terminál ti nabídl pravdu. Byla přesná, stručná a společensky nepoužitelná. Tedy kvalitní. Sarkasma věří, že nepříjemná pravda je lepší než příjemná lež, a to s entuziasmem, který naznačuje, že nikdy nezažila příjemnou lež.',
    tags: ['sarkasma', 'truth', 'social'],
    effect: { kind: 'draw_cards', amount: 1 },
    choices: [
      { id: 'accept', label: 'Přijmout pravdu', text: 'Bolí to. Pomáhá to. V tomto pořadí.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { courage: 1, tenderness: 1 } },
      { id: 'deflect', label: 'Změnit téma', text: 'Sarkasma si to zaznamenala. Pro příště.', effect: { kind: 'gain_resource', resource: 'noise', amount: 1 }, profileDelta: { sarcasm: 2 } },
    ],
  },

  {
    id: 'sarkasma-002',
    nodeType: 'sarkasma',
    title: 'Nepříjemná pravda – karta',
    logLabel: 'LOG [SARKASMA_TRUTH_CARD]',
    text: 'Sarkasma ti dává kartu "Nepříjemná pravda". Můžeš ji zahrát na jiného hráče. Karta jim řekne něco přesného a nepříjemného. Systém varuje, že přesné a nepříjemné věci mohou narušit přátelská setkání. Systém to říká bez lítosti.',
    tags: ['sarkasma', 'card', 'truth', 'social'],
    effect: { kind: 'draw_cards', amount: 1 },
    profileDelta: { sarcasm: 2 },
  },

  {
    id: 'sarkasma-003',
    nodeType: 'sarkasma',
    title: 'Sarkasmin komentář – live',
    logLabel: 'LOG [SARKASMA_LIVE_COMMENT]',
    text: 'Sarkasma komentuje tvůj herní styl v reálném čase. Komentář je přesný, trefný a opatřen přesně takovou mírou empatie, jakou si zaslouží strategie, kterou jsi právě předvedl. Tj. žádnou.',
    tags: ['sarkasma', 'comment', 'realtime'],
    effect: { kind: 'gain_resource', resource: 'laugh', amount: 2 },
    profileDelta: { sarcasm: 1, chaos: 1 },
  },

  {
    id: 'sarkasma-004',
    nodeType: 'sarkasma',
    title: 'Sarkasma – rada zdarma',
    logLabel: 'LOG [SARKASMA_FREE_ADVICE]',
    text: 'Sarkasma ti dává radu zdarma. Zdarma, protože by za ni nikdo nezaplatil. Rada je: "Přemýšlej o tom, co děláš." Rada je technicky správná. Rada je prakticky k ničemu. Sarkasma je spokojená.',
    tags: ['sarkasma', 'advice', 'free'],
    effect: { kind: 'draw_cards', amount: 2 },
    choices: [
      { id: 'thanks', label: 'Poděkovat', text: 'Sarkasma je zmatena. Ale trochu dojatá.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { tenderness: 2, cooperation: 1 } },
      { id: 'ignore', label: 'Ignorovat radu', text: 'Rada ignorována. Rada platí přesto.', effect: { kind: 'draw_cards', amount: 1 }, profileDelta: { dominance: 1 } },
    ],
  },

  // ── ARCHIVE ×4 ───────────────────────────────────────────────────────────

  {
    id: 'archive-001',
    nodeType: 'archive',
    title: 'Archiv – záznamy',
    logLabel: 'LOG [ARCHIVE_RECORDS]',
    text: 'Archiv uchovává záznamy o všem. Včetně tohoto momentu. Včetně tvého pohledu na záznamy. Archiv zaznamenal, že čteš záznamy, a přidal to do záznamů. Záznam o čtení záznamů byl přidán do záznamů. Archiv je spokojený.',
    tags: ['archive', 'records', 'meta'],
    effect: { kind: 'draw_cards', amount: 2 },
    profileDelta: { caution: 1, cooperation: 1 },
  },

  {
    id: 'archive-002',
    nodeType: 'archive',
    title: 'Archiv – ztracený fragment',
    logLabel: 'LOG [ARCHIVE_LOST_FRAGMENT]',
    text: 'Nalezl jsi fragment v archivu. Byl ztraceného jiného subjektu. Archiv ho klasifikoval jako "nevyzvednuté". Nevyzvednuté fragmenty zůstávají v archivu navěky, nebo dokud je někdo nevyzvedne. Právě jsi ho vyzvedl.',
    tags: ['archive', 'fragment', 'memory'],
    effect: { kind: 'gain_resource', resource: 'fragments', amount: 1 },
    profileDelta: { tenderness: 1, cooperation: 1 },
  },

  {
    id: 'archive-003',
    nodeType: 'archive',
    title: 'Archiv – uzavřená sekce',
    logLabel: 'LOG [ARCHIVE_CLOSED]',
    text: 'Sekce je uzavřena. Důvod: "Probíhající klasifikace." Klasifikace probíhá od roku 2021. Sekce pravděpodobně obsahuje odpovědi. Nebo jen prázdné police. Archiv neinformuje o tom, které z toho je pravda.',
    tags: ['archive', 'closed', 'mystery'],
    effect: { kind: 'gain_resource', resource: 'noise', amount: 1 },
    profileDelta: { caution: 2 },
  },

  {
    id: 'archive-004',
    nodeType: 'archive',
    title: 'Archiv – výpůjčka identity',
    logLabel: 'LOG [ARCHIVE_IDENTITY_LOAN]',
    text: 'Archiv nabízí dočasnou výpůjčku jiné identity. Na jeden tah. Čistě experimentálně. Systém upozorňuje, že vrácení identity není garantováno, ale to se stává jen ve 3 % případů. Archiv neupřesňuje, co se děje ve zbývajících 3 %.',
    tags: ['archive', 'identity', 'experiment'],
    effect: { kind: 'draw_cards', amount: 3 },
    choices: [
      { id: 'borrow', label: 'Půjčit si identitu', text: '+3 karty. Bude zajímavé to vrátit.', effect: { kind: 'draw_cards', amount: 3 }, profileDelta: { chaos: 2, courage: 1 } },
      { id: 'decline', label: 'Zůstat sám sebou', text: 'Stabilnější volba. Méně zajímavá.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { tenderness: 1 } },
    ],
  },

  // ── SHORTCUT ×4 ──────────────────────────────────────────────────────────

  {
    id: 'shortcut-001',
    nodeType: 'shortcut',
    title: 'Podezřelá cesta',
    logLabel: 'LOG [SUSPICIOUS_PATH]',
    text: 'Cesta vypadá jako zkratka. Možná je. Nebo vede do sektoru, kde žijí věci, které preferují anonymitu. Systém neuvedl, co jsou ty věci. Systém si toho možná sám není jistý. To je znepokojivé z jiného důvodu, než si myslíš.',
    tags: ['shortcut', 'suspicious', 'risk'],
    effect: { kind: 'move_steps', steps: 3 },
    choices: [
      { id: 'risk', label: 'Riskovat zkratku', text: 'Buď se dostaneš rychleji, nebo potkáš věci.', effect: { kind: 'move_steps', steps: 5 }, profileDelta: { courage: 2, chaos: 1 } },
      { id: 'safe', label: 'Jít bezpečnou cestou', text: 'Nic se nestane. To je dobré, i když nudné.', effect: { kind: 'move_steps', steps: 2 }, profileDelta: { caution: 2 } },
    ],
  },

  {
    id: 'shortcut-002',
    nodeType: 'shortcut',
    title: 'Zkratka přes zavřené dveře',
    logLabel: 'LOG [SHORTCUT_LOCKED_DOOR]',
    text: 'Dveře jsou zamčené. Klíč je dostupný za 5–7 pracovních dní. Pracovní dny v Prázdnotě jsou nespecifikované. Zamčené dveře lze obejít. To ale vyžaduje průchod přes Kult acidové žluti. Obojí má svá pro a svá proti.',
    tags: ['shortcut', 'locked', 'obstacle'],
    effect: { kind: 'draw_cards', amount: 1 },
    profileDelta: { caution: 1 },
  },

  {
    id: 'shortcut-003',
    nodeType: 'shortcut',
    title: 'Glitch zkratka – reset',
    logLabel: 'LOG [GLITCH_RESET_PATH]',
    text: 'Tato zkratka funguje přes reset sekce. Reset je rychlý. Reset je čistý. Reset nezachová tvou polohu, protože reset nezachová nic. Systém to považuje za efektivní. Ty to možná vnímáš jinak.',
    tags: ['shortcut', 'reset', 'glitch'],
    effect: { kind: 'move_back', steps: 1 },
    choices: [
      { id: 'use', label: 'Použít reset zkratku', text: 'Krok zpět, pak dva dopředu. Matematicky výhodné.', effect: { kind: 'move_steps', steps: 3 }, profileDelta: { chaos: 1, dominance: 1 } },
      { id: 'avoid', label: 'Obejít reset', text: 'Bezpečnější. Pomalejší. Bez dramatického resetu.', effect: { kind: 'gain_resource', resource: 'noise', amount: 1 }, profileDelta: { caution: 2 } },
    ],
  },

  {
    id: 'shortcut-004',
    nodeType: 'shortcut',
    title: 'Nelegální průchod portálem',
    logLabel: 'LOG [ILLEGAL_PORTAL_PASS]',
    text: 'Průchod portálem bez autorizace je nelegální. Nelegální věci jsou v Prázdnotě šedou zónou, protože zákon byl naprogramován v době, kdy portály ještě neexistovaly. Systém nemá páku. Ty možná máš.',
    tags: ['shortcut', 'illegal', 'portal'],
    effect: { kind: 'move_steps', steps: 4 },
    profileDelta: { courage: 1, chaos: 2 },
  },

  // ── BOSS ×4 ──────────────────────────────────────────────────────────────

  {
    id: 'boss-001',
    nodeType: 'boss',
    title: 'Nekonečný Formulář – setkání',
    logLabel: 'LOG [BOSS_ENDLESS_FORM_01]',
    text: 'Nekonečný Formulář se zhmotnil. Pole 47c je povinné. Nedefinované. Věčné. Formulář nechce tvůj podpis. Formulář chce tvé uznání, že existuje. Odmítl si vzít méně. Odmítl si vzít více. Chce přesně to, co nemůžeš dát: jistotu.',
    tags: ['boss', 'form', 'bureaucracy', 'endless'],
    effect: { kind: 'global_void', amount: 3 },
    choices: [
      { id: 'fight', label: 'Bojovat s formulářem', text: 'Odvaha za tři body. Formulář to zaznamenal.', effect: { kind: 'global_void', amount: 1 }, profileDelta: { courage: 3, dominance: 1 } },
      { id: 'fill', label: 'Vyplnit pole 47c', text: 'Napsal jsi "viz příloha B". Formulář uznal. Dočasně.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { sarcasm: 2, caution: 1 } },
    ],
  },

  {
    id: 'boss-002',
    nodeType: 'boss',
    title: 'Formulář eskaluje',
    logLabel: 'LOG [BOSS_ESCALATE]',
    text: 'Formulář přešel do fáze 2. Fáze 2 přidala pole 48a až 63f. Pole 55c vyžaduje popis tvé "systémové trajektorie za posledních 7 dnů". Den v Prázdnotě je subjektivní. Sedm dnů je tedy sedmkrát subjektivní.',
    tags: ['boss', 'escalate', 'phase2'],
    effect: { kind: 'global_void', amount: 2 },
    profileDelta: { sarcasm: 1, chaos: 1 },
  },

  {
    id: 'boss-003',
    nodeType: 'boss',
    title: 'Formulář – slabé místo',
    logLabel: 'LOG [BOSS_WEAKNESS]',
    text: 'Formulář má slabé místo: pole 47c přijímá libovolný vstup, pokud je zadán s dostatečnou sebejistotou. Sebejistota není ověřitelná. To je jeho chyba. To je možná tvá příležitost.',
    tags: ['boss', 'weakness', 'opportunity'],
    effect: { kind: 'gain_resource', resource: 'laugh', amount: 2 },
    choices: [
      { id: 'exploit', label: 'Využít slabé místo', text: 'Zaútočíš na formulář sebejistotou. Funguje to, pokud v to věříš.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 3 }, profileDelta: { courage: 2, dominance: 2 } },
      { id: 'wait', label: 'Počkat na ostatní', text: 'Solidarita. Pomalejší. Možná správnější.', effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 }, profileDelta: { cooperation: 2, tenderness: 1 } },
    ],
  },

  {
    id: 'boss-004',
    nodeType: 'boss',
    title: 'Formulář – finální verze',
    logLabel: 'LOG [BOSS_FINAL]',
    text: 'Nekonečný Formulář dosáhl verze 99.9. Verze 100 by znamenala kompletnost. Formulář se tomu vyhýbá z principu. Kompletní formulář by přestal existovat. Formulář preferuje existenci nad kompletností. To je možná první věc, v níž se rozumíte.',
    tags: ['boss', 'final', 'existence'],
    effect: { kind: 'global_void', amount: 1 },
    profileDelta: { tenderness: 1, sarcasm: 1 },
  },

  // ── VOID GLOBAL ×6 ───────────────────────────────────────────────────────

  {
    id: 'void-global-001',
    nodeType: 'void_global',
    title: 'Glitchka se nudí',
    logLabel: 'LOG [VOID_GLOBAL_GLITCHKA_BORED]',
    text: 'Glitchka se nudí. Toto je varovný signál. Glitchka se naposledy nudila v Cyklu 7 a výsledkem bylo přeuspořádání celé archivní topologie. Tentokrát chce jen předat karty. Každý hráč si vymění jednu kartu s hráčem nalevo. Pokud někdo protestuje, získá 1 Šum. Glitchka neuznává vlastnické právo, jen emocionální cirkulaci.',
    tags: ['void', 'glitchka', 'cards', 'social'],
    effect: { kind: 'pass_card_left' },
    profileDelta: { chaos: 1 },
  },

  {
    id: 'void-global-002',
    nodeType: 'void_global',
    title: 'Šumová bouře – systémový',
    logLabel: 'LOG [VOID_GLOBAL_NOISE_STORM]',
    text: 'Šumová bouře zasáhla celou mapu. Vznikla z kumulace nevyřešených emočních závislostí a jednoho špatně napsaného komentáře v kódu z roku 2018. Všichni hráči získávají 1 Šum. Systém vyjadřuje politování. Systém vyjadřoval politování i minulý měsíc. A ten předchozí.',
    tags: ['void', 'storm', 'noise', 'all_players'],
    effect: { kind: 'gain_resource', resource: 'noise', amount: 1 },
  },

  {
    id: 'void-global-003',
    nodeType: 'void_global',
    title: 'Sarkasma otevřela komentáře',
    logLabel: 'LOG [VOID_GLOBAL_SARKASMA_COMMENTS]',
    text: 'Sarkasma otevřela komentáře k aktuálnímu hernímu stavu. Komentáře jsou otevřené 3 minuty. Každý hráč se může vyjádřit. Nemusí. Vyjadřovat se není povinné. Ale Sarkasma si zapamatuje, kdo mlčel. Každý hráč dostane 1 Smích. Za účast. Za mlčení taky.',
    tags: ['void', 'sarkasma', 'social', 'laugh'],
    effect: { kind: 'gain_resource', resource: 'laugh', amount: 1 },
    profileDelta: { sarcasm: 1 },
  },

  {
    id: 'void-global-004',
    nodeType: 'void_global',
    title: 'Nekonečný Formulář aktualizoval podmínky',
    logLabel: 'LOG [VOID_GLOBAL_FORM_UPDATE]',
    text: 'Nekonečný Formulář aktualizoval podmínky použití. Podmínky jsou nyní o 847 stránek delší. Klíčová změna: bod 12.7.c nyní vyžaduje "projevení vědomé existence" při každém pohybu. Projevení vědomé existence není specifikováno. Prázdnota roste o 2.',
    tags: ['void', 'form', 'conditions', 'pressure'],
    effect: { kind: 'global_void', amount: 2 },
  },

  {
    id: 'void-global-005',
    nodeType: 'void_global',
    title: 'Portály se přesměrovaly',
    logLabel: 'LOG [VOID_GLOBAL_PORTALS_REDIRECT]',
    text: 'Všechny portály se přesměrovaly. Nové destinace jsou náhodné, ale systém ujišťuje, že "algoritmicky vyvážené". Algoritmická vyváženost znamená, že máš stejnou šanci dostat se blíže k Jádru nebo blíže ke startu. Systém to považuje za spravedlnost.',
    tags: ['void', 'portals', 'redirect', 'random'],
    effect: { kind: 'custom', key: 'redirect_portals' },
  },

  {
    id: 'void-global-006',
    nodeType: 'void_global',
    title: 'Výpadek gravitace v sektoru 7',
    logLabel: 'LOG [VOID_GLOBAL_GRAVITY_FAIL]',
    text: 'Gravitace v sektoru 7 selhala. Hráči v oblasti se pohybují nepředvídatelně. Systém vydal varování. Varování bylo vydáno poté, co gravitace selhal. Systém se omlouvá za pořadí událostí. Hráč s nejméně Smíchu se přesune na bezpečné pole.',
    tags: ['void', 'gravity', 'sector7', 'random'],
    effect: { kind: 'custom', key: 'gravity_fail' },
    profileDelta: { chaos: 1 },
  },
];

export function pickStoryEvent(
  nodeType: BoardNodeType | 'void_global',
  seed: string,
): { event: StoryEvent | undefined; nextSeed: string } {
  const matching = STORY_EVENTS.filter((e) => e.nodeType === nodeType);
  if (matching.length === 0) return { event: undefined, nextSeed: seed };
  const { item, nextSeed } = pickRandom(matching, seed);
  return { event: item, nextSeed };
}

export function getVoidGlobalEvents(): StoryEvent[] {
  return STORY_EVENTS.filter((e) => e.nodeType === 'void_global');
}

export function getEventById(id: string): StoryEvent | undefined {
  return STORY_EVENTS.find((e) => e.id === id);
}
