'use client';

import HomeFirstContact from './HomeFirstContact';
import HomePrimaryAction from './HomePrimaryAction';
import HomeSectorLinks from './HomeSectorLinks';
import HomeSystemStatus from './HomeSystemStatus';
import SynthomaWordmark from '../synthoma/SynthomaWordmark';
import { useLang } from '../../lib/LangContext';

export default function SynthomaHome() {
  const { t, lang } = useLang();
  return (
    <main className="synthoma-home" aria-labelledby="synthoma-home-title">
      <div className="synthoma-home__grid synthoma-local-scrim">
        <HomeSystemStatus />
        <section className="synthoma-home__primary">
          <SynthomaWordmark id="synthoma-home-title" context="home" animated={false} className="synthoma-home__brand" />
          <p className="synthoma-home__designation">{t('home.designation')}</p>
          <p className="synthoma-home__statement">{t('home.statement')}</p>
          <p className="synthoma-home__format">{t('home.format')}</p>
          <HomePrimaryAction />
          <HomeFirstContact />
          <blockquote className="home-light-quote">
            <span className="home-light-quote__text">{lang === 'en' ? 'Darkness is never real. It is only light that surrendered its meaning.' : 'Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.'}</span>
          </blockquote>
        </section>
        <HomeSectorLinks />
      </div>
    </main>
  );
}
