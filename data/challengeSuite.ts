// data/challengeSuite.ts
//
// Client-safe challenge metadata: starter code, reference solution and the
// human-readable description of each check. The actual AST-based grading logic
// lives server-side in `lib/challengeGrading.ts` (so the TypeScript compiler is
// never bundled into the browser).

export interface TestCase {
  id: string;
  label: string;
  failureHint: string;
}

export interface LessonChallengeSpec {
  starterCode: string;
  solutionCode: string;
  testCases: TestCase[];
}

export const CHALLENGE_SPECS: Record<string, LessonChallengeSpec> = {
  prereqs: {
    starterCode: `// Describe the runtime requirements Payload 3.x needs.
// Export a "prerequisites" object with node, packageManager and database keys.
export const prerequisites = {
}
`,
    solutionCode: `export const prerequisites = {
  node: '>=18',
  packageManager: 'pnpm',
  database: 'postgres',
}
`,
    testCases: [
      {
        id: 'node',
        label: 'Declares a required Node.js version',
        failureHint: "Add a node key, for example: node: '>=18'.",
      },
      {
        id: 'package-manager',
        label: 'Names a package manager',
        failureHint: "Add a packageManager key, for example: 'pnpm'.",
      },
      {
        id: 'database',
        label: 'Names a supported database',
        failureHint: "Add a database key, for example: 'postgres'.",
      },
    ],
  },

  quickstart: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function getLatestPosts() {
  const payload = await getPayload({ config })
  // TODO: fetch the 10 newest posts from the 'posts' collection
  return []
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function getLatestPosts() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    limit: 10,
    sort: '-createdAt',
  })
  return docs
}
`,
    testCases: [
      {
        id: 'payload-init',
        label: 'Initializes Payload with getPayload before querying',
        failureHint: 'Call await getPayload({ config }) first.',
      },
      {
        id: 'find-posts',
        label: "Queries the 'posts' collection",
        failureHint: "Call payload.find({ collection: 'posts' }).",
      },
      {
        id: 'limits-results',
        label: 'Limits the query to 10 results',
        failureHint: 'Pass limit: 10 to payload.find().',
      },
    ],
  },

  'admin-tour': {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    // TODO: configure useAsTitle, defaultColumns and group
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'status', type: 'select', options: ['draft', 'published'] },
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'updatedAt'],
    group: 'Content',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'status', type: 'select', options: ['draft', 'published'] },
  ],
}
`,
    testCases: [
      {
        id: 'use-as-title',
        label: 'Sets admin.useAsTitle to a field name',
        failureHint: "Add useAsTitle: 'title' inside admin.",
      },
      {
        id: 'default-columns',
        label: 'Defines at least one default column',
        failureHint: "Add defaultColumns: ['title', 'status', 'updatedAt'].",
      },
      {
        id: 'group',
        label: 'Assigns the collection to an admin group',
        failureHint: "Add group: 'Content' inside admin.",
      },
    ],
  },

  'dev-loop': {
    starterCode: `export const packageJson = {
  scripts: {
    // TODO: add "dev", "build" and "generate:types" scripts
  },
}
`,
    solutionCode: `export const packageJson = {
  scripts: {
    dev: 'next dev',
    build: 'next build',
    'generate:types': 'payload generate:types',
  },
}
`,
    testCases: [
      {
        id: 'dev-script',
        label: 'Defines a dev script that runs next dev',
        failureHint: "Add dev: 'next dev' inside scripts.",
      },
      {
        id: 'build-script',
        label: 'Defines a build script that runs next build',
        failureHint: "Add build: 'next build' inside scripts.",
      },
      {
        id: 'generate-types',
        label: 'Defines a generate:types script',
        failureHint: "Add 'generate:types': 'payload generate:types' inside scripts.",
      },
    ],
  },

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
        failureHint: "Set executionModel to 'in-process' (Payload lives directly inside your Next.js app).",
      },
      {
        id: 'ts',
        label: 'Specifies 100% TypeScript type safety',
        failureHint: "Set typeSafety to '100% typescript'.",
      },
      {
        id: 'db',
        label: 'Lists supported databases (Postgres, SQLite, or MongoDB)',
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
        failureHint: 'Make sure you export: export default withPayload(nextConfig)',
      },
      {
        id: 'import',
        label: 'Imports withPayload from @payloadcms/next/withPayload',
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
        failureHint: "Define secret: process.env.PAYLOAD_SECRET || ''",
      },
      {
        id: 'db-adapter',
        label: 'Configures postgresAdapter with connectionString',
        failureHint: 'Pass postgresAdapter({ pool: { connectionString: ... } }) to db property.',
      },
      {
        id: 'cors-whitelist',
        label: 'Whitelists strict CORS domain array',
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
        failureHint: "Define slug: 'products'",
      },
      {
        id: 'useAsTitle',
        label: "Configures admin.useAsTitle to 'title'",
        failureHint: "Define admin: { useAsTitle: 'title' }",
      },
      {
        id: 'versions',
        label: 'Enables drafts and autosave versioning',
        failureHint: 'Add versions: { drafts: { autosave: true } }',
      },
      {
        id: 'fields',
        label: 'Defines required title (text) and price (number) fields',
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
        failureHint: "Set type: 'blocks'",
      },
      {
        id: 'hero-slug',
        label: "Declares block with slug 'hero'",
        failureHint: "Add a block object with slug: 'hero'",
      },
      {
        id: 'hero-fields',
        label: 'Includes heading (text) and backgroundImage (upload) fields',
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
        failureHint: "When !user, return { _status: { equals: 'published' } }",
      },
      {
        id: 'admin-bypass',
        label: 'Grants full boolean true for admin users',
        failureHint: "If user.role === 'admin', return true.",
      },
      {
        id: 'author-or-published',
        label: 'Returns OR constraint matching published posts or user.id author',
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
        failureHint: "Verify data?.title and (operation === 'create' || !data.slug)",
      },
      {
        id: 'slug-replace',
        label: 'Applies slugification transforms (toLowerCase, replace regex)',
        failureHint: 'Transform title with toLowerCase() and replace(/[^a-z0-9]+/g, "-")',
      },
      {
        id: 'return-data',
        label: 'Returns the mutated data object',
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
        failureHint: "Pass collection: 'posts'",
      },
      {
        id: 'where-published',
        label: "Filters for published posts with _status equals 'published'",
        failureHint: "Add where: { _status: { equals: 'published' } }",
      },
      {
        id: 'sort-limit',
        label: "Applies limit: 5 and sort: '-createdAt'",
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
        failureHint: 'Add defaultPopulate: { firstName: true, lastName: true, email: true }',
      },
      {
        id: 'projected-fields',
        label: 'Selects firstName, lastName, and email',
        failureHint: 'Specify firstName: true and email: true inside defaultPopulate.',
      },
    ],
  },

  globals: {
    starterCode: `import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  // Add a 'logo' upload field and a 'links' array of { label, url }
  fields: [],
}
`,
    solutionCode: `import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
`,
    testCases: [
      {
        id: 'slug-navigation',
        label: "Defines a global with slug 'navigation'",
        failureHint: "Set slug: 'navigation' on the global config.",
      },
      {
        id: 'logo-upload',
        label: "Adds a 'logo' upload field linked to media",
        failureHint: "Add { name: 'logo', type: 'upload', relationTo: 'media' }.",
      },
      {
        id: 'links-array',
        label: "Adds a 'links' array field",
        failureHint: "Add a field { name: 'links', type: 'array', fields: [...] }.",
      },
    ],
  },

  join: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [
    { name: 'title', type: 'text' },
    // Add a join field linking to posts via the 'category' relationship
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'relatedPosts',
      type: 'join',
      collection: 'posts',
      on: 'category',
    },
  ],
}
`,
    testCases: [
      {
        id: 'join-type',
        label: "Declares a field of type 'join'",
        failureHint: "Add a field with type: 'join'.",
      },
      {
        id: 'join-config',
        label: "Targets collection 'posts' joined on the 'category' field",
        failureHint: "Set collection: 'posts' and on: 'category' on the join field.",
      },
    ],
  },

  auth: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Configure maxLoginAttempts and secure cookie settings
  },
  fields: [],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 5,
    lockTime: 600000,
    cookies: {
      sameSite: 'Lax',
      secure: true,
      httpOnly: true,
    },
  },
  fields: [],
}
`,
    testCases: [
      {
        id: 'auth-maxlogin',
        label: 'Sets a numeric maxLoginAttempts lockout threshold',
        failureHint: 'Add auth.maxLoginAttempts (a number, e.g. 5).',
      },
      {
        id: 'auth-cookie-secure',
        label: 'Enables secure auth cookies',
        failureHint: 'Set auth.cookies.secure to true.',
      },
      {
        id: 'auth-cookie-httponly',
        label: 'Enables httpOnly auth cookies',
        failureHint: 'Set auth.cookies.httpOnly to true.',
      },
    ],
  },

  apikeys: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const ServiceAccounts: CollectionConfig = {
  slug: 'service-accounts',
  auth: {
    // Enable API key authentication
  },
  fields: [],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const ServiceAccounts: CollectionConfig = {
  slug: 'service-accounts',
  auth: {
    useAPIKey: true,
  },
  fields: [],
}
`,
    testCases: [
      {
        id: 'auth-block',
        label: 'Defines an auth configuration block',
        failureHint: 'Add an auth: { ... } object to the collection.',
      },
      {
        id: 'use-api-key',
        label: 'Enables API key authentication (useAPIKey: true)',
        failureHint: 'Set auth.useAPIKey to true.',
      },
    ],
  },

  uploads: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Add imageSizes: thumbnail, card, and hero
  },
  fields: [],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 768, height: 576 },
      { name: 'hero', width: 1600, height: 900 },
    ],
  },
  fields: [],
}
`,
    testCases: [
      {
        id: 'upload-imagesizes',
        label: 'Declares an upload.imageSizes array',
        failureHint: 'Add upload: { imageSizes: [...] }.',
      },
      {
        id: 'sizes-named',
        label: "Defines 'thumbnail', 'card', and 'hero' sizes",
        failureHint: "Include size entries named 'thumbnail', 'card', and 'hero'.",
      },
    ],
  },

  layout: {
    starterCode: `import type { Field } from 'payload'

export const LayoutField: Field = {
  // Build a Tabs field: a 'Content' tab and an 'SEO' group tab
}
`,
    solutionCode: `import type { Field } from 'payload'

export const LayoutField: Field = {
  type: 'tabs',
  tabs: [
    {
      label: 'Content',
      fields: [{ name: 'title', type: 'text' }],
    },
    {
      label: 'SEO',
      fields: [
        {
          name: 'seo',
          type: 'group',
          fields: [
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}
`,
    testCases: [
      {
        id: 'tabs-type',
        label: "Declares a field of type 'tabs'",
        failureHint: "Set type: 'tabs'.",
      },
      {
        id: 'tabs-array',
        label: 'Provides a tabs array with at least two tabs',
        failureHint: 'Add a tabs: [ ... ] array containing at least two tab objects.',
      },
      {
        id: 'seo-group',
        label: "Nests an 'seo' group field",
        failureHint: "Add a field { name: 'seo', type: 'group', fields: [...] }.",
      },
    ],
  },

  webhooks: {
    starterCode: `import type { CollectionAfterChangeHook } from 'payload'

// Send an outgoing webhook with an HMAC SHA-256 signature on change
export const notifyWebhook: CollectionAfterChangeHook = async ({ doc }) => {
  // Sign the payload and POST it to a remote endpoint
  return doc
}
`,
    solutionCode: `import type { CollectionAfterChangeHook } from 'payload'
import crypto from 'crypto'

export const notifyWebhook: CollectionAfterChangeHook = async ({ doc }) => {
  const body = JSON.stringify({ id: doc.id })
  const signature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET || '')
    .update(body)
    .digest('hex')

  await fetch('https://example.com/webhook', {
    method: 'POST',
    headers: { 'x-signature': signature },
    body,
  })

  return doc
}
`,
    testCases: [
      {
        id: 'sign-hmac',
        label: "Signs the payload with an HMAC SHA-256 digest",
        failureHint: "Use crypto.createHmac('sha256', secret).update(body).digest('hex').",
      },
      {
        id: 'outgoing-fetch',
        label: 'POSTs the signed payload to a remote endpoint',
        failureHint: 'Call fetch(...) with method POST to deliver the webhook.',
      },
      {
        id: 'return-doc',
        label: 'Returns the mutated doc',
        failureHint: 'Return doc at the end of the hook.',
      },
    ],
  },

  i18n: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  // Enable localization for English, French, and Arabic
})
`,
    solutionCode: `import { buildConfig } from 'payload'

export default buildConfig({
  localization: {
    locales: ['en', 'fr', 'ar'],
    defaultLocale: 'en',
    fallback: true,
  },
})
`,
    testCases: [
      {
        id: 'locales',
        label: "Registers the 'en', 'fr', and 'ar' locales",
        failureHint: "Set localization.locales to ['en', 'fr', 'ar'].",
      },
      {
        id: 'default-locale',
        label: "Sets the default locale to 'en'",
        failureHint: "Set localization.defaultLocale to 'en'.",
      },
    ],
  },

  jobs: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  // Configure a jobs queue with an email broadcast task
})
`,
    solutionCode: `import { buildConfig } from 'payload'

export default buildConfig({
  jobs: {
    tasks: [
      {
        slug: 'emailBroadcast',
        handler: async ({ input }) => {
          // fan out the email batch
          return { output: { sent: input?.count ?? 0 } }
        },
      },
    ],
  },
})
`,
    testCases: [
      {
        id: 'jobs-tasks',
        label: 'Declares a jobs.tasks array',
        failureHint: 'Add jobs: { tasks: [ ... ] }.',
      },
      {
        id: 'task-slug',
        label: 'Defines at least one task with a slug',
        failureHint: 'Give each task object a slug string.',
      },
    ],
  },

  queries: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function complexQuery() {
  const payload = await getPayload({ config })

  const results = await payload.find({
    collection: 'posts',
    // Build an OR of an AND clause, and project specific columns
  })

  return results.docs
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function complexQuery() {
  const payload = await getPayload({ config })

  const results = await payload.find({
    collection: 'posts',
    where: {
      or: [
        { and: [{ _status: { equals: 'published' } }, { category: { equals: 'tech' } }] },
        { featured: { equals: true } },
      ],
    },
    select: { title: true, slug: true },
    depth: 0,
  })

  return results.docs
}
`,
    testCases: [
      {
        id: 'where-or',
        label: 'Builds an OR where clause array',
        failureHint: 'Add where: { or: [ ... ] }.',
      },
      {
        id: 'select-projection',
        label: 'Projects columns with a select object',
        failureHint: 'Add select: { title: true, ... } to limit returned fields.',
      },
    ],
  },

  structure: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'
import type { Post } from '@/payload-types'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'content', type: 'richText' },
  ],
}
`,
    testCases: [
      {
        id: 'typed-collection',
        label: "Defines a typed 'posts' collection with a fields array",
        failureHint: "Add slug: 'posts' and a non-empty fields array.",
      },
      {
        id: 'generated-types',
        label: 'Imports generated types from @/payload-types',
        failureHint: "Import a generated type: import type { Post } from '@/payload-types'",
      },
    ],
  },

  cli: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

async function listPosts() {
  const payload = await getPayload({ config })
  // Query the posts collection
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'

async function listPosts() {
  const payload = await getPayload({ config })
  const posts = await payload.find({ collection: 'posts' })
  return posts.docs
}
`,
    testCases: [
      {
        id: 'imports-payload',
        label: "Imports from 'payload'",
        failureHint: "import { getPayload } from 'payload'",
      },
      {
        id: 'getpayload',
        label: 'Boots the Local API with getPayload()',
        failureHint: 'Call getPayload({ config }) to get a Payload instance.',
      },
      {
        id: 'find-posts',
        label: "Queries the 'posts' collection",
        failureHint: "await payload.find({ collection: 'posts' })",
      },
    ],
  },

  customauth: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function githubAuth(code: string) {
  const payload = await getPayload({ config })
  // Exchange the code with GitHub and log the user in
  return { ok: true }
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function githubAuth(code: string) {
  const payload = await getPayload({ config })

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    body: JSON.stringify({ code }),
  })
  const data = await tokenRes.json()

  await payload.create({
    collection: 'users',
    data: { email: 'github-user@example.com', githubToken: data.access_token },
  })

  return Response.json({ ok: true })
}
`,
    testCases: [
      {
        id: 'github-fetch',
        label: 'Exchanges the code at the GitHub OAuth token endpoint',
        failureHint: "fetch('https://github.com/login/oauth/access_token', ...)",
      },
      {
        id: 'local-create',
        label: "Creates/links the user with payload.create on 'users'",
        failureHint: "await payload.create({ collection: 'users', data: ... })",
      },
      {
        id: 'returns-response',
        label: 'Returns a Response.json(...) for the route handler',
        failureHint: 'End the handler with return Response.json({ ... }).',
      },
    ],
  },

  secprod: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  cors: ['*'],
  // Lock down the admin surface before production
})
`,
    solutionCode: `import { buildConfig } from 'payload'

export default buildConfig({
  cors: ['https://app.example.com'],
  csrf: ['https://app.example.com'],
})
`,
    testCases: [
      {
        id: 'strict-cors',
        label: 'Restricts CORS to explicit origins (no wildcard)',
        failureHint: "Set cors to an explicit array such as ['https://app.example.com'].",
      },
      {
        id: 'csrf-set',
        label: 'Enables CSRF protection with a trusted origin list',
        failureHint: "Add csrf: ['https://app.example.com'].",
      },
    ],
  },

  drafts: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  // Enable drafts and live preview
  fields: [{ name: 'title', type: 'text' }],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { drafts: true },
  admin: {
    livePreview: {
      url: 'https://example.com/api/preview',
      breakpoints: ['mobile', 'tablet', 'desktop'],
    },
  },
  fields: [{ name: 'title', type: 'text' }],
}
`,
    testCases: [
      {
        id: 'drafts-enabled',
        label: 'Enables versioned drafts',
        failureHint: 'Add versions: { drafts: true }.',
      },
      {
        id: 'live-preview-url',
        label: 'Configures a live preview URL',
        failureHint: "Add admin.livePreview.url.",
      },
      {
        id: 'breakpoints',
        label: 'Declares live preview breakpoints',
        failureHint: "Add admin.livePreview.breakpoints: ['mobile', 'tablet', 'desktop'].",
      },
    ],
  },

  actions: {
    starterCode: `import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function createInquiry(form: unknown) {
  // Validate the input and persist an inquiry
  return { ok: true }
}
`,
    solutionCode: `import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'

const inquirySchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
})

export async function createInquiry(form: unknown) {
  const parsed = inquirySchema.safeParse(form)
  if (!parsed.success) {
    return { ok: false }
  }

  const payload = await getPayload({ config })
  await payload.create({ collection: 'inquiries', data: parsed.data })
  return { ok: true }
}
`,
    testCases: [
      {
        id: 'zod-schema',
        label: 'Defines a Zod object schema with string fields',
        failureHint: 'Use z.object({ name: z.string(), ... }).',
      },
      {
        id: 'validates',
        label: 'Validates input with parse/safeParse before writing',
        failureHint: 'Call inquirySchema.safeParse(form) inside createInquiry.',
      },
      {
        id: 'local-create',
        label: "Persists via payload.create on 'inquiries'",
        failureHint: "await payload.create({ collection: 'inquiries', data: parsed.data })",
      },
    ],
  },

  frontend: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export default async function Page() {
  // Server-fetch posts at build time
  return null
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-static'

export default async function Page() {
  const payload = await getPayload({ config })
  const posts = await payload.find({ collection: 'posts' })
  return posts.docs
}
`,
    testCases: [
      {
        id: 'server-component',
        label: 'Uses the Local API inside a server component',
        failureHint: 'Call getPayload({ config }) directly in the server component.',
      },
      {
        id: 'finds-posts',
        label: "Fetches the 'posts' collection",
        failureHint: "payload.find({ collection: 'posts' })",
      },
      {
        id: 'force-static',
        label: "Opts into static rendering with dynamic = 'force-static'",
        failureHint: "export const dynamic = 'force-static'.",
      },
    ],
  },

  seeding: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function seed() {
  const payload = await getPayload({ config })
  // Seed an admin user without duplicating rows
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export async function seed() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'users' })
  if (existing.totalDocs > 0) {
    return
  }

  await payload.create({
    collection: 'users',
    data: { email: 'admin@example.com', password: 'secret' },
  })

  return
}
`,
    testCases: [
      {
        id: 'idempotent',
        label: 'Guards the seed with a count() check before writing',
        failureHint: 'Call payload.count({ collection: "users" }) and return early if docs already exist.',
      },
      {
        id: 'creates-admin',
        label: "Creates the admin user on the 'users' collection",
        failureHint: "await payload.create({ collection: 'users', data: ... })",
      },
    ],
  },

  admin: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    // Swap in a custom dashboard component
  },
})
`,
    solutionCode: `import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
      views: {
        dashboard: { Component: '/components/Dashboard' },
      },
    },
  },
})
`,
    testCases: [
      {
        id: 'views-config',
        label: 'Declares admin.components.views',
        failureHint: 'Add admin: { components: { views: { ... } } }.',
      },
      {
        id: 'dashboard-component',
        label: 'Overrides the dashboard view component',
        failureHint: "Set views.dashboard = { Component: '/components/Dashboard' }.",
      },
    ],
  },

  customui: {
    starterCode: `import { TextFieldClientComponent } from '@payloadcms/ui'

export const ColorPicker: TextFieldClientComponent = (props) => {
  // Render a color input and wire it back to Payload
  return props
}
`,
    solutionCode: `import { TextFieldClientComponent } from '@payloadcms/ui'

export const ColorPicker: TextFieldClientComponent = (props) => {
  return {
    ...props,
    inputType: 'color',
  }
}
`,
    testCases: [
      {
        id: 'client-component',
        label: 'Builds the field as a TextFieldClientComponent',
        failureHint: 'Type ColorPicker as TextFieldClientComponent from @payloadcms/ui.',
      },
      {
        id: 'color-input',
        label: "Wires the input type to 'color'",
        failureHint: "Include inputType: 'color' in the component.",
      },
    ],
  },

  theming: {
    starterCode: `// Brand the admin panel with a custom theme
export const adminTheme = {
  brandColor: '',
  css: '',
}
`,
    solutionCode: `export const adminTheme = {
  brandColor: '#6d28d9',
  css: \`
    :root {
      --theme-elevation-0: #ffffff;
      --theme-success-500: #10b981;
    }
    .nav {
      background: linear-gradient(135deg, #6d28d9, #2563eb);
    }
  \`,
}
`,
    testCases: [
      {
        id: 'brand-color',
        label: 'Sets a brandColor token',
        failureHint: "Set brandColor to a hex value such as '#6d28d9'.",
      },
      {
        id: 'css-var',
        label: 'Overrides a --theme-* CSS variable',
        failureHint: 'In css, override a variable like --theme-elevation-0.',
      },
      {
        id: 'gradient',
        label: 'Applies a linear-gradient in the custom CSS',
        failureHint: 'Add a linear-gradient(...) background rule.',
      },
    ],
  },

  whitelabel: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    // Replace the login screen and logo
  },
})
`,
    solutionCode: `import { buildConfig } from 'payload'

export default buildConfig({
  admin: {
    components: {
      views: {
        login: { Component: '/components/Login' },
      },
      graphics: {
        Logo: '/components/Logo',
        Icon: '/components/Icon',
      },
    },
  },
})
`,
    testCases: [
      {
        id: 'login-view',
        label: 'Overrides the login view component',
        failureHint: "Set admin.components.views.login = { Component: '/components/Login' }.",
      },
      {
        id: 'graphics',
        label: 'Supplies custom admin graphics',
        failureHint: 'Add admin.components.graphics with Logo/Icon.',
      },
    ],
  },

  richtext: {
    starterCode: `import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  editor: lexicalEditor(),
})
`,
    solutionCode: `import { buildConfig } from 'payload'
import { lexicalEditor, defaultFeatures } from '@payloadcms/richtext-lexical'

const calloutFeature = {
  mark: { name: 'callout' },
}

export default buildConfig({
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, calloutFeature],
  }),
})
`,
    testCases: [
      {
        id: 'lexical-editor',
        label: 'Configures the Lexical editor',
        failureHint: 'Call lexicalEditor({ ... }).',
      },
      {
        id: 'custom-feature',
        label: 'Extends the default feature set',
        failureHint: 'Spread defaultFeatures and append your own feature.',
      },
      {
        id: 'callout-feature',
        label: 'Adds a custom callout feature',
        failureHint: 'Define and include a callout feature.',
      },
    ],
  },

  nesteddocs: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  // Add the nested docs plugin for hierarchical pages
})
`,
    solutionCode: `import { buildConfig } from 'payload'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

export default buildConfig({
  plugins: [
    nestedDocsPlugin({
      collections: ['pages'],
      generateLabel: (_, doc) => doc.title,
    }),
  ],
})
`,
    testCases: [
      {
        id: 'plugin-import',
        label: 'Imports the nested docs plugin',
        failureHint: "import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'",
      },
      {
        id: 'plugins-array',
        label: 'Registers the plugin in buildConfig.plugins',
        failureHint: 'Add plugins: [ nestedDocsPlugin({ ... }) ].',
      },
      {
        id: 'collections-target',
        label: "Applies nesting to the 'pages' collection",
        failureHint: "Pass collections: ['pages'] to the plugin.",
      },
    ],
  },

  transactions: {
    starterCode: `import type { PayloadRequest } from 'payload'

export async function transfer(req: PayloadRequest, from: string, to: string) {
  // Perform the two writes atomically
}
`,
    solutionCode: `import type { PayloadRequest } from 'payload'

export async function transfer(req: PayloadRequest, from: string, to: string) {
  const { db } = req.payload
  const transaction = await db.beginTransaction()
  try {
    await db.commitTransaction(transaction)
  } catch (err) {
    await db.rollbackTransaction(transaction)
    throw err
  }
}
`,
    testCases: [
      {
        id: 'begin',
        label: 'Opens a transaction with beginTransaction',
        failureHint: 'Call db.beginTransaction().',
      },
      {
        id: 'commit',
        label: 'Commits the transaction on success',
        failureHint: 'Call db.commitTransaction(transaction).',
      },
      {
        id: 'rollback',
        label: 'Rolls back the transaction on failure',
        failureHint: 'Call db.rollbackTransaction(transaction) in the catch block.',
      },
    ],
  },

  storage: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  // Store media in S3 instead of local disk
})
`,
    solutionCode: `import { buildConfig } from 'payload'
import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET || '',
    }),
  ],
})
`,
    testCases: [
      {
        id: 'plugin-import',
        label: 'Imports a Payload storage adapter',
        failureHint: "import { s3Storage } from '@payloadcms/storage-s3'",
      },
      {
        id: 'plugins-array',
        label: 'Registers the storage adapter in plugins',
        failureHint: 'Add plugins: [ s3Storage({ ... }) ].',
      },
      {
        id: 'bucket-env',
        label: 'Reads the bucket/credentials from the environment',
        failureHint: 'Reference process.env.S3_BUCKET (or BLOB_READ_WRITE_TOKEN).',
      },
    ],
  },

  email: {
    starterCode: `import { buildConfig } from 'payload'

export default buildConfig({
  // Send transactional email through an adapter
})
`,
    solutionCode: `import { buildConfig } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress: 'no-reply@example.com',
    defaultFromName: 'Payload Academy',
  }),
})
`,
    testCases: [
      {
        id: 'adapter-import',
        label: 'Imports a Payload email adapter',
        failureHint: "import { nodemailerAdapter } from '@payloadcms/email-nodemailer'",
      },
      {
        id: 'email-config',
        label: 'Assigns the adapter to buildConfig.email',
        failureHint: 'Add an email property to buildConfig.',
      },
      {
        id: 'default-from',
        label: 'Sets a defaultFromAddress',
        failureHint: "Set defaultFromAddress: 'no-reply@example.com'.",
      },
    ],
  },

  plugins: {
    starterCode: `import type { Config } from 'payload'

// Write a plugin that injects a computed readingTime field
export const readingTimePlugin = (config: Config) => config
`,
    solutionCode: `import type { Config } from 'payload'

export const readingTimePlugin = (config) => ({
  ...config,
  fields: [...config.fields, { name: 'readingTime', type: 'number' }],
})
`,
    testCases: [
      {
        id: 'plugin-fn',
        label: 'Defines a plugin function that accepts a config',
        failureHint: 'Export readingTimePlugin as a function taking config.',
      },
      {
        id: 'injects-field',
        label: 'Injects a readingTime field',
        failureHint: 'Append a readingTime field to config.fields.',
      },
      {
        id: 'spreads-config',
        label: 'Spreads ...config to preserve existing options',
        failureHint: 'Return { ...config, fields: [...] }.',
      },
    ],
  },

  tenants: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  fields: [
    { name: 'name', type: 'text', required: true },
  ],
}

// Scope queries to the active tenant
export const tenantScoped = () => true
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'domain', type: 'text', required: true },
  ],
}

export const tenantScoped = ({ req: { user } }) => {
  if (!user) return false
  return { tenant: { equals: user.tenant } }
}
`,
    testCases: [
      {
        id: 'collection',
        label: "Declares a 'tenants' collection",
        failureHint: "Add a collection with slug: 'tenants'.",
      },
      {
        id: 'scoped-access',
        label: 'Scopes access by the current user tenant',
        failureHint: 'Return a tenant constraint based on user.tenant.',
      },
    ],
  },

  ai: {
    starterCode: `export async function embedOnPublish({ doc }) {
  // Generate an embedding and attach it to the document
  return doc
}
`,
    solutionCode: `export async function embedOnPublish({ doc }) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\` },
    body: JSON.stringify({ input: doc.title }),
  })
  const { data } = await res.json()
  doc.embedding = data[0].embedding
  return doc
}
`,
    testCases: [
      {
        id: 'embeddings-fetch',
        label: 'Requests an embedding from the provider',
        failureHint: 'fetch(...) the embeddings endpoint inside embedOnPublish.',
      },
      {
        id: 'openai-key',
        label: 'Reads the API key from the environment',
        failureHint: 'Reference process.env.OPENAI_API_KEY.',
      },
      {
        id: 'returns-doc',
        label: 'Attaches the embedding and returns the doc',
        failureHint: 'Set doc.embedding and return doc.',
      },
    ],
  },

  testing: {
    starterCode: `// Write an integration test for the posts collection
`,
    solutionCode: `import { describe, it, expect, beforeEach } from 'vitest'
import { getPayload } from 'payload'
import config from '@payload-config'

let payload

beforeEach(async () => {
  payload = await getPayload({ config })
})

describe('posts', () => {
  it('creates a post', async () => {
    const post = await payload.create({ collection: 'posts', data: { title: 'Hi' } })
    expect(post.title).toBe('Hi')
  })
})
`,
    testCases: [
      {
        id: 'vitest-import',
        label: 'Imports the test runner from vitest',
        failureHint: "import { describe, it, expect } from 'vitest'",
      },
      {
        id: 'uses-expect',
        label: 'Asserts behaviour with expect(...)',
        failureHint: 'Add an expect(...) assertion.',
      },
      {
        id: 'boots-payload',
        label: 'Boots Payload via getPayload() in setup',
        failureHint: 'Call getPayload({ config }) in beforeEach.',
      },
    ],
  },

  database: {
    starterCode: `import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Create the products table
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop the products table
}
`,
    solutionCode: `import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql\`CREATE TABLE products (id serial primary key, title varchar)\`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql\`DROP TABLE products\`)
}
`,
    testCases: [
      {
        id: 'migration-import',
        label: 'Imports migration types from the postgres adapter',
        failureHint: "import ... from '@payloadcms/db-postgres'",
      },
      {
        id: 'up-down',
        label: 'Exports both up() and down() migration functions',
        failureHint: 'export async function up(...) and export async function down(...).',
      },
      {
        id: 'create-table',
        label: 'Executes a CREATE TABLE statement',
        failureHint: 'Call db.execute(...) with a CREATE TABLE statement.',
      },
    ],
  },

  esm: {
    starterCode: `const nextConfig = {
  // Add Turbopack config and wrap with withPayload
}

export default nextConfig
`,
    solutionCode: `import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  turbopack: {
    root: __dirname,
  },
}

export default withPayload(nextConfig)
`,
    testCases: [
      {
        id: 'with-payload',
        label: 'Wraps the config with withPayload()',
        failureHint: 'export default withPayload(nextConfig).',
      },
      {
        id: 'turbopack-config',
        label: 'Declares a turbopack config object',
        failureHint: 'Add a turbopack: { ... } block to nextConfig.',
      },
    ],
  },

  caching: {
    starterCode: `import type { CollectionAfterChangeHook } from 'payload'

// Revalidate cached content when a post changes
export const revalidatePost: CollectionAfterChangeHook = async ({ doc }) => {
  return doc
}
`,
    solutionCode: `import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook } from 'payload'

export const revalidatePost: CollectionAfterChangeHook = async ({ doc }) => {
  revalidateTag('posts')
  revalidateTag(\`post-\${doc.slug}\`)
  return doc
}
`,
    testCases: [
      {
        id: 'revalidate-import',
        label: 'Imports revalidateTag from next/cache',
        failureHint: "import { revalidateTag } from 'next/cache'",
      },
      {
        id: 'revalidate-call',
        label: 'Invalidates a cache tag on change',
        failureHint: "Call revalidateTag('posts').",
      },
      {
        id: 'returns-doc',
        label: 'Returns the doc so the hook chain continues',
        failureHint: 'Return doc at the end of the hook.',
      },
    ],
  },

  deploy: {
    starterCode: `// Describe the production build for Vercel
export const vercelBuild = {
  buildCommand: 'next build',
  framework: 'nextjs',
}
`,
    solutionCode: `export const vercelBuild = {
  buildCommand: 'payload migrate && next build',
  framework: 'nextjs',
  regions: ['iad1'],
}
`,
    testCases: [
      {
        id: 'migrate-build',
        label: 'Runs payload migrate as part of the build command',
        failureHint: "Set buildCommand to include 'payload migrate'.",
      },
      {
        id: 'framework-next',
        label: "Declares the nextjs framework",
        failureHint: "Set framework: 'nextjs'.",
      },
    ],
  },

  next: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'slug', type: 'text' },
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', index: true },
    { name: 'slug', type: 'text', unique: true },
  ],
}
`,
    testCases: [
      {
        id: 'access-controls',
        label: 'Defines an access control block on the collection',
        failureHint: 'Add access: { read: ... } to the posts collection.',
      },
      {
        id: 'unique-slug',
        label: 'Marks the slug field as unique',
        failureHint: "Set unique: true on the slug field.",
      },
      {
        id: 'indexed-title',
        label: 'Indexes the title field for query speed',
        failureHint: "Set index: true on the title field.",
      },
    ],
  },

  proj1: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    { name: 'title', type: 'text' },
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'author', type: 'relationship', relationTo: 'users' },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
  ],
}
`,
    testCases: [
      {
        id: 'posts-slug',
        label: "Defines the 'posts' collection",
        failureHint: "Add slug: 'posts'.",
      },
      {
        id: 'drafts',
        label: 'Enables drafts for the posts collection',
        failureHint: 'Add versions: { drafts: true }.',
      },
      {
        id: 'relation-and-upload',
        label: 'Adds both a relationship and an upload field',
        failureHint: "Include a type: 'relationship' and a type: 'upload' field.",
      },
    ],
  },

  proj2: {
    starterCode: `import { getPayload } from 'payload'
import config from '@payload-config'

export default async function PostPage({ params }) {
  const payload = await getPayload({ config })
  // Fetch the post by slug and render metadata
  return null
}
`,
    solutionCode: `import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
  })
  if (!docs.length) {
    notFound()
  }
  return { title: docs[0].title }
}
`,
    testCases: [
      {
        id: 'metadata',
        label: 'Exports generateMetadata for the post route',
        failureHint: 'export async function generateMetadata(...).',
      },
      {
        id: 'fetch-by-slug',
        label: 'Fetches the post where slug equals the route param',
        failureHint: 'payload.find({ collection: "posts", where: { slug: { equals: params.slug } } }).',
      },
      {
        id: 'not-found',
        label: 'Calls notFound() when the post is missing',
        failureHint: 'Import and call notFound() from next/navigation.',
      },
    ],
  },

  capstone: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Capstone: CollectionConfig = {
  slug: 'capstone',
  fields: [
    { name: 'title', type: 'text' },
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Capstone: CollectionConfig = {
  slug: 'capstone',
  versions: { drafts: true },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text' },
  ],
}
`,
    testCases: [
      {
        id: 'slug',
        label: "Defines the 'capstone' collection",
        failureHint: "Add slug: 'capstone'.",
      },
      {
        id: 'drafts',
        label: 'Enables versioned drafts',
        failureHint: 'Add versions: { drafts: true }.',
      },
      {
        id: 'access',
        label: 'Defines an access control block',
        failureHint: 'Add an access object to the collection.',
      },
    ],
  },

  ecomm1: {
    starterCode: `import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    { name: 'title', type: 'text' },
  ],
}
`,
    solutionCode: `import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  fields: [
    { name: 'title', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'stock', type: 'number', defaultValue: 0 },
  ],
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  fields: [
    { name: 'customerEmail', type: 'email' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products' },
        { name: 'quantity', type: 'number' },
      ],
    },
  ],
}
`,
    testCases: [
      {
        id: 'products-stock',
        label: 'Adds a stock field to products',
        failureHint: "Add { name: 'stock', type: 'number' }.",
      },
      {
        id: 'orders-collection',
        label: "Defines an 'orders' collection",
        failureHint: "Add a collection with slug: 'orders'.",
      },
      {
        id: 'orders-items-array',
        label: "Models order line items as an 'items' array",
        failureHint: "Add { name: 'items', type: 'array', fields: [...] }.",
      },
    ],
  },

  ecomm2: {
    starterCode: `import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function handleWebhook(req, payload) {
  // Verify the Stripe signature and fulfil the order
  return null
}
`,
    solutionCode: `import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function handleWebhook(req, payload) {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    process.env.STRIPE_WEBHOOK_SECRET || '',
  )

  if (event.type === 'checkout.session.completed') {
    await payload.update({
      collection: 'orders',
      id: event.data.object.id,
      data: { status: 'paid' },
    })
  }

  return event
}
`,
    testCases: [
      {
        id: 'stripe-import',
        label: 'Imports the Stripe SDK',
        failureHint: "import Stripe from 'stripe'",
      },
      {
        id: 'construct-event',
        label: 'Verifies the webhook signature with constructEvent',
        failureHint: 'Call stripe.webhooks.constructEvent(body, sig, secret).',
      },
      {
        id: 'fulfills-order',
        label: "Marks the matching 'orders' document as paid",
        failureHint: "payload.update({ collection: 'orders', id, data: { status: 'paid' } }).",
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
        failureHint: `Set slug: '${lessonId}' in your config.`,
      },
      {
        id: 'fields-array',
        label: 'Defines valid fields array with required name and type',
        failureHint: "Ensure you have a fields array containing { name: '...', type: '...' }",
      },
      {
        id: 'use-as-title',
        label: 'Configures admin.useAsTitle property',
        failureHint: "Configure admin: { useAsTitle: 'title' }",
      },
    ],
  };
}
