'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { tracks, type Track } from '../../src/data/playlist';
import { getSharedAudio } from '../../src/lib/audio';

const PLAYER_ORDER = [
  'Comet',
  'Discontinuum',
  'Orgie',
  'Run',
  'Searching',
  'Sector',
  'SoulSynth',
  'SynthAm',
  'SynthJazzoko',
  'Touha',
  'SynthBachmoff',
  'SYNTHOMA1',
  'Nuova',
] as const;

function orderedTracks(): Track[] {
  return PLAYER_ORDER.flatMap((title) => {
    const track = tracks.find((candidate) => candidate.title === title);
    return track ? [track] : [];
  });
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function AudioIcon({ name }: { name: 'previous' | 'play' | 'pause' | 'next' | 'volume' | 'muted' | 'close' }) {
  if (name === 'previous') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M18 6l-9 6 9 6Z" /></svg>;
  if (name === 'next') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M6 6l9 6-9 6Z" /></svg>;
  if (name === 'play') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z" /></svg>;
  if (name === 'pause') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>;
  if (name === 'muted') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4ZM16 9l5 6M21 9l-5 6" /></svg>;
  if (name === 'close') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a8 8 0 0 1 0 11" /></svg>;
}

export default function SynthomaAudioPanel() {
  const playlist = useMemo(orderedTracks, []);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);
  const [externalTitle, setExternalTitle] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const activeTrackRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const restoreFocusRef = useRef(true);

  const syncTrackFromSource = useCallback((audio: HTMLAudioElement) => {
    const source = audio.currentSrc || audio.src || audio.querySelector('source')?.src || '';
    const fileName = source.split('/').pop()?.split('?')[0] ?? '';
    const index = playlist.findIndex((track) => track.src.endsWith(fileName));
    if (index >= 0) {
      setTrackIndex(index);
      setExternalTitle(null);
    } else if (fileName) {
      setExternalTitle(decodeURIComponent(fileName).replace(/\.[^.]+$/, ''));
    }
  }, [playlist]);

  const playTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    const track = playlist[index];
    if (!audio || !track) return;
    setTrackIndex(index);
    setExternalTitle(null);
    if (!audio.src.endsWith(track.src)) {
      audio.src = track.src;
      audio.load();
    }
    try { localStorage.setItem('audioAutoplayBlocked', 'false'); } catch {}
    audio.play().catch(() => {});
  }, [playlist]);

  const playSource = useCallback((source?: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!source) {
      if (!audio.currentSrc && !audio.src) playTrack(trackIndex);
      else audio.play().catch(() => {});
      return;
    }
    const fileName = source.split('/').pop()?.split('?')[0] ?? '';
    const index = playlist.findIndex((track) => track.src.endsWith(fileName));
    if (index >= 0) {
      playTrack(index);
      return;
    }
    audio.src = source;
    audio.load();
    setExternalTitle(decodeURIComponent(fileName).replace(/\.[^.]+$/, '') || 'Externí stopa');
    audio.play().catch(() => {});
  }, [playTrack, playlist, trackIndex]);

  useEffect(() => {
    const audio = getSharedAudio();
    audioRef.current = audio;
    window.__synthomaAudio = audio;
    audio.preload = 'auto';
    audio.controls = false;
    audio.setAttribute('playsinline', 'true');

    const sync = () => {
      setPlaying(!audio.paused && !audio.ended);
      setMuted(audio.muted);
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      syncTrackFromSource(audio);
    };
    const onEnded = () => playTrack((trackIndex + 1) % playlist.length);
    const events = ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange', 'volumechange', 'emptied'] as const;
    events.forEach((event) => audio.addEventListener(event, sync));
    audio.addEventListener('ended', onEnded);
    sync();

    const panelPlay = (source?: string) => playSource(source);
    const ensurePlaying = () => {
      try {
        if (localStorage.getItem('audioAutoplayBlocked') === 'true') return;
      } catch {}
      playSource();
    };
    window.audioPanelPlay = panelPlay;
    window.audioPanelEnsurePlaying = ensurePlaying;

    return () => {
      events.forEach((event) => audio.removeEventListener(event, sync));
      audio.removeEventListener('ended', onEnded);
      if (window.audioPanelPlay === panelPlay) delete window.audioPanelPlay;
      if (window.audioPanelEnsurePlaying === ensurePlaying) delete window.audioPanelEnsurePlaying;
    };
  }, [playSource, playTrack, playlist.length, syncTrackFromSource, trackIndex]);

  useEffect(() => {
    const toggle = () => {
      restoreFocusRef.current = true;
      setOpen((value) => !value);
    };
    const close = (event: Event) => {
      const detail = (event as CustomEvent<{ restoreFocus?: boolean }>).detail;
      restoreFocusRef.current = detail?.restoreFocus !== false;
      setOpen(false);
    };
    document.addEventListener('synthoma:audio-toggle', toggle);
    document.addEventListener('synthoma:audio-close', close);
    document.addEventListener('synthoma:control-panel-open', close);
    document.addEventListener('synthoma:identity-toggle', close);
    return () => {
      document.removeEventListener('synthoma:audio-toggle', toggle);
      document.removeEventListener('synthoma:audio-close', close);
      document.removeEventListener('synthoma:control-panel-open', close);
      document.removeEventListener('synthoma:identity-toggle', close);
    };
  }, []);

  useEffect(() => {
    const trigger = document.getElementById('toggle-audio-panel-btn') as HTMLButtonElement | null;
    const state = muted ? 'muted' : playing ? 'playing' : 'paused';
    trigger?.setAttribute('aria-expanded', String(open));
    trigger?.setAttribute('aria-pressed', String(open));
    trigger?.setAttribute('data-audio-state', state);
    trigger?.setAttribute('aria-label', `Hudba: ${muted ? 'ztlumeno' : playing ? 'přehrává se' : 'pozastaveno'}`);
    if (open) {
      document.dispatchEvent(new CustomEvent('synthoma:audio-open', { detail: { restoreFocus: false } }));
      setTimeout(() => closeRef.current?.focus(), 0);
    } else if (wasOpenRef.current && restoreFocusRef.current) {
      setTimeout(() => trigger?.focus(), 0);
    }
    wasOpenRef.current = open;
  }, [muted, open, playing]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        restoreFocusRef.current = true;
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open || externalTitle) return;
    activeTrackRef.current?.scrollIntoView({ block: 'nearest' });
  }, [externalTitle, open, trackIndex]);

  const currentTrack = playlist[trackIndex];
  const title = externalTitle ?? currentTrack?.title ?? 'Bez aktivní stopy';
  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div id="synthoma-audio-panel" className={`synthoma-audio-panel${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <button className="synthoma-audio-panel__backdrop" type="button" aria-label="Zavřít hudební přehrávač" onClick={() => setOpen(false)} />
      <section className="synthoma-audio-panel__surface" role="dialog" aria-modal="true" aria-labelledby="synthoma-audio-title">
        <header className="synthoma-audio-panel__header">
          <div>
            <span className="synthoma-audio-panel__kicker">AUDIO CHANNEL // {playing ? 'ACTIVE' : 'PAUSED'}</span>
            <h2 id="synthoma-audio-title">SYNTHOMA {String(trackIndex + 1).padStart(2, '0')}</h2>
          </div>
          <button ref={closeRef} className="synthoma-audio-panel__close" type="button" aria-label="Zavřít hudební přehrávač" onClick={() => setOpen(false)}>
            <AudioIcon name="close" />
          </button>
        </header>

        <div className="synthoma-audio-panel__body">
          <p className="synthoma-audio-panel__track">{title}</p>
          <label className="synthoma-audio-panel__progress">
            <span className="sr-only">Pozice skladby</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(currentTime, duration || 0)}
              disabled={duration <= 0}
              aria-valuetext={`${formatTime(currentTime)} z ${formatTime(duration)}`}
              style={{ '--audio-progress': `${progress}%` } as CSSProperties}
              onChange={(event) => {
                if (!audioRef.current || duration <= 0) return;
                audioRef.current.currentTime = Number(event.target.value);
              }}
            />
          </label>
          <div className="synthoma-audio-panel__times" aria-hidden="true">
            <span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span>
          </div>

          <div className="synthoma-audio-panel__controls">
            <button type="button" aria-label="Předchozí skladba" onClick={() => playTrack((trackIndex - 1 + playlist.length) % playlist.length)}><AudioIcon name="previous" /></button>
            <button
              className="synthoma-audio-panel__play"
              type="button"
              aria-label={playing ? 'Pozastavit hudbu' : 'Přehrát hudbu'}
              aria-pressed={playing}
              onClick={() => {
                const audio = audioRef.current;
                if (!audio) return;
                if (audio.paused) playSource();
                else {
                  audio.pause();
                  try { localStorage.setItem('audioAutoplayBlocked', 'true'); } catch {}
                }
              }}
            >
              <AudioIcon name={playing ? 'pause' : 'play'} />
            </button>
            <button type="button" aria-label="Další skladba" onClick={() => playTrack((trackIndex + 1) % playlist.length)}><AudioIcon name="next" /></button>
            <button
              type="button"
              aria-label={muted ? 'Zapnout zvuk hudby' : 'Ztlumit hudbu'}
              aria-pressed={muted}
              onClick={() => { if (audioRef.current) audioRef.current.muted = !audioRef.current.muted; }}
            >
              <AudioIcon name={muted ? 'muted' : 'volume'} />
            </button>
          </div>
        </div>

        <div className="synthoma-audio-panel__library" aria-labelledby="synthoma-audio-library-title">
          <h3 id="synthoma-audio-library-title">KNIHOVNA STOP // {playlist.length}</h3>
          <ol>
            {playlist.map((track, index) => {
              const active = !externalTitle && index === trackIndex;
              return (
                <li key={track.src}>
                  <button
                    ref={active ? activeTrackRef : undefined}
                    type="button"
                    className={active ? 'is-active' : undefined}
                    aria-current={active ? 'true' : undefined}
                    aria-label={active
                      ? `Aktivní skladba ${track.title}, ${muted ? 'ztlumeno' : playing ? 'přehrává se' : 'pozastaveno'}`
                      : `Přehrát skladbu ${track.title}, ${track.mood}`}
                    onClick={() => playTrack(index)}
                  >
                    <span className="synthoma-audio-panel__track-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="synthoma-audio-panel__track-copy">
                      <strong>{track.title}</strong>
                      <small>{track.mood}</small>
                    </span>
                    <span className={`synthoma-audio-panel__track-state${active && playing && !muted ? ' is-playing' : ''}`} aria-hidden="true">
                      {active ? (muted ? 'MUTED' : playing ? <><i /><i /><i /></> : 'PAUSE') : ''}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </div>
  );
}
