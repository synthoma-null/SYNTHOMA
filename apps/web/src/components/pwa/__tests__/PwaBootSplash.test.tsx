import { act, render } from '@testing-library/react';
import PwaBootSplash from '../PwaBootSplash';

describe('PwaBootSplash', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('stays hidden in a regular browser tab', () => {
    (window.matchMedia as jest.Mock).mockReturnValue({ matches: false });
    const { container } = render(<PwaBootSplash />);
    expect(container.firstChild).toHaveAttribute('data-visible', 'false');
  });

  it('shows the official logo in standalone mode and never hangs', () => {
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({ matches: query.includes('standalone') }));
    const { container } = render(<PwaBootSplash />);
    expect(container.firstChild).toHaveAttribute('data-visible', 'true');
    expect(container.querySelector('img')).toHaveAttribute('src', '/assets/background_logo.png');
    act(() => jest.advanceTimersByTime(2500));
    expect(container.firstChild).toHaveAttribute('data-visible', 'false');
  });
});
