'use client';

import type { RunState } from '../../../game/run/runTypes';
import { RELICS } from '../../../game/run/relics';

interface RunEndReportProps {
  run: RunState;
  onNewRun: () => void;
  onMainMenu: () => void;
}

const PROFILE_LABELS: Record<string, string> = {
  courage:     'Odvaha',
  caution:     'Opatrnost',
  dominance:   'Dominance',
  tenderness:  'Citlivost',
  chaos:       'Chaos',
  cooperation: 'Kooperace',
  sarcasm:     'Sarkasmus',
};

const END_TEXTS: Record<string, string[]> = {
  won: [
    'Formulář byl uzavřen.\nPrázdnota to zaznamenala.\nZáznam byl archivován pod kódem, který nikdo nenajde.',
    'Průchod dokončen.\nSystém to označil jako anomálii.\nAnomélie jsou jedinou formou pokroku, kterou systém uznává.',
  ],
  lost: [
    'Subjekt neutralizován.\nZáznamy jsou neúplné.\nTo není chyba. Záznamy jsou vždy neúplné.',
    'Konec průchodu.\nPrázdnota nezaznamenala porážku.\nZaznamenala přítomnost. To je víc, než většina dostane.',
  ],
};

function pickEndText(status: string, seed: string): string {
  const pool = END_TEXTS[status] ?? END_TEXTS['lost']!;
  const idx = seed.charCodeAt(0) % pool.length;
  return pool[idx] ?? pool[0] ?? '';
}

export default function RunEndReport({ run, onNewRun, onMainMenu }: RunEndReportProps) {
  const player = run.players[0];
  const isWon = run.status === 'won';

  const nodesVisited = run.map.nodes.filter((n) => n.visited).length;
  const totalNodes = run.map.nodes.length;

  const profileEntries = player
    ? Object.entries(player.profile).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a)
    : [];

  const fragStatus = player?.statuses.find((st) => st.id === 'fragmentation');
  const endText = pickEndText(run.status, run.seed);
  const dominantProfile = profileEntries[0];

  return (
    <div className={`run-end-report run-end-report--${isWon ? 'won' : 'lost'} v1-panel-strong v1-enter`}>

      <div className="run-end-report__header">
        <div className="run-end-report__status-label v1-badge">
          LOG [PRŮCHOD_{isWon ? 'DOKONČEN' : 'PŘERUŠEN'}]
        </div>
        <div className="run-end-report__status">
          {isWon ? 'PRÁZDNOTA PŘEKONÁNA' : 'SUBJEKT NEUTRALIZOVÁN'}
        </div>
        {player && (
          <div className="run-end-report__player-name" style={{ color: player.color }}>
            {player.name}
          </div>
        )}
      </div>

      <div className="run-end-report__end-text">{endText}</div>

      {fragStatus && (
        <div className="run-end-report__frag-note">
          // Fragmentace při ukončení: {fragStatus.stacks}/3
        </div>
      )}

      <div className="run-end-report__stats">
        <div className="run-end-report__stat">
          <span className="run-end-report__stat-label">Sektory</span>
          <span className="run-end-report__stat-value">{nodesVisited} / {totalNodes}</span>
        </div>
        {player && (
          <>
            <div className="run-end-report__stat">
              <span className="run-end-report__stat-label">Stabilita</span>
              <span className="run-end-report__stat-value">{player.hp} / {player.maxHp}</span>
            </div>
            <div className="run-end-report__stat">
              <span className="run-end-report__stat-label">Šum</span>
              <span className={`run-end-report__stat-value ${player.noise >= 8 ? 'run-end-report__stat-value--warn' : ''}`}>
                {player.noise} / 10
              </span>
            </div>
            <div className="run-end-report__stat">
              <span className="run-end-report__stat-label">Smích</span>
              <span className="run-end-report__stat-value">{player.laugh}</span>
            </div>
          </>
        )}
        <div className="run-end-report__stat">
          <span className="run-end-report__stat-label">Void Pressure</span>
          <span className="run-end-report__stat-value">{run.voidPressure} / 20</span>
        </div>
        <div className="run-end-report__stat">
          <span className="run-end-report__stat-label">Relikvie</span>
          <span className="run-end-report__stat-value">{run.relics.length}</span>
        </div>
      </div>

      {run.relics.length > 0 && (
        <div className="run-end-report__relics">
          <div className="run-end-report__section-label">// ZÍSKANÉ RELIKVIE</div>
          <div className="run-end-report__relic-list">
            {run.relics.map((relicId) => {
              const relic = RELICS[relicId];
              return relic ? (
                <div key={relicId} className="run-end-report__relic">
                  <span className="run-end-report__relic-name">{relic.name}</span>
                  <span className="run-end-report__relic-desc">{relic.description}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {profileEntries.length > 0 && (
        <div className="run-end-report__profile">
          <div className="run-end-report__section-label">// PROFIL PRŮCHODU — MOJE PRÁZDNOTA</div>
          <div className="run-end-report__profile-bars">
            {profileEntries.slice(0, 5).map(([key, val]) => (
              <div key={key} className={`run-end-report__profile-row ${key === dominantProfile?.[0] ? 'run-end-report__profile-row--dominant' : ''}`}>
                <span className="run-end-report__profile-key">{PROFILE_LABELS[key] ?? key}</span>
                <div className="run-end-report__profile-bar-track">
                  <div
                    className="run-end-report__profile-bar-fill"
                    style={{ width: `${Math.min(100, val * 10)}%` }}
                  />
                </div>
                <span className="run-end-report__profile-val">{val}</span>
              </div>
            ))}
          </div>
          {dominantProfile && (
            <div className="run-end-report__profile-dominant">
              Dominantní rys: {PROFILE_LABELS[dominantProfile[0]] ?? dominantProfile[0]}
            </div>
          )}
        </div>
      )}

      <div className="run-end-report__actions">
        <button className="run-end-report__btn run-end-report__btn--new v1-btn v1-btn--primary" onClick={onNewRun}>
          NOVÝ PRŮCHOD
        </button>
        <button className="run-end-report__btn run-end-report__btn--menu v1-btn" onClick={onMainMenu}>
          MENU
        </button>
      </div>
    </div>
  );
}
