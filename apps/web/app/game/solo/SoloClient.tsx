'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RunState, RunType } from '../../../src/game/run/runTypes';
import type { PlayerActionId } from '../../../src/game/encounter/encounterTypes';
import { createRun, dispatchRunAction, getRunModifiers } from '../../../src/game/run/runEngine';
import { saveRunLocal, loadRunLocal, clearRunLocal } from '../../../src/game/run/runStorage';
import { loadRunHistory, recordRunCompleted, recordRunStarted, type RunHistory } from '../../../src/game/run/runHistory';
import { RUN_CARDS } from '../../../src/game/run/runCards';
import RunHUD from '../../../src/components/game/run/RunHUD';
import RunMapView from '../../../src/components/game/run/RunMapView';
import EncounterPanel from '../../../src/components/game/run/EncounterPanel';
import RunEndReport from '../../../src/components/game/run/RunEndReport';

type SoloPhase = 'menu' | 'run' | 'end';

function buildRunTypeDesc(type: RunType): string {
  const m = getRunModifiers(type);
  const parts: string[] = [m.description];
  if (m.startingHpMultiplier !== 1) parts.push(`HP ×${m.startingHpMultiplier.toFixed(2)}`);
  if (m.startingNoise > 0) parts.push(`+${m.startingNoise} Šum`);
  if (m.startingLaugh > 0) parts.push(`+${m.startingLaugh} Smích`);
  if (m.voidPressureGain !== 1) parts.push(`Void ×${m.voidPressureGain.toFixed(2)}`);
  if (m.cardDrawBonus > 0) parts.push(`+${m.cardDrawBonus} karta`);
  return parts.join(' · ');
}

const RUN_TYPES: { id: RunType; label: string; desc: string; tag: string }[] = [
  {
    id: 'standard',
    label: 'STANDARDNÍ PRŮCHOD',
    desc: buildRunTypeDesc('standard'),
    tag: '[DOPORUČENO]',
  },
  {
    id: 'sarcastic',
    label: 'SARKASTICKÝ PRŮCHOD',
    desc: buildRunTypeDesc('sarcastic'),
    tag: '[VÝZVA]',
  },
  {
    id: 'calm',
    label: 'KLIDNÝ PRŮCHOD',
    desc: buildRunTypeDesc('calm'),
    tag: '[LEHČÍ]',
  },
  {
    id: 'void_rush',
    label: 'VOID RUSH',
    desc: buildRunTypeDesc('void_rush'),
    tag: '[HARDCORE]',
  },
];

function phaseFromRun(run: RunState): SoloPhase {
  if (run.status === 'won' || run.status === 'lost' || run.status === 'abandoned') return 'end';
  return 'run';
}

function act(run: RunState, action: Parameters<typeof dispatchRunAction>[1]): RunState {
  return dispatchRunAction(run, action);
}

const HELP_TEXT = {
  goal: 'Projdi sektory Prázdnoty, přežij encountery a poraz finálního bosse. Každý sektor ti dá volbu odměny.',
  map: 'Na mapě klikej na dostupné uzly (blikající). Cesta je lineární, ale výběr ovlivňuje, co potkáš.',
  combat: 'V combatu nejprve vyber akci (Útok, Dash, Hack, Defend, Sarkasmus), poté kartu z ruky. Zelený rámeček akce = silná proti příchozímu záměru nepřítele.',
  resources: 'Stabilita = HP. Šum 10 = kolaps. Void Pressure = globální časovač, který zhoršuje situaci. Fragmentace 3 = konec.',
  choices: 'V dialogových sektorech klikej na volby. Nejsou to klasické větve — zaznamenávají tvůj profil a ovlivňují zdroje.',
  cards: 'Karty mají typ (attack, defense, hack...). Správná kombinace akce + karta zvyšuje šanci na dobrý výsledek.',
};

export default function SoloClient() {
  const [phase, setPhase] = useState<SoloPhase>('menu');
  const [run, setRun] = useState<RunState | null>(null);
  const [playerName, setPlayerName] = useState('Subjekt');
  const [hasSaved, setHasSaved] = useState(false);
  const [selectedRunType, setSelectedRunType] = useState<RunType>('standard');
  const [showHelp, setShowHelp] = useState(false);
  const [history, setHistory] = useState<RunHistory>(() => loadRunHistory());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = loadRunLocal();
      setHasSaved(saved !== null && saved.status === 'playing');
      setHistory(loadRunHistory());
    }
  }, []);

  useEffect(() => {
    if (run) {
      setPhase(phaseFromRun(run));
      if (run.status !== 'playing') {
        setHistory(recordRunCompleted(run));
      }
    }
  }, [run]);

  const updateRun = useCallback((next: RunState) => {
    setRun(next);
    saveRunLocal(next);
  }, []);

  const handleStartNew = useCallback(() => {
    clearRunLocal();
    const newRun = createRun({ playerName: playerName || 'Subjekt', runType: selectedRunType });
    updateRun(newRun);
  }, [playerName, selectedRunType, updateRun]);

  const handleContinue = useCallback(() => {
    const saved = loadRunLocal();
    if (saved) {
      setRun(saved);
      setPhase(phaseFromRun(saved));
    }
  }, []);

  const dispatch = useCallback((action: Parameters<typeof dispatchRunAction>[1]) => {
    setRun((prev) => {
      if (!prev) return prev;
      const next = act(prev, action);
      saveRunLocal(next);
      return next;
    });
  }, []);

  const handleAction = useCallback((actionId: PlayerActionId) => {
    dispatch({ type: 'SELECT_ACTION', actionId });
  }, [dispatch]);

  const handlePlayCard = useCallback((cardId: string) => {
    dispatch({ type: 'PLAY_CARD', cardId });
  }, [dispatch]);

  const handleResolveChoice = useCallback((choiceId: string) => {
    dispatch({ type: 'RESOLVE_CHOICE', choiceId });
  }, [dispatch]);

  const handleClaimReward = useCallback((rewardId: string) => {
    dispatch({ type: 'CLAIM_REWARD', rewardId });
  }, [dispatch]);

  const handleSkipIntro = useCallback(() => {
    dispatch({ type: 'SKIP_INTRO' });
  }, [dispatch]);

  const handleSelectNode = useCallback((nodeId: string) => {
    dispatch({ type: 'CHOOSE_NEXT_NODE', nodeId });
  }, [dispatch]);

  const handleNewRun = useCallback(() => {
    clearRunLocal();
    setRun(null);
    setPhase('menu');
    setHasSaved(false);
  }, []);

  if (phase === 'menu' || !run) {
    return (
      <div className="solo-menu v1-menu-shell v1-enter">
        <div className="v1-scanlines" aria-hidden="true" />
        <div className="solo-menu__title v1-menu-title">PRŮCHOD PRÁZDNOTOU</div>
        <div className="solo-menu__subtitle v1-menu-subtitle">{`// Systém čeká na identifikaci subjektu`}</div>

        <div className="solo-menu__form">
          <label className="solo-menu__label" htmlFor="solo-player-name">JMÉNO SUBJEKTU</label>
          <input
            id="solo-player-name"
            className="solo-menu__input"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={32}
            placeholder="Subjekt_???"
          />
        </div>

        <div className="solo-menu__run-types">
          <div className="solo-menu__section-label">{`// VYBER TYP PRŮCHODU`}</div>
          <div className="solo-menu__run-type-grid">
            {RUN_TYPES.map((rt) => (
              <button
                key={rt.id}
                className={`solo-menu__run-type-btn ${selectedRunType === rt.id ? 'solo-menu__run-type-btn--selected' : ''}`}
                onClick={() => setSelectedRunType(rt.id)}
              >
                <span className="solo-menu__run-type-tag">{rt.tag}</span>
                <span className="solo-menu__run-type-label">{rt.label}</span>
                <span className="solo-menu__run-type-desc">{rt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="solo-menu__actions">
          <button className="solo-menu__btn solo-menu__btn--start v1-btn v1-btn--primary" onClick={handleStartNew}>
            ZAČÍT PRŮCHOD →
          </button>
          {hasSaved && (
            <button className="solo-menu__btn solo-menu__btn--continue v1-btn" onClick={handleContinue}>
              POKRAČOVAT V ULOŽENÉM PRŮCHODU
            </button>
          )}
          <button className="solo-menu__btn solo-menu__btn--help v1-btn" onClick={() => setShowHelp(true)}>
            JAK HRÁT ?
          </button>
        </div>

        {history.entries.length > 0 && (
          <div className="solo-menu__history v1-panel">
            <div className="solo-menu__section-label">{`// ARCHIV PRŮCHODŮ`}</div>
            <div className="solo-menu__history-stats">
              <span className="v1-badge">{history.stats.runsStarted} startů</span>
              <span className="v1-badge v1-badge--accent">{history.stats.runsWon} výher</span>
              <span className="v1-badge v1-badge--danger">{history.stats.runsLost} ztrát</span>
              {history.stats.bestRunType && (
                <span className="v1-badge">Nejlepší: {history.stats.bestRunType.toUpperCase()}</span>
              )}
            </div>
            <div className="solo-menu__history-list">
              {history.entries.slice(0, 5).map((entry) => (
                <div key={entry.runId} className="solo-menu__history-item">
                  <span className={`v1-badge ${entry.status === 'won' ? 'v1-badge--accent' : entry.status === 'lost' ? 'v1-badge--danger' : ''}`}>
                    {entry.status.toUpperCase()}
                  </span>
                  <span className="solo-menu__history-type">{entry.runType.toUpperCase()}</span>
                  <span className="solo-menu__history-name">{entry.playerName}</span>
                  <span className="solo-menu__history-nodes">{entry.nodesVisited}/{entry.totalNodes} sektorů</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showHelp && (
          <div className="solo-menu__help-overlay" onClick={() => setShowHelp(false)}>
            <div className="solo-menu__help-modal" onClick={(e) => e.stopPropagation()}>
              <button className="solo-menu__help-close" onClick={() => setShowHelp(false)} aria-label="Zavřít nápovědu">×</button>
              <div className="solo-menu__help-title">JAK HRÁT — PRŮCHOD PRÁZDNOTOU</div>
              <div className="solo-menu__help-section">
                <h3>{`// CÍL`}</h3>
                <p>{HELP_TEXT.goal}</p>
              </div>
              <div className="solo-menu__help-section">
                <h3>{`// MAPA`}</h3>
                <p>{HELP_TEXT.map}</p>
              </div>
              <div className="solo-menu__help-section">
                <h3>{`// COMBAT`}</h3>
                <p>{HELP_TEXT.combat}</p>
              </div>
              <div className="solo-menu__help-section">
                <h3>{`// ZDROJE`}</h3>
                <p>{HELP_TEXT.resources}</p>
              </div>
              <div className="solo-menu__help-section">
                <h3>{`// VOLBY`}</h3>
                <p>{HELP_TEXT.choices}</p>
              </div>
              <div className="solo-menu__help-section">
                <h3>{`// KARTY`}</h3>
                <p>{HELP_TEXT.cards}</p>
              </div>
            </div>
          </div>
        )}

        <div className="solo-menu__back">
          <a href="/game" className="solo-menu__back-link">← Zpět</a>
        </div>
      </div>
    );
  }

  const player = run.players.find((p) => p.id === run.activePlayerId) ?? run.players[0];
  const isEncounter = run.currentEncounter && run.currentEncounter.phase !== 'finished';

  if (phase === 'end') {
    return (
      <RunEndReport
        run={run}
        onNewRun={handleNewRun}
        onMainMenu={handleNewRun}
      />
    );
  }

  return (
    <div className="solo-run v1-run-shell v1-enter">
      <div className="v1-scanlines" aria-hidden="true" />
      {player && (
        <RunHUD
          player={player}
          voidPressure={run.voidPressure}
          deckSize={run.deck.length}
          discardSize={run.discard.length}
          act={run.act}
        />
      )}

      {!isEncounter && (
        <RunMapView
          map={run.map}
          currentNodeId={run.currentNodeId}
          onSelectNode={handleSelectNode}
        />
      )}

      {isEncounter && run.currentEncounter && player && (
        <EncounterPanel
          encounter={run.currentEncounter}
          player={player}
          log={run.log}
          cardDefs={RUN_CARDS}
          onAction={handleAction}
          onPlayCard={handlePlayCard}
          onResolveChoice={handleResolveChoice}
          onClaimReward={handleClaimReward}
          onSkipIntro={handleSkipIntro}
        />
      )}

      <button
        className="solo-run__help-btn"
        onClick={() => setShowHelp(true)}
        aria-label="Jak hrát"
        title="Jak hrát"
      >
        ?
      </button>

      {showHelp && (
        <div className="solo-menu__help-overlay" onClick={() => setShowHelp(false)}>
          <div className="solo-menu__help-modal" onClick={(e) => e.stopPropagation()}>
            <button className="solo-menu__help-close" onClick={() => setShowHelp(false)} aria-label="Zavřít nápovědu">×</button>
            <div className="solo-menu__help-title">JAK HRÁT — PRŮCHOD PRÁZDNOTOU</div>
            <div className="solo-menu__help-section">
              <h3>{`// CÍL`}</h3>
              <p>{HELP_TEXT.goal}</p>
            </div>
            <div className="solo-menu__help-section">
              <h3>{`// MAPA`}</h3>
              <p>{HELP_TEXT.map}</p>
            </div>
            <div className="solo-menu__help-section">
              <h3>{`// COMBAT`}</h3>
              <p>{HELP_TEXT.combat}</p>
            </div>
            <div className="solo-menu__help-section">
              <h3>{`// ZDROJE`}</h3>
              <p>{HELP_TEXT.resources}</p>
            </div>
            <div className="solo-menu__help-section">
              <h3>{`// VOLBY`}</h3>
              <p>{HELP_TEXT.choices}</p>
            </div>
            <div className="solo-menu__help-section">
              <h3>{`// KARTY`}</h3>
              <p>{HELP_TEXT.cards}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
