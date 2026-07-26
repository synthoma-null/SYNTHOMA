import React from 'react';
import { render, screen } from '@testing-library/react';
import ChapterPage from './page';
import { auth } from '../../../auth';
import { getContentAccess } from '../../../src/server/economy';
import { notFound } from 'next/navigation';

jest.mock('../../../auth', () => ({ auth: jest.fn() }));
jest.mock('next-auth/react', () => ({ useSession: () => ({ data: null, status: 'unauthenticated' }) }));
jest.mock('../../../src/server/economy', () => ({ getContentAccess: jest.fn() }));
jest.mock('../../../src/server/runtimeDatabase', () => ({
  reportRuntimeDatabaseError: jest.fn(() => ({ correlationId: 'chapter-page-correlation-1' })),
}));
jest.mock('../../../src/components/access/ContentPurchaseDialog', () => ({
  __esModule: true,
  default: () => <div data-testid="purchase-dialog" />,
}));
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => { throw new Error('NEXT_NOT_FOUND'); }),
  permanentRedirect: jest.fn((target: string) => { throw new Error(`NEXT_REDIRECT:${target}`); }),
  useRouter: jest.fn(() => ({ refresh: jest.fn(), replace: jest.fn() })),
}));

function params(id: string) {
  return { params: Promise.resolve({ id }) };
}

function access(overrides: Record<string, unknown> = {}) {
  return {
    contentType: 'chapter',
    contentId: '0-4-defragmentation',
    state: 'locked',
    reason: 'purchase_required',
    canAccess: false,
    canPurchase: true,
    mnemCost: 64,
    title: '0-4 [DEFRAGMENTATION]',
    purchasePackageIds: ['act-1'],
    prerequisiteChapterId: null,
    ...overrides,
  };
}

describe('/chapter/[id] server route contract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue(null);
  });

  it('renders free and owned chapters as semantic server HTML', async () => {
    const freeChapter = await ChapterPage(params('0-0-null'));
    const renderedFree = render(freeChapter);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('article', { name: '0-0 [NULL]' })).toHaveTextContent('Nikdo v Synthomě přesně neví');
    expect(auth).not.toHaveBeenCalled();
    expect(getContentAccess).not.toHaveBeenCalled();
    const structured = renderedFree.container.querySelector('script[type="application/ld+json"]');
    const structuredData = JSON.parse(structured?.textContent ?? '{}');
    expect(structuredData['@graph'][0]).toMatchObject({
      '@type': 'Chapter', isAccessibleForFree: true, inLanguage: 'cs', isPartOf: { '@type': 'Book' },
    });
    expect(structuredData['@graph']).toEqual(expect.arrayContaining([
      expect.objectContaining({ '@type': 'CreativeWork' }),
      expect.objectContaining({ '@type': 'BreadcrumbList' }),
    ]));
    renderedFree.unmount();

    const englishChapter = await ChapterPage({ params: Promise.resolve({ id: '0-0-null' }), searchParams: Promise.resolve({ locale: 'en' }) });
    const renderedEnglish = render(englishChapter);
    expect(screen.getByRole('article', { name: '0-0 [NULL]' })).toHaveAttribute('lang', 'en');
    expect(screen.getByRole('article', { name: '0-0 [NULL]' })).toHaveTextContent('No one in Synthoma knows exactly');
    expect(screen.getByRole('link', { name: 'BACK LIBRARY' })).toHaveAttribute('href', '/books?locale=en');
    expect(screen.getByRole('link', { name: 'PREVIOUS' })).toHaveAttribute('href', '/chapter/0-inf-restart?locale=en');
    expect(screen.queryByRole('link', { name: 'NEXT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Další' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Settings' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Read chapter aloud' })).toHaveTextContent('TTS');
    renderedEnglish.unmount();

    (getContentAccess as jest.Mock).mockResolvedValue(access({ state: 'owned', canAccess: true, canPurchase: false }));
    const ownedChapter = await ChapterPage(params('0-4-defragmentation'));
    render(ownedChapter);
    expect(screen.getByRole('article', { name: '0-4 [DEFRAGMENTATION]' })).toHaveTextContent('Defragmentace neznamená uzdravení');
  });

  it('shows an explicit state instead of Czech fallback when English is unavailable', async () => {
    const result = await ChapterPage({
      params: Promise.resolve({ id: '0-4-defragmentation' }),
      searchParams: Promise.resolve({ locale: 'en' }),
    });
    render(result);
    expect(screen.getByText('English translation is not available yet.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'OPEN CZECH VERSION' })).toHaveAttribute('href', '/chapter/0-4-defragmentation');
    expect(screen.queryByText(/Defragmentace neznamená uzdravení/)).not.toBeInTheDocument();
    expect(getContentAccess).not.toHaveBeenCalled();
  });

  it('renders purchase and unavailable states for known chapters', async () => {
    (getContentAccess as jest.Mock).mockResolvedValueOnce(access());
    const locked = await ChapterPage(params('0-4-defragmentation'));
    const rendered = render(locked);
    expect(screen.getByRole('button', { name: 'ODEMKNOUT ZA 64 MNEM' })).toBeInTheDocument();
    expect(rendered.container).not.toHaveTextContent('Defragmentace neznamená uzdravení');
    rendered.unmount();

    const unavailable = await ChapterPage(params('0-12-conflict'));
    render(unavailable);
    expect(screen.getByText('Fragment je evidovaný, ale ještě nebyl publikován.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /ODEMKNOUT/ })).not.toBeInTheDocument();
  });

  it('keeps a known chapter out of 404 when database access fails', async () => {
    (getContentAccess as jest.Mock).mockRejectedValue(Object.assign(new Error('database unavailable'), { code: 'P2022' }));

    const result = await ChapterPage(params('0-4-defragmentation'));
    render(result);

    expect(screen.getByText('LOG [CHAPTER_ACCESS]')).toBeInTheDocument();
    expect(screen.getByText('REF chapter-page-correlation-1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ZKUSIT ZNOVU' })).toBeInTheDocument();
    expect(notFound).not.toHaveBeenCalled();
  });

  it('returns a real 404 only for an unknown chapter', async () => {
    await expect(ChapterPage(params('unknown-chapter'))).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
    expect(getContentAccess).not.toHaveBeenCalled();
  });
});
