'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AuditEntry } from './types';
import { errorMessage, formatAdminDate, readAdminResponse } from './utils';

const ACTIONS = [
  ['', 'Všechny akce'],
  ['mnem_adjustment', 'Změny mnemů'],
  ['access_codes_generated', 'Generování kódů'],
  ['whisper_approve', 'Schválení šepotů'],
  ['whisper_reject', 'Zamítnutí šepotů'],
  ['whisper_hide', 'Skrytí šepotů'],
] as const;

const ACTION_LABELS: Record<string, string> = {
  mnem_adjustment: 'ZMĚNA MNEMŮ',
  access_codes_generated: 'VYGENEROVÁNÍ KÓDŮ',
  whisper_approve: 'SCHVÁLENÍ ŠEPOTU',
  whisper_reject: 'ZAMÍTNUTÍ ŠEPOTU',
  whisper_hide: 'SKRYTÍ ŠEPOTU',
};

export default function AdminAuditTab() {
  const [action, setAction] = useState('');
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const query = new URLSearchParams({ limit: '75' });
      if (action) query.set('action', action);
      const response = await fetch(`/api/admin/audit?${query}`, { cache: 'no-store' });
      const data = await readAdminResponse<{ entries: AuditEntry[] }>(response);
      setEntries(data.entries);
    } catch (requestError) {
      setError(errorMessage(requestError)); setEntries([]);
    } finally { setLoading(false); }
  }, [action]);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="admin-workspace" aria-labelledby="admin-audit-title">
      <div className="admin-section-header"><div><span className="admin-eyebrow">SECURITY // AUDIT TRAIL</span><h2 id="admin-audit-title">Auditní historie</h2><p>Trvalé záznamy citlivých administrátorských zásahů.</p></div><button className="admin-action admin-action--secondary" type="button" onClick={() => void load()} disabled={loading}>OBNOVIT</button></div>
      <div className="admin-audit-toolbar"><label htmlFor="admin-audit-action">Typ akce</label><select id="admin-audit-action" value={action} onChange={(event) => setAction(event.target.value)}>{ACTIONS.map(([value, label]) => <option key={value || 'all'} value={value}>{label}</option>)}</select><span>{entries.length} záznamů</span></div>
      {error ? <p className="admin-feedback admin-feedback--error" role="alert">{error}</p> : null}
      {loading ? <div className="admin-state" role="status">Načítám auditní historii…</div> : null}
      {!loading && !error && !entries.length ? <div className="admin-state">Auditní historie je prázdná.</div> : null}
      <ol className="admin-audit-list">{entries.map((entry) => (
        <li key={entry.id}>
          <div className="admin-audit-marker" aria-hidden="true" />
          <div className="admin-audit-entry">
            <header><strong>{ACTION_LABELS[entry.action] ?? entry.action.toLocaleUpperCase()}</strong><time dateTime={entry.createdAt}>{formatAdminDate(entry.createdAt)}</time></header>
            <dl><div><dt>Provedl</dt><dd>{entry.actor?.nickname ?? entry.actorUserId}</dd></div><div><dt>Cíl</dt><dd>{entry.target?.nickname ?? entry.targetUserId}</dd></div>{entry.reference ? <div><dt>Reference</dt><dd>{entry.reference}</dd></div> : null}</dl>
            {entry.metadata ? <details><summary>Technické podrobnosti</summary><pre>{JSON.stringify(entry.metadata, null, 2)}</pre></details> : null}
          </div>
        </li>
      ))}</ol>
    </section>
  );
}
