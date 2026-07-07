import type { SwipeCard } from './cyklusTypes';

export type CyklusPoolFamily =
  | 'sector'
  | 'entity'
  | 'item'
  | 'relationship'
  | 'aftermath'
  | 'meta'
  | 'story'
  | 'toll'
  | 'detective'
  | 'tutorial';

export interface CyklusPoolInfo {
  id: string;
  title: string;
  family: CyklusPoolFamily;
  aliases: string[];
  description: string;
}

export const CYKLUS_POOL_CATALOG: Record<string, CyklusPoolInfo> = {
  archive_pool: {
    id: 'archive_pool',
    title: 'Archiv',
    family: 'sector',
    aliases: ['archive_pool', 'archive', 'memory', 'key', 'black_folder'],
    description: 'Paměťové a archivní karty. Svět si bere poznámky a tváří se, že je to péče.',
  },
  archive_forbidden_pool: {
    id: 'archive_forbidden_pool',
    title: 'Zakázaný archiv',
    family: 'sector',
    aliases: ['archive_forbidden_pool', 'archive_forbidden', 'forbidden_archive', 'black_folder', 'forbidden', 'archive'],
    description: 'Karty pro zakázané regály, černé složky a paměti, které měly zůstat nepohodlně zavřené.',
  },
  archive_scent_pool: {
    id: 'archive_scent_pool',
    title: 'Archivní pach',
    family: 'aftermath',
    aliases: ['archive_scent_pool', 'archive_scent', 'archive', 'memory'],
    description: 'Tiché archivní dozvuky po otisku archivního pachu.',
  },
  memory_beast_pool: {
    id: 'memory_beast_pool',
    title: 'Paměťová šelma',
    family: 'entity',
    aliases: ['memory_beast_pool', 'memory_beast', 'beast', 'selma', 'memory'],
    description: 'Následky značky šelmy. Když tě paměť označí, obvykle to není věrnostní program.',
  },
  memory_sandbox_pool: {
    id: 'memory_sandbox_pool',
    title: 'Pískoviště paměti',
    family: 'sector',
    aliases: ['memory_sandbox_pool', 'memory_sandbox', 'sandbox', 'childhood', 'safe_mistake', 'glitchka'],
    description: 'Hravé, absurdní a relativně bezpečné karty. Relativně, protože SYNTHOMA neumí dát slovo bezpečí bez uvozovek.',
  },
  glitchka_pool: {
    id: 'glitchka_pool',
    title: 'Glitchka',
    family: 'entity',
    aliases: ['glitchka_pool', 'glitchka', 'fox', 'safe_mistake', 'sandbox', 'bond'],
    description: 'Liščí bezpečí, měkké chyby a laskavé nesmysly, které systém dráždí už jen tím, že nejsou brutální.',
  },
  glitchka_chat_pool: {
    id: 'glitchka_chat_pool',
    title: 'Pokec s Glitchkou',
    family: 'story',
    aliases: ['glitchka_chat_pool', 'glitchka_chat', 'glitchka', 'quiet', 'safe_mistake', 'bond'],
    description: 'Konverzační follow-upy s Glitchkou. Někdy je pokrok jen sedět vedle někoho a nevyrábět z ticha trestný čin.',
  },
  glitchka_deeper_chat_pool: {
    id: 'glitchka_deeper_chat_pool',
    title: 'Hlubší Glitchka',
    family: 'story',
    aliases: ['glitchka_deeper_chat_pool', 'glitchka_deeper_chat', 'glitchka', 'fake_glitchka', 'held_without_fixing'],
    description: 'Hlubší liščí rozhovory, falešná bezpečí a zkoušky toho, jestli hráč pozná péči bez vlastnictví.',
  },
  glitch_pool: {
    id: 'glitch_pool',
    title: 'Glitch',
    family: 'meta',
    aliases: ['glitch_pool', 'glitch', 'noise', 'soft_bug', 'mirror_crack', 'chaos'],
    description: 'Obecný glitchový pool. Systémově řečeno: bordel. Poeticky řečeno: také bordel, jen hezčí.',
  },
  noise_pool: {
    id: 'noise_pool',
    title: 'Šum',
    family: 'item',
    aliases: ['noise_pool', 'noise', 'noise_pet', 'noise_clump', 'energy', 'glitch'],
    description: 'Šumové item-trigger karty a kapesní mazlíčci z poruchy signálu.',
  },
  soft_bug_pool: {
    id: 'soft_bug_pool',
    title: 'Měkká chyba',
    family: 'item',
    aliases: ['soft_bug_pool', 'soft_bug', 'named_soft_bug', 'bug', 'glitchka', 'bond'],
    description: 'Měkké chyby, které vypadají jako deka a chovají se jako etická otázka.',
  },
  mirror_pool: {
    id: 'mirror_pool',
    title: 'Zrcadlo',
    family: 'sector',
    aliases: ['mirror_pool', 'mirror', 'mirror_shard', 'mirror_crack', 'reflection', 'shadow', 'identity'],
    description: 'Zrcadlové karty, odrazy, omluvy sobě a právní šedá zóna vlastního já.',
  },
  shadow_pool: {
    id: 'shadow_pool',
    title: 'Stín',
    family: 'item',
    aliases: ['shadow_pool', 'shadow', 'ownerless_shadow', 'mirror', 'residuum'],
    description: 'Stíny bez vlastníka a všechno, co se lepí k nohám, zatímco tvrdí, že je to doprovod.',
  },
  wrong_name_pool: {
    id: 'wrong_name_pool',
    title: 'Špatné jméno',
    family: 'story',
    aliases: ['wrong_name_pool', 'wrong_name', 'identity', 'residuum', 'form'],
    description: 'Karty špatných jmen, cizích štítků a identit, které se na hráče lepí jako špatně vyplněná přihláška.',
  },
  residuum_pool: {
    id: 'residuum_pool',
    title: 'Reziduum',
    family: 'sector',
    aliases: ['residuum_pool', 'residuum', 'wrong_name', 'memory', 'relationship'],
    description: 'Cizí zbytky, opakované zprávy, falešná nostalgie a otázka, co je tvoje, když to prošlo tebou.',
  },
  relationship_followups: {
    id: 'relationship_followups',
    title: 'Nedokončené rozhovory',
    family: 'relationship',
    aliases: ['relationship_followups', 'relationship', 'conversation', 'unfinished_conversation', 'bond', 'thread'],
    description: 'Follow-upy k rozhovorům, které neskončily. Nejlevnější forma strašení, protože stačí jedna neodeslaná věta.',
  },
  romance_residuum_pool: {
    id: 'romance_residuum_pool',
    title: 'Romantické reziduum',
    family: 'relationship',
    aliases: ['romance_residuum_pool', 'romance_residuum', 'romance', 'residuum', 'tender', 'relationship'],
    description: 'Něžné a nebezpečně lepivé dozvuky cizí i vlastní touhy.',
  },
  romance_aftermath_pool: {
    id: 'romance_aftermath_pool',
    title: 'Romantický dozvuk',
    family: 'relationship',
    aliases: ['romance_aftermath_pool', 'romance_aftermath', 'romance', 'tender_static', 'stay_without_owning', 'bond'],
    description: 'Aftercare po něze, která se nesmí změnit ve vlastnictví. Lidský druh tím bývá viditelně překvapen.',
  },
  desire_aftercare_pool: {
    id: 'desire_aftercare_pool',
    title: 'Aftercare touhy',
    family: 'relationship',
    aliases: ['desire_aftercare_pool', 'desire_aftercare', 'desire', 'aftercare', 'glitchena', 'boundary'],
    description: 'Karty po touze, hranicích a tělesné paměti.',
  },
  desire_orgie_pool: {
    id: 'desire_orgie_pool',
    title: 'ORGIE',
    family: 'relationship',
    aliases: ['desire_orgie_pool', 'desire_orgie', 'orgie', 'desire', 'glitchena', 'body_boundary'],
    description: 'Symbolické tělesné karty. Ne erotická tapeta, ale hranice, souhlas a stud s lepším nasvícením.',
  },
  sarkasma_pool: {
    id: 'sarkasma_pool',
    title: 'Sarkasma',
    family: 'entity',
    aliases: ['sarkasma_pool', 'sarkasma', 'red_smoke', 'therapy', 'debt'],
    description: 'Sarkasminy karty. Humor jako skalpel, protože jemnější nástroje si lidstvo očividně zapomnělo objednat.',
  },
  sarkasma_debt_pool: {
    id: 'sarkasma_debt_pool',
    title: 'Sarkasmin účet',
    family: 'entity',
    aliases: ['sarkasma_debt_pool', 'sarkasma_debt', 'debt', 'sarkasma', 'invoice', 'receipt'],
    description: 'Dluhové karty Sarkasmy. Když tě zachrání cynismus, účet nepřijde hned. To by bylo moc milosrdné.',
  },
  sarkasma_therapy_pool: {
    id: 'sarkasma_therapy_pool',
    title: 'Sarkasmino sezení',
    family: 'story',
    aliases: ['sarkasma_therapy_pool', 'sarkasma_therapy', 'therapy', 'sarkasma', 'defense'],
    description: 'Terapeutická místnost Sarkasmy. Cílem není pozitivita. Cílem je přesnější řez.',
  },
  sarkasma_aftercare_pool: {
    id: 'sarkasma_aftercare_pool',
    title: 'Sarkasmin aftercare',
    family: 'story',
    aliases: ['sarkasma_aftercare_pool', 'sarkasma_aftercare', 'sarkasma', 'cut_that_held', 'scalpel'],
    description: 'Dozvuky po řezu, který konečně podržel místo toho, aby jen dokazoval ostrost.',
  },
  form_office_pool: {
    id: 'form_office_pool',
    title: 'Formulářovna',
    family: 'sector',
    aliases: ['form_office_pool', 'form_office', 'form', 'office', 'blank_form', 'signature', 'audit'],
    description: 'Administrativní pasti, formuláře, razítka a násilí s pořadačem.',
  },
  acid_pool: {
    id: 'acid_pool',
    title: 'Acidová žluť',
    family: 'sector',
    aliases: ['acid_pool', 'acid', 'acid_yellow', 'cult', 'energy', 'overclock'],
    description: 'Acidové přepětí, Kult žluti a všechno, co svítí rychleji, než myslí.',
  },
  market_pool: {
    id: 'market_pool',
    title: 'Tržiště',
    family: 'sector',
    aliases: ['market_pool', 'market', 'trade', 'token', 'coin', 'debt'],
    description: 'Tržiště paměti, směna hranic a obchodníci, kteří by prodali i tvoje odmlčení.',
  },
  token_market_pool: {
    id: 'token_market_pool',
    title: 'Žetonové tržiště',
    family: 'item',
    aliases: ['token_market_pool', 'token_market', 'token', 'rusty_token', 'warm_token', 'named_token', 'market'],
    description: 'Žetonové následky, pojmenování a tržiště drobných kovových urážek.',
  },
  market_sells_no_pool: {
    id: 'market_sells_no_pool',
    title: 'Tržiště prodává ne',
    family: 'relationship',
    aliases: ['market_sells_no_pool', 'market_sells_no', 'returned_no', 'no', 'market', 'boundary'],
    description: 'Karty pro prodané, vrácené a vykoupené odmítnutí. Hranice jako obchodní komodita, protože lidstvo zjevně nemělo dost problémů.',
  },
  toll_dvanactnik_pool: {
    id: 'toll_dvanactnik_pool',
    title: 'Dvanáctník',
    family: 'toll',
    aliases: ['toll_dvanactnik_pool', 'toll_dvanactnik', 'dvanactnik', 'toll', 'debt', 'market'],
    description: 'Mýtnice mezi cykly. Nic není zdarma, jen některé účty mají lepší divadlo.',
  },
  toll_debt_pool: {
    id: 'toll_debt_pool',
    title: 'Dluh Dvanáctníka',
    family: 'toll',
    aliases: ['toll_debt_pool', 'toll_debt', 'debt', 'dvanactnik', 'unpaid', 'fake_memory'],
    description: 'Dluhové follow-upy Dvanáctníka. Placení falešnou pamětí je kreativní, ne chytré.',
  },
  detective_echo_case_pool: {
    id: 'detective_echo_case_pool',
    title: 'Echo případ',
    family: 'detective',
    aliases: ['detective_echo_case_pool', 'detective_echo_case', 'detective', 'case', 'archive', 'witness'],
    description: 'Detektivní linka paměti, kde pravda obvykle stojí vedle podezřelého a mlčí.',
  },
  detective_cold_case_pool: {
    id: 'detective_cold_case_pool',
    title: 'Studený případ',
    family: 'detective',
    aliases: ['detective_cold_case_pool', 'detective_cold_case', 'cold_case', 'case', 'detective', 'false_pattern'],
    description: 'Dozvuky vyšetřování, které se neuzavřelo násilím. Archiv je z toho nepříjemně nervózní.',
  },
  sealarium_pool: {
    id: 'sealarium_pool',
    title: 'Sealarium',
    family: 'item',
    aliases: ['sealarium_pool', 'sealarium', 'seal', 'rubber_seal', 'rubber_stamp', 'glitchka'],
    description: 'Gumový tuleň, razítkovací rituály a krizová ochrana s důstojností kancelářské hračky.',
  },
  seal_aftermath: {
    id: 'seal_aftermath',
    title: 'Tulenův dozvuk',
    family: 'item',
    aliases: ['seal_aftermath', 'seal', 'rubber_seal', 'saved', 'crisis'],
    description: 'Aftermath po tulením zásahu. Ano, systém byl zachráněn gumovou věcí. Ne, není to méně kanonické.',
  },
  sandbox_absurd_pool: {
    id: 'sandbox_absurd_pool',
    title: 'Absurdní pískoviště',
    family: 'story',
    aliases: ['sandbox_absurd_pool', 'sandbox_absurd', 'sandbox', 'banana', 'safe_mistake'],
    description: 'Banánové tribunály a právní systémy, které dávají větší smysl než reálné komentářové sekce.',
  },
  sandbox_aftermath_pool: {
    id: 'sandbox_aftermath_pool',
    title: 'Dozvuk pískoviště',
    family: 'story',
    aliases: ['sandbox_aftermath_pool', 'sandbox_aftermath', 'sandbox', 'dirty_laugh', 'safe_mistake'],
    description: 'Aftermath po bezpečné chybě nebo smíchu, který nezničil svět. V SYNTHOMĚ vzácný luxus.',
  },
  blackbox_aftermath_pool: {
    id: 'blackbox_aftermath_pool',
    title: 'Černý box aftermath',
    family: 'story',
    aliases: ['blackbox_aftermath_pool', 'blackbox_aftermath', 'blackbox', 'anonymization', 'named_error'],
    description: 'Aftermath po odmítnutí anonymizace a pojmenované chybě.',
  },
  brutal_blackbox_pool: {
    id: 'brutal_blackbox_pool',
    title: 'Brutální černý box',
    family: 'story',
    aliases: ['brutal_blackbox_pool', 'brutal_blackbox', 'blackbox', 'anonymization', 'system'],
    description: 'Tvrdší černoboxové karty. Systém si obléká rukavice jen proto, aby na nich nebyly otisky.',
  },
  shattered_mirror_aftermath: {
    id: 'shattered_mirror_aftermath',
    title: 'Roztříštěné zrcadlo',
    family: 'aftermath',
    aliases: ['shattered_mirror_aftermath', 'shattered_mirror', 'mirror', 'residuum', 'glitchka'],
    description: 'Aftermath po návštěvě zrcadla, rezidua a Glitchky v jednom cyklu. Osobnostní audit pláče v koutě.',
  },
  archive_pattern: {
    id: 'archive_pattern',
    title: 'Archiv poznal vzorec',
    family: 'aftermath',
    aliases: ['archive_pattern', 'archive', 'pattern', 'memory_flood', 'drowned_imprints'],
    description: 'Paměťová smrt vysokým přetlakem. Archiv nadšeně našel vzorec, protože nemá společenský takt.',
  },
  memory_flood: {
    id: 'memory_flood',
    title: 'Povodeň paměti',
    family: 'aftermath',
    aliases: ['memory_flood', 'memory', 'archive_pattern', 'drowned_imprints'],
    description: 'Paměť přetekla přes okraj a udělala z hráče sklep po havárii.',
  },
  drowned_imprints: {
    id: 'drowned_imprints',
    title: 'Otisky utopenců',
    family: 'aftermath',
    aliases: ['drowned_imprints', 'drowned', 'memory_flood', 'archive_pattern', 'memory'],
    description: 'Otisky po utopení v paměti.',
  },
  empty_memory: {
    id: 'empty_memory',
    title: 'Prázdná paměť',
    family: 'aftermath',
    aliases: ['empty_memory', 'memory_empty', 'empty_archive_page', 'post_format', 'memory'],
    description: 'Nízká paměť, prázdné štítky a neochotný archiv.',
  },
  post_format: {
    id: 'post_format',
    title: 'Po formátu',
    family: 'aftermath',
    aliases: ['post_format', 'format', 'empty_memory', 'memory'],
    description: 'Dozvuk po formátování identity.',
  },
  acid_aftermath: {
    id: 'acid_aftermath',
    title: 'Acidový dosvit',
    family: 'aftermath',
    aliases: ['acid_aftermath', 'acid', 'energy_high', 'overburn', 'overclock'],
    description: 'Vysoká energie po sobě nechává žlutou mapu a spálené okraje.',
  },
  overburn: {
    id: 'overburn',
    title: 'Přepálení',
    family: 'aftermath',
    aliases: ['overburn', 'energy', 'acid_aftermath', 'burned_but_bright'],
    description: 'Pamětní pomník přepálené energie.',
  },
  overclock: {
    id: 'overclock',
    title: 'Přetaktování',
    family: 'aftermath',
    aliases: ['overclock', 'energy', 'acid_aftermath', 'overclock_invoice'],
    description: 'Přetaktování jako panika v pracovním kostýmu.',
  },
  post_shutdown: {
    id: 'post_shutdown',
    title: 'Po vypnutí',
    family: 'aftermath',
    aliases: ['post_shutdown', 'shutdown', 'energy_low', 'dormant'],
    description: 'Nízká energie, vypnutí a tiché protokoly.',
  },
  dormant: {
    id: 'dormant',
    title: 'Dřímající protokol',
    family: 'aftermath',
    aliases: ['dormant', 'sleep', 'shutdown', 'post_shutdown', 'energy_low'],
    description: 'Spánek jako systémový odpor proti dalšímu přepalování.',
  },
  isolation_cards: {
    id: 'isolation_cards',
    title: 'Izolace',
    family: 'aftermath',
    aliases: ['isolation_cards', 'isolation', 'bond_low', 'empty_contacts', 'thread_cards'],
    description: 'Nízká Vazba. Nula konfliktů, nula náručí, nula důvodů nezkamenět.',
  },
  empty_contacts: {
    id: 'empty_contacts',
    title: 'Prázdné kontakty',
    family: 'aftermath',
    aliases: ['empty_contacts', 'contact', 'bond_low', 'isolation_cards'],
    description: 'Seznam kontaktů, který vypadá jako vymlácený hřbitov notifikací.',
  },
  thread_cards: {
    id: 'thread_cards',
    title: 'Nit pod dveřmi',
    family: 'aftermath',
    aliases: ['thread_cards', 'thread', 'bond_low', 'isolation_cards'],
    description: 'Vazba, která se ještě nevzdala a leze pod dveřmi jako emocionální kabeláž.',
  },
  dissolution: {
    id: 'dissolution',
    title: 'Rozpuštěná hranice',
    family: 'aftermath',
    aliases: ['dissolution', 'bond_high', 'merge_cards', 'boundary'],
    description: 'Vysoká Vazba, hranice se rozpouští a všichni se tváří, že je to romantické místo technické závady.',
  },
  merge_cards: {
    id: 'merge_cards',
    title: 'Protokol sloučení',
    family: 'aftermath',
    aliases: ['merge_cards', 'merge', 'bond_high', 'dissolution'],
    description: 'Karty sloučení, kde blízkost začne nosit nábytek do lebky.',
  },
  crystal_cards: {
    id: 'crystal_cards',
    title: 'Krystal kontroly',
    family: 'aftermath',
    aliases: ['crystal_cards', 'control_high', 'perfect_room', 'statue_cards', 'audit_cards'],
    description: 'Vysoká Kontrola, dokonalý pokoj a ledově krásná mrtvolnost.',
  },
  statue_cards: {
    id: 'statue_cards',
    title: 'Socha s pulzem',
    family: 'aftermath',
    aliases: ['statue_cards', 'statue', 'control_high', 'crystal_cards'],
    description: 'Stabilita tak tvrdá, že připomíná život jen z dálky.',
  },
  audit_cards: {
    id: 'audit_cards',
    title: 'Audit ticha',
    family: 'aftermath',
    aliases: ['audit_cards', 'audit', 'control_high', 'crystal_cards', 'form'],
    description: 'Kontrola přešla do auditu. To je chvíle, kdy i ticho vyplňuje přílohu.',
  },
  collapse_cards: {
    id: 'collapse_cards',
    title: 'Kolaps kontroly',
    family: 'aftermath',
    aliases: ['collapse_cards', 'collapse', 'control_low', 'post_collapse', 'chaos'],
    description: 'Nízká Kontrola a rozpad pravidel, která si myslela, že mají autoritu.',
  },
  post_collapse: {
    id: 'post_collapse',
    title: 'Po kolapsu',
    family: 'aftermath',
    aliases: ['post_collapse', 'collapse', 'control_low', 'shattered_protocol'],
    description: 'Dozvuk po rozbití řádu. Slepený protokol má ostré hrany, protože samozřejmě.',
  },
};

export function getPoolInfo(poolId: string): CyklusPoolInfo | undefined {
  return CYKLUS_POOL_CATALOG[poolId];
}

function fallbackPoolAliases(poolId: string): string[] {
  const base = poolId.replace(/_pool$/, '');
  const parts = base.split('_').filter(Boolean);
  const aliases = [poolId, base];
  if (parts.length > 1) aliases.push(...parts);
  return aliases;
}

export function getPoolAliases(poolId: string): string[] {
  const aliases = [...fallbackPoolAliases(poolId), ...(CYKLUS_POOL_CATALOG[poolId]?.aliases ?? [])];
  return [...new Set(aliases.filter(Boolean))];
}

export function cardMatchesUnlockedPool(card: SwipeCard, poolId: string): boolean {
  if (card.conditions?.some((condition) => condition.type === 'unlockedPool' && condition.poolId === poolId)) return true;
  const aliases = getPoolAliases(poolId);
  return aliases.some((alias) => card.tags.includes(alias));
}

export function getKnownPoolIds(): string[] {
  return Object.keys(CYKLUS_POOL_CATALOG).sort();
}
