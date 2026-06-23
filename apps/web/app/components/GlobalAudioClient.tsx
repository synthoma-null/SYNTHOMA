"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * GlobalAudioClient
 * - Udržuje přehrávání globální hudby konzistentní při změně viditelnosti záložky.
 * - Automaticky nespouští hudbu na každé stránce - hudba se přehraje jen jednou a dohraje.
 */
export default function GlobalAudioClient() {
  const pathname = usePathname();

  useEffect(() => {
    // Při změně viditelnosti záložky jen zajistíme, aby hudba nezastavila, pokud už hraje
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        try { 
          const audio = (window as any).__synthomaAudio;
          if (audio && !audio.paused) {
            // Pokud už hudba hraje, jen ji jemně povzbuzíme, ale nespouštíme znovu
            audio.play().catch(() => {});
          }
        } catch {}
      }
    };
    const onPageShow = () => {
      try { 
        const audio = (window as any).__synthomaAudio;
        if (audio && !audio.paused) {
          audio.play().catch(() => {});
        }
      } catch {}
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return null;
}
