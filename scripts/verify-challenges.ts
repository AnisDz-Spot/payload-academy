import { CHALLENGE_SPECS } from '@/data/challengeSuite';
import { LESSONS } from '@/data/lessons';
import { LESSON_COUNT } from '@/data/curriculum';
import { gradeChallenge } from '@/lib/challengeGrading';

const EXPECTED_SPEC_COUNT = LESSON_COUNT;

const failures: string[] = [];
const warn = (msg: string) => failures.push(msg);

const specIds = Object.keys(CHALLENGE_SPECS).sort();
const lessonIds = LESSONS.map((l) => l.id).sort();

if (specIds.length !== EXPECTED_SPEC_COUNT) {
  warn(`expected ${EXPECTED_SPEC_COUNT} challenge specs, found ${specIds.length}`);
}

const lessonSet = new Set(lessonIds);
const specSet = new Set(specIds);
for (const id of lessonIds) {
  if (!specSet.has(id)) warn(`lesson "${id}" has no challenge spec (would fall back to a generic spec)`);
}
for (const id of specIds) {
  if (!lessonSet.has(id)) warn(`challenge spec "${id}" does not match any lesson`);
}

let solutionChecked = 0;
let starterChecked = 0;

for (const id of specIds) {
  const spec = CHALLENGE_SPECS[id];

  if (!spec.testCases.length) {
    warn(`[${id}] spec defines no test cases`);
    continue;
  }

  const solution = gradeChallenge(id, spec.solutionCode);
  solutionChecked += 1;

  if (solution.syntaxErrors.length) {
    warn(`[${id}] reference solution has syntax errors: ${solution.syntaxErrors.join('; ')}`);
  }
  if (!solution.passed) {
    const failed = solution.checks.filter((c) => !c.passed).map((c) => c.id);
    warn(`[${id}] reference solution failed checks: ${failed.join(', ') || 'none reported'}`);
  }

  const starter = gradeChallenge(id, spec.starterCode);
  starterChecked += 1;

  if (starter.syntaxErrors.length === 0 && starter.checks.length > 0 && starter.checks.every((c) => c.passed)) {
    warn(`[${id}] starter code already passes every check`);
  }
}

if (failures.length) {
  console.error(`\n✗ challenge verification failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):\n`);
  for (const f of failures) console.error(`  - ${f}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✓ verified ${specIds.length} challenge specs (${solutionChecked} reference solutions pass, ${starterChecked} starters rejected)`
);
