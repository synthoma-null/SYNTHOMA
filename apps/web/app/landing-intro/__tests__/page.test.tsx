import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../page';
import { LangProvider } from '../../../src/lib/LangContext';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../../src/lib/intro';
import { resetUiPreferences, updateUiPreferences } from '../../../src/lib/uiPreferences';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
  resetUiPreferences();
});

afterEach(() => {
  act(() => jest.runOnlyPendingTimers());
  resetUiPreferences();
  jest.useRealTimers();
});

function finishAutomaticSequence() {
  act(() => jest.advanceTimersByTime(650));
  act(() => jest.advanceTimersByTime(800));
  act(() => jest.advanceTimersByTime(1050));
}

describe('LandingIntroPage', () => {
  it('uses the restored media layer, canonical wordmark and only the two slogan lines', () => {
    const { container } = render(<LandingIntroPage />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(screen.getByText('Tma nikdy není opravdová.')).toBeInTheDocument();
    expect(screen.getByText('Je jen světlem, které se vzdalo smyslu.')).toBeInTheDocument();
    expect(screen.queryByText('Dveře musí mít kliku z obou stran.')).not.toBeInTheDocument();
    expect(container.querySelector('video[src="/video/SYNTHOMA1.webm"]')).toBeInTheDocument();
    expect(container.querySelector('.synthoma-intro__circle')).not.toBeInTheDocument();
    expect(container.querySelector('[role="log"]')).not.toBeInTheDocument();
  });

  it('is skippable immediately and reveals entry after the short sequence', () => {
    render(<LandingIntroPage />);
    expect(screen.getByRole('button', { name: 'PŘESKOČIT' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: 'VSTOUPIT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'SPUSTIT ZNOVU' })).not.toBeInTheDocument();

    finishAutomaticSequence();

    expect(screen.getByRole('button', { name: 'VSTOUPIT' })).toBeEnabled();
    expect(replace).not.toHaveBeenCalled();
  });

  it('stores the versioned completion key on entry', () => {
    render(<LandingIntroPage />);
    finishAutomaticSequence();
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT' }));
    expect(localStorage.getItem(SYNTHOMA_INTRO_STORAGE_KEY)).toBe(SYNTHOMA_INTRO_VERSION);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('uses a short static reveal for reduced motion', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    render(<LandingIntroPage />);
    act(() => jest.advanceTimersByTime(240));
    expect(screen.getByRole('button', { name: 'VSTOUPIT' })).toBeInTheDocument();
    expect(document.querySelector('main')).toHaveAttribute('data-motion', 'reduced');
  });

  it('shows the final static state immediately when motion is off', () => {
    updateUiPreferences({ motionMode: 'off', backgroundMotion: 'off' });
    render(<LandingIntroPage />);
    expect(document.querySelector('main')).toHaveAttribute('data-motion', 'off');
    expect(screen.getByRole('button', { name: 'VSTOUPIT' })).toBeInTheDocument();
    expect(document.querySelector('video')).not.toBeInTheDocument();
  });

  it('renders English text without the removed second motto', () => {
    localStorage.setItem('synthoma_lang', 'en');
    render(<LangProvider><LandingIntroPage /></LangProvider>);
    expect(screen.getByText('Darkness is never real.')).toBeInTheDocument();
    expect(screen.getByText('It is only light that surrendered its meaning.')).toBeInTheDocument();
    expect(screen.queryByText('Doors must have a handle on both sides.')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /jazyk|language/i })).not.toBeInTheDocument();
  });

  it('never creates an autoplay audio element', () => {
    render(<LandingIntroPage />);
    expect(document.querySelectorAll('audio')).toHaveLength(0);
  });
});
