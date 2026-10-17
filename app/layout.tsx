import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { NavbarWrapper } from '@/components/NavbarWrapper';
import { LESSON_COUNT, CURRICULUM_MODULE_COUNT } from '@/data/curriculum';

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
    `The definitive code-first Payload CMS mastery course. ${LESSON_COUNT} hands-on lessons across ${CURRICULUM_MODULE_COUNT} modules with AST-graded coding challenges, quizzes, and a certificate — covering collections, fields, access control, hooks, auth, rich text, jobs, plugins, storage, AI/RAG, and production deployment with Payload 3.x and Next.js 16.`,
  applicationName: 'Payload Academy',
  manifest: '/manifest.webmanifest',
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  keywords: [
    'Payload CMS', 'Payload 3.x', 'Next.js 16', 'headless CMS tutorial',
    'Payload CMS course', 'TypeScript CMS', 'Payload collections', 'Payload access control',
    'Payload hooks', 'Payload plugins', 'Payload auth',
  ],
  authors: [{ name: 'Payload Academy' }],
  creator: 'Payload Academy',
  category: 'education',
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': `${SITE_URL}/blog/rss.xml` },
  },
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
      `Learn Payload CMS 3.x end-to-end: ${LESSON_COUNT} lessons, ${CURRICULUM_MODULE_COUNT} modules, ${LESSON_COUNT} graded coding challenges, and a verifiable certificate. Built for Next.js 16.`,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload Academy — Master Payload CMS 3.x',
    description:
      `Learn Payload CMS 3.x end-to-end: ${LESSON_COUNT} lessons, ${CURRICULUM_MODULE_COUNT} modules, ${LESSON_COUNT} graded coding challenges, and a verifiable certificate.`,
  },
};

export const viewport: Viewport = {
  themeColor: '#090d16',
  colorScheme: 'dark light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.className} ${jetbrainsMono.className}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Providers>
          <NavbarWrapper />
          <main id="main-content" className="below-navbar">
            {children}
          </main>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
