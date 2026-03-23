"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * GlobalAudioClient
 * - Udržuje přehrávání globální hudby konzistentní při navigaci a změně viditelnosti záložky.
 * - Nesahá do playlistu, jen volá existující API z ControlPanelClient: window.audioPanelEnsurePlaying?.()
 */
export default function GlobalAudioClient() {
  const pathname = usePathname();

  useEffect(() => {
    // Při mountu a každé změně cesty jemně kopneme do audia, aby nezdechlo mezi routami
    try { (window as any).audioPanelEnsurePlaying?.(); } catch {}
  }, [pathname]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        try { (window as any).audioPanelEnsurePlaying?.(); } catch {}
      }
    };
    const onPageShow = () => {
      try { (window as any).audioPanelEnsurePlaying?.(); } catch {}
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
