"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { readStorageJSON, writeStorageJSON } from "../lib/browser";
import { clearReaderResume, readReaderResume, readChoicesState, saveChoicesState, saveLastChapterPath, saveReaderResume } from "../lib/readerState";
import {
  extractVisibleTextLength,
  getTypewriterDurationMs,
  normalizeChoicesToPlainText,
  renderTypingHtml,
  revealHtmlPreserve,
  sanitizeHTML,
  splitContentAtChoices,
  transformChoicesToButtons,
} from "../lib/typewriterContent";

// Safely encode a potentially unsafe relative URL path while preserving slashes and query/hash
function encodePathPreserve(url: string): string {
  try {
    // Absolute or protocol URLs leave as-is
    if (/^https?:\/\//i.test(url)) return url;
    const split = url.split(/([?#].*$)/, 2);
    const pathWithHost = split[0] ?? url;
    const rest = split[1] ?? '';
    const parts = pathWithHost.split('/').map((seg, i) => {
      if (i === 0 && seg === '') return '';
      // Normalize before re-encoding to prevent double-encoding of already-encoded segments
      try { return encodeURIComponent(decodeURIComponent(seg)); } catch { return encodeURIComponent(seg); }
    });
    return parts.join('/') + rest;
  } catch {
    return url;
  }
}

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
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cancelRef = useRef<(() => void) | null>(null);
  const [choicesShown, setChoicesShown] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const isTypingRef = useRef<boolean>(false);
  const continueRef = useRef<null | (() => void)>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const storyCacheRef = useRef<string>('');
  const lastUserScrollRef = useRef<number>(Date.now());
  const glitchCleanupRef = useRef<Array<() => void>>([]);

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
        btn.classList.remove('visible');
      });
      const baseDelay = 90; // ms between buttons
      links.forEach((btn, i) => {
        setTimeout(() => { btn.classList.add('visible'); }, Math.min(1200, i * baseDelay));
      });
    } catch {}
  }, []);

  const announce = useCallback((msg: string) => {
    try {
      if (!liveRef.current) return;
      liveRef.current.textContent = msg;
    } catch {}
  }, []);

  // Apply MBTI scores from data-tags — only when data-tags present
  const applyMbtiScore = useCallback((node: Element | null): string => {
    const tagsAttr = (node?.getAttribute('data-tags') || '').trim();
    if (!node || !tagsAttr) return '';
    try {
      const parts = tagsAttr.split(',').map(s => s.trim()).filter(Boolean);
      if (!parts.length) return tagsAttr;
      const valid = new Set(['I','E','N','S','F','T','J','P']);
      const hasWeights = parts.some(p => /[+-]\d+$/i.test(p));
      const key = 'mbtiScores';
      let data = readStorageJSON<Record<string, number>>(key, {});
      if (hasWeights) {
        for (const p of parts) {
          const up = (p || '').toUpperCase();
          const m = up.match(/^([IENSFTJP])([+-]\d+)$/);
          if (!m || !m[1] || !m[2]) continue;
          const letter = m[1] as string;
          const delta = parseInt(m[2] as string, 10);
          if (!valid.has(letter)) continue;
          const cur = typeof data[letter] === 'number' ? (data[letter] as number) : 0;
          data[letter] = cur + (isFinite(delta) ? delta : 0);
        }
      } else {
        const first = (parts[0] || '').toUpperCase();
        if (valid.has(first)) {
          const cur = typeof data[first] === 'number' ? (data[first] as number) : 0;
          data[first] = cur + 1;
        }
      }
      writeStorageJSON(key, data);
      writeStorageJSON(key, data, 'session');
    } catch (err) { softFail('applyMbtiScore', err); }
    return tagsAttr;
  }, []);

  // Fire-and-forget server tracking — always called on every choice, regardless of data-tags
  const trackChoiceEvent = useCallback((node: Element | null, tagsAttr: string) => {
    if (!node) return;
    try {
      const choiceText = ((node as HTMLElement).textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200);
      // Prefer props over DOM dataset (avoids document.querySelector issues with multiple readers)
      const chapterId = chapterIdProp || (hostRef.current?.dataset.chapterId) || '';
      const collection = collectionProp || (hostRef.current?.dataset.collection) || 'SYNTHOMA-NULL';
      const blockId = (node as HTMLElement).dataset.blockId || (node as HTMLElement).closest('[id]')?.id || undefined;
      const choiceId = (node as HTMLElement).dataset.choiceId || undefined;
      const nextBlockId = (node as HTMLElement).dataset.next || (node as HTMLElement).dataset.nextBlockId || undefined;
      const tone = (node as HTMLElement).dataset.tone || undefined;

      const functionsRaw = (node as HTMLElement).dataset.functions || '';
      const functionDelta: Record<string, number> = {};
      if (functionsRaw) {
        for (const part of functionsRaw.split(',')) {
          const [k, v] = part.split(':');
          if (k && v) functionDelta[k.trim()] = parseInt(v.trim(), 10) || 0;
        }
      }

      const emotionsRaw = (node as HTMLElement).dataset.emotions || '';
      const emotionDelta: Record<string, number> = {};
      if (emotionsRaw) {
        for (const part of emotionsRaw.split(',')) {
          const [k, v] = part.split(':');
          if (k && v) emotionDelta[k.trim()] = parseInt(v.trim(), 10) || 0;
        }
      }

      const stabilityRaw = (node as HTMLElement).dataset.stability;
      const pressureRaw = (node as HTMLElement).dataset.pressure;
      const shadowRaw = (node as HTMLElement).dataset.shadow;
      const stabilityDelta = stabilityRaw !== undefined ? (parseInt(stabilityRaw, 10) || 0) : undefined;
      const pressureDelta = pressureRaw !== undefined ? (parseInt(pressureRaw, 10) || 0) : undefined;
      const shadowDelta = shadowRaw !== undefined ? (parseInt(shadowRaw, 10) || 0) : undefined;

      const entityDelta: Record<string, Record<string, number>> = {};
      for (const attr of (node as HTMLElement).getAttributeNames()) {
        if (!attr.startsWith('data-entity-')) continue;
        const entity = attr.replace('data-entity-', '');
        const raw = (node as HTMLElement).getAttribute(attr) || '';
        const metrics: Record<string, number> = {};
        for (const part of raw.split(',')) {
          const [k, v] = part.split(':');
          if (k && v) metrics[k.trim()] = parseInt(v.trim(), 10) || 0;
        }
        if (Object.keys(metrics).length) entityDelta[entity] = metrics;
      }

      const payload = {
        collection,
        chapterId,
        blockId,
        choiceId,
        choiceText,
        nextBlockId,
        tags: tagsAttr ? tagsAttr.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        functionDelta: Object.keys(functionDelta).length ? functionDelta : undefined,
        emotionDelta: Object.keys(emotionDelta).length ? emotionDelta : undefined,
        tone,
        stabilityDelta,
        pressureDelta,
        shadowDelta,
        entityDelta: Object.keys(entityDelta).length ? entityDelta : undefined,
      };

      if (chapterId) {
        fetch('/api/me/choices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).catch(() => {
          try {
            const stored = JSON.parse(localStorage.getItem('synthoma_local_trace') || '[]') as unknown[];
            stored.push({ ...payload, createdAt: new Date().toISOString() });
            localStorage.setItem('synthoma_local_trace', JSON.stringify(stored.slice(-200)));
          } catch {}
        });
      } else {
        // No chapterId: always store locally so nothing is silently lost
        try {
          const stored = JSON.parse(localStorage.getItem('synthoma_local_trace') || '[]') as unknown[];
          stored.push({ ...payload, createdAt: new Date().toISOString() });
          localStorage.setItem('synthoma_local_trace', JSON.stringify(stored.slice(-200)));
        } catch {}
      }
    } catch (err) { softFail('trackChoiceEvent', err); }
  }, [chapterIdProp, collectionProp]);

  // Single entry point for scoring + tracking — call this instead of scoreFromNode everywhere
  // Dispatches synthoma:choice-made exactly once per choice (single source of truth)
  const scoreFromNode = useCallback((node: Element | null) => {
    const tagsAttr = applyMbtiScore(node);
    trackChoiceEvent(node, tagsAttr);
    try { document.dispatchEvent(new CustomEvent('synthoma:choice-made')); } catch {}
  }, [applyMbtiScore, trackChoiceEvent]);

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
      const existing = saved.findIndex(s => s.groupKey === groupKey);
      const entry: import('../lib/readerState').ChoiceGroupState = dataNextRaw
        ? { groupKey, chosenIdx, chosenText, dataNext: dataNextRaw }
        : { groupKey, chosenIdx, chosenText };
      if (existing >= 0) { saved[existing] = entry; } else { saved.push(entry); }
      saveChoicesState(srcUrl, saved);
    } catch {}
  }, [srcUrl]);

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
        if (node instanceof HTMLButtonElement) { node.disabled = false; }
        node.removeAttribute('aria-disabled');
        // restore href on anchors if it was parked in data-href during typing
        if (node.tagName.toLowerCase() === 'a') {
          const a = node as HTMLAnchorElement;
          const parked = a.getAttribute('data-href');
          if (parked && !a.getAttribute('href')) { a.setAttribute('href', parked); }
          a.removeAttribute('data-href');
        }
      });
      // Mark visible state on the closest SYNTHOMAREADER host for CSS to show choices
      const host = container.closest('.SYNTHOMAREADER');
      if (host) { (host as HTMLElement).classList.add('choices-shown'); }
    } catch {}
  }, []);

  // Single helper: lock a choice group visually after a selection
  // Eliminates the 4× duplicated sibling-walk logic across click branches
  const lockChoiceGroup = useCallback((chosen: HTMLElement, root: HTMLElement) => {
    try {
      const hostEl = root;
      // Find the nearest explicit group container, or walk up to find implicit group by p.choice count
      let group: HTMLElement | null = (chosen.closest('[data-choice-group], .choices, .choice-group') as HTMLElement | null);
      if (!group) {
        let cur: HTMLElement | null = chosen.parentElement as HTMLElement | null;
        while (cur && cur !== hostEl && cur.querySelectorAll('p.choice').length < 2) { cur = cur.parentElement as HTMLElement | null; }
        if (cur && cur !== hostEl && cur.querySelectorAll('p.choice').length >= 2) group = cur;
      }
      if (!group) group = (chosen.closest('p.choice') as HTMLElement | null) || chosen.parentElement;
      const scope = group || chosen.parentElement || chosen;
      const siblings = Array.from(scope.querySelectorAll<HTMLElement>('button.choice-link, a.choice-link')) as HTMLElement[];
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
      try { scope.classList.add('choices-locked'); } catch {}
    } catch (err) { softFail('lockChoiceGroup', err); }
  }, []);

  const bindChoiceHandlers = useCallback(() => {
    const root = hostRef.current;
    if (!root) return;
    // Obnov echo-ghost volby po každém render segmentu (jediný source of truth = echo-ghost.js)
    try { (window as any).EchoGhost?.refresh(root); } catch {}
    // navigační
    root.querySelectorAll<HTMLElement>('[data-action]').forEach((el: HTMLElement) => {
      if (el.dataset.boundAction === '1') return;
      el.dataset.boundAction = '1';
      el.addEventListener('click', (e: Event) => {
        const action = el.dataset.action;
        if (action === 'open-profile') {
          e.preventDefault();
          try { document.dispatchEvent(new CustomEvent('synthoma:open-profile')); } catch {}
        }
      });
    });
    root.querySelectorAll<HTMLElement>('.choice-link').forEach((el: HTMLElement) => {
      const node = el as HTMLElement;
      if (node.dataset.boundGeneral === '1') return;
      // announce on focus for screen reader users
      node.addEventListener('focus', () => {
        const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (label) announce(`Fokus na volbu: ${label}`);
      });
      // Lock visuals on click only — pointerdown was causing mobile issues where
      // locking siblings before click fired made the tap unresponsive.
      // touchend handles fast taps that may not reliably fire click on some mobile browsers.
      node.addEventListener('touchend', (e: Event) => {
        const h = hostRef.current; if (h) lockChoiceGroup(node, h);
        // Do NOT preventDefault here — let click fire naturally
      }, { passive: true });

      node.addEventListener('click', (e: Event) => {
        // Lock the group at click-time (not pointerdown) to ensure the tap registered
        const h = hostRef.current; if (h) lockChoiceGroup(node, h);
        const href = node.getAttribute('href') || node.getAttribute('data-href') || node.getAttribute('data-next') || '';
        // PRIORITY: If this choice points to an in-cache section via data-next, do that first
        try {
          const dataNext = node.getAttribute('data-next') || '';
          if (dataNext && storyCacheRef.current) {
            const parserP = new DOMParser();
            const docP = parserP.parseFromString(`<div id="_cache">${storyCacheRef.current}</div>`, 'text/html');
            const holderP = docP.getElementById('_cache') as HTMLElement | null;
            const targetP = holderP ? holderP.querySelector(`#${CSS.escape(dataNext)}`) as HTMLElement | null : null;
            if (targetP) {
              e.preventDefault();
              // Score immediately on selection
              scoreFromNode(node);
              try { const host2 = hostRef.current; if (host2) persistChoiceState(node, host2); } catch {}
              // Persist resume point for this chapter (data-next)
              try {
                const chapter = (document.querySelector('.SYNTHOMAREADER')?.getAttribute('data-chapter') || '') || '';
              } catch {}
              try {
                const dataNext = node.getAttribute('data-next') || '';
                if (dataNext) {
                  saveReaderResume({ chapterPath: srcUrl, dataNext });
                }
              } catch {}
              // Run the same follow-up typing flow as below, but with the preferred target
              const host = hostRef.current!;
              let box = host.querySelector('.typed-box') as HTMLElement | null;
              if (!box) { box = document.createElement('div'); box.className = 'typed-box'; host.innerHTML = ''; host.appendChild(box); }
              // Create a fresh segment to append below previous content
              const seg = document.createElement('div');
              seg.className = 'tw-segment';
              box.appendChild(seg);
              const parser2 = new DOMParser();
              const doc2 = parser2.parseFromString(`<div class="content">${targetP.innerHTML}</div>`, 'text/html');
              const root2 = (doc2.querySelector('.content') as HTMLElement) || (doc2.body as HTMLElement);
              const firstCh2 = root2.querySelector('p.choice, .choice-link');
              let pre2 = ''; let block2 = ''; let rem2 = '';
              if (firstCh2) {
                const rPre2 = doc2.createRange(); rPre2.setStart(root2, 0); rPre2.setEndBefore(firstCh2);
                const wrap1 = doc2.createElement('div'); wrap1.appendChild(rPre2.cloneContents()); pre2 = wrap1.innerHTML;
                let last2: Element = firstCh2 as Element; let cur2 = firstCh2.nextElementSibling;
                while (cur2 && cur2.tagName.toLowerCase() === 'p' && (cur2 as HTMLElement).classList.contains('choice')) { last2 = cur2; cur2 = cur2.nextElementSibling; }
                const rBlk2 = doc2.createRange(); rBlk2.setStartBefore(firstCh2); rBlk2.setEndAfter(last2);
                const wrap2 = doc2.createElement('div'); wrap2.appendChild(rBlk2.cloneContents()); block2 = wrap2.innerHTML;
                const rRem2 = doc2.createRange(); rRem2.setStartAfter(last2);
                const end2: Node = (root2.lastChild ?? root2) as Node; rRem2.setEndAfter(end2);
                const wrap3 = doc2.createElement('div'); wrap3.appendChild(rRem2.cloneContents()); rem2 = wrap3.innerHTML;
              } else { pre2 = root2.innerHTML; }
              const typingHtml = normalizeChoicesToPlainText(pre2 + block2);
              const transformed = transformChoicesToButtons(pre2 + block2);
              const text2Length = extractVisibleTextLength(typingHtml);
              if (!text2Length) {
                seg.innerHTML = sanitizeHTML(transformed);
                restoreScrollSoon();
                cleanupChoices(seg); bindChoiceHandlers(); revealChoicesStagger(seg);
                continueRef.current = (rem2 && rem2.trim()) ? () => { /* will be handled by existing continue flow on next click */ } : null;
                return;
              }
              let start: number | null = null; const len = Math.max(1, text2Length); const dur = getTypewriterDurationMs(host, len);
              const raf = (t:number) => {
                if (start == null) start = t; const el = Math.max(0, t - start); const pr = Math.min(1, el / Math.max(1, dur));
                const cnt = Math.max(0, Math.floor(pr * len));
                try { seg!.innerHTML = sanitizeHTML(revealHtmlPreserve(typingHtml, cnt)); } catch {}
                if (pr >= 1) {
                  try { seg!.innerHTML = sanitizeHTML(transformed); } catch {}
                  restoreScrollSoon();
                  cleanupChoices(seg!); bindChoiceHandlers(); revealChoicesStagger(seg!);
                  // set continuation to render the remainder (will trigger on next click)
                  if (rem2 && rem2.trim()) {
                    continueRef.current = () => {
                      const seg2 = document.createElement('div'); seg2.className = 'tw-segment'; box!.appendChild(seg2);
                      const typing3 = normalizeChoicesToPlainText(rem2);
                      const transformed3 = transformChoicesToButtons(rem2);
                      const text3Length = extractVisibleTextLength(typing3);
                      if (!text3Length) { seg2!.innerHTML = sanitizeHTML(transformed3); restoreScrollSoon(); cleanupChoices(seg2!); bindChoiceHandlers(); revealChoicesStagger(seg2!); continueRef.current = null; return; }
                      const len3 = Math.max(1, text3Length); const dur3 = getTypewriterDurationMs(host, len3); let s3: number | null = null;
                      const raf3 = (ts:number) => {
                        if (s3 == null) s3 = ts; const el3 = Math.max(0, ts - s3); const pr3 = Math.min(1, el3 / Math.max(1, dur3));
                        const cnt3 = Math.max(0, Math.floor(pr3 * len3));
                        try { seg2!.innerHTML = sanitizeHTML(revealHtmlPreserve(typing3, cnt3)); } catch {}
                        if (pr3 >= 1) { try { seg2!.innerHTML = sanitizeHTML(transformed3); } catch {}; restoreScrollSoon(); cleanupChoices(seg2!); bindChoiceHandlers(); revealChoicesStagger(seg2!); continueRef.current = null; return; }
                        requestAnimationFrame(raf3);
                      };
                      requestAnimationFrame(raf3);
                    };
                  } else { continueRef.current = null; }
                  return;
                }
                requestAnimationFrame(raf);
              };
              try { seg!.innerHTML = sanitizeHTML(revealHtmlPreserve(typingHtml, 0)); } catch { seg!.innerHTML = ''; }
              requestAnimationFrame(raf);
              return;
            }
          }
        } catch {}
        // If we still have a pending continuation segment, use it
        if (continueRef.current) {
          e.preventDefault();
          const h = hostRef.current; if (h) lockChoiceGroup(node, h);
          scoreFromNode(node);
          try { const host2 = hostRef.current; if (host2) persistChoiceState(node, host2); } catch {}
          // Persist resume point for continuation flow (no href, no data-next)
          try {
            const dataNext = node.getAttribute('data-next') || '';
            if (dataNext) {
              saveReaderResume({ chapterPath: srcUrl, dataNext });
            }
          } catch {}
          // Announce selection and continuation
          const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
          if (label) announce(`Zvoleno: ${label}. Pokračuji…`);
          const fn = continueRef.current; continueRef.current = null; fn && fn();
          return;
        }
        e.preventDefault();
        if (!href) {
          const h = hostRef.current; if (h) lockChoiceGroup(node, h);
          scoreFromNode(node);
          try { const host2 = hostRef.current; if (host2) persistChoiceState(node, host2); } catch {}
          try {
            const dn = node.getAttribute('data-next') || '';
            if (dn) {
              saveReaderResume({ chapterPath: srcUrl, dataNext: dn });
            } else {
              const par = node.closest('p.choice') as HTMLElement | null;
              const pid = par?.id || '';
              if (pid) saveReaderResume({ chapterPath: srcUrl, hash: `#${pid}` });
            }
          } catch {}
          const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
          if (label) announce(`Zvoleno: ${label}.`);
          return;
        }
        if (href.startsWith('http')) {
          window.open(href, '_blank');
        } else if (href.startsWith('#')) {
          const section = document.querySelector(href);
          section?.scrollIntoView({ behavior: 'smooth' });
          const h = hostRef.current; if (h) lockChoiceGroup(node, h);
          scoreFromNode(node);
          try { const host2 = hostRef.current; if (host2) persistChoiceState(node, host2); } catch {}
          try { saveReaderResume({ chapterPath: srcUrl, hash: href }); } catch {}
          const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
          if (label) announce(`Zvoleno: ${label}.`);
        } else {
          // Site route: navigate directly
          if (href.startsWith('/')) {
            // If the link points to a static book HTML file, open it inside the reader instead of full navigation
            if (/^\/books\/.+\.html(\?.*)?(#.*)?$/i.test(href)) {
              try { saveLastChapterPath(href); } catch {}
              router.push(`/reader?u=${encodeURIComponent(href)}`);
            } else {
              router.push(href);
            }
            return;
          }
          // Attempt in-document section jump using #story-cache
          try {
            const cacheHtml = storyCacheRef.current || '';
            if (cacheHtml && href) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(`<div id="_cache">${cacheHtml}</div>`, 'text/html');
              const holder = doc.getElementById('_cache') as HTMLElement | null;
              const target = holder ? holder.querySelector(`#${CSS.escape(href)}`) as HTMLElement | null : null;
              if (target) {
                e.preventDefault();
                const host = hostRef.current!;
                let box = host.querySelector('.typed-box') as HTMLElement | null;
                if (!box) { box = document.createElement('div'); box.className = 'typed-box'; host.innerHTML = ''; host.appendChild(box); }
                // fresh segment per target
                const seg = document.createElement('div');
                seg.className = 'tw-segment';
                box.appendChild(seg);
                // Split and type
                const parser2 = new DOMParser();
                const doc2 = parser2.parseFromString(`<div class="content">${target.innerHTML}</div>`, 'text/html');
                const root2 = (doc2.querySelector('.content') as HTMLElement) || (doc2.body as HTMLElement);
                const firstCh2 = root2.querySelector('p.choice, .choice-link');
                let pre2 = '', block2 = '', rem2 = '';
                if (firstCh2) {
                  const rPre2 = doc2.createRange(); rPre2.setStart(root2, 0); rPre2.setEndBefore(firstCh2);
                  const wrap1 = doc2.createElement('div'); wrap1.appendChild(rPre2.cloneContents()); pre2 = wrap1.innerHTML;
                  let last2: Element = firstCh2 as Element; let cur2 = firstCh2.nextElementSibling;
                  while (cur2 && cur2.tagName.toLowerCase() === 'p' && (cur2 as HTMLElement).classList.contains('choice')) { last2 = cur2; cur2 = cur2.nextElementSibling; }
                  const rBlk2 = doc2.createRange(); rBlk2.setStartBefore(firstCh2); rBlk2.setEndAfter(last2);
                  const wrap2 = doc2.createElement('div'); wrap2.appendChild(rBlk2.cloneContents()); block2 = wrap2.innerHTML;
                  const rRem2 = doc2.createRange(); rRem2.setStartAfter(last2);
                  const end2: Node = (root2.lastChild ?? root2) as Node; rRem2.setEndAfter(end2);
                  const wrap3 = doc2.createElement('div'); wrap3.appendChild(rRem2.cloneContents()); rem2 = wrap3.innerHTML;
                } else { pre2 = root2.innerHTML; }
                const typingHtml = normalizeChoicesToPlainText(pre2 + block2);
                const transformed = transformChoicesToButtons(pre2 + block2);
                const text2Length = extractVisibleTextLength(typingHtml);
                if (!text2Length) {
                  seg.innerHTML = sanitizeHTML(transformed);
                  cleanupChoices(seg); bindChoiceHandlers();
                } else {
                  let start: number | null = null; const len = Math.max(1, text2Length); const dur = getTypewriterDurationMs(host, len);
                  const raf = (t: number) => {
                    if (start == null) start = t;
                    const el = Math.max(0, t - start); const pr = Math.min(1, el / Math.max(1, dur));
                    const cnt = Math.max(0, Math.floor(pr * len));
                    try { seg.innerHTML = sanitizeHTML(revealHtmlPreserve(typingHtml, cnt)); } catch {}
                    if (pr >= 1) {
                      try { seg.innerHTML = sanitizeHTML(transformed); } catch {}
                      cleanupChoices(seg); bindChoiceHandlers();
                      if (rem2 && rem2.trim()) {
                        continueRef.current = () => {
                          const seg2 = document.createElement('div'); seg2.className = 'tw-segment'; box!.appendChild(seg2);
                          const typing3 = normalizeChoicesToPlainText(rem2);
                          const transformed3 = transformChoicesToButtons(rem2);
                          const text3Length = extractVisibleTextLength(typing3);
                          if (!text3Length) { seg2.innerHTML = sanitizeHTML(transformed3); cleanupChoices(seg2); bindChoiceHandlers(); continueRef.current = null; return; }
                          let s3: number | null = null; const len3 = Math.max(1, text3Length); const dur3 = getTypewriterDurationMs(host, len3);
                          const raf3 = (ts: number) => {
                            if (s3 == null) s3 = ts; const el3 = Math.max(0, ts - s3); const pr3 = Math.min(1, el3 / Math.max(1, dur3));
                            const cnt3 = Math.max(0, Math.floor(pr3 * len3));
                            try { seg2.innerHTML = sanitizeHTML(revealHtmlPreserve(typing3, cnt3)); } catch {}
                            if (pr3 >= 1) { try { seg2.innerHTML = sanitizeHTML(transformed3); } catch {}; cleanupChoices(seg2); bindChoiceHandlers(); continueRef.current = null; return; }
                            requestAnimationFrame(raf3);
                          };
                          requestAnimationFrame(raf3);
                        };
                      } else { continueRef.current = null; }
                      return;
                    }
                    requestAnimationFrame(raf);
                  };
                  try { seg.innerHTML = sanitizeHTML(revealHtmlPreserve(typingHtml, 0)); } catch { seg.innerHTML = ''; }
                  requestAnimationFrame(raf);
                }
                return;
              }
            }
          } catch (e) {}
          // Fallback: treat as external chapter path and open in main reader (no try/catch to keep SWC happy)
          let path = href;
          if (!(path.startsWith('/') || path.startsWith('http') || path.startsWith('#'))) {
            path = '/' + path;
          }
          router.push(`/reader?u=${encodeURIComponent(path)}`);
        }
      });
      node.dataset.boundGeneral = '1';
    });

  }, [router, announce, cleanupChoices, lockChoiceGroup, restoreScrollSoon, revealChoicesStagger, scoreFromNode, srcUrl]);

  // Enhance inline glitching tokens: split into per-char spans and jitter occasionally
  const enhanceGlitching = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    try {
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
      const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const pick = () => GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)) || '#';
      const targets = Array.from(container.querySelectorAll<HTMLElement>('.glitching'));
      targets.forEach((el) => {
        if (prefersReduced) return;
        // Collapse any previous per-char wrappers back to plain text (to fix spacing)
        try {
          const label = el.getAttribute('aria-label');
          if (label && el.querySelector('.glitching-char')) {
            el.textContent = label;
          }
        } catch {}
        const origText = (el.textContent || '').toString();
        if (!(el as any).__glitchOrig) { (el as any).__glitchOrig = origText; }
        const source = () => String((el as any).__glitchOrig || origText);
        if ((el as any).__glitchTimer) return;
        // Per-element measurer to keep character width stable
        let measurer = (el as any).__glitchMeasure as HTMLElement | undefined;
        if (!measurer) {
          measurer = document.createElement('span');
          measurer.style.visibility = 'hidden';
          measurer.style.position = 'absolute';
          measurer.style.left = '-99999px';
          measurer.style.top = '0';
          measurer.style.whiteSpace = 'pre';
          // Copy font properties from element to get accurate widths
          try {
            const cs = getComputedStyle(el);
            measurer.style.font = cs.font;
            measurer.style.letterSpacing = cs.letterSpacing;
            measurer.style.fontKerning = 'none'; // match temporary kerning-off state during frames
            measurer.style.fontVariantLigatures = cs.fontVariantLigatures as any;
          } catch {}
          document.body.appendChild(measurer);
          (el as any).__glitchMeasure = measurer;
        }
        const totalWidth = (text: string) => {
          try { measurer!.textContent = text; return measurer!.getBoundingClientRect().width; } catch { return 0; }
        };

        const runJitter = () => {
          try {
            if ((el as any).__glitchBusy) return; // avoid overlapping bursts
            const text = source();
            const indices = Array.from(text).map((c, i) => ({ c, i })).filter(x => /[A-Za-z0-9Á-Žá-ž]/u.test(x.c));
            if (!indices.length) return;
            (el as any).__glitchBusy = 1;
            // Watchdog – never let busy latch forever
            const busyGuard = window.setTimeout(() => {
              try {
                (el as any).__glitchBusy = 0;
                const overlay = (el as any).__glitchOverlay as HTMLElement | undefined;
                if (overlay) { overlay.remove(); (el as any).__glitchOverlay = undefined; }
              } catch {}
            }, 2500);
            const pickIdx = indices[Math.floor(Math.random() * indices.length)]?.i ?? 0;
            const frames = 5 + Math.floor(Math.random() * 4); // 5-8 frames
            const frameDelay = 80 + Math.floor(Math.random() * 30); // 80-110ms per frame
            const keepCase = (ch: string, repl: string) => {
              if (ch.toUpperCase() === ch && ch.toLowerCase() !== ch) return repl.toUpperCase();
              if (ch.toLowerCase() === ch && ch.toUpperCase() !== ch) return repl.toLowerCase();
              return repl;
            };
            let k = 0;
            let kerningPatched = false;
            // Helper: find text node and local offset for a given char index within element's textContent
            const findTextNodeForIndex = (host: HTMLElement, globalIndex: number): { node: Text | null, localOffset: number } => {
              try {
                let acc = 0;
                const tw = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
                  acceptNode: (n: Node) => (n.nodeValue && n.nodeValue.length) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
                } as any);
                let cur: Text | null = tw.nextNode() as Text | null;
                while (cur) {
                  const len = cur.data.length;
                  if (acc + len > globalIndex) {
                    return { node: cur, localOffset: globalIndex - acc };
                  }
                  acc += len;
                  cur = tw.nextNode() as Text | null;
                }
              } catch {}
              return { node: null, localOffset: 0 };
            };

            const step = () => {
              try {
                // Ensure kerning is off for the entire burst to match measurer
                if (!kerningPatched) { try { (el as HTMLElement).style.fontKerning = 'none'; kerningPatched = true; } catch {} }
                const base = source();
                const arr = Array.from(base);
                const origChar: string = arr[pickIdx] ?? '';
                // Find a replacement that keeps total line width identical (kerning-off in measurer)
                const baseWidth = totalWidth(base);
                let replacement: string | undefined;
                // Try a handful of candidates to find exact-width match
                for (let tries = 0; tries < 30; tries++) {
                  const cand = pick();
                  const testArr = arr.slice();
                  testArr[pickIdx] = keepCase(origChar, cand);
                  const w2 = totalWidth(testArr.join(''));
                  if (Math.abs(w2 - baseWidth) < 0.02) { replacement = cand; break; }
                }
                if (typeof replacement === 'undefined') {
                  // No safe replacement; skip this frame to avoid layout twitch
                  k++;
                  window.setTimeout(step, frameDelay);
                  return;
                }
                if (k < frames) {
                  // Draw replacement as an overlay at the exact glyph position without changing text
                  let overlay = (el as any).__glitchOverlay as HTMLElement | undefined;
                  if (!overlay) {
                    overlay = document.createElement('span');
                    overlay.style.position = 'absolute';
                    overlay.style.pointerEvents = 'none';
                    overlay.style.willChange = 'transform, contents';
                    overlay.style.whiteSpace = 'pre';
                    try { (el as HTMLElement).style.position = (getComputedStyle(el).position === 'static') ? 'relative' : getComputedStyle(el).position; } catch {}
                    el.appendChild(overlay);
                    (el as any).__glitchOverlay = overlay;
                  }
                  // Locate character rect using Range across nested text nodes
                  const loc = findTextNodeForIndex(el as HTMLElement, pickIdx);
                  if (loc.node) {
                    const r = document.createRange();
                    r.setStart(loc.node, loc.localOffset);
                    r.setEnd(loc.node, loc.localOffset + 1);
                    const rect = r.getBoundingClientRect();
                    const hostRect = (el as HTMLElement).getBoundingClientRect();
                    overlay.textContent = keepCase(origChar, replacement);
                    // inherit font
                    try { const cs = getComputedStyle(el as HTMLElement); (overlay.style as any).font = cs.font; overlay.style.letterSpacing = cs.letterSpacing; } catch {}
                    overlay.style.left = `${rect.left - hostRect.left}px`;
                    overlay.style.top = `${rect.top - hostRect.top}px`;
                  }
                  k++;
                  window.setTimeout(step, frameDelay);
                } else {
                  // remove overlay and settle back
                  const overlay = (el as any).__glitchOverlay as HTMLElement | undefined;
                  if (overlay) { try { overlay.remove(); } catch {} (el as any).__glitchOverlay = undefined; }
                  if (kerningPatched) { try { (el as HTMLElement).style.fontKerning = ''; } catch {} }
                  (el as any).__glitchBusy = 0;
                  try { window.clearTimeout(busyGuard); } catch {}
                }
              } catch {
                (el as any).__glitchBusy = 0;
                try { const overlay = (el as any).__glitchOverlay as HTMLElement | undefined; if (overlay) { overlay.remove(); (el as any).__glitchOverlay = undefined; } } catch {}
              }
            };
            step();
          } catch {}
        };
        const tid = window.setInterval(runJitter, 700 + Math.floor(Math.random() * 500));
        (el as any).__glitchTimer = tid;
        // Register cleanup so interval is cleared on content reload / unmount
        glitchCleanupRef.current.push(() => {
          window.clearInterval(tid);
          const ov = (el as any).__glitchOverlay as HTMLElement | undefined;
          if (ov) { try { ov.remove(); } catch {} (el as any).__glitchOverlay = undefined; }
          const ms = (el as any).__glitchMeasure as HTMLElement | undefined;
          if (ms) { try { ms.remove(); } catch {} (el as any).__glitchMeasure = undefined; }
          (el as any).__glitchTimer = undefined;
          (el as any).__glitchBusy = 0;
        });
      });
    } catch {}
  }, []);

  // Observe DOM changes to auto-apply glitching to any new '.glitching' tokens
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const tick = () => enhanceGlitching(host);
    // Initial pass
    try { tick(); } catch {}
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const obs = new MutationObserver(() => {
      // Skip observer firing during active typewriter animation (prevents mobile thrashing)
      if (isTypingRef.current) return;
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => { try { requestAnimationFrame(tick); } catch {} }, 300);
    });
    // Watch only childList (not characterData) — avoids firing on every typed character
    obs.observe(host, { childList: true, subtree: true });

    // Resume glitching when tab becomes visible again
    const onVis = () => { try { if (document.visibilityState === 'visible') tick(); } catch {} };
    document.addEventListener('visibilitychange', onVis);

    return () => { try { obs.disconnect(); document.removeEventListener('visibilitychange', onVis); } catch {} };
  }, [enhanceGlitching]);

  // Echo-ghost: jediný source of truth je /books/echo-ghost.js
  // TypewriterReader pouze zajistí načtení scriptu a po render zavolá EchoGhost.refresh(host)
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const ensureScript = () => {
      if ((window as any).EchoGhost) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const scriptId = 'echo-ghost-script';
        const existing = document.getElementById(scriptId);
        if (existing) {
          // Script tag existuje ale EchoGhost ještě není — čekej na load
          existing.addEventListener('load', () => resolve(), { once: true });
          return;
        }
        const s = document.createElement('script');
        s.id = scriptId;
        s.src = '/books/echo-ghost.js';
        s.addEventListener('load', () => resolve(), { once: true });
        s.addEventListener('error', () => resolve(), { once: true }); // tichý fail
        document.head.appendChild(s);
      });
    };

    ensureScript().then(() => {
      try { (window as any).EchoGhost?.refresh(host); } catch {}
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Clean up any leftover glitch intervals from previous content before loading new
        glitchCleanupRef.current.forEach(fn => { try { fn(); } catch {} });
        glitchCleanupRef.current = [];
        const pendingResume = readReaderResume();
        const finalUrl = encodePathPreserve(srcUrl);
        const res = await fetch(finalUrl, { cache: 'no-store' });
        if (!res.ok) {
          onFetchError?.(res.status);
          throw new Error(`HTTP ${res.status}`);
        }
        const raw = await res.text();

        // Parse, normalize and convert choices
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, 'text/html');
        // Auto-attach external CSS if referenced in the HTML (e.g., /styles.css)
        try {
          const STYLESHEET_WHITELIST = ['/styles.css', '/synth-gate.css'];
          const styleLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"][href]')) as HTMLLinkElement[];
          styleLinks.forEach((lnk) => {
            const href = (lnk.getAttribute('href') || '').trim();
            if (!href) return;
            // Whitelist-only: must be a known root-relative path
            if (!STYLESHEET_WHITELIST.includes(href)) return;
            // only attach once per href
            if (!document.head.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
              const tag = document.createElement('link');
              tag.rel = 'stylesheet';
              tag.href = href;
              document.head.appendChild(tag);
            }
          });
        } catch {}

        const contentEl = (doc.querySelector('.content') as HTMLElement) || (doc.body as HTMLElement);
        contentEl.setAttribute('aria-live', 'polite');
        try {
          const cacheEl = doc.querySelector('#story-cache') as HTMLElement | null;
          storyCacheRef.current = cacheEl ? cacheEl.innerHTML : '';
        } catch { storyCacheRef.current = ''; }
        const {
          preHtml,
          choiceBlockHtml: firstChoiceBlockHtml,
          remainderHtml: initialRemainderHtml,
        } = splitContentAtChoices(doc, contentEl);
        let remainderHtml = initialRemainderHtml;

        // During typing include the whole contiguous choice block as plain text so labels are typed.
        const typingPhaseHtml = normalizeChoicesToPlainText(preHtml + firstChoiceBlockHtml);
        // After typing convert that choice block into buttons and STOP there
        const transformed = transformChoicesToButtons(preHtml + firstChoiceBlockHtml);
        const textLength = extractVisibleTextLength(typingPhaseHtml);

        // inject container for typing target
        host.innerHTML = '';
        const typedBox = document.createElement('div');
        typedBox.className = 'typed-box';
        host.appendChild(typedBox);

        const setContinuationFromRemainder = (remHtml: string) => {
          if (!(remHtml && remHtml.trim())) {
            continueRef.current = null;
            return;
          }
          continueRef.current = () => {
            const seg2 = document.createElement('div');
            seg2.className = 'tw-segment';
            typedBox.appendChild(seg2);
            const typing3 = normalizeChoicesToPlainText(remHtml);
            const transformed3 = transformChoicesToButtons(remHtml);
            const text3Length = extractVisibleTextLength(typing3);
            if (!text3Length) {
              seg2.innerHTML = sanitizeHTML(transformed3);
              restoreScrollSoon();
              cleanupChoices(seg2);
              bindChoiceHandlers();
              revealChoicesStagger(seg2);
              continueRef.current = null;
              return;
            }
            const len3 = Math.max(1, text3Length);
            const dur3 = getTypewriterDurationMs(host, len3);
            let s3: number | null = null;
            const raf3 = (ts: number) => {
              if (s3 == null) s3 = ts;
              const el3 = Math.max(0, ts - s3);
              const pr3 = Math.min(1, el3 / Math.max(1, dur3));
              const cnt3 = Math.max(0, Math.floor(pr3 * len3));
              try { seg2.innerHTML = sanitizeHTML(revealHtmlPreserve(typing3, cnt3)); } catch {}
              if (pr3 >= 1) {
                try { seg2.innerHTML = sanitizeHTML(transformed3); } catch {}
                restoreScrollSoon();
                cleanupChoices(seg2);
                bindChoiceHandlers();
                revealChoicesStagger(seg2);
                continueRef.current = null;
                return;
              }
              requestAnimationFrame(raf3);
            };
            requestAnimationFrame(raf3);
          };
        };

        const appendCachedSectionImmediate = (sectionHtml: string) => {
          const parser2 = new DOMParser();
          const doc2 = parser2.parseFromString(`<div class="content">${sectionHtml}</div>`, 'text/html');
          const root2 = (doc2.querySelector('.content') as HTMLElement) || (doc2.body as HTMLElement);
          const firstCh2 = root2.querySelector('p.choice, .choice-link');
          let pre2 = '';
          let block2 = '';
          let rem2 = '';
          if (firstCh2) {
            const rPre2 = doc2.createRange();
            rPre2.setStart(root2, 0);
            rPre2.setEndBefore(firstCh2);
            const wrap1 = doc2.createElement('div');
            wrap1.appendChild(rPre2.cloneContents());
            pre2 = wrap1.innerHTML;
            let last2: Element = firstCh2 as Element;
            let cur2 = firstCh2.nextElementSibling;
            while (cur2 && cur2.tagName.toLowerCase() === 'p' && (cur2 as HTMLElement).classList.contains('choice')) {
              last2 = cur2;
              cur2 = cur2.nextElementSibling;
            }
            const rBlk2 = doc2.createRange();
            rBlk2.setStartBefore(firstCh2);
            rBlk2.setEndAfter(last2);
            const wrap2 = doc2.createElement('div');
            wrap2.appendChild(rBlk2.cloneContents());
            block2 = wrap2.innerHTML;
            const rRem2 = doc2.createRange();
            rRem2.setStartAfter(last2);
            const end2: Node = (root2.lastChild ?? root2) as Node;
            rRem2.setEndAfter(end2);
            const wrap3 = doc2.createElement('div');
            wrap3.appendChild(rRem2.cloneContents());
            rem2 = wrap3.innerHTML;
          } else {
            pre2 = root2.innerHTML;
          }
          const seg = document.createElement('div');
          seg.className = 'tw-segment';
          seg.innerHTML = sanitizeHTML(transformChoicesToButtons(pre2 + block2));
          typedBox.appendChild(seg);
          restoreScrollSoon();
          cleanupChoices(seg);
          bindChoiceHandlers();
          revealChoicesStagger(seg);
          setContinuationFromRemainder(rem2);
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
                clearReaderResume();
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
                  clearReaderResume();
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
                    clearReaderResume();
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

        const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (!autoStart || textLength === 0 || prefersReduced || instantMode) {
          // Nic k psaní nebo autoStart off – rovnou zobraz HTML a interakce
          typedBox.innerHTML = sanitizeHTML(transformed);
          // Safety: ensure no choice starts as faded/disabled
          cleanupChoices(typedBox);
          bindChoiceHandlers();
          restoreChoiceVisuals(typedBox);
          setChoicesShown(true);
          isTypingRef.current = false; setIsTyping(false);
          tryRestoreResume();
        } else {
          // Progressive reveal of HTML like landing-intro
          const totalChars = Math.max(1, textLength);
          const duration = getTypewriterDurationMs(host, textLength);
          let cancelledLocal = false;
          isTypingRef.current = true; setIsTyping(true);
          let startTs: number | null = null;
          const rafTick = (ts: number) => {
            if (cancelledLocal) return;
            if (startTs == null) startTs = ts;
            const elapsed = Math.max(0, ts - startTs);
            const progress = Math.min(1, elapsed / Math.max(1, duration));
            const typedCount = Math.max(0, Math.floor(progress * totalChars));
            try { typedBox.innerHTML = sanitizeHTML(renderTypingHtml(typingPhaseHtml, typedCount)); } catch {}
            if (progress >= 1) {
              // Swap in final HTML with buttons (pre + choices) and bind interactions
              try { typedBox.innerHTML = sanitizeHTML(transformed); } catch {}
              // Safety: ensure no choice starts as faded/disabled
              cleanupChoices(typedBox);
              bindChoiceHandlers();
              restoreChoiceVisuals(typedBox);
              setChoicesShown(true);
              isTypingRef.current = false; setIsTyping(false);
              // autofocus first choice for keyboard users (never scroll viewport)
              try {
                const first = (typedBox.querySelector('.choice-link') as HTMLElement | null);
                try { (first as any)?.focus?.({ preventScroll: true }); } catch { first?.focus?.(); }
                restoreScrollSoon();
                const label = (first?.textContent || '').replace(/\s+/g, ' ').trim();
                if (label) announce(`Možnosti jsou připravené. Fokus na: ${label}`);
              } catch {}
              // Prepare continuation if there is any remainder
              let buildNextSegment: (() => void) | null = null;
              buildNextSegment = () => {
                // Process next segment: find next block inside remainderHtml and append typing
                const parser2 = new DOMParser();
                const doc2 = parser2.parseFromString(remainderHtml, 'text/html');
                const root2 = (doc2.querySelector('.content') as HTMLElement) || (doc2.body as HTMLElement);
                const cutoff2 = root2.querySelector('#story-cache');
                const firstCh2 = root2.querySelector('p.choice, .choice-link');
                let pre2 = '';
                let block2 = '';
                let rem2 = '';
                if (firstCh2) {
                  const rPre2 = doc2.createRange(); rPre2.setStart(root2, 0); rPre2.setEndBefore(firstCh2);
                  const w1 = doc2.createElement('div'); w1.appendChild(rPre2.cloneContents()); pre2 = w1.innerHTML;
                  let last2: Element = firstCh2 as Element; let cur2 = firstCh2.nextElementSibling;
                  while (cur2 && cur2.tagName.toLowerCase() === 'p' && (cur2 as HTMLElement).classList.contains('choice')) { last2 = cur2; cur2 = cur2.nextElementSibling; }
                  const rBlk2 = doc2.createRange(); rBlk2.setStartBefore(firstCh2); rBlk2.setEndAfter(last2);
                  const w2 = doc2.createElement('div'); w2.appendChild(rBlk2.cloneContents()); block2 = w2.innerHTML;
                  const rRem2 = doc2.createRange(); rRem2.setStartAfter(last2);
                  if (cutoff2 && cutoff2.parentNode) rRem2.setEndBefore(cutoff2); else {
                    const end2: Node = (root2.lastChild ?? root2) as Node;
                    rRem2.setEndAfter(end2);
                  }
                  const w3 = doc2.createElement('div'); w3.appendChild(rRem2.cloneContents()); rem2 = w3.innerHTML;
                } else {
                  const rAll2 = doc2.createRange(); rAll2.setStart(root2, 0);
                  if (cutoff2 && cutoff2.parentNode) rAll2.setEndBefore(cutoff2); else {
                    const endAll2: Node = (root2.lastChild ?? root2) as Node;
                    rAll2.setEndAfter(endAll2);
                  }
                  const wAll = doc2.createElement('div'); wAll.appendChild(rAll2.cloneContents()); pre2 = wAll.innerHTML; block2 = ''; rem2 = '';
                }
                const typing2 = normalizeChoicesToPlainText(pre2 + block2);
                const transformed2 = transformChoicesToButtons(pre2 + block2);
                const baseHtml = typedBox.innerHTML; // append after current content
                const text2 = extractVisibleTextLength(typing2);
                if (!text2) {
                  try { typedBox.innerHTML = sanitizeHTML(baseHtml + transformed2); } catch {}
                  // Safety: ensure no choice starts as faded/disabled
                  cleanupChoices(typedBox);
                  bindChoiceHandlers();
                  try {
                    const el = (typedBox.querySelector('.choice-link') as HTMLElement | null);
                    try { (el as any)?.focus?.({ preventScroll: true }); } catch { el?.focus?.(); }
                    restoreScrollSoon();
                  } catch {}
                  if (rem2 && rem2.trim()) { remainderHtml = rem2; continueRef.current = buildNextSegment!; } else { continueRef.current = null; }
                  return;
                }
                const len2 = text2;
                const dur2 = getTypewriterDurationMs(hostRef.current!, len2);
                let start2: number | null = null;
                const raf2 = (t: number) => {
                  if (start2 == null) start2 = t;
                  const el2 = Math.max(0, t - start2);
                  const pr2 = Math.min(1, el2 / Math.max(1, dur2));
                  const cnt2 = Math.max(0, Math.floor(pr2 * Math.max(1, len2)));
                  try { typedBox.innerHTML = sanitizeHTML(baseHtml + renderTypingHtml(typing2, cnt2)); } catch {}
                  if (pr2 >= 1) {
                    try { typedBox.innerHTML = sanitizeHTML(baseHtml + transformed2); } catch {}
                    // Safety: ensure no choice starts as faded/disabled
                    cleanupChoices(typedBox);
                    bindChoiceHandlers();
                    try {
                      const first2 = (typedBox.querySelector('.choice-link') as HTMLElement | null);
                      try { (first2 as any)?.focus?.({ preventScroll: true }); } catch { first2?.focus?.(); }
                      restoreScrollSoon();
                      const label2 = (first2?.textContent || '').replace(/\s+/g, ' ').trim();
                      if (label2) announce(`Nové možnosti jsou připravené. Fokus na: ${label2}`);
                    } catch {}
                    if (rem2 && rem2.trim()) { remainderHtml = rem2; continueRef.current = buildNextSegment!; }
                    else { continueRef.current = null; }
                    return;
                  }
                  requestAnimationFrame(raf2);
                };
                requestAnimationFrame(raf2);
              };
              if (remainderHtml && remainderHtml.trim()) {
                continueRef.current = buildNextSegment;
              }
              tryRestoreResume();
              return;
            }
            requestAnimationFrame(rafTick);
          };
          // initial render empty
          try { typedBox.innerHTML = sanitizeHTML(renderTypingHtml(typingPhaseHtml, 0)); } catch { typedBox.innerHTML = ''; }
          requestAnimationFrame(rafTick);
          cancelRef.current = () => { cancelledLocal = true; };
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Načítání selhalo');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      try { cancelRef.current?.(); } catch {}
      glitchCleanupRef.current.forEach(fn => { try { fn(); } catch {} });
      glitchCleanupRef.current = [];
    };
  }, [srcUrl, autoStart, instantMode, onFetchError, bindChoiceHandlers, announce, cleanupChoices, restoreScrollSoon, revealChoicesStagger]);

  return (
    <div
      id={id}
      className={`SYNTHOMAREADER ${isTyping ? 'typing' : ''} ${choicesShown ? 'choices-shown' : ''} ${className || ''}`.trim()}
      aria-label={ariaLabel}
      data-chapter-id={chapterIdProp ?? ''}
      data-collection={collectionProp ?? 'SYNTHOMA-NULL'}
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
        {isLoading && (
          <div className="chapter-overlay loading">Načítám…</div>
        )}
        {!!error && (
          <div className="chapter-overlay warning">{error}</div>
        )}
      </div>
    </div>
  );
}
