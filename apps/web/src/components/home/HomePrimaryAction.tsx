'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readLastChapterPath } from '../../lib/readerState';
import { hasActiveCyklusRun } from '../../game/cyklus/cyklusStorage';

type HomeAction = { href: string; label: string; detail: string; code: string };

function readingHref(path: string) {
  const api = path.match(/^\/api\/chapter\/([^/?]+)/);
  if (api) return `/chapter/${encodeURIComponent(decodeURIComponent(api[1] ?? ''))}`;
  if (path.startsWith('/chapter/')) return path;
  if (path.startsWith('/books/')) return `/reader?u=${encodeURIComponent(path)}`;
  return path.startsWith('/') ? path : `/reader?u=${encodeURIComponent(path)}`;
}

export function resolveHomeAction(): HomeAction {
  const reading = readLastChapterPath();
  if (reading) return { href: readingHref(reading), label: 'POKRAČOVAT VE ČTENÍ', detail: 'Obnovit poslední paměťovou stopu.', code: 'RESUME // READER' };
  if (hasActiveCyklusRun()) return { href: '/cyklus', label: 'POKRAČOVAT V CYKLU', detail: 'Diagnostický běh zůstal otevřený.', code: 'RESUME // CYKLUS' };
  return { href: '/books', label: 'VSTOUPIT DO SYNTHOMY', detail: 'Otevřít první dostupnou paměť.', code: 'SUBJECT // NEW' };
}

export default function HomePrimaryAction() {
  const [action, setAction] = useState<HomeAction>(() => ({ href: '/books', label: 'VSTOUPIT DO SYNTHOMY', detail: 'Otevřít první dostupnou paměť.', code: 'SUBJECT // NEW' }));
  useEffect(() => setAction(resolveHomeAction()), []);
  return (
    <Link className="home-primary-action" href={action.href} data-home-primary-action>
      <span className="home-primary-action__code">{action.code}</span>
      <span className="home-primary-action__label">{action.label}</span>
      <span className="home-primary-action__detail">{action.detail}</span>
    </Link>
  );
}
