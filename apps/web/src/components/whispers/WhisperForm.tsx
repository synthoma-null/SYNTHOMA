'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

const WHISPER_TYPES = [
  { value: 'unsent',  label: 'Neodeslaná zpráva' },
  { value: 'memory',  label: 'Vzpomínka' },
  { value: 'fear',    label: 'Strach' },
  { value: 'regret',  label: 'Lítost' },
  { value: 'wish',    label: 'Přání' },
  { value: 'warning', label: 'Varování' },
  { value: 'log',     label: 'LOG' },
];

const PLACEMENTS = [
  { value: 'random',           label: 'Náhodně po webu' },
  { value: 'chapter',          label: 'U konkrétní kapitoly' },
  { value: 'archive',          label: 'Jen v Archivu' },
  { value: 'similar_subjects', label: 'Jen podobným subjektům' },
];

const PUBLIC_MODES = [
  { value: 'anonymous',    label: 'Anonymní' },
  { value: 'subject_type', label: 'Anonymní + typ subjektu' },
  { value: 'title',        label: 'Anonymní + můj titul' },
];

interface Props {
  chapterId?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export default function WhisperForm({ chapterId, onSuccess, compact = false }: Props) {
  const { data: session } = useSession();
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
        setMsg('Stopa byla přijata. Archiv ji před zobrazením zkontroluje, protože lidé jsou bohužel lidé.');
        setText('');
        onSuccess?.();
      } else {
        setStatus('error');
        setMsg(data.error ?? 'Chyba při odesílání.');
      }
    } catch {
      setStatus('error');
      setMsg('Chyba sítě.');
    }
  };

  if (!session?.user) {
    return (
      <div className="whisper-form-auth">
        <p className="whisper-form-auth-text">
          <span className="whisper-log-prefix">LOG [AUTH_REQUIRED]:</span>
          {' '}Pro zanechání stopy je nutná ověřená identita.
        </p>
        <a href="/login" className="btn btn-outline whisper-form-auth-btn">PŘIHLÁSIT SE</a>
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
        <span className="whisper-form-subtitle">Zanech větu, kterou systém neumí doručit.</span>
      </div>

      <div className="whisper-form-field">
        <textarea
          className="whisper-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX))}
          placeholder="Piš..."
          rows={compact ? 3 : 4}
          disabled={status === 'sending'}
          aria-label="Text šepotu"
        />
        <span className={`whisper-form-counter${remaining < 40 ? ' whisper-form-counter--warn' : ''}`}>
          {remaining}
        </span>
      </div>

      {!compact && (
        <>
          <div className="whisper-form-row">
            <label className="whisper-form-label">TYP STOPY</label>
            <div className="whisper-form-chips">
              {WHISPER_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  className={`whisper-chip${type === t.value ? ' whisper-chip--active' : ''}`}
                  onClick={() => setType(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="whisper-form-row">
            <label className="whisper-form-label">ZOBRAZIT V</label>
            <div className="whisper-form-chips">
              {PLACEMENTS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`whisper-chip${placement === p.value ? ' whisper-chip--active' : ''}`}
                  onClick={() => setPlacement(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="whisper-form-row">
            <label className="whisper-form-label">PODPIS</label>
            <div className="whisper-form-chips">
              {PUBLIC_MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  className={`whisper-chip${publicMode === m.value ? ' whisper-chip--active' : ''}`}
                  onClick={() => setPublicMode(m.value)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="whisper-form-disclaimer">
        Šepoty se zobrazují anonymně. Systém si ale pamatuje, kdo je zanechal, kvůli ochraně Archivu před lidskou tvořivostí v nejhorším slova smyslu.
      </div>

      {status === 'error' && <p className="whisper-form-error">{msg}</p>}

      <div className="whisper-form-actions">
        <button
          className="btn whisper-form-submit"
          type="submit"
          disabled={!text.trim() || status === 'sending'}
        >
          {status === 'sending' ? 'ODESÍLÁM...' : 'ODESLAT DO ARCHIVU'}
        </button>
      </div>
    </form>
  );
}
