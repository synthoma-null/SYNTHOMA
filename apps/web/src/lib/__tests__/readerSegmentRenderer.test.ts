import { renderReaderSegment } from '../readerSegmentRenderer';

describe('renderReaderSegment flow barrier', () => {
  it('instant completion reveals only the current segment and leaves continuation detached', () => {
    const host = document.createElement('div');
    const box = document.createElement('div');
    host.appendChild(box);
    const onDone = jest.fn();

    renderReaderSegment({
      html: '<p>Text A</p><p class="choice" data-tags="N">A</p><p class="choice" data-tags="S">B</p><p>Text B</p>',
      box,
      host,
      mode: 'instant',
      helpers: {
        cleanupChoices: jest.fn(),
        bindChoiceHandlers: jest.fn(),
        revealChoicesStagger: jest.fn(),
      },
      onDone,
    });

    expect(box).toHaveTextContent('Text A');
    expect(box).not.toHaveTextContent('Text B');
    expect(onDone).toHaveBeenCalledWith(expect.objectContaining({
      remainderHtml: expect.stringContaining('Text B'),
    }));
  });
});
