import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload CLI Workbench — Interactive Command Simulator',
  description:
    'Explore the Payload CLI — generate:types, migrate, migrate:create, jobs:run and more — in an interactive terminal with realistic output.',
  alternates: { canonical: `${SITE_URL}/terminal` },
};

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
