'use client';

import { useState } from 'react';
import type { GameResult } from '../../game/types';

interface Props {
  result: GameResult;
  onPlayAgain: () => void;
}

const REASON_TEXT: Record<string, string> = {
  fragments: 'Fragmenty dosáhly Jádra.',
  void_collapse: 'Prázdnota pohltila systém.',
  boss_defeated: 'Nekonečný Formulář byl poražen.',
  boss_victory: 'Nekonečný Formulář zvítězil.',
};

export function EndGameReport({ result, onPlayAgain }: Props) {
  const [sharedId, setSharedId] = useState<string | null>(null);
  const winner = result.players[0];

  const copyShare = (playerId: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setSharedId(playerId);
    setTimeout(() => setSharedId(null), 2000);
  };

  return (
    <div className="endgame-report">
      <div className="endgame-header">
        <div className="endgame-status">
          {result.won ? '✓ KONEC HRY' : '✗ SYSTÉM SELHAL'}
        </div>
        <h2 className="endgame-title">
          {result.won ? 'Fragmenty zachráněny' : 'Prázdnota zvítězila'}
        </h2>
        <p className="endgame-reason">{REASON_TEXT[result.reason] ?? result.reason}</p>
        <div className="endgame-stats">
          <span>Tahy: {result.turnsPlayed}</span>
          <span>Void tlak: {result.voidPressure}/20</span>
        </div>
      </div>

      <div className="endgame-players">
        {result.players.map((player, idx) => (
          <div
            key={player.playerId}
            className={`endgame-player${idx === 0 ? ' endgame-player--winner' : ''}`}
          >
            <div className="ep-rank">#{idx + 1}</div>
            <div className="ep-name">{player.name}</div>
            <div className="ep-archetype">{player.archetype}</div>
            <div className="ep-stats">
              <span>Otisk: {player.otisk}</span>
              <span>Fragmenty: {player.fragmentsFinished}</span>
              <span>Smích: {player.laugh}</span>
              <span>Šum: {player.noise}</span>
              <span>Sabotáže: {player.sabotageCount}</span>
            </div>
            <button
              className="btn-share"
              onClick={() => copyShare(player.playerId, player.shareText)}
              type="button"
            >
              {sharedId === player.playerId ? 'ZKOPÍROVÁNO ✓' : 'SDÍLET VÝSLEDEK'}
            </button>
          </div>
        ))}
      </div>

      {winner && (
        <div className="endgame-winner-text">
          Vítěz: <strong>{winner.name}</strong> — {winner.archetype}
        </div>
      )}

      <button className="btn-play-again" onClick={onPlayAgain} type="button">
        NOVÁ HRA
      </button>
    </div>
  );
}
