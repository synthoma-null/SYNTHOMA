'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Artifact, Mission } from '../../content/booksManifest';

interface UserRun {
  cycleNumber: number;
  stability: number;
  memoryPressure: number;
  shadow: number;
}

interface Psyche {
  ni: number; fe: number; ti: number; se: number;
  shadow: number; tone: string;
}

interface EntityRel {
  entity: string;
  trust: number;
  suspicion: number;
  sync: number;
  protection: number;
}

interface UserArtifactRow { artifactId: string; }
interface UserNameFragmentRow { fragment: string; }
interface UserMissionRow {
  id: string;
  name: string;
  logLabel: string;
  description: string;
  task: string;
  rewardText: string;
  status: string;
  mnemCost?: number;
}

interface RunData {
  run: UserRun | null;
  psyche: Psyche | null;
  entities: EntityRel[];
  artifacts: UserArtifactRow[];
  nameFragments: UserNameFragmentRow[];
  missions: UserMissionRow[];
}

const ENTITY_LABELS: Record<string, string> = {
  glitchka: 'Glitchka',
  sarkasma: 'Sarkasma',
  tai: 'T-AI',
  archive: 'Archiv',
  shadow: 'Stín',
};

const ENTITY_METRIC_LABELS: Record<string, string> = {
  trust: 'Důvěra',
  suspicion: 'Podezření',
  sync: 'Sync',
  protection: 'Ochrana',
};

const PRESSURE_LABELS = [
  { min: 0,  max: 30, label: 'KLIDNÝ BĚH',             cls: 'run-bar--calm' },
  { min: 31, max: 60, label: 'AKTIVNÍ ZÁTĚŽ',          cls: 'run-bar--active' },
  { min: 61, max: 80, label: 'ZVÝŠENÝ TLAK',           cls: 'run-bar--high' },
  { min: 81, max: 100,label: 'KRITICKÝ — HROZÍ ČERNÝ BOX', cls: 'run-bar--critical' },
];

function pressureClass(v: number) {
  return PRESSURE_LABELS.find((p) => v >= p.min && v <= p.max) ?? PRESSURE_LABELS[0];
}

function Bar({ value, cls }: { value: number; cls: string }) {
  return (
    <div className="run-bar-track">
      <div className={`run-bar-fill ${cls}`} style={{ '--bar-w': `${value}%` } as React.CSSProperties} />
    </div>
  );
}

const NAME_FRAGMENT_SLOTS = 5;

export default function RunDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<RunData | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<'run' | 'psyche' | 'entities' | 'artifacts' | 'missions'>('run');

  useEffect(() => {
    if (!session?.user) return;
    fetch('/api/me/run')
      .then((r) => r.json())
      .then((d: RunData) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [session]);

  if (!session?.user) {
    return (
      <div className="run-dashboard run-dashboard--guest">
        <p className="run-log-prefix">LOG [AUTH_REQUIRED]:</p>
        <p className="run-guest-msg">Subjekt není rozpoznán. Identita je podmínkou cyklu.</p>
        <a href="/login" className="btn">PŘIHLÁSIT SE</a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="run-dashboard run-dashboard--loading">
        <p className="run-log-prefix">LOG [LOADING]:</p>
        <p className="run-loading-msg">Archiv načítá otisk...</p>
      </div>
    );
  }

  const { run, psyche, entities, artifacts, nameFragments, missions } = data ?? {
    run: null, psyche: null, entities: [], artifacts: [], nameFragments: [], missions: [],
  };

  const pressure = (run ? pressureClass(run.memoryPressure) : null) ?? PRESSURE_LABELS[0]!;
  const dominantFn = psyche
    ? Object.entries({ Ni: psyche.ni, Fe: psyche.fe, Ti: psyche.ti, Se: psyche.se })
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([k]) => k)
        .join(' / ')
    : '—';

  const activeMissions = missions.filter((m) => m.status === 'active');

  return (
    <div className="run-dashboard">
      <div className="run-dashboard-header">
        <p className="run-log-prefix">LOG [SUBJECT_PROFILE]:</p>
        <p className="run-header-desc">Subjekt byl rozpoznán. Paměťový otisk není stabilní. Což je u lidí zřejmě normální.</p>
      </div>

      <div className="run-identity">
        <span className="run-label">SUBJEKT:</span>
        <span className="run-value">{(session.user.name ?? session.user.email ?? '?').toUpperCase()}</span>
        <span className="run-label">CYKLUS:</span>
        <span className="run-value">{String(run?.cycleNumber ?? 1).padStart(3, '0')}</span>
      </div>

      <nav className="run-nav">
        {(['run', 'psyche', 'entities', 'artifacts', 'missions'] as const).map((s) => (
          <button
            key={s}
            className={`run-nav-btn${section === s ? ' run-nav-btn--active' : ''}`}
            onClick={() => setSection(s)}
          >
            {s === 'run' ? 'AKTIVNÍ CYKLUS' :
             s === 'psyche' ? 'PSYCHOMAPA' :
             s === 'entities' ? 'VZTAHY' :
             s === 'artifacts' ? 'ARTEFAKTY' : 'MISE'}
          </button>
        ))}
      </nav>

      {section === 'run' && (
        <div className="run-section">
          <div className="run-metric">
            <div className="run-metric-header">
              <span className="run-metric-label">STABILITA IDENTITY</span>
              <span className="run-metric-value">{run?.stability ?? 50} %</span>
            </div>
            <Bar value={run?.stability ?? 50} cls="run-bar--stability" />
          </div>

          <div className="run-metric">
            <div className="run-metric-header">
              <span className="run-metric-label">TLAK PAMĚTI</span>
              <span className={`run-metric-value run-metric-value--${pressure.cls.replace('run-bar--', '')}`}>
                {run?.memoryPressure ?? 0} % — {pressure.label}
              </span>
            </div>
            <Bar value={run?.memoryPressure ?? 0} cls={pressure.cls} />
            {(run?.memoryPressure ?? 0) > 80 && (
              <p className="run-warning">
                LOG [MEMORY_PRESSURE]: Tlak paměti překročil bezpečnou hranici. Systém doporučuje pauzu.
                Systém samozřejmě lže.
              </p>
            )}
          </div>

          <div className="run-metric">
            <div className="run-metric-header">
              <span className="run-metric-label">STÍN</span>
              <span className="run-metric-value">{run?.shadow ?? 0} %</span>
            </div>
            <Bar value={run?.shadow ?? 0} cls="run-bar--shadow" />
            {(run?.shadow ?? 0) > 70 && (
              <p className="run-warning">
                LOG [SHADOW_INDEX]: Subjekt ukládá příliš mnoho nevysloveného. Archiv je spokojen.
                To je špatné znamení.
              </p>
            )}
          </div>

          <div className="run-fragments">
            <span className="run-label">FRAGMENTY JMÉNA:</span>
            <div className="run-fragments-row">
              {Array.from({ length: NAME_FRAGMENT_SLOTS }).map((_, i) => {
                const f = nameFragments[i];
                return (
                  <span key={i} className={`run-fragment-slot${f ? ' run-fragment-slot--found' : ''}`}>
                    {f ? f.fragment : '?'}
                  </span>
                );
              })}
            </div>
          </div>

          {activeMissions.length > 0 && (
            <div className="run-active-missions">
              <span className="run-label">AKTIVNÍ MISE:</span>
              {activeMissions.map((m) => (
                <div key={m.id} className="run-mission-item">
                  <span className="run-mission-log">{m.logLabel}</span>
                  <span className="run-mission-name">{m.name}</span>
                  <span className="run-mission-task">{m.task}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {section === 'psyche' && (
        <div className="run-section">
          <p className="run-section-intro">DOMINANTNÍ FUNKCE: <strong>{dominantFn}</strong></p>
          {psyche && (
            <div className="run-psyche-grid">
              {[['Ni', psyche.ni], ['Fe', psyche.fe], ['Ti', psyche.ti], ['Se', psyche.se]].map(([k, v]) => (
                <div key={String(k)} className="run-psyche-row">
                  <span className="run-psyche-fn">{k}</span>
                  <Bar value={Number(v)} cls="run-bar--psyche" />
                  <span className="run-psyche-val">{v}</span>
                </div>
              ))}
            </div>
          )}
          {!psyche && <p className="run-empty">LOG [PSYCHE_EMPTY]: Žádné volby nebyly zaznamenány.</p>}
        </div>
      )}

      {section === 'entities' && (
        <div className="run-section">
          {entities.length === 0 && (
            <p className="run-empty">LOG [ENTITIES_EMPTY]: Žádné vztahy k entitám zatím neexistují.</p>
          )}
          {entities.map((e) => (
            <div key={e.entity} className="run-entity">
              <span className="run-entity-name">{ENTITY_LABELS[e.entity] ?? e.entity.toUpperCase()}</span>
              <div className="run-entity-metrics">
                {(Object.entries({
                  trust: e.trust,
                  suspicion: e.suspicion,
                  sync: e.sync,
                  protection: e.protection,
                }) as [string, number][])
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => (
                    <div key={k} className="run-entity-metric">
                      <span className="run-entity-metric-label">{ENTITY_METRIC_LABELS[k] ?? k}</span>
                      <Bar value={v} cls="run-bar--entity" />
                      <span className="run-entity-metric-val">{v}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'artifacts' && (
        <div className="run-section">
          {artifacts.length === 0 && (
            <p className="run-empty">LOG [ARTIFACTS_EMPTY]: Žádné artefakty nezískány.</p>
          )}
          <div className="run-artifacts-grid">
            {artifacts.map((a) => (
              <div key={a.artifactId} className="run-artifact-card">
                <span className="run-artifact-id">{a.artifactId.toUpperCase().replace(/-/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {section === 'missions' && (
        <div className="run-section">
          {missions.map((m) => (
            <div key={m.id} className={`run-mission-card run-mission-card--${m.status}`}>
              <div className="run-mission-card-header">
                <span className="run-mission-card-log">{m.logLabel}</span>
                <span className={`run-mission-card-status run-mission-status--${m.status}`}>
                  {m.status.toUpperCase()}
                </span>
              </div>
              <p className="run-mission-card-name">{m.name}</p>
              <p className="run-mission-card-desc">{m.description}</p>
              {m.status !== 'locked' && (
                <p className="run-mission-card-reward">{m.rewardText}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
