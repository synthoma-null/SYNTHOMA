export const READER_INFO_PATHS = new Set([
  '/data/SYNTHOMAINFO.html',
  '/data/SYNTHOMAINFO_en.html',
]);

export function isReaderInfoPath(reference: string | null | undefined): boolean {
  if (!reference) return false;
  try {
    return READER_INFO_PATHS.has(decodeURIComponent(reference));
  } catch {
    return false;
  }
}
