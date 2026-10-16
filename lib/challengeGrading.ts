// lib/challengeGrading.ts
//
// Server-only AST-based grading for the interactive coding challenges. Each
// check is a predicate over the parsed TypeScript AST of the learner's code.
// This replaces the old substring/regex matcher in data/challengeSuite.ts.

import ts from 'typescript';
import { getChallengeSpec } from '@/data/challengeSuite';
import {
  AstContext,
  arrayElements,
  arrayStrings,
  boolOf,
  callArgs,
  callName,
  defaultExportExpr,
  findCalls,
  findObjectByVar,
  findObjectWithPropValue,
  findPropsAnywhere,
  firstPropAnywhere,
  functionTextByVar,
  getNested,
  getPropExpr,
  hasImportFrom,
  numOf,
  objectArray,
  objectLit,
  parseCode,
  strOf,
  syntaxErrorMessages,
} from '@/lib/ast';

export interface GradeCheck {
  id: string;
  label: string;
  passed: boolean;
  hint?: string;
}

export interface GradeResult {
  passed: boolean;
  checks: GradeCheck[];
  syntaxErrors: string[];
}

type Rule = (ctx: AstContext, lessonId: string) => boolean;

function lower(s: string | undefined): string {
  return (s || '').toLowerCase();
}

// Returns the source text of a named function declaration OR a variable whose
// initializer is a function (arrow / function expression).
function functionDeclText(ctx: AstContext, name: string): string | undefined {
  let text: string | undefined;
  const visit = (node: ts.Node): void => {
    if (!text) {
      if (ts.isFunctionDeclaration(node) && node.name?.text === name) {
        text = node.getText(ctx.sourceFile);
      } else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) {
        const init = node.initializer;
        if (init && (ts.isArrowFunction(init) || ts.isFunctionExpression(init))) {
          text = init.getText(ctx.sourceFile);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ctx.sourceFile);
  return text;
}

function fieldsHave(ctx: AstContext, fieldsExpr: ts.Expression | undefined): (name: string, type: string) => boolean {
  const fields = objectArray(fieldsExpr);
  return (name, type) =>
    fields.some(
      (f) => strOf(getPropExpr(f, 'name')) === name && strOf(getPropExpr(f, 'type')) === type,
    );
}

// Keyed by `${lessonId}:${testCaseId}`
const RULES: Record<string, Rule> = {
  // ── intro ────────────────────────────────────────────────────────────────
  'intro:exec': (ctx) => {
    const obj = findObjectByVar(ctx, 'payloadAdvantage');
    return lower(strOf(getPropExpr(obj, 'executionModel'))).includes('in-process');
  },
  'intro:ts': (ctx) => {
    const obj = findObjectByVar(ctx, 'payloadAdvantage');
    return lower(strOf(getPropExpr(obj, 'typeSafety'))).includes('typescript');
  },
  'intro:db': (ctx) => {
    const obj = findObjectByVar(ctx, 'payloadAdvantage');
    const dbs = arrayStrings(getPropExpr(obj, 'databaseChoice')).map((s) => s.toLowerCase());
    return dbs.some((d) => d === 'postgres' || d === 'sqlite' || d === 'mongodb');
  },

  // ── install ──────────────────────────────────────────────────────────────
  'install:with-payload': (ctx) => {
    const d = defaultExportExpr(ctx);
    return (
      !!d &&
      ts.isCallExpression(d) &&
      callName(d) === 'withPayload' &&
      callArgs(d).some((a) => ts.isIdentifier(a) && a.text === 'nextConfig')
    );
  },
  'install:import': (ctx) => hasImportFrom(ctx, '@payloadcms/next/withPayload'),

  // ── config ───────────────────────────────────────────────────────────────
  'config:secret-env': (ctx) => {
    const e = firstPropAnywhere(ctx, 'secret');
    return !!e && e.getText(ctx.sourceFile).includes('process.env.PAYLOAD_SECRET');
  },
  'config:db-adapter': (ctx) =>
    findCalls(ctx, (n) => /Adapter$/.test(n)).some((c) =>
      c.getText(ctx.sourceFile).includes('connectionString'),
    ),
  'config:cors-whitelist': (ctx) =>
    arrayStrings(firstPropAnywhere(ctx, 'cors')).includes('https://mywebsite.com'),

  // ── collections ──────────────────────────────────────────────────────────
  'collections:slug': (ctx) => strOf(firstPropAnywhere(ctx, 'slug')) === 'products',
  'collections:useAsTitle': (ctx) => strOf(firstPropAnywhere(ctx, 'useAsTitle')) === 'title',
  'collections:versions': (ctx) =>
    getNested(ctx, ['versions', 'drafts', 'autosave']) !== undefined,
  'collections:fields': (ctx) => {
    const has = fieldsHave(ctx, firstPropAnywhere(ctx, 'fields'));
    return has('title', 'text') && has('price', 'number');
  },

  // ── fields ───────────────────────────────────────────────────────────────
  'fields:blocks-type': (ctx) =>
    findPropsAnywhere(ctx, 'type').some((e) => strOf(e) === 'blocks'),
  'fields:hero-slug': (ctx) =>
    findObjectWithPropValue(ctx, 'slug', 'hero') !== undefined,
  'fields:hero-fields': (ctx) => {
    const hero = findObjectWithPropValue(ctx, 'slug', 'hero');
    if (!hero) return false;
    const fields = objectArray(getPropExpr(hero, 'fields'));
    const has = (name: string, type: string) =>
      fields.some(
        (f) => strOf(getPropExpr(f, 'name')) === name && strOf(getPropExpr(f, 'type')) === type,
      );
    const bg = fields.find((f) => strOf(getPropExpr(f, 'name')) === 'backgroundImage');
    return has('heading', 'text') && has('backgroundImage', 'upload') && !!bg && getPropExpr(bg, 'relationTo') !== undefined;
  },

  // ── access ───────────────────────────────────────────────────────────────
  'access:unauth-check': (ctx) => {
    const t = functionTextByVar(ctx, 'canReadPosts');
    return !!t && /!\s*user/.test(t) && t.includes('_status') && t.includes('published');
  },
  'access:admin-bypass': (ctx) => {
    const t = functionTextByVar(ctx, 'canReadPosts');
    return !!t && /role\s*===\s*['"]admin['"]/.test(t) && /return\s+true/.test(t);
  },
  'access:author-or-published': (ctx) => {
    const t = functionTextByVar(ctx, 'canReadPosts');
    return !!t && (t.includes('or:') || (t.includes('author') && t.includes('user.id')));
  },

  // ── hooks ────────────────────────────────────────────────────────────────
  'hooks:title-check': (ctx) => {
    const t = functionTextByVar(ctx, 'autoSlugHook');
    return !!t && t.includes('data') && (t.includes('operation') || t.includes('data.slug') || t.includes('data?.slug'));
  },
  'hooks:slug-replace': (ctx) => {
    const t = functionTextByVar(ctx, 'autoSlugHook');
    return !!t && t.includes('.toLowerCase()') && t.includes('.replace(');
  },
  'hooks:return-data': (ctx) => {
    const t = functionTextByVar(ctx, 'autoSlugHook');
    return !!t && /return\s+data/.test(t);
  },

  // ── api ──────────────────────────────────────────────────────────────────
  'api:collection-slug': (ctx) => strOf(firstPropAnywhere(ctx, 'collection')) === 'posts',
  'api:where-published': (ctx) =>
    strOf(getNested(ctx, ['where', '_status', 'equals'])) === 'published',
  'api:sort-limit': (ctx) =>
    numOf(firstPropAnywhere(ctx, 'limit')) === 5 && strOf(firstPropAnywhere(ctx, 'sort')) === '-createdAt',

  // ── relationships ────────────────────────────────────────────────────────
  'relationships:defaultPopulate': (ctx) =>
    objectLit(firstPropAnywhere(ctx, 'defaultPopulate')) !== undefined,
  'relationships:projected-fields': (ctx) => {
    const dp = objectLit(firstPropAnywhere(ctx, 'defaultPopulate'));
    if (!dp) return false;
    return boolOf(getPropExpr(dp, 'firstName')) === true && boolOf(getPropExpr(dp, 'email')) === true;
  },

  // ── globals ──────────────────────────────────────────────────────────────
  'globals:slug-navigation': (ctx) => strOf(firstPropAnywhere(ctx, 'slug')) === 'navigation',
  'globals:logo-upload': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'name', 'logo');
    return strOf(getPropExpr(o, 'type')) === 'upload' && getPropExpr(o, 'relationTo') !== undefined;
  },
  'globals:links-array': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'name', 'links');
    return strOf(getPropExpr(o, 'type')) === 'array';
  },

  // ── join ─────────────────────────────────────────────────────────────────
  'join:join-type': (ctx) => findObjectWithPropValue(ctx, 'type', 'join') !== undefined,
  'join:join-config': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'type', 'join');
    return (
      !!o &&
      strOf(getPropExpr(o, 'collection')) === 'posts' &&
      strOf(getPropExpr(o, 'on')) === 'category'
    );
  },

  // ── auth ─────────────────────────────────────────────────────────────────
  'auth:auth-maxlogin': (ctx) => numOf(getNested(ctx, ['auth', 'maxLoginAttempts'])) !== undefined,
  'auth:auth-cookie-secure': (ctx) => boolOf(getNested(ctx, ['auth', 'cookies', 'secure'])) === true,
  'auth:auth-cookie-httponly': (ctx) =>
    boolOf(getNested(ctx, ['auth', 'cookies', 'httpOnly'])) === true,

  // ── apikeys ──────────────────────────────────────────────────────────────
  'apikeys:auth-block': (ctx) => objectLit(firstPropAnywhere(ctx, 'auth')) !== undefined,
  'apikeys:use-api-key': (ctx) => boolOf(getNested(ctx, ['auth', 'useAPIKey'])) === true,

  // ── uploads ──────────────────────────────────────────────────────────────
  'uploads:upload-imagesizes': (ctx) =>
    arrayElements(getNested(ctx, ['upload', 'imageSizes'])).length > 0,
  'uploads:sizes-named': (ctx) => {
    const names = objectArray(getNested(ctx, ['upload', 'imageSizes'])).map((o) =>
      strOf(getPropExpr(o, 'name')),
    );
    return ['thumbnail', 'card', 'hero'].every((n) => names.includes(n));
  },

  // ── layout ───────────────────────────────────────────────────────────────
  'layout:tabs-type': (ctx) => findObjectWithPropValue(ctx, 'type', 'tabs') !== undefined,
  'layout:tabs-array': (ctx) => arrayElements(firstPropAnywhere(ctx, 'tabs')).length >= 2,
  'layout:seo-group': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'name', 'seo');
    return strOf(getPropExpr(o, 'type')) === 'group';
  },

  // ── webhooks ─────────────────────────────────────────────────────────────
  'webhooks:sign-hmac': (ctx) => {
    const t = functionTextByVar(ctx, 'notifyWebhook');
    return !!t && /createHmac\(\s*['"]sha256['"]/.test(t);
  },
  'webhooks:outgoing-fetch': (ctx) => {
    const t = functionTextByVar(ctx, 'notifyWebhook');
    return !!t && /\bfetch\s*\(/.test(t);
  },
  'webhooks:return-doc': (ctx) => {
    const t = functionTextByVar(ctx, 'notifyWebhook');
    return !!t && /return\s+doc/.test(t);
  },

  // ── i18n ─────────────────────────────────────────────────────────────────
  'i18n:locales': (ctx) => {
    const locales = arrayStrings(getNested(ctx, ['localization', 'locales']));
    return ['en', 'fr', 'ar'].every((l) => locales.includes(l));
  },
  'i18n:default-locale': (ctx) =>
    strOf(getNested(ctx, ['localization', 'defaultLocale'])) === 'en',

  // ── jobs ─────────────────────────────────────────────────────────────────
  'jobs:jobs-tasks': (ctx) => arrayElements(getNested(ctx, ['jobs', 'tasks'])).length > 0,
  'jobs:task-slug': (ctx) =>
    objectArray(getNested(ctx, ['jobs', 'tasks'])).some(
      (o) => strOf(getPropExpr(o, 'slug')) !== undefined,
    ),

  // ── queries ──────────────────────────────────────────────────────────────
  'queries:where-or': (ctx) => arrayElements(getNested(ctx, ['where', 'or'])).length > 0,
  'queries:select-projection': (ctx) => objectLit(firstPropAnywhere(ctx, 'select')) !== undefined,

  // ── structure ────────────────────────────────────────────────────────────
  'structure:typed-collection': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'slug', 'posts');
    return !!o && objectArray(getPropExpr(o, 'fields')).length > 0;
  },
  'structure:generated-types': (ctx) => hasImportFrom(ctx, '@/payload-types'),

  // ── cli ──────────────────────────────────────────────────────────────────
  'cli:imports-payload': (ctx) => hasImportFrom(ctx, 'payload'),
  'cli:getpayload': (ctx) => findCalls(ctx, (n) => n === 'getPayload').length > 0,
  'cli:find-posts': (ctx) =>
    findCalls(ctx, (n) => n === 'find').some((c) => c.getText(ctx.sourceFile).includes("collection: 'posts'")),

  // ── customauth ───────────────────────────────────────────────────────────
  'customauth:github-fetch': (ctx) =>
    findCalls(ctx, (n) => n === 'fetch').some((c) => c.getText(ctx.sourceFile).includes('github.com/login/oauth')),
  'customauth:local-create': (ctx) =>
    findCalls(ctx, (n) => n === 'create').some((c) => c.getText(ctx.sourceFile).includes("collection: 'users'")),
  'customauth:returns-response': (ctx) => /return\s+Response\.json/.test(ctx.code),

  // ── secprod ──────────────────────────────────────────────────────────────
  'secprod:strict-cors': (ctx) => {
    const c = arrayStrings(firstPropAnywhere(ctx, 'cors'));
    return c.length > 0 && !c.includes('*');
  },
  'secprod:csrf-set': (ctx) => arrayStrings(firstPropAnywhere(ctx, 'csrf')).length > 0,

  // ── drafts ───────────────────────────────────────────────────────────────
  'drafts:drafts-enabled': (ctx) => getNested(ctx, ['versions', 'drafts']) !== undefined,
  'drafts:live-preview-url': (ctx) => getNested(ctx, ['admin', 'livePreview', 'url']) !== undefined,
  'drafts:breakpoints': (ctx) => arrayElements(getNested(ctx, ['admin', 'livePreview', 'breakpoints'])).length > 0,

  // ── actions ──────────────────────────────────────────────────────────────
  'actions:zod-schema': (ctx) => /z\.object\s*\(/.test(ctx.code) && /z\.string\s*\(\)/.test(ctx.code),
  'actions:validates': (ctx) => {
    const t = functionDeclText(ctx, 'createInquiry');
    return !!t && /\.(parse|safeParse)\s*\(/.test(t);
  },
  'actions:local-create': (ctx) =>
    findCalls(ctx, (n) => n === 'create').some((c) => c.getText(ctx.sourceFile).includes("collection: 'inquiries'")),

  // ── frontend ─────────────────────────────────────────────────────────────
  'frontend:server-component': (ctx) => findCalls(ctx, (n) => n === 'getPayload').length > 0,
  'frontend:finds-posts': (ctx) =>
    findCalls(ctx, (n) => n === 'find').some((c) => c.getText(ctx.sourceFile).includes("collection: 'posts'")),
  'frontend:force-static': (ctx) => {
    let found = false;
    const visit = (node: ts.Node): void => {
      if (
        ts.isVariableDeclaration(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === 'dynamic' &&
        strOf(node.initializer) === 'force-static'
      ) {
        found = true;
      }
      ts.forEachChild(node, visit);
    };
    visit(ctx.sourceFile);
    return found;
  },

  // ── seeding ──────────────────────────────────────────────────────────────
  'seeding:idempotent': (ctx) => {
    const t = functionDeclText(ctx, 'seed');
    return !!t && /\bcount\s*\(/.test(t) && /\breturn\b/.test(t);
  },
  'seeding:creates-admin': (ctx) =>
    findCalls(ctx, (n) => n === 'create').some((c) => c.getText(ctx.sourceFile).includes("collection: 'users'")),

  // ── admin ────────────────────────────────────────────────────────────────
  'admin:views-config': (ctx) => objectLit(getNested(ctx, ['admin', 'components', 'views'])) !== undefined,
  'admin:dashboard-component': (ctx) =>
    getNested(ctx, ['admin', 'components', 'views', 'dashboard', 'Component']) !== undefined,

  // ── customui ─────────────────────────────────────────────────────────────
  'customui:client-component': (ctx) => {
    const t = functionTextByVar(ctx, 'ColorPicker');
    return !!t && ctx.code.includes('TextFieldClientComponent');
  },
  'customui:color-input': (ctx) => {
    const t = functionTextByVar(ctx, 'ColorPicker');
    return !!t && t.includes("'color'");
  },

  // ── theming ──────────────────────────────────────────────────────────────
  'theming:brand-color': (ctx) =>
    strOf(getPropExpr(findObjectByVar(ctx, 'adminTheme'), 'brandColor')) !== undefined,
  'theming:css-var': (ctx) => {
    const css = strOf(getPropExpr(findObjectByVar(ctx, 'adminTheme'), 'css'));
    return !!css && css.includes('--theme-');
  },
  'theming:gradient': (ctx) => {
    const css = strOf(getPropExpr(findObjectByVar(ctx, 'adminTheme'), 'css'));
    return !!css && css.includes('linear-gradient');
  },

  // ── whitelabel ───────────────────────────────────────────────────────────
  'whitelabel:login-view': (ctx) =>
    getNested(ctx, ['admin', 'components', 'views', 'login', 'Component']) !== undefined,
  'whitelabel:graphics': (ctx) => objectLit(getNested(ctx, ['admin', 'components', 'graphics'])) !== undefined,

  // ── richtext ─────────────────────────────────────────────────────────────
  'richtext:lexical-editor': (ctx) => findCalls(ctx, (n) => n === 'lexicalEditor').length > 0,
  'richtext:custom-feature': (ctx) => ctx.code.includes('features') && ctx.code.includes('defaultFeatures'),
  'richtext:callout-feature': (ctx) => /callout/i.test(ctx.code),

  // ── nesteddocs ───────────────────────────────────────────────────────────
  'nesteddocs:plugin-import': (ctx) => hasImportFrom(ctx, '@payloadcms/plugin-nested-docs'),
  'nesteddocs:plugins-array': (ctx) => arrayElements(firstPropAnywhere(ctx, 'plugins')).length > 0,
  'nesteddocs:collections-target': (ctx) => ctx.code.includes("collections: ['pages']"),

  // ── transactions ─────────────────────────────────────────────────────────
  'transactions:begin': (ctx) => ctx.code.includes('beginTransaction'),
  'transactions:commit': (ctx) => ctx.code.includes('commitTransaction'),
  'transactions:rollback': (ctx) => ctx.code.includes('rollbackTransaction'),

  // ── storage ──────────────────────────────────────────────────────────────
  'storage:plugin-import': (ctx) => /@payloadcms\/storage-/.test(ctx.code),
  'storage:plugins-array': (ctx) => arrayElements(firstPropAnywhere(ctx, 'plugins')).length > 0,
  'storage:bucket-env': (ctx) => ctx.code.includes('S3_BUCKET') || ctx.code.includes('BLOB_READ_WRITE_TOKEN'),

  // ── email ────────────────────────────────────────────────────────────────
  'email:adapter-import': (ctx) => /@payloadcms\/email-/.test(ctx.code),
  'email:email-config': (ctx) => firstPropAnywhere(ctx, 'email') !== undefined,
  'email:default-from': (ctx) => ctx.code.includes('defaultFromAddress'),

  // ── plugins ──────────────────────────────────────────────────────────────
  'plugins:plugin-fn': (ctx) => functionTextByVar(ctx, 'readingTimePlugin') !== undefined,
  'plugins:injects-field': (ctx) => {
    const t = functionTextByVar(ctx, 'readingTimePlugin');
    return !!t && t.includes('readingTime') && t.includes('fields');
  },
  'plugins:spreads-config': (ctx) => {
    const t = functionTextByVar(ctx, 'readingTimePlugin');
    return !!t && t.includes('...config');
  },

  // ── tenants ──────────────────────────────────────────────────────────────
  'tenants:collection': (ctx) => findObjectWithPropValue(ctx, 'slug', 'tenants') !== undefined,
  'tenants:scoped-access': (ctx) => {
    const t = functionTextByVar(ctx, 'tenantScoped');
    return !!t && t.includes('tenant');
  },

  // ── ai ───────────────────────────────────────────────────────────────────
  'ai:embeddings-fetch': (ctx) => {
    const t = functionDeclText(ctx, 'embedOnPublish');
    return !!t && t.includes('embeddings');
  },
  'ai:openai-key': (ctx) => ctx.code.includes('OPENAI_API_KEY'),
  'ai:returns-doc': (ctx) => {
    const t = functionDeclText(ctx, 'embedOnPublish');
    return !!t && /return\s/.test(t) && t.includes('doc');
  },

  // ── testing ──────────────────────────────────────────────────────────────
  'testing:vitest-import': (ctx) => hasImportFrom(ctx, 'vitest'),
  'testing:uses-expect': (ctx) => findCalls(ctx, (n) => n === 'expect').length > 0 || ctx.code.includes('expect('),
  'testing:boots-payload': (ctx) => findCalls(ctx, (n) => n === 'getPayload').length > 0,

  // ── database ─────────────────────────────────────────────────────────────
  'database:migration-import': (ctx) => hasImportFrom(ctx, '@payloadcms/db-postgres'),
  'database:up-down': (ctx) =>
    /export\s+async\s+function\s+up\s*\(/.test(ctx.code) && /export\s+async\s+function\s+down\s*\(/.test(ctx.code),
  'database:create-table': (ctx) => ctx.code.includes('CREATE TABLE') && /db\.execute/.test(ctx.code),

  // ── esm ──────────────────────────────────────────────────────────────────
  'esm:with-payload': (ctx) => {
    const d = defaultExportExpr(ctx);
    return !!d && ts.isCallExpression(d) && callName(d) === 'withPayload';
  },
  'esm:turbopack-config': (ctx) => objectLit(firstPropAnywhere(ctx, 'turbopack')) !== undefined,

  // ── caching ──────────────────────────────────────────────────────────────
  'caching:revalidate-import': (ctx) => hasImportFrom(ctx, 'next/cache'),
  'caching:revalidate-call': (ctx) => findCalls(ctx, (n) => n === 'revalidateTag').length > 0,
  'caching:returns-doc': (ctx) => {
    const t = functionTextByVar(ctx, 'revalidatePost');
    return !!t && /return\s+doc/.test(t);
  },

  // ── deploy ───────────────────────────────────────────────────────────────
  'deploy:migrate-build': (ctx) => {
    const v = strOf(getPropExpr(findObjectByVar(ctx, 'vercelBuild'), 'buildCommand'));
    return !!v && v.includes('migrate');
  },
  'deploy:framework-next': (ctx) =>
    strOf(getPropExpr(findObjectByVar(ctx, 'vercelBuild'), 'framework')) === 'nextjs',

  // ── next ─────────────────────────────────────────────────────────────────
  'next:access-controls': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'slug', 'posts');
    return objectLit(getPropExpr(o, 'access')) !== undefined;
  },
  'next:unique-slug': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'name', 'slug');
    return boolOf(getPropExpr(o, 'unique')) === true;
  },
  'next:indexed-title': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'name', 'title');
    return boolOf(getPropExpr(o, 'index')) === true;
  },

  // ── proj1 ────────────────────────────────────────────────────────────────
  'proj1:posts-slug': (ctx) => findObjectWithPropValue(ctx, 'slug', 'posts') !== undefined,
  'proj1:drafts': (ctx) => getNested(ctx, ['versions', 'drafts']) !== undefined,
  'proj1:relation-and-upload': (ctx) =>
    findObjectWithPropValue(ctx, 'type', 'relationship') !== undefined &&
    findObjectWithPropValue(ctx, 'type', 'upload') !== undefined,

  // ── proj2 ────────────────────────────────────────────────────────────────
  'proj2:metadata': (ctx) => /generateMetadata/.test(ctx.code),
  'proj2:fetch-by-slug': (ctx) =>
    findCalls(ctx, (n) => n === 'find').some((c) => {
      const t = c.getText(ctx.sourceFile);
      return t.includes('slug') && t.includes('equals');
    }),
  'proj2:not-found': (ctx) => /notFound\b/.test(ctx.code),

  // ── capstone ─────────────────────────────────────────────────────────────
  'capstone:slug': (ctx) => findObjectWithPropValue(ctx, 'slug', 'capstone') !== undefined,
  'capstone:drafts': (ctx) => getNested(ctx, ['versions', 'drafts']) !== undefined,
  'capstone:access': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'slug', 'capstone');
    return objectLit(getPropExpr(o, 'access')) !== undefined;
  },

  // ── ecomm1 ───────────────────────────────────────────────────────────────
  'ecomm1:products-stock': (ctx) => findObjectWithPropValue(ctx, 'name', 'stock') !== undefined,
  'ecomm1:orders-collection': (ctx) => findObjectWithPropValue(ctx, 'slug', 'orders') !== undefined,
  'ecomm1:orders-items-array': (ctx) => {
    const o = findObjectWithPropValue(ctx, 'name', 'items');
    return strOf(getPropExpr(o, 'type')) === 'array';
  },

  // ── ecomm2 ───────────────────────────────────────────────────────────────
  'ecomm2:stripe-import': (ctx) => hasImportFrom(ctx, 'stripe'),
  'ecomm2:construct-event': (ctx) => findCalls(ctx, (n) => n === 'constructEvent').length > 0,
  'ecomm2:fulfills-order': (ctx) =>
    findCalls(ctx, (n) => n === 'update').some((c) => c.getText(ctx.sourceFile).includes("collection: 'orders'")),
};

// Generic fallback rules for lessons without a dedicated spec, keyed by test id.
const FALLBACK_RULES: Record<string, Rule> = {
  'valid-slug': (ctx, lessonId) => findObjectWithPropValue(ctx, 'slug', lessonId) !== undefined,
  'fields-array': (ctx) => {
    const fields = objectArray(firstPropAnywhere(ctx, 'fields'));
    return (
      fields.length > 0 &&
      fields.every((f) => getPropExpr(f, 'name') !== undefined && getPropExpr(f, 'type') !== undefined)
    );
  },
  'use-as-title': (ctx) => firstPropAnywhere(ctx, 'useAsTitle') !== undefined,
};

export function gradeChallenge(lessonId: string, code: string): GradeResult {
  const spec = getChallengeSpec(lessonId);
  const ctx = parseCode(code);
  const syntaxErrors = syntaxErrorMessages(ctx);

  const checks: GradeCheck[] = spec.testCases.map((tc) => {
    const rule = RULES[`${lessonId}:${tc.id}`] || FALLBACK_RULES[tc.id];
    let passed = false;
    if (rule && syntaxErrors.length === 0) {
      try {
        passed = !!rule(ctx, lessonId);
      } catch {
        passed = false;
      }
    }
    return { id: tc.id, label: tc.label, passed, hint: tc.failureHint };
  });

  return {
    passed: checks.length > 0 && checks.every((c) => c.passed),
    checks,
    syntaxErrors,
  };
}
