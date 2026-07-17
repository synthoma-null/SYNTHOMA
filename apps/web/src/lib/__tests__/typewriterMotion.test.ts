import { runTypewriter } from '../typewriter';
import { updateUiPreferences } from '../uiPreferences';

describe('typewriter motion contract', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it('renders immediately when motion is off', () => {
    updateUiPreferences({ motionMode: 'off' });
    const host = document.createElement('div');
    const done = jest.fn();
    runTypewriter({ text: 'SYNTHOMA', host, getDurationMs: () => 5000, onDone: done });
    expect(host).toHaveTextContent('SYNTHOMA');
    expect(host).not.toHaveClass('tw-running');
    expect(done).toHaveBeenCalledTimes(1);
  });

  it('finishes a running text when motion is disabled', () => {
    updateUiPreferences({ motionMode: 'full' });
    const host = document.createElement('div');
    const done = jest.fn();
    runTypewriter({ text: 'NULL-1', host, getDurationMs: () => 5000, onDone: done });
    expect(host).toHaveClass('tw-running');
    updateUiPreferences({ motionMode: 'off' });
    expect(host).toHaveTextContent('NULL-1');
    expect(host).not.toHaveClass('tw-running');
    expect(done).toHaveBeenCalledTimes(1);
  });
});
