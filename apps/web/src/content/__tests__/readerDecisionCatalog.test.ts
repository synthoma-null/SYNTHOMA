import fs from 'node:fs';
import path from 'node:path';
import { CHAPTER_CATALOG } from '../catalog';
import { getReaderDecisionContract } from '../readerDecisionCatalog';

function sourceDirectory(accessPolicy: string, collection: string): string {
  return path.join(
    process.cwd(),
    accessPolicy === 'free' ? 'public/books' : 'src/content/protected',
    collection,
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
});
