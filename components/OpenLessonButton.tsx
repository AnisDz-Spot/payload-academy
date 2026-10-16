'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { LESSONS } from '@/data/lessons';

// Deep-links into the in-app course player by writing the target lesson index
// to the same localStorage key the AcademyContext hydrates from, then routing
// to the course.
export const OpenLessonButton: React.FC<{
  lessonId: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ lessonId, className, style, children }) => {
  const router = useRouter();

  const open = () => {
    const idx = LESSONS.findIndex(l => l.id === lessonId);
    try {
      window.localStorage.setItem('pa-cur', String(idx >= 0 ? idx : 0));
    } catch {}
    router.push('/');
  };

  return (
    <button type="button" className={className} style={style} onClick={open}>
      {children ?? 'Open in Academy'}
    </button>
  );
};
