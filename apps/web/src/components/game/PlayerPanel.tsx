'use client';

import type { GamePlayer, GamePiece } from '../../game/types';

interface Props {
  players: GamePlayer[];
  pieces: GamePiece[];
  activePlayerId: string;
  myPlayerId?: string | undefined;
}

const FRAGMENT_ICON: Record<string, string> = { memory: '◈', laugh: '◉', choice: '◆' };

export function PlayerPanel({ players, pieces, activePlayerId, myPlayerId }: Props) {
  return (
    <div className="player-panel">
      {players.map((player) => {
        const isActive = player.id === activePlayerId;
        const isMe = player.id === myPlayerId;
        const myPieces = pieces.filter((p) => p.playerId === player.id);
        const finished = myPieces.filter((p) => p.finished).length;

        return (
          <div
            key={player.id}
            className={`player-card${isActive ? ' player-card--active' : ''}${isMe ? ' player-card--me' : ''}`}
            style={{ '--player-color': player.color } as React.CSSProperties}
          >
            <div className="player-card-header">
              <span className="player-name">{player.name}</span>
              {isMe && <span className="player-me-tag">TY</span>}
              {isActive && <span className="player-turn-tag">NA TAHU</span>}
              {player.status === 'disconnected' && <span className="player-dc-tag">DC</span>}
            </div>
            <div className="player-resources">
              <span className="res-noise" title="Šum">⚡{player.resources.noise}</span>
              <span className="res-laugh" title="Smích">◉{player.resources.laugh}</span>
              <span className="res-frags" title="Fragmenty">◈{finished}/{myPieces.length}</span>
            </div>
            <div className="player-pieces">
              {myPieces.map((piece) => (
                <span
                  key={piece.id}
                  className={`piece-dot piece-dot--${piece.kind}${piece.finished ? ' piece-dot--done' : ''}`}
                  title={`${FRAGMENT_ICON[piece.kind] ?? '?'} ${piece.kind}`}
                >
                  {FRAGMENT_ICON[piece.kind] ?? '?'}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
