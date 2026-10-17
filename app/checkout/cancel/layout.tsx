import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Checkout Cancelled',
  robots: { index: false, follow: false },
};

export default function CheckoutCancelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
