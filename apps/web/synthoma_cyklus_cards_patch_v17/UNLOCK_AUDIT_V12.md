# SYNTHOMA CYKLUS — UNLOCK / FINDINGS AUDIT V12

## Stav

```txt
cards: 230
sceneHtml: 230
findings: 60
known pools in catalog: 60
all referenced pools covered by catalog: yes
pools without alias/card match: 0
missing scheduled card refs: 0
missing item refs: 0
missing imprint refs: 0
TypeScript check: OK
```

## Co patch řeší

V11 už uměl navázat death aftermathy na story vrstvu. V12 uklízí účetnictví bolesti: pooly, unlocky a findingy.

Hlavní problém byl, že engine skóroval odemčené pooly jen podle přesného tagu `poolId` nebo podle `poolId.replace('_pool', '')`. To funguje pro jednoduché věci jako `archive_pool → archive`, ale selhává u složených poolů jako `form_office_pool`, `relationship_followups`, `token_market_pool` nebo `market_sells_no_pool`.

Výsledek před patchem: některé pooly byly odemknutelné, ale jejich vliv na výběr karet byl slabý nebo náhodný. Což je přesně ten typ tiché chyby, která se tváří jako designová volba, protože frontend má sebevědomí mokrého plakátu.

## Nový soubor

### `cyklusPoolCatalog.ts`

Přidává centrální katalog poolů:

- `CYKLUS_POOL_CATALOG`
- `getPoolInfo(poolId)`
- `getPoolAliases(poolId)`
- `cardMatchesUnlockedPool(card, poolId)`
- `getKnownPoolIds()`

Každý pool má:

- `id`
- `title`
- `family`
- `aliases`
- `description`

Engine už nemusí hádat, že `form_office_pool` souvisí s tagy `form` a `office`. Konečně. Malý krok pro kód, velký krok pro lidstvo, které si samo vynalezlo stringové peklo.

## Upravený engine

### `cyklusEngine.ts`

Změna ve scoringu:

```ts
if (state.unlockedPools.some((poolId) => cardMatchesUnlockedPool(card, poolId))) {
  score += 200;
  reasons.push('unlocked pool alias +200');
}
```

Dřív:

```ts
card.tags.includes(poolId) || card.tags.includes(poolId.replace('_pool', ''))
```

Nově se používá katalog aliasů. Tím se zlepší výběr karet pro složené pooly, entity pooly a aftermath pooly.

Současně byla odstraněna duplicitní deklarace:

```ts
const modifierScore = applyModifierScore(state, score, card);
const modifierScore = applyModifierScore(state, score, card);
```

Ano, byla tam dvakrát. Ne, poetický záměr to nebyl. Jen malý TypeScriptový poltergeist.

## Upravené unlocky

### `cyklusUnlocks.ts`

Přidány záložní odemykací cesty pro pooly, které už měly diegetický smysl, ale neměly dost robustní technickou logiku.

Nové unlocky:

```txt
form_office_pool_unlock_by_blank_form
relationship_followups_unlock_by_imprint
sarkasma_debt_pool_unlock_by_imprint
archive_scent_pool_unlock_by_imprint
memory_sandbox_pool_unlock_by_spade
token_market_pool_unlock_by_named_token
market_pool_unlock_by_coin
soft_bug_pool_unlock_by_named_bug
wrong_name_pool_unlock_by_sector_card
market_sells_no_pool_unlock_by_flag
memory_beast_pool_unlock_by_seen_entity
```

To znamená, že pool už nemusí čekat jen na jeden specifický flag. Pokud hráč drží relevantní item, imprint nebo prošel relevantní kartou, pool se umí otevřít také.

## Nové findingy

### `cyklusFindings.ts`

Přidáno 11 diagnostických findingů:

```txt
form_office_regular
unfinished_thread_keeper
sarkasma_accountant
token_namer
boundary_merchant
wrong_name_cartographer
soft_bug_keeper
beast_mark_survivor
archive_forbidden_reader
sealarium_regular
pool_archaeologist
```

Tyto findingy dávají hráči zpětnou vazbu za chování, které už hra mechanicky sledovala, ale nedostatečně pojmenovávala.

## Nové bridge karty

### `cyklusCards.ts`

Přidány 3 bridge karty pro pooly, které byly v meta logice, ale neměly vlastní fyzický projev v aktuálním decku:

```txt
blackbox_aftermath_bridge
desire_orgie_threshold
detective_cold_case_folder
```

Díky tomu platí:

```txt
pools without alias/card match: 0
```

Tohle je dobrá věc. Ne vzrušující jako boss fight, ale daleko užitečnější, což je přesně důvod, proč to hráči většinou neocení a vývojář pak pláče do changelogu.

## CSS

### `cyklus-card-scene.css`

Přidány styly pro:

```txt
scene-blackbox
scene-desire
scene-orgie
scene-boundary
scene-detective
scene-cold-case
```

## Poznámka k integraci

Přidej nový soubor:

```txt
cyklusPoolCatalog.ts
```

A nahraď/uprav:

```txt
cyklusEngine.ts
cyklusUnlocks.ts
cyklusFindings.ts
cyklusCards.ts
cyklus-card-scene.css
```

Ostatní přibalené soubory jsou kvůli návaznosti na předchozí patche.
