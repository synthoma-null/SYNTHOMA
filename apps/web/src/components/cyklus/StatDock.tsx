'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { STAT_LABELS, STAT_DETAIL, type StatKey, type CyklusChoiceRecord, type CyklusRunModifier } from '../../game/cyklus/cyklusTypes';
import { CYKLUS_CARDS } from '../../game/cyklus/content';

const STAT_ORDER: StatKey[] = ['energy', 'memory', 'bond', 'control'];

function usePrevious<T>(value: T): T | undefined {
  const [prev, setPrev] = useState<T | undefined>(undefined);
  const [current, setCurrent] = useState<T>(value);
  if (value !== current) {
    setPrev(current);
    setCurrent(value);
  }
  return prev;
}

type StatState = 'low-danger' | 'stable' | 'high-danger';

function getStatState(value: number): StatState {
  if (value <= 20) return 'low-danger';
  if (value >= 80) return 'high-danger';
  return 'stable';
}

function statStateLabel(state: StatState, value: number): string {
  if (state === 'low-danger') return value <= 10 ? 'KRITICKÁ' : 'NÍZKÁ';
  if (state === 'high-danger') return value >= 90 ? 'KRITICKÁ' : 'PŘETLAK';
  return 'stabilní';
}

const TREND_WINDOW = 8;

function getTrend(history: CyklusChoiceRecord[], statKey: StatKey): { total: number; count: number } {
  const recent = history.slice(-TREND_WINDOW);
  let total = 0;
  let count = 0;
  for (const r of recent) {
    const d = r.statDelta[statKey];
    if (d && d !== 0) { total += d; count++; }
  }
  return { total, count };
}

function getRecentChanges(history: CyklusChoiceRecord[], statKey: StatKey): { cardId: string; title: string; delta: number; turn: number }[] {
  const result: { cardId: string; title: string; delta: number; turn: number }[] = [];
  for (let i = history.length - 1; i >= 0 && result.length < 5; i--) {
    const r = history[i];
    if (!r) continue;
    const d = r.statDelta[statKey];
    if (d && d !== 0) {
      const card = CYKLUS_CARDS[r.cardId];
      result.push({ cardId: r.cardId, title: card?.title ?? r.cardId, delta: d, turn: r.turn });
    }
  }
  return result;
}

function getLastDelta(history: CyklusChoiceRecord[], statKey: StatKey): number {
  for (let i = history.length - 1; i >= 0; i--) {
    const delta = history[i]?.statDelta[statKey] ?? 0;
    if (delta !== 0) return delta;
  }
  return 0;
}

function getDangerProximity(value: number): { label: string; cls: string } | null {
  if (value <= 10) return { label: `Do konce zbývá ${value} bodů`, cls: 'critical-low' };
  if (value <= 20) return { label: `${value} bodů od krize`, cls: 'warn-low' };
  if (value >= 90) return { label: `Do konce zbývá ${100 - value} bodů`, cls: 'critical-high' };
  if (value >= 80) return { label: `${100 - value} bodů od přetlaku`, cls: 'warn-high' };
  return null;
}

function getTrendLabel(total: number): string {
  if (total > 6) return 'Prudký nárůst';
  if (total > 2) return 'Mírný nárůst';
  if (total > 0) return 'Lehký nárůst';
  if (total < -6) return 'Prudký pokles';
  if (total < -2) return 'Mírný pokles';
  if (total < 0) return 'Lehký pokles';
  return 'Stabilní';
}

interface StatPopupProps {
  statKey: StatKey;
  value: number;
  history: CyklusChoiceRecord[];
  onClose: () => void;
}

function StatPopup({ statKey, value, history, onClose }: StatPopupProps) {
  const detail = STAT_DETAIL[statKey];
  const state = getStatState(value);
  const trend = getTrend(history, statKey);
  const changes = getRecentChanges(history, statKey);
  const danger = getDangerProximity(value);
  return (
    <div className="cyklus-no-select cyklus-stat-popup-overlay" onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}>
      <button className="cyklus-stat-popup-backdrop" type="button" onClick={onClose} aria-label={`Zavřít popis statu ${STAT_LABELS[statKey]}`} />
      <div className="cyklus-stat-popup" role="dialog" aria-modal="true" aria-label={`Popis statu ${STAT_LABELS[statKey]}`}>
        <div className={`cyklus-stat-popup__header cyklus-stat-popup__header--${state}`}>
          <span className="cyklus-stat-popup__name">{STAT_LABELS[statKey]}</span>
          <span className="cyklus-stat-popup__value">{value}</span>
          <button className="cyklus-stat-popup__close" type="button" onClick={onClose} aria-label="Zavřít popis statu">×</button>
        </div>
        <div className="cyklus-stat-popup__body">
          <p className="cyklus-stat-popup__description">{detail.description}</p>

          {danger && (
            <div className={`cyklus-stat-popup__danger cyklus-stat-popup__danger--${danger.cls}`}>
              {danger.label}
            </div>
          )}

          {trend.count > 0 && (
            <div className="cyklus-stat-popup__trend">
              <span className="cyklus-stat-popup__trend-label">Trend ({TREND_WINDOW} tahů):</span>
              <span className={`cyklus-stat-popup__trend-value ${trend.total > 0 ? 'cyklus-stat-popup__trend-value--up' : trend.total < 0 ? 'cyklus-stat-popup__trend-value--down' : ''}`}>
                {getTrendLabel(trend.total)} ({trend.total > 0 ? '+' : ''}{trend.total})
              </span>
            </div>
          )}

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

          {changes.length > 0 && (
            <div className="cyklus-stat-popup__history">
              <span className="cyklus-stat-popup__history-title">Poslední změny</span>
              {changes.map((c, i) => (
                <div key={`${c.cardId}-${c.turn}-${i}`} className="cyklus-stat-popup__history-row">
                  <span className="cyklus-stat-popup__history-card">{c.title}</span>
                  <span className={`cyklus-stat-popup__history-delta ${c.delta > 0 ? 'cyklus-stat-popup__history-delta--up' : 'cyklus-stat-popup__history-delta--down'}`}>
                    {c.delta > 0 ? '+' : ''}{c.delta}
                  </span>
                </div>
              ))}
            </div>
          )}

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
  highlight?: StatKey | 'all' | null | undefined;
  history: CyklusChoiceRecord[];
  climate?: CyklusRunModifier | null;
  tutorialProgress?: React.ReactNode;
  traceOpen?: boolean | undefined;
  onToggleTrace?: (() => void) | undefined;
  traceTriggerRef?: React.Ref<HTMLButtonElement> | undefined;
}

export default function StatDock({ stats, openStat, onOpenStat, highlight, history, climate, tutorialProgress, traceOpen, onToggleTrace, traceTriggerRef }: StatDockProps) {
  const previousStats = usePrevious(stats);
  const [changedKeys, setChangedKeys] = useState<Set<StatKey>>(new Set());
  const hasTraceTrigger = typeof traceOpen === 'boolean' && Boolean(onToggleTrace);

  useEffect(() => {
    if (!previousStats) return;
    const changed = new Set<StatKey>();
    for (const key of STAT_ORDER) {
      if (previousStats[key] !== stats[key]) changed.add(key);
    }
    if (changed.size === 0) return;
    setChangedKeys(changed);
    const timer = setTimeout(() => setChangedKeys(new Set()), 650);
    return () => clearTimeout(timer);
  }, [stats, previousStats]);

  return (
    <>
      <aside className={`cyklus-stat-dock ${highlight ? 'cyklus-stat-dock--highlighted' : ''} ${hasTraceTrigger ? 'cyklus-stat-dock--with-trace' : ''}`} aria-label="Stav subjektu">
        {tutorialProgress}
        {climate && (
          <div className="cyklus-stat-dock__climate">
            <span className="cyklus-stat-dock__climate-label">KLIMA</span>
            <span className="cyklus-stat-dock__climate-title">{climate.title}</span>
            <span className="cyklus-stat-dock__climate-desc">{climate.description}</span>
          </div>
        )}
        {STAT_ORDER.map((key) => {
          const value = stats[key];
          const state = getStatState(value);
          const label = statStateLabel(state, value);
          const lastDelta = getLastDelta(history, key);
          const isHighlighted = highlight === 'all' || highlight === key;
          const isChanged = changedKeys.has(key);
          return (
            <button
              key={key}
              className={[
                'cyklus-stat-chip',
                `cyklus-stat-chip--${state}`,
                `cyklus-stat-chip--${key}`,
                isHighlighted ? 'cyklus-stat-chip--highlight' : '',
                isChanged ? 'cyklus-stat-chip--changed' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onOpenStat(openStat === key ? null : key)}
              type="button"
              aria-pressed={openStat === key}
              aria-label={`${STAT_LABELS[key]}: ${value}, ${label}. Klikni pro popis.`}
            >
              <span className="cyklus-stat-chip__label">{STAT_LABELS[key]}</span>
              <span className="cyklus-stat-chip__value-group">
                <span className="cyklus-stat-chip__value">{value}</span>
                {lastDelta !== 0 && (
                  <span className={`cyklus-stat-chip__delta ${lastDelta > 0 ? 'is-up' : 'is-down'}`} aria-label={`Poslední změna ${lastDelta > 0 ? 'nahoru' : 'dolů'} ${Math.abs(lastDelta)}`}>
                    {lastDelta > 0 ? '↑' : '↓'}{Math.abs(lastDelta)}
                  </span>
                )}
              </span>
              <span className="cyklus-stat-chip__bar" role="presentation" style={{ '--stat-fill-pct': `${value}%` } as React.CSSProperties}>
                <span className="cyklus-stat-chip__zone cyklus-stat-chip__zone--low" aria-hidden="true" />
                <span className="cyklus-stat-chip__safe-zone" aria-hidden="true" />
                <span className="cyklus-stat-chip__zone cyklus-stat-chip__zone--high" aria-hidden="true" />
                <span className={`cyklus-stat-chip__fill cyklus-stat-chip__fill--${state}`} aria-hidden="true" />
                <span className="cyklus-stat-chip__center" aria-hidden="true" />
                <span className="cyklus-stat-chip__marker" aria-hidden="true" />
              </span>
              {state !== 'stable' && (
                <span className={`cyklus-stat-chip__status cyklus-stat-chip__status--${state}`}>
                  <span aria-hidden="true">!</span> {label}
                </span>
              )}
            </button>
          );
        })}
        {hasTraceTrigger && (
          <button
            ref={traceTriggerRef}
            className="cyklus-stat-dock__trace-trigger"
            type="button"
            onClick={onToggleTrace}
            aria-label="Otevřít aktuální stopu"
            aria-controls={traceOpen ? 'cyklus-current-trace-panel' : undefined}
            aria-expanded={traceOpen}
          >
            STOPA
          </button>
        )}
      </aside>
      {openStat && (
        <StatPopup
          statKey={openStat}
          value={stats[openStat]}
          history={history}
          onClose={() => onOpenStat(null)}
        />
      )}
    </>
  );
}
