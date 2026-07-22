import { fireEvent, render, waitFor } from '@testing-library/react';
import ChapterReadingProgress from '../ChapterReadingProgress';
import { LangProvider } from '../../../lib/LangContext';
import { readReadingProgress, saveReadingProgress } from '../../../lib/readerState';
import { READER_FLOW_EVENT } from '../../../lib/readerDecisionController';

jest.mock('../../../lib/readerState', () => ({
  readReadingProgress: jest.fn(),
  saveLastChapterPath: jest.fn(),
  saveReadingProgress: jest.fn(),
}));

const props = {
  chapterId: '0-0-null',
  chapterTitle: '0-0 [NULL]',
  collection: 'SYNTHOMA-NULL',
  chapterPath: '/chapter/0-0-null',
};

describe('ChapterReadingProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (readReadingProgress as jest.Mock).mockReturnValue(null);
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 1000 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 500 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    Object.defineProperty(window, 'requestAnimationFrame', { configurable: true, value: (callback: FrameRequestCallback) => { callback(0); return 1; } });
    Object.defineProperty(window, 'cancelAnimationFrame', { configurable: true, value: jest.fn() });
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as jest.Mock;
  });

  it('autosaves local and server progress and marks completion monotonically', async () => {
    const { getByRole } = render(<ChapterReadingProgress {...props} />);
    await waitFor(() => expect(saveReadingProgress).toHaveBeenCalled());
    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    fireEvent.scroll(window);
    await waitFor(() => expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100'));
    expect(saveReadingProgress).toHaveBeenLastCalledWith(expect.objectContaining({
      chapterId: '0-0-null', percent: 100, completed: true,
    }));
    expect(global.fetch).toHaveBeenLastCalledWith('/api/me/progress', expect.objectContaining({
      method: 'POST',
      body: expect.stringContaining('"completed":true'),
    }));
  });

  it('restores a local position only after fonts are ready', async () => {
    (readReadingProgress as jest.Mock).mockReturnValue({
      bookId: 'SYNTHOMA-NULL', path: props.chapterPath, percent: 50, updatedAt: Date.now(),
    });
    const scrollTo = jest.fn();
    Object.defineProperty(window, 'scrollTo', { configurable: true, value: scrollTo });
    Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: Promise.resolve() } });
    render(<ChapterReadingProgress {...props} />);
    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 250, behavior: 'auto' }));
  });

  it('does not complete a chapter with decisions before the final choice', async () => {
    const { getByRole } = render(<ChapterReadingProgress {...props} hasDecisions />);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 500 });
    fireEvent.scroll(window);

    await waitFor(() => expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '97'));
    expect(saveReadingProgress).toHaveBeenLastCalledWith(expect.objectContaining({
      percent: 97,
      completed: false,
    }));

    document.dispatchEvent(new CustomEvent(READER_FLOW_EVENT, {
      detail: { chapterId: props.chapterId, state: 'CHAPTER_COMPLETE', complete: true },
    }));

    await waitFor(() => expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100'));
    expect(saveReadingProgress).toHaveBeenLastCalledWith(expect.objectContaining({
      percent: 100,
      completed: true,
    }));
  });

  it('localizes the progressbar label', () => {
    const { getByRole } = render(
      <LangProvider initialLang="en">
        <ChapterReadingProgress {...props} />
      </LangProvider>,
    );

    expect(getByRole('progressbar', { name: 'Chapter reading progress' })).toBeInTheDocument();
  });
});
