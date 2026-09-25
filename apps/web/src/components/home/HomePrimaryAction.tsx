'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { readLastChapterPath, readReadingProgress } from '../../lib/readerState';
import { resolveResumeHref } from '../../lib/synthoma/library/getResumeTarget';
import { useLang } from '../../lib/LangContext';
import { getT, type Lang } from '../../lib/i18n';

type HomeAction = { href: string; label: string; detail: string; code: string };

export function resolveHomeAction(lang: Lang = 'cs'): HomeAction | null {
  const t = getT(lang);
  const reading = readLastChapterPath();
  if (reading) return { href: resolveResumeHref(reading), label: t('home.primary.reader.label'), detail: t('home.primary.reader.detail'), code: 'RESUME // READER' };
  return null;
}

export default function HomePrimaryAction() {
  const { lang } = useLang();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const [action, setAction] = useState<HomeAction | null>(null);
  useEffect(() => {
    setAction(resolveHomeAction(lang));
    if (status !== 'authenticated') return;
    let cancelled = false;
    void fetch('/api/me/progress', { cache: 'no-store' }).then(response => response.ok ? response.json() : null).then(data => {
      if (cancelled || !Array.isArray(data?.progress)) return;
      const remote = data.progress.find((item: { chapterId?: string; progressPercent?: number }) => item.chapterId && (item.progressPercent ?? 0) > 0);
      if (!remote) return;
      const local = readReadingProgress(remote.collection);
      if (local && local.updatedAt > new Date(remote.updatedAt).getTime()) return;
      setAction({ href: `/chapter/${encodeURIComponent(remote.chapterId)}${lang === 'en' ? '?locale=en' : ''}`,
        label: getT(lang)('home.primary.reader.label'), detail: remote.chapterTitle || getT(lang)('home.primary.reader.detail'), code: 'RESUME // READER' });
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [lang, status, userId]);
  const effective = action ?? { href: lang === 'en' ? '/chapter/0-inf-restart?locale=en' : '/chapter/0-inf-restart', label: lang === 'en' ? 'Start reading for free' : 'Začít číst zdarma', detail: lang === 'en' ? 'The first chapter. No account required.' : 'První kapitola. Bez registrace.', code: '01 // SYNTHOMA NULL' };
  return (
    <Link className="home-primary-action os-surface" href={effective.href} data-home-primary-action>
      <span className="home-primary-action__code">{effective.code}</span>
      <span className="home-primary-action__label">{effective.label}</span>
      <span className="home-primary-action__detail">{effective.detail}</span>
    </Link>
  );
}
