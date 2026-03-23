export function runCinematicTitleIntro(root: HTMLElement) {
  // Jednoduchý intro efekt: krátký flicker třídy, dokud se nenastartuje reálný helper z window
  let active = true;
  const cls = "intro-flicker";
  root.classList.add(cls);
  const id = window.setInterval(() => {
    if (!active) return;
    root.classList.toggle(cls);
  }, 260);
  // Stop po 4s (pokrývá úvodní nástup manifestu)
  const stop = window.setTimeout(() => { try { root.classList.remove(cls); } catch {}; try { window.clearInterval(id); } catch {} }, 4000);
  // Vrátí canceller
  return () => { active = false; try { root.classList.remove(cls); } catch {}; try { window.clearInterval(id); } catch {}; try { window.clearTimeout(stop); } catch {} };
}
