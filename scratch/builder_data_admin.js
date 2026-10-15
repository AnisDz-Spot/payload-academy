// scratch/builder_data_admin.js
module.exports = [
  {
    id: "api",
    m: "Using the Data",
    t: "Local API, REST & GraphQL",
    r: ["all", "frontend", "backend"],
    difficulty: "intermediate",
    tags: ["local-api", "rest", "graphql", "crud"],
    c: `
<p class="lead">Payload provides three distinct, fully typed API paradigms from a single configuration file: the zero-latency <strong>Local API</strong>, standard <strong>REST API</strong>, and an auto-generated <strong>GraphQL API</strong>.</p>

<h2>1. The Local API (Server-Side, Zero Network Overhead)</h2>
<p>The Local API interacts directly with your database drivers within Node.js, Next.js Server Components, and Server Actions without making any internal HTTP requests.</p>

<div class="cb"><div class="fn">Local API Operations</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

// 1. Find with filtering, sorting, and pagination
const posts = await payload.find({
  collection: 'posts',
  where: {
    _status: { equals: 'published' },
  },
  sort: '-createdAt',
  limit: 10,
  page: 1,
  depth: 1, // Populates 1st-level relations (e.g. author, media)
})

// 2. Find by ID
const singlePost = await payload.findByID({
  collection: 'posts',
  id: 'doc_123',
})

// 3. Create document
const newPost = await payload.create({
  collection: 'posts',
  data: {
    title: 'Announcing v3.0',
    slug: 'announcing-v3',
    _status: 'published',
  },
})

// 4. Update document
const updated = await payload.update({
  collection: 'posts',
  id: 'doc_123',
  data: {
    title: 'Updated Title',
  },
})

// 5. Delete document
await payload.delete({
  collection: 'posts',
  id: 'doc_123',
})</code></pre></div>

<h2>2. The REST API</h2>
<p>Payload automatically mounts standard REST endpoints for every collection and global at <code>/api/{collection-slug}</code>:</p>

<div class="tbl"><table>
  <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>GET</code></td><td><code>/api/posts?where[status][equals]=published&amp;limit=10</code></td><td>Query documents with filtering and pagination.</td></tr>
    <tr><td><code>GET</code></td><td><code>/api/posts/:id</code></td><td>Retrieve a single document by its ID.</td></tr>
    <tr><td><code>POST</code></td><td><code>/api/posts</code></td><td>Create a new document.</td></tr>
    <tr><td><code>PATCH</code></td><td><code>/api/posts/:id</code></td><td>Update specific fields of a document.</td></tr>
    <tr><td><code>DELETE</code></td><td><code>/api/posts/:id</code></td><td>Delete a single document.</td></tr>
  </tbody>
</table></div>

<h2>3. The GraphQL API</h2>
<p>Payload automatically generates a full GraphQL schema at <code>/api/graphql</code> with complex queries, mutations, and pagination out-of-the-box:</p>

<div class="cb"><div class="fn">GraphQL Query Example</div><pre><code>query FetchPublishedPosts {
  Posts(where: { _status: { equals: published } }, limit: 5, sort: "-createdAt") {
    docs {
      id
      title
      slug
      author {
        name
        email
      }
    }
    totalDocs
    hasNextPage
  }
}</code></pre></div>
`
  },
  {
    id: "queries",
    m: "Using the Data",
    t: "Query operators & pagination",
    r: ["all", "backend"],
    difficulty: "intermediate",
    tags: ["queries", "operators", "where", "pagination", "search"],
    c: `
<p class="lead">Payload features a rich, declarative query language for filtering, full-text searching, sorting, and paginating data across all supported database adapters.</p>

<h2>All Supported WHERE Query Operators</h2>
<div class="tbl"><table>
  <thead><tr><th>Operator</th><th>SQL Equivalent</th><th>Example Usage</th></tr></thead>
  <tbody>
    <tr><td><code>equals</code></td><td><code>=</code></td><td><code>{ status: { equals: 'published' } }</code></td></tr>
    <tr><td><code>not_equals</code></td><td><code>!=</code></td><td><code>{ role: { not_equals: 'admin' } }</code></td></tr>
    <tr><td><code>in</code></td><td><code>IN (...)</code></td><td><code>{ category: { in: ['news', 'tech'] } }</code></td></tr>
    <tr><td><code>not_in</code></td><td><code>NOT IN (...)</code></td><td><code>{ id: { not_in: [1, 2, 3] } }</code></td></tr>
    <tr><td><code>greater_than</code></td><td><code>&gt;</code></td><td><code>{ price: { greater_than: 50 } }</code></td></tr>
    <tr><td><code>less_than_equal</code></td><td><code>&lt;=</code></td><td><code>{ stock: { less_than_equal: 0 } }</code></td></tr>
    <tr><td><code>like</code></td><td><code>ILIKE '%term%'</code></td><td><code>{ title: { like: 'payload' } }</code> (Case-insensitive)</td></tr>
    <tr><td><code>contains</code></td><td><code>ILIKE '%term%'</code></td><td><code>{ description: { contains: 'framework' } }</code></td></tr>
    <tr><td><code>exists</code></td><td><code>IS NOT NULL</code></td><td><code>{ publishedAt: { exists: true } }</code></td></tr>
  </tbody>
</table></div>

<h2>Complex Compound Queries (AND / OR)</h2>
<div class="cb"><div class="fn">Compound Query Example</div><pre><code>const activeDeals = await payload.find({
  collection: 'products',
  where: {
    and: [
      { inStock: { equals: true } },
      {
        or: [
          { onSale: { equals: true } },
          { price: { less_than: 25 } },
        ],
      },
    ],
  },
  sort: '-price', // Sort descending by price
  limit: 20,
})</code></pre></div>
`
  },
  {
    id: "actions",
    m: "Using the Data",
    t: "Next.js Server Actions & mutations",
    r: ["all", "frontend", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["server-actions", "nextjs", "mutations", "forms"],
    c: `
<p class="lead">Next.js 15 Server Actions paired with Payload's in-process Local API offer the fastest, most secure method for mutating data from client forms without creating dedicated REST boilerplate.</p>

<h2>Creating a Type-Safe Server Action</h2>
<div class="cb"><div class="fn">src/actions/submitNewsletter.ts</div><pre><code>'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

export async function submitNewsletter(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const payload = await getPayload({ config })

  try {
    await payload.create({
      collection: 'subscribers',
      data: {
        email: email.trim().toLowerCase(),
        source: 'homepage_footer',
        subscribedAt: new Date().toISOString(),
      },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    if (error?.message?.includes('duplicate')) {
      return { success: false, error: 'You are already subscribed!' }
    }
    return { success: false, error: 'Failed to subscribe. Please try again.' }
  }
}</code></pre></div>

<h2>Consuming the Server Action in a Client Form</h2>
<div class="cb"><div class="fn">src/components/NewsletterForm.tsx</div><pre><code>'use client'
import { useTransition, useState } from 'react'
import { submitNewsletter } from '@/actions/submitNewsletter'

export function NewsletterForm() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState&lt;string | null&gt;(null)

  const handleSubmit = (e: React.FormEvent&lt;HTMLFormElement&gt;) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await submitNewsletter(formData)
      if (result.success) {
        setMessage('🎉 Thank you for subscribing!')
        form.reset()
      } else {
        setMessage(\`⚠️ \${result.error}\`)
      }
    })
  }

  return (
    &lt;form onSubmit={handleSubmit} className="flex gap-2"&gt;
      &lt;input type="email" name="email" required placeholder="name@domain.com" /&gt;
      &lt;button type="submit" disabled={isPending}&gt;
        {isPending ? 'Subscribing...' : 'Subscribe'}
      &lt;/button&gt;
      {message &amp;&amp; &lt;p&gt;{message}&lt;/p&gt;}
    &lt;/form&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "frontend",
    m: "Using the Data",
    t: "Rendering in Next.js Server Components",
    r: ["all", "frontend"],
    difficulty: "beginner",
    tags: ["rsc", "nextjs", "server-components", "seo", "ssr"],
    c: `
<p class="lead">React Server Components (RSC) allow you to fetch data directly inside your UI components at render time with zero client JavaScript overhead, instant SEO indexing, and blazing-fast Initial Page Load times.</p>

<h2>Complete Server Component Page Example</h2>
<div class="cb"><div class="fn">src/app/(frontend)/blog/page.tsx</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights & Engineering Blog | Acme Tech',
  description: 'Deep dives into modern fullstack architecture and Payload CMS.',
}

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>
}) {
  const { page = '1', category } = await searchParams
  const payload = await getPayload({ config })

  // Construct dynamic query
  const where: any = {
    _status: { equals: 'published' },
  }
  if (category) {
    where['category.slug'] = { equals: category }
  }

  const posts = await payload.find({
    collection: 'posts',
    where,
    sort: '-createdAt',
    limit: 9,
    page: parseInt(page, 10),
    depth: 1, // Populates coverImage and author
  })

  return (
    &lt;main className="container mx-auto py-12"&gt;
      &lt;h1 className="text-4xl font-bold mb-8"&gt;Engineering Blog&lt;/h1&gt;
      &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-8"&gt;
        {posts.docs.map((post) => (
          &lt;article key={post.id} className="card shadow rounded-lg overflow-hidden"&gt;
            {typeof post.coverImage === 'object' &amp;&amp; post.coverImage?.url &amp;&amp; (
              &lt;Image
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                width={600}
                height={340}
                className="w-full h-48 object-cover"
              /&gt;
            )}
            &lt;div className="p-6"&gt;
              &lt;h2 className="text-xl font-semibold mb-2"&gt;
                &lt;Link href={\`/blog/\${post.slug}\`}&gt;{post.title}&lt;/Link&gt;
              &lt;/h2&gt;
              &lt;p className="text-gray-600 line-clamp-3"&gt;{post.excerpt}&lt;/p&gt;
            &lt;/div&gt;
          &lt;/article&gt;
        ))}
      &lt;/div&gt;
    &lt;/main&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "seeding",
    m: "Using the Data",
    t: "Data seeding & programmatic creation",
    r: ["all", "devops", "backend"],
    difficulty: "intermediate",
    badge: "new",
    tags: ["seeding", "fixtures", "faker", "demo-data"],
    c: `
<p class="lead">Programmatic data seeding ensures reproducible environments across local development, continuous integration (CI) tests, and staging review deployments.</p>

<h2>Writing a Comprehensive Seed Script</h2>
<div class="cb"><div class="fn">src/scripts/seed.ts</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'

async function seedDatabase() {
  const payload = await getPayload({ config })
  console.log('🌱 Clearing existing collections...')

  // Clean existing demo data
  await payload.delete({ collection: 'posts', where: { id: { exists: true } } })
  await payload.delete({ collection: 'categories', where: { id: { exists: true } } })

  console.log('📦 Seeding categories...')
  const techCat = await payload.create({
    collection: 'categories',
    data: { name: 'Technology', slug: 'tech' },
  })
  const designCat = await payload.create({
    collection: 'categories',
    data: { name: 'Design & UI', slug: 'design' },
  })

  console.log('📝 Seeding published posts...')
  for (let i = 1; i &lt;= 10; i++) {
    await payload.create({
      collection: 'posts',
      data: {
        title: \`Mastering Fullstack Engineering Part \${i}\`,
        slug: \`mastering-fullstack-part-\${i}\`,
        category: i % 2 === 0 ? techCat.id : designCat.id,
        _status: 'published',
      },
    })
  }

  console.log('✅ Database successfully seeded!')
  process.exit(0)
}

seedDatabase().catch((e) => {
  console.error(e)
  process.exit(1)
})</code></pre></div>
`
  },
  {
    id: "admin",
    m: "Admin UI & Customization",
    t: "Admin panel customization & branding",
    r: ["all", "frontend"],
    difficulty: "beginner",
    tags: ["admin", "branding", "logo", "favicon", "nav"],
    c: `
<p class="lead">The Payload Admin Panel is fully brandable and customizable. You can replace logos, inject custom dashboard widgets, modify navigation links, and adjust metadata without touching core engine internals.</p>

<h2>Configuring Admin Branding</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '– TechCorp Enterprise Suite',
      favicon: '/favicon.ico',
      ogImage: '/admin-og.png',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/CustomLogo',
        Icon: '@/components/admin/CustomIcon',
      },
      beforeDashboard: ['@/components/admin/WelcomeBanner'],
      afterNavLinks: ['@/components/admin/SupportWidget'],
    },
  },
})</code></pre></div>

<h2>Custom Branding Server Component</h2>
<div class="cb"><div class="fn">src/components/admin/CustomLogo.tsx</div><pre><code>import Image from 'next/image'

export default function CustomLogo() {
  return (
    &lt;div className="flex items-center gap-3 py-2"&gt;
      &lt;Image src="/logo.svg" alt="TechCorp Logo" width={32} height={32} /&gt;
      &lt;span className="font-bold text-lg tracking-tight"&gt;TechCorp CMS&lt;/span&gt;
    &lt;/div&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "customui",
    m: "Admin UI & Customization",
    t: "Custom React components in Admin",
    r: ["all", "frontend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["react", "components", "admin-ui", "importmap", "client-components"],
    c: `
<p class="lead">In Payload 3.x, you can inject custom React Server and Client Components into any field, cell view, header, or dashboard widget using string component paths that are compiled into the <code>importMap.js</code>.</p>

<h2>Custom Field Component Example</h2>
<div class="cb"><div class="fn">src/components/admin/ColorPickerField.tsx</div><pre><code>'use client'
import React from 'react'
import { useField } from '@payloadcms/ui'

export default function ColorPickerField({ path }: { path: string }) {
  const { value, setValue } = useField&lt;string&gt;({ path })

  return (
    &lt;div className="field-type"&gt;
      &lt;label className="field-label"&gt;Brand Accent Color&lt;/label&gt;
      &lt;div className="flex items-center gap-3"&gt;
        &lt;input
          type="color"
          value={value || '#6366f1'}
          onChange={(e) => setValue(e.target.value)}
          className="w-12 h-10 cursor-pointer rounded border"
        /&gt;
        &lt;span className="font-mono text-sm uppercase"&gt;{value || '#6366f1'}&lt;/span&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}</code></pre></div>

<h2>Registering in Collection Field Schema</h2>
<div class="cb"><div class="fn">src/collections/Themes.ts</div><pre><code>export const Themes: CollectionConfig = {
  slug: 'themes',
  fields: [
    {
      name: 'accentColor',
      type: 'text',
      admin: {
        components: {
          Field: '@/components/admin/ColorPickerField',
        },
      },
    },
  ],
}</code></pre></div>
`
  },
  {
    id: "theming",
    m: "Admin UI & Customization",
    t: "CSS Variables & custom theming",
    r: ["all", "frontend"],
    difficulty: "intermediate",
    tags: ["css", "theme", "dark-mode", "variables"],
    c: `
<p class="lead">Payload's admin theme uses a structured design system powered by CSS custom properties. You can inject custom styles to alter colors, typography, borders, and dark/light modes.</p>

<h2>Custom Admin CSS Theme</h2>
<div class="cb"><div class="fn">src/styles/custom-admin.css</div><pre><code>[data-theme='dark'] {
  --theme-bg: #09090b;
  --theme-elevation-50: #18181b;
  --theme-elevation-100: #27272a;
  --theme-elevation-200: #3f3f46;
  --theme-success-500: #10b981;
  --theme-warning-500: #f59e0b;
  --theme-error-500: #ef4444;
}

[data-theme='light'] {
  --theme-bg: #f8fafc;
  --theme-elevation-50: #ffffff;
  --theme-elevation-100: #f1f5f9;
}</code></pre></div>
`
  },
  {
    id: "whitelabel",
    m: "Admin UI & Customization",
    t: "White-labeling & bespoke dashboard",
    r: ["all", "frontend"],
    difficulty: "intermediate",
    badge: "new",
    tags: ["whitelabel", "client-portal", "custom-dashboard"],
    c: `
<p class="lead">Deliver a tailored, agency-grade administrative portal for non-technical enterprise clients by replacing default welcome screens with bespoke KPI dashboards and help centers.</p>

<h2>Custom Dashboard Analytics Component</h2>
<div class="cb"><div class="fn">src/components/admin/CustomDashboard.tsx</div><pre><code>import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function CustomDashboard() {
  const payload = await getPayload({ config })
  const postsCount = await payload.count({ collection: 'posts' })
  const usersCount = await payload.count({ collection: 'users' })

  return (
    &lt;div className="p-8 max-w-6xl mx-auto"&gt;
      &lt;h1 className="text-3xl font-bold mb-2"&gt;Editorial Command Center&lt;/h1&gt;
      &lt;p className="text-gray-500 mb-8"&gt;Real-time publishing analytics and system status.&lt;/p&gt;
      
      &lt;div className="grid grid-cols-1 md:grid-cols-2 gap-6"&gt;
        &lt;div className="card bg-zinc-900 border border-zinc-800 p-6 rounded-xl"&gt;
          &lt;div className="text-sm text-zinc-400"&gt;Total Articles Published&lt;/div&gt;
          &lt;div className="text-4xl font-extrabold mt-2 text-indigo-400"&gt;{postsCount.totalDocs}&lt;/div&gt;
        &lt;/div&gt;
        &lt;div className="card bg-zinc-900 border border-zinc-800 p-6 rounded-xl"&gt;
          &lt;div className="text-sm text-zinc-400"&gt;Active Authors &amp; Editors&lt;/div&gt;
          &lt;div className="text-4xl font-extrabold mt-2 text-emerald-400"&gt;{usersCount.totalDocs}&lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  )
}</code></pre></div>
`
  }
];
