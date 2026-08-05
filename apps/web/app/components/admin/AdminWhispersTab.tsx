'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AdminWhisper } from './types';
import { errorMessage, formatAdminDate, readAdminResponse } from './utils';

const FILTERS = [
  { id: 'pending', label: 'ČEKAJÍCÍ' },
  { id: 'approved', label: 'SCHVÁLENÉ' },
  { id: 'rejected', label: 'ZAMÍTNUTÉ' },
  { id: 'hidden', label: 'SKRYTÉ' },
] as const;
type Filter = (typeof FILTERS)[number]['id'];
type Action = 'approve' | 'reject' | 'hide';

export default function AdminWhispersTab({ onChanged }: { onChanged: () => void }) {
  const [filter, setFilter] = useState<Filter>('pending');
  const [items, setItems] = useState<AdminWhisper[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const response = await fetch(`/api/admin/whispers?status=${filter}&limit=50`, { cache: 'no-store' });
      setItems(await readAdminResponse<AdminWhisper[]>(response));
    } catch (requestError) {
      setError(errorMessage(requestError)); setItems([]);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { void load(); }, [load]);

  async function moderate(id: string, action: Action) {
    setActionLoading(`${id}:${action}`); setError(null);
    try {
      const response = await fetch('/api/admin/whispers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, action }) });
      await readAdminResponse<{ id: string; status: string }>(response);
      setItems((current) => current.filter((item) => item.id !== id));
      onChanged();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally { setActionLoading(null); }
  }

  return (
    <section className="admin-workspace" aria-labelledby="admin-whispers-title">
      <div className="admin-section-header"><div><span className="admin-eyebrow">CONTENT // MODERATION</span><h2 id="admin-whispers-title">Moderace šepotů</h2><p>Každé rozhodnutí se zapisuje do auditní historie.</p></div><button className="admin-action admin-action--secondary" type="button" onClick={() => void load()} disabled={loading}>OBNOVIT</button></div>
      <div className="admin-filter-bar" role="group" aria-label="Filtrovat šepoty podle stavu">{FILTERS.map((item) => <button key={item.id} type="button" className={filter === item.id ? 'is-active' : undefined} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
      {error ? <p className="admin-feedback admin-feedback--error" role="alert">{error}</p> : null}
      {loading ? <div className="admin-state" role="status">Načítám šepoty…</div> : null}
      {!loading && !error && !items.length ? <div className="admin-state">V této kategorii nejsou žádné šepoty.</div> : null}
      <div className="admin-moderation-list">{items.map((item) => (
        <article key={item.id} className="admin-whisper">
          <header><div><span className="admin-role admin-role--type">{item.type}</span><strong>{item.placement}{item.chapterId ? ` · ${item.chapterId}` : ''}</strong></div><time dateTime={item.createdAt}>{formatAdminDate(item.createdAt)}</time></header>
          <p>{item.text}</p>
          <footer><span>Rezonance {item.resonanceCount}</span><div className="admin-button-row">{filter === 'pending' ? <><button className="admin-action admin-action--small admin-action--positive" type="button" onClick={() => void moderate(item.id, 'approve')} disabled={Boolean(actionLoading)}>SCHVÁLIT</button><button className="admin-action admin-action--small admin-action--danger" type="button" onClick={() => void moderate(item.id, 'reject')} disabled={Boolean(actionLoading)}>ZAMÍTNOUT</button><button className="admin-action admin-action--small admin-action--secondary" type="button" onClick={() => void moderate(item.id, 'hide')} disabled={Boolean(actionLoading)}>SKRÝT</button></> : filter === 'approved' ? <button className="admin-action admin-action--small admin-action--secondary" type="button" onClick={() => void moderate(item.id, 'hide')} disabled={Boolean(actionLoading)}>SKRÝT</button> : null}</div></footer>
        </article>
      ))}</div>
    </section>
  );
}
