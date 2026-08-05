'use client';

import { useMemo, useState } from 'react';
import { errorMessage, readAdminResponse } from './utils';

interface Props { onChanged: () => void }
interface PendingGrant { identifier: string; amount: number; reason: string }
interface GrantResponse { user: { nickname: string }; entry: { amount: number; reason: string }; newBalance: number }

export default function AdminMnemsTab({ onChanged }: Props) {
  const [identifier, setIdentifier] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('admin_grant');
  const [pending, setPending] = useState<PendingGrant | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [recent, setRecent] = useState<Array<{ nickname: string; amount: number; reason: string; newBalance: number }>>([]);
  const parsedAmount = useMemo(() => Number.parseInt(amount, 10), [amount]);

  function prepare(event: React.FormEvent) {
    event.preventDefault();
    const cleanIdentifier = identifier.trim();
    const cleanReason = reason.trim() || 'admin_grant';
    if (!cleanIdentifier || !Number.isInteger(parsedAmount) || parsedAmount === 0) {
      setStatus({ tone: 'error', text: 'Vyplňte subjekt a nenulovou celočíselnou částku.' });
      return;
    }
    setStatus(null);
    setPending({ identifier: cleanIdentifier, amount: parsedAmount, reason: cleanReason });
  }

  async function confirm() {
    if (!pending) return;
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch('/api/admin/mnems/grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': `admin:mnem:${crypto.randomUUID()}` },
        body: JSON.stringify(pending),
      });
      const data = await readAdminResponse<GrantResponse>(response);
      setRecent((items) => [{ nickname: data.user.nickname, amount: data.entry.amount, reason: data.entry.reason, newBalance: data.newBalance }, ...items].slice(0, 8));
      setStatus({ tone: 'ok', text: `Zápis dokončen. ${data.user.nickname} má nyní ${data.newBalance.toLocaleString('cs-CZ')} mn.` });
      setIdentifier(''); setAmount(''); setReason('admin_grant'); setPending(null); onChanged();
    } catch (requestError) {
      setStatus({ tone: 'error', text: errorMessage(requestError) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="admin-workspace" aria-labelledby="admin-mnems-title">
      <div className="admin-section-header"><div><span className="admin-eyebrow">ECONOMY // LEDGER</span><h2 id="admin-mnems-title">Správa mnemů</h2><p>Každá změna je trvalá, idempotentní a uložená v auditní historii.</p></div></div>
      <div className="admin-split-layout">
        <form className="admin-form-card" onSubmit={prepare}>
          <label htmlFor="grant-id">E-mail nebo přesná přezdívka</label><input id="grant-id" value={identifier} onChange={(event) => setIdentifier(event.target.value)} autoComplete="off" maxLength={120} placeholder="subjekt42" required />
          <label htmlFor="grant-amount">Změna zůstatku</label><input id="grant-amount" value={amount} onChange={(event) => setAmount(event.target.value)} type="number" min="-100000" max="100000" step="1" placeholder="256" required /><small>Kladné číslo přidá, záporné odebere. Nula není povolena.</small>
          <label htmlFor="grant-reason">Důvod</label><input id="grant-reason" value={reason} onChange={(event) => setReason(event.target.value)} list="admin-grant-reasons" maxLength={100} required /><datalist id="admin-grant-reasons"><option value="admin_grant" /><option value="support_adjustment" /><option value="purchase_correction" /><option value="refund_correction" /></datalist>
          <button className="admin-action" type="submit">ZKONTROLOVAT ZÁPIS</button>
        </form>

        <aside className={`admin-confirm-card${pending?.amount && pending.amount < 0 ? ' admin-confirm-card--danger' : ''}`} aria-live="polite">
          <span className="admin-eyebrow">CONFIRMATION</span>
          {pending ? <><h3>Potvrdit zásah</h3><dl><div><dt>Subjekt</dt><dd>{pending.identifier}</dd></div><div><dt>Změna</dt><dd className={pending.amount > 0 ? 'admin-positive' : 'admin-negative'}>{pending.amount > 0 ? '+' : ''}{pending.amount} mn</dd></div><div><dt>Důvod</dt><dd>{pending.reason}</dd></div></dl><p>Tato akce změní ekonomický ledger a nelze ji z panelu smazat.</p><div className="admin-button-row"><button className={`admin-action${pending.amount < 0 ? ' admin-action--danger' : ''}`} type="button" onClick={() => void confirm()} disabled={loading}>{loading ? 'ZAPISUJI…' : 'POTVRDIT ZÁPIS'}</button><button className="admin-action admin-action--secondary" type="button" onClick={() => setPending(null)} disabled={loading}>ZRUŠIT</button></div></> : <><h3>Čeká na kontrolu</h3><p>Po vyplnění formuláře se zde zobrazí přesná změna před jejím uložením.</p></>}
        </aside>
      </div>
      {status ? <p className={`admin-feedback admin-feedback--${status.tone}`} role="status">{status.text}</p> : null}
      {recent.length ? <section className="admin-history"><h3>Poslední zásahy v této relaci</h3><div className="admin-table-shell"><table className="admin-data-table"><thead><tr><th>Subjekt</th><th>Změna</th><th>Důvod</th><th>Nový stav</th></tr></thead><tbody>{recent.map((item, index) => <tr key={`${item.nickname}-${index}`}><td><strong>{item.nickname}</strong></td><td className={item.amount >= 0 ? 'admin-positive' : 'admin-negative'}>{item.amount >= 0 ? '+' : ''}{item.amount}</td><td>{item.reason}</td><td>{item.newBalance.toLocaleString('cs-CZ')} mn</td></tr>)}</tbody></table></div></section> : null}
    </section>
  );
}
