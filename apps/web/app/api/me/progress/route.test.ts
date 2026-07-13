/** @jest-environment node */

import type { NextRequest } from 'next/server';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { POST } from './route';

jest.mock('../../../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: { readingProgress: { upsert: jest.fn() } },
}));

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedUpsert = prisma.readingProgress.upsert as jest.Mock;

function progressRequest(completed: boolean): NextRequest {
  return new Request('http://localhost/api/me/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      collection: 'SYNTHOMA-NULL',
      chapterId: '0-3-discontinuum',
      progressPercent: completed ? 100 : 12,
      completed,
    }),
  }) as NextRequest;
}

describe('POST /api/me/progress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAuth.mockResolvedValue({ user: { id: 'qa-user' } } as never);
    mockedUpsert.mockResolvedValue({ id: 'progress-1' });
  });

  it('does not clear completion during a later incomplete autosave', async () => {
    const response = await POST(progressRequest(false));

    expect(response.status).toBe(200);
    const update = mockedUpsert.mock.calls[0][0].update;
    expect(update).toMatchObject({ progressPercent: 12 });
    expect(update).not.toHaveProperty('completed');
    expect(update).not.toHaveProperty('completedAt');
  });

  it('records an explicit completion at 100 percent', async () => {
    const response = await POST(progressRequest(true));

    expect(response.status).toBe(200);
    const update = mockedUpsert.mock.calls[0][0].update;
    expect(update).toMatchObject({ progressPercent: 100, completed: true });
    expect(update.completedAt).toBeInstanceOf(Date);
  });
});
