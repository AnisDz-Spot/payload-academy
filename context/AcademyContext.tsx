'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LESSONS } from '@/data/lessons';
import { Role } from '@/data/types';

import { ACHIEVEMENTS, Achievement } from '@/data/achievements';

export type ModalType = 'none' | 'schema' | 'command' | 'backup' | 'shortcuts' | 'ai' | 'pomodoro' | 'onboarding' | 'auth';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'admin';
  isPro: boolean;
  planType: 'free' | 'monthly' | 'annual' | 'lifetime';
  createdAt: string;
}

// ─── Streak helpers ───────────────────────────────────────────────
function todayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

function computeStreak(days: string[]): number {
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

// ─── Context type ─────────────────────────────────────────────────
interface AcademyContextType {
  currentLessonIndex: number;
  setCurrentLessonIndex: (index: number) => void;
  roleFilter: Role;
  setRoleFilter: (role: Role) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  completedLessons: Record<string, boolean>;
  toggleComplete: (lessonId: string) => void;
  completedQuizzes: Record<string, boolean>;
  recordQuizPass: (lessonId: string) => void;
  examScore: number | null;
  setExamScore: (score: number) => void;
  canTakeExam: boolean;
  canClaimCertificate: boolean;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  toggleAdmin: () => void;
  isPro: boolean;
  setIsPro: (val: boolean) => void;
  planType: 'free' | 'monthly' | 'annual' | 'lifetime';
  setPlanType: (plan: 'free' | 'monthly' | 'annual' | 'lifetime') => void;
  togglePro: () => void;
  isLessonLocked: (lessonIndex: number) => boolean;
  userNotes: Record<string, string>;
  setNote: (lessonId: string, note: string) => void;
  bookmarks: Record<string, boolean>;
  toggleBookmark: (lessonId: string) => void;
  lessonFeedback: Record<string, 'up' | 'down'>;
  setFeedback: (lessonId: string, val: 'up' | 'down') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  nextLesson: () => void;
  prevLesson: () => void;
  streak: number;
  studyDays: string[];
  showCelebration: boolean;
  dismissCelebration: () => void;
  celebrationModule: string;
  unlockedAchievements: Achievement[];
  totalXp: number;
  // Auth & DB Persistence
  user: UserProfile | null;
  isGuest: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline' | 'guest';
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  openAuthModal: (tab?: 'login' | 'register') => void;
  login: (email: string, password: string, mergeGuestData?: boolean) => Promise<{ success: boolean; error?: string; code?: string }>;
  register: (email: string, password: string, name?: string, avatar?: string, mergeGuestData?: boolean) => Promise<{ success: boolean; error?: string; previewUrl?: string }>;
  logout: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const AcademyContext = createContext<AcademyContextType | null>(null);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [roleFilter, setRoleFilter] = useState<Role>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [examScore, setExamScoreState] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [planType, setPlanType] = useState<'free' | 'monthly' | 'annual' | 'lifetime'>('free');
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  const [lessonFeedback, setLessonFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // User & DB persistence state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'guest'>('guest');
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const isGuest = !user;

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<ModalType>('none');
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [studyDays, setStudyDays] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationModule, setCelebrationModule] = useState<string>('');

  const openAuthModal = useCallback((tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setActiveModal('auth');
  }, []);

  const streak = computeStreak(studyDays);

  const completedLessonsCount = Object.keys(completedLessons).length;
  const completedQuizzesCount = Object.keys(completedQuizzes).length;
  const bookmarksCount = Object.keys(bookmarks).filter(k => bookmarks[k]).length;
  const notesCount = Object.keys(userNotes).filter(k => userNotes[k]?.trim()).length;
  const canTakeExam = isAdmin || (isPro && completedLessonsCount >= LESSONS.length && completedQuizzesCount >= LESSONS.length);
  const canClaimCertificate = isAdmin || (isPro && examScore !== null && examScore >= 80);

  const isLessonLocked = useCallback((lessonIndex: number) => {
    if (isAdmin || isPro) return false;
    return lessonIndex >= 10;
  }, [isAdmin, isPro]);

  const togglePro = useCallback(() => {
    setIsPro(prev => {
      const next = !prev;
      setPlanType(next ? 'monthly' : 'free');
      return next;
    });
  }, []);

  const unlockedAchievements = ACHIEVEMENTS.filter(a =>
    a.condition({
      completedLessonsCount,
      completedQuizzesCount,
      streak,
      examScore,
      bookmarksCount,
      notesCount,
      isAdmin,
    })
  );

  const totalXp = unlockedAchievements.reduce((sum, a) => sum + a.xp, 0);

  // ── Record today as a study day ────────────────────────────────
  const recordStudyDay = useCallback(() => {
    const today = todayKey();
    setStudyDays(prev => {
      if (prev.includes(today)) return prev;
      const next = [...prev, today];
      try { window.localStorage.setItem('pa-days', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  // ── Hydrate from localStorage and API ──────────────────────────
  // One-time hydration on mount: read persisted `pa-*` keys, then fetch authenticated user.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional one-time localStorage hydration */
  useEffect(() => {
    let localData: any = {};
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedDone     = JSON.parse(window.localStorage.getItem('pa-done')       || '{}');
        const savedQuizzes  = JSON.parse(window.localStorage.getItem('pa-quizzes')    || '{}');
        const savedExam     = window.localStorage.getItem('pa-exam-score');
        const savedCur      = Number(window.localStorage.getItem('pa-cur')            || '0');
        const savedRole     = (window.localStorage.getItem('pa-role')                 || 'all') as Role;
        const savedNotes    = JSON.parse(window.localStorage.getItem('pa-notes')      || '{}');
        const savedTheme    = (window.localStorage.getItem('pa-theme')                || 'dark') as 'dark' | 'light';
        const savedBkmarks  = JSON.parse(window.localStorage.getItem('pa-bookmarks')  || '{}');
        const savedFeedback = JSON.parse(window.localStorage.getItem('pa-feedback')   || '{}');
        const savedDays     = JSON.parse(window.localStorage.getItem('pa-days')       || '[]');
        const savedAdmin    = window.localStorage.getItem('pa-admin') === 'true';
        const savedPro      = window.localStorage.getItem('pa-pro') === 'true';
        const savedPlan     = (window.localStorage.getItem('pa-plan') || 'free') as 'free' | 'monthly' | 'annual' | 'lifetime';

        setCompletedLessons(savedDone);
        setCompletedQuizzes(savedQuizzes);
        if (savedExam !== null) setExamScoreState(Number(savedExam));
        setIsAdmin(savedAdmin);
        setIsPro(savedPro);
        setPlanType(savedPlan);
        setCurrentLessonIndex(Math.min(Math.max(0, savedCur), LESSONS.length - 1));
        setRoleFilter(savedRole);
        setUserNotes(savedNotes);
        setTheme(savedTheme);
        setBookmarks(savedBkmarks);
        setLessonFeedback(savedFeedback);
        setStudyDays(savedDays);

        localData = {
          completedLessons: savedDone,
          completedQuizzes: savedQuizzes,
          examScore: savedExam !== null ? Number(savedExam) : null,
          userNotes: savedNotes,
          bookmarks: savedBkmarks,
          lessonFeedback: savedFeedback,
          studyDays: savedDays,
          theme: savedTheme,
          currentLessonIndex: savedCur,
        };

        if (typeof document !== 'undefined' && document.documentElement) {
          document.documentElement.setAttribute('data-theme', savedTheme);
        }
      }
    } catch (e) {
      console.error('Failed to read localStorage:', e);
    }
    setIsHydrated(true);

    // Now check if user is logged in
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setIsPro(data.user.isPro);
          setPlanType(data.user.planType);
          if (data.user.role === 'admin') setIsAdmin(true);

          if (data.progress) {
            // Merge server DB progress
            setCompletedLessons(prev => ({ ...prev, ...(data.progress.completedLessons || {}) }));
            setCompletedQuizzes(prev => ({ ...prev, ...(data.progress.completedQuizzes || {}) }));
            if (data.progress.examScore !== null && data.progress.examScore !== undefined) {
              setExamScoreState(data.progress.examScore);
            }
            setUserNotes(prev => ({ ...prev, ...(data.progress.userNotes || {}) }));
            setBookmarks(prev => ({ ...prev, ...(data.progress.bookmarks || {}) }));
            setLessonFeedback(prev => ({ ...prev, ...(data.progress.lessonFeedback || {}) }));
            if (Array.isArray(data.progress.studyDays) && data.progress.studyDays.length) {
              setStudyDays(prev => Array.from(new Set([...prev, ...data.progress.studyDays])));
            }
            if (data.progress.theme) {
              setTheme(data.progress.theme);
              if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.setAttribute('data-theme', data.progress.theme);
              }
            }
            if (typeof data.progress.soundEnabled === 'boolean') {
              setSoundEnabled(data.progress.soundEnabled);
            }
          }
          setSyncStatus('synced');
        } else {
          setUser(null);
          setSyncStatus('guest');
        }
      })
      .catch(err => {
        console.error('Failed to fetch user session:', err);
        setSyncStatus('offline');
      });
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // ── Sync to DB helper ──────────────────────────────────────────
  const syncNow = useCallback(async () => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const res = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completedLessons,
          completedQuizzes,
          examScore,
          userNotes,
          bookmarks,
          lessonFeedback,
          studyDays,
          theme,
          soundEnabled,
          currentLessonIndex,
          isPro,
          planType,
        }),
      });
      if (res.ok) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('offline');
      }
    } catch {
      setSyncStatus('offline');
    }
  }, [user, completedLessons, completedQuizzes, examScore, userNotes, bookmarks, lessonFeedback, studyDays, theme, soundEnabled, currentLessonIndex, isPro, planType]);

  // Debounced auto-sync to DB when authenticated user makes progress
  useEffect(() => {
    if (!isHydrated || !user) return;
    const timer = setTimeout(() => {
      syncNow();
    }, 1200);
    return () => clearTimeout(timer);
  }, [completedLessons, completedQuizzes, examScore, userNotes, bookmarks, lessonFeedback, studyDays, theme, soundEnabled, currentLessonIndex, isPro, planType, user, isHydrated, syncNow]);

  // ── Persist to localStorage ────────────────────────────────────
  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('pa-done',        JSON.stringify(completedLessons));
        window.localStorage.setItem('pa-quizzes',     JSON.stringify(completedQuizzes));
        if (examScore !== null) window.localStorage.setItem('pa-exam-score', examScore.toString());
        window.localStorage.setItem('pa-admin',       isAdmin ? 'true' : 'false');
        window.localStorage.setItem('pa-pro',         isPro ? 'true' : 'false');
        window.localStorage.setItem('pa-plan',        planType);
        window.localStorage.setItem('pa-cur',         currentLessonIndex.toString());
        window.localStorage.setItem('pa-role',        roleFilter);
        window.localStorage.setItem('pa-notes',       JSON.stringify(userNotes));
        window.localStorage.setItem('pa-theme',       theme);
        window.localStorage.setItem('pa-bookmarks',   JSON.stringify(bookmarks));
        window.localStorage.setItem('pa-feedback',    JSON.stringify(lessonFeedback));
        if (typeof document !== 'undefined' && document.documentElement) {
          document.documentElement.setAttribute('data-theme', theme);
        }
      }
    } catch (e) {
      console.error('Failed to write localStorage:', e);
    }
  }, [completedLessons, completedQuizzes, examScore, isAdmin, isPro, planType, currentLessonIndex, roleFilter, userNotes, theme, bookmarks, lessonFeedback, isHydrated]);

  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
  }, []);

  // ── completeLesson — idempotently mark a lesson done (with module celebration) ──
  const completeLesson = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev[lessonId]) return prev;
      const next = { ...prev, [lessonId]: true };

      // Record study activity
      recordStudyDay();

      // Check if this completes a module
      const lesson = LESSONS.find(l => l.id === lessonId);
      if (lesson) {
        const moduleLessons = LESSONS.filter(l => l.m === lesson.m);
        const allDone = moduleLessons.every(l => next[l.id]);
        if (allDone) {
          setCelebrationModule(lesson.m);
          setShowCelebration(true);
        }
      }
      return next;
    });
  }, [recordStudyDay]);

  const recordQuizPass = useCallback((lessonId: string) => {
    setCompletedQuizzes(prev => {
      if (prev[lessonId]) return prev;
      recordStudyDay();
      return { ...prev, [lessonId]: true };
    });
    // Passing a lesson's quiz marks the lesson itself complete.
    completeLesson(lessonId);
  }, [recordStudyDay, completeLesson]);

  const setExamScore = useCallback((score: number) => {
    setExamScoreState(score);
    recordStudyDay();
    try {
      window.localStorage.setItem('pa-exam-score', score.toString());
    } catch {}
  }, [recordStudyDay]);

  // ── toggleComplete — with module celebration ───────────────────
  const toggleComplete = useCallback((lessonId: string) => {
    if (completedLessons[lessonId]) {
      setCompletedLessons(prev => {
        const next = { ...prev };
        delete next[lessonId];
        return next;
      });
      return;
    }
    completeLesson(lessonId);
  }, [completedLessons, completeLesson]);

  const setNote = (lessonId: string, note: string) => {
    setUserNotes(prev => ({ ...prev, [lessonId]: note }));
  };

  const toggleBookmark = (lessonId: string) => {
    setBookmarks(prev => {
      const next = { ...prev };
      if (next[lessonId]) delete next[lessonId]; else next[lessonId] = true;
      return next;
    });
  };

  const setFeedback = (lessonId: string, val: 'up' | 'down') => {
    setLessonFeedback(prev => ({ ...prev, [lessonId]: val }));
  };

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const dismissCelebration = () => setShowCelebration(false);

  const nextLesson = useCallback(() => {
    if (currentLessonIndex < LESSONS.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      closeSidebar();
      recordStudyDay();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLessonIndex, recordStudyDay]);

  const prevLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      closeSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentLessonIndex]);

  // ── Scroll lock ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const lock = activeModal !== 'none';
    document.body.style.overflow = lock ? 'hidden' : '';
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    document.body.classList.toggle('modal-open', lock);
    document.documentElement.classList.toggle('modal-open', lock);
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('modal-open');
      document.documentElement.classList.remove('modal-open');
    };
  }, [activeModal]);

  // ── Global keyboard shortcuts ──────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement as HTMLElement)?.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setActiveModal(prev => (prev === 'command' ? 'none' : 'command'));
        return;
      }
      if (e.key === 'Escape') { setActiveModal('none'); closeSidebar(); return; }
      if (isTyping) return;

      if (e.key === '/') { e.preventDefault(); setActiveModal('command'); }
      else if (e.key === '?') { e.preventDefault(); setActiveModal('shortcuts'); }
      else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'j') nextLesson();
      else if (e.key === 'ArrowLeft'  || e.key.toLowerCase() === 'k') prevLesson();
      else if (e.key.toLowerCase() === 'm') {
        const l = LESSONS[currentLessonIndex];
        if (l) toggleComplete(l.id);
      } else if (e.key.toLowerCase() === 'b') {
        const l = LESSONS[currentLessonIndex];
        if (l) toggleBookmark(l.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLessonIndex, nextLesson, prevLesson, toggleComplete]);

  // ── navigate-lesson custom event (from Related Lessons panel) ─
  useEffect(() => {
    const handler = (e: Event) => {
      const idx = (e as CustomEvent<number>).detail;
      if (typeof idx === 'number' && idx >= 0 && idx < LESSONS.length) {
        setCurrentLessonIndex(idx);
        closeSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('navigate-lesson', handler);
    return () => window.removeEventListener('navigate-lesson', handler);
  }, []);

  const login = useCallback(async (email: string, password: string, mergeGuestData: boolean = true) => {
    try {
      const guestProgress = mergeGuestData ? {
        completedLessons,
        completedQuizzes,
        examScore,
        userNotes,
        bookmarks,
        lessonFeedback,
        studyDays,
        theme,
        soundEnabled,
        currentLessonIndex,
      } : undefined;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, guestProgress }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to login', code: data.code };
      }

      setUser(data.user);
      setIsPro(data.user.isPro);
      setPlanType(data.user.planType);
      if (data.user.role === 'admin') setIsAdmin(true);

      if (data.progress) {
        setCompletedLessons(prev => ({ ...prev, ...(data.progress.completedLessons || {}) }));
        setCompletedQuizzes(prev => ({ ...prev, ...(data.progress.completedQuizzes || {}) }));
        if (data.progress.examScore !== null && data.progress.examScore !== undefined) {
          setExamScoreState(data.progress.examScore);
        }
        setUserNotes(prev => ({ ...prev, ...(data.progress.userNotes || {}) }));
        setBookmarks(prev => ({ ...prev, ...(data.progress.bookmarks || {}) }));
        setLessonFeedback(prev => ({ ...prev, ...(data.progress.lessonFeedback || {}) }));
        if (Array.isArray(data.progress.studyDays) && data.progress.studyDays.length) {
          setStudyDays(prev => Array.from(new Set([...prev, ...data.progress.studyDays])));
        }
      }

      setSyncStatus('synced');
      setActiveModal('none');
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message };
    }
  }, [completedLessons, completedQuizzes, examScore, userNotes, bookmarks, lessonFeedback, studyDays, theme, soundEnabled, currentLessonIndex]);

  const register = useCallback(async (email: string, password: string, name?: string, avatar?: string, mergeGuestData: boolean = true) => {
    try {
      const guestProgress = mergeGuestData ? {
        completedLessons,
        completedQuizzes,
        examScore,
        userNotes,
        bookmarks,
        lessonFeedback,
        studyDays,
        theme,
        soundEnabled,
        currentLessonIndex,
      } : undefined;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, avatar, guestProgress }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }

      // Registration now requires email verification before a session is issued.
      // The server returns { success, email, name, emailSent, warning?, previewUrl? } —
      // NOT a user object. We do NOT set user state here; the user must click the
      // verification link first.
      return { success: true, previewUrl: data.previewUrl, emailSent: data.emailSent, warning: data.warning };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Network error';
      return { success: false, error: message };
    }
  }, [completedLessons, completedQuizzes, examScore, userNotes, bookmarks, lessonFeedback, studyDays, theme, soundEnabled, currentLessonIndex]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setUser(null);
    setSyncStatus('guest');
  }, []);

  return (
    <AcademyContext.Provider
      value={{
        currentLessonIndex,
        setCurrentLessonIndex: (i) => {
          setCurrentLessonIndex(i);
          closeSidebar();
          recordStudyDay();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        roleFilter, setRoleFilter,
        searchQuery, setSearchQuery,
        completedLessons, toggleComplete,
        completedQuizzes, recordQuizPass,
        examScore, setExamScore,
        canTakeExam, canClaimCertificate,
        isAdmin, setIsAdmin, toggleAdmin,
        isPro, setIsPro, planType, setPlanType, togglePro,
        isLessonLocked,
        userNotes, setNote,
        bookmarks, toggleBookmark,
        lessonFeedback, setFeedback,
        theme, toggleTheme,
        soundEnabled, toggleSound,
        isSidebarOpen, toggleSidebar, closeSidebar,
        activeModal, setActiveModal,
        nextLesson, prevLesson,
        streak, studyDays,
        showCelebration, dismissCelebration, celebrationModule,
        unlockedAchievements, totalXp,
        // Auth & DB
        user,
        isGuest,
        syncStatus,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        login,
        register,
        logout,
        syncNow,
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = () => {
  const context = useContext(AcademyContext);
  if (!context) throw new Error('useAcademy must be used within an AcademyProvider');
  return context;
};
