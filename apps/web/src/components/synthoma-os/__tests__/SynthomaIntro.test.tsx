import { act, fireEvent, render, screen } from '@testing-library/react';
import LandingIntroPage from '../../../../app/landing-intro/page';
import FirstVisitRedirectClient from '../../../../app/components/FirstVisitRedirectClient';
import UiLayerProvider from '../../ui-layer/UiLayerProvider';
import * as intro from '../../../lib/intro';

jest.mock('../../../lib/intro', () => ({ ...jest.requireActual('../../../lib/intro'), isIntroCompleteForDocument: jest.fn(), completeIntroForDocument: jest.fn() }));

jest.mock('next/navigation', () => ({ useRouter: jest.fn(), usePathname: jest.fn() }));
const { useRouter, usePathname } = require('next/navigation');

describe('Synthoma intro integration', () => {
  const replace = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    replace.mockClear();
    jest.mocked(intro.isIntroCompleteForDocument).mockReturnValue(false);
    jest.mocked(intro.completeIntroForDocument).mockImplementation(() => { jest.mocked(intro.isIntroCompleteForDocument).mockReturnValue(true); });
    window.history.replaceState({}, '', '/');
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

  it('shows the intro on a fresh visit even if old storage marks it complete', () => {
    const first = render(<FirstVisitRedirectClient />);
    expect(replace).toHaveBeenCalledWith('/landing-intro');
    expect(document.documentElement).not.toHaveAttribute('data-synthoma-intro-pending');
    first.unmount();

    replace.mockClear();
    localStorage.setItem(intro.SYNTHOMA_INTRO_STORAGE_KEY, intro.SYNTHOMA_INTRO_VERSION);
    render(<FirstVisitRedirectClient />);
    expect(replace).toHaveBeenCalledWith('/landing-intro');
    expect(document.documentElement).not.toHaveAttribute('data-synthoma-intro-pending');
  });

  it('offers one final entry action without looping on return', () => {
    render(<LandingIntroPage />);
    for (const delay of [650, 900, 1200, 900]) act(() => jest.advanceTimersByTime(delay));
    expect(screen.getAllByRole('button')).toHaveLength(1);
    fireEvent.click(screen.getByRole('button', { name: 'VSTOUPIT' }));
    expect(intro.isIntroCompleteForDocument()).toBe(true);
    expect(replace).toHaveBeenCalledWith('/');
    replace.mockClear();
    render(<FirstVisitRedirectClient />);
    expect(replace).not.toHaveBeenCalled();
  });

  it('treats browser Back as closing the intro layer', () => {
    window.history.replaceState({}, '', '/landing-intro');
    render(<UiLayerProvider><LandingIntroPage /></UiLayerProvider>);

    fireEvent.popState(window);

    expect(intro.isIntroCompleteForDocument()).toBe(true);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('does not offer replay or create media audio', () => {
    render(<LandingIntroPage />);
    for (const delay of [650, 900, 1200, 900]) act(() => jest.advanceTimersByTime(delay));
    expect(screen.queryByRole('button', { name: 'SPUSTIT ZNOVU' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'VSTOUPIT' })).toBeEnabled();
    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(screen.queryByText('Dveře musí mít kliku z obou stran.')).not.toBeInTheDocument();
    expect(document.querySelectorAll('audio')).toHaveLength(0);
  });
});
