import { render, screen } from '@testing-library/react';
import AutorClient from './AutorClient';

jest.mock('../../src/hooks/useBackgroundMotionAllowed', () => ({ useBackgroundMotionAllowed: () => false }));
jest.mock('../../src/lib/useVideoVisibility', () => ({ useVideoVisibility: () => ({ current: null }) }));
jest.mock('../../src/components/reader/ReaderCommandUtilities', () => ({
  __esModule: true,
  default: () => <div data-testid="reader-utilities" />,
}));
jest.mock('../../src/components/reader/ReaderDialogController', () => ({
  __esModule: true,
  default: () => null,
}));

describe('AutorClient', () => {
  it('uses the reader shell without chapter progress or chapter navigation', () => {
    const { container } = render(<AutorClient locale="cs" initialHtml="<h1>Tomáš Valíček</h1><p>Autor SYNTHOMY.</p>" />);

    expect(screen.getByRole('main')).toHaveAttribute('data-content-kind', 'author');
    expect(screen.getByRole('article', { name: 'O autorovi' })).toHaveClass('chapter-reader__article');
    expect(screen.getByRole('link', { name: 'UZEL' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'KNIHOVNA' })).toHaveAttribute('href', '/books');
    expect(screen.getByTestId('reader-utilities')).toBeInTheDocument();
    expect(container.querySelector('.chapter-reader__progress')).not.toBeInTheDocument();
    expect(container.querySelector('.chapter-reader__navigation')).not.toBeInTheDocument();
  });
});
