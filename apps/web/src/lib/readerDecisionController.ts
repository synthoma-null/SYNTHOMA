import type { ReaderDecisionQuestionContract } from '../content/readerDecisionCatalog';
import { getReaderDecisionContract } from '../content/readerDecisionCatalog';
import {
  readerDecisionPersistence,
  type ReaderDecisionPersistence,
  type ReaderDecisionRecord,
} from './readerDecisions';

export type ReaderDecisionLocale = 'cs' | 'en';
export type ReaderFlowState =
  | 'TYPING'
  | 'WAITING_FOR_CHOICE'
  | 'RESOLVING_CHOICE'
  | 'TYPING_CONTINUATION'
  | 'CHAPTER_COMPLETE';

export const READER_FLOW_EVENT = 'synthoma:reader-flow-state';

export interface ReaderFlowEventDetail {
  chapterId: string;
  state: ReaderFlowState;
  complete: boolean;
}

export interface ReaderDecisionCopy {
  groupLabel: (position: number) => string;
  groupLocked: (position: number) => string;
  recorded: string;
  choiceLocked: string;
  recording: string;
  error: string;
  retry: string;
  missingTarget: string;
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
        missingTarget: 'LOG [CHOICE_TARGET_MISSING]: Continuation was not found.',
      }
    : {
        groupLabel: (position) => `Rozhodnutí ${position}`,
        groupLocked: (position) => `Rozhodnutí ${position}, volba uzamčena`,
        recorded: 'ZAPSÁNO',
        choiceLocked: 'VOLBA UZAMČENA',
        recording: 'Ukládám rozhodnutí...',
        error: 'Rozhodnutí se nepodařilo uložit.',
        retry: 'Zkusit znovu',
        missingTarget: 'LOG [CHOICE_TARGET_MISSING]: Pokračování nebylo nalezeno.',
      };
}

export interface BindReaderDecisionOptions {
  root: HTMLElement;
  chapterId: string;
  collection?: string;
  locale: ReaderDecisionLocale;
  contract?: ReaderDecisionQuestionContract[];
  persistence?: ReaderDecisionPersistence;
  navigationDelayMs?: number;
  onCommitted?: (option: HTMLElement, record: ReaderDecisionRecord) => void;
  onNavigate?: (href: string) => void;
  onFlowStateChange?: (state: ReaderFlowState) => void;
}

function choiceRows(root: HTMLElement): HTMLElement[][] {
  const rows = Array.from(root.querySelectorAll<HTMLElement>('p.choice'))
    .filter((row) => !row.closest('#story-cache'));
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
    group.dataset.state = 'queued';
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
      option.dataset.state = 'queued';
      option.setAttribute('aria-pressed', 'false');
      option.setAttribute('aria-disabled', 'true');
      option.tabIndex = -1;
      const href = option.getAttribute('href');
      if (href) {
        option.dataset.readerHref = href;
        option.removeAttribute('href');
        option.setAttribute('role', 'button');
      }
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

function setIdleState(group: HTMLElement): void {
  group.dataset.state = 'idle';
  group.querySelectorAll<HTMLElement>('.choice-link').forEach((option) => {
    option.dataset.state = 'idle';
    option.setAttribute('aria-disabled', 'false');
    option.tabIndex = 0;
    if (option instanceof HTMLButtonElement) option.disabled = false;
  });
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

function detachContinuations(root: HTMLElement, groups: HTMLElement[]): DocumentFragment[] {
  if (groups.some((group) => group.parentElement !== root)) {
    throw new Error('Reader decision groups must be top-level chapter nodes.');
  }
  const nodes = Array.from(root.childNodes);
  const groupPositions = groups.map((group) => nodes.indexOf(group));
  const continuations = groups.map((group, index) => {
    const fragment = document.createDocumentFragment();
    const start = groupPositions[index]! + 1;
    const end = index + 1 < groups.length ? groupPositions[index + 1]! + 1 : nodes.length;
    for (let nodeIndex = start; nodeIndex < end; nodeIndex += 1) {
      const node = nodes[nodeIndex];
      if (node) fragment.appendChild(node);
    }
    return fragment;
  });
  return continuations;
}

function focusFirstChoice(group: HTMLElement): void {
  const first = group.querySelector<HTMLElement>('.choice-link');
  if (!first) return;
  try {
    first.focus({ preventScroll: true });
  } catch {
    first.focus();
  }
}

function renderMissingTarget(root: HTMLElement, copy: ReaderDecisionCopy, target: string): void {
  console.error(`[ReaderDecisionController] Missing choice target: ${target}`);
  const message = document.createElement('p');
  message.className = 'reader-decision-status reader-decision-status--error';
  message.setAttribute('role', 'alert');
  message.textContent = copy.missingTarget;
  root.appendChild(message);
}

export function bindReaderDecisions(options: BindReaderDecisionOptions): () => void {
  const {
    root,
    chapterId,
    collection = 'SYNTHOMA-NULL',
    locale,
    persistence = readerDecisionPersistence,
    navigationDelayMs = 350,
    onCommitted,
    onNavigate,
    onFlowStateChange,
  } = options;
  const contract = options.contract ?? getReaderDecisionContract(chapterId);
  const copy = getReaderDecisionCopy(locale);
  const storyCache = root.querySelector<HTMLElement>('#story-cache');
  const storyTargets = new Set(
    Array.from(storyCache?.querySelectorAll<HTMLElement>('.story-block[id]') ?? []).map((block) => block.id),
  );
  storyCache?.remove();
  const groups = prepareGroups(root, chapterId, contract, copy);
  const continuations = detachContinuations(root, groups);
  const timers = new Set<ReturnType<typeof setTimeout>>();

  const setFlowState = (state: ReaderFlowState) => {
    root.dataset.readerFlowState = state;
    root.dataset.readerChapterId = chapterId;
    onFlowStateChange?.(state);
    root.dispatchEvent(new CustomEvent<ReaderFlowEventDetail>(READER_FLOW_EVENT, {
      bubbles: true,
      detail: { chapterId, state, complete: state === 'CHAPTER_COMPLETE' },
    }));
  };

  const stored = groups.map((group) => {
    const groupId = group.dataset.questionId;
    return groupId ? persistence.read(chapterId, groupId, collection) : null;
  });
  stored.forEach((record, index) => {
    if (record) setLockedState(groups[index]!, record.choiceId, copy, false);
  });

  let activeIndex = stored.findIndex((record) => !record);
  if (activeIndex < 0) activeIndex = groups.length;
  for (let index = 0; index < activeIndex; index += 1) {
    root.appendChild(continuations[index]!);
  }

  if (groups.length === 0 || activeIndex >= groups.length) {
    setFlowState('CHAPTER_COMPLETE');
  } else {
    setIdleState(groups[activeIndex]!);
    setFlowState('WAITING_FOR_CHOICE');
  }

  root.dataset.readerDecisions = 'ready';
  root.classList.remove('reader-decisions-pending');
  root.removeAttribute('inert');
  root.setAttribute('aria-busy', 'false');

  const revealContinuation = (groupIndex: number) => {
    setFlowState('TYPING_CONTINUATION');
    root.appendChild(continuations[groupIndex]!);
    activeIndex = groupIndex + 1;
    if (activeIndex < groups.length) {
      const next = groups[activeIndex]!;
      setIdleState(next);
      setFlowState('WAITING_FOR_CHOICE');
      focusFirstChoice(next);
      return;
    }
    setFlowState('CHAPTER_COMPLETE');
  };

  const resolve = (option: HTMLElement, event: Event) => {
    const group = option.closest<HTMLElement>('[data-reader-decision-group]');
    const questionId = group?.dataset.questionId;
    const choiceId = option.dataset.choiceId;
    if (!group || !questionId || !choiceId) return;
    event.preventDefault();

    const groupIndex = groups.indexOf(group);
    if (groupIndex !== activeIndex || group.dataset.state !== 'idle') return;
    const existing = persistence.read(chapterId, questionId, collection);
    if (existing) {
      setLockedState(group, existing.choiceId, copy, false);
      revealContinuation(groupIndex);
      return;
    }

    const href = option.dataset.readerHref ?? option.getAttribute('href') ?? '';
    const nextBlockId = option.dataset.next ?? option.getAttribute('data-next') ?? '';
    const tags = (option.dataset.tags ?? '')
      .split(/[\s,]+/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    setFlowState('RESOLVING_CHOICE');
    setSubmittingState(group, copy);
    const record: ReaderDecisionRecord = {
      chapterId,
      collection,
      groupId: questionId,
      questionId,
      choiceId,
      tags,
      selectedAt: Date.now(),
      ...(nextBlockId ? { nextBlockId } : {}),
      ...(href ? { href } : {}),
    };
    const result = persistence.commit(record);
    if (result.status === 'error') {
      setErrorState(group, copy);
      setFlowState('WAITING_FOR_CHOICE');
      option.focus();
      return;
    }

    setLockedState(group, result.record.choiceId, copy, result.status === 'committed');
    if (result.status !== 'committed') return;
    onCommitted?.(option, result.record);

    if (nextBlockId) {
      if (!storyTargets.has(nextBlockId)) {
        renderMissingTarget(root, copy, nextBlockId);
        setFlowState('WAITING_FOR_CHOICE');
        return;
      }
      revealContinuation(groupIndex);
      return;
    }

    if (href) {
      setFlowState('CHAPTER_COMPLETE');
      const timer = setTimeout(() => {
        timers.delete(timer);
        onNavigate?.(href);
      }, Math.max(0, navigationDelayMs));
      timers.add(timer);
      return;
    }

    revealContinuation(groupIndex);
  };

  const onClick = (event: Event) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.choice-link') : null;
    if (target && root.contains(target)) resolve(target, event);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.choice-link') : null;
    if (!target || !root.contains(target)) return;
    if (event.key === 'Enter' || event.key === ' ') {
      resolve(target, event);
      return;
    }
    if (!['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(event.key)) return;
    const group = target.closest<HTMLElement>('[data-reader-decision-group]');
    if (!group || group.dataset.state !== 'idle') return;
    const choices = Array.from(group.querySelectorAll<HTMLElement>('.choice-link'));
    const current = choices.indexOf(target);
    if (current < 0 || choices.length < 2) return;
    event.preventDefault();
    const direction = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    choices[(current + direction + choices.length) % choices.length]?.focus();
  };

  root.addEventListener('click', onClick);
  root.addEventListener('keydown', onKeyDown);
  return () => {
    root.removeEventListener('click', onClick);
    root.removeEventListener('keydown', onKeyDown);
    timers.forEach((timer) => clearTimeout(timer));
    continuations.forEach((fragment) => root.appendChild(fragment));
    if (storyCache && !storyCache.isConnected) root.appendChild(storyCache);
  };
}
