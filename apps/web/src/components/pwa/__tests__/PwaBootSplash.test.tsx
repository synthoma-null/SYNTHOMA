import { act, render } from '@testing-library/react';
import PwaBootSplash, {
  PWA_SPLASH_MAX_VISIBLE_MS,
  PWA_SPLASH_MIN_VISIBLE_MS,
} from '../PwaBootSplash';

describe('PwaBootSplash', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    document.documentElement.classList.remove('pwa-ready');
    delete document.documentElement.dataset.pwaLaunch;
    document.body.innerHTML = `
      <div id="pwa-boot-splash" aria-hidden="true">
        <img src="/assets/background_logo.png" alt="" />
      </div>
      <div id="app-shell">app</div>
    `;
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    document.documentElement.classList.remove('pwa-ready');
    delete document.documentElement.dataset.pwaLaunch;
  });

  it('does not activate the boot sequence in a regular browser tab', () => {
    render(<PwaBootSplash />);
    act(() => jest.advanceTimersByTime(PWA_SPLASH_MAX_VISIBLE_MS));
    expect(document.documentElement).not.toHaveClass('pwa-ready');
  });

  it('waits for the official logo and minimum display time before revealing the app', async () => {
    document.documentElement.dataset.pwaLaunch = 'true';
    const image = document.querySelector<HTMLImageElement>('#pwa-boot-splash img');
    let resolveDecode = () => {};
    image!.decode = jest.fn(() => new Promise<void>((resolve) => {
      resolveDecode = resolve;
    }));

    render(<PwaBootSplash />);
    act(() => jest.advanceTimersByTime(PWA_SPLASH_MIN_VISIBLE_MS));
    expect(document.documentElement).not.toHaveClass('pwa-ready');

    await act(async () => resolveDecode());
    expect(document.documentElement).toHaveClass('pwa-ready');
  });

  it('reveals the app at the safety timeout when image decoding hangs', () => {
    document.documentElement.dataset.pwaLaunch = 'true';
    const image = document.querySelector<HTMLImageElement>('#pwa-boot-splash img');
    image!.decode = jest.fn(() => new Promise<void>(() => {}));

    render(<PwaBootSplash />);
    act(() => jest.advanceTimersByTime(PWA_SPLASH_MAX_VISIBLE_MS));
    expect(document.documentElement).toHaveClass('pwa-ready');
  });
});
