'use client';

import HomeBackground from './HomeBackground';
import HomeMemorySignal from './HomeMemorySignal';
import HomeFirstContact from './HomeFirstContact';
import HomePrimaryAction from './HomePrimaryAction';
import HomeSectorLinks from './HomeSectorLinks';
import HomeSystemStatus from './HomeSystemStatus';
import SynthomaWordmark from '../synthoma/SynthomaWordmark';
import { useLang } from '../../lib/LangContext';

export default function SynthomaHome() {
  const { t } = useLang();
  return (
    <main className="synthoma-home" aria-labelledby="synthoma-home-title">
      <HomeBackground />
      <div className="synthoma-home__grid synthoma-local-scrim">
        <HomeSystemStatus />
        <section className="synthoma-home__primary">
          <SynthomaWordmark id="synthoma-home-title" context="home" className="synthoma-home__brand" />
          <p className="synthoma-home__designation">{t('home.designation')}</p>
          <p className="synthoma-home__statement">{t('home.statement')}</p>
          <p className="synthoma-home__format">{t('home.format')}</p>
          <HomeFirstContact />
          <HomePrimaryAction />
        </section>
        <HomeSectorLinks />
        <HomeMemorySignal />
      </div>
    </main>
  );
}
