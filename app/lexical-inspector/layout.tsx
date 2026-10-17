import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Lexical AST Inspector — Payload Rich Text JSON',
  description:
    'Inspect the Lexical JSON AST that Payload stores for rich text, and see how each node serializes to HTML and React.',
  alternates: { canonical: `${SITE_URL}/lexical-inspector` },
};

export default function LexicalInspectorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
