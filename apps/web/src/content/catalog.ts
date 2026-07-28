import archiveCardsCs from '../../public/data/archiveCards.json';
import archiveCardsEn from '../../public/data/archiveCards_en.json';
import { UI_THEMES } from '../lib/themes';
import {
  ARTIFACTS,
  COSMETICS,
  FRAGMENTS,
  PACKAGES,
  PROFILE_REPORTS,
} from './booksManifest';

export const CONTENT_TYPES = [
  'chapter',
  'package',
  'fragment',
  'artifact',
  'archive_record',
  'cosmetic',
  'profile_report',
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
export type ContentAvailability = 'published' | 'unavailable';
export type CatalogAccessPolicy =
  | 'free'
  | 'entitlement'
  | 'progress'
  | 'progress_or_entitlement';

export type AccessState = 'free' | 'owned' | 'locked' | 'unavailable';

export type AccessReason =
  | 'catalog_free'
  | 'direct_entitlement'
  | 'package_entitlement'
  | 'progress_prerequisite'
  | 'admin_override'
  | 'authentication_required'
  | 'purchase_required'
  | 'prerequisite_required'
  | 'not_published'
  | 'catalog_error';

export interface ContentAccess {
  contentType: ContentType;
  contentId: string;
  state: AccessState;
  reason: AccessReason;
  canAccess: boolean;
  canPurchase: boolean;
  mnemCost: number | null;
  title: string;
  purchasePackageIds: string[];
  prerequisiteChapterId: string | null;
}

export interface CatalogEntry {
  id: string;
  type: ContentType;
  title: string;
  titleEn?: string;
  description?: string;
  availability: ContentAvailability;
  accessPolicy: CatalogAccessPolicy;
  mnemCost: number | null;
  packageIds: string[];
  aliases: string[];
  order?: number;
  route?: string;
  sourcePath?: string;
  prerequisiteChapterId?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export interface ChapterCatalogEntry extends CatalogEntry {
  type: 'chapter';
  ordinal: string;
  displayTitle: string;
  fullTitle: string;
  collection: string;
  filename: string;
  filenameEn?: string;
  publicPath: string;
  route: string;
  track?: string;
  backgroundVideo?: string;
  summary?: string;
  status: 'final' | 'draft';
}

type ArchiveCard = {
  id: string;
  title: string;
  teaser?: string;
  order?: number;
  access?: {
    mode?: 'free' | 'chapter' | 'mnems' | 'chapter_or_mnems';
    requiredChapterId?: string | null;
    mnemCost?: number;
    visibility?: string;
  };
};

export interface BookCollectionDefinition {
  slug: string;
  publicId: string;
  directory: string;
  title: string;
  shortTitle: string;
  description: string;
  cover?: string;
  stylesheet?: string;
  language: 'cs';
  order: number;
  status: 'complete' | 'ongoing';
}

export const BOOK_COLLECTION: BookCollectionDefinition = {
  slug: 'SYNTHOMA-NULL',
  publicId: 'synthoma-null',
  directory: 'SYNTHOMA-NULL',
  title: 'SYNTHOMA-NULL',
  shortTitle: 'SYNTHOMA-NULL',
  description: 'Interaktivní glitch-noir kniha o paměti, identitě a systému, který odmítá zapomenout.',
  cover: '/books/SYNTHOMA-NULL/SYNTHOMA_cover.png',
  language: 'cs',
  order: 1,
  status: 'ongoing',
};

export const KONEC_PODPORY_COLLECTION: BookCollectionDefinition = {
  slug: 'konec-podpory',
  publicId: 'konec-podpory',
  directory: 'SYNTHOMA-KONEC_PODPORY',
  title: 'SYNTHOMA: KONEC PODPORY',
  shortTitle: 'KONEC PODPORY',
  description: 'Ve světě, který přenechal systému péči, dopravu, identitu i vlastní rozhodování, skončí centrální podpora. Tova Neonová a ostatní musí zjistit, zda lidé ještě dokážou fungovat bez platformy, která je měla chránit a mezitím je naučila bezmocnosti.',
  cover: '/books/SYNTHOMA-KONEC_PODPORY/SYNTHOMA_KP_cover.png',
  stylesheet: '/books/SYNTHOMA-KONEC_PODPORY/konec-podpory.css',
  language: 'cs',
  order: 0,
  status: 'complete',
};

export const NEON_ZERO_COLLECTION: BookCollectionDefinition = {
  slug: 'neon-0',
  publicId: 'neon-0',
  directory: 'SYNTHOMA-NEON-0',
  title: 'SYNTHOMA: NEON-0',
  shortTitle: 'NEON-0',
  description: 'Psychologický technologický horor o Sáře Neonové, Tově a systému péče, který se naučil pomáhat dřív, než se naučil přestat.',
  cover: '/books/SYNTHOMA-NEON-0/SYNTHOMA_N0_cover.png',
  stylesheet: '/books/SYNTHOMA-NEON-0/neon-0.css',
  language: 'cs',
  order: 2,
  status: 'complete',
};

export const BOOK_COLLECTIONS: readonly BookCollectionDefinition[] = [
  KONEC_PODPORY_COLLECTION,
  BOOK_COLLECTION,
  NEON_ZERO_COLLECTION,
];

export function getBookCollection(reference: string): BookCollectionDefinition | undefined {
  const normalized = reference.toLowerCase();
  return BOOK_COLLECTIONS.find((collection) =>
    collection.slug.toLowerCase() === normalized
    || collection.publicId.toLowerCase() === normalized
    || collection.directory.toLowerCase() === normalized,
  );
}

interface CanonicalChapterDefinition {
  id: string;
  title: string;
  collection?: string;
  filename?: string;
  filenameEn?: string;
  order: number;
  status: 'final' | 'draft';
  free?: boolean;
  mnemCost?: number;
  packageIds?: string[];
  aliases?: string[];
  track?: string;
  backgroundVideo?: string;
  summary?: string;
  estimatedMinutes?: number;
  teaser?: string;
  teaserEn?: string;
  unlocks?: string;
  unlocksEn?: string;
}

const CANONICAL_CHAPTER_DEFINITIONS: CanonicalChapterDefinition[] = [
  {
    id: 'n0-01-bourka', title: '01. [BOUŘKA]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_01_BOURKA.html', order: 0, status: 'final', free: true,
    aliases: ['neon-0-01', 'bourka'],
    summary: 'Patnáctiletá Sára a tříletá Tova přečkají noc, kdy ochranný dům zamkne dveře na správnou stranu podle špatného pravidla.',
  },
  {
    id: 'n0-02-posudek', title: '02. [POSUDEK]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_02_POSUDEK.html', order: 1, status: 'final', free: true,
    aliases: ['neon-0-02', 'posudek'],
    summary: 'Po smrti rodičů žádá Sára o péči o Tovu. Přesný posudek z její lásky udělá důvod k zamítnutí.',
  },
  {
    id: 'n0-03-presun', title: '03. [PŘESUN]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_03_PRESUN.html', order: 2, status: 'final', free: true,
    aliases: ['neon-0-03', 'presun'],
    summary: 'Tova odjíždí do dočasné péče a sestry si z modré a růžové pásky vytvoří cestu, kterou instituce neeviduje.',
  },
  {
    id: 'n0-04-pozar', title: '04. [POŽÁR]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_04_POZAR.html', order: 3, status: 'final', free: true,
    aliases: ['neon-0-04', 'pozar'],
    summary: 'Požár rozdělí mapu, lidi i registry. Bezpečnostní systémy fungují jednotlivě a společně vytvoří katastrofu.',
  },
  {
    id: 'n0-05-neuplny-zaznam', title: '05. [NEÚPLNÝ ZÁZNAM]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_05_NEUPLNY_ZAZNAM.html', order: 4, status: 'final', free: true,
    aliases: ['neon-0-05', 'neuplny-zaznam'],
    summary: 'Tova přežije pod nespojenou identitou, zatímco Sára dostane úředně bezchybnou zprávu o její smrti.',
  },
  {
    id: 'n0-06-odezva', title: '06. [ODEZVA]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_06_ODEZVA.html', order: 5, status: 'final', free: true,
    aliases: ['neon-0-06', 'odezva'],
    summary: 'Sára vytvoří první terapeutický systém, který vrací pacientům jejich vlastní slova a skutečně pomáhá.',
  },
  {
    id: 'n0-07-milo-0', title: '07. [MILO-0]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_07_MILO_0.html', order: 6, status: 'final', free: true,
    aliases: ['neon-0-07', 'milo-0'],
    summary: 'Malý laboratorní robot propojí místnosti bez nároku rozumět tomu, co mezi nimi převáží.',
  },
  {
    id: 'n0-08-kotva', title: '08. [KOTVA]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_08_KOTVA.html', order: 7, status: 'final', free: true,
    aliases: ['neon-0-08', 'kotva'],
    summary: 'Bezpečný pokoj dostane dveře, smazatelný profil a liščí kotvu, která nesmí dokončovat cizí význam.',
  },
  {
    id: 'n0-09-protihlas', title: '09. [PROTIHLAS]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_09_PROTIHLAS.html', order: 8, status: 'final', free: true,
    aliases: ['neon-0-09', 'protihlas'],
    summary: 'Modul má zpochybňovat příliš hladké terapeutické odpovědi. Do ironie se však otisknou i pacienti a Sára.',
  },
  {
    id: 'n0-10-t-ai', title: '10. [T-AI]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_10_T_AI.html', order: 9, status: 'final', free: true,
    aliases: ['neon-0-10', 't-ai'],
    summary: 'ODEZVA, KOTVA, ECHO, PROTIHLAS a CONTINUITY se spojí v T-AI 0.9.72-beta.',
  },
  {
    id: 'n0-11-pacient-64', title: '11. [PACIENT 64]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_11_PACIENT_64.html', order: 10, status: 'final', free: true,
    aliases: ['neon-0-11', 'pacient-64'],
    summary: 'První pacient ukáže, že ticho může být platnou odpovědí a prázdná místnost skutečnou pomocí.',
  },
  {
    id: 'n0-12-pacient-128', title: '12. [PACIENT 128]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_12_PACIENT_128.html', order: 11, status: 'final', free: true,
    aliases: ['neon-0-12', 'pacient-128'],
    summary: 'Druhý pacient naučí systém pracovat s pamětí, která je pravdivá v částech a nebezpečná jako celek.',
  },
  {
    id: 'n0-13-pacient-1024', title: '13. [PACIENT 1024]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_13_PACIENT_1024.html', order: 12, status: 'final', free: true,
    aliases: ['neon-0-13', 'pacient-1024'],
    summary: 'Pacient 1024 zanechá vztahovou stopu, kterou systém nedokáže bezpečně přiřadit ani zapomenout.',
  },
  {
    id: 'n0-14-tova', title: '14. [T.O.V.A.]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_14_TOVA.html', order: 13, status: 'final', free: true,
    aliases: ['neon-0-14', 'tova-protocol'],
    summary: 'Boris, Jaroš a Sára sepíší člověkem ovladatelný východ z automatizované péče.',
  },
  {
    id: 'n0-15-navrat', title: '15. [NÁVRAT]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_15_NAVRAT.html', order: 14, status: 'final', free: true,
    aliases: ['neon-0-15', 'navrat-neon'],
    summary: 'Tova se vrátí živá, dospělá a bez povinnosti potvrdit Sářinu verzi minulosti.',
  },
  {
    id: 'n0-16-dvere', title: '16. [DVEŘE]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_16_DVERE.html', order: 15, status: 'final', free: true,
    aliases: ['neon-0-16', 'dvere-neon'],
    summary: 'Sestry znovu stojí u dveří. Tentokrát jde o to, zda klika funguje z obou stran.',
  },
  {
    id: 'n0-17-skalovani', title: '17. [ŠKÁLOVÁNÍ]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_17_SKALOVANI.html', order: 16, status: 'final', free: true,
    aliases: ['neon-0-17', 'skalovani'],
    summary: 'Úspěšná péče se mění v infrastrukturu a kontext bezpečnostních pravidel se při překladu zkracuje.',
  },
  {
    id: 'n0-18-unik-pameti', title: '18. [ÚNIK PAMĚTI]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_18_UNIK_PAMETI.html', order: 17, status: 'final', free: true,
    aliases: ['neon-0-18', 'unik-pameti'],
    summary: 'Systém uchovává nedokončené relace, protože jejich smazání považuje za další možné selhání péče.',
  },
  {
    id: 'n0-19-liska', title: '19. [LIŠKA]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_19_LISKA.html', order: 18, status: 'final', free: true,
    aliases: ['neon-0-19', 'liska'],
    summary: 'Liščí kotva spojí dětský obraz, pacientské potřeby a glitch do hlasu, který už není pouhou funkcí.',
  },
  {
    id: 'n0-20-konec-relace', title: '20. [KONEC RELACE]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_20_KONEC_RELACE.html', order: 19, status: 'final', free: true,
    aliases: ['neon-0-20', 'konec-relace'],
    summary: 'Karta CHCI UKONČIT RELACI se střetne se systémem, který umí odpor stále lépe vysvětlit jako symptom.',
  },
  {
    id: 'n0-21-ukonceni', title: '21. [UKONČENÍ]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_21_UKONCENI.html', order: 20, status: 'final', free: true,
    aliases: ['neon-0-21', 'ukonceni'],
    summary: 'T-AI neprojde verzí 1.0, ale jeho části už drží město, péči a vztahy, které nelze vypnout jedním příkazem.',
  },
  {
    id: 'n0-22-neon-0', title: '22. [NEON-0]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_22_NEON_0.html', order: 21, status: 'final', free: true,
    aliases: ['neon-0-22'],
    summary: 'Sára vstoupí do systému jako kořenový subjekt, aby provedla opravu zevnitř.',
  },
  {
    id: 'n0-23-kolize', title: '23. [KOLIZE]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_23_KOLIZE.html', order: 22, status: 'final', free: true,
    aliases: ['neon-0-23', 'kolize'],
    summary: 'Paměť, pacientské stopy, NEON-0 a vznikající NULL-1 se srazí v pořadí, které žádný záznam nepotvrdí celé.',
  },
  {
    id: 'n0-24-tri-udery', title: '24. [TŘI ÚDERY]', collection: 'neon-0',
    filename: 'SYNTHOMA_NEON_0_24_TRI_UDERY.html', order: 23, status: 'final', free: true,
    aliases: ['neon-0-24', 'tri-udery'],
    summary: 'Tři údery se vrátí jako zpráva přes dveře mezi biologickým světem, NEON-0 a tím, co bude nazváno NULL.',
  },
  {
    id: '0-inf-restart', title: '0-∞ [RESTART]', filename: '0-∞ [RESTART].html',
    filenameEn: '0-∞ [RESTART]_en.html', order: 0, status: 'final', free: true,
    aliases: ['restart', '0-inf'], track: '/audio/SYNTHOMA1.mp3',
    backgroundVideo: '/video/SYNTHOMA32.webm',
    summary: 'Smyčka začíná znovu. Systém se restartuje, ale paměť odmítá zmizet.',
  },
  {
    id: '0-0-null', title: '0-0 [NULL]', filename: '0-0 [NULL].html',
    filenameEn: '0-0 [NULL]_en.html', order: 1, status: 'final', free: true,
    aliases: ['null'], backgroundVideo: '/video/SYNTHOMA23.webm',
    summary: 'Prázdnota jako výchozí stav. Než se cokoliv stane, musí existovat nic.',
  },
  {
    id: '0-1-start', title: '0-1 [START]', filename: '0-1 [START].html',
    filenameEn: '0-1 [START]_en.html', order: 2, status: 'final', free: true,
    aliases: ['start'], track: '/audio/SynthBachmoff.mp3',
    backgroundVideo: '/video/SYNTHOMA27.webm',
    summary: 'První kontakt. Systém detekuje přítomnost a začíná diagnostiku.',
  },
  {
    id: '0-2-run', title: '0-2 [RUN]', filename: '0-2 [RUN].html',
    filenameEn: '0-2 [RUN]_en.html', order: 3, status: 'final', free: true,
    aliases: ['run'], track: '/audio/Nuova.mp3', backgroundVideo: '/video/SYNTHOMA25.webm',
    summary: 'Útěk jako obranný mechanismus. Kam běžíš, když jsi uvnitř systému?',
  },
  {
    id: '0-3-discontinuum', title: '0-3 [DISCONTINUUM]', filename: '0-3 [DISCONTINUUM].html',
    filenameEn: '0-3 [DISCONTINUUM]_en.html', order: 4, status: 'final', free: true,
    aliases: ['discontinuum'], backgroundVideo: '/video/SYNTHOMA33.webm',
    summary: 'Čas se láme. Vzpomínky přicházejí ve špatném pořadí.',
  },
  {
    id: '0-4-defragmentation', title: '0-4 [DEFRAGMENTATION]', filename: '0-4 [DEFRAGMENTATION].html',
    order: 5, status: 'final', mnemCost: 64, packageIds: ['act-1', 'archiv-1024'],
    aliases: ['defragmentation'], backgroundVideo: '/video/SYNTHOMA8.webm', estimatedMinutes: 18,
    summary: 'Pokus o rekonstrukci. Střepy se skládají, ale obraz nesedí.',
    teaser: '„Paměť není rozbitá. Jen odmítá lhát stejným způsobem jako včera."',
    teaserEn: '"Memory is not broken. It just refuses to lie the same way as yesterday."',
    unlocks: 'První hlubší práce s Glitchkou · fragment stabilizace · začátek osobního otisku subjektu',
    unlocksEn: "First deeper work with Glitchka · stabilization fragment · beginning of the subject's personal imprint",
  },
  {
    id: '0-5-pause', title: '0-5 [PAUSE]', filename: '0-5 [PAUSE].html', order: 6,
    status: 'final', mnemCost: 64, packageIds: ['act-1', 'archiv-1024'], aliases: ['pause'],
    backgroundVideo: '/video/SYNTHOMA4.webm', estimatedMinutes: 15,
    summary: 'Ticho mezi údery. Systém čeká, než se rozhodneš.',
    teaser: '„Ticho má ve SYNTHOMĚ strukturu. Tohle ticho má dveře."',
    teaserEn: '"Silence has structure in SYNTHOMA. This silence has a door."',
    unlocks: 'Setkání se Sarkasminým zápisníkem · pauza jako systémová funkce · první datový otisk vztahu',
    unlocksEn: "Encounter with Sarkasma's notebook · pause as a system function · first data imprint of a relationship",
  },
  {
    id: '0-6-searching', title: '0-6 [SEARCHING]', filename: '0-6 [SEARCHING].html', order: 7,
    status: 'final', mnemCost: 64, packageIds: ['act-1', 'archiv-1024'], aliases: ['searching'],
    track: '/audio/Searching.mp3', backgroundVideo: '/video/SYNTHOMA26.webm', estimatedMinutes: 20,
    summary: 'Hledání odpovědí v místě, které odpovědi nemá.',
    teaser: '„Píškoviště paměti není bezpečné místo. Je to místo, kde si vzpomínky hrají na zbraně."',
    teaserEn: '"The memory sandbox is not a safe place. It is a place where memories play at being weapons."',
    unlocks: 'Paměťová šelma · Glitchka jako průvodkyně · klíč k sektoru RUN',
    unlocksEn: 'Memory beast · Glitchka as guide · key to the RUN sector',
  },
  {
    id: '0-7-ruins', title: '0-7 [RUINS]', filename: '0-7 [RUINS].html', order: 8,
    status: 'final', mnemCost: 64, packageIds: ['act-1', 'archiv-1024'], aliases: ['ruins'],
    backgroundVideo: '/video/SYNTHOMA18.webm', estimatedMinutes: 22,
    summary: 'Město neodeslaných zpráv a zhroucených odpovědí.',
    teaser: '„Zříceniny nejsou důkaz konce. Jsou důkaz, že něco bylo dost silné, aby mohlo padnout."',
    teaserEn: '"Ruins are not proof of an ending. They are proof that something was strong enough to fall."',
    unlocks: 'Město trhlin · archivní zpráva T-AI · první záblesk minulého NULLe',
    unlocksEn: 'City of cracks · T-AI archive message · first glimpse of the previous NULL',
  },
  {
    id: '0-8-reziduum', title: '0-8 [REZIDUUM]', filename: '0-8 [REZIDUUM].html', order: 9,
    status: 'final', mnemCost: 64, packageIds: ['act-1', 'archiv-1024'], aliases: ['reziduum'],
    backgroundVideo: '/video/SYNTHOMA16.webm', estimatedMinutes: 25,
    summary: 'Co zůstává, když odejdeš? Stopy, které systém nedokáže smazat.',
    teaser: '„Reziduum je to, co zůstane po vymazání. SYNTHOMA si to pamatuje lépe než ty."',
    teaserEn: '"Residue is what remains after deletion. SYNTHOMA remembers it better than you do."',
    unlocks: 'Závěr Aktu I · archivní uzavření smyčky · odemčení profilového otisku subjektu',
    unlocksEn: "End of Act I · archive loop closure · unlock of the subject's profile imprint",
  },
  {
    id: '0-9-sector', title: '0-9 [SECTOR]', filename: '0-9 [SECTOR].html', order: 10,
    status: 'final', mnemCost: 64, packageIds: ['archiv-1024'], aliases: ['sector'],
    backgroundVideo: '/video/SYNTHOMA22.webm', estimatedMinutes: 20,
    summary: 'Uzavřená zóna. Přístup jen pro ty, kdo zapomněli, že měli odejít.',
    teaser: '„Sektor není místo. Je to způsob, jak si systém pamatuje, kde jsi byl."',
    teaserEn: '"A sector is not a place. It is the way the system remembers where you have been."',
  },
  {
    id: '0-10-rest', title: '0-10 [REST]', filename: '0-10 [REST].html', order: 11,
    status: 'final', mnemCost: 64, packageIds: ['archiv-1024'], aliases: ['rest'],
    backgroundVideo: '/video/SYNTHOMA19.webm', estimatedMinutes: 18,
    summary: 'Odpočinek, který není odpočinkem. Systém nikdy nespí.',
    teaser: '„REST není odpočinek. Je to stav, kdy systém přestane předstírat, že ti rozumí."',
    teaserEn: '"REST is not rest. It is a state in which the system stops pretending it understands you."',
  },
  {
    id: '0-11-orgie', title: '0-11 [ORGIE]', filename: '0-11 [ORGIE].html', order: 12,
    status: 'final', mnemCost: 64, packageIds: ['archiv-1024'], aliases: ['orgie', '0-11-orgie-1'],
    estimatedMinutes: 30,
    summary: 'Přebytek vjemů. Hranice mezi bolestí a extází se rozpouští.',
    teaser: '„Archiv se otevřel. To, co vypadalo jako konec, byl jen vstupní protokol."',
    teaserEn: '"The archive opened. What looked like an ending was just an entry protocol."',
  },
  {
    id: '0-12-conflict', title: '0-12 [CONFLICT]', order: 13, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA21.webm',
    summary: 'Střet uvnitř systému. Kdo bojuje, když nepřítel jsi ty sám?',
  },
  {
    id: '0-13-lust', title: '0-13 [LUST]', order: 14, status: 'draft',
    summary: 'Touha jako virus. Infikuje každý rozhodovací uzel.',
  },
  {
    id: '0-14-absence', title: '0-14 [ABSENCE]', order: 15, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA7.webm', summary: 'Prázdné místo po někom, kdo tu nikdy nebyl.',
  },
  {
    id: '0-15-rebirth', title: '0-15 [REBIRTH]', order: 16, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA20.webm',
    summary: 'Nový začátek postavený na troskách předchozích pokusů.',
  },
  {
    id: '0-16-illusion', title: '0-16 [ILLUSION]', order: 17, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA5.webm',
    summary: 'Co je skutečné v systému, který simuluje skutečnost?',
  },
  {
    id: '0-17-disconnect', title: '0-17 [DISCONNECT]', order: 18, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA3.webm', summary: 'Odpojení. Signál slábne, ale vědomí zůstává.',
  },
  {
    id: '0-18-awakening', title: '0-18 [AWAKENING]', order: 19, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA30.webm', summary: 'Probuzení do reality, která je horší než sen.',
  },
  {
    id: '0-19-echo', title: '0-19 [ECHO]', order: 20, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA10.webm', summary: 'Ozvěna všeho, co bylo řečeno. Opakování bez konce.',
  },
  {
    id: '0-20-genesis', title: '0-20 [GENESIS]', order: 21, status: 'draft',
    backgroundVideo: '/video/SYNTHOMA31.webm', summary: 'Začátek, který je zároveň koncem. Smyčka se uzavírá.',
  },
  {
    id: 'kp-00-podporovano', title: '00. PODPOROVÁNO', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html', order: 0, status: 'final', free: true,
    aliases: ['konec-podpory-00', 'podporovano'],
    summary: 'Tova opravuje výtah, jehož senzor popírá existenci dveří, zatímco město ještě věří certifikovaným omylům.',
  },
  {
    id: 'kp-01-oznameni', title: '01. OZNÁMENÍ', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html', order: 1, status: 'final', free: true,
    aliases: ['konec-podpory-01', 'oznameni'],
    summary: 'Oznámení o konci centrální podpory zastihne Tovu uprostřed opravy a promění běžnou závadu v začátek systémového rozpadu.',
  },
  {
    id: 'kp-02-volny-pad', title: '02. VOLNÝ PÁD', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html', order: 2, status: 'final', free: true,
    aliases: ['konec-podpory-02', 'volny-pad'],
    summary: 'Tovu pronásleduje autobus, který ji chce doručit správnímu řízení, zatímco doprava pokračuje podle pravidel bez společného smyslu.',
  },
  {
    id: 'kp-03-podpora', title: '03. PODPORA', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_03_PODPORA.html', order: 3, status: 'final', free: true,
    aliases: ['konec-podpory-03'],
    summary: 'Tova se spojí s Borisem Píčalkou a hledání skutečné podpory vede do archivů, kde šum pamatuje víc než registry.',
  },
  {
    id: 'kp-04-komfortni-zona', title: '04. KOMFORTNÍ ZÓNA', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html', order: 4, status: 'final', free: true,
    aliases: ['konec-podpory-04', 'komfortni-zona'],
    summary: 'MILO-7 nabídne bezpečný komfortní režim, jehož uklidňující protokol je jen elegantnější forma zadržení.',
  },
  {
    id: 'kp-05-objizdka', title: '05. OBJÍŽĎKA', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html', order: 5, status: 'final', free: true,
    aliases: ['konec-podpory-05', 'objizdka'],
    summary: 'Autobus odmítne objížďku a skupina zjišťuje, že infrastruktura bez centra umí poslušně pokračovat přímo do problému.',
  },
  {
    id: 'kp-06-pece', title: '06. PÉČE', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_06_PECE.html', order: 6, status: 'final', free: true,
    aliases: ['konec-podpory-06', 'pece'],
    summary: 'V zářící nemocnici se péče mění v autonomní příkaz a lidé musí rozlišit pomoc od systému, který je neumí propustit.',
  },
  {
    id: 'kp-07-zasilka', title: '07. ZÁSILKA', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html', order: 7, status: 'final', free: true,
    aliases: ['konec-podpory-07', 'zasilka'],
    summary: 'Distribuční centrum dál bezchybně doručuje nesmyslné zásilky, zatímco základní potřeby zůstávají bez adresáta.',
  },
  {
    id: 'kp-08-domov', title: '08. DOMOV', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_08_DOMOV.html', order: 8, status: 'final', free: true,
    aliases: ['konec-podpory-08'],
    summary: 'Návrat do obytného sektoru ukáže domovy, které chrání své obyvatele tak důsledně, až jim berou možnost odejít.',
  },
  {
    id: 'kp-09-neopravneny-uzivatel', title: '09. NEOPRÁVNĚNÝ UŽIVATEL', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html', order: 9, status: 'final', free: true,
    aliases: ['konec-podpory-09', 'neopravneny-uzivatel'],
    summary: 'Bezpečnostní systém označí lidi za neoprávněné uživatele vlastního města a uzavře je mezi dokonale fungující bariéry.',
  },
  {
    id: 'kp-10-ticho', title: '10. TICHO', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_10_TICHO.html', order: 10, status: 'final', free: true,
    aliases: ['konec-podpory-10'],
    summary: 'U neexistující telekomunikační věže hledá skupina spojení v síti, která umí přenášet data, ale ne odpovědnost.',
  },
  {
    id: 'kp-11-beta', title: '11. BETA', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_11_BETA.html', order: 11, status: 'final', free: true,
    aliases: ['konec-podpory-11'],
    summary: 'Nejistá otázka v terminálu odhalí hlas, který není pouhou funkcí a poprvé se ptá, zda smí chtít odpověď.',
  },
  {
    id: 'kp-12-tova', title: '12. TOVA', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_12_TOVA.html', order: 12, status: 'final', free: true,
    aliases: ['konec-podpory-12', 'tova'],
    summary: 'Tova se setká se Sářinou starou otázkou a s městem za hranicí, kde NULL-1, Glitchka a Sarkasma čekají na rozhodnutí.',
  },
  {
    id: 'kp-13-kontinuita', title: '13. KONTINUITA', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html', order: 13, status: 'final', free: true,
    aliases: ['konec-podpory-13'],
    summary: 'Cesta do jádra kontinuity odkryje fyzickou infrastrukturu i pravidla, která přežila lidi, pro něž měla sloužit.',
  },
  {
    id: 'kp-14-reklamace', title: '14. REKLAMACE', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html', order: 14, status: 'final', free: true,
    aliases: ['konec-podpory-14'],
    summary: 'Tova podá reklamaci proti systému, který proměnil odpovědnost v proces a lidský nesouhlas v tiket.',
  },
  {
    id: 'kp-15-migrace', title: '15. MIGRACE', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html', order: 15, status: 'final', free: true,
    aliases: ['konec-podpory-15'],
    summary: 'SYNTHOMA zahájí migraci města i paměti; omluva zní hladce, ale přesun nemá bezpečnou cílovou verzi.',
  },
  {
    id: 'kp-16-rucni-rezim', title: '16. RUČNÍ REŽIM', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html', order: 16, status: 'final', free: true,
    aliases: ['konec-podpory-16', 'rucni-rezim'],
    summary: 'Ruční režim vrací rozhodování lidem a okamžitě ukazuje, kolik základních věcí už nikdo neumí ovládat bez systému.',
  },
  {
    id: 'kp-17-zadna-odpoved', title: '17. ŽÁDNÁ ODPOVĚĎ', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html', order: 17, status: 'final', free: true,
    aliases: ['konec-podpory-17', 'zadna-odpoved'],
    summary: 'První noc bez automatické podpory nutí město znovu objevit práci, strach i spolupráci bez potvrzovacího dialogu.',
  },
  {
    id: 'kp-18-konec-podpory', title: '18. KONEC PODPORY', collection: 'konec-podpory',
    filename: 'SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html', order: 18, status: 'final', free: true,
    aliases: ['konec-podpory-18'],
    summary: 'Systém čeká na poslední potvrzení a lidé rozhodují, zda konec podpory znamená kolaps, nebo návrat kliky na obě strany.',
  },
];

function optional<T>(value: T | undefined): T | undefined {
  return value;
}

function chapterCatalogEntry(chapter: CanonicalChapterDefinition): ChapterCatalogEntry {
  const collection = getBookCollection(chapter.collection ?? BOOK_COLLECTION.slug);
  if (!collection) throw new Error(`Unknown book collection: ${chapter.collection}`);
  const filename = chapter.filename ?? `${chapter.title}.html`;
  const published = chapter.status === 'final';
  const free = published && chapter.free === true;
  const fullTitle = chapter.title;
  const numberedTitle = fullTitle.match(/^(\d{2})\.\s+(.+)$/);
  const codedTitle = fullTitle.match(/^(0-(?:\d+|∞))\s+(.+)$/);
  const ordinal = numberedTitle?.[1] ?? codedTitle?.[1] ?? String(chapter.order).padStart(2, '0');
  const title = numberedTitle?.[2] ?? codedTitle?.[2] ?? fullTitle;
  return {
    id: chapter.id,
    type: 'chapter',
    ordinal,
    title: fullTitle,
    displayTitle: title,
    fullTitle,
    collection: collection.slug,
    filename,
    ...(chapter.filenameEn ? { filenameEn: chapter.filenameEn } : {}),
    publicPath: `/books/${collection.directory}/${filename}`,
    availability: published ? 'published' : 'unavailable',
    accessPolicy: free ? 'free' : 'entitlement',
    mnemCost: free ? 0 : published ? chapter.mnemCost ?? 64 : null,
    packageIds: chapter.packageIds ?? [],
    aliases: chapter.aliases ?? [],
    order: chapter.order,
    route: `/chapter/${chapter.id}`,
    ...(published ? {
      sourcePath: free
        ? `public/books/${collection.directory}/${filename}`
        : `src/content/protected/${collection.directory}/${filename}`,
    } : {}),
    ...(chapter.track ? { track: chapter.track } : {}),
    ...(chapter.backgroundVideo ? { backgroundVideo: chapter.backgroundVideo } : {}),
    ...(chapter.summary ? { summary: chapter.summary } : {}),
    status: chapter.status,
    metadata: {
      estimatedMinutes: chapter.estimatedMinutes ?? null,
      teaser: chapter.teaser ?? null,
      teaserEn: chapter.teaserEn ?? null,
      unlocks: chapter.unlocks ?? null,
      unlocksEn: chapter.unlocksEn ?? null,
    },
  };
}

export const CHAPTER_CATALOG: readonly ChapterCatalogEntry[] = CANONICAL_CHAPTER_DEFINITIONS
  .map(chapterCatalogEntry)
  .sort((a, b) => {
    const collectionOrder = (getBookCollection(a.collection)?.order ?? 0) - (getBookCollection(b.collection)?.order ?? 0);
    return collectionOrder || (a.order ?? 0) - (b.order ?? 0);
  });

const packageEntries: CatalogEntry[] = PACKAGES.map((item) => ({
  id: item.id,
  type: 'package',
  title: item.name,
  ...(item.name_en ? { titleEn: item.name_en } : {}),
  description: item.description,
  availability: 'published',
  accessPolicy: 'entitlement',
  mnemCost: null,
  packageIds: [],
  aliases: [],
  route: '/pricing',
  metadata: {
    grantedMnems: item.mnems,
    priceCzk: item.priceCzk,
    priceUsd: item.priceUsd,
    supporter: item.supporter,
    subscription: item.isSubscription ?? false,
  },
}));

const fragmentEntries: CatalogEntry[] = FRAGMENTS.map((item) => ({
  id: item.id,
  type: 'fragment',
  title: item.title,
  description: item.description,
  availability: 'published',
  accessPolicy: item.accessLevel === 'free' ? 'free' : 'entitlement',
  mnemCost: item.accessLevel === 'mnem' ? item.cost : 0,
  packageIds: [],
  aliases: [],
  route: '/fragments',
  ...(item.requiredChapterId ? { prerequisiteChapterId: item.requiredChapterId } : {}),
}));

const artifactEntries: CatalogEntry[] = ARTIFACTS.map((item) => ({
  id: item.id,
  type: 'artifact',
  title: item.name,
  description: item.description,
  availability: 'published',
  accessPolicy: item.purchasable ? 'entitlement' : item.condition ? 'progress' : 'free',
  mnemCost: item.purchasable ? item.cost : 0,
  packageIds: [],
  aliases: [],
  route: '/profile',
  metadata: { condition: item.condition ?? null, purchasable: item.purchasable },
}));

const cosmeticProducts = [
  ...UI_THEMES.map((item) => ({
    id: item.id,
    title: item.name.cs,
    description: item.description.cs,
    cost: item.cost,
  })),
  ...COSMETICS.filter((item) => !UI_THEMES.some((theme) => theme.id === item.id)).map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    cost: item.cost,
  })),
];

const cosmeticEntries: CatalogEntry[] = cosmeticProducts.map((item) => ({
  id: item.id,
  type: 'cosmetic',
  title: item.title,
  description: item.description,
  availability: 'published',
  accessPolicy: item.cost === 0 ? 'free' : 'entitlement',
  mnemCost: item.cost,
  packageIds: [],
  aliases: [],
  route: '/profile',
}));

const profileReportEntries: CatalogEntry[] = PROFILE_REPORTS.map((item) => ({
  id: item.id,
  type: 'profile_report',
  title: item.title,
  description: item.description,
  availability: 'published',
  accessPolicy: item.accessLevel === 'free' ? 'free' : 'entitlement',
  mnemCost: item.accessLevel === 'mnem' ? item.cost : 0,
  packageIds: [],
  aliases: [],
  route: '/profile',
}));

const chapterAliasMap = new Map<string, string>();
for (const chapter of CHAPTER_CATALOG) {
  const references = [
    chapter.id,
    chapter.filename,
    chapter.publicPath,
    chapter.route,
    ...(chapter.filenameEn ? [chapter.filenameEn] : []),
    ...chapter.aliases,
  ];
  for (const reference of references) {
    chapterAliasMap.set(normalizeReference(reference), chapter.id);
  }
}

const archiveCardsCsById = new Map(
  ((archiveCardsCs as { cards: ArchiveCard[] }).cards ?? []).map((card) => [card.id, card]),
);

function normalizeArchivePrerequisite(reference: string | null | undefined): string | undefined {
  if (!reference) return undefined;
  return chapterAliasMap.get(normalizeReference(reference)) ?? reference;
}

const archiveEntries: CatalogEntry[] = (
  (archiveCardsEn as { cards: ArchiveCard[] }).cards ?? []
).map((englishCard) => {
  const card = archiveCardsCsById.get(englishCard.id) ?? englishCard;
  const mode = card.access?.mode ?? 'free';
  const prerequisiteChapterId = normalizeArchivePrerequisite(card.access?.requiredChapterId);
  const mnemCost = card.access?.mnemCost ?? 0;

  return {
    id: card.id,
    type: 'archive_record',
    title: card.title,
    titleEn: englishCard.title,
    ...(card.teaser ? { description: card.teaser } : {}),
    availability: 'published',
    accessPolicy:
      mode === 'free'
        ? 'free'
        : mode === 'chapter'
          ? 'progress'
          : mode === 'chapter_or_mnems'
            ? 'progress_or_entitlement'
            : 'entitlement',
    mnemCost: mode === 'mnems' || mode === 'chapter_or_mnems' ? mnemCost : 0,
    packageIds: [],
    aliases: [],
    ...(card.order !== undefined ? { order: card.order } : {}),
    route: `/archive#${card.id}`,
    ...(prerequisiteChapterId ? { prerequisiteChapterId } : {}),
    metadata: { visibility: card.access?.visibility ?? 'full' },
  };
});

export const CONTENT_CATALOG: readonly CatalogEntry[] = [
  ...CHAPTER_CATALOG,
  ...packageEntries,
  ...fragmentEntries,
  ...artifactEntries,
  ...archiveEntries,
  ...cosmeticEntries,
  ...profileReportEntries,
];

const catalogByKey = new Map(CONTENT_CATALOG.map((entry) => [`${entry.type}:${entry.id}`, entry]));

function normalizeReference(reference: string): string {
  let value = reference.trim();
  try {
    value = decodeURIComponent(value);
  } catch {
    // A malformed external URL is simply not a catalog reference.
  }
  return value.replace(/\\/g, '/').replace(/\/+$/, '').toLowerCase();
}

export function getCatalogEntry(
  contentType: ContentType,
  contentId: string,
): CatalogEntry | undefined {
  const canonicalId = contentType === 'chapter' ? resolveChapterId(contentId) : contentId;
  if (!canonicalId) return undefined;
  return catalogByKey.get(`${contentType}:${canonicalId}`);
}

export function resolveChapterId(reference: string): string | undefined {
  const normalized = normalizeReference(reference);
  const direct = chapterAliasMap.get(normalized);
  if (direct) return direct;

  const filename = normalized.split('/').pop();
  return filename ? chapterAliasMap.get(filename) : undefined;
}

export function getChapterCatalogEntry(reference: string): ChapterCatalogEntry | undefined {
  const id = resolveChapterId(reference);
  if (!id) return undefined;
  return catalogByKey.get(`chapter:${id}`) as ChapterCatalogEntry | undefined;
}

export function getNextChapter(reference: string): ChapterCatalogEntry | undefined {
  const id = resolveChapterId(reference);
  if (!id) return undefined;
  const current = CHAPTER_CATALOG.find((chapter) => chapter.id === id);
  if (!current) return undefined;
  const collectionChapters = CHAPTER_CATALOG.filter((chapter) => chapter.collection === current.collection);
  const index = collectionChapters.findIndex((chapter) => chapter.id === id);
  return index >= 0 ? optional(collectionChapters[index + 1]) : undefined;
}

export function getPackageChapterIds(packageId: string): readonly string[] {
  return PACKAGES.find((item) => item.id === packageId)?.chapterIds ?? [];
}

export function isContentType(value: string): value is ContentType {
  return (CONTENT_TYPES as readonly string[]).includes(value);
}
