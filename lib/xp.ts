import { ACHIEVEMENTS } from '../data/achievements';

// ── Streak helpers (shared by client context and server leaderboard) ──
export function todayKey(): string {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

export function computeStreak(days: string[]): number {
  if (!days.length) return 0;
  const sorted = [...new Set(days)].sort().reverse();
  const today = todayKey();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
  let streak = 0;
  let expected = sorted[0] === today ? today : yesterday;
  for (const d of sorted) {
    if (d === expected) {
      streak++;
      const dt = new Date(expected);
      dt.setDate(dt.getDate() - 1);
      expected = dt.toISOString().slice(0, 10);
    } else break;
  }
  return streak;
}

// ── XP model ──
export interface XpState {
  completedLessonsCount: number;
  completedQuizzesCount: number;
  streak: number;
  examScore: number | null;
  bookmarksCount: number;
  notesCount: number;
  isAdmin: boolean;
}

// Total XP is the sum of every achievement whose condition is currently met.
export function computeXp(state: XpState): number {
  return ACHIEVEMENTS.reduce((sum, a) => (a.condition(state) ? sum + a.xp : sum), 0);
}

// Level curve: 300 XP per level (level 1 starts at 0 XP).
export const XP_PER_LEVEL = 300;

export function levelFromXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

// Derive XP state from a raw progress snapshot (works for DB rows and local state).
export function xpStateFromProgress(progress: {
  completedLessons?: Record<string, boolean>;
  completedQuizzes?: Record<string, boolean>;
  examScore?: number | null;
  bookmarks?: Record<string, boolean>;
  userNotes?: Record<string, string>;
  studyDays?: string[];
} | null | undefined, isAdmin = false): XpState {
  const p = progress || {};
  return {
    completedLessonsCount: Object.keys(p.completedLessons || {}).length,
    completedQuizzesCount: Object.keys(p.completedQuizzes || {}).length,
    streak: computeStreak(p.studyDays || []),
    examScore: p.examScore ?? null,
    bookmarksCount: Object.keys(p.bookmarks || {}).filter((k) => (p.bookmarks || {})[k]).length,
    notesCount: Object.keys(p.userNotes || {}).filter((k) => (p.userNotes || {})[k]?.trim()).length,
    isAdmin,
  };
}
