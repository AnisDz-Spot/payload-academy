'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';
import { QUIZZES } from '@/data/quizzes';
import { CHALLENGES } from '@/data/challenges';
import { QuizCard } from './QuizCard';
import { NotesDrawer } from './NotesDrawer';
import { InteractiveChallenge } from './InteractiveChallenge';
import { ProPaywallBanner } from './ProPaywallBanner';
import { Spotlight } from '@/components/ui/spotlight';
import { FlipWords } from '@/components/ui/flip-words';

const DOCS_BASE = 'https://payloadcms.com/docs/';
const ROLE_LABELS: Record<string, string> = {
  all: 'Fullstack / All Roles',
  frontend: 'Frontend & UI',
  backend: 'Backend & APIs',
  devops: 'DevOps & Infra',
};
const DIFF_LABELS: Record<string, { label: string; color: string }> = {
  beginner:     { label: 'Beginner',     color: '#10b981' },
  intermediate: { label: 'Intermediate', color: '#f59e0b' },
  advanced:     { label: 'Advanced',     color: '#ef4444' },
};

// Derive reading time from HTML content.
// Uses ~130 wpm — realistic for technical material with code snippets.
function readingMins(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, ' ')           // strip HTML tags (replace with space)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#?\w+;/g, ' ')           // strip remaining entities
    .replace(/\s+/g, ' ')
    .trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.round(words / 130));
}

export const LessonView: React.FC = () => {
  const {
    currentLessonIndex,
    completedLessons,
    toggleComplete,
    nextLesson,
    prevLesson,
    bookmarks,
    toggleBookmark,
    lessonFeedback,
    setFeedback,
    isLessonLocked,
  } = useAcademy();

  const isLocked = isLessonLocked(currentLessonIndex);

  const articleRef = useRef<HTMLElement>(null);
  const [tocItems, setTocItems] = useState<{ id: string; text: string; level: number }[]>([]);
  const [tocOpen, setTocOpen] = useState(false);

  const lesson = LESSONS[currentLessonIndex] || LESSONS[0];
  const isDone = Boolean(completedLessons[lesson.id]);
  const isBookmarked = Boolean(bookmarks[lesson.id]);
  const feedback = lessonFeedback[lesson.id];
  const quiz = QUIZZES[lesson.id];
  const challenge = CHALLENGES[lesson.id];
  const mins = lesson.readingMins ?? readingMins(lesson.c);
  const diff = lesson.difficulty ? DIFF_LABELS[lesson.difficulty] : null;

  const prevLessonObj = currentLessonIndex > 0 ? LESSONS[currentLessonIndex - 1] : null;
  const nextLessonObj = currentLessonIndex < LESSONS.length - 1 ? LESSONS[currentLessonIndex + 1] : null;

  // Related lessons
  const relatedLessons = (lesson.relatedIds ?? [])
    .map(id => LESSONS.find(l => l.id === id))
    .filter(Boolean) as typeof LESSONS;

  // Auto-suggest related if none declared: same module, nearby lessons
  const suggestedRelated = relatedLessons.length === 0
    ? LESSONS.filter(l => l.id !== lesson.id && l.m === lesson.m).slice(0, 3)
    : relatedLessons;

  // Attach copy buttons & syntax highlighting + build TOC
  useEffect(() => {
    if (!articleRef.current) return;

    // Build Table of Contents from h2/h3 tags
    const headings = articleRef.current.querySelectorAll('h2, h3');
    const items: { id: string; text: string; level: number }[] = [];
    headings.forEach((el, i) => {
      const id = `toc-${i}-${el.textContent?.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`;
      el.id = id;
      items.push({ id, text: el.textContent || '', level: el.tagName === 'H2' ? 2 : 3 });
    });
    setTocItems(items);

    // Attach copy buttons
    const codeBlocks = articleRef.current.querySelectorAll('.cb');
    codeBlocks.forEach(b => {
      if (b.querySelector('.cp')) return;
      const btn = document.createElement('button');
      btn.className = 'cp';
      btn.textContent = 'Copy';
      btn.onclick = () => {
        const text = b.querySelector('code')?.innerText || '';
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'Copied!';
          setTimeout(() => (btn.textContent = 'Copy'), 1600);
        });
      };
      b.appendChild(btn);
    });

    // Syntax highlighting
    const codeTags = articleRef.current.querySelectorAll('pre code');
    codeTags.forEach(block => {
      if ((block as HTMLElement).dataset.hl) return;
      (block as HTMLElement).dataset.hl = '1';
      let text = block.innerHTML;
      text = text.replace(/(\/\/[^\n]*)/g, '<span class="hl-comment">$1</span>');
      text = text.replace(/('(?:[^'\\\n]|\\.)*')/g, '<span class="hl-string">$1</span>');
      text = text.replace(/("(?:[^"\\\n]|\\.)*")/g, '<span class="hl-string">$1</span>');
      const keywords = ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'async', 'await', 'function', 'return', 'if', 'else', 'throw', 'new', 'try', 'catch', 'typeof'];
      keywords.forEach(kw => {
        const regex = new RegExp('\\b(' + kw + ')\\b', 'g');
        text = text.replace(regex, '<span class="hl-keyword">' + kw + '</span>');
      });
      const types = ['CollectionConfig', 'GlobalConfig', 'CollectionAfterChangeHook', 'CollectionBeforeChangeHook', 'PayloadHandler', 'PayloadRequest', 'Plugin', 'Metadata', 'string', 'number', 'boolean', 'Promise', 'Response'];
      types.forEach(t => {
        const regex = new RegExp('\\b(' + t + ')\\b', 'g');
        text = text.replace(regex, '<span class="hl-type">' + t + '</span>');
      });
      text = text.replace(/\b(true|false|null|undefined)\b/g, '<span class="hl-bool">$1</span>');
      block.innerHTML = text;
    });
  }, [lesson.id]);

  // Reset TOC open state when lesson changes.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional reset on lesson change */
  useEffect(() => { setTocOpen(false); }, [lesson.id]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <article ref={articleRef} id="art" className="lesson-article">

      {/* ── Lesson Header Card ── */}
      <div className="lesson-header-card relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#f97316" />
        <div className="lesson-meta-bar relative z-10">
          <div className="kick flex items-center gap-2">
            <span>{lesson.m}</span> · <span>Lesson {currentLessonIndex + 1} of {LESSONS.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Reading time */}
            <span className="lesson-meta-chip">
              ⏱ {mins} min read
            </span>
            {/* Difficulty */}
            {diff && (
              <span className="lesson-meta-chip" style={{ color: diff.color, borderColor: diff.color, background: `${diff.color}15` }}>
                {diff.label}
              </span>
            )}
            {/* Status */}
            {isDone ? (
              <span className="status-badge completed">✓ Completed</span>
            ) : (
              <span className="status-badge in-progress">In Progress</span>
            )}
          </div>
        </div>

        <h1 className="lesson-main-title relative z-10">
          {lesson.t}
          {lesson.badge && <span className="version-badge">{lesson.badge}</span>}
        </h1>

        <div className="lesson-tags-row">
          <div className="tags">
            {lesson.r.map(r => (
              <span key={r} className="role-tag">{ROLE_LABELS[r] || r}</span>
            ))}
            {lesson.tags?.map(tag => (
              <span key={tag} className="role-tag" style={{ background: 'var(--accent2)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {/* Print */}
            <button
              className="quick-mark-btn"
              onClick={() => window.print()}
              title="Print or Save Lesson as PDF"
            >
              🖨️ Print
            </button>
            {/* Bookmark */}
            <button
              className={`quick-mark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(lesson.id)}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            >
              {isBookmarked ? '🔖 Bookmarked' : '🏷 Bookmark'}
            </button>
            {/* Mark complete */}
            <button
              className={`quick-mark-btn ${isDone ? 'done' : ''}`}
              onClick={() => toggleComplete(lesson.id)}
              title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isDone ? '✓ Done' : '○ Mark Complete'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Table of Contents ── */}
      {!isLocked && tocItems.length >= 3 && (
        <div className="toc-card">
          <button className="toc-toggle" onClick={() => setTocOpen(p => !p)}>
            <span>📋 Table of Contents</span>
            <span className="toc-toggle-arrow">{tocOpen ? '▲' : '▼'}</span>
          </button>
          {tocOpen && (
            <nav className="toc-nav">
              {tocItems.map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="toc-link"
                  style={{ paddingLeft: item.level === 3 ? 28 : 14 }}
                  onClick={() => setTocOpen(false)}
                >
                  {item.level === 3 && <span className="toc-sub-indicator">↳</span>}
                  {item.text}
                </a>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* ── Locked Pro Paywall or Lesson Content ── */}
      {isLocked ? (
        <ProPaywallBanner lessonTitle={lesson.t} moduleName={lesson.m} />
      ) : (
        <>
          {/* ── Lesson Content ── */}
          <div className="lesson-content-body" dangerouslySetInnerHTML={{ __html: lesson.c }} />

          {/* ── Interactive Challenge & Tests ── */}
          {challenge && (challenge.challengeText || challenge.docsPath) && (
            <InteractiveChallenge key={`challenge-${lesson.id}`} lessonId={lesson.id} challenge={challenge} />
          )}

          {/* ── Quiz ── */}
          {quiz && <QuizCard key={`quiz-${lesson.id}`} quiz={quiz} lessonId={lesson.id} />}
        </>
      )}

      {/* ── Notes ── */}
      <NotesDrawer lessonId={lesson.id} />

      {/* ── Lesson Feedback ── */}
      <div className="lesson-feedback-bar">
        <span className="lesson-feedback-label">Was this lesson helpful?</span>
        <div className="lesson-feedback-btns">
          <button
            className={`feedback-btn ${feedback === 'up' ? 'selected-up' : ''}`}
            onClick={() => setFeedback(lesson.id, 'up')}
            disabled={Boolean(feedback)}
            title="Yes, helpful"
          >
            👍
          </button>
          <button
            className={`feedback-btn ${feedback === 'down' ? 'selected-down' : ''}`}
            onClick={() => setFeedback(lesson.id, 'down')}
            disabled={Boolean(feedback)}
            title="Needs improvement"
          >
            👎
          </button>
          {feedback && (
            <span className="feedback-thanks">
              {feedback === 'up' ? 'Thanks for the feedback! 🎉' : 'Thanks — we\'ll improve this lesson.'}
            </span>
          )}
        </div>
      </div>

      {/* ── Related Lessons ── */}
      {suggestedRelated.length > 0 && (
        <div className="related-lessons-card">
          <h3 className="related-lessons-title">📎 Related Lessons</h3>
          <div className="related-lessons-grid">
            {suggestedRelated.map(rel => {
              const idx = LESSONS.indexOf(rel);
              const relDone = Boolean(completedLessons[rel.id]);
              return (
                <button
                  key={rel.id}
                  className={`related-lesson-item ${relDone ? 'done' : ''}`}
                  onClick={() => {
                    // Navigate to lesson — fire a custom event the sidebar can listen to
                    window.dispatchEvent(new CustomEvent('navigate-lesson', { detail: idx }));
                  }}
                >
                  <span className="related-dot" />
                  <div className="related-text">
                    <span className="related-module">{rel.m}</span>
                    <span className="related-title">{rel.t}</span>
                  </div>
                  {relDone && <span className="related-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Pager ── */}
      <div className="pager-container">
        <div className="pager">
          <button
            id="pv"
            className="pager-nav-btn prev"
            disabled={currentLessonIndex === 0}
            onClick={prevLesson}
          >
            <span className="pager-arrow">←</span>
            <div className="pager-text-wrap">
              <span className="pager-sub">Previous</span>
              <span className="pager-title">{prevLessonObj ? prevLessonObj.t : 'Beginning'}</span>
            </div>
          </button>
          <button
            className={`pager-complete-btn ${isDone ? 'done-btn' : ''}`}
            id="dn"
            onClick={() => toggleComplete(lesson.id)}
          >
            {isDone ? '✓ Completed' : 'Mark as Complete'}
          </button>
          <button
            id="nx"
            className="pager-nav-btn next"
            disabled={currentLessonIndex === LESSONS.length - 1}
            onClick={nextLesson}
          >
            <div className="pager-text-wrap align-right">
              <span className="pager-sub">Next</span>
              <span className="pager-title">{nextLessonObj ? nextLessonObj.t : 'Assessment'}</span>
            </div>
            <span className="pager-arrow">→</span>
          </button>
        </div>
      </div>
    </article>
  );
};
