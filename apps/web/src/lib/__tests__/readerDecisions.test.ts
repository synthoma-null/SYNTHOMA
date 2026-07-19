import { bindReaderDecisions } from '../readerDecisionController';
import {
  READER_DECISIONS_STORAGE_KEY,
  readerDecisionPersistence,
  type ReaderDecisionPersistence,
} from '../readerDecisions';
import type { ReaderDecisionQuestionContract } from '../../content/readerDecisionCatalog';

const contract: ReaderDecisionQuestionContract[] = [
  {
    questionId: 'question-a',
    choices: [
      { choiceId: 'accept', sourceTag: 'E' },
      { choiceId: 'refuse', sourceTag: 'I' },
    ],
  },
  {
    questionId: 'question-b',
    choices: [
      { choiceId: 'observe', sourceTag: 'S' },
      { choiceId: 'infer', sourceTag: 'N' },
    ],
  },
];

function createRoot(): HTMLElement {
  const root = document.createElement('div');
  root.id = 'reader-root';
  root.className = 'reader-decisions-pending';
  root.setAttribute('inert', '');
  root.setAttribute('aria-busy', 'true');
  root.innerHTML = `
    <p class="choice" data-tags="E"><span>Same answer</span></p>
    <p class="choice" data-tags="I"><span>Other answer</span></p>
    <p class="text">Interlude</p>
    <p class="choice" data-tags="S"><span>Same answer</span></p>
    <p class="choice" data-tags="N"><span>Other answer</span></p>
  `;
  document.body.appendChild(root);
  return root;
}

function options(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('.choice-link'));
}

describe('Reader decision contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('commits the first click once and locks only its question', () => {
    const root = createRoot();
    const onCommitted = jest.fn();
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'cs', contract, onCommitted });
    const [accept, refuse, observe] = options(root);

    expect(root).toHaveAttribute('data-reader-decisions', 'ready');
    expect(root).not.toHaveClass('reader-decisions-pending');
    expect(root).not.toHaveAttribute('inert');

    accept!.focus();
    accept!.click();
    refuse!.click();

    const firstGroup = accept!.closest<HTMLElement>('[data-reader-decision-group]')!;
    const secondGroup = observe!.closest<HTMLElement>('[data-reader-decision-group]')!;
    expect(firstGroup).toHaveAttribute('data-state', 'locked');
    expect(firstGroup).toHaveAttribute('data-selected-choice', 'accept');
    expect(secondGroup).toHaveAttribute('data-state', 'idle');
    expect(accept).toHaveAttribute('data-state', 'selected-locked');
    expect(accept).toHaveAttribute('aria-pressed', 'true');
    expect(refuse).toHaveAttribute('data-state', 'unselected-locked');
    expect(refuse).toHaveAttribute('aria-pressed', 'false');
    expect(refuse).toHaveAttribute('aria-disabled', 'true');
    expect(firstGroup.querySelector('[data-reader-decision-live]')).toHaveAttribute('aria-live', 'polite');
    expect(firstGroup.querySelector('[data-reader-decision-live]')).toHaveTextContent('VOLBA UZAMČENA');
    expect(document.activeElement).toBe(accept);
    expect(onCommitted).toHaveBeenCalledTimes(1);
    expect(readerDecisionPersistence.read('chapter-a', 'question-a')?.choiceId).toBe('accept');
  });

  it('guards double click and Enter followed by click', () => {
    const root = createRoot();
    const onCommitted = jest.fn();
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'cs', contract, onCommitted });
    const [accept, , observe] = options(root);

    accept!.click();
    accept!.click();
    observe!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    observe!.click();

    expect(onCommitted).toHaveBeenCalledTimes(2);
    expect(readerDecisionPersistence.read('chapter-a', 'question-a')?.choiceId).toBe('accept');
    expect(readerDecisionPersistence.read('chapter-a', 'question-b')?.choiceId).toBe('observe');
  });

  it('restores the locked choice after reload without replaying its consequence', () => {
    const firstRoot = createRoot();
    bindReaderDecisions({ root: firstRoot, chapterId: 'chapter-a', locale: 'cs', contract });
    options(firstRoot)[1]!.click();
    firstRoot.remove();

    const restoredRoot = createRoot();
    const onCommitted = jest.fn();
    bindReaderDecisions({ root: restoredRoot, chapterId: 'chapter-a', locale: 'cs', contract, onCommitted });
    const [accept, refuse] = options(restoredRoot);

    expect(refuse).toHaveAttribute('data-state', 'selected-locked');
    expect(accept).toHaveAttribute('data-state', 'unselected-locked');
    expect(refuse!.textContent).toContain('ZAPSÁNO');
    expect(onCommitted).not.toHaveBeenCalled();
  });

  it('shares stable IDs across locales while translating the marker', () => {
    const csRoot = createRoot();
    bindReaderDecisions({ root: csRoot, chapterId: 'chapter-a', locale: 'cs', contract });
    options(csRoot)[0]!.click();
    csRoot.remove();

    const enRoot = createRoot();
    bindReaderDecisions({ root: enRoot, chapterId: 'chapter-a', locale: 'en', contract });
    const selected = options(enRoot)[0]!;
    expect(selected.dataset.choiceId).toBe('accept');
    expect(selected).toHaveAttribute('data-state', 'selected-locked');
    expect(selected.textContent).toContain('RECORDED');
  });

  it('keeps identical answer text separate by question and chapter namespace', () => {
    const root = createRoot();
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'cs', contract });
    const [first, , sameTextInSecond] = options(root);
    first!.click();
    sameTextInSecond!.click();

    expect(readerDecisionPersistence.read('chapter-a', 'question-a')?.choiceId).toBe('accept');
    expect(readerDecisionPersistence.read('chapter-a', 'question-b')?.choiceId).toBe('observe');

    const otherChapter = createRoot();
    bindReaderDecisions({ root: otherChapter, chapterId: 'chapter-b', locale: 'cs', contract });
    expect(options(otherChapter)[0]).toHaveAttribute('data-state', 'idle');
  });

  it('unlocks the group and announces a real persistence error', () => {
    const failingPersistence: ReaderDecisionPersistence = {
      read: () => null,
      commit: () => ({ status: 'error' }),
    };
    const root = createRoot();
    const onCommitted = jest.fn();
    bindReaderDecisions({
      root,
      chapterId: 'chapter-a',
      locale: 'en',
      contract,
      persistence: failingPersistence,
      onCommitted,
    });
    const first = options(root)[0]!;
    first.focus();
    first.click();

    const group = first.closest<HTMLElement>('[data-reader-decision-group]')!;
    expect(group).toHaveAttribute('data-state', 'error');
    expect(first).toHaveAttribute('aria-disabled', 'false');
    expect(group.textContent).toContain('The decision could not be saved. Try again');
    expect(document.activeElement).toBe(first);
    expect(onCommitted).not.toHaveBeenCalled();
  });

  it('keeps the local write idempotent', () => {
    const record = {
      chapterId: 'chapter-a',
      questionId: 'question-a',
      choiceId: 'accept',
      selectedAt: '2026-07-19T00:00:00.000Z',
    };
    expect(readerDecisionPersistence.commit(record).status).toBe('committed');
    expect(readerDecisionPersistence.commit({ ...record, choiceId: 'refuse' })).toEqual({
      status: 'existing',
      record,
    });
    expect(JSON.parse(localStorage.getItem(READER_DECISIONS_STORAGE_KEY) ?? '{}').version).toBe(1);
  });
});
