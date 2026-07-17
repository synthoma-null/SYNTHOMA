import { useEffect, useRef, type RefObject } from "react";

function areAnimationsDisabled(): boolean {
  try {
    const v = localStorage.getItem("animationsDisabled");
    return v === "true";
  } catch {
    return false;
  }
}

function shouldBePaused(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return true;
  if (areAnimationsDisabled()) return true;
  if (document.hidden) return true;
  return false;
}

/**
 * Pauses a background video when the tab is hidden, when the user prefers
 * reduced motion, or when synthoma animations are disabled via the control panel.
 * Listens to `synthoma:animations-changed` to react to panel toggles.
 * Pass an existing ref or use the returned ref on a <video> element.
 */
export function useVideoVisibility(
  externalRef?: RefObject<HTMLVideoElement | null>
): RefObject<HTMLVideoElement | null> {
  const internalRef = useRef<HTMLVideoElement | null>(null);
  const ref = externalRef ?? internalRef;

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    // Apply initial state
    if (shouldBePaused()) {
      el.pause();
    } else {
      el.play().catch(() => {});
    }

    const onVis = () => {
      if (shouldBePaused()) {
        el.pause();
      } else {
        el.play().catch(() => {});
      }
    };

    const onAnimationsChanged = () => {
      if (areAnimationsDisabled()) {
        el.pause();
      } else if (!document.hidden) {
        el.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("synthoma:animations-changed", onAnimationsChanged);
    return () => {
      el.pause();
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("synthoma:animations-changed", onAnimationsChanged);
    };
  }, [ref]);

  return ref;
}
