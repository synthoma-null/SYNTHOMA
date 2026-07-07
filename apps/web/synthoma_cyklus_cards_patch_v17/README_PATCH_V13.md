# SYNTHOMA CYKLUS – PATCH V13

## Zaměření

Patch v13 rozšiřuje živost inventáře. Předměty už nejsou jen pasivní položky s trigger kartami, ale malé rezonanční entity: mají vztah k poolům, sektorům, statům, entitám a tématům. Kapsa tím dostává vlastní dramaturgický tlak.

## Upravené soubory

- `cyklusTypes.ts`
- `cyklusItems.ts`
- `cyklusItemMood.ts`
- `cyklusEngine.ts`
- `cyklus-card-scene.css`

## Hlavní změny

### 1. `CyklusItemResonance`

Do typů přibyl nový blok:

```ts
export interface CyklusItemResonance {
  poolIds?: string[];
  aliases?: string[];
  favoriteSectors?: SectorId[];
  stabilizes?: StatKey[];
  destabilizes?: StatKey[];
  entity?: EntityId;
}
```

`CyklusItem` má nově volitelné pole:

```ts
resonance?: CyklusItemResonance;
```

### 2. Rozšířené itemy

Všech 24 itemů v `cyklusItems.ts` má nyní:

- silnější lore description,
- doplněné tagy,
- `resonance.poolIds`,
- `resonance.aliases`,
- `favoriteSectors`,
- stabilizační / destabilizační staty,
- u relevantních itemů i vazbu na entitu.

Příklad:

```ts
rubber_seal: {
  resonance: {
    poolIds: ['sealarium_pool', 'seal_aftermath', 'glitchka_pool'],
    aliases: ['rubber_seal', 'seal', 'sealarium', 'crisis', 'save', 'bond', 'stamp'],
    favoriteSectors: ['memory_sandbox', 'glitchka_nest', 'form_office'],
    stabilizes: ['bond'],
    entity: 'glitchka',
  },
}
```

### 3. Chytřejší nálady předmětů

`cyklusItemMood.ts` teď obsahuje detailnější pravidla pro:

- `wrong_map`
- `blank_form`
- `childhood_spade`
- `warm_token`
- `named_token`
- `spent_token`
- `market_coin`
- `named_soft_bug`
- `returned_no`
- `calibration_receipt`

A rozšiřuje texty nálad tak, aby předměty působily jako malé živé artefakty, ne jako ikony v kapse.

### 4. Mood scoring v enginu

`cyklusEngine.ts` nově používá:

```ts
import { explainItemMoodScore } from './cyklusItemMood';
```

V `explainCardScore()` se přičítá jemný bonus podle toho, jestli aktuálně naladěné předměty rezonují s kartou:

- tagově,
- sektorově,
- entitně,
- přes pool condition,
- přes stabilizované / destabilizované staty.

Tím kapsa přitahuje odpovídající následky, ale nepřebíjí hlavní systém výběru karet.

### 5. Nové veřejné helpery

`cyklusItemMood.ts` nově exportuje:

```ts
getPocketMoodProfile(state)
explainItemMoodScore(state, card)
getItemMoodClassName(mood)
MOOD_CSS_CLASS
```

UI tak může zobrazit náladu kapsy bez vlastního věštění z vnitřností objektů. Lidstvo tomu říká architektura. Občas právem.

### 6. CSS hooky

`cyklus-card-scene.css` má nový blok:

```css
/* Patch v13: pocket ecology and item mood UI hooks */
```

Obsahuje třídy:

- `.item-mood-strip`
- `.item-mood-pill`
- `.item-mood-quiet`
- `.item-mood-warm`
- `.item-mood-watching`
- `.item-mood-ready`
- `.item-mood-angry`
- `.item-mood-asleep`
- `.item-mood-unstable`
- `.pocket-ambient-text`

## Ověření

```bash
tsc --noEmit --target ES2022 --module ESNext --moduleResolution node --skipLibCheck \
  cyklusTypes.ts cyklusCards.ts cyklusItems.ts cyklusItemMood.ts cyklusEngine.ts
```

Ověření proběhlo s dočasným lokálním `content.ts` shimem, protože v patch složce není celý projektový barrel export. V cílovém projektu má zůstat původní `content.ts`.

## Stav po patchi

```txt
cards: 230
sceneHtml: 230
items: 24
missing trigger cards: 0
missing item refs: 0
unknown item resonance pools: 0
TypeScript: OK
```
