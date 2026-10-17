import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload Schema Studio — Visual Collection Builder',
  description:
    'Compose Payload collections and fields visually and generate the matching TypeScript config you can copy straight into your project.',
  alternates: { canonical: `${SITE_URL}/schema-builder` },
};

export default function SchemaBuilderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
