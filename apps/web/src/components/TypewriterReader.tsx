"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// Basic HTML sanitizer to mitigate XSS from external chapter HTML
function sanitizeHTML(html: string): string {
  try {
    const root = document.createElement('div');
    root.innerHTML = html;
    // remove scripts and iframes entirely
    root.querySelectorAll('script, iframe, object, embed').forEach((el) => el.remove());
    // neutralize inline event handlers and dangerous URLs
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    const toClean: Element[] = [];
    while (walker.nextNode()) {
      const el = walker.currentNode as Element;
      toClean.push(el);
    }
    toClean.forEach((el) => {
      // remove on* handlers
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on')) {
          el.removeAttribute(attr.name);
          return;
        }
        if (name === 'href' || name === 'src') {
          const val = (attr.value || '').trim();
          if (/^\s*javascript:/i.test(val)) {
            el.removeAttribute(attr.name);
            return;
          }
          // allow only http(s), protocol-relative, root-relative, hash
          if (!(val.startsWith('http://') || val.startsWith('https://') || val.startsWith('//') || val.startsWith('/') || val.startsWith('#'))) {
            el.removeAttribute(attr.name);
          }
        }
        if (name === 'style') {
          // strip inline styles to avoid url(js) shenanigans; keep layout controlled by CSS
          el.removeAttribute(attr.name);
        }
      });
    });
    return root.innerHTML;
  } catch {
    return html;
  }
}

// Transforms <p class="choice"> into clickable buttons preserving MBTI tags when no navigation target
function transformChoicesToButtons(html: string): string {
  try {
    const root = document.createElement('div');
    root.innerHTML = html;
    const nodes = Array.from(root.querySelectorAll('p.choice')) as HTMLElement[];
    nodes.forEach((p) => {
      const existingAnchor = p.querySelector('a.choice-link[href]');
      if (existingAnchor) return;
      const next = p.getAttribute('data-next') || '';
      const ui = p.getAttribute('data-ui') || '';
      const tags = p.getAttribute('data-tags') || '';
      const btn = document.createElement('button');
      btn.className = 'choice-link';
      if (next) btn.setAttribute('data-next', next);
      if (ui) btn.setAttribute('data-ui', ui);
      if (tags) btn.setAttribute('data-tags', tags);
      btn.type = 'button';
      btn.innerHTML = p.innerHTML;
      p.replaceWith(btn);
    });
    return root.innerHTML;
  } catch { return html; }
}

// Prepare HTML for typing phase: ensure choices are visible as plain text, not buttons/links
function normalizeChoicesToPlainText(html: string): string {
  try {
    const root = document.createElement('div');
    root.innerHTML = html;
    const nodes = Array.from(root.querySelectorAll('p.choice')) as HTMLElement[];
    nodes.forEach((p) => {
      // Replace inner content with plain text so it can be progressively revealed
      const text = (p.textContent || '').replace(/\s+/g, ' ').trim();
      p.textContent = text;
    });
    // also downgrade any pre-existing anchors/buttons to plain text during typing
    root.querySelectorAll('a.choice-link, button.choice-link').forEach((el) => {
      const parent = el.parentElement;
      const span = document.createElement('span');
      span.className = 'choice';
      span.textContent = (el.textContent || '').replace(/\s+/g, ' ').trim();
      el.replaceWith(span);
      if (parent && parent.tagName.toLowerCase() === 'p') {
        (parent as HTMLElement).classList.add('choice');
      }
    });
    return root.innerHTML;
  } catch { return html; }
}

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
      // Do not encode empty segments unnecessarily
      return encodeURIComponent(seg);
    });
    return parts.join('/') + rest;
  } catch {
    return url;
  }
}

export interface TypewriterReaderProps {
  srcUrl: string;            // URL k HTML (např. /data/SYNTHOMAINFO.html nebo kapitola)
  className?: string;        // extra třídy pro wrapper
  ariaLabel?: string;
  autoStart?: boolean;       // auto spustit typewriter po načtení
  id?: string;               // volitelný id atribut pro root (např. "hero-info")
}

export default function TypewriterReader({ srcUrl, className = '', ariaLabel = 'Čtečka', autoStart = true, id }: TypewriterReaderProps) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cancelRef = useRef<(() => void) | null>(null);
  const [choicesShown, setChoicesShown] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const continueRef = useRef<null | (() => void)>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((msg: string) => {
    try {
      if (!liveRef.current) return;
      liveRef.current.textContent = msg;
    } catch {}
  }, []);

  const bindChoiceHandlers = useCallback(() => {
    const root = hostRef.current;
    if (!root) return;
    // navigační
    root.querySelectorAll('.choice-link').forEach((el) => {
      const node = el as HTMLElement;
      if (node.dataset.boundGeneral === '1') return;
      // announce on focus for screen reader users
      node.addEventListener('focus', () => {
        const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (label) announce(`Fokus na volbu: ${label}`);
      });
      node.addEventListener('click', (e: Event) => {
        const href = node.getAttribute('href') || node.getAttribute('data-next') || '';
        // If we have a pending continuation segment, use it instead of navigating
        if (continueRef.current) {
          e.preventDefault();
          // visual lock of the whole contiguous block of buttons
          try {
            let sib: Element | null;
            // backward
            sib = node.previousElementSibling;
            while (sib && sib.tagName.toLowerCase() === 'button' && (sib as HTMLElement).classList.contains('choice-link')) {
              (sib as HTMLElement).classList.add('disabled');
              (sib as HTMLElement).classList.remove('selected');
              sib = sib.previousElementSibling;
            }
            // forward
            sib = node.nextElementSibling;
            while (sib && sib.tagName.toLowerCase() === 'button' && (sib as HTMLElement).classList.contains('choice-link')) {
              (sib as HTMLElement).classList.add('disabled');
              (sib as HTMLElement).classList.remove('selected');
              sib = sib.nextElementSibling;
            }
            node.classList.add('selected');
            node.classList.remove('disabled');
            node.setAttribute('aria-pressed', 'true');
          } catch {}
          // MBTI scoring from data-tags (first tag)
          try {
            const tags = (node.getAttribute('data-tags') || '').split(',').map(s => s.trim()).filter(Boolean);
            if (tags.length) {
              const key = 'mbtiScores';
              let data: Record<string, number> = {};
              try { data = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { data = {}; }
              const letter = tags[0] as string;
              data[letter] = (data[letter] ?? 0) + 1;
              const str = JSON.stringify(data);
              try { localStorage.setItem(key, str); } catch {}
              try { sessionStorage.setItem(key, str); } catch {}
              try { document.dispatchEvent(new CustomEvent('synthoma:choice-made')); } catch {}
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
          try { document.dispatchEvent(new CustomEvent('synthoma:choice-made')); } catch {}
          const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
          if (label) announce(`Zvoleno: ${label}.`);
          return;
        }
        if (href.startsWith('http')) {
          window.open(href, '_blank');
        } else if (href.startsWith('#')) {
          const section = document.querySelector(href);
          section?.scrollIntoView({ behavior: 'smooth' });
          try { document.dispatchEvent(new CustomEvent('synthoma:choice-made')); } catch {}
          const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
          if (label) announce(`Zvoleno: ${label}.`);
        } else {
          router.push(`/reader?u=${encodeURIComponent(href)}`);
        }
      });
      node.dataset.boundGeneral = '1';
    });

    // lokální MBTI-like
    root.querySelectorAll('p.choice[data-tags]').forEach((el) => {
      const node = el as HTMLElement;
      if (node.dataset.boundPchoice === '1') return;
      if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '0');
      if (!node.hasAttribute('role')) node.setAttribute('role', 'button');
      if (!node.hasAttribute('aria-pressed')) node.setAttribute('aria-pressed', 'false');
      node.addEventListener('focus', () => {
        const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (label) announce(`Fokus na volbu: ${label}`);
      });
      const activate = () => {
        const tags = (node.getAttribute('data-tags') || '')
          .split(',').map(s => s.trim()).filter(Boolean);
        if (tags.length) {
          try { document.dispatchEvent(new CustomEvent('synthoma:choice-made')); } catch {}
        }
        // vizuální feedback v rámci souvislého bloku
        try {
          let sib: Element | null;
          sib = node.previousElementSibling;
          while (sib && sib.tagName.toLowerCase() === 'p' && (sib as HTMLElement).classList.contains('choice')) {
            (sib as HTMLElement).classList.remove('selected');
            (sib as HTMLElement).classList.add('disabled');
            sib = sib.previousElementSibling;
          }
          sib = node.nextElementSibling;
          while (sib && sib.tagName.toLowerCase() === 'p' && (sib as HTMLElement).classList.contains('choice')) {
            (sib as HTMLElement).classList.remove('selected');
            (sib as HTMLElement).classList.add('disabled');
            sib = sib.nextElementSibling;
          }
          node.classList.add('selected');
          node.classList.remove('disabled');
          node.setAttribute('aria-pressed', 'true');
        } catch {}
        const label = (node.textContent || '').replace(/\s+/g, ' ').trim();
        if (label) announce(`Zvoleno: ${label}.`);
      };
      node.addEventListener('click', (e) => { e.preventDefault(); activate(); });
      node.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
      node.dataset.boundPchoice = '1';
    });
  }, [router, announce]);

  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;
    if (!host) return;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const finalUrl = encodePathPreserve(srcUrl);
        const res = await fetch(finalUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.text();

        // Parse, normalize and convert choices
        const parser = new DOMParser();
        const doc = parser.parseFromString(raw, 'text/html');
        const contentEl = (doc.querySelector('.content') as HTMLElement) || (doc.body as HTMLElement);
        contentEl.setAttribute('aria-live', 'polite');

        // Decide cutoff so that we ONLY type the pre-choice content.
        // We split content into two segments: preHtml (typed) and choicesHtml (buttons shown after typing).
        const cutoffNode = contentEl.querySelector('#story-cache');
        const firstChoice = contentEl.querySelector('p.choice, .choice-link');
        let preHtml = '';
        let firstChoiceBlockHtml = '';
        let remainderHtml = '';
        if (firstChoice) {
          // preHtml: everything before first choice
          const rPre = doc.createRange();
          rPre.setStart(contentEl, 0);
          rPre.setEndBefore(firstChoice);
          const preFrag = rPre.cloneContents();
          const wrapPre = doc.createElement('div');
          wrapPre.appendChild(preFrag);
          preHtml = wrapPre.innerHTML;

          // collect contiguous choice block starting at firstChoice
          let last = firstChoice as Element;
          let cursor = firstChoice.nextElementSibling;
          while (cursor && cursor.tagName.toLowerCase() === 'p' && (cursor as HTMLElement).classList.contains('choice')) {
            last = cursor;
            cursor = cursor.nextElementSibling;
          }
          const rChoiceBlock = doc.createRange();
          rChoiceBlock.setStartBefore(firstChoice);
          rChoiceBlock.setEndAfter(last);
          const chFrag = rChoiceBlock.cloneContents();
          const wrapCh = doc.createElement('div');
          wrapCh.appendChild(chFrag);
          firstChoiceBlockHtml = wrapCh.innerHTML;

          // remainder after the block up to cutoff or end
          const rRemain = doc.createRange();
          rRemain.setStartAfter(last);
          if (cutoffNode && cutoffNode.parentNode) rRemain.setEndBefore(cutoffNode); else {
            const endNode: Node = (contentEl.lastChild ?? contentEl) as Node;
            rRemain.setEndAfter(endNode);
          }
          const remFrag = rRemain.cloneContents();
          const wrapRem = doc.createElement('div');
          wrapRem.appendChild(remFrag);
          remainderHtml = wrapRem.innerHTML;
        } else {
          // No explicit choices – type everything until cutoff if present
          const rAll = doc.createRange();
          rAll.setStart(contentEl, 0);
          if (cutoffNode && cutoffNode.parentNode) rAll.setEndBefore(cutoffNode); else {
            const endNode: Node = (contentEl.lastChild ?? contentEl) as Node;
            rAll.setEndAfter(endNode);
          }
          const frag = rAll.cloneContents();
          const wrap = doc.createElement('div');
          wrap.appendChild(frag);
          preHtml = wrap.innerHTML;
          firstChoiceBlockHtml = '';
          remainderHtml = '';
        }

        // During typing include the whole contiguous choice block as plain text so labels are typed.
        const typingPhaseHtml = normalizeChoicesToPlainText(preHtml + firstChoiceBlockHtml);
        // After typing convert that choice block into buttons and STOP there
        const transformed = transformChoicesToButtons(preHtml + firstChoiceBlockHtml);
        // compute total visible characters from TYPING html (plain text choices)
        const tmp = document.createElement('div');
        tmp.innerHTML = typingPhaseHtml;
        tmp.querySelectorAll('#story-cache, .hidden').forEach(el => el.remove());
        const textOnly = (tmp.textContent || '').replace(/^\s+|\s+$/g, '');

        // helper to reveal only first N characters while preserving HTML structure
        const renderRevealed = (srcHtml: string, count: number): string => {
          try {
            const container = document.createElement('div');
            container.innerHTML = srcHtml;
            container.querySelectorAll('#story-cache, .hidden').forEach(el => el.remove());
            let remaining = Math.max(0, count);
            const stripNode = (node: Node) => {
              if (node.nodeType === Node.TEXT_NODE) { (node as Text).nodeValue = ''; return; }
              const el = node as Element; while (el.firstChild) el.removeChild(el.firstChild);
            };
            const processNode = (node: Node) => {
              if (remaining <= 0) { stripNode(node); return; }
              if (node.nodeType === Node.TEXT_NODE) {
                const text = node.nodeValue || '';
                const len = text.length;
                if (remaining >= len) { remaining -= len; }
                else { node.nodeValue = text.slice(0, Math.max(0, remaining)); remaining = 0; }
                return;
              }
              const children = Array.from(node.childNodes);
              for (const child of children) {
                processNode(child);
              }
            };
            Array.from(container.childNodes).forEach(processNode);
            // during typing: there are no buttons (we type plain text). Ensure no accidental interactive elements.
            container.querySelectorAll('a, button').forEach((el) => {
              if (el instanceof HTMLButtonElement) { el.disabled = true; el.style.pointerEvents = 'none'; }
            });
            return container.innerHTML;
          } catch { return srcHtml; }
        };

        // inject container for typing target
        host.innerHTML = '';
        const typedBox = document.createElement('div');
        typedBox.className = 'typed-box';
        host.appendChild(typedBox);

        const getDurationMs = () => {
          const cs = getComputedStyle(host);
          const durVar = cs.getPropertyValue('--typewriter-duration').trim();
          if (durVar.endsWith('ms')) return parseFloat(durVar);
          if (durVar.endsWith('s')) return parseFloat(durVar) * 1000;
          const len = typingPhaseHtml.length;
          // rychlejší fallback heuristika
          return Math.min(24000, Math.max(2500, Math.round(len * 16)));
        };

        if (!autoStart || textOnly.length === 0) {
          // Nic k psaní nebo autoStart off – rovnou zobraz HTML a interakce
          typedBox.innerHTML = sanitizeHTML(transformed);
          bindChoiceHandlers();
          setChoicesShown(true);
          setIsTyping(false);
        } else {
          // Progressive reveal of HTML like landing-intro
          const totalChars = Math.max(1, textOnly.length);
          const duration = getDurationMs();
          const stepMs = Math.max(10, Math.round(duration / totalChars));
          let cancelledLocal = false;
          let typed = 0;
          setIsTyping(true);
          const tick = () => {
            if (cancelledLocal) return;
            typed = Math.min(totalChars, typed + 1);
            try { typedBox.innerHTML = sanitizeHTML(renderRevealed(typingPhaseHtml, typed)); } catch {}
            if (typed >= totalChars) {
              // Swap in final HTML with buttons (pre + choices) and bind interactions
              try { typedBox.innerHTML = sanitizeHTML(transformed); } catch {}
              bindChoiceHandlers();
              setChoicesShown(true);
              setIsTyping(false);
              // autofocus first choice for keyboard users
              try {
                const first = (typedBox.querySelector('.choice-link') as HTMLElement | null);
                first?.focus();
                const label = (first?.textContent || '').replace(/\s+/g, ' ').trim();
                if (label) announce(`Možnosti jsou připravené. Fokus na: ${label}`);
              } catch {}
              // Prepare continuation if there is any remainder
              if (remainderHtml && remainderHtml.trim()) {
                continueRef.current = () => {
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
                  const tmp2 = document.createElement('div'); tmp2.innerHTML = typing2; const text2 = (tmp2.textContent || '').trim();
                  if (!text2) {
                    try { typedBox.innerHTML = sanitizeHTML(baseHtml + transformed2); } catch {}
                    bindChoiceHandlers();
                    try { (typedBox.querySelector('.choice-link') as HTMLElement | null)?.focus(); } catch {}
                    if (rem2 && rem2.trim()) { remainderHtml = rem2; continueRef.current = () => (continueRef.current = null); } else { continueRef.current = null; }
                    return;
                  }
                  const len2 = text2.length; const getDur2 = () => {
                    const cs2 = getComputedStyle(hostRef.current!); const var2 = cs2.getPropertyValue('--typewriter-duration').trim();
                    if (var2.endsWith('ms')) return parseFloat(var2); if (var2.endsWith('s')) return parseFloat(var2) * 1000; return Math.min(24000, Math.max(2500, Math.round(len2 * 16)));
                  };
                  let t2 = 0; const dur2 = getDur2(); const step2 = Math.max(10, Math.round(dur2 / Math.max(1, len2)));
                  const tick2 = () => {
                    t2 = Math.min(len2, t2 + 1);
                    try { typedBox.innerHTML = sanitizeHTML(baseHtml + renderRevealed(typing2, t2)); } catch {}
                    if (t2 >= len2) {
                      try { typedBox.innerHTML = sanitizeHTML(baseHtml + transformed2); } catch {}
                      bindChoiceHandlers();
                      try {
                        const first2 = (typedBox.querySelector('.choice-link') as HTMLElement | null);
                        first2?.focus();
                        const label2 = (first2?.textContent || '').replace(/\s+/g, ' ').trim();
                        if (label2) announce(`Nové možnosti jsou připravené. Fokus na: ${label2}`);
                      } catch {}
                      if (rem2 && rem2.trim()) { remainderHtml = rem2; continueRef.current = () => { /* will be reset by next segment build */ }; }
                      else { continueRef.current = null; }
                      return;
                    }
                    window.setTimeout(tick2, step2);
                  };
                  window.setTimeout(tick2, step2);
                };
              }
              return;
            }
            window.setTimeout(tick, stepMs);
          };
          // initial render empty
          try { typedBox.innerHTML = sanitizeHTML(renderRevealed(typingPhaseHtml, 0)); } catch { typedBox.innerHTML = ''; }
          window.setTimeout(tick, stepMs);
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
    };
  }, [srcUrl, autoStart, bindChoiceHandlers, announce]);

  return (
    <div id={id} className={`SYNTHOMAREADER ${isTyping ? 'typing' : ''} ${choicesShown ? 'choices-shown' : ''} ${className || ''}`.trim()} aria-label={ariaLabel}>
      <div className={"chapter-content"}>
        <div ref={hostRef} className="reader-host prose prose-invert max-w-none" />
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
