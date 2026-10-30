import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, saveUserProgress } from '@/lib/db';

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
    } = body;

    // Entitlement (`isPro` / `planType`) is deliberately NOT read from the
    // request body: it is written only by the Stripe webhook. Accepting it here
    // would let any signed-in learner grant themselves Pro access.
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
