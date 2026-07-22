import {
  PWA_INSTALL_COOLDOWN_MS,
  PWA_INSTALL_DISMISSED_KEY,
  activateWaitingServiceWorker,
  isInstallCooldownActive,
  isPwaCriticalPath,
  isStandaloneDisplay,
} from '../pwa';

describe('PWA runtime helpers', () => {
  afterEach(() => jest.restoreAllMocks());

  it('protects reader, Cyklus and authentication interactions from prompts and reloads', () => {
    expect(isPwaCriticalPath('/chapter/0-0-null')).toBe(true);
    expect(isPwaCriticalPath('/reader')).toBe(true);
    expect(isPwaCriticalPath('/cyklus/void')).toBe(true);
    expect(isPwaCriticalPath('/login')).toBe(true);
    expect(isPwaCriticalPath('/books')).toBe(false);
  });

  it('recognizes standalone and fullscreen display modes', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(display-mode: fullscreen)',
      media: query,
      onchange: null,
      addListener: jest.fn(), removeListener: jest.fn(), addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
    }));
    expect(isStandaloneDisplay()).toBe(true);
  });

  it('expires install dismissal after fourteen days', () => {
    const now = 2_000_000_000_000;
    window.localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, String(now - PWA_INSTALL_COOLDOWN_MS + 1));
    expect(isInstallCooldownActive(now)).toBe(true);
    window.localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, String(now - PWA_INSTALL_COOLDOWN_MS - 1));
    expect(isInstallCooldownActive(now)).toBe(false);
    expect(PWA_INSTALL_DISMISSED_KEY).toContain('install_dismissed');
  });

  it('activates a waiting worker with the Workbox update message', () => {
    const postMessage = jest.fn();
    expect(activateWaitingServiceWorker({ postMessage })).toBe(true);
    expect(postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(activateWaitingServiceWorker(null)).toBe(false);
  });
});
