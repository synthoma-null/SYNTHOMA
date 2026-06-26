import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SYNTHOMA – PLATBA PŘIJATA',
};

export default function PurchaseSuccessPage() {
  return (
    <main className="auth-page">
      <div className="auth-container glitch-bg">
        <h1 className="auth-title glitch" data-text="TRANSAKCE DOKONČENA">TRANSAKCE DOKONČENA</h1>
        <div className="auth-log">
          <span className="auth-log-prefix">LOG [PAYMENT_RECEIVED]:</span>
          <span className="auth-log-msg">&#8222;Platba přijata. Paměťový fragment bude přiřazen k identitě.&#8220;</span>
        </div>
        <p className="auth-log-msg auth-switch">
          Přihlaste se nebo redeemujte přístupový kód v profilu.
        </p>
        <div className="purchase-success-links">
          <Link href="/login" className="btn">PŘIHLÁSIT SE</Link>
          <Link href="/profile" className="btn">SUBJEKT / PROFIL</Link>
          <Link href="/reader" className="btn">ČTEČKA</Link>
        </div>
      </div>
    </main>
  );
}
