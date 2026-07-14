'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSession } from 'next-auth/react';
import { createCyklusRun, resolveChoice, getCardById, computeProfile, computeEnding, summarizeRun, analyzeDeath, computeStabilizationProgress, getSectorIntroText, composeCycleSummary, composeBehavioralAnalysis, computeStabilizationVariant, composeCycleForecast, exportRunLog, getNearestExtreme, generateRunCodename, activateItem, getStabilizationBuildProgress, getActiveContracts, getComboHint, rerollRunGoals, applyMetaProgressionPreviewHint, type BuildVariantProgress } from '../../game/cyklus/cyklusEngine';
import { evaluateFindings, saveNewFindings, loadEarnedFindings, getDeathUnlocks, saveMetaUnlocks, addFreshMetaPools, type EarnedFinding, type MetaUnlock } from '../../game/cyklus/cyklusFindings';
import { saveCyklusRun, loadCyklusRun, clearCyklusRun, loadCyklusRunHistory, appendCyklusRunSummary, isTutorialSeen, setTutorialV2Seen, clearTutorialSeen, loadServerCyklusRun } from '../../game/cyklus/cyklusStorage';
import { recordLocalCyklusDecision } from '../../game/cyklus/cyklusLocalProfile';
import { loadRecentCyklusComments, saveRecentCyklusComment } from '../../game/cyklus/cyklusCommentPool';
import { computeRunRewards, awardRunRewards, loadSubjectProgression, SUBJECT_UPGRADES, SUBJECT_SCARS, CURRENCY_LABELS, getLoadoutLimits, MATERIAL_LABELS, CRAFT_RECIPES, VOID_ROOMS, type RunReward, type SubjectProgression, type CyklusVoidHubActions } from '../../game/cyklus/cyklusProgression';
import { formatDelta, formatAbsDelta } from '../../game/cyklus/cyklusFormat';
import { loadStoryProgression, updateStoryAfterRun, saveStoryProgression } from '../../game/cyklus/cyklusStory';
import StatDock from './StatDock';
import { CyklusVoidHub } from './CyklusVoidHub';
import CyklusVoidHubClient from './CyklusVoidHubClient';
import CyklusPocketDock from './CyklusPocketDock';
import CyklusMobileUtilityDock from './CyklusMobileUtilityDock';
import { CyklusCardScene } from './CyklusCardScene';
import { CycleForecastNotice, CycleSummaryNotice } from './CycleNotices';
import CyklusCardOverlay from './CyklusCardOverlay';
import CyklusCardPoster from './CyklusCardPoster';
import { useHeader } from '../synthoma-os/HeaderContext';
import { Button } from '../synthoma-os/ui';
import SynthomaWordmark from '../synthoma/SynthomaWordmark';
import { STAT_LABELS, SECTOR_LABELS, ENTITY_LABELS, type StatKey, type EntityId, type CyklusRunState, type CyklusRunSummary, type SwipeCard, type CyklusChoiceRecord, type CardCondition, type RunEnding } from '../../game/cyklus/cyklusTypes';
import { getCardChoiceOrder, getChoiceForPhysicalSide, type PhysicalCardSide } from '../../game/cyklus/cyklusCardPresentation';
import useCyklusMobileLayout from './useCyklusMobileLayout';

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

function getActiveObjectiveText(state: CyklusRunState, runHistoryCount: number, tutorialActive: boolean): string {
  if (tutorialActive) {
    return 'Nauč se přežít volbu. Ano, lidstvo došlo tak daleko, že i kliknutí má následky.';
  }
  if (state.runFocus) {
    switch (state.runFocus.type) {
      case 'sector':
        return `Tento běh se drží oblasti: ${state.runFocus.label}.`;
      case 'pack':
        return `Tento běh čte balíček: ${state.runFocus.label}.`;
      case 'story':
        return `Tento běh sleduje příběhovou stopu: ${state.runFocus.label}.`;
      case 'appendix':
        return `Dodatek aktivní: ${state.runFocus.label}.`;
      default:
        return `Tento běh se drží stopy: ${state.runFocus.label}.`;
    }
  }
  if (state.choiceInCycle >= 10) {
    return 'Dokonči cyklus. Prázdnota už si rovná papíry.';
  }
  if (runHistoryCount === 0) {
    return 'Udrž energii, paměť, vazbu a kontrolu mimo okraje. 0 i 100 jsou špatně. Systém miluje extrémy, což je důvod, proč ho nemáme rádi.';
  }
  return 'Udrž staty mimo okraje a dokonči další cyklus. Prázdnota si pak spočítá, co z tebe zbylo.';
}

function shouldShowStatRuleHint(state: CyklusRunState, runHistoryCount: number, tutorialActive: boolean): boolean {
  return tutorialActive || (runHistoryCount === 0 && state.totalChoices <= 3);
}

export function getSwipeThreshold(cardWidth: number): number {
  return Math.max(56, Math.min(96, cardWidth * 0.22));
}

export function getSwipeDecision(distance: number, cardWidth: number, velocity = 0): 'yes' | 'no' | null {
  const committedDistance = Math.abs(distance) >= getSwipeThreshold(cardWidth);
  const committedFlick = Math.abs(distance) >= 24 && Math.abs(velocity) >= 0.55;
  if (!committedDistance && !committedFlick) return null;
  return distance > 0 ? 'yes' : 'no';
}

export function ActiveObjectivePanel({
  state,
  runHistoryCount,
  tutorialActive,
}: {
  state: CyklusRunState;
  runHistoryCount: number;
  tutorialActive: boolean;
}) {
  const showHint = shouldShowStatRuleHint(state, runHistoryCount, tutorialActive);
  return (
    <section
      className="cyklus-active-objective cyklus-active-objective--mobile-hidden"
      aria-labelledby="cyklus-active-objective-title"
      data-mobile-mode="hidden"
    >
      <div className="cyklus-active-objective__body">
        <div className="cyklus-active-objective__label" id="cyklus-active-objective-title">AKTUÁLNÍ STOPA</div>
        <p className="cyklus-active-objective__text">{getActiveObjectiveText(state, runHistoryCount, tutorialActive)}</p>
        {state.runFocus && <strong className="cyklus-active-objective__focus">{state.runFocus.label}</strong>}
        {showHint && (
          <p className="cyklus-active-objective__hint" data-testid="cyklus-stat-rule-hint">
            Cíl není mít všechno vysoko. Cíl je nespadnout z obou stran.
          </p>
        )}
      </div>
    </section>
  );
}

export function SystemNoticeOverlay({
  variant,
  label,
  text,
  onClose,
}: {
  variant: 'sector' | 'warning';
  label: string;
  text: string;
  onClose: () => void;
}) {
  const titleId = `cyklus-${variant}-notice-title`;

  return (
    <CyklusCardOverlay label={label} variant={variant} onClose={onClose} panelClassName={`cyklus-system-modal cyklus-system-modal--${variant}`}>
        <header className="cyklus-card-overlay__header cyklus-system-modal__header">
          <span id={titleId}>{label}</span>
          <button className="cyklus-system-modal__close" type="button" onClick={onClose} aria-label={`Zavřít: ${label}`}>×</button>
        </header>
        <div className="cyklus-card-overlay__content cyklus-system-modal__body">{text}</div>
        <footer className="cyklus-card-overlay__footer cyklus-system-modal__actions">
          <button data-card-overlay-primary className="cyklus-terminal-action" type="button" onClick={onClose}>Pokračovat</button>
        </footer>
    </CyklusCardOverlay>
  );
}

const TUTORIAL_PROGRESS_MAP: Record<string, { index: number; total: number; tier: 'min' | 'ext'; label: string; flavour: string }> = {
  tutorial_00_welcome:   { index: 1, total: 5, tier: 'min', label: 'Úvod',     flavour: 'Profesionalita je jen lépe formátovaná panika.' },
  tutorial_01_swipe:     { index: 2, total: 5, tier: 'min', label: 'Volby',    flavour: 'Pravá/levá není dobro/zlo. Obě změní subjekt.' },
  tutorial_02_stats:     { index: 3, total: 5, tier: 'min', label: 'Staty',    flavour: 'Čtyři čudlíky, kterými se dá subjekt elegantně poslat do háje.' },
  tutorial_03_balance:   { index: 4, total: 5, tier: 'min', label: 'Rovnováha', flavour: 'Stabilita není nuda. Je to méně dramatická smrt.' },
  tutorial_04_preview:   { index: 5, total: 5, tier: 'min', label: 'Preview',  flavour: 'Číst náznaky není slabost. Je to méně estetická smrt.' },
  tutorial_04b_junction: { index: 5, total: 5, tier: 'min', label: 'Rozcestník', flavour: 'Základ zvládnutý. Teď si vyber tempo.' },
  tutorial_05_profile:   { index: 1, total: 10, tier: 'ext', label: 'Profil',  flavour: 'Profil není diagnóza. Systémy jen milují krabičky.' },
  tutorial_06_items:     { index: 2, total: 10, tier: 'ext', label: 'Itemy',   flavour: 'Kapsa není dekorace. Kapse se nedá věřit.' },
  tutorial_07_imprints:  { index: 3, total: 10, tier: 'ext', label: 'Otisky',  flavour: 'Otisk není item. Drží on tebe.' },
  tutorial_08_consequences: { index: 4, total: 10, tier: 'ext', label: 'Následky', flavour: 'Následky mají kalendář. Systém je objednává později.' },
  tutorial_09_sectors:   { index: 5, total: 10, tier: 'ext', label: 'Sektory', flavour: 'Sektor je místnost, která se tváří, že má osobnost.' },
  tutorial_10_cycle:     { index: 6, total: 10, tier: 'ext', label: 'Cyklus',  flavour: 'Dvanáct chyb, pak pětiminutová přestávka na sebemrzenčí.' },
  tutorial_11_restart:   { index: 7, total: 10, tier: 'ext', label: 'Restart', flavour: 'Restart není undo. Je to diagnostika s mezinápravou.' },
  tutorial_12_void:      { index: 8, total: 10, tier: 'ext', label: 'Prázdnota', flavour: 'Prázdnota není menu. Je to místnost, co si pamatuje tvůj rozpad.' },
  tutorial_13_progression: { index: 9, total: 10, tier: 'ext', label: 'Progrese', flavour: 'Utrácení zbytků sebe za protokoly je zdravý rozvoj.' },
  tutorial_14_packs:     { index: 10, total: 10, tier: 'ext', label: 'Příběhové linky', flavour: 'Packy tě naučí, že ses myslel, že víš, kdo jsi.' },
  tutorial_15_ready:     { index: 10, total: 10, tier: 'ext', label: 'Start',  flavour: 'Konec návodu. Začátek poškození.' },
};
import { CYKLUS_CARDS, CYKLUS_ITEMS, CYKLUS_IMPRINTS } from '../../game/cyklus/content';
import { updateDiscoveryFromRun, loadDiscovery, type CyklusDiscovery } from '../../game/cyklus/cyklusDiscovery';
import CyklusPortalScope from './CyklusPortalScope';

export default function CyklusClient() {
  const { setStatus, setActions } = useHeader();
  const { data: session } = useSession();
  const mobileGameplayLayout = useCyklusMobileLayout();
  const [state, setState] = useState<CyklusRunState | null>(null);
  const [loading, setLoading] = useState(true);
  const [outcomeVisible, setOutcomeVisible] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [flyDirection, setFlyDirection] = useState<'yes' | 'no' | null>(null);
  const [cardArtRevealed, setCardArtRevealed] = useState(false);
  const [posterViewerOpen, setPosterViewerOpen] = useState(false);
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
  const [confirmActivateId, setConfirmActivateId] = useState<string | null>(null);
  const prevSectorRef = useRef<string | null>(null);
  const prevCycleRef = useRef<number>(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardTitleRef = useRef<HTMLHeadingElement>(null);
  const posterViewerTriggerRef = useRef<HTMLButtonElement>(null);
  const gesturePointerId = useRef<number | null>(null);
  const gestureStartX = useRef(0);
  const gestureStartY = useRef(0);
  const gestureStartTime = useRef(0);
  const gestureLastX = useRef(0);
  const gestureLastTime = useRef(0);
  const gestureAxis = useRef<'undecided' | 'horizontal' | 'vertical'>('undecided');
  const gestureDidDrag = useRef(false);
  const suppressClick = useRef(false);
  const suppressClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragXRef = useRef(0);
  const swipeVelocity = useRef(0);
  const outcomeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeCard = state ? getCardById(state.currentCardId) ?? getCardById('first_boot') : undefined;
  const posterActive = state?.status === 'playing'
    && activeCard?.presentation?.mode === 'poster-then-text'
    && !cardArtRevealed
    && !outcomeVisible;

  const showTutorialSkip = activeCard?.category === 'tutorial' && !state?.flags.includes('tutorial_v2_done') && !showMenu;

  useEffect(() => {
    if (showMenu || !state) {
      setStatus(null);
      setActions(null);
      return;
    }
    const cycle = `C${String(state.cycle).padStart(2, '0')}`;
    const progress = `${String(state.choiceInCycle).padStart(2, '0')}/12`;
    setStatus(
      <div className="cyklus-game-status" aria-label={`${SECTOR_LABELS[state.sector]}, cyklus ${state.cycle}, postup ${state.choiceInCycle} z 12`}>
        <span className="cyklus-game-status__sector" title={SECTOR_LABELS[state.sector]}>{SECTOR_LABELS[state.sector]}</span>
        <span aria-hidden="true">·</span>
        <span className="cyklus-game-status__cycle">{cycle}</span>
        <span aria-hidden="true">·</span>
        <span className="cyklus-game-status__progress">{progress}</span>
      </div>
    );
    setActions(
      showTutorialSkip ? (
        <button
          className="os-command os-command--skip"
          type="button"
          data-cyklus-command="skip"
          aria-label="Přeskočit tutorial"
          title="Přeskočit tutorial"
          onClick={() => setShowSkipConfirm(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14M19 5v14M8 7l7 5-7 5Z"/></svg>
        </button>
      ) : null
    );
  }, [state, showMenu, activeCard, showTutorialSkip, setStatus, setActions]);

  useEffect(() => {
    if (!posterViewerOpen) return;
    document.body.classList.add('cyklus-poster-lock');
    return () => document.body.classList.remove('cyklus-poster-lock');
  }, [posterViewerOpen]);

  useEffect(() => {
    setPosterViewerOpen(false);
  }, [activeCard?.id, posterActive]);

  const closePosterViewer = useCallback(() => {
    setPosterViewerOpen(false);
    window.setTimeout(() => posterViewerTriggerRef.current?.focus(), 0);
  }, []);

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
        } else if (seen) {
          setState(null);
          setSavedRun(null);
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
    if (typeof window !== 'undefined' && state?.currentCardId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setCardArtRevealed(false);
  }, [state?.currentCardId]);

  useEffect(() => {
    if (!showSkipConfirm && !showVoidHub && !showBuild && !showDiscovery) return;
    const handleOverlayEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (showSkipConfirm) setShowSkipConfirm(false);
      else if (showVoidHub) setShowVoidHub(false);
      else if (showBuild) setShowBuild(false);
      else if (showDiscovery) setShowDiscovery(false);
    };
    document.addEventListener('keydown', handleOverlayEscape);
    return () => document.removeEventListener('keydown', handleOverlayEscape);
  }, [showBuild, showDiscovery, showSkipConfirm, showVoidHub]);

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
  }, [state]);

  useEffect(() => {
    if (!state || state.status !== 'playing') return;
    const prevSector = prevSectorRef.current;
    const prevCycle = prevCycleRef.current;

    if (prevSector !== null && prevSector !== state.sector && !outcomeVisible) {
      const seed = `${state.id}-${state.sector}-${state.totalChoices}`;
      setSectorIntro(getSectorIntroText(state.sector, seed));
    }

    if (prevCycle !== state.cycle) {
      const recentComments = loadRecentCyklusComments();
      const summary = composeCycleSummary(state, recentComments, (comment) => {
        if (comment) saveRecentCyklusComment(comment);
      });
      if (summary) {
        setCycleSummary(summary);
      }
    }

    prevSectorRef.current = state.sector;
    prevCycleRef.current = state.cycle;
  }, [state, outcomeVisible]);

  useEffect(() => {
    if (state?.status === 'playing' && (state.flags.includes('tutorial_v2_done') || state.flags.includes('tutorial_min_done')) && !isTutorialSeen()) {
      setTutorialV2Seen();
      setTutorialSeenState(true);
    }
  }, [state]);

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
  }, [state]);

  const handleChoice = useCallback((direction: 'yes' | 'no', physicalDirection: 'yes' | 'no' = direction) => {
    if (!state || state.status !== 'playing') return;
    setFlyDirection(physicalDirection);
    if (outcomeTimer.current) clearTimeout(outcomeTimer.current);
    outcomeTimer.current = setTimeout(() => {
      const next = resolveChoice(state, direction);
      recordLocalCyklusDecision(state, next, direction);
      setState(next);
      setOutcomeVisible(true);
      setDragX(0);
      setFlyDirection(null);
    }, 280);
  }, [state]);

  const revealCardRecord = useCallback(() => {
    setCardArtRevealed(true);
    setTimeout(() => cardTitleRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  const dismissOutcome = useCallback(() => {
    if (outcomeTimer.current) clearTimeout(outcomeTimer.current);
    setOutcomeVisible(false);
    setTimeout(() => cardRef.current?.focus({ preventScroll: true }), 0);
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
      flags: [...state.flags, 'tutorial_min_done', 'tutorial_done', 'tutorial_v2_done'],
      usedCardIds: [...state.usedCardIds, 'tutorial_04b_junction', 'tutorial_15_ready'],
      currentCardId: 'restart_0' as const,
    };
    setState(skipped);
    saveCyklusRun(skipped).catch(() => { /* ignore */ });
    setShowSkipConfirm(false);
  }, [state]);

  const updateDragX = (value: number) => {
    dragXRef.current = value;
    setDragX(value);
  };

  const releaseGestureCapture = (target: HTMLDivElement, pointerId: number) => {
    if (typeof target.hasPointerCapture === 'function' && target.hasPointerCapture(pointerId)) {
      target.releasePointerCapture(pointerId);
    }
  };

  const clearGesture = () => {
    gesturePointerId.current = null;
    gestureAxis.current = 'undecided';
    gestureDidDrag.current = false;
    swipeVelocity.current = 0;
  };

  const armClickSuppression = () => {
    suppressClick.current = true;
    if (suppressClickTimer.current) clearTimeout(suppressClickTimer.current);
    suppressClickTimer.current = setTimeout(() => {
      suppressClick.current = false;
      suppressClickTimer.current = null;
    }, 0);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const activeCard = state ? getCardById(state.currentCardId) ?? getCardById('first_boot') : undefined;
    const posterVisible = activeCard?.presentation?.mode === 'poster-then-text' && !cardArtRevealed;
    if (posterVisible || flyDirection || outcomeVisible || gesturePointerId.current !== null || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const now = performance.now();
    gesturePointerId.current = e.pointerId;
    gestureStartX.current = e.clientX;
    gestureStartY.current = e.clientY;
    gestureStartTime.current = now;
    gestureLastX.current = e.clientX;
    gestureLastTime.current = now;
    gestureAxis.current = 'undecided';
    gestureDidDrag.current = false;
    swipeVelocity.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gesturePointerId.current !== e.pointerId || flyDirection || outcomeVisible) return;
    const dx = e.clientX - gestureStartX.current;
    const dy = e.clientY - gestureStartY.current;
    if (gestureAxis.current === 'undecided') {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
      if (Math.abs(dx) > Math.abs(dy) * 1.15) {
        gestureAxis.current = 'horizontal';
        gestureDidDrag.current = true;
        if (typeof e.currentTarget.setPointerCapture === 'function') e.currentTarget.setPointerCapture(e.pointerId);
      } else if (Math.abs(dy) > Math.abs(dx) * 1.15) {
        gestureAxis.current = 'vertical';
        gestureDidDrag.current = true;
        return;
      } else {
        return;
      }
    }
    if (gestureAxis.current !== 'horizontal') return;
    e.preventDefault();
    const now = performance.now();
    const elapsed = Math.max(1, now - gestureLastTime.current);
    swipeVelocity.current = (e.clientX - gestureLastX.current) / elapsed;
    gestureLastX.current = e.clientX;
    gestureLastTime.current = now;
    const cardWidth = cardRef.current?.clientWidth ?? 420;
    const maxDrag = Math.max(120, Math.min(180, cardWidth * 0.45));
    updateDragX(Math.max(-maxDrag, Math.min(maxDrag, dx)));
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gesturePointerId.current !== e.pointerId) return;
    const wasHorizontal = gestureAxis.current === 'horizontal';
    const wasDrag = gestureDidDrag.current;
    const decision = wasHorizontal && !flyDirection && !outcomeVisible
      ? getSwipeDecision(dragXRef.current, cardRef.current?.clientWidth ?? 420, swipeVelocity.current)
      : null;
    releaseGestureCapture(e.currentTarget, e.pointerId);
    clearGesture();
    if (wasDrag) armClickSuppression();
    if (decision && state) {
      const activeCard = getCardById(state.currentCardId) ?? getCardById('first_boot');
      if (activeCard) {
        const side: PhysicalCardSide = decision === 'yes' ? 'right' : 'left';
        handleChoice(getChoiceForPhysicalSide(activeCard, side), decision);
      }
    } else updateDragX(0);
  };

  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gesturePointerId.current !== e.pointerId) return;
    releaseGestureCapture(e.currentTarget, e.pointerId);
    if (gestureDidDrag.current) armClickSuppression();
    clearGesture();
    updateDragX(0);
  };

  const onCardClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClick.current) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClick.current = false;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (outcomeVisible) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dismissOutcome();
        }
        return;
      }
      if (!state) return;
      const activeCard = getCardById(state.currentCardId) ?? getCardById('first_boot');
      if (!activeCard || (activeCard.presentation?.mode === 'poster-then-text' && !cardArtRevealed)) return;
      if (e.key === 'ArrowRight') handleChoice(getChoiceForPhysicalSide(activeCard, 'right'), 'yes');
      if (e.key === 'ArrowLeft') handleChoice(getChoiceForPhysicalSide(activeCard, 'left'), 'no');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cardArtRevealed, dismissOutcome, handleChoice, outcomeVisible, state]);

  if (loading) return <div className="cyklus-loading">Nahrává se cyklus…</div>;

  if (showMenu) {
    return (
      <div className="cyklus-no-select cyklus-root cyklus-root--menu">
        <video className="cyklus-menu__video" autoPlay muted loop playsInline aria-hidden="true" tabIndex={-1}>
          <source src="/video/SYNTHOMA5.webm" type="video/webm" />
        </video>
        <main className="cyklus-menu">
          <div className="cyklus-menu__bootbar" aria-label="SYNTHOMA OS terminal">
            <span>SYNTHOMA OS</span>
            <span>TERMINAL 0.9.72</span>
          </div>
          <section className="cyklus-menu__content cyklus-menu__content--brand-safe" aria-labelledby="cyklus-menu-brand">
            <div className="cyklus-menu__title">
              <SynthomaWordmark context="cyklus" className="cyklus-menu__brand" id="cyklus-menu-brand" data-testid="cyklus-menu-brand" />
              <span className="cyklus-menu__module">CYKLUS / NULL-1</span>
            </div>
            <div className="cyklus-menu__restart-line">RESTART PROTOCOL / STANDBY</div>
            <div className="cyklus-menu__intro">
              <p className="cyklus-menu__intro-line">Jsi subjekt v diagnostickém cyklu. Každá karta je rozhodnutí, které mění energii, paměť, vazbu a kontrolu.</p>
              <p className="cyklus-menu__intro-line cyklus-menu__intro-line--dim">Cílem není maximum, ale rovnováha. Extrém znamená konec.</p>
            </div>
            <div className={`cyklus-menu__subtitle${savedRun ? ' cyklus-menu__subtitle--saved' : ''}`}>
              <span>STAV BĚHU</span>
              <strong>{savedRun ? `Rozehraný cyklus ${savedRun.cycle} · ${SECTOR_LABELS[savedRun.sector]}` : 'Žádná rozehraná hra'}</strong>
            </div>
            <div className="cyklus-menu__actions">
              {savedRun && (
                <Button className="cyklus-menu__button cyklus-menu__button--primary" variant="primary" onClick={handleContinue} before={<span className="cyklus-menu__action-index" aria-hidden="true">01</span>}>
                  Pokračovat
                </Button>
              )}
              <Button className="cyklus-menu__button cyklus-menu__button--new" variant="secondary" onClick={handleNewGame} before={<span className="cyklus-menu__action-index" aria-hidden="true">{savedRun ? '02' : '01'}</span>}>
                Nová hra
              </Button>
              <div className="cyklus-menu__utility-actions">
                {tutorialSeen && (
                  <Button className="cyklus-menu__button cyklus-menu__button--tertiary" variant="tertiary" onClick={handleRepeatTutorial} before={<span className="cyklus-menu__action-index" aria-hidden="true">{savedRun ? '03' : '02'}</span>}>
                    Zopakovat tutorial
                  </Button>
                )}
                <Button className="cyklus-menu__button cyklus-menu__button--tertiary" variant="tertiary" onClick={() => setShowVoidHub(true)} before={<span className="cyklus-menu__action-index" aria-hidden="true">{savedRun ? '04' : '03'}</span>}>
                  PRÁZDN0TA
                </Button>
              </div>
            </div>
          </section>
          <div className="cyklus-menu__portal" aria-hidden="true">
            <span className="cyklus-menu__portal-core" />
          </div>
        </main>
        {showVoidHub && (
          <div className="cyklus-no-select cyklus-overlay cyklus-overlay--build cyklus-overlay--void-hub">
            <button className="cyklus-overlay__backdrop" type="button" onClick={() => setShowVoidHub(false)} aria-label="Zavřít Prázdnotu" />
            <div className="cyklus-overlay__panel" role="dialog" aria-modal="true" aria-label="Prázdnota">
              <button className="cyklus-overlay__close" type="button" onClick={() => setShowVoidHub(false)} aria-label="Zavřít Prázdnotu">×</button>
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

  const card = activeCard;
  const profile = computeProfile(state);
  const ending = state.status === 'dead' || state.status === 'completed' ? computeEnding(state) : null;
  const tutorialHighlight = getTutorialHighlight(card?.id);
  const tutorialActive = card?.category === 'tutorial' && !state.flags.includes('tutorial_v2_done');
  const showCardPoster = posterActive;

  return (
    <>
    <div className={[
      'cyklus-no-select',
      'cyklus-root',
      ending ? 'cyklus-root--ended' : '',
      !ending ? 'cyklus-root--playing' : '',
      dragX !== 0 ? 'cyklus-root--swiping' : '',
      outcomeVisible ? 'cyklus-root--outcome-visible' : '',
      posterViewerOpen ? 'cyklus-root--poster-active' : '',
    ].filter(Boolean).join(' ')}>
      {showSkipConfirm && (
        <div className="cyklus-no-select cyklus-overlay cyklus-overlay--warning">
          <button className="cyklus-overlay__backdrop" type="button" onClick={() => setShowSkipConfirm(false)} aria-label="Zavřít potvrzení tutorialu" />
          <section className="cyklus-system-modal cyklus-system-modal--warning" role="dialog" aria-modal="true" aria-labelledby="cyklus-skip-tutorial-title">
            <header className="cyklus-system-modal__header">
              <span id="cyklus-skip-tutorial-title">PŘESKOČIT TUTORIÁL?</span>
              <button className="cyklus-system-modal__close" type="button" onClick={() => setShowSkipConfirm(false)} aria-label="Zavřít potvrzení tutorialu">×</button>
            </header>
            <div className="cyklus-system-modal__body">
              Systém ti nebude vysvětlovat, proč se rozpadáš. Což je tvoje právo a naše budoucí zábava.
            </div>
            <footer className="cyklus-system-modal__actions">
              <button className="cyklus-terminal-action" type="button" onClick={() => setShowSkipConfirm(false)}>
                Zůstat v onboarding
              </button>
              <button className="cyklus-terminal-action cyklus-terminal-action--warning" type="button" onClick={handleSkipTutorial}>
                Přeskočit
              </button>
            </footer>
          </section>
        </div>
      )}
      {!ending && (
        <StatDock
          stats={state.stats}
          openStat={activeStat}
          onOpenStat={setActiveStat}
          highlight={tutorialHighlight?.stat}
          history={state.history}
          climate={state.modifier.id !== 'none' ? state.modifier : null}
          tutorialProgress={card?.category === 'tutorial' && !state.flags.includes('tutorial_v2_done') ? (() => {
            const tp = TUTORIAL_PROGRESS_MAP[card.id];
            const tierLabel = tp?.tier === 'ext' ? 'ROZŠÍŘENÍ' : 'ZÁKLAD';
            return (
              <div className="cyklus-tutorial-progress">
                <span className="cyklus-tutorial-progress__label">{tierLabel} {tp?.index ?? 1} / {tp?.total ?? 5}</span>
                <span className="cyklus-tutorial-progress__mechanic">{tp?.label ?? 'Onboarding'}</span>
                <span className="cyklus-tutorial-progress__flavour">Sarkasmin závěr: &quot;{tp?.flavour ?? 'Systém se tváří profesionálně. To je lépe formátovaná panika.'}&quot;</span>
              </div>
            );
          })() : undefined}
        />
      )}
      {!ending && !mobileGameplayLayout && (
        <CyklusPocketDock
          state={state}
          open={showPocket}
          highlighted={tutorialHighlight?.pocket}
          confirmActivateId={confirmActivateId}
          onToggle={() => setShowPocket((value) => !value)}
          onClose={() => setShowPocket(false)}
          onConfirmActivate={setConfirmActivateId}
          onActivate={handleActivateItem}
        />
      )}
      <main className="cyklus-stage">
        {ending ? (
          <div className="cyklus-end">
            <EndReportVerdict state={state} ending={ending} />
            <div className="cyklus-end__primary">
              <RunEndSummary
                state={state}
                ending={ending}
                reward={runReward}
                onOpenVoidHub={() => setShowVoidHub(true)}
                onRestart={handleRestart}
              />
              {runReward && <RewardSection reward={runReward} progression={progression} />}
            </div>
            <details className="cyklus-end__diagnostics" data-report-region="diagnostics" open>
            <summary className="cyklus-end__diagnostics-summary">DIAGNOSTIKA BĚHU</summary>
            <div className="cyklus-end__diagnostics-body">
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
            {state.status === 'dead' && <DeathAnalysis state={state} recentComments={loadRecentCyklusComments()} />}
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
            </div>
            </details>
            <div className="cyklus-end__actions">
              <button
                className="cyklus-btn cyklus-btn--secondary"
                type="button"
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
                type="button"
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
                <button className="cyklus-btn cyklus-btn--secondary" type="button" onClick={() => setShowHistory(!showHistory)}>
                  {showHistory ? 'Skrýt archiv' : 'Archiv cyklů'}
                </button>
              )}
            </div>
            {showHistory && <RunHistoryList history={runHistory} />}
          </div>
        ) : card ? (
          <>
            <ActiveObjectivePanel state={state} runHistoryCount={runHistory.length} tutorialActive={tutorialActive} />
            <div
              ref={cardRef}
              className={[
                'cyklus-no-select',
                'cyklus-card',
                `cyklus-card--category-${card.category}`,
                outcomeVisible ? 'cyklus-card--outcome' : '',
                showCardPoster ? 'cyklus-card--poster' : '',
                dragX > 0 ? 'cyklus-card--swipe-yes' : dragX < 0 ? 'cyklus-card--swipe-no' : '',
                flyDirection === 'yes' ? 'cyklus-card--fly-yes' : flyDirection === 'no' ? 'cyklus-card--fly-no' : '',
              ].filter(Boolean).join(' ')}
              style={{
                transform: `translateX(${dragX}px) rotate(${dragX * 0.14}deg) scale(${1 - Math.abs(dragX) * 0.0004})`,
                '--swipe-progress': Math.min(1, Math.abs(dragX) / getSwipeThreshold(cardRef.current?.clientWidth ?? 420)),
                '--swipe-opacity': Math.max(0, (Math.min(1, Math.abs(dragX) / getSwipeThreshold(cardRef.current?.clientWidth ?? 420)) - 0.18) / 0.82),
              } as React.CSSProperties}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              onClickCapture={onCardClickCapture}
              tabIndex={-1}
              data-gameplay-surface="fixed"
              aria-hidden={posterViewerOpen ? true : undefined}
            >
              {showCardPoster && !posterViewerOpen && card.presentation && (
                <CyklusCardPoster
                  presentation={card.presentation}
                  cardTitle={card.title}
                  onReveal={revealCardRecord}
                  onOpenViewer={() => setPosterViewerOpen(true)}
                  zoomTriggerRef={posterViewerTriggerRef}
                />
              )}
              {!showCardPoster && (
              <>
              {card.tags.includes('overload') && (
                <div className="cyklus-card__overload">
                  <span className="cyklus-card__overload-label">⚠ PŘETLAKOVÉ POKUŠENÍ</span>
                  <span className="cyklus-card__overload-risk">Vysoké riziko · extrémní reward</span>
                </div>
              )}
              <div className="cyklus-card__metadata">
                <div className="cyklus-card__category">{card.logLabel}</div>
                <div className="cyklus-card__context">
                  <span>{SECTOR_LABELS[state.sector]}</span>
                  {card.presentation?.artSrc && (
                    <button className="cyklus-card__art-toggle" type="button" onClick={() => setCardArtRevealed(false)}>
                      OBRAZ
                    </button>
                  )}
                </div>
              </div>
              <h2 ref={cardTitleRef} className="cyklus-card__title" tabIndex={-1}>{card.title}</h2>
              <CyklusCardScene card={card} />
              {card.category === 'restart' && (
                <div className="cyklus-card__restart-badge">[RESTART]</div>
              )}
              {outcomeVisible && state.lastOutcomeText && (
                <OutcomePanel state={state} onDismiss={dismissOutcome} />
              )}
              {sectorIntro && (
                <SystemNoticeOverlay variant="sector" label={SECTOR_LABELS[state.sector]} text={sectorIntro} onClose={() => setSectorIntro(null)} />
              )}
              {cycleSummary && (
                <CycleSummaryNotice state={state} text={cycleSummary} onClose={() => setCycleSummary(null)} />
              )}
              {preRunWarning && (
                <SystemNoticeOverlay variant="warning" label="ZÁZNAM PŘEDCHOZÍHO SUBJEKTU" text={preRunWarning} onClose={() => setPreRunWarning(null)} />
              )}
              {cycleForecast && !preRunWarning && (
                <CycleForecastNotice state={state} text={cycleForecast} onClose={() => setCycleForecast(null)} />
              )}
              </>
              )}
            </div>
          </>
        ) : (
          <div className="cyklus-empty">Karta nenalezena.</div>
        )}
      </main>

      {!ending && card && !showCardPoster && (
        <div
          className="cyklus-choice-dock"
          data-cyklus-choice-dock
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClickCapture={onCardClickCapture}
        >
          <div data-card-actions className={`cyklus-card__preview ${tutorialHighlight?.actions ? 'cyklus-card__preview--highlight' : ''}`}>
            {getCardChoiceOrder(card).map((choice, index) => {
              const side: PhysicalCardSide = index === 0 ? 'left' : 'right';
              const outcome = card[choice];
              const label = choice === 'yes' ? card.yesLabel : card.noLabel;
              const fly = side === 'right' ? 'yes' : 'no';
              return directionPreview(state, card, outcome.preview, choice, side, shouldLimitPreview(card), label, () => handleChoice(choice, fly), outcomeVisible, side);
            })}
          </div>
        </div>
      )}

      {!ending && mobileGameplayLayout && (
        <CyklusMobileUtilityDock
          state={state}
          open={showPocket}
          confirmActivateId={confirmActivateId}
          onToggle={() => setShowPocket((value) => !value)}
          onClose={() => setShowPocket(false)}
          onConfirmActivate={setConfirmActivateId}
          onActivate={handleActivateItem}
        />
      )}

      {!ending && (
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
      )}

    </div>

    {showCardPoster && posterViewerOpen && card?.presentation && createPortal(
      <CyklusPortalScope>
        <CyklusCardPoster
          presentation={card.presentation}
          cardTitle={card.title}
          fullscreen
          onReveal={revealCardRecord}
          onClose={closePosterViewer}
        />
      </CyklusPortalScope>,
      document.body,
    )}

      {showBuild && state && (
        <div className="cyklus-no-select cyklus-overlay cyklus-overlay--build">
          <button className="cyklus-overlay__backdrop" type="button" onClick={() => setShowBuild(false)} aria-label="Zavřít build" />
          <div className="cyklus-overlay__panel" role="dialog" aria-modal="true" aria-label="Build a stabilizace">
            <button className="cyklus-overlay__close" type="button" onClick={() => setShowBuild(false)} aria-label="Zavřít build">×</button>
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
        <div className="cyklus-no-select cyklus-overlay cyklus-overlay--discovery">
          <button className="cyklus-overlay__backdrop" type="button" onClick={() => setShowDiscovery(false)} aria-label="Zavřít archiv" />
          <div className="cyklus-overlay__panel" role="dialog" aria-modal="true" aria-label="Archiv a objevy">
            <button className="cyklus-overlay__close" type="button" onClick={() => setShowDiscovery(false)} aria-label="Zavřít archiv">×</button>
            <DiscoveryPanel discovery={discovery} />
          </div>
        </div>
      )}
      {showVoidHub && (
        <div className="cyklus-no-select cyklus-overlay cyklus-overlay--build cyklus-overlay--void-hub">
          <button className="cyklus-overlay__backdrop" type="button" onClick={() => setShowVoidHub(false)} aria-label="Zavřít Prázdnotu" />
          <div className="cyklus-overlay__panel" role="dialog" aria-modal="true" aria-label="Prázdnota">
            <button className="cyklus-overlay__close" type="button" onClick={() => setShowVoidHub(false)} aria-label="Zavřít Prázdnotu">×</button>
            <CyklusVoidHubClient
              playHref="/cyklus"
              compact={false}
              recentReward={runReward}
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

function getFirstSentence(text: string): string {
  const trimmed = text.trim();
  const match = trimmed.match(/^(.+?[.!?])(\s|$)/);
  return match?.[1] ?? trimmed;
}

function getOutcomeExplanation(
  state: CyklusRunState,
  ending: RunEnding,
  stabilizationVariant: ReturnType<typeof computeStabilizationVariant> | null,
): string {
  if (state.status === 'completed' && stabilizationVariant) {
    return `Cyklus tě nerozložil. ${getFirstSentence(stabilizationVariant.text)}`;
  }
  if (ending.type === 'death') {
    const boundary = ending.extreme === 'high' ? '100' : '0';
    return `${STAT_LABELS[ending.stat]} dosáhla ${boundary}. ${getFirstSentence(ending.text)}`;
  }
  return getFirstSentence(ending.text);
}

function getQuickRewardItems(reward: RunReward | null): { id: string; title: string; detail: string }[] {
  if (!reward) return [];

  const items: { id: string; title: string; detail: string }[] = [];
  const residuum = reward.currencies.residuum ?? 0;
  if (residuum > 0) {
    items.push({ id: 'residuum', title: CURRENCY_LABELS.residuum, detail: `+${residuum}` });
  }

  const material = (Object.entries(reward.craftingMaterials) as [keyof typeof MATERIAL_LABELS, number | undefined][])
    .filter(([, value]) => (value ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))[0];
  if (material) {
    const [id, value] = material;
    items.push({ id: `material-${id}`, title: MATERIAL_LABELS[id], detail: `+${value ?? 0}` });
  }

  const stabilizationCore = reward.currencies.stabilizationCore ?? 0;
  if (stabilizationCore > 0) {
    items.push({ id: 'stabilization-core', title: CURRENCY_LABELS.stabilizationCore, detail: `+${stabilizationCore}` });
  } else if (reward.unlockedScars[0]) {
    const scarId = reward.unlockedScars[0];
    items.push({ id: `scar-${scarId}`, title: 'Nová jizva', detail: SUBJECT_SCARS[scarId]?.title ?? scarId });
  }

  const upgradeId = reward.unlockedUpgrades[0];
  const recipeId = reward.unlockedRecipes[0];
  if (upgradeId) {
    items.push({ id: `upgrade-${upgradeId}`, title: 'Nový protokol', detail: SUBJECT_UPGRADES[upgradeId]?.title ?? upgradeId });
  } else if (recipeId) {
    items.push({ id: `recipe-${recipeId}`, title: 'Nový recept', detail: CRAFT_RECIPES[recipeId]?.title ?? recipeId });
  }

  return items.slice(0, 4);
}

function getRecommendedNextSteps(reward: RunReward | null): string[] {
  const steps: string[] = [];
  if (reward) {
    steps.push(...reward.recommendedActions);
    steps.push(...reward.voidRoomHints.map((id) => `V Prázdnotě zkontroluj ${VOID_ROOMS[id]?.title ?? id}.`));
  }
  steps.push('Otevři Prázdnotu a rozhodni, co si vzít do dalšího běhu.');
  return [...new Set(steps)].slice(0, 3);
}

export function EndReportVerdict({ state, ending }: { state: CyklusRunState; ending: RunEnding }) {
  const stabilizationVariant = state.status === 'completed' ? computeStabilizationVariant(state) : null;
  const title = stabilizationVariant?.title ?? ending.title;
  return (
    <header className="cyklus-end__header" data-testid="cyklus-end-verdict" data-report-region="verdict">
      <div className="cyklus-end__system-label">ZÁVĚREČNÁ ZPRÁVA SUBJEKTU</div>
      <div className="cyklus-end__codename">{generateRunCodename(state)}</div>
      <h1 className="cyklus-end__title">{title}</h1>
      <p className="cyklus-end__verdict-text">{getOutcomeExplanation(state, ending, stabilizationVariant)}</p>
      <div className="cyklus-end__stats-snapshot" aria-label="Konečné hodnoty statů">
        {(['energy', 'memory', 'bond', 'control'] as StatKey[]).map((key) => (
          <div key={key} className="cyklus-end__stat-row">
            <span className="cyklus-end__stat-label">{STAT_LABELS[key]}</span>
            <span className={`cyklus-end__stat-value ${state.stats[key] <= 10 || state.stats[key] >= 90 ? 'cyklus-end__stat-value--extreme' : state.stats[key] <= 20 || state.stats[key] >= 80 ? 'cyklus-end__stat-value--danger' : ''}`}>{state.stats[key]}</span>
          </div>
        ))}
      </div>
    </header>
  );
}

export function RunEndSummary({
  state,
  ending,
  reward,
  onOpenVoidHub,
  onRestart,
}: {
  state: CyklusRunState;
  ending: RunEnding;
  reward: RunReward | null;
  onOpenVoidHub: () => void;
  onRestart: () => void;
}) {
  const [showFullLog, setShowFullLog] = useState(false);
  const stabilizationVariant = state.status === 'completed' ? computeStabilizationVariant(state) : null;
  const deathAnalysis = state.status === 'dead' ? analyzeDeath(state) : null;
  const contributors = deathAnalysis?.topContributors.slice(0, 3) ?? [];
  const nearestExtreme = state.status === 'completed' ? getNearestExtreme(state.stats) : null;
  const quickRewards = getQuickRewardItems(reward);
  const nextSteps = getRecommendedNextSteps(reward);
  const outcomeTitle = stabilizationVariant?.title ?? ending.title;
  const fullLogId = `cyklus-full-run-log-${state.id}`;
  const fullLog = useMemo(
    () => showFullLog ? exportRunLog(state, 'full', reward ?? undefined) : '',
    [reward, showFullLog, state],
  );

  return (
    <section className="cyklus-end-summary" aria-labelledby="cyklus-end-summary-title" data-report-region="summary">
      <div className="cyklus-end-summary__intro">
        <div className="cyklus-end-summary__eyebrow">KONEC</div>
        <h2 className="cyklus-end-summary__title" id="cyklus-end-summary-title">KONEC: {outcomeTitle}</h2>
        <p className="cyklus-end-summary__text">{getOutcomeExplanation(state, ending, stabilizationVariant)}</p>
      </div>

      {state.status === 'dead' ? (
        <div className="cyklus-end-summary__section">
          <div className="cyklus-end-summary__label">HLAVNÍ PŘÍČINY</div>
          {contributors.length > 0 ? (
            <div className="cyklus-end-summary__list">
              {contributors.map((contributor) => {
                const card = getCardById(contributor.cardId);
                return (
                  <div key={contributor.cardId} className="cyklus-end-summary__row" data-testid="cyklus-outcome-contributor">
                    <span>{card?.title ?? contributor.cardId}</span>
                    <span className={`cyklus-end-summary__delta ${contributor.delta > 0 ? 'cyklus-end-summary__delta--up' : 'cyklus-end-summary__delta--down'}`}>
                      {formatDelta(contributor.delta)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cyklus-end-summary__muted">Systém nenašel dominantní kartu. Kolaps byl rozložený.</div>
          )}
        </div>
      ) : (
        <div className="cyklus-end-summary__section">
          <div className="cyklus-end-summary__label">STABILIZACE</div>
          {stabilizationVariant && (
            <div className="cyklus-end-summary__list">
              <div className="cyklus-end-summary__row">
                <span>Varianta</span>
                <span>{stabilizationVariant.title}</span>
              </div>
              {nearestExtreme && (
                <div className="cyklus-end-summary__row">
                  <span>Udržená hrozba</span>
                  <span>{STAT_LABELS[nearestExtreme.stat]} {nearestExtreme.value}</span>
                </div>
              )}
              {stabilizationVariant.reasons?.slice(0, 2).map((reason) => (
                <div key={reason} className="cyklus-end-summary__muted">{reason}</div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="cyklus-end-summary__section">
        <div className="cyklus-end-summary__label">KRÁTKÉ ODMĚNY</div>
        {quickRewards.length > 0 ? (
          <div className="cyklus-end-summary__reward-grid">
            {quickRewards.map((item) => (
              <div key={item.id} className="cyklus-end-summary__reward">
                <span className="cyklus-end-summary__reward-title">{item.title}</span>
                <span className="cyklus-end-summary__reward-detail">{item.detail}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="cyklus-end-summary__muted">Žádná trvalá odměna nebyla zapsána.</div>
        )}
      </div>

      <div className="cyklus-end-summary__section">
        <div className="cyklus-end-summary__label">DALŠÍ KROK</div>
        <ul className="cyklus-end-summary__steps">
          {nextSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="cyklus-end-summary__actions">
        <button className="cyklus-btn cyklus-btn--primary" type="button" onClick={onOpenVoidHub}>
          Otevřít Prázdnotu
        </button>
        <button className="cyklus-btn cyklus-btn--secondary" type="button" onClick={onRestart}>
          Nový běh
        </button>
        <button
          className="cyklus-btn cyklus-btn--secondary"
          type="button"
          aria-expanded={showFullLog}
          aria-controls={showFullLog ? fullLogId : undefined}
          onClick={() => setShowFullLog((value) => !value)}
        >
          {showFullLog ? 'Skrýt plný log' : 'Zobrazit plný log'}
        </button>
      </div>

      {showFullLog && (
        <pre className="cyklus-end-summary__full-log" id={fullLogId} data-testid="cyklus-full-run-log">
          {fullLog}
        </pre>
      )}
    </section>
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
              <div className="cyklus-reward__unlock-desc">{formatDelta(value)} zkušenosti</div>
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

function DeathAnalysis({ state, recentComments = [] }: { state: CyklusRunState; recentComments?: string[] }) {
  const analysis = useMemo(() => analyzeDeath(state, recentComments), [state, recentComments]);
  useEffect(() => {
    if (analysis?.systemComment) saveRecentCyklusComment(analysis.systemComment);
  }, [analysis?.systemComment]);
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
          {analysis.topContributors.slice(0, 3).map((c) => {
            const card = getCardById(c.cardId);
            return (
              <div key={c.cardId} className="cyklus-death-analysis__contributor">
                <span>{card?.title ?? c.cardId}</span>
                <span className={`cyklus-death-analysis__delta ${c.delta > 0 ? 'cyklus-death-analysis__delta--up' : 'cyklus-death-analysis__delta--down'}`}>
                  {formatDelta(c.delta)}
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
    <CyklusCardOverlay label="Dopad volby" variant="outcome" onClose={onDismiss} panelClassName={`cyklus-outcome ${reward?.cls ?? 'reward--silent'}`}>
      <header className="cyklus-card-overlay__header cyklus-outcome__label" id="cyklus-outcome-title">
        Dopad volby
        {reward && <span className={`cyklus-outcome__reward ${reward.cls}`}>{reward.label}</span>}
      </header>
      <div className="cyklus-card-overlay__content cyklus-outcome__content" aria-live="polite">
      <div className="cyklus-outcome__story">{state.lastOutcomeText}</div>
      {deltas.length > 0 && (
        <div className="cyklus-outcome__stats">
          {deltas.map(([key, value]) => (
            <span key={key} className={`cyklus-outcome__stat ${value > 0 ? 'cyklus-outcome__stat--up' : 'cyklus-outcome__stat--down'}`}>
              {STAT_LABELS[key]} {value > 0 ? '↑' : '↓'} {formatAbsDelta(value)}
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
      </div>
      <footer className="cyklus-card-overlay__footer cyklus-outcome__actions">
        <button data-card-overlay-primary className="cyklus-outcome__continue" type="button" onClick={onDismiss}>POKRAČOVAT</button>
      </footer>
    </CyklusCardOverlay>
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

function directionPreview(state: CyklusRunState, card: SwipeCard, preview: { hint: string; risk?: 'low' | 'medium' | 'high' | 'unknown'; statHints?: Partial<Record<StatKey, 'up' | 'down' | 'danger'>> } | undefined, dir: 'yes' | 'no', side: PhysicalCardSide, limited: boolean, label: string, onChoice: () => void, disabled: boolean, key?: React.Key) {
  const hint = preview ? applyMetaProgressionPreviewHint(state, card, limited ? limitedPreviewHint(preview.hint) : preview.hint) : null;
  return (
    <div key={key} className={`cyklus-preview cyklus-preview--${side} cyklus-preview--choice-${dir}`}>
      {hint && <span className="cyklus-preview__hint">{hint}</span>}
      {preview?.risk && <span className={`cyklus-preview__risk cyklus-preview__risk--${preview.risk}`}>{preview.risk}</span>}
      <button
        className={`cyklus-btn cyklus-btn--${dir}`}
        type="button"
        onClick={onChoice}
        disabled={disabled}
        aria-label={`${dir === 'no' ? 'Odmítnout' : 'Přijmout'}: ${label}`}
      >
        <span className="cyklus-btn__label">{label}</span>
      </button>
    </div>
  );
}
