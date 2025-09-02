"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { runCinematicTitleIntro } from "../../src/lib/cinematicTitle";
import { getSharedAudio } from "../../src/lib/audio";
import { runTypewriter, typeExternalInfo, typeBooksList } from "../../src/lib/typewriter";
import { attachGlitchHeading } from "../../src/lib/glitchHeading";
import styles from "./styles.module.css";

const TITLE = "SYNTHOMA";
const MANIFEST = "Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.";
const BTN_LABEL = "Pokračovat";

export default function LandingIntroPage() {
  const router = useRouter();
  const [showTitle, setShowTitle] = useState(false);
  const [useVideoTitle, setUseVideoTitle] = useState(false);
  // removed unused videoReady state
  const titleVideoRef = useRef<HTMLVideoElement | null>(null);
  const [showPlayOverlay, setShowPlayOverlay] = useState(false);
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
  const [infoHtml, setInfoHtml] = useState<string>("");
  const [infoPlain, setInfoPlain] = useState<string>("");
  const [infoTypedCount, setInfoTypedCount] = useState(0);
  const [infoIsTyping, setInfoIsTyping] = useState(false);
  const [infoChoicesShown, setInfoChoicesShown] = useState(false);
  const [infoTotalLen, setInfoTotalLen] = useState(0);
  const infoFullHtmlRef = useRef<string>("");

  const transformChoicesToButtons = useCallback((html: string): string => {
    try {
      const root = document.createElement('div');
      root.innerHTML = html;
      const nodes = Array.from(root.querySelectorAll('p.choice')) as HTMLElement[];
      nodes.forEach((p) => {
        const existingAnchor = p.querySelector('a.choice-link[href]');
        if (existingAnchor) { return; }
        const next = p.getAttribute('data-next') || '';
        const ui = p.getAttribute('data-ui') || '';
        // Insert button INSIDE the existing <p class="choice"> to preserve block layout
        const btn = document.createElement('button');
        btn.className = 'choice-link';
        if (next) btn.setAttribute('data-next', next);
        if (ui) btn.setAttribute('data-ui', ui);
        btn.type = 'button';
        btn.innerHTML = p.innerHTML;
        // Clear the paragraph and append the button as its only child
        p.innerHTML = '';
        p.appendChild(btn);
      });
      return root.innerHTML;
    } catch { return html; }
  }, []);
  const setInfoFromHtml = useCallback((html: string) => {
    const normalized = transformChoicesToButtons(html);
    setInfoHtml(normalized);
    try {
      const d = document.createElement('div');
      d.innerHTML = normalized;
      d.querySelectorAll('#story-cache, .hidden').forEach(el => el.remove());
      const plain = (d.textContent || '');
      setInfoPlain(plain);
      let total = 0;
      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) { total += (node.nodeValue || '').length; return; }
        const kids = node.childNodes;
        for (const child of Array.from(kids)) {
          walk(child as Node);
        }
      };
      walk(d);
      setInfoTotalLen(total);
    } catch {
      setInfoPlain('');
      setInfoTotalLen(0);
    }
    setInfoTypedCount(0);
    setInfoIsTyping(true);
  }, [transformChoicesToButtons]);

  // removed unused debug click handlers

  useEffect(() => {
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
  }, [showHeroInfo, setInfoFromHtml]);

  useEffect(() => {
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
          ev.preventDefault(); ev.stopPropagation();
          if (infoIsTyping) { try { setInfoIsTyping(false); setInfoTypedCount(infoTotalLen); } catch {} }
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
            let group: HTMLElement = hostEl;
            {
              let node: HTMLElement | null = p.parentElement as HTMLElement | null;
              while (node && node !== hostEl) {
                const list = Array.from(node.querySelectorAll('button.choice-link')) as HTMLButtonElement[];
                if (list.length > 1 && list.includes(p as HTMLButtonElement)) { group = node; break; }
                node = node.parentElement as HTMLElement | null;
              }
            }
            const btns = Array.from(group.querySelectorAll('button.choice-link')) as HTMLButtonElement[];
            btns.forEach((btn) => {
              if (btn === p) { btn.classList.add('chosen'); } else { btn.classList.add('faded'); }
              btn.disabled = true; btn.setAttribute('aria-disabled', 'true');
            });
            group.classList.add('choices-locked');
            let follow = document.getElementById('hero-info-followup');
            if (!follow) { follow = document.createElement('div'); follow.id = 'hero-info-followup'; hostEl.appendChild(follow); }
            const normalized = transformChoicesToButtons(section.innerHTML);
            const wrapper = document.createElement('div');
            wrapper.className = 'hero-followup-block';
            follow.appendChild(wrapper);

            const tmp = document.createElement('div');
            tmp.innerHTML = normalized;
            tmp.querySelectorAll('#story-cache, .hidden').forEach(el => el.remove());
            let plain = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
            if (!plain) plain = normalized.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

            const totalChars = Math.max(1, plain.length);
            const computeDuration = () => {
              const mw = document.getElementById('manifest-container');
              if (mw) {
                const cs = getComputedStyle(mw);
                const durVar = cs.getPropertyValue('--typewriter-duration').trim();
                if (durVar.endsWith('ms')) return Math.min(26000, Math.max(1200, parseFloat(durVar) * Math.min(4, totalChars / 80)));
                if (durVar.endsWith('s')) return Math.min(26000, Math.max(1200, parseFloat(durVar) * 1000 * Math.min(4, totalChars / 80)));
              }
              return Math.min(26000, Math.max(1200, totalChars * 28));
            };

            const renderRevealed = (srcHtml: string, count: number): string => {
              try {
                const container = document.createElement('div');
                container.innerHTML = srcHtml;
                container.querySelectorAll('#story-cache, .hidden').forEach(el => el.remove());
                let remaining = count;
                const stripNode = (node: Node) => { if (node.nodeType === Node.TEXT_NODE) { (node as Text).nodeValue = ''; return; } const el = node as Element; while (el.firstChild) el.removeChild(el.firstChild); };
                const processNode = (node: Node) => {
                  if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.nodeValue || '';
                    const len = text.length;
                    if (remaining >= len) { remaining -= len; }
                    else { node.nodeValue = text.slice(0, Math.max(0, remaining)); remaining = 0; }
                    return;
                  }
                  const kids = node.childNodes;
                  for (const child of kids) {
                    if (remaining > 0) { processNode(child); continue; }
                    stripNode(child);
                  }
                };
                const nodes = Array.from(container.childNodes);
                for (const node of nodes) {
                  processNode(node);
                }
                container.querySelectorAll('button.choice-link').forEach((btn) => {
                  const t = (btn.textContent || '').replace(/\s+/g, ' ').trim();
                  if (!t) btn.classList.add('choice-empty');
                });
                return container.innerHTML;
              } catch { return srcHtml; }
            };

            try {
              let typed = 0;
              const duration = computeDuration();
              const stepMs = Math.max(10, Math.round(duration / totalChars));
              let cancelled = false;
              const tick = () => {
                if (cancelled) return;
                typed = Math.min(totalChars, typed + 1);
                wrapper.innerHTML = renderRevealed(normalized, typed);
                if (typed >= totalChars) return; else window.setTimeout(tick, stepMs);
              };
              wrapper.innerHTML = renderRevealed(normalized, 0);
              window.setTimeout(tick, stepMs);
              (wrapper as any).__cancelTW = () => { cancelled = true; };
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
  }, [showHeroInfo, infoHtml, infoIsTyping, infoPlain, infoTotalLen, router, setInfoFromHtml, transformChoicesToButtons]);

  const revealedInfoHtml = useMemo(() => {
    if (typeof window === 'undefined') return infoHtml;
    try {
      const container = document.createElement('div');
      container.innerHTML = infoHtml;
      container.querySelectorAll('#story-cache, .hidden').forEach(el => el.remove());
      let remaining = infoTypedCount;
      const stripNode = (node: Node) => { if (node.nodeType === Node.TEXT_NODE) { (node as Text).nodeValue = ''; return; } const el = node as Element; while (el.firstChild) el.removeChild(el.firstChild); };
      const processNode = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue || '';
          const len = text.length;
          if (remaining >= len) { remaining -= len; }
          else { node.nodeValue = text.slice(0, Math.max(0, remaining)); remaining = 0; }
          return;
        }
        const children = Array.from(node.childNodes);
        for (const child of children) {
          if (remaining > 0) { processNode(child); continue; }
          stripNode(child);
        }
      };
      Array.from(container.childNodes).forEach(processNode);
      container.querySelectorAll('button.choice-link').forEach((btn) => {
        const t = (btn.textContent || '').replace(/\s+/g, ' ').trim();
        if (!t) btn.classList.add('choice-empty');
      });
      return container.innerHTML;
    } catch { return infoHtml; }
  }, [infoHtml, infoTypedCount]);

  useEffect(() => {
    if (!showHeroInfo) return;
    if (!infoIsTyping) return;
    if (infoTypedCount >= infoTotalLen) { setInfoIsTyping(false); return; }
    const speed = 3;
    const t = window.setTimeout(() => setInfoTypedCount((c) => Math.min(c + 1, infoTotalLen)), speed);
    return () => window.clearTimeout(t);
  }, [showHeroInfo, infoIsTyping, infoTypedCount, infoTotalLen]);

  useEffect(() => {
    if (!showHeroInfo) return;
    if (infoIsTyping) return;
    setInfoChoicesShown(false);
    const id = requestAnimationFrame(() => setInfoChoicesShown(true));
    return () => cancelAnimationFrame(id);
  }, [showHeroInfo, infoIsTyping, infoHtml]);

  useEffect(() => {
    const t1 = window.setTimeout(() => setShowTitle(true), 30);
    const t2 = window.setTimeout(() => setShowManifest(true), 4100);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, []);

  // Prefer video title on iOS if asset exists; otherwise keep current animated title
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1);
    if (!isIOS) { setUseVideoTitle(false); return; }
    let cancelled = false;
    (async () => {
      // Try WebM first, then MP4
      const candidates = [
        '/video/SYNTHOMA_TITLE.webm',
        '/video/SYNTHOMA_TITLE.mp4'
      ];
      for (const url of candidates) {
        try {
          const res = await fetch(url, { method: 'HEAD' as any, cache: 'no-store' });
          if (cancelled) return;
          if (res.ok) { setUseVideoTitle(true); setShowPlayOverlay(true); return; }
        } catch {}
      }
      if (!cancelled) { setUseVideoTitle(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const handlePlayTitleVideo = async () => {
    try {
      const v = titleVideoRef.current;
      if (!v) return;
      setShowPlayOverlay(false);
      await v.play().catch(() => {});
    } catch {}
  };

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
        try { startLine(0, () => { if (!aborted) scrollTerminalBottom(); }); } catch (err) { console.error('typewriter: body sequence error', err); }
      }
    });

    return () => { try { if (cancel1) cancel1(); } catch {}; try { if (cancel2) cancel2(); } catch {} };
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
      const ensure = (window as any).audioPanelEnsurePlaying as undefined | (() => void);
      if (typeof ensure === 'function') {
        if (!isStartingAudioRef.current) { isStartingAudioRef.current = true; ensure(); sessionStorage.setItem('synthoma_play_audio', '1'); setTimeout(() => { isStartingAudioRef.current = false; }, 150); }
      } else {
        const a = audioRef.current || getSharedAudio();
        if (a && (a.paused || a.ended || a.currentTime === 0)) {
          if (!isStartingAudioRef.current) { isStartingAudioRef.current = true; await a.play().catch(() => {}); sessionStorage.setItem('synthoma_play_audio', '1'); setTimeout(() => { isStartingAudioRef.current = false; }, 150); }
        }
      }
    } catch {}
    setBtnVisible(false);
    setShowHeroInfo(true);
    try { const w: any = window as any; if (w.stopShinning) w.stopShinning(); } catch {}
    try { setTimeout(() => { const el = document.getElementById('hero-info'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 40); } catch {}
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
      el.style.setProperty("--typewriter-duration", "7.2s");
      el.style.setProperty("--caret-duration", "1.4s");
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
        return 7200;
      },
      onStart: () => setTypedDone(false),
      onDone: () => setTypedDone(true),
    });
    return () => { try { cancel(); } catch {} };
  }, [showManifest]);

  useEffect(() => {
    if (!typedDone) return;
    if (document.body?.classList.contains('no-animations')) return;
    let tries = 0;
    const startNow = () => { try { const w: any = window as any; if (typeof w.startShinning === 'function') w.startShinning(); } catch {} };
    const id = window.setInterval(() => {
      tries++;
      const w: any = window as any;
      if (typeof w.startShinning === 'function') { startNow(); window.clearInterval(id); }
      if (tries > 40) { window.clearInterval(id); }
    }, 50);
    return () => { window.clearInterval(id); };
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
    const detach = attachGlitchHeading(root, TITLE, { intervalMs: 260, chance: 0.08 });
    return () => { try { detach(); } catch {} };
  }, []);

  return (
    <main className="home" role="main">
      <section className="hero-intro" aria-label="SYNTHOMA Intro">
        <div id="resizing-text" className={`intro-title ${showTitle ? "visible" : ""}`.trim()}>
          {useVideoTitle ? (
            <div className={styles.titleVideoBox} aria-label={TITLE} role="region">
              {/* Attempt WEBM then MP4 */}
              <video
                ref={titleVideoRef}
                className={styles.titleVideo}
                playsInline
                preload="auto"
                controls={false}
                onPlay={() => setShowPlayOverlay(false)}
                onEnded={() => setShowPlayOverlay(true)}
                aria-label="Přehrát titul SYNTHOMA"
              >
                <source src="/video/SYNTHOMA_TITLE.webm" type="video/webm" />
                <source src="/video/SYNTHOMA_TITLE.mp4" type="video/mp4" />
              </video>
              <button
                type="button"
                className={`${styles.titleVideoPlay} ${showPlayOverlay ? styles.visible : ''}`.trim()}
                onClick={handlePlayTitleVideo}
                aria-label="Přehrát"
              >
                ▶
              </button>
            </div>
          ) : (
            <h1 id="glitch-synthoma" className="glitch-master" ref={glitchRootRef as any} aria-label={TITLE}>
              <span className="glitch-fake1">{TITLE}</span>
              <span className="glitch-fake2">{TITLE}</span>
              <span className="glitch-real" aria-hidden="true">
                {TITLE.split("").map((ch, idx) => (
                  <span key={idx} className="glitch-char">{ch}</span>
                ))}
              </span>
              <span className="sr-only">{TITLE}</span>
            </h1>
          )}
        </div>

        <div className={`manifest-wrapper ${typedDone ? 'has-cta' : ''}`.trim()}>
          <p className="manifest typewriter shinning" id="manifest-container" aria-live="polite" aria-atomic>
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
            <div
              id="hero-info"
              className={`SYNTHOMAREADER glass ${infoIsTyping ? 'typing' : ''} ${infoChoicesShown ? 'choices-shown' : ''}`.trim()}
            >
              <div className="chapter-content">
                <div dangerouslySetInnerHTML={{ __html: revealedInfoHtml }} />
              </div>
            </div>
          </section>
        ) : null}

        
      </section>
    </main>
  );
}
