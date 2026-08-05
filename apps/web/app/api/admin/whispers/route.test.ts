import { PATCH } from './route';
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
    user: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));

const db = prisma as unknown as {
  user: { findUnique: jest.Mock };
  $transaction: jest.Mock;
};

describe('PATCH /api/admin/whispers', () => {
  const update = jest.fn();
  const createAudit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: { id: 'admin-1' } });
    db.user.findUnique.mockResolvedValue({ role: 'admin' });
    update.mockResolvedValue({ id: 'whisper-1', status: 'approved', userId: 'user-1' });
    createAudit.mockResolvedValue({ id: 'audit-1' });
    db.$transaction.mockImplementation((callback: (tx: unknown) => unknown) => callback({ whisper: { update }, adminAuditLog: { create: createAudit } }));
  });

  it('stores moderation and its audit record atomically', async () => {
    const response = await PATCH({ json: async () => ({ id: 'whisper-1', action: 'approve' }) } as never);
    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'whisper-1' } }));
    expect(createAudit).toHaveBeenCalledWith({ data: expect.objectContaining({ actorUserId: 'admin-1', targetUserId: 'user-1', action: 'whisper_approve' }) });
  });

  it('rejects malformed moderation data before writing', async () => {
    const response = await PATCH({ json: async () => ({ id: '', action: 'delete' }) } as never);
    expect(response.status).toBe(400);
    expect(db.$transaction).not.toHaveBeenCalled();
  });
});
