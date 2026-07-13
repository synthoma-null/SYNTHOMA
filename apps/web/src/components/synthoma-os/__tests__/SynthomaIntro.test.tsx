import { fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../../../../app/landing-intro/page';
import FirstVisitRedirectClient from '../../../../app/components/FirstVisitRedirectClient';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../../lib/intro';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
const { useRouter } = require('next/navigation');

describe('Synthoma intro', () => {
  const replace = jest.fn();
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    replace.mockClear();
    useRouter.mockReturnValue({ replace });
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: false, media: query, addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }));
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
  });

  afterEach(() => jest.restoreAllMocks());

  it('redirects only when the current intro version has not been seen', () => {
    const first = render(<FirstVisitRedirectClient />);
    expect(replace).toHaveBeenCalledWith('/landing-intro');
    first.unmount();
    replace.mockClear();
    store[SYNTHOMA_INTRO_STORAGE_KEY] = SYNTHOMA_INTRO_VERSION;
    render(<FirstVisitRedirectClient />);
    expect(replace).not.toHaveBeenCalled();
  });

  it('requires manual enter, writes the version and never creates audio', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query.includes('reduced-motion'), media: query, addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }));
    render(<LandingIntroPage />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(0);
    expect(screen.queryByRole('button', { name: 'PŘESKOČIT' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT DO SYSTÉMU' }));
    expect(store[SYNTHOMA_INTRO_STORAGE_KEY]).toBe(SYNTHOMA_INTRO_VERSION);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('supports keyboard continuation', () => {
    render(<LandingIntroPage />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByText(/MEMORY CHANNEL: CONNECTING/)).toBeInTheDocument();
  });

  it('shows a static complete sequence for reduced motion', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query.includes('reduced-motion'), media: query, addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }));
    render(<LandingIntroPage />);
    expect(screen.getByText(/SYNTHOMA OS: READY/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT DO SYSTÉMU' })).toBeInTheDocument();
  });

  it('keeps the sequence usable when its decorative video fails', () => {
    render(<LandingIntroPage />);
    fireEvent.error(document.querySelector('video') as HTMLVideoElement);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'POKRAČOVAT' })).toBeEnabled();
  });
});
