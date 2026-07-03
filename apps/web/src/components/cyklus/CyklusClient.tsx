'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createCyklusRun, resolveChoice, getCardById, computeProfile, computeEnding, summarizeRun, analyzeDeath, computeStabilizationProgress, getCycleChapterName, getSectorIntroText, composeCycleSummary, composeBehavioralAnalysis } from '../../game/cyklus/cyklusEngine';
import { saveCyklusRun, loadCyklusRun, clearCyklusRun, loadCyklusRunHistory, appendCyklusRunSummary } from '../../game/cyklus/cyklusStorage';
import { STAT_LABELS, STAT_DESCRIPTIONS, SECTOR_LABELS, ENTITY_LABELS, type StatKey, type EntityId, type CyklusRunState, type CyklusRunSummary, type SwipeCard, type CyklusChoiceRecord } from '../../game/cyklus/cyklusTypes';
import { CYKLUS_ITEMS } from '../../game/cyklus/cyklusItems';
import { CYKLUS_IMPRINTS } from '../../game/cyklus/cyklusImprints';

export default function CyklusClient() {
  const [state, setState] = useState<CyklusRunState | null>(null);
  const [loading, setLoading] = useState(true);
  const [outcomeVisible, setOutcomeVisible] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [runHistory, setRunHistory] = useState<CyklusRunSummary[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeStat, setActiveStat] = useState<StatKey | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [savedRun, setSavedRun] = useState<CyklusRunState | null>(null);
  const [sectorIntro, setSectorIntro] = useState<string | null>(null);
  const [cycleSummary, setCycleSummary] = useState<string | null>(null);
  const prevSectorRef = useRef<string | null>(null);
  const prevCycleRef = useRef<number>(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const outcomeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const saved = loadCyklusRun();
    const history = loadCyklusRunHistory();
    setRunHistory(history);
    if (saved && (saved.status === 'dead' || saved.status === 'completed') && !history.find((h) => h.id === saved.id)) {
      appendCyklusRunSummary(summarizeRun(saved));
      setRunHistory(loadCyklusRunHistory());
    }
    if (saved && saved.status === 'playing') {
      setSavedRun(saved);
      setShowMenu(true);
    } else {
      const fresh = createCyklusRun();
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
    if (!state || state.status === 'playing') return;
    const history = loadCyklusRunHistory();
    if (!history.find((h) => h.id === state.id)) {
      appendCyklusRunSummary(summarizeRun(state));
      setRunHistory(loadCyklusRunHistory());
    }
  }, [state?.status]);

  const handleChoice = useCallback((direction: 'yes' | 'no') => {
    if (!state || state.status !== 'playing') return;
    const next = resolveChoice(state, direction);
    setState(next);
    setOutcomeVisible(true);
    setDragX(0);
    if (outcomeTimer.current) clearTimeout(outcomeTimer.current);
    // Popup stays until user clicks
  }, [state]);

  const dismissOutcome = useCallback(() => {
    if (outcomeTimer.current) clearTimeout(outcomeTimer.current);
    setOutcomeVisible(false);
  }, []);

  const handleRestart = useCallback(() => {
    clearCyklusRun();
    const fresh = createCyklusRun();
    setState(fresh);
    saveCyklusRun(fresh);
    setOutcomeVisible(false);
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
    const fresh = createCyklusRun();
    setState(fresh);
    saveCyklusRun(fresh);
    setSavedRun(null);
    setShowMenu(false);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) startX.current = touch.clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - startX.current;
    setDragX(Math.max(-120, Math.min(120, x)));
  };
  const onTouchEnd = () => {
    if (dragX > 60) handleChoice('yes');
    else if (dragX < -60) handleChoice('no');
    setDragX(0);
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
          <div className="cyklus-menu__actions">
            {savedRun && (
              <button className="cyklus-menu__button cyklus-menu__button--primary" type="button" onClick={handleContinue}>
                Pokračovat
              </button>
            )}
            <button className="cyklus-menu__button" type="button" onClick={handleNewGame}>
              Nová hra
            </button>
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

      <div className="cyklus-stats">
        {(['energy', 'memory', 'bond', 'control'] as StatKey[]).map((key) => (
          <div
            key={key}
            className={`cyklus-stat cyklus-stat--${key} ${activeStat === key ? 'cyklus-stat--active' : ''}`}
            onClick={() => setActiveStat(activeStat === key ? null : key)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveStat(activeStat === key ? null : key); }}
            title="Klikni pro popis"
          >
            <div className="cyklus-stat__label">{STAT_LABELS[key]}</div>
            <div className="cyklus-stat__bar">
              <div className="cyklus-stat__fill" style={{ width: `${state.stats[key]}%` }} />
              <div className="cyklus-stat__ideal" style={{ left: '50%' }} />
            </div>
            <div className="cyklus-stat__value">{state.stats[key]}</div>
            {activeStat === key && (
              <div className="cyklus-stat__popup">{STAT_DESCRIPTIONS[key]}</div>
            )}
          </div>
        ))}
      </div>
      <div className="cyklus-stat-hint">Cílem není maximum. Cílem je rovnováha. Extrém v jakémkoliv směru ukončí cyklus.</div>

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
            <div className="cyklus-end__title">{ending.title}</div>
            <div className="cyklus-end__text">{ending.text}</div>
            {state.status === 'dead' && <DeathAnalysis state={state} />}
            <BehavioralAnalysis state={state} />
            <div className="cyklus-end__profile">
              <div className="cyklus-profile__type">{profile.dominantLabel}</div>
              <div className="cyklus-profile__archetype">{profile.archetype}</div>
              <div className="cyklus-profile__functions">
                <span>{profile.dominantFunction}</span> · <span>{profile.shadowFunction}</span>
              </div>
              <div className="cyklus-profile__stability">Stabilita: {profile.stability}</div>
            </div>
            <div className="cyklus-end__actions">
              <button className="cyklus-btn cyklus-btn--primary" onClick={handleRestart}>NOVÝ CYKLUS</button>
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
              className={`cyklus-card cyklus-card--category-${card.category} ${outcomeVisible ? 'cyklus-card--outcome' : ''}`}
              style={{ transform: `translateX(${dragX}px) rotate(${dragX * 0.1}deg)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
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
        <div className="cyklus-inventory">
          <span className="cyklus-footer__label">Kapsa:</span>
          {state.inventory.length === 0 ? <span className="cyklus-inventory__empty">prázdná</span> : (
            state.inventory.map((id: string) => <span key={id} className="cyklus-item" title={CYKLUS_ITEMS[id]?.description}>{CYKLUS_ITEMS[id]?.title ?? id}</span>)
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
      </footer>
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
