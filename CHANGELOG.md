# Changelog

Všechny významné změny v projektu SYNTHOMA budou dokumentovány v tomto souboru.

Formát je založený na [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
a projekt používá [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added (červen 2026 — Mnem Economy & Meta-game)
- 🧠 `UserRun` systém: `stability`, `memoryPressure`, `shadow`, `cycleNumber` — aktivní cyklus subjektu
- 🤝 `EntityRelation` model: vztahy k entitám (glitchka, sarkasma, tai, archive, shadow) s metrikami trust/suspicion/sync/protection
- 🏺 `UserArtifact` + 10 artefaktů v `booksManifest.ts` (černý klíč, mněmová čočka, glitch-safe-mode…)
- 🎯 `UserMission` + 8 misí v `booksManifest.ts` (first-trace, did-not-run, sarkasma-firewall…)
- � `Whisper` systém: šepoty subjektů s moderací, rezonancí a boostem
- 🌊 `WhisperFloat` komponenta — plovoucí vrstva šepotů v globálním layoutu
- � `RunDashboard` komponenta — 5 sekcí: AKTIVNÍ CYKLUS, PSYCHOMAPA, VZTAHY, ARTEFAKTY, MISE
- 📋 `ChapterSyncLog` komponenta — post-kapitolový overlay se změnami hodnot
- 🗂️ Záložka **CYKLUS** v `ProfileDashboard` s `RunDashboard`
- 🔒 Access control pro archive karty (`access.mode`: free/chapter/mnems/chapter_or_mnems)
- 🔗 API endpoint `/api/me/run` (GET full run data, PATCH update stats + checkAndActivateMissions)
- 🔗 API endpoint `/api/whispers` (GET/POST), `/api/whispers/[id]/resonate`, `/api/whispers/[id]/boost`
- 🔗 API endpoint `/api/admin/whispers` (GET pending, PATCH moderace)
- � `FRAGMENTS`, `COSMETICS`, `PROFILE_REPORTS`, `SUBJECT_ACHIEVEMENTS`, `ARTIFACTS`, `MISSIONS` v `booksManifest.ts`
- 🎭 `computeSubjectTitle` — 14+ titulů dle psyche profilu
- ⚙️ `checkAndActivateMissions` voláno po každé volbě i po dokončení kapitoly

### Changed (červen 2026)
- � `TypewriterReader`: volby nyní parsují `data-stability`, `data-pressure`, `data-shadow`, `data-entity-*` a posílají je do `/api/me/choices`
- 🔄 `/api/me/choices` rozšířen o `stabilityDelta`, `pressureDelta`, `shadowDelta`, `entityDelta` + volá `checkAndActivateMissions`
- 🔄 `app/layout.tsx`: přidán `<WhisperFloat />` globálně
- � `ReaderContent`: detekce dočtení při scroll ≥ 95% → uloží `completed: true` do DB, zobrazí `ChapterSyncLog`
- � `package.json`: build script změněn na `prisma generate && next build`
- � `MutationObserver` v TypewriterReader: přidán debounce + skip při aktivním typování (oprava sekaní na mobilu)
- 🔄 Auth stránka na mobilu: opravena při otevřené klávesnici (`overflow-y: auto`, `justify-content: flex-start`)

### Fixed (červen 2026 — Vercel build opravy)
- � `app/api/me/choices/route.ts`: odstraněn `import { Prisma }` (nekompatibilní s @prisma/client ^7.8.0), nahrazeno conditional spread
- � `app/api/books/route.ts`: explicitní typ pro `e` parametr v `.map()` callback
- 🐛 `app/api/whispers/route.ts`: přidán typ `PublicWhisper`, explicitně typovány všechny map callbacky
- 🐛 `app/reader/ReaderContent.tsx`: přidán `chapterMeta?.title` do `useEffect` dependency array
- � `prisma generate` přidáno před `next build` — opravuje `PrismaClient not exported` na Vercelu
- 🐛 `SYNTHOMAINFO.html`: `onclick` atributy nahrazeny `data-action="open-profile"` (React sanitizace)

### Fixed (Final Improvements - Dec 13, 2025)
- � Quick Links: Čtečka href nyní míří správně na `/reader` s example URL odděleně
- � Odstranění "pokud existuje" u `validate:chapters` - skript je implementovaný
- � CHANGELOG datum opraveno na 2025 (konzistence s audit reportem)
- � Sanitizace: přidán odkaz na konkrétní implementaci v TypewriterReader.tsx

### Verified (červen 2026)
- ✅ Build: Exit code 0 (prisma generate + next build)
- ✅ Prisma schema: UserRun, EntityRelation, UserArtifact, UserMission, Whisper, WhisperResonance, WhisperPurchase, WeeklyMemory, UserCosmeticUnlock, SubjectBadge, FragmentUnlock

---

## [1.1.0] - 2026-06-26

### Mnem Economy & Meta-game Release
- 🎉 Kompletní ekonomika mněmů — UserRun, PsycheStats, EntityRelation
- � Whisper systém s moderací a komunitní rezonancí
- 🏺 Artefakty a mise (10 + 8 položek)
- 📊 RunDashboard v profilu (záložka CYKLUS)
- 🔒 Archive access control dle kapitol a mněmů
- 🌐 Vercel build opravy (Prisma generate, TypeScript any typy)

---

## [1.0.0] - 2025-12-13

### Initial Release
- 🎉 Next.js 15 aplikace s App Router
- 📚 Interaktivní čtečka kapitol
- 💀 Cyberpunk design s glitch efekty
- 🎨 MBTI interaktivita
- 🎬 Landing page s video pozadím
- 📖 Knihovna kolekcí
- 🗂️ Archiv s interaktivními kartami
