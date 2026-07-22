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

- Soubory včetně ignorovaných závislostí a build cache: 46 468 (1.75 GiB).
- Tracked: 1 009; výchozí untracked: 0; ignored: 45 459.
- Repo bez node_modules, ale včetně lokálních build výstupů: 904.3 MB; node_modules: 975.1 MB.
- Kategorie A: 45 459 souborů / 1.42 GiB reprodukovatelných lokálních výstupů.
- Kategorie B: 33 souborů / 6.0 MiB přesných duplicit vyžadujících určení vlastníka.
- Kategorie C: 200 souborů / 236.8 MiB k autorskému rozhodnutí; statická reference není důkaz nepoužití.
- Kategorie D: 775 souborů / 92.5 MiB zachovat.
- Přesné duplicity: 13 skupin / 33 souborů.
- Podezřelé near-duplicates: 25 párů.
- CSS: 64 tracked stylesheetů, 7 584 pravidel, 404 výskytů !important.
- Route crawl: 500 prověřených HTML URL, 857 objevených interních odkazů, 0 rozbitých v tomto vzorku.

## Prioritní nálezy

1. **P1** | Dopad: lokální API runtime | Pracnost: malá až střední | Riziko změny: nízké při úzké opravě | Jistota: vysoká pro lokální reprodukci | Pořadí: 1 /api/whispers vrací 500 při Prisma whisper.findMany s EACCES a neposkytne strukturovanou chybovou odpověď. Produkční stav není tímto testem prokázán.
2. **P1** | Dopad: ochrana veřejného AI API | Pracnost: střední | Riziko změny: střední | Jistota: vysoká | Pořadí: 2 rate limiter je process-local Map. V multi-instance/serverless hostingu neomezuje souhrnný provoz a nepřežije cold start.
3. **P1** | Dopad: release jistota | Pracnost: ruční QA | Riziko změny: žádné | Jistota: vysoká | Pořadí: 3 vizuální, PWA a produkční runtime matice zůstala HOLD kvůli blokovanému browser přístupu.
4. **P2** | Dopad: obsahový build | Pracnost: střední | Riziko změny: střední | Jistota: vysoká | Pořadí: 4 README označuje public/books/manifest.json za zdroj pravdy, ale build ho generuje ze src/content/catalog.ts. Ruční editace může být přepsána.
5. **P2** | Dopad: údržba a regresní riziko | Pracnost: vyšší | Riziko změny: vyšší | Jistota: vysoká | Pořadí: 5 64 CSS souborů, 404 !important a jeden knižní stylesheet o 452.8 KB zvyšují riziko kolizí; automatické počty duplicit obsahují i legitimní media/theme/keyframe varianty.

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
