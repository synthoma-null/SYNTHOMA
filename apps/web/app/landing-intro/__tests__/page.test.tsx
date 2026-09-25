import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../page';
import { LangProvider } from '../../../src/lib/LangContext';
import { isIntroCompleteForDocument } from '../../../src/lib/intro';
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

function reveal() { for (const delay of [650, 900, 1200, 900]) act(() => jest.advanceTimersByTime(delay)); }

describe('LandingIntroPage', () => {
  it('uses the restored media layer, canonical wordmark and only the two slogan lines', () => {
    const { container } = render(<LandingIntroPage />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(document.querySelector('.synthoma-intro__slogan')).toHaveTextContent('Tma nikdy není opravdová.');
    expect(document.querySelector('.synthoma-intro__slogan')).toHaveTextContent('Je jen světlem, které se vzdalo smyslu.');
    expect(screen.queryByText('Dveře musí mít kliku z obou stran.')).not.toBeInTheDocument();
    expect(container.querySelector('video[src="/video/SYNTHOMA1.webm"]')).toBeInTheDocument();
    expect(container.querySelector('.synthoma-intro__circle')).not.toBeInTheDocument();
    expect(container.querySelector('[role="log"]')).not.toBeInTheDocument();
  });

  it('reveals the logo and quote before its single entry action', () => {
    render(<LandingIntroPage />);
    expect(screen.queryByRole('button', { name: 'PŘESKOČIT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(document.querySelector('main')).toHaveAttribute('data-phase', '0');
    reveal();
    expect(document.querySelector('main')).toHaveAttribute('data-phase', '4');
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByRole('button', { name: 'SPUSTIT ZNOVU' })).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'VSTOUPIT' })).toBeEnabled();
    expect(replace).not.toHaveBeenCalled();
  });

  it('remembers completion only in the current document', () => {
    render(<LandingIntroPage />);
    reveal();
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT' }));
    expect(isIntroCompleteForDocument()).toBe(true);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('offers immediate entry with reduced motion', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    render(<LandingIntroPage />);
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
    expect(document.querySelector('.synthoma-intro__slogan')).toHaveTextContent('Darkness is never real.');
    expect(document.querySelector('.synthoma-intro__slogan')).toHaveTextContent('It is only light that surrendered its meaning.');
    expect(screen.queryByText('Doors must have a handle on both sides.')).not.toBeInTheDocument();
    expect(screen.queryByRole('group', { name: /jazyk|language/i })).not.toBeInTheDocument();
  });

  it('never creates an autoplay audio element', () => {
    render(<LandingIntroPage />);
    expect(document.querySelectorAll('audio')).toHaveLength(0);
  });
});
