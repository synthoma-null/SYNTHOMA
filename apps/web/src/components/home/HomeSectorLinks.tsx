'use client';

import { useState } from 'react';
import Link from 'next/link';
import { hasActiveCyklusRun } from '../../game/cyklus/cyklusStorage';
import { useLang } from '../../lib/LangContext';
import type { TKey } from '../../lib/i18n';

const SECTORS = [
  { href: '/books', index: '01', label: 'KNIHOVNA', detailKey: 'home.sector.library.detail', markerKey: 'action.open' },
  { href: '/archive', index: '02', label: 'ARCHIV', detailKey: 'home.sector.archive.detail', markerKey: 'action.open' },
  { href: '/cyklus', index: '03', label: 'CYKLUS', detailKey: 'home.sector.cyklus.new', markerKey: 'home.sector.cyklus.start' },
] as const;

export default function HomeSectorLinks() {
  const [activeRun] = useState(() => (typeof window !== 'undefined' ? hasActiveCyklusRun() : false));
  const { t } = useLang();

  return (
    <nav className="synthoma-home__sectors" aria-label="Sektory SYNTHOMA">
      {SECTORS.map((sector) => {
        const isCyklus = sector.href === '/cyklus';
        const detail = isCyklus
          ? (activeRun
            ? t('home.sector.cyklus.active')
            : t('home.sector.cyklus.new'))
          : t(sector.detailKey as TKey);
        const marker = isCyklus ? (activeRun ? t('action.continue') : t('home.sector.cyklus.start')) : t(sector.markerKey as TKey);
        const classes = [
          'home-sector-link',
          isCyklus ? 'home-sector-link--featured' : '',
        ].join(' ').trim();

        return (
          <Link className={classes} href={sector.href} key={sector.href}>
            <span className="home-sector-link__index">{sector.index}</span>
            <span className="home-sector-link__copy"><strong>{sector.label}</strong><span>{detail}</span></span>
            <span className="home-sector-link__marker">{marker}</span>
          </Link>
        );
      })}
      <Link className="home-sector-link home-sector-link--author" href="/autor">
        <span className="home-sector-link__index">04</span>
        <span className="home-sector-link__copy"><strong>{t('home.autor.title')}</strong><span>{t('home.autor.teaser')}</span></span>
        <span className="home-sector-link__marker">{t('action.open')}</span>
      </Link>
    </nav>
  );
}
