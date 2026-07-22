'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { readLastChapterPath } from '../../src/lib/readerState';
import { resolveResumeHref } from '../../src/lib/synthoma/library/getResumeTarget';

export default function ResumeClient() {
  const router = useRouter();
  useEffect(() => {
    const path = readLastChapterPath();
    router.replace(path ? resolveResumeHref(path) : '/books');
  }, [router]);
  return <main className="synthoma-system-state" aria-live="polite"><section className="synthoma-system-state__panel"><p className="synthoma-system-state__code">LOG [RESUME]</p><h1>Obnovuji poslední stopu…</h1><div className="synthoma-system-state__loader" /></section></main>;
}
