import type { SwipeCard } from '../cyklusTypes';

export const CHOICE_CARDS: Record<string, SwipeCard> = {

  incoming_message: {
    id: 'incoming_message',
    title: 'Příchozí zpráva',
    logLabel: 'INCOMING_MESSAGE',
    scene: 'Někdo čeká na odpověď. Systém měří tep, protože vztahy bez biometrie by zřejmě byly málo ponižující.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [INCOMING_MESSAGE]:</span> detekováno čekající vlákno vazby.</p><p class="text">Ve vzduchu zabliká zpráva. Neobsahuje jen text, ale i pauzu před odesláním, přetažený dech a drobnou hanbu, která se nevešla do notifikace.</p><p class="text">Někdo čeká. A Synthoma, ten nenápadný tyran s hezkou typografií, okamžitě měří, jak moc tě to bolí.</p>`,
    sceneFx: ['scene-choice', 'scene-bond', 'scene-message'],
    yesLabel: 'ODPOVĚDĚT',
    noLabel: 'IGNOROVAT',
    category: 'choice',
    rarity: 'common',
    tags: ['relation', 'bond', 'energy'],
    yes: { resultText: 'Odpověděl jsi. Někdo na druhé straně přestal dýchat nervózně.', effects: [{ type: 'stat', key: 'bond', amount: 8 }, { type: 'stat', key: 'energy', amount: -3 }, { type: 'profile', key: 'E', amount: 1 }, { type: 'profile', key: 'Fe', amount: 1 }], preview: { hint: 'Vazba ↑ · Energie ↓', statHints: { bond: 'up', energy: 'down' }, risk: 'low' } },
    no: { resultText: 'Ignoroval jsi. Ticho se stalo zprávou.', effects: [{ type: 'stat', key: 'bond', amount: -7 }, { type: 'stat', key: 'control', amount: 4 }, { type: 'profile', key: 'I', amount: 1 }, { type: 'profile', key: 'Ti', amount: 1 }], preview: { hint: 'Vazba ↓ · Kontrola ↑', statHints: { bond: 'down', control: 'up' }, risk: 'medium' } },
  },


  format_survivor_card: {
    id: 'format_survivor_card',
    title: 'Přeživší formátování',
    logLabel: 'META_POST_FORMAT',
    scene: 'Byl jsi formátován. Nebo skoro. Něco zůstalo. Systém to klasifikuje jako chybu. Ty to klasifikuješ jako sebe.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [POST_FORMAT]:</span> formátování neúplné. Zbytkový subjekt se hádá s protokolem.</p><p class="text">Bílý prostor kolem tebe nese stopy mazání. Ne krvavé. Horší. Čisté. Jako když někdo uklidí místo nehody dřív, než zjistí, kdo tam vlastně ležel.</p><p class="text">Něco zůstalo. Ne dost na důkaz. Dost na odpor. <span class="fx-outline is-lit">Já</span> se někdy nerodí jako jistota, ale jako chyba, která odmítla být opravena.</p><p class="dialogS">„Systém ti říká zbytek. Ty tomu říkáš já. Oba jste dramatičtí, ale tentokrát fandím tobě.“</p>`,
    sceneFx: ['scene-meta', 'scene-post-format', 'scene-identity', 'scene-survivor'],
    yesLabel: 'TRVAT NA TOM',
    noLabel: 'PŘIJMOUT NOVOU VERZI',
    category: 'choice',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'post_format' }],
    tags: ['meta', 'memory', 'low', 'death_history', 'post_format', 'empty_memory'],
    yes: {
      resultText: 'Trval jsi na tom, že jsi ty. Systém to zaznamenal jako anomálii. Anomálie jsou vzácné. Vzácné věci přežijí déle.',
      effects: [
        { type: 'stat', key: 'memory', amount: 7 },
        { type: 'stat', key: 'control', amount: -6 },
        { type: 'imprint', imprintId: 'archive_scent' },
        { type: 'profile', key: 'Fi', amount: 2 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↓ · imprint', statHints: { memory: 'up', control: 'down' }, risk: 'medium' },
    },
    no: {
      resultText: 'Přijal jsi novou verzi. Cítila se jinak. Seděla líp. Bylo to lepší nebo jen pohodlnější? Těžko říct.',
      effects: [
        { type: 'stat', key: 'control', amount: 8 },
        { type: 'stat', key: 'memory', amount: -5 },
        { type: 'profile', key: 'Te', amount: 1 },
        { type: 'profile', key: 'J', amount: 1 },
      ],
      preview: { hint: 'Kontrola ↑ · Paměť ↓', statHints: { control: 'up', memory: 'down' }, risk: 'medium' },
    },
  },


  dissolved_boundary_card: {
    id: 'dissolved_boundary_card',
    title: 'Kde skončíš ty a začnou ostatní',
    logLabel: 'META_BOND_HIGH',
    scene: 'Otázka nemá dobrou odpověď. Nebo má příliš mnoho. Nebo jsi ty ta odpověď a ještě to nevíš.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [DISSOLUTION]:</span> hranice subjektu rozpustila okraje. Vstup ostatních nevyžádán, ale úspěšný.</p><p class="text">Otázka stojí uprostřed místnosti jako zrcadlo bez skla: kde končíš ty a začínají ostatní? Odpovědi přicházejí všechny najednou, což je přesně to, co odpovědi dělat nemají.</p><p class="text">Vazba není vlastnictví. Není to ani záchrana. Je to most, který se musí umět zavřít, jinak se z něj stane veřejná komunikace skrz tvůj hrudník.</p><p class="dialogS">„Hranice nejsou nezdvořilé. Nezdvořilé je nastěhovat se někomu do duše a říkat tomu empatie.“</p>`,
    sceneFx: ['scene-meta', 'scene-bond-high', 'scene-boundary', 'scene-dissolution'],
    yesLabel: 'HLEDAT HRANICI',
    noLabel: 'OPUSTIT OTÁZKU',
    category: 'choice',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'dissolution' }],
    tags: ['meta', 'bond', 'high', 'death_history', 'dissolution', 'merge_cards'],
    yes: {
      resultText: 'Hledal jsi hranici. Nalezl jsi stín. Stín tvrdil, že je tvůj. Byl. Ale patřil ti, nebo tě patřilo jemu?',
      effects: [
        { type: 'stat', key: 'bond', amount: -8 },
        { type: 'stat', key: 'control', amount: 7 },
        { type: 'entityRelation', entity: 'shadow', delta: 2 },
        { type: 'profile', key: 'Ti', amount: 2 },
      ],
      preview: { hint: 'Vazba ↓ · Kontrola ↑ · Stín', statHints: { bond: 'down', control: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Opustil jsi otázku. Otázka zůstala. Otázky mají tuhý kořínek.',
      effects: [
        { type: 'stat', key: 'bond', amount: 5 },
        { type: 'stat', key: 'energy', amount: 3 },
        { type: 'profile', key: 'Ne', amount: 1 },
        { type: 'profile', key: 'P', amount: 1 },
      ],
      preview: { hint: 'Vazba ↑ · Energie ↑', statHints: { bond: 'up', energy: 'up' }, risk: 'low' },
    },
  },


  chaos_residue_card: {
    id: 'chaos_residue_card',
    title: 'Reziduum chaosu',
    logLabel: 'META_CONTROL_LOW',
    scene: 'Po chaosu zůstává reziduum. Není to chaos. Je to tvar, který chaos zanechal. A ten tvar jsi ty.',
    sceneHtml: `<p class="log fx-scanline"><span class="datastream">LOG [CHAOS_RESIDUE]:</span> po kolapsu zůstal tvar. Tvar se podobá subjektu, což je nepříjemně poetické.</p><p class="text">Chaos odešel. Ne slušně. Ne tiše. Jen po sobě nechal šmouhy, ohnuté hrany a zvláštní mapu z míst, kde jsi se skoro rozpadl.</p><p class="text">Reziduum není zbytek. Je to důkaz, že i rozpad má geometrii. A možná, velmi neochotně, i směr.</p><p class="dialogS">„Nejsi troska. Trosky jsou pasivní. Ty jsi spíš škoda s ambicemi.“</p>`,
    sceneFx: ['scene-meta', 'scene-control-low', 'scene-chaos', 'scene-residuum'],
    yesLabel: 'PŘIJMOUT TVAR',
    noLabel: 'ODOLAT TVARU',
    category: 'choice',
    rarity: 'rare',
    conditions: [{ type: 'unlockedPool', poolId: 'collapse_cards' }],
    tags: ['meta', 'control', 'low', 'death_history', 'collapse_cards', 'post_collapse'],
    yes: {
      resultText: 'Přijal jsi tvar. Byl nepravidelný, nepohodlný a překvapivě tvůj. Systém ho nezaznamená jako chybu. Tentokrát.',
      effects: [
        { type: 'stat', key: 'control', amount: 8 },
        { type: 'stat', key: 'energy', amount: 5 },
        { type: 'unlockPool', poolId: 'residuum_pool' },
        { type: 'profile', key: 'Ne', amount: 2 },
      ],
      preview: { hint: 'Kontrola ↑ · Energie ↑ · Reziduum', statHints: { control: 'up', energy: 'up' }, risk: 'medium' },
    },
    no: {
      resultText: 'Odolal jsi tvaru. Chaos si vybral jiný. Stejně tvůj, ale méně očekávaný.',
      effects: [
        { type: 'stat', key: 'memory', amount: 5 },
        { type: 'stat', key: 'control', amount: -4 },
        { type: 'profile', key: 'Si', amount: 1 },
      ],
      preview: { hint: 'Paměť ↑ · Kontrola ↓', statHints: { memory: 'up', control: 'down' }, risk: 'medium' },
    },
  },
};
