import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Certificate Verification',
  description: 'Confirm the authenticity of a Payload Academy certificate.',
  robots: { index: false, follow: true },
};

export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
