import { render, screen } from '@testing-library/react';
import SynthomaWordmark from '../SynthomaWordmark';

jest.mock('../../../lib/glitchHeading', () => ({
  attachGlitchHeading: jest.fn(() => jest.fn()),
}));

const { attachGlitchHeading } = jest.requireMock('../../../lib/glitchHeading');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SynthomaWordmark', () => {
  it('renders the SYNTHOMA text for screen readers', () => {
    render(<SynthomaWordmark context="intro" />);
    expect(screen.getByRole('heading', { name: 'SYNTHOMA' })).toBeInTheDocument();
  });

  it('uses the requested context class', () => {
    const { container } = render(<SynthomaWordmark context="home" />);
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('synthoma-wordmark--home');
  });

  it('honors the animated prop and reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })),
    });
    render(<SynthomaWordmark context="compact" animated />);
    expect(attachGlitchHeading).not.toHaveBeenCalled();
  });

  it('attaches glitch effect when animated and motion allowed', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query: string) => ({
        matches: query !== '(prefers-reduced-motion: reduce)',
        media: query,
      })),
    });
    render(<SynthomaWordmark context="intro" animated />);
    expect(attachGlitchHeading).toHaveBeenCalled();
  });
});
