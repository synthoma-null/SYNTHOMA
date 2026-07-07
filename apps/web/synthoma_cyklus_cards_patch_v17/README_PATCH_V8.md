# SYNTHOMA CYKLUS Cards Patch v8

Osmý průchod vylepšuje karty **161 až 190**:

- `memory_empty_label` až `drowned_in_memory_card`
- první část tutoriálu `tutorial_00_welcome` až `tutorial_03_balance`

## Co je nové

- 30 dalších karet dostalo `sceneHtml`.
- Celkem má `cyklusCards.ts` nyní 190 karet se scénovým HTML.
- Přidané `sceneFx` třídy pro:
  - nízkou/vysokou Paměť,
  - nízkou/vysokou Vazbu,
  - nízkou/vysokou Kontrolu,
  - stabilizační a vzácné karty,
  - post-death/meta aftermath,
  - první tutorial scény.
- Doplněn CSS blok `Patch v8: stat crises, stabilization aftermath and tutorial scenes`.

## Dramaturgická logika

Tenhle blok převádí čtyři staty na čtyři různé fyzické typy rozpadu:

- **Paměť nízko**: prázdné štítky, prázdné stránky, formátování identity.
- **Paměť vysoko**: povodeň významu, archivní tonutí, přetlak vzpomínek.
- **Vazba nízko**: poslední nit, odmítnuté hovory, izolace jako falešný klid.
- **Vazba vysoko**: rozpouštění hranic, dav hlasů, invaze pod maskou blízkosti.
- **Kontrola nízko**: rozpad rámce, chaos, zbytkový tvar po kolapsu.
- **Kontrola vysoko**: krystal, dokonalý pokoj, bezpečí bez života.

Tutoriál dostal stejné scénové HTML, aby nepůsobil jako cizí UI manuál nalepený na SYNTHOMU, protože to by byla civilizační porážka a ještě by měla tooltip.

## Integrace

Zkopíruj do projektu:

- `cyklusCards.ts`
- `cyklusTypes.ts`
- `CyklusCardScene.tsx`
- `cyklus-card-scene.css`

`cyklusTypes.ts` a `CyklusCardScene.tsx` jsou převzaté z předchozí verze patchů a zůstávají kompatibilní.

## Ověření

Ověřeno příkazem:

```bash
tsc --noEmit --target ES2022 --module ESNext --moduleResolution node --skipLibCheck cyklusTypes.ts cyklusCards.ts
```
