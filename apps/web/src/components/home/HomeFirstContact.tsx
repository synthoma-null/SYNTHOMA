import Link from 'next/link';

const PATHS = [
  {
    href: '/chapter/0-inf-restart',
    label: 'ZAČÍT PŘÍBĚH',
    detail: 'Otevřít 0-∞ [RESTART]. Bez registrace.',
  },
  {
    href: '/cyklus',
    label: 'SPUSTIT CYKLUS',
    detail: 'Projít prvním diagnostickým během.',
  },
  {
    href: '/archive',
    label: 'POCHOPIT SYNTHOMU',
    detail: 'Otevřít základní Archiv světa.',
  },
] as const;

export default function HomeFirstContact() {
  return (
    <section className="home-first-contact" aria-labelledby="home-first-contact-title">
      <div className="home-first-contact__heading">
        <span>LOG [FIRST_CONTACT] // UZEL</span>
        <h2 id="home-first-contact-title">PRVNÍ NÁVŠTĚVA</h2>
        <p>Nemusíš chápat všechno. Systém také nezačal tím, že by chápal sám sebe.</p>
      </div>
      <nav className="home-first-contact__paths" aria-label="Tři vstupy do SYNTHOMY">
        {PATHS.map((path, index) => (
          <Link href={path.href} key={path.href}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{path.label}</strong>
            <small>{path.detail}</small>
          </Link>
        ))}
      </nav>
    </section>
  );
}
