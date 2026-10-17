import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Final Exam',
  description: 'Pass the proctored final exam to qualify for your Payload Academy certificate.',
  robots: { index: false, follow: true },
};

export default function FinalExamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
