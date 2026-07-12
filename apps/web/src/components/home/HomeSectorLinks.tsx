import Link from 'next/link';

const SECTORS = [
  { href: '/books', index: '01', label: 'KNIHOVNA', detail: 'Knihy, kapitoly, pokračování', marker: 'OPEN' },
  { href: '/archive', index: '02', label: 'ARCHIV', detail: 'Stopy, fragmenty, záznamy', marker: 'READ' },
  { href: '/cyklus', index: '03', label: 'CYKLUS', detail: 'Aktivní diagnostický běh', marker: 'RUN' },
] as const;

export default function HomeSectorLinks() {
  return (
    <nav className="synthoma-home__sectors" aria-label="Sektory SYNTHOMA">
      {SECTORS.map((sector) => (
        <Link className="home-sector-link" href={sector.href} key={sector.href}>
          <span className="home-sector-link__index">{sector.index}</span>
          <span className="home-sector-link__copy"><strong>{sector.label}</strong><span>{sector.detail}</span></span>
          <span className="home-sector-link__marker">{sector.marker}</span>
        </Link>
      ))}
    </nav>
  );
}
