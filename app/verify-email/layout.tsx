import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Verify Email',
  description: 'Confirm your email address to activate your Payload Academy account.',
  robots: { index: false, follow: false },
};

export default function VerifyEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
