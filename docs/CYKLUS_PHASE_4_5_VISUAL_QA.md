# Cyklus Phase 4.5 Visual QA

Automatický screenshot runner zůstává v tomto prostředí zablokovaný systémovým `EPERM`. Následující kontrola je ruční a nevyžaduje instalaci dalšího nástroje.

## Viewporty

- 360 × 640
- 390 × 844
- 430 × 932
- 844 × 390 landscape
- 1440 × 900

## Command rail

- Pořadí je Domů, stav běhu, Identita, Nastavení, Hudba.
- Na mobilu nejsou u čtyř hlavních ikon viditelné textové labely.
- Každá ikona má skutečný cíl alespoň 44 × 44 px a symbol přibližně 20 px.
- Sektor používá ellipsis; cyklus a postup zůstávají viditelné.
- Header ani tooltipy nepřekrývají stat rail, KONTROLU nebo kartu.
- Na `/cyklus` nejsou vidět ani přístupné staré plovoucí Domů, Identita a Nastavení.
- Na jiné route staré globální ovládání zůstává dostupné.

## Panely a fokus

- Identita otevírá původní identity popup, nikoli jeho kopii.
- Nastavení otevírá stávající control panel.
- Hudba otevírá samostatný audio channel.
- Otevření jednoho panelu zavře jiný panel, který by se překrýval.
- `Escape`, backdrop a explicitní zavření fungují.
- Po zavření se fokus vrátí na správnou ikonu command railu.

## Audio desktop

- Panel je popover vpravo pod headerem, široký přibližně 340 px.
- Zobrazuje skutečný název stopy, pořadí, aktuální čas a délku.
- Previous, play/pause, next, mute a seek ovládají stejný audio element.
- Ikona v headeru rozlišuje paused, playing, muted a otevřený panel.
- Kliknutí mimo panel jej zavře bez zakrytí celé herní plochy.

## Audio mobil

- Panel je bottom sheet vysoký pouze podle obsahu, maximálně 46 dVh.
- Hlavička zůstává dosažitelná a spodní okraj respektuje safe area.
- Sheet nepřekrývá celý viewport a nevytváří horizontální scroll.
- Systémové gesto u spodního okraje zůstává použitelné.

## Motivy

Ověř Synthoma, Green Matrix, Neon Hellfire, Cyber Dystopia, Acid Glitch, Retro Arcade, Mono BW a Mono Light.

- Header, ikony, aktivní marker, identity popup a audio panel používají theme kontrakt.
- Mono Light má bílé povrchy, tmavý text a ikony, šedé rámy a modrý focus ring.
- V Mono Light nezůstává černý vnitřní panel, bílé písmo na bílém ani neonový glow.
- Při `prefers-reduced-motion` se ekvalizér nehýbe; statický playing marker zůstává.

## Release rozhodnutí

- `PASS`: bez duplicitních triggerů, překryvů, ztraceného fokusu a druhého audio elementu.
- `HOLD`: některý panel nelze zavřít, header se nevejde na 360 px, audio používá více elementů nebo Mono Light ztratí kontrast.
