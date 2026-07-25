# SYNTHOMA Effects Usage Guide

## Recommended intensity

- Běžný odstavec: 0–1 jemný inline efekt.
- Klíčová věta: 1 hlavní efekt.
- Systémová událost: `LOG` + max 1 animace.
- Dialog: speaker třída, případně 1 významový efekt.
- Vrchol kapitoly: silnější kombinace, ale krátce.

## Speaker cheat sheet

- `.dialog` — T-AI / systém
- `.dialogN` — NULL-1
- `.dialogS` — Sarkasma (červený glow)
- `.dialogG` — Glitchka (modro-růžový gradient) — **vždy 2 emoji**
- `.dialogD` — Dvanáctník / mýtná entita
- `.dialog.fx-gradient` — Glitchena (červená)

## Safe combinations

- `dialogS` + jemný `.glitchy`
- `log fx-scanline` + `.datastream`
- `span class="fx-neon"` na fragment písmena

## Avoid

- `flicker + shake + blur + gradient + neon` na celém odstavci.
- `.fx-rainbow` ve vážné/hororové scéně.
- Chybějící `data-echo` u `.echo-ghost`.

## Color meaning map

- **cyan** — systém, data, T-AI
- **magenta** — glitch, emoce, přepis
- **žlutá** — varování, restart, systémová pozornost
- **červená** — Sarkasma, touha, obrana, Glitchena
- **modrá/růžová** — Glitchka, bezpečí, dětství
