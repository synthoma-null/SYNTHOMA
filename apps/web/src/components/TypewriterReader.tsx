"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { readChoicesState, saveChoicesState } from "../lib/readerState";
import {
  extractVisibleTextLength,
  normalizeChoicesToPlainText,
  sanitizeHTML,
  splitContentAtChoices,
  transformChoicesToButtons,
} from "../lib/typewriterContent";
import { renderReaderSegment } from "../lib/readerSegmentRenderer";
import { useEchoGhost } from "../hooks/useEchoGhost";
import { useGlitching } from "../hooks/useGlitching";
import { useReaderFetch } from "../hooks/useReaderFetch";
import { useReaderResume } from "../hooks/useReaderResume";
import { useChoiceTracking } from "../hooks/useChoiceTracking";
import { useChoiceHandlers } from "../hooks/useChoiceHandlers";
import { useTypewriterPlayback } from "../hooks/useTypewriterPlayback";
import {
  READER_FLOW_EVENT,
  type ReaderFlowEventDetail,
  type ReaderFlowState,
} from "../lib/readerDecisionController";

// Dev-only diagnostic helper — silent in production
function softFail(scope: string, err: unknown): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[TypewriterReader:${scope}]`, err);
  }
}

export interface TypewriterReaderProps {
  srcUrl: string;            // URL k HTML (např. /data/SYNTHOMAINFO.html nebo kapitola)
  className?: string;        // extra třídy pro wrapper
  ariaLabel?: string;
  autoStart?: boolean;       // auto spustit typewriter po načtení
  id?: string;               // volitelný id atribut pro root (např. "hero-info")
  instantMode?: boolean;     // skip typewriter, show all text immediately
  onFetchError?: (status: number) => void; // called with HTTP status on non-ok response
  chapterId?: string | undefined;  // ID kapitoly z booksManifest (pro server tracking)
  collection?: string | undefined;  // Kolekce (default: SYNTHOMA-NULL)
}

export default function TypewriterReader({ srcUrl, className = '', ariaLabel = 'Čtečka', autoStart = true, id, instantMode = false, onFetchError, chapterId: chapterIdProp, collection: collectionProp }: TypewriterReaderProps) {
  const router = useRouter();
  const readerRootRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const lastUserScrollRef = useRef<number>(Date.now());

  const { doc, storyCache: storyCacheFetched, error: fetchError, isLoading: fetchLoading } = useReaderFetch(srcUrl, onFetchError);
  const storyCacheRef = useRef<string>('');
  useEffect(() => { storyCacheRef.current = storyCacheFetched; }, [storyCacheFetched]);

  const { pendingResume, saveResume, clearResume } = useReaderResume();
  const { scoreFromNode } = useChoiceTracking(chapterIdProp, collectionProp);
  const [choicesShown, setChoicesShown] = useState(false);
  const [flowState, setFlowStateValue] = useState<ReaderFlowState>('TYPING');
  const setChoicesShownRef = useRef(setChoicesShown);
  useEffect(() => { setChoicesShownRef.current = setChoicesShown; }, [setChoicesShown]);

  const setFlowState = useCallback((state: ReaderFlowState) => {
    setFlowStateValue(state);
    const root = readerRootRef.current;
    if (!root) return;
    root.dataset.readerFlowState = state;
    const detail: ReaderFlowEventDetail = {
      chapterId: chapterIdProp ?? srcUrl,
      state,
      complete: state === 'CHAPTER_COMPLETE',
    };
    root.dispatchEvent(new CustomEvent<ReaderFlowEventDetail>(READER_FLOW_EVENT, { bubbles: true, detail }));
  }, [chapterIdProp, srcUrl]);

  // Prevent viewport jumping by restoring scroll after DOM mutations
  const restoreScrollSoon = useCallback(() => {
    try {
      const x = window.scrollX, y = window.scrollY;
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(x, y)));
    } catch {}
  }, []);

  // Global observer to neutralize layout-induced jumps while typing or revealing
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const onScroll = () => { lastUserScrollRef.current = Date.now(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const mo = new MutationObserver((mutations) => {
      try {
        // Skip during active typewriter animation to avoid fighting the animation
        if (isTypingRef.current) return;
        // Skip if user scrolled very recently (let user intent win)
        if (Date.now() - lastUserScrollRef.current < 120) return;
        // Only react to changes within our host (should be always true)
        const relevant = mutations.some(m => m.type === 'childList' || m.type === 'characterData');
        if (!relevant) return;
        // Force preserve viewport on any relevant mutation to eliminate jumps
        restoreScrollSoon();
      } catch {}
    });
    mo.observe(host, { subtree: true, childList: true, characterData: true });
    return () => { try { mo.disconnect(); } catch {}; window.removeEventListener('scroll', onScroll as any); };
    // The ref is stable for the component lifetime and is initialized before this effect runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restoreScrollSoon]);

  // Nicely reveal choices after the typing completes: apply appear class and then show sequentially
  const revealChoicesStagger = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    try {
      const links = Array.from(container.querySelectorAll<HTMLElement>('.choice-link'));
      if (!links.length) return;
      // ensure host marks choices visible gate
      const host = container.closest('.SYNTHOMAREADER') as HTMLElement | null;
      if (host) host.classList.add('choices-shown');
      // prepare and stagger
      links.forEach((btn) => {
        btn.classList.add('choice-appear');
        btn.classList.add('visible');
      });
    } catch {}
  }, []);

  const announce = useCallback((msg: string) => {
    try {
      if (!liveRef.current) return;
      liveRef.current.textContent = msg;
    } catch {}
  }, []);

  // Restore visual state of previously chosen choices from localStorage
  const restoreChoiceVisuals = useCallback((container: HTMLElement) => {
    try {
      const saved = readChoicesState(srcUrl);
      if (!saved.length) return;
      const allGroups = Array.from(container.querySelectorAll<HTMLElement>('.choices-locked, [data-choice-group]'));
      // Fall back to implicit groups: adjacent choice-link siblings in same parent
      const groupParents = new Set<Element>();
      container.querySelectorAll<HTMLElement>('.choice-link').forEach(el => {
        if (el.parentElement) groupParents.add(el.parentElement);
      });
      saved.forEach(({ groupKey, chosenIdx }) => {
        // Find the group by key (id) or index
        let group: HTMLElement | null = groupKey ? (container.querySelector(`#${CSS.escape(groupKey)}`) as HTMLElement | null) : null;
        if (!group) {
          const idx = parseInt(groupKey, 10);
          const parents = Array.from(groupParents);
          group = (isFinite(idx) && parents[idx]) ? parents[idx] as HTMLElement : null;
        }
        if (!group) return;
        const nodes = Array.from(group.querySelectorAll<HTMLElement>('button.choice-link, a.choice-link')) as HTMLElement[];
        if (!nodes.length) return;
        nodes.forEach((node, i) => {
          if (i === chosenIdx) {
            node.classList.add('chosen'); node.classList.remove('faded');
            node.setAttribute('aria-disabled', 'true');
            if (node instanceof HTMLButtonElement) node.disabled = true;
          } else {
            node.classList.add('faded'); node.classList.remove('chosen');
            node.setAttribute('aria-disabled', 'true');
            if (node instanceof HTMLButtonElement) node.disabled = true;
          }
        });
        group.classList.add('choices-locked');
      });
    } catch {}
  }, [srcUrl]);

  // Save chosen index for a group to localStorage
  const persistChoiceState = useCallback((node: HTMLElement, container: HTMLElement) => {
    try {
      const saved = readChoicesState(srcUrl);
      // Determine group parent
      let group: HTMLElement | null = (node.closest('[data-choice-group], .choices, .choice-group') as HTMLElement | null)
        ?? (node.parentElement as HTMLElement | null);
      if (!group) return;
      const nodes = Array.from(group.querySelectorAll<HTMLElement>('button.choice-link, a.choice-link')) as HTMLElement[];
      const chosenIdx = nodes.indexOf(node);
      if (chosenIdx < 0) return;
      // Build groupKey: prefer id, else index among all group parents
      const groupKey = group.id || (() => {
        const parents = Array.from(container.querySelectorAll<HTMLElement>('.choice-link')
          ? new Set(Array.from(container.querySelectorAll<HTMLElement>('.choice-link')).map(el => el.parentElement).filter(Boolean)) : []);
        return String(parents.indexOf(group));
      })();
      const chosenText = (node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
      const dataNextRaw = node.getAttribute('data-next') || '';
      const href = node.getAttribute('href') || node.getAttribute('data-href') || '';
      const tags = (node.getAttribute('data-tags') || node.closest<HTMLElement>('p.choice')?.dataset.tags || '')
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter(Boolean);
      const existing = saved.findIndex(s => s.groupKey === groupKey);
      const entry: import('../lib/readerState').ChoiceGroupState = {
        groupKey,
        chosenIdx,
        chosenText,
        chapterId: chapterIdProp ?? srcUrl,
        collection: collectionProp ?? 'SYNTHOMA-NULL',
        choiceId: node.dataset.choiceId || `${groupKey}:${chosenIdx}`,
        tags,
        selectedAt: Date.now(),
        ...(dataNextRaw ? { dataNext: dataNextRaw } : {}),
        ...(href ? { href } : {}),
      };
      if (existing >= 0) { saved[existing] = entry; } else { saved.push(entry); }
      saveChoicesState(srcUrl, saved);
    } catch {}
  }, [chapterIdProp, collectionProp, srcUrl]);

  // Ensure any choices in the given container are fully interactive and not faded/disabled
  const cleanupChoices = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    try {
      // Remove any accidental faded/disabled states from choices
      container.querySelectorAll('.choice-link').forEach((el) => {
        const node = el as HTMLElement;
        node.classList.remove('faded');
        node.classList.remove('disabled');
        node.classList.remove('choice-empty');
        node.classList.remove('typing');
        node.style.removeProperty('pointer-events');
        if (node instanceof HTMLButtonElement) { node.disabled = false; }
        node.removeAttribute('aria-disabled');
        if (node.tagName.toLowerCase() === 'a') {
          const a = node as HTMLAnchorElement;
          const href = a.getAttribute('href');
          if (href) a.setAttribute('data-href', href);
          a.removeAttribute('href');
          a.setAttribute('role', 'button');
          a.tabIndex = 0;
        }
      });
      // Mark visible state via React state (not just classList) so React re-renders
      // do not strip 'choices-shown' from the host className on the next render.
      try { setChoicesShownRef.current(true); } catch {}
      const host = container.closest('.SYNTHOMAREADER');
      if (host) { (host as HTMLElement).classList.add('choices-shown'); }
    } catch {}
  }, []);

  const {
    isTyping,
    setIsTyping,
    isTypingRef,
    continueRef,
    cancelRef,
    typedBoxRef,
    bindChoiceHandlersRef,
    renderSegmentRef,
    setContinuationRef,
    resetPlaybackFlow,
  } = useTypewriterPlayback({
    hostRef,
    helpers: {
      cleanupChoices,
      revealChoicesStagger,
      restoreScrollSoon,
      announce,
    },
    setChoicesShownRef,
    onFlowStateChange: setFlowState,
  });

  // Single helper: lock a choice group visually after a selection
  // Eliminates the 4× duplicated sibling-walk logic across click branches
  const lockChoiceGroup = useCallback((chosen: HTMLElement, root: HTMLElement) => {
    try {
      // First try an explicit group container
      let explicitGroup: HTMLElement | null = (chosen.closest('[data-choice-group], .choices, .choice-group') as HTMLElement | null);
      if (explicitGroup) {
        const siblings = Array.from(explicitGroup.querySelectorAll<HTMLElement>('button.choice-link, a.choice-link')) as HTMLElement[];
        siblings.forEach((sh) => {
          const isChosen = sh === chosen;
          sh.classList.toggle('chosen', isChosen);
          sh.classList.toggle('faded', !isChosen);
          sh.classList.toggle('selected', isChosen);
          sh.classList.toggle('disabled', !isChosen);
          sh.setAttribute('aria-disabled', 'true');
          if (!isChosen && sh instanceof HTMLButtonElement) sh.disabled = true;
          const isAnchor = sh.tagName.toLowerCase() === 'a' && !!sh.getAttribute('href');
          if (isChosen && !isAnchor) sh.setAttribute('aria-pressed', 'true');
          try { sh.closest('p.choice')?.classList.toggle('selected', isChosen); sh.closest('p.choice')?.classList.toggle('disabled', !isChosen); } catch {}
        });
        try { explicitGroup.classList.add('choices-locked'); } catch {}
        return;
      }

      // No explicit group — collect the contiguous block of adjacent p.choice siblings
      // around the p.choice that contains `chosen`. This avoids accidentally selecting
      // p.choice elements elsewhere in the document (e.g. when parent is <body>).
      const chosenRow = (chosen.closest('p.choice') as HTMLElement | null) ?? chosen.parentElement;
      if (!chosenRow) return;
      const parent = chosenRow.parentElement;
      if (!parent) return;

      const block: HTMLElement[] = [chosenRow];
      // walk backwards
      let sib: Element | null = chosenRow.previousElementSibling;
      while (sib && sib.tagName.toLowerCase() === 'p' && (sib as HTMLElement).classList.contains('choice')) {
        block.unshift(sib as HTMLElement);
        sib = sib.previousElementSibling;
      }
      // walk forwards
      sib = chosenRow.nextElementSibling;
      while (sib && sib.tagName.toLowerCase() === 'p' && (sib as HTMLElement).classList.contains('choice')) {
        block.push(sib as HTMLElement);
        sib = sib.nextElementSibling;
      }

      // Lock all choice-links within this contiguous block only
      block.forEach((row) => {
        const isChosenRow = row === chosenRow;
        row.classList.toggle('selected', isChosenRow);
        row.classList.toggle('disabled', !isChosenRow);
        const links = Array.from(row.querySelectorAll<HTMLElement>('button.choice-link, a.choice-link')) as HTMLElement[];
        links.forEach((sh) => {
          sh.classList.toggle('chosen', isChosenRow);
          sh.classList.toggle('faded', !isChosenRow);
          sh.classList.toggle('selected', isChosenRow);
          sh.classList.toggle('disabled', !isChosenRow);
          sh.setAttribute('aria-disabled', 'true');
          if (!isChosenRow && sh instanceof HTMLButtonElement) sh.disabled = true;
          const isAnchor = sh.tagName.toLowerCase() === 'a' && !!sh.getAttribute('href');
          if (isChosenRow && !isAnchor) sh.setAttribute('aria-pressed', 'true');
        });
      });
      // Do NOT add choices-locked to the parent — it is likely a large container (body/div)
      // and .choices-locked .choice-link:not(.chosen) { pointer-events:none } would disable
      // ALL future choice groups further down the page.
      // Individual .faded links already have pointer-events:none via CSS.
    } catch (err) { softFail('lockChoiceGroup', err); }
  }, []);


  const renderNextSegment = useCallback((html: string, mode: "typed" | "instant") => {
    renderSegmentRef.current(html, mode);
  }, [renderSegmentRef]);
  const { bindChoiceHandlers } = useChoiceHandlers({
    hostRef,
    storyCacheRef,
    continueRef,
    router,
    srcUrl,
    lockChoiceGroup,
    scoreFromNode,
    persistChoiceState,
    announce,
    renderNextSegment,
    setFlowState,
  });
  useEffect(() => { bindChoiceHandlersRef.current = bindChoiceHandlers; }, [bindChoiceHandlers, bindChoiceHandlersRef]);
  const { glitchCleanupRef } = useGlitching(hostRef, isTypingRef);
  useEchoGhost(hostRef);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !doc) return;
    resetPlaybackFlow();
    const contentEl = (doc.querySelector('.content') as HTMLElement) || (doc.body as HTMLElement);
    contentEl.setAttribute('aria-live', 'polite');
    const {
      preHtml,
      choiceBlockHtml: firstChoiceBlockHtml,
      remainderHtml: initialRemainderHtml,
    } = splitContentAtChoices(doc, contentEl);
    const segHtml = preHtml + firstChoiceBlockHtml;
    const typingPhaseHtml = normalizeChoicesToPlainText(segHtml);
    const transformed = transformChoicesToButtons(segHtml);
    const textLength = extractVisibleTextLength(typingPhaseHtml);
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    host.innerHTML = '';
    const typedBox = document.createElement('div');
    typedBox.className = 'typed-box';
    host.appendChild(typedBox);
    typedBoxRef.current = typedBox;

    const setContinuationFromRemainder = (remHtml: string) => {
      setContinuationRef.current(remHtml);
    };

    const appendCachedSectionImmediate = (sectionHtml: string) => {
      renderSegmentRef.current(sectionHtml, 'instant');
    };

    const tryRestoreResume = () => {
      if (!pendingResume || pendingResume.chapterPath !== srcUrl) return false;
      if (pendingResume.dataNext && storyCacheRef.current) {
        try {
          const parserR = new DOMParser();
          const docR = parserR.parseFromString(`<div id="_cache">${storyCacheRef.current}</div>`, 'text/html');
          const holderR = docR.getElementById('_cache') as HTMLElement | null;
          const targetR = holderR ? holderR.querySelector(`#${CSS.escape(pendingResume.dataNext)}`) as HTMLElement | null : null;
          if (targetR) {
            clearResume();
            appendCachedSectionImmediate(targetR.innerHTML);
            announce('Obnoveno poslední pokračování.');
            return true;
          }
        } catch {}
      }
      if (pendingResume.hash) {
        try {
          const selector = pendingResume.hash.trim();
          if (selector.startsWith('#')) {
            const visibleTarget = typedBox.querySelector(selector) as HTMLElement | null;
            if (visibleTarget) {
              clearResume();
              requestAnimationFrame(() => {
                try { visibleTarget.scrollIntoView({ block: 'center', behavior: 'auto' }); } catch {}
              });
              announce('Obnovena poslední pozice ve čtečce.');
              return true;
            }
            const targetId = selector.slice(1);
            if (targetId && storyCacheRef.current) {
              const parserR = new DOMParser();
              const docR = parserR.parseFromString(`<div id="_cache">${storyCacheRef.current}</div>`, 'text/html');
              const holderR = docR.getElementById('_cache') as HTMLElement | null;
              const targetR = holderR ? holderR.querySelector(`#${CSS.escape(targetId)}`) as HTMLElement | null : null;
              if (targetR) {
                clearResume();
                appendCachedSectionImmediate(targetR.innerHTML);
                announce('Obnoveno poslední pokračování.');
                return true;
              }
            }
          }
        } catch {}
      }
      return false;
    };

    if (!autoStart || textLength === 0 || prefersReduced || instantMode) {
      typedBox.innerHTML = sanitizeHTML(transformed);
      cleanupChoices(typedBox);
      bindChoiceHandlers();
      revealChoicesStagger(typedBox);
      restoreChoiceVisuals(typedBox);
      setChoicesShown(true);
      setIsTyping(false);
      if (initialRemainderHtml && initialRemainderHtml.trim()) {
        setContinuationFromRemainder(initialRemainderHtml);
      }
      tryRestoreResume();
      setFlowState(typedBox.querySelector('.choice-link') ? 'WAITING_FOR_CHOICE' : 'CHAPTER_COMPLETE');
    } else {
      // Pass the full content so renderSegment's onDone receives the real remainder
      // and sets up continuation for the next choice group. Passing only segHtml
      // makes the remainder empty and wipes the continuation we set above.
      renderSegmentRef.current(segHtml + initialRemainderHtml, 'typed');
      restoreChoiceVisuals(typedBox);
      tryRestoreResume();
    }

    const currentCancel = cancelRef.current;
    return () => {
      currentCancel?.();
      glitchCleanupRef.current.forEach(fn => { try { fn(); } catch {} });
      glitchCleanupRef.current = [];
    };
  }, [doc, srcUrl, autoStart, instantMode, pendingResume, clearResume, announce, restoreChoiceVisuals, cleanupChoices, bindChoiceHandlers, revealChoicesStagger, cancelRef, glitchCleanupRef, renderSegmentRef, setContinuationRef, setIsTyping, typedBoxRef, resetPlaybackFlow, setFlowState]);

  return (
    <div
      ref={readerRootRef}
      id={id}
      className={`SYNTHOMAREADER ${isTyping ? 'typing' : ''} ${choicesShown ? 'choices-shown' : ''} ${className || ''}`.trim()}
      aria-label={ariaLabel}
      data-chapter-id={chapterIdProp ?? ''}
      data-collection={collectionProp ?? 'SYNTHOMA-NULL'}
      data-reader-flow-state={flowState}
    >
      <div className={"chapter-content not-prose"}>
        <div ref={hostRef} className="reader-host not-prose" />
        {/* ARIA live region for screen reader announcements */}
        <div
          ref={liveRef}
          aria-live="polite"
          aria-atomic="true"
          role="status"
          className="sr-only"
        />
        {fetchLoading && (
          <div className="chapter-overlay loading">Načítám…</div>
        )}
        {!!fetchError && (
          <div className="chapter-overlay warning">{fetchError}</div>
        )}
      </div>
    </div>
  );
}
