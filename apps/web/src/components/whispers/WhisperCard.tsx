'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useLang } from '../../lib/LangContext';

export interface WhisperData {
  id: string;
  type: string;
  text: string;
  publicMode: string;
  resonanceCount: number;
  displayCount: number;
  boostedUntil?: string | null;
  resonated?: boolean;
  chapterId?: string | null;
}

interface Props {
  whisper: WhisperData;
  showBoost?: boolean;
  onResonanceChange?: (id: string, resonated: boolean, count: number) => void;
}

const BOOST_OPTIONS = [
  { type: 'boost',             cost: 16 },
  { type: 'pin',               cost: 32 },
  { type: 'transform',         cost: 64 },
  { type: 'archive_highlight', cost: 128 },
];

export default function WhisperCard({ whisper, showBoost = false, onResonanceChange }: Props) {
  const { data: session } = useSession();
  const { t } = useLang();
  const TYPE_LABELS: Record<string, string> = {
    unsent:  t('whispercard.type.unsent'),
    memory:  t('whispercard.type.memory'),
    fear:    t('whispercard.type.fear'),
    regret:  t('whispercard.type.regret'),
    wish:    t('whispercard.type.wish'),
    warning: t('whispercard.type.warning'),
    log:     t('whispercard.type.log'),
  };
  const MODE_LABEL = t('whispercard.mode.anonymous');
  const BOOST_LABELS: Record<string, string> = {
    boost:             t('whispercard.boost.stabilize'),
    pin:               t('whispercard.boost.pin'),
    transform:         t('whispercard.boost.transform'),
    archive_highlight: t('whispercard.boost.highlight'),
  };
  const [resonated, setResonated] = useState(whisper.resonated ?? false);
  const [count, setCount] = useState(whisper.resonanceCount);
  const [resonating, setResonating] = useState(false);
  const [boosting, setBoosting] = useState<string | null>(null);
  const [boostMsg, setBoostMsg] = useState('');

  const isBoosted = whisper.boostedUntil && new Date(whisper.boostedUntil) > new Date();

  const handleResonate = async () => {
    if (!session?.user || resonating) return;
    setResonating(true);
    try {
      const res = await fetch(`/api/whispers/${whisper.id}/resonate`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        const newResonated = data.resonated as boolean;
        const newCount = newResonated ? count + 1 : count - 1;
        setResonated(newResonated);
        setCount(newCount);
        onResonanceChange?.(whisper.id, newResonated, newCount);
      }
    } finally {
      setResonating(false);
    }
  };

  const handleBoost = async (type: string) => {
    if (!session?.user || boosting) return;
    setBoosting(type);
    setBoostMsg('');
    try {
      const res = await fetch(`/api/whispers/${whisper.id}/boost`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok) {
        setBoostMsg(`${data.type} activated.`);
      } else {
        setBoostMsg(data.error ?? t('whispercard.boost.error'));
      }
    } finally {
      setBoosting(null);
    }
  };

  return (
    <div className={`whisper-card${isBoosted ? ' whisper-card--boosted' : ''}${resonated ? ' whisper-card--resonated' : ''}`}>
      <div className="whisper-card-header">
        <span className="whisper-card-type">{TYPE_LABELS[whisper.type] ?? whisper.type.toUpperCase()}</span>
        <span className="whisper-card-mode">{MODE_LABEL}</span>
      </div>

      <p className="whisper-card-text">{whisper.text}</p>

      <div className="whisper-card-footer">
        <div className="whisper-card-stats">
          {count > 0 && (
            <span className="whisper-card-resonance-count">Rezonance: {count}</span>
          )}
          {whisper.displayCount > 0 && (
            <span className="whisper-card-display-count">Zobrazeno: {whisper.displayCount}×</span>
          )}
        </div>

        <button
          className={`whisper-resonate-btn${resonated ? ' whisper-resonate-btn--active' : ''}`}
          onClick={handleResonate}
          disabled={!session?.user || resonating}
          aria-label="Rezonovalo"
          aria-pressed={resonated ? 'true' : 'false'}
        >
          {resonating ? '...' : resonated ? 'REZONOVALO ✓' : 'REZONOVALO'}
        </button>
      </div>

      {showBoost && session?.user && (
        <div className="whisper-boost-row">
          {BOOST_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              className="whisper-boost-btn"
              onClick={() => handleBoost(opt.type)}
              disabled={boosting !== null}
              title={`${opt.cost} ${t('whispercard.boost.cost')}`}
            >
              {boosting === opt.type ? '...' : `${BOOST_LABELS[opt.type]} — ${opt.cost} mn`}
            </button>
          ))}
          {boostMsg && <p className="whisper-boost-msg">{boostMsg}</p>}
        </div>
      )}
    </div>
  );
}
