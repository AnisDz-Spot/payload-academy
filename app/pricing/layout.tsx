import type { Metadata } from 'next';
import React from 'react';
import { SITE_URL } from '@/lib/seo';
import { LESSON_COUNT } from '@/data/curriculum';

export const metadata: Metadata = {
  title: 'Pricing — Free & Pro Plans',
  description:
    `Start free with the first lessons, glossary, flashcards and most tools. Go Pro to unlock all ${LESSON_COUNT} lessons, the proctored final exam, and a verifiable Open Badges certificate.`,
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
