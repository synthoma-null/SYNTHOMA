# VOID ROUTE AUDIT v17

## Shrnutí

V17 řeší praktické napojení Prázdnoty do Next/App Routeru.

V16 vytvořila `CyklusVoidHub`, ale komponenta byla pořád jen samostatný panel. V17 přidává client wrapper, který drží stav a napojuje akce.

## Datový tok

```txt
page.tsx
  ↓
CyklusVoidHubClient
  ↓
loadSubjectProgression / loadCyklusRun / loadServerCyklusRun
  ↓
CyklusVoidHub
  ↓
callback akce
  ↓
cyklusProgression mutace / createCyklusRun / saveCyklusRun
  ↓
refresh lokálního UI + volitelný serverSaveProgression
```

## Akce

### Start běhu

- Aktivní run → přesměrování na `playHref`.
- Žádný aktivní run → `createCyklusRun(false)` + `saveCyklusRun()`.

### Místnosti

- `upgradeVoidRoom(roomId)`

### Crafting

- `craftRecipe(recipeId)`

### Loadout

- upgrade → `equipUpgrade` / `unequipUpgrade`
- artifact → `equipArtifact` / `unequipArtifact`
- protocol → `equipProtocol` / `unequipProtocol`
- scar → `setActiveScar(id)` / `setActiveScar(undefined)`

## Záměrné omezení

Wrapper zatím neřeší nákup upgrade/protocol přímo z dashboardu, protože `CyklusVoidHub` ve v16 vystavuje jen loadout, crafting a rooms akce.

Další krok může být `CyklusProgressionShop.tsx`, kde se explicitně nakupují upgrady a protokoly. Jinak by se loadout snažil řešit ekonomiku, což je přesně ten druh UI, které začne jako panel a skončí jako daňový portál pro duši.

## Rizika integrace

1. Import path v `page.tsx` může být potřeba upravit podle projektu.
2. Globální CSS importuj v `app/layout.tsx`, ne nutně přímo v routě.
3. Pokud `/api/me/cyklus` není aktivní, wrapper pořád funguje lokálně přes localStorage.
4. Pokud chceš potvrzování destruktivních akcí, přidej ho v client wrapperu, ne do čistého hubu.

## Verdikt

Prázdnota má routu. Kapsa má panel. Crafting má akce. Run se dá spustit.

To znamená, že SYNTHOMA už se netváří jen jako literární systém. Začíná se tvářit jako aplikace, což je nebezpečně blízko odpovědnosti.
