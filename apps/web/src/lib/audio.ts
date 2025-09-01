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
    try {
      // Ujisti se, že zdroj je správný
      const srcEl = sharedAudio.querySelector('source') as HTMLSourceElement | null;
      const desired = '/audio/SynthBachmoff.mp3';
      if (srcEl && srcEl.src && !srcEl.src.endsWith('SynthBachmoff.mp3')) {
        srcEl.src = desired;
        sharedAudio.load();
      }
    } catch {}
    return sharedAudio;
  }
  // Preferuj existující element, pokud byl vytvořen jinde
  const existing = document.getElementById('synthoma-shared-audio') as HTMLAudioElement | null;
  if (existing) {
    sharedAudio = existing;
    try {
      const srcEl = sharedAudio.querySelector('source') as HTMLSourceElement | null;
      const desired = '/audio/SynthBachmoff.mp3';
      if (srcEl && srcEl.src && !srcEl.src.endsWith('SynthBachmoff.mp3')) {
        srcEl.src = desired;
        sharedAudio.load();
      }
    } catch {}
    return sharedAudio;
  }
  // Vytvoř nový element s default zdrojem z public/audio
  const a = document.createElement('audio');
  a.id = 'synthoma-shared-audio';
  a.preload = 'auto';
  a.loop = true;
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
