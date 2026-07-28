import fs from 'node:fs';
import path from 'node:path';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UiLayerProvider from '../../ui-layer/UiLayerProvider';
import ReaderDialogController from '../ReaderDialogController';

function renderDialog() {
  return render(
    <UiLayerProvider>
      <div id="chapter-dialog-root">
        <p className="dialog-line" data-speaker="tova" data-tone="klidně, věcně">„Jsou tady.“</p>
      </div>
      <ReaderDialogController rootId="chapter-dialog-root" />
    </UiLayerProvider>,
  );
}

describe('ReaderDialogController', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/chapter/0-0-null');
  });

  afterEach(() => {
    document.body.classList.remove('synthoma-ui-layer-lock');
  });

  it('opens a body portal, announces the speaker and keeps the page locked', async () => {
    renderDialog();
    const line = screen.getByText('„Jsou tady.“');
    await waitFor(() => expect(line).toHaveAttribute('role', 'button'));

    fireEvent.click(line);

    const popup = screen.getByRole('dialog', { name: 'Tova Neonová' });
    expect(popup).toHaveTextContent('klidně, věcně');
    expect(popup.parentElement).toBe(document.body);
    expect(document.body).toHaveClass('synthoma-ui-layer-lock');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Zavřít informaci o dialogu' })).toHaveFocus());
  });

  it('supports keyboard activation and Escape with focus restore', async () => {
    renderDialog();
    const line = screen.getByText('„Jsou tady.“');
    await waitFor(() => expect(line).toHaveAttribute('tabindex', '0'));
    fireEvent.keyDown(line, { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(line).toHaveFocus());
  });

  it('treats browser Back as closing the popup without leaving the chapter', async () => {
    renderDialog();
    const line = screen.getByText('„Jsou tady.“');
    await waitFor(() => expect(line).toHaveAttribute('role', 'button'));
    fireEvent.click(line);

    fireEvent.popState(window);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/chapter/0-0-null');
    await waitFor(() => expect(line).toHaveFocus());
  });

  it('keeps the mobile sheet above the real shared navigation height', () => {
    const css = fs.readFileSync(path.join(process.cwd(), 'src/styles/book-reader-base.css'), 'utf8');
    expect(css).toContain('--reader-bottom-bar-height: var(--os-mobile-nav-height, 58px)');
    expect(css).toMatch(/bottom:\s*calc\(var\(--reader-bottom-bar-height\) \+ env\(safe-area-inset-bottom\) \+ 12px\)/);
    expect(css).toContain('z-index: var(--os-z-critical, 120)');
    expect(css).toContain('overflow-y: auto');
    expect(css).toContain('overscroll-behavior: contain');
  });
});
