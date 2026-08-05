import type { ManagedBook, ManagedChapter } from '@prisma/client';
import { mergeManagedContent, readManagedChapterDocument } from '../managedContent';

const now = new Date('2026-08-05T12:00:00.000Z');

function book(overrides: Partial<ManagedBook> = {}): ManagedBook {
  return {
    id: 'synthoma-null', isCustom: false, title: null, shortTitle: null,
    description: null, cover: null, language: null, sortOrder: null, status: null,
    visibility: 'published', accessPolicy: 'inherit', createdById: 'admin-1',
    updatedById: 'admin-1', createdAt: now, updatedAt: now, ...overrides,
  };
}

function chapter(overrides: Partial<ManagedChapter> = {}): ManagedChapter {
  return {
    id: '0-4-defragmentation', bookId: 'synthoma-null', isCustom: false,
    title: null, titleEn: null, ordinal: null, summary: null, sortOrder: null,
    visibility: 'published', accessPolicy: 'inherit', mnemCost: null,
    bodyHtml: null, bodyHtmlEn: null, createdById: 'admin-1', updatedById: 'admin-1',
    createdAt: now, updatedAt: now, ...overrides,
  };
}

describe('managed content catalog', () => {
  it('applies a whole-book unlock to inherited chapters', () => {
    const catalog = mergeManagedContent({ books: [book({ accessPolicy: 'free' })], chapters: [] });
    const paidChapter = catalog.chapters.find((item) => item.chapter.id === '0-4-defragmentation');
    expect(paidChapter?.chapter).toMatchObject({ accessPolicy: 'free', mnemCost: 0 });
  });

  it('lets a chapter override book access and disappear independently', () => {
    const catalog = mergeManagedContent({
      books: [book({ accessPolicy: 'free' })],
      chapters: [chapter({ accessPolicy: 'entitlement', visibility: 'hidden', mnemCost: 128 })],
    });
    const item = catalog.chapters.find((candidate) => candidate.chapter.id === '0-4-defragmentation');
    expect(item).toMatchObject({ visibility: 'hidden', accessPolicy: 'entitlement' });
    expect(item?.chapter).toMatchObject({ availability: 'unavailable', accessPolicy: 'entitlement', mnemCost: 128 });
  });

  it('adds a complete custom book and sanitizes its custom chapter when read', async () => {
    const catalog = mergeManagedContent({
      books: [book({ id: 'nova-kniha', isCustom: true, title: 'Nová kniha', shortTitle: 'NOVÁ' })],
      chapters: [chapter({
        id: 'nova-kapitola', bookId: 'nova-kniha', isCustom: true, title: '01. Začátek',
        ordinal: '01', accessPolicy: 'free', bodyHtml: '<section><p>Ahoj</p><script>alert(1)</script></section>',
      })],
    });
    const custom = catalog.chapters.find((item) => item.chapter.id === 'nova-kapitola');
    expect(catalog.books.find((item) => item.id === 'nova-kniha')?.title).toBe('Nová kniha');
    expect(custom?.chapter).toMatchObject({ route: '/chapter/nova-kapitola', accessPolicy: 'free' });
    const document = await readManagedChapterDocument(custom!, 'cs');
    expect(document.bodyHtml).toContain('<p>Ahoj</p>');
    expect(document.bodyHtml).not.toContain('<script');
  });
});
