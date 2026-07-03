'use client';

import { VOID_PRESSURE_MAX } from '../../game/constants';

interface Props {
  pressure: number;
  bossActive: boolean;
  bossHp?: number | undefined;
}

export function VoidTrack({ pressure, bossActive, bossHp }: Props) {
  const pct = Math.min(100, (pressure / VOID_PRESSURE_MAX) * 100);
  const danger = pct >= 80;
  const warning = pct >= 50;

  return (
    <div className={`void-track${danger ? ' void-track--danger' : warning ? ' void-track--warning' : ''}`}>
      <div className="void-track-label">
        VOID PRESSURE
        <span className="void-track-value">{pressure}/{VOID_PRESSURE_MAX}</span>
      </div>
      <div className="void-track-bar">
        <div
          className="void-track-fill"
          role="progressbar"
          aria-valuenow={pressure}
          aria-valuemin={0}
          aria-valuemax={VOID_PRESSURE_MAX}
          style={{ width: `${pct}%` } as React.CSSProperties}
        />
      </div>
      {bossActive && (
        <div className="void-boss-indicator">
          <span className="void-boss-name">☠ NEKONEČNÝ FORMULÁŘ</span>
          {bossHp !== undefined && (
            <span className="void-boss-hp">HP: {bossHp}</span>
          )}
        </div>
      )}
    </div>
  );
}
