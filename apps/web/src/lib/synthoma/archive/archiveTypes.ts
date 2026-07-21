export type ArchiveCardAccessMode = 'free' | 'chapter' | 'mnems' | 'chapter_or_mnems';
export type ArchiveCardVisibility = 'full' | 'teaser' | 'hidden';

export interface ArchiveCardAccess {
  mode: ArchiveCardAccessMode;
  visibility: ArchiveCardVisibility;
  requiredChapterId: string | null;
  requiredChapterTitle: string | null;
  mnemCost: number;
  label: string;
  lockedText?: string | undefined;
  reason?: string | undefined;
  isLockedByDefault?: boolean | undefined;
  lockKind?: string | undefined;
}

export interface ArchiveCard {
  id: string;
  category: string;
  title: string;
  teaser: string;
  quote?: string | undefined;
  body: string[];
  summary?: string | undefined;
  details?: string[] | undefined;
  sourceBook?: 'synthoma-null' | 'konec-podpory' | undefined;
  unlockChapter?: string | undefined;
  speakerId?: string | undefined;
  tags?: string[] | undefined;
  spoilerLevel?: number | undefined;
  display?: {
    icon?: string | undefined;
    accent?: string | undefined;
    variant?: string | undefined;
  } | undefined;
  related?: string[] | undefined;
  images?: Array<{ src: string; alt: string }> | undefined;
  access?: ArchiveCardAccess | undefined;
  order?: number | undefined;
  isLockedByDefault?: boolean | undefined;
  lockKind?: string | undefined;
}

export interface ArchiveProgressRecord {
  chapterId: string;
  completed: boolean;
  progressPercent?: number | undefined;
  collection?: string | undefined;
  chapterTitle?: string | undefined;
}

export interface ArchiveProfileState {
  mnemBalance: number;
  isAuthenticated: boolean;
}

export interface ArchiveWhisper {
  id: string;
  publicMode: string;
  type: string;
  text: string;
  placement: string;
  chapterId: string | null;
  resonanceCount: number;
  displayCount: number;
  boostedUntil: string | null;
  approvedAt: string | null;
  resonated?: boolean | undefined;
}

export interface ArchiveCyklusMemory {
  findings: Array<{
    id: string;
    title: string;
    description: string;
    earnedAt: number;
  }>;
  metaUnlocks: string[];
  activeRun: boolean;
  historyCount: number;
}

export interface ArchiveRunMemory {
  activeRun: boolean;
  savedAt?: string | undefined;
}

export interface ArchiveSnapshot {
  cards: ArchiveCard[];
  progress: ArchiveProgressRecord[];
  profile: ArchiveProfileState;
  whispers: ArchiveWhisper[];
  cyklus: ArchiveCyklusMemory;
  run: ArchiveRunMemory;
  loading: boolean;
  error: string | null;
}

export type ArchiveSection = 'records' | 'progress' | 'cyklus' | 'whispers';
