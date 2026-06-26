'use client';

import { useState } from 'react';

interface Settings {
  theme: string;
  animations: boolean;
  glass: boolean;
  typewriterSpeed: string;
  fontScale: number;
  audioEnabled: boolean;
  ttsEnabled: boolean;
}

interface Props {
  settings: Settings | null;
}

export default function SettingsPanel({ settings: initial }: Props) {
  const [settings, setSettings] = useState<Settings>(
    initial ?? {
      theme: 'synthoma',
      animations: true,
      glass: true,
      typewriterSpeed: 'normal',
      fontScale: 1.0,
      audioEnabled: true,
      ttsEnabled: false,
    },
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const save = async () => {
    setStatus('saving');
    try {
      const res = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      setStatus(res.ok ? 'saved' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="settings-panel">
      <div className="psyche-log">
        <span className="psyche-log-prefix">LOG [LAYER_CONFIG]:</span>
        <span className="psyche-log-msg">&#8222;Konfigurace vrstvy.&#8220;</span>
      </div>

      <div className="settings-grid">
        <div className="settings-row">
          <label className="settings-label">Motiv</label>
          <select
            className="settings-select"
            aria-label="Motiv"
            value={settings.theme}
            onChange={(e) => set('theme', e.target.value)}
          >
            {['synthoma', 'green-matrix', 'neon-hellfire', 'cyber-dystopia', 'acid-glitch', 'retro-arcade', 'mono'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <label className="settings-label">Rychlost psacího stroje</label>
          <select
            className="settings-select"
            aria-label="Rychlost psacího stroje"
            value={settings.typewriterSpeed}
            onChange={(e) => set('typewriterSpeed', e.target.value)}
          >
            <option value="slow">Pomalá</option>
            <option value="normal">Normální</option>
            <option value="fast">Rychlá</option>
            <option value="instant">Okamžitá</option>
          </select>
        </div>

        <div className="settings-row">
          <label className="settings-label">Velikost písma ({Math.round(settings.fontScale * 100)}%)</label>
          <input
            type="range"
            aria-label="Velikost písma"
            min="0.8"
            max="1.4"
            step="0.05"
            value={settings.fontScale}
            onChange={(e) => set('fontScale', parseFloat(e.target.value))}
          />
        </div>

        {(
          [
            ['animations', 'Animace'],
            ['glass', 'Skleněný efekt'],
            ['audioEnabled', 'Audio'],
            ['ttsEnabled', 'TTS'],
          ] as [keyof Settings, string][]
        ).map(([key, label]) => (
          <div key={key} className="settings-row settings-toggle">
            <label className="settings-label">{label}</label>
            <button
              className={`toggle-btn${settings[key] ? ' active' : ''}`}
              onClick={() => set(key, !settings[key] as Settings[typeof key])}
            >
              {settings[key] ? 'ZAP' : 'VYP'}
            </button>
          </div>
        ))}
      </div>

      <button className="btn settings-save" onClick={save} disabled={status === 'saving'}>
        {status === 'saving' ? 'UKLÁDÁM...' : status === 'saved' ? '✓ ULOŽENO' : 'ULOŽIT KONFIGURACI'}
      </button>
      {status === 'error' && <p className="settings-error">Chyba uložení.</p>}
    </section>
  );
}
