'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { GameState } from '../../../../src/game/types';
import type { GameAction } from '../../../../src/game/reducer';
import { GameShell } from '../../../../src/components/game/GameShell';
import { RoomLobby } from '../../../../src/components/game/RoomLobby';

const POLL_INTERVAL_MS = 2000;

interface LobbyPlayer {
  id: string;
  nickname: string;
  seatIndex: number;
  color: string;
  isHost: boolean;
}

interface RoomData {
  code: string;
  status: string;
  mode: string;
  stateVersion: number;
  stateJson: GameState;
  mySeatIndex: number | null;
  myGamePlayerId: string | null;
  players: LobbyPlayer[];
}

export default function RoomClient() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params?.code === 'string' ? params.code : '';

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [error, setError] = useState('');
  const seenVersion = useRef(-1);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [myPlayerId, setMyPlayerId] = useState<string | undefined>(undefined);
  const [clientToken, setClientToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setMyPlayerId(localStorage.getItem('synthoma_game_playerId') ?? undefined);
    setClientToken(localStorage.getItem('synthoma_game_token') ?? undefined);
  }, []);

  const fetchRoom = useCallback(async () => {
    const ct = localStorage.getItem('synthoma_game_token') ?? '';
    try {
      const res = await fetch(`/api/game/rooms/${code}?ct=${encodeURIComponent(ct)}`);
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setError(d.error ?? 'Místnost nenalezena.');
        return;
      }
      const data = await res.json() as RoomData;
      if (data.stateVersion !== seenVersion.current) {
        seenVersion.current = data.stateVersion;
        setRoomData(data);
      }
    } catch {
      setError('Chyba připojení.');
    }
  }, [code]);

  useEffect(() => {
    void fetchRoom();
    pollRef.current = setInterval(() => { void fetchRoom(); }, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchRoom]);

  const handleAction = useCallback(async (action: GameAction) => {
    if (!roomData || !myPlayerId) return;
    await fetch(`/api/game/rooms/${code}/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerId: myPlayerId,
        clientToken,
        action,
        stateVersion: roomData.stateVersion,
      }),
    });
    void fetchRoom();
  }, [roomData, myPlayerId, clientToken, code, fetchRoom]);

  const handleStart = useCallback(async () => {
    await fetch(`/api/game/rooms/${code}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playerId: myPlayerId, clientToken }),
    });
    void fetchRoom();
  }, [code, fetchRoom, myPlayerId, clientToken]);

  const handleLeave = () => router.push('/game');

  if (error) {
    return (
      <div className="room-error">
        <p>{error}</p>
        <button onClick={handleLeave} type="button">← Zpět</button>
      </div>
    );
  }

  if (!roomData) {
    return <div className="room-loading">Načítám místnost…</div>;
  }

  const myPlayer = roomData.players.find((p) => p.id === myPlayerId);
  const isHost = myPlayer?.isHost ?? false;

  if (roomData.status === 'lobby') {
    return (
      <RoomLobby
        code={roomData.code}
        players={roomData.players}
        isHost={isHost}
        myPlayerId={myPlayerId}
        onStart={() => void handleStart()}
        onLeave={handleLeave}
      />
    );
  }

  const gamePlayerId = roomData.myGamePlayerId ?? myPlayerId;

  return (
    <GameShell
      initialState={roomData.stateJson}
      myPlayerId={gamePlayerId ?? undefined}
      onAction={(action) => void handleAction(action)}
      isOnline
    />
  );
}
