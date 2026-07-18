'use client';

import Link from 'next/link';
import { useLang } from '../../lib/LangContext';
import type { TKey } from '../../lib/i18n';

const PATHS = [
  {
    href: '/chapter/0-inf-restart',
    labelKey: 'home.first.story.label',
    detailKey: 'home.first.story.detail',
  },
  {
    href: '/cyklus',
    labelKey: 'home.first.cyklus.label',
    detailKey: 'home.first.cyklus.detail',
  },
  {
    href: '/archive',
    labelKey: 'home.first.archive.label',
    detailKey: 'home.first.archive.detail',
  },
] as const;

export default function HomeFirstContact() {
  const { t } = useLang();
  return (
    <section className="home-first-contact" aria-labelledby="home-first-contact-title">
      <div className="home-first-contact__heading">
        <span>{t('home.first.log')}</span>
        <h2 id="home-first-contact-title">{t('home.first.title')}</h2>
        <p>{t('home.first.body')}</p>
      </div>
      <nav className="home-first-contact__paths" aria-label={t('home.first.aria')}>
        {PATHS.map((path, index) => (
          <Link href={path.href} key={path.href}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{t(path.labelKey as TKey)}</strong>
            <small>{t(path.detailKey as TKey)}</small>
          </Link>
        ))}
      </nav>
      <aside className="home-first-contact__guest" aria-labelledby="home-guest-access-title">
        <div>
          <span id="home-guest-access-title">{t('home.guest.log')}</span>
          <p>{t('home.guest.body')}</p>
          <small>{t('home.guest.benefits')}</small>
        </div>
        <nav aria-label={t('home.guest.auth.aria')}>
          <Link href="/login">{t('home.guest.login')}</Link>
          <Link href="/register">{t('home.guest.register')}</Link>
        </nav>
      </aside>
    </section>
  );
}
