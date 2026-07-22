# Cyklus

## Referenční integrita

- 349 unikátních karet, 349 unikátních ID.
- missing packId/role/tone/choices: 0.
- 66 karet s poster art, 66 WebP souborů, 0 chybějících a 0 osiřelých runtime art souborů.
- Role: resolution 33, entry 142, object 49, escalation 41, echo 29, temptation 25, twist 15, bill 15.
- Tóny: tragic 289, horror 32, absurd 25, tender 56, comic 35, romantic 14, erotic_symbolic 12, brutal 11. Součet přesahuje počet karet, protože karta může mít více tónů.
- Cyklus test baseline je součástí 790 zelených testů; heavy simulation je správně skipnutá bez RUN_SLOW_SIM=1.

## Struktura

Engine facade funguje, ale cyklusProgression.ts má 2 112 řádků, CyklusClient.tsx 2 059, followup.cards.ts 1 609 a cyklusEngine.ts 947. To jsou kandidáti k budoucímu rozdělení podle odpovědnosti, nikoli aktuální mrtvý kód.

Historická složka synthoma_cyklus_cards_patch_v17 obsahuje byte-identické kopie nejméně osmi aktivních modulů. Statický import graph ji nepoužívá. Kategorie C/B: potvrdit, zda jde o jedinou zálohu zdrojových návrhů; pak odstranit jako samostatný cleanup.

## Storage a migrace

Existují dvě pojmenované storage vrstvy (src/game/cyklus/cyklusStorage.ts a src/components/cyklus/cyklusStorage.ts). Druhá nemá statický inbound import a je silný kandidát k ověření duplicity/legacy. Staré save migrace a anonymní/server sync mají testy, ale reálný browser refresh a přihlášený merge nebyly v tomto auditu spuštěny.

## Výkon a UX

/cyklus má build first-load přibližně 397 KB a /cyklus/void 344 KB. 66 optimalizovaných WebP je aktivních, ale 67 velkých PNG masterů zvyšuje repository/deploy asset footprint; přesun masterů mimo public je možný až po vyjasnění generátoru a deployment potřeb.
