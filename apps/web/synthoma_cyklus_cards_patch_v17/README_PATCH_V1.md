# SYNTHOMA CYKLUS cards patch v1

Obsah:

- `cyklusTypes.ts` rozšiřuje `SwipeCard` o `sceneHtml?: string` a `sceneFx?: string[]`.
- `cyklusCards.ts` upravuje prvních 21 karet: plain `scene` zůstává jako fallback, bohatší HTML je v `sceneHtml`.
- `CyklusCardScene.tsx` je malá React komponenta pro vykreslení rich scény.
- `cyklus-card-scene.css` je jemná obalová CSS vrstva, používá hlavně existující SYNTHOMA efekty.

Doporučená integrace:

1. Nahraď původní `cyklusTypes.ts` a `cyklusCards.ts` těmito verzemi.
2. V komponentě karty místo prostého textu použij `<CyklusCardScene card={card} />`.
3. Načti `cyklus-card-scene.css` vedle existujících efektů.

Poznámka: `sceneHtml` je statický interní obsah. Nepouštěj do něj uživatelský vstup bez sanitizace. XSS není glitch-noir, jen trapná díra v plotě.
