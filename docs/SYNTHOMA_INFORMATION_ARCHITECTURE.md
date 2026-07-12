# SYNTHOMA Information Architecture

## System model

SYNTHOMA OS is one world with distinct operational sectors, not a set of product cards.

```text
INTRO / BOOT
    -> HOME / CENTRAL NODE
       -> LIBRARY / available authored memory
          -> CHAPTER / canonical metadata route
             -> READER / active literary session
       -> ARCHIVE / subject memory and recovered records
       -> CYKLUS / active diagnostic run
          -> VOID / inter-run checkpoint
       -> SUBJECT PROFILE / identity, psyche, progress and access

GLOBAL CHANNELS
    theme + text scale + reduced effects + audio + identity
```

## Sector responsibilities

| Sector | Primary job | Must not become |
|---|---|---|
| Intro | Brief system initialization and first recognition of the subject | A recurring marketing landing page or mandatory long animation |
| Home | Central node, current state and one next action | A generic dashboard grid |
| Library | Catalogue, availability and reading continuation | A duplicate Archive |
| Reader | Focused literary content and chapter progression | A control-heavy dashboard |
| Archive | Subject memory: completed reading, fragments, records and findings | A second book catalogue |
| Cyklus | Active psychological diagnostic run | A generic site section with global navigation inside gameplay |
| Void | Inter-run checkpoint and progression decision | Game settings |
| Subject Profile | Identity, psyche, reading/game progress and account access | A second settings panel |
| Settings | Presentation, theme, accessibility and effects | Profile data or progression |
| Audio | One persistent playback channel | Route-local players |

## Navigation hierarchy

Primary desktop sectors: Home, Library, Archive, Cyklus. The command header also exposes Identity, Settings and Audio as global channels rather than destination cards.

Mobile bottom navigation contains Home, Library, Archive and Cyklus only on general site routes. Reader uses a quiet shell. Active Cyklus gameplay keeps its specialized header and game bottom navigation.

## Home next-action precedence

1. A valid saved reading path: `POKRAČOVAT VE ČTENÍ` -> canonical chapter URL when resolvable.
2. An active Cyklus run with no reading resume: `POKRAČOVAT V CYKLU` -> `/cyklus`.
3. No saved activity: `VSTOUPIT DO SYNTHOMY` -> `/books`.

This precedence uses real local state only. Authentication may enrich subject status but must not manufacture progress.

## Route relationship rules

- `/chapter/:id` remains the canonical, indexable chapter URL and redirects to `/reader`.
- `/reader` owns active reading state; Home only reads the established resume contract.
- `/archive` may display reading and Cyklus-derived records, but labels their provenance.
- `/profile` remains an auth-aware entry into the global subject dialog until a dedicated route is justified.
- `/landing-intro` is directly revisit-able, but Home redirects there only when the versioned intro key is absent.
- Returning from Reader, Cyklus or Void never forces the intro again for the same version.

## Shell variants

| Variant | Routes | Visible structure |
|---|---|---|
| Standard | Home, Library, Archive, Autor, auth, legal, profile entry | Command header plus mobile sector navigation |
| Quiet | Reader and chapter transition | Compact command header; reading content remains primary |
| Game | Active `/cyklus` | Existing Cyklus game header and bottom navigation, shared global panels |
| Boot | `/landing-intro` | Shell hidden during the short sequence; skip remains available |
| Utility | Admin and multiplayer game | Shared tokens, but route-specific operational navigation |

## Ownership map

- Global navigation: `SynthomaShell` and `SynthomaCommandHeader`.
- Mobile sector navigation: `SynthomaMobileNavigation`.
- Theme values: `src/styles/themes.css`; shared aliases in `synthoma-os/themes.css`.
- Text scale: `--font-size-multiplier`, persisted by existing settings.
- Media filter: shared `--synthoma-media-theme-filter` aliasing `--filter-primary`.
- Portal propagation: `SynthomaPortalRoot` context attributes.
- Audio element: `src/lib/audio.ts#getSharedAudio`.
- Audio UI: `SynthomaAudioPanel`.
- Profile dialog: `SubjectProfilePanelClient`.
- Cyklus game navigation: `CyklusGameHeader`.

## Phase boundaries

Phase 5.1 implements the shared contract, shell, intro and Home. Phase 5.2 applies it deeply to Library and Archive. Reader follows as a content-first migration without changing chapter HTML contracts.
