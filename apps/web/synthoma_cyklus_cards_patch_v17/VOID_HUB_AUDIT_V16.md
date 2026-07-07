# VOID HUB AUDIT V16

## Co patch řeší

Patch v16 dává meta-progression jedno centrální UI místo: **CyklusVoidHub**. Do této chvíle existovala Kapsa a Dashboard jako samostatné panely. To bylo použitelné, ale pořád trochu jako kdyby někdo postavil ordinaci a nechal dveře ve sklepě.

## Přidaný model

`getVoidHubUiModel(progression, state)` agreguje:

- dashboard model,
- alerty,
- tab metadata,
- prioritu jednotlivých sekcí,
- pulz aktivního běhu.

Priorita tabů:

- `quiet` — nic urgentního,
- `normal` — běžný stav,
- `attention` — něco lze udělat,
- `danger` — kapsa nebo progression tlačí výrazněji.

## Přidaný shell

`CyklusVoidHub.tsx` je client komponenta s interním tab state. Neprovádí přímo herní akce, místo toho přijímá callbacky.

Důvody:

1. rodičovská stránka má mít kontrolu nad persistencí,
2. akce v progression vrstvě už existují,
3. komponenta zůstává testovatelná,
4. UI se netváří jako tajný správce localStorage.

## UX rozdělení

- **Přehled**: používá `CyklusProgressionDashboard`.
- **Kapsa**: používá `CyklusPocketPanel`.
- **Crafting**: zvýrazňuje craftovatelné recepty.
- **Místnosti**: řadí vylepšitelné místnosti nahoru.
- **Loadout**: ukazuje vybavené a dostupné upgrady/artefakty.
- **Protokoly**: odděluje protokoly a jizvy, aby se loadout neutopil v psychologickém bordelu.

## Vizuální vrstva

CSS doplňuje:

- `cyklus-void-hub`,
- `void-hub-hero`,
- `void-hub-tabs`,
- `void-hub-alerts`,
- `void-hub-action-button`,
- responsive grid pro mobil.

Použité barvy drží SYNTHOMA kód:

- cyan = nervy / bezpečí,
- magenta = trhlina / tlak,
- acid yellow = restart / alert.

## Známé záměrné omezení

Komponenta neobsahuje modaly, potvrzení akcí ani detailní editor loadoutu. To je správně. V16 je hub a pracovní plocha, ne celá radnice Prázdnoty s přepážkami a kávomatem.

Další vhodný krok je přidat drobnou `CyklusVoidHubPage.tsx` ukázkovou integraci pro Next/App Router, případně přímo napojit `onStartRun` na existující tok hry.
