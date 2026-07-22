import { act, fireEvent, renderHook } from '@testing-library/react';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useChoiceHandlers } from '../useChoiceHandlers';
import { transformChoicesToButtons } from '../../lib/typewriterContent';

function setup(html: string, storyCache = '') {
  const host = document.createElement('div');
  host.innerHTML = transformChoicesToButtons(html);
  document.body.appendChild(host);
  const router = { push: jest.fn() } as unknown as AppRouterInstance;
  const states: string[] = [];
  const renderNextSegment = jest.fn();
  const persistChoiceState = jest.fn();
  const lockChoiceGroup = jest.fn((chosen: HTMLElement) => {
    chosen.closest('.choice-group')?.classList.add('choices-locked');
  });
  const hostRef = { current: host };
  const storyCacheRef = { current: storyCache };
  const continueRef = { current: null as (() => void) | null };
  const { result } = renderHook(() => useChoiceHandlers({
    hostRef,
    storyCacheRef,
    continueRef,
    router,
    srcUrl: '/data/SYNTHOMAINFO.html',
    lockChoiceGroup,
    scoreFromNode: jest.fn(),
    persistChoiceState,
    announce: jest.fn(),
    renderNextSegment,
    setFlowState: (state) => states.push(state),
  }));
  act(() => result.current.bindChoiceHandlers());
  return { host, router, states, renderNextSegment, persistChoiceState };
}

describe('useChoiceHandlers flow barrier', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    jest.useRealTimers();
  });

  it('renders only the selected data-next branch', () => {
    const { host, states, renderNextSegment, persistChoiceState } = setup(
      '<p class="choice" data-next="left" data-tags="N">Left</p><p class="choice" data-next="right" data-tags="S">Right</p>',
      '<section class="story-block" id="left"><p>LEFT BRANCH</p></section><section class="story-block" id="right"><p>RIGHT BRANCH</p></section>',
    );

    fireEvent.click(host.querySelectorAll('.choice-link')[0]!);

    expect(persistChoiceState).toHaveBeenCalledTimes(1);
    expect(renderNextSegment).toHaveBeenCalledWith(expect.stringContaining('LEFT BRANCH'), 'typed');
    expect(renderNextSegment).not.toHaveBeenCalledWith(expect.stringContaining('RIGHT BRANCH'), expect.anything());
    expect(states).toContain('RESOLVING_CHOICE');
  });

  it('shows a controlled error and keeps waiting for a missing branch', () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { host, states, renderNextSegment, persistChoiceState } = setup(
      '<p class="choice" data-next="missing">Continue</p>',
    );

    fireEvent.click(host.querySelector('.choice-link')!);

    expect(host.querySelector('[role="alert"]')).toHaveTextContent('CHOICE_TARGET_MISSING');
    expect(renderNextSegment).not.toHaveBeenCalled();
    expect(persistChoiceState).not.toHaveBeenCalled();
    expect(states.at(-1)).toBe('WAITING_FOR_CHOICE');
    error.mockRestore();
  });

  it('navigates only after an href choice is persisted and confirmed', () => {
    jest.useFakeTimers();
    const { host, router, states, persistChoiceState } = setup(
      '<p class="choice" data-tags="T"><a class="choice-link" href="/chapter/next">Next</a></p>',
    );

    fireEvent.click(host.querySelector('.choice-link')!);

    expect(persistChoiceState).toHaveBeenCalledTimes(1);
    expect(states.at(-1)).toBe('CHAPTER_COMPLETE');
    expect(router.push).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(349));
    expect(router.push).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(router.push).toHaveBeenCalledWith('/chapter/next');
  });
});
