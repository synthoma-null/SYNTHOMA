'use client';

import type { GameCard } from '../../game/types';
import { getCardById } from '../../game/cards';

interface Props {
  hand: string[];
  phase: string;
  isMyTurn: boolean;
  onPlayCard: (cardId: string) => void;
}

const CARD_TYPE_COLOR: Record<string, string> = {
  action: '#00ffe0',
  sabotage: '#ff4fa0',
  relic: '#ffe600',
  glitch: '#00ff88',
  void: '#7b2fff',
  event: '#ff7700',
};

function GameCardUI({ card, canPlay, onPlay }: { card: GameCard; canPlay: boolean; onPlay: () => void }) {
  const color = CARD_TYPE_COLOR[card.type] ?? '#888';

  return (
    <button
      className={`game-card${canPlay ? ' game-card--playable' : ''}`}
      onClick={canPlay ? onPlay : undefined}
      disabled={!canPlay}
      type="button"
      style={{ '--card-color': color } as React.CSSProperties}
    >
      <div className="game-card-type">{card.type.toUpperCase()}</div>
      <div className="game-card-title">{card.title}</div>
      <div className="game-card-text">{card.text}</div>
      <div className="game-card-flavor">{card.flavor}</div>
      <div className="game-card-timing">{card.timing}</div>
    </button>
  );
}

export function CardHand({ hand, phase, isMyTurn, onPlayCard }: Props) {
  if (hand.length === 0) {
    return <div className="card-hand card-hand--empty">Žádné karty v ruce.</div>;
  }

  return (
    <div className="card-hand">
      {hand.map((cardId) => {
        const card = getCardById(cardId);
        if (!card) return null;
        const canPlay = isMyTurn && (
          card.timing === 'any_turn' ||
          card.timing === phase ||
          card.timing === 'reaction'
        );
        return (
          <GameCardUI
            key={cardId}
            card={card}
            canPlay={canPlay}
            onPlay={() => onPlayCard(cardId)}
          />
        );
      })}
    </div>
  );
}
