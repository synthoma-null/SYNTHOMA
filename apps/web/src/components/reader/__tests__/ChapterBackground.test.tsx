import { fireEvent, render, waitFor } from '@testing-library/react';
import ChapterBackground from '../ChapterBackground';
import { getChapterPresentation } from '../../../content/chapterPresentation';

const presentation = getChapterPresentation('0-0-null')!;

function motionPreference(reduced: boolean) {
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: reduced && query === '(prefers-reduced-motion: reduce)',
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
}

describe('ChapterBackground', () => {
  afterEach(() => jest.restoreAllMocks());

  beforeEach(() => {
    jest.clearAllMocks();
    motionPreference(false);
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: false } });
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: jest.fn().mockResolvedValue(undefined) });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: jest.fn() });
  });

  it('renders one stable muted video over a persistent poster and falls back on media error', async () => {
    const { container, rerender } = render(<ChapterBackground presentation={presentation} />);
    await waitFor(() => expect(container.querySelectorAll('video')).toHaveLength(1));
    const video = container.querySelector('video')!;
    expect(video.muted).toBe(true);
    expect(video).toHaveAttribute('loop');
    expect(video.querySelector('source')).toHaveAttribute('src', '/video/SYNTHOMA23.webm');

    rerender(<ChapterBackground presentation={presentation} />);
    expect(container.querySelectorAll('video')).toHaveLength(1);
    fireEvent.error(container.querySelector('video')!);
    await waitFor(() => expect(container.querySelector('video')).toBeNull());
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('does not load video for reduced motion, data saver or a persisted disabled preference', async () => {
    motionPreference(true);
    const reduced = render(<ChapterBackground presentation={presentation} />);
    await waitFor(() => expect(reduced.container.querySelector('video')).toBeNull());
    reduced.unmount();

    motionPreference(false);
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } });
    const saver = render(<ChapterBackground presentation={presentation} />);
    await waitFor(() => expect(saver.container.querySelector('video')).toBeNull());
    saver.unmount();

    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: false } });
    (Storage.prototype.getItem as jest.Mock).mockImplementation((key: string) => key === 'synthoma_ui_preferences'
      ? JSON.stringify({ version: 1, movingBackground: false })
      : null);
    const disabled = render(<ChapterBackground presentation={presentation} />);
    await waitFor(() => expect(disabled.container.querySelector('video')).toBeNull());
  });
});
