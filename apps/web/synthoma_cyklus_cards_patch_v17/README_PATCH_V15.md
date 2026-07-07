# SYNTHOMA CYKLUS – PATCH V15

## Zaměření

Patch V15 přidává UI/UX vrstvu pro meta-progression, Kapesní oltář, nálady itemů, craft recepty, místnosti v Prázdnotě a loadout.

Po V14 už kapsa měla dlouhodobou progression. V15 řeší, jak to ukázat hráči tak, aby pochopil:

- co má v kapse,
- jakou náladu mají předměty,
- co dělá Kapesní oltář,
- které recepty jsou craftovatelné,
- co chybí k odemčení,
- jaké místnosti v Prázdnotě lze vylepšit,
- co je vybavené v loadoutu,
- proč systém zase dělá účetnictví z bolesti.

## Nové soubory

- `CyklusPocketPanel.tsx`
- `CyklusProgressionDashboard.tsx`
- `UI_AUDIT_V15.md`
- `README_PATCH_V15.md`

## Upravené soubory

- `cyklusProgression.ts`
- `cyklus-card-scene.css`

## Nové UI model helpery v `cyklusProgression.ts`

Přibyly čisté modelové funkce, aby React komponenty nemusely samy řešit craft, missing reasons, costs, room statusy a loadout:

```ts
getCurrencyUiRows(progression)
getMaterialUiRows(progression)
getVoidRoomUiRows(progression)
getCraftRecipeUiRows(progression)
getLoadoutUiModel(progression)
getPocketProgressionUiModel(progression, state)
getProgressionDashboardUiModel(progression, state)
```

## Nové komponenty

### `CyklusPocketPanel`

Panel pro:

- Kapesní oltář,
- nálady nesených nebo objevených předmětů,
- pocket-relevant craft recepty,
- ambient text kapsy,
- systémová doporučení.

Použití:

```tsx
<CyklusPocketPanel progression={progression} state={state} />
```

Kompaktní varianta:

```tsx
<CyklusPocketPanel progression={progression} state={state} compact />
```

### `CyklusProgressionDashboard`

Širší dashboard pro:

- měny,
- materiály,
- Kapesní panel,
- místnosti v Prázdnotě,
- crafting,
- loadout,
- doporučené další kroky.

Použití:

```tsx
<CyklusProgressionDashboard progression={progression} state={state} />
```

## Nové CSS hooky

Přidány styly pro:

- `.cyklus-progression-dashboard`
- `.cyklus-pocket-panel`
- `.progression-card`
- `.progression-resource-grid`
- `.progression-section-grid`
- `.void-room-badge`
- `.craft-status-pill`
- `.resource-pill`
- `.pocket-item-list`
- `.craft-recipe-list`
- `.void-room-list`
- `.loadout-entry-grid`
- `.cyklus-suggestion-box`

Styly navazují na existující `item-mood-*` třídy z V13.

## Validace

Modelová TypeScript vrstva prošla kontrolou:

```bash
tsc --noEmit --target ES2022 --module ESNext --moduleResolution node --skipLibCheck \
  cyklusTypes.ts cyklusCards.ts cyklusItems.ts cyklusItemMood.ts cyklusProgression.ts \
  cyklusEngine.ts cyklusStory.ts cyklusFindings.ts cyklusUnlocks.ts content.ts
```

Komponenty byly ověřené s dočasným `react/jsx-runtime` shimem, protože sandbox nemá nainstalovaný React runtime. V Next projektu se budou kompilovat normálně.

## Stav po patchi

```txt
cards: 230
sceneHtml: 230
items: 24
progression UI helpers: 7
new UI components: 2
new CSS block: 1
TypeScript model layer: OK
TSX structural check with shim: OK
```

## Další smysluplný krok

Napojit komponenty do skutečné stránky/modalu Prázdnoty, například:

- `CyklusVoidPage.tsx`,
- meta-progression tab,
- loadout screen před runem,
- compact pocket panel vedle aktuální karty.

Pak by dávalo smysl udělat menší UX průchod přes názvy tlačítek, prázdné stavy a pořadí informací.
