import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload Config Linter — Real AST Security Analysis',
  description:
    'Paste a payload.config.ts and get a real static AST analysis: insecure CORS/CSRF, hardcoded secrets, missing access control, performance pitfalls and more.',
  alternates: { canonical: `${SITE_URL}/config-linter` },
};

export default function ConfigLinterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
