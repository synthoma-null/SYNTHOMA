import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import PwaProvider, { usePwa } from '../PwaProvider';
import { PWA_INSTALL_DISMISSED_KEY, PWA_VISIT_COUNT_KEY } from '../../../lib/pwa';

function StateProbe() {
  const pwa = usePwa();
  return <output data-testid="state">{JSON.stringify({ installed: pwa.installed, canPromptInstall: pwa.canPromptInstall })}</output>;
}

describe('PwaProvider install flow', () => {
  const local = new Map<string, string>();
  const session = new Map<string, string>();

  beforeEach(() => {
    local.clear();
    session.clear();
    jest.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key) {
      return this === window.sessionStorage ? session.get(key) ?? null : local.get(key) ?? null;
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, key, value) {
      (this === window.sessionStorage ? session : local).set(key, value);
    });
    local.set(PWA_VISIT_COUNT_KEY, '1');
  });

  afterEach(() => jest.restoreAllMocks());

  function installEvent(outcome: 'accepted' | 'dismissed' = 'accepted') {
    const event = new Event('beforeinstallprompt') as Event & {
      prompt: jest.Mock<Promise<void>, []>;
      userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
    };
    event.prompt = jest.fn(async () => {});
    event.userChoice = Promise.resolve({ outcome, platform: 'web' });
    return event;
  }

  it('shows the custom prompt on a second visit and invokes the browser prompt only after a click', async () => {
    render(<PwaProvider><StateProbe /></PwaProvider>);
    const event = installEvent();
    act(() => window.dispatchEvent(event));
    expect(await screen.findByRole('dialog', { name: 'NAINSTALOVAT SYNTHOMU' })).toBeVisible();
    expect(event.prompt).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'NAINSTALOVAT' }));
    await waitFor(() => expect(event.prompt).toHaveBeenCalledTimes(1));
  });

  it('stores the cooldown after dismissal and hides after appinstalled', async () => {
    render(<PwaProvider><StateProbe /></PwaProvider>);
    act(() => window.dispatchEvent(installEvent('dismissed')));
    fireEvent.click(await screen.findByRole('button', { name: 'TEĎ NE' }));
    expect(Number(local.get(PWA_INSTALL_DISMISSED_KEY))).toBeGreaterThan(0);

    act(() => window.dispatchEvent(new Event('appinstalled')));
    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('"installed":true'));
    expect(screen.queryByRole('dialog', { name: 'NAINSTALOVAT SYNTHOMU' })).not.toBeInTheDocument();
  });

  it('does not offer installation while running in standalone mode', async () => {
    jest.mocked(window.matchMedia).mockImplementation((query) => ({
      matches: query === '(display-mode: standalone)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<PwaProvider><StateProbe /></PwaProvider>);
    act(() => window.dispatchEvent(installEvent()));

    await waitFor(() => expect(screen.getByTestId('state')).toHaveTextContent('"installed":true'));
    expect(screen.queryByRole('dialog', { name: 'NAINSTALOVAT SYNTHOMU' })).not.toBeInTheDocument();
  });

});
