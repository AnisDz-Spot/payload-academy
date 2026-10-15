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

export const metadata: Metadata = {
  title: 'Payload Academy – Master Payload CMS 3.x',
  description: 'The definitive code-first Payload CMS mastery course. Master collections, fields, access control, hooks, auth, rich text, jobs, plugins, storage adapters, AI/RAG integrations, Server Actions, transactions, and production deployment with Payload 3.x and Next.js 15.',
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
