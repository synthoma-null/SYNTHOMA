'use client';

import Link from 'next/link';
import { useLang } from '../../../src/lib/LangContext';

export default function PurchaseSuccessPage() {
  const { t } = useLang();
  return (
    <main className="auth-page">
      <div className="auth-container os-surface os-surface--glass glitch-bg">
        <h1 className="auth-title glitch" data-text={t('purchase.success.title')}>{t('purchase.success.title')}</h1>
        <div className="auth-log">
          <span className="auth-log-prefix">LOG [PAYMENT_RECEIVED]:</span>
          <span className="auth-log-msg">&#8222;{t('purchase.success.log.msg')}&#8220;</span>
        </div>
        <p className="auth-log-msg auth-switch">
          {t('purchase.success.note')}
        </p>
        <div className="purchase-success-links">
          <Link href="/login" className="btn">{t('purchase.success.login')}</Link>
          <Link href="/profile" className="btn">{t('purchase.success.profile')}</Link>
          <Link href="/reader" className="btn">{t('purchase.success.reader')}</Link>
        </div>
      </div>
    </main>
  );
}
