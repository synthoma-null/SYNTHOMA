# SYNTHOMA CYKLUS Cards Patch v10

Desátý průchod je první dramaturgicko-logická revize po dokončení `sceneHtml` pro všech 217 původních karet.

## Hlavní cíl

Nešlo už o další kosmetické rozšíření scén. Cíl byl zkontrolovat, zda kartový systém dává herní smysl:

- jestli existují karty pro všechny meta pooly odemčené po smrti,
- jestli odemykané následky opravdu mohou přijít do hry,
- jestli smrt kvůli extrémnímu statu zanechá hratelný dozvuk,
- jestli meta progression nepředstírá význam tam, kde ještě nebyl obsah,
- jestli nejsou rozbité odkazy na karty, itemy a imprinty.

## Přidáno 10 nových death-meta aftermath karet

Patch doplňuje karty pro chybějící pooly z `DEATH_UNLOCKS` v `cyklusFindings.ts`.

Nové karty:

1. `memory_flood_echo`  
   Pool: `memory_flood`  
   Téma: vysoká Paměť, přelití archivu, cizí věty nalepené na subjekt.

2. `acid_afterimage_card`  
   Pool: `acid_aftermath`  
   Téma: vysoká Energie, kyselinový dosvit, stopa po přepálení.

3. `overburn_memorial_card`  
   Pool: `overburn`  
   Téma: vysoká Energie, pomník vyhoření, výkon jako svatá chyba.

4. `overclock_memorial_card`  
   Pool: `overclock`  
   Téma: vysoká Energie, přetaktování, účet za produktivní paniku.

5. `empty_contact_list_card`  
   Pool: `empty_contacts`  
   Téma: nízká Vazba, prázdný seznam kontaktů, samota jako optimalizace.

6. `thread_under_door_card`  
   Pool: `thread_cards`  
   Téma: nízká Vazba, slabé spojení, nit pod dveřmi.

7. `merge_protocol_card`  
   Pool: `merge_cards`  
   Téma: vysoká Vazba, nebezpečné sloučení, blízkost bez hranic.

8. `statue_with_pulse_card`  
   Pool: `statue_cards`  
   Téma: vysoká Kontrola, dokonalý klid, socha s pulzem.

9. `audit_of_stillness_card`  
   Pool: `audit_cards`  
   Téma: vysoká Kontrola, audit ticha, byrokratizace stability.

10. `shattered_protocol_card`  
    Pool: `post_collapse`  
    Téma: nízká Kontrola, rozbité pravidlo, chaos jako materiál.

## Stav po patchi

- Původně: 217 / 217 karet se scénovým HTML.
- Nově: 227 / 227 karet se scénovým HTML.
- Všech 20 death-meta poolů z `DEATH_UNLOCKS` má alespoň jednu kartu s odpovídající `unlockedPool` condition.

## Audit provedený v patchi

Kontrolováno skriptem:

- počet karet,
- shoda objektového klíče s `id`,
- chybějící scheduled karty,
- chybějící item definice,
- chybějící imprint definice,
- death-meta pooly bez karty,
- počet `sceneHtml` bloků.

Výsledek auditu:

```txt
cards: 227
mismatch: 0
missing scheduled cards: 0
missing items: 0
missing imprints: 0
death pools without card: 0
sceneHtml: 227
```

## CSS

Přidán blok:

```css
/* Patch v10: missing death-meta pools, aftermath cards and unlock ecology */
```

Nové/rozšířené akcenty:

- `scene-afterimage`
- `scene-overburn`
- `scene-overclock`
- `scene-memorial`
- `scene-empty-contacts`
- `scene-thread`
- `scene-merge`
- `scene-statue`
- `scene-audit`
- `scene-post-collapse`

## Integrace

Zkopíruj do projektu:

- `cyklusCards.ts`
- `cyklusTypes.ts`
- `CyklusCardScene.tsx`
- `cyklus-card-scene.css`

`cyklusFindings.ts` není v tomto patchi měněn. Patch pouze doplňuje karty, které využívají pooly, které už `cyklusFindings.ts` umí odemykat.

## Ověření

Ověřeno příkazem:

```bash
tsc --noEmit --target ES2022 --module ESNext --moduleResolution node --skipLibCheck cyklusTypes.ts cyklusCards.ts
```

Výsledek: bez chyb.
