let sharedAudio: HTMLAudioElement | null = null;

export function getSharedAudio(): HTMLAudioElement {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // SSR fallback: vytvoř prázdné Audio-like API
    const anyObj: any = {
      paused: true,
      ended: false,
      currentTime: 0,
      play: async () => {},
      pause: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    return anyObj as HTMLAudioElement;
  }
  if (sharedAudio && document.body.contains(sharedAudio)) {
    return sharedAudio;
  }
  // Preferuj existující element, pokud byl vytvořen jinde
  const existing = document.getElementById('synthoma-shared-audio') as HTMLAudioElement | null;
  if (existing) {
    sharedAudio = existing;
    return sharedAudio;
  }
  // Vytvoř nový element s default zdrojem z public/audio
  const a = document.createElement('audio');
  a.id = 'synthoma-shared-audio';
  a.preload = 'metadata';
  // Ne-loopujeme – ať může ControlPanel navázat na 'ended' a přehrát další track
  a.loop = false;
  const source = document.createElement('source');
  source.src = '/audio/SynthBachmoff.mp3';
  source.type = 'audio/mpeg';
  a.appendChild(source);
  a.style.position = 'fixed';
  a.style.left = '-9999px';
  a.style.width = '1px';
  a.style.height = '1px';
  document.body.appendChild(a);
  sharedAudio = a;
  return sharedAudio;
}

/** Set the shared audio source and load it (does not auto-play) */
export function setSharedAudioSrc(src: string): HTMLAudioElement {
  const a = getSharedAudio();
  try {
    const srcEl = a.querySelector('source') as HTMLSourceElement | null;
    if (srcEl) {
      if (!srcEl.src.endsWith(src.split('/').pop() || '')) {
        srcEl.src = src;
        a.load();
      }
    } else {
      a.src = src;
      a.load();
    }
  } catch {}
  return a;
}
