"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// Next.js Reader page that loads HTML chapters from public/books via ?u=... and maps choices to MBTI
// Example: /reader?u=/books/SYNTHOMA-NULL/0-%E2%88%9E%20%5BRESTART%5D.html

interface ChoiceItem {
  text: string;
  tags: string[]; // e.g. ["E","I"]
}

interface BlockText { type: "text"; tag: string; html: string; }
interface BlockChoices { type: "choices"; items: ChoiceItem[]; }

type Block = BlockText | BlockChoices;

type Scores = { I: number; E: number; N: number; S: number; F: number; T: number; J: number; P: number };

export default function ReaderPage() {
  const params = useSearchParams();
  const defaultUrl = "/books/SYNTHOMA-NULL/0-∞ [RESTART].html";
  const effectiveUrl = params?.get("u") || defaultUrl;

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [i, setI] = useState(0);
  const [scores, setScores] = useState<Scores>({ I: 0, E: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 });
  const [ttsOn, setTtsOn] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const ttsIndexRef = useRef<number>(0);
  const ttsSpeakingRef = useRef<boolean>(false);
  // Per-chapter media
  const [chapterVideo, setChapterVideo] = useState<string | undefined>(undefined);
  const [chapterAudio, setChapterAudio] = useState<string | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Navigation to next chapter
  const [nextHref, setNextHref] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window !== "undefined") synthRef.current = window.speechSynthesis;
  }, []);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch(encodeURI(effectiveUrl));
        const txt = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(txt, "text/html");
        const out: Block[] = [];
        let choiceRun: ChoiceItem[] = [];
        const pushChoices = () => { if (choiceRun.length) { out.push({ type: "choices", items: choiceRun }); choiceRun = []; } };

        const nodes = Array.from(doc.body.querySelectorAll("p, h1, h2, h3, h4, h5, h6"));
        for (const el of nodes) {
          const tag = el.tagName.toLowerCase();
          if (el.classList.contains("choice")) {
            const tags = (el.getAttribute("data-tags") || "").split(/[ ,;]+/).filter(Boolean);
            const text = el.textContent?.trim() || "Volba";
            choiceRun.push({ text, tags });
          } else {
            pushChoices();
            out.push({ type: "text", tag, html: el.outerHTML });
          }
        }
        pushChoices();
        if (!canceled) {
          setBlocks(out);
          setI(0);
          setScores({ I:0,E:0,N:0,S:0,F:0,T:0,J:0,P:0 });
        }
      } catch (e) {
        console.error("Reader load failed", e);
      }
    })();
    return () => { canceled = true; stopTTS(); };
  }, [effectiveUrl]);

  // Coordinate with global audio: pause it when chapter has its own audio; resume otherwise
  useEffect(() => {
    const globalAudio: HTMLAudioElement | undefined = (typeof window !== 'undefined') ? (window as any).__synthomaAudio : undefined;
    const ensureGlobal = (typeof window !== 'undefined') ? (window as any).audioPanelEnsurePlaying as (() => void) | undefined : undefined;
    let pausedGlobalByUs = false;
    try {
      if (chapterAudio) {
        if (globalAudio && !globalAudio.paused) {
          globalAudio.pause();
          pausedGlobalByUs = true;
        }
      } else {
        // No chapter audio – ensure global keeps playing
        ensureGlobal?.();
      }
    } catch {}
    return () => {
      try {
        // When leaving or switching away from chapter with its own audio, resume global
        if (pausedGlobalByUs) ensureGlobal?.();
      } catch {}
    };
  }, [chapterAudio]);

  // Determine next chapter URL from manifest
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/books/manifest.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`manifest ${res.status}`);
        const man = await res.json();
        const cur = decodeURI(effectiveUrl);
        const all: { path: string }[] = [];
        (man?.collections || []).forEach((col: any) => {
          (col?.chapters || []).forEach((ch: any) => all.push({ path: ch.path }));
        });
        const idx = all.findIndex((c) => decodeURI(c.path) === cur || c.path === effectiveUrl || encodeURI(c.path) === effectiveUrl);
        const next = idx >= 0 && idx + 1 < all.length ? all[idx + 1].path : undefined;
        if (!cancelled) setNextHref(next ? `/reader?u=${encodeURIComponent(next)}` : undefined);
      } catch {
        if (!cancelled) setNextHref(undefined);
      }
    })();
    return () => { cancelled = true; };
  }, [effectiveUrl]);

  // Load per-chapter media mapping
  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/chapters-media.json");
        if (!res.ok) throw new Error(`media config ${res.status}`);
        const cfg = await res.json();
        // effectiveUrl may be encoded; normalize both sides
        const key = decodeURI(effectiveUrl);
        const entry = cfg[key] || cfg[encodeURI(key)] || cfg[effectiveUrl];
        setChapterVideo(entry?.video);
        setChapterAudio(entry?.audio);
      } catch (err) {
        // no media config? fine, just clear sources
        setChapterVideo(undefined);
        setChapterAudio(undefined);
      }
    })();
    return () => { canceled = true; };
  }, [effectiveUrl]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") { if (blocks[i] && blocks[i].type !== "choices") go(+1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [blocks, i]);

  // Nespouštěj TTS při změně i – pouze při toggle nebo po volbě
  useEffect(() => {
    if (!ttsOn) return;
    // nastav start na nejbližší textový blok od aktuálního i
    let idx = i;
    while (idx < blocks.length && blocks[idx]?.type !== "text") idx++;
    ttsIndexRef.current = idx;
    speakTTS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ttsOn]);

  // Listen for global TTS toggle from ControlPanel
  useEffect(() => {
    const onToggle = () => setTtsOn((v) => {
      const nv = !v;
      if (!nv) { stopTTS(); }
      return nv;
    });
    document.addEventListener('synthoma:tts-toggle', onToggle as EventListener);
    return () => document.removeEventListener('synthoma:tts-toggle', onToggle as EventListener);
  }, [i, blocks]);

  function go(delta: number) { setI((prev) => Math.max(0, Math.min(prev + delta, blocks.length - 1))); }

  function stopTTS() {
    try { synthRef.current?.cancel(); } catch {/* ignore */}
    ttsSpeakingRef.current = false;
  }

  function speakTTS() {
    try {
      const synth = synthRef.current;
      if (!synth || !ttsOn || ttsSpeakingRef.current) return;
      const speakNext = () => {
        if (!ttsOn) { ttsSpeakingRef.current = false; return; }
        let idx = ttsIndexRef.current;
        const b = blocks[idx];
        if (!b || b.type !== "text") { ttsSpeakingRef.current = false; return; }
        const tmp = document.createElement("div");
        tmp.innerHTML = (b as BlockText).html;
        const utter = new SpeechSynthesisUtterance(tmp.textContent || "");
        utter.lang = "cs-CZ";
        utter.rate = 1.05; // nezávislé na typewriteru
        utter.onend = () => {
          // po dočtení přejdi na další textový blok, ale NEHÝBEJ UI (žádné go(+1))
          let next = idx + 1;
          while (next < blocks.length && blocks[next]?.type !== "text") next++;
          if (ttsOn && next < blocks.length && blocks[next]?.type === "text") {
            ttsIndexRef.current = next;
            speakNext();
          } else {
            ttsSpeakingRef.current = false;
          }
        };
        try { synth.cancel(); } catch {}
        ttsSpeakingRef.current = true;
        synth.speak(utter);
      };
      speakNext();
    } catch {/* ignore */}
  }

  function onPick(it: ChoiceItem, blockIdx: number) {
    const ns: Scores = { ...scores };
    if (it.tags?.length) {
      const primary = it.tags[0]?.toUpperCase();
      if (primary && ns.hasOwnProperty(primary as keyof Scores)) {
        (ns as any)[primary] = (ns as any)[primary] + 1;
      }
    }
    setScores(ns);
    // Uživatel zvolil – utneme TTS a přesuneme UI, pak případně znovu spustíme od nové pozice
    go(+1);
    if (ttsOn) {
      stopTTS();
      // nastav TTS start na nejbližší text od nového i
      let idx = i + 1;
      while (idx < blocks.length && blocks[idx]?.type !== "text") idx++;
      ttsIndexRef.current = idx;
      speakTTS();
    }
    // Pokud je to poslední blok voleb v kapitole, pokračuj do další kapitoly
    try {
      const lastChoicesIndex = (() => {
        let last = -1;
        for (let k = 0; k < blocks.length; k++) if (blocks[k]?.type === 'choices') last = k;
        return last;
      })();
      if (blockIdx === lastChoicesIndex && nextHref) {
        // malá prodleva pro vizuální potvrzení a aby se nezacyklilo auto-advance
        setTimeout(() => { window.location.href = nextHref; }, 120);
      }
    } catch { /* ignore */ }
  }

  const type = useMemo(() => {
    const s = scores;
    return `${s.I >= s.E ? "I" : "E"}${s.N >= s.S ? "N" : "S"}${s.F >= s.T ? "F" : "T"}${s.J >= s.P ? "J" : "P"}`;
  }, [scores]);

  const done = i >= blocks.length - 1;

  // Show cumulative text from last choice up to current position.
  const segmentStart = useMemo(() => {
    let lastChoice = -1;
    for (let k = 0; k <= i; k++) {
      if (blocks[k]?.type === "choices") lastChoice = k;
    }
    return lastChoice + 1;
  }, [blocks, i]);

  // We render a single continuously growing page: all previous blocks stay visible.
  // Determine which text block is the last one to type (only if current block is text).
  const allTextIndicesUpTo = useMemo(() => {
    const upto = blocks[i]?.type === "text" ? i : i - 1;
    const acc: number[] = [];
    for (let k = 0; k <= upto; k++) if (blocks[k]?.type === "text") acc.push(k);
    return acc;
  }, [blocks, i]);

  const typingIndex = useMemo(() => (blocks[i]?.type === "text" && allTextIndicesUpTo.length ? allTextIndicesUpTo[allTextIndicesUpTo.length - 1] : undefined), [blocks, i, allTextIndicesUpTo]);
  const prevTextIndices = useMemo(() => (typingIndex !== undefined ? allTextIndicesUpTo.filter((k) => k !== typingIndex) : allTextIndicesUpTo), [allTextIndicesUpTo, typingIndex]);

  // --- Typewriter logic for the last text block only ---
  const typingHtml = useMemo(() => (typingIndex !== undefined ? (blocks[typingIndex] as BlockText).html : ""), [typingIndex, blocks]);
  const typingPlain = useMemo(() => {
    if (typeof window === "undefined") return "";
    const d = document.createElement("div");
    d.innerHTML = typingHtml;
    return (d.textContent || "").replace(/\s+/g, " ").trim();
  }, [typingHtml]);

  // States used for progressive reveal and UI
  const [typedCount, setTypedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [choicesShown, setChoicesShown] = useState(false);
  const [pickedByBlock, setPickedByBlock] = useState<Record<number, number>>({});

  // Build progressively revealed HTML that preserves original tags/classes (e.g., alarm-emote)
  const revealedTypingHtml = useMemo(() => {
    if (typeof window === "undefined") return typingHtml;
    try {
      const container = document.createElement('div');
      container.innerHTML = typingHtml;
      let remaining = typedCount;

      const stripNode = (node: Node): void => {
        // Keep the element in DOM to preserve classes/animations, but clear its content
        if (node.nodeType === Node.TEXT_NODE) {
          (node as Text).nodeValue = "";
          return;
        }
        const el = node as Element;
        // remove all children but keep element shell
        while (el.firstChild) el.removeChild(el.firstChild);
      };

      const processNode = (node: Node): void => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue || "";
          const len = text.length;
          if (remaining >= len) {
            remaining -= len;
          } else {
            node.nodeValue = text.slice(0, Math.max(0, remaining));
            remaining = 0;
          }
          return;
        }
        // Element node: iterate its children and prune after remaining hits 0
        const children = Array.from(node.childNodes);
        for (let idx = 0; idx < children.length; idx++) {
          const child = children[idx];
          if (remaining > 0) {
            processNode(child);
            continue;
          }
          // Remaining is 0: preserve element shells (and their classes), but empty their contents
          stripNode(child);
        }
      };

      const roots = Array.from(container.childNodes);
      for (const r of roots) processNode(r);
      return container.innerHTML;
    } catch {
      return typingHtml;
    }
  }, [typingHtml, typedCount]);

  // Reset typing when segment changes (i or textRange)
  useEffect(() => {
    setTypedCount(0);
    setIsTyping(true);
    setChoicesShown(false);
  }, [i, typingHtml]);

  useEffect(() => {
    if (!isTyping) return;
    if (typedCount >= typingPlain.length) {
      setIsTyping(false);
      return;
    }
    const speed = 3; // výrazně rychleji (ms/znak)
    const t = setTimeout(() => setTypedCount((c) => Math.min(c + 1, typingPlain.length)), speed);
    return () => clearTimeout(t);
  }, [typedCount, isTyping, typingPlain.length]);

  // Staggered fade-in for choices once typing finishes on a choices step
  useEffect(() => {
    if (!isTyping && blocks[i]?.type === "choices") {
      setChoicesShown(false);
      const id = requestAnimationFrame(() => setChoicesShown(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isTyping, i, blocks]);

  // Auto-advance through consecutive text blocks until a choices block
  useEffect(() => {
    if (!isTyping && blocks[i]?.type === "text") {
      const next = blocks[i + 1];
      if (next && next.type === "text") {
        const t = setTimeout(() => {
          go(+1);
        }, 60);
        return () => clearTimeout(t);
      }
    }
  }, [isTyping, i, blocks]);

  // Auto-scroll disabled: typewriter nesmí hýbat obrazovkou
  // useEffect(() => {
  //   if (typeof window === 'undefined') return;
  //   const nearBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 80);
  //   if (!nearBottom) return;
  //   const raf = requestAnimationFrame(() => {
  //     window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  //   });
  //   return () => cancelAnimationFrame(raf);
  // }, [typedCount, i, choicesShown]);

  return (
    <div
      className="SYNTHOMAREADER glass chapter-loaded allow-alarm glitch-bg"
      onClick={() => {
        const cur = blocks[i];
        if (isTyping) {
          // fast-forward typing
          setTypedCount(typingPlain.length);
          setIsTyping(false);
          return;
        }
        if (cur?.type === "text") {
          go(+1);
        }
        // When choices are shown, clicking outside does nothing (must pick).
        // Attempt to start media on first user gesture (autoplay policies)
        try {
          if (videoRef.current) videoRef.current.play().catch(() => {});
          if (audioRef.current) audioRef.current.play().catch(() => {});
        } catch {}
      }}
    >
      <h1 className="title">SYNTHOMA: Čtečka</h1>
      <div className="log">Soubor: <code>{effectiveUrl}</code></div>

      {/* Control Panel je nyní globálně v layoutu */}

      {blocks.length === 0 ? (
        <div className="loading-chapter"><p>Načítám kapitolu… dej kafe stroji. ☕</p></div>
      ) : (
        <div id="reader-body">
          {/* Background media layer */}
          {(chapterVideo || chapterAudio) && (
            <div className="chapter-media" aria-hidden>
              {chapterVideo && (
                <video
                  ref={videoRef}
                  className="chapter-bg-video themed-video"
                  src={chapterVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              )}
              {chapterAudio && (
                <audio
                  ref={audioRef}
                  className="chapter-bg-audio"
                  src={chapterAudio}
                  autoPlay
                  loop
                />
              )}
            </div>
          )}
          <div className="chapter-content">
            {/* Render everything from the beginning up to current index i */}
            {blocks.map((b, idx) => {
              if (idx > i) return null;
              if (b.type === "text") {
                if (idx === typingIndex) {
                  // Při psaní zachovej originální HTML strukturu, jen ji postupně odhaluj
                  // Důležité: žádný extra wrapper className, ať se nerozejde zarovnání při dopsání
                  return (
                    <div key={idx} dangerouslySetInnerHTML={{ __html: isTyping ? revealedTypingHtml : (b as BlockText).html }} />
                  );
                }
                return <div key={idx} dangerouslySetInnerHTML={{ __html: (b as BlockText).html }} />;
              }
              // choices block
              const items = (b as BlockChoices).items;
              const picked = pickedByBlock[idx];
              const isCurrentChoices = idx === i && !isTyping;
              return (
                <div key={idx} id={idx === i ? "reader-extra" : undefined} className="choice-box">
                  {isCurrentChoices && <p className="text" style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Zvol si cestu (nebo tě zvolí šum):</p>}
                  {items.map((it, choiceIdx) => {
                    const isPicked = picked === choiceIdx;
                    const isDisabled = picked !== undefined || idx < i; // lock older or once picked
                    const fadeStyle = isCurrentChoices
                      ? {
                          opacity: choicesShown ? 1 : 0,
                          transform: choicesShown ? 'translateY(0)' : 'translateY(6px)',
                          transition: 'opacity 300ms ease, transform 300ms ease',
                          transitionDelay: `${choiceIdx * 90}ms`,
                        }
                      : {} as React.CSSProperties;
                    return (
                      <button
                        key={choiceIdx}
                        className={`choice-link${isPicked ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
                        disabled={isDisabled}
                        onClick={() => {
                          if (isDisabled) return;
                          setPickedByBlock((m) => ({ ...m, [idx]: choiceIdx }));
                          onPick(it, idx); // updates scores
                        }}
                        style={{
                          ...fadeStyle,
                          opacity: isPicked ? 1 : fadeStyle.opacity ?? 0.6,
                          filter: isPicked ? 'none' : 'grayscale(30%)',
                          borderColor: isPicked ? 'var(--accent, #0ff)' : undefined,
                        }}
                      >
                        {it.text}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* choices are now rendered inline in the flow above */}
        </div>
      )}

      <div className="reader-controls footer">
        <span className="log">{blocks.length ? `${i + 1}/${blocks.length}` : ""}</span>
      </div>

      {/* MBTI výsledky se dočasně nesmí zobrazovat */}
      {/* ControlPanelClient je nyní montován v layoutu globálně */}
    </div>
  );
}
