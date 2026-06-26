'use client';

import { useEffect, useState } from 'react';

interface Overview {
  userCount: number;
  ledgerCount: number;
  unusedCodes: number;
  usedCodes: number;
}

const PACKAGE_IDS = [
  { value: 'single-fragment-64', label: 'single-fragment-64 (64 mn)' },
  { value: 'act-i-256', label: 'act-i-256 (256 mn)' },
  { value: 'archive-1024', label: 'archive-1024 (1024 mn)' },
];

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);

  const [grantId, setGrantId] = useState('');
  const [grantAmount, setGrantAmount] = useState('');
  const [grantReason, setGrantReason] = useState('admin_grant');
  const [grantStatus, setGrantStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [grantLoading, setGrantLoading] = useState(false);

  const [codePackage, setCodePackage] = useState('single-fragment-64');
  const [codeCount, setCodeCount] = useState('5');
  const [codeDays, setCodeDays] = useState('90');
  const [codeResult, setCodeResult] = useState<string[] | null>(null);
  const [codeStatus, setCodeStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((d: Overview) => { setOverview(d); setOverviewLoading(false); })
      .catch(() => setOverviewLoading(false));
  }, []);

  async function handleGrant(e: React.FormEvent) {
    e.preventDefault();
    setGrantLoading(true);
    setGrantStatus(null);
    try {
      const r = await fetch('/api/admin/mnems/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        setGrantStatus({
          ok: true,
          msg: `LOG [MNEM_GRANT_OK]: „Mnemový zásah byl zapsán do ledgeru." Nový stav: ${data.newBalance} mn → ${data.user.nickname}`,
        });
        setGrantId('');
        setGrantAmount('');
        setGrantReason('admin_grant');
      }
    } catch {
      setGrantStatus({ ok: false, msg: 'Chyba sítě.' });
    } finally {
      setGrantLoading(false);
    }
  }

  async function handleGenerateCodes(e: React.FormEvent) {
    e.preventDefault();
    setCodeLoading(true);
    setCodeResult(null);
    setCodeStatus(null);
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
        setCodeStatus({ ok: true, msg: `Vygenerováno ${data.count} kódů. Platnost do: ${new Date(data.expiresAt).toLocaleDateString('cs-CZ')}.` });
      }
    } catch {
      setCodeStatus({ ok: false, msg: 'Chyba sítě.' });
    } finally {
      setCodeLoading(false);
    }
  }

  async function copyAll() {
    if (!codeResult) return;
    await navigator.clipboard.writeText(codeResult.join('\n'));
  }

  return (
    <div className="admin-terminal">
      <div className="admin-header">
        <p className="admin-log-prefix">LOG [ADMIN_TERMINAL]:</p>
        <h1 className="admin-title">ADMIN TERMINÁL</h1>
        <p className="admin-subtitle">
          <em>&#8222;Ruční zásah do paměťové ekonomiky.&#8220;</em>
        </p>
        <p className="admin-warning">
          LOG [ADMIN_WARNING]: &#8222;Každý zásah do ledgeru zůstává v paměti systému.&#8220;
        </p>
      </div>

      <div className="admin-grid">
        {/* SEKCE 1 — ZAPSAT MNEMY */}
        <section className="admin-panel">
          <p className="admin-panel-log">LOG [MNEM_GRANT]:</p>
          <h2 className="admin-panel-title">ZAPSAT MNEMY</h2>
          <form onSubmit={handleGrant} className="admin-form">
            <label className="admin-label" htmlFor="grant-id">E-mail nebo přezdívka</label>
            <input
              id="grant-id"
              className="admin-input"
              type="text"
              value={grantId}
              onChange={(e) => setGrantId(e.target.value)}
              placeholder="user@example.com nebo subjekt42"
              required
              autoComplete="off"
            />

            <label className="admin-label" htmlFor="grant-amount">Amount (kladné / záporné)</label>
            <input
              id="grant-amount"
              className="admin-input"
              type="number"
              value={grantAmount}
              onChange={(e) => setGrantAmount(e.target.value)}
              placeholder="256"
              min="-100000"
              max="100000"
              step="1"
              required
            />

            <label className="admin-label" htmlFor="grant-reason">Reason</label>
            <input
              id="grant-reason"
              className="admin-input"
              type="text"
              value={grantReason}
              onChange={(e) => setGrantReason(e.target.value)}
              placeholder="admin_grant"
              maxLength={100}
            />

            <button
              type="submit"
              className="btn admin-btn"
              disabled={grantLoading}
            >
              {grantLoading ? 'ZAPISUJI…' : 'ZAPSAT DO LEDGERU'}
            </button>
          </form>

          {grantStatus && (
            <p className={`admin-result ${grantStatus.ok ? 'admin-result--ok' : 'admin-result--err'}`}>
              {grantStatus.msg}
            </p>
          )}
        </section>

        {/* SEKCE 2 — GENEROVAT REDEEM KÓDY */}
        <section className="admin-panel">
          <p className="admin-panel-log">LOG [CODE_GENERATOR]:</p>
          <h2 className="admin-panel-title">GENEROVAT REDEEM KÓDY</h2>
          <form onSubmit={handleGenerateCodes} className="admin-form">
            <label className="admin-label" htmlFor="code-package">Balíček</label>
            <select
              id="code-package"
              className="admin-input admin-select"
              value={codePackage}
              onChange={(e) => setCodePackage(e.target.value)}
            >
              {PACKAGE_IDS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>

            <label className="admin-label" htmlFor="code-count">Počet kódů (1–100)</label>
            <input
              id="code-count"
              className="admin-input"
              type="number"
              value={codeCount}
              onChange={(e) => setCodeCount(e.target.value)}
              min="1"
              max="100"
              step="1"
              required
            />

            <label className="admin-label" htmlFor="code-days">Platnost ve dnech (1–365)</label>
            <input
              id="code-days"
              className="admin-input"
              type="number"
              value={codeDays}
              onChange={(e) => setCodeDays(e.target.value)}
              min="1"
              max="365"
              step="1"
              required
            />

            <button
              type="submit"
              className="btn admin-btn"
              disabled={codeLoading}
            >
              {codeLoading ? 'GENERUJI…' : 'VYGENEROVAT KÓDY'}
            </button>
          </form>

          {codeStatus && (
            <p className={`admin-result ${codeStatus.ok ? 'admin-result--ok' : 'admin-result--err'}`}>
              {codeStatus.msg}
            </p>
          )}

          {codeResult && codeResult.length > 0 && (
            <div className="admin-codes">
              <p className="admin-codes-warning">
                ⚠ Tyto kódy se zobrazí pouze jednou. Zkopíruj je hned.
              </p>
              <pre className="admin-codes-box">{codeResult.join('\n')}</pre>
              <button className="btn admin-btn admin-btn--sm" onClick={copyAll}>
                KOPÍROVAT VŠE
              </button>
            </div>
          )}
        </section>

        {/* SEKCE 3 — PŘEHLED */}
        <section className="admin-panel admin-panel--overview">
          <p className="admin-panel-log">LOG [OVERVIEW]:</p>
          <h2 className="admin-panel-title">RYCHLÝ PŘEHLED</h2>
          {overviewLoading ? (
            <p className="admin-overview-loading">Načítám data…</p>
          ) : overview ? (
            <dl className="admin-overview-list">
              <div className="admin-overview-row">
                <dt className="admin-overview-label">Uživatelé</dt>
                <dd className="admin-overview-value">{overview.userCount}</dd>
              </div>
              <div className="admin-overview-row">
                <dt className="admin-overview-label">Záznamy v MnemLedger</dt>
                <dd className="admin-overview-value">{overview.ledgerCount}</dd>
              </div>
              <div className="admin-overview-row">
                <dt className="admin-overview-label">Nepoužité redeem kódy</dt>
                <dd className="admin-overview-value admin-overview-value--ok">{overview.unusedCodes}</dd>
              </div>
              <div className="admin-overview-row">
                <dt className="admin-overview-label">Použité redeem kódy</dt>
                <dd className="admin-overview-value">{overview.usedCodes}</dd>
              </div>
            </dl>
          ) : (
            <p className="admin-result admin-result--err">Přehled se nepodařilo načíst.</p>
          )}
        </section>
      </div>
    </div>
  );
}
