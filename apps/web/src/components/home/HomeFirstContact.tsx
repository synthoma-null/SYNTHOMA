'use client';

import Link from 'next/link';
import { useLang } from '../../lib/LangContext';
export default function HomeFirstContact() {
  const { t } = useLang();
  return (
    <section className="home-first-contact" aria-labelledby="home-first-contact-title">
      <div className="home-first-contact__heading">
        <span>{t('home.first.log')}</span>
        <h2 id="home-first-contact-title">{t('home.first.title')}</h2>
        <p>{t('home.first.body')}</p>
      </div>
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
