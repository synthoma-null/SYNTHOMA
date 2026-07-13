import React from 'react';
import { render, screen } from '@testing-library/react';
import ChapterPage from './page';
import { auth } from '../../../auth';
import { getContentAccess } from '../../../src/server/economy';
import { notFound, redirect } from 'next/navigation';

jest.mock('../../../auth', () => ({ auth: jest.fn() }));
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
  redirect: jest.fn((target: string) => { throw new Error(`NEXT_REDIRECT:${target}`); }),
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

  it('redirects free and owned chapters to Reader', async () => {
    (getContentAccess as jest.Mock).mockResolvedValue(access({ state: 'free', canAccess: true, canPurchase: false }));
    await expect(ChapterPage(params('0-0-null'))).rejects.toThrow('NEXT_REDIRECT:/reader?chapter=0-0-null');

    (getContentAccess as jest.Mock).mockResolvedValue(access({ state: 'owned', canAccess: true, canPurchase: false }));
    await expect(ChapterPage(params('0-4-defragmentation'))).rejects.toThrow('NEXT_REDIRECT:/reader?chapter=0-4-defragmentation');
    expect(redirect).toHaveBeenCalledTimes(2);
  });

  it('renders purchase and unavailable states for known chapters', async () => {
    (getContentAccess as jest.Mock).mockResolvedValueOnce(access());
    const locked = await ChapterPage(params('0-4-defragmentation'));
    const rendered = render(locked);
    expect(screen.getByRole('button', { name: 'ODEMKNOUT ZA 64 MNEM' })).toBeInTheDocument();
    rendered.unmount();

    (getContentAccess as jest.Mock).mockResolvedValueOnce(access({ state: 'unavailable', canPurchase: false, mnemCost: null }));
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
