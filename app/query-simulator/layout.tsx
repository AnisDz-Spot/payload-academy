import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload Query Simulator — Where, Sort, Depth & Operators',
  description:
    'Build Payload where queries, sorts, limits and depth against sample data and see the evaluated result and equivalent GraphQL, live in your browser.',
  alternates: { canonical: `${SITE_URL}/query-simulator` },
};

export default function QuerySimulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
