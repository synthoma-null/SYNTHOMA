"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Minimal scroll guard for dynamic content growth (typewriter etc.)
// Locks scroll position during DOM mutations inside reader containers,
// but backs off if the user is actively scrolling.
export default function ScrollGuardClient() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Prefer anchor-delta approach over absolute restore to avoid fight with user
    let lastScrollY = window.scrollY;
    let userScrolling = false;
    let rafId: number | null = null;
    let restorePending = false;

    const onScroll = () => {
      userScrolling = true;
      lastScrollY = window.scrollY;
      // Let user scroll freely; reset flag after a short idle period
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        userScrolling = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const getContainers = () => Array.from(
      document.querySelectorAll(
        ".SYNTHOMAREADER .chapter-content, #reader-body, #reader-extra, .typed-box, .tw-segment, .typewriter"
      )
    ) as HTMLElement[];

    const restoreScroll = () => {
      if (userScrolling) return; // don't fight the user
      if (restorePending) return;
      restorePending = true;
      requestAnimationFrame(() => {
        restorePending = false;
        // Anchor element near top-left to maintain visual stability
        const anchor = document.elementFromPoint(16, 16) as HTMLElement | null;
        const beforeTop = anchor?.getBoundingClientRect().top ?? null;
        // Force sync reflow by reading; then compute delta
        // eslint-disable-next-line no-unused-expressions
        document.body.offsetHeight;
        const afterTop = anchor?.getBoundingClientRect().top ?? null;
        if (beforeTop != null && afterTop != null) {
          const dy = afterTop - beforeTop;
          if (Math.abs(dy) > 0.5) {
            window.scrollBy({ top: dy, left: 0, behavior: "auto" });
            return;
          }
        }
        // Fallback: keep previous absolute Y if needed
        window.scrollTo({ top: lastScrollY, left: 0, behavior: "auto" });
      });
    };

    const observer = new MutationObserver((mutations) => {
      // Check for meaningful changes: added nodes or text changes
      const meaningful = mutations.some((m) =>
        (m.type === "childList" && (m.addedNodes.length > 0 || m.removedNodes.length > 0)) ||
        m.type === "characterData"
      );
      if (!meaningful) return;

      // Skip if near top (no need to restore)
      lastScrollY = window.scrollY;
      if (lastScrollY < 8) return;

      restoreScroll();
    });

    const bindContainers = () => {
      observer.disconnect();
      const containers = getContainers();
      containers.forEach((el) =>
        observer.observe(el, {
          subtree: true,
          childList: true,
          characterData: true,
        })
      );
    };

    bindContainers();
    const rebindId = requestAnimationFrame(() => requestAnimationFrame(bindContainers));

    return () => {
      observer.disconnect();
      cancelAnimationFrame(rebindId);
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
}
