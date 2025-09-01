"use client";

import { useEffect } from "react";
import { getSharedAudio } from "../../src/lib/audio";

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
    function debugLog(...args: any[]) {
      try {
        const ls = (typeof localStorage !== 'undefined') ? localStorage.getItem('debug') : null;
        const enabled = (ls === '1' || ls === 'true' || (typeof process !== 'undefined' && (process as any).env && (process as any).env.NODE_ENV !== 'production'));
        if (enabled) console.log(...args);
      } catch {}
    }
    // Nepoužívej tvrdý guard, HMR může DOM vyměnit a listenery zaniknou.
    // Místo toho použijeme delegaci na document (přidána jen jednou níže).
    const root = document.documentElement;
    const body = document.body;

    // Animation manager exposed on window
    window.animationManager = window.animationManager || {
      toggleAll: function () {
        const disabled = localStorage.getItem("animationsDisabled") === "true";
        const next = !disabled;
        localStorage.setItem("animationsDisabled", String(next));
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
        // Button label update
        const btn = document.getElementById("toggle-animations");
        // Když jsou animace vypnuté (next=true), ukaž "Vypnuty"
        if (btn) btn.textContent = next ? "Animace: Vypnuty" : "Animace: Zapnuty";
      },
    };

    function initPersisted() {
      try {
        const areDisabled = localStorage.getItem("animationsDisabled") === "true";
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
        const fs = localStorage.getItem("fontSizeMultiplier");
        if (fs) root.style.setProperty("--font-size-multiplier", fs);
        const op = localStorage.getItem("readerBgOpacity");
        if (op) root.style.setProperty("--reader-bg-opacity", op);
        // Glass mode
        const isGlass = localStorage.getItem("glassMode") === "true";
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
        const savedBlur = localStorage.getItem("glassBlur") || "12";
        root.style.setProperty("--glass-blur", savedBlur + "px");
      } catch {}
    }

    function applySetting(key: string, value: string, cssVar?: string) {
      try {
        localStorage.setItem(key, value);
      } catch {}
      if (cssVar) root.style.setProperty(cssVar, value);
    }

    function boot() {
      // Reentrancy lock
      if ((window as any).__cpBooting) {
        try { debugLog?.('[ControlPanel] boot() skipped – already booting'); } catch {}
        return;
      }
      (window as any).__cpBooting = true;
      const togglePanelBtn = document.getElementById("toggle-panel-btn");
      const controlPanel = document.getElementById("control-panel");
      try { if (togglePanelBtn && controlPanel) togglePanelBtn.setAttribute('aria-controls', 'control-panel'); } catch {}
      const doTogglePanel = (force?: boolean) => {
        if (!controlPanel || !togglePanelBtn) return;
        const wasVisible = controlPanel.classList.contains("visible");
        const next = typeof force === 'boolean' ? force : !wasVisible;
        controlPanel.classList.toggle("visible", next);
        togglePanelBtn.setAttribute("aria-expanded", String(next));
        try { togglePanelBtn.setAttribute('aria-controls', 'control-panel'); } catch {}
        if (!wasVisible && next) {
          controlPanel.style.opacity = "1";
          controlPanel.style.pointerEvents = "auto";
          controlPanel.style.transform = "none";
        } else if (wasVisible && !next) {
          controlPanel.style.opacity = "";
          controlPanel.style.pointerEvents = "";
          controlPanel.style.transform = "";
        }
        try { debugLog?.("[ControlPanel] toggle", { expanded: next }); } catch {}
      };
      if (togglePanelBtn && controlPanel) {
        if (!window.__cpPanelDelegationAttached) {
          document.addEventListener('click', function(ev){
            const t = ev.target as HTMLElement | null;
            if (!t) return;
            const dbg = t.closest('#debug-toggle');
            if (dbg) {
              try { ev.preventDefault(); ev.stopPropagation(); } catch {}
              const ls = (typeof localStorage !== 'undefined') ? localStorage.getItem('debug') : null;
              const next = !(ls === '1' || ls === 'true');
              try { localStorage.setItem('debug', next ? '1' : '0'); } catch {}
              try { (dbg as HTMLElement).setAttribute('aria-pressed', String(next)); } catch {}
              debugLog?.(`🐞 Debug ${next ? 'enabled' : 'disabled'} via button`);
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
              const ls = (typeof localStorage !== 'undefined') ? localStorage.getItem('debug') : null;
              const next = !(ls === '1' || ls === 'true');
              try { localStorage.setItem('debug', next ? '1' : '0'); } catch {}
              debugLog?.(`🐞 Debug ${next ? 'enabled' : 'disabled'} via Ctrl+Alt+D`);
              const btn = document.getElementById('debug-toggle');
              if (btn) btn.setAttribute('aria-pressed', String(next));
            }
          }, { signal });
          window.__cpPanelDelegationAttached = true;
        }
      } else {
        try { console.warn("[ControlPanel] Nenalezen toggle nebo panel", { hasBtn: !!togglePanelBtn, hasPanel: !!controlPanel }); } catch {}
      }

      // animations
      const toggleAnimationsBtn = document.getElementById("toggle-animations");
      const toggleGlassBtn = document.getElementById("toggle-glass");
      function updateButtonState() {
        const areAnimationsDisabled = localStorage.getItem("animationsDisabled") === "true";
        if (toggleAnimationsBtn){
          toggleAnimationsBtn.textContent = areAnimationsDisabled ? "Animace: Vypnuty" : "Animace: Zapnuty";
          toggleAnimationsBtn.setAttribute('aria-pressed', String(!areAnimationsDisabled));
        }
        const isGlass = localStorage.getItem("glassMode") === "true";
        if (toggleGlassBtn){
          toggleGlassBtn.textContent = isGlass ? "Sklo: Zapnuto" : "Sklo: Vypnuto";
          toggleGlassBtn.setAttribute('aria-pressed', String(isGlass));
        }
      }
      if (toggleAnimationsBtn) { updateButtonState(); }
      if (toggleGlassBtn) { updateButtonState(); }

      // 🎛️ NOVÝ SYNCHRONIZOVANÝ SYSTÉM PRO SLIDERY A GLASS MODE
      let currentGlassMode = localStorage.getItem('glassMode') === 'true';
      let currentOpacity = parseFloat(localStorage.getItem("readerBgOpacity") || "0.8");
      let currentBlur = parseInt(localStorage.getItem("glassBlur") || "12");
      if (Number.isNaN(currentBlur)) currentBlur = 12;
      currentBlur = Math.max(0, Math.min(24, currentBlur));

      function applyGlassMode(isGlass: boolean, updateSlider: boolean = true) {
        currentGlassMode = isGlass;
        body.classList.toggle('glass-mode', isGlass);
        const reader = document.querySelector('.SYNTHOMAREADER') as HTMLElement;
        if (isGlass) {
          if (reader) {
            reader.classList.add('glass');
            try {
              reader.style.removeProperty('background-color');
              (reader.style as any).backdropFilter = `blur(${currentBlur}px)`;
              (reader.style as any).webkitBackdropFilter = `blur(${currentBlur}px)`;
            } catch {}
          }
          root.style.setProperty("--glass-blur", `${currentBlur}px`);
        } else {
          if (reader) {
            reader.classList.remove('glass');
            try {
              (reader.style as any).backdropFilter = 'none';
              (reader.style as any).webkitBackdropFilter = 'none';
              reader.style.backgroundColor = `rgba(var(--bg-secondary-rgb), ${currentOpacity})`;
            } catch {}
          }
          root.style.setProperty("--reader-bg-opacity", currentOpacity.toString());
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
          toggleGlassBtn.textContent = isGlass ? "Sklo: Zapnuto" : "Sklo: Vypnuto";
          toggleGlassBtn.setAttribute('aria-pressed', String(isGlass));
        }
        try { localStorage.setItem('glassMode', String(isGlass)); } catch {}
      }

      const fontSizeSlider = document.getElementById("font-size-slider") as HTMLInputElement | null;
      if (fontSizeSlider) {
        const savedFontSize = localStorage.getItem("fontSizeMultiplier") || "1";
        fontSizeSlider.value = savedFontSize;
        root.style.setProperty("--font-size-multiplier", savedFontSize);
        fontSizeSlider.addEventListener("input", function (e) {
          const target = e.target as HTMLInputElement;
          applySetting("fontSizeMultiplier", target.value, "--font-size-multiplier");
        });
      }

      const opacitySlider = document.getElementById("opacity-slider") as HTMLInputElement | null;
      // init glass mode now
      applyGlassMode(currentGlassMode, true);

      try {
        const ensureReaderSync = () => {
          const reader = document.querySelector('.SYNTHOMAREADER') as HTMLElement | null;
          if (!reader) return;
          if (currentGlassMode) {
            if (!reader.classList.contains('glass')) {
              reader.classList.add('glass');
              try { reader.style.removeProperty('background-color'); } catch {}
            }
          } else {
            if (reader.classList.contains('glass')) {
              reader.classList.remove('glass');
            }
            try { reader.style.removeProperty('background-color'); } catch {}
          }
        };
        ensureReaderSync();
        const mo = new MutationObserver(() => { requestAnimationFrame(ensureReaderSync); });
        mo.observe(document.body, { childList: true, subtree: true });
        (window as any).__cpReaderObserver = mo;
      } catch {}
      if (opacitySlider) {
        const onSlider = function (e: Event) {
          const target = e.target as HTMLInputElement;
          const val = parseFloat(target.value);
          if (currentGlassMode) {
            currentBlur = Math.round(val * 24);
            root.style.setProperty("--glass-blur", `${currentBlur}px`);
            try { localStorage.setItem("glassBlur", String(currentBlur)); } catch {}
          } else {
            currentOpacity = val;
            root.style.setProperty("--reader-bg-opacity", val.toString());
            const reader = document.querySelector('.SYNTHOMAREADER') as HTMLElement;
            if (reader) { reader.style.backgroundColor = `rgba(var(--bg-secondary-rgb), ${val})`; }
            try { localStorage.setItem("readerBgOpacity", val.toString()); } catch {}
          }
        };
        opacitySlider.addEventListener("input", onSlider);
        opacitySlider.addEventListener("change", onSlider);
      }

      // theme buttons
      const themeButtons = document.querySelectorAll<HTMLButtonElement>(".theme-button");
      if (themeButtons.length) {
        const savedTheme = localStorage.getItem("theme") || "synthoma";
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
            try { localStorage.setItem("theme", theme); } catch {}
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

      // audio
      const BP = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const playlistContainer = document.getElementById("playlist-container");
      const playPauseBtn = document.getElementById("play-pause-btn");
      const stopBtn = document.getElementById("stop-btn");
      const progressBar = document.getElementById("progress-bar") as HTMLDivElement | null;
      const progressBarContainer = document.getElementById("progress-bar-container");
      const audioTracks = [
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
      // Expose simple control helpers so other pages can use the same player
      window.audioPanelPlay = function(file?: string){
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
        if (!audio.src || audio.ended || audio.currentTime === 0){
          currentTrackIndex = -1; // start from first
          playNextTrack();
        } else if (audio.paused){
          playAudio();
        }
      };
      function playAudio(filePath?: string) {
        if (filePath) { audio.src = filePath; try { audio.load(); } catch {} }
        const doPlay = () => audio.play().catch(() => { /* ignore */ });
        if (audio.readyState < 3) {
          const onReady = () => { try { audio.removeEventListener('canplaythrough', onReady); } catch {} doPlay(); };
          try { audio.addEventListener('canplaythrough', onReady, { once: true }); } catch { doPlay(); }
        } else { doPlay(); }
        if (playPauseBtn) (playPauseBtn as HTMLElement).textContent = "⏸️";
      }
      function updatePlaylistActiveState() {
        const items = document.querySelectorAll<HTMLAnchorElement>("#playlist-container a");
        items.forEach((item, index) => { item.classList.toggle("active", index === currentTrackIndex); });
      }
      function playNextTrack() {
        if (!audioTracks.length) return;
        currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
        const track = audioTracks[currentTrackIndex];
        playAudio(track.file);
        updatePlaylistActiveState();
      }
      function playPrevTrack() {
        if (!audioTracks.length) return;
        currentTrackIndex = (currentTrackIndex - 1 + audioTracks.length) % audioTracks.length;
        const track = audioTracks[currentTrackIndex];
        playAudio(track.file);
        updatePlaylistActiveState();
      }
      if (playlistContainer) {
        try { (playlistContainer as HTMLElement).innerHTML = ''; } catch {}
        audioTracks.forEach((track, index) => {
          const trackElement = document.createElement("a");
          trackElement.href = "#";
          trackElement.textContent = track.title;
          (trackElement as any).dataset.index = String(index);
          trackElement.addEventListener("click", function (e) {
            e.preventDefault();
            currentTrackIndex = index;
            playAudio(track.file);
            updatePlaylistActiveState();
          });
          playlistContainer.appendChild(trackElement);
        });
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
      audio.addEventListener("ended", playNextTrack);

      if (!(window as any).__cpAudioDelegationAttached) {
        document.addEventListener('click', function(ev){
          const t = ev.target as HTMLElement | null;
          if (!t) return;
          const btn = t.closest('button');
          if (!btn) return;
          if ((btn as HTMLElement).id === 'play-pause-btn'){
            try { ev.preventDefault(); ev.stopPropagation(); } catch {}
            try { console.debug('[Audio] play/pause click; paused=', audio.paused, 'src=', !!audio.src); } catch {}
            if (audio.paused) {
              if (audio.src) { audio.play().catch(() => {}); }
              else { currentTrackIndex = -1; playNextTrack(); }
            } else { audio.pause(); }
          } else if ((btn as HTMLElement).id === 'stop-btn'){
            try { ev.preventDefault(); ev.stopPropagation(); } catch {}
            try { console.debug('[Audio] stop click'); } catch {}
            audio.pause();
            audio.currentTime = 0;
          } else if ((btn as HTMLElement).id === 'toggle-tts') {
            try { ev.preventDefault(); ev.stopPropagation(); } catch {}
            const el = btn as HTMLButtonElement;
            const wasPressed = el.getAttribute('aria-pressed') === 'true';
            const next = !wasPressed;
            try { el.setAttribute('aria-pressed', String(next)); } catch {}
            try { el.textContent = next ? 'TTS: Zapnuto 🔊' : 'TTS: Vypnuto 🔇'; } catch {}
            try { localStorage.setItem('ttsOn', String(next)); } catch {}
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
            try { console.debug('[ControlPanel] click toggle-animations'); } catch {}
            window.animationManager?.toggleAll();
            try { document.dispatchEvent(new CustomEvent('synthoma:animations-changed')); } catch {}
            updateButtonState();
          } else if ((btn as HTMLElement).id === 'toggle-glass') {
            try { ev.preventDefault(); ev.stopPropagation(); } catch {}
            const next = !currentGlassMode;
            applyGlassMode(next, true);
          }
        }, { capture: true, signal });
        window.__cpActionsDelegationAttached = true;
      }

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
          const ls = (typeof localStorage !== 'undefined') ? localStorage.getItem('debug') : null;
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
