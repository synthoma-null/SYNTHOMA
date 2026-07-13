import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../../../../app/landing-intro/page';
import FirstVisitRedirectClient from '../../../../app/components/FirstVisitRedirectClient';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../../lib/intro';

jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
const { useRouter } = require('next/navigation');

describe('Synthoma intro', () => {
  const replace = jest.fn();
  let store: Record<string, string>;

  beforeEach(() => {
    jest.useFakeTimers();
    store = {};
    replace.mockClear();
    useRouter.mockReturnValue({ replace });
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: false, media: query, addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }));
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => store[key] ?? null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => { store[key] = value; });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function finishAutomaticSequence() {
    for (let index = 0; index < 8; index += 1) {
      act(() => jest.advanceTimersByTime(1400));
    }
  }

  it('redirects only when the current intro version has not been seen', () => {
    const first = render(<FirstVisitRedirectClient />);
    expect(replace).toHaveBeenCalledWith('/landing-intro');
    first.unmount();
    replace.mockClear();
    store[SYNTHOMA_INTRO_STORAGE_KEY] = SYNTHOMA_INTRO_VERSION;
    render(<FirstVisitRedirectClient />);
    expect(replace).not.toHaveBeenCalled();
  });

  it('plays Czech system logs automatically but waits for manual entry', () => {
    render(<LandingIntroPage />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(screen.getByText('Subjekt detekován.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' })).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();

    finishAutomaticSequence();

    expect(screen.getByText('Trpělivě pouze proto, že neumí odejít.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' })).toBeEnabled();
    act(() => jest.advanceTimersByTime(30000));
    expect(replace).not.toHaveBeenCalled();
  });

  it('enters only after the final manual action and never creates audio', () => {
    render(<LandingIntroPage />);
    expect(document.querySelectorAll('audio')).toHaveLength(0);
    expect(screen.queryByRole('button', { name: 'PŘESKOČIT' })).not.toBeInTheDocument();
    finishAutomaticSequence();
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' }));
    expect(store[SYNTHOMA_INTRO_STORAGE_KEY]).toBe(SYNTHOMA_INTRO_VERSION);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('supports keyboard entry only after the automatic sequence', () => {
    render(<LandingIntroPage />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(replace).not.toHaveBeenCalled();
    finishAutomaticSequence();
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('shows a shortened static sequence for reduced motion', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query.includes('reduced-motion'), media: query, addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }));
    render(<LandingIntroPage />);
    expect(screen.getByText('Subjekt detekován.')).toBeInTheDocument();
    expect(screen.getByText('Jméno nenalezeno.')).toBeInTheDocument();
    expect(screen.getByText('SYNTHOMA čeká.')).toBeInTheDocument();
    expect(screen.queryByText('Obnova zahájena.')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' })).toBeInTheDocument();
  });

  it('keeps the sequence usable when its decorative video fails', () => {
    render(<LandingIntroPage />);
    fireEvent.error(document.querySelector('video') as HTMLVideoElement);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(screen.getByText('Subjekt detekován.')).toBeInTheDocument();
  });
});
