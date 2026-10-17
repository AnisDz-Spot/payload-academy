import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGE_SPECS } from '@/data/challengeSuite';
import { LESSONS } from '@/data/lessons';
import { gradeChallenge } from '@/lib/challengeGrading';

test('every lesson has a challenge spec', () => {
  for (const lesson of LESSONS) {
    assert.ok(CHALLENGE_SPECS[lesson.id], `missing spec for lesson "${lesson.id}"`);
  }
});

test('every spec has at least one test case', () => {
  for (const [id, spec] of Object.entries(CHALLENGE_SPECS)) {
    assert.ok(spec.testCases.length > 0, `spec "${id}" has no test cases`);
  }
});

test('reference solutions pass grading', () => {
  for (const [id, spec] of Object.entries(CHALLENGE_SPECS)) {
    const res = gradeChallenge(id, spec.solutionCode);
    const failed = res.checks.filter((c) => !c.passed).map((c) => `${c.id}: ${c.hint ?? ''}`);
    assert.equal(
      res.passed,
      true,
      `solution for "${id}" failed. checks=[${failed.join(' | ')}] syntax=[${res.syntaxErrors.join('; ')}]`,
    );
  }
});

test('starter code is rejected', () => {
  for (const [id, spec] of Object.entries(CHALLENGE_SPECS)) {
    const res = gradeChallenge(id, spec.starterCode);
    assert.equal(res.passed, false, `starter code for "${id}" should not pass`);
  }
});

test('unknown lesson id fails gracefully', () => {
  const res = gradeChallenge('not-a-real-lesson', 'export const x = 1;');
  assert.equal(res.passed, false);
});
