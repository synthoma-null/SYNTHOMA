"use client";



import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

import { useRouter } from "next/navigation";

import { runCinematicTitleIntro } from "../../src/lib/cinematicTitle";

import { getSharedAudio, setSharedAudioSrc } from "../../src/lib/audio";

import { writeStorage, readStorage } from "../../src/lib/browser";

import { readLastChapterPath } from "../../src/lib/readerState";

import { runTypewriter, typeExternalInfo, typeBooksList } from "../../src/lib/typewriter";

import { attachGlitchHeading } from "../../src/lib/glitchHeading";

import { extractVisibleTextLength, revealHtmlPreserve, sanitizeHTML, transformChoicesToButtons } from "../../src/lib/typewriterContent";

import TypewriterReader from "../../src/components/TypewriterReader";

import styles from "./styles.module.css";



const TITLE = "SYNTHOMA";

const MANIFEST = "Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.";

const BTN_LABEL = "Pokračovat \u266B";

// Re-enabled: follow-up typewriter (watchdogs + click-to-complete keep it safe)

const enableFollowupTypewriter = true;



export default function LandingIntroPage() {

  const router = useRouter();

  const [showTitle, setShowTitle] = useState(false);

  // Title renders as glitch/text H1 (video variant removed for iOS compatibility)

  const [showManifest, setShowManifest] = useState(false);

  const [typedDone, setTypedDone] = useState(false);

  const [btnVisible, setBtnVisible] = useState(false);

  const [showHeroInfo, setShowHeroInfo] = useState(false);

  const [showReader, setShowReader] = useState(false);

  const [showReaderDetails, setShowReaderDetails] = useState(false);

  const [controlsVisible, setControlsVisible] = useState(false);

  const readerIntroRanRef = useRef(false);

  const readerSeqRanRef = useRef(false);

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const glitchRootRef = useRef<HTMLDivElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const btnGlitchRef = useRef<HTMLButtonElement | null>(null);

  const isStartingAudioRef = useRef(false);

  const manifestCancelRef = useRef<(() => void) | null>(null);

  const [infoHtml, setInfoHtml] = useState<string>("");

  const [infoTypedCount, setInfoTypedCount] = useState(0);

  const [infoIsTyping, setInfoIsTyping] = useState(false);

  const [infoChoicesShown, setInfoChoicesShown] = useState(false);

  const [infoTotalLen, setInfoTotalLen] = useState(0);

  const infoFullHtmlRef = useRef<string>("");

  // Background video toggle (disable on iOS Safari to avoid native play overlay)

  const [showBgVideo, setShowBgVideo] = useState(true);

  // Force using the same reader component as Autor for 1:1 visuals/behavior

  const useReaderComponent = true;



  const sanitizeIntroHtml = useCallback((html: string): string => {

    try {

      const root = document.createElement('div');

      root.innerHTML = sanitizeHTML(transformChoicesToButtons(html));

      root.querySelectorAll('#story-cache, .hidden, link, style, body').forEach((el) => el.remove());

      return root.innerHTML;

    } catch { return html; }

  }, []);



  const buildTextOnlyIntroHtml = useCallback((html: string): string => {

    try {

      const root = document.createElement('div');

      root.innerHTML = html;

      root.querySelectorAll('p.choice').forEach((el) => el.remove());

      return root.innerHTML;

    } catch {

      return html;

    }

  }, []);



  const setInfoFromHtml = useCallback((html: string) => {

    const cleaned = sanitizeIntroHtml(html);

    setInfoHtml(cleaned);

    try {

      setInfoTotalLen(extractVisibleTextLength(cleaned));

    } catch {

      setInfoTotalLen(0);

    }

    setInfoTypedCount(0);

    setInfoIsTyping(true);

  }, [sanitizeIntroHtml]);



  // removed unused debug click handlers



  useEffect(() => {

    if (useReaderComponent) return; // handled by TypewriterReader

    if (!showHeroInfo) return;

    let cancelled = false;

    (async () => {

      try {

        const res = await fetch('/data/SYNTHOMAINFO.html', { cache: 'no-store' });

        if (!res.ok) { console.warn('SYNTHOMAINFO fetch failed', res.status); return; }

        const html = await res.text();

        if (cancelled) return;

        infoFullHtmlRef.current = html;

        setInfoFromHtml(html);

      } catch (e) {

        console.error('hero info load failed', e);

      }

    })();

    return () => { cancelled = true; };

  }, [showHeroInfo, setInfoFromHtml, useReaderComponent]);



  useEffect(() => {

    if (useReaderComponent) return; // handled by TypewriterReader

    if (!showHeroInfo) return;

    const host = document.getElementById('hero-info');

    if (!host) return;

    const onClick = (ev: MouseEvent) => {

      const t = ev.target as HTMLElement | null;

      if (!t) return;

      const a = t.closest('a.choice-link[href]') as HTMLAnchorElement | null;

      if (a) {

        const href = a.getAttribute('href') || '';

        if (href) {

          // Respect local lock: ignore if aria-disabled=true

          if (a.getAttribute('aria-disabled') === 'true' || a.closest('.choices-locked')) { ev.preventDefault(); ev.stopPropagation(); return; }

          ev.preventDefault(); ev.stopPropagation();

          if (infoIsTyping) { try { setInfoIsTyping(false); setInfoTypedCount(infoTotalLen); } catch {} }

          // Mirror button behavior: mark chosen/faded and lock only the local group

          try {

            const hostEl = document.getElementById('hero-info') as HTMLElement | null;

            let group = (a.closest('[data-choice-group], .choices, .choice-group') as HTMLElement | null);

            if (!group) {

              let cur: HTMLElement | null = a.parentElement as HTMLElement | null;

              while (cur && cur !== hostEl && cur.querySelectorAll('p.choice').length < 2) {

                cur = cur.parentElement as HTMLElement | null;

              }

              if (cur && cur.querySelectorAll('p.choice').length >= 2) group = cur;

            }

            if (!group) group = (a.parentElement as HTMLElement | null) || (a as unknown as HTMLElement);

            const choiceNodes = Array.from(group.querySelectorAll('button.choice-link, a.choice-link[href]')) as HTMLElement[];

            choiceNodes.forEach((node) => {

              const isClicked = node === (a as unknown as HTMLElement);

              if (isClicked) node.classList.add('chosen'); else node.classList.add('faded');

              if (node.tagName === 'BUTTON') { (node as HTMLButtonElement).disabled = true; }

              node.setAttribute('aria-disabled', 'true');

            });

            group.classList.add('choices-locked');

          } catch {}

          // Navigate

          try {

            if (href.startsWith('/')) { router.push(href); } else { window.location.href = href; }

          } catch {}

        }

        return;

      }

      const p = t.closest('button.choice-link') as HTMLElement | null;

      if (!p) return;

      if (infoIsTyping) {

        ev.preventDefault(); ev.stopPropagation();

        try { setInfoIsTyping(false); setInfoTypedCount(infoTotalLen); } catch {}

      }

      ev.preventDefault(); ev.stopPropagation();

      const next = p.getAttribute('data-next') || '';

      if (!next) return;

      try {

        const doc = document.createElement('div');

        doc.innerHTML = infoFullHtmlRef.current || infoHtml;

        const cache = doc.querySelector('#story-cache');

        const section = cache ? cache.querySelector(`#${CSS.escape(next)}`) as HTMLElement | null : null;

        if (section) {

          const hostEl = document.getElementById('hero-info') as HTMLElement | null;

          if (hostEl) {

            // Hard guard 1: prevent starting multiple follow-ups at once if one is already running

            const activeTW = document.querySelector('.hero-followup-block.tw-running');

            if (activeTW) { return; }

            // Hard guard 2: immediate busy flag on host to avoid a race before .tw-running exists

            if (hostEl.getAttribute('data-followup-busy') === '1') { return; }

            hostEl.setAttribute('data-followup-busy', '1');

            // Prefer explicit choice group markers injected during normalization

            let group = (p.closest('[data-choice-group], .choices, .choice-group') as HTMLElement | null);

            if (!group) {

              // Walk up until a container that contains at least two p.choice descendants

              let cur: HTMLElement | null = p.parentElement as HTMLElement | null;

              while (cur && cur !== hostEl && cur.querySelectorAll('p.choice').length < 2) {

                cur = cur.parentElement as HTMLElement | null;

              }

              if (cur && cur.querySelectorAll('p.choice').length >= 2) group = cur;

            }

            if (!group) group = (p.parentElement as HTMLElement | null) || (p as HTMLElement);

            // Lock both button and anchor choices within the local group

            const choiceNodes = Array.from(group.querySelectorAll('button.choice-link, a.choice-link[href]')) as HTMLElement[];

            choiceNodes.forEach((node) => {

              const isClicked = node === (p as HTMLElement);

              if (isClicked) node.classList.add('chosen'); else node.classList.add('faded');

              if (node.tagName === 'BUTTON') { (node as HTMLButtonElement).disabled = true; }

              node.setAttribute('aria-disabled', 'true');

            });

            // Only lock this local group, never the entire host

            group.classList.add('choices-locked');

            let follow = document.getElementById('hero-info-followup');

            if (!follow) { 

              follow = document.createElement('div'); 

              follow.id = 'hero-info-followup'; 

              follow.setAttribute('role', 'region');

              follow.setAttribute('aria-live', 'polite');

              follow.setAttribute('aria-label', 'Pokračování');

              // Append INSIDE chapter-content so reader overlay/background applies to all blocks

              const contentRoot = hostEl.querySelector('.chapter-content') as HTMLElement | null;

              if (contentRoot) { contentRoot.appendChild(follow); } else { hostEl.appendChild(follow); }

            } else {

              // ensure ARIA stays applied if element existed

              follow.setAttribute('role', 'region');

              follow.setAttribute('aria-live', 'polite');

              if (!follow.getAttribute('aria-label')) follow.setAttribute('aria-label', 'Pokračování');

            }

            const normalized = sanitizeIntroHtml(section.innerHTML);

            const textOnlyNormalized = buildTextOnlyIntroHtml(normalized);

            const wrapper = document.createElement('div');

            wrapper.className = 'hero-followup-block';

            follow.appendChild(wrapper);



            const totalChars = Math.max(1, extractVisibleTextLength(textOnlyNormalized));

            const computeDuration = () => {

              const mw = document.getElementById('manifest-container');

              if (mw) {

                const cs = getComputedStyle(mw);

                const durVar = cs.getPropertyValue('--typewriter-duration').trim();

                // Faster scaling: lower caps and multiplier

                if (durVar.endsWith('ms')) return Math.min(16000, Math.max(700, parseFloat(durVar) * Math.min(2.2, totalChars / 120)));

                if (durVar.endsWith('s')) return Math.min(16000, Math.max(700, parseFloat(durVar) * 1000 * Math.min(2.2, totalChars / 120)));

              }

              // Default faster baseline

              return Math.min(16000, Math.max(700, totalChars * 14));

            };



            const renderRevealed = (srcHtml: string, count: number): string => {

              try { return revealHtmlPreserve(srcHtml, count); } catch { return srcHtml; }

            };



            if (!enableFollowupTypewriter) {

              try {

                // Instant render as hotfix

                wrapper.innerHTML = normalized;

                // ensure choices are visible and unlocked

                wrapper.querySelectorAll('button.choice-link.choice-empty').forEach(el => el.classList.remove('choice-empty'));

                wrapper.querySelectorAll('.choices, .choice-group, [data-choice-group]')

                  .forEach(el => el.classList.remove('choices-locked'));

                wrapper.classList.remove('choices-locked');

                wrapper.querySelectorAll('.choice-link').forEach((el: Element) => {

                  (el as HTMLElement).classList.remove('faded');

                  (el as HTMLElement).removeAttribute('disabled');

                  (el as HTMLElement).removeAttribute('aria-disabled');

                });

                try { (hostEl as HTMLElement).classList.add('choices-shown'); } catch {}

                // Focus first interactive element in the new block for a11y

                const focusable = wrapper.querySelector('button.choice-link, a.choice-link[href]') as HTMLElement | null;

                if (focusable) { try { (focusable as any).focus?.({ preventScroll: true }); } catch { try { focusable.focus(); } catch {} } }

                else { wrapper.setAttribute('tabindex','-1'); try { (wrapper as any).focus?.({ preventScroll: true }); } catch { try { (wrapper as HTMLElement).focus(); } catch {} } }

                try { const x = window.scrollX, y = window.scrollY; requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(x,y))); } catch {}

              } catch (e) { console.warn('follow-up instant render failed', e); }

              try { hostEl.removeAttribute('data-followup-busy'); } catch {}

              return;

            }

            try {

              let typed = 0;

              const duration = computeDuration();

              const stepMs = Math.max(10, Math.round(duration / totalChars));

              let cancelled = false;

              // While typing, hide choices to keep strict order: 1) text, 2) choices

              wrapper.classList.add('tw-running');

              // Watchdog timings

              const watchdogMs = Math.min(14000, Math.max(2000, duration + 1500));

              // Soft watchdog that force-completes if time exceeded

              const watchdogId = window.setTimeout(() => {

                if (cancelled) return;

                try {

                  typed = totalChars;

                  wrapper.innerHTML = normalized;

                  wrapper.querySelectorAll('button.choice-link.choice-empty').forEach(el => el.classList.remove('choice-empty'));

                  wrapper.querySelectorAll('.choices, .choice-group, [data-choice-group]').forEach(el => el.classList.remove('choices-locked'));

                  wrapper.classList.remove('choices-locked');

                  wrapper.querySelectorAll('.choice-link').forEach((el: Element) => {

                    (el as HTMLElement).classList.remove('faded');

                    (el as HTMLElement).removeAttribute('disabled');

                    (el as HTMLElement).removeAttribute('aria-disabled');

                  });

                } catch {}

                wrapper.classList.remove('tw-running');

                try { (hostEl as HTMLElement).classList.add('choices-shown'); } catch {}

                try { hostEl.removeAttribute('data-followup-busy'); } catch {}

              }, watchdogMs);



              // No-progress watchdog (heartbeat)

              let lastTyped = -1;

              let stagnantMs = 0;

              const stagnantLimit = Math.min(1600, Math.max(800, Math.round(duration * 0.35)));

              let lastRenderedLen = -1;

              let lastHTML: string | null = null;

              const getRenderedLen = () => { try { return (wrapper.textContent || '').length; } catch { return -1; } };

              const heartbeat = window.setInterval(() => {

                if (cancelled) { try { window.clearInterval(heartbeat); } catch {}; return; }

                const currRendered = getRenderedLen();

                const currHTML = (() => { try { return wrapper.innerHTML; } catch { return null; } })();

                const noProgress = (typed === lastTyped && currRendered === lastRenderedLen) || (currHTML !== null && lastHTML !== null && currHTML === lastHTML);

                if (noProgress) { stagnantMs += 500; } else { lastTyped = typed; lastRenderedLen = currRendered; lastHTML = currHTML; stagnantMs = 0; }

                if (stagnantMs >= stagnantLimit) {

                  try {

                    typed = totalChars;

                    wrapper.innerHTML = normalized;

                    wrapper.querySelectorAll('button.choice-link.choice-empty').forEach(el => el.classList.remove('choice-empty'));

                    wrapper.querySelectorAll('.choices, .choice-group, [data-choice-group]').forEach(el => el.classList.remove('choices-locked'));

                    wrapper.classList.remove('choices-locked');

                    wrapper.querySelectorAll('.choice-link').forEach((el: Element) => {

                      (el as HTMLElement).classList.remove('faded');

                      (el as HTMLElement).removeAttribute('disabled');

                      (el as HTMLElement).removeAttribute('aria-disabled');

                    });

                  } catch {}

                  wrapper.classList.remove('tw-running');

                  try { window.clearTimeout(watchdogId); } catch {}

                  try { window.clearInterval(heartbeat); } catch {}

                  try { (hostEl as HTMLElement).classList.add('choices-shown'); } catch {}

                  try { hostEl.removeAttribute('data-followup-busy'); } catch {}

                }

              }, 500);



              // Post-completion verifier: if .tw-running is gone but choices are missing, restore full content

              const verifier = window.setInterval(() => {

                try {

                  if (cancelled) { window.clearInterval(verifier); return; }

                  const running = wrapper.classList.contains('tw-running');

                  if (!running) {

                    const hasChoice = !!wrapper.querySelector('button.choice-link, a.choice-link[href]');

                    if (!hasChoice && /<p\s+class=["']choice["']/.test(normalized)) {

                      wrapper.innerHTML = normalized;

                      wrapper.querySelectorAll('button.choice-link.choice-empty').forEach(el => el.classList.remove('choice-empty'));

                      wrapper.querySelectorAll('.choices, .choice-group, [data-choice-group]').forEach(el => el.classList.remove('choices-locked'));

                      wrapper.classList.remove('choices-locked');

                      wrapper.querySelectorAll('.choice-link').forEach((el: Element) => {

                        (el as HTMLElement).classList.remove('faded');

                        (el as HTMLElement).removeAttribute('disabled');

                        (el as HTMLElement).removeAttribute('aria-disabled');

                      });

                      const focusable = wrapper.querySelector('button.choice-link, a.choice-link[href]') as HTMLElement | null;

                      if (focusable) { try { (focusable as any).focus?.({ preventScroll: true }); } catch { try { focusable.focus(); } catch {} } }

                      try { const x = window.scrollX, y = window.scrollY; requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(x,y))); } catch {}

                      try { (hostEl as HTMLElement).classList.add('choices-shown'); } catch {}

                    }

                    try { hostEl.removeAttribute('data-followup-busy'); } catch {}

                    window.clearInterval(verifier);

                  }

                } catch { try { window.clearInterval(verifier); } catch {} }

              }, 600);



              // Absolute hard timeout as a final safety net (covers background tabs, throttling, etc.)

              const absoluteHardTimeout = window.setTimeout(() => {

                if (cancelled) return;

                try {

                  typed = totalChars;

                  wrapper.innerHTML = normalized;

                  wrapper.querySelectorAll('button.choice-link.choice-empty').forEach(el => el.classList.remove('choice-empty'));

                  wrapper.querySelectorAll('.choices, .choice-group, [data-choice-group]')

                    .forEach(el => el.classList.remove('choices-locked'));

                  wrapper.classList.remove('choices-locked');

                  wrapper.querySelectorAll('.choice-link').forEach((el: Element) => {

                    (el as HTMLElement).classList.remove('faded');

                    (el as HTMLElement).removeAttribute('disabled');

                    (el as HTMLElement).removeAttribute('aria-disabled');

                  });

                  wrapper.classList.remove('tw-running');

                  try { (hostEl as HTMLElement).classList.add('choices-shown'); } catch {}

                } catch {}

                try { window.clearTimeout(watchdogId); } catch {}

                try { window.clearInterval(heartbeat); } catch {}

                try { hostEl.removeAttribute('data-followup-busy'); } catch {}

              }, Math.min(20000, Math.max(5000, duration + 5000)));



              const forceComplete = () => {

                if (cancelled) return;

                try {

                  typed = totalChars;

                  wrapper.innerHTML = normalized;

                  wrapper.querySelectorAll('button.choice-link.choice-empty').forEach(el => el.classList.remove('choice-empty'));

                  wrapper.classList.remove('tw-running');

                  wrapper.classList.remove('choices-locked');

                  try { (hostEl as HTMLElement).classList.add('choices-shown'); } catch {}

                } catch {}

                try { window.clearTimeout(watchdogId); } catch {}

                try { window.clearInterval(heartbeat); } catch {}

                try { window.clearInterval(verifier); } catch {}

                try { window.clearTimeout(absoluteHardTimeout); } catch {}

                try { hostEl.removeAttribute('data-followup-busy'); } catch {}

              };



              const tick = () => {

                if (cancelled) return;

                try {

                  typed = Math.min(totalChars, typed + 1);

                  // Type only the narrative (without choices)

                  wrapper.innerHTML = renderRevealed(textOnlyNormalized, typed);

                } catch (err) {

                  // If rendering throws, do not stall: force-complete to avoid freeze

                  try { typed = totalChars; wrapper.innerHTML = normalized; } catch {}

                } finally {

                  if (typed >= totalChars) { 

                    try { window.clearTimeout(watchdogId); } catch {};

                    try { window.clearInterval(heartbeat); } catch {};

                    try { window.clearTimeout(absoluteHardTimeout); } catch {};

                    try { window.clearInterval(verifier); } catch {};

                    // Swap in full content including choices before finishing

                    try {

                      wrapper.innerHTML = normalized;

                      wrapper.querySelectorAll('button.choice-link.choice-empty').forEach(el => el.classList.remove('choice-empty'));

                      wrapper.querySelectorAll('.choices, .choice-group, [data-choice-group]')

                        .forEach(el => el.classList.remove('choices-locked'));

                      wrapper.classList.remove('choices-locked');

                      wrapper.querySelectorAll('.choice-link').forEach((el: Element) => {

                        (el as HTMLElement).classList.remove('faded');

                        (el as HTMLElement).removeAttribute('disabled');

                        (el as HTMLElement).removeAttribute('aria-disabled');

                      });

                    } catch {}

                    wrapper.classList.remove('tw-running');

                    // After completion, move focus to first interactive choice for a11y

                    try {

                      const focusable = wrapper.querySelector('button.choice-link, a.choice-link[href]') as HTMLElement | null;

                      if (focusable) { try { (focusable as any).focus?.({ preventScroll: true }); } catch { try { focusable.focus(); } catch {} } }

                      else { wrapper.setAttribute('tabindex','-1'); try { (wrapper as any).focus?.({ preventScroll: true }); } catch { try { (wrapper as HTMLElement).focus(); } catch {} } }

                      try { const x = window.scrollX, y = window.scrollY; requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo(x,y))); } catch {}

                    } catch {}

                    try { (hostEl as HTMLElement).classList.add('choices-shown'); } catch {}

                    try { hostEl.removeAttribute('data-followup-busy'); } catch {}

                    return;

                  }

                  window.setTimeout(tick, stepMs);

                }

              };

              // Start with empty narrative, choices are not part of typing

              wrapper.innerHTML = renderRevealed(textOnlyNormalized, 0);

              window.setTimeout(tick, stepMs);

              (wrapper as any).__cancelTW = () => { cancelled = true; try { window.clearTimeout(watchdogId); } catch {}; try { window.clearInterval(heartbeat); } catch {}; try { window.clearInterval(verifier); } catch {}; };

            } catch {}

          } else {

            setInfoFromHtml(section.innerHTML);

          }

        }

      } catch (e) {

        console.warn('choice navigation failed', e);

      }

    };

    host.addEventListener('click', onClick, { capture: true });

    return () => { try { host.removeEventListener('click', onClick, { capture: true } as any); } catch {} };

  }, [useReaderComponent, showHeroInfo, infoHtml, infoIsTyping, infoTotalLen, router, setInfoFromHtml, sanitizeIntroHtml, buildTextOnlyIntroHtml]);



  const revealedInfoHtml = useMemo(() => {

    if (typeof window === 'undefined') return infoHtml;

    if (useReaderComponent) return infoHtml; // not used when using component

    try {

      const container = document.createElement('div');

      container.innerHTML = revealHtmlPreserve(infoHtml, infoTypedCount);

      container.querySelectorAll('button.choice-link').forEach((btn) => {

        const t = (btn.textContent || '').replace(/\s+/g, ' ').trim();

        if (!t) btn.classList.add('choice-empty');

      });

      return container.innerHTML;

    } catch { return infoHtml; }

  }, [useReaderComponent, infoHtml, infoTypedCount]);



  useEffect(() => {

    if (useReaderComponent) return;

    if (!showHeroInfo) return;

    if (!infoIsTyping) return;

    if (infoTypedCount >= infoTotalLen) { setInfoIsTyping(false); return; }

    const speed = 3;

    const t = window.setTimeout(() => setInfoTypedCount((c) => Math.min(c + 1, infoTotalLen)), speed);

    return () => window.clearTimeout(t);

  }, [useReaderComponent, showHeroInfo, infoIsTyping, infoTypedCount, infoTotalLen]);



  // Watchdog for main info typing: force-complete if progress stalls or exceeds reasonable duration

  useEffect(() => {

    if (useReaderComponent) return;

    if (!showHeroInfo) return;

    if (!infoIsTyping) return;

    let cancelled = false;

    let last = infoTypedCount;

    let stagnantMs = 0;

    const baseDur = (() => {

      try {

        const mw = document.getElementById('manifest-container');

        if (mw) {

          const cs = getComputedStyle(mw);

          const varv = cs.getPropertyValue('--typewriter-duration').trim();

          if (varv.endsWith('ms')) return Math.min(26000, Math.max(1200, parseFloat(varv) * Math.min(4, infoTotalLen / 120)));

          if (varv.endsWith('s')) return Math.min(26000, Math.max(1200, parseFloat(varv) * 1000 * Math.min(4, infoTotalLen / 120)));

        }

      } catch {}

      return Math.min(26000, Math.max(1200, infoTotalLen * 18));

    })();

    const hardTimeout = window.setTimeout(() => {

      if (cancelled) return;

      try { setInfoTypedCount(infoTotalLen); setInfoIsTyping(false); } catch {}

    }, Math.min(32000, Math.max(2000, baseDur + 4000)));

    const heartbeat = window.setInterval(() => {

      if (cancelled) { try { window.clearInterval(heartbeat); } catch {}; return; }

      if (infoTypedCount === last) { stagnantMs += 1000; } else { last = infoTypedCount; stagnantMs = 0; }

      const stagnantLimit = Math.min(12000, Math.max(2500, Math.round(baseDur * 0.6)));

      if (stagnantMs >= stagnantLimit) {

        try { setInfoTypedCount(infoTotalLen); setInfoIsTyping(false); } catch {}

        try { window.clearInterval(heartbeat); } catch {}

        try { window.clearTimeout(hardTimeout); } catch {}

      }

    }, 1000);

    return () => { cancelled = true; try { window.clearTimeout(hardTimeout); } catch {}; try { window.clearInterval(heartbeat); } catch {}; };

  }, [useReaderComponent, showHeroInfo, infoIsTyping, infoTotalLen, infoTypedCount]);



  useEffect(() => {

    if (useReaderComponent) return;

    if (!showHeroInfo) return;

    if (infoIsTyping) return;

    setInfoChoicesShown(false);

    const id = requestAnimationFrame(() => setInfoChoicesShown(true));

    return () => cancelAnimationFrame(id);

  }, [useReaderComponent, showHeroInfo, infoIsTyping, infoHtml]);



  useEffect(() => {

    const t1 = window.setTimeout(() => setShowTitle(true), 30);

    const t2 = window.setTimeout(() => setShowManifest(true), 2500);

    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };

  }, []);



  // Detect iOS Safari and hide background video to prevent blocking play overlay

  useEffect(() => {

    try {

      const ua = navigator.userAgent || '';

      const isiOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);

      if (isiOS) setShowBgVideo(false);

    } catch {}

  }, []);



  // (video title removed)



  useEffect(() => {

    if (!showReader) { readerIntroRanRef.current = false; readerSeqRanRef.current = false; return; }

    if (readerIntroRanRef.current) return; readerIntroRanRef.current = true;

    setShowReaderDetails(false); setControlsVisible(false);

    const dialogHost = document.querySelector('#reader-dialog') as HTMLElement | null;

    if (!dialogHost) return;

    function ensureTarget(h: HTMLElement){

      let span = h.querySelector('.noising-text') as HTMLElement | null;

      if (!span) { span = document.createElement('span'); span.className = 'noising-text'; h.appendChild(span); } else { span.textContent = ''; }

      return span;

    }

    ensureTarget(dialogHost as HTMLElement);

    let cancelDialog: (() => void) | null = null;

    cancelDialog = runTypewriter({

      text: '„Vítej v SYNTHOMĚ, @&SĐYŁ !!! Tady jméno nikoho nezajímá, ale chyby? Ty jsou v paměti věčně.“',

      host: dialogHost,

      getDurationMs: () => {

        const mw = document.getElementById('manifest-container');

        if (mw) {

          const cs = getComputedStyle(mw);

          const durVar = cs.getPropertyValue('--typewriter-duration').trim();

          if (durVar.endsWith('ms')) return parseFloat(durVar) * 0.7;

          if (durVar.endsWith('s')) return parseFloat(durVar) * 1000 * 0.7;

        }

        return 5200;

      },

      onStart: () => { /* glitch efekty obstará UI */ },

      onDone: () => { setShowReaderDetails(true); }

    });

    return () => { try { if (cancelDialog) cancelDialog(); } catch {} };

  }, [showReader]);



  useEffect(() => {

    if (!showReader || !showReaderDetails) return;

    if (readerSeqRanRef.current) return; readerSeqRanRef.current = true;

    const titleHost = document.querySelector('#reader-title') as HTMLElement | null;

    const bodyHost = document.querySelector('#reader-body') as HTMLElement | null;

    if (!titleHost) return;



    let scrollRaf: number | null = null;

    const scrollTerminalBottom = () => { return; };



    function ensureTarget(h: HTMLElement){

      let span = h.querySelector('.noising-text') as HTMLElement | null;

      if (!span) { span = document.createElement('span'); span.className = 'noising-text'; (span.style as any).whiteSpace = 'pre-wrap'; (span.style as any).display = 'block'; h.appendChild(span); }

      else { (span.style as any).whiteSpace = 'pre-wrap'; (span.style as any).display = 'block'; }

      return span;

    }

    ensureTarget(titleHost as HTMLElement);

    if (bodyHost) ensureTarget(bodyHost as HTMLElement);



    const getHostText = (h: HTMLElement) => {

      const rich = h.querySelector('.rich-hidden') as HTMLElement | null;

      const normalize = (raw: string) => raw.replace(/&nbsp;|&#160;/gi, ' ').replace(/\r\n?/g, '\n');

      if (rich) {

        const clone = rich.cloneNode(true) as HTMLElement;

        clone.querySelectorAll('#story-cache, .hidden').forEach(el => el.remove());

        const html = normalize(clone.innerHTML || '');

        let text = html

          .replace(/<br\s*\/?/gi, '\n')

          .replace(/<\/(p|div|h[1-6]|li)>/gi, '</$1>\n')

          .replace(/<li[^>]*>/gi, '• ')

          .replace(/<style[\s\S]*?<\/style>/gi, '')

          .replace(/<script[\s\S]*?<\/script>/gi, '')

          .replace(/<[^>]+>/g, '')

          .replace(/[\t ]+\n/g, '\n')

          .replace(/\n{3,}/g, '\n\n')

          .trim();

        if (!text) text = normalize(clone.textContent || '').trim();

        return text;

      }

      const s = h.querySelector('.sr-only') as HTMLElement | null;

      return s ? normalize(s.textContent || '').trim() : '';

    };



    const swapInRich = (host: HTMLElement) => {

      const rich = host.querySelector('.rich-hidden') as HTMLElement | null;

      if (rich) host.innerHTML = rich.innerHTML;

    };



    let cancel1: null | (() => void) = null;

    let cancel2: null | (() => void) = null;



    cancel1 = runTypewriter({

      text: getHostText(titleHost),

      host: titleHost,

      getDurationMs: () => 1400,

      onStart: () => {},

      onDone: () => {

        setControlsVisible(true);

        swapInRich(titleHost);

        if (!bodyHost) return;

        const fullText = getHostText(bodyHost);

        let lines = fullText.split(/\n/);

        if (lines.length <= 1 && fullText.length > 300) lines = fullText.split(/\n|(?<=[\.!?…])\s+(?=[A-ZÁ-Ž0-9„(])/u);

        if (!fullText || !fullText.trim()) return;

        let container = bodyHost.querySelector('.noising-text') as HTMLElement | null;

        if (!container) { container = document.createElement('span'); container.className = 'noising-text'; bodyHost.appendChild(container); }

        (container.style as any).whiteSpace = 'pre-wrap'; (container.style as any).display = 'block';

        // Ensure CSS wrapper classes for follow-up typing flow

        try { bodyHost.classList.add('hero-followup-block'); bodyHost.classList.add('tw-running'); } catch {}

        const computeTotalDuration = () => {

          const mw = document.getElementById('manifest-container');

          if (mw) {

            const cs = getComputedStyle(mw);

            const durVar = cs.getPropertyValue('--typewriter-duration').trim();

            if (durVar.endsWith('ms')) return parseFloat(durVar) * 3.5;

            if (durVar.endsWith('s')) return parseFloat(durVar) * 1000 * 3.5;

          }

          return 24000;

        };

        const totalDuration = computeTotalDuration();

        const lengths = lines.map(l => l.length || 1);

        const totalChars = lengths.reduce((a,b)=>a+b,0) || 1;

        const cancels: (null | (()=>void))[] = [];

        let aborted = false;

        const startLine = (idx: number, onAllDone: () => void) => {

          if (aborted) return; if (idx >= lines.length) { onAllDone(); return; }

          const text = lines[idx] ?? '';

          const lineEl = document.createElement('span');

          (lineEl.style as any).whiteSpace = 'pre-wrap'; (lineEl.style as any).display = 'block';

          if (!container) { return; }

          container.appendChild(lineEl); scrollTerminalBottom();

          const share = (lengths[idx] ?? 1) / totalChars;

          let dur = Math.max(250, Math.round(totalDuration * share));

          const perChar = Math.min(5000, Math.max(250, ((text?.length ?? 0) || 1) * 22));

          dur = Math.min(dur, perChar);

          if (!text || text.trim() === '') { window.setTimeout(() => startLine(idx + 1, onAllDone), 10); return; }

          const cancel = runTypewriter({ text, host: lineEl, getDurationMs: () => dur, onStart: () => {}, onDone: () => { scrollTerminalBottom(); startLine(idx + 1, onAllDone); } });

          cancels.push(cancel);

        };

        cancel2 = () => { aborted = true; try { cancels.forEach(c => { if (c) c(); }); } catch {} };

        try { startLine(0, () => { if (!aborted) { try { bodyHost.classList.remove('tw-running'); } catch {}; scrollTerminalBottom(); } }); } catch (err) { console.error('typewriter: body sequence error', err); }

      }

    });



    return () => { try { if (cancel1) cancel1(); } catch {}; try { if (cancel2) cancel2(); } catch {}; try { bodyHost?.classList.remove('tw-running'); } catch {} };

  }, [showReader, showReaderDetails]);



  useEffect(() => {

    try {

      const a = getSharedAudio();

      audioRef.current = a;

      const compute = () => setIsAudioPlaying(() => !!a && !a.paused && !a.ended && a.currentTime > 0);

      compute();

      const onPlay = () => setIsAudioPlaying(true);

      const onPause = () => setIsAudioPlaying(false);

      const onEnded = () => setIsAudioPlaying(false);

      a.addEventListener('play', onPlay);

      a.addEventListener('pause', onPause);

      a.addEventListener('ended', onEnded);

      return () => { try { a.removeEventListener('play', onPlay); a.removeEventListener('pause', onPause); a.removeEventListener('ended', onEnded); } catch {} };

    } catch {}

  }, []);



  const handleContinue = async () => {

    try {

      const desired = '/audio/SynthBachmoff.mp3';

      const markAudioIntent = () => { writeStorage('synthoma_play_audio', '1', 'session'); };

      const playPanel = (window as any).audioPanelPlay as undefined | ((src: string) => void);



      if (typeof playPanel === 'function') {

        if (!isStartingAudioRef.current) {

          isStartingAudioRef.current = true;

          try { playPanel(desired); } catch {}

          markAudioIntent();

          setTimeout(() => { isStartingAudioRef.current = false; }, 150);

        }

      } else {

        const a = audioRef.current || getSharedAudio();

        if (a && !isStartingAudioRef.current) {

          isStartingAudioRef.current = true;

          setSharedAudioSrc(desired);

          await a.play().catch(() => {});

          markAudioIntent();

          setTimeout(() => { isStartingAudioRef.current = false; }, 150);

        }

      }

    } catch {}

    setBtnVisible(false);

    setShowHeroInfo(true);

    try { const w: any = window as any; if (w.stopShinning) w.stopShinning(); } catch {}

    // Do not auto-scroll; keep the title visible as per request

    try {

      const titleEl = document.getElementById('resizing-text');

      if (titleEl) { titleEl.setAttribute('data-keep-title', '1'); }

    } catch {}

  };



  useEffect(() => {

    if (!showTitle) return;

    const root = glitchRootRef.current as unknown as HTMLElement | null;

    if (!root) return;

    const cancel = runCinematicTitleIntro(root);

    return () => { try { cancel(); } catch {} };

  }, [showTitle]);



  const typewriterSteps = useMemo(() => String(MANIFEST.length), []);



  useEffect(() => {

    const el = document.getElementById("manifest-container");

    if (el) {

      el.style.setProperty("--typewriter-steps", typewriterSteps);

      el.style.setProperty("--typewriter-duration", "5s");

      el.style.setProperty("--caret-duration", "1.2s");

    }

  }, [typewriterSteps]);



  useEffect(() => {

    if (!showManifest) return;

    const host = document.getElementById('manifest-container') as HTMLElement | null;

    if (!host) return;

    const cancel = runTypewriter({

      text: MANIFEST,

      host,

      getDurationMs: () => {

        const cs = getComputedStyle(host);

        const durVar = cs.getPropertyValue('--typewriter-duration').trim();

        if (durVar.endsWith('ms')) return parseFloat(durVar);

        if (durVar.endsWith('s')) return parseFloat(durVar) * 1000;

        return 5000;

      },

      onStart: () => setTypedDone(false),

      onDone: () => { setTypedDone(true); manifestCancelRef.current = null; },

    });

    manifestCancelRef.current = cancel;

    return () => { try { cancel(); } catch {}; manifestCancelRef.current = null; };

  }, [showManifest]);



  // Click-to-skip: klik na manifest oblast dokončí typewriter okamžitě

  const handleManifestSkip = useCallback(() => {

    if (typedDone) return;

    try {

      if (manifestCancelRef.current) { manifestCancelRef.current(); manifestCancelRef.current = null; }

      const host = document.getElementById('manifest-container') as HTMLElement | null;

      if (host) {

        const target = host.querySelector('.noising-text') as HTMLElement | null;

        if (target) { target.textContent = MANIFEST; }

      }

      setTypedDone(true);

    } catch {}

  }, [typedDone]);



  // Stabilizace scrollu pro manifest typewriter – žádné poskakování obrázku

  useEffect(() => {

    const host = document.getElementById('manifest-container') as HTMLElement | null;

    if (!host) return;

    let lastUserScroll = Date.now();

    const onScroll = () => { lastUserScroll = Date.now(); };

    window.addEventListener('scroll', onScroll, { passive: true });

    const restore = () => {

      try {

        const x = window.scrollX, y = window.scrollY;

        requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(x, y)));

      } catch {}

    };

    const mo = new MutationObserver((muts) => {

      try {

        const meaningful = muts.some(m => m.type === 'childList' || m.type === 'characterData');

        if (!meaningful) return;

        if (Date.now() - lastUserScroll < 120) return;

        restore();

      } catch {}

    });

    mo.observe(host, { subtree: true, childList: true, characterData: true });

    return () => { try { mo.disconnect(); } catch {}; window.removeEventListener('scroll', onScroll as any); };

  }, [showManifest]);



  // Disable any random shining effect on the manifest after typing completes

  useEffect(() => {

    // intentionally no-op per request to remove random effects

  }, [typedDone]);



  useEffect(() => {

    if (typedDone) {

      const id = window.requestAnimationFrame(() => setBtnVisible(true));

      return () => window.cancelAnimationFrame(id);

    } else {

      setBtnVisible(false);

    }

  }, [typedDone]);



  useEffect(() => {

    const prefersReduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const root = glitchRootRef.current as HTMLElement | null;

    if (!root) return;

    // Match HomePage settings 1:1

    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });

    return () => { try { detach(); } catch {} };

  }, []);



  return (

    <div className={"glitch-bg landing-intro-page"}>

      {/* Background video layer (disabled on iOS) */}

      {showBgVideo ? (

        <div aria-hidden className="video-background">

          <video

            src="/video/SYNTHOMA1.webm"

            autoPlay

            loop

            muted

            playsInline

            className={`active ${styles.videoNoPointer}`.trim()}

            controls={false}

            preload="auto"

          />

        </div>

      ) : null}

      <main className="home" role="main">

      <section className="hero-intro" aria-label="SYNTHOMA Intro">

        <h1 id="glitch-synthoma" className={`glitch-master`} ref={glitchRootRef as any} aria-label={TITLE}>

          <span className="glitch-fake1" aria-hidden="true">{TITLE}</span>

          <span className="glitch-fake2" aria-hidden="true">{TITLE}</span>

          <span className="glitch-real" aria-hidden="true">

            {TITLE.split("").map((ch, idx) => (

              <span key={idx} className="glitch-char">{ch}</span>

            ))}

          </span>

          <span className="sr-only">{TITLE}</span>

        </h1>



        <div

          className={`manifest-wrapper ${typedDone ? 'has-cta' : 'manifest-skippable'}`.trim()}

          onClick={handleManifestSkip}

          role="button"

          tabIndex={typedDone ? -1 : 0}

          aria-label={typedDone ? undefined : "Přeskočit animaci"}

          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleManifestSkip(); } }}

        >

          <p className="manifest typewriter" id="manifest-container" aria-live="polite" aria-atomic>

            <span className="noising-text" aria-hidden="true"></span>

            <span className="sr-only">{MANIFEST}</span>

          </p>

        </div>

        {typedDone && !showReader && !showHeroInfo ? (

          <div className="hero-cta">

            <button

              className={`glitch-button btn btn-lg appear ${btnVisible ? 'visible' : ''}`.trim()}

              onClick={handleContinue}

              aria-label={BTN_LABEL}

              ref={btnGlitchRef}

              data-busy={isStartingAudioRef.current ? 'true' : undefined}

            >

              <span className="glitch-fake1"></span>

              <span className="glitch-fake2"></span>

              <span className="glitch-real" aria-hidden="true">

                {BTN_LABEL.split("").map((ch, idx) => (

                  <span key={idx} className="glitch-char">{ch}</span>

                ))}

              </span>

              <span className="sr-only">{BTN_LABEL}</span>

            </button>

          </div>

        ) : null}



        {showHeroInfo ? (

          <section className="intro-log" aria-live="polite">

            <TypewriterReader

              srcUrl="/data/SYNTHOMAINFO.html"

              ariaLabel="Intro info"

              autoStart

              className="readerOverlay-35 readerOverlay-blur"

              id="hero-info"

            />

            <nav className="intro-nav-choices" aria-label="Pokračovat">

              <a href="/reader?u=%2Fbooks%2FSYNTHOMA-NULL%2F0-0%20%5BNULL%5D.html" className="intro-nav-link intro-nav-primary">Začít číst</a>

              <a href="/books" className="intro-nav-link">Otevřít knihovnu</a>

              {typeof window !== 'undefined' && readLastChapterPath() ? (

                <a href={`/reader?u=${encodeURIComponent(readLastChapterPath())}`} className="intro-nav-link intro-nav-continue">Pokračovat tam, kde jsem skončil</a>

              ) : null}

            </nav>

          </section>

        ) : null}



        

      </section>

    </main>

    </div>

  );

}

