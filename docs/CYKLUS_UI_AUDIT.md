# CYKLUS UI / DOM audit

Baseline: `3896788` (`cyklus-v3.10-rc1`)

Scope: `apps/web/src/components/cyklus`, `apps/web/src/styles/cyklus.css`, `/cyklus`, `/cyklus/void`.

## Current shape

The Cyklus stylesheet has 5,557 lines and several chronological style layers. The current DOM is split across eight focused components, while the large `CyklusClient.tsx` still owns the menu, active run, end report, reward, diagnostics, inventory/build/discovery panels, and most overlays.

### Main game

- `CyklusClient`: boot menu, run shell, header, card gesture container, outcome, end report, history, discovery/build/reward panels, and overlay orchestration.
- `ActiveObjectivePanel`: compact current objective and first-run stat hint.
- `StatDock`: four stat controls, safe-zone bars, trend/history dialog.
- `CyklusCardScene`: sanitized content wrapper for authored scene HTML and scene effects.
- `OutcomePanel`: immediate choice result inside the swipe card.
- `RunEndSummary`, `RewardSection`, `DeathAnalysis`, `BehavioralAnalysis`: end-of-run report layers inside `CyklusClient`.

### Mobile

- `CyklusMobileHud`: cycle, chapter, sector, progress, nearest risk, and diagnostic drawer.
- `CyklusBottomNav`: pocket, build, archive, and Void actions.
- `CyklusBottomSheet`: shared mobile pocket/build/history container.

### Supporting panels

- Pocket: `CyklusPocketPanel` plus the in-run active-item panel in `CyklusClient`.
- Build/stabilization: variant rows and progress bars in `CyklusClient`.
- Discovery, diagnostics, history, contracts, goals, card score preview, and cycle forecast remain local render blocks in `CyklusClient`.
- `CyklusProgressionDashboard` supplies the Void overview dashboard and compact pocket summary.

### Overlays

- Full-screen click-to-dismiss overlays: sector intro, cycle summary, forecast, and pre-run warning.
- Confirm overlay: tutorial skip.
- Framed panels: pocket, build, discovery/history, Void Hub, and item activation.
- Card-contained overlay: immediate outcome.
- Fixed dialogs/sheets: stat detail and `CyklusBottomSheet`.

### Void

- `CyklusVoidHubClient`: route persistence/actions and operation status.
- `CyklusVoidHub`: hero, return summary, next action, focus gates, tabs and tab panels.
- Tabs: Overview, Pocket, Crafting, Rooms, Loadout, Protocols.
- `CyklusProgressionDashboard`, `CyklusPocketPanel`, `FocusRunPanel`, `VoidReturnSummary`, and `VoidHubNextAction` provide the main visual blocks.

## CSS findings

### Duplicate rule groups

- `.cyklus-root` and `.cyklus-void-hub` each have three definitions.
- `.cyklus-pocket-panel`, `.cyklus-stat-dock`, `.void-hub-tabs`, `.void-hub-next-action`, `.progression-resource-grid`, `.resource-pill`, `.cyklus-panel-header`, and `.craft-status-pill` have multiple definitions.
- `.cyklus-bottom-sheet__backdrop` is first hidden with the desktop mobile-component group and then defined again as the active backdrop.
- Void overlay sizing and progression grids are overridden in multiple breakpoint blocks.
- `cyklus-fade-in` is declared three times under the same keyframe name.

These are migration targets, not immediate deletions. The final responsive layer must become the single effective source for each migrated component.

### Proven legacy/dead selector families

Repository search finds no current Cyklus JSX consumer for:

- old stat grid: `.cyklus-stats`, `.cyklus-stat`, `.cyklus-stat__bar`, `.cyklus-stat__fill`, `.cyklus-stat__ideal`, `.cyklus-stat__popup`, `.cyklus-stat-hint`;
- old inventory/modifier blocks: `.cyklus-inventory*`, `.cyklus-item*`, `.cyklus-modifier*`;
- old Void BEM implementation: `.cyklus-void-card*`, `.cyklus-void-button*`, `.cyklus-void-panel`, `.cyklus-void-tabs`, `.cyklus-void-tab*`, `.cyklus-void-list*`, `.cyklus-void-stat*`;
- dormant shell actions: `.cyklus-header__reset`, `.cyklus-menu__tagline`, `.cyklus-actions`.

Dynamic modifier selectors such as card categories, stat states, preview directions, risk levels, item moods, and outcome reward classes are generated at runtime and are not dead even when a literal-string scan misses them.

### Order-dependent selectors

- Story and route separators use `:not(:last-child)` and adjacent-sibling selectors.
- End findings/meta unlocks use `:last-child` to remove separators.
- Missing-reason and recommendation lists use `li + li` spacing.

These are structurally safe today, but visual separators should not carry semantic meaning.

## Inline styles

Must remain dynamic:

- swipe `transform` and `--swipe-opacity` in the card gesture container;
- stat fill percentage in `StatDock`;
- build/stabilization and discovery progress values.

No static inline style was found in the Cyklus components. Progress widths may later move from `width` to a CSS custom property, but that is only a representation change, not a hygiene requirement.

## Nesting and overflow risks

### Deep panel nesting

- Void overlay: overlay panel -> route client -> Void hub -> tab panel -> progression card -> list row -> status tag.
- Void overview: progression dashboard -> pocket panel -> pocket columns -> item/recipe rows.
- End screen: summary plus reward, analysis, profile, route, imprints, findings, unlocks, exports, and history are visually presented as many sibling cards.
- Mobile sheets can wrap already-framed pocket/build content, producing a card inside a modal inside an overlay.

### 360 px risks

- Six Void tabs currently collapse to a two-column grid instead of a compact horizontal rail.
- Non-wrapping resource/status pills can exceed narrow rows.
- Four-column stat dock and bottom navigation leave little room for long Czech labels.
- End summary rows and route/profile labels can compete with fixed-width values.
- Pocket title lines, room status, crafting cost, and loadout tags can force width beyond the content box.
- Multiple fixed layers use independent z-index values and can cover card choices or the final Void row.
- The gameplay card is sized by content rather than the space between HUD and bottom navigation.

## Migration boundaries

- Preserve all gesture, state, test, and ARIA contracts.
- Keep the dynamic inline styles listed above.
- Use the new token/foundation layer first, then migrate gameplay, Void, and overlays in separate checkpoints.
- Remove only the proven legacy families after visual and component verification.
