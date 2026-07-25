import { renderReaderSegment } from '../readerSegmentRenderer';
import {
  DEFAULT_UI_PREFERENCES,
  UI_PREFERENCES_CHANGED_EVENT,
  UI_PREFERENCES_KEY,
  UI_PREFERENCES_VERSION,
} from '../uiPreferences';

function setup(html: string, mode: 'typed' | 'instant' = 'typed') {
  const host = document.createElement('div');
  const box = document.createElement('div');
  host.appendChild(box);
  const onDone = jest.fn();
  const result = renderReaderSegment({
    html,
    box,
    host,
    mode,
    helpers: {
      cleanupChoices: jest.fn(),
      bindChoiceHandlers: jest.fn(),
      revealChoicesStagger: jest.fn(),
    },
    onDone,
  });
  return { host, box, onDone, result };
}

function setPreferences(patch: Partial<typeof DEFAULT_UI_PREFERENCES>) {
  window.localStorage.setItem(UI_PREFERENCES_KEY, JSON.stringify({
    ...DEFAULT_UI_PREFERENCES,
    ...patch,
    version: UI_PREFERENCES_VERSION,
  }));
}

describe('renderReaderSegment flow barrier', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('instant completion reveals only the current segment and leaves continuation detached', () => {
    const { box, onDone } = setup(
      '<p>Text A</p><p class="choice" data-tags="N">A</p><p class="choice" data-tags="S">B</p><p>Text B</p>',
      'instant',
    );

    expect(box).toHaveTextContent('Text A');
    expect(box).not.toHaveTextContent('Text B');
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({
      remainderHtml: expect.stringContaining('Text B'),
    }));
  });

  it('stagger-reveals effects only after progressive typing completes', () => {
    const frames: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);

    const { box } = setup('<p><span class="fx-glitch" data-glitch="A">A</span><span class="fx-flicker">B</span></p>');
    frames.shift()?.(0);
    expect(box.querySelector('.is-revealing')).toBeNull();
    frames.shift()?.(100000);

    jest.advanceTimersByTime(0);
    expect(box.querySelector('.fx-glitch')).toHaveClass('is-revealing');
    expect(box.querySelector('.fx-flicker')).not.toHaveClass('is-revealing');
    jest.advanceTimersByTime(500);
    expect(box.querySelector('.fx-flicker')).toHaveClass('is-revealing');
  });

  it('does not burst-trigger effects for direct instant or resumed rendering', () => {
    const { box } = setup('<p class="fx-glitch" data-glitch="A">A</p>', 'instant');
    jest.runAllTimers();
    expect(box.querySelector('.fx-glitch')).not.toHaveClass('is-revealing');
  });

  it('settles without reveal effects when typing is skipped by a preference change', () => {
    const frames: FrameRequestCallback[] = [];
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    const { box } = setup('<p class="fx-glitch" data-glitch="A">A</p>');
    setPreferences({ typewriterSpeed: 'instant' });
    document.dispatchEvent(new Event(UI_PREFERENCES_CHANGED_EVENT));
    jest.runAllTimers();
    expect(box.querySelector('.fx-glitch')).not.toHaveClass('is-revealing');
  });

  it.each([
    ['no-animations', { motionMode: 'off' as const }],
    ['prefers-reduced-motion', { motionMode: 'reduced' as const }],
    ['text effects off', { textEffects: 'off' as const }],
  ])('does not trigger effects in %s mode', (_label, patch) => {
    setPreferences(patch);
    const { box } = setup('<p class="fx-glitch" data-glitch="A">A</p>');
    jest.runAllTimers();
    expect(box.querySelector('.fx-glitch')).not.toHaveClass('is-revealing');
  });
});
