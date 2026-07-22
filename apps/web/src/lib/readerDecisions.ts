import { readStorageJSON, removeStorage, writeStorageJSON } from './browser';

export const READER_DECISIONS_STORAGE_KEY = 'synthoma_reader_choices:v2';
export const LEGACY_READER_DECISIONS_STORAGE_KEY = 'synthoma_reader_decisions:v1';

export interface ReaderDecisionRecord {
  chapterId: string;
  collection: string;
  groupId: string;
  questionId: string;
  choiceId: string;
  tags: string[];
  nextBlockId?: string;
  href?: string;
  selectedAt: number;
}

interface ReaderDecisionStore {
  version: 2;
  decisions: Record<string, ReaderDecisionRecord>;
}

interface LegacyReaderDecisionRecord {
  chapterId: string;
  questionId: string;
  choiceId: string;
  selectedAt: string | number;
}

interface LegacyReaderDecisionStore {
  version: 1;
  decisions: Record<string, LegacyReaderDecisionRecord>;
}

export type ReaderDecisionCommitResult =
  | { status: 'committed'; record: ReaderDecisionRecord }
  | { status: 'existing'; record: ReaderDecisionRecord }
  | { status: 'error' };

export interface ReaderDecisionPersistence {
  read(chapterId: string, groupId: string, collection?: string): ReaderDecisionRecord | null;
  commit(record: ReaderDecisionRecord): ReaderDecisionCommitResult;
}

function decisionKey(collection: string, chapterId: string, groupId: string): string {
  return `${collection}:${chapterId}:${groupId}`;
}

function readStore(): ReaderDecisionStore {
  const stored = readStorageJSON<ReaderDecisionStore | null>(READER_DECISIONS_STORAGE_KEY, null);
  if (!stored || stored.version !== 2 || !stored.decisions || typeof stored.decisions !== 'object') {
    return { version: 2, decisions: {} };
  }
  return stored;
}

function readLegacyRecord(chapterId: string, groupId: string, collection: string): ReaderDecisionRecord | null {
  const stored = readStorageJSON<LegacyReaderDecisionStore | null>(LEGACY_READER_DECISIONS_STORAGE_KEY, null);
  if (!stored || stored.version !== 1 || !stored.decisions || typeof stored.decisions !== 'object') return null;
  const legacy = stored.decisions[`${chapterId}:${groupId}`];
  if (!legacy) return null;
  const parsedTime = typeof legacy.selectedAt === 'number' ? legacy.selectedAt : Date.parse(legacy.selectedAt);
  return {
    chapterId,
    collection,
    groupId,
    questionId: groupId,
    choiceId: legacy.choiceId,
    tags: [],
    selectedAt: Number.isFinite(parsedTime) ? parsedTime : 0,
  };
}

export const readerDecisionPersistence: ReaderDecisionPersistence = {
  read(chapterId, groupId, collection = 'SYNTHOMA-NULL') {
    const current = readStore().decisions[decisionKey(collection, chapterId, groupId)];
    return current ?? readLegacyRecord(chapterId, groupId, collection);
  },

  commit(record) {
    const store = readStore();
    const key = decisionKey(record.collection, record.chapterId, record.groupId);
    const existing = store.decisions[key];
    if (existing) return { status: 'existing', record: existing };

    const next: ReaderDecisionStore = {
      version: 2,
      decisions: { ...store.decisions, [key]: record },
    };
    if (!writeStorageJSON(READER_DECISIONS_STORAGE_KEY, next)) return { status: 'error' };

    const confirmed = readStore().decisions[key];
    if (!confirmed || confirmed.choiceId !== record.choiceId) return { status: 'error' };
    return { status: 'committed', record: confirmed };
  },
};

export function clearReaderDecisionState(collection: string, chapterId?: string): void {
  const store = readStore();
  const prefix = chapterId ? `${collection}:${chapterId}:` : `${collection}:`;
  const decisions = Object.fromEntries(
    Object.entries(store.decisions).filter(([key]) => !key.startsWith(prefix)),
  );
  if (Object.keys(decisions).length === Object.keys(store.decisions).length) return;
  if (Object.keys(decisions).length === 0) {
    removeStorage(READER_DECISIONS_STORAGE_KEY);
    return;
  }
  writeStorageJSON(READER_DECISIONS_STORAGE_KEY, { version: 2, decisions } satisfies ReaderDecisionStore);
}
