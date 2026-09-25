import { flushReadingProgress, queueReadingProgress, type ProgressWrite } from '../readingSync';

const entry: ProgressWrite = { collection: 'book', chapterId: 'chapter', chapterTitle: 'Chapter', progressPercent: 25, completed: false, readMs: 1000 };
beforeEach(() => { localStorage.clear(); global.fetch = jest.fn(); });

it('retains failed HTTP writes and retries them for the same account', async () => {
  queueReadingProgress('alice', entry);
  jest.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response).mockResolvedValue({ ok: true } as Response);
  await expect(flushReadingProgress('alice')).rejects.toThrow('PROGRESS_NOT_SAVED');
  expect(localStorage.getItem('synthoma:reading-outbox:alice')).toContain('chapter');
  await flushReadingProgress('alice');
  expect(JSON.parse(localStorage.getItem('synthoma:reading-outbox:alice')!)).toEqual({});
  expect(fetch).toHaveBeenLastCalledWith('/api/me/progress', expect.objectContaining({ body: expect.stringContaining('"expectedUserId":"alice"') }));
});

it('does not discard newer progress queued while a write is in flight', async () => {
  let finish!: (value: Response) => void;
  jest.mocked(fetch).mockImplementationOnce(() => new Promise(resolve => { finish = resolve; })).mockResolvedValue({ ok: true } as Response);
  queueReadingProgress('alice', entry);
  const flushing = flushReadingProgress('alice');
  queueReadingProgress('alice', { ...entry, progressPercent: 75 });
  finish({ ok: true } as Response);
  await flushing;
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(fetch).toHaveBeenLastCalledWith('/api/me/progress', expect.objectContaining({ body: expect.stringContaining('"progressPercent":75') }));
});

it('keeps different accounts in separate queues', async () => {
  queueReadingProgress('alice', entry);
  jest.mocked(fetch).mockResolvedValue({ ok: true } as Response);
  await flushReadingProgress('bob');
  expect(fetch).not.toHaveBeenCalled();
  expect(localStorage.getItem('synthoma:reading-outbox:alice')).toContain('chapter');
});
