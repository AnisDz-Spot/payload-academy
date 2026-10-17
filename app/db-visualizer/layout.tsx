import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Drizzle SQL Visualizer — Payload Schema to Database',
  description:
    'Parse a Payload config and see the resulting PostgreSQL schema — columns, types, and foreign keys — the way the Drizzle adapter would provision it.',
  alternates: { canonical: `${SITE_URL}/db-visualizer` },
};

export default function DbVisualizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
