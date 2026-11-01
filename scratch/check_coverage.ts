// scratch/check_coverage.ts
// One-off coverage report: checks every lesson has a quiz, a challenge and a
// challenge-suite entry. Run from the project root:
//   npx tsx scratch/check_coverage.ts
import fs from 'node:fs';
import path from 'node:path';

import type { Lesson } from '../data/types';
import b1 from './builder_foundations_core';
import b2 from './builder_security_content';
import b3 from './builder_data_admin';
import b4 from './builder_advanced_arch';
import b5 from './builder_projects';

const allLessons: Lesson[] = [...b1, ...b2, ...b3, ...b4, ...b5];
const lessonIds = allLessons.map((l) => l.id);

const read = (rel: string): string =>
  fs.readFileSync(path.resolve(process.cwd(), rel), 'utf8');

const qContent = read('data/quizzes.ts');
const cContent = read('data/challenges.ts');
const csContent = read('data/challengeSuite.ts');

const missingQuizzes = lessonIds.filter(
  (id) => !qContent.includes(`"${id}":`) && !qContent.includes(`'${id}':`),
);
const missingChallenges = lessonIds.filter(
  (id) => !cContent.includes(`"${id}":`) && !cContent.includes(`'${id}':`),
);
const inChallengeSuite = lessonIds.filter(
  (id) =>
    csContent.includes(`"${id}":`) ||
    csContent.includes(`'${id}':`) ||
    csContent.includes(`lessonId: '${id}'`) ||
    csContent.includes(`lessonId: "${id}"`),
);

console.log('Total Lessons:', lessonIds.length);
console.log('Missing Quizzes count:', missingQuizzes.length, missingQuizzes);
console.log('Missing Challenges count:', missingChallenges.length, missingChallenges);
console.log('In ChallengeSuite count:', inChallengeSuite.length);
