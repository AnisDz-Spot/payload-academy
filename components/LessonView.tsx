'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useAcademy } from '@/context/AcademyContext';
import { LESSON_META } from '@/data/lessonMeta';
import { QUIZZES } from '@/data/quizzes';
import { CHALLENGES } from '@/data/challenges';
import { QuizCard } from './QuizCard';
import { NotesDrawer } from './NotesDrawer';
import { InteractiveChallenge } from './InteractiveChallenge';
import { ProPaywallBanner } from './ProPaywallBanner';
import { Spotlight } from '@/components/ui/spotlight';
import { PAYLOAD_VERIFIED_VERSION } from '@/data/curriculum';
import { getSessionUser } from '@/lib/db';
import { canAccessLesson, hasProAccess } from '@/lib/entitlements';
import { useRouter } from 'next/navigation';

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

function readingMins(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#?\w+;/g, ' ')
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

  const router = useRouter();
  const lessonMeta = LESSON_META[currentLessonIndex];
  const lessonId = lessonMeta?.id;

  // Fetch lesson body from server API.
  const [lessonBody, setLessonBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proRequired, setProRequired] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      setLoading(false);
      setError('No lesson ID');
      return;
    }

    setLoading(true);
    setError(null);
    setProRequired(false);

    fetch(`/api/lessons/${lessonId}`, {
      credentials: 'include',
    })
      .then(res => {
        if (res.status === 403) {
          setProRequired(true);
          return res.json().then(d => { setError(d.code || 'PRO_REQUIRED'); throw d; });
        }
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        setLessonBody(data.c);
      })
      .catch(err => {
        console.error('[LessonView] fetch error:', err);
        if (err instanceof Error && err.message === 'PRO_REQUIRED') {
          setProRequired(true);
          setError('This lesson is part of Academy Pro.');
        } else {
          setError('Failed to load lesson content.');
        }
      })
      .finally(() => setLoading(false));
  }, [lessonId]);

  // Resolve the full lesson record: merge metadata + fetched body.
  const resolvedTitle = lessonMeta?.t ?? '';
  const resolvedModule = lessonMeta?.m ?? '';
  const resolvedDifficulty = lessonMeta?.difficulty;
  const resolvedBadge = lessonMeta?.badge;
  const resolvedVerified = lessonMeta?.verified;
  const resolvedReadingMins = lessonMeta?.readingMins;
  const resolvedTags = lessonMeta?.tags ?? [];
  const resolvedRelatedIds = lessonMeta?.relatedIds ?? [];

  const isPro = hasProAccess(useAcademy().isPro ? { isPro: true, role: undefined } : undefined);

  // Build a lesson-like object for the rest of the component.
  const resolvedLesson = {
    id: lessonId ?? '',
    t: resolvedTitle,
    m: resolvedModule,
    r: lessonMeta?.r ?? [],
    badge: resolvedBadge,
    verified: resolvedVerified,
    readingMins: resolvedReadingMins,
    difficulty: lessonMeta?.difficulty,
    tags: resolvedTags,
    relatedIds: resolvedRelatedIds,
    c: lessonBody ?? '',
  };

  const isLocked = isLessonLocked(currentLessonIndex) || proRequired;

  const articleRef = useRef<HTMLElement>(null);
  const [tocItems, setTocItems] = useState<{ id: string; text: string; level: number }[]>([]);
  const [tocOpen, setTocOpen] = useState(false);

  const isDone = Boolean(completedLessons[resolvedLesson.id]);
  const isBookmarked = Boolean(bookmarks[resolvedLesson.id]);
  const feedback = lessonFeedback[resolvedLesson.id];
  const quiz = QUIZZES[resolvedLesson.id];
  const challenge = CHALLENGES[resolvedLesson.id];
  const mins = resolvedLesson.readingMins ?? readingMins(resolvedLesson.c || '');
  const diff = resolvedLesson.difficulty ? DIFF_LABELS[resolvedLesson.difficulty] : null;

  const prevLessonObj = currentLessonIndex > 0 ? LESSON_META[currentLessonIndex - 1] : null;
  const nextLessonObj = currentLessonIndex < LESSON_META.length - 1 ? LESSON_META[currentLessonIndex + 1] : null;

  // Related lessons from metadata.
  const relatedLessonIds = resolvedLesson.relatedIds;
  const relatedLessons = relatedLessonIds
    .map(id => LESSON_META.find(l => l.id === id))
    .filter(Boolean) as typeof LESSON_META;

  const suggestedRelated = relatedLessons.length === 0
    ? LESSON_META.filter(l => l.id !== resolvedLesson.id && l.m === resolvedLesson.m).slice(0, 3)
    : relatedLessons;

  // Attach copy buttons, syntax highlighting, build TOC.
  useEffect(() => {
    if (!articleRef.current || loading || proRequired || !resolvedLesson.c) return;

    // Build TOC from h2/h3 tags.
    const headings = articleRef.current.querySelectorAll('h2, h3');
    const items: { id: string; text: string; level: number }[] = [];
    headings.forEach((el, i) => {
      const id = `toc-${i}-${el.textContent?.replace(/\s+/g, '-').toLowerCase().slice(0, 30)}`;
      el.id = id;
      items.push({ id, text: el.textContent || '', level: el.tagName === 'H2' ? 2 : 3 });
    });
    setTocItems(items);

    // Attach copy buttons.
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

    // Syntax highlighting — single-pass tokenizer.
    const keywords = ['import', 'from', 'export', 'default', 'const', 'let', 'var', 'async', 'await', 'function', 'return', 'if', 'else', 'throw', 'new', 'try', 'catch', 'typeof', 'interface', 'type', 'extends', 'implements', 'as'];
    const types = ['CollectionConfig', 'GlobalConfig', 'CollectionAfterChangeHook', 'CollectionBeforeChangeHook', 'CollectionBeforeValidateHook', 'PayloadHandler', 'PayloadRequest', 'Payload', 'PaginatedDocs', 'NextConfig', 'Plugin', 'Metadata', 'string', 'number', 'boolean', 'Promise', 'Response'];
    const bools = ['true', 'false', 'null', 'undefined'];
    const token = new RegExp(
      [
        '\\/\\/[^\\n]*',
        "'(?:[^'\\\\\\n]|\\\\.)*'",
        '"(?:[^"\\\\\\n]|\\\\.)*"',
        '\\b(?:' + keywords.join('|') + ')\\b',
        '\\b(?:' + types.join('|') + ')\\b',
        '\\b(?:' + bools.join('|') + ')\\b',
        '\\b\\d+(?:\\.\\d+)?\\b',
      ].join('|'),
      'g',
    );
    const classify = (match: string): string => {
      if (match.startsWith('//')) return 'hl-comment';
      if (match.startsWith("'") || match.startsWith('"')) return 'hl-string';
      if (keywords.includes(match)) return 'hl-keyword';
      if (types.includes(match)) return 'hl-type';
      if (bools.includes(match)) return 'hl-bool';
      return 'hl-number';
    };
    const codeTags = articleRef.current.querySelectorAll('pre code');
    codeTags.forEach(block => {
      if ((block as HTMLElement).dataset.hl) return;
      (block as HTMLElement).dataset.hl = '1';
      const escaped = (block.textContent || '')
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>');
      block.innerHTML = escaped.replace(
        token,
        (match) => '<span class="' + classify(match) + '">' + match + '</span>',
      );
    });
  }, [loading, proRequired, resolvedLesson.c, lessonId]);

  // Reset TOC open state when lesson changes.
  useEffect(() => { setTocOpen(false); }, [lessonId]);

  return (
    <article ref={articleRef} id="art" className="lesson-article">

      <div className="lesson-header-card relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#f97316" />
        <div className="lesson-meta-bar relative z-10">
          <div className="kick flex items-center gap-2">
            <span>{resolvedModule}</span> · <span>Lesson {currentLessonIndex + 1} of {LESSON_META.length}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="lesson-meta-chip">
              ⏱ {mins} min read
            </span>
            {diff && (
              <span className="lesson-meta-chip" style={{ color: diff.color, borderColor: diff.color, background: `${diff.color}15` }}>
                {diff.label}
              </span>
            )}
            <span
              className="lesson-meta-chip"
              title={`Last verified against Payload v${resolvedVerified ?? PAYLOAD_VERIFIED_VERSION}`}
              style={{ color: '#10b981', borderColor: '#10b981', background: '#10b98115' }}
            >
              🔒 v{resolvedVerified ?? PAYLOAD_VERIFIED_VERSION}
            </span>
            {isDone ? (
              <span className="status-badge completed">✓ Completed</span>
            ) : (
              <span className="status-badge in-progress">In Progress</span>
            )}
          </div>
        </div>

        <h1 className="lesson-main-title relative z-10">
          {resolvedTitle}
          {resolvedBadge && <span className="version-badge">{resolvedBadge}</span>}
        </h1>

        <div className="lesson-tags-row">
          <div className="tags">
            {resolvedLesson.r.map(r => (
              <span key={r} className="role-tag">{ROLE_LABELS[r] || r}</span>
            ))}
            {resolvedLesson.tags?.map(tag => (
              <span key={tag} className="role-tag" style={{ background: 'var(--accent2)', color: 'var(--accent)', borderColor: 'var(--accent)' }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            <button className="quick-mark-btn" onClick={() => window.print()} title="Print or Save Lesson as PDF">🖨️ Print</button>
            <button
              className={`quick-mark-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(resolvedLesson.id)}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this lesson'}
            >
              {isBookmarked ? '🔖 Bookmarked' : '🏷 Bookmark'}
            </button>
            <button
              className={`quick-mark-btn ${isDone ? 'done' : ''}`}
              onClick={() => toggleComplete(resolvedLesson.id)}
              title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isDone ? '✓ Done' : '○ Mark Complete'}
            </button>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
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

      {/* Content area with access gating */}
      {loading ? (
        <div className="lesson-loading">Loading lesson...</div>
      ) : proRequired ? (
        <ProPaywallBanner lessonTitle={resolvedTitle} moduleName={resolvedModule} />
      ) : !lessonBody ? (
        <div className="lesson-error">Lesson content could not be loaded.</div>
      ) : (
        <div className="lesson-content-body" dangerouslySetInnerHTML={{ __html: lessonBody }} />
      )}

      {/* Interactive Challenge */}
      {!loading && !proRequired && challenge && (challenge.challengeText || challenge.docsPath) && (
        <InteractiveChallenge key={`challenge-${resolvedLesson.id}`} lessonId={resolvedLesson.id} challenge={challenge} />
      )}

      {!loading && !proRequired && quiz && <QuizCard key={`quiz-${resolvedLesson.id}`} quiz={quiz} lessonId={resolvedLesson.id} />}

      {/* Notes */}
      <NotesDrawer lessonId={resolvedLesson.id} />

      {/* Lesson Feedback */}
      <div className="lesson-feedback-bar">
        <span className="lesson-feedback-label">Was this lesson helpful?</span>
        <div className="lesson-feedback-btns">
          <button
            className={`feedback-btn ${feedback === 'up' ? 'selected-up' : ''}`}
            onClick={() => setFeedback(resolvedLesson.id, 'up')}
            disabled={Boolean(feedback)}
            title="Yes, helpful"
          >
            👍
          </button>
          <button
            className={`feedback-btn ${feedback === 'down' ? 'selected-down' : ''}`}
            onClick={() => setFeedback(resolvedLesson.id, 'down')}
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

      {/* Related Lessons */}
      {suggestedRelated.length > 0 && !loading && !proRequired && (
        <div className="related-lessons-card">
          <h3 className="related-lessons-title">📎 Related Lessons</h3>
          <div className="related-lessons-grid">
            {suggestedRelated.map(rel => {
              const idx = LESSON_META.indexOf(rel);
              const relDone = Boolean(completedLessons[rel.id]);
              return (
                <button
                  key={rel.id}
                  className={`related-lesson-item ${relDone ? 'done' : ''}`}
                  onClick={() => {
                    router.push(`/lesson/${rel.id}`);
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

      {/* Pager */}
      <div className="pager-container">
        <div className="pager">
          <button
            id="pv"
            className="pager-nav-btn prev"
            disabled={currentLessonIndex === 0 || loading || proRequired}
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
            onClick={() => toggleComplete(resolvedLesson.id)}
          >
            {isDone ? '✓ Completed' : 'Mark as Complete'}
          </button>
          <button
            id="nx"
            className="pager-nav-btn next"
            disabled={currentLessonIndex >= LESSON_META.length - 1 || loading || proRequired}
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