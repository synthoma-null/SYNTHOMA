# SYNTHOMA CYKLUS Cards Patch v9

Devátý průchod dokončuje scénové HTML pro celý aktuální `cyklusCards.ts`.

## Rozsah

Vylepšené karty **191 až 217**:

- `tutorial_04_preview` až `tutorial_15_ready`,
- `contract_tai` až `archive_collects`,
- `soft_bug_followup`,
- `archival_overload`, `power_overload`, `bond_overload`, `control_overload`,
- komba `mirror_shadow`, `token_stamp_combo`, `bug_pebble_nest`.

Tím má aktuální soubor **217 / 217 karet se `sceneHtml`**.

## Tutorial byl rozšířen tak, aby lépe vysvětloval

- že karta je scéna, ne dotazník,
- jak číst preview, hinty, šipky a riziko,
- že skrytý profil není diagnóza, ale stopa rozhodování,
- co dělají itemy, trigger karty a kapsa,
- rozdíl mezi itemem a imprintem,
- scheduled následky a návrat karet,
- sektory jako přeladění balíku,
- dvanáct voleb v cyklu a souhrn,
- restart jako perzistence, ne undo,
- Prázdnotu jako checkpoint/meta prostor,
- progression: reziduum, upgrady, jizvy, protokoly, artefakty a místnosti,
- packy jako dějové linky s rolemi,
- finální vstup do skutečného cyklu.

## Contracts a overloady

Smlouvy s T-AI, Glitchkou, Archivem a Sarkasmou jsou teď výrazněji napsané jako okamžitá výhoda s pozdější platbou. Overload karty lépe ukazují, že vysoký stat není automaticky výhra, ale nebezpečný přetlak.

## CSS

Přidán blok:

```css
/* Patch v9: full tutorial, contracts, combo overload endings */
```

Nové/rozšířené akcenty:

- tutorial hint/profile/progression/pack,
- contracts a contract debt,
- overload risk/reward,
- combo scény,
- rule rewrite,
- stamps/pebbles/story threads.

## Integrace

Zkopíruj do projektu:

- `cyklusCards.ts`
- `cyklusTypes.ts`
- `CyklusCardScene.tsx`
- `cyklus-card-scene.css`

## Ověření

Ověřeno příkazem:

```bash
tsc --noEmit --target ES2022 --module ESNext --moduleResolution node --skipLibCheck cyklusTypes.ts cyklusCards.ts
```

Výsledek: bez chyb.
