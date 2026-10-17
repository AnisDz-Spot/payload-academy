import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Live Preview Studio — Payload postMessage Simulator',
  description:
    'Simulate how Payload Live Preview streams draft data into your frontend over postMessage, with editable draft fields and a live frame.',
  alternates: { canonical: `${SITE_URL}/live-preview-simulator` },
};

export default function LivePreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
