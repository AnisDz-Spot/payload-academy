import { Lesson } from './types';

export const LESSONS: Lesson[] = [
  {
    "id": "prereqs",
    "m": "Foundations",
    "t": "Prerequisites: what you need before you start",
    "r": [
      "all"
    ],
    "difficulty": "beginner",
    "tags": [
      "setup",
      "prerequisites",
      "typescript"
    ],
    "c": "\n<p class=\"lead\">Before you write a single line of Payload, set yourself up for success. Payload 3.x runs inside a modern JavaScript runtime, so a little upfront preparation removes almost every \"why doesn't this work?\" moment you would otherwise hit in the first lesson.</p>\n\n<h2>What you need</h2>\n<ul>\n  <li><strong>Node.js 18 or newer</strong> (20 LTS recommended).</li>\n  <li><strong>A package manager</strong> — pnpm, npm, yarn or bun.</li>\n  <li><strong>TypeScript basics</strong> — object literals, functions and imports.</li>\n  <li><strong>A database</strong> — PostgreSQL (recommended), MongoDB, or SQLite for local experimenting.</li>\n  <li><strong>Git</strong> — commit a working state before each challenge.</li>\n</ul>\n\n<h2>Environment checklist</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Tool</th><th>Verify with</th><th>Expected</th></tr></thead>\n  <tbody>\n    <tr><td>Node.js</td><td><code>node -v</code></td><td>v18 or higher</td></tr>\n    <tr><td>Package manager</td><td><code>pnpm -v</code></td><td>any recent version</td></tr>\n    <tr><td>TypeScript</td><td><code>npx tsc -v</code></td><td>5.x</td></tr>\n    <tr><td>Database</td><td>a reachable connection string</td><td>Postgres / Mongo / SQLite</td></tr>\n  </tbody>\n</table></div>\n\n<h2>Do you need a database already?</h2>\n<p>No. For your first experiments you can point Payload at a local SQLite file or a free hosted Postgres such as Neon. The database adapter is a single config option, so you can swap it later without touching your collections.</p>\n\n<h2>How this course works</h2>\n<ul>\n  <li>Every lesson ends with a <strong>graded coding challenge</strong> checked against a reference solution.</li>\n  <li>A short <strong>quiz</strong> locks in the key idea before you move on.</li>\n  <li>Lessons build on each other — keep one project running across the Foundations module.</li>\n</ul>\n\n<h2>Your challenge</h2>\n<p>Prove your toolchain is understood: export a <code>prerequisites</code> object describing the runtime Payload expects.</p>\n",
    "readingMins": 3
  },
  {
    "id": "intro",
    "m": "Foundations",
    "t": "What is Payload?",
    "r": [
      "all"
    ],
    "difficulty": "beginner",
    "tags": [
      "intro",
      "architecture",
      "nextjs"
    ],
    "c": "\n<p class=\"lead\">Payload is an open-source, code-first headless CMS and fullstack application framework built entirely with TypeScript. Unlike legacy headless CMSs that run as separate black-box microservices with GUI-configured schemas, Payload 3.x lives <strong>directly inside your Next.js application</strong> (or any modern Node/Bun/Deno server) — sharing one codebase, one execution runtime, and one deployment pipeline.</p>\n\n<h2>The Paradigm Shift: Code-First vs GUI-First</h2>\n<p>Traditional headless CMS tools force developers into a fragmented workflow: clicking around a hosted web UI to define schemas, managing separate webhook synchronization layers, suffering from network latency on every query, and dealing with out-of-sync TypeScript definitions. Payload flips this model entirely:</p>\n\n<div class=\"cards\">\n  <div class=\"card\">\n    <div class=\"card-icon\">⚡</div>\n    <div class=\"card-title\">In-Process Local API</div>\n    <div class=\"card-sub\">Zero network latency. Queries run directly against your database within Server Components and Server Actions.</div>\n  </div>\n  <div class=\"card\">\n    <div class=\"card-icon\">🛡️</div>\n    <div class=\"card-title\">Type Safety by Default</div>\n    <div class=\"card-sub\">Automatic 100% TypeScript type generation directly from your TypeScript schema configs.</div>\n  </div>\n  <div class=\"card\">\n    <div class=\"card-icon\">📦</div>\n    <div class=\"card-title\">Single Next.js Runtime</div>\n    <div class=\"card-sub\">Both your front-facing public website and your back-office admin panel live in one unified Next.js App Router project.</div>\n  </div>\n  <div class=\"card\">\n    <div class=\"card-icon\">🔌</div>\n    <div class=\"card-title\">Database Agnostic</div>\n    <div class=\"card-sub\">Run on PostgreSQL, SQLite, or MongoDB via modern Drizzle ORM and Mongoose adapters.</div>\n  </div>\n</div>\n\n<h2>Payload 3.x Architecture Deep Dive</h2>\n<p>In Payload 3.x, the entire CMS runtime is decoupled into modular layers that execute natively on Next.js 16 App Router and React Server Components (RSC):</p>\n\n<div class=\"tbl\"><table>\n  <thead>\n    <tr><th>Layer</th><th>Technology</th><th>Role &amp; Responsibility</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><b>Admin UI</b></td>\n      <td>React 19 / RSC / Next.js</td>\n      <td>Server-rendered admin interface with streaming, live preview, and hot reload. Zero Webpack bundling required.</td>\n    </tr>\n    <tr>\n      <td><b>API Handlers</b></td>\n      <td>App Router Catch-All Routes</td>\n      <td><code>app/(payload)/api/[...slug]/route.ts</code> generates standard REST and GraphQL endpoints automatically.</td>\n    </tr>\n    <tr>\n      <td><b>Core Engine</b></td>\n      <td>Node.js / Edge Compatible</td>\n      <td>Executes access control, field validation, life-cycle hooks, draft versioning, and document serialization.</td>\n    </tr>\n    <tr>\n      <td><b>Database Layer</b></td>\n      <td>Drizzle ORM &amp; Mongoose</td>\n      <td>Translates declarative schemas into optimized SQL tables, indices, relations, or MongoDB collections.</td>\n    </tr>\n  </tbody>\n</table></div>\n\n<h2>The Core Mental Model</h2>\n<p>To master Payload, you only need to understand five foundational building blocks:</p>\n<ol>\n  <li><b>Collections:</b> Schemas for repeatable entities (e.g., <code>Posts</code>, <code>Products</code>, <code>Users</code>, <code>Orders</code>). Each collection generates a dedicated DB table, REST endpoints, GraphQL types, and admin list/edit views.</li>\n  <li><b>Globals:</b> Schemas for singleton data (e.g., <code>HeaderNav</code>, <code>SiteSettings</code>, <code>Footer</code>). Ideal for sitewide configuration where only one document ever exists.</li>\n  <li><b>Fields:</b> Over 20 strongly-typed field definitions (Text, Rich Text, Relationships, Uploads, Dynamic Blocks, Arrays, Joins) that define the shape of your data.</li>\n  <li><b>Access Control:</b> Declarative, function-level security controlling <code>read</code>, <code>create</code>, <code>update</code>, <code>delete</code>, and <code>unlock</code> per collection and per field, returning booleans or database query constraints.</li>\n  <li><b>Hooks:</b> Async lifecycle functions (e.g. <code>beforeChange</code>, <code>afterChange</code>, <code>beforeRead</code>, <code>afterDelete</code>) that run business logic, trigger revalidations, or sync external services.</li>\n</ol>\n\n<h2>Comparison: Payload vs Strapi vs Sanity vs Contentful</h2>\n<div class=\"tbl\"><table>\n  <thead>\n    <tr><th>Feature</th><th>Payload 3.x</th><th>Strapi</th><th>Sanity</th><th>Contentful</th></tr>\n  </thead>\n  <tbody>\n    <tr><td><b>Hosting</b></td><td>Self-Hosted / Anywhere (Vercel, AWS)</td><td>Self-Hosted / Cloud</td><td>Hosted Proprietary Cloud</td><td>Hosted Proprietary Cloud</td></tr>\n    <tr><td><b>Schema Definition</b></td><td>Pure TypeScript Config</td><td>GUI + JSON files</td><td>JS/TS Schemas</td><td>GUI / Web App</td></tr>\n    <tr><td><b>Database Ownership</b></td><td>100% Yours (Postgres, SQLite, Mongo)</td><td>Yours (Postgres, MySQL)</td><td>Vendor Owned Proprietary</td><td>Vendor Owned Proprietary</td></tr>\n    <tr><td><b>Local In-Process API</b></td><td>✅ Yes (Zero HTTP overhead)</td><td>❌ No (Local HTTP calls)</td><td>❌ No (Network HTTP query)</td><td>❌ No (Network HTTP query)</td></tr>\n    <tr><td><b>Next.js App Router Co-location</b></td><td>✅ Native in same repo</td><td>❌ Separate server</td><td>❌ Separate dashboard</td><td>❌ Separate dashboard</td></tr>\n    <tr><td><b>Licensing</b></td><td>MIT Open Source</td><td>Community / Enterprise</td><td>Proprietary Tiered</td><td>Proprietary Tiered</td></tr>\n  </tbody>\n</table></div>\n\n<div class=\"tip\">\n  <b>Architectural Rule of Thumb:</b> If your frontend is Next.js, Payload 3.x eliminates the need for any separate backend repository, microservice container, or third-party SaaS CMS subscription. You build your database schema, admin panel, and client frontend within the same repository.\n</div>\n",
    "readingMins": 4
  },
  {
    "id": "install",
    "m": "Foundations",
    "t": "Installation & first run",
    "r": [
      "all",
      "devops"
    ],
    "difficulty": "beginner",
    "tags": [
      "setup",
      "cli",
      "database",
      "env"
    ],
    "c": "\n<p class=\"lead\">Getting started with Payload 3.x takes under two minutes. In this lesson, we will cover scaffolding a brand new project using the official CLI, configuring database adapters, setting up environment variables, and embedding Payload into an existing Next.js 16 project.</p>\n\n<h2>Method 1: Fast Scaffolding with create-payload-app</h2>\n<p>The fastest way to launch a full-stack project is using the official interactive scaffolding tool:</p>\n\n<div class=\"cb\"><div class=\"fn\">terminal</div><pre><code>npx create-payload-app@latest my-payload-project</code></pre></div>\n\n<p>The CLI will guide you through interactive prompts:</p>\n<ul>\n  <li><b>Choose a Template:</b> <code>blank</code> (minimal config), <code>website</code> (complete marketing site with blocks &amp; SEO), or <code>ecommerce</code> (Stripe + cart + checkout).</li>\n  <li><b>Choose Database:</b> <code>PostgreSQL</code> (recommended for production with Neon/Supabase), <code>SQLite</code> (lightweight, incredible for local dev and edge/LibSQL), or <code>MongoDB</code>.</li>\n  <li><b>Package Manager:</b> <code>pnpm</code>, <code>npm</code>, or <code>yarn</code>.</li>\n</ul>\n\n<h2>Method 2: Adding Payload to an Existing Next.js 16 App</h2>\n<p>If you already have an existing Next.js 16 App Router codebase, you can install Payload directly as a dependency:</p>\n\n<div class=\"cb\"><div class=\"fn\">terminal</div><pre><code># 1. Install core dependencies\npnpm add payload @payloadcms/next @payloadcms/richtext-lexical sharp graphql\n\n# 2. Install your chosen database adapter\npnpm add @payloadcms/db-postgres   # For PostgreSQL\n# OR: pnpm add @payloadcms/db-sqlite     # For SQLite / LibSQL / Turso\n# OR: pnpm add @payloadcms/db-mongodb    # For MongoDB</code></pre></div>\n\n<h3>Step 2.1: Wrap Next.js Configuration</h3>\n<p>Payload needs to configure Webpack/Turbopack aliases and GraphQL loaders. Wrap your <code>next.config.mjs</code>:</p>\n\n<div class=\"cb\"><div class=\"fn\">next.config.mjs</div><pre><code>import { withPayload } from '@payloadcms/next/withPayload'\n\n/** @type {import('next').NextConfig} */\nconst nextConfig = {\n  // your custom Next.js configuration options here\n  experimental: {\n    // optional experimental features\n  },\n}\n\nexport default withPayload(nextConfig)</code></pre></div>\n\n<h3>Step 2.2: Mount Route Handlers &amp; Admin Page</h3>\n<p>Create the App Router entry points in <code>src/app/(payload)/</code>:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/app/(payload)/admin/[[...segments]]/page.tsx</div><pre><code>import type { Metadata } from 'next'\nimport config from '@payload-config'\nimport { RootPage, generatePageMetadata } from '@payloadcms/next/views'\nimport { importMap } from '../importMap'\n\ntype Args = {\n  params: Promise<{\n    segments?: string[]\n  }>\n  searchParams: Promise<{\n    [key: string]: string | string[]\n  }>\n}\n\nexport const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>\n  generatePageMetadata({ config, params, searchParams })\n\nexport default async function Page({ params, searchParams }: Args) {\n  return RootPage({ config, params, searchParams, importMap })\n}</code></pre></div>\n\n<div class=\"cb\"><div class=\"fn\">src/app/(payload)/api/[...slug]/route.ts</div><pre><code>import { REST_DELETE, REST_GET, REST_OPTIONS, REST_PATCH, REST_POST } from '@payloadcms/next/routes'\nimport config from '@payload-config'\n\nexport const GET = REST_GET(config)\nexport const POST = REST_POST(config)\nexport const DELETE = REST_DELETE(config)\nexport const PATCH = REST_PATCH(config)\nexport const OPTIONS = REST_OPTIONS(config)</code></pre></div>\n\n<h2>Environment Variables &amp; Database Connections</h2>\n<p>Payload requires two critical environment variables to function securely:</p>\n\n<div class=\"cb\"><div class=\"fn\">.env</div><pre><code># 1. Secret used to sign JWTs, hashes, and encryption tokens (min 32 chars)\nPAYLOAD_SECRET=f9a84b07c2d158e390cfa117e94db6e51c8a7741d7e2e30f1d53086b9a4c8e12\n\n# 2. Database Connection Strings:\n# PostgreSQL (Supabase, Neon, Railway, Docker, Local):\nDATABASE_URI=postgres://postgres:password@localhost:5432/my_payload_db\n\n# Or for SQLite (Local file):\n# DATABASE_URI=file:./payload.db\n\n# 3. Public URL of your application (used for CORS, emails, and live preview)\nNEXT_PUBLIC_SERVER_URL=http://localhost:3000</code></pre></div>\n\n<div class=\"warn\">\n  <b>Critical Security Warning:</b> Never use an insecure or predictable <code>PAYLOAD_SECRET</code> in staging or production. Generate a high-entropy string using <code>openssl rand -hex 32</code>. If this secret is leaked, attackers can forge valid authentication tokens!\n</div>\n",
    "readingMins": 4
  },
  {
    "id": "quickstart",
    "m": "Foundations",
    "t": "Your first 10 minutes with Payload",
    "r": [
      "all"
    ],
    "difficulty": "beginner",
    "tags": [
      "quickstart",
      "local-api",
      "nextjs"
    ],
    "c": "\n<p class=\"lead\">This is the fastest path from an empty folder to a running CMS you can log into, add content to, and read back out. Follow along in your own terminal — ten minutes and you will have a real Payload backend.</p>\n\n<h2>1. Scaffold the project</h2>\n<p>Use the official template, which wires Next.js 16 and Payload together:</p>\n<div class=\"cb\"><div class=\"fn\">terminal</div><pre><code>npx create-payload-app@latest my-academy\ncd my-academy\npnpm dev</code></pre></div>\n\n<h2>2. Open the admin panel</h2>\n<p>Visit <code>http://localhost:3000/admin</code>. On first run Payload asks you to create the first admin user. That account lives in the <code>users</code> collection the template already defines.</p>\n\n<h2>3. Create your first document</h2>\n<p>The template ships with a <code>Posts</code> collection. Click <strong>Posts → Create New</strong>, add a title and body, and save. Notice the list view, search, pagination and version history you get for free — none of it was hand-written.</p>\n\n<h2>4. Read it back with the Local API</h2>\n<p>The real payoff: your server code reads the database directly, with no HTTP hop back to yourself.</p>\n<div class=\"cb\"><div class=\"fn\">src/app/page.tsx</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\n\nexport default async function Home() {\n  const payload = await getPayload({ config })\n  const { docs } = await payload.find({\n    collection: 'posts',\n    limit: 10,\n    sort: '-createdAt',\n  })\n\n  return (\n    &lt;ul&gt;\n      {docs.map((post) =&gt; (\n        &lt;li key={post.id}&gt;{post.title}&lt;/li&gt;\n      ))}\n    &lt;/ul&gt;\n  )\n}</code></pre></div>\n\n<h2>What just happened</h2>\n<p>One command scaffolded the admin UI, the REST and GraphQL APIs, and the database schema. You wrote no SQL, no CRUD endpoints and no forms — the config produced all of it. The rest of the course is about shaping that config to your own domain.</p>\n\n<h2>Your challenge</h2>\n<p>Write the server helper that fetches the ten newest posts from the <code>posts</code> collection using the Local API.</p>\n",
    "readingMins": 5
  },
  {
    "id": "structure",
    "m": "Foundations",
    "t": "Project structure & folder conventions",
    "r": [
      "all"
    ],
    "difficulty": "beginner",
    "tags": [
      "architecture",
      "nextjs",
      "conventions"
    ],
    "c": "\n<p class=\"lead\">Understanding the folder structure of a Payload 3.x project is essential for clean architecture, team collaboration, and leveraging Next.js Route Groups for total isolation between public pages and admin dashboard logic.</p>\n\n<h2>Standard Enterprise Project Hierarchy</h2>\n<div class=\"cb\"><div class=\"fn\">project-structure</div><pre><code>my-payload-app/\n├── src/\n│   ├── app/\n│   │   ├── (frontend)/            # Route Group: Public Marketing / App Pages\n│   │   │   ├── layout.tsx         # Public website layout (Header, Footer, CSS)\n│   │   │   ├── page.tsx           # Homepage Server Component\n│   │   │   ├── blog/\n│   │   │   │   ├── page.tsx       # Blog Listing Page\n│   │   │   │   └── [slug]/page.tsx# Single Post Dynamic Page\n│   │   │   └── globals.css        # Frontend styling\n│   │   │\n│   │   └── (payload)/             # Route Group: Payload CMS Engine & Admin\n│   │       ├── admin/\n│   │       │   ├── [[...segments]]/page.tsx # Admin UI catch-all router\n│   │       │   └── importMap.js   # Generated component map for Admin UI\n│   │       ├── api/\n│   │       │   ├── [...slug]/route.ts       # REST endpoints (/api/posts, etc)\n│   │       │   └── graphql/route.ts        # GraphQL endpoint (/api/graphql)\n│   │       └── layout.tsx         # Dedicated HTML root layout for Admin\n│   │\n│   ├── collections/               # Payload Collection Configs\n│   │   ├── Users.ts               # Authentication collection\n│   │   ├── Posts.ts               # Blog posts schema & hooks\n│   │   ├── Media.ts               # File upload collection\n│   │   └── Categories.ts          # Taxonomy collection\n│   │\n│   ├── globals/                   # Payload Global Singletons\n│   │   ├── Header.ts              # Navigation menu configuration\n│   │   └── SiteSettings.ts        # SEO metadata, footer, socials\n│   │\n│   ├── blocks/                    # Reusable Block definitions for Page Builder\n│   │   ├── Hero/config.ts         # Block schema\n│   │   ├── Hero/Component.tsx     # React Server Component for rendering\n│   │   ├── CallToAction/\n│   │   └── ImageGallery/\n│   │\n│   ├── hooks/                     # Reusable business logic lifecycle hooks\n│   │   ├── revalidatePage.ts\n│   │   └── populateUser.ts\n│   │\n│   ├── access/                    # Centralized access control predicates\n│   │   ├── isAdmin.ts\n│   │   └── publishedOrAuthor.ts\n│   │\n│   ├── payload.config.ts          # Master Payload Config\n│   └── payload-types.ts           # Generated TypeScript Interfaces (Auto-generated)\n│\n├── next.config.mjs                # Next.js configuration with withPayload()\n├── tsconfig.json\n└── package.json</code></pre></div>\n\n<h2>Why Route Groups <code>(frontend)</code> and <code>(payload)</code> Matter</h2>\n<p>Next.js Route Groups (directories enclosed in parentheses like <code>(frontend)</code>) allow you to have <strong>separate root layouts</strong> without affecting URL routing:</p>\n<ul>\n  <li><code>(frontend)/layout.tsx</code> has its own <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> with your custom website CSS, branding fonts, analytics scripts, and client context providers.</li>\n  <li><code>(payload)/layout.tsx</code> provides a dedicated, lightweight root layout required by the Payload admin dashboard, preventing CSS conflicts between Tailwind/global styles and the Payload Admin UI styles.</li>\n</ul>\n\n<h2>Critical Generated Files</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>File Path</th><th>Generation Trigger</th><th>Purpose &amp; Git Best Practice</th></tr></thead>\n  <tbody>\n    <tr>\n      <td><code>src/payload-types.ts</code></td>\n      <td><code>pnpm payload generate:types</code></td>\n      <td>Pure TypeScript types for all Collections and Globals. <b>Commit to Git!</b> Required for CI/CD builds.</td>\n    </tr>\n    <tr>\n      <td><code>src/app/(payload)/admin/importMap.js</code></td>\n      <td><code>pnpm payload generate:importmap</code></td>\n      <td>Maps custom React UI components to Payload Admin bundle. <b>Commit to Git!</b></td>\n    </tr>\n    <tr>\n      <td><code>src/migrations/*.ts</code></td>\n      <td><code>pnpm payload migrate:create</code></td>\n      <td>Declarative SQL schema migrations for Drizzle/PostgreSQL. <b>Commit to Git!</b></td>\n    </tr>\n  </tbody>\n</table></div>\n\n<div class=\"note\">\n  <b>TypeScript Path Alias:</b> In <code>tsconfig.json</code>, configure <code>\"@payload-config\": [\"./src/payload.config.ts\"]</code>. This standard alias allows Payload internals and Server Components to import your configuration anywhere with zero relative path calculation.\n</div>\n",
    "readingMins": 4
  },
  {
    "id": "cli",
    "m": "Foundations",
    "t": "Payload CLI & developer tools",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "cli",
      "migrations",
      "types",
      "scripts"
    ],
    "c": "\n<p class=\"lead\">The Payload CLI is your powerhouse developer tool for compiling TypeScript interfaces, running database migrations, executing ad-hoc server scripts with the Local API, and managing background jobs.</p>\n\n<h2>Complete Command Reference</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Command</th><th>Flags / Arguments</th><th>Description</th></tr></thead>\n  <tbody>\n    <tr>\n      <td><code>payload generate:types</code></td>\n      <td><code>--config &lt;path&gt;</code></td>\n      <td>Analyzes your schema configs and writes a strict <code>payload-types.ts</code> file.</td>\n    </tr>\n    <tr>\n      <td><code>payload generate:importmap</code></td>\n      <td><code>--config &lt;path&gt;</code></td>\n      <td>Scans custom admin components and generates the browser/server component import registry.</td>\n    </tr>\n    <tr>\n      <td><code>payload migrate:create &lt;name&gt;</code></td>\n      <td><code>--file &lt;filename&gt;</code></td>\n      <td>Generates a timestamped SQL migration file by diffing your config against your database.</td>\n    </tr>\n    <tr>\n      <td><code>payload migrate</code></td>\n      <td><code>--force</code></td>\n      <td>Executes all unapplied database migrations in an ACID transaction.</td>\n    </tr>\n    <tr>\n      <td><code>payload migrate:down</code></td>\n      <td>None</td>\n      <td>Rolls back the most recently executed migration batch.</td>\n    </tr>\n    <tr>\n      <td><code>payload migrate:status</code></td>\n      <td>None</td>\n      <td>Displays status of all applied vs pending database migrations.</td>\n    </tr>\n    <tr>\n      <td><code>payload graphql:generate-schema</code></td>\n      <td><code>--output &lt;path&gt;</code></td>\n      <td>Exports your entire GraphQL schema to a <code>schema.graphql</code> file for external code generators.</td>\n    </tr>\n  </tbody>\n</table></div>\n\n<h2>Automating Types Generation with package.json Scripts</h2>\n<p>To ensure types are always in sync, add these standard scripts to your <code>package.json</code>:</p>\n\n<div class=\"cb\"><div class=\"fn\">package.json</div><pre><code>{\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"pnpm generate:types && pnpm generate:importmap && next build\",\n    \"generate:types\": \"payload generate:types\",\n    \"generate:importmap\": \"payload generate:importmap\",\n    \"migrate\": \"payload migrate\",\n    \"migrate:create\": \"payload migrate:create\",\n    \"migrate:down\": \"payload migrate:down\"\n  }\n}</code></pre></div>\n\n<h2>Writing Custom Standalone CLI Scripts with tsx</h2>\n<p>You can write custom scripts for data imports, maintenance tasks, and bulk migrations using <code>tsx</code> to run TypeScript scripts directly with full Local API access:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/scripts/seed-products.ts</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\n\nasync function seed() {\n  console.log('🌱 Initializing Payload for standalone script execution...')\n  const payload = await getPayload({ config })\n\n  console.log('Fetching existing products count...')\n  const count = await payload.count({ collection: 'posts' })\n  console.log(`Current count: ${count.totalDocs}`)\n\n  console.log('Creating demo post...')\n  const created = await payload.create({\n    collection: 'posts',\n    data: {\n      title: 'Automated Seed Post',\n      slug: 'automated-seed-post',\n      _status: 'published',\n    },\n    overrideAccess: true, // Run with superadmin privileges in scripts\n  })\n\n  console.log(`✅ Successfully created post ID: ${created.id}`)\n  process.exit(0)\n}\n\nseed().catch((err) => {\n  console.error('❌ Script failed:', err)\n  process.exit(1)\n})</code></pre></div>\n\n<p>Execute your script directly with:</p>\n<div class=\"cb\"><div class=\"fn\">terminal</div><pre><code>npx tsx src/scripts/seed-products.ts</code></pre></div>\n\n<div class=\"tip\">\n  <b>Script Best Practice:</b> In standalone scripts, always call <code>process.exit(0)</code> upon completion; otherwise, database connection pool listeners might keep the Node.js process alive indefinitely in CI/CD runners.\n</div>\n",
    "readingMins": 3
  },
  {
    "id": "admin-tour",
    "m": "Foundations",
    "t": "Touring the admin panel",
    "r": [
      "all"
    ],
    "difficulty": "beginner",
    "tags": [
      "admin",
      "ui",
      "customization"
    ],
    "c": "\n<p class=\"lead\">The admin panel is not a black box you configure in hosted settings — it is generated from your TypeScript config and fully customizable. Knowing your way around it makes every later lesson faster.</p>\n\n<h2>The layout</h2>\n<ul>\n  <li><strong>Nav sidebar</strong> — your collections and globals, grouped with <code>admin.group</code>.</li>\n  <li><strong>List view</strong> — columns from <code>admin.defaultColumns</code>, plus search and pagination.</li>\n  <li><strong>Edit view</strong> — your fields, arranged by tabs, rows and collapsibles.</li>\n  <li><strong>Document drawer</strong> — fields marked <code>admin.position: 'sidebar'</code>.</li>\n  <li><strong>Account &amp; theme</strong> — profile, dark/light mode and the locale switcher.</li>\n</ul>\n\n<h2>Make it yours with admin options</h2>\n<p>Almost every admin option lives under a collection's <code>admin</code> key:</p>\n<div class=\"cb\"><div class=\"fn\">src/collections/Posts.ts</div><pre><code>import type { CollectionConfig } from 'payload'\n\nexport const Posts: CollectionConfig = {\n  slug: 'posts',\n  admin: {\n    useAsTitle: 'title',            // label used in relationships & breadcrumbs\n    defaultColumns: ['title', 'status', 'updatedAt'],\n    group: 'Content',               // sidebar grouping\n    pagination: { defaultLimit: 20 },\n  },\n  fields: [\n    { name: 'title', type: 'text', required: true },\n    { name: 'status', type: 'select', options: ['draft', 'published'] },\n  ],\n}</code></pre></div>\n\n<h2>Live Preview and versions</h2>\n<p>Once a collection enables <code>versions.drafts</code>, the edit view grows a Live Preview pane that streams draft data into your own frontend over <code>postMessage</code>. You will wire that up properly in the Content Features module.</p>\n\n<h2>Your challenge</h2>\n<p>Configure a <code>Posts</code> collection's admin experience: a title field used as the document label, three default list columns, and a sidebar group.</p>\n",
    "readingMins": 4
  },
  {
    "id": "dev-loop",
    "m": "Foundations",
    "t": "The development loop: run, edit, reload",
    "r": [
      "all",
      "devops"
    ],
    "difficulty": "beginner",
    "tags": [
      "workflow",
      "cli",
      "typescript"
    ],
    "c": "\n<p class=\"lead\">Most frustration with any CMS comes from a slow, confusing edit-reload cycle. Payload's is fast and predictable once you know what restarts and what hot-reloads.</p>\n\n<h2>The scripts you will use every day</h2>\n<div class=\"cb\"><div class=\"fn\">package.json</div><pre><code>{\n  \"scripts\": {\n    \"dev\": \"next dev\",\n    \"build\": \"next build\",\n    \"start\": \"next start\",\n    \"generate:types\": \"payload generate:types\"\n  }\n}</code></pre></div>\n\n<h2>What hot-reloads vs. what restarts</h2>\n<ul>\n  <li><strong>Field labels, admin descriptions, React components</strong> — hot-reload instantly.</li>\n  <li><strong>Adding or removing fields and collections</strong> — the dev server re-generates types; a browser refresh picks it up.</li>\n  <li><strong>Schema-meaningful changes</strong> (renaming a field, changing a relationship) — you may need a <strong>migration</strong> so the database matches your config.</li>\n</ul>\n\n<h2>The type loop</h2>\n<p>Payload generates TypeScript types from your config. Run <code>pnpm generate:types</code> whenever the config changes so your imports stay accurate:</p>\n<div class=\"cb\"><div class=\"fn\">using generated types</div><pre><code>import type { Post } from '@/payload-types'\n\nexport function PostCard({ post }: { post: Post }) {\n  return &lt;h3&gt;{post.title}&lt;/h3&gt;\n}</code></pre></div>\n\n<h2>Common hiccups</h2>\n<ul>\n  <li><strong>Cannot find module @payload-config</strong> — check the tsconfig path alias and restart the dev server.</li>\n  <li><strong>Types look stale</strong> — re-run <code>generate:types</code>.</li>\n  <li><strong>Build fails locally but dev works</strong> — run <code>pnpm build</code> to surface type errors the dev server tolerates.</li>\n</ul>\n\n<h2>Your challenge</h2>\n<p>Define the three scripts every Payload project needs: <code>dev</code>, <code>build</code> and <code>generate:types</code>.</p>\n",
    "readingMins": 4
  },
  {
    "id": "config",
    "m": "Core Concepts",
    "t": "The Payload Config",
    "r": [
      "all"
    ],
    "difficulty": "beginner",
    "tags": [
      "config",
      "setup",
      "typescript"
    ],
    "c": "\n<p class=\"lead\">The <code>payload.config.ts</code> file is the master brain of your entire application. It defines database connections, registered collections, globals, authentication rules, plugins, rich text editor presets, and admin panel customization.</p>\n\n<h2>Full Enterprise Configuration Architecture</h2>\n<p>Here is a complete, production-ready Payload config demonstrating all major configuration surfaces:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>import { buildConfig } from 'payload'\nimport { postgresAdapter } from '@payloadcms/db-postgres'\nimport { lexicalEditor } from '@payloadcms/richtext-lexical'\nimport sharp from 'sharp'\nimport path from 'path'\nimport { fileURLToPath } from 'url'\n\n// Collections\nimport { Users } from './collections/Users'\nimport { Posts } from './collections/Posts'\nimport { Media } from './collections/Media'\nimport { Categories } from './collections/Categories'\n\n// Globals\nimport { Header } from './globals/Header'\nimport { SiteSettings } from './globals/SiteSettings'\n\n// Plugins\nimport { seoPlugin } from '@payloadcms/plugin-seo'\n\nconst filename = fileURLToPath(import.meta.url)\nconst dirname = path.dirname(filename)\n\nexport default buildConfig({\n  // 1. Admin Panel UI Configuration\n  admin: {\n    user: Users.slug, // Specifies which collection is used for Admin login\n    meta: {\n      titleSuffix: '– Acme Enterprise CMS',\n      favicon: '/favicon.ico',\n      ogImage: '/og-admin.jpg',\n    },\n    livePreview: {\n      breakpoints: [\n        { label: 'Mobile (iPhone 14)', name: 'mobile', width: 390, height: 844 },\n        { label: 'Tablet (iPad Pro)', name: 'tablet', width: 834, height: 1194 },\n        { label: 'Desktop (4K)', name: 'desktop', width: 1440, height: 900 },\n      ],\n    },\n    dateFormat: 'yyyy-MM-dd HH:mm',\n    components: {\n      // Custom branding & navigation components\n    },\n  },\n\n  // 2. Data Models\n  collections: [Users, Posts, Media, Categories],\n  globals: [Header, SiteSettings],\n\n  // 3. Database Adapter (Postgres + Drizzle)\n  db: postgresAdapter({\n    pool: {\n      connectionString: process.env.DATABASE_URI || '',\n      max: 20, // Connection pool size for high concurrency\n      idleTimeoutMillis: 30000,\n    },\n    push: process.env.NODE_ENV !== 'production', // Auto-sync DB schema in local dev\n  }),\n\n  // 4. Default Rich Text Editor\n  editor: lexicalEditor(),\n\n  // 5. Image Manipulation Library\n  sharp,\n\n  // 6. Security & Encryption\n  secret: process.env.PAYLOAD_SECRET || '',\n  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],\n  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],\n\n  // 7. TypeScript Compilation Target\n  typescript: {\n    outputFile: path.resolve(dirname, 'payload-types.ts'),\n  },\n\n  // 8. Plugin Ecosystem\n  plugins: [\n    seoPlugin({\n      collections: ['posts'],\n      uploadsCollection: 'media',\n      generateTitle: ({ doc }) => `${doc.title} | Acme Tech`,\n      generateDescription: ({ doc }) => doc.excerpt,\n    }),\n  ],\n})</code></pre></div>\n\n<h2>Key Config Options Breakdown</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Option</th><th>Type</th><th>Purpose</th></tr></thead>\n  <tbody>\n    <tr><td><code>admin.user</code></td><td><code>string</code></td><td>The collection slug representing administrative users allowed to log into <code>/admin</code>.</td></tr>\n    <tr><td><code>db</code></td><td><code>DatabaseAdapter</code></td><td>Database engine driver: <code>postgresAdapter</code>, <code>sqliteAdapter</code>, or <code>mongooseAdapter</code>.</td></tr>\n    <tr><td><code>editor</code></td><td><code>RichTextAdapter</code></td><td>Default editor for <code>richText</code> fields. Defaults to <code>lexicalEditor()</code>.</td></tr>\n    <tr><td><code>sharp</code></td><td><code>SharpPackage</code></td><td>Pass the Sharp module directly for automated image resizing, WebP conversion, and thumbnail generation.</td></tr>\n    <tr><td><code>typescript.outputFile</code></td><td><code>string</code></td><td>Absolute file path where generated TypeScript types will be written.</td></tr>\n    <tr><td><code>plugins</code></td><td><code>Plugin[]</code></td><td>Array of composable plugins extending schemas, hooks, or admin panels.</td></tr>\n  </tbody>\n</table></div>\n\n<div class=\"tip\">\n  <b>ESM Import Tip:</b> In Node ESM (standard for Next.js 16), <code>__dirname</code> is not globally available. Use <code>const dirname = path.dirname(fileURLToPath(import.meta.url))</code> to reliably construct absolute file paths for <code>outputFile</code>.\n</div>\n",
    "readingMins": 4
  },
  {
    "id": "collections",
    "m": "Core Concepts",
    "t": "Collections",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "beginner",
    "tags": [
      "collections",
      "schema",
      "crud"
    ],
    "c": "\n<p class=\"lead\">A <strong>Collection</strong> is the core schema primitive in Payload. Defining a collection automatically provisions database tables, REST endpoints, GraphQL types, validation rules, access control, and a full-featured admin UI with pagination and search.</p>\n\n<h2>Complete Collection Specification Example</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Posts.ts</div><pre><code>import type { CollectionConfig } from 'payload'\n\nexport const Posts: CollectionConfig = {\n  // 1. Unique Slug: Identifies the collection, DB table, and /api/posts route\n  slug: 'posts',\n\n  // 2. Admin UI Customization\n  admin: {\n    useAsTitle: 'title', // Field value shown in list views & breadcrumbs\n    defaultColumns: ['title', 'author', 'status', 'publishedAt'],\n    listSearchableFields: ['title', 'slug', 'excerpt'],\n    group: 'Editorial', // Sidebar grouping in Admin Panel\n    pagination: {\n      defaultLimit: 25,\n      limits: [10, 25, 50, 100],\n    },\n  },\n\n  // 3. Document Versioning & Draft Mode\n  versions: {\n    maxPerDoc: 50, // Keep last 50 revisions for rollbacks\n    drafts: {\n      autosave: { interval: 800 }, // Autosave draft edits every 800ms\n      schedulePublish: true,      // Allow scheduling future publish dates\n    },\n  },\n\n  // 4. Access Control\n  access: {\n    read: ({ req: { user } }) => {\n      // Public sees published posts; Authenticated users see all drafts\n      if (user) return true\n      return { _status: { equals: 'published' } }\n    },\n    create: ({ req: { user } }) => Boolean(user),\n    update: ({ req: { user } }) => Boolean(user),\n    delete: ({ req: { user } }) => user?.role === 'admin',\n  },\n\n  // 5. Lifecycle Hooks\n  hooks: {\n    beforeChange: [\n      ({ data, operation }) => {\n        // Automatically generate URL slug from title on create\n        if (data?.title && operation === 'create' && !data.slug) {\n          data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')\n        }\n        return data\n      },\n    ],\n  },\n\n  // 6. Field Definitions\n  fields: [\n    {\n      name: 'title',\n      type: 'text',\n      required: true,\n    },\n    {\n      name: 'slug',\n      type: 'text',\n      unique: true,\n      index: true,\n      admin: { position: 'sidebar' },\n    },\n    {\n      name: 'author',\n      type: 'relationship',\n      relationTo: 'users',\n      defaultValue: ({ user }) => user?.id,\n      admin: { position: 'sidebar' },\n    },\n    {\n      name: 'content',\n      type: 'richText',\n    },\n  ],\n\n  // 7. Automatic Timestamps (createdAt, updatedAt)\n  timestamps: true,\n}</code></pre></div>\n\n<h2>Collection Configuration Properties Reference</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Property</th><th>Type</th><th>Description</th></tr></thead>\n  <tbody>\n    <tr><td><code>slug</code></td><td><code>string</code> (Required)</td><td>Unique alphanumeric identifier. Determines REST path <code>/api/{slug}</code> and DB table name.</td></tr>\n    <tr><td><code>admin.useAsTitle</code></td><td><code>string</code></td><td>Name of the field whose value represents the document in relationship pickers and breadcrumbs.</td></tr>\n    <tr><td><code>admin.group</code></td><td><code>string</code></td><td>Categorizes collections into accordion groups in the admin sidebar navigation.</td></tr>\n    <tr><td><code>versions</code></td><td><code>object | boolean</code></td><td>Enables draft/published state machine, version history, and document restoration.</td></tr>\n    <tr><td><code>access</code></td><td><code>CollectionAccess</code></td><td>Security rules for <code>read</code>, <code>create</code>, <code>update</code>, <code>delete</code>, <code>readVersions</code>.</td></tr>\n    <tr><td><code>hooks</code></td><td><code>CollectionHooks</code></td><td>Lifecycle hooks: <code>beforeChange</code>, <code>afterChange</code>, <code>beforeRead</code>, <code>afterRead</code>, etc.</td></tr>\n    <tr><td><code>indexes</code></td><td><code>Index[]</code></td><td>Custom composite database indices for high-performance multi-column queries.</td></tr>\n  </tbody>\n</table></div>\n",
    "readingMins": 3
  },
  {
    "id": "fields",
    "m": "Core Concepts",
    "t": "Fields deep dive",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "fields",
      "validation",
      "blocks",
      "schema"
    ],
    "c": "\n<p class=\"lead\">Payload provides over 20 built-in field types covering primitive data types, relational schemas, visual layout builders, and advanced virtual fields. Each field supports custom validation, conditional admin visibility, indexing, and access control.</p>\n\n<h2>All Built-in Field Types Overview</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Field Type</th><th>Data Storage Format</th><th>Primary Use Case</th></tr></thead>\n  <tbody>\n    <tr><td><code>text</code> / <code>textarea</code></td><td><code>VARCHAR</code> / <code>TEXT</code></td><td>Single-line titles, slugs, plain text descriptions.</td></tr>\n    <tr><td><code>number</code></td><td><code>NUMERIC</code> / <code>INTEGER</code></td><td>Prices, quantities, ratings with <code>min</code>, <code>max</code> constraints.</td></tr>\n    <tr><td><code>email</code> / <code>date</code></td><td><code>VARCHAR</code> / <code>TIMESTAMP</code></td><td>Validated email addresses and ISO datepicker inputs.</td></tr>\n    <tr><td><code>checkbox</code></td><td><code>BOOLEAN</code></td><td>Binary toggles (e.g. <code>isFeatured</code>, <code>inStock</code>).</td></tr>\n    <tr><td><code>select</code> / <code>radio</code></td><td><code>VARCHAR</code></td><td>Enums with predefined option lists (single or multi-select).</td></tr>\n    <tr><td><code>richText</code></td><td><code>JSON</code> (Lexical AST)</td><td>Full WYSIWYG editorial content with embedded blocks and links.</td></tr>\n    <tr><td><code>upload</code></td><td>Foreign Key ID</td><td>Asset file referencing an upload-enabled collection.</td></tr>\n    <tr><td><code>relationship</code></td><td>Foreign Key(s)</td><td>Relates to one or many documents across collections.</td></tr>\n    <tr><td><code>array</code></td><td>Child Table / JSON</td><td>Repeater containing repeatable subfield groups.</td></tr>\n    <tr><td><code>blocks</code></td><td>Polymorphic JSON</td><td>Dynamic visual page builder containing diverse layout components.</td></tr>\n    <tr><td><code>group</code></td><td>Nested Object / Prefix</td><td>Namespaces fields (e.g. <code>meta.title</code>, <code>meta.description</code>).</td></tr>\n    <tr><td><code>json</code> / <code>code</code></td><td><code>JSONB</code> / <code>TEXT</code></td><td>Raw structured JSON or syntax-highlighted code editor.</td></tr>\n    <tr><td><code>join</code></td><td>Virtual / Relational</td><td>Zero-column reverse relationship querying child records.</td></tr>\n  </tbody>\n</table></div>\n\n<h2>Field Validation &amp; Conditional Display</h2>\n<p>Every field can declare custom server-side validation functions and client-side conditional display rules:</p>\n\n<div class=\"cb\"><div class=\"fn\">Advanced Field Configuration</div><pre><code>{\n  name: 'discountPercentage',\n  type: 'number',\n  min: 0,\n  max: 100,\n  admin: {\n    // Only display this field in Admin UI when onSale checkbox is checked\n    condition: (data, siblingData) => Boolean(siblingData.onSale),\n    description: 'Enter a value between 0 and 100 representing percentage discount',\n    step: 1,\n  },\n  // Server-side validation executed on every create and update\n  validate: async (val, { req, siblingData }) => {\n    if (siblingData.onSale && (val === undefined || val === null)) {\n      return 'Discount percentage is required when product is on sale.'\n    }\n    if (val && val > 90 && req.user?.role !== 'admin') {\n      return 'Discounts over 90% require Admin authorization.'\n    }\n    return true // Return true if valid, or a string error message\n  },\n}</code></pre></div>\n\n<h2>The Blocks Field (Visual Page Builder)</h2>\n<p>The <code>blocks</code> field allows content editors to assemble custom pages out of modular UI components:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/fields/pageBuilder.ts</div><pre><code>import type { Field } from 'payload'\n\nexport const pageBuilderField: Field = {\n  name: 'layout',\n  type: 'blocks',\n  minRows: 1,\n  maxRows: 20,\n  blocks: [\n    // 1. Hero Block\n    {\n      slug: 'hero',\n      labels: { singular: 'Hero Section', plural: 'Hero Sections' },\n      fields: [\n        { name: 'heading', type: 'text', required: true },\n        { name: 'tagline', type: 'textarea' },\n        { name: 'style', type: 'select', options: ['full-bleed', 'split', 'minimal'], defaultValue: 'full-bleed' },\n        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },\n      ],\n    },\n    // 2. Call To Action Block\n    {\n      slug: 'cta',\n      labels: { singular: 'Call to Action', plural: 'Call to Actions' },\n      fields: [\n        { name: 'title', type: 'text', required: true },\n        { name: 'buttonText', type: 'text', required: true },\n        { name: 'buttonLink', type: 'text', required: true },\n        { name: 'theme', type: 'select', options: ['dark', 'accent', 'light'], defaultValue: 'accent' },\n      ],\n    },\n  ],\n}</code></pre></div>\n",
    "readingMins": 4
  },
  {
    "id": "layout",
    "m": "Core Concepts",
    "t": "Tabs, Groups & Layout Fields",
    "r": [
      "all",
      "frontend",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "tabs",
      "groups",
      "admin-ui",
      "ux"
    ],
    "c": "\n<p class=\"lead\">As your CMS schema grows, keeping the editor experience intuitive and ergonomic is vital. Layout fields allow you to visually structure the document editor without cluttering your database schema.</p>\n\n<h2>Named Tabs vs. Unnamed Tabs</h2>\n<p>The <code>tabs</code> field provides horizontal or vertical tab navigation in the editor. Tabs can be <strong>Unnamed</strong> (flattens fields directly into the root document) or <strong>Named</strong> (creates a nested sub-object in your data):</p>\n\n<div class=\"cb\"><div class=\"fn\">src/collections/Pages.ts (Tabs Example)</div><pre><code>{\n  type: 'tabs',\n  tabs: [\n    // 1. UNNAMED TAB: Fields live at doc.title and doc.content\n    {\n      label: 'Main Content',\n      fields: [\n        { name: 'title', type: 'text', required: true },\n        { name: 'content', type: 'richText' },\n      ],\n    },\n    // 2. NAMED TAB: Creates doc.seo.metaTitle, doc.seo.metaDescription\n    {\n      name: 'seo',\n      label: 'SEO & Social Sharing',\n      fields: [\n        { name: 'metaTitle', type: 'text', maxLength: 60 },\n        { name: 'metaDescription', type: 'textarea', maxLength: 160 },\n        { name: 'ogImage', type: 'upload', relationTo: 'media' },\n      ],\n    },\n    // 3. UNNAMED TAB with admin condition\n    {\n      label: 'Developer Settings',\n      admin: {\n        condition: (data, siblingData, { user }) => user?.role === 'admin',\n      },\n      fields: [\n        { name: 'customCss', type: 'code', admin: { language: 'css' } },\n        { name: 'enableCacheBusting', type: 'checkbox', defaultValue: false },\n      ],\n    },\n  ],\n}</code></pre></div>\n\n<h2>Layout Organizers: Rows &amp; Collapsibles</h2>\n<div class=\"cb\"><div class=\"fn\">Rows & Collapsibles Example</div><pre><code>// Displaying two fields side-by-side on 50% width\n{\n  type: 'row',\n  fields: [\n    { name: 'startDate', type: 'date', admin: { width: '50%' } },\n    { name: 'endDate', type: 'date', admin: { width: '50%' } },\n  ],\n},\n\n// Collapsible accordion for optional or advanced settings\n{\n  type: 'collapsible',\n  label: 'Advanced Schema & OpenGraph Customization',\n  admin: {\n    initCollapsed: true, // Closed by default to keep UI clean\n  },\n  fields: [\n    { name: 'canonicalUrl', type: 'text' },\n    { name: 'structuredDataJson', type: 'json' },\n  ],\n}</code></pre></div>\n\n<h2>Sidebar Placement (<code>position: 'sidebar'</code>)</h2>\n<p>Placing metadata fields (status toggles, publish dates, category taxonomy, author relationships) in the inspector sidebar gives content editors a layout identical to Medium or WordPress:</p>\n\n<div class=\"cb\"><div class=\"fn\">Sidebar Fields</div><pre><code>{\n  name: 'status',\n  type: 'select',\n  options: ['draft', 'in-review', 'published'],\n  defaultValue: 'draft',\n  admin: {\n    position: 'sidebar', // Moves field to the right-hand sticky drawer\n  },\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "relationships",
    "m": "Core Concepts",
    "t": "Relationships & population masterclass",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "tags": [
      "relationships",
      "performance",
      "depth",
      "select"
    ],
    "c": "\n<p class=\"lead\">Understanding how relationships, depth, and population work in Payload is critical to building high-performance applications and eliminating N+1 database queries.</p>\n\n<h2>Relationship Cardinality Types</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Cardinality</th><th>Field Configuration</th><th>Database Storage Pattern</th></tr></thead>\n  <tbody>\n    <tr>\n      <td><b>One-to-One</b></td>\n      <td><code>{ name: 'author', type: 'relationship', relationTo: 'users' }</code></td>\n      <td>Stores a single foreign key column (e.g. <code>author_id</code>) in the parent table.</td>\n    </tr>\n    <tr>\n      <td><b>One-to-Many</b></td>\n      <td><code>{ name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true }</code></td>\n      <td>Stores an array of IDs in PostgreSQL/JSON or uses a relational join table.</td>\n    </tr>\n    <tr>\n      <td><b>Polymorphic</b></td>\n      <td><code>{ name: 'parent', type: 'relationship', relationTo: ['posts', 'pages', 'products'] }</code></td>\n      <td>Stores composite relation tuple: <code>{ relationTo: 'posts', value: '123' }</code>.</td>\n    </tr>\n  </tbody>\n</table></div>\n\n<h2>Controlling Population: <code>depth</code> vs. Granular <code>populate</code></h2>\n<p>The <code>depth</code> parameter specifies how many levels of relations Payload automatically fetches:</p>\n\n<div class=\"cb\"><div class=\"fn\">Depth demonstration</div><pre><code>// 1. depth: 0 -> Returns raw foreign key IDs only (Extremely fast, zero joins)\nconst post0 = await payload.findByID({\n  collection: 'posts',\n  id: '101',\n  depth: 0,\n})\n// Result: { id: '101', title: 'Hello', author: 'user-88' }\n\n// 2. depth: 1 -> Resolves immediate 1st-level relations\nconst post1 = await payload.findByID({\n  collection: 'posts',\n  id: '101',\n  depth: 1,\n})\n// Result: { id: '101', title: 'Hello', author: { id: 'user-88', name: 'Alice', email: 'alice@corp.com' } }\n\n// 3. Payload 3.x Granular Field Population with 'select' + 'populate'\nconst optimizedPost = await payload.findByID({\n  collection: 'posts',\n  id: '101',\n  select: {\n    title: true,\n    author: true,\n  },\n  populate: {\n    author: {\n      select: {\n        name: true,\n        email: true, // Only fetch name & email, exclude password hashes and audit fields\n      },\n    },\n  },\n})</code></pre></div>\n\n<h2>The <code>defaultPopulate</code> Optimization</h2>\n<p>Configure <code>defaultPopulate</code> on referenced collections to prevent massive payload over-fetching when documents are populated as relations elsewhere in your system:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/collections/Users.ts</div><pre><code>export const Users: CollectionConfig = {\n  slug: 'users',\n  defaultPopulate: {\n    firstName: true,\n    lastName: true,\n    email: true,\n    avatar: true,\n    // Exclude heavy fields like twoFactorSecret, billingInfo, loginAttempts\n  },\n  fields: [...],\n}</code></pre></div>\n\n<div class=\"warn\">\n  <b>Performance Trap:</b> Never use <code>depth: 5</code> or higher on large collection list queries (<code>payload.find</code>). High depth triggers recursive relational joins that can degrade database response times. Keep list queries at <code>depth: 0</code> or <code>1</code> and fetch deep sub-trees on single document detail pages.\n</div>\n",
    "readingMins": 3
  },
  {
    "id": "globals",
    "m": "Core Concepts",
    "t": "Globals & singletons",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "beginner",
    "tags": [
      "globals",
      "singletons",
      "header",
      "settings"
    ],
    "c": "\n<p class=\"lead\"><strong>Globals</strong> are singleton documents designed for managing application-wide data that only exists once — such as site navigation menus, footer links, company branding, analytics IDs, and SEO defaults.</p>\n\n<h2>Defining a Global Schema</h2>\n<div class=\"cb\"><div class=\"fn\">src/globals/Header.ts</div><pre><code>import type { GlobalConfig } from 'payload'\n\nexport const Header: GlobalConfig = {\n  slug: 'header',\n  label: 'Header Navigation',\n  access: {\n    read: () => true, // Publicly readable by frontend website\n    update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',\n  },\n  fields: [\n    {\n      name: 'logo',\n      type: 'upload',\n      relationTo: 'media',\n      required: true,\n    },\n    {\n      name: 'navItems',\n      type: 'array',\n      maxRows: 8,\n      labels: { singular: 'Navigation Item', plural: 'Navigation Items' },\n      fields: [\n        { name: 'label', type: 'text', required: true },\n        { name: 'link', type: 'text', required: true },\n        { name: 'openInNewTab', type: 'checkbox', defaultValue: false },\n        {\n          name: 'badge',\n          type: 'text',\n          admin: { description: 'Optional pill text like \"New\" or \"Sale\"' },\n        },\n      ],\n    },\n    {\n      name: 'ctaButton',\n      type: 'group',\n      fields: [\n        { name: 'text', type: 'text', defaultValue: 'Get Started' },\n        { name: 'url', type: 'text', defaultValue: '/signup' },\n        { name: 'style', type: 'select', options: ['primary', 'outline', 'ghost'], defaultValue: 'primary' },\n      ],\n    },\n  ],\n}</code></pre></div>\n\n<h2>Fetching &amp; Updating Globals</h2>\n<div class=\"cb\"><div class=\"fn\">src/app/(frontend)/layout.tsx (Next.js Server Component)</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\nimport Image from 'next/image'\nimport Link from 'next/link'\n\nexport default async function PublicLayout({ children }: { children: React.ReactNode }) {\n  const payload = await getPayload({ config })\n\n  // Fetch Header Global with Local API\n  const header = await payload.findGlobal({\n    slug: 'header',\n    depth: 1, // Populates the logo upload media\n  })\n\n  return (\n    &lt;html lang=\"en\"&gt;\n      &lt;body&gt;\n        &lt;header className=\"navbar\"&gt;\n          {typeof header.logo === 'object' &amp;&amp; header.logo?.url &amp;&amp; (\n            &lt;Image src={header.logo.url} alt=\"Logo\" width={140} height={40} priority /&gt;\n          )}\n          &lt;nav&gt;\n            {header.navItems?.map((item, i) => (\n              &lt;Link key={i} href={item.link} target={item.openInNewTab ? '_blank' : undefined}&gt;\n                {item.label}\n              &lt;/Link&gt;\n            ))}\n          &lt;/nav&gt;\n        &lt;/header&gt;\n        &lt;main&gt;{children}&lt;/main&gt;\n      &lt;/body&gt;\n    &lt;/html&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "join",
    "m": "Core Concepts",
    "t": "Join fields & virtual fields",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "join",
      "virtual",
      "relations",
      "performance"
    ],
    "c": "\n<p class=\"lead\">Payload 3.x introduced <strong>Join Fields</strong> and <strong>Virtual Fields</strong> to eliminate manual reverse queries and enable dynamically computed attributes with zero extra database columns.</p>\n\n<h2>1. Join Fields (Reverse Relationships)</h2>\n<p>In traditional databases, if a <code>Post</code> belongs to a <code>Category</code> (storing <code>category: relationship</code>), finding all posts in a category required querying the Posts collection. A <code>join</code> field allows the parent collection (<code>Categories</code>) to declare a bi-directional view of its children:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/collections/Categories.ts</div><pre><code>import type { CollectionConfig } from 'payload'\n\nexport const Categories: CollectionConfig = {\n  slug: 'categories',\n  admin: { useAsTitle: 'name' },\n  fields: [\n    {\n      name: 'name',\n      type: 'text',\n      required: true,\n    },\n    {\n      name: 'slug',\n      type: 'text',\n      unique: true,\n    },\n    // The JOIN field: Zero database columns on 'categories' table!\n    {\n      name: 'posts',\n      type: 'join',\n      collection: 'posts', // Target collection to query\n      on: 'category',      // Field on Posts that references this Category\n      maxDepth: 1,\n    },\n  ],\n}</code></pre></div>\n\n<p>When viewing a Category in the Payload Admin Panel, editors immediately see a paginated, filterable table of all posts linked to that category. In the Local API:</p>\n\n<div class=\"cb\"><div class=\"fn\">Querying Join Fields</div><pre><code>const techCategory = await payload.findByID({\n  collection: 'categories',\n  id: 'cat_tech_10',\n  joins: {\n    posts: {\n      limit: 10,\n      sort: '-createdAt',\n      where: { _status: { equals: 'published' } },\n    },\n  },\n})\n\nconsole.log(techCategory.posts.docs) // Returns the array of published posts!\nconsole.log(techCategory.posts.totalDocs) // Total number of posts in category</code></pre></div>\n\n<h2>2. Virtual Fields (Dynamic Computed Properties)</h2>\n<p>Virtual fields do not exist in database storage. They are calculated on-the-fly during serialization in an <code>afterRead</code> hook:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/collections/Users.ts</div><pre><code>export const Users: CollectionConfig = {\n  slug: 'users',\n  fields: [\n    { name: 'firstName', type: 'text' },\n    { name: 'lastName', type: 'text' },\n    {\n      name: 'fullName',\n      type: 'text',\n      virtual: true, // Informs Payload & Drizzle not to create a DB column\n      admin: { readOnly: true },\n    },\n    {\n      name: 'readingStats',\n      type: 'json',\n      virtual: true,\n    },\n  ],\n  hooks: {\n    afterRead: [\n      async ({ doc, req }) => {\n        // Calculate full name\n        doc.fullName = [doc.firstName, doc.lastName].filter(Boolean).join(' ') || 'Anonymous'\n\n        // Calculate dynamic stats\n        const bookmarksCount = await req.payload.count({\n          collection: 'bookmarks',\n          where: { user: { equals: doc.id } },\n        })\n        doc.readingStats = { totalBookmarks: bookmarksCount.totalDocs }\n\n        return doc\n      },\n    ],\n  },\n}</code></pre></div>\n\n<div class=\"tip\">\n  <b>Filtering Rule:</b> Because Virtual fields are not stored in database columns, you cannot use them in database <code>where</code> query clauses. If you need to filter or sort by a computed value in SQL, calculate it in a <code>beforeChange</code> hook and persist it in a real field.\n</div>\n",
    "readingMins": 3
  },
  {
    "id": "access",
    "m": "Security & Logic",
    "t": "Access Control",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "security",
      "access-control",
      "rbac",
      "permissions"
    ],
    "c": "\n<p class=\"lead\">Access control in Payload is declarative, granular, and executes on every operation across REST, GraphQL, and the Local API. Access functions evaluate at both the <strong>Collection Level</strong> and the <strong>Field Level</strong>, returning either a boolean or a query constraint for Row-Level Security (RLS).</p>\n\n<h2>Boolean vs. Query Constraints (Row-Level Security)</h2>\n<p>An access control function can return:</p>\n<ul>\n  <li><code>true</code>: Grants unconditional access to the requested operation.</li>\n  <li><code>false</code>: Denies access and throws a <code>ForbiddenError</code> (403).</li>\n  <li><code>Where</code> query object: Dynamically constrains the database query so users only read, update, or delete rows matching the predicate.</li>\n</ul>\n\n<div class=\"cb\"><div class=\"fn\">src/access/postsAccess.ts</div><pre><code>import type { Access } from 'payload'\n\n// 1. Read: Public sees published; Authors see their drafts; Admins see all\nexport const canReadPosts: Access = ({ req: { user } }) => {\n  // Unauthenticated visitors only see published documents\n  if (!user) {\n    return {\n      _status: { equals: 'published' },\n    }\n  }\n\n  // Superadmins can see everything\n  if (user.role === 'admin') {\n    return true\n  }\n\n  // Authors can see published posts OR their own drafts\n  return {\n    or: [\n      { _status: { equals: 'published' } },\n      { author: { equals: user.id } },\n    ],\n  }\n}\n\n// 2. Update: Admins can update any; Authors only edit their own posts\nexport const canUpdatePosts: Access = ({ req: { user } }) => {\n  if (!user) return false\n  if (user.role === 'admin') return true\n\n  return {\n    author: { equals: user.id },\n  }\n}</code></pre></div>\n\n<h2>Field-Level Access Control</h2>\n<p>Secure specific sensitive fields within a document (such as internal reviewer notes, customer stripe IDs, or pricing margins):</p>\n\n<div class=\"cb\"><div class=\"fn\">Field-Level Access Example</div><pre><code>{\n  name: 'internalEditorialNotes',\n  type: 'textarea',\n  access: {\n    // Only editors and admins can read this field\n    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',\n    // Only admins can modify this field\n    update: ({ req: { user } }) => user?.role === 'admin',\n  },\n}</code></pre></div>\n\n<h2>The Local API <code>overrideAccess</code> Paradigm</h2>\n<p>By default, the in-process Local API runs with <code>overrideAccess: true</code> for maximum performance in server-side tasks. When executing queries on behalf of a web user in a Server Action or Route Handler, <strong>always pass <code>overrideAccess: false</code></strong>:</p>\n\n<div class=\"cb\"><div class=\"fn\">Local API User Impersonation</div><pre><code>// ⚠️ INSECURE: Bypasses all access control rules\nconst allPosts = await payload.find({ collection: 'posts' })\n\n// ✅ SECURE: Enforces user permissions & row-level security\nconst userPosts = await payload.find({\n  collection: 'posts',\n  overrideAccess: false,\n  user: currentUser, // Contextual user object\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "hooks",
    "m": "Security & Logic",
    "t": "Hooks",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "hooks",
      "lifecycle",
      "automation",
      "side-effects"
    ],
    "c": "\n<p class=\"lead\">Hooks are asynchronous lifecycle functions that intercept CRUD operations at precise stages. They can sanitize incoming data, trigger external side effects (emails, webhooks, search indexing), perform Next.js on-demand cache revalidation, or abort transactions by throwing errors.</p>\n\n<h2>Complete Collection Lifecycle Pipeline</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Hook Name</th><th>Timing &amp; Context</th><th>Can Mutate Data?</th></tr></thead>\n  <tbody>\n    <tr><td><code>beforeValidate</code></td><td>Runs before schema type validation</td><td>✅ Yes (Mutates <code>data</code>)</td></tr>\n    <tr><td><code>beforeChange</code></td><td>After validation, before database write</td><td>✅ Yes (Final mutation window)</td></tr>\n    <tr><td><code>afterChange</code></td><td>Immediately after database write/commit</td><td>❌ No (Receives immutable <code>doc</code>)</td></tr>\n    <tr><td><code>beforeRead</code></td><td>Before querying from database</td><td>❌ No</td></tr>\n    <tr><td><code>afterRead</code></td><td>After DB read, before returning to caller</td><td>✅ Yes (Transforms returned JSON)</td></tr>\n    <tr><td><code>beforeDelete</code></td><td>Before document is removed</td><td>❌ No (Can throw error to abort)</td></tr>\n    <tr><td><code>afterDelete</code></td><td>After document deletion completes</td><td>❌ No</td></tr>\n    <tr><td><code>afterOperation</code></td><td>After entire operation (including relations) finishes</td><td>❌ No</td></tr>\n  </tbody>\n</table></div>\n\n<h2>Example 1: Automated Slugs &amp; Reading Time Calculation</h2>\n<div class=\"cb\"><div class=\"fn\">src/hooks/formatPost.ts</div><pre><code>import type { CollectionBeforeChangeHook } from 'payload'\n\nexport const formatPostHook: CollectionBeforeChangeHook = async ({\n  data,\n  operation,\n  req,\n}) => {\n  // 1. Auto-generate URL slug from title\n  if (data?.title && (operation === 'create' || !data.slug)) {\n    data.slug = data.title\n      .toLowerCase()\n      .trim()\n      .replace(/[^a-z0-9]+/g, '-')\n      .replace(/^-+|-+$/g, '')\n  }\n\n  // 2. Compute reading time from richText content\n  if (data?.content) {\n    const rawText = JSON.stringify(data.content)\n    const wordCount = rawText.split(/\\s+/).length\n    data.readingMins = Math.max(1, Math.round(wordCount / 200))\n  }\n\n  return data\n}</code></pre></div>\n\n<h2>Example 2: Next.js On-Demand Cache Invalidation</h2>\n<div class=\"cb\"><div class=\"fn\">src/hooks/revalidatePost.ts</div><pre><code>import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'\nimport { revalidatePath, revalidateTag } from 'next/cache'\n\nexport const revalidatePostAfterChange: CollectionAfterChangeHook = ({\n  doc,\n  previousDoc,\n  req: { payload, context },\n}) => {\n  // Prevent infinite loops during internal bulk operations\n  if (context?.preventRevalidation) return doc\n\n  // If status is published or was published, purge Next.js ISR cache\n  if (doc._status === 'published' || previousDoc?._status === 'published') {\n    revalidatePath('/blog')\n    revalidatePath(`/blog/${doc.slug}`)\n    revalidateTag('posts-collection')\n  }\n\n  return doc\n}</code></pre></div>\n\n<div class=\"tip\">\n  <b>Passing Context:</b> Use the <code>context</code> parameter (e.g. <code>payload.update({ id, data, context: { preventRevalidation: true } })</code>) to pass transient state flags between nested hooks and prevent duplicate external side effects.\n</div>\n",
    "readingMins": 3
  },
  {
    "id": "auth",
    "m": "Security & Logic",
    "t": "Authentication & users",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "auth",
      "jwt",
      "cookies",
      "sessions"
    ],
    "c": "\n<p class=\"lead\">Adding <code>auth: true</code> (or an authentication configuration object) to any collection transforms it into a full-featured authentication authority with Argon2 password hashing, JWT session management, secure HTTP-only cookies, and automated password reset workflows.</p>\n\n<h2>Configuring an Auth Collection</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Users.ts</div><pre><code>import type { CollectionConfig } from 'payload'\n\nexport const Users: CollectionConfig = {\n  slug: 'users',\n  auth: {\n    tokenExpiration: 86400 * 7,    // 7 days in seconds\n    maxLoginAttempts: 5,           // Locks account after 5 failed attempts\n    lockTime: 15 * 60 * 1000,      // 15-minute lock duration\n    verify: false,                 // Set true for email activation workflow\n    cookies: {\n      secure: process.env.NODE_ENV === 'production',\n      sameSite: 'lax',\n    },\n  },\n  admin: {\n    useAsTitle: 'email',\n    defaultColumns: ['email', 'role', 'createdAt'],\n  },\n  fields: [\n    {\n      name: 'role',\n      type: 'select',\n      defaultValue: 'editor',\n      required: true,\n      options: [\n        { label: 'Administrator', value: 'admin' },\n        { label: 'Editor', value: 'editor' },\n        { label: 'Customer', value: 'customer' },\n      ],\n      access: {\n        // Only admins can elevate user roles\n        update: ({ req: { user } }) => user?.role === 'admin',\n      },\n    },\n  ],\n}</code></pre></div>\n\n<h2>Automated Auth REST Endpoints</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Route</th><th>Method</th><th>Description</th></tr></thead>\n  <tbody>\n    <tr><td><code>/api/users/login</code></td><td>POST</td><td>Authenticates credentials, returns user + JWT, sets HTTP-only session cookie.</td></tr>\n    <tr><td><code>/api/users/logout</code></td><td>POST</td><td>Clears session cookies and invalidates client token.</td></tr>\n    <tr><td><code>/api/users/me</code></td><td>GET</td><td>Returns currently authenticated user profile and token status.</td></tr>\n    <tr><td><code>/api/users/forgot-password</code></td><td>POST</td><td>Generates single-use reset token and emails recovery link.</td></tr>\n    <tr><td><code>/api/users/reset-password</code></td><td>POST</td><td>Updates password with valid reset token.</td></tr>\n    <tr><td><code>/api/users/refresh-token</code></td><td>POST</td><td>Renews expiring JWT without requiring re-entry of password.</td></tr>\n  </tbody>\n</table></div>\n\n<h2>Authenticating in Next.js 16 Server Components</h2>\n<div class=\"cb\"><div class=\"fn\">src/app/(frontend)/dashboard/page.tsx</div><pre><code>import { headers } from 'next/headers'\nimport { redirect } from 'next/navigation'\nimport { getPayload } from 'payload'\nimport config from '@payload-config'\n\nexport default async function DashboardPage() {\n  const payload = await getPayload({ config })\n  \n  // payload.auth() verifies the HTTP-only cookie automatically\n  const { user } = await payload.auth({ headers: await headers() })\n\n  if (!user) {\n    redirect('/login?redirect=/dashboard')\n  }\n\n  return (\n    &lt;div className=\"container\"&gt;\n      &lt;h1&gt;Welcome back, {user.email}&lt;/h1&gt;\n      &lt;p&gt;Role: {user.role}&lt;/p&gt;\n    &lt;/div&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "customauth",
    "m": "Security & Logic",
    "t": "Custom auth strategies & OAuth",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "oauth",
      "sso",
      "github",
      "google",
      "passkeys"
    ],
    "c": "\n<p class=\"lead\">Payload 3.x features a modular <strong>Custom Auth Strategy</strong> architecture allowing you to implement third-party OAuth 2.0 / OpenID Connect (Google, GitHub, Microsoft Azure AD), enterprise SAML/SSO, or passwordless magic links seamlessly.</p>\n\n<h2>OAuth 2.0 Integration Pattern (GitHub Example)</h2>\n<p>Here is the standard Next.js App Router route handler pattern for handling OAuth callbacks and issuing Payload authentication sessions:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/app/api/auth/github/callback/route.ts</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\nimport { NextResponse } from 'next/server'\nimport { cookies } from 'next/headers'\n\nexport async function GET(req: Request) {\n  const { searchParams } = new URL(req.url)\n  const code = searchParams.get('code')\n  \n  if (!code) {\n    return NextResponse.redirect(new URL('/login?error=no_code', req.url))\n  }\n\n  // 1. Exchange authorization code for GitHub access token\n  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {\n    method: 'POST',\n    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },\n    body: JSON.stringify({\n      client_id: process.env.GITHUB_CLIENT_ID,\n      client_secret: process.env.GITHUB_CLIENT_SECRET,\n      code,\n    }),\n  })\n  const tokenData = await tokenRes.json()\n\n  // 2. Retrieve GitHub user profile\n  const userRes = await fetch('https://api.github.com/user', {\n    headers: { Authorization: `Bearer ${tokenData.access_token}` },\n  })\n  const ghUser = await userRes.json()\n\n  const payload = await getPayload({ config })\n\n  // 3. Find or create user in Payload\n  let { docs: [user] } = await payload.find({\n    collection: 'users',\n    where: { email: { equals: ghUser.email } },\n  })\n\n  if (!user) {\n    user = await payload.create({\n      collection: 'users',\n      data: {\n        email: ghUser.email,\n        role: 'editor',\n        password: Math.random().toString(36).slice(-20) + '!A9',\n      },\n    })\n  }\n\n  // 4. Generate Payload session JWT & set HTTP-only cookie\n  const cookieStore = await cookies()\n  const jwt = await payload.login({\n    collection: 'users',\n    data: { email: user.email, password: user.password },\n  })\n\n  return NextResponse.redirect(new URL('/admin', req.url))\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "apikeys",
    "m": "Security & Logic",
    "t": "API Keys & machine auth",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "badge": "new",
    "tags": [
      "api-keys",
      "m2m",
      "microservices",
      "webhooks"
    ],
    "c": "\n<p class=\"lead\">API keys enable headless, machine-to-machine (M2M) authentication without user sessions. They are designed for CI/CD pipelines, sync daemons, background webhooks, and external microservices.</p>\n\n<h2>Enabling API Keys on a Collection</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Users.ts</div><pre><code>export const Users: CollectionConfig = {\n  slug: 'users',\n  auth: {\n    useAPIKey: true,             // Adds API Key generator button to Admin screen\n    disableLocalStrategy: false, // Retains email/password login\n  },\n  fields: [\n    {\n      name: 'role',\n      type: 'select',\n      options: ['admin', 'editor', 'service-account'],\n    },\n  ],\n}</code></pre></div>\n\n<h2>Authenticating with API Keys</h2>\n<p>Pass the API key in the standard <code>Authorization</code> header formatted as <code>&lt;collection-slug&gt; API-Key &lt;key-value&gt;</code>:</p>\n\n<div class=\"cb\"><div class=\"fn\">cURL Request</div><pre><code>curl -X GET https://api.mycompany.com/api/posts \\\n  -H \"Authorization: users API-Key 7b1c38f9-4d2a-4876-9631-01f284e9da42\" \\\n  -H \"Content-Type: application/json\"</code></pre></div>\n\n<div class=\"cb\"><div class=\"fn\">Node.js Fetch Client</div><pre><code>const response = await fetch('https://api.mycompany.com/api/posts', {\n  headers: {\n    Authorization: `users API-Key ${process.env.PAYLOAD_SERVICE_API_KEY}`,\n    'Content-Type': 'application/json',\n  },\n})\nconst { docs } = await response.json()</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "secprod",
    "m": "Security & Logic",
    "t": "Hardening & production security",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "security",
      "production",
      "rate-limiting",
      "csrf",
      "headers"
    ],
    "c": "\n<p class=\"lead\">Hardening a production Payload CMS deployment requires defense-in-depth across the network, application, authentication, and database layers.</p>\n\n<h2>1. Strict CORS &amp; CSRF Whitelisting</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>export default buildConfig({\n  // Strictly specify approved origins (avoid wildcard '*')\n  cors: [\n    'https://www.mywebsite.com',\n    'https://admin.mywebsite.com',\n  ],\n  csrf: [\n    'https://www.mywebsite.com',\n    'https://admin.mywebsite.com',\n  ],\n})</code></pre></div>\n\n<h2>2. Protecting Auth Routes with Next.js Middleware Rate Limiting</h2>\n<p>Prevent credential stuffing and brute-force attacks on <code>/api/users/login</code> using Upstash Redis:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/middleware.ts</div><pre><code>import { NextResponse } from 'next/server'\nimport type { NextRequest } from 'next/server'\nimport { Ratelimit } from '@upstash/ratelimit'\nimport { Redis } from '@upstash/redis'\n\nconst ratelimit = new Ratelimit({\n  redis: Redis.fromEnv(),\n  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 login attempts per minute\n})\n\nexport async function middleware(req: NextRequest) {\n  if (req.nextUrl.pathname.startsWith('/api/users/login')) {\n    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'\n    const { success, limit, remaining, reset } = await ratelimit.limit(ip)\n\n    if (!success) {\n      return new NextResponse(\n        JSON.stringify({ error: 'Too many login attempts. Please wait 1 minute.' }),\n        { status: 429, headers: { 'Content-Type': 'application/json' } }\n      )\n    }\n  }\n  return NextResponse.next()\n}</code></pre></div>\n\n<h2>Production Security Checklist</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Area</th><th>Check</th><th>Mitigation</th></tr></thead>\n  <tbody>\n    <tr><td><b>Secrets</b></td><td>PAYLOAD_SECRET entropy</td><td>Use <code>openssl rand -hex 32</code>; never commit <code>.env</code> to Git.</td></tr>\n    <tr><td><b>Cookies</b></td><td>Secure &amp; SameSite</td><td>Enable <code>cookies.secure: true</code> and <code>cookies.sameSite: 'lax'</code>.</td></tr>\n    <tr><td><b>File Uploads</b></td><td>MIME type validation</td><td>Strictly limit <code>mimeTypes: ['image/*', 'application/pdf']</code>.</td></tr>\n    <tr><td><b>Access Rules</b></td><td>Default denial</td><td>Verify every collection access function checks <code>req.user</code>.</td></tr>\n    <tr><td><b>Database</b></td><td>Connection pooling</td><td>Use SSL mode (<code>sslmode=require</code>) and bounded pool sizes.</td></tr>\n  </tbody>\n</table></div>\n",
    "readingMins": 3
  },
  {
    "id": "uploads",
    "m": "Content Features",
    "t": "Media & uploads",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "media",
      "uploads",
      "images",
      "sharp",
      "s3"
    ],
    "c": "\n<p class=\"lead\">Setting <code>upload: true</code> on any collection transforms it into an asset management library with automated image resizing, focal point cropping, WebP conversion via Sharp, and Cloud Storage integration.</p>\n\n<h2>Configuring an Upload Collection with Responsive Image Sizes</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Media.ts</div><pre><code>import type { CollectionConfig } from 'payload'\n\nexport const Media: CollectionConfig = {\n  slug: 'media',\n  upload: {\n    staticDir: 'media', // Local development folder\n    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],\n    focalPoint: true,   // Interactive focal point UI in Admin\n    crop: true,         // Interactive cropping tool\n    imageSizes: [\n      {\n        name: 'thumbnail',\n        width: 300,\n        height: 300,\n        position: 'centre',\n        formatOptions: { format: 'webp', options: { quality: 80 } },\n      },\n      {\n        name: 'card',\n        width: 768,\n        height: 432,\n        position: 'centre',\n        formatOptions: { format: 'webp', options: { quality: 85 } },\n      },\n      {\n        name: 'hero',\n        width: 1920,\n        height: 1080,\n        position: 'centre',\n        formatOptions: { format: 'webp', options: { quality: 90 } },\n      },\n    ],\n    adminThumbnail: 'thumbnail',\n  },\n  access: {\n    read: () => true, // Publicly viewable\n  },\n  fields: [\n    {\n      name: 'alt',\n      type: 'text',\n      required: true,\n      admin: { description: 'Crucial for accessibility and SEO' },\n    },\n    {\n      name: 'caption',\n      type: 'text',\n    },\n  ],\n}</code></pre></div>\n\n<h2>Rendering Responsive Media with Next.js Image</h2>\n<div class=\"cb\"><div class=\"fn\">src/components/MediaImage.tsx</div><pre><code>import Image from 'next/image'\nimport type { Media } from '@/payload-types'\n\nexport function MediaImage({\n  media,\n  size = 'card',\n  priority = false,\n}: {\n  media: Media | string\n  size?: 'thumbnail' | 'card' | 'hero'\n  priority?: boolean\n}) {\n  if (typeof media === 'string' || !media?.url) return null\n\n  const targetSize = media.sizes?.[size]\n  const imageSrc = targetSize?.url || media.url\n  const width = targetSize?.width || media.width || 800\n  const height = targetSize?.height || media.height || 600\n\n  return (\n    &lt;Image\n      src={imageSrc}\n      alt={media.alt || ''}\n      width={width}\n      height={height}\n      priority={priority}\n      sizes=\"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw\"\n    /&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "drafts",
    "m": "Content Features",
    "t": "Drafts, versions & live preview",
    "r": [
      "all"
    ],
    "difficulty": "advanced",
    "tags": [
      "drafts",
      "versions",
      "live-preview",
      "autosave"
    ],
    "c": "\n<p class=\"lead\">Payload provides enterprise-grade content staging: document versioning with rollback history, draft workflows, autosaving, scheduled publishing, and real-time Live Preview embedded directly within the admin editor.</p>\n\n<h2>Enabling Drafts &amp; Autosave</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Posts.ts</div><pre><code>export const Posts: CollectionConfig = {\n  slug: 'posts',\n  versions: {\n    maxPerDoc: 50, // Keep last 50 historical snapshots\n    drafts: {\n      autosave: { interval: 800 }, // Automatically save drafts every 800ms\n      schedulePublish: true,      // Future scheduled publishing\n    },\n  },\n  fields: [...],\n}</code></pre></div>\n\n<h2>Configuring Real-Time Live Preview</h2>\n<p>Live Preview embeds an iframe of your actual Next.js frontend into the document editor and broadcasts live draft state changes over <code>window.postMessage</code>:</p>\n\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>export default buildConfig({\n  admin: {\n    livePreview: {\n      url: ({ data, collectionConfig }) => {\n        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'\n        return `${baseUrl}/${collectionConfig.slug}/${data.slug}?preview=true`\n      },\n      breakpoints: [\n        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },\n        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },\n        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },\n      ],\n      collections: ['posts', 'pages'],\n    },\n  },\n})</code></pre></div>\n\n<h2>Subscribing on the Frontend with <code>useLivePreview</code></h2>\n<div class=\"cb\"><div class=\"fn\">src/app/(frontend)/blog/[slug]/PostClient.tsx</div><pre><code>'use client'\nimport { useLivePreview } from '@payloadcms/live-preview-react'\nimport type { Post } from '@/payload-types'\n\nexport function PostClient({ initialPost }: { initialPost: Post }) {\n  // Automatically syncs form state from Payload Admin iframe\n  const { data: post } = useLivePreview<Post>({\n    initialData: initialPost,\n    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',\n    depth: 2,\n  })\n\n  return (\n    &lt;article className=\"prose max-w-3xl mx-auto\"&gt;\n      &lt;h1&gt;{post.title}&lt;/h1&gt;\n      {post._status === 'draft' &amp;&amp; (\n        &lt;div className=\"badge badge-warning\"&gt;Preview Mode (Draft)&lt;/div&gt;\n      )}\n    &lt;/article&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "richtext",
    "m": "Content Features",
    "t": "Rich text with Lexical",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "intermediate",
    "badge": "new",
    "tags": [
      "richtext",
      "lexical",
      "editor",
      "ast",
      "wysiwyg"
    ],
    "c": "\n<p class=\"lead\">Payload 3.x uses <strong>Lexical</strong> (Meta's modern, extensible rich text engine) by default. Content is stored as a structured JSON Abstract Syntax Tree (AST), making it type-safe, headless, and ready for custom inline blocks.</p>\n\n<h2>Configuring the Lexical Editor</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Posts.ts</div><pre><code>import { lexicalEditor, HeadingFeature, LinkFeature, UploadFeature, BlocksFeature } from '@payloadcms/richtext-lexical'\n\nexport const Posts: CollectionConfig = {\n  slug: 'posts',\n  fields: [\n    {\n      name: 'content',\n      type: 'richText',\n      editor: lexicalEditor({\n        features: ({ defaultFeatures }) => [\n          ...defaultFeatures,\n          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),\n          LinkFeature({\n            fields: [\n              { name: 'rel', type: 'select', options: ['nofollow', 'sponsored'] },\n            ],\n          }),\n          UploadFeature({\n            collections: {\n              media: {\n                fields: [{ name: 'caption', type: 'text' }],\n              },\n            },\n          }),\n          BlocksFeature({\n            blocks: [\n              // Embed custom React UI blocks inside editorial copy!\n            ],\n          }),\n        ],\n      }),\n    },\n  ],\n}</code></pre></div>\n\n<h2>Rendering Lexical Content in Next.js Server Components</h2>\n<div class=\"cb\"><div class=\"fn\">src/app/(frontend)/blog/[slug]/page.tsx</div><pre><code>import { RichText } from '@payloadcms/richtext-lexical/react'\n\nexport default async function SinglePost({ post }) {\n  return (\n    &lt;article className=\"prose\"&gt;\n      &lt;RichText data={post.content} /&gt;\n    &lt;/article&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "nesteddocs",
    "m": "Content Features",
    "t": "Nested documents & tree structures",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "nested-docs",
      "tree",
      "breadcrumbs",
      "hierarchy"
    ],
    "c": "\n<p class=\"lead\">Hierarchical content structures (such as nested documentation pages, multi-level category trees, and breadcrumb trails) are seamlessly managed using the official <code>@payloadcms/plugin-nested-docs</code> plugin.</p>\n\n<h2>Configuring the Nested Docs Plugin</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'\n\nexport default buildConfig({\n  plugins: [\n    nestedDocsPlugin({\n      collections: ['pages', 'categories'],\n      generateLabel: (_, doc) => doc.title as string,\n      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),\n    }),\n  ],\n})</code></pre></div>\n\n<p>The plugin automatically injects a <code>parent</code> relationship field and auto-computes a <code>breadcrumbs</code> array on every document update:</p>\n\n<div class=\"cb\"><div class=\"fn\">Breadcrumbs Data Shape</div><pre><code>{\n  \"title\": \"Authentication Strategies\",\n  \"slug\": \"auth-strategies\",\n  \"breadcrumbs\": [\n    { \"label\": \"Documentation\", \"url\": \"/docs\" },\n    { \"label\": \"Security\", \"url\": \"/docs/security\" },\n    { \"label\": \"Authentication Strategies\", \"url\": \"/docs/security/auth-strategies\" }\n  ]\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "api",
    "m": "Using the Data",
    "t": "Local API, REST & GraphQL",
    "r": [
      "all",
      "frontend",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "local-api",
      "rest",
      "graphql",
      "crud"
    ],
    "c": "\n<p class=\"lead\">Payload provides three distinct, fully typed API paradigms from a single configuration file: the zero-latency <strong>Local API</strong>, standard <strong>REST API</strong>, and an auto-generated <strong>GraphQL API</strong>.</p>\n\n<h2>1. The Local API (Server-Side, Zero Network Overhead)</h2>\n<p>The Local API interacts directly with your database drivers within Node.js, Next.js Server Components, and Server Actions without making any internal HTTP requests.</p>\n\n<div class=\"cb\"><div class=\"fn\">Local API Operations</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\n\nconst payload = await getPayload({ config })\n\n// 1. Find with filtering, sorting, and pagination\nconst posts = await payload.find({\n  collection: 'posts',\n  where: {\n    _status: { equals: 'published' },\n  },\n  sort: '-createdAt',\n  limit: 10,\n  page: 1,\n  depth: 1, // Populates 1st-level relations (e.g. author, media)\n})\n\n// 2. Find by ID\nconst singlePost = await payload.findByID({\n  collection: 'posts',\n  id: 'doc_123',\n})\n\n// 3. Create document\nconst newPost = await payload.create({\n  collection: 'posts',\n  data: {\n    title: 'Announcing v3.0',\n    slug: 'announcing-v3',\n    _status: 'published',\n  },\n})\n\n// 4. Update document\nconst updated = await payload.update({\n  collection: 'posts',\n  id: 'doc_123',\n  data: {\n    title: 'Updated Title',\n  },\n})\n\n// 5. Delete document\nawait payload.delete({\n  collection: 'posts',\n  id: 'doc_123',\n})</code></pre></div>\n\n<h2>2. The REST API</h2>\n<p>Payload automatically mounts standard REST endpoints for every collection and global at <code>/api/{collection-slug}</code>:</p>\n\n<div class=\"tbl\"><table>\n  <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>\n  <tbody>\n    <tr><td><code>GET</code></td><td><code>/api/posts?where[status][equals]=published&amp;limit=10</code></td><td>Query documents with filtering and pagination.</td></tr>\n    <tr><td><code>GET</code></td><td><code>/api/posts/:id</code></td><td>Retrieve a single document by its ID.</td></tr>\n    <tr><td><code>POST</code></td><td><code>/api/posts</code></td><td>Create a new document.</td></tr>\n    <tr><td><code>PATCH</code></td><td><code>/api/posts/:id</code></td><td>Update specific fields of a document.</td></tr>\n    <tr><td><code>DELETE</code></td><td><code>/api/posts/:id</code></td><td>Delete a single document.</td></tr>\n  </tbody>\n</table></div>\n\n<h2>3. The GraphQL API</h2>\n<p>Payload automatically generates a full GraphQL schema at <code>/api/graphql</code> with complex queries, mutations, and pagination out-of-the-box:</p>\n\n<div class=\"cb\"><div class=\"fn\">GraphQL Query Example</div><pre><code>query FetchPublishedPosts {\n  Posts(where: { _status: { equals: published } }, limit: 5, sort: \"-createdAt\") {\n    docs {\n      id\n      title\n      slug\n      author {\n        name\n        email\n      }\n    }\n    totalDocs\n    hasNextPage\n  }\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "queries",
    "m": "Using the Data",
    "t": "Query operators & pagination",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "queries",
      "operators",
      "where",
      "pagination",
      "search"
    ],
    "c": "\n<p class=\"lead\">Payload features a rich, declarative query language for filtering, full-text searching, sorting, and paginating data across all supported database adapters.</p>\n\n<h2>All Supported WHERE Query Operators</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Operator</th><th>SQL Equivalent</th><th>Example Usage</th></tr></thead>\n  <tbody>\n    <tr><td><code>equals</code></td><td><code>=</code></td><td><code>{ status: { equals: 'published' } }</code></td></tr>\n    <tr><td><code>not_equals</code></td><td><code>!=</code></td><td><code>{ role: { not_equals: 'admin' } }</code></td></tr>\n    <tr><td><code>in</code></td><td><code>IN (...)</code></td><td><code>{ category: { in: ['news', 'tech'] } }</code></td></tr>\n    <tr><td><code>not_in</code></td><td><code>NOT IN (...)</code></td><td><code>{ id: { not_in: [1, 2, 3] } }</code></td></tr>\n    <tr><td><code>greater_than</code></td><td><code>&gt;</code></td><td><code>{ price: { greater_than: 50 } }</code></td></tr>\n    <tr><td><code>less_than_equal</code></td><td><code>&lt;=</code></td><td><code>{ stock: { less_than_equal: 0 } }</code></td></tr>\n    <tr><td><code>like</code></td><td><code>ILIKE '%term%'</code></td><td><code>{ title: { like: 'payload' } }</code> (Case-insensitive)</td></tr>\n    <tr><td><code>contains</code></td><td><code>ILIKE '%term%'</code></td><td><code>{ description: { contains: 'framework' } }</code></td></tr>\n    <tr><td><code>exists</code></td><td><code>IS NOT NULL</code></td><td><code>{ publishedAt: { exists: true } }</code></td></tr>\n  </tbody>\n</table></div>\n\n<h2>Complex Compound Queries (AND / OR)</h2>\n<div class=\"cb\"><div class=\"fn\">Compound Query Example</div><pre><code>const activeDeals = await payload.find({\n  collection: 'products',\n  where: {\n    and: [\n      { inStock: { equals: true } },\n      {\n        or: [\n          { onSale: { equals: true } },\n          { price: { less_than: 25 } },\n        ],\n      },\n    ],\n  },\n  sort: '-price', // Sort descending by price\n  limit: 20,\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "actions",
    "m": "Using the Data",
    "t": "Next.js Server Actions & mutations",
    "r": [
      "all",
      "frontend",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "server-actions",
      "nextjs",
      "mutations",
      "forms"
    ],
    "c": "\n<p class=\"lead\">Next.js 16 Server Actions paired with Payload's in-process Local API offer the fastest, most secure method for mutating data from client forms without creating dedicated REST boilerplate.</p>\n\n<h2>Creating a Type-Safe Server Action</h2>\n<div class=\"cb\"><div class=\"fn\">src/actions/submitNewsletter.ts</div><pre><code>'use server'\nimport { getPayload } from 'payload'\nimport config from '@payload-config'\nimport { revalidatePath } from 'next/cache'\n\nexport async function submitNewsletter(formData: FormData) {\n  const email = formData.get('email') as string\n\n  if (!email || !email.includes('@')) {\n    return { success: false, error: 'Please enter a valid email address.' }\n  }\n\n  const payload = await getPayload({ config })\n\n  try {\n    await payload.create({\n      collection: 'subscribers',\n      data: {\n        email: email.trim().toLowerCase(),\n        source: 'homepage_footer',\n        subscribedAt: new Date().toISOString(),\n      },\n    })\n\n    revalidatePath('/')\n    return { success: true }\n  } catch (error: any) {\n    if (error?.message?.includes('duplicate')) {\n      return { success: false, error: 'You are already subscribed!' }\n    }\n    return { success: false, error: 'Failed to subscribe. Please try again.' }\n  }\n}</code></pre></div>\n\n<h2>Consuming the Server Action in a Client Form</h2>\n<div class=\"cb\"><div class=\"fn\">src/components/NewsletterForm.tsx</div><pre><code>'use client'\nimport { useTransition, useState } from 'react'\nimport { submitNewsletter } from '@/actions/submitNewsletter'\n\nexport function NewsletterForm() {\n  const [isPending, startTransition] = useTransition()\n  const [message, setMessage] = useState&lt;string | null&gt;(null)\n\n  const handleSubmit = (e: React.FormEvent&lt;HTMLFormElement&gt;) => {\n    e.preventDefault()\n    const form = e.currentTarget\n    const formData = new FormData(form)\n\n    startTransition(async () => {\n      const result = await submitNewsletter(formData)\n      if (result.success) {\n        setMessage('🎉 Thank you for subscribing!')\n        form.reset()\n      } else {\n        setMessage(`⚠️ ${result.error}`)\n      }\n    })\n  }\n\n  return (\n    &lt;form onSubmit={handleSubmit} className=\"flex gap-2\"&gt;\n      &lt;input type=\"email\" name=\"email\" required placeholder=\"name@domain.com\" /&gt;\n      &lt;button type=\"submit\" disabled={isPending}&gt;\n        {isPending ? 'Subscribing...' : 'Subscribe'}\n      &lt;/button&gt;\n      {message &amp;&amp; &lt;p&gt;{message}&lt;/p&gt;}\n    &lt;/form&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "frontend",
    "m": "Using the Data",
    "t": "Rendering in Next.js Server Components",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "beginner",
    "tags": [
      "rsc",
      "nextjs",
      "server-components",
      "seo",
      "ssr"
    ],
    "c": "\n<p class=\"lead\">React Server Components (RSC) allow you to fetch data directly inside your UI components at render time with zero client JavaScript overhead, instant SEO indexing, and blazing-fast Initial Page Load times.</p>\n\n<h2>Complete Server Component Page Example</h2>\n<div class=\"cb\"><div class=\"fn\">src/app/(frontend)/blog/page.tsx</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\nimport Link from 'next/link'\nimport Image from 'next/image'\nimport type { Metadata } from 'next'\n\nexport const metadata: Metadata = {\n  title: 'Insights & Engineering Blog | Acme Tech',\n  description: 'Deep dives into modern fullstack architecture and Payload CMS.',\n}\n\nexport default async function BlogListingPage({\n  searchParams,\n}: {\n  searchParams: Promise<{ page?: string; category?: string }>\n}) {\n  const { page = '1', category } = await searchParams\n  const payload = await getPayload({ config })\n\n  // Construct dynamic query\n  const where: any = {\n    _status: { equals: 'published' },\n  }\n  if (category) {\n    where['category.slug'] = { equals: category }\n  }\n\n  const posts = await payload.find({\n    collection: 'posts',\n    where,\n    sort: '-createdAt',\n    limit: 9,\n    page: parseInt(page, 10),\n    depth: 1, // Populates coverImage and author\n  })\n\n  return (\n    &lt;main className=\"container mx-auto py-12\"&gt;\n      &lt;h1 className=\"text-4xl font-bold mb-8\"&gt;Engineering Blog&lt;/h1&gt;\n      &lt;div className=\"grid grid-cols-1 md:grid-cols-3 gap-8\"&gt;\n        {posts.docs.map((post) => (\n          &lt;article key={post.id} className=\"card shadow rounded-lg overflow-hidden\"&gt;\n            {typeof post.coverImage === 'object' &amp;&amp; post.coverImage?.url &amp;&amp; (\n              &lt;Image\n                src={post.coverImage.url}\n                alt={post.coverImage.alt || post.title}\n                width={600}\n                height={340}\n                className=\"w-full h-48 object-cover\"\n              /&gt;\n            )}\n            &lt;div className=\"p-6\"&gt;\n              &lt;h2 className=\"text-xl font-semibold mb-2\"&gt;\n                &lt;Link href={`/blog/${post.slug}`}&gt;{post.title}&lt;/Link&gt;\n              &lt;/h2&gt;\n              &lt;p className=\"text-gray-600 line-clamp-3\"&gt;{post.excerpt}&lt;/p&gt;\n            &lt;/div&gt;\n          &lt;/article&gt;\n        ))}\n      &lt;/div&gt;\n    &lt;/main&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "seeding",
    "m": "Using the Data",
    "t": "Data seeding & programmatic creation",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "intermediate",
    "badge": "new",
    "tags": [
      "seeding",
      "fixtures",
      "faker",
      "demo-data"
    ],
    "c": "\n<p class=\"lead\">Programmatic data seeding ensures reproducible environments across local development, continuous integration (CI) tests, and staging review deployments.</p>\n\n<h2>Writing a Comprehensive Seed Script</h2>\n<div class=\"cb\"><div class=\"fn\">src/scripts/seed.ts</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\n\nasync function seedDatabase() {\n  const payload = await getPayload({ config })\n  console.log('🌱 Clearing existing collections...')\n\n  // Clean existing demo data\n  await payload.delete({ collection: 'posts', where: { id: { exists: true } } })\n  await payload.delete({ collection: 'categories', where: { id: { exists: true } } })\n\n  console.log('📦 Seeding categories...')\n  const techCat = await payload.create({\n    collection: 'categories',\n    data: { name: 'Technology', slug: 'tech' },\n  })\n  const designCat = await payload.create({\n    collection: 'categories',\n    data: { name: 'Design & UI', slug: 'design' },\n  })\n\n  console.log('📝 Seeding published posts...')\n  for (let i = 1; i &lt;= 10; i++) {\n    await payload.create({\n      collection: 'posts',\n      data: {\n        title: `Mastering Fullstack Engineering Part ${i}`,\n        slug: `mastering-fullstack-part-${i}`,\n        category: i % 2 === 0 ? techCat.id : designCat.id,\n        _status: 'published',\n      },\n    })\n  }\n\n  console.log('✅ Database successfully seeded!')\n  process.exit(0)\n}\n\nseedDatabase().catch((e) => {\n  console.error(e)\n  process.exit(1)\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "admin",
    "m": "Admin UI & Customization",
    "t": "Admin panel customization & branding",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "beginner",
    "tags": [
      "admin",
      "branding",
      "logo",
      "favicon",
      "nav"
    ],
    "c": "\n<p class=\"lead\">The Payload Admin Panel is fully brandable and customizable. You can replace logos, inject custom dashboard widgets, modify navigation links, and adjust metadata without touching core engine internals.</p>\n\n<h2>Configuring Admin Branding</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>export default buildConfig({\n  admin: {\n    meta: {\n      titleSuffix: '– TechCorp Enterprise Suite',\n      favicon: '/favicon.ico',\n      ogImage: '/admin-og.png',\n    },\n    components: {\n      graphics: {\n        Logo: '@/components/admin/CustomLogo',\n        Icon: '@/components/admin/CustomIcon',\n      },\n      beforeDashboard: ['@/components/admin/WelcomeBanner'],\n      afterNavLinks: ['@/components/admin/SupportWidget'],\n    },\n  },\n})</code></pre></div>\n\n<h2>Custom Branding Server Component</h2>\n<div class=\"cb\"><div class=\"fn\">src/components/admin/CustomLogo.tsx</div><pre><code>import Image from 'next/image'\n\nexport default function CustomLogo() {\n  return (\n    &lt;div className=\"flex items-center gap-3 py-2\"&gt;\n      &lt;Image src=\"/logo.svg\" alt=\"TechCorp Logo\" width={32} height={32} /&gt;\n      &lt;span className=\"font-bold text-lg tracking-tight\"&gt;TechCorp CMS&lt;/span&gt;\n    &lt;/div&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "customui",
    "m": "Admin UI & Customization",
    "t": "Custom React components in Admin",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "react",
      "components",
      "admin-ui",
      "importmap",
      "client-components"
    ],
    "c": "\n<p class=\"lead\">In Payload 3.x, you can inject custom React Server and Client Components into any field, cell view, header, or dashboard widget using string component paths that are compiled into the <code>importMap.js</code>.</p>\n\n<h2>Custom Field Component Example</h2>\n<div class=\"cb\"><div class=\"fn\">src/components/admin/ColorPickerField.tsx</div><pre><code>'use client'\nimport React from 'react'\nimport { useField } from '@payloadcms/ui'\n\nexport default function ColorPickerField({ path }: { path: string }) {\n  const { value, setValue } = useField&lt;string&gt;({ path })\n\n  return (\n    &lt;div className=\"field-type\"&gt;\n      &lt;label className=\"field-label\"&gt;Brand Accent Color&lt;/label&gt;\n      &lt;div className=\"flex items-center gap-3\"&gt;\n        &lt;input\n          type=\"color\"\n          value={value || '#6366f1'}\n          onChange={(e) => setValue(e.target.value)}\n          className=\"w-12 h-10 cursor-pointer rounded border\"\n        /&gt;\n        &lt;span className=\"font-mono text-sm uppercase\"&gt;{value || '#6366f1'}&lt;/span&gt;\n      &lt;/div&gt;\n    &lt;/div&gt;\n  )\n}</code></pre></div>\n\n<h2>Registering in Collection Field Schema</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Themes.ts</div><pre><code>export const Themes: CollectionConfig = {\n  slug: 'themes',\n  fields: [\n    {\n      name: 'accentColor',\n      type: 'text',\n      admin: {\n        components: {\n          Field: '@/components/admin/ColorPickerField',\n        },\n      },\n    },\n  ],\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "theming",
    "m": "Admin UI & Customization",
    "t": "CSS Variables & custom theming",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "css",
      "theme",
      "dark-mode",
      "variables"
    ],
    "c": "\n<p class=\"lead\">Payload's admin theme uses a structured design system powered by CSS custom properties. You can inject custom styles to alter colors, typography, borders, and dark/light modes.</p>\n\n<h2>Custom Admin CSS Theme</h2>\n<div class=\"cb\"><div class=\"fn\">src/styles/custom-admin.css</div><pre><code>[data-theme='dark'] {\n  --theme-bg: #09090b;\n  --theme-elevation-50: #18181b;\n  --theme-elevation-100: #27272a;\n  --theme-elevation-200: #3f3f46;\n  --theme-success-500: #10b981;\n  --theme-warning-500: #f59e0b;\n  --theme-error-500: #ef4444;\n}\n\n[data-theme='light'] {\n  --theme-bg: #f8fafc;\n  --theme-elevation-50: #ffffff;\n  --theme-elevation-100: #f1f5f9;\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "whitelabel",
    "m": "Admin UI & Customization",
    "t": "White-labeling & bespoke dashboard",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "intermediate",
    "badge": "new",
    "tags": [
      "whitelabel",
      "client-portal",
      "custom-dashboard"
    ],
    "c": "\n<p class=\"lead\">Deliver a tailored, agency-grade administrative portal for non-technical enterprise clients by replacing default welcome screens with bespoke KPI dashboards and help centers.</p>\n\n<h2>Custom Dashboard Analytics Component</h2>\n<div class=\"cb\"><div class=\"fn\">src/components/admin/CustomDashboard.tsx</div><pre><code>import React from 'react'\nimport { getPayload } from 'payload'\nimport config from '@payload-config'\n\nexport default async function CustomDashboard() {\n  const payload = await getPayload({ config })\n  const postsCount = await payload.count({ collection: 'posts' })\n  const usersCount = await payload.count({ collection: 'users' })\n\n  return (\n    &lt;div className=\"p-8 max-w-6xl mx-auto\"&gt;\n      &lt;h1 className=\"text-3xl font-bold mb-2\"&gt;Editorial Command Center&lt;/h1&gt;\n      &lt;p className=\"text-gray-500 mb-8\"&gt;Real-time publishing analytics and system status.&lt;/p&gt;\n      \n      &lt;div className=\"grid grid-cols-1 md:grid-cols-2 gap-6\"&gt;\n        &lt;div className=\"card bg-zinc-900 border border-zinc-800 p-6 rounded-xl\"&gt;\n          &lt;div className=\"text-sm text-zinc-400\"&gt;Total Articles Published&lt;/div&gt;\n          &lt;div className=\"text-4xl font-extrabold mt-2 text-indigo-400\"&gt;{postsCount.totalDocs}&lt;/div&gt;\n        &lt;/div&gt;\n        &lt;div className=\"card bg-zinc-900 border border-zinc-800 p-6 rounded-xl\"&gt;\n          &lt;div className=\"text-sm text-zinc-400\"&gt;Active Authors &amp; Editors&lt;/div&gt;\n          &lt;div className=\"text-4xl font-extrabold mt-2 text-emerald-400\"&gt;{usersCount.totalDocs}&lt;/div&gt;\n        &lt;/div&gt;\n      &lt;/div&gt;\n    &lt;/div&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "webhooks",
    "m": "Advanced Architecture",
    "t": "Outgoing webhooks & integrations",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "webhooks",
      "integrations",
      "discord",
      "slack",
      "zapier"
    ],
    "c": "\n<p class=\"lead\">Outgoing webhooks allow your Payload CMS instance to notify external services (Slack, Discord, Zapier, search indexing pipelines, build triggers) in real-time whenever content changes occur.</p>\n\n<h2>Building a Generic Webhook Dispatcher Hook</h2>\n<div class=\"cb\"><div class=\"fn\">src/hooks/dispatchWebhook.ts</div><pre><code>import type { CollectionAfterChangeHook } from 'payload'\n\nexport const dispatchWebhook: CollectionAfterChangeHook = async ({\n  doc,\n  previousDoc,\n  operation,\n  collection,\n}) => {\n  const webhookUrl = process.env.EXTERNAL_WEBHOOK_URL\n  if (!webhookUrl) return doc\n\n  const payloadBody = {\n    event: `${collection.slug}.${operation}`,\n    timestamp: new Date().toISOString(),\n    id: doc.id,\n    data: doc,\n    changes: operation === 'update' ? { previous: previousDoc } : undefined,\n  }\n\n  // Fire and forget (or pass through background job queue for guaranteed delivery)\n  fetch(webhookUrl, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'X-Webhook-Secret': process.env.WEBHOOK_SIGNING_SECRET || '',\n    },\n    body: JSON.stringify(payloadBody),\n  }).catch((err) => console.error('Webhook dispatch failed:', err))\n\n  return doc\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "transactions",
    "m": "Advanced Architecture",
    "t": "Database transactions & concurrency",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "transactions",
      "acid",
      "postgres",
      "concurrency",
      "rollback"
    ],
    "c": "\n<p class=\"lead\">Payload natively supports ACID database transactions across PostgreSQL, SQLite, and MongoDB. Transactions guarantee that complex, multi-step operations either succeed completely or roll back entirely with zero data corruption.</p>\n\n<h2>Executing an Atomic Multi-Collection Transaction</h2>\n<div class=\"cb\"><div class=\"fn\">src/actions/transferCredits.ts</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\n\nexport async function transferCredits(senderId: string, recipientId: string, amount: number) {\n  const payload = await getPayload({ config })\n  \n  // 1. Begin database transaction\n  const req = await payload.db.beginTransaction()\n\n  try {\n    // 2. Deduct from sender\n    const sender = await payload.findByID({ collection: 'users', id: senderId, req })\n    if ((sender.credits || 0) < amount) {\n      throw new Error('Insufficient balance.')\n    }\n\n    await payload.update({\n      collection: 'users',\n      id: senderId,\n      data: { credits: (sender.credits || 0) - amount },\n      req, // Must pass req to bind to the active transaction!\n    })\n\n    // 3. Credit recipient\n    const recipient = await payload.findByID({ collection: 'users', id: recipientId, req })\n    await payload.update({\n      collection: 'users',\n      id: recipientId,\n      data: { credits: (recipient.credits || 0) + amount },\n      req,\n    })\n\n    // 4. Log audit ledger\n    await payload.create({\n      collection: 'ledger',\n      data: { from: senderId, to: recipientId, amount, timestamp: new Date().toISOString() },\n      req,\n    })\n\n    // 5. Commit all changes\n    await payload.db.commitTransaction(req.transactionID)\n    return { success: true }\n  } catch (error) {\n    // 6. Roll back everything on any error\n    await payload.db.rollbackTransaction(req.transactionID)\n    throw error\n  }\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "jobs",
    "m": "Advanced Architecture",
    "t": "Background jobs & queues",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "jobs",
      "queues",
      "cron",
      "background-tasks",
      "workers"
    ],
    "c": "\n<p class=\"lead\">Payload features a built-in, database-backed background Jobs Queue designed for executing heavy async tasks (transcoding videos, generating AI vector embeddings, syncing CRM contacts, sending batch newsletters) without blocking user requests.</p>\n\n<h2>Configuring Jobs in Payload</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>export default buildConfig({\n  jobs: {\n    tasks: [\n      {\n        slug: 'generateAiSummary',\n        inputSchema: [\n          { name: 'postId', type: 'text', required: true },\n        ],\n        handler: async ({ input, req }) => {\n          const post = await req.payload.findByID({\n            collection: 'posts',\n            id: input.postId,\n          })\n          // Run long AI generation task...\n          return { output: { status: 'completed' } }\n        },\n      },\n    ],\n    autoRun: [\n      {\n        cron: '* * * * *', // Run queue runner every minute\n        limit: 10,\n      },\n    ],\n  },\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "storage",
    "m": "Advanced Architecture",
    "t": "Cloud storage adapters: S3, R2, Vercel Blob",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "s3",
      "r2",
      "storage",
      "cloudflare",
      "aws",
      "vercel-blob"
    ],
    "c": "\n<p class=\"lead\">In serverless and containerized production environments, local file storage is ephemeral. Payload provides official storage adapters for Amazon S3, Cloudflare R2, Google Cloud Storage, Azure Blob, and Vercel Blob.</p>\n\n<h2>Configuring Cloudflare R2 / AWS S3 Storage</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>import { s3Storage } from '@payloadcms/storage-s3'\n\nexport default buildConfig({\n  plugins: [\n    s3Storage({\n      collections: {\n        media: true, // Attach S3 adapter to 'media' collection\n      },\n      bucket: process.env.S3_BUCKET || '',\n      config: {\n        credentials: {\n          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',\n          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',\n        },\n        region: process.env.S3_REGION || 'auto',\n        endpoint: process.env.S3_ENDPOINT, // Cloudflare R2 endpoint URL\n        forcePathStyle: true,\n      },\n    }),\n  ],\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "email",
    "m": "Advanced Architecture",
    "t": "Email adapters: Resend, Nodemailer, SendGrid",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "email",
      "resend",
      "nodemailer",
      "transactional-emails"
    ],
    "c": "\n<p class=\"lead\">Payload uses transactional email for user invitation links, password reset tokens, and email verification. You can configure modern email adapters like Resend or standard Nodemailer SMTP.</p>\n\n<h2>Configuring the Resend Email Adapter</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>import { resendAdapter } from '@payloadcms/email-resend'\n\nexport default buildConfig({\n  email: resendAdapter({\n    defaultFromAddress: 'noreply@mycompany.com',\n    defaultFromName: 'Acme Security Portal',\n    apiKey: process.env.RESEND_API_KEY || '',\n  }),\n})</code></pre></div>\n\n<h2>Sending Custom Emails via Local API</h2>\n<div class=\"cb\"><div class=\"fn\">Send Transactional Email</div><pre><code>await payload.sendEmail({\n  to: 'customer@domain.com',\n  subject: 'Your order #ORD-998 has shipped!',\n  html: '&lt;h1&gt;Great news!&lt;/h1&gt;&lt;p&gt;Your package is on the way.&lt;/p&gt;',\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "plugins",
    "m": "Advanced Architecture",
    "t": "Building custom plugins",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "tags": [
      "plugins",
      "extensibility",
      "architecture",
      "npm"
    ],
    "c": "\n<p class=\"lead\">Plugins are composable functions that accept a <code>Config</code> object and return an enriched <code>Config</code>. Plugins can inject new collections, register hooks, mount custom admin views, and add database adapters.</p>\n\n<h2>Authoring a Reusable Payload Plugin</h2>\n<div class=\"cb\"><div class=\"fn\">src/plugins/auditLogPlugin.ts</div><pre><code>import type { Config, Plugin } from 'payload'\n\nexport const auditLogPlugin = (options?: { logDeletionsOnly?: boolean }): Plugin => {\n  return (incomingConfig: Config): Config => {\n    // 1. Inject an AuditLogs collection\n    const auditLogsCollection = {\n      slug: 'audit-logs',\n      admin: { group: 'System' },\n      fields: [\n        { name: 'action', type: 'text', required: true },\n        { name: 'collectionSlug', type: 'text', required: true },\n        { name: 'user', type: 'relationship', relationTo: 'users' },\n        { name: 'timestamp', type: 'date', defaultValue: () => new Date().toISOString() },\n      ],\n    }\n\n    // 2. Return enriched configuration\n    return {\n      ...incomingConfig,\n      collections: [\n        ...(incomingConfig.collections || []),\n        auditLogsCollection,\n      ],\n    }\n  }\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "i18n",
    "m": "Advanced Architecture",
    "t": "Localization & multi-language",
    "r": [
      "all",
      "frontend",
      "backend"
    ],
    "difficulty": "advanced",
    "tags": [
      "i18n",
      "localization",
      "languages",
      "locales"
    ],
    "c": "\n<p class=\"lead\">Payload provides first-class field-level localization. You can translate specific fields into multiple languages without duplicating entire document rows in your database.</p>\n\n<h2>Enabling Localization in Payload Config</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>export default buildConfig({\n  localization: {\n    locales: [\n      { label: 'English', code: 'en' },\n      { label: 'French (Français)', code: 'fr' },\n      { label: 'Spanish (Español)', code: 'es' },\n      { label: 'German (Deutsch)', code: 'de' },\n    ],\n    defaultLocale: 'en',\n    fallback: true, // Fall back to defaultLocale if localized field is empty\n  },\n})</code></pre></div>\n\n<h2>Marking Fields as Localized</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Posts.ts</div><pre><code>{\n  name: 'title',\n  type: 'text',\n  localized: true, // Automatically provides language switch tabs in Admin UI\n  required: true,\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "tenants",
    "m": "Advanced Architecture",
    "t": "Multi-tenancy architectures",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "multi-tenancy",
      "saas",
      "tenants",
      "isolation"
    ],
    "c": "\n<p class=\"lead\">Multi-tenancy enables a single Payload deployment to power multiple independent organizations, brands, or clients with total data isolation.</p>\n\n<h2>Using the Multi-Tenant Plugin</h2>\n<div class=\"cb\"><div class=\"fn\">src/payload.config.ts</div><pre><code>import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'\n\nexport default buildConfig({\n  plugins: [\n    multiTenantPlugin({\n      collections: {\n        posts: {},\n        media: {},\n        categories: {},\n      },\n      tenantCollectionSlug: 'tenants',\n    }),\n  ],\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "ai",
    "m": "Advanced Architecture",
    "t": "AI, vector embeddings & RAG",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "ai",
      "vector",
      "rag",
      "embeddings",
      "openai",
      "pgvector"
    ],
    "c": "\n<p class=\"lead\">Payload's code-first architecture and PostgreSQL / Drizzle backend make it the ideal content engine for AI workflows, vector search pipelines, and Retrieval-Augmented Generation (RAG).</p>\n\n<h2>Automating Vector Embeddings on Document Changes</h2>\n<div class=\"cb\"><div class=\"fn\">src/hooks/generateEmbedding.ts</div><pre><code>import type { CollectionAfterChangeHook } from 'payload'\nimport OpenAI from 'openai'\n\nconst openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })\n\nexport const generateEmbeddingHook: CollectionAfterChangeHook = async ({\n  doc,\n  req,\n}) => {\n  if (doc._status !== 'published') return doc\n\n  // 1. Generate 1536-dimension embedding vector\n  const response = await openai.embeddings.create({\n    model: 'text-embedding-3-small',\n    input: `${doc.title}\\n\\n${doc.excerpt || ''}`,\n  })\n\n  const vector = response.data[0].embedding\n\n  // 2. Save vector to PostgreSQL pgvector column via Local API\n  await req.payload.update({\n    collection: 'posts',\n    id: doc.id,\n    data: {\n      embedding: vector,\n    },\n    context: { skipEmbedding: true }, // Prevent recursive hook loops\n  })\n\n  return doc\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "testing",
    "m": "Advanced Architecture",
    "t": "End-to-end & integration testing",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "testing",
      "vitest",
      "playwright",
      "ci-cd"
    ],
    "c": "\n<p class=\"lead\">Because Payload runs entirely in Node.js, you can write super-fast integration tests using Vitest without spinning up external mock servers.</p>\n\n<h2>Integration Testing with Vitest</h2>\n<div class=\"cb\"><div class=\"fn\">tests/posts.test.ts</div><pre><code>import { describe, it, expect, beforeAll } from 'vitest'\nimport { getPayload } from 'payload'\nimport config from '@payload-config'\n\nlet payload: any\n\nbeforeAll(async () => {\n  payload = await getPayload({ config })\n})\n\ndescribe('Posts Collection Integration', () => {\n  it('automatically creates a URL slug from the title', async () => {\n    const post = await payload.create({\n      collection: 'posts',\n      data: {\n        title: 'Mastering Automated Integration Testing',\n      },\n    })\n\n    expect(post.slug).toBe('mastering-automated-integration-testing')\n  })\n})</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "database",
    "m": "Advanced Architecture",
    "t": "Postgres, Drizzle ORM, SQLite & Mongo",
    "r": [
      "all",
      "devops",
      "backend"
    ],
    "difficulty": "advanced",
    "tags": [
      "postgres",
      "sqlite",
      "drizzle",
      "mongo",
      "database"
    ],
    "c": "\n<p class=\"lead\">Payload 3.x uses Drizzle ORM to power native SQL adapters (PostgreSQL and SQLite) alongside MongoDB Mongoose support.</p>\n\n<h2>Adapter Comparison Matrix</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Feature</th><th>PostgreSQL (Drizzle)</th><th>SQLite (LibSQL / Turso)</th><th>MongoDB (Mongoose)</th></tr></thead>\n  <tbody>\n    <tr><td><b>Ideal Environment</b></td><td>Production Enterprise, Neon, Supabase</td><td>Local Dev, Edge, Serverless, Turso</td><td>Legacy document DB migration</td></tr>\n    <tr><td><b>ACID Transactions</b></td><td>Full Support</td><td>Full Support</td><td>Replica Sets required</td></tr>\n    <tr><td><b>Schema Migrations</b></td><td>Declarative SQL DDL files</td><td>Declarative SQL DDL files</td><td>Code-based migrations</td></tr>\n    <tr><td><b>Vector Extensions</b></td><td>pgvector native</td><td>sqlite-vss</td><td>Atlas Vector Search</td></tr>\n  </tbody>\n</table></div>\n",
    "readingMins": 3
  },
  {
    "id": "esm",
    "m": "Advanced Architecture",
    "t": "ESM & Next.js 16 compilation",
    "r": [
      "all",
      "devops"
    ],
    "difficulty": "advanced",
    "tags": [
      "esm",
      "bundling",
      "turbopack",
      "webpack",
      "modules"
    ],
    "c": "\n<p class=\"lead\">Payload 3.x is authored in 100% pure ECMAScript Modules (ESM), fully compliant with Next.js 16, Turbopack, and Node.js standard module resolution.</p>\n\n<h2>Configuring tsconfig.json for Pure ESM</h2>\n<div class=\"cb\"><div class=\"fn\">tsconfig.json</div><pre><code>{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"NodeNext\",\n    \"moduleResolution\": \"NodeNext\",\n    \"jsx\": \"preserve\",\n    \"strict\": true,\n    \"paths\": {\n      \"@payload-config\": [\"./src/payload.config.ts\"]\n    }\n  }\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "caching",
    "m": "Advanced Architecture",
    "t": "Next.js Cache, ISR & Tags",
    "r": [
      "all",
      "frontend",
      "devops"
    ],
    "difficulty": "advanced",
    "tags": [
      "caching",
      "isr",
      "revalidation",
      "unstable-cache",
      "tags"
    ],
    "c": "\n<p class=\"lead\">Combine Next.js 16's Data Cache and Tag-Based On-Demand Revalidation with Payload lifecycle hooks for instantaneous sub-millisecond static page deliveries.</p>\n\n<h2>Using <code>unstable_cache</code> with Cache Tags</h2>\n<div class=\"cb\"><div class=\"fn\">src/data/getFeaturedPosts.ts</div><pre><code>import { unstable_cache } from 'next/cache'\nimport { getPayload } from 'payload'\nimport config from '@payload-config'\n\nexport const getFeaturedPosts = unstable_cache(\n  async () => {\n    const payload = await getPayload({ config })\n    return payload.find({\n      collection: 'posts',\n      where: { isFeatured: { equals: true } },\n      limit: 6,\n    })\n  },\n  ['featured-posts-key'],\n  { tags: ['posts', 'featured-posts'], revalidate: 3600 }\n)</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "deploy",
    "m": "Advanced Architecture",
    "t": "Deploying to Vercel, Railway, Docker",
    "r": [
      "all",
      "devops"
    ],
    "difficulty": "intermediate",
    "tags": [
      "deployment",
      "vercel",
      "railway",
      "docker",
      "production"
    ],
    "c": "\n<p class=\"lead\">Deploy your unified Next.js + Payload application seamlessly to serverless platforms like Vercel or containerized PaaS platforms like Railway and AWS ECS.</p>\n\n<h2>Production Dockerfile Example</h2>\n<div class=\"cb\"><div class=\"fn\">Dockerfile</div><pre><code>FROM node:20-alpine AS base\nRUN corepack enable &amp;&amp; corepack prepare pnpm@latest --activate\nWORKDIR /app\n\nFROM base AS dependencies\nCOPY package.json pnpm-lock.yaml ./\nRUN pnpm install --frozen-lockfile\n\nFROM base AS builder\nCOPY --from=dependencies /app/node_modules ./node_modules\nCOPY . .\nENV NODE_ENV=production\nRUN pnpm build\n\nFROM base AS runner\nENV NODE_ENV=production\nCOPY --from=builder /app/public ./public\nCOPY --from=builder /app/.next/standalone ./\nCOPY --from=builder /app/.next/static ./.next/static\n\nEXPOSE 3000\nENV PORT=3000\nCMD [\"node\", \"server.js\"]</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "next",
    "m": "Advanced Architecture",
    "t": "Next.js 16 App Router deep dive",
    "r": [
      "all",
      "frontend",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "nextjs15",
      "app-router",
      "react19",
      "async-params"
    ],
    "c": "\n<p class=\"lead\">Payload 3.x is engineered natively around Next.js 16 and React 19, taking full advantage of async page parameters, server actions, and streaming metadata.</p>\n\n<h2>Async Params in Next.js 16 App Router</h2>\n<div class=\"cb\"><div class=\"fn\">src/app/(frontend)/blog/[slug]/page.tsx</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\nimport { notFound } from 'next/navigation'\n\nexport default async function BlogPostPage({\n  params,\n}: {\n  params: Promise<{ slug: string }>\n}) {\n  // In Next.js 16, params must be awaited!\n  const { slug } = await params\n  const payload = await getPayload({ config })\n\n  const { docs: [post] } = await payload.find({\n    collection: 'posts',\n    where: { slug: { equals: slug } },\n  })\n\n  if (!post) notFound()\n\n  return (\n    &lt;article&gt;\n      &lt;h1&gt;{post.title}&lt;/h1&gt;\n    &lt;/article&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "proj1",
    "m": "Project: Blog",
    "t": "Blog part 1 – schema & backend",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "project",
      "blog",
      "schema",
      "categories",
      "backend"
    ],
    "c": "\n<p class=\"lead\">In this hands-on project, we will architect a production-grade publication platform with author profiles, nested categories, auto-slugification, draft/published workflows, and image optimization.</p>\n\n<h2>Step 1: Categories Collection</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Categories.ts</div><pre><code>import type { CollectionConfig } from 'payload'\n\nexport const Categories: CollectionConfig = {\n  slug: 'categories',\n  admin: { useAsTitle: 'name' },\n  access: { read: () => true },\n  fields: [\n    { name: 'name', type: 'text', required: true },\n    { name: 'slug', type: 'text', unique: true, index: true },\n    { name: 'description', type: 'textarea' },\n    {\n      name: 'posts',\n      type: 'join',\n      collection: 'posts',\n      on: 'category',\n      maxDepth: 1,\n    },\n  ],\n}</code></pre></div>\n\n<h2>Step 2: Posts Collection with Revalidation Hooks</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Posts.ts</div><pre><code>import type { CollectionConfig } from 'payload'\nimport { revalidatePath, revalidateTag } from 'next/cache'\n\nexport const Posts: CollectionConfig = {\n  slug: 'posts',\n  admin: {\n    useAsTitle: 'title',\n    defaultColumns: ['title', 'category', '_status', 'publishedAt'],\n  },\n  versions: {\n    maxPerDoc: 25,\n    drafts: { autosave: true, schedulePublish: true },\n  },\n  access: {\n    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),\n    create: ({ req: { user } }) => Boolean(user),\n    update: ({ req: { user } }) => Boolean(user),\n    delete: ({ req: { user } }) => user?.role === 'admin',\n  },\n  hooks: {\n    beforeChange: [\n      ({ data, operation }) => {\n        if (data?.title && (!data.slug || operation === 'create')) {\n          data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')\n        }\n        return data\n      },\n    ],\n    afterChange: [\n      ({ doc }) => {\n        if (doc._status === 'published') {\n          revalidatePath('/blog')\n          revalidatePath(`/blog/${doc.slug}`)\n          revalidateTag('posts')\n        }\n        return doc\n      },\n    ],\n  },\n  fields: [\n    { name: 'title', type: 'text', required: true },\n    { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar' } },\n    { name: 'category', type: 'relationship', relationTo: 'categories', admin: { position: 'sidebar' } },\n    { name: 'author', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },\n    { name: 'coverImage', type: 'upload', relationTo: 'media' },\n    { name: 'content', type: 'richText' },\n  ],\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "proj2",
    "m": "Project: Blog",
    "t": "Blog part 2 – frontend",
    "r": [
      "all",
      "frontend"
    ],
    "difficulty": "intermediate",
    "tags": [
      "project",
      "blog",
      "frontend",
      "ssg",
      "seo"
    ],
    "c": "\n<p class=\"lead\">Connect your Next.js App Router frontend to Payload's Local API with Static Site Generation (SSG), dynamic OpenGraph metadata, and Lexical rich text rendering.</p>\n\n<h2>Dynamic Post Route with <code>generateStaticParams</code></h2>\n<div class=\"cb\"><div class=\"fn\">src/app/(frontend)/blog/[slug]/page.tsx</div><pre><code>import { getPayload } from 'payload'\nimport config from '@payload-config'\nimport { notFound } from 'next/navigation'\nimport { RichText } from '@payloadcms/richtext-lexical/react'\nimport type { Metadata } from 'next'\n\nexport async function generateStaticParams() {\n  const payload = await getPayload({ config })\n  const { docs: posts } = await payload.find({\n    collection: 'posts',\n    where: { _status: { equals: 'published' } },\n    select: { slug: true },\n    pagination: false,\n  })\n  return posts.map(({ slug }) => ({ slug }))\n}\n\nexport async function generateMetadata({\n  params,\n}: {\n  params: Promise<{ slug: string }>\n}): Promise<Metadata> {\n  const { slug } = await params\n  const payload = await getPayload({ config })\n  const { docs: [post] } = await payload.find({\n    collection: 'posts',\n    where: { slug: { equals: slug } },\n  })\n  if (!post) return {}\n  return {\n    title: `${post.title} | Acme Engineering`,\n    description: post.excerpt,\n  }\n}\n\nexport default async function BlogPostPage({\n  params,\n}: {\n  params: Promise<{ slug: string }>\n}) {\n  const { slug } = await params\n  const payload = await getPayload({ config })\n  const { docs: [post] } = await payload.find({\n    collection: 'posts',\n    where: { slug: { equals: slug }, _status: { equals: 'published' } },\n    depth: 2,\n  })\n\n  if (!post) notFound()\n\n  return (\n    &lt;article className=\"max-w-4xl mx-auto py-12 px-4\"&gt;\n      &lt;h1 className=\"text-4xl font-extrabold mb-4\"&gt;{post.title}&lt;/h1&gt;\n      &lt;div className=\"prose lg:prose-xl mt-8\"&gt;\n        &lt;RichText data={post.content} /&gt;\n      &lt;/div&gt;\n    &lt;/article&gt;\n  )\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "capstone",
    "m": "Project: Blog",
    "t": "Blog capstone challenge",
    "r": [
      "all"
    ],
    "difficulty": "advanced",
    "tags": [
      "capstone",
      "challenge",
      "advanced",
      "fullstack"
    ],
    "c": "\n<p class=\"lead\">Consolidate your mastery by building an enterprise editorial publication system covering roles, dynamic block builders, live previews, and automated testing.</p>\n\n<h2>Capstone Requirements Checklist</h2>\n<div class=\"tbl\"><table>\n  <thead><tr><th>Module</th><th>Requirements</th><th>Verification</th></tr></thead>\n  <tbody>\n    <tr><td><b>Access Control</b></td><td>Implement <code>admin</code>, <code>editor</code>, and <code>author</code> roles. Authors can only edit their own drafts.</td><td>Run role-based Vitest unit tests.</td></tr>\n    <tr><td><b>Page Builder</b></td><td>Build a polymorphic <code>layout</code> blocks field with Hero, Callout, and Code Snippet blocks.</td><td>Create dynamic multi-block landing page.</td></tr>\n    <tr><td><b>Live Preview</b></td><td>Configure real-time iframe preview with desktop and mobile responsive viewport toggles.</td><td>Verify live edits sync via postMessage.</td></tr>\n    <tr><td><b>Cloud Storage</b></td><td>Mount S3 or Cloudflare R2 adapter for media assets.</td><td>Upload high-res banner image to cloud bucket.</td></tr>\n    <tr><td><b>SEO Plugin</b></td><td>Install <code>@payloadcms/plugin-seo</code> with auto-generated OG images.</td><td>Inspect <code>&lt;meta property=\"og:image\"&gt;</code> in HTML head.</td></tr>\n  </tbody>\n</table></div>\n",
    "readingMins": 3
  },
  {
    "id": "ecomm1",
    "m": "Project: E-commerce",
    "t": "E-commerce part 1 – catalog & cart",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "intermediate",
    "badge": "new",
    "tags": [
      "ecommerce",
      "products",
      "inventory",
      "orders",
      "cart"
    ],
    "c": "\n<p class=\"lead\">Build a scalable e-commerce catalog featuring product variants, dynamic pricing in cents, inventory stock tracking, and orders management.</p>\n\n<h2>Products Collection with Inventory Tracking</h2>\n<div class=\"cb\"><div class=\"fn\">src/collections/Products.ts</div><pre><code>import type { CollectionConfig } from 'payload'\n\nexport const Products: CollectionConfig = {\n  slug: 'products',\n  admin: { useAsTitle: 'title' },\n  access: { read: () => true },\n  fields: [\n    { name: 'title', type: 'text', required: true },\n    { name: 'slug', type: 'text', unique: true, index: true },\n    { name: 'priceInCents', type: 'number', required: true, min: 0 },\n    { name: 'inventoryStock', type: 'number', defaultValue: 0, min: 0 },\n    { name: 'sku', type: 'text', unique: true },\n    {\n      name: 'images',\n      type: 'array',\n      fields: [{ name: 'image', type: 'upload', relationTo: 'media' }],\n    },\n    {\n      name: 'status',\n      type: 'select',\n      defaultValue: 'draft',\n      options: ['draft', 'active', 'archived'],\n      admin: { position: 'sidebar' },\n    },\n  ],\n}</code></pre></div>\n",
    "readingMins": 3
  },
  {
    "id": "ecomm2",
    "m": "Project: E-commerce",
    "t": "E-commerce part 2 – checkout API & webhooks",
    "r": [
      "all",
      "backend"
    ],
    "difficulty": "advanced",
    "badge": "new",
    "tags": [
      "stripe",
      "checkout",
      "webhooks",
      "payments",
      "orders"
    ],
    "c": "\n<p class=\"lead\">Implement a secure checkout flow with server-side price validation, Stripe PaymentIntents, inventory deduction transactions, and Stripe webhook fulfillment.</p>\n\n<h2>Custom Checkout Endpoint Handler</h2>\n<div class=\"cb\"><div class=\"fn\">src/endpoints/createCheckoutSession.ts</div><pre><code>import Stripe from 'stripe'\nimport type { PayloadHandler } from 'payload'\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')\n\nexport const createCheckoutSession: PayloadHandler = async (req) => {\n  if (!req.user) {\n    return Response.json({ error: 'Unauthorized' }, { status: 401 })\n  }\n\n  const { items } = (await req.json()) as {\n    items: Array<{ productId: string; quantity: number }>\n  }\n\n  // 1. Always re-fetch prices from DB (NEVER trust client-sent amounts!)\n  const validatedItems = await Promise.all(\n    items.map(async ({ productId, quantity }) => {\n      const product = await req.payload.findByID({ collection: 'products', id: productId })\n      if (!product || product.inventoryStock < quantity) {\n        throw new Error(`Insufficient stock for product: ${product?.title}`)\n      }\n      return { product, quantity, unitPrice: product.priceInCents }\n    })\n  )\n\n  const total = validatedItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)\n\n  // 2. Create Stripe PaymentIntent\n  const paymentIntent = await stripe.paymentIntents.create({\n    amount: total,\n    currency: 'usd',\n    metadata: { userId: req.user.id },\n  })\n\n  // 3. Create pending Order in Payload\n  const order = await req.payload.create({\n    collection: 'orders',\n    data: {\n      orderNumber: 'ORD-' + Date.now(),\n      customer: req.user.id,\n      totalAmount: total,\n      status: 'pending',\n      stripePaymentIntentId: paymentIntent.id,\n      items: validatedItems.map((i) => ({\n        product: i.product.id,\n        quantity: i.quantity,\n        unitPrice: i.unitPrice,\n      })),\n    },\n  })\n\n  return Response.json({\n    clientSecret: paymentIntent.client_secret,\n    orderId: order.id,\n  })\n}</code></pre></div>\n",
    "readingMins": 3
  }
];
