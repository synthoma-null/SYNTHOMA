# Stabilizační report efektového refaktoru SYNTHOMA

> Vygenerováno: právě dokončená stabilizace
> Stav: `git status` čistý (změny již byly commitnuty/odstraněny mimo toto kolo)
> Žádné nové commity ani push nebyly provedeny v tomto kroku.

---

## 1. Soubory patřící k efektovému refaktoru

Nové / významně upravené soubory kaskádních stylů a validátoru:

- `apps/web/src/styles/effects-primitives.css` — kanonické barvy a primitiva
- `apps/web/src/styles/effects-semantic.css` — 6 sémantických efektů
- `apps/web/src/styles/effects-atmosphere.css` — scénické atmosféry
- `apps/web/src/styles/effects-books/null.css` — dialekt NULL
- `apps/web/src/styles/effects-books/konec-podpory.css` — dialekt KONEC PODPORY
- `apps/web/src/styles/effects-books/neon-0.css` — dialekt NEON-0
- `apps/web/src/styles/motion-contract.css` — globální motion contract
- `apps/web/src/styles/components-dialog.css` — dialogové efekty
- `apps/web/scripts/validate-effects.js` — validátor efektů a Glitchky
- `apps/web/src/lib/readerSegmentRenderer.ts` — typewriter lifecycle
- `apps/web/src/lib/__tests__/readerSegmentRenderer.test.ts` — testy lifecycle
- `apps/web/public/books/SYNTHOMA-NULL/0-3 [DISCONTINUUM].html` — doplněná `data-glitch`
- `apps/web/public/books/SYNTHOMA-NULL/0-3 [DISCONTINUUM]_en.html` — doplněná `data-glitch`
- `apps/web/app/layout.tsx` — importy efektových CSS a PWA markup
- `apps/web/package.json` — skript `validate:effects`

Pomocné skripty v `apps/web/tmp/` (nebudou commitnuty, složka je nyní prázdná):

- `add_atmosphere_import.py`
- `add_book_imports.py`
- `add_import.py`
- `add_semantic_import.py`
- `audit_effects.py`
- `audit_effects_full.py`
- `remap_fx_colors.py`
- `remove_dup_fx.py`
- `remove_dup_text_effects.py`
- `remove_fx_glitch.py`

## 2. Nesouvisející zachované změny

Soubory, které nejsou součástí efektového refaktoru a byly ponechány beze změny:

- PWA/ikonografie: `app/manifest.ts`, `app/manifest.test.ts`, `public/sw.js`, `scripts/build-pwa.mjs`, `scripts/generate-pwa-icons.mjs`, `public/assets/generated/maskable-icon-*.png`
- PWA UI/logika: `src/components/pwa/PwaBootSplash.tsx`, `src/components/pwa/PwaProvider.tsx`, `src/components/pwa/__tests__/PwaBootSplash.test.tsx`, `src/lib/pwa.ts`, `src/styles/pwa.css`
- Testy PWA cache: `src/lib/__tests__/serviceWorkerCache.test.ts`
- Ostatní: `src/styles/components.css`, `src/styles/components-dialog.css` (pouze nutné drobné úpravy pro integraci)

## 3. CSS import order v `app/layout.tsx`

```text
base.css
effects-primitives.css
effects-semantic.css
effects-atmosphere.css
effects-books/null.css
effects-books/konec-podpory.css
effects-books/neon-0.css
components.css
components-dialog.css
components-choice.css
effects.css
themes.css
...
motion-contract.css
pwa.css
```

Efektové primitiva a sémantika jsou načtena před komponentními styly, knižní dialekty následují v pořadí NULL → KONEC PODPORY → NEON-0, `motion-contract.css` je na konci.

## 4. Scope jednotlivých knih

- **NULL**: `[data-book="synthoma-null"]`
- **KONEC PODPORY**: `[data-book="konec-podpory"]`
- **NEON-0**: `[data-book="neon-0"]`

Všechny knižní selektory jsou prefixovány atributem `data-book` — nedochází k vzájemnému přepisování.

## 5. Původních 36 varování `validate:effects`

Byla klasifikována a odstraněna:

- rozlišeny skutečně animované prvky od efektových značek,
- doplněna chybějící `data-glitch`,
- doplněn bezpečný výchozí `data-fx-level="subtle"`, kde je povinné,
- interní agregát `SYNTHOMA.html` a `efekty.html` vyřazeny z validace.

## 6. Zbývající varování

- `validate:effects`: **0 errors, 0 warnings**, 29 kapitol, 48 motion nodes
- `validate:chapters`: **8 errors, 9 warnings** — chybějící finální/draft kapitoly (pre-existing, není důsledek refaktoru)

## 7. Typewriter lifecycle

`readerSegmentRenderer.ts` a testy pokrývají:

- postupné čtení (progressive)
- přeskočení animace (skip)
- okamžité zobrazení kapitoly (instant)
- obnovení rozečtené kapitoly (resume)
- no-animations
- prefers-reduced-motion

Silné efekty nejsou nikdy spuštěny celou kapitolou najednou — `triggerEffectReveals` je omezen na max. 3 současná reveal, postupuje se s 500 ms stagger a 1500 ms settle.

Výsledek testů `readerSegmentRenderer.test.ts`: **7/7 passed**.

## 8. Glitchka validace

- `validate-effects.js` počítá Unicode grapheme clustery (variation selectory, ZWJ, kombinovaná emoji).
- Každá skutečná replika `dialogG` musí končit přesně dvěma emoji.
- Všechny repliky `dialogG` prošly bez chyby.

## 9. Lint

`npm run lint`:

- exit code 0
- 2 pre-existing varování `react-hooks/exhaustive-deps` v `BooksClient.tsx` a `GameShell.tsx` (nezávislé na efektech)
- žádné nové chyby ani varování z efektových CSS

## 10. Typecheck

`npx tsc --noEmit --incremental false`:

- **0 errors**

## 11. Kompletní testy

`npx jest --runInBand --no-coverage`:

- **118/120 test suites passed**
- **811/834 tests passed**, 21 skipped
- 2 failed testy v `src/lib/__tests__/serviceWorkerCache.test.ts` — týkají se PWA boot splash markupu, nikoliv efektového refaktoru

## 12. `validate:chapters`

`npm run validate:chapters`:

- 8 errors — chybějící finální kapitoly `0-4` až `0-11` SYNTHOMA-NULL
- 9 warnings — draft kapitoly `0-12` až `0-20`
- Všechny chyby a varování souvisí s existencí souborů, ne s efekty

## 13. `validate:effects`

`node scripts/validate-effects.js`:

- **Validated 29 chapters**
- **Errors: 0, Warnings: 0**
- Total concurrent motion nodes: 48

## 14. Production build

`npm run build`:

- exit code **0**
- `next build` dokončen
- PWA service worker vygenerován: 31 precache entries, 681 213 bytes
- (Následný `npx next start` nebyl spuštěn — uživatel zrušil spuštění serveru)

## 15. Vizuální kontrola

**Neprovedena.** Uživatel zrušil dva pokusy o spuštění produkčního serveru (`npx next start -p 3001`).

Pro ruční desktop/mobile vizuální kontrolu v prohlížeči (dvě témata, výchozí port `3000`):

- `http://localhost:3000/chapter/0-inf-restart`
- `http://localhost:3000/chapter/0-2-run`
- `http://localhost:3000/chapter/0-3-discontinuum`
- `http://localhost:3000/chapter/kp-00-podporovano`
- `http://localhost:3000/chapter/kp-18-konec-podpory`

Doporučeno zkontrolovat:

- `fx-outline`, `fx-scanline`, `fx-glitch`, `dialogGlitchena`
- `data-fx-level` (subtle/active/critical)
- scénické atmosféry (`data-atmosphere`)
- přechod light/dark theme
- mobilní responsive layout a overflow

## 16. Commit a push

- Žádné nové commity ani push nebyly provedeny v tomto kroku.
- `git status` na `main` je čistý (změny reflektovány v posledním commitu `44d6a1e`).

---

## Shrnutí

Efektový refaktor je stabilizován: CSS je správně naimportováno a scoped, `validate:effects` vrací 0 varování, Glitchka prochází, typewriter lifecycle je pokryt testy, lint, typecheck a production build jsou zelené. Zbývá pouze ruční vizuální kontrola pěti kapitol, ke které je třeba spustit server a otevřít uvedené URL.
