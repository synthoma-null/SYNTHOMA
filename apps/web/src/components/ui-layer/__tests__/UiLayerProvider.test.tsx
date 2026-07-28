import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import UiLayerProvider, { useUiLayer } from '../UiLayerProvider';

function Layer({
  id,
  label,
  onClosed,
}: {
  id: string;
  label: string;
  onClosed?: (() => void) | undefined;
}) {
  const [open, setOpen] = useState(true);
  const { closeLayer } = useUiLayer({
    id,
    type: 'test-dialog',
    open,
    onClose: () => {
      setOpen(false);
      onClosed?.();
    },
  });
  return open ? <div role="dialog" aria-label={label}><button onClick={closeLayer}>close {label}</button></div> : null;
}

function NestedLayers() {
  const [nested, setNested] = useState(false);
  return (
    <>
      <Layer id="archive-card" label="Archive card" />
      <button onClick={() => setNested(true)}>open nested</button>
      {nested ? <Layer id="purchase" label="Purchase" onClosed={() => setNested(false)} /> : null}
    </>
  );
}

describe('UiLayerProvider', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/archive');
    jest.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.classList.remove('synthoma-ui-layer-lock');
  });

  it('closes an archive card on Back without leaving the route', () => {
    render(<UiLayerProvider><Layer id="archive-card" label="Archive card" /></UiLayerProvider>);
    expect(window.location.pathname).toBe('/archive');

    fireEvent.popState(window);

    expect(screen.queryByRole('dialog', { name: 'Archive card' })).not.toBeInTheDocument();
    expect(window.location.pathname).toBe('/archive');
  });

  it('closes only the top nested layer and keeps its parent open', () => {
    render(<UiLayerProvider><NestedLayers /></UiLayerProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'open nested' }));

    fireEvent.popState(window);

    expect(screen.queryByRole('dialog', { name: 'Purchase' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Archive card' })).toBeInTheDocument();
  });

  it('uses the same top-layer order for Escape', () => {
    render(<UiLayerProvider><NestedLayers /></UiLayerProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'open nested' }));

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog', { name: 'Purchase' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Archive card' })).toBeInTheDocument();
  });

  it('does not intercept Back when no UI layer is open', () => {
    render(<UiLayerProvider><main>Archive</main></UiLayerProvider>);
    fireEvent.popState(window);
    expect(screen.getByText('Archive')).toBeInTheDocument();
    expect(window.history.back).not.toHaveBeenCalled();
  });
});
