import fs from 'node:fs';
import path from 'node:path';
import { CHAPTER_CATALOG, getBookCollection } from '../catalog';
import { getReaderDecisionContract } from '../readerDecisionCatalog';
import { validateReaderFlowDocument } from '../../lib/typewriterContent';

const validChapterIds = new Set(CHAPTER_CATALOG.map((chapter) => chapter.id));
const validChapterFilenames = new Set(
  CHAPTER_CATALOG.flatMap((chapter) => [chapter.filename, chapter.filenameEn].filter((name): name is string => Boolean(name))),
);

function sourceDirectory(accessPolicy: string, collection: string): string {
  const directory = getBookCollection(collection)?.directory ?? collection;
  return path.join(
    process.cwd(),
    accessPolicy === 'free' ? 'public/books' : 'src/content/protected',
    directory,
  );
}

function choiceSignatures(source: string): string[][] {
  const document = new DOMParser().parseFromString(source, 'text/html');
  const rows = Array.from(document.querySelectorAll<HTMLElement>('p.choice'));
  const signatures: string[][] = [];
  rows.forEach((row) => {
    if (row.previousElementSibling?.matches('p.choice')) return;
    const group: string[] = [];
    let cursor: Element | null = row;
    while (cursor instanceof HTMLElement && cursor.matches('p.choice')) {
      group.push((cursor.getAttribute('data-tags') ?? '').trim());
      cursor = cursor.nextElementSibling;
    }
    signatures.push(group);
  });
  return signatures;
}

describe('Reader decision catalog', () => {
  it('matches every published chapter source and its English variant', () => {
    const published = CHAPTER_CATALOG.filter((chapter) => chapter.availability === 'published');
    published.forEach((chapter) => {
      const contract = getReaderDecisionContract(chapter.id);
      expect(contract.length).toBeGreaterThan(0);
      const filenames = [chapter.filename, chapter.filenameEn].filter((value): value is string => Boolean(value));
      filenames.forEach((filename) => {
        const source = fs.readFileSync(path.join(sourceDirectory(chapter.accessPolicy, chapter.collection), filename), 'utf8');
        expect(choiceSignatures(source)).toEqual(
          contract.map((question) => question.choices.map((choice) => choice.sourceTag)),
        );
        const document = new DOMParser().parseFromString(source, 'text/html');
        expect(validateReaderFlowDocument(document, { validChapterIds, validChapterFilenames })).toEqual([]);
      });
    });
  });

  it('uses unique stable question and choice IDs within each chapter', () => {
    CHAPTER_CATALOG.filter((chapter) => chapter.availability === 'published').forEach((chapter) => {
      const contract = getReaderDecisionContract(chapter.id);
      expect(new Set(contract.map((question) => question.questionId)).size).toBe(contract.length);
      contract.forEach((question) => {
        expect(new Set(question.choices.map((choice) => choice.choiceId)).size).toBe(question.choices.length);
      });
    });
  });

  it('keeps published decision groups as top-level chapter nodes for flow segmentation', () => {
    CHAPTER_CATALOG.filter((chapter) => chapter.availability === 'published').forEach((chapter) => {
      const source = fs.readFileSync(
        path.join(sourceDirectory(chapter.accessPolicy, chapter.collection), chapter.filename),
        'utf8',
      );
      const document = new DOMParser().parseFromString(source, 'text/html');
      document.querySelectorAll('p.choice').forEach((row) => {
        expect(row.parentElement).toBe(document.body);
      });
    });
  });
});
