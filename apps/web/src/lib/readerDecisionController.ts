import type { ReaderDecisionQuestionContract } from '../content/readerDecisionCatalog';
import { getReaderDecisionContract } from '../content/readerDecisionCatalog';
import {
  readerDecisionPersistence,
  type ReaderDecisionPersistence,
  type ReaderDecisionRecord,
} from './readerDecisions';

export type ReaderDecisionLocale = 'cs' | 'en';

export interface ReaderDecisionCopy {
  groupLabel: (position: number) => string;
  groupLocked: (position: number) => string;
  recorded: string;
  choiceLocked: string;
  recording: string;
  error: string;
  retry: string;
}

export function getReaderDecisionCopy(locale: ReaderDecisionLocale): ReaderDecisionCopy {
  return locale === 'en'
    ? {
        groupLabel: (position) => `Decision ${position}`,
        groupLocked: (position) => `Decision ${position}, choice locked`,
        recorded: 'RECORDED',
        choiceLocked: 'CHOICE LOCKED',
        recording: 'Recording decision...',
        error: 'The decision could not be saved.',
        retry: 'Try again',
      }
    : {
        groupLabel: (position) => `Rozhodnutí ${position}`,
        groupLocked: (position) => `Rozhodnutí ${position}, volba uzamčena`,
        recorded: 'ZAPSÁNO',
        choiceLocked: 'VOLBA UZAMČENA',
        recording: 'Ukládám rozhodnutí...',
        error: 'Rozhodnutí se nepodařilo uložit.',
        retry: 'Zkusit znovu',
      };
}

export interface BindReaderDecisionOptions {
  root: HTMLElement;
  chapterId: string;
  locale: ReaderDecisionLocale;
  contract?: ReaderDecisionQuestionContract[];
  persistence?: ReaderDecisionPersistence;
  onCommitted?: (option: HTMLElement, record: ReaderDecisionRecord) => void;
  onNavigate?: (href: string) => void;
}

function choiceRows(root: HTMLElement): HTMLElement[][] {
  const rows = Array.from(root.querySelectorAll<HTMLElement>('p.choice'));
  const blocks: HTMLElement[][] = [];
  rows.forEach((row) => {
    if (row.previousElementSibling?.matches('p.choice')) return;
    const block: HTMLElement[] = [];
    let cursor: Element | null = row;
    while (cursor instanceof HTMLElement && cursor.matches('p.choice')) {
      block.push(cursor);
      cursor = cursor.nextElementSibling;
    }
    blocks.push(block);
  });
  return blocks;
}

function optionForRow(row: HTMLElement): HTMLElement {
  const existing = row.querySelector<HTMLElement>('.choice-link');
  if (existing) return existing;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'choice-link';
  button.innerHTML = row.innerHTML;
  row.innerHTML = '';
  row.appendChild(button);
  return button;
}

function copyDecisionAttributes(row: HTMLElement, option: HTMLElement): void {
  Array.from(row.attributes).forEach((attribute) => {
    if (attribute.name.startsWith('data-') && !option.hasAttribute(attribute.name)) {
      option.setAttribute(attribute.name, attribute.value);
    }
  });
}

function validateBlocks(blocks: HTMLElement[][], contract: ReaderDecisionQuestionContract[], chapterId: string): void {
  if (blocks.length !== contract.length) {
    throw new Error(`Reader decision contract mismatch for ${chapterId}: expected ${contract.length} groups, found ${blocks.length}.`);
  }
  blocks.forEach((block, groupIndex) => {
    const expected = contract[groupIndex];
    if (!expected || block.length !== expected.choices.length) {
      throw new Error(`Reader decision choice count mismatch for ${chapterId}:${expected?.questionId ?? groupIndex}.`);
    }
    block.forEach((row, choiceIndex) => {
      const sourceTag = (row.dataset.tags ?? '').trim().toUpperCase();
      if (sourceTag !== expected.choices[choiceIndex]?.sourceTag.toUpperCase()) {
        throw new Error(`Reader decision tag mismatch for ${chapterId}:${expected.questionId}.`);
      }
    });
  });
}

function prepareGroups(
  root: HTMLElement,
  chapterId: string,
  contract: ReaderDecisionQuestionContract[],
  copy: ReaderDecisionCopy,
): HTMLElement[] {
  const prepared = Array.from(root.querySelectorAll<HTMLElement>('[data-reader-decision-group]'));
  if (prepared.length) return prepared;

  const blocks = choiceRows(root);
  validateBlocks(blocks, contract, chapterId);

  return blocks.map((block, groupIndex) => {
    const question = contract[groupIndex]!;
    const group = document.createElement('div');
    group.id = `reader-decision-${chapterId}-${question.questionId}`;
    group.className = 'reader-decision-group';
    group.dataset.readerDecisionGroup = question.questionId;
    group.dataset.questionId = question.questionId;
    group.dataset.state = 'idle';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', copy.groupLabel(groupIndex + 1));

    const first = block[0]!;
    first.parentElement?.insertBefore(group, first);
    block.forEach((row, choiceIndex) => {
      const choice = question.choices[choiceIndex]!;
      row.dataset.questionId = question.questionId;
      row.dataset.choiceId = choice.choiceId;
      const option = optionForRow(row);
      copyDecisionAttributes(row, option);
      option.dataset.questionId = question.questionId;
      option.dataset.choiceId = choice.choiceId;
      option.dataset.blockId = question.questionId;
      option.dataset.state = 'idle';
      option.setAttribute('aria-pressed', 'false');
      const href = option.getAttribute('href');
      if (href) option.dataset.readerHref = href;
      group.appendChild(row);
    });

    const live = document.createElement('span');
    live.id = `${group.id}-status`;
    live.className = 'sr-only reader-decision-status';
    live.dataset.readerDecisionLive = 'true';
    live.setAttribute('aria-live', 'off');
    group.appendChild(live);
    group.querySelectorAll<HTMLElement>('.choice-link').forEach((option) => {
      option.setAttribute('aria-describedby', live.id);
    });
    return group;
  });
}

function setLockedState(
  group: HTMLElement,
  selectedChoiceId: string,
  copy: ReaderDecisionCopy,
  announce: boolean,
): void {
  const options = Array.from(group.querySelectorAll<HTMLElement>('.choice-link'));
  const selected = options.find((option) => option.dataset.choiceId === selectedChoiceId);
  if (!selected) return;

  group.dataset.state = 'locked';
  group.dataset.selectedChoice = selectedChoiceId;
  group.dataset.readerDecisionAnimate = announce ? 'true' : 'false';
  const position = Array.from(group.parentElement?.querySelectorAll('[data-reader-decision-group]') ?? []).indexOf(group) + 1;
  group.setAttribute('aria-label', copy.groupLocked(Math.max(1, position)));

  options.forEach((option) => {
    const chosen = option === selected;
    const row = option.closest<HTMLElement>('p.choice');
    option.dataset.state = chosen ? 'selected-locked' : 'unselected-locked';
    option.classList.toggle('chosen', chosen);
    option.classList.toggle('selected', chosen);
    option.classList.toggle('faded', !chosen);
    option.classList.toggle('disabled', !chosen);
    option.setAttribute('aria-pressed', chosen ? 'true' : 'false');
    option.setAttribute('aria-disabled', 'true');
    option.tabIndex = chosen ? 0 : -1;
    row?.classList.toggle('selected', chosen);
    row?.classList.toggle('disabled', !chosen);
    const href = option.getAttribute('href');
    if (href) option.dataset.readerHref = href;
    option.removeAttribute('href');
  });

  if (!selected.querySelector('.reader-decision-marker')) {
    const marker = document.createElement('span');
    marker.className = 'reader-decision-marker';
    marker.setAttribute('aria-hidden', 'true');
    marker.textContent = copy.recorded;
    selected.appendChild(marker);
  }

  const live = group.querySelector<HTMLElement>('[data-reader-decision-live]');
  if (live) {
    live.className = 'sr-only reader-decision-status';
    live.setAttribute('aria-live', announce ? 'polite' : 'off');
    live.textContent = announce ? copy.choiceLocked : '';
  }
}

function setSubmittingState(group: HTMLElement, copy: ReaderDecisionCopy): void {
  group.dataset.state = 'submitting';
  group.querySelectorAll<HTMLElement>('.choice-link').forEach((option) => {
    option.dataset.state = 'submitting';
    option.setAttribute('aria-disabled', 'true');
  });
  const live = group.querySelector<HTMLElement>('[data-reader-decision-live]');
  if (live) {
    live.setAttribute('aria-live', 'polite');
    live.textContent = copy.recording;
  }
}

function setErrorState(group: HTMLElement, copy: ReaderDecisionCopy): void {
  group.dataset.state = 'error';
  group.querySelectorAll<HTMLElement>('.choice-link').forEach((option) => {
    option.dataset.state = 'idle';
    option.setAttribute('aria-disabled', 'false');
  });
  const live = group.querySelector<HTMLElement>('[data-reader-decision-live]');
  if (live) {
    live.className = 'reader-decision-status reader-decision-status--error';
    live.setAttribute('aria-live', 'polite');
    live.textContent = `${copy.error} ${copy.retry}`;
  }
}

export function bindReaderDecisions(options: BindReaderDecisionOptions): () => void {
  const {
    root,
    chapterId,
    locale,
    persistence = readerDecisionPersistence,
    onCommitted,
    onNavigate,
  } = options;
  const contract = options.contract ?? getReaderDecisionContract(chapterId);
  const copy = getReaderDecisionCopy(locale);
  const groups = prepareGroups(root, chapterId, contract, copy);

  groups.forEach((group) => {
    const questionId = group.dataset.questionId;
    if (!questionId) return;
    const stored = persistence.read(chapterId, questionId);
    if (stored) setLockedState(group, stored.choiceId, copy, false);
  });

  root.dataset.readerDecisions = 'ready';
  root.classList.remove('reader-decisions-pending');
  root.removeAttribute('inert');
  root.setAttribute('aria-busy', 'false');

  const resolve = (option: HTMLElement, event: Event) => {
    const group = option.closest<HTMLElement>('[data-reader-decision-group]');
    const questionId = group?.dataset.questionId;
    const choiceId = option.dataset.choiceId;
    if (!group || !questionId || !choiceId) return;
    event.preventDefault();

    const stored = persistence.read(chapterId, questionId);
    if (stored) {
      if (group.dataset.state !== 'locked') setLockedState(group, stored.choiceId, copy, false);
      return;
    }
    if (group.dataset.state === 'submitting' || group.dataset.state === 'locked') return;

    const href = option.dataset.readerHref ?? option.getAttribute('href') ?? '';
    setSubmittingState(group, copy);
    const record: ReaderDecisionRecord = {
      chapterId,
      questionId,
      choiceId,
      selectedAt: new Date().toISOString(),
    };
    const result = persistence.commit(record);
    if (result.status === 'error') {
      setErrorState(group, copy);
      option.focus();
      return;
    }

    setLockedState(group, result.record.choiceId, copy, result.status === 'committed');
    if (result.status !== 'committed') return;
    onCommitted?.(option, result.record);
    if (href) onNavigate?.(href);
  };

  const onClick = (event: Event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.choice-link') : null;
    if (target && root.contains(target)) resolve(target, event);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.choice-link') : null;
    if (target && root.contains(target)) resolve(target, event);
  };

  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKeyDown);
  return () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('keydown', onKeyDown);
  };
}
