import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../page';
import { LangProvider } from '../../../src/lib/LangContext';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../../src/lib/intro';

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
});

afterEach(() => {
  act(() => jest.runOnlyPendingTimers());
  jest.useRealTimers();
});

function finishAutomaticSequence() {
  for (let phase = 0; phase < 4; phase += 1) {
    act(() => jest.advanceTimersByTime(1700));
  }
}

describe('LandingIntroPage', () => {
  it('uses the real composition assets and the two canonical Czech lines', () => {
    const { container } = render(<LandingIntroPage />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(screen.getByText('Tma nikdy není opravdová.')).toBeInTheDocument();
    expect(screen.getByText('Je jen světlem, které se vzdalo smyslu.')).toBeInTheDocument();
    expect(screen.getByText('Dveře musí mít kliku z obou stran.')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/background_logo.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/background_title.png"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/assets/background_circle.png"]')).toBeInTheDocument();
  });

  it('is skippable immediately and reveals entry only after the sequence', () => {
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
    act(() => jest.advanceTimersByTime(450));
    expect(screen.getByRole('button', { name: 'VSTOUPIT' })).toBeInTheDocument();
    expect(document.querySelector('main')).toHaveAttribute('data-motion', 'reduced');
  });

  it('renders English text without a locale control', () => {
    localStorage.setItem('synthoma_lang', 'en');
    render(<LangProvider><LandingIntroPage /></LangProvider>);
    expect(screen.getByText('Darkness is never real.')).toBeInTheDocument();
    expect(screen.getByText('Doors must have a handle on both sides.')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /jazyk|language/i })).not.toBeInTheDocument();
  });

  it('never creates an autoplay audio element', () => {
    render(<LandingIntroPage />);
    expect(document.querySelectorAll('audio')).toHaveLength(0);
  });
});
