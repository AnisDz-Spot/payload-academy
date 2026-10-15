// data/challengeSuite.ts

export interface TestCase {
  id: string;
  label: string;
  test: (code: string) => boolean;
  failureHint: string;
}

export interface LessonChallengeSpec {
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
}

export const CHALLENGE_SPECS: Record<string, LessonChallengeSpec> = {
  intro: {
    starterCode: `// Explain the primary difference between Payload 3.x and legacy headless CMSs:
export const payloadAdvantage = {
  executionModel: '', // 'in-process' or 'separate-microservice'
  typeSafety: '',     // '100% typescript' or 'manual types'
  databaseChoice: [], // list supported databases
}
`,
    solutionCode: `export const payloadAdvantage = {
  executionModel: 'in-process',
  typeSafety: '100% typescript',
  databaseChoice: ['postgres', 'sqlite', 'mongodb'],
}
`,
    testCases: [
      {
        id: 'exec',
        label: 'Declares in-process execution model for Next.js App Router',
        test: (c) => c.toLowerCase().includes('in-process'),
        failureHint: "Set executionModel to 'in-process' (Payload lives directly inside your Next.js app).",
      },
      {
        id: 'ts',
        label: 'Specifies 100% TypeScript type safety',
        test: (c) => c.toLowerCase().includes('typescript'),
        failureHint: "Set typeSafety to '100% typescript'.",
      },
      {
        id: 'db',
        label: 'Lists supported databases (Postgres, SQLite, or MongoDB)',
        test: (c) => c.toLowerCase().includes('postgres') || c.toLowerCase().includes('sqlite'),
        failureHint: "Include 'postgres' or 'sqlite' in databaseChoice.",
      },
    ],
  },

  install: {
    starterCode: `// Configure next.config.mjs to integrate Payload 3.x
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // Add configuration
}

export default nextConfig
`,
    solutionCode: `import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  reactStrictMode: true,
}

export default withPayload(nextConfig)
`,
    testCases: [
      {
        id: 'with-payload',
        label: 'Wraps nextConfig with withPayload()',
        test: (c) => /export\s+default\s+withPayload\s*\(\s*nextConfig\s*\)/.test(c),
        failureHint: 'Make sure you export: export default withPayload(nextConfig)',
      },
      {
        id: 'import',
        label: 'Imports withPayload from @payloadcms/next/withPayload',
        test: (c) => c.includes('@payloadcms/next/withPayload'),
        failureHint: "Import withPayload from '@payloadcms/next/withPayload'",
      },
    ],
  },

  config: {
    starterCode: `import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  // 1. Set secret from environment variable
  // 2. Configure postgresAdapter with DATABASE_URI
  // 3. Whitelist production CORS domain 'https://mywebsite.com'
})
`,
    solutionCode: `import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  cors: ['https://mywebsite.com'],
  csrf: ['https://mywebsite.com'],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
})
`,
    testCases: [
      {
        id: 'secret-env',
        label: 'Reads PAYLOAD_SECRET securely from process.env',
        test: (c) => c.includes('process.env.PAYLOAD_SECRET'),
        failureHint: "Define secret: process.env.PAYLOAD_SECRET || ''",
      },
      {
        id: 'db-adapter',
        label: 'Configures postgresAdapter with connectionString',
        test: (c) => c.includes('postgresAdapter') && c.includes('connectionString'),
        failureHint: 'Pass postgresAdapter({ pool: { connectionString: ... } }) to db property.',
      },
      {
        id: 'cors-whitelist',
        label: 'Whitelists strict CORS domain array',
        test: (c) => c.includes('cors:') && c.includes('https://mywebsite.com'),
        failureHint: "Add cors: ['https://mywebsite.com'] to whitelist your domain.",
      },
    ],
  },

  collections: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  // 1. Set collection slug to 'products'
  // 2. Set admin.useAsTitle to 'title'
  // 3. Enable drafts with autosave
  // 4. Add 'title' (required text) and 'price' (required number) fields
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
  },
  versions: {
    drafts: { autosave: true },
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'price', type: 'number', required: true },
  ],
}
`,
    testCases: [
      {
        id: 'slug',
        label: "Sets collection slug to 'products'",
        test: (c) => c.includes("slug: 'products'") || c.includes('slug: "products"'),
        failureHint: "Define slug: 'products'",
      },
      {
        id: 'useAsTitle',
        label: "Configures admin.useAsTitle to 'title'",
        test: (c) => c.includes("useAsTitle: 'title'") || c.includes('useAsTitle: "title"'),
        failureHint: "Define admin: { useAsTitle: 'title' }",
      },
      {
        id: 'versions',
        label: 'Enables drafts and autosave versioning',
        test: (c) => c.includes('drafts') && c.includes('autosave'),
        failureHint: 'Add versions: { drafts: { autosave: true } }',
      },
      {
        id: 'fields',
        label: 'Defines required title (text) and price (number) fields',
        test: (c) => c.includes("name: 'title'") && c.includes("type: 'text'") && c.includes("name: 'price'") && c.includes("type: 'number'"),
        failureHint: "Add both title (type: 'text', required: true) and price (type: 'number', required: true) in fields.",
      },
    ],
  },

  fields: {
    starterCode: `import type { Field } from 'payload'

export const PageBuilderField: Field = {
  name: 'layout',
  type: 'blocks',
  // Configure blocks array with 'hero' block (heading text, backgroundImage upload)
}
`,
    solutionCode: `import type { Field } from 'payload'

export const PageBuilderField: Field = {
  name: 'layout',
  type: 'blocks',
  blocks: [
    {
      slug: 'hero',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
`,
    testCases: [
      {
        id: 'blocks-type',
        label: "Configures type as 'blocks'",
        test: (c) => c.includes("type: 'blocks'") || c.includes('type: "blocks"'),
        failureHint: "Set type: 'blocks'",
      },
      {
        id: 'hero-slug',
        label: "Declares block with slug 'hero'",
        test: (c) => c.includes("slug: 'hero'") || c.includes('slug: "hero"'),
        failureHint: "Add a block object with slug: 'hero'",
      },
      {
        id: 'hero-fields',
        label: 'Includes heading (text) and backgroundImage (upload) fields',
        test: (c) => c.includes("name: 'heading'") && c.includes("name: 'backgroundImage'") && c.includes('relationTo'),
        failureHint: "In hero block fields, include 'heading' (text) and 'backgroundImage' (upload, relationTo: 'media').",
      },
    ],
  },

  access: {
    starterCode: `import type { Access } from 'payload'

// Implement Row-Level Access Control:
// 1. Unauthenticated users can ONLY read published posts (_status equals 'published')
// 2. Admins can read everything (return true)
// 3. Authors can read published posts OR their own drafts (author equals user.id)
export const canReadPosts: Access = ({ req: { user } }) => {
  // Write access logic
}
`,
    solutionCode: `import type { Access } from 'payload'

export const canReadPosts: Access = ({ req: { user } }) => {
  if (!user) {
    return { _status: { equals: 'published' } }
  }
  if (user.role === 'admin') {
    return true
  }
  return {
    or: [
      { _status: { equals: 'published' } },
      { author: { equals: user.id } },
    ],
  }
}
`,
    testCases: [
      {
        id: 'unauth-check',
        label: 'Returns query constraint for published posts when user is null',
        test: (c) => c.includes('!user') && c.includes('_status') && c.includes('published'),
        failureHint: "When !user, return { _status: { equals: 'published' } }",
      },
      {
        id: 'admin-bypass',
        label: 'Grants full boolean true for admin users',
        test: (c) => c.includes("user.role === 'admin'") || c.includes('user?.role === "admin"'),
        failureHint: "If user.role === 'admin', return true.",
      },
      {
        id: 'author-or-published',
        label: 'Returns OR constraint matching published posts or user.id author',
        test: (c) => c.includes('or:') || (c.includes('author') && c.includes('user.id')),
        failureHint: 'Return an OR query matching _status published or author equal to user.id.',
      },
    ],
  },

  hooks: {
    starterCode: `import type { CollectionBeforeChangeHook } from 'payload'

// Write a beforeChange hook that:
// 1. Automatically slugifies title if slug is empty or operation is 'create'
// 2. Strips special characters and replaces spaces with dashes
export const autoSlugHook: CollectionBeforeChangeHook = async ({ data, operation }) => {
  // Write hook logic
  return data
}
`,
    solutionCode: `import type { CollectionBeforeChangeHook } from 'payload'

export const autoSlugHook: CollectionBeforeChangeHook = async ({ data, operation }) => {
  if (data?.title && (!data.slug || operation === 'create')) {
    data.slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  return data
}
`,
    testCases: [
      {
        id: 'title-check',
        label: 'Checks if data.title exists and slug is missing or operation is create',
        test: (c) => c.includes('data?.title') || (c.includes('data.title') && c.includes('operation')),
        failureHint: "Verify data?.title and (operation === 'create' || !data.slug)",
      },
      {
        id: 'slug-replace',
        label: 'Applies slugification transforms (toLowerCase, replace regex)',
        test: (c) => c.includes('.toLowerCase()') && c.includes('.replace('),
        failureHint: 'Transform title with toLowerCase() and replace(/[^a-z0-9]+/g, "-")',
      },
      {
        id: 'return-data',
        label: 'Returns the mutated data object',
        test: (c) => /return\s+data/.test(c),
        failureHint: 'Ensure you return data at the end of the beforeChange hook.',
      },
    ],
  },

  api: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function fetchTopArticles() {
  const payload = await getPayload({ config })

  // Query top 5 published posts sorted by createdAt descending
  // Populating 1st-level relations
  const results = await payload.find({
    // Add query parameters
  })

  return results.docs
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function fetchTopArticles() {
  const payload = await getPayload({ config })

  const results = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 5,
    depth: 1,
  })

  return results.docs
}
`,
    testCases: [
      {
        id: 'collection-slug',
        label: "Specifies collection: 'posts'",
        test: (c) => c.includes("collection: 'posts'") || c.includes('collection: "posts"'),
        failureHint: "Pass collection: 'posts'",
      },
      {
        id: 'where-published',
        label: "Filters for published posts with _status equals 'published'",
        test: (c) => c.includes('_status') && c.includes('published'),
        failureHint: "Add where: { _status: { equals: 'published' } }",
      },
      {
        id: 'sort-limit',
        label: "Applies limit: 5 and sort: '-createdAt'",
        test: (c) => c.includes('limit: 5') && (c.includes("'-createdAt'") || c.includes('"-createdAt"')),
        failureHint: "Set limit: 5 and sort: '-createdAt'",
      },
    ],
  },

  relationships: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  // Configure defaultPopulate to ONLY expose firstName, lastName, and email
  // Prevents leaking password hashes and sensitive token columns
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  defaultPopulate: {
    firstName: true,
    lastName: true,
    email: true,
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
  ],
}
`,
    testCases: [
      {
        id: 'defaultPopulate',
        label: 'Configures defaultPopulate projection object on collection',
        test: (c) => c.includes('defaultPopulate:'),
        failureHint: 'Add defaultPopulate: { firstName: true, lastName: true, email: true }',
      },
      {
        id: 'projected-fields',
        label: 'Selects firstName, lastName, and email',
        test: (c) => c.includes('firstName: true') && c.includes('email: true'),
        failureHint: 'Specify firstName: true and email: true inside defaultPopulate.',
      },
    ],
  },
};

// Generic Fallback generator for lessons without dedicated manual spec
export function getChallengeSpec(lessonId: string): LessonChallengeSpec {
  if (CHALLENGE_SPECS[lessonId]) {
    return CHALLENGE_SPECS[lessonId];
  }

  // Auto-generate realistic spec
  return {
    starterCode: `import type { CollectionConfig } from 'payload'

// Challenge for Lesson: "${lessonId}"
export const CustomConfig: CollectionConfig = {
  slug: '${lessonId}',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    // Add additional fields or logic for this lesson
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const CustomConfig: CollectionConfig = {
  slug: '${lessonId}',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' },
  ],
}
`,
    testCases: [
      {
        id: 'valid-slug',
        label: `Declares collection slug matching "${lessonId}"`,
        test: (c) => c.includes(`slug: '${lessonId}'`) || c.includes(`slug: "${lessonId}"`),
        failureHint: `Set slug: '${lessonId}' in your config.`,
      },
      {
        id: 'fields-array',
        label: 'Defines valid fields array with required name and type',
        test: (c) => c.includes('fields:') && c.includes('type:'),
        failureHint: "Ensure you have a fields array containing { name: '...', type: '...' }",
      },
      {
        id: 'use-as-title',
        label: 'Configures admin.useAsTitle property',
        test: (c) => c.includes('useAsTitle:'),
        failureHint: "Configure admin: { useAsTitle: 'title' }",
      },
    ],
  };
}
