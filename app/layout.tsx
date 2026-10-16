import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { NavbarWrapper } from '@/components/NavbarWrapper';

// Self-hosted fonts via next/font (avoids the external <link> approach).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.APP_URL ||
  'https://payload-academy-tawny.vercel.app'
).replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Payload Academy — Master Payload CMS 3.x',
    template: '%s | Payload Academy',
  },
  description:
    'The definitive code-first Payload CMS mastery course. 50 hands-on lessons across 9 modules with AST-graded coding challenges, quizzes, and a certificate — covering collections, fields, access control, hooks, auth, rich text, jobs, plugins, storage, AI/RAG, and production deployment with Payload 3.x and Next.js 16.',
  applicationName: 'Payload Academy',
  keywords: [
    'Payload CMS', 'Payload 3.x', 'Next.js 16', 'headless CMS tutorial',
    'Payload CMS course', 'TypeScript CMS', 'Payload collections', 'Payload access control',
    'Payload hooks', 'Payload plugins', 'Payload auth',
  ],
  authors: [{ name: 'Payload Academy' }],
  creator: 'Payload Academy',
  category: 'education',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: 'Payload Academy',
    title: 'Payload Academy — Master Payload CMS 3.x',
    description:
      'Learn Payload CMS 3.x end-to-end: 50 lessons, 9 modules, 50 graded coding challenges, and a verifiable certificate. Built for Next.js 16.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload Academy — Master Payload CMS 3.x',
    description:
      'Learn Payload CMS 3.x end-to-end: 50 lessons, 9 modules, 50 graded coding challenges, and a verifiable certificate.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.className} ${jetbrainsMono.className}`}>
      <body>
        <Providers>
          <NavbarWrapper />
          <div className="below-navbar">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
