export const SYNTHOMA_INTRO_VERSION = '3';
export const SYNTHOMA_INTRO_STORAGE_KEY = 'synthoma:intro:v3:completed';

// Memory only: a full page load starts a new intro; client navigation does not.
let completedForDocument = false;
export function completeIntroForDocument() { completedForDocument = true; }
export function isIntroCompleteForDocument() { return completedForDocument; }
