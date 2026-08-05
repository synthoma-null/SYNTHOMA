'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import type { AdminTab, Overview } from './types';
import { errorMessage, formatAdminDate, readAdminResponse } from './utils';

const AdminUsersTab = dynamic(() => import('./AdminUsersTab'), { loading: AdminSectionLoading });
const AdminContentTab = dynamic(() => import('./AdminContentTab'), { loading: AdminSectionLoading });
const AdminMnemsTab = dynamic(() => import('./AdminMnemsTab'), { loading: AdminSectionLoading });
const AdminCodesTab = dynamic(() => import('./AdminCodesTab'), { loading: AdminSectionLoading });
const AdminWhispersTab = dynamic(() => import('./AdminWhispersTab'), { loading: AdminSectionLoading });
const AdminAuditTab = dynamic(() => import('./AdminAuditTab'), { loading: AdminSectionLoading });

const TABS: { id: AdminTab; label: string; description: string }[] = [
  { id: 'overview', label: 'PŘEHLED', description: 'Stav systému' },
  { id: 'content', label: 'OBSAH', description: 'Knihy a kapitoly' },
  { id: 'users', label: 'SUBJEKTY', description: 'Vyhledávání' },
  { id: 'mnems', label: 'MNEMY', description: 'Ledger' },
  { id: 'codes', label: 'KÓDY', description: 'Přístupy' },
  { id: 'whispers', label: 'ŠEPOTY', description: 'Moderace' },
  { id: 'audit', label: 'AUDIT', description: 'Historie zásahů' },
];

function AdminSectionLoading() {
  return <div className="admin-state" role="status">Načítám sekci…</div>;
}

function OverviewTab({ overview, loading, error, onRefresh }: {
  overview: Overview | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  if (loading && !overview) return <AdminSectionLoading />;
  if (error && !overview) {
    return <div className="admin-state admin-state--error" role="alert"><p>{error}</p><button className="admin-action" type="button" onClick={onRefresh}>ZKUSIT ZNOVU</button></div>;
  }
  if (!overview) return null;

  const cards = [
    { label: 'Subjekty', value: overview.userCount, detail: `${overview.newUsers30d} nových za 30 dní` },
    { label: 'Aktivní', value: overview.activeUsers7d, detail: 'přihlášení za 7 dní', tone: 'ok' },
    { label: 'Mnemy v oběhu', value: overview.totalMnemBalance.toLocaleString('cs-CZ'), detail: `${overview.ledgerCount} záznamů ledgeru` },
    { label: 'Čekající šepoty', value: overview.pendingWhispers, detail: `${overview.approvedWhispers} schválených`, tone: overview.pendingWhispers ? 'warn' : 'ok' },
    { label: 'Volné kódy', value: overview.unusedCodes, detail: `${overview.usedCodes} použitých`, tone: overview.unusedCodes ? 'ok' : 'warn' },
    { label: 'Auditní záznamy', value: overview.auditCount, detail: 'trvalá historie zásahů' },
    { label: 'Spravovaný obsah', value: overview.managedBookCount + overview.managedChapterCount, detail: `${overview.managedBookCount} knih · ${overview.managedChapterCount} kapitol` },
  ];

  return (
    <section className="admin-workspace" aria-labelledby="admin-overview-title">
      <div className="admin-section-header">
        <div><span className="admin-eyebrow">SYSTEM // OVERVIEW</span><h2 id="admin-overview-title">Rychlý přehled</h2><p>Aktuální stav účtů, ekonomiky a moderace.</p></div>
        <button className="admin-action admin-action--secondary" type="button" onClick={onRefresh} disabled={loading}>{loading ? 'OBNOVUJI…' : 'OBNOVIT'}</button>
      </div>
      {error ? <p className="admin-inline-warning" role="status">Poslední obnova selhala: {error}</p> : null}
      <div className="admin-kpi-grid">
        {cards.map((card) => (
          <article key={card.label} className={`admin-kpi${card.tone ? ` admin-kpi--${card.tone}` : ''}`}>
            <span>{card.label}</span><strong>{card.value}</strong><small>{card.detail}</small>
          </article>
        ))}
      </div>
      <p className="admin-generated">Aktualizováno {formatAdminDate(overview.generatedAt)}</p>
    </section>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/overview', { cache: 'no-store' });
      setOverview(await readAdminResponse<Overview>(response));
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadOverview(); }, [loadOverview]);

  return (
    <div className="admin-terminal">
      <header className="admin-hero">
        <div><span className="admin-eyebrow">SYNTHOMA // RESTRICTED</span><h1>Administrační panel</h1><p>Správa subjektů, ekonomiky, přístupů a obsahu na jednom místě.</p></div>
        <div className="admin-system-chip"><span aria-hidden="true" /><strong>SYSTÉM ONLINE</strong></div>
      </header>

      <nav className="admin-nav" aria-label="Sekce administračního panelu">
        {TABS.map((tab) => (
          <button key={tab.id} className={activeTab === tab.id ? 'is-active' : ''} type="button" onClick={() => setActiveTab(tab.id)} aria-current={activeTab === tab.id ? 'page' : undefined}>
            <strong>{tab.label}</strong><span>{tab.description}</span>
            {tab.id === 'whispers' && (overview?.pendingWhispers ?? 0) > 0 ? <b>{overview?.pendingWhispers}</b> : null}
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {activeTab === 'overview' ? <OverviewTab overview={overview} loading={loading} error={error} onRefresh={() => void loadOverview()} /> : null}
        {activeTab === 'content' ? <AdminContentTab onChanged={() => void loadOverview()} /> : null}
        {activeTab === 'users' ? <AdminUsersTab /> : null}
        {activeTab === 'mnems' ? <AdminMnemsTab onChanged={() => void loadOverview()} /> : null}
        {activeTab === 'codes' ? <AdminCodesTab onChanged={() => void loadOverview()} /> : null}
        {activeTab === 'whispers' ? <AdminWhispersTab onChanged={() => void loadOverview()} /> : null}
        {activeTab === 'audit' ? <AdminAuditTab /> : null}
      </div>
    </div>
  );
}
