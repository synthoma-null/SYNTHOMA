import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  loadEarnedFindings,
  loadMetaUnlocks,
} from '../../../game/cyklus/cyklusFindings';
import { hasActiveRun as hasActiveRun } from '../../../game/run/runStorage';
import { hasActiveCyklusRun, loadCyklusRunHistory } from '../../../game/cyklus/cyklusStorage';
import type { ArchiveCard, ArchiveSnapshot, ArchiveWhisper } from './archiveTypes';

export function useArchiveSnapshot(cards: ArchiveCard[], filter = 'all', sort = 'random') {
  const { status: sessionStatus } = useSession();
  const [snapshot, setSnapshot] = useState<ArchiveSnapshot>(() => ({
    cards,
    progress: [],
    profile: { mnemBalance: 0, isAuthenticated: false },
    whispers: [],
    cyklus: {
      findings: loadEarnedFindings(),
      metaUnlocks: loadMetaUnlocks(),
      activeRun: typeof window !== 'undefined' && hasActiveCyklusRun(),
      historyCount: 0,
    },
    run: {
      activeRun: typeof window !== 'undefined' && hasActiveRun(),
    },
    loading: true,
    error: null,
  }));

  const load = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const authenticated = sessionStatus === 'authenticated';
    const [progressRes, profileRes, whispersRes] = await Promise.all([
      authenticated ? fetch('/api/me/progress', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null) : Promise.resolve(null),
      authenticated ? fetch('/api/me/profile', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).catch(() => null) : Promise.resolve(null),
      (() => {
        const params = new URLSearchParams({ placement: 'archive', sort, limit: '30' });
        if (filter !== 'all') params.set('type', filter);
        return fetch(`/api/whispers?${params}`, { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);
      })(),
    ]);

    const progress = Array.isArray(progressRes?.progress) ? progressRes.progress : [];
    const mnemBalance = typeof profileRes?.mnemBalance === 'number' ? profileRes.mnemBalance : 0;
    const isAuthenticated = !!profileRes?.user?.id;

    const whispers: ArchiveWhisper[] = Array.isArray(whispersRes) ? whispersRes : [];

    const cyklusHistory = loadCyklusRunHistory();

    setSnapshot({
      cards,
      progress,
      profile: { mnemBalance, isAuthenticated },
      whispers,
      cyklus: {
        findings: loadEarnedFindings(),
        metaUnlocks: loadMetaUnlocks(),
        activeRun: hasActiveCyklusRun(),
        historyCount: cyklusHistory.length,
      },
      run: {
        activeRun: hasActiveRun(),
      },
      loading: false,
      error: null,
    });
  }, [cards, filter, sessionStatus, sort]);

  useEffect(() => {
    load();
  }, [load]);

  return snapshot;
}
