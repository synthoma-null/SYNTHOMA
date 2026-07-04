'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createCyklusRun, resolveChoice, getCardById, computeProfile, computeEnding, summarizeRun, analyzeDeath, computeStabilizationProgress, getCycleChapterName, getSectorIntroText, composeCycleSummary, composeBehavioralAnalysis, computeStabilizationVariant, composeCycleForecast, exportRunLog, getNearestExtreme, generateRunCodename, activateItem, getStabilizationBuildProgress, getActiveContracts, getComboHint, type BuildVariantProgress } from '../../game/cyklus/cyklusEngine';
import { evaluateFindings, saveNewFindings, loadEarnedFindings, getDeathUnlocks, saveMetaUnlocks, addFreshMetaPools, type EarnedFinding, type MetaUnlock } from '../../game/cyklus/cyklusFindings';
import { getPocketItems, getPocketAmbientText, MOOD_LABELS, type ItemWithMood } from '../../game/cyklus/cyklusItemMood';
import { saveCyklusRun, loadCyklusRun, clearCyklusRun, loadCyklusRunHistory, appendCyklusRunSummary, isTutorialSeen, setTutorialSeen, clearTutorialSeen } from '../../game/cyklus/cyklusStorage';
import StatDock from './StatDock';
import { STAT_LABELS, SECTOR_LABELS, ENTITY_LABELS, type StatKey, type EntityId, type CyklusRunState, type CyklusRunSummary, type SwipeCard, type CyklusChoiceRecord, type CardCondition } from '../../game/cyklus/cyklusTypes';
import { CYKLUS_ITEMS } from '../../game/cyklus/cyklusItems';
import { CYKLUS_CARDS } from '../../game/cyklus/cyklusCards';
import { CYKLUS_IMPRINTS } from '../../game/cyklus/cyklusImprints';
import { updateDiscoveryFromRun, loadDiscovery, type CyklusDiscovery } from '../../game/cyklus/cyklusDiscovery';

export default function CyklusClient() {
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
  const prevSectorRef = useRef<string | null>(null);
  const prevCycleRef = useRef<number>(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const outcomeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadCyklusRun();
    const history = loadCyklusRunHistory();
    const seen = isTutorialSeen();
    setTutorialSeenState(seen);
    setRunHistory(history);
    if (saved && (saved.status === 'dead' || saved.status === 'completed') && !history.find((h) => h.id === saved.id)) {
      appendCyklusRunSummary(summarizeRun(saved));
      setRunHistory(loadCyklusRunHistory());
    }
    if (saved && saved.status === 'playing') {
      setSavedRun(saved);
      setShowMenu(true);
    } else {
      const fresh = createCyklusRun(seen);
      setState(fresh);
      saveCyklusRun(fresh);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (state) saveCyklusRun(state);
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
    if (state?.status === 'playing' && state.flags.includes('tutorial_done') && !isTutorialSeen()) {
      setTutorialSeen();
      setTutorialSeenState(true);
    }
  }, [state?.flags]);

  useEffect(() => {
    if (!state || state.status === 'playing') return;
    const history = loadCyklusRunHistory();
    if (!history.find((h) => h.id === state.id)) {
      appendCyklusRunSummary(summarizeRun(state));
      setRunHistory(loadCyklusRunHistory());
    }
    const before = loadEarnedFindings();
    const allFindings = evaluateFindings(state);
    const newOnes = saveNewFindings(allFindings);
    setNewFindings(newOnes);
    setKnownFindings(before.filter((f) => !newOnes.some((n) => n.id === f.id)));
    const ending = computeEnding(state);
    if (ending?.type === 'death') {
      const unlocks = getDeathUnlocks(ending.stat, ending.extreme);
      const saved = saveMetaUnlocks(unlocks);
      setNewMetaUnlocks(saved);
      const newPools = saved.map((u) => u.unlockPool).filter(Boolean) as string[];
      if (newPools.length > 0) addFreshMetaPools(newPools);
    }
    setDiscovery(updateDiscoveryFromRun(state));
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

  const handleRestart = useCallback(() => {
    clearCyklusRun();
    const seen = isTutorialSeen();
    const fresh = createCyklusRun(seen);
    setState(fresh);
    saveCyklusRun(fresh);
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
    clearCyklusRun();
    const seen = isTutorialSeen();
    const fresh = createCyklusRun(seen);
    setState(fresh);
    saveCyklusRun(fresh);
    setSavedRun(null);
    setShowMenu(false);
    setNewFindings([]);
    setKnownFindings([]);
    setNewMetaUnlocks([]);
    setCycleForecast(null);
    setPreRunWarning(null);
  }, []);

  const handleRepeatTutorial = useCallback(() => {
    clearTutorialSeen();
    setTutorialSeenState(false);
    clearCyklusRun();
    const fresh = createCyklusRun(false);
    setState(fresh);
    saveCyklusRun(fresh);
    setSavedRun(null);
    setShowMenu(false);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    if (flyDirection) return;
    const touch = e.touches[0];
    if (touch) startX.current = touch.clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (flyDirection) return;
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - startX.current;
    setDragX(Math.max(-160, Math.min(160, x)));
  };
  const onTouchEnd = () => {
    if (flyDirection) return;
    if (dragX > 80) handleChoice('yes');
    else if (dragX < -80) handleChoice('no');
    else setDragX(0);
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
      <div className="cyklus-root">
        <div className="cyklus-menu">
          <div className="cyklus-menu__title">SYNTHOMA: CYKLUS</div>
          <div className="cyklus-menu__subtitle">
            {savedRun ? `Rozohraný cyklus: cyklus ${savedRun.cycle}, sektor ${SECTOR_LABELS[savedRun.sector]}` : 'Žádná rozohraná hra'}
          </div>
          <div className="cyklus-menu__tagline">
            Udrž čtyři reaktory subjektu v rovnováze. Maximum není výhra. Extrém je konec.
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
          </div>
        </div>
      </div>
    );
  }

  if (!state) return <div className="cyklus-loading">Nahrává se cyklus…</div>;

  const card = getCardById(state.currentCardId) ?? getCardById('first_boot');
  const profile = computeProfile(state);
  const ending = state.status === 'dead' || state.status === 'completed' ? computeEnding(state) : null;
  const chapter = getCycleChapterName(state.cycle);

  return (
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
      <header className="cyklus-header">
        <div className="cyklus-title">SYNTHOMA: CYKLUS</div>
        <div className="cyklus-chapter">
          <span className="cyklus-chapter__number">{chapter.number}</span>
          <span className="cyklus-chapter__title">{chapter.title}</span>
          <span className="cyklus-chapter__subtitle">{chapter.subtitle}</span>
        </div>
        <div className="cyklus-meta">
          <span className="cyklus-sector">{SECTOR_LABELS[state.sector]}</span>
          <span className="cyklus-progress">{state.choiceInCycle}/{12}</span>
          <button
            className="cyklus-header__reset"
            onClick={handleRestart}
            type="button"
            title="Ukončit aktuální cyklus a začít znovu"
          >
            ↺
          </button>
        </div>
      </header>

      <StatDock stats={state.stats} openStat={activeStat} onOpenStat={setActiveStat} />

      {state.visitedSectors.length > 0 && (
        <div className="cyklus-route">
          <span className="cyklus-route__label">Trasa cyklu:</span>
          <div className="cyklus-route__chain">
            {state.visitedSectors.map((sector, idx) => (
              <span key={`${sector}-${idx}`} className={`cyklus-route__node ${sector === state.sector ? 'cyklus-route__node--current' : ''}`}>
                {SECTOR_LABELS[sector]}
              </span>
            ))}
          </div>
        </div>
      )}

      {state.status === 'playing' && (state.usedCardIds.includes('restart_5') || runHistory.length > 0) && (
        <StabilizationPanel state={state} />
      )}

      <main className="cyklus-stage">
        {ending ? (
          <div className="cyklus-end">
            <div className="cyklus-end__header">
              <div className="cyklus-end__system-label">ZÁVĚREČNÁ ZPRÁVA SUBJEKTU</div>
              <div className="cyklus-end__codename">{generateRunCodename(state)}</div>
              <div className="cyklus-end__title">{state.status === 'completed' ? computeStabilizationVariant(state).title : ending.title}</div>
              <div className="cyklus-end__subtitle">{state.status === 'completed' ? 'Konec: Stabilizace' : `Konec: ${ending.title}`}</div>
            </div>
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
              <button className="cyklus-btn cyklus-btn--primary" onClick={handleRestart}>NOVÝ CYKLUS</button>
              <button
                className="cyklus-btn cyklus-btn--secondary"
                onClick={() => {
                  const log = exportRunLog(state, 'short');
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
                  const log = exportRunLog(state, 'full');
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
          <>
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
            >
              {state.modifier.id !== 'none' && (
              <div className="cyklus-modifier">
                <span className="cyklus-modifier__title">{state.modifier.title}</span>
                <span className="cyklus-modifier__desc">{state.modifier.description}</span>
              </div>
            )}
            {card.tags.includes('overload') && (
              <div className="cyklus-card__overload">
                <span className="cyklus-card__overload-label">⚠ PŘETLAKOVÉ POKUŠENÍ</span>
                <span className="cyklus-card__overload-risk">Vysoké riziko · extrémní reward</span>
              </div>
            )}
            <div className="cyklus-card__category">{card.logLabel}</div>
              <h2 className="cyklus-card__title">{card.title}</h2>
              <p className="cyklus-card__scene">{card.scene}</p>
              {card.category === 'restart' && (
                <div className="cyklus-card__restart-badge">[RESTART]</div>
              )}
              <div className="cyklus-card__preview">
                {directionPreview(card.yes.preview, 'yes', shouldLimitPreview(card))}
                {directionPreview(card.no.preview, 'no', shouldLimitPreview(card))}
              </div>
            </div>

            <div className="cyklus-actions">
              <button className="cyklus-btn cyklus-btn--no" onClick={() => handleChoice('no')} disabled={outcomeVisible}>
                <span className="cyklus-btn__label">{card.noLabel}</span>
                {card.no.preview && <span className="cyklus-btn__hint">{shouldLimitPreview(card) ? limitedPreviewHint(card.no.preview.hint) : card.no.preview.hint}</span>}
              </button>
              <button className="cyklus-btn cyklus-btn--yes" onClick={() => handleChoice('yes')} disabled={outcomeVisible}>
                <span className="cyklus-btn__label">{card.yesLabel}</span>
                {card.yes.preview && <span className="cyklus-btn__hint">{shouldLimitPreview(card) ? limitedPreviewHint(card.yes.preview.hint) : card.yes.preview.hint}</span>}
              </button>
            </div>

            {outcomeVisible && state.lastOutcomeText && (
              <OutcomePanel state={state} onDismiss={dismissOutcome} />
            )}
          </>
        ) : (
          <div className="cyklus-empty">Karta nenalezena.</div>
        )}
      </main>

      <footer className="cyklus-footer">
        {state.history.length > 0 && (
          <div className="cyklus-story">
            <span className="cyklus-footer__label">Příběh:</span>
            <div className="cyklus-story__chain">
              {state.history.slice(-3).map((record) => {
                const card = getCardById(record.cardId);
                return <span key={`${record.cardId}-${record.ts}`} className="cyklus-story__node">{card?.title ?? record.cardId}</span>;
              })}
            </div>
          </div>
        )}
        <div className="cyklus-pocket">
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
                      return (
                        <div key={item.id} className={`cyklus-pocket__item cyklus-pocket__item--${item.mood}`}>
                          <span className="cyklus-pocket__item-name">{item.title}</span>
                          <span className="cyklus-pocket__item-mood">{MOOD_LABELS[item.mood]}</span>
                          <span className="cyklus-pocket__item-text">{item.moodText}</span>
                          {activatable && (
                            <button
                              type="button"
                              className="cyklus-pocket__activate"
                              disabled={!canActivate}
                              onClick={() => handleActivateItem(item.id)}
                            >
                              {canActivate ? 'Aktivovat' : 'Aktivováno'}
                            </button>
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
              return <span key={id} className={`cyklus-entity cyklus-entity--${value && value > 0 ? 'positive' : value && value < 0 ? 'negative' : 'neutral'}`}>{label}: {value}</span>;
            })}
          </div>
        )}
        <div className="cyklus-footer-actions">
          <button type="button" className="cyklus-footer__button" onClick={() => setShowBuild((v) => !v)}>
            Build
          </button>
          <button type="button" className="cyklus-footer__button" onClick={() => setShowDiscovery((v) => !v)}>
            Archiv
          </button>
        </div>
      </footer>

      {showBuild && state && (
        <div className="cyklus-overlay cyklus-overlay--build" onClick={() => setShowBuild(false)}>
          <div className="cyklus-overlay__panel" onClick={(e) => e.stopPropagation()}>
            <div className="cyklus-build__title">Možný typ přežití</div>
            <BuildPanel state={state} />
            <div className="cyklus-build__title cyklus-build__title--goals">Dnešní cíle</div>
            <GoalsPanel state={state} />
            <ContractPanel state={state} />
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
    </div>
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

function GoalsPanel({ state }: { state: CyklusRunState }) {
  return (
    <div className="cyklus-goals">
      <div className="cyklus-goals__label">DNEŠNÍ DIAGNOSTICKÉ ÚKOLY</div>
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

function DeathAnalysis({ state }: { state: CyklusRunState }) {
  const analysis = analyzeDeath(state);
  if (!analysis) return null;
  const card = getCardById(analysis.topContributors[0]?.cardId ?? '');
  return (
    <div className="cyklus-death-analysis">
      <div className="cyklus-death-analysis__title">Co tě zničilo</div>
      <div className="cyklus-death-analysis__stat">
        {STAT_LABELS[analysis.stat]} dosáhla {analysis.extreme === 'high' ? '100' : '0'}.
      </div>
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

function directionPreview(preview: { hint: string; risk?: 'low' | 'medium' | 'high' | 'unknown'; statHints?: Partial<Record<StatKey, 'up' | 'down' | 'danger'>> } | undefined, dir: 'yes' | 'no', limited: boolean) {
  if (!preview) return null;
  const hint = limited ? limitedPreviewHint(preview.hint) : preview.hint;
  return (
    <div className={`cyklus-preview cyklus-preview--${dir}`}>
      <span className="cyklus-preview__hint">{hint}</span>
      {preview.risk && <span className={`cyklus-preview__risk cyklus-preview__risk--${preview.risk}`}>{preview.risk}</span>}
    </div>
  );
}
