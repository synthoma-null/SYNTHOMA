import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const out = path.dirname(fileURLToPath(import.meta.url));
const root = 'C:/SYNTHOMA';
const web = `${root}/apps/web`;
const readJson = (name) => require(path.join(out, name));
const inventorySummary = readJson('inventory-summary.json');
const near = readJson('near-duplicate-data.json');
const code = readJson('code-audit-data.json');
const css = readJson('css-audit-data.json');
const domain = readJson('domain-audit-data.json');
const runtime = readJson('runtime-audit-data.json');
const links = readJson('link-check-data.json');

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted && ch === '"' && text[i + 1] === '"') { value += '"'; i += 1; }
    else if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { row.push(value); value = ''; }
    else if ((ch === '\n' || ch === '\r') && !quoted) {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(value); value = '';
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else value += ch;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  const [headers, ...body] = rows;
  return body.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

const inventory = parseCsv(await fs.readFile(path.join(out, '03-file-inventory.csv'), 'utf8'));
const duplicateRows = parseCsv(await fs.readFile(path.join(out, '05-exact-duplicates.csv'), 'utf8'));
const routeRows = parseCsv(await fs.readFile(path.join(out, '09-route-matrix.csv'), 'utf8'));
const categoryStats = Object.fromEntries(['A', 'B', 'C', 'D'].map((category) => {
  const rows = inventory.filter((item) => item.recommendation.startsWith(`${category}:`));
  return [category, { files: rows.length, bytes: rows.reduce((sum, item) => sum + Number(item.sizeBytes || 0), 0) }];
}));
const fmt = (value) => new Intl.NumberFormat('cs-CZ').format(value);
const mb = (value) => `${(value / 1024 / 1024).toFixed(1)} MiB`;
const gb = (value) => `${(value / 1024 / 1024 / 1024).toFixed(2)} GiB`;
const write = (name, body) => fs.writeFile(path.join(out, name), `${body.trim()}\n`, 'utf8');
const csv = (headers, rows) => `${headers.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')}\n${rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')}\n`;
const severity = (level, impact, effort, risk, confidence, order) => `**${level}** | Dopad: ${impact} | Pracnost: ${effort} | Riziko změny: ${risk} | Jistota: ${confidence} | Pořadí: ${order}`;

const duplicateGroups = new Map();
for (const item of duplicateRows) {
  const group = duplicateGroups.get(item.group) ?? [];
  group.push(item);
  duplicateGroups.set(item.group, group);
}
const cssTotals = css.stats.reduce((acc, item) => {
  for (const key of ['bytes', 'lines', 'rules', 'declarations', 'mediaQueries', 'keyframes']) acc[key] += Number(item[key] || 0);
  return acc;
}, { bytes: 0, lines: 0, rules: 0, declarations: 0, mediaQueries: 0, keyframes: 0 });
const cssTexts = await Promise.all(css.stats.map(async (item) => {
  try { return await fs.readFile(path.join(root, item.path), 'utf8'); } catch { return ''; }
}));
const directColors = cssTexts.reduce((sum, text) => sum + (text.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/gi)?.length ?? 0), 0);
const fontValues = cssTexts.reduce((sum, text) => sum + (text.match(/font-size\s*:\s*(?!var\()[^;}{]+/gi)?.length ?? 0), 0);
const smallPx = cssTexts.reduce((sum, text) => sum + [...text.matchAll(/font-size\s*:\s*([0-9.]+)px/gi)].filter((match) => Number(match[1]) < 13).length, 0);
const keyframeNames = new Map();
for (let i = 0; i < cssTexts.length; i += 1) {
  for (const match of cssTexts[i].matchAll(/@(?:-webkit-)?keyframes\s+([\w-]+)/gi)) {
    const list = keyframeNames.get(match[1]) ?? [];
    list.push(css.stats[i].path);
    keyframeNames.set(match[1], list);
  }
}
const duplicateKeyframes = [...keyframeNames.values()].filter((locations) => new Set(locations).size > 1).length;

let coverage = null;
try {
  const coverageLib = require(path.join(web, 'node_modules/istanbul-lib-coverage'));
  const raw = JSON.parse(await fs.readFile(path.join(out, 'coverage/coverage-final.json'), 'utf8'));
  const map = coverageLib.createCoverageMap(raw);
  coverage = {
    total: map.getCoverageSummary().toJSON(),
    low: map.files().map((file) => {
      const summary = map.fileCoverageFor(file).toSummary().toJSON();
      return { file: path.relative(web, file), lines: summary.lines.pct, branches: summary.branches.pct };
    }).sort((a, b) => a.lines - b.lines).slice(0, 25),
  };
} catch {}

const exactSummary = [...duplicateGroups.entries()].map(([group, rows]) => {
  const paths = rows.map((row) => row.path);
  let note = 'Před smazáním určit kanonického vlastníka a změnit všechny reference.';
  if (paths.some((item) => item.includes('icons/source')) || paths.some((item) => item.includes('pwa-'))) note = 'Pravděpodobně záměrný vztah master → generovaný výstup; zdroj zachovat.';
  if (paths.some((item) => item.includes('synthoma_cyklus_cards_patch_v17'))) note = 'Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.';
  if (paths.some((item) => item.endsWith('synth-gate.css'))) note = 'Stejný obsah má importovanou i veřejnou URL roli; nejde automaticky sloučit bez změny kontraktu.';
  if (Number(rows[0].sizeBytes) === 0) note = 'Hash shoduje prázdné soubory; nejde o obsahovou duplicitu. Prázdný favicon je samostatný problém.';
  return `### ${group}\nSHA-256: ${rows[0].sha256}; velikost jedné kopie: ${fmt(Number(rows[0].sizeBytes))} B\n\n${paths.map((item) => `- ${item}`).join('\n')}\n\nDoporučení: ${note}`;
}).join('\n\n');

await write('00-executive-summary.md', `
# SYNTHOMA: forenzní audit

Datum a čas: 2026-07-22 10:10–11:00 CEST  
OS: Windows NT 10.0.26200.0  
Node.js: 24.12.0  
npm: 11.6.2  
Branch: refactor/mnem-entitlement-core  
Commit: 3ce9615e10cbe96e849537141e665fd5da6e4216  
Výchozí produkční větev podle origin/HEAD: main; skutečné nastavení Vercelu nebylo lokálně dostupné.  
Výchozí pracovní strom: čistý. Po auditu obsahuje pouze nový necommitnutý adresář audit/. Aplikační zdroje nebyly změněny.

## Verdikt

Repozitář je sestavitelný a běžný automatický baseline je zelený. Obsahové registry knih, Archivu a Cyklu jsou vnitřně konzistentní. Největší rizika nejsou „všechno je rozbité“, ale rozmazané vlastnictví generovaných dat, velmi široká CSS vrstva, process-local rate limiting veřejného AI API a konkrétní lokální chyba /api/whispers.

Vizuální a produkční shodu nelze uzavřít: přístup na www.synthoma.cz byl pro tento task zablokován politikou prohlížeče. Screenshoty, computed styles, hydratace v reálném prohlížeči, instalovatelnost a offline interakce proto mají stav HOLD, nikoli PASS.

## Čísla

- Soubory včetně ignorovaných závislostí a build cache: ${fmt(inventorySummary.files)} (${gb(inventorySummary.totalBytes)}).
- Tracked: ${fmt(inventorySummary.tracked)}; výchozí untracked: 0; ignored: ${fmt(inventorySummary.ignored)}.
- Repo bez node_modules, ale včetně lokálních build výstupů: 904.3 MB; node_modules: 975.1 MB.
- Kategorie A: ${fmt(categoryStats.A.files)} souborů / ${gb(categoryStats.A.bytes)} reprodukovatelných lokálních výstupů.
- Kategorie B: ${fmt(categoryStats.B.files)} souborů / ${mb(categoryStats.B.bytes)} přesných duplicit vyžadujících určení vlastníka.
- Kategorie C: ${fmt(categoryStats.C.files)} souborů / ${mb(categoryStats.C.bytes)} k autorskému rozhodnutí; statická reference není důkaz nepoužití.
- Kategorie D: ${fmt(categoryStats.D.files)} souborů / ${mb(categoryStats.D.bytes)} zachovat.
- Přesné duplicity: ${inventorySummary.duplicateGroups} skupin / ${inventorySummary.duplicateFiles} souborů.
- Podezřelé near-duplicates: ${inventorySummary.nearDuplicatePairs} párů.
- CSS: ${css.cssFiles} tracked stylesheetů, ${fmt(cssTotals.rules)} pravidel, ${fmt(css.importantTotal)} výskytů !important.
- Route crawl: ${links.checked} prověřených HTML URL, ${links.discovered} objevených interních odkazů, 0 rozbitých v tomto vzorku.

## Prioritní nálezy

1. ${severity('P1', 'lokální API runtime', 'malá až střední', 'nízké při úzké opravě', 'vysoká pro lokální reprodukci', '1')} /api/whispers vrací 500 při Prisma whisper.findMany s EACCES a neposkytne strukturovanou chybovou odpověď. Produkční stav není tímto testem prokázán.
2. ${severity('P1', 'ochrana veřejného AI API', 'střední', 'střední', 'vysoká', '2')} rate limiter je process-local Map. V multi-instance/serverless hostingu neomezuje souhrnný provoz a nepřežije cold start.
3. ${severity('P1', 'release jistota', 'ruční QA', 'žádné', 'vysoká', '3')} vizuální, PWA a produkční runtime matice zůstala HOLD kvůli blokovanému browser přístupu.
4. ${severity('P2', 'obsahový build', 'střední', 'střední', 'vysoká', '4')} README označuje public/books/manifest.json za zdroj pravdy, ale build ho generuje ze src/content/catalog.ts. Ruční editace může být přepsána.
5. ${severity('P2', 'údržba a regresní riziko', 'vyšší', 'vyšší', 'vysoká', '5')} 64 CSS souborů, 404 !important a jeden knižní stylesheet o 452.8 KB zvyšují riziko kolizí; automatické počty duplicit obsahují i legitimní media/theme/keyframe varianty.

## P0–P3

- P0: 0 potvrzených.
- P1: 3 (Whispers lokální 500; sdílený rate limit; chybějící browser/produkční důkaz pro release).
- P2: 9 skupin (zdroje pravdy, CSS, patch kopie, velké moduly, cykly importů, test gaps, CSP, konfigurace, asset ownership).
- P3: 7 skupin (lint warnings, prázdný favicon, redundantní .nvmrc, malé textové deklarace, extraneous balíček, dokumentační mezery, optimalizace assetů).

## Pět doporučení

1. Reprodukovat a úzce opravit /api/whispers v prostředí s platným Auth.js hostem; přidat signed-out/signed-in/empty-table integrační test.
2. Doložit hostingový model a nahradit AI rate-limit sdíleným atomickým backendem, pokud je produkce serverless nebo multi-instance.
3. Přepsat dokumentaci zdroje pravdy: catalog.ts je kanonický registr a odvozené JSON/TS bloky jsou generované a needitovatelné.
4. Udělat samostatnou ruční browser QA matici v povoleném prostředí včetně screenshotů, computed typography, PWA install/update/offline a reader choice gate.
5. Teprve potom čistit po dávkách: lokální cache, historickou patch složku, ověřené dependencies a CSS; každou dávku krýt buildem a behavior testy.
`);

await write('01-repository-map.md', `
# Mapa repozitáře

Projekt není skutečný package-manager workspace: kořen nemá package.json. Aktivní aplikace je jediný Next.js projekt v apps/web; lockfile a instalace závislostí jsou lokální tomuto adresáři.

## Kořen

- README.md, CONTRIBUTING.md, CHANGELOG.md, updates.md: projektové a evoluční dokumenty. updates.md je vize, nikoli implementační kontrakt.
- docs/: fáze, provozní a QA reporty. Aktivní pro znalost projektu, nikoli runtime.
- .devin/, .agents/: lokální workflow/agent metadata; před přesunem ověřit externí nástroje.
- .next/: ignorovaný kořenový artefakt, ne zdroj.
- AUDIT-REPORT.md a FINAL-IMPROVEMENTS.md: historické reporty; mohou zastarat a nemají přebíjet současný kód.

## apps/web

- app/: App Router stránky, layouty a 68 API route handlerů. Aktivní.
- src/components/: sdílené UI včetně čtečky, Archivu, Profilu, PWA a Cyklu. Aktivní.
- src/content/: kanonický obsahový katalog, prezentace kapitol, dialogové registry a generované indexy.
- src/content/protected/: chráněné HTML kapitol; server-only obsah.
- src/game/: obecná hra a samostatný Cyklus. Aktivní, s velkými datovými moduly.
- src/server/: runtime DB, ekonomika, kapitoly a veřejné AI API. Aktivní server-only hranice.
- src/styles/: globální design a doménové CSS. Aktivní, ale vlastnictví je rozptýlené.
- public/books/: veřejné HTML, knižní CSS a pomocné JS. Část je kanonický obsah, část je deploy kontrakt.
- public/data/: Archiv a manifestové registry. archiveCards*.json jsou aktuální runtime vstupy; jejich generování není sjednocené s catalog.ts.
- public/cards/: PNG master/source vrstva a optimalizované cyklus/*.webp runtime obrazy. Obojí nelze plošně mazat.
- public/audio, public/video, public/fonts, public/icons: runtime média. Ikony mají master → generovaný vztah.
- prisma/: schema a 7 migrací. Audit pouze validoval schéma, nic nemigroval.
- scripts/: obsahové, PWA, dialogové a backfill utility. Aktivní build skripty jsou generate-content, validate-content, generate-pwa-icons a build-pwa.
- synthoma_cyklus_cards_patch_v17/: historická pracovní kopie s přesnými kopiemi několika aktivních modulů; není importována a vyžaduje autorské potvrzení před odstraněním.
- node_modules, .next, coverage, tmp: lokální reprodukovatelné nebo dočasné výstupy, kategorie A; necommitovat.

## Dokumentační kontext

Přečteny byly README.md, CONTRIBUTING.md, PWA.md, SYNTHOMA-MANIFEST.txt, styl.md, oblouk.md, efekty.md, Cyklus README.md a TECHNICAL.md. SYNTHOMA-NULL.txt v repozitáři nalezen nebyl; tato povinná část kontextu je dokumentační mezera, ne důkaz, že obsah knihy chybí.
`);

await write('02-architecture-and-sources-of-truth.md', `
# Architektura a zdroje pravdy

| Oblast | Kanonický zdroj | Další zdroje / výstupy | Riziko divergence | Doporučení |
|---|---|---|---|---|
| Knihy, kapitoly, ceny, publikace | apps/web/src/content/catalog.ts | public/books/manifest.json, generated/*.json, generated blok booksManifest.ts | vysoké kvůli zastaralému README | označit výstupy jako generated; editovat pouze catalog.ts a HTML source |
| Text kapitol | public/books HTML pro free; src/content/protected pro chráněné | API response, reader index | střední | zachovat server-only hranici a validovat každý build |
| Pořadí a navigace kapitol | catalog.ts + getChapterNavigation | booksManifest.ts | střední | testovat kolekce odděleně, negenerovat pořadí ručně jinde |
| Archiv | public/data/archiveCards.json a archiveCards_en.json | catalog archive_record položky, dialogové/reader unlocky | vysoké | jeden typovaný source registr, z něj generovat locale JSON i catalog metadata |
| Postavy a barvy | src/content/speakers.ts + archivní display.accent | CSS speaker proměnné, JSON accent | vysoké | zavést typed speaker registry s CSS exportem |
| Dialogové třídy a tóny | speaker/tone parser + knižní HTML třídy | knižní CSS, migrate-book-dialogs.js | střední | validátor ponechat povinný; explicitní tone rozšiřovat bez ručního kopírování barev |
| Motivy čtečky a ceny | booksManifest.ts COSMETICS + ThemeShop/access backend | CSS data-theme selektory | střední | oddělit definici kosmetiky od generovaného chapter bloku a sdílet ID/cenu backendu i UI |
| Entitlement/MNEM | Prisma schema + src/server/economy | frontend access model, legacy fallback | střední | po potvrzeném produkčním schématu naplánovat odstranění legacy fallbacku samostatně |
| Reader progress | /api/me/progress pro účet; localStorage pro anonymní režim | readerState, choice tracking | střední | dokumentovat merge policy po přihlášení a testovat monotonic completion |
| Local storage klíče | rozptýlené constants v reader, UI prefs, Cyklus a PWA | legacy aliases | vysoké | vytvořit namespaced registry + verze + migrační funkce |
| Cyklus data | enriched content registry z src/game/cyklus/content | cyklusCards, pack files, pool catalog | nízké/střední | zachovat fasádu, přidat referenční validátor do CI; patch složku oddělit |
| PWA manifest | app/manifest.ts | public/manifest.webmanifest build output | střední | výstup generovat a označit; jednu build version předat manifestu i SW |
| Service worker | scripts/build-pwa.mjs | public/sw.js | střední | SW je generovaný deploy artefakt; nepovažovat statický soubor za ručně editovaný zdroj |
| SEO/sitemap/robots | App Router metadata + content catalog | veřejné XML/TXT odpovědi | nízké | ponechat generování z catalog.ts a canonical config |
| Public AI/markdown | src/server/public-ai | llms.txt, llms-full.txt, OpenAPI route | střední | sdílený rate limiter a contract tests pro visibility |
| Design tokeny | src/styles/base.css + theme CSS | knižní CSS a lokální variables | vysoké | definovat core token contract, knižní styly smějí pouze rozšiřovat namespaced tokeny |
| Fonty | public/fonts + @font-face deklarace | knižní CSS | střední | jeden font manifest a kontrola duplicitních downloadů |

## Generátory

- generate-content.js: vstup catalog.ts a chapter HTML; výstup public/books/manifest.json, tři generated JSON indexy a ohraničený blok booksManifest.ts. Build hlásil 0 změn, tedy aktuálně idempotentní.
- validate-content.js: validuje 131 položek a 41 kapitol. Má runtime importní cyklus s generate-content.js; rozdělit sdílené helpery až v samostatné fázi.
- generate-pwa-icons.mjs: master ikony → rozměrové PNG. Výstupy jsou commitované/runtime.
- build-pwa.mjs: Workbox konfigurace → public/sw.js. Build vytvořil 24 precache položek.
- migrate-book-dialogs.js: auditní režim nic nemění; kontrola našla 6 770 dialogů, 39 speakerů, 0 neznámých tříd.
- backfill-content-entitlements.js a migrate-konec-podpory.js jsou explicitně mutační utility; nejsou běžnou součástí buildu.

Nejasnost: README stále popisuje public/books/manifest.json jako ručně spravovaný zdroj pravdy. To je v konfliktu se skutečným build pipeline.
`);

await write('06-near-duplicates.md', `
# Podezřelé near-duplicates

Použit byl perceptuální aHash přes sharp. Nalezeno ${near.pairs.length} párů mezi ${near.imageCount} obrázky. Výsledek je kandidátní seznam, nikoli oprávnění k mazání.

${near.pairs.map((pair, index) => `${index + 1}. ${pair.a} ↔ ${pair.b}; distance ${pair.distance}; ${pair.dimensionsA} / ${pair.dimensionsB}`).join('\n')}

## Interpretace

- Páry PWA masteru a rozměrových ikon jsou očekávané generované varianty.
- Většina párů karet má shodný posterový formát a podobné plochy, ale jiný význam i název; aHash zde vytváří falešné pozitivní výsledky.
- PNG v public/cards jsou velké zdrojové/master obrazy, zatímco public/cards/cyklus/*.webp je optimalizovaná runtime vrstva. Doménový audit potvrdil 66 karet s art a přesně 66 existujících WebP bez sirotků.
- Před jakýmkoli sloučením je nutné zobrazit dvojice vedle sebe a ověřit registry i původ assetu.
`);

await write('07-dead-code-and-dependencies.md', `
# Mrtvý kód, duplicity a dependencies

## Import graph

Nalezeny 2 cykly:

1. src/game/run/runTypes.ts ↔ src/game/encounter/encounterTypes.ts. Jde převážně o typovou hranici; doporučen je neutrální shared types modul.
2. scripts/validate-content.js ↔ scripts/generate-content.js. CLI funguje, ale sdílené utility mají být v třetím modulu bez zpětného importu.

## Statické orphan kandidáty

${code.orphanCandidates.map((item) => `- ${item.path} (${item.lines} řádků): ${item.caveat}`).join('\n')}

Next konvenční soubory, test config, public skripty, worker a test utility nejsou mrtvé jen proto, že nemají běžný import. Silnější kandidáti k ručnímu ověření jsou CyklusMobileHud.tsx, src/components/cyklus/cyklusStorage.ts, SettingsPanel.tsx, actionTexts.ts, game/storage.ts, useTypewriterReader.ts a cinematicTitle.ts.

## Přesné kódové kopie

${exactSummary}

## Dependencies

- html2canvas, jspdf a jose nemají ve statickém import skenu žádnou referenci. Ověřit skripty, dynamické importy a export funkce; potom odebrat v samostatném commitu a spustit full suite/build.
- Dev dependencies nelze hodnotit podle importů: Jest, ESLint, TypeScript a Testing Library jsou používány konfigurací a test runnerem.
- npm ls --depth=0 hlásí extraneous @emnapi/runtime@1.5.0; pravděpodobně pozůstatek lokální instalace, ne položka package.json.
- npm audit nebylo možné dokončit: síť byla v sandboxu blokována a eskalace byla zamítnuta limitem. Stav známých advisories je HOLD.
- engines node >=20 je příliš široké a automaticky dovolí budoucí major; .nvmrc říká 20, lokální běh byl na Node 24. Doporučeno pinovat podporovaný LTS major a sjednotit kořen/app .nvmrc.
- .env.example dokumentuje jen DATABASE_URL a AUTH_SECRET; chybí DIRECT_URL, AI_STATE_TOKEN_SECRET, Stripe a další názvy bez hodnot. To je onboarding/config drift.

## noUnused audit

Přísný jednorázový TypeScript běh našel nepoužité lokální importy/parametry například v fragments API, game room, badges, DebugPanel, GlobalAudio, ReaderContent, CyklusClient, CyklusMobileHud, discovery, GameShell a ChapterSyncLog. Část hlášení v cyklusEngine je falešně pozitivní kvůli veřejným re-exportům fasády. Nedoporučuje se zapnout noUnused jako blokující pravidlo bez nejprve malé mechanické cleanup dávky.

## Velké moduly

${code.largestModules.slice(0, 18).map((item) => `- ${item.path}: ${fmt(item.lines)} řádků`).join('\n')}

Nejprve vyjasnit vlastnictví dat a test coverage; velikost sama o sobě není důvod k refaktoru.
`);

await write('08-css-audit.md', `
# CSS audit

## Statistika

- Tracked CSS souborů: ${css.cssFiles}
- Celková velikost: ${mb(cssTotals.bytes)}
- Parse řádků: ${fmt(cssTotals.lines)}
- Pravidel: ${fmt(cssTotals.rules)}
- Deklarací: ${fmt(cssTotals.declarations)}
- !important: ${fmt(css.importantTotal)}
- Inline style výskytů v TS/TSX: ${css.inlineStyles.length}
- @keyframes: ${fmt(cssTotals.keyframes)}
- Názvů keyframes definovaných ve více souborech: ${fmt(duplicateKeyframes)}
- Přímých zápisů barev: ${fmt(directColors)}
- Přímých font-size deklarací mimo var(): ${fmt(fontValues)}
- Statických font-size v px pod 13 px: ${fmt(smallPx)}
- CSS variables: ${css.variables.defined} definovaných / ${css.variables.used} použitých
- Hrubý počet opakovaných selectorů: ${fmt(css.duplicateSelectors.length)}
- Hrubý počet selector/property konfliktů: ${fmt(css.conflicts.length)}
- Staticky neodkázané class kandidáty: ${fmt(css.unusedClasses.length)}

Počty duplicit zahrnují media queries, themes, state varianty a keyframe kroky. Nejsou seznamem bezpečného mazání.

## Největší vrstvy

${css.stats.slice(0, 12).map((item) => `- ${item.path}: ${fmt(item.bytes)} B, ${fmt(item.rules)} rules, ${fmt(item.important)} !important, ${fmt(item.keyframes)} keyframes`).join('\n')}

## Nálezy

1. ${severity('P2', 'globální regresní riziko', 'vyšší', 'vyšší', 'vysoká', 'po stabilizaci runtime')} KONEC PODPORY CSS má 452.8 KB a 142 keyframes; jednotlivé kapitoly sdílejí obří stylesheet. Namespacing existuje, ale údržba je obtížná.
2. ${severity('P2', 'komponentní konzistence', 'střední', 'střední', 'vysoká', 'design token fáze')} components.css má 114 !important a kombinuje utility, reader, glitch i starší globální chování.
3. ${severity('P2', 'Cyklus', 'střední', 'střední', 'vysoká', 'až po browser QA')} src/styles/cyklus/legacy.css má 120.7 KB. Mazat pouze selektory s runtime coverage, ne podle textového skenu.
4. ${severity('P2', 'zdroj pravdy', 'malá', 'střední', 'vysoká', 'časně')} public/synth-gate.css a src/styles/synth-gate.css jsou byte-identické, ale mají odlišný runtime kontrakt (veřejná URL vs import). Dokumentovat ownera nebo generovat public kopii.
5. ${severity('P3', 'čitelnost', 'střední', 'nízké', 'střední', 'po computed audit')} auth UI a některé reader controls používají .62–.8rem. Bez computed browser testu nelze určit reálné pixely po user scale.
6. Inline styly jsou z velké části dynamické CSS variables, OG image layout a progress hodnoty. DebugPanel obsahuje statické inline bloky vhodné k pozdějšímu přesunu.

## Cílové vlastnictví

- core/tokens.css: barvy, typografie, spacing, z-index, motion, safe-area.
- shell.css: společný OS shell a navigace.
- reader/base.css + reader/themes.css: společné reader kontrakty.
- books/null.css a books/konec-podpory.css: pouze namespaced výrazové vrstvy.
- archive.css, cyklus/*.css, pwa.css: doménové vrstvy bez globálních resetů.
- generated/public CSS kopie musí mít banner s generátorem a nesmí se ručně editovat.
`);

await write('10-runtime-errors.md', `
# Runtime, route a provozní chyby

## Lokální produkční server

Testováno proti čerstvému next start na http://localhost:3210 po úspěšném production buildu.

- 41/41 kanonických chapter page routes: HTTP 200. Nepublikované kapitoly mohou mít veřejnou metadata/gate page; jejich API vrací 409.
- Free chapter API: 200 a HTML.
- Locked chapter API: 403 se strukturovaným CONTENT_LOCKED; chráněný text nebyl vydán.
- Unavailable chapter API: 409.
- Unknown chapter a unknown page: 404.
- Legacy reader odkazy: 308 na kanonickou /chapter/[id].
- /api/me/profile signed-out: 401.
- /api/admin/overview signed-out: 401.
- /api/whispers: 500.
- Interní crawl: ${links.checked} URL, ${links.discovered} odkazů, 0 zjištěných 404/5xx/redirectů ve vzorku.

## Whispers

${severity('P1', 'endpoint je lokálně nefunkční', 'malá až střední', 'nízké při úzké opravě', 'vysoká lokálně', '1')}

Serverový log ukázal Prisma operaci whisper.findMany(), error code EACCES a Prisma Client 7.8.0. Odpověď měla prázdné tělo a chyběl JSON Content-Type. Současně se v logu opakoval Auth.js UntrustedHost pro http://localhost:3000/api/auth/session, protože server běžel na 3210 a lokální auth URL zůstala na 3000.

EACCES může být lokální síťové/sandbox omezení a samo nedokazuje produkční DB chybu. Endpoint však má minimálně slabou error boundary. Další krok: reprodukce na správném hostu, signed-out/signed-in/empty table a úzký handler test. Žádná schema změna z tohoto auditu neplyne.

## Console a hydration

Reálný browser runtime nebyl povolen, proto console errors, hydration #418, network waterfall a media errors zůstávají HOLD. HTML odpovědi neměly marker Next server error. To není náhrada za hydrataci.

## Produkční shoda

Lokální HEAD je 3ce9615. origin/HEAD ukazuje main, ale skutečná Vercel Production Branch, deployment ID, alias a servírované chunky nebyly dostupné. Produkční doména nesmí být označena za shodnou jen na základě lokálního buildu.
`);

await write('11-visual-consistency.md', `
# Vizuální konzistence

## Stav ověření

Automatizovaný browser přístup na https://www.synthoma.cz byl explicitně odmítnut bezpečnostní politikou prostředí. Nebyl použit jiný browser ani CDP obcházení. Požadovaných 48 screenshotů nebylo vytvořeno; adresář screenshots obsahuje pouze vysvětlení blokace.

| Route/oblast | Statické vlastnictví | Browser verdict |
|---|---|---|
| Home | SynthomaShell + home komponenty | HOLD |
| Books | library komponenty + books CSS | HOLD |
| Archive | shared shell, vlastní grid/dialog | HOLD |
| Cyklus | vlastní OS vrstva a rozsáhlé doménové CSS | HOLD |
| Autor | vlastní module CSS, fallback vrstva | HOLD |
| Install/PWA | shared shell + PWA komponenty | HOLD |
| Profile/Settings | shared panely, několik lokálních vrstev | HOLD |
| NULL reader | společný reader + NULL CSS | HOLD |
| KONEC PODPORY reader | společný reader + 452 KB knižního CSS | HOLD |
| Offline/404 | App Router shell | HOLD |

## Statické závěry

- Společný SynthomaShell, command header, portal rooty a reader komponenty jsou správným směrem.
- Autor má vlastní fallback stylesheet a vyžaduje ověření, že výsledný shell není starší paralelní varianta.
- NULL a KONEC PODPORY sdílejí reader controllers, ale výrazová CSS vrstva druhé knihy je natolik velká, že vizuální equivalence ověřit jen import graph nelze.
- Archiv má accent barvy přímo v locale JSON; dialogy čerpají speaker registry/CSS. Je nutné vizuálně i datově sjednotit původ barev.
- Cyklus má vlastní dominantní UI jazyk. Integrace přes globální header existuje, ale soudržnost je browser otázka.

## Ruční screenshot matice

Po odblokování zachytit home, books, archive, cycle, autor, install, profile, settings, oba readery, offline a 404 na 390×844, 768×1024, 1440×900 a 1920×1080. Ke každému snímku zaznamenat overflow, header, focus, text scale, prázdný/loading/error stav a identitu shellu.
`);

await write('12-accessibility-and-readability.md', `
# Accessibility a čitelnost

## Co bylo možné ověřit staticky

- V kódu je přibližně 1 622 výskytů ARIA/role/tabIndex/onClick; projekt přístupnost aktivně řeší.
- HTML audit 39 knižních souborů našel 0 obrázků bez alt a 0 souborů s duplicitními id.
- Reader má skip link, command rail, focus a choice controllers; komponentové testy kryjí část chování.
- Nalezeny clickable divy v SoloClient help overlay, MBTIHudClient a ChapterSyncLog. Overlay backdrop může být legitimní doplňková click target, MBTI chip ale potřebuje keyboard/role nebo button.
- Statický CSS scan našel ${smallPx} font-size hodnot pod 13 px vyjádřených v px; rem hodnoty .62–.8rem se vyskytují v auth, reader a utility UI.

## Co nelze tvrdit bez browseru

Computed font-size, line-height, kontrast, reálná opacity, délka řádku, safe-area, zoom 200 %, focus order, screen-reader názvy, overflow a mobilní header jsou HOLD. Zdrojové CSS neprokazuje výsledný cascade.

| Route | Desktop | Tablet | Mobile | Typografie | Kontrast | Overflow | Header | Výsledek |
|---|---|---|---|---|---|---|---|---|
| / | HOLD | HOLD | HOLD | staticky bez verdiktu | HOLD | HOLD | shared | HOLD |
| /books | HOLD | HOLD | HOLD | některé 0.9rem | HOLD | HOLD | shared | HOLD |
| /archive | HOLD | HOLD | HOLD | card text ověřit | accent role ověřit | HOLD | shared | HOLD |
| /cyklus | HOLD | HOLD | HOLD | komplexní responsive CSS | color-only rizika ověřit | HOLD | vlastní integrace | HOLD |
| /autor | HOLD | HOLD | HOLD | fallback CSS | HOLD | HOLD | ověřit shared shell | HOLD |
| /install | HOLD | HOLD | HOLD | PWA copy | HOLD | HOLD | shared | HOLD |
| /profile/settings | HOLD | HOLD | HOLD | dense panels | HOLD | HOLD | shared | HOLD |
| oba readery | HOLD | HOLD | HOLD | body text a controls odděleně | speaker tones | HOLD | rail/command bar | HOLD |
| /offline a 404 | HOLD | HOLD | HOLD | error copy | HOLD | HOLD | shared | HOLD |

## Doporučený acceptance test

Spustit existující scripts/typography-readability-audit.js v reálném browseru na všech požadovaných viewports. Blokovat důležitý UI text pod 13 px, odstavce pod 16 px, dlouhý tracking, opacity pod 0.6 bez sekundární role, horizontální overflow a obsah zakrytý fixními prvky.
`);

await write('13-pwa-audit.md', `
# PWA audit

## Build-time PASS

- Manifest 200, application/manifest+json, 5 ikon, 4 shortcuts a 3 screenshots.
- Service worker 28 424 B, 24 precache položek a 5 runtime cache strategií.
- PWA audit skript prošel; 6 ikon bylo ověřeno/generováno.
- Citlivé /api, auth, profile, purchase a admin cesty jsou NetworkOnly.
- _rsc, text/x-component a router prefetch nejsou cachovány.
- Mutující metody nejsou runtime cache cílem.
- CSS/font/static používají CacheFirst, images StaleWhileRevalidate, navigace NetworkFirst s /offline fallbackem.
- Verze cache je namespaced a cleanup starých cache existuje.

## Rizika

1. ${severity('P2', 'update UX', 'malá/střední', 'střední', 'vysoká', 'po browser QA')} Workbox používá skipWaiting:true a clientsClaim:true. Nový worker se může aktivovat ještě před potvrzením uživatele; ověřit soulad s update dialogem.
2. Fresh install precache neobsahuje celé knihy. Offline funguje pro shell/fallback a navštívené navigace, ne automaticky pro všechny kapitoly. To musí UI popsat pravdivě.
3. public/sw.js je generovaný soubor; pětřádková pre-build varianta a finální Workbox output mohou mást statické skeny. Zdroj je build-pwa.mjs.
4. Prázdný public/assets/images/favicon.ico má 0 B; i když aplikace může používat jiné ikony, tento asset je vadný kandidát.

## Browser HOLD

- skutečný controller a scope
- install prompt na podporované platformě
- standalone launch
- update dialog a reload
- offline navštívené kapitoly
- hydration #418 a Response body is already used
- anonymní /api/me/* spam v network panelu

Verdikt: PWA build contract PASS; reálná instalovatelnost/update/offline runtime HOLD.
`);

await write('14-reader-and-books-audit.md', `
# Knihy a čtečka

## Katalog

- Celkem 41 kapitol, žádný chybějící source soubor.
- SYNTHOMA-NULL: 22 kapitol, 13 published, 5 free.
- SYNTHOMA: KONEC PODPORY: 19 kapitol, 19 published a free.
- Obsahové validace: 131 položek / 41 kapitol PASS.
- 39 fyzických HTML content souborů, přibližně 168 231 slov, 443 voleb a 8 041 dialogových tříd.
- Dialog audit: 6 770 dialogů, 39 rozpoznaných speakerů, 2 210 explicitních tónů, 4 560 fallback tónů, 0 neznámých tříd.

## Nálezy

1. catalog.ts je skutečný manifest owner; public/books/manifest.json a generated indexy jsou odvozené. README tuto skutečnost popisuje chybně.
2. CS a EN 0-2 [RUN] jsou byte-identické. Může jít o záměrně nepřeložený obsah; vyžaduje obsahové rozhodnutí.
3. Orphan HTML seznam obsahuje pět EN NULL souborů, protože catalog eviduje český sourcePath a EN filename zvlášť; nejde automaticky o sirotky. Skutečně prověřit efekty.html a SYNTHOMA.html jako utility/legacy vstupy.
4. Chybějící lang na fragmentech není totéž co nevalidní HTML dokument, protože reader načítá fragmenty. Pokud mají být samostatně indexovatelné, doplnit formální contract.
5. Locked API nevydalo chráněný text a vrátilo 403. Free API vrátilo celý HTML obsah. Unavailable vrátilo 409.

## Choice gate

Reader decision controller, segment renderer a testy existují; coverage je slabší v ReaderDecisionController (44.82 % lines) a readerSegmentRenderer (50 %). Full Jest prošel, ale povinný desetisekundový browser scénář, reload před/po volbě, skip animace a závěrečná volba nebyly v tomto auditu interaktivně provedeny. Známý invariant „typewriter nepřejde přes nevyřešenou volbu“ je automaticky testovaný částečně, runtime verdikt zůstává HOLD.

## Progress

Server API a anonymní local state mají oddělené cesty. Testy kryjí monotonic completion, ale skutečný owned účet a merge po přihlášení nebyly použity. Žádný účet ani MNEM nebyl změněn.
`);

await write('15-archive-audit.md', `
# Archiv

## Data

- public/data/archiveCards.json: 41 položek.
- public/data/archiveCards_en.json: 41 položek.
- Obě locale varianty mají stejnou množinu ID a kategorií.
- Chybějící title/description: 0; invalid related references: 0.
- KONEC PODPORY položky jsou přítomny (ID s prefixem kp-).

## Riziko zdroje pravdy

Archivní obsah existuje v locale JSON, catalog.ts jako archive_record metadata, reader unlock logice a speaker/CSS barvách. Není doložen jediný generátor všech těchto vrstev. Největší riziko je divergence ID, unlock podmínky a accent barvy, nikoli aktuální chybějící záznam.

## Doporučení

Vytvořit jeden typovaný archivní registr s locale texty, source book, unlock trigger, category, related IDs a speaker/color role. Z něj generovat public JSON i catalog entries. Barvu postavy neukládat jako volný hex u každé karty, ale odkazovat na speaker role; výjimky explicitně pojmenovat.

## Runtime

/archive lokálně vrací 200. Ve build reportu má přibližně 380 KB first-load JS a page coverage 48.14 %. Filtrování, dlouhé karty, zámky a vizuální barvy nebyly kvůli browser blokaci ručně potvrzeny. Verdict: datová konzistence PASS, UX/runtime HOLD.
`);

await write('16-cycle-audit.md', `
# Cyklus

## Referenční integrita

- 349 unikátních karet, 349 unikátních ID.
- missing packId/role/tone/choices: 0.
- 66 karet s poster art, 66 WebP souborů, 0 chybějících a 0 osiřelých runtime art souborů.
- Role: resolution 33, entry 142, object 49, escalation 41, echo 29, temptation 25, twist 15, bill 15.
- Tóny: tragic 289, horror 32, absurd 25, tender 56, comic 35, romantic 14, erotic_symbolic 12, brutal 11. Součet přesahuje počet karet, protože karta může mít více tónů.
- Cyklus test baseline je součástí 790 zelených testů; heavy simulation je správně skipnutá bez RUN_SLOW_SIM=1.

## Struktura

Engine facade funguje, ale cyklusProgression.ts má 2 112 řádků, CyklusClient.tsx 2 059, followup.cards.ts 1 609 a cyklusEngine.ts 947. To jsou kandidáti k budoucímu rozdělení podle odpovědnosti, nikoli aktuální mrtvý kód.

Historická složka synthoma_cyklus_cards_patch_v17 obsahuje byte-identické kopie nejméně osmi aktivních modulů. Statický import graph ji nepoužívá. Kategorie C/B: potvrdit, zda jde o jedinou zálohu zdrojových návrhů; pak odstranit jako samostatný cleanup.

## Storage a migrace

Existují dvě pojmenované storage vrstvy (src/game/cyklus/cyklusStorage.ts a src/components/cyklus/cyklusStorage.ts). Druhá nemá statický inbound import a je silný kandidát k ověření duplicity/legacy. Staré save migrace a anonymní/server sync mají testy, ale reálný browser refresh a přihlášený merge nebyly v tomto auditu spuštěny.

## Výkon a UX

/cyklus má build first-load přibližně 397 KB a /cyklus/void 344 KB. 66 optimalizovaných WebP je aktivních, ale 67 velkých PNG masterů zvyšuje repository/deploy asset footprint; přesun masterů mimo public je možný až po vyjasnění generátoru a deployment potřeb.
`);

await write('17-test-coverage-gaps.md', `
# Test coverage a mezery

## Výsledek

- Jest: 118/119 suites passed, 1 skipped; 790 passed, 21 skipped, 811 celkem.
- Coverage: statements ${coverage?.total.statements.pct ?? 'n/a'} %, branches ${coverage?.total.branches.pct ?? 'n/a'} %, functions ${coverage?.total.functions.pct ?? 'n/a'} %, lines ${coverage?.total.lines.pct ?? 'n/a'} %.
- Skipy: PostgreSQL transaction suite bez explicitního connection stringu a heavy Cyklus simulace bez RUN_SLOW_SIM=1.
- Není zavedený vlastní Playwright/Cypress screenshot runner. Playwright je pouze transitivně přítomen v lockfile, ne jako potvrzený projektový QA systém.

## Nejnižší line coverage

${coverage?.low.map((item) => `- ${item.file}: lines ${item.lines} %, branches ${item.branches} %`).join('\n') ?? 'Coverage detail unavailable.'}

## Kritické mezery

1. Browser choice gate: čekání, skip, reload před/po volbě, poslední volba a nedostupnost budoucí větve.
2. PWA: skutečný install prompt, controller, update lifecycle, offline navštívené kapitoly a cache cleanup.
3. Accessibility/visual: computed typography, kontrast, keyboard flow, 200% zoom a screenshot diff.
4. Whispers: signed-out, signed-in, empty table, DB failure a konzistentní JSON error.
5. Ekonomika: ledger.ts 13.72 % a transaction.ts 16.66 % lines; PostgreSQL integrační suite je podmíněně skipnutá.
6. Owned chapter/profile runtime se skutečnou session; komponentové mocky nejsou důkaz databázového toku.
7. Public AI rate limit přes více instancí/cold start.
8. Produkční console/hydration/network monitoring.

## Co je dobře kryto

Content validation, katalog, chapter access kontrakty, Cyklus engine/content invariants, veřejné API visibility, reader utility logika, PWA build pravidla a řada komponentových stavů mají široký automatický baseline. Počet testů je užitečný; release jistotu však omezuje absence skutečné browser vrstvy.
`);

await write('18-cleanup-roadmap.md', `
# Etapový plán úklidu

## Etapa 0: Stabilizace

Cíl: uzavřít P1 bez architektonických odboček.

- Reprodukovat /api/whispers na správném hostu, opravit pouze handler/DB access příčinu a přidat JSON error contract.
- Doložit Vercel hosting model; pro multi-instance nasadit sdílený rate-limit adaptér s atomickým increment/TTL.
- Provést povolenou produkční browser QA: reader choice gate, owned/free/locked, PWA update/offline, console/hydration.
- Podmínky přijetí: žádné 500, rate-limit funguje napříč instancemi, screenshot/runtime matice vyplněná, full suite/build zelené.
- Rollback: úzké samostatné commity; žádné schema změny.
- Odhad: 1–3 dny podle přístupu k produkčnímu QA.

## Etapa 1: Bezpečný úklid

- Mazat jen po dávkách z kategorie A, nikoli node_modules běžícího prostředí; reprodukovat instalací/buildem.
- Rozhodnout historickou synthoma_cyklus_cards_patch_v17 a přesné duplicity ikon/CSS.
- Ověřit html2canvas, jspdf, jose a extraneous @emnapi/runtime.
- Opravit prázdný favicon a dokumentovat master/generated assety.
- Podmínky: git diff předem, content generate dvakrát bez změn, lint/typecheck/Jest/build.
- Rollback: jeden commit na jednu kategorii.
- Odhad: 0.5–1.5 dne.

## Etapa 2: Zdroje pravdy

- Prohlásit catalog.ts za owner knih/kapitol a generované výstupy označit bannery.
- Typovaný Archiv registr a speaker/color registry.
- Registry storage keys a migrační verze.
- Oddělit manuální COSMETICS/PACKAGES od generated chapter bloku booksManifest.ts.
- Sjednotit PWA build version a dokumentaci env názvů.
- Odhad: 2–5 dnů; střední riziko, vyžaduje contract tests.

## Etapa 3: CSS a vizuální systém

- Nejdřív computed screenshot baseline.
- Zavést core token contract, namespacing a ownership map.
- Rozdělit components.css a knižní CSS podle skutečných runtime hranic; redukovat !important po ověření cascade.
- Sjednotit typography minima, breakpoints, safe areas, focus a reduced motion.
- Odhad: 4–10 dnů; vysoké vizuální riziko, rollback po route skupinách.

## Etapa 4: Architektura

- Rozdělit cyklusProgression a CyklusClient podle doménových odpovědností bez změny gameplay.
- Přerušit dva import cycles.
- Odstranit potvrzené orphan komponenty/storage vrstvy.
- Zlepšit ekonomika/API testovatelnost a eliminovat legacy DB fallback až po produkčním potvrzení.
- Odhad: 5–12 dnů, vysoká potřeba testů.

## Etapa 5: Výkon a dlouhodobá údržba

- Route-level lazy loading pro Archive/Cyklus.
- Přesun asset masterů mimo public, optimalizace 8.8MB OG obrázku a 109.5MB audia.
- CI: content drift, typecheck, Jest, PWA audit, browser smoke, a11y, broken links, bundle budgets.
- Monitoring 5xx, hydration, SW update a veřejné API rate-limit telemetry bez osobních dat.
- Odhad: průběžně 3–8 dnů první iterace.
`);

await write('19-proposed-target-architecture.md', `
# Navržená cílová architektura

Návrh zachovává Next.js App Router a současné domény. Nejde o přepis frameworku.

~~~text
apps/web/
  app/                         # pouze routes, metadata a tenké composition vrstvy
  src/
    content/
      catalog/                 # jediný typed katalog knih, kapitol, produktů
      books/                   # metadata a odkazy na HTML sources
      archive/                 # typed locale registry + unlock metadata
      speakers/                # role, barvy, aliases, tones
      generated/               # pouze generované, banner DO NOT EDIT
    features/
      reader/                  # controllers, state, UI, tests
      library/
      archive/
      profile/
      cyklus/                  # engine/content/ui/storage odděleně
      pwa/
      public-ai/
    server/
      auth/
      chapters/
      economy/
      rate-limit/
    design-system/
      tokens.css
      shell.css
      typography.css
      motion.css
      ui/
    platform/
      storage-keys.ts
      env.ts
      observability.ts
  content-source/
    books/null/
    books/konec-podpory/
    media-masters/             # není přímo servírováno
  public/
    generated/                 # optimalizované runtime assets
    fonts/
  scripts/
    content/
    pwa/
    qa/
  tests/
    contracts/
    integration/
    browser/
    visual/
~~~

## Pravidla hranic

- Route importuje feature veřejné API; feature neimportuje app route.
- Server-only moduly nesmí být re-exportovány klientskými barrels.
- Každý generovaný soubor uvádí zdroj a příkaz; CI ověří nulový diff po generování.
- Archivní barva odkazuje na speaker role, ne na zkopírovaný hex.
- Knižní CSS je namespaced pod collection root a nesmí resetovat cizí route.
- Cyklus engine nemá UI importy; UI používá fasádu. Content registry má referenční validátor.
- PWA runtime cache rules jsou testovaný kontrakt, update strategy je explicitní produktové rozhodnutí.
- Browser testy drží kritické toky, unit testy čistou logiku, screenshoty pouze stabilní vizuální kontrakty.
`);

await write('20-command-results.txt', `
SYNTHOMA FORENSIC AUDIT COMMAND RESULTS
Audit started: 2026-07-22 10:10 CEST
Branch: refactor/mnem-entitlement-core
HEAD: 3ce9615e10cbe96e849537141e665fd5da6e4216
Initial git status: clean
Final source status: application source unchanged; only audit/ is untracked

git inventory
PASS - 1009 tracked, 0 pre-existing untracked, 45459 ignored
PASS - origin/HEAD resolves to main
HOLD - Vercel production branch/deployment not locally discoverable

content
PASS - npm run content:generate: 0 files updated
PASS - npm run content:validate: 131 entries, 41 chapters
PASS - npm run dialogs:audit: 6770 dialogs, 39 speakers, 0 unknown classes

static checks
PASS - npm run lint: exit 0
WARN - BooksClient.tsx useEffect missing bgVideoRef dependency
WARN - GameShell.tsx useEffect missing state dependency
WARN - next lint is deprecated for Next 16 migration
PASS - npm run typecheck
FAIL (advisory) - one-off noUnusedLocals/noUnusedParameters found cleanup candidates; not a configured baseline
PASS - npx prisma validate
PASS - npm run pwa:audit: worker 28424 B, 24 precache, 5 runtime caches, 6 icons

tests
PASS - full Jest: 118 passed suites, 1 skipped; 790 passed, 21 skipped, 811 total; 162.452 s
PASS - coverage run
COVERAGE - statements ${coverage?.total.statements.pct ?? 'n/a'}%; branches ${coverage?.total.branches.pct ?? 'n/a'}%; functions ${coverage?.total.functions.pct ?? 'n/a'}%; lines ${coverage?.total.lines.pct ?? 'n/a'}%
SKIP - PostgreSQL integration when no explicit test connection string
SKIP - heavy Cyklus simulation without RUN_SLOW_SIM=1

build
PASS - npm run build; Next 15.5.19; 265 static pages; approximately 29.6 s
PASS - content generation produced no changes
PASS - production first-load highlights: /archive ~380 KB, /cyklus ~397 KB, /cyklus/void ~344 KB, shared ~103 KB
PASS - middleware ~72.3 KB

local production runtime on http://localhost:3210
PASS - primary public pages and 41/41 canonical chapter pages responded
PASS - free API 200; locked API 403; unavailable API 409; unknown chapter 404
PASS - legacy reader redirects 308 to canonical chapter
PASS - private profile/admin signed-out 401
FAIL - /api/whispers 500; Prisma whisper.findMany; EACCES; empty response
WARN - Auth.js UntrustedHost referenced localhost:3000 because audit server used 3210
PASS - internal crawl checked 500 URLs, discovered 857 links, found 0 broken

security/dependencies
HOLD - npm audit could not access registry; escalation rejected by environment usage limit
WARN - public AI rate limiter stores state in a process-local Map
WARN - CSP permits unsafe-inline scripts/styles and selected external script CDNs
PASS - private/service-worker cache exclusions verified statically

browser/production
HOLD - browser policy rejected access to https://www.synthoma.cz
NOT RUN - computed typography, visual screenshots, console/hydration/network, PWA install/update/offline, authenticated owned chapter
No alternate browser or policy workaround was attempted.

extended route sweep
HOLD - a second all-route production-server sweep was stopped by the environment approval usage limit before requests ran
PASS - no listener remained on port 3210 after the rejected attempt
`);

const expandedRouteRows = await Promise.all(routeRows.map(async (item) => {
  const route = item.route || item.Route;
  const kind = item.kind || item.Type;
  const source = item.source || item.Source;
  const http = item.liveStatus || item.HTTP || (route === '/chapter/[id]' ? '200 (41/41 canonical chapter samples)' : 'not sampled');
  let sourceText = '';
  try { sourceText = await fs.readFile(path.join(root, source), 'utf8'); } catch {}
  const metadata = /generateMetadata|export\s+const\s+metadata|opengraph-image|sitemap|robots|manifest/i.test(sourceText + source) ? 'present/static evidence' : 'not statically declared or inherited';
  const authContract = item.auth || item.AuthContract || 'unknown';
  const anonymous = http !== 'not sampled' ? (/^401|^403/.test(http) && /guard|session|admin/.test(authContract) ? 'PASS: blocked as expected' : 'HTTP sampled') : 'not sampled';
  return {
    Route: route,
    Type: kind,
    HTTP: http,
    SSR: kind === 'page' ? 'App Router server output; hydration separate' : 'n/a route handler',
    Hydration: 'HOLD: browser unavailable',
    Anonymous: anonymous,
    Authenticated: 'HOLD: no account/session used',
    Mobile: 'HOLD: no browser viewport run',
    Metadata: metadata,
    Console: 'HOLD: no browser console',
    Network: http !== 'not sampled' ? 'server HTTP sampled' : 'not sampled',
    Notes: item.notes || item.Notes || '',
    Source: source,
    Methods: item.methods || item.Methods || '',
    AuthContract: authContract,
  };
}));
const routeHeaders = ['Route', 'Type', 'HTTP', 'SSR', 'Hydration', 'Anonymous', 'Authenticated', 'Mobile', 'Metadata', 'Console', 'Network', 'Notes', 'Source', 'Methods', 'AuthContract'];
await fs.writeFile(path.join(out, '09-route-matrix.csv'), csv(routeHeaders, expandedRouteRows), 'utf8');

await fs.mkdir(path.join(out, 'screenshots'), { recursive: true });
await write('screenshots/README.md', `
# Screenshot audit HOLD

Požadovaná produkční screenshot matice nebyla pořízena. Browser nástroj odmítl přístup k https://www.synthoma.cz z důvodu bezpečnostní politiky tohoto tasku. Omezení nebylo obcházeno jiným browserem ani raw CDP. V samostatném povoleném QA kroku je potřeba doplnit 12 rout × 4 viewporty a navázat výsledky na reporty 11 a 12.
`);

console.log(JSON.stringify({ out, categoryStats, cssTotals, coverage: coverage?.total ?? null }, null, 2));
