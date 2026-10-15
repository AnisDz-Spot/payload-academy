'use client'
import React from 'react';
import { useAcademy } from '@/context/AcademyContext';

export const NotesDrawer: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const { userNotes, setNote } = useAcademy();

  return (
    <div className="notes-drawer">
      <h4>
        <span>📝 Your Personal Study Notes</span>
        <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 500 }}>Auto-saved to browser</span>
      </h4>
      <textarea
        className="notes-textarea"
        placeholder="Add custom takeaways, edge-cases, or project ideas for this chapter..."
        value={userNotes[lessonId] || ''}
        onChange={(e) => setNote(lessonId, e.target.value)}
      />
    </div>
  );
};
