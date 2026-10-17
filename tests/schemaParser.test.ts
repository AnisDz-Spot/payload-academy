import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePayloadSchema } from '@/lib/schemaParser';

const validConfig = `
import { buildConfig } from 'payload';

export default buildConfig({
  collections: [
    {
      slug: 'users',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'name', type: 'text' },
        { name: 'bio', type: 'textarea' },
      ],
    },
    {
      slug: 'posts',
      fields: [{ name: 'title', type: 'text' }],
    },
  ],
});
`;

test('parses collections into tables', () => {
  const res = parsePayloadSchema(validConfig);
  assert.deepEqual(res.syntaxErrors, []);
  assert.equal(res.tables.length, 2);
  const slugs = res.tables.map((t) => t.collectionSlug).sort();
  assert.deepEqual(slugs, ['posts', 'users']);
});

test('table columns include id, fields and timestamps', () => {
  const res = parsePayloadSchema(validConfig);
  const users = res.tables.find((t) => t.collectionSlug === 'users');
  assert.ok(users);
  const names = users!.columns.map((c) => c.name);
  assert.ok(names.includes('id'));
  assert.ok(names.includes('email'));
  assert.ok(names.includes('name'));
  assert.ok(names.includes('created_at'));
  assert.ok(names.includes('updated_at'));
});

test('accepts a standalone collection config', () => {
  const res = parsePayloadSchema(`export const Users = { slug: 'users', fields: [{ name: 'email', type: 'email' }] };`);
  assert.equal(res.tables.length, 1);
  assert.equal(res.tables[0].collectionSlug, 'users');
});

test('reports syntax errors', () => {
  const res = parsePayloadSchema('const broken = { slug: "x", fields: [ }');
  assert.ok(res.syntaxErrors.length > 0);
});

test('reports when no collections are found', () => {
  const res = parsePayloadSchema('export const x = 1;');
  assert.equal(res.tables.length, 0);
  assert.ok(res.error);
});
