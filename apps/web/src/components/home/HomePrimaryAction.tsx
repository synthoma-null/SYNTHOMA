'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readLastChapterPath } from '../../lib/readerState';
import { hasActiveCyklusRun } from '../../game/cyklus/cyklusStorage';
import { resolveResumeHref } from '../../lib/synthoma/library/getResumeTarget';

type HomeAction = { href: string; label: string; detail: string; code: string };

export function resolveHomeAction(): HomeAction {
  const reading = readLastChapterPath();
  if (reading) return { href: resolveResumeHref(reading), label: 'POKRAČOVAT VE ČTENÍ', detail: 'Obnovit poslední paměťovou stopu.', code: 'RESUME // READER' };
  if (hasActiveCyklusRun()) return { href: '/cyklus', label: 'POKRAČOVAT V CYKLU', detail: 'Diagnostický běh zůstal otevřený.', code: 'RESUME // CYKLUS' };
  return { href: '/books', label: 'VSTOUPIT DO SYNTHOMY', detail: 'Otevřít první dostupnou paměť.', code: 'SUBJECT // NEW' };
}

export default function HomePrimaryAction() {
  const [action, setAction] = useState<HomeAction>(() => ({ href: '/books', label: 'VSTOUPIT DO SYNTHOMY', detail: 'Otevřít první dostupnou paměť.', code: 'SUBJECT // NEW' }));
  useEffect(() => setAction(resolveHomeAction()), []);
  return (
    <Link className="home-primary-action os-surface" href={action.href} data-home-primary-action>
      <span className="home-primary-action__code">{action.code}</span>
      <span className="home-primary-action__label">{action.label}</span>
      <span className="home-primary-action__detail">{action.detail}</span>
    </Link>
  );
}
