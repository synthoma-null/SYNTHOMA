import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReaderDialogController from '../ReaderDialogController';

function renderDialog() {
  return render(
    <>
      <div id="chapter-dialog-root">
        <p className="dialog-line" data-speaker="tova" data-tone="klidně, věcně">„Jsou tady.“</p>
      </div>
      <ReaderDialogController rootId="chapter-dialog-root" />
    </>,
  );
}

describe('ReaderDialogController', () => {
  it('announces speaker and tone after click without disabling selection', async () => {
    renderDialog();
    const line = screen.getByText('„Jsou tady.“');
    await waitFor(() => expect(line).toHaveAttribute('role', 'button'));
    expect(line).toHaveClass('dialog-line');
    fireEvent.click(line);
    expect(screen.getByRole('status')).toHaveTextContent('Tova Neonová');
    expect(screen.getByRole('status')).toHaveTextContent('klidně, věcně');
  });

  it('supports keyboard activation and Escape', async () => {
    renderDialog();
    const line = screen.getByText('„Jsou tady.“');
    await waitFor(() => expect(line).toHaveAttribute('tabindex', '0'));
    fireEvent.keyDown(line, { key: 'Enter' });
    expect(screen.getByRole('status')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
