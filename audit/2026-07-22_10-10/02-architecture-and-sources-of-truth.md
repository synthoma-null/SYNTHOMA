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
