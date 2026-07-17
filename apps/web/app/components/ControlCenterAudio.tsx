'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { tracks } from '../../src/data/playlist';
import { useUiPreferences } from '../../src/hooks/useUiPreferences';
import { getSharedAudio } from '../../src/lib/audio';
import { useLang } from '../../src/lib/LangContext';
import { updateUiPreferences } from '../../src/lib/uiPreferences';

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, '0')}`;
}

export default function ControlCenterAudio() {
  const pathname = usePathname() ?? '/';
  const { lang } = useLang();
  const preferences = useUiPreferences();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);

  useEffect(() => {
    const audio = getSharedAudio();
    audioRef.current = audio;
    audio.preload = 'metadata';
    audio.volume = preferences.audioVolume;
    const sync = () => {
      setPlaying(!audio.paused && !audio.ended);
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      const source = audio.currentSrc || audio.src || audio.querySelector('source')?.src || '';
      const index = tracks.findIndex((track) => source.endsWith(track.src));
      if (index >= 0) setTrackIndex(index);
    };
    const ready = () => { setLoading(false); setError(false); sync(); };
    const failed = () => { setLoading(false); setError(true); };
    const loadStart = () => setLoading(true);
    const events = ['play', 'pause', 'timeupdate', 'durationchange', 'volumechange'] as const;
    events.forEach((event) => audio.addEventListener(event, sync));
    audio.addEventListener('loadstart', loadStart);
    audio.addEventListener('canplay', ready);
    audio.addEventListener('error', failed);
    sync();
    return () => {
      events.forEach((event) => audio.removeEventListener(event, sync));
      audio.removeEventListener('loadstart', loadStart);
      audio.removeEventListener('canplay', ready);
      audio.removeEventListener('error', failed);
    };
  }, [preferences.audioVolume]);

  const selectTrack = (index: number, play = false) => {
    const audio = audioRef.current;
    const track = tracks[index];
    if (!audio || !track) return;
    setTrackIndex(index);
    setError(false);
    if (!audio.src.endsWith(track.src)) { audio.src = track.src; audio.load(); }
    if (play) { updateUiPreferences({ audioEnabled: true }); void audio.play().catch(() => setError(true)); }
  };

  const chapterContext = pathname.startsWith('/chapter/');
  const copy = lang === 'en' ? {
    master: 'Master audio', volume: 'Volume', track: 'Track', previous: 'Previous track', next: 'Next track', play: 'Play', pause: 'Pause', progress: 'Track position', loading: 'Loading audio…', error: 'Audio could not be played.', chapter: 'This chapter uses the shared SYNTHOMA audio channel.', global: 'Shared audio channel for this screen.',
  } : {
    master: 'Hlavní zvuk', volume: 'Hlasitost', track: 'Skladba', previous: 'Předchozí skladba', next: 'Další skladba', play: 'Přehrát', pause: 'Pozastavit', progress: 'Pozice skladby', loading: 'Načítám zvuk…', error: 'Zvuk se nepodařilo přehrát.', chapter: 'Tato kapitola používá sdílený audio kanál SYNTHOMA.', global: 'Sdílený audio kanál pro tuto obrazovku.',
  };

  return <div className="control-audio">
    <button className="control-center__toggle" type="button" aria-pressed={preferences.audioEnabled} onClick={() => {
      const enabled = !preferences.audioEnabled;
      updateUiPreferences({ audioEnabled: enabled });
      if (!enabled) audioRef.current?.pause();
    }}><span>{copy.master}</span><span aria-hidden="true">{preferences.audioEnabled ? 'ON' : 'OFF'}</span></button>
    <label className="control-center__range"><span>{copy.volume}</span><input type="range" min="0" max="1" step="0.05" value={preferences.audioVolume} aria-valuetext={`${Math.round(preferences.audioVolume * 100)} %`} onChange={(event) => {
      const audioVolume = Number(event.target.value);
      updateUiPreferences({ audioVolume });
      if (audioRef.current) audioRef.current.volume = audioVolume;
    }} /><output>{Math.round(preferences.audioVolume * 100)}%</output></label>
    <label className="control-audio__track"><span>{copy.track}</span><select value={trackIndex} onChange={(event) => selectTrack(Number(event.target.value))}>{tracks.map((track, index) => <option key={track.src} value={index}>{track.title}</option>)}</select></label>
    <div className="control-audio__transport">
      <button type="button" aria-label={copy.previous} onClick={() => selectTrack((trackIndex - 1 + tracks.length) % tracks.length, playing)}>‹</button>
      <button type="button" aria-label={playing ? copy.pause : copy.play} aria-pressed={playing} disabled={!preferences.audioEnabled} onClick={() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) selectTrack(trackIndex, true); else audio.pause();
      }}>{playing ? 'Ⅱ' : '▶'}</button>
      <button type="button" aria-label={copy.next} onClick={() => selectTrack((trackIndex + 1) % tracks.length, playing)}>›</button>
    </div>
    <label className="control-audio__progress"><span className="sr-only">{copy.progress}</span><input type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} disabled={duration <= 0} aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }} /></label>
    <div className="control-audio__time" aria-hidden="true"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
    <p className="control-audio__status" aria-live="polite">{error ? copy.error : loading ? copy.loading : chapterContext ? copy.chapter : copy.global}</p>
  </div>;
}
