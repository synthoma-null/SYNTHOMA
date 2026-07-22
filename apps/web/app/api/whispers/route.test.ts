/** @jest-environment node */

import type { NextRequest } from 'next/server';
import { auth } from '../../../auth';
import prisma from '../../../src/lib/prisma';
import { reportRuntimeDatabaseError } from '../../../src/server/runtimeDatabase';
import { GET } from './route';

jest.mock('../../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    whisper: { findMany: jest.fn(), updateMany: jest.fn() },
    whisperResonance: { findMany: jest.fn() },
  },
}));
jest.mock('../../../src/server/runtimeDatabase', () => ({
  reportRuntimeDatabaseError: jest.fn(() => ({
    correlationId: 'whispers-correlation-1',
    code: 'EACCES',
    model: 'Whisper',
    column: null,
  })),
}));

const db = prisma as unknown as {
  whisper: { findMany: jest.Mock; updateMany: jest.Mock };
  whisperResonance: { findMany: jest.Mock };
};

function request(): NextRequest {
  return { url: 'http://localhost/api/whispers?placement=archive&limit=3' } as NextRequest;
}

describe('GET /api/whispers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue(null);
    db.whisper.updateMany.mockResolvedValue({ count: 0 });
    db.whisperResonance.findMany.mockResolvedValue([]);
  });

  it('returns an empty public channel without unnecessary writes or private queries', async () => {
    db.whisper.findMany.mockResolvedValue([]);

    const response = await GET(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([]);
    expect(auth).not.toHaveBeenCalled();
    expect(db.whisper.updateMany).not.toHaveBeenCalled();
    expect(db.whisperResonance.findMany).not.toHaveBeenCalled();
  });

  it('marks resonated whispers for an authenticated subject', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'subject-1' } });
    db.whisper.findMany.mockResolvedValue([{
      id: 'whisper-1',
      publicMode: 'anonymous',
      type: 'memory',
      text: 'Paměť drží.',
      placement: 'archive',
      chapterId: null,
      resonanceCount: 1,
      displayCount: 0,
      boostedUntil: null,
      approvedAt: null,
    }]);
    db.whisperResonance.findMany.mockResolvedValue([{ whisperId: 'whisper-1' }]);

    const response = await GET(request());
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual([expect.objectContaining({ id: 'whisper-1', resonated: true })]);
    expect(db.whisper.updateMany).toHaveBeenCalledTimes(1);
    expect(db.whisperResonance.findMany).toHaveBeenCalledTimes(1);
  });

  it('returns a traceable 503 when the database is unavailable', async () => {
    const error = Object.assign(new Error('permission denied'), { code: 'EACCES' });
    db.whisper.findMany.mockRejectedValue(error);

    const response = await GET(request());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: 'WHISPERS_DATABASE_UNAVAILABLE',
      message: 'Kanál šepotů teď není dostupný.',
      correlationId: 'whispers-correlation-1',
      retryable: true,
    });
    expect(response.headers.get('cache-control')).toBe('private, no-store');
    expect(reportRuntimeDatabaseError).toHaveBeenCalledWith('whispers-get', error);
  });
});
