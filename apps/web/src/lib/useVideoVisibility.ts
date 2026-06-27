import { useEffect, useRef, type RefObject } from "react";

/**
 * Pauses a background video when the tab is hidden and resumes on visibility.
 * Also immediately pauses if the user prefers reduced motion.
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

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      el.pause();
      return;
    }

    const onVis = () => {
      if (document.hidden) {
        el.pause();
      } else {
        el.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [ref]);

  return ref;
}
