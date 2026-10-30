// lib/entitlements.ts
//
// Single source of truth for what an account is allowed to open. Both the API
// routes and the UI read from here so the paywall can never drift between
// client and server. Entitlement is derived from the database user only —
// never from request bodies or localStorage.

import { FREE_LESSON_COUNT } from '@/data/curriculum';

export interface EntitlementUser {
  role?: string | null;
  isPro?: boolean | null;
}

export function isAdminUser(user: EntitlementUser | null | undefined): boolean {
  return user?.role === 'admin';
}

/** Pro-tier access: paid subscription, lifetime plan, or staff. */
export function hasProAccess(user: EntitlementUser | null | undefined): boolean {
  if (!user) return false;
  return Boolean(user.isPro) || isAdminUser(user);
}

/** Lessons below FREE_LESSON_COUNT are public; the rest require Pro. */
export function isFreeLessonIndex(lessonIndex: number): boolean {
  return lessonIndex >= 0 && lessonIndex < FREE_LESSON_COUNT;
}

export function canAccessLesson(
  user: EntitlementUser | null | undefined,
  lessonIndex: number,
): boolean {
  if (lessonIndex < 0) return false;
  return isFreeLessonIndex(lessonIndex) || hasProAccess(user);
}

/** AI tutor, graded challenges on Pro lessons, certificate relinking, etc. */
export function canUseProFeatures(user: EntitlementUser | null | undefined): boolean {
  return hasProAccess(user);
}
