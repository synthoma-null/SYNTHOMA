/** @jest-environment node */
import { NextRequest } from 'next/server';
import { GET, POST, PATCH } from './route';
import prisma from '../../../../src/lib/prisma';
import { auth } from '../../../../auth';
import { getManagedChapter, readManagedChapterDocument } from '../../../../src/server/content/managedContent';

jest.mock('../../../../auth', () => ({ auth: jest.fn() }));
jest.mock('../../../../src/lib/prisma', () => ({ __esModule: true, default: {
  user: { findUnique: jest.fn() }, managedChapter: { findUnique: jest.fn(), create: jest.fn(), upsert: jest.fn() },
  managedBook: { findUnique: jest.fn(), create: jest.fn() }, adminAuditLog: { create: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() }, $transaction: jest.fn(),
} }));
jest.mock('../../../../src/server/content/managedContent', () => ({
  staticChapterExists: () => false, staticBookExists: () => false,
  getManagedContentCatalog: async () => ({ books: [{ id: 'book' }], chapters: [] }),
  getManagedChapter: jest.fn(), readManagedChapterDocument: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(auth).mockResolvedValue({ user: { id: 'admin' } } as never);
  jest.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'admin' } as never);
  jest.mocked(prisma.$transaction).mockImplementation(async (callback: unknown) => (callback as (tx: unknown) => Promise<unknown>)(prisma));
  jest.mocked(prisma.managedChapter.findUnique).mockResolvedValue(null);
});

it('forces new chapters to be hidden even when creation requests publication', async () => {
  const response = await POST(new NextRequest('http://localhost/api/admin/content', { method: 'POST', body: JSON.stringify({ entity: 'chapter', id: 'new-chapter', bookId: 'book', title: 'New', visibility: 'published', bodyHtml: '<p>Text</p>', bodyHtmlEn: '' }) }));
  expect(response.status).toBe(201);
  expect(prisma.managedChapter.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ visibility: 'hidden', bodyHtmlEn: null }) }));
});

it('scopes revision lookup to the requested chapter and restores a hidden draft', async () => {
  jest.mocked(prisma.adminAuditLog.findFirst).mockResolvedValue({ metadata: { snapshot: { id: 'chapter', bodyHtml: '<p>Old</p>', visibility: 'published' } } } as never);
  const response = await GET(new NextRequest('http://localhost/api/admin/content?chapterId=chapter&revisionId=revision'));
  expect(prisma.adminAuditLog.findFirst).toHaveBeenCalledWith({ where: { id: 'revision', action: 'content_chapter_revision', reference: 'chapter' } });
  expect(await response.json()).toMatchObject({ visibility: 'hidden', bodyHtml: '<p>Old</p>' });
});

it('records the prior body when a chapter is edited', async () => {
  jest.mocked(prisma.managedChapter.findUnique).mockResolvedValue({ id: 'chapter', bookId: 'book' } as never);
  jest.mocked(getManagedChapter).mockResolvedValue({ chapter: { id: 'chapter', fullTitle: 'Title' }, bookId: 'book', bodyHtml: '<p>Before</p>', isCustom: true, visibility: 'hidden' } as never);
  jest.mocked(readManagedChapterDocument).mockResolvedValue({ bodyHtml: '<p>Before</p>' } as never);
  const response = await PATCH(new NextRequest('http://localhost/api/admin/content', { method: 'PATCH', body: JSON.stringify({ entity: 'chapter', id: 'chapter', bodyHtml: '<p>After</p>' }) }));
  expect(response.status).toBe(200);
  expect(prisma.adminAuditLog.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ action: 'content_chapter_revision', reference: 'chapter', metadata: { snapshot: expect.objectContaining({ bodyHtml: '<p>Before</p>' }) } }) }));
});

it('denies revision access without an administrator', async () => {
  jest.mocked(prisma.user.findUnique).mockResolvedValue({ role: 'user' } as never);
  const response = await GET(new NextRequest('http://localhost/api/admin/content?chapterId=chapter&history=1'));
  expect(response.status).toBe(403);
  expect(prisma.adminAuditLog.findMany).not.toHaveBeenCalled();
});
