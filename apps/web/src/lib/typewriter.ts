type CancelFn = () => void;

export function runTypewriter(opts: {
  text: string;
  host: HTMLElement;
  getDurationMs: () => number;
  onStart?: () => void;
  onDone?: () => void;
}): CancelFn {
  const { text, host, getDurationMs, onStart, onDone } = opts;
  let cancelled = false;
  // If host itself is the noising target, use it directly to avoid nested spans.
  let span: HTMLElement | null = null;
  if (host.classList?.contains('noising-text')) {
    span = host;
    span.textContent = '';
  } else {
    span = host.querySelector('.noising-text') as HTMLElement | null;
    if (!span) {
      span = document.createElement('span');
      span.className = 'noising-text';
      host.appendChild(span);
    } else {
      span.textContent = '';
    }
  }
  const duration = Math.max(100, Number(getDurationMs?.() ?? 1200));
  const chars = Array.from(text);
  const total = chars.length || 1;
  const per = Math.max(8, Math.round(duration / total));
  let i = 0;
  onStart && onStart();
  function tick() {
    if (cancelled) return;
    if (i >= chars.length) {
      onDone && onDone();
      return;
    }
    const ch = chars[i++];
    const el = document.createElement('span');
    el.className = 'tw-char noising-char';
    el.textContent = ch;
    span!.appendChild(el);
    window.setTimeout(tick, per);
  }
  tick();
  return () => { cancelled = true; };
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
    const data = await res.json();
    const lines: string[] = [];
    if (data && Array.isArray(data.collections)) {
      for (const col of data.collections) {
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
