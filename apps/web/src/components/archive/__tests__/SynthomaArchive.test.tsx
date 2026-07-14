import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SynthomaArchive from '../SynthomaArchive';
import { LangContext } from '../../../lib/LangContext';
import { getT } from '../../../lib/i18n';
import type { ArchiveCard, ArchiveSnapshot } from '../../../lib/synthoma/archive/archiveTypes';

const mockResolve = jest.fn().mockResolvedValue([]);
const mockAccess = {
  contentType: 'archive_record' as const,
  contentId: 'record-one',
  state: 'free' as const,
  reason: 'catalog_free' as const,
  canAccess: true,
  canPurchase: false,
  mnemCost: null,
  title: 'Záznam jedna',
  purchasePackageIds: [],
  prerequisiteChapterId: null,
};

jest.mock('next/dynamic', () => () => function DynamicArchiveChild() { return null; });
jest.mock('next-auth/react', () => ({ useSession: () => ({ data: null, status: 'unauthenticated' }) }));
jest.mock('../../synthoma-os/SynthomaMediaLayer', () => ({ __esModule: true, default: () => null }));
jest.mock('../../access/AccessProvider', () => ({
  useAccess: () => ({ resolve: mockResolve, getCachedAccess: () => mockAccess }),
}));
jest.mock('../../../lib/synthoma/archive/useArchiveSnapshot', () => ({ useArchiveSnapshot: jest.fn() }));

const { useArchiveSnapshot } = require('../../../lib/synthoma/archive/useArchiveSnapshot');

const card: ArchiveCard = {
  id: 'record-one',
  category: 'základ',
  title: 'Záznam jedna',
  teaser: 'Bezpečný náhled.',
  body: ['Plný český obsah.'],
  access: { mode: 'free', visibility: 'full', requiredChapterId: null, requiredChapterTitle: null, mnemCost: 0, label: 'Dostupné' },
};

const snapshot: ArchiveSnapshot = {
  cards: [card],
  progress: [],
  profile: { mnemBalance: 0, isAuthenticated: false },
  whispers: [],
  cyklus: { findings: [], metaUnlocks: [], activeRun: false, historyCount: 0 },
  run: { activeRun: false },
  loading: false,
  error: null,
};

describe('SynthomaArchive localization and dialog integration', () => {
  beforeEach(() => {
    useArchiveSnapshot.mockReturnValue(snapshot);
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
  });

  it('renders the Czech Archive without legacy English section labels', () => {
    render(<SynthomaArchive initialCards={[card]} />);
    expect(screen.getByRole('heading', { name: 'Co systém uchoval z tebe' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'ZÁZNAMY' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'SBÍRKA KARET' })).toBeInTheDocument();
    expect(screen.queryByText(/RECOVERED RECORDS|WHISPER CHANNEL|CYCLE MEMORY/)).not.toBeInTheDocument();
  });

  it('preserves the English Archive locale', () => {
    render(
      <LangContext.Provider value={{ lang: 'en', setLang: jest.fn(), t: getT('en') }}>
        <SynthomaArchive initialCards={[card]} />
      </LangContext.Provider>,
    );
    expect(screen.getByRole('heading', { name: 'What the system retained from you' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'RECORDS' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'CARD COLLECTION' })).toBeInTheDocument();
  });

  it('returns focus to the opening card and removes scroll lock after close', async () => {
    render(<SynthomaArchive initialCards={[card]} />);
    const trigger = screen.getByRole('button', { name: /Záznam jedna, DOSTUPNÉ/ });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Záznam jedna' })).toBeInTheDocument();
    expect(document.body).toHaveClass('synthoma-dialog-lock');
    fireEvent.click(screen.getByRole('button', { name: 'Zavřít detail karty' }));
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Záznam jedna' })).not.toBeInTheDocument());
    expect(document.body).not.toHaveClass('synthoma-dialog-lock');
    expect(trigger).toHaveFocus();
  });
});
