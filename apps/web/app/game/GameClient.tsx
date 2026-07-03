'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GameClient() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [mode, setMode] = useState<'party' | 'coop' | 'chaos'>('party');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clientToken = (() => {
    if (typeof window === 'undefined') return '';
    let t = localStorage.getItem('synthoma_game_token');
    if (!t) {
      t = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('synthoma_game_token', t);
    }
    return t;
  })();

  const createRoom = async () => {
    if (!nickname.trim()) { setError('Zadej přezdívku.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/game/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), mode, clientToken }),
      });
      const data = await res.json() as { code?: string; playerId?: string; error?: string };
      if (!res.ok || !data.code) throw new Error(data.error ?? 'Chyba při vytváření místnosti.');
      if (data.code) {
        if (data.playerId) localStorage.setItem('synthoma_game_playerId', data.playerId);
        router.push(`/game/room/${data.code}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Neznámá chyba.');
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!nickname.trim()) { setError('Zadej přezdívku.'); return; }
    if (!joinCode.trim()) { setError('Zadej kód místnosti.'); return; }
    setLoading(true); setError('');
    try {
      const code = joinCode.trim().toUpperCase();
      const res = await fetch(`/api/game/rooms/${code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: nickname.trim(), clientToken }),
      });
      const data = await res.json() as { playerId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Chyba při připojování.');
      if (data.playerId) localStorage.setItem('synthoma_game_playerId', data.playerId);
      router.push(`/game/room/${code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Neznámá chyba.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="game-entry">
      <div className="game-entry-inner">
        <h1 className="game-entry-title">SYNTHOMA: CYKLUS</h1>
        <p className="game-entry-subtitle">
          Solo swipe-based psychologická roguelite. 4 staty, itemy, sektory, imprinty, restarty.
        </p>

        <a href="/cyklus" className="btn-game-primary game-entry-main-btn">ZAČÍT CYKLUS →</a>

        <div className="game-entry-divider">— NEBO PARTY MÓD —</div>

        <p className="game-entry-subtitle game-entry-subtitle--party">
          Online tahová party hra <em>Nezlob Prázdnotu</em> pro 2–6 hráčů. Přesuň fragmenty do Jádra dřív, než tě pohltí Prázdnota.
        </p>

        <div className="game-entry-form">
          <label className="game-field-label" htmlFor="nickname">Přezdívka</label>
          <input
            id="nickname"
            className="game-input"
            type="text"
            placeholder="SUBJEKT_???"
            maxLength={20}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <div className="game-entry-divider">— NOVÁ HRA —</div>

          <label className="game-field-label" htmlFor="mode">Mód</label>
          <select
            id="mode"
            className="game-input"
            value={mode}
            onChange={(e) => setMode(e.target.value as typeof mode)}
          >
            <option value="party">Party (doporučeno)</option>
            <option value="coop">Kooperativní</option>
            <option value="chaos">Chaos</option>
          </select>

          <button
            className="btn-game-primary"
            onClick={() => void createRoom()}
            disabled={loading}
            type="button"
          >
            {loading ? 'Vytváří se místnost…' : 'VYTVOŘIT MÍSTNOST'}
          </button>

          <div className="game-entry-divider">— PŘIPOJIT SE —</div>

          <label className="game-field-label" htmlFor="joinCode">Kód místnosti</label>
          <input
            id="joinCode"
            className="game-input game-input--code"
            type="text"
            placeholder="XXXXXX"
            maxLength={8}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />

          <button
            className="btn-game-secondary"
            onClick={() => void joinRoom()}
            disabled={loading}
            type="button"
          >
            {loading ? 'Připojování…' : 'PŘIPOJIT SE'}
          </button>

          {error && <div className="game-entry-error">{error}</div>}
        </div>
      </div>
    </div>
  );
}
