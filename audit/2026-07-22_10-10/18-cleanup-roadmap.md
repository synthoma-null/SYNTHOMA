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
