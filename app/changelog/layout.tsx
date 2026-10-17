import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Changelog — Payload 3.x Release Tracking',
  description:
    'How Payload Academy tracks upstream Payload CMS releases — what changed, when, and which lessons were updated to match each version.',
  alternates: { canonical: `${SITE_URL}/changelog` },
};

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
