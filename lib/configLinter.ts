// lib/configLinter.ts
//
// Server-only AST-based linter for Payload configuration files. Unlike the
// previous substring (`String.includes`) heuristics, this parses the source
// with the TypeScript compiler API and inspects the real structure of the
// `buildConfig({...})` object, its collections, fields, db adapter and more.

import ts from 'typescript';
import {
  arrayStrings,
  boolOf,
  callName,
  defaultExportExpr,
  findCalls,
  getPropExpr,
  objectArray,
  objectLit,
  parseCode,
  strOf,
} from '@/lib/ast';

export type ConfigLintSeverity = 'error' | 'warning' | 'info';

export interface ConfigLintIssue {
  id: string;
  type: ConfigLintSeverity;
  title: string;
  message: string;
  recommendation: string;
  location?: string;
}

export interface ConfigLintResult {
  score: number;
  issues: ConfigLintIssue[];
  syntaxErrors: string[];
}

const DEDUCTIONS: Record<ConfigLintSeverity, number> = {
  error: 25,
  warning: 15,
  info: 5,
};

function getConfigObject(ctx: ReturnType<typeof parseCode>): ts.ObjectLiteralExpression | undefined {
  const d = defaultExportExpr(ctx);
  if (d && ts.isCallExpression(d)) {
    const arg = d.arguments[0];
    if (arg && ts.isObjectLiteralExpression(arg)) return arg;
  }
  for (const call of findCalls(ctx, (n) => n === 'buildConfig')) {
    const arg = call.arguments[0];
    if (arg && ts.isObjectLiteralExpression(arg)) return arg;
  }
  return undefined;
}

export function lintPayloadConfig(code: string): ConfigLintResult {
  const ctx = parseCode(code);
  const syntaxErrors = ctx.syntaxErrors.map((d) =>
    ts.flattenDiagnosticMessageText(d.messageText, ' '),
  );

  const issues: ConfigLintIssue[] = [];
  const add = (issue: ConfigLintIssue) => {
    if (!issues.some((i) => i.id === issue.id)) issues.push(issue);
  };

  const config = getConfigObject(ctx);

  if (!config) {
    return {
      score: 0,
      issues: [
        {
          id: 'parse-no-config',
          type: 'error',
          title: 'No Payload Configuration Found',
          message: 'Could not locate a `buildConfig({ ... })` object in the source.',
          recommendation: 'Ensure your file contains `export default buildConfig({ ... })` or a `buildConfig({ ... })` call with an object argument.',
        },
      ],
      syntaxErrors,
    };
  }

  // ── 1. Secret ────────────────────────────────────────────────────────────
  const secret = getPropExpr(config, 'secret');
  if (!secret) {
    add({
      id: 'sec-missing-secret',
      type: 'error',
      title: 'Missing `secret`',
      message: 'No `secret` is configured. Payload requires a cryptographic secret to sign tokens.',
      recommendation: "Set `secret: process.env.PAYLOAD_SECRET || ''` and provide a 32+ byte hex key via `openssl rand -hex 32`.",
      location: 'top-level config',
    });
  } else if (strOf(secret) !== undefined) {
    add({
      id: 'sec-hardcoded-secret',
      type: 'error',
      title: 'Hardcoded Cryptographic Secret',
      message: '`secret` is a hardcoded string literal instead of a value read from the environment.',
      recommendation: "Use `secret: process.env.PAYLOAD_SECRET || ''` instead of an inline string.",
      location: 'top-level config',
    });
  }

  // ── 2. CORS / CSRF ───────────────────────────────────────────────────────
  const cors = getPropExpr(config, 'cors');
  if (!cors) {
    add({
      id: 'sec-missing-cors',
      type: 'info',
      title: 'No CORS Whitelist',
      message: 'No `cors` origins are configured. In production you should restrict which origins may call the API.',
      recommendation: "Add `cors: ['https://your-domain.com']`.",
      location: 'top-level config',
    });
  } else if (arrayStrings(cors).includes('*')) {
    add({
      id: 'sec-wildcard-cors',
      type: 'error',
      title: 'Insecure Wildcard CORS',
      message: 'Wildcard CORS (`*`) allows any third-party origin to make credentialed requests to your API.',
      recommendation: 'Explicitly whitelist production origins, e.g. `cors: ["https://acme.com"]`.',
      location: 'top-level config',
    });
  }

  const csrf = getPropExpr(config, 'csrf');
  if (!csrf) {
    add({
      id: 'sec-missing-csrf',
      type: 'info',
      title: 'No CSRF Origin Whitelist',
      message: 'No `csrf` origins are configured, so cross-site protection relies on defaults.',
      recommendation: "Add `csrf: ['https://your-domain.com']`.",
      location: 'top-level config',
    });
  } else if (arrayStrings(csrf).includes('*')) {
    add({
      id: 'sec-wildcard-csrf',
      type: 'error',
      title: 'Insecure Wildcard CSRF',
      message: 'Wildcard CSRF (`*`) disables cross-site request forgery protection.',
      recommendation: 'Specify exact allowed frontend origins.',
      location: 'top-level config',
    });
  }

  // ── 3. DB adapter ────────────────────────────────────────────────────────
  const db = getPropExpr(config, 'db');
  if (db && ts.isCallExpression(db) && /Adapter$/.test(callName(db) || '')) {
    const pool = objectLit(getPropExpr(objectLit(db.arguments[0]), 'pool'));
    if (pool) {
      const connectionString = getPropExpr(pool, 'connectionString');
      if (connectionString && strOf(connectionString) !== undefined) {
        add({
          id: 'sec-hardcoded-connection-string',
          type: 'warning',
          title: 'Hardcoded Database Connection String',
          message: 'The database connection string is a hardcoded literal, exposing credentials in source control.',
          recommendation: 'Read it from the environment: `connectionString: process.env.DATABASE_URI || ""`.',
          location: 'db adapter pool',
        });
      }
      if (getPropExpr(pool, 'max') === undefined) {
        add({
          id: 'perf-missing-pool-max',
          type: 'info',
          title: 'No Explicit Connection Pool Limit',
          message: 'The Postgres pool has no `max` size, which can exhaust database connections under load.',
          recommendation: 'Set a bounded pool size, e.g. `pool: { max: 20 }`.',
          location: 'db adapter pool',
        });
      }
    }
  }

  // ── 4. Editor ────────────────────────────────────────────────────────────
  if (getPropExpr(config, 'editor') === undefined) {
    add({
      id: 'ux-missing-editor',
      type: 'info',
      title: 'No Rich Text Editor Configured',
      message: 'No `editor` is set, so Payload falls back to its default rich text editor.',
      recommendation: 'Explicitly configure `editor: lexicalEditor()` for clarity.',
      location: 'top-level config',
    });
  }

  // ── 5. Collections ───────────────────────────────────────────────────────
  const collections = objectArray(getPropExpr(config, 'collections'));
  for (const coll of collections) {
    const slug = strOf(getPropExpr(coll, 'slug')) || 'unnamed';
    const fields = objectArray(getPropExpr(coll, 'fields'));

    const slugField = fields.find((f) => strOf(getPropExpr(f, 'name')) === 'slug');
    if (slugField) {
      const unique = boolOf(getPropExpr(slugField, 'unique'));
      const indexed = boolOf(getPropExpr(slugField, 'index'));
      if (unique !== true && indexed !== true) {
        add({
          id: `perf-unindexed-slug-${slug}`,
          type: 'warning',
          title: `Unindexed Slug Field (\`${slug}\`)`,
          message: 'A URL `slug` field is missing `unique: true` / `index: true`, causing slow sequential scans on lookups.',
          recommendation: "Add `{ name: 'slug', type: 'text', unique: true, index: true }`.",
          location: `collection "${slug}"`,
        });
      }
    }

    const upload = objectLit(getPropExpr(coll, 'upload'));
    if (upload && getPropExpr(upload, 'mimeTypes') === undefined) {
      add({
        id: `sec-unrestricted-upload-${slug}`,
        type: 'warning',
        title: `Unrestricted Upload MIME Types (\`${slug}\`)`,
        message: 'This upload collection sets no `mimeTypes`, so clients can upload potentially executable files (.html, .svg with XSS).',
        recommendation: "Add `mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']`.",
        location: `collection "${slug}"`,
      });
    }

    const admin = objectLit(getPropExpr(coll, 'admin'));
    const hasTitleLike = fields.some((f) => {
      const n = strOf(getPropExpr(f, 'name'));
      return n === 'title' || n === 'name';
    });
    if (hasTitleLike && (!admin || getPropExpr(admin, 'useAsTitle') === undefined)) {
      add({
        id: `ux-missing-title-${slug}`,
        type: 'info',
        title: `Missing admin.useAsTitle (\`${slug}\`)`,
        message: 'Collection lists and relationship pickers will show raw IDs instead of human-readable values.',
        recommendation: "Add `admin: { useAsTitle: 'title' }`.",
        location: `collection "${slug}"`,
      });
    }

    if (getPropExpr(coll, 'access') === undefined) {
      add({
        id: `sec-missing-access-${slug}`,
        type: 'warning',
        title: `No Access Control (\`${slug}\`)`,
        message: 'This collection defines no `access` rules, so the default access functions apply to every operation.',
        recommendation: 'Define explicit `access.read/create/update/delete` functions.',
        location: `collection "${slug}"`,
      });
    }
  }

  const score = Math.max(10, issues.reduce((acc, i) => acc - DEDUCTIONS[i.type], 100));

  return { score, issues, syntaxErrors };
}
