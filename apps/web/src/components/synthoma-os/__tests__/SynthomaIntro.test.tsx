import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../../../../app/landing-intro/page';
import FirstVisitRedirectClient from '../../../../app/components/FirstVisitRedirectClient';
import UiLayerProvider from '../../ui-layer/UiLayerProvider';
import { SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION } from '../../../lib/intro';

jest.mock('next/navigation', () => ({ useRouter: jest.fn(), usePathname: jest.fn() }));
const { useRouter, usePathname } = require('next/navigation');

describe('Synthoma intro integration', () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    replace.mockClear();
    useRouter.mockReturnValue({ replace });
    usePathname.mockReturnValue('/');
    (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }));
    jest.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => jest.runOnlyPendingTimers());
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('redirects only when the current intro version has not been seen', () => {
    const first = render(<FirstVisitRedirectClient />);
    expect(replace).toHaveBeenCalledWith('/landing-intro');
    expect(document.documentElement).toHaveAttribute('data-synthoma-intro-pending', 'true');
    first.unmount();

    replace.mockClear();
    localStorage.setItem(SYNTHOMA_INTRO_STORAGE_KEY, SYNTHOMA_INTRO_VERSION);
    render(<FirstVisitRedirectClient />);
    expect(replace).not.toHaveBeenCalled();
    expect(document.documentElement).not.toHaveAttribute('data-synthoma-intro-pending');
  });

  it('can skip immediately and records completion', () => {
    render(<LandingIntroPage />);
    fireEvent.click(screen.getByRole('button', { name: 'PŘESKOČIT' }));
    expect(localStorage.getItem(SYNTHOMA_INTRO_STORAGE_KEY)).toBe(SYNTHOMA_INTRO_VERSION);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('treats browser Back as closing the intro layer', () => {
    window.history.replaceState({}, '', '/landing-intro');
    render(<UiLayerProvider><LandingIntroPage /></UiLayerProvider>);

    fireEvent.popState(window);

    expect(localStorage.getItem(SYNTHOMA_INTRO_STORAGE_KEY)).toBe(SYNTHOMA_INTRO_VERSION);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('does not offer replay or create media audio', () => {
    render(<LandingIntroPage />);
    for (let phase = 0; phase < 4; phase += 1) {
      act(() => jest.advanceTimersByTime(1700));
    }
    expect(screen.queryByRole('button', { name: 'SPUSTIT ZNOVU' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT' })).toBeEnabled();
    expect(document.querySelectorAll('audio')).toHaveLength(0);
  });
});
