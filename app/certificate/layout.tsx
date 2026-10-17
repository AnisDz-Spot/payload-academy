import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Certificate of Mastery',
  description: 'Claim and share your verifiable Payload CMS certificate.',
  robots: { index: false, follow: true },
};

export default function CertificateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
