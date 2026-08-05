import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { readArchiveLocalMemory } from './archiveLocalMemory';
import type { ArchiveCard, ArchiveSnapshot, ArchiveWhisper } from './archiveTypes';

export function useArchiveSnapshot(cards: ArchiveCard[], filter = 'all', sort = 'random') {
  const { status: sessionStatus } = useSession();
  const [snapshot, setSnapshot] = useState<ArchiveSnapshot>(() => {
    const initialMemory = typeof window !== 'undefined' ? readArchiveLocalMemory() : null;
    return {
      cards,
      progress: [],
      profile: { mnemBalance: 0, isAuthenticated: false },
      whispers: [],
      cyklus: {
        findings: initialMemory?.findings ?? [],
        metaUnlocks: initialMemory?.metaUnlocks ?? [],
        activeRun: initialMemory?.activeCyklusRun ?? false,
        historyCount: initialMemory?.cyklusHistoryCount ?? 0,
      },
      run: {
        activeRun: initialMemory?.activeLegacyRun ?? false,
      },
      loading: true,
      error: null,
    };
  });
  const [retry, setRetry] = useState(0);

  const load = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const authenticated = sessionStatus === 'authenticated';
    const loadJson = async (url: string) => {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${url} (${response.status})`);
      return response.json();
    };
    const [progressResult, profileResult, whispersResult] = await Promise.allSettled([
      authenticated ? loadJson('/api/me/progress') : Promise.resolve(null),
      authenticated ? loadJson('/api/me/profile') : Promise.resolve(null),
      (() => {
        const params = new URLSearchParams({ placement: 'archive', sort, limit: '30' });
        if (filter !== 'all') params.set('type', filter);
        return loadJson(`/api/whispers?${params}`);
      })(),
    ]);

    const progressRes = progressResult.status === 'fulfilled' ? progressResult.value : null;
    const profileRes = profileResult.status === 'fulfilled' ? profileResult.value : null;
    const whispersRes = whispersResult.status === 'fulfilled' ? whispersResult.value : null;
    const failedParts = [
      progressResult.status === 'rejected' ? 'postup čtení' : null,
      profileResult.status === 'rejected' ? 'profil' : null,
      whispersResult.status === 'rejected' ? 'šepoty' : null,
    ].filter(Boolean);

    const progress = Array.isArray(progressRes?.progress) ? progressRes.progress : [];
    const mnemBalance = typeof profileRes?.mnemBalance === 'number' ? profileRes.mnemBalance : 0;
    const isAuthenticated = !!profileRes?.user?.id;

    const whispers: ArchiveWhisper[] = Array.isArray(whispersRes) ? whispersRes : [];

    const memory = readArchiveLocalMemory();

    setSnapshot({
      cards,
      progress,
      profile: { mnemBalance, isAuthenticated },
      whispers,
      cyklus: {
        findings: memory.findings,
        metaUnlocks: memory.metaUnlocks,
        activeRun: memory.activeCyklusRun,
        historyCount: memory.cyklusHistoryCount,
      },
      run: {
        activeRun: memory.activeLegacyRun,
      },
      loading: false,
      error: failedParts.length ? `Některá data archivu nejsou dostupná: ${failedParts.join(', ')}.` : null,
    });
  }, [cards, filter, sessionStatus, sort]);

  useEffect(() => {
    load();
  }, [load, retry]);

  return { ...snapshot, reload: () => setRetry((value) => value + 1) };
}
