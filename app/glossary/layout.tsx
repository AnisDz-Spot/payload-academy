import type { Metadata } from 'next';
import React from 'react';
import { GLOSSARY } from '@/data/glossary';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload CMS Glossary — Key Terms Explained',
  description: `Every core Payload CMS term in one place — collections, globals, hooks, access control, depth, adapters, jobs, RAG and more. ${GLOSSARY.length} definitions with code examples.`,
  alternates: { canonical: `${SITE_URL}/glossary` },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
