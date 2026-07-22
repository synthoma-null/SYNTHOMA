# Mrtvý kód, duplicity a dependencies

## Import graph

Nalezeny 2 cykly:

1. src/game/run/runTypes.ts ↔ src/game/encounter/encounterTypes.ts. Jde převážně o typovou hranici; doporučen je neutrální shared types modul.
2. scripts/validate-content.js ↔ scripts/generate-content.js. CLI funguje, ale sdílené utility mají být v třetím modulu bez zpětného importu.

## Statické orphan kandidáty

- apps/web/app/books/BooksClient.tsx (297 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/app/components/FirstVisitRedirectClient.tsx (21 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/app/game/solo/SoloClient.tsx (367 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/jest.config.js (24 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/jest.setup.js (51 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/next-env.d.ts (7 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/public/books/echo-ghost.js (295 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/public/books/glitch-toggle.js (11 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/public/books/mbti.js (182 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/public/sw.js (5 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/components/cyklus/CyklusMobileHud.tsx (87 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/components/cyklus/cyklusStorage.ts (256 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/components/profile/SettingsPanel.tsx (129 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/game/cyklus/cards/presentation.ts (2 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/game/cyklus/testUtils/cyklusSimRunner.ts (880 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/game/encounter/actionTexts.ts (78 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/game/storage.ts (48 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/hooks/useTypewriterReader.ts (177 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/lib/cinematicTitle.ts (22 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.
- apps/web/src/types/synthoma-window.d.ts (10 řádků): No static inbound import. Runtime lookup, public HTML, Next convention or external consumer may still apply.

Next konvenční soubory, test config, public skripty, worker a test utility nejsou mrtvé jen proto, že nemají běžný import. Silnější kandidáti k ručnímu ověření jsou CyklusMobileHud.tsx, src/components/cyklus/cyklusStorage.ts, SettingsPanel.tsx, actionTexts.ts, game/storage.ts, useTypewriterReader.ts a cinematicTitle.ts.

## Přesné kódové kopie

### DUP-0001
SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855; velikost jedné kopie: 0 B

- .devin/workflows/archive.md
- apps/web/prisma/migrations/20250101000000_baseline/migration.sql
- apps/web/public/assets/.gitkeep
- apps/web/public/assets/images/.gitkeep
- apps/web/public/assets/images/favicon.ico
- apps/web/public/audio/.gitkeep
- apps/web/public/books/.gitkeep
- apps/web/public/fonts/.gitkeep
- apps/web/public/video/.gitkeep

Doporučení: Hash shoduje prázdné soubory; nejde o obsahovou duplicitu. Prázdný favicon je samostatný problém.

### DUP-0002
SHA-256: fa04c30fafb1ce8acae9231fabcde70cfdd95b506e1ee8ee133855fccb9f207b; velikost jedné kopie: 1 349 849 B

- apps/web/public/assets/icon_mono.png
- apps/web/public/icons/source/synthoma-pwa-monochrome-master.png

Doporučení: Pravděpodobně záměrný vztah master → generovaný výstup; zdroj zachovat.

### DUP-0003
SHA-256: 90dcada5827acb57b797b0e967b5e9334e4a035f8d16e4640b73d1a58790730d; velikost jedné kopie: 14 177 B

- apps/web/public/synth-gate.css
- apps/web/src/styles/synth-gate.css

Doporučení: Stejný obsah má importovanou i veřejnou URL roli; nejde automaticky sloučit bez změny kontraktu.

### DUP-0004
SHA-256: 44e1ddca002f7adfd8297b6cd3acfd0622da3d56c38e13469bd8892d15fa4b7c; velikost jedné kopie: 1 564 019 B

- apps/web/public/assets/icon.png
- apps/web/public/icons/source/synthoma-pwa-master.png

Doporučení: Pravděpodobně záměrný vztah master → generovaný výstup; zdroj zachovat.

### DUP-0005
SHA-256: 9965356cacf07e9cbe5b7ae78ba5847817f7ac37bcfcf9e76e536e121f778193; velikost jedné kopie: 16 002 B

- apps/web/src/game/cyklus/cyklusItems.ts
- apps/web/synthoma_cyklus_cards_patch_v17/cyklusItems.ts

Doporučení: Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.

### DUP-0006
SHA-256: 0c68b4b9027a19a56b793dfef4bd9553407e35a7222e275d94781b23f9033e27; velikost jedné kopie: 19 658 B

- apps/web/src/game/cyklus/cyklusPoolCatalog.ts
- apps/web/synthoma_cyklus_cards_patch_v17/cyklusPoolCatalog.ts

Doporučení: Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.

### DUP-0007
SHA-256: 1540a3b65c521dd0cc5eb91e646813b68ef2f048edef390c88906b79007d3217; velikost jedné kopie: 20 678 B

- apps/web/src/game/cyklus/cyklusItemMood.ts
- apps/web/synthoma_cyklus_cards_patch_v17/cyklusItemMood.ts

Doporučení: Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.

### DUP-0008
SHA-256: c89504c9962cd8d94fd3ed1d0dfbe550fb303d48e6130b7c3cdaf68206ef3dab; velikost jedné kopie: 2 938 B

- apps/web/src/game/cyklus/cyklusImprints.ts
- apps/web/synthoma_cyklus_cards_patch_v17/cyklusImprints.ts

Doporučení: Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.

### DUP-0009
SHA-256: 5378796307535df3ec8d8b15a2e2dc5641419c3d3060cfe32238c0fa973f7aa3; velikost jedné kopie: 3 B

- .nvmrc
- apps/web/.nvmrc

Doporučení: Před smazáním určit kanonického vlastníka a změnit všechny reference.

### DUP-0010
SHA-256: 833442a81e83b53c1b79550f586f98251142f9efb02c8e47c6dee55771d447f5; velikost jedné kopie: 31 796 B

- apps/web/src/game/cyklus/cyklusFindings.ts
- apps/web/synthoma_cyklus_cards_patch_v17/cyklusFindings.ts

Doporučení: Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.

### DUP-0011
SHA-256: 4eb9c1c3a4bc484ed2c0966b982b276425c90d57a2208260fef70aa920bdddcf; velikost jedné kopie: 32 620 B

- apps/web/src/game/cyklus/cyklusStory.ts
- apps/web/synthoma_cyklus_cards_patch_v17/cyklusStory.ts

Doporučení: Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.

### DUP-0012
SHA-256: 5fb1259b2074c542d29bf344a6835702747ba9d06a4b83a6d67ad6e66188f974; velikost jedné kopie: 62 325 B

- apps/web/public/books/SYNTHOMA-NULL/0-2 [RUN].html
- apps/web/public/books/SYNTHOMA-NULL/0-2 [RUN]_en.html

Doporučení: Před smazáním určit kanonického vlastníka a změnit všechny reference.

### DUP-0013
SHA-256: b142e7eafeddabff5b503bf5ae873e805da6f2871d999ee34f0cd4c43e809a42; velikost jedné kopie: 7 288 B

- apps/web/src/game/cyklus/cyklusUnlocks.ts
- apps/web/synthoma_cyklus_cards_patch_v17/cyklusUnlocks.ts

Doporučení: Historická patch složka kopíruje aktivní Cyklus moduly; silný kandidát k archivaci/odstranění po potvrzení autora.

## Dependencies

- html2canvas, jspdf a jose nemají ve statickém import skenu žádnou referenci. Ověřit skripty, dynamické importy a export funkce; potom odebrat v samostatném commitu a spustit full suite/build.
- Dev dependencies nelze hodnotit podle importů: Jest, ESLint, TypeScript a Testing Library jsou používány konfigurací a test runnerem.
- npm ls --depth=0 hlásí extraneous @emnapi/runtime@1.5.0; pravděpodobně pozůstatek lokální instalace, ne položka package.json.
- npm audit nebylo možné dokončit: síť byla v sandboxu blokována a eskalace byla zamítnuta limitem. Stav známých advisories je HOLD.
- engines node >=20 je příliš široké a automaticky dovolí budoucí major; .nvmrc říká 20, lokální běh byl na Node 24. Doporučeno pinovat podporovaný LTS major a sjednotit kořen/app .nvmrc.
- .env.example dokumentuje jen DATABASE_URL a AUTH_SECRET; chybí DIRECT_URL, AI_STATE_TOKEN_SECRET, Stripe a další názvy bez hodnot. To je onboarding/config drift.

## noUnused audit

Přísný jednorázový TypeScript běh našel nepoužité lokální importy/parametry například v fragments API, game room, badges, DebugPanel, GlobalAudio, ReaderContent, CyklusClient, CyklusMobileHud, discovery, GameShell a ChapterSyncLog. Část hlášení v cyklusEngine je falešně pozitivní kvůli veřejným re-exportům fasády. Nedoporučuje se zapnout noUnused jako blokující pravidlo bez nejprve malé mechanické cleanup dávky.

## Velké moduly

- apps/web/src/game/cyklus/cyklusProgression.ts: 2 112 řádků
- apps/web/src/components/cyklus/CyklusClient.tsx: 2 059 řádků
- apps/web/src/game/cyklus/cards/followup.cards.ts: 1 609 řádků
- apps/web/src/content/booksManifest.ts: 1 152 řádků
- apps/web/src/game/cyklus/content/packs/pokecGlitchka.ts: 995 řádků
- apps/web/src/game/cyklus/content/packs/terapieSarkasma.ts: 986 řádků
- apps/web/src/game/cyklus/cyklusEngine.ts: 947 řádků
- apps/web/src/game/cyklus/testUtils/cyklusSimRunner.ts: 880 řádků
- apps/web/src/game/cyklus/content/packs/sandboxAbsurdPack.ts: 859 řádků
- apps/web/src/game/cyklus/cyklusStory.ts: 853 řádků
- apps/web/src/game/cyklus/content/packs/romanceResiduumPack.ts: 843 řádků
- apps/web/src/game/cyklus/cards/special.cards.ts: 799 řádků
- apps/web/src/game/cyklus/cards/system.cards.ts: 774 řádků
- apps/web/src/game/cyklus/content/packs/desireOrgiePack.ts: 750 řádků
- apps/web/src/game/encounter/encounterEngine.ts: 734 řádků
- apps/web/src/game/cyklus/content/packs/detektivkaSynthPack.ts: 731 řádků
- apps/web/src/game/cyklus/content/packs/brutalBlackboxPack.ts: 705 řádků
- apps/web/src/game/cyklus/cyklusFindings.ts: 703 řádků

Nejprve vyjasnit vlastnictví dat a test coverage; velikost sama o sobě není důvod k refaktoru.
