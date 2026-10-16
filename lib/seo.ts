// lib/seo.ts
//
// Small, dependency-free helpers shared by the indexable lesson routes,
// sitemap and structured-data generation. Server-only.

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.APP_URL ||
  'https://payload-academy-tawny.vercel.app'
).replace(/\/$/, '');

export const SITE_NAME = 'Payload Academy';

// Lessons at index >= FREE_LESSON_COUNT are part of the Pro tier. Their public
// pages stay indexable but only expose a preview outline rather than the full
// paid body.
export const FREE_LESSON_COUNT = 10;

export function isFreeLesson(index: number): boolean {
  return index < FREE_LESSON_COUNT;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<\/(p|h[1-6]|li|tr|div|blockquote)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// A meta-description-safe summary of a lesson.
export function lessonDescription(html: string, max = 158): string {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

// A longer plain-text preview used for Pro lessons in place of the full body.
export function lessonPreview(html: string, max = 1100): string {
  const text = stripHtml(html);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

// Extracts the h2/h3 headings to build a "what this lesson covers" outline.
export function lessonOutline(html: string): string[] {
  const out: string[] = [];
  const re = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = stripHtml(m[1]);
    if (text) out.push(text);
  }
  return out;
}

export function docsUrl(docsPath: string | undefined): string | undefined {
  return docsPath ? `https://payloadcms.com/docs/${docsPath}` : undefined;
}
