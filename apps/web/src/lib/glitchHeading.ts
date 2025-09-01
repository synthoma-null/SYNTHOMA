// Glitch heading manager working on per-character spans when available.
// Usage: const detach = attachGlitchHeading(rootElement, originalText, options)

export type GlitchOptions = {
  intervalMs?: number;        // base interval between ticks (default 120ms)
  chance?: number;            // fallback scramble prob. per char (when no spans), default 0.1
  perCharChance?: number;     // probability a given char glitches this tick (with spans)
  perTickMax?: number;        // max chars to glitch per tick (cap)
  glitchMinMs?: number;       // min duration a char stays glitched
  glitchMaxMs?: number;       // max duration a char stays glitched
  chars?: string;             // pool of glitch characters
};

const DEFAULT_CHARS = "!@#$%^&*_-+=/?\\|<>[]{};:~NYHSMT#¤%&@§÷×¤░▒▓█▄▀●◊ O|/\\\\_^-~.*+";

function prefersReducedMotion(): boolean {
  try { return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

export function attachGlitchHeading(
  root: HTMLElement,
  originalText?: string,
  opts: GlitchOptions = {}
): () => void {
  const interval = Math.max(40, Math.floor(opts.intervalMs ?? 120));
  const fallbackChance = Math.min(1, Math.max(0, opts.chance ?? 0.1));
  const perCharChance = Math.min(1, Math.max(0, opts.perCharChance ?? 0.11));
  const perTickMax = Math.max(1, Math.floor(opts.perTickMax ?? 3));
  const glitchMinMs = Math.max(40, Math.floor(opts.glitchMinMs ?? 90));
  const glitchMaxMs = Math.max(glitchMinMs, Math.floor(opts.glitchMaxMs ?? 220));
  const chars = (opts.chars && opts.chars.length > 0 ? opts.chars : DEFAULT_CHARS);

  // Prefer working on span.glitch-char children to avoid DOM churn and keep layout stable
  const container = (root.querySelector('.glitch-real') as HTMLElement) || root;
  const charSpans = Array.from(container.querySelectorAll('.glitch-char')) as HTMLElement[];
  const baseText = (originalText ?? (charSpans.length ? charSpans.map(s => s.textContent || '').join('') : container.textContent ?? '')).toString();
  try {
    (container as any).dataset.originalText = baseText;
    container.setAttribute('data-original-text', baseText);
  } catch {}

  // Cache per-span original glyph
  if (charSpans.length) {
    for (const s of charSpans) {
      const t = (s.textContent ?? '');
      try { (s as any).dataset.orig = t; s.setAttribute('data-orig', t); } catch {}
    }
  }

  let raf = 0;
  let id: number | null = null;
  const activeTimers = new Set<number>();

  function glitchSpan(s: HTMLElement) {
    // Skip if already in transient glitch (marked via class)
    if (s.classList.contains('glitchy')) return;
    const orig = (s as any).dataset?.orig ?? s.getAttribute('data-orig') ?? (s.textContent ?? '');
    const ch = chars[Math.floor(Math.random() * chars.length)] || orig;
    s.textContent = ch;
    s.classList.add('glitchy');
    const dur = Math.floor(glitchMinMs + Math.random() * (glitchMaxMs - glitchMinMs));
    const t = window.setTimeout(() => {
      try { s.textContent = String(orig); s.classList.remove('glitchy'); } catch {}
      activeTimers.delete(t);
    }, dur);
    activeTimers.add(t);
  }

  function tickSpans() {
    if (!charSpans.length) return false;
    // Choose a small subset to avoid over-animating
    let picks = 0;
    for (const s of charSpans) {
      if (picks >= perTickMax) break;
      if (Math.random() < perCharChance) { glitchSpan(s); picks++; }
    }
    return true;
  }

  function tickFallback() {
    const src = baseText;
    let out = '';
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (ch === '\n' || ch === '\r') { out += ch; continue; }
      if (Math.random() < fallbackChance) {
        out += chars[Math.floor(Math.random() * chars.length)] || ch;
      } else {
        out += ch;
      }
    }
    container.textContent = out;
  }

  function start() {
    if (id) return;
    if (prefersReducedMotion()) return; // A11y: respect reduced motion
    id = (setInterval(() => {
      // avoid spamming when tab is hidden
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        return;
      }
      raf = requestAnimationFrame(() => {
        if (!tickSpans()) tickFallback();
      });
    }, interval) as unknown) as number;
  }

  function stop() {
    if (id) { clearInterval(id); id = null; }
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    // Clear pending timers and restore originals
    activeTimers.forEach(t => { try { clearTimeout(t); } catch {} });
    activeTimers.clear();
    try {
      if (charSpans.length) {
        for (const s of charSpans) {
          const orig = (s as any).dataset?.orig ?? s.getAttribute('data-orig') ?? (s.textContent ?? '');
          s.textContent = String(orig);
          s.classList.remove('glitchy');
        }
      } else {
        const ds = (container as any).dataset as DOMStringMap | undefined;
        const orig = (ds && (ds as any).originalText) || container.getAttribute('data-original-text') || baseText;
        container.textContent = String(orig);
      }
    } catch {}
  }

  start();
  return stop;
}
