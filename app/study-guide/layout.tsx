import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload 3.x Study Guide & Certification Cheatsheet',
  description:
    'A dense revision cheatsheet for the Payload CMS certification exam: hooks, access control, queries, migrations, and deployment — condensed for last-minute review.',
  alternates: { canonical: `${SITE_URL}/study-guide` },
};

export default function StudyGuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
