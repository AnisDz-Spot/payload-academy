import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, saveUserProgress, updateUserProStatus } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('pa_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ success: false, isGuest: true, message: 'Not authenticated' });
    }

    const sessionData = await getSessionUser(sessionToken);
    if (!sessionData) {
      return NextResponse.json({ success: false, isGuest: true, message: 'Invalid session' });
    }

    const body = await req.json();
    const {
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
    } = body;

    // Save progress
    const updatedProgress = await saveUserProgress(sessionData.user.id, {
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
    });

    // If pro status provided and changed
    if (typeof isPro === 'boolean' && planType) {
      await updateUserProStatus(sessionData.user.id, isPro, planType);
    }

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      syncedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Sync failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
