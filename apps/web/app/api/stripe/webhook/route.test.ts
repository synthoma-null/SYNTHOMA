/** @jest-environment node */
import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../../src/lib/prisma';
import { grantEntitlement, runSerializableTransaction } from '../../../../src/server/economy';
import { getManagedCatalogEntry } from '../../../../src/server/content/managedContent';
import { POST } from './route';
jest.mock('stripe', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../../src/lib/prisma', () => ({ __esModule: true, default: {
  checkoutOrder: { findUnique: jest.fn() }, externalGrantEvent: { findFirst: jest.fn(), create: jest.fn(), update: jest.fn() },
} }));
jest.mock('../../../../src/server/content/managedContent', () => ({ getManagedCatalogEntry: jest.fn() }));
jest.mock('../../../../src/server/economy', () => ({ grantEntitlement: jest.fn(), grantMnems: jest.fn(), grantPackage: jest.fn(), lockMnemAccount: jest.fn(), runSerializableTransaction: jest.fn() }));
const constructEvent = jest.fn();
const checkout = { id: 'cs_test', payment_status: 'paid', amount_total: 9900, currency: 'czk', metadata: { userId: 'user', contentId: 'custom-chapter', contentType: 'chapter', grantType: 'content', orderId: 'order' } };
beforeEach(() => {
  jest.clearAllMocks();
  (Stripe as unknown as jest.Mock).mockImplementation(() => ({ webhooks: { constructEvent } }));
  constructEvent.mockReturnValue({ id: 'evt_test', type: 'checkout.session.completed', data: { object: checkout } });
  (prisma.checkoutOrder.findUnique as jest.Mock).mockResolvedValue({ id: 'order', userId: 'user', chapterId: 'custom-chapter', packageId: null, stripeSessionId: 'cs_test', priceCents: 9900, currency: 'czk' });
  (runSerializableTransaction as jest.Mock).mockImplementation((fn) => fn(prisma));
  (prisma.externalGrantEvent.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.externalGrantEvent.create as jest.Mock).mockResolvedValue({ id: 'grant' });
});
const request = () => new NextRequest('https://www.synthoma.cz/api/stripe/webhook', { method: 'POST', body: '{}' });
it('fulfills the original recorded purchase even after catalog edits', async () => {
  expect((await POST(request())).status).toBe(200);
  expect(getManagedCatalogEntry).not.toHaveBeenCalled();
  expect(grantEntitlement).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user', contentId: 'custom-chapter' }), prisma);
});
it('rejects payment details that do not match the recorded order', async () => {
  constructEvent.mockReturnValue({ id: 'evt_test', type: 'checkout.session.completed', data: { object: { ...checkout, amount_total: 1 } } });
  expect((await POST(request())).status).toBe(400);
  expect(grantEntitlement).not.toHaveBeenCalled();
});
it('does not issue another grant when Stripe replays a completed event', async () => {
  (prisma.externalGrantEvent.findFirst as jest.Mock).mockResolvedValue({ status: 'completed' });
  expect((await POST(request())).status).toBe(200);
  expect(grantEntitlement).not.toHaveBeenCalled();
});
