import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { createCyklusRun } from '../../../game/cyklus/cyklusEngine';
import CyklusMobileUtilityDock from '../CyklusMobileUtilityDock';

function MobileDockHarness() {
  const [open, setOpen] = useState(false);
  return (
    <CyklusMobileUtilityDock
      state={createCyklusRun(true)}
      open={open}
      confirmActivateId={null}
      onToggle={() => setOpen((value) => !value)}
      onClose={() => setOpen(false)}
      onConfirmActivate={jest.fn()}
      onActivate={jest.fn()}
    />
  );
}

describe('CyklusMobileUtilityDock', () => {
  it('owns one accessible KAPSA trigger and one shared pocket sheet', () => {
    render(<MobileDockHarness />);
    const trigger = screen.getByRole('button', { name: 'KAPSA, 0 předmětů' });
    expect(screen.getAllByRole('button', { name: 'KAPSA, 0 předmětů' })).toHaveLength(1);
    expect(trigger).toHaveAttribute('aria-controls', 'cyklus-mobile-pocket-panel');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    trigger.focus();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'KAPSA · 0' })).toHaveFocus();
    expect(screen.getByText('Kapsa je prázdná. Nic tu nečeká.')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'KAPSA · 0' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('closes through the backdrop and restores focus to KAPSA', () => {
    render(<MobileDockHarness />);
    const trigger = screen.getByRole('button', { name: 'KAPSA, 0 předmětů' });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'Zavřít KAPSA · 0' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
