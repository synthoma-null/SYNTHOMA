"use client";



import { useEffect } from "react";

import { getSharedAudio } from "../../src/lib/audio";

import { readBooleanStorage, readNumberStorage, readStorage, removeStorage, writeStorage } from "../../src/lib/browser";



declare global {

  interface Window {

    animationManager?: { toggleAll: () => void };

    setTheme?: (name: string) => void;

    __synthomaAudio?: HTMLAudioElement;

    audioPanelPlay?: (file?: string) => void;

    audioPanelEnsurePlaying?: () => void;

    startShinning?: () => void;

    stopShinning?: () => void;

    startGlitchBg?: () => void;

    stopGlitchBg?: () => void;

    startVideoRotation?: () => void;

    stopVideoRotation?: () => void;

    startNoise?: () => void;

    stopNoise?: () => void;

    __cpBootedOnce?: boolean;

    __cpDelegationAttached?: boolean; // legacy

    __cpPanelDelegationAttached?: boolean;

    __cpActionsDelegationAttached?: boolean;

  }

}



export default function ControlPanelClient() {

  useEffect(() => {

    const abort = new AbortController();

    const { signal } = abort;

    function getLang() {
      try { return localStorage.getItem('synthoma_lang') === 'en' ? 'en' : 'cs'; } catch { return 'cs'; }
    }

    function cp(cs: string, en: string) { return getLang() === 'en' ? en : cs; }

    function debugLog(...args: any[]) {

      try {

        const enabled = isDebugEnabled();

        if (enabled) console.warn(...args);

      } catch {}

    }

    // Nepoužívej tvrdý guard, HMR může DOM vyměnit a listenery zaniknou.

    // Místo toho použijeme delegaci na document (přidána jen jednou níže).

    const root = document.documentElement;

    const body = document.body;

    const readText = (key: string, fallback = "") => readStorage(key, fallback) ?? fallback;

    const readFlag = (key: string, fallback = false) => readBooleanStorage(key, fallback);

    const readNum = (key: string, fallback: number) => readNumberStorage(key, fallback);

    const writeText = (key: string, value: string) => { writeStorage(key, value); };

    const clearText = (key: string) => { removeStorage(key); };

    const isDebugEnabled = () => {

      const ls = readText("debug", "");

      return ls === "1" || ls === "true" || (typeof process !== 'undefined' && (process as any).env && (process as any).env.NODE_ENV !== 'production');

    };



    // Animation manager exposed on window

    window.animationManager = window.animationManager || {

      toggleAll: function () {

        const disabled = readFlag("animationsDisabled", false);

        const next = !disabled;

        writeText("animationsDisabled", String(next));

        body.classList.toggle("no-animations", next);

        // update glitch/video helpers

        if (typeof window.stopGlitchBg === "function" && next) window.stopGlitchBg();

        if (typeof window.startGlitchBg === "function" && !next) window.startGlitchBg();

        if (typeof window.stopVideoRotation === "function" && next) window.stopVideoRotation();

        if (typeof window.startVideoRotation === "function" && !next) window.startVideoRotation();

        if (typeof window.stopNoise === "function" && next) window.stopNoise();

        if (typeof window.startNoise === "function" && !next) window.startNoise();

        if (typeof window.stopShinning === "function" && next) window.stopShinning();

        if (typeof window.startShinning === "function" && !next) window.startShinning();

        // hard pause/resume all background videos

        const vids = document.querySelectorAll<HTMLVideoElement>(".video-background video, .bg-video, .bg-video video");

        vids.forEach((v) => {

          try {

            if (next) {

              v.pause();

            } else {

              v.play().catch(() => { /* ignore */ });

            }

          } catch {}

        });

        // Dispatch event so all listeners (incl. useVideoVisibility) react
        try { document.dispatchEvent(new CustomEvent('synthoma:animations-changed')); } catch {}

        // Button label + aria-pressed update
        const btn = document.getElementById("toggle-animations");
        if (btn) {
          btn.textContent = next ? cp('Animace: Vypnuty', 'Animations: Off') : cp('Animace: Zapnuty', 'Animations: On');
          btn.setAttribute('aria-pressed', String(!next));
        }

      },

    };



    function getReaderContainer(): HTMLElement | null {

      try { return document.querySelector('[data-testid="reader-container"]') as HTMLElement | null; } catch { return null; }

    }



    function getReaderEl(): HTMLElement | null {

      try { return document.getElementById('hero-info'); } catch { return null; }

    }



    function setReaderVar(name: string, value: string) {

      try {

        document.querySelectorAll<HTMLElement>('.SYNTHOMAREADER').forEach((el) => {

          el.style.setProperty(name, value);

        });

      } catch {}

    }



    function initPersisted() {

      try {

        const areDisabled = readFlag("animationsDisabled", false);

        body.classList.toggle("no-animations", areDisabled);

        if (areDisabled) {

          if (typeof window.stopGlitchBg === "function") window.stopGlitchBg();

          if (typeof window.stopVideoRotation === "function") window.stopVideoRotation();

          if (typeof window.stopNoise === "function") window.stopNoise();

          if (typeof window.stopShinning === "function") window.stopShinning();

          const vids0 = document.querySelectorAll<HTMLVideoElement>(".video-background video, .bg-video, .bg-video video");

          vids0.forEach((v) => {

            try {

              v.pause();

            } catch {}

          });

        } else {

          if (typeof window.startGlitchBg === "function") window.startGlitchBg();

          if (typeof window.startVideoRotation === "function") window.startVideoRotation();

          if (typeof window.startNoise === "function") window.startNoise();

          if (typeof window.startShinning === "function") window.startShinning();

        }

        const fs = readStorage("fontSizeMultiplier", null);

        if (fs) root.style.setProperty("--font-size-multiplier", fs);

        // Initialize global panel opacity for glass panels

        const pa = readStorage("panelAlpha", null);

        if (pa) {

          const v = Math.max(0, Math.min(1, parseFloat(pa)));

          root.style.setProperty("--panel-alpha", String(v));

        } else {

          // provide a sane default if not set yet

          if (!getComputedStyle(root).getPropertyValue('--panel-alpha')) {

            root.style.setProperty("--panel-alpha", "0.6");

          }

        }

        const op = readStorage("readerBgOpacity", null);

        if (op) {

          const v = parseFloat(op);

          const c = Math.max(0, Math.min(1, v));

          // jednotná root proměnná pro neprůhlednost overlaye

          root.style.setProperty("--app-bg-opacity", String(c));

          // nový reader overlay var (aplikuje se na .chapter-content::before)

          root.style.setProperty("--bg-opacity", String(c));

          // nastav přímo na čtečky (inline style > utility třída)

          setReaderVar('--bg-opacity', String(c));

          // glow mapování – ponechat pro ne-glass režim

          const radius = Math.max(0, Math.min(20, 2 + v * 18));

          const alpha = Math.max(0, Math.min(100, Math.round(20 + v * 40)));

          root.style.setProperty("--reader-glow-radius", radius.toFixed(1) + "px");

          root.style.setProperty("--reader-glow-alpha", alpha + "%");

        }

        // Glass mode

        const isGlass = readFlag("glassMode", false);

        body.classList.toggle("glass-mode", isGlass);

        const glassTargets: HTMLElement[] = [];

        try {

          const cp = document.getElementById("control-panel");

          if (cp) glassTargets.push(cp);

          // Správně: čtečka má třídu .SYNTHOMAREADER (bez .terminal)

          const readerEl = document.querySelector<HTMLElement>(".SYNTHOMAREADER");

          if (readerEl) {

            glassTargets.push(readerEl);

            if (isGlass) {

              // vyčisti případné inline pozadí z předchozího NORMAL módu

              try { (readerEl as HTMLElement).style.removeProperty('background-color'); } catch {}

            }

          }

        } catch {}

        glassTargets.forEach((el) => {

          el.classList.toggle("glass", isGlass);

        });

        const savedBlur = readText("glassBlur", "12");

        // jednotná root proměnná pro blur + kompatibilní --glass-blur

        root.style.setProperty("--app-bg-blur", savedBlur + "px");

        root.style.setProperty("--glass-blur", savedBlur + "px");

      } catch {}

    }



    function applySetting(key: string, value: string, cssVar?: string) {

      try {

        writeText(key, value);

      } catch {}

      if (cssVar) {

        // Apply to both :root (html) and body, because themes set vars on body too

        root.style.setProperty(cssVar, value);

        body.style.setProperty(cssVar, value);

      }

    }



    function boot() {

      // Helper: keep a pin glued for a short time against reflows/rerenders

      function ensurePinnedFor(key: string, el: HTMLElement, ms: number = 2000) {

        try {

          const start = Date.now();

          const tick = () => {

            try {

              const still = readText(key, '') === '1';

              if (!still) return; // user unpinned

              el.classList.add('glitch-echo');

              el.setAttribute('data-glitch-pinned', '1');

              if (Date.now() - start < ms) {

                requestAnimationFrame(tick);

              }

            } catch {}

          };

          requestAnimationFrame(tick);

        } catch {}

      }

      // Debounce map for glitch clicks (scope-wide)

      const glitchClickLock = new WeakMap<HTMLElement, number>();

      // Restore pinned state for all fx-glitch tokens on the current page

      function restorePinned() {

        try {

          document.querySelectorAll<HTMLElement>('.fx-glitch[data-glitch]').forEach((el) => {

            const key = `glitchEcho:${location.pathname}:${el.getAttribute('data-glitch') || el.textContent || ''}`;

            try {

              const on = readText(key, '') === '1';

              el.classList.toggle('glitch-echo', on);

              if (on) el.setAttribute('data-glitch-pinned', '1'); else el.removeAttribute('data-glitch-pinned');

            } catch {}

          });

        } catch {}

      }

      // Safety: on load, ensure default state is DOWN unless explicitly pinned

      try {

        document.querySelectorAll<HTMLElement>('.fx-glitch.glitch-echo').forEach((el) => {

          if (el.getAttribute('data-glitch-pinned') !== '1') {

            el.classList.remove('glitch-echo');

          }

        });

      } catch {}

      // Reentrancy lock

      if ((window as any).__cpBooting) {

        try { debugLog?.('[ControlPanel] boot() skipped – already booting'); } catch {}

        return;

      }

      (window as any).__cpBooting = true;

      const controlPanel = document.getElementById("control-panel");

      const getTogglePanelBtn = () => document.getElementById("toggle-panel-btn") as HTMLButtonElement | null;

      try { getTogglePanelBtn()?.setAttribute('aria-controls', 'control-panel'); } catch {}

      const doTogglePanel = (force?: boolean, restoreFocus = true) => {

        const togglePanelBtn = getTogglePanelBtn();

        if (!controlPanel || !togglePanelBtn) return;

        const wasVisible = controlPanel.classList.contains("visible");

        const next = typeof force === 'boolean' ? force : !wasVisible;

        controlPanel.classList.toggle("visible", next);

        controlPanel.setAttribute("aria-hidden", String(!next));

        togglePanelBtn.setAttribute("aria-expanded", String(next));

        togglePanelBtn.setAttribute("aria-pressed", String(next));

        try { togglePanelBtn.setAttribute('aria-controls', 'control-panel'); } catch {}

        if (!wasVisible && next) {

          document.dispatchEvent(new CustomEvent('synthoma:control-panel-open', { detail: { restoreFocus: false } }));

          controlPanel.style.opacity = "1";

          controlPanel.style.pointerEvents = "auto";

          controlPanel.style.transform = "none";

          setTimeout(() => document.getElementById('cp-close-btn')?.focus(), 0);

        } else if (wasVisible && !next) {

          controlPanel.style.opacity = "";

          controlPanel.style.pointerEvents = "";

          controlPanel.style.transform = "";

          document.dispatchEvent(new CustomEvent('synthoma:control-panel-closed'));

          if (restoreFocus) setTimeout(() => getTogglePanelBtn()?.focus(), 0);

        }

        try { debugLog?.("[ControlPanel] toggle", { expanded: next }); } catch {}

      };

      if (controlPanel) {

        if (!window.__cpPanelDelegationAttached) {

          document.addEventListener('click', function(ev){

            const t = ev.target as HTMLElement | null;

            if (!t) return;

            const dbg = t.closest('#debug-toggle');

            if (dbg) {

              try { ev.preventDefault(); ev.stopPropagation(); } catch {}

              const ls = readText('debug', '');

              const next = !(ls === '1' || ls === 'true');

              try { writeText('debug', next ? '1' : '0'); } catch {}

              try { (dbg as HTMLElement).setAttribute('aria-pressed', String(next)); } catch {}

              debugLog?.(`🐞 Debug ${next ? 'enabled' : 'disabled'} via button`);

              return;

            }

            if (t.closest('#cp-close-btn')) {
              try { ev.preventDefault(); ev.stopPropagation(); } catch {}
              doTogglePanel(false);
              return;
            }

            const btn = t.closest('#toggle-panel-btn');

            if (!btn) return;

            try { ev.preventDefault(); } catch {}

            doTogglePanel();

          }, { signal });

          document.addEventListener('keydown', function(ev: KeyboardEvent){

            if (ev.key === 'Escape') {

              doTogglePanel(false);

            }

            if ((ev.key === 'd' || ev.key === 'D') && ev.ctrlKey && ev.altKey) {

              try { ev.preventDefault(); } catch {}

              const ls = readText('debug', '');

              const next = !(ls === '1' || ls === 'true');

              try { writeText('debug', next ? '1' : '0'); } catch {}

              debugLog?.(`🐞 Debug ${next ? 'enabled' : 'disabled'} via Ctrl+Alt+D`);

              const btn = document.getElementById('debug-toggle');

              if (btn) btn.setAttribute('aria-pressed', String(next));

            }

          }, { signal });

          document.addEventListener('synthoma:control-panel-close', function(ev: Event) {
            const detail = (ev as CustomEvent<{ restoreFocus?: boolean }>).detail;
            doTogglePanel(false, detail?.restoreFocus !== false);
          }, { signal });

          window.__cpPanelDelegationAttached = true;

        }

      } else {

        try { console.warn("[ControlPanel] Nenalezen ovládací panel"); } catch {}

      }



      // animations

      const toggleAnimationsBtn = document.getElementById("toggle-animations");

      const toggleGlassBtn = document.getElementById("toggle-glass");

      function updateButtonState() {

        const areAnimationsDisabled = readFlag("animationsDisabled", false);

        if (toggleAnimationsBtn){

          toggleAnimationsBtn.textContent = areAnimationsDisabled ? cp('Animace: Vypnuty', 'Animations: Off') : cp('Animace: Zapnuty', 'Animations: On');

          toggleAnimationsBtn.setAttribute('aria-pressed', String(!areAnimationsDisabled));

        }

        const isGlass = readFlag("glassMode", false);

        if (toggleGlassBtn){

          toggleGlassBtn.textContent = isGlass ? cp('Sklo: Zapnuto', 'Glass: On') : cp('Sklo: Vypnuto', 'Glass: Off');

          toggleGlassBtn.setAttribute('aria-pressed', String(isGlass));

        }

      }

      if (toggleAnimationsBtn) { updateButtonState(); }

      if (toggleGlassBtn) { updateButtonState(); }



      // 🎛️ NOVÝ SYNCHRONIZOVANÝ SYSTÉM PRO SLIDERY A GLASS MODE

      let currentGlassMode = readFlag('glassMode', false);

      let currentOpacity = readNum("readerBgOpacity", 0.85);

      let currentBlur = Math.round(readNum("glassBlur", 12));

      currentBlur = Math.max(0, Math.min(24, currentBlur));



      function applyGlassMode(isGlass: boolean, updateSlider: boolean = true) {

        currentGlassMode = isGlass;

        body.classList.toggle('glass-mode', isGlass);

        const reader = document.querySelector('.SYNTHOMAREADER') as HTMLElement;

        if (isGlass) {

          if (reader) {

            reader.classList.add('glass');

          }

          // nastav pouze root proměnné, styly si vezme CSS

          root.style.setProperty("--app-bg-blur", `${currentBlur}px`);

          root.style.setProperty("--glass-blur", `${currentBlur}px`);

          setReaderVar('--bg-blur', `${currentBlur}px`);

        } else {

          if (reader) {

            reader.classList.remove('glass');

          }

          // v ne-glass režimu slider nastavuje opacity přes root proměnnou

          const c = Math.max(0, Math.min(1, currentOpacity));

          root.style.setProperty("--app-bg-opacity", String(c));

          root.style.setProperty("--bg-opacity", String(c));

          setReaderVar('--bg-opacity', String(c));

          // glow mapování držíme kvůli vizuálnímu efektu

          const radius = Math.max(0, Math.min(20, 2 + currentOpacity * 18));

          const alpha = Math.max(0, Math.min(100, Math.round(20 + currentOpacity * 40)));

          root.style.setProperty("--reader-glow-radius", radius.toFixed(1) + "px");

          root.style.setProperty("--reader-glow-alpha", alpha + "%");

        }

        const opacitySlider = document.getElementById("opacity-slider") as HTMLInputElement | null;

        if (opacitySlider && updateSlider) {

          if (isGlass) {

            opacitySlider.value = (currentBlur / 24).toString();

          } else {

            opacitySlider.value = currentOpacity.toString();

          }

        }

        const toggleGlassBtn = document.getElementById("toggle-glass");

        if (toggleGlassBtn) {

          toggleGlassBtn.textContent = isGlass ? cp('Sklo: Zapnuto', 'Glass: On') : cp('Sklo: Vypnuto', 'Glass: Off');

          toggleGlassBtn.setAttribute('aria-pressed', String(isGlass));

        }

        try { writeText('glassMode', String(isGlass)); } catch {}

        // Update label and value indicator

        try { updateOpacityOutput(isGlass ? currentBlur / 24 : currentOpacity); } catch {}

      }



      const fontSizeSlider = document.getElementById("font-size-slider") as HTMLInputElement | null;

      const fontSizeOutput = document.getElementById("font-size-value") as HTMLOutputElement | null;

      function updateFontSizeOutput(val: string) {

        if (fontSizeOutput) fontSizeOutput.textContent = Math.round(parseFloat(val) * 100) + "%";

      }

      if (fontSizeSlider) {

        const savedFontSize = readText("fontSizeMultiplier", "1");

        fontSizeSlider.value = savedFontSize;

        updateFontSizeOutput(savedFontSize);

        // Apply on both html and body to override theme-scoped vars (e.g., Mono BW)

        root.style.setProperty("--font-size-multiplier", savedFontSize);

        body.style.setProperty("--font-size-multiplier", savedFontSize);

        fontSizeSlider.addEventListener("input", function (e) {

          const target = e.target as HTMLInputElement;

          applySetting("fontSizeMultiplier", target.value, "--font-size-multiplier");

          updateFontSizeOutput(target.value);

        });

      }



      const opacitySlider = document.getElementById("opacity-slider") as HTMLInputElement | null;

      const opacityOutput = document.getElementById("opacity-slider-value") as HTMLOutputElement | null;

      const opacityLabelEl = document.getElementById("opacity-slider-label") as HTMLElement | null;

      function updateOpacityOutput(val: number) {

        if (opacityOutput) {

          if (currentGlassMode) {

            opacityOutput.textContent = Math.round(val * 24) + "px";

          } else {

            opacityOutput.textContent = Math.round(val * 100) + "%";

          }

        }

        if (opacityLabelEl) {

          opacityLabelEl.textContent = currentGlassMode ? 'Blur' : cp('Průhlednost', 'Opacity');

        }

      }

      // init glass mode now

      applyGlassMode(currentGlassMode, true);

      updateOpacityOutput(currentGlassMode ? currentBlur / 24 : currentOpacity);



      try {

        const ensureReaderSync = () => {

          const readers = document.querySelectorAll<HTMLElement>('.SYNTHOMAREADER');

          if (!readers || readers.length === 0) return;

          readers.forEach((reader) => {

            reader.classList.toggle('glass', currentGlassMode);

            if (currentGlassMode) {

              // apply current blur to newly mounted readers

              reader.style.setProperty('--bg-blur', `${currentBlur}px`);

            } else {

              // apply current opacity to newly mounted readers

              const c = Math.max(0, Math.min(1, currentOpacity));

              reader.style.setProperty('--bg-opacity', String(c));

            }

          });

        };

        ensureReaderSync();

        let syncRafId: number | null = null;
        const mo = new MutationObserver(() => {
          if (syncRafId != null) return;
          syncRafId = requestAnimationFrame(() => { ensureReaderSync(); syncRafId = null; });
        });

        mo.observe(document.body, { childList: true, subtree: true });

        (window as any).__cpReaderObserver = mo;

      } catch {}

      if (opacitySlider) {

        let rafId: number | null = null;

        let pendingVal: number | null = null;



        const applyVal = (val: number) => {

          if (currentGlassMode) {

            currentBlur = Math.round(val * 24);

            // nastav root proměnné

            root.style.setProperty("--app-bg-blur", `${currentBlur}px`);

            root.style.setProperty("--glass-blur", `${currentBlur}px`);

            setReaderVar('--bg-blur', `${currentBlur}px`);

            try { writeText("glassBlur", String(currentBlur)); } catch {}

          } else {

            currentOpacity = val;

            const c = Math.max(0, Math.min(1, val));

            root.style.setProperty("--app-bg-opacity", String(c));

            root.style.setProperty("--bg-opacity", String(c));

            setReaderVar('--bg-opacity', String(c));

            try { writeText("readerBgOpacity", val.toString()); } catch {}

            // glow doplněk

            const radius = Math.max(0, Math.min(20, 2 + val * 18));

            const alpha = Math.max(0, Math.min(100, Math.round(20 + val * 40)));

            root.style.setProperty("--reader-glow-radius", radius.toFixed(1) + "px");

            root.style.setProperty("--reader-glow-alpha", alpha + "%");

          }

          const c = Math.max(0, Math.min(1, val));

          root.style.setProperty("--panel-alpha", String(c));

          try { writeText("panelAlpha", String(c)); } catch {}

        };



        const scheduleApply = (val: number) => {

          pendingVal = val;

          if (rafId != null) return;

          rafId = requestAnimationFrame(() => {

            if (pendingVal != null) applyVal(pendingVal);

            rafId = null;

            pendingVal = null;

          });

        };

        const onSlider = function (e: Event) {

          const target = e.target as HTMLInputElement;

          const val = parseFloat(target.value);

          scheduleApply(val);

          updateOpacityOutput(val);

        };

        opacitySlider.addEventListener("input", onSlider);

        opacitySlider.addEventListener("change", onSlider);

      }



      // theme buttons
      // If the new React ThemeShopClient is present, let it own theme state.
      if (document.getElementById("theme-shop")) {
        try { debugLog?.('[ControlPanel] theme buttons skipped – ThemeShopClient owns them'); } catch {}
      } else {

      const themeButtons = document.querySelectorAll<HTMLButtonElement>(".theme-button");

      if (themeButtons.length) {

        const savedTheme = readText("theme", "synthoma");

        body.setAttribute("data-theme", savedTheme);

        try { document.documentElement.setAttribute('data-theme', savedTheme); } catch {}

        // init active + aria-pressed

        themeButtons.forEach((b) => {

          const isActive = b.getAttribute("data-theme") === savedTheme;

          b.classList.toggle("active", isActive);

          b.setAttribute('aria-pressed', String(isActive));

        });

        themeButtons.forEach((button) => {

          button.addEventListener("click", function () {

            const theme = button.getAttribute("data-theme");

            if (!theme) return;

            if (typeof window.setTheme === "function") window.setTheme(theme);

            else {

              body.setAttribute("data-theme", theme);

              try { document.documentElement.setAttribute('data-theme', theme); } catch {}

            }

            try { writeText("theme", theme); } catch {}

            themeButtons.forEach((b) => {

              const activeNow = b.getAttribute("data-theme") === theme;

              b.classList.toggle("active", activeNow);

              b.setAttribute('aria-pressed', String(activeNow));

            });

            try { if (typeof window.startVideoRotation === 'function') window.startVideoRotation(); } catch {}

            try {

              document.querySelectorAll<HTMLVideoElement>('.video-background video, .bg-video, .bg-video video').forEach(v => {

                try { v.play().catch(()=>{}); } catch {}

              });

            } catch {}

          });

        });

      }

      }



      // audio

      const BP = process.env.NEXT_PUBLIC_BASE_PATH || '';

      const playlistContainer = document.getElementById("playlist-container");

      const playPauseBtn = document.getElementById("play-pause-btn");

      const stopBtn = document.getElementById("stop-btn");

      const progressBar = document.getElementById("progress-bar") as HTMLDivElement | null;

      const progressBarContainer = document.getElementById("progress-bar-container");

      // Ensure small info label above progress bar

      const ensureTrackInfoEl = () => {

        try {

          if (!progressBarContainer) return null;

          const parent = progressBarContainer.parentElement || progressBarContainer;

          let info = document.getElementById('current-track-info') as HTMLDivElement | null;

          if (!info) {

            info = document.createElement('div');

            info.id = 'current-track-info';

            info.className = 'lib-note';

            // insert before progress bar container

            parent.insertBefore(info, progressBarContainer);

          }

          return info;

        } catch { return null; }

      };

      const formatTime = (secs: number | undefined | null) => {

        if (!Number.isFinite(secs as any) || (secs as any) <= 0) return '';

        const s = Math.floor(secs as number % 60).toString().padStart(2, '0');

        const m = Math.floor((secs as number) / 60);

        return `${m}:${s}`;

      };

      function updateTrackInfoLabel() {

        const info = ensureTrackInfoEl();

        if (!info) return;

        const track = audioTracks[currentTrackIndex];

        const title = track?.title || '—';

        const dur = formatTime(audio?.duration);

        info.textContent = dur ? `${title} · ${dur}` : `${title}`;

      }

      const audioTracks = [

        // Prefer: uživatelské skladby

        { title: "Comet", file: `${BP}/audio/Comet.mp3` },

        { title: "Discontinuum", file: `${BP}/audio/Discontinuum.mp3` },

        { title: "Orgie", file: `${BP}/audio/Orgie.mp3` },

        { title: "Run", file: `${BP}/audio/Run.mp3` },

        { title: "Searching", file: `${BP}/audio/Searching.mp3` },

        { title: "Sector", file: `${BP}/audio/Sector.mp3` },

        { title: "SoulSynth", file: `${BP}/audio/SoulSynth.mp3` },

        { title: "SynthAm", file: `${BP}/audio/SynthAm.mp3` },

        { title: "SynthJazzoko", file: `${BP}/audio/SynthJazzoko.mp3` },

        { title: "Touha", file: `${BP}/audio/Touha.mp3` },

        // Původní skladby ponechány na konci jako bonus

        { title: "SynthBachmoff", file: `${BP}/audio/SynthBachmoff.mp3` },

        { title: "Glitch Ambient", file: `${BP}/audio/SYNTHOMA1.mp3` },

        { title: "Nuova", file: `${BP}/audio/Nuova.mp3` },

      ];

      let currentTrackIndex = -1;

      let audio = window.__synthomaAudio ? window.__synthomaAudio : getSharedAudio();

      audio.preload = 'auto';

      audio.controls = false;

      audio.setAttribute('playsinline', 'true');

      // Ensure audio element exists in DOM; getSharedAudio already appends its own hidden element.

      try {

        if (!document.body.contains(audio)) {

          document.body.appendChild(audio);

        }

      } catch {}

      if (!window.__synthomaAudio) { window.__synthomaAudio = audio; }

      // Loop preference utils (per-file)

      function getLoopPref(file: string | undefined | null): boolean {

        if (!file) return false;

        try { return readFlag(`audioLoop:${file}`, false); } catch { return false; }

      }

      function setLoopPref(file: string | undefined | null, on: boolean) {

        if (!file) return;

        try { writeText(`audioLoop:${file}`, String(on)); } catch {}

      }

      // Expose simple control helpers so other pages can use the same player

      window.audioPanelPlay = function(file?: string){

        try { writeText('audioAutoplayBlocked', 'false'); } catch {}

        if (file){

          const idx = audioTracks.findIndex(t => t.file === file);

          if (idx >= 0) currentTrackIndex = idx; else currentTrackIndex = -1;

          playAudio(file);

          updatePlaylistActiveState();

          return;

        }

        if (!audio.src){ currentTrackIndex = -1; playNextTrack(); }

        else { playAudio(); }

      };

      window.audioPanelEnsurePlaying = function(){

        // Do NOT autostart if user previously paused/stopped explicitly

        try {

          const blocked = readFlag('audioAutoplayBlocked', false);

          if (blocked) return;

        } catch {}

        if (!audio.src || audio.ended || audio.currentTime === 0){

          currentTrackIndex = -1; // start from first

          playNextTrack();

        } else if (audio.paused){

          playAudio();

        }

      };

      function playAudio(filePath?: string) {

        if (filePath) { audio.src = filePath; try { audio.load(); } catch {} }

        // Apply loop preference for this track

        try {

          const key = filePath || audio.src;

          audio.loop = getLoopPref(key);

        } catch {}

        const doPlay = () => audio.play().catch(() => { /* ignore */ });

        if (audio.readyState < 3) {

          const onReady = () => { try { audio.removeEventListener('canplaythrough', onReady); } catch {} updateTrackInfoLabel(); doPlay(); };

          try { audio.addEventListener('canplaythrough', onReady, { once: true }); } catch { doPlay(); }

        } else { doPlay(); }

        if (playPauseBtn) (playPauseBtn as HTMLElement).textContent = "⏸️";

        // reflect loop buttons UI

        try { updatePlaylistLoopState(); } catch {}

        try { updateTrackInfoLabel(); } catch {}

      }

      function updatePlaylistActiveState() {

        const items = document.querySelectorAll<HTMLAnchorElement>("#playlist-container a[data-index]");

        items.forEach((item) => {

          const idx = Number((item as any).dataset.index || -1);

          item.classList.toggle("active", idx === currentTrackIndex);

        });

      }

      function updatePlaylistLoopState() {

        const items = document.querySelectorAll<HTMLElement>("#playlist-container [data-index]");

        items.forEach((node) => {

          const idx = Number((node as any).dataset.index || -1);

          const track = audioTracks[idx];

          if (!track) return;

          const loopBtn = node.parentElement?.querySelector<HTMLButtonElement>(`.playlist-loop[data-index="${idx}"]`) ||

                          node.querySelector?.(`.playlist-loop[data-index="${idx}"]`);

          if (loopBtn) {

            const on = getLoopPref(track.file);

            loopBtn.setAttribute('aria-pressed', String(on));

            (loopBtn as HTMLElement).textContent = on ? '🔁⦿' : '🔁';

            (loopBtn as HTMLElement).setAttribute('title', on ? cp('Opakovat: Zapnuto', 'Loop: On') : cp('Opakovat: Vypnuto', 'Loop: Off'));

          }

        });

      }

      function playNextTrack() {

        if (!audioTracks.length) return;

        currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;

        const track = audioTracks[currentTrackIndex];

        if (!track) return;

        playAudio(track.file);

        updatePlaylistActiveState();

      }

      function playPrevTrack() {

        if (!audioTracks.length) return;

        currentTrackIndex = (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;

        const track = audioTracks[currentTrackIndex];

        if (!track) return;

        playAudio(track.file);

        updatePlaylistActiveState();

      }

      if (playlistContainer) {

        try {

          playlistContainer.classList.add('playlist');

          const el = playlistContainer as HTMLElement;

          // Don't force fixed height – user does not want scrolling here

          el.style.removeProperty('height');

          el.style.overflowY = 'visible';

        } catch {}

        try { (playlistContainer as HTMLElement).innerHTML = ''; } catch {}

        audioTracks.forEach((track, index) => {

          const trackElement = document.createElement("a");

          trackElement.href = "#";

          (trackElement as any).dataset.index = String(index);

          trackElement.className = 'playlist-item';

          // Build inner layout: text + loop chip inside the same anchor

          const titleSpan = document.createElement('span');

          titleSpan.className = 'playlist-title';

          titleSpan.textContent = track.title;



          const loopChip = document.createElement('span');

          loopChip.className = 'loop-chip';

          (loopChip as any).dataset.index = String(index);

          loopChip.setAttribute('role', 'button');

          loopChip.setAttribute('tabindex', '0');

          loopChip.setAttribute('aria-label', `Opakovat: ${track.title}`);

          const initialLoop = getLoopPref(track.file);

          loopChip.setAttribute('aria-pressed', String(initialLoop));

          loopChip.textContent = initialLoop ? '🔁⦿' : '🔁';

          loopChip.setAttribute('title', initialLoop ? cp('Opakovat: Zapnuto', 'Loop: On') : cp('Opakovat: Vypnuto', 'Loop: Off'));



          // Click on title plays track

          trackElement.addEventListener("click", function (e) {

            e.preventDefault();

            currentTrackIndex = index;

            playAudio(track.file);

            updatePlaylistActiveState();

            updatePlaylistLoopState();

          });

          // Click on loop chip toggles loop without starting playback

          const toggleChip = (e: Event) => {

            try { e.preventDefault(); e.stopPropagation(); } catch {}

            const now = !getLoopPref(track.file);

            setLoopPref(track.file, now);

            loopChip.setAttribute('aria-pressed', String(now));

            loopChip.textContent = now ? '🔁⦿' : '🔁';

            loopChip.setAttribute('title', now ? cp('Opakovat: Zapnuto', 'Loop: On') : cp('Opakovat: Vypnuto', 'Loop: Off'));

            if (index === currentTrackIndex) {

              audio.loop = now;

            }

          };

          loopChip.addEventListener('click', toggleChip);

          loopChip.addEventListener('keydown', (ev: KeyboardEvent) => {

            if (ev.key === 'Enter' || ev.key === ' ') toggleChip(ev);

          });



          // Order: loop button first, then title (as requested)

          trackElement.appendChild(loopChip);

          trackElement.appendChild(titleSpan);

          playlistContainer.appendChild(trackElement);

        });

        // Initial UI sync

        try { updatePlaylistActiveState(); updatePlaylistLoopState(); } catch {}

      }

      audio.addEventListener("timeupdate", function () {

        if (progressBar && audio.duration) {

          const progress = (audio.currentTime / audio.duration) * 100;

          progressBar.style.width = progress + "%";

        }

      });

      audio.addEventListener("play", function () {

        if (playPauseBtn) { (playPauseBtn as HTMLElement).textContent = "⏸️"; (playPauseBtn as HTMLElement).setAttribute('aria-pressed','true'); }

      });

      audio.addEventListener("pause", function () {

        if (playPauseBtn) { (playPauseBtn as HTMLElement).textContent = "▶️"; (playPauseBtn as HTMLElement).setAttribute('aria-pressed','false'); }

        // Mark autoplay as blocked if user paused during playback (not initial state)

        try { if (audio.currentTime > 0 && !audio.ended) writeText('audioAutoplayBlocked', 'true'); } catch {}

      });

      audio.addEventListener("error", function(){

        try { console.warn('[Audio] Chyba přehrávání, přeskakuji na další skladbu'); } catch {}

        playNextTrack();

      });

      if (progressBarContainer) {

        progressBarContainer.addEventListener("click", function (e: MouseEvent) {

          if (!audio.duration) return;

          const rect = (progressBarContainer as HTMLElement).getBoundingClientRect();

          const clickX = e.clientX - rect.left;

          audio.currentTime = (clickX / rect.width) * audio.duration;

        });

      }

      audio.addEventListener("loadedmetadata", function(){ updateTrackInfoLabel(); });

      audio.addEventListener("ended", function(){ if (audio.dataset.sequence) return; if (!audio.loop) playNextTrack(); });



      // =====================

      // TTS (Web Speech API)

      // =====================

      const synth: SpeechSynthesis | null = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;

      let ttsEnabled = false;

      let ttsQueue: string[] = [];

      let ttsSpeaking = false;

      let ttsUtterance: SpeechSynthesisUtterance | null = null;



      function setTtsButtonState(enabled: boolean) {

        const btn = document.getElementById('toggle-tts') as HTMLButtonElement | null;

        if (!btn) return;

        try {

          btn.setAttribute('aria-pressed', String(enabled));

          btn.textContent = enabled ? cp('TTS: Zapnuto 🔊', 'TTS: On 🔊') : cp('TTS: Vypnuto 🔇', 'TTS: Off 🔇');

        } catch {}

      }



      function collectReadableText(): string {

        // Preferuj čtečku

        const reader = document.querySelector('.SYNTHOMAREADER');

        const main = document.querySelector('main');

        const target = (reader as HTMLElement) || (main as HTMLElement) || document.body;

        let text = target?.textContent || '';

        // zmenšit whitespace, odstranit duplicitní mezery

        text = text.replace(/\s+/g, ' ').trim();

        return text;

      }



      function chunkTextToSentences(text: string): string[] {

        if (!text) return [];

        // Zkusit rozdělení podle vět, zachovat přirozenost

        const rough = text.match(/[^.!?\n]+[.!?]?/g) || [text];

        const chunks: string[] = [];

        let buf = '';

        for (const part of rough) {

          const candidate = (buf ? buf + ' ' : '') + part.trim();

          if (candidate.length > 220) {

            if (buf) chunks.push(buf);

            if (part.length > 220) {

              // tvrdé dělení dlouhých segmentů

              for (let i = 0; i < part.length; i += 200) {

                chunks.push(part.slice(i, i + 200));

              }

              buf = '';

            } else {

              buf = part.trim();

            }

          } else {

            buf = candidate;

          }

        }

        if (buf) chunks.push(buf);

        return chunks;

      }



      function ttsSpeakNext() {

        if (!synth || ttsSpeaking) return;

        const next = ttsQueue.shift();

        if (!next) { ttsSpeaking = false; return; }

        try {

          ttsSpeaking = true;

          const utt = new SpeechSynthesisUtterance(next);

          ttsUtterance = utt;

          // Prefer češtinu, fallback en

          utt.lang = 'cs-CZ';

          utt.rate = 1.0;

          utt.pitch = 1.0;

          utt.volume = 1.0;

          utt.onend = () => { ttsSpeaking = false; ttsSpeakNext(); };

          utt.onerror = () => { ttsSpeaking = false; ttsSpeakNext(); };

          synth.speak(utt);

        } catch {

          ttsSpeaking = false;

        }

      }



      function ttsStartFromCurrentContent() {

        if (!synth) return;

        try { synth.cancel(); } catch {}

        const text = collectReadableText();

        ttsQueue = chunkTextToSentences(text);

        ttsSpeaking = false;

        ttsSpeakNext();

      }



      function ttsStop() {

        if (!synth) return;

        try { synth.cancel(); } catch {}

        ttsQueue = [];

        ttsSpeaking = false;

      }



      // Reaguj na toggle event z panelu

      const onTtsToggle = () => {

        const on = readFlag('ttsOn', false);

        ttsEnabled = on;

        setTtsButtonState(on);

        if (synth) {

          if (on) ttsStartFromCurrentContent(); else ttsStop();

        }

      };

      document.addEventListener('synthoma:tts-toggle' as any, onTtsToggle, { signal });



      // Počáteční stav TTS tlačítka a auto-start dle localStorage

      const ttsInitOn = readFlag('ttsOn', false);

      ttsEnabled = ttsInitOn;

      setTtsButtonState(ttsInitOn);

      if (ttsInitOn && synth) {

        // Odlož start po renderu, ať se stihne dom 

        setTimeout(() => ttsStartFromCurrentContent(), 200);

      }



      // Sleduj změny obsahu a případně znovu přečti

      try {

        const observed = document.querySelector('main') || document.body;

        const ttsMo = new MutationObserver(() => {

          if (!ttsEnabled || !synth) return;

          // pokud se výrazně změnil DOM, restartni čtení

          // jednoduché: pokud zrovna nemluvíme (mezi větami), načni nový text

          if (!ttsSpeaking) {

            ttsStartFromCurrentContent();

          }

        });

        if (observed) ttsMo.observe(observed, { childList: true, subtree: true, characterData: true });

        (window as any).__cpTtsObserver = ttsMo;

      } catch {}



      if (!(window as any).__cpAudioDelegationAttached) {

        document.addEventListener('click', function(ev){

          const t = ev.target as HTMLElement | null;

          if (!t) return;

          const btn = t.closest('button');

          if (!btn) return;

          if ((btn as HTMLElement).id === 'play-pause-btn'){

            try { ev.preventDefault(); ev.stopPropagation(); } catch {}

            try { console.warn('[Audio] play/pause click; paused=', audio.paused, 'src=', !!audio.src); } catch {}

            if (audio.paused) {

              try { writeText('audioAutoplayBlocked', 'false'); } catch {}

              if (audio.src) { audio.play().catch(() => {}); }

              else { currentTrackIndex = -1; playNextTrack(); }

            } else { audio.pause(); }

          } else if ((btn as HTMLElement).id === 'stop-btn'){

            try { ev.preventDefault(); ev.stopPropagation(); } catch {}

            try { console.warn('[Audio] stop click'); } catch {}

            audio.pause();

            audio.currentTime = 0;

            try { writeText('audioAutoplayBlocked', 'true'); } catch {}

          } else if ((btn as HTMLElement).id === 'toggle-tts') {

            try { ev.preventDefault(); ev.stopPropagation(); } catch {}

            const el = btn as HTMLButtonElement;

            const wasPressed = el.getAttribute('aria-pressed') === 'true';

            const next = !wasPressed;

            try { el.setAttribute('aria-pressed', String(next)); } catch {}

            try { el.textContent = next ? cp('TTS: Zapnuto 🔊', 'TTS: On 🔊') : cp('TTS: Vypnuto 🔇', 'TTS: Off 🔇'); } catch {}

            try { writeText('ttsOn', String(next)); } catch {}

            try { document.dispatchEvent(new CustomEvent('synthoma:tts-toggle')); } catch {}

          }

        }, { capture: true, signal });

        (window as any).__cpAudioDelegationAttached = true;

      }



      if (!window.__cpActionsDelegationAttached) {

        document.addEventListener('click', function(ev){

          const target = ev.target as HTMLElement | null;

          if (!target) return;

          const btn = target.closest('button');

          if (!btn) return;

          if ((btn as HTMLElement).id === 'toggle-animations') {

            try { ev.preventDefault(); ev.stopPropagation(); } catch {}

            try { console.warn('[ControlPanel] click toggle-animations'); } catch {}

            window.animationManager?.toggleAll();

            updateButtonState();

          } else if ((btn as HTMLElement).id === 'toggle-glass') {

            try { ev.preventDefault(); ev.stopPropagation(); } catch {}

            const next = !currentGlassMode;

            applyGlassMode(next, true);

          }

        }, { capture: true, signal });

        window.__cpActionsDelegationAttached = true;

      }



      // Delegace: klik/klepnutí na glitchované slovo (.fx-glitch[data-glitch]) – perzistentní pin

      if (!(window as any).__cpGlitchWordDelegationAttached) {

        const handler = (ev: Event) => {

          const t = ev.target as HTMLElement | null;

          if (!t) return;

          const token = t.closest('.fx-glitch[data-glitch]') as HTMLElement | null;

          if (!token) return;

          // debounce: ignore repeated clicks within 350ms on same token

          const now = Date.now();

          const last = glitchClickLock.get(token) || 0;

          if (now - last < 350) { return; }

          glitchClickLock.set(token, now);

          try { ev.preventDefault(); ev.stopPropagation(); } catch {}

          // Pin to echo-ghost position and persist

          const key = `glitchEcho:${location.pathname}:${token.getAttribute('data-glitch') || token.textContent || ''}`;

          const isPinned = token.classList.contains('glitch-echo');

          const alt = (ev as MouseEvent).altKey === true || (ev as TouchEvent).altKey === true;

          // Alt = force unpin

          if (alt) {

            token.classList.remove('glitch-echo');

            token.classList.remove('glitch-active');

            try { token.removeAttribute('data-glitch-pinned'); } catch {}

            try { clearText(key); } catch {}

            return;

          }

          // Toggle on normal click

          if (isPinned) {

            token.classList.remove('glitch-echo');

            token.classList.remove('glitch-active');

            try { token.removeAttribute('data-glitch-pinned'); } catch {}

            try { clearText(key); } catch {}

            return;

          } else {

            token.classList.add('glitch-echo');

            token.classList.add('glitch-active'); // ensure visibility even if lift is clipped

            try { token.setAttribute('data-glitch-pinned', '1'); } catch {}

            try { writeText(key, '1'); } catch {}

            // Enforce after potential reflows/other handlers

            try {

              setTimeout(() => {

                try {

                  const still = readText(key, '') === '1';

                  if (still) {

                    token.classList.add('glitch-echo');

                    token.setAttribute('data-glitch-pinned', '1');

                  }

                } catch {}

              }, 0);

              setTimeout(() => {

                try {

                  const still = readText(key, '') === '1';

                  if (still) {

                    token.classList.add('glitch-echo');

                    token.setAttribute('data-glitch-pinned', '1');

                  }

                } catch {}

              }, 250);

              ensurePinnedFor(key, token, 2200);

              restorePinned();

            } catch {}

          }

        };

        // Important: handle ONLY click to avoid double-toggle (mousedown -> click)

        document.addEventListener('click', handler as any, { capture: true, signal });

        document.addEventListener('keydown', function(ev: KeyboardEvent){

          const t = ev.target as HTMLElement | null;

          if (!t) return;

          if (ev.key !== 'Enter' && ev.key !== ' ') return;

          const token = t.closest('.fx-glitch[data-glitch]') as HTMLElement | null;

          if (!token) return;

          try { ev.preventDefault(); ev.stopPropagation(); } catch {}

          const key = `glitchEcho:${location.pathname}:${token.getAttribute('data-glitch') || token.textContent || ''}`;

          const isPinned = token.classList.contains('glitch-echo');

          if (isPinned) {

            token.classList.remove('glitch-echo');

            token.classList.remove('glitch-active');

            try { token.removeAttribute('data-glitch-pinned'); } catch {}

            try { clearText(key); } catch {}

          } else {

            token.classList.add('glitch-echo');

            token.classList.add('glitch-active');

            try { token.setAttribute('data-glitch-pinned', '1'); } catch {}

            try { writeText(key, '1'); } catch {}

            try { setTimeout(() => { try { token.classList.add('glitch-echo'); token.setAttribute('data-glitch-pinned', '1'); } catch {} }, 0); } catch {}

            ensurePinnedFor(key, token, 2200);

          }

        }, { capture: true, signal });

        (window as any).__cpGlitchWordDelegationAttached = true;

      }



      // Reapply pinned glitch-echo states on load / DOM mutations

      try {

        restorePinned();

        const mo = new MutationObserver(() => { restorePinned(); });

        mo.observe(document.body, { childList: true, subtree: true });

        (window as any).__cpGlitchRestoreObserver = mo;

        // periodic sweep for a while after page load to survive heavy reflows

        let sweepMs = 8000; // 8s should cover typewriter/render passes

        const iv = setInterval(() => {

          try { restorePinned(); } catch {}

          sweepMs -= 500;

          if (sweepMs <= 0) { try { clearInterval(iv); } catch {} }

        }, 500);

        document.addEventListener('visibilitychange', () => { if (!document.hidden) restorePinned(); }, { signal });

      } catch {}



      // Speed controls odstraněny – typewriter jede napevno rychle.



      const hoverElements = document.querySelectorAll<HTMLElement>("[data-hover-text]");

      hoverElements.forEach((element) => {

        element.addEventListener("mouseover", function () { element.style.transform = "translateY(-2px)"; });

        element.addEventListener("mouseout", function () { element.style.transform = "translateY(0)"; });

      });



      initPersisted();

      try {

        const btn = document.getElementById('debug-toggle');

        if (btn) {

          const ls = readText('debug', '');

          const active = (ls === '1' || ls === 'true');

          btn.setAttribute('aria-pressed', String(active));

        }

      } catch {}

      try { (window as any).__cpBootedOnce = true; } catch {}

      try { (window as any).__cpBooting = false; } catch {}



      return () => {

        try { abort.abort(); } catch {}

        try { (window as any).__cpPanelDelegationAttached = false; } catch {}

        try { (window as any).__cpActionsDelegationAttached = false; } catch {}

        try { (window as any).__cpAudioDelegationAttached = false; } catch {}

        try { const mo = (window as any).__cpReaderObserver as MutationObserver | undefined; if (mo) mo.disconnect(); } catch {}

      };

    }



    if (document.readyState === "loading") {

      document.addEventListener("DOMContentLoaded", boot);

      return () => document.removeEventListener("DOMContentLoaded", boot);

    } else {

      boot();

    }

    return;

  }, []);



  return null;

}

