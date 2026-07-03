'use client';

import { useEffect, useRef } from 'react';
import type { GameLogEntry } from '../../game/types';

interface Props {
  log: GameLogEntry[];
}

const LOG_TYPE_ICON: Record<string, string> = {
  move: '→',
  event: '◈',
  card: '♦',
  trap: '⚠',
  void: '∅',
  system: '·',
  roll: '⚄',
  final_round: '★',
  boss: '☠',
};

export function GameLog({ log }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log.length]);

  const recent = log.slice(-30);

  return (
    <div className="game-log">
      <div className="game-log-title">LOG</div>
      <div className="game-log-entries">
        {recent.map((entry) => (
          <div key={entry.id} className={`log-entry log-entry--${entry.type}`}>
            <span className="log-icon">{LOG_TYPE_ICON[entry.type] ?? '·'}</span>
            <span className="log-turn">[T{entry.turn}]</span>
            <span className="log-message">{entry.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
