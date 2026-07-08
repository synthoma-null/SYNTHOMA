'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CyklusVoidHub } from './CyklusVoidHub';
import { createCyklusRun } from '../../game/cyklus/cyklusEngine';
import {
  craftRecipe,
  equipArtifact,
  equipProtocol,
  equipUpgrade,
  getEmptyProgression,
  loadSubjectProgression,
  saveSubjectProgression,
  setActiveScar,
  unequipArtifact,
  unequipProtocol,
  unequipUpgrade,
  upgradeVoidRoom,
  type CraftedArtifactId,
  type ProtocolId,
  type RecipeId,
  type RunReward,
  type SubjectProgression,
  type VoidRoomId,
  type CyklusVoidHubActionPayload,
  type CyklusVoidHubActions,
} from '../../game/cyklus/cyklusProgression';
import {
  loadCyklusRun,
  saveCyklusRun,
  serverSaveProgression,
} from '../../game/cyklus/cyklusStorage';
import type { CyklusRunState } from '../../game/cyklus/cyklusTypes';

type NoticeKind = 'idle' | 'success' | 'error' | 'info';

type Notice = {
  kind: NoticeKind;
  text: string;
};

type Props = {
  playHref?: string;
  initialNotice?: string;
  preferServerSync?: boolean;
  compact?: boolean;
  recentReward?: RunReward | null;
};

function noticeClass(kind: NoticeKind): string {
  if (kind === 'success') return 'is-success';
  if (kind === 'error') return 'is-error';
  if (kind === 'info') return 'is-info';
  return 'is-idle';
}

function actionKindLabel(kind: CyklusVoidHubActionPayload['kind']): string {
  switch (kind) {
    case 'upgrade': return 'upgrade';
    case 'artifact': return 'artefakt';
    case 'protocol': return 'protokol';
    case 'scar': return 'jizvu';
    case 'room': return 'místnost';
    case 'recipe': return 'recept';
    default: return 'položku';
  }
}

export function CyklusVoidHubClient({
  playHref = '/cyklus',
  initialNotice = 'Prázdnota se načítá. Tvůj prohlížeč právě předstírá, že localStorage je duchovní zážitek.',
  preferServerSync = true,
  compact = false,
  recentReward = null,
}: Props) {
  const router = useRouter();
  const [progression, setProgression] = useState<SubjectProgression>(() => getEmptyProgression());
  const [run, setRun] = useState<CyklusRunState | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>({ kind: 'info', text: initialNotice });

  const refreshLocal = useCallback(() => {
    const nextProgression = loadSubjectProgression();
    const nextRun = loadCyklusRun();
    setProgression(nextProgression);
    setRun(nextRun);
    return { progression: nextProgression, run: nextRun };
  }, []);

  const syncFromServer = useCallback(async () => {
    if (!preferServerSync) return false;
    // Server sync is not implemented yet, use local storage only
    return false;
  }, [preferServerSync]);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      await syncFromServer();
      refreshLocal();
      setNotice({ kind: 'success', text: 'Prázdnota obnovena. Nic nevybuchlo, což je u SYNTHOMY skoro urážlivě optimistické.' });
    } catch {
      refreshLocal();
      setNotice({ kind: 'error', text: 'Serverová synchronizace škytla. Lokální Prázdnota pořád drží, protože i chaos má záložní plán.' });
    } finally {
      setBusy(false);
      setLoading(false);
    }
  }, [refreshLocal, syncFromServer]);

  useEffect(() => {
    let alive = true;
    async function boot() {
      try {
        await syncFromServer();
      } catch {
        // Local storage is allowed to carry the scene. Důstojnost databází je přeceňovaná.
      }
      if (!alive) return;
      refreshLocal();
      setLoading(false);
      setNotice({ kind: 'idle', text: 'Prázdnota je připravená. Což zní uklidňující jen do chvíle, než si vzpomeneš, kde jsme.' });
    }
    void boot();
    return () => { alive = false; };
  }, [refreshLocal, syncFromServer]);

  const persistProgressionAfterAction = useCallback(async () => {
    const next = loadSubjectProgression();
    setProgression(next);
    try {
      await serverSaveProgression(next);
    } catch {
      // Local progress already survived. Server can dramaticky kašlat dál.
    }
  }, []);

  const runMutation = useCallback(async (label: string, mutate: () => boolean) => {
    setBusy(true);
    try {
      const ok = mutate();
      await persistProgressionAfterAction();
      refreshLocal();
      setNotice({
        kind: ok ? 'success' : 'error',
        text: ok
          ? `${label}: provedeno. Systém to zapsal, protože neumí nechat věci prostě být.`
          : `${label}: odmítnuto. Buď chybí cena, slot, odemčení, nebo se realita znovu tváří jako formulář bez políček.`,
      });
    } catch {
      setNotice({ kind: 'error', text: `${label}: akce spadla. Gratuluju, i Prázdnota má teď výjimku.` });
    } finally {
      setBusy(false);
    }
  }, [persistProgressionAfterAction, refreshLocal]);

  const actions = useMemo<CyklusVoidHubActions>(() => ({
    onStartRun: async () => {
      setBusy(true);
      try {
        const existing = loadCyklusRun();
        if (existing?.status === 'playing') {
          setRun(existing);
          setNotice({ kind: 'info', text: 'Běžící cyklus už existuje. Prázdnota ti jen ukazuje dveře, protože evidentně potřebujeme i navigaci k vlastním problémům.' });
          router.push(playHref);
          return;
        }
        const nextRun = createCyklusRun(false);
        await saveCyklusRun(nextRun);
        setRun(nextRun);
        setNotice({ kind: 'success', text: 'Nový běh spuštěn. Restart se usmál. Bylo to nepříjemné.' });
        router.push(playHref);
      } catch {
        setNotice({ kind: 'error', text: 'Běh se nepodařilo spustit. Systém zakopl o vlastní dramatičnost, překvapivě.' });
      } finally {
        setBusy(false);
      }
    },
    onUpgradeRoom: (roomId) => {
      void runMutation(`Vylepšit místnost ${roomId}`, () => upgradeVoidRoom(roomId as VoidRoomId));
    },
    onCraftRecipe: (recipeId) => {
      void runMutation(`Vyrobit recept ${recipeId}`, () => craftRecipe(recipeId as RecipeId));
    },
    onEquipLoadout: (payload) => {
      const label = `Vybavit ${actionKindLabel(payload.kind)} ${payload.id}`;
      void runMutation(label, () => {
        if (payload.kind === 'upgrade') return equipUpgrade(payload.id);
        if (payload.kind === 'artifact') return equipArtifact(payload.id as CraftedArtifactId);
        if (payload.kind === 'protocol') return equipProtocol(payload.id as ProtocolId);
        if (payload.kind === 'scar') return setActiveScar(payload.id);
        return false;
      });
    },
    onUnequipLoadout: (payload) => {
      const label = `Sundat ${actionKindLabel(payload.kind)} ${payload.id}`;
      void runMutation(label, () => {
        if (payload.kind === 'upgrade') return unequipUpgrade(payload.id);
        if (payload.kind === 'artifact') return unequipArtifact(payload.id as CraftedArtifactId);
        if (payload.kind === 'protocol') return unequipProtocol(payload.id as ProtocolId);
        if (payload.kind === 'scar') return setActiveScar(undefined);
        return false;
      });
    },
    onRefresh: () => { void refresh(); },
  }), [playHref, refresh, router, runMutation]);

  if (loading) {
    return (
      <section className="cyklus-void-client-shell" aria-live="polite">
        <div className="cyklus-void-client-loading">
          <p className="cyklus-panel-kicker">VOID_BOOT</p>
          <h1>Prázdnota nabíhá</h1>
          <p>{notice.text}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cyklus-void-client-shell" aria-busy={busy}>
      <div className="cyklus-void-client-toolbar">
        <p className="cyklus-panel-kicker">VOID_ROUTE</p>
        <span className={['cyklus-void-client-status', noticeClass(notice.kind)].join(' ')}>{notice.text}</span>
      </div>
      <CyklusVoidHub progression={progression} state={run} actions={actions} compact={compact} recentReward={recentReward} />
    </section>
  );
}

export default CyklusVoidHubClient;
