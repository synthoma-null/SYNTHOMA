'use client';

import { useRef, useEffect } from 'react';
import type { EncounterState } from '../../../game/encounter/encounterTypes';
import type { RunPlayer, RunLogEntry } from '../../../game/run/runTypes';
import type { PlayerActionId } from '../../../game/encounter/encounterTypes';
import type { RunCard } from '../../../game/run/runCards';
import EnemyCard from './EnemyCard';
import ActionBar from './ActionBar';
import { getEnemyById } from '../../../game/encounter/enemies';

interface EncounterPanelProps {
  encounter: EncounterState;
  player: RunPlayer;
  log: RunLogEntry[];
  cardDefs: Record<string, RunCard>;
  onAction: (actionId: PlayerActionId) => void;
  onPlayCard: (cardId: string) => void;
  onResolveChoice: (choiceId: string) => void;
  onClaimReward: (rewardId: string) => void;
  onSkipIntro: () => void;
}

function LogEntry({ entry, isNew }: { entry: RunLogEntry; isNew: boolean }) {
  return (
    <div
      className={`encounter-panel__log-entry encounter-panel__log-entry--${entry.type} ${isNew ? 'encounter-panel__log-entry--entering' : ''}`}
    >
      {entry.message.split('\n').map((line, i) => (
        <span key={i} className="encounter-panel__log-line">{line}</span>
      ))}
    </div>
  );
}

export default function EncounterPanel({
  encounter,
  player,
  log,
  cardDefs,
  onAction,
  onPlayCard,
  onResolveChoice,
  onClaimReward,
  onSkipIntro,
}: EncounterPanelProps) {
  const recentLog = log.slice(-4);
  const lastLogIdRef = useRef<string>('');
  const newestId = recentLog[recentLog.length - 1]?.id ?? '';

  useEffect(() => {
    lastLogIdRef.current = newestId;
  }, [newestId]);

  const currentEnemy = encounter.enemies[0];
  const currentIntentDef = currentEnemy
    ? (() => {
        const def = getEnemyById(currentEnemy.definitionId);
        if (!def) return undefined;
        return def.intents[currentEnemy.currentIntentIndex % def.intents.length];
      })()
    : undefined;

  return (
    <div className={`encounter-panel encounter-panel--${encounter.type} v1-panel-strong v1-enter`}>

      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div className="encounter-panel__header">
        <span className="encounter-panel__sector-label v1-badge">
          LOG [{encounter.definitionId.toUpperCase()}]
        </span>
        {encounter.phase !== 'intro' && (
          <span className="encounter-panel__round-label v1-badge v1-badge--accent">KOLO {encounter.round}</span>
        )}
        <span className={`encounter-panel__phase-badge encounter-panel__phase-badge--${encounter.phase} v1-badge`}>
          {encounter.phase.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* ── Intro phase ─────────────────────────────────────────────────── */}
      {encounter.phase === 'intro' && (
        <div className="encounter-panel__intro">
          <div className="encounter-panel__intro-text">{encounter.introText}</div>
          <button className="encounter-panel__skip-btn btn-game-secondary v1-btn v1-btn--primary v1-glow-pulse" onClick={onSkipIntro}>
            VSTOUPIT DO SEKTORU →
          </button>
        </div>
      )}

      {/* ── Combat / actions phase ──────────────────────────────────────── */}
      {(encounter.phase === 'choose_actions' || encounter.phase === 'resolve') && (
        <div className="encounter-panel__combat">
          <div className="encounter-panel__top">
            <div className="encounter-panel__log-column">
              <div className="encounter-panel__log">
                {recentLog.length === 0 && (
                  <div className="encounter-panel__log-empty">// čekám na vstup subjektu</div>
                )}
                {recentLog.map((entry) => (
                  <LogEntry
                    key={entry.id}
                    entry={entry}
                    isNew={entry.id === newestId}
                  />
                ))}
              </div>
            </div>

            <div className="encounter-panel__enemy-column">
              {encounter.enemies.map((enemy) => (
                <EnemyCard
                  key={enemy.id}
                  enemy={enemy}
                  currentIntent={currentIntentDef?.label}
                  currentIntentType={currentIntentDef?.type}
                  currentIntentDamage={currentIntentDef?.damage}
                  isTargeted={encounter.enemies.length === 1}
                  round={encounter.round}
                />
              ))}
            </div>
          </div>

          <ActionBar
            onAction={onAction}
            onPlayCard={onPlayCard}
            hand={player.hand}
            cardDefs={cardDefs}
            phase={encounter.phase}
            incomingIntentType={currentIntentDef?.type}
          />
          {encounter.phase === 'choose_actions' && (
            <div className="encounter-panel__hint">
              // TIP: Vyber akci, poté kartu z ruky. Zelený rámeček = silná proti příchozímu záměru. Červený/slábnoucí = slabá.
            </div>
          )}
        </div>
      )}

      {/* ── Choice phase ─────────────────────────────────────────────────── */}
      {encounter.phase === 'choice' && encounter.pendingChoice && (
        <div className="encounter-panel__choice">
          <div className="encounter-panel__choice-context">{encounter.introText}</div>
          <div className="encounter-panel__choices">
            {encounter.pendingChoice.map((choice) => (
              <button
                key={choice.id}
                className="encounter-panel__choice-btn v1-action-card"
                onClick={() => onResolveChoice(choice.id)}
              >
                <span className="encounter-panel__choice-label v1-action-card__title">[{choice.label.toUpperCase()}]</span>
                <span className="encounter-panel__choice-text v1-action-card__sub">{choice.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Reward phase ─────────────────────────────────────────────────── */}
      {encounter.phase === 'reward' && encounter.rewardOptions && (
        <div className="encounter-panel__reward">
          <div className="encounter-panel__reward-title">
            LOG [REWARD]: Sektor vyčištěn. Vyberte odměnu.
          </div>
          <div className="encounter-panel__reward-options">
            {encounter.rewardOptions.map((reward) => (
              <button
                key={reward.id}
                className={`encounter-panel__reward-btn encounter-panel__reward-btn--${reward.type} v1-action-card`}
                onClick={() => onClaimReward(reward.id)}
              >
                <span className="encounter-panel__reward-type v1-action-card__title">[{reward.type.toUpperCase()}]</span>
                <span className="encounter-panel__reward-label v1-action-card__sub">{reward.label}</span>
              </button>
            ))}
          </div>
          {encounter.lastResolutionText && (
            <div className="encounter-panel__resolution-text">// {encounter.lastResolutionText}</div>
          )}
        </div>
      )}

      {/* ── Finished ─────────────────────────────────────────────────────── */}
      {encounter.phase === 'finished' && (
        <div className="encounter-panel__finished">
          <div className="encounter-panel__finished-text">
            LOG [SEKTOR_VYČIŠTĚN]: Pohybuj se dál. Mapa čeká.
          </div>
        </div>
      )}
    </div>
  );
}
