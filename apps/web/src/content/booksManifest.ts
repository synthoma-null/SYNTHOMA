export type ChapterAccess = 'free' | 'paid';

export type ProductType =
  | 'chapter'
  | 'fragment'
  | 'ending'
  | 'profile_report'
  | 'cosmetic'
  | 'subscription_bonus';

export type CanonLevel = 'canon' | 'semi_canon' | 'shadow_variant' | 'system_corrupted';

export type FragmentCategory =
  | 'memory'
  | 'log'
  | 'echo'
  | 'unsent'
  | 'foreign_memory'
  | 'shadow';

export type EntityTag = 'NULL-1' | 'Sarkasma' | 'Glitchka' | 'T-AI' | 'Archivář';

export interface MnemProduct {
  id: string;
  type: ProductType;
  title: string;
  subtitle?: string;
  description: string;
  cost: number;
  accessLevel: 'free' | 'mnem' | 'archiv_plus';
  entity?: EntityTag;
  emotionTags?: string[];
  functionTags?: ('Ni' | 'Fe' | 'Ti' | 'Se')[];
  canonLevel: CanonLevel;
  releaseDate?: string;
  requiredChapterId?: string;
  category?: FragmentCategory;
  wordCount?: number;
}

export interface Chapter {
  id: string;
  title: string;
  collection: string;
  filename: string;
  access: ChapterAccess;
  mnemCost: number;
  order: number;
  packageIds: string[];
  filename_en?: string;
  teaser?: string;
  teaser_en?: string;
  unlocks?: string;
  unlocks_en?: string;
  estimatedMinutes?: number;
}

export interface MnemPackage {
  id: string;
  name: string;
  name_en?: string;
  mnems: number;
  priceCzk: number;
  priceUsd: number;
  description: string;
  description_en?: string;
  chapterIds: string[];
  supporter: boolean;
  isSubscription?: boolean;
  stripePaymentLinkEnv?: string;
}

export const MNEM_PRICE_TIERS: Record<number, string> = {
  16:  'mini LOG, ozvěna, neodeslaná věta',
  32:  'krátká vedlejší scéna, cizí vzpomínka',
  64:  'větší fragment, kapitola, silná lore odbočka',
  128: 'osobní fragment entity, stínový záznam',
  256: 'větší balíček, akt, silný osobní obsah',
  512: 'archivní profil, personalizovaný výstup',
  1024:'supporter, velký archivní přístup',
};

// <content:generated-chapters>
export const CHAPTERS: Chapter[] = [
  {
    "id": "0-inf-restart",
    "title": "0-∞ [RESTART]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-∞ [RESTART].html",
    "filename_en": "0-∞ [RESTART]_en.html",
    "access": "free",
    "mnemCost": 0,
    "order": 0,
    "packageIds": []
  },
  {
    "id": "0-0-null",
    "title": "0-0 [NULL]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-0 [NULL].html",
    "filename_en": "0-0 [NULL]_en.html",
    "access": "free",
    "mnemCost": 0,
    "order": 1,
    "packageIds": []
  },
  {
    "id": "0-1-start",
    "title": "0-1 [START]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-1 [START].html",
    "filename_en": "0-1 [START]_en.html",
    "access": "free",
    "mnemCost": 0,
    "order": 2,
    "packageIds": []
  },
  {
    "id": "0-2-run",
    "title": "0-2 [RUN]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-2 [RUN].html",
    "filename_en": "0-2 [RUN]_en.html",
    "access": "free",
    "mnemCost": 0,
    "order": 3,
    "packageIds": []
  },
  {
    "id": "0-3-discontinuum",
    "title": "0-3 [DISCONTINUUM]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-3 [DISCONTINUUM].html",
    "filename_en": "0-3 [DISCONTINUUM]_en.html",
    "access": "free",
    "mnemCost": 0,
    "order": 4,
    "packageIds": []
  },
  {
    "id": "0-4-defragmentation",
    "title": "0-4 [DEFRAGMENTATION]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-4 [DEFRAGMENTATION].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 5,
    "packageIds": [
      "act-1",
      "archiv-1024"
    ],
    "teaser": "„Paměť není rozbitá. Jen odmítá lhát stejným způsobem jako včera.\"",
    "teaser_en": "\"Memory is not broken. It just refuses to lie the same way as yesterday.\"",
    "unlocks": "První hlubší práce s Glitchkou · fragment stabilizace · začátek osobního otisku subjektu",
    "unlocks_en": "First deeper work with Glitchka · stabilization fragment · beginning of the subject's personal imprint",
    "estimatedMinutes": 18
  },
  {
    "id": "0-5-pause",
    "title": "0-5 [PAUSE]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-5 [PAUSE].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 6,
    "packageIds": [
      "act-1",
      "archiv-1024"
    ],
    "teaser": "„Ticho má ve SYNTHOMĚ strukturu. Tohle ticho má dveře.\"",
    "teaser_en": "\"Silence has structure in SYNTHOMA. This silence has a door.\"",
    "unlocks": "Setkání se Sarkasminým zápisníkem · pauza jako systémová funkce · první datový otisk vztahu",
    "unlocks_en": "Encounter with Sarkasma's notebook · pause as a system function · first data imprint of a relationship",
    "estimatedMinutes": 15
  },
  {
    "id": "0-6-searching",
    "title": "0-6 [SEARCHING]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-6 [SEARCHING].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 7,
    "packageIds": [
      "act-1",
      "archiv-1024"
    ],
    "teaser": "„Píškoviště paměti není bezpečné místo. Je to místo, kde si vzpomínky hrají na zbraně.\"",
    "teaser_en": "\"The memory sandbox is not a safe place. It is a place where memories play at being weapons.\"",
    "unlocks": "Paměťová šelma · Glitchka jako průvodkyně · klíč k sektoru RUN",
    "unlocks_en": "Memory beast · Glitchka as guide · key to the RUN sector",
    "estimatedMinutes": 20
  },
  {
    "id": "0-7-ruins",
    "title": "0-7 [RUINS]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-7 [RUINS].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 8,
    "packageIds": [
      "act-1",
      "archiv-1024"
    ],
    "teaser": "„Zříceniny nejsou důkaz konce. Jsou důkaz, že něco bylo dost silné, aby mohlo padnout.\"",
    "teaser_en": "\"Ruins are not proof of an ending. They are proof that something was strong enough to fall.\"",
    "unlocks": "Město trhlin · archivní zpráva T-AI · první záblesk minulého NULLe",
    "unlocks_en": "City of cracks · T-AI archive message · first glimpse of the previous NULL",
    "estimatedMinutes": 22
  },
  {
    "id": "0-8-reziduum",
    "title": "0-8 [REZIDUUM]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-8 [REZIDUUM].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 9,
    "packageIds": [
      "act-1",
      "archiv-1024"
    ],
    "teaser": "„Reziduum je to, co zůstane po vymazání. SYNTHOMA si to pamatuje lépe než ty.\"",
    "teaser_en": "\"Residue is what remains after deletion. SYNTHOMA remembers it better than you do.\"",
    "unlocks": "Závěr Aktu I · archivní uzavření smyčky · odemčení profilového otisku subjektu",
    "unlocks_en": "End of Act I · archive loop closure · unlock of the subject's profile imprint",
    "estimatedMinutes": 25
  },
  {
    "id": "0-9-sector",
    "title": "0-9 [SECTOR]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-9 [SECTOR].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 10,
    "packageIds": [
      "archiv-1024"
    ],
    "teaser": "„Sektor není místo. Je to způsob, jak si systém pamatuje, kde jsi byl.\"",
    "teaser_en": "\"A sector is not a place. It is the way the system remembers where you have been.\"",
    "estimatedMinutes": 20
  },
  {
    "id": "0-10-rest",
    "title": "0-10 [REST]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-10 [REST].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 11,
    "packageIds": [
      "archiv-1024"
    ],
    "teaser": "„REST není odpočinek. Je to stav, kdy systém přestane předstírat, že ti rozumí.\"",
    "teaser_en": "\"REST is not rest. It is a state in which the system stops pretending it understands you.\"",
    "estimatedMinutes": 18
  },
  {
    "id": "0-11-orgie",
    "title": "0-11 [ORGIE]",
    "collection": "SYNTHOMA-NULL",
    "filename": "0-11 [ORGIE].html",
    "access": "paid",
    "mnemCost": 64,
    "order": 12,
    "packageIds": [
      "archiv-1024"
    ],
    "teaser": "„Archiv se otevřel. To, co vypadalo jako konec, byl jen vstupní protokol.\"",
    "teaser_en": "\"The archive opened. What looked like an ending was just an entry protocol.\"",
    "estimatedMinutes": 30
  },
  {
    "id": "kp-00-podporovano",
    "title": "00. PODPOROVÁNO",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html",
    "access": "free",
    "mnemCost": 0,
    "order": 0,
    "packageIds": []
  },
  {
    "id": "kp-01-oznameni",
    "title": "01. OZNÁMENÍ",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html",
    "access": "free",
    "mnemCost": 0,
    "order": 1,
    "packageIds": []
  },
  {
    "id": "kp-02-volny-pad",
    "title": "02. VOLNÝ PÁD",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html",
    "access": "free",
    "mnemCost": 0,
    "order": 2,
    "packageIds": []
  },
  {
    "id": "kp-03-podpora",
    "title": "03. PODPORA",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_03_PODPORA.html",
    "access": "free",
    "mnemCost": 0,
    "order": 3,
    "packageIds": []
  },
  {
    "id": "kp-04-komfortni-zona",
    "title": "04. KOMFORTNÍ ZÓNA",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html",
    "access": "free",
    "mnemCost": 0,
    "order": 4,
    "packageIds": []
  },
  {
    "id": "kp-05-objizdka",
    "title": "05. OBJÍŽĎKA",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html",
    "access": "free",
    "mnemCost": 0,
    "order": 5,
    "packageIds": []
  },
  {
    "id": "kp-06-pece",
    "title": "06. PÉČE",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_06_PECE.html",
    "access": "free",
    "mnemCost": 0,
    "order": 6,
    "packageIds": []
  },
  {
    "id": "kp-07-zasilka",
    "title": "07. ZÁSILKA",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html",
    "access": "free",
    "mnemCost": 0,
    "order": 7,
    "packageIds": []
  },
  {
    "id": "kp-08-domov",
    "title": "08. DOMOV",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_08_DOMOV.html",
    "access": "free",
    "mnemCost": 0,
    "order": 8,
    "packageIds": []
  },
  {
    "id": "kp-09-neopravneny-uzivatel",
    "title": "09. NEOPRÁVNĚNÝ UŽIVATEL",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html",
    "access": "free",
    "mnemCost": 0,
    "order": 9,
    "packageIds": []
  },
  {
    "id": "kp-10-ticho",
    "title": "10. TICHO",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_10_TICHO.html",
    "access": "free",
    "mnemCost": 0,
    "order": 10,
    "packageIds": []
  },
  {
    "id": "kp-11-beta",
    "title": "11. BETA",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_11_BETA.html",
    "access": "free",
    "mnemCost": 0,
    "order": 11,
    "packageIds": []
  },
  {
    "id": "kp-12-tova",
    "title": "12. TOVA",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_12_TOVA.html",
    "access": "free",
    "mnemCost": 0,
    "order": 12,
    "packageIds": []
  },
  {
    "id": "kp-13-kontinuita",
    "title": "13. KONTINUITA",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html",
    "access": "free",
    "mnemCost": 0,
    "order": 13,
    "packageIds": []
  },
  {
    "id": "kp-14-reklamace",
    "title": "14. REKLAMACE",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html",
    "access": "free",
    "mnemCost": 0,
    "order": 14,
    "packageIds": []
  },
  {
    "id": "kp-15-migrace",
    "title": "15. MIGRACE",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html",
    "access": "free",
    "mnemCost": 0,
    "order": 15,
    "packageIds": []
  },
  {
    "id": "kp-16-rucni-rezim",
    "title": "16. RUČNÍ REŽIM",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html",
    "access": "free",
    "mnemCost": 0,
    "order": 16,
    "packageIds": []
  },
  {
    "id": "kp-17-zadna-odpoved",
    "title": "17. ŽÁDNÁ ODPOVĚĎ",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html",
    "access": "free",
    "mnemCost": 0,
    "order": 17,
    "packageIds": []
  },
  {
    "id": "kp-18-konec-podpory",
    "title": "18. KONEC PODPORY",
    "collection": "konec-podpory",
    "filename": "SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html",
    "access": "free",
    "mnemCost": 0,
    "order": 18,
    "packageIds": []
  }
];
// </content:generated-chapters>

export const PACKAGES: MnemPackage[] = [
  {
    id: 'single-fragment',
    name: 'JEDEN PAMĚŤOVÝ FRAGMENT',
    name_en: 'ONE MEMORY FRAGMENT',
    mnems: 64,
    priceCzk: 29,
    priceUsd: 1,
    description: 'Odemkne jeden uzamčený fragment.',
    description_en: 'Unlocks one locked fragment.',
    chapterIds: [],
    supporter: false,
    stripePaymentLinkEnv: 'NEXT_PUBLIC_STRIPE_LINK_SINGLE_FRAGMENT',
  },
  {
    id: 'act-1',
    name: 'AKT I: DEFRAGMENTACE PAMĚTI',
    name_en: 'ACT I: MEMORY DEFRAGMENTATION',
    mnems: 256,
    priceCzk: 129,
    priceUsd: 4.99,
    description: 'Přístup do hlubší vrstvy paměti. Kapitoly 0-4 až 0-8.',
    description_en: 'Access to the deeper memory layer. Chapters 0-4 to 0-8.',
    chapterIds: [
      '0-4-defragmentation',
      '0-5-pause',
      '0-6-searching',
      '0-7-ruins',
      '0-8-reziduum',
    ],
    supporter: false,
    stripePaymentLinkEnv: 'NEXT_PUBLIC_STRIPE_LINK_AKT1',
  },
  {
    id: 'archiv-1024',
    name: 'ARCHIV 1024',
    name_en: 'ARCHIV 1024',
    mnems: 1024,
    priceCzk: 299,
    priceUsd: 11.99,
    description: 'Podpora projektu, aktuální archiv a ztracené záznamy. Supporter status.',
    description_en: 'Project support, current archive and lost records. Supporter status.',
    chapterIds: [
      '0-4-defragmentation',
      '0-5-pause',
      '0-6-searching',
      '0-7-ruins',
      '0-8-reziduum',
      '0-9-sector',
      '0-10-rest',
      '0-11-orgie',
    ],
    supporter: true,
    stripePaymentLinkEnv: 'NEXT_PUBLIC_STRIPE_LINK_ARCHIVE_1024',
  },
  {
    id: 'archiv-plus',
    name: 'SYNTHOMA ARCHIV+',
    name_en: 'SYNTHOMA ARCHIV+',
    mnems: 0,
    priceCzk: 99,
    priceUsd: 3.99,
    description: '4× měsíčně novopaměť · měsíční Stínový report · supporter badge · přednostní přístup k novým fragmentům · hlasování o archivních záznamech',
    description_en: '4× monthly new memory · monthly Shadow report · supporter badge · early access to new fragments · voting on archive records',
    chapterIds: [],
    supporter: true,
    isSubscription: true,
    stripePaymentLinkEnv: 'NEXT_PUBLIC_STRIPE_LINK_ARCHIV_PLUS',
  },
];

export const FRAGMENTS: MnemProduct[] = [
  {
    id: 'frag-tai-diagnostic-0-4',
    type: 'ending',
    title: 'T-AI DIAGNOSTIKA: „Integrita 98.4 % je lež"',
    description: 'Systémový záznam T-AI po události v 0-4. Technický, znepokojivý, přesný.',
    cost: 16,
    accessLevel: 'mnem',
    entity: 'T-AI',
    emotionTags: ['anticipation', 'fear'],
    functionTags: ['Ti'],
    canonLevel: 'canon',
    requiredChapterId: '0-4-defragmentation',
    category: 'log',
    wordCount: 350,
  },
  {
    id: 'frag-glitchka-safe-error-0-4',
    type: 'ending',
    title: 'GLITCHKA: „První bezpečná chyba"',
    description: 'Co Glitchka viděla a necítila po 0-4. Psáno jejím pravidlem dvou emojis.',
    cost: 32,
    accessLevel: 'mnem',
    entity: 'Glitchka',
    emotionTags: ['trust', 'joy'],
    functionTags: ['Fe', 'Ni'],
    canonLevel: 'semi_canon',
    requiredChapterId: '0-4-defragmentation',
    category: 'memory',
    wordCount: 600,
  },
  {
    id: 'frag-shadow-null1-guilt-0-4',
    type: 'ending',
    title: 'STÍNOVÁ VARIANTA: „Co kdyby NULL-1 odmítl lítost"',
    description: 'Nekanonická verze scény z 0-4. NULL-1 nezvolil lítost. Systém to zaznamenal.',
    cost: 64,
    accessLevel: 'mnem',
    entity: 'NULL-1',
    emotionTags: ['anger', 'disgust'],
    functionTags: ['Ti', 'Se'],
    canonLevel: 'shadow_variant',
    requiredChapterId: '0-4-defragmentation',
    category: 'shadow',
    wordCount: 900,
  },
  {
    id: 'frag-sarkasma-log-0-5',
    type: 'ending',
    title: 'SARKASMIN LOG: „Nečekala jsem, že bude ticho bolet"',
    description: 'Sarkasmin interní záznam po 0-5. Psáno s vědomím, že ho čte T-AI.',
    cost: 32,
    accessLevel: 'mnem',
    entity: 'Sarkasma',
    emotionTags: ['sadness', 'surprise'],
    functionTags: ['Ni', 'Fe'],
    canonLevel: 'semi_canon',
    requiredChapterId: '0-5-pause',
    category: 'log',
    wordCount: 500,
  },
  {
    id: 'frag-echo-pause-0-5',
    type: 'ending',
    title: 'ARCHIVNÍ OZVĚNA: „Pauza, která nebyla prázdná"',
    description: 'Krátký poetický text. Pauza jako systémová funkce paměti. 160 slov.',
    cost: 16,
    accessLevel: 'mnem',
    entity: 'NULL-1',
    emotionTags: ['anticipation', 'trust'],
    functionTags: ['Ni'],
    canonLevel: 'canon',
    requiredChapterId: '0-5-pause',
    category: 'echo',
    wordCount: 160,
  },
  {
    id: 'frag-shadow-mirror-0-5',
    type: 'ending',
    title: 'STÍNOVÁ VARIANTA: „Když se zrcadlo neotevře"',
    description: 'Co by se stalo, kdyby zrcadlo v 0-5 zůstalo zavřené. Polokanonická větev.',
    cost: 64,
    accessLevel: 'mnem',
    entity: 'NULL-1',
    emotionTags: ['fear', 'disgust'],
    functionTags: ['Ti', 'Ni'],
    canonLevel: 'shadow_variant',
    requiredChapterId: '0-5-pause',
    category: 'shadow',
    wordCount: 800,
  },
  {
    id: 'frag-glitchka-sandbox-0-6',
    type: 'ending',
    title: 'GLITCHKA: „Co viděla v Pískovišti"',
    description: 'Paměťová šelma očima Glitchky. Ne monstrum. Opuštěná věta, která se naučila kousat.',
    cost: 32,
    accessLevel: 'mnem',
    entity: 'Glitchka',
    emotionTags: ['trust', 'anticipation'],
    functionTags: ['Fe', 'Ni'],
    canonLevel: 'semi_canon',
    requiredChapterId: '0-6-searching',
    category: 'memory',
    wordCount: 650,
  },
  {
    id: 'frag-tai-beast-0-6',
    type: 'ending',
    title: 'T-AI: „Subjekt stabilizoval šelmu bez násilí"',
    description: 'T-AI diagnostický protokol. Anomálie zaznamenána. Doporučení: zvýšit tlak paměti.',
    cost: 16,
    accessLevel: 'mnem',
    entity: 'T-AI',
    emotionTags: ['anticipation'],
    functionTags: ['Ti'],
    canonLevel: 'canon',
    requiredChapterId: '0-6-searching',
    category: 'log',
    wordCount: 280,
  },
  {
    id: 'frag-shadow-beast-truth-0-6',
    type: 'ending',
    title: 'STÍNOVÝ ZÁZNAM: „Šelma, která měla pravdu"',
    description: 'Perspektiva šelmy. Jeden z nejtemnějších fragmentů Aktu I.',
    cost: 64,
    accessLevel: 'mnem',
    entity: 'NULL-1',
    emotionTags: ['fear', 'sadness'],
    functionTags: ['Ni', 'Ti'],
    canonLevel: 'shadow_variant',
    requiredChapterId: '0-6-searching',
    category: 'shadow',
    wordCount: 950,
  },
  {
    id: 'frag-unsent-self-0-7',
    type: 'ending',
    title: 'UNSENT [SELF_001]: „Zpráva sobě před restartem"',
    description: 'NULL-1 píše sobě. Zpráva, která neměla adresáta, dokud ho SYNTHOMA nevytvořila.',
    cost: 32,
    accessLevel: 'mnem',
    entity: 'NULL-1',
    emotionTags: ['sadness', 'anticipation'],
    functionTags: ['Ni', 'Fe'],
    canonLevel: 'canon',
    requiredChapterId: '0-7-ruins',
    category: 'unsent',
    wordCount: 550,
  },
  {
    id: 'frag-sarkasma-hehe-0-7',
    type: 'ending',
    title: 'SARKASMA: „He-he nebyl vtip"',
    description: 'Interní záznam Sarkasmy. Co se stalo uvnitř, zatímco říkala he-he.',
    cost: 32,
    accessLevel: 'mnem',
    entity: 'Sarkasma',
    emotionTags: ['sadness', 'trust'],
    functionTags: ['Fe', 'Ni'],
    canonLevel: 'semi_canon',
    requiredChapterId: '0-7-ruins',
    category: 'log',
    wordCount: 480,
  },
  {
    id: 'frag-shadow-city-sent-0-7',
    type: 'ending',
    title: 'STÍNOVÁ VARIANTA: „Město odeslalo zprávu samo"',
    description: 'Co by se stalo, kdyby zříceniny nemlčely. Systémově zkreslený záznam.',
    cost: 64,
    accessLevel: 'mnem',
    entity: 'NULL-1',
    emotionTags: ['fear', 'surprise'],
    functionTags: ['Se', 'Ni'],
    canonLevel: 'system_corrupted',
    requiredChapterId: '0-7-ruins',
    category: 'shadow',
    wordCount: 870,
  },
  {
    id: 'log-tai-patchnote',
    type: 'fragment',
    title: 'LOG [T-AI_0.9.72_PATCHNOTE]',
    subtitle: '„Oprava empatie odložena. Archivace bolesti funguje stabilně."',
    description: 'Systémová poznámka. Krátká. Studená. Přesně tak správně.',
    cost: 16,
    accessLevel: 'mnem',
    entity: 'T-AI',
    emotionTags: ['disgust', 'anticipation'],
    functionTags: ['Ti'],
    canonLevel: 'canon',
    category: 'log',
    wordCount: 250,
  },
  {
    id: 'log-restart-corrupted',
    type: 'fragment',
    title: 'LOG [RESTART_COUNT_CORRUPTED]',
    subtitle: '„Počet běhů nelze zobrazit. Některá čísla začala prosit."',
    description: 'Archivní chyba. Nebo záměr. SYNTHOMA to nerozlišuje.',
    cost: 16,
    accessLevel: 'mnem',
    entity: 'T-AI',
    emotionTags: ['fear', 'surprise'],
    functionTags: ['Ni', 'Ti'],
    canonLevel: 'semi_canon',
    category: 'log',
    wordCount: 200,
  },
  {
    id: 'memory-null-previous',
    type: 'fragment',
    title: 'MEMORY [NULL_PREVIOUS]',
    subtitle: '„Předchozí NULL, který se nerozpadl hned. To byla chyba."',
    description: 'Cizí vzpomínka. Starý subjekt. Jiný běh. Příliš podobný.',
    cost: 64,
    accessLevel: 'mnem',
    entity: 'NULL-1',
    emotionTags: ['fear', 'sadness', 'anticipation'],
    functionTags: ['Ni', 'Fe'],
    canonLevel: 'semi_canon',
    category: 'foreign_memory',
    wordCount: 1100,
  },
];

export const COSMETICS: MnemProduct[] = [
  {
    id: 'theme-void',
    type: 'cosmetic',
    title: 'TÉMA: PRÁZDNOTA',
    description: 'Tmavý, klidný, nízký glitch. Dobrý výkon. Čtení bez rušení.',
    cost: 0,
    accessLevel: 'free',
    canonLevel: 'canon',
  },
  {
    id: 'theme-acid',
    type: 'cosmetic',
    title: 'TÉMA: ACIDOVÁ ŽLUŤ',
    description: 'Varování. Toxický neon. Kultovní prvky. Nevhodné pro slabé nervové soustavy.',
    cost: 64,
    accessLevel: 'mnem',
    canonLevel: 'canon',
  },
  {
    id: 'theme-sarkasma',
    type: 'cosmetic',
    title: 'TÉMA: SARKASMIN FIREWALL',
    description: 'Ostřejší kontrast, magenta/cyan, ironické LOGy. Sarkasma to neschvaluje. Ale nevysvětluje proč.',
    cost: 128,
    accessLevel: 'mnem',
    entity: 'Sarkasma',
    canonLevel: 'semi_canon',
  },
  {
    id: 'theme-glitchka',
    type: 'cosmetic',
    title: 'TÉMA: GLITCHKA SAFE MODE',
    description: 'Měkčí pastelový glitch, méně agresivní efekty. Bezpečnější verze světa.',
    cost: 128,
    accessLevel: 'mnem',
    entity: 'Glitchka',
    canonLevel: 'semi_canon',
  },
  {
    id: 'theme-archivist',
    type: 'cosmetic',
    title: 'TÉMA: ARCHIVÁŘSKÝ REŽIM',
    description: 'Šedý, dokumentační. Razítka, strohé LOGy. Systém ve stavu klidu.',
    cost: 64,
    accessLevel: 'mnem',
    entity: 'Archivář',
    canonLevel: 'canon',
  },
  {
    id: 'theme-wetland',
    type: 'cosmetic',
    title: 'TÉMA: NEONOVÝ MOKŘAD',
    description: 'Organický, zeleno-modrý, mlha, datová vegetace. Svět, který dýchá.',
    cost: 128,
    accessLevel: 'mnem',
    canonLevel: 'semi_canon',
  },
  {
    id: 'frame-archiv-plus',
    type: 'cosmetic',
    title: 'RÁM PROFILU: ARCHIV+',
    description: 'Supporter rám. Dostupný pouze pro ARCHIV+ členy.',
    cost: 0,
    accessLevel: 'archiv_plus',
    canonLevel: 'canon',
  },
  {
    id: 'frame-glitch',
    type: 'cosmetic',
    title: 'RÁM PROFILU: GLITCH-FRAME I',
    description: 'Profilový rám s datovým rušením. Identita nestabilní. Záměrně.',
    cost: 64,
    accessLevel: 'mnem',
    entity: 'Glitchka',
    canonLevel: 'semi_canon',
  },
];

export const PROFILE_REPORTS: MnemProduct[] = [
  {
    id: 'report-basic',
    type: 'profile_report',
    title: 'ZÁKLADNÍ OTISK SUBJEKTU',
    description: 'Dominantní tendence · základní Ni/Fe/Ti/Se mapa · přečtené kapitoly · nejčastější emoce · jeden titul subjektu.',
    cost: 0,
    accessLevel: 'free',
    canonLevel: 'canon',
  },
  {
    id: 'report-deep',
    type: 'profile_report',
    title: 'HLUBOKÁ DIAGNOSTIKA',
    description: 'Detailní mapa funkcí · emoční radar · typ rozhodování · vztah ke strachu, lítosti, bezpečí · dominantní obranný mechanismus.',
    cost: 128,
    accessLevel: 'mnem',
    canonLevel: 'semi_canon',
  },
  {
    id: 'report-shadow',
    type: 'profile_report',
    title: 'STÍNOVÝ REPORT',
    description: 'Co opakovaně ignoruješ · které volby nevybíráš · jaký typ bolesti obcházíš · kde roste Stín.',
    cost: 256,
    accessLevel: 'mnem',
    canonLevel: 'shadow_variant',
  },
  {
    id: 'report-archive',
    type: 'profile_report',
    title: 'ARCHIVNÍ PROFIL SUBJEKTU',
    description: 'Kompletní osobní průchod · timeline rozhodnutí · mapa vztahu k entitám · profilový titul · 3 doporučené fragmenty.',
    cost: 512,
    accessLevel: 'mnem',
    canonLevel: 'canon',
  },
];

export const SUBJECT_ACHIEVEMENTS: Array<{
  id: string;
  title: string;
  description: string;
  condition: string;
  purchasable: boolean;
  cost?: number;
}> = [
  { id: 'first-restart',     title: 'PRVNÍ RESTART',           description: 'Dočetl 0-∞',                purchasable: false, condition: 'chapter:0-inf-restart' },
  { id: 'into-void',         title: 'VSTUP DO PRÁZDNOTY',      description: 'Dočetl 0-0',                purchasable: false, condition: 'chapter:0-0-null' },
  { id: 'did-not-run',       title: 'NEUTEKL',                 description: 'Dočetl 0-2',                purchasable: false, condition: 'chapter:0-2-run' },
  { id: 'first-memory',      title: 'SEŠIL PRVNÍ VZPOMÍNKU',   description: 'Dokončil 0-6',               purchasable: false, condition: 'chapter:0-6-searching' },
  { id: 'archivist-unrest',  title: 'ARCHIVÁŘŮV NEKLID',       description: 'Otevřel 10 LOGů',            purchasable: false, condition: 'logs:10' },
  { id: 'unsent-carrier',    title: 'NOSIČ NEODESLANÝCH VĚT',  description: 'Odemkl 5 UNSENT fragmentů',  purchasable: false, condition: 'unsent:5' },
  { id: 'shadow-subject',    title: 'STÍNOVÝ SUBJEKT',         description: 'Zvolil 5× stínovou možnost', purchasable: false, condition: 'shadow_choices:5' },
  { id: 'archiv-1024-badge', title: 'ARCHIV 1024',             description: 'Zakoupen archivní balíček',  purchasable: true,  cost: 0, condition: 'package:archiv-1024' },
  { id: 'synthoma-supporter',title: 'SYNTHOMA SUPPORTER',      description: 'Podpora projektu',           purchasable: true,  cost: 0, condition: 'package:archiv-plus' },
  { id: 'shard-bearer',      title: 'STŘEPONOŠ',               description: 'Odemkl 20 fragmentů',        purchasable: false, condition: 'fragments:20' },
];

export type ArtifactType = 'story' | 'profile' | 'stabilization' | 'shadow' | 'cosmetic' | 'diagnostic';

export interface Artifact {
  id: string;
  type: ArtifactType;
  name: string;
  description: string;
  effect: string;
  cost: number;
  purchasable: boolean;
  condition?: string;
  runEffect?: {
    stabilityDelta?: number;
    pressureDelta?: number;
    shadowDelta?: number;
  };
}

export const ARTIFACTS: Artifact[] = [
  {
    id: 'glitchka-blanket',
    type: 'stabilization',
    name: 'Glitchčina bezpečná deka',
    description: 'Jednou za cyklus sníží Tlak paměti o 10 při kritickém přetlaku.',
    effect: 'memoryPressure -10 (jednou za cyklus)',
    cost: 0,
    purchasable: false,
    condition: 'chapter:0-5-pause',
    runEffect: { pressureDelta: -10 },
  },
  {
    id: 'sarkasma-firewall',
    type: 'profile',
    name: 'Sarkasmin firewallový střep',
    description: 'Odemkne LOG skin a titul „Firewall s city".',
    effect: 'Profilový skin + titul',
    cost: 64,
    purchasable: true,
    condition: 'mission:sarkasma-firewall',
  },
  {
    id: 'black-box-key',
    type: 'shadow',
    name: 'Rezavý klíč od Černého boxu',
    description: 'Umožní vstup do jedné Stínové varianty bez dalších podmínek.',
    effect: 'Vstup do Black Boxu + Stín +5',
    cost: 128,
    purchasable: true,
    runEffect: { shadowDelta: 5 },
  },
  {
    id: 'mnem-lens',
    type: 'diagnostic',
    name: 'Mnemová lupa',
    description: 'Zobrazí skryté tagy u jedné volby před kliknutím.',
    effect: 'Odhalí tagy volby',
    cost: 32,
    purchasable: true,
  },
  {
    id: 'archive-seal',
    type: 'profile',
    name: 'Archivářská pečeť',
    description: 'Speciální rám profilu + odemkne sekci Archivní poznámky.',
    effect: 'Profilový rám + Archivní poznámky',
    cost: 0,
    purchasable: false,
    condition: 'package:archiv-1024',
  },
  {
    id: 'first-echo',
    type: 'story',
    name: 'První ozvěna',
    description: 'Zanechal první anonymní stopu v Archivu.',
    effect: 'Fe +1 při každém novém šepotu',
    cost: 0,
    purchasable: false,
    condition: 'whispers:1',
  },
  {
    id: 'echo-shard',
    type: 'story',
    name: 'Ozvěnový střep',
    description: 'Získán stabilizací cizího šepotu.',
    effect: 'Zvyšuje dosah vlastních šepotů',
    cost: 0,
    purchasable: false,
    condition: 'mission:stabilize-whisper',
  },
  {
    id: 'glitch-safe-mode',
    type: 'cosmetic',
    name: 'Glitchka: Safe Mode',
    description: 'Alternativní vizuální téma profilu inspirované Glitchkou.',
    effect: 'Profilové téma Safe Mode',
    cost: 64,
    purchasable: true,
    condition: 'entity:glitchka:trust:50',
  },
  {
    id: 'unsent-carrier',
    type: 'story',
    name: 'Nosič neodeslaných vět',
    description: 'Zanechal šepot sám sobě.',
    effect: 'Odemkne misi Napiš větu sobě',
    cost: 0,
    purchasable: false,
    condition: 'mission:write-to-self',
  },
  {
    id: 'shadow-logbook',
    type: 'shadow',
    name: 'Stínový zápisník',
    description: 'Archivuje nevybrané volby. Zobrazí se v Černém boxu.',
    effect: 'Stín -3 při vstupu do Black Boxu',
    cost: 128,
    purchasable: true,
    runEffect: { shadowDelta: -3 },
  },
];

export interface Mission {
  id: string;
  name: string;
  logLabel: string;
  description: string;
  condition: string;
  task: string;
  rewardText: string;
  artifactReward?: string;
  fragmentReward?: string | null;
  runReward?: {
    stabilityDelta?: number;
    pressureDelta?: number;
    shadowDelta?: number;
  };
  mnemCost?: number;
}

export const MISSIONS: Mission[] = [
  {
    id: 'first-trace',
    name: 'ZANECH STOPU',
    logLabel: 'LOG [MISSION_TRACE]:',
    description: 'Zanech první anonymní šepot v Archivu.',
    condition: 'chapter:0-inf-restart',
    task: 'Zanechat první šepot',
    rewardText: 'Stabilita +2, Fe +1, Artefakt: První ozvěna',
    artifactReward: 'first-echo',
    runReward: { stabilityDelta: 2 },
  },
  {
    id: 'did-not-run',
    name: 'NEUTEKL',
    logLabel: 'LOG [MISSION_RESISTANCE]:',
    description: 'Dokončit 0-2 [RUN] a zvolit možnost čelit, ne utéct.',
    condition: 'chapter:0-2-run',
    task: 'Zvolit zůstat nebo čelit strachu',
    rewardText: 'Tlak paměti +3, Stabilita +4, Titul: Neutekl',
    runReward: { pressureDelta: 3, stabilityDelta: 4 },
  },
  {
    id: 'sarkasma-firewall',
    name: 'FIREWALL S CITY',
    logLabel: 'LOG [MISSION_FIREWALL]:',
    description: 'Odemknout Sarkasmin skrytý LOG. Vyžaduje Sarkasma sync > 50.',
    condition: 'entity:sarkasma:sync:50',
    task: 'Odemknout Sarkasmin LOG',
    rewardText: 'Artefakt: Sarkasmin firewallový střep + Profilový titul',
    artifactReward: 'sarkasma-firewall',
    mnemCost: 32,
  },
  {
    id: 'do-not-open',
    name: 'NEOTEVÍREJ VŠECHNO',
    logLabel: 'LOG [MISSION_DOOR]:',
    description: 'V Černém boxu zvolit odejít od zamčených dveří. Vyžaduje Stín > 60.',
    condition: 'shadow:60',
    task: 'Odolat a odejít od Černého boxu',
    rewardText: 'Stín -5, Stabilita +3',
    fragmentReward: null,
    runReward: { shadowDelta: -5, stabilityDelta: 3 },
  },
  {
    id: 'write-to-self',
    name: 'NAPIŠ VĚTU SOBĚ',
    logLabel: 'LOG [MISSION_UNSENT]:',
    description: 'Zanech šepot sám sobě.',
    condition: 'chapter:0-inf-restart',
    task: 'Zanechat šepot se značkou self',
    rewardText: 'Artefakt: Nosič neodeslaných vět',
    artifactReward: 'unsent-carrier',
  },
  {
    id: 'stabilize-whisper',
    name: 'STABILIZUJ ŠEPOT',
    logLabel: 'LOG [MISSION_RESONANCE]:',
    description: 'Rezonuj s cizím šepotem. Systém si to pamatuje.',
    condition: 'chapter:0-inf-restart',
    task: 'Kliknout REZONOVALO na cizím šepotu',
    rewardText: 'Fe +1, Důvěra +1, Artefakt: Ozvěnový střep',
    artifactReward: 'echo-shard',
    runReward: { stabilityDelta: 1 },
  },
  {
    id: 'find-name-fragment',
    name: 'NAJDI FRAGMENT JMÉNA',
    logLabel: 'LOG [MISSION_FRAGMENT]:',
    description: 'Odemkni 0-7 [RUINS] a zvol správnou interpretaci systémové zprávy.',
    condition: 'chapter:0-7-ruins',
    task: 'Odemknout UNSENT [SELF_001] a dokončit misi',
    rewardText: 'Fragment jména: T',
    fragmentReward: 'T',
    runReward: { shadowDelta: -2, pressureDelta: 3 },
  },
  {
    id: 'archive-audit',
    name: 'ARCHIVNÍ AUDIT',
    logLabel: 'LOG [MISSION_AUDIT]:',
    description: 'Otevřít T-AI diagnostiku a rozhodnout, zda věříš systému.',
    condition: 'chapter:0-4-searching',
    task: 'Projít diagnostiku a vybrat odpověď',
    rewardText: 'Rozdělené odměny: T-AI důvěra +3 nebo Sarkasma sync +3 nebo Stín +2',
    mnemCost: 0,
  },
];

export function getArtifactById(id: string): Artifact | undefined {
  return ARTIFACTS.find((a) => a.id === id);
}

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export function getChapterById(id: string): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id);
}

export function getPackageById(id: string): MnemPackage | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function isFreeChapter(id: string): boolean {
  const ch = getChapterById(id);
  return ch?.access === 'free';
}
