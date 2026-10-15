'use client'
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { LessonView } from '@/components/LessonView';

export default function HomePage() {
  return (
    <div className="app">
      <Sidebar />
      <main>
        <div className="wrap">
          <LessonView />
        </div>
      </main>
    </div>
  );
}
