import { readStorage, readStorageJSON, removeStorage, writeStorage, writeStorageJSON } from "./browser";

export type ReaderResume = {
  chapterPath: string;
  dataNext?: string;
  hash?: string;
};

export type ReadingProgressEntry = {
  bookId: string;
  path: string;
  percent: number;
  updatedAt: number;
};

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
