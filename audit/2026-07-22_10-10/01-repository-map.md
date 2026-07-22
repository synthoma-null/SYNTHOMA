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
