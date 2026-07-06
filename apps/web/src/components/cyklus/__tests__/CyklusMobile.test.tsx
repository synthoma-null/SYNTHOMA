import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CyklusMobileHud from '../CyklusMobileHud';
import CyklusBottomNav from '../CyklusBottomNav';
import CyklusBottomSheet from '../CyklusBottomSheet';
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
