# SYNTHOMA — registr kanonických zdrojů

Tento registr určuje jedinou povolenou identitu kanonických textových podkladů.
Hash je SHA-256 bajtů uloženého souboru. Změna obsahu vyžaduje vědomé schválení
vlastníkem práv, nový hash a odpovídající revizi tohoto registru.

| Zdroj | Očekávaná cesta v repozitáři | SHA-256 | Stav |
| --- | --- | --- | --- |
| Manifest | `apps/web/public/data/SYNTHOMA-MANIFEST.txt` | `c0269d8691a8d9f588f2a441272f012ec8c462bb4176342697db671e5de42dba` | dostupný |
| Styl | `apps/web/public/data/styl.md` | `4cb9fee5b24a6f38151662bc34b5eb957dcac645e28e79f9cc0f7e2515a6fce7` | dostupný |
| Efekty | `apps/web/public/data/efekty.md` | `61a5fc7a81295b6e25f232c2016bc0a877f50e511a530513cea952717b02fd8a` | dostupný |
| Oblouk | `apps/web/public/data/oblouk.md` | `dbc32df1d1bf2b4d47dd37f4a330f521f9a0e573aef55a37d72c7e3b72940ae8` | dostupný |
| SYNTHOMA-NULL | `apps/web/public/data/SYNTHOMA-NULL.txt` | nedostupný; verze `canon-null/unavailable@2026-07-13` | **HOLD** |

## Blokující pravidlo pro SYNTHOMA-NULL

`SYNTHOMA-NULL.txt` není v pracovním stromu ani v dostupné historii Git. Jeho
obsah se nesmí odhadnout, vygenerovat, přepsat z jiného dokumentu ani nahradit
placeholderem. Jediný povolený postup je získat rights-approved master od
vlastníka zdroje, uložit jej přesně na očekávanou cestu, vypočítat SHA-256 a po
obsahovém schválení zaregistrovat hash a verzi zde.

Do té doby musí každý agent i člověk zastavit práci závislou na tomto zdroji.
Release obsahující takovou závislost je HOLD a obsahové nástroje nesmějí tiše
použít náhražku. Nezávislé migrační, transakční a katalogové ověření může
pokračovat.
