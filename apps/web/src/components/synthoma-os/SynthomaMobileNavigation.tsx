'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SynthomaCommandIcon from './SynthomaCommandIcon';

const ITEMS = [
  { href: '/', label: 'UZEL', icon: 'home' as const },
  { href: '/books', label: 'KNIHOVNA', icon: 'library' as const },
  { href: '/archive', label: 'ARCHIV', icon: 'archive' as const },
  { href: '/cyklus', label: 'CYKLUS', icon: 'cyklus' as const },
];

export default function SynthomaMobileNavigation() {
  const pathname = usePathname() ?? '/';
  return (
    <nav className="synthoma-mobile-nav" aria-label="Mobilní sektory">
      {ITEMS.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}><SynthomaCommandIcon name={item.icon} /><span>{item.label}</span></Link>;
      })}
    </nav>
  );
}
