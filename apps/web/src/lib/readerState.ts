import { readStorage, readStorageJSON, removeStorage, writeStorage, writeStorageJSON } from "./browser";

export type ReaderResume = {
  chapterPath: string;
  dataNext?: string;
  hash?: string;
};

export type ReadingProgressEntry = {
  bookId: string;
  chapterId?: string;
  path: string;
  percent: number;
  completed?: boolean;
  lastBlockId?: string;
  updatedAt: number;
};

export type ChoiceGroupState = {
  groupKey: string;   // identifikátor skupiny (id elementu nebo index v dokumentu)
  chosenText: string; // text zvolené volby
  chosenIdx: number;  // index v rámci skupiny
  dataNext?: string;  // data-next atribut zvolené volby (pokud existuje)
  chapterId?: string;
  collection?: string;
  choiceId?: string;
  tags?: string[];
  href?: string;
  selectedAt?: number;
};

export function getChoicesStateKey(srcUrl: string): string {
  return `choicesState:${srcUrl}`;
}

export function saveChoicesState(srcUrl: string, state: ChoiceGroupState[]): void {
  writeStorageJSON(getChoicesStateKey(srcUrl), state);
}

export function readChoicesState(srcUrl: string): ChoiceGroupState[] {
  return readStorageJSON<ChoiceGroupState[]>(getChoicesStateKey(srcUrl), []);
}

export function clearChoicesState(srcUrl: string): void {
  removeStorage(getChoicesStateKey(srcUrl));
}

export function saveLastChapterPath(path: string): void {
  writeStorage("lastChapterPath", path);
}

export function readLastChapterPath(): string {
  return readStorage("lastChapterPath", "") || "";
}

export function saveReaderResume(resume: ReaderResume): void {
  writeStorageJSON("readerResume", resume);
}

export function readReaderResume(): ReaderResume | null {
  return readStorageJSON<ReaderResume | null>("readerResume", null);
}

export function clearReaderResume(): void {
  removeStorage("readerResume");
}

export function getReadingProgressKey(bookId: string): string {
  return `readingProgress:${bookId}`;
}

export function saveReadingProgress(entry: ReadingProgressEntry): void {
  writeStorageJSON(getReadingProgressKey(entry.bookId), entry);
}

export function readReadingProgress(bookId: string): ReadingProgressEntry | null {
  return readStorageJSON<ReadingProgressEntry | null>(getReadingProgressKey(bookId), null);
}
