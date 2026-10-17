import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload Access Control Matrix — RBAC Simulator',
  description:
    'Write Payload access control functions and watch them execute against guest, author, editor and admin personas to see exactly what each can read, update or delete.',
  alternates: { canonical: `${SITE_URL}/rbac-matrix` },
};

export default function RbacLayout({ children }: { children: React.ReactNode }) {
  return children;
}
