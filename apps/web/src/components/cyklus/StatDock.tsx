'use client';

import type React from 'react';
import { STAT_LABELS, STAT_DETAIL, type StatKey } from '../../game/cyklus/cyklusTypes';

const STAT_ORDER: StatKey[] = ['energy', 'memory', 'bond', 'control'];

type StatState = 'low-danger' | 'stable' | 'high-danger';

function getStatState(value: number): StatState {
  if (value <= 20) return 'low-danger';
  if (value >= 80) return 'high-danger';
  return 'stable';
}

function statStateLabel(state: StatState, value: number): string {
  if (state === 'low-danger') return value <= 10 ? 'KRITICKÁ KRIZE' : 'KRIZE';
  if (state === 'high-danger') return value >= 90 ? 'KRITICKÝ PŘETLAK' : 'PŘETLAK';
  return 'stabilní';
}

interface StatPopupProps {
  statKey: StatKey;
  value: number;
  onClose: () => void;
}

function StatPopup({ statKey, value, onClose }: StatPopupProps) {
  const detail = STAT_DETAIL[statKey];
  const state = getStatState(value);
  return (
    <div
      className="cyklus-stat-popup-overlay"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
    >
      <div className="cyklus-stat-popup" role="dialog" aria-modal="true" aria-label={`Popis statu ${STAT_LABELS[statKey]}`} onClick={(e) => e.stopPropagation()}>
        <div className={`cyklus-stat-popup__header cyklus-stat-popup__header--${state}`}>
          <span className="cyklus-stat-popup__name">{STAT_LABELS[statKey]}</span>
          <span className="cyklus-stat-popup__value">{value}</span>
          <button className="cyklus-stat-popup__close" type="button" onClick={onClose} aria-label="Zavřít popis statu">×</button>
        </div>
        <div className="cyklus-stat-popup__body">
          <p className="cyklus-stat-popup__description">{detail.description}</p>
          <div className="cyklus-stat-popup__extremes">
            <div className="cyklus-stat-popup__extreme cyklus-stat-popup__extreme--low">
              <span className="cyklus-stat-popup__extreme-label">0</span>
              <span className="cyklus-stat-popup__extreme-death">{detail.low}</span>
            </div>
            <div className="cyklus-stat-popup__extreme cyklus-stat-popup__extreme--high">
              <span className="cyklus-stat-popup__extreme-label">100</span>
              <span className="cyklus-stat-popup__extreme-death">{detail.high}</span>
            </div>
          </div>
          <div className="cyklus-stat-popup__rule">
            Bezpečné pásmo: 20–80
          </div>
          <div className="cyklus-stat-popup__motto">
            Cílem není maximum. Cílem je rovnováha.
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatDockProps {
  stats: Record<StatKey, number>;
  openStat: StatKey | null;
  onOpenStat: (key: StatKey | null) => void;
}

export default function StatDock({ stats, openStat, onOpenStat }: StatDockProps) {
  return (
    <>
      <aside className="cyklus-stat-dock" aria-label="Stav subjektu">
        {STAT_ORDER.map((key) => {
          const value = stats[key];
          const state = getStatState(value);
          const label = statStateLabel(state, value);
          return (
            <button
              key={key}
              className={`cyklus-stat-chip cyklus-stat-chip--${state}`}
              onClick={() => onOpenStat(openStat === key ? null : key)}
              type="button"
              aria-label={`${STAT_LABELS[key]}: ${value}, ${label}. Klikni pro popis.`}
            >
              <span className="cyklus-stat-chip__label">{STAT_LABELS[key]}</span>
              <span className="cyklus-stat-chip__value">{value}</span>
              <span className="cyklus-stat-chip__bar" role="presentation">
                <span
                  className={`cyklus-stat-chip__fill cyklus-stat-chip__fill--${state}`}
                  style={{ '--stat-fill-pct': `${value}%` } as React.CSSProperties}
                />
                <span className="cyklus-stat-chip__safe-zone" aria-hidden="true" />
                <span className="cyklus-stat-chip__center" aria-hidden="true" />
              </span>
              <span className={`cyklus-stat-chip__status cyklus-stat-chip__status--${state}`}>{label}</span>
            </button>
          );
        })}
      </aside>
      {openStat && (
        <StatPopup
          statKey={openStat}
          value={stats[openStat]}
          onClose={() => onOpenStat(null)}
        />
      )}
    </>
  );
}
