'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useLang } from '../../lib/LangContext';

const MAX_LEN = 500;

const TYPE_OPTIONS = [
  { value: 'memory',  label: 'Vzpomínka' },
  { value: 'unsent',  label: 'Neodeslaná zpráva' },
  { value: 'fear',    label: 'Strach' },
  { value: 'regret',  label: 'Lítost' },
  { value: 'wish',    label: 'Přání' },
  { value: 'warning', label: 'Varování' },
  { value: 'log',     label: 'LOG' },
] as const;

const PLACEMENT_OPTIONS = [
  { value: 'archive', label: 'Archiv' },
  { value: 'random',  label: 'Náhodná vrstva' },
  { value: 'chapter', label: 'Kapitola' },
] as const;

type WhisperType = (typeof TYPE_OPTIONS)[number]['value'];
type WhisperPlacement = (typeof PLACEMENT_OPTIONS)[number]['value'];

export type WhisperSubmitPanelProps = {
  placement?: WhisperPlacement;
  chapterId?: string;
  compact?: boolean;
};

export default function WhisperSubmitPanel({
  placement: defaultPlacement = 'archive',
  chapterId,
  compact = false,
}: WhisperSubmitPanelProps) {
  const { status } = useSession();
  const { t } = useLang();
  const [text, setText] = useState('');
  const [type, setType] = useState<WhisperType>('memory');
  const [placement, setPlacement] = useState<WhisperPlacement>(defaultPlacement);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  if (status === 'unauthenticated') {
    return (
      <div className={`whisper-submit-panel os-surface os-surface--glass whisper-submit-panel--auth${compact ? ' whisper-submit-panel--compact' : ''}`}>
        <p className="whisper-submit-title">{t('whispersubmit.title')}</p>
        <p className="whisper-submit-text">
          {t('whispersubmit.auth.text')}
        </p>
        <Link href="/login" className="btn btn-sm">{t('whispersubmit.auth.login')}</Link>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className={`whisper-submit-panel os-surface os-surface--glass${compact ? ' whisper-submit-panel--compact' : ''}`}>
        <p className="whisper-submit-title">{t('whispersubmit.title')}</p>
        <p className="whisper-submit-text whisper-submit-text--dim">{t('whispersubmit.loading')}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_LEN) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch('/api/whispers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: trimmed,
          type,
          placement,
          chapterId: chapterId ?? undefined,
          publicMode: 'anonymous',
          emotionTags: [],
          functionTags: [],
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setResult({ ok: false, msg: data.error ?? t('whispersubmit.error') });
      } else {
        setText('');
        setResult({
          ok: true,
          msg: t('whispersubmit.ok'),
        });
      }
    } catch {
      setResult({ ok: false, msg: t('whispersubmit.error') });
    } finally {
      setLoading(false);
    }
  }

  const remaining = MAX_LEN - text.length;
  const overLimit = remaining < 0;

  return (
    <div className={`whisper-submit-panel${compact ? ' whisper-submit-panel--compact' : ''}`}>
      {!compact && <p className="whisper-submit-title">{t('whispersubmit.title')}</p>}
      {!compact && (
        <p className="whisper-submit-text">{t('whispersubmit.tagline')}</p>
      )}
      <form onSubmit={handleSubmit} className="whisper-submit-form">
        <textarea
          className={`whisper-submit-textarea${overLimit ? ' whisper-submit-textarea--over' : ''}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('whispersubmit.placeholder')}
          maxLength={MAX_LEN + 10}
          rows={compact ? 3 : 4}
          aria-label={t('whispersubmit.aria.text')}
          disabled={loading}
        />
        <p className={`whisper-submit-counter${overLimit ? ' whisper-submit-counter--over' : ''}`}>
          {text.length} / {MAX_LEN}
        </p>

        <div className="whisper-submit-row">
          <select
            className="whisper-submit-select"
            value={type}
            onChange={(e) => setType(e.target.value as WhisperType)}
            disabled={loading}
            aria-label={t('whispersubmit.aria.type')}
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{t(`whispersubmit.type.${o.value}` as any)}</option>
            ))}
          </select>

          <select
            className="whisper-submit-select"
            value={placement}
            onChange={(e) => setPlacement(e.target.value as WhisperPlacement)}
            disabled={loading}
            aria-label={t('whispersubmit.aria.placement')}
          >
            {PLACEMENT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{t(`whispersubmit.placement.${o.value}` as any)}</option>
            ))}
          </select>

          <button
            type="submit"
            className="btn btn-sm whisper-submit-btn"
            disabled={loading || !text.trim() || overLimit}
          >
            {loading ? t('whispersubmit.sending') : t('whispersubmit.submit')}
          </button>
        </div>
      </form>

      {result && (
        <p className={`whisper-submit-status ${result.ok ? 'whisper-submit-status--ok' : 'whisper-submit-status--err'}`}>
          {result.msg}
        </p>
      )}
    </div>
  );
}
