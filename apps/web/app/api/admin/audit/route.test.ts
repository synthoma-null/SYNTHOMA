import { GET } from './route';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';

jest.mock('next/server', () => {
  class MockNextResponse {
    body: string;
    status: number;
    constructor(body = '', init: { status?: number } = {}) { this.body = body; this.status = init.status ?? 200; }
    static json(data: unknown, init: { status?: number } = {}) { return new MockNextResponse(JSON.stringify(data), init); }
    async json() { return JSON.parse(this.body); }
  }
  return { NextRequest: class {}, NextResponse: MockNextResponse };
});
jest.mock('../../../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../../../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    adminAuditLog: { findMany: jest.fn() },
    user: { findMany: jest.fn() },
  },
}));

const db = prisma as unknown as {
  adminAuditLog: { findMany: jest.Mock };
  user: { findMany: jest.Mock };
};

describe('GET /api/admin/audit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'admin-1', role: 'admin' } });
    db.adminAuditLog.findMany.mockResolvedValue([{
      id: 'audit-1', actorUserId: 'admin-1', targetUserId: 'user-1', action: 'mnem_adjustment', reference: null, metadata: { amount: 5 }, createdAt: new Date('2026-08-05T10:00:00.000Z'),
    }]);
    db.user.findMany.mockResolvedValue([
      { id: 'admin-1', nickname: 'Operator', email: 'admin@example.test' },
      { id: 'user-1', nickname: 'Subjekt', email: 'user@example.test' },
    ]);
  });

  it('joins readable actor and target identities', async () => {
    const response = await GET({ url: 'http://localhost/api/admin/audit?limit=20' } as never);
    const payload = await response.json();
    expect(response.status).toBe(200);
    expect(payload.entries[0]).toMatchObject({ actor: { nickname: 'Operator' }, target: { nickname: 'Subjekt' } });
    expect(db.adminAuditLog.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
  });

  it('rejects non-admin sessions', async () => {
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1', role: 'user' } });
    const response = await GET({ url: 'http://localhost/api/admin/audit' } as never);
    expect(response.status).toBe(403);
    expect(db.adminAuditLog.findMany).not.toHaveBeenCalled();
  });
});
