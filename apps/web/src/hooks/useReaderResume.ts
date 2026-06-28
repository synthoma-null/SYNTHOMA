"use client";

import { useCallback } from "react";
import { clearReaderResume, readReaderResume, saveReaderResume, type ReaderResume } from "../lib/readerState";

/**
 * Read and update the reader resume point. Persisted in localStorage.
 */
export function useReaderResume() {
  const pendingResume = readReaderResume();

  const save = useCallback((resume: ReaderResume) => {
    try {
      saveReaderResume(resume);
    } catch {}
  }, []);

  const clear = useCallback(() => {
    try {
      clearReaderResume();
    } catch {}
  }, []);

  return { pendingResume, saveResume: save, clearResume: clear };
}
