'use client';

import { useCallback, useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Overview {
  userCount: number;
  ledgerCount: number;
  unusedCodes: number;
  usedCodes: number;
  pendingWhispers: number;
  approvedWhispers: number;
  totalMnemBalance: number;
}

interface UserResult {
  id: string;
  email: string;
  nickname: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  mnemBalance: number;
}

interface LedgerEntry {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

interface UserDetail extends UserResult {
  profile: {
    displayName?: string;
    bio?: string;
    title?: string;
    publicProfile?: boolean;
  } | null;
  settings: { theme?: string; ttsEnabled?: boolean } | null;
  recentLedger: LedgerEntry[];
  recentReading: { chapterId: string; chapterTitle?: string; progressPercent: number; completed: boolean }[];
  recentChoices: { chapterId: string; choiceText: string; createdAt: string }[];
  run: { cycleNumber: number; stability: number; memoryPressure: number; shadow: number } | null;
  artifacts: { artifactId: string }[];
  badges: { badgeId: string }[];
}

interface AdminWhisper {
  id: string;
  userId: string;
  type: string;
  text: string;
  status: string;
  placement: string;
  chapterId: string | null;
  resonanceCount: number;
  createdAt: string;
}

type Tab = 'overview' | 'users' | 'mnems' | 'codes' | 'whispers' | 'log';

const PACKAGE_IDS = [
  { value: 'single-fragment', label: 'single-fragment  (64 mn)' },
  { value: 'act-1', label: 'act-1  (256 mn)' },
  { value: 'archiv-1024', label: 'archiv-1024  (1024 mn)' },
  { value: 'archiv-plus', label: 'archiv-plus  (subscription)' },
];

const TABS: { id: Tab; label: string; log: string }[] = [
  { id: 'overview', label: 'PŘEHLED', log: 'OVERVIEW' },
  { id: 'users', label: 'UŽIVATELÉ', log: 'USER_LOOKUP' },
  { id: 'mnems', label: 'LEDGER', log: 'MNEM_GRANT' },
  { id: 'codes', label: 'KÓDY', log: 'CODE_GEN' },
  { id: 'whispers', label: 'ŠEPOTY', log: 'WHISPER_MOD' },
  { id: 'log', label: 'SYSTÉM', log: 'SYSTEM_LOG' },
];

function fmt(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('cs-CZ', { dateStyle: 'short', timeStyle: 'short' });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OverviewTab({ overview, loading, error }: { overview: Overview | null; loading: boolean; error: string | null }) {
  if (loading) return <p className="admin-overview-loading">LOG [LOADING]: Načítám data…</p>;
  if (error || !overview) return <p className="admin-result admin-result--err">{error ?? 'Přehled se nepodařilo načíst.'}</p>;

  const rows: { label: string; value: string | number; accent?: boolean; warn?: boolean }[] = [
    { label: 'Uživatelé celkem', value: overview.userCount },
    { label: 'MnemLedger záznamy', value: overview.ledgerCount },
    { label: 'Celkem mnemů v oběhu', value: `${overview.totalMnemBalance} mn`, accent: overview.totalMnemBalance > 0 },
    { label: 'Nepoužité redeem kódy', value: overview.unusedCodes, accent: true },
    { label: 'Použité redeem kódy', value: overview.usedCodes },
    { label: 'Šepoty ke schválení', value: overview.pendingWhispers, warn: overview.pendingWhispers > 0 },
    { label: 'Schválené šepoty', value: overview.approvedWhispers },
  ];

  return (
    <section className="admin-panel os-surface os-surface--glass admin-panel--full">
      <p className="admin-panel-log">LOG [OVERVIEW]:</p>
      <h2 className="admin-panel-title">RYCHLÝ PŘEHLED</h2>
      <dl className="admin-overview-list">
        {rows.map((r) => (
          <div key={r.label} className="admin-overview-row">
            <dt className="admin-overview-label">{r.label}</dt>
            <dd className={`admin-overview-value${r.accent ? ' admin-overview-value--ok' : r.warn ? ' admin-overview-value--warn' : ''}`}>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function UserLookupTab() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState<string | null>(null);
  const [selected, setSelected] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailErr, setDetailErr] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length < 2) return;
    setSearching(true);
    setSearchErr(null);
    setResults([]);
    setSelected(null);
    try {
      const r = await fetch(`/api/admin/users/search?query=${encodeURIComponent(query.trim())}`);
      const data = await r.json();
      if (!r.ok) { setSearchErr(data.error ?? 'Chyba.'); return; }
      setResults(data as UserResult[]);
      if ((data as UserResult[]).length === 0) setSearchErr('Žádný subjekt nenalezen.');
    } catch { setSearchErr('Chyba sítě.'); }
    finally { setSearching(false); }
  }

  async function loadDetail(userId: string) {
    setDetailLoading(true);
    setDetailErr(null);
    setSelected(null);
    try {
      const r = await fetch(`/api/admin/users/${userId}`);
      const data = await r.json();
      if (!r.ok) { setDetailErr(data.error ?? 'Chyba.'); return; }
      setSelected(data as UserDetail);
    } catch { setDetailErr('Chyba sítě.'); }
    finally { setDetailLoading(false); }
  }

  return (
    <div className="admin-user-lookup">
      <section className="admin-panel os-surface os-surface--glass">
        <p className="admin-panel-log">LOG [USER_LOOKUP]:</p>
        <h2 className="admin-panel-title">VYHLEDAT SUBJEKT</h2>
        <form onSubmit={handleSearch} className="admin-form admin-form--row">
          <input
            className="admin-input admin-input--grow"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e-mail nebo přezdívka…"
            autoComplete="off"
            minLength={2}
            required
          />
          <button type="submit" className="btn admin-btn" disabled={searching}>
            {searching ? 'HLEDÁM…' : 'HLEDAT'}
          </button>
        </form>
        {searchErr && <p className="admin-result admin-result--err">{searchErr}</p>}
        {results.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Přezdívka</th>
                  <th>E-mail</th>
                  <th>Role</th>
                  <th>Mnemy</th>
                  <th>Registrace</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {results.map((u) => (
                  <tr key={u.id} className={selected?.id === u.id ? 'admin-table-row--active' : ''}>
                    <td className="admin-table-mono">{u.nickname}</td>
                    <td className="admin-table-mono admin-table-dim">{u.email}</td>
                    <td>
                      <span className={`admin-badge ${u.role === 'admin' ? 'admin-badge--admin' : 'admin-badge--user'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="admin-table-mono">{u.mnemBalance} mn</td>
                    <td className="admin-table-dim">{fmt(u.createdAt)}</td>
                    <td>
                      <button className="btn admin-btn admin-btn--sm" onClick={() => loadDetail(u.id)}>
                        DETAIL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {detailLoading && <p className="admin-overview-loading">LOG [LOADING]: Načítám detail subjektu…</p>}
      {detailErr && <p className="admin-result admin-result--err">{detailErr}</p>}
      {selected && <UserDetailPanel user={selected} />}
    </div>
  );
}

function UserDetailPanel({ user }: { user: UserDetail }) {
  return (
    <section className="admin-panel os-surface os-surface--glass admin-panel--full admin-detail">
      <p className="admin-panel-log">LOG [SUBJECT_DETAIL]: {user.nickname}</p>
      <h2 className="admin-panel-title">DETAIL SUBJEKTU</h2>

      <div className="admin-detail-grid">
        <div className="admin-detail-col">
          <p className="admin-label">ID</p>
          <p className="admin-table-mono admin-table-dim">{user.id}</p>
          <p className="admin-label">E-mail</p>
          <p className="admin-table-mono">{user.email}</p>
          <p className="admin-label">Přezdívka</p>
          <p className="admin-table-mono">{user.nickname}</p>
          <p className="admin-label">Role</p>
          <span className={`admin-badge ${user.role === 'admin' ? 'admin-badge--admin' : 'admin-badge--user'}`}>{user.role}</span>
          <p className="admin-label">Titul</p>
          <p className="admin-table-mono">{user.profile?.title ?? '—'}</p>
          <p className="admin-label">Registrace</p>
          <p className="admin-table-dim">{fmt(user.createdAt)}</p>
          <p className="admin-label">Poslední přihlášení</p>
          <p className="admin-table-dim">{fmt(user.lastLoginAt)}</p>
          <p className="admin-label">Mnem balance</p>
          <p className="admin-overview-value admin-overview-value--ok">{user.mnemBalance} mn</p>
        </div>

        <div className="admin-detail-col">
          {user.run && (
            <>
              <p className="admin-label">Aktivní cyklus</p>
              <div className="admin-run-stats">
                <span>Cyklus {user.run.cycleNumber}</span>
                <span>Stabilita {user.run.stability}</span>
                <span>Tlak {user.run.memoryPressure}</span>
                <span>Stín {user.run.shadow}</span>
              </div>
            </>
          )}
          <p className="admin-label">Artefakty ({user.artifacts.length})</p>
          <p className="admin-table-dim admin-table-mono">{user.artifacts.map((a) => a.artifactId).join(', ') || '—'}</p>
          <p className="admin-label">Odznaky ({user.badges.length})</p>
          <p className="admin-table-dim admin-table-mono">{user.badges.map((b) => b.badgeId).join(', ') || '—'}</p>
        </div>
      </div>

      {user.recentLedger.length > 0 && (
        <>
          <p className="admin-panel-log admin-section-head">POSLEDNÍCH {user.recentLedger.length} ZÁZNAMŮ LEDGERU</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Datum</th><th>Částka</th><th>Důvod</th></tr></thead>
              <tbody>
                {user.recentLedger.map((e) => (
                  <tr key={e.id}>
                    <td className="admin-table-dim">{fmt(e.createdAt)}</td>
                    <td className={`admin-table-mono ${e.amount >= 0 ? 'admin-pos' : 'admin-neg'}`}>
                      {e.amount >= 0 ? '+' : ''}{e.amount}
                    </td>
                    <td className="admin-table-dim">{e.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {user.recentReading.length > 0 && (
        <>
          <p className="admin-panel-log admin-section-head">POSTUP ČTENÍ</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Kapitola</th><th>Postup</th><th>Dokončeno</th></tr></thead>
              <tbody>
                {user.recentReading.map((r) => (
                  <tr key={r.chapterId}>
                    <td className="admin-table-mono">{r.chapterTitle ?? r.chapterId}</td>
                    <td className="admin-table-mono">{r.progressPercent}%</td>
                    <td>{r.completed ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {user.recentChoices.length > 0 && (
        <>
          <p className="admin-panel-log admin-section-head">POSLEDNÍ VOLBY</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Kapitola</th><th>Volba</th><th>Datum</th></tr></thead>
              <tbody>
                {user.recentChoices.map((c, i) => (
                  <tr key={i}>
                    <td className="admin-table-mono admin-table-dim">{c.chapterId}</td>
                    <td className="admin-table-dim">{c.choiceText}</td>
                    <td className="admin-table-dim">{fmt(c.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}

function MnemsTab({ onGrantSuccess }: { onGrantSuccess: () => void }) {
  const [grantId, setGrantId] = useState('');
  const [grantAmount, setGrantAmount] = useState('');
  const [grantReason, setGrantReason] = useState('admin_grant');
  const [grantStatus, setGrantStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [grantLoading, setGrantLoading] = useState(false);
  const [recentGrants, setRecentGrants] = useState<{ nickname: string; amount: number; reason: string; newBalance: number }[]>([]);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setGrantLoading(true);
    setGrantStatus(null);
    try {
      const r = await fetch('/api/admin/mnems/grant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': `admin:mnem:${crypto.randomUUID()}`,
        },
        body: JSON.stringify({
          identifier: grantId.trim(),
          amount: parseInt(grantAmount, 10),
          reason: grantReason.trim() || 'admin_grant',
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setGrantStatus({ ok: false, msg: data.error ?? 'Neznámá chyba.' });
      } else {
        const msg = `LOG [MNEM_GRANT_OK]: Zapsáno do ledgeru. Balance: ${data.newBalance} mn → ${data.user.nickname}`;
        setGrantStatus({ ok: true, msg });
        setRecentGrants((prev) => [
          { nickname: data.user.nickname, amount: data.entry.amount, reason: data.entry.reason, newBalance: data.newBalance },
          ...prev.slice(0, 9),
        ]);
        setGrantId('');
        setGrantAmount('');
        setGrantReason('admin_grant');
        onGrantSuccess();
      }
    } catch { setGrantStatus({ ok: false, msg: 'Chyba sítě.' }); }
    finally { setGrantLoading(false); }
  }

  return (
    <div className="admin-mnems-layout">
      <section className="admin-panel os-surface os-surface--glass">
        <p className="admin-panel-log">LOG [MNEM_GRANT]:</p>
        <h2 className="admin-panel-title">ZAPSAT MNEMY DO LEDGERU</h2>
        <p className="admin-panel-note">Kladné nebo záporné. Každý zásah je trvalý záznam.</p>
        <form onSubmit={handleGrant} className="admin-form">
          <label className="admin-label" htmlFor="grant-id">E-mail nebo přezdívka</label>
          <input id="grant-id" className="admin-input" type="text" value={grantId}
            onChange={(e) => setGrantId(e.target.value)} placeholder="subjekt42 nebo user@example.com"
            required autoComplete="off" />

          <label className="admin-label" htmlFor="grant-amount">Amount (kladné / záporné, max ±100 000)</label>
          <input id="grant-amount" className="admin-input" type="number" value={grantAmount}
            onChange={(e) => setGrantAmount(e.target.value)} placeholder="256"
            min="-100000" max="100000" step="1" required />

          <label className="admin-label" htmlFor="grant-reason">Reason</label>
          <input id="grant-reason" className="admin-input" type="text" value={grantReason}
            onChange={(e) => setGrantReason(e.target.value)} placeholder="admin_grant" maxLength={100} />

          <button type="submit" className="btn admin-btn" disabled={grantLoading}>
            {grantLoading ? 'ZAPISUJI…' : 'ZAPSAT DO LEDGERU'}
          </button>
        </form>
        {grantStatus && (
          <p className={`admin-result ${grantStatus.ok ? 'admin-result--ok' : 'admin-result--err'}`}>
            {grantStatus.msg}
          </p>
        )}
      </section>

      {recentGrants.length > 0 && (
        <section className="admin-panel os-surface os-surface--glass">
          <p className="admin-panel-log">LOG [RECENT_GRANTS]:</p>
          <h2 className="admin-panel-title">POSLEDNÍ RUČNÍ ZÁSAHY (tato session)</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Subjekt</th><th>Částka</th><th>Důvod</th><th>Nový stav</th></tr></thead>
              <tbody>
                {recentGrants.map((g, i) => (
                  <tr key={i}>
                    <td className="admin-table-mono">{g.nickname}</td>
                    <td className={`admin-table-mono ${g.amount >= 0 ? 'admin-pos' : 'admin-neg'}`}>
                      {g.amount >= 0 ? '+' : ''}{g.amount}
                    </td>
                    <td className="admin-table-dim">{g.reason}</td>
                    <td className="admin-table-mono">{g.newBalance} mn</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function CodesTab() {
  const [codePackage, setCodePackage] = useState('single-fragment');
  const [codeCount, setCodeCount] = useState('5');
  const [codeDays, setCodeDays] = useState('90');
  const [codeResult, setCodeResult] = useState<string[] | null>(null);
  const [codeStatus, setCodeStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerateCodes(e: React.FormEvent) {
    e.preventDefault();
    setCodeLoading(true);
    setCodeResult(null);
    setCodeStatus(null);
    setCopied(false);
    try {
      const r = await fetch('/api/admin/redeem-codes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: codePackage,
          count: parseInt(codeCount, 10),
          expiresDays: parseInt(codeDays, 10),
        }),
      });
      const data = await r.json();
      if (!r.ok) {
        setCodeStatus({ ok: false, msg: data.error ?? 'Neznámá chyba.' });
      } else {
        setCodeResult(data.codes as string[]);
        setCodeStatus({ ok: true, msg: `LOG [CODE_GEN_OK]: Vygenerováno ${data.count} kódů. Platnost do ${new Date(data.expiresAt).toLocaleDateString('cs-CZ')}.` });
      }
    } catch { setCodeStatus({ ok: false, msg: 'Chyba sítě.' }); }
    finally { setCodeLoading(false); }
  }

  async function copyAll() {
    if (!codeResult) return;
    await navigator.clipboard.writeText(codeResult.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="admin-panel os-surface os-surface--glass admin-panel--full">
      <p className="admin-panel-log">LOG [CODE_GENERATOR]:</p>
      <h2 className="admin-panel-title">GENEROVAT REDEEM KÓDY</h2>
      <form onSubmit={handleGenerateCodes} className="admin-form admin-form--two-col">
        <div className="admin-form-group">
          <label className="admin-label" htmlFor="code-package">Balíček</label>
          <select id="code-package" className="admin-input admin-select" value={codePackage}
            onChange={(e) => setCodePackage(e.target.value)}>
            {PACKAGE_IDS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div className="admin-form-group">
          <label className="admin-label" htmlFor="code-count">Počet kódů (1–100)</label>
          <input id="code-count" className="admin-input" type="number" value={codeCount}
            onChange={(e) => setCodeCount(e.target.value)} min="1" max="100" step="1" required />
        </div>
        <div className="admin-form-group">
          <label className="admin-label" htmlFor="code-days">Platnost ve dnech (1–365)</label>
          <input id="code-days" className="admin-input" type="number" value={codeDays}
            onChange={(e) => setCodeDays(e.target.value)} min="1" max="365" step="1" required />
        </div>
        <div className="admin-form-group admin-form-group--submit">
          <button type="submit" className="btn admin-btn" disabled={codeLoading}>
            {codeLoading ? 'GENERUJI…' : 'VYGENEROVAT KÓDY'}
          </button>
        </div>
      </form>

      {codeStatus && (
        <p className={`admin-result ${codeStatus.ok ? 'admin-result--ok' : 'admin-result--err'}`}>
          {codeStatus.msg}
        </p>
      )}

      {codeResult && codeResult.length > 0 && (
        <div className="admin-codes">
          <p className="admin-codes-warning">
            ⚠ LOG [ONE_TIME_DISPLAY]: Tyto kódy se zobrazí pouze jednou. Plaintext není v databázi. Zkopíruj je okamžitě.
          </p>
          <pre className="admin-codes-box">{codeResult.join('\n')}</pre>
          <button className="btn admin-btn admin-btn--sm" onClick={copyAll}>
            {copied ? '✓ ZKOPÍROVÁNO' : 'KOPÍROVAT VŠE'}
          </button>
        </div>
      )}
    </section>
  );
}

function WhispersTab() {
  const [whispers, setWhispers] = useState<AdminWhisper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'hidden'>('pending');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadWhispers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/admin/whispers?status=${statusFilter}&limit=50`);
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? 'Chyba.'); return; }
      setWhispers(data as AdminWhisper[]);
    } catch { setError('Chyba sítě.'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { void loadWhispers(); }, [loadWhispers]);

  async function moderateWhisper(id: string, action: 'approve' | 'reject' | 'hide') {
    setActionLoading(id + action);
    try {
      const r = await fetch('/api/admin/whispers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (r.ok) {
        setWhispers((prev) => prev.filter((w) => w.id !== id));
      }
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  }

  return (
    <section className="admin-panel os-surface os-surface--glass admin-panel--full">
      <p className="admin-panel-log">LOG [WHISPER_MODERATION]:</p>
      <h2 className="admin-panel-title">MODERACE ŠEPOTŮ</h2>

      <div className="admin-filter-row">
        {(['pending', 'approved', 'rejected', 'hidden'] as const).map((s) => (
          <button key={s} className={`btn admin-btn admin-btn--sm ${statusFilter === s ? 'admin-btn--active' : ''}`}
            onClick={() => setStatusFilter(s)}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading && <p className="admin-overview-loading">LOG [LOADING]: Načítám šepoty…</p>}
      {error && <p className="admin-result admin-result--err">{error}</p>}
      {!loading && whispers.length === 0 && !error && (
        <p className="admin-overview-loading">LOG [EMPTY]: Žádné šepoty se statusem &bdquo;{statusFilter}&ldquo;.</p>
      )}

      <div className="admin-whispers-list">
        {whispers.map((w) => (
          <div key={w.id} className="admin-whisper-card">
            <div className="admin-whisper-meta">
              <span className="admin-badge admin-badge--type">{w.type}</span>
              <span className="admin-table-dim">{w.placement}{w.chapterId ? ` → ${w.chapterId}` : ''}</span>
              <span className="admin-table-dim">Rezonance: {w.resonanceCount}</span>
              <span className="admin-table-dim">{fmt(w.createdAt)}</span>
            </div>
            <p className="admin-whisper-text">{w.text}</p>
            {statusFilter === 'pending' && (
              <div className="admin-whisper-actions">
                <button className="btn admin-btn admin-btn--sm admin-btn--ok"
                  disabled={actionLoading === w.id + 'approve'}
                  onClick={() => moderateWhisper(w.id, 'approve')}>
                  SCHVÁLIT
                </button>
                <button className="btn admin-btn admin-btn--sm admin-btn--reject"
                  disabled={actionLoading === w.id + 'reject'}
                  onClick={() => moderateWhisper(w.id, 'reject')}>
                  ZAMÍTNOUT
                </button>
                <button className="btn admin-btn admin-btn--sm"
                  disabled={actionLoading === w.id + 'hide'}
                  onClick={() => moderateWhisper(w.id, 'hide')}>
                  SKRÝT
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function SystemLogTab() {
  return (
    <section className="admin-panel os-surface os-surface--glass admin-panel--full">
      <p className="admin-panel-log">LOG [SYSTEM_LOG]:</p>
      <h2 className="admin-panel-title">SYSTÉMOVÝ LOG</h2>
      <p className="admin-result admin-result--note">
        LOG [AUDIT_NOT_IMPLEMENTED]: Audit log model v databázi neexistuje. Záznamy o admin akcích nejsou persistovány.
        Ruční kontrola je možná přes databázi přímo (tabulky MnemLedger, AccessCode).
      </p>
      <p className="admin-panel-note">
        Pro přidání audit logu je potřeba přidat model AdminAuditLog do schema.prisma a spustit migraci.
        Tato sekce bude automaticky aktivní po implementaci.
      </p>
    </section>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const r = await fetch('/api/admin/overview');
      const data = await r.json();
      if (!r.ok) { setOverviewError(data.error ?? 'Chyba.'); return; }
      setOverview(data as Overview);
    } catch { setOverviewError('Chyba sítě.'); }
    finally { setOverviewLoading(false); }
  }, []);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  return (
    <div className="admin-terminal">
      <div className="admin-header">
        <p className="admin-log-prefix">LOG [ADMIN_TERMINAL]: Ruční přístup do systému SYNTHOMA povolen.</p>
        <h1 className="admin-title">ADMIN TERMINÁL</h1>
        <p className="admin-subtitle"><em>&#8222;Každý zásah do ledgeru zůstává v paměti systému.&#8220;</em></p>
      </div>

      <nav className="admin-tabs" aria-label="Sekce admin terminálu">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`admin-tab-btn${activeTab === tab.id ? ' admin-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className="admin-tab-log">LOG [{tab.log}]</span>
            <span className="admin-tab-label">{tab.label}</span>
            {tab.id === 'whispers' && (overview?.pendingWhispers ?? 0) > 0 && (
              <span className="admin-tab-badge">{overview!.pendingWhispers}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="admin-tab-content">
        {activeTab === 'overview' && (
          <OverviewTab overview={overview} loading={overviewLoading} error={overviewError} />
        )}
        {activeTab === 'users' && <UserLookupTab />}
        {activeTab === 'mnems' && <MnemsTab onGrantSuccess={loadOverview} />}
        {activeTab === 'codes' && <CodesTab />}
        {activeTab === 'whispers' && <WhispersTab />}
        {activeTab === 'log' && <SystemLogTab />}
      </div>
    </div>
  );
}
