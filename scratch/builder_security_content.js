// scratch/builder_security_content.js
module.exports = [
  {
    id: "access",
    m: "Security & Logic",
    t: "Access Control",
    r: ["all", "backend"],
    difficulty: "intermediate",
    tags: ["security", "access-control", "rbac", "permissions"],
    c: `
<p class="lead">Access control in Payload is declarative, granular, and executes on every operation across REST, GraphQL, and the Local API. Access functions evaluate at both the <strong>Collection Level</strong> and the <strong>Field Level</strong>, returning either a boolean or a query constraint for Row-Level Security (RLS).</p>

<h2>Boolean vs. Query Constraints (Row-Level Security)</h2>
<p>An access control function can return:</p>
<ul>
  <li><code>true</code>: Grants unconditional access to the requested operation.</li>
  <li><code>false</code>: Denies access and throws a <code>ForbiddenError</code> (403).</li>
  <li><code>Where</code> query object: Dynamically constrains the database query so users only read, update, or delete rows matching the predicate.</li>
</ul>

<div class="cb"><div class="fn">src/access/postsAccess.ts</div><pre><code>import type { Access } from 'payload'

// 1. Read: Public sees published; Authors see their drafts; Admins see all
export const canReadPosts: Access = ({ req: { user } }) => {
  // Unauthenticated visitors only see published documents
  if (!user) {
    return {
      _status: { equals: 'published' },
    }
  }

  // Superadmins can see everything
  if (user.role === 'admin') {
    return true
  }

  // Authors can see published posts OR their own drafts
  return {
    or: [
      { _status: { equals: 'published' } },
      { author: { equals: user.id } },
    ],
  }
}

// 2. Update: Admins can update any; Authors only edit their own posts
export const canUpdatePosts: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true

  return {
    author: { equals: user.id },
  }
}</code></pre></div>

<h2>Field-Level Access Control</h2>
<p>Secure specific sensitive fields within a document (such as internal reviewer notes, customer stripe IDs, or pricing margins):</p>

<div class="cb"><div class="fn">Field-Level Access Example</div><pre><code>{
  name: 'internalEditorialNotes',
  type: 'textarea',
  access: {
    // Only editors and admins can read this field
    read: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    // Only admins can modify this field
    update: ({ req: { user } }) => user?.role === 'admin',
  },
}</code></pre></div>

<h2>The Local API <code>overrideAccess</code> Paradigm</h2>
<p>By default, the in-process Local API runs with <code>overrideAccess: true</code> for maximum performance in server-side tasks. When executing queries on behalf of a web user in a Server Action or Route Handler, <strong>always pass <code>overrideAccess: false</code></strong>:</p>

<div class="cb"><div class="fn">Local API User Impersonation</div><pre><code>// ⚠️ INSECURE: Bypasses all access control rules
const allPosts = await payload.find({ collection: 'posts' })

// ✅ SECURE: Enforces user permissions & row-level security
const userPosts = await payload.find({
  collection: 'posts',
  overrideAccess: false,
  user: currentUser, // Contextual user object
})</code></pre></div>
`
  },
  {
    id: "hooks",
    m: "Security & Logic",
    t: "Hooks",
    r: ["all", "backend"],
    difficulty: "intermediate",
    tags: ["hooks", "lifecycle", "automation", "side-effects"],
    c: `
<p class="lead">Hooks are asynchronous lifecycle functions that intercept CRUD operations at precise stages. They can sanitize incoming data, trigger external side effects (emails, webhooks, search indexing), perform Next.js on-demand cache revalidation, or abort transactions by throwing errors.</p>

<h2>Complete Collection Lifecycle Pipeline</h2>
<div class="tbl"><table>
  <thead><tr><th>Hook Name</th><th>Timing &amp; Context</th><th>Can Mutate Data?</th></tr></thead>
  <tbody>
    <tr><td><code>beforeValidate</code></td><td>Runs before schema type validation</td><td>✅ Yes (Mutates <code>data</code>)</td></tr>
    <tr><td><code>beforeChange</code></td><td>After validation, before database write</td><td>✅ Yes (Final mutation window)</td></tr>
    <tr><td><code>afterChange</code></td><td>Immediately after database write/commit</td><td>❌ No (Receives immutable <code>doc</code>)</td></tr>
    <tr><td><code>beforeRead</code></td><td>Before querying from database</td><td>❌ No</td></tr>
    <tr><td><code>afterRead</code></td><td>After DB read, before returning to caller</td><td>✅ Yes (Transforms returned JSON)</td></tr>
    <tr><td><code>beforeDelete</code></td><td>Before document is removed</td><td>❌ No (Can throw error to abort)</td></tr>
    <tr><td><code>afterDelete</code></td><td>After document deletion completes</td><td>❌ No</td></tr>
    <tr><td><code>afterOperation</code></td><td>After entire operation (including relations) finishes</td><td>❌ No</td></tr>
  </tbody>
</table></div>

<h2>Example 1: Automated Slugs &amp; Reading Time Calculation</h2>
<div class="cb"><div class="fn">src/hooks/formatPost.ts</div><pre><code>import type { CollectionBeforeChangeHook } from 'payload'

export const formatPostHook: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  // 1. Auto-generate URL slug from title
  if (data?.title && (operation === 'create' || !data.slug)) {
    data.slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // 2. Compute reading time from richText content
  if (data?.content) {
    const rawText = JSON.stringify(data.content)
    const wordCount = rawText.split(/\\s+/).length
    data.readingMins = Math.max(1, Math.round(wordCount / 200))
  }

  return data
}</code></pre></div>

<h2>Example 2: Next.js On-Demand Cache Invalidation</h2>
<div class="cb"><div class="fn">src/hooks/revalidatePost.ts</div><pre><code>import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidatePostAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  // Prevent infinite loops during internal bulk operations
  if (context?.preventRevalidation) return doc

  // If status is published or was published, purge Next.js ISR cache
  if (doc._status === 'published' || previousDoc?._status === 'published') {
    revalidatePath('/blog')
    revalidatePath(\`/blog/\${doc.slug}\`)
    revalidateTag('posts-collection')
  }

  return doc
}</code></pre></div>

<div class="tip">
  <b>Passing Context:</b> Use the <code>context</code> parameter (e.g. <code>payload.update({ id, data, context: { preventRevalidation: true } })</code>) to pass transient state flags between nested hooks and prevent duplicate external side effects.
</div>
`
  },
  {
    id: "auth",
    m: "Security & Logic",
    t: "Authentication & users",
    r: ["all", "backend"],
    difficulty: "intermediate",
    tags: ["auth", "jwt", "cookies", "sessions"],
    c: `
<p class="lead">Adding <code>auth: true</code> (or an authentication configuration object) to any collection transforms it into a full-featured authentication authority with Argon2 password hashing, JWT session management, secure HTTP-only cookies, and automated password reset workflows.</p>

<h2>Configuring an Auth Collection</h2>
<div class="cb"><div class="fn">src/collections/Users.ts</div><pre><code>import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 86400 * 7,    // 7 days in seconds
    maxLoginAttempts: 5,           // Locks account after 5 failed attempts
    lockTime: 15 * 60 * 1000,      // 15-minute lock duration
    verify: false,                 // Set true for email activation workflow
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'createdAt'],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Customer', value: 'customer' },
      ],
      access: {
        // Only admins can elevate user roles
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}</code></pre></div>

<h2>Automated Auth REST Endpoints</h2>
<div class="tbl"><table>
  <thead><tr><th>Route</th><th>Method</th><th>Description</th></tr></thead>
  <tbody>
    <tr><td><code>/api/users/login</code></td><td>POST</td><td>Authenticates credentials, returns user + JWT, sets HTTP-only session cookie.</td></tr>
    <tr><td><code>/api/users/logout</code></td><td>POST</td><td>Clears session cookies and invalidates client token.</td></tr>
    <tr><td><code>/api/users/me</code></td><td>GET</td><td>Returns currently authenticated user profile and token status.</td></tr>
    <tr><td><code>/api/users/forgot-password</code></td><td>POST</td><td>Generates single-use reset token and emails recovery link.</td></tr>
    <tr><td><code>/api/users/reset-password</code></td><td>POST</td><td>Updates password with valid reset token.</td></tr>
    <tr><td><code>/api/users/refresh-token</code></td><td>POST</td><td>Renews expiring JWT without requiring re-entry of password.</td></tr>
  </tbody>
</table></div>

<h2>Authenticating in Next.js 15 Server Components</h2>
<div class="cb"><div class="fn">src/app/(frontend)/dashboard/page.tsx</div><pre><code>import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function DashboardPage() {
  const payload = await getPayload({ config })
  
  // payload.auth() verifies the HTTP-only cookie automatically
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  return (
    &lt;div className="container"&gt;
      &lt;h1&gt;Welcome back, {user.email}&lt;/h1&gt;
      &lt;p&gt;Role: {user.role}&lt;/p&gt;
    &lt;/div&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "customauth",
    m: "Security & Logic",
    t: "Custom auth strategies & OAuth",
    r: ["all", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["oauth", "sso", "github", "google", "passkeys"],
    c: `
<p class="lead">Payload 3.x features a modular <strong>Custom Auth Strategy</strong> architecture allowing you to implement third-party OAuth 2.0 / OpenID Connect (Google, GitHub, Microsoft Azure AD), enterprise SAML/SSO, or passwordless magic links seamlessly.</p>

<h2>OAuth 2.0 Integration Pattern (GitHub Example)</h2>
<p>Here is the standard Next.js App Router route handler pattern for handling OAuth callbacks and issuing Payload authentication sessions:</p>

<div class="cb"><div class="fn">src/app/api/auth/github/callback/route.ts</div><pre><code>import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', req.url))
  }

  // 1. Exchange authorization code for GitHub access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenRes.json()

  // 2. Retrieve GitHub user profile
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: \`Bearer \${tokenData.access_token}\` },
  })
  const ghUser = await userRes.json()

  const payload = await getPayload({ config })

  // 3. Find or create user in Payload
  let { docs: [user] } = await payload.find({
    collection: 'users',
    where: { email: { equals: ghUser.email } },
  })

  if (!user) {
    user = await payload.create({
      collection: 'users',
      data: {
        email: ghUser.email,
        role: 'editor',
        password: Math.random().toString(36).slice(-20) + '!A9',
      },
    })
  }

  // 4. Generate Payload session JWT & set HTTP-only cookie
  const cookieStore = await cookies()
  const jwt = await payload.login({
    collection: 'users',
    data: { email: user.email, password: user.password },
  })

  return NextResponse.redirect(new URL('/admin', req.url))
}</code></pre></div>
`
  },
  {
    id: "apikeys",
    m: "Security & Logic",
    t: "API Keys & machine auth",
    r: ["all", "backend"],
    difficulty: "intermediate",
    badge: "new",
    tags: ["api-keys", "m2m", "microservices", "webhooks"],
    c: `
<p class="lead">API keys enable headless, machine-to-machine (M2M) authentication without user sessions. They are designed for CI/CD pipelines, sync daemons, background webhooks, and external microservices.</p>

<h2>Enabling API Keys on a Collection</h2>
<div class="cb"><div class="fn">src/collections/Users.ts</div><pre><code>export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,             // Adds API Key generator button to Admin screen
    disableLocalStrategy: false, // Retains email/password login
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor', 'service-account'],
    },
  ],
}</code></pre></div>

<h2>Authenticating with API Keys</h2>
<p>Pass the API key in the standard <code>Authorization</code> header formatted as <code>&lt;collection-slug&gt; API-Key &lt;key-value&gt;</code>:</p>

<div class="cb"><div class="fn">cURL Request</div><pre><code>curl -X GET https://api.mycompany.com/api/posts \\
  -H "Authorization: users API-Key 7b1c38f9-4d2a-4876-9631-01f284e9da42" \\
  -H "Content-Type: application/json"</code></pre></div>

<div class="cb"><div class="fn">Node.js Fetch Client</div><pre><code>const response = await fetch('https://api.mycompany.com/api/posts', {
  headers: {
    Authorization: \`users API-Key \${process.env.PAYLOAD_SERVICE_API_KEY}\`,
    'Content-Type': 'application/json',
  },
})
const { docs } = await response.json()</code></pre></div>
`
  },
  {
    id: "secprod",
    m: "Security & Logic",
    t: "Hardening & production security",
    r: ["all", "devops", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["security", "production", "rate-limiting", "csrf", "headers"],
    c: `
<p class="lead">Hardening a production Payload CMS deployment requires defense-in-depth across the network, application, authentication, and database layers.</p>

<h2>1. Strict CORS &amp; CSRF Whitelisting</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>export default buildConfig({
  // Strictly specify approved origins (avoid wildcard '*')
  cors: [
    'https://www.mywebsite.com',
    'https://admin.mywebsite.com',
  ],
  csrf: [
    'https://www.mywebsite.com',
    'https://admin.mywebsite.com',
  ],
})</code></pre></div>

<h2>2. Protecting Auth Routes with Next.js Middleware Rate Limiting</h2>
<p>Prevent credential stuffing and brute-force attacks on <code>/api/users/login</code> using Upstash Redis:</p>

<div class="cb"><div class="fn">src/middleware.ts</div><pre><code>import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 login attempts per minute
})

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api/users/login')) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts. Please wait 1 minute.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }
  return NextResponse.next()
}</code></pre></div>

<h2>Production Security Checklist</h2>
<div class="tbl"><table>
  <thead><tr><th>Area</th><th>Check</th><th>Mitigation</th></tr></thead>
  <tbody>
    <tr><td><b>Secrets</b></td><td>PAYLOAD_SECRET entropy</td><td>Use <code>openssl rand -hex 32</code>; never commit <code>.env</code> to Git.</td></tr>
    <tr><td><b>Cookies</b></td><td>Secure &amp; SameSite</td><td>Enable <code>cookies.secure: true</code> and <code>cookies.sameSite: 'lax'</code>.</td></tr>
    <tr><td><b>File Uploads</b></td><td>MIME type validation</td><td>Strictly limit <code>mimeTypes: ['image/*', 'application/pdf']</code>.</td></tr>
    <tr><td><b>Access Rules</b></td><td>Default denial</td><td>Verify every collection access function checks <code>req.user</code>.</td></tr>
    <tr><td><b>Database</b></td><td>Connection pooling</td><td>Use SSL mode (<code>sslmode=require</code>) and bounded pool sizes.</td></tr>
  </tbody>
</table></div>
`
  },
  {
    id: "uploads",
    m: "Content Features",
    t: "Media & uploads",
    r: ["all", "frontend"],
    difficulty: "intermediate",
    tags: ["media", "uploads", "images", "sharp", "s3"],
    c: `
<p class="lead">Setting <code>upload: true</code> on any collection transforms it into an asset management library with automated image resizing, focal point cropping, WebP conversion via Sharp, and Cloud Storage integration.</p>

<h2>Configuring an Upload Collection with Responsive Image Sizes</h2>
<div class="cb"><div class="fn">src/collections/Media.ts</div><pre><code>import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media', // Local development folder
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
    focalPoint: true,   // Interactive focal point UI in Admin
    crop: true,         // Interactive cropping tool
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        height: 300,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 80 } },
      },
      {
        name: 'card',
        width: 768,
        height: 432,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 85 } },
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
        formatOptions: { format: 'webp', options: { quality: 90 } },
      },
    ],
    adminThumbnail: 'thumbnail',
  },
  access: {
    read: () => true, // Publicly viewable
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Crucial for accessibility and SEO' },
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
}</code></pre></div>

<h2>Rendering Responsive Media with Next.js Image</h2>
<div class="cb"><div class="fn">src/components/MediaImage.tsx</div><pre><code>import Image from 'next/image'
import type { Media } from '@/payload-types'

export function MediaImage({
  media,
  size = 'card',
  priority = false,
}: {
  media: Media | string
  size?: 'thumbnail' | 'card' | 'hero'
  priority?: boolean
}) {
  if (typeof media === 'string' || !media?.url) return null

  const targetSize = media.sizes?.[size]
  const imageSrc = targetSize?.url || media.url
  const width = targetSize?.width || media.width || 800
  const height = targetSize?.height || media.height || 600

  return (
    &lt;Image
      src={imageSrc}
      alt={media.alt || ''}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    /&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "drafts",
    m: "Content Features",
    t: "Drafts, versions & live preview",
    r: ["all"],
    difficulty: "advanced",
    tags: ["drafts", "versions", "live-preview", "autosave"],
    c: `
<p class="lead">Payload provides enterprise-grade content staging: document versioning with rollback history, draft workflows, autosaving, scheduled publishing, and real-time Live Preview embedded directly within the admin editor.</p>

<h2>Enabling Drafts &amp; Autosave</h2>
<div class="cb"><div class="fn">src/collections/Posts.ts</div><pre><code>export const Posts: CollectionConfig = {
  slug: 'posts',
  versions: {
    maxPerDoc: 50, // Keep last 50 historical snapshots
    drafts: {
      autosave: { interval: 800 }, // Automatically save drafts every 800ms
      schedulePublish: true,      // Future scheduled publishing
    },
  },
  fields: [...],
}</code></pre></div>

<h2>Configuring Real-Time Live Preview</h2>
<p>Live Preview embeds an iframe of your actual Next.js frontend into the document editor and broadcasts live draft state changes over <code>window.postMessage</code>:</p>

<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>export default buildConfig({
  admin: {
    livePreview: {
      url: ({ data, collectionConfig }) => {
        const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return \`\${baseUrl}/\${collectionConfig.slug}/\${data.slug}?preview=true\`
      },
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      collections: ['posts', 'pages'],
    },
  },
})</code></pre></div>

<h2>Subscribing on the Frontend with <code>useLivePreview</code></h2>
<div class="cb"><div class="fn">src/app/(frontend)/blog/[slug]/PostClient.tsx</div><pre><code>'use client'
import { useLivePreview } from '@payloadcms/live-preview-react'
import type { Post } from '@/payload-types'

export function PostClient({ initialPost }: { initialPost: Post }) {
  // Automatically syncs form state from Payload Admin iframe
  const { data: post } = useLivePreview<Post>({
    initialData: initialPost,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  return (
    &lt;article className="prose max-w-3xl mx-auto"&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      {post._status === 'draft' &amp;&amp; (
        &lt;div className="badge badge-warning"&gt;Preview Mode (Draft)&lt;/div&gt;
      )}
    &lt;/article&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "richtext",
    m: "Content Features",
    t: "Rich text with Lexical",
    r: ["all", "frontend"],
    difficulty: "intermediate",
    badge: "new",
    tags: ["richtext", "lexical", "editor", "ast", "wysiwyg"],
    c: `
<p class="lead">Payload 3.x uses <strong>Lexical</strong> (Meta's modern, extensible rich text engine) by default. Content is stored as a structured JSON Abstract Syntax Tree (AST), making it type-safe, headless, and ready for custom inline blocks.</p>

<h2>Configuring the Lexical Editor</h2>
<div class="cb"><div class="fn">src/collections/Posts.ts</div><pre><code>import { lexicalEditor, HeadingFeature, LinkFeature, UploadFeature, BlocksFeature } from '@payloadcms/richtext-lexical'

export const Posts: CollectionConfig = {
  slug: 'posts',
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          LinkFeature({
            fields: [
              { name: 'rel', type: 'select', options: ['nofollow', 'sponsored'] },
            ],
          }),
          UploadFeature({
            collections: {
              media: {
                fields: [{ name: 'caption', type: 'text' }],
              },
            },
          }),
          BlocksFeature({
            blocks: [
              // Embed custom React UI blocks inside editorial copy!
            ],
          }),
        ],
      }),
    },
  ],
}</code></pre></div>

<h2>Rendering Lexical Content in Next.js Server Components</h2>
<div class="cb"><div class="fn">src/app/(frontend)/blog/[slug]/page.tsx</div><pre><code>import { RichText } from '@payloadcms/richtext-lexical/react'

export default async function SinglePost({ post }) {
  return (
    &lt;article className="prose"&gt;
      &lt;RichText data={post.content} /&gt;
    &lt;/article&gt;
  )
}</code></pre></div>
`
  },
  {
    id: "nesteddocs",
    m: "Content Features",
    t: "Nested documents & tree structures",
    r: ["all", "backend"],
    difficulty: "advanced",
    badge: "new",
    tags: ["nested-docs", "tree", "breadcrumbs", "hierarchy"],
    c: `
<p class="lead">Hierarchical content structures (such as nested documentation pages, multi-level category trees, and breadcrumb trails) are seamlessly managed using the official <code>@payloadcms/plugin-nested-docs</code> plugin.</p>

<h2>Configuring the Nested Docs Plugin</h2>
<div class="cb"><div class="fn">src/payload.config.ts</div><pre><code>import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'

export default buildConfig({
  plugins: [
    nestedDocsPlugin({
      collections: ['pages', 'categories'],
      generateLabel: (_, doc) => doc.title as string,
      generateURL: (docs) => docs.reduce((url, doc) => \`\${url}/\${doc.slug}\`, ''),
    }),
  ],
})</code></pre></div>

<p>The plugin automatically injects a <code>parent</code> relationship field and auto-computes a <code>breadcrumbs</code> array on every document update:</p>

<div class="cb"><div class="fn">Breadcrumbs Data Shape</div><pre><code>{
  "title": "Authentication Strategies",
  "slug": "auth-strategies",
  "breadcrumbs": [
    { "label": "Documentation", "url": "/docs" },
    { "label": "Security", "url": "/docs/security" },
    { "label": "Authentication Strategies", "url": "/docs/security/auth-strategies" }
  ]
}</code></pre></div>
`
  }
];
