'use client';

import type { ReactNode } from 'react';
import CyklusCardOverlay from './CyklusCardOverlay';
import { formatDelta } from '../../game/cyklus/cyklusFormat';
import {
  SECTOR_LABELS,
  STAT_LABELS,
  type CyklusRunState,
  type StatKey,
} from '../../game/cyklus/cyklusTypes';

const STAT_ORDER: StatKey[] = ['energy', 'memory', 'bond', 'control'];

function splitNoticeText(text: string): string[] {
  return text.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function CycleNoticeFrame({
  variant,
  title,
  actionLabel,
  onClose,
  children,
}: {
  variant: 'forecast' | 'summary';
  title: string;
  actionLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <CyklusCardOverlay label={title} variant={variant} onClose={onClose} panelClassName={`cyklus-cycle-notice cyklus-cycle-notice--${variant}`}>
        <header className="cyklus-cycle-notice__header">
          <h2>{title}</h2>
          <button className="cyklus-cycle-notice__close" type="button" onClick={onClose} aria-label={`Zavřít: ${title}`}>×</button>
        </header>
        {children}
        <footer className="cyklus-cycle-notice__actions">
          <button data-card-overlay-primary className="cyklus-terminal-action cyklus-cycle-notice__primary" type="button" onClick={onClose}>
            {actionLabel}
          </button>
        </footer>
    </CyklusCardOverlay>
  );
}

export function CycleForecastNotice({ state, text, onClose }: { state: CyklusRunState; text: string; onClose: () => void }) {
  const sortedStats = STAT_ORDER.map((key) => [key, state.stats[key]] as const).sort((a, b) => b[1] - a[1]);
  const highest = sortedStats[0];
  const lowest = sortedStats[sortedStats.length - 1];
  const pressures: Array<{ key: StatKey; direction: 'up' | 'down' }> = [];
  if (highest && highest[1] > 65) pressures.push({ key: highest[0], direction: 'up' });
  if (lowest && lowest[1] < 35 && lowest[0] !== highest?.[0]) pressures.push({ key: lowest[0], direction: 'down' });

  return (
    <CycleNoticeFrame
      variant="forecast"
      title={`PREDIKCE CYKLU ${String(state.cycle).padStart(2, '0')}`}
      actionLabel="VSTOUPIT DO CYKLU"
      onClose={onClose}
    >
      <div className="cyklus-cycle-forecast">
        <div className="cyklus-cycle-forecast__diagnostic" aria-hidden="true">
          <span className="cyklus-cycle-forecast__signal" />
          <span className="cyklus-cycle-forecast__glyph">◇</span>
          <span className="cyklus-cycle-forecast__signal" />
        </div>
        <dl className="cyklus-cycle-forecast__readout">
          <div>
            <dt>KLIMA</dt>
            <dd>{state.modifier.title}</dd>
          </div>
          {pressures.length > 0 && (
            <div>
              <dt>OČEKÁVANÝ TLAK</dt>
              <dd className="cyklus-cycle-forecast__pressures">
                {pressures.map(({ key, direction }) => (
                  <span key={key}>{STAT_LABELS[key]} <span aria-hidden="true">{direction === 'up' ? '▲' : '▼'}</span></span>
                ))}
              </dd>
            </div>
          )}
        </dl>
        <div className="cyklus-cycle-forecast__copy">
          {splitNoticeText(text).map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
        </div>
      </div>
    </CycleNoticeFrame>
  );
}

export function CycleSummaryNotice({ state, text, onClose }: { state: CyklusRunState; text: string; onClose: () => void }) {
  const cycleNumber = state.cycle - 1;
  const cycleHistory = state.history.filter((record) => record.cycle === cycleNumber);
  const sectors = new Set(cycleHistory.map((record) => record.sectorAfter));
  const statDeltas = Object.fromEntries(STAT_ORDER.map((key) => [
    key,
    cycleHistory.reduce((total, record) => total + (record.statDelta[key] ?? 0), 0),
  ])) as Record<StatKey, number>;
  const imprintsGained = cycleHistory.reduce((total, record) => total + record.imprintsGained.length, 0);
  const itemsGained = cycleHistory.reduce((total, record) => total + record.itemsGained.length, 0);
  const tracesGained = cycleHistory.reduce((total, record) => total + record.flagsGained.length, 0);

  return (
    <CycleNoticeFrame
      variant="summary"
      title={`CYKLUS ${String(cycleNumber).padStart(2, '0')} UZAVŘEN`}
      actionLabel="POKRAČOVAT"
      onClose={onClose}
    >
      <div className="cyklus-cycle-summary">
        <div className="cyklus-cycle-summary__metrics" aria-label="Souhrn cyklu">
          <div><strong>{cycleHistory.length}</strong><span>ROZHODNUTÍ</span></div>
          <div><strong>{sectors.size}</strong><span>NAVŠTÍVENÉ SEKTORY</span></div>
          {imprintsGained > 0 && <div><strong>{imprintsGained}</strong><span>NOVÉ OTISKY</span></div>}
          {imprintsGained === 0 && itemsGained > 0 && <div><strong>{itemsGained}</strong><span>NOVÉ PŘEDMĚTY</span></div>}
          {imprintsGained === 0 && itemsGained === 0 && tracesGained > 0 && <div><strong>{tracesGained}</strong><span>NOVÉ STOPY</span></div>}
        </div>
        <div className="cyklus-cycle-summary__stats" aria-label="Změny statů">
          {STAT_ORDER.map((key) => (
            <div key={key} className="cyklus-cycle-summary__stat">
              <span>{STAT_LABELS[key]}</span>
              <strong>{formatDelta(statDeltas[key])}</strong>
            </div>
          ))}
        </div>
        <div className="cyklus-cycle-summary__copy">
          {splitNoticeText(text).map((line, index) => <p key={`${index}-${line}`}>{line}</p>)}
        </div>
        {sectors.size > 0 && (
          <p className="cyklus-cycle-summary__sectors">
            <span>TRASA</span> {[...sectors].map((sector) => SECTOR_LABELS[sector]).join(' / ')}
          </p>
        )}
      </div>
    </CycleNoticeFrame>
  );
}
