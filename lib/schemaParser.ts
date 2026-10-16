// lib/schemaParser.ts
//
// Server-only: parses a Payload collection config (TypeScript source) with the
// compiler API and maps each collection's fields to a Postgres/Drizzle column
// definition. This is what powers the "parse your config" mode of the DB
// visualizer — the DDL shown is derived from the actual fields, not a fixture.

import {
  parseCode,
  syntaxErrorMessages,
  firstPropAnywhere,
  objectArray,
  getPropExpr,
  strOf,
  boolOf,
  arrayStrings,
} from './ast';
import ts from 'typescript';
import type { ObjectLiteralExpression } from 'typescript';

export interface SchemaColumn {
  name: string;
  sqlType: string;
  drizzleType: string;
  isPrimary?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  isIndex?: boolean;
  foreignKey?: string;
  defaultValue?: string;
}

export interface SchemaTable {
  tableName: string;
  collectionSlug: string;
  description: string;
  columns: SchemaColumn[];
}

export interface SchemaParseResult {
  tables: SchemaTable[];
  syntaxErrors: string[];
  error?: string;
}

interface FieldMap {
  sql: string;
  drizzle: (name: string) => string;
  default?: string;
  nullable?: boolean;
  index?: boolean;
}

const SCALAR_FIELDS: Record<string, FieldMap> = {
  text: { sql: 'varchar(255)', drizzle: (n) => `varchar("${n}", { length: 255 })` },
  email: { sql: 'varchar(255)', drizzle: (n) => `varchar("${n}", { length: 255 })`, index: true },
  password: { sql: 'varchar(255)', drizzle: (n) => `varchar("${n}", { length: 255 })` },
  textarea: { sql: 'text', drizzle: (n) => `text("${n}")`, nullable: true },
  code: { sql: 'text', drizzle: (n) => `text("${n}")`, nullable: true },
  richText: { sql: 'jsonb', drizzle: (n) => `jsonb("${n}")`, default: "'{}'::jsonb", nullable: true },
  json: { sql: 'jsonb', drizzle: (n) => `jsonb("${n}")`, nullable: true },
  number: { sql: 'numeric', drizzle: (n) => `numeric("${n}")` },
  checkbox: { sql: 'boolean', drizzle: (n) => `boolean("${n}")`, default: 'false' },
  date: { sql: 'timestamp with time zone', drizzle: (n) => `timestamp("${n}", { withTimezone: true })` },
  select: { sql: 'varchar(64)', drizzle: (n) => `varchar("${n}", { length: 64 })` },
  radio: { sql: 'varchar(64)', drizzle: (n) => `varchar("${n}", { length: 64 })` },
  point: { sql: 'varchar(64)', drizzle: (n) => `varchar("${n}", { length: 64 })`, nullable: true },
};

const JSON_FIELDS = new Set(['array', 'blocks', 'group', 'json']);

function relationTarget(field: ObjectLiteralExpression): string | undefined {
  const expr = getPropExpr(field, 'relationTo');
  return strOf(expr) ?? arrayStrings(expr)[0];
}

function columnFromField(field: ObjectLiteralExpression): SchemaColumn | null {
  const name = strOf(getPropExpr(field, 'name'));
  const type = strOf(getPropExpr(field, 'type'));
  if (!name || !type) return null;

  const required = boolOf(getPropExpr(field, 'required')) === true;
  const unique = boolOf(getPropExpr(field, 'unique')) === true;
  const index = boolOf(getPropExpr(field, 'index')) === true;

  if (type === 'relationship') {
    const hasMany = boolOf(getPropExpr(field, 'hasMany')) === true;
    if (hasMany) {
      return { name, sqlType: 'jsonb', drizzleType: `jsonb("${name}")`, isNullable: true, defaultValue: "'[]'::jsonb" };
    }
    const relationTo = relationTarget(field) || 'related';
    return {
      name: `${name}_id`,
      sqlType: 'integer',
      drizzleType: `integer("${name}_id")`,
      isNullable: !required,
      foreignKey: `${relationTo}(id)`,
      isIndex: true,
    };
  }

  if (type === 'upload') {
    const relationTo = relationTarget(field) || 'media';
    return {
      name: `${name}_id`,
      sqlType: 'integer',
      drizzleType: `integer("${name}_id")`,
      isNullable: true,
      foreignKey: `${relationTo}(id)`,
      isUnique: unique || undefined,
      isIndex: index || undefined,
    };
  }

  if (JSON_FIELDS.has(type)) {
    return {
      name,
      sqlType: 'jsonb',
      drizzleType: `jsonb("${name}")`,
      isNullable: true,
      isUnique: unique || undefined,
      isIndex: index || undefined,
    };
  }

  const map = SCALAR_FIELDS[type] || { sql: 'varchar(255)', drizzle: (n: string) => `varchar("${n}", { length: 255 })` };
  return {
    name,
    sqlType: map.sql,
    drizzleType: map.drizzle(name),
    isNullable: map.nullable ?? !required,
    defaultValue: map.default,
    isUnique: unique || undefined,
    isIndex: (index || map.index) || undefined,
  };
}

export function parsePayloadSchema(code: string): SchemaParseResult {
  const ctx = parseCode(code);
  const syntaxErrors = syntaxErrorMessages(ctx);

  let collections = objectArray(firstPropAnywhere(ctx, 'collections'));

  // Also accept a standalone `CollectionConfig` (slug + fields at an object's
  // top level) so a learner can paste a single collection, not just a full
  // `buildConfig({ collections: [...] })`.
  if (!collections.length) {
    const candidates: ObjectLiteralExpression[] = [];
    const visit = (node: ts.Node): void => {
      if (
        ts.isObjectLiteralExpression(node) &&
        getPropExpr(node, 'slug') &&
        getPropExpr(node, 'fields')
      ) {
        candidates.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(ctx.sourceFile);
    collections = candidates;
  }

  const tables: SchemaTable[] = [];

  for (const col of collections) {
    const slug = strOf(getPropExpr(col, 'slug'));
    if (!slug) continue;

    const fields = objectArray(getPropExpr(col, 'fields'));
    const columns: SchemaColumn[] = [
      { name: 'id', sqlType: 'serial', drizzleType: 'serial("id")', isPrimary: true, isNullable: false },
    ];

    for (const field of fields) {
      const column = columnFromField(field);
      if (column) columns.push(column);
    }

    columns.push(
      { name: 'created_at', sqlType: 'timestamp with time zone', drizzleType: 'timestamp("created_at", { withTimezone: true })', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
      { name: 'updated_at', sqlType: 'timestamp with time zone', drizzleType: 'timestamp("updated_at", { withTimezone: true })', isNullable: false, defaultValue: 'CURRENT_TIMESTAMP' },
    );

    tables.push({
      tableName: slug,
      collectionSlug: slug,
      description: `Compiled from Payload collection "${slug}" (${fields.length} field${fields.length === 1 ? '' : 's'}).`,
      columns,
    });
  }

  if (!tables.length && !syntaxErrors.length) {
    return { tables: [], syntaxErrors, error: 'No collections found. Add a `collections: [ ... ]` array to your config.' };
  }
  return { tables, syntaxErrors };
}
