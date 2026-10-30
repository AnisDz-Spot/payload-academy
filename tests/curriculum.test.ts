import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LESSONS } from '@/data/lessons';
import { QUIZZES } from '@/data/quizzes';
import { CHALLENGES } from '@/data/challenges';
import {
  LESSON_COUNT,
  FREE_LESSON_COUNT,
  CURRICULUM_MODULE_COUNT,
} from '@/data/curriculum';

test('LESSON_COUNT matches the lesson list', () => {
  assert.equal(LESSONS.length, LESSON_COUNT);
});

test('every lesson has a quiz (the final exam depends on this)', () => {
  for (const lesson of LESSONS) {
    assert.ok(QUIZZES[lesson.id], `missing quiz for lesson "${lesson.id}"`);
  }
});

test('every lesson has a challenge entry', () => {
  for (const lesson of LESSONS) {
    assert.ok(CHALLENGES[lesson.id], `missing challenge for lesson "${lesson.id}"`);
  }
});

test('module count matches the distinct modules', () => {
  const modules = new Set(LESSONS.map((l) => l.m));
  assert.equal(modules.size, CURRICULUM_MODULE_COUNT);
});

test('free tier is a valid prefix of the curriculum', () => {
  assert.ok(FREE_LESSON_COUNT > 0);
  assert.ok(FREE_LESSON_COUNT <= LESSONS.length);
});

test('lesson ids are unique', () => {
  const ids = LESSONS.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('quiz answers point at a real option', () => {
  for (const [id, quiz] of Object.entries(QUIZZES)) {
    assert.ok(quiz.options.length >= 2, `quiz "${id}" has too few options`);
    assert.ok(
      quiz.correct >= 0 && quiz.correct < quiz.options.length,
      `quiz "${id}" has an out-of-range correct index`,
    );
  }
});
