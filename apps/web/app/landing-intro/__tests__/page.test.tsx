import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../page';

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

  it('does not render skip or continuation controls during narration', () => {
    render(<LandingIntroPage />);
    expect(screen.queryByRole('button', { name: 'PŘESKOČIT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'POKRAČOVAT' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders all nine Czech logs and the final entry after about eleven seconds', () => {
    render(<LandingIntroPage />);
    finishAutomaticSequence();
    expect(screen.getAllByRole('article')).toHaveLength(9);
    expect(screen.getByText('Bezpečí se nepodařilo načíst.')).toBeInTheDocument();
    expect(screen.getByText('Používán převážně v propagačních materiálech.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT DO SYNTHOMY' })).toBeInTheDocument();
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
});
