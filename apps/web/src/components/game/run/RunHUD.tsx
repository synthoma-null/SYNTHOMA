'use client';

import type { RunPlayer } from '../../../game/run/runTypes';
import { getVoidPressureLabel, getVoidPressureClass } from '../../../game/run/runEngine';

interface RunHUDProps {
  player: RunPlayer;
  voidPressure: number;
  deckSize: number;
  discardSize: number;
  act: number;
  onDeckClick?: () => void;
}

function getNoiseClass(noise: number): string {
  if (noise >= 8) return 'run-hud__bar-fill--noise-critical';
  if (noise >= 5) return 'run-hud__bar-fill--noise-high';
  return '';
}

export default function RunHUD({ player, voidPressure, deckSize, discardSize, act, onDeckClick }: RunHUDProps) {
  const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const noisePct = Math.min(100, (player.noise / 10) * 100);
  const voidPct = Math.min(100, (voidPressure / 20) * 100);
  const voidClass = getVoidPressureClass(voidPressure);
  const voidLabel = getVoidPressureLabel(voidPressure);
  const isVoidCritical = voidPressure >= 16;
  const noiseClass = getNoiseClass(player.noise);

  const fragStatus = player.statuses.find((st) => st.id === 'fragmentation');
  const otherStatuses = player.statuses.filter((st) => st.id !== 'fragmentation');

  return (
    <div className={`run-hud v1-panel ${isVoidCritical ? 'run-hud--void-critical' : ''}`}>
      <div className="run-hud__player">
        <span className="run-hud__label-prefix">SUBJEKT:</span>
        <span className="run-hud__name" style={{ color: player.color }}>{player.name}</span>
        <span className="run-hud__act v1-badge">AKT {act}</span>
      </div>

      {fragStatus && (
        <div className={`run-hud__fragmentation run-hud__fragmentation--stack${fragStatus.stacks}`}>
          ⚠ FRAGMENTACE {fragStatus.stacks}/3 — {
            fragStatus.stacks === 1 ? 'strukturální poškození' :
            fragStatus.stacks === 2 ? 'systém nestabilní' :
            'subjekt neutralizován'
          }
        </div>
      )}

      <div className="run-hud__bars">
        <div className="run-hud__bar-row">
          <span className="run-hud__bar-label">STABILITA</span>
          <div className="run-hud__bar-track v1-hud-bar">
            <div
              className={`run-hud__bar-fill run-hud__bar-fill--hp v1-hud-bar__fill v1-hud-bar__fill--hp ${hpPct <= 25 ? 'run-hud__bar-fill--hp-low' : ''}`}
              style={{ width: `${hpPct}%` }}
            />
          </div>
          <span className="run-hud__bar-value">{player.hp}/{player.maxHp}</span>
        </div>

        <div className="run-hud__bar-row">
          <span className="run-hud__bar-label">ŠUM</span>
          <div className="run-hud__bar-track v1-hud-bar">
            <div
              className={`run-hud__bar-fill run-hud__bar-fill--noise v1-hud-bar__fill v1-hud-bar__fill--noise ${noiseClass}`}
              style={{ width: `${noisePct}%` }}
            />
          </div>
          <span className="run-hud__bar-value">
            {player.noise}/10
            {player.noise >= 8 && <span className="run-hud__bar-warn"> ⚠</span>}
          </span>
        </div>

        <div className={`run-hud__bar-row run-hud__bar-row--void ${voidClass}`}>
          <span className="run-hud__bar-label">VOID</span>
          <div className="run-hud__bar-track v1-hud-bar">
            <div
              className="run-hud__bar-fill run-hud__bar-fill--void v1-hud-bar__fill v1-hud-bar__fill--void"
              style={{ width: `${voidPct}%` }}
            />
          </div>
          <span className="run-hud__bar-value">
            {voidPressure}/20
            <span className="run-hud__void-label"> [{voidLabel}]</span>
          </span>
        </div>
      </div>

      <div className="run-hud__resources">
        {player.block > 0 && (
          <div className="run-hud__resource run-hud__resource--block v1-badge v1-badge--accent">
            <span className="run-hud__resource-icon">▣</span>
            <span className="run-hud__resource-value">{player.block} BLK</span>
          </div>
        )}
        <div className="run-hud__resource run-hud__resource--laugh v1-badge">
          <span className="run-hud__resource-icon">◈</span>
          <span className="run-hud__resource-value">{player.laugh} SMÍ</span>
        </div>
      </div>

      <div
        className="run-hud__deck"
        onClick={onDeckClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onDeckClick?.()}
      >
        <span className="run-hud__deck-count">{deckSize}</span>
        <span className="run-hud__deck-label">BALÍČEK</span>
        <span className="run-hud__deck-sep">·</span>
        <span className="run-hud__discard-count">{discardSize}</span>
        <span className="run-hud__deck-label">ODPAD</span>
      </div>

      {otherStatuses.length > 0 && (
        <div className="run-hud__statuses">
          {otherStatuses.map((st) => (
            <span key={st.id} className="run-hud__status-badge" title={st.label}>
              {st.label}{st.stacks > 1 && ` ×${st.stacks}`}
              {st.turnsLeft !== undefined && ` (${st.turnsLeft})`}
            </span>
          ))}
        </div>
      )}

      {isVoidCritical && (
        <div className="run-hud__void-overlay-hint">
          {`// PRÁZDNOTA JE TADY`}
        </div>
      )}
    </div>
  );
}
