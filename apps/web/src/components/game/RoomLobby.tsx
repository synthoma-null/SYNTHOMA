'use client';

import { useState } from 'react';

interface LobbyPlayer {
  id: string;
  nickname: string;
  seatIndex: number;
  color: string;
  isHost: boolean;
}

interface Props {
  code: string;
  players: LobbyPlayer[];
  isHost: boolean;
  myPlayerId?: string | undefined;
  onStart: () => void;
  onLeave: () => void;
}

export function RoomLobby({ code, players, isHost, myPlayerId, onStart, onLeave }: Props) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStart = isHost && players.length >= 2;

  return (
    <div className="room-lobby">
      <div className="lobby-header">
        <h1 className="lobby-title">SYNTHOMA: Nezlob Prázdnotu</h1>
        <p className="lobby-subtitle">Čekejte na ostatní hráče.</p>
      </div>

      <div className="lobby-code-box">
        <div className="lobby-code-label">KÓD MÍSTNOSTI</div>
        <div className="lobby-code">{code}</div>
        <button className="btn-copy" onClick={copyCode} type="button">
          {copied ? 'ZKOPÍROVÁNO ✓' : 'KOPÍROVAT'}
        </button>
      </div>

      <div className="lobby-players">
        <div className="lobby-players-label">HRÁČI ({players.length}/6)</div>
        {players.map((p) => (
          <div key={p.id} className={`lobby-player${p.id === myPlayerId ? ' lobby-player--me' : ''}`}>
            <span className="lobby-player-color" style={{ backgroundColor: p.color }} />
            <span className="lobby-player-name">{p.nickname}</span>
            {p.isHost && <span className="lobby-player-host">HOST</span>}
            {p.id === myPlayerId && <span className="lobby-player-you">TY</span>}
          </div>
        ))}
        {players.length < 6 && (
          <div className="lobby-player-slot">
            <span className="lobby-slot-text">Čeká se na hráče...</span>
          </div>
        )}
      </div>

      <div className="lobby-actions">
        {isHost && (
          <button
            className={`btn-start${canStart ? '' : ' btn-start--disabled'}`}
            onClick={canStart ? onStart : undefined}
            disabled={!canStart}
            type="button"
          >
            {canStart ? 'SPUSTIT HRU' : 'Čeká se na hráče (min. 2)'}
          </button>
        )}
        <button className="btn-leave" onClick={onLeave} type="button">
          ODEJÍT
        </button>
      </div>
    </div>
  );
}
