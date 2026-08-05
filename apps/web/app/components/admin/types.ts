export interface Overview {
  userCount: number;
  activeUsers7d: number;
  newUsers30d: number;
  ledgerCount: number;
  unusedCodes: number;
  usedCodes: number;
  pendingWhispers: number;
  approvedWhispers: number;
  totalMnemBalance: number;
  auditCount: number;
  managedBookCount: number;
  managedChapterCount: number;
  generatedAt: string;
}

export interface UserResult {
  id: string;
  email: string;
  nickname: string;
  role: string;
  createdAt: string;
  lastLoginAt: string | null;
  mnemBalance: number;
}

export interface LedgerEntry {
  id: string;
  amount: number;
  reason: string;
  createdAt: string;
}

export interface UserDetail extends UserResult {
  profile: { displayName?: string; bio?: string; title?: string } | null;
  settings: { theme?: string; animations?: boolean; typewriterSpeed?: string; ttsEnabled?: boolean } | null;
  recentLedger: LedgerEntry[];
  recentReading: { chapterId: string; chapterTitle?: string; progressPercent: number; completed: boolean }[];
  recentChoices: { chapterId: string; choiceText: string; createdAt: string }[];
  run: { cycleNumber: number; stability: number; memoryPressure: number; shadow: number } | null;
  artifacts: { artifactId: string }[];
  badges: { badgeId: string }[];
}

export interface AdminWhisper {
  id: string;
  userId: string;
  type: string;
  text: string;
  status: string;
  placement: string;
  chapterId: string | null;
  resonanceCount: number;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actorUserId: string;
  targetUserId: string;
  action: string;
  reference: string | null;
  metadata: unknown;
  createdAt: string;
  actor: { id: string; nickname: string; email: string } | null;
  target: { id: string; nickname: string; email: string } | null;
}

export type AdminContentAccess = 'inherit' | 'free' | 'entitlement';
export type AdminContentVisibility = 'published' | 'hidden';

export interface AdminContentChapter {
  id: string;
  title: string;
  titleEn: string | null;
  ordinal: string;
  summary: string;
  sortOrder: number;
  visibility: AdminContentVisibility;
  accessPolicy: AdminContentAccess;
  effectiveAccessPolicy: 'free' | 'entitlement';
  mnemCost: number | null;
  isCustom: boolean;
  overridden: boolean;
  hasBodyOverride: boolean;
  updatedAt: string | null;
}

export interface AdminContentBook {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  cover: string | null;
  language: 'cs';
  sortOrder: number;
  status: 'complete' | 'ongoing';
  visibility: AdminContentVisibility;
  accessPolicy: AdminContentAccess;
  isCustom: boolean;
  overridden: boolean;
  updatedAt: string | null;
  chapters: AdminContentChapter[];
}

export interface AdminContentSnapshot { books: AdminContentBook[] }

export interface AdminContentChapterDetail extends Omit<AdminContentChapter, 'hasBodyOverride' | 'updatedAt' | 'overridden'> {
  bookId: string;
  bodyHtml: string;
  bodyHtmlEn: string;
}

export type AdminTab = 'overview' | 'content' | 'users' | 'mnems' | 'codes' | 'whispers' | 'audit';
