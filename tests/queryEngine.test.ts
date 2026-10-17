import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runQuery, matchesWhere } from '@/lib/queryEngine';

test('runQuery filters with equals', () => {
  const res = runQuery({ collection: 'posts', where: { _status: { equals: 'published' } } });
  assert.equal(res.totalDocs, 2);
  assert.ok(res.docs.every((d) => d._status === 'published'));
});

test('runQuery applies limit and reports pagination', () => {
  const res = runQuery({ collection: 'posts', limit: 1 });
  assert.equal(res.totalDocs, 3);
  assert.equal(res.docs.length, 1);
  assert.equal(res.totalPages, 3);
  assert.equal(res.hasNextPage, true);
  assert.equal(res.nextPage, 2);
  assert.equal(res.hasPrevPage, false);
});

test('sort descending by createdAt', () => {
  const res = runQuery({ collection: 'posts', sort: '-createdAt' });
  const dates = res.docs.map((d) => String(d.createdAt));
  const expected = [...dates].sort((a, b) => b.localeCompare(a));
  assert.deepEqual(dates, expected);
});

test('greater_than uses numeric comparison', () => {
  const res = runQuery({ collection: 'products', where: { priceInCents: { greater_than: 10000 } } });
  assert.equal(res.totalDocs, 2);
});

test('in matches any value in a list', () => {
  const res = runQuery({ collection: 'users', where: { role: { in: ['admin'] } } });
  assert.equal(res.totalDocs, 1);
  assert.equal(res.docs[0].name, 'Alice Chen');
});

test('like is a case-insensitive substring match', () => {
  const res = runQuery({ collection: 'products', where: { title: { like: 'mouse' } } });
  assert.equal(res.totalDocs, 1);
});

test('exists checks field presence', () => {
  const res = runQuery({ collection: 'products', where: { sku: { exists: true } } });
  assert.equal(res.totalDocs, 3);
});

test('depth 0 collapses relationships to ids', () => {
  const res = runQuery({ collection: 'posts', where: { id: { equals: 'post_101' } }, depth: 0 });
  assert.equal(res.docs[0].author, 'usr_1');
  assert.equal(res.docs[0].category, 'cat_1');
});

test('matchesWhere supports or/and/not groups', () => {
  const doc = { id: '1', status: 'published', featured: true };
  assert.equal(
    matchesWhere(doc, { or: [{ status: { equals: 'draft' } }, { featured: { equals: true } }] }),
    true,
  );
  assert.equal(
    matchesWhere(doc, { and: [{ status: { equals: 'published' } }, { featured: { equals: false } }] }),
    false,
  );
  assert.equal(matchesWhere(doc, { not: [{ status: { equals: 'draft' } }] }), true);
});

test('empty where returns all documents', () => {
  const res = runQuery({ collection: 'users' });
  assert.equal(res.totalDocs, 2);
});
