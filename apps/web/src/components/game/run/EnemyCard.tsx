'use client';

import type { EnemyState } from '../../../game/encounter/encounterTypes';
import { ENEMY_FLAVOUR_TEXTS, pickFromPool } from '../../../game/encounter/textPools';

interface EnemyCardProps {
  enemy: EnemyState;
  currentIntent?: string | undefined;
  currentIntentType?: string | undefined;
  currentIntentDamage?: number | undefined;
  isTargeted?: boolean;
  round?: number;
}

const INTENT_TYPE_CLASS: Record<string, string> = {
  attack:     'enemy-card__intent--attack',
  attack_dot: 'enemy-card__intent--dot',
  lock_card:  'enemy-card__intent--lock',
  audit:      'enemy-card__intent--audit',
  steal_laugh:'enemy-card__intent--steal',
  aoe:        'enemy-card__intent--aoe',
  mirror:     'enemy-card__intent--mirror',
  sprint:     'enemy-card__intent--attack',
  buff_self:  'enemy-card__intent--buff',
  void_surge: 'enemy-card__intent--void',
};

export default function EnemyCard({
  enemy,
  currentIntent,
  currentIntentType,
  currentIntentDamage,
  isTargeted,
  round = 0,
}: EnemyCardProps) {
  const hpPct = Math.max(0, Math.min(100, (enemy.hp / enemy.maxHp) * 100));
  const isDead = enemy.hp <= 0;
  const isDanger = currentIntentType === 'attack' && (currentIntentDamage ?? 0) >= 5;
  const intentClass = currentIntentType ? (INTENT_TYPE_CLASS[currentIntentType] ?? '') : '';
  const flavourPool = ENEMY_FLAVOUR_TEXTS[enemy.definitionId] ?? [];
  const flavour = flavourPool.length > 0 ? pickFromPool(flavourPool, round, round + 3) : '';

  return (
    <div
      className={[
        'enemy-card v1-enemy-card v1-panel-strong',
        isDead ? 'enemy-card--dead' : '',
        isTargeted ? 'enemy-card--targeted v1-enemy-card--targeted' : '',
        isDanger ? 'enemy-card--danger' : '',
        enemy.isBoss ? 'enemy-card--boss' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="enemy-card__header">
        <span className="enemy-card__entity-prefix">ENTITY:</span>
        <span className="enemy-card__name v1-enemy-card__name">{enemy.name}</span>
        {enemy.bossPhase !== undefined && (
          <span className="enemy-card__phase v1-badge v1-badge--danger">FÁZE {enemy.bossPhase + 1}</span>
        )}
      </div>

      {flavour && (
        <div className="enemy-card__flavour">{`// ${flavour}`}</div>
      )}

      <div className="enemy-card__stability-label">
        Stabilita entity: {enemy.hp}/{enemy.maxHp}
      </div>
      <div className="enemy-card__hp-bar v1-enemy-card__hp-bar">
        <div
          className="enemy-card__hp-fill v1-enemy-card__hp-fill"
          style={{ width: `${hpPct}%` }}
        />
      </div>

      {enemy.armor > 0 && (
        <div className="enemy-card__armor">
          <span className="enemy-card__armor-label">BRNĚNÍ {enemy.armor}</span>
        </div>
      )}

      {currentIntent && (
        <div className={`enemy-card__intent v1-enemy-card__intent ${intentClass} ${isDanger ? 'enemy-card__intent--danger' : ''}`}>
          <span className="enemy-card__intent-label">ZÁMĚR ENTITY:</span>
          <span className="enemy-card__intent-text">{currentIntent}</span>
          {isDanger && currentIntentDamage && (
            <span className="enemy-card__intent-damage v1-badge v1-badge--danger">⚠ {currentIntentDamage} DMG</span>
          )}
        </div>
      )}

      {enemy.statuses.length > 0 && (
        <div className="enemy-card__statuses">
          {enemy.statuses.map((st) => (
            <span key={st.id} className="enemy-card__status-badge v1-badge">
              {st.label}
              {st.stacks > 1 && ` ×${st.stacks}`}
              {st.turnsLeft !== undefined && ` (${st.turnsLeft})`}
            </span>
          ))}
        </div>
      )}

      {enemy.block > 0 && (
        <div className="enemy-card__block v1-badge v1-badge--accent">▣ BLK {enemy.block}</div>
      )}

      {isDead && (
        <div className="enemy-card__dead-overlay">
          <span>ENTITA NEUTRALIZOVÁNA</span>
        </div>
      )}
    </div>
  );
}
