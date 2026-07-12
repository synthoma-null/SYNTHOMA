# SYNTHOMA OS Design System

Visual identity: `SYNTHOMA OS // BLACK MEMORY INTERFACE`.

The shared layer extends the Cyklus visual language. It does not replace the eight existing theme values or duplicate Cyklus component styling.

## Source structure

```text
src/styles/synthoma-os/
  index.css
  tokens.css
  themes.css
  typography.css
  media.css
  motion.css
  surfaces.css
  controls.css
  layout.css
  responsive.css
  accessibility.css
```

`index.css` is imported once by `app/layout.tsx`. Route-specific styles consume the tokens; they do not redefine theme palettes.

## Token contract

### Color and surfaces

- `--os-bg`, `--os-bg-deep`
- `--os-surface`, `--os-surface-raised`
- `--os-border`, `--os-border-strong`, `--os-axis`
- `--os-accent-primary`, `--os-accent-secondary`
- `--os-warning`, `--os-danger`, `--os-success`
- `--os-text`, `--os-text-secondary`, `--os-text-muted`

The default Synthoma palette resolves to near-black/navy, cyan, magenta, acid yellow and pale cyan. Every token aliases the existing theme variables first, so all eight themes remain authoritative.

### Typography

- `--os-font-display`, `--os-font-heading`, `--os-font-body`, `--os-font-mono`
- `--os-text-display`, `--os-text-heading`, `--os-text-body`
- `--os-text-control` (13px baseline)
- `--os-text-small` (13px baseline)
- `--os-text-micro` (12px baseline)
- `--os-text-log`, `--os-text-code`

All rem sizes grow through the existing root `--font-size-multiplier`; text is never enlarged with transforms.

### Spacing and geometry

- `--os-space-1` through `--os-space-8`
- `--os-command-height: 56px`
- `--os-mobile-nav-height: 58px`
- `--os-tap: 44px`
- `--os-content-width`, `--os-reader-width`, `--os-panel-width`
- `--os-border-width`, `--os-corner`, `--os-focus-ring`

### Media

- `--synthoma-media-theme-filter`: theme-only image/video filter
- `--synthoma-video-runtime-filter`: route-specific brightness/contrast layer
- `--os-media-opacity`
- `--os-scrim-strong`, `--os-scrim-soft`

Theme filtering and runtime video treatment remain separate, matching the proven Cyklus poster contract.

### Motion

- `--os-motion-fast`, `--os-motion-normal`, `--os-motion-slow`
- `--os-ease-standard`
- semantic boot pulse and signal glitch keyframes

`prefers-reduced-motion` removes translation, looping pulse and animated scan effects while retaining state information.

### Layer scale

| Token | Purpose |
|---|---|
| `--os-z-base` | content |
| `--os-z-media` | background media |
| `--os-z-shell` | command header / mobile navigation |
| `--os-z-dropdown` | compact menus |
| `--os-z-sheet` | bottom sheets |
| `--os-z-modal` | dialogs |
| `--os-z-portal` | fullscreen portal content |
| `--os-z-critical` | consent and critical alerts |

No shared component introduces an arbitrary five-digit z-index.

## Theme ownership

`src/styles/themes.css` remains the only palette/filter value owner for Synthoma, Green Matrix, Neon Hellfire, Cyber Dystopia, Acid Glitch, Retro Arcade, Mono BW and Mono Light.

`synthoma-os/themes.css` maps those existing variables to `--os-*`. `src/styles/cyklus/tokens.css` may map `--cy-*` to the same shared values. Standalone intro themes are removed.

## Portal context

Every global portal root exposes:

- `data-theme`
- `data-synthoma-theme`
- `data-synthoma-text-scale`
- `data-synthoma-density`
- `data-synthoma-reduced-effects`
- inline `--font-size-multiplier`

The context observes root/body theme and style changes. It must not remount portal content when a theme or text scale changes.

## Component primitives

- `.os-surface`: sharp framed operating surface, not a floating glass card.
- `.os-axis`: one-pixel technical rail or memory axis.
- `.os-command`: 44px minimum icon/text command.
- `.os-sector-link`: asymmetric sector entry with code, label and status.
- `.os-status`: compact code/value pair.
- `.os-scrim`: localized readability layer under text only.
- `.os-focus`: shared focus-visible behavior.

Cards use at most the shared small corner. Nested page-section cards are prohibited; repeated records and true tools may remain framed.

## Media rules

- Only the active route video is rendered.
- Videos are decorative, muted, `aria-hidden`, `playsInline`, and use metadata or no preload.
- Media failure reveals the route fallback background without blocking content.
- Full-viewport opaque scrims are prohibited. Home and Intro use localized text scrims.
- Reduced motion pauses autoplay where the component controls playback and removes decorative motion.

## Accessibility rules

- One skip link targets `#main-content`.
- One site navigation landmark and one active `aria-current="page"` item.
- Commands have a 44x44px target and an accessible name.
- Dialog owners retain focus trap, Escape and return-focus behavior.
- Body copy begins at 14-16px; reader body remains at least 16px mobile and targets 17-19px desktop.
- Mobile layout never disables browser zoom.

## Migration guidance

Cyklus remains behaviorally unchanged. Its specialized styles progressively alias shared tokens. Library, Archive and Reader move route-by-route; legacy CSS is removed only after import and runtime verification.
