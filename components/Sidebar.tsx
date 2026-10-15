'use client'
import React from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';
import { Role } from '@/data/types';

const ROLES: { key: Role; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'devops', label: 'DevOps' },
];

export const Sidebar: React.FC = () => {
  const {
    currentLessonIndex,
    setCurrentLessonIndex,
    roleFilter,
    setRoleFilter,
    searchQuery,
    setSearchQuery,
    completedLessons,
    isSidebarOpen,
    isLessonLocked,
  } = useAcademy();

  const filteredLessons = LESSONS.filter(lesson => {
    if (roleFilter !== 'all' && !lesson.r.includes(roleFilter) && !lesson.r.includes('all')) {
      return false;
    }
    if (roleFilter !== 'all' && !lesson.r.includes(roleFilter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = lesson.t.toLowerCase().includes(q);
      const matchModule = lesson.m.toLowerCase().includes(q);
      const matchContent = lesson.c.toLowerCase().includes(q);
      if (!matchTitle && !matchModule && !matchContent) return false;
    }
    return true;
  });

  const completedCount = Object.keys(completedLessons).length;
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100);

  let lastModule = '';

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <input
        type="search"
        placeholder="Search 50 lessons… (/)"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search lessons"
      />

      <div className="roles">
        {ROLES.map(r => (
          <button
            key={r.key}
            className={`chip ${roleFilter === r.key ? 'on' : ''}`}
            onClick={() => setRoleFilter(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="pbar-wrap">
        <div className="pbar-label">
          <span>{progressPercent}% complete</span>
          <span>{completedCount} / {LESSONS.length} lessons</span>
        </div>
        <div className="bar">
          <b style={{ width: `${progressPercent}%` }}></b>
        </div>
      </div>

      <nav>
        {filteredLessons.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: 13, padding: '8px 10px' }}>
            No lessons match your search.
          </p>
        ) : (

          filteredLessons.map(lesson => {
            const index = LESSONS.indexOf(lesson);
            const isDone = Boolean(completedLessons[lesson.id]);
            const isCurrent = currentLessonIndex === index;
            const showModuleHeader = lesson.m !== lastModule;
            if (showModuleHeader) lastModule = lesson.m;

            const isProTier = index >= 10;
            const isLocked = isLessonLocked(index);

            return (
              <React.Fragment key={lesson.id}>
                {showModuleHeader && (
                  <div className="mod flex items-center justify-between">
                    <span>{lesson.m}</span>
                    {isProTier && !isLocked && <span className="text-[10px] text-orange-400 font-bold">PRO</span>}
                  </div>
                )}
                <a
                  className={`${isCurrent ? 'act' : ''} ${isDone ? 'done' : ''} ${isLocked ? 'locked-lesson' : ''}`}
                  onClick={() => setCurrentLessonIndex(index)}
                >
                  <span className={`d ${isLocked && !isDone ? 'locked' : ''}`} />
                  <span className="lesson-title">{lesson.t}</span>
                  {isLocked ? (
                    <span className="sidebar-badge locked">🔒 PRO</span>
                  ) : isProTier ? (
                    <span className="sidebar-badge pro">PRO</span>
                  ) : (
                    <span className="sidebar-badge free">FREE</span>
                  )}
                </a>
              </React.Fragment>
            );
          })
        )}

        <div className="mod" style={{ marginTop: 28 }}>Developer Tools &amp; Hub</div>
        <div className="sidebar-tools-grid">
          <Link href="/dashboard" className="sidebar-tool-link">
            <span>📊</span> Dashboard
          </Link>
          <Link href="/pricing" className="sidebar-tool-link">
            <span>💳</span> Pricing
          </Link>
          <Link href="/live-preview-simulator" className="sidebar-tool-link">
            <span>🖥️</span> Live Preview
          </Link>
          <Link href="/rbac-matrix" className="sidebar-tool-link">
            <span>🛡️</span> RBAC Matrix
          </Link>
          <Link href="/lexical-inspector" className="sidebar-tool-link">
            <span>📜</span> Lexical AST
          </Link>
          <Link href="/schema-builder" className="sidebar-tool-link">
            <span>⚙️</span> Schema Studio
          </Link>
          <Link href="/query-simulator" className="sidebar-tool-link">
            <span>🧪</span> Query Simulator
          </Link>
          <Link href="/terminal" className="sidebar-tool-link">
            <span>💻</span> CLI Workbench
          </Link>
          <Link href="/db-visualizer" className="sidebar-tool-link">
            <span>🗄️</span> Drizzle SQL
          </Link>
          <Link href="/config-linter" className="sidebar-tool-link">
            <span>🛡️</span> Config Linter
          </Link>
          <Link href="/study-guide" className="sidebar-tool-link">
            <span>📖</span> Study Guide
          </Link>
          <Link href="/glossary" className="sidebar-tool-link">
            <span>📚</span> Glossary
          </Link>
          <Link href="/final-exam" className="sidebar-tool-link">
            <span>🎓</span> Final Exam
          </Link>
          <Link href="/certificate" className="sidebar-tool-link">
            <span>🏆</span> Certificate
          </Link>
        </div>

        <div className="mod" style={{ marginTop: 24 }}>Community &amp; Official</div>
        <div className="sidebar-tools-grid">
          <a
            href="https://discord.com/invite/payload"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-tool-link"
          >
            <span>💬</span> Discord Community
          </a>
          <a
            href="https://github.com/payloadcms/payload"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-tool-link"
          >
            <span>⭐</span> GitHub Repo
          </a>
          <a
            href="https://payloadcms.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-tool-link"
          >
            <span>📖</span> Official Docs
          </a>
          <a
            href="https://payloadcms.com/community-help"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-tool-link"
          >
            <span>🚀</span> Payload Cloud
          </a>
        </div>
      </nav>
    </aside>
  );
};

