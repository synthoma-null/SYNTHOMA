'use client';

import { useState } from 'react';
import { errorMessage, readAdminResponse } from './utils';

const PACKAGES = [
  { value: 'single-fragment', label: 'Jeden fragment', detail: '64 mn' },
  { value: 'act-1', label: 'Akt I', detail: '256 mn' },
  { value: 'archiv-1024', label: 'Archiv 1024', detail: '1024 mn' },
  { value: 'archiv-plus', label: 'Archiv Plus', detail: 'předplatné' },
];

interface Props { onChanged: () => void }
interface CodesResponse { codes: string[]; count: number; expiresAt: string }

export default function AdminCodesTab({ onChanged }: Props) {
  const [packageId, setPackageId] = useState(PACKAGES[0]!.value);
  const [count, setCount] = useState('5');
  const [days, setDays] = useState('90');
  const [codes, setCodes] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true); setCodes([]); setExpiresAt(null); setCopied(false); setFeedback(null);
    try {
      const response = await fetch('/api/admin/redeem-codes/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, count: Number.parseInt(count, 10), expiresDays: Number.parseInt(days, 10) }),
      });
      const data = await readAdminResponse<CodesResponse>(response);
      setCodes(data.codes); setExpiresAt(data.expiresAt);
      setFeedback({ tone: 'ok', text: `Vygenerováno ${data.count} kódů.` });
      onChanged();
    } catch (requestError) {
      setFeedback({ tone: 'error', text: errorMessage(requestError) });
    } finally { setLoading(false); }
  }

  async function copyAll() {
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      setCopied(true); setFeedback({ tone: 'ok', text: 'Všechny kódy byly zkopírovány.' });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setFeedback({ tone: 'error', text: 'Kódy se nepodařilo zkopírovat. Označte je ručně.' });
    }
  }

  return (
    <section className="admin-workspace" aria-labelledby="admin-codes-title">
      <div className="admin-section-header"><div><span className="admin-eyebrow">ACCESS // GENERATOR</span><h2 id="admin-codes-title">Přístupové kódy</h2><p>Jednorázové kódy pro balíčky. Databáze uchovává pouze jejich bezpečný otisk.</p></div></div>
      <form className="admin-form-grid" onSubmit={generate}>
        <div><label htmlFor="code-package">Balíček</label><select id="code-package" value={packageId} onChange={(event) => setPackageId(event.target.value)}>{PACKAGES.map((item) => <option key={item.value} value={item.value}>{item.label} · {item.detail}</option>)}</select></div>
        <div><label htmlFor="code-count">Počet kódů</label><input id="code-count" value={count} onChange={(event) => setCount(event.target.value)} type="number" min="1" max="100" step="1" required /></div>
        <div><label htmlFor="code-days">Platnost ve dnech</label><input id="code-days" value={days} onChange={(event) => setDays(event.target.value)} type="number" min="1" max="365" step="1" required /></div>
        <button className="admin-action" type="submit" disabled={loading}>{loading ? 'GENERUJI…' : 'VYGENEROVAT KÓDY'}</button>
      </form>
      {feedback ? <p className={`admin-feedback admin-feedback--${feedback.tone}`} role="status">{feedback.text}</p> : null}
      {codes.length ? <section className="admin-code-result" aria-labelledby="admin-generated-codes"><div><span className="admin-eyebrow">ONE-TIME DISPLAY</span><h3 id="admin-generated-codes">Vygenerované kódy</h3><p>Zobrazují se pouze nyní. Uložte je před opuštěním stránky.</p>{expiresAt ? <small>Platnost do {new Date(expiresAt).toLocaleDateString('cs-CZ')}</small> : null}</div><pre tabIndex={0}>{codes.join('\n')}</pre><button className="admin-action" type="button" onClick={() => void copyAll()}>{copied ? 'ZKOPÍROVÁNO' : 'KOPÍROVAT VŠE'}</button></section> : null}
    </section>
  );
}
