// lib/lessonRetrieval.ts
//
// A dependency-free lexical retriever over the course's own lesson content.
// Used to ground the AI tutor: the top-matching lessons are injected into the
// model prompt (and surfaced as citations) so answers reflect the curriculum
// instead of relying on the model's general knowledge alone.

import { LESSONS } from '@/data/lessons';
import type { Lesson } from '@/data/types';

export interface RetrievedLesson {
  id: string;
  title: string;
  module: string;
  difficulty?: string;
  snippet: string;
  score: number;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'are', 'but', 'not', 'you', 'your', 'with', 'this', 'that',
  'from', 'have', 'has', 'how', 'what', 'when', 'where', 'which', 'who', 'why',
  'can', 'does', 'did', 'into', 'out', 'use', 'using', 'used', 'get', 'gets',
  'payload', 'cms', 'please', 'about', 'need', 'want', 'make', 'made', 'way',
]);

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

interface IndexedLesson {
  lesson: Lesson;
  body: string;
  bodyLower: string;
  titleTokens: Set<string>;
  tagTokens: Set<string>;
  moduleTokens: Set<string>;
}

let index: IndexedLesson[] | null = null;

function getIndex(): IndexedLesson[] {
  if (index) return index;
  index = LESSONS.map((lesson) => {
    const body = stripHtml(lesson.c);
    return {
      lesson,
      body,
      bodyLower: body.toLowerCase(),
      titleTokens: new Set(tokenize(lesson.t)),
      tagTokens: new Set([...(lesson.tags || []), lesson.m].flatMap((s) => tokenize(s))),
      moduleTokens: new Set(tokenize(lesson.m)),
    };
  });
  return index;
}

function buildSnippet(item: IndexedLesson, queryTokens: string[]): string {
  const sentences = item.body.split(/(?<=[.!?])\s+/);
  const hit = sentences.find((s) => queryTokens.some((t) => s.toLowerCase().includes(t)));
  const chosen = hit || item.body;
  return chosen.slice(0, 260).trim() + (chosen.length > 260 ? '…' : '');
}

export function retrieveLessons(query: string, k = 4): RetrievedLesson[] {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const scored = getIndex().map((item) => {
    let score = 0;
    for (const token of queryTokens) {
      if (item.titleTokens.has(token)) score += 3;
      if (item.tagTokens.has(token)) score += 2.5;
      if (item.moduleTokens.has(token)) score += 1.5;
      const occurrences = item.bodyLower.split(token).length - 1;
      if (occurrences > 0) score += Math.min(occurrences, 4) * 0.6;
    }
    return { item, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, Math.min(k, 6)))
    .map(({ item, score }) => ({
      id: item.lesson.id,
      title: item.lesson.t,
      module: item.lesson.m,
      difficulty: item.lesson.difficulty,
      snippet: buildSnippet(item, queryTokens),
      score: Math.round(score * 100) / 100,
    }));
}

export function buildRetrievalContext(hits: RetrievedLesson[]): string {
  if (!hits.length) return '';
  return hits
    .map(
      (h, i) =>
        `[${i + 1}] "${h.title}" (module: ${h.module})\n${h.snippet}`,
    )
    .join('\n\n');
}
