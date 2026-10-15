// scratch/builder_advanced_arch.js
module.exports = [
  {
    id: "webhooks",
    m: "Advanced Architecture",
    t: "Outgoing webhooks & integrations",
    r: ["all", "devops", "backend"],
    difficulty: "intermediate",
    tags: ["webhooks", "integrations", "discord", "slack", "zapier"],
    c: `
<p class="lead">Outgoing webhooks allow your Payload CMS instance to notify external services (Slack, Discord, Zapier, search indexing pipelines, build triggers) in real-time whenever content changes occur.</p>

<h2>Building a Generic Webhook Dispatcher Hook</h2>
<div class="cb"><div class="fn">src/hooks/dispatchWebhook.ts</div><pre><code>import type { CollectionAfterChangeHook } from 'payload'

export const dispatchWebhook: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  collection,
}) => {
  const webhookUrl = process.env.EXTERNAL_WEBHOOK_URL
  if (!webhookUrl) return doc

  const payloadBody = {
    event: \`\${collection.slug}.\${operation}\`,
    timestamp: new Date().toISOString(),
    id: doc.id,
    data: doc,
    changes: operation === 'update' ? { previous: previousDoc } : undefined,
  }

  // Fire and forget (or pass through background job queue for guaranteed delivery)
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': process.env.WEBHOOK_SIGNING_SECRET || '',
    },
    body: JSON.stringify(payloadBody),
  }).catch((err) => console.error('Webhook dispatch failed:', err))

  return doc
}</code></pre></div>
`
  },
  {
    id: "transactions",
    m: "Advanced Architecture",
    t: "Database transactions & concurrency",
    r: ["all", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["transactions", "acid", "postgres", "concurrency", "rollback"],
    c: `
<p class="lead">Payload natively supports ACID database transactions across PostgreSQL, SQLite, and MongoDB. Transactions guarantee that complex, multi-step operations either succeed completely or roll back entirely with zero data corruption.</p>

<h2>Executing an Atomic Multi-Collection Transaction</h2>
<div class="cb"><div class="fn">src/actions/transferCredits.ts</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'

export async function transferCredits(senderId: string, recipientId: string, amount: number) {
  const payload = await getPayload({ config })
  
  // 1. Begin database transaction
  const req = await payload.db.beginTransaction()

  try {
    // 2. Deduct from sender
    const sender = await payload.findByID({ collection: 'users', id: senderId, req })
    if ((sender.credits || 0) < amount) {
      throw new Error('Insufficient balance.')
    }

    await payload.update({
      collection: 'users',
      id: senderId,
      data: { credits: (sender.credits || 0) - amount },
      req, // Must pass req to bind to the active transaction!
    })

    // 3. Credit recipient
    const recipient = await payload.findByID({ collection: 'users', id: recipientId, req })
    await payload.update({
      collection: 'users',
      id: recipientId,
      data: { credits: (recipient.credits || 0) + amount },
      req,
    })

    // 4. Log audit ledger
    await payload.create({
      collection: 'ledger',
      data: { from: senderId, to: recipientId, amount, timestamp: new Date().toISOString() },
      req,
    })

    // 5. Commit all changes
    await payload.db.commitTransaction(req.transactionID)
    return { success: true }
  } catch (error) {
    // 6. Roll back everything on any error
    await payload.db.rollbackTransaction(req.transactionID)
    throw error
  }
}</code></pre></div>
`
  },
  {
    id: "jobs",
    m: "Advanced Architecture",
    t: "Background jobs & queues",
    r: ["all", "devops", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["jobs", "queues", "cron", "background-tasks", "workers"],
    c: `
<p class="lead">Payload features a built-in, database-backed background Jobs Queue designed for executing heavy async tasks (transcoding videos, generating AI vector embeddings, syncing CRM contacts, sending batch newsletters) without blocking user requests.</p>

<h2>Configuring Jobs in Payload</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>export default buildConfig({
  jobs: {
    tasks: [
      {
        slug: 'generateAiSummary',
        inputSchema: [
          { name: 'postId', type: 'text', required: true },
        ],
        handler: async ({ input, req }) => {
          const post = await req.payload.findByID({
            collection: 'posts',
            id: input.postId,
          })
          // Run long AI generation task...
          return { output: { status: 'completed' } }
        },
      },
    ],
    autoRun: [
      {
        cron: '* * * * *', // Run queue runner every minute
        limit: 10,
      },
    ],
  },
})</code></pre></div>
`
  },
  {
    id: "storage",
    m: "Advanced Architecture",
    t: "Cloud storage adapters: S3, R2, Vercel Blob",
    r: ["all", "devops", "backend"],
    difficulty: "intermediate",
    tags: ["s3", "r2", "storage", "cloudflare", "aws", "vercel-blob"],
    c: `
<p class="lead">In serverless and containerized production environments, local file storage is ephemeral. Payload provides official storage adapters for Amazon S3, Cloudflare R2, Google Cloud Storage, Azure Blob, and Vercel Blob.</p>

<h2>Configuring Cloudflare R2 / AWS S3 Storage</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>import { s3Storage } from '@payloadcms/storage-s3'

export default buildConfig({
  plugins: [
    s3Storage({
      collections: {
        media: true, // Attach S3 adapter to 'media' collection
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'auto',
        endpoint: process.env.S3_ENDPOINT, // Cloudflare R2 endpoint URL
        forcePathStyle: true,
      },
    }),
  ],
})</code></pre></div>
`
  },
  {
    id: "email",
    m: "Advanced Architecture",
    t: "Email adapters: Resend, Nodemailer, SendGrid",
    r: ["all", "backend"],
    difficulty: "intermediate",
    tags: ["email", "resend", "nodemailer", "transactional-emails"],
    c: `
<p class="lead">Payload uses transactional email for user invitation links, password reset tokens, and email verification. You can configure modern email adapters like Resend or standard Nodemailer SMTP.</p>

<h2>Configuring the Resend Email Adapter</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'noreply@mycompany.com',
    defaultFromName: 'Acme Security Portal',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
})</code></pre></div>

<h2>Sending Custom Emails via Local API</h2>
<div class="cb"><div class="fn">Send Transactional Email</div><pre><code>await payload.sendEmail({
  to: 'customer@domain.com',
  subject: 'Your order #ORD-998 has shipped!',
  html: '&lt;h1&gt;Great news!&lt;/h1&gt;&lt;p&gt;Your package is on the way.&lt;/p&gt;',
})</code></pre></div>
`
  },
  {
    id: "plugins",
    m: "Advanced Architecture",
    t: "Building custom plugins",
    r: ["all", "backend"],
    difficulty: "advanced",
    tags: ["plugins", "extensibility", "architecture", "npm"],
    c: `
<p class="lead">Plugins are composable functions that accept a <code>Config</code> object and return an enriched <code>Config</code>. Plugins can inject new collections, register hooks, mount custom admin views, and add database adapters.</p>

<h2>Authoring a Reusable Payload Plugin</h2>
<div class="cb"><div class="fn">src/plugins/auditLogPlugin.ts</div><pre><code>import type { Config, Plugin } from 'payload'

export const auditLogPlugin = (options?: { logDeletionsOnly?: boolean }): Plugin => {
  return (incomingConfig: Config): Config => {
    // 1. Inject an AuditLogs collection
    const auditLogsCollection = {
      slug: 'audit-logs',
      admin: { group: 'System' },
      fields: [
        { name: 'action', type: 'text', required: true },
        { name: 'collectionSlug', type: 'text', required: true },
        { name: 'user', type: 'relationship', relationTo: 'users' },
        { name: 'timestamp', type: 'date', defaultValue: () => new Date().toISOString() },
      ],
    }

    // 2. Return enriched configuration
    return {
      ...incomingConfig,
      collections: [
        ...(incomingConfig.collections || []),
        auditLogsCollection,
      ],
    }
  }
}</code></pre></div>
`
  },
  {
    id: "i18n",
    m: "Advanced Architecture",
    t: "Localization & multi-language",
    r: ["all", "frontend", "backend"],
    difficulty: "advanced",
    tags: ["i18n", "localization", "languages", "locales"],
    c: `
<p class="lead">Payload provides first-class field-level localization. You can translate specific fields into multiple languages without duplicating entire document rows in your database.</p>

<h2>Enabling Localization in Payload Config</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>export default buildConfig({
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'French (Français)', code: 'fr' },
      { label: 'Spanish (Español)', code: 'es' },
      { label: 'German (Deutsch)', code: 'de' },
    ],
    defaultLocale: 'en',
    fallback: true, // Fall back to defaultLocale if localized field is empty
  },
})</code></pre></div>

<h2>Marking Fields as Localized</h2>
<div class="cb"><div class="fn">src/collections/Posts.ts</div><pre><code>{
  name: 'title',
  type: 'text',
  localized: true, // Automatically provides language switch tabs in Admin UI
  required: true,
}</code></pre></div>
`
  },
  {
    id: "tenants",
    m: "Advanced Architecture",
    t: "Multi-tenancy architectures",
    r: ["all", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["multi-tenancy", "saas", "tenants", "isolation"],
    c: `
<p class="lead">Multi-tenancy enables a single Payload deployment to power multiple independent organizations, brands, or clients with total data isolation.</p>

<h2>Using the Multi-Tenant Plugin</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'

export default buildConfig({
  plugins: [
    multiTenantPlugin({
      collections: {
        posts: {},
        media: {},
        categories: {},
      },
      tenantCollectionSlug: 'tenants',
    }),
  ],
})</code></pre></div>
`
  },
  {
    id: "ai",
    m: "Advanced Architecture",
    t: "AI, vector embeddings & RAG",
    r: ["all", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["ai", "vector", "rag", "embeddings", "openai", "pgvector"],
    c: `
<p class="lead">Payload's code-first architecture and PostgreSQL / Drizzle backend make it the ideal content engine for AI workflows, vector search pipelines, and Retrieval-Augmented Generation (RAG).</p>

<h2>Automating Vector Embeddings on Document Changes</h2>
<div class="cb"><div class="fn">src/hooks/generateEmbedding.ts</div><pre><code>import type { CollectionAfterChangeHook } from 'payload'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const generateEmbeddingHook: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  if (doc._status !== 'published') return doc

  // 1. Generate 1536-dimension embedding vector
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: \`\${doc.title}\\n\\n\${doc.excerpt || ''}\`,
  })

  const vector = response.data[0].embedding

  // 2. Save vector to PostgreSQL pgvector column via Local API
  await req.payload.update({
    collection: 'posts',
    id: doc.id,
    data: {
      embedding: vector,
    },
    context: { skipEmbedding: true }, // Prevent recursive hook loops
  })

  return doc
}</code></pre></div>
`
  },
  {
    id: "testing",
    m: "Advanced Architecture",
    t: "End-to-end & integration testing",
    r: ["all", "devops", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["testing", "vitest", "playwright", "ci-cd"],
    c: `
<p class="lead">Because Payload runs entirely in Node.js, you can write super-fast integration tests using Vitest without spinning up external mock servers.</p>

<h2>Integration Testing with Vitest</h2>
<div class="cb"><div class="fn">tests/posts.test.ts</div><pre><code>import { describe, it, expect, beforeAll } from 'vitest'
import { getPayload } from 'payload'
import config from '@payload-config'

let payload: any

beforeAll(async () => {
  payload = await getPayload({ config })
})

describe('Posts Collection Integration', () => {
  it('automatically creates a URL slug from the title', async () => {
    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'Mastering Automated Integration Testing',
      },
    })

    expect(post.slug).toBe('mastering-automated-integration-testing')
  })
})</code></pre></div>
`
  },
  {
    id: "database",
    m: "Advanced Architecture",
    t: "Postgres, Drizzle ORM, SQLite & Mongo",
    r: ["all", "devops", "backend"],
    difficulty: "advanced",
    tags: ["postgres", "sqlite", "drizzle", "mongo", "database"],
    c: `
<p class="lead">Payload 3.x uses Drizzle ORM to power native SQL adapters (PostgreSQL and SQLite) alongside MongoDB Mongoose support.</p>

<h2>Adapter Comparison Matrix</h2>
<div class="tbl"><table>
  <thead><tr><th>Feature</th><th>PostgreSQL (Drizzle)</th><th>SQLite (LibSQL / Turso)</th><th>MongoDB (Mongoose)</th></tr></thead>
  <tbody>
    <tr><td><b>Ideal Environment</b></td><td>Production Enterprise, Neon, Supabase</td><td>Local Dev, Edge, Serverless, Turso</td><td>Legacy document DB migration</td></tr>
    <tr><td><b>ACID Transactions</b></td><td>Full Support</td><td>Full Support</td><td>Replica Sets required</td></tr>
    <tr><td><b>Schema Migrations</b></td><td>Declarative SQL DDL files</td><td>Declarative SQL DDL files</td><td>Code-based migrations</td></tr>
    <tr><td><b>Vector Extensions</b></td><td>pgvector native</td><td>sqlite-vss</td><td>Atlas Vector Search</td></tr>
  </tbody>
</table></div>
`
  },
  {
    id: "esm",
    m: "Advanced Architecture",
    t: "ESM & Next.js 15 compilation",
    r: ["all", "devops"],
    difficulty: "advanced",
    tags: ["esm", "bundling", "turbopack", "webpack", "modules"],
    c: `
<p class="lead">Payload 3.x is authored in 100% pure ECMAScript Modules (ESM), fully compliant with Next.js 15, Turbopack, and Node.js standard module resolution.</p>

<h2>Configuring tsconfig.json for Pure ESM</h2>
<div class="cb"><div class="fn">tsconfig.json</div><pre><code>{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "jsx": "preserve",
    "strict": true,
    "paths": {
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}</code></pre></div>
`
  },
  {
    id: "caching",
    m: "Advanced Architecture",
    t: "Next.js Cache, ISR & Tags",
    r: ["all", "frontend", "devops"],
    difficulty: "advanced",
    tags: ["caching", "isr", "revalidation", "unstable-cache", "tags"],
    c: `
<p class="lead">Combine Next.js 15's Data Cache and Tag-Based On-Demand Revalidation with Payload lifecycle hooks for instantaneous sub-millisecond static page deliveries.</p>

<h2>Using <code>unstable_cache</code> with Cache Tags</h2>
<div class="cb"><div class="fn">src/data/getFeaturedPosts.ts</div><pre><code>import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getFeaturedPosts = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    return payload.find({
      collection: 'posts',
      where: { isFeatured: { equals: true } },
      limit: 6,
    })
  },
  ['featured-posts-key'],
  { tags: ['posts', 'featured-posts'], revalidate: 3600 }
)</code></pre></div>
`
  },
  {
    id: "deploy",
    m: "Advanced Architecture",
    t: "Deploying to Vercel, Railway, Docker",
    r: ["all", "devops"],
    difficulty: "intermediate",
    tags: ["deployment", "vercel", "railway", "docker", "production"],
    c: `
<p class="lead">Deploy your unified Next.js + Payload application seamlessly to serverless platforms like Vercel or containerized PaaS platforms like Railway and AWS ECS.</p>

<h2>Production Dockerfile Example</h2>
<div class="cb"><div class="fn">Dockerfile</div><pre><code>FROM node:20-alpine AS base
RUN corepack enable &amp;&amp; corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]</code></pre></div>
`
  },
  {
    id: "next",
    m: "Advanced Architecture",
    t: "Next.js 15 App Router deep dive",
    r: ["all", "frontend", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["nextjs15", "app-router", "react19", "async-params"],
    c: `
<p class="lead">Payload 3.x is engineered natively around Next.js 15 and React 19, taking full advantage of async page parameters, server actions, and streaming metadata.</p>

<h2>Async Params in Next.js 15 App Router</h2>
<div class="cb"><div class="fn">src/app/(frontend)/blog/[slug]/page.tsx</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // In Next.js 15, params must be awaited!
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: [post] } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
  })

  if (!post) notFound()

  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
    &lt;/article&gt;
  )
}</code></pre></div>
`
  }
];
