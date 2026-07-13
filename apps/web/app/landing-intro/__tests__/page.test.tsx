import { render, screen, fireEvent } from '@testing-library/react';
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
  jest.clearAllMocks();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
    })),
  });
});

describe('LandingIntroPage', () => {
  it('renders the SYNTHOMA wordmark and the canonical motto', () => {
    render(<LandingIntroPage />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
    expect(screen.getByText('Tma nikdy není opravdová, je jen světlem, které se vzdalo smyslu.')).toBeInTheDocument();
  });

  it('shows all boot lines when reduced motion is preferred', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })),
    });
    render(<LandingIntroPage />);
    expect(screen.getByText('SYNTHOMA OS: READY')).toBeInTheDocument();
  });

  it('does not render a skip button', () => {
    render(<LandingIntroPage />);
    expect(screen.queryByRole('button', { name: 'PŘESKOČIT' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'POKRAČOVAT' })).toBeInTheDocument();
  });

  it('renders sarcastic system boot logs', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })),
    });
    render(<LandingIntroPage />);
    expect(screen.getByText('SENSE OF HOPE: NOT FOUND')).toBeInTheDocument();
    expect(screen.getByText('SARCASM MODULE: DEPLOYED BY POPULAR DEMAND')).toBeInTheDocument();
  });

  it('navigates to home on manual enter', () => {
    render(<LandingIntroPage />);
    for (let i = 0; i < 8; i += 1) {
      fireEvent.click(screen.getByRole('button', { name: 'POKRAČOVAT' }));
    }
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT DO SYSTÉMU' }));
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('reads the intro storage version once', () => {
    render(<LandingIntroPage />);
    expect(readStorage).toHaveBeenCalledTimes(1);
  });
});
