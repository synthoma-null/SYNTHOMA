# UI AUDIT V15 – meta-progression a kapsa

## Co bylo cílem

Předchozí patch vytvořil mechaniku Kapesního oltáře, kapesních materiálů, pocket artefaktů a náladových itemů. V15 řeší prezentační vrstvu.

Hlavní problém: hráč musí pochopit meta-progression bez toho, aby četl zdroják. Což je překvapivě zdravý požadavek, i když weboví vývojáři na něj občas reagují, jako by jim někdo šlápl na framework.

## Přidaný model

Místo toho, aby komponenty přímo lezly do:

- `VOID_ROOMS`,
- `CRAFT_RECIPES`,
- `CRAFTED_ARTIFACTS`,
- `SUBJECT_UPGRADES`,
- `PROFILE_PROTOCOLS`,
- `CYKLUS_ITEMS`,
- `loadDiscovery()`,

vznikla mezivrstva v `cyklusProgression.ts`.

To je důležité, protože UI má renderovat stav, ne provádět rituál nad sedmi databázemi a doufat, že se z nich nevynoří formulář.

## Přehled helperů

### `getProgressionDashboardUiModel(progression, state)`

Hlavní dashboard model. Vrací:

- currencies,
- materials,
- rooms,
- availableRooms,
- crafts,
- availableCrafts,
- loadout,
- pocket,
- recommendedActions,
- summary.

### `getPocketProgressionUiModel(progression, state)`

Kapesní model. Vrací:

- stav Kapesního oltáře,
- známé itemy,
- nesené itemy,
- mood summary,
- ambient text,
- resonance tags,
- pocket recepty,
- vybavené pocket artefakty,
- doporučení.

### `getCraftRecipeUiRows(progression)`

U každého receptu řeší:

- status `hidden | locked | craftable | crafted`,
- cost rows,
- missing reasons,
- result title,
- pocket relevance.

Tohle je zásadní pro UX, protože hráč potřebuje vědět nejen „nejde to“, ale i proč. Ano, dokonce i hra může být zdvořilejší než úřad.

## Komponenty

### `CyklusPocketPanel.tsx`

Dvě varianty:

- plná,
- kompaktní.

Plná varianta je vhodná do Prázdnoty / progression obrazovky.
Kompaktní varianta je vhodná do bočního panelu během runu.

### `CyklusProgressionDashboard.tsx`

Zastřešuje:

- zdroje,
- kapsu,
- místnosti,
- crafting,
- loadout,
- další kroky.

Je to prezentační komponenta. Akce typu craft, equip, upgrade se mají doplnit v kontejneru podle architektury aplikace.

## UX poznámky

### Co je dobré

- Kapsa má vlastní panel, takže mood systém nebude pohřbený v tooltipu.
- Craft recepty mají missing reasons.
- Prázdnota dostává jasnější podobu meta-hubu.
- Loadout ukazuje sloty a vybavené položky.
- Doporučení jsou psaná v tónu SYNTHOMY, ne jako enterprise onboarding.

### Co ještě chybí

- Akční tlačítka: craft, equip, unequip, upgrade room.
- Modal/detail položky.
- Filtrování craft receptů.
- Přehled profilových protokolů a jizev jako samostatná záložka.
- Vizuální napojení na aktuální kartu v běhu.
- Animace pro změnu nálady itemu.

## Doporučené napojení

Před runem:

```tsx
<CyklusProgressionDashboard progression={progression} state={activeRun} />
```

Během runu v bočním panelu:

```tsx
<CyklusPocketPanel progression={progression} state={state} compact />
```

V Prázdnotě jako samostatná záložka:

```tsx
<CyklusPocketPanel progression={progression} state={null} />
```

## Rizika

1. Komponenty jsou zatím read-only.
2. CSS předpokládá tmavé SYNTHOMA pozadí.
3. Missing reasons používají interní ID u neobjevených itemů/imprintů. Později by bylo lepší překládat je přes registry nebo schovat úplně, pokud nechceš spoilerovat.
4. `CyklusProgressionDashboard` ukazuje jen prvních několik rooms/crafts, aby hráče nezavalil. Pro plnou obrazovku bude chtít filtrování.

## Závěr

V15 dává meta-progression zobrazitelný tvar. Neřeší ještě interaktivní správu, ale připravuje čistý most mezi mechanikou a React UI.

Kapsa už není jen systém. Teď je i komponenta. Další důkaz, že i utrpení jednou skončí v JSX.
