'use client';

import { useEffect, useState, useRef } from 'react';
import type { WhisperData } from './WhisperCard';

interface FloatingWhisper extends WhisperData {
  x: number;
  y: number;
  visible: boolean;
  key: number;
}

interface Props {
  placement?: string;
  chapterId?: string;
  maxVisible?: number;
  intervalMs?: number;
}

export default function WhisperFloat({
  placement = 'random',
  chapterId,
  maxVisible = 2,
  intervalMs = 14000,
}: Props) {
  const [pool, setPool] = useState<WhisperData[]>([]);
  const [floating, setFloating] = useState<FloatingWhisper[]>([]);
  const counterRef = useRef(0);
  const poolRef = useRef<WhisperData[]>([]);

  useEffect(() => {
    const params = new URLSearchParams({ placement, limit: '60' });
    if (chapterId) params.set('chapterId', chapterId);

    fetch(`/api/whispers?${params}`)
      .then((r) => r.json())
      .then((data: WhisperData[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setPool(data);
          poolRef.current = data;
        }
      })
      .catch(() => {});
  }, [placement, chapterId]);

  useEffect(() => {
    if (pool.length === 0) return;

    const show = () => {
      setFloating((prev) => {
        if (prev.filter((f) => f.visible).length >= maxVisible) return prev;
        const available = poolRef.current.filter((w) => !prev.some((f) => f.id === w.id));
        if (available.length === 0) return prev;

        const whisper = available[Math.floor(Math.random() * available.length)];
        if (!whisper) return prev;
        const x = 5 + Math.random() * 60;
        const y = 10 + Math.random() * 70;

        counterRef.current += 1;
        const newItem: FloatingWhisper = {
          id: whisper.id,
          type: whisper.type,
          text: whisper.text,
          publicMode: whisper.publicMode,
          resonanceCount: whisper.resonanceCount,
          displayCount: whisper.displayCount,
          boostedUntil: whisper.boostedUntil ?? null,
          resonated: whisper.resonated ?? false,
          chapterId: whisper.chapterId ?? null,
          x,
          y,
          visible: true,
          key: counterRef.current,
        };

        return [...prev.slice(-6), newItem];
      });
    };

    show();
    const id = setInterval(show, intervalMs);
    return () => clearInterval(id);
  }, [pool, maxVisible, intervalMs]);

  const dismiss = (key: number) => {
    setFloating((prev) =>
      prev.map((f) => (f.key === key ? { ...f, visible: false } : f)),
    );
  };

  return (
    <div className="whisper-float-layer" aria-hidden="true">
      {floating.map((f) =>
        f.visible ? (
          <div
            key={f.key}
            className="whisper-float-item os-surface os-surface--glass"
            style={{ '--wf-x': `${f.x}%`, '--wf-y': `${f.y}%` } as React.CSSProperties}
            onClick={() => dismiss(f.key)}
          >
            <span className="whisper-float-type">{f.type.toUpperCase()}</span>
            <span className="whisper-float-text">{f.text}</span>
          </div>
        ) : null,
      )}
    </div>
  );
}
