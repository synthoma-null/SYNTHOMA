import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../page';
import { LangProvider } from '../../../src/lib/LangContext';

const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

jest.mock('../../../src/lib/browser', () => ({
  readStorage: jest.fn(() => null),
  writeStorage: jest.fn(),
}));

jest.mock('../../../src/lib/typewriter', () => ({
  runTypewriter: jest.fn(() => jest.fn()),
}));

jest.mock('../../../src/components/synthoma-os/SynthomaMediaLayer', () => ({
  __esModule: true,
  default: () => <div data-testid="media-layer" />,
}));

const readStorage = jest.requireMock('../../../src/lib/browser').readStorage as jest.Mock;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  localStorage.clear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({ matches: false, media: query })),
  });
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

function finishAutomaticSequence() {
  for (let index = 0; index < 8; index += 1) {
    act(() => jest.advanceTimersByTime(1400));
  }
}

describe('LandingIntroPage', () => {
  it('renders the shared wordmark and exact Czech motto', () => {
    render(<LandingIntroPage />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(screen.getByText('Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.')).toBeInTheDocument();
  });

  it('keeps narration skippable without showing the final continuation early', () => {
    render(<LandingIntroPage />);
    expect(screen.getByRole('button', { name: 'PŘESKOČIT' })).toBeEnabled();
    expect(screen.queryByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'SPUSTIT ZNOVU' })).not.toBeInTheDocument();
  });

  it('renders all nine Czech logs and the final entry after about eleven seconds', () => {
    render(<LandingIntroPage />);
    finishAutomaticSequence();
    expect(screen.getAllByRole('article')).toHaveLength(9);
    expect(screen.getByText('Bezpečí se nepodařilo načíst.')).toBeInTheDocument();
    expect(screen.getByText('Používán převážně v propagačních materiálech.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'SPUSTIT ZNOVU' })).not.toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it('shows only the reduced static sequence when motion is limited', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)', media: query,
      })),
    });
    render(<LandingIntroPage />);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.getByText('SYNTHOMA čeká.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' })).toBeInTheDocument();
  });

  it('navigates only when the final entry is activated', () => {
    render(<LandingIntroPage />);
    finishAutomaticSequence();
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' }));
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('reads the intro storage version once', () => {
    render(<LandingIntroPage />);
    expect(readStorage).toHaveBeenCalledTimes(1);
  });

  it('restores the saved English intro without rendering a locale control', async () => {
    localStorage.setItem('synthoma_lang', 'en');
    render(<LangProvider><LandingIntroPage /></LangProvider>);

    expect(await screen.findByText('Subject detected.')).toBeInTheDocument();
    expect(screen.getByText('Darkness is never real. It is only light that has surrendered its meaning.')).toBeInTheDocument();
    expect(screen.queryByRole('group', { name: 'Jazyk rozhraní' })).not.toBeInTheDocument();
  });
});
