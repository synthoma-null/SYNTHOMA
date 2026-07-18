'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readLastChapterPath } from '../../lib/readerState';
import { hasActiveCyklusRun } from '../../game/cyklus/cyklusStorage';
import { resolveResumeHref } from '../../lib/synthoma/library/getResumeTarget';
import { useLang } from '../../lib/LangContext';
import { getT, type Lang } from '../../lib/i18n';

type HomeAction = { href: string; label: string; detail: string; code: string };

export function resolveHomeAction(lang: Lang = 'cs'): HomeAction | null {
  const t = getT(lang);
  const reading = readLastChapterPath();
  if (reading) return { href: resolveResumeHref(reading), label: t('home.primary.reader.label'), detail: t('home.primary.reader.detail'), code: 'RESUME // READER' };
  if (hasActiveCyklusRun()) return { href: '/cyklus', label: t('home.primary.cyklus.label'), detail: t('home.primary.cyklus.detail'), code: 'RESUME // CYKLUS' };
  return null;
}

export default function HomePrimaryAction() {
  const { lang } = useLang();
  const [action, setAction] = useState<HomeAction | null>(null);
  useEffect(() => setAction(resolveHomeAction(lang)), [lang]);
  if (!action) return null;
  return (
    <Link className="home-primary-action os-surface" href={action.href} data-home-primary-action>
      <span className="home-primary-action__code">{action.code}</span>
      <span className="home-primary-action__label">{action.label}</span>
      <span className="home-primary-action__detail">{action.detail}</span>
    </Link>
  );
}
