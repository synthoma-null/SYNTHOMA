import { GET } from './route';
import prisma from '../../../../src/lib/prisma';
import { auth } from '../../../../auth';
import { getMnemBalance } from '../../../../src/server/economy';

jest.mock('next/server', () => {
  class MockNextResponse {
    body: string;
    status: number;
    headers: Headers;
    constructor(body = '', init: { status?: number; headers?: HeadersInit } = {}) {
      this.body = body;
      this.status = init.status ?? 200;
      this.headers = new Headers(init.headers);
    }
    static json(data: unknown, init: { status?: number; headers?: HeadersInit } = {}) {
      return new MockNextResponse(JSON.stringify(data), init);
    }
    async json() { return JSON.parse(this.body); }
  }
  return { NextRequest: class {}, NextResponse: MockNextResponse };
});
jest.mock('../../../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: { findUnique: jest.fn() },
    mnemLedger: { findMany: jest.fn() },
    entitlement: { findMany: jest.fn() },
    purchase: { findMany: jest.fn() },
    fragmentUnlock: { findMany: jest.fn() },
    userArtifact: { findMany: jest.fn() },
    userCosmeticUnlock: { findMany: jest.fn() },
  },
}));
jest.mock('../../../../src/server/economy', () => ({ getMnemBalance: jest.fn() }));
jest.mock('../../../../src/server/runtimeDatabase', () => ({
  isPrismaSchemaCompatibilityError: (error: { code?: string }) => error?.code === 'P2021' || error?.code === 'P2022',
  reportRuntimeDatabaseError: jest.fn(() => ({
    correlationId: 'runtime-correlation-1',
    code: 'P2022',
    model: 'Runtime',
    column: null,
  })),
}));

const db = prisma as unknown as {
  user: { findUnique: jest.Mock };
  mnemLedger: { findMany: jest.Mock };
  entitlement: { findMany: jest.Mock };
  purchase: { findMany: jest.Mock };
  fragmentUnlock: { findMany: jest.Mock };
  userArtifact: { findMany: jest.Mock };
  userCosmeticUnlock: { findMany: jest.Mock };
};

const baseUser = {
  id: 'user-1',
  nickname: 'Mira',
  email: 'mira@example.test',
  role: 'user',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  lastLoginAt: null,
  profile: { title: 'Subjekt' },
  settings: { theme: 'synthoma' },
  psyche: { ni: 50 },
  choices: [],
  _count: { choices: 1, reading: 1 },
};

function prismaError(code: 'P2021' | 'P2022') {
  return Object.assign(new Error(code), { code });
}

describe('GET /api/me/profile runtime recovery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    db.user.findUnique.mockResolvedValue(baseUser);
    (getMnemBalance as jest.Mock).mockResolvedValue(7);
    db.fragmentUnlock.findMany.mockResolvedValue([]);
    db.userArtifact.findMany.mockResolvedValue([]);
    db.userCosmeticUnlock.findMany.mockResolvedValue([]);
  });

  it('returns partial legacy data when new ledger, entitlement and purchase fields are absent', async () => {
    db.mnemLedger.findMany
      .mockRejectedValueOnce(prismaError('P2022'))
      .mockResolvedValueOnce([{
        id: 'ledger-1', amount: 7, reason: 'legacy grant', createdAt: new Date('2026-01-02T00:00:00.000Z'),
      }]);
    db.entitlement.findMany
      .mockRejectedValueOnce(prismaError('P2022'))
      .mockResolvedValueOnce([{
        id: 'entitlement-1', packageId: null, chapterId: '0-4-defragmentation', source: 'legacy', createdAt: new Date('2026-01-02T00:00:00.000Z'),
      }]);
    db.purchase.findMany.mockRejectedValue(prismaError('P2021'));

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      dataState: 'partial',
      correlationId: 'runtime-correlation-1',
      mnemBalance: 7,
      warnings: ['LEGACY_DATABASE_SCHEMA'],
    });
    expect(payload.ledger[0]).toMatchObject({ balanceAfter: 7, transactionType: 'grant' });
    expect(payload.ownership[0]).toMatchObject({ contentType: 'chapter', contentId: '0-4-defragmentation' });
    expect(payload.purchases).toEqual([]);
  });

  it('returns an explicit empty state for an account without profile data or economy history', async () => {
    db.user.findUnique.mockResolvedValue({
      ...baseUser,
      profile: null,
      settings: null,
      psyche: null,
      _count: { choices: 0, reading: 0 },
    });
    (getMnemBalance as jest.Mock).mockResolvedValue(0);
    db.mnemLedger.findMany.mockResolvedValue([]);
    db.entitlement.findMany.mockResolvedValue([]);
    db.purchase.findMany.mockResolvedValue([]);

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.dataState).toBe('empty');
    expect(payload.ledger).toEqual([]);
    expect(payload.ownership).toEqual([]);
  });

  it('returns a retryable 503 with a correlation ID on a real database outage', async () => {
    db.user.findUnique.mockRejectedValue(new Error('connection unavailable'));

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      error: 'Profil subjektu se nepodařilo načíst.',
      code: 'PROFILE_DATABASE_UNAVAILABLE',
      correlationId: 'runtime-correlation-1',
      retryable: true,
    });
  });

  it('returns only a short plain-text trace of recent decisions', async () => {
    db.user.findUnique.mockResolvedValue({
      ...baseUser,
      choices: [{
        id: 'choice-1',
        collection: 'synthoma',
        chapterId: '0-0-null',
        choiceId: 'accept',
        choiceText: '<p>Přijmout <strong>záznam</strong></p>',
        nextBlockId: 'next',
        functionDelta: { ti: 2 },
        emotionDelta: null,
        tone: 'tender',
        createdAt: new Date('2026-07-12T08:20:00.000Z'),
      }],
    });
    db.mnemLedger.findMany.mockResolvedValue([]);
    db.entitlement.findMany.mockResolvedValue([]);
    db.purchase.findMany.mockResolvedValue([]);

    const response = await GET();
    const payload = await response.json();

    expect(payload.user.choices).toBeUndefined();
    expect(payload.recentChoices).toHaveLength(1);
    expect(payload.recentChoices[0]).toMatchObject({
      id: 'choice-1',
      choiceText: 'Přijmout záznam',
      functionDelta: { ti: 2 },
    });
    expect(payload.recentChoices[0].choiceText).not.toContain('<');
  });
});
