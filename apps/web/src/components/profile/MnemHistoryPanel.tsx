'use client';

export interface LedgerHistoryItem {
  id: string;
  amount: number;
  balanceAfter: number;
  transactionType: string;
  reason: string;
  createdAt: string;
}

export interface OwnershipHistoryItem {
  id: string;
  contentType: string;
  contentId: string;
  title: string;
  source: string;
  grantedAt: string;
  expiresAt: string | null;
}

export interface PurchaseHistoryItem {
  id: string;
  title: string;
  contentType: string;
  contentId: string;
  mnemCost: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
}

interface Props {
  ledger: LedgerHistoryItem[];
  ownership: OwnershipHistoryItem[];
  purchases: PurchaseHistoryItem[];
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('cs-CZ', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function MnemHistoryPanel({ ledger, ownership, purchases }: Props) {
  return (
    <div className="profile-mnem-history">
      <section aria-labelledby="ownership-history-title">
        <div className="profile-section-heading">
          <span>ENTITLEMENT // OWNERSHIP</span>
          <h2 id="ownership-history-title">Vlastněné paměťové otisky</h2>
          <p>Zůstatek není vlastnictví. Tento seznam ano.</p>
        </div>
        {ownership.length ? (
          <ul className="synthoma-archive__chapter-list">
            {ownership.map((item) => (
              <li key={`${item.contentType}:${item.contentId}`}>
                <strong>{item.title}</strong>
                <span>{item.contentType} // {item.source} // {formatDate(item.grantedAt)}</span>
                {item.expiresAt ? <span>platnost do {formatDate(item.expiresAt)}</span> : null}
              </li>
            ))}
          </ul>
        ) : <p className="profile-empty">Žádné placené entitlementy.</p>}
      </section>

      <section aria-labelledby="ledger-history-title">
        <div className="profile-section-heading">
          <span>MNEM // APPEND-ONLY</span>
          <h2 id="ledger-history-title">Historie MNEM účtu</h2>
        </div>
        {ledger.length ? (
          <ol className="synthoma-archive__chapter-list">
            {ledger.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.amount > 0 ? '+' : ''}{entry.amount} MNEM</strong>
                <span>{entry.reason}</span>
                <span>zůstatek {entry.balanceAfter} // {formatDate(entry.createdAt)}</span>
              </li>
            ))}
          </ol>
        ) : <p className="profile-empty">Ledger zatím neobsahuje záznam.</p>}
      </section>

      {purchases.length ? (
        <section aria-labelledby="purchase-history-title">
          <div className="profile-section-heading"><span>PURCHASE // RECEIPTS</span><h2 id="purchase-history-title">MNEM nákupy</h2></div>
          <ul className="synthoma-archive__chapter-list">
            {purchases.map((purchase) => (
              <li key={purchase.id}>
                <strong>{purchase.title}</strong>
                <span>{purchase.mnemCost} MNEM // {purchase.status} // {formatDate(purchase.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
