'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SynthomaCommandIcon from './SynthomaCommandIcon';
import { useLang } from '../../lib/LangContext';
import type { TKey } from '../../lib/i18n';

const ITEMS = [
  { href: '/', labelKey: 'shell.node', icon: 'home' as const },
  { href: '/books', labelKey: 'shell.library', icon: 'library' as const },
  { href: '/archive', labelKey: 'shell.archive', icon: 'archive' as const },
  { href: '/cyklus', labelKey: 'shell.cyklus', icon: 'cyklus' as const },
];

export default function SynthomaMobileNavigation() {
  const pathname = usePathname() ?? '/';
  const { t } = useLang();
  return (
    <nav className="synthoma-mobile-nav" aria-label={t('shell.mobile.aria')}>
      {ITEMS.map((item) => {
        const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}><SynthomaCommandIcon name={item.icon} /><span>{t(item.labelKey as TKey)}</span></Link>;
      })}
    </nav>
  );
}
