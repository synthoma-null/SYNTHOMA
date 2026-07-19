import { readStorageJSON, writeStorageJSON } from './browser';

export const READER_DECISIONS_STORAGE_KEY = 'synthoma_reader_decisions:v1';

export interface ReaderDecisionRecord {
  chapterId: string;
  questionId: string;
  choiceId: string;
  selectedAt: string;
}

interface ReaderDecisionStore {
  version: 1;
  decisions: Record<string, ReaderDecisionRecord>;
}

export type ReaderDecisionCommitResult =
  | { status: 'committed'; record: ReaderDecisionRecord }
  | { status: 'existing'; record: ReaderDecisionRecord }
  | { status: 'error' };

export interface ReaderDecisionPersistence {
  read(chapterId: string, questionId: string): ReaderDecisionRecord | null;
  commit(record: ReaderDecisionRecord): ReaderDecisionCommitResult;
}

function decisionKey(chapterId: string, questionId: string): string {
  return `${chapterId}:${questionId}`;
}

function readStore(): ReaderDecisionStore {
  const stored = readStorageJSON<ReaderDecisionStore | null>(READER_DECISIONS_STORAGE_KEY, null);
  if (!stored || stored.version !== 1 || !stored.decisions || typeof stored.decisions !== 'object') {
    return { version: 1, decisions: {} };
  }
  return stored;
}

export const readerDecisionPersistence: ReaderDecisionPersistence = {
  read(chapterId, questionId) {
    return readStore().decisions[decisionKey(chapterId, questionId)] ?? null;
  },

  commit(record) {
    const store = readStore();
    const key = decisionKey(record.chapterId, record.questionId);
    const existing = store.decisions[key];
    if (existing) return { status: 'existing', record: existing };

    const next: ReaderDecisionStore = {
      version: 1,
      decisions: { ...store.decisions, [key]: record },
    };
    if (!writeStorageJSON(READER_DECISIONS_STORAGE_KEY, next)) return { status: 'error' };

    const confirmed = readStore().decisions[key];
    if (!confirmed || confirmed.choiceId !== record.choiceId) return { status: 'error' };
    return { status: 'committed', record: confirmed };
  },
};
