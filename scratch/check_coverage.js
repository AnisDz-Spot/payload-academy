const fs = require('fs');
const path = require('path');
const b1 = require('./builder_foundations_core');
const b2 = require('./builder_security_content');
const b3 = require('./builder_data_admin');
const b4 = require('./builder_advanced_arch');
const b5 = require('./builder_projects');

const allLessons = [...b1, ...b2, ...b3, ...b4, ...b5];
const lessonIds = allLessons.map(l => l.id);

const qContent = fs.readFileSync(path.resolve(__dirname, '../data/quizzes.ts'), 'utf8');
const cContent = fs.readFileSync(path.resolve(__dirname, '../data/challenges.ts'), 'utf8');
const csContent = fs.readFileSync(path.resolve(__dirname, '../data/challengeSuite.ts'), 'utf8');

const missingQuizzes = lessonIds.filter(id => !qContent.includes(`"${id}":`) && !qContent.includes(`'${id}':`));
const missingChallenges = lessonIds.filter(id => !cContent.includes(`"${id}":`) && !cContent.includes(`'${id}':`));
const inChallengeSuite = lessonIds.filter(id => csContent.includes(`"${id}":`) || csContent.includes(`'${id}':`) || csContent.includes(`lessonId: '${id}'`) || csContent.includes(`lessonId: "${id}"`));

console.log('Total Lessons:', lessonIds.length);
console.log('Missing Quizzes count:', missingQuizzes.length, missingQuizzes);
console.log('Missing Challenges count:', missingChallenges.length, missingChallenges);
console.log('In ChallengeSuite count:', inChallengeSuite.length);
