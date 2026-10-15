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
