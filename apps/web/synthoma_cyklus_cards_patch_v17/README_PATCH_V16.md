# SYNTHOMA CYKLUS — PATCH V16

## Cíl

Patch v16 přidává skutečný **Prázdnota hub** pro meta-progression. Po v15 existovaly samostatné panely pro kapsu a dashboard, ale chybělo jim jedno místo, kde budou žít jako použitelná obrazovka. Protože komponenty bez místa v UI jsou jako artefakty bez ruky: hezké, smutné a trochu trapné.

## Nové soubory

- `CyklusVoidHub.tsx`
- `VOID_HUB_AUDIT_V16.md`

## Upravené soubory

- `cyklusProgression.ts`
- `cyklus-card-scene.css`

## Nový helper

```ts
getVoidHubUiModel(progression, state)
```

Vrací:

- souhrn Prázdnoty,
- pulz aktuálního běhu,
- taby a jejich prioritu,
- alerty,
- celý progression dashboard model.

## Nová komponenta

```tsx
<CyklusVoidHub progression={progression} state={state} actions={actions} />
```

Taby:

1. Přehled
2. Kapsa
3. Crafting
4. Místnosti
5. Loadout
6. Protokoly

## Akce

Komponenta sama nemutuje localStorage. Přijímá callbacky:

```ts
onStartRun
onUpgradeRoom
onCraftRecipe
onEquipLoadout
onUnequipLoadout
onRefresh
```

Důvod je prostý: UI nemá potají sahat do storage jako kapsář v neonové tramvaji. Rodičovská stránka si po akci sama načte aktuální progression a run state.

## Příklad napojení

```tsx
'use client';

import { useEffect, useState } from 'react';
import { CyklusVoidHub } from './CyklusVoidHub';
import {
  craftRecipe,
  equipArtifact,
  equipProtocol,
  equipUpgrade,
  loadSubjectProgression,
  setActiveScar,
  unequipArtifact,
  unequipProtocol,
  unequipUpgrade,
  upgradeVoidRoom,
  type SubjectProgression,
} from './cyklusProgression';
import { loadCyklusRun } from './cyklusStorage';
import type { CyklusRunState } from './cyklusTypes';

export function CyklusVoidHubPage() {
  const [progression, setProgression] = useState<SubjectProgression>(() => loadSubjectProgression());
  const [state, setState] = useState<CyklusRunState | null>(() => loadCyklusRun());

  const refresh = () => {
    setProgression(loadSubjectProgression());
    setState(loadCyklusRun());
  };

  return (
    <CyklusVoidHub
      progression={progression}
      state={state}
      actions={{
        onRefresh: refresh,
        onUpgradeRoom: (id) => { upgradeVoidRoom(id as never); refresh(); },
        onCraftRecipe: (id) => { craftRecipe(id); refresh(); },
        onEquipLoadout: ({ id, kind }) => {
          if (kind === 'upgrade') equipUpgrade(id);
          if (kind === 'artifact') equipArtifact(id);
          if (kind === 'protocol') equipProtocol(id);
          if (kind === 'scar') setActiveScar(id);
          refresh();
        },
        onUnequipLoadout: ({ id, kind }) => {
          if (kind === 'upgrade') unequipUpgrade(id);
          if (kind === 'artifact') unequipArtifact(id);
          if (kind === 'protocol') unequipProtocol(id);
          if (kind === 'scar') setActiveScar(undefined);
          refresh();
        },
      }}
    />
  );
}
```

Poznámka: `upgradeVoidRoom(id as never)` je jen kvůli tomu, že callback používá string a interní funkce čeká konkrétní `VoidRoomId`. V reálné stránce si můžeš typ callbacku zpřísnit podle vlastního routeru.

## Stav

- nový hub model: OK
- nová TSX komponenta: OK
- CSS doplněno: OK
- strukturální TSX kontrola s React shimem: OK
- TypeScript model layer: OK
