# SYNTHOMA Cyklus Cards Patch v3

Třetí průchod rozšiřuje **path** a **crisis** karty.

## Upravený rozsah

- `choose_archive` až `choose_form_office`
- `crisis_energy_depletion` až `crisis_control_tyranny`
- celkem nově doplněno 18 karet
- celkem v souboru je nyní 61 karet se `sceneHtml`

## Co se změnilo

- sektorové cesty už nejsou jen mechanické přechody, ale malé rituály vstupu,
- každý biom má silnější náladu, LOG a význam rozhodnutí,
- krizové karty mají vlastní vizuální rytmus a výraznější varovné CSS,
- přidány nové wrapper třídy pro `scene-path`, `scene-crisis`, `scene-residuum`, `scene-sarkasma`, nízké/vysoké stavy statů,
- mechanika efektů a výsledků rozhodnutí zůstala zachovaná, aby se nerozbil engine. Protože rozbít engine kvůli poetice je sice umělecky svůdné, ale technicky směšné.

## Integrace

Stejně jako u v2:

1. Nahraď `cyklusCards.ts`.
2. Zachovej `cyklusTypes.ts` s poli `sceneHtml?: string` a `sceneFx?: string[]`.
3. Použij nebo zkopíruj `CyklusCardScene.tsx`.
4. Importuj `cyklus-card-scene.css` do vrstvy, kde renderuješ kartu.

## Ověření

Kontrolováno přes TypeScript syntax check pro:

- `cyklusCards.ts`
- `cyklusTypes.ts`

