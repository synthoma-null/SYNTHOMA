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
      matches: query === '(prefers-reduced-motion: reduce)',
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
    render(<LandingIntroPage />);
    expect(screen.getByText('SYNTHOMA OS: READY')).toBeInTheDocument();
  });

  it('navigates to home on skip', () => {
    render(<LandingIntroPage />);
    fireEvent.click(screen.getByRole('button', { name: 'PŘESKOČIT' }));
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('reads the intro storage version once', () => {
    render(<LandingIntroPage />);
    expect(readStorage).toHaveBeenCalledTimes(1);
  });
});
