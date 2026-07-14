'use client';

import { useState } from 'react';
import Link from 'next/link';
import { hasActiveCyklusRun } from '../../game/cyklus/cyklusStorage';
import { useLang } from '../../lib/LangContext';

const SECTORS = [
  { href: '/books', index: '01', label: 'KNIHOVNA', detail: 'Knihy, kapitoly, pokračování', marker: 'OPEN' },
  { href: '/archive', index: '02', label: 'ARCHIV', detail: 'Stopy, fragmenty, záznamy', marker: 'READ' },
  { href: '/cyklus', index: '03', label: 'CYKLUS', detail: 'Aktivní diagnostický běh', marker: 'RUN' },
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
            ? 'Diagnostický běh zůstal otevřený. Systém čeká na další volbu.'
            : 'Spusť nový diagnostický běh a podrob se analýze paměti.')
          : sector.detail;
        const marker = isCyklus ? (activeRun ? 'POKRAČOVAT' : 'SPOUSTIT') : sector.marker;
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
        <span className="home-sector-link__marker">OPEN</span>
      </Link>
    </nav>
  );
}
