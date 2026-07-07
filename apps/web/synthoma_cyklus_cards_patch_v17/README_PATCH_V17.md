# SYNTHOMA CYKLUS – Patch v17

## Cíl

Patch v17 napojuje `CyklusVoidHub` do reálné Next/App Router vrstvy.

Po v16 existoval hub jako komponenta. V17 přidává:

- `CyklusVoidHubClient.tsx` – client wrapper, který načítá `progression` a aktuální run z localStorage/server sync vrstvy.
- `app/cyklus/void/page.tsx` – ukázkovou App Router stránku.
- CSS pro stavové hlášky routy a načítání Prázdnoty.

## Nové soubory

```txt
CyklusVoidHubClient.tsx
app/cyklus/void/page.tsx
README_PATCH_V17.md
VOID_ROUTE_AUDIT_V17.md
```

## Co client wrapper dělá

`CyklusVoidHubClient`:

- načte `loadSubjectProgression()`;
- načte `loadCyklusRun()`;
- volitelně stáhne serverový stav přes `loadServerCyklusRun()`;
- napojí callbacky pro `CyklusVoidHub`:
  - `onStartRun`,
  - `onUpgradeRoom`,
  - `onCraftRecipe`,
  - `onEquipLoadout`,
  - `onUnequipLoadout`,
  - `onRefresh`;
- po každé akci obnoví lokální stav;
- po progression akci zavolá `serverSaveProgression()`.

## Doporučené umístění

Doporučená struktura v projektu:

```txt
src/components/cyklus/CyklusVoidHub.tsx
src/components/cyklus/CyklusVoidHubClient.tsx
src/components/cyklus/CyklusPocketPanel.tsx
src/components/cyklus/CyklusProgressionDashboard.tsx
src/components/cyklus/cyklusProgression.ts
src/components/cyklus/cyklusStorage.ts
src/components/cyklus/cyklusEngine.ts
src/app/cyklus/void/page.tsx
```

Pokud používáš jinou složku, uprav import v `page.tsx`:

```ts
import { CyklusVoidHubClient } from '@/components/cyklus/CyklusVoidHubClient';
```

Ano, aliasy. Moderní frontend miluje drobná místa, kde může člověk ztratit třicet minut života.

## CSS

`cyklus-card-scene.css` je globální CSS. V Next App Routeru ho nejbezpečněji importuj jednou v `app/layout.tsx` nebo přelej do hlavního globálního CSS.

```ts
import '@/components/cyklus/cyklus-card-scene.css';
```

Neimportuj globální CSS náhodně v každé komponentě, pokud nechceš, aby Next začal kázat o pravidlech jako úředník Formulářovny.

## Start run chování

`onStartRun`:

- pokud už běží run, přesměruje na `playHref`;
- pokud neběží, vytvoří nový přes `createCyklusRun(false)`, uloží ho přes `saveCyklusRun()` a přesměruje na `/cyklus`.

`playHref` můžeš změnit:

```tsx
<CyklusVoidHubClient playHref="/cyklus/play" />
```

## Stav po patchi

```txt
Nový client wrapper: OK
Ukázková App Router stránka: OK
Lokální progression akce: napojené
Run start: napojený
Server progression sync: volitelný a odolný proti selhání
TSX strukturální kontrola: OK
```
