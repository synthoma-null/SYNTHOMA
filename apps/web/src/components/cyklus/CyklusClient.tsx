'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { createCyklusRun, resolveChoice, getCardById, computeProfile, computeEnding, summarizeRun, analyzeDeath, computeStabilizationProgress, getCycleChapterName, getSectorIntroText, composeCycleSummary, composeBehavioralAnalysis, computeStabilizationVariant, composeCycleForecast, exportRunLog, getNearestExtreme, generateRunCodename, activateItem, getStabilizationBuildProgress, getActiveContracts, getComboHint, rerollRunGoals, applyMetaProgressionPreviewHint, type BuildVariantProgress } from '../../game/cyklus/cyklusEngine';
import { evaluateFindings, saveNewFindings, loadEarnedFindings, getDeathUnlocks, saveMetaUnlocks, addFreshMetaPools, type EarnedFinding, type MetaUnlock } from '../../game/cyklus/cyklusFindings';
import { getPocketItems, getPocketAmbientText, MOOD_LABELS, getPrimaryMoodItem, type ItemWithMood } from '../../game/cyklus/cyklusItemMood';
import { saveCyklusRun, loadCyklusRun, clearCyklusRun, loadCyklusRunHistory, appendCyklusRunSummary, isTutorialSeen, setTutorialV2Seen, clearTutorialSeen, loadServerCyklusRun } from '../../game/cyklus/cyklusStorage';
import { computeRunRewards, awardRunRewards, loadSubjectProgression, SUBJECT_UPGRADES, SUBJECT_SCARS, CURRENCY_LABELS, getLoadoutLimits, MATERIAL_LABELS, CRAFT_RECIPES, VOID_ROOMS, type RunReward, type SubjectProgression, type CyklusVoidHubActions } from '../../game/cyklus/cyklusProgression';
import { loadStoryProgression, updateStoryAfterRun, saveStoryProgression } from '../../game/cyklus/cyklusStory';
import StatDock from './StatDock';
import { CyklusVoidHub } from './CyklusVoidHub';
import CyklusVoidHubClient from './CyklusVoidHubClient';
import CyklusMobileHud from './CyklusMobileHud';
import CyklusBottomNav from './CyklusBottomNav';
import CyklusBottomSheet from './CyklusBottomSheet';
import { CyklusCardScene } from './CyklusCardScene';
import { STAT_LABELS, SECTOR_LABELS, ENTITY_LABELS, type StatKey, type EntityId, type CyklusRunState, type CyklusRunSummary, type SwipeCard, type CyklusChoiceRecord, type CardCondition } from '../../game/cyklus/cyklusTypes';

function getTutorialHighlight(cardId: string | undefined): { stat?: StatKey | 'all'; actions?: boolean; pocket?: boolean } | null {
  switch (cardId) {
    case 'tutorial_02_stats':
    case 'tutorial_03_balance':
    case 'tutorial_04_preview':
      return { stat: 'all' };
    case 'tutorial_01_swipe':
    case 'tutorial_06_items':
    case 'tutorial_07_imprints':
      return { actions: true };
    case 'tutorial_08_consequences':
      return { pocket: true };
    default:
      return null;
  }
}

const TUTORIAL_PROGRESS_MAP: Record<string, { index: number; label: string; flavour: string }> = {
  tutorial_00_welcome: { index: 1, label: 'Úvod', flavour: 'Profesionalita je jen lépe formátovaná panika.' },
  tutorial_01_swipe: { index: 2, label: 'Volby', flavour: 'Pravá/levá není dobro/zlo. Obě změní subjekt.' },
  tutorial_02_stats: { index: 3, label: 'Staty', flavour: 'Čtyři čudlíky, kterými se dá subjekt elegantně poslat do háje.' },
  tutorial_03_balance: { index: 4, label: 'Rovnováha', flavour: 'Stabilita není nuda. Je to méně dramatická smrt.' },
  tutorial_04_preview: { index: 5, label: 'Preview', flavour: 'Číst náznaky není slabost. Je to méně estetická smrt.' },
  tutorial_05_profile: { index: 6, label: 'Profil', flavour: 'Profil není diagnóza. Systémy jen milují krabičky.' },
  tutorial_06_items: { index: 7, label: 'Itemy', flavour: 'Kapsa není dekorace. Kapse se nedá věřit.' },
  tutorial_07_imprints: { index: 8, label: 'Otisky', flavour: 'Otisk není item. Drží on tebe.' },
  tutorial_08_consequences: { index: 9, label: 'Následky', flavour: 'Následky mají kalendář. Systém je objednává později.' },
  tutorial_09_sectors: { index: 10, label: 'Sektory', flavour: 'Sektor je místnost, která se tváří, že má osobnost.' },
  tutorial_10_cycle: { index: 11, label: 'Cyklus', flavour: 'Dvanáct chyb, pak pětiminutová přestávka na sebemrzenčí.' },
  tutorial_11_restart: { index: 12, label: 'Restart', flavour: 'Restart není undo. Je to diagnostika s mezinápravou.' },
  tutorial_12_void: { index: 13, label: 'Prázdnota', flavour: 'Prázdnota není menu. Je to místnost, co si pamatuje tvůj rozpad.' },
  tutorial_13_progression: { index: 14, label: 'Progrese', flavour: 'Utrácení zbytků sebe za protokoly je zdravý rozvoj.' },
  tutorial_14_packs: { index: 15, label: 'Příběhové linky', flavour: 'Packy tě naučí, že ses myslel, že víš, kdo jsi.' },
  tutorial_15_ready: { index: 16, label: 'Start', flavour: 'Konec návodu. Začátek poškození.' },
};
const ITEM_ACTIVATION_HINTS: Record<string, string> = {
  rubber_seal: 'Vazba +8, připraví krizovou ochranu vazby.',
  mirror_shard: 'Aktivuje zrcadlový efekt, za 3 tahy přijde zrcadlová karta.',
  archive_key: 'Paměť −12, přesune subjekt do sektoru Archiv.',
  soft_bug: 'Vazba +8, Kontrola −6, za 4 tahy přijde následná karta.',
  warm_token: 'Za 3 tahy otevře přístup k tržišti žetonů.',
};
import { CYKLUS_CARDS, CYKLUS_ITEMS, CYKLUS_IMPRINTS } from '../../game/cyklus/content';
import { updateDiscoveryFromRun, loadDiscovery, type CyklusDiscovery } from '../../game/cyklus/cyklusDiscovery';

export default function CyklusClient() {
  const { data: session } = useSession();
  const [state, setState] = useState<CyklusRunState | null>(null);
  const [loading, setLoading] = useState(true);
  const [outcomeVisible, setOutcomeVisible] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [flyDirection, setFlyDirection] = useState<'yes' | 'no' | null>(null);
  const [runHistory, setRunHistory] = useState<CyklusRunSummary[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeStat, setActiveStat] = useState<StatKey | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [savedRun, setSavedRun] = useState<CyklusRunState | null>(null);
  const [tutorialSeen, setTutorialSeenState] = useState(false);
  const [sectorIntro, setSectorIntro] = useState<string | null>(null);
  const [cycleSummary, setCycleSummary] = useState<string | null>(null);
  const [cycleForecast, setCycleForecast] = useState<string | null>(null);
  const [preRunWarning, setPreRunWarning] = useState<string | null>(null);
  const [newFindings, setNewFindings] = useState<EarnedFinding[]>([]);
  const [knownFindings, setKnownFindings] = useState<EarnedFinding[]>([]);
  const [newMetaUnlocks, setNewMetaUnlocks] = useState<MetaUnlock[]>([]);
  const [showPocket, setShowPocket] = useState(false);
  const [showBuild, setShowBuild] = useState(false);
  const [showDiscovery, setShowDiscovery] = useState(false);
  const [discovery, setDiscovery] = useState<CyklusDiscovery>(loadDiscovery());
  const [runReward, setRunReward] = useState<RunReward | null>(null);
  const [progression, setProgression] = useState<SubjectProgression>(loadSubjectProgression());
  const [showReward, setShowReward] = useState(false);
  const [showVoidHub, setShowVoidHub] = useState(false);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [showPocketSheet, setShowPocketSheet] = useState(false);
  const [confirmActivateId, setConfirmActivateId] = useState<string | null>(null);
  const prevSectorRef = useRef<string | null>(null);
  const prevCycleRef = useRef<number>(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const outcomeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const seen = isTutorialSeen();
      setTutorialSeenState(seen);
      const localHistory = loadCyklusRunHistory();
      setRunHistory(localHistory);

      let saved: CyklusRunState | null = null;
      let history = localHistory;
      let discovery = loadDiscovery();

      if (session?.user?.id) {
        const server = await loadServerCyklusRun();
        if (server) {
          saved = server.state;
          if (server.history.length > 0) {
            history = server.history;
            setRunHistory(history);
          }
          if (server.discovery) {
            discovery = server.discovery;
            setDiscovery(discovery);
          }
          if (server.progression && typeof server.progression === 'object') {
            const local = loadSubjectProgression();
            const serverProg = server.progression as Partial<SubjectProgression>;
            if ((serverProg.totalRuns ?? 0) > (local.totalRuns ?? 0)) {
              const { saveSubjectProgression } = await import('../../game/cyklus/cyklusProgression');
              saveSubjectProgression({ ...local, ...serverProg } as SubjectProgression);
            }
          }
        }
      }

      if (!saved) {
        saved = loadCyklusRun();
      }

      if (saved && (saved.status === 'dead' || saved.status === 'completed') && !history.find((h) => h.id === saved!.id)) {
        await appendCyklusRunSummary(summarizeRun(saved));
        setRunHistory(loadCyklusRunHistory());
      }
      if (!cancelled) {
        if (saved && saved.status === 'playing') {
          setSavedRun(saved);
          setShowMenu(true);
        } else {
          const fresh = createCyklusRun(seen);
          setState(fresh);
          await saveCyklusRun(fresh);
        }
        setLoading(false);
      }
    }
    init();
    return () => { cancelled = true; };
  }, [session?.user?.id]);

  useEffect(() => {
    if (state) {
      saveCyklusRun(state).catch(() => { /* ignore */ });
    }
  }, [state]);

  useEffect(() => {
    if (!state || state.status !== 'playing') return;
    const forecast = composeCycleForecast(state);
    if (state.choiceInCycle === 1 && state.cycle === 1 && state.preRunWarning) {
      setPreRunWarning(state.preRunWarning);
      setCycleForecast(forecast);
    } else if (state.choiceInCycle === 1 && state.cycle > 1) {
      setPreRunWarning(null);
      setCycleForecast(forecast);
    }
  }, [state?.cycle]);

  useEffect(() => {
    if (!state || state.status !== 'playing') return;
    const prevSector = prevSectorRef.current;
    const prevCycle = prevCycleRef.current;

    if (prevSector !== null && prevSector !== state.sector && !outcomeVisible) {
      const seed = `${state.id}-${state.sector}-${state.totalChoices}`;
      setSectorIntro(getSectorIntroText(state.sector, seed));
    }

    if (prevCycle !== state.cycle) {
      const summary = composeCycleSummary(state);
      if (summary) setCycleSummary(summary);
    }

    prevSectorRef.current = state.sector;
    prevCycleRef.current = state.cycle;
  }, [state?.sector, state?.cycle, state?.totalChoices]);

  useEffect(() => {
    if (state?.status === 'playing' && state.flags.includes('tutorial_v2_done') && !isTutorialSeen()) {
      setTutorialV2Seen();
      setTutorialSeenState(true);
    }
  }, [state?.flags]);

  useEffect(() => {
    if (!state || state.status === 'playing') return;
    const current = state;
    async function finalize() {
      const history = loadCyklusRunHistory();
      if (!history.find((h) => h.id === current.id)) {
        await appendCyklusRunSummary(summarizeRun(current));
        setRunHistory(loadCyklusRunHistory());
      }
      const before = loadEarnedFindings();
      const allFindings = evaluateFindings(current);
      const newOnes = saveNewFindings(allFindings);
      setNewFindings(newOnes);
      setKnownFindings(before.filter((f) => !newOnes.some((n) => n.id === f.id)));
      const ending = computeEnding(current);
      if (ending?.type === 'death') {
        const unlocks = getDeathUnlocks(ending.stat, ending.extreme);
        const saved = saveMetaUnlocks(unlocks);
        setNewMetaUnlocks(saved);
        const newPools = saved.map((u) => u.unlockPool).filter(Boolean) as string[];
        if (newPools.length > 0) addFreshMetaPools(newPools);
      }
      const variantId = current.status === 'completed' ? computeStabilizationVariant(current).id : undefined;
      const findingIds = evaluateFindings(current).map((f) => f.id);
      const beforeDiscovery = loadDiscovery();
      const nextDiscovery = updateDiscoveryFromRun(current, { variantId, findingIds });
      setDiscovery(nextDiscovery);
      const reward = computeRunRewards(current, beforeDiscovery, findingIds, variantId);
      awardRunRewards(reward);
      setRunReward(reward);
      setProgression(loadSubjectProgression());
      setShowReward(true);
      const story = loadStoryProgression();
      const updatedStory = updateStoryAfterRun(story, current);
      saveStoryProgression(updatedStory);
      await saveCyklusRun(current);
      // Sync game profile to web identity
      try {
        await fetch('/api/me/cyklus/sync-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profile: current.profile,
            entityRelations: current.entityRelations,
            stats: current.stats,
            status: current.status,
            cycle: current.cycle,
            deathStat: reward.deathStat,
            profileMastery: reward.profileMastery,
          }),
        });
      } catch {
        // ignore — web identity sync is best-effort
      }
    }
    finalize().catch(() => { /* ignore */ });
  }, [state?.status]);

  const handleChoice = useCallback((direction: 'yes' | 'no') => {
    if (!state || state.status !== 'playing') return;
    setFlyDirection(direction);
    if (outcomeTimer.current) clearTimeout(outcomeTimer.current);
    outcomeTimer.current = setTimeout(() => {
      const next = resolveChoice(state, direction);
      setState(next);
      setOutcomeVisible(true);
      setDragX(0);
      setFlyDirection(null);
    }, 280);
  }, [state]);

  const dismissOutcome = useCallback(() => {
    if (outcomeTimer.current) clearTimeout(outcomeTimer.current);
    setOutcomeVisible(false);
  }, []);

  const handleActivateItem = useCallback((itemId: string) => {
    if (!state || state.status !== 'playing') return;
    const result = activateItem(state, itemId);
    if (!result) return;
    setState(result.state);
    setOutcomeVisible(true);
    setState((prev) => {
      if (!prev) return prev;
      return { ...prev, lastOutcomeText: result.log };
    });
  }, [state]);

  const handleRerollGoals = useCallback(() => {
    if (!state || state.status !== 'playing') return;
    const next = rerollRunGoals(state);
    if (next === state) return;
    setState(next);
    saveCyklusRun(next);
  }, [state]);

  const handleRestart = useCallback(() => {
    async function reset() {
      await clearCyklusRun();
      const seen = isTutorialSeen();
      const fresh = createCyklusRun(seen);
      setState(fresh);
      await saveCyklusRun(fresh);
    }
    reset().catch(() => { /* ignore */ });
    setOutcomeVisible(false);
    setNewFindings([]);
    setKnownFindings([]);
    setNewMetaUnlocks([]);
    setCycleForecast(null);
    setPreRunWarning(null);
  }, []);

  const handleContinue = useCallback(() => {
    if (savedRun) {
      setState(savedRun);
      setSavedRun(null);
      setShowMenu(false);
    }
  }, [savedRun]);

  const handleNewGame = useCallback(() => {
    async function reset() {
      await clearCyklusRun();
      const seen = isTutorialSeen();
      const fresh = createCyklusRun(seen);
      setState(fresh);
      await saveCyklusRun(fresh);
      setSavedRun(null);
      setShowMenu(false);
    }
    reset().catch(() => { /* ignore */ });
    setNewFindings([]);
    setKnownFindings([]);
    setNewMetaUnlocks([]);
    setCycleForecast(null);
    setPreRunWarning(null);
  }, []);

  const handleRepeatTutorial = useCallback(() => {
    async function reset() {
      clearTutorialSeen();
      setTutorialSeenState(false);
      await clearCyklusRun();
      const fresh = createCyklusRun(false);
      setState(fresh);
      await saveCyklusRun(fresh);
      setSavedRun(null);
      setShowMenu(false);
    }
    reset().catch(() => { /* ignore */ });
  }, []);

  const handleSkipTutorial = useCallback(() => {
    if (!state) return;
    setTutorialV2Seen();
    setTutorialSeenState(true);
    const skipped = {
      ...state,
      flags: [...state.flags, 'tutorial_done', 'tutorial_v2_done'],
      usedCardIds: [...state.usedCardIds, 'tutorial_15_ready'],
      currentCardId: 'restart_0' as const,
    };
    setState(skipped);
    saveCyklusRun(skipped).catch(() => { /* ignore */ });
    setShowSkipConfirm(false);
  }, [state]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (flyDirection || outcomeVisible) return;
    const touch = e.touches[0];
    if (touch) startX.current = touch.clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (flyDirection || outcomeVisible) return;
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - startX.current;
    setDragX(Math.max(-160, Math.min(160, x)));
  };
  const onTouchEnd = () => {
    if (flyDirection || outcomeVisible) return;
    if (dragX > 80) handleChoice('yes');
    else if (dragX < -80) handleChoice('no');
    else setDragX(0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (flyDirection || outcomeVisible) return;
    isDragging.current = true;
    startX.current = e.clientX;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || flyDirection || outcomeVisible) return;
    const x = e.clientX - startX.current;
    setDragX(Math.max(-160, Math.min(160, x)));
  };
  const onMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (flyDirection || outcomeVisible) return;
    if (dragX > 80) handleChoice('yes');
    else if (dragX < -80) handleChoice('no');
    else setDragX(0);
  };
  const onMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      if (!flyDirection && !outcomeVisible) setDragX(0);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleChoice('yes');
      if (e.key === 'ArrowLeft') handleChoice('no');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleChoice]);

  if (loading) return <div className="cyklus-loading">Nahrává se cyklus…</div>;

  if (showMenu) {
    return (
      <div className="cyklus-root cyklus-root--menu">
        <video className="cyklus-menu__video" autoPlay muted loop playsInline>
          <source src="/video/SYNTHOMA5.webm" type="video/webm" />
        </video>
        <div className="cyklus-menu">
          <div className="cyklus-menu__title">SYNTHOMA: CYKLUS</div>
          <div className="cyklus-menu__intro">
            <p className="cyklus-menu__intro-line">Jsi subjekt v diagnostickém cyklu.</p>
            <p className="cyklus-menu__intro-line">Každá karta je rozhodnutí. Každé rozhodnutí posouvá čtyři vnitřní reaktory — energii, paměť, vazbu a kontrolu.</p>
            <p className="cyklus-menu__intro-line">Cílem není maximum. Cílem je rovnováha. Extrém znamená konec.</p>
            <p className="cyklus-menu__intro-line cyklus-menu__intro-line--dim">Swipuj. Přežij. Zjisti, kým jsi uvnitř systému.</p>
          </div>
          <div className="cyklus-menu__subtitle">
            {savedRun ? `Rozehraný cyklus ${savedRun.cycle} · ${SECTOR_LABELS[savedRun.sector]}` : 'Žádná rozehraná hra'}
          </div>
          <div className="cyklus-menu__actions">
            {savedRun && (
              <button className="cyklus-menu__button cyklus-menu__button--primary" type="button" onClick={handleContinue}>
                Pokračovat
              </button>
            )}
            <button className="cyklus-menu__button" type="button" onClick={handleNewGame}>
              Nová hra
            </button>
            {tutorialSeen && (
              <button className="cyklus-menu__button cyklus-menu__button--secondary" type="button" onClick={handleRepeatTutorial}>
                Zopakovat tutorial
              </button>
            )}
            <button className="cyklus-menu__button cyklus-menu__button--secondary" type="button" onClick={() => setShowVoidHub(true)}>
              PRÁZDN0TA
            </button>
          </div>
        </div>
        {showVoidHub && (
          <div className="cyklus-overlay cyklus-overlay--build cyklus-overlay--void-hub" onClick={() => setShowVoidHub(false)}>
            <div className="cyklus-overlay__panel" onClick={(e) => e.stopPropagation()}>
              <CyklusVoidHubClient
                playHref="/cyklus"
                compact={false}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!state) return <div className="cyklus-loading">Nahrává se cyklus…</div>;

  const card = getCardById(state.currentCardId) ?? getCardById('first_boot');
  const profile = computeProfile(state);
  const ending = state.status === 'dead' || state.status === 'completed' ? computeEnding(state) : null;
  const chapter = getCycleChapterName(state.cycle);
  const tutorialHighlight = getTutorialHighlight(card?.id);

  return (
    <>
    <div className="cyklus-root">
      {sectorIntro && (
        <div className="cyklus-overlay cyklus-overlay--sector" onClick={() => setSectorIntro(null)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSectorIntro(null); }}>
          <div className="cyklus-overlay__sector-label">{SECTOR_LABELS[state.sector]}</div>
          <div className="cyklus-overlay__sector-text">{sectorIntro}</div>
          <div className="cyklus-overlay__continue">Klikni pro pokračování</div>
        </div>
      )}
      {cycleSummary && (
        <div className="cyklus-overlay cyklus-overlay--summary" onClick={() => setCycleSummary(null)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCycleSummary(null); }}>
          <div className="cyklus-overlay__summary-text">{cycleSummary}</div>
          <div className="cyklus-overlay__continue">Klikni pro pokračování</div>
        </div>
      )}
      {preRunWarning && (
        <div className="cyklus-overlay cyklus-overlay--warning" onClick={() => setPreRunWarning(null)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setPreRunWarning(null); }}>
          <div className="cyklus-overlay__warning-label">ZÁZNAM PŘEDCHOZÍHO SUBJEKTU</div>
          <div className="cyklus-overlay__warning-text">{preRunWarning}</div>
          <div className="cyklus-overlay__continue">Klikni pro pokračování</div>
        </div>
      )}
      {cycleForecast && !preRunWarning && (
        <div className="cyklus-overlay cyklus-overlay--forecast" onClick={() => setCycleForecast(null)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setCycleForecast(null); }}>
          <div className="cyklus-overlay__forecast-title">PREDIKCE CYKLU {String(state.cycle).padStart(2, '0')}</div>
          <div className="cyklus-overlay__forecast-text">{cycleForecast}</div>
          <div className="cyklus-overlay__continue">Klikni pro pokračování</div>
        </div>
      )}
      {showSkipConfirm && (
        <div className="cyklus-overlay cyklus-overlay--warning">
          <div className="cyklus-overlay__warning-label">PŘESKOČIT TUTORIÁL?</div>
          <div className="cyklus-overlay__warning-text">
            Systém ti nebude vysvětlovat, proč se rozpadáš. Což je tvoje právo a naše budoucí zábava.
          </div>
          <div className="cyklus-overlay__actions">
            <button className="cyklus-btn cyklus-btn--secondary" type="button" onClick={() => setShowSkipConfirm(false)}>
              Zůstat v onboarding
            </button>
            <button className="cyklus-btn cyklus-btn--yes" type="button" onClick={handleSkipTutorial}>
              Přeskočit
            </button>
          </div>
        </div>
      )}
      {!ending && (
        <CyklusMobileHud state={state} onToggleDiag={() => setShowDiag((v) => !v)} diagOpen={showDiag} tutorialProgress={card?.category === 'tutorial' && !state.flags.includes('tutorial_v2_done') ? (
          <div className="cyklus-tutorial-progress">
            <span className="cyklus-tutorial-progress__label">TUTORIAL {TUTORIAL_PROGRESS_MAP[card.id]?.index ?? 1} / 16</span>
            <span className="cyklus-tutorial-progress__mechanic">{TUTORIAL_PROGRESS_MAP[card.id]?.label ?? 'Onboarding'}</span>
            <span className="cyklus-tutorial-progress__flavour">Sarkasmin závěr: &quot;{TUTORIAL_PROGRESS_MAP[card.id]?.flavour ?? 'Systém se tváří profesionálně. To je lépe formátovaná panika.'}&quot;</span>
          </div>
        ) : undefined} />
      )}

      <header className="cyklus-header">
        <div className="cyklus-title">SYNTHOMA: CYKLUS</div>
        <div className="cyklus-chapter">
          <span className="cyklus-chapter__number">{chapter.number}</span>
          <span className="cyklus-chapter__title">{chapter.title}</span>
          <span className="cyklus-chapter__subtitle">{chapter.subtitle}</span>
        </div>
        <div className="cyklus-meta">
          {card?.category === 'tutorial' && !state.flags.includes('tutorial_v2_done') && (
            <button
              className="cyklus-header__skip"
              onClick={() => setShowSkipConfirm(true)}
              type="button"
              title="Přeskočit tutorial"
            >
              Přeskočit
            </button>
          )}
        </div>
      </header>

      <main className="cyklus-stage">
        {ending ? (
          <div className="cyklus-end">
            <div className="cyklus-end__header">
              <div className="cyklus-end__system-label">ZÁVĚREČNÁ ZPRÁVA SUBJEKTU</div>
              <div className="cyklus-end__codename">{generateRunCodename(state)}</div>
              <div className="cyklus-end__title">{state.status === 'completed' ? computeStabilizationVariant(state).title : ending.title}</div>
              <div className="cyklus-end__subtitle">{state.status === 'completed' ? 'Konec: Stabilizace' : `Konec: ${ending.title}`}</div>
            </div>
            {runReward && <RewardSection reward={runReward} progression={progression} />}
            {(() => {
              const variant = state.status === 'completed' ? computeStabilizationVariant(state) : null;
              return variant ? (
                <div className="cyklus-end__survival-type">
                  <div className="cyklus-end__section-label">TYP PŘEŽITÍ</div>
                  <div className="cyklus-end__survival-title">{variant.title}</div>
                  <div className="cyklus-end__text">{variant.text}</div>
                  {variant.reasons && variant.reasons.length > 0 && (
                    <ul className="cyklus-end__survival-reasons">
                      {variant.reasons.map((r: string, i: number) => <li key={i}>✓ {r}</li>)}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="cyklus-end__text">{ending.text}</div>
              );
            })()}
            <div className="cyklus-end__stats-snapshot">
              {(['energy', 'memory', 'bond', 'control'] as StatKey[]).map((k) => (
                <div key={k} className="cyklus-end__stat-row">
                  <span className="cyklus-end__stat-label">{STAT_LABELS[k]}</span>
                  <span className={`cyklus-end__stat-value ${state.stats[k] <= 10 || state.stats[k] >= 90 ? 'cyklus-end__stat-value--extreme' : state.stats[k] <= 20 || state.stats[k] >= 80 ? 'cyklus-end__stat-value--danger' : ''}`}>{state.stats[k]}</span>
                </div>
              ))}
            </div>
            {state.status === 'dead' && <DeathAnalysis state={state} />}
            <BehavioralAnalysis state={state} />
            <div className="cyklus-end__profile">
              <div className="cyklus-end__section-label">Profilový otisk</div>
              <div className="cyklus-profile__type">{profile.dominantLabel}-like</div>
              <div className="cyklus-profile__archetype">{profile.archetype}</div>
              <div className="cyklus-profile__functions">
                <span>{profile.dominantFunction}</span> · <span>{profile.shadowFunction}</span>
              </div>
              <div className="cyklus-profile__confidence">{profile.profileConfidence}% jistota</div>
            </div>
            {[...new Set(state.visitedSectors)].length > 1 && (
              <div className="cyklus-end__route">
                <div className="cyklus-end__section-label">Trasa průchodu</div>
                <div className="cyklus-end__route-chain">
                  {[...new Set(state.visitedSectors)].map((s, i) => (
                    <span key={`${s}-${i}`} className="cyklus-end__route-node">{SECTOR_LABELS[s]}</span>
                  ))}
                </div>
              </div>
            )}
            {state.imprints.length > 0 && (
              <div className="cyklus-end__imprints">
                <div className="cyklus-end__section-label">Nashromážděné otisky</div>
                {state.imprints.map((id) => (
                  <div key={id} className="cyklus-end__imprint">· {CYKLUS_IMPRINTS[id]?.title ?? id}</div>
                ))}
              </div>
            )}
            {(() => {
              const near = getNearestExtreme(state.stats);
              const label = near ? `${STAT_LABELS[near.stat]} ${near.value}` : null;
              const direction = near?.direction === 'low' ? 'krize' : 'přetlak';
              const comment = near?.distance !== undefined && near.distance <= 15
                ? `Vzdálenost od hranice: ${near.distance}. Příliš blízko.`
                : near ? `Vzdálenost od hranice: ${near.distance}.` : null;
              return label ? (
                <div className={`cyklus-end__near-extreme ${near && near.distance <= 15 ? 'cyklus-end__near-extreme--critical' : ''}`}>
                  <div className="cyklus-end__section-label">{state.status === 'completed' ? 'SKORO TĚ ZNIČILO' : 'NEJVĚTŠÍ HROZBA PŘÍŠTÍHO CYKLU'}</div>
                  <div className="cyklus-end__near-extreme-stat">{label} <span className="cyklus-end__near-extreme-dir">({direction})</span></div>
                  {comment && <div className="cyklus-end__near-extreme-note">{comment}</div>}
                </div>
              ) : null;
            })()}
            {newFindings.length > 0 && (
              <div className="cyklus-end__findings cyklus-end__findings--new">
                <div className="cyklus-end__section-label">NOVÉ DIAGNOSTICKÉ NÁLEZY</div>
                {newFindings.map((f: EarnedFinding) => (
                  <div key={f.id} className="cyklus-finding cyklus-finding--new">
                    <div className="cyklus-finding__title">{f.title}</div>
                    <div className="cyklus-finding__desc">{f.description}</div>
                    {f.reward?.title && <div className="cyklus-finding__reward">Titul: {f.reward.title}</div>}
                    {f.reward?.unlockPool && <div className="cyklus-finding__reward">Odemkne pool: {f.reward.unlockPool}</div>}
                  </div>
                ))}
              </div>
            )}
            {knownFindings.length > 0 && (
              <div className="cyklus-end__findings cyklus-end__findings--known">
                <div className="cyklus-end__section-label">DŘÍVE EVIDOVÁNO</div>
                {knownFindings.map((f: EarnedFinding) => (
                  <div key={f.id} className="cyklus-finding cyklus-finding--known">
                    <div className="cyklus-finding__title">{f.title}</div>
                  </div>
                ))}
              </div>
            )}
            {newMetaUnlocks.length > 0 && (
              <div className="cyklus-end__meta-unlocks">
                <div className="cyklus-end__section-label">ODEMČENO</div>
                {newMetaUnlocks.map((u) => (
                  <div key={u.id} className="cyklus-meta-unlock">
                    <div className="cyklus-meta-unlock__name">Karta &bdquo;{u.displayText}&ldquo;</div>
                    <div className="cyklus-meta-unlock__reason">Systém zaznamenal vzorec. Odemčeno pro příští průchod.</div>
                  </div>
                ))}
              </div>
            )}
            <div className="cyklus-end__actions">
              <button className="cyklus-btn cyklus-btn--primary" onClick={() => setShowVoidHub(true)}>
                VRÁTIT SE DO PRÁZDNOTY
              </button>
              <button className="cyklus-btn cyklus-btn--primary" onClick={handleRestart}>DALŠÍ CYKLUS</button>
              <button
                className="cyklus-btn cyklus-btn--secondary"
                onClick={() => {
                  const log = exportRunLog(state, 'short', runReward ?? undefined);
                  const blob = new Blob([log], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `synthoma-cyklus-${state.id}-kratky.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                EXPORT KRÁTKÝ
              </button>
              <button
                className="cyklus-btn cyklus-btn--secondary"
                onClick={() => {
                  const log = exportRunLog(state, 'full', runReward ?? undefined);
                  const blob = new Blob([log], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `synthoma-cyklus-${state.id}-plny.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                EXPORT PLNÝ
              </button>
              {runHistory.length > 0 && (
                <button className="cyklus-btn cyklus-btn--secondary" onClick={() => setShowHistory(!showHistory)}>
                  {showHistory ? 'Skrýt archiv' : 'Archiv cyklů'}
                </button>
              )}
            </div>
            {showHistory && <RunHistoryList history={runHistory} />}
          </div>
        ) : card ? (
            <div
              ref={cardRef}
              className={[
                'cyklus-card',
                `cyklus-card--category-${card.category}`,
                outcomeVisible ? 'cyklus-card--outcome' : '',
                dragX > 0 ? 'cyklus-card--swipe-yes' : dragX < 0 ? 'cyklus-card--swipe-no' : '',
                flyDirection === 'yes' ? 'cyklus-card--fly-yes' : flyDirection === 'no' ? 'cyklus-card--fly-no' : '',
              ].filter(Boolean).join(' ')}
              style={{
                transform: `translateX(${dragX}px) rotate(${dragX * 0.14}deg) scale(${1 - Math.abs(dragX) * 0.0004})`,
                '--swipe-opacity': Math.abs(dragX) / 120,
              } as React.CSSProperties}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              {card.tags.includes('overload') && (
                <div className="cyklus-card__overload">
                  <span className="cyklus-card__overload-label">⚠ PŘETLAKOVÉ POKUŠENÍ</span>
                  <span className="cyklus-card__overload-risk">Vysoké riziko · extrémní reward</span>
                </div>
              )}
              <div className="cyklus-card__category">{card.logLabel}</div>
              <h2 className="cyklus-card__title">{card.title}</h2>
              <CyklusCardScene card={card} />
              {card.category === 'restart' && (
                <div className="cyklus-card__restart-badge">[RESTART]</div>
              )}
              <div className={`cyklus-card__preview ${tutorialHighlight?.actions ? 'cyklus-card__preview--highlight' : ''}`}>
                {directionPreview(state, card, card.no.preview, 'no', shouldLimitPreview(card), card.noLabel, () => handleChoice('no'), outcomeVisible)}
                {directionPreview(state, card, card.yes.preview, 'yes', shouldLimitPreview(card), card.yesLabel, () => handleChoice('yes'), outcomeVisible)}
              </div>
              {outcomeVisible && state.lastOutcomeText && (
                <OutcomePanel state={state} onDismiss={dismissOutcome} />
              )}
            </div>
        ) : (
          <div className="cyklus-empty">Karta nenalezena.</div>
        )}
      </main>

      {!ending && (
        <div className={`cyklus-pocket cyklus-pocket--standalone ${tutorialHighlight?.pocket ? 'cyklus-pocket--highlight' : ''} ${state.inventory.length > 0 ? `cyklus-pocket--mood-${getPrimaryMoodItem(state)?.mood ?? 'quiet'}` : ''}`}>
          <button
            className="cyklus-pocket__toggle"
            type="button"
            onClick={() => setShowPocket((v) => !v)}
            aria-expanded={showPocket ? 'true' : 'false'}
          >
            <span className="cyklus-footer__label">KAPSA</span>
            <span className="cyklus-pocket__count">{state.inventory.length}</span>
          </button>
          {showPocket && (
            <div className="cyklus-pocket__panel">
              {state.inventory.length === 0 ? (
                <div className="cyklus-pocket__empty">Kapsa je prázdná. Nic tu nečeká.</div>
              ) : (
                <>
                  {getPocketAmbientText(state) && (
                    <div className="cyklus-pocket__ambient">{getPocketAmbientText(state)}</div>
                  )}
                  {getComboHint(state) && (
                    <div className="cyklus-pocket__combo-hint">{getComboHint(state)}</div>
                  )}
                  <div className="cyklus-pocket__items">
                    {getPocketItems(state).map((item: ItemWithMood) => {
                      const activatable = ['rubber_seal', 'mirror_shard', 'archive_key', 'soft_bug', 'warm_token'].includes(item.id);
                      const canActivate = activatable && state.lastItemActivationCycle < state.cycle;
                      const isConfirming = confirmActivateId === item.id;
                      return (
                        <div key={item.id} className={`cyklus-pocket__item cyklus-pocket__item--${item.mood}`}>
                          <span className="cyklus-pocket__item-name">{item.title}</span>
                          <span className="cyklus-pocket__item-mood">{MOOD_LABELS[item.mood]}</span>
                          <span className="cyklus-pocket__item-text">{item.moodText}</span>
                          {activatable && ITEM_ACTIVATION_HINTS[item.id] && (
                            <span className="cyklus-pocket__item-hint">{ITEM_ACTIVATION_HINTS[item.id]}</span>
                          )}
                          {activatable && (
                            isConfirming ? (
                              <div className="cyklus-pocket__confirm">
                                <button type="button" className="cyklus-pocket__activate" onClick={() => { handleActivateItem(item.id); setConfirmActivateId(null); }}>Potvrdit</button>
                                <button type="button" className="cyklus-pocket__activate cyklus-pocket__activate--cancel" onClick={() => setConfirmActivateId(null)}>Zrušit</button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="cyklus-pocket__activate"
                                disabled={!canActivate}
                                onClick={() => canActivate && setConfirmActivateId(item.id)}
                              >
                                {canActivate ? 'Aktivovat' : 'Aktivováno'}
                              </button>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {!ending && (
        <div className="cyklus-desktop-top">
          <StatDock
            stats={state.stats}
            openStat={activeStat}
            onOpenStat={setActiveStat}
            highlight={tutorialHighlight?.stat}
            history={state.history}
            climate={state.modifier.id !== 'none' ? state.modifier : null}
            tutorialProgress={card?.category === 'tutorial' && !state.flags.includes('tutorial_v2_done') ? (
              <div className="cyklus-tutorial-progress">
                <span className="cyklus-tutorial-progress__label">TUTORIAL {TUTORIAL_PROGRESS_MAP[card.id]?.index ?? 1} / 16</span>
                <span className="cyklus-tutorial-progress__mechanic">{TUTORIAL_PROGRESS_MAP[card.id]?.label ?? 'Onboarding'}</span>
                <span className="cyklus-tutorial-progress__flavour">Sarkasmin závěr: &quot;{TUTORIAL_PROGRESS_MAP[card.id]?.flavour ?? 'Systém se tváří profesionálně. To je lépe formátovaná panika.'}&quot;</span>
              </div>
            ) : undefined}
          />
          <div className="cyklus-desktop-top__right">
            <div className="cyklus-nav-panel">
              <div className="cyklus-nav-panel__row">
                <span className="cyklus-nav-panel__sector">{SECTOR_LABELS[state.sector]}</span>
                <span className="cyklus-nav-panel__progress">{state.choiceInCycle}/{12}</span>
              </div>
              {state.history.length > 0 && (
                <div className="cyklus-story">
                  <span className="cyklus-footer__label">Příběh:</span>
                  <div className="cyklus-story__chain">
                    {state.history.slice(-3).map((record) => {
                      const c = getCardById(record.cardId);
                      return <span key={`${record.cardId}-${record.ts}`} className={`cyklus-story__node cyklus-story__node--${record.direction}`}>{c?.title ?? record.cardId}</span>;
                    })}
                  </div>
                </div>
              )}
              {state.visitedSectors.length > 0 && (
                <div className="cyklus-nav-panel__route">
                  <span className="cyklus-nav-panel__label">Trasa cyklu:</span>
                  <div className="cyklus-nav-panel__route-chain">
                    {state.visitedSectors.map((sector, idx) => (
                      <span key={`${sector}-${idx}`} className={`cyklus-nav-panel__route-node ${sector === state.sector ? 'cyklus-nav-panel__route-node--current' : ''}`}>
                        {SECTOR_LABELS[sector]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {state.status === 'playing' && (state.usedCardIds.includes('restart_5') || runHistory.length > 0) && (
                <StabilizationPanel state={state} />
              )}
            </div>
            {(state.imprints.length > 0 || Object.keys(state.entityRelations ?? {}).length > 0) && (
              <div className="cyklus-footer">
                {state.imprints.length > 0 && (
                  <div className="cyklus-imprints">
                    <span className="cyklus-footer__label">Imprinty:</span>
                    {state.imprints.map((id: string) => <span key={id} className="cyklus-imprint" title={CYKLUS_IMPRINTS[id]?.description}>{CYKLUS_IMPRINTS[id]?.title ?? id}</span>)}
                  </div>
                )}
                {Object.keys(state.entityRelations ?? {}).length > 0 && (
                  <div className="cyklus-entities">
                    <span className="cyklus-footer__label">Vztahy:</span>
                    {Object.entries(state.entityRelations ?? {}).map(([id, value]) => {
                      const entityId = id as EntityId;
                      const label = ENTITY_LABELS[entityId] ?? entityId;
                      const v = value ?? 0;
                      const desc = v >= 3 ? 'důvěra' : v >= 1 ? 'zájem' : v <= -3 ? 'odpor' : v <= -1 ? 'podezření' : 'neutrální';
                      return <span key={id} className={`cyklus-entity cyklus-entity--${v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral'}`} title={`${label}: ${v}`}>{label} · {desc}</span>;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!ending && (
        <CyklusBottomNav
          pocketCount={state.inventory.length}
          onPocket={() => setShowPocketSheet((v) => !v)}
          onBuild={() => setShowBuild((v) => !v)}
          onArchive={() => setShowDiscovery((v) => !v)}
          onVoid={() => setShowVoidHub(true)}
          dimmed={outcomeVisible}
        />
      )}

    </div>

      <CyklusBottomSheet open={showPocketSheet} onClose={() => setShowPocketSheet(false)} title={`KAPSA ${state.inventory.length}`}>
        {state.inventory.length === 0 ? (
          <div className="cyklus-pocket__empty">Kapsa je prázdná. Nic tu nečeká.</div>
        ) : (
          <>
            {getPocketAmbientText(state) && (
              <div className="cyklus-pocket__ambient">{getPocketAmbientText(state)}</div>
            )}
            {getComboHint(state) && (
              <div className="cyklus-pocket__combo-hint">{getComboHint(state)}</div>
            )}
            <div className="cyklus-pocket__items">
              {getPocketItems(state).map((item: ItemWithMood) => {
                const activatable = ['rubber_seal', 'mirror_shard', 'archive_key', 'soft_bug', 'warm_token'].includes(item.id);
                const canActivate = activatable && state.lastItemActivationCycle < state.cycle;
                const isConfirming = confirmActivateId === item.id;
                return (
                  <div key={item.id} className={`cyklus-pocket__item cyklus-pocket__item--${item.mood}`}>
                    <span className="cyklus-pocket__item-name">{item.title}</span>
                    <span className="cyklus-pocket__item-mood">{MOOD_LABELS[item.mood]}</span>
                    <span className="cyklus-pocket__item-text">{item.moodText}</span>
                    {activatable && ITEM_ACTIVATION_HINTS[item.id] && (
                      <span className="cyklus-pocket__item-hint">{ITEM_ACTIVATION_HINTS[item.id]}</span>
                    )}
                    {activatable && (
                      isConfirming ? (
                        <div className="cyklus-pocket__confirm">
                          <button type="button" className="cyklus-pocket__activate" onClick={() => { handleActivateItem(item.id); setConfirmActivateId(null); }}>Potvrdit</button>
                          <button type="button" className="cyklus-pocket__activate cyklus-pocket__activate--cancel" onClick={() => setConfirmActivateId(null)}>Zrušit</button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="cyklus-pocket__activate"
                          disabled={!canActivate}
                          onClick={() => canActivate && setConfirmActivateId(item.id)}
                        >
                          {canActivate ? 'Aktivovat' : 'Aktivováno'}
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {state.imprints.length > 0 && (
          <div className="cyklus-imprints cyklus-imprints--sheet">
            <span className="cyklus-footer__label">Imprinty:</span>
            {state.imprints.map((id: string) => <span key={id} className="cyklus-imprint" title={CYKLUS_IMPRINTS[id]?.description}>{CYKLUS_IMPRINTS[id]?.title ?? id}</span>)}
          </div>
        )}
        {Object.keys(state.entityRelations ?? {}).length > 0 && (
          <div className="cyklus-entities cyklus-entities--sheet">
            <span className="cyklus-footer__label">Vztahy:</span>
            {Object.entries(state.entityRelations ?? {}).map(([id, value]) => {
              const entityId = id as EntityId;
              const label = ENTITY_LABELS[entityId] ?? entityId;
              const v = value ?? 0;
              const desc = v >= 3 ? 'důvěra' : v >= 1 ? 'zájem' : v <= -3 ? 'odpor' : v <= -1 ? 'podezření' : 'neutrální';
              return <span key={id} className={`cyklus-entity cyklus-entity--${v > 0 ? 'positive' : v < 0 ? 'negative' : 'neutral'}`} title={`${label}: ${v}`}>{label} · {desc}</span>;
            })}
          </div>
        )}
        {state.history.length > 0 && (
          <div className="cyklus-story cyklus-story--sheet">
            <span className="cyklus-footer__label">Příběh:</span>
            <div className="cyklus-story__chain">
              {state.history.slice(-5).map((record) => {
                const c = getCardById(record.cardId);
                return <span key={`${record.cardId}-${record.ts}`} className={`cyklus-story__node cyklus-story__node--${record.direction}`}>{c?.title ?? record.cardId}</span>;
              })}
            </div>
          </div>
        )}
      </CyklusBottomSheet>

      {showBuild && state && (
        <div className="cyklus-overlay cyklus-overlay--build" onClick={() => setShowBuild(false)}>
          <div className="cyklus-overlay__panel" onClick={(e) => e.stopPropagation()}>
            <div className="cyklus-build__title">Možný typ přežití</div>
            <BuildPanel state={state} />
            <div className="cyklus-build__title cyklus-build__title--goals">Dnešní cíle</div>
            <GoalsPanel state={state} onReroll={handleRerollGoals} />
            <ContractPanel state={state} />
            <div className="cyklus-build__restart">
              <button
                className="cyklus-footer__button cyklus-footer__button--restart"
                onClick={handleRestart}
                type="button"
              >
                ↺ Restart cyklu
              </button>
            </div>
          </div>
        </div>
      )}

      {showDiscovery && (
        <div className="cyklus-overlay cyklus-overlay--discovery" onClick={() => setShowDiscovery(false)}>
          <div className="cyklus-overlay__panel" onClick={(e) => e.stopPropagation()}>
            <DiscoveryPanel discovery={discovery} />
          </div>
        </div>
      )}
      {showVoidHub && (
        <div className="cyklus-overlay cyklus-overlay--build cyklus-overlay--void-hub" onClick={() => setShowVoidHub(false)}>
          <div className="cyklus-overlay__panel" onClick={(e) => e.stopPropagation()}>
            <CyklusVoidHubClient
              playHref="/cyklus"
              compact={false}
            />
          </div>
        </div>
      )}
    </>
  );
}

function BuildPanel({ state }: { state: CyklusRunState }) {
  const progress = getStabilizationBuildProgress(state);
  const sorted = [...progress].sort((a, b) => b.progress - a.progress);
  const top = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="cyklus-build">
      <div className="cyklus-build__intro">
        <span className="cyklus-build__intro-label">MOŽNÝ TYP PŘEŽITÍ</span>
        {top[0] && <span className="cyklus-build__intro-top">{top[0].title} — {top[0].progress}%</span>}
      </div>
      {top.map((p) => (
        <div key={p.id} className={`cyklus-build__variant ${p.progress >= 80 ? 'cyklus-build__variant--close' : ''}`}>
          <div className="cyklus-build__header">
            <span className="cyklus-build__name">{p.title}</span>
            <span className="cyklus-build__value">{p.progress}%</span>
          </div>
          <div className="cyklus-build__bar"><div className="cyklus-build__fill" style={{ width: `${p.progress}%` }} /></div>
          <div className="cyklus-build__next-step">
            <span className="cyklus-build__next-step-label">DALŠÍ KROK:</span>
            <span>{p.hint}</span>
          </div>
          <div className="cyklus-build__reqs">
            {p.requirements.map((r) => (
              <span key={r.label} className={`cyklus-build__req ${r.met ? 'cyklus-build__req--met' : ''}`}>{r.met ? '✓' : '○'} {r.label}</span>
            ))}
          </div>
        </div>
      ))}
      {rest.length > 0 && (
        <button type="button" className="cyklus-build__toggle" onClick={() => setShowAll((v) => !v)}>
          {showAll ? 'Skrýt ostatní varianty' : `Zobrazit další varianty (${rest.length})`}
        </button>
      )}
      {showAll && rest.map((p) => (
        <div key={p.id} className="cyklus-build__variant cyklus-build__variant--secondary">
          <div className="cyklus-build__header">
            <span className="cyklus-build__name">{p.title}</span>
            <span className="cyklus-build__value">{p.progress}%</span>
          </div>
          <div className="cyklus-build__bar"><div className="cyklus-build__fill" style={{ width: `${p.progress}%` }} /></div>
          <div className="cyklus-build__next-step">
            <span className="cyklus-build__next-step-label">DALŠÍ KROK:</span>
            <span>{p.hint}</span>
          </div>
          <div className="cyklus-build__reqs">
            {p.requirements.map((r) => (
              <span key={r.label} className={`cyklus-build__req ${r.met ? 'cyklus-build__req--met' : ''}`}>{r.met ? '✓' : '○'} {r.label}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function GoalsPanel({ state, onReroll }: { state: CyklusRunState; onReroll?: () => void }) {
  const canReroll = state.flags.includes('goal_reroll_active') && !state.flags.includes('goal_reroll_used');
  return (
    <div className="cyklus-goals">
      <div className="cyklus-goals__label">
        DNEŠNÍ DIAGNOSTICKÉ ÚKOLY
        {canReroll && onReroll && (
          <button type="button" className="cyklus-goals__reroll" onClick={onReroll}>Přegenerovat</button>
        )}
      </div>
      {state.goals.map((g) => (
        <div key={g.id} className={`cyklus-goal ${g.completed ? 'cyklus-goal--completed' : ''}`}>
          <span className="cyklus-goal__title">{g.completed ? '✓' : '○'} {g.title}</span>
          <span className="cyklus-goal__progress">{g.progress}/{g.target}</span>
          <span className="cyklus-goal__desc">{g.description}</span>
          {g.rewardTitle && <span className="cyklus-goal__reward">Odměna: {g.rewardTitle}</span>}
        </div>
      ))}
    </div>
  );
}

function ContractPanel({ state }: { state: CyklusRunState }) {
  const contracts = getActiveContracts(state);
  if (contracts.length === 0) return null;
  return (
    <div className="cyklus-contracts">
      <div className="cyklus-contracts__label">AKTIVNÍ SMLOUVY</div>
      {contracts.map((c) => (
        <div key={c.id} className={`cyklus-contract ${c.collectPending ? 'cyklus-contract--pending' : ''}`}>
          <div className="cyklus-contract__title">{c.title}</div>
          <div className="cyklus-contract__row"><span className="cyklus-contract__label">Dává:</span> {c.given}</div>
          <div className="cyklus-contract__row"><span className="cyklus-contract__label">Vezme si:</span> {c.takes}</div>
          <div className="cyklus-contract__status">
            {c.collectPending ? '⚠ Splátka je na cestě' : '✓ Splátka zatím nečeká'}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiscoveryPanel({ discovery }: { discovery: CyklusDiscovery }) {
  const allCards = Object.keys(CYKLUS_CARDS).length;
  const sections = [
    { label: 'Karty', current: discovery.cards.length, total: allCards },
    { label: 'Sektory', current: discovery.sectors.length, total: 11 },
    { label: 'Itemy', current: discovery.items.length, total: 20 },
    { label: 'Imprinty', current: discovery.imprints.length, total: 12 },
    { label: 'Konce', current: discovery.endings.length, total: 12 },
    { label: 'Varianty', current: discovery.variants.length, total: 6 },
  ];
  return (
    <div className="cyklus-discovery">
      <div className="cyklus-discovery__title">Archiv objevů</div>
      {sections.map((s) => (
        <div key={s.label} className="cyklus-discovery__row">
          <span className="cyklus-discovery__label">{s.label}</span>
          <span className="cyklus-discovery__value">{s.current} / {s.total}</span>
          <div className="cyklus-discovery__bar"><div className="cyklus-discovery__fill" style={{ width: `${Math.round((s.current / s.total) * 100)}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

function StabilizationPanel({ state }: { state: CyklusRunState }) {
  const progress = computeStabilizationProgress(state);
  const items = [
    { label: 'Přežít restart sekvenci', ok: progress.survivedRestart },
    { label: `Imprinty: ${progress.imprints}/${progress.imprintsNeeded}`, ok: progress.imprints >= progress.imprintsNeeded },
    { label: `Sektory: ${progress.sectors}/${progress.sectorsNeeded}`, ok: progress.sectors >= progress.sectorsNeeded },
    { label: 'Staty v rovnováze', ok: progress.statsStable },
  ];
  return (
    <div className="cyklus-stabilization">
      <div className="cyklus-stabilization__title">Stabilizace</div>
      <div className="cyklus-stabilization__list">
        {items.map((item) => (
          <div key={item.label} className={`cyklus-stabilization__item ${item.ok ? 'cyklus-stabilization__item--ok' : ''}`}>
            <span className="cyklus-stabilization__check">{item.ok ? '✓' : '○'}</span>
            <span className="cyklus-stabilization__label">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="cyklus-stabilization__hint">
        {progress.statsStable ? 'Všechny staty jsou v bezpečném pásmu.' : 'Hleď na rovnováhu, ne na maximum.'}
      </div>
    </div>
  );
}

function RewardSection({ reward, progression }: { reward: RunReward; progression: SubjectProgression }) {
  const totalResiduum = reward.currencies.residuum ?? 0;
  const limits = getLoadoutLimits(progression);
  const specialCurrencies = (Object.entries(reward.currencies) as [import('../../game/cyklus/cyklusProgression').MetaCurrencyId, number][]).filter(
    ([key]) => key !== 'residuum' && (reward.currencies[key] ?? 0) > 0,
  );
  return (
    <div className="cyklus-reward">
      <div className="cyklus-reward__header">
        <div className="cyklus-reward__system-label">ZÁZNAM REZIDUA</div>
        <div className="cyklus-reward__flavor">
          Systém nedokázal smazat všechno. Něco zůstalo. Bohužel pro něj. Bohužel pro tebe.
        </div>
      </div>
      {totalResiduum > 0 && (
        <div className="cyklus-reward__residuum">
          <span className="cyklus-reward__residuum-value">+{totalResiduum}</span>
          <span className="cyklus-reward__residuum-label">{CURRENCY_LABELS.residuum}</span>
        </div>
      )}
      {reward.reasons.length > 0 && (
        <ul className="cyklus-reward__reasons">
          {reward.reasons.map((r, i) => (
            <li key={i} className="cyklus-reward__reason">{r}</li>
          ))}
        </ul>
      )}
      {specialCurrencies.length > 0 && (
        <div className="cyklus-reward__special">
          <div className="cyklus-reward__section-label">TEMATICKÉ FRAGMENTY</div>
          <div className="cyklus-reward__currencies">
            {specialCurrencies.map(([key, value]) => (
              <div key={key} className="cyklus-reward__currency">
                <span className="cyklus-reward__currency-value">+{value}</span>
                <span className="cyklus-reward__currency-label">{CURRENCY_LABELS[key]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {reward.unlockedUpgrades.length > 0 && (
        <div className="cyklus-reward__unlocks">
          <div className="cyklus-reward__section-label">NOVĚ DOSTUPNÉ PROTOKOLY</div>
          {reward.unlockedUpgrades.map((id) => {
            const u = SUBJECT_UPGRADES[id];
            if (!u) return null;
            return (
              <div key={id} className="cyklus-reward__unlock">
                <div className="cyklus-reward__unlock-title">{u.title}</div>
                <div className="cyklus-reward__unlock-desc">{u.description}</div>
              </div>
            );
          })}
        </div>
      )}
      {reward.unlockedScars.length > 0 && (
        <div className="cyklus-reward__unlocks">
          <div className="cyklus-reward__section-label">NOVĚ DOSTUPNÉ JIZVY</div>
          {reward.unlockedScars.map((id) => {
            const s = SUBJECT_SCARS[id];
            if (!s) return null;
            return (
              <div key={id} className="cyklus-reward__unlock">
                <div className="cyklus-reward__unlock-title">{s.title}</div>
                <div className="cyklus-reward__unlock-desc">{s.description}</div>
              </div>
            );
          })}
        </div>
      )}
      {Object.keys(reward.craftingMaterials).length > 0 && (
        <div className="cyklus-reward__unlocks">
          <div className="cyklus-reward__section-label">ZÍSKANÉ SUROVINY</div>
          <div className="cyklus-reward__currencies">
            {(Object.entries(reward.craftingMaterials) as [import('../../game/cyklus/cyklusProgression').CraftMaterialId, number][]).map(([key, value]) => (
              <div key={key} className="cyklus-reward__currency">
                <span className="cyklus-reward__currency-value">+{value}</span>
                <span className="cyklus-reward__currency-label">{MATERIAL_LABELS[key]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {reward.unlockedRecipes.length > 0 && (
        <div className="cyklus-reward__unlocks">
          <div className="cyklus-reward__section-label">ODEMČENÉ RECEPTY</div>
          {reward.unlockedRecipes.map((id) => {
            const r = CRAFT_RECIPES[id];
            if (!r) return null;
            return (
              <div key={id} className="cyklus-reward__unlock">
                <div className="cyklus-reward__unlock-title">{r.title}</div>
                <div className="cyklus-reward__unlock-desc">{r.description}</div>
              </div>
            );
          })}
        </div>
      )}
      {Object.keys(reward.profileMastery).length > 0 && (
        <div className="cyklus-reward__unlocks">
          <div className="cyklus-reward__section-label">PROFILOVÝ POSUN</div>
          {Object.entries(reward.profileMastery).map(([key, value]) => (
            <div key={key} className="cyklus-reward__unlock">
              <div className="cyklus-reward__unlock-title">{key}</div>
              <div className="cyklus-reward__unlock-desc">+{value} zkušenosti</div>
            </div>
          ))}
        </div>
      )}
      {reward.voidRoomHints.length > 0 && (
        <div className="cyklus-reward__unlocks">
          <div className="cyklus-reward__section-label">PRÁZDNOTA DOPORUČUJE</div>
          {reward.voidRoomHints.map((id) => {
            const room = VOID_ROOMS[id];
            return (
              <div key={id} className="cyklus-reward__unlock">
                <div className="cyklus-reward__unlock-title">{room?.title ?? id}</div>
              </div>
            );
          })}
        </div>
      )}
      {reward.recommendedActions.length > 0 && (
        <div className="cyklus-reward__unlocks">
          <div className="cyklus-reward__section-label">DALŠÍ KROKY</div>
          <ul className="cyklus-reward__reasons">
            {reward.recommendedActions.map((a, i) => (
              <li key={i} className="cyklus-reward__reason">{a}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="cyklus-reward__purse">
        <div className="cyklus-reward__section-label">STAV SUBJEKTU</div>
        <div className="cyklus-reward__purse-currencies">
          {(Object.entries(CURRENCY_LABELS) as [import('../../game/cyklus/cyklusProgression').MetaCurrencyId, string][]).map(([key, label]) => {
            const value = progression.currencies[key] ?? 0;
            return (
              <div key={key} className="cyklus-reward__purse-currency">
                <span className="cyklus-reward__purse-value">{value}</span>
                <span className="cyklus-reward__purse-label">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="cyklus-reward__loadout">
          <div className="cyklus-reward__loadout-label">Aktivní protokoly ({progression.equippedUpgrades.length}/{limits.upgradeSlots}):</div>
          {progression.equippedUpgrades.length === 0 ? (
            <span className="cyklus-reward__loadout-empty">žádné</span>
          ) : (
            <div className="cyklus-reward__loadout-list">
              {progression.equippedUpgrades.map((id) => {
                const u = SUBJECT_UPGRADES[id];
                return <span key={id} className="cyklus-reward__loadout-item">{u?.title ?? id}</span>;
              })}
            </div>
          )}
        </div>
        {progression.activeScar && (
          <div className="cyklus-reward__active-scar">
            <span className="cyklus-reward__active-scar-label">Aktivní jizva:</span>
            <span className="cyklus-reward__active-scar-title">{SUBJECT_SCARS[progression.activeScar]?.title ?? progression.activeScar}</span>
          </div>
        )}
      </div>
      <div className="cyklus-reward__advice">
        <div className="cyklus-reward__section-label">DOPORUČENÍ SYSTÉMU</div>
        <div className="cyklus-reward__advice-text">
          {progression.equippedUpgrades.length < limits.upgradeSlots && (progression.currencies.residuum ?? 0) >= 20
            ? 'Máš volný slot a reziduum. Zvaž protokol.'
            : 'Příště nečti všechno, co se tváří jako pravda.'}
        </div>
      </div>
    </div>
  );
}

function DeathAnalysis({ state }: { state: CyklusRunState }) {
  const analysis = analyzeDeath(state);
  if (!analysis) return null;
  const card = getCardById(analysis.topContributors[0]?.cardId ?? '');
  const blackBox = state.flags.includes('black_box_active');
  return (
    <div className="cyklus-death-analysis">
      <div className="cyklus-death-analysis__title">{blackBox ? 'Černá skříň: detail kolapsu' : 'Co tě zničilo'}</div>
      <div className="cyklus-death-analysis__stat">
        {STAT_LABELS[analysis.stat]} dosáhla {analysis.extreme === 'high' ? '100' : '0'}.
      </div>
      {blackBox && card && (
        <div className="cyklus-death-analysis__card">
          <span className="cyklus-death-analysis__card-label">Rozhodující karta:</span>
          <span className="cyklus-death-analysis__card-title">{card.title}</span>
        </div>
      )}
      {analysis.topContributors.length > 0 && (
        <div className="cyklus-death-analysis__contributors">
          <div className="cyklus-death-analysis__subtitle">Nejvíc ji ovlivnily:</div>
          {analysis.topContributors.map((c) => {
            const card = getCardById(c.cardId);
            return (
              <div key={c.cardId} className="cyklus-death-analysis__contributor">
                <span>{card?.title ?? c.cardId}</span>
                <span className={`cyklus-death-analysis__delta ${c.delta > 0 ? 'cyklus-death-analysis__delta--up' : 'cyklus-death-analysis__delta--down'}`}>
                  {c.delta > 0 ? '+' : ''}{c.delta}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <div className="cyklus-death-analysis__comment">{analysis.systemComment}</div>
    </div>
  );
}

function BehavioralAnalysis({ state }: { state: CyklusRunState }) {
  const patterns = composeBehavioralAnalysis(state);
  if (patterns.length === 0) return null;
  return (
    <div className="cyklus-behavioral">
      <div className="cyklus-behavioral__title">Behaviorální analýza subjektu</div>
      <div className="cyklus-behavioral__list">
        {patterns.map((p) => (
          <div key={p} className="cyklus-behavioral__pattern">— {p}</div>
        ))}
      </div>
    </div>
  );
}

function RunHistoryList({ history }: { history: CyklusRunSummary[] }) {
  return (
    <div className="cyklus-history">
      <div className="cyklus-history__title">Archiv cyklů</div>
      {history.slice().reverse().map((entry, idx) => (
        <div key={entry.id} className={`cyklus-history__entry ${entry.status === 'completed' ? 'cyklus-history__entry--completed' : 'cyklus-history__entry--dead'}`}>
          <div className="cyklus-history__number">CYKLUS #{history.length - idx}</div>
          <div className="cyklus-history__ending">{entry.endingTitle}</div>
          <div className="cyklus-history__details">
            <span>{entry.dominantProfile}</span>
            <span>·</span>
            <span>{entry.archetype}</span>
            <span>·</span>
            <span>{entry.cyclesSurvived} cyklů</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function getRewardType(record: CyklusChoiceRecord | undefined): { label: string; cls: string } | null {
  if (!record) return null;
  if (record.itemsGained.length > 0) return { label: 'PŘEDMĚT', cls: 'reward--item' };
  if (record.sectorBefore !== record.sectorAfter) return { label: 'PŘESUN', cls: 'reward--sector' };
  if (record.flagsGained.length > 0) return { label: 'STOPA', cls: 'reward--flag' };
  const totalDelta = Object.values(record.statDelta).reduce((s, v) => s + Math.abs(v), 0);
  if (totalDelta >= 15) return { label: 'VELKÝ DOPAD', cls: 'reward--big' };
  if (totalDelta >= 8) return { label: 'DOPAD', cls: 'reward--medium' };
  const profileShifted = Object.values(record.profileDelta).some((v) => v !== 0);
  if (profileShifted) return { label: 'PROFIL', cls: 'reward--profile' };
  return { label: 'TICHÝ DOPAD', cls: 'reward--silent' };
}

function OutcomePanel({ state, onDismiss }: { state: CyklusRunState; onDismiss: () => void }) {
  const record = state.history[state.history.length - 1];
  const deltas = record ? Object.entries(record.statDelta) as [StatKey, number][] : [];
  const hasSectorChange = record && record.sectorBefore !== record.sectorAfter;
  const items = record?.itemsGained ?? [];
  const entityDeltas = record
    ? (Object.entries(record.profileDelta) as [string, number][]).filter(([key]) => ['Ni', 'Ne', 'Si', 'Se', 'Ti', 'Te', 'Fi', 'Fe'].includes(key)).length > 0
    : false;
  const reward = getRewardType(record);
  const freshPools: string[] = state.freshMetaPools ?? [];
  const playedCard = record ? CYKLUS_CARDS[record.cardId] : undefined;
  const isFreshMeta = !!(playedCard && freshPools.length > 0 && playedCard.conditions?.some(
    (cond: CardCondition) => cond.type === 'unlockedPool' && freshPools.includes(cond.poolId ?? ''),
  ));

  return (
    <div className="cyklus-outcome" onClick={onDismiss} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onDismiss(); }}>
      <div className="cyklus-outcome__label">
        Dopad volby
        {reward && <span className={`cyklus-outcome__reward ${reward.cls}`}>{reward.label}</span>}
      </div>
      <div className="cyklus-outcome__story">{state.lastOutcomeText}</div>
      {deltas.length > 0 && (
        <div className="cyklus-outcome__stats">
          {deltas.map(([key, value]) => (
            <span key={key} className={`cyklus-outcome__stat ${value > 0 ? 'cyklus-outcome__stat--up' : 'cyklus-outcome__stat--down'}`}>
              {STAT_LABELS[key]} {value > 0 ? '↑' : '↓'} {Math.abs(value)}
            </span>
          ))}
        </div>
      )}
      {hasSectorChange && record && (
        <div className="cyklus-outcome__sector">
          Přesun: {SECTOR_LABELS[record.sectorBefore]} → {SECTOR_LABELS[record.sectorAfter]}
        </div>
      )}
      {items.length > 0 && (
        <div className="cyklus-outcome__items">
          Získáno: {items.map((id) => CYKLUS_ITEMS[id]?.title ?? id).join(' · ')}
        </div>
      )}
      {entityDeltas && <div className="cyklus-outcome__hint">Profil se posunul.</div>}
      {isFreshMeta && <div className="cyklus-outcome__fresh-meta">Tato karta byla odemčena předchozím koncem.</div>}
      <div className="cyklus-outcome__continue">Klikni pro pokračování</div>
    </div>
  );
}

function shouldLimitPreview(card: SwipeCard): boolean {
  if (card.rarity === 'rare') return true;
  const limitedTags = ['object', 'glitch', 'mirror', 'glitchka'];
  return limitedTags.some((tag) => card.tags.includes(tag)) || card.category === 'object' || card.category === 'trap';
}

function limitedPreviewHint(hint: string): string {
  if (hint.includes('Přesun')) return 'Změna sektoru';
  if (hint.includes('Předmět')) return 'Získáš nebo ztratíš něco';
  return 'Následek není plně jasný';
}

function directionPreview(state: CyklusRunState, card: SwipeCard, preview: { hint: string; risk?: 'low' | 'medium' | 'high' | 'unknown'; statHints?: Partial<Record<StatKey, 'up' | 'down' | 'danger'>> } | undefined, dir: 'yes' | 'no', limited: boolean, label: string, onChoice: () => void, disabled: boolean) {
  const hint = preview ? applyMetaProgressionPreviewHint(state, card, limited ? limitedPreviewHint(preview.hint) : preview.hint) : null;
  return (
    <div className={`cyklus-preview cyklus-preview--${dir}`}>
      {hint && <span className="cyklus-preview__hint">{hint}</span>}
      {preview?.risk && <span className={`cyklus-preview__risk cyklus-preview__risk--${preview.risk}`}>{preview.risk}</span>}
      <button className={`cyklus-btn cyklus-btn--${dir}`} onClick={onChoice} disabled={disabled}>
        <span className="cyklus-btn__label">{label}</span>
      </button>
    </div>
  );
}
