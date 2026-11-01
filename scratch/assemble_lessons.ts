// scratch/assemble_lessons.ts
// One-off content pipeline: merges the lesson builder modules into
// `data/lessons.ts`. Run from the project root:
//   npx tsx scratch/assemble_lessons.ts
import fs from 'node:fs';
import path from 'node:path';

import type { Lesson } from '../data/types';
import b1 from './builder_foundations_core';
import b2 from './builder_security_content';
import b3 from './builder_data_admin';
import b4 from './builder_advanced_arch';
import b5 from './builder_projects';

const allLessons: Lesson[] = [...b1, ...b2, ...b3, ...b4, ...b5];

console.log(`Loaded ${allLessons.length} lessons.`);

// Function to calculate accurate reading minutes based on text + code
function computeReadingTime(html: string): number {
  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#?\w+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = text.split(' ').length;
  // Around 130 words/min accounts for technical code reading
  return Math.max(3, Math.round(wordCount / 130));
}

// Attach computed readingMins if not set
const finalLessons: Lesson[] = allLessons.map((l) => ({
  ...l,
  readingMins: l.readingMins || computeReadingTime(l.c),
}));

const fileContent = `import { Lesson } from './types';

export const LESSONS: Lesson[] = ${JSON.stringify(finalLessons, null, 2)};
`;

const outputPath = path.resolve(process.cwd(), 'data/lessons.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`✅ Successfully compiled ${finalLessons.length} deep lessons to ${outputPath}!`);
