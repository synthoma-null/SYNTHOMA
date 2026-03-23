type CancelFn = () => void;

// Types for /books/manifest.json
type BooksManifest = {
  collections: Array<{
    slug?: string;
    title?: string;
    chapters?: Array<{
      title?: string;
      path?: string;
    }>;
  }>;
};

function isBooksManifest(u: unknown): u is BooksManifest {
  if (!u || typeof u !== 'object') return false;
  const m = u as { collections?: unknown };
  if (!Array.isArray(m.collections)) return false;
  return true;
}

export function runTypewriter(opts: {
  text: string;
  host: HTMLElement;
  getDurationMs: () => number;
  onStart?: () => void;
  onDone?: () => void;
}): CancelFn {
  const { text, host, getDurationMs, onStart, onDone } = opts;
  // Normalize host/target span
  let target: HTMLElement | null = null;
  if (host.classList?.contains('noising-text')) {
    target = host;
  } else {
    target = host.querySelector('.noising-text') as HTMLElement | null;
    if (!target) {
      target = document.createElement('span');
      target.className = 'noising-text';
      host.appendChild(target);
    }
  }
  // Prepare
  try { target!.textContent = ''; } catch {}
  let cancelled = false;
  let timerId: number | null = null;
  let rafId: number | null = null;
  const prefersReduced = (() => {
    try { return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches; } catch { return false; }
  })();
  const chars = Array.from(text);
  const total = Math.max(1, chars.length);
  const durationRaw = Number(getDurationMs?.() ?? 1200);
  const duration = Math.max(80, isFinite(durationRaw) ? durationRaw : 1200);
  const per = Math.max(6, Math.round(duration / total));

  const cleanup = () => {
    if (timerId !== null) { try { window.clearTimeout(timerId); } catch {} timerId = null; }
    if (rafId !== null) { try { window.cancelAnimationFrame(rafId); } catch {} rafId = null; }
    try { host.classList.remove('tw-running'); } catch {}
  };

  const finish = () => {
    if (cancelled) return;
    cleanup();
    try { onDone && onDone(); } catch {}
  };

  // Instant render for reduced motion or degenerate cases
  if (prefersReduced || duration <= 90 || total === 1) {
    try {
      for (const ch of chars) {
        const el = document.createElement('span');
        el.className = 'tw-char noising-char';
        el.textContent = String(ch);
        target!.appendChild(el);
      }
    } finally {
      finish();
    }
    return () => { cancelled = true; cleanup(); };
  }

  // Mark running state for CSS coordination
  try { host.classList.add('tw-running'); } catch {}
  try { onStart && onStart(); } catch {}

  // Deterministic timer using setTimeout step to avoid rAF throttling on bg tabs
  let i = 0;
  const step = () => {
    if (cancelled) return;
    if (i >= chars.length) { finish(); return; }
    try {
      const el = document.createElement('span');
      el.className = 'tw-char noising-char';
      el.textContent = String(chars[i]);
      target!.appendChild(el);
    } catch {}
    i++;
    timerId = window.setTimeout(step, per) as unknown as number;
  };
  // Kick off
  timerId = window.setTimeout(step, per) as unknown as number;

  // Return cancel fn (safe, idempotent)
  return () => { cancelled = true; cleanup(); };
}

function ensureExtraHost(): HTMLElement | null {
  const extra = document.querySelector('#reader-extra') as HTMLElement | null;
  if (!extra) return null;
  let span = extra.querySelector('.noising-text') as HTMLElement | null;
  if (!span) {
    span = document.createElement('span');
    span.className = 'noising-text';
    extra.appendChild(span);
  }
  // Nečistit historii – ale pro INFO/LIST budeme přidávat nový blok
  return extra;
}

export async function typeExternalInfo(): Promise<void> {
  try {
    const extra = ensureExtraHost();
    if (!extra) return;
    const block = document.createElement('div');
    block.className = 'info-block';
    const span = document.createElement('span'); span.className = 'noising-text'; block.appendChild(span);
    extra.appendChild(block);
    const res = await fetch('/data/SYNTHOMAINFO.html', { cache: 'no-store' });
    const html = await res.text();
    // Extrahuj text (jednoduše) – nechceme rozbít layout
    const tmp = document.createElement('div'); tmp.innerHTML = html;
    const text = (tmp.textContent || '').replace(/\s+$/,'').replace(/^\s+/,'');
    runTypewriter({ text, host: block, getDurationMs: () => Math.min(28000, Math.max(4000, text.length * 28)) });
  } catch (e) { console.error('typeExternalInfo failed', e); }
}

export async function typeBooksList(): Promise<void> {
  try {
    const extra = ensureExtraHost();
    if (!extra) return;
    const block = document.createElement('div');
    block.className = 'books-block';
    const span = document.createElement('span'); span.className = 'noising-text'; block.appendChild(span);
    extra.appendChild(block);
    const res = await fetch('/books/manifest.json', { cache: 'no-store' });
    const raw = (await res.json()) as unknown;
    const lines: string[] = [];
    if (isBooksManifest(raw)) {
      for (const col of raw.collections) {
        lines.push(`• ${col.title || col.slug}`);
        if (Array.isArray(col.chapters)) {
          for (const ch of col.chapters) {
            const t = ch.title || ch.path || '';
            lines.push(`  - ${t}`);
          }
        }
      }
    } else {
      lines.push('Žádná knihovna nenalezena.');
    }
    const text = lines.join('\n');
    runTypewriter({ text, host: block, getDurationMs: () => Math.min(22000, Math.max(3000, text.length * 18)) });
  } catch (e) { console.error('typeBooksList failed', e); }
}
