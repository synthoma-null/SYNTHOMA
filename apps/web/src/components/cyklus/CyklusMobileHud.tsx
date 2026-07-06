'use client';

import { SECTOR_LABELS, STAT_LABELS, type StatKey, type CyklusRunState, type SectorId } from '../../game/cyklus/cyklusTypes';
import { getNearestExtreme, computeStabilizationProgress, getCycleChapterName } from '../../game/cyklus/cyklusEngine';

interface CyklusMobileHudProps {
  state: CyklusRunState;
  onToggleDiag: () => void;
  diagOpen: boolean;
  tutorialProgress?: React.ReactNode;
}

export default function CyklusMobileHud({ state, onToggleDiag, diagOpen, tutorialProgress }: CyklusMobileHudProps) {
  const chapter = getCycleChapterName(state.cycle);
  const near = getNearestExtreme(state.stats);
  const stab = computeStabilizationProgress(state);
  const stabDone = [stab.survivedRestart, stab.imprints >= stab.imprintsNeeded, stab.sectors >= stab.sectorsNeeded, stab.statsStable].filter(Boolean).length;

  return (
    <div className="cyklus-mobile-hud">
      <div className="cyklus-mobile-hud__top">
        <span className="cyklus-mobile-hud__cycle">CYKLUS {String(state.cycle).padStart(2, '0')}</span>
        <span className="cyklus-mobile-hud__dot">·</span>
        <span className="cyklus-mobile-hud__chapter">{chapter.title}</span>
      </div>
      <div className="cyklus-mobile-hud__bottom">
        <span className="cyklus-mobile-hud__sector">{SECTOR_LABELS[state.sector]}</span>
        <span className="cyklus-mobile-hud__progress">{state.choiceInCycle}/{12}</span>
        {near && near.distance <= 25 && (
          <span className={`cyklus-mobile-hud__risk ${near.distance <= 10 ? 'cyklus-mobile-hud__risk--critical' : ''}`}>
            {STAT_LABELS[near.stat]} {near.value}
          </span>
        )}
        <button type="button" className="cyklus-mobile-hud__diag-toggle" onClick={onToggleDiag} aria-expanded={diagOpen ? 'true' : 'false'}>
          {diagOpen ? '▲' : '▼'}
        </button>
      </div>
      {diagOpen && (
        <CyklusDiagDrawer state={state} stabDone={stabDone} tutorialProgress={tutorialProgress} />
      )}
    </div>
  );
}

function CyklusDiagDrawer({ state, stabDone, tutorialProgress }: { state: CyklusRunState; stabDone: number; tutorialProgress?: React.ReactNode }) {
  const stab = computeStabilizationProgress(state);
  const items = [
    { label: 'Přežít restart', ok: stab.survivedRestart },
    { label: `Imprinty ${stab.imprints}/${stab.imprintsNeeded}`, ok: stab.imprints >= stab.imprintsNeeded },
    { label: `Sektory ${stab.sectors}/${stab.sectorsNeeded}`, ok: stab.sectors >= stab.sectorsNeeded },
    { label: 'Rovnováha', ok: stab.statsStable },
  ];
  return (
    <div className="cyklus-diag-drawer">
      {tutorialProgress}
      {state.visitedSectors.length > 0 && (
        <div className="cyklus-diag-drawer__route">
          <span className="cyklus-diag-drawer__label">Trasa:</span>
          {state.visitedSectors.map((sector: SectorId, idx: number) => (
            <span key={`${sector}-${idx}`} className={`cyklus-diag-drawer__node ${sector === state.sector ? 'cyklus-diag-drawer__node--current' : ''}`}>
              {SECTOR_LABELS[sector]}
            </span>
          ))}
        </div>
      )}
      <div className="cyklus-diag-drawer__stab">
        <span className="cyklus-diag-drawer__label">Stabilizace {stabDone}/4</span>
        <div className="cyklus-diag-drawer__stab-items">
          {items.map((it) => (
            <span key={it.label} className={`cyklus-diag-drawer__stab-item ${it.ok ? 'cyklus-diag-drawer__stab-item--ok' : ''}`}>
              {it.ok ? '✓' : '○'} {it.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
