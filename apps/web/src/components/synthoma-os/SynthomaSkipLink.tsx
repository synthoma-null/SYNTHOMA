'use client';

import { usePathname } from 'next/navigation';

export default function SynthomaSkipLink({ label }: { label: string }) {
  const pathname = usePathname() ?? '/';
  const href = pathname === '/cyklus' ? '#cyklus-game' : '#main-content';

  return <a href={href} className="skip-to-content">{label}</a>;
}
