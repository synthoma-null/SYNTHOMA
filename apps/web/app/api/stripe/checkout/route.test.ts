/** @jest-environment node */
import { NextRequest } from 'next/server';
import { POST } from './route';
import { auth } from '../../../../auth';
import prisma from '../../../../src/lib/prisma';
import { getManagedChapter } from '../../../../src/server/content/managedContent';
import Stripe from 'stripe';
jest.mock('../../../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../../../src/server/content/managedContent', () => ({ getManagedChapter: jest.fn() }));
jest.mock('../../../../src/lib/prisma', () => ({ __esModule: true, default: { checkoutOrder: { upsert: jest.fn(), update: jest.fn() } } }));
jest.mock('stripe', () => ({ __esModule: true, default: jest.fn() }));
const create = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  (auth as jest.Mock).mockResolvedValue({ user: { id: 'user-1' } });
  (Stripe as unknown as jest.Mock).mockImplementation(() => ({ checkout: { sessions: { create } } }));
  create.mockResolvedValue({ id: 'cs_test', url: 'https://checkout.stripe.com/test' });
  (prisma.checkoutOrder.upsert as jest.Mock).mockImplementation(({ create: order }) => order);
  (getManagedChapter as jest.Mock).mockResolvedValue({ visibility: 'published', chapter: { id: 'editor-chapter', title: 'Editor chapter', accessPolicy: 'entitlement', availability: 'published' } });
});
const request = () => new NextRequest('https://www.synthoma.cz/api/stripe/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': 'test-purchase-12345' }, body: JSON.stringify({ chapterId: 'editor-chapter' }) });
it('can buy an editor-created chapter and persists the sold product', async () => {
  expect((await POST(request())).status).toBe(200);
  expect(prisma.checkoutOrder.upsert).toHaveBeenCalledWith(expect.objectContaining({ create: expect.objectContaining({ chapterId: 'editor-chapter', userId: 'user-1', name: 'PAMĚŤOVÝ FRAGMENT: Editor chapter' }) }));
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ metadata: expect.objectContaining({ orderId: expect.any(String), contentId: 'editor-chapter' }) }), expect.anything());
});
it('never charges for content the editor has hidden', async () => {
  (getManagedChapter as jest.Mock).mockResolvedValue({ visibility: 'hidden', chapter: { id: 'editor-chapter', accessPolicy: 'entitlement', availability: 'unavailable' } });
  expect((await POST(request())).status).toBe(409);
  expect(create).not.toHaveBeenCalled();
});
it('keeps the original price for a retried purchase', async () => {
  (prisma.checkoutOrder.upsert as jest.Mock).mockImplementation(({ create: order }) => ({ ...order, priceCents: 1234, name: 'Original offer' }));
  await POST(request());
  expect(create.mock.calls[0][0].line_items[0].price_data).toMatchObject({ unit_amount: 1234, product_data: { name: 'Original offer' } });
});
