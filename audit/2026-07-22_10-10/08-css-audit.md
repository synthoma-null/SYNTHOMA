# CSS audit

## Statistika

- Tracked CSS souborů: 64
- Celková velikost: 1.3 MiB
- Parse řádků: 44 694
- Pravidel: 7 584
- Deklarací: 27 905
- !important: 404
- Inline style výskytů v TS/TSX: 73
- @keyframes: 286
- Názvů keyframes definovaných ve více souborech: 13
- Přímých zápisů barev: 5 599
- Přímých font-size deklarací mimo var(): 1 208
- Statických font-size v px pod 13 px: 17
- CSS variables: 361 definovaných / 371 použitých
- Hrubý počet opakovaných selectorů: 1 583
- Hrubý počet selector/property konfliktů: 2 146
- Staticky neodkázané class kandidáty: 1 300

Počty duplicit zahrnují media queries, themes, state varianty a keyframe kroky. Nejsou seznamem bezpečného mazání.

## Největší vrstvy

- apps/web/public/books/SYNTHOMA-KONEC_PODPORY/konec-podpory.css: 452 829 B, 1 781 rules, 60 !important, 142 keyframes
- apps/web/src/styles/components.css: 165 909 B, 1 062 rules, 114 !important, 40 keyframes
- apps/web/src/styles/cyklus/legacy.css: 120 655 B, 882 rules, 4 !important, 20 keyframes
- apps/web/src/styles/game.css: 93 912 B, 738 rules, 7 !important, 8 keyframes
- apps/web/src/styles/reader.css: 39 896 B, 228 rules, 76 !important, 4 keyframes
- apps/web/src/styles/library-archive.css: 30 251 B, 203 rules, 0 !important, 0 keyframes
- apps/web/synthoma_cyklus_cards_patch_v17/cyklus-card-scene.css: 29 850 B, 206 rules, 2 !important, 0 keyframes
- apps/web/src/styles/profile.css: 26 251 B, 216 rules, 0 !important, 1 keyframes
- apps/web/src/styles/cyklus/void.css: 22 465 B, 138 rules, 10 !important, 0 keyframes
- apps/web/src/styles/control-panel-os.css: 21 766 B, 136 rules, 3 !important, 0 keyframes
- apps/web/src/styles/effects.css: 20 856 B, 132 rules, 22 !important, 22 keyframes
- apps/web/src/styles/cyklus/card.css: 19 932 B, 106 rules, 0 !important, 1 keyframes

## Nálezy

1. **P2** | Dopad: globální regresní riziko | Pracnost: vyšší | Riziko změny: vyšší | Jistota: vysoká | Pořadí: po stabilizaci runtime KONEC PODPORY CSS má 452.8 KB a 142 keyframes; jednotlivé kapitoly sdílejí obří stylesheet. Namespacing existuje, ale údržba je obtížná.
2. **P2** | Dopad: komponentní konzistence | Pracnost: střední | Riziko změny: střední | Jistota: vysoká | Pořadí: design token fáze components.css má 114 !important a kombinuje utility, reader, glitch i starší globální chování.
3. **P2** | Dopad: Cyklus | Pracnost: střední | Riziko změny: střední | Jistota: vysoká | Pořadí: až po browser QA src/styles/cyklus/legacy.css má 120.7 KB. Mazat pouze selektory s runtime coverage, ne podle textového skenu.
4. **P2** | Dopad: zdroj pravdy | Pracnost: malá | Riziko změny: střední | Jistota: vysoká | Pořadí: časně public/synth-gate.css a src/styles/synth-gate.css jsou byte-identické, ale mají odlišný runtime kontrakt (veřejná URL vs import). Dokumentovat ownera nebo generovat public kopii.
5. **P3** | Dopad: čitelnost | Pracnost: střední | Riziko změny: nízké | Jistota: střední | Pořadí: po computed audit auth UI a některé reader controls používají .62–.8rem. Bez computed browser testu nelze určit reálné pixely po user scale.
6. Inline styly jsou z velké části dynamické CSS variables, OG image layout a progress hodnoty. DebugPanel obsahuje statické inline bloky vhodné k pozdějšímu přesunu.

## Cílové vlastnictví

- core/tokens.css: barvy, typografie, spacing, z-index, motion, safe-area.
- shell.css: společný OS shell a navigace.
- reader/base.css + reader/themes.css: společné reader kontrakty.
- books/null.css a books/konec-podpory.css: pouze namespaced výrazové vrstvy.
- archive.css, cyklus/*.css, pwa.css: doménové vrstvy bez globálních resetů.
- generated/public CSS kopie musí mít banner s generátorem a nesmí se ručně editovat.
