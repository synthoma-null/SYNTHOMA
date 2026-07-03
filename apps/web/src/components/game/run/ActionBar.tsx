'use client';

import type { PlayerActionId } from '../../../game/encounter/encounterTypes';
import type { RunCard } from '../../../game/run/runCards';

interface ActionBarProps {
  onAction: (actionId: PlayerActionId) => void;
  onPlayCard: (cardId: string) => void;
  hand: string[];
  cardDefs: Record<string, RunCard>;
  disabled?: boolean;
  phase?: string;
  incomingIntentType?: string | undefined;
}

interface ActionDef {
  id: PlayerActionId;
  label: string;
  sub: string;
  key: string;
  strong: string[];
  weak: string[];
}

const ACTIONS: ActionDef[] = [
  {
    id: 'attack',
    label: 'ÚTOK',
    sub: 'hrubý zásah — 6 DMG',
    key: 'A',
    strong: ['audit'],
    weak: ['mirror', 'buff_self'],
  },
  {
    id: 'dash',
    label: 'DASH',
    sub: '+8 blok · +1 Smích',
    key: 'D',
    strong: ['attack', 'sprint', 'aoe'],
    weak: ['lock_card'],
  },
  {
    id: 'hack',
    label: 'HACK',
    sub: 'přeruš záměr · 4 DMG',
    key: 'H',
    strong: ['lock_card', 'void_surge'],
    weak: ['mirror'],
  },
  {
    id: 'defend',
    label: 'OBRANA',
    sub: '+12 blok · −1 Šum',
    key: 'O',
    strong: ['attack_dot', 'steal_laugh'],
    weak: ['aoe'],
  },
  {
    id: 'sarcasm',
    label: 'SARKASMUS',
    sub: 'D6: 4–6 útok+Smích / 1–3 Šum',
    key: 'S',
    strong: ['mirror', 'buff_self'],
    weak: ['audit'],
  },
];

function getActionHint(action: ActionDef, intentType: string | undefined): 'strong' | 'weak' | null {
  if (!intentType) return null;
  if (action.strong.includes(intentType)) return 'strong';
  if (action.weak.includes(intentType)) return 'weak';
  return null;
}

export default function ActionBar({
  onAction,
  onPlayCard,
  hand,
  cardDefs,
  disabled,
  phase,
  incomingIntentType,
}: ActionBarProps) {
  const isActive = phase === 'choose_actions' && !disabled;

  return (
    <div className="action-bar v1-panel v1-enter">
      <div className="action-bar__hint-label">
        {isActive ? 'VYBER AKCI:' : phase === 'intro' ? 'INTRO' : phase?.toUpperCase()}
      </div>

      <div className="action-bar__actions">
        {ACTIONS.map((action) => {
          const hint = getActionHint(action, incomingIntentType);
          return (
            <button
              key={action.id}
              className={[
                'action-bar__btn v1-action-card',
                `action-bar__btn--${action.id}`,
                hint === 'strong' ? 'action-bar__btn--hint-strong' : '',
                hint === 'weak' ? 'action-bar__btn--hint-weak' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onAction(action.id)}
              disabled={!isActive}
              aria-label={`${action.label}: ${action.sub}`}
            >
              <span className="action-bar__btn-key">[{action.key}]</span>
              <span className="action-bar__btn-main v1-action-card__title">{action.label}</span>
              <span className="action-bar__btn-sep">//</span>
              <span className="action-bar__btn-sub v1-action-card__sub">{action.sub}</span>
              {hint === 'strong' && <span className="action-bar__btn-hint-icon v1-badge v1-badge--accent">▲</span>}
              {hint === 'weak' && <span className="action-bar__btn-hint-icon action-bar__btn-hint-icon--weak v1-badge v1-badge--danger">▼</span>}
            </button>
          );
        })}
      </div>

      {hand.length > 0 && (
        <div className="action-bar__hand">
          <span className="action-bar__hand-label">// KARTY V RUCE ({hand.length})</span>
          <div className="action-bar__cards">
            {hand.map((cardId, idx) => {
              const card = cardDefs[cardId];
              if (!card) return null;
              return (
                <button
                  key={`${cardId}-${idx}`}
                  className={`action-bar__card action-bar__card--${card.type} v1-action-card`}
                  onClick={() => onPlayCard(cardId)}
                  disabled={!isActive}
                  title={card.text}
                >
                  <span className="action-bar__card-title v1-action-card__title">{card.title}</span>
                  <span className="action-bar__card-sub v1-action-card__sub">{card.type.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
