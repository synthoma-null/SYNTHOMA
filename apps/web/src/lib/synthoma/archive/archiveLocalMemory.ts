import { readStorageJSON } from '../../browser';
import type { ArchiveCyklusMemory } from './archiveTypes';

const FINDINGS_KEY = 'synthoma_cyklus_findings';
const META_UNLOCKS_KEY = 'synthoma_cyklus_meta_unlocks';
const CYKLUS_RUN_KEY = 'synthoma_cyklus_run_v1';
const CYKLUS_HISTORY_KEY = 'synthoma_cyklus_history_v1';
const LEGACY_RUN_KEY = 'synthoma_run_v1';

function isFinding(value: unknown): value is ArchiveCyklusMemory['findings'][number] {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && typeof item.title === 'string'
    && typeof item.description === 'string'
    && typeof item.earnedAt === 'number';
}

export function readArchiveLocalMemory() {
  const rawFindings = readStorageJSON<unknown[]>(FINDINGS_KEY, []);
  const rawUnlocks = readStorageJSON<unknown[]>(META_UNLOCKS_KEY, []);
  const cyklusRun = readStorageJSON<{ status?: string } | null>(CYKLUS_RUN_KEY, null);
  const history = readStorageJSON<unknown[]>(CYKLUS_HISTORY_KEY, []);
  const legacyRun = readStorageJSON<{ version?: number; state?: { status?: string } } | null>(LEGACY_RUN_KEY, null);

  return {
    findings: rawFindings.filter(isFinding),
    metaUnlocks: rawUnlocks.filter((item): item is string => typeof item === 'string'),
    activeCyklusRun: cyklusRun?.status === 'playing',
    cyklusHistoryCount: Array.isArray(history) ? history.length : 0,
    activeLegacyRun: legacyRun?.version === 1 && legacyRun.state?.status === 'playing',
  };
}
