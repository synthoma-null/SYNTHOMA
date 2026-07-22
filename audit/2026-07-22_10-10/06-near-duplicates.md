# Podezřelé near-duplicates

Použit byl perceptuální aHash přes sharp. Nalezeno 25 párů mezi 164 obrázky. Výsledek je kandidátní seznam, nikoli oprávnění k mazání.

1. apps/web/public/assets/icon.png ↔ apps/web/public/icons/apple-touch-icon-180x180.png; distance 3; 1254x1254 / 180x180
2. apps/web/public/assets/icon.png ↔ apps/web/public/icons/pwa-192x192.png; distance 1; 1254x1254 / 192x192
3. apps/web/public/assets/icon.png ↔ apps/web/public/icons/pwa-512x512.png; distance 1; 1254x1254 / 512x512
4. apps/web/public/cards/archive_key_warms.png ↔ apps/web/public/cards/cyklus/pebble_with_glasses.webp; distance 10; 941x1672 / 941x1672
5. apps/web/public/cards/black_folder.png ↔ apps/web/public/cards/cyklus/mirror_shard_hums.webp; distance 9; 941x1672 / 941x1672
6. apps/web/public/cards/black_folder_rustles.png ↔ apps/web/public/cards/cyklus/choose_memory_sandbox.webp; distance 9; 1024x1536 / 1024x1536
7. apps/web/public/cards/cache_of_pain.png ↔ apps/web/public/cards/cyklus/hard_restart.webp; distance 7; 941x1672 / 941x1672
8. apps/web/public/cards/childhood_spade_digs.png ↔ apps/web/public/cards/cyklus/choose_archive.webp; distance 10; 1024x1536 / 1024x1536
9. apps/web/public/cards/cyklus/acid_filter.webp ↔ apps/web/public/cards/glitch_pebble.png; distance 9; 941x1672 / 941x1672
10. apps/web/public/cards/cyklus/auto_repair_patch.webp ↔ apps/web/public/cards/emergency_calibration.png; distance 5; 1024x1536 / 1024x1536
11. apps/web/public/cards/cyklus/black_folder_rustles.webp ↔ apps/web/public/cards/glitch_pebble_multiplies.png; distance 6; 941x1672 / 941x1672
12. apps/web/public/cards/cyklus/cache_of_pain.webp ↔ apps/web/public/cards/noise_filter.png; distance 5; 1024x1536 / 1024x1536
13. apps/web/public/cards/cyklus/childhood_spade_digs.webp ↔ apps/web/public/cards/noise_clump.png; distance 10; 941x1672 / 941x1672
14. apps/web/public/cards/cyklus/choose_acid_yellow.webp ↔ apps/web/public/cards/sarkasma_returns.png; distance 8; 941x1672 / 941x1672
15. apps/web/public/cards/cyklus/choose_glitchka_nest.webp ↔ apps/web/public/cards/wrong_map_leads.png; distance 9; 1024x1536 / 1024x1536
16. apps/web/public/cards/cyklus/gravity_outage.webp ↔ apps/web/public/cards/overclock.png; distance 5; 1024x1536 / 1024x1536
17. apps/web/public/cards/cyklus/mirror_shard.webp ↔ apps/web/public/cards/incoming_message.png; distance 10; 941x1672 / 941x1672
18. apps/web/public/cards/cyklus/noise_filter.webp ↔ apps/web/public/cards/first_boot.png; distance 8; 1024x1536 / 1024x1536
19. apps/web/public/icons/apple-touch-icon-180x180.png ↔ apps/web/public/icons/pwa-192x192.png; distance 4; 180x180 / 192x192
20. apps/web/public/icons/apple-touch-icon-180x180.png ↔ apps/web/public/icons/pwa-512x512.png; distance 2; 180x180 / 512x512
21. apps/web/public/icons/apple-touch-icon-180x180.png ↔ apps/web/public/icons/source/synthoma-pwa-master.png; distance 3; 180x180 / 1254x1254
22. apps/web/public/icons/pwa-192x192.png ↔ apps/web/public/icons/pwa-512x512.png; distance 2; 192x192 / 512x512
23. apps/web/public/icons/pwa-192x192.png ↔ apps/web/public/icons/source/synthoma-pwa-master.png; distance 1; 192x192 / 1254x1254
24. apps/web/public/icons/pwa-512x512.png ↔ apps/web/public/icons/source/synthoma-pwa-master.png; distance 1; 512x512 / 1254x1254
25. apps/web/public/icons/pwa-maskable-192x192.png ↔ apps/web/public/icons/pwa-maskable-512x512.png; distance 1; 192x192 / 512x512

## Interpretace

- Páry PWA masteru a rozměrových ikon jsou očekávané generované varianty.
- Většina párů karet má shodný posterový formát a podobné plochy, ale jiný význam i název; aHash zde vytváří falešné pozitivní výsledky.
- PNG v public/cards jsou velké zdrojové/master obrazy, zatímco public/cards/cyklus/*.webp je optimalizovaná runtime vrstva. Doménový audit potvrdil 66 karet s art a přesně 66 existujících WebP bez sirotků.
- Před jakýmkoli sloučením je nutné zobrazit dvojice vedle sebe a ověřit registry i původ assetu.
