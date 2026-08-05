'use client';

import { forwardRef, useRef, useState } from 'react';
import type { UserDetail, UserResult } from './types';
import { errorMessage, formatAdminDate, readAdminResponse } from './utils';

export default function AdminUsersTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [selected, setSelected] = useState<UserDetail | null>(null);
  const [searching, setSearching] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const detailRef = useRef<HTMLElement | null>(null);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    const normalized = query.trim();
    if (normalized.length < 2) {
      setMessage('Zadejte alespoň dva znaky.');
      return;
    }
    setSearching(true);
    setMessage(null);
    setSelected(null);
    try {
      const response = await fetch(`/api/admin/users/search?query=${encodeURIComponent(normalized)}`, { cache: 'no-store' });
      const data = await readAdminResponse<UserResult[]>(response);
      setResults(data);
      if (!data.length) setMessage('Žádný subjekt nenalezen.');
    } catch (requestError) {
      setResults([]);
      setMessage(errorMessage(requestError));
    } finally {
      setSearching(false);
    }
  }

  async function openDetail(userId: string) {
    setDetailLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, { cache: 'no-store' });
      setSelected(await readAdminResponse<UserDetail>(response));
      window.setTimeout(() => detailRef.current?.focus({ preventScroll: false }), 0);
    } catch (requestError) {
      setMessage(errorMessage(requestError));
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <section className="admin-workspace" aria-labelledby="admin-users-title">
      <div className="admin-section-header">
        <div><span className="admin-eyebrow">IDENTITY // LOOKUP</span><h2 id="admin-users-title">Subjekty</h2><p>Vyhledejte účet podle přezdívky nebo přesného e-mailu.</p></div>
      </div>
      <form className="admin-search" onSubmit={search}>
        <label htmlFor="admin-user-query">Přezdívka nebo e-mail</label>
        <div><input id="admin-user-query" value={query} onChange={(event) => setQuery(event.target.value)} minLength={2} maxLength={120} autoComplete="off" placeholder="např. subjekt42" /><button className="admin-action" type="submit" disabled={searching}>{searching ? 'HLEDÁM…' : 'HLEDAT'}</button></div>
      </form>
      {message ? <p className="admin-inline-warning" role="status">{message}</p> : null}
      {detailLoading ? <div className="admin-state" role="status">Načítám detail subjektu…</div> : null}

      {results.length ? (
        <div className="admin-table-shell">
          <table className="admin-data-table">
            <caption className="sr-only">Výsledky vyhledávání subjektů</caption>
            <thead><tr><th>Subjekt</th><th>E-mail</th><th>Role</th><th>Mnemy</th><th>Poslední přístup</th><th><span className="sr-only">Akce</span></th></tr></thead>
            <tbody>{results.map((user) => (
              <tr key={user.id} className={selected?.id === user.id ? 'is-selected' : undefined}>
                <td data-label="Subjekt"><strong>{user.nickname}</strong></td>
                <td data-label="E-mail" className="admin-breakable">{user.email}</td>
                <td data-label="Role"><span className={`admin-role admin-role--${user.role === 'admin' ? 'admin' : 'user'}`}>{user.role}</span></td>
                <td data-label="Mnemy">{user.mnemBalance.toLocaleString('cs-CZ')} mn</td>
                <td data-label="Poslední přístup">{formatAdminDate(user.lastLoginAt)}</td>
                <td><button className="admin-action admin-action--small" type="button" onClick={() => void openDetail(user.id)} disabled={detailLoading}>DETAIL</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : null}

      {selected ? <UserDetailPanel ref={detailRef} user={selected} /> : null}
    </section>
  );
}

const UserDetailPanel = forwardRef<HTMLElement, { user: UserDetail }>(function UserDetailPanel({ user }, ref) {
  const facts = [
    ['ID', user.id],
    ['E-mail', user.email],
    ['Přezdívka', user.nickname],
    ['Titul', user.profile?.title ?? '—'],
    ['Registrace', formatAdminDate(user.createdAt)],
    ['Poslední přihlášení', formatAdminDate(user.lastLoginAt)],
    ['Téma', user.settings?.theme ?? '—'],
  ];
  return (
    <section ref={ref} className="admin-subject-detail" tabIndex={-1} aria-labelledby="admin-subject-detail-title">
      <div className="admin-section-header admin-section-header--compact"><div><span className="admin-eyebrow">SUBJECT // {user.id}</span><h3 id="admin-subject-detail-title">{user.nickname}</h3></div><strong className="admin-balance">{user.mnemBalance.toLocaleString('cs-CZ')} mn</strong></div>
      <dl className="admin-facts">{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {user.run ? <div className="admin-run-grid" aria-label="Stav cyklu"><div><span>Cyklus</span><strong>{user.run.cycleNumber}</strong></div><div><span>Stabilita</span><strong>{user.run.stability}</strong></div><div><span>Tlak</span><strong>{user.run.memoryPressure}</strong></div><div><span>Stín</span><strong>{user.run.shadow}</strong></div></div> : <p className="admin-empty">Subjekt zatím nemá stav Cyklu.</p>}

      <div className="admin-detail-columns">
        <details open><summary>Ledger <span>{user.recentLedger.length}</span></summary>{user.recentLedger.length ? <div className="admin-table-shell"><table className="admin-data-table"><thead><tr><th>Datum</th><th>Částka</th><th>Důvod</th></tr></thead><tbody>{user.recentLedger.map((entry) => <tr key={entry.id}><td>{formatAdminDate(entry.createdAt)}</td><td className={entry.amount >= 0 ? 'admin-positive' : 'admin-negative'}>{entry.amount >= 0 ? '+' : ''}{entry.amount}</td><td>{entry.reason}</td></tr>)}</tbody></table></div> : <p className="admin-empty">Bez záznamů.</p>}</details>
        <details><summary>Čtení <span>{user.recentReading.length}</span></summary>{user.recentReading.length ? <ul className="admin-compact-list">{user.recentReading.map((item) => <li key={item.chapterId}><strong>{item.chapterTitle ?? item.chapterId}</strong><span>{item.progressPercent}% {item.completed ? '· dokončeno' : ''}</span></li>)}</ul> : <p className="admin-empty">Bez záznamů.</p>}</details>
        <details><summary>Rozhodnutí <span>{user.recentChoices.length}</span></summary>{user.recentChoices.length ? <ul className="admin-compact-list">{user.recentChoices.map((item, index) => <li key={`${item.chapterId}-${index}`}><strong>{item.choiceText}</strong><span>{item.chapterId} · {formatAdminDate(item.createdAt)}</span></li>)}</ul> : <p className="admin-empty">Bez záznamů.</p>}</details>
        <details><summary>Sbírka <span>{user.artifacts.length + user.badges.length}</span></summary><p className="admin-collection-line"><strong>Artefakty:</strong> {user.artifacts.map((item) => item.artifactId).join(', ') || '—'}</p><p className="admin-collection-line"><strong>Odznaky:</strong> {user.badges.map((item) => item.badgeId).join(', ') || '—'}</p></details>
      </div>
    </section>
  );
});
