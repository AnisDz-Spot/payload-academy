import React from 'react';
import type { Metadata } from 'next';
import { FlashcardsDeck } from '@/components/FlashcardsDeck';
import { GLOSSARY } from '@/data/glossary';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Payload CMS Flashcards — Study the Glossary',
  description: `Drill the ${GLOSSARY.length} key Payload CMS terms — collections, hooks, access control, adapters, jobs, RAG and more — with a keyboard-friendly flashcard deck from ${SITE_NAME}.`,
  alternates: { canonical: `${SITE_URL}/flashcards` },
};

export default function FlashcardsPage() {
  return <FlashcardsDeck />;
}
