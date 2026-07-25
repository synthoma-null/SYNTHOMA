# Dialog & Speaker Effects

## `.datastream`

- **Used:** 1211×
- **Defined:** True
- **Properties:** animation, text-clip/gradient, color-mix
```css
}
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

## `.dialog`

- **Used:** 2101×
- **Defined:** True
- **Properties:** box-shadow, animation
```css
p.dialog.fx-gradient::before {
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

## `.dialogD`

- **Used:** 45×
- **Defined:** True
- **Properties:** text-shadow, filter
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

## `.dialogG`

- **Used:** 167×
- **Defined:** True
- **Properties:** box-shadow
```css
p.dialogG::before {
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

## `.dialogN`

- **Used:** 428×
- **Defined:** True
- **Properties:** text-shadow
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

## `.dialogS`

- **Used:** 592×
- **Defined:** True
- **Properties:** text-shadow
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

## `.fx-gradient`

- **Used:** 174×
- **Defined:** True
- **Properties:** text-shadow, animation
```css
}

.dialog.fx-gradient {
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

## `.halo`

- **Used:** 328×
- **Defined:** True
- **Properties:** text-shadow
```css
.halo {
color: var(--text-primary);
    text-shadow: 0 0 6px var(--glow-secondary), 0 0 14px var(--glow-primary);
}
```

## `.log`

- **Used:** 1234×
- **Defined:** True
- **Properties:** text-shadow, transform
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

## `.text`

- **Used:** 8336×
- **Defined:** True
- **Properties:** text-shadow
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

## `.textV`

- **Used:** 2×
- **Defined:** True
- **Properties:** text-shadow
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
   …
}
```

## `.title`

- **Used:** 311×
- **Defined:** True
- **Properties:** box-shadow, animation
```css
.title::before {
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

## Emoji rule check (Glitchka)

Chapters containing `.dialogG`: 18

- `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_11_BETA.html` (0 `.dialogG` occurrences)
- `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_12_TOVA.html` (0 `.dialogG` occurrences)
- `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_13_KONTINUITA.html` (0 `.dialogG` occurrences)
- `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_14_REKLAMACE.html` (0 `.dialogG` occurrences)
- `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_15_MIGRACE.html` (0 `.dialogG` occurrences)
- `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_16_RUCNI_REZIM.html` (0 `.dialogG` occurrences)
- `public\books\SYNTHOMA-KONEC_PODPORY\SYNTHOMA_KONEC_PODPORY_17_ZADNA_ODPOVED.html` (0 `.dialogG` occurrences)
- `public\books\SYNTHOMA-NULL\0-2 [RUN].html` (1 `.dialogG` occurrences)
- `public\books\SYNTHOMA-NULL\0-2 [RUN]_en.html` (1 `.dialogG` occurrences)
- `public\books\SYNTHOMA-NULL\SYNTHOMA.html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-10 [REST].html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-11 [ORGIE].html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-4 [DEFRAGMENTATION].html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-5 [PAUSE].html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-6 [SEARCHING].html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-7 [RUINS].html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-8 [REZIDUUM].html` (1 `.dialogG` occurrences)
- `src\content\protected\SYNTHOMA-NULL\0-9 [SECTOR].html` (1 `.dialogG` occurrences)
