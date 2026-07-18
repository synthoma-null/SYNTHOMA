'use client';

import Link from 'next/link';
import { useLang } from '../../lib/LangContext';

export default function HomeMemorySignal() {
  const { t } = useLang();

  return (
    <footer className="synthoma-home__memory">
      <div className="synthoma-home__memory-copy">
        <span>LOG [SUBJECT_CONTACT]: Rozhraní tě registruje.</span>
        <span>Integrita paměti není podmínkou vstupu. Bohužel.</span>
        <Link href="/ai/api">PŘÍSTUP PRO AI / AI ACCESS</Link>
      </div>
      <nav className="synthoma-home__legal" aria-label={t('home.legal.aria')}>
        <Link href="/terms">{t('home.legal.commercial')}</Link>
        <span aria-hidden="true">{'//'}</span>
        <Link href="/terms">{t('home.legal.terms')}</Link>
      </nav>
    </footer>
  );
}
