'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAcademy } from '@/context/AcademyContext';
import { LESSONS } from '@/data/lessons';

export const CommandPaletteModal: React.FC = () => {
  const router = useRouter();
  const {
    activeModal,
    setActiveModal,
    setCurrentLessonIndex,
    toggleTheme,
    currentLessonIndex,
    toggleComplete,
  } = useAcademy();

  const isOpen = activeModal === 'command';
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset transient UI state each time the palette opens.
  /* eslint-disable react-hooks/set-state-in-effect -- intentional reset on open */
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!isOpen) return null;

  const quickActions = [
    { id: 'act-tour', title: '✨ Start Student Onboarding Tour', subtitle: 'Action', action: () => setActiveModal('onboarding') },
    { id: 'act-pricing', title: '💳 View Pricing & Subscribe', subtitle: 'Action', action: () => { router.push('/pricing'); setActiveModal('none'); } },
    { id: 'act-live', title: '🖥️ Open Live Preview & postMessage Studio', subtitle: 'Tool', action: () => { router.push('/live-preview-simulator'); setActiveModal('none'); } },
    { id: 'act-rbac', title: '🛡️ Open Visual RBAC & RLS Matrix Simulator', subtitle: 'Tool', action: () => { router.push('/rbac-matrix'); setActiveModal('none'); } },
    { id: 'act-lex', title: '📜 Open Lexical AST Inspector & React Serializer', subtitle: 'Tool', action: () => { router.push('/lexical-inspector'); setActiveModal('none'); } },
    { id: 'act-sb', title: '⚙️ Open Visual Schema Studio', subtitle: 'Tool', action: () => { router.push('/schema-builder'); setActiveModal('none'); } },
    { id: 'act-qp', title: '🧪 Open Query & REST Simulator', subtitle: 'Tool', action: () => { router.push('/query-simulator'); setActiveModal('none'); } },
    { id: 'act-term', title: '💻 Open CLI & Terminal Workbench', subtitle: 'Tool', action: () => { router.push('/terminal'); setActiveModal('none'); } },
    { id: 'act-db', title: '🗄️ Open Drizzle & SQL Visualizer', subtitle: 'Tool', action: () => { router.push('/db-visualizer'); setActiveModal('none'); } },
    { id: 'act-linter', title: '🛡️ Open Production Config Linter', subtitle: 'Tool', action: () => { router.push('/config-linter'); setActiveModal('none'); } },
    { id: 'act-guide', title: '📖 Open Study Guide & Cheatsheet', subtitle: 'Tool', action: () => { router.push('/study-guide'); setActiveModal('none'); } },
    { id: 'act-exam', title: '🎓 Start Final Exam', subtitle: 'Action', action: () => { router.push('/final-exam'); setActiveModal('none'); } },
    { id: 'act-cert', title: '🏆 View Certificate of Mastery', subtitle: 'Action', action: () => { router.push('/certificate'); setActiveModal('none'); } },
    { id: 'act-theme', title: '◐ Toggle Light / Dark Theme', subtitle: 'Action', action: () => { toggleTheme(); setActiveModal('none'); } },
    { id: 'act-complete', title: '✓ Toggle Current Lesson Complete', subtitle: 'Action', action: () => { toggleComplete(LESSONS[currentLessonIndex].id); setActiveModal('none'); } },
    { id: 'act-backup', title: '💾 Backup / Restore Progress', subtitle: 'Action', action: () => setActiveModal('backup') },
  ];

  const filteredItems: Array<{ id: string; title: string; subtitle: string; isLesson?: boolean; lessonIndex?: number; action?: () => void }> = [];

  const q = query.toLowerCase().trim();

  // Actions
  quickActions.forEach(a => {
    if (!q || a.title.toLowerCase().includes(q)) {
      filteredItems.push(a);
    }
  });

  // Lessons
  LESSONS.forEach((l, idx) => {
    if (!q || l.t.toLowerCase().includes(q) || l.m.toLowerCase().includes(q)) {
      filteredItems.push({
        id: 'lesson-' + idx,
        title: l.t,
        subtitle: l.m,
        isLesson: true,
        lessonIndex: idx,
      });
    }
  });

  const handleSelect = (index: number) => {
    const item = filteredItems[index];
    if (!item) return;
    setActiveModal('none');
    if (item.isLesson && item.lessonIndex !== undefined) {
      setCurrentLessonIndex(item.lessonIndex);
    } else if (item.action) {
      item.action();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(selectedIndex);
    }
  };

  return (
    <div className="modal-backdrop open" onClick={(e) => { if (e.target === e.currentTarget) setActiveModal('none'); }}>
      <div className="cp-modal">
        <div className="cp-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="cp-input"
            placeholder="Type a lesson, command, or action..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <span className="cp-kbd">ESC</span>
        </div>

        <div className="cp-results">
          {filteredItems.length === 0 ? (
            <div style={{ padding: 16, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              No matching lessons or actions found.
            </div>
          ) : (
            filteredItems.map((item, i) => (
              <div
                key={item.id}
                className={`cp-item ${i === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelect(i)}
              >
                <div className="cp-item-title">
                  <span>{item.isLesson ? '📖 ' : ''}{item.title}</span>
                </div>
                <span className="cp-item-mod">{item.subtitle}</span>
              </div>
            ))
          )}
        </div>

        <div className="cp-footer">
          <div className="cp-shortcuts">
            <span><b className="cp-kbd">↑↓</b> Navigate</span>
            <span><b className="cp-kbd">↵</b> Select</span>
            <span><b className="cp-kbd">ESC</b> Close</span>
          </div>
          <span>Payload Academy 3.x</span>
        </div>
      </div>
    </div>
  );
};
