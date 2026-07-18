'use client';

import Link from 'next/link';
import { useLang } from '../../lib/LangContext';

export default function HomeMemorySignal() {
  const { t } = useLang();

  return (
    <footer className="synthoma-home__memory">
      <div className="synthoma-home__memory-copy">
        <span>{t('home.memory.contact')}</span>
        <span>{t('home.memory.integrity')}</span>
        <Link href="/ai/api">{t('home.memory.ai')}</Link>
      </div>
      <nav className="synthoma-home__legal" aria-label={t('home.legal.aria')}>
        <Link href="/terms">{t('home.legal.terms')}</Link>
        <span aria-hidden="true">{'//'}</span>
        <Link href="/privacy">{t('home.legal.privacy')}</Link>
      </nav>
    </footer>
  );
}
