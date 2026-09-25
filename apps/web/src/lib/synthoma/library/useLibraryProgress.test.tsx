import { renderHook, waitFor } from '@testing-library/react';
import { useLibraryProgress } from './useLibraryProgress';
import type { LibraryCollection } from './libraryTypes';
import { saveReadingProgress } from '../../readerState';
let mockUserId = 'alice';
jest.mock('next-auth/react', () => ({ useSession: () => ({ status: 'authenticated', data: { user: { id: mockUserId } } }) }));
const collections = [{ slug: 'book', chapters: [{ id: 'chapter', path: '/chapter/chapter' }] }] as LibraryCollection[];
beforeEach(() => { localStorage.clear(); mockUserId = 'alice'; });

it('offers remote unfinished progress on a device with no local history', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ progress: [{ chapterId: 'chapter', progressPercent: 63, completed: false, updatedAt: '2026-09-25T10:00:00Z' }] }) });
  const { result } = renderHook(() => useLibraryProgress(collections));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.byChapterId.chapter?.percent).toBe(63);
  expect(result.current.byCollection.book).toMatchObject({ path: '/chapter/chapter', percent: 63 });
});

it('preserves newer local reading and does not leak another account into the merge', async () => {
  saveReadingProgress({ bookId: 'book', chapterId: 'chapter', path: '/chapter/chapter', percent: 95, userId: 'bob', updatedAt: Date.now() });
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ progress: [{ chapterId: 'chapter', progressPercent: 40, completed: false }] }) });
  const { result } = renderHook(() => useLibraryProgress(collections));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.byChapterId.chapter?.percent).toBe(40);
});

it('clears remote history when switching accounts even if the next request fails', async () => {
  global.fetch = jest.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ progress: [{ chapterId: 'chapter', progressPercent: 70 }] }) })
    .mockRejectedValueOnce(new Error('offline'));
  const { result, rerender } = renderHook(() => useLibraryProgress(collections));
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.byChapterId.chapter?.percent).toBe(70);
  mockUserId = 'bob';
  rerender();
  expect(result.current.byChapterId.chapter?.percent).toBe(0);
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.byCollection.book).toBeUndefined();
});
