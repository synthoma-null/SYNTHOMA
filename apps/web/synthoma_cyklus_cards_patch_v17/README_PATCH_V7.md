# SYNTHOMA Cyklus Cards Patch v7

Sedmá dávka rozšiřuje karty **131 až 160**:

- `token_wants_name`
- `unnamed_token_resentment`
- `seal_squeaks`
- `seal_demands_stamp`
- `corridor_breathes`
- `door_refuses_no`
- `door_waits_politely`
- `quiet_room_coat`
- `wall_laughter`
- `wall_laughter_returns`
- `ownerless_shadow`
- `shadow_follows_card`
- `mirror_demands_apology`
- `mirror_shards_argue`
- `wrong_name`
- `wrong_name_returns`
- `market_sells_your_no`
- `someone_buys_your_no`
- `market_receipt_bleeds`
- `replacement_problem`
- `form_smiles`
- `form_misunderstands`
- `form_collects_signature`
- `audit_siren`
- `soft_bug`
- `soft_bug_grows`
- `glitchka_finds_empty_blanket`
- `glitchka_forgot_punchline`
- `energy_dim_light`
- `energy_too_fast`

## Co se změnilo

- Přidáno `sceneHtml` pro dalších 30 karet.
- Celkový počet karet se scénovým HTML je teď **160**.
- Doplněny `sceneFx` pro:
  - pojmenované / nepojmenované předměty,
  - žeton a jeho významový dluh,
  - gumového tuleně,
  - živé dveře a chodby,
  - kabát v tiché místnosti,
  - smějící se zeď,
  - stín bez vlastníka,
  - Zrcadlo a omluvu sobě,
  - cizí jméno a Reziduum,
  - Tržiště a prodej hranic,
  - Formulářovnu a podpisové pasti,
  - auditní krizi,
  - měkkou chybu a její růst,
  - Glitchčinu tichou ztrátu,
  - nízkou a přestřelenou energii.

## CSS

Do `cyklus-card-scene.css` byl přidán blok:

```css
/* Patch v7: named objects, boundary economy, living paperwork and soft glitches */
```

Nové akcenty jsou kompatibilní s předchozími patchi. Využívají hlavně proměnnou `--scene-accent`, border styly, jemné filtry a `prefers-reduced-motion` fallback.

## Poznámka

Glitchka stále drží pravidlo přesně dvou emoji v mluvených replikách. Ano, i liščí chaos potřebuje normu. Civilizace zatím přežívá.
