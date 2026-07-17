"use client";

import {
  extractVisibleTextLength,
  getTypewriterDurationMs,
  normalizeChoicesToPlainText,
  renderTypingHtml,
  revealHtmlPreserve,
  sanitizeHTML,
  splitContentAtChoices,
  transformChoicesToButtons,
} from "./typewriterContent";
import {
  UI_PREFERENCES_CHANGED_EVENT,
  getEffectiveMotionMode,
  readUiPreferences,
} from './uiPreferences';

export type RenderMode = "typed" | "instant";

export type RenderReaderSegmentHelpers = {
  cleanupChoices: (container: HTMLElement | null) => void;
  bindChoiceHandlers: () => void;
  revealChoicesStagger: (container: HTMLElement | null) => void;
  restoreScrollSoon?: () => void;
  announce?: (msg: string) => void;
};

export type RenderReaderSegmentOptions = {
  html: string;
  box: HTMLElement;
  mode: RenderMode;
  host: HTMLElement;
  helpers: RenderReaderSegmentHelpers;
  onDone: (result: { segment: HTMLElement; remainderHtml: string }) => void;
  focusFirst?: boolean;
  announceReady?: boolean;
};

export type RenderReaderSegmentResult = {
  segment: HTMLElement;
  remainderHtml: string;
  cancel: () => void;
};

/**
 * Split a chunk of HTML at its first contiguous choice group.
 * Returns the pre-text, the choice block, and everything after it.
 */
export function splitNextSegment(html: string): {
  preHtml: string;
  choiceBlockHtml: string;
  remainderHtml: string;
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div class="content">${html}</div>`, "text/html");
  const root = (doc.querySelector(".content") as HTMLElement) || doc.body;
  const cutoff = root.querySelector("#story-cache");
  const firstCh = root.querySelector("p.choice, .choice-link");
  let preHtml = "";
  let choiceBlockHtml = "";
  let remainderHtml = "";

  if (firstCh) {
    const rPre = doc.createRange();
    rPre.setStart(root, 0);
    rPre.setEndBefore(firstCh);
    const wPre = doc.createElement("div");
    wPre.appendChild(rPre.cloneContents());
    preHtml = wPre.innerHTML;

    let last: Element = firstCh as Element;
    let cur = firstCh.nextElementSibling;
    while (cur && cur.tagName.toLowerCase() === "p" && (cur as HTMLElement).classList.contains("choice")) {
      last = cur;
      cur = cur.nextElementSibling;
    }

    const rBlk = doc.createRange();
    rBlk.setStartBefore(firstCh);
    rBlk.setEndAfter(last);
    const wBlk = doc.createElement("div");
    wBlk.appendChild(rBlk.cloneContents());
    choiceBlockHtml = wBlk.innerHTML;

    const rRem = doc.createRange();
    rRem.setStartAfter(last);
    if (cutoff && cutoff.parentNode) {
      rRem.setEndBefore(cutoff);
    } else {
      const endNode: Node = (root.lastChild ?? root) as Node;
      rRem.setEndAfter(endNode);
    }
    const wRem = doc.createElement("div");
    wRem.appendChild(rRem.cloneContents());
    remainderHtml = wRem.innerHTML;
  } else {
    const rAll = doc.createRange();
    rAll.setStart(root, 0);
    if (cutoff && cutoff.parentNode) {
      rAll.setEndBefore(cutoff);
    } else {
      const endNode: Node = (root.lastChild ?? root) as Node;
      rAll.setEndAfter(endNode);
    }
    const wAll = doc.createElement("div");
    wAll.appendChild(rAll.cloneContents());
    preHtml = wAll.innerHTML;
  }

  return { preHtml, choiceBlockHtml, remainderHtml };
}

/**
 * Render a single reader segment into `box`.
 * If mode is 'typed' the text is progressively revealed, otherwise it is shown instantly.
 * Calls `onDone` with the segment element and the remaining HTML after the choice block.
 */
export function renderReaderSegment(options: RenderReaderSegmentOptions): RenderReaderSegmentResult {
  const { html, box, mode, host, helpers, onDone, focusFirst = false, announceReady = false } = options;
  const { cleanupChoices, bindChoiceHandlers, revealChoicesStagger, restoreScrollSoon, announce } = helpers;

  const { preHtml, choiceBlockHtml, remainderHtml } = splitNextSegment(html);
  const segHtml = preHtml + choiceBlockHtml;
  const typingHtml = normalizeChoicesToPlainText(segHtml);
  const transformed = transformChoicesToButtons(segHtml);
  const textLength = extractVisibleTextLength(typingHtml);

  const segment = document.createElement("div");
  segment.className = "tw-segment";
  box.appendChild(segment);

  let cancelled = false;
  let frameId = 0;

  const prefersInstant = () => {
    const preferences = readUiPreferences();
    return getEffectiveMotionMode(preferences) !== 'full'
      || preferences.textEffects !== 'normal'
      || preferences.typewriterSpeed === 'instant';
  };

  const finish = () => {
    if (cancelled) return;
    if (frameId) cancelAnimationFrame(frameId);
    document.removeEventListener(UI_PREFERENCES_CHANGED_EVENT, onPreferencesChanged);
    try {
      segment.innerHTML = sanitizeHTML(transformed);
    } catch {}
    cleanupChoices(segment);
    bindChoiceHandlers();
    revealChoicesStagger(segment);
    if (focusFirst) {
      try {
        const first = segment.querySelector(".choice-link") as HTMLElement | null;
        if (first) {
          try {
            (first as any)?.focus?.({ preventScroll: true });
          } catch {
            first?.focus?.();
          }
        }
      } catch {}
    }
    if (restoreScrollSoon) restoreScrollSoon();
    if (announceReady && announce) {
      try {
        const first = segment.querySelector(".choice-link") as HTMLElement | null;
        const label = (first?.textContent || "").replace(/\s+/g, " ").trim();
        if (label) announce(`Možnosti jsou připravené. Fokus na: ${label}`);
      } catch {}
    }
    onDone({ segment, remainderHtml });
  };

  const onPreferencesChanged = () => {
    if (prefersInstant()) finish();
  };

  if (mode === "instant" || textLength === 0 || prefersInstant()) {
    segment.innerHTML = sanitizeHTML(transformed);
    cleanupChoices(segment);
    bindChoiceHandlers();
    revealChoicesStagger(segment);
    if (restoreScrollSoon) restoreScrollSoon();
    onDone({ segment, remainderHtml });
    return { segment, remainderHtml, cancel: () => { cancelled = true; } };
  }

  const totalChars = Math.max(1, textLength);
  const duration = getTypewriterDurationMs(host, textLength);
  let startTs: number | null = null;

  const cancel = () => {
    cancelled = true;
    if (frameId) cancelAnimationFrame(frameId);
    document.removeEventListener(UI_PREFERENCES_CHANGED_EVENT, onPreferencesChanged);
  };

  const tick = (ts: number) => {
    if (cancelled) return;
    if (startTs == null) startTs = ts;
    const elapsed = Math.max(0, ts - startTs);
    const progress = Math.min(1, elapsed / Math.max(1, duration));
    const typedCount = Math.max(0, Math.floor(progress * totalChars));
    try {
      segment.innerHTML = sanitizeHTML(renderTypingHtml(typingHtml, typedCount));
    } catch {}
    if (progress >= 1) {
      finish();
      return;
    }
    frameId = requestAnimationFrame(tick);
  };

  try {
    segment.innerHTML = sanitizeHTML(renderTypingHtml(typingHtml, 0));
    // Make choice buttons visible immediately while the typewriter reveals text,
    // instead of hiding them until typing finishes.
    revealChoicesStagger(segment);
  } catch {
    segment.innerHTML = "";
  }
  document.addEventListener(UI_PREFERENCES_CHANGED_EVENT, onPreferencesChanged);
  frameId = requestAnimationFrame(tick);

  return { segment, remainderHtml, cancel };
}
