# SYNTHOMA Cyklus Cards Patch v4

Navazuje na v3.

## Co je nové

- Doplněno `sceneHtml` a `sceneFx` pro karty **62 až 73**:
  - `restart_0` až `restart_5`
  - `entity_sarkasma`
  - `entity_glitchka`
  - `entity_tai`
  - `entity_archive`
  - `entity_form`
  - `entity_memory_beast`
- Restart prolog teď víc funguje jako diagnostický rituál, ne jako sada suchých otázek.
- Entity dostaly výraznější hlas, roli a náladu:
  - Sarkasma = řezná ochrana / firewall
  - Glitchka = měkký bezpečný chaos s přesně dvěma emoji
  - T-AI = péče bez svobody
  - Archiv = paměť jako predátor v dokumentačním kabátě
  - Formulářovna = byrokratický horor
  - Paměťová šelma = hladová paměť, která neřve, ale ví
- Opraveny překlepy u Glitchky:
  - `NAPODODIT` → `NAPODOBIT`
  - `ZPRAVOVAT` → `OPRAVIT`
  - `Zpravoval jsi Glitchku` → `Opravoval jsi Glitchku`
- CSS rozšířeno o akcenty pro:
  - `scene-prologue`
  - `scene-restart-fatigue`
  - `scene-identity`
  - `scene-entity`
  - `scene-beast`

## Soubory

- `cyklusCards.ts`
- `cyklusTypes.ts`
- `CyklusCardScene.tsx`
- `cyklus-card-scene.css`
- `README_PATCH_V1.md`
- `README_PATCH_V2.md`
- `README_PATCH_V3.md`
- `README_PATCH_V4.md`

## Integrace

Stejná jako u v1 až v3:

1. Nahraď `cyklusCards.ts` a `cyklusTypes.ts`.
2. Přidej nebo ponech `CyklusCardScene.tsx`.
3. Importuj `cyklus-card-scene.css` v místě, kde skládáš styly pro čtečku / karty.
4. V renderu scény používej komponentu `CyklusCardScene` místo prostého výpisu `card.scene`.

## Poznámka

Tahle verze ještě nemění engine. Jen přidává bohatší vrstvu scény, takže fallback `scene` pořád zůstává bezpečný pro starší render.
