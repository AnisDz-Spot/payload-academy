'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';
import { QUIZZES } from '@/data/quizzes';
import { CURRICULUM_MODULE_COUNT } from '@/data/curriculum';

export default function FinalExamPage() {
  const {
    toggleTheme,
    canTakeExam,
    toggleAdmin,
    completedLessons,
    completedQuizzes,
    setExamScore,
    examScore,
  } = useAcademy();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const lessonsCount = LESSONS.length;
  const completedLessonsCount = Object.keys(completedLessons).length;
  const completedQuizzesCount = Object.keys(completedQuizzes).length;

  const lessonsPct = Math.min(100, Math.round((completedLessonsCount / lessonsCount) * 100));
  const quizzesPct = Math.min(100, Math.round((completedQuizzesCount / lessonsCount) * 100));

  // ── Locked State Gating (Unless Admin) ───────────────────────────
  if (!canTakeExam) {
    return (
      <div className="standalone-page">
        <header className="standalone-header">
          <div className="standalone-header-inner">
            <Link href="/" className="back-link">← Back to Course</Link>
            <div className="logo-small">
              <i>P</i>
              <span>Final Exam Assessment</span>
            </div>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </header>

        <main className="standalone-main">
          <div className="wrap" style={{ maxWidth: 720 }}>
            <div className="exam-summary-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>🔒</div>
              <div className="kick" style={{ color: '#f59e0b' }}>Prerequisites Required</div>
              <h1 style={{ margin: '8px 0 12px' }}>Final Mastery Exam Locked</h1>
              <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 540, margin: '0 auto 28px', lineHeight: 1.6 }}>
                The Final Comprehensive Exam tests your mastery of the entire Payload 3.x architecture.
                To qualify for the exam, you must complete all {lessonsCount} curriculum lessons and pass their quick-check quizzes.
              </p>

              {/* Progress Checklist */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'left', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* 1. Lessons Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {completedLessonsCount >= lessonsCount ? '✅' : '○'} 1. Complete all {lessonsCount} Lessons
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>
                      {completedLessonsCount}/{lessonsCount} ({lessonsPct}%)
                    </span>
                  </div>
                  <div className="dash-bar-bg">
                    <div className="dash-bar-fill" style={{ width: `${lessonsPct}%` }} />
                  </div>
                </div>

                {/* 2. Quizzes Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {completedQuizzesCount >= lessonsCount ? '✅' : '○'} 2. Pass all {lessonsCount} Lesson Quizzes
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#10b981', fontWeight: 700 }}>
                      {completedQuizzesCount}/{lessonsCount} ({quizzesPct}%)
                    </span>
                  </div>
                  <div className="dash-bar-bg">
                    <div className="dash-bar-fill" style={{ width: `${quizzesPct}%`, background: '#10b981' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" className="sb-btn" style={{ padding: '10px 24px', fontSize: 14 }}>
                  📖 Resume Curriculum →
                </Link>
                <button
                  type="button"
                  onClick={toggleAdmin}
                  className="sb-btn sec"
                  style={{ padding: '10px 20px', fontSize: 14, borderColor: '#eab308', color: '#eab308' }}
                  title="Bypass prerequisites as an administrator"
                >
                  👑 Admin: Enable Override &amp; Take Exam
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSelectOption = (lessonId: string, optIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [lessonId]: optIndex,
    }));
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
  };

  const isFinished = currentIndex >= LESSONS.length;

  // ── Exam Finished Summary ────────────────────────────────────────
  if (isFinished) {
    let correctCount = 0;
    const moduleScores: Record<string, { total: number; correct: number }> = {};

    LESSONS.forEach(l => {
      const q = QUIZZES[l.id];
      if (!moduleScores[l.m]) moduleScores[l.m] = { total: 0, correct: 0 };
      moduleScores[l.m].total++;
      if (q && answers[l.id] === q.correct) {
        correctCount++;
        moduleScores[l.m].correct++;
      }
    });

    const finalScore = Math.round((correctCount / LESSONS.length) * 100);
    const passed = finalScore >= 80;

    // Save score to context & storage
    if (examScore !== finalScore) {
      setExamScore(finalScore);
    }

    return (
      <div className="standalone-page">
        <header className="standalone-header">
          <div className="standalone-header-inner">
            <Link href="/" className="back-link">← Back to Course</Link>
            <div className="logo-small">
              <i>P</i>
              <span>Final Exam Assessment</span>
            </div>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </header>

        <main className="standalone-main">
          <div className="wrap" style={{ maxWidth: 780 }}>
            <div className="exam-summary-card">
              <span style={{ fontSize: 48 }}>{passed ? '🏆' : '📚'}</span>
              <h1>{passed ? 'Congratulations! Exam Passed' : 'Assessment Completed'}</h1>
              <div className="exam-score-big" style={{ color: passed ? 'var(--green)' : 'var(--accent)' }}>
                {finalScore}%
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 15, margin: '8px 0 20px' }}>
                You scored <b>{correctCount}</b> out of <b>{LESSONS.length}</b> points across all {CURRICULUM_MODULE_COUNT} modules.
                {passed ? ' You met the 80% passing threshold for certification!' : ' The minimum passing score for certification is 80%.'}
              </p>

              <div className="exam-breakdown-grid">
                {Object.entries(moduleScores).map(([mod, s]) => (
                  <div key={mod} className="exam-breakdown-item">
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                      {mod}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)', marginTop: 2 }}>
                      {Math.round((s.correct / s.total) * 100)}% ({s.correct}/{s.total})
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                <button className="sb-btn sec" onClick={handleRestart}>
                  🔄 Retake Assessment
                </button>
                <Link href="/study-guide" className="sb-btn sec">
                  📚 Open Study Guide &amp; Cheatsheet
                </Link>
                {passed ? (
                  <Link href="/certificate" className="sb-btn" style={{ background: '#16a34a' }}>
                    🏆 Claim Verified Certificate →
                  </Link>
                ) : (
                  <Link href="/" className="sb-btn">
                    📖 Review Lessons &amp; Retake
                  </Link>
                )}
              </div>

              {/* Question by Question Review */}
              <div style={{ marginTop: 36, textAlign: 'left', borderTop: '1px solid var(--border)', paddingTop: 24 }}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: 16 }}>📋 Detailed Question Review</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {LESSONS.map((l, i) => {
                    const q = QUIZZES[l.id];
                    if (!q) return null;
                    const userChoice = answers[l.id];
                    const isCorrect = userChoice === q.correct;

                    return (
                      <div
                        key={l.id}
                        style={{
                          background: 'var(--bg)',
                          border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
                          borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                          borderRadius: 8,
                          padding: 14,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase' }}>
                            Question {i + 1} · {l.m}
                          </span>
                          <span className={`status-badge ${isCorrect ? 'completed' : 'in-progress'}`} style={{ fontSize: 10, color: isCorrect ? '#10b981' : '#ef4444' }}>
                            {isCorrect ? '✓ Correct' : '✗ Missed'}
                          </span>
                        </div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', margin: '4px 0 8px' }}>
                          {q.question}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                          <b>Correct Answer:</b> <span style={{ color: '#10b981', fontWeight: 600 }}>{q.options[q.correct]}</span>
                        </div>
                        {userChoice !== undefined && !isCorrect && (
                          <div style={{ fontSize: 12, color: '#ef4444', marginTop: 2 }}>
                            <b>Your Answer:</b> <span>{q.options[userChoice]}</span>
                          </div>
                        )}
                        <div style={{ background: 'var(--card)', padding: '8px 10px', borderRadius: 4, fontSize: 12, marginTop: 8, color: 'var(--text)' }}>
                          <b>💡 Explanation:</b> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Active Question View ─────────────────────────────────────────
  const lesson = LESSONS[currentIndex];
  const q = QUIZZES[lesson.id];
  const answered = answers[lesson.id] !== undefined;
  const chosen = answers[lesson.id];
  const pct = Math.round((currentIndex / LESSONS.length) * 100);

  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>P</i>
                <span>Mastery Assessment ({currentIndex + 1}/{lessonsCount})</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/query-simulator" className="t">🧪 Query Simulator</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <div className="exam-header">
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Question {currentIndex + 1} of {LESSONS.length}
            </span>
            <div className="exam-progress-bar">
              <b style={{ width: `${pct}%` }}></b>
            </div>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{pct}%</span>
          </div>

          <div className="exam-card">
            <span className="exam-mod-tag">
              {lesson.m} · Lesson {currentIndex + 1}
            </span>
            <h2 className="exam-q-title">{q ? q.question : 'Knowledge check'}</h2>
            <div className="exam-options">
              {q ? (
                q.options.map((opt, i) => {
                  let cls = 'qo';
                  if (answered) {
                    if (i === q.correct) cls += ' ok';
                    else if (i === chosen) cls += ' no';
                  }
                  return (
                    <button
                      key={i}
                      className={cls}
                      disabled={answered}
                      onClick={() => handleSelectOption(lesson.id, i)}
                    >
                      {opt}
                    </button>
                  );
                })
              ) : (
                <p>No question available for this lesson.</p>
              )}
            </div>

            {answered && q && (
              <div className="qx" style={{ marginTop: 18 }}>
                {chosen === q.correct ? '✅ Correct! ' : '❌ Incorrect. '}
                {q.explanation}
              </div>
            )}

            <div className="exam-nav-btns">
              <button
                className="sb-btn sec"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
              >
                ← Previous
              </button>
              <button
                className="sb-btn"
                disabled={!answered}
                onClick={() => setCurrentIndex(prev => prev + 1)}
              >
                {currentIndex === LESSONS.length - 1 ? 'Finish Assessment 🎉' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
