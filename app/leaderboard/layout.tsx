import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Leaderboard — Top Payload Learners',
  description:
    'See the most active Payload Academy learners ranked by XP, completed lessons and streaks. Progress is earned by finishing lessons, quizzes and challenges.',
  alternates: { canonical: `${SITE_URL}/leaderboard` },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
