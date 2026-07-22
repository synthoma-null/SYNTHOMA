"use client";

import { useCallback, useEffect, useRef, useState, type RefObject, type Dispatch, type SetStateAction } from "react";
import { renderReaderSegment } from "../lib/readerSegmentRenderer";
import type { ReaderFlowState } from "../lib/readerDecisionController";

export type TypewriterPlaybackHelpers = {
  cleanupChoices: (container: HTMLElement | null) => void;
  revealChoicesStagger: (container: HTMLElement | null) => void;
  restoreScrollSoon?: () => void;
  announce?: (msg: string) => void;
};

export type UseTypewriterPlaybackOptions = {
  hostRef: RefObject<HTMLElement | null>;
  helpers: TypewriterPlaybackHelpers;
  setChoicesShownRef: RefObject<Dispatch<SetStateAction<boolean>>>;
  onFlowStateChange: (state: ReaderFlowState) => void;
};

/**
 * Manage the typewriter playback state: typedBox, continuation chain, cancel,
 * isTyping and choicesShown. Exposes refs so useChoiceHandlers can request
 * a new segment without creating a circular hook dependency.
 */
export function useTypewriterPlayback(options: UseTypewriterPlaybackOptions) {
  const { hostRef, helpers, setChoicesShownRef, onFlowStateChange } = options;
  const { cleanupChoices, revealChoicesStagger, restoreScrollSoon, announce } = helpers;

  const [isTyping, setIsTyping] = useState(false);
  const isTypingRef = useRef(false);
  const continueRef = useRef<(() => void) | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);
  const typedBoxRef = useRef<HTMLElement | null>(null);
  const bindChoiceHandlersRef = useRef<() => void>(() => {});
  const renderSegmentRef = useRef<(html: string, mode: "typed" | "instant") => void>(() => {});
  const setContinuationRef = useRef<(html: string) => void>(() => {});
  const renderedSegmentRef = useRef(false);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping, isTypingRef]);

  const ensureTypedBox = useCallback(() => {
    const host = hostRef.current;
    if (!host) return null;
    let box = typedBoxRef.current;
    if (!box || !document.body.contains(box)) {
      box = document.createElement("div");
      box.className = "typed-box";
      host.innerHTML = "";
      host.appendChild(box);
      typedBoxRef.current = box;
    }
    return box;
  }, [hostRef]);

  const renderSegment = useCallback(
    (html: string, mode: "typed" | "instant") => {
      const host = hostRef.current;
      const box = ensureTypedBox();
      if (!host || !box) return { cancel: () => {} };
      onFlowStateChange(renderedSegmentRef.current ? 'TYPING_CONTINUATION' : 'TYPING');
      renderedSegmentRef.current = true;
      if (mode === "typed") setIsTyping(true);

      const helpers: import("../lib/readerSegmentRenderer").RenderReaderSegmentHelpers = {
        cleanupChoices,
        bindChoiceHandlers: () => bindChoiceHandlersRef.current(),
        revealChoicesStagger,
      };
      if (restoreScrollSoon) helpers.restoreScrollSoon = restoreScrollSoon;
      if (announce) helpers.announce = announce;

      const { cancel } = renderReaderSegment({
        html,
        box,
        mode,
        host,
        helpers,
        onDone: ({ remainderHtml }) => {
          setIsTyping(false);
          setChoicesShownRef.current(true);
          setContinuationRef.current(remainderHtml);
          const waitingForChoice = Boolean(box.lastElementChild?.querySelector('.choice-link'));
          onFlowStateChange(waitingForChoice ? 'WAITING_FOR_CHOICE' : 'CHAPTER_COMPLETE');
        },
      });
      cancelRef.current = cancel;
      return { cancel };
    },
    [hostRef, ensureTypedBox, cleanupChoices, revealChoicesStagger, restoreScrollSoon, announce, setIsTyping, setChoicesShownRef, onFlowStateChange]
  );

  const setContinuation = useCallback((html: string) => {
    if (!(html && html.trim())) {
      continueRef.current = null;
      return;
    }
    continueRef.current = () => {
      renderSegmentRef.current(html, "typed");
    };
  }, []);

  const resetPlaybackFlow = useCallback(() => {
    renderedSegmentRef.current = false;
    continueRef.current = null;
    cancelRef.current?.();
    cancelRef.current = null;
  }, []);

  useEffect(() => {
    renderSegmentRef.current = renderSegment;
    setContinuationRef.current = setContinuation;
  }, [renderSegment, setContinuation, bindChoiceHandlersRef]);

  return {
    isTyping,
    setIsTyping,
    isTypingRef,
    continueRef,
    cancelRef,
    typedBoxRef,
    bindChoiceHandlersRef,
    renderSegmentRef,
    setContinuationRef,
    renderSegment,
    setContinuation,
    resetPlaybackFlow,
  };
}
