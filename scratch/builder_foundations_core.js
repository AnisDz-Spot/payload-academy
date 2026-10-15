// scratch/builder_foundations_core.js
module.exports = [
  {
    id: "intro",
    m: "Foundations",
    t: "What is Payload?",
    r: ["all"],
    difficulty: "beginner",
    tags: ["intro", "architecture", "nextjs"],
    c: `
<p class="lead">Payload is an open-source, code-first headless CMS and fullstack application framework built entirely with TypeScript. Unlike legacy headless CMSs that run as separate black-box microservices with GUI-configured schemas, Payload 3.x lives <strong>directly inside your Next.js application</strong> (or any modern Node/Bun/Deno server) — sharing one codebase, one execution runtime, and one deployment pipeline.</p>

<h2>The Paradigm Shift: Code-First vs GUI-First</h2>
<p>Traditional headless CMS tools force developers into a fragmented workflow: clicking around a hosted web UI to define schemas, managing separate webhook synchronization layers, suffering from network latency on every query, and dealing with out-of-sync TypeScript definitions. Payload flips this model entirely:</p>

<div class="cards">
  <div class="card">
    <div class="card-icon">⚡</div>
    <div class="card-title">In-Process Local API</div>
    <div class="card-sub">Zero network latency. Queries run directly against your database within Server Components and Server Actions.</div>
  </div>
  <div class="card">
    <div class="card-icon">🛡️</div>
    <div class="card-title">Type Safety by Default</div>
    <div class="card-sub">Automatic 100% TypeScript type generation directly from your TypeScript schema configs.</div>
  </div>
  <div class="card">
    <div class="card-icon">📦</div>
    <div class="card-title">Single Next.js Runtime</div>
    <div class="card-sub">Both your front-facing public website and your back-office admin panel live in one unified Next.js App Router project.</div>
  </div>
  <div class="card">
    <div class="card-icon">🔌</div>
    <div class="card-title">Database Agnostic</div>
    <div class="card-sub">Run on PostgreSQL, SQLite, or MongoDB via modern Drizzle ORM and Mongoose adapters.</div>
  </div>
</div>

<h2>Payload 3.x Architecture Deep Dive</h2>
<p>In Payload 3.x, the entire CMS runtime is decoupled into modular layers that execute natively on Next.js 15 App Router and React Server Components (RSC):</p>

<div class="tbl"><table>
  <thead>
    <tr><th>Layer</th><th>Technology</th><th>Role &amp; Responsibility</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><b>Admin UI</b></td>
      <td>React 19 / RSC / Next.js</td>
      <td>Server-rendered admin interface with streaming, live preview, and hot reload. Zero Webpack bundling required.</td>
    </tr>
    <tr>
      <td><b>API Handlers</b></td>
      <td>App Router Catch-All Routes</td>
      <td><code>app/(payload)/api/[...slug]/route.ts</code> generates standard REST and GraphQL endpoints automatically.</td>
    </tr>
    <tr>
      <td><b>Core Engine</b></td>
      <td>Node.js / Edge Compatible</td>
      <td>Executes access control, field validation, life-cycle hooks, draft versioning, and document serialization.</td>
    </tr>
    <tr>
      <td><b>Database Layer</b></td>
      <td>Drizzle ORM &amp; Mongoose</td>
      <td>Translates declarative schemas into optimized SQL tables, indices, relations, or MongoDB collections.</td>
    </tr>
  </tbody>
</table></div>

<h2>The Core Mental Model</h2>
<p>To master Payload, you only need to understand five foundational building blocks:</p>
<ol>
  <li><b>Collections:</b> Schemas for repeatable entities (e.g., <code>Posts</code>, <code>Products</code>, <code>Users</code>, <code>Orders</code>). Each collection generates a dedicated DB table, REST endpoints, GraphQL types, and admin list/edit views.</li>
  <li><b>Globals:</b> Schemas for singleton data (e.g., <code>HeaderNav</code>, <code>SiteSettings</code>, <code>Footer</code>). Ideal for sitewide configuration where only one document ever exists.</li>
  <li><b>Fields:</b> Over 20 strongly-typed field definitions (Text, Rich Text, Relationships, Uploads, Dynamic Blocks, Arrays, Joins) that define the shape of your data.</li>
  <li><b>Access Control:</b> Declarative, function-level security controlling <code>read</code>, <code>create</code>, <code>update</code>, <code>delete</code>, and <code>unlock</code> per collection and per field, returning booleans or database query constraints.</li>
  <li><b>Hooks:</b> Async lifecycle functions (e.g. <code>beforeChange</code>, <code>afterChange</code>, <code>beforeRead</code>, <code>afterDelete</code>) that run business logic, trigger revalidations, or sync external services.</li>
</ol>

<h2>Comparison: Payload vs Strapi vs Sanity vs Contentful</h2>
<div class="tbl"><table>
  <thead>
    <tr><th>Feature</th><th>Payload 3.x</th><th>Strapi</th><th>Sanity</th><th>Contentful</th></tr>
  </thead>
  <tbody>
    <tr><td><b>Hosting</b></td><td>Self-Hosted / Anywhere (Vercel, AWS)</td><td>Self-Hosted / Cloud</td><td>Hosted Proprietary Cloud</td><td>Hosted Proprietary Cloud</td></tr>
    <tr><td><b>Schema Definition</b></td><td>Pure TypeScript Config</td><td>GUI + JSON files</td><td>JS/TS Schemas</td><td>GUI / Web App</td></tr>
    <tr><td><b>Database Ownership</b></td><td>100% Yours (Postgres, SQLite, Mongo)</td><td>Yours (Postgres, MySQL)</td><td>Vendor Owned Proprietary</td><td>Vendor Owned Proprietary</td></tr>
    <tr><td><b>Local In-Process API</b></td><td>✅ Yes (Zero HTTP overhead)</td><td>❌ No (Local HTTP calls)</td><td>❌ No (Network HTTP query)</td><td>❌ No (Network HTTP query)</td></tr>
    <tr><td><b>Next.js App Router Co-location</b></td><td>✅ Native in same repo</td><td>❌ Separate server</td><td>❌ Separate dashboard</td><td>❌ Separate dashboard</td></tr>
    <tr><td><b>Licensing</b></td><td>MIT Open Source</td><td>Community / Enterprise</td><td>Proprietary Tiered</td><td>Proprietary Tiered</td></tr>
  </tbody>
</table></div>

<div class="tip">
  <b>Architectural Rule of Thumb:</b> If your frontend is Next.js, Payload 3.x eliminates the need for any separate backend repository, microservice container, or third-party SaaS CMS subscription. You build your database schema, admin panel, and client frontend within the same repository.
</div>
`
  },
  {
    id: "install",
    m: "Foundations",
    t: "Installation & first run",
    r: ["all", "devops"],
    difficulty: "beginner",
    tags: ["setup", "cli", "database", "env"],
    c: `
<p class="lead">Getting started with Payload 3.x takes under two minutes. In this lesson, we will cover scaffolding a brand new project using the official CLI, configuring database adapters, setting up environment variables, and embedding Payload into an existing Next.js 15 project.</p>

<h2>Method 1: Fast Scaffolding with create-payload-app</h2>
<p>The fastest way to launch a full-stack project is using the official interactive scaffolding tool:</p>

<div class="cb"><div class="fn">terminal</div><pre><code>npx create-payload-app@latest my-payload-project</code></pre></div>

<p>The CLI will guide you through interactive prompts:</p>
<ul>
  <li><b>Choose a Template:</b> <code>blank</code> (minimal config), <code>website</code> (complete marketing site with blocks &amp; SEO), or <code>ecommerce</code> (Stripe + cart + checkout).</li>
  <li><b>Choose Database:</b> <code>PostgreSQL</code> (recommended for production with Neon/Supabase), <code>SQLite</code> (lightweight, incredible for local dev and edge/LibSQL), or <code>MongoDB</code>.</li>
  <li><b>Package Manager:</b> <code>pnpm</code>, <code>npm</code>, or <code>yarn</code>.</li>
</ul>

<h2>Method 2: Adding Payload to an Existing Next.js 15 App</h2>
<p>If you already have an existing Next.js 15 App Router codebase, you can install Payload directly as a dependency:</p>

<div class="cb"><div class="fn">terminal</div><pre><code># 1. Install core dependencies
pnpm add payload @payloadcms/next @payloadcms/richtext-lexical sharp graphql

# 2. Install your chosen database adapter
pnpm add @payloadcms/db-postgres   # For PostgreSQL
# OR: pnpm add @payloadcms/db-sqlite     # For SQLite / LibSQL / Turso
# OR: pnpm add @payloadcms/db-mongodb    # For MongoDB</code></pre></div>

<h3>Step 2.1: Wrap Next.js Configuration</h3>
<p>Payload needs to configure Webpack/Turbopack aliases and GraphQL loaders. Wrap your <code>next.config.mjs</code>:</p>

<div class="cb"><div class="fn">next.config.mjs</div><pre><code>import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // your custom Next.js configuration options here
  experimental: {
    // optional experimental features
  },
}

export default withPayload(nextConfig)</code></pre></div>

<h3>Step 2.2: Mount Route Handlers &amp; Admin Page</h3>
<p>Create the App Router entry points in <code>src/app/(payload)/</code>:</p>

<div class="cb"><div class="fn">src/app/(payload)/admin/[[...segments]]/page.tsx</div><pre><code>import type { Metadata } from 'next'
import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments?: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export default async function Page({ params, searchParams }: Args) {
  return RootPage({ config, params, searchParams, importMap })
}</code></pre></div>

<div class="cb"><div class="fn">src/app/(payload)/api/[...slug]/route.ts</div><pre><code>import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'
import config from '@payload-config'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const OPTIONS = REST_OPTIONS(config)</code></pre></div>

<h2>Environment Variables &amp; Database Connections</h2>
<p>Payload requires two critical environment variables to function securely:</p>

<div class="cb"><div class="fn">.env</div><pre><code># 1. Secret used to sign JWTs, hashes, and encryption tokens (min 32 chars)
PAYLOAD_SECRET=f9a84b07c2d158e390cfa117e94db6e51c8a7741d7e2e30f1d53086b9a4c8e12

# 2. Database Connection Strings:
# PostgreSQL (Supabase, Neon, Railway, Docker, Local):
DATABASE_URI=postgres://postgres:password@localhost:5432/my_payload_db

# Or for SQLite (Local file):
# DATABASE_URI=file:./payload.db

# 3. Public URL of your application (used for CORS, emails, and live preview)
NEXT_PUBLIC_SERVER_URL=http://localhost:3000</code></pre></div>

<div class="warn">
  <b>Critical Security Warning:</b> Never use an insecure or predictable <code>PAYLOAD_SECRET</code> in staging or production. Generate a high-entropy string using <code>openssl rand -hex 32</code>. If this secret is leaked, attackers can forge valid authentication tokens!
</div>
`
  },
  {
    id: "structure",
    m: "Foundations",
    t: "Project structure & folder conventions",
    r: ["all"],
    difficulty: "beginner",
    tags: ["architecture", "nextjs", "conventions"],
    c: `
<p class="lead">Understanding the folder structure of a Payload 3.x project is essential for clean architecture, team collaboration, and leveraging Next.js Route Groups for total isolation between public pages and admin dashboard logic.</p>

<h2>Standard Enterprise Project Hierarchy</h2>
<div class="cb"><div class="fn">project-structure</div><pre><code>my-payload-app/
├── src/
│   ├── app/
│   │   ├── (frontend)/            # Route Group: Public Marketing / App Pages
│   │   │   ├── layout.tsx         # Public website layout (Header, Footer, CSS)
│   │   │   ├── page.tsx           # Homepage Server Component
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx       # Blog Listing Page
│   │   │   │   └── [slug]/page.tsx# Single Post Dynamic Page
│   │   │   └── globals.css        # Frontend styling
│   │   │
│   │   └── (payload)/             # Route Group: Payload CMS Engine & Admin
│   │       ├── admin/
│   │       │   ├── [[...segments]]/page.tsx # Admin UI catch-all router
│   │       │   └── importMap.js   # Generated component map for Admin UI
│   │       ├── api/
│   │       │   ├── [...slug]/route.ts       # REST endpoints (/api/posts, etc)
│   │       │   └── graphql/route.ts        # GraphQL endpoint (/api/graphql)
│   │       └── layout.tsx         # Dedicated HTML root layout for Admin
│   │
│   ├── collections/               # Payload Collection Configs
│   │   ├── Users.ts               # Authentication collection
│   │   ├── Posts.ts               # Blog posts schema & hooks
│   │   ├── Media.ts               # File upload collection
│   │   └── Categories.ts          # Taxonomy collection
│   │
│   ├── globals/                   # Payload Global Singletons
│   │   ├── Header.ts              # Navigation menu configuration
│   │   └── SiteSettings.ts        # SEO metadata, footer, socials
│   │
│   ├── blocks/                    # Reusable Block definitions for Page Builder
│   │   ├── Hero/config.ts         # Block schema
│   │   ├── Hero/Component.tsx     # React Server Component for rendering
│   │   ├── CallToAction/
│   │   └── ImageGallery/
│   │
│   ├── hooks/                     # Reusable business logic lifecycle hooks
│   │   ├── revalidatePage.ts
│   │   └── populateUser.ts
│   │
│   ├── access/                    # Centralized access control predicates
│   │   ├── isAdmin.ts
│   │   └── publishedOrAuthor.ts
│   │
│   ├── payload.config.ts          # Master Payload Config
│   └── payload-types.ts           # Generated TypeScript Interfaces (Auto-generated)
│
├── next.config.mjs                # Next.js configuration with withPayload()
├── tsconfig.json
└── package.json</code></pre></div>

<h2>Why Route Groups <code>(frontend)</code> and <code>(payload)</code> Matter</h2>
<p>Next.js Route Groups (directories enclosed in parentheses like <code>(frontend)</code>) allow you to have <strong>separate root layouts</strong> without affecting URL routing:</p>
<ul>
  <li><code>(frontend)/layout.tsx</code> has its own <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> with your custom website CSS, branding fonts, analytics scripts, and client context providers.</li>
  <li><code>(payload)/layout.tsx</code> provides a dedicated, lightweight root layout required by the Payload admin dashboard, preventing CSS conflicts between Tailwind/global styles and the Payload Admin UI styles.</li>
</ul>

<h2>Critical Generated Files</h2>
<div class="tbl"><table>
  <thead><tr><th>File Path</th><th>Generation Trigger</th><th>Purpose &amp; Git Best Practice</th></tr></thead>
  <tbody>
    <tr>
      <td><code>src/payload-types.ts</code></td>
      <td><code>pnpm payload generate:types</code></td>
      <td>Pure TypeScript types for all Collections and Globals. <b>Commit to Git!</b> Required for CI/CD builds.</td>
    </tr>
    <tr>
      <td><code>src/app/(payload)/admin/importMap.js</code></td>
      <td><code>pnpm payload generate:importmap</code></td>
      <td>Maps custom React UI components to Payload Admin bundle. <b>Commit to Git!</b></td>
    </tr>
    <tr>
      <td><code>src/migrations/*.ts</code></td>
      <td><code>pnpm payload migrate:create</code></td>
      <td>Declarative SQL schema migrations for Drizzle/PostgreSQL. <b>Commit to Git!</b></td>
    </tr>
  </tbody>
</table></div>

<div class="note">
  <b>TypeScript Path Alias:</b> In <code>tsconfig.json</code>, configure <code>"@payload-config": ["./src/payload.config.ts"]</code>. This standard alias allows Payload internals and Server Components to import your configuration anywhere with zero relative path calculation.
</div>
`
  },
  {
    id: "cli",
    m: "Foundations",
    t: "Payload CLI & developer tools",
    r: ["all", "devops", "backend"],
    difficulty: "intermediate",
    tags: ["cli", "migrations", "types", "scripts"],
    c: `
<p class="lead">The Payload CLI is your powerhouse developer tool for compiling TypeScript interfaces, running database migrations, executing ad-hoc server scripts with the Local API, and managing background jobs.</p>

<h2>Complete Command Reference</h2>
<div class="tbl"><table>
  <thead><tr><th>Command</th><th>Flags / Arguments</th><th>Description</th></tr></thead>
  <tbody>
    <tr>
      <td><code>payload generate:types</code></td>
      <td><code>--config &lt;path&gt;</code></td>
      <td>Analyzes your schema configs and writes a strict <code>payload-types.ts</code> file.</td>
    </tr>
    <tr>
      <td><code>payload generate:importmap</code></td>
      <td><code>--config &lt;path&gt;</code></td>
      <td>Scans custom admin components and generates the browser/server component import registry.</td>
    </tr>
    <tr>
      <td><code>payload migrate:create &lt;name&gt;</code></td>
      <td><code>--file &lt;filename&gt;</code></td>
      <td>Generates a timestamped SQL migration file by diffing your config against your database.</td>
    </tr>
    <tr>
      <td><code>payload migrate</code></td>
      <td><code>--force</code></td>
      <td>Executes all unapplied database migrations in an ACID transaction.</td>
    </tr>
    <tr>
      <td><code>payload migrate:down</code></td>
      <td>None</td>
      <td>Rolls back the most recently executed migration batch.</td>
    </tr>
    <tr>
      <td><code>payload migrate:status</code></td>
      <td>None</td>
      <td>Displays status of all applied vs pending database migrations.</td>
    </tr>
    <tr>
      <td><code>payload graphql:generate-schema</code></td>
      <td><code>--output &lt;path&gt;</code></td>
      <td>Exports your entire GraphQL schema to a <code>schema.graphql</code> file for external code generators.</td>
    </tr>
  </tbody>
</table></div>

<h2>Automating Types Generation with package.json Scripts</h2>
<p>To ensure types are always in sync, add these standard scripts to your <code>package.json</code>:</p>

<div class="cb"><div class="fn">package.json</div><pre><code>{
  "scripts": {
    "dev": "next dev",
    "build": "pnpm generate:types && pnpm generate:importmap && next build",
    "generate:types": "payload generate:types",
    "generate:importmap": "payload generate:importmap",
    "migrate": "payload migrate",
    "migrate:create": "payload migrate:create",
    "migrate:down": "payload migrate:down"
  }
}</code></pre></div>

<h2>Writing Custom Standalone CLI Scripts with tsx</h2>
<p>You can write custom scripts for data imports, maintenance tasks, and bulk migrations using <code>tsx</code> to run TypeScript scripts directly with full Local API access:</p>

<div class="cb"><div class="fn">src/scripts/seed-products.ts</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  console.log('🌱 Initializing Payload for standalone script execution...')
  const payload = await getPayload({ config })

  console.log('Fetching existing products count...')
  const count = await payload.count({ collection: 'posts' })
  console.log(\`Current count: \${count.totalDocs}\`)

  console.log('Creating demo post...')
  const created = await payload.create({
    collection: 'posts',
    data: {
      title: 'Automated Seed Post',
      slug: 'automated-seed-post',
      _status: 'published',
    },
    overrideAccess: true, // Run with superadmin privileges in scripts
  })

  console.log(\`✅ Successfully created post ID: \${created.id}\`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Script failed:', err)
  process.exit(1)
})</code></pre></div>

<p>Execute your script directly with:</p>
<div class="cb"><div class="fn">terminal</div><pre><code>npx tsx src/scripts/seed-products.ts</code></pre></div>

<div class="tip">
  <b>Script Best Practice:</b> In standalone scripts, always call <code>process.exit(0)</code> upon completion; otherwise, database connection pool listeners might keep the Node.js process alive indefinitely in CI/CD runners.
</div>
`
  },
  {
    id: "config",
    m: "Core Concepts",
    t: "The Payload Config",
    r: ["all"],
    difficulty: "beginner",
    tags: ["config", "setup", "typescript"],
    c: `
<p class="lead">The <code>payload.config.ts</code> file is the master brain of your entire application. It defines database connections, registered collections, globals, authentication rules, plugins, rich text editor presets, and admin panel customization.</p>

<h2>Full Enterprise Configuration Architecture</h2>
<p>Here is a complete, production-ready Payload config demonstrating all major configuration surfaces:</p>

<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Posts } from './collections/Posts'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'

// Globals
import { Header } from './globals/Header'
import { SiteSettings } from './globals/SiteSettings'

// Plugins
import { seoPlugin } from '@payloadcms/plugin-seo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // 1. Admin Panel UI Configuration
  admin: {
    user: Users.slug, // Specifies which collection is used for Admin login
    meta: {
      titleSuffix: '– Acme Enterprise CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-admin.jpg',
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile (iPhone 14)', name: 'mobile', width: 390, height: 844 },
        { label: 'Tablet (iPad Pro)', name: 'tablet', width: 834, height: 1194 },
        { label: 'Desktop (4K)', name: 'desktop', width: 1440, height: 900 },
      ],
    },
    dateFormat: 'yyyy-MM-dd HH:mm',
    components: {
      // Custom branding & navigation components
    },
  },

  // 2. Data Models
  collections: [Users, Posts, Media, Categories],
  globals: [Header, SiteSettings],

  // 3. Database Adapter (Postgres + Drizzle)
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 20, // Connection pool size for high concurrency
      idleTimeoutMillis: 30000,
    },
    push: process.env.NODE_ENV !== 'production', // Auto-sync DB schema in local dev
  }),

  // 4. Default Rich Text Editor
  editor: lexicalEditor(),

  // 5. Image Manipulation Library
  sharp,

  // 6. Security & Encryption
  secret: process.env.PAYLOAD_SECRET || '',
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],

  // 7. TypeScript Compilation Target
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  // 8. Plugin Ecosystem
  plugins: [
    seoPlugin({
      collections: ['posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => \`\${doc.title} | Acme Tech\`,
      generateDescription: ({ doc }) => doc.excerpt,
    }),
  ],
})</code></pre></div>

<h2>Key Config Options Breakdown</h2>
<div class="tbl"><table>
  <thead><tr><th>Option</th><th>Type</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><code>admin.user</code></td><td><code>string</code></td><td>The collection slug representing administrative users allowed to log into <code>/admin</code>.</td></tr>
    <tr><td><code>db</code></td><td><code>DatabaseAdapter</code></td><td>Database engine driver: <code>postgresAdapter</code>, <code>sqliteAdapter</code>, or <code>mongooseAdapter</code>.</td></tr>
    <tr><td><code>editor</code></td><td><code>RichTextAdapter</code></td><td>Default editor for <code>richText</code> fields. Defaults to <code>lexicalEditor()</code>.</td></tr>
    <tr><td><code>sharp</code></td><td><code>SharpPackage</code></td><td>Pass the Sharp module directly for automated image resizing, WebP conversion, and thumbnail generation.</td></tr>
    <tr><td><code>typescript.outputFile</code></td><td><code>string</code></td><td>Absolute file path where generated TypeScript types will be written.</td></tr>
    <tr><td><code>plugins</code></td><td><code>Plugin[]</code></td><td>Array of composable plugins extending schemas, hooks, or admin panels.</td></tr>
  </tbody>
</table></div>

<div class="tip">
  <b>ESM Import Tip:</b> In Node ESM (standard for Next.js 15), <code>__dirname</code> is not globally available. Use <code>const dirname = path.dirname(fileURLToPath(import.meta.url))</code> to reliably construct absolute file paths for <code>outputFile</code>.
</div>
`
  },
  {
    id: "collections",
    m: "Core Concepts",
    t: "Collections",
    r: ["all", "backend"],
    difficulty: "beginner",
    tags: ["collections", "schema", "crud"],
    c: `
<p class="lead">A <strong>Collection</strong> is the core schema primitive in Payload. Defining a collection automatically provisions database tables, REST endpoints, GraphQL types, validation rules, access control, and a full-featured admin UI with pagination and search.</p>

<h2>Complete Collection Specification Example</h2>
<div class="cb"><div class="fn">src/collections/Posts.ts</div><pre><code>import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  // 1. Unique Slug: Identifies the collection, DB table, and /api/posts route
  slug: 'posts',

  // 2. Admin UI Customization
  admin: {
    useAsTitle: 'title', // Field value shown in list views & breadcrumbs
    defaultColumns: ['title', 'author', 'status', 'publishedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
    group: 'Editorial', // Sidebar grouping in Admin Panel
    pagination: {
      defaultLimit: 25,
      limits: [10, 25, 50, 100],
    },
  },

  // 3. Document Versioning & Draft Mode
  versions: {
    maxPerDoc: 50, // Keep last 50 revisions for rollbacks
    drafts: {
      autosave: { interval: 800 }, // Autosave draft edits every 800ms
      schedulePublish: true,      // Allow scheduling future publish dates
    },
  },

  // 4. Access Control
  access: {
    read: ({ req: { user } }) => {
      // Public sees published posts; Authenticated users see all drafts
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  // 5. Lifecycle Hooks
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Automatically generate URL slug from title on create
        if (data?.title && operation === 'create' && !data.slug) {
          data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        }
        return data
      },
    ],
  },

  // 6. Field Definitions
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      admin: { position: 'sidebar' },
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],

  // 7. Automatic Timestamps (createdAt, updatedAt)
  timestamps: true,
}</code></pre></div>

<h2>Collection Configuration Properties Reference</h2>
<div class="tbl"><table>
  <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>slug</code></td><td><code>string</code> (Required)</td><td>Unique alphanumeric identifier. Determines REST path <code>/api/{slug}</code> and DB table name.</td></tr>
    <tr><td><code>admin.useAsTitle</code></td><td><code>string</code></td><td>Name of the field whose value represents the document in relationship pickers and breadcrumbs.</td></tr>
    <tr><td><code>admin.group</code></td><td><code>string</code></td><td>Categorizes collections into accordion groups in the admin sidebar navigation.</td></tr>
    <tr><td><code>versions</code></td><td><code>object | boolean</code></td><td>Enables draft/published state machine, version history, and document restoration.</td></tr>
    <tr><td><code>access</code></td><td><code>CollectionAccess</code></td><td>Security rules for <code>read</code>, <code>create</code>, <code>update</code>, <code>delete</code>, <code>readVersions</code>.</td></tr>
    <tr><td><code>hooks</code></td><td><code>CollectionHooks</code></td><td>Lifecycle hooks: <code>beforeChange</code>, <code>afterChange</code>, <code>beforeRead</code>, <code>afterRead</code>, etc.</td></tr>
    <tr><td><code>indexes</code></td><td><code>Index[]</code></td><td>Custom composite database indices for high-performance multi-column queries.</td></tr>
  </tbody>
</table></div>
`
  },
  {
    id: "fields",
    m: "Core Concepts",
    t: "Fields deep dive",
    r: ["all", "backend"],
    difficulty: "intermediate",
    tags: ["fields", "validation", "blocks", "schema"],
    c: `
<p class="lead">Payload provides over 20 built-in field types covering primitive data types, relational schemas, visual layout builders, and advanced virtual fields. Each field supports custom validation, conditional admin visibility, indexing, and access control.</p>

<h2>All Built-in Field Types Overview</h2>
<div class="tbl"><table>
  <thead><tr><th>Field Type</th><th>Data Storage Format</th><th>Primary Use Case</th></tr></thead>
  <tbody>
    <tr><td><code>text</code> / <code>textarea</code></td><td><code>VARCHAR</code> / <code>TEXT</code></td><td>Single-line titles, slugs, plain text descriptions.</td></tr>
    <tr><td><code>number</code></td><td><code>NUMERIC</code> / <code>INTEGER</code></td><td>Prices, quantities, ratings with <code>min</code>, <code>max</code> constraints.</td></tr>
    <tr><td><code>email</code> / <code>date</code></td><td><code>VARCHAR</code> / <code>TIMESTAMP</code></td><td>Validated email addresses and ISO datepicker inputs.</td></tr>
    <tr><td><code>checkbox</code></td><td><code>BOOLEAN</code></td><td>Binary toggles (e.g. <code>isFeatured</code>, <code>inStock</code>).</td></tr>
    <tr><td><code>select</code> / <code>radio</code></td><td><code>VARCHAR</code></td><td>Enums with predefined option lists (single or multi-select).</td></tr>
    <tr><td><code>richText</code></td><td><code>JSON</code> (Lexical AST)</td><td>Full WYSIWYG editorial content with embedded blocks and links.</td></tr>
    <tr><td><code>upload</code></td><td>Foreign Key ID</td><td>Asset file referencing an upload-enabled collection.</td></tr>
    <tr><td><code>relationship</code></td><td>Foreign Key(s)</td><td>Relates to one or many documents across collections.</td></tr>
    <tr><td><code>array</code></td><td>Child Table / JSON</td><td>Repeater containing repeatable subfield groups.</td></tr>
    <tr><td><code>blocks</code></td><td>Polymorphic JSON</td><td>Dynamic visual page builder containing diverse layout components.</td></tr>
    <tr><td><code>group</code></td><td>Nested Object / Prefix</td><td>Namespaces fields (e.g. <code>meta.title</code>, <code>meta.description</code>).</td></tr>
    <tr><td><code>json</code> / <code>code</code></td><td><code>JSONB</code> / <code>TEXT</code></td><td>Raw structured JSON or syntax-highlighted code editor.</td></tr>
    <tr><td><code>join</code></td><td>Virtual / Relational</td><td>Zero-column reverse relationship querying child records.</td></tr>
  </tbody>
</table></div>

<h2>Field Validation &amp; Conditional Display</h2>
<p>Every field can declare custom server-side validation functions and client-side conditional display rules:</p>

<div class="cb"><div class="fn">Advanced Field Configuration</div><pre><code>{
  name: 'discountPercentage',
  type: 'number',
  min: 0,
  max: 100,
  admin: {
    // Only display this field in Admin UI when onSale checkbox is checked
    condition: (data, siblingData) => Boolean(siblingData.onSale),
    description: 'Enter a value between 0 and 100 representing percentage discount',
    step: 1,
  },
  // Server-side validation executed on every create and update
  validate: async (val, { req, siblingData }) => {
    if (siblingData.onSale && (val === undefined || val === null)) {
      return 'Discount percentage is required when product is on sale.'
    }
    if (val && val > 90 && req.user?.role !== 'admin') {
      return 'Discounts over 90% require Admin authorization.'
    }
    return true // Return true if valid, or a string error message
  },
}</code></pre></div>

<h2>The Blocks Field (Visual Page Builder)</h2>
<p>The <code>blocks</code> field allows content editors to assemble custom pages out of modular UI components:</p>

<div class="cb"><div class="fn">src/fields/pageBuilder.ts</div><pre><code>import type { Field } from 'payload'

export const pageBuilderField: Field = {
  name: 'layout',
  type: 'blocks',
  minRows: 1,
  maxRows: 20,
  blocks: [
    // 1. Hero Block
    {
      slug: 'hero',
      labels: { singular: 'Hero Section', plural: 'Hero Sections' },
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'tagline', type: 'textarea' },
        { name: 'style', type: 'select', options: ['full-bleed', 'split', 'minimal'], defaultValue: 'full-bleed' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
      ],
    },
    // 2. Call To Action Block
    {
      slug: 'cta',
      labels: { singular: 'Call to Action', plural: 'Call to Actions' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'buttonText', type: 'text', required: true },
        { name: 'buttonLink', type: 'text', required: true },
        { name: 'theme', type: 'select', options: ['dark', 'accent', 'light'], defaultValue: 'accent' },
      ],
    },
  ],
}</code></pre></div>
`
  },
  {
    id: "layout",
    m: "Core Concepts",
    t: "Tabs, Groups & Layout Fields",
    r: ["all", "frontend", "backend"],
    difficulty: "intermediate",
    tags: ["tabs", "groups", "admin-ui", "ux"],
    c: `
<p class="lead">As your CMS schema grows, keeping the editor experience intuitive and ergonomic is vital. Layout fields allow you to visually structure the document editor without cluttering your database schema.</p>

<h2>Named Tabs vs. Unnamed Tabs</h2>
<p>The <code>tabs</code> field provides horizontal or vertical tab navigation in the editor. Tabs can be <strong>Unnamed</strong> (flattens fields directly into the root document) or <strong>Named</strong> (creates a nested sub-object in your data):</p>

<div class="cb"><div class="fn">src/collections/Pages.ts (Tabs Example)</div><pre><code>{
  type: 'tabs',
  tabs: [
    // 1. UNNAMED TAB: Fields live at doc.title and doc.content
    {
      label: 'Main Content',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'richText' },
      ],
    },
    // 2. NAMED TAB: Creates doc.seo.metaTitle, doc.seo.metaDescription
    {
      name: 'seo',
      label: 'SEO & Social Sharing',
      fields: [
        { name: 'metaTitle', type: 'text', maxLength: 60 },
        { name: 'metaDescription', type: 'textarea', maxLength: 160 },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    // 3. UNNAMED TAB with admin condition
    {
      label: 'Developer Settings',
      admin: {
        condition: (data, siblingData, { user }) => user?.role === 'admin',
      },
      fields: [
        { name: 'customCss', type: 'code', admin: { language: 'css' } },
        { name: 'enableCacheBusting', type: 'checkbox', defaultValue: false },
      ],
    },
  ],
}</code></pre></div>

<h2>Layout Organizers: Rows &amp; Collapsibles</h2>
<div class="cb"><div class="fn">Rows & Collapsibles Example</div><pre><code>// Displaying two fields side-by-side on 50% width
{
  type: 'row',
  fields: [
    { name: 'startDate', type: 'date', admin: { width: '50%' } },
    { name: 'endDate', type: 'date', admin: { width: '50%' } },
  ],
},

// Collapsible accordion for optional or advanced settings
{
  type: 'collapsible',
  label: 'Advanced Schema & OpenGraph Customization',
  admin: {
    initCollapsed: true, // Closed by default to keep UI clean
  },
  fields: [
    { name: 'canonicalUrl', type: 'text' },
    { name: 'structuredDataJson', type: 'json' },
  ],
}</code></pre></div>

<h2>Sidebar Placement (<code>position: 'sidebar'</code>)</h2>
<p>Placing metadata fields (status toggles, publish dates, category taxonomy, author relationships) in the inspector sidebar gives content editors a layout identical to Medium or WordPress:</p>

<div class="cb"><div class="fn">Sidebar Fields</div><pre><code>{
  name: 'status',
  type: 'select',
  options: ['draft', 'in-review', 'published'],
  defaultValue: 'draft',
  admin: {
    position: 'sidebar', // Moves field to the right-hand sticky drawer
  },
}</code></pre></div>
`
  },
  {
    id: "relationships",
    m: "Core Concepts",
    t: "Relationships & population masterclass",
    r: ["all", "backend"],
    difficulty: "advanced",
    tags: ["relationships", "performance", "depth", "select"],
    c: `
<p class="lead">Understanding how relationships, depth, and population work in Payload is critical to building high-performance applications and eliminating N+1 database queries.</p>

<h2>Relationship Cardinality Types</h2>
<div class="tbl"><table>
  <thead><tr><th>Cardinality</th><th>Field Configuration</th><th>Database Storage Pattern</th></tr></thead>
  <tbody>
    <tr>
      <td><b>One-to-One</b></td>
      <td><code>{ name: 'author', type: 'relationship', relationTo: 'users' }</code></td>
      <td>Stores a single foreign key column (e.g. <code>author_id</code>) in the parent table.</td>
    </tr>
    <tr>
      <td><b>One-to-Many</b></td>
      <td><code>{ name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true }</code></td>
      <td>Stores an array of IDs in PostgreSQL/JSON or uses a relational join table.</td>
    </tr>
    <tr>
      <td><b>Polymorphic</b></td>
      <td><code>{ name: 'parent', type: 'relationship', relationTo: ['posts', 'pages', 'products'] }</code></td>
      <td>Stores composite relation tuple: <code>{ relationTo: 'posts', value: '123' }</code>.</td>
    </tr>
  </tbody>
</table></div>

<h2>Controlling Population: <code>depth</code> vs. Granular <code>populate</code></h2>
<p>The <code>depth</code> parameter specifies how many levels of relations Payload automatically fetches:</p>

<div class="cb"><div class="fn">Depth demonstration</div><pre><code>// 1. depth: 0 -> Returns raw foreign key IDs only (Extremely fast, zero joins)
const post0 = await payload.findByID({
  collection: 'posts',
  id: '101',
  depth: 0,
})
// Result: { id: '101', title: 'Hello', author: 'user-88' }

// 2. depth: 1 -> Resolves immediate 1st-level relations
const post1 = await payload.findByID({
  collection: 'posts',
  id: '101',
  depth: 1,
})
// Result: { id: '101', title: 'Hello', author: { id: 'user-88', name: 'Alice', email: 'alice@corp.com' } }

// 3. Payload 3.x Granular Field Population with 'select' + 'populate'
const optimizedPost = await payload.findByID({
  collection: 'posts',
  id: '101',
  select: {
    title: true,
    author: true,
  },
  populate: {
    author: {
      select: {
        name: true,
        email: true, // Only fetch name & email, exclude password hashes and audit fields
      },
    },
  },
})</code></pre></div>

<h2>The <code>defaultPopulate</code> Optimization</h2>
<p>Configure <code>defaultPopulate</code> on referenced collections to prevent massive payload over-fetching when documents are populated as relations elsewhere in your system:</p>

<div class="cb"><div class="fn">src/collections/Users.ts</div><pre><code>export const Users: CollectionConfig = {
  slug: 'users',
  defaultPopulate: {
    firstName: true,
    lastName: true,
    email: true,
    avatar: true,
    // Exclude heavy fields like twoFactorSecret, billingInfo, loginAttempts
  },
  fields: [...],
}</code></pre></div>

<div class="warn">
  <b>Performance Trap:</b> Never use <code>depth: 5</code> or higher on large collection list queries (<code>payload.find</code>). High depth triggers recursive relational joins that can degrade database response times. Keep list queries at <code>depth: 0</code> or <code>1</code> and fetch deep sub-trees on single document detail pages.
</div>
`
  },
  {
    id: "globals",
    m: "Core Concepts",
    t: "Globals & singletons",
    r: ["all", "frontend"],
    difficulty: "beginner",
    tags: ["globals", "singletons", "header", "settings"],
    c: `
<p class="lead"><strong>Globals</strong> are singleton documents designed for managing application-wide data that only exists once — such as site navigation menus, footer links, company branding, analytics IDs, and SEO defaults.</p>

<h2>Defining a Global Schema</h2>
<div class="cb"><div class="fn">src/globals/Header.ts</div><pre><code>import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header Navigation',
  access: {
    read: () => true, // Publicly readable by frontend website
    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      labels: { singular: 'Navigation Item', plural: 'Navigation Items' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'link', type: 'text', required: true },
        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
        {
          name: 'badge',
          type: 'text',
          admin: { description: 'Optional pill text like "New" or "Sale"' },
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      fields: [
        { name: 'text', type: 'text', defaultValue: 'Get Started' },
        { name: 'url', type: 'text', defaultValue: '/signup' },
        { name: 'style', type: 'select', options: ['primary', 'outline', 'ghost'], defaultValue: 'primary' },
      ],
    },
  ],
}</code></pre></div>

<h2>Fetching &amp; Updating Globals</h2>
<div class="cb"><div class="fn">src/app/(frontend)/layout.tsx (Next.js Server Component)</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })

  // Fetch Header Global with Local API
  const header = await payload.findGlobal({
    slug: 'header',
    depth: 1, // Populates the logo upload media
  })

  return (
    &lt;html lang="en"&gt;
      &lt;body&gt;
        &lt;header className="navbar"&gt;
          {typeof header.logo === 'object' &amp;&amp; header.logo?.url &amp;&amp; (
            &lt;Image src={header.logo.url} alt="Logo" width={140} height={40} priority /&gt;
          )}
          &lt;nav&gt;
            {header.navItems?.map((item, i) => (
              &lt;Link key={i} href={item.link} target={item.openInNewTab ? '_blank' : undefined}&gt;
                {item.label}
              &lt;/Link&gt;
            ))}
          &lt;/nav&gt;
        &lt;/header&gt;
        &lt;main&gt;{children}&lt;/main&gt;
      &lt;/body&gt;
    &lt;/html&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "join",
    m: "Core Concepts",
    t: "Join fields & virtual fields",
    r: ["all", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["join", "virtual", "relations", "performance"],
    c: `
<p class="lead">Payload 3.x introduced <strong>Join Fields</strong> and <strong>Virtual Fields</strong> to eliminate manual reverse queries and enable dynamically computed attributes with zero extra database columns.</p>

<h2>1. Join Fields (Reverse Relationships)</h2>
<p>In traditional databases, if a <code>Post</code> belongs to a <code>Category</code> (storing <code>category: relationship</code>), finding all posts in a category required querying the Posts collection. A <code>join</code> field allows the parent collection (<code>Categories</code>) to declare a bi-directional view of its children:</p>

<div class="cb"><div class="fn">src/collections/Categories.ts</div><pre><code>import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
    },
    // The JOIN field: Zero database columns on 'categories' table!
    {
      name: 'posts',
      type: 'join',
      collection: 'posts', // Target collection to query
      on: 'category',      // Field on Posts that references this Category
      maxDepth: 1,
    },
  ],
}</code></pre></div>

<p>When viewing a Category in the Payload Admin Panel, editors immediately see a paginated, filterable table of all posts linked to that category. In the Local API:</p>

<div class="cb"><div class="fn">Querying Join Fields</div><pre><code>const techCategory = await payload.findByID({
  collection: 'categories',
  id: 'cat_tech_10',
  joins: {
    posts: {
      limit: 10,
      sort: '-createdAt',
      where: { _status: { equals: 'published' } },
    },
  },
})

console.log(techCategory.posts.docs) // Returns the array of published posts!
console.log(techCategory.posts.totalDocs) // Total number of posts in category</code></pre></div>

<h2>2. Virtual Fields (Dynamic Computed Properties)</h2>
<p>Virtual fields do not exist in database storage. They are calculated on-the-fly during serialization in an <code>afterRead</code> hook:</p>

<div class="cb"><div class="fn">src/collections/Users.ts</div><pre><code>export const Users: CollectionConfig = {
  slug: 'users',
  fields: [
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    {
      name: 'fullName',
      type: 'text',
      virtual: true, // Informs Payload & Drizzle not to create a DB column
      admin: { readOnly: true },
    },
    {
      name: 'readingStats',
      type: 'json',
      virtual: true,
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc, req }) => {
        // Calculate full name
        doc.fullName = [doc.firstName, doc.lastName].filter(Boolean).join(' ') || 'Anonymous'

        // Calculate dynamic stats
        const bookmarksCount = await req.payload.count({
          collection: 'bookmarks',
          where: { user: { equals: doc.id } },
        })
        doc.readingStats = { totalBookmarks: bookmarksCount.totalDocs }

        return doc
      },
    ],
  },
}</code></pre></div>

<div class="tip">
  <b>Filtering Rule:</b> Because Virtual fields are not stored in database columns, you cannot use them in database <code>where</code> query clauses. If you need to filter or sort by a computed value in SQL, calculate it in a <code>beforeChange</code> hook and persist it in a real field.
</div>
`
  }
];
