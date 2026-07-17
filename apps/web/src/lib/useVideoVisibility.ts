import { useEffect, useRef, type RefObject } from "react";
import {
  UI_PREFERENCES_CHANGED_EVENT,
  isBackgroundMotionAllowed,
  readUiPreferences,
} from './uiPreferences';

function shouldBePaused(): boolean {
  if (typeof window === "undefined") return false;
  if (!isBackgroundMotionAllowed(readUiPreferences())) return true;
  if (document.hidden) return true;
  return false;
}

/**
 * Pauses a background video when the tab is hidden, when the user prefers
 * reduced motion, data saver, or the canonical background motion preference.
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

    const onAnimationsChanged = onVis;

    document.addEventListener("visibilitychange", onVis);
    document.addEventListener(UI_PREFERENCES_CHANGED_EVENT, onAnimationsChanged);
    return () => {
      el.pause();
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener(UI_PREFERENCES_CHANGED_EVENT, onAnimationsChanged);
    };
  }, [ref]);

  return ref;
}
