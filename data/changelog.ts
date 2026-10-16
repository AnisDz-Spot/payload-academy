export interface ChangelogRelease {
  version: string;
  date: string;
  tag: 'Major' | 'Minor' | 'Patch';
  headline: string;
  summary: string;
  highlights: string[];
  breakingChanges?: string[];
  migrationTips?: string[];
}

export const CHANGELOG_DATA: ChangelogRelease[] = [
  {
    version: 'v3.90.0',
    date: 'September 2026',
    tag: 'Minor',
    headline: 'Critical Security Fixes, Session Revocation & Client Upload Paths',
    summary: 'A security-focused release: password changes now revoke other sessions, password resets clear lockouts (and forgot-password is throttled), and client uploads adopt a new object-key storage path.',
    highlights: [
      'Changing a password now revokes all other active sessions for that user',
      'Password reset clears account lockouts; forgot-password requests are rate-limited',
      'Client uploads are stored at <prefix>/<_objectKey>/<filename>, including generated image sizes',
      'Rich text editor deps are now re-exported from @payloadcms/richtext-lexical to prevent version drift'
    ],
    breakingChanges: [
      'Client upload paths changed — update any code that builds file paths from prefix + filename',
      'Remove direct editor dependencies and import from @payloadcms/richtext-lexical/lexical instead'
    ],
    migrationTips: [
      'Regenerate types: pnpm payload generate:types',
      'Relational databases: run pnpm payload migrate:create <name> then pnpm payload migrate',
      'Upgrade as soon as possible — this release contains critical security patches'
    ]
  },
  {
    version: 'v3.87.0',
    date: 'July 2026',
    tag: 'Minor',
    headline: 'Large Azure Uploads & Broad Stability Fixes',
    summary: 'Azure client uploads over 5GB are now supported with chunkLargeFiles, alongside a wide round of fixes across localization, databases, uploads, folders and the admin UI.',
    highlights: [
      'Azure storage handles client uploads larger than 5GB when chunkLargeFiles is enabled',
      'Vercel Blob storage allows overwriting existing blob keys',
      'Arrays and blocks now handle null values correctly; Drizzle validates companion table names',
      'Swapped image-size for image-dimensions when reading upload dimensions'
    ],
    migrationTips: [
      'Update @payloadcms/* and payload to ^3.87.0'
    ]
  },
  {
    version: 'v3.85.0',
    date: 'May 2026',
    tag: 'Minor',
    headline: 'Import/Export Plugin Leaves Beta',
    summary: 'The official import/export plugin is now stable, making it easy to migrate content between environments and bootstrap new projects.',
    highlights: [
      'Import/Export plugin marked stable and out of beta',
      'Round-trip content migration between environments'
    ]
  },
  {
    version: 'v3.84.0',
    date: 'April 2026',
    tag: 'Minor',
    headline: 'Client Components as Custom Collection Views + Plugin Order',
    summary: 'Custom collection views can now be built with client React components, the plugin API gained ordering and discovery, and the v3 line moved to maintenance as v4 development began on main.',
    highlights: [
      'Fully custom list/edit views using client components (v3.84)',
      'Plugins can declare execution order, priority, and discover other plugins by slug (v3.83)',
      'Editable query presets for editorial teams (v3.78)',
      'v3.x becomes the maintenance line — v4 development has begun on main'
    ],
    migrationTips: [
      'Upgrade @payloadcms/next and @payloadcms/ui to ^3.84.0 together to avoid version mismatches'
    ]
  },
  {
    version: 'v3.78.0',
    date: 'January 2026',
    tag: 'Minor',
    headline: 'Dashboards, Editable Query Presets & Next.js 16 Support',
    summary: 'Configurable dashboard widgets, smarter query management, and official compatibility with Next.js 16 — the framework version the Academy is built on.',
    highlights: [
      'Dashboard widgets with their own editable settings',
      'Editable query presets to save and reuse complex filters',
      'Next.js 16 compatibility across @payloadcms/next',
      'Client components supported for custom collection views'
    ]
  },
  {
    version: 'v3.54.0',
    date: 'October 2025',
    tag: 'Minor',
    headline: 'Winter Roundup: Parallel Jobs, Slug Field & Conditional Lexical Blocks',
    summary: 'Background job tasks can run in parallel, Lexical blocks can be conditionally shown based on other fields, and a dedicated slug field type removes the need for custom beforeChange hooks.',
    highlights: [
      'Parallel job queue tasks for faster multi-step background workflows (v3.54)',
      'Conditional blocks in Lexical, shown or hidden based on other field values (v3.57)',
      'Dedicated slug field type with lock/unlock controls',
      'Additional content-modeling and Lexical editor improvements (v3.50–v3.65)'
    ]
  },
  {
    version: 'v3.18.0',
    date: 'March 2025',
    tag: 'Minor',
    headline: 'Next.js 15.2 Support, Dynamic Live Preview & Parallel Hook Execution',
    summary: 'Optimized Server Action streaming, lightning-fast dynamic live preview with debounced visual iframe sync, and parallelized beforeValidate / afterChange collection hooks.',
    highlights: [
      'Full compatibility with Next.js 15.2 and React 19 canary features',
      'Live Preview postMessage protocol now supports sub-document updates without iframe reload',
      'Config-level parallel hooks flag for extreme throughput during bulk operations',
      'Added bulk update endpoint with granular transaction rollback support in Postgres & SQLite'
    ],
    breakingChanges: [
      'Custom Live Preview renderers now require returning an unsubscribe cleanup function'
    ],
    migrationTips: [
      'Update @payloadcms/next and @payloadcms/ui to ^3.18.0 in package.json',
      'Run npx payload migrate to check any adapter schema delta'
    ]
  },
  {
    version: 'v3.12.0',
    date: 'January 2025',
    tag: 'Minor',
    headline: 'Vector Search Plugin, SQLite Performance Boost & Granular Field Access in Lexical',
    summary: 'Official vector embeddings support for semantic search across richText blocks, 4x faster SQLite queries with WAL mode auto-tuning, and node-level RBAC for Lexical editor.',
    highlights: [
      'Official @payloadcms/plugin-vector-search with OpenAI, Cohere, and Ollama providers',
      'Drizzle SQLite adapter now automatically runs in WAL mode with connection pooling',
      'Lexical custom block components now inherit user role permissions directly from parent field',
      'Enhanced payload.find() pagination with cursor-based keyset pagination'
    ],
    migrationTips: [
      'If using custom SQLite database files, ensure filesystem write permissions for -wal and -shm temporary files'
    ]
  },
  {
    version: 'v3.6.0',
    date: 'November 2024',
    tag: 'Minor',
    headline: 'Native Join Fields, Nested Document Virtual Populate & Multi-DB Sharding',
    summary: 'Introduced two-way virtual relationships via type: "join" without database denormalization, deep populated nested documents, and multi-tenant schema isolation.',
    highlights: [
      'First-class `type: "join"` fields with zero redundant foreign keys stored',
      'Support for multiple database instances within a single Payload config',
      'Auto-generated TypeScript types now produce discriminated unions for polymorphic blocks',
      'Integrated Server Component helpers `getPayloadClient()` for React Server Components'
    ]
  },
  {
    version: 'v3.0.0',
    date: 'September 2024',
    tag: 'Major',
    headline: 'Payload 3.0: Native Next.js App Router, Universal TypeScript & Drizzle ORM',
    summary: 'The revolutionary re-architecture that embeds Payload directly inside your Next.js application without a separate Express server or process.',
    highlights: [
      'Runs natively inside Next.js App Router (app/(payload)/admin) as standard Server Components',
      'Zero Express server required — zero overhead, shared React cache, native Next.js Turbopack',
      'New database adapter architecture powered by Drizzle ORM (PostgreSQL, SQLite) and MongoDB',
      'Lexical richText is now the default high-performance editor with headless AST output',
      'Strict end-to-end TypeScript types generated directly from your collection schemas'
    ],
    breakingChanges: [
      'payload.config.ts now requires buildConfig from @payloadcms/next/config',
      'Slate editor deprecated in favor of @payloadcms/richtext-lexical',
      'Express middleware replaced by standard Next.js route handlers and Server Actions'
    ],
    migrationTips: [
      'Use the automated migration CLI: `npx @payloadcms/migrate-v2-to-v3`',
      'Replace all `req.payload.find` calls with the async `getPayload({ config })` helper'
    ]
  }
];
