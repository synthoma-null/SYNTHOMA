"use client";

import { useCallback, useState } from "react";
import { clearReaderResume, readReaderResume, saveReaderResume, type ReaderResume } from "../lib/readerState";

/**
 * Read and update the reader resume point. Persisted in localStorage.
 */
export function useReaderResume() {
  // Read once at mount so the returned object is stable and does not trigger
  // a re-run of dependent effects on every render.
  const [pendingResume] = useState(() => readReaderResume());

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
