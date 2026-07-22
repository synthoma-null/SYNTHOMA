import { bindReaderDecisions, READER_FLOW_EVENT } from '../readerDecisionController';
import {
  LEGACY_READER_DECISIONS_STORAGE_KEY,
  READER_DECISIONS_STORAGE_KEY,
  readerDecisionPersistence,
  type ReaderDecisionPersistence,
  type ReaderDecisionRecord,
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

function createRoot(finalHref = ''): HTMLElement {
  const href = finalHref ? ` href="${finalHref}"` : '';
  const root = document.createElement('div');
  root.id = 'reader-root';
  root.className = 'reader-decisions-pending';
  root.setAttribute('inert', '');
  root.setAttribute('aria-busy', 'true');
  root.innerHTML = `
    <p class="text">Text A</p>
    <p class="choice" data-tags="E"><span>Accept</span></p>
    <p class="choice" data-tags="I"><span>Refuse</span></p>
    <p class="text">Interlude</p>
    <p class="choice" data-tags="S"><a class="choice-link"${href}>Observe</a></p>
    <p class="choice" data-tags="N"><a class="choice-link"${href}>Infer</a></p>
    <p class="text">Future tail</p>
  `;
  document.body.appendChild(root);
  return root;
}

function options(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('.choice-link'));
}

function record(choiceId = 'accept'): ReaderDecisionRecord {
  return {
    chapterId: 'chapter-a',
    collection: 'SYNTHOMA-NULL',
    groupId: 'question-a',
    questionId: 'question-a',
    choiceId,
    tags: ['E'],
    selectedAt: 1_784_419_200_000,
  };
}

describe('Reader decision flow', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
    jest.useRealTimers();
  });

  it('stops indefinitely at the first choice and keeps future content outside the DOM', () => {
    jest.useFakeTimers();
    const root = createRoot();
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'cs', contract });

    expect(root).toHaveAttribute('data-reader-flow-state', 'WAITING_FOR_CHOICE');
    expect(root).toHaveTextContent('Text A');
    expect(root).not.toHaveTextContent('Interlude');
    expect(root).not.toHaveTextContent('Future tail');
    expect(options(root)).toHaveLength(2);

    jest.advanceTimersByTime(10_000);
    expect(root).toHaveAttribute('data-reader-flow-state', 'WAITING_FOR_CHOICE');
    expect(root).not.toHaveTextContent('Interlude');
  });

  it('commits one option and reveals only the next segment and choice group', () => {
    const root = createRoot();
    const onCommitted = jest.fn();
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'cs', contract, onCommitted });
    const [accept, refuse] = options(root);

    accept!.click();

    expect(root).toHaveTextContent('Interlude');
    expect(root).not.toHaveTextContent('Future tail');
    expect(options(root)).toHaveLength(4);
    expect(root.querySelectorAll('[data-state="idle"] .choice-link')).toHaveLength(2);
    expect(accept).toHaveAttribute('data-state', 'selected-locked');
    expect(refuse).toHaveAttribute('data-state', 'unselected-locked');
    expect(readerDecisionPersistence.read('chapter-a', 'question-a')?.choiceId).toBe('accept');
    expect(readerDecisionPersistence.read('chapter-a', 'question-a')?.tags).toEqual(['E']);
    expect(onCommitted).toHaveBeenCalledTimes(1);
  });

  it('does not navigate before the final link choice is saved and confirmed', () => {
    jest.useFakeTimers();
    const root = createRoot('/chapter/next');
    const onNavigate = jest.fn();
    bindReaderDecisions({
      root,
      chapterId: 'chapter-a',
      locale: 'cs',
      contract,
      navigationDelayMs: 350,
      onNavigate,
    });
    options(root)[0]!.click();
    const finalChoice = options(root)[2]!;

    jest.advanceTimersByTime(10_000);
    expect(onNavigate).not.toHaveBeenCalled();
    finalChoice.click();

    expect(root).toHaveAttribute('data-reader-flow-state', 'CHAPTER_COMPLETE');
    expect(finalChoice).toHaveAttribute('data-state', 'selected-locked');
    expect(readerDecisionPersistence.read('chapter-a', 'question-b')?.href).toBe('/chapter/next');
    expect(onNavigate).not.toHaveBeenCalled();
    jest.advanceTimersByTime(349);
    expect(onNavigate).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(onNavigate).toHaveBeenCalledWith('/chapter/next');
  });

  it('restores the resolved prefix and returns to the last unresolved choice', () => {
    const firstRoot = createRoot();
    bindReaderDecisions({ root: firstRoot, chapterId: 'chapter-a', locale: 'cs', contract });
    options(firstRoot)[1]!.click();
    firstRoot.remove();

    const restoredRoot = createRoot();
    const onCommitted = jest.fn();
    bindReaderDecisions({ root: restoredRoot, chapterId: 'chapter-a', locale: 'cs', contract, onCommitted });
    const restoredOptions = options(restoredRoot);

    expect(restoredRoot).toHaveTextContent('Interlude');
    expect(restoredRoot).not.toHaveTextContent('Future tail');
    expect(restoredOptions[1]).toHaveAttribute('data-state', 'selected-locked');
    expect(restoredOptions[2]).toHaveAttribute('data-state', 'idle');
    expect(onCommitted).not.toHaveBeenCalled();
  });

  it('supports arrow navigation and Enter on the active group only', () => {
    const root = createRoot();
    const onCommitted = jest.fn();
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'cs', contract, onCommitted });
    const [accept, refuse] = options(root);

    accept!.focus();
    accept!.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(refuse);
    refuse!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(onCommitted).toHaveBeenCalledTimes(1);
    expect(readerDecisionPersistence.read('chapter-a', 'question-a')?.choiceId).toBe('refuse');
  });

  it('emits completion only after the final non-link decision', () => {
    const root = createRoot();
    const states: string[] = [];
    root.addEventListener(READER_FLOW_EVENT, (event) => {
      states.push((event as CustomEvent<{ state: string }>).detail.state);
    });
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'cs', contract });
    options(root)[0]!.click();

    expect(states).not.toContain('CHAPTER_COMPLETE');
    options(root)[2]!.click();

    expect(root).toHaveTextContent('Future tail');
    expect(states.at(-1)).toBe('CHAPTER_COMPLETE');
  });

  it('recovers from a persistence error without unlocking another group', () => {
    const failingPersistence: ReaderDecisionPersistence = {
      read: () => null,
      commit: () => ({ status: 'error' }),
    };
    const root = createRoot();
    bindReaderDecisions({ root, chapterId: 'chapter-a', locale: 'en', contract, persistence: failingPersistence });
    const first = options(root)[0]!;
    first.focus();
    first.click();

    expect(first.closest('[data-reader-decision-group]')).toHaveAttribute('data-state', 'error');
    expect(root).toHaveTextContent('The decision could not be saved. Try again');
    expect(root).not.toHaveTextContent('Interlude');
    expect(document.activeElement).toBe(first);
  });
});

describe('Reader decision persistence', () => {
  beforeEach(() => localStorage.clear());

  it('keeps a write idempotent and namespaces it by collection', () => {
    const first = record();
    expect(readerDecisionPersistence.commit(first).status).toBe('committed');
    expect(readerDecisionPersistence.commit({ ...first, choiceId: 'refuse' })).toEqual({
      status: 'existing',
      record: first,
    });
    expect(readerDecisionPersistence.read('chapter-a', 'question-a', 'KONEC-PODPORY')).toBeNull();
    expect(JSON.parse(localStorage.getItem(READER_DECISIONS_STORAGE_KEY) ?? '{}').version).toBe(2);
  });

  it('reads the legacy v1 decision without rewriting old saves', () => {
    localStorage.setItem(LEGACY_READER_DECISIONS_STORAGE_KEY, JSON.stringify({
      version: 1,
      decisions: {
        'chapter-a:question-a': {
          chapterId: 'chapter-a',
          questionId: 'question-a',
          choiceId: 'refuse',
          selectedAt: '2026-07-19T00:00:00.000Z',
        },
      },
    }));

    expect(readerDecisionPersistence.read('chapter-a', 'question-a')?.choiceId).toBe('refuse');
    expect(localStorage.getItem(READER_DECISIONS_STORAGE_KEY)).toBeNull();
  });
});
