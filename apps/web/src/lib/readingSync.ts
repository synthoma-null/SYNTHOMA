import { readStorageJSON, writeStorageJSON } from './browser';

export interface ProgressWrite {
  collection: string;
  chapterId: string;
  chapterTitle: string;
  progressPercent: number;
  completed: boolean;
  readMs: number;
}

const queueKey = (userId: string) => `synthoma:reading-outbox:${userId}`;
export function queueReadingProgress(userId: string, entry: ProgressWrite) {
  const pending = readStorageJSON<Record<string, ProgressWrite>>(queueKey(userId), {});
  pending[`${entry.collection}:${entry.chapterId}`] = entry;
  return writeStorageJSON(queueKey(userId), pending);
}

// One request at a time per account; newer queued changes survive an older acknowledgement.
const running = new Map<string, Promise<void>>();
export function flushReadingProgress(userId: string): Promise<void> {
  const existing = running.get(userId);
  if (existing) return existing;
  const task = (async () => {
    for (;;) {
      const pending = readStorageJSON<Record<string, ProgressWrite>>(queueKey(userId), {});
      const item = Object.entries(pending)[0];
      if (!item) return;
      const [key, entry] = item;
      const response = await fetch('/api/me/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin',
        keepalive: true, body: JSON.stringify({ ...entry, expectedUserId: userId }),
      });
      if (!response.ok) throw new Error('PROGRESS_NOT_SAVED');
      const latest = readStorageJSON<Record<string, ProgressWrite>>(queueKey(userId), {});
      if (JSON.stringify(latest[key]) === JSON.stringify(entry)) delete latest[key];
      if (!writeStorageJSON(queueKey(userId), latest)) throw new Error('LOCAL_STORAGE_UNAVAILABLE');
    }
  })();
  running.set(userId, task);
  void task.finally(() => running.delete(userId)).catch(() => {});
  return task;
}
