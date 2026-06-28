"use client";

import { useEffect, type RefObject } from "react";

/**
 * Ensure the EchoGhost script is loaded once and refresh it for the host.
 * The actual per-segment refresh is called by bindChoiceHandlers because
 * EchoGhost is the single source of truth for echo-ghost effects.
 */
export function useEchoGhost(hostRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const ensureScript = () => {
      if (typeof window === "undefined") return Promise.resolve();
      if ((window as any).EchoGhost) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const scriptId = "echo-ghost-script";
        const existing = document.getElementById(scriptId);
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          return;
        }
        const s = document.createElement("script");
        s.id = scriptId;
        s.src = "/books/echo-ghost.js";
        s.addEventListener("load", () => resolve(), { once: true });
        s.addEventListener("error", () => resolve(), { once: true });
        document.head.appendChild(s);
      });
    };

    ensureScript().then(() => {
      try {
        (window as any).EchoGhost?.refresh(host);
      } catch {}
    });
  }, [hostRef]);
}
