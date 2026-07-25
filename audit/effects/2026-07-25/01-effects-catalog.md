# SYNTHOMA Effects Catalog

Kompletní technický katalog efektových tříd nalezených v projektu.

## `.action-bar__btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `.action-bar__btn`, `/* ── UI polish: glow, contrast, hover ──────────────────────────────────────── */

.solo-menu__btn,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__btn,
.run-map__node-circle`
- **Selector:** `.action-bar__btn`
- **CSS body (primary):**
```css
.action-bar__btn {
font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.55rem 0.9rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
```

---

## `.action-bar__card`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `.action-bar__card`, `/* ── UI polish: glow, contrast, hover ──────────────────────────────────────── */

.solo-menu__btn,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__btn,
.run-map__node-circle`
- **Selector:** `.action-bar__card`
- **CSS body (primary):**
```css
.action-bar__card {
font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 0.4rem 0.7rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
```

---

## `.action-bar__hand-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.action-bar__hand-label`, `.action-bar__hand-label`, `.solo-run .action-bar__hand-label`
- **Usage sample:**
  - `src\components\game\run\ActionBar.tsx`
- **Selector:** `.action-bar__hand-label`
- **CSS body (primary):**
```css
.action-bar__hand-label {
font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.active`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css, src\styles\profile.css, src\styles\reader.css
- **Used in:** 3 occurrences across 3 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `#control-panel .theme-button.active`, `#control-panel #playlist-container.playlist a.active`, `.theme-button.active`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\autor\AutorClient.tsx`
  - `app\components\BgVideo.tsx`
- **Selector:** `#control-panel #playlist-container.playlist a.active`
- **CSS body (primary):**
```css
.active {
background: rgba(0,255,255,0.12); box-shadow: 0 0 8px var(--glow-primary);
}
```

---

## `.admin-badge`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `/* ── Admin badge ─────────────────────────────────────────────────────────── */
.admin-badge`
- **Usage sample:**
  - `app\components\admin\AdminDashboard.tsx`
- **Selector:** `/* ── Admin badge ─────────────────────────────────────────────────────────── */
.admin-badge`
- **CSS body (primary):**
```css
.admin-badge {
display: inline-block;
  font-family: 'Text02', monospace;
  font-size: .55rem;
  letter-spacing: .08em;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid;
  text-transform: uppercase;
}
```

---

## `.admin-input`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 7 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.admin-input`, `.admin-input:focus`
- **Usage sample:**
  - `app\components\admin\AdminDashboard.tsx`
- **Selector:** `.admin-input`
- **CSS body (primary):**
```css
.admin-input {
background: rgba(0,0,0,.35);
  border: 1px solid var(--border-secondary, rgba(255,255,255,.12));
  border-radius: 6px;
  padding: 10px 12px;
  font-family: 'Text02', monospace;
  font-size: .95rem;
  color: var(--text-primary, #cfcfe3);
  letter-spacing: .04em;
  width: 100%;
  outline: none;
  transition: border-color .15s;
}
```

---

## `.admin-tab-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.admin-tab-btn`, `.admin-tab-btn:hover`, `.admin-tab-btn`
- **Selector:** `.admin-tab-btn`
- **CSS body (primary):**
```css
.admin-tab-btn {
display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  transition: background .15s, border-color .15s;
  position: relative;
}
```

---

## `.alarm-emote`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 7 occurrences across 4 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* Do not nudge when .alarm-emote starts the paragraph – keep spacing intact */
  p.text > .alarm-emote:first-of-type`, `/* Do not nudge when .alarm-emote starts the paragraph – keep spacing intact */
  p.text > .alarm-emote:first-of-type`, `.SYNTHOMAREADER .chapter-content p.text > .alarm-emote:first-of-type`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `public\books\efekty.html`
- **Selector:** `.alarm-emote`
- **CSS body (primary):**
```css
.alarm-emote {
color: #faff00; 
  text-shadow: 0 0 8px #faff00;
}
```

---

## `.allow-alarm`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** alarmPulse
- **Selectors (sample):** `}
  
  /* Allow-alarm override – pulzuj i při no-animations. */
  .SYNTHOMAREADER.allow-alarm .alarm-emote`, `}
  body.no-animations .SYNTHOMAREADER.allow-alarm .alarm-emote`
- **Selector:** `}
  
  /* Allow-alarm override – pulzuj i při no-animations. */
  .SYNTHOMAREADER.allow-alarm .alarm-emote`
- **CSS body (primary):**
```css
.allow-alarm {
animation: alarmPulse 1.1s ease-in-out infinite !important;
}
```

---

## `.animations-off`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition
- **Animations:** none
- **Selectors (sample):** `}
  }
  
  /* =========================
     A11Y / REDUCED MOTION – rozšířeno.
     ========================= */
  .no-animations *, .animations-off *`
- **Selector:** `}
  }
  
  /* =========================
     A11Y / REDUCED MOTION – rozšířeno.
     ========================= */
  .no-animations *, .animations-off *`
- **CSS body (primary):**
```css
.animations-off {
transition: none !important;
    animation: none !important;
}
```

---

## `.appear`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter, transform
- **Selectors (sample):** `.glitch-button.appear`, `.glitch-button.appear.visible`, `/* Appear animace – jako CTA. */
  .reader-controls.appear`
- **Selector:** `.glitch-button.appear`
- **CSS body (primary):**
```css
.appear {
opacity: 0; transform: translateY(6px) scale(0.99); filter: brightness(.95) saturate(.98);
}
```

---

## `.archive-card`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `}
  
  .archive-card`, `.archive-card:hover`, `.archive-card.is-open`
- **Selector:** `.archive-card:hover`
- **CSS body (primary):**
```css
.archive-card {
transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.08);
}
```

---

## `.archive-detail-dialog__category`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.archive-detail-dialog__category`
- **Usage sample:**
  - `src\components\archive\ArchiveDetailDialog.tsx`
- **Selector:** `.archive-detail-dialog__category`
- **CSS body (primary):**
```css
.archive-detail-dialog__category {
color: var(--os-text-muted);
  font-family: var(--font-mono, monospace);
  font-size: var(--os-font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

---

## `.archive-detail-dialog__locked`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.archive-detail-dialog__locked`
- **Usage sample:**
  - `src\components\archive\ArchiveDetailDialog.tsx`
- **Selector:** `.archive-detail-dialog__locked`
- **CSS body (primary):**
```css
.archive-detail-dialog__locked {
padding: var(--os-space-3);
  border: 1px dashed var(--os-accent-primary);
  border-radius: var(--os-corner);
  background: color-mix(in srgb, var(--os-accent-primary) 8%, transparent);
}
```

---

## `.archive-page`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `/* =========================
     ARCHIVE – CARD LAYOUT
     ========================= */
  .archive-page`, `.archive-page.is-modal::before`, `.archive-page.is-modal .archive-grid`
- **Selector:** `.archive-page.is-modal::before`
- **CSS body (primary):**
```css
.archive-page {
content: "";
    position: fixed;
    inset: 0;
    background: rgba(2, 4, 8, .6);
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    z-index: 40;
}
```

---

## `.archive-record-card`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.archive-record-card`, `.archive-record-card.os-surface`, `.archive-record-card[style*="--card-accent"]`
- **Selector:** `.archive-record-card`
- **CSS body (primary):**
```css
.archive-record-card {
--archive-category-accent: var(--os-text-cyan);
  --archive-card-accent: var(--card-accent, var(--archive-category-accent));
  display: grid;
  gap: var(--os-space-2);
  width: 100%;
  text-align: left;
  padding: var(--os-space-3);
  font: inherit;
  color: var(--os-text);
  transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s;
}
```

---

## `.archive-record-card--interactive`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform, color-mix
- **Selectors (sample):** `.archive-record-card--interactive`, `.archive-record-card--interactive:hover`, `.archive-record-card--interactive:hover .archive-record-card__header::before`
- **Selector:** `.archive-record-card--interactive:hover`
- **CSS body (primary):**
```css
.archive-record-card--interactive {
transform: translateY(-2px);
  border-left-color: var(--archive-card-accent);
  background: var(--os-surface-raised);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35), 0 0 16px color-mix(in srgb, var(--archive-card-accent) 10%, transparent);
}
```

---

## `.archive-record-card--locked`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.archive-record-card--locked`, `.archive-record-card--locked .archive-record-card__teaser`
- **Selector:** `.archive-record-card--locked`
- **CSS body (primary):**
```css
.archive-record-card--locked {
border-left-style: dashed;
  border-left-color: var(--os-text-muted);
  background: color-mix(in srgb, var(--os-surface) 88%, black);
}
```

---

## `.archive-record-card__category`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform, color-mix
- **Selectors (sample):** `.archive-record-card__category`
- **Usage sample:**
  - `src\components\archive\ArchiveRecordCard.tsx`
- **Selector:** `.archive-record-card__category`
- **CSS body (primary):**
```css
.archive-record-card__category {
grid-column: 2;
  grid-row: 2;
  min-width: 0;
  font-size: var(--os-font-size-xs);
  color: color-mix(in srgb, var(--archive-category-accent) 72%, var(--os-text-soft));
  font-family: var(--os-font-mono, monospace);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  overflow-wrap: break-word;
}
```

---

## `.archive-record-card__quote`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `}

.archive-record-card__quote`
- **Selector:** `}

.archive-record-card__quote`
- **CSS body (primary):**
```css
.archive-record-card__quote {
font-style: italic;
  border-left: 2px solid var(--archive-card-accent);
  padding-left: var(--os-space-2);
  margin: 0;
  color: color-mix(in srgb, var(--archive-card-accent) 52%, var(--os-text-secondary));
}
```

---

## `.audio-buttons`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `#control-panel .btn, #control-panel .panel-button, #control-panel .theme-button, .reader-controls button,
  #control-panel label, #control-panel input, #control-panel .progress, #control-panel .audio-buttons`, `#control-panel .audio-buttons .btn,
  #control-panel .audio-buttons button`, `#control-panel .audio-buttons .btn,
  #control-panel .audio-buttons button`
- **Selector:** `#control-panel :is(.panel-button, .audio-buttons .btn)[aria-pressed="true"]`
- **CSS body (primary):**
```css
.audio-buttons {
border-color: var(--cy-line-strong);
  background: var(--cy-button-active);
  box-shadow: inset 3px 0 0 var(--cy-accent-primary);
}
```

---

## `.audioBadge`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `.audioBadge`, `.audioBadge:hover`
- **Selector:** `.audioBadge`
- **CSS body (primary):**
```css
.audioBadge {
font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  opacity: 0.7;
  background: rgba(124,92,255,0.08);
  border: 1px solid rgba(124,92,255,0.25);
  transition: opacity 0.2s ease, background 0.2s ease, transform 0.15s ease;
  cursor: pointer;
}
```

---

## `.auth-home-panel`

- **Status:** defined
- **CSS files:** src\styles\auth.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `.auth-home-panel`, `.auth-home-panel.os-surface--glass`
- **Usage sample:**
  - `app\login\page.tsx`
  - `app\register\page.tsx`
- **Selector:** `.auth-home-panel.os-surface--glass`
- **CSS body (primary):**
```css
.auth-home-panel {
background: rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border-radius: 20px;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-glow, 0 0 12px rgba(0,255,255,.25));
}
```

---

## `.auth-home-title`

- **Status:** defined
- **CSS files:** src\styles\auth.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** transform
- **Selectors (sample):** `.auth-home-title`, `.auth-home-title`
- **Usage sample:**
  - `app\login\page.tsx`
  - `app\register\page.tsx`
- **Selector:** `.auth-home-title`
- **CSS body (primary):**
```css
.auth-home-title {
font-size: clamp(2rem, 6vw, 3.6rem);
  letter-spacing: .1em;
  text-transform: uppercase;
  margin: 0;
  color: #fff;
  text-align: center;
}
```

---

## `.auth-input`

- **Status:** defined
- **CSS files:** src\styles\auth.css, src\styles\components.css
- **Used in:** 8 occurrences across 4 files
- **Effect properties:** transition
- **Selectors (sample):** `.auth-input`, `.auth-input:focus`, `.auth-input:disabled`
- **Usage sample:**
  - `app\components\auth\LoginForm.tsx`
  - `app\components\auth\RegisterForm.tsx`
  - `src\components\access\ContentPurchaseDialog.tsx`
  - `src\components\profile\MnemAccessPanel.tsx`
- **Selector:** `.auth-input`
- **CSS body (primary):**
```css
.auth-input {
background: rgba(0,0,0,.5);
  border: 1px solid var(--border-secondary);
  color: var(--text-primary);
  font-family: var(--font-mono, monospace);
  font-size: .9rem;
  padding: .55rem .75rem;
  outline: none;
  transition: border-color .2s;
  width: 100%;
}
```

---

## `.autor-fallback`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `/* Noscript fallback styling */
.autor-fallback`, `.autor-fallback h1,
.autor-fallback h2,
.autor-fallback h3`, `.autor-fallback h1,
.autor-fallback h2,
.autor-fallback h3`
- **Selector:** `.autor-fallback h1`
- **CSS body (primary):**
```css
.autor-fallback {
font-size: clamp(2.6rem,6vw,4rem);
  letter-spacing: .06em;
  text-transform: uppercase;
}
```

---

## `.autor-panel`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `}

  /* Autor page navigation panel migrated to shared os-surface--glass. */
  .autor-panel.os-surface--glass`
- **Selector:** `}

  /* Autor page navigation panel migrated to shared os-surface--glass. */
  .autor-panel.os-surface--glass`
- **CSS body (primary):**
```css
.autor-panel {
background: rgba(var(--bg-secondary-rgb), 0.6);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    border-radius: 0;
    box-shadow: var(--shadow-glow, 0 0 12px rgba(0,255,255,.25));
}
```

---

## `.badge`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.badge`, `#control-panel .badge`
- **Selector:** `.badge`
- **CSS body (primary):**
```css
.badge {
display: inline-block; padding: .12rem .45rem; border-radius: 6px;
    background: color-mix(in oklab, var(--bg-secondary) 55%, transparent);
    border: 1px solid var(--border-secondary); color: var(--text-secondary);
    font-size: .85rem; line-height: 1; vertical-align: middle;
}
```

---

## `.badge-accent`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.badge-accent`
- **Selector:** `.badge-accent`
- **CSS body (primary):**
```css
.badge-accent {
background: color-mix(in oklab, var(--accent-primary) 10%, transparent); border-color: var(--accent-primary); color: var(--text-primary);
}
```

---

## `.badge-item--earned`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.badge-item--earned`
- **Selector:** `.badge-item--earned`
- **CSS body (primary):**
```css
.badge-item--earned {
border-color: var(--accent-primary, #7c5cff);
  box-shadow: 0 0 6px rgba(124,92,255,.2);
  color: var(--accent-primary, #7c5cff);
}
```

---

## `.badge-item--locked`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.badge-item--locked`
- **Selector:** `.badge-item--locked`
- **CSS body (primary):**
```css
.badge-item--locked {
opacity: .3; filter: grayscale(1);
}
```

---

## `.bg-video`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.bg-video`
- **Selector:** `.bg-video`
- **CSS body (primary):**
```css
.bg-video {
position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    pointer-events: none;
    filter: var(--filter-primary, none);
}
```

---

## `.bgHost`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `/* Generic background host for reader variants that don't use TypewriterReader */
.bgHost`
- **Selector:** `/* Generic background host for reader variants that don't use TypewriterReader */
.bgHost`
- **CSS body (primary):**
```css
.bgHost {
position: relative;
  min-height: 100vh;
  /* Use the same variable names as containerStyle in ReaderContent.tsx */
  background-image: var(--bg-image, none);
  /* Solid base overlay driven by opacity var (color is unified as black for readability) */
  background-color: rgba(0, 0, 0, var(--app-bg-opacity, var(--bg-opacity, 1)));
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  filter: var(--bg-blur, none);
}
```

---

## `.bios-warning`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 279 occurrences across 27 files
- **Effect properties:** box-shadow, animation, color-mix
- **Animations:** biosBlink
- **Selectors (sample):** `}
.bios-warning`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
- **Selector:** `}
.bios-warning`
- **CSS body (primary):**
```css
.bios-warning {
outline: 2px solid transparent; outline-offset: 2px;
  box-shadow: 0 0 10px color-mix(in oklab, var(--accent-warning, #f6ff00) 35%, transparent);
  animation: biosBlink 2.6s steps(10, end) infinite;
}
```

---

## `.blink`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** synthBlink
- **Selectors (sample):** `.synth-gate-terminal .blink`, `}

/* no-animations app toggle compatibility */
.no-animations .synth-gateway-shell::after,
.no-animations .synth-gate-title::before,
.no-animations .synth-gate-title::after,
.no-animations .synth-gate-noise,
.no-animations .synth-gate-grid,
.no-animations .synth-gate-orbit,
.no-animations .synth-gate-pulse,
.no-animations .synth-gate-ritual::after,
.no-animations .synth-gate-primary::after,
.no-animations .synth-gate-terminal .blink`, `.synth-gate-terminal .blink`
- **Selector:** `.synth-gate-terminal .blink`
- **CSS body (primary):**
```css
.blink {
animation: synthBlink 1s steps(2) infinite;
}
```

---

## `.book-link`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transform
- **Animations:** glitch
- **Selectors (sample):** `.book-link`, `/* Book/chapter links – jako text se šipkou. */
  .book-link`, `.book-link:hover, .chapter-link:hover`
- **Selector:** `.book-link:hover, .chapter-link:hover`
- **CSS body (primary):**
```css
.book-link {
text-decoration: underline; transform: translateY(-2px); animation: glitch 1s infinite;
}
```

---

## `.bookCard`

- **Status:** defined
- **CSS files:** app\books\books.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.bookCard`, `.bookCard:hover`
- **Selector:** `.bookCard`
- **CSS body (primary):**
```css
.bookCard {
background: #1e293b;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #334155;
}
```

---

## `.books-fallback`

- **Status:** defined
- **CSS files:** app\books\books.module.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `/* Noscript fallback styling */
.books-fallback`, `.books-fallback h1`, `.books-fallback h2`
- **Usage sample:**
  - `app\books\page.tsx`
- **Selector:** `.books-fallback h1`
- **CSS body (primary):**
```css
.books-fallback {
font-size: clamp(2.6rem,6vw,4rem);
  letter-spacing: .06em;
  text-transform: uppercase;
  margin: 0 0 2rem;
  color: #fff;
}
```

---

## `.bright`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 23 occurrences across 4 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.neon-char.bright`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `public\books\efekty.html`
- **Selector:** `.neon-char.bright`
- **CSS body (primary):**
```css
.bright {
opacity: 1;
    text-shadow: 0 0 10px var(--accent-primary), 0 0 20px var(--accent-primary),
                 0 0 40px var(--accent-primary), 0 0 80px var(--accent-primary),
                 0 0 120px var(--accent-primary);
}
```

---

## `.btn`

- **Status:** defined
- **CSS files:** app\books\books.module.css, src\styles\components.css, src\styles\control-panel-os.css, src\styles\reader.css
- **Used in:** 66 occurrences across 26 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.btn`, `.btn:hover`, `.btn:active`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\chapter\[id]\ChapterAccessGate.tsx`
  - `app\chapter\[id]\page.tsx`
  - `app\components\MBTIHudClient.tsx`
- **Selector:** `.btn`
- **CSS body (primary):**
```css
.btn {
color: var(--text-primary);
    background: rgba(0,0,0,.45);
    border: 1px solid var(--border-primary);
    border-radius: 4px;
    font-family: 'Text02', monospace;
    font-size: .72rem;
    font-weight: 700;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: .45rem 1.1rem;
    cursor: pointer;
    box-shadow: 0 0 0 0 var(--glow-secondary), inset 0 0 0 0 transparent;
    transition: transform .12s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease;
}
```

---

## `.btn-copy`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.btn-copy`, `.btn-copy:hover`, `/* Larger tap targets */
  .btn-roll,
  .btn-end-turn,
  .btn-event-choice,
  .btn-event-confirm,
  .btn-game-primary,
  .btn-game-secondary,
  .btn-start,
  .btn-leave,
  .btn-copy`
- **Usage sample:**
  - `src\components\game\RoomLobby.tsx`
- **Selector:** `.btn-copy`
- **CSS body (primary):**
```css
.btn-copy {
background: none;
  border: 1px solid var(--game-border);
  border-radius: 4px;
  color: var(--game-text-muted);
  font-family: var(--font-family-mono, monospace);
  font-size: 0.75rem;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
```

---

## `.btn-end-turn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, color-mix
- **Selectors (sample):** `.btn-end-turn`, `.btn-end-turn:hover`, `.btn-end-turn`
- **Usage sample:**
  - `src\components\game\GameShell.tsx`
- **Selector:** `.btn-end-turn`
- **CSS body (primary):**
```css
.btn-end-turn {
padding: 0.6rem 1.2rem;
  background: color-mix(in srgb, var(--game-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--game-accent) 40%, transparent);
  color: var(--game-accent);
  border-radius: 4px;
  font-family: var(--font-family-mono, monospace);
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 0.2s;
  margin-left: auto;
}
```

---

## `.btn-event-choice`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.btn-event-choice`, `.btn-event-choice:hover`, `.btn-event-choice`
- **Usage sample:**
  - `src\components\game\StoryEventModal.tsx`
- **Selector:** `.btn-event-choice`
- **CSS body (primary):**
```css
.btn-event-choice {
display: flex;
  flex-direction: column;
  gap: 0.2rem;
  text-align: left;
  padding: 0.75rem 1rem;
  background: var(--game-input-bg);
  border: 1px solid var(--game-border);
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
```

---

## `.btn-event-confirm`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, color-mix
- **Selectors (sample):** `.btn-event-confirm`, `.btn-event-confirm:hover`, `/* Larger tap targets */
  .btn-roll,
  .btn-end-turn,
  .btn-event-choice,
  .btn-event-confirm,
  .btn-game-primary,
  .btn-game-secondary,
  .btn-start,
  .btn-leave,
  .btn-copy`
- **Usage sample:**
  - `src\components\game\StoryEventModal.tsx`
- **Selector:** `.btn-event-confirm`
- **CSS body (primary):**
```css
.btn-event-confirm {
padding: 0.7rem 1.5rem;
  background: color-mix(in srgb, var(--game-accent) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--game-accent) 50%, transparent);
  color: var(--game-accent);
  border-radius: 4px;
  font-family: var(--font-family-mono, monospace);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}
```

---

## `.btn-game-primary`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.btn-game-primary,
.btn-game-secondary`, `.btn-game-primary`, `.btn-game-primary:hover`
- **Usage sample:**
  - `app\game\GameClient.tsx`
- **Selector:** `.btn-game-primary,
.btn-game-secondary`
- **CSS body (primary):**
```css
.btn-game-primary {
padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-family: var(--font-family-mono, monospace);
  font-size: 0.9rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
}
```

---

## `.btn-game-secondary`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.btn-game-primary,
.btn-game-secondary`, `.btn-game-secondary`, `.btn-game-secondary:hover`
- **Usage sample:**
  - `app\game\GameClient.tsx`
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.btn-game-secondary:hover`
- **CSS body (primary):**
```css
.btn-game-secondary {
background: color-mix(in srgb, var(--game-accent) 10%, transparent);
}
```

---

## `.btn-ghost`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.btn-ghost`, `.btn-ghost:hover`
- **Selector:** `.btn-ghost:hover`
- **CSS body (primary):**
```css
.btn-ghost {
background: color-mix(in oklab, var(--bg-secondary) 12%, transparent);
    border-color: var(--border-secondary);
}
```

---

## `.btn-neon`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* Tlačítka */
.btn-neon`, `.btn-neon:hover`
- **Selector:** `.btn-neon:hover`
- **CSS body (primary):**
```css
.btn-neon {
border-color: var(--neon-magenta);
  color: var(--neon-magenta);
  box-shadow: 0 0 12px rgba(255,0,255,0.4);
}
```

---

## `.btn-outline`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\paywall.css
- **Used in:** 10 occurrences across 7 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.btn-outline`, `.btn-outline:hover`, `.btn-outline`
- **Usage sample:**
  - `app\chapter\[id]\ChapterAccessGate.tsx`
  - `app\chapter\[id]\page.tsx`
  - `app\privacy\PrivacyClient.tsx`
  - `app\terms\TermsClient.tsx`
  - `src\components\access\ContentPurchaseDialog.tsx`
- **Selector:** `.btn-outline:hover`
- **CSS body (primary):**
```css
.btn-outline {
background: color-mix(in oklab, var(--bg-secondary) 20%, transparent);
}
```

---

## `.btn-play-again`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transition
- **Selectors (sample):** `.btn-play-again`, `.btn-play-again:hover`, `.btn-play-again:hover`
- **Usage sample:**
  - `src\components\game\EndGameReport.tsx`
- **Selector:** `.btn-play-again`
- **CSS body (primary):**
```css
.btn-play-again {
padding: 0.8rem 2rem;
  background: var(--game-accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 4px;
  font-family: var(--font-family-mono, monospace);
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s, box-shadow 0.2s;
}
```

---

## `.btn-roll`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.btn-roll`, `.btn-roll:hover`, `.btn-roll`
- **Usage sample:**
  - `src\components\game\DiceRoller.tsx`
- **Selector:** `.btn-roll`
- **CSS body (primary):**
```css
.btn-roll {
padding: 0.5rem 1rem;
  background: var(--game-accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 4px;
  font-family: var(--font-family-mono, monospace);
  font-size: 0.85rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s;
}
```

---

## `.btn-secondary`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.btn-secondary`, `.btn-secondary:hover`
- **Selector:** `.btn-secondary`
- **CSS body (primary):**
```css
.btn-secondary {
background: linear-gradient(180deg, color-mix(in oklab, var(--bg-tertiary) 70%, transparent), color-mix(in oklab, var(--bg-secondary) 85%, transparent));
    border-color: var(--border-secondary);
    color: var(--text-secondary);
}
```

---

## `.btn-share`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.btn-share`, `.btn-share:hover`
- **Usage sample:**
  - `src\components\game\EndGameReport.tsx`
- **Selector:** `.btn-share`
- **CSS body (primary):**
```css
.btn-share {
background: none;
  border: 1px solid var(--game-border);
  color: var(--game-text-muted);
  border-radius: 4px;
  padding: 0.35rem 0.75rem;
  font-family: var(--font-family-mono, monospace);
  font-size: 0.75rem;
  cursor: pointer;
  align-self: flex-start;
  transition: border-color 0.2s, color 0.2s;
}
```

---

## `.btn-start`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition
- **Selectors (sample):** `.btn-start`, `.btn-start:hover`, `.btn-start`
- **Selector:** `.btn-start`
- **CSS body (primary):**
```css
.btn-start {
padding: 0.9rem;
  background: var(--game-accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 4px;
  font-family: var(--font-family-mono, monospace);
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: opacity 0.2s, box-shadow 0.2s;
}
```

---

## `.card-close`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `.archive-card .card-close`, `.archive-card .card-close:hover`
- **Selector:** `.archive-card .card-close`
- **CSS body (primary):**
```css
.card-close {
position: absolute;
    top: 8px;
    right: 10px;
    z-index: 3;
    border: 1px solid rgba(255,255,255,.2);
    background: rgba(20, 22, 28, .6);
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    color: #fff;
    border-radius: 8px;
    width: 34px; height: 34px;
    line-height: 32px;
    text-align: center;
    font-size: 22px;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0,0,0,.35);
}
```

---

## `.card-content`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.card-content p, .card-teaser, .card-body p`, `.card-content`, `.card-content .text`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
- **Selector:** `.card-content`
- **CSS body (primary):**
```css
.card-content {
padding: 0 1rem 1rem;
    transition: opacity .2s ease, max-height .25s ease, padding-top .2s ease, padding-bottom .2s ease;
    opacity: 1;
    max-height: 600px;
}
```

---

## `.card-title`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.card-title`, `.archive-card .card-title`, `.archive-card.is-locked .card-title`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
- **Selector:** `.card-title`
- **CSS body (primary):**
```css
.card-title {
font-size: calc(1.125rem * var(--font-size-multiplier));
    line-height: 1.2;
    margin: 0 0 .25rem 0;
    letter-spacing: .02em;
    text-shadow: 0 0 10px rgba(0,0,0,.35);
}
```

---

## `.cc-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 5 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.cc-btn`, `.cc-btn`
- **Usage sample:**
  - `src\components\consent\CookieConsent.tsx`
- **Selector:** `.cc-btn`
- **CSS body (primary):**
```css
.cc-btn {
flex: 1 1 auto;
  min-width: 140px;
  padding: 9px 14px;
  border-radius: 8px;
  font-family: 'Text02', monospace;
  font-size: .72rem;
  letter-spacing: .1em;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid var(--border-secondary, rgba(255,255,255,.15));
  transition: background .15s, border-color .15s, box-shadow .15s;
}
```

---

## `.cc-btn-primary`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cc-btn-primary`, `.cc-btn-primary:hover`
- **Usage sample:**
  - `src\components\consent\CookieConsent.tsx`
- **Selector:** `.cc-btn-primary:hover`
- **CSS body (primary):**
```css
.cc-btn-primary {
box-shadow: 0 0 14px rgba(124,92,255,.5);
}
```

---

## `.cc-panel`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `.cc-panel`, `.cc-panel.os-surface--glass`
- **Usage sample:**
  - `src\components\consent\CookieConsent.tsx`
- **Selector:** `.cc-panel`
- **CSS body (primary):**
```css
.cc-panel {
pointer-events: auto;
  width: 100%;
  max-width: 640px;
  padding: 20px 22px;
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  box-shadow: 0 -8px 40px rgba(0,0,0,.5), 0 0 20px rgba(124,92,255,.15);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
```

---

## `.cc-toggle-slider`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.cc-toggle-slider`, `.cc-toggle-slider::after`, `.cc-toggle input:checked + .cc-toggle-slider`
- **Usage sample:**
  - `src\components\consent\CookieConsent.tsx`
- **Selector:** `.cc-toggle-slider`
- **CSS body (primary):**
```css
.cc-toggle-slider {
position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.15);
  transition: background .2s;
}
```

---

## `.chapter-background__video`

- **Status:** defined
- **CSS files:** src\styles\motion-contract.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `:root[data-background-motion="off"] .synthoma-media-layer__video,
:root[data-background-motion="off"] .video-background video,
:root[data-background-motion="off"] .lib-bg-video,
:root[data-background-motion="off"] .chapter-background__video,
:root[data-background-motion="off"] .cyklus-menu__video,
:root[data-background-motion="off"] #retro-video-canvas`, `.chapter-background__poster,
.chapter-background__video`, `.chapter-background__video`
- **Selector:** `.chapter-background__video`
- **CSS body (primary):**
```css
.chapter-background__video {
position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity .7s ease;
}
```

---

## `.chapter-bg-video`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.chapter-bg-video`
- **Selector:** `.chapter-bg-video`
- **CSS body (primary):**
```css
.chapter-bg-video {
position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: brightness(0.6) saturate(1.05) blur(0.5px);
    opacity: 0.18;
}
```

---

## `.chapter-container`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition, transform
- **Animations:** none
- **Selectors (sample):** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **Selector:** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **CSS body (primary):**
```css
.chapter-container {
animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

---

## `.chapter-content`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, src\styles\book-reader-base.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation, transition, transform
- **Animations:** none
- **Selectors (sample):** `.chapter-reader__article.SYNTHOMAREADER .chapter-content,
.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.text, p:not(.log):not([class*="terminal"]):not([class*="system"]))`, `.chapter-reader__article.SYNTHOMAREADER .chapter-content,
.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.text, p:not(.log):not([class*="terminal"]):not([class*="system"]))`, `.chapter-reader__article.SYNTHOMAREADER .chapter-content p`
- **Usage sample:**
  - `app\autor\AutorClient.tsx`
  - `src\lib\pdfExport.ts`
- **Selector:** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **CSS body (primary):**
```css
.chapter-content {
animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

---

## `.chapter-link`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transform
- **Animations:** glitch
- **Selectors (sample):** `.chapter-link`, `.chapter-link`, `.book-link:hover, .chapter-link:hover`
- **Selector:** `.book-link:hover, .chapter-link:hover`
- **CSS body (primary):**
```css
.chapter-link {
text-decoration: underline; transform: translateY(-2px); animation: glitch 1s infinite;
}
```

---

## `.chapter-loaded`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** fadeIn
- **Selectors (sample):** `/* Chapter loaded fade – sjednoceno. */
  .SYNTHOMAREADER.chapter-loaded`
- **Selector:** `/* Chapter loaded fade – sjednoceno. */
  .SYNTHOMAREADER.chapter-loaded`
- **CSS body (primary):**
```css
.chapter-loaded {
animation: fadeIn 0.5s ease-in-out;
}
```

---

## `.chapter-rail`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.chapter-rail`
- **Usage sample:**
  - `src\components\reader\ChapterRail.tsx`
- **Selector:** `.chapter-rail`
- **CSS body (primary):**
```css
.chapter-rail {
position: fixed;
  z-index: var(--os-z-shell, 40);
  top: 50%;
  left: max(0.55rem, calc((100vw - 92rem) / 2));
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  width: 3.4rem;
  color: var(--book-accent);
  font-family: var(--font-family-mono, ui-monospace, monospace);
  transform: translateY(-50%);
  pointer-events: none;
}
```

---

## `.chapter-rail__book`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform, color-mix
- **Selectors (sample):** `.chapter-rail__book`, `.chapter-rail__book`
- **Usage sample:**
  - `src\components\reader\ChapterRail.tsx`
- **Selector:** `.chapter-rail__book`
- **CSS body (primary):**
```css
.chapter-rail__book {
writing-mode: vertical-rl;
  transform: rotate(180deg);
  color: color-mix(in srgb, var(--book-accent) 76%, white);
  font-size: var(--font-size-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## `.chapter-rail__signal`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.chapter-rail__signal`, `.chapter-rail__signal`
- **Usage sample:**
  - `src\components\reader\ChapterRail.tsx`
- **Selector:** `.chapter-rail__signal`
- **CSS body (primary):**
```css
.chapter-rail__signal {
width: 1px;
  height: 5rem;
  background: linear-gradient(transparent, var(--book-accent), transparent);
  box-shadow: 0 0 0.8rem var(--book-accent);
}
```

---

## `.chapter-reader--focus`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition
- **Animations:** none
- **Selectors (sample):** `.chapter-reader--focus .chapter-background__video`, `.chapter-reader--focus`, `.chapter-reader--focus .chapter-reader__command-bar`
- **Selector:** `.chapter-reader--focus,
.chapter-reader--focus *`
- **CSS body (primary):**
```css
.chapter-reader--focus {
animation: none !important;
  transition: none !important;
}
```

---

## `.chapter-reader__article`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css, src\styles\reader.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** text-shadow, box-shadow, color-mix
- **Selectors (sample):** `.chapter-reader__article.SYNTHOMAREADER`, `.chapter-reader__article.SYNTHOMAREADER .chapter-content,
.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.text, p:not(.log):not([class*="terminal"]):not([class*="system"]))`, `.chapter-reader__article.SYNTHOMAREADER .chapter-content,
.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.text, p:not(.log):not([class*="terminal"]):not([class*="system"]))`
- **Usage sample:**
  - `app\autor\AutorClient.tsx`
  - `app\chapter\[id]\ChapterReaderArticle.tsx`
- **Selector:** `.chapter-reader__article.SYNTHOMAREADER .dialog-line`
- **CSS body (primary):**
```css
.chapter-reader__article {
position: relative;
  padding: 0.72rem 1rem 0.72rem 1.15rem !important;
  border-left: 3px solid var(--speaker-color) !important;
  color: var(--speaker-color) !important;
  background: linear-gradient(90deg, color-mix(in srgb, var(--speaker-color) 10%, transparent), transparent 76%) !important;
  box-shadow: inset 0.12rem 0 0 color-mix(in srgb, var(--speaker-secondary) 35%, transparent);
  text-shadow: 0 0 calc(0.2rem + 0.65rem * var(--reader-effect-intensity)) color-mix(in srgb, var(--speaker-color) 22%, transparent);
  -webkit-user-select: text !important;
  user-select: text !important;
  …
}
```

---

## `.chapter-reader__command-bar`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** filter, backdrop-filter, color-mix
- **Selectors (sample):** `.chapter-reader__command-bar,
.chapter-reader__article,
.chapter-reader__navigation,
.chapter-reader__machine-links`, `.chapter-reader__command-bar`, `.chapter-reader--focus .chapter-reader__command-bar`
- **Usage sample:**
  - `app\autor\AutorClient.tsx`
  - `app\chapter\[id]\ChapterReaderArticle.tsx`
- **Selector:** `.chapter-reader__command-bar`
- **CSS body (primary):**
```css
.chapter-reader__command-bar {
position: sticky;
  top: 0;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: .65rem .8rem;
  width: min(100%, 68rem);
  margin: 0 auto 2rem;
  padding: max(.65rem, env(safe-area-inset-top)) .8rem .65rem;
  border: 1px solid var(--border-secondary);
  background: color-mix(in srgb, var(--bg-primary) 88%, transparent);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  z-index: 10;
}
```

---

## `.chapter-reader__navigation`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.chapter-reader__command-bar,
.chapter-reader__article,
.chapter-reader__navigation,
.chapter-reader__machine-links`, `.chapter-reader__article.SYNTHOMAREADER .choice-link,
.chapter-reader__command-bar,
.chapter-reader__navigation`, `.chapter-reader__navigation`
- **Usage sample:**
  - `app\chapter\[id]\ChapterReaderArticle.tsx`
- **Selector:** `.chapter-reader__navigation a`
- **CSS body (primary):**
```css
.chapter-reader__navigation {
display: flex;
  flex-direction: column;
  gap: .3rem;
  padding: 1rem;
  border: 1px solid var(--border-secondary);
  color: var(--text-primary);
  text-decoration: none;
  background: color-mix(in srgb, var(--bg-primary) 88%, transparent);
}
```

---

## `.chapter-reader__progress-bar`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transition
- **Selectors (sample):** `.chapter-reader__progress-bar`
- **Usage sample:**
  - `src\components\reader\ChapterReadingProgress.tsx`
- **Selector:** `.chapter-reader__progress-bar`
- **CSS body (primary):**
```css
.chapter-reader__progress-bar {
display: block;
  width: var(--chapter-progress, 0%);
  height: 100%;
  background: var(--accent-secondary);
  box-shadow: 0 0 10px var(--glow-secondary);
  transition: width .12s linear;
}
```

---

## `.chapter-title`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition, transform
- **Animations:** none
- **Selectors (sample):** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **Selector:** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **CSS body (primary):**
```css
.chapter-title {
animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

---

## `.chapterNavBtn`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.chapterNavBtn`, `.chapterNavBtn:hover`, `.chapterNavBtn`
- **Selector:** `.chapterNavBtn`
- **CSS body (primary):**
```css
.chapterNavBtn {
display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  max-width: 45%;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}
```

---

## `.chip`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* Chip/Badge utilities – čipy pro ty, co mají hlad po stylech. 🍟 */
  .chip`, `#control-panel .chip`
- **Selector:** `/* Chip/Badge utilities – čipy pro ty, co mají hlad po stylech. 🍟 */
  .chip`
- **CSS body (primary):**
```css
.chip {
display: inline-flex; align-items: center; gap: .4rem;
    padding: .25rem .55rem; border-radius: 999px;
    background: color-mix(in oklab, var(--bg-secondary) 65%, transparent);
    border: 1px solid var(--border-secondary);
    color: var(--text-secondary);
    font-family: var(--font-family-primary);
    font-size: .95rem; line-height: 1; white-space: nowrap;
}
```

---

## `.chip-accent`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.chip-accent`
- **Selector:** `.chip-accent`
- **CSS body (primary):**
```css
.chip-accent {
background: color-mix(in oklab, var(--accent-primary) 12%, transparent); color: var(--text-primary); border-color: var(--accent-primary);
}
```

---

## `.choice`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, public\styles.css, public\synth-gate.css, src\styles\base.css, src\styles\book-reader-base.css, src\styles\components-choice.css, src\styles\components.css, src\styles\reader.css, src\styles\synth-gate.css
- **Used in:** 363 occurrences across 43 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`
- **CSS body (primary):**
```css
.choice {
border-color: var(--choice-accent, var(--accent-secondary, #0ff));
    box-shadow: 0 0 12px var(--choice-accent, var(--accent-secondary, #0ff));
}
```

---

## `.choice-appear`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.choice-box .choice-link.choice-appear`, `.choice-box .choice-link.choice-appear.visible`, `.SYNTHOMAREADER.choices-shown .choice-link.choice-appear`
- **Selector:** `.choice-box .choice-link.choice-appear`
- **CSS body (primary):**
```css
.choice-appear {
opacity: 0;
    transform: translateY(6px);
}
```

---

## `.choice-box`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `/* Unified CHOICE LINK visual (reader + landing) */
  .choice-box .choice-link,
  p.choice > .choice-link,
  .SYNTHOMAREADER .choice-link`, `.choice-box .choice-link:hover`, `.choice-box .choice-link.choice-appear`
- **Selector:** `.choice-box .choice-link:hover`
- **CSS body (primary):**
```css
.choice-box {
background: var(--border-secondary, 0.5);
    box-shadow: 0 0 10px var(--glow-secondary);
    transform: translateY(-1px);
    text-decoration: none;
}
```

---

## `.choice-empty`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `button.choice-link.choice-empty`, `.choice-link.choice-empty`
- **Selector:** `button.choice-link.choice-empty`
- **CSS body (primary):**
```css
.choice-empty {
min-height: 1.8rem; opacity: .6;
}
```

---

## `.choice-group`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `[data-choice-group], .choice-group, .choices`, `.choice-group .choice-link, .choices .choice-link, [data-choice-group] .choice-link`, `.choice-group .choice-link.chosen`
- **Selector:** `.choice-group .choice-link, .choices .choice-link, [data-choice-group] .choice-link`
- **CSS body (primary):**
```css
.choice-group {
display: inline-block; /* allow centering via text-align on parent */
    margin-right: .5rem;
}
```

---

## `.choice-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.choice-label`
- **Usage sample:**
  - `src\components\game\StoryEventModal.tsx`
- **Selector:** `.choice-label`
- **CSS body (primary):**
```css
.choice-label {
font-size: 0.7rem; font-family: var(--font-family-mono, monospace); color: var(--game-accent); letter-spacing: 0.05em;
}
```

---

## `.choice-link`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, public\styles.css, public\synth-gate.css, src\styles\base.css, src\styles\components-choice.css, src\styles\components.css, src\styles\reader.css, src\styles\synth-gate.css, src\styles\themes.css
- **Used in:** 107 occurrences across 41 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.choice-link:focus-visible`
- **CSS body (primary):**
```css
.choice-link {
outline: 2px solid var(--accent-primary); outline-offset: 2px; box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent-primary) 35%, transparent); text-decoration: none;
}
```

---

## `.choice-text`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.choice-text`, `.choice-text`
- **Usage sample:**
  - `src\components\game\StoryEventModal.tsx`
- **Selector:** `.choice-text`
- **CSS body (primary):**
```css
.choice-text {
font-size: 0.85rem; color: var(--text-secondary);
}
```

---

## `.choices`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `[data-choice-group], .choice-group, .choices`, `.choice-group .choice-link, .choices .choice-link, [data-choice-group] .choice-link`
- **Selector:** `[data-choice-group], .choice-group, .choices`
- **CSS body (primary):**
```css
.choices {
display: block;
    margin: .25rem 0 .5rem;
    text-align: center; /* center grouped choice buttons */
}
```

---

## `.choices-locked`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components-choice.css, src\styles\components.css, src\styles\themes.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
  p.choice[data-tags] > .choice-link.faded,
  p.choice[data-tags].faded:not(:has(> .choice-link))`, `/* Nevybrané / zamčené volby */
.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
p.choice[data-tags] > .choice-link.faded,
p.choice[data-tags].faded:not(:has(> .choice-link))`, `.choices-locked .choice-link:not(.chosen)`
- **Selector:** `.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
  p.choice[data-tags] > .choice-link.faded,
  p.choice[data-tags].faded:not(:has(> .choice-link))`
- **CSS body (primary):**
```css
.choices-locked {
box-shadow: none;
}
```

---

## `.choices-shown`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, src\styles\components.css, src\styles\themes.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.SYNTHOMAREADER:not(.choices-shown) .choice-link`, `.SYNTHOMAREADER:not(.choices-shown) .choice-box`, `.SYNTHOMAREADER.choices-shown .choice-link.choice-appear`
- **Usage sample:**
  - `app\chapter\[id]\ChapterReaderArticle.tsx`
- **Selector:** `.SYNTHOMAREADER.choices-shown .choice-link.choice-appear`
- **CSS body (primary):**
```css
.choices-shown {
opacity: 0; transform: translateY(6px);
}
```

---

## `.chosen`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components-choice.css, src\styles\components.css, src\styles\themes.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
  p.choice[data-tags] > .choice-link.faded,
  p.choice[data-tags].faded:not(:has(> .choice-link))`
- **Selector:** `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`
- **CSS body (primary):**
```css
.chosen {
border-color: var(--choice-accent, var(--accent-secondary, #0ff));
    box-shadow: 0 0 12px var(--choice-accent, var(--accent-secondary, #0ff));
}
```

---

## `.continue-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform, color-mix
- **Selectors (sample):** `.continue-btn`, `.continue-btn:hover`, `.continue-btn:active`
- **Selector:** `.continue-btn`
- **CSS body (primary):**
```css
.continue-btn {
background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
    border: 2px solid var(--accent-primary);
    color: var(--text-primary);
    padding: 12px 24px; border-radius: var(--border-radius-medium, 10px);
    font-size: 1.1rem; font-weight: 600;
    font-family: 'Synthoma', 'Text03', Inter, system-ui, sans-serif;
    cursor: pointer; transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
    text-transform: uppercase; letter-spacing: 1px;
    box-shadow: 0 4px 15px color-mix(in srgb, var(--accent-primary) 30%, transparent);
    position: r…
}
```

---

## `.control-center__backdrop`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `}

.control-center__backdrop`, `.control-center__backdrop.is-visible`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `}

.control-center__backdrop`
- **CSS body (primary):**
```css
.control-center__backdrop {
position: fixed;
  inset: 0;
  z-index: 3998;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: rgb(0 0 0 / 0.68);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--os-motion-normal) var(--os-ease-standard);
}
```

---

## `.control-center__body`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.control-center__body`, `.control-center__body section`, `.control-center__body h3`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.control-center__body h3`
- **CSS body (primary):**
```css
.control-center__body {
margin: 18px 0 0; color: var(--cy-text-dim); font: 800 var(--cy-font-micro)/1.3 var(--cy-font-mono); text-transform: uppercase;
}
```

---

## `.control-center__confirm`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.control-center__confirm`, `.control-center__confirm > div`, `.control-center__confirm h2`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.control-center__confirm > div`
- **CSS body (primary):**
```css
.control-center__confirm {
width: min(100%, 380px); padding: 18px; border: 1px solid var(--cy-line-strong); background: var(--cy-surface-1); box-shadow: var(--cy-shadow);
}
```

---

## `.control-center__presets`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.control-center__presets`, `.control-center__presets > div:first-child`, `.control-center__presets h3`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.control-center__presets button[aria-pressed="true"]`
- **CSS body (primary):**
```css
.control-center__presets {
background: var(--cy-button-active); color: var(--cy-accent-primary); box-shadow: inset 0 -3px 0 var(--cy-accent-primary);
}
```

---

## `.control-center__segments`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.control-center__tabs,
.control-center__segments,
.control-center__footer`, `.control-center__tabs button,
.control-center__segments button,
.control-center__footer button`, `.control-center__tabs button[aria-selected="true"],
.control-center__segments button[aria-pressed="true"]`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.control-center__tabs button[aria-selected="true"],
.control-center__segments button[aria-pressed="true"]`
- **CSS body (primary):**
```css
.control-center__segments {
background: var(--cy-button-active); color: var(--cy-accent-primary); box-shadow: inset 0 -3px 0 var(--cy-accent-primary);
}
```

---

## `.control-center__tabs`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.control-center__tabs,
.control-center__segments,
.control-center__footer`, `.control-center__tabs`, `.control-center__tabs button,
.control-center__segments button,
.control-center__footer button`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.control-center__tabs button[aria-selected="true"],
.control-center__segments button[aria-pressed="true"]`
- **CSS body (primary):**
```css
.control-center__tabs {
background: var(--cy-button-active); color: var(--cy-accent-primary); box-shadow: inset 0 -3px 0 var(--cy-accent-primary);
}
```

---

## `.control-center__toggle`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.control-center__toggle`, `.control-center__toggle[aria-pressed="true"]`, `.control-center__toggle span:last-child`
- **Usage sample:**
  - `app\components\ControlCenterAudio.tsx`
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.control-center__toggle[aria-pressed="true"]`
- **CSS body (primary):**
```css
.control-center__toggle {
border-color: var(--cy-line-strong); box-shadow: inset 3px 0 0 var(--cy-accent-primary);
}
```

---

## `.control-panel`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css, src\styles\reader.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `/* Targeted no-select: only on interactive/UI elements, not readable content */
  button,
  .choice-link,
  .control-panel,
  #control-panel,
  #toggle-panel-btn,
  .no-select`, `}
  
  #control-panel.control-panel, .reader-controls`, `/* Control panel fixed sizing regardless of global font scaling */
  #control-panel.control-panel, #control-panel`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.control-panel.visible`
- **CSS body (primary):**
```css
.control-panel {
opacity: 1; pointer-events: auto; transform: none;
}
```

---

## `.corrupt`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, public\styles.css, src\styles\effects.css, src\styles\reader.css
- **Used in:** 309 occurrences across 21 files
- **Effect properties:** text-shadow, animation
- **Animations:** corruptJitter
- **Selectors (sample):** `}
.corrupt`, `/* =========================
     Text-only FX in Reader – no row bg.
     ========================= */
  .SYNTHOMAREADER .chapter-content :where(span, em, strong)[class*="fx-"], .SYNTHOMAREADER .chapter-content :where(span, em, strong)[class*="effect-"],
  .SYNTHOMAREADER .chapter-content :where(span, em, strong).neon-blood, .SYNTHOMAREADER .chapter-content :where(span, em, strong).corrupt,
  .SYNTHOMAREADER .chapter-content :where(span, em, strong).datastream`, `/* --- Typografická oprava: zachovat mezeru před zvýrazněným slovem po 404 --- */
/* Pokud následuje zvýrazněný span hned po 404, vlož před jeho obsah nezalomitelnou mezeru */
.halo.fx-flicker + .corrupt.fx-underline::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
- **Selector:** `}
.corrupt`
- **CSS body (primary):**
```css
.corrupt {
text-shadow: 1px 0 var(--accent-primary), -1px 0 var(--accent-secondary);
  animation: corruptJitter 1.2s steps(3, jump-none) infinite;
}
```

---

## `.coverHero`

- **Status:** defined
- **CSS files:** app\books\books.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.coverHero`
- **Selector:** `.coverHero`
- **CSS body (primary):**
```css
.coverHero {
position: relative;
  width: 100%;
  aspect-ratio: 21 / 9;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
}
```

---

## `.coverThumb`

- **Status:** defined
- **CSS files:** app\books\books.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.coverThumb`
- **Selector:** `.coverThumb`
- **CSS body (primary):**
```css
.coverThumb {
position: relative;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
}
```

---

## `.cp-close`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `#control-panel .cp-close`, `#control-panel .cp-close:hover`, `#control-panel .cp-close`
- **Selector:** `#control-panel .cp-close`
- **CSS body (primary):**
```css
.cp-close {
background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 14px;
    padding: 2px 6px;
    cursor: pointer;
    border-radius: 4px;
    line-height: 1;
    opacity: 0.6;
    transition: opacity 0.15s ease;
}
```

---

## `.cp-kicker`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`, `#control-panel .cp-kicker`
- **Selector:** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`
- **CSS body (primary):**
```css
.cp-kicker {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.cp-section-header`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`, `#control-panel .cp-section-header`, `#control-panel .cp-section-header h3`
- **Selector:** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`
- **CSS body (primary):**
```css
.cp-section-header {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.cp-status`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`, `#control-panel .cp-status`
- **Selector:** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`
- **CSS body (primary):**
```css
.cp-status {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.craft-recipe-row`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.craft-recipe-row.is-pocket-relevant`, `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`, `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`
- **Selector:** `.craft-recipe-row.is-locked,
.craft-recipe-row.is-hidden,
.void-room-row.is-locked`
- **CSS body (primary):**
```css
.craft-recipe-row {
opacity: 0.68;
  filter: saturate(0.75);
}
```

---

## `.craft-status-pill`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\void.css
- **Used in:** 6 occurrences across 3 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-room-badge,
.craft-status-pill,
.resource-pill`, `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`, `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketPanel.tsx`
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`
- **CSS body (primary):**
```css
.craft-status-pill {
border-color: rgba(246, 255, 0, 0.42);
  box-shadow: 0 0 14px rgba(246, 255, 0, 0.12);
}
```

---

## `.crt`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.crt.fog .generated-image`, `.crt`, `.crt::after`
- **Selector:** `.crt.fog .generated-image`
- **CSS body (primary):**
```css
.crt {
filter: var(--filter-primary, none);
}
```

---

## `.css`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, public\synth-gate.css, src\styles\auth.css, src\styles\components-choice.css, src\styles\components-dialog.css, src\styles\components.css, src\styles\cyklus\feedback-header.css, src\styles\cyklus\legacy.css, src\styles\game.css, src\styles\paywall.css, src\styles\reader.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, text-clip/gradient
- **Selectors (sample):** `﻿/* auth.css — Auth pages, login, register styles */

/* =========================
   AUTH PAGES
   ========================= */
.auth-page`, `/* =========================================================
   SYNTHOMA CHOICE STYLES
   Separated from components.css to reduce file size.
   ========================================================= */

/* Default / X */
p.choice[data-tags]`, `/* =========================================================
   SYNTHOMA DIALOG & LOG STYLES
   Separated from components.css to reduce file size.
   ========================================================= */

/* Glitchka dialog – modrorůžový gradient */
.dialogG`
- **Selector:** `/* =========================================================
   SYNTHOMA DIALOG & LOG STYLES
   Separated from components.css to reduce file size.
   ========================================================= */

/* Glitchka dialog – modrorůžový gradient */
.dialogG`
- **CSS body (primary):**
```css
.css {
position: relative;
  background: linear-gradient(90deg, var(--speaker-glitchka) 0%, var(--speaker-glitchka-secondary) 50%, var(--text-accent-primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--speaker-glitchka);
  text-shadow: none;
  font-family: 'Text03i', monospace;
  font-weight: 700; font-style: italic;
  font-size: calc(1.15rem * var(--font-size-multiplier));
}
```

---

## `.cy-kicker`

- **Status:** defined
- **CSS files:** src\styles\cyklus\foundation.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cy-kicker,
.cy-system-label`
- **Selector:** `.cy-kicker,
.cy-system-label`
- **CSS body (primary):**
```css
.cy-kicker {
margin: 0;
  color: var(--cy-cyan-soft);
  font-family: var(--cy-font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
```

---

## `.cy-status-dot`

- **Status:** defined
- **CSS files:** src\styles\cyklus\foundation.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cy-status-dot`
- **Selector:** `.cy-status-dot`
- **CSS body (primary):**
```css
.cy-status-dot {
display: inline-block;
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 8px currentColor;
}
```

---

## `.cy-system-label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\foundation.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cy-kicker,
.cy-system-label`, `.cy-system-label`
- **Selector:** `.cy-kicker,
.cy-system-label`
- **CSS body (primary):**
```css
.cy-system-label {
margin: 0;
  color: var(--cy-cyan-soft);
  font-family: var(--cy-font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
```

---

## `.cy-terminal-button`

- **Status:** defined
- **CSS files:** src\styles\cyklus\foundation.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.cy-terminal-button`, `.cy-terminal-button:hover:not(:disabled)`, `.cy-terminal-button:disabled`
- **Selector:** `.cy-terminal-button`
- **CSS body (primary):**
```css
.cy-terminal-button {
display: inline-flex;
  min-width: 0;
  min-height: var(--cy-tap);
  align-items: center;
  justify-content: center;
  gap: var(--cy-space-2);
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--cy-line);
  border-radius: var(--cy-radius-sm);
  background: var(--cy-button-bg);
  color: var(--cy-text);
  font: 700 0.78rem/1.2 var(--cy-font-mono);
  letter-spacing: 0.08em;
  text-align: center;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color var(--cy-ease), background var(--cy-ease), color var(--cy-ease), box-shadow var(--cy-ease);
}
```

---

## `.cy-terminal-button--danger`

- **Status:** defined
- **CSS files:** src\styles\cyklus\foundation.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cy-terminal-button--danger`
- **Selector:** `.cy-terminal-button--danger`
- **CSS body (primary):**
```css
.cy-terminal-button--danger {
border-color: var(--cy-line-yellow);
  background: color-mix(in srgb, var(--cy-accent-warning) 5.5%, transparent);
  color: var(--cy-yellow);
}
```

---

## `.cy-terminal-button--primary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\foundation.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cy-terminal-button--primary`
- **Selector:** `.cy-terminal-button--primary`
- **CSS body (primary):**
```css
.cy-terminal-button--primary {
border-color: var(--cy-line-magenta);
  background: color-mix(in srgb, var(--cy-accent-memory) 6.5%, transparent);
  color: var(--cy-magenta-soft);
}
```

---

## `.cyklus-active-objective`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-root--swiping :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective),
  .cyklus-root--outcome-visible :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective)`, `.cyklus-root--swiping :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective),
  .cyklus-root--outcome-visible :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective)`, `.cyklus-root--playing > .cyklus-mobile-hud,
  .cyklus-active-objective`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `/* Status rails, objective log, diagnostics, and bottom navigation. */

.cyklus-active-objective`
- **CSS body (primary):**
```css
.cyklus-active-objective {
position: relative;
  width: 100%;
  max-width: 680px;
  padding: var(--cy-space-2) var(--cy-space-3);
  border: 0;
  border-left: 2px solid var(--cy-cyan);
  border-radius: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--cy-accent-system) 6%, transparent), transparent 80%);
  text-align: left;
}
```

---

## `.cyklus-active-objective--popover`

- **Status:** defined
- **CSS files:** src\styles\cyklus\trace-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-stage > .cyklus-active-objective--popover`, `.cyklus-active-objective--popover::after`, `.cyklus-active-objective--popover .cyklus-active-objective__body`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-stage > .cyklus-active-objective--popover`
- **CSS body (primary):**
```css
.cyklus-active-objective--popover {
position: absolute;
    inset: var(--cy-space-2) var(--cy-space-2) auto auto;
    z-index: var(--cy-z-sheet);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    width: min(420px, calc(100% - (2 * var(--cy-space-2))));
    max-width: 420px;
    max-height: calc(100% - (2 * var(--cy-space-2)));
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--cy-line-strong);
    border-left: 2px solid var(--cy-cyan);
    border-radius: 0;
    background:
      repeating-linear-gradient(0deg, transparent 0 3px, var(--cy-scanline-color) 3px 4px),
      var(--cy-panel-solid);
    …
}
```

---

## `.cyklus-active-objective__body`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\trace-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-active-objective__details,
.cyklus-active-objective__body`, `.cyklus-active-objective__body`, `.cyklus-active-objective--mobile-expanded .cyklus-active-objective__body`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-active-objective__body`
- **CSS body (primary):**
```css
.cyklus-active-objective__body {
padding: 0.45rem 0.6rem;
    border-left: 2px solid var(--cy-accent-system);
    background: linear-gradient(90deg, color-mix(in srgb, var(--cy-accent-system) 5%, transparent), transparent 82%);
}
```

---

## `.cyklus-active-objective__focus`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-active-objective__focus`, `.cyklus-active-objective__focus`, `.cyklus-active-objective__hint,
  .cyklus-active-objective__focus`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-active-objective__focus`
- **CSS body (primary):**
```css
.cyklus-active-objective__focus {
display: inline-block;
  margin-top: var(--cy-space-1);
  color: var(--cy-magenta-soft);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

---

## `.cyklus-active-objective__summary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\interactions.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-active-objective__summary`, `.cyklus-active-objective__summary`, `.cyklus-active-objective__summary::-webkit-details-marker`
- **Selector:** `.cyklus-active-objective__summary`
- **CSS body (primary):**
```css
.cyklus-active-objective__summary {
min-height: 44px;
    align-items: center;
    padding: 0.55rem 0.7rem;
    border-left: 2px solid var(--cy-accent-memory);
    background: linear-gradient(90deg, color-mix(in srgb, var(--cy-accent-memory) 6%, transparent), transparent 82%);
    color: var(--cy-magenta-soft);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: 0.06em;
    cursor: pointer;
    list-style: none;
}
```

---

## `.cyklus-behavioral`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-history,
  .cyklus-end-summary__full-log,
  .cyklus-stat-popup__body,
  .cyklus-diag-drawer,
  .cyklus-discovery,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-reward
),
.cyklus-void-page :is(
  .cyklus-void-client-status,
  .void-hub-tab-panel,
  [role="tabpanel"],
  .cyklus-pocket-panel,
  .cyklus-progression-dashboard
)`, `/* ── BEHAVIORAL ANALYSIS ─────────────────────────────────────────────────── */

.cyklus-behavioral`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-behavioral {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-behavioral__text`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-behavioral__text {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-behavioral__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-behavioral__title`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-behavioral__title`
- **CSS body (primary):**
```css
.cyklus-behavioral__title {
font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: 0.5rem;
}
```

---

## `.cyklus-bottom-nav`

- **Status:** defined
- **CSS files:** src\styles\cyklus\compact-mobile.css, src\styles\cyklus\hud.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-bottom-nav`, `.cyklus-bottom-nav`, `.cyklus-bottom-nav::before`
- **Selector:** `.cyklus-bottom-nav`
- **CSS body (primary):**
```css
.cyklus-bottom-nav {
position: relative;
  z-index: var(--cy-z-hud);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: 100%;
  min-height: var(--cy-bottom-height);
  max-height: calc(var(--cy-bottom-height) + env(safe-area-inset-bottom));
  padding: 1px 0 0;
  border: 0;
  border-top: 1px solid var(--cy-line-strong);
  background: color-mix(in srgb, var(--cy-surface-1) 98.5%, transparent);
  box-shadow: var(--cy-shadow-compact);
}
```

---

## `.cyklus-bottom-nav__btn`

- **Status:** defined
- **CSS files:** src\styles\cyklus\compact-mobile.css, src\styles\cyklus\hud.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-bottom-nav__btn`, `.cyklus-bottom-nav__btn::after`, `.cyklus-bottom-nav__btn:not(.cyklus-pocket-trigger) .cyklus-bottom-nav__label`
- **Selector:** `.cyklus-bottom-nav__btn.is-active .cyklus-bottom-nav__icon`
- **CSS body (primary):**
```css
.cyklus-bottom-nav__btn {
transform: none;
}
```

---

## `.cyklus-bottom-nav__icon`

- **Status:** defined
- **CSS files:** src\styles\cyklus\compact-mobile.css, src\styles\cyklus\hud.css, src\styles\cyklus\responsive.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-bottom-nav__icon`, `.cyklus-bottom-nav__btn.is-active .cyklus-bottom-nav__icon`, `.cyklus-bottom-nav__icon`
- **Usage sample:**
  - `src\components\cyklus\CyklusBottomNav.tsx`
- **Selector:** `.cyklus-bottom-nav__btn.is-active .cyklus-bottom-nav__icon`
- **CSS body (primary):**
```css
.cyklus-bottom-nav__icon {
transform: none;
}
```

---

## `.cyklus-bottom-sheet`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** cyklus-os-sheet-in
- **Selectors (sample):** `.cyklus-bottom-sheet`, `.cyklus-bottom-sheet`, `.cyklus-bottom-sheet::before`
- **Usage sample:**
  - `src\components\cyklus\CyklusBottomSheet.tsx`
- **Selector:** `.cyklus-bottom-sheet`
- **CSS body (primary):**
```css
.cyklus-bottom-sheet {
position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  width: 100%;
  max-height: min(88dvh, 760px);
  padding-bottom: env(safe-area-inset-bottom);
  overflow: hidden;
  border: 1px solid var(--cy-line-strong);
  border-bottom: 0;
  border-radius: var(--cy-radius) var(--cy-radius) 0 0;
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow), var(--cy-glow-cyan);
  animation: cyklus-os-sheet-in 180ms ease-out;
}
```

---

## `.cyklus-bottom-sheet__backdrop`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `}

/* ── MOBILE COMPONENTS (hidden on desktop) ──────────────────────────────────── */

.cyklus-mobile-hud,
.cyklus-bottom-nav,
.cyklus-bottom-sheet__backdrop`, `/* ── BOTTOM SHEET BASE ──────────────────────────────────────────────────────── */

.cyklus-bottom-sheet__backdrop`, `}

/* Bottom sheet */

.cyklus-bottom-sheet__backdrop`
- **Usage sample:**
  - `src\components\cyklus\CyklusBottomSheet.tsx`
- **Selector:** `/* ── BOTTOM SHEET BASE ──────────────────────────────────────────────────────── */

.cyklus-bottom-sheet__backdrop`
- **CSS body (primary):**
```css
.cyklus-bottom-sheet__backdrop {
position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
```

---

## `.cyklus-bottom-sheet__dismiss`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter, color-mix
- **Selectors (sample):** `.cyklus-overlay__backdrop,
.cyklus-bottom-sheet__dismiss,
.cyklus-stat-popup-backdrop`, `.cyklus-bottom-sheet__dismiss`
- **Usage sample:**
  - `src\components\cyklus\CyklusBottomSheet.tsx`
- **Selector:** `.cyklus-overlay__backdrop,
.cyklus-bottom-sheet__dismiss,
.cyklus-stat-popup-backdrop`
- **CSS body (primary):**
```css
.cyklus-bottom-sheet__dismiss {
position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(ellipse at 18% 12%, color-mix(in srgb, var(--cy-accent-system) 7%, transparent), transparent 42%),
    radial-gradient(ellipse at 84% 88%, color-mix(in srgb, var(--cy-accent-memory) 6%, transparent), transparent 38%),
    var(--cy-overlay-backdrop);
  cursor: default;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
```

---

## `.cyklus-btn`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 6 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `.cyklus-preview .cyklus-btn`, `.cyklus-preview .cyklus-btn:hover:not(:disabled)`, `.cyklus-preview .cyklus-btn:focus-visible`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-btn`
- **CSS body (primary):**
```css
.cyklus-btn {
flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.85rem 0.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-tertiary);
  background: var(--bg-glass);
  color: var(--text-primary);
  font-family: var(--font-family-primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}
```

---

## `.cyklus-btn--no`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-btn--no`, `.cyklus-btn--no:hover:not(:disabled)`, `.cyklus-card__preview--highlight .cyklus-btn--no`
- **Selector:** `.cyklus-card__preview--highlight .cyklus-btn--no`
- **CSS body (primary):**
```css
.cyklus-btn--no {
border-color: rgba(255, 107, 107, 0.55);
  box-shadow: 0 0 14px rgba(255, 107, 107, 0.15);
}
```

---

## `.cyklus-btn--primary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-end-summary__actions .cyklus-btn--primary`, `.cyklus-end-summary__actions .cyklus-btn--primary`, `}

.cyklus-btn--primary`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__actions .cyklus-btn--primary`
- **CSS body (primary):**
```css
.cyklus-btn--primary {
grid-column: 1 / -1;
  border-bottom: 2px solid var(--cy-magenta);
  background: color-mix(in srgb, var(--cy-accent-memory) 9%, var(--cy-panel-solid));
}
```

---

## `.cyklus-btn--yes`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-btn--yes`, `.cyklus-btn--yes:hover:not(:disabled)`, `.cyklus-card__preview--highlight .cyklus-btn--yes`
- **Selector:** `.cyklus-card__preview--highlight .cyklus-btn--yes`
- **CSS body (primary):**
```css
.cyklus-btn--yes {
border-color: rgba(123, 237, 159, 0.55);
  box-shadow: 0 0 14px rgba(123, 237, 159, 0.15);
}
```

---

## `.cyklus-btn__label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-btn__label`, `.cyklus-btn__label`, `.cyklus-card,
.cyklus-card > *,
.cyklus-card-scene,
.cyklus-card-scene > *,
.cyklus-card :is(p, blockquote, pre, code, span, strong),
.cyklus-card__metadata,
.cyklus-card__title,
.cyklus-card__preview,
.cyklus-preview,
.cyklus-preview__hint,
.cyklus-btn__label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-btn__label`
- **CSS body (primary):**
```css
.cyklus-btn__label {
max-width: 100%;
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: 0.04em;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}
```

---

## `.cyklus-build__bar`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-build__bar`, `.cyklus-build__bar,
.cyklus-discovery__bar`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-build__bar,
.cyklus-discovery__bar`
- **CSS body (primary):**
```css
.cyklus-build__bar {
height: 3px;
  border-radius: 0;
  background: color-mix(in srgb, var(--cy-text-dim) 24%, transparent);
}
```

---

## `.cyklus-build__fill`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-build__fill`, `.cyklus-build__fill,
.cyklus-discovery__fill`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-build__fill`
- **CSS body (primary):**
```css
.cyklus-build__fill {
height: 100%;
  background: linear-gradient(90deg, #74b9ff, #a29bfe);
  transition: width 0.3s ease;
}
```

---

## `.cyklus-build__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-build__title,
.cyklus-discovery__title,
.cyklus-goal__title`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-build__title,
.cyklus-discovery__title,
.cyklus-goal__title`
- **CSS body (primary):**
```css
.cyklus-build__title {
font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}
```

---

## `.cyklus-build__toggle`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-build__toggle`, `/* Run structural panels */

.cyklus-footer__button,
.cyklus-build__toggle,
.cyklus-goals__reroll,
.cyklus-pocket__activate`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `/* Run structural panels */

.cyklus-footer__button,
.cyklus-build__toggle,
.cyklus-goals__reroll,
.cyklus-pocket__activate`
- **CSS body (primary):**
```css
.cyklus-build__toggle {
min-height: var(--cy-tap);
  border: 1px solid var(--cy-line);
  border-radius: var(--cy-radius-sm);
  background: color-mix(in srgb, var(--cy-accent-system) 3.5%, transparent);
  color: var(--cy-cyan-soft);
  font-size: var(--cy-font-control);
  line-height: 1.3;
  font-family: var(--cy-font-mono);
  letter-spacing: 0.06em;
}
```

---

## `.cyklus-build__variant`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-build__variant`, `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **CSS body (primary):**
```css
.cyklus-build__variant {
border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-card`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-card`, `.cyklus-card`, `/* The swipe card is the primary gameplay surface. */

.cyklus-card`
- **Selector:** `.cyklus-card`
- **CSS body (primary):**
```css
.cyklus-card {
gap: var(--cy-space-2);
    width: 100%;
    max-width: none;
    height: 100%;
    min-height: 0;
    padding: var(--cy-space-3);
    border-radius: var(--cy-radius);
    box-shadow: var(--cy-shadow-compact);
}
```

---

## `.cyklus-card--fly-no`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-card-fly-no
- **Selectors (sample):** `.cyklus-card--fly-yes,
.cyklus-card--fly-no`, `.cyklus-card--fly-yes,
  .cyklus-card--fly-no`, `.cyklus-card--fly-no`
- **Selector:** `.cyklus-card--fly-no`
- **CSS body (primary):**
```css
.cyklus-card--fly-no {
animation: cyklus-card-fly-no 0.28s ease-in forwards;
}
```

---

## `.cyklus-card--fly-yes`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Selectors (sample):** `.cyklus-card--fly-yes,
.cyklus-card--fly-no`, `.cyklus-card--fly-yes,
  .cyklus-card--fly-no`, `.cyklus-card--fly-yes`
- **Selector:** `.cyklus-card--fly-yes,
.cyklus-card--fly-no`
- **CSS body (primary):**
```css
.cyklus-card--fly-yes {
animation-duration: 220ms;
}
```

---

## `.cyklus-card--outcome`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-card-pulse
- **Selectors (sample):** `.cyklus-card--outcome`
- **Selector:** `.cyklus-card--outcome`
- **CSS body (primary):**
```css
.cyklus-card--outcome {
animation: cyklus-card-pulse 0.4s ease;
}
```

---

## `.cyklus-card--swipe-no`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-card--swipe-no .cyklus-preview--left::after,
.cyklus-card--swipe-yes .cyklus-preview--right::after`, `.cyklus-card--swipe-yes,
.cyklus-card--swipe-no`, `.cyklus-card--swipe-no`
- **Selector:** `.cyklus-card--swipe-no`
- **CSS body (primary):**
```css
.cyklus-card--swipe-no {
border-left-color: var(--cy-cyan);
  box-shadow: -16px 0 34px color-mix(in srgb, var(--cy-accent-system) 13%, transparent), var(--cy-shadow);
}
```

---

## `.cyklus-card--swipe-yes`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.cyklus-card--swipe-no .cyklus-preview--left::after,
.cyklus-card--swipe-yes .cyklus-preview--right::after`, `.cyklus-card--swipe-yes,
.cyklus-card--swipe-no`, `.cyklus-card--swipe-yes`
- **Selector:** `.cyklus-card--swipe-yes,
.cyklus-card--swipe-no`
- **CSS body (primary):**
```css
.cyklus-card--swipe-yes {
box-shadow: var(--cy-shadow);
  transition: transform 32ms linear, border-color 40ms linear, box-shadow 40ms linear;
}
```

---

## `.cyklus-card-art__footer`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-card-art__footer`, `.cyklus-poster-viewer .cyklus-card-art__footer`, `.cyklus-card-art__footer`
- **Usage sample:**
  - `src\components\cyklus\CyklusCardPoster.tsx`
- **Selector:** `.cyklus-card-art__footer`
- **CSS body (primary):**
```css
.cyklus-card-art__footer {
position: relative;
  z-index: 1;
  display: grid;
  min-width: 0;
  min-height: 60px;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px;
  padding: 8px 12px max(8px, env(safe-area-inset-bottom));
  place-items: center;
  border-top: 1px solid color-mix(in srgb, var(--cy-cyan), transparent 65%);
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--cy-cyan), transparent 96%), transparent),
    var(--cy-panel-solid);
}
```

---

## `.cyklus-card-art__image`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, transition
- **Selectors (sample):** `.cyklus-card-art__image`, `.cyklus-card-art__transform-layer[data-geometry-ready="true"] .cyklus-card-art__image`, `.cyklus-card-art--fullscreen .cyklus-card-art__image`
- **Usage sample:**
  - `src\components\cyklus\CyklusCardPoster.tsx`
- **Selector:** `.cyklus-card-art__image`
- **CSS body (primary):**
```css
.cyklus-card-art__image {
position: absolute;
  inset: 0;
  display: block;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: contain;
  object-position: var(--card-art-position, center);
  filter: var(--cyklus-media-theme-filter, none);
  transition: filter 180ms ease;
  -webkit-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
}
```

---

## `.cyklus-card-art__reveal`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform, color-mix
- **Selectors (sample):** `.cyklus-card-art__reveal`, `.cyklus-card-art__reveal:hover`, `.cyklus-card-art__reveal`
- **Usage sample:**
  - `src\components\cyklus\CyklusCardPoster.tsx`
- **Selector:** `.cyklus-card-art__reveal`
- **CSS body (primary):**
```css
.cyklus-card-art__reveal {
width: min(100%, 380px);
  min-height: 48px;
  margin: 0;
  padding: 0.7rem 1rem;
  border: 1px solid var(--cy-cyan);
  border-radius: var(--cy-radius-sm);
  background: color-mix(in srgb, var(--cy-cyan), var(--cy-panel-solid) 92%);
  color: var(--cy-cyan-soft);
  font: 800 0.72rem/1 var(--cy-font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 0 14px color-mix(in srgb, var(--cy-cyan), transparent 84%);
}
```

---

## `.cyklus-card-art__transform-layer`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-card-art__transform-layer`, `.cyklus-card-art__transform-layer[data-geometry-ready="true"] .cyklus-card-art__image`
- **Usage sample:**
  - `src\components\cyklus\CyklusCardPoster.tsx`
- **Selector:** `.cyklus-card-art__transform-layer`
- **CSS body (primary):**
```css
.cyklus-card-art__transform-layer {
position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: var(--poster-base-width, calc(100% - 8px));
  height: var(--poster-base-height, calc(100% - 8px));
  place-items: center;
  transform: translate3d(calc(-50% + var(--poster-x, 0px)), calc(-50% + var(--poster-y, 0px)), 0) scale(var(--poster-scale, 1));
  transform-origin: center center;
  will-change: transform;
}
```

---

## `.cyklus-card-overlay`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.cyklus-card-overlay`, `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`, `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`
- **Selector:** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`
- **CSS body (primary):**
```css
.cyklus-card-overlay {
position: relative;
  inset: auto;
  z-index: 1;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
  grid-template-rows: auto minmax(0, 1fr) auto;
  margin: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  border: 1px solid var(--cy-line-strong);
  border-radius: var(--cy-radius);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow), var(--cy-glow-cyan);
  color: var(--cy-text);
  scrollbar-color: var(--cy-line-strong) var(--cy-scrollbar-track);
  scrollbar-width: thin;
  transform: none;
}
```

---

## `.cyklus-card-overlay--outcome`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-card-overlay--summary .cyklus-card-overlay__panel,
.cyklus-card-overlay--outcome .cyklus-card-overlay__panel`
- **Selector:** `.cyklus-card-overlay--summary .cyklus-card-overlay__panel,
.cyklus-card-overlay--outcome .cyklus-card-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-card-overlay--outcome {
border-color: var(--cy-line-magenta);
  box-shadow: var(--cy-shadow), var(--cy-glow-magenta);
}
```

---

## `.cyklus-card-overlay--summary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-card-overlay--summary .cyklus-card-overlay__panel,
.cyklus-card-overlay--outcome .cyklus-card-overlay__panel`
- **Selector:** `.cyklus-card-overlay--summary .cyklus-card-overlay__panel,
.cyklus-card-overlay--outcome .cyklus-card-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-card-overlay--summary {
border-color: var(--cy-line-magenta);
  box-shadow: var(--cy-shadow), var(--cy-glow-magenta);
}
```

---

## `.cyklus-card-overlay--warning`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-card-overlay--warning .cyklus-card-overlay__panel`
- **Selector:** `.cyklus-card-overlay--warning .cyklus-card-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-card-overlay--warning {
border-color: var(--cy-line-yellow);
  box-shadow: var(--cy-shadow), var(--cy-glow-yellow);
}
```

---

## `.cyklus-card-overlay__backdrop`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter, color-mix
- **Selectors (sample):** `.cyklus-card-overlay__backdrop`
- **Usage sample:**
  - `src\components\cyklus\CyklusCardOverlay.tsx`
- **Selector:** `.cyklus-card-overlay__backdrop`
- **CSS body (primary):**
```css
.cyklus-card-overlay__backdrop {
position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: color-mix(in srgb, var(--cy-bg) 66%, transparent);
  cursor: default;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
}
```

---

## `.cyklus-card-overlay__panel`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`, `.cyklus-card-overlay--warning .cyklus-card-overlay__panel`, `.cyklus-card-overlay--summary .cyklus-card-overlay__panel,
.cyklus-card-overlay--outcome .cyklus-card-overlay__panel`
- **Selector:** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`
- **CSS body (primary):**
```css
.cyklus-card-overlay__panel {
position: relative;
  inset: auto;
  z-index: 1;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
  grid-template-rows: auto minmax(0, 1fr) auto;
  margin: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  border: 1px solid var(--cy-line-strong);
  border-radius: var(--cy-radius);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow), var(--cy-glow-cyan);
  color: var(--cy-text);
  scrollbar-color: var(--cy-line-strong) var(--cy-scrollbar-track);
  scrollbar-width: thin;
  transform: none;
}
```

---

## `.cyklus-card-overlay__surface`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`, `.cyklus-card-overlay__surface,
  .cyklus-card-overlay__panel,
  .cyklus-card-overlay .cyklus-system-modal,
  .cyklus-card-overlay .cyklus-cycle-notice,
  .cyklus-card-overlay .cyklus-outcome`
- **Selector:** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`
- **CSS body (primary):**
```css
.cyklus-card-overlay__surface {
position: relative;
  inset: auto;
  z-index: 1;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
  grid-template-rows: auto minmax(0, 1fr) auto;
  margin: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  border: 1px solid var(--cy-line-strong);
  border-radius: var(--cy-radius);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow), var(--cy-glow-cyan);
  color: var(--cy-text);
  scrollbar-color: var(--cy-line-strong) var(--cy-scrollbar-track);
  scrollbar-width: thin;
  transform: none;
}
```

---

## `.cyklus-card-scene`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-card-scene`, `.cyklus-card-scene`, `.cyklus-card-scene::after`
- **Selector:** `.cyklus-card-scene`
- **CSS body (primary):**
```css
.cyklus-card-scene {
position: relative;
  min-height: 0;
  margin: 0;
  padding: var(--cy-space-3) var(--cy-space-3) var(--cy-space-3) var(--cy-space-4);
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  touch-action: pan-y;
  border: 0;
  border-left: 1px solid var(--card-accent);
  background: color-mix(in srgb, var(--cy-surface-1) 46%, transparent);
  color: var(--cy-text);
  font-size: 0.96rem;
  line-height: 1.62;
  scrollbar-width: thin;
  scrollbar-color: var(--cy-line-strong) transparent;
}
```

---

## `.cyklus-card__category`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\effects.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-card__category`, `.cyklus-card__category::before`, `.cyklus-card__category,
  .cyklus-card__context`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-card__category::before`
- **CSS body (primary):**
```css
.cyklus-card__category {
width: 5px;
  height: 5px;
  border-radius: 0;
  box-shadow: 0 0 8px currentColor;
}
```

---

## `.cyklus-card__context`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-card__context`, `.cyklus-card__context span + span::before`, `.cyklus-card__category,
  .cyklus-card__context`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-card__context`
- **CSS body (primary):**
```css
.cyklus-card__context {
display: flex;
  min-width: 0;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: var(--cy-space-1) var(--cy-space-2);
  color: var(--cy-text-dim);
  font-size: 0.6rem;
  letter-spacing: 0.08em;
  text-align: right;
  text-transform: uppercase;
}
```

---

## `.cyklus-card__overload`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** cyklus-overload-pulse
- **Selectors (sample):** `.cyklus-card__restart-badge,
.cyklus-card__overload`, `.cyklus-card__restart-badge,
.cyklus-card__overload`, `.cyklus-card__overload`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-card__overload`
- **CSS body (primary):**
```css
.cyklus-card__overload {
display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid rgba(255, 80, 80, 0.45);
  background: rgba(255, 40, 40, 0.12);
  animation: cyklus-overload-pulse 2s infinite;
}
```

---

## `.cyklus-card__preview--highlight`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-os-choice-pulse
- **Selectors (sample):** `.cyklus-card__preview--highlight .cyklus-btn`, `.cyklus-card,
  .cyklus-card__preview--highlight .cyklus-btn`, `.cyklus-card__preview--highlight .cyklus-btn`
- **Selector:** `.cyklus-card__preview--highlight .cyklus-btn`
- **CSS body (primary):**
```css
.cyklus-card__preview--highlight {
animation: cyklus-os-choice-pulse 1.4s ease-in-out infinite;
}
```

---

## `.cyklus-card__restart-badge`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-card__restart-badge,
.cyklus-card__overload`, `.cyklus-card__restart-badge,
.cyklus-card__overload`, `.cyklus-card__restart-badge`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-card__restart-badge,
.cyklus-card__overload`
- **CSS body (primary):**
```css
.cyklus-card__restart-badge {
border-radius: var(--cy-radius-sm);
  background: color-mix(in srgb, var(--cy-accent-warning) 4.5%, transparent);
  color: var(--cy-yellow);
}
```

---

## `.cyklus-card__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, transform, color-mix
- **Selectors (sample):** `.cyklus-card__title`, `.cyklus-card__title`, `.cyklus-card__title`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-card__title`
- **CSS body (primary):**
```css
.cyklus-card__title {
margin: 0;
  color: var(--cy-text);
  font-family: var(--font-family-heading), var(--cy-font-mono);
  font-size: clamp(1.55rem, 4vw, 2.35rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: 0.06em;
  overflow-wrap: anywhere;
  text-shadow: 0 0 18px color-mix(in srgb, var(--card-accent), transparent 80%);
  text-transform: uppercase;
}
```

---

## `.cyklus-chapter__number`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-chapter__number`, `.cyklus-chapter__number`
- **Selector:** `.cyklus-chapter__number`
- **CSS body (primary):**
```css
.cyklus-chapter__number {
font-size: 0.65rem;
  letter-spacing: 0.18em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}
```

---

## `.cyklus-chapter__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-chapter__title`, `.cyklus-chapter__title`
- **Selector:** `.cyklus-chapter__title`
- **CSS body (primary):**
```css
.cyklus-chapter__title {
font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-secondary);
  text-transform: uppercase;
}
```

---

## `.cyklus-collection-card__art`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-collection-card__art`, `.cyklus-collection-card__art img`
- **Usage sample:**
  - `src\components\archive\CyklusCardCollection.tsx`
- **Selector:** `.cyklus-collection-card__art`
- **CSS body (primary):**
```css
.cyklus-collection-card__art {
position: relative; display: grid; aspect-ratio: 2 / 3; overflow: hidden; place-items: center; background: color-mix(in srgb, var(--os-surface-raised) 84%, black);
}
```

---

## `.cyklus-collection-card__scan`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, color-mix
- **Selectors (sample):** `.cyklus-collection-card__scan`
- **Usage sample:**
  - `src\components\archive\CyklusCardCollection.tsx`
- **Selector:** `.cyklus-collection-card__scan`
- **CSS body (primary):**
```css
.cyklus-collection-card__scan {
width: 58%; aspect-ratio: 2 / 3; border: 1px solid var(--os-border); background: repeating-linear-gradient(180deg, transparent 0 8px, color-mix(in srgb, var(--os-text-muted) 13%, transparent) 8px 9px); filter: blur(.2px);
}
```

---

## `.cyklus-contract`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-contract`, `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **Selector:** `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **CSS body (primary):**
```css
.cyklus-contract {
border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-cycle-forecast`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\cycle-notices.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-card-overlay .cyklus-cycle-forecast,
.cyklus-card-overlay .cyklus-cycle-summary`, `.cyklus-cycle-forecast`, `.cyklus-cycle-forecast dt,
.cyklus-cycle-summary__metrics span,
.cyklus-cycle-summary__sectors > span`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
- **Selector:** `.cyklus-cycle-forecast dt,
.cyklus-cycle-summary__metrics span,
.cyklus-cycle-summary__sectors > span`
- **CSS body (primary):**
```css
.cyklus-cycle-forecast {
color: var(--cy-text-dim);
  font: 800 0.65rem/1.4 var(--cy-font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

---

## `.cyklus-cycle-forecast__glyph`

- **Status:** defined
- **CSS files:** src\styles\cyklus\cycle-notices.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-cycle-forecast__glyph`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
- **Selector:** `.cyklus-cycle-forecast__glyph`
- **CSS body (primary):**
```css
.cyklus-cycle-forecast__glyph {
font: 1.4rem/1 var(--cy-font-mono);
  text-shadow: var(--cy-glow-cyan);
}
```

---

## `.cyklus-cycle-forecast__signal`

- **Status:** defined
- **CSS files:** src\styles\cyklus\cycle-notices.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-cycle-forecast__signal`, `.cyklus-cycle-forecast__signal:last-child`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
- **Selector:** `.cyklus-cycle-forecast__signal:last-child`
- **CSS body (primary):**
```css
.cyklus-cycle-forecast__signal {
transform: scaleX(-1);
}
```

---

## `.cyklus-cycle-notice`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\cycle-notices.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`, `.cyklus-card-overlay__surface,
  .cyklus-card-overlay__panel,
  .cyklus-card-overlay .cyklus-system-modal,
  .cyklus-card-overlay .cyklus-cycle-notice,
  .cyklus-card-overlay .cyklus-outcome`, `/* Distinct cycle forecast and closure reports. */

.cyklus-cycle-notice`
- **Selector:** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`
- **CSS body (primary):**
```css
.cyklus-cycle-notice {
position: relative;
  inset: auto;
  z-index: 1;
  display: grid;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  max-width: none;
  max-height: none;
  grid-template-rows: auto minmax(0, 1fr) auto;
  margin: 0;
  overflow: hidden;
  overscroll-behavior: contain;
  border: 1px solid var(--cy-line-strong);
  border-radius: var(--cy-radius);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow), var(--cy-glow-cyan);
  color: var(--cy-text);
  scrollbar-color: var(--cy-line-strong) var(--cy-scrollbar-track);
  scrollbar-width: thin;
  transform: none;
}
```

---

## `.cyklus-cycle-notice--summary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\cycle-notices.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-cycle-notice--summary`
- **Selector:** `.cyklus-cycle-notice--summary`
- **CSS body (primary):**
```css
.cyklus-cycle-notice--summary {
--modal-accent: var(--cy-magenta);
  width: min(calc(100% - 24px), 620px);
  border-color: var(--cy-line-magenta);
  box-shadow: var(--cy-shadow), var(--cy-glow-magenta);
}
```

---

## `.cyklus-cycle-notice__header`

- **Status:** defined
- **CSS files:** src\styles\cyklus\cycle-notices.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-cycle-notice__header`, `.cyklus-cycle-notice__header h2`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
- **Selector:** `.cyklus-cycle-notice__header h2`
- **CSS body (primary):**
```css
.cyklus-cycle-notice__header {
margin: 0;
  color: var(--modal-accent);
  font: 800 0.75rem/1.3 var(--cy-font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## `.cyklus-cycle-summary__metrics`

- **Status:** defined
- **CSS files:** src\styles\cyklus\cycle-notices.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-cycle-forecast dt,
.cyklus-cycle-summary__metrics span,
.cyklus-cycle-summary__sectors > span`, `.cyklus-cycle-summary__metrics`, `.cyklus-cycle-summary__metrics > div`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
- **Selector:** `.cyklus-cycle-forecast dt,
.cyklus-cycle-summary__metrics span,
.cyklus-cycle-summary__sectors > span`
- **CSS body (primary):**
```css
.cyklus-cycle-summary__metrics {
color: var(--cy-text-dim);
  font: 800 0.65rem/1.4 var(--cy-font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

---

## `.cyklus-cycle-summary__sectors`

- **Status:** defined
- **CSS files:** src\styles\cyklus\cycle-notices.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-cycle-forecast dt,
.cyklus-cycle-summary__metrics span,
.cyklus-cycle-summary__sectors > span`, `.cyklus-cycle-summary__sectors`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
- **Selector:** `.cyklus-cycle-forecast dt,
.cyklus-cycle-summary__metrics span,
.cyklus-cycle-summary__sectors > span`
- **CSS body (primary):**
```css
.cyklus-cycle-summary__sectors {
color: var(--cy-text-dim);
  font: 800 0.65rem/1.4 var(--cy-font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

---

## `.cyklus-cycle-summary__stat`

- **Status:** defined
- **CSS files:** src\styles\cyklus\cycle-notices.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-cycle-summary__stat`, `.cyklus-cycle-summary__stat strong`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
- **Selector:** `.cyklus-cycle-summary__stat`
- **CSS body (primary):**
```css
.cyklus-cycle-summary__stat {
display: flex;
  min-height: 42px;
  align-items: center;
  justify-content: space-between;
  gap: var(--cy-space-3);
  padding: var(--cy-space-2) var(--cy-space-3);
  background: var(--cy-panel-solid);
  font: 700 0.7rem/1 var(--cy-font-mono);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

---

## `.cyklus-dashboard-hero`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-dashboard-hero,
.cyklus-panel-header`, `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-outcome__story,
  .cyklus-end-summary__text,
  .cyklus-end-summary__muted,
  .cyklus-end-summary__steps,
  .cyklus-reward__flavor,
  .cyklus-death-analysis__comment,
  .cyklus-behavioral__pattern,
  .cyklus-pocket__item-text,
  .cyklus-pocket__item-hint,
  .cyklus-build__next-step,
  .cyklus-goal__desc,
  .cyklus-contract__row,
  .cyklus-discovery__row,
  .cyklus-history__details,
  .cyklus-stat-popup__body
),
.cyklus-void-page :is(
  .void-hub-hero p,
  .void-hub-return-summary p,
  .void-hub-next-action p,
  .void-hub-focus p,
  .void-hub-section-header p,
  .cyklus-dashboard-hero p,
  .cyklus-pocket-panel p,
  .pocket-item-row p,
  .craft-recipe-row p,
  .void-room-row p,
  .loadout-entry p,
  .cyklus-empty-note,
  .pocket-ambient-text
)`, `.void-hub-section-header,
.cyklus-dashboard-hero,
.cyklus-panel-header`
- **Usage sample:**
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
- **Selector:** `.void-hub-section-header h3,
.cyklus-dashboard-hero h2,
.cyklus-panel-header h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`
- **CSS body (primary):**
```css
.cyklus-dashboard-hero {
margin: 0;
  color: var(--cy-text);
  font-size: clamp(1rem, 2vw, 1.25rem);
  letter-spacing: 0.04em;
  text-shadow: none;
}
```

---

## `.cyklus-death-analysis`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-history,
  .cyklus-end-summary__full-log,
  .cyklus-stat-popup__body,
  .cyklus-diag-drawer,
  .cyklus-discovery,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-reward
),
.cyklus-void-page :is(
  .cyklus-void-client-status,
  .void-hub-tab-panel,
  [role="tabpanel"],
  .cyklus-pocket-panel,
  .cyklus-progression-dashboard
)`, `/* Death analysis */
.cyklus-death-analysis`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-death-analysis {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-death-analysis__text`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-death-analysis__text {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-diag-drawer`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-diag-drawer`, `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-history,
  .cyklus-end-summary__full-log,
  .cyklus-stat-popup__body,
  .cyklus-diag-drawer,
  .cyklus-discovery,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-reward
),
.cyklus-void-page :is(
  .cyklus-void-client-status,
  .void-hub-tab-panel,
  [role="tabpanel"],
  .cyklus-pocket-panel,
  .cyklus-progression-dashboard
)`, `/* ── DIAGNOSTIC DRAWER ──────────────────────────────────────────────────────── */

.cyklus-diag-drawer`
- **Usage sample:**
  - `src\components\cyklus\CyklusMobileHud.tsx`
- **Selector:** `.cyklus-diag-drawer`
- **CSS body (primary):**
```css
.cyklus-diag-drawer {
position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  z-index: var(--cy-z-sheet);
  max-height: min(56dvh, 440px);
  padding: var(--cy-space-3);
  overflow: auto;
  border-bottom: 1px solid var(--cy-line-strong);
  background: color-mix(in srgb, var(--cy-surface-2) 98%, transparent);
  box-shadow: var(--cy-shadow);
}
```

---

## `.cyklus-diag-drawer__label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-diag-drawer__label,
.cyklus-diag-drawer__node--current,
.cyklus-diag-drawer__stab-item--ok`, `.cyklus-diag-drawer__label`
- **Usage sample:**
  - `src\components\cyklus\CyklusMobileHud.tsx`
- **Selector:** `.cyklus-diag-drawer__label`
- **CSS body (primary):**
```css
.cyklus-diag-drawer__label {
font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-right: 0.2rem;
}
```

---

## `.cyklus-discovery__bar`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-discovery__bar`, `.cyklus-build__bar,
.cyklus-discovery__bar`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-build__bar,
.cyklus-discovery__bar`
- **CSS body (primary):**
```css
.cyklus-discovery__bar {
height: 3px;
  border-radius: 0;
  background: color-mix(in srgb, var(--cy-text-dim) 24%, transparent);
}
```

---

## `.cyklus-discovery__fill`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-discovery__fill`, `.cyklus-build__fill,
.cyklus-discovery__fill`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-discovery__fill`
- **CSS body (primary):**
```css
.cyklus-discovery__fill {
height: 100%;
  background: linear-gradient(90deg, #74b9ff, #7bed9f);
  transition: width 0.3s ease;
}
```

---

## `.cyklus-discovery__row`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-discovery__row`, `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-outcome__story,
  .cyklus-end-summary__text,
  .cyklus-end-summary__muted,
  .cyklus-end-summary__steps,
  .cyklus-reward__flavor,
  .cyklus-death-analysis__comment,
  .cyklus-behavioral__pattern,
  .cyklus-pocket__item-text,
  .cyklus-pocket__item-hint,
  .cyklus-build__next-step,
  .cyklus-goal__desc,
  .cyklus-contract__row,
  .cyklus-discovery__row,
  .cyklus-history__details,
  .cyklus-stat-popup__body
),
.cyklus-void-page :is(
  .void-hub-hero p,
  .void-hub-return-summary p,
  .void-hub-next-action p,
  .void-hub-focus p,
  .void-hub-section-header p,
  .cyklus-dashboard-hero p,
  .cyklus-pocket-panel p,
  .pocket-item-row p,
  .craft-recipe-row p,
  .void-room-row p,
  .loadout-entry p,
  .cyklus-empty-note,
  .pocket-ambient-text
)`, `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **CSS body (primary):**
```css
.cyklus-discovery__row {
border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-discovery__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-build__title,
.cyklus-discovery__title,
.cyklus-goal__title`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-build__title,
.cyklus-discovery__title,
.cyklus-goal__title`
- **CSS body (primary):**
```css
.cyklus-discovery__title {
font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}
```

---

## `.cyklus-end`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** cyklus-fade-in
- **Selectors (sample):** `/* Final report hierarchy: centered verdict, readable summary, technical diagnostics. */

.cyklus-end`, `.cyklus-end__header,
  .cyklus-end__primary,
  .cyklus-end__diagnostics,
  .cyklus-end > .cyklus-end__actions,
  .cyklus-end > .cyklus-history`, `.cyklus-end__header,
  .cyklus-end__primary,
  .cyklus-end__diagnostics,
  .cyklus-end > .cyklus-end__actions,
  .cyklus-end > .cyklus-history`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end`
- **CSS body (primary):**
```css
.cyklus-end {
width: 100%;
  max-width: 420px;
  text-align: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-tertiary);
  border-radius: 1.25rem;
  padding: 1.75rem 1.5rem;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  animation: cyklus-fade-in 0.5s ease;
}
```

---

## `.cyklus-end-summary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__primary > .cyklus-end-summary`, `/* End screen summary */
.cyklus-end-summary`, `.cyklus-end-summary`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end .cyklus-btn,
.cyklus-end-summary .cyklus-btn`
- **CSS body (primary):**
```css
.cyklus-end-summary {
min-width: 0;
  min-height: var(--cy-tap);
  padding: 0.7rem var(--cy-space-2);
  border: 0;
  border-radius: 0;
  background: var(--cy-panel-solid);
  color: var(--cy-cyan-soft);
  font: 700 0.68rem/1.25 var(--cy-font-mono);
  letter-spacing: 0.06em;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}
```

---

## `.cyklus-end-summary__actions`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-end-summary__actions`, `.cyklus-end-summary__actions .cyklus-btn--primary`, `.cyklus-end-summary__actions`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__actions .cyklus-btn--primary`
- **CSS body (primary):**
```css
.cyklus-end-summary__actions {
grid-column: 1 / -1;
  border-bottom: 2px solid var(--cy-magenta);
  background: color-mix(in srgb, var(--cy-accent-memory) 9%, var(--cy-panel-solid));
}
```

---

## `.cyklus-end-summary__eyebrow`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label`, `.cyklus-end__system-label,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label`
- **CSS body (primary):**
```css
.cyklus-end-summary__eyebrow {
font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);
  text-transform: uppercase;
}
```

---

## `.cyklus-end-summary__label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label`, `.cyklus-end__system-label,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`
- **CSS body (primary):**
```css
.cyklus-end-summary__label {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.cyklus-end-summary__muted`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-end-summary__muted`, `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-end-summary__muted {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-end-summary__row`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\responsive.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-end-summary__row`, `.cyklus-end-summary__row,
.cyklus-end-summary__reward,
.cyklus-end-summary__steps li`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-end-summary__row {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-end-summary__steps`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-end-summary__list,
.cyklus-end-summary__steps`, `.cyklus-end-summary__steps`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-end-summary__steps {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-end-summary__text`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-end-summary__text`, `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-end-summary__text {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-end__codename`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-end__codename`, `/* ── END SCREEN: CODENAME ────────────────────────────────────────────────────── */

.cyklus-end__codename`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`
- **CSS body (primary):**
```css
.cyklus-end__codename {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.cyklus-end__diagnostics`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__primary,
.cyklus-end__diagnostics`, `.cyklus-end__diagnostics`, `.cyklus-end__header,
  .cyklus-end__primary,
  .cyklus-end__diagnostics,
  .cyklus-end > .cyklus-end__actions,
  .cyklus-end > .cyklus-history`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__diagnostics {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__diagnostics-body`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__diagnostics-body {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__diagnostics-summary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-end__diagnostics-summary`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`
- **CSS body (primary):**
```css
.cyklus-end__diagnostics-summary {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.cyklus-end__findings`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `/* ── DIAGNOSTIC FINDINGS ─────────────────────────────────────────────────────── */

.cyklus-end__findings`, `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__findings {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__header`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-end__header`, `.cyklus-end__header .cyklus-end__stats-snapshot`, `.cyklus-end__header,
  .cyklus-end__primary,
  .cyklus-end__diagnostics,
  .cyklus-end > .cyklus-end__actions,
  .cyklus-end > .cyklus-history`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__header`
- **CSS body (primary):**
```css
.cyklus-end__header {
grid-column: 1 / -1;
  width: 100%;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border: 1px solid var(--cy-line-strong);
  background: linear-gradient(180deg, color-mix(in srgb, var(--cy-accent-system) 4%, transparent), transparent 72%);
  text-align: center;
}
```

---

## `.cyklus-end__imprints`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `.cyklus-end__imprints`, `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__imprints {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__meta-unlocks`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `/* ── META UNLOCKS ────────────────────────────────────────────────────────────── */

.cyklus-end__meta-unlocks`, `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__meta-unlocks {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__near-extreme`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `/* ── END SCREEN: NEAR EXTREME ────────────────────────────────────────────────── */

.cyklus-end__near-extreme`, `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__near-extreme {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__near-extreme-note`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-end__near-extreme-note`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-end__near-extreme-note {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-end__profile`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `.cyklus-end__profile`, `.cyklus-end__profile`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__profile {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__route`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `.cyklus-end__route`, `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__route {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__section-label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 8 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-end__section-label`, `.cyklus-end__system-label,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__section-label`
- **CSS body (primary):**
```css
.cyklus-end__section-label {
font-size: 0.68rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 0.5rem;
}
```

---

## `.cyklus-end__stats-snapshot`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__header .cyklus-end__stats-snapshot`, `.cyklus-end__header .cyklus-end__stats-snapshot`, `.cyklus-end__stats-snapshot`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__stats-snapshot {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__subtitle`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__subtitle`, `.cyklus-end__subtitle`
- **Selector:** `.cyklus-end__subtitle`
- **CSS body (primary):**
```css
.cyklus-end__subtitle {
margin-top: var(--cy-space-2);
  color: var(--cy-magenta-soft);
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

---

## `.cyklus-end__survival-reasons`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-end__survival-reasons`, `.cyklus-end__survival-reasons li`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-end__survival-reasons {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-end__survival-type`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `/* ── END SCREEN: SURVIVAL TYPE ───────────────────────────────────────────────── */

.cyklus-end__survival-type`, `.cyklus-end__diagnostics > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-end__stats-snapshot,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`
- **CSS body (primary):**
```css
.cyklus-end__survival-type {
margin: 0;
  padding: var(--cy-space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-end__system-label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-end__system-label`, `.cyklus-end__system-label,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`
- **CSS body (primary):**
```css
.cyklus-end__system-label {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.cyklus-end__text`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-end__diagnostics-body > :is(
  .cyklus-end__survival-type,
  .cyklus-end__text,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-end__profile,
  .cyklus-end__route,
  .cyklus-end__imprints,
  .cyklus-end__near-extreme,
  .cyklus-end__findings,
  .cyklus-end__meta-unlocks
)`, `.cyklus-end__text`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-end__text {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-end__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__title`, `.cyklus-end__title`, `}

.cyklus-end__title`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__title`
- **CSS body (primary):**
```css
.cyklus-end__title {
max-width: 18ch;
  margin: var(--cy-space-3) auto 0;
  font-family: var(--font-family-heading), var(--cy-font-mono);
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1.05;
  letter-spacing: 0;
  text-transform: none;
}
```

---

## `.cyklus-end__verdict-text`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__verdict-text`, `.cyklus-end__verdict-text`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__verdict-text`
- **CSS body (primary):**
```css
.cyklus-end__verdict-text {
max-width: 62ch;
  margin: var(--cy-space-3) auto 0;
  color: var(--cy-text-soft);
  font-family: var(--font-family-primary), system-ui, sans-serif;
  font-size: clamp(1rem, 2vw, 1.15rem);
  line-height: 1.55;
  text-transform: none;
}
```

---

## `.cyklus-finding__desc`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-finding__desc`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-finding__desc {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-footer`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `.cyklus-footer`, `.cyklus-footer`, `/* Footer */
[data-theme=mono-light] .cyklus-footer`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-footer`
- **CSS body (primary):**
```css
.cyklus-footer {
margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
  max-width: 420px;
  margin-left: auto;
  margin-right: auto;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border-tertiary);
  border-radius: 0.9rem;
  background: var(--bg-tertiary);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  font-size: 0.8rem;
  color: var(--text-secondary);
}
```

---

## `.cyklus-footer__button`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-footer__button`, `.cyklus-footer__button:hover`, `/* ── ACCESSIBILITY & REDUCED MOTION ──────────────────────────────────────────── */

.cyklus-btn:focus-visible,
.cyklus-pocket__toggle:focus-visible,
.cyklus-pocket__activate:focus-visible,
.cyklus-stat-chip:focus-visible,
.cyklus-footer__button:focus-visible,
.cyklus-menu__button:focus-visible`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-footer__button`
- **CSS body (primary):**
```css
.cyklus-footer__button {
flex: 1;
  padding: 0.4rem 0.6rem;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: var(--bg-glass);
  border: 1px solid var(--border-tertiary);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
}
```

---

## `.cyklus-footer__label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\shell.css
- **Used in:** 4 occurrences across 2 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-footer__label`, `.cyklus-page :is(
  .cyklus-active-objective__label,
  .cyklus-card__category,
  .cyklus-card__context,
  .cyklus-outcome__label,
  .cyklus-end__system-label,
  .cyklus-end__section-label,
  .cyklus-end-summary__eyebrow,
  .cyklus-end-summary__label,
  .cyklus-reward__system-label,
  .cyklus-reward__section-label,
  .cyklus-stat-chip__label,
  .cyklus-footer__label,
  .cyklus-build__intro-label
),
.cyklus-void-page :is(
  .cyklus-panel-kicker,
  .void-hub-status-rail small,
  .void-hub-tab > small,
  .void-hub-focus__button > small,
  .cyklus-void-client-status
)`, `.cyklus-page :is(
    .cyklus-active-objective__label,
    .cyklus-card__category,
    .cyklus-card__context,
    .cyklus-outcome__label,
    .cyklus-end__system-label,
    .cyklus-end__section-label,
    .cyklus-end-summary__eyebrow,
    .cyklus-end-summary__label,
    .cyklus-reward__system-label,
    .cyklus-reward__section-label,
    .cyklus-stat-chip__label,
    .cyklus-footer__label,
    .cyklus-build__intro-label
  ),
  .cyklus-void-page :is(
    .cyklus-panel-kicker,
    .void-hub-status-rail small,
    .void-hub-tab > small,
    .void-hub-focus__button > small,
    .cyklus-void-client-status
  )`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
  - `src\components\cyklus\CyklusPocketDock.tsx`
- **Selector:** `.cyklus-footer__label`
- **CSS body (primary):**
```css
.cyklus-footer__label {
font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-right: 0.4rem;
}
```

---

## `.cyklus-game-header`

- **Status:** defined
- **CSS files:** src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-game-header`, `.cyklus-game-header:has(.cyklus-pocket--header .cyklus-pocket__toggle[aria-expanded='true'])`, `.cyklus-root--menu > .cyklus-game-header`
- **Usage sample:**
  - `src\components\cyklus\CyklusCommandRail.tsx`
- **Selector:** `.cyklus-game-header`
- **CSS body (primary):**
```css
.cyklus-game-header {
position: relative;
  z-index: var(--cy-z-hud);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--cy-space-3);
  width: 100%;
  min-height: 44px;
  border-bottom: 1px solid var(--cy-line);
  background: color-mix(in srgb, var(--cy-bg) 94%, transparent);
  font-family: var(--cy-font-mono);
}
```

---

## `.cyklus-goal`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-goal`, `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **Selector:** `/* Build, goals, contracts, and discovery share one technical language. */

.cyklus-overlay__panel :is(.cyklus-build__variant, .cyklus-goal, .cyklus-contract, .cyklus-discovery__row)`
- **CSS body (primary):**
```css
.cyklus-goal {
border: 0;
  border-bottom: 1px solid var(--cy-line-dim);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-goal__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-build__title,
.cyklus-discovery__title,
.cyklus-goal__title`, `.cyklus-pocket__item-name,
.cyklus-build__name,
.cyklus-goal__title,
.cyklus-contract__title`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-build__title,
.cyklus-discovery__title,
.cyklus-goal__title`
- **CSS body (primary):**
```css
.cyklus-goal__title {
font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}
```

---

## `.cyklus-goals__reroll`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-goals__reroll`, `.cyklus-goals__reroll:hover`, `/* Run structural panels */

.cyklus-footer__button,
.cyklus-build__toggle,
.cyklus-goals__reroll,
.cyklus-pocket__activate`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-goals__reroll`
- **CSS body (primary):**
```css
.cyklus-goals__reroll {
font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
  background: rgba(112, 161, 255, 0.15);
  border: 1px solid rgba(112, 161, 255, 0.3);
  color: #70a1ff;
  border-radius: 0.25rem;
  cursor: pointer;
  text-transform: none;
  letter-spacing: 0.02em;
}
```

---

## `.cyklus-loading`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-loading`, `.cyklus-loading`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-loading`
- **CSS body (primary):**
```css
.cyklus-loading {
min-height: 100dvh;
  background: var(--cy-bg);
  color: var(--cy-cyan-soft);
  font-family: var(--cy-font-mono);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## `.cyklus-menu__bootbar`

- **Status:** defined
- **CSS files:** src\styles\cyklus\menu-polish.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-menu__bootbar`, `.cyklus-menu__bootbar`, `.cyklus-menu__bootbar`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__bootbar`
- **CSS body (primary):**
```css
.cyklus-menu__bootbar {
grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  gap: var(--cy-space-4);
  padding-bottom: var(--cy-space-3);
  border-bottom: 1px solid var(--cy-line);
  color: var(--cy-cyan-soft);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
```

---

## `.cyklus-menu__brand`

- **Status:** defined
- **CSS files:** src\styles\cyklus\effects.css, src\styles\cyklus\menu-polish.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** cyklus-os-boot-flicker
- **Selectors (sample):** `.cyklus-menu__brand`, `.cyklus-menu__brand`, `.cyklus-menu__brand`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__brand`
- **CSS body (primary):**
```css
.cyklus-menu__brand {
animation: cyklus-os-boot-flicker 540ms steps(2, end) 1 both;
}
```

---

## `.cyklus-menu__button`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\menu-polish.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `.cyklus-menu__button`, `.cyklus-menu__button:hover`, `.cyklus-menu__button:active`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__button`
- **CSS body (primary):**
```css
.cyklus-menu__button {
padding: 0.85rem 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-tertiary);
  background: var(--bg-glass);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.1s ease;
}
```

---

## `.cyklus-menu__button--primary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\menu-polish.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-menu__button--primary`, `.cyklus-menu__button--primary:hover`, `[data-theme=mono-light] .cyklus-menu__button--primary`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__button--primary`
- **CSS body (primary):**
```css
.cyklus-menu__button--primary {
background: color-mix(in srgb, var(--cy-accent-memory) 7%, transparent);
  color: var(--cy-magenta-soft);
}
```

---

## `.cyklus-menu__button--secondary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-menu__button--secondary`, `.cyklus-menu__button--secondary:hover`, `.cyklus-menu__button:hover,
.cyklus-menu__button--primary:hover,
.cyklus-menu__button--secondary:hover`
- **Selector:** `.cyklus-menu__button--secondary`
- **CSS body (primary):**
```css
.cyklus-menu__button--secondary {
background: color-mix(in srgb, var(--cy-surface-1) 72%, transparent);
  color: var(--cy-text-soft);
}
```

---

## `.cyklus-menu__content`

- **Status:** defined
- **CSS files:** src\styles\cyklus\menu-polish.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-menu__content`, `.cyklus-menu__content::before`, `.cyklus-menu__content`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__content::before`
- **CSS body (primary):**
```css
.cyklus-menu__content {
content: "";
  position: absolute;
  inset: 0 -110px 0 -60px;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(90deg, color-mix(in srgb, var(--cy-bg) 94%, transparent) 0%, color-mix(in srgb, var(--cy-bg) 82%, transparent) 58%, transparent 100%);
}
```

---

## `.cyklus-menu__portal`

- **Status:** defined
- **CSS files:** src\styles\cyklus\menu-polish.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation, color-mix
- **Animations:** cyklus-os-portal
- **Selectors (sample):** `.cyklus-menu__portal`, `.cyklus-menu__portal`, `.cyklus-menu__portal`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__portal`
- **CSS body (primary):**
```css
.cyklus-menu__portal {
grid-column: 2;
  grid-row: 2;
  position: relative;
  justify-self: center;
  width: min(42vw, 470px);
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--cy-accent-system) 40%, transparent);
  border-radius: 50%;
  background:
    radial-gradient(circle, color-mix(in srgb, var(--cy-black) 94%, transparent) 0 30%, color-mix(in srgb, var(--cy-accent-system) 8%, transparent) 31% 31.5%, transparent 32% 49%, color-mix(in srgb, var(--cy-accent-memory) 10%, transparent) 50% 50.5%, transparent 51%),
    conic-gradient(from 20deg, transparent 0 12%, color-mix(in srgb, var(--cy-accent-syst…
}
```

---

## `.cyklus-menu__portal-core`

- **Status:** defined
- **CSS files:** src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-menu__portal-core`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__portal-core`
- **CSS body (primary):**
```css
.cyklus-menu__portal-core {
position: absolute;
  inset: 39%;
  border: 1px solid var(--cy-cyan);
  border-radius: 50%;
  background: color-mix(in srgb, var(--cy-accent-system) 6%, transparent);
  box-shadow: var(--cy-glow-system);
}
```

---

## `.cyklus-menu__subtitle`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\menu-polish.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-menu__subtitle`, `.cyklus-menu__title,
.cyklus-menu__restart-line,
.cyklus-menu__intro,
.cyklus-menu__subtitle,
.cyklus-menu__actions`, `.cyklus-menu__subtitle`
- **Selector:** `.cyklus-menu__subtitle`
- **CSS body (primary):**
```css
.cyklus-menu__subtitle {
display: grid;
  gap: 4px;
  padding: 0.65rem 0;
  border-block: 1px solid var(--cy-line-subtle);
  text-transform: none;
}
```

---

## `.cyklus-menu__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\menu-polish.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-menu__title`, `.cyklus-menu__title,
.cyklus-menu__restart-line,
.cyklus-menu__intro,
.cyklus-menu__subtitle,
.cyklus-menu__actions`, `.cyklus-menu__title`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__title`
- **CSS body (primary):**
```css
.cyklus-menu__title {
font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-shadow: 0 0 20px var(--glow-secondary, rgba(0, 255, 255, 0.15));
}
```

---

## `.cyklus-menu__video`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\menu-polish.css, src\styles\cyklus\shell.css, src\styles\cyklus\themes.css, src\styles\motion-contract.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `:root[data-background-motion="off"] .synthoma-media-layer__video,
:root[data-background-motion="off"] .video-background video,
:root[data-background-motion="off"] .lib-bg-video,
:root[data-background-motion="off"] .chapter-background__video,
:root[data-background-motion="off"] .cyklus-menu__video,
:root[data-background-motion="off"] #retro-video-canvas`, `.cyklus-menu__video`, `[data-theme="mono-light"] .cyklus-menu__video`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-menu__video`
- **CSS body (primary):**
```css
.cyklus-menu__video {
--cyklus-video-runtime-filter: brightness(0.64) contrast(1.1) saturate(0.9);
    opacity: 0.46;
}
```

---

## `.cyklus-meta-unlock__reason`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-meta-unlock__reason`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-meta-unlock__reason {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-mobile-hud`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\hud.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-root--swiping :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective),
  .cyklus-root--outcome-visible :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective)`, `.cyklus-root--swiping :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective),
  .cyklus-root--outcome-visible :is(.cyklus-mobile-hud, .cyklus-stat-dock, .cyklus-active-objective)`, `.cyklus-root--playing > .cyklus-mobile-hud,
  .cyklus-active-objective`
- **Usage sample:**
  - `src\components\cyklus\CyklusMobileHud.tsx`
- **Selector:** `.cyklus-mobile-hud`
- **CSS body (primary):**
```css
.cyklus-mobile-hud {
position: relative;
  z-index: var(--cy-z-hud);
  width: 100%;
  border-bottom: 1px solid var(--cy-line);
  background: color-mix(in srgb, var(--cy-surface-1) 97%, transparent);
  font-family: var(--cy-font-mono);
}
```

---

## `.cyklus-mobile-hud__risk`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-mobile-hud__risk`, `.cyklus-mobile-hud__risk`, `.cyklus-mobile-hud__risk`
- **Selector:** `.cyklus-mobile-hud__risk`
- **CSS body (primary):**
```css
.cyklus-mobile-hud__risk {
margin-left: auto;
  border: 0;
  border-left: 2px solid var(--cy-yellow);
  border-radius: 0;
  background: color-mix(in srgb, var(--cy-accent-warning) 6%, transparent);
  color: var(--cy-yellow);
}
```

---

## `.cyklus-mobile-hud__risk--critical`

- **Status:** defined
- **CSS files:** src\styles\cyklus\effects.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-os-critical-pulse
- **Selectors (sample):** `.cyklus-mobile-hud__risk--critical,
.cyklus-stat-chip--low-danger::after,
.cyklus-stat-chip--high-danger::after`, `.cyklus-mobile-hud__risk--critical::before`, `.cyklus-mobile-hud__risk--critical`
- **Selector:** `.cyklus-mobile-hud__risk--critical,
.cyklus-stat-chip--low-danger::after,
.cyklus-stat-chip--high-danger::after`
- **CSS body (primary):**
```css
.cyklus-mobile-hud__risk--critical {
animation: cyklus-os-critical-pulse 1.8s ease-in-out infinite;
}
```

---

## `.cyklus-mobile-utility-dock`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-mobile-utility-dock`, `.cyklus-mobile-utility-dock`, `.cyklus-root--ended > :is(.cyklus-pocket--standalone, .cyklus-stat-dock, .cyklus-desktop-top__right, .cyklus-bottom-nav, .cyklus-mobile-utility-dock)`
- **Usage sample:**
  - `src\components\cyklus\CyklusMobileUtilityDock.tsx`
- **Selector:** `.cyklus-mobile-utility-dock`
- **CSS body (primary):**
```css
.cyklus-mobile-utility-dock {
position: relative;
    z-index: var(--cy-z-hud);
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    min-height: calc(var(--cy-bottom-height) + env(safe-area-inset-bottom));
    padding: 0 max(6px, env(safe-area-inset-right)) env(safe-area-inset-bottom) max(6px, env(safe-area-inset-left));
    border-top: 1px solid var(--cy-line-strong);
    background: color-mix(in srgb, var(--cy-surface-1) 98.5%, transparent);
    box-shadow: var(--cy-shadow-compact);
}
```

---

## `.cyklus-mobile-utility-dock__pocket`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-mobile-utility-dock__pocket`, `.cyklus-mobile-utility-dock__pocket:hover,
  .cyklus-mobile-utility-dock__pocket:focus-visible,
  .cyklus-mobile-utility-dock__pocket[aria-expanded='true']`, `.cyklus-mobile-utility-dock__pocket:hover,
  .cyklus-mobile-utility-dock__pocket:focus-visible,
  .cyklus-mobile-utility-dock__pocket[aria-expanded='true']`
- **Usage sample:**
  - `src\components\cyklus\CyklusMobileUtilityDock.tsx`
- **Selector:** `.cyklus-mobile-utility-dock__pocket:hover,
  .cyklus-mobile-utility-dock__pocket:focus-visible,
  .cyklus-mobile-utility-dock__pocket[aria-expanded='true']`
- **CSS body (primary):**
```css
.cyklus-mobile-utility-dock__pocket {
background: color-mix(in srgb, var(--cy-accent-system) 6%, transparent);
    color: var(--cy-cyan-soft);
    box-shadow: inset 0 2px 0 var(--cy-accent-primary);
}
```

---

## `.cyklus-nav-panel`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `.cyklus-nav-panel`, `/* Navigation panel (sector + route + stabilization) */
.cyklus-nav-panel`, `.cyklus-nav-panel .cyklus-stabilization`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `/* Navigation panel (sector + route + stabilization) */
.cyklus-nav-panel`
- **CSS body (primary):**
```css
.cyklus-nav-panel {
width: 100%;
  max-width: 420px;
  margin: 0.5rem auto;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border-tertiary);
  border-radius: 0.9rem;
  background: var(--bg-tertiary);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}
```

---

## `.cyklus-nav-panel__label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-nav-panel__label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-nav-panel__label`
- **CSS body (primary):**
```css
.cyklus-nav-panel__label {
font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
}
```

---

## `.cyklus-outcome`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\feedback-header.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, animation, filter, backdrop-filter
- **Animations:** cyklus-fade-in
- **Selectors (sample):** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`, `.cyklus-card-overlay .cyklus-outcome`, `.cyklus-card-overlay .cyklus-outcome.reward--item,
.cyklus-card-overlay .cyklus-outcome.reward--big,
.cyklus-card-overlay .cyklus-outcome.reward--medium`
- **Selector:** `.cyklus-outcome`
- **CSS body (primary):**
```css
.cyklus-outcome {
position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-secondary);
  border-left: 3px solid rgba(123, 237, 159, 0.5);
  border-radius: inherit;
  padding: 1.5rem 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.55);
  animation: cyklus-fade-in 0.28s ease;
  z-index: 10;
  cursor: pointer;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  overflow-y: auto;
}
```

---

## `.cyklus-outcome__content`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\feedback-header.css, src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-card-overlay .cyklus-outcome__content`, `.cyklus-outcome__content`, `.cyklus-outcome__content`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-outcome__content`
- **CSS body (primary):**
```css
.cyklus-outcome__content {
width: min(100%, 520px);
  max-width: calc(100% - 24px);
  max-height: 76%;
  padding: clamp(0.9rem, 3vw, 1.35rem);
  overflow-y: auto;
  overflow-x: clip;
  border: 1px solid var(--cy-line-strong);
  border-left: 3px solid var(--outcome-accent);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow), 0 0 22px color-mix(in srgb, var(--outcome-accent) 12%, transparent);
  pointer-events: auto;
}
```

---

## `.cyklus-outcome__continue`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\feedback-header.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-card-overlay .cyklus-outcome__continue`, `.cyklus-outcome__label,
.cyklus-outcome__stats,
.cyklus-outcome__sector,
.cyklus-outcome__items,
.cyklus-outcome__hint,
.cyklus-outcome__fresh-meta,
.cyklus-outcome__continue`, `.cyklus-outcome__continue`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-outcome__continue`
- **CSS body (primary):**
```css
.cyklus-outcome__continue {
width: 100%;
  min-height: var(--cy-tap);
  margin-top: var(--cy-space-2);
  border: 1px solid var(--outcome-accent);
  background: color-mix(in srgb, var(--outcome-accent) 8%, transparent);
  color: var(--cy-text);
  font-weight: 800;
  cursor: pointer;
}
```

---

## `.cyklus-outcome__label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\effects.css, src\styles\cyklus\feedback-header.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.void-hub-status-rail strong,
.cyklus-outcome__label,
.cyklus-card__category`, `.cyklus-outcome__label,
.cyklus-outcome__stats,
.cyklus-outcome__sector,
.cyklus-outcome__items,
.cyklus-outcome__hint,
.cyklus-outcome__fresh-meta,
.cyklus-outcome__continue`, `}

.cyklus-outcome__label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `}

.cyklus-outcome__label`
- **CSS body (primary):**
```css
.cyklus-outcome__label {
font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent-success, #7bdfa0);
  margin-bottom: 0.4rem;
  opacity: 0.8;
}
```

---

## `.cyklus-outcome__reward`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-outcome__reward`, `.cyklus-outcome__reward`
- **Selector:** `.cyklus-outcome__reward`
- **CSS body (primary):**
```css
.cyklus-outcome__reward {
font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.15rem 0.4rem;
  border-radius: 3px;
  font-weight: 700;
}
```

---

## `.cyklus-outcome__story`

- **Status:** defined
- **CSS files:** src\styles\cyklus\feedback-header.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-outcome__story`, `.cyklus-outcome__story`, `.cyklus-outcome__story`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-outcome__story`
- **CSS body (primary):**
```css
.cyklus-outcome__story {
font-family: var(--font-family-primary), system-ui, sans-serif;
  font-size: clamp(1rem, 2vw, 1.12rem);
  line-height: 1.55;
  text-transform: none;
}
```

---

## `.cyklus-overlay`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css
- **Used in:** 5 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** cyklus-fade-in
- **Selectors (sample):** `/* ── OVERLAYS (sector intro, cycle summary) ──────────────────────────────── */

.cyklus-overlay`, `/* Shared dialog, overlay, and bottom-sheet behavior. */

.cyklus-overlay`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `/* ── OVERLAYS (sector intro, cycle summary) ──────────────────────────────── */

.cyklus-overlay`
- **CSS body (primary):**
```css
.cyklus-overlay {
position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--bg-overlay, rgba(8, 8, 18, 0.96));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  animation: cyklus-fade-in 0.3s ease;
}
```

---

## `.cyklus-overlay--build`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-overlay--build,
.cyklus-overlay--discovery`, `.cyklus-overlay--build .cyklus-overlay__panel,
.cyklus-overlay--discovery .cyklus-overlay__panel`, `.cyklus-system-modal--warning,
.cyklus-overlay--build .cyklus-overlay__panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-system-modal--warning,
.cyklus-overlay--build .cyklus-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-overlay--build {
--modal-accent: var(--cy-yellow);
  border-color: var(--cy-line-yellow);
  box-shadow: var(--cy-shadow), var(--cy-glow-yellow);
}
```

---

## `.cyklus-overlay--discovery`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-overlay--build,
.cyklus-overlay--discovery`, `.cyklus-overlay--build .cyklus-overlay__panel,
.cyklus-overlay--discovery .cyklus-overlay__panel`, `.cyklus-system-modal--summary,
.cyklus-system-modal--forecast,
.cyklus-overlay--discovery .cyklus-overlay__panel,
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-system-modal--summary,
.cyklus-system-modal--forecast,
.cyklus-overlay--discovery .cyklus-overlay__panel,
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-overlay--discovery {
--modal-accent: var(--cy-magenta);
  border-color: var(--cy-line-magenta);
  box-shadow: var(--cy-shadow), var(--cy-glow-magenta);
}
```

---

## `.cyklus-overlay--void-hub`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\themes.css, src\styles\cyklus\tokens.css, src\styles\cyklus\void.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* Void Hub overlay needs larger width */
.cyklus-overlay--void-hub .cyklus-overlay__panel`, `/* Void Hub overlay context */
.cyklus-overlay--void-hub .cyklus-void-client-shell`, `/* Override old fixed positioning for Void Hub in overlay context */
.cyklus-overlay--void-hub .cyklus-void-hub`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-overlay--void-hub .cyklus-void-hub`
- **CSS body (primary):**
```css
.cyklus-overlay--void-hub {
padding: clamp(0.75rem, 2vw, 1.25rem);
  background: color-mix(in srgb, var(--cy-surface-1) 98%, transparent);
}
```

---

## `.cyklus-overlay__backdrop`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 5 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter, color-mix
- **Selectors (sample):** `.cyklus-overlay__backdrop,
.cyklus-bottom-sheet__dismiss,
.cyklus-stat-popup-backdrop`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-overlay__backdrop,
.cyklus-bottom-sheet__dismiss,
.cyklus-stat-popup-backdrop`
- **CSS body (primary):**
```css
.cyklus-overlay__backdrop {
position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(ellipse at 18% 12%, color-mix(in srgb, var(--cy-accent-system) 7%, transparent), transparent 42%),
    radial-gradient(ellipse at 84% 88%, color-mix(in srgb, var(--cy-accent-memory) 6%, transparent), transparent 38%),
    var(--cy-overlay-backdrop);
  cursor: default;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
```

---

## `.cyklus-overlay__continue`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-overlay__continue`
- **Selector:** `.cyklus-overlay__continue`
- **CSS body (primary):**
```css
.cyklus-overlay__continue {
font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.cyklus-overlay__forecast-title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-overlay__forecast-title`
- **Selector:** `.cyklus-overlay__forecast-title`
- **CSS body (primary):**
```css
.cyklus-overlay__forecast-title {
font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--text-tertiary);
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}
```

---

## `.cyklus-overlay__panel`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css, src\styles\cyklus\void.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-overlay--build .cyklus-overlay__panel,
.cyklus-overlay--discovery .cyklus-overlay__panel`, `.cyklus-overlay--build .cyklus-overlay__panel,
.cyklus-overlay--discovery .cyklus-overlay__panel`, `/* Void Hub overlay needs larger width */
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `/* Void Hub overlay needs larger width */
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-overlay__panel {
max-width: min(1180px, 95vw);
  max-height: 90vh;
  padding: 2rem;
  background: var(--bg-primary, #000);
  border: 1px solid rgba(0, 255, 255, 0.18);
  border-radius: 1rem;
  box-shadow: 0 0 32px rgba(0, 255, 255, 0.12);
  overflow-y: auto;
}
```

---

## `.cyklus-overlay__sector-label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-overlay__sector-label`
- **Selector:** `.cyklus-overlay__sector-label`
- **CSS body (primary):**
```css
.cyklus-overlay__sector-label {
font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 0.75rem;
}
```

---

## `.cyklus-page`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\effects.css, src\styles\cyklus\foundation.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css, src\styles\cyklus\themes.css, src\styles\cyklus\tokens.css
- **Used in:** 3 occurrences across 3 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `/* Final card geometry and the shared card-bound modal layer. */

.cyklus-page > .cyklus-root--playing:not(.cyklus-root--menu)`, `/* Compact active-run layout. Imported last so legacy breakpoints cannot reclaim space. */

.cyklus-page`, `.cyklus-page::after`
- **Usage sample:**
  - `app\cyklus\page.test.tsx`
  - `app\cyklus\page.tsx`
  - `app\publicDiscovery.test.ts`
- **Selector:** `.cyklus-page button,
.cyklus-void-page button`
- **CSS body (primary):**
```css
.cyklus-page {
transition: color var(--cy-ease), background-color var(--cy-ease), border-color var(--cy-ease), box-shadow var(--cy-ease), opacity var(--cy-ease), transform 90ms ease;
}
```

---

## `.cyklus-panel-header`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-dashboard-hero,
.cyklus-panel-header`, `.void-hub-section-header,
.cyklus-dashboard-hero,
.cyklus-panel-header`, `.void-hub-section-header h3,
.cyklus-dashboard-hero h2,
.cyklus-panel-header h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketPanel.tsx`
- **Selector:** `.void-hub-section-header h3,
.cyklus-dashboard-hero h2,
.cyklus-panel-header h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`
- **CSS body (primary):**
```css
.cyklus-panel-header {
margin: 0;
  color: var(--cy-text);
  font-size: clamp(1rem, 2vw, 1.25rem);
  letter-spacing: 0.04em;
  text-shadow: none;
}
```

---

## `.cyklus-panel-kicker`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css
- **Used in:** 11 occurrences across 4 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-overlay--void-hub .cyklus-panel-kicker`, `}

/* Patch v17: Progression Dashboard & Pocket Panel styles */
.cyklus-panel-kicker`, `.cyklus-page :is(
  .cyklus-active-objective__label,
  .cyklus-card__category,
  .cyklus-card__context,
  .cyklus-outcome__label,
  .cyklus-end__system-label,
  .cyklus-end__section-label,
  .cyklus-end-summary__eyebrow,
  .cyklus-end-summary__label,
  .cyklus-reward__system-label,
  .cyklus-reward__section-label,
  .cyklus-stat-chip__label,
  .cyklus-footer__label,
  .cyklus-build__intro-label
),
.cyklus-void-page :is(
  .cyklus-panel-kicker,
  .void-hub-status-rail small,
  .void-hub-tab > small,
  .void-hub-focus__button > small,
  .cyklus-void-client-status
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketPanel.tsx`
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
  - `src\components\cyklus\CyklusVoidHub.tsx`
  - `src\components\cyklus\CyklusVoidHubClient.tsx`
- **Selector:** `}

/* Patch v17: Progression Dashboard & Pocket Panel styles */
.cyklus-panel-kicker`
- **CSS body (primary):**
```css
.cyklus-panel-kicker {
margin: 0 0 0.25rem;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  color: rgba(0, 255, 255, 0.72);
  text-transform: uppercase;
}
```

---

## `.cyklus-pocket--header`

- **Status:** defined
- **CSS files:** src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-game-header:has(.cyklus-pocket--header .cyklus-pocket__toggle[aria-expanded='true'])`, `.cyklus-pocket--header`, `.cyklus-pocket--header .cyklus-pocket__toggle`
- **Selector:** `.cyklus-pocket--header .cyklus-pocket__panel`
- **CSS body (primary):**
```css
.cyklus-pocket--header {
position: fixed;
  top: calc(env(safe-area-inset-top) + 45px);
  right: max(8px, env(safe-area-inset-right));
  left: auto;
  width: min(360px, calc(100vw - 16px));
  max-height: min(62dvh, 420px);
  border: 1px solid var(--cy-line-strong);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow);
}
```

---

## `.cyklus-pocket--highlight`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-pocket-highlight
- **Selectors (sample):** `}

.cyklus-pocket--highlight .cyklus-pocket__toggle,
.cyklus-pocket--highlight .cyklus-pocket__count`, `}

.cyklus-pocket--highlight .cyklus-pocket__toggle,
.cyklus-pocket--highlight .cyklus-pocket__count`, `.cyklus-pocket--highlight .cyklus-pocket__count`
- **Selector:** `}

.cyklus-pocket--highlight .cyklus-pocket__toggle,
.cyklus-pocket--highlight .cyklus-pocket__count`
- **CSS body (primary):**
```css
.cyklus-pocket--highlight {
animation: cyklus-pocket-highlight 1.4s ease-in-out infinite;
}
```

---

## `.cyklus-pocket--mood-angry`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-pocket-angry
- **Selectors (sample):** `.cyklus-pocket--mood-angry .cyklus-pocket__count`
- **Selector:** `.cyklus-pocket--mood-angry .cyklus-pocket__count`
- **CSS body (primary):**
```css
.cyklus-pocket--mood-angry {
border-color: rgba(255, 80, 60, 0.45);
  background: rgba(255, 50, 30, 0.12);
  animation: cyklus-pocket-angry 1.5s ease-in-out infinite;
}
```

---

## `.cyklus-pocket--mood-ready`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-pocket--mood-ready .cyklus-pocket__count`
- **Selector:** `.cyklus-pocket--mood-ready .cyklus-pocket__count`
- **CSS body (primary):**
```css
.cyklus-pocket--mood-ready {
border-color: rgba(80, 220, 130, 0.45);
  background: rgba(0, 200, 80, 0.12);
  box-shadow: 0 0 10px rgba(80, 220, 130, 0.12);
}
```

---

## `.cyklus-pocket--mood-unstable`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-pocket-pulse
- **Selectors (sample):** `.cyklus-pocket--mood-unstable .cyklus-pocket__count`
- **Selector:** `.cyklus-pocket--mood-unstable .cyklus-pocket__count`
- **CSS body (primary):**
```css
.cyklus-pocket--mood-unstable {
border-color: rgba(200, 80, 255, 0.45);
  background: rgba(180, 50, 255, 0.12);
  animation: cyklus-pocket-pulse 2.5s ease-in-out infinite;
}
```

---

## `.cyklus-pocket--mood-warm`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

.cyklus-pocket--mood-warm .cyklus-pocket__count`
- **Selector:** `}

.cyklus-pocket--mood-warm .cyklus-pocket__count`
- **CSS body (primary):**
```css
.cyklus-pocket--mood-warm {
border-color: rgba(255, 200, 80, 0.45);
  background: rgba(255, 180, 0, 0.12);
  box-shadow: 0 0 10px rgba(255, 200, 80, 0.12);
}
```

---

## `.cyklus-pocket--mood-watching`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-pocket--mood-watching .cyklus-pocket__count`
- **Selector:** `.cyklus-pocket--mood-watching .cyklus-pocket__count`
- **CSS body (primary):**
```css
.cyklus-pocket--mood-watching {
border-color: rgba(120, 160, 255, 0.45);
  background: rgba(80, 120, 255, 0.12);
  box-shadow: 0 0 10px rgba(120, 160, 255, 0.12);
}
```

---

## `.cyklus-pocket--standalone`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-pocket--standalone`, `.cyklus-pocket--standalone`, `.cyklus-pocket--standalone,
.cyklus-nav-panel,
.cyklus-footer`
- **Selector:** `.cyklus-pocket--standalone,
.cyklus-nav-panel,
.cyklus-footer`
- **CSS body (primary):**
```css
.cyklus-pocket--standalone {
border: 1px solid var(--cy-line);
  border-radius: var(--cy-radius);
  background: var(--cy-panel);
  box-shadow: none;
}
```

---

## `.cyklus-pocket-column`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-overlay--void-hub .progression-card,
  .cyklus-overlay--void-hub .cyklus-pocket-column`, `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`, `.cyklus-pocket-column,
.progression-card,
.cyklus-suggestion-box`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketPanel.tsx`
- **Selector:** `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`
- **CSS body (primary):**
```css
.cyklus-pocket-column {
margin: 0 0 0.65rem;
  color: #c0faff;
  text-shadow: 0 0 14px rgba(0, 255, 255, 0.16);
}
```

---

## `.cyklus-pocket-panel`

- **Status:** defined
- **CSS files:** src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-history,
  .cyklus-end-summary__full-log,
  .cyklus-stat-popup__body,
  .cyklus-diag-drawer,
  .cyklus-discovery,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-reward
),
.cyklus-void-page :is(
  .cyklus-void-client-status,
  .void-hub-tab-panel,
  [role="tabpanel"],
  .cyklus-pocket-panel,
  .cyklus-progression-dashboard
)`, `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`, `.cyklus-progression-dashboard,
.cyklus-pocket-panel`
- **Selector:** `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`
- **CSS body (primary):**
```css
.cyklus-pocket-panel {
margin: 0 0 0.65rem;
  color: #c0faff;
  text-shadow: 0 0 14px rgba(0, 255, 255, 0.16);
}
```

---

## `.cyklus-pocket-trigger`

- **Status:** defined
- **CSS files:** src\styles\cyklus\compact-mobile.css, src\styles\cyklus\hud.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-bottom-nav__btn:not(.cyklus-pocket-trigger) .cyklus-bottom-nav__label`, `.cyklus-pocket-trigger`, `.cyklus-pocket-trigger .cyklus-bottom-nav__label`
- **Usage sample:**
  - `src\components\cyklus\CyklusMobileUtilityDock.tsx`
  - `src\components\cyklus\CyklusPocketDock.tsx`
- **Selector:** `.cyklus-pocket-trigger.is-active,
.cyklus-pocket-trigger[aria-pressed='true']`
- **CSS body (primary):**
```css
.cyklus-pocket-trigger {
box-shadow: inset 0 -2px 0 var(--cy-accent-primary);
}
```

---

## `.cyklus-pocket__activate`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\shell.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-pocket__activate`, `.cyklus-pocket__activate:disabled`, `/* ── ACCESSIBILITY & REDUCED MOTION ──────────────────────────────────────────── */

.cyklus-btn:focus-visible,
.cyklus-pocket__toggle:focus-visible,
.cyklus-pocket__activate:focus-visible,
.cyklus-stat-chip:focus-visible,
.cyklus-footer__button:focus-visible,
.cyklus-menu__button:focus-visible`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketDock.tsx`
- **Selector:** `.cyklus-pocket__activate`
- **CSS body (primary):**
```css
.cyklus-pocket__activate {
margin-top: 0.4rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  background: rgba(123, 237, 159, 0.12);
  border: 1px solid rgba(123, 237, 159, 0.3);
  border-radius: 0.35rem;
  color: var(--accent-success, #7bed9f);
  cursor: pointer;
}
```

---

## `.cyklus-pocket__count`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** cyklus-pocket-highlight
- **Selectors (sample):** `.cyklus-pocket__count`, `}

.cyklus-pocket--highlight .cyklus-pocket__toggle,
.cyklus-pocket--highlight .cyklus-pocket__count`, `.cyklus-pocket--highlight .cyklus-pocket__count`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketDock.tsx`
- **Selector:** `}

.cyklus-pocket--highlight .cyklus-pocket__toggle,
.cyklus-pocket--highlight .cyklus-pocket__count`
- **CSS body (primary):**
```css
.cyklus-pocket__count {
animation: cyklus-pocket-highlight 1.4s ease-in-out infinite;
}
```

---

## `.cyklus-pocket__item`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-pocket__item`, `.cyklus-card,
  .cyklus-btn,
  .cyklus-stat-chip,
  .cyklus-pocket__item,
  .cyklus-pocket__count`, `.cyklus-pocket__item`
- **Selector:** `.cyklus-pocket__item`
- **CSS body (primary):**
```css
.cyklus-pocket__item {
min-width: 0;
  border: 0;
  border-left: 2px solid var(--cy-line-strong);
  border-radius: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--cy-accent-system) 4.5%, transparent), transparent 72%);
  overflow-wrap: anywhere;
}
```

---

## `.cyklus-pocket__item--angry`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-pocket-angry
- **Selectors (sample):** `.cyklus-pocket__item--angry`
- **Selector:** `.cyklus-pocket__item--angry`
- **CSS body (primary):**
```css
.cyklus-pocket__item--angry {
border-color: rgba(255, 80, 60, 0.25); background: rgba(255, 50, 30, 0.04); animation: cyklus-pocket-angry 1.5s ease-in-out infinite;
}
```

---

## `.cyklus-pocket__item--unstable`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-pocket-pulse
- **Selectors (sample):** `.cyklus-pocket__item--unstable`
- **Selector:** `.cyklus-pocket__item--unstable`
- **CSS body (primary):**
```css
.cyklus-pocket__item--unstable {
border-color: rgba(200, 80, 255, 0.25); background: rgba(180, 50, 255, 0.03); animation: cyklus-pocket-pulse 2.5s ease-in-out infinite;
}
```

---

## `.cyklus-pocket__item-mood`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-pocket__item-mood`, `.cyklus-pocket__item-mood,
.cyklus-pocket__item-hint,
.cyklus-build__next-step-label,
.cyklus-footer__label`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketDock.tsx`
- **Selector:** `.cyklus-pocket__item-mood`
- **CSS body (primary):**
```css
.cyklus-pocket__item-mood {
font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  grid-column: 2;
  grid-row: 1;
  text-align: right;
  align-self: center;
}
```

---

## `.cyklus-pocket__panel`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-pocket__panel`, `.cyklus-pocket__panel`, `.cyklus-pocket--header .cyklus-pocket__panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketDock.tsx`
- **Selector:** `.cyklus-pocket--header .cyklus-pocket__panel`
- **CSS body (primary):**
```css
.cyklus-pocket__panel {
position: fixed;
  top: calc(env(safe-area-inset-top) + 45px);
  right: max(8px, env(safe-area-inset-right));
  left: auto;
  width: min(360px, calc(100vw - 16px));
  max-height: min(62dvh, 420px);
  border: 1px solid var(--cy-line-strong);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow);
}
```

---

## `.cyklus-pocket__toggle`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-pocket__toggle`, `.cyklus-pocket__toggle:hover`, `}

.cyklus-pocket--highlight .cyklus-pocket__toggle,
.cyklus-pocket--highlight .cyklus-pocket__count`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketDock.tsx`
- **Selector:** `.cyklus-pocket__toggle`
- **CSS body (primary):**
```css
.cyklus-pocket__toggle {
display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.2rem 0;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  opacity: 0.7;
  transition: opacity 0.15s;
}
```

---

## `.cyklus-preview`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-preview`, `.cyklus-preview::after`, `.cyklus-preview > *`
- **Selector:** `.cyklus-preview::after`
- **CSS body (primary):**
```css
.cyklus-preview {
content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: var(--preview-accent);
  opacity: 0;
  transition: opacity 40ms linear;
}
```

---

## `.cyklus-preview__risk`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-preview__risk`, `.cyklus-preview--right .cyklus-preview__risk`, `.cyklus-preview__hint,
  .cyklus-preview__risk`
- **Selector:** `.cyklus-preview__risk`
- **CSS body (primary):**
```css
.cyklus-preview__risk {
align-self: flex-start;
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  padding: 0.15rem 0.4rem;
  border-radius: 0.25rem;
  background: var(--bg-glass);
}
```

---

## `.cyklus-progression-dashboard`

- **Status:** defined
- **CSS files:** src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-history,
  .cyklus-end-summary__full-log,
  .cyklus-stat-popup__body,
  .cyklus-diag-drawer,
  .cyklus-discovery,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-reward
),
.cyklus-void-page :is(
  .cyklus-void-client-status,
  .void-hub-tab-panel,
  [role="tabpanel"],
  .cyklus-pocket-panel,
  .cyklus-progression-dashboard
)`, `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`, `.cyklus-progression-dashboard,
.cyklus-pocket-panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
- **Selector:** `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`
- **CSS body (primary):**
```css
.cyklus-progression-dashboard {
margin: 0 0 0.65rem;
  color: #c0faff;
  text-shadow: 0 0 14px rgba(0, 255, 255, 0.16);
}
```

---

## `.cyklus-reward`

- **Status:** defined
- **CSS files:** src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-history,
  .cyklus-end-summary__full-log,
  .cyklus-stat-popup__body,
  .cyklus-diag-drawer,
  .cyklus-discovery,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-reward
),
.cyklus-void-page :is(
  .cyklus-void-client-status,
  .void-hub-tab-panel,
  [role="tabpanel"],
  .cyklus-pocket-panel,
  .cyklus-progression-dashboard
)`, `}

/* ── REWARD SECTION ──────────────────────────────────────────── */

.cyklus-reward`, `.cyklus-reward`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-reward`
- **CSS body (primary):**
```css
.cyklus-reward {
margin-top: var(--cy-space-4);
  padding: 0;
  border: 0;
  border-top: 1px solid var(--cy-line-yellow);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.cyklus-reward__advice`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-reward__advice`, `.cyklus-reward__header,
.cyklus-reward__special,
.cyklus-reward__unlocks,
.cyklus-reward__purse,
.cyklus-reward__advice`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-reward__advice {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-reward__flavor`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-reward__flavor`, `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-outcome__story,
  .cyklus-end-summary__text,
  .cyklus-end-summary__muted,
  .cyklus-end-summary__steps,
  .cyklus-reward__flavor,
  .cyklus-death-analysis__comment,
  .cyklus-behavioral__pattern,
  .cyklus-pocket__item-text,
  .cyklus-pocket__item-hint,
  .cyklus-build__next-step,
  .cyklus-goal__desc,
  .cyklus-contract__row,
  .cyklus-discovery__row,
  .cyklus-history__details,
  .cyklus-stat-popup__body
),
.cyklus-void-page :is(
  .void-hub-hero p,
  .void-hub-return-summary p,
  .void-hub-next-action p,
  .void-hub-focus p,
  .void-hub-section-header p,
  .cyklus-dashboard-hero p,
  .cyklus-pocket-panel p,
  .pocket-item-row p,
  .craft-recipe-row p,
  .void-room-row p,
  .loadout-entry p,
  .cyklus-empty-note,
  .pocket-ambient-text
)`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-reward__flavor {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-reward__reason`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`, `.cyklus-reward__reason`, `.cyklus-reward__reason::before`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end-summary__text,
.cyklus-end-summary__muted,
.cyklus-end-summary__steps,
.cyklus-end-summary__row > :first-child,
.cyklus-reward__flavor,
.cyklus-reward__reason,
.cyklus-reward__advice,
.cyklus-end__text,
.cyklus-end__survival-reasons,
.cyklus-death-analysis__text,
.cyklus-behavioral__text,
.cyklus-finding__desc,
.cyklus-meta-unlock__reason,
.cyklus-end__near-extreme-note`
- **CSS body (primary):**
```css
.cyklus-reward__reason {
font-family: var(--font-family-primary), system-ui, sans-serif;
  text-transform: none;
}
```

---

## `.cyklus-reward__residuum-value`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-reward__residuum-value`, `.cyklus-reward__residuum-value,
.cyklus-reward__currency-value,
.cyklus-reward__purse-value`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-reward__residuum-value`
- **CSS body (primary):**
```css
.cyklus-reward__residuum-value {
font-size: 2rem;
  font-weight: 800;
  color: var(--accent-success, #7bed9f);
  text-shadow: 0 0 18px rgba(123, 237, 159, 0.25);
}
```

---

## `.cyklus-reward__section-label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 10 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-reward__section-label`, `.cyklus-end__system-label,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-reward__section-label`
- **CSS body (primary):**
```css
.cyklus-reward__section-label {
font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--text-tertiary);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}
```

---

## `.cyklus-reward__system-label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\end-report.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`, `.cyklus-reward__system-label`, `.cyklus-end__system-label,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-end__system-label,
.cyklus-end__codename,
.cyklus-end__section-label,
.cyklus-end-summary__eyebrow,
.cyklus-end-summary__label,
.cyklus-reward__system-label,
.cyklus-reward__section-label,
.cyklus-end__diagnostics-summary`
- **CSS body (primary):**
```css
.cyklus-reward__system-label {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.cyklus-root--menu`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\legacy.css, src\styles\cyklus\menu-polish.css, src\styles\cyklus\shell.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* Final card geometry and the shared card-bound modal layer. */

.cyklus-page > .cyklus-root--playing:not(.cyklus-root--menu)`, `.cyklus-root--menu`, `/* Final boot menu hierarchy. */

.cyklus-root--menu .cyklus-menu`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-root--menu::after`
- **CSS body (primary):**
```css
.cyklus-root--menu {
content: "";
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--cy-bg) 32%, transparent), color-mix(in srgb, var(--cy-bg) 16%, transparent) 48%, transparent 78%),
    linear-gradient(180deg, color-mix(in srgb, var(--cy-accent-system) 3%, transparent), transparent 28%, color-mix(in srgb, var(--cy-accent-memory) 2.5%, transparent));
}
```

---

## `.cyklus-stage`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\legacy.css, src\styles\cyklus\outcome.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css, src\styles\cyklus\trace-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-root--playing > .cyklus-stage`, `.cyklus-root--playing > .cyklus-stage`, `.cyklus-stage`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-stage > .cyklus-active-objective--popover`
- **CSS body (primary):**
```css
.cyklus-stage {
position: absolute;
    inset: var(--cy-space-2) var(--cy-space-2) auto auto;
    z-index: var(--cy-z-sheet);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    width: min(420px, calc(100% - (2 * var(--cy-space-2))));
    max-width: 420px;
    max-height: calc(100% - (2 * var(--cy-space-2)));
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--cy-line-strong);
    border-left: 2px solid var(--cy-cyan);
    border-radius: 0;
    background:
      repeating-linear-gradient(0deg, transparent 0 3px, var(--cy-scanline-color) 3px 4px),
      var(--cy-panel-solid);
    …
}
```

---

## `.cyklus-stat-chip`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\cycle-notices.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-root--playing > .cyklus-stat-dock .cyklus-stat-chip`, `.cyklus-stat-chip`, `.cyklus-stat-chip`
- **Selector:** `.cyklus-stat-chip:hover,
.cyklus-stat-chip:focus-visible,
.cyklus-stat-chip[aria-pressed="true"]`
- **CSS body (primary):**
```css
.cyklus-stat-chip {
z-index: 1;
  border: 0;
  background: var(--cy-button-hover);
  box-shadow: inset 0 0 0 1px var(--stat-accent);
}
```

---

## `.cyklus-stat-chip--changed`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-chip-flash
- **Selectors (sample):** `.cyklus-stat-chip--changed .cyklus-stat-chip__value`, `.cyklus-stat-chip--changed`, `.cyklus-stat-chip--changed .cyklus-stat-chip__value`
- **Selector:** `.cyklus-stat-chip--changed`
- **CSS body (primary):**
```css
.cyklus-stat-chip--changed {
animation: cyklus-chip-flash 0.7s ease;
}
```

---

## `.cyklus-stat-chip--high-danger`

- **Status:** defined
- **CSS files:** src\styles\cyklus\effects.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-mobile-hud__risk--critical,
.cyklus-stat-chip--low-danger::after,
.cyklus-stat-chip--high-danger::after`, `.cyklus-stat-chip--low-danger,
.cyklus-stat-chip--high-danger`, `.cyklus-stat-chip--low-danger .cyklus-stat-chip__status,
.cyklus-stat-chip--high-danger .cyklus-stat-chip__status`
- **Selector:** `.cyklus-stat-chip--high-danger`
- **CSS body (primary):**
```css
.cyklus-stat-chip--high-danger {
border-color: rgba(255, 140, 30, 0.5);
  box-shadow: 0 0 14px rgba(255, 140, 30, 0.14);
  color: #ffd080;
}
```

---

## `.cyklus-stat-chip--highlight`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, animation
- **Animations:** cyklus-stat-highlight
- **Selectors (sample):** `.cyklus-stat-dock--highlighted,
.cyklus-stat-chip--highlight`, `.cyklus-stat-chip--highlight`
- **Selector:** `.cyklus-stat-chip--highlight`
- **CSS body (primary):**
```css
.cyklus-stat-chip--highlight {
animation: cyklus-stat-highlight 1.6s ease-in-out infinite;
  border-color: rgba(123, 237, 159, 0.55);
  box-shadow: 0 0 18px rgba(123, 237, 159, 0.18);
}
```

---

## `.cyklus-stat-chip--low-danger`

- **Status:** defined
- **CSS files:** src\styles\cyklus\effects.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-mobile-hud__risk--critical,
.cyklus-stat-chip--low-danger::after,
.cyklus-stat-chip--high-danger::after`, `.cyklus-stat-chip--low-danger,
.cyklus-stat-chip--high-danger`, `.cyklus-stat-chip--low-danger .cyklus-stat-chip__status,
.cyklus-stat-chip--high-danger .cyklus-stat-chip__status`
- **Selector:** `.cyklus-stat-chip--low-danger,
.cyklus-stat-chip--high-danger`
- **CSS body (primary):**
```css
.cyklus-stat-chip--low-danger {
--stat-accent: var(--cy-yellow);
  background: color-mix(in srgb, var(--cy-accent-warning) 4%, transparent);
}
```

---

## `.cyklus-stat-chip__bar`

- **Status:** defined
- **CSS files:** src\styles\cyklus\compact-mobile.css, src\styles\cyklus\cycle-notices.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-stat-chip__bar`, `.cyklus-stat-chip__bar`, `.cyklus-stat-chip__bar`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip__bar`
- **CSS body (primary):**
```css
.cyklus-stat-chip__bar {
grid-area: bar;
  position: relative;
  height: 8px;
  border-radius: 0;
  overflow: visible;
  background: color-mix(in srgb, var(--cy-text) 10%, transparent);
}
```

---

## `.cyklus-stat-chip__center`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-stat-chip__center`, `.cyklus-stat-chip__center`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip__center`
- **CSS body (primary):**
```css
.cyklus-stat-chip__center {
top: -2px;
  bottom: -2px;
  width: 1px;
  background: color-mix(in srgb, var(--cy-text) 80%, transparent);
}
```

---

## `.cyklus-stat-chip__fill`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform, color-mix
- **Selectors (sample):** `.cyklus-stat-chip__fill`, `.cyklus-stat-chip__fill`
- **Selector:** `.cyklus-stat-chip__fill`
- **CSS body (primary):**
```css
.cyklus-stat-chip__fill {
position: absolute;
  top: 50%;
  left: 0;
  width: var(--stat-fill-pct);
  height: 1px;
  border-radius: 0;
  background: var(--stat-accent) !important;
  box-shadow: 0 0 10px color-mix(in srgb, var(--stat-accent), transparent 45%);
  opacity: 0.62;
  transform: translateY(-50%);
}
```

---

## `.cyklus-stat-chip__label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\compact-mobile.css, src\styles\cyklus\cycle-notices.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-stat-chip__label`, `.cyklus-stat-chip__label`, `.cyklus-stat-chip__label`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip__label`
- **CSS body (primary):**
```css
.cyklus-stat-chip__label {
font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.72;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## `.cyklus-stat-chip__marker`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform, color-mix
- **Selectors (sample):** `.cyklus-stat-chip__marker`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip__marker`
- **CSS body (primary):**
```css
.cyklus-stat-chip__marker {
position: absolute;
  top: -3px;
  bottom: -3px;
  left: clamp(1px, var(--stat-fill-pct), calc(100% - 1px));
  z-index: 3;
  width: 2px;
  background: var(--stat-accent);
  box-shadow: 0 0 8px color-mix(in srgb, var(--stat-accent) 70%, transparent);
  transform: translateX(-1px);
}
```

---

## `.cyklus-stat-chip__safe-zone`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-stat-chip__safe-zone`, `.cyklus-stat-chip__safe-zone`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip__safe-zone`
- **CSS body (primary):**
```css
.cyklus-stat-chip__safe-zone {
position: absolute;
  inset-block: 0;
  left: 20%;
  width: 60%;
  border-inline: 1px solid color-mix(in srgb, var(--cy-accent-system) 46%, transparent);
  background: color-mix(in srgb, var(--cy-accent-system) 8%, transparent);
}
```

---

## `.cyklus-stat-chip__status`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\cycle-notices.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-root--playing > .cyklus-stat-dock .cyklus-stat-chip__status`, `.cyklus-stat-chip__status`, `.cyklus-stat-chip__status`
- **Selector:** `.cyklus-stat-chip__status`
- **CSS body (primary):**
```css
.cyklus-stat-chip__status {
font-size: 0.56rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.65;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

## `.cyklus-stat-chip__value`

- **Status:** defined
- **CSS files:** src\styles\cyklus\compact-mobile.css, src\styles\cyklus\cycle-notices.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** cyklus-stat-flash
- **Selectors (sample):** `.cyklus-stat-chip__value`, `.cyklus-stat-chip__value`, `.cyklus-stat-chip__value`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip--changed .cyklus-stat-chip__value`
- **CSS body (primary):**
```css
.cyklus-stat-chip__value {
animation: cyklus-stat-flash 0.7s ease;
}
```

---

## `.cyklus-stat-chip__zone--high`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-stat-chip__zone--high`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip__zone--high`
- **CSS body (primary):**
```css
.cyklus-stat-chip__zone--high {
right: 0;
  width: 20%;
  background: color-mix(in srgb, var(--cy-accent-warning) 18%, transparent);
}
```

---

## `.cyklus-stat-chip__zone--low`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-stat-chip__zone--low`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-chip__zone--low`
- **CSS body (primary):**
```css
.cyklus-stat-chip__zone--low {
left: 0;
  width: 20%;
  background: color-mix(in srgb, var(--cy-accent-warning) 18%, transparent);
}
```

---

## `.cyklus-stat-dock`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\card.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\cycle-notices.css, src\styles\cyklus\hud.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\responsive.css, src\styles\cyklus\shell.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-root--playing > .cyklus-stat-dock`, `.cyklus-root--playing > .cyklus-stat-dock > :is(.cyklus-stat-dock__climate, .cyklus-tutorial-progress)`, `.cyklus-root--playing > .cyklus-stat-dock .cyklus-stat-chip`
- **Selector:** `.cyklus-stat-dock`
- **CSS body (primary):**
```css
.cyklus-stat-dock {
display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
  padding: 1px;
  border: 1px solid var(--cy-line);
  border-radius: var(--cy-radius);
  background: var(--cy-line-dim);
  box-shadow: none;
}
```

---

## `.cyklus-stat-dock--highlighted`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-stat-dock--highlighted,
.cyklus-stat-chip--highlight`, `.cyklus-stat-dock--highlighted`
- **Selector:** `.cyklus-stat-dock--highlighted,
.cyklus-stat-chip--highlight`
- **CSS body (primary):**
```css
.cyklus-stat-dock--highlighted {
border-color: var(--cy-yellow);
  box-shadow: var(--cy-glow-yellow);
}
```

---

## `.cyklus-stat-dock__climate-label`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-stat-dock__climate-label`, `.cyklus-stat-dock__climate-label`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-dock__climate-label`
- **CSS body (primary):**
```css
.cyklus-stat-dock__climate-label {
font-size: 0.55rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  flex-shrink: 0;
}
```

---

## `.cyklus-stat-dock__trace-trigger`

- **Status:** defined
- **CSS files:** src\styles\cyklus\trace-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-stat-dock__trace-trigger`, `.cyklus-stat-dock__trace-trigger:hover,
  .cyklus-stat-dock__trace-trigger:focus-visible,
  .cyklus-stat-dock__trace-trigger[aria-expanded="true"]`, `.cyklus-stat-dock__trace-trigger:hover,
  .cyklus-stat-dock__trace-trigger:focus-visible,
  .cyklus-stat-dock__trace-trigger[aria-expanded="true"]`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-dock__trace-trigger:hover,
  .cyklus-stat-dock__trace-trigger:focus-visible,
  .cyklus-stat-dock__trace-trigger[aria-expanded="true"]`
- **CSS body (primary):**
```css
.cyklus-stat-dock__trace-trigger {
background: var(--cy-button-hover);
    box-shadow: inset 0 -2px 0 var(--cy-cyan);
}
```

---

## `.cyklus-stat-popup`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-stat-popup`, `.cyklus-stat-popup`, `.cyklus-stat-popup`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-popup`
- **CSS body (primary):**
```css
.cyklus-stat-popup {
width: min(100%, 440px);
  max-width: 440px;
  max-height: min(84dvh, 720px);
  border: 1px solid var(--cy-line-strong);
  border-radius: var(--cy-radius);
  overflow: auto;
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-glow-cyan);
}
```

---

## `.cyklus-stat-popup-backdrop`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter, color-mix
- **Selectors (sample):** `.cyklus-overlay__backdrop,
.cyklus-bottom-sheet__dismiss,
.cyklus-stat-popup-backdrop`, `.cyklus-stat-popup-backdrop`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-overlay__backdrop,
.cyklus-bottom-sheet__dismiss,
.cyklus-stat-popup-backdrop`
- **CSS body (primary):**
```css
.cyklus-stat-popup-backdrop {
position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 0;
  background:
    radial-gradient(ellipse at 18% 12%, color-mix(in srgb, var(--cy-accent-system) 7%, transparent), transparent 42%),
    radial-gradient(ellipse at 84% 88%, color-mix(in srgb, var(--cy-accent-memory) 6%, transparent), transparent 38%),
    var(--cy-overlay-backdrop);
  cursor: default;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
```

---

## `.cyklus-stat-popup-overlay`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `.cyklus-stat-popup-overlay`, `.cyklus-stat-popup-overlay`, `}

/* ── STAT POPUP ──────────────────────────────────────────────────────────────── */

.cyklus-stat-popup-overlay`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-popup-overlay`
- **CSS body (primary):**
```css
.cyklus-stat-popup-overlay {
z-index: var(--cy-z-modal);
  padding: var(--cy-space-4);
  background: var(--cy-overlay-backdrop);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
```

---

## `.cyklus-stat-popup__close`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-stat-popup__close`, `.cyklus-stat-popup__close`, `.cyklus-stat-popup__close:hover`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-popup__close`
- **CSS body (primary):**
```css
.cyklus-stat-popup__close {
background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0 0.2rem;
  line-height: 1;
  transition: color 0.15s;
}
```

---

## `.cyklus-stat-popup__danger--critical-high`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-stat-danger-pulse
- **Selectors (sample):** `.cyklus-stat-popup__danger--critical-high,
.cyklus-stat-popup__danger--warn-high`, `.cyklus-stat-popup__danger--critical-low,
.cyklus-stat-popup__danger--critical-high`
- **Selector:** `.cyklus-stat-popup__danger--critical-low,
.cyklus-stat-popup__danger--critical-high`
- **CSS body (primary):**
```css
.cyklus-stat-popup__danger--critical-high {
animation: cyklus-stat-danger-pulse 1.6s ease-in-out infinite;
}
```

---

## `.cyklus-stat-popup__danger--critical-low`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-stat-danger-pulse
- **Selectors (sample):** `.cyklus-stat-popup__danger--critical-low,
.cyklus-stat-popup__danger--warn-low`, `.cyklus-stat-popup__danger--critical-low,
.cyklus-stat-popup__danger--critical-high`
- **Selector:** `.cyklus-stat-popup__danger--critical-low,
.cyklus-stat-popup__danger--critical-high`
- **CSS body (primary):**
```css
.cyklus-stat-popup__danger--critical-low {
animation: cyklus-stat-danger-pulse 1.6s ease-in-out infinite;
}
```

---

## `.cyklus-stat-popup__history-title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-stat-popup__history-title`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-popup__history-title`
- **CSS body (primary):**
```css
.cyklus-stat-popup__history-title {
font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  margin-bottom: 0.15rem;
}
```

---

## `.cyklus-stat-popup__name`

- **Status:** defined
- **CSS files:** src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-stat-popup__name`, `.cyklus-stat-popup__name`
- **Usage sample:**
  - `src\components\cyklus\StatDock.tsx`
- **Selector:** `.cyklus-stat-popup__name`
- **CSS body (primary):**
```css
.cyklus-stat-popup__name {
flex: 1;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-primary);
}
```

---

## `.cyklus-suggestion-box`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`, `.cyklus-pocket-column,
.progression-card,
.cyklus-suggestion-box`, `.pocket-item-list,
.craft-recipe-list,
.void-room-list,
.missing-reason-list,
.cyklus-suggestion-box ul`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketPanel.tsx`
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
- **Selector:** `.cyklus-suggestion-box,
.dashboard-actions`
- **CSS body (primary):**
```css
.cyklus-suggestion-box {
border-color: var(--cy-line-yellow);
  background: linear-gradient(105deg, color-mix(in srgb, var(--cy-accent-warning) 4.5%, transparent), transparent 82%);
}
```

---

## `.cyklus-system-modal`

- **Status:** defined
- **CSS files:** src\styles\cyklus\card-overlay.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** cyklus-os-modal-in
- **Selectors (sample):** `.cyklus-card-overlay__surface,
.cyklus-card-overlay__panel,
.cyklus-card-overlay .cyklus-system-modal,
.cyklus-card-overlay .cyklus-cycle-notice,
.cyklus-card-overlay .cyklus-outcome`, `.cyklus-card-overlay__surface,
  .cyklus-card-overlay__panel,
  .cyklus-card-overlay .cyklus-system-modal,
  .cyklus-card-overlay .cyklus-cycle-notice,
  .cyklus-card-overlay .cyklus-outcome`, `.cyklus-system-modal,
.cyklus-overlay__panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-system-modal,
.cyklus-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-system-modal {
position: relative;
  z-index: 1;
  width: min(100%, 680px);
  max-height: min(88dvh, 820px);
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--cy-line-strong);
  border-radius: var(--cy-radius);
  background: var(--cy-panel-solid);
  box-shadow: var(--cy-shadow), var(--cy-glow-cyan);
  color: var(--cy-text);
  scrollbar-width: thin;
  scrollbar-color: var(--cy-line-strong) var(--cy-scrollbar-track);
  animation: cyklus-os-modal-in 180ms ease-out;
}
```

---

## `.cyklus-system-modal--forecast`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-system-modal--summary,
.cyklus-system-modal--forecast,
.cyklus-overlay--discovery .cyklus-overlay__panel,
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **Selector:** `.cyklus-system-modal--summary,
.cyklus-system-modal--forecast,
.cyklus-overlay--discovery .cyklus-overlay__panel,
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-system-modal--forecast {
--modal-accent: var(--cy-magenta);
  border-color: var(--cy-line-magenta);
  box-shadow: var(--cy-shadow), var(--cy-glow-magenta);
}
```

---

## `.cyklus-system-modal--summary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-system-modal--summary,
.cyklus-system-modal--forecast,
.cyklus-overlay--discovery .cyklus-overlay__panel,
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **Selector:** `.cyklus-system-modal--summary,
.cyklus-system-modal--forecast,
.cyklus-overlay--discovery .cyklus-overlay__panel,
.cyklus-overlay--void-hub .cyklus-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-system-modal--summary {
--modal-accent: var(--cy-magenta);
  border-color: var(--cy-line-magenta);
  box-shadow: var(--cy-shadow), var(--cy-glow-magenta);
}
```

---

## `.cyklus-system-modal--warning`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-system-modal--warning,
.cyklus-overlay--build .cyklus-overlay__panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-system-modal--warning,
.cyklus-overlay--build .cyklus-overlay__panel`
- **CSS body (primary):**
```css
.cyklus-system-modal--warning {
--modal-accent: var(--cy-yellow);
  border-color: var(--cy-line-yellow);
  box-shadow: var(--cy-shadow), var(--cy-glow-yellow);
}
```

---

## `.cyklus-system-modal__header`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform, color-mix
- **Selectors (sample):** `.cyklus-system-modal__header`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-system-modal__header`
- **CSS body (primary):**
```css
.cyklus-system-modal__header {
position: sticky;
  top: 0;
  z-index: 4;
  display: flex;
  min-height: 56px;
  align-items: center;
  justify-content: space-between;
  gap: var(--cy-space-3);
  padding: var(--cy-space-2) var(--cy-space-3) var(--cy-space-2) var(--cy-space-4);
  border-bottom: 1px solid var(--cy-line);
  background: color-mix(in srgb, var(--cy-surface-1) 98%, transparent);
  color: var(--modal-accent, var(--cy-cyan-soft));
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## `.cyklus-terminal-action`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css
- **Used in:** 4 occurrences across 2 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-terminal-action`, `.cyklus-terminal-action:hover`, `.cyklus-page :is(.cyklus-btn__label, .cyklus-bottom-nav__label, .cyklus-terminal-action),
.cyklus-void-page :is(.void-hub-action-button, .void-hub-tab > span)`
- **Usage sample:**
  - `src\components\cyklus\CycleNotices.tsx`
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-terminal-action`
- **CSS body (primary):**
```css
.cyklus-terminal-action {
min-width: 0;
  min-height: var(--cy-tap);
  padding: 0.7rem var(--cy-space-3);
  border: 0;
  border-radius: 0;
  background: var(--cy-panel-solid);
  color: var(--cy-cyan-soft);
  font: 700 0.7rem/1.25 var(--cy-font-mono);
  letter-spacing: 0.07em;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}
```

---

## `.cyklus-terminal-action--warning`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-terminal-action--warning`, `.cyklus-terminal-action--warning:hover`, `.cyklus-page :is(.cyklus-footer__button--restart, .cyklus-terminal-action--warning):focus-visible,
.cyklus-void-page :is(.craft-recipe-row .void-hub-action-button, .void-room-row .void-hub-action-button):focus-visible`
- **Usage sample:**
  - `src\components\cyklus\CyklusClient.tsx`
- **Selector:** `.cyklus-terminal-action--warning:hover`
- **CSS body (primary):**
```css
.cyklus-terminal-action--warning {
background: color-mix(in srgb, var(--cy-accent-warning) 7%, transparent);
  box-shadow: inset 0 -1px var(--cy-yellow);
}
```

---

## `.cyklus-void-button`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-void-button`, `.cyklus-void-button:hover:not(:disabled)`, `.cyklus-void-button:active:not(:disabled)`
- **Selector:** `.cyklus-void-button`
- **CSS body (primary):**
```css
.cyklus-void-button {
flex: 1 1 auto;
  padding: 0.55rem 0.85rem;
  background: rgba(0, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #00ffff;
  font-size: 0.75rem;
  letter-spacing: 0.09em;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all 0.18s ease;
  font-weight: 600;
}
```

---

## `.cyklus-void-button--danger`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-void-button--danger`, `.cyklus-void-button--danger:hover:not(:disabled)`
- **Selector:** `.cyklus-void-button--danger:hover:not(:disabled)`
- **CSS body (primary):**
```css
.cyklus-void-button--danger {
background: rgba(255, 0, 80, 0.16);
  border-color: rgba(255, 0, 80, 0.55);
  box-shadow: 0 0 12px rgba(255, 0, 80, 0.2);
}
```

---

## `.cyklus-void-button--primary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-void-button--primary`, `.cyklus-void-button--primary:hover:not(:disabled)`
- **Selector:** `.cyklus-void-button--primary:hover:not(:disabled)`
- **CSS body (primary):**
```css
.cyklus-void-button--primary {
background: rgba(123, 237, 159, 0.2);
  border-color: rgba(123, 237, 159, 0.6);
  box-shadow: 0 0 12px rgba(123, 237, 159, 0.18);
}
```

---

## `.cyklus-void-card`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `}

.cyklus-void-card`, `.cyklus-void-card::before`, `.cyklus-void-card:hover`
- **Selector:** `.cyklus-void-card:hover`
- **CSS body (primary):**
```css
.cyklus-void-card {
transform: translateY(-2px);
  border-color: rgba(0, 255, 255, 0.35);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 16px rgba(0, 255, 255, 0.08);
  background: rgba(25, 25, 45, 0.65);
}
```

---

## `.cyklus-void-card--available`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-void-card--available`
- **Selector:** `.cyklus-void-card--available`
- **CSS body (primary):**
```css
.cyklus-void-card--available {
border-color: rgba(123, 237, 159, 0.4);
  box-shadow: 0 0 12px rgba(123, 237, 159, 0.06);
}
```

---

## `.cyklus-void-card--equipped`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-void-card--equipped`, `.cyklus-void-card--equipped::after`
- **Selector:** `.cyklus-void-card--equipped`
- **CSS body (primary):**
```css
.cyklus-void-card--equipped {
border-color: rgba(0, 255, 255, 0.6);
  box-shadow: 0 0 18px rgba(0, 255, 255, 0.12), inset 0 0 20px rgba(0, 255, 255, 0.04);
  background: rgba(0, 45, 60, 0.5);
}
```

---

## `.cyklus-void-card--locked`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.cyklus-void-card--locked`
- **Selector:** `.cyklus-void-card--locked`
- **CSS body (primary):**
```css
.cyklus-void-card--locked {
opacity: 0.55;
  border-color: rgba(128, 128, 160, 0.15);
  filter: grayscale(0.35);
}
```

---

## `.cyklus-void-card--maxed`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-void-card--maxed`
- **Selector:** `.cyklus-void-card--maxed`
- **CSS body (primary):**
```css
.cyklus-void-card--maxed {
border-color: rgba(255, 0, 255, 0.45);
  background: rgba(50, 20, 55, 0.4);
  box-shadow: 0 0 14px rgba(255, 0, 255, 0.08);
}
```

---

## `.cyklus-void-card__value`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-void-card__value`
- **Selector:** `.cyklus-void-card__value`
- **CSS body (primary):**
```css
.cyklus-void-card__value {
font-size: 1.35rem;
  color: #00ffff;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.25);
}
```

---

## `.cyklus-void-client-toolbar`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-overlay--void-hub .cyklus-void-client-toolbar`, `.cyklus-overlay--void-hub .cyklus-void-client-toolbar`, `}

.cyklus-void-client-toolbar`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHubClient.tsx`
- **Selector:** `.cyklus-void-client-toolbar`
- **CSS body (primary):**
```css
.cyklus-void-client-toolbar {
display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--cy-space-4);
  align-items: center;
  min-height: 38px;
  margin: 0 0 var(--cy-space-2);
  padding: var(--cy-space-2) var(--cy-space-3);
  border: 1px solid var(--cy-line);
  border-radius: var(--cy-radius);
  background: color-mix(in srgb, var(--cy-surface-1) 94%, transparent);
  box-shadow: none;
}
```

---

## `.cyklus-void-flavour`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `}

.cyklus-void-flavour`
- **Selector:** `}

.cyklus-void-flavour`
- **CSS body (primary):**
```css
.cyklus-void-flavour {
font-size: 0.92rem;
  line-height: 1.6;
  color: var(--text-secondary);
  font-style: italic;
  border-left: 2px solid rgba(255, 0, 255, 0.4);
  padding-left: 1rem;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 0, 255, 0.05);
}
```

---

## `.cyklus-void-hub`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** blend-mode
- **Selectors (sample):** `}

/* ── VOID HUB ─────────────────────────────────────────────────────────────── */

.cyklus-void-hub`, `/* Override old fixed positioning for Void Hub in overlay context */
.cyklus-overlay--void-hub .cyklus-void-hub`, `}

/* Patch v17: Void Hub shell styles */
.cyklus-void-hub`
- **Selector:** `.cyklus-void-hub::before`
- **CSS body (primary):**
```css
.cyklus-void-hub {
content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.028) 0 1px, transparent 1px 4px);
  opacity: 0.18;
  mix-blend-mode: screen;
}
```

---

## `.cyklus-void-hub__frame`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

.cyklus-void-hub__frame`, `.cyklus-void-hub__frame::before`, `.cyklus-void-hub__frame`
- **Selector:** `.cyklus-void-hub__frame::before`
- **CSS body (primary):**
```css
.cyklus-void-hub__frame {
content: '';
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  pointer-events: none;
  box-shadow: inset 0 0 30px var(--glow-secondary, rgba(0, 255, 255, 0.01));
}
```

---

## `.cyklus-void-hub__message`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-void-message-in
- **Selectors (sample):** `.cyklus-void-hub__message`
- **Selector:** `.cyklus-void-hub__message`
- **CSS body (primary):**
```css
.cyklus-void-hub__message {
padding: 0.75rem 1.25rem;
  margin: 0;
  background: var(--bg-glass);
  border-left: 3px solid var(--accent-secondary);
  color: var(--text-secondary);
  font-size: 0.85rem;
  animation: cyklus-void-message-in 0.3s ease-out;
  flex-shrink: 0;
}
```

---

## `.cyklus-void-hub__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-void-hub__title`, `.cyklus-void-hub__title::after`, `.cyklus-void-hub__title`
- **Selector:** `.cyklus-void-hub__title`
- **CSS body (primary):**
```css
.cyklus-void-hub__title {
font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent-secondary);
  text-shadow: 0 0 6px var(--glow-secondary, rgba(0, 255, 255, 0.25)), 0 0 12px var(--glow-secondary, rgba(0, 255, 255, 0.1));
  position: relative;
}
```

---

## `.cyklus-void-page`

- **Status:** defined
- **CSS files:** src\styles\cyklus\effects.css, src\styles\cyklus\foundation.css, src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\themes.css, src\styles\cyklus\tokens.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* Low-amplitude SYNTHOMA OS motion. */

.cyklus-page::after,
.cyklus-void-page::after`, `/* Shared SYNTHOMA OS primitives. Screen-specific migration lives in sibling files. */

.cyklus-page,
.cyklus-page *,
.cyklus-page *::before,
.cyklus-page *::after,
.cyklus-void-page,
.cyklus-void-page *,
.cyklus-void-page *::before,
.cyklus-void-page *::after`, `/* Shared SYNTHOMA OS primitives. Screen-specific migration lives in sibling files. */

.cyklus-page,
.cyklus-page *,
.cyklus-page *::before,
.cyklus-page *::after,
.cyklus-void-page,
.cyklus-void-page *,
.cyklus-void-page *::before,
.cyklus-void-page *::after`
- **Usage sample:**
  - `app\cyklus\void\page.tsx`
- **Selector:** `.cyklus-void-page::before`
- **CSS body (primary):**
```css
.cyklus-void-page {
background:
    linear-gradient(var(--cy-grid-color) 1px, transparent 1px),
    linear-gradient(90deg, var(--cy-grid-color) 1px, transparent 1px),
    repeating-linear-gradient(90deg, transparent 0 19.8%, color-mix(in srgb, var(--cy-accent-memory) 2.6%, transparent) 20%, transparent 20.2%);
  background-size: 48px 48px, 48px 48px, 100% 100%;
}
```

---

## `.cyklus-void-panel`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** cyklus-void-panel-in
- **Selectors (sample):** `.cyklus-void-panel`
- **Selector:** `.cyklus-void-panel`
- **CSS body (primary):**
```css
.cyklus-void-panel {
display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: cyklus-void-panel-in 0.25s ease-out;
}
```

---

## `.cyklus-void-section__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.cyklus-void-section__title`, `.cyklus-void-section__title::before`
- **Selector:** `.cyklus-void-section__title`
- **CSS body (primary):**
```css
.cyklus-void-section__title {
font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: #ff00ff;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
```

---

## `.cyklus-void-stat`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-void-stat`, `.cyklus-void-stat:hover`
- **Selector:** `.cyklus-void-stat`
- **CSS body (primary):**
```css
.cyklus-void-stat {
padding: 0.7rem 0.9rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-tertiary);
  border-radius: 0.6rem;
  font-size: 0.82rem;
  color: var(--text-secondary);
  transition: border-color 0.2s ease, background 0.2s ease;
}
```

---

## `.cyklus-void-tab`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.cyklus-void-tab`, `.cyklus-void-tab:hover`
- **Selector:** `.cyklus-void-tab`
- **CSS body (primary):**
```css
.cyklus-void-tab {
flex: 0 0 auto;
  padding: 0.55rem 1rem;
  background: var(--bg-glass);
  border: 1px solid var(--border-tertiary);
  color: var(--text-muted);
  font-size: 0.92rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  border-radius: 999px;
  transition: all 0.2s ease;
  white-space: nowrap;
}
```

---

## `.cyklus-void-tab--active`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-void-tab--active`
- **Selector:** `.cyklus-void-tab--active`
- **CSS body (primary):**
```css
.cyklus-void-tab--active {
background: rgba(var(--bg-secondary-rgb), 0.6);
  border-color: var(--accent-secondary);
  color: var(--accent-secondary);
  box-shadow: 0 0 8px var(--glow-secondary, rgba(0, 255, 255, 0.1)), inset 0 0 4px var(--glow-secondary, rgba(0, 255, 255, 0.03));
}
```

---

## `.dashboard-actions`

- **Status:** defined
- **CSS files:** src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-suggestion-box,
.dashboard-actions`, `.dashboard-actions`
- **Usage sample:**
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
- **Selector:** `.cyklus-suggestion-box,
.dashboard-actions`
- **CSS body (primary):**
```css
.dashboard-actions {
border-color: var(--cy-line-yellow);
  background: linear-gradient(105deg, color-mix(in srgb, var(--cy-accent-warning) 4.5%, transparent), transparent 82%);
}
```

---

## `.datastream`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, src\styles\components.css, src\styles\effects.css, src\styles\reader.css
- **Used in:** 1211 occurrences across 33 files
- **Effect properties:** animation, text-clip/gradient, color-mix
- **Animations:** datastreamShimmer
- **Selectors (sample):** `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `/* =========================
     TEXT EFFECTS (glitch/noise/neon) – sjednoceno.
     ========================= */
  /* Datastream baseline (subtle techno vibe) */
  .datastream`, `}
.datastream`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
- **Selector:** `}
.datastream`
- **CSS body (primary):**
```css
.datastream {
position: relative;
  background: linear-gradient(90deg,
    transparent 0%, color-mix(in oklab, var(--accent-primary) 12%, transparent) 20%,
    color-mix(in oklab, var(--accent-secondary) 22%, transparent) 50%,
    color-mix(in oklab, var(--accent-primary) 12%, transparent) 80%, transparent 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  color: inherit;
  animation: datastreamShimmer 3.6s linear infinite;
}
```

---

## `.dialog`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, public\styles.css, src\styles\base.css, src\styles\components-dialog.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 2101 occurrences across 31 files
- **Effect properties:** box-shadow, animation
- **Animations:** glitchenaGlow
- **Selectors (sample):** `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `/* Reader: Nepoužívej text-indent – falešné mezery jsou jako falešní přátelé. */
.SYNTHOMAREADER .dialog, .SYNTHOMAREADER .dialogS, .SYNTHOMAREADER .dialogN, .SYNTHOMAREADER .log`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
- **Selector:** `p.dialog.fx-gradient::before`
- **CSS body (primary):**
```css
.dialog {
content: '';
  position: absolute;
  left: 0rem;
  width: 6px;
  top: 0; bottom: 0; height: auto;
  border-radius: 3px;
  background: linear-gradient(45deg, var(--accent-error, #ff1744), #d50000, var(--accent-error, #ff1744));
  box-shadow: 
    -2px 0 8px 0px rgba(255, 23, 68, 0.8),
    2px 0 12px 0px rgba(255, 23, 68, 0.6),
    0px 0 16px 0px rgba(255, 23, 68, 0.4);
  z-index: 2;
  pointer-events: none;
  opacity: 0.8;
  animation: glitchenaGlow 2s ease-in-out infinite alternate;
}
```

---

## `.dialog-line`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css
- **Used in:** 6771 occurrences across 38 files
- **Effect properties:** text-shadow, box-shadow, color-mix
- **Selectors (sample):** `.chapter-reader__article.SYNTHOMAREADER .chapter-content > p:not(.log):not(.choice),
.chapter-reader__article.SYNTHOMAREADER .chapter-content .dialog-line`, `.chapter-reader__article.SYNTHOMAREADER .dialog-line`, `.chapter-reader__article.SYNTHOMAREADER .dialog-line::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.chapter-reader__article.SYNTHOMAREADER .dialog-line`
- **CSS body (primary):**
```css
.dialog-line {
position: relative;
  padding: 0.72rem 1rem 0.72rem 1.15rem !important;
  border-left: 3px solid var(--speaker-color) !important;
  color: var(--speaker-color) !important;
  background: linear-gradient(90deg, color-mix(in srgb, var(--speaker-color) 10%, transparent), transparent 76%) !important;
  box-shadow: inset 0.12rem 0 0 color-mix(in srgb, var(--speaker-secondary) 35%, transparent);
  text-shadow: 0 0 calc(0.2rem + 0.65rem * var(--reader-effect-intensity)) color-mix(in srgb, var(--speaker-color) 22%, transparent);
  -webkit-user-select: text !important;
  user-select: text !important;
  …
}
```

---

## `.dialog-line--active`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.chapter-reader__article.SYNTHOMAREADER .dialog-line:hover::after,
.chapter-reader__article.SYNTHOMAREADER .dialog-line:focus-visible::after,
.chapter-reader__article.SYNTHOMAREADER .dialog-line--active::after`, `.chapter-reader__article.SYNTHOMAREADER .dialog-line--active`
- **Selector:** `.chapter-reader__article.SYNTHOMAREADER .dialog-line--active`
- **CSS body (primary):**
```css
.dialog-line--active {
box-shadow: inset 0.18rem 0 0 var(--speaker-secondary), 0 0 1rem color-mix(in srgb, var(--speaker-color) 18%, transparent);
}
```

---

## `.dialog1024`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, src\styles\book-reader-base.css
- **Used in:** 24 occurrences across 3 files
- **Selectors (sample):** `.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.log, [class*="terminal"], [class*="system"], .dialogSystem, .dialog1024)`, `.kp-chapter[data-book="konec-podpory"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"] .dialog1024`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSarkasma,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogGlitchka,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialog1024`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.log, [class*="terminal"], [class*="system"], .dialogSystem, .dialog1024)`
- **CSS body (primary):**
```css
.dialog1024 {
font-family: var(--font-family-mono, ui-monospace, monospace);
}
```

---

## `.dialogAudit`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 5 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSecurity,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSecurity,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSecurity,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`
- **CSS body (primary):**
```css
.dialogAudit {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.82;
}
```

---

## `.dialogBoris`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 621 occurrences across 17 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogBoris`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBoris`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogBoris`
- **CSS body (primary):**
```css
.dialogBoris {
color: var(--kp-boris);
    background: linear-gradient(90deg, rgba(215,191,142,0.075), transparent);
}
```

---

## `.dialogBot`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 5 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`
- **CSS body (primary):**
```css
.dialogBot {
position: relative;
    margin: 0.9rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255, 255, 255, 0.025);
    line-height: 1.7;
}
```

---

## `.dialogBuilding`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 19 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`
- **CSS body (primary):**
```css
.dialogBuilding {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.024);
    line-height: 1.72;
}
```

---

## `.dialogBus`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 70 occurrences across 8 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogBus`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogBus`
- **CSS body (primary):**
```css
.dialogBus {
color: #b9e8ff;
    border-left-color: #62caff;
    background: linear-gradient(90deg, rgba(98,202,255,0.07), transparent);
}
```

---

## `.dialogCare`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 30 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`
- **CSS body (primary):**
```css
.dialogCare {
color: var(--kp-care);
    border-left-color: var(--kp-care);
    background: linear-gradient(90deg, rgba(189,239,255,0.085), transparent);
    text-shadow: 0 0 0.7rem rgba(189,239,255,0.12);
}
```

---

## `.dialogCivil`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 81 occurrences across 4 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogCivil`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogVoice,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogVanta`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogVoice`
- **CSS body (primary):**
```css
.dialogCivil {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.024);
    line-height: 1.74;
}
```

---

## `.dialogCore`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 33 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSecurity,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSecurity,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSecurity,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`
- **CSS body (primary):**
```css
.dialogCore {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.82;
}
```

---

## `.dialogD`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components-dialog.css
- **Used in:** 45 occurrences across 8 files
- **Effect properties:** text-shadow, filter
- **Selectors (sample):** `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `.dialogD`, `p.dialogD::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `src\game\cyklus\cards\entity.cards.ts`
  - `src\game\cyklus\cards\followup.cards.ts`
- **Selector:** `.dialogD`
- **CSS body (primary):**
```css
.dialogD {
color: var(--accent-success, #a2e633);
  text-shadow: 
    0 0 6px rgba(14, 70, 213, 0.8),
    0 0 12px rgba(193, 168, 93, 0.6),
    0 0 18px rgba(187, 151, 43, 0.4),
    0 0 24px rgba(96, 180, 83, 0.2);
  font-family: 'Text03i', monospace;
  font-weight: 700; 
  font-style: italic;
  font-size: calc(1.15rem * var(--font-size-multiplier));
  position: relative;
  filter: brightness(1.1) saturate(1.2);
}
```

---

## `.dialogDril`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogDril`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogDril`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogDril`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .dialogDril`
- **CSS body (primary):**
```css
.dialogDril {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.024);
    line-height: 1.76;
}
```

---

## `.dialogE`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 21 occurrences across 2 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`
- **CSS body (primary):**
```css
.dialogE {
position: relative;
    margin: 0.9rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255, 255, 255, 0.025);
    line-height: 1.7;
}
```

---

## `.dialogG`

- **Status:** defined
- **CSS files:** src\styles\components-dialog.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 167 occurrences across 17 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* =========================================================
   SYNTHOMA DIALOG & LOG STYLES
   Separated from components.css to reduce file size.
   ========================================================= */

/* Glitchka dialog – modrorůžový gradient */
.dialogG`, `p.dialogG::before`, `/* Reader line alignment – sjednoceno, bez duplicitních selectorů. */
  .SYNTHOMAREADER .tw-line.log, #hero-info .tw-line.log,
  .SYNTHOMAREADER .tw-line.dialog, #hero-info .tw-line.dialog,
  .SYNTHOMAREADER .tw-line.dialogS, #hero-info .tw-line.dialogS,
  .SYNTHOMAREADER .tw-line.dialogN, #hero-info .tw-line.dialogN,
  .SYNTHOMAREADER .tw-line.dialogG, #hero-info .tw-line.dialogG,
  .SYNTHOMAREADER .tw-line.text, #hero-info .tw-line.text,
  .SYNTHOMAREADER .tw-line.title, #hero-info .tw-line.title,
  .SYNTHOMAREADER p.log, #hero-info p.log,
  .SYNTHOMAREADER p.dialog, #hero-info p.dialog,
  .SYNTHOMAREADER p.dialogS, #hero-info p.dialogS,
  .SYNTHOMAREADER p.dialogN, #hero-info p.dialogN,
  .SYNTHOMAREADER p.dialogG, #hero-info p.dialogG,
  .SYNTHOMAREADER p.text, #hero-info p.text,
  .SYNTHOMAREADER p.title, #hero-info p.title`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `src\content\protected\SYNTHOMA-NULL\0-10 [REST].html`
  - `src\content\protected\SYNTHOMA-NULL\0-11 [ORGIE].html`
- **Selector:** `p.dialogG::before`
- **CSS body (primary):**
```css
.dialogG {
content: '';
  position: absolute;
  left: 0rem;
  width: 4px;
  top: 0; bottom: 0; height: auto;
  border-radius: 2px;
  background: transparent;
  box-shadow: -1px 0 4px var(--speaker-glitchka), 1px 0 8px var(--speaker-glitchka-secondary), 0 0 12px var(--speaker-glitchka);

  z-index: 2;
  pointer-events: none;
  opacity: 0.7;
}
```

---

## `.dialogGlitchka`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 22 occurrences across 7 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogGlitchka`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSarkasma,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogGlitchka,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialog1024`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogSarkasma,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogGlitchka,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .dialog1024`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogGlitchka`
- **CSS body (primary):**
```css
.dialogGlitchka {
color: #ffd8fb;
    border-left: 4px solid var(--kp-glitchka);
    background: linear-gradient(90deg, rgba(255,131,236,0.12), rgba(0,236,255,0.055), transparent);
    text-shadow: 0 0 0.9rem rgba(255,131,236,0.23);
}
```

---

## `.dialogHelena`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 13 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogSarkasma,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogGlitchka,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialog1024,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogHelena`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogHelena`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogSarkasma,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogGlitchka,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialog1024,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .dialogHelena`
- **CSS body (primary):**
```css
.dialogHelena {
position: relative;
    margin: 0.94rem 0;
    padding: 0.74rem 1rem 0.74rem 1.16rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.84;
}
```

---

## `.dialogHestia`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 10 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`
- **CSS body (primary):**
```css
.dialogHestia {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.82;
}
```

---

## `.dialogHome`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 29 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome`
- **CSS body (primary):**
```css
.dialogHome {
color: var(--kp-home);
    border-left-color: var(--kp-home);
    background: linear-gradient(90deg, rgba(255,201,120,0.085), rgba(255,201,120,0.018), transparent);
    text-shadow: 0 0 0.85rem rgba(255,201,120,0.1);
}
```

---

## `.dialogJuros`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 275 occurrences across 13 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogJuros`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogJuros`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogJuros`
- **CSS body (primary):**
```css
.dialogJuros {
color: var(--kp-juros);
    background: linear-gradient(90deg, rgba(156,255,199,0.075), transparent);
}
```

---

## `.dialogLogistics`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 40 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogWorker,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogLogistics`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogLogistics`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogLogistics`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogWorker,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogLogistics`
- **CSS body (primary):**
```css
.dialogLogistics {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.8;
}
```

---

## `.dialogMilo`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 400 occurrences across 17 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogMilo`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogMilo`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogMilo`
- **CSS body (primary):**
```css
.dialogMilo {
color: var(--kp-milo);
    border-left-width: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    background: linear-gradient(90deg, rgba(255,201,40,0.085), rgba(0,0,0,0.2));
}
```

---

## `.dialogMina`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 341 occurrences across 16 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogMina`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogVoice,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogVanta`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogMina`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogMina`
- **CSS body (primary):**
```css
.dialogMina {
color: var(--kp-mina);
    background: linear-gradient(90deg, rgba(255,120,216,0.075), transparent);
}
```

---

## `.dialogN`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\base.css, src\styles\components-dialog.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 428 occurrences across 19 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `/* Reader: Nepoužívej text-indent – falešné mezery jsou jako falešní přátelé. */
.SYNTHOMAREADER .dialog, .SYNTHOMAREADER .dialogS, .SYNTHOMAREADER .dialogN, .SYNTHOMAREADER .log`, `.dialogN`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
- **Selector:** `.dialogN`
- **CSS body (primary):**
```css
.dialogN {
position: relative;
  color: var(--accent-secondary);
  text-shadow: 0 0 5px var(--bg-primary), 0 0 10px var(--shadow-primary);
  font-family: 'Text03i', monospace;
  font-weight: 700; font-style: italic;
  font-size: calc(1.15rem * var(--font-size-multiplier));
}
```

---

## `.dialogNeon`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 99 occurrences across 8 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogNeon`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSarkasma,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogGlitchka,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialog1024`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogNeon`
- **CSS body (primary):**
```css
.dialogNeon {
color: #c6f8ff;
    border-left-color: #7fe9f5;
    background: linear-gradient(90deg, rgba(0,234,255,0.065), rgba(255,255,255,0.018), transparent);
    text-shadow: 0 0 0.8rem rgba(0,234,255,0.12);
}
```

---

## `.dialogNull`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 94 occurrences across 7 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogNull`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNull`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogNull`
- **CSS body (primary):**
```css
.dialogNull {
color: var(--kp-null);
    border: 1px solid rgba(0,246,255,0.22);
    border-left: 4px solid var(--kp-null);
    background: linear-gradient(90deg, rgba(0,246,255,0.1), rgba(0,0,0,0.58));
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.043em;
    text-shadow: 0 0 1rem rgba(0,246,255,0.3);
}
```

---

## `.dialogNurse`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`
- **CSS body (primary):**
```css
.dialogNurse {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.024);
    line-height: 1.78;
}
```

---

## `.dialogOracle`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogHestia,
.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .dialogOracle`
- **CSS body (primary):**
```css
.dialogOracle {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.82;
}
```

---

## `.dialogPassenger`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 23 occurrences across 2 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`
- **CSS body (primary):**
```css
.dialogPassenger {
position: relative;
    margin: 0.9rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255, 255, 255, 0.025);
    line-height: 1.7;
}
```

---

## `.dialogPatient`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 16 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogPatient,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogNurse,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .dialogCare`
- **CSS body (primary):**
```css
.dialogPatient {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.024);
    line-height: 1.78;
}
```

---

## `.dialogR`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 41 occurrences across 2 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`
- **CSS body (primary):**
```css
.dialogR {
position: relative;
    margin: 0.9rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255, 255, 255, 0.025);
    line-height: 1.7;
}
```

---

## `.dialogResident`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 11 occurrences across 3 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogResident`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogSecurity,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogAudit,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .dialogCore`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`
- **CSS body (primary):**
```css
.dialogResident {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.82;
}
```

---

## `.dialogS`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\base.css, src\styles\components-dialog.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 592 occurrences across 25 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `/* Reader: Nepoužívej text-indent – falešné mezery jsou jako falešní přátelé. */
.SYNTHOMAREADER .dialog, .SYNTHOMAREADER .dialogS, .SYNTHOMAREADER .dialogN, .SYNTHOMAREADER .log`, `.dialogS`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
- **Selector:** `.dialogS`
- **CSS body (primary):**
```css
.dialogS {
position: relative;
  color: var(--speaker-sarkasma);
  text-shadow: 0 0 4px var(--speaker-sarkasma), 0 0 8px var(--speaker-sarkasma-secondary);
  font-family: 'Text03i', monospace;
  font-weight: 700; font-style: italic;
  font-size: calc(1.15rem * var(--font-size-multiplier));
}
```

---

## `.dialogSara`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 42 occurrences across 2 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogVoice,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogVanta`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSara`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogVoice,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .dialogVanta`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .dialogSara`
- **CSS body (primary):**
```css
.dialogSara {
color: #a9e9ff;
    border-left-color: #89dfff;
    background: linear-gradient(90deg, rgba(137,223,255,0.075), rgba(0,0,0,0.28));
    text-shadow: 0 0 1.1rem rgba(137,223,255,0.22);
}
```

---

## `.dialogSarkasma`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 43 occurrences across 6 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogSarkasma`, `.kp-chapter[data-book="konec-podpory"] .dialogSarkasma::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNull,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogSarkasma,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogGlitchka,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .dialog1024`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogSarkasma`
- **CSS body (primary):**
```css
.dialogSarkasma {
color: var(--kp-sarkasma);
    border-left-width: 4px;
    background: linear-gradient(90deg, rgba(255,64,87,0.105), rgba(62,0,9,0.08), transparent);
    text-shadow: 0 0 0.85rem rgba(255,64,87,0.18);
}
```

---

## `.dialogSecurity`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 42 occurrences across 2 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogResident,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogHome,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSara,
.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .dialogSecurity`
- **CSS body (primary):**
```css
.dialogSecurity {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.82;
}
```

---

## `.dialogSobotka`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 31 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`
- **CSS body (primary):**
```css
.dialogSobotka {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.024);
    line-height: 1.72;
}
```

---

## `.dialogSystem`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, src\styles\book-reader-base.css
- **Used in:** 452 occurrences across 16 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.log, [class*="terminal"], [class*="system"], .dialogSystem, .dialog1024)`, `.kp-chapter[data-book="konec-podpory"] .dialogSystem`, `.kp-chapter[data-book="konec-podpory"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"] .dialog1024`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogSystem`
- **CSS body (primary):**
```css
.dialogSystem {
color: #18333c;
    border-left-color: #317786;
    background: rgba(255,255,255,0.42);
    text-shadow: none;
}
```

---

## `.dialogT`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1567 occurrences across 19 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogT`, `.kp-chapter[data-book="konec-podpory"] .dialogT`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogBot,
.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .dialogPassenger`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogT`
- **CSS body (primary):**
```css
.dialogT {
color: var(--kp-cyan);
    border-left-width: 3px;
    text-shadow: 0 0 0.75rem rgba(0,234,255,0.18);
}
```

---

## `.dialogVanta`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 395 occurrences across 16 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .dialogVanta`, `.kp-chapter[data-book="konec-podpory"] .dialogVanta::before`, `.kp-chapter[data-book="konec-podpory"] .dialogVanta`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogVanta`
- **CSS body (primary):**
```css
.dialogVanta {
color: var(--kp-vanta);
    border-left-color: var(--kp-vanta-gold);
    background:
      linear-gradient(90deg, rgba(216,167,255,0.085), rgba(255,213,139,0.025), transparent);
    font-style: italic;
    text-shadow: 0 0 0.8rem rgba(216,167,255,0.12);
}
```

---

## `.dialogVoice`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 26 occurrences across 4 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogR,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogE,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogSobotka,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogPassenger,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBuilding,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogCivil,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .dialogVoice`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .dialogVoice`
- **CSS body (primary):**
```css
.dialogVoice {
color: var(--kp-white);
    border-left-color: rgba(255,255,255,0.68);
    background: linear-gradient(90deg, rgba(255,255,255,0.055), transparent);
    text-shadow: 0 0 1rem rgba(255,255,255,0.13);
}
```

---

## `.dialogWorker`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 9 occurrences across 1 files
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogWorker,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogLogistics`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogWorker`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBoris,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMilo,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogSystem,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogMina,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogVanta,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogBus,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogJuros,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogWorker,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .dialogLogistics`
- **CSS body (primary):**
```css
.dialogWorker {
position: relative;
    margin: 0.92rem 0;
    padding: 0.72rem 1rem 0.72rem 1.15rem;
    border-left: 2px solid currentColor;
    background: rgba(255,255,255,0.023);
    line-height: 1.8;
}
```

---

## `.dice-bonus`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.dice-bonus .dice-face`, `.dice-bonus .dice-tag`
- **Selector:** `.dice-bonus .dice-tag`
- **CSS body (primary):**
```css
.dice-bonus {
background: color-mix(in srgb, var(--game-accent-alt) 15%, transparent); color: var(--game-accent-alt); border: 1px solid color-mix(in srgb, var(--game-accent-alt) 35%, transparent);
}
```

---

## `.dice-crit`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.dice-crit .dice-face`, `.dice-crit .dice-tag`
- **Selector:** `.dice-crit .dice-tag`
- **CSS body (primary):**
```css
.dice-crit {
background: color-mix(in srgb, var(--game-danger) 15%, transparent); color: var(--game-danger); border: 1px solid color-mix(in srgb, var(--game-danger) 35%, transparent);
}
```

---

## `.dice-tag`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.dice-tag`, `.dice-crit .dice-tag`, `.dice-bonus .dice-tag`
- **Usage sample:**
  - `src\components\game\DiceRoller.tsx`
- **Selector:** `.dice-crit .dice-tag`
- **CSS body (primary):**
```css
.dice-tag {
background: color-mix(in srgb, var(--game-danger) 15%, transparent); color: var(--game-danger); border: 1px solid color-mix(in srgb, var(--game-danger) 35%, transparent);
}
```

---

## `.disabled`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}
  .choice-link.disabled, .choice-link[disabled], .choice-link[aria-disabled="true"]`, `#reader-content a.disabled, #reader-body a.disabled, #reader-extra a.disabled`, `#reader-content a.disabled, #reader-body a.disabled, #reader-extra a.disabled`
- **Selector:** `}
  .choice-link.disabled, .choice-link[disabled], .choice-link[aria-disabled="true"]`
- **CSS body (primary):**
```css
.disabled {
opacity: 0.55; cursor: default; box-shadow: none;
}
```

---

## `.echo-ghost`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\components.css, src\styles\effects.css
- **Used in:** 153 occurrences across 18 files
- **Effect properties:** text-shadow, animation, transform
- **Animations:** ghostDrift
- **Selectors (sample):** `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `/* Echo ghost – append echo inline on the same line and make it clickable */
  .echo-ghost`, `.echo-ghost::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
- **Selector:** `.echo-ghost::after`
- **CSS body (primary):**
```css
.echo-ghost {
content: attr(data-echo);
    position: absolute;
    left: 35%; top: 50%;
    transform: translate(-35%, -55%); /* centered, nudged slightly upward */
    opacity: .5;
    font-size: 0.88em; /* ghost o něco menší než hlavní text */
    font-family: inherit;     /* match parent font */
    color: currentColor;      /* použij stejnou barvu jako parent */
    text-shadow: inherit;     /* převezmi glow parenta */
    line-height: 1;
    white-space: nowrap; /* keep echo on same line */
    pointer-events: none; /* clicks go to main span for swapping */
    animation: ghostDrift 2.6s ease-in-out i…
}
```

---

## `.echo-picker`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, filter, backdrop-filter, transform
- **Selectors (sample):** `/* Picker – plovoucí volba variant */
  .echo-picker`
- **Selector:** `/* Picker – plovoucí volba variant */
  .echo-picker`
- **CSS body (primary):**
```css
.echo-picker {
position: absolute;
    top: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    display: flex;
    flex-direction: column;
    gap: 3px;
    background: rgba(8,8,12,.92);
    border: 1px solid var(--accent-secondary, #0ff);
    border-radius: 8px;
    padding: 6px 4px;
    min-width: 120px;
    box-shadow: 0 4px 20px rgba(0,0,0,.6), 0 0 10px var(--glow-secondary, rgba(0,255,255,.2));
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    pointer-events: all;
}
```

---

## `.echo-picker-opt`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.echo-picker-opt`, `.echo-picker-opt:hover,
  .echo-picker-opt:focus-visible`, `.echo-picker-opt:hover,
  .echo-picker-opt:focus-visible`
- **Selector:** `.echo-picker-opt`
- **CSS body (primary):**
```css
.echo-picker-opt {
padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: .8rem;
    font-family: var(--font-family-mono, monospace);
    letter-spacing: .04em;
    color: var(--text-primary, #f2f2f2);
    background: transparent;
    border: none;
    text-align: left;
    transition: background .12s ease, color .12s ease;
    white-space: nowrap;
}
```

---

## `.effect-crtTerminal`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** blend-mode
- **Selectors (sample):** `}
.effect-crtTerminal`, `.effect-crtTerminal::before`
- **Selector:** `.effect-crtTerminal::before`
- **CSS body (primary):**
```css
.effect-crtTerminal {
content: '';
  position: absolute; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(0,0,0,0.0) 0px,
    rgba(0,0,0,0.0) 2px,
    rgba(255,255,255,0.04) 3px,
    rgba(0,0,0,0.0) 4px
  );
  mix-blend-mode: overlay;
}
```

---

## `.effect-fogNoise`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, blend-mode
- **Animations:** fogNoise
- **Selectors (sample):** `}
.effect-fogNoise`, `.effect-fogNoise::before`, `.effect-fogNoise::after`
- **Selector:** `.effect-fogNoise::before`
- **CSS body (primary):**
```css
.effect-fogNoise {
content: '';
  position: absolute; inset: -10%; pointer-events: none;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(192,250,255,0.10), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(192,250,255,0.08), transparent 50%);
  mix-blend-mode: screen;
  opacity: 1;
  animation: fogNoise 9s ease-in-out infinite;
}
```

---

## `.effect-kernelBlink`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** kernelBlink
- **Selectors (sample):** `}
.effect-kernelBlink`
- **Selector:** `}
.effect-kernelBlink`
- **CSS body (primary):**
```css
.effect-kernelBlink {
outline: 2px solid transparent;
  animation: kernelBlink 2.2s steps(10, end) infinite;
}
```

---

## `.effect-pulseWave`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** pulseWave
- **Selectors (sample):** `}
.effect-pulseWave`, `.effect-pulseWave::after`, `/* Honor Control Panel toggle: disable pulse when animations are off */
body.no-animations .effect-pulseWave::after`
- **Selector:** `.effect-pulseWave::after`
- **CSS body (primary):**
```css
.effect-pulseWave {
content: '';
  position: absolute; inset: 0; border-radius: 12px;
  animation: pulseWave 2.6s ease-out infinite;
}
```

---

## `.effect-riftGlow`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, box-shadow, animation, color-mix
- **Animations:** riftGlow
- **Selectors (sample):** `}
.effect-riftGlow`
- **Selector:** `}
.effect-riftGlow`
- **CSS body (primary):**
```css
.effect-riftGlow {
color: var(--accent-primary, #f0f);
  text-shadow:
    0 0 6px color-mix(in oklab, var(--accent-primary, #f0f) 50%, transparent),
    1px 0 color-mix(in oklab, var(--accent-secondary, #0ff) 20%, transparent),
   -1px 0 color-mix(in oklab, var(--accent-warning, #f6ff00) 12%, transparent);
  box-shadow:
    0 0 12px color-mix(in oklab, var(--accent-primary, #f0f) 25%, transparent) inset,
    0 0 24px color-mix(in oklab, var(--accent-primary, #f0f) 18%, transparent);
  animation: riftGlow 1.8s ease-in-out infinite;
}
```

---

## `.encounter-panel__choice-btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `/* ── UI polish: glow, contrast, hover ──────────────────────────────────────── */

.solo-menu__btn,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__btn,
.run-map__node-circle`, `.solo-menu__btn:hover,
.action-bar__btn:hover:enabled,
.action-bar__card:hover:enabled,
.encounter-panel__choice-btn:hover,
.encounter-panel__reward-btn:hover,
.run-end-report__btn:hover,
.run-map__node-circle:hover`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.encounter-panel__choice-btn`
- **CSS body (primary):**
```css
.encounter-panel__choice-btn {
display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: left;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
```

---

## `.encounter-panel__choice-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.encounter-panel__choice-label`, `.encounter-panel__choice-label`, `.solo-run .encounter-panel__choice-label`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.encounter-panel__choice-label`
- **CSS body (primary):**
```css
.encounter-panel__choice-label {
font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
}
```

---

## `.encounter-panel__encounter-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.encounter-panel__encounter-label`
- **Selector:** `.encounter-panel__encounter-label`
- **CSS body (primary):**
```css
.encounter-panel__encounter-label {
font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.encounter-panel__finished-text`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.encounter-panel__finished-text`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.encounter-panel__finished-text`
- **CSS body (primary):**
```css
.encounter-panel__finished-text {
font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.encounter-panel__intro-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.encounter-panel__intro-label`
- **Selector:** `.encounter-panel__intro-label`
- **CSS body (primary):**
```css
.encounter-panel__intro-label {
font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.encounter-panel__log-entry--entering`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** type-in
- **Selectors (sample):** `}

/* Log entry type-in */
.encounter-panel__log-entry--entering`
- **Selector:** `}

/* Log entry type-in */
.encounter-panel__log-entry--entering`
- **CSS body (primary):**
```css
.encounter-panel__log-entry--entering {
animation: type-in 0.25s ease-out both;
}
```

---

## `.encounter-panel__reward-btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `/* ── UI polish: glow, contrast, hover ──────────────────────────────────────── */

.solo-menu__btn,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__btn,
.run-map__node-circle`, `.solo-menu__btn:hover,
.action-bar__btn:hover:enabled,
.action-bar__card:hover:enabled,
.encounter-panel__choice-btn:hover,
.encounter-panel__reward-btn:hover,
.run-end-report__btn:hover,
.run-map__node-circle:hover`
- **Selector:** `.encounter-panel__reward-btn`
- **CSS body (primary):**
```css
.encounter-panel__reward-btn {
display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  min-width: 140px;
  text-align: left;
}
```

---

## `.encounter-panel__reward-title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.encounter-panel__reward-title`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.encounter-panel__reward-title`
- **CSS body (primary):**
```css
.encounter-panel__reward-title {
font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.encounter-panel__reward-type`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.encounter-panel__reward-type`, `.encounter-panel__reward-btn--relic .encounter-panel__reward-type`, `.encounter-panel__reward-btn--heal  .encounter-panel__reward-type`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.encounter-panel__reward-type`
- **CSS body (primary):**
```css
.encounter-panel__reward-type {
font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.encounter-panel__skip-btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.encounter-panel__skip-btn`, `.encounter-panel__skip-btn:hover`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.encounter-panel__skip-btn`
- **CSS body (primary):**
```css
.encounter-panel__skip-btn {
align-self: flex-start;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 0.9rem 1.6rem;
  min-height: 48px;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s, transform 0.12s;
}
```

---

## `.endgame-player--winner`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.endgame-player--winner`
- **Selector:** `.endgame-player--winner`
- **CSS body (primary):**
```css
.endgame-player--winner {
border-color: color-mix(in srgb, var(--game-warn) 60%, transparent); background: color-mix(in srgb, var(--game-warn) 6%, var(--bg-primary));
}
```

---

## `.endgame-title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.endgame-title`, `.endgame-title`
- **Usage sample:**
  - `src\components\game\EndGameReport.tsx`
- **Selector:** `.endgame-title`
- **CSS body (primary):**
```css
.endgame-title {
font-size: 2rem; font-family: var(--font-family-mono, monospace); color: var(--game-accent); margin: 0; text-shadow: 0 0 12px var(--glow-secondary);
}
```

---

## `.enemy-card`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `/* ── Enemy card ─────────────────────────────────────────────────────────────── */

.enemy-card`, `.solo-run .enemy-card`
- **Selector:** `/* ── Enemy card ─────────────────────────────────────────────────────────────── */

.enemy-card`
- **CSS body (primary):**
```css
.enemy-card {
background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  transition: border-color 0.2s;
}
```

---

## `.enemy-card--danger`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** danger-pulse
- **Selectors (sample):** `/* Danger border + pulse */
.enemy-card--danger`
- **Selector:** `/* Danger border + pulse */
.enemy-card--danger`
- **CSS body (primary):**
```css
.enemy-card--danger {
border-color: #e74c3c;
  animation: danger-pulse 1.5s ease-in-out infinite;
}
```

---

## `.enemy-card__dead-overlay`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.enemy-card__dead-overlay`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.enemy-card__dead-overlay`
- **CSS body (primary):**
```css
.enemy-card__dead-overlay {
position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  background: rgba(0,0,0,0.5);
  text-transform: uppercase;
}
```

---

## `.enemy-card__hp-fill`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.enemy-card__hp-fill`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.enemy-card__hp-fill`
- **CSS body (primary):**
```css
.enemy-card__hp-fill {
height: 100%;
  background: var(--game-hp, #00ff9f);
  transition: width 0.3s ease;
}
```

---

## `.enemy-card__intent-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.enemy-card__intent-label`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.enemy-card__intent-label`
- **CSS body (primary):**
```css
.enemy-card__intent-label {
font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.enemy-card__name`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.enemy-card__name`, `.enemy-card__name`, `.solo-run .enemy-card__name`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.enemy-card__name`
- **CSS body (primary):**
```css
.enemy-card__name {
font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-primary);
}
```

---

## `.enemy-card__phase`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.enemy-card__phase`, `.enemy-card__phase`, `.solo-run .enemy-card__phase`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.enemy-card__phase`
- **CSS body (primary):**
```css
.enemy-card__phase {
font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: #e74c3c;
  text-transform: uppercase;
}
```

---

## `.enemy-card__status-badge`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.enemy-card__status-badge`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.enemy-card__status-badge`
- **CSS body (primary):**
```css
.enemy-card__status-badge {
font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.15rem 0.4rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.error`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.error`
- **Selector:** `.error`
- **CSS body (primary):**
```css
.error {
text-align: center; color: #f00; font-family: 'Text01', monospace; font-size: 1.1rem; margin: 2rem 0; text-shadow: 0 0 10px #f00;
}
```

---

## `.error-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.error-btn`, `.error-btn:hover`, `.error-btn.retry-btn`
- **Selector:** `.error-btn`
- **CSS body (primary):**
```css
.error-btn {
padding: calc(var(--spacing-unit, .75rem) * .75) calc(var(--spacing-unit, .75rem) * 1.5);
    border: 2px solid var(--accent-error);
    background: transparent; color: var(--accent-error);
    border-radius: var(--border-radius-base, 8px);
    cursor: pointer; font-family: inherit;
    font-size: calc(.9rem * var(--font-size-multiplier, 1));
    text-transform: uppercase; letter-spacing: 1px;
    transition: background .25s ease, color .25s ease, box-shadow .25s ease;
}
```

---

## `.error-container`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, animation
- **Animations:** errorShake
- **Selectors (sample):** `.error-container`
- **Selector:** `.error-container`
- **CSS body (primary):**
```css
.error-container {
background: var(--bg-secondary);
    border: 2px solid var(--accent-error);
    border-radius: var(--border-radius-base, 8px);
    padding: calc(var(--spacing-unit, .75rem) * 2);
    max-width: 500px; text-align: center;
    box-shadow: 0 0 30px var(--accent-error), inset 0 1px 0 hsla(0,0%,100%,.1);
    animation: errorShake .5s ease-in-out;
}
```

---

## `.error-icon`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** warningBlink
- **Selectors (sample):** `.error-icon`
- **Selector:** `.error-icon`
- **CSS body (primary):**
```css
.error-icon {
font-size: 3rem; margin-bottom: var(--spacing-unit, .75rem); animation: warningBlink 1s ease-in-out infinite;
}
```

---

## `.error-overlay`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter, backdrop-filter, transition
- **Selectors (sample):** `/* =========================
     ERROR OVERLAY
     ========================= */
  .error-overlay`, `.error-overlay:not(.hidden)`
- **Selector:** `/* =========================
     ERROR OVERLAY
     ========================= */
  .error-overlay`
- **CSS body (primary):**
```css
.error-overlay {
position: fixed; inset: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,.95);
    -webkit-backdrop-filter: blur(var(--blur-heavy, 12px));
    backdrop-filter: blur(var(--blur-heavy, 12px));
    display: flex; justify-content: center; align-items: center;
    z-index: var(--z-modals, 1000);
    opacity: 0; visibility: hidden; transition: opacity .25s ease, visibility .25s ease;
}
```

---

## `.error-title`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.error-title`
- **Selector:** `.error-title`
- **CSS body (primary):**
```css
.error-title {
color: var(--accent-error); font-size: calc(1.5rem * var(--font-size-multiplier, 1)); text-transform: uppercase; letter-spacing: 1px; margin-bottom: var(--spacing-unit, .75rem);
}
```

---

## `.event-modal`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.event-modal`, `/* Event modal */
  .event-modal`
- **Usage sample:**
  - `src\components\game\StoryEventModal.tsx`
- **Selector:** `.event-modal`
- **CSS body (primary):**
```css
.event-modal {
width: 100%;
  max-width: 540px;
  background: var(--bg-secondary);
  border: 1px solid var(--game-border-active);
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 0 30px color-mix(in srgb, var(--game-accent) 20%, transparent);
}
```

---

## `.event-modal-overlay`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter, color-mix
- **Selectors (sample):** `/* --- Story Event Modal ------------------------------------------------- */
.event-modal-overlay`
- **Usage sample:**
  - `src\components\game\StoryEventModal.tsx`
- **Selector:** `/* --- Story Event Modal ------------------------------------------------- */
.event-modal-overlay`
- **CSS body (primary):**
```css
.event-modal-overlay {
position: fixed;
  inset: 0;
  background: color-mix(in srgb, var(--bg-primary) 85%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
```

---

## `.event-modal-title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.event-modal-title`, `.event-modal-title`
- **Usage sample:**
  - `src\components\game\StoryEventModal.tsx`
- **Selector:** `.event-modal-title`
- **CSS body (primary):**
```css
.event-modal-title {
font-size: 1.3rem; font-family: var(--font-family-mono, monospace); color: var(--game-accent); margin: 0; text-shadow: 0 0 8px var(--glow-secondary);
}
```

---

## `.faded`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components-choice.css, src\styles\components.css, src\styles\themes.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
  p.choice[data-tags] > .choice-link.faded,
  p.choice[data-tags].faded:not(:has(> .choice-link))`, `.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
  p.choice[data-tags] > .choice-link.faded,
  p.choice[data-tags].faded:not(:has(> .choice-link))`, `/* Nevybrané / zamčené volby */
.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
p.choice[data-tags] > .choice-link.faded,
p.choice[data-tags].faded:not(:has(> .choice-link))`
- **Selector:** `.choices-locked p.choice[data-tags] > .choice-link:not(.chosen),
  p.choice[data-tags] > .choice-link.faded,
  p.choice[data-tags].faded:not(:has(> .choice-link))`
- **CSS body (primary):**
```css
.faded {
box-shadow: none;
}
```

---

## `.final-round-banner`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.final-round-banner`
- **Usage sample:**
  - `src\components\game\GameShell.tsx`
- **Selector:** `.final-round-banner`
- **CSS body (primary):**
```css
.final-round-banner {
background: color-mix(in srgb, var(--game-warn) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--game-warn) 50%, transparent);
  color: var(--game-warn);
  font-family: var(--font-family-mono, monospace);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-align: center;
}
```

---

## `.flickering`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css
- **Used in:** 7 occurrences across 4 files
- **Effect properties:** animation
- **Animations:** flicker
- **Selectors (sample):** `.neon-char.flickering`, `}

/* Burst flicker – krátký záblesk. */
.noising-char.flickering`, `}

/* Suppress v typewriter – čisté psaní bez shine. */
.typewriter .noising-char.noising, .typewriter .noising-char.flickering, .typewriter .noising-char.noising-burst`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `public\books\efekty.html`
- **Selector:** `.neon-char.flickering`
- **CSS body (primary):**
```css
.flickering {
animation: flicker .1s alternate infinite;
}
```

---

## `.flickering-off`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 4 occurrences across 4 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.neon-char.flickering-off`, `/* Keep inter-word space readable */
  .neon-word > .neon-char.flickering-off`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `public\books\efekty.html`
- **Selector:** `.neon-char.flickering-off`
- **CSS body (primary):**
```css
.flickering-off {
opacity: .15 !important; text-shadow: 0 0 2px var(--accent-primary), 0 0 5px var(--accent-secondary) !important;
}
```

---

## `.fog`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components.css
- **Used in:** 6 occurrences across 3 files
- **Effect properties:** filter
- **Selectors (sample):** `.crt.fog .generated-image`, `.fog`, `.fog::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
- **Selector:** `.fog::before`
- **CSS body (primary):**
```css
.fog {
content: ""; position: absolute; inset: -20%; pointer-events: none;
    background:
      radial-gradient(circle at 50% 20%, rgba(var(--bg-secondary-rgb), .1), transparent 60%),
      radial-gradient(circle at 20% 80%, rgba(var(--bg-secondary-rgb), .1), transparent 60%);
    filter: blur(8px);
}
```

---

## `.force-shine`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, filter
- **Animations:** none
- **Selectors (sample):** `/* Respect no-animations – statický glow. */
body.no-animations:not(.force-shine) .noising-char`, `body.no-animations:not(.force-shine) .noising-char:not(.noising-static)`, `body.no-animations:not(.force-shine) .noising-char.noising-static`
- **Selector:** `/* Respect no-animations – statický glow. */
body.no-animations:not(.force-shine) .noising-char`
- **CSS body (primary):**
```css
.force-shine {
animation: none !important; filter: none !important;
}
```

---

## `.fragment-card`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition
- **Selectors (sample):** `.fragment-card`, `.fragment-card:hover`
- **Selector:** `.fragment-card`
- **CSS body (primary):**
```css
.fragment-card {
background: var(--bg-glass, rgba(255,255,255,.04));
  border: 1px solid var(--border-secondary, rgba(255,255,255,.1));
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color .15s, box-shadow .15s;
}
```

---

## `.fragment-card-type`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.fragment-card-type`
- **Selector:** `.fragment-card-type`
- **CSS body (primary):**
```css
.fragment-card-type {
font-family: 'Text02', monospace;
  font-size: .6rem;
  letter-spacing: .12em;
  color: var(--text-secondary, rgba(207,207,227,.5));
  text-transform: uppercase;
}
```

---

## `.fx-flicker`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\components.css
- **Used in:** 214 occurrences across 31 files
- **Effect properties:** animation
- **Animations:** fx-flicker
- **Selectors (sample):** `.fx-flicker`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `/* --- Typografická oprava: zachovat mezeru před zvýrazněným slovem po 404 --- */
/* Pokud následuje zvýrazněný span hned po 404, vlož před jeho obsah nezalomitelnou mezeru */
.halo.fx-flicker + .corrupt.fx-underline::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
- **Selector:** `.fx-flicker`
- **CSS body (primary):**
```css
.fx-flicker {
animation: fx-flicker 2.2s infinite;
}
```

---

## `.fx-glitch`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\components.css
- **Used in:** 16 occurrences across 9 files
- **Effect properties:** text-shadow, animation
- **Animations:** fxGlitchPulse
- **Selectors (sample):** `.fx-glitch`, `/* Overlay text like echo-ghost, driven by data-glitch */
  .fx-glitch::after`, `/* When pinned, keep overlay statically lifted above baseline (no drift) */
  .fx-glitch.glitch-echo::after,
  .fx-glitch[data-glitch-pinned="1"]::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM]_en.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
- **Selector:** `.fx-glitch`
- **CSS body (primary):**
```css
.fx-glitch {
display: inline; /* inline flow – zachová předešlou mezeru */
    position: relative;
    overflow: visible; /* allow overlay to extend outside line box */
    vertical-align: baseline;
    color: currentColor;
    text-shadow: 0 0 6px var(--glow-secondary), 0 0 12px var(--glow-primary);
    animation: fxGlitchPulse 1.1s steps(2,end) infinite;
    cursor: pointer;
    z-index: 2; /* ensure stacking above paragraph decorations */
}
```

---

## `.fx-glow-magenta`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 18 occurrences across 8 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.fx-glow-magenta`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
- **Selector:** `.fx-glow-magenta`
- **CSS body (primary):**
```css
.fx-glow-magenta {
text-shadow: 0 0 4px var(--accent-primary, #f0f), 0 0 10px var(--accent-primary, #f0f), 0 0 18px var(--accent-primary, #f0f);
}
```

---

## `.fx-gradient`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, src\styles\components-dialog.css, src\styles\components.css
- **Used in:** 174 occurrences across 17 files
- **Effect properties:** text-shadow, animation
- **Animations:** glitchenaPulse
- **Selectors (sample):** `}

.dialog.fx-gradient`, `p.dialog.fx-gradient::before`, `}
  
  .fx-gradient`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM]_en.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
- **Selector:** `}

.dialog.fx-gradient`
- **CSS body (primary):**
```css
.fx-gradient {
color: var(--accent-error, #ff1744);
  text-shadow: 
    0 0 8px rgba(255, 23, 68, 0.9),
    0 0 16px rgba(255, 23, 68, 0.7),
    0 0 24px rgba(255, 23, 68, 0.5),
    0 0 32px rgba(255, 23, 68, 0.3),
    0 0 40px rgba(255, 23, 68, 0.2);
  font-family: 'Text03i', monospace;
  font-weight: 700; 
  font-style: italic;
  font-size: calc(1.2rem * var(--font-size-multiplier));
  position: relative;
  animation: glitchenaPulse 3s ease-in-out infinite;
}
```

---

## `.fx-neon`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, src\styles\components.css
- **Used in:** 136 occurrences across 24 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* =========================
     TEXT FX (utilities) – sjednoceno, bez duplicit.
     ========================= */
  .fx-neon`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `/* Micro padding – prevence vizuálního slévání mezery (glow/kerning) */
  .fx-neon,
  .neon-blood`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
- **Selector:** `/* =========================
     TEXT FX (utilities) – sjednoceno, bez duplicit.
     ========================= */
  .fx-neon`
- **CSS body (primary):**
```css
.fx-neon {
color: var(--text-primary);
    text-shadow: 0 0 6px var(--glow-primary), 0 0 12px var(--glow-primary), 0 0 18px var(--glow-secondary);
}
```

---

## `.fx-noise`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 56 occurrences across 15 files
- **Effect properties:** filter, blend-mode
- **Selectors (sample):** `}
  
  .fx-noise`, `.fx-noise::after`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
- **Selector:** `.fx-noise::after`
- **CSS body (primary):**
```css
.fx-noise {
content: ""; position: absolute; inset: -2px; mix-blend-mode: overlay; pointer-events: none; opacity: .35;
    background-image:
      radial-gradient(circle at 15% 20%, rgba(255,255,255,.07) 2px, transparent 2px),
      radial-gradient(circle at 40% 80%, rgba(255,255,255,.05) 1.5px, transparent 1.5px),
      radial-gradient(circle at 75% 35%, rgba(255,255,255,.06) 1px, transparent 1px),
      radial-gradient(circle at 90% 60%, rgba(255,255,255,.04) 1px, transparent 1px),
      radial-gradient(circle at 25% 55%, rgba(255,255,255,.05) 1.5px, transparent 1.5px);
    background-size: 8px 8px, 10p…
}
```

---

## `.fx-outline`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components.css
- **Used in:** 85 occurrences across 29 files
- **Effect properties:** text-shadow, transition, color-mix
- **Selectors (sample):** `/* Text outlines */
  .fx-outline,
  .fx-outline.is-lit`, `/* Text outlines */
  .fx-outline,
  .fx-outline.is-lit`, `.fx-outline`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
- **Selector:** `.fx-outline`
- **CSS body (primary):**
```css
.fx-outline {
text-shadow:
      -1px -1px 0 color-mix(in oklab, currentColor 18%, transparent),
       1px -1px 0 color-mix(in oklab, currentColor 18%, transparent),
      -1px  1px 0 color-mix(in oklab, currentColor 18%, transparent),
       1px  1px 0 color-mix(in oklab, currentColor 18%, transparent);
    color: transparent;
    -webkit-text-stroke: 0.6px color-mix(in oklab, currentColor 35%, transparent);
    opacity: .65;
    transition: color .18s ease, text-shadow .18s ease, opacity .18s ease, -webkit-text-stroke-color .18s ease, -webkit-text-stroke-width .18s ease;
    display: inline;
}
```

---

## `.fx-rainbow`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, text-clip/gradient
- **Animations:** fx-rainbow
- **Selectors (sample):** `.fx-rainbow`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`
- **Selector:** `.fx-rainbow`
- **CSS body (primary):**
```css
.fx-rainbow {
background: linear-gradient(90deg, #ff004c, #ffbf00, #00ff95, #00b3ff, #c300ff, #ff004c);
    background-size: 300% 100%;
    -webkit-background-clip: text; background-clip: text; color: transparent;
    animation: fx-rainbow 6s linear infinite;
}
```

---

## `.fx-scanline`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1274 occurrences across 33 files
- **Effect properties:** blend-mode
- **Selectors (sample):** `.fx-scanline`, `.fx-scanline::after`, `}
  /* Scanline overlay effect */
  .fx-scanline`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
- **Selector:** `.fx-scanline::after`
- **CSS body (primary):**
```css
.fx-scanline {
content: ""; position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.06) 1px, transparent 1px, transparent 3px);
    mix-blend-mode: overlay; opacity: .35;
}
```

---

## `.fx-shadow-lg`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.fx-shadow-lg`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`
- **Usage sample:**
  - `src\game\cyklus\cards\object.cards.ts`
- **Selector:** `.fx-shadow-lg`
- **CSS body (primary):**
```css
.fx-shadow-lg {
text-shadow: 0 2px 0 rgba(0,0,0,.35), 0 4px 12px rgba(0,0,0,.5);
}
```

---

## `.fx-underline`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, public\styles.css, src\styles\components.css
- **Used in:** 103 occurrences across 18 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.fx-underline`, `.fx-underline::after`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
- **Selector:** `.fx-underline::after`
- **CSS body (primary):**
```css
.fx-underline {
content: ""; position: absolute; left: 0; right: 0; bottom: -2px; height: 2px;
    background: linear-gradient(90deg, var(--accent-primary), transparent, var(--accent-secondary));
    box-shadow: 0 0 8px var(--glow-primary);
}
```

---

## `.fx-uppercase-wide`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 9 occurrences across 8 files
- **Effect properties:** transform
- **Selectors (sample):** `.fx-uppercase-wide`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
- **Selector:** `.fx-uppercase-wide`
- **CSS body (primary):**
```css
.fx-uppercase-wide {
text-transform: uppercase; letter-spacing: .12em;
}
```

---

## `.fx-wave`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 29 occurrences across 12 files
- **Effect properties:** animation
- **Animations:** fx-wave
- **Selectors (sample):** `}
  
  .fx-wave`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM]_en.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
- **Selector:** `}
  
  .fx-wave`
- **CSS body (primary):**
```css
.fx-wave {
display: inline-block; animation: fx-wave 1.8s ease-in-out infinite;
}
```

---

## `.game-action-bar`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* --- Action Bar ------------------------------------------------------- */
.game-action-bar`
- **Selector:** `/* --- Action Bar ------------------------------------------------------- */
.game-action-bar`
- **CSS body (primary):**
```css
.game-action-bar {
padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 10%, transparent);
  flex-wrap: wrap;
}
```

---

## `.game-ap-dot`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.game-ap-dot`
- **Selector:** `.game-ap-dot`
- **CSS body (primary):**
```css
.game-ap-dot {
font-size: 0.7rem;
  transition: color 0.2s;
}
```

---

## `.game-ap-dot--empty`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-ap-dot--empty`
- **Selector:** `.game-ap-dot--empty`
- **CSS body (primary):**
```css
.game-ap-dot--empty {
color: color-mix(in srgb, var(--text-primary, #e0ddf5) 20%, transparent);
}
```

---

## `.game-badge`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `/* --- Game badge -------------------------------------------------------- */
.game-badge`
- **Selector:** `/* --- Game badge -------------------------------------------------------- */
.game-badge`
- **CSS body (primary):**
```css
.game-badge {
font-size: 0.65rem;
  font-family: var(--font-mono, monospace);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.15rem 0.45rem;
  border-radius: 2px;
  border: 1px solid currentColor;
}
```

---

## `.game-bar`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* --- Bar -------------------------------------------------------------- */
.game-bar`
- **Selector:** `/* --- Bar -------------------------------------------------------------- */
.game-bar`
- **CSS body (primary):**
```css
.game-bar {
flex: 1;
  height: 6px;
  background: color-mix(in srgb, var(--text-primary, #e0ddf5) 10%, transparent);
  border-radius: 3px;
  overflow: hidden;
}
```

---

## `.game-bar__fill`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.game-bar__fill`
- **Selector:** `.game-bar__fill`
- **CSS body (primary):**
```css
.game-bar__fill {
height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}
```

---

## `.game-card`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* --- Game Card -------------------------------------------------------- */
.game-card`, `.game-card:hover:not(:disabled)`, `.game-card`
- **Selector:** `.game-card:hover:not(:disabled)`
- **CSS body (primary):**
```css
.game-card {
border-color: color-mix(in srgb, var(--text-primary, #e0ddf5) 40%, transparent);
  background: color-mix(in srgb, #0a0a0f 75%, #181840);
}
```

---

## `.game-card--action`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--action`, `.game-card--selected.game-card--action`
- **Selector:** `.game-card--action`
- **CSS body (primary):**
```css
.game-card--action {
border-color: color-mix(in srgb, #70a0f0 30%, transparent);
}
```

---

## `.game-card--event`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--event`
- **Selector:** `.game-card--event`
- **CSS body (primary):**
```css
.game-card--event {
border-color: color-mix(in srgb, #f08060 30%, transparent);
}
```

---

## `.game-card--glitch`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--glitch`, `.game-card--selected.game-card--glitch`
- **Selector:** `.game-card--glitch`
- **CSS body (primary):**
```css
.game-card--glitch {
border-color: color-mix(in srgb, #f07070 30%, transparent);
}
```

---

## `.game-card--intrigue`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--intrigue`
- **Selector:** `.game-card--intrigue`
- **CSS body (primary):**
```css
.game-card--intrigue {
border-color: color-mix(in srgb, #c06090 30%, transparent);
}
```

---

## `.game-card--memory`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--memory`, `.game-card--selected.game-card--memory`
- **Selector:** `.game-card--memory`
- **CSS body (primary):**
```css
.game-card--memory {
border-color: color-mix(in srgb, #a070f0 30%, transparent);
}
```

---

## `.game-card--playable`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.game-card--playable`, `.game-card--playable:hover`
- **Selector:** `.game-card--playable:hover`
- **CSS body (primary):**
```css
.game-card--playable {
transform: translateY(-4px);
}
```

---

## `.game-card--relic`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--relic`, `.game-card--selected.game-card--relic`
- **Selector:** `.game-card--relic`
- **CSS body (primary):**
```css
.game-card--relic {
border-color: color-mix(in srgb, #f0c060 30%, transparent);
}
```

---

## `.game-card--selected`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--selected`, `.game-card--selected.game-card--action`, `.game-card--selected.game-card--memory`
- **Selector:** `.game-card--selected`
- **CSS body (primary):**
```css
.game-card--selected {
border-color: #7af;
  background: color-mix(in srgb, #0a0a0f 75%, #0a2040);
}
```

---

## `.game-card--stabilization`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--stabilization`, `.game-card--selected.game-card--stabilization`
- **Selector:** `.game-card--stabilization`
- **CSS body (primary):**
```css
.game-card--stabilization {
border-color: color-mix(in srgb, #60c0b0 30%, transparent);
}
```

---

## `.game-card--unit`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--unit`, `.game-card--selected.game-card--unit`
- **Selector:** `.game-card--unit`
- **CSS body (primary):**
```css
.game-card--unit {
border-color: color-mix(in srgb, #60c090 30%, transparent);
}
```

---

## `.game-card--void`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card--void`, `.game-card--selected.game-card--void`
- **Selector:** `.game-card--void`
- **CSS body (primary):**
```css
.game-card--void {
border-color: color-mix(in srgb, #9060c0 30%, transparent);
}
```

---

## `.game-card__flavor`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-card__flavor`
- **Selector:** `.game-card__flavor`
- **CSS body (primary):**
```css
.game-card__flavor {
font-size: 0.55rem;
  font-style: italic;
  color: color-mix(in srgb, var(--text-secondary, #a0a0c0) 65%, transparent);
  margin-top: 0.2rem;
  border-top: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 8%, transparent);
  padding-top: 0.25rem;
}
```

---

## `.game-end-report__player`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-end-report__player`
- **Selector:** `.game-end-report__player`
- **CSS body (primary):**
```css
.game-end-report__player {
display: grid;
  grid-template-columns: 2rem 1fr auto;
  grid-template-rows: auto auto auto;
  gap: 0.2rem 0.75rem;
  padding: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 15%, transparent);
  border-radius: 3px;
  font-family: var(--font-mono, monospace);
}
```

---

## `.game-end-report__profile-pill`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-end-report__profile-pill`
- **Selector:** `.game-end-report__profile-pill`
- **CSS body (primary):**
```css
.game-end-report__profile-pill {
font-size: 0.55rem;
  padding: 0.1rem 0.4rem;
  background: color-mix(in srgb, #a070f0 12%, transparent);
  border: 1px solid color-mix(in srgb, #a070f0 30%, transparent);
  border-radius: 2px;
  color: #c8a0f0;
}
```

---

## `.game-entry-error`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-entry-error`
- **Usage sample:**
  - `app\game\GameClient.tsx`
- **Selector:** `.game-entry-error`
- **CSS body (primary):**
```css
.game-entry-error {
color: var(--game-danger);
  font-size: 0.8rem;
  font-family: var(--font-family-mono, monospace);
  padding: 0.5rem;
  border: 1px solid color-mix(in srgb, var(--game-danger) 30%, transparent);
  border-radius: 4px;
}
```

---

## `.game-entry-title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.game-entry-title`, `.game-entry-title`
- **Usage sample:**
  - `app\game\GameClient.tsx`
- **Selector:** `.game-entry-title`
- **CSS body (primary):**
```css
.game-entry-title {
font-size: 1.8rem;
  font-family: var(--font-family-mono, monospace);
  color: var(--game-accent);
  letter-spacing: 0.05em;
  text-align: center;
  margin: 0;
  text-shadow: 0 0 8px var(--glow-secondary);
}
```

---

## `.game-field-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.game-field-label`
- **Usage sample:**
  - `app\game\GameClient.tsx`
- **Selector:** `.game-field-label`
- **CSS body (primary):**
```css
.game-field-label {
font-size: 0.75rem;
  font-family: var(--font-family-mono, monospace);
  color: var(--game-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
```

---

## `.game-hand`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* --- Card Hand -------------------------------------------------------- */
.game-hand`
- **Selector:** `/* --- Card Hand -------------------------------------------------------- */
.game-hand`
- **CSS body (primary):**
```css
.game-hand {
border-top: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 10%, transparent);
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
```

---

## `.game-input`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow, transition
- **Selectors (sample):** `.game-input`, `.game-input:focus`, `/* Inputs / buttons */
  .game-input`
- **Usage sample:**
  - `app\game\GameClient.tsx`
- **Selector:** `.game-input`
- **CSS body (primary):**
```css
.game-input {
background: var(--game-input-bg);
  border: 1px solid var(--game-border);
  border-radius: 4px;
  color: var(--game-text);
  font-family: var(--font-family-mono, monospace);
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}
```

---

## `.game-input--code`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.game-input--code`
- **Usage sample:**
  - `app\game\GameClient.tsx`
- **Selector:** `.game-input--code`
- **CSS body (primary):**
```css
.game-input--code {
text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 1.2rem;
  text-align: center;
}
```

---

## `.game-loading__dots`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** game-blink
- **Selectors (sample):** `.game-loading__dots`
- **Selector:** `.game-loading__dots`
- **CSS body (primary):**
```css
.game-loading__dots {
font-size: 1.8rem;
  letter-spacing: 0.3rem;
  animation: game-blink 1.2s steps(3, end) infinite;
}
```

---

## `.game-log__entry`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-log__entry`
- **Selector:** `.game-log__entry`
- **CSS body (primary):**
```css
.game-log__entry {
display: flex;
  gap: 0.35rem;
  align-items: flex-start;
  line-height: 1.4;
  padding: 0.15rem 0;
  border-bottom: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 5%, transparent);
}
```

---

## `.game-player-panel`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, color-mix
- **Selectors (sample):** `/* --- Player Panel ----------------------------------------------------- */
.game-player-panel`
- **Selector:** `/* --- Player Panel ----------------------------------------------------- */
.game-player-panel`
- **CSS body (primary):**
```css
.game-player-panel {
padding: 0.65rem 0.5rem;
  border: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 10%, transparent);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: border-color 0.2s ease;
  font-size: 0.65rem;
  font-family: var(--font-mono, monospace);
}
```

---

## `.game-setup__label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.game-setup__label`
- **Selector:** `.game-setup__label`
- **CSS body (primary):**
```css
.game-setup__label {
font-family: var(--font-mono, monospace);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-secondary, #a0a0c0);
}
```

---

## `.game-setup__mode-btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, color-mix
- **Selectors (sample):** `.game-setup__mode-btn`, `.game-setup__mode-btn:hover`
- **Selector:** `.game-setup__mode-btn`
- **CSS body (primary):**
```css
.game-setup__mode-btn {
display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 15%, transparent);
  background: color-mix(in srgb, #0a0a0f 90%, #101030);
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s ease, background 0.2s ease;
}
```

---

## `.game-setup__mode-btn--active`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-setup__mode-btn--active`
- **Selector:** `.game-setup__mode-btn--active`
- **CSS body (primary):**
```css
.game-setup__mode-btn--active {
border-color: #7af;
  background: color-mix(in srgb, #0a0a0f 80%, #0a1830);
}
```

---

## `.game-setup__name-input`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, color-mix
- **Selectors (sample):** `.game-setup__name-input`, `.game-setup__name-input:focus`
- **Selector:** `.game-setup__name-input`
- **CSS body (primary):**
```css
.game-setup__name-input {
background: color-mix(in srgb, var(--bg-primary, #0a0a0f) 80%, #101030);
  border: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 20%, transparent);
  color: var(--text-primary, #e0ddf5);
  padding: 0.5rem 0.75rem;
  border-radius: 3px;
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  width: 100%;
  outline: none;
  transition: border-color 0.2s;
}
```

---

## `.game-shell__sidebar`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-shell__sidebar`, `.game-shell__sidebar,
  .game-shell__sidebar--right`
- **Selector:** `.game-shell__sidebar`
- **CSS body (primary):**
```css
.game-shell__sidebar {
padding: 1rem 0.75rem;
  border-right: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 12%, transparent);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}
```

---

## `.game-shell__sidebar--right`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-shell__sidebar--right`, `.game-shell__sidebar,
  .game-shell__sidebar--right`
- **Selector:** `.game-shell__sidebar--right`
- **CSS body (primary):**
```css
.game-shell__sidebar--right {
border-right: none;
  border-left: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 12%, transparent);
}
```

---

## `.game-solo-banner--cyklus`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

/* Game entry banner override for CYKLUS */
.game-solo-banner--cyklus`, `.game-solo-banner--cyklus .game-solo-banner__title`, `/* Solo banner */
[data-theme=mono-light] .game-solo-banner--cyklus .game-solo-banner__title`
- **Selector:** `}

/* Game entry banner override for CYKLUS */
.game-solo-banner--cyklus`
- **CSS body (primary):**
```css
.game-solo-banner--cyklus {
background: linear-gradient(135deg, rgba(106, 90, 249, 0.12), rgba(80, 192, 255, 0.08));
  border-color: rgba(123, 237, 159, 0.25);
  box-shadow: 0 0 24px rgba(106, 90, 249, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}
```

---

## `.game-solo-banner__label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.game-solo-banner__label`
- **Selector:** `.game-solo-banner__label`
- **CSS body (primary):**
```css
.game-solo-banner__label {
font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: var(--accent);
  text-transform: uppercase;
}
```

---

## `.game-solo-banner__title`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.game-solo-banner__title`, `.game-solo-banner--cyklus .game-solo-banner__title`, `/* Solo banner */
[data-theme=mono-light] .game-solo-banner--cyklus .game-solo-banner__title`
- **Selector:** `.game-solo-banner__title`
- **CSS body (primary):**
```css
.game-solo-banner__title {
font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-primary);
  text-transform: uppercase;
}
```

---

## `.game-void-track`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* --- Void Track ------------------------------------------------------- */
.game-void-track`
- **Selector:** `/* --- Void Track ------------------------------------------------------- */
.game-void-track`
- **CSS body (primary):**
```css
.game-void-track {
padding: 0.75rem;
  border: 1px solid color-mix(in srgb, #a070f0 25%, transparent);
  background: color-mix(in srgb, #0a0a0f 80%, #1a0a2a);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
```

---

## `.game-void-track__event-tag`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.game-void-track__event-tag`
- **Selector:** `.game-void-track__event-tag`
- **CSS body (primary):**
```css
.game-void-track__event-tag {
font-size: 0.55rem;
  font-family: var(--font-mono, monospace);
  background: color-mix(in srgb, #f07070 15%, transparent);
  border: 1px solid #f07070;
  padding: 0.1rem 0.35rem;
  border-radius: 2px;
  color: #f07070;
}
```

---

## `.gateway-lead`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* lead log/dialog tighten */
.synth-gateway-shell .gateway-lead`, `/* lead log/dialog tighten */
.synth-gateway-shell .gateway-lead`
- **Selector:** `/* lead log/dialog tighten */
.synth-gateway-shell .gateway-lead`
- **CSS body (primary):**
```css
.gateway-lead {
max-width: 900px;
color: color-mix(in oklab, var(--text-primary) 92%, var(--gate-cyan));
}
```

---

## `.generated-image`

- **Status:** defined
- **CSS files:** src\styles\base.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `/* Themed visual filter for generated images (applies theme var --filter-primary) */
.generated-image`, `.crt.fog .generated-image`
- **Selector:** `/* Themed visual filter for generated images (applies theme var --filter-primary) */
.generated-image`
- **CSS body (primary):**
```css
.generated-image {
filter: var(--filter-primary, none);
}
```

---

## `.glass`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css, src\styles\effects.css, src\styles\reader.css
- **Used in:** 119 occurrences across 22 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `﻿/* =========================================================
   SYNTHOMA UI CORE — sjednoceno, bez duplicit, theme-aware
   Sekce: Utilities • Typography • ScrambleTitle • Hero
           Control Panel • Loaders/Overlays • Modal • Error
           Video/Noise/GlitchBG • Text FX • Keyframes • A11y
   ========================================================= */

/* =========================
   UTILITIES (glass/panel/btn/halo/CRT/fog)
   ========================= */
   .glass`, `#control-panel.glass`, `#control-panel.control-panel.glass`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
  - `app\chapter\[id]\ChapterAccessGate.tsx`
  - `app\chapter\[id]\page.tsx`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
- **Selector:** `﻿/* =========================================================
   SYNTHOMA UI CORE — sjednoceno, bez duplicit, theme-aware
   Sekce: Utilities • Typography • ScrambleTitle • Hero
           Control Panel • Loaders/Overlays • Modal • Error
           Video/Noise/GlitchBG • Text FX • Keyframes • A11y
   ========================================================= */

/* =========================
   UTILITIES (glass/panel/btn/halo/CRT/fog)
   ========================= */
   .glass`
- **CSS body (primary):**
```css
.glass {
background: var(--bg-glass);
    -webkit-backdrop-filter: blur(var(--app-bg-blur, var(--glass-blur, 8px)));
    backdrop-filter: blur(var(--app-bg-blur, var(--glass-blur, 8px)));
    border: 1px solid var(--border-tertiary);
}
```

---

## `.glitch`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** glitch
- **Selectors (sample):** `.glitch`, `}

.glitch::before, .glitch::after`, `}

.glitch::before, .glitch::after`
- **Usage sample:**
  - `app\purchase\success\page.tsx`
- **Selector:** `.glitch`
- **CSS body (primary):**
```css
.glitch {
position: relative;
  animation: glitch 1s linear infinite;
}
```

---

## `.glitch-1`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `.glitching-char.glitch-1`
- **Selector:** `.glitching-char.glitch-1`
- **CSS body (primary):**
```css
.glitch-1 {
transform: translate(0.5px, -0.5px); 
    opacity: .95; 
    text-shadow: 0 0 6px var(--glow-secondary);
}
```

---

## `.glitch-2`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `.glitching-char.glitch-2`
- **Selector:** `.glitching-char.glitch-2`
- **CSS body (primary):**
```css
.glitch-2 {
transform: translate(-0.5px, 0.5px); 
    opacity: .92; 
    text-shadow: 0 0 8px var(--glow-primary);
}
```

---

## `.glitch-bg`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 9 occurrences across 7 files
- **Selectors (sample):** `}

/* =========================
   Glitch Background & Themed Video Filters – rozšířeno.
   ========================= */
.glitch-bg`, `.glitch-bg::after`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
  - `app\cyklus\void\page.tsx`
  - `app\login\page.tsx`
  - `app\privacy\PrivacyClient.tsx`
  - `app\purchase\success\page.tsx`
- **Selector:** `.glitch-bg::after`
- **CSS body (primary):**
```css
.glitch-bg {
content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -3;
  opacity: var(--retro-canvas-opacity, 0.5);
  background-image: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0, 255, 0, .03) 0, rgba(0, 255, 0, .03) 4px
  );
}
```

---

## `.glitch-button`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, transition
- **Selectors (sample):** `.glitch-button`, `.glitch-button:hover`, `.glitch-button:before`
- **Selector:** `.glitch-button`
- **CSS body (primary):**
```css
.glitch-button {
font-family: var(--font-family-heading); 
    font-weight: bold;
    background: rgba(0, 0, 0, 0.0);
    border: none;
    color: var(--text-primary);
    font-size: 1.8rem;
    text-shadow: 0 0 4px var(--text-secondary), 0 0 6px var(--text-secondary);
    cursor: pointer;
    position: relative;
    overflow: visible;
    transition: all 0.3s ease;
    z-index: 10;
    -webkit-user-select: none;
    user-select: none;
}
```

---

## `.glitch-char`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, src\styles\components.css, src\styles\synthoma-wordmark.css
- **Used in:** 4 occurrences across 4 files
- **Effect properties:** text-shadow, transform, color-mix
- **Selectors (sample):** `.glitch-master .glitch-char`, `/* Subtle per-char glitch state – no glyph swapping, only chromatic shift */
  .glitch-master .glitch-char.glitchy`, `#glitch-synthoma .glitch-char`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\reader\ReaderContent.tsx`
  - `src\components\synthoma\SynthomaWordmark.tsx`
- **Selector:** `/* Subtle per-char glitch state – no glyph swapping, only chromatic shift */
  .glitch-master .glitch-char.glitchy`
- **CSS body (primary):**
```css
.glitch-char {
text-shadow:
      1px 0 color-mix(in oklab, var(--accent-primary) 80%, transparent),
     -1px 0 color-mix(in oklab, var(--accent-secondary) 80%, transparent),
      0 0 6px var(--glow-secondary), 0 0 12px var(--glow-primary);
    transform: translateY(-0.5px);
}
```

---

## `.glitch-echo`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, animation, transform
- **Animations:** none
- **Selectors (sample):** `/* When pinned, keep overlay statically lifted above baseline (no drift) */
  .fx-glitch.glitch-echo::after,
  .fx-glitch[data-glitch-pinned="1"]::after`, `/* Keep base glyphs visible but stop their pulse to reduce bounce */
  .fx-glitch.glitch-echo,
  .fx-glitch[data-glitch-pinned="1"]`
- **Selector:** `/* When pinned, keep overlay statically lifted above baseline (no drift) */
  .fx-glitch.glitch-echo::after,
  .fx-glitch[data-glitch-pinned="1"]::after`
- **CSS body (primary):**
```css
.glitch-echo {
left: 0; top: 0;
    transform: translate(0, -0.6em);
    opacity: .5;
    font-size: 0.88em;
    color: currentColor;
    text-shadow: inherit;
    animation: none; /* stay put */
}
```

---

## `.glitch-fake1`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, src\styles\components.css, src\styles\effects.css, src\styles\motion-contract.css
- **Used in:** 5 occurrences across 5 files
- **Effect properties:** text-shadow, blend-mode, transform
- **Selectors (sample):** `.glitch-master .glitch-fake1, .glitch-master .glitch-fake2`, `.glitch-master .glitch-fake1`, `.glitch-master .glitch-fake1`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\login\page.tsx`
  - `app\reader\ReaderContent.tsx`
  - `app\register\page.tsx`
- **Selector:** `.glitch-master .glitch-fake1, .glitch-master .glitch-fake2`
- **CSS body (primary):**
```css
.glitch-fake1 {
position: absolute; left: 0; top: 0; z-index: 2; pointer-events: none;
    mix-blend-mode: normal; font: inherit; letter-spacing: inherit; white-space: inherit;
    width: 100%; height: 100%;        /* follow real layer box for multi-line */
    transform-origin: left top;
    will-change: transform, text-shadow;
    color: var(--text-primary);
    text-shadow: 0 0 6px var(--glow-secondary), 0 0 14px var(--glow-primary);
}
```

---

## `.glitch-fake2`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, src\styles\components.css, src\styles\effects.css, src\styles\motion-contract.css
- **Used in:** 5 occurrences across 5 files
- **Effect properties:** text-shadow, blend-mode, transform
- **Selectors (sample):** `.glitch-master .glitch-fake1, .glitch-master .glitch-fake2`, `.glitch-master .glitch-fake2`, `.glitch-master .glitch-fake2`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\login\page.tsx`
  - `app\reader\ReaderContent.tsx`
  - `app\register\page.tsx`
- **Selector:** `.glitch-master .glitch-fake1, .glitch-master .glitch-fake2`
- **CSS body (primary):**
```css
.glitch-fake2 {
position: absolute; left: 0; top: 0; z-index: 2; pointer-events: none;
    mix-blend-mode: normal; font: inherit; letter-spacing: inherit; white-space: inherit;
    width: 100%; height: 100%;        /* follow real layer box for multi-line */
    transform-origin: left top;
    will-change: transform, text-shadow;
    color: var(--text-primary);
    text-shadow: 0 0 6px var(--glow-secondary), 0 0 14px var(--glow-primary);
}
```

---

## `.glitch-intense`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, filter
- **Selectors (sample):** `.glitch-intense .alarm-emote`
- **Selector:** `.glitch-intense .alarm-emote`
- **CSS body (primary):**
```css
.glitch-intense {
animation-duration: 0.5s !important; filter: drop-shadow(0 0 8px currentColor) !important;
}
```

---

## `.glitch-master`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 5 occurrences across 5 files
- **Effect properties:** text-shadow, blend-mode, transform
- **Selectors (sample):** `/* Glitch master – sjednoceno pro landing, reader, autor. */
  .glitch-master`, `/* Make FAKE layers the primary visible glyphs; REAL layer keeps layout only */
  .glitch-master .glitch-real`, `.glitch-master .glitch-fake1, .glitch-master .glitch-fake2`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\login\page.tsx`
  - `app\reader\ReaderContent.tsx`
  - `app\register\page.tsx`
- **Selector:** `.glitch-master .glitch-fake1, .glitch-master .glitch-fake2`
- **CSS body (primary):**
```css
.glitch-master {
position: absolute; left: 0; top: 0; z-index: 2; pointer-events: none;
    mix-blend-mode: normal; font: inherit; letter-spacing: inherit; white-space: inherit;
    width: 100%; height: 100%;        /* follow real layer box for multi-line */
    transform-origin: left top;
    will-change: transform, text-shadow;
    color: var(--text-primary);
    text-shadow: 0 0 6px var(--glow-secondary), 0 0 14px var(--glow-primary);
}
```

---

## `.glitch-minimal`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Selectors (sample):** `}
  
  /* Glitch-minimal/intense – intensity úpravy. */
  .glitch-minimal .alarm-emote`
- **Selector:** `}
  
  /* Glitch-minimal/intense – intensity úpravy. */
  .glitch-minimal .alarm-emote`
- **CSS body (primary):**
```css
.glitch-minimal {
animation-duration: 2s !important; opacity: 0.7 !important;
}
```

---

## `.glitch-real`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, src\styles\components.css, src\styles\synthoma-wordmark.css
- **Used in:** 6 occurrences across 6 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* Make FAKE layers the primary visible glyphs; REAL layer keeps layout only */
  .glitch-master .glitch-real`, `#glitch-synthoma .glitch-real`, `.home-page #glitch-synthoma .glitch-real,
  .landing-intro-page #glitch-synthoma .glitch-real`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\login\page.tsx`
  - `app\reader\ReaderContent.tsx`
  - `app\register\page.tsx`
- **Selector:** `/* Make FAKE layers the primary visible glyphs; REAL layer keeps layout only */
  .glitch-master .glitch-real`
- **CSS body (primary):**
```css
.glitch-real {
position: relative; z-index: 1;
    color: transparent; text-shadow: none; -webkit-text-stroke: 0;
}
```

---

## `.glitch-word`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, filter, transform
- **Selectors (sample):** `.no-animations #glitch-synthoma.glitch-master, .no-animations .glitch-fake1, .no-animations .glitch-fake2,
  .no-animations .glitch-char, .no-animations .glitch-char.glitchy, .no-animations .glitch-word,
  .no-animations .alarm-emote, .no-animations #glitch-bg, .no-animations .neon-char,
  .no-animations .noising-char, .no-animations .glitching-char`
- **Selector:** `.no-animations #glitch-synthoma.glitch-master, .no-animations .glitch-fake1, .no-animations .glitch-fake2,
  .no-animations .glitch-char, .no-animations .glitch-char.glitchy, .no-animations .glitch-word,
  .no-animations .alarm-emote, .no-animations #glitch-bg, .no-animations .neon-char,
  .no-animations .noising-char, .no-animations .glitching-char`
- **CSS body (primary):**
```css
.glitch-word {
text-shadow: none !important;
    filter: none !important;
    transform: none !important;
    opacity: 1 !important;
}
```

---

## `.glitch-word2`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** blend-mode
- **Selectors (sample):** `/* --- Glitch/shine efekty používané v autor stránce --- */
.glitch-word2`, `.glitch-word2::before,
.glitch-word2::after`, `.glitch-word2::before,
.glitch-word2::after`
- **Selector:** `.glitch-word2::before,
.glitch-word2::after`
- **CSS body (primary):**
```css
.glitch-word2 {
content: attr(data-text);
  position: absolute;
  left: 0; top: 0;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: .6;
}
```

---

## `.glitching`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\components.css
- **Used in:** 5 occurrences across 4 files
- **Effect properties:** animation
- **Animations:** glitch
- **Selectors (sample):** `/* Glitching tokens – keep spacing/kerning stable */
  .glitching, .glitching .glitching-char`, `/* Glitching tokens – keep spacing/kerning stable */
  .glitching, .glitching .glitching-char`, `/* Glitching: no motion from CSS – only JS char swap is allowed */
  .glitching,
  .glitching::before,
  .glitching::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `public\books\efekty.html`
- **Selector:** `.glitching`
- **CSS body (primary):**
```css
.glitching {
position: relative;
  animation: glitch 1.2s linear infinite;
}
```

---

## `.glitching-char`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\motion-contract.css
- **Used in:** 20 occurrences across 4 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `/* Glitching tokens – keep spacing/kerning stable */
  .glitching, .glitching .glitching-char`, `.glitching-char`, `.glitching-char.glitch-1`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `public\books\efekty.html`
- **Selector:** `.glitching-char`
- **CSS body (primary):**
```css
.glitching-char {
display: inline-block;  
    will-change: transform, opacity, text-shadow; 
    vertical-align: baseline; 
    line-height: 0.65em; 
    width: calc(2rem * var(--font-size-multiplier));
    text-align: center;
}
```

---

## `.glitchy`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\motion-contract.css, src\styles\synthoma-wordmark.css
- **Used in:** 54 occurrences across 7 files
- **Effect properties:** text-shadow, animation
- **Animations:** glitch-shift
- **Selectors (sample):** `/* Jemný glitchy shift – bez přepisování, jen posun. */
  .glitchy`, `/* Subtle per-char glitch state – no glyph swapping, only chromatic shift */
  .glitch-master .glitch-char.glitchy`, `/* No animations mode – všechny glitchy umřou klidně. ☠️ */
  .no-animations #glitch-synthoma.glitch-master, .no-animations #glitch-synthoma .glitch-fake1, .no-animations #glitch-synthoma .glitch-fake2,
  .no-animations #glitch-synthoma .glitch-char, .no-animations #glitch-synthoma .glitch-char.glitchy`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM]_en.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
- **Selector:** `/* Jemný glitchy shift – bez přepisování, jen posun. */
  .glitchy`
- **CSS body (primary):**
```css
.glitchy {
text-shadow: 1px 0 var(--accent-primary), -1px 0 var(--accent-secondary);
    animation: glitch-shift .9s steps(2,end) infinite;
}
```

---

## `.halo`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, public\styles.css, src\styles\components.css
- **Used in:** 328 occurrences across 25 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.halo`, `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `/* --- Typografická oprava: zachovat mezeru před zvýrazněným slovem po 404 --- */
/* Pokud následuje zvýrazněný span hned po 404, vlož před jeho obsah nezalomitelnou mezeru */
.halo.fx-flicker + .corrupt.fx-underline::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
- **Selector:** `.halo`
- **CSS body (primary):**
```css
.halo {
color: var(--text-primary);
    text-shadow: 0 0 6px var(--glow-secondary), 0 0 14px var(--glow-primary);
}
```

---

## `.helpModalButton`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.helpModalButton`, `.helpModalButton:hover`
- **Selector:** `.helpModalButton`
- **CSS body (primary):**
```css
.helpModalButton {
width: 100%;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
```

---

## `.helpModalCloseButton`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.helpModalCloseButton`, `.helpModalCloseButton:hover`
- **Selector:** `.helpModalCloseButton`
- **CSS body (primary):**
```css
.helpModalCloseButton {
color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: color 0.2s ease-in-out;
}
```

---

## `.hero-intro`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

  /* Remove left rail/border for main title in reader contexts */
  .reader-page .title::before,
  .SYNTHOMAREADER .title::before,
  .hero-intro .title::before`, `/* Heading truncation – sjednoceno pro reader/hero. */
  .SYNTHOMAREADER h1, .SYNTHOMAREADER h2, .SYNTHOMAREADER h3,
  .hero-intro h1, .hero-intro h2, .hero-intro h3`, `/* Heading truncation – sjednoceno pro reader/hero. */
  .SYNTHOMAREADER h1, .SYNTHOMAREADER h2, .SYNTHOMAREADER h3,
  .hero-intro h1, .hero-intro h2, .hero-intro h3`
- **Selector:** `.hero-intro, .hero-intro .manifest-wrapper, #resizing-text, #manifest-container`
- **CSS body (primary):**
```css
.hero-intro {
background: transparent !important; border: none !important; box-shadow: none !important;
}
```

---

## `.home-first-contact__guest`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.home-first-contact__guest`, `.home-first-contact__guest span`, `.home-first-contact__guest p`
- **Usage sample:**
  - `src\components\home\HomeFirstContact.tsx`
- **Selector:** `.home-first-contact__guest`
- **CSS body (primary):**
```css
.home-first-contact__guest {
display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: var(--os-space-3); align-items: end; margin-top: var(--os-space-3); padding: var(--os-space-3); border-left: 2px solid var(--os-axis); background: color-mix(in srgb, var(--os-bg-deep) 88%, transparent);
}
```

---

## `.home-first-contact__path`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.home-first-contact__path[data-first-contact-path^="/chapter"]`, `.home-first-contact__path[data-first-contact-path="/cyklus"] > span,
.home-first-contact__path[data-first-contact-path="/cyklus"] strong`, `.home-first-contact__path[data-first-contact-path="/cyklus"] > span,
.home-first-contact__path[data-first-contact-path="/cyklus"] strong`
- **Selector:** `.home-first-contact__path[data-first-contact-path^="/chapter"]`
- **CSS body (primary):**
```css
.home-first-contact__path {
box-shadow: inset 0 2px 0 var(--os-text-cyan);
}
```

---

## `.home-first-contact__path--primary`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.home-first-contact__path--primary`
- **Selector:** `.home-first-contact__path--primary`
- **CSS body (primary):**
```css
.home-first-contact__path--primary {
box-shadow: inset 0 2px 0 var(--os-accent-primary);
}
```

---

## `.home-first-contact__paths`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.home-first-contact__paths`, `.home-first-contact__paths a`, `.home-first-contact__paths a:hover`
- **Usage sample:**
  - `src\components\home\HomeFirstContact.tsx`
- **Selector:** `.home-first-contact__paths a`
- **CSS body (primary):**
```css
.home-first-contact__paths {
display: grid; min-width: 0; min-height: 94px; align-content: start; gap: 4px; padding: var(--os-space-3); background: color-mix(in srgb, var(--os-surface) 92%, transparent); color: var(--os-text); text-decoration: none;
}
```

---

## `.home-light-quote__beam`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation, transform, color-mix
- **Animations:** home-light-fade
- **Selectors (sample):** `.home-light-quote__beam`
- **Usage sample:**
  - `src\components\home\SynthomaHome.tsx`
- **Selector:** `.home-light-quote__beam`
- **CSS body (primary):**
```css
.home-light-quote__beam {
position: absolute; left: 0; bottom: 0; width: 86%; height: 2px; background: linear-gradient(90deg, var(--text-accent-primary), var(--os-text-primary), var(--text-accent-secondary), transparent); box-shadow: 0 0 16px color-mix(in srgb, var(--text-accent-primary) 62%, transparent); transform-origin: left; animation: home-light-fade 5.5s ease-in-out infinite; pointer-events: none;
}
```

---

## `.home-light-quote__text`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, color-mix
- **Selectors (sample):** `.home-light-quote__text`, `.home-light-quote__text::after`, `.home-light-quote__text`
- **Usage sample:**
  - `src\components\home\SynthomaHome.tsx`
- **Selector:** `.home-light-quote__text`
- **CSS body (primary):**
```css
.home-light-quote__text {
position: relative; z-index: 1; display: block; font-family: var(--os-font-heading); font-size: 2.5rem; font-weight: 800; line-height: 1.14; letter-spacing: 0; text-wrap: balance; text-shadow: 0 0 18px color-mix(in srgb, var(--text-accent-primary) 42%, transparent), 0 0 32px color-mix(in srgb, var(--text-accent-secondary) 20%, transparent);
}
```

---

## `.home-page`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** blend-mode
- **Selectors (sample):** `}
  
  /* Home page + Landing Intro – sjednoceno 1:1. */
  .home-page #glitch-synthoma.glitch-master,
  .landing-intro-page #glitch-synthoma.glitch-master`, `.home-page #glitch-synthoma .glitch-fake1, .home-page #glitch-synthoma .glitch-fake2,
  .landing-intro-page #glitch-synthoma .glitch-fake1, .landing-intro-page #glitch-synthoma .glitch-fake2`, `.home-page #glitch-synthoma .glitch-fake1, .home-page #glitch-synthoma .glitch-fake2,
  .landing-intro-page #glitch-synthoma .glitch-fake1, .landing-intro-page #glitch-synthoma .glitch-fake2`
- **Selector:** `.home-page #glitch-synthoma .glitch-fake1, .home-page #glitch-synthoma .glitch-fake2,
  .landing-intro-page #glitch-synthoma .glitch-fake1, .landing-intro-page #glitch-synthoma .glitch-fake2`
- **CSS body (primary):**
```css
.home-page {
position: absolute;
    left: -10%; top: 0;
    margin: 0;
    width: 120%; height: 100%;
    pointer-events: none;
    letter-spacing: 0.08em;
    font-family: inherit;
    mix-blend-mode: normal;
    opacity: 1;
}
```

---

## `.home-primary-action`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.home-primary-action`, `.home-primary-action.os-surface`, `.home-primary-action:hover`
- **Usage sample:**
  - `src\components\home\HomePrimaryAction.tsx`
- **Selector:** `.home-primary-action`
- **CSS body (primary):**
```css
.home-primary-action {
display: grid; gap: var(--os-space-2); width: min(100%, 440px); margin-top: var(--os-space-6); padding: var(--os-space-4) var(--os-space-5); color: var(--os-text); text-decoration: none; box-shadow: inset 4px 0 0 var(--os-accent-primary);
}
```

---

## `.home-sector-link`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, color-mix
- **Selectors (sample):** `.home-sector-link`, `.home-sector-link:hover`, `.home-sector-link[data-home-sector="books"]`
- **Usage sample:**
  - `src\components\home\HomeSectorLinks.tsx`
- **Selector:** `.home-sector-link`
- **CSS body (primary):**
```css
.home-sector-link {
display: grid; grid-template-columns: 42px minmax(0, 1fr) auto; gap: var(--os-space-3); align-items: center; min-height: 74px; padding: var(--os-space-3); border: 0; border-bottom: 1px solid var(--os-border); border-radius: 0; background: linear-gradient(90deg, color-mix(in srgb, var(--os-surface) 86%, transparent), transparent); color: var(--os-text); text-decoration: none; transition: background 0.15s, border-color 0.15s;
}
```

---

## `.home-sector-link--featured`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.home-sector-link--featured`, `.home-sector-link--featured:hover`, `.home-sector-link--featured .home-sector-link__copy span`
- **Selector:** `.home-sector-link--featured`
- **CSS body (primary):**
```css
.home-sector-link--featured {
border-left: 3px solid var(--os-accent-primary); background: linear-gradient(90deg, color-mix(in srgb, var(--os-accent-primary) 12%, var(--os-surface) 88%), transparent);
}
```

---

## `.html`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `﻿/* synth-gate.css
 * Styly pro SYNTHOMAINFO.html (SYNTHOMA Gateway intro).
 * Importováno přímo v SYNTHOMAINFO.html přes <link>.
 */

/* =========================
SYNTHOMA GATEWAY COMPONENTS
Intro brána: rituál, ne rozcestník.
Používá se v SYNTHOMAINFO.html.
========================= */

.synth-gateway-shell`, `﻿/* synth-gate.css
 * Styly pro SYNTHOMAINFO.html (SYNTHOMA Gateway intro).
 * Importováno přímo v SYNTHOMAINFO.html přes <link>.
 */

/* =========================
SYNTHOMA GATEWAY COMPONENTS
Intro brána: rituál, ne rozcestník.
Používá se v SYNTHOMAINFO.html.
========================= */

.synth-gateway-shell`, `﻿/* synth-gate.css
 * Styly pro SYNTHOMAINFO.html (SYNTHOMA Gateway intro).
 * Importováno přímo v SYNTHOMAINFO.html přes <link>.
 */

/* =========================
SYNTHOMA GATEWAY COMPONENTS
Intro brána: rituál, ne rozcestník.
Používá se v SYNTHOMAINFO.html.
========================= */

.synth-gateway-shell`
- **Selector:** `﻿/* synth-gate.css
 * Styly pro SYNTHOMAINFO.html (SYNTHOMA Gateway intro).
 * Importováno přímo v SYNTHOMAINFO.html přes <link>.
 */

/* =========================
SYNTHOMA GATEWAY COMPONENTS
Intro brána: rituál, ne rozcestník.
Používá se v SYNTHOMAINFO.html.
========================= */

.synth-gateway-shell`
- **CSS body (primary):**
```css
.html {
--gate-cyan: var(--accent-secondary, #00ffff);
--gate-magenta: var(--accent-primary, #ff00ff);
--gate-yellow: var(--accent-warning, #f6ff00);
--gate-red: var(--accent-error, #ff1744);
--gate-bg: rgba(1, 3, 10, 0.94);
--gate-border: rgba(0, 255, 255, 0.18);

position: relative;
isolation: isolate;
overflow: hidden;
min-height: min(820px, calc(100dvh - 2rem));
display: flex;
flex-direction: column;
justify-content: center;
border: 1px solid var(--gate-border);
border-radius: clamp(18px, 2.4vw, 30px);
padding: clamp(1.15rem, 4vw, 3rem);
background:
radial-gradient(circle at 18% 16%, color-mix(in …
}
```

---

## `.id-panel-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, filter, backdrop-filter, transition, color-mix
- **Selectors (sample):** `.id-panel-btn`, `.id-panel-btn:hover,
.id-panel-btn.active`, `.id-panel-btn:hover,
.id-panel-btn.active`
- **Selector:** `.id-panel-btn`
- **CSS body (primary):**
```css
.id-panel-btn {
display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 10px;
  background: color-mix(in oklab, var(--bg-surface, #0b0b0c) 80%, transparent);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-secondary, rgba(255,255,255,.12));
  color: var(--text-primary, #f7f7ff);
  font-family: 'Text02', monospace;
  font-size: .75rem;
  letter-spacing: .1em;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s, border-color .15s, box-shadow .15s;
  box-shadow: 0 4px 16px rgba(0,0,0,.35);
}
```

---

## `.id-panel-home`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, filter, backdrop-filter, transition
- **Selectors (sample):** `.id-panel-home`, `.id-panel-home:hover`
- **Selector:** `.id-panel-home`
- **CSS body (primary):**
```css
.id-panel-home {
display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,.1);
  background: var(--bg-surface, rgba(11,11,12,.85));
  backdrop-filter: blur(10px);
  color: var(--text-secondary, rgba(207,207,227,.5));
  font-size: 0.8rem;
  text-decoration: none;
  transition: color .15s, border-color .15s, background .15s;
  box-shadow: 0 4px 16px rgba(0,0,0,.35);
}
```

---

## `.id-panel-label`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.id-panel-label`
- **Selector:** `.id-panel-label`
- **CSS body (primary):**
```css
.id-panel-label {
text-transform: uppercase;
}
```

---

## `.id-panel-name`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.id-panel-name`
- **Selector:** `.id-panel-name`
- **CSS body (primary):**
```css
.id-panel-name {
margin: 0;
  font-family: 'Text02', monospace;
  font-size: .85rem;
  letter-spacing: .1em;
  color: var(--text-primary, #f7f7ff);
  text-transform: uppercase;
}
```

---

## `.id-panel-popup`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, filter, backdrop-filter, transition, transform, color-mix
- **Selectors (sample):** `.id-panel-popup`, `.id-panel-popup.visible`
- **Selector:** `.id-panel-popup`
- **CSS body (primary):**
```css
.id-panel-popup {
position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: min(300px, 90vw);
  padding: 14px 16px;
  border-radius: 12px;
  background: color-mix(in oklab, var(--bg-surface, #0b0b0c) 90%, transparent);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-secondary, rgba(255,255,255,.12));
  box-shadow: 0 12px 36px rgba(0,0,0,.5), 0 0 18px rgba(124,92,255,.2);
  opacity: 0;
  transform: translateY(-6px) scale(.98);
  pointer-events: none;
  transition: opacity .16s ease, transform .16s ease;
  display: flex;
  flex-direction: column;
  ga…
}
```

---

## `.instantToggle`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.instantToggle`, `.instantToggle:hover`
- **Selector:** `.instantToggle`
- **CSS body (primary):**
```css
.instantToggle {
font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  opacity: 0.7;
  transition: opacity 0.2s ease, background 0.2s ease;
}
```

---

## `.intro-title`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `/* Mikro animace – intro. */
  .intro-title`, `.intro-title.visible`, `.hero-intro #resizing-text.intro-title`
- **Selector:** `.intro-title.visible`
- **CSS body (primary):**
```css
.intro-title {
opacity: 1; transform: none;
}
```

---

## `.is-active`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css, src\styles\cyklus\compact-mobile.css, src\styles\cyklus\hud.css, src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.synthoma-audio-panel__library button.is-active`, `.cyklus-bottom-nav__btn.is-active .cyklus-bottom-nav__icon`, `.cyklus-bottom-nav__btn:hover,
.cyklus-bottom-nav__btn:focus-visible,
.cyklus-bottom-nav__btn.is-active`
- **Selector:** `.cyklus-bottom-nav__btn.is-active .cyklus-bottom-nav__icon`
- **CSS body (primary):**
```css
.is-active {
transform: none;
}
```

---

## `.is-appendix`

- **Status:** defined
- **CSS files:** src\styles\cyklus\overlays.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* Semantic focus variants. */

.cyklus-page :is(.cyklus-btn--yes, .cyklus-pocket__activate):focus-visible,
.cyklus-void-page :is(.void-hub-focus__button.is-appendix, .loadout-entry .void-hub-action-button):focus-visible`, `.void-hub-focus__button.is-appendix`
- **Selector:** `.void-hub-focus__button.is-appendix`
- **CSS body (primary):**
```css
.is-appendix {
--focus-accent: var(--cy-magenta);
  border-color: var(--cy-line-magenta);
  background: color-mix(in srgb, var(--cy-accent-memory) 3%, transparent);
}
```

---

## `.is-available`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`, `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`
- **Selector:** `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`
- **CSS body (primary):**
```css
.is-available {
border-color: rgba(246, 255, 0, 0.42);
  box-shadow: 0 0 14px rgba(246, 255, 0, 0.12);
}
```

---

## `.is-confirmed`

- **Status:** defined
- **CSS files:** src\styles\cyklus\interactions.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-page [aria-pressed="true"],
.cyklus-void-page [aria-pressed="true"],
.cyklus-page .is-confirmed,
.cyklus-void-page .is-confirmed`, `.cyklus-page [aria-pressed="true"],
.cyklus-void-page [aria-pressed="true"],
.cyklus-page .is-confirmed,
.cyklus-void-page .is-confirmed`
- **Selector:** `.cyklus-page [aria-pressed="true"],
.cyklus-void-page [aria-pressed="true"],
.cyklus-page .is-confirmed,
.cyklus-void-page .is-confirmed`
- **CSS body (primary):**
```css
.is-confirmed {
box-shadow: inset 0 -2px currentColor;
}
```

---

## `.is-craftable`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`, `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`
- **Selector:** `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`
- **CSS body (primary):**
```css
.is-craftable {
border-color: rgba(246, 255, 0, 0.42);
  box-shadow: 0 0 14px rgba(246, 255, 0, 0.12);
}
```

---

## `.is-crafted`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`, `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`
- **Selector:** `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`
- **CSS body (primary):**
```css
.is-crafted {
border-color: rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 14px rgba(0, 255, 255, 0.13);
}
```

---

## `.is-danger`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 6 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-hub-tab.is-danger`, `.void-hub-tab.is-danger`, `.void-hub-tab.is-danger.is-active::before,
.void-hub-tab.is-danger.is-active::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.void-hub-tab.is-danger`
- **CSS body (primary):**
```css
.is-danger {
border-color: rgba(255, 0, 255, 0.38);
  box-shadow: inset 0 0 16px rgba(255, 0, 255, 0.06);
}
```

---

## `.is-deleting`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-09-ProfileDelete
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-profile-window.is-deleting`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-profile-window.is-deleting`
- **CSS body (primary):**
```css
.is-deleting {
animation: kpBook-09-ProfileDelete 2.8s steps(9,end) both;
}
```

---

## `.is-disabled`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy.is-disabled`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy.is-disabled`
- **CSS body (primary):**
```css
.is-disabled {
opacity: 0.52;
    filter: grayscale(0.7);
}
```

---

## `.is-equipped`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.loadout-entry.is-equipped`, `.loadout-entry.is-equipped`
- **Selector:** `.loadout-entry.is-equipped`
- **CSS body (primary):**
```css
.is-equipped {
border-style: solid;
  border-left-color: var(--cy-yellow);
  background: linear-gradient(90deg, color-mix(in srgb, var(--cy-accent-warning) 4%, transparent), transparent 72%);
}
```

---

## `.is-hidden`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.craft-recipe-row.is-locked,
.craft-recipe-row.is-hidden,
.void-room-row.is-locked`, `.void-room-row.is-locked,
.craft-recipe-row.is-locked,
.craft-recipe-row.is-hidden`
- **Selector:** `.craft-recipe-row.is-locked,
.craft-recipe-row.is-hidden,
.void-room-row.is-locked`
- **CSS body (primary):**
```css
.is-hidden {
opacity: 0.68;
  filter: saturate(0.75);
}
```

---

## `.is-lit`

- **Status:** defined
- **CSS files:** src\styles\base.css, src\styles\components.css
- **Used in:** 69 occurrences across 29 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* Text outlines */
  .fx-outline,
  .fx-outline.is-lit`, `.fx-outline.is-lit`, `/* Outline effect (stroke + glow). Combine with .is-lit for extra glow. */
  .fx-outline`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
  - `public\books\SYNTHOMA-NULL\0-1 [START]_en.html`
- **Selector:** `/* Text outlines */
  .fx-outline,
  .fx-outline.is-lit`
- **CSS body (primary):**
```css
.is-lit {
-webkit-text-stroke: 0;
    text-shadow: none;
}
```

---

## `.is-locked`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, src\styles\components.css, src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `/* Locked card state */
  .archive-card.is-locked`, `.archive-card.is-locked:hover`, `.archive-card.is-locked .card-title`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.archive-card.is-locked:hover`
- **CSS body (primary):**
```css
.is-locked {
transform: none;
    box-shadow: 0 4px 12px rgba(0,0,0,.35);
}
```

---

## `.is-maxed`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`, `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`
- **Selector:** `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`
- **CSS body (primary):**
```css
.is-maxed {
border-color: rgba(0, 255, 255, 0.4);
  box-shadow: 0 0 14px rgba(0, 255, 255, 0.13);
}
```

---

## `.is-modal`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `.archive-page.is-modal::before`, `.archive-page.is-modal .archive-grid`, `.archive-page.is-modal .archive-card`
- **Selector:** `.archive-page.is-modal::before`
- **CSS body (primary):**
```css
.is-modal {
content: "";
    position: fixed;
    inset: 0;
    background: rgba(2, 4, 8, .6);
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
    z-index: 40;
}
```

---

## `.is-open`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, src\styles\audio-panel.css, src\styles\components.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.synthoma-audio-panel.is-open`, `.synthoma-audio-panel.is-open .synthoma-audio-panel__surface`, `.synthoma-audio-panel.is-open .synthoma-audio-panel__surface`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.synthoma-audio-panel.is-open .synthoma-audio-panel__surface`
- **CSS body (primary):**
```css
.is-open {
opacity: 1;
  transform: none;
}
```

---

## `.is-playing`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** audio-level
- **Selectors (sample):** `.synthoma-audio-panel__track-state.is-playing`, `.synthoma-audio-panel__track-state.is-playing i`, `.synthoma-audio-panel__track-state.is-playing i:nth-child(2)`
- **Selector:** `.synthoma-audio-panel__track-state.is-playing i`
- **CSS body (primary):**
```css
.is-playing {
width: 2px;
  height: 45%;
  background: currentColor;
  animation: audio-level 620ms ease-in-out infinite alternate;
}
```

---

## `.is-pocket-room`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-room-row.is-pocket-room,
.cyklus-pocket-panel`, `.void-room-row.is-pocket-room`
- **Selector:** `.void-room-row.is-pocket-room,
.cyklus-pocket-panel`
- **CSS body (primary):**
```css
.is-pocket-room {
border-color: rgba(246, 255, 0, 0.18);
  box-shadow: 0 0 28px rgba(246, 255, 0, 0.06), inset 0 0 0 1px rgba(0, 255, 255, 0.04);
}
```

---

## `.is-selected`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy.is-selected`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy.is-selected`
- **CSS body (primary):**
```css
.is-selected {
border-color: rgba(53,255,131,0.3);
    box-shadow: inset 0 0 2rem rgba(53,255,131,0.04);
}
```

---

## `.is-stable`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-12-pump-run
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump.is-stable .kp-pump__motor`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump.is-stable .kp-pump__motor`
- **CSS body (primary):**
```css
.is-stable {
animation: kpBook-12-pump-run 1.5s linear infinite;
    box-shadow: inset 0 0 1.5rem rgba(0,0,0,0.65), 0 0 1.2rem rgba(117,255,173,0.12);
}
```

---

## `.is-touched`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-11-contact-pulse
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact.is-touched`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact.is-touched`
- **CSS body (primary):**
```css
.is-touched {
animation: kpBook-11-contact-pulse 2.6s ease-in-out infinite;
}
```

---

## `.konami-activated`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, filter
- **Animations:** rainbow-pulse
- **Selectors (sample):** `/* Konami easter egg – rainbow pulse. */
  .konami-activated`
- **Selector:** `/* Konami easter egg – rainbow pulse. */
  .konami-activated`
- **CSS body (primary):**
```css
.konami-activated {
filter: hue-rotate(180deg) saturate(1.5); animation: rainbow-pulse 2s infinite;
}
```

---

## `.kp-access-timer`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-access-timer,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy-countdown,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-migration-timer`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-access-timer`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-access-timer`
- **CSS body (primary):**
```css
.kp-access-timer {
color: var(--kp-yellow);
    border: 1px solid rgba(246,255,0,0.28);
    background: rgba(42,45,0,0.25);
    text-shadow: 0 0 1rem rgba(246,255,0,0.28);
}
```

---

## `.kp-anchor-road`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-anchor-road`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-anchor-road::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-anchor-road::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-anchor-road::before`
- **CSS body (primary):**
```css
.kp-anchor-road {
content: "MILO-7";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: var(--kp-milo);
    font: 900 clamp(1.8rem, 7vw, 4rem)/1 ui-monospace, monospace;
    letter-spacing: 0.2em;
    text-shadow: 0 0 1rem rgba(255,201,40,0.3);
}
```

---

## `.kp-archive-pulse`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-03-ArchivePower
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-archive-pulse .kp-power-fill`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-archive-pulse .kp-power-fill`
- **CSS body (primary):**
```css
.kp-archive-pulse {
animation: kpBook-03-ArchivePower 2.8s ease-in-out infinite alternate;
}
```

---

## `.kp-audio-line`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-audio-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-audio-line::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-audio-line::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-audio-line::before`
- **CSS body (primary):**
```css
.kp-audio-line {
content: "";
    position: absolute;
    left: -12%;
    right: -12%;
    top: 50%;
    height: 1px;
    background: var(--kp-cyan);
    box-shadow: 0 0 0.9rem rgba(0,234,255,0.4);
}
```

---

## `.kp-audit-meter`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-03-AuditRun
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-audit-meter`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-audit-meter span`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-audit-meter span`
- **CSS body (primary):**
```css
.kp-audit-meter {
display: block;
    height: 100%;
    width: 12%;
    background: linear-gradient(90deg, var(--kp-green), var(--kp-yellow), var(--kp-red));
    animation: kpBook-03-AuditRun 7s linear infinite;
}
```

---

## `.kp-audit-step`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 7 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-audit-step`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-audit-step::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-audit-step.is-danger`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-audit-step::before`
- **CSS body (primary):**
```css
.kp-audit-step {
content: "";
    position: absolute;
    left: 0.9rem;
    top: 1.1rem;
    width: 0.55rem;
    height: 0.55rem;
    border: 1px solid var(--kp-boris);
    transform: rotate(45deg);
}
```

---

## `.kp-authority--danger`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-authority--danger`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-authority--danger .kp-authority__head`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-authority--danger`
- **CSS body (primary):**
```css
.kp-authority--danger {
border-color: rgba(255,64,87,0.34);
    box-shadow: 0 0 2rem rgba(255,64,87,0.05);
}
```

---

## `.kp-axiom`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 19 occurrences across 19 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .kp-axiom strong`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-axiom`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-axiom strong`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-axiom strong`
- **CSS body (primary):**
```css
.kp-axiom {
color: var(--kp-yellow);
    text-shadow: 0 0 0.9rem rgba(245,255,51,0.24);
}
```

---

## `.kp-barrier-clash`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, transform
- **Animations:** kpBook-16-impact
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-barrier-clash`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-barrier-clash::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-barrier-clash::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-barrier-clash::before`
- **CSS body (primary):**
```css
.kp-barrier-clash {
content: "";
    position: absolute;
    left: 6%;
    width: 44%;
    bottom: 13%;
    height: 38%;
    border: 1px solid rgba(255,64,87,0.23);
    background: #0c1215;
    transform: rotate(-2deg);
    animation: kpBook-16-impact 1.3s ease-in-out infinite alternate;
}
```

---

## `.kp-barrier-field`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-barrier-field`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-barrier-field::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-barrier-field::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-barrier-field::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-barrier-field::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-barrier-field::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-barrier-field::after`
- **CSS body (primary):**
```css
.kp-barrier-field {
content: "";
    position: absolute;
    left: 50%;
    width: min(72%, 42rem);
    height: 2.4rem;
    transform: translateX(-50%);
    border: 1px solid rgba(255,64,87,0.55);
    background: repeating-linear-gradient(135deg, #15191e 0 1.2rem, #ff4057 1.2rem 1.45rem, #15191e 1.45rem 2.6rem);
    box-shadow: 0 0 1.4rem rgba(255,64,87,0.16);
}
```

---

## `.kp-bed`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed`
- **CSS body (primary):**
```css
.kp-bed {
position: absolute;
    width: 6.4rem;
    height: 3rem;
    border: 2px solid #e8fbff;
    border-radius: 0.55rem 0.55rem 0.25rem 0.25rem;
    background: linear-gradient(180deg, #dfeff1 0 42%, #63767d 43% 51%, #11191d 52% 100%);
    box-shadow: 0 0 1rem rgba(189,239,255,0.16);
}
```

---

## `.kp-bed--1`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-06-BedAttack
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--1`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--1`
- **CSS body (primary):**
```css
.kp-bed--1 {
left: -7rem; top: 1.5rem; animation: kpBook-06-BedAttack 6s linear infinite;
}
```

---

## `.kp-bed--2`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-06-BedAttack
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--2`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--2`
- **CSS body (primary):**
```css
.kp-bed--2 {
left: -9rem; top: 5.8rem; animation: kpBook-06-BedAttack 7.3s linear 0.8s infinite;
}
```

---

## `.kp-bed--3`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-06-BedAttack
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--3`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--3`
- **CSS body (primary):**
```css
.kp-bed--3 {
left: -8rem; top: 10.2rem; animation: kpBook-06-BedAttack 5.8s linear 1.7s infinite;
}
```

---

## `.kp-bed--4`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, transform
- **Animations:** kpBook-06-BadWheel
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--4`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-bed--4`
- **CSS body (primary):**
```css
.kp-bed--4 {
left: 38%; top: 4rem; transform: rotate(8deg); animation: kpBook-06-BadWheel 1.2s ease-in-out infinite;
}
```

---

## `.kp-black-core`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-black-core`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-black-core::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-black-core::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-black-core`
- **CSS body (primary):**
```css
.kp-black-core {
position: relative;
    width: min(18rem, 70vw);
    aspect-ratio: 0.48;
    margin: 2.5rem auto;
    background: linear-gradient(90deg, #010203, #171b20 48%, #010203 52%, #050608);
    border: 1px solid rgba(120,136,149,0.22);
    box-shadow: 0 0 3rem rgba(0,0,0,0.9), inset 0 0 1rem rgba(255,255,255,0.035);
}
```

---

## `.kp-black-screen`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-black-screen`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-black-screen::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-black-screen`
- **CSS body (primary):**
```css
.kp-black-screen {
position: relative;
    margin: 2.2rem 0;
    padding: 1.6rem;
    color: #cfd8da;
    background: #010304;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 0 3rem rgba(0,0,0,0.7);
}
```

---

## `.kp-black-vans`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-08-VansArrive
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-black-vans`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-black-vans::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-black-vans::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-black-vans::before`
- **CSS body (primary):**
```css
.kp-black-vans {
content: "▰      ▰      ▰      ▰";
    position: absolute;
    left: 110%;
    bottom: 3.5rem;
    white-space: nowrap;
    color: #202628;
    font-size: clamp(3rem, 9vw, 5rem);
    letter-spacing: 4rem;
    text-shadow: 0 0.65rem 0 #000;
    animation: kpBook-08-VansArrive 8s linear infinite;
}
```

---

## `.kp-blackout`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-blackout`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-blackout::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-blackout::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-blackout`
- **CSS body (primary):**
```css
.kp-blackout {
position: relative;
    margin: 2.6rem 0;
    min-height: 35rem;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.07);
    background: #000;
    box-shadow: inset 0 0 9rem rgba(0,0,0,0.95);
}
```

---

## `.kp-block`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-11-block-shift
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-block`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-block:nth-child(2)`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-block:nth-child(3)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-block`
- **CSS body (primary):**
```css
.kp-block {
display: grid;
    place-items: center;
    width: 3.3rem;
    height: 3.3rem;
    border: 1px solid rgba(0,236,255,0.26);
    color: var(--kp-cyan);
    background: rgba(0,236,255,0.055);
    font: 700 1.2rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    box-shadow: 0 0 0.9rem rgba(0,236,255,0.06);
    animation: kpBook-11-block-shift 6s ease-in-out infinite;
}
```

---

## `.kp-blue-line`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-06-BlueLineScan
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-blue-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-blue-line::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-blue-line::before`
- **CSS body (primary):**
```css
.kp-blue-line {
content: "";
    position: absolute;
    left: -10%;
    right: -10%;
    top: 1rem;
    height: 0.42rem;
    background: #4b9fff;
    box-shadow: 0 0 1.2rem rgba(75,159,255,0.82);
    animation: kpBook-06-BlueLineScan 4s ease-in-out infinite;
}
```

---

## `.kp-body-city`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-body-city`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-body-city::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-body-city`
- **CSS body (primary):**
```css
.kp-body-city {
position: relative;
    margin: 2.4rem 0;
    min-height: 29rem;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.11);
    background:
      repeating-linear-gradient(90deg, transparent 0 7.5%, rgba(0,236,255,0.08) 7.7% 8%, transparent 8.2% 15.7%),
      repeating-linear-gradient(180deg, rgba(255,255,255,0.024) 0 2rem, rgba(255,255,255,0.075) 2.05rem 2.14rem, rgba(0,0,0,0.2) 2.2rem 4.8rem),
      radial-gradient(circle at 50% 10%, rgba(117,255,173,0.07), transparent 35%),
      #030708;
    box-shadow: inset 0 0 6rem rgba(0,0,0,0.82);
}
```

---

## `.kp-boundary-door`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-boundary-door`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-boundary-door::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-boundary-door::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-boundary-door`
- **CSS body (primary):**
```css
.kp-boundary-door {
position: relative;
    margin: 1.8rem auto;
    max-width: 38rem;
    min-height: 11rem;
    padding: 1.2rem 1.25rem 1.2rem 3.2rem;
    border: 2px solid rgba(0,234,255,0.22);
    border-right-width: 8px;
    background:
      linear-gradient(90deg, rgba(0,234,255,0.07), transparent 30%),
      rgba(1,7,10,0.66);
    box-shadow: inset 0 0 2rem rgba(0,234,255,0.025);
}
```

---

## `.kp-breath`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-10-Breath
- **Selectors (sample):** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-breath`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-breath span`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-breath span`
- **CSS body (primary):**
```css
.kp-breath {
display: inline-block;
    color: var(--kp-cyan);
    letter-spacing: 0.08em;
    animation: kpBook-10-Breath 3.4s ease-in-out infinite;
}
```

---

## `.kp-bridge`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-02-BridgeWest
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bridge`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bridge::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bridge::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bridge::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bridge::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bridge::before`
- **CSS body (primary):**
```css
.kp-bridge {
left: -10%; animation: kpBook-02-BridgeWest 9s ease-in-out infinite alternate;
}
```

---

## `.kp-building-chorus`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-building-chorus`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-building-chorus::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-building-chorus p:nth-child(odd)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-building-chorus p:nth-child(odd)`
- **CSS body (primary):**
```css
.kp-building-chorus {
transform: translateX(-0.5rem);
}
```

---

## `.kp-bulb`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-16-bulb
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bulb`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bulb::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bulb::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bulb::before`
- **CSS body (primary):**
```css
.kp-bulb {
content: "";
    position: absolute;
    left: calc(50% - 1.5rem);
    top: 28%;
    width: 3rem;
    height: 4rem;
    border-radius: 50% 50% 44% 44%;
    border: 1px solid rgba(255,244,197,0.55);
    background: rgba(255,244,197,0.17);
    box-shadow:
      0 0 1rem rgba(255,235,170,0.8),
      0 0 4rem rgba(255,225,145,0.32);
    animation: kpBook-16-bulb 2.3s ease-in-out infinite;
}
```

---

## `.kp-bus-lock`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-bus-lock`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-bus-lock::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-bus-lock::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-bus-lock::before`
- **CSS body (primary):**
```css
.kp-bus-lock {
content: "";
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 12%;
    height: 45%;
    border: 1px solid rgba(255,64,87,0.25);
    border-radius: 0.6rem 0.6rem 0 0;
    background:
      linear-gradient(90deg, rgba(255,64,87,0.11) 0 8%, transparent 8% 18%, rgba(255,64,87,0.1) 18% 26%, transparent 26% 74%, rgba(255,64,87,0.1) 74% 82%, transparent 82% 92%, rgba(255,64,87,0.11) 92% 100%);
    box-shadow: inset 0 0 3rem rgba(0,0,0,0.55);
}
```

---

## `.kp-bus-run`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-16-bus-shake
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bus-run`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bus-run::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bus-run::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-bus-run::before`
- **CSS body (primary):**
```css
.kp-bus-run {
content: "";
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 10%;
    height: 48%;
    border: 1px solid rgba(255,64,87,0.24);
    border-radius: 0.55rem 0.55rem 0 0;
    background:
      linear-gradient(90deg, rgba(255,64,87,0.09) 0 9%, transparent 9% 18%, rgba(255,64,87,0.08) 18% 28%, transparent 28% 72%, rgba(255,64,87,0.08) 72% 82%, transparent 82% 91%, rgba(255,64,87,0.09) 91% 100%);
    box-shadow: inset 0 0 3rem rgba(0,0,0,0.55);
    animation: kpBook-16-bus-shake 0.48s steps(2,end) infinite;
}
```

---

## `.kp-bus-shadow`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, transform
- **Animations:** kpBook-02-BusDistance
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bus-shadow`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bus-shadow::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-bus-shadow::before`
- **CSS body (primary):**
```css
.kp-bus-shadow {
content: "3 m";
    position: absolute;
    left: 0.85rem;
    top: 50%;
    color: var(--kp-yellow);
    font: 700 0.72rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    writing-mode: vertical-rl;
    letter-spacing: 0.18em;
    transform: translateY(-50%);
    animation: kpBook-02-BusDistance 4.2s ease-in-out infinite;
}
```

---

## `.kp-call-wave`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-03-CallWave
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-call-wave`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-call-wave span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-call-wave span:nth-child(2n)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-call-wave span`
- **CSS body (primary):**
```css
.kp-call-wave {
width: 0.22rem;
    min-height: 0.35rem;
    background: #7ba0ff;
    box-shadow: 0 0 0.6rem rgba(123,160,255,0.5);
    animation: kpBook-03-CallWave 1.8s ease-in-out infinite;
}
```

---

## `.kp-care-fog`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter
- **Animations:** kpBook-06-FogDrift
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-care-fog`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-care-fog::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-care-fog::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-care-fog::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-care-fog::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-care-fog::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-care-fog::after`
- **CSS body (primary):**
```css
.kp-care-fog {
content: "";
    position: absolute;
    inset: -40% -20%;
    pointer-events: none;
    background: radial-gradient(ellipse, rgba(235,253,255,0.22), transparent 60%);
    filter: blur(1.4rem);
    animation: kpBook-06-FogDrift 9s ease-in-out infinite alternate;
}
```

---

## `.kp-careline`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter
- **Animations:** kpBook-06-HeartDraw
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-careline`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-careline svg`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-careline polyline`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-careline polyline`
- **CSS body (primary):**
```css
.kp-careline {
fill: none;
    stroke: var(--kp-green);
    stroke-width: 2.2;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 0.35rem rgba(114,255,166,0.65));
    stroke-dasharray: 900;
    stroke-dashoffset: 900;
    animation: kpBook-06-HeartDraw 3.4s linear infinite;
}
```

---

## `.kp-cart`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-cart`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-cart::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-cart`
- **CSS body (primary):**
```css
.kp-cart {
position: relative;
    margin: 2rem 0;
    min-height: 10rem;
    border: 1px solid rgba(188,214,226,0.16);
    background:
      linear-gradient(90deg, transparent 5%, rgba(220,237,244,0.15) 5.5% 7%, transparent 7.5% 93%, rgba(220,237,244,0.14) 93.5% 95%, transparent 95.5%),
      repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 12%, rgba(255,255,255,0.065) 12.3% 13%, rgba(0,0,0,0.25) 13.3% 16%),
      linear-gradient(180deg, #11191d, #050809);
    box-shadow: inset 0 -2rem 3rem rgba(0,0,0,0.7);
}
```

---

## `.kp-chair`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 5 occurrences across 1 files
- **Effect properties:** box-shadow, animation, transform
- **Animations:** kpBook-04-ChairApproach
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-chair`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-chair:nth-child(2)`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-chair:nth-child(3)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-chair`
- **CSS body (primary):**
```css
.kp-chair {
width: 4rem;
    height: 5rem;
    border: 1px solid rgba(255,170,222,0.34);
    border-radius: 1rem 1rem 0.45rem 0.45rem;
    background: linear-gradient(180deg, rgba(255,149,216,0.22), rgba(73,21,64,0.5));
    box-shadow: 0 0 1.2rem rgba(255,79,195,0.08);
    transform-origin: center bottom;
    animation: kpBook-04-ChairApproach 5.5s ease-in-out infinite;
}
```

---

## `.kp-chapter`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 19 occurrences across 19 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* SYNTHOMA: KONEC PODPORY - book-scoped presentation */
.kp-chapter[data-book="konec-podpory"]`, `.kp-chapter[data-book="konec-podpory"] *,
.kp-chapter[data-book="konec-podpory"] *::before,
.kp-chapter[data-book="konec-podpory"] *::after`, `.kp-chapter[data-book="konec-podpory"] *,
.kp-chapter[data-book="konec-podpory"] *::before,
.kp-chapter[data-book="konec-podpory"] *::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"] .dialogT`
- **CSS body (primary):**
```css
.kp-chapter {
color: var(--kp-cyan);
    border-left-width: 3px;
    text-shadow: 0 0 0.75rem rgba(0,234,255,0.18);
}
```

---

## `.kp-choice-core`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-choice-core`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-choice-core`
- **CSS body (primary):**
```css
.kp-choice-core {
position: relative;
    margin: 2.5rem 0;
    padding: 1.5rem;
    border: 1px solid rgba(255,64,87,0.34);
    background:
      radial-gradient(circle at 50% 0%, rgba(255,64,87,0.11), transparent 50%),
      rgba(0,0,0,0.7);
    box-shadow: inset 0 0 4rem rgba(255,64,87,0.035);
}
```

---

## `.kp-city-fall`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-02-FallLine
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-city-fall`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-city-fall::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-city-fall::before`
- **CSS body (primary):**
```css
.kp-city-fall {
content: "";
    position: absolute;
    left: 0.5rem;
    top: -55%;
    width: 1px;
    height: 210%;
    background: linear-gradient(180deg, transparent, var(--kp-red), transparent);
    animation: kpBook-02-FallLine 1.35s linear infinite;
}
```

---

## `.kp-city-grid`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** kpBook-01-BlackoutSweep
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-city-grid`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-city-grid::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-city-grid > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-city-grid::after`
- **CSS body (primary):**
```css
.kp-city-grid {
content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(90deg, transparent 0 58%, rgba(0,0,0,0.68) 72% 100%);
    animation: kpBook-01-BlackoutSweep 8s ease-in-out infinite alternate;
}
```

---

## `.kp-city-map`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-city-map`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-city-map::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-city-map::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-city-map::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-city-map::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-city-map::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-city-map::after`
- **CSS body (primary):**
```css
.kp-city-map {
content: "";
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255,79,195,0.32);
    box-shadow: 0 0 2rem rgba(255,79,195,0.1);
}
```

---

## `.kp-claim-approved`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-claim-approved`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-claim-approved::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-claim-approved::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-claim-approved`
- **CSS body (primary):**
```css
.kp-claim-approved {
position: relative;
    margin: 2.6rem 0;
    min-height: 22rem;
    overflow: hidden;
    border: 1px solid rgba(53,255,131,0.35);
    background:
      radial-gradient(circle at 50% 50%, rgba(53,255,131,0.19) 0 7%, rgba(53,255,131,0.045) 8% 28%, transparent 29%),
      repeating-radial-gradient(circle at 50% 50%, transparent 0 2.7rem, rgba(53,255,131,0.045) 2.8rem 2.9rem, transparent 3rem 5.4rem),
      #020a05;
    box-shadow: 0 0 4rem rgba(53,255,131,0.08), inset 0 0 5rem rgba(53,255,131,0.025);
}
```

---

## `.kp-clinical-depth`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-clinical-depth`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-clinical-depth::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-clinical-depth::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-clinical-depth::after`
- **CSS body (primary):**
```css
.kp-clinical-depth {
content: "12 480 AKTIVNÍCH KLINICKÝCH PROCESŮ";
    position: absolute;
    left: 50%;
    bottom: 1.5rem;
    transform: translateX(-50%);
    color: rgba(189,239,255,0.65);
    font: 700 0.82rem/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.08em;
    text-align: center;
}
```

---

## `.kp-clock`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-clock`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-clock`
- **CSS body (primary):**
```css
.kp-clock {
display: inline-block;
    min-width: 8ch;
    color: var(--kp-yellow);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-shadow: 0 0 0.8rem rgba(246, 255, 0, 0.34);
}
```

---

## `.kp-cold-store`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-cold-store`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-cold-store::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-cold-store::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-cold-store::after`
- **CSS body (primary):**
```css
.kp-cold-store {
content: "▥  ▥  ▥  ▥  ▥  ▥  ▥  ▥";
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 2.2rem;
    color: rgba(169,233,255,0.6);
    font: 700 2.5rem/1 ui-monospace, monospace;
    letter-spacing: 1rem;
    text-align: center;
    filter: drop-shadow(0 0 0.7rem rgba(169,233,255,0.2));
}
```

---

## `.kp-comfort-field`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-04-ComfortPulse
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-comfort-field`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-comfort-field::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-comfort-field > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-comfort-field`
- **CSS body (primary):**
```css
.kp-comfort-field {
position: relative;
    margin: 2rem 0;
    padding: 1.5rem 1.4rem;
    border: 1px solid rgba(255,79,195,0.28);
    border-radius: 1.2rem;
    background:
      radial-gradient(circle at 50% 0%, rgba(255,137,219,0.16), transparent 55%),
      linear-gradient(135deg, rgba(255,79,195,0.095), rgba(30,7,28,0.45));
    box-shadow: 0 0 2.8rem rgba(255,79,195,0.075), inset 0 0 3rem rgba(255,255,255,0.025);
    overflow: hidden;
    animation: kpBook-04-ComfortPulse 7s ease-in-out infinite;
}
```

---

## `.kp-comfort-incursion`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-03-ComfortBreathe
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-comfort-incursion`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-comfort-incursion::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-comfort-incursion > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-comfort-incursion`
- **CSS body (primary):**
```css
.kp-comfort-incursion {
position: relative;
    margin: 2.2rem 0;
    padding: 1.55rem;
    border: 1px solid rgba(255,88,199,0.28);
    background:
      radial-gradient(circle at 20% 10%, rgba(255,88,199,0.13), transparent 35%),
      radial-gradient(circle at 80% 90%, rgba(216,167,255,0.1), transparent 38%),
      rgba(18,0,17,0.42);
    box-shadow: inset 0 0 3rem rgba(255,88,199,0.045);
    overflow: hidden;
    animation: kpBook-03-ComfortBreathe 7s ease-in-out infinite;
}
```

---

## `.kp-cone`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-cone`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-cone`
- **CSS body (primary):**
```css
.kp-cone {
width: 2.1rem;
    height: 4rem;
    clip-path: polygon(50% 0, 82% 78%, 100% 78%, 100% 100%, 0 100%, 0 78%, 18% 78%);
    background: linear-gradient(180deg, #ff9e30 0 35%, #f6f4dd 36% 48%, #ff9e30 49% 100%);
    filter: drop-shadow(0 0 0.5rem rgba(255,158,48,0.22));
}
```

---

## `.kp-conflict`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-00-Conflict
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-conflict`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-conflict`
- **CSS body (primary):**
```css
.kp-conflict {
color: var(--kp-red);
    animation: kpBook-00-Conflict 1.4s steps(2, end) infinite;
}
```

---

## `.kp-consent`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 9 occurrences across 3 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-01-ConsentReject
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-consent`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-consent`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-consent strong`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-consent`
- **CSS body (primary):**
```css
.kp-consent {
display: block;
    width: min(17rem, 92%);
    margin: 1.2rem auto;
    padding: 0.85rem 1.2rem;
    color: var(--kp-white);
    text-align: center;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-weight: 800;
    letter-spacing: 0.12em;
    border: 1px solid rgba(0,234,255,0.5);
    background: rgba(0,234,255,0.055);
    box-shadow: 0 0 1.4rem rgba(0,234,255,0.08);
    animation: kpBook-01-ConsentReject 3.5s steps(1,end) infinite;
}
```

---

## `.kp-contact`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact`
- **CSS body (primary):**
```css
.kp-contact {
position: relative;
    width: min(13rem, 56vw);
    aspect-ratio: 1;
    margin: 2.6rem auto;
    border-radius: 50%;
    border: 1px solid rgba(0,236,255,0.35);
    background:
      radial-gradient(circle at center, rgba(0,236,255,0.28) 0 4%, transparent 5% 16%, rgba(0,236,255,0.09) 17% 18%, transparent 19% 42%, rgba(255,59,223,0.08) 43% 44%, transparent 45%),
      radial-gradient(circle at center, #071016, #020304 68%);
    box-shadow:
      inset 0 0 3.2rem rgba(0,236,255,0.11),
      0 0 2rem rgba(0,236,255,0.09);
    overflow: hidden;
}
```

---

## `.kp-contact-terms`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact-terms`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact-terms strong`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact-terms ol`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-contact-terms`
- **CSS body (primary):**
```css
.kp-contact-terms {
position: relative;
    margin: 2rem 0;
    padding: 1.3rem 1.4rem;
    border: 1px solid rgba(0,236,255,0.23);
    background:
      linear-gradient(90deg, rgba(0,236,255,0.075), transparent 44%),
      rgba(0,0,0,0.58);
    box-shadow: inset 0 0 3rem rgba(0,236,255,0.035), 0 0 1.4rem rgba(0,236,255,0.045);
}
```

---

## `.kp-control-tower`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-07-CargoFlow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-control-tower`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-control-tower::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-control-tower::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-control-tower::after`
- **CSS body (primary):**
```css
.kp-control-tower {
content: "→  →  ↘  →  ↗  →  →  ↘  →  ↗  →";
    position: absolute;
    left: -15%;
    right: -15%;
    bottom: 4rem;
    white-space: nowrap;
    color: rgba(255,171,69,0.78);
    font: 700 2rem/1 ui-monospace, monospace;
    letter-spacing: 2rem;
    animation: kpBook-07-CargoFlow 8s linear infinite;
}
```

---

## `.kp-conveyor`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-07-CargoFlow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-conveyor`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-conveyor::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-conveyor::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-conveyor::before`
- **CSS body (primary):**
```css
.kp-conveyor {
content: "▣   □   ▣   ▤   □   ▣   □   ▤   ▣   □";
    position: absolute;
    left: -25%;
    bottom: 2.9rem;
    white-space: nowrap;
    color: rgba(255,171,69,0.9);
    font: 700 2rem/1 ui-monospace, monospace;
    letter-spacing: 2.5rem;
    animation: kpBook-07-CargoFlow 8s linear infinite;
}
```

---

## `.kp-cooling-bar`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 2 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-11-cooling-fail
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-cooling-bar`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-cooling-bar > span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-cooling-bar`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-cooling-bar > span`
- **CSS body (primary):**
```css
.kp-cooling-bar {
display: block;
    height: 100%;
    width: 49%;
    background: linear-gradient(90deg, var(--kp-red), var(--kp-yellow), var(--kp-green));
    box-shadow: 0 0 0.9rem rgba(246,255,0,0.35);
    animation: kpBook-11-cooling-fail 5.6s ease-in-out infinite;
}
```

---

## `.kp-core`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-core`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-core::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-core`
- **CSS body (primary):**
```css
.kp-core {
position: relative;
    margin: 2.4rem 0;
    min-height: 34rem;
    overflow: hidden;
    border: 1px solid rgba(0,236,255,0.16);
    background:
      radial-gradient(ellipse at 50% 50%, rgba(0,236,255,0.18) 0 4%, rgba(0,236,255,0.04) 5% 18%, transparent 19%),
      repeating-radial-gradient(ellipse at 50% 50%, transparent 0 3rem, rgba(0,236,255,0.06) 3.1rem 3.2rem, transparent 3.3rem 6rem),
      linear-gradient(180deg, #071116, #010203);
    box-shadow: inset 0 0 9rem rgba(0,0,0,0.82);
}
```

---

## `.kp-core-home`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-core-home`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-core-home::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-core-home::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-core-home`
- **CSS body (primary):**
```css
.kp-core-home {
position: relative;
    min-height: 24rem;
    margin: 2.8rem 0;
    overflow: hidden;
    border: 1px solid rgba(169,223,255,0.26);
    background:
      radial-gradient(circle at 50% 38%, rgba(255,201,120,0.13), transparent 15rem),
      linear-gradient(135deg, rgba(169,223,255,0.045), rgba(0,0,0,0.8));
    box-shadow: inset 0 0 5rem rgba(169,223,255,0.035);
}
```

---

## `.kp-corridor`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-corridor`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-corridor::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-corridor::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-corridor::before`
- **CSS body (primary):**
```css
.kp-corridor {
content: "INDIVIDUÁLNÍ TERAPIE   ·   RODINNÁ TERAPIE   ·   POZOROVATEL   ·   PRÁZDNOTA";
    position: absolute;
    left: 50%;
    top: 1.4rem;
    transform: translateX(-50%);
    width: 92%;
    color: rgba(255,255,255,0.45);
    text-align: center;
    font: 0.72rem/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.13em;
}
```

---

## `.kp-countdown`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 5 occurrences across 3 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-06-CountdownPulse
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-countdown`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-countdown`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-countdown`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-countdown`
- **CSS body (primary):**
```css
.kp-countdown {
position: sticky;
    top: 1rem;
    z-index: 4;
    width: min(20rem, 72vw);
    margin: 2rem auto;
    padding: 0.75rem 1rem;
    color: #ffb0ba;
    border: 1px solid rgba(255,64,87,0.45);
    background: rgba(10,0,3,0.9);
    text-align: center;
    font: 900 clamp(1.4rem, 5vw, 2.4rem)/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.1em;
    box-shadow: 0 0 2rem rgba(255,64,87,0.1);
    animation: kpBook-06-CountdownPulse 1s steps(2,end) infinite;
}
```

---

## `.kp-crack`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-18-crack-open
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-crack`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-crack::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-crack::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-crack::before`
- **CSS body (primary):**
```css
.kp-crack {
content: "";
    position: absolute;
    left: 44%;
    right: 44%;
    top: -10%;
    bottom: -10%;
    background: #000;
    clip-path: polygon(46% 0, 62% 14%, 48% 28%, 68% 45%, 43% 58%, 61% 72%, 35% 88%, 52% 100%, 0 100%, 0 0);
    box-shadow: 0 0 3rem rgba(0,0,0,0.85);
    animation: kpBook-18-crack-open 4.2s ease-in-out infinite alternate;
}
```

---

## `.kp-crossing`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-02-CrossConflict
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-crossing`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-crossing::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-crossing > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-crossing::after`
- **CSS body (primary):**
```css
.kp-crossing {
content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: conic-gradient(from 45deg, rgba(105,255,159,0.08), rgba(105,255,159,0.02), rgba(105,255,159,0.08), rgba(105,255,159,0.02));
    animation: kpBook-02-CrossConflict 5s steps(2,end) infinite;
}
```

---

## `.kp-crown`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 6 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-crown`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-crown:nth-child(3n+1)`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-crown:nth-child(3n+2)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-crown`
- **CSS body (primary):**
```css
.kp-crown {
min-height: 7rem;
    border-radius: 50% 50% 18% 18%;
    border: 1px solid rgba(0,236,255,0.18);
    background:
      repeating-radial-gradient(circle at 50% 84%, transparent 0 0.45rem, rgba(0,236,255,0.12) 0.5rem 0.56rem, transparent 0.6rem 0.95rem),
      radial-gradient(circle at 50% 80%, rgba(255,64,87,0.12), transparent 45%),
      rgba(0,0,0,0.58);
    box-shadow: inset 0 0 2rem rgba(0,236,255,0.035);
}
```

---

## `.kp-crusher`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-07-Crusher
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher::after`
- **CSS body (primary):**
```css
.kp-crusher {
content: "";
    position: absolute;
    left: 12%;
    right: 12%;
    height: 4.2rem;
    background:
      repeating-linear-gradient(135deg, #222 0 1.2rem, #ffc928 1.2rem 2.4rem);
    border: 0.3rem solid #151515;
    box-shadow: 0 0 1.2rem rgba(255,64,87,0.18);
    animation: kpBook-07-Crusher 4.8s ease-in-out infinite;
}
```

---

## `.kp-crusher-core`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher-core`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-crusher-core`
- **CSS body (primary):**
```css
.kp-crusher-core {
position: absolute;
    left: 50%;
    top: 50%;
    z-index: 2;
    transform: translate(-50%, -50%);
    color: var(--kp-milo);
    font: 800 0.85rem/1.5 ui-monospace, monospace;
    text-align: center;
    letter-spacing: 0.08em;
}
```

---

## `.kp-cursor`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** kpBook-11-cursor-blink
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-cursor`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-cursor`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-cursor`
- **CSS body (primary):**
```css
.kp-cursor {
display: inline-block;
    width: 0.6em;
    height: 1.1em;
    margin-left: 0.25em;
    vertical-align: -0.15em;
    background: var(--kp-yellow);
    animation: kpBook-11-cursor-blink 0.86s steps(1) infinite;
}
```

---

## `.kp-dark-buttons`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-dark-buttons`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-dark-buttons span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-dark-buttons .primary`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-dark-buttons .primary`
- **CSS body (primary):**
```css
.kp-dark-buttons {
color: #06210f;
    border-color: rgba(53,255,131,0.4);
    background: var(--kp-claim);
    box-shadow: 0 0 1.4rem rgba(53,255,131,0.18);
}
```

---

## `.kp-delayed`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-delayed`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-delayed::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-delayed`
- **CSS body (primary):**
```css
.kp-delayed {
position: relative;
    margin: 2.4rem 0;
    min-height: 29rem;
    overflow: hidden;
    border: 1px solid rgba(0,236,255,0.24);
    background:
      radial-gradient(circle at 50% 45%, rgba(0,236,255,0.13), transparent 18%),
      repeating-linear-gradient(180deg, transparent 0 0.32rem, rgba(0,236,255,0.03) 0.36rem 0.4rem),
      #020708;
    box-shadow: inset 0 0 5rem rgba(0,236,255,0.03);
}
```

---

## `.kp-descent`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-descent`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-descent::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-descent`
- **CSS body (primary):**
```css
.kp-descent {
position: relative;
    height: min(31rem, 58vh);
    margin: 2.2rem 0;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    background:
      linear-gradient(112deg, transparent 0 30%, rgba(126,142,151,0.18) 30.4% 31.4%, transparent 31.8% 68%, rgba(126,142,151,0.16) 68.4% 69.4%, transparent 69.8%),
      repeating-linear-gradient(112deg, transparent 0 2.8rem, rgba(246,255,0,0.18) 2.9rem 3rem, transparent 3.1rem 5.7rem),
      linear-gradient(180deg, #10171b 0%, #05090b 55%, #010203 100%);
    box-shadow: inset 0 -6rem 8rem rgba(0,0,0,0.88);
}
```

---

## `.kp-directive`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-directive`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-directive .kp-old-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-directive .kp-old-line--critical`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-directive`
- **CSS body (primary):**
```css
.kp-directive {
margin: 2.2rem 0;
    padding: 1.4rem;
    border: 1px solid rgba(255,64,87,0.32);
    background: rgba(25,0,4,0.26);
    box-shadow: inset 0 0 3rem rgba(255,64,87,0.025);
}
```

---

## `.kp-door`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 7 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-door`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-door`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-door strong`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-door`
- **CSS body (primary):**
```css
.kp-door {
margin: 2rem auto;
    max-width: 44rem;
    padding: 1.4rem;
    border: 3px double rgba(170,180,185,0.4);
    background: linear-gradient(90deg, #121619, #050708 50%, #111518);
    box-shadow: inset 0 0 2.4rem rgba(0,0,0,0.9);
}
```

---

## `.kp-door-choice`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation, transform
- **Animations:** kpBook-08-DoorBreathe
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-door-choice`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-door-choice::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-door-choice::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-door-choice`
- **CSS body (primary):**
```css
.kp-door-choice {
position: relative;
    width: min(18rem, 72vw);
    height: 25rem;
    margin: 2.8rem auto;
    border: 0.75rem solid #4c321f;
    border-bottom-width: 1rem;
    background: linear-gradient(90deg, #5e3c24, #8b5d34 42%, #694324);
    box-shadow: 0 1rem 2rem rgba(0,0,0,0.45), inset 0 0 2rem rgba(0,0,0,0.35);
    transform-origin: left center;
    animation: kpBook-08-DoorBreathe 6s ease-in-out infinite;
}
```

---

## `.kp-door-open`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-door-open`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-door-open::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-door-open`
- **CSS body (primary):**
```css
.kp-door-open {
position: relative;
    min-height: 11rem;
    margin: 2.5rem 0;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.2);
    background: #fff;
    box-shadow: 0 0 3rem rgba(255,255,255,0.28);
}
```

---

## `.kp-door-sequence`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-04-DoorUnlock
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-door-sequence`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-door-sequence span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-door-sequence span:nth-child(2)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-door-sequence span`
- **CSS body (primary):**
```css
.kp-door-sequence {
width: 2.7rem;
    height: 4.4rem;
    border: 1px solid rgba(0,234,255,0.2);
    border-right-width: 4px;
    background: linear-gradient(90deg, rgba(0,234,255,0.055), rgba(0,0,0,0.48));
    animation: kpBook-04-DoorUnlock 5.5s ease-in-out infinite;
}
```

---

## `.kp-drill-pit`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, transform
- **Animations:** kpBook-05-DrillVibrate
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-drill-pit`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-drill-pit::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-drill-pit::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-drill-pit::before`
- **CSS body (primary):**
```css
.kp-drill-pit {
content: "DRIL-4";
    position: absolute;
    left: 50%;
    bottom: 1.7rem;
    width: 5rem;
    height: 5rem;
    display: grid;
    place-items: center;
    color: #ffc07a;
    border: 2px solid #ff913e;
    border-radius: 0.8rem;
    background: #29170c;
    font: 700 0.82rem ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    transform: translateX(-50%);
    animation: kpBook-05-DrillVibrate 0.23s linear infinite;
}
```

---

## `.kp-drone-dot`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 12 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-dot`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-dot`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-dot`
- **CSS body (primary):**
```css
.kp-drone-dot {
position: absolute;
    left: 50%;
    top: 50%;
    width: 0.8rem;
    height: 0.32rem;
    margin: -0.16rem -0.4rem;
    background: var(--kp-black);
    border: 1px solid var(--kp-red);
    box-shadow: 0 0 0.7rem rgba(255,64,87,0.55);
    transform: rotate(calc(var(--i) * 30deg)) translateY(-12.2rem);
    transform-origin: 0 0;
}
```

---

## `.kp-drone-ring`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-ring`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-ring::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-ring::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-ring::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-ring::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-drone-ring`
- **CSS body (primary):**
```css
.kp-drone-ring {
position: relative;
    width: min(28rem, 82vw);
    aspect-ratio: 1;
    margin: 2.2rem auto;
    border: 1px dashed rgba(255,64,87,0.36);
    border-radius: 50%;
    box-shadow: inset 0 0 3rem rgba(255,64,87,0.06);
}
```

---

## `.kp-drone-sky`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter
- **Animations:** kpBook-16-drones
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-drone-sky`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-drone-sky::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-drone-sky::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-drone-sky::before`
- **CSS body (primary):**
```css
.kp-drone-sky {
content: "";
    position: absolute;
    inset: 7% 8% 35%;
    background:
      radial-gradient(circle at 8% 12%, #ff4057 0 0.16rem, transparent 0.2rem),
      radial-gradient(circle at 18% 33%, #ff4057 0 0.16rem, transparent 0.2rem),
      radial-gradient(circle at 28% 15%, #ff4057 0 0.16rem, transparent 0.2rem),
      radial-gradient(circle at 38% 40%, #ff4057 0 0.16rem, transparent 0.2rem),
      radial-gradient(circle at 48% 22%, #ff4057 0 0.16rem, transparent 0.2rem),
      radial-gradient(circle at 58% 42%, #ff4057 0 0.16rem, transparent 0.2rem),
      radial-gradient(circle at 68% 17%,…
}
```

---

## `.kp-drone-swarm`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-08-DronesForm
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-drone-swarm`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-drone-swarm::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-drone-swarm::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-drone-swarm::before`
- **CSS body (primary):**
```css
.kp-drone-swarm {
content: "•  •   • •    •   •  •    • •   •    •  •";
    position: absolute;
    left: -15%;
    right: -15%;
    top: 3rem;
    color: rgba(255,255,255,0.78);
    font-size: clamp(1.1rem, 4vw, 2rem);
    letter-spacing: 1.9rem;
    white-space: nowrap;
    animation: kpBook-08-DronesForm 6s ease-in-out infinite alternate;
}
```

---

## `.kp-drones`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-07-Drones
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-drones`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-drones::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-drones::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-drones::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-drones::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-drones::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-drones::after`
- **CSS body (primary):**
```css
.kp-drones {
content: "✥   ✥     ✥  ✥      ✥    ✥   ✥";
    position: absolute;
    white-space: nowrap;
    color: rgba(246,255,0,0.7);
    font-size: 1rem;
    animation: kpBook-07-Drones 7s linear infinite;
}
```

---

## `.kp-drop-meter`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-01-DropFlash
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-drop-meter`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-drop-meter span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-drop-meter span:nth-child(2)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-drop-meter span`
- **CSS body (primary):**
```css
.kp-drop-meter {
display: block;
    animation: kpBook-01-DropFlash 2.5s steps(1,end) infinite;
}
```

---

## `.kp-fade-text`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-10-TextFade
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-fade-text`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-fade-text`
- **CSS body (primary):**
```css
.kp-fade-text {
animation: kpBook-10-TextFade 8s ease-in-out infinite alternate;
}
```

---

## `.kp-falling-tool`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-00-ToolFade
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-falling-tool`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-falling-tool span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-falling-tool span:nth-child(2)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-falling-tool span`
- **CSS body (primary):**
```css
.kp-falling-tool {
display: block;
    animation: kpBook-00-ToolFade 2.8s ease-in infinite;
}
```

---

## `.kp-family-signal`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-family-signal`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-family-signal .kp-old-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-family-signal .kp-whisper`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-family-signal`
- **CSS body (primary):**
```css
.kp-family-signal {
margin: 2.3rem 0;
    padding: 1.45rem;
    color: #dcecff;
    background: #010304;
    border: 1px solid rgba(78,140,255,0.24);
    box-shadow: 0 0 3rem rgba(0,0,0,0.75);
}
```

---

## `.kp-final-line`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 18 occurrences across 18 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-final-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-final-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-final-line`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-final-line strong`
- **CSS body (primary):**
```css
.kp-final-line {
color: var(--kp-claim);
    text-shadow: 0 0 0.85rem rgba(53,255,131,0.28);
}
```

---

## `.kp-final-voice`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-final-voice`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-final-voice`
- **CSS body (primary):**
```css
.kp-final-voice {
margin-top: 2rem;
    padding: 1.2rem 1.35rem;
    color: var(--kp-white);
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.035);
    text-align: center;
    font-size: clamp(1.05rem, 2.4vw, 1.35rem);
    letter-spacing: 0.04em;
    text-shadow: 0 0 1.1rem rgba(255,255,255,0.24);
}
```

---

## `.kp-flatline`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-flatline`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-flatline::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-flatline::before`
- **CSS body (primary):**
```css
.kp-flatline {
content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: #c4ced0;
    box-shadow: 0 0 0.5rem rgba(196,206,208,0.35);
}
```

---

## `.kp-foam`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-02-FoamRise
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-foam`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-foam::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-foam > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-foam::after`
- **CSS body (primary):**
```css
.kp-foam {
content: "";
    position: absolute;
    left: -5%;
    right: -5%;
    bottom: -70%;
    height: 95%;
    pointer-events: none;
    background:
      radial-gradient(circle at 10% 35%, rgba(255,255,255,0.45) 0 0.45rem, transparent 0.5rem),
      radial-gradient(circle at 32% 22%, rgba(255,255,255,0.38) 0 0.65rem, transparent 0.7rem),
      radial-gradient(circle at 58% 38%, rgba(255,255,255,0.35) 0 0.5rem, transparent 0.55rem),
      radial-gradient(circle at 78% 18%, rgba(255,255,255,0.42) 0 0.8rem, transparent 0.85rem),
      linear-gradient(180deg, rgba(232,244,244,0.45), rgba(190,213,212,…
}
```

---

## `.kp-fork-arms`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-fork-arms`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-fork-arms::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-fork-arms::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-fork-arms::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-fork-arms::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-fork-arms::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-fork-arms::after`
- **CSS body (primary):**
```css
.kp-fork-arms {
content: "";
    position: absolute;
    top: 3rem;
    width: 42%;
    height: 1.4rem;
    background: repeating-linear-gradient(135deg, #ffc928 0 1rem, #181818 1rem 2rem);
    border: 0.22rem solid #111;
    box-shadow: 0 0 1rem rgba(255,201,40,0.12);
}
```

---

## `.kp-fox-object`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-fox-object`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-fox-object::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-fox-object::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-fox-object::before`
- **CSS body (primary):**
```css
.kp-fox-object {
content: "◇";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--kp-glitchka);
    font: clamp(5rem, 18vw, 10rem)/1 sans-serif;
    transform: rotate(45deg);
    text-shadow: 0 0 1.6rem rgba(255,131,236,0.5);
}
```

---

## `.kp-fragment`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 9 occurrences across 5 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-05-FragmentWarm
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-fragment`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-fragment::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-fragment`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-fragment`
- **CSS body (primary):**
```css
.kp-fragment {
position: relative;
    margin: 2.5rem auto;
    width: min(18rem, 74vw);
    aspect-ratio: 1.5;
    display: grid;
    place-items: center;
    border: 1px solid rgba(114,255,166,0.44);
    border-radius: 0.8rem;
    color: var(--kp-green);
    background:
      linear-gradient(135deg, rgba(114,255,166,0.13), rgba(0,0,0,0.75)),
      repeating-linear-gradient(90deg, transparent 0 14px, rgba(114,255,166,0.028) 15px 16px);
    box-shadow: 0 0 2.4rem rgba(114,255,166,0.11), inset 0 0 2rem rgba(114,255,166,0.045);
    font: 900 clamp(2rem, 7vw, 4.5rem)/1 ui-monospace, SFMono-Regular, Menlo, Conso…
}
```

---

## `.kp-fragment-circle`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-fragment-circle`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-fragment-circle span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-fragment-circle span:nth-child(1)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-fragment-circle span`
- **CSS body (primary):**
```css
.kp-fragment-circle {
width: 4rem;
    height: 4rem;
    display: grid;
    place-items: center;
    border: 1px solid currentColor;
    border-radius: 50%;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 1.25rem;
    box-shadow: 0 0 1.2rem color-mix(in srgb, currentColor 22%, transparent);
}
```

---

## `.kp-freefall`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-01-FallLine
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-freefall`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-freefall::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-freefall::before`
- **CSS body (primary):**
```css
.kp-freefall {
content: "";
    position: absolute;
    left: 0.45rem;
    top: -50%;
    width: 1px;
    height: 200%;
    background: linear-gradient(180deg, transparent, var(--kp-red), transparent);
    animation: kpBook-01-FallLine 1.15s linear infinite;
}
```

---

## `.kp-gap-meter`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-02-GapGrow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-gap-meter`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-gap-meter span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-gap-meter span:nth-child(2)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-gap-meter span`
- **CSS body (primary):**
```css
.kp-gap-meter {
min-height: 0.55rem;
    background: rgba(255,64,87,0.14);
    border: 1px solid rgba(255,64,87,0.3);
    animation: kpBook-02-GapGrow 3.6s steps(5,end) infinite;
}
```

---

## `.kp-gate`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-gate`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-gate::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-gate`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-gate`
- **CSS body (primary):**
```css
.kp-gate {
position: relative;
    margin: 2.3rem 0;
    min-height: 15rem;
    overflow: hidden;
    border: 1px solid rgba(0,236,255,0.15);
    background:
      linear-gradient(90deg, #151b1f 0 8%, transparent 8% 92%, #151b1f 92%),
      repeating-linear-gradient(90deg, rgba(0,236,255,0.02) 0 4rem, rgba(0,236,255,0.06) 4.05rem 4.2rem),
      linear-gradient(180deg, #071014, #010203);
    box-shadow: inset 0 0 4rem rgba(0,236,255,0.035);
}
```

---

## `.kp-glass-wall`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-glass-wall`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-glass-wall::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-glass-wall::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-glass-wall::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-glass-wall::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-glass-wall`
- **CSS body (primary):**
```css
.kp-glass-wall {
position: relative;
    margin: 2.2rem 0;
    padding: 1.4rem;
    border: 1px solid rgba(190,230,241,0.26);
    background:
      linear-gradient(135deg, rgba(255,255,255,0.045), transparent 45%),
      rgba(10,30,39,0.28);
    box-shadow: inset 0 0 3rem rgba(161,224,240,0.025);
    overflow: hidden;
}
```

---

## `.kp-global-fix`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-global-fix`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-global-fix::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-global-fix::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-global-fix`
- **CSS body (primary):**
```css
.kp-global-fix {
position: relative;
    margin: 2.5rem 0;
    min-height: 30rem;
    overflow: hidden;
    border: 1px solid rgba(53,255,131,0.24);
    background:
      radial-gradient(circle at center, rgba(53,255,131,0.13), transparent 24%),
      repeating-linear-gradient(90deg, transparent 0 8%, rgba(53,255,131,0.05) 8.2% 8.5%, transparent 8.7% 16%),
      repeating-linear-gradient(180deg, transparent 0 12%, rgba(0,236,255,0.04) 12.2% 12.5%, transparent 12.7% 24%),
      #020604;
    box-shadow: inset 0 0 8rem rgba(0,0,0,0.76);
}
```

---

## `.kp-handprint`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-handprint`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-handprint`
- **CSS body (primary):**
```css
.kp-handprint {
width: min(14rem, 54vw);
    aspect-ratio: 1;
    margin: 2rem auto;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 1px solid rgba(0,234,255,0.28);
    color: rgba(0,234,255,0.82);
    font-size: clamp(5rem, 17vw, 9rem);
    text-shadow: 0 0 1.5rem rgba(0,234,255,0.32);
    box-shadow: inset 0 0 3rem rgba(0,234,255,0.05);
    transform: rotate(-8deg);
}
```

---

## `.kp-home-cluster`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-home-cluster`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-home-cluster::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-home-cluster::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-home-cluster`
- **CSS body (primary):**
```css
.kp-home-cluster {
position: relative;
    min-height: 22rem;
    margin: 2.6rem 0;
    overflow: hidden;
    border: 1px solid rgba(255,201,120,0.28);
    background:
      radial-gradient(circle at 50% 22%, rgba(255,201,120,0.18), transparent 18rem),
      linear-gradient(180deg, #25180c 0%, #0b0b0a 72%);
    box-shadow: inset 0 0 5rem rgba(255,201,120,0.055);
}
```

---

## `.kp-hospital`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-hospital`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-hospital::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-hospital::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-hospital`
- **CSS body (primary):**
```css
.kp-hospital {
position: relative;
    min-height: 19rem;
    margin: 2.5rem 0;
    overflow: hidden;
    border: 1px solid rgba(189,239,255,0.22);
    background:
      linear-gradient(180deg, rgba(189,239,255,0.08), rgba(0,0,0,0.64)),
      #071018;
    box-shadow: inset 0 0 4rem rgba(189,239,255,0.04), 0 0 3rem rgba(189,239,255,0.035);
}
```

---

## `.kp-id`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024 .kp-id`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-id,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-wait`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-id`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024 .kp-id`
- **CSS body (primary):**
```css
.kp-id {
display: block;
    color: var(--kp-white);
    font: 900 clamp(1.1rem, 3vw, 1.8rem)/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.12em;
    text-shadow: 0 0 1rem rgba(75,140,255,0.35);
}
```

---

## `.kp-impact`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-05-ImpactShake
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-impact`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-impact::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-impact > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-impact`
- **CSS body (primary):**
```css
.kp-impact {
position: relative;
    margin: 2.3rem 0;
    padding: 1.6rem;
    border: 1px solid rgba(255,64,87,0.38);
    border-left: 6px solid var(--kp-red);
    background:
      radial-gradient(circle at 15% 50%, rgba(255,64,87,0.18), transparent 36%),
      repeating-linear-gradient(130deg, transparent 0 13px, rgba(255,64,87,0.035) 14px 16px),
      rgba(0,0,0,0.56);
    animation: kpBook-05-ImpactShake 0.5s steps(2,end) 1;
    overflow: hidden;
}
```

---

## `.kp-island-map`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-15-island
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-island-map`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-island-map::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-island-map::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-island-map::before`
- **CSS body (primary):**
```css
.kp-island-map {
content: "";
    position: absolute;
    inset: 14% 12%;
    border: 0.25rem solid rgba(0,236,255,0.38);
    border-radius: 46% 54% 44% 56% / 55% 45% 55% 45%;
    box-shadow:
      inset 0 0 4rem rgba(0,236,255,0.08),
      0 0 3rem rgba(0,236,255,0.09);
    animation: kpBook-15-island 3.6s ease-in-out infinite alternate;
}
```

---

## `.kp-key`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-key`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-key::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-key::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-key::before`
- **CSS body (primary):**
```css
.kp-key {
content: "T.O.V.A.";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: #596000;
    font: clamp(1.8rem, 6vw, 4rem)/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.17em;
    text-shadow: 0 0 0.8rem rgba(245,255,51,0.45);
}
```

---

## `.kp-keyring`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-keyring`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-keyring::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-keyring::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-keyring`
- **CSS body (primary):**
```css
.kp-keyring {
position: relative;
    width: min(20rem, 72vw);
    aspect-ratio: 1;
    margin: 2.2rem auto;
    border: 1rem solid rgba(0,234,255,0.16);
    border-radius: 50%;
    box-shadow: inset 0 0 2rem rgba(0,234,255,0.06), 0 0 2rem rgba(0,234,255,0.06);
}
```

---

## `.kp-knock`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-03-Knock
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-knock`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-knock span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-knock span:nth-child(2)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-knock span`
- **CSS body (primary):**
```css
.kp-knock {
width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;
    background: var(--kp-magenta);
    box-shadow: 0 0 0.7rem rgba(255,88,199,0.55);
    animation: kpBook-03-Knock 2.2s steps(1,end) infinite;
}
```

---

## `.kp-label-card`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 7 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-label-card`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-label-card strong`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-label-card span`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-label-card`
- **CSS body (primary):**
```css
.kp-label-card {
position: relative;
    min-height: 9.5rem;
    padding: 1rem;
    border: 1px dashed rgba(255,171,69,0.45);
    background: #eee9db;
    color: #171716;
    box-shadow: 0 0.45rem 1rem rgba(0,0,0,0.3);
    transform: rotate(var(--r, 0deg));
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
```

---

## `.kp-leak-pulse`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-08-Leak
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-leak-pulse`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-leak-pulse::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-leak-pulse > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-leak-pulse::before`
- **CSS body (primary):**
```css
.kp-leak-pulse {
content: "";
    position: absolute;
    left: -30%;
    top: 0;
    bottom: 0;
    width: 28%;
    background: linear-gradient(90deg, transparent, rgba(255,64,87,0.3), transparent);
    animation: kpBook-08-Leak 2.4s linear infinite;
}
```

---

## `.kp-legacy-core`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-legacy-core`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-legacy-core::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-legacy-core::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-legacy-core::before`
- **CSS body (primary):**
```css
.kp-legacy-core {
content: "";
    position: absolute;
    left: 50%;
    bottom: 3rem;
    width: 5rem;
    height: 8rem;
    transform: translateX(-50%);
    border: 1px solid rgba(0,246,255,0.25);
    background: linear-gradient(180deg, rgba(0,246,255,0.04), rgba(0,0,0,0.88));
    box-shadow: 0 0 2rem rgba(0,246,255,0.12);
}
```

---

## `.kp-legacy-figures`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-legacy-figures`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-legacy-figures span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-legacy-figures span::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-legacy-figures span::before`
- **CSS body (primary):**
```css
.kp-legacy-figures {
content: "";
    position: absolute;
    left: 50%;
    top: 1rem;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 50%;
    border: 1px solid rgba(166,197,255,0.45);
    transform: translateX(-50%);
}
```

---

## `.kp-letter`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 8 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-18-letter-float
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-letter`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-letter:nth-child(2n)`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-letter:nth-child(3n)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-letter`
- **CSS body (primary):**
```css
.kp-letter {
display: grid;
    place-items: center;
    width: 3.2rem;
    height: 3.2rem;
    border: 1px solid rgba(0,246,255,0.28);
    color: var(--kp-null);
    background: rgba(0,246,255,0.05);
    font: 1.4rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    text-shadow: 0 0 0.8rem rgba(0,246,255,0.5);
    animation: kpBook-18-letter-float 3.2s ease-in-out infinite alternate;
}
```

---

## `.kp-lift-offer`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-15-offer-shift
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-lift-offer`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-lift-offer::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-lift-offer::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-lift-offer::before`
- **CSS body (primary):**
```css
.kp-lift-offer {
content: "";
    position: absolute;
    inset: 8% 7%;
    border: 1px solid rgba(255,255,255,0.12);
    background:
      linear-gradient(90deg,
        rgba(0,236,255,0.12) 0 15%, transparent 15% 20%,
        rgba(255,56,221,0.12) 20% 35%, transparent 35% 40%,
        rgba(156,255,199,0.12) 40% 55%, transparent 55% 60%,
        rgba(215,191,142,0.13) 60% 75%, transparent 75% 80%,
        rgba(217,170,255,0.15) 80% 100%);
    opacity: 0.7;
    animation: kpBook-15-offer-shift 5.2s ease-in-out infinite alternate;
}
```

---

## `.kp-live-text`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 11 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-live-text`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-live-text`
- **CSS body (primary):**
```css
.kp-live-text {
margin: 1.8rem 0;
    padding: 1.1rem;
    border: 1px solid rgba(0,246,255,0.22);
    background:
      repeating-linear-gradient(180deg, transparent 0 0.42rem, rgba(0,246,255,0.025) 0.46rem 0.49rem),
      #020708;
    color: var(--kp-null);
    font: 1rem/1.78 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    text-shadow: 0 0 0.8rem rgba(0,246,255,0.28);
}
```

---

## `.kp-logistics-belt`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-16-belt
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-logistics-belt`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-logistics-belt::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-logistics-belt::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-logistics-belt::after`
- **CSS body (primary):**
```css
.kp-logistics-belt {
content: "";
    position: absolute;
    left: 7%;
    right: 7%;
    bottom: 14%;
    height: 2.5rem;
    background:
      repeating-linear-gradient(90deg, #394144 0 2rem, #171d1f 2rem 4rem);
    box-shadow: 0 0 1.2rem rgba(255,201,40,0.08);
    animation: kpBook-16-belt 2s linear infinite;
}
```

---

## `.kp-logistics-yard`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-logistics-yard`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-logistics-yard::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-logistics-yard::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-logistics-yard`
- **CSS body (primary):**
```css
.kp-logistics-yard {
position: relative;
    min-height: 20rem;
    margin: 2.5rem 0;
    overflow: hidden;
    border: 1px solid rgba(255,171,69,0.24);
    background:
      linear-gradient(180deg, rgba(255,171,69,0.045), rgba(0,0,0,0.7)),
      repeating-linear-gradient(90deg, #0c1113 0 4rem, #111719 4rem 4.15rem);
    box-shadow: inset 0 0 4rem rgba(255,171,69,0.035);
}
```

---

## `.kp-manual-switch`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-manual-switch`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-manual-switch::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-manual-switch::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-manual-switch`
- **CSS body (primary):**
```css
.kp-manual-switch {
position: relative;
    width: min(28rem, 88vw);
    min-height: 12rem;
    margin: 2.6rem auto;
    border: 2px solid #6e7679;
    background:
      linear-gradient(145deg, rgba(255,255,255,0.06), rgba(0,0,0,0.7)),
      #161b1d;
    box-shadow: inset 0 0 2rem rgba(0,0,0,0.72), 0 0 2rem rgba(255,64,87,0.06);
}
```

---

## `.kp-manual-witness`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-manual-witness`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-manual-witness .datastream`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-manual-witness`
- **CSS body (primary):**
```css
.kp-manual-witness {
color: var(--kp-white);
    border-color: rgba(246, 255, 0, 0.55);
    box-shadow:
      inset 0 0 2.5rem rgba(246, 255, 0, 0.035),
      0 0 1.2rem rgba(246, 255, 0, 0.045);
}
```

---

## `.kp-map`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow, animation, transform
- **Animations:** kpBook-12-node-pulse
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-map`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-map::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-map::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-map::before`
- **CSS body (primary):**
```css
.kp-map {
content: "CONTINUITY NODE";
    position: absolute;
    left: 50%;
    top: 55%;
    transform: translate(-50%, -50%);
    width: 6.4rem;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border-radius: 50%;
    border: 2px solid var(--kp-magenta);
    color: #ffd7fa;
    background: rgba(25,0,24,0.8);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    text-align: center;
    box-shadow: 0 0 2rem rgba(255,59,223,0.34);
    animation: kpBook-12-node-pulse 2.6s ease-in-out infinite;
}
```

---

## `.kp-mechanical-timer`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation, transform
- **Animations:** kpBook-18-timer-hand
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-mechanical-timer`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-mechanical-timer::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-mechanical-timer::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-mechanical-timer::before`
- **CSS body (primary):**
```css
.kp-mechanical-timer {
content: "";
    position: absolute;
    left: calc(50% - 0.22rem);
    top: 19%;
    width: 0.44rem;
    height: 31%;
    background: var(--kp-yellow);
    transform-origin: 50% 100%;
    transform: rotate(-25deg);
    box-shadow: 0 0 1rem rgba(245,255,51,0.42);
    animation: kpBook-18-timer-hand 8s linear infinite;
}
```

---

## `.kp-memory-video`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-memory-video`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-memory-video::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-memory-video::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-memory-video`
- **CSS body (primary):**
```css
.kp-memory-video {
position: relative;
    margin: 2rem auto;
    max-width: 62rem;
    padding: 1.3rem;
    border: 1px solid rgba(169,223,255,0.26);
    background: #050708;
    box-shadow: 0 0 2.5rem rgba(169,223,255,0.045);
}
```

---

## `.kp-migration`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-migration`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-migration::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-migration > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-migration::after`
- **CSS body (primary):**
```css
.kp-migration {
content: "PŘENESENO";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: rgba(226,235,238,0.045);
    font: 900 clamp(3.2rem, 11vw, 9rem)/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.12em;
    transform: rotate(-5deg);
    pointer-events: none;
}
```

---

## `.kp-migration-counter`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-15-counter
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-migration-counter`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-migration-counter`
- **CSS body (primary):**
```css
.kp-migration-counter {
margin: 1.8rem auto;
    max-width: 42rem;
    padding: 1.1rem;
    color: var(--kp-white);
    text-align: center;
    border: 1px solid rgba(255,56,221,0.28);
    background: rgba(44,0,37,0.28);
    font: clamp(1rem, 3vw, 1.65rem)/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.1em;
    box-shadow: 0 0 2.8rem rgba(255,56,221,0.08);
    animation: kpBook-15-counter 1.2s steps(2,end) infinite;
}
```

---

## `.kp-migration-timer`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-access-timer,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy-countdown,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-migration-timer`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-migration-timer`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-migration-timer`
- **CSS body (primary):**
```css
.kp-migration-timer {
color: var(--kp-white);
    border: 1px solid rgba(117,255,173,0.28);
    background: rgba(0,34,15,0.4);
    box-shadow: 0 0 2.5rem rgba(53,255,131,0.08);
}
```

---

## `.kp-milo-arm`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-milo-arm`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-milo-arm::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-milo-arm::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-milo-arm::after`
- **CSS body (primary):**
```css
.kp-milo-arm {
content: "";
    position: absolute;
    left: 29%;
    right: 15%;
    bottom: 24%;
    height: 0.22rem;
    transform: rotate(-3deg);
    background: linear-gradient(90deg, transparent, rgba(255,201,40,0.8), transparent);
    box-shadow: 0 -2rem 0 rgba(255,64,87,0.18);
}
```

---

## `.kp-milo-cart`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-milo-cart`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-milo-cart::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-milo-cart::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-milo-cart::before`
- **CSS body (primary):**
```css
.kp-milo-cart {
content: "";
    position: absolute;
    left: 17%;
    right: 17%;
    bottom: 14%;
    height: 1.2rem;
    border: 1px solid rgba(164,175,179,0.32);
    background: #343c3e;
    transform: skewX(-3deg);
    box-shadow: -7rem 1.2rem 0 -0.2rem #202627, 7rem 1.2rem 0 -0.2rem #202627;
}
```

---

## `.kp-milo-crushed`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-milo-crushed`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-milo-crushed::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-milo-crushed::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-milo-crushed::before`
- **CSS body (primary):**
```css
.kp-milo-crushed {
content: "";
    position: absolute;
    left: 35%;
    right: 35%;
    bottom: 18%;
    height: 43%;
    border: 0.2rem solid rgba(255,201,40,0.42);
    transform: skewX(7deg) rotate(2deg);
    box-shadow:
      0 0 1.2rem rgba(255,201,40,0.18),
      2rem -1rem 0 -1.7rem rgba(255,64,87,0.6);
}
```

---

## `.kp-milo-damage`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** kpBook-13-damage-flicker
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-milo-damage`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-milo-damage`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-milo-damage::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-milo-damage::before`
- **CSS body (primary):**
```css
.kp-milo-damage {
content: "KOSMETICKÁ ODCHYLKA";
    position: absolute;
    right: 1rem;
    top: 1rem;
    color: var(--kp-milo);
    font: 0.82rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.1em;
    animation: kpBook-13-damage-flicker 1.3s steps(2,end) infinite;
}
```

---

## `.kp-milo-entry`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-milo-entry`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-milo-entry`
- **CSS body (primary):**
```css
.kp-milo-entry {
position: relative;
    margin: 2.2rem 0;
    padding: 1.5rem 1.5rem 1.5rem 1.8rem;
    border: 1px solid rgba(255,201,40,0.32);
    border-left: 5px solid var(--kp-milo);
    background:
      repeating-linear-gradient(135deg, rgba(255,201,40,0.045) 0, rgba(255,201,40,0.045) 0.7rem, transparent 0.7rem, transparent 1.4rem),
      rgba(0,0,0,0.42);
    box-shadow: 0 0 2rem rgba(255,201,40,0.05);
}
```

---

## `.kp-milo-mark`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-milo-mark`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-milo-mark`
- **CSS body (primary):**
```css
.kp-milo-mark {
display: inline-block;
    color: #151500;
    padding: 0.25rem 0.55rem;
    background: var(--kp-milo);
    font: 900 0.85rem/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.14em;
    transform: rotate(-1deg);
}
```

---

## `.kp-milo-repair`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-milo-repair`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-milo-repair::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-milo-repair::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-milo-repair`
- **CSS body (primary):**
```css
.kp-milo-repair {
position: relative;
    margin: 2rem 0;
    min-height: 18rem;
    overflow: hidden;
    border: 1px solid rgba(255,201,40,0.18);
    background:
      radial-gradient(circle at 37% 52%, rgba(255,201,40,0.16), transparent 14%),
      radial-gradient(circle at 57% 58%, rgba(255,64,87,0.11), transparent 12%),
      linear-gradient(116deg, transparent 0 37%, rgba(175,192,200,0.18) 37.4% 40%, rgba(8,13,14,0.92) 40.4% 60%, rgba(175,192,200,0.12) 60.4% 63%, transparent 63.4%),
      #030506;
    box-shadow: inset 0 -4rem 5rem rgba(0,0,0,0.75);
}
```

---

## `.kp-mirror-strip`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, transform
- **Animations:** kpBook-04-MirrorBlink
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-mirror-strip`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-mirror-strip span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-mirror-strip span:nth-child(2n)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-mirror-strip span`
- **CSS body (primary):**
```css
.kp-mirror-strip {
border: 1px solid rgba(216,167,255,0.2);
    background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(216,167,255,0.03) 48%, rgba(0,0,0,0.28) 49%);
    transform: rotateY(-7deg);
    animation: kpBook-04-MirrorBlink 6s ease-in-out infinite;
}
```

---

## `.kp-n2-signal`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-n2-signal`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-n2-signal::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-n2-signal::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-n2-signal::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-n2-signal::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-n2-signal::after`
- **CSS body (primary):**
```css
.kp-n2-signal {
left: -0.2rem; bottom: -1rem; transform: rotate(90deg);
}
```

---

## `.kp-neon-zero`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-18-label-cycle
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-neon-zero`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-neon-zero::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-neon-zero::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-neon-zero::before`
- **CSS body (primary):**
```css
.kp-neon-zero {
content: "NEON-0  /  T-AI ROOT PERSONA  /  NULL-0";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: rgba(0,114,127,0.72);
    font: clamp(1rem, 4vw, 2.1rem)/1.6 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.1em;
    text-align: center;
    animation: kpBook-18-label-cycle 3.6s steps(3,end) infinite;
}
```

---

## `.kp-neon0-card`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-neon0-card`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-neon0-card strong`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-neon0-card`
- **CSS body (primary):**
```css
.kp-neon0-card {
margin: 2rem 0;
    padding: 1.3rem;
    border: 1px solid rgba(0,234,255,0.2);
    background: radial-gradient(circle at 20% 0%, rgba(0,234,255,0.075), transparent 32rem), rgba(0,0,0,0.52);
    box-shadow: inset 0 0 2rem rgba(0,234,255,0.025);
}
```

---

## `.kp-neutralized`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** none
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"].kp-chapter.kp-neutralized`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"].kp-chapter.kp-neutralized`
- **CSS body (primary):**
```css
.kp-neutralized {
animation: none;
    background:
      radial-gradient(circle at 50% -12%, rgba(255,255,255,0.045), transparent 34rem),
      linear-gradient(180deg, #101419 0%, #06090c 55%, #020405 100%);
}
```

---

## `.kp-node-awake`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-15-node-breathe
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-node-awake`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-node-awake::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-node-awake::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-node-awake::before`
- **CSS body (primary):**
```css
.kp-node-awake {
content: "";
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: 8%;
    height: 63%;
    background:
      repeating-linear-gradient(90deg, rgba(88,255,155,0.12) 0 2.7rem, transparent 2.8rem 4.4rem);
    clip-path: polygon(0 100%, 0 44%, 8% 44%, 8% 15%, 15% 15%, 15% 66%, 23% 66%, 23% 35%, 32% 35%, 32% 6%, 42% 6%, 42% 53%, 51% 53%, 51% 22%, 62% 22%, 62% 72%, 70% 72%, 70% 39%, 79% 39%, 79% 12%, 89% 12%, 89% 57%, 100% 57%, 100% 100%);
    opacity: 0.62;
    animation: kpBook-15-node-breathe 3.7s ease-in-out infinite alternate;
}
```

---

## `.kp-null-half`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-11-city-vein
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-physical-half,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-null-half`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-null-half`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-null-half::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-null-half::before`
- **CSS body (primary):**
```css
.kp-null-half {
content: "";
    position: absolute;
    left: 9%;
    right: 7%;
    bottom: 18%;
    height: 0.32rem;
    background: linear-gradient(90deg, transparent, var(--kp-cyan), var(--kp-magenta), transparent);
    box-shadow: 0 -2.4rem 0 rgba(0,236,255,0.11), 0 -5.2rem 0 rgba(255,59,223,0.07);
    animation: kpBook-11-city-vein 3.8s ease-in-out infinite;
}
```

---

## `.kp-null-thread`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-null-thread`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-null-thread`
- **CSS body (primary):**
```css
.kp-null-thread {
margin: 2rem 0;
    padding: 1.2rem;
    border: 1px solid rgba(0,246,255,0.22);
    background:
      repeating-linear-gradient(180deg, transparent 0 0.42rem, rgba(0,246,255,0.025) 0.46rem 0.49rem),
      #020708;
    color: var(--kp-null);
    font: 1rem/1.78 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    text-shadow: 0 0 0.8rem rgba(0,246,255,0.28);
}
```

---

## `.kp-offer`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 6 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-offer`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-offer strong`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-offer`
- **CSS body (primary):**
```css
.kp-offer {
min-height: 15rem;
    padding: 1.1rem;
    border: 1px solid rgba(255,255,255,0.11);
    background: linear-gradient(145deg, rgba(255,255,255,0.055), transparent 34%), rgba(0,0,0,0.55);
    box-shadow: inset 0 0 2.3rem rgba(255,255,255,0.015);
}
```

---

## `.kp-offer--vanta`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-offer--vanta`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-offer--vanta strong`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-offer--vanta strong`
- **CSS body (primary):**
```css
.kp-offer--vanta {
color: var(--kp-vanta-gold);
    text-shadow: 0 0 0.8rem rgba(255,213,139,0.3);
}
```

---

## `.kp-old-house`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-old-house`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-old-house::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-old-house::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-old-house`
- **CSS body (primary):**
```css
.kp-old-house {
position: relative;
    min-height: 19rem;
    margin: 2.5rem 0;
    border: 1px solid rgba(188,176,155,0.28);
    background:
      linear-gradient(90deg, transparent 49.8%, rgba(188,176,155,0.18) 50%, transparent 50.2%),
      linear-gradient(180deg, #15130f, #090807);
    box-shadow: inset 0 0 4rem rgba(188,176,155,0.03);
}
```

---

## `.kp-old-line`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 12 occurrences across 3 files
- **Effect properties:** filter
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-old-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-family-signal .kp-old-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-directive .kp-old-line`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-old-line`
- **CSS body (primary):**
```css
.kp-old-line {
color: #bcc9cc;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    filter: grayscale(1);
    letter-spacing: 0.04em;
}
```

---

## `.kp-old-line--critical`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-directive .kp-old-line--critical`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-directive .kp-old-line--critical`
- **CSS body (primary):**
```css
.kp-old-line--critical {
color: var(--kp-red);
    font-weight: 800;
    text-shadow: 0 0 0.8rem rgba(255,64,87,0.2);
}
```

---

## `.kp-open-case`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-open-case`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-open-case::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-open-case::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-open-case::after`
- **CSS body (primary):**
```css
.kp-open-case {
content: "STAV: NEUZAVŘENO";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--kp-yellow);
    font: clamp(1.4rem, 6vw, 3.8rem)/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.16em;
    text-shadow: 0 0 1.2rem rgba(245,255,51,0.3);
}
```

---

## `.kp-open-doors`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, transition, transform
- **Animations:** kpBook-06-DoorsOpen
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-open-doors`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-open-doors::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-open-doors::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-open-doors::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-open-doors::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-open-doors::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-open-doors::after`
- **CSS body (primary):**
```css
.kp-open-doors {
content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    background: linear-gradient(90deg, #15242b, #091116);
    transition: transform 1.6s ease;
    animation: kpBook-06-DoorsOpen 5s ease-in-out infinite alternate;
}
```

---

## `.kp-open-house`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-open-house`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-open-house`
- **CSS body (primary):**
```css
.kp-open-house {
width: min(15rem, 60vw);
    aspect-ratio: 1.2;
    margin: 2rem auto;
    display: grid;
    place-items: center;
    color: var(--kp-home);
    font-size: clamp(6rem, 19vw, 11rem);
    text-shadow: 0 0 1.5rem rgba(255,201,120,0.28);
}
```

---

## `.kp-packet-corrupt`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-04-PacketGlitch
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-packet-corrupt`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-packet-corrupt`
- **CSS body (primary):**
```css
.kp-packet-corrupt {
position: relative;
    margin: 2rem 0;
    padding: 1.3rem 1.25rem;
    border: 1px solid rgba(255,64,87,0.32);
    background:
      repeating-linear-gradient(90deg, rgba(255,64,87,0.035) 0, rgba(255,64,87,0.035) 4px, transparent 4px, transparent 11px),
      linear-gradient(135deg, rgba(255,64,87,0.075), rgba(0,0,0,0.55));
    animation: kpBook-04-PacketGlitch 4.8s steps(2,end) infinite;
}
```

---

## `.kp-perfect-home`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-perfect-home`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-perfect-home::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-perfect-home::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-perfect-home`
- **CSS body (primary):**
```css
.kp-perfect-home {
position: relative;
    min-height: 20rem;
    margin: 2.6rem 0;
    overflow: hidden;
    border: 1px solid rgba(216,167,255,0.28);
    background:
      radial-gradient(circle at 50% 35%, rgba(255,213,139,0.19), transparent 15rem),
      linear-gradient(145deg, rgba(216,167,255,0.12), rgba(0,0,0,0.72));
    box-shadow: inset 0 0 5rem rgba(216,167,255,0.055), 0 0 2rem rgba(216,167,255,0.03);
}
```

---

## `.kp-physical-half`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-physical-half,
.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-null-half`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-physical-half`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-physical-half::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-physical-half::before`
- **CSS body (primary):**
```css
.kp-physical-half {
content: "";
    position: absolute;
    left: 18%;
    bottom: 12%;
    width: 38%;
    height: 48%;
    border: 1px solid rgba(255,255,255,0.12);
    background: linear-gradient(135deg, rgba(0,236,255,0.04), rgba(0,0,0,0.6));
    box-shadow: 0 0 0 0.4rem rgba(0,0,0,0.34), inset 0 0 2rem rgba(0,236,255,0.04);
}
```

---

## `.kp-power-fill`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 5 occurrences across 1 files
- **Effect properties:** box-shadow, transition, color-mix
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-power-fill`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-archive-pulse .kp-power-fill`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-power-fill`
- **CSS body (primary):**
```css
.kp-power-fill {
display: block;
    height: 100%;
    width: var(--power, 0%);
    background: var(--power-color, var(--kp-cyan));
    box-shadow: 0 0 0.85rem color-mix(in srgb, var(--power-color, var(--kp-cyan)) 55%, transparent);
    transition: width 1s ease;
}
```

---

## `.kp-preserved-count`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-01-CountCorrupt
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-preserved-count`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-preserved-count`
- **CSS body (primary):**
```css
.kp-preserved-count {
display: block;
    margin: 1rem 0;
    color: var(--kp-red);
    font: 800 clamp(1rem, 3vw, 1.7rem)/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.06em;
    text-shadow: 0 0 1rem rgba(255,64,87,0.28);
    animation: kpBook-01-CountCorrupt 4s steps(1,end) infinite;
}
```

---

## `.kp-pressure-lock`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-pressure-lock`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-pressure-lock::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-pressure-lock::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-pressure-lock::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-pressure-lock::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-pressure-lock`
- **CSS body (primary):**
```css
.kp-pressure-lock {
position: relative;
    margin: 2.4rem 0;
    min-height: 23rem;
    overflow: hidden;
    border: 1px solid rgba(255,64,87,0.2);
    background:
      linear-gradient(90deg, #20282c 0 13%, transparent 13.5% 86.5%, #20282c 87%),
      repeating-linear-gradient(180deg, rgba(255,255,255,0.02) 0 2.2rem, rgba(255,255,255,0.06) 2.25rem 2.35rem),
      #030607;
    box-shadow: inset 0 0 4rem rgba(0,0,0,0.75);
}
```

---

## `.kp-prime-mirror`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-prime-mirror`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-prime-mirror::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-prime-mirror::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="15"] .kp-prime-mirror`
- **CSS body (primary):**
```css
.kp-prime-mirror {
position: relative;
    margin: 2.5rem 0;
    min-height: 35rem;
    overflow: hidden;
    border: 1px solid rgba(255,213,139,0.4);
    background:
      radial-gradient(ellipse at 50% 28%, rgba(255,246,217,0.2), transparent 24%),
      radial-gradient(circle at 50% 65%, rgba(217,170,255,0.15), transparent 28%),
      repeating-linear-gradient(90deg, transparent 0 10%, rgba(255,213,139,0.05) 10.2% 10.4%, transparent 10.6% 20%),
      linear-gradient(180deg, #1b1420 0%, #0e0912 46%, #020203 100%);
    box-shadow: 0 0 4rem rgba(255,213,139,0.08);
}
```

---

## `.kp-profile-window`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-profile-window`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-profile-window::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-profile-window.is-deleting`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-profile-window`
- **CSS body (primary):**
```css
.kp-profile-window {
position: relative;
    margin: 1.8rem auto;
    max-width: 44rem;
    padding: 1.2rem 1.4rem;
    border: 1px solid rgba(216,167,255,0.34);
    background:
      radial-gradient(circle at 76% 26%, rgba(255,213,139,0.12), transparent 12rem),
      linear-gradient(145deg, rgba(216,167,255,0.08), rgba(0,0,0,0.62));
    box-shadow: 0 0 2rem rgba(216,167,255,0.06);
}
```

---

## `.kp-propaganda`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-08-FamilyScroll
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-propaganda`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-propaganda::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-propaganda::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-propaganda::before`
- **CSS body (primary):**
```css
.kp-propaganda {
content: "RODINA  •  BEZPEČÍ  •  NÁVRAT  •  KLID  •  KONTINUITA";
    position: absolute;
    left: -25%;
    top: 2.2rem;
    white-space: nowrap;
    color: rgba(255,238,203,0.9);
    font: 800 clamp(1rem, 4vw, 2rem)/1 ui-monospace, monospace;
    letter-spacing: 0.35em;
    animation: kpBook-08-FamilyScroll 14s linear infinite;
}
```

---

## `.kp-pump`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 2 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-12-pump-run
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump.is-stable .kp-pump__motor`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-pump`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump.is-stable .kp-pump__motor`
- **CSS body (primary):**
```css
.kp-pump {
animation: kpBook-12-pump-run 1.5s linear infinite;
    box-shadow: inset 0 0 1.5rem rgba(0,0,0,0.65), 0 0 1.2rem rgba(117,255,173,0.12);
}
```

---

## `.kp-pump__motor`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-12-pump-vibrate
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump__motor`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump.is-stable .kp-pump__motor`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-pump__motor`
- **CSS body (primary):**
```css
.kp-pump__motor {
width: min(24rem, 88%);
    height: 6.5rem;
    margin: 1rem auto;
    border-radius: 0.8rem;
    border: 0.35rem solid #4a4e50;
    background:
      repeating-linear-gradient(90deg, #292d2f 0 0.55rem, #171a1b 0.55rem 0.82rem);
    box-shadow: inset 0 0 1.5rem rgba(0,0,0,0.8), 0 0 1rem rgba(255,201,40,0.04);
    animation: kpBook-12-pump-vibrate 0.16s linear infinite;
}
```

---

## `.kp-question`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-question`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-question`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-question`
- **CSS body (primary):**
```css
.kp-question {
position: relative;
    margin: 2rem auto;
    padding: 1.45rem 1.4rem;
    max-width: 72rem;
    border: 1px solid rgba(246,255,0,0.36);
    background:
      linear-gradient(90deg, rgba(246,255,0,0.08), transparent 60%),
      rgba(0,0,0,0.72);
    color: var(--kp-yellow);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: clamp(1.05rem, 2.8vw, 1.72rem);
    letter-spacing: 0.1em;
    text-align: center;
    box-shadow: 0 0 1.5rem rgba(246,255,0,0.06), inset 0 0 2rem rgba(246,255,0,0.025);
}
```

---

## `.kp-radio-room`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-radio-room`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-radio-room::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-radio-room::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-radio-room::before`
- **CSS body (primary):**
```css
.kp-radio-room {
content: "";
    position: absolute;
    left: 13%;
    right: 13%;
    bottom: 15%;
    height: 36%;
    border: 1px solid rgba(0,236,255,0.2);
    background:
      repeating-linear-gradient(90deg, rgba(0,236,255,0.08) 0 2rem, transparent 2.1rem 4rem),
      #051013;
    box-shadow: 0 0 2rem rgba(0,236,255,0.06);
}
```

---

## `.kp-red-pulls`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-red-pulls`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-red-pulls::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-red-pulls::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-red-pulls::before`
- **CSS body (primary):**
```css
.kp-red-pulls {
content: "";
    position: absolute;
    inset: 19% 8%;
    background:
      linear-gradient(90deg,
        #ff4057 0 2%, transparent 2% 17%,
        #ff4057 17% 19%, transparent 19% 34%,
        #ff4057 34% 36%, transparent 36% 51%,
        #ff4057 51% 53%, transparent 53% 68%,
        #ff4057 68% 70%, transparent 70% 85%,
        #ff4057 85% 87%, transparent 87% 100%);
    filter: drop-shadow(0 0 0.7rem rgba(255,64,87,0.48));
}
```

---

## `.kp-remedy`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy strong`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy.is-disabled`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy.is-disabled`
- **CSS body (primary):**
```css
.kp-remedy {
opacity: 0.52;
    filter: grayscale(0.7);
}
```

---

## `.kp-remedy-countdown`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-14-countdown-pulse
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-access-timer,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy-countdown,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-migration-timer`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy-countdown`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-remedy-countdown`
- **CSS body (primary):**
```css
.kp-remedy-countdown {
color: var(--kp-red);
    border: 1px solid rgba(255,64,87,0.34);
    background: rgba(45,0,7,0.36);
    text-shadow: 0 0 1rem rgba(255,64,87,0.36);
    animation: kpBook-14-countdown-pulse 1s steps(2,end) infinite;
}
```

---

## `.kp-restraint`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** kpBook-04-Restraint
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-restraint`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-restraint::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-restraint::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-restraint::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-restraint::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-restraint::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-restraint::after`
- **CSS body (primary):**
```css
.kp-restraint {
content: "";
    position: absolute;
    top: 20%;
    bottom: 20%;
    width: 0.7rem;
    border: 1px solid rgba(255,180,227,0.36);
    border-radius: 1rem;
    background: rgba(255,79,195,0.08);
    animation: kpBook-04-Restraint 3.8s ease-in-out infinite;
}
```

---

## `.kp-restraint-bed`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-restraint-bed`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-restraint-bed`
- **CSS body (primary):**
```css
.kp-restraint-bed {
position: relative;
    min-height: 12rem;
    margin: 2rem 0;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 2rem 2rem 0.7rem 0.7rem;
    background:
      linear-gradient(90deg, transparent 0 18%, rgba(255,64,87,0.17) 18.5% 22%, transparent 22.5% 48%, rgba(255,64,87,0.17) 48.5% 52%, transparent 52.5% 78%, rgba(255,64,87,0.17) 78.5% 82%, transparent 82.5%),
      linear-gradient(180deg, #f3f6f7 0 15%, #88969c 15.5% 20%, #1b252a 20.5% 100%);
    box-shadow: inset 0 -3rem 4rem rgba(0,0,0,0.65);
}
```

---

## `.kp-restraint-line`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation, transform
- **Animations:** kpBook-09-LineTighten
- **Selectors (sample):** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-restraint-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-restraint-line::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-restraint-line::before`
- **CSS body (primary):**
```css
.kp-restraint-line {
content: "";
    position: absolute;
    left: -12%;
    top: 50%;
    width: 124%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--kp-red) 25%, #fff 50%, var(--kp-red) 75%, transparent);
    box-shadow: 0 0 0.8rem rgba(255,64,87,0.8);
    transform: rotate(-3deg);
    animation: kpBook-09-LineTighten 2s ease-in-out infinite alternate;
}
```

---

## `.kp-result`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-result`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-result .uncertain`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-result .uncertain`
- **CSS body (primary):**
```css
.kp-result {
color: var(--kp-yellow);
    font-size: 1.12em;
    text-shadow: 0 0 0.7rem rgba(246,255,0,0.28);
}
```

---

## `.kp-return-lights`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-return-lights`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-return-lights span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-return-lights span:nth-child(-n+8)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-return-lights span`
- **CSS body (primary):**
```css
.kp-return-lights {
min-height: 0.52rem;
    border: 1px solid rgba(246,255,0,0.18);
    background: rgba(246,255,0,0.1);
    box-shadow: 0 0 0.55rem rgba(246,255,0,0.08);
}
```

---

## `.kp-risk-map`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-risk-map`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-risk-map::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-risk-map`
- **CSS body (primary):**
```css
.kp-risk-map {
position: relative;
    min-height: 18rem;
    margin: 2rem 0;
    border: 1px solid rgba(255,64,87,0.21);
    background:
      radial-gradient(circle at 20% 28%, rgba(255,64,87,0.8) 0 2px, transparent 3px),
      radial-gradient(circle at 27% 60%, rgba(255,64,87,0.8) 0 2px, transparent 3px),
      radial-gradient(circle at 42% 43%, rgba(255,64,87,0.8) 0 2px, transparent 3px),
      radial-gradient(circle at 56% 20%, rgba(255,64,87,0.8) 0 2px, transparent 3px),
      radial-gradient(circle at 63% 72%, rgba(255,64,87,0.8) 0 2px, transparent 3px),
      radial-gradient(circle at 78% 36%, rgba(2…
}
```

---

## `.kp-road-bus`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation, transform
- **Animations:** kpBook-04-BusStraight
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-bus`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-bus`
- **CSS body (primary):**
```css
.kp-road-bus {
position: absolute;
    left: 50%;
    bottom: 1rem;
    width: 4.8rem;
    height: 2.4rem;
    border: 1px solid rgba(246,255,0,0.45);
    background: #253137;
    box-shadow: 0 0 1rem rgba(246,255,0,0.12);
    transform: translateX(-50%);
    animation: kpBook-04-BusStraight 5s ease-in-out infinite;
}
```

---

## `.kp-road-split`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-split`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-split::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-split::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-split::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-split::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-split::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-road-split::after`
- **CSS body (primary):**
```css
.kp-road-split {
content: "";
    position: absolute;
    left: 50%;
    bottom: -1rem;
    width: 3.4rem;
    height: 11rem;
    background:
      linear-gradient(90deg, transparent 47%, rgba(246,255,0,0.7) 48% 52%, transparent 53%),
      #15191c;
    border-left: 1px solid rgba(255,255,255,0.1);
    border-right: 1px solid rgba(255,255,255,0.1);
    transform-origin: bottom center;
}
```

---

## `.kp-roundabout`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-05-RoundaboutSpin
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-roundabout`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-roundabout::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-roundabout::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-roundabout`
- **CSS body (primary):**
```css
.kp-roundabout {
position: relative;
    width: min(30rem, 82vw);
    aspect-ratio: 1;
    margin: 2.6rem auto;
    border: 3.4rem solid #171d21;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px rgba(246,255,0,0.18), 0 0 3rem rgba(0,0,0,0.7);
    animation: kpBook-05-RoundaboutSpin 22s linear infinite;
}
```

---

## `.kp-route`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 2 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-01-RouteMove
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-route`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-route::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-route`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-route::before`
- **CSS body (primary):**
```css
.kp-route {
content: "";
    position: absolute;
    left: 1.1rem;
    top: -20%;
    width: 0.38rem;
    height: 140%;
    background: repeating-linear-gradient(
      180deg,
      var(--kp-yellow) 0,
      var(--kp-yellow) 1.2rem,
      transparent 1.2rem,
      transparent 2rem
    );
    box-shadow: 0 0 1rem rgba(246,255,0,0.28);
    animation: kpBook-01-RouteMove 2.8s linear infinite;
}
```

---

## `.kp-route-bus`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift .kp-route-bus`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift .kp-route-bus`
- **CSS body (primary):**
```css
.kp-route-bus {
position: absolute;
    left: 50%;
    bottom: 1.4rem;
    width: 4.2rem;
    height: 2rem;
    border: 2px solid #9bddff;
    border-radius: 0.4rem;
    background: rgba(66,147,190,0.42);
    transform: translateX(-50%);
    box-shadow: 0 0 1rem rgba(99,189,255,0.22);
}
```

---

## `.kp-route-drift`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift::after`
- **CSS body (primary):**
```css
.kp-route-drift {
content: "";
    position: absolute;
    bottom: -2rem;
    width: 4.8rem;
    height: 17rem;
    background:
      linear-gradient(90deg, transparent 47%, rgba(246,255,0,0.64) 48% 52%, transparent 53%),
      var(--kp-road);
    box-shadow: 0 0 2rem rgba(0,0,0,0.7);
    transform-origin: bottom center;
}
```

---

## `.kp-route-line`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-route-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-route-drift .kp-route-line`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-route-line`
- **CSS body (primary):**
```css
.kp-route-line {
position: absolute;
    left: 7%;
    right: 8%;
    top: 54%;
    height: 2px;
    background: linear-gradient(90deg, var(--kp-cyan), var(--kp-magenta), var(--kp-yellow));
    box-shadow: 0 0 0.9rem rgba(0,234,255,0.35);
    transform: rotate(-7deg);
}
```

---

## `.kp-route-void`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-route-void`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-route-void::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-route-void::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-route-void::before`
- **CSS body (primary):**
```css
.kp-route-void {
content: "───────────────●";
    position: absolute;
    left: 5%;
    top: 45%;
    color: var(--kp-cyan);
    font: 700 1.4rem/1 ui-monospace, monospace;
    letter-spacing: 0.1em;
    text-shadow: 0 0 0.9rem rgba(0,234,255,0.4);
}
```

---

## `.kp-scent-haze`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** kpBook-04-HazeDrift
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-scent-haze`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-scent-haze::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-scent-haze`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-scent-haze::after`
- **CSS body (primary):**
```css
.kp-scent-haze {
content: "";
    position: absolute;
    inset: -30%;
    pointer-events: none;
    background: repeating-radial-gradient(circle at 50% 50%, transparent 0 2rem, rgba(255,255,255,0.025) 2.2rem 2.35rem, transparent 2.5rem 4rem);
    animation: kpBook-04-HazeDrift 14s linear infinite;
}
```

---

## `.kp-scratch`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-scratch`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-scratch:last-child`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-scratch:last-child`
- **CSS body (primary):**
```css
.kp-scratch {
color: var(--kp-white);
    font-weight: 700;
    text-shadow: 0 0 0.8rem rgba(255,255,255,0.16);
}
```

---

## `.kp-sensor-denial`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-00-SensorDeny
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-sensor-denial`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-sensor-denial::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-sensor-denial::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-sensor-denial`
- **CSS body (primary):**
```css
.kp-sensor-denial {
position: relative;
    display: inline-block;
    color: var(--kp-cyan);
    text-shadow:
      1px 0 rgba(255, 64, 87, 0.34),
      -1px 0 rgba(78, 143, 255, 0.36),
      0 0 0.9rem rgba(0, 234, 255, 0.38);
    animation: kpBook-00-SensorDeny 4.6s steps(1, end) infinite;
}
```

---

## `.kp-service-freeze`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-service-freeze`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-service-freeze::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-service-freeze::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-service-freeze::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-service-freeze::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-service-freeze::before`
- **CSS body (primary):**
```css
.kp-service-freeze {
left: 14%; transform: rotate(-4deg);
}
```

---

## `.kp-service-unit`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-service-unit`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-service-unit`
- **CSS body (primary):**
```css
.kp-service-unit {
min-height: 9rem;
    border: 1px solid rgba(255,255,255,0.1);
    background:
      linear-gradient(145deg, rgba(255,255,255,0.08), transparent 40%),
      repeating-linear-gradient(90deg, transparent 0 1rem, rgba(255,64,87,0.08) 1.05rem 1.12rem),
      #090e10;
    box-shadow: inset 0 -2rem 2.6rem rgba(0,0,0,0.7);
}
```

---

## `.kp-shaft`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-00-ShaftDrop
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-shaft`, `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-shaft::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-shaft::before`
- **CSS body (primary):**
```css
.kp-shaft {
content: "";
    position: absolute;
    left: 0.45rem;
    top: -40%;
    width: 1px;
    height: 180%;
    background: linear-gradient(180deg, transparent, var(--kp-cyan), transparent);
    opacity: 0.55;
    animation: kpBook-00-ShaftDrop 3.8s linear infinite;
}
```

---

## `.kp-shoe`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-shoe`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-shoe`
- **CSS body (primary):**
```css
.kp-shoe {
display: inline-block;
    margin: 0 0.2rem;
    padding: 0.08rem 0.44rem;
    color: #b9caff;
    border-bottom: 1px solid rgba(185,202,255,0.45);
    text-shadow: 0 0 0.55rem rgba(185,202,255,0.2);
}
```

---

## `.kp-shrinkwrap`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-shrinkwrap`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-shrinkwrap::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-shrinkwrap::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-shrinkwrap::before`
- **CSS body (primary):**
```css
.kp-shrinkwrap {
content: "BIOLOGICKÝ OBJEKT / NEÚPLNÉ BALENÍ";
    position: absolute;
    left: 50%;
    top: 1rem;
    transform: translateX(-50%);
    color: rgba(255,255,255,0.72);
    font: 700 0.78rem/1.2 ui-monospace, monospace;
    letter-spacing: 0.12em;
}
```

---

## `.kp-silence-field`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-10-SignalsFade
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-silence-field`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-silence-field::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-silence-field::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-silence-field::before`
- **CSS body (primary):**
```css
.kp-silence-field {
content: "";
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(90deg, transparent 0 8%, rgba(0,234,255,0.045) 8.1% 8.25%, transparent 8.35% 15%),
      repeating-linear-gradient(180deg, transparent 0 1.55rem, rgba(255,255,255,0.018) 1.6rem 1.65rem);
    animation: kpBook-10-SignalsFade 12s ease-in-out infinite alternate;
}
```

---

## `.kp-simple-route`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-simple-route`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-simple-route::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-simple-route > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_05_OBJIZDKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="05"] .kp-simple-route::after`
- **CSS body (primary):**
```css
.kp-simple-route {
content: "→";
    position: absolute;
    right: 1rem;
    top: 50%;
    color: rgba(114,255,166,0.18);
    font: 900 7rem/1 sans-serif;
    transform: translateY(-50%);
}
```

---

## `.kp-site`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-site`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-site::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-site::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-site::before`
- **CSS body (primary):**
```css
.kp-site {
content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 1.1rem;
    height: 88%;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #20252a, #69757d 45%, #14191d 52% 100%);
    box-shadow: 0 0 1.2rem rgba(255,255,255,0.04);
}
```

---

## `.kp-smartband`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-02-GoalCelebrate
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-smartband`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-smartband`
- **CSS body (primary):**
```css
.kp-smartband {
display: block;
    width: min(22rem, 90%);
    margin: 1.2rem auto;
    padding: 0.8rem;
    color: var(--kp-green);
    text-align: center;
    border: 1px solid rgba(105,255,159,0.3);
    background: rgba(105,255,159,0.035);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.08em;
    animation: kpBook-02-GoalCelebrate 3s ease-in-out infinite;
}
```

---

## `.kp-stairs`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-stairs`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-stairs::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-stairs::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-stairs::before`
- **CSS body (primary):**
```css
.kp-stairs {
content: "";
    position: absolute;
    left: 20%;
    right: 20%;
    top: 8%;
    bottom: -10%;
    transform: perspective(28rem) rotateX(57deg);
    transform-origin: 50% 0;
    background:
      repeating-linear-gradient(
        180deg,
        rgba(140,149,153,0.8) 0 0.85rem,
        rgba(25,28,30,0.9) 0.85rem 1.35rem
      );
    border-left: 0.18rem solid #343a3d;
    border-right: 0.18rem solid #343a3d;
    box-shadow: 0 0 3rem rgba(0,0,0,0.85);
}
```

---

## `.kp-stairwell`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-stairwell`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-stairwell::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-stairwell`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-stairwell`
- **CSS body (primary):**
```css
.kp-stairwell {
position: relative;
    margin: 2rem 0;
    padding: 1.5rem 1.55rem;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.025), transparent),
      #020608;
    border-left: 1px solid rgba(255,255,255,0.18);
    box-shadow: inset 0 -4rem 5rem rgba(0,0,0,0.62);
}
```

---

## `.kp-steam`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter
- **Animations:** kpBook-12-steam-rise
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-steam`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-steam::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-steam::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-steam::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-steam::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-steam::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-steam::after`
- **CSS body (primary):**
```css
.kp-steam {
content: "";
    position: absolute;
    bottom: -30%;
    width: 34%;
    aspect-ratio: 1;
    border-radius: 50%;
    background: rgba(225,247,255,0.16);
    filter: blur(12px);
    animation: kpBook-12-steam-rise 4.5s ease-in-out infinite;
}
```

---

## `.kp-stop-timer`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-stop-timer`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-stop-timer`
- **CSS body (primary):**
```css
.kp-stop-timer {
margin: 1.8rem auto;
    max-width: 34rem;
    padding: 0.95rem;
    color: var(--kp-yellow);
    text-align: center;
    border: 1px solid rgba(246,255,0,0.27);
    background: rgba(40,43,0,0.25);
    font: clamp(1rem, 3vw, 1.65rem)/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.11em;
    text-shadow: 0 0 1rem rgba(246,255,0,0.28);
}
```

---

## `.kp-streams`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-13-stream-flow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-streams`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-streams::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-streams::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-streams::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-streams::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-streams::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-streams::after`
- **CSS body (primary):**
```css
.kp-streams {
content: "";
    position: absolute;
    inset: -30%;
    background: repeating-linear-gradient(118deg, transparent 0 2.7rem, rgba(0,236,255,0.16) 2.8rem 2.9rem, transparent 3rem 5.7rem);
    animation: kpBook-13-stream-flow 7s linear infinite;
}
```

---

## `.kp-substation`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-16-voltage
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-substation`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-substation::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-substation::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-substation::before`
- **CSS body (primary):**
```css
.kp-substation {
content: "";
    position: absolute;
    left: 12%;
    right: 12%;
    top: 18%;
    height: 0.5rem;
    background: linear-gradient(90deg, rgba(246,255,0,0.22), rgba(0,236,255,0.75), rgba(246,255,0,0.22));
    box-shadow:
      0 7rem 0 rgba(0,236,255,0.25),
      0 14rem 0 rgba(246,255,0,0.18),
      0 0 2rem rgba(0,236,255,0.55);
    animation: kpBook-16-voltage 1.5s ease-in-out infinite alternate;
}
```

---

## `.kp-support-desk`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-support-desk`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-support-desk::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-support-desk`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-support-desk::before`
- **CSS body (primary):**
```css
.kp-support-desk {
content: "";
    position: absolute;
    left: 15%;
    right: 15%;
    bottom: 18%;
    height: 4.5rem;
    border: 1px solid rgba(215,191,142,0.25);
    background: #2b261d;
    box-shadow: 0 -8rem 0 -3.6rem rgba(0,236,255,0.18);
}
```

---

## `.kp-support-expired`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-support-expired`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-support-expired::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-support-expired > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-support-expired`
- **CSS body (primary):**
```css
.kp-support-expired {
position: relative;
    margin: 2rem 0;
    padding: 1.4rem 1.3rem;
    border: 1px solid rgba(255,255,255,0.15);
    background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(0,0,0,0.45));
    box-shadow: 0 0 2.5rem rgba(0,0,0,0.42);
    overflow: hidden;
}
```

---

## `.kp-synthoma-influx`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-14-flicker
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-synthoma-influx`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-synthoma-influx::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-synthoma-influx::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-synthoma-influx::after`
- **CSS body (primary):**
```css
.kp-synthoma-influx {
content: "DVEŘE SE OTEVÍRAJÍ";
    position: absolute;
    left: 0;
    right: 0;
    top: 1.3rem;
    color: var(--kp-magenta);
    text-align: center;
    font: 0.9rem/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.15em;
    text-shadow: 0 0 1.2rem rgba(255,59,223,0.42);
    animation: kpBook-14-flicker 1.1s steps(2,end) infinite;
}
```

---

## `.kp-synthoma-mark`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-00-MarkWake
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-synthoma-mark`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-synthoma-mark`
- **CSS body (primary):**
```css
.kp-synthoma-mark {
display: inline-block;
    color: var(--kp-white);
    text-shadow:
      0 0 0.8rem rgba(255,255,255,0.5),
      0 0 2.4rem rgba(0,234,255,0.24);
    animation: kpBook-00-MarkWake 5s ease-in-out infinite;
}
```

---

## `.kp-terminal`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 260 occurrences across 19 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"] .kp-terminal::after`, `.kp-chapter[data-book="konec-podpory"] .kp-terminal > *`, `.kp-chapter[data-book="konec-podpory"] .kp-terminal::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="00"] .kp-terminal`
- **CSS body (primary):**
```css
.kp-terminal {
position: relative;
    margin: 1.75rem 0;
    padding: 1rem 1.15rem;
    border: 1px solid rgba(0, 234, 255, 0.28);
    border-left: 3px solid var(--kp-cyan);
    background: linear-gradient(135deg, rgba(0, 234, 255, 0.055), rgba(0, 0, 0, 0.3));
    box-shadow: inset 0 0 2.5rem rgba(0, 234, 255, 0.025);
}
```

---

## `.kp-ticket-storm`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** kpBook-02-TicketsRise
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-ticket-storm`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-ticket-storm::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-ticket-storm > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-ticket-storm::after`
- **CSS body (primary):**
```css
.kp-ticket-storm {
content: "18442  19007  21131  24882  30194  43811";
    position: absolute;
    right: -1rem;
    top: 0.3rem;
    color: rgba(255,64,87,0.11);
    font: 900 clamp(1rem, 4vw, 2.4rem)/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    writing-mode: vertical-rl;
    letter-spacing: 0.08em;
    animation: kpBook-02-TicketsRise 5s steps(6,end) infinite;
}
```

---

## `.kp-tova-fragment`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-02-TovaFragment
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-tova-fragment`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-tova-fragment`
- **CSS body (primary):**
```css
.kp-tova-fragment {
color: var(--kp-white);
    font-weight: 800;
    letter-spacing: 0.28em;
    text-shadow: 0 0 1rem rgba(0,234,255,0.4);
    animation: kpBook-02-TovaFragment 3.8s steps(1,end) infinite;
}
```

---

## `.kp-tova-protocol`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 5 occurrences across 2 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-01-ProtocolWake
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-tova-protocol`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-tova-protocol`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-tova-protocol strong`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-tova-protocol`
- **CSS body (primary):**
```css
.kp-tova-protocol {
color: var(--kp-white);
    font-weight: 800;
    letter-spacing: 0.2em;
    text-shadow:
      0 0 0.8rem rgba(0,234,255,0.45),
      0 0 2rem rgba(78,140,255,0.2);
    animation: kpBook-01-ProtocolWake 4.8s ease-in-out infinite;
}
```

---

## `.kp-tova-ring`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-12-ring-breathe
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-tova-ring`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-tova-ring::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-tova-ring`
- **CSS body (primary):**
```css
.kp-tova-ring {
position: relative;
    width: min(19rem, 74vw);
    aspect-ratio: 1;
    margin: 2.4rem auto;
    border-radius: 50%;
    border: 1px solid rgba(0,236,255,0.3);
    background:
      conic-gradient(
        from -90deg,
        var(--kp-cyan) 0 17%,
        transparent 17% 20%,
        var(--kp-green) 20% 37%,
        transparent 37% 40%,
        var(--kp-yellow) 40% 57%,
        transparent 57% 60%,
        var(--kp-magenta) 60% 77%,
        transparent 77% 80%,
        var(--kp-red) 80% 97%,
        transparent 97% 100%
      );
    box-shadow:
      0 0 2rem rgba(0,236,255,0.13),
      ins…
}
```

---

## `.kp-tower`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower::before`
- **CSS body (primary):**
```css
.kp-tower {
content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 3rem;
    height: 20rem;
    transform: translateX(-50%);
    border: 1px solid rgba(180,194,204,0.25);
    background: linear-gradient(90deg, #05070a, #222a30 48%, #07090c 52%, #030405);
    clip-path: polygon(35% 0, 65% 0, 100% 100%, 0 100%);
    box-shadow: 0 0 2rem rgba(0,0,0,0.9);
}
```

---

## `.kp-tower-ring`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** animation, transform
- **Animations:** kpBook-09-RingTurn
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring.r1`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring.r2`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring`
- **CSS body (primary):**
```css
.kp-tower-ring {
position: absolute;
    left: 50%;
    width: 10rem;
    height: 2.8rem;
    border: 1px solid rgba(0,234,255,0.25);
    border-radius: 50%;
    transform: translateX(-50%) rotateX(68deg);
    animation: kpBook-09-RingTurn 8s linear infinite;
}
```

---

## `.kp-training-loop`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-03-TrainingBlink
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-training-loop`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-training-loop span`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-training-loop span:nth-child(2)`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-training-loop span`
- **CSS body (primary):**
```css
.kp-training-loop {
min-height: 2.6rem;
    border: 1px solid rgba(105,255,159,0.15);
    background:
      radial-gradient(circle at 50% 35%, rgba(105,255,159,0.15) 0 0.28rem, transparent 0.3rem),
      linear-gradient(180deg, transparent 0 55%, rgba(105,255,159,0.08) 56% 100%);
    animation: kpBook-03-TrainingBlink 7s steps(1,end) infinite;
}
```

---

## `.kp-transfer`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter
- **Animations:** kpBook-18-transfer-spin
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-transfer`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-transfer::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-transfer::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-transfer::before`
- **CSS body (primary):**
```css
.kp-transfer {
content: "";
    position: absolute;
    inset: 8%;
    background:
      conic-gradient(from 0deg,
        rgba(0,236,255,0.2),
        rgba(255,120,216,0.17),
        rgba(255,201,40,0.15),
        rgba(156,255,199,0.15),
        rgba(216,167,255,0.17),
        rgba(0,236,255,0.2));
    border-radius: 50%;
    filter: blur(1.4rem);
    opacity: 0.38;
    animation: kpBook-18-transfer-spin 8s linear infinite;
}
```

---

## `.kp-truth-broadcast`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-truth-broadcast`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-truth-broadcast::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-truth-broadcast::before`
- **CSS body (primary):**
```css
.kp-truth-broadcast {
content: "ZNEPOKOJUJÍCÍ REALITA";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: rgba(255,255,255,0.8);
    font: clamp(1rem, 4vw, 2rem)/1.5 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.14em;
    text-shadow: 0 0 1rem rgba(255,255,255,0.25);
}
```

---

## `.kp-tunnel`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-tunnel`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-tunnel::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-tunnel`
- **CSS body (primary):**
```css
.kp-tunnel {
position: relative;
    margin: 2rem 0;
    padding: 1.5rem 1.6rem;
    background:
      repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0, rgba(255,255,255,0.018) 3rem, transparent 3rem, transparent 6rem),
      linear-gradient(90deg, #020506, #071116 50%, #020506);
    border-top: 1px solid rgba(255,255,255,0.12);
    border-bottom: 1px solid rgba(255,255,255,0.12);
    box-shadow: inset 0 0 5rem rgba(0,0,0,0.72);
}
```

---

## `.kp-uniform-light`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-uniform-light`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_06_PECE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="06"] .kp-uniform-light`
- **CSS body (primary):**
```css
.kp-uniform-light {
position: relative;
    margin: 2rem 0;
    padding: 1.4rem;
    border: 1px solid rgba(189,239,255,0.24);
    background:
      repeating-linear-gradient(90deg, rgba(189,239,255,0.05) 0 8rem, rgba(255,255,255,0.015) 8rem 8.2rem),
      linear-gradient(180deg, rgba(189,239,255,0.07), rgba(0,0,0,0.44));
    box-shadow: inset 0 0 4rem rgba(189,239,255,0.035);
}
```

---

## `.kp-user-1024`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024 .kp-id`, `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024 .kp-wait`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024`
- **CSS body (primary):**
```css
.kp-user-1024 {
margin: 2.4rem 0;
    padding: 1.5rem;
    border: 1px solid rgba(75,140,255,0.35);
    background: #010408;
    box-shadow: 0 0 2.8rem rgba(75,140,255,0.08), inset 0 0 3rem rgba(75,140,255,0.025);
}
```

---

## `.kp-valve`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-12-valve-stuck
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-valve`, `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-valve::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-valve`
- **CSS body (primary):**
```css
.kp-valve {
position: relative;
    width: min(15rem, 62vw);
    aspect-ratio: 1;
    margin: 2rem auto;
    border-radius: 50%;
    border: 1.25rem solid #7a211f;
    box-shadow:
      inset 0 0 0 0.32rem #2d0808,
      0 0 0 0.26rem #a4493f,
      0 0 1.6rem rgba(255,64,87,0.12);
    background:
      linear-gradient(45deg, transparent 46%, #963b35 47% 53%, transparent 54%),
      linear-gradient(-45deg, transparent 46%, #963b35 47% 53%, transparent 54%),
      radial-gradient(circle, #2f1110 0 19%, #781f1c 20% 33%, transparent 34%);
    animation: kpBook-12-valve-stuck 4s ease-in-out infinite;
}
```

---

## `.kp-vanta-face`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-18-vanta-stabilize
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-vanta-face`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-vanta-face::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-vanta-face::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-vanta-face::before`
- **CSS body (primary):**
```css
.kp-vanta-face {
content: "FELIX VANTA";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--kp-vanta-gold);
    font: clamp(1.8rem, 7vw, 5rem)/1 sans-serif;
    letter-spacing: 0.14em;
    text-shadow: 0 0 1.4rem rgba(255,213,139,0.42);
    animation: kpBook-18-vanta-stabilize 4s steps(4,end) infinite;
}
```

---

## `.kp-vanta-suite`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-vanta-suite`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-vanta-suite::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-vanta-suite > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-vanta-suite`
- **CSS body (primary):**
```css
.kp-vanta-suite {
position: relative;
    margin: 2.2rem 0;
    padding: 1.55rem;
    border: 1px solid rgba(255,213,139,0.34);
    background:
      radial-gradient(circle at 50% 12%, rgba(255,224,163,0.13), transparent 35%),
      radial-gradient(circle at 20% 70%, rgba(216,167,255,0.12), transparent 40%),
      linear-gradient(135deg, rgba(216,167,255,0.08), rgba(0,0,0,0.55));
    box-shadow: 0 0 2.7rem rgba(216,167,255,0.065);
    overflow: hidden;
}
```

---

## `.kp-verification`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 3 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-verification`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-verification p`, `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-verification`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="11"] .kp-verification`
- **CSS body (primary):**
```css
.kp-verification {
position: relative;
    margin: 2.3rem 0;
    padding: 1.4rem;
    border: 1px solid rgba(246,255,0,0.28);
    background:
      radial-gradient(circle at 50% 0, rgba(246,255,0,0.07), transparent 16rem),
      rgba(0,0,0,0.78);
    box-shadow: 0 0 1.5rem rgba(246,255,0,0.05);
}
```

---

## `.kp-void`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-void`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-void::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-void::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-void`
- **CSS body (primary):**
```css
.kp-void {
position: relative;
    margin: 2.5rem 0;
    min-height: 38rem;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.65);
    background:
      radial-gradient(circle at 50% 46%, rgba(255,255,255,1), rgba(255,255,255,0.97) 24%, rgba(246,248,249,0.98) 55%, rgba(226,231,233,0.98) 100%);
    box-shadow:
      0 0 5rem rgba(255,255,255,0.18),
      inset 0 0 8rem rgba(0,0,0,0.04);
}
```

---

## `.kp-wait`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 3 occurrences across 3 files
- **Effect properties:** animation
- **Animations:** kpBook-02-WaitBlink
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024 .kp-wait`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-id,
.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-wait`, `.kp-chapter[data-book="konec-podpory"][data-chapter="03"] .kp-wait`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_02_VOLNY_PAD.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_03_PODPORA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="02"] .kp-user-1024 .kp-wait`
- **CSS body (primary):**
```css
.kp-wait {
display: block;
    margin-top: 0.8rem;
    color: var(--kp-red);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    animation: kpBook-02-WaitBlink 4s steps(1,end) infinite;
}
```

---

## `.kp-waiting`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** kpBook-17-wait
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-waiting`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-waiting::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-waiting::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="17"] .kp-waiting::before`
- **CSS body (primary):**
```css
.kp-waiting {
content: "...";
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--kp-null);
    font: clamp(4rem, 18vw, 10rem)/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.28em;
    text-shadow: 0 0 2rem rgba(0,246,255,0.55);
    animation: kpBook-17-wait 2.7s steps(4,end) infinite;
}
```

---

## `.kp-wall`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 4 occurrences across 3 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-wall`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-wall::before`, `}

  .kp-chapter[data-book="konec-podpory"][data-chapter="10"] .kp-wall`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_10_TICHO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-wall`
- **CSS body (primary):**
```css
.kp-wall {
position: relative;
    margin: 2rem 0;
    padding: 1.6rem 1.4rem;
    border: 1px solid rgba(196,210,216,0.22);
    border-left: 5px solid #8ea0a6;
    background:
      repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 15px),
      linear-gradient(135deg, rgba(147,160,167,0.08), rgba(0,0,0,0.5));
    box-shadow: inset 0 0 3rem rgba(0,0,0,0.45);
    overflow: hidden;
}
```

---

## `.kp-weight-scan`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** kpBook-07-WeightScan
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-weight-scan`, `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-weight-scan::before`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_07_ZASILKA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="07"] .kp-weight-scan::before`
- **CSS body (primary):**
```css
.kp-weight-scan {
content: "";
    position: absolute;
    left: -20%;
    top: 0;
    bottom: 0;
    width: 22%;
    background: linear-gradient(90deg, transparent, rgba(111,198,255,0.22), transparent);
    animation: kpBook-07-WeightScan 4s ease-in-out infinite;
}
```

---

## `.kp-whisper`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-family-signal .kp-whisper`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="01"] .kp-family-signal .kp-whisper`
- **CSS body (primary):**
```css
.kp-whisper {
margin-top: 1.35rem;
    color: var(--kp-white);
    font-size: 1.18rem;
    text-shadow: 0 0 1.2rem rgba(78,140,255,0.4);
}
```

---

## `.kp-white-room`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogSystem`, `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogT,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogNeon,
.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room .dialogSystem`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="13"] .kp-white-room`
- **CSS body (primary):**
```css
.kp-white-room {
margin: 2.2rem 0;
    padding: 2rem 1.4rem;
    min-height: 24rem;
    color: #172025;
    background:
      radial-gradient(circle at 50% 34%, rgba(255,255,255,1), rgba(229,245,249,0.97) 42%, rgba(190,222,229,0.9) 100%);
    border: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 0 4rem rgba(198,248,255,0.14), inset 0 0 5rem rgba(255,255,255,0.65);
}
```

---

## `.kp-window-message`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 6 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-window-message`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-window-message.is-danger`, `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-window-message.is-cyan`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_08_DOMOV.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="08"] .kp-window-message`
- **CSS body (primary):**
```css
.kp-window-message {
min-height: 5.4rem;
    display: grid;
    place-items: center;
    padding: 0.8rem;
    border: 1px solid rgba(255,201,120,0.24);
    background: linear-gradient(180deg, rgba(255,201,120,0.095), rgba(0,0,0,0.35));
    color: var(--kp-white);
    text-align: center;
    font: 700 0.88rem/1.45 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.06em;
    box-shadow: inset 0 0 1.8rem rgba(255,201,120,0.035);
}
```

---

## `.kp-workshop`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-workshop`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-workshop::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-workshop > *`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_04_KOMFORTNI_ZONA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="04"] .kp-workshop::before`
- **CSS body (primary):**
```css
.kp-workshop {
content: "WORKSHOP";
    position: absolute;
    right: 0.8rem;
    bottom: 0.4rem;
    color: rgba(213,189,138,0.045);
    font: 900 clamp(2.8rem, 8vw, 7rem)/1 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    letter-spacing: 0.12em;
    transform: rotate(-4deg);
    pointer-events: none;
}
```

---

## `.kp-world-nodes`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-world-nodes`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-world-nodes::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-world-nodes::after`, `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-world-nodes::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-world-nodes::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-world-nodes::before,
.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-world-nodes::after`
- **CSS body (primary):**
```css
.kp-world-nodes {
content: "";
    position: absolute;
    left: 18%;
    top: 34%;
    width: 61%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--kp-cyan), transparent);
    transform: rotate(18deg);
    box-shadow: 0 0 0.8rem rgba(0,234,255,0.45);
}
```

---

## `.kp-yellow-lever`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation, transform
- **Animations:** kpBook-16-lever-wait
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-yellow-lever`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-yellow-lever::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-yellow-lever::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="16"] .kp-yellow-lever::before`
- **CSS body (primary):**
```css
.kp-yellow-lever {
content: "";
    position: absolute;
    left: calc(50% - 0.8rem);
    bottom: 16%;
    width: 1.6rem;
    height: 58%;
    border-radius: 0.7rem;
    background: linear-gradient(90deg, #a5a900, #f6ff00 46%, #7e8300);
    box-shadow: 0 0 2rem rgba(246,255,0,0.45);
    transform-origin: 50% 90%;
    transform: rotate(-24deg);
    animation: kpBook-16-lever-wait 2.4s ease-in-out infinite alternate;
}
```

---

## `.kp-yellow-line`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** kpBook-18-line-draw
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-line`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-line::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-line::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-line::before`
- **CSS body (primary):**
```css
.kp-yellow-line {
content: "";
    position: absolute;
    left: 4%;
    right: 4%;
    bottom: 34%;
    height: 0.44rem;
    background: linear-gradient(90deg, transparent, var(--kp-milo) 5%, var(--kp-milo) 95%, transparent);
    clip-path: polygon(0 36%, 25% 36%, 34% 0, 44% 0, 53% 36%, 69% 36%, 77% 82%, 86% 82%, 92% 36%, 100% 36%, 100% 64%, 92% 64%, 86% 100%, 77% 100%, 69% 64%, 53% 64%, 44% 28%, 34% 28%, 25% 64%, 0 64%);
    box-shadow: 0 0 0.8rem rgba(255,201,40,0.45);
    animation: kpBook-18-line-draw 4s ease-out infinite alternate;
}
```

---

## `.kp-yellow-route`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-route`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-route::before`, `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-route::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_18_KONEC_PODPORY.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="18"] .kp-yellow-route::before`
- **CSS body (primary):**
```css
.kp-yellow-route {
content: "";
    position: absolute;
    left: 4%;
    right: 4%;
    bottom: 18%;
    height: 0.48rem;
    background: linear-gradient(90deg, transparent, var(--kp-milo) 6%, var(--kp-milo) 93%, transparent);
    box-shadow: 0 0 1.2rem rgba(255,201,40,0.35);
    clip-path: polygon(0 36%, 27% 36%, 35% 0, 45% 0, 52% 36%, 68% 36%, 76% 82%, 85% 82%, 91% 36%, 100% 36%, 100% 64%, 91% 64%, 85% 100%, 76% 100%, 68% 64%, 52% 64%, 45% 28%, 35% 28%, 27% 64%, 0 64%);
}
```

---

## `.landing-intro-page`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, animation, transform
- **Animations:** glitch
- **Selectors (sample):** `}
  
  /* Home page + Landing Intro – sjednoceno 1:1. */
  .home-page #glitch-synthoma.glitch-master,
  .landing-intro-page #glitch-synthoma.glitch-master`, `.home-page #glitch-synthoma .glitch-fake1, .home-page #glitch-synthoma .glitch-fake2,
  .landing-intro-page #glitch-synthoma .glitch-fake1, .landing-intro-page #glitch-synthoma .glitch-fake2`, `.home-page #glitch-synthoma .glitch-fake1, .home-page #glitch-synthoma .glitch-fake2,
  .landing-intro-page #glitch-synthoma .glitch-fake1, .landing-intro-page #glitch-synthoma .glitch-fake2`
- **Selector:** `}
  
  /* Home page + Landing Intro – sjednoceno 1:1. */
  .home-page #glitch-synthoma.glitch-master,
  .landing-intro-page #glitch-synthoma.glitch-master`
- **CSS body (primary):**
```css
.landing-intro-page {
color: var(--text-primary);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    position: relative;
    text-align: center;
    margin: 0.5rem 0;
    z-index: 10;
    -webkit-user-select: none; -moz-user-select: none; user-select: none;
    text-shadow:
      0 0 6px var(--glow-secondary),
      0 0 16px var(--glow-primary),
      0 0 36px var(--glow-secondary),
      2px 2px 12px var(--glow-primary);
    animation: glitch 1.2s infinite linear alternate-reverse;
    will-change: transform, text-shadow;
    font-family: 'Synthoma', monospace;
}
```

---

## `.legal-footer-link`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.legal-footer-link`, `.legal-footer-link:hover`
- **Selector:** `.legal-footer-link`
- **CSS body (primary):**
```css
.legal-footer-link {
font-size: .62rem;
  letter-spacing: .08em;
  color: var(--text-secondary);
  text-decoration: none;
  opacity: .45;
  transition: opacity .15s;
}
```

---

## `.lib-badge`

- **Status:** defined
- **CSS files:** app\books\books.module.css, src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.lib-badge`, `.libListReset :global(.lib-badge),
.libListReset .lib-badge`, `.libListReset :global(.lib-badge),
.libListReset .lib-badge`
- **Selector:** `.lib-badge`
- **CSS body (primary):**
```css
.lib-badge {
opacity: .6; margin-left: 6px; font-size: .9em;
}
```

---

## `.lib-badge--locked`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.lib-badge--locked`
- **Selector:** `.lib-badge--locked`
- **CSS body (primary):**
```css
.lib-badge--locked {
flex-shrink: 0;
  font-size: .68rem;
  letter-spacing: .1em;
  font-family: var(--font-mono, monospace);
  color: var(--accent-secondary, rgba(255,200,60,.8));
  white-space: nowrap;
  opacity: .85;
}
```

---

## `.lib-bg`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.lib-bg`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-bg`
- **CSS body (primary):**
```css
.lib-bg {
position: fixed; inset: 0; z-index: -2; pointer-events: none;
}
```

---

## `.lib-bg-video`

- **Status:** defined
- **CSS files:** src\styles\effects.css, src\styles\motion-contract.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.lib-bg-video`, `:root[data-background-motion="off"] .synthoma-media-layer__video,
:root[data-background-motion="off"] .video-background video,
:root[data-background-motion="off"] .lib-bg-video,
:root[data-background-motion="off"] .chapter-background__video,
:root[data-background-motion="off"] .cyklus-menu__video,
:root[data-background-motion="off"] #retro-video-canvas`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-bg-video`
- **CSS body (primary):**
```css
.lib-bg-video {
width: 100%; height: 100%; object-fit: cover;
}
```

---

## `.lib-bg-vignette`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.lib-bg-vignette`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-bg-vignette`
- **CSS body (primary):**
```css
.lib-bg-vignette {
position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 20%, rgba(0,0,0,0.25), rgba(0,0,0,0.65));
}
```

---

## `.lib-grid`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 2 occurrences across 1 files
- **Selectors (sample):** `.lib-grid`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-grid`
- **CSS body (primary):**
```css
.lib-grid {
margin-top: 16px;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
}
```

---

## `.lib-link`

- **Status:** defined
- **CSS files:** app\books\books.module.css, src\styles\components.css, src\styles\effects.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow, box-shadow, transition, transform, color-mix
- **Selectors (sample):** `.lib-link .lib-link-title`, `.lib-link`, `button.lib-link`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-link`
- **CSS body (primary):**
```css
.lib-link {
display: inline-block;
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid var(--border-secondary, rgba(255,255,255,0.15));
  background: color-mix(in oklab, var(--bg-glass, rgba(255,255,255,0.06)) 100%, transparent);
  color: var(--text-primary) ; text-decoration: none;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  text-shadow: 0 0 4px var(--text-secondary, rgba(0,255,255,.3));
  transition: border-color .18s ease, box-shadow .18s ease, transform .12s ease, filter .18s ease, background .18s ease;
  box-shadow: 0 0 0 0 transparent;
  position: relative;
  over…
}
```

---

## `.lib-link--locked`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, filter, transform
- **Selectors (sample):** `}

/* ── lib-link locked state ──────────────────────────────────────────────── */
/* ChapterLockModal uses paywall-* classes defined above */
.lib-link--locked`, `.lib-link--locked:hover`, `.lib-link--locked .lib-link-title`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-link--locked:hover`
- **CSS body (primary):**
```css
.lib-link--locked {
transform: none !important; filter: none !important; box-shadow: none !important;
}
```

---

## `.lib-link-title`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 2 occurrences across 1 files
- **Selectors (sample):** `.lib-link--locked .lib-link-title`, `.lib-link .lib-link-title`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-link--locked .lib-link-title`
- **CSS body (primary):**
```css
.lib-link-title {
flex: 1;
  min-width: 0;
  text-decoration: line-through !important;
  text-decoration-color: rgba(255,255,255,.35) !important;
  text-decoration-thickness: 1px !important;
}
```

---

## `.lib-list`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.lib-list`, `.lib-list li`
- **Selector:** `.lib-list`
- **CSS body (primary):**
```css
.lib-list {
margin-top: 10px; display: grid; gap: 10px; list-style: none; padding: 0;
}
```

---

## `.lib-note`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `/* Library note (progress hint under card titles) */
  .lib-note`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `/* Library note (progress hint under card titles) */
  .lib-note`
- **CSS body (primary):**
```css
.lib-note {
font-family: 'Text01', monospace;
    font-size: .95rem;
    line-height: 1.2;
    color: var(--text-secondary);
    opacity: .92;
    margin: .15rem 0 0 0;
    padding: 0;
    text-shadow: 0 0 3px var(--glow-secondary);
    display: inline-block;
    font-variant-numeric: tabular-nums; /* nicer alignment for (0%) etc. */
    letter-spacing: .01em;
}
```

---

## `.lib-pixel-canvas`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `/* Pixelation canvas – nad video, pod content. */
.lib-pixel-canvas`
- **Selector:** `/* Pixelation canvas – nad video, pod content. */
.lib-pixel-canvas`
- **CSS body (primary):**
```css
.lib-pixel-canvas {
position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: var(--retro-canvas-opacity, 0.6);
  image-rendering: pixelated;
}
```

---

## `.lib-section`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.lib-section`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.lib-section`
- **CSS body (primary):**
```css
.lib-section {
border: 1px solid var(--border-tertiary, rgba(255,255,255,0.15));
  border-radius: 12px;
  padding: 16px;
  background: color-mix(in oklab, var(--bg-glass, rgba(255,255,255,0.06)) 100%, transparent);
  box-shadow: 0 0 18px color-mix(in oklab, var(--shadow-primary, #0ff) 16%, transparent) inset;
}
```

---

## `.lib-section-title`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.lib-section-title`
- **Selector:** `.lib-section-title`
- **CSS body (primary):**
```css
.lib-section-title {
font-size: 20px; font-weight: 700; margin: 0;
}
```

---

## `.library-article`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `/* Library panels – no backdrop-filter (expensive with many children) */
.library-page .library-article.os-surface--glass`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `/* Library panels – no backdrop-filter (expensive with many children) */
.library-page .library-article.os-surface--glass`
- **CSS body (primary):**
```css
.library-article {
-webkit-backdrop-filter: none;
  backdrop-filter: none;
  background: rgba(var(--bg-secondary-rgb, 10,10,12), 0.72);
  border-radius: 0;
  box-shadow: var(--shadow-glow, 0 0 12px rgba(0,255,255,.25));
}
```

---

## `.library-book-card`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.library-book-card`, `.library-book-card.os-surface`, `.library-book-card:hover`
- **Usage sample:**
  - `src\components\library\LibraryBookCard.tsx`
- **Selector:** `.library-book-card`
- **CSS body (primary):**
```css
.library-book-card {
display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  text-align: left;
  padding: var(--os-space-4);
  font: inherit;
  color: var(--os-text);
  background: var(--os-surface);
  border: var(--os-border-width) solid var(--os-border);
  border-radius: var(--os-corner);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s;
}
```

---

## `.library-chapter-list__item`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.library-chapter-list__item`, `.library-chapter-list__item:has(.library-chapter-list__row:hover)`
- **Usage sample:**
  - `src\components\library\LibraryChapterList.tsx`
- **Selector:** `.library-chapter-list__item`
- **CSS body (primary):**
```css
.library-chapter-list__item {
border: var(--os-border-width) solid var(--os-border);
  border-radius: var(--os-corner);
  overflow: hidden;
  transition: border-color 0.15s;
}
```

---

## `.library-chapter-list__row`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.library-chapter-list__item:has(.library-chapter-list__row:hover)`, `.library-chapter-list__row`, `.library-chapter-list__row:hover`
- **Usage sample:**
  - `src\components\library\LibraryChapterList.tsx`
- **Selector:** `.library-chapter-list__row`
- **CSS body (primary):**
```css
.library-chapter-list__row {
display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 0.15rem var(--os-space-3);
  align-items: start;
  width: 100%;
  min-width: 0;
  padding: var(--os-space-3);
  background: var(--os-surface);
  color: var(--os-text);
  text-decoration: none;
  text-align: left;
  font: inherit;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
```

---

## `.library-cover-dialog__cover`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.library-cover-dialog__cover`, `.library-cover-dialog__cover`
- **Usage sample:**
  - `src\components\library\LibraryCoverDialog.tsx`
- **Selector:** `.library-cover-dialog__cover`
- **CSS body (primary):**
```css
.library-cover-dialog__cover {
width: 100%;
  max-width: 220px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: var(--os-corner);
  box-shadow: 0 0 24px color-mix(in srgb, var(--os-accent-primary) 35%, transparent);
}
```

---

## `.library-page`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** none
- **Selectors (sample):** `}

/* =========================
   Library Page (Knihovna) – nová sekce, sjednocena s efekty.
   ========================= */
.library-page .library-container`, `/* Library heading – disable infinite fake-layer animations (GPU cost) */
.library-page #glitch-library .glitch-fake1,
.library-page #glitch-library .glitch-fake2`, `/* Library heading – disable infinite fake-layer animations (GPU cost) */
.library-page #glitch-library .glitch-fake1,
.library-page #glitch-library .glitch-fake2`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `/* Library heading – disable infinite fake-layer animations (GPU cost) */
.library-page #glitch-library .glitch-fake1,
.library-page #glitch-library .glitch-fake2`
- **CSS body (primary):**
```css
.library-page {
animation: none !important;
}
```

---

## `.library-title`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.library-title`
- **Selector:** `.library-title`
- **CSS body (primary):**
```css
.library-title {
font-weight: 800; letter-spacing: .06em; margin: 0; text-shadow: 0 0 8px var(--shadow-primary);
}
```

---

## `.loading-animation`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** spin
- **Selectors (sample):** `.loading-animation`
- **Selector:** `.loading-animation`
- **CSS body (primary):**
```css
.loading-animation {
margin-top: 0rem; width: 50px; height: 50px; border: 3px solid var(--border-secondary); border-radius: 50%; border-top-color: var(--accent-secondary); animation: spin 1s ease-in-out infinite;
}
```

---

## `.loading-chapter`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `}
  
  /* =========================
     Loading & Error States – sjednoceno.
     ========================= */
  .loading-chapter`, `.loading-chapter p`
- **Selector:** `.loading-chapter p`
- **CSS body (primary):**
```css
.loading-chapter {
margin: 0; color: var(--text-primary); text-shadow: 0 0 10px var(--glow-secondary);
}
```

---

## `.loading-continue`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** fadeInDelayed
- **Selectors (sample):** `.loading-continue`
- **Selector:** `.loading-continue`
- **CSS body (primary):**
```css
.loading-continue {
margin-top: 2rem; text-align: center; opacity: 0; animation: fadeInDelayed .5s ease forwards; animation-delay: 3s;
}
```

---

## `.loading-logo`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** glitch
- **Selectors (sample):** `.loading-logo h1`
- **Selector:** `.loading-logo h1`
- **CSS body (primary):**
```css
.loading-logo {
font-size: calc(4rem * var(--font-size-multiplier, 1)); margin-bottom: var(--spacing-unit, .75rem); animation: glitch 2s linear infinite alternate-reverse;
}
```

---

## `.loading-overlay`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter, backdrop-filter, transition
- **Selectors (sample):** `/* =========================
     LOADING OVERLAY + PROGRESS
     ========================= */
  .loading-overlay`, `.loading-overlay.active`
- **Selector:** `/* =========================
     LOADING OVERLAY + PROGRESS
     ========================= */
  .loading-overlay`
- **CSS body (primary):**
```css
.loading-overlay {
position: fixed; inset: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,.9);
    -webkit-backdrop-filter: blur(var(--blur-medium, 8px));
    backdrop-filter: blur(var(--blur-medium, 8px));
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    z-index: var(--z-modals, 1000);
    opacity: 0; visibility: hidden; transition: opacity .25s ease, visibility .25s ease;
}
```

---

## `.loading-spinner`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition, transform
- **Animations:** none
- **Selectors (sample):** `.loading-spinner`, `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **Selector:** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **CSS body (primary):**
```css
.loading-spinner {
animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

---

## `.loading-subtitle`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `.loading-subtitle`
- **Selector:** `.loading-subtitle`
- **CSS body (primary):**
```css
.loading-subtitle {
font-size: calc(1.2rem * var(--font-size-multiplier, 1)); color: var(--text-secondary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: calc(var(--spacing-unit, .75rem) * 2);
}
```

---

## `.loadout-entry`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.loadout-entry.is-equipped`, `.pocket-item-row,
.craft-recipe-row,
.void-room-row,
.loadout-entry`, `.pocket-item-row p,
.craft-recipe-row p,
.void-room-row p,
.loadout-entry p`
- **Usage sample:**
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
- **Selector:** `.loadout-entry span`
- **CSS body (primary):**
```css
.loadout-entry {
display: block;
  margin-top: 0.15rem;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(246, 255, 0, 0.76);
}
```

---

## `.lobby-code`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.lobby-code`, `.lobby-code`, `.lobby-code`
- **Usage sample:**
  - `src\components\game\RoomLobby.tsx`
- **Selector:** `.lobby-code`
- **CSS body (primary):**
```css
.lobby-code {
font-size: 2.5rem; font-family: var(--font-family-mono, monospace); color: var(--game-accent); letter-spacing: 0.4em; text-shadow: 0 0 10px var(--glow-secondary);
}
```

---

## `.lobby-player--me`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.lobby-player--me`
- **Selector:** `.lobby-player--me`
- **CSS body (primary):**
```css
.lobby-player--me {
border-color: color-mix(in srgb, var(--game-accent) 40%, transparent);
}
```

---

## `.lobby-player-host`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.lobby-player-host,
.lobby-player-you`, `.lobby-player-host`
- **Usage sample:**
  - `src\components\game\RoomLobby.tsx`
- **Selector:** `.lobby-player-host`
- **CSS body (primary):**
```css
.lobby-player-host {
background: color-mix(in srgb, var(--game-accent-alt) 20%, transparent); color: var(--game-accent-alt); border: 1px solid color-mix(in srgb, var(--game-accent-alt) 30%, transparent);
}
```

---

## `.lobby-player-you`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.lobby-player-host,
.lobby-player-you`, `.lobby-player-you`
- **Usage sample:**
  - `src\components\game\RoomLobby.tsx`
- **Selector:** `.lobby-player-you`
- **CSS body (primary):**
```css
.lobby-player-you {
background: color-mix(in srgb, var(--game-accent) 15%, transparent); color: var(--game-accent); border: 1px solid color-mix(in srgb, var(--game-accent) 30%, transparent);
}
```

---

## `.lobby-title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.lobby-title`, `.lobby-title`
- **Usage sample:**
  - `src\components\game\RoomLobby.tsx`
- **Selector:** `.lobby-title`
- **CSS body (primary):**
```css
.lobby-title {
font-size: 1.6rem; font-family: var(--font-family-mono, monospace); color: var(--game-accent); margin: 0; text-shadow: 0 0 8px var(--glow-secondary);
}
```

---

## `.log`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, public\styles.css, src\styles\base.css, src\styles\book-reader-base.css, src\styles\components-dialog.css, src\styles\components.css, src\styles\cyklus\card.css, src\styles\cyklus\legacy.css, src\styles\reader.css
- **Used in:** 1234 occurrences across 34 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `.chapter-reader__article.SYNTHOMAREADER .chapter-content,
.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.text, p:not(.log):not([class*="terminal"]):not([class*="system"]))`, `.chapter-reader__article.SYNTHOMAREADER .chapter-content > p:not(.log):not(.choice),
.chapter-reader__article.SYNTHOMAREADER .chapter-content .dialog-line`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_01_OZNAMENI.html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-1 [START].html`
- **Selector:** `.log`
- **CSS body (primary):**
```css
.log {
position: relative;
  left: 0rem;
  bottom: -1rem;
  margin-top: -1rem;
  color: var(--text-primary);
  text-transform: uppercase;
  font-family: 'Text03i', monospace;
  font-weight: 700;
  /* Theme glow for visibility in Reader */
  text-shadow: 0 0 6px var(--glow-secondary), 0 0 12px var(--glow-primary);
  font-size: calc(0.95rem * var(--font-size-multiplier));
  line-height: 1.2;
  z-index: 10;
  display: block;
}
```

---

## `.log-entry`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry`, `.log-entry`
- **Selector:** `.log-entry`
- **CSS body (primary):**
```css
.log-entry {
display: flex;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-family: var(--font-family-mono, monospace);
  color: var(--game-text-muted);
  line-height: 1.4;
}
```

---

## `.log-entry--boss`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry--boss`
- **Selector:** `.log-entry--boss`
- **CSS body (primary):**
```css
.log-entry--boss {
color: var(--game-danger);
}
```

---

## `.log-entry--card`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry--card`
- **Selector:** `.log-entry--card`
- **CSS body (primary):**
```css
.log-entry--card {
color: var(--game-warn);
}
```

---

## `.log-entry--event`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry--event`
- **Selector:** `.log-entry--event`
- **CSS body (primary):**
```css
.log-entry--event {
color: var(--game-accent);
}
```

---

## `.log-entry--final_round`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry--final_round`
- **Selector:** `.log-entry--final_round`
- **CSS body (primary):**
```css
.log-entry--final_round {
color: var(--game-text); font-weight: bold;
}
```

---

## `.log-entry--roll`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry--roll`
- **Selector:** `.log-entry--roll`
- **CSS body (primary):**
```css
.log-entry--roll {
color: var(--game-text-muted);
}
```

---

## `.log-entry--trap`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry--trap`
- **Selector:** `.log-entry--trap`
- **CSS body (primary):**
```css
.log-entry--trap {
color: var(--game-warn);
}
```

---

## `.log-entry--void`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.log-entry--void`
- **Selector:** `.log-entry--void`
- **CSS body (primary):**
```css
.log-entry--void {
color: var(--game-accent-alt);
}
```

---

## `.log-icon`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.log-icon`
- **Usage sample:**
  - `src\components\game\GameLog.tsx`
- **Selector:** `.log-icon`
- **CSS body (primary):**
```css
.log-icon {
opacity: 0.6; flex-shrink: 0;
}
```

---

## `.log-message`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.log-message`
- **Usage sample:**
  - `src\components\game\GameLog.tsx`
- **Selector:** `.log-message`
- **CSS body (primary):**
```css
.log-message {
flex: 1;
}
```

---

## `.log-turn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Selectors (sample):** `.log-turn`
- **Usage sample:**
  - `src\components\game\GameLog.tsx`
- **Selector:** `.log-turn`
- **CSS body (primary):**
```css
.log-turn {
opacity: 0.4; flex-shrink: 0;
}
```

---

## `.manifest`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.manifest`, `body[data-theme="retro-arcade"] h3, body[data-theme="retro-arcade"] h4, body[data-theme="retro-arcade"] h5, body[data-theme="retro-arcade"] h6,
  body[data-theme="retro-arcade"] p, body[data-theme="retro-arcade"] .title, body[data-theme="retro-arcade"] .log,
  body[data-theme="retro-arcade"] .dialog, body[data-theme="retro-arcade"] .dialogS, body[data-theme="retro-arcade"] .dialogN,
  body[data-theme="retro-arcade"] .text, body[data-theme="retro-arcade"] .textV, body[data-theme="retro-arcade"] .manifest`, `.hero-intro .manifest`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.manifest`
- **CSS body (primary):**
```css
.manifest {
font-family: 'Text02', sans-serif;
    font-size: calc(1.6rem * var(--font-size-multiplier));
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.4;
    text-align: center;
    text-shadow:
      0 5px 5px var(--glow-primary),
      0 15px 10px var(--glow-primary),
      0 25px 20px var(--glow-primary),
      0 35px 40px var(--glow-primary),
      0 45px 80px var(--glow-primary);
    position: relative;
    z-index: 100;
    max-width: 80%;
    max-height: 70%;
}
```

---

## `.manifest-enter`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `.manifest-enter`, `.manifest-enter.visible`
- **Selector:** `.manifest-enter`
- **CSS body (primary):**
```css
.manifest-enter {
opacity: 0; transform: translateY(8px); transition: opacity .6s ease .05s, transform .6s ease .05s;
}
```

---

## `.manifest-wrapper`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.hero-intro, .hero-intro .manifest-wrapper, #resizing-text, #manifest-container`, `.hero-intro .manifest-wrapper.has-cta .manifest`, `.hero-intro .manifest-wrapper + .hero-cta`
- **Selector:** `.hero-intro, .hero-intro .manifest-wrapper, #resizing-text, #manifest-container`
- **CSS body (primary):**
```css
.manifest-wrapper {
background: transparent !important; border: none !important; box-shadow: none !important;
}
```

---

## `.mbti-aura`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* Aura blink when updated */
.mbti-aura .mbti-panel`, `.mbti-aura .mbti-chip`
- **Selector:** `.mbti-aura .mbti-chip`
- **CSS body (primary):**
```css
.mbti-aura {
box-shadow: 0 0 16px rgba(255,0,255,0.35);
}
```

---

## `.mbti-axis-fill`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.mbti-axis-fill`
- **Usage sample:**
  - `app\components\MBTIHudClient.tsx`
- **Selector:** `.mbti-axis-fill`
- **CSS body (primary):**
```css
.mbti-axis-fill {
height: 100%; background: linear-gradient(90deg, var(--neon-magenta), var(--neon-cyan)); box-shadow: 0 0 10px rgba(255,0,255,.35);
}
```

---

## `.mbti-chip`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.mbti-chip`, `.mbti-aura .mbti-chip`
- **Usage sample:**
  - `app\components\MBTIHudClient.tsx`
- **Selector:** `.mbti-chip`
- **CSS body (primary):**
```css
.mbti-chip {
padding: .4rem .6rem;
  border: 1px solid rgba(255,0,255,0.35);
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  color: var(--neon-magenta);
  font-weight: 800;
  letter-spacing: .06em;
  text-shadow: 0 0 8px rgba(255,0,255,.6);
  user-select: none;
}
```

---

## `.mbti-panel`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.mbti-panel`, `/* Aura blink when updated */
.mbti-aura .mbti-panel`, `.mbti-panel`
- **Usage sample:**
  - `app\components\MBTIHudClient.tsx`
- **Selector:** `.mbti-panel`
- **CSS body (primary):**
```css
.mbti-panel {
width: min(260px, 50vw);
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(0,255,204,0.25);
  border-radius: 12px;
  padding: .55rem .7rem;
  box-shadow: 0 0 12px rgba(0,255,204,0.12);
}
```

---

## `.memory-leak`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css
- **Used in:** 14 occurrences across 7 files
- **Effect properties:** animation, filter, color-mix
- **Animations:** leakFlow
- **Selectors (sample):** `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `}
.memory-leak`, `.memory-leak::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `src\content\protected\SYNTHOMA-NULL\0-4 [DEFRAGMENTATION].html`
  - `src\content\protected\SYNTHOMA-NULL\0-5 [PAUSE].html`
- **Selector:** `.memory-leak::after`
- **CSS body (primary):**
```css
.memory-leak {
content: '';
  position: absolute; left: 0; right: 0; bottom: -2px; height: 14px;
  background: linear-gradient(180deg,
    color-mix(in oklab, var(--accent-secondary) 35%, transparent),
    transparent 70%);
  filter: blur(3px) opacity(.9);
  animation: leakFlow 3.8s linear infinite;
  pointer-events: none;
}
```

---

## `.modal-content`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.modal-content`
- **Selector:** `.modal-content`
- **CSS body (primary):**
```css
.modal-content {
background: var(--bg-secondary);
    border: 1px solid var(--border-secondary);
    padding: 1rem; border-radius: 8px;
    max-width: 560px; width: min(92vw, 560px);
    box-shadow: 0 20px 60px rgba(0,0,0,.6), 0 0 30px var(--glow-secondary);
}
```

---

## `.neon-blood`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css, src\styles\reader.css
- **Used in:** 87 occurrences across 10 files
- **Effect properties:** text-shadow, animation, color-mix
- **Animations:** neonPulse
- **Selectors (sample):** `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `/* Micro padding – prevence vizuálního slévání mezery (glow/kerning) */
  .fx-neon,
  .neon-blood`, `/* V titulcích a standalone znacích mezera nechceme */
  h1 .fx-neon, h2 .fx-neon, h3 .fx-neon, .title .fx-neon,
  h1 .neon-blood, h2 .neon-blood, h3 .neon-blood, .title .neon-blood`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
- **Selector:** `}
.neon-blood`
- **CSS body (primary):**
```css
.neon-blood {
display: inline;
  vertical-align: baseline;
  color: color-mix(in oklab, #ff0044 70%, var(--text-primary));
  text-shadow: 0 0 6px #ff0044, 0 0 12px #ff00ff;
  animation: neonPulse 1.8s ease-in-out infinite;
}
```

---

## `.neon-char`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 60 occurrences across 5 files
- **Effect properties:** text-shadow, transition
- **Selectors (sample):** `.neon-char`, `.neon-char.bright`, `.neon-char.flickering`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `public\books\efekty.html`
  - `src\content\protected\SYNTHOMA-NULL\0-11 [ORGIE].html`
- **Selector:** `.neon-char`
- **CSS body (primary):**
```css
.neon-char {
transition: opacity .2s ease-out, text-shadow .3s ease-out; color: rgba(255,255,255,.75); -webkit-user-select: none; user-select: none;
}
```

---

## `.neon-reader`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.neon-reader`
- **Selector:** `.neon-reader`
- **CSS body (primary):**
```css
.neon-reader {
background: linear-gradient(45deg, #0f0f0f, #1a1a1a);
  color: #00ffcc;
  text-shadow: 0 0 5px #00ffcc, 0 0 10px #ff00ff;
  border: 1px solid rgba(255, 0, 255, 0.15);
  border-radius: 12px;
}
```

---

## `.neon-text`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.neon-text`
- **Selector:** `.neon-text`
- **CSS body (primary):**
```css
.neon-text {
text-shadow: 0 0 10px #00ffcc;
}
```

---

## `.neon-word`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 3 occurrences across 3 files
- **Selectors (sample):** `/* Neon per-char container: tight tracking; whitespace-free via flex */
  .neon-word`, `.neon-word > .neon-char`, `/* Keep inter-word space readable */
  .neon-word > .neon-char.flickering-off`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
- **Selector:** `.neon-word > .neon-char`
- **CSS body (primary):**
```css
.neon-word {
display: inline-block; margin-right: 0;
}
```

---

## `.no-animations`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\components.css, src\styles\effects.css, src\styles\reader.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `}

/* Manual reduced-motion via control panel (body.no-animations) */
body.no-animations *,
body.no-animations *::before,
body.no-animations *::after`, `}

/* Manual reduced-motion via control panel (body.no-animations) */
body.no-animations *,
body.no-animations *::before,
body.no-animations *::after`, `}

/* Manual reduced-motion via control panel (body.no-animations) */
body.no-animations *,
body.no-animations *::before,
body.no-animations *::after`
- **Selector:** `.no-animations #glitch-synthoma.glitch-master`
- **CSS body (primary):**
```css
.no-animations {
text-shadow: 0 0 6px var(--primary-color) !important; color: var(--primary-color) !important;
}
```

---

## `.no-video-bg`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** noVideoDrift
- **Selectors (sample):** `/* Fixed background layers – viz definice výše (VIDEO BACKGROUND sekce). */

  /* Fallback background when no video is available */
  .no-video-bg::before`
- **Selector:** `/* Fixed background layers – viz definice výše (VIDEO BACKGROUND sekce). */

  /* Fallback background when no video is available */
  .no-video-bg::before`
- **CSS body (primary):**
```css
.no-video-bg {
content: '';
    position: fixed; inset: 0;
    z-index: -2;
    pointer-events: none;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(124,92,255,0.08), transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(0,212,255,0.06), transparent 40%),
      radial-gradient(ellipse at 50% 80%, rgba(255,0,200,0.04), transparent 50%),
      var(--bg-primary, #000);
    animation: noVideoDrift 20s ease-in-out infinite alternate;
}
```

---

## `.noising`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** neon-noising
- **Selectors (sample):** `.noising-char.noising`, `.noising-char.noising`, `}

/* Suppress v typewriter – čisté psaní bez shine. */
.typewriter .noising-char.noising, .typewriter .noising-char.flickering, .typewriter .noising-char.noising-burst`
- **Selector:** `.noising-char.noising`
- **CSS body (primary):**
```css
.noising {
animation: neon-noising .2s ease-in-out infinite alternate;
}
```

---

## `.noising-burst`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** neonNoising
- **Selectors (sample):** `}

/* Noising pulse – samostatný burst. */
.noising-char.noising-burst`, `}

/* Suppress v typewriter – čisté psaní bez shine. */
.typewriter .noising-char.noising, .typewriter .noising-char.flickering, .typewriter .noising-char.noising-burst`
- **Selector:** `}

/* Noising pulse – samostatný burst. */
.noising-char.noising-burst`
- **CSS body (primary):**
```css
.noising-burst {
animation: neonNoising 0.28s ease-in-out 1;
}
```

---

## `.noising-char`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css, src\styles\motion-contract.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, transition
- **Selectors (sample):** `.noising-char`, `.noising-char.noising`, `.no-animations #glitch-synthoma.glitch-master, .no-animations .glitch-fake1, .no-animations .glitch-fake2,
  .no-animations .glitch-char, .no-animations .glitch-char.glitchy, .no-animations .glitch-word,
  .no-animations .alarm-emote, .no-animations #glitch-bg, .no-animations .neon-char,
  .no-animations .noising-char, .no-animations .glitching-char`
- **Selector:** `.noising-char`
- **CSS body (primary):**
```css
.noising-char {
transition: all .1s ease-in-out; opacity: 1; color: inherit; text-shadow: inherit;
}
```

---

## `.noising-static`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `body.no-animations:not(.force-shine) .noising-char:not(.noising-static)`, `body.no-animations:not(.force-shine) .noising-char.noising-static`
- **Selector:** `body.no-animations:not(.force-shine) .noising-char:not(.noising-static)`
- **CSS body (primary):**
```css
.noising-static {
text-shadow: none !important;
}
```

---

## `.noising-text`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css, src\styles\reader.css, src\styles\themes.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** transform
- **Selectors (sample):** `}
  
  .noising-text`, `}

/* =========================
   Typewriter Effects – sjednoceno s noising a glitch.
   ========================= */
.noising-text`, `.typewriter .noising-text`
- **Usage sample:**
  - `app\landing-intro\page.tsx`
  - `public\books\efekty.html`
- **Selector:** `}

/* =========================
   Typewriter Effects – sjednoceno s noising a glitch.
   ========================= */
.noising-text`
- **CSS body (primary):**
```css
.noising-text {
display: inline-block;
  white-space: normal;
  border-right: 2px solid transparent;
  contain: layout paint;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

---

## `.os-button`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\controls.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.os-button`, `.os-button:hover`, `.os-button:focus-visible`
- **Selector:** `.os-button`
- **CSS body (primary):**
```css
.os-button {
display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--os-space-2);
  min-height: var(--os-tap);
  padding: var(--os-space-2) var(--os-space-3);
  border: var(--os-border-width) solid var(--os-border);
  border-radius: var(--os-corner);
  background: color-mix(in srgb, var(--os-surface) 92%, transparent);
  color: var(--os-text);
  font: 700 var(--os-text-control)/1.2 var(--os-font-mono);
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  appearance: none;
}
```

---

## `.os-button--danger`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\controls.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.os-button--danger`
- **Selector:** `.os-button--danger`
- **CSS body (primary):**
```css
.os-button--danger {
background: color-mix(in srgb, var(--os-error) 12%, transparent); border-color: var(--os-error); color: var(--os-error);
}
```

---

## `.os-button--secondary`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\controls.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.os-button--secondary`
- **Selector:** `.os-button--secondary`
- **CSS body (primary):**
```css
.os-button--secondary {
background: color-mix(in srgb, var(--os-surface-1) 80%, transparent);
}
```

---

## `.os-command`

- **Status:** defined
- **CSS files:** src\styles\cyklus\shell.css, src\styles\library-archive.css, src\styles\pwa.css, src\styles\synthoma-os\controls.css, src\styles\synthoma-os\layout.css
- **Used in:** 30 occurrences across 17 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.synthoma-library .os-command,
.synthoma-archive .os-command`, `.synthoma-library .os-command,
.synthoma-archive .os-command`, `.synthoma-library .os-command:hover,
.synthoma-archive .os-command:hover`
- **Usage sample:**
  - `app\error.tsx`
  - `app\install\InstallClient.tsx`
  - `app\landing-intro\page.tsx`
  - `app\not-found.tsx`
  - `app\offline\OfflineClient.tsx`
- **Selector:** `.os-command,
.os-sector-link`
- **CSS body (primary):**
```css
.os-command {
min-width: var(--os-tap);
  min-height: var(--os-tap);
  border: var(--os-border-width) solid var(--os-border);
  border-radius: var(--os-corner);
  background: color-mix(in srgb, var(--os-surface) 94%, transparent);
  color: var(--os-text);
  font: 700 var(--os-text-control)/1.3 var(--os-font-mono);
  text-decoration: none;
}
```

---

## `.os-command--active`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.synthoma-library .os-command--active,
.synthoma-archive .os-command--active`, `.synthoma-library .os-command--active,
.synthoma-archive .os-command--active`
- **Selector:** `.synthoma-library .os-command--active,
.synthoma-archive .os-command--active`
- **CSS body (primary):**
```css
.os-command--active {
border-color: var(--os-accent-primary);
  box-shadow: inset 0 -2px 0 var(--os-accent-primary);
}
```

---

## `.os-motion`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\motion.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition
- **Animations:** none
- **Selectors (sample):** `.os-motion`
- **Selector:** `.os-motion`
- **CSS body (primary):**
```css
.os-motion {
animation: none !important; transition-duration: 0ms !important;
}
```

---

## `.os-sector-link`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\controls.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.os-command,
.os-sector-link`, `.os-command:hover,
.os-sector-link:hover`, `.os-command[aria-pressed="true"],
.os-sector-link[aria-current="page"]`
- **Selector:** `.os-command,
.os-sector-link`
- **CSS body (primary):**
```css
.os-sector-link {
min-width: var(--os-tap);
  min-height: var(--os-tap);
  border: var(--os-border-width) solid var(--os-border);
  border-radius: var(--os-corner);
  background: color-mix(in srgb, var(--os-surface) 94%, transparent);
  color: var(--os-text);
  font: 700 var(--os-text-control)/1.3 var(--os-font-mono);
  text-decoration: none;
}
```

---

## `.os-status__code`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 10 occurrences across 6 files
- **Effect properties:** transform
- **Selectors (sample):** `.os-status__code`
- **Usage sample:**
  - `app\chapter\[id]\ChapterAccessGate.tsx`
  - `app\chapter\[id]\page.tsx`
  - `src\components\archive\CyklusCardCollection.tsx`
  - `src\components\archive\SynthomaArchive.tsx`
  - `src\components\library\LibraryResume.tsx`
- **Selector:** `.os-status__code`
- **CSS body (primary):**
```css
.os-status__code {
font-family: var(--font-mono, monospace);
  font-size: var(--os-font-size-sm);
  color: var(--os-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

---

## `.os-surface`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\library-archive.css, src\styles\paywall.css, src\styles\synthoma-os\home.css, src\styles\synthoma-os\surfaces.css
- **Used in:** 38 occurrences across 20 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.run-entity.os-surface`, `.run-artifact-card.os-surface`, `.run-mission-card.os-surface`
- **Usage sample:**
  - `app\admin\page.tsx`
  - `app\books\BooksClient.tsx`
  - `app\chapter\[id]\ChapterAccessGate.tsx`
  - `app\chapter\[id]\page.tsx`
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `.os-surface`
- **CSS body (primary):**
```css
.os-surface {
position: relative;
  border: var(--os-border-width) solid var(--os-border);
  border-radius: var(--os-corner);
  background: color-mix(in srgb, var(--os-surface) 94%, transparent);
  color: var(--os-text);
}
```

---

## `.os-surface--glass`

- **Status:** defined
- **CSS files:** src\styles\auth.css, src\styles\components.css, src\styles\effects.css, src\styles\reader.css, src\styles\synthoma-os\surfaces.css
- **Used in:** 20 occurrences across 9 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `.auth-container.os-surface--glass`, `.auth-home-panel.os-surface--glass`, `.cc-panel.os-surface--glass`
- **Usage sample:**
  - `app\admin\page.tsx`
  - `app\books\BooksClient.tsx`
  - `app\components\admin\AdminDashboard.tsx`
  - `app\login\page.tsx`
  - `app\purchase\success\page.tsx`
- **Selector:** `.auth-home-panel.os-surface--glass`
- **CSS body (primary):**
```css
.os-surface--glass {
background: rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border-radius: 20px;
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-glow, 0 0 12px rgba(0,255,255,.25));
}
```

---

## `.overheat`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css
- **Used in:** 29 occurrences across 6 files
- **Effect properties:** animation
- **Animations:** heatHaze
- **Selectors (sample):** `/* Safeguard: Inline text effects – žádné bloky, jen inline flow. */
  .fx-neon, .fx-glow-magenta, .fx-shadow-lg, .fx-outline, .fx-gradient, .fx-rainbow, .fx-noise, .fx-uppercase-wide, .fx-underline, .fx-flicker, .fx-wave, .halo, .datastream, .echo-ghost, .memory-leak, .overheat, .neon-blood`, `}
.overheat`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `src\content\protected\SYNTHOMA-NULL\0-6 [SEARCHING].html`
  - `src\content\protected\SYNTHOMA-NULL\0-7 [RUINS].html`
- **Selector:** `}
.overheat`
- **CSS body (primary):**
```css
.overheat {
animation: heatHaze 2.2s ease-in-out infinite;
}
```

---

## `.panel`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 119 occurrences across 22 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `/* Panel s řízenou průhledností – sarkasmus: Protože průhledný panel je jako duch, co ti kradne pixely. 👻 */
  .panel`, `/* Glass mode transition smoothing */
  .SYNTHOMAREADER,
  .panel`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
  - `app\chapter\[id]\ChapterAccessGate.tsx`
  - `app\chapter\[id]\page.tsx`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
- **Selector:** `/* Panel s řízenou průhledností – sarkasmus: Protože průhledný panel je jako duch, co ti kradne pixely. 👻 */
  .panel`
- **CSS body (primary):**
```css
.panel {
background: rgba(var(--bg-secondary-rgb, 0,0,0), var(--panel-alpha, 0.6));
    -webkit-backdrop-filter: blur(4px);
    backdrop-filter: blur(4px);
    border: 1px solid var(--border-secondary);
    box-shadow: var(--shadow-glow, 0 0 12px rgba(0,255,255,.25));
}
```

---

## `.panel-button`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `#control-panel .btn, #control-panel .panel-button, #control-panel .theme-button, .reader-controls button,
  #control-panel label, #control-panel input, #control-panel .progress, #control-panel .audio-buttons`, `#control-panel .panel-button, #control-panel .theme-button`, `#control-panel .panel-button, #control-panel .theme-button`
- **Selector:** `#control-panel :is(.panel-button, .audio-buttons .btn)[aria-pressed="true"]`
- **CSS body (primary):**
```css
.panel-button {
border-color: var(--cy-line-strong);
  background: var(--cy-button-active);
  box-shadow: inset 3px 0 0 var(--cy-accent-primary);
}
```

---

## `.panel-section-title`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `#control-panel .panel-section-title`, `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`, `#control-panel .panel-section-title`
- **Usage sample:**
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `#control-panel .panel-section-title`
- **CSS body (primary):**
```css
.panel-section-title {
font-family: 'Text02', monospace;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted, rgba(255,255,255,0.5));
    margin: 0 0 6px;
    padding: 0;
}
```

---

## `.paywall`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** pulse
- **Selectors (sample):** `.paywall`
- **Selector:** `.paywall`
- **CSS body (primary):**
```css
.paywall {
border: 2px solid #ff00ff;
  animation: pulse 2s infinite;
}
```

---

## `.paywall-back-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.paywall-back-btn`, `.paywall-back-btn:hover`
- **Selector:** `.paywall-back-btn`
- **CSS body (primary):**
```css
.paywall-back-btn {
font-size: .68rem;
  letter-spacing: .1em;
  opacity: .6;
  transition: opacity .15s;
}
```

---

## `.paywall-overlay`

- **Status:** defined
- **CSS files:** src\styles\paywall.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `﻿/* paywall.css — Paywall modal, success page, paywall inline styles */

/* =========================
   PAYWALL MODAL
   ========================= */
.paywall-overlay`
- **Usage sample:**
  - `src\components\access\ContentPurchaseDialog.tsx`
- **Selector:** `﻿/* paywall.css — Paywall modal, success page, paywall inline styles */

/* =========================
   PAYWALL MODAL
   ========================= */
.paywall-overlay`
- **CSS body (primary):**
```css
.paywall-overlay {
position: fixed;
  inset: 0;
  background: rgba(0,0,0,.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-top, 9000);
  padding: 1rem;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
```

---

## `.paywall-package`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\paywall.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.paywall-package.paywall-package--primary`, `.paywall-package.paywall-package--secondary`, `.paywall-package.paywall-package--subscription`
- **Usage sample:**
  - `src\components\access\ContentPurchaseDialog.tsx`
- **Selector:** `.paywall-package.paywall-package--primary`
- **CSS body (primary):**
```css
.paywall-package {
border-color: var(--accent-primary, #7c5cff);
  box-shadow: 0 0 12px rgba(124,92,255,.2);
  position: relative;
}
```

---

## `.paywall-package--primary`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.paywall-package.paywall-package--primary`
- **Selector:** `.paywall-package.paywall-package--primary`
- **CSS body (primary):**
```css
.paywall-package--primary {
border-color: var(--accent-primary, #7c5cff);
  box-shadow: 0 0 12px rgba(124,92,255,.2);
  position: relative;
}
```

---

## `.paywall-package-badge--sub`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.paywall-package-badge--sub`
- **Selector:** `.paywall-package-badge--sub`
- **CSS body (primary):**
```css
.paywall-package-badge--sub {
background: color-mix(in oklab, var(--accent-secondary, #ffc83c) 80%, #000 20%);
  color: #000;
}
```

---

## `.paywall-package-btn--primary`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.paywall-package-btn--primary`, `.paywall-package-btn--primary:hover:not(:disabled)`
- **Usage sample:**
  - `src\components\access\ContentPurchaseDialog.tsx`
- **Selector:** `.paywall-package-btn--primary:hover:not(:disabled)`
- **CSS body (primary):**
```css
.paywall-package-btn--primary {
box-shadow: 0 0 18px rgba(124,92,255,.5);
}
```

---

## `.pdfBtn`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.pdfBtn`, `.pdfBtn:hover`, `.pdfBtn:disabled`
- **Selector:** `.pdfBtn`
- **CSS body (primary):**
```css
.pdfBtn {
font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  opacity: 0.85;
  background: rgba(255,0,255,0.12);
  border-color: rgba(255,0,255,0.4);
  transition: opacity 0.2s ease, background 0.2s ease;
}
```

---

## `.player-card`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.player-card`, `.player-card`, `.player-card`
- **Selector:** `.player-card`
- **CSS body (primary):**
```css
.player-card {
border: 1px solid var(--game-border);
  border-radius: 6px;
  padding: 0.6rem 0.75rem;
  background: var(--game-bg-card);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition: border-color 0.2s;
}
```

---

## `.player-dc-tag`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.player-me-tag,
.player-turn-tag,
.player-dc-tag`, `.player-dc-tag`
- **Usage sample:**
  - `src\components\game\PlayerPanel.tsx`
- **Selector:** `.player-dc-tag`
- **CSS body (primary):**
```css
.player-dc-tag {
background: color-mix(in srgb, var(--game-danger) 15%, transparent); color: var(--game-danger); border: 1px solid color-mix(in srgb, var(--game-danger) 30%, transparent);
}
```

---

## `.player-me-tag`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.player-me-tag,
.player-turn-tag,
.player-dc-tag`, `.player-me-tag`
- **Usage sample:**
  - `src\components\game\PlayerPanel.tsx`
- **Selector:** `.player-me-tag`
- **CSS body (primary):**
```css
.player-me-tag {
background: color-mix(in srgb, var(--game-accent) 15%, transparent); color: var(--game-accent); border: 1px solid color-mix(in srgb, var(--game-accent) 30%, transparent);
}
```

---

## `.player-turn-tag`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.player-me-tag,
.player-turn-tag,
.player-dc-tag`, `.player-turn-tag`
- **Usage sample:**
  - `src\components\game\PlayerPanel.tsx`
- **Selector:** `.player-turn-tag`
- **CSS body (primary):**
```css
.player-turn-tag {
background: color-mix(in srgb, var(--game-warn) 15%, transparent); color: var(--game-warn); border: 1px solid color-mix(in srgb, var(--game-warn) 30%, transparent);
}
```

---

## `.playlist`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `/* Playlist container inside control panel – force visible, scrollable, full width */
  #control-panel #playlist-container.playlist`, `#control-panel #playlist-container.playlist a`, `#control-panel #playlist-container.playlist a:last-child`
- **Selector:** `#control-panel #playlist-container.playlist a:hover`
- **CSS body (primary):**
```css
.playlist {
background: rgba(var(--bg-secondary-rgb), 0.5); transform: translateY(-1px);
}
```

---

## `.pocket-item-row`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.pocket-item-row,
.craft-recipe-row,
.void-room-row,
.loadout-entry`, `.pocket-item-row p,
.craft-recipe-row p,
.void-room-row p,
.loadout-entry p`, `.pocket-item-row small,
.craft-recipe-row small,
.void-room-row small`
- **Usage sample:**
  - `src\components\cyklus\CyklusPocketPanel.tsx`
- **Selector:** `.pocket-item-row,
.craft-recipe-row,
.void-room-row,
.loadout-entry`
- **CSS body (primary):**
```css
.pocket-item-row {
position: relative;
  min-width: 0;
  margin: 0;
  padding: var(--cy-space-3);
  border: 1px solid var(--cy-line-dim);
  border-left: 2px solid var(--cy-cyan);
  border-radius: var(--cy-radius);
  background: color-mix(in srgb, var(--cy-surface-1) 66%, transparent);
}
```

---

## `.primary`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-dark-buttons .primary`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="14"] .kp-dark-buttons .primary`
- **CSS body (primary):**
```css
.primary {
color: #06210f;
    border-color: rgba(53,255,131,0.4);
    background: var(--kp-claim);
    box-shadow: 0 0 1.4rem rgba(53,255,131,0.18);
}
```

---

## `.profile-collection__items`

- **Status:** defined
- **CSS files:** src\styles\profile.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.profile-collection__items`, `.profile-collection__items li`, `.profile-collection__items strong`
- **Usage sample:**
  - `src\components\profile\SubjectCollectionPanel.tsx`
- **Selector:** `.profile-collection__items span`
- **CSS body (primary):**
```css
.profile-collection__items {
color: var(--cy-text-dim); font: 700 9px/1.3 var(--cy-font-mono); text-transform: uppercase;
}
```

---

## `.profile-decision-timeline__marker`

- **Status:** defined
- **CSS files:** src\styles\profile.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.profile-decision-timeline__marker`, `.profile-decision-timeline__marker::after`, `.profile-decision-timeline > li:last-child .profile-decision-timeline__marker::after`
- **Usage sample:**
  - `src\components\profile\DecisionTimeline.tsx`
- **Selector:** `.profile-decision-timeline__marker`
- **CSS body (primary):**
```css
.profile-decision-timeline__marker {
position: relative; width: 7px; height: 7px; margin-top: 18px; border: 1px solid var(--cy-accent-primary); background: var(--cy-surface-1); box-shadow: var(--cy-glow-primary);
}
```

---

## `.profile-panel-backdrop`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\profile.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter, backdrop-filter
- **Animations:** profilePanelFadeIn
- **Selectors (sample):** `.profile-panel-backdrop`, `.profile-panel-backdrop`
- **Usage sample:**
  - `app\components\SubjectProfilePanelClient.tsx`
- **Selector:** `.profile-panel-backdrop`
- **CSS body (primary):**
```css
.profile-panel-backdrop {
position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
  z-index: 0;
  cursor: pointer;
  animation: profilePanelFadeIn 0.18s ease forwards;
}
```

---

## `.profile-panel-close`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\profile.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.profile-panel-close`, `.profile-panel-close:hover`, `.profile-panel-close`
- **Usage sample:**
  - `app\components\SubjectProfilePanelClient.tsx`
- **Selector:** `.profile-panel-close`
- **CSS body (primary):**
```css
.profile-panel-close {
background: transparent;
  border: 1px solid var(--border-secondary, rgba(255,255,255,.12));
  color: var(--text-primary, #cfcfe3);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: .8rem;
  cursor: pointer;
  line-height: 1;
  transition: border-color .15s, background .15s, color .15s;
}
```

---

## `.profile-panel-popup`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\profile.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.profile-panel-popup`, `.profile-panel-popup.visible`, `.profile-panel-popup.visible`
- **Selector:** `.profile-panel-popup`
- **CSS body (primary):**
```css
.profile-panel-popup {
position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -46%) scale(0.97);
  z-index: 1;
  width: min(92vw, 720px);
  max-height: 88dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg-surface, #0f0f12);
  border: 1px solid var(--border-primary, rgba(124,92,255,.25));
  border-radius: 14px;
  box-shadow: 0 24px 80px rgba(0,0,0,.7), 0 0 40px rgba(124,92,255,.12);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  overflow: hidden;
  box-sizing: border-box;
}
```

---

## `.profile-panel-title`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\profile.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.profile-panel-title`, `.profile-panel-title`
- **Usage sample:**
  - `app\components\SubjectProfilePanelClient.tsx`
- **Selector:** `.profile-panel-title`
- **CSS body (primary):**
```css
.profile-panel-title {
font-family: 'Text02', monospace;
  font-size: .85rem;
  letter-spacing: .1em;
  color: var(--accent-primary, #7c5cff);
  text-transform: uppercase;
  font-weight: 700;
}
```

---

## `.profile-skeleton`

- **Status:** defined
- **CSS files:** src\styles\profile.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** profile-pulse
- **Selectors (sample):** `.profile-skeleton`, `.profile-skeleton span`, `.profile-skeleton span:first-child`
- **Usage sample:**
  - `app\components\SubjectProfilePanelClient.tsx`
  - `src\components\profile\ProfileDashboard.tsx`
- **Selector:** `.profile-skeleton span`
- **CSS body (primary):**
```css
.profile-skeleton {
background: var(--cy-surface-2); animation: profile-pulse 1.3s ease-in-out infinite alternate;
}
```

---

## `.profile-tab`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\profile.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.profile-popup-inner .profile-tab`, `.profile-tab`, `.profile-tab span`
- **Selector:** `.profile-tab.active,
.profile-tab[aria-selected='true']`
- **CSS body (primary):**
```css
.profile-tab {
border-bottom-color: var(--cy-accent-primary);
  background: var(--cy-button-active);
  color: var(--cy-text);
  box-shadow: inset 0 -2px 0 var(--cy-accent-primary);
}
```

---

## `.progress`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `#control-panel .btn, #control-panel .panel-button, #control-panel .theme-button, .reader-controls button,
  #control-panel label, #control-panel input, #control-panel .progress, #control-panel .audio-buttons`, `/* Audio progress – bar. */
  #progress-bar-container.progress`, `#progress-bar-container .progress#progress-bar, #progress-bar`
- **Selector:** `#progress-bar-container .progress#progress-bar, #progress-bar`
- **CSS body (primary):**
```css
.progress {
position: absolute; top: 0; left: 0; height: 100%; width: 0%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); box-shadow: 0 0 8px var(--glow-primary);
}
```

---

## `.progress-fill`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\profile.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.progress-fill`, `.progress-fill::after`, `.psyche-bar-fill,
.progress-fill`
- **Usage sample:**
  - `src\components\profile\ReadingProgressPanel.tsx`
- **Selector:** `.progress-fill`
- **CSS body (primary):**
```css
.progress-fill {
height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); width: 0; transition: width .25s ease; position: relative;
}
```

---

## `.progressFill`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.progressFill`
- **Selector:** `.progressFill`
- **CSS body (primary):**
```css
.progressFill {
height: 100%;
  width: var(--progress-width, 0%);
  background-color: #2563eb; /* bg-blue-600 */
  border-radius: 9999px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
```

---

## `.progression-card`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 7 occurrences across 2 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.cyklus-overlay--void-hub .progression-card,
  .cyklus-overlay--void-hub .cyklus-pocket-column`, `.cyklus-progression-dashboard h2,
.cyklus-pocket-panel h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`, `.cyklus-pocket-column,
.progression-card,
.cyklus-suggestion-box`
- **Usage sample:**
  - `src\components\cyklus\CyklusProgressionDashboard.tsx`
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.progression-card,
.cyklus-pocket-column,
.cyklus-suggestion-box`
- **CSS body (primary):**
```css
.progression-card {
min-width: 0;
  margin: 0;
  padding: var(--cy-space-3);
  border: 1px solid var(--cy-line-dim);
  border-radius: var(--cy-radius);
  background: color-mix(in srgb, var(--cy-surface-2) 76%, transparent);
  box-shadow: none;
}
```

---

## `.public-ai-kicker`

- **Status:** defined
- **CSS files:** src\styles\public-ai.css
- **Used in:** 4 occurrences across 4 files
- **Effect properties:** transform
- **Selectors (sample):** `.public-ai-kicker`
- **Usage sample:**
  - `app\ai-policy\page.tsx`
  - `app\ai\api\page.tsx`
  - `app\cards\[id]\page.tsx`
  - `app\cards\page.tsx`
- **Selector:** `.public-ai-kicker`
- **CSS body (primary):**
```css
.public-ai-kicker {
color: var(--accent, #e7ff57); font: 700 0.78rem/1.4 monospace; text-transform: uppercase;
}
```

---

## `.public-card-grid`

- **Status:** defined
- **CSS files:** src\styles\public-ai.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.public-card-grid`, `.public-card-grid a`, `.public-card-grid span, .public-card-grid small`
- **Usage sample:**
  - `app\cards\page.tsx`
- **Selector:** `.public-card-grid a`
- **CSS body (primary):**
```css
.public-card-grid {
display: grid; min-height: 132px; padding: 16px; border: 1px solid color-mix(in srgb, currentColor 24%, transparent); background: rgba(0, 0, 0, 0.55); text-decoration: none;
}
```

---

## `.puzzle-complete`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `/* Paměťový zámek – wrapper po dokončení všech echo voleb */
  [data-puzzle-id].puzzle-complete`
- **Selector:** `/* Paměťový zámek – wrapper po dokončení všech echo voleb */
  [data-puzzle-id].puzzle-complete`
- **CSS body (primary):**
```css
.puzzle-complete {
border-left: 2px solid var(--accent-primary, #7c5cff);
    padding-left: .5em;
    transition: border-color .3s ease;
}
```

---

## `.puzzle-unlocked`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** puzzleUnlock
- **Selectors (sample):** `[data-puzzle-unlock].puzzle-unlocked`
- **Selector:** `[data-puzzle-unlock].puzzle-unlocked`
- **CSS body (primary):**
```css
.puzzle-unlocked {
display: block;
    animation: puzzleUnlock .5s ease forwards;
}
```

---

## `.pwa-boot-splash`

- **Status:** defined
- **CSS files:** src\styles\pwa.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, transition
- **Selectors (sample):** `}
.pwa-boot-splash`, `.pwa-boot-splash[data-visible="true"]`, `.pwa-boot-splash img`
- **Usage sample:**
  - `src\components\pwa\PwaBootSplash.tsx`
- **Selector:** `.pwa-boot-splash[data-visible="true"]`
- **CSS body (primary):**
```css
.pwa-boot-splash {
opacity: 1;
  visibility: visible;
  filter: blur(0);
  transition-delay: 0s;
}
```

---

## `.pwa-dialog`

- **Status:** defined
- **CSS files:** src\styles\pwa.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.pwa-dialog`, `.pwa-dialog h2`, `.pwa-dialog p`
- **Usage sample:**
  - `src\components\pwa\PwaProvider.tsx`
- **Selector:** `.pwa-dialog`
- **CSS body (primary):**
```css
.pwa-dialog {
width: min(100%, 580px);
  padding: clamp(18px, 5vw, 28px);
  border: 1px solid var(--os-border-strong, #00eaff);
  border-radius: 2px;
  background: var(--os-surface-1, #071018);
  box-shadow: var(--os-shadow-elevated, 0 18px 60px rgb(0 0 0 / 0.55));
  color: var(--os-text, #e7faff);
}
```

---

## `.pwa-page__panel`

- **Status:** defined
- **CSS files:** src\styles\pwa.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.pwa-page__panel`, `.pwa-page__panel > .os-command`
- **Usage sample:**
  - `app\install\InstallClient.tsx`
- **Selector:** `.pwa-page__panel`
- **CSS body (primary):**
```css
.pwa-page__panel {
width: min(100%, 720px); padding: clamp(22px, 6vw, 48px); border-block: 1px solid var(--os-border-strong, #00eaff); background: color-mix(in srgb, var(--os-surface-1, #071018) 94%, transparent);
}
```

---

## `.quantum-blur`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 73 occurrences across 11 files
- **Effect properties:** animation
- **Animations:** quantumBlur
- **Selectors (sample):** `}
.quantum-blur`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
- **Selector:** `}
.quantum-blur`
- **CSS body (primary):**
```css
.quantum-blur {
animation: quantumBlur 2.8s ease-in-out infinite;
}
```

---

## `.r2`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring.r2`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring.r2`
- **CSS body (primary):**
```css
.r2 {
top: 8.2rem; width: 14rem; animation-direction: reverse;
}
```

---

## `.r3`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring.r3`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_09_NEOPRAVNENY_UZIVATEL.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="09"] .kp-tower-ring.r3`
- **CSS body (primary):**
```css
.r3 {
top: 13rem; width: 18rem; animation-duration: 11s;
}
```

---

## `.reader-controls`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, animation
- **Animations:** border-glow
- **Selectors (sample):** `}
  
  #control-panel.control-panel, .reader-controls`, `#control-panel .btn, #control-panel .panel-button, #control-panel .theme-button, .reader-controls button,
  #control-panel label, #control-panel input, #control-panel .progress, #control-panel .audio-buttons`, `/* Reader controls toolbar – s glow border. */
  .reader-controls`
- **Selector:** `.reader-controls::before`
- **CSS body (primary):**
```css
.reader-controls {
content: '';
    position: absolute;
    left: -1px;
    width: 4px;
    height: 130%;
    border-radius: 2px;
    background: transparent;
    box-shadow: -1px 0 4px 0px var(--accent-warning), 1px 0 8px 0px var(--accent-warning), 0px 0 12px 0px var(--accent-warning);
    animation: border-glow 2.6s infinite cubic-bezier(.8,0,.23,1.1);
    z-index: 2;
    pointer-events: none;
    opacity: 0.6;
}
```

---

## `.reader-decision-group`

- **Status:** defined
- **CSS files:** src\styles\components-choice.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter, transform
- **Selectors (sample):** `.reader-decision-group`, `.reader-decision-group .choice-link`, `.reader-decision-group[data-state="submitting"] .choice-link`
- **Selector:** `.reader-decision-group[data-state="locked"] .choice-link:hover,
.reader-decision-group[data-state="locked"] .choice-link:active`
- **CSS body (primary):**
```css
.reader-decision-group {
transform: none !important;
  filter: none !important;
}
```

---

## `.reader-decision-marker`

- **Status:** defined
- **CSS files:** src\styles\components-choice.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, color-mix
- **Selectors (sample):** `.reader-decision-marker`
- **Selector:** `.reader-decision-marker`
- **CSS body (primary):**
```css
.reader-decision-marker {
display: inline-block;
  margin-left: 0.7rem;
  color: var(--accent-primary, #00e5ff);
  font-family: 'Text03i', monospace;
  font-size: 0.68em;
  font-weight: 700;
  letter-spacing: 0;
  white-space: nowrap;
  text-shadow: 0 0 7px color-mix(in oklab, var(--accent-primary, #00e5ff) 42%, transparent);
}
```

---

## `.reader-dialog-status`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.reader-dialog-status`, `.reader-dialog-status strong`, `.reader-dialog-status > span:last-of-type`
- **Usage sample:**
  - `src\components\reader\ReaderDialogController.tsx`
- **Selector:** `.reader-dialog-status`
- **CSS body (primary):**
```css
.reader-dialog-status {
position: fixed;
  z-index: var(--os-z-portal, 110);
  display: grid;
  gap: 0.22rem;
  width: min(20rem, calc(100vw - 2rem));
  padding: 0.85rem 2.5rem 0.85rem 1rem;
  border: 1px solid var(--speaker-color);
  border-left-width: 4px;
  background: color-mix(in srgb, var(--book-background, #020306) 94%, var(--speaker-color));
  color: var(--speaker-color);
  box-shadow: 0 0 1.4rem color-mix(in srgb, var(--speaker-color) 28%, transparent);
  font-family: var(--font-family-ui, system-ui, sans-serif);
}
```

---

## `.reader-onboarding`

- **Status:** defined
- **CSS files:** src\styles\book-reader-base.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform, color-mix
- **Selectors (sample):** `.reader-onboarding`, `.reader-onboarding h2`, `.reader-onboarding p`
- **Usage sample:**
  - `src\components\reader\ReaderOnboarding.tsx`
- **Selector:** `.reader-onboarding`
- **CSS body (primary):**
```css
.reader-onboarding {
position: fixed;
  z-index: var(--os-z-modal, 90);
  top: 50%;
  left: 50%;
  width: min(34rem, calc(100vw - 2rem));
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid var(--book-accent, var(--accent-secondary));
  background: color-mix(in srgb, var(--book-background, #020306) 96%, var(--book-accent));
  color: var(--text-primary, #e8fbff);
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.76), 0 0 2rem color-mix(in srgb, var(--book-accent) 24%, transparent);
  transform: translate(-50%, -50%);
}
```

---

## `.reader-page`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, animation
- **Animations:** none
- **Selectors (sample):** `}

  /* Remove left rail/border for main title in reader contexts */
  .reader-page .title::before,
  .SYNTHOMAREADER .title::before,
  .hero-intro .title::before`, `/* Absolute kill (regardless of classes) */
  .reader-page h1#glitch-reader::before`, `.reader-page .story > section`
- **Selector:** `}

  /* Remove left rail/border for main title in reader contexts */
  .reader-page .title::before,
  .SYNTHOMAREADER .title::before,
  .hero-intro .title::before`
- **CSS body (primary):**
```css
.reader-page {
content: none !important;
    box-shadow: none !important;
    animation: none !important;
}
```

---

## `.reader-skeleton__line`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 6 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** skeletonShimmer
- **Selectors (sample):** `.reader-skeleton__line`
- **Usage sample:**
  - `app\reader\loading.tsx`
- **Selector:** `.reader-skeleton__line`
- **CSS body (primary):**
```css
.reader-skeleton__line {
height: 1rem;
    border-radius: 4px;
    background: linear-gradient(90deg,
      rgba(var(--bg-secondary-rgb, 0,0,0), 0.4) 25%,
      rgba(var(--bg-secondary-rgb, 0,0,0), 0.2) 50%,
      rgba(var(--bg-secondary-rgb, 0,0,0), 0.4) 75%
    );
    background-size: 200% 100%;
    animation: skeletonShimmer 1.5s ease-in-out infinite;
}
```

---

## `.reader-skeleton__scanline`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** skeletonScanline
- **Selectors (sample):** `.reader-skeleton__scanline`
- **Usage sample:**
  - `app\reader\loading.tsx`
- **Selector:** `.reader-skeleton__scanline`
- **CSS body (primary):**
```css
.reader-skeleton__scanline {
position: absolute;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-secondary, #0ff), transparent);
    opacity: 0.5;
    animation: skeletonScanline 2.5s linear infinite;
}
```

---

## `.readerBackground`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* removed .readerBackground – background and opacity are managed by .SYNTHOMAREADER */

.readerContent`
- **Selector:** `/* removed .readerBackground – background and opacity are managed by .SYNTHOMAREADER */

.readerContent`
- **CSS body (primary):**
```css
.readerBackground {
max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;
  z-index: 1; /* render above bg layer */
}
```

---

## `.readerContent`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* removed .readerBackground – background and opacity are managed by .SYNTHOMAREADER */

.readerContent`
- **Selector:** `/* removed .readerBackground – background and opacity are managed by .SYNTHOMAREADER */

.readerContent`
- **CSS body (primary):**
```css
.readerContent {
max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
  background-color: transparent;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;
  z-index: 1; /* render above bg layer */
}
```

---

## `.readerHelpButton`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.readerHelpButton`, `.readerHelpButton:hover`
- **Selector:** `.readerHelpButton`
- **CSS body (primary):**
```css
.readerHelpButton {
color: #9ca3af;
  transition: color 0.15s ease-in-out;
}
```

---

## `.readerMain`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `/* Let global reader.css handle .SYNTHOMAREADER overlay and backgrounds.
   No local background painting here to avoid double overlays. */
/* Ensure content sits above any global ::before overlay */
.readerMain:global(.SYNTHOMAREADER) > :global(.chapter-content),
.readerMain:global(.SYNTHOMAREADER) > :global(.reader-host),
.readerMain:global(.SYNTHOMAREADER) *`, `/* Let global reader.css handle .SYNTHOMAREADER overlay and backgrounds.
   No local background painting here to avoid double overlays. */
/* Ensure content sits above any global ::before overlay */
.readerMain:global(.SYNTHOMAREADER) > :global(.chapter-content),
.readerMain:global(.SYNTHOMAREADER) > :global(.reader-host),
.readerMain:global(.SYNTHOMAREADER) *`, `/* Let global reader.css handle .SYNTHOMAREADER overlay and backgrounds.
   No local background painting here to avoid double overlays. */
/* Ensure content sits above any global ::before overlay */
.readerMain:global(.SYNTHOMAREADER) > :global(.chapter-content),
.readerMain:global(.SYNTHOMAREADER) > :global(.reader-host),
.readerMain:global(.SYNTHOMAREADER) *`
- **Selector:** `.readerMain :global(#glitch-reader .glitch-real),
.readerMain :global(#glitch-reader .glitch-fake1),
.readerMain :global(#glitch-reader .glitch-fake2)`
- **CSS body (primary):**
```css
.readerMain {
will-change: transform, text-shadow;
}
```

---

## `.readingProgressBar`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition
- **Selectors (sample):** `.readingProgressBar`
- **Selector:** `.readingProgressBar`
- **CSS body (primary):**
```css
.readingProgressBar {
width: var(--progress-width, 0%);
  height: 100%;
  background: linear-gradient(90deg, var(--accent-primary, #7c5cff), var(--accent-secondary, #0ff));
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 6px var(--glow-primary, rgba(124,92,255,0.5));
}
```

---

## `.redacted`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 7 occurrences across 5 files
- **Effect properties:** box-shadow, animation
- **Animations:** redactBlink
- **Selectors (sample):** `}
.redacted, .redacted span`, `}
.redacted, .redacted span`, `.redacted::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
  - `src\content\protected\SYNTHOMA-NULL\0-4 [DEFRAGMENTATION].html`
  - `src\content\protected\SYNTHOMA-NULL\0-7 [RUINS].html`
- **Selector:** `.redacted::after`
- **CSS body (primary):**
```css
.redacted {
content: '████████████';
  letter-spacing: .08em; white-space: nowrap; color: var(--text-primary);
  background: currentColor; padding: 0 .15em; border-radius: 2px;
  box-shadow: 0 0 6px var(--shadow-primary);
  animation: redactBlink 2.4s steps(6, end) infinite;
}
```

---

## `.related-chip`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.archive-card .related-chip`, `.archive-card .related-chip:hover`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
- **Selector:** `.archive-card .related-chip`
- **CSS body (primary):**
```css
.related-chip {
border: 1px solid rgba(255,255,255,.2);
    background: rgba(0,0,0,.2);
    color: inherit;
    padding: .25rem .5rem;
    border-radius: 999px;
    cursor: pointer;
    transition: background .2s ease, border-color .2s ease;
}
```

---

## `.retry-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.error-btn.retry-btn`, `.error-btn.retry-btn:hover`
- **Selector:** `.error-btn.retry-btn:hover`
- **CSS body (primary):**
```css
.retry-btn {
background: var(--accent-success); color: var(--bg-primary); box-shadow: 0 0 15px var(--accent-success);
}
```

---

## `.retry-button`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.retry-button`, `.retry-button:hover`
- **Selector:** `.retry-button`
- **CSS body (primary):**
```css
.retry-button {
background: rgba(255, 68, 68, 0.1); border: 1px solid #ff4444; color: #ff8888; padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; transition: all 0.3s ease; font-family: var(--font-family-mono, 'VT323', monospace); font-size: 1rem; border-radius: 4px;
}
```

---

## `.run-bar-fill`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.run-bar-fill`
- **Selector:** `.run-bar-fill`
- **CSS body (primary):**
```css
.run-bar-fill {
height: 100%;
  width: var(--bar-w, 0%);
  border-radius: 2px;
  transition: width .4s ease;
}
```

---

## `.run-end-report__btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `/* ── UI polish: glow, contrast, hover ──────────────────────────────────────── */

.solo-menu__btn,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__btn,
.run-map__node-circle`, `.solo-menu__btn:hover,
.action-bar__btn:hover:enabled,
.action-bar__card:hover:enabled,
.encounter-panel__choice-btn:hover,
.encounter-panel__reward-btn:hover,
.run-end-report__btn:hover,
.run-map__node-circle:hover`, `.run-end-report__btn`
- **Usage sample:**
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.run-end-report__btn`
- **CSS body (primary):**
```css
.run-end-report__btn {
font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.7rem 1.5rem;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
```

---

## `.run-end-report__profile-bar-fill`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.run-end-report__profile-bar-fill`, `.run-end-report__profile-row--dominant .run-end-report__profile-bar-fill`
- **Usage sample:**
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.run-end-report__profile-bar-fill`
- **CSS body (primary):**
```css
.run-end-report__profile-bar-fill {
height: 100%;
  background: var(--accent);
  transition: width 0.5s ease;
}
```

---

## `.run-end-report__profile-key`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-end-report__profile-key`, `.run-end-report__profile-key`, `.run-end-report__profile-row--dominant .run-end-report__profile-key`
- **Usage sample:**
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.run-end-report__profile-key`
- **CSS body (primary):**
```css
.run-end-report__profile-key {
font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.run-end-report__relic-name`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-end-report__relic-name`, `.run-end-report__relic-name`, `.solo-run .run-end-report__relic-name`
- **Usage sample:**
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.run-end-report__relic-name`
- **CSS body (primary):**
```css
.run-end-report__relic-name {
font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: #f0a500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

---

## `.run-end-report__section-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-end-report__section-label`
- **Usage sample:**
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.run-end-report__section-label`
- **CSS body (primary):**
```css
.run-end-report__section-label {
font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.4rem;
  margin-bottom: 0.5rem;
}
```

---

## `.run-end-report__stat-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 6 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-end-report__stat-label`, `.run-end-report__stat-label`, `.solo-run .run-end-report__stat-label`
- **Usage sample:**
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.run-end-report__stat-label`
- **CSS body (primary):**
```css
.run-end-report__stat-label {
font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.run-end-report__status`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-end-report__status`, `.run-end-report--won  .run-end-report__status`, `.run-end-report--lost .run-end-report__status`
- **Usage sample:**
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.run-end-report__status`
- **CSS body (primary):**
```css
.run-end-report__status {
font-family: var(--font-mono);
  font-size: clamp(1.2rem, 4vw, 2rem);
  font-weight: 800;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
```

---

## `.run-fragment-slot--found`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.run-fragment-slot--found`
- **Selector:** `.run-fragment-slot--found`
- **CSS body (primary):**
```css
.run-fragment-slot--found {
border-color: var(--accent-primary, #7c5cff);
  color: var(--text-primary, #cfcfe3);
  background: rgba(124,92,255,.1);
  box-shadow: 0 0 6px rgba(124,92,255,.2);
}
```

---

## `.run-hud--void-critical`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** void-flicker
- **Selectors (sample):** `/* Void critical overlay */
.run-hud--void-critical`
- **Selector:** `/* Void critical overlay */
.run-hud--void-critical`
- **CSS body (primary):**
```css
.run-hud--void-critical {
border-color: rgba(155, 89, 182, 0.6);
  animation: void-flicker 4s ease-in-out infinite;
}
```

---

## `.run-hud__bar-fill`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.run-hud__bar-fill`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.run-hud__bar-fill`
- **CSS body (primary):**
```css
.run-hud__bar-fill {
height: 100%;
  transition: width 0.3s ease;
}
```

---

## `.run-hud__bar-fill--hp-low`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** danger-pulse
- **Selectors (sample):** `.run-hud__bar-fill--hp-low`
- **Selector:** `.run-hud__bar-fill--hp-low`
- **CSS body (primary):**
```css
.run-hud__bar-fill--hp-low {
background: #e74c3c !important; animation: danger-pulse 1.5s ease-in-out infinite;
}
```

---

## `.run-hud__bar-fill--noise-critical`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** danger-pulse
- **Selectors (sample):** `.run-hud__bar-fill--noise-critical`
- **Selector:** `.run-hud__bar-fill--noise-critical`
- **CSS body (primary):**
```css
.run-hud__bar-fill--noise-critical {
background: #e74c3c !important; animation: danger-pulse 1s ease-in-out infinite;
}
```

---

## `.run-hud__bar-fill--void`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** run-hud-pulse
- **Selectors (sample):** `.run-hud__bar-fill--void`, `.run-hud__bar-row--void.void-active  .run-hud__bar-fill--void`, `.run-hud__bar-row--void.void-elevated .run-hud__bar-fill--void`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.run-hud__bar-row--void.void-critical .run-hud__bar-fill--void`
- **CSS body (primary):**
```css
.run-hud__bar-fill--void {
background: #c0392b; animation: run-hud-pulse 0.8s infinite;
}
```

---

## `.run-hud__bar-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-hud__bar-label`, `.run-hud__bar-label`, `.solo-run .run-hud__bar-label`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.run-hud__bar-label`
- **CSS body (primary):**
```css
.run-hud__bar-label {
font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.run-hud__bar-row--void`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** run-hud-pulse
- **Selectors (sample):** `.run-hud__bar-row--void.void-active  .run-hud__bar-fill--void`, `.run-hud__bar-row--void.void-elevated .run-hud__bar-fill--void`, `.run-hud__bar-row--void.void-critical .run-hud__bar-fill--void`
- **Selector:** `.run-hud__bar-row--void.void-critical .run-hud__bar-fill--void`
- **CSS body (primary):**
```css
.run-hud__bar-row--void {
background: #c0392b; animation: run-hud-pulse 0.8s infinite;
}
```

---

## `.run-hud__deck`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.run-hud__deck`, `.run-hud__deck:hover`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.run-hud__deck`
- **CSS body (primary):**
```css
.run-hud__deck {
display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border: 1px solid transparent;
  transition: border-color 0.15s;
}
```

---

## `.run-hud__deck-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-hud__deck-label`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.run-hud__deck-label`
- **CSS body (primary):**
```css
.run-hud__deck-label {
letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

---

## `.run-hud__fragmentation`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** frag-warn-pulse
- **Selectors (sample):** `/* Fragmentation badge */
.run-hud__fragmentation`
- **Selector:** `/* Fragmentation badge */
.run-hud__fragmentation`
- **CSS body (primary):**
```css
.run-hud__fragmentation {
font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  padding: 0.3rem 0.6rem;
  border: 1px solid rgba(231, 76, 60, 0.5);
  color: #e74c3c;
  animation: frag-warn-pulse 1.5s ease-in-out infinite;
}
```

---

## `.run-hud__fragmentation--stack2`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Selectors (sample):** `.run-hud__fragmentation--stack2`
- **Selector:** `.run-hud__fragmentation--stack2`
- **CSS body (primary):**
```css
.run-hud__fragmentation--stack2 {
border-color: #e74c3c; animation-duration: 1s;
}
```

---

## `.run-hud__name`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-hud__name`, `.run-hud__name`, `.solo-run .run-hud__name`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.run-hud__name`
- **CSS body (primary):**
```css
.run-hud__name {
font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## `.run-hud__status-badge`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-hud__status-badge`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.run-hud__status-badge`
- **CSS body (primary):**
```css
.run-hud__status-badge {
font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 0.15rem 0.4rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

---

## `.run-map__node-circle`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `/* ── UI polish: glow, contrast, hover ──────────────────────────────────────── */

.solo-menu__btn,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__btn,
.run-map__node-circle`, `.solo-menu__btn:hover,
.action-bar__btn:hover:enabled,
.action-bar__card:hover:enabled,
.encounter-panel__choice-btn:hover,
.encounter-panel__reward-btn:hover,
.run-end-report__btn:hover,
.run-map__node-circle:hover`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `.run-map__node-circle`
- **CSS body (primary):**
```css
.run-map__node-circle {
fill: var(--bg-card);
  stroke: var(--border);
  stroke-width: 1.5;
  transition: fill 0.2s, stroke 0.2s;
}
```

---

## `.run-map__node-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-map__node-label`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `.run-map__node-label`
- **CSS body (primary):**
```css
.run-map__node-label {
font-size: 11px;
  fill: var(--text-muted);
  font-family: var(--font-mono);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  pointer-events: none;
}
```

---

## `.run-map__node-pulse`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** map-node-pulse
- **Selectors (sample):** `.run-map__node-pulse`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `.run-map__node-pulse`
- **CSS body (primary):**
```css
.run-map__node-pulse {
fill: none;
  stroke: var(--accent);
  stroke-width: 1;
  opacity: 0;
  animation: map-node-pulse 1.6s ease-in-out infinite;
}
```

---

## `.run-map__title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.run-map__title`, `.solo-run .run-map__title`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `.run-map__title`
- **CSS body (primary):**
```css
.run-map__title {
font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.run-nav-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.run-nav-btn`, `.run-nav-btn:hover`
- **Selector:** `.run-nav-btn`
- **CSS body (primary):**
```css
.run-nav-btn {
font-family: 'Text02', monospace;
  font-size: .6rem;
  letter-spacing: .1em;
  padding: 5px 10px;
  border-radius: 5px;
  border: 1px solid var(--border-secondary, rgba(255,255,255,.1));
  background: transparent;
  color: var(--text-secondary, rgba(207,207,227,.6));
  cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
}
```

---

## `.scanline`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition, transform
- **Animations:** none
- **Selectors (sample):** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **Selector:** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **CSS body (primary):**
```css
.scanline {
animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

---

## `.scene-comic`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.cyklus-card-scene.scene-comic`
- **Selector:** `.cyklus-card-scene.scene-comic`
- **CSS body (primary):**
```css
.scene-comic {
filter: saturate(1.08);
}
```

---

## `.scramble-base`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.scramble-base`, `body[data-theme="retro-arcade"] .scramble-title, body[data-theme="retro-arcade"] .scramble-layer, body[data-theme="retro-arcade"] .scramble-base`
- **Selector:** `.scramble-base`
- **CSS body (primary):**
```css
.scramble-base {
visibility: hidden; white-space: pre-wrap; line-height: inherit; font: inherit;
}
```

---

## `.scramble-layer`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, filter
- **Selectors (sample):** `.scramble-layer`, `body[data-theme="retro-arcade"] .scramble-title, body[data-theme="retro-arcade"] .scramble-layer, body[data-theme="retro-arcade"] .scramble-base`
- **Selector:** `.scramble-layer`
- **CSS body (primary):**
```css
.scramble-layer {
position: absolute; top: 0; left: 0; white-space: pre-wrap;
    color: var(--text-primary); text-shadow: 0 0 10px var(--glow-secondary);
    filter: var(--filter-primary, none); will-change: contents;
    line-height: inherit; font: inherit;
    font-variant-ligatures: none;
}
```

---

## `.scramble-title`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `/* =========================
     GLITCH SCRAMBLE TITLE (A11Y) – sjednoceno.
     ========================= */
  .scramble-title`, `body[data-theme="retro-arcade"] .scramble-title, body[data-theme="retro-arcade"] .scramble-layer, body[data-theme="retro-arcade"] .scramble-base`
- **Selector:** `/* =========================
     GLITCH SCRAMBLE TITLE (A11Y) – sjednoceno.
     ========================= */
  .scramble-title`
- **CSS body (primary):**
```css
.scramble-title {
position: relative; display: inline-block; line-height: 1.1;
}
```

---

## `.sector-tile`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, color-mix
- **Selectors (sample):** `/* --- Sector Tile ------------------------------------------------------ */
.sector-tile`, `.sector-tile`
- **Selector:** `/* --- Sector Tile ------------------------------------------------------ */
.sector-tile`
- **CSS body (primary):**
```css
.sector-tile {
width: 110px;
  height: 110px;
  border: 1px solid color-mix(in srgb, var(--text-primary, #e0ddf5) 15%, transparent);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 0.6rem;
  font-family: var(--font-mono, monospace);
  cursor: default;
  transition: border-color 0.2s ease, background 0.2s ease;
  overflow: hidden;
  padding: 4px;
  gap: 2px;
}
```

---

## `.sector-tile--active-player`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `.sector-tile--active-player`
- **Selector:** `.sector-tile--active-player`
- **CSS body (primary):**
```css
.sector-tile--active-player {
border-color: #7af;
  box-shadow: 0 0 8px color-mix(in srgb, #7af 30%, transparent);
}
```

---

## `.sector-tile--corrupted`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.sector-tile--corrupted`
- **Selector:** `.sector-tile--corrupted`
- **CSS body (primary):**
```css
.sector-tile--corrupted {
background: color-mix(in srgb, #0a0a0f 80%, #2a0010);
  border-color: #c03060;
}
```

---

## `.sector-tile--hidden`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.sector-tile--hidden`
- **Selector:** `.sector-tile--hidden`
- **CSS body (primary):**
```css
.sector-tile--hidden {
background: color-mix(in srgb, #0a0a0f 90%, #1a1a2a);
  border-color: color-mix(in srgb, var(--text-primary, #e0ddf5) 8%, transparent);
}
```

---

## `.sector-tile--revealed`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.sector-tile--revealed`
- **Selector:** `.sector-tile--revealed`
- **CSS body (primary):**
```css
.sector-tile--revealed {
background: color-mix(in srgb, #0a0a0f 85%, #101028);
}
```

---

## `.sector-tile--stable`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.sector-tile--stable`
- **Selector:** `.sector-tile--stable`
- **CSS body (primary):**
```css
.sector-tile--stable {
background: color-mix(in srgb, #0a0a0f 80%, #0a2010);
  border-color: #40b060;
}
```

---

## `.selected`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\base.css, src\styles\components-choice.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`, `/* Vybraná odpověď */
p.choice[data-tags] > .choice-link.selected,
p.choice[data-tags].selected:not(:has(> .choice-link)),
p.choice[data-tags] > .choice-link.chosen,
p.choice[data-tags].chosen:not(:has(> .choice-link))`
- **Selector:** `p.choice[data-tags] > .choice-link:hover,
  p.choice[data-tags]:not(:has(> .choice-link)):hover,
  p.choice[data-tags] > .choice-link.selected,
  p.choice[data-tags] > .choice-link.chosen,
  p.choice[data-tags].selected:not(:has(> .choice-link)),
  p.choice[data-tags].chosen:not(:has(> .choice-link))`
- **CSS body (primary):**
```css
.selected {
border-color: var(--choice-accent, var(--accent-secondary, #0ff));
    box-shadow: 0 0 12px var(--choice-accent, var(--accent-secondary, #0ff));
}
```

---

## `.shinning`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.shinning`
- **Selector:** `.shinning`
- **CSS body (primary):**
```css
.shinning {
text-decoration: underline;
  text-decoration-color: rgba(0,255,204,.45);
  text-underline-offset: 3px;
  text-shadow: 0 0 10px rgba(0,255,204,.35);
}
```

---

## `.skip-to-content`

- **Status:** defined
- **CSS files:** src\styles\base.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `}

/* Skip-to-content accessibility link */
.skip-to-content`, `.skip-to-content:focus,
.skip-to-content:focus-visible`, `.skip-to-content:focus,
.skip-to-content:focus-visible`
- **Usage sample:**
  - `src\components\synthoma-os\SynthomaSkipLink.tsx`
- **Selector:** `}

/* Skip-to-content accessibility link */
.skip-to-content`
- **CSS body (primary):**
```css
.skip-to-content {
position: fixed;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-skip-link, 9999);
  padding: 0.75rem 1.5rem;
  background: var(--bg-tertiary, #111);
  color: var(--text-primary, #0ff);
  border: 1px solid var(--border-primary, #0ff);
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: top 0.2s ease;
}
```

---

## `.slider-value`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `#control-panel .slider-value`, `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`, `#control-panel .slider-value`
- **Selector:** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`
- **CSS body (primary):**
```css
.slider-value {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.solo-menu__back-link`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `.solo-menu__back-link`, `.solo-menu__back-link:hover`, `.solo-menu .solo-menu__back-link`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__back-link`
- **CSS body (primary):**
```css
.solo-menu__back-link {
font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-decoration: none;
  text-transform: uppercase;
  transition: color 0.15s;
}
```

---

## `.solo-menu__btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `.solo-menu__btn`, `/* ── UI polish: glow, contrast, hover ──────────────────────────────────────── */

.solo-menu__btn,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__btn,
.run-map__node-circle`, `.solo-menu__btn:hover,
.action-bar__btn:hover:enabled,
.action-bar__card:hover:enabled,
.encounter-panel__choice-btn:hover,
.encounter-panel__reward-btn:hover,
.run-end-report__btn:hover,
.run-map__node-circle:hover`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__btn:hover,
.action-bar__btn:hover:enabled,
.action-bar__card:hover:enabled,
.encounter-panel__choice-btn:hover,
.encounter-panel__reward-btn:hover,
.run-end-report__btn:hover,
.run-map__node-circle:hover`
- **CSS body (primary):**
```css
.solo-menu__btn {
transform: translateY(-2px);
  box-shadow: 0 0 18px rgba(0, 255, 224, 0.25);
  border-color: var(--accent);
}
```

---

## `.solo-menu__btn--continue`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.solo-menu__btn--start,
.solo-menu__btn--continue`, `.solo-menu__btn--start:hover,
.solo-menu__btn--continue:hover`, `.solo-menu__btn--continue`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__btn--start:hover,
.solo-menu__btn--continue:hover`
- **CSS body (primary):**
```css
.solo-menu__btn--continue {
background: rgba(0, 255, 224, 0.18);
  box-shadow: 0 0 22px rgba(0, 255, 224, 0.35);
}
```

---

## `.solo-menu__btn--help`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* ── Solo help modal ─────────────────────────────────────────────────────────── */

.solo-menu__btn--help`, `.solo-menu__btn--help:hover`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__btn--help:hover`
- **CSS body (primary):**
```css
.solo-menu__btn--help {
background: rgba(0, 255, 224, 0.12);
  border-color: var(--accent);
  color: var(--accent);
  box-shadow: 0 0 18px rgba(0, 255, 224, 0.25);
}
```

---

## `.solo-menu__btn--start`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.solo-menu__btn--start,
.solo-menu__btn--continue`, `.solo-menu__btn--start:hover,
.solo-menu__btn--continue:hover`, `.solo-menu__btn--start`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__btn--start:hover,
.solo-menu__btn--continue:hover`
- **CSS body (primary):**
```css
.solo-menu__btn--start {
background: rgba(0, 255, 224, 0.18);
  box-shadow: 0 0 22px rgba(0, 255, 224, 0.35);
}
```

---

## `.solo-menu__help-modal`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.solo-menu__help-modal`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__help-modal`
- **CSS body (primary):**
```css
.solo-menu__help-modal {
background: var(--bg-card);
  border: 1px solid var(--accent);
  max-width: 640px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
  box-shadow: 0 0 30px rgba(0, 255, 224, 0.15);
}
```

---

## `.solo-menu__help-title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.solo-menu__help-title`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__help-title`
- **CSS body (primary):**
```css
.solo-menu__help-title {
font-family: var(--font-mono);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
}
```

---

## `.solo-menu__input`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `/* ── Larger fonts for roguelite UI ─────────────────────────────────────────── */

.solo-menu__input`, `.solo-menu__input::placeholder`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__input`
- **CSS body (primary):**
```css
.solo-menu__input {
background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 1rem;
  padding: 0.6rem 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}
```

---

## `.solo-menu__label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.solo-menu__label`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__label`
- **CSS body (primary):**
```css
.solo-menu__label {
font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.solo-menu__run-type-btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `/* ── Roguelite readability & theme alias ───────────────────────────────────── */

.solo-menu,
.solo-run,
.run-hud,
.enemy-card,
.action-bar,
.encounter-panel,
.run-end-report,
.run-map,
.solo-menu__run-type-btn,
.solo-menu__input,
.action-bar__btn,
.action-bar__card,
.encounter-panel__choice-btn,
.encounter-panel__reward-btn,
.run-end-report__stat,
.run-end-report__relic,
.run-map__node-circle`, `.solo-menu__run-type-btn`, `.solo-menu__run-type-btn:hover`
- **Selector:** `.solo-menu__run-type-btn`
- **CSS body (primary):**
```css
.solo-menu__run-type-btn {
display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  font-family: var(--font-mono);
}
```

---

## `.solo-menu__run-type-btn--selected`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.solo-menu__run-type-btn--selected`, `.solo-menu__run-type-btn--selected`
- **Selector:** `.solo-menu__run-type-btn--selected`
- **CSS body (primary):**
```css
.solo-menu__run-type-btn--selected {
border-color: var(--accent);
  background: rgba(0, 255, 224, 0.12);
  box-shadow: 0 0 16px rgba(0, 255, 224, 0.2);
}
```

---

## `.solo-menu__run-type-label`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.solo-menu__run-type-label`, `.solo-menu__run-type-label`, `.solo-menu .solo-menu__run-type-label`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__run-type-label`
- **CSS body (primary):**
```css
.solo-menu__run-type-label {
font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
```

---

## `.solo-menu__subtitle`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.solo-menu__subtitle`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__subtitle`
- **CSS body (primary):**
```css
.solo-menu__subtitle {
font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.2em;
  color: var(--text-muted);
  text-transform: uppercase;
}
```

---

## `.solo-menu__title`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.solo-menu__title`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-menu__title`
- **CSS body (primary):**
```css
.solo-menu__title {
font-family: var(--font-mono);
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--accent);
  text-transform: uppercase;
}
```

---

## `.solo-run__help-btn`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.solo-run__help-btn`, `.solo-run__help-btn:hover`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.solo-run__help-btn`
- **CSS body (primary):**
```css
.solo-run__help-btn {
position: fixed;
  bottom: 1.25rem;
  left: 1.25rem;
  z-index: 10000;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--accent);
  background: var(--bg-card);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(0, 255, 224, 0.15);
  transition: transform 0.15s, box-shadow 0.15s;
}
```

---

## `.speed-btn`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `/* Speed btn – s active glow. */
  .speed-btn`, `.speed-btn:hover`, `.speed-btn.active`
- **Selector:** `.speed-btn:hover`
- **CSS body (primary):**
```css
.speed-btn {
background: var(--border-secondary); transform: translateY(-1px);
}
```

---

## `.spinner-ring`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** spin
- **Selectors (sample):** `.spinner-ring`, `.spinner-ring:nth-child(2)`, `.spinner-ring:nth-child(3)`
- **Selector:** `.spinner-ring`
- **CSS body (primary):**
```css
.spinner-ring {
position: absolute; width: 100%; height: 100%;
    border: 4px solid transparent; border-top-color: var(--accent-primary);
    border-radius: 50%; animation: spin 1s linear infinite;
}
```

---

## `.static-noise`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 26 occurrences across 14 files
- **Effect properties:** animation, blend-mode
- **Animations:** staticDrift
- **Selectors (sample):** `}
.static-noise`, `.static-noise::after`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-2 [RUN].html`
  - `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM].html`
  - `public\books\SYNTHOMA-NULL\0-3 [DISCONTINUUM]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
- **Selector:** `.static-noise::after`
- **CSS body (primary):**
```css
.static-noise {
content: '';
  position: absolute; inset: 0; pointer-events: none;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.15"/></svg>');
  mix-blend-mode: overlay; animation: staticDrift 6s ease-in-out infinite;
  z-index: 1;
}
```

---

## `.subject-verification`

- **Status:** defined
- **CSS files:** src\styles\profile.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.subject-profile-label,
.subject-log-label,
.subject-verification,
.subject-system-status span,
.profile-section-heading > span,
.profile-overview__summaries > section > span,
.subject-dossier__topbar span`, `.subject-verification`, `.subject-verification i`
- **Usage sample:**
  - `src\components\profile\SubjectHeader.tsx`
- **Selector:** `.subject-verification i`
- **CSS body (primary):**
```css
.subject-verification {
width: 7px;
  height: 7px;
  background: var(--cy-accent-primary);
  box-shadow: var(--cy-glow-primary);
}
```

---

## `.sync-overlay`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter, backdrop-filter, transition
- **Selectors (sample):** `/* ── Chapter Sync Log ────────────────────────────────────────────────────── */
.sync-overlay`
- **Selector:** `/* ── Chapter Sync Log ────────────────────────────────────────────────────── */
.sync-overlay`
- **CSS body (primary):**
```css
.sync-overlay {
position: fixed;
  inset: 0;
  background: rgba(0,0,0,.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  opacity: 0;
  transition: opacity .3s;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  padding: 20px;
}
```

---

## `.sync-panel`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.sync-panel`, `.sync-panel.os-surface`, `.sync-panel`
- **Usage sample:**
  - `src\components\run\ChapterSyncLog.tsx`
- **Selector:** `.sync-panel`
- **CSS body (primary):**
```css
.sync-panel {
padding: 24px;
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 0 40px rgba(124,92,255,.15);
}
```

---

## `.synth-gate-actions`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.synth-gate-actions`, `.synth-gate-actions .choice`, `.synth-gate-actions`
- **Selector:** `.synth-gate-actions`
- **CSS body (primary):**
```css
.synth-gate-actions {
display: flex;
flex-wrap: wrap;
align-items: center;
gap: 0.85rem;
margin-top: 1.35rem;
}
```

---

## `.synth-gate-chip`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transform, color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `.synth-gate-chip`, `.synth-gate-chip strong`
- **Selector:** `.synth-gate-chip`
- **CSS body (primary):**
```css
.synth-gate-chip {
display: inline-flex;
align-items: center;
gap: 0.42rem;
padding: 0.42rem 0.72rem;
border: 1px solid color-mix(in oklab, var(--gate-cyan) 25%, transparent);
border-radius: 999px;
background: rgba(0, 10, 22, 0.56);
box-shadow:
inset 0 0 18px color-mix(in oklab, var(--gate-cyan) 7%, transparent),
0 0 10px rgba(0, 0, 0, 0.25);
color: rgba(230, 255, 255, 0.88);
font-family: 'Text03i', monospace;
font-size: 0.82rem;
line-height: 1;
letter-spacing: 0.06em;
text-transform: uppercase;
}
```

---

## `.synth-gate-corner`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, box-shadow
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `/* optional small corner labels */
.synth-gate-corner`, `.synth-gate-corner.is-left`
- **Selector:** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`
- **CSS body (primary):**
```css
.synth-gate-corner {
background: transparent;
    border-color: var(--border-primary, rgba(0,255,255,0.3));
    box-shadow: none;
    text-shadow: none;
}
```

---

## `.synth-gate-danger`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.synth-gate-danger`, `.synth-gate-danger strong`, `.synth-gate-danger`
- **Selector:** `.synth-gate-danger`
- **CSS body (primary):**
```css
.synth-gate-danger {
border-color: color-mix(in oklab, var(--gate-red) 35%, transparent);
}
```

---

## `.synth-gate-grid`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, box-shadow
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `/* subtle grid behind title */
.synth-gate-grid`, `}

/* no-animations app toggle compatibility */
.no-animations .synth-gateway-shell::after,
.no-animations .synth-gate-title::before,
.no-animations .synth-gate-title::after,
.no-animations .synth-gate-noise,
.no-animations .synth-gate-grid,
.no-animations .synth-gate-orbit,
.no-animations .synth-gate-pulse,
.no-animations .synth-gate-ritual::after,
.no-animations .synth-gate-primary::after,
.no-animations .synth-gate-terminal .blink`
- **Selector:** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`
- **CSS body (primary):**
```css
.synth-gate-grid {
background: transparent;
    border-color: var(--border-primary, rgba(0,255,255,0.3));
    box-shadow: none;
    text-shadow: none;
}
```

---

## `.synth-gate-help`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `.synth-gate-help`, `.synth-gate-help .choice`
- **Selector:** `.synth-gate-help .choice:hover`
- **CSS body (primary):**
```css
.synth-gate-help {
text-shadow:
0 0 8px color-mix(in oklab, var(--gate-cyan) 55%, transparent),
0 0 14px color-mix(in oklab, var(--gate-magenta) 35%, transparent);
}
```

---

## `.synth-gate-noise`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, blend-mode
- **Animations:** synthNoiseDrift
- **Selectors (sample):** `/* floating noise layer */
.synth-gate-noise`, `}

/* no-animations app toggle compatibility */
.no-animations .synth-gateway-shell::after,
.no-animations .synth-gate-title::before,
.no-animations .synth-gate-title::after,
.no-animations .synth-gate-noise,
.no-animations .synth-gate-grid,
.no-animations .synth-gate-orbit,
.no-animations .synth-gate-pulse,
.no-animations .synth-gate-ritual::after,
.no-animations .synth-gate-primary::after,
.no-animations .synth-gate-terminal .blink`, `/* floating noise layer */
.synth-gate-noise`
- **Selector:** `/* floating noise layer */
.synth-gate-noise`
- **CSS body (primary):**
```css
.synth-gate-noise {
position: absolute;
inset: 0;
z-index: -1;
pointer-events: none;
opacity: 0.23;
mix-blend-mode: screen;
background-image:
radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.24) 0 1px, transparent 1px),
radial-gradient(circle at 70% 40%, rgba(0, 255, 255, 0.22) 0 1px, transparent 1px),
radial-gradient(circle at 35% 80%, rgba(255, 0, 255, 0.20) 0 1px, transparent 1px),
radial-gradient(circle at 90% 70%, rgba(246, 255, 0, 0.16) 0 1px, transparent 1px);
background-size: 34px 34px, 46px 46px, 58px 58px, 74px 74px;
animation: synthNoiseDrift 9s steps(8) infinite;
}
```

---

## `.synth-gate-orbit`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform, color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `/* orbital sigil */
.synth-gate-orbit`, `.synth-gate-orbit::before,
.synth-gate-orbit::after`
- **Selector:** `.synth-gate-orbit::before,
.synth-gate-orbit::after`
- **CSS body (primary):**
```css
.synth-gate-orbit {
content: "";
position: absolute;
inset: 14%;
border: 1px solid color-mix(in oklab, var(--gate-magenta) 32%, transparent);
border-radius: 50%;
transform: rotate(28deg) scaleX(0.55);
}
```

---

## `.synth-gate-primary`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `.synth-gate-primary`, `.synth-gate-primary::after`
- **Selector:** `.synth-gate-primary`
- **CSS body (primary):**
```css
.synth-gate-primary {
position: relative;
overflow: hidden;
border-color: color-mix(in oklab, var(--gate-cyan) 40%, transparent) !important;
background:
linear-gradient(135deg, color-mix(in oklab, var(--gate-cyan) 18%, transparent), color-mix(in oklab, var(--gate-magenta) 18%, transparent)),
rgba(0, 0, 0, 0.28) !important;
box-shadow:
0 0 14px color-mix(in oklab, var(--gate-cyan) 18%, transparent),
inset 0 0 18px color-mix(in oklab, var(--gate-magenta) 8%, transparent);
}
```

---

## `.synth-gate-pulse`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, animation, color-mix
- **Animations:** synthPulse
- **Selectors (sample):** `.synth-gate-pulse`, `}

/* no-animations app toggle compatibility */
.no-animations .synth-gateway-shell::after,
.no-animations .synth-gate-title::before,
.no-animations .synth-gate-title::after,
.no-animations .synth-gate-noise,
.no-animations .synth-gate-grid,
.no-animations .synth-gate-orbit,
.no-animations .synth-gate-pulse,
.no-animations .synth-gate-ritual::after,
.no-animations .synth-gate-primary::after,
.no-animations .synth-gate-terminal .blink`, `.synth-gate-pulse`
- **Selector:** `.synth-gate-pulse`
- **CSS body (primary):**
```css
.synth-gate-pulse {
width: 0.55rem;
height: 0.55rem;
border-radius: 999px;
background: var(--gate-cyan);
box-shadow: 0 0 14px color-mix(in oklab, var(--gate-cyan) 80%, transparent);
animation: synthPulse 1.45s ease-in-out infinite;
}
```

---

## `.synth-gate-ritual`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `.synth-gate-ritual`, `.synth-gate-ritual::before`
- **Selector:** `.synth-gate-ritual`
- **CSS body (primary):**
```css
.synth-gate-ritual {
position: relative;
max-width: 920px;
margin: 1.35rem 0;
padding: 1rem 1.05rem 1rem 1.15rem;
border-left: 2px solid color-mix(in oklab, var(--gate-magenta) 42%, transparent);
background:
linear-gradient(90deg, color-mix(in oklab, var(--gate-magenta) 10%, transparent), transparent 72%),
linear-gradient(180deg, rgba(255, 255, 255, 0.025), rgba(0, 0, 0, 0.02));
}
```

---

## `.synth-gate-status`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.synth-gate-status`, `.synth-gate-status`, `.synth-gate-status`
- **Selector:** `.synth-gate-status`
- **CSS body (primary):**
```css
.synth-gate-status {
display: flex;
flex-wrap: wrap;
gap: 0.55rem;
margin: 1.05rem 0 1.35rem;
}
```

---

## `.synth-gate-subtitle`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `.synth-gate-subtitle`, `.synth-gate-subtitle`
- **Selector:** `.synth-gate-subtitle`
- **CSS body (primary):**
```css
.synth-gate-subtitle {
max-width: 860px;
margin: 0.55rem 0 1.15rem;
color: color-mix(in oklab, var(--text-primary) 88%, var(--gate-cyan));
opacity: 0.94;
}
```

---

## `.synth-gate-terminal`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `.synth-gate-terminal`, `.synth-gate-terminal span`
- **Selector:** `.synth-gate-terminal`
- **CSS body (primary):**
```css
.synth-gate-terminal {
max-width: 760px;
margin-top: 1.2rem;
padding: 0.84rem 0.95rem;
border: 1px solid color-mix(in oklab, var(--gate-cyan) 17%, transparent);
border-radius: 14px;
background: rgba(0, 0, 0, 0.34);
color: color-mix(in oklab, var(--text-primary) 86%, var(--gate-cyan));
font-family: 'Text03i', monospace;
font-size: 0.92rem;
box-shadow: inset 0 0 18px rgba(0, 255, 255, 0.035);
}
```

---

## `.synth-gate-title`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, transform, color-mix
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `.synth-gate-title`, `/* avoid inherited title rail */
.synth-gate-title::before`
- **Selector:** `.synth-gate-title`
- **CSS body (primary):**
```css
.synth-gate-title {
position: relative;
display: block;
width: fit-content;
max-width: 100%;
margin: 0.5rem 0 0.4rem;
font-family: 'Synthoma', monospace;
font-size: clamp(3rem, 11vw, 8.2rem);
line-height: 0.84;
letter-spacing: 0.085em;
text-transform: uppercase;
color: var(--text-primary);
text-shadow:
0 0 12px color-mix(in oklab, var(--gate-cyan) 60%, transparent),
0 0 28px color-mix(in oklab, var(--gate-magenta) 34%, transparent),
0 0 52px color-mix(in oklab, var(--gate-cyan) 18%, transparent);
}
```

---

## `.synth-gate-warning`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.synth-gate-warning`, `.synth-gate-warning strong`, `.synth-gate-warning`
- **Selector:** `.synth-gate-warning`
- **CSS body (primary):**
```css
.synth-gate-warning {
border-color: color-mix(in oklab, var(--gate-yellow) 32%, transparent);
color: rgba(255, 255, 220, 0.92);
}
```

---

## `.synth-gateway-shell`

- **Status:** defined
- **CSS files:** public\synth-gate.css, src\styles\base.css, src\styles\synth-gate.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, box-shadow
- **Selectors (sample):** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`, `﻿/* synth-gate.css
 * Styly pro SYNTHOMAINFO.html (SYNTHOMA Gateway intro).
 * Importováno přímo v SYNTHOMAINFO.html přes <link>.
 */

/* =========================
SYNTHOMA GATEWAY COMPONENTS
Intro brána: rituál, ne rozcestník.
Používá se v SYNTHOMAINFO.html.
========================= */

.synth-gateway-shell`, `/* CRT scanlines */
.synth-gateway-shell::before`
- **Selector:** `/* Synth gate */
  .synth-gateway-shell,
  .synth-gate-orbit,
  .synth-gate-grid,
  .synth-gate-corner,
  .synth-gate-title,
  .synth-gate-subtitle,
  .synth-gate-chip,
  .synth-gate-ritual,
  .synth-gate-terminal,
  .synth-gate-primary,
  .synth-gate-help .choice`
- **CSS body (primary):**
```css
.synth-gateway-shell {
background: transparent;
    border-color: var(--border-primary, rgba(0,255,255,0.3));
    box-shadow: none;
    text-shadow: none;
}
```

---

## `.synthoma-archive`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `/* Phase 5.2 Library & Archive shared CSS */

.synthoma-library,
.synthoma-archive`, `.synthoma-library .os-command,
.synthoma-archive .os-command`, `.synthoma-library .os-command:hover,
.synthoma-archive .os-command:hover`
- **Usage sample:**
  - `src\components\archive\SynthomaArchive.tsx`
- **Selector:** `.synthoma-library .os-command,
.synthoma-archive .os-command`
- **CSS body (primary):**
```css
.synthoma-archive {
display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--os-space-1);
  min-height: var(--os-tap);
  padding: 0 var(--os-space-3);
  background: var(--os-surface);
  border: var(--os-border-width) solid var(--os-border);
  color: var(--os-text);
  font-family: var(--os-font-mono, monospace);
  font-size: var(--os-text-control);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
```

---

## `.synthoma-archive__category-title`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.synthoma-archive__category-title`
- **Usage sample:**
  - `src\components\archive\SynthomaArchive.tsx`
- **Selector:** `.synthoma-archive__category-title`
- **CSS body (primary):**
```css
.synthoma-archive__category-title {
margin: 0; color: var(--os-accent-primary); font: 700 var(--os-font-size-sm)/1.3 var(--font-mono, monospace); text-transform: uppercase;
}
```

---

## `.synthoma-archive__section-title`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 5 occurrences across 2 files
- **Effect properties:** transform
- **Selectors (sample):** `.synthoma-archive__section-title`
- **Usage sample:**
  - `src\components\archive\ArchiveBookGrid.tsx`
  - `src\components\archive\SynthomaArchive.tsx`
- **Selector:** `.synthoma-archive__section-title`
- **CSS body (primary):**
```css
.synthoma-archive__section-title {
font-size: var(--os-font-size-lg);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--os-text-muted);
}
```

---

## `.synthoma-audio-panel`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transform
- **Selectors (sample):** `/* Standalone music channel backed by the single shared audio element. */

.synthoma-audio-panel`, `.synthoma-audio-panel.is-open`, `.synthoma-audio-panel.is-open .synthoma-audio-panel__surface`
- **Selector:** `.synthoma-audio-panel.is-open .synthoma-audio-panel__surface`
- **CSS body (primary):**
```css
.synthoma-audio-panel {
opacity: 1;
  transform: none;
}
```

---

## `.synthoma-audio-panel__kicker`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.synthoma-audio-panel__kicker`
- **Usage sample:**
  - `app\components\SynthomaAudioPanel.tsx`
- **Selector:** `.synthoma-audio-panel__kicker`
- **CSS body (primary):**
```css
.synthoma-audio-panel__kicker {
color: var(--cy-accent-primary);
  font: 800 var(--cy-font-micro)/1.3 var(--cy-font-mono);
  letter-spacing: 0.09em;
  text-transform: uppercase;
}
```

---

## `.synthoma-audio-panel__progress`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.synthoma-audio-panel__progress`, `.synthoma-audio-panel__progress input[type="range"]`, `.synthoma-audio-panel__progress input[type="range"]:disabled`
- **Usage sample:**
  - `app\components\SynthomaAudioPanel.tsx`
- **Selector:** `.synthoma-audio-panel__progress input[type="range"]::-webkit-slider-runnable-track`
- **CSS body (primary):**
```css
.synthoma-audio-panel__progress {
height: 3px;
  border: 0;
  background: linear-gradient(90deg, var(--cy-accent-primary) 0 var(--audio-progress), var(--cy-surface-3) var(--audio-progress) 100%);
  box-shadow: none;
}
```

---

## `.synthoma-audio-panel__surface`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.synthoma-audio-panel__surface`, `.synthoma-audio-panel.is-open .synthoma-audio-panel__surface`, `.synthoma-audio-panel.is-open .synthoma-audio-panel__surface`
- **Usage sample:**
  - `app\components\SynthomaAudioPanel.tsx`
- **Selector:** `.synthoma-audio-panel__surface`
- **CSS body (primary):**
```css
.synthoma-audio-panel__surface {
position: absolute;
  top: calc(60px + env(safe-area-inset-top));
  right: max(8px, env(safe-area-inset-right));
  display: flex;
  width: min(400px, calc(100vw - 16px));
  max-height: min(70dvh, 680px);
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--cy-line-strong);
  border-radius: var(--cy-theme-radius, 3px);
  background: var(--cy-surface-1);
  box-shadow: var(--cy-shadow), var(--cy-glow-primary);
  color: var(--cy-text);
  opacity: 0;
  transform: translateY(-6px);
  transition: opacity 150ms ease, transform 150ms ease;
}
```

---

## `.synthoma-audio-panel__track-copy`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `}

.synthoma-audio-panel__track-copy`, `.synthoma-audio-panel__track-copy strong,
.synthoma-audio-panel__track-copy small`, `.synthoma-audio-panel__track-copy strong,
.synthoma-audio-panel__track-copy small`
- **Usage sample:**
  - `app\components\SynthomaAudioPanel.tsx`
- **Selector:** `.synthoma-audio-panel__track-copy small`
- **CSS body (primary):**
```css
.synthoma-audio-panel__track-copy {
color: var(--cy-text-dim);
  font: 700 var(--cy-font-micro)/1.3 var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.synthoma-audio-panel__track-state`

- **Status:** defined
- **CSS files:** src\styles\audio-panel.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** audio-level
- **Selectors (sample):** `.synthoma-audio-panel__track-number,
.synthoma-audio-panel__track-state`, `.synthoma-audio-panel__track-state`, `.synthoma-audio-panel__track-state.is-playing`
- **Selector:** `.synthoma-audio-panel__track-state.is-playing i`
- **CSS body (primary):**
```css
.synthoma-audio-panel__track-state {
width: 2px;
  height: 45%;
  background: currentColor;
  animation: audio-level 620ms ease-in-out infinite alternate;
}
```

---

## `.synthoma-command-header`

- **Status:** defined
- **CSS files:** src\styles\reader.css, src\styles\synthoma-os\layout.css, src\styles\synthoma-os\responsive.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `html[data-reader-focus="on"] .synthoma-shell--quiet .synthoma-command-header`, `.synthoma-command-header`, `.synthoma-command-header`
- **Selector:** `.synthoma-command-header`
- **CSS body (primary):**
```css
.synthoma-command-header {
position: fixed;
  inset: 0 0 auto;
  z-index: var(--os-z-shell);
  display: grid;
  grid-template-columns: auto minmax(120px, 0.7fr) minmax(260px, 1fr) auto;
  height: var(--os-command-height);
  padding-inline: max(var(--os-space-3), env(safe-area-inset-left)) max(var(--os-space-3), env(safe-area-inset-right));
  align-items: center;
  gap: var(--os-space-3);
  border-bottom: 1px solid var(--os-border-strong);
  background: color-mix(in srgb, var(--os-bg) 94%, transparent);
  color: var(--os-text);
}
```

---

## `.synthoma-command-header__pulse`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\layout.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** os-signal-pulse
- **Selectors (sample):** `.synthoma-command-header__pulse`
- **Usage sample:**
  - `src\components\synthoma-os\SynthomaCommandHeader.tsx`
- **Selector:** `.synthoma-command-header__pulse`
- **CSS body (primary):**
```css
.synthoma-command-header__pulse {
width: 5px; height: 5px; flex: 0 0 5px; background: var(--os-success); animation: os-signal-pulse 1.8s ease-in-out infinite;
}
```

---

## `.synthoma-command-header__sectors`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\layout.css, src\styles\synthoma-os\responsive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.synthoma-command-header__sectors`, `.synthoma-command-header__sectors a`, `.synthoma-command-header__sectors a:last-child`
- **Usage sample:**
  - `src\components\synthoma-os\SynthomaCommandHeader.tsx`
- **Selector:** `.synthoma-command-header__sectors a[aria-current="page"]`
- **CSS body (primary):**
```css
.synthoma-command-header__sectors {
color: var(--os-text); box-shadow: inset 0 -2px 0 var(--os-accent-primary);
}
```

---

## `.synthoma-detail-dialog`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.synthoma-detail-dialog`
- **Usage sample:**
  - `src\components\archive\ArchiveDetailDialog.tsx`
  - `src\components\library\LibraryCoverDialog.tsx`
- **Selector:** `.synthoma-detail-dialog`
- **CSS body (primary):**
```css
.synthoma-detail-dialog {
position: relative;
  width: min(100%, 720px);
  max-height: calc(100dvh - var(--os-space-8));
  overflow-y: auto;
  color: var(--os-text);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}
```

---

## `.synthoma-detail-overlay`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `/* Detail dialog shared overlay */
.synthoma-detail-overlay`, `.synthoma-detail-overlay`
- **Usage sample:**
  - `src\components\archive\ArchiveDetailDialog.tsx`
  - `src\components\library\LibraryCoverDialog.tsx`
- **Selector:** `/* Detail dialog shared overlay */
.synthoma-detail-overlay`
- **CSS body (primary):**
```css
.synthoma-detail-overlay {
position: fixed;
  inset: 0;
  z-index: var(--os-z-modal, 90);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--os-space-4);
  background: rgba(0, 0, 0, 0.72);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
```

---

## `.synthoma-home`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.synthoma-home`, `.synthoma-home .synthoma-media-layer`, `.synthoma-home .synthoma-media-layer`
- **Usage sample:**
  - `src\components\home\SynthomaHome.tsx`
- **Selector:** `.synthoma-home .synthoma-media-layer`
- **CSS body (primary):**
```css
.synthoma-home {
--os-media-opacity: 0.66;
  --synthoma-video-runtime-filter: brightness(0.72) contrast(1.1) saturate(0.92);
}
```

---

## `.synthoma-home__legal`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.synthoma-home__legal`, `.synthoma-home__legal a`, `.synthoma-home__legal a:hover`
- **Usage sample:**
  - `src\components\home\HomeMemorySignal.tsx`
  - `src\components\home\__tests__\SynthomaHomeSsr.test.tsx`
- **Selector:** `.synthoma-home__legal a:hover`
- **CSS body (primary):**
```css
.synthoma-home__legal {
color: var(--os-accent-primary); text-shadow: 0 0 6px var(--os-accent-primary);
}
```

---

## `.synthoma-intro__log`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\intro.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, color-mix
- **Animations:** os-boot-reveal
- **Selectors (sample):** `.synthoma-intro__log`, `.synthoma-intro__log`, `.synthoma-intro__log`
- **Selector:** `.synthoma-intro__log`
- **CSS body (primary):**
```css
.synthoma-intro__log {
display: grid;
  grid-template-columns: minmax(9rem, 0.34fr) minmax(0, 1fr);
  gap: 0 var(--os-space-4);
  padding-top: var(--os-space-2);
  border-top: 1px solid color-mix(in srgb, var(--os-border-strong) 55%, transparent);
  animation: os-boot-reveal var(--os-motion-normal) var(--os-ease-standard) both;
}
```

---

## `.synthoma-intro__motto`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\intro.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, color-mix
- **Selectors (sample):** `.synthoma-intro__motto`, `.synthoma-intro__motto`
- **Usage sample:**
  - `app\landing-intro\page.tsx`
- **Selector:** `.synthoma-intro__motto`
- **CSS body (primary):**
```css
.synthoma-intro__motto {
margin: var(--os-space-4) auto 0;
  max-width: 720px;
  color: var(--os-accent-primary, #0ff);
  font: 500 clamp(0.95rem, 1.5vw, 1.1rem)/1.6 var(--os-font-body);
  text-align: center;
  text-shadow: 0 0 8px color-mix(in srgb, var(--os-accent-primary, #0ff) 40%, transparent);
}
```

---

## `.synthoma-intro__scrim`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\intro.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.synthoma-intro__scrim`
- **Usage sample:**
  - `app\landing-intro\page.tsx`
- **Selector:** `.synthoma-intro__scrim`
- **CSS body (primary):**
```css
.synthoma-intro__scrim {
position: fixed;
  inset: 0;
  z-index: var(--os-z-base);
  background: radial-gradient(circle at 50% 44%, transparent 0 12%, color-mix(in srgb, var(--os-bg) 52%, transparent) 42%, var(--os-bg) 100%);
  pointer-events: none;
}
```

---

## `.synthoma-library`

- **Status:** defined
- **CSS files:** src\styles\library-archive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `/* Phase 5.2 Library & Archive shared CSS */

.synthoma-library,
.synthoma-archive`, `.synthoma-library .os-command,
.synthoma-archive .os-command`, `.synthoma-library .os-command:hover,
.synthoma-archive .os-command:hover`
- **Usage sample:**
  - `src\components\library\SynthomaLibrary.tsx`
- **Selector:** `.synthoma-library .os-command,
.synthoma-archive .os-command`
- **CSS body (primary):**
```css
.synthoma-library {
display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--os-space-1);
  min-height: var(--os-tap);
  padding: 0 var(--os-space-3);
  background: var(--os-surface);
  border: var(--os-border-width) solid var(--os-border);
  color: var(--os-text);
  font-family: var(--os-font-mono, monospace);
  font-size: var(--os-text-control);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
```

---

## `.synthoma-media-layer`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\home.css, src\styles\synthoma-os\intro.css, src\styles\synthoma-os\media.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.synthoma-home .synthoma-media-layer`, `.synthoma-home .synthoma-media-layer`, `.synthoma-intro .synthoma-media-layer`
- **Selector:** `.synthoma-home .synthoma-media-layer`
- **CSS body (primary):**
```css
.synthoma-media-layer {
--os-media-opacity: 0.66;
  --synthoma-video-runtime-filter: brightness(0.72) contrast(1.1) saturate(0.92);
}
```

---

## `.synthoma-media-layer__brand-art`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\media.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** blend-mode
- **Selectors (sample):** `.synthoma-media-layer__brand-art`
- **Usage sample:**
  - `src\components\home\HomeBackground.tsx`
- **Selector:** `.synthoma-media-layer__brand-art`
- **CSS body (primary):**
```css
.synthoma-media-layer__brand-art {
position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: screen;
  opacity: 0.2;
}
```

---

## `.synthoma-media-layer__fallback`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\media.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.synthoma-media-layer__video,
.synthoma-media-layer__fallback`, `.synthoma-media-layer__fallback`
- **Usage sample:**
  - `src\components\synthoma-os\SynthomaMediaLayer.tsx`
- **Selector:** `.synthoma-media-layer__fallback`
- **CSS body (primary):**
```css
.synthoma-media-layer__fallback {
background-color: var(--os-bg-deep);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  filter: var(--synthoma-media-theme-filter, none);
}
```

---

## `.synthoma-media-layer__video`

- **Status:** defined
- **CSS files:** src\styles\motion-contract.css, src\styles\synthoma-os\media.css, src\styles\synthoma-os\motion.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `:root[data-background-motion="off"] .synthoma-media-layer__video,
:root[data-background-motion="off"] .video-background video,
:root[data-background-motion="off"] .lib-bg-video,
:root[data-background-motion="off"] .chapter-background__video,
:root[data-background-motion="off"] .cyklus-menu__video,
:root[data-background-motion="off"] #retro-video-canvas`, `.synthoma-media-layer__video,
.synthoma-media-layer__fallback`, `.synthoma-media-layer__video`
- **Usage sample:**
  - `src\components\synthoma-os\SynthomaMediaLayer.tsx`
- **Selector:** `.synthoma-media-layer__video`
- **CSS body (primary):**
```css
.synthoma-media-layer__video {
object-fit: cover;
  opacity: var(--os-media-opacity);
  filter: var(--synthoma-media-theme-filter, none) var(--synthoma-video-runtime-filter, none);
}
```

---

## `.synthoma-mobile-nav`

- **Status:** defined
- **CSS files:** src\styles\pwa.css, src\styles\synthoma-os\layout.css, src\styles\synthoma-os\responsive.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.synthoma-mobile-nav`, `.synthoma-command-header__commands svg,
.synthoma-mobile-nav svg`, `.synthoma-mobile-nav`
- **Usage sample:**
  - `src\components\synthoma-os\SynthomaMobileNavigation.tsx`
- **Selector:** `.synthoma-mobile-nav a[aria-current="page"]`
- **CSS body (primary):**
```css
.synthoma-mobile-nav {
color: var(--os-text); box-shadow: inset 0 2px 0 var(--os-accent-primary);
}
```

---

## `.synthoma-system-state__loader`

- **Status:** defined
- **CSS files:** src\styles\synthoma-os\system-states.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** animation
- **Animations:** os-signal-pulse
- **Selectors (sample):** `.synthoma-system-state__loader`, `.synthoma-system-state__loader::after`
- **Usage sample:**
  - `app\loading.tsx`
  - `app\resume\ResumeClient.tsx`
- **Selector:** `.synthoma-system-state__loader::after`
- **CSS body (primary):**
```css
.synthoma-system-state__loader {
content: ""; display: block; width: 38%; height: 100%; background: var(--os-accent-primary); animation: os-signal-pulse 1.2s ease-in-out infinite;
}
```

---

## `.synthoma-wordmark`

- **Status:** defined
- **CSS files:** src\styles\synthoma-wordmark.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, animation, transform
- **Animations:** synthoma-wordmark-breathe
- **Selectors (sample):** `/* Shared SYNTHOMA wordmark — used by Intro and Home */

.synthoma-wordmark`
- **Selector:** `/* Shared SYNTHOMA wordmark — used by Intro and Home */

.synthoma-wordmark`
- **CSS body (primary):**
```css
.synthoma-wordmark {
position: relative;
  display: inline-block;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  font-family: 'Synthoma', monospace;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--os-text, #c0faff);
  text-align: center;
  z-index: 10;
  -webkit-user-select: none;
  user-select: none;
  text-shadow:
    0 0 6px var(--os-accent-primary, #0ff),
    0 0 16px var(--os-accent-secondary, #ff00c8),
    0 0 36px var(--os-accent-primary, #0ff),
    2px 2px 12px var(--os-accent-secondary, #ff00c8);
  animation: synthoma-wordmark-breathe 2.4s ease-in-out infini…
}
```

---

## `.synthoma-wordmark__char`

- **Status:** defined
- **CSS files:** src\styles\synthoma-wordmark.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `.synthoma-wordmark__char,
.synthoma-wordmark__char.glitch-char`, `.synthoma-wordmark__char,
.synthoma-wordmark__char.glitch-char`, `.synthoma-wordmark__char.glitchy`
- **Usage sample:**
  - `src\components\synthoma\SynthomaWordmark.tsx`
- **Selector:** `.synthoma-wordmark__char,
.synthoma-wordmark__char.glitch-char`
- **CSS body (primary):**
```css
.synthoma-wordmark__char {
display: inline-block;
  width: 1ch;
  position: relative;
  z-index: 20;
  transition: color 0.06s, filter 0.12s, transform 0.10s;
  will-change: color, filter, transform;
  letter-spacing: inherit;
  margin: 0;
  padding: 0;
}
```

---

## `.synthoma-wordmark__layer--cyan`

- **Status:** defined
- **CSS files:** src\styles\synthoma-wordmark.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** synthoma-wordmark-glitch-2
- **Selectors (sample):** `}

.synthoma-wordmark__layer,
.synthoma-wordmark__layer--magenta,
.synthoma-wordmark__layer--cyan`, `.synthoma-wordmark__layer--cyan`
- **Usage sample:**
  - `src\components\synthoma\SynthomaWordmark.tsx`
- **Selector:** `.synthoma-wordmark__layer--cyan`
- **CSS body (primary):**
```css
.synthoma-wordmark__layer--cyan {
color: var(--os-accent-primary, #0ff);
  opacity: 0.44;
  text-shadow: -2px 0 var(--os-accent-primary, #0ff), 0 0 8px var(--os-accent-primary, #0ff), 0 0 28px rgba(0, 255, 255, 0.5);
  z-index: 2;
  animation: synthoma-wordmark-glitch-2 1.7s infinite linear alternate;
}
```

---

## `.synthoma-wordmark__layer--magenta`

- **Status:** defined
- **CSS files:** src\styles\synthoma-wordmark.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, animation
- **Animations:** synthoma-wordmark-glitch-1
- **Selectors (sample):** `}

.synthoma-wordmark__layer,
.synthoma-wordmark__layer--magenta,
.synthoma-wordmark__layer--cyan`, `.synthoma-wordmark__layer--magenta`
- **Usage sample:**
  - `src\components\synthoma\SynthomaWordmark.tsx`
- **Selector:** `.synthoma-wordmark__layer--magenta`
- **CSS body (primary):**
```css
.synthoma-wordmark__layer--magenta {
color: var(--os-accent-secondary, #ff00c8);
  opacity: 0.58;
  text-shadow: 2px 0 var(--os-accent-secondary, #ff00c8), 0 0 10px var(--os-accent-secondary, #ff00c8), 0 0 28px rgba(255, 0, 200, 0.6);
  z-index: 1;
  animation: synthoma-wordmark-glitch-1 2.2s infinite linear alternate;
}
```

---

## `.synthoma-wordmark__text`

- **Status:** defined
- **CSS files:** src\styles\synthoma-wordmark.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.synthoma-wordmark__text,
.synthoma-wordmark__text.glitch-real`, `.synthoma-wordmark__text,
.synthoma-wordmark__text.glitch-real`
- **Usage sample:**
  - `src\components\synthoma\SynthomaWordmark.tsx`
- **Selector:** `.synthoma-wordmark__text,
.synthoma-wordmark__text.glitch-real`
- **CSS body (primary):**
```css
.synthoma-wordmark__text {
position: relative;
  display: inline;
  z-index: 20;
  color: var(--os-accent-primary, #0ff);
  text-shadow: 0 0 6px var(--os-accent-primary, #0ff), 0 0 12px var(--os-accent-primary, #0ff), 2px 2px 10px rgba(255, 0, 200, 0.35);
}
```

---

## `.SYNTHOMAREADER`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, public\styles.css, src\styles\base.css, src\styles\book-reader-base.css, src\styles\components-choice.css, src\styles\components-dialog.css, src\styles\components.css, src\styles\effects.css, src\styles\reader.css
- **Used in:** 2 occurrences across 2 files
- **Effect properties:** box-shadow, color-mix
- **Selectors (sample):** `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `/* Dialog rails */
  .SYNTHOMAREADER p.log::before,
  .SYNTHOMAREADER p.dialog::before,
  #hero-info p.dialog::before,
  p.dialogS::before,
  p.dialogN::before,
  p.dialogD::before`, `.chapter-reader__article.SYNTHOMAREADER`
- **Usage sample:**
  - `app\autor\AutorClient.tsx`
  - `app\chapter\[id]\ChapterReaderArticle.tsx`
- **Selector:** `.SYNTHOMAREADER p.dialog::before, #hero-info p.dialog::before`
- **CSS body (primary):**
```css
.SYNTHOMAREADER {
content: '';
  position: absolute;
  left: -1px;
  width: 4px;
  top: calc(-1 * var(--para-rail-overlap, 0.2rem));
  bottom: calc(-1 * var(--para-rail-overlap, 0.2rem));
  height: auto;
  border-radius: 2px;
  background: transparent;
  box-shadow:
    -1px 0 4px 0px color-mix(in oklab, var(--accent-secondary, #0ff) 70%, transparent),
    1px 0 8px 0px color-mix(in oklab, var(--accent-primary, #f0f) 60%, transparent),
    0 0 12px 0 color-mix(in oklab, var(--accent-secondary, #0ff) 55%, transparent);

  z-index: 2;
  pointer-events: none;
  opacity: 0.6;
}
```

---

## `.tag-chip`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.archive-card .tag-chip`, `.archive-card .tag-chip:hover`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
- **Selector:** `.archive-card .tag-chip`
- **CSS body (primary):**
```css
.tag-chip {
background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 0.3rem 0.75rem;
    font-size: 1rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
}
```

---

## `.text`

- **Status:** defined
- **CSS files:** app\autor\autor.module.css, public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css, public\styles.css, src\styles\book-reader-base.css, src\styles\components.css, src\styles\library-archive.css, src\styles\reader.css
- **Used in:** 8336 occurrences across 57 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.chapter-reader__article.SYNTHOMAREADER .chapter-content,
.chapter-reader__article.SYNTHOMAREADER .chapter-content :where(.text, p:not(.log):not([class*="terminal"]):not([class*="system"]))`, `/* Reader line alignment – sjednoceno, bez duplicitních selectorů. */
  .SYNTHOMAREADER .tw-line.log, #hero-info .tw-line.log,
  .SYNTHOMAREADER .tw-line.dialog, #hero-info .tw-line.dialog,
  .SYNTHOMAREADER .tw-line.dialogS, #hero-info .tw-line.dialogS,
  .SYNTHOMAREADER .tw-line.dialogN, #hero-info .tw-line.dialogN,
  .SYNTHOMAREADER .tw-line.dialogG, #hero-info .tw-line.dialogG,
  .SYNTHOMAREADER .tw-line.text, #hero-info .tw-line.text,
  .SYNTHOMAREADER .tw-line.title, #hero-info .tw-line.title,
  .SYNTHOMAREADER p.log, #hero-info p.log,
  .SYNTHOMAREADER p.dialog, #hero-info p.dialog,
  .SYNTHOMAREADER p.dialogS, #hero-info p.dialogS,
  .SYNTHOMAREADER p.dialogN, #hero-info p.dialogN,
  .SYNTHOMAREADER p.dialogG, #hero-info p.dialogG,
  .SYNTHOMAREADER p.text, #hero-info p.text,
  .SYNTHOMAREADER p.title, #hero-info p.title`, `/* Reader line alignment – sjednoceno, bez duplicitních selectorů. */
  .SYNTHOMAREADER .tw-line.log, #hero-info .tw-line.log,
  .SYNTHOMAREADER .tw-line.dialog, #hero-info .tw-line.dialog,
  .SYNTHOMAREADER .tw-line.dialogS, #hero-info .tw-line.dialogS,
  .SYNTHOMAREADER .tw-line.dialogN, #hero-info .tw-line.dialogN,
  .SYNTHOMAREADER .tw-line.dialogG, #hero-info .tw-line.dialogG,
  .SYNTHOMAREADER .tw-line.text, #hero-info .tw-line.text,
  .SYNTHOMAREADER .tw-line.title, #hero-info .tw-line.title,
  .SYNTHOMAREADER p.log, #hero-info p.log,
  .SYNTHOMAREADER p.dialog, #hero-info p.dialog,
  .SYNTHOMAREADER p.dialogS, #hero-info p.dialogS,
  .SYNTHOMAREADER p.dialogN, #hero-info p.dialogN,
  .SYNTHOMAREADER p.dialogG, #hero-info p.dialogG,
  .SYNTHOMAREADER p.text, #hero-info p.text,
  .SYNTHOMAREADER p.title, #hero-info p.title`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\privacy\PrivacyClient.tsx`
  - `app\terms\TermsClient.tsx`
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_00_PODPOROVANO.html`
- **Selector:** `.text`
- **CSS body (primary):**
```css
.text {
position: relative;
    color: var(--text-primary);
    text-shadow: 0 0 2px var(--glow-primary), 0 0 4px var(--glow-secondary);
    font-family: var(--font-family-primary);
    font-weight: 400;
    font-size: calc(1.15rem * var(--font-size-multiplier));
    overflow-wrap: anywhere;
    word-break: normal;
    -webkit-hyphens: auto;
    hyphens: auto;
}
```

---

## `.textV`

- **Status:** defined
- **CSS files:** public\styles.css, src\styles\components.css, src\styles\reader.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.textV`, `/* If .textV starts a paragraph in reader, ensure no phantom offset */
  .SYNTHOMAREADER .chapter-content p.text > .textV:first-child`, `/* If .textV starts a paragraph in reader, ensure no phantom offset */
  .SYNTHOMAREADER .chapter-content p.text > .textV:first-child`
- **Usage sample:**
  - `public\books\efekty.html`
- **Selector:** `.textV`
- **CSS body (primary):**
```css
.textV {
font-family: 'Text03i', monospace;
    font-weight: 700;
    font-style: italic;
    display: inline;        /* no block-level spacing */
    margin: 0;              /* prevent leading/trailing gaps */
    padding: 0;             /* keep inline flow tight */
    border: 0;              /* no accidental borders */
    color: inherit;         /* do not override color */
    text-shadow: inherit;   /* do not override other FX */
    white-space: normal;    /* collapse spaces like normal text */
    letter-spacing: inherit;
    word-spacing: inherit;
    text-indent: 0;         /* never indent */
}
```

---

## `.theme-button`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.theme-button[data-theme="retro-arcade"]`, `#control-panel .btn, #control-panel .panel-button, #control-panel .theme-button, .reader-controls button,
  #control-panel label, #control-panel input, #control-panel .progress, #control-panel .audio-buttons`, `#control-panel .panel-button, #control-panel .theme-button`
- **Selector:** `.theme-button`
- **CSS body (primary):**
```css
.theme-button {
position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  min-height: 2.6rem;
  padding: 0.4rem 0.5rem;
  color: var(--text-primary);
  background: rgba(0,0,0,.45);
  border: 1px solid var(--border-primary);
  border-radius: 4px;
  font-family: var(--font-family-mono, 'Text02', monospace);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease, color .15s ease;
}
```

---

## `.theme-dialog`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, animation
- **Animations:** themeDialogSlideIn
- **Selectors (sample):** `.theme-dialog`, `.theme-dialog.os-surface`, `#control-panel .theme-dialog`
- **Usage sample:**
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `.theme-dialog`
- **CSS body (primary):**
```css
.theme-dialog {
padding: 1.25rem;
  max-width: 420px;
  width: min(92vw, 420px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px var(--glow-secondary);
  text-align: center;
  animation: themeDialogSlideIn 0.2s ease;
}
```

---

## `.theme-dialog-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.theme-dialog-btn`, `.theme-dialog-btn:disabled`, `.theme-dialog-btn:hover:not(:disabled)`
- **Usage sample:**
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `.theme-dialog-btn`
- **CSS body (primary):**
```css
.theme-dialog-btn {
flex: 1 1 0;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.12s ease, box-shadow 0.15s ease;
}
```

---

## `.theme-dialog-btn--confirm`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.theme-dialog-btn--confirm`
- **Usage sample:**
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `.theme-dialog-btn--confirm`
- **CSS body (primary):**
```css
.theme-dialog-btn--confirm {
background: var(--accent-primary);
  border: 1px solid var(--accent-primary);
  color: var(--bg-primary);
  box-shadow: 0 0 10px var(--glow-primary);
}
```

---

## `.theme-dialog-overlay`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter, backdrop-filter
- **Animations:** themeDialogFadeIn
- **Selectors (sample):** `/* Theme purchase confirmation dialog */
.theme-dialog-overlay`, `#control-panel .theme-dialog-overlay`
- **Usage sample:**
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `/* Theme purchase confirmation dialog */
.theme-dialog-overlay`
- **CSS body (primary):**
```css
.theme-dialog-overlay {
position: fixed;
  inset: 0;
  z-index: var(--z-modals, 1000);
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.75);
  -webkit-backdrop-filter: blur(var(--blur-light, 6px));
  backdrop-filter: blur(var(--blur-light, 6px));
  animation: themeDialogFadeIn 0.2s ease;
}
```

---

## `.theme-label`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.theme-label`, `#control-panel .theme-label`
- **Usage sample:**
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `#control-panel .theme-label`
- **CSS body (primary):**
```css
.theme-label {
color: inherit;
  font: 800 var(--cy-font-small)/1.3 var(--cy-font-mono);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
```

---

## `.theme-state`

- **Status:** defined
- **CSS files:** src\styles\control-panel-os.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`, `#control-panel .theme-state`
- **Usage sample:**
  - `app\components\ThemeShopClient.tsx`
- **Selector:** `#control-panel .cp-kicker,
#control-panel .cp-status,
#control-panel .cp-section-header,
#control-panel .panel-section-title,
#control-panel .theme-state,
#control-panel .slider-value`
- **CSS body (primary):**
```css
.theme-state {
font-family: var(--cy-font-mono);
  text-transform: uppercase;
}
```

---

## `.themed-video`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `.themed-video`
- **Usage sample:**
  - `app\books\BooksClient.tsx`
- **Selector:** `.themed-video`
- **CSS body (primary):**
```css
.themed-video {
filter:
    var(--filter-primary, none)
    contrast(var(--pixelate-contrast, 1))
    saturate(var(--pixelate-saturation, 1));
  opacity: var(--video-opacity, 1);
}
```

---

## `.tip`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.tip`, `.tip.active`
- **Selector:** `.tip`
- **CSS body (primary):**
```css
.tip {
color: var(--text-tertiary); font-size: calc(.8rem * var(--font-size-multiplier, 1)); opacity: 0; transition: opacity .25s ease;
}
```

---

## `.title`

- **Status:** defined
- **CSS files:** public\styles.css, public\synth-gate.css, src\styles\components.css, src\styles\reader.css, src\styles\synth-gate.css
- **Used in:** 311 occurrences across 44 files
- **Effect properties:** box-shadow, animation
- **Animations:** border-glow
- **Selectors (sample):** `/* V titulcích a standalone znacích mezera nechceme */
  h1 .fx-neon, h2 .fx-neon, h3 .fx-neon, .title .fx-neon,
  h1 .neon-blood, h2 .neon-blood, h3 .neon-blood, .title .neon-blood`, `/* V titulcích a standalone znacích mezera nechceme */
  h1 .fx-neon, h2 .fx-neon, h3 .fx-neon, .title .fx-neon,
  h1 .neon-blood, h2 .neon-blood, h3 .neon-blood, .title .neon-blood`, `/* Blokové typové utilitky – title sjednocen. */
  .title`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\books\BooksClient.tsx`
  - `app\privacy\PrivacyClient.tsx`
  - `app\reader\ReaderContent.tsx`
  - `app\terms\TermsClient.tsx`
- **Selector:** `.title::before`
- **CSS body (primary):**
```css
.title {
content: '';
    position: absolute;
    left: 0rem;
    width: 4px;
    height: 100%;
    border-radius: 2px;
    background: transparent;
    box-shadow: -1px 0 4px 0px var(--accent-secondary, #0ff), 1px 0 8px 0px var(--accent-primary, #ff00ff), 0px 0 12px 0px var(--accent-warning, #faff00);
    animation: border-glow 2.6s infinite cubic-bezier(.8,0,.23,1.1);
}
```

---

## `.title-lg`

- **Status:** defined
- **CSS files:** public\styles.css
- **Used in:** 0 occurrences across 0 files
- **Selectors (sample):** `.title-lg`
- **Selector:** `.title-lg`
- **CSS body (primary):**
```css
.title-lg {
font-size: 1.25rem;
  letter-spacing: .015em;
}
```

---

## `.title-sm`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 6 occurrences across 5 files
- **Selectors (sample):** `}
  
  /* Další utilities – malé, ale sarkasticky mocné. 💪 */
  .title-sm`
- **Usage sample:**
  - `public\books\SYNTHOMA-NULL\0-0 [NULL].html`
  - `public\books\SYNTHOMA-NULL\0-0 [NULL]_en.html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART].html`
  - `public\books\SYNTHOMA-NULL\0-∞ [RESTART]_en.html`
  - `public\books\SYNTHOMA-NULL\SYNTHOMA.html`
- **Selector:** `}
  
  /* Další utilities – malé, ale sarkasticky mocné. 💪 */
  .title-sm`
- **CSS body (primary):**
```css
.title-sm {
font-size: calc(1.3rem * var(--font-size-multiplier)) !important;
}
```

---

## `.tw-blip`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** twBlip
- **Selectors (sample):** `}

/* Container blip – scanline efekt. */
.noising-text.tw-blip`
- **Selector:** `}

/* Container blip – scanline efekt. */
.noising-text.tw-blip`
- **CSS body (primary):**
```css
.tw-blip {
animation: twBlip .14s ease-out both;
}
```

---

## `.tw-char`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, filter
- **Animations:** twGlitchIn
- **Selectors (sample):** `.tw-char`, `/* Typing glitch per char – micro efekt. */
.tw-char`, `.tw-char.tw-glitch`
- **Selector:** `.tw-char.tw-glitch`
- **CSS body (primary):**
```css
.tw-char {
animation: twGlitchIn .14s ease-out both; filter: brightness(1.35);
}
```

---

## `.tw-glitch`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, filter
- **Animations:** twGlitchIn
- **Selectors (sample):** `.tw-char.tw-glitch`
- **Selector:** `.tw-char.tw-glitch`
- **CSS body (primary):**
```css
.tw-glitch {
animation: twGlitchIn .14s ease-out both; filter: brightness(1.35);
}
```

---

## `.tw-line`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition, transform
- **Animations:** none
- **Selectors (sample):** `/* Reader line alignment – sjednoceno, bez duplicitních selectorů. */
  .SYNTHOMAREADER .tw-line.log, #hero-info .tw-line.log,
  .SYNTHOMAREADER .tw-line.dialog, #hero-info .tw-line.dialog,
  .SYNTHOMAREADER .tw-line.dialogS, #hero-info .tw-line.dialogS,
  .SYNTHOMAREADER .tw-line.dialogN, #hero-info .tw-line.dialogN,
  .SYNTHOMAREADER .tw-line.dialogG, #hero-info .tw-line.dialogG,
  .SYNTHOMAREADER .tw-line.text, #hero-info .tw-line.text,
  .SYNTHOMAREADER .tw-line.title, #hero-info .tw-line.title,
  .SYNTHOMAREADER p.log, #hero-info p.log,
  .SYNTHOMAREADER p.dialog, #hero-info p.dialog,
  .SYNTHOMAREADER p.dialogS, #hero-info p.dialogS,
  .SYNTHOMAREADER p.dialogN, #hero-info p.dialogN,
  .SYNTHOMAREADER p.dialogG, #hero-info p.dialogG,
  .SYNTHOMAREADER p.text, #hero-info p.text,
  .SYNTHOMAREADER p.title, #hero-info p.title`, `/* Reader line alignment – sjednoceno, bez duplicitních selectorů. */
  .SYNTHOMAREADER .tw-line.log, #hero-info .tw-line.log,
  .SYNTHOMAREADER .tw-line.dialog, #hero-info .tw-line.dialog,
  .SYNTHOMAREADER .tw-line.dialogS, #hero-info .tw-line.dialogS,
  .SYNTHOMAREADER .tw-line.dialogN, #hero-info .tw-line.dialogN,
  .SYNTHOMAREADER .tw-line.dialogG, #hero-info .tw-line.dialogG,
  .SYNTHOMAREADER .tw-line.text, #hero-info .tw-line.text,
  .SYNTHOMAREADER .tw-line.title, #hero-info .tw-line.title,
  .SYNTHOMAREADER p.log, #hero-info p.log,
  .SYNTHOMAREADER p.dialog, #hero-info p.dialog,
  .SYNTHOMAREADER p.dialogS, #hero-info p.dialogS,
  .SYNTHOMAREADER p.dialogN, #hero-info p.dialogN,
  .SYNTHOMAREADER p.dialogG, #hero-info p.dialogG,
  .SYNTHOMAREADER p.text, #hero-info p.text,
  .SYNTHOMAREADER p.title, #hero-info p.title`, `/* Reader line alignment – sjednoceno, bez duplicitních selectorů. */
  .SYNTHOMAREADER .tw-line.log, #hero-info .tw-line.log,
  .SYNTHOMAREADER .tw-line.dialog, #hero-info .tw-line.dialog,
  .SYNTHOMAREADER .tw-line.dialogS, #hero-info .tw-line.dialogS,
  .SYNTHOMAREADER .tw-line.dialogN, #hero-info .tw-line.dialogN,
  .SYNTHOMAREADER .tw-line.dialogG, #hero-info .tw-line.dialogG,
  .SYNTHOMAREADER .tw-line.text, #hero-info .tw-line.text,
  .SYNTHOMAREADER .tw-line.title, #hero-info .tw-line.title,
  .SYNTHOMAREADER p.log, #hero-info p.log,
  .SYNTHOMAREADER p.dialog, #hero-info p.dialog,
  .SYNTHOMAREADER p.dialogS, #hero-info p.dialogS,
  .SYNTHOMAREADER p.dialogN, #hero-info p.dialogN,
  .SYNTHOMAREADER p.dialogG, #hero-info p.dialogG,
  .SYNTHOMAREADER p.text, #hero-info p.text,
  .SYNTHOMAREADER p.title, #hero-info p.title`
- **Selector:** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **CSS body (primary):**
```css
.tw-line {
animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

---

## `.tw-split`

- **Status:** defined
- **CSS files:** src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** twSplit
- **Selectors (sample):** `.tw-char.tw-split`
- **Selector:** `.tw-char.tw-split`
- **CSS body (primary):**
```css
.tw-split {
animation: twSplit .1s ease-out both;
}
```

---

## `.typewriter`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\effects.css, src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transform
- **Animations:** reveal
- **Selectors (sample):** `/* Typewriter neutralizace v hero. */
  .hero-intro .typewriter`, `.SYNTHOMAREADER .tw-line.typewriter, .SYNTHOMAREADER .typewriter`, `.SYNTHOMAREADER .tw-line.typewriter, .SYNTHOMAREADER .typewriter`
- **Selector:** `.typewriter .noising-text`
- **CSS body (primary):**
```css
.typewriter {
display: inline-block;
  overflow: hidden;
  white-space: normal;
  border-right: 2px solid var(--c-neon-cyan);
  animation: reveal var(--typewriter-duration, 6s) steps(var(--typewriter-steps, 60)) both,
             caret var(--caret-duration, 1.2s) steps(1) infinite;
  will-change: clip-path, border-color;
  contain: layout paint;
  backface-visibility: hidden;
  transform: translateZ(0);
}
```

---

## `.typewriter-instant`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, transform
- **Animations:** none
- **Selectors (sample):** `}
  
  /* Instant mode – no anim. */
  .typewriter-instant .tw-line`
- **Usage sample:**
  - `app\chapter\[id]\ChapterReaderArticle.tsx`
- **Selector:** `}
  
  /* Instant mode – no anim. */
  .typewriter-instant .tw-line`
- **CSS body (primary):**
```css
.typewriter-instant {
animation: none; opacity: 1; transform: none;
}
```

---

## `.typing`

- **Status:** defined
- **CSS files:** app\reader\ReaderContent.module.css, src\styles\components-choice.css, src\styles\components.css, src\styles\effects.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, filter, transform, color-mix
- **Selectors (sample):** `/* Během psaní žádná diskotéka, systém se má tvářit funkčně */
.SYNTHOMAREADER.typing p.choice[data-tags] > .choice-link,
.choice-link.typing`, `/* Během psaní žádná diskotéka, systém se má tvářit funkčně */
.SYNTHOMAREADER.typing p.choice[data-tags] > .choice-link,
.choice-link.typing`, `/* During typing, keep visuals but disable interactivity and hover transitions to avoid flicker */
  .choice-link.typing`
- **Selector:** `/* Během psaní žádná diskotéka, systém se má tvářit funkčně */
.SYNTHOMAREADER.typing p.choice[data-tags] > .choice-link,
.choice-link.typing`
- **CSS body (primary):**
```css
.typing {
transform: none !important;
  filter: none !important;
  box-shadow:
    0 0 6px color-mix(in oklab, var(--choice-accent) 18%, transparent),
    inset 0 0 12px color-mix(in oklab, var(--choice-accent) 8%, transparent) !important;
}
```

---

## `.typing-cursor`

- **Status:** defined
- **CSS files:** src\styles\reader.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, transition, transform
- **Animations:** none
- **Selectors (sample):** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`, `.no-animations .typing-cursor`
- **Selector:** `}
  
  /* No-animations kill-switch – rozšířeno. */
  .no-animations .SYNTHOMAREADER, .no-animations .chapter-container, .no-animations .chapter-title, .no-animations .chapter-content,
  .no-animations .typing-cursor, .no-animations .scanline, .no-animations .loading-spinner, .no-animations .tw-line, .no-animations .alarm-emote`
- **CSS body (primary):**
```css
.typing-cursor {
animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
}
```

---

## `.uncertain`

- **Status:** defined
- **CSS files:** public\books\SYNTHOMA-KONEC_PODPORY\konec-podpory.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-result .uncertain`
- **Usage sample:**
  - `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html`
- **Selector:** `.kp-chapter[data-book="konec-podpory"][data-chapter="12"] .kp-result .uncertain`
- **CSS body (primary):**
```css
.uncertain {
color: var(--kp-yellow);
    font-size: 1.12em;
    text-shadow: 0 0 0.7rem rgba(246,255,0,0.28);
}
```

---

## `.v1-action-card`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `/* ── v1.0 action cards ─────────────────────────────────────────────────────── */

.v1-action-card`, `.v1-action-card:hover`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.v1-action-card:hover`
- **CSS body (primary):**
```css
.v1-action-card {
background: rgba(0, 255, 224, 0.08);
  border-color: rgba(0, 255, 224, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
```

---

## `.v1-action-card--selected`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.v1-action-card--selected`
- **Selector:** `.v1-action-card--selected`
- **CSS body (primary):**
```css
.v1-action-card--selected {
background: rgba(0, 255, 224, 0.12);
  border-color: var(--v1-accent);
  box-shadow: 0 0 18px rgba(0, 255, 224, 0.25);
}
```

---

## `.v1-action-card__title`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 4 occurrences across 2 files
- **Effect properties:** transform
- **Selectors (sample):** `.v1-action-card__title`
- **Usage sample:**
  - `src\components\game\run\ActionBar.tsx`
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.v1-action-card__title`
- **CSS body (primary):**
```css
.v1-action-card__title {
font-family: var(--v1-font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```

---

## `.v1-badge`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 17 occurrences across 7 files
- **Effect properties:** transform
- **Selectors (sample):** `/* ── v1.0 badges / chips ──────────────────────────────────────────────────────── */

.v1-badge`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
  - `src\components\game\run\ActionBar.tsx`
  - `src\components\game\run\EncounterPanel.tsx`
  - `src\components\game\run\EnemyCard.tsx`
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `/* ── v1.0 badges / chips ──────────────────────────────────────────────────────── */

.v1-badge`
- **CSS body (primary):**
```css
.v1-badge {
display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--v1-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.2rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
}
```

---

## `.v1-btn`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 6 occurrences across 3 files
- **Effect properties:** box-shadow, transform
- **Selectors (sample):** `/* ── v1.0 buttons ───────────────────────────────────────────────────────────── */

.v1-btn`, `.v1-btn:hover`, `.v1-btn:active`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
  - `src\components\game\run\EncounterPanel.tsx`
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.v1-btn:hover`
- **CSS body (primary):**
```css
.v1-btn {
background: rgba(0, 255, 224, 0.14);
  border-color: rgba(0, 255, 224, 0.5);
  box-shadow: 0 0 20px rgba(0, 255, 224, 0.25);
  transform: translateY(-2px);
}
```

---

## `.v1-btn--primary`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 3 occurrences across 3 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.v1-btn--primary`, `.v1-btn--primary:hover`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
  - `src\components\game\run\EncounterPanel.tsx`
  - `src\components\game\run\RunEndReport.tsx`
- **Selector:** `.v1-btn--primary:hover`
- **CSS body (primary):**
```css
.v1-btn--primary {
background: #4dfff0;
  box-shadow: 0 0 28px rgba(0, 255, 224, 0.45);
}
```

---

## `.v1-enemy-card`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow, transition
- **Selectors (sample):** `/* ── v1.0 enemy card ────────────────────────────────────────────────────────── */

.v1-enemy-card`
- **Selector:** `/* ── v1.0 enemy card ────────────────────────────────────────────────────────── */

.v1-enemy-card`
- **CSS body (primary):**
```css
.v1-enemy-card {
background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  padding: 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: border-color 0.2s, box-shadow 0.2s;
}
```

---

## `.v1-enemy-card--targeted`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.v1-enemy-card--targeted`
- **Selector:** `.v1-enemy-card--targeted`
- **CSS body (primary):**
```css
.v1-enemy-card--targeted {
border-color: var(--v1-accent);
  box-shadow: 0 0 24px rgba(0, 255, 224, 0.15);
}
```

---

## `.v1-enemy-card__hp-fill`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.v1-enemy-card__hp-fill`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.v1-enemy-card__hp-fill`
- **CSS body (primary):**
```css
.v1-enemy-card__hp-fill {
height: 100%;
  background: linear-gradient(90deg, #ff4d4d 0%, #ff9f43 100%);
  border-radius: 5px;
  transition: width 0.4s ease;
}
```

---

## `.v1-enemy-card__name`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.v1-enemy-card__name`
- **Usage sample:**
  - `src\components\game\run\EnemyCard.tsx`
- **Selector:** `.v1-enemy-card__name`
- **CSS body (primary):**
```css
.v1-enemy-card__name {
font-family: var(--v1-font-mono);
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--v1-accent);
}
```

---

## `.v1-enter`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 4 occurrences across 3 files
- **Effect properties:** animation
- **Animations:** v1-fade-in
- **Selectors (sample):** `}

.v1-enter`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
  - `src\components\game\run\ActionBar.tsx`
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `}

.v1-enter`
- **CSS body (primary):**
```css
.v1-enter {
animation: v1-fade-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

---

## `.v1-enter-left`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** v1-slide-in-left
- **Selectors (sample):** `.v1-enter-left`
- **Selector:** `.v1-enter-left`
- **CSS body (primary):**
```css
.v1-enter-left {
animation: v1-slide-in-left 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

---

## `.v1-enter-right`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** v1-slide-in-right
- **Selectors (sample):** `.v1-enter-right`
- **Selector:** `.v1-enter-right`
- **CSS body (primary):**
```css
.v1-enter-right {
animation: v1-slide-in-right 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
}
```

---

## `.v1-float-number`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** text-shadow, animation
- **Animations:** v1-float-up
- **Selectors (sample):** `}

.v1-float-number`
- **Selector:** `}

.v1-float-number`
- **CSS body (primary):**
```css
.v1-float-number {
position: absolute;
  font-family: var(--v1-font-mono);
  font-size: 1.2rem;
  font-weight: 800;
  pointer-events: none;
  animation: v1-float-up 1s ease-out forwards;
  text-shadow: 0 0 10px currentColor;
}
```

---

## `.v1-glow-pulse`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** v1-pulse-glow
- **Selectors (sample):** `.v1-glow-pulse`
- **Usage sample:**
  - `src\components\game\run\EncounterPanel.tsx`
- **Selector:** `.v1-glow-pulse`
- **CSS body (primary):**
```css
.v1-glow-pulse {
animation: v1-pulse-glow 2s ease-in-out infinite;
}
```

---

## `.v1-hud-bar`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* ── Floating HUD bars (v1.0) ───────────────────────────────────────────────── */

.v1-hud-bar`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `/* ── Floating HUD bars (v1.0) ───────────────────────────────────────────────── */

.v1-hud-bar`
- **CSS body (primary):**
```css
.v1-hud-bar {
position: relative;
  height: 10px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
```

---

## `.v1-hud-bar__fill`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.v1-hud-bar__fill`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.v1-hud-bar__fill`
- **CSS body (primary):**
```css
.v1-hud-bar__fill {
height: 100%;
  border-radius: 5px;
  transition: width 0.4s ease, background 0.3s;
}
```

---

## `.v1-hud-bar__fill--hp`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.v1-hud-bar__fill--hp`
- **Selector:** `.v1-hud-bar__fill--hp`
- **CSS body (primary):**
```css
.v1-hud-bar__fill--hp {
background: linear-gradient(90deg, #00ff9f 0%, #00ccff 100%);
  box-shadow: 0 0 10px rgba(0, 255, 224, 0.3);
}
```

---

## `.v1-hud-bar__fill--void`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.v1-hud-bar__fill--void`
- **Usage sample:**
  - `src\components\game\run\RunHUD.tsx`
- **Selector:** `.v1-hud-bar__fill--void`
- **CSS body (primary):**
```css
.v1-hud-bar__fill--void {
background: linear-gradient(90deg, #a855f7 0%, #ff4d4d 100%);
  box-shadow: 0 0 10px rgba(168, 85, 247, 0.3);
}
```

---

## `.v1-map-edge`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter
- **Selectors (sample):** `/* ── v1.0 map enhancements ──────────────────────────────────────────────────── */

.v1-map-edge`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `/* ── v1.0 map enhancements ──────────────────────────────────────────────────── */

.v1-map-edge`
- **CSS body (primary):**
```css
.v1-map-edge {
stroke: rgba(0, 255, 224, 0.25);
  stroke-width: 2;
  stroke-dasharray: 5 4;
  filter: drop-shadow(0 0 4px rgba(0, 255, 224, 0.25));
}
```

---

## `.v1-map-node--available`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.v1-map-node--available .v1-map-node-circle`
- **Selector:** `.v1-map-node--available .v1-map-node-circle`
- **CSS body (primary):**
```css
.v1-map-node--available {
stroke: var(--v1-accent);
  stroke-width: 2.5;
  filter: drop-shadow(0 0 8px rgba(0, 255, 224, 0.4));
}
```

---

## `.v1-map-node--clickable`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.v1-map-node--clickable:not(.v1-map-node--current):hover .v1-map-node-circle`
- **Selector:** `.v1-map-node--clickable:not(.v1-map-node--current):hover .v1-map-node-circle`
- **CSS body (primary):**
```css
.v1-map-node--clickable {
fill: rgba(0, 255, 224, 0.15);
  stroke: var(--v1-accent);
  filter: drop-shadow(0 0 14px rgba(0, 255, 224, 0.5));
}
```

---

## `.v1-map-node--current`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** filter
- **Selectors (sample):** `.v1-map-node--current .v1-map-node-circle`, `.v1-map-node--clickable:not(.v1-map-node--current):hover .v1-map-node-circle`
- **Selector:** `.v1-map-node--current .v1-map-node-circle`
- **CSS body (primary):**
```css
.v1-map-node--current {
fill: var(--v1-accent);
  stroke: var(--v1-accent);
  filter: drop-shadow(0 0 10px var(--v1-accent));
}
```

---

## `.v1-map-node-circle`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.v1-map-node-circle`, `.v1-map-node--current .v1-map-node-circle`, `.v1-map-node--available .v1-map-node-circle`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `.v1-map-node-circle`
- **CSS body (primary):**
```css
.v1-map-node-circle {
fill: rgba(12, 16, 20, 0.9);
  stroke: rgba(0, 255, 224, 0.35);
  stroke-width: 2;
  transition: fill 0.2s, stroke 0.2s, filter 0.2s;
}
```

---

## `.v1-map-node-label`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.v1-map-node-label`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `.v1-map-node-label`
- **CSS body (primary):**
```css
.v1-map-node-label {
font-size: 12px;
  fill: rgba(255, 255, 255, 0.65);
  font-family: var(--v1-font-mono);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  pointer-events: none;
}
```

---

## `.v1-map-node-pulse`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation
- **Animations:** v1-map-pulse
- **Selectors (sample):** `}

.v1-map-node-pulse`
- **Usage sample:**
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `}

.v1-map-node-pulse`
- **CSS body (primary):**
```css
.v1-map-node-pulse {
fill: none;
  stroke: var(--v1-accent);
  stroke-width: 1.5;
  opacity: 0;
  animation: v1-map-pulse 1.6s ease-in-out infinite;
}
```

---

## `.v1-menu-subtitle`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.v1-menu-subtitle`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.v1-menu-subtitle`
- **CSS body (primary):**
```css
.v1-menu-subtitle {
font-family: var(--v1-font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.25em;
  color: var(--text-muted);
  text-transform: uppercase;
  text-align: center;
}
```

---

## `.v1-menu-title`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `.v1-menu-title`, `.v1-menu-title`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `.v1-menu-title`
- **CSS body (primary):**
```css
.v1-menu-title {
font-family: var(--v1-font-mono);
  font-size: clamp(1.4rem, 5vw, 2.2rem);
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--v1-accent);
  text-shadow: 0 0 20px rgba(0, 255, 224, 0.4);
  text-align: center;
}
```

---

## `.v1-panel`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 3 occurrences across 3 files
- **Effect properties:** box-shadow, filter, backdrop-filter
- **Selectors (sample):** `/* ── Glassmorphism panels ───────────────────────────────────────────────────── */

.v1-panel`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
  - `src\components\game\run\ActionBar.tsx`
  - `src\components\game\run\RunMapView.tsx`
- **Selector:** `/* ── Glassmorphism panels ───────────────────────────────────────────────────── */

.v1-panel`
- **CSS body (primary):**
```css
.v1-panel {
background: var(--v1-panel-bg);
  border: 1px solid var(--v1-panel-border);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35), var(--v1-glow);
  border-radius: 6px;
}
```

---

## `.v1-panel-strong`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.v1-panel-strong`
- **Selector:** `.v1-panel-strong`
- **CSS body (primary):**
```css
.v1-panel-strong {
background: rgba(8, 12, 16, 0.92);
  border: 1px solid rgba(0, 255, 224, 0.35);
  box-shadow: 0 0 30px rgba(0, 255, 224, 0.15), inset 0 0 20px rgba(0, 255, 224, 0.04);
}
```

---

## `.v1-scanlines`

- **Status:** defined
- **CSS files:** src\styles\game-v1.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** blend-mode
- **Selectors (sample):** `/* ── CRT scanline overlay ───────────────────────────────────────────────────── */

.v1-scanlines`, `.v1-scanlines::after`
- **Usage sample:**
  - `app\game\solo\SoloClient.tsx`
- **Selector:** `/* ── CRT scanline overlay ───────────────────────────────────────────────────── */

.v1-scanlines`
- **CSS body (primary):**
```css
.v1-scanlines {
pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08) 0px,
      rgba(0, 0, 0, 0.08) 1px,
      transparent 1px,
      transparent 4px
    );
  opacity: 0.35;
  mix-blend-mode: multiply;
}
```

---

## `.video-background`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\motion-contract.css
- **Used in:** 3 occurrences across 3 files
- **Effect properties:** filter, transition, transform
- **Selectors (sample):** `body[data-theme="retro-arcade"] .video-background video`, `/* =========================
     VIDEO BACKGROUND + LAYERS – fixed pozice sjednoceny.
     ========================= */
  .video-background`, `.video-background video`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
  - `app\autor\AutorClient.tsx`
  - `app\components\BgVideo.tsx`
- **Selector:** `.video-background video`
- **CSS body (primary):**
```css
.video-background {
position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; object-position: left top;
    opacity: 0;
    filter: var(--filter-primary, none) contrast(var(--pixelate-contrast, 1)) saturate(var(--pixelate-saturation, 1));
    transition: opacity .6s ease, filter .3s linear;
    will-change: opacity;
    pointer-events: none;
    transform: none !important;
}
```

---

## `.visible`

- **Status:** defined
- **CSS files:** src\styles\components.css, src\styles\control-panel-os.css, src\styles\profile.css, src\styles\reader.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, transition, transform
- **Selectors (sample):** `.glitch-button.appear.visible`, `.intro-title.visible`, `.manifest-enter.visible`
- **Usage sample:**
  - `app\components\ControlCenterClient.tsx`
- **Selector:** `.glitch-button.appear.visible`
- **CSS body (primary):**
```css
.visible {
opacity: 1; transform: none; filter: var(--filter-primary, none); transition: opacity .6s ease .1s, transform .6s ease .1s, filter .6s ease;
}
```

---

## `.void-boss-indicator`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.void-boss-indicator`
- **Usage sample:**
  - `src\components\game\VoidTrack.tsx`
- **Selector:** `.void-boss-indicator`
- **CSS body (primary):**
```css
.void-boss-indicator {
display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-family: var(--font-family-mono, monospace);
  color: var(--game-danger);
  border-top: 1px solid color-mix(in srgb, var(--game-danger) 20%, transparent);
  padding-top: 0.4rem;
}
```

---

## `.void-collapse`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** run-hud-pulse
- **Selectors (sample):** `.run-hud__bar-row--void.void-collapse  .run-hud__bar-fill--void`
- **Selector:** `.run-hud__bar-row--void.void-collapse  .run-hud__bar-fill--void`
- **CSS body (primary):**
```css
.void-collapse {
background: #8e44ad; animation: run-hud-pulse 0.4s infinite;
}
```

---

## `.void-critical`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation
- **Animations:** run-hud-pulse
- **Selectors (sample):** `.run-hud__bar-row--void.void-critical .run-hud__bar-fill--void`
- **Selector:** `.run-hud__bar-row--void.void-critical .run-hud__bar-fill--void`
- **CSS body (primary):**
```css
.void-critical {
background: #c0392b; animation: run-hud-pulse 0.8s infinite;
}
```

---

## `.void-hub-action-button`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** box-shadow, transition, transform
- **Selectors (sample):** `.void-hub-action-button`, `.void-hub-action-button:hover:not(:disabled)`, `.void-hub-action-button:disabled`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-action-button`
- **CSS body (primary):**
```css
.void-hub-action-button {
border: 1px solid rgba(0, 255, 255, 0.28);
  border-radius: 999px;
  padding: 0.42rem 0.82rem;
  background: rgba(0, 13, 26, 0.78);
  color: #c0faff;
  cursor: pointer;
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  box-shadow: 0 0 14px rgba(0, 255, 255, 0.08);
  transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}
```

---

## `.void-hub-action-with-note`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.void-hub-action-with-note`, `.void-hub-action-with-note span`, `.void-hub-action-with-note`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-action-with-note span`
- **CSS body (primary):**
```css
.void-hub-action-with-note {
color: var(--cy-text-dim);
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  text-align: center;
  text-transform: uppercase;
}
```

---

## `.void-hub-focus`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.void-hub-focus`, `.void-hub-focus h3,
.void-hub-focus p`, `.void-hub-focus h3,
.void-hub-focus p`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-focus`
- **CSS body (primary):**
```css
.void-hub-focus {
border-left-color: var(--cy-magenta);
  background: linear-gradient(90deg, color-mix(in srgb, var(--cy-accent-memory) 4.5%, transparent), transparent 82%);
}
```

---

## `.void-hub-focus__button`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.void-hub-focus__button`, `.void-hub-focus__button span,
.void-hub-focus__button small`, `.void-hub-focus__button span,
.void-hub-focus__button small`
- **Selector:** `.void-hub-focus__button`
- **CSS body (primary):**
```css
.void-hub-focus__button {
position: relative;
  display: grid;
  gap: var(--cy-space-2);
  min-width: 0;
  min-height: 78px;
  padding: var(--cy-space-3);
  border: 1px solid var(--cy-line);
  border-radius: var(--cy-radius);
  background: color-mix(in srgb, var(--cy-accent-system) 2.5%, transparent);
  color: var(--cy-text);
  font-family: var(--cy-font-mono);
  text-align: left;
}
```

---

## `.void-hub-hero`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-overlay--void-hub .void-hub-hero`, `.cyklus-overlay--void-hub .void-hub-hero h2`, `.cyklus-overlay--void-hub .void-hub-hero p,
  .cyklus-overlay--void-hub .void-hub-section-header p`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-hero h2,
.void-hub-section-header h3`
- **CSS body (primary):**
```css
.void-hub-hero {
margin: 0 0 0.55rem;
  color: #c0faff;
  text-shadow: 0 0 16px rgba(0, 255, 255, 0.16);
}
```

---

## `.void-hub-hero__role`

- **Status:** defined
- **CSS files:** src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.void-hub-hero__role`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-hero__role`
- **CSS body (primary):**
```css
.void-hub-hero__role {
color: var(--cy-magenta-soft) !important;
  font-size: 0.68rem !important;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
```

---

## `.void-hub-next-action`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.void-hub-return-summary,
.void-hub-next-action`, `.void-hub-return-summary h3,
.void-hub-next-action h3`, `.void-hub-return-summary p,
.void-hub-next-action p`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-next-action`
- **CSS body (primary):**
```css
.void-hub-next-action {
display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(250px, auto);
  align-items: center;
  border: 1px solid var(--cy-line-magenta);
  border-left: 3px solid var(--cy-magenta);
  background: linear-gradient(105deg, color-mix(in srgb, var(--cy-accent-memory) 8%, transparent), color-mix(in srgb, var(--cy-accent-system) 2.5%, transparent) 74%);
}
```

---

## `.void-hub-return-summary`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.void-hub-return-summary,
.void-hub-next-action`, `.void-hub-return-summary`, `.void-hub-return-summary h3,
.void-hub-next-action h3`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-return-summary,
.void-hub-next-action,
.void-hub-focus`
- **CSS body (primary):**
```css
.void-hub-return-summary {
position: relative;
  margin: var(--cy-space-4) 0 0;
  padding: var(--cy-space-4);
  border: 0;
  border-left: 2px solid var(--cy-cyan);
  border-radius: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--cy-accent-system) 4.5%, transparent), transparent 82%);
}
```

---

## `.void-hub-section-header`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** text-shadow
- **Selectors (sample):** `.cyklus-overlay--void-hub .void-hub-hero p,
  .cyklus-overlay--void-hub .void-hub-section-header p`, `.void-hub-section-header`, `.void-hub-hero,
.void-hub-section-header,
.void-hub-tabs,
.void-hub-alerts,
.void-hub-tab-panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-section-header h3,
.cyklus-dashboard-hero h2,
.cyklus-panel-header h2,
.progression-card h3,
.cyklus-pocket-column h3,
.cyklus-suggestion-box h3`
- **CSS body (primary):**
```css
.void-hub-section-header {
margin: 0;
  color: var(--cy-text);
  font-size: clamp(1rem, 2vw, 1.25rem);
  letter-spacing: 0.04em;
  text-shadow: none;
}
```

---

## `.void-hub-tab`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition, transform
- **Selectors (sample):** `.cyklus-overlay--void-hub .void-hub-tab`, `.cyklus-overlay--void-hub .void-hub-tab`, `.void-hub-tab`
- **Selector:** `.void-hub-tab`
- **CSS body (primary):**
```css
.void-hub-tab {
border: 1px solid rgba(192, 250, 255, 0.14);
  border-radius: 0.9rem;
  padding: 0.72rem 0.64rem;
  background: rgba(0, 13, 26, 0.58);
  color: rgba(235, 252, 255, 0.78);
  cursor: pointer;
  text-align: left;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}
```

---

## `.void-hub-tab-panel`

- **Status:** defined
- **CSS files:** src\styles\cyklus\interactions.css, src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.cyklus-page :is(
  .cyklus-card-scene,
  .cyklus-history,
  .cyklus-end-summary__full-log,
  .cyklus-stat-popup__body,
  .cyklus-diag-drawer,
  .cyklus-discovery,
  .cyklus-death-analysis,
  .cyklus-behavioral,
  .cyklus-reward
),
.cyklus-void-page :is(
  .cyklus-void-client-status,
  .void-hub-tab-panel,
  [role="tabpanel"],
  .cyklus-pocket-panel,
  .cyklus-progression-dashboard
)`, `.void-hub-tab-panel`, `.void-hub-hero,
.void-hub-section-header,
.void-hub-tabs,
.void-hub-alerts,
.void-hub-tab-panel`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-tab-panel,
.cyklus-progression-dashboard,
.cyklus-pocket-panel`
- **CSS body (primary):**
```css
.void-hub-tab-panel {
min-width: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

---

## `.void-hub-tabs`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\void.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.cyklus-overlay--void-hub .void-hub-tabs`, `.void-hub-tabs`, `.void-hub-tabs`
- **Usage sample:**
  - `src\components\cyklus\CyklusVoidHub.tsx`
- **Selector:** `.void-hub-tabs`
- **CSS body (primary):**
```css
.void-hub-tabs {
position: sticky;
  top: 0;
  z-index: 12;
  display: flex;
  grid-template-columns: none;
  gap: 0;
  width: 100%;
  margin: var(--cy-space-4) 0 0;
  padding: 0;
  overflow-x: auto;
  border-block: 1px solid var(--cy-line);
  background: color-mix(in srgb, var(--cy-surface-1) 98%, transparent);
  scrollbar-width: thin;
  scrollbar-color: var(--cy-line-strong) transparent;
  scroll-snap-type: x proximity;
}
```

---

## `.void-room-badge`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\responsive.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.void-room-badge,
.craft-status-pill,
.resource-pill`, `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`, `.void-room-badge.is-maxed,
.craft-recipe-row.is-crafted .craft-status-pill`
- **Selector:** `.void-room-badge.is-available,
.craft-recipe-row.is-craftable .craft-status-pill`
- **CSS body (primary):**
```css
.void-room-badge {
border-color: rgba(246, 255, 0, 0.42);
  box-shadow: 0 0 14px rgba(246, 255, 0, 0.12);
}
```

---

## `.void-room-row`

- **Status:** defined
- **CSS files:** src\styles\cyklus\legacy.css, src\styles\cyklus\overlays.css, src\styles\cyklus\readability-theme.css, src\styles\cyklus\void.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.pocket-item-row,
.craft-recipe-row,
.void-room-row,
.loadout-entry`, `.craft-recipe-row.is-locked,
.craft-recipe-row.is-hidden,
.void-room-row.is-locked`, `.void-room-row.is-pocket-room,
.cyklus-pocket-panel`
- **Selector:** `.void-room-row.is-pocket-room,
.cyklus-pocket-panel`
- **CSS body (primary):**
```css
.void-room-row {
border-color: rgba(246, 255, 0, 0.18);
  box-shadow: 0 0 28px rgba(246, 255, 0, 0.06), inset 0 0 0 1px rgba(0, 255, 255, 0.04);
}
```

---

## `.void-track--danger`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** animation, color-mix
- **Animations:** void-pulse
- **Selectors (sample):** `.void-track--danger`, `.void-track--danger .void-track-fill`
- **Selector:** `.void-track--danger`
- **CSS body (primary):**
```css
.void-track--danger {
border-color: color-mix(in srgb, var(--game-danger) 60%, transparent); animation: void-pulse 1.5s ease-in-out infinite;
}
```

---

## `.void-track--warning`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** color-mix
- **Selectors (sample):** `.void-track--warning`, `.void-track--warning .void-track-fill`
- **Selector:** `.void-track--warning`
- **CSS body (primary):**
```css
.void-track--warning {
border-color: color-mix(in srgb, var(--game-warn) 40%, transparent);
}
```

---

## `.void-track-fill`

- **Status:** defined
- **CSS files:** src\styles\game.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.void-track-fill`, `.void-track--warning .void-track-fill`, `.void-track--danger .void-track-fill`
- **Usage sample:**
  - `src\components\game\VoidTrack.tsx`
- **Selector:** `.void-track-fill`
- **CSS body (primary):**
```css
.void-track-fill {
height: 100%;
  background: linear-gradient(90deg, var(--game-accent-alt), var(--game-danger));
  border-radius: 3px;
  transition: width 0.3s ease;
}
```

---

## `.whisper-boost-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.whisper-boost-btn`, `.whisper-boost-btn:hover:not(:disabled)`, `.whisper-boost-btn:disabled`
- **Usage sample:**
  - `src\components\whispers\WhisperCard.tsx`
- **Selector:** `.whisper-boost-btn`
- **CSS body (primary):**
```css
.whisper-boost-btn {
font-family: 'Text02', monospace;
  font-size: .58rem;
  letter-spacing: .08em;
  padding: 4px 10px;
  border-radius: 5px;
  border: 1px solid var(--border-secondary, rgba(255,255,255,.12));
  background: transparent;
  color: var(--text-secondary, rgba(207,207,227,.6));
  cursor: pointer;
  transition: background .15s, border-color .15s;
}
```

---

## `.whisper-card`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `/* ── Whisper Cards ───────────────────────────────────────────────────────── */
.whisper-card`, `.whisper-card.whisper-card--boosted`, `.whisper-card.whisper-card--resonated`
- **Selector:** `.whisper-card.whisper-card--boosted`
- **CSS body (primary):**
```css
.whisper-card {
border-color: var(--accent-secondary, rgba(255,200,60,.5));
  box-shadow: 0 0 10px rgba(255,200,60,.1);
}
```

---

## `.whisper-card--boosted`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** box-shadow
- **Selectors (sample):** `.whisper-card.whisper-card--boosted`
- **Selector:** `.whisper-card.whisper-card--boosted`
- **CSS body (primary):**
```css
.whisper-card--boosted {
border-color: var(--accent-secondary, rgba(255,200,60,.5));
  box-shadow: 0 0 10px rgba(255,200,60,.1);
}
```

---

## `.whisper-chip`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.whisper-chip`, `.whisper-chip:hover`
- **Selector:** `.whisper-chip`
- **CSS body (primary):**
```css
.whisper-chip {
font-family: 'Text02', monospace;
  font-size: .82rem;
  letter-spacing: .08em;
  padding: 5px 13px;
  border-radius: 5px;
  border: 1px solid var(--border-secondary, rgba(255,255,255,.12));
  background: transparent;
  color: var(--text-secondary, rgba(207,207,227,.6));
  cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
}
```

---

## `.whisper-float-item`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** animation, filter, backdrop-filter
- **Animations:** whisperFadeIn
- **Selectors (sample):** `.whisper-float-item`, `.whisper-float-item.os-surface--glass`, `.whisper-float-item`
- **Usage sample:**
  - `src\components\whispers\WhisperFloat.tsx`
- **Selector:** `.whisper-float-item`
- **CSS body (primary):**
```css
.whisper-float-item {
position: absolute;
  left: var(--wf-x, 10%);
  top: var(--wf-y, 20%);
  max-width: 260px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: all;
  cursor: pointer;
  animation: whisperFadeIn .6s ease forwards, whisperFadeOut .5s ease 12s forwards;
  opacity: 0;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}
```

---

## `.whisper-form-textarea`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.whisper-form-textarea`, `.whisper-form-textarea:focus`
- **Usage sample:**
  - `src\components\whispers\WhisperForm.tsx`
- **Selector:** `.whisper-form-textarea`
- **CSS body (primary):**
```css
.whisper-form-textarea {
width: 100%;
  min-height: 90px;
  background: rgba(0,0,0,.3);
  border: 1px solid var(--border-secondary, rgba(255,255,255,.12));
  border-radius: 7px;
  color: var(--text-primary, #cfcfe3);
  font-family: var(--font-serif, serif);
  font-size: .85rem;
  line-height: 1.55;
  padding: 10px 12px;
  resize: vertical;
  box-sizing: border-box;
  transition: border-color .15s;
}
```

---

## `.whisper-resonate-btn`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.whisper-resonate-btn`, `.whisper-resonate-btn:hover:not(:disabled)`, `.whisper-resonate-btn:disabled`
- **Selector:** `.whisper-resonate-btn`
- **CSS body (primary):**
```css
.whisper-resonate-btn {
font-family: 'Text02', monospace;
  font-size: .65rem;
  letter-spacing: .12em;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-secondary, rgba(255,255,255,.15));
  background: transparent;
  color: var(--text-primary, #cfcfe3);
  cursor: pointer;
  transition: background .15s, border-color .15s, color .15s;
}
```

---

## `.whisper-submit-section`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** filter, backdrop-filter
- **Selectors (sample):** `/* ── Whisper submit section wrapper ─────────────────────────────────────── */
.whisper-submit-section`, `.whisper-submit-section .whisper-submit-panel`, `.whisper-submit-section .whisper-submit-textarea`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
- **Selector:** `/* ── Whisper submit section wrapper ─────────────────────────────────────── */
.whisper-submit-section`
- **CSS body (primary):**
```css
.whisper-submit-section {
display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 48px 24px 52px;
  background: rgba(0,0,0,.35);
  border-top: 1px solid rgba(124,92,255,.15);
  border-bottom: 1px solid rgba(124,92,255,.15);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
```

---

## `.whisper-submit-section-title`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 1 occurrences across 1 files
- **Effect properties:** text-shadow, transform
- **Selectors (sample):** `.whisper-submit-section-title`
- **Usage sample:**
  - `app\archive\ArchiveClient.tsx`
- **Selector:** `.whisper-submit-section-title`
- **CSS body (primary):**
```css
.whisper-submit-section-title {
font-family: 'Text02', monospace;
  font-size: 1rem;
  letter-spacing: .22em;
  color: var(--accent-primary, #7c5cff);
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 18px rgba(124,92,255,.45);
}
```

---

## `.whisper-submit-select`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 2 occurrences across 1 files
- **Effect properties:** transition
- **Selectors (sample):** `.whisper-submit-select`, `.whisper-submit-select:focus`, `.whisper-submit-select option`
- **Usage sample:**
  - `src\components\whispers\WhisperSubmitPanel.tsx`
- **Selector:** `.whisper-submit-select`
- **CSS body (primary):**
```css
.whisper-submit-select {
background: rgba(0,0,0,.35);
  border: 1px solid rgba(124,92,255,.2);
  border-radius: 5px;
  color: var(--text-primary, #cfcfe3);
  font-family: 'Text02', monospace;
  font-size: .65rem;
  letter-spacing: .05em;
  padding: 6px 10px;
  cursor: pointer;
  outline: none;
  transition: border-color .15s;
  flex-shrink: 0;
}
```

---

## `.whisper-submit-textarea`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 0 occurrences across 0 files
- **Effect properties:** transition
- **Selectors (sample):** `.whisper-submit-textarea`, `.whisper-submit-textarea:focus`, `.whisper-submit-textarea:disabled`
- **Selector:** `.whisper-submit-textarea`
- **CSS body (primary):**
```css
.whisper-submit-textarea {
background: rgba(0,0,0,.32);
  border: 1px solid rgba(124,92,255,.2);
  border-radius: 6px;
  color: var(--text-primary, #cfcfe3);
  font-family: var(--font-serif, serif);
  font-size: .82rem;
  line-height: 1.6;
  padding: 10px 12px;
  resize: vertical;
  width: 100%;
  outline: none;
  transition: border-color .15s;
  box-sizing: border-box;
}
```

---

## `.whisper-submit-title`

- **Status:** defined
- **CSS files:** src\styles\components.css
- **Used in:** 3 occurrences across 1 files
- **Effect properties:** transform
- **Selectors (sample):** `.whisper-submit-title`, `.whisper-submit-section .whisper-submit-title`
- **Usage sample:**
  - `src\components\whispers\WhisperSubmitPanel.tsx`
- **Selector:** `.whisper-submit-title`
- **CSS body (primary):**
```css
.whisper-submit-title {
font-family: 'Text02', monospace;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--accent-primary, #7c5cff);
  margin: 0;
  text-transform: uppercase;
}
```

---

