// scratch/assemble_lessons.js
const fs = require('fs');
const path = require('path');

const b1 = require('./builder_foundations_core');
const b2 = require('./builder_security_content');
const b3 = require('./builder_data_admin');
const b4 = require('./builder_advanced_arch');
const b5 = require('./builder_projects');

const allLessons = [...b1, ...b2, ...b3, ...b4, ...b5];

console.log(`Loaded ${allLessons.length} lessons.`);

// Function to calculate accurate reading minutes based on text + code
function computeReadingTime(html) {
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
const finalLessons = allLessons.map((l) => ({
  ...l,
  readingMins: l.readingMins || computeReadingTime(l.c),
}));

const fileContent = `import { Lesson } from './types';

export const LESSONS: Lesson[] = ${JSON.stringify(finalLessons, null, 2)};
`;

const outputPath = path.resolve(__dirname, '../data/lessons.ts');
fs.writeFileSync(outputPath, fileContent, 'utf-8');

console.log(`✅ Successfully compiled ${finalLessons.length} deep lessons to ${outputPath}!`);
