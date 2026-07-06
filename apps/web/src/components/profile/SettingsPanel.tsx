'use client';

import { useState } from 'react';
import { useLang } from '../../lib/LangContext';

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
  const { t } = useLang();
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
        <span className="psyche-log-msg">&#8222;{t('settings.log')}&#8220;</span>
      </div>

      <div className="settings-grid">
        <div className="settings-row">
          <label className="settings-label">{t('settings.theme')}</label>
          <select
            className="settings-select"
            aria-label={t('settings.theme')}
            value={settings.theme}
            onChange={(e) => set('theme', e.target.value)}
          >
            {['synthoma', 'green-matrix', 'neon-hellfire', 'cyber-dystopia', 'acid-glitch', 'retro-arcade', 'mono', 'mono-light'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="settings-row">
          <label className="settings-label">{t('settings.typewriter')}</label>
          <select
            className="settings-select"
            aria-label={t('settings.typewriter')}
            value={settings.typewriterSpeed}
            onChange={(e) => set('typewriterSpeed', e.target.value)}
          >
            <option value="slow">{t('settings.speed.slow')}</option>
            <option value="normal">{t('settings.speed.normal')}</option>
            <option value="fast">{t('settings.speed.fast')}</option>
            <option value="instant">{t('settings.speed.instant')}</option>
          </select>
        </div>

        <div className="settings-row">
          <label className="settings-label">{t('settings.fontsize')} ({Math.round(settings.fontScale * 100)}%)</label>
          <input
            type="range"
            aria-label={t('settings.fontsize')}
            min="0.8"
            max="1.4"
            step="0.05"
            value={settings.fontScale}
            onChange={(e) => set('fontScale', parseFloat(e.target.value))}
          />
        </div>

        {(
          [
            ['animations', t('settings.animations')],
            ['glass', t('settings.glass')],
            ['audioEnabled', t('settings.audio')],
            ['ttsEnabled', t('settings.tts')],
          ] as [keyof Settings, string][]
        ).map(([key, label]) => (
          <div key={key} className="settings-row settings-toggle">
            <label className="settings-label">{label}</label>
            <button
              className={`toggle-btn${settings[key] ? ' active' : ''}`}
              onClick={() => set(key, !settings[key] as Settings[typeof key])}
            >
              {settings[key] ? t('settings.on') : t('settings.off')}
            </button>
          </div>
        ))}
      </div>

      <button className="btn settings-save" onClick={save} disabled={status === 'saving'}>
        {status === 'saving' ? t('settings.saving') : status === 'saved' ? t('settings.saved') : t('settings.save')}
      </button>
      {status === 'error' && <p className="settings-error">{t('settings.error')}</p>}
    </section>
  );
}
