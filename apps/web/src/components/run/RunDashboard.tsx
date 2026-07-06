'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Artifact, Mission } from '../../content/booksManifest';
import { useLang } from '../../lib/LangContext';

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

interface CyklusProgressionData {
  totalRuns?: number;
  stabilizedRuns?: number;
  totalResiduumEarned?: number;
  currencies?: Record<string, number>;
  purchasedUpgrades?: string[];
  equippedUpgrades?: string[];
  unlockedScars?: string[];
  activeScar?: string;
  deathsByStat?: Record<string, number>;
  profileMastery?: Record<string, number>;
}

interface CyklusHistoryEntry {
  id: string;
  cycle: number;
  endingTitle: string;
  status: string;
  finishedAt: number;
}

interface RunData {
  run: UserRun | null;
  psyche: Psyche | null;
  entities: EntityRel[];
  artifacts: UserArtifactRow[];
  nameFragments: UserNameFragmentRow[];
  missions: UserMissionRow[];
  cyklusProgression?: CyklusProgressionData | null;
  cyklusHistory?: CyklusHistoryEntry[] | null;
}

const PRESSURE_CLS = [
  { min: 0,  max: 30,  cls: 'run-bar--calm',     key: 'run.pressure.bar.calm' as const },
  { min: 31, max: 60,  cls: 'run-bar--active',    key: 'run.pressure.bar.active' as const },
  { min: 61, max: 80,  cls: 'run-bar--high',      key: 'run.pressure.bar.high' as const },
  { min: 81, max: 100, cls: 'run-bar--critical',  key: 'run.pressure.bar.critical' as const },
];

function pressureEntry(v: number) {
  return PRESSURE_CLS.find((p) => v >= p.min && v <= p.max) ?? PRESSURE_CLS[0];
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
  const { t } = useLang();
  const [data, setData] = useState<RunData | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState<'run' | 'psyche' | 'entities' | 'artifacts' | 'missions' | 'cyklus'>('run');

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
        <p className="run-guest-msg">{t('run.guest.msg')}</p>
        <a href="/login" className="btn">{t('run.guest.login')}</a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="run-dashboard run-dashboard--loading">
        <p className="run-log-prefix">LOG [LOADING]:</p>
        <p className="run-loading-msg">{t('run.loading.msg')}</p>
      </div>
    );
  }

  const { run, psyche, entities, artifacts, nameFragments, missions } = data ?? {
    run: null, psyche: null, entities: [], artifacts: [], nameFragments: [], missions: [],
  };

  const pressure = (run ? pressureEntry(run.memoryPressure) : null) ?? PRESSURE_CLS[0]!;
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
        <p className="run-header-desc">{t('run.header.desc')}</p>
      </div>

      <div className="run-identity">
        <span className="run-label">{t('run.identity.subject')}</span>
        <span className="run-value">{(session.user.name ?? session.user.email ?? '?').toUpperCase()}</span>
        <span className="run-label">{t('run.identity.cycle')}</span>
        <span className="run-value">{String(run?.cycleNumber ?? 1).padStart(3, '0')}</span>
      </div>

      <nav className="run-nav">
        {(['run', 'psyche', 'entities', 'artifacts', 'missions', 'cyklus'] as const).map((s) => (
          <button
            key={s}
            className={`run-nav-btn${section === s ? ' run-nav-btn--active' : ''}`}
            onClick={() => setSection(s)}
          >
            {s === 'run' ? t('run.nav.run') :
             s === 'psyche' ? t('run.nav.psyche') :
             s === 'entities' ? t('run.nav.entities') :
             s === 'artifacts' ? t('run.nav.artifacts') :
             s === 'missions' ? t('run.nav.missions') : 'CYKLUS'}
          </button>
        ))}
      </nav>

      {section === 'run' && (
        <div className="run-section">
          <div className="run-metric">
            <div className="run-metric-header">
              <span className="run-metric-label">{t('run.metric.stability')}</span>
              <span className="run-metric-value">{run?.stability ?? 50} %</span>
            </div>
            <Bar value={run?.stability ?? 50} cls="run-bar--stability" />
          </div>

          <div className="run-metric">
            <div className="run-metric-header">
              <span className="run-metric-label">{t('run.metric.pressure')}</span>
              <span className={`run-metric-value run-metric-value--${pressure.cls.replace('run-bar--', '')}`}>
                {run?.memoryPressure ?? 0} % — {t(pressure.key)}
              </span>
            </div>
            <Bar value={run?.memoryPressure ?? 0} cls={pressure.cls} />
            {(run?.memoryPressure ?? 0) > 80 && (
              <p className="run-warning">{t('run.warning.pressure')}</p>
            )}
          </div>

          <div className="run-metric">
            <div className="run-metric-header">
              <span className="run-metric-label">{t('run.metric.shadow')}</span>
              <span className="run-metric-value">{run?.shadow ?? 0} %</span>
            </div>
            <Bar value={run?.shadow ?? 0} cls="run-bar--shadow" />
            {(run?.shadow ?? 0) > 70 && (
              <p className="run-warning">{t('run.warning.shadow')}</p>
            )}
          </div>

          <div className="run-fragments">
            <span className="run-label">{t('run.fragments.label')}</span>
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
              <span className="run-label">{t('run.missions.active.label')}</span>
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
          <p className="run-section-intro">{t('run.psyche.dominant')} <strong>{dominantFn}</strong></p>
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
          {!psyche && <p className="run-empty">{t('run.psyche.empty')}</p>}
        </div>
      )}

      {section === 'entities' && (
        <div className="run-section">
          {entities.length === 0 && (
            <p className="run-empty">{t('run.entities.empty')}</p>
          )}
          {entities.map((e) => (
            <div key={e.entity} className="run-entity">
              <span className="run-entity-name">{t(`run.entity.${e.entity}` as any) || e.entity.toUpperCase()}</span>
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
                      <span className="run-entity-metric-label">{t(`run.entity.metric.${k}` as any) || k}</span>
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
            <p className="run-empty">{t('run.artifacts.empty')}</p>
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

      {section === 'cyklus' && (
        <CyklusSection
          progression={data?.cyklusProgression ?? null}
          history={data?.cyklusHistory ?? null}
        />
      )}
    </div>
  );
}

function CyklusSection({ progression, history }: { progression: CyklusProgressionData | null; history: CyklusHistoryEntry[] | null }) {
  if (!progression || !progression.totalRuns) {
    return (
      <div className="run-section">
        <p className="run-empty">Žádná herní data z Cyklusu. Zahraj si hru a vrať se.</p>
      </div>
    );
  }

  const deathEntries = Object.entries(progression.deathsByStat ?? {}).filter(([, v]) => v > 0);
  const STAT_NAMES: Record<string, string> = { energy: 'Energie', memory: 'Paměť', bond: 'Vazba', control: 'Kontrola' };
  const CURRENCY_NAMES: Record<string, string> = {
    residuum: 'Reziduum', memoryResidue: 'Paměťový rezid.', energySpark: 'Jiskra energie',
    bondThread: 'Nitka vazby', controlShard: 'Střep kontroly', stabilizationCore: 'Stabilizační jádro',
  };
  const currencies = Object.entries(progression.currencies ?? {}).filter(([, v]) => (v ?? 0) > 0);
  const historyList = Array.isArray(history) ? history.slice(-10).reverse() : [];

  return (
    <div className="run-section">
      <div className="run-cyklus-stats">
        <div className="run-identity">
          <span className="run-label">Celkem runů</span>
          <span className="run-value">{progression.totalRuns}</span>
          <span className="run-label">Stabilizací</span>
          <span className="run-value">{progression.stabilizedRuns ?? 0}</span>
          <span className="run-label">Reziduum celkem</span>
          <span className="run-value">{progression.totalResiduumEarned ?? 0}</span>
        </div>

        {currencies.length > 0 && (
          <div className="run-cyklus-currencies">
            <span className="run-label">Měny</span>
            <div className="run-cyklus-currency-grid">
              {currencies.map(([k, v]) => (
                <div key={k} className="run-cyklus-currency">
                  <span className="run-cyklus-currency-label">{CURRENCY_NAMES[k] ?? k}</span>
                  <span className="run-cyklus-currency-value">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(progression.purchasedUpgrades?.length ?? 0) > 0 && (
          <div className="run-cyklus-upgrades">
            <span className="run-label">Upgrady ({progression.equippedUpgrades?.length ?? 0} nasazeno / {progression.purchasedUpgrades?.length ?? 0} celkem)</span>
          </div>
        )}

        {(progression.unlockedScars?.length ?? 0) > 0 && (
          <div className="run-cyklus-scars">
            <span className="run-label">Jizvy: {progression.unlockedScars?.length ?? 0}</span>
            {progression.activeScar && <span className="run-value"> (aktivní: {progression.activeScar})</span>}
          </div>
        )}

        {deathEntries.length > 0 && (
          <div className="run-cyklus-deaths">
            <span className="run-label">Příčiny konce</span>
            <div className="run-cyklus-death-grid">
              {deathEntries.map(([stat, count]) => (
                <div key={stat} className="run-cyklus-death">
                  <span className="run-cyklus-death-stat">{STAT_NAMES[stat] ?? stat}</span>
                  <span className="run-cyklus-death-count">×{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {historyList.length > 0 && (
        <div className="run-cyklus-history">
          <span className="run-label">Poslední runy</span>
          {historyList.map((h) => (
            <div key={h.id} className={`run-cyklus-history-entry run-cyklus-history-entry--${h.status}`}>
              <span className="run-cyklus-history-cycle">Cyklus {h.cycle}</span>
              <span className="run-cyklus-history-ending">{h.endingTitle}</span>
              <span className={`run-cyklus-history-status run-cyklus-history-status--${h.status}`}>{h.status === 'completed' ? 'Stabilizace' : 'Konec'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
