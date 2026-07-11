import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CyklusMobileHud from '../CyklusMobileHud';
import CyklusBottomNav from '../CyklusBottomNav';
import CyklusBottomSheet from '../CyklusBottomSheet';
import StatDock from '../StatDock';
import { createCyklusRun } from '../../../game/cyklus/cyklusEngine';

describe('CyklusMobileHud', () => {
  it('renders sector and choice progress', () => {
    const state = createCyklusRun(true);
    render(<CyklusMobileHud state={state} onToggleDiag={jest.fn()} diagOpen={false} />);
    expect(screen.getByText(/CYKLUS 01/)).toBeInTheDocument();
    expect(screen.getByText(/1\/12/)).toBeInTheDocument();
  });

  it('opens diagnostic drawer when diagOpen is true', () => {
    const state = createCyklusRun(true);
    const onToggle = jest.fn();
    render(<CyklusMobileHud state={state} onToggleDiag={onToggle} diagOpen={true} />);
    expect(screen.getByText(/Stabilizace/)).toBeInTheDocument();
  });
});

describe('CyklusBottomNav', () => {
  it('renders KAPSA, BUILD, ARCHIV, PRÁZDN0TA', () => {
    render(
      <CyklusBottomNav
        pocketCount={3}
        onPocket={jest.fn()}
        onBuild={jest.fn()}
        onArchive={jest.fn()}
        onVoid={jest.fn()}
      />,
    );
    expect(screen.getByText('KAPSA')).toBeInTheDocument();
    expect(screen.getByText('BUILD')).toBeInTheDocument();
    expect(screen.getByText('ARCHIV')).toBeInTheDocument();
    expect(screen.getByText('PRÁZDN0TA')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'KAPSA, 3 předmětů' }).querySelector('svg')).toBeInTheDocument();
  });

  it('calls onPocket when KAPSA is clicked', () => {
    const onPocket = jest.fn();
    render(
      <CyklusBottomNav
        pocketCount={0}
        onPocket={onPocket}
        onBuild={jest.fn()}
        onArchive={jest.fn()}
        onVoid={jest.fn()}
      />,
    );
    fireEvent.click(screen.getByText('KAPSA'));
    expect(onPocket).toHaveBeenCalledTimes(1);
  });

  it('calls onVoid when PRÁZDN0TA is clicked', () => {
    const onVoid = jest.fn();
    render(
      <CyklusBottomNav
        pocketCount={0}
        onPocket={jest.fn()}
        onBuild={jest.fn()}
        onArchive={jest.fn()}
        onVoid={onVoid}
      />,
    );
    fireEvent.click(screen.getByText('PRÁZDN0TA'));
    expect(onVoid).toHaveBeenCalledTimes(1);
  });

  it('keeps every navigation action functional with icon-only mobile styling', () => {
    const handlers = {
      onPocket: jest.fn(),
      onBuild: jest.fn(),
      onArchive: jest.fn(),
      onVoid: jest.fn(),
    };
    render(<CyklusBottomNav pocketCount={0} {...handlers} />);

    fireEvent.click(screen.getByRole('button', { name: 'KAPSA, 0 předmětů' }));
    fireEvent.click(screen.getByRole('button', { name: 'BUILD' }));
    fireEvent.click(screen.getByRole('button', { name: 'ARCHIV' }));
    fireEvent.click(screen.getByRole('button', { name: 'PRÁZDN0TA' }));

    expect(handlers.onPocket).toHaveBeenCalledTimes(1);
    expect(handlers.onBuild).toHaveBeenCalledTimes(1);
    expect(handlers.onArchive).toHaveBeenCalledTimes(1);
    expect(handlers.onVoid).toHaveBeenCalledTimes(1);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('exposes the active destination with aria-pressed', () => {
    render(
      <CyklusBottomNav
        pocketCount={0}
        onPocket={jest.fn()}
        onBuild={jest.fn()}
        onArchive={jest.fn()}
        onVoid={jest.fn()}
        active="archive"
      />,
    );
    expect(screen.getByRole('button', { name: /ARCHIV/ })).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('StatDock diagnostic axis', () => {
  it('renders risk zones, center and current markers for every stat', () => {
    const { container } = render(
      <StatDock
        stats={{ energy: 10, memory: 50, bond: 82, control: 44 }}
        openStat={null}
        onOpenStat={jest.fn()}
        history={[]}
      />,
    );
    expect(container.querySelectorAll('.cyklus-stat-chip__zone--low')).toHaveLength(4);
    expect(container.querySelectorAll('.cyklus-stat-chip__center')).toHaveLength(4);
    expect(container.querySelectorAll('.cyklus-stat-chip__marker')).toHaveLength(4);
    expect(container.querySelectorAll('.cyklus-stat-chip__label')).toHaveLength(4);
    expect(container.querySelectorAll('.cyklus-stat-chip__value-group')).toHaveLength(4);
    expect(container.querySelectorAll('.cyklus-stat-chip__bar')).toHaveLength(4);
    expect(screen.getByRole('button', { name: /Energie: 10/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Paměť: 50/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Vazba: 82/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Kontrola: 44/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Energie: 10, KRITICKÁ/ })).toHaveTextContent('! KRITICKÁ');
    expect(screen.getByRole('button', { name: /Vazba: 82, PŘETLAK/ })).toHaveTextContent('! PŘETLAK');
    expect(container).not.toHaveTextContent(/\b(?:ENE|PAM|VAZ|KON)\b/);
    expect(container).not.toHaveTextContent(/stabilní/i);
  });
});

describe('CyklusBottomSheet', () => {
  it('renders when open and shows title', () => {
    render(
      <CyklusBottomSheet open={true} onClose={jest.fn()} title="KAPSA 2">
        <div>Test content</div>
      </CyklusBottomSheet>,
    );
    expect(screen.getByText('KAPSA 2')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <CyklusBottomSheet open={false} onClose={jest.fn()} title="KAPSA 0">
        <div>Hidden content</div>
      </CyklusBottomSheet>,
    );
    expect(screen.queryByText('KAPSA 0')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(
      <CyklusBottomSheet open={true} onClose={onClose} title="KAPSA">
        <div>Content</div>
      </CyklusBottomSheet>,
    );
    fireEvent.click(screen.getByLabelText('Zavřít'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
