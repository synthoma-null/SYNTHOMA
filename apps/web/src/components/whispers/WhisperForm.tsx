'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLang } from '../../lib/LangContext';

const WHISPER_TYPES = [
  { value: 'unsent' },
  { value: 'memory' },
  { value: 'fear' },
  { value: 'regret' },
  { value: 'wish' },
  { value: 'warning' },
  { value: 'log' },
] as const;

const PLACEMENTS = [
  { value: 'random' },
  { value: 'chapter' },
  { value: 'archive' },
  { value: 'similar_subjects' },
] as const;

const PUBLIC_MODES = [
  { value: 'anonymous' },
  { value: 'subject_type' },
  { value: 'title' },
] as const;

interface Props {
  chapterId?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export default function WhisperForm({ chapterId, onSuccess, compact = false }: Props) {
  const { data: session } = useSession();
  const { t } = useLang();
  const [text, setText] = useState('');
  const [type, setType] = useState('unsent');
  const [placement, setPlacement] = useState(chapterId ? 'chapter' : 'random');
  const [publicMode, setPublicMode] = useState('anonymous');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const MAX = 500;
  const remaining = MAX - text.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setStatus('sending');
    setMsg('');

    try {
      const res = await fetch('/api/whispers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          type,
          placement,
          publicMode,
          chapterId: placement === 'chapter' ? chapterId : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('ok');
        setMsg(t('whisperform.ok'));
        setText('');
        onSuccess?.();
      } else {
        setStatus('error');
        setMsg(data.error ?? t('whisperform.error.generic'));
      }
    } catch {
      setStatus('error');
      setMsg(t('whisperform.network'));
    }
  };

  if (!session?.user) {
    return (
      <div className="whisper-form-auth">
        <p className="whisper-form-auth-text">
          <span className="whisper-log-prefix">LOG [AUTH_REQUIRED]:</span>
          {' '}{t('whisperform.auth.text')}
        </p>
        <a href="/login" className="btn btn-outline whisper-form-auth-btn">{t('whisperform.auth.login')}</a>
      </div>
    );
  }

  if (status === 'ok') {
    return (
      <div className="whisper-form-pending">
        <p className="whisper-log-prefix">LOG [WHISPER_PENDING]:</p>
        <p className="whisper-form-pending-msg">{msg}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`whisper-form${compact ? ' whisper-form--compact' : ''}`}>
      <div className="whisper-form-header">
        <span className="whisper-log-prefix">LOG [WHISPER_INPUT]:</span>
        <span className="whisper-form-subtitle">{t('whisperform.header')}</span>
      </div>

      <div className="whisper-form-field">
        <textarea
          className="whisper-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          placeholder={t('whisperform.placeholder')}
          rows={compact ? 3 : 4}
          disabled={status === 'sending'}
          aria-label={t('whisperform.textarea.aria')}
        />
        <span className={`whisper-form-counter${remaining < 40 ? ' whisper-form-counter--warn' : ''}`}>
          {remaining}
        </span>
      </div>

      {!compact && (
        <>
          <div className="whisper-form-row">
            <label className="whisper-form-label">{t('whisperform.type.label')}</label>
            <div className="whisper-form-chips">
              {WHISPER_TYPES.map((wt) => (
                <button
                  key={wt.value}
                  type="button"
                  className={`whisper-chip${type === wt.value ? ' whisper-chip--active' : ''}`}
                  onClick={() => setType(wt.value)}
                >
                  {t(`whisperform.type.${wt.value}` as any)}
                </button>
              ))}
            </div>
          </div>

          <div className="whisper-form-row">
            <label className="whisper-form-label">{t('whisperform.placement.label')}</label>
            <div className="whisper-form-chips">
              {PLACEMENTS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`whisper-chip${placement === p.value ? ' whisper-chip--active' : ''}`}
                  onClick={() => setPlacement(p.value)}
                >
                  {t(`whisperform.placement.${p.value}` as any)}
                </button>
              ))}
            </div>
          </div>

          <div className="whisper-form-row">
            <label className="whisper-form-label">{t('whisperform.signature.label')}</label>
            <div className="whisper-form-chips">
              {PUBLIC_MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`whisper-chip${publicMode === m.value ? ' whisper-chip--active' : ''}`}
                  onClick={() => setPublicMode(m.value)}
                >
                  {t(`whisperform.mode.${m.value}` as any)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="whisper-form-disclaimer">
        {t('whisperform.disclaimer')}
      </div>

      {status === 'error' && <p className="whisper-form-error">{msg}</p>}

      <div className="whisper-form-actions">
        <button
          className="btn whisper-form-submit"
          type="submit"
          disabled={!text.trim() || status === 'sending'}
        >
          {status === 'sending' ? t('whisperform.sending') : t('whisperform.submit')}
        </button>
      </div>
    </form>
  );
}
