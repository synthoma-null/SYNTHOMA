import { readFile } from 'node:fs/promises';
import { GET } from './route';
import { auth } from '../../../../auth';
import { getContentAccess } from '../../../../src/server/economy';

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
      return new MockNextResponse(JSON.stringify(data), {
        ...init,
        headers: { 'Content-Type': 'application/json', ...Object.fromEntries(new Headers(init.headers).entries()) },
      });
    }
    async json() { return JSON.parse(this.body); }
    async text() { return this.body; }
  }
  return { NextRequest: class {}, NextResponse: MockNextResponse };
});
jest.mock('../../../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../../../src/server/economy', () => ({ getContentAccess: jest.fn() }));
jest.mock('../../../../src/server/runtimeDatabase', () => ({
  reportRuntimeDatabaseError: jest.fn(() => ({ correlationId: 'chapter-correlation-1' })),
}));
jest.mock('node:fs/promises', () => ({ readFile: jest.fn() }));

function request(chapterId: string) {
  return GET(
    { nextUrl: new URL(`http://localhost/api/chapter/${chapterId}`) } as never,
    { params: Promise.resolve({ chapterId }) },
  );
}

function access(state: 'free' | 'owned' | 'locked') {
  return {
    contentType: 'chapter',
    contentId: 'fixture',
    state,
    reason: state === 'free' ? 'catalog_free' : state === 'owned' ? 'direct_entitlement' : 'purchase_required',
    canAccess: state !== 'locked',
    canPurchase: state === 'locked',
    mnemCost: state === 'free' ? 0 : 64,
    title: 'Fixture',
    purchasePackageIds: [],
    prerequisiteChapterId: null,
  };
}

describe('GET /api/chapter/[chapterId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue(null);
    (readFile as jest.Mock).mockResolvedValue('<article>chapter body</article>');
  });

  it.each([
    ['free', '0-0-null'],
    ['owned', '0-4-defragmentation'],
  ] as const)('serves %s chapter HTML only after access succeeds', async (state, chapterId) => {
    (getContentAccess as jest.Mock).mockResolvedValue(access(state));

    const response = await request(chapterId);

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/html');
    expect(await response.text()).toContain('chapter body');
  });

  it('returns the purchase gate contract for a known locked chapter', async () => {
    (getContentAccess as jest.Mock).mockResolvedValue(access('locked'));

    const response = await request('0-4-defragmentation');
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.error).toBe('CONTENT_LOCKED');
    expect(readFile).not.toHaveBeenCalled();
  });

  it('distinguishes unavailable and unknown chapters before database access', async () => {
    const unavailable = await request('0-12-conflict');
    const unknown = await request('not-a-chapter');

    expect(unavailable.status).toBe(409);
    expect((await unavailable.json()).error).toBe('CONTENT_UNAVAILABLE');
    expect(unknown.status).toBe(404);
    expect((await unknown.json()).error).toBe('CHAPTER_NOT_FOUND');
    expect(getContentAccess).not.toHaveBeenCalled();
  });

  it('fails closed with retryable 503 instead of exposing protected HTML or returning 404', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
    (getContentAccess as jest.Mock).mockRejectedValue(Object.assign(new Error('missing column'), { code: 'P2022' }));

    const response = await request('0-4-defragmentation');
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toEqual({
      error: 'CHAPTER_ACCESS_UNAVAILABLE',
      message: 'Přístup ke známému fragmentu se teď nepodařilo ověřit.',
      correlationId: 'chapter-correlation-1',
      retryable: true,
    });
    expect(readFile).not.toHaveBeenCalled();
  });
});
